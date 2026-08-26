/**
 * Sidebar icons. Drawn here rather than pulled from a pack for two reasons:
 * seven 20px glyphs are not worth a dependency, and every one inherits
 * `currentColor` so the active/inactive states come from the nav's own colour
 * rules instead of a second set of fills to keep in step.
 *
 * All stroke-based at the same weight, so they read as one family beside
 * text at the same size.
 */
const S = {
  width: 19,
  height: 19,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function FeedIcon() {
  return (
    <svg {...S}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

export function LeaderboardIcon() {
  return (
    <svg {...S}>
      <path d="M6 20V12M12 20V5M18 20v-6" />
    </svg>
  );
}

/** A question inside the verification check's circle — "how does the tick
 *  get there", which is exactly what the page behind it answers. */
export function HowItWorksIcon() {
  return (
    <svg {...S}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.2 2.6c-.6.2-.9.7-.9 1.3v.4" />
      <path d="M12 16.6h.01" />
    </svg>
  );
}

/** A shield with a tick: the verification motif, and the same check the
 *  badge and the logo use. */
export function VerifyIcon() {
  return (
    <svg {...S}>
      <path d="M12 3.5l6.5 2.4v5.3c0 3.9-2.6 7.4-6.5 8.8-3.9-1.4-6.5-4.9-6.5-8.8V5.9z" />
      <path d="M9.2 11.8l1.9 2 3.6-3.9" />
    </svg>
  );
}

export function DashboardIcon() {
  return (
    <svg {...S}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function ProfileIcon() {
  return (
    <svg {...S}>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.8 19.5a7.4 7.4 0 0 1 14.4 0" />
    </svg>
  );
}

export function SignOutIcon() {
  return (
    <svg {...S}>
      <path d="M15 4.5h3.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H15" />
      <path d="M10 8l-4 4 4 4M6 12h9" />
    </svg>
  );
}
