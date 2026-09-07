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
import { INVENTED, type Dossier } from "../dossier";

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

  /* Oldest first, and ENTIRELY REAL — unusually for these dossiers, nothing
     here is invented. The brief expected the web and ad tracks to be made up;
     whois, the Wayback Machine and Meta's ad library turned out to publish
     dated events for all three, so they are cited instead of fabricated. */
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
      date: "2026-08-03",
      title: "Meta ads running for the garlic line",
      detail:
        "Advertorial creative under a page called \"Everyday Wellness Review\"; 18 ads share the one video. The library publishes the creative and the start date, never the spend.",
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

  /* 🚧 ENTIRELY INVENTED. COGS is the number this product refuses to guess
     (see gaps, and SKILL.md section 8). These rows show the SHAPE of the
     answer a real sourcing pass would produce, and every one is marked. */
  sourcing: [
    {
      supplier: "Softgel contract manufacturer, oregano + black seed",
      region: "Guangdong, CN",
      moq: "50,000 softgels",
      unitCost: "$0.038 / softgel",
      leadTime: "35 days",
      href: "https://www.alibaba.com/",
      source: INVENTED,
    },
    {
      supplier: "Aged garlic extract, SAC-standardised",
      region: "Shandong, CN",
      moq: "500 kg",
      unitCost: "$0.061 / softgel",
      leadTime: "48 days",
      href: "https://www.alibaba.com/",
      source: INVENTED,
    },
    {
      supplier: "US cGMP encapsulator, bottling and pack-out",
      region: "Utah, US",
      moq: "10,000 bottles",
      unitCost: "$1.42 / bottle",
      leadTime: "21 days",
      href: "https://www.alibaba.com/",
      source: INVENTED,
    },
    {
      supplier: "Bottle, label and safety seal",
      region: "US",
      moq: "25,000 units",
      unitCost: "$0.51 / bottle",
      leadTime: "16 days",
      href: "https://www.alibaba.com/",
      source: INVENTED,
    },
    {
      supplier: "Freight — Yantian → Long Beach, LCL",
      region: "CN → US",
      moq: "8 CBM",
      unitCost: "$0.09 / bottle landed",
      leadTime: "31 days",
      href: "https://www.freightos.com/",
      source: INVENTED,
    },
  ],

  /* 🚧 The Meta ad library LINK is real and anyone can open it — and for this
     brand it is more interesting than usual, because the ads are not running
     under the brand's name. Every FIGURE beside it is invented: the library
     publishes creative and run dates, never spend, and no public source
     reports Amazon ad spend at all. */
  advertising: [
    {
      channel: "Amazon Sponsored Products",
      spend: "$792,000 / mo",
      note: "Implied TACOS 14.0% against $5.66M of Amazon revenue.",
      source: INVENTED,
    },
    {
      channel: "Meta (Facebook + Instagram)",
      spend: "$1,340,000 / mo",
      note:
        "Advertorial creative under pages named \"Everyday Wellness Review\" and \"Vascular Wellness Report\", driving the subscription store rather than Amazon. The library shows what is running; it never shows spend.",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=resilia&search_type=keyword_unordered&media_type=all",
      /* The library is real and cited on the NAME; the spend is invented and
         cited on the FIGURE. See the note on AdChannel. */
      linkSource: "meta-ads",
      source: INVENTED,
    },
    {
      channel: "Google Ads (search + shopping)",
      spend: "$61,000 / mo",
      note: "Brand defence, against the several Resilia domains nobody has tied to the operator.",
      source: INVENTED,
    },
    {
      channel: "Blended",
      spend: "$2,193,000 / mo",
      note:
        "All channels. Stated against Amazon revenue it would read as 38.8%, which is exactly why it should not be: most of this spend is buying DTC subscriptions this page cannot size.",
      source: INVENTED,
    },
  ],

  /* 🚧 Ranks and volumes invented. The site-traffic figure in `offAmazon` is
     the one real number on that tab. */
  keywords: [
    { term: "oil of oregano", engine: "Amazon", rank: "#4 organic", volume: "246,000 / mo", source: INVENTED },
    { term: "oregano oil softgels", engine: "Amazon", rank: "#2 organic", volume: "88,000 / mo", source: INVENTED },
    { term: "odorless garlic supplement", engine: "Amazon", rank: "#1 organic", volume: "64,000 / mo", source: INVENTED },
    { term: "black seed oil capsules", engine: "Amazon", rank: "#19 organic", volume: "171,000 / mo", source: INVENTED },
    { term: "resilia", engine: "Amazon", rank: "#1 organic", volume: "33,100 / mo", source: INVENTED },
    { term: "aged garlic extract benefits", engine: "Google", rank: "#12", volume: "40,500 / mo", source: INVENTED },
    { term: "oil of oregano benefits", engine: "Google", rank: "#22", volume: "110,000 / mo", source: INVENTED },
    { term: "resilia oregano reviews", engine: "Google", rank: "#1", volume: "5,400 / mo", source: INVENTED },
  ],

  gaps: [
    "COGS, and therefore margin and profit. Nothing here models what a softgel costs to make or land — see SKILL.md section 8. On a site called VerifiedMargins that is the one number we will not guess.",
    "How big the DTC side is. Similarweb counts visits, not orders, and resilia.shop sells subscriptions — so the $5.66M above is the AMAZON business only, and the whole company is larger by an amount nothing public will tell you.",
    "Ad spend. No public source reports a competitor's Amazon ad spend, and Meta's library publishes creative and run dates but never money. Both figures on the advertising tab are ours.",
    "Which advertiser pages this business controls. The ads for its garlic line run under \"Everyday Wellness Review\" and \"Vascular Wellness Report\", so the library cannot be totalled to the brand without someone establishing the link.",
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
        "Meta publishes every ad a page runs, with its creative and run dates. This is a KEYWORD search, so it also returns other advertisers: what it shows is that ads for Resilia Aged Garlic Extract were live from 2026-08-03 under pages named \"Everyday Wellness Review\" and \"Vascular Wellness Report\". It does NOT publish spend, so every figure on the advertising tab is invented.",
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
      /* 🚨 The entry every invented figure points at, and deliberately LAST.
         It renders as "*" rather than a number, so putting it first cost the
         real sources their first index — the list began at 2 and a reader was
         left hunting for a source 1 that did not exist. */
      id: INVENTED,
      label: "Invented for this demo — nobody measured this",
      detail:
        "Marked with * wherever it appears. Product sourcing, advertising spend and keyword ranks are placeholders, showing what the page will look like once those pipelines exist. They are not estimates, not modelled, and not to be quoted: they were made up. Everything carrying a NUMBER instead of a * came from one of the real sources above.",
    },
  ],

  copy: {
    catalogueChart:
      "Each step is a product going live. Nothing from a standing start: the oregano line in December, the aged-garlic ladder in a single day in May — a catalogue shipped by somebody who had already sold the product elsewhere.",
    timelineLede:
      "The strands are kept together on one line because the web track is the one that changes the story: a Shopify store selling this product in August 2024, a trademark ten weeks before the launch, and only then the Amazon catalogue — which reaches a $68M run rate faster than the store it came from took to get a second domain.",
    salesLede:
      "Two lines carry the business: oregano-with-black-seed, and the aged garlic that overtook it eight weeks after launching. These are the 15 largest of 21 priced products and they sum to $5.61M, so the bars fall a little short of the $5.66M headline — the remaining six are worth about $44,000 a month between them.",
    advertisingLede:
      "Meta's ad library is genuinely public and worth opening here, because the ads for this brand's biggest line are not running under this brand's name — they run under pages called \"Everyday Wellness Review\" and \"Vascular Wellness Report\". The library publishes creative and run dates; it does not publish spend, and Amazon publishes nothing at all, so both money figures below are ours.",
    trafficLede:
      "For this business it is the larger half. resilia.shop is a subscription store selling the same three lines, live since at least August 2024, and Similarweb reads it at 9.9M visits over three months — so the Amazon revenue at the top of this page is one channel of a bigger company, not the company.",
  },
};
