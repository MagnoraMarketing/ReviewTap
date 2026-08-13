# ReviewTap

Turn every customer into a review. ReviewTap sells physical NFC + QR cards that point to a
permanent dynamic link (`https://reviewtap.app/r/RT-XXXXXXXX`). Business owners log into the
ReviewTap dashboard to control where that link redirects — Google Reviews, Facebook, Trustpilot,
Tripadvisor or a custom URL — without ever reprogramming the physical card.

Two plans power the link:

- **Basic (€10/month)** — one fixed destination, direct redirect.
- **Pro (€20/month)** — visitors land on a chooser page and pick their own platform, with a share
  button. You manage which platforms are enabled from the dashboard.

The physical device is a one-time €50 purchase and can be bought on its own; the app subscription
is presented as a strongly recommended add-on (it's what lets you set the destination and see
statistics) and can also be added later from Dashboard → Billing.

## Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, PWA manifest
- **Backend:** Next.js Route Handlers, Supabase (PostgreSQL + Auth), Row Level Security
- **Payments:** Stripe Checkout, Stripe Customer Portal, Stripe subscriptions, Stripe webhooks
- **QR:** generated server-side with the `qrcode` package
- **Deployment:** Vercel

---

## 1. Project setup

```bash
npm install
cp .env.example .env.local   # fill in the values described below
npm run dev
```

## 2. Environment variables

See `.env.example` for the full list. Summary:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public base URL, used to build `/r/[deviceId]` links |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client config (safe for the browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Used by the Stripe webhook and the redirect route. **Never** expose this to the browser. |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe API keys |
| `STRIPE_WEBHOOK_SECRET` | Verifies incoming Stripe webhook signatures |
| `STRIPE_PRICE_ID` | Recurring price for **Pro** (€20/month) |
| `STRIPE_PRICE_ID_BASIC` | Recurring price for **Basic** (€10/month) |
| `STRIPE_PRICE_ID_ONE_TIME` | One-time price for the physical device (€50) |

Never commit `.env.local` — it's already in `.gitignore`.

## 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the Project URL, `anon` key and `service_role` key into `.env.local`.
3. Run the migrations (below) so the schema, RLS policies and the redirect RPC function exist.
4. In **Authentication → Providers**, email/password is enabled by default. Magic links use the
   same "Email" provider — no extra setup needed, but make sure the **Site URL** and **Redirect
   URLs** in Authentication settings include `<NEXT_PUBLIC_APP_URL>/auth/callback`.

### Database migrations

Two SQL files live in `supabase/migrations/`:

- `0001_init.sql` — enums, tables (`profiles`, `subscriptions`, `devices`, `scans`), triggers, RLS
  policies, and a column-protection trigger on `devices` (RLS is row-level only, so this trigger
  stops a signed-in owner from rewriting purchase-time fields like `plan`/`variant` or forcing
  `status = SUSPENDED` via a direct REST call).
- `0002_redirect_rpc.sql` — `get_redirect_target(text)`, a single-round-trip lookup used by the
  hot-path redirect route.

Apply them with the Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

...or paste each file's contents into the Supabase SQL editor, in order.

### Creating an admin user

Admin routes (`/admin/*`) are gated on `profiles.role = 'ADMIN'`. There's no self-service upgrade
path (by design — see the RLS policy on `profiles`). Promote a user manually, e.g. in the SQL
editor:

```sql
update public.profiles set role = 'ADMIN' where email = 'you@example.com';
```

## 4. Stripe setup

Create, in the Stripe Dashboard:

1. **Product: "ReviewTap NFC"** → one-time price, €50 → copy the price ID into
   `STRIPE_PRICE_ID_ONE_TIME`.
2. **Product: "ReviewTap Basic"** → recurring monthly price, €10 → `STRIPE_PRICE_ID_BASIC`.
3. **Product: "ReviewTap Pro"** → recurring monthly price, €20 → `STRIPE_PRICE_ID`.
4. Enable the **Customer Portal** (Settings → Billing → Customer portal) so
   Dashboard → Billing → "Manage billing" works.

Checkout runs in `mode: "subscription"` with the one-time device price added as an extra line item
when the app is bundled (Stripe supports this mixed-cart pattern), or in plain `mode: "payment"`
when the device is bought alone.

### Webhook setup

Point a webhook endpoint at `https://<your-domain>/api/stripe/webhook` and subscribe to:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Copy the endpoint's signing secret into `STRIPE_WEBHOOK_SECRET`.

For local development, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Stripe is the source of truth for subscription status — the webhook is the only thing that writes
to the `subscriptions` table, and the redirect route always re-checks the current status rather
than trusting anything from the client.

## 5. Local development

```bash
npm run dev       # http://localhost:3000
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## 6. Deploying to Vercel

1. Import the repository into Vercel.
2. Add all environment variables from `.env.example` in Project Settings → Environment Variables.
3. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://reviewtap.app`).
4. Deploy, then update the Stripe webhook endpoint and Supabase auth redirect URLs to point at the
   production domain.

The `/r/[deviceId]` redirect route runs on the **Edge Runtime** for low latency, since it's the
route real customers hit most often (via NFC tap or QR scan).

## 7. NFC programming instructions

The app only manages the URL written to the chip — it doesn't write to NFC hardware itself (that
requires physical proximity to a phone).

