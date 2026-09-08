import { Navigate, useParams } from "react-router-dom";
import { DemoSourced } from "./DemoSourced";
import { findDossier } from "@/dossiers/registry";

/**
 * /brand/<slug> — a published sourced dossier.
 *
 * The real-site counterpart to /demo/<slug>. Same component, same data, no
 * demo chrome: see the mode note on DemoSourced, and src/dossiers/registry.ts
 * for what publishing one commits us to.
 *
 * An unknown slug redirects to the leaderboard rather than rendering an empty
 * page. It cannot 404 usefully from inside the SPA — the static page for a
 * real slug is written by build-dossiers.mjs, so anything reaching this
 * component with a slug it does not know is either a typo or a page that has
 * been retired, and the board is the right place for both.
 */
export function BrandDossier() {
  const { slug = "" } = useParams();
  const dossier = findDossier(slug);
  if (!dossier) return <Navigate to="/leaderboard" replace />;
  return <DemoSourced demo={{ kind: "sourced", dossier }} mode="public" />;
}
