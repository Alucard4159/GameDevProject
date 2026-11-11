# Context Index — section pointers across `.context/`

> **Context Safety:** Redact sensitive values. No secrets in this file.

<!-- ContextTemplateVersion: 1.0 -->

## Purpose

A lookup layer across the `.context/` corpus — which file, which heading, one-line summary — so a session can jump to "where is the X status" without reading a large file top to bottom.

**Not the same as `WORKSPACE.md`** — that file declares `WORKSPACE_ROOT` for multi-repo work. This file indexes internal section content within this project's own `.context/*.md` files.

## Maintenance

Maintained at closure — refreshed for whichever `.context/` file(s) changed materially during the session. Only re-index on a real content/heading change, not on every save.

## Index

| File | Section / heading | One-line summary | Last confirmed |
|------|--------------------|-------------------|-----------------|
| PROJECT_STATE.md | Current status | Green; third-party JS removed; smoke after engine cut still open | 2026-11-11 |
| PROJECT_STATE.md | Active priorities | Smoke, CSP/DOM sinks, optional art | 2026-11-11 |
| PROJECT_STATE.md | Risks / blockers | Tiny placeholder PNGs; engine cut unsmoked | 2026-11-11 |
| TODO.md | Now | Browser smoke after engine cut | 2026-11-11 |
| TODO.md | Next | Optional PNG art upgrade | 2026-11-11 |
| RECENT_CHANGES.md | 2026-11-11: Drop jaws / Filtrr2 / jQuery | First-party `engine.js`; deleted abandoned libs | 2026-11-11 |
| RECENT_CHANGES.md | 2026-11-10: QA triage fixes | Controls/HUD/camera/canvas fixes from triage-summary | 2026-11-11 |
| DECISIONS.md | 2026-11-11: Replace jaws / Filtrr2 / jQuery | `engine.js` replaces abandoned stack; keeps gameplay flow | 2026-11-11 |
| ARCHITECTURE.md | Repository layout | Levels + `engine.js` + `fit.js`; no third-party JS | 2026-11-11 |
| PROJECT_FRONTMATTER.md | Map | Path → one-line role for Level1/2, engine, fit, context | 2026-11-11 |
| DECISIONS.md | 2026-11-10: Match maze canvas bitmap… | Canvas 600×300 FOV-preserving; screenshot polaroid 300×150 | 2026-11-11 |
| DECISIONS.md | 2026-11-10: Scale the layout block… | `fit.js` scales `#titleBlock` for viewport fit | 2026-11-11 |
| DECISIONS.md | 2026-11-10: Keep jQuery for Filtrr2… — superseded | Historical; replaced by `engine.js` sepia | 2026-11-11 |
| DECISIONS.md | 2026-11-10: Block jaws `eval`… — superseded | Historical; jaws deleted, CSP remains | 2026-11-11 |
| AGENT_LEARNINGS.md | 2026-11-11 | Poll-reset; ray/FOV coupling; delete abandoned libs via `engine.js` | 2026-11-11 |
| triage-summary.md | (file) | Eight QA findings; all applied 2026-11-10 | 2026-11-11 |

## Related

- `WORKSPACE.md` — declares `WORKSPACE_ROOT` for multi-repo initiatives (absent here)
- `CONTEXT_HOOKS.md` — hook wiring that can keep this index current
