import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * Public "how do I get help" page.
 *
 * Deliberately answers the questions this product actually generates rather
 * than a generic help-desk shell: there are no passwords here, a profile is
 * invisible until it is published, and the username change limit's own error
 * string tells the seller to "contact support" — until this page existed that
 * sentence pointed nowhere (src/services/profiles/service.ts,
 * USERNAME_CHANGE_LIMIT).
 *
 * ⚠️ No response-time promise on this page, on purpose. About.tsx and
 * Privacy.tsx are written on the rule that a written promise we are failing is
 * worse than no page at all, and an SLA is the easiest one to break. Add one
 * only when somebody owns it.
 *
 * 🚨 Also in PUBLIC_PAGES (src/data/site.mjs) so the build emits a static stub
 * and GitHub Pages answers 200 rather than the 404.html bounce, and in the
 * backend's RESERVED_USERNAMES so no seller can claim the handle "support"
 * and shadow this page through the /:username catch-all. ("support" was
 * already reserved before this page shipped.)
 */
export function Support() {
  const brand = useBrand();

  useEffect(() => {
    document.title = `Support — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <Shell width="wide">
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Support</h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed">
        <section>
          <p>
            {brand.displayName} is run by a small team at Ballistic Brands, and
            a person reads every message. Email{" "}
            <a
              className="underline underline-offset-4"
              href="mailto:owner@ballisticbrands.co"
            >
              owner@ballisticbrands.co
            </a>{" "}
            with the email address you sign in with, the profile URL if your
            question is about a specific profile, and what you expected to see
            versus what you saw. That is usually enough to answer without a
            second round trip.
          </p>
          <p className="mt-2">
            Found a security problem? Same address, with{" "}
            <strong>security</strong> in the subject line. Please tell us before
            you tell anyone else, and we will tell you what we did about it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Signing in</h2>
          <p className="mt-2">
            This product has no passwords, so there is nothing to reset. You
            sign in either with Google or with a one-time link we email you,
            both from the{" "}
            <Link className="underline underline-offset-4" to="/login">
              sign-in page
            </Link>
            .
          </p>
          <p className="mt-2">
            An emailed link is good for 15 minutes and works once. If yours has
            expired, or the mail has not arrived, request another from that same
            page and check your spam folder — sign-in mail is the message most
            likely to land there.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">
            Your figures look wrong, or nothing has appeared yet
          </h2>
          <p className="mt-2">
            After you connect Amazon, the first sync has to finish before there
            is anything to compute from, so a brand-new connection shows nothing
            for a while. Figures update as later syncs land.
          </p>
          <p className="mt-2">
            Everything on a profile is computed from the reports Amazon gives us
            for your own account — we never type a number in by hand, which also
            means we cannot edit one for you. If a figure still looks wrong once
            your account has synced, email us the profile URL and the number you
            expected, and we will trace it back to the report it came from.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Changing your username</h2>
          <p className="mt-2">
            Your username is your profile's URL, and you can change it twice
            from your{" "}
            <Link className="underline underline-offset-4" to="/settings">
              settings
            </Link>
            . The cap exists because a public profile gets linked to and shared
            — a handle that keeps moving breaks every link pointing at it. If
            you genuinely need another change, email us and say why.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">
            Unpublishing, disconnecting, deleting
          </h2>
          <p className="mt-2">
            <strong>Unpublish</strong> from your settings at any time. Your
            public page comes down and your figures stop being shown; your
            account and your data stay.
          </p>
          <p className="mt-2">
            <strong>Disconnect Amazon</strong> from your settings, or revoke our
            access from inside Seller Central — Amazon lets you do that
            yourself, without asking us. That stops new data arriving.
          </p>
          <p className="mt-2">
            <strong>Delete the account</strong> — email us and we will remove
            the account and the data behind it. There is no self-serve delete
            button yet.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Reporting a profile</h2>
          <p className="mt-2">
            If a profile is impersonating someone, or you believe what it shows
            is not what it claims to be, email us the profile URL and what looks
            wrong. Verified figures come from the seller's own Amazon account
            and a connected social account can verify only one profile, which is
            what makes impersonation hard — but if something got through, we
            want to know.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">The other pages</h2>
          <p className="mt-2">
            <Link className="underline underline-offset-4" to="/about">
              About
            </Link>{" "}
            explains what a profile does and does not show, and exactly what
            connecting a social account grants us.{" "}
            <Link className="underline underline-offset-4" to="/privacy">
              Privacy
            </Link>{" "}
            covers what we collect and keep, and{" "}
            <Link className="underline underline-offset-4" to="/tos">
              Terms
            </Link>{" "}
            covers the agreement itself.
          </p>
        </section>
      </div>
    </Shell>
  );
}
