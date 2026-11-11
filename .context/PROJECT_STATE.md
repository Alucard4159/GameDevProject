# Project State

> **Context Safety:** Redact sensitive values. No secrets in this file.

Last updated: 2026-11-10

## What this project does

- College HTML5 maze game ("Jessie's Maze Deluxe"): two levels of client-side raycasting with a minimap, HUD, screenshot/sepia filter (Filtrr2), and level navigation. Static files only — no backend.

## Current status

- Phase: maintenance
- Overall: green — playable after security/hardening, window-fit, and QA triage bugfixes; PNGs present (tiny 16×16 placeholders)

## Active priorities

- P1: Browser smoke of both levels after triage fixes
- P2: Keep HUD/instructions DOM-built (no string HTML sinks) and CSP intact
- P3: Optional art upgrade for `dino.png` / `camera.png`; optional vendor dedupe

## Deployment Environments

- Local static hosting only (`py -3 -m http.server` or equivalent). No staging/prod deploy pipeline.

## Environment notes (safe only)

- Runtime(s): browser (ES5-era game JS + jQuery 3.7.1 slim + jaws.js + filtrr2)
- Deployment target(s): local / any static file host
- Key external dependencies (names only): jQuery (vendored), jaws.js, filtrr2.js

## Risks / blockers

- Placeholder `dino.png` / `camera.png` are valid but 16×16 — fine for load, weak visually
- Vendored jaws.js still contains `eval(_constructor)` gadgets; mitigated by CSP `script-src 'self'` (no `unsafe-eval`)
