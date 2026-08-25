import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * Public privacy policy. Linked from the footer of every page — that link was
 * dead (HTTP 404) until this landed.
 *
 * ⚠️ PLAIN-LANGUAGE AND DESCRIPTIVE, not boilerplate. Every claim below is
 * meant to be true of what the product actually does, because a privacy policy
 * that describes a different product is worse than none: it is a written
 * promise we would be failing. If the product's data handling changes, this
 * page changes in the same commit.
 *
 * 🚨 The "what we publish" section is the load-bearing one. It states the same
 * boundary the backend enforces and tests
 * (src/routes/public-profile-privacy.http.test.ts asserts a closed field set),
 * so the promise here and the code cannot drift apart quietly.
 *
 * NOT legal advice and not reviewed by counsel — see the note rendered at the
 * top of the page.
 */
export function Privacy() {
  const brand = useBrand();

  useEffect(() => {
    document.title = `Privacy — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <Shell width="wide">
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-1 text-sm opacity-70">Last updated 25 August 2026</p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold">The short version</h2>
          <p className="mt-2">
            {brand.displayName} verifies a seller's revenue and profit and
            publishes only those figures. We do not publish your store name,
            your brands, your products, your ASINs, your suppliers or your
            customers — and we do not sell your data to anyone, ever.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Account details.</strong> Your email address, and — if you
              sign in with Google — the name and profile picture Google provides.
              We never receive or store your Google password.
            </li>
            <li>
              <strong>Amazon selling data</strong>, if you choose to connect an
              Amazon account. We receive order, settlement, advertising and
              inventory reports through Amazon's official APIs, using access you
              grant and can revoke at any time from Amazon.
            </li>
            <li>
              <strong>Anything you type into your profile</strong> — your handle,
              your description, and a picture if you upload one.
            </li>
            <li>
              <strong>Basic technical data</strong> needed to run and secure the
              service: IP address, browser user-agent and approximate country at
              signup, and error logs.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold">What we publish</h2>
          <p className="mt-2">
            A published profile shows aggregate financial metrics — revenue,
            profit and margin over a period — together with whatever you chose to
            write about yourself, your handle and your picture. Nothing else from
            your Amazon account is published.
          </p>
          <p className="mt-2">
            <strong>Your profile is not public until you publish it.</strong>{" "}
            Creating an account and connecting Amazon publishes nothing. You
            choose what to publish and you can unpublish at any time.
          </p>
          <p className="mt-2 opacity-80">
            Two things worth stating plainly, because they are exceptions: broad{" "}
            <em>category</em> names may appear on a profile, and a profile we
            created from public information before you claimed it may show the
            business name that information came from.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Why we're allowed to use it</h2>
          <p className="mt-2">
            To provide the service you asked for, to keep it secure, and to meet
            our legal obligations. Where we rely on your consent — connecting an
            Amazon account, publishing a profile — you can withdraw it by
            disconnecting or unpublishing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Who else sees it</h2>
          <p className="mt-2">
            Only the service providers needed to run the product: cloud hosting
            and data storage (Amazon Web Services, Google Cloud), email delivery
            for sign-in links, and Amazon and Google themselves for the
            connections and sign-in you initiate. We do not sell or rent personal
            data, and we do not share it for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">How long we keep it</h2>
          <p className="mt-2">
            For as long as your account exists. Delete your account and we delete
            your profile and personal data; disconnect an Amazon account and we
            stop receiving new data from it. Backups and legally required records
            may persist for a limited period after deletion.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Your choices</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Unpublish your profile at any time from your settings.</li>
            <li>Disconnect an Amazon account here or revoke access in Amazon Seller Central.</li>
            <li>Ask for a copy of your data, a correction, or deletion.</li>
          </ul>
          <p className="mt-2">
            Depending on where you live you may have additional rights under laws
            such as the GDPR or the CCPA, including the right to object to
            processing and to complain to a regulator.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Cookies</h2>
          <p className="mt-2">
            We store a sign-in token in your browser so you stay signed in. That
            is what the product needs to work; we do not use advertising cookies
            on published profiles.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Children</h2>
          <p className="mt-2">
            The service is for businesses and is not directed at anyone under 18.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Changes and contact</h2>
          <p className="mt-2">
            If this policy changes materially we will update the date above and,
            where appropriate, tell you directly. Questions, or any request about
            your data:{" "}
            <a className="underline underline-offset-4" href="mailto:owner@ballisticbrands.co">
              owner@ballisticbrands.co
            </a>
            . The{" "}
            <Link className="underline underline-offset-4" to="/tos">
              terms of service
            </Link>{" "}
            cover the rest of the agreement between us.
          </p>
        </section>
      </div>
    </Shell>
  );
}
