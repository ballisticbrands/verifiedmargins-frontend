/**
 * A SOURCED DOSSIER — what we can learn about a seller who has never heard of
 * us, and where every line of it came from.
 *
 * 🚧 The product has no such page. This is the second use of the case
 * src/demo/README.md reserves for a feature that does not exist yet (the first
 * is `group`), and like that one it has no real page it could drift from.
 *
 * ── Why a figure cannot exist here without a source ──────────────────────
 * On a site called VerifiedMargins, a number with no stated origin is the
 * exact thing the product argues against. So `Figure.source` is REQUIRED and
 * is an id into `Dossier.sources`: adding a figure without registering where
 * it came from does not type-check. That is deliberate — it is the one
 * invariant worth spending the type system on, because the failure mode is a
 * page that looks authoritative and cannot be checked.
 *
 * None of this is verified. Every figure here is modelled or read off someone
 * else's public page, which is why the dossier renders at the bottom rung of
 * the ladder (BRANDING.md section 5) and says so above the numbers, not in a
 * footnote.
 */

/** Where a figure came from, and when we looked. */
export interface Source {
  /** Stable id, referenced by `Figure.source`. Short: "keepa", "similarweb". */
  id: string;
  /** What it is called in the Sources list. */
  label: string;
  /** Where a reader checks it themselves. Omitted only for an API with no
   *  public URL, which must then say so in `detail`. */
  href?: string;
  /** The date we read it. A traffic figure with no date is not a figure. */
  read: string;
  /** What this source is responsible for on the page. */
  detail: string;
}

/** A single number, and the source that is answerable for it. */
export interface Figure {
  label: string;
  /** Pre-formatted. The page never does arithmetic on a dossier — the
   *  numbers are findings, and formatting them at the call site is what lets
   *  a fixture say "$1.58M" and "45,050" and "72%" without the page owning a
   *  unit system it would have to guess at. */
  value: string;
  /** A qualifier — "of 52 ASINs", "floor". Never decoration. */
  note?: string;
  /** Id into `Dossier.sources`. Required, see the header. */
  source: string;
  /** Marks a figure whose weakness is the point — a poor feedback score, a
   *  count that is a floor. Rendered with emphasis, never with colour: red on
   *  this site means unverified, never "a bad number" (BRANDING.md section 11). */
  flag?: boolean;
}

/** One product line, for the table and the revenue chart. */
export interface DossierAsin {
  asin: string;
  title: string;
  /** Amazon's "bought in past month" badge, as a number. A FLOOR: the badge
   *  reads "10,000+" and Keepa stores 10000. */
  monthlySold: number;
  /** Buy box, in cents, or null where nothing is currently offered. */
  priceCents: number | null;
  /** ISO date the ASIN was first listed on Amazon. */
  listed: string;
}

/** A presence somewhere that is not Amazon. */
export interface OffAmazon {
  label: string;
  href: string;
  /** The headline number, if the platform shows one. */
  value?: string;
  note?: string;
  source: string;
}

export interface Dossier {
  /** The brand as Amazon spells it. */
  brand: string;
  /** One line: what they sell. Sits where a business page puts "Amazon FBA". */
  what: string;
  /** The brand's logo, in the slot a founder's face occupies. Served from OUR
   *  origin (public/demo/…), never hotlinked — a retailer CDN URL carries a
   *  version query, expires, and often blocks cross-origin embedding, so a
   *  hotlinked logo is a header that breaks silently months later. */
  logo: string;
  /** The business actually operating the listings, from the seller record. */
  operator: {
    businessName: string;
    sellerName: string;
    sellerId: string;
    address: string[];
    country: string;
    storefrontUrl: string;
    /** Pre-formatted, e.g. "72% over 337 ratings". A big business carrying a
     *  poor score is the interesting case, so it sits with the operator rather
     *  than in a tile where it would read as a performance metric. */
    feedback: string;
    source: string;
  };
  /** The four StatTiles, pre-formatted — the same row a business page leads
   *  with, so a reader crossing between the two does not re-learn it. */
  headline: {
    revenue: string;
    units: string;
    asp: string;
    catalogue: string;
  };
  /** The prose in the `Business deep-dive` block: what this business IS, and
   *  the finding that makes it worth a page. Clamped until Expand. */
  deepDive: string;
  /** Everything else worth a labelled number, each naming its source. Used by
   *  the sections below the fold rather than the tile row. */
  figures: Figure[];
  /** The largest priced ASINs, best-selling first — NOT necessarily all of
   *  them; `pricedCount` is the true total. The page discloses the difference
   *  rather than letting a reader add the column up and get a smaller number
   *  than the headline. */
  asins: DossierAsin[];
  /** Catalogue arithmetic, stated so the page never hardcodes it. */
  counts: {
    /** Every ASIN under the brand. */
    catalogue: number;
    /** Those with a live price AND a sold badge — the ones revenue comes from. */
    priced: number;
    /** Carrying no badge, and therefore counted as ZERO revenue. */
    unbadged: number;
  };
  /** The brand's first-ever Amazon listing. Often predates the catalogue push
   *  by a long way, and the timeline chart only covers `asins`, so the page
   *  has to say this out loud. */
  firstListed: string;
  /** Off-Amazon presence — the half Keepa cannot see. */
  offAmazon: OffAmazon[];
  /** What we do NOT know, stated on the page. A dossier that lists only what
   *  it found reads as complete, and this one is not. */
  gaps: string[];
  sources: Source[];
}
