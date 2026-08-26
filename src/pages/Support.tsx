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
 * sentence pointed nowhere (backend src/services/profiles/service.ts,
 * USERNAME_CHANGE_LIMIT).
 *
 * ⚠️ The two lists below are a claim about what the product can do TODAY, and
 * they were written against the settings page, not from memory. As of
 * 2026-08-26 `ProfileSettings.tsx` in frontend-shared has publish/re-publish
 * but **no unpublish control** (deliberate — see the comment above
 * `setPublished`), and **no disconnect control** for a connected account: the
 * checkbox beside an account only chooses whether it appears on the profile.
 * Nothing in the app deletes an account either. Everything in that state is
 * listed here as "email us", which is the honest answer while it is true.
 * Ship a self-serve control and move the line up in the same change.
 *
 * ⚠️ No response-time promise on this page, on purpose. About.tsx and
 * Privacy.tsx are written on the rule that a written promise we are failing is
 * worse than no page at all, and an SLA is the easiest one to break. Add one
 * only when somebody owns it.
 *
 * The address comes from `brand.supportEmail` — one value, shared with About,
 * Privacy and Terms, so a change of inbox is a one-line change in
 * src/brands/verifiedmargins.ts.
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

  const mailto = `mailto:${brand.supportEmail}`;

  return (
    <Shell width="wide">
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Support</h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed">
        <section>
          <p>
            {brand.displayName} is run by a small team, and a person reads every
            message. Email{" "}
            <a className="underline underline-offset-4" href={mailto}>
              {brand.supportEmail}
            </a>{" "}
            with the address you sign in with, the profile URL if your question
            is about a specific profile, and what you expected versus what you
            saw. That is usually enough to answer without a second round trip.
          </p>
          <p className="mt-2">
            Found a security problem? Same address, with{" "}
            <strong>security</strong> in the subject line. Please tell us before
            you tell anyone else, and we will tell you what we did about it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">What you can do yourself</h2>
          <p className="mt-2">
            All of this lives in your{" "}
            <Link className="underline underline-offset-4" to="/settings">
              settings
            </Link>
            :
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Edit your bio, links and profile picture, and choose which fields are visible.</li>
            <li>
              Change your username — twice. Your username is your profile's URL,
              and a handle that keeps moving breaks every link pointing at it.
            </li>
            <li>Publish your profile, and re-publish it after you edit.</li>
            <li>
              Choose which of your connected Amazon accounts appears on the
              profile, and set the cost-of-goods basis used for margin.
            </li>
          </ul>
          <p className="mt-2">
            You can also <strong>revoke our access from inside Seller
            Central</strong> at any time. That is Amazon's own screen and needs
            nothing from us — it stops new data arriving.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">What to email us for</h2>
          <p className="mt-2">
            These do not have a button yet. Email{" "}
            <a className="underline underline-offset-4" href={mailto}>
              {brand.supportEmail}
            </a>{" "}
            and we will do them for you:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Take my profile down.</strong> Unpublishing is a rare,
              deliberate act, so it is not a button next to Save — tell us and
              the page comes down.
            </li>
            <li>
              <strong>Disconnect an account from {brand.displayName}.</strong>{" "}
              Unticking it in settings removes it from your profile but leaves
              it connected here; ask us to disconnect it properly.
            </li>
            <li>
              <strong>Delete my account and my data.</strong> There is no
              self-serve delete yet.
            </li>
            <li>
              <strong>Another username change,</strong> once you have used both.
              Say why and we will look.
            </li>
            <li>
              <strong>Remove a verified social account</strong> from a profile.
            </li>
            <li>
              <strong>A figure that looks wrong.</strong> Send the profile URL
              and the number you expected — see below.
            </li>
          </ul>
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
            expired, or the mail never arrived, request another from that same
            page and check your spam folder — sign-in mail is the message most
            likely to land there. Still stuck: email us and we will get you in.
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
