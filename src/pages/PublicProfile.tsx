import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  PublicProfilePage,
  listProfiles,
  useBrand,
  useSession,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";
// DEMO_PROFILE — delete this import with src/demo/. See that file's header.
import { ConsultationDemo } from "@/demo/ConsultationDemo";

/**
 * A seller profile at verifiedmargins.com/<username>.
 *
 * 🚨 PUBLIC. No auth guard, and there must never be one — this is the page the
 * whole product exists to produce, and it has to render for a signed-out
 * visitor, a crawler and an AI assistant identically. scripts/build-profiles.mjs
 * bakes a static copy of each one at build time for exactly that reason.
 *
 * ── If you own it, this page IS the editor (the x.com model) ──────────────
 * Ownership is resolved HERE, in the host, because it is SESSION knowledge and
 * the shared renderer is deliberately session-free — it takes the answer, not
 * the question. The mapping username → profile id comes from the caller's OWN
 * `GET /v1/profiles`, which returns only their own profiles, so nothing here
 * can be used to discover that somebody else's handle exists. With `owner`
 * set, the shared page reads `GET /v1/profiles/:id/preview` (the same builder
 * as the public endpoint, so the owner and the world cannot end up looking at
 * different pages) and turns the fields the payload already carries into
 * inputs, in place.
 *
 * /settings is not going anywhere: the username, the picture, connected
 * accounts and publishing still live there, and the owner bar links to it.
 */
export function PublicProfile() {
  const { username = "" } = useParams();
  const navigate = useNavigate();
  const brand = useBrand();
  const { status } = useSession();
  /** `null` = not mine (or not signed in). `undefined` = don't know yet. */
  const [owner, setOwner] = useState<{ profileId: string; published: boolean } | null | undefined>(
    undefined,
  );

  useEffect(() => {
    document.title = `${username} — ${brand.displayName}`;
  }, [username, brand.displayName]);

  /* Only asked when there is a session — a signed-out visitor must never
   * trigger an authenticated call, and during the static build there is no
   * session at all, so the prerendered copy is always the public one. */
  useEffect(() => {
    if (status === "loading") {
      setOwner(undefined);
      return;
    }
    if (status !== "authenticated") {
      setOwner(null);
      return;
    }
    let cancelled = false;
    listProfiles()
      .then((mine) => {
        if (cancelled) return;
        // Usernames are stored lower-cased; the address bar is not.
        const handle = username.trim().toLowerCase();
        const found = mine.find((p) => p.username.toLowerCase() === handle);
        setOwner(found ? { profileId: found.id, published: found.published } : null);
      })
      .catch(() => {
        // Not being able to answer "is this mine?" is not an error worth
        // showing on someone's public page — fall back to the public view,
        // which is what a stranger would get anyway.
        if (!cancelled) setOwner(null);
      });
    return () => {
      cancelled = true;
    };
  }, [status, username]);

  /* Hold the render until ownership is settled. Mounting the public view
   * first and swapping it for the owner's would cost a second fetch, and on
   * an UNPUBLISHED profile it would flash "No profile here." at the person
   * who owns it — the public endpoint 404s that on purpose. */
  if (owner === undefined) {
    return (
      <Shell width="profile">
        <p>Loading…</p>
      </Shell>
    );
  }

  return (
    <Shell width="profile">
      <div className="vm-form vm-profile">
        {/* DEMO_PROFILE — renders for one username only, returns null for
            every other profile, and portals itself under the name. Delete
            with src/demo/. */}
        <ConsultationDemo username={username} />
        <PublicProfilePage
          username={username}
          owner={
            owner
              ? { ...owner, actions: <Link to="/settings">Profile settings →</Link> }
              : null
          }
          // A released username 301s to its current one. Router push rather
          // than a reload: same origin now that the app owns the apex.
          onMoved={(to) => navigate(`/${to}`, { replace: true })}
        />
      </div>
    </Shell>
  );
}
