import { useEffect } from "react";
import {
  VerifyEmailBanner,
  reconcileConnectionActivations,
  useBrand,
  useSession,
} from "@ballisticbrands/frontend-shared";
import { AuthShell } from "./AuthShell";

/**
 * Placeholder dashboard.
 *
 * ⚠️ The seller-profile product does not exist yet — the backend models,
 * brand.ts row and CORS entry are being built separately. This screen's only
 * job today is to be the real post-signup destination so the funnel events fire
 * against something genuine, and to host the connection reconcile below.
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
    <AuthShell>
      {user?.email ? <VerifyEmailBanner email={user.email} /> : null}
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        {user?.name ? `Hi, ${user.name}` : "Dashboard"}
      </h1>
      <p className="mt-3 text-sm opacity-70">
        Your account exists and your profile handle is reserved. Amazon connection
        and profile publishing are not built yet — this is a placeholder screen.
      </p>
    </AuthShell>
  );
}
