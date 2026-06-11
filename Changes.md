---
name: free-first backend roadmap
overview: "Prioritized to-do list derived from the 85-task backend PDF: everything that is free to build and test first (UX/UI, then database, then the rest), plus a clear list of tasks that cost money or are irrational to do now."
todos:
  - id: schema-consolidation
    content: "Consolidate Supabase schema: users, login_tokens, trip_surveys, trips, orders, credit_cards as repo migrations + RLS"
    status: completed
  - id: profile-page
    content: Editable profile page (name, travel style, language, avatar) in landing-page glass style, persisted to users table
    status: completed
  - id: survey-persistence
    content: POST /api/survey/submit + wire PlanningSection/RouteQuestionnaireFlow answers to trip_surveys
    status: completed
  - id: checkout-ui
    content: Connect BookingSection to Stripe checkout (test mode) and webhook to orders table
    status: completed
  - id: legal-pages
    content: Cookie banner + Impressum/Datenschutz/AGB pages, fix footer links
    status: completed
  - id: validation-ratelimit
    content: Zod validation + rate limiting + structured logging on all API routes
    status: completed
  - id: prompt-builder
    content: Prompt builder lib (survey JSON to German system prompt), unit-testable without AI key
    status: completed
  - id: weather-openmeteo
    content: Replace mock weather with free Open-Meteo API in lib/weather.ts
    status: completed
  - id: email-templates
    content: HTML e-mail templates (booking, trip plan, reminder) testable via test-email page
    status: completed
isProject: false
---

# Free-First Backend Roadmap (from PDF checklist)

Basis: the 17-phase PDF checklist, matched against the current repo state. Already done and therefore skipped: project setup, custom JWT auth (magic link + password), Resend integration, Stripe API routes, security check script.

Design rule for all new UI: match the landing page — German copy, Inter, dark navy `#1B262C` / blue `#3282B8` / `#BBE1FA`, blue→purple→pink gradients, `.glass-card` glassmorphism, pill buttons (`rounded-full`), `rounded-2xl/3xl` cards, framer-motion (stagger, `whileHover` scale, `AnimatePresence`).

---

## Section 1 — Free: UX & UI (priority 1)

All testable locally with mock data, zero cost.

- **Profile page upgrade** (PDF Phase 02): replace the hardcoded profile view in [components/ReiseApp.tsx](c:\Users\leyhorn\Code\Tripura\components\ReiseApp.tsx) with a real editable profile (display name, travel style, language, avatar) in a dedicated glass-card layout. Stats stay mock until trips exist.
- **Wire orphaned components**: `RouteQuestionnaireFlow`, `OnboardingEngine`, and `AIAssistant` are built but not mounted anywhere. Mount the survey flow after registration (Phase 03 entry point) and the AI assistant as a floating widget.
- **Booking checkout UI** (Phase 12): connect `BookingSection` to the existing `/api/stripe/checkout-session` route via `redirectToCheckout` — works free in Stripe test mode.
- **Cookie banner + legal pages** (Phase 16): `app/datenschutz/page.tsx`, `app/impressum/page.tsx`, `app/agb/page.tsx` and a small glass-style consent banner; fix the dead footer links. Free and legally required before launch.
- **E-mail templates** (Phase 13): design booking-confirmation / trip-plan / reminder HTML templates as React or plain HTML in `lib/email/templates/`, testable via the existing `app/test-email` page on the Resend free tier.
- **Suggestion**: fix the missing `.gradient-text` class in `globals.css` (referenced by Features/Budget/Planning but never defined).

## Section 2 — Free: Database (priority 2)

Supabase free tier covers all of this.

- **Consolidate schema** (Phases 02/03/04): the repo has a `profiles` migration that assumes Supabase Auth, but the live code uses custom `users`/`login_tokens` tables whose SQL is missing from the repo. Create one canonical `supabase/migrations/` set: `users`, `login_tokens`, `profiles`-fields merged into `users` (travel style, language, avatar), plus `trip_surveys`, `trips`, `orders`.
- **RLS** (Phases 02/03): enable Row Level Security on all user tables. Note: since the server uses the service-role key, RLS is a safety net, not the primary gate — middleware/JWT checks stay primary.
- **Survey persistence** (Phase 03): `POST /api/survey/submit` stores questionnaire answers (currently React-state-only in `PlanningSection`) as JSON in `trip_surveys`; load them into the profile.
- **Trips table** (Phase 04): persist generated/mock trip plans per user in `trips` so the budget/profile views can read real data.
- **Avatar persistence**: `setProfileImage` in [contexts/AuthContext.tsx](c:\Users\leyhorn\Code\Tripura\contexts\AuthContext.tsx) writes to localStorage only — store in `users.avatar_url` (Supabase Storage free tier for the image itself).
- **Credit card recommendation data** (Phase 11): seed a `credit_cards` table from the existing `mockCreditCards` — pure data work, free.
- **Backups** (Phase 15): enable Supabase automatic backups (included free).

