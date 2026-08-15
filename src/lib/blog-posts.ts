export interface BlogSection {
  heading?: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Short teaser shown on the blog index. */
  excerpt: string;
  seoDescription: string;
  category: "Dashboard" | "Analytics" | "Multi-platform" | "Getting started" | "Strategy";
  publishedAt: string; // ISO date
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  // ---------------------------------------------------------------------
  // Dashboard & competitive positioning
  // ---------------------------------------------------------------------
  {
    slug: "reviewtap-dashboard-manage-every-platform-one-screen",
    title: "The ReviewTap Dashboard: Manage Every Review Platform From One Screen",
    excerpt:
      "Most review QR products stop at the card. Here's what a dashboard built around your NFC/QR device should actually let you do.",
    seoDescription:
      "See what the ReviewTap dashboard does: manage destinations, devices, QR/NFC setup and review analytics for Google, Trustpilot, Facebook and Tripadvisor from one screen.",
    category: "Dashboard",
    publishedAt: "2026-06-02",
    sections: [
      {
        paragraphs: [
          "A physical NFC card or QR code sticker is the easy part. Any print shop can produce one. What actually determines whether it keeps working for your business six months from now is what sits behind it — and for most review-QR products, the answer is: not much. You get a static code pointing at one fixed link, and if you ever want to change that link, you're stuck reprinting or reprogramming.",
          "ReviewTap was built the other way around. The physical card is deliberately dumb — it always points to the same permanent link — and everything that actually matters lives in the dashboard behind it.",
        ],
      },
      {
        heading: "What you can actually do from the dashboard",
        paragraphs: [
          "Change your review destination in seconds, without touching the card. Switch from Google to Trustpilot, add Facebook, or point to a custom URL, and the physical card never needs to change.",
          "See real analytics: how many times your card has been tapped or scanned, which days are busiest, and — on the Pro plan — which platform visitors choose most often.",
          "Manage every device you own from one list, whether it's a card you bought from us or your own NFC tag/QR code you registered yourself.",
          "Handle billing, plan changes and account settings without leaving the app.",
        ],
      },
      {
        heading: "Why this matters more than the card itself",
        paragraphs: [
          "Businesses change. You might switch from prioritising Google reviews to focusing on Trustpilot for six months, or want to see whether Facebook recommendations are worth pursuing. Without a dashboard, that decision costs you a reprint. With ReviewTap, it costs you a few clicks — and you can look at real numbers before you decide, instead of guessing.",
          "That's the actual product: not a card, but a system you control.",
        ],
      },
      {
        heading: "See it before you buy",
        paragraphs: [
          "You don't have to take this on faith. Create a free ReviewTap account and you can explore the full dashboard — configure a device, set a destination, see what the analytics look like — before you ever pay for anything. Only activating a live, working card requires a subscription.",
        ],
      },
    ],
  },
  {
    slug: "reviewtap-vs-traditional-review-qr-codes",
    title: "ReviewTap vs. Traditional Review QR Codes: What's Actually Different",
    excerpt:
      "A static QR code pointing straight at a Google review link looks the same as ReviewTap on the surface. The differences show up the first time you need to change something.",
    seoDescription:
      "Compare ReviewTap to a plain static review QR code: dynamic destinations, multi-platform chooser, real analytics, and a dashboard you actually control.",
    category: "Dashboard",
    publishedAt: "2026-06-05",
    sections: [
      {
        paragraphs: [
          "Print \"scan to leave a Google review\" on a table tent, generate a QR code from any free online tool, and you're technically done. It's cheap, it's fast, and for a lot of businesses it's genuinely fine for the first month. The problems tend to show up later.",
        ],
      },
      {
        heading: "The static QR code problem",
        paragraphs: [
          "A free QR code generator bakes your destination URL directly into the code. Want to switch platforms, or your Google review link changes for some reason? You're reprinting and re-laminating every card, every table tent, every sticker — and hoping nobody scans an old one that still points to the wrong (or dead) link in the meantime.",
          "There's also no way to see whether anyone is actually scanning it. A static code is a one-way trip: print it, place it, hope.",
        ],
      },
      {
        heading: "How ReviewTap is structured differently",
        paragraphs: [
          "The QR code (and matching NFC chip) encodes a permanent ReviewTap link, not your final destination. The destination lives in your dashboard and can change any time — the physical card stays exactly as it is.",
          "Every scan and tap is recorded, so you can see visit counts over time instead of guessing whether the card is doing anything.",
          "On the Pro plan, one card can offer visitors a choice between Google, Trustpilot, Facebook and Tripadvisor, instead of locking you into a single platform forever.",
        ],
      },
      {
        heading: "Which one should you actually use?",
        paragraphs: [
          "If you're certain you'll only ever want one fixed platform, will never change it, and don't care about visit data, a free static QR code will work. For everyone else — businesses that expect to reassess, want to know if the thing is being used, or want to collect reviews across more than one platform — a dynamic link with a dashboard behind it is the difference between a sign you put up once and a tool you actually manage.",
        ],
      },
    ],
  },
  {
    slug: "review-qr-code-without-dashboard-not-enough",
    title: "Why a Review Card Without a Dashboard Isn't Enough",
    excerpt:
      "The card gets a customer to tap. The dashboard is what turns that tap into something you can actually act on.",
    seoDescription:
      "A review QR/NFC card is only half the product. Here's why the dashboard behind it — analytics, destination control, device management — is what actually matters.",
    category: "Dashboard",
    publishedAt: "2026-06-09",
    sections: [
      {
        paragraphs: [
          "Ask most review-card sellers what you get, and they'll describe the card: the material, the NFC chip, the printed QR code. Ask what happens after someone taps it, and the answer gets vague fast. That's usually because there isn't much of an answer — the card is the whole product.",
        ],
      },
      {
        heading: "What a card alone can't tell you",
        paragraphs: [
          "Is anyone actually using it? Without visit tracking, you have no way to know if the card sitting on your counter is generating traffic or being ignored.",
          "Is it still pointing where you want? If your Google Business Profile link changes, or you decide to prioritise a different platform, a card with no dashboard means starting over.",
          "Which platform gets picked most, if you're offering a choice? A card alone has no memory — it can't tell you anything about the choices customers actually make.",
        ],
      },
      {
        heading: "What the dashboard adds",
        paragraphs: [
          "A dashboard turns a one-way physical object into a system: destination management, device-level and account-level analytics, the ability to add more devices as you grow, and — critically — the ability to change your mind later without buying new hardware.",
          "It's the difference between hanging a sign and running a small piece of infrastructure for your business.",
        ],
      },
      {
        paragraphs: [
          "If you're comparing review card providers, ask to see the dashboard, not just the card. ReviewTap lets you create a free account and look at the whole thing — devices, destinations, analytics — before you commit to anything.",
        ],
      },
    ],
  },
  {
    slug: "review-qr-code-dashboard-features-checklist",
    title: "5 Dashboard Features Every Review QR Code Should Have (And Most Don't)",
    excerpt:
      "A checklist for evaluating any review QR/NFC product, based on what actually makes a difference six months after you buy it.",
    seoDescription:
      "The 5 dashboard features that separate a real review-QR platform from a static code: dynamic destinations, analytics, multi-device support, a platform chooser, and honest data.",
    category: "Dashboard",
    publishedAt: "2026-06-12",
    sections: [
      {
        paragraphs: [
          "Review QR/NFC products all look similar in a product photo — a small card, a chip, a printed code. The real differences are in the software behind them, and most of those differences only surface once you've already bought the hardware. Here's what to check before you do.",
        ],
      },
      {
        heading: "1. Can you change the destination without new hardware?",
        paragraphs: [
          "If changing platforms means buying a new card, you don't have a dynamic system — you have a printed sign. The destination should live in software, not in the physical object.",
        ],
      },
      {
        heading: "2. Does it track visits?",
        paragraphs: [
          "A tool with no analytics can't tell you whether it's working. At minimum, you should see scan/tap counts over time.",
        ],
      },
      {
        heading: "3. Can one card serve more than one platform?",
        paragraphs: [
          "Some customers prefer Google, others Trustpilot or Facebook. A chooser page that lets the visitor pick collects more total reviews than forcing everyone to one platform.",
        ],
      },
      {
        heading: "4. Can you manage multiple devices from one account?",
        paragraphs: [
          "If you have more than one location, till, or table, you need one dashboard that shows all of them — not a separate login or app per card.",
        ],
      },
      {
        heading: "5. Is the data honest?",
        paragraphs: [
          "Be sceptical of any product that claims to know whether a review was actually submitted, not just whether someone visited the platform. No QR/NFC system can see what happens after the visitor lands on Google or Trustpilot — a provider that claims otherwise is overselling.",
        ],
      },
      {
        paragraphs: [
          "ReviewTap was built around exactly this checklist — dynamic destinations, real visit analytics, a multi-platform chooser on Pro, multi-device support, and honest \"review visits\" language instead of unverifiable claims. You can check all five for free before paying for anything.",
        ],
      },
    ],
  },
  {
    slug: "how-to-choose-a-review-qr-code-provider",
    title: "How to Choose a Review QR Code Provider: A Buyer's Checklist",
    excerpt:
      "Practical questions to ask before you buy any NFC or QR code review product — not just ReviewTap.",
    seoDescription:
      "A buyer's checklist for choosing a review QR/NFC provider: destination flexibility, analytics, pricing structure, multi-platform support, and what happens if you cancel.",
    category: "Dashboard",
    publishedAt: "2026-06-16",
    sections: [
      {
        paragraphs: [
          "There are a lot of small businesses selling NFC and QR review cards right now, and the products can look nearly identical in a listing photo. Here's what actually differs between providers, and what to ask before you buy from any of them.",
        ],
      },
      {
        heading: "Pricing structure",
        paragraphs: [
          "Is the hardware a one-time cost, or bundled into a subscription you can't separate? Can you buy the physical device on its own and decide about a subscription later? ReviewTap's device is a one-time €50 purchase, with the app subscription (from €10/month) as a separate, cancel-anytime add-on — you're never locked into paying for both forever just to own the card.",
        ],
      },
      {
        heading: "What happens if you cancel",
        paragraphs: [
          "Ask directly: does the link redirect to a competitor's page, show an error, or a professional \"currently inactive\" message? A provider that quietly redirects your customers somewhere else when you stop paying is a red flag. ReviewTap always shows a clear inactive-link page — never someone else's business.",
        ],
      },
      {
        heading: "Can you try it before paying?",
        paragraphs: [
          "You should be able to create an account, configure a device, and preview the whole experience before you're asked to pay for a subscription. If a provider requires payment before you can see the dashboard at all, that's worth questioning.",
        ],
      },
      {
        heading: "Multi-platform support",
        paragraphs: [
          "If you want reviews on more than one platform, check whether that's actually supported — a chooser page visitors interact with — or whether you'll need a separate card per platform.",
        ],
      },
      {
        paragraphs: [
          "Whichever provider you choose, ask these questions first. If you'd like to compare against a concrete example, ReviewTap's free account lets you walk through the entire dashboard, destinations and analytics before deciding.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------
  {
    slug: "how-to-track-review-requests-analytics-guide",
    title: "How to Track Review Requests: A Guide to Review Analytics",
    excerpt:
      "If you can't see how many people tap or scan your review card, you can't tell whether it's working. Here's what to actually measure.",
    seoDescription:
      "Learn what to track when collecting customer reviews with a QR/NFC card: scan volume, timing patterns, destination breakdown, and how to read the numbers.",
    category: "Analytics",
    publishedAt: "2026-06-19",
    sections: [
      {
        paragraphs: [
          "Most businesses that put out a review card never look at it again after the first week. Not because it stopped working, but because there's usually no way to check. A printed sign gives you no feedback loop.",
        ],
      },
      {
        heading: "The basic metric: review visits over time",
        paragraphs: [
          "The starting point is simple: how many times has your card been tapped or scanned, and on which days? A steady baseline that suddenly drops is worth investigating — did the card move, get covered by something, or stop being mentioned by staff?",
        ],
      },
      {
        heading: "Destination breakdown (Pro plan)",
        paragraphs: [
          "If you're running a multi-platform chooser, seeing which platform gets picked most tells you where your customers actually prefer to leave feedback — information you can't get any other way, since you'd otherwise have to check four different platforms separately and guess which visits came from your card.",
        ],
      },
      {
        heading: "What to actually do with the numbers",
        paragraphs: [
          "Low visit counts usually point to placement, not the tool itself — a card by the till gets seen far more than one tucked into a menu. A steady, healthy count with low review growth on the platform side is a different problem: the request is landing, but something after that (the review form itself, or hesitation) is the bottleneck.",
          "The point of analytics isn't vanity — it's being able to tell those two problems apart instead of guessing.",
        ],
      },
      {
        paragraphs: [
          "ReviewTap's dashboard shows review visits over time and, on Pro, a full destination breakdown, for every device on your account — free to configure and preview, with activation requiring only an active subscription.",
        ],
      },
    ],
  },
  {
    slug: "what-review-scan-data-is-telling-you",
    title: "What Your Review Scan Data Is Telling You (And How to Use It)",
    excerpt:
      "Reading a scan-count chart is easy. Knowing what to change because of it is the actual skill.",
    seoDescription:
      "How to interpret review QR/NFC scan analytics: spotting placement problems, timing patterns, and using real data instead of guessing whether your card works.",
    category: "Analytics",
    publishedAt: "2026-06-23",
    sections: [
      {
        paragraphs: [
          "A chart showing scans over the last 30 days looks simple, but most businesses only glance at the total and stop there. The more useful reads are in the shape of the data, not just the number.",
        ],
      },
      {
        heading: "Flat and low",
        paragraphs: [
          "If your total is consistently low no matter how many customers you serve, the problem is usually visibility, not willingness. A card tucked next to a napkin dispenser gets ignored; one handed over with the receipt, or placed directly in a customer's line of sight at checkout, gets noticed.",
        ],
      },
      {
        heading: "Spikes on specific days",
        paragraphs: [
          "If certain days consistently outperform others, that's often tied to which staff member is on shift and mentioning the card, or which part of the week brings in customers most likely to want to leave feedback (weekend diners vs. weekday regulars, for example).",
        ],
      },
      {
        heading: "A sudden drop",
        paragraphs: [
          "A card that was performing fine and then drops to near zero almost always means something physical changed — it got moved, covered, or removed — rather than a shift in customer sentiment. Check the placement before assuming anything else.",
        ],
      },
      {
        paragraphs: [
          "The value of tracking this isn't the number itself — it's catching these patterns early enough to fix them, instead of a card quietly doing nothing for months while you assume it's working.",
        ],
      },
    ],
  },
  {
    slug: "review-visits-vs-review-submissions",
    title: "Review Visits vs. Review Submissions: Why the Difference Matters",
    excerpt:
      "No QR or NFC tool can honestly tell you a review was submitted. Here's why that distinction matters, and why you should be sceptical of anyone who claims otherwise.",
    seoDescription:
      "Understand the difference between tracked review visits and confirmed review submissions — and why any review QR tool claiming to know the latter is overstating what it can measure.",
    category: "Analytics",
    publishedAt: "2026-06-26",
    sections: [
      {
        paragraphs: [
          "Once a customer taps your card and lands on Google or Trustpilot, they leave your system entirely. What they do next — write a review, close the tab, get distracted — happens on a platform you have no visibility into. That's not a limitation specific to any one product; it's true of every NFC or QR review tool that exists.",
        ],
      },
      {
        heading: "Why some providers blur this line anyway",
        paragraphs: [
          "\"Reviews generated\" sounds like a better metric than \"review visits,\" so some products imply or outright claim they can count actual submitted reviews. In reality, they're either estimating (and hoping you don't ask how), or quietly counting visits and calling them something more impressive.",
        ],
      },
      {
        heading: "Why the honest version is still useful",
        paragraphs: [
          "A review visit — someone tapped or scanned and was sent to your review page — is real, measurable, and still tells you plenty: whether the card is being used, when, and which platform people prefer. It's just not the same thing as a submitted review, and pretending otherwise sets the wrong expectation.",
        ],
      },
      {
        paragraphs: [
          "ReviewTap deliberately uses \"review visits\" throughout the dashboard, not \"reviews generated,\" because that's the honest description of what's actually being measured. If a provider you're evaluating claims to count submitted reviews directly from a QR/NFC redirect, ask exactly how — there's no technical way to see past the handoff to the platform.",
        ],
      },
    ],
  },
  {
    slug: "nfc-tap-data-better-customer-experience-decisions",
    title: "Turning NFC Tap Data Into Better Customer Experience Decisions",
    excerpt:
      "Review card analytics aren't just about reviews — the timing and volume patterns can reveal things about your customer experience too.",
    seoDescription:
      "How review card tap/scan data can inform staffing, service timing, and customer experience decisions beyond just tracking review requests.",
    category: "Analytics",
    publishedAt: "2026-06-30",
    sections: [
      {
        paragraphs: [
          "Review analytics are usually framed narrowly — did the card work, which platform got picked. But the underlying data (when customers engage, how consistently) can inform decisions that have nothing directly to do with reviews.",
        ],
      },
      {
        heading: "Timing patterns as a proxy for satisfaction moments",
        paragraphs: [
          "If tap volume is noticeably higher right after a specific service point (checkout, table clearing, delivery handoff), that's the moment your customers feel most positive — worth reinforcing elsewhere, not just leaving a card near.",
        ],
      },
      {
        heading: "Comparing devices across locations",
        paragraphs: [
          "If you run more than one location or till and each has its own ReviewTap device, comparing their visit counts side by side can surface real operational differences — one location's staff consistently mentioning the card, another's not — that a single aggregate number would hide.",
        ],
      },
      {
        paragraphs: [
          "None of this requires extra tooling beyond what a review card already tracks. It just means occasionally looking at the dashboard with a slightly wider lens than \"did we get reviews.\"",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Multi-platform / Pro / sharing
  // ---------------------------------------------------------------------
  {
    slug: "should-customers-choose-their-own-review-platform",
    title: "Should Customers Choose Their Own Review Platform? The Case for a Chooser Page",
    excerpt:
      "Forcing every customer to one review site is simpler to set up, but it may be costing you reviews from people who already have an account elsewhere.",
    seoDescription:
      "Why letting customers pick their own review platform (Google, Trustpilot, Facebook, Tripadvisor) from a chooser page collects more total reviews than a single fixed destination.",
    category: "Multi-platform",
    publishedAt: "2026-07-03",
    sections: [
      {
        paragraphs: [
          "A single fixed destination is the simplest setup: one card, one platform, one link. It's also a bet that every customer who wants to leave you a review already has, or is willing to create, an account on that specific platform.",
        ],
      },
      {
        heading: "Not everyone has an account everywhere",
        paragraphs: [
          "Some customers are active Google reviewers and rarely touch Trustpilot. Others do most of their shopping research (and reviewing) on Trustpilot and barely use Google Maps. A few only ever engage on Facebook, where they're already logged in on their phone. Point everyone at one platform, and you filter out anyone who isn't already comfortable there.",
        ],
      },
      {
        heading: "What a chooser page changes",
        paragraphs: [
          "Instead of picking for the customer, a chooser page lets them land on whichever platform they already use — Google, Trustpilot, Facebook or Tripadvisor — from the exact same physical card. The friction of \"I don't have an account there\" disappears for a meaningful share of visitors.",
        ],
      },
      {
        heading: "The tradeoff",
        paragraphs: [
          "A chooser page adds one extra tap compared to a direct redirect, and it's a slightly more involved setup (multiple destinations instead of one). For a business that only ever wants Google reviews and nothing else, a single fixed destination is still the simpler, cheaper choice. For anyone trying to maximise total review volume across platforms, the extra tap is a small cost for a meaningfully larger pool of customers who can actually complete the flow.",
        ],
      },
      {
        paragraphs: [
          "ReviewTap's Pro plan builds this chooser page in — Google, Trustpilot, Facebook and Tripadvisor, all from one card, with a share button so visitors can pass the page along too.",
        ],
      },
    ],
  },
  {
    slug: "one-card-four-platforms-multi-platform-review-collection",
    title: "One Card, Four Platforms: How Multi-Platform Review Collection Works",
    excerpt:
      "A practical look at how a single NFC tap or QR scan can offer visitors a choice between Google, Trustpilot, Facebook and Tripadvisor.",
    seoDescription:
      "How multi-platform review collection works: one NFC/QR card, a visitor-facing chooser page, and a dashboard showing which platform gets picked most.",
    category: "Multi-platform",
    publishedAt: "2026-07-07",
    sections: [
      {
        paragraphs: [
          "The mechanics are simpler than they sound. The physical card always points to one permanent link. What that link does depends entirely on how you've configured it in the dashboard — and on the Pro plan, it can present a choice instead of a single redirect.",
        ],
      },
      {
        heading: "The visitor's side",
        paragraphs: [
          "A customer taps or scans the card and lands on a simple page: your business name, and a short list of the platforms you've enabled — Google Reviews, Trustpilot, Facebook, Tripadvisor. They pick one, and go straight to that platform's review form. There's also a share button, so they can pass the same chooser page to someone else if relevant.",
        ],
      },
      {
        heading: "Your side",
        paragraphs: [
          "In the dashboard, you enable whichever platforms you actually want (you're not required to use all four), and paste in the review link for each. You can turn platforms on or off, or update any of the links, at any time — the physical card never changes.",
        ],
      },
      {
        heading: "Why this beats running separate cards per platform",
        paragraphs: [
          "One card managing four possible destinations is simpler to place, cheaper than printing four separate cards, and gives you one combined analytics view instead of four disconnected ones. It also means you're not asking a customer to hunt for \"the Trustpilot card\" versus \"the Google card\" — there's just one card, and the choice happens after the tap.",
        ],
      },
    ],
  },
  {
    slug: "google-vs-trustpilot-vs-facebook-vs-tripadvisor-where-to-collect-reviews",
    title: "Google vs Trustpilot vs Facebook vs Tripadvisor: Where Should You Collect Reviews?",
    excerpt:
      "Each platform serves a different audience and purpose. Here's how to think about which ones actually matter for your business.",
    seoDescription:
      "A comparison of Google Reviews, Trustpilot, Facebook and Tripadvisor for collecting customer reviews — which platforms matter most depending on your business type.",
    category: "Multi-platform",
    publishedAt: "2026-07-10",
    sections: [
      {
        paragraphs: [
          "Not every review platform matters equally for every business. Here's a practical breakdown of what each one is actually good for, so you can decide which to prioritise — or why offering more than one might be worth it.",
        ],
      },
      {
        heading: "Google Reviews",
        paragraphs: [
          "The default choice for almost any local business. Reviews here directly influence how you rank in Google Maps and local search — probably the single highest-impact platform for anyone relying on \"near me\" searches.",
        ],
      },
      {
        heading: "Trustpilot",
        paragraphs: [
          "Strongest for ecommerce and service businesses where a visible TrustScore affects a buying decision before a customer ever visits in person. Less relevant for a purely local, walk-in business with no online storefront.",
        ],
      },
      {
        heading: "Facebook",
        paragraphs: [
          "Valuable if your customer base is already active on Facebook and follows your Page — recommendations there can surface directly in their friends' feeds, reaching people who'd never search Google or Trustpilot for you.",
        ],
      },
      {
        heading: "Tripadvisor",
        paragraphs: [
          "Close to essential for hospitality, food & beverage, and travel/attraction businesses, where it's often the first place travellers look. Largely irrelevant outside that category.",
        ],
      },
      {
        heading: "The practical takeaway",
        paragraphs: [
          "If you fit clearly into one category — a restaurant, an ecommerce store — one or two platforms will cover most of your value. If you're not sure, or you serve a broad mix of customers, a multi-platform chooser removes the need to guess: let each visitor pick the platform they already trust.",
        ],
      },
    ],
  },
  {
    slug: "how-to-let-customers-share-your-business-multiple-review-sites",
    title: "How to Let Customers Share Your Business Across Multiple Review Sites",
    excerpt:
      "Beyond the chooser page itself, a share button turns one satisfied customer into a small distribution channel.",
    seoDescription:
      "How the ReviewTap chooser page's share button lets satisfied customers pass your review link to friends, extending reach beyond the person who physically tapped or scanned.",
    category: "Multi-platform",
    publishedAt: "2026-07-14",
    sections: [
      {
        paragraphs: [
          "Most review collection stops at the person standing in front of the card. But a customer who just had a good experience is often willing to do more than leave a review themselves — they'll happily point a friend to your business too, if it's easy enough.",
        ],
      },
      {
        heading: "Why a share button matters",
        paragraphs: [
          "The Pro plan's chooser page includes a share option, so a customer can send the same review-platform-picker link to someone else — a friend deciding where to eat, a colleague looking for a service you provide. That link works exactly the same way for them: pick a platform, leave a review.",
        ],
      },
      {
        heading: "Where this actually helps",
        paragraphs: [
          "It's most useful for businesses with a referral or recommendation-driven customer base — hospitality, personal services, anything people naturally talk about with friends. It's a small feature, but it turns a single physical card's reach into something that can extend past the person who tapped it.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Getting started / buying / value
  // ---------------------------------------------------------------------
  {
    slug: "nfc-business-card-vs-qr-code-stand-which-to-buy",
    title: "NFC Business Card vs QR Code Stand: Which Should You Buy for Reviews?",
    excerpt:
      "Both work. The right choice depends less on the technology and more on where the card will actually sit.",
    seoDescription:
      "Comparing NFC tap cards and QR code stands for collecting customer reviews — which format suits counters, tables, till points and different customer types.",
    category: "Getting started",
    publishedAt: "2026-07-17",
    sections: [
      {
        paragraphs: [
          "The honest answer is that you don't have to choose — every ReviewTap card includes both an NFC chip and a printed QR code pointing at the exact same link, so a customer can use whichever they're comfortable with. But it's still worth understanding the difference.",
        ],
      },
      {
        heading: "NFC (tap)",
        paragraphs: [
          "Fastest interaction — hold a modern phone near the card, no camera app needed. Works well at a till or counter where a customer's phone is already in hand. The main limitation: a small number of older phones, and iPhones with NFC reading restricted to certain contexts, may need the QR fallback instead.",
        ],
      },
      {
        heading: "QR code (scan)",
        paragraphs: [
          "Universally supported — every modern smartphone camera can scan a QR code without installing anything. Better suited to a table tent, a printed receipt, or anywhere a customer might view the card from slightly further away rather than tapping it directly.",
        ],
      },
      {
        heading: "The actual recommendation",
        paragraphs: [
          "Place the card somewhere both options are usable — most counters and tables work fine for either — and let the customer default to whichever feels natural. There's no meaningful downside to having both, and it removes any \"my phone doesn't support that\" friction entirely.",
        ],
      },
    ],
  },
  {
    slug: "from-purchase-to-first-review-setting-up-reviewtap",
    title: "From Purchase to First Review: Setting Up Your ReviewTap Device",
    excerpt:
      "A step-by-step walk through getting a ReviewTap card from unboxing to actually collecting reviews.",
    seoDescription:
      "How ReviewTap setup works from purchase to your first collected review: account creation, destination configuration, NFC programming, and activation.",
    category: "Getting started",
    publishedAt: "2026-07-21",
    sections: [
      {
        paragraphs: [
          "Setup takes longer to read about than to actually do. Here's the full sequence, so there are no surprises.",
        ],
      },
      {
        heading: "1. Create your account (free)",
        paragraphs: [
          "Signing up costs nothing and doesn't require a subscription. You can explore the dashboard immediately.",
        ],
      },
      {
        heading: "2. Get your device",
        paragraphs: [
          "Either buy a physical Standee Card or Desk Tile from the shop, or register your own blank NFC tag or QR code for free from the dashboard — no purchase required either way.",
        ],
      },
      {
        heading: "3. Set your destination",
        paragraphs: [
          "Choose Basic (one fixed platform) or Pro (a multi-platform chooser), and enter your review link(s). You can preview exactly what visitors will see before going further.",
        ],
      },
      {
        heading: "4. Program the physical chip (if needed)",
        paragraphs: [
          "If you're using your own blank NFC tag, the dashboard's built-in writer (Chrome on Android) or a short manual process (any other phone) programs it with your permanent ReviewTap link. Purchased cards already come pre-programmed.",
        ],
      },
      {
        heading: "5. Activate",
        paragraphs: [
          "Everything above works without paying anything. The one step that requires an active subscription is making the link actually redirect real visitors — activate whenever you're ready, and your configuration is already waiting exactly as you left it.",
        ],
      },
    ],
  },
  {
    slug: "how-much-does-a-review-qr-code-cost",
    title: "How Much Does a Review QR Code Cost? Pricing Breakdown",
    excerpt:
      "A transparent look at what you're actually paying for — hardware, software, and what's optional.",
    seoDescription:
      "ReviewTap pricing explained: one-time device cost, monthly app subscription tiers (Basic vs Pro), and what's free including account creation and configuration.",
    category: "Getting started",
    publishedAt: "2026-07-24",
    sections: [
      {
        paragraphs: [
          "Review QR/NFC pricing usually falls into one of two models: a one-time hardware purchase, or a bundled subscription you can't separate. Understanding which one you're being sold matters more than the headline price.",
        ],
      },
      {
        heading: "ReviewTap's structure",
        paragraphs: [
          "The physical device — a Standee Card or Desk Tile with both NFC and QR — is a one-time €50 purchase. It can be bought entirely on its own, with no subscription attached.",
          "The app subscription is what lets you set and change your destination and see analytics. It's strongly recommended (a card without it can't be activated for real visitors), but it's billed separately: Basic at €10/month (one fixed platform), Pro at €20/month (multi-platform chooser plus share).",
          "Creating an account, configuring destinations, and previewing the whole dashboard is free — you're only ever charged once you activate a live device.",
        ],
      },
      {
        heading: "What you're actually paying the subscription for",
        paragraphs: [
          "Not the hardware — that's already yours. The subscription covers the software: destination management, analytics, the ability to change platforms without buying a new card, and (on Pro) the multi-platform chooser and share button.",
        ],
      },
      {
        paragraphs: [
          "You can cancel anytime through the billing portal. Cancelling doesn't delete your configuration or reroute your customers anywhere unexpected — the link simply shows a clear \"currently inactive\" page until you reactivate.",
        ],
      },
    ],
  },
  {
    slug: "buy-once-manage-forever-review-card-never-needs-replacing",
    title: "Buy Once, Manage Forever: Why Your Review Card Should Never Need Replacing",
    excerpt:
      "The physical card is a one-time decision. Everything that changes afterward should happen in software, not in a reorder.",
    seoDescription:
      "Why a review QR/NFC card should be a one-time purchase that never needs reprinting — even as your review platform preferences change over time.",
    category: "Getting started",
    publishedAt: "2026-07-28",
    sections: [
      {
        paragraphs: [
          "There's a specific, avoidable failure mode in review card products: you buy one, it works, and eighteen months later you want to change something — a new Google review link, a switch to Trustpilot, adding a second platform — and discover the only way to do that is to buy another card.",
        ],
      },
      {
        heading: "Why this happens",
        paragraphs: [
          "It happens when the destination is baked directly into the QR code or NFC chip at manufacturing time, rather than living in software you control. Cheaper to build, but it turns every future change into a reorder.",
        ],
      },
      {
        heading: "The alternative",
        paragraphs: [
          "Build the card around a permanent link that you control from a dashboard, and the physical object becomes a one-time purchase. Change your mind about platforms as often as you like — the card in the customer's hand, or on your counter, never has to change.",
        ],
      },
      {
        paragraphs: [
          "This is the whole premise behind ReviewTap's architecture: the €50 device is genuinely a one-time cost, because the part that actually changes over time — where the link points — was deliberately kept in software, not printed onto the card.",
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------
  // Strategy / general "get more reviews"
  // ---------------------------------------------------------------------
  {
    slug: "how-to-ask-customers-for-reviews-without-feeling-awkward",
    title: "How to Ask Customers for Reviews Without Feeling Awkward",
    excerpt:
      "Most staff hesitate to ask for reviews out loud. A physical card removes the need to ask at all.",
    seoDescription:
      "Practical, low-friction ways to ask customers for reviews without an awkward verbal request, including using a QR/NFC card as a silent prompt.",
    category: "Strategy",
    publishedAt: "2026-08-01",
    sections: [
      {
        paragraphs: [
          "\"Would you mind leaving us a review?\" is a perfectly reasonable question, and most staff still avoid asking it. It feels like putting a customer on the spot, especially right after a transaction. That hesitation is a big part of why so many satisfied customers never get asked at all.",
        ],
      },
      {
        heading: "Let an object do the asking",
        paragraphs: [
          "A card on the counter or table does the same job as the verbal ask, without anyone having to say anything. \"Scan to leave us a review\" is a low-pressure prompt a customer can act on, or ignore, entirely on their own terms — no eye contact, no awkward pause waiting for a response.",
        ],
      },
      {
        heading: "If you do want staff to mention it",
        paragraphs: [
          "Frame it as pointing something out, not asking for a favour: \"there's a card by the till if you'd like to leave a review\" reads very differently to a customer than \"could you leave us a review?\" — same outcome, much less pressure on both sides.",
        ],
      },
      {
        paragraphs: [
          "The card doesn't replace good service as the reason people leave reviews — it just removes the friction and social awkwardness between a customer wanting to and actually doing it.",
        ],
      },
    ],
  },
  {
    slug: "psychology-of-timing-when-customers-leave-reviews",
    title: "The Psychology of Timing: When Customers Are Most Likely to Leave a Review",
    excerpt:
      "The moment you ask matters as much as how you ask. Here's why placement and timing drive review volume more than almost anything else.",
    seoDescription:
      "Why timing matters more than wording when asking for customer reviews — and how to place your review QR/NFC card at the exact right moment.",
    category: "Strategy",
    publishedAt: "2026-08-04",
    sections: [
      {
        paragraphs: [
          "A request for a review made a week later, by email, competes with everything else in someone's inbox and relies on them remembering details that have already started to fade. A request made in the moment — while the experience is still fresh — doesn't have either problem.",
        ],
      },
      {
        heading: "Why immediacy wins",
        paragraphs: [
          "Emotion and specific detail both fade fast. A customer who loved a meal can describe exactly why an hour later; by next week, it's just \"it was good.\" The closer to the actual experience you ask, the more detailed and more likely the review.",
        ],
      },
      {
        heading: "Finding the right moment",
        paragraphs: [
          "The best placement is usually right at the natural end of a positive interaction: the receipt, the checkout counter, the table as it's cleared, the point a service is completed. Not before the experience is finished, and not so long after that the moment has passed.",
        ],
      },
      {
        paragraphs: [
          "This is exactly why a physical card outperforms an email review request for a lot of in-person businesses — it's there at the moment that actually matters, not days later when the feeling has already faded.",
        ],
      },
    ],
  },
  {
    slug: "10-places-to-put-your-review-qr-code",
    title: "10 Places to Put Your Review QR Code for Maximum Scans",
    excerpt:
      "Placement drives review volume more than almost anything else you can control. Here's where it actually works.",
    seoDescription:
      "10 practical placement ideas for a review QR code or NFC card to maximise scans and reviews, from till counters to receipts to delivery packaging.",
    category: "Strategy",
    publishedAt: "2026-08-08",
    sections: [
      {
        paragraphs: [
          "The single biggest lever for review volume usually isn't the platform, the wording, or even the incentive — it's whether the card is somewhere a satisfied customer will actually notice it. A few placements that consistently outperform:",
        ],
      },
      {
        heading: "1–5: In-person locations",
        paragraphs: [
          "The till or checkout counter, directly in a customer's eyeline while paying. The table, for restaurants and cafés — a standee card works better here than a wall poster. Next to the exit, catching customers on their way out. On the receipt itself, printed or a small attached sticker. At the reception or front desk, for service-based businesses.",
        ],
      },
      {
        heading: "6–10: Beyond the physical space",
        paragraphs: [
          "On delivery packaging, timed to arrive right as the customer is unboxing a good experience. On a follow-up service card handed over after a repair or appointment. On staff lanyards or name badges, for businesses where a specific employee's service is the reason for the review. Near a waiting area, where customers have a spare moment to act. On a loyalty or membership card, alongside other account details.",
        ],
      },
      {
        heading: "The common thread",
        paragraphs: [
          "Every strong placement shares two things: it's visible without requiring effort to find, and it appears close to the moment the customer is feeling good about the experience. Track visit counts after moving a card — the data usually confirms which locations actually work for your specific business faster than guessing would.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}
