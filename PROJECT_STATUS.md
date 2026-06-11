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
- Replaced the setup hero box contents with the attached `البريجي يغني لكم لعبا ممتعا` image at `assets/breiji-game-wordmark.jpg`.
- Moved `بوحمد` from `التنانين` to `الأسود`.
- Moved `قرطبة` from `الأسود` to `الذئاب`.
- Renamed the theater category to `بوستر مسرح كبار` and replaced its poster asset at `assets/categories/theater-poster.jpg`.
- Removed the `بوستر مسرح كبار` and `رياضة` categories.
- Added the `ترتيب` category with `assets/categories/order.jpg`.
- Added the `صوت المشهور` category with `assets/categories/celebrity-voice.jpg`.
- Moved `الخلف`, `الهلالي`, and `قرطبة` to `الأسود`, and added `موسى` to `الذئاب`.
- Constrained selected category card dimensions so tall category images cannot stretch tablet layouts.
- Replaced the setup hero box image with the attached `عدنا والعود أحمد` image at `assets/adnan-return-wordmark.jpg`.
- Changed selected category cards to portrait artwork slots that use `object-fit: contain` so selected category photos appear nearly complete instead of being cropped.
- Replaced the setup hero box image with the attached `الخميس الونيس` image at `assets/khamis-wanees-wordmark.jpg` and increased the hero image area so the square artwork stays readable.
- Localized the entire UI to Arabic RTL: `<html lang="ar" dir="rtl">`, all visible English strings replaced with Arabic (الإعداد/القرعة/النتائج/الفئات, الفريق الأول/الفريق الثاني, اسحب اسم/اسحب فئة, etc.) while keeping Western digits.
- Replaced Inter/Calibri with Cairo from Google Fonts (preconnect + `font-display: swap`, Calibri fallback) applied globally including SVG wheel labels.
- Removed the Share Results feature; the Results screen keeps only `من جديد`.
- Added `localStorage` persistence under `seenjeem_state_v1` (players, draw progress, teams, picked categories, active screen) saved on every state change and restored on load. `من جديد` clears all stored state and restores default players; `تصفير الفئات` resets only category state. No cross-session history: shuffles are fresh each session and used categories are never excluded.
- Replaced `Math.random` randomization with Fisher-Yates and `crypto.getRandomValues` (rejection sampling) for both the name draw and the category draw.
- Responsive polish: tablet (768px+) now gets the two-column Draw/Categories layouts, three-column setup pools, and two-column results panels (previously desktop-only at 1024px); full-width primary buttons on phones; all buttons at least 44px tall, including larger player-remove buttons.
- Added explicit `width="980" height="687"` and `fetchpriority="high"` to the setup wordmark image to prevent layout shift.
- Redesigned the whole UI with a Light Modern Minimal design system (user-approved direction): porcelain `#f7f5f1` background, white panels with 1px `#e9e5dd` borders and soft shadows, deep teal `#0f766e` as the single primary accent (buttons, active nav, eyebrows, wheel pointer, team 1) and amber `#b45309` for team 2, high-contrast group accents (red/amber/blue), and a soft pastel wheel palette with white separators.
- Replaced the legacy Midnight Slate CSS plus Light Eid override cascade with one clean stylesheet of semantic classes (`.panel`, `.btn-primary`, `.btn-secondary`, `.field`, `.chip`, `.stat-box`, `.row`, `.empty-note`, `.nav-active`, `.wheel-pointer`), and removed arbitrary hex Tailwind classes from `app.js` templates; nav active state now toggles a single `nav-active` class.
- Removed the Eid watermark background and crescent styling; kept a single hero wordmark image.
- Stacked the Draw screen live team lists in one column at `md` widths (narrow side panel) so player names are not truncated, returning to two columns at `lg`.
- Added fun synthesized sound effects via the Web Audio API (no audio files, still zero dependencies): a whoosh on spin start, wheel ticks that follow the spin deceleration for both the name and category wheels, a randomized pool of five celebration sounds on each pick (fanfare, party horn, slide whistle, boing, sparkle arpeggio), and a grand finale with applause when the draw completes or the sixth category lands.
- Added the user's third voice clip as `assets/sounds/celebration-voice-1.mp3` (7.4s): after a player is selected it gets a 50/50 random chance against the synthesized celebration pool (when eligible), always plays to its natural end, and never plays for a player whose spin already used a spin voice clip (no two mp3 sounds for the same player). It does not play for category picks.
- Added a header 🔊/🔇 sound toggle; the preference persists under `seenjeem_sound_v1` (separate from game state so `من جديد` keeps the setting). The AudioContext is created lazily on first interaction to satisfy autoplay policies, and all sound entry points are wrapped in try/catch so audio can never break the game.

