# TODO

> **Context Safety:** Redact sensitive values. No secrets in this file.

## Now

- [ ] Add or restore `dino.png` and `camera.png` for both levels
- [ ] Confirm both levels play cleanly under CSP after asset restore

## Next

- [ ] Deduplicate `jaws.js` / `filtrr2.js` into shared `vendor/` (optional)
- [ ] Consider resetting Filtrr2 filter state correctly in `takePicture`

## Blocked

- (none)

## Done recently (optional short list)

- [x] Security hardening: DOM HUD/instructions, bounds check, keyup in setup, CSP, vendored jQuery
- [x] Dynamic window fit via `fit.js`
- [x] `/context-bootstrap` for Cursor
