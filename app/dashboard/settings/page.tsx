import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { SettingsForm } from "./SettingsForm";

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
        <h2 className="text-sm font-semibold text-ink-900">Account</h2>
        <p className="mt-2 text-sm text-gray-500">{currentUser.email}</p>
      </div>
    </div>
  );
}
