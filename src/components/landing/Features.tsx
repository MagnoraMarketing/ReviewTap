import { Container } from "@/components/ui/Container";

const features = [
  { title: "NFC tap", body: "Tap-to-open on any modern smartphone, no app needed." },
  { title: "QR scan", body: "A backup QR code encoding the exact same dynamic link." },
  { title: "Google Reviews", body: "Send taps straight to your Google Business review form." },
  { title: "Facebook", body: "Point customers to your Facebook Page reviews." },
  { title: "Trustpilot", body: "Point customers to your Trustpilot review page." },
  { title: "Tripadvisor", body: "Great for hospitality, travel and food & beverage businesses." },
  { title: "Pro chooser + share", body: "Let visitors pick their platform and share the page onward." },
  { title: "Analytics", body: "See review visits over time, by day and by destination." },
  { title: "Dynamic links", body: "Change the destination anytime — the card stays the same." },
  { title: "Dashboard", body: "Manage devices, destinations and billing in one place." },
];

export function Features() {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink-900">Everything you need</h2>
          <p className="mt-3 text-gray-500">Built for busy front-of-house teams, not IT departments.</p>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="card">
              <h3 className="text-sm font-semibold text-ink-900">{feature.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{feature.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
