---
name: Light Modern Minimal
colors:
  background: "#f7f5f1"
  surface: "#ffffff"
  surface-container: "#faf9f6"
  outline: "#e9e5dd"
  on-surface: "#221f1a"
  on-surface-variant: "#847e74"
  primary: "#0f766e"
  primary-strong: "#0b5d57"
  primary-container: "#e7f2ef"
  secondary: "#b45309"
  secondary-container: "#fdf2e2"
typography:
  headline:
    fontFamily: Cairo
    fontWeight: "700-800"
  body:
    fontFamily: Cairo
    fontWeight: "400"
rounded:
  DEFAULT: 0.75rem
  xl: 1rem
spacing:
  unit: 8px
  container-max: 1280px
---

## TeamMixer

TeamMixer is a high-fidelity responsive web application for ديوانية الجيران and the game قرعة لعبة سين جيم. Users add players into four source groups, then spin a central wheel that selects a name from the current group.

## Visual System

The website uses a Light Modern Minimal design system: a warm porcelain background (`#f7f5f1`) with very subtle teal/amber radial tints, clean white panels with 1px low-contrast borders (`#e9e5dd`) and soft layered shadows, bold Cairo typography, and one strong accent color — deep teal (`#0f766e`) — used for primary buttons, the active nav state, eyebrow labels, the wheel pointer, and team 1 identity. Warm amber (`#b45309`) is the secondary identity color for team 2. The setup hero uses the attached `الخميس الونيس` wordmark image as the only content inside the hero box. The UI should feel airy, professional, and contemporary without decoration or clutter.

Styling is built from semantic CSS classes defined in `index.html` (`.panel`, `.btn-primary`, `.btn-secondary`, `.field`, `.chip`, `.chip-remove`, `.stat-box`, `.row`, `.empty-note`, `.count-chip`, `.slot-card`, `.nav-btn`/`.nav-active`, `.wheel-pointer`) plus Tailwind utilities for layout, spacing, and typography only. Avoid arbitrary hex Tailwind classes.

The interface is fully Arabic and right-to-left (`<html lang="ar" dir="rtl">`) with Western digits. Typography uses Cairo from Google Fonts (with `font-display: swap` and Calibri fallback) for all text. Arabic text must keep connected letterforms with no letter spacing.

## Components

Cards and panels use white surfaces, 1px warm low-contrast borders, and subtle shadows. Inputs are white fields with a teal focus ring. Primary buttons are solid deep teal with white text; secondary buttons are white with a border that warms to teal on hover. Group accents are high-contrast on white: dragon-slayer brown `#7c2d12`, dragon red `#b3403a`, lion amber `#b45309`, and wolf blue `#1d4ed8`. Wheel slices use a soft pastel palette (mint, sand, periwinkle, blush, sage) with white separators and dark Arabic labels for legibility.

## Workflow

Setup: four team panels with input fields, add buttons, and removable player chips. The default groups are جلاد التنانين, التنانين, الأسود, and الذئاب.

Draw: a central segmented SVG/CSS spin wheel that displays the remaining names from the active group. The wheel selects the name only; the app assigns that name to Team 1 or Team 2 according to the workflow.

Within each group, selected names alternate between Team 1 and Team 2. If a group has an odd count, the next team in the sequence receives the first two selections from the next group.

Results: final cards for الفريق الأول and الفريق الثاني with the `من جديد` start-over action.

Categories: a fourth tab after Results. It uses a separate text-only wheel for category selection, with regular-weight vertical labels inside the wheel slices. Selected categories appear above the wheel as six cards arranged in a 3-by-2 grid, with portrait artwork slots that preserve the full category image and Arabic category names.

In one Categories session, only two categories from this group may be selected: دول و عواصم, جغرافيا, and سياحة وسفر. After two are selected, the remaining category from that group is excluded from the wheel. Only one category may be selected from ولا كلمة and ولا كلمة فن أجنبي; after one is selected, the other is excluded from the wheel.

Fixed mobile tabs must have enough safe-bottom page padding so the last visible content on any screen can scroll above the tab bar instead of being hidden behind it.
