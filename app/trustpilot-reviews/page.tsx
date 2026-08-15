import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/current-user";
import { PlatformLandingPage } from "@/components/marketing/PlatformLandingPage";
import { getPlatformLandingContent } from "@/lib/platform-landing-content";

const content = getPlatformLandingContent("trustpilot-reviews")!;

export const metadata: Metadata = {
  title: content.seoTitle,
  description: content.seoDescription,
  alternates: { canonical: "/trustpilot-reviews" },
  openGraph: {
    title: content.seoTitle,
    description: content.seoDescription,
    url: "/trustpilot-reviews",
    type: "website",
  },
};

export default async function TrustpilotReviewsPage() {
  const currentUser = await getCurrentUser();
  return <PlatformLandingPage content={content} isLoggedIn={Boolean(currentUser)} />;
}
