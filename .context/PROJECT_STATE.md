# Project State

> **Context Safety:** Redact sensitive values. No secrets in this file.

Last updated: 2026-11-16

## What this project does

- College HTML5 maze game ("Jessie's Maze Deluxe"): two levels of client-side raycasting with a minimap, HUD, screenshot/sepia filter, and level navigation. Static files only — no backend.

## Current status

- Phase: maintenance
- Overall: green — first-party `engine.js`; hybrid art shipped; SUCCESS HUD confirmed in-browser on L1+L2 (2026-11-16).
- Latest shipped: `04814c5` on `origin/main` (hybrid art). Exit SUCCESS walk verified locally (not a separate commit).

## Active priorities

- P1: Keep HUD/instructions DOM-built (no string HTML sinks) and CSP intact
- P2: (none — backlog clear)

## Deployment Environments

- Local static hosting only (`py -3 -m http.server` or equivalent). No staging/prod deploy pipeline.

## Environment notes (safe only)

- Runtime(s): browser (ES5-era game JS + first-party `engine.js` + `fit.js`)
- Deployment target(s): local / any static file host
- Key external dependencies (names only): none (no jQuery / jaws / Filtrr2)

## Risks / blockers

- (none active) — prior tiny placeholder PNG risk closed by hybrid art
