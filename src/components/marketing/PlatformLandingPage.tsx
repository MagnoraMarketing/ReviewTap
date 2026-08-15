import Link from "next/link";
import { LandingHeader } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CookieBanner } from "@/components/landing/CookieBanner";
import { Container } from "@/components/ui/Container";
import { PlatformCardMockup } from "@/components/shop/PlatformCardMockup";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { DESTINATION_TYPES } from "@/lib/validation";
import { DESTINATION_COLORS, DESTINATION_LABELS } from "@/lib/display";
import type { PlatformLandingContent } from "@/lib/platform-landing-content";

/**
 * Shared template for the per-platform SEO landing pages (see
 * app/google-reviews, app/trustpilot-reviews, app/facebook-reviews,
 * app/tripadvisor-reviews). Content differs per platform via `content`;
 * layout/structure stays consistent so these read as one family of pages.
 */
export function PlatformLandingPage({
  content,
  isLoggedIn,
}: {
  content: PlatformLandingContent;
  isLoggedIn: boolean;
}) {
  const color = DESTINATION_COLORS[content.type];
  const otherPlatforms = DESTINATION_TYPES.filter(
    (type) => type !== content.type && type !== "CUSTOM_URL",
  );

  return (
    <div>
      <LandingHeader isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <span
                className="badge"
                style={{ backgroundColor: `${color}1a`, color }}
              >
                {content.heroEyebrow}
              </span>
              <span className="badge bg-emerald-50 text-emerald-700">Free account · Pay only while active</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
              {content.heroHeadline}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-gray-600">{content.heroSubheadline}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary justify-center px-6 py-3 text-base">
                  Go to dashboard
                </Link>
              ) : (
                <Link href="/signup" className="btn-primary justify-center px-6 py-3 text-base">
                  Create your free account
                </Link>
              )}
              <Link href="/shop" className="btn-secondary justify-center px-6 py-3 text-base">
                Get a ReviewTap card – €50
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Configuring your {content.name} link is free — you only pay once your device is
              active (from €10/month), and can cancel anytime.
            </p>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <PlatformCardMockup type={content.type} className="w-full drop-shadow-xl" />
          </div>
        </Container>
      </section>

      {/* Why it matters (SEO body copy) */}
      <section className="py-20">
        <Container className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-900">
            {content.whyItMattersTitle}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600">
            {content.whyItMattersParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900">
              How it works for {content.name}
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {content.howItWorksSteps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits grid */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900">
              Built for collecting {content.name} reviews
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.benefits.map((benefit) => (
              <div key={benefit.title} className="card">
                <h3 className="text-sm font-semibold text-ink-900">{benefit.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{benefit.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Multi-platform / Pro upsell */}
      <section className="bg-ink-900 py-20 text-white">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="badge bg-white/10 text-white">Pro plan</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Want reviews on more than just {content.name}?
            </h2>
            <p className="mt-4 text-gray-300">
              With Pro, the same card doesn&apos;t just collect {content.name} reviews — visitors
              land on a chooser page and pick whichever platform they prefer:{" "}
              {otherPlatforms.map((type, i) => (
                <span key={type}>
                  {i > 0 && (i === otherPlatforms.length - 1 ? " and " : ", ")}
                  {DESTINATION_LABELS[type]}
                </span>
              ))}
              , alongside {content.name}. That means more total reviews spread across more
              platforms, from the exact same physical card.
            </p>
            <p className="mt-4 text-gray-300">
              Your dashboard then gives you one overview across every platform — which one gets
              chosen most, how visits trend over time, and where to focus next — instead of
              checking each platform separately.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="btn-primary justify-center px-6 py-3 text-base">
                Create your free account
              </Link>
              <Link
                href="/#pricing"
                className="justify-center rounded-full border border-white/30 px-6 py-3 text-center text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                Compare Basic vs Pro
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold text-white/70">Visitors choose their platform</p>
            <div className="mt-4 space-y-2">
              {DESTINATION_TYPES.filter((type) => type !== "CUSTOM_URL").map((type) => (
                <div
                  key={type}
                  className={`flex items-center gap-3 rounded-xl border p-3 ${
                    type === content.type ? "border-white/40 bg-white/10" : "border-white/10"
                  }`}
                >
                  <PlatformIcon type={type} />
                  <span className="text-sm font-medium text-white">{DESTINATION_LABELS[type]}</span>
                  {type === content.type && (
                    <span className="ml-auto text-xs font-medium text-white/60">This page</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-20">
        <Container className="max-w-3xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink-900">
            {content.name} reviews — frequently asked questions
          </h2>
          <div className="mt-12 divide-y divide-gray-200">
            {content.faqs.map((faq) => (
              <details key={faq.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-left text-sm font-semibold text-ink-900">
                  {faq.q}
                  <span className="ml-4 text-gray-400 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-500">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* Other platforms internal links */}
      <section className="py-16">
        <Container className="max-w-3xl text-center">
          <p className="text-sm font-semibold text-gray-400">Also collecting reviews elsewhere?</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {PLATFORM_PAGE_LINKS.filter((p) => p.slug !== content.slug).map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="btn-secondary text-sm">
                {p.name} reviews →
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <Container className="max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-900">
            Start collecting more {content.name} reviews
          </h2>
          <p className="mt-3 text-gray-500">
            Create your free account, configure your {content.name} link, and preview the whole
            flow before you ever pay for anything.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
                Go to dashboard
              </Link>
            ) : (
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Create your free account
              </Link>
            )}
            <Link href="/shop" className="btn-secondary px-6 py-3 text-base">
              Get a ReviewTap card – €50
            </Link>
          </div>
        </Container>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
}

const PLATFORM_PAGE_LINKS = [
  { slug: "google-reviews", name: "Google" },
  { slug: "trustpilot-reviews", name: "Trustpilot" },
  { slug: "facebook-reviews", name: "Facebook" },
  { slug: "tripadvisor-reviews", name: "Tripadvisor" },
];
