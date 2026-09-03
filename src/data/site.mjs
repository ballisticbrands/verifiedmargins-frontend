/* Build-time twin of site.ts.
 *
 * The prerender and sitemap scripts are plain .mjs run by node, so they cannot
 * import the .ts module the app uses. Kept deliberately tiny and asserted
 * against its twin by scripts/check-site-constants.mjs, so the two cannot
 * drift into disagreeing about the site's own URL. */
export const SITE = 'https://verifiedmargins.com';
/* Build-time ONLY — this file's reader is scripts/build-profiles.mjs. The
 * browser bundle's API base is `config.apiUrl` (src/lib/config.ts), a
 * different constant that deliberately still points at api.getdragonbot.com.
 * 🚨 Must match site.ts — scripts/check-site-constants.mjs runs first in
 * `npm run build` and fails a one-sided edit. */
export const API_BASE = 'https://api.verifiedmargins.com';
export const BRAND_NAME = 'VerifiedMargins';

/* ONE business's public URL path. Twin of site.ts's businessPath — trailing
 * slash, because scripts/build-businesses.mjs writes these as directories and
 * the unslashed form 301s. */
export function businessPath(slug) {
  return `/business/${slug}/`;
}

/* The authenticated app's routes.
 *
 * 🚨 ONE list, read by scripts/postbuild-spa-routes.mjs (which writes their
 * static stubs and the robots.txt Disallow lines) AND by
 * scripts/generate-sitemap.mjs (which must exclude them). They were separate
 * lists for one build and immediately disagreed: the sitemap advertised
 * /settings, /sign-in, /verify-email and /login while robots.txt
 * blocked them — a sitemap listing URLs robots forbids is a Search Console
 * error, not a cosmetic mismatch.
 *
 * Keep in sync with the <Route> list in src/App.tsx. Anything NOT here is a
 * seller's handle. */
/* PUBLIC, indexable pages that are still React routes.
 *
 * 🚨 Deliberately NOT in APP_ROUTES. Both lists get a static stub so GitHub
 * Pages answers 200 instead of falling through to 404.html — but APP_ROUTES
 * also becomes a `Disallow:` line in robots.txt and is excluded from the
 * sitemap, which is right for authenticated shells and wrong for these. A
 * privacy policy nobody can crawl is a privacy policy that fails the audit it
 * exists to pass, and generate-sitemap.mjs already scores /privacy/ at 0.3,
 * so it expects to find them.
 *
 * Anything here must also be in RESERVED_USERNAMES on the backend
 * (src/services/profiles/usernames.ts) — otherwise a seller could register the
 * handle and shadow the page via the /:username catch-all. */
export const PUBLIC_PAGES = [
  /* The front door: `/` redirects here, the rail links here from every page,
   * and it is the one URL that shows what this site is for without an
   * account. It belongs in PUBLIC_PAGES rather than APP_ROUTES precisely
   * because APP_ROUTES gets a `Disallow:` — hiding the leaderboard from
   * crawlers would hide the product's own index. */
  '/leaderboard',
  '/privacy',
  /* Also the about URL on our Reddit / X / LinkedIn OAuth app records, so it
   * has to answer 200 to a reviewer's fetch, not bounce through 404.html. */
  '/about',
  /* The footer's "Terms" link on every page, and the terms URL the X / Reddit /
   * LinkedIn app registrations ask for alongside the privacy one.
   * generate-sitemap.mjs has always priced /tos/ at 0.3 — it expected this. */
  '/tos',
  /* Where every "contact support" sentence in the product points, including
   * the username-change-limit error the backend returns
   * (src/services/profiles/service.ts). Indexable on purpose: people search
   * for "<brand> support" before they think to look in the footer. */
  '/support',
  /* The trust page: what each badge means and how it is earned. Indexable on
   * purpose and the strongest reason of any page here to be — "is
   * VerifiedMargins legit" and "how does X verify revenue" are queries someone
   * types BEFORE they will click anything of ours, and this is the answer.
   * Graduated out of APP_ROUTES (where it carried a Disallow) when it stopped
   * being a "coming soon" stub. Already in the backend's RESERVED_USERNAMES. */
  '/how-verification-works',
];

