# PROJECT_STATUS.md

## Current State

The TeamMixer web app is implemented as a static GitHub Pages site and is publicly available at:

`https://ahmad9077.github.io/TeamMixer/`

The app currently supports:

- Light Modern Minimal styling with a porcelain background, clean white panels, deep teal primary accent, amber team 2 identity, and a single setup wordmark image.
- Arabic title: `قرعة لعبة سين جيم` / `ديوانية الجيران`.
- Four editable Arabic groups.
- Default Arabic members for each group.
- Category logos for player names:
  - Dragon-slayer image for `جلاد التنانين`
  - Red dragon for `التنانين`
  - Yellow lion for `الأسود`
  - Blue wolf for `الذئاب`
- Name-selection wheel.
- Full wheel spin for every player, including the last remaining player in a group.
- Live Team 1 and Team 2 lists during the draw.
- Results screen with final team lists.
- Categories screen with a separate category wheel and six selected category cards arranged three per row.
- Start Over action on Results. The previous Share Results action is intentionally removed.
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
- Recovered GitHub Pages deployment after the legacy Pages queue stalled; Pages was disabled and re-enabled with the same `main` / root source, then rebuilt successfully.
- Tuned the mobile Draw layout so the spin button and wheel appear above the fixed bottom navigation while desktop keeps the original two-column layout.
- Added a fourth `Categories` tab after `Results`.
- Replaced the oversized wheel center square with a smaller circular center badge.
- Increased mobile safe-bottom padding so fixed bottom tabs do not cover page content at max scroll.
- Removed category card photos from the category wheel segments.
- Refined category card crops to reduce the brown screenshot margin around selected category photos.
- Renamed the theater category to `مجمعات الكويت/ بوستر مسرح كبار`.
- Renamed the foreign art category to `ولا كلمة فن أجنبي`.
- Changed category wheel labels to smaller, regular-weight vertical text inside each slice.
- Replaced split SVG category labels with single, unbroken HTML Arabic phrases layered over the wheel. Each label uses native `dir="rtl"`, `lang="ar"`, connected Cairo text, no wrapping, and upright radial rotation; the label layer rotates together with the SVG wheel for more reliable RTL rendering across Chrome and Safari/iPad.
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
- Replaced the active `ترتيب إسلامي` category with `سيرة ذاتية` using `assets/categories/biography.jpg`.
- Removed the active `سيرة ذاتية` and `صوت المشهور` categories, then added `مشاهير صغار` with `assets/categories/young-celebrities.jpg` and `حروف متحركة` with `assets/categories/moving-letters.jpg`.
- Replaced the active `مشاهير صغار` category with `السيرة النبوية` using `assets/categories/prophetic-biography.jpg`.
- Replaced the active `تاريخ` category with `رياضة` using the newly supplied `assets/categories/sports.jpg`. Persisted category state transparently migrates the legacy `history` ID to `sports`.
- Removed the active `ترتيب` and `السيرة النبوية` categories, then added `ولا كلمة` with `assets/categories/no-word.jpg` and `مجمعات الكويت` with `assets/categories/kuwait-malls.jpg`.
- Added a category limit rule so only one of `ولا كلمة` and `ولا كلمة فن أجنبي` can be selected in one Categories session.
- Added the lower-than-`الذئاب` group `البطاريق` with the member `بوجمال`, using `assets/penguin-black.jpg`.
- Added the dedicated post-selection clip `assets/sounds/player-bujamal.mp3` for `بوجمال`, following the existing `البريجي` rule: synthesized ticks during the spin, his own clip after selection, and no other MP3 for that player.
- Moved `بوجمال` from `البطاريق` to `الذئاب`; `البطاريق` remains available as an editable group with no default members.
- Added a persisted-state migration so older browsers that still have `بوجمال` saved under `البطاريق` automatically move him to `الذئاب`, including saved draw queues and assigned/team rows, while preserving his dedicated audio clip.
- Added `.nojekyll` so GitHub Pages serves the static site directly without Jekyll processing.
- Moved `بوحمد` from `الأسود` to `التنانين`, and moved `عليوي` from `الذئاب` to `الأسود`.
- Moved `الخلف`, `الهلالي`, and `قرطبة` to `الأسود`, and added `موسى` to `الذئاب`.
- Moved `قرطبة` from `الأسود` back to `الذئاب`.
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
- Removed `celebration-voice-1.mp3` from the active random post-selection pool at the user's request. `celebrationClips` is now empty, so non-dedicated players receive only synthesized celebration sounds; the MP3 remains an inactive repository asset.
- Added a header 🔊/🔇 sound toggle; the preference persists under `seenjeem_sound_v1` (separate from game state so `من جديد` keeps the setting). The AudioContext is created lazily on first interaction to satisfy autoplay policies, and all sound entry points are wrapped in try/catch so audio can never break the game.

