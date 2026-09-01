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
  const { status } = useSession();
  const [unlocked, setUnlocked] = useState<readonly WindowKey[] | undefined>(undefined);

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") {
      setUnlocked(["30d"]);
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
      })
      .catch(() => {
        /* Cannot tell — open it. Locking someone out on our own failure is
           the worse of the two mistakes. */
        if (!cancelled) setUnlocked(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  return unlocked;
}
