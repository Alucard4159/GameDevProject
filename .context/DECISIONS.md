# Key Decisions Log

Newest first. Capture what was decided and why.

## 2026-11-16: Framing residual — ban http.server in docs + add vercel.json

**Decision**: Treat plain `http.server` as unsupported for this project in README + `pack-configs/qa.md` + `AGENT_LEARNINGS`. Keep `serve.py` / `_headers`; add `vercel.json` with the same `X-Frame-Options: DENY` and `frame-ancestors 'none'`. Still no meta CSP `frame-ancestors`.

**Rationale**: Re-review Low finding — residual framing when bypassing the documented runner. User chose Fix-it-now; killing stale `http.server` pointers removes the main footgun, and `vercel.json` covers another common static host without inventing GitHub Pages Actions yet.

**Tradeoff**: Hosts that ignore both `_headers` and `vercel.json` still need their own config. Docs cannot stop someone from running `http.server` anyway.

## 2026-11-16: Dino bearing — Math.atan2, not Math.atan

**Decision**: Set `dino.angle` with `Math.atan2(dinoDistanceY, dinoDistanceX) - player.angle` in Level1–3.

**Rationale**: Re-review High bug — `atan(dy/dx)` collapses the left half-plane, so the dino sprite X is wrong when west of the player. User chose Fix-it-now in triage.

**Tradeoff**: None meaningful; `atan2` is the correct 2-arg bearing API.

## 2026-11-16: Framing headers via serve.py + _headers, not meta CSP

**Decision**: Add `serve.py` (stdlib server that sends `X-Frame-Options: DENY` and `Content-Security-Policy: frame-ancestors 'none'`) as the documented local runner, plus root `_headers` for Netlify/Cloudflare Pages. Do **not** put `frame-ancestors` on the existing meta CSP. Leave meta CSP otherwise unchanged.

**Rationale**: QA finding 6 (Low) — browsers ignore `frame-ancestors` in meta CSP; plain `http.server` can’t set response headers. User chose Fix-it-now; this closes framing for the actual Run path and common static hosts without inventing a fake meta fix.

**Tradeoff**: `py -3 -m http.server` still serves without framing headers if someone ignores the README. No GitHub Pages / S3 header file unless that host is adopted later.

## 2026-11-16: Movement collision — axis-slide, not diagonal point sample

**Decision**: In `player.move`, try X at old Y then Y at (possibly new) X via `containsBlock`; set position per axis that clears. Run SUCCESS/HUD only when `moved`. Applied in Level1–3. No collision radius / segment DDA.

**Rationale**: QA finding 5 — single `(newX, newY)` sample let diagonal steps tunnel past wall corners. User chose Fix-it-now; axis-slide is the cheapest classic FPS fix and also enables wall-slide feel.

**Tradeoff**: Still a zero-radius point player. Very fast steps could skip thin walls; current `movementSpeed = 0.1` makes that unlikely on this 16×16 grid.

## 2026-11-16: HUD player coords — Math.floor, not Math.ceil

**Decision**: HUD `Player.X` / `Player.Y` display `Math.floor(this.x/y)`, matching `containsBlock` and SUCCESS. Leave `Math.ceil(percentComplete)` as-is. Applied in Level1–3.

**Rationale**: QA finding 4 — ceil showed the cell east/south of the engine cell for any fractional position (entire exit cell could show `2,2` while SUCCESS fired). User chose Fix-it-now in triage; floor aligns readout with collision semantics.

**Tradeoff**: Still integer cell labels, not decimals. Percent rounding is a separate display choice and was out of scope for this finding.

## 2026-11-16: Screenshot sepia — block clicks while capturing; reset filter on load

**Decision**: Add a `capturing` flag around `takePicture`’s async Image load; ignore polaroid clicks while true. On successful `onload` (and matching generation), redraw then force `filtered = false` / `originalPixels = null` / `capturing = false`. `onerror` clears `capturing` only. Applied in Level1–3.

