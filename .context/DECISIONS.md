# Key Decisions Log

Newest first. Capture what was decided and why.

## 2026-11-10: Scale the layout block instead of resizing canvas buffers

**Decision**: Dynamic window sizing via `fit.js` CSS `transform: scale` on `#titleBlock`.

**Rationale**: Raycaster assumes fixed canvas geometry and ray count; changing bitmap size would break drawing math. Scaling the whole composition preserves layout and gameplay.

**Tradeoff**: Soft/blurry upscale on large monitors; not a true high-res renderer.

## 2026-11-10: Keep jQuery for Filtrr2; vendor locally under CSP

**Decision**: Ship `vendor/jquery-3.7.1.slim.min.js` and drop CDN/`jquery.js` 404; HUD/instructions use DOM APIs instead of `.html()`.

**Rationale**: Filtrr2's sepia path requires `$`. Strict CSP (`script-src 'self'`) needs a local file and no inline boot script.

**Tradeoff**: Still depends on an aging filter lib; jQuery remains for that one feature.

## 2026-11-10: Block jaws `eval` with CSP, not a jaws fork

**Decision**: Meta CSP without `unsafe-eval` instead of patching duplicated `Level1|2/jaws.js`.

**Rationale**: Game never calls `Sprite.clone` / `SpriteList.load`; CSP neutralizes the latent gadget without maintaining a jaws fork in two trees.

**Tradeoff**: If someone later uses those APIs, they break under CSP until jaws is replaced or allowlisted carefully.
