# BUILD_NOTES — narrativedriven.org rewrite

Source: Build Brief 2 of 2, v1.2 (2026-05-18).
Branch target: `site-rewrite-ndd-probe` (not yet created — awaiting Sam confirmation per §V).

## §0.2 Pre-build environment

- **Framework**: VitePress 1.6.4
- **Package manager**: pnpm@10.15.0 (workspace root one level up; site is `@onauto/narrativedriven-site`)
- **Node**: >=20 (engines)
- **Theme**: custom VitePress theme at `site/.vitepress/theme/`
- **OG pipeline**: shared `@beonauto/og` (github:BeOnAuto/og#v0.3.0), driven by `site/og.config.js`. Per shared OG memory, do not add npm dep — already consumed by git URL.
- **Analytics**: `posthog-js` ^1.364.5 in deps
- **Source dir**: `site/docs/` (VitePress `srcDir: "docs"`)
- **Deployment**: GitHub Actions workflow under `.github/workflows/` (need to inspect for target)
- **Clean install + build**: PASS (vitepress build 2.34s, no errors)

## §0.1 Existing-site inventory

Current pages live under `site/docs/`:

```
index.md                              (home — VitePress hero layout)
what-is-ndd.md
what-makes-a-narrative-buildable.md
how-it-works.md
for-practitioners.md
community.md
explanation/
  index.md, cohesion.md, data-completeness.md, one-model-three-views.md,
  origin-story.md, progressive-control.md, progressive-disclosure.md,
  spec-dialect.md, standing-on-shoulders.md
guides/
  index.md, build-concert-platform.md, collaborative-sessions.md,
  first-narrative.md, narratives-to-code.md, prompting-ai.md,
  review-a-narrative.md, structuring-narratives.md
reference/
  index.md, dsl.md, glossary.md, moment-types.md
public/  (favicon, logos, llms.txt, OG images, animations, feature illustrations)
```

### Mapping to brief site map (§2.1)

| Brief target | Existing equivalent | Action |
|---|---|---|
| `/` (homepage) | `docs/index.md` (VitePress hero) | **Rewrite** per §2.3 |
| `/what-is-ndd` | `docs/what-is-ndd.md` | **Rewrite** per §2.4 (current content is different) |
| `/using-ndd-without-auto` | none | **New** per §2.5 |
| `/reference` | `docs/reference/index.md` (+ glossary, moment-types, dsl) | **Rewrite** `reference/index.md` per §2.6; keep sub-pages |

### Existing pages the brief says "may be reused" (§0.1)

The brief mentions:
- "The Structure (Domains, Narratives, Scenes, Moments)" — closest match: `what-is-ndd.md` (section) + `reference/glossary.md`
- "Rules and Examples" — closest match: `what-makes-a-narrative-buildable.md`
- "Working with Agents" — closest match: `guides/prompting-ai.md` and `guides/narratives-to-code.md`
- "Canonical Example" — closest match: `guides/build-concert-platform.md` ("Concert Booking Platform") and `guides/first-narrative.md`

None of these page titles exist verbatim. The brief tells me **not to delete existing pages without confirmation** (§0.1). Treating all sub-pages under `explanation/`, `guides/`, `reference/*` (other than `index.md`) as preserved by default.

## §0.0 PRODUCT_REALITY_MODE

Searched on.auto repo for `BUILD_NOTES.md` — not present. Per §0.0 default: `PRODUCT_REALITY_MODE=B (default, awaiting confirmation)`. Block 5 of `/using-ndd-without-auto` will use Mode B language ("your agent builds from the model"), with a note flagged in this file when content is rendered.

## Open blockers (Part V) — needed before scaffolding

1. **Is on.auto live yet?** Brief 1 of 2 is a prerequisite for **publishing** narrativedriven.org. Local drafting can proceed only if Sam approves parallel work.
2. **GitHub schema repo URL** — needed for §2.6. The existing footer already links to `https://github.com/BeOnAuto/narrativedriven.org`; is that the schema repo, or is there a separate one?
3. **Canonical example URL** — brief references "existing canonical example URL". Best candidate: `/guides/build-concert-platform` or `/guides/first-narrative`. Need Sam to confirm.
4. **Central visual** — supplied as PNG or use the styled placeholder div?
5. **PRODUCT_REALITY_MODE** — confirm Mode B (default).
6. **Contact email** for footer.
7. **Existing pages disposition** — confirm: keep all of `explanation/*`, `guides/*`, and `reference/{dsl,glossary,moment-types}` untouched; only the four pages in §2.1 are in scope.

Not proceeding to scaffolding until these are answered.

## Resolved blockers (from §V)

- **Sequencing**: Sam approved drafting in parallel. Branch `site-rewrite-ndd-probe` not yet pushed.
- **Schema repo (§2.6)**: Phase 2 follow-up — Sam wants a job in `on.auto` that extracts the public schema from `app.on.auto` and feeds it into this repo via the existing monorepo structure. For Phase 1, `/reference` uses the §2.6 Option 2 fallback (disabled "Schema repository coming soon" button) so the page is safe to render but not safe to publish yet.
- **Canonical example URL**: `/guides/build-concert-platform`. Wired into homepage CTA and "Where to start" on `/what-is-ndd`.
- **Central visual**: styled three-panel placeholder div (`CentralVisualPlaceholder.vue`), per §1.1. Replace with PNG when ready.
- **PRODUCT_REALITY_MODE**: defaulted to Mode B (no on.auto BUILD_NOTES.md found). `/using-ndd-without-auto` Block 5 third bullet uses Mode B language: "Gives your agent the model and build instructions." If on.auto ships Mode A, swap that bullet to "Runs agents that build from the model."
- **Contact email**: not surfaced; omitted from footer rather than rendering raw `[CONFIRM]` text.
- **Existing pages**: all `/explanation/*`, `/guides/*`, and `/reference/{glossary,moment-types,dsl}` preserved. Only the four pages in §2.1 were rewritten (`/`, `/what-is-ndd`, `/using-ndd-without-auto`, `/reference/`).

## Build artifacts added/changed

- New: `site/.vitepress/theme/CentralVisualPlaceholder.vue` — three-panel visual per §1.1
- New: `site/docs/using-ndd-without-auto.md` — §2.5
- Rewritten: `site/docs/index.md` — §2.3
- Rewritten: `site/docs/what-is-ndd.md` — §2.4
- Rewritten: `site/docs/reference/index.md` — §2.6 (unresolved-link Option 2)
- Updated: `site/.vitepress/config.mts` — nav (§2.2), footer (§1.4), sidebar map for the new page
- Updated: `site/.vitepress/theme/index.ts` — registered `CentralVisualPlaceholder`, removed `HierarchySection` slot (out-of-brief), installed outbound + walkthrough scroll analytics (§1.6)
- Updated: `site/.vitepress/theme/custom.css` — appended sections at end of file for: home rewrite (`.ndd-home-section`, `.ndd-example-card`, `.ndd-cta-link`), hierarchy figure (`.ndd-hierarchy-*`), two-path cards + placeholder block, schema CTA. Also reduced `.VPHero .text` font-size from `clamp(3.3rem, 6vw, 5.4rem)` to `clamp(1.75rem, 2.6vw, 2.5rem)` so the brief's locked 25-word subhead fits as a headline-paragraph instead of overflowing. Overrode `.VPHomeFeatures .items` grid-template-columns to force the brief's 2x2 pillar layout (VP default was 3-up at 1440px).

## Placeholder rendering decisions

- `/`: §2.3 Block 4's "Show 3-4 cards from the canonical example (a moment, with rules and examples visible)" is rendered as three styled abstract cards labelled Moment / Rule / Example (no invented domain copy), with the locked body line above and a CTA pointing to `/guides/build-concert-platform`. Avoids improvising domain copy while still showing the structure the brief intends.
- `/what-is-ndd` Block 3: the "tree diagram. [PLACEHOLDER]" inline visual is rendered as a CSS-styled nested-`<ol>` tree using NDD layer colors. No bracket text visible.
- `/using-ndd-without-auto` Block 4 (full walkthrough): styled "Coming soon" placeholder card pointing to `/guides/build-concert-platform` (which is the closest existing canonical walkthrough). No email signup wired up, so brief variant for no-signup applied.
- `/reference/`: §2.6 Option 2 — disabled "Schema repository coming soon" button. Page renders but should NOT be published until the schema pipeline (Phase 2) is wired.

## Analytics events (§1.6)

- `outbound_to_auto` (all pages) — captured by delegated click handler in `theme/index.ts` for any external link to `on.auto` or `*.on.auto`
- `outbound_to_github` (all pages) — same handler matches `github.com`
- `walkthrough_started` (`/using-ndd-without-auto`) — IntersectionObserver on `#quick-proof` (Block 2 sits above)
- `quick_proof_completed_scroll` (`/using-ndd-without-auto`) — IntersectionObserver on `#full-walkthrough` (sits below the quick proof's step 8)

Note: brief defined `walkthrough_started` as scroll past Block 2 and `quick_proof_completed_scroll` as scroll past Block 3 (step 8). Both fire when the immediately-following section's heading enters the viewport (rootMargin -25%), which is the most reliable scroll-past sentinel.

## Final commands

- Build: `pnpm build` — PASS (vitepress 1.6.4, 2.32s)
- Lint / typecheck: site has no explicit scripts. Build is the gate.
- Tests: none present in `site/`. None added (per §0.4 rule 6 the brief did not require any).

## Top-up brief — typography and hierarchy pass (2026-05-18)

Applied after Phase 1 visual review. Sam noted the page was treating explanatory copy as display copy. All locked copy preserved; only typographic treatment, layout, and component structure changed.

### Hero
- `hero.text` in `docs/index.md` now contains structured HTML (VitePress renders this via `v-html`): a `.heroTitleMain` span (main act, the durable-product-model clause), a `.heroTitleBridge` rule, and a `.heroTitleSecondary` span (italic, brand red, the humans-and-agents clause). All words preserved in document order; semantically still one `<h1>` because of VitePress's hero structure.
- `.heroTitleMain`: `clamp(36px, 5vw, 68px)`, weight 500, line-height 0.95, letter-spacing -0.04em.
- `.heroTitleSecondary`: `clamp(22px, 2.2vw, 32px)`, italic, brand red, line-height 1.15.
- `.heroTitleBridge`: 56px × 1px rule at opacity 0.18.
- `.VPHero .name` kicker tightened to 12px / 0.18em / brand red / margin-bottom 24px (top-up §5).
- `.VPHero .tagline` now Albert Sans 17px, max-width 620px, left-aligned, muted color (top-up §3).
- Hero secondary CTA (`.VPButton.alt` inside `.VPHero .actions`) is now text-style (no border/background, brand color) so only the primary CTA is "loud" (top-up §6). Site-wide `.VPButton.alt` retains its outlined pill treatment.

### Pillars
- Removed VitePress `features` array from `index.md` frontmatter. Pillars are now an inline `<div class="pillarGrid">` with four `<article class="pillarCard">` entries.
- Each card has `.pillarIndex` ("01 / Structure", "02 / Output", "03 / Precision", "04 / Openness"), left-aligned `<h3>`, and a 15px body paragraph.
- Card background uses `color-mix(in srgb, var(--vp-c-bg) 92%, var(--ndd-brand) 8%)` (light) / 88/12 (dark) for the soft brand tint.
- Grid: 4 columns at >=1100px, 2x2 at 700-1099px, 1 column under 700px. Padding 24px (20px mobile).
- Removed the old `.VPHomeFeatures .items` grid-template-columns override (no longer relevant).

### Section eyebrow + title scale
- New `.sectionEyebrow` / `.sectionTitle` / `.sectionBody` classes used on the "How NDD changes the build loop", "See it modeled", and "The tradition behind NDD" sections.
- Eyebrows: 12px brand-red small caps with 0.16em tracking.
- Titles: `clamp(32px, 4vw, 52px)`, Barlow, line-height 1.
- All three current section titles are 3-6 words (within the brief's 8-word rule).
- Pillar section uses only the eyebrow ("What NDD gives you") since the cards carry their own headings.

### Mobile
- `.heroTitleMain` mobile: `clamp(36px, 11vw, 48px)` / line-height 0.98.
- `.heroTitleSecondary` mobile: 22px / line-height 1.2.
- `.heroTitleBridge` mobile margin 18px 0.
- `.VPHero .tagline` mobile overridden back to Albert Sans 16px (existing theme had forced Barlow 1.25rem at this width).
- Pillar cards stack to single column at <=700px; padding reduced to 20px.

### Visual QA performed (chrome-devtools MCP, dev server on :5180)
- 1440×900 desktop (dark + light modes): hero editorial split renders, pillars 4-up, sections eyebrowed.
- 1024×820 tablet: pillars fall to 2x2, hero still side-by-side.
- 375×812 mobile: kicker hidden (existing theme behavior), headline + bridge + italic secondary stack readably, tagline subordinate, illustration moves below CTAs, pillars single-column.
- Build: pnpm build PASS (vitepress 1.6.4, 2.34s).
- Console: 1 pre-existing posthog deprecation warning; no errors from new code.

## Hybrid pass — GPT review applied (2026-05-18)

GPT review noted the page was leading with definition instead of promise, and message-house order (pillars first) was dominating reader-comprehension order (hierarchy first). Applied the hybrid reshape Sam approved.

### Hero copy change (NEW lock)
- H1 changed from "Narrative-Driven Development" / subhead "A product modeling technique…" to:
  - Kicker: `NARRATIVE-DRIVEN DEVELOPMENT`
  - Main act: **"Specify software as narratives."** *(restored from the old page)*
  - Secondary act (italic, brand red): **"NDD turns product intent into a durable product model humans can review and agents can build from."**
  - Support tagline: **"Domains, narratives, scenes, moments, rules, and examples make behavior precise enough for agents to build from."**
- Original brief locked the H1 to "Narrative-Driven Development." That lock is overridden by Sam's instruction.

### Homepage order reshape
New section order (replaces prior structure):
1. **Hero** — promise + definition
2. **What NDD gives you** — Domain → Narrative → Scene → Moment hierarchy flow (4 cards + arrows, restored from old page concept but rebuilt as inline HTML, not the original `HierarchySection.vue` component)
3. **The problem** — "Chat loses your intent." + three-panel contrast visual (formerly "The contrast / How NDD changes the build loop")
4. **Why this method works** — four pillars (Structure / Output / Precision / Openness), now demoted to mid-page and rendered as lightweight editorial columns
5. **Canonical example** — See it modeled (unchanged)
6. **Open method** — NEW credibility block: "Practice NDD with any agent." with links to `/using-ndd-without-auto` and `/reference/`
7. **Lineage** — The tradition behind NDD (unchanged)
8. **Try it** — NEW final soft Auto CTA block: "Practice NDD in Auto." with brand-tinted background and "Open Auto →" button to `https://on.auto`

### New sections — inline HTML in `docs/index.md`
- **`.hierarchyFlow`** — grid of 4 `.hierarchyNode` cards with `→` arrows between them. Each node has a colored top border (brand red / brand secondary / amber / text-1), tag, title, and example. Stacks vertically at <=1024px with arrows rotated 90°.
- **`.credibilityBlock`** — bordered top/bottom horizontal rules, centered eyebrow + title + body + two `.ndd-cta-link` links.
- **`.autoCtaBlock`** — soft `color-mix` brand-tinted rounded panel with eyebrow + title + body + filled `.autoCtaButton` (brand-color pill).

### Pillars — visual weight reduction
- Per GPT: pillars should be "compact, lower on page" and not anchor the page.
- Removed the full card border + brand-tinted background.
- Pillars now render as four editorial text columns separated by a single top rule each.
- Body font reduced from 15px to 14.5px with slightly looser line-height (1.6 vs 1.55).
- No padding change on desktop (22px 22px 24px).

### New copy introduced (not in original brief)
- Hero H1 and support line (see "Hero copy change" above).
- Hierarchy section: short cards repurposed from the old `HierarchySection.vue` content (Domain/Narrative/Scene/Moment definitions, e.g. "The capability being built." / "e.g. Concert Booking").
- "The problem" section title: "Chat loses your intent." (replaces "How NDD changes the build loop").
- Open-method credibility block: "Practice NDD with any agent." and "NDD is open. Use it with Claude, Cursor, Codex, or any coding agent you already have. The schema and dialect are being prepared for publication."
- Final Auto CTA: "Practice NDD in Auto." + "Auto is the end-to-end platform built around NDD. Once your model gets larger than a few moments, Auto removes the toil." (the second sentence is verbatim from the brief's locked `/using-ndd-without-auto` Block 5 copy).

### Visual QA (Chrome DevTools MCP)
- Desktop 1440×900 (dark + light): hero punch line lands, hierarchy section reads as a flow with arrows, pillars are quiet, credibility + final CTA both render.
- Tablet 1024×820: hierarchy stacks to single column with rotated arrows.
- Mobile 375×812: full page stack works, kicker hidden on mobile (pre-existing theme behavior), filled+quiet CTAs present, pillars as single column with top rules, final CTA legible.
- Build: PASS (vitepress 1.6.4, 2.30s).
- Console: pre-existing posthog deprecation warning only; no errors from new code.

## Out-of-brief deviations

- Hero font-size reduced (see "Build artifacts added/changed" above) — needed to make the brief's locked 25-word subhead readable. Copy itself is preserved.
- Footer copy: brief §1.4 says CTA phrase must be "Practice NDD in Auto." The existing footer phrasing was "A spec dialect by Auto. Part of the spec-driven movement." Updated to lead with "Practice NDD in Auto." followed by the existing spec-driven references. Does NOT say "Powered by NDD" (forbidden by §1.4).
- Nav reorganized: brief §2.2 specified four primary items + right-aligned "Practice NDD in Auto →". Implemented as: What is NDD? / Use without Auto / Reference / More (dropdown for existing pages) / Practice NDD in Auto →.
- HierarchySection theme slot removed from homepage. It rendered an out-of-brief "Domain → Narrative → Scene → Moment" strip between hero and pillars. Slot used to be wired in `theme/index.ts` Layout(); now unwired since no other home layout exists on this site.

## Phase 2 (not in this build) — schema pipeline

For `/reference` to publish the schema, a follow-up workstream is needed. See revised plan in conversation; the prior agent's first attempt was reverted because (a) the job direction was inverted and (b) the public-facing artifacts leaked references to the private producer.
