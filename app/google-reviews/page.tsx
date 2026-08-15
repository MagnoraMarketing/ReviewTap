import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/current-user";
import { PlatformLandingPage } from "@/components/marketing/PlatformLandingPage";
import { getPlatformLandingContent } from "@/lib/platform-landing-content";

const content = getPlatformLandingContent("google-reviews")!;

export const metadata: Metadata = {
  title: content.seoTitle,
  description: content.seoDescription,
  alternates: { canonical: "/google-reviews" },
  openGraph: {
    title: content.seoTitle,
    description: content.seoDescription,
    url: "/google-reviews",
    type: "website",
  },
};

export default async function GoogleReviewsPage() {
  const currentUser = await getCurrentUser();
  return <PlatformLandingPage content={content} isLoggedIn={Boolean(currentUser)} />;
}
