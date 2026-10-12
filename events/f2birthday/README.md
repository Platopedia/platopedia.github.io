# F2's Birthday — Platopedia subpage

Everything for this revision lives in `events/f2birthday/`. `index.html` is a **Jekyll content fragment** using the existing `tool-content` layout and permalink `/events/f2birthday/`. It inherits Platopedia's header, page heading, Bootstrap container, and light/dark theme. There is no second document shell or global theme system.

The design now uses a comic/anime palette, two original Luffy fan illustrations, cartoon sea/clouds, animated bunting, a tap-to-cheer Luffy interaction, countdown number pops, a wanted-poster wish form, and an interactive birthday-frame display. All CSS is scoped to `#f2birthday`; its dark palette responds to the site's existing `body[data-theme="dark"]`. Width breakpoints use the **content container** (920, 650, and 440 px), rather than treating this as a full-screen landing page. Reduced-motion preferences disable animation.

## Preview

`npm run dev` serves http://127.0.0.1:4173/events/f2birthday/ when local listening sockets are available. The preview reads the **actual parent layouts, includes, theme CSS, main CSS, and tool-content CSS**. It does not modify those files or load the external analytics include. `node scripts/preview.mjs --file` generates `preview.html`, which can be opened locally; it uses relative paths to the parent site's CSS and this folder's assets.

This session's environment blocked local listening sockets (`EPERM`); the in-app browser permits only HTTP/HTTPS and rejected the file preview. Browser permission was granted by the user, but the environment restrictions remain. Rendered screenshots and real mobile/desktop interaction tests could not be performed here. Source integration and interaction/security tests are provided instead.

## Event settings still pending

Edit only `assets/config.js`:

- Countdown: **October 18, 2026 at 00:00 UTC**, pending an exact party time. Update both `eventDate` and `eventLabel` together.
- `groupUrl`: empty until the actual Plato group invite is supplied. The supplied `https://platopedia.com/events/f2birthday` is this event subpage and is retained as `eventPageUrl`; the crew section avoids a misleading link back to itself.
- `frameUrl`: empty until the official transparent frame arrives. The downloadable SVG and profile preview are visibly labelled as an original design concept. Set the real asset URL and `frameFilename` to switch to official labels.
- `wishesApi` and `turnstileSiteKey`: empty, so the form previews a bottle **without saving or submitting the message**. Google Sheets is also empty as requested.

## Secure birthday post

`server/` contains the previously implemented Cloudflare Worker and durable submission store, copied into this folder so deployment materials remain in scope. A public form needs server enforcement; browser-only device limits do not prevent abuse.

The service enforces atomic rolling quotas: 1 wish per signed device cookie / 24 h; 6 per IP / 24 h; 30 per IPv4 /24 or IPv6 /64 network / 24 h; and 500 globally / 24 h. It uses strict allowed origins, short-window attempt/issuance limits, a honeypot, bounded JSON requests, validated wish content, normalized duplicate detection, one-use signed challenges bound to the device and IP, and server-side Turnstile hostname/action/challenge-data checks. Clearing cookies does not remove network limits; retaining a device cookie enforces its limit across changed networks. Anonymous visitors cannot be made perfectly identifiable, so bot verification, network/global ceilings, duplicate checks, and moderation add safeguards.

The durable store saves every accepted wish privately before queuing a Sheets export. Failed exports retry on an alarm; stable assigned row writes avoid duplicate rows after ambiguous network timeouts. No public read endpoint exposes wishes. Raw IPs and device identifiers are not written to Sheets. Delivered backups expire after 30 days; pending wishes stay queued until delivered.

When the sheet is available:

1. Create a dedicated `Wishes` tab. Enable Google Sheets API, create a service account, and share only this sheet with its email as Editor. Do not reorder/insert/delete rows in the raw tab; organize wishes in another tab or a filter view.
2. Set `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB`, exact `ALLOWED_ORIGINS`, and the desired `SUBMISSIONS_CLOSE_AT` in `server/wrangler.jsonc`.
3. Set `SIGNING_SECRET` (32+ random characters), `TURNSTILE_SECRET`, `GOOGLE_CLIENT_EMAIL`, and `GOOGLE_PRIVATE_KEY` with Worker secret bindings. Keep private credentials out of chat, source, and browser assets.
4. Deploy with `wrangler deploy` from `server/`. Prefer an API hostname on `platopedia.com` to avoid third-party cookie blocking. Put its origin and your public Turnstile widget key into `assets/config.js`. Allowlist the final page hostname in Turnstile.
5. Test real delivery with staging credentials and a test sheet before opening submissions. Export columns are Bottle ID, Received (UTC), Birthday wish, Occasion, and Moderation. Sheet values use `RAW`, so messages cannot become formulas.

All **33 automated checks passed** on October 12, 2026, including subpage integration, countdown timing, bottle previews, frame controls, and submission security. A source scan also confirmed scoped CSS rules and balanced syntax. Run `npm test` to repeat these checks. Assets and exact generation prompts are documented in `assets/SOURCES.md`. No publication was attempted in this revision; the work remains local as requested.