- Added the user's voice clips as `assets/sounds/spin-voice-1.mp3` (6.9s) and `assets/sounds/spin-voice-2.mp3` (6.8s) and mixed them into the player wheel spin: each spin randomly picks between the voice clips and the synthesized ticks (equal slots via `spinClips` in `app.js`), with a chosen clip always playing to its natural end even after the wheel lands. The category wheel keeps ticks only. Clip playback routes through the master gain so the 🔊/🔇 toggle controls it.
- Removed `spin-voice-2.mp3` from the active `spinClips` pool at the user's request. The file remains an inactive repository asset; eligible player spins now choose only between Voice 1 and synthesized wheel sounds.
- Removed `spin-voice-1.mp3` from the active pool as well. `spinClips` is now empty, so all wheel spins use generated whoosh/tick sounds only; both spinning voice files remain inactive repository assets.

- Kept the landed player visible on the wheel after each spin: the wheel display freezes at the landing moment (selected player still under the pointer) while the player joins the live team lists, and only refreshes without them when the next spin starts. «ابدأ القرعة» and «من جديد» clear the frozen wheel.

- Added the user's fourth voice clip as `assets/sounds/player-breiji.mp3`, dedicated to `البريجي` via the `playerClips` registry: it always plays right after he is chosen (including when he is the final player, where synthesized applause joins it instead of the standard finale), his spin uses the synthesized ticks only, and none of the other voice clips ever play for him. The original published clip was trimmed to start at `5.3s` of the original 14.5-second recording.
- Added the user's Hamid voice clip as `assets/sounds/player-hameed.mp3` (2.7s), dedicated to `حميد` via the same `playerClips` rule used for `البريجي`: it plays right after he is chosen, his spin uses synthesized ticks only, and none of the other voice clips play for him.
- Replaced `حميد`'s dedicated post-selection clip with the newer supplied recording, keeping the same `assets/sounds/player-hameed.mp3` path and dedicated-player rule.
- Added dedicated post-selection clips for `الملا`, `حمود`, `عليوي`, `بوحمد`, and `الخلف` under `assets/sounds/`. Each follows the existing `البريجي` rule: synthesized ticks during the spin, the player's own clip after selection, and no other MP3 for that player. The supplied `حمود.m4a` was converted to MP3 for consistent browser decoding.
- Added enhanced dedicated post-selection clips for `قرطبة`, `موسى`, `طروق`, and `جراغ`. The supplied recording labelled `مويس` is mapped to the roster player `موسى`; displayed roster names remain unchanged. Each clip follows the existing dedicated-player rule and is normalized as a 48 kHz stereo 320 kbps MP3 near `-15 LUFS`.
- Increased the mastered loudness of the `موسى` clip from `-14.87 LUFS` to `-11.87 LUFS` with a safe `-2.12 dBTP` peak, improving its perceived volume while preserving its duration and audio format.
- Enhanced all seven dedicated player clips to match the random post-selection voice more closely: conservative speech filtering, light compression, loudness normalization near `-15 LUFS`, and consistent 48 kHz stereo 320 kbps MP3 encoding. Clip durations remain unchanged except when explicitly replaced or trimmed in later requests.
- Replaced `البريجي`'s dedicated post-selection clip with the latest supplied full recording, keeping the same `assets/sounds/player-breiji.mp3` path and the same dedicated-player rule. The replacement is normalized near `-15 LUFS` and encoded as a 48 kHz stereo 320 kbps MP3.
- Re-ranked the player groups to four requested levels: `جلاد التنانين` (`جراغ`, `الملا`, `طروق`) with `assets/dragon-slayer.jpg`, `التنانين` (`حميد`, `البريجي`, `بوحمد`), `الأسود` (`عليوي`, `الخلف`, `الهلالي`), and `الذئاب` (`حمود`, `مويس`, `قرطبة`). The saved-state roster version now resets older stored rosters to this new ranking on first load after deployment, while future edits continue to persist normally.
- Changed the one-player group state to perform the normal wheel spin instead of assigning directly. Its full name and group logo render radially outside the `سين جيم` center badge and land upright near the pointer.

