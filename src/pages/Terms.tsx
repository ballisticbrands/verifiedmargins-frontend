import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBrand } from "@ballisticbrands/frontend-shared";
import { Shell } from "./Shell";

/**
 * Public terms of service, served at /tos. Linked from the footer of every
 * page — that link was dead (HTTP 404) until this landed
 * (BUG_VM_2026-08-25_terms-link-404), and worse than dead: an unknown path
 * bounces through 404.html to "/", so a human clicking Terms landed on the
 * homepage and saw nothing wrong while every crawler saw a 404.
 *
 * ⚠️ WRITTEN AGAINST WHAT THE PRODUCT ACTUALLY DOES, not from a generator.
 * Privacy.tsx says why, and it matters more here: a privacy policy is
 * DESCRIPTIVE, but this is a CONTRACT. Boilerplate describing a different
 * product would not merely be inaccurate, it would be the agreement — terms
 * promising things we don't do, or claiming rights over data we never take.
 * Every clause below is anchored to real behaviour:
 *
 *   • sign-in is Google or a magic link, and there is no password
 *     (BrandConfig.passwordlessAuth — principles/multi-brand.md)
 *   • profiles are unpublished by default and publish aggregate figures only,
 *     the closed field set asserted by
 *     src/routes/public-profile-privacy.http.test.ts on the backend
 *   • released usernames are tombstoned forever
 *     (src/services/profiles/usernames.ts)
 *
 * If any of those change, this page changes in the same commit.
 *
 * 🚨 §"Governing law" is a DELIBERATE PLACEHOLDER. Which jurisdiction we
 * contract under is the operator's decision and inventing one would be worse
 * than marking it — an agreement naming a court we never chose is unenforceable
 * theatre. It renders visibly as unfinished on purpose. Do not "tidy" it by
 * guessing.
 *
 * 🚨 Also in PUBLIC_PAGES (src/data/site.mjs) so the build emits a static stub
 * and GitHub Pages answers 200 rather than the 404.html bounce, and in the
 * backend's RESERVED_USERNAMES so no seller can claim the handle "tos" and
 * shadow this page through the /:username catch-all.
 *
 * NOT legal advice and not reviewed by counsel — see the note rendered at the
 * top of the page.
 */
