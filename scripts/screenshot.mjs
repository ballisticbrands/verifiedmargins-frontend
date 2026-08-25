/* Screenshot the app's real pages with the API stubbed.
 *
 * ── Why this exists ──────────────────────────────────────────────────────
 * Every page worth looking at is behind auth and behind a backend, so there is
 * no way to SEE this app without either logging in against production or
 * standing the whole stack up locally. That meant UI defects shipped unseen —
 * and two were found the first time this ran:
 *
 *   1. `globals.css` defined only --background and --foreground, while the
 *      shared package's components are built against ten CSS variables. Every
 *      <Button> resolved to `background: ` — no surface at all, so "Sign in"
 *      rendered as bare text. Nothing errored.
 *   2. The shared <Input> hardcodes `bg-white` and sets no text colour, so in
 *      dark mode the value inherited near-white ON white: ~1.1:1, i.e. what you
 *      type is invisible. Placeholders looked fine, which is how it survived.
 *
 * Neither is visible in source review, and neither throws. Look at the pages.
 *
 * ── Usage ────────────────────────────────────────────────────────────────
 *   npm run build && node scripts/screenshot.mjs [--light] [--out DIR]
 *
 * Requires Chrome (CHROME_PATH, or the usual per-platform locations).
 * Output is gitignored — these are for looking at, not for committing.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const light = process.argv.includes("--light");
const outIdx = process.argv.indexOf("--out");
const outDir = outIdx > -1 ? process.argv[outIdx + 1] : join(root, "screenshots");

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const c = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
  ].find((p) => existsSync(p));
  if (!c) { console.error("screenshot: no Chrome found; set CHROME_PATH"); process.exit(1); }
  return c;
}

if (!existsSync(dist)) { console.error("screenshot: dist/ missing — run npm run build"); process.exit(1); }
mkdirSync(outDir, { recursive: true });

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const srv = createServer((q, r) => {
  let f = join(dist, decodeURIComponent(q.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) f = join(dist, "index.html"); // SPA fallback
  r.writeHead(200, { "Content-Type": MIME[extname(f)] ?? "application/octet-stream" });
  r.end(readFileSync(f));
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const port = srv.address().port;

/* Fixtures. Field names must match what the API actually returns — an invented
 * one renders as NaN and reads like a bug in the page. */
const USER = { id: "u1", email: "seller@example.com", name: "Test Seller", emailVerifiedAt: null };
const PROFILE = {
  id: "p1", username: "vm-efc298a568", type: "seller", sellerType: "private_label",
  displayName: "Acme Brands", bio: "We sell things.", avatarUrl: "", websiteUrl: "https://acme.test",
  socials: {}, published: false, verification: "unverified", verifiedAt: null, verifiedNote: null,
  visibility: {}, username_changes_used: 0, username_changes_limit: 2, connections: [],
};
/* Mirrors the real wire shape from connectionToWire — including the duplicate
 * store name, which is the case `countries` exists to disambiguate. */
const OPTIONS = [
  { id: "c1", provider: "amazon_selling_partner", name: "Paramint Designs", account_type: null,
    countries: ["US"], cogs_basis: "per_sku", blended_cogs_pct: null, linked_here: true, linked_elsewhere: false },
  { id: "c2", provider: "amazon_selling_partner", name: "Paramint Designs", account_type: null,
    countries: ["CA", "MX"], cogs_basis: "blended_pct", blended_cogs_pct: 32, linked_here: false, linked_elsewhere: false },
  { id: "c3", provider: "amazon_ads", name: "Ballas & Ballas", account_type: "seller",
    countries: ["CA", "MX", "US"], cogs_basis: "per_sku", blended_cogs_pct: null, linked_here: false, linked_elsewhere: false },
  { id: "c4", provider: "amazon_ads", name: "Ballas & Ballas", account_type: "agency",
    countries: ["US"], cogs_basis: "per_sku", blended_cogs_pct: null, linked_here: false, linked_elsewhere: true },
];
/* The public profile — the page the whole product exists to produce, and the
 * one the brand system lands hardest on (badge, headline figure, tabular
 * metrics, avatar). Shape mirrors buildPublicProfile()'s payload; a field
 * invented here renders as NaN and reads like a page bug.
 *
 * Two fixtures because the two verification states MUST look different, and a
 * screenshot of only one proves nothing about that. */
/* Twelve months with a seasonal Q4 lift and one month whose COGS coverage is
 * incomplete — the null is deliberate: a gap in the line must read as "not
 * computable", never as a zero. */
const MONTHS = [
  ["2025-09", 132000, 41], ["2025-10", 158000, 39], ["2025-11", 246000, 33],
  ["2025-12", 311000, 30], ["2026-01", 176000, 34], ["2026-02", 149000, 36],
  ["2026-03", 163000, 35], ["2026-04", 171000, null], ["2026-05", 184000, 33],
  ["2026-06", 192000, 32], ["2026-07", 187000, 31], ["2026-08", 96000, 30],
].map(([month, revenue, marginPct]) => ({
  month, currency: "USD", revenue,
  units: Math.round(revenue / 44), orders: Math.round(revenue / 51),
  profit: marginPct === null ? null : Math.round(revenue * (marginPct / 100)),
}));

