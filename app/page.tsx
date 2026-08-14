import { getCurrentUser } from "@/lib/current-user";
import { LandingHeader } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { CookieBanner } from "@/components/landing/CookieBanner";

export default async function LandingPage() {
  const currentUser = await getCurrentUser();

  return (
    <div>
      <LandingHeader isLoggedIn={Boolean(currentUser)} />
      <Hero isLoggedIn={Boolean(currentUser)} />
      <HowItWorks />
      <Features />
      <Pricing />
      <Faq />
      <Footer />
      <CookieBanner />
    </div>
  );
}
