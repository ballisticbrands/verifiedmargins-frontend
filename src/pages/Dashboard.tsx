import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  VerifyEmailBanner,
  reconcileConnectionActivations,
  useBrand,
  useSession,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * Placeholder dashboard.
 *
 * ⚠️ Still deliberately plain, but no longer empty: the backend profile models,
 * brand.ts row and CORS entry have landed, so /settings is a real screen that
 * edits a real profile. This screen's remaining jobs are to be the post-signup
 * destination so the funnel events fire against something genuine, and to host
 * the connection reconcile below.
 */
export function Dashboard() {
  const { user } = useSession();
  const brand = useBrand();

  useEffect(() => {
    document.title = `Dashboard — ${brand.displayName}`;
  }, [brand.displayName]);

  // 🚨 Activations fire from SERVER state, not from the OAuth popup's
  // postMessage. reconcileConnectionActivations() reads /v1/connections on
  // dashboard mount and fires anything this browser hasn't logged yet, deduped
  // by connection id — so `connect_amazon` (+ connect_amazon_seller /
  // connect_amazon_ads) still land when the popup is blocked or closed early.
  // The old postMessage-only path silently lost conversions and cost a sibling
  // product its first real connection. Do NOT reintroduce a direct fire in the
  // popup handler.
  useEffect(() => {
    void reconcileConnectionActivations();
  }, []);

  return (
    <Shell width="wide">
      {user?.email ? <VerifyEmailBanner email={user.email} /> : null}
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        {user?.name ? `Hi, ${user.name}` : "Dashboard"}
      </h1>
      <p className="mt-3 text-sm opacity-70">
        Your account exists and your profile handle is reserved. Nothing is public
        until you publish it.
      </p>
      <p className="mt-3 text-sm">
        <Link to="/settings">Edit your profile →</Link>
      </p>
    </Shell>
  );
}
