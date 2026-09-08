import { useParams } from "react-router-dom";
import { Shell } from "./Shell";
import { findDemo } from "@/demo/registry";
import { DemoProfile } from "./DemoProfile";
import { DemoLeaderboard } from "./DemoLeaderboard";
import { DemoGroup } from "./DemoGroup";
import { DemoSourced } from "./DemoSourced";
import { DemoBusiness } from "./DemoBusiness";

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
  /* 🚧 The one kind that does NOT mount a production page — it is a redesign
     of Business.tsx, so there is no real page for it to render through. See
     the note on BusinessDemo in src/demo/registry.ts. */
  if (demo.kind === "business") return <DemoBusiness demo={demo} />;
  /* A group is reached at /demo/g/<slug> (DemoGroupRoute), never here —
     but the union has three members, so this arm keeps the switch total and
     stops a group registered under a bare key rendering as a profile. */
  if (demo.kind === "group") return <DemoGroup demo={demo} />;
  /* 🚧 A dossier built from public data. Like a group, it has no real page
     behind it — see src/demo/README.md. */
  if (demo.kind === "sourced") return <DemoSourced demo={demo} />;
  return <DemoProfile slug={slug} demo={demo} />;
}
