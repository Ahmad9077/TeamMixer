---
name: Midnight Slate
colors:
  background: "#0b1326"
  surface: "#131b2e"
  surface-container: "#171f33"
  surface-container-high: "#222a3d"
  outline: "#44474c"
  on-surface: "#dae2fd"
  on-surface-variant: "#c5c6cd"
  primary: "#b9c7e0"
  primary-container: "#334155"
  secondary: "#e0c47e"
  tertiary: "#8bd6b6"
typography:
  headline:
    fontFamily: Inter
    fontWeight: "600"
  body:
    fontFamily: Inter
    fontWeight: "400"
rounded:
  DEFAULT: 0.5rem
  xl: 1.5rem
spacing:
  unit: 8px
  container-max: 1200px
---

## TeamMixer

TeamMixer is a high-fidelity responsive web application for ديوانية الجيران and the game قرعة لعبة سين جيم. Users add players into three source groups, then spin a central wheel that selects a name from the current group.

## Visual System

The website uses the Midnight Slate design system from Stitch: dark-mode-first, professional, quiet, and dashboard-oriented. The UI should feel deliberate and precise rather than playful.

The palette is deep navy and slate with restrained accents: slate blue for primary functional surfaces, muted gold for premium highlights, and emerald green for status indicators. Avoid candy colors, oversized pill shapes, pink dot-grid decoration, and heavy colored shadows.

Typography uses Inter for interface text and Calibri for Arabic text. Headings should use medium or semibold weight, not extra-bold.

## Components

Cards and panels use tonal layers, 1px low-contrast borders, and subtle shadows. Inputs are recessed dark surfaces with muted gold focus borders. Chips use structured 4px to 8px radii with slate borders. Buttons use a slate blue gradient with a fine top-edge highlight.

## Workflow

Setup: three team panels with input fields, add buttons, and removable player chips. The default groups are التنانين, الأسود, and الذئاب.

Draw: a central segmented SVG/CSS spin wheel that displays the remaining names from the active group. The wheel selects the name only; the app assigns that name to Team 1 or Team 2 according to the workflow.

Within each group, selected names alternate between Team 1 and Team 2. If a group has an odd count, the next team in the sequence receives the first two selections from the next group.

Results: final cards for Team 1 and Team 2 with share and start-over actions.
