import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="13 August 2026">
      <p>
        ReviewTap (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides physical NFC/QR review devices and a
        dashboard that lets business owners control where those devices redirect visitors. This
        policy explains what personal data we process, why, and the choices you have.
      </p>

      <h2 className="text-base font-semibold text-ink-900">1. Data we collect about business owners</h2>
      <p>
        When you create a ReviewTap account we store your email address, business name, contact
        name and phone number (if provided), and billing information handled by Stripe (we never
        see or store your card details).
      </p>

      <h2 className="text-base font-semibold text-ink-900">2. Data we collect about review-link visitors</h2>
      <p>
        When someone taps an NFC card or scans a QR code linked to ReviewTap, we record a single
        &ldquo;scan&rdquo; event so business owners can see how often their review link is being
        used. Specifically, for each scan we store:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Timestamp of the visit</li>
        <li>Which destination platform the visitor was sent to</li>
        <li>Browser user-agent and device type (mobile / tablet / desktop), used only for aggregate stats</li>
        <li>Referrer header, if present</li>
        <li>Approximate country and city, when available from our hosting provider&apos;s edge network — never derived from your IP address by us</li>
      </ul>
      <p>
        <strong>We do not store IP addresses.</strong> Visitor IP addresses are used only
        transiently, in memory, to apply rate limiting against abuse of the redirect endpoint, and
        are discarded immediately after — never written to our database.
      </p>
      <p>
        Because the same physical link is used for both NFC taps and QR scans, we cannot always
        reliably tell which method a visitor used. We record these as scan type &ldquo;unknown&rdquo;
        rather than guessing, and we never claim more precision than we actually have.
      </p>
      <p>
        Visiting a review link does not create an account and is not linked to any visitor
        identity we hold — scan records are associated only with the device (and therefore the
        business owner), not with an individual visitor.
      </p>

      <h2 className="text-base font-semibold text-ink-900">3. What we don&apos;t do</h2>
      <p>
        We do not sell personal data. We do not use advertising trackers or third-party analytics
        pixels on review-link redirects. We do not claim that a review visit equals a submitted
        review — we only know that a visitor was redirected to the platform you selected.
      </p>

      <h2 className="text-base font-semibold text-ink-900">4. Legal basis and retention</h2>
      <p>
        We process business-owner account data to perform our contract with you (providing the
        ReviewTap service) and scan data on the basis of our legitimate interest in providing
        analytics to business owners. Scan records are retained for as long as your account and
        associated device remain active, and deleted when a device or account is deleted.
      </p>

      <h2 className="text-base font-semibold text-ink-900">5. Sub-processors</h2>
      <p>
        We use Supabase (database &amp; authentication, EU-hosted where available) and Stripe
        (payments) as sub-processors. Both are contractually bound to process data only as
        instructed and in line with applicable data protection law.
      </p>

      <h2 className="text-base font-semibold text-ink-900">6. Your rights</h2>
      <p>
        If you are in the EEA/UK, you have the right to access, correct, export or delete your
        personal data, and to object to certain processing. Contact us to exercise these rights.
      </p>

      <h2 className="text-base font-semibold text-ink-900">7. Contact</h2>
      <p>For any privacy questions, please contact us through your account&apos;s support channel.</p>
    </LegalLayout>
  );
}
