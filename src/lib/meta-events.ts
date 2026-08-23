/**
 * Meta standard-event correction.
 *
 * 🚨 The bug this exists for: @ballisticbrands/frontend-shared fires
 * `fbq("trackCustom", "CompleteRegistration", …)` inside
 * identifyUserAcrossPlatforms(). CompleteRegistration is a Meta **standard**
 * event; sending it via trackCustom makes Meta file it as a custom event, which
 * forfeits Meta's cross-advertiser optimization priors and its Aggregated Event
 * Measurement slot — i.e. iOS delivery. It looks completely fine in Events
 * Manager, just filed under the wrong kind.
 *
 * The correct fix belongs in the shared package and has been outstanding since
 * 2026-08-02, so every new product inherits it. Confirmed still present in the
 * published 0.7.x AND in the unpublished 0.8.0 that every sibling repo has in
 * node_modules. This is the local workaround.
 *
 * Confirmed still present in 0.8.0 (published 2026-08-23), which is what this
 * repo pins.
 * **Delete this module** once frontend-shared ships the fix, or the two will
 * fight over the same call.
 *
 * The rewrite is split out as a pure function so it can be tested without a
 * browser — see scripts/test-meta-events.mjs. Testing it through a live `fbq`
 * does not work: fbevents.js drains and replaces the stub's queue as soon as it
 * loads, so there is nothing left to inspect.
 */

/** Meta's standard events. Anything not on this list must stay trackCustom. */
export const META_STANDARD_EVENTS = new Set([
  "AddPaymentInfo", "AddToCart", "AddToWishlist", "CompleteRegistration",
  "Contact", "CustomizeProduct", "Donate", "FindLocation", "InitiateCheckout",
  "Lead", "Purchase", "Schedule", "Search", "StartTrial", "SubmitApplication",
  "Subscribe", "ViewContent",
]);

/**
 * Rewrite a single fbq(...) argument list, returning a new list.
 * `trackCustom` + a standard event name → `track`. Everything else untouched.
 */
export function rewriteMetaArgs(args: unknown[]): unknown[] {
  if (args[0] === "trackCustom" && typeof args[1] === "string" && META_STANDARD_EVENTS.has(args[1])) {
    return ["track", ...args.slice(1)];
  }
  return args;
}

/**
 * Wrap the installed `window.fbq` so every call passes through rewriteMetaArgs.
 * Must run AFTER the base pixel snippet, so it wraps the real fbq.
 */
export function fixMetaStandardEvents(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.fbq !== "function") return;
  const original = w.fbq;
  const wrapped = function (this: unknown, ...args: unknown[]) {
    return original.apply(this, rewriteMetaArgs(args));
  };
  // fbq carries state (queue, callMethod, loaded, version) that fbevents.js
  // reads when it finishes loading. Copy it across or the pixel breaks on load.
  Object.assign(wrapped, original);
  w.fbq = wrapped;
  w._fbq = wrapped;
}
