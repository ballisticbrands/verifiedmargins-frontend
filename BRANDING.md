# VerifiedMargins — Brand Guide

The visual and verbal system for **verifiedmargins.com**. This is the
authority for the app, the public profile pages and the marketing
surface.

> **`Dragon-marketing/BRANDING.md` does not apply here.** VerifiedMargins
> is deliberately not a Dragon product — no Forest/Lime, no pixel dragon,
> no `get` prefix, no Clash Display. That file is the guide for the
> Dragon family and points here for VM.

---

## 1. The idea

**An audit that behaves like a social network.**

Everything on this site is a claim about someone's money, and the whole
product is the difference between a claim we checked and a claim we
didn't. So the design has one job before it has any other: make
*verified* and *estimated* impossible to confuse, at a glance, on a
phone, in a screenshot.

Three references, and precisely what we take from each:

| Reference | What we take | What we don't |
|---|---|---|
| **Trustpilot** | A single green mark that means *checked*, used sparingly enough to still mean it. Official without being corporate. | Their brightness and their star ratings. We are not a review site. |
| **X / Reddit** | Density. Handles over real names. A dev-ish, information-first surface that assumes the reader is technical and in a hurry. | Karma, engagement chrome, gamification. |
| **An accounting statement** | Numbers in monospace with aligned columns. Figures that look measured rather than marketed. | Beige seriousness. This is still a social product. |

The resulting feel: **quiet, dense, and green only where it has been
earned.**

---

## 2. Logo

The mark is `VM` — a **check drawn as the V**, a plain **M** beside it.
Monoline, 50-unit stroke, round caps and joins, no fill, no gradient.

| File | Use |
|---|---|
| `public/logo.svg` | Default. Green check + `#16181d` M. |
| `public/logo-on-dark.svg` | Dark surfaces. Green check + white M. |
| `public/logo-512.png` | OG image, raster fallback. |
| `public/favicon-32.png`, `public/apple-touch-icon.png` | Browser/OS icons. |

**Rules**

- **Never recolour the check.** The green is the brand; a mono or
  inverted check breaks the one association the product is built on.
- **Minimum size 20px**; below that the two strokes merge visually. Use
  the check alone as a favicon-scale mark if you must go smaller.
- **Clear space** = the stroke width (50 units, i.e. ~10% of the mark's
  height) on every side.
- **Never use the lockup as an inline icon.** The verified badge uses a
  plain check glyph, not the logo — otherwise every badge reads as a
  logo and the logo stops being one.
- No drop shadows, no gradients, no outlines, no rotation.

---

## 3. Colour

Four colours: **green, black, white, light grey.** The green is the
only chroma in the entire system, which is what makes it carry meaning.

### Light (default)

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--background` | `#ffffff` | Page. White, not light grey — see below | — |
| `--foreground` | `#16181d` | Primary text, the logo's M | 17.4:1 on white |
| `--muted` | `#f2f4f7` | Section fills, table zebra, hover | — |
| `--muted-foreground` | `#5c636e` | Help text, metadata, handles | 6.4:1 on white |
| `--border` | `#d9dde3` | Hairlines. 1px, everywhere | — |
| `--card` | `#ffffff` | Card surface (border, not shadow) | — |
| `--accent` | `#16181d` | **Primary actions** — see §3.1 | — |
| `--accent-foreground` | `#ffffff` | Text on `--accent` | — |
| `--verified` | `#10683f` | The brand green. Verified state only | 6.8:1 on white |
| `--verified-strong` | `#0d5433` | Hover/press on green surfaces | — |
| `--verified-tint` | `#e8f3ed` | Verified badge fill, verified row wash | green on tint = 6.0:1 |
| `--estimated` | `#5c636e` | Estimated state — grey, never amber | 6.4:1 on white |
| `--danger` | `#b42318` | Errors only. Never "a bad number" | 5.9:1 on white |

### Dark — specified, not shipped

