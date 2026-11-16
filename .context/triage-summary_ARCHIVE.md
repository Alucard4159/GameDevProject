# Triage Session Summary
Date: 2026-11-10
Source: QA pack primary surfaces — `Level1/game.js`, `Level2/game2.js`, `fit.js`, both `index.html`, both CSS (in-conversation Final Report)
Total Findings: 8
Status: All 8 applied 2026-11-10 (both levels + HTML/CSS)

## To Fix (8) — applied
- [Critical] Stuck controls after blur
  Fix: Zero `direction`/`speed` each frame in `update`, then set from `jaws.pressed`; drop keyup latches (both levels).
- [Bug] Exit cell only half-counts
  Fix: Use `Math.floor(this.x) === 1 && Math.floor(this.y) === 1` instead of `Math.round` (both levels).
- [Bug] Negative completion percent
  Fix: Use real max distance (e.g. `Math.hypot(13, 13)`) and/or clamp to `[0, 100]` (both levels).
- [Bug] Space captures every frame
  Fix: Rising-edge space only; reset Filtrr before drawing new frame / gate clicks until `onload` (both levels).
- [Bug] Screenshot bitmap half of displayed maze
  Fix: Set `#canvas` and `#screenshot` width/height to 600×300 before `toDataURL` (HTML/CSS/`canvas.init`, both levels).
- [Improvement] Ray shade index OOB at distance 0
  Fix: Clamp shade to `0 .. palette.shades - 1` (both levels).
- [Improvement] Instructions typos
  Fix: `"phot "` → `"photo"`; `"Delux"` → `"Deluxe"` in instructions/title strings (both levels).
- [Improvement] HUD rebuilt every move frame
  Fix: Update the three text nodes when values change instead of `replaceChildren` every frame (both levels).

## Deferred (0)

## Skipped (0)

## Re-investigated (0)

---

# Triage Session Summary
Date: 2026-11-16 (first pass — six findings)
Source: `/qa-review-pipeline` Full game surface
Total Findings: 6
Status: All 6 applied 2026-11-16

## To Fix (6) — applied
- [Bug] Stale `dino.distance` after `dino.show = false`
  Fix: Set `dino.distance` once per `castRays` from player↔dino geometry (L1–L3). Re-investigated first (not a bare `10000` reset).
- [Bug] Occlusion metric mismatch (fish-eye wall vs Euclidean dino)
  Fix: Compare Euclidean wall `distance` to `dino.distance`; keep `adjustedDistance` for height/shade only (L1–L3).
- [Bug] Screenshot / sepia race
  Fix: `capturing` flag blocks polaroid clicks mid-load; onload resets filter state after draw (L1–L3).
- [Bug] HUD `Math.ceil` vs engine `Math.floor`
  Fix: HUD `Player.X` / `Player.Y` use `Math.floor` (L1–L3); percent still `Math.ceil`.
- [Bug] Corner clipping
  Fix: Axis-slide in `player.move` — try X@old Y then Y@maybe-new X (L1–L3).
- [Low / Security] No `X-Frame-Options` / CSP `frame-ancestors`
  Fix: `serve.py` sends both headers locally; `_headers` for Netlify/Cloudflare Pages; README Run updated. Meta CSP cannot set `frame-ancestors`.

## Deferred (0)

## Skipped (0)

## Re-investigated (1)
- [Bug] Stale `dino.distance` after `dino.show = false`
  Outcome: PARTIALLY CONFIRMED — fixed via per-frame Euclidean distance refresh (not only reset-on-hide).
