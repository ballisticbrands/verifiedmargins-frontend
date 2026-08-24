/* End-to-end proof that the app's three analytics loaders actually fire.
 *
 * Static inspection cannot tell you this: a loader guarded behind an empty ID,
 * or a gtag shim pushing the wrong shape, looks completely fine in the source
 * and sends nothing at all.
 *
 * The Meta standard-event rewrite is NOT checked here — see the note at the
 * bottom. It is unit-tested in scripts/test-meta-events.mjs.
 *
 * Usage: node scripts/verify-events.mjs [origin]   (default: serves dist/)
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const c = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser', '/usr/bin/chromium',
  ].find(p => existsSync(p));
  if (!c) { console.error('verify-events: no Chrome found; set CHROME_PATH'); process.exit(1); }
  return c;
}

const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon' };
function serve() {
  return new Promise(res => {
    const s = createServer((req, r) => {
      let f = join(dist, decodeURIComponent(req.url.split('?')[0]));
      if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
      if (!existsSync(f)) f = join(dist, 'index.html');   // SPA fallback
      r.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
      r.end(readFileSync(f));
    });
    s.listen(0, '127.0.0.1', () => res(s));
  });
}

let origin = process.argv[2];
let server = null;
if (!origin) {
  if (!existsSync(dist)) { console.error('verify-events: dist/ missing — run npm run build'); process.exit(1); }
  server = await serve();
  origin = `http://127.0.0.1:${server.address().port}`;
}

const browser = await puppeteer.launch({
  executablePath: chromePath(), headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
const beacons = [];
page.on('request', r => {
  const u = r.url();
  if (/google-analytics\.com|analytics\.google\.com|connect\.facebook\.net|facebook\.com\/tr|clarity\.ms/.test(u)) beacons.push(u);
});

await page.goto(`${origin}/login`, { waitUntil: 'networkidle2', timeout: 45_000 });
// The LP loads its pixel from index.html; the app INJECTS all three loaders
// from main.tsx after the bundle executes, so networkidle2 can fire before
// connect.facebook.net is even requested. Give the injected scripts a beat.
await new Promise(r => setTimeout(r, 3000));

let fail = 0;
const ok  = m => console.log(`  ✅ ${m}`);
const bad = m => { console.log(`  ❌ ${m}`); fail++; };

console.log(`\nverify-events (app) — ${origin}\n`);

// ── loaders ─────────────────────────────────────────────────────────────────
const ga = beacons.filter(u => /google-analytics\.com|analytics\.google\.com/.test(u));
ga.length ? ok(`${ga.length} GA4 beacon(s) on the wire`) : bad('GA4 put nothing on the wire');
ga.some(u => new URL(u).searchParams.get('en') === 'page_view')
  ? ok('page_view reached the network') : bad('no page_view beacon');
ga.every(u => new URL(u).searchParams.get('tid') === 'G-B9Y3JRFNT8') && ga.length
  ? ok('every beacon carries tid=G-B9Y3JRFNT8') : bad('a beacon carried the wrong tid');

beacons.some(u => /clarity\.ms/.test(u)) ? ok('Clarity loaded') : bad('Clarity did not load');
// Assert on the LOADER (connect.facebook.net + the dataset's config request),
// not on facebook.com/tr. Meta's fbevents.js detects headless Chrome as a bot
// and suppresses the actual /tr event send, so a /tr assertion fails here even
// when the pixel is perfectly configured. Real event delivery is confirmed in
// Events Manager → Test Events, on cellular.
beacons.some(u => /connect\.facebook\.net/.test(u))
  ? ok('Meta pixel loader requested') : bad('Meta pixel did not load');
beacons.some(u => u.includes('/signals/config/4044834252476491'))
  ? ok('pixel initialised with dataset 4044834252476491')
  : bad('fbevents loaded but never initialised our dataset — check META_PIXEL_ID');

// The gtag shim must push the arguments OBJECT. A rest-param array is silently
// ignored by gtag.js — zero hits, not even page_view.
await page.evaluate(() => { window.__dl = window.dataLayer.length; window.gtag('event', '__probe'); });
(await page.evaluate(() => window.dataLayer.length > window.__dl &&
   typeof window.dataLayer[window.dataLayer.length - 1].length === 'number' &&
   !Array.isArray(window.dataLayer[window.dataLayer.length - 1])))
  ? ok('dataLayer receives the arguments object, not an array')
  : bad('dataLayer got an array — gtag.js will silently drop EVERY hit');

// ── the standard-event fix ──────────────────────────────────────────────────
// Deliberately NOT tested here. track and trackCustom are byte-identical on the
// wire (both emit /tr?…&ev=NAME) — Meta classifies server-side by which method
// was called — and fbevents.js drains the stub's queue the moment it loads, so
// there is no runtime state left to inspect either. The rewrite is unit-tested
// as a pure function instead: scripts/test-meta-events.mjs.
console.log('  ℹ️  CompleteRegistration rewrite is covered by scripts/test-meta-events.mjs');

await browser.close();
if (server) server.close();
console.log(`\n${fail} failing\n`);
process.exit(fail);
