/**
 * Resilia Oil Of Oregano — a sourced dossier.
 *
 * Built entirely from public data by the VM-amazon-store-scraping skill
 * (Dragon-marketing/skills/VM-amazon-store-scraping), Phase 2, on 2026-09-07.
 * Nobody at this business has spoken to us.
 *
 * ── The arithmetic ───────────────────────────────────────────────────────
 * Revenue is sum(monthlySold x buy box) across the whole 32-ASIN catalogue,
 * and it is a FLOOR twice over, for the same two reasons as every dossier
 * here: `monthlySold` is Amazon's bracketed "bought in past month" badge and
 * is counted at the bottom of its bracket, and the 12 ASINs Amazon shows no
 * badge for are counted as ZERO rather than estimated.
 *
 * $5,658,554/mo = 143,000 units at a $39.57 average, on a catalogue whose
 * first listing went up on 2025-11-27. Ten months, on 32 SKUs.
 *
 * ── The finding worth the page ───────────────────────────────────────────
 * The brief for this dossier said Resilia was the opposite of The Loaded Tea
 * Shop: Amazon-native, no website worth the name. IT IS NOT, and the check
 * that showed it is the whole argument for this page existing.
 *
 * resilia.shop is a live subscription store selling the same three lines, its
 * terms name "Sack Consulting Inc. d/b/a Resilia", it publishes the SAME phone
 * number as the Amazon seller record, and the Wayback Machine has it selling
 * oregano-and-black-seed softgels in August 2024 — fifteen months before the
 * first Amazon listing. Similarweb puts it at 9.9M visits over three months.
 *
 * So the real contrast with The Loaded Tea Shop is not Amazon-native versus
 * DTC-first. Both came to Amazon late. One built an audience — 59.3K Instagram
 * followers, 5,324 visits a month. The other BUYS one, at a scale where the
 * ads run under advertiser pages called "Everyday Wellness Review".
 */
import { INVENTED, MODELLED, type Dossier } from "../dossier";

