import { Container } from "@/components/ui/Container";

const faqs = [
  {
    q: "Do I need to replace the NFC chip when I change review platform?",
    a: "No. Your NFC chip uses a permanent ReviewTap link. Changing the destination happens entirely in your dashboard — the physical chip and QR code never change.",
  },
  {
    q: "Can I use both NFC and QR?",
    a: "Yes. Every ReviewTap card includes both an NFC chip and a printed QR code, and they point to the exact same dynamic link.",
  },
  {
    q: "Can I change from Google to Trustpilot?",
    a: "Yes. Change the destination from your dashboard at any time — Google Reviews, Trustpilot, Tripadvisor or a custom URL.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "Your ReviewTap link will show a professional \"currently inactive\" page to visitors until you reactivate. We never redirect your customers to a different company's review page.",
  },
  {
    q: "Does ReviewTap guarantee people leave a review?",
    a: "No. ReviewTap tracks review visits — people who tapped or scanned and were sent to your review page. We don't claim to know whether a review was actually submitted.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-gray-50 py-20">
      <Container className="max-w-3xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink-900">
          Frequently asked questions
        </h2>
        <div className="mt-12 divide-y divide-gray-200">
          {faqs.map((faq) => (
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
  );
}
