import { useBrand } from "@ballisticbrands/frontend-shared";
import { Leaderboard } from "./Leaderboard";
import type { GroupDemo } from "@/demo/registry";
import { DemoBanner, useDemoFetch, useDemoMeta } from "@/demo/harness";

/**
 * /demo/group/<slug> — a GROUP board: one coach or agency and their people,
 * ranked, on one page.
 *
 * 🚧 The product has no groups. Every other demo renders a real page against
 * fixture data; this one shows a feature that does not exist, which is the
 * case src/demo/README.md reserves a third kind for.
 *
 * It is still the REAL `<Leaderboard>` underneath — the board a group needs is
 * the board the product already has, pointed at a subset — so what a prospect
 * sees is the shipped component and not a mockup that would drift from it. The
 * only demo-only part is the header above it, and that rides in through
 * `banner`, the prop that exists precisely because Leaderboard renders its own
 * Shell and anything wrapped around it lands beside the nav rail.
 */
export function DemoGroup({ demo }: { demo: GroupDemo }) {
  const brand = useBrand();

  useDemoFetch((url) => {
    if (!url.pathname.includes("/v1/public/leaderboard")) return undefined;
    const mode = url.searchParams.get("by") === "business" ? "business" : "founder";
    return demo.build(mode, url.searchParams.get("currency") || "USD");
  });
  useDemoMeta(`${demo.name} — demo — ${brand.displayName}`);

  return (
    <Leaderboard
      variant="revenue"
      /* The members are demo profiles, so their rows must stay inside /demo —
         `/<handle>` is the real profile route and these handles belong to
         people who have not signed up. Same reason DemoLeaderboard does it. */
      profileHref={(username) => `/demo/${username}`}
      banner={
        <>
          <DemoBanner />
          <div data-group-head="">
            {demo.avatar_url ? (
              <img data-group-avatar="" src={demo.avatar_url} alt="" />
            ) : null}
            <div>
              <h2>{demo.name}</h2>
              <p>{demo.description}</p>
              {demo.link ? (
                <p>
                  <a href={demo.link} rel="nofollow noopener" target="_blank">
                    {demo.link.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </>
      }
    />
  );
}
