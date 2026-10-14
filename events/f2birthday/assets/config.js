/* Public settings. Live wishes use the deployed API on the HTTPS event page; local copies preview bottles. */
window.F2_BIRTHDAY_CONFIG = Object.freeze({
  eventDate: '2026-10-18T13:00:00Z',
  eventLabel: '18 October 2026 · 1 PM GMT',
  eventPageUrl: 'https://platopedia.com/events/f2birthday',
  // groupUrl: 'https://platoapp.com/link/1e0cjnzva1tmm',
  groupUrl: '', // Keep the invite disabled until the group is public.
  groupLabel: 'Join the main event group',
  wishesApi: 'https://f2-birthday-post.platopedia.workers.dev',
  turnstileSiteKey: '0x4AAAAAAFVY1ABCK9-kuyrs',
  // Empty previews the optimized WebP and downloads the original local PNG.
  frameUrl: '',
  frameFilename: 'f2-birthday-frame.png'
});
