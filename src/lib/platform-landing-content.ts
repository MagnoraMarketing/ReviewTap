import type { DestinationType } from "@/types/database";

export interface PlatformFaq {
  q: string;
  a: string;
}

export interface PlatformLandingContent {
  slug: string;
  type: DestinationType;
  name: string;
  /** <title> and H1 keyword focus. */
  seoTitle: string;
  seoDescription: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  /** SEO body copy explaining why this platform matters for the business. */
  whyItMattersTitle: string;
  whyItMattersParagraphs: string[];
  howItWorksSteps: { title: string; body: string }[];
  benefits: { title: string; body: string }[];
  faqs: PlatformFaq[];
}

export const PLATFORM_LANDING_PAGES: PlatformLandingContent[] = [
  {
    slug: "google-reviews",
    type: "GOOGLE_REVIEWS",
    name: "Google Reviews",
    seoTitle: "Get More Google Reviews with a QR Code & NFC Card",
    seoDescription:
      "Turn every customer visit into a Google review. Tap or scan a ReviewTap card to open your Google Business Profile review form instantly — no app, no typing a URL.",
    heroEyebrow: "Google Reviews · NFC + QR",
    heroHeadline: "Get more Google Reviews, one tap at a time",
    heroSubheadline:
      "A ReviewTap card sends customers straight to your Google Business Profile review form — right when the experience is freshest in their mind, without them having to search for your business.",
    whyItMattersTitle: "Why Google Reviews matter for local search",
    whyItMattersParagraphs: [
      "Google Reviews are one of the strongest signals in local search and Google Maps ranking. Businesses with more recent, higher-rated reviews tend to appear more prominently when customers search for services \"near me\" — before a competitor with fewer reviews does.",
      "The problem isn't that customers don't want to leave a review. It's friction: finding your business on Google, tapping through several screens, and typing out a review takes effort most people abandon halfway through. A ReviewTap card removes every one of those steps — one tap or scan opens the review form directly.",
      "Because the physical card always points to the same permanent ReviewTap link, you can set it up once and keep collecting Google reviews indefinitely, with real visit statistics showing exactly how often customers are being sent to leave one.",
    ],
    howItWorksSteps: [
      {
        title: "Place your card at the point of experience",
        body: "On the counter, table, or receipt — wherever a happy customer is most likely to notice it.",
      },
      {
        title: "They tap or scan",
        body: "No app required. Their phone opens your Google review form directly, in seconds.",
      },
      {
        title: "You track every visit",
        body: "See exactly how many people were sent to your Google review page, and when.",
      },
    ],
    benefits: [
      { title: "Direct to your review form", body: "No searching, no typing your business name." },
      { title: "Works with your existing profile", body: "Points to your real Google Business Profile review link." },
      { title: "Change it anytime", body: "Switch to another platform later without reprinting the card." },
      { title: "Honest analytics", body: "See review visits over time — not vague estimates." },
    ],
    faqs: [
      {
        q: "Does ReviewTap post reviews directly to Google for me?",
        a: "No. ReviewTap sends the customer to your real Google review form, where they write and submit the review themselves, exactly as Google intends. We never fabricate or automate reviews.",
      },
      {
        q: "Do I need a Google Business Profile already?",
        a: "Yes — you'll need an active Google Business Profile with a review link. If you don't have one yet, create it for free from Google first, then paste the review link into your ReviewTap dashboard.",
      },
      {
        q: "Can I switch from Google to Trustpilot or Facebook later?",
        a: "Yes, anytime, directly from your dashboard. The physical card and QR code never need to be reprinted or reprogrammed — only the destination changes.",
      },
      {
        q: "What if I want customers to choose between Google and other platforms?",
        a: "That's what the Pro plan is for — visitors get a chooser page listing every platform you enable, so the same card can collect Google, Trustpilot, Facebook and Tripadvisor reviews.",
      },
      {
        q: "Does ReviewTap guarantee more 5-star reviews?",
        a: "No — and we wouldn't trust a tool that claimed to. ReviewTap removes the friction of getting to your review form; what customers write is entirely up to them.",
      },
    ],
  },
  {
    slug: "trustpilot-reviews",
    type: "TRUSTPILOT",
    name: "Trustpilot",
    seoTitle: "Get More Trustpilot Reviews with a QR Code & NFC Card",
    seoDescription:
      "Collect more Trustpilot reviews in-store or in person. A ReviewTap card sends customers straight to your Trustpilot review page — no searching, no typing.",
    heroEyebrow: "Trustpilot · NFC + QR",
    heroHeadline: "Turn foot traffic into Trustpilot reviews",
    heroSubheadline:
      "Trustpilot reviews are usually collected by email after an online order. ReviewTap lets you collect them in person too — at the counter, at checkout, or on a delivery — with one tap or scan.",
    whyItMattersTitle: "Why Trustpilot reviews matter for trust and conversion",
    whyItMattersParagraphs: [
      "Trustpilot is one of the most recognised independent trust signals for online shoppers — a visible TrustScore and recent reviews can directly affect whether a new visitor decides to buy from you or a competitor.",
      "Most Trustpilot invitations only reach customers who ordered online. Businesses with a physical presence — retail counters, pickup points, showrooms, service visits — have no easy way to ask an in-person customer for a Trustpilot review at all, so those reviews simply never happen.",
      "A ReviewTap card closes that gap. Anyone who's just had a good in-person experience can leave a Trustpilot review in the moment, without you needing their email address or waiting for an automated invite.",
    ],
    howItWorksSteps: [
      {
        title: "Put a card where customers check out or collect orders",
        body: "Till, pickup counter, delivery slip — anywhere an in-person moment happens.",
      },
      {
        title: "They tap or scan",
        body: "Their phone opens your Trustpilot review page directly — no email invite needed.",
      },
      {
        title: "You see the results",
        body: "Real visit counts, so you know your in-person Trustpilot collection is actually working.",
      },
    ],
    benefits: [
      { title: "Covers in-person customers", body: "Reach the reviewers your email invites never do." },
      { title: "No email required", body: "Works the moment someone taps or scans — nothing to collect first." },
      { title: "Points to your real Trustpilot page", body: "Reviews are written and submitted on Trustpilot itself." },
      { title: "Switch anytime", body: "Change the destination from your dashboard without a new card." },
    ],
    faqs: [
      {
        q: "Do I need a Trustpilot Business account first?",
        a: "Yes — you'll need a Trustpilot profile with a review invitation link. Paste that link into your ReviewTap dashboard as your destination.",
      },
      {
        q: "Does this replace Trustpilot's automated email invitations?",
        a: "No, it complements them. Email invitations reach online customers after checkout; ReviewTap reaches customers in the moment, in person — the two work well together.",
      },
      {
        q: "Can the same card also send people to Google or Facebook?",
        a: "Yes, with the Pro plan — visitors get a chooser page and can pick Trustpilot or any other platform you've enabled, all from the same physical card.",
      },
      {
        q: "Will this affect my TrustScore negatively?",
        a: "ReviewTap only ever sends visitors to your genuine Trustpilot review form. What they write, and whether Trustpilot's own review guidelines are followed, is entirely between the reviewer and Trustpilot.",
      },
      {
        q: "Can I track how many people actually visited my Trustpilot page?",
        a: "Yes — your dashboard shows review visits over time, so you can see exactly how the card is performing.",
      },
    ],
  },
  {
    slug: "facebook-reviews",
    type: "FACEBOOK",
    name: "Facebook",
    seoTitle: "Get More Facebook Reviews & Recommendations with a QR Code",
    seoDescription:
      "Collect more Facebook Page recommendations with a simple tap or scan. Send customers straight to your Facebook reviews — no searching required.",
    heroEyebrow: "Facebook · NFC + QR",
    heroHeadline: "More Facebook recommendations, less friction",
    heroSubheadline:
      "Most customers already have Facebook open on their phone. A ReviewTap card sends them straight to your Page's reviews — one tap instead of searching for your business by hand.",
    whyItMattersTitle: "Why Facebook reviews still matter",
    whyItMattersParagraphs: [
      "For many local businesses, Facebook is still where existing customers and their friends actually look before visiting — recommendations on your Page show up directly in the feed of people who already follow you, reaching an audience Google and Trustpilot don't.",
      "The friction is the same as everywhere else: a customer has to open Facebook, search for your exact Page name, find the reviews tab, and only then leave a recommendation. Most people who'd happily recommend you in person never make it through those steps online.",
      "A ReviewTap card skips all of that — one tap or scan opens your Page's review section directly, while the good experience is still top of mind.",
    ],
    howItWorksSteps: [
      {
        title: "Place your card where customers say goodbye",
        body: "Checkout, exit, or delivery — the moment right after a good experience.",
      },
      {
        title: "They tap or scan",
        body: "Their phone opens your Facebook Page's reviews directly — no searching required.",
      },
      {
        title: "You see the visits",
        body: "Real numbers on how many people were sent to recommend your Page.",
      },
    ],
    benefits: [
      { title: "Skips the search", body: "No typing your Page name into the Facebook search bar." },
      { title: "Reaches their network", body: "Recommendations can surface to the reviewer's own friends and followers." },
      { title: "No app needed to tap", body: "Works with a standard phone browser via NFC or QR." },
      { title: "One card, many platforms", body: "Add Facebook alongside Google, Trustpilot and Tripadvisor on Pro." },
    ],
    faqs: [
      {
        q: "Do I need reviews enabled on my Facebook Page?",
        a: "Yes — your Facebook Page needs recommendations/reviews turned on in its settings, with a review link you can paste into your ReviewTap dashboard.",
      },
      {
        q: "Can customers recommend my Page without a Facebook account?",
        a: "No — Facebook requires visitors to be logged in to leave a recommendation. ReviewTap gets them to the right page; the rest follows Facebook's own rules.",
      },
      {
        q: "Can I combine Facebook with Google and Trustpilot on the same card?",
        a: "Yes — that's exactly what the Pro plan's chooser page is for. Visitors pick whichever platform they prefer, all from one card.",
      },
      {
        q: "What if I later deactivate my Facebook Page?",
        a: "Just update your destination from the ReviewTap dashboard — the physical card and QR code stay exactly the same.",
      },
    ],
  },
  {
    slug: "tripadvisor-reviews",
    type: "TRIPADVISOR",
    name: "Tripadvisor",
    seoTitle: "Get More Tripadvisor Reviews with a QR Code & NFC Card",
    seoDescription:
      "Restaurants, hotels and attractions: collect more Tripadvisor reviews with a simple tap or scan card at the table, front desk or exit.",
    heroEyebrow: "Tripadvisor · NFC + QR",
    heroHeadline: "More Tripadvisor reviews for hospitality & travel",
    heroSubheadline:
      "Restaurants, hotels, tours and attractions live or die by Tripadvisor ranking. A ReviewTap card sends guests straight to your review page at the exact moment they're ready to write one.",
    whyItMattersTitle: "Why Tripadvisor ranking matters for hospitality",
    whyItMattersParagraphs: [
      "Tripadvisor is often the first stop for travellers deciding where to eat, stay or book an experience. A higher position and a steady stream of recent reviews directly influence whether your restaurant, hotel or tour gets chosen over a similarly-priced competitor down the street.",
      "The trouble is timing: guests who loved their meal or stay are usually already halfway home, or moving on to their next destination, by the time they think to leave a review — if they think of it at all.",
      "A ReviewTap card on the table, at the front desk, or on the receipt captures that moment before it's gone — a single tap or scan opens your Tripadvisor review page right then and there.",
    ],
    howItWorksSteps: [
      {
        title: "Place your card where the experience ends",
        body: "The table, the front desk, the tour's final stop — right as a guest is most satisfied.",
      },
      {
        title: "They tap or scan",
        body: "Their phone opens your Tripadvisor review page directly — no searching for your listing.",
      },
      {
        title: "You track engagement",
        body: "See exactly how many guests were sent to leave a Tripadvisor review, and when.",
      },
    ],
    benefits: [
      { title: "Captures the moment", body: "Ask while the experience is fresh, not days later by email." },
      { title: "No listing search needed", body: "Opens your exact Tripadvisor page directly." },
      { title: "Built for hospitality", body: "Works equally well at tables, front desks, and tour endpoints." },
      { title: "Pair with other platforms", body: "Add Google and Trustpilot too, with the Pro chooser page." },
    ],
    faqs: [
      {
        q: "Do I need a Tripadvisor listing already?",
        a: "Yes — an existing Tripadvisor listing with a review link, which you paste into your ReviewTap dashboard as the destination.",
      },
      {
        q: "Is this suitable for hotels as well as restaurants?",
        a: "Yes — any hospitality or travel business with a Tripadvisor listing works: restaurants, hotels, tours, attractions and more.",
      },
      {
        q: "Can I place multiple cards — one per table, for example?",
        a: "Yes. ReviewTap supports multiple devices per account (subject to your plan's device limit), each with its own permanent link and its own visit statistics.",
      },
      {
        q: "Can guests choose between Tripadvisor and Google?",
        a: "With the Pro plan, yes — guests get a chooser page listing every platform you've enabled, so one card can serve Tripadvisor, Google, Trustpilot and Facebook.",
      },
      {
        q: "Does ReviewTap guarantee a Travelers' Choice award or higher ranking?",
        a: "No. ReviewTap makes it easier for satisfied guests to reach your review page — what they write, and how Tripadvisor's own ranking algorithm responds, is outside our control.",
      },
    ],
  },
];

export function getPlatformLandingContent(slug: string): PlatformLandingContent | undefined {
  return PLATFORM_LANDING_PAGES.find((p) => p.slug === slug);
}