## Current Decisions

- No build system is used.
- The app remains static; state persists in `localStorage` under `seenjeem_state_v1`.
- The UI is fully Arabic RTL with Cairo typography and Western digits.
- Current visual direction is Light Modern Minimal (replaces Light Eid).
- GitHub Pages deploys from the `main` branch root.
- `app.js` is the behavior source of truth.
- `DESIGN.md` documents the visual design direction.
- `AGENTS.md`, `PROJECT_STATUS.md`, and `TODO.md` should be updated alongside meaningful changes.
- User-entered player names are escaped before rendering so names cannot inject HTML or script through setup chips, wheel labels, live lists, or results lists.
- `FIGMA_REDESIGN_BRIEF.md` remains historical only. The Figma redesign direction was cancelled by the user, and the related suggestion pages were removed from the Figma file.

## Last Verified

Recent local checks confirmed:

- On 2026-07-02, GitHub Pages reached `built` after deploying `cadd460`; public GitHub Pages returned `HTTP 200`, public `app.js` contains `جلاد التنانين`, `مويس`, `assets/dragon-slayer.jpg`, and `ROSTER_VERSION = 2`, and public `assets/dragon-slayer.jpg` returned `HTTP 200`. The failed deploys were caused by GitHub Pages staying in `deployment_queued` until timeout, not by the app artifact.
- On 2026-07-02, `node --check app.js` and `git diff --check` passed after re-ranking the player groups. Local headless Chrome at mobile `390x844` and desktop `1280x900` confirmed the four groups are `جلاد التنانين`, `التنانين`, `الأسود`, and `الذئاب` with exactly three requested players each; `assets/dragon-slayer.jpg` loads at `348x672`; stale `seenjeem_state_v1` without the current `rosterVersion` resets to the new roster; `مويس` maps to `assets/sounds/player-mousa.mp3`; `spinClips` and `celebrationClips` remain empty; a full default draw assigns all 12 players, ends `6/6`, keeps max team difference at `1`, and has no horizontal overflow.
- On 2026-07-02, GitHub Pages reached `built` after deploying `2ad7dbc`; the public site returned `HTTP 200`, public `app.js` still maps `البريجي` to `assets/sounds/player-breiji.mp3` with empty `spinClips` and `celebrationClips`, and the public `player-breiji.mp3` returned `HTTP 200` as the 5.664-second 48 kHz stereo 320 kbps replacement.
- On 2026-07-02, `البريجي`'s dedicated clip was replaced from the newly supplied `البريجي.mp3` recording. The rebuilt `assets/sounds/player-breiji.mp3` is a 5.664-second 48 kHz stereo 320 kbps MP3 measuring `-15.00 LUFS`; `ffprobe`, full MP3 decode through `ffmpeg`, `node --check app.js`, and `git diff --check` passed. No `app.js` mapping change was needed because `البريجي` already points to `assets/sounds/player-breiji.mp3`.
- On 2026-06-25, added a localStorage migration for `بوجمال` so stale saved setup/draw state moves him from `البطاريق` to `الذئاب` automatically, moves any saved draw queue entry back to the wolf queue, preserves/repairs assigned and team rows as wolf entries, and keeps `assets/sounds/player-bujamal.mp3` as his dedicated post-selection audio. `node --check app.js`, `git diff --check`, and local headless Chrome checks against fresh plus stale saved states passed.
- On 2026-06-25, `حميد`'s dedicated clip was replaced from the supplied `حميد٢.mp3` recording. The rebuilt `assets/sounds/player-hameed.mp3` is a 7.789-second 48 kHz stereo 320 kbps MP3 measuring about `-15.7 LUFS`; `node --check app.js`, `git diff --check`, and `ffprobe` passed. No `app.js` mapping change was needed because `حميد` already points to `assets/sounds/player-hameed.mp3`.
- On 2026-06-25, `node --check app.js` and `git diff --check` passed after moving `بوجمال` from `البطاريق` to `الذئاب`. Local headless Chrome at mobile `390x844` and desktop `1280x900` confirmed `الذئاب` contains `حمود`, `موسى`, `قرطبة`, and `بوجمال`; `البطاريق` remains after `الذئاب` with no default members; `بوجمال` still maps to `assets/sounds/player-bujamal.mp3`; a full default draw assigns all 13 players with `بوجمال` under `الذئاب`, final teams `6/7`, and no horizontal overflow.
- On 2026-06-25, local review fixes escaped user-entered player names before HTML/SVG rendering, updated stale docs from three groups to four groups, corrected current-state documentation from Light Eid/Share Results to Light Modern Minimal/Start Over only, and added `FIGMA_REDESIGN_BRIEF.md`. A new Figma file was created, but canvas editing was blocked by the Figma Starter-plan MCP tool-call limit. No deployment was performed.
- On 2026-06-25, after the Figma Professional plan upgrade, the TeamMixer redesign preview file was populated with five Cairo-based RTL frames: Phone Setup, Phone Draw, Phone Categories, Tablet Draw, and Tablet Categories. Figma screenshots were checked for phone `390x844` and tablet `820x1180`; headline collisions and phone setup/nav spacing were corrected. No website deployment was performed.
- On 2026-06-25, user rejected the first Figma concept and requested a stricter visual-only refresh of the existing Arabic RTL design. Created the new Figma page `TeamMixer Visual Refresh v2 - RTL` with Phone Setup, Phone Draw, Phone Categories, Tablet Draw, and Tablet Categories frames. The v2 concept keeps the current screen structure, right-to-left mobile tab order, and existing UI labels, removes explanatory/comment text, uses Tajawal where available, and was screenshot-checked at phone `390x844` and tablet `820x1180`. No website code was changed or deployed.
- On 2026-06-25, user rejected the v2 concept and cancelled the TeamMixer redesign idea. Removed the Figma pages `TeamMixer Redesign Preview` and `TeamMixer Visual Refresh v2 - RTL`; no website code was changed or deployed.

