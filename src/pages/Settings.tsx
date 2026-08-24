import { useCallback, useEffect, useState } from "react";
import {
  ProfileSettingsPage,
  listProfiles,
  useBrand,
} from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * Profile settings — the one screen that actually edits the product.
 *
 * ⚠️ DELIBERATELY PLAIN, like everything else here. The form itself lives in
 * @ballisticbrands/frontend-shared as unstyled HTML elements; this file only
 * resolves WHICH profile to edit and wraps it in the app's chrome. When real
 * branding lands, style the shared component (or fork it there, not here) so
 * every brand app gets the same behaviour.
 *
 * ⚠️ THERE IS NO CREATE FALLBACK HERE, AND THAT IS DELIBERATE. This screen used
 * to call createProfile({}) when the list came back empty, as a recovery path
 * for a fire-and-forget backend create. It was not recovering an edge case: it
 * was quietly carrying the entire Google signup flow, which never created a
 * profile at all. Because the repair was silent, nobody noticed for weeks — and
 * a seller who signed up, landed on the dashboard and left still had no page,
 * because the fallback only ran if they happened to open settings.
 *
 * Every VerifiedMargins signup now creates the profile in the same transaction
 * as the account (backend: src/services/auth/provision.ts), so an empty list
 * here means something is genuinely broken and we say so instead of papering
 * over it. POST /v1/profiles still exists — a user may legitimately want a
 * second profile — it just stops being something this page calls behind their
 * back. See skills/feature-dev/…/FEATURE_VM_2026-08-24_profile-on-every-signup-path §4.
 */
export function Settings() {
  const brand = useBrand();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Profile settings — ${brand.displayName}`;
  }, [brand.displayName]);

  const resolve = useCallback(async () => {
    try {
      const mine = await listProfiles();
      if (mine.length > 0) {
        setProfileId(mine[0]!.id);
        return;
      }
      // Loud on purpose. Silently creating one here is what hid the
      // signup bug; the seller needs a human, not a self-heal.
      setError(
        "Your account has no profile yet. That shouldn't happen — please contact support and we'll set it up.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    void resolve();
  }, [resolve]);

  return (
    // `wide` because this is a form, not an auth card — at max-w-md every field
    // and every line of help text was crushed into ~400px. The "← Dashboard"
    // link that used to sit here is gone: Shell has real nav now.
    <Shell width="wide">
      {/* .vm-form styles ProfileSettingsPage by element (see globals.css). The
          shared component ships 545 lines of semantic HTML with one className,
          so there is nothing else to hook onto — and styling it here avoids
          changing a package three other brand apps depend on. */}
      <div className="vm-form">
        {error ? (
          <p role="alert" style={{ color: "var(--danger)" }}>
            Could not open your profile: {error}
          </p>
        ) : profileId ? (
          <ProfileSettingsPage
            profileId={profileId}
            publicBaseUrl="https://verifiedmargins.com"
            // Publishing exists to produce a public page, so go and show it.
            // The profile lives on the apex, not this app host, so this is a
            // real navigation rather than a router push.
            onPublished={(url) => window.location.assign(url)}
          />
        ) : (
          <p>Loading…</p>
        )}
      </div>
    </Shell>
  );
}
