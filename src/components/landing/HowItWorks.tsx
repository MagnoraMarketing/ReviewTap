import { Container } from "@/components/ui/Container";

const steps = [
  {
    number: "01",
    title: "Tap or scan",
    body: "A customer taps their phone on your NFC card, or scans the QR code — no app required.",
  },
  {
    number: "02",
    title: "Choose your review platform",
    body: "You decide in your dashboard whether taps go to Google, Trustpilot, Tripadvisor or a custom link.",
  },
  {
    number: "03",
    title: "Get more review visits",
    body: "Customers land on your review page in one tap, right when the experience is freshest in their mind.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-900">How it works</h2>
          <p className="mt-3 text-gray-500">
            The physical card never changes. Everything else is fully controlled from ReviewTap.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-900">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
