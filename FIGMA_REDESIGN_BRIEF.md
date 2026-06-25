# TeamMixer Figma Redesign Brief

## Goal

Create a new mobile-first and tablet-ready Figma concept for TeamMixer without changing the deployed website. The design should preserve the Arabic RTL game flow, default groups, category rules, and current Light Modern Minimal quality, but reduce repeated title weight and make the active game screen feel more focused.

## Concept

Name: Majlis Game Console

Direction:

- Calm game-night interface, not a marketing page.
- Phone first, tablet second.
- Keep Arabic RTL and Western digits.
- Keep the app usable during a live gathering: large spin action, clear current group, visible teams, and low visual clutter.
- Reduce duplicate title hierarchy: use a compact top bar plus one screen-specific headline.

## Recommended Frames

1. Phone Setup: 390 x 844
2. Phone Draw: 390 x 844
3. Phone Categories: 390 x 844
4. Tablet Draw: 820 x 1180
5. Tablet Categories: 820 x 1180

## Visual System

Colors:

- Background: `#f6f3ec`
- Surface: `#ffffff`
- Surface soft: `#fbfaf7`
- Ink: `#211f1b`
- Muted text: `#777067`
- Border: `#e7e1d7`
- Primary teal: `#0f766e`
- Primary pressed: `#0b5d57`
- Team 2 amber: `#b45309`
- Dragon red: `#b3403a`
- Wolf blue: `#1d4ed8`
- Penguin slate: `#334155`

Typography:

- Prefer Cairo if available in Figma.
- Fallback: Noto Sans Arabic or Arial.
- No letter spacing for Arabic.
- Phone headline: 30-34px, bold.
- Section title: 16-18px, bold.
- Body/status: 13-15px.
- Player names: 18-22px, bold.

Shape and spacing:

- Main cards: 14-16px radius.
- Buttons: 12px radius.
- Repeated chips: 10-12px radius.
- Base spacing: 8px grid.
- Avoid oversized pills except the active bottom navigation item.

## Phone Layout

Top bar:

- Compact white bar.
- App title and small subtitle on the right.
- Sound icon button on the left.
- Do not repeat the main app title again immediately below.

Setup:

- Hero wordmark becomes a compact feature panel, not a dominant block.
- Player count and start button sit in a sticky action panel near the top.
- Group cards use two-column chips only when space allows; otherwise use one clean wrap flow.
- Add input and add button stay on one row.

Draw:

- Primary action button at the top of the game area.
- Wheel below action, centered, with enough breathing room.
- Current group/status card directly under wheel.
- Team counters side by side.
- Live team lists in stacked compact panels.
- Bottom nav remains fixed and never covers content at max scroll.

Categories:

- Six selected category slots at the top as a compact 3 x 2 grid.
- Spin category button before wheel.
- Wheel remains text-only.
- Status card below wheel with picked count and remaining count.

## Tablet Layout

Use a split workspace:

- Right side: active wheel and primary action.
- Left side: selected/results/status panels.
- Keep the top bar full-width.
- Avoid long single-line text blocks.
- Keep touch targets at least 44px.

Tablet Draw:

- Wheel column: 55-60% width.
- Team/status column: 40-45% width.
- Live team lists can be two columns inside the left panel if names fit.

Tablet Categories:

- Selected category cards on the left in 2 x 3.
- Wheel and spin control on the right.
- Picked/remaining counters below wheel.

## Interaction Notes

- Design should show selected nav state for each screen.
- Spin buttons should have one strong teal treatment.
- Secondary destructive/reset actions should stay quiet, outlined, and visually separate.
- Preserve current game rules and labels:
  - `الإعداد`
  - `القرعة`
  - `النتائج`
  - `الفئات`
  - `اسحب اسم`
  - `اسحب فئة`
  - `الفريق الأول`
  - `الفريق الثاني`

## Implementation Guardrails

- Do not deploy this concept until approved.
- Keep the static HTML/CSS/JS stack.
- Keep player-name escaping in render paths.
- Keep no-horizontal-overflow checks for phone and tablet.
- Verify on `390x844` and `820x1180` before any future publish.
