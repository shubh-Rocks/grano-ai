---
version: alpha
name: Cursor
website: "https://cursor.com"
description: An AI-first code editor whose marketing site reads like a quietly-confident developer-tools brand with a warm-cream editorial canvas (`#f7f7f4`) instead of the typical dark IDE atmosphere. Near-black warm ink (`#26251e`) carries body and display alike — display sits at weight 400 with negative letter-spacing for a magazine feel rather than a bold tech voice. The single brand voltage is **Cursor Orange** (`#f54e00`) reserved for primary CTAs and the wordmark. A signature pastel timeline palette (peach, mint, blue, lavender, gold) marks AI-action stages (Thinking / Reading / Editing / Grepping / Done) — only inside in-product timeline visualizations. Cards use minimal hairlines, no shadows, generous 80px section rhythm. CursorGothic for display/body, JetBrains Mono on every code surface (which is roughly half the page).

seo:
  title: "Cursor Design System for React — Cursor Orange (#f54e00), CursorGothic, 25 components"
  metaDescription: "Cursor's design system as a DESIGN.md file. Cream canvas #f7f7f4, Cursor Orange #f54e00, CursorGothic, JetBrains Mono, 25 components. For React, Next.js, and AI tools."
  highlights:
    - "Editorial cream canvas (#f7f7f4) — not the dark IDE atmosphere every other AI code editor defaults to"
    - "Display weight stays at 400 — magazine voice with -2.16px tracking on the 72px hero, never bold"
    - "Single accent voltage — Cursor Orange (#f54e00) reserved for CTAs and the wordmark, used scarcely"
    - "Five-pastel AI timeline palette — peach, mint, blue, lavender, gold scoped strictly to in-product agent stages"
    - "Hairline-only depth — no drop shadows anywhere; cards float on 1px borders and white-on-cream contrast"
  tags:
    - "Developer Tools & IDEs"
    - "AI & LLM Platforms"
  lastUpdated: "2026-05-12"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Cursor is the AI-first code editor that decided its marketing site should not look like a code editor. The base canvas is warm cream (#f7f7f4) rather than the obligatory dark-IDE black, and the body ink (#26251e) is a warm near-black rather than pure #000. The brand voltage is one color — Cursor Orange (#f54e00) — used scarcely on primary CTAs and the wordmark. The signature visual moment is the AI-action timeline: five pastel pills (peach, mint, blue, lavender, gold) marking agent stages inside the editor mockups. Display runs at weight 400 with -2.16px letter-spacing on the 72px hero, a quietly-confident magazine voice rather than the heavy SaaS bombast.

    This page packages that system into a single DESIGN.md file following the Google Labs spec. Inside: 21 color tokens (brand, surface, hairline, text, the five timeline pastels, and semantics), 15 typography styles with CursorGothic as the single family plus JetBrains Mono on every code surface, 8 corner-radius tokens topping out at the 8px CTA standard, a 9-step spacing scale anchored at the 80px section rhythm, and 25 components from the hero band through the IDE mockup, feature cards, timeline pills, pricing tiers, and the cream footer.

    Hand the file to Claude, Cursor, or Copilot and the agent reproduces the brand's restraint — cream canvas, warm ink, single-voltage orange, weight-400 display — rather than defaulting to a generic dark-IDE theme. Or reference the tokens directly: every hex, font, radius, and spacing value is quoted YAML you can paste into Tailwind config, CSS variables, or a shadcn theme. The system is worth studying because it does the hardest thing in dev-tools branding: it stays calm.
  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://cursor.com"
      title: "Cursor's marketing site"
      description: "The live source — see the cream canvas, the timeline pills, and the IDE mockups in their native habitat."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is Cursor's primary brand color?"
      answer: "Cursor's brand color is Cursor Orange — #f54e00, a saturated red-orange that sits between vermilion and pure orange. It's used scarcely: primary CTA pills, the wordmark, and the occasional hero accent. The press state is a darker #d04200. Most pages are 90% cream canvas (#f7f7f4) plus warm ink (#26251e), with the orange acting as a single voltage that focuses the eye on one action at a time. The brand never introduces a secondary accent color in mainline marketing."
    - id: "dark-mode"
      title: "Does Cursor's marketing site have a dark mode?"
      answer: "No — the marketing site is light-only, and deliberately not dark even though Cursor is an IDE. The canvas is warm cream (#f7f7f4) rather than white, ink is warm near-black (#26251e) rather than pure #000, and the IDE mockup card itself uses white surface (#ffffff) with a slightly different canvas-soft (#fafaf7) inside the panes. The actual code editor product has its own dark theme, but that surface is not represented in this DESIGN.md, which captures the public marketing experience."
    - id: "typography"
      title: "What typography does Cursor use, and what should I use if CursorGothic isn't available?"
      answer: "Cursor runs CursorGothic as the single sans family for display and body, plus JetBrains Mono on every code surface (and code surfaces are roughly half the page). Display sits at weight 400 with negative letter-spacing — the 72px hero tracks at -2.16px for a magazine feel rather than a tech-bold voice. CursorGothic is licensed; Inter at weight 400 with letter-spacing tuned to -1.5% is the closest open-source substitute, or GT Sectra for a more editorial feel. JetBrains Mono is open-source and used as-specified."
    - id: "timeline-pastels"
      title: "What are the timeline pastels for, and can I use them as system colors?"
      answer: "The five pastels (peach #dfa88f, mint #9fc9a2, blue #9fbbe0, lavender #c0a8dd, gold #c08532) mark AI-action stages inside the in-product agent timeline — Thinking, Grepping, Reading, Editing, Done. They are strictly scoped to that one timeline visualization. They are not semantic system colors, not status indicators, and never appear as button or badge backgrounds outside agent timeline contexts. Using them on non-timeline UI breaks the brand's signature."
    - id: "shapes-and-depth"
      title: "What is Cursor's shape and elevation language?"
      answer: "Compact and flat. CTA buttons use an 8px radius (rounded.md) — a developer dialect rather than the 12-14px consumer feel. Cards and IDE panes use 12px (rounded.lg). Timeline pills and badges are fully rounded (9999px). The system uses hairline-only depth — no drop shadows, no elevation tiers. Cards float above the cream canvas via 1px hairlines (#e6e5e0) and the slight white-on-cream contrast. The IDE-mockup card is the only element that reads as elevated, and even there the elevation comes from internal pane structure rather than a shadow."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build my own React dev-tools site?"
      answer: "Yes — the file is designed to be fed into Claude, Cursor, or any AI tool that reads structured design tokens. The agent will reproduce the brand's restraint (cream canvas, weight-400 display, single-voltage orange, hairline-only depth) rather than a generic dark-IDE theme. You can also reference the tokens directly: every color hex, type style, radius, and spacing value is a quoted value you can paste into Tailwind config, CSS variables, or shadcn theme variables. Pair it with JetBrains Mono on every code surface for the full effect."

colors:
  primary: "#f54e00"
  primary-active: "#d04200"
  ink: "#26251e"
  body: "#5a5852"
  body-strong: "#26251e"
  muted: "#807d72"
  muted-soft: "#a09c92"
  hairline: "#e6e5e0"
  hairline-soft: "#efeee8"
  hairline-strong: "#cfcdc4"
  canvas: "#f7f7f4"
  canvas-soft: "#fafaf7"
  surface-card: "#ffffff"
  surface-strong: "#e6e5e0"
  on-primary: "#ffffff"
  timeline-thinking: "#dfa88f"
  timeline-grep: "#9fc9a2"
  timeline-read: "#9fbbe0"
  timeline-edit: "#c0a8dd"
  timeline-done: "#c08532"
  semantic-error: "#cf2d56"
  semantic-success: "#1f8a65"

typography:
  display-mega:
    fontFamily: "'CursorGothic', system-ui, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -2.16px
  display-lg:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.72px
  display-md:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.325px
  display-sm:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.11px
  title-md:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-tracked:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.08px
  body-sm:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.88px
    textTransform: uppercase
  code:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  nav-link:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 9px 17px
    height: 40px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  button-download:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 44px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: 80px
  ide-mockup-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0"
  ide-pane:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: 16px
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  comparison-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  timeline-pill-thinking:
    backgroundColor: "{colors.timeline-thinking}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-grep:
    backgroundColor: "{colors.timeline-grep}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-read:
    backgroundColor: "{colors.timeline-read}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-edit:
    backgroundColor: "{colors.timeline-edit}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-done:
    backgroundColor: "{colors.timeline-done}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  code-block:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 20px
  pricing-tier-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-featured:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 44px
  badge-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  cta-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 96px
  testimonial-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px 48px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
---

## Overview

Cursor's marketing site reads as a quietly-confident developer brand that believes in editorial calm over IDE-darkness. The base canvas is **warm cream** (`{colors.canvas}` — #f7f7f4) holding warm near-black ink (`{colors.ink}` — #26251e) for body and display alike. The single brand voltage is **Cursor Orange** (`{colors.primary}` — #f54e00) reserved for primary CTAs and the wordmark — used scarcely.

Type runs **CursorGothic** as the single sans family. Display sits at weight 400 with negative letter-spacing — a magazine-editorial voice rather than tech-bombastic. JetBrains Mono carries every code surface (and code surfaces are roughly half the page).

The brand's strongest visual signature is the **AI-timeline pill palette**: five pastel pills (peach `{colors.timeline-thinking}`, mint `{colors.timeline-grep}`, blue `{colors.timeline-read}`, lavender `{colors.timeline-edit}`, gold `{colors.timeline-done}`) marking AI-action stages inside in-product timeline visualizations. Used only in product UI — never as system action colors.

**Key Characteristics:**
- Warm cream canvas, not white. Ink is warm (#26251e), not pure black.
- Single CTA color: `{colors.primary}` (Cursor Orange #f54e00). Used scarcely.
- Display weight stays at 400 — never bold. Magazine voice.
- AI timeline pastels: 5 dedicated tokens for in-product agent action stages.
- Compact 8px CTA radius — developer dialect.
- Hairline-only depth; no drop shadows.
- 80px section rhythm.

## Known Gaps

- CursorGothic is a licensed typeface; Inter is the substitute.
- Animation timings (timeline pill entrance, IDE pane reveal) out of scope.
- In-app surfaces (code editor, chat panel, agent timeline) only partially captured via marketing IDE mockups.
- Form validation states beyond focus not visible on captured surfaces.