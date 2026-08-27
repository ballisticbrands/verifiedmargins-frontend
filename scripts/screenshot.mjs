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
/* A phone, because this product's most common first view is a profile link
 * opened from a DM or a post. Portrait 390x844 is an iPhone 14/15 class
 * viewport; deviceScaleFactor 2 so text renders the way it does on the
 * device rather than at desktop hinting. */
const mobile = process.argv.includes("--mobile");
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

/* 30 days for the chart. The backend converts these to the display currency
   and returns one row per DAY — the chart plots them directly, so a fixture
   without `daily` exercises only the monthly fallback. Deterministic, and
   with two zero days so the "a quiet day is a point, not a gap" behaviour is
   visible rather than merely asserted. */
const DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 6, 12 + i));
  const date = d.toISOString().slice(0, 10);
  if (i === 11 || i === 12) return { date, revenue: 0, units: 0, orders: 0, profit: 0 };
  const wobble = [1, 0.82, 0.91, 1.14, 1.06, 0.88, 0.74][d.getUTCDay()];
  const revenue = Math.round(7700 * wobble * (1 + i * 0.012));
  return { date, revenue, units: Math.round(revenue / 44), orders: Math.round(revenue / 51),
           profit: Math.round(revenue * 0.32) };
});

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
      /* Per-connection rows. Two businesses with DIFFERENT badges, because
         that is the case the per-connection change exists for: one synced
         Amazon account and one typed-in legacy business must not share a
         verdict. */
      businesses: [
        { platform: "amazon_selling_partner", label: "Amazon FBA", markets: ["US", "CA"], seller_type: "private_label",
          last_30d: { revenue: 164000, profit: 54000, margin_pct: 32.9 }, revenue: 1840000,
          margin_pct: 33.1, verification: { tier: "verified_margin", label: "Verified margin" } },
        { platform: "amazon_selling_partner", label: "Amazon FBA", markets: ["DE", "FR"],
          seller_type: "private_label",
          last_30d: { revenue: 41000, profit: 11800, margin_pct: 28.8 }, revenue: 402000,
          margin_pct: 29.1, verification: { tier: "verified_revenue", label: "Verified revenue" } },
        { platform: "manual", label: "Self-reported", markets: [], seller_type: "wholesaler",
          last_30d: { revenue: 26000, profit: 6200, margin_pct: 23.8 }, revenue: 300000,
          margin_pct: 24.0, verification: { tier: "self_reported", label: "Self-reported" } },
      ],
      last_30d: { revenue: 231000, profit: 74000, units: 5240, margin_pct: 32.0 },
      daily: DAYS,
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
    last_30d: { revenue: null, profit: null, units: 0, margin_pct: 31.8 },
    businesses: [
      { platform: "amazon_selling_partner", label: "Amazon FBA", markets: ["US"], seller_type: "private_label",
        last_30d: { revenue: null, profit: null, margin_pct: 31.8 }, revenue: null,
        margin_pct: 31.8, verification: { tier: "verified_margin", label: "Verified margin" } },
    ],
    sku_count: null, brand_count: null, category: null, categories: null,
  },
});

const LEADERBOARD = {
  mode: "founder", window_months: 12, note: "2 profiles keep their margin private and are not ranked.",
  entries: [
    { rank: 1, username: "leanlabs", display_name: "Lean Labs", avatar_url: null, business: null,
      margin_pct: 41.2, revenue: 640000, currency: "USD",
      verification: { tier: "verified_margin", label: "Verified margin" } },
    { rank: 2, username: "ggballas", display_name: "Gershon Ballas", avatar_url: null, business: null,
      margin_pct: 31.8, revenue: 2140000, currency: "USD",
      verification: { tier: "verified_margin", label: "Verified margin" } },
    { rank: 3, username: "quietseller", display_name: "Quiet Seller", avatar_url: null, business: null,
      margin_pct: 27.4, revenue: null, currency: "USD",
      verification: { tier: "verified_revenue", label: "Verified revenue" } },
  ],
};

