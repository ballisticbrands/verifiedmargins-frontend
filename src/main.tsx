import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  BrandProvider,
  captureAttribution,
  configureShared,
} from "@ballisticbrands/frontend-shared";
import App from "./App";
import { activeBrand, META_PIXEL_ID } from "./brands";
import { config } from "./lib/config";
import "./globals.css";

const brand = activeBrand();

// Configure @ballisticbrands/frontend-shared BEFORE any of its functions run.
// Sets the module-level singleton that non-React code (attribution helpers,
// fetch wrapper) reads apiUrl + brand from.
configureShared({
  apiUrl: config.apiUrl,
  brand,
  turnstileSiteKey: config.turnstileSiteKey,
  googleClientId: config.googleClientId,
});

function injectGa4(measurementId: string): void {
  if (!measurementId) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(s);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).dataLayer = (window as any).dataLayer || [];
  // 🚨 gtag.js only processes the `arguments` OBJECT pushed to dataLayer.
  // Pushing a rest-param ARRAY — `dataLayer.push(args)` — is silently ignored,
  // so gtag('config') and every gtag('event') no-op and NO hits are ever sent:
  // not sign_up, not even page_view. That exact bug zeroed a sibling app's GA4
  // for ~10 days with nothing in the console. Push `arguments`, like the
  // canonical snippet does. Do not "modernise" this to a rest param.
  const gtag: (...args: unknown[]) => void = function () {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-explicit-any
    (window as any).dataLayer.push(arguments);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId);
}

function injectClarity(projectId: string): void {
  if (!projectId) return;
  // Verbatim port of the standard Clarity snippet.
  ((c, l, a, r, i) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (c as any)[a] = (c as any)[a] || function () {
      // Clarity's queue, like gtag's, expects the arguments object — not a
      // plain array (see the GA4 note above).
      // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-explicit-any
      ((c as any)[a].q = (c as any)[a].q || []).push(arguments);
    };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y?.parentNode?.insertBefore(t, y);
  })(window, document, "clarity", "script", projectId);
}

// Meta Pixel base snippet. The shared library fires CompleteRegistration /
// ConnectSeller / ConnectAds through `window.fbq`, but only when it already
// exists — nothing in the shared package loads the pixel itself. Without this,
// creating the dataset in Business Manager produces exactly zero app events,
// silently. The LP loads its pixel from index.html; this is the app's
// equivalent, kept here so it's brand-resolved like GA4 and Clarity.
function injectMetaPixel(pixelId: string): void {
  if (!pixelId) return;
  /* eslint-disable @typescript-eslint/no-explicit-any, prefer-rest-params */
  const w = window as any;
  if (w.fbq) return;
  const n: any = (w.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(t);
  /* eslint-enable @typescript-eslint/no-explicit-any, prefer-rest-params */
  w.fbq("init", pixelId);
  w.fbq("track", "PageView");
}

/**
 * Rewrite `fbq('trackCustom', <standard event>)` into `fbq('track', …)`.
 *
 * 🚨 Why this shim exists: @ballisticbrands/frontend-shared (0.7.0) fires
 * `fbq("trackCustom", "CompleteRegistration", …)` inside
 * identifyUserAcrossPlatforms(). CompleteRegistration is a Meta STANDARD event,
 * and sending it via trackCustom makes Meta treat it as a custom event — which
 * forfeits Meta's cross-advertiser optimization priors AND its Aggregated Event
 * Measurement slot, i.e. iOS delivery. It looks fine in Events Manager, just
 * filed under the wrong kind.
 *
 * The correct fix is in the shared package, and it has been outstanding since
 * 2026-08-02 — every new product inherits the bug. This wrapper is the local
 * workaround (the same one dragonrestock-frontend applies). DELETE IT once
 * frontend-shared ships the fix, or the two will fight over the same call.
 *
 * Must be installed AFTER injectMetaPixel(), so it wraps the real fbq.
 */
const META_STANDARD_EVENTS = new Set([
  "CompleteRegistration", "Lead", "ViewContent", "InitiateCheckout", "Purchase",
  "AddToCart", "Search", "Contact", "SubmitApplication", "StartTrial", "Subscribe",
]);
function fixMetaStandardEvents(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.fbq !== "function") return;
  const original = w.fbq;
  const wrapped = function (this: unknown, ...args: unknown[]) {
    if (args[0] === "trackCustom" && typeof args[1] === "string" && META_STANDARD_EVENTS.has(args[1])) {
      args[0] = "track";
    }
    return original.apply(this, args);
  };
  // fbq carries state (queue, callMethod, loaded, version) that fbevents.js
  // reads when it finishes loading. Copy it across or the pixel breaks on load.
  Object.assign(wrapped, original);
  w.fbq = wrapped;
  w._fbq = wrapped;
}

injectGa4(brand.ga4MeasurementId);
injectClarity(brand.clarityId);
injectMetaPixel(META_PIXEL_ID);
fixMetaStandardEvents();

document.title = brand.displayName;
const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) metaDesc.setAttribute("content", brand.metaDescription);

// SPA fallback for GitHub Pages (see public/404.html). MUST run BEFORE
// captureAttribution(), which reads the query string off the real landing URL.
const redirectPath = sessionStorage.getItem("spa-redirect");
if (redirectPath && redirectPath !== "/") {
  sessionStorage.removeItem("spa-redirect");
  window.history.replaceState(null, "", redirectPath);
}

// Snapshot the visitor's first landing into localStorage.
captureAttribution();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrandProvider brand={brand}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BrandProvider>
  </StrictMode>,
);
