import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="13 August 2026">
      <h2 className="text-base font-semibold text-ink-900">1. The service</h2>
      <p>
        ReviewTap sells a physical NFC/QR review device for a one-time fee, and provides a
        dashboard and dynamic redirect service under a monthly subscription (&ldquo;ReviewTap
        Pro&rdquo;). Your NFC chip and QR code contain a permanent ReviewTap link; the destination
        that link redirects to is controlled from your dashboard and can be changed at any time.
      </p>

      <h2 className="text-base font-semibold text-ink-900">2. Fees and billing</h2>
      <p>
        The device fee (€50) is a one-time, non-recurring charge. ReviewTap Pro (€20/month) is a
        recurring subscription billed monthly via Stripe until cancelled. All payments are
        processed by Stripe; we do not store your card details.
      </p>

      <h2 className="text-base font-semibold text-ink-900">3. Active subscription required</h2>
      <p>
        Your ReviewTap link only redirects visitors to your chosen destination while your
        subscription is active. If your subscription lapses (cancelled, unpaid, or payment
        failure), visitors will see a professional &ldquo;currently inactive&rdquo; page instead of
        being redirected. We will never redirect your customers to a different business&apos;s
        review page.
      </p>

      <h2 className="text-base font-semibold text-ink-900">4. Acceptable use</h2>
      <p>
        You agree to only set destination URLs that you are authorized to direct customers to, and
        not to use ReviewTap to redirect visitors to unlawful, deceptive, or harmful content. We
        reserve the right to suspend a device that violates this policy.
      </p>

      <h2 className="text-base font-semibold text-ink-900">5. Review visits, not reviews</h2>
      <p>
        ReviewTap measures &ldquo;review visits&rdquo; — visitors who tapped or scanned and were
        redirected to your chosen review platform. We do not have access to whether a visitor
        actually submitted a review, and make no such claim.
      </p>

      <h2 className="text-base font-semibold text-ink-900">6. Cancellation</h2>
      <p>
        You may cancel your subscription at any time via the Stripe Customer Portal, accessible
        from Dashboard → Billing. Cancellation takes effect at the end of the current billing
        period.
      </p>

      <h2 className="text-base font-semibold text-ink-900">7. Liability</h2>
      <p>
        The service is provided &ldquo;as is&rdquo;. We are not liable for indirect or
        consequential losses arising from use of the service, to the maximum extent permitted by
        law.
      </p>

      <h2 className="text-base font-semibold text-ink-900">8. Changes</h2>
      <p>We may update these terms from time to time; continued use of ReviewTap constitutes acceptance of the updated terms.</p>
    </LegalLayout>
  );
}
