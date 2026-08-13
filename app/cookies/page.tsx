import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="13 August 2026">
      <p>
        ReviewTap uses a minimal set of cookies — only what&apos;s strictly necessary to run the
        service. We do not use advertising, tracking, or third-party analytics cookies.
      </p>

      <h2 className="text-base font-semibold text-ink-900">Strictly necessary cookies</h2>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2 pr-4 font-semibold text-ink-900">Cookie</th>
            <th className="py-2 pr-4 font-semibold text-ink-900">Purpose</th>
            <th className="py-2 font-semibold text-ink-900">Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-2 pr-4">sb-access-token / sb-refresh-token</td>
            <td className="py-2 pr-4">Keeps you signed in to your ReviewTap dashboard</td>
            <td className="py-2">Session / up to 7 days</td>
          </tr>
        </tbody>
      </table>

      <p>
        We also store one item in your browser&apos;s local storage (not a cookie) to remember that
        you&apos;ve dismissed the cookie notice.
      </p>

      <h2 className="text-base font-semibold text-ink-900">Scan tracking is not a cookie</h2>
      <p>
        When someone taps or scans a ReviewTap device, we record a single visit event
        server-side — this does not set any cookie on the visitor&apos;s device and does not track
        them across other sites. See our{" "}
        <a href="/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </a>{" "}
        for details on exactly what scan data is collected.
      </p>
    </LegalLayout>
  );
}
