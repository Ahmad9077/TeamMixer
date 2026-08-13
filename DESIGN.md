---
name: Bright Playful Minimal
colors:
  background: "#f7f8fc"
  surface: "#ffffff"
  surface-container: "#f9fafb"
  outline: "#e5e9f0"
  on-surface: "#172033"
  on-surface-variant: "#6b7280"
  primary: "#f97316"
  primary-strong: "#ea580c"
  team-one: "#ef4444"
  team-two: "#2563eb"
  success: "#16a34a"
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
  container-max: 1440px
---

## TeamMixer

TeamMixer is a high-fidelity responsive web application for ديوانية الجيران and the game قرعة لعبة سين جيم. Users add players into five source groups, then spin a central wheel that selects a name from the current group.

## Visual System

The site uses a Bright Playful Minimal system: a cool near-white background (`#f7f8fc`), clean white panels, low-contrast borders (`#e5e9f0`), and restrained shadows. Orange (`#f97316`) identifies primary actions and active navigation; coral red (`#ef4444`) identifies Team 1, blue (`#2563eb`) identifies Team 2, and green (`#16a34a`) identifies ready/success states. The current `الخميس الونيس` artwork appears as a compact brand signal instead of a large hero. The UI should feel bright, calm, professional, and playful without gradients, glass effects, or visual clutter.

Styling is built from semantic CSS classes defined in `index.html` (`.panel`, `.btn-primary`, `.btn-secondary`, `.field`, `.chip`, `.chip-remove`, `.stat-box`, `.row`, `.empty-note`, `.count-chip`, `.slot-card`, `.nav-btn`/`.nav-active`, `.wheel-pointer`) plus Tailwind utilities for layout, spacing, and typography only. Avoid arbitrary hex Tailwind classes.

The interface is fully Arabic and right-to-left (`<html lang="ar" dir="rtl">`) with Western digits. Typography uses Cairo from Google Fonts (with `font-display: swap` and Calibri fallback) for all text. Arabic text must keep connected letterforms with no letter spacing.

## Components

Cards and panels use white surfaces, 1px cool low-contrast borders, and subtle shadows. Inputs are white fields with an orange focus ring. Primary buttons are solid orange with white text; secondary buttons are white with a quiet border. Group accents remain unchanged: dragon-slayer brown `#7c2d12`, dragon red `#b3403a`, lion amber `#b45309`, wolf blue `#1d4ed8`, and penguin charcoal `#111827`. Wheel slices use soft orange, coral, blue, green, violet, and yellow tones with white separators and dark Arabic labels.

## Workflow

Setup: five team panels with input fields, add buttons, and removable player chips. The default groups are جلاد التنانين, التنانين, الأسود, الذئاب, and البطاريق.

Draw: a central segmented SVG/CSS spin wheel that displays the remaining names from the active group. Native HTML Arabic labels sit above the SVG slices so words remain connected. Every name and group logo uses the same permanent tangential orientation; both rotate as part of the wheel and neither is corrected or reoriented after landing. This geometry makes the selected name and logo land horizontally beneath the pointer. On phones the wheel appears first; larger screens show current group context, wheel, and live team cards side by side. The wheel selects the name only; the app assigns that name to Team 1 or Team 2 according to the existing workflow.

Within each group, selected names alternate between Team 1 and Team 2. If a group has an odd count, the next team in the sequence receives the first two selections from the next group.

Results: final cards for الفريق الأول and الفريق الثاني with player counts, derived level totals, a balance indicator, `إعادة القرعة`, and the existing `من جديد` start-over action.

Categories: a fourth tab after Results. It uses a separate text-only wheel for category selection, with regular-weight vertical labels inside the wheel slices. Selected categories appear above the wheel as six cards arranged in a 3-by-2 grid, with portrait artwork slots that preserve the full category image and Arabic category names.

In one Categories session, only two categories from this group may be selected: دول و عواصم, جغرافيا, and سياحة وسفر. After two are selected, the remaining category from that group is excluded from the wheel. Only one category may be selected from ولا كلمة and ولا كلمة فن أجنبي; after one is selected, the other is excluded from the wheel.

Fixed mobile tabs must have enough safe-bottom page padding so the last visible content on any screen can scroll above the tab bar instead of being hidden behind it. All interactive targets are at least 44px, focus/hover/pressed states are visible, and `prefers-reduced-motion` shortens transitions.

Sound has no user-facing control. `ADMIN_SOUND_SETTINGS` in `app.js` is the only enable/mapping registry; existing audio files and per-player assignments remain unchanged.
