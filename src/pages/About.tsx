import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * Public "what is this" page.
 *
 * ⚠️ This page has a second audience besides sellers: it is the **about URL**
 * registered with Reddit, X and LinkedIn for our OAuth apps. A reviewer at any
 * of those platforms lands here to answer "who is this app and why does it
 * want my users' identity?" — so §"Connecting a social account" states exactly
 * what we ask for, what we keep, and what we deliberately do not do. Keep that
 * section accurate against the code, for the same reason Privacy.tsx says so:
 * a written promise we are failing is worse than no page at all.
 *
 * 🚨 Also in PUBLIC_PAGES (src/data/site.mjs) so the build emits a static stub
 * and GitHub Pages answers 200 rather than the 404.html bounce, and in the
 * backend's RESERVED_USERNAMES so no seller can claim the handle "about" and
 * shadow this page through the /:username catch-all.
 */
export function About() {
  const brand = useBrand();

  useEffect(() => {
    document.title = `About — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <Shell width="wide">
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        About {brand.displayName}
      </h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold">What this is</h2>
          <p className="mt-2">
            {brand.displayName} is a public profile for an Amazon seller where
            the numbers are <strong>verified rather than claimed</strong>.
            Revenue, profit and margin come from the seller's own Amazon
            account, read through Amazon's official APIs — not from a
            screenshot, and not from something they typed.
          </p>
          <p className="mt-2">
            Everyone in this industry has seen a revenue figure in a screenshot.
            Nobody can check one. That is the whole problem this exists to fix.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">How verification works</h2>
          <p className="mt-2">
            A seller connects their Amazon Seller Central account through
            Amazon's own consent screen, granting read access they can revoke at
            any time from Amazon. We pull the order, settlement, advertising and
            inventory reports Amazon provides, compute the aggregate figures
            from them, and publish only those figures.
          </p>
          <p className="mt-2">
            Nothing is public until the seller publishes it. Creating an account
            and connecting Amazon publishes nothing at all.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">What a profile does not show</h2>
          <p className="mt-2">
            Not the store name, the brands, the products, the ASINs, the
            suppliers or the customers. A profile is aggregate financial
            metrics, plus whatever the seller chose to write about themselves.
            The boundary is enforced in the code and covered by tests, and it is
            spelled out in the{" "}
            <Link className="underline underline-offset-4" to="/privacy">
              privacy policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Connecting a social account</h2>
          <p className="mt-2">
            A profile can show a seller's account on another platform — Reddit,
            X or LinkedIn — as <em>confirmed by that platform</em> rather than
            as text the seller typed. Sellers connect it the same way they
            connect Amazon: they click Connect, the platform's own consent
            screen opens, and they approve or decline.
          </p>
          <p className="mt-2">When they approve, this is the whole of it:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              We read <strong>the account's username and its account id</strong>,
              once, at the moment of connecting. Nothing else.
            </li>
            <li>
              We store those two values and the date, and show the username on
              the profile with that date.
            </li>
            <li>
              We <strong>discard the access token immediately</strong>. We keep
              no refresh token and hold no standing access to the account — a
              seller who reconnects later goes through the consent screen again.
            </li>
            <li>
              We never post, comment, vote, message or read content, and we ask
              for no permission that would let us. Read-only identity is the
              entire scope.
            </li>
            <li>
              One platform account can verify one profile. That rule is what
              stops someone attaching a well-known seller's handle to their own
              page.
            </li>
          </ul>
          <p className="mt-2">
            A seller can disconnect at any time from their settings, which
            deletes the record and removes the handle from their profile.
          </p>
          <p className="mt-2 opacity-80">
            This is rolling out platform by platform as each integration is
            approved, so a platform may not be offered yet.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Who runs it</h2>
          <p className="mt-2">
            {brand.displayName} is built and operated by Ballistic Brands.
            Questions, press, or anything about a specific profile:{" "}
            <a
              className="underline underline-offset-4"
              href="mailto:owner@ballisticbrands.co"
            >
              owner@ballisticbrands.co
            </a>
            .
          </p>
        </section>
      </div>
    </Shell>
  );
}
