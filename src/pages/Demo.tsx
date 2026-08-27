import { useParams } from "react-router-dom";
import { Shell } from "./Shell";
import { findDemo } from "@/demo/registry";
import { DemoProfile } from "./DemoProfile";
import { DemoLeaderboard } from "./DemoLeaderboard";

/**
 * /demo/<slug> — picks the page a demo renders through.
 *
 * One route, several kinds. The alternative was for DemoProfile to notice it
 * had been handed a non-profile slug and branch, which is how a "profile demo"
 * ends up quietly owning the leaderboard's fetch patch, its banner and its
 * noindex meta. The registry already says which page a demo belongs to; this
 * is the one place that reads it, so adding a third kind is a case here and a
 * component beside it, not an edit to an existing demo page.
 *
 * See src/demo/README.md.
 */
export function Demo() {
  const { slug = "" } = useParams();
  const demo = findDemo(slug);

  if (!demo) {
    return (
      <Shell width="wide">
        <div className="vm-form">
          <h1>No demo here</h1>
          <p>
            There is no demo registered as <code>{slug}</code>. See{" "}
            <code>src/demo/README.md</code>.
          </p>
        </div>
      </Shell>
    );
  }

  if (demo.kind === "leaderboard") return <DemoLeaderboard slug={slug} demo={demo} />;
  return <DemoProfile slug={slug} demo={demo} />;
}