const ROUTES = [
  [/\/v1\/public\/leaderboard/, LEADERBOARD],
  [/\/v1\/public\/profiles\/e%2F|\/v1\/public\/profiles\/8x2k9/, ESTIMATED],
  [/\/v1\/public\/profiles\/quietseller/, MARGIN_ONLY],
  [/\/v1\/public\/profiles\//, publicProfile()],
  [/\/v1\/profiles\/username-available/, { available: true }],
  [/\/v1\/profiles\/[^/]+\/connection-options/, OPTIONS],
  [/\/v1\/profiles\/[^/]+$/, PROFILE],
  [/\/v1\/profiles$/, [PROFILE]],
];
/* The stub converts, because the top bar's currency picker is a control whose
 * ONLY visible effect is that the figures change. A stub that answered in
 * dollars whatever was asked would render an identical page for every
 * selection — and a screenshot run would go on passing with the picker wired
 * to nothing at all. Rates match the backend's builtin table (fx.ts). */
const STUB_RATES = { USD: 1, EUR: 0.92, GBP: 0.78, CAD: 1.36, AUD: 1.52, JPY: 150 };

/** Field names that hold money. Percentages, counts and dates must not be
 *  touched — converting a margin_pct would be the exact bug this is here to
 *  catch, in reverse. */
const MONEY_KEYS = new Set(["revenue", "profit", "fees", "ad_spend", "cogs"]);

function convertMoney(value, rate, currency) {
  if (Array.isArray(value)) return value.map((v) => convertMoney(v, rate, currency));
  if (value === null || typeof value !== "object") return value;
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (MONEY_KEYS.has(k) && typeof v === "number") out[k] = Math.round(v * rate);
    else if (k === "currency" && typeof v === "string") out[k] = currency;
    else out[k] = convertMoney(v, rate, currency);
  }
  return out;
}

/** Re-price a stub payload into the currency the app actually asked for. */
function inCurrency(body, url) {
  const asked = new URL(url).searchParams.get("currency");
  if (!asked || !STUB_RATES[asked] || asked === "USD") return body;
  const converted = convertMoney(body, STUB_RATES[asked], asked);
  // `native` is what was EARNED, not what is displayed — it must survive the
  // conversion untouched, or the page would claim the seller banked euros.
  if (body?.metrics?.native) converted.metrics.native = body.metrics.native;
  return converted;
}

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
  { route: "/leaderboard", auth: false, name: "leaderboard" },
  /* 🎭 Demo pages render fixture data through the real components — see
   * src/demo/README.md. Worth shooting: a demo that renders wrong is a demo
   * shown to a prospect. */
  { route: "/demo/afrasiab", auth: false, name: "demo-afrasiab" },
  { route: "/demo/afrasiab", auth: false, name: "demo-afrasiab-scheduler", click: "[data-demo-cta]" },
  /* The same profile, read in euros. Proves a non-default currency reaches
     the API and that every figure on the page moves with it — the picker is
     hidden for now, but the path it drives is live and worth guarding. */
  { route: "/acme", auth: false, name: "profile-eur", storage: ["vm.currency", "EUR"] },
  /* The onboarding dialog, in both its shapes: a stranger gets "Who are
     you?", a signed-in seller does not. It is the one flow this product has,
     so both are worth a picture. */
  { route: "/leaderboard", auth: false, name: "add-business", click: "[data-nav-cta]" },
  { route: "/leaderboard", auth: true, name: "add-business-signed-in", click: "[data-nav-cta]" },
];

const browser = await puppeteer.launch({
  executablePath: chromePath(), headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const { route, auth, name, click, storage } of PAGES) {
  /* A FRESH context per shot, not just a fresh page.
   *
   * Pages in one browser share an origin's localStorage, so the currency
   * seeded for the EUR shot followed every page opened after it — the
   * leaderboard quietly rendered in euros, and the screenshot looked like a
   * bug in the leaderboard. A seeded preference must not outlive the shot
   * that asked for it. */
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport(
    mobile
      ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { width: 1280, height: 900 },
  );
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
        if (re.test(u))
          return r.respond({
            status: 200,
            contentType: "application/json",
            headers: CORS,
            body: JSON.stringify(inCurrency(body, u)),
          });
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
  /* Seeded preferences, read at boot. The currency shot goes through storage
     rather than through the top bar's <select> because that control is hidden
     today (SHOW_CURRENCY_PICKER) — and because the thing worth testing is the
     conversion path, which is the same either way. */
  if (storage) {
    const [k, v] = storage;
    await page.evaluateOnNewDocument(
      (key, value) => localStorage.setItem(key, value),
      k,
      v,
    );
  }

  await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: "networkidle2", timeout: 45_000 });
  await new Promise((r) => setTimeout(r, 2_000));
  for (const sel of [click].flat().filter(Boolean)) {
    await page.click(sel).catch(() => console.warn(`  (no ${sel} to click)`));
    await new Promise((r) => setTimeout(r, 350));
  }

  const file = join(outDir, `${name}${mobile ? "-mobile" : ""}${light ? "-light" : ""}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  ${route} → ${file}`);
  await page.close();
  await context.close();
}

await browser.close();
srv.close();
