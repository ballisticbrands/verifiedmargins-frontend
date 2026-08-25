import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut, useBrand, useSession } from "@ballisticbrands/frontend-shared";
import { Logo } from "@/components/Logo";

/**
 * Page chrome: header, content column, footer.
 *
 * ⚠️ DELIBERATELY PLAIN. VerifiedMargins has no visual identity yet and is
 * deliberately NOT Dragon-branded. This is structure and spacing only — fonts,
 * colour and aesthetics are a later pass.
 *
 * 🚨 The wordmark is ONE text node on purpose. Every Dragon frontend renders its
 * name split across two elements so a gradient can hit the second half —
 * `Dragon<span className="…bg-clip-text…">Reply</span>` — which makes the brand
 * name invisible to `grep` while still reading as the brand name in the DOM.
 * That is how an inherited parent brand shipped in the header of every page on
 * dragonrestock-frontend. When real branding lands, keep it a single node.
 */
export function Shell({
  children,
  width = "narrow",
}: {
  children: React.ReactNode;
  /** `narrow` is an auth card. `wide` is for forms and dashboards — the
   *  settings page at auth-card width was a big part of why it was unusable. */
  width?: "narrow" | "wide";
}) {
  const brand = useBrand();
  const { status } = useSession();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Sign out clears the local session token even if the server call fails
  // (signOut is best-effort by design), then sends you to the one door in.
  // Full reload so no authenticated state survives in memory.
  async function onSignOut() {
    await signOut();
    navigate("/login", { replace: true });
    window.location.reload();
  }
  const max = width === "wide" ? "max-w-3xl" : "max-w-md";

  return (
    <div className={`mx-auto flex min-h-screen w-full ${max} flex-col px-6 py-8`}>
      <header
        className="flex items-center justify-between gap-4 border-b pb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-[17px] font-bold tracking-tight"
        >
          <Logo size={26} />
          {brand.displayName}
        </Link>
        {/* Signed-in nav. Without it /settings was reachable only by typing the
            URL — there was no link to it from anywhere in the app. */}
        {status === "authenticated" ? (
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/dashboard" current={pathname}>Dashboard</NavLink>
            <NavLink to="/settings" current={pathname}>Profile</NavLink>
            <button
              type="button"
              onClick={() => void onSignOut()}
              className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
              style={{ color: "inherit" }}
            >
              Sign out
            </button>
          </nav>
        ) : null}
      </header>

      <main className="flex-1 pt-7">{children}</main>

      <footer
        className="mt-10 border-t pt-4 text-sm"
        style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
      >
        <a href="https://verifiedmargins.com/privacy/">Privacy</a>
        {" · "}
        <a href="https://verifiedmargins.com/tos/">Terms</a>
      </footer>
    </div>
  );
}

function NavLink({
  to,
  current,
  children,
}: {
  to: string;
  current: string;
  children: React.ReactNode;
}) {
  const active = current === to || current.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      style={{
        color: active ? "var(--foreground)" : "var(--muted-foreground)",
        fontWeight: active ? 600 : 450,
      }}
    >
      {children}
    </Link>
  );
}
