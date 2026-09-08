/* The social card for a published dossier: public/og/<slug>.png, 1200x630.
 *
 * ── Why this is not part of `npm run build` ──────────────────────────────
 * 🚨 It needs Chrome, and the GitHub Pages workflow does not have one. Wiring
 * it into the build would deploy fine on this machine and fail in CI, which is
 * the worst shape of breakage: invisible until somebody else pushes.
 *
 * So the PNG is COMMITTED, and this script is what regenerates it:
 *
 *     node scripts/build-og.mjs        # then commit public/og/*.png
 *
 * Run it whenever a dossier's headline figures change. The figures live in one
 * place below and in build-dossiers.mjs's description — if the card and the
 * page ever disagree, the card is the stale one.
 *
 * ── Why an image at all ──────────────────────────────────────────────────
 * A link to this page is shared in a DM or a post, where the preview IS the
 * page for most of the people who see it. A card that reads only
 * "VerifiedMargins" wastes that; one that carries the brand's own logo, its
 * name and its profit figure makes the point before anybody clicks.
 *
 * 🚨 And it carries "ESTIMATED · MODELLED FROM PUBLIC DATA" in the image
 * itself. The number in a preview travels further than the page it came from,
 * so the caveat has to travel with it — a screenshot of this card must not be
 * able to imply that a real business asserted these figures.
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'og');

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const c = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find((p) => existsSync(p));
  if (!c) {
    console.error('build-og: no Chrome found; set CHROME_PATH');
    process.exit(1);
  }
  return c;
}

/* ⚠️ Keep in sync with scripts/build-dossiers.mjs and the fixture. */
const CARDS = [
  {
    slug: 'spitehouse',
    brand: 'Spite House Games',
    what: 'Amazon FBA · grown-up gag card games',
    logo: join(root, 'public', 'demo', 'spitehouse-logo.png'),
    figures: [
      { label: 'Profit / mo', value: '$25,197', kind: 'profit' },
      { label: 'Revenue / mo', value: '$89,988', kind: 'revenue' },
      { label: 'Margin', value: '28%', kind: 'plain' },
    ],
  },
];

/* Inlined as a data: URI. The page is loaded with setContent, so it has no
 * origin and a relative or file:// image would not load. */
function dataUri(path) {
  const ext = path.split('.').pop().toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
  return `data:${mime};base64,${readFileSync(path).toString('base64')}`;
}

/* The palette is the site's, not a new one: ink, the two series hues from
 * globals.css, and the red the verification ladder gives the estimated rung.
 * No green anywhere — green means verified, and nothing on this card is. */
const CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: space-between; padding: 64px 72px;
    background: #fff; color: #16181d;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .top { display: flex; align-items: flex-start; justify-content: space-between; gap: 40px; }
  .logo { height: 110px; max-width: 420px; object-fit: contain; }
  .badge {
    flex: none; border: 2px solid #b3261e; color: #b3261e; border-radius: 999px;
    padding: 8px 20px; font-size: 22px; font-weight: 700; letter-spacing: .04em;
    text-transform: uppercase; white-space: nowrap;
  }
  h1 { font-size: 72px; line-height: 1.05; letter-spacing: -.02em; }
  .what { font-size: 30px; color: #5b6472; margin-top: 14px; }
  .figs { display: flex; gap: 20px; }
  .fig { flex: 1; border: 3px solid #d9dde3; border-radius: 16px; padding: 22px 26px; }
  .fig[data-kind="profit"] { border-color: #16181d; }
  .fig[data-kind="revenue"] { border-color: #1668dc; }
  .fig .label {
    font-size: 20px; letter-spacing: .06em; text-transform: uppercase; color: #5b6472;
  }
  .fig .value {
    font-size: 54px; font-weight: 700; margin-top: 6px;
    font-variant-numeric: tabular-nums; letter-spacing: -.01em;
  }
  .foot {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 22px; color: #5b6472; border-top: 2px solid #d9dde3; padding-top: 22px;
  }
  .foot strong { color: #16181d; }
`;

const card = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
  <div class="top">
    <img class="logo" src="${dataUri(c.logo)}" alt="" />
    <span class="badge">◯ Estimated</span>
  </div>
  <div>
    <h1>${c.brand}</h1>
    <div class="what">${c.what}</div>
  </div>
  <div class="figs">
    ${c.figures
      .map(
        (f) => `<div class="fig" data-kind="${f.kind}">
      <div class="label">${f.label}</div><div class="value">${f.value}</div>
    </div>`,
      )
      .join('\n    ')}
  </div>
  <div class="foot">
    <span><strong>verifiedmargins.com</strong> · modelled from public data</span>
    <span>Every figure names its source</span>
  </div>
</body></html>`;

mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: chromePath(),
  headless: 'new',
  args: ['--no-sandbox'],
});
for (const c of CARDS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(card(c), { waitUntil: 'load' });
  const out = join(outDir, `${c.slug}.png`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`build-og: wrote public/og/${c.slug}.png`);
  await page.close();
}
await browser.close();
