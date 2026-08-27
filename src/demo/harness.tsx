import { useEffect, useRef } from "react";

/**
 * The seam every demo page is built on.
 *
 * ── Why a fetch seam rather than a prop ──────────────────────────────────
 * The pages a demo wants to show — `PublicProfilePage`, `Leaderboard` — take
 * an identity and fetch; none of them takes a data prop, and the state-free
 * bodies underneath are deliberately not exported ("a seam, not API"). Rather
 * than reimplement a layout — which would drift from the real page the first
 * time either changed — a demo answers the one request the page makes. What
 * renders IS the production component, so a demo is always a truthful picture
 * of the page.
 *
 * This lives here rather than inside one demo page because the ordering and
 * lifecycle rules below are subtle, were learned the hard way, and a second
 * copy of them is a second chance to get them wrong.
 */

/** Answers a request, or returns `undefined` to let it go to the network. */
export type DemoResponder = (url: URL) => unknown;

const realFetch = window.fetch;
/* Keyed by responder identity rather than counted, so a double-mount cannot
   leave a dangling override behind: removing the same responder twice is a
   no-op instead of an unbalanced decrement. */
const responders = new Set<DemoResponder>();

function install(respond: DemoResponder) {
  responders.add(respond);
  if (responders.size > 1) return;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const href =
      typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(href, window.location.origin);
    for (const respondTo of responders) {
      const body = respondTo(url);
      if (body !== undefined) {
        return new Response(JSON.stringify(body), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
    }
    return realFetch(input, init);
  };
}

function uninstall(respond: DemoResponder) {
  responders.delete(respond);
  if (responders.size === 0) window.fetch = realFetch;
}

/**
 * Patches `window.fetch` for as long as the calling demo page is mounted.
 *
 * 🚨 Installed SYNCHRONOUSLY in the component body, because a parent's effect
 * runs AFTER its children's — by the time a mount effect here fired, the real
 * page below had already sent its request to the network and rendered the
 * failure.
 *
 * The effect then installs again (a no-op on first mount — the Set dedupes)
 * so StrictMode's simulated remount, which runs cleanup and then the effects
 * a second time, puts the patch back rather than tearing it down for good in
 * dev.
 */
export function useDemoFetch(respond: DemoResponder) {
  /* The live closure, so navigating between two demos — same route, no
     remount, only `slug` changes — answers with the fixture now on screen
     rather than the one that was on screen at first render. */
  const latest = useRef(respond);
  latest.current = respond;

  const stable = useRef<DemoResponder | null>(null);
  if (!stable.current) {
    stable.current = (url) => latest.current(url);
    install(stable.current);
  }
  useEffect(() => {
    const fn = stable.current!;
    install(fn);
    return () => uninstall(fn);
  }, []);
}

/**
 * "DEMO — illustrative figures".
 *
 * The one deliberate deviation from the real page, and it is here because
 * these figures are invented while the page around them is indistinguishable
 * from a genuinely verified one. Drop it from a demo only if that demo needs
 * to look untouched.
 */
export function DemoBanner() {
  return (
    <div className="vm-demo-banner" role="note">
      <strong>Demo</strong>
      <span>Illustrative figures — not a verified profile.</span>
    </div>
  );
}

/**
 * Tab title, plus the `noindex, nofollow` meta.
 *
 * The `Disallow:` in robots.txt (DEMO_PAGES → APP_ROUTES in site.mjs) is the
 * other half of this, and neither is redundant: robots.txt stops the crawl,
 * the meta stops an already-known URL from being indexed.
 */
export function useDemoMeta(title: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, [title]);
}
