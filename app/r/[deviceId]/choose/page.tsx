import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getRedirectTarget } from "@/lib/redirect-target";
import { Logo } from "@/components/ui/Logo";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { ShareButton } from "@/components/shop/ShareButton";
import { DESTINATION_LABELS } from "@/lib/display";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { deviceId: string };
}): Promise<Metadata> {
  const target = await getRedirectTarget(params.deviceId?.toUpperCase());
  return {
    title: target?.businessName ? `Leave a review for ${target.businessName}` : "Leave a review",
    robots: { index: false },
  };
}

export default async function ChooseDestinationPage({
  params,
}: {
  params: { deviceId: string };
}) {
  const publicId = params.deviceId?.toUpperCase();
  const target = await getRedirectTarget(publicId);

  if (!target) {
    redirect("/r/status?reason=not-found");
  }
  if (target.deviceStatus !== "ACTIVE" || !target.subscriptionActive || target.devicePlan !== "PRO") {
    redirect("/r/status?reason=not-configured");
  }

  const enabled = target.destinations.filter((d) => d.enabled && d.url);
  if (enabled.length === 0) {
    redirect("/r/status?reason=not-configured");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const shareUrl = `${appUrl}/r/${publicId}/choose`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <Logo className="mb-8 text-lg" />
      <div className="card w-full max-w-sm text-center">
        <h1 className="text-lg font-semibold text-ink-900">
          {target.businessName ? `Leave a review for ${target.businessName}` : "Leave a review"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">Choose where you&apos;d like to leave it.</p>

        <div className="mt-6 space-y-2">
          {enabled.map((destination) => (
            <a
              key={destination.type}
              href={`/r/${publicId}/go/${destination.type}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 text-left transition-colors hover:border-brand-500 hover:bg-brand-50"
            >
              <PlatformIcon type={destination.type} />
              <span className="font-medium text-ink-900">{DESTINATION_LABELS[destination.type]}</span>
            </a>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <ShareButton url={shareUrl} title="Leave us a review" />
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-400">Powered by ReviewTap</p>
    </div>
  );
}
