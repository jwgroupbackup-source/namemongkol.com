---
name: NameMongkol
description: Thai auspicious naming, numerology, premium name analysis, lucky phone numbers, and spiritual wallpapers.
colors:
  primary: "#c9933a"
  primary-light: "#e8c87e"
  primary-hover: "#d4a54e"
  primary-dark: "#a67828"
  lavender: "#9b8ec4"
  lavender-light: "#eeebf8"
  light-bg: "#f8f8fc"
  light-bg-alt: "#f3f3f9"
  light-card: "#ffffff"
  light-card-elevated: "#fafafd"
  dark-bg: "#050711"
  dark-card: "#0f172a"
  dark-card-hover: "#1e293b"
  text-primary: "#1a1a3e"
  text-secondary: "#5a5a82"
  text-muted: "#8e8eaa"
  text-inverse: "#f8fafc"
  border-default: "#ddddf0"
  border-subtle: "#eeeef6"
typography:
  display:
    fontFamily: "var(--font-noto-thai), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-noto-thai), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "var(--font-noto-thai), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "var(--font-noto-thai), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "var(--font-noto-thai), var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    typography: "{typography.title}"
  button-terminal:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card-light:
    backgroundColor: "{colors.light-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  card-terminal:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  input-terminal:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  chip-filter:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Design System: NameMongkol

## 1. Overview

**Creative North Star: "The Sacred Terminal"**

The Sacred Terminal is a premium Thai numerology interface where mystical knowledge is presented with the clarity of a precise instrument. The system now blends a White Tech Premium public surface with deep terminal cards for results, filters, comparisons, and conversion moments. The background feels calm and auspicious; the cards carry the sacred data.

NameMongkol must feel trustworthy, minimal, and quietly mystical. It explicitly rejects chaotic old horoscope websites, loud banners, harsh rainbow palettes, and dry SaaS tooling that feels too technical or emotionally flat.

**Key Characteristics:**
- Light premium discovery pages using warm white-lavender surfaces and soft sacred geometry.
- Dark terminal cards for important data, premium tools, filters, result tables, and CTA clusters.
- Mystic Amber used sparingly for conversion, focus, and auspicious emphasis.
- High readability for Thai text, including older users and long-form article readers.
- Smooth, tactile state changes without noisy animation or decorative clutter.

## 2. Colors

The palette is a restrained light-premium system anchored by deep terminal surfaces and a single warm amber accent.

### Primary
- **Mystic Amber**: Primary conversion actions, active states, ranking emphasis, and sacred highlights.
- **Soft Temple Gold**: Gentle hover and glow companion for Mystic Amber.
- **Deep Offering Gold**: Darker amber for borders, small labels, and low-saturation emphasis.

### Secondary
- **Ritual Lavender**: Ambient haze, subtle mystical depth, and supporting UI accents.
- **Pale Lavender Veil**: Soft light-surface tint for panels, hover states, and quiet empty states.

### Neutral
- **White Tech Premium Base**: Main public background for home, articles, search, wallpapers, and premium discovery flows.
- **Light Card White**: Content cards, FAQs, info panels, and calm reading containers.
- **Sacred Navy Text**: Primary text on light surfaces.
- **Oracle Slate Text**: Body text and secondary descriptions on light surfaces.
- **Mist Muted Text**: Meta text only; never use it for body paragraphs.
- **Obsidian Space**: Legacy immersive dark pages and isolated cosmic experiences.
- **Terminal Surface**: Main dark card color for filters, result cards, CTA clusters, and article utility blocks.
- **Terminal Hover Surface**: Hover and nested emphasis inside dark cards.
- **Soft Divider**: Default light border for public surfaces.

### Named Rules
**The Two-Surface Rule.** Light pages carry discovery and reading; dark terminal cards carry decisions, search tools, rankings, premium actions, and structured data.

**The Amber Scarcity Rule.** Amber is a signal, not a theme wash. Use it for actions, active states, scores, and short emphasis, not as body text everywhere.

**The Contrast Contract.** Light cards use dark navy headings and slate body text. Dark cards use white headings, slate-300 body text, and slate-400 only for meta labels.

## 3. Typography

**Display Font:** Noto Sans Thai (with Geist Sans and system sans fallback)  
**Body Font:** Noto Sans Thai (with Geist Sans and system sans fallback)  
**Label/Mono Font:** Geist Mono only for numbers, codes, and compact tabular data.

**Character:** Modern, readable, and authoritative. Thai content should feel precise and calm, never decorative at the expense of comprehension.

### Hierarchy
- **Display** (800, clamp 2rem-4rem, 1.12 line-height): Hero titles, critical product claims, and main analysis results.
- **Headline** (700, clamp 1.5rem-2.5rem, 1.2 line-height): Section headings, SEO blocks, and page-level clusters.
- **Title** (700, 1.125rem, 1.35 line-height): Card headings, table group labels, and compact article titles.
- **Body** (400, 1rem, 1.7 line-height): Explanations, FAQs, article summaries, and user guidance. Cap long reading text at 65-75ch.
- **Label** (700, 0.75rem, 0.08em letter-spacing): Eyebrows, badges, filters, meta labels, and uppercase utility text.

