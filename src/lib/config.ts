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
  apiUrl: (import.meta.env.VITE_API_URL ?? "https://api.getdragonbot.com").replace(/\/$/, ""),
  // Cloudflare Turnstile public site key. Paired with the backend's
  // TURNSTILE_SECRET_KEY. When empty (local dev / preview builds), the shared
  // <Turnstile> widget short-circuits with a "skipped" token, and the backend's
  // verifyTurnstile also skips when its secret is unset — so the two ends stay
  // in agreement with no test-mode plumbing.
  //
  // 🚨 app.verifiedmargins.com must be added to the shared widget's hostname
  // allowlist in the Cloudflare dashboard, or the challenge fails on this host.
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "",
  // Google OAuth Web client ID for "Sign in with Google". Public by design.
  // When empty the shared <GoogleSignInButton> renders nothing at all — so a
  // missing button here is almost always an empty client ID, not a bug.
  // 🚨 https://app.verifiedmargins.com must be on the client's Authorized
  // JavaScript origins in the Google Cloud console (~5 min to propagate).
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
};
