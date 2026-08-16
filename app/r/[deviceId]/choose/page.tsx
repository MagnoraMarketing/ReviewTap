import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getRedirectTarget } from "@/lib/redirect-target";
import { Logo } from "@/components/ui/Logo";
import { ShareButton } from "@/components/shop/ShareButton";
import { DestinationChooserList } from "@/components/redirect/DestinationChooserList";
import { RatingFeedback } from "@/components/redirect/RatingFeedback";

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

  const accentColor = target.accentColor ?? undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
      {target.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={target.logoUrl} alt={target.businessName ?? "Logo"} className="mb-8 h-10 max-w-[200px] object-contain" />
      ) : (
        <Logo className="mb-8 text-lg" />
      )}
      <div
        className="card w-full max-w-sm border-t-4 text-center"
        style={{ borderTopColor: accentColor ?? "#e5e7eb" }}
      >
        <h1 className="text-lg font-semibold text-ink-900">
          {target.businessName ? `Leave a review for ${target.businessName}` : "Leave a review"}
        </h1>
        {target.welcomeMessage && <p className="mt-1 text-sm text-gray-500">{target.welcomeMessage}</p>}

        <div className="mt-4 border-b border-gray-100 pb-5">
          <RatingFeedback publicId={publicId} accentColor={accentColor} thankYouMessage={target.thankYouMessage} />
        </div>

        <p className="mt-5 text-sm text-gray-500">
          {enabled.length > 1
            ? "Choose where you'd like to leave a review — feel free to pick more than one."
            : "Choose where you'd like to leave it."}
        </p>

        <DestinationChooserList publicId={publicId} destinations={enabled.map((d) => d.type)} />

        <div className="mt-6 border-t border-gray-100 pt-6">
          <ShareButton url={shareUrl} title="Leave us a review" />
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-400">Powered by ReviewTap</p>
    </div>
  );
}