export const resilia: Dossier = {
  brand: "Resilia Oil Of Oregano",
  what: "Amazon FBA · oregano, black seed and aged garlic softgels",
  logo: "/demo/resilia-logo.png",
  /* 800x210 wordmark, cropped from the brand store's own square avatar. Wide,
     so it keeps the shared height-sized treatment — see logoShape. */
  logoShape: "wide",

  headline: {
    revenue: "$5.66M",
    units: "143,000",
    asp: "$39.57",
    catalogue: "32 ASINs",
  },

  deepDive:
    "Resilia sells oil of oregano, Ethiopian black seed and odorless aged garlic softgels — three " +
    "supplement lines, 32 ASINs, an estimated $5.66M a month. What makes it worth a page is the " +
    "speed: the first listing went up on 2025-11-27 and the catalogue was turning a ~$68M annual " +
    "run rate inside ten months, with the six aged-garlic SKUs that now lead the business all " +
    "listed on a single day in May 2026. That is not how a brand grows into Amazon; it is how a " +
    "brand that already knows how to sell arrives on it. " +
    "The obvious reading — a new Amazon-native brand with no web presence — is wrong, and this is " +
    "the part a human check adds. resilia.shop is a live subscription store selling the same three " +
    "lines; the Wayback Machine has it selling oregano-and-black-seed softgels in August 2024, " +
    "fifteen months before the first ASIN. Its terms of sale name Sack Consulting Inc. d/b/a " +
    "Resilia, and it publishes the same support number, +1 (203) 516-7743, that sits on the Amazon " +
    "seller record — so the store and the storefront are one business, tied together by two " +
    "documents rather than by an assumption. Similarweb reports 9.9M visits to that store across " +
    "three months to August 2026, up 52.9% month on month. " +
    "The operator reads like a professional one rather than a founder: \"Sack Consulting Inc.\" " +
    "filed the RESILIA trademark ten weeks before the first listing, and the paid acquisition " +
    "behind the DTC store runs through Meta pages named \"Everyday Wellness Review\" and " +
    "\"Vascular Wellness Report\" rather than under the brand. Three geographies attach to the same " +
    "business and nothing public reconciles them: a registered address in Palos Verdes Peninsula, " +
    "California, a Connecticut area code on the phone, and a Miami, Florida address with Florida " +
    "governing law in the store's terms. Each is ordinary on its own. Together they are the first " +
    "thing to ask about. " +
    "The number that does not fit the story is the seller feedback score: 82% over 4,572 ratings " +
    "is poor for a business this size, and on a catalogue this young it is 4,572 ratings' worth of " +
    "something.",

  operator: {
    businessName: "Sack Consulting Inc.",
    sellerName: "Resilia Oregano",
    sellerId: "A2SU6X7KL307SD",
    address: ["53 Silver Saddle Lane", "Palos Verdes Peninsula", "CA", "90274"],
    country: "US",
    storefrontUrl: "https://www.amazon.com/sp?seller=A2SU6X7KL307SD",
    feedback: "82% over 4,572 ratings",
    feedbackNote: "poor, for a business this size",
    source: "keepa-seller",
  },

  figures: [
    {
      label: "Monthly revenue",
      value: "$5.66M",
      note: "floor — 12 of 32 ASINs counted as zero",
      source: "keepa",
      flag: true,
    },
    { label: "Annualised", value: "$67.9M", note: "run rate, not booked", source: "keepa" },
    { label: "Units / month", value: "143,000", note: "sum of bracket floors", source: "keepa" },
    { label: "Average selling price", value: "$39.57", source: "keepa" },
    {
      label: "Catalogue",
      value: "32 ASINs",
      note: "21 carry a live price; 20 carry a sold badge",
      source: "keepa",
    },
    {
      label: "First Amazon listing",
      value: "2025-11-27",
      note: "nine months before the figure above",
      source: "keepa",
    },
    {
      label: "Seller feedback",
      value: "82%",
      note: "over 4,572 ratings — poor for this revenue",
      source: "keepa-seller",
      flag: true,
    },
    /* 🚨 The same number twice, from two different records, because THE MATCH
       is the finding and a match cannot be cited to one side of itself. This
       is what ties the Amazon seller to the Shopify store; everything the
       traffic tab says about resilia.shop rests on it. */
    {
      label: "Phone — Amazon seller record",
      value: "+1 (203) 516-7743",
      note: "Connecticut area code, against a California address",
      source: "keepa-seller",
    },
    {
      label: "Phone — resilia.shop",
      value: "+1 (203) 516-7743",
      note: "the same number, on the brand's own store",
      source: "own-store",
    },
    {
      label: "Own-store visits",
      value: "9.9M",
      note: "over three months to Aug 2026, resilia.shop, +52.9% MoM",
      source: "similarweb",
    },
    /* 🚨 The two traffic estimates disagree by three orders of magnitude, and
       the gap IS the finding rather than a problem with it: Similarweb counts
       every visit however it arrived, Ubersuggest counts only what Google
       sends. Almost none of this store's traffic comes from search. */
    {
      label: "of which organic search",
      value: "2,120 / mo",
      note: "Ubersuggest, Aug 2026 — against ~3.3M visits a month on Similarweb's read",
      source: "ubersuggest",
      flag: true,
    },
    {
      label: "Trademark filed",
      value: "2025-09-19",
      note: "RESILIA, by Sack Consulting Inc. — ten weeks before the first listing",
      source: "uspto",
    },
  ],

  counts: { catalogue: 32, priced: 21, unbadged: 12 },
  firstListed: "2025-11-27",

  /* The 15 LARGEST of the 21 priced ASINs, best-selling first. They sum to
     $5,614,561 against the $5,658,554 headline: the six not listed are worth
     about $44,000 a month between them, and the page says so rather than
     leaving a reader to add the column up and find a gap. */
  asins: [
    { asin: "B0GWRZSRH7", title: "Odorless Aged Garlic Extract Softgels (60 Count)", monthlySold: 50000, priceCents: 2989, listed: "2026-04-10" },
    { asin: "B0G6B59FT5", title: "Oil Of Oregano Softgels with Black Seed Oil — 120 Softgels", monthlySold: 30000, priceCents: 4999, listed: "2025-12-11" },
    { asin: "B0G49SXQGL", title: "Softgels with Black Seed Oil — Premium Grade Oregano Oil", monthlySold: 20000, priceCents: 2999, listed: "2025-11-27" },
    { asin: "B0GZJBZZY2", title: "Odorless Aged Garlic Extract Softgels (60 Count)", monthlySold: 10000, priceCents: 3499, listed: "2026-05-04" },
    { asin: "B0GZHYBSMV", title: "Odorless Aged Garlic Extract Softgels (120 Count) 600mg", monthlySold: 10000, priceCents: 4999, listed: "2026-05-04" },
    { asin: "B0G6BLCM5G", title: "Oil Of Oregano Softgels with Black Seed Oil — 180 Softgels", monthlySold: 10000, priceCents: 5999, listed: "2025-12-11" },
    { asin: "B0GWSDVH4W", title: "Ethiopian Black Seed Softgels 1000mg Per Serving", monthlySold: 3000, priceCents: 2499, listed: "2026-04-10" },
    { asin: "B0GZJ78CLK", title: "Odorless Aged Garlic Extract Softgels (120 Count) 1200mg", monthlySold: 2000, priceCents: 6648, listed: "2026-05-04" },
    { asin: "B0GZJ7B35J", title: "Odorless Aged Garlic Extract Softgels (180 Count) 1200mg", monthlySold: 2000, priceCents: 7199, listed: "2026-05-04" },
    { asin: "B0GQ6TSSXL", title: "Oil Of Oregano Softgels with Black Seed Oil, 180 Softgels", monthlySold: 1000, priceCents: 7999, listed: "2026-02-25" },
    { asin: "B0GZJD1JGH", title: "Odorless Aged Garlic Extract Softgels (180 Count) 600mg", monthlySold: 1000, priceCents: 6999, listed: "2026-05-04" },
    { asin: "B0GNCZ8PJS", title: "D3 K2 Vitamin 10000 IU + MK-7 200 mcg", monthlySold: 1000, priceCents: 1299, listed: "2026-02-13" },
    { asin: "B0GXMPQ8ZV", title: "Black Seed Oil Softgels — Oil of Oregano Capsules", monthlySold: 1000, priceCents: 2999, listed: "2026-04-17" },
    { asin: "B0GK4YSDCS", title: "Milk Thistle Silymarin 300 mg with Vitamin C, Inositol", monthlySold: 500, priceCents: 1199, listed: "2026-01-27" },
    { asin: "B0GXLNWJQH", title: "Ethiopian Black Seed Softgels 1000mg — Nigella Sativa", monthlySold: 400, priceCents: 4999, listed: "2026-04-17" },
  ],

  offAmazon: [
    {
      label: "Own store — resilia.shop",
      href: "https://resilia.shop/",
      value: "9.9M visits / 3 mo",
      note:
        "A live Shopify subscription store selling the same three lines from $29.99/month. Its terms of sale name Sack Consulting Inc. d/b/a Resilia, and it publishes the same phone number as the Amazon seller record.",
      source: "own-store",
    },
    {
      label: "Instagram — @resilia",
      href: "https://www.instagram.com/resilia/",
      value: "32K followers",
      note:
        "274 posts under the brand's own name — so the brand does run an owned channel, even though the paid acquisition does not go through it.",
      source: "instagram",
    },
    {
      label: "shopresilia.com",
      href: "https://shopresilia.com/",
      note:
        "Registered 2024-12-18 and archived selling the same product; today it 301s to resilia.shop. The older of the two front doors.",
      source: "whois",
    },
    {
      label: "Meta ad library — keyword \"resilia\"",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=resilia&search_type=keyword_unordered&media_type=all",
      note:
        "Ads for Resilia Aged Garlic Extract are running under advertiser pages named \"Everyday Wellness Review\" and \"Vascular Wellness Report\" — not under the brand. A keyword search, so it also returns other advertisers; which pages this business controls is not established.",
      source: "meta-ads",
    },
    {
      label: "resilia.us",
      href: "https://resilia.us/",
      note:
        "Registered 2026-05-29 to a private individual in South Carolina, not to the operator, and it does not resolve. A search engine still returns product pages for it.",
      source: "whois",
    },
    {
      label: "resiliasupps.com",
      href: "https://resiliasupps.com/",
      note:
        "Registered 2026-03-08 through a corporate brand-protection registrar. Also does not resolve. Ownership unestablished.",
      source: "whois",
    },
  ],

  /* Three places worth sending someone, with each platform's own number. The
     dead domains and the ad-library search stay in `offAmazon`: those are
     findings to read, not doors to walk through. No Facebook page — the ads
     for this brand run under other pages entirely, and linking one of those as
     "their Facebook" would assert exactly what the gaps list says is
     unestablished. */
  links: [
    {
      platform: "amazon",
      label: "Amazon store",
      href:
        "https://www.amazon.com/stores/ResiliaoilofOregano/page/736E510E-2587-44A3-A4B8-35BBC28CEAAF",
      metric: "32 ASINs",
      source: "keepa",
    },
    {
      platform: "website",
      label: "resilia.shop",
      href: "https://resilia.shop/",
      metric: "9.9M visits / 3 mo",
      source: "similarweb",
    },
    {
      platform: "instagram",
      label: "@resilia",
      href: "https://www.instagram.com/resilia/",
      metric: "32K followers",
      source: "instagram",
    },
  ],

  /* Oldest first, and ENTIRELY REAL — every dot cites a published record. The
     brief expected the web and ad tracks to be made up; whois, the Wayback
     Machine and Meta's ad library turned out to publish dated events for all
     three, so they are cited instead of fabricated. */
  timeline: [
    {
      date: "2024-08-31",
      title: "resilia.shop already selling oregano softgels",
      detail:
        "The earliest Wayback capture: a Shopify store, one product, \"Oregano Oil with Black Seed Oil\". Fifteen months before the first Amazon listing.",
      track: "web",
      source: "wayback",
    },
    {
      date: "2024-12-18",
      title: "shopresilia.com registered",
      detail: "A second front door. It now redirects to resilia.shop.",
      track: "web",
      source: "whois",
    },
    {
      date: "2025-09-19",
      title: "RESILIA trademark filed",
      detail:
        "By Sack Consulting Inc., Rolling Hills Estates, CA — serial 99402158, for dietary and nutritional supplements. Ten weeks before the Amazon launch.",
      track: "brand",
      source: "uspto",
    },
    {
      date: "2025-11-27",
      title: "First Amazon listing",
      detail:
        "Oregano oil with black seed, $29.99. It is still the third-biggest earner in the catalogue.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2025-12-11",
      title: "The oregano line goes wide",
      detail: "120 and 180 counts on one day, at $49.99 and $59.99. The 120 becomes the flagship.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-01-27",
      title: "Milk thistle — the first product outside the oregano line",
      detail: "$11.99, and it never reaches 1,000 a month. The catalogue's first miss.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-02-13",
      title: "D3 K2",
      detail: "The second cheap line extension, and the second one that stays small.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-03-08",
      title: "resiliasupps.com registered",
      detail: "Through a corporate brand-protection registrar. It has never resolved for us.",
      track: "web",
      source: "whois",
    },
    {
      date: "2026-04-10",
      title: "Aged garlic and Ethiopian black seed launch",
      detail:
        "The 60-count garlic at $29.89 becomes the single biggest product in the business — 50,000+ a month, about a quarter of all revenue.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-04-17",
      title: "Black seed and oregano capsule variants",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-05-04",
      title: "Six aged-garlic SKUs in one day",
      detail:
        "60, 120 and 180 counts at two strengths, $34.99 to $71.99. A full ladder shipped at once, four weeks after the line's first product proved it.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-05-29",
      title: "resilia.us registered",
      detail:
        "To a private individual in South Carolina rather than to the operator. It does not resolve, and nothing public says whether it is affiliate, defensive or unrelated.",
      track: "web",
      source: "whois",
    },
    {
      date: "2026-05-31",
      title: "A paid-search burst",
      detail:
        "Ubersuggest's paid series peaks at 17 Google Ads keywords and ~780 paid visits in May 2026, after nothing much before April. By August it reads zero again — a campaign that ran and stopped.",
      track: "ads",
      source: "ubersuggest",
    },
    {
      date: "2026-08-03",
      title: "Meta ads running for the garlic line",
      detail:
        "Advertorial creative under a page called \"Everyday Wellness Review\"; 15 ads share the one video. On 2026-09-08 the library returned ~6,900 active US ads mentioning Resilia, under at least six review-styled page names. It publishes the creative and the start date, never the spend.",
      track: "ads",
      source: "meta-ads",
    },
    {
      date: "2026-08-31",
      title: "9.9M visits to resilia.shop over three months",
      detail: "Similarweb's August read, up 52.9% month on month. Global rank #6,723.",
      track: "web",
      source: "similarweb",
    },
  ],

  /* REAL QUOTES, for a comparable product — not this brand's costs.
     Read off Made-in-China listings on 2026-09-08: supplier, region, MOQ and
     the price range each one publishes. What they are NOT is what Resilia
     pays; a published range for "an oregano softgel" prices the CATEGORY, and
     the difference between that and a real cost sheet is the whole reason the
     margin below carries a "≈" rather than a number. Freight and duty are not
     in any of them — these are FOB China. */
  sourcing: [
    {
      supplier: "Guangzhou Green Health Pharmaceutical Technology Co., Ltd",
      region: "Guangdong, CN",
      moq: "3,000 bottles",
      unitCost: "$2.80–3.10 / bottle",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Oregano_Oil_Softgel.html",
      source: "mic",
    },
    {
      supplier: "Guangzhou Shengmei Pharmaceutical Industry Co., Ltd",
      region: "Guangdong, CN",
      moq: "300,000 softgels",
      unitCost: "$0.02–0.10 / softgel",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Oregano_Oil_Softgel.html",
      source: "mic",
    },
    {
      supplier: "Xi'an Tian Guangyuan Biotech Co., Ltd. — aged garlic, 300ct",
      region: "Shaanxi, CN",
      moq: "100 bags",
      unitCost: "$1.70–3.00 / bottle",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Garlic_Softgel.html",
      source: "mic",
    },
    {
      supplier: "Hebei Songhekang Biotechnology Co., Ltd — garlic oil softgels",
      region: "Hebei, CN",
      moq: "100,000 capsules",
      unitCost: "$0.02–0.07 / capsule",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Garlic_Softgel.html",
      source: "mic",
    },
    {
      supplier: "Freight, duty and inbound",
      region: "CN → US",
      moq: "—",
      unitCost: "not quoted",
      leadTime: "—",
      source: INVENTED,
    },
  ],

  /* 🚧 Those quotes, totalled — which this page was built not to do. It is
     here on instruction. Three of the four lines are somebody's published
     rate or quote and the fourth is computed from category benchmarks, so
     every figure the block produces renders a "≈" rather than a number, and
     the text under it says in words that the real page shows nothing here
     until a seller connects. */
  economics: {
    lines: [
      {
        label: "Cost of goods",
        pct: 8,
        note: "≈$3.00 a bottle against a $39.57 average selling price, from the published quotes above. FOB China: freight, duty and inbound are NOT in it, and nobody quoted those for us.",
        source: "mic",
      },
      {
        label: "Amazon referral fee",
        pct: 15,
        note: "Amazon's published rate for Beauty, Health and Personal Care above $10. Every ASIN here is above $10.",
        source: "amazon-fees",
      },
      {
        label: "FBA fulfilment",
        pct: 9,
        note: "≈$3.60 on a small-standard 6–10 oz unit in the $10–50 price band, from the 2026 rate card. The exact fee depends on each ASIN's measured dimensions, which we do not have.",
        source: "fba-rates",
      },
      {
        label: "Advertising",
        key: "ads",
        pct: 8,
        note: "TACOS, computed rather than guessed: a $1.10–1.40 category click at an 11–14% conversion rate costs $7.86–12.73 per ad-attributed sale, and carrying 20–40% of 143,000 units that way is 5–10% of revenue. The advertising tab shows the arithmetic.",
        source: MODELLED,
      },
      /* 🚨 RETURNS AND OVERHEAD ARE DELIBERATELY ABSENT, on instruction: the
         call was that returns are negligible here and overhead is a later
         problem. That is why the total below is a CONTRIBUTION margin and a
         ceiling on profit, and why the page never calls it net. */
    ],
    basis:
      "Three lines are published and cited: the supplier quotes, Amazon's referral rate and Amazon's FBA rate card. The fourth — advertising — is computed from category CPC and conversion benchmarks, so a reader can redo it. Returns and overhead are set to zero on purpose, which makes the total a contribution margin rather than a profit, and a ceiling on the real number. It also covers the AMAZON channel only: the subscription store on the traffic tab has a different cost structure entirely, starting with paid traffic instead of a referral fee.",
    source: MODELLED,
  },

  /* The Meta ad library LINK is real and anyone can open it — and for this
     brand it is more interesting than usual, because the ads are not running
     under the brand's name. So is the ad COUNT beside it. What nobody
     publishes is spend: the library carries creative and run dates and never
     money, and no public source reports Amazon ad spend at all — so every
     dollar figure here is computed from published category click prices and
     conversion rates, and carries a "≈". */
  advertising: [
    {
      channel: "Amazon Sponsored Products",
      spend: "≈ $286K–572K / mo",
      note:
        "The arithmetic: a $1.10–1.40 Health & Household click at an 11–14% conversion rate is $7.86–12.73 per ad-attributed sale — 20–32% ACoS on a $39.57 order. Carry 20–40% of 143,000 units that way and the spend lands here, at 5–10% TACOS. What we cannot do is COUNT it: Amazon localises search results to the viewer, and from outside the US the sponsored slots on their head terms are not visible.",
      source: MODELLED,
    },
    {
      channel: "Meta (Facebook + Instagram)",
      spend: "≈ $1.65M–5.0M / mo",
      note:
        "Similarweb puts resilia.shop at ~3.3M visits a month and Ubersuggest says 2,120 of them come from search, so almost all of it is bought. At a $0.50–1.50 health-and-wellness click — the published $20.70 CPM at a 2.70% CTR is $0.77 — that traffic costs this much. If it is right, this one channel is bigger than the entire Amazon business at the top of this page.",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=resilia&search_type=keyword_unordered&media_type=all",
      /* The library is real and cited on the NAME; the spend is computed and
         cited on the FIGURE. See the note on AdChannel. */
      linkSource: "meta-ads",
      activity: "~6,900 active US ads mention Resilia",
      activitySource: "meta-ads",
      source: MODELLED,
    },
    {
      channel: "Google Ads (search + shopping)",
      spend: "≈ $3K in its peak month",
      note:
        "780 paid visits in May 2026 at the $2.97–4.99 cost-per-click Ubersuggest reports for their own brand terms. By August the paid series reads zero — a campaign that ran and stopped, and a rounding error beside the other two rows.",
      activity: "17 paid keywords at peak (May 2026), 0 in Aug 2026",
      activitySource: "ubersuggest",
      source: MODELLED,
    },
    {
      channel: "Blended",
      spend: "≈ $1.9M–5.6M / mo",
      note:
        "Stated against Amazon revenue this would read as 34–99%, and it should not be: most of it is buying DTC subscriptions this page cannot size. Two channels, one of them much larger, and only one of them visible in the figures at the top.",
      source: MODELLED,
    },
  ],

  /* REAL, from Ubersuggest on 2026-09-08: their actual Google positions and
     that tool's volume estimates. Brand terms only — they rank for their own
     name and almost nothing else, which is the finding. "oil of oregano" runs
     135,000 searches a month in the US and resilia.shop is nowhere on it. */
  keywords: [
    { term: "resilia oil of oregano with black seed oil", engine: "Google", rank: "#29", volume: "8,100 / mo", source: "ubersuggest" },
    { term: "resilia aged garlic", engine: "Google", rank: "#28", volume: "2,900 / mo", source: "ubersuggest" },
    { term: "resilia shop", engine: "Google", rank: "#3", volume: "1,300 / mo", source: "ubersuggest" },
    { term: "resilia oregano oil", engine: "Google", rank: "#15", volume: "1,000 / mo", source: "ubersuggest" },
    { term: "resilia supplement", engine: "Google", rank: "#4", volume: "880 / mo", source: "ubersuggest" },
    { term: "resilia oil of oregano softgels", engine: "Google", rank: "#13", volume: "720 / mo", source: "ubersuggest" },
    { term: "resilia cancel subscription", engine: "Google", rank: "#7", volume: "140 / mo", source: "ubersuggest" },
    { term: "is resilia shop legit", engine: "Google", rank: "#14", volume: "110 / mo", source: "ubersuggest" },
  ],

  /* REAL, read off the listings on 2026-09-08. Two products are #1 in their
     subcategory ten months after launch, which is the single most useful
     Amazon number on this page — and the long tail shows what the same
     operator's line extensions do without the same push behind them. */
  bestsellers: [
    {
      label: "Oil Of Oregano Softgels with Black Seed Oil",
      rank: "#75 in Health & Household",
      note: "#1 in Oregano Herbal Supplements · 4.4★ over 3,154 ratings. The 120 and 180 counts share this parent listing.",
      source: "bsr",
    },
    {
      label: "Odorless Aged Garlic Extract Softgels",
      rank: "#95 in Health & Household",
      note: "#1 in Garlic Herbal Supplements · 4.4★ over 2,871 ratings, five months after the line launched.",
      source: "bsr",
    },
    {
      label: "Ethiopian Black Seed Softgels 1000mg",
      rank: "#6,189 in Health & Household",
      note: "#7 in Black Seed Oil Nutritional Supplements · 4.5★ over 208 ratings.",
      source: "bsr",
    },
    {
      label: "D3 K2 Vitamin 10000 IU",
      rank: "#17,070 in Health & Household",
      note: "No subcategory rank at all · 4.4★ over 85 ratings. A line extension that did not take.",
      source: "bsr",
    },
    {
      label: "Milk Thistle Silymarin 300mg",
      rank: "#43,174 in Health & Household",
      note: "#140 in Milk Thistle Herbal Supplements · 4.4★ over 47 ratings. The catalogue's quietest product.",
      source: "bsr",
    },
  ],

  gaps: [
    "This business's actual COGS, and its returns and overhead. The sourcing tab carries real published quotes for a comparable softgel, and Amazon's referral and FBA rates are its own — but a category price is not a cost sheet and freight and duty are in none of the quotes. Returns and overhead are set to ZERO on purpose, so the margin here is a contribution margin and a ceiling: the real number is lower by whatever those two cost.",
    "How big the DTC side is. Similarweb counts visits, not orders, and resilia.shop sells subscriptions — so the $5.66M above is the AMAZON business only, and the whole company is larger by an amount nothing public will tell you.",
    "Ad spend, as a measurement. Both dollar figures are MODELLED from published category CPCs and conversion rates, and the formula is on the advertising tab — but a model is not a reading. The one thing that would replace it is their own Amazon Ads and Meta invoices.",
    "Which advertiser pages this business controls. The ads for its garlic line run under \"Everyday Wellness Review\", \"Vascular Wellness Report\", \"Circulatory Health Report\" and others, so the ~6,900 figure cannot be totalled to the brand without someone establishing the link. One page is called simply Resilia.",
    "Amazon keyword rank and search volume. Amazon publishes no volumes, and it localises search results to the viewer — this machine is on an Israeli IP, so the US result set is not visible to it. Best-seller rank is on the page instead, and a US-located run or a Helium 10 / Brand Analytics account is what would fill the gap.",
    "The 12 unbadged ASINs. Each sells under roughly 50/month, but Amazon publishes no figure, so they are counted as zero rather than estimated.",
    "Amazon also carries a near-identical \"RESILLA\" brand in the same category, and products listed under a bare \"Resilia\". A brand split across several strings is under-counted by exactly the ASINs nobody queried, and no error is raised — the number simply comes back smaller.",
    "Whether resilia.us and resiliasupps.com belong to this business. One is registered to a private individual in another state, the other through a brand-protection registrar; neither resolves. Affiliate, defensive, or unrelated — unresolved.",
    "Three geographies on one business: a California registered address, a Connecticut phone, and a Miami address with Florida governing law in the store's terms. Each is ordinary alone. Nothing public reconciles them, and this page does not theorise.",
    "Why the feedback score is 82% over 4,572 ratings. The number is public; the cause is not, and on a catalogue ten months old it accumulated fast.",
  ],

  sources: [
    {
      id: "keepa",
      label: "Keepa Product API",
      href: "https://keepa.com/#!api",
      read: "2026-09-07",
      detail:
        "Whole-catalogue pull on the brand string \"Resilia Oil Of Oregano\": 32 ASINs, their monthlySold badge, buy box price and first-listed date. Revenue and units are computed from these, never reported by anyone.",
    },
    {
      id: "keepa-seller",
      label: "Keepa Seller API",
      href: "https://keepa.com/#!api",
      read: "2026-09-07",
      detail:
        "The operating business behind the brand: legal name, registered address, country, phone and feedback score, resolved from the buy-box seller on the brand's top ASINs.",
    },
    {
      id: "own-store",
      label: "resilia.shop — the brand's own store",
      href: "https://resilia.shop/",
      read: "2026-09-07",
      detail:
        "The live Shopify store: products, subscription pricing, the support phone number on its contact page, and the terms of sale naming \"Sack Consulting Inc. d/b/a Resilia\" with an 8255 NW 66th Street, Miami FL address and Florida governing law.",
    },
    {
      id: "wayback",
      label: "Wayback Machine — resilia.shop",
      href: "https://web.archive.org/web/20240831144406/https://resilia.shop/",
      read: "2026-09-07",
      detail:
        "The 2024-08-31 capture, showing the store already selling \"Oregano Oil with Black Seed Oil\" softgels fifteen months before the first Amazon listing. This is the fact that overturns the Amazon-native reading.",
    },
    {
      id: "whois",
      label: "Domain registration records (whois) and live DNS",
      href: "https://lookup.icann.org/",
      read: "2026-09-07",
      detail:
        "Creation dates and registrants for resilia.shop's neighbours — shopresilia.com (2024-12-18, now redirecting), resiliasupps.com (2026-03-08) and resilia.us (2026-05-29) — plus a DNS check showing the last two do not resolve. Registrant names are published by the registries; the private individual behind one of them is deliberately not named here.",
    },
    {
      id: "similarweb",
      label: "Similarweb — resilia.shop",
      href: "https://www.similarweb.com/website/resilia.shop/",
      read: "2026-09-07",
      detail:
        "9.9M visits over three months to August 2026, +52.92% month on month, global rank #6,723. Similarweb is itself an estimate from panel and clickstream data, not a server-side count, and visits are not orders.",
    },
    {
      id: "meta-ads",
      label: "Meta Ad Library — keyword search \"resilia\"",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=resilia&search_type=keyword_unordered&media_type=all",
      read: "2026-09-07",
      detail:
        "Meta publishes every ad a page runs, with its creative and run dates. This is a KEYWORD search, so it also returns other advertisers: what it shows is that ads for Resilia Aged Garlic Extract were live from 2026-08-03 under pages named \"Everyday Wellness Review\" and \"Vascular Wellness Report\". It does NOT publish spend, so the ad COUNT is what this source is answerable for; the dollar figures beside it are computed from published category click prices and conversion rates.",
    },
    {
      id: "uspto",
      label: "USPTO trademark record — RESILIA, serial 99402158",
      href: "https://www.trademarkia.com/resilia-99402158",
      read: "2026-09-07",
      detail:
        "Filed 2025-09-19 by Sack Consulting Inc., Rolling Hills Estates, CA, for dietary and nutritional supplements. Read through search-result summaries of the USPTO mirrors: both uspto.report and trademarkia refused our fetcher with a 403, so this is the one real source here nobody on our side opened directly. Anyone rechecking it should open the record itself.",
    },
    {
      id: "instagram",
      label: "Instagram — @resilia",
      href: "https://www.instagram.com/resilia/",
      read: "2026-09-08",
      detail:
        "32K followers over 274 posts, read off the public profile: \"RESILIA | Oil of Oregano • Blackseed • Aged Garlic Supplements\". A second handle, @shopresilia, also carries the name; it would not load for us, so it is not cited here.",
    },
    {
      id: "bsr",
      label: "The listings themselves — best-seller rank and reviews",
      href: "https://www.amazon.com/dp/B0G6B59FT5",
      read: "2026-09-08",
      detail:
        "Best-seller rank, subcategory rank, star rating and review count, read off each product page. BSR is printed on the listing and is the same number for every viewer, unlike Amazon search results, which are localised — from outside the US we cannot see the US result set, so keyword positions on Amazon are missing from this page rather than guessed.",
    },
    {
      id: "ubersuggest",
      label: "Ubersuggest — resilia.shop",
      href: "https://neilpatel.com/ubersuggest/",
      read: "2026-09-08",
      detail:
        "Google positions, search volumes and the site's organic and paid traffic history: 518 ranking keywords, ~2,120 organic visits in August 2026, and a paid-search burst peaking at 17 keywords in May 2026. Ubersuggest is a model built from rank data and clickstream, not a server-side count — an estimate, but somebody else's, made the same way for every domain.",
    },
    {
      id: "mic",
      label: "Made-in-China — supplier listings",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Oregano_Oil_Softgel.html",
      read: "2026-09-08",
      detail:
        "Published price ranges and minimum orders from named suppliers for oregano and aged-garlic softgels. These price the CATEGORY, not this business: nobody here has seen Resilia's cost sheet, and the quotes are FOB China with no freight or duty in them.",
    },
    {
      id: "amazon-fees",
      label: "Amazon — published selling fees",
      href: "https://sell.amazon.com/pricing",
      read: "2026-09-08",
      detail:
        "Amazon's own referral-fee schedule: 8% for Beauty, Health and Personal Care items at $10 or less and 15% above it, with a $0.30 minimum. First-party and not modelled.",
    },
    {
      id: "fba-rates",
      label: "FBA fulfilment rate card, 2026",
      href: "https://warehousingcosts.com/guides/amazon-fba-fulfillment-fees",
      read: "2026-09-08",
      detail:
        "The US FBA fee table effective 15 January 2026 with the 17 April fuel and logistics surcharge: small standard 6–10 oz in the $10–50 band is $3.54–3.68 a unit. Amazon's own copy of this table sits behind Seller Central, so this is a published mirror of it rather than the first-party page.",
    },
    {
      id: "trellis",
      label: "Trellis — Amazon advertising benchmarks by category, 2026",
      href: "https://gotrellis.com/resources/blog/amazon-advertising-benchmarks",
      read: "2026-09-08",
      detail:
        "Aggregated platform data published March 2026: Health & Household runs a $1.10–1.40 cost-per-click at a 0.40–0.55% click-through and an 11–14% conversion rate. A benchmark for the CATEGORY, not a reading of this advertiser — which is exactly what a model needs and exactly what it cannot substitute for.",
    },
    {
      id: "meta-bench",
      label: "Meta advertising benchmarks — health and wellness, 2026",
      href: "https://adlibrary.com/posts/meta-ad-benchmarks-ecommerce-2026",
      read: "2026-09-08",
      detail:
        "Health and wellness carries the highest CPM on Meta at $20.70 against a 2.70% click-through — $0.77 a click — with ecommerce CPCs published in a $0.50–1.80 band. Again a category benchmark, and the input that turns Similarweb's visit count into a spend estimate.",
    },
    {
      /* 🚨 The third rung: computed by us, from the numbered entries above.
         Renders "≈" rather than a number so it can never be read as somebody
         else's measurement, and never as a fabrication either. */
      id: MODELLED,
      label: "Modelled by us — the arithmetic, and what feeds it",
      detail:
        "Marked with ≈. Three figures on this page are computed rather than read: (1) Amazon ad spend = units × ad share ÷ conversion rate × cost-per-click, using Keepa's unit floors and Trellis's category CPC and conversion benchmarks, with the 20–40% ad share the one assumption we supply; (2) Meta ad spend = Similarweb's visits × the published health-and-wellness cost-per-click; (3) the contribution margin and the line on the overview chart = revenue less the supplier quotes, Amazon's published referral rate, Amazon's published FBA fee and that modelled ad spend — with returns and overhead deliberately set to zero, which makes it a ceiling rather than a profit. Every input is one of the numbered sources above, so a reader who disagrees with the answer can find the number they disagree with.",
    },
    {
      /* 🚨 The entry every invented figure points at, and deliberately LAST.
         It renders as "*" rather than a number, so putting it first cost the
         real sources their first index — the list began at 2 and a reader was
         left hunting for a source 1 that did not exist. */
      id: INVENTED,
      label: "Invented for this demo — nobody measured this",
      detail:
        "Marked with * wherever it appears, and it is down to ONE thing: the freight and duty row on the sourcing tab, which no supplier quoted and we did not model. Everything else on this page carries a number (somebody published it) or a ≈ (we computed it from those). This entry stays because the moment something else is fabricated, it needs somewhere to point.",
    },
  ],

  copy: {
    profitChart:
      "Hover a dot for what happened there. Two steps carry the whole line: December 2025, when the oregano line went wide, and 4 May 2026, when six aged-garlic SKUs shipped in one day.",
    timelineLede:
      "The strands are kept together on one line because the web track is the one that changes the story: a Shopify store selling this product in August 2024, a trademark ten weeks before the launch, and only then the Amazon catalogue — which reaches a $68M run rate faster than the store it came from took to get a second domain.",
    salesLede:
      "Two lines carry the business: oregano-with-black-seed, and the aged garlic that overtook it eight weeks after launching. These are the 15 largest of 21 priced products and they sum to $5.61M, so the bars fall a little short of the $5.66M headline — the remaining six are worth about $44,000 a month between them.",
    advertisingLede:
      "Two things here are counted rather than modelled: Meta's ad library returns ~6,900 active US ads mentioning Resilia, and Ubersuggest catches a Google Ads burst peaking at 17 keywords in May 2026. The library is worth opening, because the ads for the biggest line do not run under this brand's name — they run under pages called \"Everyday Wellness Review\" and \"Vascular Wellness Report\". Neither source publishes money, and Amazon publishes nothing at all, so the dollar column is arithmetic of ours: published category click prices and conversion rates against those counts, with the formula in Sources.",
    trafficLede:
      "For this business it is the larger half. resilia.shop is a subscription store selling the same three lines, live since at least August 2024, and Similarweb reads it at 9.9M visits over three months. Ubersuggest reads 2,120 of those as organic search — so effectively none of it is earned traffic. They rank for their own name and nothing else: \"oil of oregano\" runs 135,000 US searches a month and resilia.shop is nowhere on it.",
  },
};
