/**
 * The VerifiedMargins mark: "VM", where the V is a checkmark.
 *
 * Inlined as SVG rather than an <img> for one reason — theming. The M is drawn
 * in `currentColor`, so it inherits whatever the surrounding text colour is and
 * stays legible in both schemes. A file with a hard-coded black M would vanish
 * against the dark background, where globals.css flips --accent to #e9ecf1.
 *
 * The check keeps an explicit green in both schemes: it is the "verified"
 * signal, and it is the one piece of real brand colour the product has. Light
 * mode uses --success (#10683f); the dark-scheme override is applied by the
 * class below so the green lifts to #4ade80, matching --success in dark.
 *
 * /public/logo.svg is the same artwork as a standalone file, for the favicon,
 * og:image and anywhere outside React.
 */
export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      role="img"
      aria-label="VerifiedMargins"
      className="vm-logo shrink-0"
    >
      <path
        d="M 66 240 L 140 362 L 240 152"
        fill="none"
        stroke="var(--success)"
        strokeWidth="50"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 330 362 L 330 178 L 388 296 L 446 178 L 446 362"
        fill="none"
        stroke="currentColor"
        strokeWidth="50"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