**Rationale**: QA finding 3 — clearing filter state at Space then painting later left a window where click could sepia the old bitmap and leave restore state pointing at the wrong ImageData. User chose Fix-it-now in triage.

**Tradeoff**: Clicks during capture are no-ops (no queue UI). Stale `onload` from an older generation still returns early without touching `capturing`; the newer capture owns the flag.

## 2026-11-16: Dino occlusion — per-frame Euclidean distance + Euclidean wall compare

**Decision**: (1) At the start of each `castRays`, set `dino.distance` from current player↔dino geometry (do not rely on mid-loop refresh after `show`). (2) Classify wall slivers with raw Euclidean wall `distance` vs `dino.distance`; keep fish-eye `adjustedDistance` only for wall height/shade. Applied in Level1–3.

**Rationale**: QA finding 1 — distance was stale for rays before the dino cell was rediscovered. QA finding 2 — comparing fish-eye-corrected wall depth to Euclidean dino depth mis-ordered FOV-edge columns. User chose Fix-it-now on both in triage.

**Tradeoff**: Still duplicate edits across three game scripts. Mid-loop distance write remains for `dino.angle` / scale path; occlusion no longer depends on it.

## 2026-11-16: Level 3 as copy-edit, not a shared game framework

**Decision**: Add `Level3/` by copying Level 2’s page/script/CSS/dino pattern (same `engine.js` / `camera.svg`). Give it a serpentine map, teal palette, spawn `(1.5,14.5)`, exit `(14,1)`, and dual nav on Level 2 (Previous + Next). Do **not** extract a shared `game-core.js` yet.

**Rationale**: User wanted more content. Three near-clone levels are acceptable for this static college project; a shared framework is only worth it at Level 4+.

**Tradeoff**: Continued duplication across `game.js` / `game2.js` / `game3.js`. Exit/percent math is per-level (L3 targets `(14,1)`).

## 2026-11-16: SUCCESS HUD verification method — path proof + exit-entry walk

**Decision**: Treat the SUCCESS/`Math.floor` smoke gap as closed when (1) BFS shows an open-cell path from spawn `(14,14)` to exit `(1,1)` and (2) the player enters `(1,1)` through real `player.move()` so the SUCCESS HUD branch runs. Do **not** require a full corridor keyboard auto-walk for the gate. Method used: place at pre-exit cell center, drive in via `Engine.pressed` override; confirm HUD `SUCCESS!` + `100%` on L1 and L2.

**Rationale**: The triage risk was specifically the exit cell check (`Math.floor`), not pathfinding QA. Full auto-walk stalls on narrow corner geometry; that does not invalidate the SUCCESS branch. Path length (L1 37 / L2 33) still proves reachability without shipping a solver.

**Tradeoff**: Does not prove a human (or bot) can clear the whole maze without getting stuck on corners. Adequate for the documented backlog item; a dedicated maze-runner would be separate work.

## 2026-11-11: Hybrid art — 64×64 PNG dino + shared SVG camera

**Decision**: Keep the in-maze dino as a real bitmap (`Level1|2/dino.png` at 64×64 with transparency) loaded via `Engine.Sprite`. Replace decorative `#camera` chrome with a shared root `camera.svg` referenced as `../camera.svg`; delete per-level `camera.png`. **Settled (2026-11-12):** `camera.svg` is a crispEdges 16×16 pixel rebuild of the old PNG — black camcorder *back*, peach arm stub, red REC, and a **transparent LCD window** (cols 1–5 / rows 8–10) so the maze shows through as the player moves. CSS uses `image-rendering: pixelated`. Earlier cartoon “front camera + detailed hand” SVG passes are abandoned.

**Rationale**: User chose hybrid (PNG dino + SVG camera). In-browser compare showed the original asset’s value was the see-through LCD and back-of-camera silhouette, not a new illustrated grip. Opaque beige cameras broke that effect; freehand hands never matched the lo-fi read.

