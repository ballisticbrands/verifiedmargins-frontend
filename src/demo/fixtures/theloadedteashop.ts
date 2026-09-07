/**
 * The Loaded Tea Shop — a sourced dossier.
 *
 * Built entirely from public data by the VM-amazon-store-scraping skill
 * (Dragon-marketing/skills/VM-amazon-store-scraping), Phase 2, on 2026-09-07.
 * Nobody at this business has spoken to us.
 *
 * ── The arithmetic ───────────────────────────────────────────────────────
 * Revenue is sum(monthlySold x buy box) over the whole 52-ASIN catalogue, and
 * it is a FLOOR twice over:
 *
 *   1. `monthlySold` is Amazon's own "bought in past month" badge, which comes
 *      in brackets. "10,000+" is stored as 10000, so every badged ASIN is
 *      counted at the bottom of its bracket.
 *   2. Amazon only shows the badge above roughly 50/month. 34 of the 52 ASINs
 *      carry no badge and are counted as ZERO. They are not zero; they are
 *      each selling under ~50/month.
 *
 * $1,578,010/mo = 45,050 units at a $35.03 average. See SKILL.md section 4.
 *
 * ── The finding worth the page ───────────────────────────────────────────
 * This brand is not new. It is new TO AMAZON — trading since 2019 on its own
 * Shopify store and Instagram, and only pushing a catalogue onto Amazon from
 * March 2026. Keepa cannot tell you that; a web search can. That gap is the
 * argument for the human review step the skill describes.
 */
import type { Dossier } from "../dossier";

