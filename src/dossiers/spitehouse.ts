/**
 * Spite House Games — a sourced dossier.
 *
 * Built entirely from public data by the VM-amazon-store-scraping skill
 * (Dragon-marketing/skills/VM-amazon-store-scraping) on 2026-09-09. Nobody at
 * this business has spoken to us.
 *
 * 🚨 PUBLISHED FOR REAL, at /brand/spitehouse — not a demo. It is indexable,
 * it carries no demo banner, and a stranger can find it in search. Everything
 * that made it defensible as a demo now has to hold in public: the Estimated
 * badge, a marker on every figure, and a bibliography that names each source.
 * The one INVENTED row on it (freight, on the sourcing tab) is the only thing
 * here that a reader cannot check, and it is the thing to remove first if this
 * page ever has to stand entirely on its own.
 *
 * The type still lives in src/demo/dossier.ts because two demos also use it.
 *
 * ── Why this one is worth a page at a tenth of the size ──────────────────
 * $90K a month against the other two dossiers' $1.58M and $5.66M. It earns its
 * place by being a different SHAPE, and by testing a claim that sounds
 * obviously true and turns out to be half wrong.
 *
 * The claim: a design-led product with almost no production cost is a
 * high-margin business. The printing quotes say the design half is right — a
 * deck of cards is $0.50–1.00 to make. Then Amazon's own fee card takes
 * $2.56 to fulfil a unit that sells for $6.97, which is 37% of the price and
 * more than twice what the printer charges. Cheap to make, expensive to move.
 *
 * ── The seasonality nothing else here has ────────────────────────────────
 * Keepa's badge history makes this brand's year visible: $13,940 in September
 * 2025, $349,150 in December, $62,717 in January. A gag gift is a Christmas
 * business, it loses 82% of itself in one month, and it then rebuilds to a new
 * non-holiday high by August. A single point-in-time pull would have shown
 * none of that.
 *
 * ── And the arithmetic behind the content engine ──────────────────────────
 * At the published Toys & Games click price and conversion rate, an
 * ad-attributed sale costs $5.00–10.00. The average order here is $8.87. So
 * paid search cannot carry this catalogue at any volume — which is not a
 * criticism of the operator, it is the reason the operator built an audience
 * instead. The organic-content strategy is not a preference here; it is the
 * only strategy the unit economics allow.
 */
import { INVENTED, MODELLED, type Dossier } from "@/demo/dossier";

