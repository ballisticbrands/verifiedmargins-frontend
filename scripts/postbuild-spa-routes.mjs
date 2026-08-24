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
import { APP_ROUTES as ROUTES } from '../src/data/site.mjs';

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

for (const route of ROUTES) {
  const dir = join(dist, ...route.split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  copyFileSync(shell, join(dir, 'index.html'));
}

/* 🚨 This file used to say `Disallow: /`, which was right when this repo only
 * served app.verifiedmargins.com. It now serves the APEX, and the apex is where
 * published profiles live — the pages this whole product exists to make
 * findable. Shipping the old file would have hidden every profile from Google
 * and from every AI assistant, silently, while the site looked perfectly fine.
 *
 * So: allow by default, and disallow only the authenticated surfaces, which
 * have nothing to index and would otherwise be crawled as an endless set of
 * identical shells. */
writeFileSync(join(dist, 'robots.txt'),
`# verifiedmargins.com — published seller profiles are the point. Crawl them.
User-agent: *
Allow: /
${ROUTES.map((r) => `Disallow: ${r}`).join('\n')}

# AI / answer engines — explicit allow. The wildcard above already permits
# them; this block exists so the intent is deliberate and nobody "tidies up" by
# blocking them later. For a public seller-profile network a profile an AI
# assistant cannot read is not public in the sense the product promises.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://verifiedmargins.com/sitemap.xml
`);

console.log(`postbuild: wrote ${ROUTES.length} static route stubs (HTTP 200) + robots.txt`);
