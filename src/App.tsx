import { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  ForgotPasswordPage,
  VerifyEmailPage,
  useBrand,
  useSession,
} from "@ballisticbrands/frontend-shared";
import { Dashboard } from "@/pages/Dashboard";
import { SignIn } from "@/pages/SignIn";
import { Settings } from "@/pages/Settings";
import { SignUp } from "@/pages/SignUp";
import { PublicProfile } from "@/pages/PublicProfile";

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
      {/* No landing page: this is a social app, so the root is sign-up for a
          visitor and their own dashboard once signed in. */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/sign-up" element={<PublicOnly><SignUp /></PublicOnly>} />
      <Route path="/sign-in" element={<PublicOnly><SignIn /></PublicOnly>} />
      {/* Shared pages — identical across every brand app, styled from the
          brand context. Do not fork these locally. */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      {/* The profile settings form — username, bio, links, per-field
          visibility toggles and the connected-account opt-in. */}
      <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      {/* A single path segment that is not one of the app routes above is a
          seller's handle. Declared LAST so an app route can never be shadowed
          by a username — the backend also refuses to issue one that collides
          (usernames.ts reserved list), which is now load-bearing rather than
          belt-and-braces, because the app and the profiles share one origin. */}
      <Route path="/:username" element={<PublicProfile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/** Root: signed out → sign up; signed in → your dashboard. */
function RootRedirect() {
  const { status } = useSession();
  if (status === "loading") return null;
  return <Navigate to={status === "authenticated" ? "/dashboard" : "/sign-up"} replace />;
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
  return status === "authenticated" ? <>{children}</> : <Navigate to="/sign-in" replace />;
}
