import { requireAdminUser } from "@/lib/require-admin";
import { DeviceMockup } from "@/components/shop/DeviceMockup";
import { PlatformCardMockup } from "@/components/shop/PlatformCardMockup";
import { DESTINATION_TYPES } from "@/lib/validation";
import type { DestinationType } from "@/types/database";

export const metadata = { title: "Admin · Products" };

const CARD_PLATFORMS: DestinationType[] = DESTINATION_TYPES.filter(
  (t) => t !== "CUSTOM_URL",
) as DestinationType[];

export default async function AdminProductsPage() {
  await requireAdminUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink-900">Product imagery</h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Reference mockups for marketing and print — hardware form factors, single-platform Basic
        cards, and the multi-platform Pro solution.
      </p>

      <div className="card mt-6">
        <h2 className="text-sm font-semibold text-ink-900">Pro solution (multi-platform + dashboard)</h2>
        <p className="mt-1 text-xs text-gray-400">
          Shows the chooser experience alongside the dashboard: platform selection and admin-visible
          stats.
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marketing/reviewtap-pro-solution.png"
            alt="ReviewTap Pro solution: multi-platform card and dashboard"
            className="w-full"
          />
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-sm font-semibold text-ink-900">Hardware form factors</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-xl border border-gray-100 p-6">
            <DeviceMockup variant="STANDEE_CARD" className="h-40 w-40" />
            <p className="mt-3 text-sm font-medium text-ink-900">Standee Card</p>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-gray-100 p-6">
            <DeviceMockup variant="DESK_TILE" className="h-40 w-40" />
            <p className="mt-3 text-sm font-medium text-ink-900">Desk Tile</p>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="text-sm font-semibold text-ink-900">Basic plan — single-platform cards</h2>
        <p className="mt-1 text-xs text-gray-400">
          One fixed platform per card, printed to order once a customer sets their Basic destination.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARD_PLATFORMS.map((type) => (
            <div key={type} className="rounded-xl border border-gray-100 p-4">
              <PlatformCardMockup type={type} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
