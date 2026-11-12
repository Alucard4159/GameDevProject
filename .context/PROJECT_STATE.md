# Project State

> **Context Safety:** Redact sensitive values. No secrets in this file.

Last updated: 2026-11-12

## What this project does

- College HTML5 maze game ("Jessie's Maze Deluxe"): two levels of client-side raycasting with a minimap, HUD, screenshot/sepia filter, and level navigation. Static files only — no backend.

## Current status

- Phase: maintenance
- Overall: green — first-party `engine.js`; hybrid art accepted (64×64 dino PNGs + pixel-faithful `camera.svg` with transparent LCD). Engine-cut smoke passed 2026-11-11; camera settled/accepted 2026-11-12.
- Latest shipped: `2ae3778` on `origin/main` (engine cut + context/README). Art upgrade accepted, still local/uncommitted.

## Active priorities

- P1: Keep HUD/instructions DOM-built (no string HTML sinks) and CSP intact
- P2: Optional in-browser walk to exit for SUCCESS HUD confirmation
- P3: Commit/push hybrid art when ready

## Deployment Environments

- Local static hosting only (`py -3 -m http.server` or equivalent). No staging/prod deploy pipeline.

## Environment notes (safe only)

- Runtime(s): browser (ES5-era game JS + first-party `engine.js` + `fit.js`)
- Deployment target(s): local / any static file host
- Key external dependencies (names only): none (no jQuery / jaws / Filtrr2)

## Risks / blockers

- (none active) — prior tiny placeholder PNG risk closed by hybrid art
