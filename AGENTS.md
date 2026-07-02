# AGENTS.md

## Project

This repository contains the static GitHub Pages app for:

`قرعة لعبة سين جيم - ديوانية الجيران`

Public URL:

`https://ahmad9077.github.io/TeamMixer/`

GitHub repository:

`https://github.com/Ahmad9077/TeamMixer`

## Source Of Truth

Before making changes, read these files in this order:

1. `AGENTS.md`
2. `PROJECT_STATUS.md`
3. `TODO.md`
4. `DESIGN.md`
5. `index.html`
6. `app.js`

Keep `PROJECT_STATUS.md` and `TODO.md` updated whenever project behavior, design decisions, deployment state, or next steps change.

## Tech Stack

- Static HTML/CSS/JavaScript.
- Tailwind CSS CDN in `index.html`.
- Vanilla JavaScript state management in `app.js`.
- Assets live under `assets/`.
- No build step, package manager, framework, backend, or database.
- Sound effects use the Web Audio API in `app.js`: deceleration-matched wheel ticks plus a randomized pool of synthesized celebration sounds and a grand finale. Spinning MP3 voices are disabled: `spinClips` is empty, while `spin-voice-1.mp3` and `spin-voice-2.mp3` remain inactive repository assets. Every player and category spin uses only synthesized wheel sounds. Random post-selection MP3 voices are also disabled: `celebrationClips` is empty and `celebration-voice-1.mp3` remains an inactive asset. Players without a dedicated clip receive one of the five synthesized celebration sounds. Per-player clips live in `playerClips` keyed by player name (currently `البريجي`, `حميد`, `الملا`, `حمود`, `عليوي`, `بوحمد`, `الخلف`, `قرطبة`, `موسى`, `طروق`, `جراغ`, and `بوجمال`): when that player is chosen their clip always plays after the selection, their spin uses ticks only, and no other voice clip ever plays for them. Dedicated clips are speech-cleaned, lightly compressed, and encoded as 48 kHz stereo 320 kbps MP3. Most target about `-15 LUFS`; `موسى` intentionally targets about `-12 LUFS` for stronger perceived volume. The published `البريجي` asset uses the latest supplied full recording, normalized near `-15 LUFS`. The header 🔊/🔇 toggle persists separately under `seenjeem_sound_v1` and is not cleared by `من جديد`. Sound code must never break game logic (all entry points are wrapped in try/catch).
- App state persists in `localStorage` under the single key `seenjeem_state_v1` (players, draw progress, team assignments, picked categories, active screen). `من جديد` clears all stored state; `تصفير الفئات` resets only category state. No cross-session draw history: randomness is independent each session and previously used categories are never excluded.

## Design Direction

Use the Light Modern Minimal design system (see `DESIGN.md` for the full palette):

- Warm porcelain background `#f7f5f1` with clean white panels, 1px `#e9e5dd` borders, and soft shadows.
- One strong accent: deep teal `#0f766e` (primary buttons, active nav, eyebrows, wheel pointer, team 1). Amber `#b45309` is the team 2 identity.
- The whole app is Arabic RTL: `<html lang="ar" dir="rtl">`, all UI strings in Arabic with Western digits (0-9).
- Cairo (Google Fonts, `font-display: swap`) for all text, with Calibri as fallback. Bold/extrabold headings.
- Arabic letters must render connected; avoid letter spacing on Arabic.
- Style through the semantic CSS classes in `index.html` (`.panel`, `.btn-primary`, `.btn-secondary`, `.field`, `.chip`, `.stat-box`, `.row`, `.empty-note`, `.nav-active`, ...); use Tailwind utilities for layout/spacing/typography only and avoid arbitrary hex utility classes.
- Prefer 12px to 16px corner radius. Avoid oversized pill shapes except where already intentional.
- Avoid gradients-as-decoration, bright candy colors, heavy glow shadows, and clutter.

## Current App Behavior

The app has four screens:

- Setup (الإعداد): edit the four Arabic groups and members.
- Draw (القرعة): spin/select names, show active group, progress, and live team lists.
- Results (النتائج): final الفريق الأول and الفريق الثاني lists with the `من جديد` start-over action. There is no share feature.
- Categories (الفئات): spin/select six game categories with the `تصفير الفئات` reset action. Only two of `دول و عواصم`, `جغرافيا`, and `سياحة وسفر` can be selected in one Categories session. Only one of `ولا كلمة` and `ولا كلمة فن أجنبي` can be selected in one Categories session.

Groups and logos:

- `التنانين`: `assets/dragon-red.jpg`
- `الأسود`: `assets/lion-yellow.jpg`
- `الذئاب`: `assets/wolf-blue.jpg`
- `البطاريق`: `assets/penguin-black.jpg`

Default members:

- `التنانين`: `الملا`, `جراغ`, `حميد`, `طروق`, `البريجي`, `بوحمد`
- `الأسود`: `الخلف`, `الهلالي`, `عليوي`
- `الذئاب`: `حمود`, `موسى`, `قرطبة`, `بوجمال`
- `البطاريق`: no default members

Rules:

- The wheel selects names, not teams.
- Names from each group alternate between Team 1 and Team 2.
- If a group has an odd count, the next team in sequence receives the first two picks from the next group.
- If there is only one player left in the current group, still spin before assigning that player. Keep the full name and group logo visible outside the `سين جيم` center badge and land them upright near the pointer.
- Team counts must never differ by 2 or more. Keep the balance guard in place.
- Live Team 1 and Team 2 lists must remain visible on the Draw screen and update after every assignment.
- After a spin lands, the wheel keeps showing the landed segments (including the selected player) until the next spin starts; only then is the assigned player removed from the wheel (`frozenWheelItems` in `app.js`).

## Coding Rules

- Keep the app static and dependency-light.
- Do not add login, analytics, or backend services unless explicitly requested. `localStorage` persistence is intentional and should be preserved.
- Randomization must stay unbiased: Fisher-Yates with `crypto.getRandomValues` (see `randomInt`/`shuffle` in `app.js`). Do not reintroduce `Math.random` or sort-based shuffles.
- Touch targets must stay at least 44px tall/wide.
- Prefer simple, readable vanilla JavaScript over abstraction-heavy code.
- Do not move behavior out of `app.js` unless there is a clear reason.
- Keep user-facing Arabic text legible, connected, and large enough on mobile.
- Preserve mobile-first behavior and fixed bottom navigation.
- Prevent horizontal page expansion during wheel animation.
- Keep the wheel clipped within its frame while spinning.
- All player names should be bold and visually comfortable.
- Every displayed player name should include the appropriate group logo where practical.

## Verification

Before publishing changes, run:

```bash
node --check app.js
```

For UI/behavior changes, also run a Playwright smoke test or equivalent browser check for:

- Mobile viewport around `390x844`.
- Desktop viewport around `1280x900`.
- No horizontal overflow during spin.
- Draw screen live lists visible.
- Final draw completes all default players.
- Final team counts never differ by 2.
- Attached assets load from `assets/`.

## Deployment

Deployment is through GitHub Pages from `main`.

Standard publish flow:

```bash
git status --short --branch
git add <changed files>
git commit -m "<clear message>"
git push
```

Then wait for Pages:

```bash
gh api repos/Ahmad9077/TeamMixer/pages --jq '.status'
```

Verify public output:

```bash
curl -I https://ahmad9077.github.io/TeamMixer/
```

For asset changes, verify direct asset URLs return `HTTP 200`.
