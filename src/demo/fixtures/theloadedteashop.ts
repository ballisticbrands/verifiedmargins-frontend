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
import { INVENTED, MODELLED, type Dossier } from "../dossier";

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
    /* 🚨 Two third-party estimates of the same site, 13x apart. Neither is a
       server-side count, and the page says so rather than picking the one it
       prefers. The direction is the same either way: this brand's own site is
       a real channel, not a placeholder. */
    {
      label: "Organic search visits",
      value: "71,512 / mo",
      note: "Ubersuggest, Aug 2026 — 13x Similarweb's total-visits read, and the two do not reconcile",
      source: "ubersuggest",
      flag: true,
    },
    {
      label: "Ranking keywords",
      value: "1,707",
      note: "#1 for \"loaded tea\" — 40,500 searches a month",
      source: "ubersuggest",
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
      note:
        "Shopify, and the channel that came first. Similarweb reads 5,324 visits a month; Ubersuggest reads 71,512 from organic search alone. Two estimates of one site, 13x apart, neither of them a server-side count.",
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
      date: "2023-05-05",
      title: "theloadedteashop.com registered",
      detail:
        "Four years after the kitchen the brand dates itself to. The Wayback Machine's first capture of the store follows on 2023-07-23.",
      track: "web",
      source: "whois",
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
      date: "2026-01-31",
      title: "Organic search takes off",
      detail:
        "Ubersuggest's estimate steps from ~10,600 visits in December to ~38,200 in January and ~71,400 by March, as the site takes #1 for \"loaded tea\" — 40,500 searches a month.",
      track: "web",
      source: "ubersuggest",
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
      date: "2026-08-17",
      title: "~310 ads live on Meta",
      detail:
        "Most of them started in the same mid-August week. A second advertiser, \"Alicia N Powell with The Loaded Tea Shop\", runs its own alongside. The library shows only what is ACTIVE, so this is a floor on what they have run.",
      track: "ads",
      source: "meta-ads",
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

  /* REAL QUOTES, for a comparable product — not this brand's costs. Read off
     Made-in-China listings on 2026-09-08: named suppliers, their published
     price ranges and minimum orders for stick-pack drink powder and for the
     printed sachet itself. What they price is the CATEGORY. Freight and duty
     are in none of them. */
  sourcing: [
    {
      supplier: "Guangzhou Marian Health Food Co., Ltd — powder, stick pack",
      region: "Guangdong, CN",
      moq: "500 pieces",
      unitCost: "$1.00–3.00 / unit",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Energy_Drink_Powder_Sachet.html",
      source: "mic",
    },
    {
      supplier: "Shantou Wellfa Print & Pack Co., Ltd — the sachet itself",
      region: "Guangdong, CN",
      moq: "5,000 pieces",
      unitCost: "$0.02–0.30 / sachet",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Energy_Drink_Powder_Sachet.html",
      source: "mic",
    },
    {
      supplier: "Shenzhen Lifeworth Biological Technology Co., Ltd",
      region: "Guangdong, CN",
      moq: "500 boxes",
      unitCost: "$3.43–4.66 / box",
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

  /* 🚧 Those quotes, totalled — which this page was built not to do. See the
     header comment on Economics: it is here on instruction, every figure it
     produces renders a "*", and the block says in words that the real page
     shows nothing here until a seller connects. */
  economics: {
    lines: [
      {
        label: "Cost of goods",
        pct: 10,
        note: "From the published quotes above — roughly $0.10–0.30 a printed sachet plus the powder, against a $35.03 average selling price. A category price, not this brand's cost sheet, and FOB China.",
        source: "mic",
      },
      {
        label: "Amazon referral fee",
        pct: 15,
        note: "Amazon's published Grocery rate above $15. Even the $19.80 five-packs clear that threshold.",
        source: "amazon-fees",
      },
      {
        label: "FBA fulfilment",
        pct: 13,
        note: "$3.45 on a small-standard 4–6 oz five-pack at $19.80 is 17%; $3.78 on a 10–12 oz twenty-pack at $60 is 6%. Blended across this catalogue's mix, from the 2026 rate card.",
        source: "fba-rates",
      },
      {
        label: "Advertising",
        pct: 8,
        note: "TACOS, computed rather than guessed: a $1.20–1.50 Grocery click at a 12–18% conversion rate costs $6.67–12.50 per ad-attributed sale, and carrying 20–40% of 45,050 units that way is 5–10% of revenue. The advertising tab shows the arithmetic.",
        source: MODELLED,
      },
      /* 🚨 RETURNS AND OVERHEAD ARE DELIBERATELY ABSENT, on instruction: the
         call was that returns are negligible here and overhead is a later
         problem. That is why the total below is a CONTRIBUTION margin and a
         ceiling on profit, and why the page never calls it net. */
    ],
    basis:
      "Three lines are published and cited: the supplier quotes, Amazon's referral rate and Amazon's FBA rate card. The fourth — advertising — is computed from category CPC and conversion benchmarks, so a reader can redo it. Returns and overhead are set to zero on purpose, which makes the total a contribution margin rather than a profit, and a ceiling on the real number.",
    source: MODELLED,
  },

  /* 🚧 The Meta ad library LINK is real and anyone can open it. Every FIGURE
     beside it is invented — the library publishes creative and run dates, not
     spend, and no public source reports Amazon ad spend at all. */
  advertising: [
    {
      channel: "Amazon Sponsored Products",
      spend: "≈ $81K–162K / mo",
      note:
        "The arithmetic: a $1.20–1.50 Grocery click at a 12–18% conversion rate is $6.67–12.50 per ad-attributed sale — 19–36% ACoS on a $35.03 order, and worse on the $19.80 five-packs. Carry 20–40% of 45,050 units that way and the spend lands here, at 5–10% TACOS. What we cannot do is COUNT it: Amazon localises search results to the viewer, so their sponsored slots are not visible from outside the US.",
      source: MODELLED,
    },
    {
      channel: "Meta (Facebook + Instagram)",
      spend: "not estimable",
      note:
        "~310 ads are live on their own page and a second advertiser, \"Alicia N Powell with The Loaded Tea Shop\", runs its own — but the two traffic estimates for their site disagree by 13x, so there is no visit count to price. Meta publishes the ads and never the money, and this is one of the cases where a model would be a guess wearing arithmetic.",
      href:
        "https://www.facebook.com/ads/library/?active_status=inactive&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&sort_data[direction]=desc&sort_data[mode]=total_impressions&view_all_page_id=543395728858281",
      linkSource: "meta-ads",
      activity: "~310 active ads on their own page",
      activitySource: "meta-ads",
      source: "meta-ads",
    },
    {
      channel: "Google Ads (search + shopping)",
      spend: "≈ $0",
      note:
        "They do not buy search and do not need to: Ubersuggest finds ONE paid keyword against 1,707 organic ones, worth about one visit a month, while they hold #1 for \"loaded tea\" outright.",
      activity: "1 paid keyword, ~1 paid visit / mo",
      activitySource: "ubersuggest",
      source: MODELLED,
    },
    {
      channel: "Blended",
      spend: "not totalled",
      note:
        "Adding these up would mean pricing the Meta row, and pricing the Meta row would mean inventing the visit count it needs. The Amazon line stands on its own; the rest of this business's spend is not knowable from here.",
      source: MODELLED,
    },
  ],

  /* REAL, from Ubersuggest on 2026-09-08 — their actual Google positions and
     that tool's volume estimates. This is the half of the business Amazon
     cannot see, and it is enormous: #1 for the category's head term. */
  keywords: [
    { term: "loaded tea", engine: "Google", rank: "#1", volume: "40,500 / mo", source: "ubersuggest" },
    { term: "loaded teas", engine: "Google", rank: "#5", volume: "40,500 / mo", source: "ubersuggest" },
    { term: "zero sugar energy drinks", engine: "Google", rank: "#16", volume: "40,500 / mo", source: "ubersuggest" },
    { term: "loaded tea near me", engine: "Google", rank: "#5", volume: "33,100 / mo", source: "ubersuggest" },
    { term: "the loaded tea shop", engine: "Google", rank: "#1", volume: "22,200 / mo", source: "ubersuggest" },
    { term: "loaded tea packets", engine: "Google", rank: "#3", volume: "3,600 / mo", source: "ubersuggest" },
    { term: "loaded tea recipes", engine: "Google", rank: "#4", volume: "1,300 / mo", source: "ubersuggest" },
    { term: "the loaded tea shop vs herbalife", engine: "Google", rank: "#2", volume: "90 / mo", source: "ubersuggest" },
  ],

  /* REAL, read off the listings on 2026-09-08. The three Variety packs share
     one parent listing, which is why they share a rank and a review count. */
  bestsellers: [
    {
      label: "Energy Drink Mix Sticks, Variety 20 Pack",
      rank: "#718 in Grocery & Gourmet Food",
      note: "#32 in Energy Drinks · 4.4★ over 1,156 ratings. The 10 and 40 packs share this parent listing.",
      source: "bsr",
    },
    {
      label: "Founder's Favorites 5 Pack",
      rank: "#1,220 in Grocery & Gourmet Food",
      note: "#15 in Powdered Soft Drink Mixes · 4.0★ over 1,074 ratings.",
      source: "bsr",
    },
    {
      label: "Mom Mode Collection 5 Pack",
      rank: "#3,671 in Grocery & Gourmet Food",
      note: "#40 in Powdered Soft Drink Mixes · 4.0★ over 280 ratings, four months after launch.",
      source: "bsr",
    },
    {
      label: "Frog Spit 5 Pack",
      rank: "#15,852 in Grocery & Gourmet Food",
      note: "#170 in Powdered Soft Drink Mixes · 4.0★ over 72 ratings. The single-flavour tail.",
      source: "bsr",
    },
    {
      label: "Caffeine-Free Variety",
      rank: "#40,369 in Grocery & Gourmet Food",
      note: "#415 in Powdered Soft Drink Mixes · 4.0★ over 183 ratings — and the listing reads CURRENTLY UNAVAILABLE, which is exactly what the sold badge with no buy box implied.",
      source: "bsr",
    },
  ],

  gaps: [
    "This business's actual COGS, and its returns and overhead. The sourcing tab carries real published quotes for a comparable sachet, and Amazon's referral and FBA rates are its own — but a category price is not a cost sheet and freight and duty are in none of the quotes. Returns and overhead are set to ZERO on purpose, so the margin here is a contribution margin and a ceiling: the real number is lower by whatever those two cost.",
    "Ad spend, as a measurement. The Amazon line is MODELLED from published category CPCs and conversion rates and the formula is on that tab; Meta is not modelled at all, because there is no visit count to price. Their own invoices are the only thing that replaces either.",
    "The 34 unbadged ASINs. Each sells under roughly 50/month, but Amazon publishes no figure, so they are counted as zero rather than estimated.",
    "Which legal entity is which. Amazon's seller record says Champs Tea Shop, Inc; the Facebook page says Tea Time, LLC is responsible for it. Two entities behind one brand is ordinary — an operating company and a marketing one, or a rename — but nothing public says which.",
    "Which of the two site-traffic estimates to believe. Similarweb says 5,324 visits a month, Ubersuggest says 71,512 from search alone. Both are models; the gap is 13x and nothing public settles it.",
    "When this brand actually started. The founder story says a 2019 kitchen; the domain was registered 2023-05-05 and first archived that July. A rebrand, an earlier domain, or a loose retelling — all ordinary, none of them established.",
    "Amazon keyword rank and search volume. Amazon publishes no volumes and localises search results to the viewer, so the US result set is not visible from here. Best-seller rank is on the page instead.",
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
      id: "ubersuggest",
      label: "Ubersuggest — theloadedteashop.com",
      href: "https://neilpatel.com/ubersuggest/",
      read: "2026-09-08",
      detail:
        "Google positions, search volumes and traffic history: 1,707 ranking keywords, ~71,512 organic visits in August 2026, #1 for \"loaded tea\", and one paid keyword against all of that. Ubersuggest is a model built from rank data and clickstream, not a server-side count — and it disagrees with Similarweb about this site by 13x.",
    },
    {
      id: "bsr",
      label: "The listings themselves — best-seller rank and reviews",
      href: "https://www.amazon.com/dp/B0GVG8YXKY",
      read: "2026-09-08",
      detail:
        "Best-seller rank, subcategory rank, star rating and review count, read off each product page — including the Caffeine-Free listing reading CURRENTLY UNAVAILABLE. BSR is printed on the listing and is the same for every viewer, unlike Amazon search results, which are localised: from outside the US the US result set is not visible, so Amazon keyword positions are missing from this page rather than guessed.",
    },
    {
      id: "whois",
      label: "Domain registration record — theloadedteashop.com",
      href: "https://lookup.icann.org/",
      read: "2026-09-08",
      detail:
        "Created 2023-05-05 through Squarespace Domains. The brand's own founder story dates the business to a 2019 kitchen; the domain is four years younger, and the Wayback Machine's first capture is 2023-07-23.",
    },
    {
      id: "mic",
      label: "Made-in-China — supplier listings",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Energy_Drink_Powder_Sachet.html",
      read: "2026-09-08",
      detail:
        "Published price ranges and minimum orders from named suppliers for stick-pack drink powder and printed sachets. These price the CATEGORY, not this business, and are FOB China with no freight or duty in them.",
    },
    {
      id: "amazon-fees",
      label: "Amazon — published selling fees",
      href: "https://sell.amazon.com/pricing",
      read: "2026-09-08",
      detail:
        "Amazon's own referral-fee schedule: 8% for Grocery and Gourmet items at $15 or less and 15% above it. First-party and not modelled.",
    },
    {
      id: "fba-rates",
      label: "FBA fulfilment rate card, 2026",
      href: "https://warehousingcosts.com/guides/amazon-fba-fulfillment-fees",
      read: "2026-09-08",
      detail:
        "The US FBA fee table effective 15 January 2026 with the 17 April fuel and logistics surcharge: small standard 4–6 oz in the $10–50 band is $3.45 a unit, 10–12 oz is $3.78. Amazon's own copy sits behind Seller Central, so this is a published mirror rather than the first-party page.",
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
      id: "trellis",
      label: "Trellis — Amazon advertising benchmarks by category, 2026",
      href: "https://gotrellis.com/resources/blog/amazon-advertising-benchmarks",
      read: "2026-09-08",
      detail:
        "Aggregated platform data published March 2026: Grocery & Gourmet Food runs a $1.20–1.50 cost-per-click at a 0.40–0.55% click-through and a 12–18% conversion rate. A benchmark for the CATEGORY, not a reading of this advertiser.",
    },
    {
      /* 🚨 The third rung: computed by us, from the numbered entries above.
         Renders "≈" rather than a number so it can never be read as somebody
         else's measurement, and never as a fabrication either. */
      id: MODELLED,
      label: "Modelled by us — the arithmetic, and what feeds it",
      detail:
        "Marked with ≈. Two figures on this page are computed rather than read: (1) Amazon ad spend = units × ad share ÷ conversion rate × cost-per-click, using Keepa's unit floors and Trellis's category CPC and conversion benchmarks, with the 20–40% ad share the one assumption we supply; (2) the contribution margin and the line on the overview chart = revenue less the supplier quotes, Amazon's published referral rate, Amazon's published FBA fee and that modelled ad spend — with returns and overhead deliberately set to zero, which makes it a ceiling rather than a profit. Meta spend is NOT modelled: there is no visit count to price, so the row says so instead. Every input is one of the numbered sources above.",
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

  /* The sentences that are about THIS business. They used to be hardcoded in
     DemoSourced.tsx, where the second dossier would have inherited them and
     described itself with another company's history — see `copy` in
     ../dossier.ts. */
  copy: {
    profitChart:
      "Modelled contribution, with the timeline on it — hover a dot. The steps are real listing dates and the deductions are real fee rates; what is ours is the assumption that today's run rate applied back then. Returns and overhead are set to zero, so the line is a ceiling. Almost all of it is built in the eight weeks from 30 March 2026, and the brand itself has traded since 2019.",
    timelineLede:
      "The strands are kept together on one line on purpose: four years of building an audience elsewhere, a lone Amazon listing that goes nowhere for ten months, and then the catalogue and the ad spend arriving in the same eight weeks.",
    salesLede:
      "Three packs carry the business; the long tail of single-flavour 5-packs barely registers. These are the 15 largest of 18 priced products, so the bars sum to slightly less than the headline — the remainder is worth about $4,950 a month.",
    advertisingLede:
      "Two things here are counted rather than modelled: Meta's ad library says ~310 ads are live on their own page, and Ubersuggest says they buy exactly one paid keyword. Neither source publishes money — Meta never does, Amazon publishes nothing at all — so the dollar column is the one part of this tab that is ours.",
    trafficLede:
      "The brand is not new — it is new to Amazon, arriving with an audience it built elsewhere, and that is the single most useful thing on this page. It holds #1 on Google for \"loaded tea\" against 40,500 searches a month, on 1,707 ranking keywords and one paid one. The two traffic estimates for its own site disagree by 13x, and the page shows both rather than choosing.",
  },
};