### Named Rules
**The Thai Legibility Rule.** Thai body copy must stay relaxed and high-contrast. Do not shrink important explanatory text below 0.875rem on mobile.

**The Meta-Only Muted Rule.** Muted text is for dates, counts, labels, and helper copy only. Never use muted text for primary card descriptions.

## 4. Elevation

NameMongkol uses tonal layering first, then subtle shadows and glows. Light pages depend on soft borders and low shadows; dark terminal cards depend on border contrast, amber focus glows, and small lift on hover.

### Shadow Vocabulary
- **Soft Public Shadow** (`0 1px 2px rgba(15, 23, 42, 0.06)`): Resting light cards and small panels.
- **Terminal Lift** (`0 8px 30px rgba(15, 23, 42, 0.14)`): Dark cards, article cards, and premium search cards.
- **Amber Aura** (`0 0 24px rgba(245, 158, 11, 0.22)`): Primary buttons, active filter states, and rare conversion moments.
- **Large Ritual Glow** (`0 18px 60px rgba(201, 147, 58, 0.16)`): Hero emphasis and important premium panels only.

### Named Rules
**The Felt, Not Seen Rule.** Background glows and sacred geometry should be subconsciously felt. If the pattern competes with text, it is too strong.

**The State Glow Rule.** Glow belongs to interaction, focus, active state, or premium conversion. Static decorative glow should be rare.

## 5. Components

Components should feel precise, tactile, and calm. They are premium instruments, not generic SaaS widgets.

### Buttons
- **Shape:** Softly rounded rectangles (12px) or full pills for compact navigation.
- **Primary:** Mystic Amber background with white or near-navy text depending on brightness; use bold weight and 12px-16px vertical padding.
- **Hover / Focus:** Lift by 1-2px, strengthen the amber border or glow, and keep focus rings visible.
- **Terminal Button:** Deep navy surface with amber border/hover for secondary actions on light backgrounds.

### Chips
- **Style:** Rounded-full filters on Terminal Surface for dark controls, or white/light chips for low-emphasis discovery.
- **Selected State:** Amber border, amber text, and a restrained glow.
- **Unselected State:** Dark card background with slate-300 text on terminal chips; white background with slate-700 text on light chips.

### Cards / Containers
- **Corner Style:** 16px for cards, 24px for hero panels and premium modules.
- **Light Cards:** White or light elevated background, navy heading, slate body, subtle lavender border.
- **Terminal Cards:** Terminal Surface background, white heading, slate-300 body, slate-400 meta, amber hover or active border.
- **Internal Padding:** 16px for compact cards, 24px for normal cards, 32px-48px for premium panels.
- **Article / Media Cards:** Preserve image content with object-contain for infographics. Never crop text-heavy images.

### Inputs / Fields
- **Style:** Terminal inputs use dark background, slate-200 text, visible border, and muted placeholder. Light inputs use white or slate-50 backgrounds with navy text.
- **Focus:** Border shifts to amber with a low-opacity amber ring.
- **Disabled:** Use clear disabled styling but keep labels readable; disabled text can be muted only when the action is unavailable.

### Navigation
- **Desktop:** Compact premium controls, amber active state, terminal or light surface depending on page.
- **Mobile:** Dense but readable bottom/header navigation with stable tap targets and no text clipping.
- **Active State:** Amber icon/text treatment with restrained glow or border.

### Signature Components
- **SoftYellowGlowBackground:** White Tech Premium base using warm white-lavender, pale lavender haze, soft gold warmth, and sacred geometry at 2.5% opacity.
- **Dark Terminal Data Card:** Used for search results, premium analysis results, article utility blocks, comparison tables, and CTA clusters.
- **Article Infographic Figure:** Wide, non-cropping media wrapper with object-contain and clear captions or full-size image access.

## 6. Do's and Don'ts

### Do:
- **Do** use White Tech Premium background for public discovery and reading pages.
- **Do** use Terminal Surface cards for important structured data, tools, filters, and premium CTAs.
- **Do** keep headings on light cards in Sacred Navy Text and body copy in Oracle Slate Text.
- **Do** keep headings on dark cards white or slate-100 and body copy slate-300.
- **Do** reserve slate-400 and muted text for metadata, labels, disabled helper text, and decorative secondary information.
- **Do** use Mystic Amber strategically for conversion-focused actions, selected filters, scores, and short emphasis.
- **Do** preserve infographic readability with object-contain, adequate padding, and no cropping.

### Don't:
- **Don't** create chaotic old horoscope layouts with loud colors, banner clutter, or crowded visual noise.
- **Don't** build dry SaaS-looking screens that feel cold, generic, or overly technical.
- **Don't** use whole-page purple gradients, decorative blobs, or heavy glassmorphism as the default atmosphere.
- **Don't** put `text-white` on light cards or slate-700 body text on dark cards.
- **Don't** use side-stripe borders or gradient text for meaningful content.
- **Don't** use Amber as a paragraph color; it is an accent and action signal.
- **Don't** sacrifice readability, especially for Thai body text, table rows, FAQs, or card descriptions.
