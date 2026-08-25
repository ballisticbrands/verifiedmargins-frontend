// Build-time configuration. Vite inlines VITE_* env vars into the client
// bundle at build time.
//
// Per-brand values (name, GA4 ID, Clarity ID, header label, support email) do
// NOT live here — they're in src/brands/. Anything you find yourself wanting
// to vary per brand belongs there, not in this file.

export const config = {
  // The shared backend for all brand apps. ⚠️ The env var is VITE_API_URL.
  // It was once named VITE_BACKEND_URL in a sibling repo, which nothing reads —
  // the build succeeded and every API call silently went to the default host.
  //
  // 🚨 DO NOT flip this to https://api.verifiedmargins.com yet, even though
  // that host now serves the same backend and src/data/site.ts already uses
  // it. That constant is build-time (the profile prerender); THIS one is what
  // the browser bundle calls, and flipping it silently breaks the Amazon
  // connect flow — the product's core action:
  //
  //   1. The consent URL's redirect_uri is the backend's
  //      SP_API_EXTERNAL_REDIRECT_URI, https://api.getdragonbot.com/callback,
  //      which is REGISTERED WITH AMAZON and cannot move unilaterally.
  //   2. So Amazon returns the popup to api.getdragonbot.com, and that page
  //      postMessages the result from that origin.
  //   3. frontend-shared's readOAuthResult drops any message whose
  //      event.origin !== new URL(apiUrl).origin. Flip apiUrl and the result
  //      is discarded: VerifyAccounts falls through to its abandoned-popup
  //      poll, resets to idle with NO error, never calls finish() — while the
  //      Connection row was created just fine. A success that reads as a
  //      cancellation.
  //
  // Unblocking it needs frontend-shared to accept a SET of trusted callback
  // origins instead of deriving one from apiUrl. Until that ships and is
  // published, this stays. scripts/screenshot.mjs also matches on
  // "api.getdragonbot.com" and must change in the same commit.
  apiUrl: (import.meta.env.VITE_API_URL ?? "https://api.getdragonbot.com").replace(/\/$/, ""),
  // Cloudflare Turnstile public site key. Paired with the backend's
  // TURNSTILE_SECRET_KEY. When empty (local dev / preview builds), the shared
  // <Turnstile> widget short-circuits with a "skipped" token, and the backend's
  // verifyTurnstile also skips when its secret is unset — so the two ends stay
  // in agreement with no test-mode plumbing.
  //
  // 🚨 verifiedmargins.com must be on the shared widget's hostname
  // allowlist in the Cloudflare dashboard, or the challenge fails on this host.
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "",
  // Google OAuth Web client ID for "Sign in with Google". Public by design.
  // When empty the shared <GoogleSignInButton> renders nothing at all — so a
  // missing button here is almost always an empty client ID, not a bug.
  // 🚨 https://verifiedmargins.com must be on the client's Authorized
  // JavaScript origins in the Google Cloud console (~5 min to propagate).
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
};
