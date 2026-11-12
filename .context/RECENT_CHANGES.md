# Recent Changes

> **Context Safety:** Redact sensitive values. No secrets in this file.

Reverse chronological log of notable implementation and operational changes.

## 2026-11-11: Hybrid art (64×64 dino PNG + SVG camera)

- What changed:
  - Replaced 16×16 placeholders with identical 64×64 transparent `dino.png` in Level1 and Level2
  - Added root `camera.svg`; both levels' `#camera` img points at `../camera.svg`; deleted `camera.png`
  - CSS: `#camera { height: auto; }` so SVG aspect is preserved at width 100px
  - Restored peach hand/forearm on `camera.svg` after browser check (old PNG was handheld, first SVG floated)
  - 2026-11-12: abandoned cartoon grip SVGs; rebuilt `camera.svg` as pixel-faithful 16×16 of old PNG (transparent LCD hole + peach arm); `#camera` CSS `image-rendering: pixelated`
- Why: User chose hybrid — PNG dino + SVG camera; original camera’s “screen” is a transparency window over the maze, which illustrated fronts broke
- Impact: Sharper dino; camera matches old HUD read with live LCD; no gameplay JS changes
- Follow-ups: ~~Art acceptance~~ (user preferred sharp pixel SVG over blurry old upscale despite clipped arm); commit/push when ready

## 2026-11-11: Drop jaws / Filtrr2 / jQuery for first-party engine

- What changed:
  - Added `engine.js` (asset load, rAF, keys with blur clear, sprite, sepia ImageData)
  - Retargeted both level game scripts; HTML loads only `engine.js` + `fit.js` + game JS
  - Deleted Level1/2 `jaws.js`, `filtrr2.js`, `jquery.js` and `vendor/jquery-3.7.1.slim.min.js`
  - Populated `PROJECT_FRONTMATTER.md`; refreshed root `README.md` (run/layout); dropped empty `vendor/` from `ARCHITECTURE.md`
- Why: Remove abandoned dependencies while keeping maps, HUD, photos, level links, CSP; clear doc drift after the cut
- Impact: No third-party JS left; smaller attack/surface and tree; frontmatter/README match the tree
- Follow-ups: ~~Browser smoke~~ (passed 2026-11-11); ~~commit~~ (`2ae3778` on `origin/main`); ~~optional PNG art upgrade~~ (hybrid art same day)

## 2026-11-10: QA triage fixes (controls, HUD, camera, canvas)

- What changed:
  - Both levels: poll-reset movement each frame (fixes stuck keys after blur); `Math.floor` exit cell; percent uses `√(13²+13²)` + clamp; rising-edge space + Filtrr reset/generation gate; shade index clamp; HUD skip when unchanged; typo fixes
  - Maze canvas bitmap 600×300 with FOV-preserving ray count; screenshot polaroid 300×150 downscales capture
- Why: Close all 8 items from `.context/triage-summary.md`
- Impact: Controls stable across blur; exit/percent/camera behave correctly; sharper maze without blowing layout
- Follow-ups: ~~Optional jaws/filtrr2 vendor dedupe~~ (moot — deleted 2026-11-11); smoke both levels in browser

## 2026-11-10: Context bootstrap + window fit + security hardening

- What changed:
  - Installed `.context/`, Cursor rules/hooks, `skills/` scaffold, pack-configs for context/qa/secrev
  - Added `fit.js` to scale `#titleBlock` to the viewport
  - Replaced jQuery `.html()` HUD/instructions with DOM builders; moved `on_keyup` to `setup`; scoped sliver arrays; clamped `containsBlock`
  - Added CSP; vendored jQuery; moved `jaws.start` into game JS files
- Why: Harden sinks, make the UI fill the window, give agents durable project memory
- Impact: Playable under CSP; layout scales; session handoff files exist
- Follow-ups: Restore missing PNG assets; optional vendor dedupe of jaws/filtrr2