export const theLoadedTeaShop: Dossier = {
  brand: "The Loaded Tea Shop",
  what: "Sugar-free, zero-calorie energy drink mix sticks — 40+ flavours, sold in 5, 10, 20 and 40 packs.",
  standfirst:
    "A founder-led brand that started in a Gulfport kitchen in 2019, built an audience on Instagram, " +
    "and only began pushing a real catalogue onto Amazon in March 2026. Six months in, the Amazon " +
    "business is turning an estimated $1.58M a month through a seller account rated 72%.",

  operator: {
    businessName: "Champs Tea Shop, Inc",
    sellerName: "TheLoadedTeashop",
    sellerId: "A2FLJTREXC9RX4",
    address: ["6025 S Vista Dr", "Gulfport", "MS", "39507"],
    country: "US",
    storefrontUrl: "https://www.amazon.com/sp?seller=A2FLJTREXC9RX4",
    source: "keepa-seller",
  },

  figures: [
    {
      label: "Monthly revenue",
      value: "$1.58M",
      note: "floor — 34 of 52 ASINs counted as zero",
      source: "keepa",
      flag: true,
    },
    { label: "Annualised", value: "$18.9M", note: "run rate, not booked", source: "keepa" },
    { label: "Units / month", value: "45,050", note: "sum of bracket floors", source: "keepa" },
    { label: "Average selling price", value: "$35.03", source: "keepa" },
    {
      label: "Catalogue",
      value: "52 ASINs",
      note: "only 18 are priced and selling",
      source: "keepa",
    },
    {
      label: "Seller feedback",
      value: "72%",
      note: "over 337 ratings — poor for this revenue",
      source: "keepa-seller",
      flag: true,
    },
    { label: "First Amazon listing", value: "May 2025", note: "catalogue push began Mar 2026", source: "keepa" },
    {
      label: "Instagram",
      value: "59.3K",
      note: "followers; first post 79 weeks ago",
      source: "instagram",
    },
    {
      label: "Own-site visits",
      value: "5,324",
      note: "monthly, theloadedteashop.com",
      source: "similarweb",
    },
  ],

  counts: { catalogue: 52, priced: 18, unbadged: 34 },
  firstListed: "2025-05-20",

  /* The 15 LARGEST of the 18 priced ASINs, best-selling first. The three not
     listed are worth about $4,950/month between them, which is why the table
     sums to ~$1.573M against a $1.578M headline — the page says so rather
     than leaving a reader to find the gap. B0H2N9SBT5 carries a sold
     badge but no live buy box, so it contributes units and no revenue — left
     in rather than filtered, because a caffeine-free line going out of stock
     is a fact about the business. */
  asins: [
    { asin: "B0GVG8YXKY", title: "Variety 20 Pack", monthlySold: 10000, priceCents: 6000, listed: "2026-03-30" },
    { asin: "B0GX75GX55", title: "Founder's Favorites 5 Pack", monthlySold: 10000, priceCents: 1980, listed: "2026-04-14" },
    { asin: "B0H1GBFYNV", title: "Mom Mode Collection 5 Pack", monthlySold: 6000, priceCents: 1980, listed: "2026-05-12" },
    { asin: "B0GYGLSHD1", title: "Flavor Discovery 5 Pack", monthlySold: 6000, priceCents: 1980, listed: "2026-04-24" },
    { asin: "B0GVGF33VD", title: "Variety 10 Pack", monthlySold: 6000, priceCents: 3800, listed: "2026-03-30" },
    { asin: "B0GYGLDN6C", title: "Flavor Discovery 10 Pack", monthlySold: 2000, priceCents: 3800, listed: "2026-04-24" },
    { asin: "B0GVGC368X", title: "Variety 40 Pack", monthlySold: 1000, priceCents: 12000, listed: "2026-03-30" },
    { asin: "B0H1G8FXJN", title: "Mom Mode Collection 10 Pack", monthlySold: 1000, priceCents: 3800, listed: "2026-05-12" },
    { asin: "B0GX7CRFMR", title: "Founder's Favorites 10 Pack", monthlySold: 1000, priceCents: 3800, listed: "2026-04-14" },
    { asin: "B0H2N9SBT5", title: "Caffeine-Free Variety", monthlySold: 1000, priceCents: null, listed: "2026-05-22" },
    { asin: "B0GYGCLMMJ", title: "Berry Blast Collection 5 Pack", monthlySold: 800, priceCents: 1980, listed: "2026-04-24" },
    { asin: "B0GXLD6TML", title: "Frog Spit 5 Pack", monthlySold: 700, priceCents: 1980, listed: "2026-04-17" },
    { asin: "B0GXLJ48WT", title: "Bahama Mama 10 Pack", monthlySold: 100, priceCents: 3800, listed: "2026-04-17" },
    { asin: "B0GXLDGCHF", title: "Mermaid 5 Pack", monthlySold: 100, priceCents: 1980, listed: "2026-04-17" },
    { asin: "B0GXLFSPZ2", title: "Bahama Mama 5 Pack", monthlySold: 100, priceCents: 1980, listed: "2026-04-17" },
  ],

  offAmazon: [
    {
      label: "Own store",
      href: "https://www.theloadedteashop.com/",
      value: "5,324 visits/mo",
      note: "Shopify. The channel that came first.",
      source: "similarweb",
    },
    {
      label: "Instagram — @theogloadedtea",
      href: "https://www.instagram.com/theogloadedtea/",
      value: "59.3K followers",
      note: "First post 79 weeks ago (≈ March 2025).",
      source: "instagram",
    },
    {
      label: "Linktree",
      href: "https://linktr.ee/theloadedteashop",
      note: "TikTok and Facebook hang off this.",
      source: "web",
    },
    {
      label: "Founder story",
      href: "https://www.theloadedteashop.com/pages/who-the-heck-are-you-people",
      note: "Started in a kitchen in 2019 by ex-Herbalife distributors who built their own product.",
      source: "web",
    },
  ],

  gaps: [
    "COGS, and therefore margin and profit. Nothing here models what the product costs to make or land — see SKILL.md section 8. On a site called VerifiedMargins that is the one number we will not guess.",
    "Ad spend. No public source reports a competitor's Amazon ad spend; anyone quoting one is modelling it. A sponsored-placement read off live search results is the honest substitute and has not been run for this brand.",
    "The 34 unbadged ASINs. Each sells under roughly 50/month, but Amazon publishes no figure, so they are counted as zero rather than estimated.",
    "Why the feedback score is 72%. The number is public; the cause is not. It could be fulfilment, a bad batch, or a review-bombing — and the difference matters.",
  ],

  sources: [
    {
      id: "keepa",
      label: "Keepa Product API",
      href: "https://keepa.com/#!api",
      read: "2026-09-07",
      detail:
        "Whole-catalogue pull: 52 ASINs, their monthlySold badge, buy box price and first-listed date. Revenue and units are computed from these, never reported by anyone.",
    },
    {
      id: "keepa-seller",
      label: "Keepa Seller API",
      href: "https://keepa.com/#!api",
      read: "2026-09-07",
      detail:
        "The operating business behind the brand: legal name, registered address, country and feedback score, resolved from the buy-box seller on the brand's top ASINs.",
    },
    {
      id: "instagram",
      label: "Instagram — @theogloadedtea",
      href: "https://www.instagram.com/theogloadedtea/",
      read: "2026-09-07",
      detail: "Follower count and the age of the account's first post, read off the public profile.",
    },
    {
      id: "similarweb",
      label: "Similarweb — theloadedteashop.com",
      href: "https://www.similarweb.com/website/theloadedteashop.com/",
      read: "2026-09-07",
      detail:
        "Monthly visits to the brand's own store. Similarweb is itself an estimate from panel and clickstream data, not a server-side count.",
    },
    {
      id: "web",
      label: "The brand's own pages",
      href: "https://www.theloadedteashop.com/pages/who-the-heck-are-you-people",
      read: "2026-09-07",
      detail:
        "Founding year, founder, and the Herbalife origin — the brand's own account of itself, taken at its word and labelled as such.",
    },
  ],
};
