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

/**
 * 🚨 THE ID EVERY INVENTED FIGURE CITES.
 *
 * Whole tabs of this demo (sourcing, advertising, keyword ranks) show numbers
 * NOBODY MEASURED — they exist to show what the page would look like once the
 * pipelines behind them are built. On a product whose entire claim is that its
 * figures mean something exactly, an invented number that loses its marker is
 * the worst bug this page could have.
 *
 * So invention is not a loose asterisk typed beside a value; it is a SOURCE
 * like any other. `source: INVENTED` renders "*" instead of a footnote number,
 * and that marker links to a bibliography entry that says, in as many words,
 * that we made it up. A figure therefore cannot be invented and unmarked
 * without someone deleting its source — which does not type-check, because
 * `source` is required.
 */
export const INVENTED = "invented";

/** Where a figure came from, and when we looked. */
export interface Source {
  /** Stable id, referenced by `Figure.source`. Short: "keepa", "similarweb". */
  id: string;
  /** What it is called in the Sources list. */
  label: string;
  /** Where a reader checks it themselves. Omitted only for an API with no
   *  public URL, which must then say so in `detail`. */
  href?: string;
  /** The date we read it. A traffic figure with no date is not a figure.
   *  Omitted only by the INVENTED entry, where "read" would be a lie — nobody
   *  read anything. */
  read?: string;
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

/** One dot on the vertical timeline. */
export interface TimelineEvent {
  /** ISO date, or a bare year where that is all anybody published. */
  date: string;
  title: string;
  detail?: string;
  /** Which strand of the business this belongs to. Four tracks, because a
   *  product launch and an ad campaign are not the same kind of event and a
   *  reader scanning for one should not have to read the other. */
  track: "brand" | "amazon" | "ads" | "web";
  source: string;
}

/** A supplier quote — what a unit would cost to make and to land. */
export interface SourcingRow {
  supplier: string;
  region: string;
  moq: string;
  unitCost: string;
  leadTime: string;
  href?: string;
  source: string;
}

/** Spend on one advertising channel.
 *
 * 🚨 TWO sources, because the channel and its spend are not the same claim.
 * Meta genuinely publishes every ad a page runs — that is `linkSource`, a real
 * citation on the channel NAME. It publishes no spend at all, so `source`, the
 * citation on the FIGURE, is INVENTED. Collapsing the two put a real footnote
 * number beside a made-up dollar amount and read as "Meta says they spend
 * $46,500", which is exactly the confusion this page exists to avoid. */
export interface AdChannel {
  channel: string;
  spend: string;
  note?: string;
  href?: string;
  /** Answerable for the SPEND figure. */
  source: string;
  /** Answerable for the channel being real and what is running on it. */
  linkSource?: string;
  /**
   * What is actually MEASURABLE on this channel — "~310 active ads", "17 paid
   * keywords in May 2026". Spend is the figure nobody publishes; activity is
   * the figure somebody does, and showing it beside the modelled spend is the
   * difference between "we counted this" and "we guessed this".
   */
  activity?: string;
  /** Answerable for `activity`. Real, or the field should not be there. */
  activitySource?: string;
}

/** Where they rank for a term someone actually searches. */
export interface KeywordRow {
  term: string;
  engine: "Amazon" | "Google";
  rank: string;
  volume: string;
  source: string;
}

/**
 * A best-seller rank, read off the listing itself.
 *
 * The honest answer to "where do they rank on Amazon", given that Amazon
 * publishes no search volumes and its search results are localised to the
 * viewer. BSR is printed on every product page, is per-marketplace rather than
 * per-viewer, and is the number a seller in this category actually watches.
 */
export interface BestsellerRank {
  /** The product, as short as it can be and still be identifiable. */
  label: string;
  /** "#95 in Health & Household". Pre-formatted, like every figure here. */
  rank: string;
  /** The category rank that means more than the department one, plus stars
   *  and rating count — all printed on the same page. */
  note?: string;
  source: string;
}

/** A place this brand can be found, rendered as an icon link under the bio.
 *
 * `platform` picks the mark, so it is a closed set rather than a free string:
 * an icon chosen by the fixture is an icon that eventually disagrees with the
 * link beside it. Anything without a mark of its own is "web".
 */
export interface BrandLink {
  platform: "amazon" | "website" | "instagram" | "facebook" | "tiktok";
  /** What the link says. "Amazon store", "@theogloadedtea". */
  label: string;
  href: string;
  /** The platform's own headline number — followers, likes, visits. A FIGURE,
   *  which is why `source` below is required and not optional: a follower
   *  count with no origin is the thing this page argues against. */
  metric?: string;
  /** Answerable for both the link and its metric. */
  source: string;
}

/**
 * 🚧 THE UNIT ECONOMICS — and the one place this product's own rule bends.
 *
 * BRANDING/SKILL both say margin is the number VerifiedMargins never guesses,
 * and the sourcing tab was built to show quotes WITHOUT totalling them into a
 * profit figure. This block totals them, on an explicit instruction, so the
 * demo can show the shape of a finished page rather than a hole where the
 * interesting half goes.
 *
 * What makes that survivable is that it is invented THE SAME WAY everything
 * else invented here is: `source` is INVENTED, every derived figure renders a
 * "*", and the tabs carrying them lead with the placeholder notice. A reader
 * who follows the marker lands on a bibliography entry that says we made it
 * up. It must never be shown any other way.
 */
export interface Economics {
  /** Cost lines as a percentage of revenue, in the order they are deducted.
   *  Profit is the remainder, so the page never needs a profit input it could
   *  contradict — 100 − sum(lines) is the only definition of the number.
   *
   *  🚨 Each line names its OWN source, because they are not the same kind of
   *  number. Amazon publishes its referral rate; a rate card publishes the FBA
   *  fee; a supplier publishes a quote; nobody publishes what this business
   *  spends on ads or loses to returns. One source on the block would have
   *  flattened all four into whichever was weakest. */
  lines: Array<{ label: string; pct: number; note?: string; source: string }>;
  /** Where the percentages came from, in words — which quotes, which rates. */
  basis: string;
  /** INVENTED, always. Typed as a string because the field is a source id like
   *  any other, but a real one here would be a claim nobody can support. */
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
  /**
   * 🚨 THE ASPECT RATIO, because CSS cannot ask an image what shape it is.
   *
   * Two regimes, and each one wrecks the other's logo. A WIDE wordmark is
   * sized on height (34px) and left to run as wide as it likes; a SQUARE mark
   * given that treatment renders about 37px across, a stamp beside a 2rem
   * heading, so it takes the avatar's whole box instead. Required rather than
   * optional: a defaulted logo shape is a shape nobody looked at, and the
   * wrong one is silent — the page renders, it just renders badly.
   */
  logoShape: "wide" | "square";
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
    /** What that score MEANS, in words — "poor, for a business this size".
     *  In words on purpose: red on a figure means unverified on this site and
     *  never "bad" (BRANDING.md section 11), so the judgement cannot be
     *  carried by colour. Per dossier, because it is a reading of one number
     *  and not every score deserves the same sentence. */
    feedbackNote?: string;
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
  /** The same presence as ICON LINKS, under the bio, with each platform's own
   *  headline number. Deliberately a second, shorter list rather than a view
   *  of `offAmazon`: that one carries dead domains, redirects and an ad-library
   *  search — findings, which belong in prose — and a row of icons is a place
   *  a reader goes to LEAVE the page. Only somewhere worth sending them. */
  links: BrandLink[];
  /** The vertical history, oldest first. */
  timeline: TimelineEvent[];
  /** 🚧 Cost of goods, which we do not have. Quotes that WOULD price it. */
  sourcing: SourcingRow[];
  /** 🚧 Those quotes turned into a margin, and the profit line on the overview
   *  chart. Entirely invented — see Economics. */
  economics: Economics;
  /** 🚧 Ad spend across channels. Only the Meta ad library link is real. */
  advertising: AdChannel[];
  /** Search presence off Amazon. Ranks and volumes from a keyword tool, so
   *  they are that tool's estimate — but they are somebody's measurement
   *  rather than ours. */
  keywords: KeywordRow[];
  /** Amazon rank, read off the listings. See BestsellerRank for why this is
   *  here instead of Amazon keyword positions. */
  bestsellers: BestsellerRank[];
  /** What we do NOT know, stated on the page. A dossier that lists only what
   *  it found reads as complete, and this one is not. */
  gaps: string[];
  sources: Source[];
  /**
   * 🚨 THE PROSE THAT IS ABOUT THIS BUSINESS AND NOT ABOUT DOSSIERS.
   *
   * Every one of these lines began life hardcoded in DemoSourced.tsx, written
   * about the first brand profiled — "four years of building an audience
   * elsewhere", "three packs carry the business". The second dossier made them
   * false without making anything fail: the page still rendered, still read
   * fluently, and described a different company. That is the worst failure
   * shape a page like this has, so the sentences live with the brand they are
   * about and the page owns none of them.
   *
   * Required, all of them. An optional caption falls back to silence, and a
   * chart with no caption is the one place a reader most needs a sentence.
   */
  copy: {
    /** Under the overview's profit chart: what its shape means here. The
     *  chart draws a modelled profit history against the real listing dates,
     *  so this sentence is where a fixture says what the reader is looking
     *  at — including, for both dossiers so far, that the catalogue arrived
     *  in a burst rather than a curve. */
    profitChart: string;
    /** Above the timeline: what the strands do to each other in THIS history. */
    timelineLede: string;
    /** Above the revenue bars on the sales tab, including the disclosure of
     *  what the listed ASINs do NOT add up to. */
    salesLede: string;
    /** Above the ad channels: what is genuinely public for this brand, which
     *  differs — one advertiser has a Meta ad library page worth opening and
     *  another has nothing at all. */
    advertisingLede: string;
    /** Above the off-Amazon list: what the half Amazon cannot see amounts to
     *  here. For some brands that paragraph has to say "almost nothing", which
     *  is itself the finding. */
    trafficLede: string;
  };
}
