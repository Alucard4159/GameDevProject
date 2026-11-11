# TODO

> **Context Safety:** Redact sensitive values. No secrets in this file.

## Now

- (none)

## Next

- [ ] Replace tiny placeholder `dino.png` / `camera.png` with proper art if desired
- [ ] Optional: walk to exit cell in-browser to confirm SUCCESS HUD (code uses `Math.floor`; not reached in timed smoke)

## Blocked

- (none)

## Done recently (optional short list)

- [x] Browser smoke after engine cut (L1+L2 load, move, blur no-stick, photo, sepia toggle, level hrefs; no jaws/jQuery/Filtrr2)
- [x] Remove jaws / Filtrr2 / jQuery; add first-party `engine.js` (loop, input, sprite, sepia)
- [x] QA triage fixes: stuck controls, exit floor check, percent clamp, space rising-edge, canvas/screenshot sizing, shade clamp, HUD debounce, typos
- [x] Security hardening: DOM HUD/instructions, bounds check, CSP
- [x] Dynamic window fit via `fit.js`
- [x] `/context-bootstrap` for Cursor
