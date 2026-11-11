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