export function Terms() {
  const brand = useBrand();

  useEffect(() => {
    document.title = `Terms of Service — ${brand.displayName}`;
  }, [brand.displayName]);

  return (
    <Shell width="wide">
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-1 text-sm opacity-70">Last updated 25 August 2026</p>

      <p
        className="mt-4 rounded-md border p-3 text-sm leading-relaxed opacity-80"
        style={{ borderColor: "var(--border)" }}
      >
        <strong>Plain-language, and not reviewed by a lawyer.</strong> This page
        is written to describe honestly how {brand.displayName} actually works
        rather than to cover every eventuality. It is not legal advice, and it
        has not been reviewed by counsel. Where it is silent, ask us.
      </p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold">The short version</h2>
          <p className="mt-2">
            {brand.displayName} publishes revenue and profit figures that come
            from your own connected Amazon account, and only the figures you
            choose to publish. You keep ownership of everything you give us. You
            can unpublish or delete at any time. We do not promise the figures
            are right — they are what Amazon reported — and we do not promise
            the service will always be available.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Who this agreement is between</h2>
          <p className="mt-2">
            This is an agreement between you and Ballistic Brands, which builds
            and operates {brand.displayName}. "We" and "us" mean Ballistic
            Brands; "you" means the person using the service and, if you are
            using it for a business, that business.
          </p>
          <p className="mt-2">
            You accept these terms by creating an account or using the service.
            If you do not accept them, do not use it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Who may use it</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              You must be at least 18. The service is for businesses and is not
              directed at children.
            </li>
            <li>
              If you accept these terms for a company, you confirm you are
              authorised to bind it.
            </li>
            <li>
              You must be allowed to use the service where you live, and not be
              barred from it by sanctions or by a previous ban from us.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold">Your account</h2>
          <p className="mt-2">
            You sign in with Google or with a link we email you. There is no
            password to lose, which means{" "}
            <strong>your email inbox is your account</strong> — anyone who can
            read it can sign in as you. Keep it secure, and tell us promptly if
            you think someone else has reached your account.
          </p>
          <p className="mt-2">
            You are responsible for what happens under your account, and for the
            accuracy of the contact address you give us.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Connecting your Amazon account</h2>
          <p className="mt-2">
            Verification works by you granting read access to an Amazon selling
            account through Amazon's own consent screen. By connecting one you
            confirm that it is yours or that you are authorised to connect it,
            and that doing so does not break your agreement with Amazon.
          </p>
          <p className="mt-2">
            You can revoke that access at any time — from your settings here, or
            from Amazon Seller Central. Revoking stops new data arriving; it does
            not by itself unpublish figures already on your profile, which you
            control separately.
          </p>
          <p className="mt-2 opacity-80">
            We are not affiliated with, endorsed by, or acting for Amazon.
            Amazon's own terms continue to govern your relationship with Amazon,
            and Amazon can change or withdraw the APIs we rely on at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">What we do, and what we do not promise</h2>
          <p className="mt-2">
            We read the reports Amazon provides for the account you connected,
            compute aggregate figures — revenue, profit and margin over a period
            — and publish those figures on your profile if you publish it.
            Nothing is public until you publish it, and what a published profile
            shows is limited to those aggregate figures plus what you wrote about
            yourself. The detail is in the{" "}
            <Link className="underline underline-offset-4" to="/privacy">
              privacy policy
            </Link>
            .
          </p>
          <p className="mt-2">
            <strong>
              We do not warrant that any figure is accurate, complete or current.
            </strong>{" "}
            The figures derive from data Amazon reports to us. Amazon restates,
            corrects and delays its own reports; refunds, reserves, fees and
            settlement timing all move numbers after the fact; and profit depends
            on costs you supply, which only you can know. A verified figure means{" "}
            <em>this is what the connected account reported</em> — not that we
            have audited a business.
          </p>
          <p className="mt-2">
            The service is provided as it is, and may change. We may add, alter
            or remove features, and we do not promise uninterrupted availability.
            Do not rely on {brand.displayName} as your accounting, tax or
            investment record.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Your content, and what you let us do with it</h2>
          <p className="mt-2">
            Everything you give us stays yours: your handle, your description,
            your picture, and the underlying data from your Amazon account.
          </p>
          <p className="mt-2">
            So that we can actually run the service, you grant us a worldwide,
            non-exclusive, royalty-free licence to host, store, process, and —
            for whatever you have chosen to publish — display and distribute that
            content, including in search results, link previews, and to AI
            assistants that read public pages. That is the point of a public
            profile: it exists to be found and read.
          </p>
          <p className="mt-2">
            The licence lasts only as long as you keep the content published.
            Unpublish or delete and we stop displaying it, though copies already
            cached or indexed by third parties are outside our control, and
            backups may persist for a limited period.
          </p>
          <p className="mt-2">
            You confirm you have the right to give us what you upload, and that
            publishing it does not break anyone else's rights or any agreement
            you are under.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Acceptable use</h2>
          <p className="mt-2">
            The product's only value is that a figure on a profile can be
            trusted. Everything below follows from that. Do not:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Impersonate anyone</strong> — a person, a business, or a
              brand you do not represent.
            </li>
            <li>
              <strong>Attribute someone else's business to your profile</strong>,
              or connect an account you are not authorised to connect.
            </li>
            <li>
              Misrepresent what a figure means, or present a published profile as
              an audit, a guarantee, or a solicitation for investment.
            </li>
            <li>
              Upload unlawful, deceptive, hateful or infringing content, or
              anyone's personal data other than your own.
            </li>
            <li>
              Attack, overload, scrape at scale, reverse-engineer or attempt to
              gain unauthorised access to the service, or use it to build a
              competing dataset.
            </li>
            <li>Resell or sublicense access to the service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold">Handles</h2>
          <p className="mt-2">
            A handle is issued to you, not sold to you. Words the site itself
            needs — page names, brand words, and names whose only use would be
            impersonation — are reserved and cannot be registered.
          </p>
          <p className="mt-2">
            <strong>A handle you give up is retired permanently.</strong> If you
            rename, the old handle is not released back into circulation for
            someone else to take. On a site whose product is verification, an
            inherited handle would inherit every old link that pointed at you —
            that is an impersonation route, not tidy housekeeping. You may always
            move back to a handle you released yourself.
          </p>
          <p className="mt-2">
            We may reclaim a handle that impersonates someone, that infringes a
            trademark, or that we need for the site itself. Where we can, we will
            tell you first and help you move.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Our side of it</h2>
          <p className="mt-2">
            The service — the site, its name, its design and its software —
            belongs to us. These terms give you no rights in it beyond using it
            as intended. Feedback you send us we may use freely, with no
            obligation to you.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Ending the agreement</h2>
          <p className="mt-2">
            <strong>You can stop at any time</strong>: unpublish your profile,
            disconnect Amazon, or delete your account outright.
          </p>
          <p className="mt-2">
            We can suspend or close an account that breaks these terms,
            impersonates someone, or exposes us or other users to legal risk —
            immediately where the harm is ongoing, and otherwise with notice and
            a chance to put it right. We may also discontinue the service, in
            which case we will give reasonable notice so you can retrieve what is
            yours.
          </p>
          <p className="mt-2">
            When the agreement ends, your right to use the service ends with it.
            The sections on your content licence for anything still published, on
            disclaimers, on liability, and on governing law survive.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Disclaimer of warranties</h2>
          <p className="mt-2">
            To the fullest extent the law allows, the service is provided "as is"
            and "as available", without warranties of any kind — express or
            implied — including merchantability, fitness for a particular
            purpose, non-infringement, and any warranty as to the accuracy,
            completeness or timeliness of the figures published through it.
          </p>
          <p className="mt-2 opacity-80">
            Some jurisdictions do not allow certain warranties to be excluded. In
            those places this section applies only as far as it lawfully can, and
            nothing here limits liability for fraud, for death or personal injury
            caused by negligence, or for anything else that cannot lawfully be
            limited.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Limitation of liability</h2>
          <p className="mt-2">
            To the fullest extent the law allows, we are not liable for indirect,
            incidental, special, consequential or punitive damages, nor for lost
            profits, lost revenue, lost data, lost business or lost opportunity,
            arising out of or connected with the service — including any decision
            anyone makes on the basis of a figure published here.
          </p>
          <p className="mt-2">
            Our total liability for all claims relating to the service is limited
            to the greater of the amount you paid us for it in the twelve months
            before the claim, or US$100.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Changes to these terms</h2>
          <p className="mt-2">
            We may update these terms. When we do, we will change the date at the
            top, and for a material change we will give notice — on the site or
            by email — before it takes effect. Continuing to use the service
            after that is acceptance. If you do not accept a change, stop using
            the service and delete your account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Governing law</h2>
          <p
            className="mt-2 rounded-md border border-dashed p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <strong>To be completed by the operator.</strong> These terms are
            governed by the laws of{" "}
            <em>[jurisdiction to be filled in]</em>, and the courts of{" "}
            <em>[jurisdiction to be filled in]</em> have exclusive jurisdiction
            over any dispute, without regard to conflict-of-laws rules.
          </p>
          <p className="mt-2 opacity-80">
            This is deliberately blank rather than guessed. Naming a jurisdiction
            we have not actually chosen would be worse than admitting the gap. If
            it matters to you before it is filled in, write to us and we will
            confirm it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Everything else</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              If a clause turns out to be unenforceable, the rest stays in force.
            </li>
            <li>
              Not enforcing something once does not mean we have given up the
              right to enforce it later.
            </li>
            <li>
              You may not transfer this agreement without our consent. We may
              transfer it as part of a sale or reorganisation of the business.
            </li>
            <li>
              These terms and the privacy policy are the whole agreement between
              us about the service.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold">Contact</h2>
          <p className="mt-2">
            Questions about these terms, a takedown request, or anything about a
            specific profile:{" "}
            <a
              className="underline underline-offset-4"
              href={`mailto:${brand.supportEmail}`}
            >
              {brand.supportEmail}
            </a>
            . See also the{" "}
            <Link className="underline underline-offset-4" to="/privacy">
              privacy policy
            </Link>{" "}
            and{" "}
            <Link className="underline underline-offset-4" to="/about">
              about
            </Link>{" "}
            pages.
          </p>
        </section>
      </div>
    </Shell>
  );
}