- Added the user's voice clips as `assets/sounds/spin-voice-1.mp3` (6.9s) and `assets/sounds/spin-voice-2.mp3` (6.8s) and mixed them into the player wheel spin: each spin randomly picks between the voice clips and the synthesized ticks (equal slots via `spinClips` in `app.js`), with a chosen clip always playing to its natural end even after the wheel lands. The category wheel keeps ticks only. Clip playback routes through the master gain so the 🔊/🔇 toggle controls it.

- Kept the landed player visible on the wheel after each spin: the wheel display freezes at the landing moment (selected player still under the pointer) while the player joins the live team lists, and only refreshes without them when the next spin starts. «ابدأ القرعة» and «من جديد» clear the frozen wheel.

- Added the user's fourth voice clip as `assets/sounds/player-breiji.mp3` (14.5s), dedicated to `البريجي` via the `playerClips` registry: it always plays right after he is chosen (including as the final direct-assigned player, where synthesized applause joins it instead of the standard finale), his spin uses the synthesized ticks only, and none of the other voice clips ever play for him.

## Current Decisions

- No build system is used.
- The app remains static; state persists in `localStorage` under `seenjeem_state_v1`.
- The UI is fully Arabic RTL with Cairo typography and Western digits.
- Current visual direction is Light Modern Minimal (replaces Light Eid).
- GitHub Pages deploys from the `main` branch root.
- `app.js` is the behavior source of truth.
- `DESIGN.md` documents the visual design direction.
- `AGENTS.md`, `PROJECT_STATUS.md`, and `TODO.md` should be updated alongside meaningful changes.
- Current visual direction is Light Eid, not Midnight Slate.

## Last Verified

Recent local checks confirmed:

- On 2026-06-11, GitHub Pages reached `built` after deploying `6f5d7dc`, public GitHub Pages returned `HTTP 200`, public `assets/khamis-wanees-wordmark.jpg` returned `HTTP 200`, and public HTML references `assets/khamis-wanees-wordmark.jpg` with alt text `الخميس الونيس`.
- On 2026-06-11, local headless Chrome checks at mobile `390x844`, tablet `820x1180`, and desktop `1280x900` confirmed the setup hero uses `assets/khamis-wanees-wordmark.jpg`, the image loads at `1280x1187`, stays inside the hero box, has no broken rendered images, and creates no horizontal overflow.
- On 2026-06-10, after adding sound effects, the 36-check Playwright suite passed again and a dedicated audio smoke test confirmed: the AudioContext is created on the first spin (user gesture) and reaches `running`, muting suspends it and stores `seenjeem_sound_v1=off`, the muted state survives reload, unmuting works, and a full draw plus six category picks complete with zero page errors.
- On 2026-06-10, after the Light Modern Minimal redesign, the same 36-check Playwright suite passed again at `360x740`, `375x812`, and `768x1024` (RTL, zero English strings, persistence, clean reset, full 6/6 draw, category rules, no overflow, 44px touch targets, no broken images), and screenshots confirmed the new design renders correctly on all four screens at phone and tablet widths with no truncated player names in the Draw live lists.
- On 2026-06-10, `node --check app.js` passed and a 36-check local Playwright suite passed at `360x740`, `375x812`, and `768x1024`: full RTL (`lang="ar" dir="rtl"`), zero visible English strings on all four screens, no horizontal overflow, all touch targets at least 44px, full default draw assigns all 12 players ending `6/6`, refresh restores teams/players/picked categories/active screen from `seenjeem_state_v1`, `من جديد` resets clean (players back to defaults, storage cleared), `تصفير الفئات` restores all 16 categories, the limited geography/travel/capitals rule holds, tablet layouts use two/three columns, the wordmark has explicit dimensions, and no images are broken.

