# Key Decisions Log

Newest first. Capture what was decided and why.

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
