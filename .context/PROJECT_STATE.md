# Project State

> **Context Safety:** Redact sensitive values. No secrets in this file.

Last updated: 2026-11-16

## What this project does

- College HTML5 maze game ("Jessie's Maze Deluxe"): three levels of client-side raycasting with a minimap, HUD, screenshot/sepia filter, and level navigation. Static files only — no backend.

## Current status

- Phase: maintenance
- Overall: green for ship — Level 3 on `272e4c9`. QA triage + re-review complete locally (uncommitted): findings 1–6, `atan2` dino angle, framing via `serve.py` / `_headers` / `vercel.json`.
- Latest shipped: `272e4c9` on `origin/main` (Level 3 serpentine/teal + L2 dual nav).

## Active priorities

- P1: Commit/push full QA + framing batch
- P2: Keep HUD/instructions DOM-built (no string HTML sinks) and CSP intact

## Deployment Environments

- Local: `py -3 serve.py` (not plain `http.server`). Deploy headers: `_headers` (Netlify/CF Pages), `vercel.json` (Vercel). No staging/prod pipeline.

## Environment notes (safe only)

- Runtime(s): browser (ES5-era game JS + first-party `engine.js` + `fit.js`)
- Deployment target(s): local / any static file host
- Key external dependencies (names only): none (no jQuery / jaws / Filtrr2)

## Risks / blockers

- (none active) — prior tiny placeholder PNG risk closed by hybrid art
