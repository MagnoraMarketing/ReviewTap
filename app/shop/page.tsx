import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { DEVICE_LIMIT_BY_PLAN } from "@/lib/display";
import { ShopClient } from "./ShopClient";

export const metadata = { title: "Choose your ReviewTap" };

export default async function ShopPage() {
  const currentUser = await getCurrentUser();

  let existingDeviceCount = 0;
  if (currentUser) {
    const supabase = createClient();
    const { count } = await supabase
      .from("devices")
      .select("id", { count: "exact", head: true })
      .eq("user_id", currentUser.id);
    existingDeviceCount = count ?? 0;
  }
  const plan = currentUser?.subscription?.plan ?? "BASIC";
  const deviceLimit = DEVICE_LIMIT_BY_PLAN[plan];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/">
            <Logo className="text-base" />
          </Link>
          {currentUser && (
            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-ink-900">
              Dashboard
            </Link>
          )}
        </Container>
      </header>

      <Container className="max-w-4xl py-12">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Choose your ReviewTap</h1>
          <p className="mx-auto mt-2 max-w-xl text-gray-500">
            Pick the design that fits your counter or desk. Both work identically — NFC tap or QR
            scan, sent to whichever platform you choose.
          </p>
        </div>

        <div className="mt-10">
          <ShopClient
            isLoggedIn={Boolean(currentUser)}
            existingDeviceCount={existingDeviceCount}
            deviceLimit={deviceLimit}
          />
        </div>
      </Container>
    </div>
  );
}
