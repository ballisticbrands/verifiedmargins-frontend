// THE WINDOW GATE — which windows a reader has earned.
//
// Longer windows are for readers who have shown their own numbers: you
// publish, you see. A visitor with no connection gets 30 days; picking a
// locked one opens the dialog that would earn it.
//
// 🚨 ONE COPY, because the founder profile and the business page both ask.
// It lived inline in pages/PublicProfile.tsx while /business/:slug had no
// picker at all; the moment the business page got one, two copies of a
// PRICING rule would have been two places to change it and one place to
// forget. The shared package cannot own this — it renders public data for
// crawlers and is deliberately session-free, so the host resolves the gate
// and passes the answer.

import { useEffect, useState } from "react";
import {
  fetchConnectionOptions,
  listProfiles,
  useSession,
  type WindowKey,
} from "@ballisticbrands/frontend-shared";

/**
 * `undefined` means EVERY window is open — the shared page reads it that way,
 * and it is also what we render while still finding out. Flashing a lock at
 * someone who has earned none is the worse of the two mistakes, and the
 * picker is inert for that instant either way.
 */
export function useUnlockedWindows(): readonly WindowKey[] | undefined {
  return useViewerTier().windows;
}

/**
 * THE TIER — what this reader has earned, in one place.
 *
 *   0  signed out, or signed in with nothing connected  → 30 days only
 *   1  at least one connection                          → every window
 *   2  at least one connection with a COMPLETE valuation → the write-ups
 *
 * The rule is the same one all the way up: you see what you show. Connecting
 * an account buys the long windows; finishing your own questionnaire buys
 * other people's write-ups.
 *
 * 🚨 Tier 2 is a PROMPT, not a permission. The deep-dive text itself never
 * comes down to a locked reader — the public payload carries two sentences
 * and the rest lives behind GET /v1/businesses/:slug/deep-dive, which checks
 * the same rule server-side. What this hook decides is which CTA to show, so
 * getting it wrong shows the wrong invitation, never the wrong content.
 */
export interface ViewerTier {
  /** `undefined` while still finding out. */
  tier: 0 | 1 | 2 | undefined;
  windows: readonly WindowKey[] | undefined;
  /** Where to send a TIER-1 reader to earn tier 2: the wizard for one of
   *  their own businesses. Null when they have none to value (tier 0) or
   *  have already valued one (tier 2). Without this the tier-1 prompt would
   *  have to say "go and find your business", which is not a call to
   *  action. */
  valueHref: string | null;
}

export function useViewerTier(): ViewerTier {
  const { status } = useSession();
  const [tier, setTier] = useState<0 | 1 | 2 | undefined>(undefined);
  const [unlocked, setUnlocked] = useState<readonly WindowKey[] | undefined>(undefined);
  const [valueHref, setValueHref] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      setUnlocked(["30d"]);
      setTier(0);
      setValueHref(null);
      return;
    }
    let cancelled = false;
    /* Two calls because connections hang off a PROFILE, not off a user: their
       own profiles first, then whether any connection feeds one. */
    listProfiles()
      .then(async (mine) => {
        const first = mine[0];
        if (!first) return [] as Awaited<ReturnType<typeof fetchConnectionOptions>>;
        return fetchConnectionOptions(first.id);
      })
      .then((opts) => {
        if (cancelled) return;
        /* A CONNECTION is the price, not an account: signing up and stopping
           is not showing your numbers. */
        setUnlocked(opts.length > 0 ? undefined : ["30d"]);
        const rows = opts as Array<{ valued?: boolean; slug?: string | null }>;
        const valued = rows.some((o) => o.valued === true);
        setTier(valued ? 2 : rows.length > 0 ? 1 : 0);
        /* The first of theirs that is not valued yet — the one the prompt
           should actually open. */
        const next = valued ? undefined : rows.find((o) => o.slug);
        setValueHref(next?.slug ? `/business/${next.slug}/value` : null);
      })
      .catch(() => {
        /* Cannot tell — open it. Locking someone out on our own failure is
           the worse of the two mistakes. The deep dive is safe to be
           optimistic about too: the server checks the same rule, so the worst
           case here is an unblurred block that fetches and 403s. */
        if (cancelled) return;
        setUnlocked(undefined);
        setTier(2);
        setValueHref(null);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  return { tier, windows: unlocked, valueHref };
}
