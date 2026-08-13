import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-900">Simple pricing</h2>
          <p className="mt-3 text-gray-500">
            One card, bought once. An app subscription — recommended — powers the link.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-2xl">
          <div className="card text-center">
            <p className="text-sm font-semibold text-gray-500">ReviewTap device</p>
            <p className="mt-2 text-4xl font-semibold text-ink-900">
              €50 <span className="text-base font-normal text-gray-400">one-time</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Standee Card or Desk Tile, with NFC chip + printed QR code. Can be bought on its own.
            </p>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-gray-500">
          Plus a monthly app subscription — <strong>recommended</strong> so you can set up your link
          and see statistics:
        </p>

        <div className="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="card">
            <p className="text-sm font-semibold text-gray-500">Basic</p>
            <p className="mt-2 text-4xl font-semibold text-ink-900">
              €10 <span className="text-base font-normal text-gray-400">/ month</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>• One fixed review platform</li>
              <li>• Change destination anytime</li>
              <li>• Full analytics dashboard</li>
              <li>• Cancel anytime via Stripe</li>
            </ul>
          </div>
          <div className="card border-brand-500 ring-1 ring-brand-500">
            <p className="text-sm font-semibold text-brand-600">Pro</p>
            <p className="mt-2 text-4xl font-semibold text-ink-900">
              €20 <span className="text-base font-normal text-gray-400">/ month</span>
            </p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>• Visitors choose their platform at scan time</li>
              <li>• Built-in share button</li>
              <li>• Multi-platform analytics</li>
              <li>• Cancel anytime via Stripe</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/shop" className="btn-primary px-6 py-3 text-base">
            Get ReviewTap – €50
          </Link>
        </div>
      </Container>
    </section>
  );
}
