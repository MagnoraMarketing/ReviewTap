import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { SettingsForm } from "./SettingsForm";
import { BrandingForm } from "./BrandingForm";
import { DeleteAccountButton } from "./DeleteAccountButton";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/dashboard/settings");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Update your business and contact details.</p>

      <div className="card mt-6 max-w-lg">
        <SettingsForm profile={currentUser.profile} />
      </div>

      <div className="card mt-6 max-w-lg">
        <h2 className="text-sm font-semibold text-ink-900">Guest page branding</h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize the Pro chooser page visitors land on when they tap or scan.
        </p>
        <div className="mt-4">
          <BrandingForm profile={currentUser.profile} />
        </div>
      </div>

      <div className="card mt-6 max-w-lg">
        <h2 className="text-sm font-semibold text-ink-900">Account</h2>
        <p className="mt-2 text-sm text-gray-500">{currentUser.email}</p>
        <div className="mt-4">
          <a href="/api/account/export" className="btn-secondary">
            Export my data
          </a>
        </div>
      </div>

      <div className="card mt-6 max-w-lg border-red-100">
        <h2 className="text-sm font-semibold text-ink-900">Danger zone</h2>
        <p className="mt-1 text-xs text-gray-400">
          Permanently deletes your account, profile, devices, scan history and feedback. Your
          physical NFC tags and QR codes stop working immediately. This cannot be undone.
        </p>
        <div className="mt-3">
          <DeleteAccountButton email={currentUser.email} />
        </div>
      </div>
    </div>
  );
}