function publicProfile(over = {}) {
  return {
    username: "acme", display_name: "Acme Brands", bio: "Private-label kitchen gear. Eight years, two people.",
    avatar_url: null, website_url: "https://acme.test", socials: { x: "acmebrands", reddit: "u/acmebrands" },
    seller_type: "private_label", type: "seller", claimed: true, noindex: false,
    verification: {
      tier: "verified_margin", label: "Verified margin",
      description: "Revenue, fees and ad spend come straight from Amazon, and margin is computed from per-SKU costs the seller uploaded.",
      revenueSource: "spapi", marginBasis: "per_sku", verified_at: "2026-08-24T00:00:00.000Z", note: null,
    },
    window: { months: 12, from: "2025-09", through: "2026-08", includes_partial_month: true },
    visibility: { margin: true, sales: true, skuCount: true, brands: true, category: true },
    metrics: {
      native: [{ currency: "USD", revenue: 2140000, units: 48210, orders: 41880, fees: -412000,
                 ad_spend: -186000, cogs: 861000, profit: 681000, margin_pct: 31.8, cogs_complete: true }],
      display: { currency: "USD", revenue: 2140000, fees: -412000, ad_spend: -186000, cogs: 861000,
                 profit: 681000, margin_pct: 31.8, fx: { as_of: "2026-08-01", source: "builtin-placeholder", unconvertible: [] } },
      series: MONTHS, margin_series: MONTHS.map((m) => ({
        month: m.month,
        margin_pct: m.profit === null ? null : (m.profit / m.revenue) * 100,
      })),
      margin_pct: 31.8, margin_basis: "per_sku", margin_note: null,
      sku_count: 62, brand_count: 3, brands_label: "Brands sold", category: "Home & Kitchen",
      categories: [{ name: "Home & Kitchen", revenue: 2140000 }],
    },
    currency_options: ["USD", "EUR", "GBP"], notes: [],
    ...over,
  };
}
const ESTIMATED = publicProfile({
  username: "e/8x2k9", display_name: "An FBA seller in Home & Kitchen", claimed: false, noindex: true,
  bio: null, socials: {}, website_url: null,
  verification: {
    tier: "estimated", label: "Estimated",
    description: "These numbers are estimated from public data and reviewed by our team. They are not verified against the seller's Amazon account.",
    revenueSource: "manual", marginBasis: "blended_pct", verified_at: null, note: null,
  },
  metrics: { ...publicProfile().metrics, margin_basis: "blended_pct" },
});

/* Margin public, revenue private — the combination the product's premise
 * rests on. `series` and `display` are null (the backend gates them on
 * visibility.sales) while `margin_series` still arrives, so the page must
 * plot a trend that discloses no absolute figure. If a revenue number ever
 * appears on this screenshot, the gating broke. */
const MARGIN_ONLY = publicProfile({
  username: "quietseller", display_name: "Quiet Seller",
  bio: "Margin is public. Revenue is nobody's business.",
  visibility: { margin: true },
  metrics: {
    ...publicProfile().metrics,
    native: null, display: null, series: null,
    sku_count: null, brand_count: null, category: null, categories: null,
  },
});

const ROUTES = [
  [/\/v1\/public\/profiles\/e%2F|\/v1\/public\/profiles\/8x2k9/, ESTIMATED],
  [/\/v1\/public\/profiles\/quietseller/, MARGIN_ONLY],
  [/\/v1\/public\/profiles\//, publicProfile()],
  [/\/v1\/profiles\/username-available/, { available: true }],
  [/\/v1\/profiles\/[^/]+\/connection-options/, OPTIONS],
  [/\/v1\/profiles\/[^/]+$/, PROFILE],
  [/\/v1\/profiles$/, [PROFILE]],
];
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "*",
};

const PAGES = [
  { route: "/login", auth: false, name: "login" },
  { route: "/dashboard", auth: true, name: "dashboard" },
  { route: "/settings", auth: true, name: "settings" },
  { route: "/acme", auth: false, name: "profile-verified" },
  { route: "/8x2k9", auth: false, name: "profile-estimated" },
  { route: "/quietseller", auth: false, name: "profile-margin-only" },
];

const browser = await puppeteer.launch({
  executablePath: chromePath(), headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const { route, auth, name } of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  /* The site is light-only (globals.css has no dark override), so this is
     asserting rather than choosing: emulating a DARK OS preference and still
     getting a light page is the check that no stray `prefers-color-scheme`
     rule crept back in. `--light` flips the emulated preference, not the
     product. */
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: light ? "light" : "dark" },
  ]);
  await page.setRequestInterception(true);
  page.on("request", (r) => {
    const u = r.url();
    if (u.includes("api.getdragonbot.com")) {
      if (r.method() === "OPTIONS") return r.respond({ status: 204, headers: CORS });
      if (/auth\/me/.test(u)) {
        return auth
          ? r.respond({ status: 200, contentType: "application/json", headers: CORS, body: JSON.stringify(USER) })
          : r.respond({ status: 401, contentType: "application/json", headers: CORS, body: "{}" });
      }
      for (const [re, body] of ROUTES) {
        if (re.test(u)) return r.respond({ status: 200, contentType: "application/json", headers: CORS, body: JSON.stringify(body) });
      }
      return r.respond({ status: 200, contentType: "application/json", headers: CORS, body: "{}" });
    }
    // Never let a screenshot run fire real analytics.
    if (/googletagmanager|clarity\.ms|connect\.facebook|google-analytics/.test(u)) {
      return r.abort().catch(() => {});
    }
    r.continue().catch(() => {});
  });
  if (auth) await page.evaluateOnNewDocument(() => localStorage.setItem("dragonbot_session", "stub"));

  await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle2", timeout: 45_000 });
  await new Promise((r) => setTimeout(r, 2_000));
  const file = join(outDir, `${name}${light ? "-light" : ""}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  ${route} → ${file}`);
  await page.close();
}

await browser.close();
srv.close();