/* 🎭 Demo pages (/demo/<slug>) — real components, fixture data, and often
 * features that do not exist yet. Spread into APP_ROUTES below so each gets a
 * 200-answering stub AND a `Disallow:` AND sitemap exclusion: a demo must
 * resolve on a cold link but must never be indexed. Adding a demo means adding
 * a line here — see src/demo/README.md. */
export const DEMO_PAGES = [
  /* The index of the list below, read off the DEMOS registry. Listed here
     like any other demo: it needs the 200-answering stub, and it must carry
     the Disallow — a crawlable index of noindex pages hands a crawler every
     URL the Disallow was meant to keep it away from. */
  '/demo',
  '/demo/afrasiab',
  '/demo/Pure_Zookeepergame_2',
  '/demo/jayeshchauhanreddit',
  '/demo/Much-Experience-4197',
  '/demo/Sirsolrac36',
  '/demo/SlickyTrick',
  '/demo/Thick-Valuable-4753',
  '/demo/TomNomYYZ',
  '/demo/danboufford',
  '/demo/ecg-cameron',
  '/demo/ecg-danny',
  '/demo/ecg-ubaldo',
  /* 🚧 A GROUP board — a feature the product does not have. Two path
     segments, so it needs its own <Route> in App.tsx as well as this stub. */
  '/demo/g/ecgwholesale',
  '/demo/af-04812',
  '/demo/af-27193',
  '/demo/af-61207',
  '/demo/af-83540',
  '/demo/g/passionatenetwork',
  /* The front door with a board on it. NOT a duplicate of '/leaderboard' in
   * PUBLIC_PAGES above: that one is the real page and is indexable on
   * purpose, this one is the same page over invented figures and must carry
   * the `Disallow:`. Two URLs, opposite crawl rules — which is exactly why
   * demos live in their own list. */
  '/demo/leaderboard',
];

export const APP_ROUTES = [
  /* The one auth page. /sign-up and /sign-in are TOMBSTONES that redirect
   * to it — they stay in this list precisely because they must keep
   * answering 200: the LP, emails already sitting in inboxes and any live
   * ad creative point at them, and a 404 on an ad's destination fails
   * Google Ads' destination check. */
  '/login',
  '/sign-up',
  '/sign-in',
  /* Where every emailed sign-in link lands. Missing here it would have
   * been served by the 404.html bounce — a human would still get signed
   * in, on an HTTP 404. */
  '/magic',
  '/dashboard',
  /* 🚧 Nav destinations with no page yet. They are in APP_ROUTES rather than
   * PUBLIC_PAGES on purpose: they need a 200 because the rail links to them
   * from every page and a 404 from our own navigation reads as a broken
   * site — but they must NOT be crawled while they say "not built yet".
   * Move each to PUBLIC_PAGES when it becomes a real page —
   * /how-verification-works graduated that way. */
  '/feed',
  '/verify',
  /* The nav's "Profile" link. A resolver route, not a page — it reads the
   * signed-in user's profiles and redirects to their own /:username page (or
   * to /settings when there is nothing publishable yet). Needs a 200-answering
   * stub like every other app route, and a Disallow: there is nothing here to
   * index and it requires auth to do anything at all.
   * 🚨 Must stay in the backend's RESERVED_USERNAMES
   * (src/services/profiles/usernames.ts) — it already is — or a seller could
   * register "profile" and shadow it. */
  '/profile',
  '/settings',
  '/verify-email',
  ...DEMO_PAGES,
  /* No /forgot-password: this brand has no passwords, and the route is
   * gone from App.tsx. */
];
