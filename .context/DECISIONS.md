# Key Decisions Log

Newest first. Capture what was decided and why.

## 2026-11-10: Match maze canvas bitmap to CSS; keep screenshot polaroid

**Decision**: Set `#canvas` backing store to 600×300 (same as CSS). `numberOfRays = canvas.width` with `angleBetweenRays = (60°)/rays` so FOV stays 60°. Screenshot stays 300×150 and `drawImage` downscales the capture into that polaroid.

**Rationale**: Default HTML canvas was 300×150 stretched by CSS, so the view was soft and the photo looked half-size vs the maze. Upsizing the maze buffer without changing FOV fixes sharpness; keeping the screenshot small preserves the existing `#titleBlock` layout.

**Tradeoff**: Twice the ray work per frame (300→600). Window fit still uses `fit.js` scale on the whole block — that decision still applies for viewport fit, not for the internal maze resolution.

## 2026-11-10: Scale the layout block instead of resizing canvas buffers

**Decision**: Dynamic window sizing via `fit.js` CSS `transform: scale` on `#titleBlock`.

**Rationale**: Raycaster assumes fixed canvas geometry and ray count; changing bitmap size would break drawing math. Scaling the whole composition preserves layout and gameplay.

**Tradeoff**: Soft/blurry upscale on large monitors; not a true high-res renderer. *(Amended same day: maze bitmap now matches CSS 600×300 with FOV-preserving ray count — see entry above. `fit.js` remains the viewport-fit mechanism.)*

## 2026-11-10: Keep jQuery for Filtrr2; vendor locally under CSP

**Decision**: Ship `vendor/jquery-3.7.1.slim.min.js` and drop CDN/`jquery.js` 404; HUD/instructions use DOM APIs instead of `.html()`.

**Rationale**: Filtrr2's sepia path requires `$`. Strict CSP (`script-src 'self'`) needs a local file and no inline boot script.

**Tradeoff**: Still depends on an aging filter lib; jQuery remains for that one feature.

## 2026-11-10: Block jaws `eval` with CSP, not a jaws fork

**Decision**: Meta CSP without `unsafe-eval` instead of patching duplicated `Level1|2/jaws.js`.

**Rationale**: Game never calls `Sprite.clone` / `SpriteList.load`; CSP neutralizes the latent gadget without maintaining a jaws fork in two trees.

**Tradeoff**: If someone later uses those APIs, they break under CSP until jaws is replaced or allowlisted carefully.
