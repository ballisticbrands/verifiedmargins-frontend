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
const OPTIONS = [
  { connectionId: "c1", name: "Acme US", provider: "amazon_selling_partner", linked: false, cogsBasis: "per_sku", blendedCogsPct: null },
  { connectionId: "c2", name: "Acme UK", provider: "amazon_selling_partner", linked: true, cogsBasis: "blended_pct", blendedCogsPct: 32 },
];
const ROUTES = [
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
  { route: "/sign-up", auth: false, name: "signup" },
  { route: "/sign-in", auth: false, name: "signin" },
  { route: "/dashboard", auth: true, name: "dashboard" },
  { route: "/settings", auth: true, name: "settings" },
];

const browser = await puppeteer.launch({
  executablePath: chromePath(), headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const { route, auth, name } of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
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