**The site is light-only today.** `globals.css` carries no
`prefers-color-scheme: dark` override, and `color-scheme: light` is set
so native controls (dropdowns, scrollbars, autofill) paint light too —
otherwise a visitor on a dark OS gets a dark `<select>` hanging off a
white page, which reads as a rendering bug.

The reason is not that dark is wrong for this audience — half of it
lives in dark UIs, and the X/Reddit reference points that way. It is
that a scheme which silently follows the OS is a scheme **nobody
chose**: half of visitors were seeing a dark product page while this
guide, the OG cards and every screenshot showed a light one. Dark comes
back with an explicit toggle, not with a media query.

The palette below is measured and ready for that day. Restoring it is
pasting this table into a `[data-theme="dark"]` block — not re-deriving
it.

| Token | Hex | Note |
|---|---|---|
| `--background` | `#101216` | Near-black, slightly cool. Not `#000` |
| `--foreground` | `#e9ecf1` | |
| `--muted` | `#1c1f26` | |
| `--muted-foreground` | `#a2abb8` | 7.4:1 on background |
| `--border` | `#2b3038` | |
| `--card` | `#15181d` | Lifted one step off the page |
| `--accent` | `#e9ecf1` | Inverts with the surface |
| `--accent-foreground` | `#101216` | |
| `--verified` | `#3fbb7f` | 7.7:1 on background |
| `--verified-tint` | `#12271d` | |
| `--estimated` | `#a2abb8` | |

> ⚠️ **`#10683f` fails on dark.** It measures **2.6:1** against
> `#101216` — unreadable. The green *must* lighten in dark mode. This is
> the single easiest way to ship an inaccessible verified badge, and it
> looks fine on the designer's light-mode screen. It is also the one
> line to re-read before dark mode is ever switched back on.

**Why a white page rather than a light-grey one.** A grey page only
earns its keep when white cards float on it — that is the
dashboard/directory pattern. This layout separates with **hairlines, not
surfaces** (§7), so a grey page would buy no separation while forcing a
re-decision of two other tokens: `--card` would have to stop being
white, and `--muted` could no longer double as the section fill because
it would equal the page. White page, grey fills, 1px borders is the
version that holds together.

### 3.1 The green discipline — the one rule that matters

**Green means verified. It does not mean "brand colour", and it does not
mean "primary button".**

