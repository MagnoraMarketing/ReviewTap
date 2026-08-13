import { NextResponse, type NextRequest } from "next/server";
import { getRedirectTarget } from "@/lib/redirect-target";
import { recordScan } from "@/lib/record-scan";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Keep this route as light as possible: no auth/session middleware (see
// middleware.ts matcher), no rendering for the common (Basic) case, and a
// single RPC round trip for the device+subscription lookup.
export const runtime = "edge";
export const dynamic = "force-dynamic";

function statusRedirect(request: NextRequest, reason: string) {
  const url = new URL("/r/status", request.url);
  url.searchParams.set("reason", reason);
  return NextResponse.redirect(url, { status: 302 });
}

export async function GET(request: NextRequest, { params }: { params: { deviceId: string } }) {
  const publicId = params.deviceId?.toUpperCase();

  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`redirect:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const target = publicId ? await getRedirectTarget(publicId) : null;
  if (!target) {
    return statusRedirect(request, "not-found");
  }

  if (target.deviceStatus === "SUSPENDED") {
    return statusRedirect(request, "suspended");
  }
  if (target.deviceStatus === "PAUSED") {
    return statusRedirect(request, "paused");
  }
  if (!target.subscriptionActive) {
    return statusRedirect(request, "subscription");
  }

  if (target.devicePlan === "PRO") {
    const hasAnyDestination = target.destinations.some((d) => d.enabled && d.url);
    if (!hasAnyDestination) {
      return statusRedirect(request, "not-configured");
    }
    // Record the landing visit (no platform chosen yet - that's a separate
    // event recorded by /r/[deviceId]/go/[type] once the visitor picks one).
    await recordScan(target.deviceId, null, request.headers);
    return NextResponse.redirect(new URL(`/r/${publicId}/choose`, request.url), { status: 302 });
  }

  if (!target.destinationUrl) {
    return statusRedirect(request, "not-configured");
  }

  await recordScan(target.deviceId, target.destinationType, request.headers);
  return NextResponse.redirect(target.destinationUrl, { status: 302 });
}
