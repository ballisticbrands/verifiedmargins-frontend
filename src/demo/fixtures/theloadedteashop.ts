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
import { INVENTED, type Dossier } from "../dossier";

export const theLoadedTeaShop: Dossier = {
  brand: "The Loaded Tea Shop",
  what: "Amazon FBA · sugar-free energy drink mix sticks",
  logo: "/demo/theloadedteashop-logo.png",
  /* 512x466. Near square, so it takes the avatar's whole box — see logoShape. */
  logoShape: "square",

  headline: {
    revenue: "$1.58M",
    units: "45,050",
    asp: "$35.03",
    catalogue: "52 ASINs",
  },

  deepDive:
    "The Loaded Tea Shop sells sugar-free, zero-calorie energy drink mix sticks in 40+ flavours, " +
    "packed in 5, 10, 20 and 40 counts. It is a useful business to study because the Amazon " +
    "business and the brand are not the same age. The brand started in a Gulfport, Mississippi " +
    "kitchen in 2019 — founded by ex-Herbalife distributors who decided to make their own " +
    "product — and built its audience on Instagram and its own Shopify store, where it still " +
    "takes about 5,324 visits a month. Amazon came last. Its first listing went up in May 2025, " +
    "but the actual catalogue arrived in a burst between March and May 2026: 15 products in " +
    "roughly eight weeks. Six months on, that catalogue is turning an estimated $1.58M a month, " +
    "of which three multipacks are most of it. So this is not a new brand — it is an " +
    "established direct-to-consumer brand new TO AMAZON, arriving with an audience it already " +
    "had. Keepa cannot tell you that; only looking at the rest of their web presence can, which " +
    "is the argument for a human reading a page like this before it is published. The number " +
    "that does not fit the story is the seller feedback score: 72% over 337 ratings is poor for " +
    "a business this size, and it is the first thing worth asking them about.",

  operator: {
    businessName: "Champs Tea Shop, Inc",
    sellerName: "TheLoadedTeashop",
    sellerId: "A2FLJTREXC9RX4",
    address: ["6025 S Vista Dr", "Gulfport", "MS", "39507"],
    country: "US",
    storefrontUrl: "https://www.amazon.com/sp?seller=A2FLJTREXC9RX4",
    feedback: "72% over 337 ratings",
    feedbackNote: "poor, for a business this size",
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
      label: "Facebook — The Loaded Tea Shop",
      href: "https://www.facebook.com/people/The-Loaded-Tea-Shop/61572174010247/",
      value: "249K likes",
      note:
        "Four times the Instagram following. The page also names Tea Time, LLC as responsible for it — a different entity from the Amazon seller record's Champs Tea Shop, Inc.",
      source: "facebook",
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

  /* The four worth sending someone to, with each platform's own number. The
     Linktree and the founder-story page stay in `offAmazon` above: they are
     findings to read, not places to go. */
  links: [
    {
      platform: "amazon",
      label: "Amazon store",
      href: "https://www.amazon.com/sp?seller=A2FLJTREXC9RX4",
      metric: "52 ASINs",
      source: "keepa-seller",
    },
    {
      platform: "website",
      label: "theloadedteashop.com",
      href: "https://www.theloadedteashop.com/",
      metric: "5,324 visits / mo",
      source: "similarweb",
    },
    {
      platform: "instagram",
      label: "@theogloadedtea",
      href: "https://www.instagram.com/theogloadedtea/",
      metric: "59.3K followers",
      source: "instagram",
    },
    {
      platform: "facebook",
      label: "The Loaded Tea Shop",
      href: "https://www.facebook.com/people/The-Loaded-Tea-Shop/61572174010247/",
      metric: "249K likes",
      source: "facebook",
    },
  ],

  /* Oldest first. The real events carry a real source; the ad campaigns and
     the domain registration are INVENTED and say so — see the note on
     INVENTED in ../dossier.ts. */
  timeline: [
    {
      date: "2019",
      title: "Founded in a Gulfport kitchen",
      detail:
        "Two ex-Herbalife distributors stop selling somebody else's product and start mixing their own.",
      track: "brand",
      source: "web",
    },
    {
      date: "2021-08-14",
      title: "theloadedteashop.com registered",
      detail: "Shopify store goes up. Direct-to-consumer is the only channel for the next four years.",
      track: "web",
      source: INVENTED,
    },
    {
      date: "2025-03-03",
      title: "First Instagram post",
      detail: "79 weeks before this dossier was built. The audience is built here, not on Amazon.",
      track: "brand",
      source: "instagram",
    },
    {
      date: "2025-05-20",
      title: "First Amazon listing",
      detail: "A single product. Nothing follows it for ten months.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2025-11-02",
      title: "First Meta ad campaign",
      detail: "Video creative, driving to the Shopify store rather than to Amazon.",
      track: "ads",
      source: INVENTED,
    },
    {
      date: "2026-03-30",
      title: "The catalogue push begins",
      detail:
        "Variety 20, 10 and 40 packs go live on one day. The 20 pack becomes the single biggest earner in the business.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-04-14",
      title: "Founder's Favorites 5 and 10 packs",
      detail: "The 5 pack matches the 20 pack on units within weeks, at a third of the price.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-04-17",
      title: "Single-flavour 5 packs — Frog Spit, Mermaid, Bahama Mama",
      detail: "The long tail. None of them reaches 1,000 a month.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-04-24",
      title: "Flavor Discovery and Berry Blast collections",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-05-01",
      title: "Meta spend steps up",
      detail: "Creative switches to Amazon-first landing. Impressions roughly triple month on month.",
      track: "ads",
      source: INVENTED,
    },
    {
      date: "2026-05-12",
      title: "Mom Mode Collection",
      detail: "5 and 10 packs. The 5 pack is a top-three earner inside a month.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-05-22",
      title: "Caffeine-Free Variety",
      detail: "Carries a sold badge and no live buy box — it sells and is out of stock.",
      track: "amazon",
      source: "keepa",
    },
  ],

  /* 🚧 ENTIRELY INVENTED. COGS is the number this product refuses to guess
     (see gaps, and SKILL.md section 8). These rows show the SHAPE of the
     answer a real sourcing pass would produce, and every one is marked. */
  sourcing: [
    {
      supplier: "Shandong beverage powder co.",
      region: "Shandong, CN",
      moq: "10,000 sachets",
      unitCost: "$0.21 / sachet",
      leadTime: "28 days",
      href: "https://www.alibaba.com/",
      source: INVENTED,
    },
    {
      supplier: "Contract blender, US Midwest",
      region: "Missouri, US",
      moq: "25,000 sachets",
      unitCost: "$0.34 / sachet",
      leadTime: "18 days",
      href: "https://www.alibaba.com/",
      source: INVENTED,
    },
    {
      supplier: "Freight — Qingdao → Long Beach, FCL",
      region: "CN → US",
      moq: "1 x 20ft",
      unitCost: "$0.04 / sachet landed",
      leadTime: "34 days",
      href: "https://www.freightos.com/",
      source: INVENTED,
    },
    {
      supplier: "Carton, label and pack-out",
      region: "US",
      moq: "5,000 packs",
      unitCost: "$0.88 / retail pack",
      leadTime: "12 days",
      href: "https://www.alibaba.com/",
      source: INVENTED,
    },
  ],

  /* 🚧 Those quotes, totalled — which this page was built not to do. See the
     header comment on Economics: it is here on instruction, every figure it
     produces renders a "*", and the block says in words that the real page
     shows nothing here until a seller connects. */
  economics: {
    lines: [
      {
        label: "Cost of goods",
        pct: 12,
        note: "≈ $2.13 landed on a $19.80 five-pack, $5.88 on the $60 twenty — sachets, freight and pack-out from the quotes above.",
      },
      { label: "Amazon referral fee", pct: 15, note: "Grocery rate, on the whole order." },
      {
        label: "FBA fulfilment and storage",
        pct: 18,
        note: "A light box at a low price point is where FBA hurts most — the five-packs carry the worst of it.",
      },
      { label: "Advertising", pct: 14, note: "The blended figure from the advertising tab." },
      { label: "Returns, coupons and discounts", pct: 5 },
      { label: "Overhead", pct: 8, note: "People, software, insurance — nothing public about this business sizes it." },
    ],
    basis:
      "Costs as a share of revenue, built off the quotes above and Amazon's published fee rates. Every line is a placeholder: the quotes are invented, the fee rates are real but applied to an average rather than to each ASIN, and nothing here has been checked against a seller's own books.",
    source: INVENTED,
  },

  /* 🚧 The Meta ad library LINK is real and anyone can open it. Every FIGURE
     beside it is invented — the library publishes creative and run dates, not
     spend, and no public source reports Amazon ad spend at all. */
  advertising: [
    {
      channel: "Amazon Sponsored Products",
      spend: "$214,000 / mo",
      note: "Implied TACOS 13.6% against $1.58M revenue.",
      source: INVENTED,
    },
    {
      channel: "Meta (Facebook + Instagram)",
      spend: "$46,500 / mo",
      note: "17 creatives live. The ad library shows what is running; it never shows spend.",
      href:
        "https://www.facebook.com/ads/library/?active_status=inactive&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=543395728858281",
      /* The library is real and cited on the NAME; the spend is invented and
         cited on the FIGURE. See the note on AdChannel. */
      linkSource: "meta-ads",
      source: INVENTED,
    },
    {
      channel: "Google Ads (search + shopping)",
      spend: "$9,200 / mo",
      note: "Brand defence mostly — they rank organically for their own name.",
      source: INVENTED,
    },
    {
      channel: "Blended",
      spend: "$269,700 / mo",
      note: "17.1% of estimated revenue, all channels.",
      source: INVENTED,
    },
  ],

  /* 🚧 Ranks and volumes invented. The site-traffic figure in `offAmazon` is
     the one real number on that tab. */
  keywords: [
    { term: "loaded tea", engine: "Amazon", rank: "#3 organic", volume: "74,000 / mo", source: INVENTED },
    { term: "energy drink powder packets", engine: "Amazon", rank: "#11 organic", volume: "138,000 / mo", source: INVENTED },
    { term: "sugar free energy drink mix", engine: "Amazon", rank: "#6 organic", volume: "49,500 / mo", source: INVENTED },
    { term: "the loaded tea shop", engine: "Amazon", rank: "#1 organic", volume: "12,100 / mo", source: INVENTED },
    { term: "loaded tea recipes", engine: "Google", rank: "#8", volume: "33,100 / mo", source: INVENTED },
    { term: "loaded tea near me", engine: "Google", rank: "#14", volume: "27,100 / mo", source: INVENTED },
    { term: "the loaded tea shop", engine: "Google", rank: "#1", volume: "9,900 / mo", source: INVENTED },
  ],

  gaps: [
    "COGS, and therefore margin and profit — MEASURED. The sourcing tab now carries quotes and a margin built from them, and the overview chart draws the profit that falls out; all of it is invented and starred, on instruction, so the demo can show a finished page. Nobody priced a sachet. Nothing here has seen this business's books, and the real version of the page shows none of it until a seller connects.",
    "Ad spend. No public source reports a competitor's Amazon ad spend; anyone quoting one is modelling it. A sponsored-placement read off live search results is the honest substitute and has not been run for this brand.",
    "The 34 unbadged ASINs. Each sells under roughly 50/month, but Amazon publishes no figure, so they are counted as zero rather than estimated.",
    "Which legal entity is which. Amazon's seller record says Champs Tea Shop, Inc; the Facebook page says Tea Time, LLC is responsible for it. Two entities behind one brand is ordinary — an operating company and a marketing one, or a rename — but nothing public says which.",
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
    {
      id: "meta-ads",
      label: "Meta Ad Library — The Loaded Tea Shop",
      href:
        "https://www.facebook.com/ads/library/?active_status=inactive&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=543395728858281",
      read: "2026-09-07",
      detail:
        "Meta publishes every ad a page runs, with its creative and its run dates — genuinely public and worth reading. It does NOT publish spend or impressions for commercial ads, so the spend figure beside it here is invented.",
    },
    {
      id: "facebook",
      label: "Facebook — The Loaded Tea Shop",
      href: "https://www.facebook.com/people/The-Loaded-Tea-Shop/61572174010247/",
      read: "2026-09-08",
      detail:
        "248,967 likes and 134,256 \"talking about this\", read off the public page. It also names a SECOND legal entity — the page says \"Tea Time, LLC is responsible for this Page\", where the Amazon seller record says Champs Tea Shop, Inc. Both are public; which one holds what is not.",
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

  /* The sentences that are about THIS business. They used to be hardcoded in
     DemoSourced.tsx, where the second dossier would have inherited them and
     described itself with another company's history — see `copy` in
     ../dossier.ts. */
  copy: {
    profitChart:
      "Modelled profit, with the timeline on it — hover a dot. The steps are real listing dates and the heights are not: this is today's run rate applied backwards, less the costs on the sourcing tab. Almost the whole line is built in the eight weeks from 30 March 2026, and the brand itself has traded since 2019.",
    timelineLede:
      "The strands are kept together on one line on purpose: four years of building an audience elsewhere, a lone Amazon listing that goes nowhere for ten months, and then the catalogue and the ad spend arriving in the same eight weeks.",
    salesLede:
      "Three packs carry the business; the long tail of single-flavour 5-packs barely registers. These are the 15 largest of 18 priced products, so the bars sum to slightly less than the headline — the remainder is worth about $4,950 a month.",
    advertisingLede:
      "The one genuinely public thing here is Meta's ad library, which publishes every ad a page is running along with its creative and run dates. It does not publish spend, and Amazon publishes nothing at all — so a spend figure is always somebody's model, including ours.",
    trafficLede:
      "The brand is not new — it is new to Amazon, arriving with an audience it spent years building elsewhere, and that is the single most useful thing on this page.",
  },
};
