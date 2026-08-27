import { Link } from "react-router-dom";

export interface Crumb {
  label: string;
  /** Omitted on the last crumb — you are already there. */
  to?: string;
}

/**
 * `VerifiedMargins › Founder › Acme Brands`.
 *
 * Plain text on the page background — no fill, no border. It had both for a
 * while, which made it a box competing with the profile header directly
 * beneath it. A breadcrumb is orientation, not an object: it should be the
 * quietest thing on the page you can still read.
 *
 * Rendered INSIDE the profile header (the shared page's `breadcrumb` slot),
 * not in the site chrome, so it lines up with the name it introduces and the
 * first action button lands on its line.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav data-crumbs="" aria-label="Breadcrumb">
      {items.map((c, i) => (
        <span key={`${c.label}-${i}`} data-crumb="">
          {i > 0 ? (
            <span data-crumb-sep="" aria-hidden="true">
              ›
            </span>
          ) : null}
          {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}
