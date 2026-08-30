/**
 * Site-wide anonymity notice.
 *
 * Rendered by <Shell>, so it appears on every page including public profiles —
 * which is the point. The people who most need to read it are sellers landing
 * cold on someone else's profile and wondering what publishing their numbers
 * would expose about them.
 *
 * Deliberately not dismissible: it is a standing promise about what the product
 * does, not a campaign or a one-off notice.
 *
 * Coloured with --verified-tint / --verified rather than a warning palette.
 * This is reassurance, not a caution, and the pairing is 6.0:1 per the token
 * comment in globals.css.
 */
export function AnnouncementBar() {
  return (
    <div data-announcement="" role="note">
      <p>
        VerifiedMargins.com will <strong>NEVER</strong> post brand-identifying
        information. All information is completely anonymous. Only the raw
        numbers are shared.
      </p>
    </div>
  );
}