Allowed:
- The logo's check
- The verified badge, and the hairline/wash on a verified profile card
- A verified figure's label ("Verified margin")
- Success confirmations that report a *verification* ("Account
  connected — your numbers are verified")

Not allowed:
- Primary CTAs. **Buttons are `--accent` (near-black), not green.**
- Estimated-profile chrome, anywhere, in any tint
- Headings, links, nav, focus rings, decorative accents
- Charts, unless the series *is* verified data next to estimated data

This is the point of tension with Trustpilot, and it is deliberate: they
paint the site green because green is their brand. If we paint the
Publish button, the nav underline and the section headings green, then a
reader scanning a page sees green everywhere and the badge stops being a
signal. **Scarcity is what makes it legible.** When in doubt, use ink.

---

## 4. Typography

**Two faces, and the split is words vs. figures.**

```css
/* Words: headings, body, labels, buttons, nav, bios, breadcrumbs */
--font-sans: "Inconsolata", "Inconsolata Fallback", sans-serif;

/* Figures: every number, code and identifier on the site */
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
             "Liberation Mono", monospace;
```

Both are monospaced, so the page holds one register — the terminal/ledger
register this product lives in. But they are **not the same face**, and
that difference is the whole point: a figure should read as a quantity
lifted out of the prose around it, not as more prose.

🚨 **Inconsolata must never lead `--font-mono`.** It did for a day. Every
number on the site rendered in the text face, the two stacks were one
stack wearing two names, and nothing looked broken — which is why it
survived a review. If you are changing these variables, check a figure
and a sentence side by side, not the variable declarations.

### 4.1 Words — Inconsolata

The face TrustMRR sets its whole page in, and the reason a founder who
has seen that page recognises this one as the same kind of object. It is
the one deliberate web font here; everything else is native.

Everything that is language takes it: headings, body, help text,
buttons, nav, badges, breadcrumbs, bios, and the LABEL half of every
data row (`REVENUE (30D)` is a label; `$164K` is not).

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Page title (`h1`) | 1.6rem | 700 | −0.02em |
| Section (`h2`) | 1.05rem | 650 | −0.01em |
| Body | 0.95rem | 400 | 0 |
| Label | 0.875rem | 550 | 0 |
| Help / meta | 0.8125rem | 400 | 0 |
| Badge | 0.75rem | 550 | +0.01em |

Line-height **1.55 for prose**, **1.35 for data rows**. Prose caps at
**62ch** — a mono runs wider per character than a sans, so that cap does
more work here than it would elsewhere.

### 4.2 The fallback face

```css
@font-face {
  font-family: "Inconsolata Fallback";
  src: local("Arial");
  ascent-override: 76.59%;
  descent-override: 16.94%;
  line-gap-override: 0%;
  size-adjust: 112.16%;
}
```

Local Arial re-cut to Inconsolata's exact metrics, so when the real face
swaps in **not one line reflows**. Without it a profile visibly jumps a
beat after paint — on the page a stranger judges us by, in the first
second they see it. Do not remove this to "simplify".

Inconsolata is one blocking request to fonts.googleapis.com +
fonts.gstatic.com, preconnected in `index.html`. That is a real cost on
the critical path of a page people open from a DM. If it ever proves too
expensive — a slow region, an outage, a privacy objection — **self-host
the woff2 subset**. The typeface is part of the identity; the delivery
mechanism is not.

### 4.3 Figures — the platform's own mono

Everything that is a quantity, a code or an identifier:

- revenue, profit, COGS, fees, ad spend
- margin %, ROI, TACOS
- units, orders, SKU count, brand count
- currency codes (`USD`), market codes (`US · CA`), dates, the FX stamp
- chart axis ticks and tooltip figures
- the `@handle`, and estimated profiles' opaque ids (`/e/8x2k9`) — an
  identifier is a token, not a name
- **number inputs.** A figure being typed is still a figure.

Always with `font-variant-numeric: tabular-nums` and `"tnum" 1`: digits
share one advance width, so columns align and a changing value never
reflows its own row.

It does **not** apply to headings, bios, help text, buttons, badges, or
a number that appears inside a sentence ("Eight years, two people").

**Writing numbers**

- Round hard: `$1.2M`, `$840K`, `34.1%`. Never `$1,234,567.89` on a
  profile — precision we didn't verify is a lie about our confidence.
- Currency as prefix symbol, code only when ambiguity is possible:
  `$1.2M` alone, `$1.2M USD` next to `€900K EUR`.
- Negatives get a minus sign, not parentheses and **not red**. Red means
  error. A thin margin is not an error.
- Every headline figure carries its basis in `--muted-foreground`
  beneath it: *"12 months to Jul 2026 · verified"*.

---

## 5. Verification states

The two states are the product. They must differ in **shape, colour and
word** — never colour alone (colour-blind readers, greyscale
screenshots, and the fact that a screenshot is how this product will
mostly be seen).

**Verified**

- Pill, `--verified-tint` fill, 1px `--verified` border
- Check glyph + the word **Verified**, `--verified` text
- On the profile: a 2px green rule above the metrics block

**Estimated**

- Pill, **no fill**, 1px `--border`
- Clock glyph + the word **Estimated**, `--estimated` text
- No green anywhere in the component
- The metrics block gets a dotted top rule, not a solid one

**Rules**

- A badge never appears without its explainer within reach — a tooltip,
  or a link to the "what's the difference" copy. A badge that can't be
  interrogated is decoration.
- Estimated pages never borrow verified chrome. If the two are
  distinguishable only by a small emoji, a screenshot of an estimated
  page reads as us asserting a verified number.
- Never invent a third badge colour. A future state ("self-reported",
  "ops-reviewed") gets a word and a shape, not amber.

---

## 6. Anonymity, avatars and handles

Most profiles will be anonymous, and many will never upload a picture.
A wall of empty circles reads as an abandoned product, so the *default*
has to look deliberate.

- **No silhouette placeholders.** Ever. They read as "missing".
- **Deterministic monogram avatar**: the first two characters of the
  handle, system-sans 600, on a flat background chosen by hashing the
  handle across a fixed set of in-palette greys plus two desaturated
  greens. Same handle → same avatar, forever.
- **Circle on a profile, square in a list.** A profile header is a person, so
  it takes a large circular avatar (5.5rem) — the convention every social
  profile uses, and this product is a profile network. A leaderboard row or a
  card is a listing, so it keeps the 6px-radius square: squares read as
  entries in a directory, and mixing the two shapes is what tells a reader
  which of the two they are looking at.
- The handle is mono and always prefixed: `@paramint`. It is the
  identity; the display name is optional decoration above it.
- An uploaded avatar sits on `--muted` with a 1px `--border`, because a
  transparent PNG on white is indistinguishable from no picture at all.

---

## 7. Layout and density

Dense, not airy. This is a tool, and the reader is scanning.

- **4px spacing scale.** Section rhythm 24/32px, not 80px.
- **Hairlines, not shadows.** 1px `--border` separates everything.
  Elevation exists only for the `<dialog>` backdrop.
- **Radius 6px** for controls and cards, `999px` for pills, 10px for
  modals. Nothing else.
- **Cards are bordered surfaces**, never floating.
- **Tables and metric rows over cards** wherever a list is comparable —
  a directory of businesses is a table, not a gallery.
- Content column 62ch for prose; data views take the full width.
- Focus is always visible: 2px `--accent` outline, 1px offset. Never
  `outline: none`.

### 7.1 The chrome: a left rail, and a breadcrumb inside the header

Reading order down the page:

1. **Left rail** — the wordmark and the site's navigation, sticky.
2. **The page.** On a profile that begins with the breadcrumb, on the
   same line as the first action button, directly above the name and
   picture.

There is no bar across the top. Two versions of one were tried and both
were wrong: full-bleed above everything, it sat over our own wordmark
and read as browser chrome; boxed at the head of the content column, it
was a filled, bordered object competing with the profile header
immediately beneath it.

**Breadcrumbs are plain text** — no fill, no border, `--muted-foreground`
at 0.8125rem. Orientation, not an object: the quietest thing on the page
you can still read. The `›` separators are the exception, and carry
`--foreground`; at this size a `--border`-coloured glyph is a colour
chosen for 1px rules, and a separator you have to hunt for is not
separating anything.

**Profile pages only.** A profile is the one page strangers arrive at
cold, from a link, with no idea what site they are on;
`VerifiedMargins › Founder › Acme Brands` answers that in one line and
gives them two ways further in. Every other page was reached through our
own navigation, which already says where they are — a breadcrumb there
is furniture.

The breadcrumb lives in the shared page's `breadcrumb` slot rather than
in the shell, because the header owns the alignment: its left column
stacks crumb over identity, and the actions column top-aligns with that
column rather than with the avatar. That is what puts **Share on the
breadcrumb's line**.

#### The currency picker — built, wired, not shown

`SHOW_CURRENCY_PICKER` in `src/currency.tsx` is `false`. Everything
behind it is live: the preference persists per reader, and the profile
and leaderboard both refetch against it, so today every reader gets the
USD default. Flip the flag to ship it — there is nothing else to do, and
nothing about the context, the persistence or the currency props is dead
code to be cleaned up in the meantime.

When it does show, it belongs in the chrome rather than on the page.
Every figure is stored in the currency it was earned in and converted
only at render, so a seller with a EUR marketplace and a USD one has no
single native currency. "Which currency am I reading this in?" is a
property of the **reader**, not of the profile.

The bar is deliberately quiet — 0.8125rem, `--muted-foreground`. If it
ever competes with the profile header for attention, it is wrong.

---

### 7.2 "Add your business" — the one call to action

The rail ends in a **button**, not a link: `Add your business` signed out,
`Add another business` signed in. It is the only filled, accent-coloured
control in the navigation, and there is exactly one of it on the site.

It opens a dialog rather than navigating. What makes someone want to add
their business is a profile or a leaderboard they are looking at, and
sending them to a signup page is where they reconsider — the flow opens
on top of the thing that convinced them. `/verify` still resolves (it is
in the sitemap and the reserved-username list) and does the same thing.

Shape of the dialog: a fixed header, a scrolling body, and a **footer
that does not move**. On a phone this form is taller than the screen,
and an action button that scrolls away is one the reader has to go
looking for at the moment they had decided to press it. The footer
button is **disabled by default** — that is the first state most readers
see, so it has to look deliberately unavailable rather than broken.

Two things about the copy that are brand rules, not wording:

- **The weakest method says so.** "Business analytics screenshot" is
  labelled *Poor verification* at the moment someone picks it, not in
  small print afterwards. A reader deciding whether to believe a profile
  is the entire product; a method chooser that flatters every option is
  how that gets sold off a click at a time.
- **The live pill pulses because it is a live claim.** `342 visitors
  today` with a pulsing `--verified` dot. 🚧 The number is a constant
  today. If it ever stops being live, drop the dot — a heartbeat on a
  hardcoded figure is a lie told in CSS.

---

## 8. Motion

Almost none. Fades and 120–160ms colour transitions on hover/press;
nothing that moves a number. A figure that animates while you read it
undermines the one thing we're selling. No parallax, no scroll-jacking,
no counting-up statistics.

`prefers-reduced-motion: reduce` disables all of it.

---

## 9. Voice

Plain, precise, unhurried. The register is a good auditor, not a growth
marketer.

- **Say what's verified and what isn't**, in the same breath. "Revenue
  and fees come straight from Amazon. Cost of goods is a percentage the
  seller supplied, so margin is modelled, not verified."
- **Sentence case** for headings. No exclamation marks.
- **Numbers over words**: "12 months", not "the last year".
- **Never oversell the verification.** No "guaranteed", no "100%
  accurate", no "certified".
- Second person for the seller ("your numbers"), third for the subject
  of a profile ("this business").
- Em dashes over semicolons.

---

## 10. Applying it

The tokens above live in [`src/globals.css`](src/globals.css). Today
that file carries a `⚠️ PLACEHOLDER greys` banner and a near-black
`--accent` chosen precisely because a real accent was still undecided —
**that banner comes out with the first commit that implements this
guide**, and `--verified` / `--estimated` / `--verified-tint` get added
alongside.

Two things to know before editing:

1. **The shared package renders against these custom properties.**
   `@ballisticbrands/frontend-shared` builds `<Button>` as
   `bg-[var(--accent)]`, `<Input>` as `border-[var(--border)]`, and so
   on. Dropping a token doesn't error — it silently renders a button
   with no surface. Grep before removing:
   `grep -rhoE "var\(--[a-z-]+\)" node_modules/@ballisticbrands/frontend-shared/dist/`
2. **Metric styling belongs in one place.** Add a `.vm-num` class (or a
   `[data-num]` attribute) carrying the mono stack + `tabular-nums`, and
   use it everywhere a figure renders. Per-component font stacks will
   drift within a month.

Tailwind: extend `theme.fontFamily` with `mono` and the colour tokens in
[`tailwind.config.js`](tailwind.config.js) so utilities resolve to the
same variables rather than to literals.

---

## 11. Don'ts

- Don't use green for anything that isn't verification (§3.1).
- Don't ship `#10683f` on a dark background.
- Don't distinguish verified from estimated by colour alone.
- Don't set a business number in the sans stack.
- Don't add a web font, a gradient, or a drop shadow.
- Don't use red for a low margin.
- Don't import Dragon assets, colours or type — different product,
  different promise.
- Don't animate a figure.