## Section 3 — Free: everything else (priority 3)

- **Input validation with Zod** (Phase 15): add `zod` and validate bodies on all `app/api/**` routes (auth, survey, stripe).
- **Rate limiting** (Phase 15): simple in-memory/Upstash-free-tier limiter on auth + AI routes.
- **Prompt builder** (Phase 03): pure function survey-JSON → German system prompt in `lib/ai/promptBuilder.ts`; unit-testable without any API key.
- **Weather API** (Phase 14): replace mock in [lib/weather.ts](c:\Users\leyhorn\Code\Tripura\lib\weather.ts) with Open-Meteo (completely free, no key) instead of a paid weather API.
- **Stripe webhook → orders** (Phase 12): on `checkout.session.completed`, write an `orders` row; test free with Stripe CLI.
- **Logging** (Phase 17): small `lib/log.ts` helper + structured console logging on API routes (free; Sentry free tier optional later).
- **Uptime monitoring** (Phase 17): Better Uptime / UptimeRobot free tier once deployed.
- **Analytics** (Phase 17): Plausible is paid; suggestion — use Vercel Analytics free tier or self-note for later, plus the cookie banner from Section 1.
- **Cron jobs** (Phase 14): Supabase Edge Functions + pg_cron are on the free tier; reminder e-mails ("Check-in", "Abfahrt") can be built and tested free against Resend.

## Section 4 — Not free / not rational now

Things to defer, with reasons:

- **Real flight booking via Amadeus (Phase 05 tasks 4–5)**: search works on the free test tier, but actual booking (Flight Create Orders) requires a production contract, certification, and an IATA/consolidator relationship. Build search UI free; defer booking.
- **Hotel booking (Phase 06 tasks 4–5)**: same as flights — Amadeus test data is free for search; real reservations need commercial agreements. Booking.com Affiliate requires partner approval.
- **OpenTable / TheFork reservations (Phase 07 task 3)**: both APIs are partner-gated; not accessible for an unlaunched app. Use Google Places links as a free fallback.
- **Viator / GetYourGuide bookings (Phase 08)**: affiliate/partner APIs require an approved account with traffic. Defer; show mock or affiliate deep-links instead.
- **DB / Trainline booking (Phase 09 tasks 4–5)**: DB Vendo/Trainline booking APIs are not publicly available; timetable search (free DB API) is possible, booking is not rational now.
- **Claude API at scale (Phase 04)**: not free — every call costs tokens. Rational compromise: build route + prompt builder + streaming now, test with a few dollars of credit or mock responses; do not wire it into every page view.
- **Google Places / Maps beyond free credit (Phase 07)**: you already use Maps; Places calls consume the monthly free credit fast. Cache results in Supabase and keep dev usage low.
- **Resend custom domain (Phase 13 task 1)**: domain verification needs a purchased domain (~10 EUR/yr). Until then keep `onboarding@resend.dev`.
- **Stripe live tax configuration (Phase 16 task 5)**: requires a registered business + live mode; irrelevant before launch.
- **Price-alarm cron (Phase 14 task 3)**: depends on repeated flight-price polling against paid/limited APIs — not rational until real bookings exist.
- **Professional legal texts (Phase 16)**: free templates exist, but lawyer-reviewed AGB/Datenschutz for a booking platform with payment handling costs money — needed before real customers, not for development.

---

### Suggested execution order

1. Schema consolidation + RLS (unblocks everything DB-related)
2. Profile page + survey persistence (UI + DB together)
3. Checkout UI + webhook→orders (completes the Stripe loop in test mode)
4. Legal pages + cookie banner
5. Zod validation + rate limiting + logging
6. Prompt builder + Open-Meteo weather
7. E-mail templates + reminder crons