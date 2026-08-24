import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  PublicProfilePage,
  listProfiles,
  useBrand,
  useSession,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * A published seller profile at verifiedmargins.com/<username>.
 *
 * 🚨 PUBLIC. No auth guard, and there must never be one — this is the page the
 * whole product exists to produce, and it has to render for a signed-out
 * visitor, a crawler and an AI assistant identically. scripts/build-profiles.mjs
 * bakes a static copy of each one at build time for exactly that reason.
 */
export function PublicProfile() {
  const { username = "" } = useParams();
  const navigate = useNavigate();
  const brand = useBrand();
  const { status } = useSession();
  const [ownsIt, setOwnsIt] = useState(false);

  useEffect(() => {
    document.title = `${username} — ${brand.displayName}`;
  }, [username, brand.displayName]);

  /* Ownership decides whether the edit link shows. Only asked when there is a
   * session — a signed-out visitor must never trigger an authenticated call,
   * and during the static build there is no session at all, so the prerendered
   * copy is always the public one. */
  useEffect(() => {
    if (status !== "authenticated") {
      setOwnsIt(false);
      return;
    }
    let cancelled = false;
    listProfiles()
      .then((mine) => {
        if (!cancelled) setOwnsIt(mine.some((p) => p.username === username));
      })
      .catch(() => {
        // Not being able to answer "is this mine?" is not an error worth
        // showing on someone's public page — just don't offer the link.
        if (!cancelled) setOwnsIt(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, username]);

  return (
    <Shell width="wide">
      <div className="vm-form">
        <PublicProfilePage
          username={username}
          actions={ownsIt ? <Link to="/settings">Edit your profile →</Link> : null}
          // A released username 301s to its current one. Router push rather
          // than a reload: same origin now that the app owns the apex.
          onMoved={(to) => navigate(`/${to}`, { replace: true })}
        />
      </div>
    </Shell>
  );
}
