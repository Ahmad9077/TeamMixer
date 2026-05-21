# PROJECT_STATUS.md

## Current State

The TeamMixer web app is implemented as a static GitHub Pages site and is publicly available at:

`https://ahmad9077.github.io/TeamMixer/`

The app currently supports:

- Midnight Slate dark dashboard styling.
- Arabic title: `قرعة لعبة سين جيم` / `ديوانية الجيران`.
- Three editable Arabic groups.
- Default Arabic members for each group.
- Category logos for player names:
  - Red dragon for `التنانين`
  - Yellow lion for `الأسود`
  - Blue wolf for `الذئاب`
- Name-selection wheel.
- Direct final-player assignment without spinning.
- Live Team 1 and Team 2 lists during the draw.
- Results screen with final team lists.
- Categories screen with a separate category wheel and six selected category cards arranged three per row.
- Share Results and Start Over actions.
- Balance guard preventing either team from leading by 2 players.

## Completed

- Created `index.html`, `app.js`, `DESIGN.md`, and `README.md`.
- Created and published GitHub repo `Ahmad9077/TeamMixer`.
- Enabled GitHub Pages.
- Applied Midnight Slate design direction from Stitch.
- Replaced English default groups/members with Arabic groups/members.
- Changed Arabic typography to Calibri.
- Centered the primary Arabic title.
- Removed all `Source group` wording.
- Added attached group logo images as local assets:
  - `assets/dragon-red.jpg`
  - `assets/lion-yellow.jpg`
  - `assets/wolf-blue.jpg`
- Added attached game category cards as cropped local assets under `assets/categories/`.
- Added logos next to names in setup chips, draw lists, results, and wheel segments.
- Moved `SPIN NAME` above the wheel.
- Stabilized wheel layout so spinning does not expand page width.
- Increased player-name size and weight.
- Added live lists on the Draw screen.
- Verified recent behavior with local Playwright checks.
- Tuned the mobile Draw layout so the spin button and wheel appear above the fixed bottom navigation while desktop keeps the original two-column layout.
- Added a fourth `Categories` tab after `Results`.
- Replaced the oversized wheel center square with a smaller circular center badge.
- Increased mobile safe-bottom padding so fixed bottom tabs do not cover page content at max scroll.

## Current Decisions

- No build system is used.
- The app remains static and state is in-memory only.
- GitHub Pages deploys from the `main` branch root.
- `app.js` is the behavior source of truth.
- `DESIGN.md` documents the visual design direction.
- `AGENTS.md`, `PROJECT_STATUS.md`, and `TODO.md` should be updated alongside meaningful changes.

## Last Verified

Recent local checks confirmed:

- Mobile Draw wheel bottom stayed above the fixed bottom navigation on `390x844` (`548` vs nav top `777`).
- Mobile max-scroll checks for Setup, Draw, Results, and Categories ended active content above the fixed bottom tabs.
- Mobile scroll width stayed `390` during spin.
- Desktop scroll width stayed `1280`.
- Full default draw ended `5/6`.
- Maximum team difference stayed `1`.
- Category wheel selected 6 categories and disabled after the sixth pick.
- Category image assets exist locally and were published.
- Local category image assets loaded successfully in browser checks.
- Public GitHub Pages returned `HTTP 200` after the Categories deployment.
- Public HTML contains the updated mobile Draw layout classes and the new Categories tab markup.
- Public asset URLs returned `HTTP 200`.
- Sample public category asset URLs returned `HTTP 200`.

## Pending

- Perform any user-requested visual refinements after reviewing the live site.
- Consider replacing English UI labels such as `Setup`, `Draw`, `Results`, `Team 1`, `Team 2`, `Start Draw`, and `Share Results` with Arabic if requested.
- Consider adding a simple admin/reset guard only if requested.
- Confirm the mobile Draw and Categories screens on a physical phone after the next GitHub Pages deployment.

## Known Constraints

- This is a browser-only app; refresh resets state.
- The app relies on Tailwind CDN and Google Fonts for Inter.
- Calibri availability depends on the client system; it is standard on many systems but not guaranteed on every browser/device.
- The attached JPEG logos are committed as-is and not transparent cutouts.
