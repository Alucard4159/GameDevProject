# Project State

> **Context Safety:** Redact sensitive values. No secrets in this file.

Last updated: 2026-11-11

## What this project does

- College HTML5 maze game ("Jessie's Maze Deluxe"): two levels of client-side raycasting with a minimap, HUD, screenshot/sepia filter, and level navigation. Static files only — no backend.

## Current status

- Phase: maintenance
- Overall: green — third-party jaws/Filtrr2/jQuery removed; first-party `engine.js` owns loop/input/sprite/sepia. Browser smoke passed 2026-11-11 (exit SUCCESS walk not exercised).
- Latest shipped before this change: `903a3ef` on `origin/main` (triage fixes). Engine cut is local until committed.

## Active priorities

- P1: Commit engine cut + context/README updates
- P2: Keep HUD/instructions DOM-built (no string HTML sinks) and CSP intact
- P3: Optional art upgrade for `dino.png` / `camera.png`

## Deployment Environments

- Local static hosting only (`py -3 -m http.server` or equivalent). No staging/prod deploy pipeline.

## Environment notes (safe only)

- Runtime(s): browser (ES5-era game JS + first-party `engine.js` + `fit.js`)
- Deployment target(s): local / any static file host
- Key external dependencies (names only): none (no jQuery / jaws / Filtrr2)

## Risks / blockers

- Placeholder `dino.png` / `camera.png` are valid but 16×16 — fine for load, weak visually
