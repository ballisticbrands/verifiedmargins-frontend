import { useBrand } from "@ballisticbrands/frontend-shared";
import { Leaderboard } from "./Leaderboard";
import type { LeaderboardDemo } from "@/demo/registry";
import { DemoBanner, useDemoFetch, useDemoMeta } from "@/demo/harness";

/**
 * The leaderboard, rendered against fixture data.
 *
 * Deliberately thin: it is the REAL `<Leaderboard>` below, with its own Shell,
 * its own tabs and its own fetch — this only answers that fetch. The tab
 * switch keeps working because the responder reads `by` off the URL every
 * time, so "By founder" / "By business" exercise the same code path they do in
 * production rather than a demo-only toggle.
 *
 * Why this demo exists: `/leaderboard` in production shows the layout against
 * however few sellers have published a margin so far, which demonstrates the
 * page but not the argument. This is the same page with a board on it.
 */
export function DemoLeaderboard({ slug, demo }: { slug: string; demo: LeaderboardDemo }) {
  const brand = useBrand();

  useDemoFetch((url) => {
    if (!url.pathname.includes("/v1/public/leaderboard")) return undefined;
    const mode = url.searchParams.get("by") === "business" ? "business" : "founder";
    return demo.build(mode, url.searchParams.get("currency") || "USD");
  });
  /* Runs AFTER Leaderboard's own title effect — a child's effects fire before
     its parent's — so the demo title is the one that survives. */
  useDemoMeta(`${slug} — demo — ${brand.displayName}`);

  /* The banner goes through a prop rather than around the page, because
     Leaderboard renders its own Shell: wrapping it here would put the note
     outside the content column, above the nav rail. */
  return <Leaderboard banner={<DemoBanner />} />;
}
