Section 4 — Not free / not rational now

Things to defer, with reasons:





Real flight booking via Amadeus (Phase 05 tasks 4–5): search works on the free test tier, but actual booking (Flight Create Orders) requires a production contract, certification, and an IATA/consolidator relationship. Build search UI free; defer booking.



Hotel booking (Phase 06 tasks 4–5): same as flights — Amadeus test data is free for search; real reservations need commercial agreements. Booking.com Affiliate requires partner approval.



OpenTable / TheFork reservations (Phase 07 task 3): both APIs are partner-gated; not accessible for an unlaunched app. Use Google Places links as a free fallback.



Viator / GetYourGuide bookings (Phase 08): affiliate/partner APIs require an approved account with traffic. Defer; show mock or affiliate deep-links instead.



DB / Trainline booking (Phase 09 tasks 4–5): DB Vendo/Trainline booking APIs are not publicly available; timetable search (free DB API) is possible, booking is not rational now.



Claude API at scale (Phase 04): not free — every call costs tokens. Rational compromise: build route + prompt builder + streaming now, test with a few dollars of credit or mock responses; do not wire it into every page view.



Google Places / Maps beyond free credit (Phase 07): you already use Maps; Places calls consume the monthly free credit fast. Cache results in Supabase and keep dev usage low.



Resend custom domain (Phase 13 task 1): domain verification needs a purchased domain (~10 EUR/yr). Until then keep onboarding@resend.dev.



Stripe live tax configuration (Phase 16 task 5): requires a registered business + live mode; irrelevant before launch.



Price-alarm cron (Phase 14 task 3): depends on repeated flight-price polling against paid/limited APIs — not rational until real bookings exist.



Professional legal texts (Phase 16): free templates exist, but lawyer-reviewed AGB/Datenschutz for a booking platform with payment handling costs money — needed before real customers, not for development.