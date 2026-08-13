import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { OnboardingWizard } from "./OnboardingWizard";

export const metadata = { title: "Welcome to ReviewTap" };

export default async function OnboardingPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/onboarding");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <Container className="flex h-16 items-center">
          <Link href="/">
            <Logo className="text-base" />
          </Link>
        </Container>
      </header>
      <Container className="flex max-w-xl flex-col justify-center py-16">
        <OnboardingWizard />
      </Container>
    </div>
  );
}