- On 2026-06-23, GitHub Pages reached `built` after deploying `fbe5741`; the public site, `assets/categories/no-word.jpg`, and `assets/categories/kuwait-malls.jpg` returned `HTTP 200`, and public `app.js` contains active `ولا كلمة`, `مجمعات الكويت`, `categoryLimitGroups`, and the `["no-word", "foreign-word"]` one-of-two rule with no active `ترتيب` or `السيرة النبوية` category entries.
- On 2026-06-23, `node --check app.js` and `git diff --check` passed after replacing `ترتيب` and `السيرة النبوية` with `ولا كلمة` and `مجمعات الكويت`. Local headless Chrome at mobile `390x844` and desktop `1280x900` confirmed Categories remains 16 entries, includes `ولا كلمة` / `assets/categories/no-word.jpg` and `مجمعات الكويت` / `assets/categories/kuwait-malls.jpg`, excludes active `ترتيب` and `السيرة النبوية`, loads both new images, preserves the existing geography/travel/capitals limit, enforces the new one-of-two limit between `ولا كلمة` and `ولا كلمة فن أجنبي` in both directions, and has no horizontal overflow.
- On 2026-06-23, GitHub Pages reached `built` after deploying `71701f4`; the public site, `assets/penguin-black.jpg`, and `assets/sounds/player-bujamal.mp3` returned `HTTP 200`, and public `app.js` contains `البطاريق`, `بوجمال`, `assets/penguin-black.jpg`, `assets/sounds/player-bujamal.mp3`, plus empty `spinClips` and `celebrationClips` pools.
- On 2026-06-23, `node --check app.js` and `git diff --check` passed after adding `البطاريق` and `بوجمال`. The new `assets/sounds/player-bujamal.mp3` decodes as a 9.7-second 48 kHz stereo 320 kbps MP3 near the dedicated-player loudness target, and `assets/penguin-black.jpg` is `758x568`. Local headless Chrome at mobile `390x844` and desktop `1280x900` confirmed the group order is `التنانين`, `الأسود`, `الذئاب`, `البطاريق`; `بوجمال` is the only default member of `البطاريق`; his clip is registered in `playerClips`; both MP3 voice pools remain empty; the penguin image loads; all 13 default players assign with final teams `6/7`; and there is no horizontal overflow.
- On 2026-06-18, GitHub Pages reached `built` after deploying `3d83cd1`; the public site and `assets/categories/sports.jpg` returned `HTTP 200`, and public `app.js` contains active `رياضة` plus the persisted-state `history` to `sports` migration.
- On 2026-06-18, `node --check app.js` and `git diff --check` passed after replacing `تاريخ` with `رياضة`. Local headless Chrome confirmed fresh sessions keep 16 categories with `رياضة`/`assets/categories/sports.jpg` and no `تاريخ`; persisted queue/selection state migrates `history` to `sports`; the new 773x973 image loads and stays contained on mobile `390x844` and desktop `1280x900`; and there is no horizontal overflow.
- On 2026-06-18, GitHub Pages reached `built` after deploying `c97227f`; the public site returned `HTTP 200`, and direct analysis of the downloaded public `player-mousa.mp3` confirmed the louder `-11.87 LUFS` / `-2.12 dBTP` master is live.
- On 2026-06-18, `player-mousa.mp3` was remastered from its original supplied source to address low perceived volume. The replacement measures `-11.87 LUFS` and `-2.12 dBTP`, remains a 4.405-second 48 kHz stereo 320 kbps MP3, and passes `ffprobe`; `node --check app.js` and `git diff --check` also passed.
- On 2026-06-18, GitHub Pages reached `built` after deploying `c0e7bfa`; the public site and all four new dedicated player MP3 URLs returned `HTTP 200`, and public `app.js` contains the exact mappings for `قرطبة`, `موسى`, `طروق`, and `جراغ` while both random voice pools remain empty.
- On 2026-06-18, dedicated clips for `قرطبة`, `موسى`, `طروق`, and `جراغ` were enhanced to 48 kHz stereo 320 kbps MP3 at `-14.75` to `-14.87 LUFS`. Local headless Chrome decoded all four through the app's Web Audio path and confirmed exact mappings, normal spins with synthesized sounds only, matching post-selection clips, successful assignment, empty random/spinning voice pools, and no horizontal overflow. `node --check app.js` and `git diff --check` passed.
- On 2026-06-18, GitHub Pages reached `built` after deploying `ef1a668`; the public site returned `HTTP 200`, public `app.js` contains empty `spinClips` and `celebrationClips` arrays, and there is no `celebration-voice-1` reference.
- On 2026-06-18, `celebrationClips` was emptied and `app.js` no longer contains a `celebration-voice-1.mp3` reference, so the random post-selection voice is neither fetched nor eligible for playback. `spinClips` remains empty, dedicated player mappings are unchanged, and `node --check app.js` plus `git diff --check` passed.
- On 2026-06-18, commit `e22905b` was deployed after manually retriggering a stalled legacy Pages build; GitHub Pages reached `built`, the public site returned `HTTP 200`, public `app.js` contains an empty `spinClips` array, and the public `player-breiji.mp3` is the updated 9.2-second file.
- On 2026-06-18, `spinClips` was emptied so neither `spin-voice-1.mp3` nor `spin-voice-2.mp3` can be fetched or selected during a spin. The enhanced `player-breiji.mp3` was rebuilt directly from the original 14.5-second source at `5.3s`; `ffprobe` confirmed a valid 9.2-second, 48 kHz stereo 320 kbps MP3, and loudness measured `-14.8 LUFS`. `node --check app.js` and `git diff --check` passed.
- On 2026-06-18, GitHub Pages reached `built` after deploying `f8f4930`; SHA-256 checks confirmed all seven public dedicated player MP3 files exactly match the locally verified enhanced binaries.
- On 2026-06-18, all seven dedicated player clips were enhanced with conservative speech filtering, light compression, and loudness normalization against the `celebration-voice-1.mp3` reference. Measurements place the enhanced clips between `-14.6` and `-15.3 LUFS` versus the reference's `-14.9 LUFS`; all are 48 kHz stereo 320 kbps MP3 with unchanged durations. Local headless Chrome decoded every clip through the app's Web Audio path, preserved the 9.4-second `البريجي` trim, and showed no horizontal overflow. `node --check app.js` and `git diff --check` passed.
- On 2026-06-18, GitHub Pages reached `built` after deploying `6a70b32`; the public site returned `HTTP 200`, and downloading the public `player-breiji.mp3` confirmed GitHub Pages serves the trimmed 9.4-second MP3.
- On 2026-06-18, `player-breiji.mp3` was accurately re-encoded from the original recording's `5.1s` mark. `ffprobe` confirmed the replacement is a valid 9.4-second MP3, and `node --check app.js` plus `git diff --check` passed.
- On 2026-06-18, GitHub Pages reached `built` after deploying `5ea8a7c`; the public site returned `HTTP 200`, and public `app.js` contains only `spin-voice-1.mp3` in `spinClips` with no `spin-voice-2` reference.
- On 2026-06-18, `node --check app.js` and `git diff --check` passed after removing `spin-voice-2.mp3` from the active spinning pool. The `spinClips` registry now contains only `spin-voice-1.mp3`, so Voice 2 is neither fetched nor eligible for playback during a spin.
- On 2026-06-18, GitHub Pages reached `built` after deploying `f7dbe3d`; the public site and all five new dedicated player MP3 URLs returned `HTTP 200`, and public `app.js` contains the exact Arabic player-to-clip mappings for `الملا`, `حمود`, `عليوي`, `بوحمد`, and `الخلف`.
- On 2026-06-18, `node --check app.js` and `git diff --check` passed after adding dedicated clips for `الملا`, `حمود`, `عليوي`, `بوحمد`, and `الخلف`. `ffprobe` confirmed all five published assets are MP3 files. Local headless Chrome decoded all seven dedicated player clips successfully and confirmed each mapped player spins normally with regular ticks only, invokes only their own post-selection clip, completes assignment correctly, and creates no horizontal overflow.
- On 2026-06-18, GitHub Pages reached `built` after deploying `acf5c46`; the public site returned `HTTP 200`, and public `app.js` contains the radial one-player label placement plus the shared delayed `assignSelectedPlayer(selectedIndex)` spin path with no one-player direct-assignment branch.
- On 2026-06-18, `node --check app.js` and `git diff --check` passed after enabling a normal spin for the last player in each group. Local headless Chrome at mobile `390x844` and desktop `1280x900` confirmed the one-player state spins for 4.5 seconds without immediate assignment, the complete player name remains inside the wheel and does not overlap the `سين جيم` center badge before or after landing, and there is no horizontal overflow. An accelerated full default draw confirmed the last player in all three groups spins before assignment, all 12 players are assigned, teams finish `6/6`, and the maximum team difference remains `1`.
- On 2026-06-18, GitHub Pages reached `built` after deploying `9505760`; a live Chrome check of `https://ahmad9077.github.io/TeamMixer/` confirmed 16 exact single-node `.category-wheel-label` elements with native `dir="rtl"` / `lang="ar"`, `white-space: nowrap`, no child fragments, no category SVG `<text>`/`<tspan>` nodes, the shared `categoryWheelRotor`, and no horizontal overflow. Public source therefore reflects the stronger HTML-based RTL implementation rather than the earlier split-SVG approach.
- On 2026-06-18, the category wheel RTL fix was strengthened by removing all SVG `<text>`/`<tspan>` labels and rendering every category as one unbroken HTML `<span dir="rtl" lang="ar">` over the SVG. `node --check app.js` and `git diff --check` passed; local headless Chrome at mobile `390x844` and desktop `1280x900` confirmed all 16 labels exactly match their category titles, use native RTL/Cairo with `unicode-bidi: plaintext` and `white-space: nowrap`, remain inside the rotor, contain no child line fragments, rotate with the wheel's 4.5s transition, create no SVG text nodes, and cause no horizontal overflow. Screenshot inspection confirmed connected full phrases including `دول و عواصم`, `ولا كلمة فن أجنبي`, and `السيرة النبوية`. Safari WebDriver could not be run because Safari's Allow Remote Automation setting is disabled, so the implementation now avoids Safari-sensitive SVG bidi handling entirely.
- On 2026-06-18, GitHub Pages reached `built` after deploying `092337f`, public GitHub Pages and `assets/categories/prophetic-biography.jpg` returned `HTTP 200`, and public `app.js` contains active `السيرة النبوية` / `assets/categories/prophetic-biography.jpg`, `التنانين` with `بوحمد`, `الأسود` with `عليوي`, and `الذئاب` without `عليوي`, with no active `مشاهير صغار` or `young-celebrities` category entry.
- On 2026-06-18, `node --check app.js` and `git diff --check` passed after replacing `مشاهير صغار` with `السيرة النبوية`, moving `بوحمد` to `التنانين`, and moving `عليوي` to `الأسود`; local headless Chrome at mobile `390x844` and desktop `1280x900` confirmed default group counts are `6/3/3`, all 12 players are assigned with final teams `6/6` and maximum difference `1`, active Categories remains 16 entries with no `مشاهير صغار`, `assets/categories/prophetic-biography.jpg` renders at `632x777` using `object-fit: contain`, no rendered images are broken, and there is no horizontal overflow.
- On 2026-06-18, GitHub Pages reached `built` after deploying `0cfc558`, public GitHub Pages returned `HTTP 200`, and public `app.js` contains the complete-word `categoryWheelLabel` logic, `uprightWheelLabelRotation`, and explicit `direction="rtl"` / `unicode-bidi="embed"` attributes for category wheel labels and lines.
- On 2026-06-18, `node --check app.js` and `git diff --check` passed after correcting category wheel Arabic text; local headless Chrome at mobile `390x844` and desktop `1280x900` confirmed all 16 category labels reconstruct their complete titles without cutting words, every SVG label uses explicit `direction="rtl"` and `unicode-bidi="embed"`, Cairo is loaded, label rotations remain upright on both halves of the wheel, the wheel stays text-only, and there is no horizontal overflow. Screenshot inspection confirmed connected Arabic rendering and readable right-to-left lines.
- On 2026-06-15, GitHub Pages reached `built` after deploying `354bed8`, public GitHub Pages returned `HTTP 200`, public `assets/categories/young-celebrities.jpg` and `assets/categories/moving-letters.jpg` returned `HTTP 200`, and public `app.js` contains active `مشاهير صغار` / `assets/categories/young-celebrities.jpg` and `حروف متحركة` / `assets/categories/moving-letters.jpg` with no active `سيرة ذاتية`, `صوت المشهور`, `biography`, or `celebrity-voice` category entry.
- On 2026-06-15, `node --check app.js` and `git diff --check` passed after replacing the active `سيرة ذاتية` and `صوت المشهور` categories with `مشاهير صغار` and `حروف متحركة`; local headless Chrome at mobile `390x844` confirmed the active category count remains 16, the new category images are wired to `assets/categories/young-celebrities.jpg` and `assets/categories/moving-letters.jpg`, the removed categories and old image URLs are no longer active, the category wheel remains text-only, rendered images are not broken, and there is no horizontal overflow.
- On 2026-06-11, GitHub Pages reached `built` after deploying `36e6aca`, public GitHub Pages returned `HTTP 200`, public `assets/sounds/player-hameed.mp3` returned `HTTP 200`, and public `app.js` contains `assets/sounds/player-hameed.mp3` under `حميد` plus the existing `!playerClips[selected.name]` spin-sound guard.
- On 2026-06-11, `node --check app.js` and `git diff --check` passed after adding `assets/sounds/player-hameed.mp3`; local asset checks returned `HTTP 200`, and a headless Chrome runtime check confirmed `حميد` is registered in `playerClips`, the regular spin clip pool remains two clips, his spin calls `playSpinSounds(..., false)`, and his own post-selection clip is requested after he is chosen.
- On 2026-06-11, GitHub Pages reached `built` after deploying `e533034`, public GitHub Pages returned `HTTP 200`, and public `app.js` shows `الأسود` as `بوحمد`, `الخلف`, `الهلالي` and `الذئاب` as `حمود`, `عليوي`, `موسى`, `قرطبة`.
- On 2026-06-11, local headless Chrome checks at mobile `390x844`, tablet `820x1180`, and desktop `1280x900` confirmed `قرطبة` is in `الذئاب` only, default group counts are `5/3/4`, the default draw assigns all 12 players including `قرطبة`, final teams end `6/6`, no rendered images are broken, and there is no horizontal overflow.
- On 2026-06-11, GitHub Pages reached `built` after deploying `e2d5227`, public GitHub Pages returned `HTTP 200`, public `assets/categories/biography.jpg` returned `HTTP 200`, and public `app.js` contains active `سيرة ذاتية` / `assets/categories/biography.jpg` with no active `ترتيب إسلامي` or `islamic-order` category entry.
- On 2026-06-11, local headless Chrome checks at mobile `390x844`, tablet `820x1180`, and desktop `1280x900` confirmed active Categories still has 16 entries, includes `سيرة ذاتية` with `assets/categories/biography.jpg`, excludes active `ترتيب إسلامي`/`islamic-order`, renders the new selected category card with `object-fit: contain`, has no broken rendered images, and creates no horizontal overflow.
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
