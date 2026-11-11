# TODO

> **Context Safety:** Redact sensitive values. No secrets in this file.

## Now

- [ ] Smoke both levels in browser under CSP (blur+keys, exit cell, space photo, percent ≥ 0)

## Next

- [ ] Deduplicate `jaws.js` / `filtrr2.js` into shared `vendor/` (optional)
- [ ] Replace tiny placeholder `dino.png` / `camera.png` with proper art if desired

## Blocked

- (none)

## Done recently (optional short list)

- [x] QA triage fixes: stuck controls, exit floor check, percent clamp, space rising-edge, canvas/screenshot sizing, shade clamp, HUD debounce, typos
- [x] Security hardening: DOM HUD/instructions, bounds check, keyup in setup, CSP, vendored jQuery
- [x] Dynamic window fit via `fit.js`
- [x] `/context-bootstrap` for Cursor
