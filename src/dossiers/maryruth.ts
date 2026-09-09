/**
 * MaryRuth's (MaryRuth Organics) — a sourced dossier.
 *
 * Built entirely from public data by the VM-amazon-store-scraping skill
 * (Dragon-marketing/skills/VM-amazon-store-scraping) on 2026-09-09. Nobody at
 * this business has spoken to us.
 *
 * 🚨 PUBLISHED FOR REAL, at /brand/maryruth — not a demo. Indexable, no demo
 * banner, findable in search by the business it is about. Everything that
 * makes it defensible has to hold in public: the Estimated badge, a marker on
 * every figure, and a bibliography that names each source.
 *
 * ── Why this one is the outlier of the set ────────────────────────────────
 * $16.4M a month against the other dossiers' $90K, $1.58M and $5.66M — and
 * the first one where the Amazon number is not the business. This brand is in
 * 22,780 physical doors across 323 retailer banners, by its own store
 * locator's API. Amazon is one channel of a genuinely omnichannel company,
 * and a page that led with "$196M a year" would be describing a listing
 * rather than a business.
 *
 * ── Two things that make the headline figure softer than it looks ─────────
 *   1. 617 listings carry this brand's name; the brand's own storefront holds
 *      268 of them. One kids' multivitamin listing carries 298 offers.
 *      monthlySold counts what the LISTING sold, and nothing public splits it
 *      between the brand and the resellers on the same page.
 *   2. The badge is bracketed. At this size a single ASIN stepping from
 *      20,000 to 40,000 moves the monthly total by half a million dollars, so
 *      the month-to-month wobble in the chart is partly Amazon's rounding and
 *      not the business.
 *
 * ── The finding that reverses the pattern ─────────────────────────────────
 * Every other dossier here is a DTC brand that arrived on Amazon later. This
 * one is the opposite: the first ASIN went up 2014-09-07 and the domain was
 * registered 2014-12-31. Amazon came FIRST, by four months.
 */
import { INVENTED, MODELLED, type Dossier } from "@/demo/dossier";