- On 2026-06-08, local headless Chrome checks at mobile `390x844`, tablet `820x1180`, and desktop `1280x900` confirmed selected category cards use portrait artwork slots, all selected category images use `object-fit: contain`, images stay inside their slots, card heights remain equal, no rendered images are broken, and there is no horizontal overflow.
- On 2026-06-08, GitHub Pages reached `built` after deploying `e310150`, public GitHub Pages returned `HTTP 200`, public `assets/adnan-return-wordmark.jpg` returned `HTTP 200`, and public HTML references `assets/adnan-return-wordmark.jpg` with alt text `عدنا والعود أحمد`.
- On 2026-06-08, local headless Chrome checks at mobile `390x844`, tablet `820x1180`, and desktop `1280x900` confirmed the setup hero uses `assets/adnan-return-wordmark.jpg`, the image loads at `980x687`, stays inside the hero box, has no broken rendered images, and creates no horizontal overflow.
- On 2026-06-08, GitHub Pages reached `built` after deploying `c35e36f`.
- On 2026-06-08, public GitHub Pages returned `HTTP 200`, and public `assets/categories/order.jpg` and `assets/categories/celebrity-voice.jpg` returned `HTTP 200`.
- On 2026-06-08, public `app.js` contains `ترتيب`, `صوت المشهور`, `موسى`, and `الخلف`/`الهلالي`/`قرطبة` under `الأسود`, with no active `بوستر مسرح كبار`, `رياضة`, `theater-poster`, or `sports` category entries.
- On 2026-06-08, local syntax verification passed with `node --check app.js`.
- On 2026-06-08, local asset checks confirmed `assets/categories/order.jpg` and `assets/categories/celebrity-voice.jpg` returned `HTTP 200`.
- On 2026-06-08, local headless Chrome checks at mobile `390x844`, tablet `820x1180`, and desktop `1280x900` confirmed no horizontal overflow, no broken rendered images, and no images inside the category wheel.
- On 2026-06-08, local headless Chrome checks confirmed active Categories has 16 entries, includes `ترتيب`, `صوت المشهور`, and `ترتيب إسلامي`, and excludes `بوستر مسرح كبار` and `رياضة`.
- On 2026-06-08, local headless Chrome checks confirmed six selected category cards stay equal-height and selected category images remain inside their card slots on mobile, tablet, and desktop.
- On 2026-06-08, local headless Chrome checks confirmed the default groups include `الخلف`, `الهلالي`, and `قرطبة` in `الأسود`, include `موسى` in `الذئاب`, and the default draw assigns all 12 players with final teams `6/6`.
- On 2026-06-08, local headless Chrome checks confirmed the category limit rule still excludes the third geography/travel/capitals category after two limited categories are selected.
- On 2026-05-28, local syntax verification passed with `node --check app.js`.
- On 2026-05-28, local asset checks confirmed `assets/breiji-game-wordmark.jpg` and `assets/categories/theater-poster.jpg` returned `HTTP 200`.
- On 2026-05-28, local headless Chrome checks at mobile `390x844` and desktop `1280x900` confirmed no horizontal overflow and no broken rendered images.
- On 2026-05-28, local headless Chrome checks confirmed the setup hero uses `assets/breiji-game-wordmark.jpg`.
- On 2026-05-28, local headless Chrome checks confirmed the default groups are `التنانين` with 5 players, `الأسود` with `بوحمد`, and `الذئاب` with `قرطبة`.
- On 2026-05-28, local headless Chrome checks confirmed the default draw assigned all 11 players, ended `5/6`, and kept the maximum team difference at `1`.
- On 2026-05-28, local headless Chrome checks confirmed Categories selected exactly 6 cards, selected `بوستر مسرح كبار` correctly when it appeared, kept the category wheel text-only, and kept the limited geography/travel/capitals count at `1` in that run.
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

- User review of the Arabic RTL localization, persistence, and responsive changes before pushing/deploying.
- Perform any user-requested visual refinements after reviewing the live site.
- Consider adding a simple admin/reset guard only if requested.
- Confirm the mobile Draw and Categories screens on a physical phone after the next GitHub Pages deployment.
- Optionally convert `assets/adnan-return-wordmark.jpg` to WebP (no conversion tooling was available in the work environment).

## Known Constraints

- This is a browser-only app; state persists in `localStorage` on the same device/browser only.
- The app relies on Tailwind CDN and Google Fonts for Cairo.
- The attached JPEG logos are committed as-is and not transparent cutouts.
