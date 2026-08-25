import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { listProfiles } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * `/profile` — the nav's destination, which resolves where "your profile"
 * actually is and then gets out of the way.
 *
 * 🚨 THIS EXISTS BECAUSE A COMPUTED href IS A GUESS. The header used to ask
 * `listProfiles()` itself and seed the link at "/settings" until the answer
 * came back. Two ways that lands you on /settings with a perfectly current
 * bundle, both of which were reported as "the Profile link is still broken":
 *
 *   1. THE RACE. The nav renders the moment the session is authenticated;
 *      the profile list is a round trip. Click inside that window and you
 *      follow the placeholder.
 *   2. THE SWALLOWED FAILURE. A 502, an expired token, an offline blip —
 *      the catch quietly kept "/settings", which is indistinguishable from
 *      "you have nothing published" and indistinguishable to the user from
 *      the bug that was supposedly fixed.
 *
 * A literal href cannot be stale, and resolving on arrival means a failure
 * has somewhere to be SEEN. See
 * sellerconnect skills/feature-dev/open/BUG_VM_2026-08-25_profile-page-not-editable-in-place.
 *
 * ⚠️ "profile" is in the backend's RESERVED_USERNAMES
 * (src/services/profiles/usernames.ts), so this path can never be shadowed
 * by a seller's handle via the /:username catch-all. It is also in
 * APP_ROUTES (src/data/site.mjs) so Pages answers 200 and robots skips it.
 */
export function ProfileRedirect() {
  const [to, setTo] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listProfiles()
      .then((mine) => {
        if (cancelled) return;
        /* The data model is many-to-many on purpose (a user may own more than
         * one profile), so prefer a PUBLISHED one rather than assuming the
         * first row is the one they mean.
         *
         * An UNPUBLISHED profile with a real handle still goes to its own
         * page: it renders for its owner from GET /v1/profiles/:id/preview,
         * carries a "only you can see this" banner and is editable in place.
         * A stranger asking for that same handle still gets the backend's
         * plain 404 — unpublished and never-taken are the same answer — so
         * this is not an existence oracle, it is the owner reading their own
         * row.
         *
         * A vm-… placeholder handle is the one case that must still go to
         * /settings: publishing is refused until a real username is chosen,
         * so /settings is the honest next step and the URL is not one anybody
         * should be shown. */
        const usable = mine.filter((p) => p.username && !p.username_is_placeholder);
        const shown = usable.find((p) => p.published) ?? usable[0];
        setTo(shown ? `/${shown.username}` : "/settings");
      })
      .catch((err: unknown) => {
        // Deliberately NOT a silent fall back to /settings. That is the exact
        // behaviour that made a broken lookup look like a working link.
        if (!cancelled) setFailed(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (to) return <Navigate to={to} replace />;

  return (
    <Shell width="wide">
      {failed ? (
        <div role="alert">
          <p>We couldn't work out where your profile lives: {failed}</p>
          <p>
            <Link to="/settings">Open profile settings</Link> — your handle, connected
            accounts and publishing all live there.
          </p>
        </div>
      ) : (
        <p>Taking you to your profile…</p>
      )}
    </Shell>
  );
}
