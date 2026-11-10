# Project State

> **Context Safety:** Redact sensitive values. No secrets in this file.

Last updated: 2026-11-10

## What this project does

- College HTML5 maze game ("Jessie's Maze Deluxe"): two levels of client-side raycasting with a minimap, HUD, screenshot/sepia filter (Filtrr2), and level navigation. Static files only — no backend.

## Current status

- Phase: maintenance
- Overall: green — playable after security/hardening and window-fit work; missing asset files still 404

## Active priorities

- P1: Restore or replace missing `dino.png` / `camera.png` assets
- P2: Keep HUD/instructions DOM-built (no string HTML sinks) and CSP intact
- P3: Optional higher-res canvas / true responsive layout later

## Deployment Environments

- Local static hosting only (`py -3 -m http.server` or equivalent). No staging/prod deploy pipeline.

## Environment notes (safe only)

- Runtime(s): browser (ES5-era game JS + jQuery 3.7.1 slim + jaws.js + filtrr2)
- Deployment target(s): local / any static file host
- Key external dependencies (names only): jQuery (vendored), jaws.js, filtrr2.js

## Risks / blockers

- Missing `Level1|2/dino.png` and `camera.png` — sprite and camera icon 404
- Vendored jaws.js still contains `eval(_constructor)` gadgets; mitigated by CSP `script-src 'self'` (no `unsafe-eval`)
