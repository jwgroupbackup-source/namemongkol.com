---
name: NameMongkol
description: วิเคราะห์ชื่อ ตั้งชื่อมงคล ทำนายชื่อ-นามสกุล แม่นยำที่สุด
colors:
  primary: "#c9933a"
  primary-light: "#d4a54e"
  neutral-bg: "#050711"
  neutral-surface: "#0f172a"
  neutral-text: "#f8fafc"
typography:
  display:
    fontFamily: "var(--font-noto-thai), var(--font-geist-sans), sans-serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "var(--font-noto-thai), var(--font-geist-sans), sans-serif"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  md: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "12px 24px"
---

# Design System: NameMongkol

## 1. Overview

**Creative North Star: "The Sacred Terminal"**

The Sacred Terminal blends the profound mysticism of numerology with the precision of modern technology. The aesthetic is heavily anchored in deep space minimalism, where interfaces recede and sacred information glows. We explicitly reject the chaotic, banner-heavy designs of old-school horoscope websites and the overly dry, sterile feel of generic SaaS tools.

**Key Characteristics:**
- Dark, immersive Obsidian Space background.
- Mystical, glowing accents that guide the eye naturally.
- Tactile, magical components that respond to user interaction.
- Typographic clarity to build trust and authority.

## 2. Colors

The palette is rooted in deep, cosmic darkness illuminated by warm, sacred energy.

### Primary
- **Mystic Amber** (#c9933a): Used for primary actions, critical callouts, and moments of magical conversion.

### Neutral
- **Obsidian Space** (#050711): The foundational void. Used for the main background to create infinite depth.
- **Surface Void** (#0f172a): Elevated cards and structural containers.
- **Starlight Text** (#f8fafc): High-contrast primary reading text.

### Named Rules
**The Focused Aura Rule.** Glows and ambient light are reserved for state changes (hover/focus) or highly specific mystical elements (like the aura analysis). They should never overwhelm the foundational darkness.

## 3. Typography

**Display Font:** Noto Sans Thai (with Geist Sans fallback)
**Body Font:** Noto Sans Thai (with Geist Sans fallback)

**Character:** Modern, legible, and authoritative, ensuring complex astrological and numerical data is easily readable, even for older demographics.

### Hierarchy
- **Display** (700, 3xl-5xl, tight): Hero sections, critical analysis results.
- **Headline** (600, xl-2xl, snug): Section breaks and card titles.
- **Body** (400, base, relaxed): Explanations and reading content (max 70ch).
- **Label** (500, sm, uppercase): Eyebrows, small metadata, and tags.

### Named Rules
**The Legibility Rule.** Never sacrifice readability for aesthetics. Ensure text contrasts highly against the dark background, keeping accessibility in mind.

## 4. Elevation

Layered & Glowing. The system relies on deep space layering using blur, semi-transparent backgrounds (glassmorphism), and ambient glow to signify depth rather than harsh, solid drop shadows.

### Shadow Vocabulary
- **Ambient Glow** (`0 0 24px rgba(245, 158, 11, 0.22)`): Used on primary buttons to create a magical, tactile feel.
- **Glass Panel** (`backdrop-filter: blur(18px)`): Used for elevated content cards to let the cosmic background subtly shine through.

### Named Rules
**The Ethereal Layer Rule.** Structural elements float. Use border opacity (e.g., `border-white/10`) and background tints (`bg-white/5`) instead of solid fills to maintain the airy, magical feel.

## 5. Components

Components feel tactile and magical, responding to the user with subtle light and motion.

### Buttons
- **Shape:** Softly rounded (`12px` to `full`).
- **Primary:** Mystic Amber with ambient glow.
- **Hover / Focus:** Lifts slightly with an intensified glow and subtle gradient shift.
- **Secondary / Ghost:** Transparent background with an Obsidian outline or white tint (`bg-white/10`).

### Cards / Containers
- **Corner Style:** `12px` or `24px` for larger panels.
- **Background:** Deep translucent surfaces (e.g., `bg-slate-900/50`).
- **Shadow Strategy:** Glassmorphism with ambient glow on interaction.
- **Border:** Hairline subtle borders (`border-white/5`).

### Inputs / Fields
- **Style:** Dark, semi-transparent backgrounds with a subtle stroke.
- **Focus:** The border shifts to Mystic Amber, and a soft glow appears, signaling readiness.

## 6. Do's and Don'ts

### Do:
- **Do** use `bg-white/5` or `bg-white/10` for subtle structural containers to maintain the Obsidian Space theme.
- **Do** ensure high contrast for all reading text.
- **Do** use the Mystic Amber color strategically for conversion-focused actions.

### Don't:
- **Don't** use chaotic, highly saturated colors beyond the Mystic Amber accent.
- **Don't** build interfaces that look like dry, clinical SaaS tools.
- **Don't** clutter the screen with heavy, opaque structural borders.
