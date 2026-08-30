import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut, useBrand, useSession } from "@ballisticbrands/frontend-shared";
import { Logo } from "@/components/Logo";
import { CURRENCIES, SHOW_CURRENCY_PICKER, useCurrency } from "@/currency";
import { useAddBusiness } from "@/AddBusiness";
import { AddBusinessModal } from "@/components/AddBusinessModal";
import {
  DashboardIcon,
  FeedIcon,
  HowItWorksIcon,
  LeaderboardIcon,
  ProfileIcon,
  SignOutIcon,
  VerifyIcon,
} from "@/components/NavIcons";
import { AnnouncementBar } from "@/components/AnnouncementBar";

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
   *  settings page at auth-card width was a big part of why it was unusable.
   *  `profile` is wider still: a public profile is a page people land on
   *  cold and scan, and its business cards need room for three figures
   *  across without wrapping. */
  width?: "narrow" | "wide" | "profile";
}) {
  const brand = useBrand();
  const { status } = useSession();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const addBusiness = useAddBusiness();

  /* Where "Profile" points: at /profile, a literal, always.
   *
   * The X.com model the operator asked for is that the nav takes you to your
   * OWN public page — the thing other people see — and the edit affordance
   * lives ON it. But WHICH page that is takes a round trip to answer, so this
   * header used to compute the href: it seeded the link at "/settings" and
   * replaced it when `listProfiles()` came back.
   *
   * 🚨 A computed href is a guess, and it was wrong in two ordinary
   * situations, both of which reached the operator as "the Profile link still
   * goes to /settings" on a bundle that had the fix in it:
   *
   *   1. Click before the round trip finishes and you follow the placeholder.
   *   2. A failed lookup fell back to "/settings" silently, which is
   *      indistinguishable from "nothing is published" — and from the bug.
   *
   * So the header no longer knows. /profile resolves the destination when it
   * is opened (src/pages/ProfileRedirect.tsx), which cannot be stale and has
   * somewhere to SHOW a failure. It also drops a duplicate listProfiles()
   * call: on a profile page this header and the page itself were each asking.
   *
   * "profile" is in the backend's RESERVED_USERNAMES, so no seller's handle
   * can shadow it. */

  // Sign out clears the local session token even if the server call fails
  // (signOut is best-effort by design), then sends you to the one door in.
  // Full reload so no authenticated state survives in memory.
  async function onSignOut() {
    await signOut();
    navigate("/login", { replace: true });
    window.location.reload();
  }
  const max =
    width === "profile" ? "vm-col-profile" : width === "wide" ? "vm-col-wide" : "vm-col-narrow";

  return (
    /* Left rail + content, the x.com shape. On narrow screens the rail
       becomes a horizontal strip above the content (see globals.css) rather
       than a hamburger: four destinations fit on a line, and a menu that has
       to be opened hides the only navigation this product has. */
    <>
      {/* Full-bleed: sits outside [data-app-shell]'s 84rem column so the
          notice spans the viewport on every page, profiles included. */}
      <AnnouncementBar />
      <div data-app-shell="">
      <aside data-sidebar="">
        <Link to="/" data-sidebar-brand="">
          <Logo size={26} />
          <span>{brand.displayName}</span>
        </Link>

        {/* The shape of the site, for everyone — signed in or not. A profile
            is a public page, and this is how a visitor gets from it into the
            product.
            🚧 NONE OF THESE PAGES EXIST YET. Each routes to a stub that says
            so; a dead link in our own navbar would 404 on a static host and
            read as a broken site. */}
        <nav data-product-nav="" aria-label="Site">
          {/* Leaderboard first: it is what `/` serves and the reason a
              stranger stays. Feed sits under it. */}
          <NavLink to="/leaderboard" current={pathname} icon={<LeaderboardIcon />}>
            Leaderboard
          </NavLink>
          <NavLink to="/feed" current={pathname} icon={<FeedIcon />}>Feed</NavLink>
          <NavLink to="/how-verification-works" current={pathname} icon={<HowItWorksIcon />}>
            How verification works
          </NavLink>

          {/* The one call to action on the site, and a BUTTON rather than a
              nav item: it opens the flow over whatever page convinced them,
              instead of navigating away from it. Its label is the only thing
              that changes with a session — the flow behind it is the same
              one, minus the "who are you?" section for people who already
              told us. */}
          <button type="button" onClick={addBusiness.open} data-nav-cta="">
            <VerifyIcon />
            <span>{status === "authenticated" ? "Add another business" : "Add your business"}</span>
          </button>
        </nav>

        {status === "authenticated" ? (
          <nav data-account-nav="" aria-label="Account">
            <NavLink to="/dashboard" current={pathname} icon={<DashboardIcon />}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" current={pathname} icon={<ProfileIcon />}>
              Profile
            </NavLink>
            <button type="button" onClick={() => void onSignOut()} data-nav-signout="">
              <SignOutIcon />
              <span>Sign out</span>
            </button>
          </nav>
        ) : null}
      </aside>

      <div data-app-content="" className={max}>
        {/* Site chrome — today, only the currency control, which is itself
            standing down (SHOW_CURRENCY_PICKER), so this renders nothing.
            The breadcrumb used to live here and does not any more: it
            belongs beside the name it introduces, so it moved into the
            profile header (components/Breadcrumbs.tsx). */}
        <TopBar />

        <main>{children}</main>

        <footer data-app-footer="">
          <a href="https://verifiedmargins.com/about/">About</a>
          {" · "}
          <a href="https://verifiedmargins.com/privacy/">Privacy</a>
          {" · "}
          <a href="https://verifiedmargins.com/tos/">Terms</a>
          {" · "}
          <a href="https://verifiedmargins.com/support/">Support</a>
        </footer>
      </div>

      {addBusiness.isOpen ? <AddBusinessModal onClose={addBusiness.close} /> : null}
      </div>
    </>
  );
}

/**
 * Site chrome at the head of the content column.
 *
 * Currently that is the currency control and nothing else — and it is hidden
 * (SHOW_CURRENCY_PICKER), so today this renders nothing at all rather than an
 * empty strip. Kept as the slot: the currency is a SITE-wide reader
 * preference (the leaderboard reads it too), so it cannot live inside the
 * profile header the way the breadcrumb now does.
 */
function TopBar() {
  const { currency, setCurrency } = useCurrency();
  if (!SHOW_CURRENCY_PICKER) return null;

  return (
    <div data-topbar="">
      <div data-topbar-inner="">
        {/* Every figure on this site is converted at render from the currency
            it was earned in, so the display currency is a reader preference,
            not a property of any profile. It lives here, once, and every
            money page reads it. */}
        <label data-currency-picker="">
          <span className="vm-visually-hidden">Display currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

function NavLink({
  to,
  current,
  icon,
  children,
}: {
  to: string;
  current: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  // "Active" includes children (/settings under /profile), so a nested page
  // does not leave every item looking unselected.
  const active = current === to || current.startsWith(`${to}/`);
  return (
    <Link to={to} aria-current={active ? "page" : undefined} data-nav-item="" data-active={active ? "" : undefined}>
      {icon}
      <span>{children}</span>
    </Link>
  );
}
