# TODO.md

## Next Steps

- Review the live GitHub Pages site on an actual physical phone screen.
- Confirm whether UI labels should stay English or be translated to Arabic.
- Confirm whether `Team 1` and `Team 2` should be renamed.
- Recheck the updated mobile Draw and Categories screens on a physical phone after deployment. Browser viewport checks passed on 2026-05-26, but physical-device review is still pending.
- If needed, crop or mask the logo images into cleaner square/circular icons.
- If needed, replace the cropped category cards with original individual photos.

## Verification Checklist For Future Changes

- Run `node --check app.js`.
- Test mobile viewport `390x844`.
- Test desktop viewport `1280x900`.
- Verify the spin wheel stays inside its container.
- Verify no horizontal overflow during spin.
- Verify live team lists are visible during spin.
- Verify final-player assignment does not spin.
- Verify all default 11 players are assigned.
- Verify final counts differ by at most 1.
- Verify Categories selects exactly 6 categories and keeps them in a 3-by-2 selected grid.
- Verify Categories allows at most two of `دول و عواصم`, `جغرافيا`, and `سياحة وسفر` in one session.
- Verify fixed mobile bottom tabs do not cover the bottom of each screen at max scroll.
- Verify public GitHub Pages deployment after push.

## Backlog Ideas

- Add Arabic versions of status messages.
- Add a small draw history log.
- Add a compact landscape mobile layout.
- Add a visual animation when a selected name joins a team.
