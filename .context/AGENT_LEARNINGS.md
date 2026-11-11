# Agent Learnings

> **Context Safety:** Redact sensitive values. No secrets in this file.

## 2026-11-11

- Movement must poll-reset `direction`/`speed` each frame — key state is cleared on blur without synthetic keyup; latches stick if you only clear on keyup
- When changing maze canvas bitmap size, set `numberOfRays = canvas.width` and `angleBetweenRays = (60°)/rays` so FOV stays 60°; init `canvas` before `raycaster`
- Abandoned libs (jaws / Filtrr2 / jQuery): delete and replace, don't version-bump. `engine.js` owns loop/input/sprite/sepia; no npm required

## 2026-11-10

- (Historical, jaws removed 2026-11-11) jaws cleared key callbacks on state switch — if using `on_keyup`, register in `setup`, never in `update`. Movement now uses poll-reset in `Engine` key state (see 2026-11-11)
- (Historical) Filtrr2 required jQuery; resolved by deleting both and using `Engine.sepia`
- `fit.js` must stay a separate file so CSP can forbid inline scripts
- On Windows, prefer `py -3 -m http.server` — bare `python` may hit the Store alias stub