export const spitehouse: Dossier = {
  brand: "Spite House Games",
  what: "Amazon FBA · grown-up gag card games",
  logo: "/demo/spitehouse-logo.png",
  /* 629x433 wordmark on white — closer to square than to a banner, so it takes
     the avatar's whole box rather than being sized on height. */
  logoShape: "square",

  headline: {
    revenue: "$89,988",
    units: "10,150",
    asp: "$8.87",
    catalogue: "16 ASINs",
  },

  deepDive:
    "Spite House Studios LLC sells one joke, well. \"Go F Yourself!\" is Go Fish for adults — a " +
    "deck of cards with a gag on it — and the catalogue is that deck, re-cut for a different " +
    "target each time: Boomers, Mom, Dad, Mom & Dad, Jesus Christ, America in red and blue. " +
    "Sixteen ASINs, ten of them priced, seven carrying a sold badge, and $89,988 a month at an " +
    "$8.87 average order. That is a tenth of the size of the other businesses profiled here, and " +
    "it is the most interesting margin on the site. " +
    "The thesis is that a design-led product with no production cost to speak of is a high-margin " +
    "business, and the printing quotes back the first half: a custom deck runs $0.50–1.00 from " +
    "named suppliers at 300–500 unit minimums. Then Amazon's published fee card charges $2.56 to " +
    "fulfil a small-standard unit under $10 — on a $6.97 hero SKU that is 37% of the price, and " +
    "more than twice what the printer charges. Cheap to make, expensive to move, and the fee card " +
    "is the tax on selling a cheap thing rather than a dear one. " +
    "Keepa's badge history shows what a gag gift's year looks like: $13,940 in September 2025, " +
    "$69,700 in October, $278,800 in November, $349,150 in December — then $62,717 in January. It " +
    "loses 82% of itself in a month and spends the next six rebuilding, reaching a new " +
    "non-holiday high of $96,958 in August. Four Christmases' worth of a normal month, in one " +
    "month. " +
    "The last piece is why the brand is built on content rather than ads, and it is arithmetic " +
    "rather than taste. At the published Toys & Games click price and conversion rate, an " +
    "ad-attributed sale costs $5.00–10.00 against an $8.87 order — a 56–113% ACoS. Paid search " +
    "cannot carry a catalogue priced like this at any volume, so an audience is not the cheaper " +
    "option here, it is the only one. The audience is real and it is one channel. The TikTok account was created on " +
    "2024-11-30 — seven weeks before the first Amazon listing — and now carries 45.4K followers " +
    "and 5.2M likes across 359 videos; Instagram mirrors it at 20K, and the YouTube channel, " +
    "which its own description calls \"literally phoning it in\", has 46 subscribers. The single " +
    "most suggestive date on the page is 20 October 2025, when a post did 549,228 likes: October " +
    "revenue was $69,700 and November was $278,800. " +
    "Two more things complicate the picture, and both are " +
    "checkable. They started running Meta ads on 6 July 2026 — about 32 of them, pointing at the " +
    "store — and Amazon revenue went $61K in June, $80K in July, $97K in August. That is a " +
    "correlation with a date on it rather than a proven cause, and it is the first thing to ask " +
    "them about. And their own store sells the same deck for $12.99 while Amazon sells it for " +
    "$6.97, so the channel doing the volume is the one taking 46% less for the product. " +
    "What the public record cannot tell us is whether the audience converts: the follower counts " +
    "and the visit estimates are real numbers about attention, and nothing public ties either to " +
    "an order.",

  operator: {
    businessName: "Spite House Studios LLC",
    sellerName: "Spite House Games",
    sellerId: "A1JV6NB17MZ485",
    address: ["117 Lexington At. Ste 100", "Harrisonville", "MO", "64701-2444"],
    country: "US",
    storefrontUrl: "https://www.amazon.com/sp?seller=A1JV6NB17MZ485",
    since: {
      value: "2021",
      note:
        "not this catalogue — wouldyoukillhitler.com, an earlier venture whose address still answers this store's support mail. The first ASIN here is 2025-01-20",
      source: "whois",
    },
    feedback: "86% over 66 ratings",
    feedbackNote:
      "a young account — 66 seller ratings against 2,958 product reviews on one listing, 14 of them in the last 30 days",
    source: "keepa-seller",
  },

  figures: [
    {
      label: "Monthly revenue",
      value: "$89,988",
      note: "floor — 9 of 16 ASINs carry no badge and count as zero",
      source: "keepa",
      flag: true,
    },
    { label: "Annualised", value: "$1.08M", note: "run rate, not booked — and this business is seasonal", source: "keepa", flag: true },
    { label: "Units / month", value: "10,150", note: "sum of bracket floors", source: "keepa" },
    { label: "Average selling price", value: "$8.87", note: "the hero SKU is $6.97", source: "keepa" },
    {
      label: "Best month on record",
      value: "$349,150",
      note: "December 2025 — 3.9x the current month",
      source: "keepa-history",
    },
    {
      label: "Worst month after it",
      value: "$62,717",
      note: "January 2026, an 82% fall in four weeks",
      source: "keepa-history",
      flag: true,
    },
    { label: "Catalogue", value: "16 ASINs", note: "10 priced; 7 carry a sold badge", source: "keepa" },
    { label: "First Amazon listing", value: "2025-01-20", source: "keepa" },
    /* 🚨 The same deck, two prices, and the cheaper one is Amazon's. Neither
       figure is modelled: one is the buy box, the other is the price on their
       own product page. */
    { label: "TikTok followers", value: "45.4K", note: "5.2M likes across 359 videos", source: "tiktok" },
    {
      label: "TikTok account created",
      value: "2024-11-30",
      note: "seven weeks before the first Amazon listing — the audience came first",
      source: "tiktok",
    },
    { label: "Instagram followers", value: "20K", note: "245 posts, 16 following", source: "instagram" },
    {
      label: "Their biggest post",
      value: "549,228 likes",
      note: "20 Oct 2025 — the month before revenue quadrupled",
      source: "instagram",
    },
    { label: "YouTube subscribers", value: "46", note: "83 videos, self-described as phoning it in", source: "youtube" },
    {
      label: "Their own store's price",
      value: "$12.99",
      note: "for the same deck Amazon sells at $6.97 — 46% less on Amazon",
      source: "own-store",
      flag: true,
    },
    {
      label: "Own-site visits",
      value: "~12.9K / mo",
      note: "Similarweb reports 38.7K over THREE months, not one — and −39% month on month",
      source: "similarweb",
      flag: true,
    },
    { label: "of which organic search", value: "2,859 / mo", note: "Ubersuggest, Aug 2026, on 220 ranking keywords", source: "ubersuggest" },
    { label: "Google Ads spend, ever", value: "$0", note: "zero paid keywords across 17 months of history", source: "ubersuggest" },
    {
      label: "Cost to print a deck",
      value: "$0.50–1.00",
      note: "published supplier quotes, 300–500 minimum",
      source: "mic",
    },
    {
      label: "Cost for Amazon to ship it",
      value: "$2.56",
      note: "small standard under $10 — 37% of the $6.97 hero SKU",
      source: "fba-rates",
      flag: true,
    },
  ],

  counts: { catalogue: 16, priced: 10, unbadged: 9 },
  firstListed: "2025-01-20",

  /* REAL, from Keepa's monthlySoldHistory on 2026-09-09 — Amazon's own "bought
     in past month" badge as it moved, read at each month end and priced at
     today's buy box. The months before September 2025 are absent because no
     ASIN carried a badge yet, not because nothing sold. */
  salesHistory: [
    { month: "2025-09", units: 2000, revenueCents: 1394000 },
    { month: "2025-10", units: 10000, revenueCents: 6970000 },
    { month: "2025-11", units: 40000, revenueCents: 27880000 },
    { month: "2025-12", units: 50050, revenueCents: 34914950 },
    { month: "2026-01", units: 8999, revenueCents: 6271701 },
    { month: "2026-02", units: 7999, revenueCents: 5574701 },
    { month: "2026-03", units: 4600, revenueCents: 3567400 },
    { month: "2026-04", units: 8100, revenueCents: 6307900 },
    { month: "2026-05", units: 6450, revenueCents: 5718550 },
    { month: "2026-06", units: 7299, revenueCents: 6149401 },
    { month: "2026-07", units: 8950, revenueCents: 8042050 },
    { month: "2026-08", units: 11150, revenueCents: 9695850 },
    { month: "2026-09", units: 10150, revenueCents: 8998850 },
  ],

  /* Every priced ASIN, which is the whole revenue line: these nine sum to
     $89,988.50, the headline exactly. A tenth priced listing (B0H4QVNGLL, at
     $42.76) is Amazon Global Store UK reselling into the US and is left out —
     it is not this operator's offer. */
  asins: [
    { asin: "B0FMGJSSXT", title: "Go F Yourself! — the original Grown Up Go Fish", monthlySold: 8000, priceCents: 697, listed: "2025-01-20" },
    { asin: "B0FLCJSFJP", title: "Go F Yourself Boomers!", monthlySold: 900, priceCents: 1299, listed: "2025-08-06" },
    { asin: "B0GVKVZDR7", title: "Go F Yourself Mom & Dad!", monthlySold: 500, priceCents: 1999, listed: "2026-04-14" },
    { asin: "B0H1XPC49K", title: "Go F Yourself America!", monthlySold: 400, priceCents: 1999, listed: "2026-06-03" },
    { asin: "B0FLCSBZ2V", title: "Go F Yourself Jesus Christ!", monthlySold: 200, priceCents: 1299, listed: "2025-08-06" },
    { asin: "B0GT64XJVT", title: "Go F Yourself Mom!", monthlySold: 100, priceCents: 1299, listed: "2026-04-14" },
    { asin: "B0H1XWG51R", title: "Go F Yourself America Blue!", monthlySold: 50, priceCents: 1299, listed: "2026-06-03" },
    { asin: "B0H1XM57YZ", title: "Go F Yourself America Red!", monthlySold: 0, priceCents: 1299, listed: "2026-06-03" },
    { asin: "B0GT69P836", title: "Go F Yourself Dad!", monthlySold: 0, priceCents: 1299, listed: "2026-04-14" },
  ],

  links: [
    {
      platform: "amazon",
      label: "Amazon store",
      href: "https://www.amazon.com/stores/SpiteHouseGames/page/06BCACAC-F8E6-41CF-9755-4E4CD40B36ED",
      metric: "16 ASINs",
      source: "keepa",
    },
    {
      platform: "website",
      label: "spitehousestudios.com",
      href: "https://spitehousestudios.com/",
      metric: "~12.9K visits / mo",
      source: "similarweb",
    },
    {
      platform: "tiktok",
      label: "@spitehouse_games",
      href: "https://www.tiktok.com/@spitehouse_games",
      metric: "45.4K followers · 5.2M likes",
      source: "tiktok",
    },
    {
      platform: "instagram",
      label: "@spitehouse_games",
      href: "https://www.instagram.com/spitehouse_games/",
      metric: "20K followers",
      source: "instagram",
    },
  ],

  offAmazon: [
    {
      label: "TikTok — @spitehouse_games",
      href: "https://www.tiktok.com/@spitehouse_games",
      value: "45.4K followers · 5.2M likes",
      note:
        "🚨 The engine. 359 videos, 5.2M likes, and the account was created 2024-11-30 — six weeks after the domain and two months before the first Amazon listing. The content came first and everything else was built behind it.",
      source: "tiktok",
    },
    {
      label: "Instagram — @spitehouse_games",
      href: "https://www.instagram.com/spitehouse_games/",
      value: "20K followers · 245 posts",
      note:
        "The mirror, at less than half TikTok's following. Its pinned post — 20 October 2025 — carries 549,228 likes, and Amazon revenue went $69,700 in October to $278,800 in November. Note the handle: @spitehousegames WITHOUT the underscore is an unrelated Seattle studio with 82 followers.",
      source: "instagram",
    },
    {
      label: "Own store — spitehousestudios.com",
      href: "https://spitehousestudios.com/",
      value: "~12.9K visits / mo",
      note:
        "Shopify, 37 products from $5.99 to $39.99, live since 4 April 2025. 🚨 The core deck sells here for $12.99 — the SAME deck is $6.97 on Amazon, 46% less. Whatever the reason, the cheaper channel is the one doing the volume.",
      source: "own-store",
    },
    {
      label: "wouldyoukillhitler.com",
      href: "https://wouldyoukillhitler.com/",
      note:
        "Registered 2021-02-20, and still the support address on every legal page of the newer store (info@wouldyoukillhitler.com). An earlier venture folded into this brand — its game is on the shelf here as \"I Would Kill Hitler\" at $29. So the operator has five years of history, not eighteen months.",
      source: "whois",
    },
    {
      label: "Meta ad library — \"Spite House Games\"",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=spitehousestudios&search_type=keyword_unordered&media_type=all",
      value: "~32 active US ads",
      note:
        "Running since 6 July 2026, freshest 4 September. The creative links SPITEHOUSESTUDIOS.COM at $12.99 and one version reads \"Sold Out Twice. Buy Now.\" The advertiser page name is exactly the Amazon store name.",
      source: "meta-ads",
    },
    {
      label: "YouTube — @SpiteHouseStudios",
      href: "https://www.youtube.com/@SpiteHouseStudios/about",
      value: "46 subscribers · 83 videos",
      note:
        "Joined 2025-06-25, and the channel's own description says it is \"reposting all of my viral TikTok content, literally phoning it in\". 83 videos and 46 subscribers is what a channel looks like when nobody is pretending otherwise.",
      source: "youtube",
    },
    {
      label: "Linktree — SpiteHouseGames",
      href: "https://linktr.ee/SpiteHouseGames",
      note:
        "The TikTok bio's destination, joined April 2025. It routes to a bundle builder, an expansion-notification signup, a Walmart listing for a USAopoly edition of the game, and hello@spitehousestudios.com. No Facebook — the store's own story page says \"I do not fuck with Facebook.\"",
      source: "own-store",
    },
    {
      label: "Organic search — 220 keywords, one page",
      href: "https://spitehousestudios.com/pages/go-fuck-yourself-rules",
      value: "2,859 visits / mo",
      note:
        "🚨 Six of their top ten keywords land on ONE page: the how-to-play rules. It ranks #2 for \"go f yourself card game\" against 27,100 searches a month — but rules-page intent is people who already own the game, and a single URL carrying the whole organic position is a single point of failure.",
      source: "ubersuggest",
    },
  ],

  /* Oldest first. Every dot cites a published record. */
  timeline: [
    {
      date: "2021-02-20",
      title: "wouldyoukillhitler.com registered",
      detail:
        "An earlier venture, five years before this catalogue — and still the support address on every legal page of the current store. Its game sits on the shelf here as \"I Would Kill Hitler\" at $29.",
      track: "web",
      source: "whois",
    },
    {
      date: "2024-10-20",
      title: "spitehousestudios.com registered",
      detail: "Six months before the store opens, and three months before the first Amazon listing.",
      track: "web",
      source: "whois",
    },
    {
      date: "2024-11-30",
      title: "The TikTok account is created",
      detail:
        "18:15 UTC, from TikTok's own createTime field — and corroborated by the timestamp encoded in the user id, 102 seconds apart. Six weeks after the domain, seven weeks before the first Amazon listing: the audience was started first.",
      track: "brand",
      source: "tiktok",
    },
    {
      date: "2025-01-20",
      title: "First two listings go up",
      detail:
        "The original deck and a second listing, on the same day. Neither carries a sold badge for another eight months.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2025-04-04",
      title: "The Shopify store opens",
      detail:
        "First product published, and the Wayback Machine's first capture follows three days later. The deck lists at $12.99 there — the same deck Amazon sells for $6.97.",
      track: "web",
      source: "own-store",
    },
    {
      date: "2025-08-06",
      title: "Boomers and Jesus Christ",
      detail:
        "The first re-cuts of the same joke for a different target, at $12.99 against the original's $6.97.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2025-06-25",
      title: "A YouTube channel appears, and is left to idle",
      detail:
        "83 videos and 46 subscribers, describing itself as \"reposting all of my viral TikTok content, literally phoning it in\". A one-person operation choosing where not to spend effort.",
      track: "brand",
      source: "youtube",
    },
    {
      date: "2025-09-30",
      title: "The badge appears — $13,940",
      detail:
        "Amazon starts printing \"bought in past month\" on the original deck, which means it crossed roughly 50 sales a month. Keepa's history starts here.",
      track: "amazon",
      source: "keepa-history",
    },
    {
      date: "2025-10-20",
      title: "A post does 549,228 likes",
      detail:
        "Their pinned Instagram post, and the closest thing to a cause on this page: October revenue was $69,700, November was $278,800. Correlation with a date on it — the same content runs on TikTok, where the account holds 5.2M likes across 359 videos.",
      track: "brand",
      source: "instagram",
    },
    {
      date: "2025-12-31",
      title: "$349,150 — the Christmas month",
      detail:
        "50,050 units, 3.9x the current month and four times any month since. A gag gift's whole year happens in eight weeks.",
      track: "amazon",
      source: "keepa-history",
    },
    {
      date: "2026-01-31",
      title: "82% of it disappears",
      detail:
        "$62,717. Not a listing problem and not a ranking problem — Christmas ended. The next six months are spent rebuilding.",
      track: "amazon",
      source: "keepa-history",
    },
    {
      date: "2026-04-14",
      title: "Mom, Dad, and Mom & Dad",
      detail:
        "Three more targets in a day, and the first at $19.99 — nearly three times the original's price for the same object.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-06-03",
      title: "America, in red and blue",
      detail:
        "Three listings for an election-season gift. The blue one sells; the red one has yet to carry a badge.",
      track: "amazon",
      source: "keepa",
    },
    {
      date: "2026-04-30",
      title: "Organic search peaks at 8,257 visits",
      detail:
        "Ubersuggest's estimate for the month, almost all of it landing on one how-to-play page. By August it is 2,859 — down 65% from the peak.",
      track: "web",
      source: "ubersuggest",
    },
    {
      date: "2026-07-06",
      title: "Meta ads start",
      detail:
        "~32 ads go live under a page called \"Spite House Games\", pointing at the $12.99 store price. Amazon revenue that month is $80,420, up from $61,494 in June.",
      track: "ads",
      source: "meta-ads",
    },
    {
      date: "2026-08-31",
      title: "$96,958 — a new non-holiday high",
      detail:
        "Above every month except last December, and on a wider catalogue than last December had. Whatever is driving demand is not the holiday.",
      track: "amazon",
      source: "keepa-history",
    },
  ],

  /* REAL QUOTES, for a comparable product — not this brand's costs. Read off
     Made-in-China listings on 2026-09-09: named suppliers, their published
     price ranges and their own minimum orders for custom card printing. The
     range brackets a deck at well under a dollar, which is the point of the
     whole business model. Freight is the one line nobody quoted. */
  sourcing: [
    {
      supplier: "GUANGZHOU MIYI PRINTING CO., LTD",
      region: "Guangdong, CN",
      moq: "500 sets",
      unitCost: "$0.50–1.00 / deck",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Playing_Card_Printing.html",
      source: "mic",
    },
    {
      supplier: "Shenzhen Gold Sun Color Printing Co., Ltd",
      region: "Guangdong, CN",
      moq: "300 pieces",
      unitCost: "$0.70–3.00 / deck",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Playing_Card_Printing.html",
      source: "mic",
    },
    {
      supplier: "Guangzhou Zhongtian Paper Product Co., Ltd",
      region: "Guangdong, CN",
      moq: "500 pieces",
      unitCost: "$0.12–0.99 / deck",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Playing_Card_Printing.html",
      source: "mic",
    },
    {
      supplier: "Tianjin Caile Printing Co., Ltd",
      region: "Tianjin, CN",
      moq: "100 pieces",
      unitCost: "$0.01–0.55 / deck",
      leadTime: "not quoted",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Playing_Card_Printing.html",
      source: "mic",
    },
    {
      /* 🚨 The one made-up line on this page, and it is made up on
         instruction: $0.50 a deck to land, so the margin has a shipping
         number in it at all. No forwarder quoted us, and a card deck's freight
         is genuinely small — but small is not measured. */
      supplier: "Freight and inbound — a placeholder, not a quote",
      region: "CN → US",
      moq: "—",
      unitCost: "$0.50 / deck",
      leadTime: "—",
      source: INVENTED,
    },
  ],

  economics: {
    lines: [
      {
        label: "Cost of goods",
        pct: 14,
        note: "≈$0.75 to print plus $0.50 to land, against an $8.87 average order. The print quote is published; the freight half is ours.",
        source: "mic",
      },
      {
        label: "Amazon referral fee",
        pct: 15,
        note: "Amazon's published Toys & Games rate — a flat 15% with a $0.30 minimum, no price threshold.",
        source: "amazon-fees",
      },
      {
        label: "FBA fulfilment",
        pct: 31,
        note: "🚨 THE BIGGEST LINE. $2.56 for a small-standard unit under $10 on 8,000 units of a $6.97 deck, $3.45 in the $10–50 band on the rest. Amazon charges more to move this product than the printer charges to make it.",
        source: "fba-rates",
      },
      {
        label: "Advertising",
        key: "ads",
        pct: 12,
        note: "TACOS, computed: a $0.70–1.00 Toys & Games click at a 10–14% conversion rate costs $5.00–10.00 per ad-attributed sale — 56–113% ACoS on an $8.87 order. So ads can only ever carry a slice of this catalogue, and 10–20% of units puts the spend at 8–17% of revenue.",
        source: MODELLED,
      },
      /* 🚨 Returns and overhead deliberately absent, as on the other two
         dossiers: the call was that returns are negligible and overhead is a
         later problem. The total is therefore a CEILING on profit. */
    ],
    basis:
      "Three lines are published and cited: the print quotes, Amazon's Toys & Games referral rate and Amazon's FBA rate card. The fourth is computed from category click and conversion benchmarks. Returns and overhead are set to zero on purpose, so the total is a ceiling rather than a profit — and on a $6.97 product with a $2.56 fulfilment fee, the headroom above that ceiling is thinner than it looks.",
    source: MODELLED,
  },

  advertising: [
    {
      channel: "Amazon Sponsored Products",
      spend: "≈ $7.6K–15.2K / mo",
      note:
        "The arithmetic is the finding: a $0.70–1.00 Toys & Games click at a 10–14% conversion rate is $5.00–10.00 per ad-attributed sale, against an $8.87 average order. That is a 56–113% ACoS — paid search cannot carry this catalogue at volume, and the range above assumes it carries only 10–20% of units.",
      source: MODELLED,
    },
    {
      channel: "Meta (Facebook + Instagram)",
      spend: "not estimable",
      note:
        "🚨 The dated fact on this tab. ~32 ads went live from 6 July 2026 under a page called \"Spite House Games\", pointing at the $12.99 Shopify price — and Amazon revenue went $61K in June, $80K in July, $97K in August, its best non-holiday month on record. That is a correlation with a date on it, not a proven cause, and it is the first thing to ask them about. Meta publishes the ads and never the money, and there is no visit count clean enough to price them.",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=spitehousestudios&search_type=keyword_unordered&media_type=all",
      linkSource: "meta-ads",
      activity: "~32 active US ads, first seen 2026-07-06",
      activitySource: "meta-ads",
      source: "meta-ads",
    },
    {
      channel: "Google Ads",
      spend: "$0",
      note:
        "Not \"we could not find any\" — Ubersuggest's paid series reads ZERO for all seventeen months on record, April 2025 to August 2026. They have never bought a search click, in a category where the head terms cost $0.31–0.44. That is a choice, and combined with the Meta ads it says the strategy is attention, not intent.",
      activity: "0 paid keywords in 17 months of history",
      activitySource: "ubersuggest",
      source: "ubersuggest",
    },
  ],

  /* REAL, from Ubersuggest on 2026-09-09: their actual Google positions and
     that tool's volume estimates. They own the branded phrase outright and
     have no position at all on the category head terms — "party card game"
     runs 27,100 a month and peaked at 74,000 last December. */
  keywords: [
    { term: "go f yourself card game", engine: "Google", rank: "#2", volume: "27,100 / mo", source: "ubersuggest" },
    { term: "go f yourself", engine: "Google", rank: "#3", volume: "18,100 / mo", source: "ubersuggest" },
    { term: "go f yourself game", engine: "Google", rank: "#5", volume: "14,800 / mo", source: "ubersuggest" },
    { term: "gfys", engine: "Google", rank: "#12", volume: "5,400 / mo", source: "ubersuggest" },
    { term: "go f yourself cards", engine: "Google", rank: "#5", volume: "2,400 / mo", source: "ubersuggest" },
    { term: "go f yourself card game near me", engine: "Google", rank: "#3", volume: "1,600 / mo", source: "ubersuggest" },
    { term: "how to play go f yourself", engine: "Google", rank: "#2", volume: "1,300 / mo", source: "ubersuggest" },
    { term: "where to buy go f yourself card game", engine: "Google", rank: "#6", volume: "1,000 / mo", source: "ubersuggest" },
    { term: "spite house games", engine: "Google", rank: "#1", volume: "880 / mo", source: "ubersuggest" },
  ],

  /* REAL, read off the listings and from Keepa's rank data on 2026-09-09. Five
     of the SKUs share one parent listing, which is why they share a rank. */
  bestsellers: [
    {
      label: "Go F Yourself! and its four re-cuts",
      rank: "#484 in Toys & Games",
      note: "#26 in Dedicated Deck Card Games · 4.5★ over 2,958 ratings on the original, and the listing shows an 8K+ bought-in-past-month badge.",
      source: "bsr",
    },
    {
      label: "Go F Yourself Mom!",
      rank: "#14,665 in Toys & Games",
      note: "#315 in Dedicated Deck Card Games · 4.6★. The same joke, a narrower target, a thirtieth of the rank.",
      source: "bsr",
    },
  ],

  gaps: [
    "This business's actual COGS, and its returns and overhead. The print quotes are real and published, but they price the CATEGORY, and the $0.50 freight line is a placeholder we were told to put in rather than a quote. Returns and overhead are set to zero, so the margin here is a ceiling.",
    "Ad spend, as a measurement. The figure on the advertising tab is computed from published category benchmarks, not read from anywhere. Their own invoices are the only thing that replaces it.",
    "Amazon keyword rank and search volume. Amazon publishes no volumes and localises search results to the viewer — this machine sits on an Israeli IP, so the US result set is not visible to it at all. Best-seller rank is on the page instead; a US-located run or a Helium 10 reverse-ASIN pull is what would fill the gap.",
    "The 9 ASINs with no badge. Each sells under roughly 50 a month, Amazon publishes no figure for them, and they are counted as zero rather than estimated.",
    "🚨 The brand is split across at least three strings on Amazon — \"Go Fuck Yourself\" (13 ASINs), \"Spite House Studios\" (3) and the store name \"Spite House Games\" (0 matches). A revenue pull that queried only the store name would have returned NOTHING and raised no error. This catalogue was assembled from the manufacturer field and two brand strings, and there may be a fourth nobody thought to try.",
    "🚨 TWO Missouri addresses. Amazon's seller record gives 117 Lexington At. Ste 100, Harrisonville MO 64701; the store's own privacy policy gives 3705 Berger Avenue, St. Louis MO 63109 — 60 miles apart. Both are public, one business, and nothing published reconciles them. A registered-agent lookup at the Missouri Secretary of State is the obvious next step.",
    "Confirmation that the Amazon seller of record is the same entity as the store. On this machine Amazon localises to an Israeli delivery address, which suppresses the merchant block on the listing, so we have the seller record from Keepa and the entity name from the store's terms but never saw them on the same page. A US-located request closes it.",
    "Exact follower counts, and the Instagram start date. Instagram rounds to \"20K\" for every logged-out viewer and serves only the 12 most recent posts, so their first post is bounded at on-or-before 2025-05-21 rather than known; TikTok's 45.4K and 5.2M are its own rounded fields, though the 359 video count is exact. Only the account owner can grant the API token that returns the integers — an Instagram Graph or TikTok Display token, which is to say only they can close this.",
    "Whether the content engine actually sells anything. Follower counts and site visits are real numbers about attention; nothing public connects either to an order on Amazon.",
    "Why the seller feedback score is 86% over only 66 ratings, when one product listing carries 2,958 reviews. A young seller account behind an established-looking catalogue is worth asking about.",
  ],

  sources: [
    {
      id: "keepa",
      label: "Keepa Product API",
      href: "https://keepa.com/#!api",
      read: "2026-09-09",
      detail:
        "The catalogue: 16 ASINs assembled from the manufacturer field (\"Spite House Studios LLC\", 10 hits) and two brand strings (\"Go Fuck Yourself\", 13; \"Spite House Studios\", 3), with each one's monthlySold badge, buy box price, first-listed date and category rank. Revenue and units are computed from these, never reported by anyone. The store name itself returns zero results as a brand — see the gaps list.",
    },
    {
      id: "keepa-seller",
      label: "Keepa Seller API",
      href: "https://keepa.com/#!api",
      read: "2026-09-09",
      detail:
        "The operating business behind the storefront: Spite House Studios LLC, its registered address in Harrisonville, Missouri, its FBA status and a feedback score of 86% over 66 ratings with 14 in the last 30 days.",
    },
    {
      id: "keepa-history",
      label: "Keepa — monthlySoldHistory",
      href: "https://keepa.com/#!api",
      read: "2026-09-09",
      detail:
        "Amazon's \"bought in past month\" badge as it moved, per ASIN, read at each month end and priced at today's buy box. This is the series behind the chart, and it is the only reason this dossier can show a December four times the size of any other month instead of one flat line.",
    },
    {
      id: "bsr",
      label: "The listings themselves — rank and reviews",
      href: "https://www.amazon.com/dp/B0FMGJSSXT",
      read: "2026-09-09",
      detail:
        "Best-seller rank, subcategory rank, star rating and review count. BSR is printed on the listing and is the same number for every viewer, unlike Amazon search results, which are localised — so Amazon keyword positions are missing from this page rather than guessed.",
    },
    {
      id: "mic",
      label: "Made-in-China — card printing quotes",
      href: "https://www.made-in-china.com/products-search/hot-china-products/Playing_Card_Printing.html",
      read: "2026-09-09",
      detail:
        "Published price ranges and minimum orders from named printers for custom card decks: $0.12–3.00 a deck at 100–1,000 unit minimums. These price the CATEGORY, not this business, and freight is in none of them.",
    },
    {
      id: "amazon-fees",
      label: "Amazon — published selling fees",
      href: "https://sell.amazon.com/pricing",
      read: "2026-09-09",
      detail:
        "Amazon's own referral-fee schedule: Toys & Games is a flat 15% with a $0.30 minimum and no price threshold. First-party and not modelled.",
    },
    {
      id: "fba-rates",
      label: "FBA fulfilment rate card, 2026",
      href: "https://warehousingcosts.com/guides/amazon-fba-fulfillment-fees",
      read: "2026-09-09",
      detail:
        "The US FBA fee table effective 15 January 2026 with the 17 April fuel and logistics surcharge: a small-standard 4–6 oz unit is $2.56 under $10 and $3.45 in the $10–50 band. Amazon's own copy sits behind Seller Central, so this is a published mirror rather than the first-party page. Which band a given deck falls in depends on its measured dimensions, which we do not have.",
    },
    {
      id: "own-store",
      label: "spitehousestudios.com — the brand's own store",
      href: "https://spitehousestudios.com/",
      read: "2026-09-09",
      detail:
        "The Shopify store: 37 products from $5.99 to $39.99, the core deck at $12.99, first product published 2025-04-04, and the legal pages that name Spite House Studios, give an address at 3705 Berger Avenue, St. Louis MO 63109, and route support to info@wouldyoukillhitler.com. The store's own story page is signed \"me, Chris\" — a one-person operation in its own words.",
    },
    {
      id: "whois",
      label: "Domain registration records (whois) and the Wayback Machine",
      href: "https://lookup.icann.org/",
      read: "2026-09-09",
      detail:
        "spitehousestudios.com created 2024-10-20 through Wix, registered for six years; first archived capture 2025-04-07. wouldyoukillhitler.com created 2021-02-20, same registrar and nameservers — which is how a five-year operator history behind an eighteen-month-old catalogue becomes visible.",
    },
    {
      id: "tiktok",
      label: "TikTok — @spitehouse_games",
      href: "https://www.tiktok.com/@spitehouse_games",
      read: "2026-09-09",
      detail:
        "45,400 followers, 5,200,000 likes and 359 videos, read out of the page's own data object. The follower and like figures are TikTok's rounded fields; the video count is exact. The account's createTime reads 2024-11-30 18:15:05 UTC, and the timestamp encoded in its user id agrees to within 102 seconds — so the creation date is measured twice, not inferred.",
    },
    {
      id: "instagram",
      label: "Instagram — @spitehouse_games",
      href: "https://www.instagram.com/spitehouse_games/",
      read: "2026-09-09",
      detail:
        "20K followers, 245 posts, 16 following, and a bio reading \"Games Made Out of SPITE / Just One (Hot) Guy Making Games\". Instagram rounds the follower count for logged-out readers and serves only the 12 most recent posts, so the first post is bounded at on-or-before 2025-05-21 rather than known. The pinned post's 549,228 likes were read through Instagram's own login-free embed endpoint, which also confirms the owner. 🚨 @spitehousegames without the underscore is an unrelated Seattle studio.",
    },
    {
      id: "youtube",
      label: "YouTube — @SpiteHouseStudios",
      href: "https://www.youtube.com/@SpiteHouseStudios/about",
      read: "2026-09-09",
      detail:
        "46 subscribers, 83 videos, channel joined 2025-06-25 — YouTube publishes the join date, unlike the other two platforms. The description says the channel is \"reposting all of my viral TikTok content, literally phoning it in\".",
    },
    {
      id: "similarweb",
      label: "Similarweb — spitehousestudios.com",
      href: "https://www.similarweb.com/website/spitehousestudios.com/",
      read: "2026-09-09",
      detail:
        "38.7K visits — and the label on that number is \"Total Visits Last 3 Months\", not per month, so the monthly rate is about 12.9K and the division is ours. Also −39.27% month on month, global rank #741,703, bounce 54.62%, 3.07 pages per visit, and a traffic mix led by Direct at 37.2%. Similarweb is a panel-and-clickstream estimate, not a server-side count.",
    },
    {
      id: "ubersuggest",
      label: "Ubersuggest — spitehousestudios.com",
      href: "https://neilpatel.com/ubersuggest/",
      read: "2026-09-09",
      detail:
        "220 ranking keywords, 2,859 organic visits in August 2026 against a peak of 8,257 in April, domain authority 6, 53 backlinks from 42 domains — and ZERO paid keywords in every one of the seventeen months on record. Six of the top ten keywords land on a single how-to-play page. Ubersuggest is a model built from rank data and clickstream, not a server-side count.",
    },
    {
      id: "meta-ads",
      label: "Meta Ad Library — \"Spite House Games\"",
      href:
        "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=spitehousestudios&search_type=keyword_unordered&media_type=all",
      read: "2026-09-09",
      detail:
        "About 32 active US ads under an advertiser page named exactly like the Amazon store, the earliest started 6 July 2026 and the freshest 4 September. The creative links SPITEHOUSESTUDIOS.COM, quotes $12.99, and one version reads \"Sold Out Twice. Buy Now.\" Meta publishes the ads and the dates; it never publishes the money. The count is what a keyword search rendered, so it is a floor rather than their total.",
    },
    {
      id: "trellis",
      label: "Trellis — Amazon advertising benchmarks by category, 2026",
      href: "https://gotrellis.com/resources/blog/amazon-advertising-benchmarks",
      read: "2026-09-09",
      detail:
        "Aggregated platform data published March 2026: Toys & Games runs a $0.70–1.00 cost-per-click at a 0.35–0.50% click-through and a 10–14% conversion rate. A benchmark for the CATEGORY, and the input that turns this catalogue's $8.87 average order into a 56–113% ACoS.",
    },
    {
      /* 🚨 The third rung: computed by us from the numbered entries above.
         Renders "≈" so it can never be read as somebody else's measurement,
         and never as a fabrication either. */
      id: MODELLED,
      label: "Modelled by us — the arithmetic, and what feeds it",
      detail:
        "Marked with ≈. Two figures here are computed rather than read: (1) Amazon ad spend = units × ad share ÷ conversion rate × cost-per-click, using Keepa's unit floors and Trellis's category benchmarks, with the 10–20% ad share the one assumption we supply; (2) the margin and the profit line on the overview = revenue less the print quotes, Amazon's published referral rate, Amazon's published FBA fee and that modelled ad spend — with returns and overhead deliberately set to zero, which makes it a ceiling rather than a profit. Every input is one of the numbered sources above, so a reader who disagrees with the answer can find the number they disagree with.",
    },
    {
      /* 🚨 The entry every invented figure points at, and deliberately LAST.
         It renders as "*" rather than a number, so putting it first cost the
         real sources their first index. */
      id: INVENTED,
      label: "Invented for this demo — nobody measured this",
      detail:
        "Marked with * wherever it appears, and on this page it is one row: the $0.50 a deck of freight and inbound on the sourcing tab, put there on instruction so that the cost stack has a shipping number in it at all. No forwarder quoted it. Everything else carries a number (somebody published it) or a ≈ (we computed it from those).",
    },
  ],

  copy: {
    profitChart:
      "Hover a dot for what happened there. December 2025 is four times any other month — and January is 82% below it. Everything since has been the rebuild, which reached a new non-holiday high in August.",
    timelineLede:
      "The strands are kept on one line because this brand's story is a calendar: two listings in January 2025 that nobody bought, a badge appearing in September, a Christmas that did $349,150, and then a year spent trying to build a business that does not need December.",
    salesLede:
      "One SKU is the business: the original $6.97 deck is 79% of the units and 62% of the revenue, and the re-cuts at $12.99 and $19.99 are the attempt to sell the same object for more. These nine priced ASINs sum to $89,988 — the headline exactly, because every priced listing is here.",
    advertisingLede:
      "There is only one channel on this tab, and the reason is the arithmetic in it: at the published Toys & Games click price and conversion rate an ad-attributed sale costs $5.00–10.00 against an $8.87 order. Nothing about that gets better with scale, which is why a brand priced like this builds an audience instead — and why the audience, not the ad account, is the thing to ask them about.",
    trafficLede:
      "This is the half the whole strategy rests on, and it is one channel: TikTok carries 45.4K followers and 5.2M likes across 359 videos, Instagram mirrors it at 20K, and YouTube — which the founder's own channel description calls phoning it in — has 46 subscribers. The site numbers are smaller than they first look: Similarweb's 38.7K is a THREE-MONTH total, so the site runs about 12.9K visits a month and is down 39% month on month. 2,859 of those come from Google, almost all landing on one how-to-play page. They have never bought a search click — and they started buying Meta ads on 6 July, the month Amazon revenue turned.",
  },
};
