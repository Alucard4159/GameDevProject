# Project State

> **Context Safety:** Redact sensitive values. No secrets in this file.

Last updated: 2026-11-16

## What this project does

- College HTML5 maze game ("Jessie's Maze Deluxe"): three levels of client-side raycasting with a minimap, HUD, screenshot/sepia filter, and level navigation. Static files only — no backend.

## Current status

- Phase: maintenance
- Overall: green — first-party `engine.js`; hybrid art shipped; Level 3 added (local/uncommitted); SUCCESS confirmed L1–L3.
- Latest shipped: `ce60e15` on `origin/main` (SUCCESS HUD context). Level 3 not pushed yet.

## Active priorities

- P1: Keep HUD/instructions DOM-built (no string HTML sinks) and CSP intact
- P2: Commit/push Level 3 when ready

## Deployment Environments

- Local static hosting only (`py -3 -m http.server` or equivalent). No staging/prod deploy pipeline.

## Environment notes (safe only)

- Runtime(s): browser (ES5-era game JS + first-party `engine.js` + `fit.js`)
- Deployment target(s): local / any static file host
- Key external dependencies (names only): none (no jQuery / jaws / Filtrr2)

## Risks / blockers

- (none active) — prior tiny placeholder PNG risk closed by hybrid art
