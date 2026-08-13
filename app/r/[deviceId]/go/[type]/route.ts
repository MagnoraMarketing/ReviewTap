import { NextResponse, type NextRequest } from "next/server";
import { getRedirectTarget } from "@/lib/redirect-target";
import { recordScan } from "@/lib/record-scan";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { DESTINATION_TYPES } from "@/lib/validation";
import type { DestinationType } from "@/types/database";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function statusRedirect(request: NextRequest, reason: string) {
  const url = new URL("/r/status", request.url);
  url.searchParams.set("reason", reason);
  return NextResponse.redirect(url, { status: 302 });
}

/**
 * Records which platform a visitor picked on the Pro chooser page, then
 * redirects them there. Re-checks device/subscription status itself rather
 * than trusting anything from the chooser page request.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { deviceId: string; type: string } },
) {
  const publicId = params.deviceId?.toUpperCase();
  const requestedType = params.type?.toUpperCase() as DestinationType;

  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`redirect-go:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  if (!(DESTINATION_TYPES as readonly string[]).includes(requestedType)) {
    return statusRedirect(request, "not-found");
  }

  const target = publicId ? await getRedirectTarget(publicId) : null;
  if (!target) return statusRedirect(request, "not-found");
  if (target.deviceStatus === "SUSPENDED") return statusRedirect(request, "suspended");
  if (target.deviceStatus === "PAUSED") return statusRedirect(request, "paused");
  if (!target.subscriptionActive) return statusRedirect(request, "subscription");
  if (target.devicePlan !== "PRO") return statusRedirect(request, "not-found");

  const destination = target.destinations.find((d) => d.type === requestedType);
  if (!destination || !destination.enabled || !destination.url) {
    return statusRedirect(request, "not-configured");
  }

  await recordScan(target.deviceId, requestedType, request.headers);
  return NextResponse.redirect(destination.url, { status: 302 });
}