export const maryruth: Dossier = {
  brand: "MaryRuth's",
  what: "Amazon FBA · liquid vitamins, gummies and liposomals",
  logo: "/demo/maryruth-logo.png",
  /* 900x338 wordmark, from the brand's own Shopify header. Wide, so it keeps
     the shared height-sized treatment. Their mark is red; the Estimated badge
     beside it is also red, because red is this site's unverified rung — the
     collision is theirs, not a signal. */
  logoShape: "wide",

  headline: {
    revenue: "$16.4M",
    units: "658,850",
    asp: "$24.87",
    catalogue: "617 ASINs",
  },

  deepDive:
    "MaryRuth's sells liquid vitamins — a morning multivitamin you drink rather than swallow — plus " +
    "gummies, liposomals and probiotic drops, across 617 Amazon listings. Sum the badge against the " +
    "buy box and it is $16.4M a month, $196.7M a year, at a $24.87 average order. That is the " +
    "largest business profiled here by an order of magnitude, and it is the first one where the " +
    "Amazon figure is not the point. " +
    "The brand's own store locator publishes its retail footprint through an open API, and it " +
    "returns 22,780 US locations across 323 retailer banners: 6,750 CVS stores, 4,581 Walmarts, " +
    "2,019 Targets, 1,511 Ultas, 427 Whole Foods. We confirmed live product pages at Walmart, " +
    "Target and Whole Foods independently. So Amazon is one channel of an omnichannel company, and " +
    "the honest reading of $196M a year is that it is what one channel's listings turned over, not " +
    "what the company did. " +
    "Two things make even that softer than it looks. Their own storefront holds 268 of the 617 " +
    "listings carrying the name, and one kids' multivitamin listing carries 298 competing offers — " +
    "so the badge counts what the LISTING sold and nothing public splits that between the brand and " +
    "the resellers sitting on the same page. And the badge is bracketed: at this volume one ASIN " +
    "stepping from 20,000 to 40,000 moves the month by half a million dollars, which is most of " +
    "what the chart's wobble is. " +
    "This is also the first dossier here with an INDEPENDENT number to check itself against. Forbes " +
    "put the company at roughly $600M of trailing revenue and $125M of EBITDA in August 2026, which " +
    "makes Amazon about a third of it — one estimate divided by another, both unaudited, but the " +
    "first time this method has had anything to be wrong against. " +
    "It is also the first brand here with a public record, and it is a mixed one. The FDA classified " +
    "a 2021 recall of their infants' probiotic as Class I, its most serious tier, over 25,673 units; " +
    "it was terminated in February 2022, and the company's own notice is headed \"out of an " +
    "abundance of caution\". Against that: no FDA warning letter across nine years of the agency's " +
    "own published set, no Prop 65 notice, and no product class action that survived. Consumer " +
    "Reports found them among the few brands disclosing lot-level heavy-metal results at all — and " +
    "found their highest disclosed lead figure the highest of those reviewed, which is a finding " +
    "about disclosure before it is one about lead. The live thread is neither safety nor efficacy " +
    "but subscription billing: an F at the BBB for not answering complaints, 2.6 on Trustpilot " +
    "against 4.5 across 39,143 Amazon ratings, and two plaintiffs' firms advertising for claimants. " +
    "The pattern the other dossiers established is reversed here. Every one of them is a DTC brand " +
    "that came to Amazon late; this one listed its first ASIN on 2014-09-07 and registered its " +
    "domain on 2014-12-31. Amazon came first, by four months, and eleven years later the site does " +
    "about 250,000 visits a month against 18,032 ranking keywords — of which the top six by volume " +
    "are the brand's own name. Demand here is people looking for MaryRuth's, not for a liquid " +
    "multivitamin. " +
    "The seller record is the other thing worth noticing. 99% over 36,747 ratings, 345 of them in " +
    "the last thirty days, is not a number a small operation posts — and it is the sharpest contrast " +
    "on this site with the 72%, 82% and 86% of the three brands a tenth to a hundredth of its size. " +
    "The founder's own account of how this started is worth reading beside it: a Manhattan " +
    "nutrition practice whose clients could not keep capsules down, a liquid multivitamin made for " +
    "them, bottles sold off a bookshelf, and — in her words — \"I just happened to start putting " +
    "them on Amazon.\" The listing dates agree with her.",

  operator: {
    businessName: "MRO MaryRuth, LLC",
    sellerName: "MaryRuth Organics, LLC",
    sellerId: "A3V1QNHQ2M2TBN",
    address: ["1171 S Robertson #148", "Los Angeles", "CA", "90035"],
    country: "US",
    storefrontUrl: "https://www.amazon.com/sp?seller=A3V1QNHQ2M2TBN",
    since: {
      value: "2014-09-07",
      note:
        "the first ASIN — four months BEFORE the domain was registered. Every other brand profiled here came to Amazon after building somewhere else",
      source: "keepa",
    },
    feedback: "99% over 36,747 ratings",
    feedbackNote:
      "the best on this site by a distance, and 345 of those ratings landed in the last thirty days",
    source: "keepa-seller",
  },

  figures: [
    {
      label: "Monthly revenue",
      value: "$16.4M",
      note: "floor — 421 of 617 listings carry no badge and count as zero",
      source: "keepa",
      flag: true,
    },
    { label: "Annualised", value: "$196.7M", note: "run rate on one channel, not booked, not the company", source: "keepa", flag: true },
    { label: "Units / month", value: "658,850", note: "sum of bracket floors", source: "keepa" },
    { label: "Average selling price", value: "$24.87", source: "keepa" },
    {
      label: "Catalogue",
      value: "617 ASINs",
      note: "253 priced, 209 badged, 196 earning anything",
      source: "keepa",
    },
    /* 🚨 The pair that makes the headline figure a listing figure rather than
       a business figure. Both read off Amazon, neither modelled. */
    {
      label: "In their own storefront",
      value: "268 of 617",
      note: "the rest carry the brand name and are somebody else's listing",
      source: "keepa-seller",
      flag: true,
    },
    {
      label: "Offers on one listing",
      value: "298",
      note: "the kids' multivitamin. 177 on the morning multi, 38 on the hair-growth SKU",
      source: "keepa-offers",
      flag: true,
    },
    /* 🚨 THE FIGURE THIS WHOLE PAGE IS MEASURED AGAINST. Every other dossier
       here has no independent number to check our arithmetic with; this one
       does, and it says our $196.7M is about a third of the company. */
    {
      label: "Company revenue, per Forbes",
      value: "≈$600M",
      note: "trailing twelve months, Aug 2026 — against the $196.7M of Amazon run rate above",
      source: "forbes",
      flag: true,
    },
    {
      label: "Amazon's share of that",
      value: "≈33%",
      note: "our figure over theirs. Both are estimates, by different methods, and neither is the company's own",
      source: MODELLED,
    },
    { label: "EBITDA, per Forbes", value: "≈$125M", note: "≈20% margins; the company first topped $100M in 2025", source: "forbes" },
    { label: "Debt raised", value: "$420M", note: "Capital One, closed Oct 2025, due 2030 — leaving the founder ~97%", source: "forbes" },
    { label: "TikTok followers", value: "624,900", note: "1,691 videos, 2.4M likes; account created 2021-01-21", source: "tiktok" },
    {
      label: "Founder's Instagram",
      value: "733K",
      note: "against the BRAND account's 28K — the founder is 26x the brand",
      source: "instagram",
      flag: true,
    },
    { label: "Retail doors", value: "22,780", note: "323 retailer banners, from their own store locator's API", source: "store-locator" },
    { label: "Own-site visits", value: "~250K / mo", note: "Similarweb's 750.8K is a THREE-month total, +6.6% MoM", source: "similarweb", flag: true },
    { label: "of which organic search", value: "230,773 / mo", note: "Ubersuggest, Aug 2026, on 18,032 ranking keywords", source: "ubersuggest" },
    { label: "Live Meta ads", value: "~390", note: "page-scoped count on their own advertiser page", source: "meta-ads" },
    { label: "Revenue concentration", value: "top 20 = 50%", note: "top 50 is 73%, top 100 is 91.5%", source: "keepa" },
  ],

  /* The whole catalogue, because `asins` below lists only the largest 15 of
     253 priced listings — see the note on revenueCents. */
  revenueCents: 1638796900,
  counts: { catalogue: 617, priced: 253, unbadged: 408 },
  firstListed: "2014-09-07",

  /* REAL, from Keepa's monthlySoldHistory on 2026-09-09 — the badge as it
     moved, read at each month end and priced at today's buy box. Across the
     TOP 100 ASINs, which are 91.5% of catalogue revenue; the tail is not in
     the line. Three years of it, which is as far back as Keepa recorded the
     badge for these listings. */
  salesHistory: [
    { month: "2023-08", units: 237600, revenueCents: 573197000 },
    { month: "2023-09", units: 240100, revenueCents: 577145900 },
    { month: "2023-10", units: 331900, revenueCents: 833057800 },
    { month: "2023-11", units: 359200, revenueCents: 926234200 },
    { month: "2023-12", units: 247350, revenueCents: 612367550 },
    { month: "2024-01", units: 437050, revenueCents: 1229057450 },
    { month: "2024-02", units: 337250, revenueCents: 910936450 },
    { month: "2024-03", units: 400099, revenueCents: 1075569105 },
    { month: "2024-04", units: 319849, revenueCents: 852083314 },
    { month: "2024-05", units: 347799, revenueCents: 902070205 },
    { month: "2024-06", units: 292900, revenueCents: 760410800 },
    { month: "2024-07", units: 497200, revenueCents: 1307720000 },
    { month: "2024-08", units: 316799, revenueCents: 829393405 },
    { month: "2024-09", units: 345699, revenueCents: 900193805 },
    { month: "2024-10", units: 503399, revenueCents: 1399971305 },
    { month: "2024-11", units: 464299, revenueCents: 1248334905 },
    { month: "2024-12", units: 373900, revenueCents: 989194300 },
    { month: "2025-01", units: 509700, revenueCents: 1374063500 },
    { month: "2025-02", units: 540800, revenueCents: 1445263000 },
    { month: "2025-03", units: 549000, revenueCents: 1484562000 },
    { month: "2025-04", units: 414400, revenueCents: 1102424000 },
    { month: "2025-05", units: 477100, revenueCents: 1294570500 },
    { month: "2025-06", units: 437000, revenueCents: 1133055400 },
    { month: "2025-07", units: 577400, revenueCents: 1577941000 },
    { month: "2025-08", units: 467700, revenueCents: 1207156500 },
    { month: "2025-09", units: 494000, revenueCents: 1307888000 },
    { month: "2025-10", units: 602599, revenueCents: 1591500805 },
    { month: "2025-11", units: 693100, revenueCents: 1802479500 },
    { month: "2025-12", units: 446249, revenueCents: 1107915705 },
    { month: "2026-01", units: 578599, revenueCents: 1493113505 },
    { month: "2026-02", units: 486849, revenueCents: 1287337255 },
    { month: "2026-03", units: 563400, revenueCents: 1437505000 },
    { month: "2026-04", units: 426100, revenueCents: 1111173500 },
    { month: "2026-05", units: 322100, revenueCents: 842279600 },
    { month: "2026-06", units: 556999, revenueCents: 1458500505 },
    { month: "2026-07", units: 409600, revenueCents: 1024165100 },
    { month: "2026-08", units: 581000, revenueCents: 1442814000 },
    { month: "2026-09", units: 597800, revenueCents: 1503307000 },
  ],

  /* The 15 largest of 253 priced listings, best-selling first. They sum to
     $7.08M against the $16.4M headline — 43% of it — because unlike the
     smaller dossiers here the tail is real: 196 listings earn something and
     the top 20 are only half the revenue. */
  asins: [
    { asin: "B0CWS5QP8F", title: "Liquid Multivitamin + Hair Growth", monthlySold: 40000, priceCents: 2688, listed: "2023-08-25" },
    { asin: "B0CGKVHHCY", title: "Liquid Multivitamin + Hair Growth, larger size", monthlySold: 20000, priceCents: 5039, listed: "2023-08-25" },
    { asin: "B0CNDDQ4WR", title: "Hair Growth Max Liposomal 10,000mcg Biotin", monthlySold: 10000, priceCents: 5456, listed: "2023-11-15" },
    { asin: "B00MDRTV8A", title: "Liquid Morning Multivitamin — the original, 2014", monthlySold: 20000, priceCents: 2677, listed: "2014-09-14" },
    { asin: "B0DQLVWK6L", title: "Liquid Multivitamin + Hair Growth", monthlySold: 10000, priceCents: 5022, listed: "2024-12-16" },
    { asin: "B084QD29LR", title: "Organic Lymphatic Support Liquid Drops", monthlySold: 30000, priceCents: 1515, listed: "2020-02-11" },
    { asin: "B07WMX9N2D", title: "Kids Multivitamin Gummies, sugar free", monthlySold: 30000, priceCents: 1446, listed: "2019-08-15" },
    { asin: "B0DKQLNXN3", title: "Multivitamin + Hair Growth Gummies", monthlySold: 6000, priceCents: 6995, listed: "2024-10-23" },
    { asin: "B0DQR8ZY1K", title: "Liquid Multivitamin + Hair Growth", monthlySold: 10000, priceCents: 3995, listed: "2024-12-19" },
    { asin: "B0F3LB24T4", title: "Daily Liquid Hair Formula", monthlySold: 10000, priceCents: 3495, listed: "2025-07-17" },
    { asin: "B07YM21GR5", title: "Liquid Iron Supplement", monthlySold: 10000, priceCents: 2949, listed: "2019-10-01" },
    { asin: "B0BGMGWP14", title: "USDA Organic Multivitamin Gummies, ages 4+", monthlySold: 20000, priceCents: 1447, listed: "2022-09-27" },
    { asin: "B0CZ4GCPXT", title: "USDA Organic Prenatal & Postnatal Gummies", monthlySold: 9000, priceCents: 2995, listed: "2024-03-26" },
    { asin: "B0DQM2SSR2", title: "Kids Liquid Morning Multivitamin", monthlySold: 10000, priceCents: 2499, listed: "2024-12-16" },
    { asin: "B0BGMK8WK8", title: "USDA Organic Kids Multivitamin + Postbiotics", monthlySold: 10000, priceCents: 2495, listed: "2022-09-27" },
  ],

  links: [
    {
      platform: "amazon",
      label: "Amazon store",
      href: "https://www.amazon.com/stores/MaryRuthOrganics/page/6CAB35B7-7CB0-4527-815D-8DCE02AC1016",
      metric: "617 ASINs",
      source: "keepa",
    },
    {
      platform: "website",
      label: "maryruthorganics.com",
      href: "https://www.maryruthorganics.com/",
      metric: "~250K visits / mo",
      source: "similarweb",
    },
    {
      platform: "tiktok",
      label: "@maryruthorganics",
      href: "https://www.tiktok.com/@maryruthorganics",
      metric: "624.9K followers · 2.4M likes",
      source: "tiktok",
    },
    {
      platform: "instagram",
      label: "@maryruthghiyam",
      href: "https://www.instagram.com/maryruthghiyam/",
      metric: "733K followers",
      source: "instagram",
    },
    {
      platform: "facebook",
      label: "MaryRuth Organics",
      href: "https://www.facebook.com/maryruthorganics/",
      metric: "264K likes",
      source: "facebook",
    },
  ],

  offAmazon: [
    {
      label: "Founder's Instagram — @maryruthghiyam",
      href: "https://www.instagram.com/maryruthghiyam/",
      value: "733K followers · 750 posts",
      note:
        "🚨 26x the brand's own Instagram, which has 28K followers and 156 posts. On this business the founder IS the channel — she has her own Meta advertiser page, and creator handles run branded content paired with her name rather than with the brand's.",
      source: "instagram",
    },
    {
      label: "TikTok — @maryruthorganics",
      href: "https://www.tiktok.com/@maryruthorganics",
      value: "624.9K followers · 2.4M likes",
      note:
        "1,691 videos, and the account was created 2021-01-21 — measured twice, from TikTok's own createTime and from the timestamp encoded in the user id, which agree to within 106 seconds. This is the brand's real owned channel.",
      source: "tiktok",
    },
    {
      label: "Facebook — MaryRuth Organics",
      href: "https://www.facebook.com/maryruthorganics/",
      value: "264,031 likes",
      note:
        "6,874 \"talking about this\", and the page that runs their ~390 live ads. Its transparency panel claims a creation date of 2004, three years before Facebook Pages existed — a merged-page artifact rather than a date.",
      source: "facebook",
    },
    {
      label: "YouTube and the dormant channels",
      href: "https://www.youtube.com/@maryruthorganics",
      value: "8.98K subs · 945 videos",
      note:
        "Joined October 2018. X (@MaryRuths, 9,874 followers) is their oldest asset at July 2013 and last posted in 2025; Pinterest has 4.3k followers and its newest board is from 2021. Two channels being left to idle is a choice, and at this size a visible one.",
      source: "youtube",
    },
    {
      label: "22,780 retail doors — their own store locator",
      href: "https://www.maryruthorganics.com/pages/find-a-store",
      value: "323 retailer banners",
      note:
        "🚨 The finding that reframes everything above it. Their locator's API returns every door: 6,750 CVS, 4,581 Walmart, 2,019 Target, 1,511 Ulta, 1,193 Kroger, 826 Publix, 640 Vitamin Shoppe, 598 Sam's Club, 576 GNC, 497 Sprouts, 427 Whole Foods. Live product pages at Walmart, Target and Whole Foods were confirmed independently. Amazon is one channel here, not the business.",
      source: "store-locator",
    },
    {
      label: "Own store — maryruthorganics.com",
      href: "https://www.maryruthorganics.com/",
      value: "~250K visits / mo",
      note:
        "Shopify, 267 products, median price $24.95, Subscribe & Save at 10% off. The hero Liquid Morning Multivitamin is $42.95 here against $26.77 for the comparable Amazon listing. Similarweb's headline 750.8K is labelled \"Total Visits Last 3 Months\" — the monthly figure is ours, by division.",
      source: "own-store",
    },
    {
      label: "Organic search — 18,032 keywords",
      href: "https://neilpatel.com/ubersuggest/",
      value: "230,773 visits / mo",
      note:
        "Domain authority 40 on 594,768 backlinks from 4,248 domains. But the top six keywords by volume are all the brand's own name — \"mary ruths\" at #1 against 90,500 searches, \"mary ruth hair growth\" at #2 against 74,000. They rank #3 for \"kids vitamins\" too, where a click costs $9.14.",
      source: "ubersuggest",
    },
    {
      label: "Meta ad library — MaryRuth's",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&view_all_page_id=582115538507595&search_type=page&media_type=all",
      value: "~390 active US ads",
      note:
        "A page-scoped count, so it is the authoritative one — a keyword search surfaced only 120 of them. The founder has her own advertiser page (~6 ads), and creator handles run branded-content ads paired with her name. The library shows ACTIVE ads only, so the oldest visible start date is not a campaign start.",
      source: "meta-ads",
    },
  ],

  /* Oldest first. Every dot cites a published record. */
  timeline: [
    {
      date: "2013-03-31",
      title: "A nutrition practice in Manhattan, before there is a product",
      detail:
        "The founder's own account: a private practice seeing 10–12 people a day, whose clients said capsule vitamins made them nauseous. The liquid multivitamin is the answer to that complaint, and she says she sold the first bottles off a bookshelf in the office.",
      track: "brand",
      source: "brand-story",
    },
    {
      date: "2014-09-07",
      title: "First Amazon listing — before the website",
      detail:
        "The pattern every other dossier here follows in reverse: Amazon first, domain second. The Liquid Morning Multivitamin that went up a week later is still a top-five earner eleven years on.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2014-12-31",
      title: "maryruthorganics.com registered",
      detail: "Four months after the first ASIN. First archived capture 2015-06-22.",
      track: "web",
      source: "whois",
    },
    {
      date: "2018-10-02",
      title: "A YouTube channel, and $11M in sales",
      detail:
        "The channel joined in October 2018; Forbes puts that year's revenue at $11M, on the way to $23M in 2019 and $84M through the pandemic.",
      track: "brand",
      source: "youtube",
    },
    {
      date: "2019-08-15",
      title: "Kids Multivitamin Gummies",
      detail:
        "The move from liquids into gummies and into the children's category, which is where the volume and the $9.14 keyword clicks are.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2021-01-21",
      title: "The TikTok account is created",
      detail:
        "19:46 UTC, from TikTok's own createTime and corroborated by the timestamp inside the user id. It now carries 624,900 followers and 1,691 videos — the brand's largest owned channel by a wide margin.",
      track: "brand",
      source: "tiktok",
    },
    {
      date: "2021-08-31",
      title: "Butterfly Equity buys in",
      detail:
        "A private-equity stake, at a reported ~$400M valuation and against 2021 revenue Forbes puts at $135M. Gary Vaynerchuk joins the board the following year.",
      track: "brand",
      source: "kirkland",
    },
    {
      date: "2022-09-27",
      title: "113 listings in one year",
      detail:
        "2022's cohort — organic gummies for women, for kids, with postbiotics. The catalogue stops being a product line and becomes a shelf.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2023-07-31",
      title: "B Corp certified, at a score of 81.6",
      detail:
        "Certified as MRO MaryRuth, LLC against a passing mark of 80 and a median of 50.9 — a third-party audit of how the company operates, which is a different thing from an audit of its numbers.",
      track: "brand",
      source: "bcorp",
    },
    {
      date: "2023-08-25",
      title: "Liquid Multivitamin + Hair Growth",
      detail:
        "The listing that changes the business. It is the single biggest earner today, and \"mary ruth hair growth\" is now their second-largest search term at 74,000 a month.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2024-12-31",
      title: "153 listings in a year, the catalogue's biggest cohort",
      detail: "More new ASINs in 2024 than in 2014 through 2021 combined.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2024-08-15",
      title: "Butterfly sells the majority of its stake",
      detail:
        "Per the law firm that ran the deal: since 2021 Butterfly \"helped the Company nearly triple in size and quadruple its profitability\", and it kept a board seat. King Street financed the buyer side.",
      track: "brand",
      source: "kirkland",
    },
    {
      date: "2025-03-31",
      title: "Paid search peaks, then stops",
      detail:
        "Ubersuggest's paid series runs from September 2024 and peaks in March 2025 at 19 keywords and ~2,541 visits. From October 2025 it reads zero — while Similarweb still calls paid search their largest channel. The two do not agree; see the gaps.",
      track: "ads",
      source: "ubersuggest",
    },
    {
      date: "2025-10-31",
      title: "$420M of debt, and ~97% ownership",
      detail:
        "A Capital One facility due 2030, which Forbes reports left the founder owning about 97% of the company. The year EBITDA first topped $100M.",
      track: "brand",
      source: "forbes",
    },
    {
      date: "2025-11-30",
      title: "$18.0M — the biggest month on record",
      detail:
        "693,100 units. Every November and January in the series is a spike; this is a category that sells on a New Year's resolution.",
      track: "amazon",
      source: "keepa-history",
    },
    {
      date: "2026-08-27",
      title: "Forbes puts the company at ~$600M and ~$125M EBITDA",
      detail:
        "The number this page is measured against. Our Amazon run rate is $196.7M, so Amazon is about a third of the company — and Forbes' figure is an estimate too, arrived at by a different method entirely.",
      track: "brand",
      source: "forbes",
    },
  ],


  /* REAL QUOTES, for a comparable product — not this brand's costs, and at
     this brand's volume almost certainly worse than what it pays. Read off
     Made-in-China listings on 2026-09-09. Freight is the one line nobody
     quoted. */
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
      supplier: "Guangzhou Marian Health Food Co., Ltd — gummies",
      region: "Guangdong, CN",
      moq: "500 pieces",
      unitCost: "$1.00–3.00 / unit",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Energy_Drink_Powder_Sachet.html",
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

  economics: {
    lines: [
      {
        label: "Cost of goods",
        pct: 12,
        note: "≈$3.00 a unit against a $24.87 average order, from published category quotes. A brand buying 658,850 units a month pays less than a 3,000-unit minimum, so this is a ceiling on their COGS rather than an estimate of it — and their products are USDA-organic and largely US-made, which the quotes are not.",
        source: "mic",
      },
      {
        label: "Amazon referral fee",
        pct: 15,
        note: "Amazon's published rate for Beauty, Health and Personal Care above $10.",
        source: "amazon-fees",
      },
      {
        label: "FBA fulfilment",
        pct: 18,
        note: "≈$4.50 a unit blended: liquid vitamins in 15oz glass are large-standard at $4.60–5.42, gummies are small-standard at $3.45–3.78. Which band a given ASIN falls in depends on measured dimensions we do not have.",
        source: "fba-rates",
      },
      {
        label: "Advertising",
        key: "ads",
        pct: 8,
        note: "TACOS, computed: a $1.10–1.40 Health & Household click at an 11–14% conversion rate is $7.86–12.73 per ad-attributed sale — 32–51% ACoS on a $24.87 order — and 20–40% of these units carried that way is 8% of revenue.",
        source: MODELLED,
      },
      /* 🚨 Returns and overhead deliberately absent, as on every dossier here:
         the call was that returns are negligible and overhead is a later
         problem. The total is a CEILING on profit, and on this page it is a
         ceiling twice over — see `basis`. */
    ],
    basis:
      "Three lines are published and cited; advertising is computed from category benchmarks. Returns and overhead are set to zero, so the total is a ceiling — and here it is a ceiling twice over, because it assumes every unit on these listings is the brand's. Their own storefront holds 268 of the 617 listings that carry the name, and one of them has 298 competing offers. Nothing public splits that revenue, so a margin applied to all of it flatters whoever is actually selling.",
    source: MODELLED,
  },

  advertising: [
    {
      channel: "Amazon Sponsored Products",
      spend: "≈ $1.0M–2.6M / mo",
      note:
        "The arithmetic: a $1.10–1.40 Health & Household click at an 11–14% conversion rate is $7.86–12.73 per ad-attributed sale, or 32–51% ACoS on a $24.87 order. Carrying 20–40% of 658,850 units that way lands the spend here, at 6–16% TACOS. Amazon publishes nothing about a competitor's spend and localises its search results, so this is arithmetic rather than a reading.",
      source: MODELLED,
    },
    {
      channel: "Meta (Facebook + Instagram)",
      spend: "not estimable",
      note:
        "~390 ads are live on their own page — the page-scoped count, three times what a keyword search shows. The founder runs her own advertiser page and creator handles run branded content paired with her name, which is a whitelisting operation rather than a few boosted posts. Meta publishes the ads and never the money, and there is no clean visit count to price them against.",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&view_all_page_id=582115538507595&search_type=page&media_type=all",
      linkSource: "meta-ads",
      activity: "~390 active US ads on the brand page",
      activitySource: "meta-ads",
      source: "meta-ads",
    },
    {
      channel: "Google Ads",
      spend: "the two sources disagree",
      note:
        "🚨 Worth more than a number. Similarweb makes Paid Search their LARGEST channel at 25.95% of traffic in August 2026; Ubersuggest logs zero paid keywords in that same month, after a run from September 2024 that peaked in March 2025. Both are estimates and the likely reconciliation is Shopping and Performance Max, which Ubersuggest does not index — but we cannot settle it, so the page shows both rather than picking one.",
      activity: "25.95% of traffic (Similarweb) vs 0 paid keywords (Ubersuggest)",
      activitySource: "similarweb",
      source: "ubersuggest",
    },
  ],

  /* REAL, from Ubersuggest on 2026-09-09 — their actual Google positions and
     that tool's volume estimates. The brand terms dwarf the category ones,
     which is what an eleven-year-old brand looks like in search. */
  keywords: [
    { term: "mary ruths", engine: "Google", rank: "#1", volume: "90,500 / mo", source: "ubersuggest" },
    { term: "mary ruth hair growth", engine: "Google", rank: "#2", volume: "74,000 / mo", source: "ubersuggest" },
    { term: "mary ruth vitamins", engine: "Google", rank: "#1", volume: "40,500 / mo", source: "ubersuggest" },
    { term: "mary ruth organics", engine: "Google", rank: "#1", volume: "18,100 / mo", source: "ubersuggest" },
    { term: "mary ruth hair growth max", engine: "Google", rank: "#4", volume: "14,800 / mo", source: "ubersuggest" },
    { term: "liquid morning multivitamin hair growth", engine: "Google", rank: "#3", volume: "12,100 / mo", source: "ubersuggest" },
    { term: "kids vitamins", engine: "Google", rank: "#3", volume: "9,900 / mo", source: "ubersuggest" },
    { term: "vegan iron vitamins", engine: "Google", rank: "#5", volume: "9,900 / mo", source: "ubersuggest" },
    { term: "hair skin & nails gummy", engine: "Google", rank: "#6", volume: "8,100 / mo", source: "ubersuggest" },
    { term: "vegan liquid vitamins", engine: "Google", rank: "#2", volume: "6,600 / mo", source: "ubersuggest" },
  ],

  /* REAL, from Keepa's rank data on 2026-09-09. Five of the hair-growth SKUs
     share one parent listing, which is why they share #143. */
  bestsellers: [
    {
      label: "Liquid Multivitamin + Hair Growth, and its variations",
      rank: "#143 in Health & Household",
      note: "Five ASINs share this parent listing, and between them they are the largest earner in the catalogue.",
      source: "bsr",
    },
    {
      label: "Kids Multivitamin Gummies",
      rank: "#535 in Health & Household",
      note: "30,000+ a month at $14.46 — and the listing carries 298 competing offers.",
      source: "bsr",
    },
    {
      label: "Liquid Morning Multivitamin (2014)",
      rank: "#1,063 in Health & Household",
      note: "The original product, still top five by revenue eleven years after it was listed. 177 offers on it.",
      source: "bsr",
    },
    {
      label: "Organic Lymphatic Support Liquid Drops",
      rank: "#3,015 in Health & Household",
      note: "30,000+ a month at $15.15 — high volume, low rank, which is what a cheap repeat-purchase SKU looks like.",
      source: "bsr",
    },
  ],

  /* 🚨 See the note on `record` in ../demo/dossier.ts for the rules this
     section is written under. The regulator's classification leads; the
     company's own framing sits beside it; the checks that came back clean are
     here too; and a law firm advertising for claimants is labelled as that and
     not as a case. */
  record: [
    {
      label: "FDA recall — Class I",
      value: "F-0214-2022",
      note:
        "Organic Infants Liquid Probiotic, 25,673 units, nationwide, for Pseudomonas aeruginosa. Initiated 2021-10-28, classified by the FDA on 2021-11-19, TERMINATED 2022-02-18. The company's own notice is headed \"Out of an Abundance of Caution\" and reports one case of temporary diarrhea; Class I is the FDA's most serious tier, and the classification is the FDA's, not theirs. Four years closed, and still the most consequential line on this page.",
      source: "fda",
      flag: true,
    },
    {
      label: "FDA warning letters",
      value: "none",
      note:
        "Checked across the FDA's own published warning-letter set for 2017 through 2026-09-08 — 3,679 rows — for the brand, the entity and the founder's name. No hits.",
      source: "fda",
    },
    { label: "Other FDA recalls", value: "none", note: "One record in the enforcement database, the 2021 probiotic recall above.", source: "fda" },
    {
      label: "California Prop 65 notices",
      value: "none",
      note: "Zero 60-day notices naming the company in the California Attorney General's database. The search was validated against controls that do return hits.",
      source: "prop65",
    },
    {
      label: "Lead disclosed, highest lot",
      value: "33 ppb",
      note:
        "🚨 Both halves matter. Consumer Reports' October 2025 review of California's AB 899 disclosure law found MaryRuth's among only three or four brands publishing lot-level heavy-metal results at all — \"more than 350 lots of more than 40 products\" — and found its highest disclosed lead level the highest of those reviewed, at 33 ppb in a probiotic against 14 and 5.7 elsewhere. A brand that discloses more can show a higher number than one that discloses nothing. This is a disclosure finding, not a contamination ranking.",
      source: "consumer-reports",
      flag: true,
    },
    {
      label: "Subscription-billing investigations",
      value: "2 open",
      note:
        "A plaintiffs' firm opened auto-renewal and subscription-billing investigations in April and May 2026. 🚨 That is a law firm advertising for claimants — not a filed case, not a regulator, and not a finding against anyone. No FTC or state action exists.",
      source: "classlaw",
    },
    {
      label: "Federal lawsuits",
      value: "2, both closed",
      note:
        "A 2022 trademark suit in which this company was the DEFENDANT (terminated 2022-08-10) and a 2025 website-accessibility suit of the kind filed serially against thousands of retailers (terminated 2025-06-16). Neither concerns a product.",
      source: "courtlistener",
    },
    {
      label: "State class action",
      value: "dismissed",
      note:
        "A May 2024 false-advertising class action in Los Angeles over the Kids Focus & Attention drops, voluntarily dismissed without prejudice in August 2024. Read from docket summaries; the docket itself sits behind a paid service.",
      source: "courtlistener",
    },
    {
      label: "Trustpilot",
      value: "2.6 / 5",
      note: "On only 25 reviews, 48% of them one star — too thin to read as a brand score, and worth stating alongside the 39,143 Amazon ratings at 4.5 rather than instead of them.",
      source: "trustpilot",
    },
    {
      label: "Better Business Bureau",
      value: "F",
      note:
        "Not accredited. The F is driven by failure to respond to 10 of 12 complaints rather than by the complaints' merit — which is itself the pattern: satisfaction is high on the product and low on billing and support.",
      source: "bbb",
    },
    {
      label: "Inc. 5000",
      value: "#469, then #920",
      note:
        "1,336% three-year growth in 2022 and 642% in 2023, from Inc.'s own list data. They are not on the 2024 or 2025 lists — which can mean growth slowed below the threshold, or simply that they stopped applying.",
      source: "inc",
    },
  ],

  gaps: [
    "🚨 How much of this revenue is theirs. 617 listings carry the brand name; their own storefront holds 268. One kids' multivitamin listing has 298 offers, the original morning multi has 177. The badge counts the LISTING, and nothing public splits it between the brand and the resellers on the same page — so the headline is a ceiling on the brand's Amazon revenue, not a measure of it.",
    "What the company is, as opposed to what the channel is. 22,780 retail doors across 323 banners means Amazon is one of several channels, and no public source gives the split. A page that read $196.7M as company revenue would be wrong by an unknown and probably large multiple.",
    "The bracket noise. At 658,850 units a month, one ASIN stepping from 20,000 to 40,000 moves the total by half a million dollars. Some of the chart's month-to-month movement is Amazon's rounding rather than the business, and there is no way to separate them from outside.",
    "This business's actual COGS, and its returns and overhead. The quotes are published but they price the category at a 3,000-unit minimum; a brand buying 658,850 units a month pays less. Returns and overhead are set to zero, so the margin here is a ceiling.",
    "Whether they buy search. Similarweb makes Paid Search their largest channel at 25.95%; Ubersuggest reads zero paid keywords for the same month. Shopping and Performance Max are the likely explanation and neither source settles it. A Google Ads Transparency Center check or a Semrush paid index would.",
    "Where the revenue ladder comes from. $100M (2022), $500M (2024) and ~$600M (2026) all trace to founder interviews and to Forbes' own estimate rather than to any filing — this is a private company and none of it is audited. The only structured third-party figures are Inc.'s growth rates. Treat the ~33% Amazon share as one estimate divided by another.",
    "Amazon keyword rank and search volume. Amazon publishes no volumes and localises search results to the viewer — this machine is on an Israeli IP, so the US result set is not visible. Best-seller rank is on the page instead; a Helium 10 reverse-ASIN pull would fill it.",
    "The 421 listings with no badge. Each sells under roughly 50 a month, Amazon publishes no figure, and they are counted as zero rather than estimated.",
    "Where the company actually operates from. The Amazon seller record gives a Los Angeles address and the site's terms give only a Delaware registered agent — Cogency Global in Dover — with a 310 phone number and New York governing law. Four jurisdictions and no operating HQ stated.",
  ],

  sources: [
    {
      id: "keepa",
      label: "Keepa Product API",
      href: "https://keepa.com/#!api",
      read: "2026-09-09",
      detail:
        "Whole-catalogue pull on the brand string \"MARYRUTH'S\": 617 ASINs with each one's monthlySold badge, buy box price, first-listed date and category rank, assembled over seven pages of Product Finder. Revenue, units and the concentration figures are computed from these and reported by nobody. Two neighbouring strings exist — \"maryruth organics\" as a brand returns 4 ASINs, as a manufacturer 198 — so a query on the obvious spelling would have found a fraction of the catalogue.",
    },
    {
      id: "keepa-seller",
      label: "Keepa Seller API",
      href: "https://keepa.com/#!api",
      read: "2026-09-09",
      detail:
        "The operating business behind the storefront: MaryRuth Organics, LLC trading as MRO MaryRuth, LLC, at 1171 S Robertson #148, Los Angeles; 99% feedback over 36,747 ratings with 345 in the last thirty days; FBA enabled; and a storefront of 268 ASINs against the 617 that carry the brand name.",
    },
    {
      id: "keepa-offers",
      label: "Keepa — live offer lists",
      href: "https://keepa.com/#!api",
      read: "2026-09-09",
      detail:
        "Every seller on a listing, not just the winner. The brand holds the buy box on its top ASINs — the buy-box seller id resolves to MaryRuth Organics, LLC and Amazon itself is only one of the other offers — but the offer counts are 298 on the kids' multivitamin, 177 on the morning multi and 38 on the hair-growth SKU, from dozens of micro-sellers including one in the Netherlands.",
    },
    {
      id: "keepa-history",
      label: "Keepa — monthlySoldHistory",
      href: "https://keepa.com/#!api",
      read: "2026-09-09",
      detail:
        "Amazon's \"bought in past month\" badge as it moved, per ASIN, across the top 100 listings — 91.5% of catalogue revenue — read at each month end and priced at today's buy box. 38 months, which is as far back as Keepa recorded the badge here. 🚨 The badge is bracketed, so at this volume a single step moves the monthly total by half a million dollars.",
    },
    {
      id: "bsr",
      label: "Keepa category ranks",
      href: "https://www.amazon.com/dp/B0CWS5QP8F",
      read: "2026-09-09",
      detail:
        "Best-seller rank per listing, including the shared parent rank of #143 in Health & Household that five hair-growth ASINs sit behind. BSR is the same number for every viewer, unlike Amazon search results, which are localised — which is why Amazon keyword positions are missing from this page rather than guessed.",
    },
    {
      id: "store-locator",
      label: "Their own store locator's API",
      href: "https://www.maryruthorganics.com/pages/find-a-store",
      read: "2026-09-09",
      detail:
        "The brand's locator is powered by storelocators.com and exposes an open endpoint returning every door: 22,780 US locations across 323 retailer banners. First-party and unusually complete — most brands publish a search box, not the list behind it. Live product pages at Walmart, Target and Whole Foods were opened independently to confirm three of the largest banners. Costco appears in search results but is absent from the locator and its site blocks this address, so it is left unconfirmed.",
    },
    {
      id: "own-store",
      label: "maryruthorganics.com",
      href: "https://www.maryruthorganics.com/",
      read: "2026-09-09",
      detail:
        "Shopify: 267 published products, a $2.00–$234.15 price band with a $24.95 median, Subscribe & Save at 10%, and a bestseller list led by the $42.95 Liquid Morning Multivitamin. The legal pages name MRO MaryRuth, LLC, give only a Delaware registered agent (Cogency Global, Dover), a 310 phone number, orders@ and jklein@ addresses, and New York governing law.",
    },
    {
      id: "whois",
      label: "Domain registration record and the Wayback Machine",
      href: "https://lookup.icann.org/",
      read: "2026-09-09",
      detail:
        "maryruthorganics.com created 2014-12-31 through Network Solutions; earliest archived capture 2015-06-22. The date matters because the first Amazon listing predates it by four months — the reverse of every other brand profiled here.",
    },
    {
      id: "similarweb",
      label: "Similarweb — maryruthorganics.com",
      href: "https://www.similarweb.com/website/maryruthorganics.com/",
      read: "2026-09-09",
      detail:
        "750.8K visits — and the label on that number is \"Total Visits Last 3 Months\", so the ~250K a month is our division, not their figure. Also +6.61% month on month, global rank #68,102, US #14,148, category #341, bounce 54.72%, 3.05 pages per visit, 83.5% US, and an audience 76.9% female concentrated in 25–34. Their channel mix makes Paid Search the largest at 25.95%; the free page shows only the top three channels.",
    },
    {
      id: "ubersuggest",
      label: "Ubersuggest — maryruthorganics.com",
      href: "https://neilpatel.com/ubersuggest/",
      read: "2026-09-09",
      detail:
        "18,032 ranking keywords, 230,773 organic visits in August 2026, domain authority 40, 594,768 backlinks from 4,248 referring domains — and a paid-keyword series that runs September 2024 to September 2025, peaks at 19 keywords in March 2025, and reads zero from October 2025. That last figure contradicts Similarweb's 25.95% paid share, and the page says so rather than choosing.",
    },
    {
      id: "meta-ads",
      label: "Meta Ad Library — MaryRuth's",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&view_all_page_id=582115538507595&search_type=page&media_type=all",
      read: "2026-09-09",
      detail:
        "A PAGE-SCOPED count: ~390 active US ads on advertiser page 582115538507595, against only ~120 that a keyword search surfaces — which is why the page-scoped URL is the one cited. The founder has her own page (~6 ads) and creator handles run branded content paired with her name. Meta publishes the ads and their run dates, never the spend, and the library shows only ACTIVE ads, so the oldest visible start date is not a campaign start.",
    },
    {
      id: "forbes",
      label: "Forbes — \"How The Founder Of MaryRuth's Built A Billion-Dollar Business\"",
      href: "https://www.forbes.com/sites/chloesorvino/",
      read: "2026-09-09",
      detail:
        "Published 2026-08-27. Forbes ESTIMATES ~$600M trailing-twelve-month revenue and ~$125M EBITDA, and reports a revenue ladder attributed to the company — $11M in 2018, $23M in 2019, $135M in 2021, $270M+ in 2023 — plus a $420M Capital One facility closed October 2025 and a co-CEO appointed April 2025. 🚨 An estimate by a magazine is not a filing: this is a private company and none of these figures are audited. Forbes blocks our fetcher, so the text was read from the Internet Archive's capture of the article.",
    },
    {
      id: "kirkland",
      label: "Kirkland & Ellis — Butterfly's sale of its MaryRuth's stake",
      href:
        "https://www.kirkland.com/news/press-release/2024/08/kirkland-advises-butterfly-on-sale-of-stake-in-maryruth-organics",
      read: "2026-09-09",
      detail:
        "A dated law-firm release for the 2024-08-15 transaction: Butterfly Equity sold the majority of a stake it took in August 2021, King Street financed the buyer, and Butterfly kept a board seat. No price was disclosed by any party, then or since. The claim that Butterfly \"nearly tripled\" the company is the SELLER describing its own track record in its own exit release.",
    },
    {
      id: "fda",
      label: "FDA — enforcement reports and warning letters",
      href:
        "https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts/out-abundance-caution-maryruths-announces-voluntary-recall-two-lots-its-liquid-probiotic-infants",
      read: "2026-09-09",
      detail:
        "The regulator's own datasets. Recall F-0214-2022 is classified Class I — the FDA's most serious tier — for Pseudomonas aeruginosa in an infants' probiotic, 25,673 units, initiated 2021-10-28 and terminated 2022-02-18. The linked page is the company's own announcement, which the FDA hosts; the classification is the FDA's own. The same datasets return NO warning letter and no second recall across 2017 to 2026-09-08.",
    },
    {
      id: "prop65",
      label: "California Attorney General — Proposition 65 60-day notices",
      href: "https://oag.ca.gov/prop65/60-day-notice-search",
      read: "2026-09-09",
      detail:
        "No notice names this company. The search was validated against control terms that do return results, so the empty result is an answer rather than a failed query.",
    },
    {
      id: "consumer-reports",
      label: "Consumer Reports — lead disclosure under California AB 899",
      href:
        "https://advocacy.consumerreports.org/research/lead-in-baby-food-what-about-dietary-supplements/",
      read: "2026-09-09",
      detail:
        "Published 2025-10-10. A review of which brands comply with California's heavy-metals disclosure law, NOT a Consumer Reports lab test. MaryRuth's was among the few brands publishing lot-level results at all, and its highest disclosed lead figure — 33 ppb in a probiotic — was the highest among those reviewed. Both halves are the finding: a brand that publishes more can show a higher number than one that publishes nothing.",
    },
    {
      id: "classlaw",
      label: "Migliaccio & Rathod LLP — subscription-billing investigations",
      href: "https://classlawdc.com/2026/04/29/maryruth-organics-auto-renewal-investigation/",
      read: "2026-09-09",
      detail:
        "Two investigation notices, April and May 2026. 🚨 This is a plaintiffs' firm inviting customers to contact it — not a filed case, not a regulator, and not a finding against anyone. It is here because it is the live reputational thread the reviews also point at, and it is labelled for exactly what it is.",
    },
    {
      id: "courtlistener",
      label: "CourtListener — federal dockets",
      href: "https://www.courtlistener.com/",
      read: "2026-09-09",
      detail:
        "Two federal matters, both terminated: a 2022 Lanham Act suit in which this company was the defendant, and a 2025 ADA website-accessibility suit of the kind filed serially. A 2024 California false-advertising class action was voluntarily dismissed without prejudice; that one is read from docket summaries because the docket itself sits behind a paid service.",
    },
    {
      id: "trustpilot",
      label: "Trustpilot — maryruthorganics.com",
      href: "https://www.trustpilot.com/review/maryruthorganics.com",
      read: "2026-09-09",
      detail: "2.6 out of 5 across 25 reviews, 48% of them one star. Twenty-five reviews is far too few to weigh against 39,143 Amazon ratings, and the page says so.",
    },
    {
      id: "bbb",
      label: "Better Business Bureau",
      href:
        "https://www.bbb.org/us/ca/los-angeles/profile/vitamins-and-supplements/mary-ruth-organics-1216-1274746",
      read: "2026-09-09",
      detail: "An F rating, not accredited, driven by failure to respond to 10 of 12 complaints rather than by the complaints' merit.",
    },
    {
      id: "inc",
      label: "Inc. 5000 list data",
      href: "https://www.inc.com/inc5000",
      read: "2026-09-09",
      detail:
        "Read from Inc.'s own list API: rank 469 in 2022 on 1,336% three-year growth, rank 920 in 2023 on 642%, and absent from the 2024 list. Inc. publishes revenue on the profile pages, which are blocked to us, so the growth rates are what this source gives.",
    },
    {
      id: "bcorp",
      label: "B Lab — B Corp certification",
      href: "https://www.bcorporation.net/",
      read: "2026-09-09",
      detail:
        "MRO MaryRuth, LLC, certified since July 2023 with a B Impact Score of 81.6 against a passing mark of 80 and a median of 50.9. An audit of how a company operates, not of what it earns.",
    },
    {
      id: "brand-story",
      label: "The brand's own account of itself",
      href:
        "https://www.maryruthorganics.com/blogs/press-and-news/story-behind-maryruth-organics-interview-with-maryruth-ghiyam",
      read: "2026-09-09",
      detail:
        "Their own interview with the founder: a Manhattan nutrition practice seeing 10–12 clients a day who disliked capsules, a liquid multivitamin made for them, bottles sold off a bookshelf, and — in her words — \"I just happened to start putting them on Amazon.\" Keepa's first listing date of 2014-09-07, four months before the domain was registered, is the public record agreeing with the story. Taken at its word and labelled as the company's own telling. She also tells a personal account of family bereavement and debt there, which is hers to tell and is not reproduced on this page.",
    },
    {
      id: "tiktok",
      label: "TikTok — @maryruthorganics",
      href: "https://www.tiktok.com/@maryruthorganics",
      read: "2026-09-09",
      detail:
        "624,900 followers, 2.4M likes and 1,691 videos, read from the page's own data object. The account's createTime reads 2021-01-21 19:46:30 UTC and the timestamp encoded in its user id agrees to within 106 seconds, so the creation date is measured twice. Follower and like counts are TikTok's rounded fields; the video count is exact.",
    },
    {
      id: "instagram",
      label: "Instagram — @maryruthghiyam and @maryruthorganics",
      href: "https://www.instagram.com/maryruthghiyam/",
      read: "2026-09-09",
      detail:
        "The founder's account carries 733K followers over 750 posts; the BRAND's account carries 28K over 156. Instagram rounds both for logged-out readers and serves only the twelve most recent posts, so neither account's age could be established — the earliest archived capture of the brand profile is 2022-08-26, which bounds nothing useful.",
    },
    {
      id: "facebook",
      label: "Facebook — MaryRuth Organics",
      href: "https://www.facebook.com/maryruthorganics/",
      read: "2026-09-09",
      detail:
        "264,031 likes and 6,874 \"talking about this\", on the page that runs their advertising. Its transparency panel gives a creation date of 2004 — three years before Facebook Pages existed — which is a merged-page artifact and is not reported as a date.",
    },
    {
      id: "youtube",
      label: "YouTube — @maryruthorganics",
      href: "https://www.youtube.com/@maryruthorganics",
      read: "2026-09-09",
      detail:
        "8,980 subscribers across 945 videos, channel joined October 2018 — YouTube publishes the join date, unlike the other platforms. Their X account (9,874 followers) dates to July 2013 and last posted in 2025; Pinterest's newest board is from 2021.",
    },
    {
      id: "amazon-fees",
      label: "Amazon — published selling fees",
      href: "https://sell.amazon.com/pricing",
      read: "2026-09-09",
      detail:
        "Amazon's own referral-fee schedule: 8% for Beauty, Health and Personal Care items at $10 or less and 15% above it, with a $0.30 minimum. First-party and not modelled.",
    },
    {
      id: "fba-rates",
      label: "FBA fulfilment rate card, 2026",
      href: "https://warehousingcosts.com/guides/amazon-fba-fulfillment-fees",
      read: "2026-09-09",
      detail:
        "The US FBA fee table effective 15 January 2026 with the 17 April fuel and logistics surcharge. Amazon's own copy sits behind Seller Central, so this is a published mirror rather than the first-party page, and which band a given ASIN falls in depends on measured dimensions we do not have.",
    },
    {
      id: "trellis",
      label: "Trellis — Amazon advertising benchmarks by category, 2026",
      href: "https://gotrellis.com/resources/blog/amazon-advertising-benchmarks",
      read: "2026-09-09",
      detail:
        "Aggregated platform data published March 2026: Health & Household runs a $1.10–1.40 cost-per-click at an 11–14% conversion rate. A benchmark for the CATEGORY, and the input that turns a $24.87 average order into a 32–51% ACoS.",
    },
    {
      id: "mic",
      label: "Made-in-China — supplier listings",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Oregano_Oil_Softgel.html",
      read: "2026-09-09",
      detail:
        "Published price ranges and minimum orders from named suppliers for supplement bottles and gummies. These price the CATEGORY at small minimums, and a brand shipping 658,850 units a month pays less — so the cost-of-goods line built from them is a ceiling, not an estimate. Their products are also USDA-organic and largely US-made, which these quotes are not.",
    },
    {
      /* 🚨 The third rung: computed by us from the numbered entries above.
         Renders "≈" so it can never be read as somebody else's measurement,
         and never as a fabrication either. */
      id: MODELLED,
      label: "Modelled by us — the arithmetic, and what feeds it",
      detail:
        "Marked with ≈. Two figures here are computed rather than read: Amazon ad spend, from Keepa's unit floors and Trellis's category cost-per-click and conversion benchmarks with a 20–40% ad share as the one assumption we supply; and the margin and profit line, from revenue less the published supplier quotes, Amazon's published referral rate, Amazon's published FBA fee and that modelled ad spend — with returns and overhead deliberately set to zero. Every input is one of the numbered sources above, so a reader who disagrees can find the number they disagree with.",
    },
    {
      /* 🚨 The entry every invented figure points at, and deliberately LAST. */
      id: INVENTED,
      label: "Invented for this demo — nobody measured this",
      detail:
        "Marked with * wherever it appears, and on this page it is one row: the freight and inbound line on the sourcing tab, which no forwarder quoted. Everything else carries a number (somebody published it) or a ≈ (we computed it from those).",
    },
  ],

  copy: {
    profitChart:
      "Hover a dot for what happened there. Three years of the badge moving: $5.7M in August 2023 to a peak of $18.0M in November 2025, with a spike every November and January. 🚨 Some of the month-to-month wobble is Amazon's bracketing — at this volume one listing stepping a bracket moves the total by half a million dollars.",
    timelineLede:
      "The strands are kept on one line because this brand inverts the pattern of every other one profiled here: the first ASIN is 2014-09-07 and the domain is 2014-12-31. Amazon came first, the website came second, and 22,780 retail doors came later.",
    salesLede:
      "No single listing carries this business. The 15 largest of 253 priced ASINs sum to $7.08M against a $16.4M headline — 43% — and it takes the top 50 to reach 73%. The hair-growth line is the biggest thing on the shelf; the 2014 morning multivitamin is still in the top five.",
    advertisingLede:
      "One channel is counted, one is arithmetic, and one is a disagreement. Meta's library gives an authoritative ~390 live ads on their own page. Amazon spend is computed from published category benchmarks. And on Google, Similarweb says paid search is their largest channel while Ubersuggest says they buy nothing — the page shows both rather than choosing.",
    trafficLede:
      "For this business the half Amazon cannot see is most of the business: 22,780 retail doors across 323 banners, and a site doing about 250,000 visits a month whose top six search terms are all the brand's own name.",
  },
};
