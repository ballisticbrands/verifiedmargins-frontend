import { useState } from "react";

const STORAGE_KEY = "vm_announcement_dismissed_v1";

/**
 * Site-wide anonymity notice.
 *
 * Rendered by <Shell>, so it appears on every page including public profiles —
 * which is the point. The people who most need to read it are sellers landing
 * cold on someone else's profile, wondering what publishing their own numbers
 * would expose about them.
 *
 * Dismissible, and the dismissal sticks per browser. First-time visitors — the
 * audience this is written for — still always see it; only people who have read
 * it and closed it get it out of the way.
 *
 * 🔑 The key is versioned (`…_v1`). If the wording ever changes materially,
 * bump it so people who dismissed the old notice are shown the new one instead
 * of having it silently suppressed forever.
 *
 * Coloured with --verified-tint / --verified rather than a warning palette:
 * this is reassurance, not a caution. 6.0:1, per the token comment in
 * globals.css.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    // Storage can throw outright (private windows, blocked site data). A
    // public page must never fail to render over a dismissal preference.
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* no storage: show it, which is the safe default for a promise */
      return false;
    }
  });

  if (dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* it still stays closed for this page view */
    }
  }

  return (
    <div data-announcement="" role="note">
      <p>
        VerifiedMargins.com will <strong>NEVER</strong> post brand-identifying
        information. All information is completely anonymous. Only the raw
        numbers are shared.
      </p>
      <button
        type="button"
        onClick={dismiss}
        data-announcement-close=""
        aria-label="Dismiss this notice"
      >
        {/* Inline so it inherits currentColor and needs no icon import. */}
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
          <path
            d="M4 4 L12 12 M12 4 L4 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
