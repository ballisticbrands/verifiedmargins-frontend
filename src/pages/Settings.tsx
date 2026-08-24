import { useCallback, useEffect, useState } from "react";
import {
  ProfileSettingsPage,
  createProfile,
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
 * WHY THE CREATE FALLBACK: signing up on verifiedmargins.com auto-creates an
 * unpublished profile with a temporary `vm-…` username, but that create is
 * fire-and-forget on the backend — a user whose signup raced a database hiccup,
 * or who signed up before the auto-create existed, would otherwise have no
 * profile at all and no way to make one. Creating on first visit here is the
 * recovery path. It is idempotent in effect: a user with a profile never hits
 * it.
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
      const created = await createProfile({});
      setProfileId(created.id);
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
          <ProfileSettingsPage profileId={profileId} publicBaseUrl="https://verifiedmargins.com" />
        ) : (
          <p>Loading…</p>
        )}
      </div>
    </Shell>
  );
}
