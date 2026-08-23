/* Post-build: give every known app route a real static index.html, so GitHub
 * Pages serves it with HTTP 200.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * Without it, GitHub Pages has no file at /sign-up and falls back to 404.html.
 * That page *renders* — it stashes the path in sessionStorage and bounces to
 * "/" where main.tsx restores it — so a human sees the right screen and nothing
 * looks broken. But the HTTP status is **404**.
 *
 * Every LP CTA points at app.<domain>/sign-up. A 404 status on the signup
 * destination fails Google Ads destination checks, and tells every crawler the
 * page does not exist.
 *
 * ⚠️ Measured 2026-08-23: app.dragonreply.ai, app.dragonrefunds.com and
 * app.dragonrestock.com ALL return 404 on /sign-up. This is an estate-wide
 * defect, not a quirk of this repo — the sibling repos need the same fix.
 *
 * 404.html stays for genuinely unknown paths, where a 404 is correct.
 */
import { mkdirSync, copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const shell = join(dist, 'index.html');

if (!existsSync(shell)) {
  console.error('postbuild: dist/index.html not found — run vite build first');
  process.exit(1);
}

/* Keep in sync with the <Route> list in src/App.tsx. A route missing here still
 * works for a human (via the 404.html bounce) but answers 404 to everything
 * else — which is exactly the silent failure above. */
const ROUTES = [
  '/sign-up',
  '/sign-in',
  '/dashboard',
  '/settings',
  '/verify-email',
  '/forgot-password',
];

for (const route of ROUTES) {
  const dir = join(dist, ...route.split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  copyFileSync(shell, join(dir, 'index.html'));
}

/* This host is the private application, not a marketing surface — the public
 * site and (later) the public profiles live on the apex domain. Nothing here
 * should be indexed, and without this file GitHub Pages 404s /robots.txt, which
 * crawlers treat as "crawl everything". */
writeFileSync(join(dist, 'robots.txt'),
`# app.verifiedmargins.com — the application. Not a marketing surface.
# The public site, and public seller profiles, live on verifiedmargins.com,
# which has its own robots.txt explicitly welcoming AI crawlers.
User-agent: *
Disallow: /
`);

console.log(`postbuild: wrote ${ROUTES.length} static route stubs (HTTP 200) + robots.txt`);