1. Buy a device in `/shop`; a unique device and permanent URL
   (`https://reviewtap.app/r/RT-XXXXXXXX`) are generated automatically after checkout.
2. Open **Dashboard → NFC setup**, copy the URL.
3. On the phone that will program the chip, install a free NFC-writing app (e.g. "NFC Tools" on
   iOS/Android), write a "URL/URI" record with the copied link, then hold the phone against the
   physical chip.
4. This only needs to happen once — changing the destination afterwards is done entirely from the
   dashboard and never touches the chip again.

## 8. QR generation

QR codes are generated server-side (`src/lib/qr.ts`, using the `qrcode` package) from the same
permanent `/r/[deviceId]` URL — never from the final review-platform URL. Available from
Dashboard → Devices → a device → QR code: PNG download, SVG download, and a printable
"Scan to leave us a review" card layout.

## 9. Admin setup

See "Creating an admin user" above. Once promoted, `/admin` exposes:

- **Overview** — users, devices, scans, active/trialing/past-due/canceled subscription counts, and
  an estimated MRR (informational only — Stripe remains the billing source of truth).
- **Users** — search, view a user's profile/subscription/devices.
- **Devices** — search all devices, suspend/reactivate any device.
- **Products** — reference imagery: hardware form factors, Basic single-platform card mockups, and
  the Pro multi-platform + dashboard marketing image.

---

## Architecture notes

### Redirect system

`GET /r/[deviceId]` is the hot path. It:

1. Validates the public ID format before touching the database.
2. Applies a best-effort in-memory rate limit (process-local — see the "Known limitations" note
   below).
3. Calls `get_redirect_target(public_id)`, a single Postgres RPC that joins the device to its
   owner's latest subscription status in one round trip.
4. **Basic devices** with an active subscription and a configured destination: records a scan and
   redirects (302) straight to the destination URL.
5. **Pro devices**: records a "visit" scan (no destination chosen yet) and redirects to
   `/r/[deviceId]/choose`, a page listing every enabled platform. Picking one hits
   `/r/[deviceId]/go/[type]`, which re-validates everything (never trusts the chooser page's
   request) before recording the platform-specific scan and redirecting.
6. Any other state (device paused/suspended, subscription inactive, destination not configured,
   unknown device) redirects to `/r/status`, a professional "this link isn't active right now"
   page — never a raw 500, and never a fallback to someone else's review page.

### Scan tracking honesty

Because the NFC chip and the QR code point to the *same* URL, the app cannot reliably tell NFC
taps from QR scans apart. `scan_type` is stored as `UNKNOWN` rather than guessing — see
`supabase/migrations/0001_init.sql` and `src/lib/record-scan.ts`. The UI consistently says "review
visits" rather than "reviews generated": ReviewTap knows a visitor was redirected to a review
platform, not whether they actually submitted a review.

### Privacy

No IP addresses are stored. Country/city (when shown) come only from the hosting edge network's
geo headers, never from an external IP-lookup service. Full details in `/privacy`.

### Security

- Row Level Security on every table; a `SECURITY DEFINER` `is_admin()` helper avoids the
  recursive-RLS trap when checking roles from inside a `profiles` policy.
- A trigger on `devices` pins purchase-time columns (`plan`, `variant`, `public_id`) and blocks
  client-side `SUSPENDED` status changes, so RLS's row-level "you own this row" check can't be
  used to bypass the application layer's validation.
- Destination URLs are validated server-side: must be `https://`, reject `javascript:`/`data:`/
  local/loopback hosts, and are loosely checked against the selected platform's domain.
- Stripe webhook signatures are verified; the redirect route and webhook always re-derive
  subscription status from Stripe/the database rather than trusting client input.
- The service-role Supabase key is imported only in modules marked `import "server-only"`.

---

## Known limitations (MVP scope)

- **Rate limiting is process-local**, not a shared store (no Redis dependency was added for the
  MVP). On a multi-instance serverless deployment this bounds abuse per-instance, not globally.
  Swap `src/lib/rate-limit.ts` for `@upstash/ratelimit` (or similar) behind the same
  `checkRateLimit` signature for stricter guarantees.
- **No in-app plan upgrade/downgrade flow.** A user can add the app subscription later
  (Dashboard → Billing → "Add the app"), but switching an existing Basic subscription to Pro (or
  back) isn't built — that requires Stripe subscription-item swapping logic. For now, cancel and
  re-subscribe via the Customer Portal.
- **Estimated MRR on the admin overview is a local approximation** (`active + trialing
  subscriptions × plan price`), not pulled from Stripe's real revenue reporting.
- **Product marketing imagery is illustrative**, not real product photography — swap
  `public/marketing/reviewtap-pro-solution.png` and the SVG mockups in
  `src/components/shop/` for real photos before launch.
- **No official review-platform API integration.** This is by design for the MVP — the product
  intentionally never claims to know whether a visit became a submitted review. The architecture
  (a single `scans` table keyed by device + destination) can support review-sync APIs later
  without a schema rework.
- **Multi-device support exists in the schema** (a user can own many `devices` rows) but the
  checkout flow and onboarding wizard are built around provisioning one device per checkout
  session, matching the MVP's "one device per purchase" flow. `Dashboard → Devices → Add another
  ReviewTap` reuses the same `/shop` checkout to add more.
