---
name: قرعة لعبة سين جيم - ديوانية الجيران
colors:
  background: "#f4eadc"
  primary: "#7c3aed"
  secondary: "#f472b6"
  tertiary: "#34d399"
  dark-teal: "#064e3b"
typography:
  headline:
    fontFamily: Plus Jakarta Sans
    fontWeight: "800"
  body:
    fontFamily: Plus Jakarta Sans
    fontWeight: "500"
rounded:
  full: 9999px
spacing:
  base: 8px
---

## TeamMixer

TeamMixer is a high-fidelity responsive web application for ديوانية الجيران and the game قرعة لعبة سين جيم. Users add players into three source groups, then spin a central wheel that selects a name from the current group.

## Visual System

The design uses a Vibrant Pulse system: electric violet primary actions, mint success energy, electric pink accents, dark teal grounding, and a light gray canvas. Surfaces are soft, raised, and rounded with pill-shaped controls and generous touch targets.

The beginning page should feel beige and warm, using a subtle light pink dot-grid pattern with an ambient gradient wash. Cards use white translucent surfaces, large rounded corners, and color-tinted shadows.

## Screens

Setup: three source-pool panels with input fields, add buttons, and removable player chips.

Draw: a central segmented SVG/CSS spin wheel that displays the remaining names from the active group. The wheel selects the name only; the app assigns that name to Team 1 or Team 2 according to the workflow.

Workflow: within each group, selected names alternate between Team 1 and Team 2. If a group has an odd count, the next team in the sequence receives the first two selections from the next group.

Results: celebration-style cards for Team Alpha and Team Beta with share and start-over actions.

## Responsive Behavior

Mobile uses stacked screens with fixed bottom navigation for Setup, Randomize, and Results. Desktop uses a pill-shaped header navigation and multi-column layouts.