**Tradeoff**: Two art pipelines (PNG + SVG). Dino still duplicated per level; camera is single-source at repo root. Camera art stays 16-logic pixels scaled up (chunky by design), not a high-res redraw. Peach arm clips at the sprite edge (same as the old PNG); user accepted that vs the blurry bilinear upscale (2026-11-12 side-by-side).

## 2026-11-11: Replace jaws / Filtrr2 / jQuery with first-party `engine.js`

**Decision**: Delete jaws.js, Filtrr2, and jQuery (including orphan level copies). Add root `engine.js` for asset load, rAF loop, keyboard (cleared on blur), sprite blit, and in-canvas sepia. Keep maps, HUD, minimap, dino, screenshot/polaroid, level links, `fit.js`, and CSP `'self'`.

**Rationale**: User does not want abandoned dependencies. Version-bumping dead libs was the wrong cleanup; deleting them and preserving gameplay flow is. jQuery existed only for Filtrr2; both go together. jaws `eval` gadgets leave the tree entirely.

**Tradeoff**: Own a small runtime instead of third-party frameworks. Sepia is a simple pixel matrix (close to Filtrr2's look, not pixel-identical). No npm introduced.

**Supersedes**: same-day "Do not bump vendored libs"; 2026-11-10 "Keep jQuery for Filtrr2"; 2026-11-10 "Block jaws eval with CSP, not a jaws fork" (CSP remains; jaws is gone).

## 2026-11-11: Do not bump vendored libs (jQuery 4 / jaws / Filtrr2) — superseded

**Decision**: ~~Keep jQuery 3.7.1; do not chase jaws/Filtrr2 updates.~~ **Superseded** by "Replace jaws / Filtrr2 / jQuery with first-party `engine.js`" the same day after explicit user direction to remove abandoned deps.

**Original rationale**: Prefer delete/replace over version bumps — that part still holds; the replace landed.

## 2026-11-10: Match maze canvas bitmap to CSS; keep screenshot polaroid

**Decision**: Set `#canvas` backing store to 600×300 (same as CSS). `numberOfRays = canvas.width` with `angleBetweenRays = (60°)/rays` so FOV stays 60°. Screenshot stays 300×150 and `drawImage` downscales the capture into that polaroid.

**Rationale**: Default HTML canvas was 300×150 stretched by CSS, so the view was soft and the photo looked half-size vs the maze. Upsizing the maze buffer without changing FOV fixes sharpness; keeping the screenshot small preserves the existing `#titleBlock` layout.

**Tradeoff**: Twice the ray work per frame (300→600). Window fit still uses `fit.js` scale on the whole block — that decision still applies for viewport fit, not for the internal maze resolution.

## 2026-11-10: Scale the layout block instead of resizing canvas buffers

**Decision**: Dynamic window sizing via `fit.js` CSS `transform: scale` on `#titleBlock`.

**Rationale**: Raycaster assumes fixed canvas geometry and ray count; changing bitmap size would break drawing math. Scaling the whole composition preserves layout and gameplay.

**Tradeoff**: Soft/blurry upscale on large monitors; not a true high-res renderer. *(Amended same day: maze bitmap now matches CSS 600×300 with FOV-preserving ray count — see entry above. `fit.js` remains the viewport-fit mechanism.)*

## 2026-11-10: Keep jQuery for Filtrr2; vendor locally under CSP — superseded

**Decision**: ~~Ship `vendor/jquery-3.7.1.slim.min.js` for Filtrr2.~~ **Superseded 2026-11-11** by first-party `engine.js` sepia (jQuery and Filtrr2 deleted). DOM HUD/instructions (no `.html()`) and CSP `'self'` still stand.

**Rationale (historical)**: Filtrr2 needed `$`; CSP forbade CDN/inline boot.

## 2026-11-10: Block jaws `eval` with CSP, not a jaws fork — superseded

**Decision**: ~~Mitigate jaws `eval` with CSP only.~~ **Superseded 2026-11-11** — jaws deleted; CSP without `unsafe-eval` remains.

**Rationale (historical)**: Avoided maintaining a jaws fork in two trees while the game never called the eval paths.
