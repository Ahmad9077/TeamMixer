# TODO.md

## Next Steps

- Review the released Bright Playful Minimal interface on a physical iPhone Safari screen; automated Safari WebDriver remains unavailable unless `Allow Remote Automation` is enabled.
- Keep `archive/pre-light-redesign-2026-08-13` and `pre-light-redesign-2026-08-13` available as the complete pre-redesign restoration references.
- User review of the current live GitHub Pages site after the 2026-07-02 player ranking deployment.
- Review the live GitHub Pages site on an actual physical phone screen.
- Recheck the updated mobile Draw and Categories screens on a physical phone after deployment.
- If needed, crop or mask the logo images into cleaner square/circular icons.
- If needed, replace the cropped category cards with original individual photos.
- Optionally convert the setup wordmark to WebP.

## Verification Checklist For Future Changes

- Run `node --check app.js`.
- Test mobile viewport `390x844`.
- Test desktop viewport `1280x900`.
- Verify the spin wheel stays inside its container.
- Verify every player name and group logo keeps the same fixed tangential angle before, during, and after the spin, with no post-spin correction, and that the selected name and logo land horizontally beneath the pointer.
- Verify no horizontal overflow during spin.
- Verify live team lists are visible during spin.
- Verify both spinning voice MP3s are absent from the active empty `spinClips` pool and cannot play during a spin.
- Verify `celebration-voice-1.mp3` is absent from the active empty `celebrationClips` pool and cannot play after selection.
- Verify the published `player-breiji.mp3` decodes successfully as a 48 kHz stereo 320 kbps MP3 near `-15 LUFS`.
- Verify every player registered in `playerClips` uses synthesized spin ticks, plays only their own MP3 after selection, and still follows the final-player spin behavior.
- Verify the five default groups are `جلاد التنانين`, `التنانين`, `الأسود`, `الذئاب`, and `البطاريق`, with `هشوم` as the default `البطاريق` member.
- Verify stale `seenjeem_state_v1` data without the current `rosterVersion` resets to the new ranking and player list.
- Verify `assets/dragon-slayer.jpg` loads for `جلاد التنانين`.
- Verify `assets/penguin-black.jpg` loads for `البطاريق`.
- Verify `مويس` plays `assets/sounds/player-mousa.mp3` after selection under the same dedicated-player rule.
- Verify `هشوم` plays `assets/sounds/player-hashoum.mp3` after selection under the same dedicated-player rule.
- Verify dedicated player clips remain near `-15 LUFS` and decode as 48 kHz stereo MP3 after future audio edits; `مويس` is the intentional louder exception near `-12 LUFS`.
- Verify the last player in every group completes a normal spin before assignment, with the full name and logo visible outside the center badge.
- Verify all default players are assigned.
- Verify final counts differ by at most 1.
- Verify Categories selects exactly 6 categories and keeps them in a 3-by-2 selected grid.
- Verify `رياضة` replaces `تاريخ` in fresh and persisted category sessions and uses `assets/categories/sports.jpg`.
- Verify Categories allows at most two of `دول و عواصم`, `جغرافيا`, and `سياحة وسفر` in one session.
- Verify Categories allows at most one of `ولا كلمة` and `ولا كلمة فن أجنبي` in one session.
- Verify every category wheel label is one unbroken connected Arabic RTL phrase and remains upright on both halves of the wheel.
- Verify fixed mobile bottom tabs do not cover the bottom of each screen at max scroll.
- Verify no visible English strings remain on any screen.
- Verify refresh restores state from `seenjeem_state_v1`, `من جديد` resets clean, and `تصفير الفئات` restores all 16 categories.
- Verify touch targets are at least 44px.
- Verify there is no user-facing sound or mute control and `ADMIN_SOUND_SETTINGS` remains the only sound switch/mapping registry.
- Re-verify public GitHub Pages deployment after future pushes.

## Backlog Ideas

- Add a small draw history log.
- Add a compact landscape mobile layout.
- Add a visual animation when a selected name joins a team.
