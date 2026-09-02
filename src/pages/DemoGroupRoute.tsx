import { useParams } from "react-router-dom";
import { Shell } from "./Shell";
import { findDemo } from "@/demo/registry";
import { DemoGroup } from "./DemoGroup";

/**
 * /demo/g/<slug> — resolves the slug and hands off to DemoGroup.
 *
 * Its own route rather than a branch inside Demo.tsx because a group URL is
 * two segments deep: `/demo/:slug` would match "group" as the slug and report
 * that no demo called "group" exists. The registry key carries the prefix
 * (`g/ecgwholesale`), so a group can never collide with a seller handle
 * registered as a plain demo.
 */
export function DemoGroupRoute() {
  const { slug = "" } = useParams();
  const demo = findDemo(`g/${slug}`);

  if (!demo || demo.kind !== "group") {
    return (
      <Shell width="wide">
        <div className="vm-form">
          <h1>No group here</h1>
          <p>
            There is no group demo registered as <code>{slug}</code>. See{" "}
            <code>src/demo/README.md</code>.
          </p>
        </div>
      </Shell>
    );
  }

  return <DemoGroup demo={demo} />;
}
