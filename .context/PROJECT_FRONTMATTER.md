# Project Frontmatter — file/folder map

> **Context Safety:** Redact sensitive values (hostnames, IPs, identifiers). No secrets in this file.

<!-- ContextTemplateVersion: 1.0 -->

## Purpose

A compact map of this project's folders/files with a one-line description of what each is for.

## Maintenance

Refresh when top-level layout changes (see `ARCHITECTURE.md`).

## Map

| Path | What it is |
|------|------------|
| `Level1/` | Level 1 page: `index.html`, `game.js`, `game.css`, `dino.png`, `camera.png` |
| `Level2/` | Level 2 page: `index.html`, `game2.js`, `game2.css`, matching assets |
| `engine.js` | First-party runtime: assets, rAF loop, keys, sprite, sepia |
| `fit.js` | Scales `#titleBlock` to the viewport |
| `.context/` | Handoff, decisions, pack-configs, triage summary |
| `.cursor/` | Cursor rules and hooks |
| `skills/` | Project-local skills scaffold |
| `scripts/` | Helper scripts (e.g. skill routing sync) |
| `README.md` | Short project blurb |
| `LICENSE` | License file |

## Related

- `ARCHITECTURE.md` — component responsibilities and data flow
- `PROJECT_STATE.md` — status and environment notes
