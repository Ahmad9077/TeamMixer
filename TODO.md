# TODO.md

## Next Steps

- Review the live GitHub Pages site on an actual phone screen.
- Confirm whether UI labels should stay English or be translated to Arabic.
- Confirm whether `Team 1` and `Team 2` should be renamed.
- Recheck the updated mobile Draw order on a physical phone after deployment.
- If needed, crop or mask the logo images into cleaner square/circular icons.

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
- Verify public GitHub Pages deployment after push.

## Backlog Ideas

- Add Arabic versions of status messages.
- Add a small draw history log.
- Add a compact landscape mobile layout.
- Add image preloading to avoid first-render logo delay.
- Add a visual animation when a selected name joins a team.
