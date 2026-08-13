import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DeviceMockup } from "@/components/shop/DeviceMockup";

export function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">
      <Container className="grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          <span className="badge bg-brand-50 text-brand-700">NFC + QR review cards</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            Turn every customer into a review.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-gray-600">
            One NFC tap or QR scan sends customers directly to Google, Trustpilot or Tripadvisor —
            and you manage everything from one dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn-primary justify-center px-6 py-3 text-base">
              Get your ReviewTap – €50
            </Link>
            <a href="#how-it-works" className="btn-secondary justify-center px-6 py-3 text-base">
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            €50 one-time device fee + €20/month to keep your dynamic link active.
          </p>
        </div>
        <div className="flex justify-center gap-6">
          <DeviceMockup variant="STANDEE_CARD" className="h-56 w-56 drop-shadow-xl sm:h-64 sm:w-64" />
          <DeviceMockup
            variant="DESK_TILE"
            className="mt-10 h-48 w-48 drop-shadow-xl sm:h-56 sm:w-56"
          />
        </div>
      </Container>
    </section>
  );
}
