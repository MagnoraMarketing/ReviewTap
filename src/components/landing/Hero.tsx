import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DESTINATION_COLORS, DESTINATION_LABELS } from "@/lib/display";
import { DESTINATION_TYPES } from "@/lib/validation";

export function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">
      <Container className="grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          <span className="badge bg-brand-50 text-brand-700">NFC + QR review cards</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
            One card. Every platform.
            <br />
            Full control.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-gray-600">
            One NFC tap or QR scan sends customers directly to Google, Facebook, Trustpilot or
            Tripadvisor — and you manage everything from one dashboard.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {DESTINATION_TYPES.filter((type) => type !== "CUSTOM_URL").map((type) => (
              <span key={type} className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: DESTINATION_COLORS[type] }}
                  aria-hidden
                />
                {DESTINATION_LABELS[type]}
              </span>
            ))}
          </div>

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

        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/marketing/reviewtap-pro-solution.png"
            alt="A ReviewTap multi-card and dashboard: visitors choose their platform, you manage links and see every scan from your dashboard"
            className="w-full"
          />
        </div>
      </Container>
    </section>
  );
}
