---
name: Light Eid
colors:
  background: "#f8f3e8"
  surface: "#fffaf2"
  surface-container: "#ffffff"
  surface-container-high: "#fff3d8"
  outline: "rgba(107, 54, 6, 0.18)"
  on-surface: "#271a10"
  on-surface-variant: "#6e6254"
  primary: "#7a3f08"
  primary-container: "#fff3d8"
  secondary: "#f0cf86"
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
  xl: 1rem
spacing:
  unit: 8px
  container-max: 1200px
---

## TeamMixer

TeamMixer is a high-fidelity responsive web application for ديوانية الجيران and the game قرعة لعبة سين جيم. Users add players into three source groups, then spin a central wheel that selects a name from the current group.

## Visual System

The website uses a Light Eid design system: warm ivory background, paper-like panels, restrained brown and muted gold accents, and the Eid Mubarak reference image as a soft low-opacity background/watermark element. The setup hero uses the attached `البريجي يغني لكم لعبا ممتعا` wordmark image as the only content inside the hero box. The UI should feel professional, simple, and seasonal without becoming decorative or cluttered.

Typography uses Inter for English/interface text and Calibri for Arabic text. Arabic text must keep connected letterforms with no letter spacing.

## Components

Cards and panels use light surfaces, 1px warm low-contrast borders, and subtle shadows. Inputs are white paper fields with warm brown focus states. Buttons use a deep brown gradient with muted gold warmth. Wheel slices use soft cream, gold, blue-tint, and sage-tint colors with dark Arabic labels for legibility.

## Workflow

Setup: three team panels with input fields, add buttons, and removable player chips. The default groups are التنانين, الأسود, and الذئاب.

Draw: a central segmented SVG/CSS spin wheel that displays the remaining names from the active group. The wheel selects the name only; the app assigns that name to Team 1 or Team 2 according to the workflow.

Within each group, selected names alternate between Team 1 and Team 2. If a group has an odd count, the next team in the sequence receives the first two selections from the next group.

Results: final cards for Team 1 and Team 2 with share and start-over actions.

Categories: a fourth tab after Results. It uses a separate text-only wheel for category selection, with regular-weight vertical labels inside the wheel slices. Selected categories appear above the wheel as six cards arranged in a 3-by-2 grid, with larger card artwork and Arabic category names.

In one Categories session, only two categories from this group may be selected: دول و عواصم, جغرافيا, and سياحة وسفر. After two are selected, the remaining category from that group is excluded from the wheel.

Fixed mobile tabs must have enough safe-bottom page padding so the last visible content on any screen can scroll above the tab bar instead of being hidden behind it.
