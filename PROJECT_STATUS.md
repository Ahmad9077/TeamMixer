# PROJECT_STATUS.md

## Current State

The TeamMixer web app is implemented as a static GitHub Pages site and is publicly available at:

`https://ahmad9077.github.io/TeamMixer/`

The app currently supports:

- Light Eid styling with a warm ivory background, brown/gold accents, and the Eid Mubarak reference image as a soft background/watermark.
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
- Applied the original Midnight Slate design direction from Stitch.
- Replaced Midnight Slate with a light professional Eid design after user approval.
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
- Removed category card photos from the category wheel segments.
- Refined category card crops to reduce the brown screenshot margin around selected category photos.
- Renamed the theater category to `مجمعات الكويت/ بوستر مسرح كبار`.
- Renamed the foreign art category to `ولا كلمة فن أجنبي`.
- Changed category wheel labels to smaller, regular-weight vertical text inside each slice.
- Limited `دول و عواصم`, `جغرافيا`, and `سياحة وسفر` so only two of those three can be selected in one Categories session.
- Added lightweight preloading for group logo and category image assets from the existing `pools` and `categories` data.
- Added the Eid Mubarak reference image as `assets/eid-mubarak-reference.jpg`.
- Removed the first-page `تصميم العيد` and `Teams setup` labels before deploying the light Eid design.
- Replaced the setup hero box contents with a dark-ink transparent Eid Mubarak wordmark asset at `assets/eid-mubarak-dark-ink.png`.
- Moved `البريجي` from `الأسود` to `التنانين`.
- Replaced the `حروف إسلامي` category with `ترتيب إسلامي` using `assets/categories/islamic-order.jpg`.

## Current Decisions

- No build system is used.
- The app remains static and state is in-memory only.
- GitHub Pages deploys from the `main` branch root.
- `app.js` is the behavior source of truth.
- `DESIGN.md` documents the visual design direction.
- `AGENTS.md`, `PROJECT_STATUS.md`, and `TODO.md` should be updated alongside meaningful changes.
- Current visual direction is Light Eid, not Midnight Slate.

## Last Verified

Recent local checks confirmed:

- On 2026-05-26, the live GitHub Pages site returned `HTTP 200`.
- On 2026-05-26, live `assets/eid-mubarak-reference.jpg`, `assets/eid-mubarak-dark-ink.png`, and `assets/categories/islamic-order.jpg` returned `HTTP 200`.
- On 2026-05-26, live `app.js` still contained `ترتيب إسلامي` and `البريجي`.
- On 2026-05-26, local syntax verification passed with `node --check app.js`.
- On 2026-05-26, local browser checks at mobile `390x844` and desktop `1280x900` confirmed no horizontal overflow and no broken rendered images.
- On 2026-05-26, local browser checks confirmed the mobile fixed bottom tabs did not cover Setup, Draw, Results, or Categories content at max scroll.
- On 2026-05-26, local browser checks confirmed the default draw assigned all 11 players, ended `5/6`, and kept the maximum team difference at `1`.
- On 2026-05-26, local browser checks confirmed Categories selected exactly 6 cards in a 3-column grid, kept the category wheel text-only, and allowed only 1 selected category from the limited geography/travel/capitals group in that run.
- Mobile Draw wheel bottom stayed above the fixed bottom navigation on `390x844` (`548` vs nav top `777`).
- Mobile max-scroll checks for Setup, Draw, Results, and Categories ended active content above the fixed bottom tabs.
- Mobile scroll width stayed `390` during spin.
- Desktop scroll width stayed `1280`.
- Full default draw ended `5/6`.
- Maximum team difference stayed `1`.
- Category wheel selected 6 categories and disabled after the sixth pick.
- Category wheel is text-only while selected category cards keep larger photos.
- Category wheel labels use regular-weight vertical text.
- Category limit rule excludes the third category from the limited geography/travel/capitals group after two are selected.
- Category image assets exist locally and were published.
- Local category image assets loaded successfully in browser checks.
- Public GitHub Pages returned `HTTP 200` after the Categories deployment.
- Public HTML contains the updated mobile Draw layout classes and the new Categories tab markup.
- Public `app.js` contains the renamed category and no category-wheel image or clip-path markup.
- Public asset URLs returned `HTTP 200`.
- Sample public category asset URLs returned `HTTP 200`.
- Local syntax check passed after adding image preloading.
- Local headless Chrome checks after image preloading confirmed mobile `390x844` and desktop `1280x900` had no horizontal overflow.
- Local headless Chrome checks confirmed all 19 logo/category image assets were requested, no rendered images were broken, and the category wheel still contained no image elements.
- Local headless Chrome max-scroll checks confirmed Setup, Draw, Results, and Categories content stayed above the fixed mobile tabs.
- Local Light Eid checks confirmed the `تصميم العيد` and `Teams setup` labels are not displayed.
- Local Light Eid checks confirmed the Eid reference image loads, mobile `390x844` and desktop `1280x900` have no horizontal overflow, no rendered images are broken, and the category wheel still contains no image elements.
- Local Light Eid behavior checks confirmed the default draw assigns all 11 players with final teams `5/6` and the category limit rule still allows at most two limited geography/travel/capitals categories.
- GitHub Pages reached `built` after deploying the Light Eid design.
- Public GitHub Pages returned `HTTP 200`, public `assets/eid-mubarak-reference.jpg` returned `HTTP 200`, public HTML contains the Eid background reference, and public HTML no longer contains `تصميم العيد` or `Teams setup`.
- Public `app.js` contains the light wheel palette and dark wheel label colors.
- Local hero-box checks confirmed the setup hero contains exactly one dark-ink wordmark image, no hero text, no crescent element, and no broken rendered images on mobile `390x844` or desktop `1280x900`.
- Local category/player checks confirmed `البريجي` is in `التنانين`, no longer in `الأسود`, total players remains `11`, the default draw finishes `5/6`, `حروف إسلامي` is removed from the category data, and `ترتيب إسلامي` renders with `assets/categories/islamic-order.jpg`.

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
