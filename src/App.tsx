import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  MagicLoginPage,
  VerifyEmailPage,
  useBrand,
  useSession,
} from "@ballisticbrands/frontend-shared";
import { Dashboard } from "@/pages/Dashboard";
import { Login } from "@/pages/Login";
import { Settings } from "@/pages/Settings";
import { PublicProfile } from "@/pages/PublicProfile";
import { ProfileRedirect } from "@/pages/ProfileRedirect";
import { About } from "@/pages/About";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";

export default function App() {
  const location = useLocation();
  const brand = useBrand();

  // Fallback tab title. Per-page titles override this via the useEffect inside
  // each page. ⚠️ The title is set in TWO places — here and in main.tsx at boot.
  // Fixing only one of them looks right and is immediately overridden by the
  // other; that has caught people on sibling repos. Keep them in sync.
  useEffect(() => {
    document.title = brand.displayName;
  }, [location.pathname, brand.displayName]);

  // SPA route pageviews. gtag('config') and the Meta base snippet each fire
  // exactly one pageview, on hard load — neither knows about client-side
  // navigation. Without this every in-app route past the entry page goes
  // uncounted in GA4 and never reaches the Meta Pixel (a sibling app's entire
  // in-app navigation was invisible for this reason). Skip the first run: the
  // loaders in main.tsx already counted the initial load.
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };
    try {
      w.gtag?.("event", "page_view", {
        page_path: location.pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
      w.fbq?.("track", "PageView");
    } catch {
      /* analytics must never break the app */
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* No landing page: this is a social app, so the root is the login
          page for a visitor and their own dashboard once signed in. */}
      <Route path="/" element={<RootRedirect />} />
      {/* ONE auth page. Continue with Google or ask for a link; the same
          submit serves a brand-new visitor and a returning one, because
          the backend creates the account for an unknown address (and
          answers identically either way, so nothing here can tell). */}
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      {/* Tombstones, not deletions. The LP, emails already in inboxes and
          any live ad creative point at /sign-up and /sign-in, and GitHub
          Pages serves both paths today — they must keep resolving. */}
      <Route path="/sign-up" element={<Navigate to="/login" replace />} />
      <Route path="/sign-in" element={<Navigate to="/login" replace />} />
      {/* Shared pages — identical across every brand app, styled from the
          brand context. Do not fork these locally. */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      {/* 🚨 Where every emailed sign-in link lands. This route did not
          exist until 2026-08-24, so /magic?token=… fell through to the
          /:username catch-all below and rendered "profile not found" —
          magic-link sign-in could not work at all on this brand. */}
      <Route
        path="/magic"
        element={
          <MagicLoginPage
            signInPath="/login"
            signInPrompt="Prefer Google?"
            signInLabel="Back to sign in"
          />
        }
      />
      {/* No /forgot-password: there is no password to forget. The link on
          /login IS the recovery path. ForgotPasswordPage stays in the
          shared package for the brands that still need it. */}
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      {/* Where the nav's "Profile" link points. It resolves which page is
          "yours" and redirects — bio, links and the visibility toggles are
          edited ON that page now, in place. The header deliberately does NOT
          compute the destination itself: a computed href is stale until the
          round trip lands and silently wrong when it fails, which is what
          BUG_VM_2026-08-25_profile-page-not-editable-in-place was reported
          as. "profile" is in the backend's RESERVED_USERNAMES, so the
          /:username catch-all below can never shadow it. */}
      <Route path="/profile" element={<RequireAuth><ProfileRedirect /></RequireAuth>} />
      {/* Still the home of everything that is NOT on the public page: the
          username (renames are capped and tombstoned), the picture,
          connected accounts and publishing. */}
      <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      {/* A single path segment that is not one of the app routes above is a
          seller's handle. Declared LAST so an app route can never be shadowed
          by a username — the backend also refuses to issue one that collides
          (usernames.ts reserved list), which is now load-bearing rather than
          belt-and-braces, because the app and the profiles share one origin. */}
      {/* Public + indexable. MUST stay above /:username, or the catch-all
          would treat "privacy", "about" or "tos" as a seller handle. All three
          are also in the backend's RESERVED_USERNAMES so nobody can register
          them, and in PUBLIC_PAGES (site.mjs) so the build emits a
          200-answering stub. /about is additionally the about URL registered
          with Reddit, X and LinkedIn for our OAuth apps — a dead one fails
          their review, and /tos is the terms URL those same registrations ask
          for. The footer has linked /tos/ from every page since before the
          page existed, which is what BUG_VM_2026-08-25_terms-link-404 was. */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
      <Route path="/tos" element={<Terms />} />
      <Route path="/:username" element={<PublicProfile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** Root: signed out → the one login page; signed in → your dashboard. */
function RootRedirect() {
  const { status } = useSession();
  if (status === "loading") return null;
  return <Navigate to={status === "authenticated" ? "/dashboard" : "/login"} replace />;
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  // Render nothing while /me is in flight — bouncing on "not yet loaded" would
  // kick a signed-in user off their own auth page and back again.
  if (status === "loading") return null;
  return status === "authenticated" ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === "loading") return null;
  return status === "authenticated" ? <>{children}</> : <Navigate to="/login" replace />;
}
