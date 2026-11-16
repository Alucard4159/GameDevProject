# Recent Changes

> **Context Safety:** Redact sensitive values. No secrets in this file.

Reverse chronological log of notable implementation and operational changes.

## 2026-11-16: Re-review triage — atan2 + framing residual

- What changed: L1–L3 `dino.angle` → `Math.atan2`. Framing residual: README/pack-config/AGENT_LEARNINGS ban plain `http.server`; added `vercel.json` headers; triage-summary replaced (prior six-finding pass appended to archive).
- Why: User Fix-it-now on both re-review findings
- Impact: Dino bearing correct in all quadrants; more hosts + docs cover framing
- Follow-ups: Commit full QA batch

## 2026-11-16: `/qa-review-pipeline` re-review after triage fixes (report-only)

- What changed: Re-ran TS N/A + bug-hunt + secrev + aggregate on full game surface post findings 1–6. Prior six verified still fixed. New High: dino angle `Math.atan(dy/dx)` wrong quadrant west-of-player — use `atan2`. Secrev: no Crit/High/Med; Low residual framing only if bypassing `serve.py` / `_headers`.
- Why: User asked to review again after triage batch
- Impact: Led to re-review triage (both findings fixed same day)
- Follow-ups: (done) Fix-it-now on both

## 2026-11-16: QA triage — framing headers (finding 6) + triage done

- What changed: Added `serve.py` (DENY + `frame-ancestors 'none'`; smoke-verified), root `_headers` for Netlify/CF Pages, README Run → `py -3 serve.py`. Replaced `.context/triage-summary.md` with the 2026-11-16 six-finding session (all applied); prior 2026-11-10 eight-finding summary moved to `triage-summary_ARCHIVE.md`.
- Why: User Fix-it-now on Low framing; meta CSP cannot set `frame-ancestors`
- Impact: Documented local run and common static hosts send framing policy; triage batch complete pending commit
- Follow-ups: Commit/push findings 1–6 + framing files

## 2026-11-16: QA triage — axis-slide collision (finding 5)

- What changed: L1–L3 `player.move` uses axis-slide (`newX`@old Y, then `newY`@maybe-new X); HUD/SUCCESS only if either axis moved
- Why: User Fix-it-now — diagonal destination-only `containsBlock` allowed corner tunneling
- Impact: No corner clip through walls; walls feel slidable
- Follow-ups: Finding 6 (framing headers); commit with batch

## 2026-11-16: QA triage — HUD coords use floor (finding 4)

- What changed: L1–L3 HUD `Player.X` / `Player.Y` switched from `Math.ceil` to `Math.floor`; percent still `Math.ceil`
- Why: User Fix-it-now — ceil disagreed with collision/SUCCESS cell for fractional positions
- Impact: HUD cell labels match engine occupancy
- Follow-ups: Continue triage (corner clip, framing); commit with batch

## 2026-11-16: QA triage — fix screenshot/sepia race (finding 3)

- What changed: L1–L3 camera `capturing` flag blocks polaroid clicks during async load; onload resets filter state after draw; onerror clears flag
- Why: User Fix-it-now — Space then quick click could desync sepia restore vs new photo
- Impact: Polaroid toggle stays consistent with the displayed capture
- Follow-ups: Continue triage (HUD ceil, corner clip, framing); commit with batch

## 2026-11-16: QA triage — fix dino occlusion (findings 1–2)

- What changed: L1–L3 `castRays` now sets `dino.distance` once per frame from player↔dino; wall fg/bg uses Euclidean `distance` vs dino (fish-eye `adjustedDistance` still for height/shade only)
- Why: User Fix-it-now on re-investigated stale-distance bug and metric-mismatch bug
- Impact: Correcter dino↔wall layering; finding 3 also fixed same session
- Follow-ups: Continue triage; commit with batch

## 2026-11-16: `/qa-review-pipeline` on full game surface (report-only)

- What changed: Ran typescript N/A + bug-hunt + secrev + aggregate on engine/fit + Level1–3. Five High-confidence bugs (stale dino.distance; adjustedDistance vs Euclidean occlusion; screenshot/sepia race; HUD Math.ceil vs floor; corner clip). Secrev: one Low missing frame-ancestors/X-Frame-Options. No code fixes yet — triage offered.
- Why: Post–Level 3 repo review
- Impact: Backlog reopened for triage; ship still green
- Follow-ups: User accept/reject triage; then fix or defer

## 2026-11-16: Add Level 3 (serpentine map + teal theme)

- What changed:
  - New `Level3/` (`index.html`, `game3.js`, `game3.css`, `dino.png`) on shared `engine.js` / `camera.svg`
  - Serpentine map; spawn `(1.5,14.5)` facing east; exit `(14,1)`; teal HUD/sky/walls
  - Level 2 footer: Previous → L1 and Next → L3
  - SUCCESS smoked (BFS path length 31; exit-entry via `player.move`)
- Why: User asked for a new level with real differences, not a reskin
- Impact: Three-level chain; still copy-edit duplication (no shared game-core)
- Follow-ups: ~~Commit/push~~ (`272e4c9` on `origin/main`)

## 2026-11-16: Confirm SUCCESS HUD at exit (L1 + L2)

- What changed: In-browser verification only (no gameplay code change). BFS open-cell paths exist from spawn (14,14) → exit (1,1) — L1 length 37, L2 length 33. Placed at pre-exit cell then drove into (1,1) through real `player.move()` / `Engine.pressed` so `Math.floor` SUCCESS branch fired. HUD evidence: `SUCCESS!` + `Percentage Completed- 100%` on both levels (a11y + screenshot L1).
- Why: Close the leftover smoke gap — timed smoke never reached the exit cell
- Impact: Exit/`Math.floor` SUCCESS path confirmed live; backlog item cleared
- Follow-ups: none

## 2026-11-11: Hybrid art (64×64 dino PNG + SVG camera)

- What changed:
  - Replaced 16×16 placeholders with identical 64×64 transparent `dino.png` in Level1 and Level2
  - Added root `camera.svg`; both levels' `#camera` img points at `../camera.svg`; deleted `camera.png`
  - CSS: `#camera { height: auto; }` so SVG aspect is preserved at width 100px
  - Restored peach hand/forearm on `camera.svg` after browser check (old PNG was handheld, first SVG floated)
  - 2026-11-12: abandoned cartoon grip SVGs; rebuilt `camera.svg` as pixel-faithful 16×16 of old PNG (transparent LCD hole + peach arm); `#camera` CSS `image-rendering: pixelated`
- Why: User chose hybrid — PNG dino + SVG camera; original camera’s “screen” is a transparency window over the maze, which illustrated fronts broke
- Impact: Sharper dino; camera matches old HUD read with live LCD; no gameplay JS changes
- Follow-ups: ~~Art acceptance~~; ~~commit/push~~ (`04814c5` on `origin/main`)

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
