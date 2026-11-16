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
| PROJECT_STATE.md | Current status | L3 shipped; QA+re-review complete local | 2026-11-16 |
| PROJECT_STATE.md | Active priorities | Commit full QA batch; CSP/DOM | 2026-11-16 |
| PROJECT_STATE.md | Risks / blockers | (none active) | 2026-11-11 |
| TODO.md | Now | (none) | 2026-11-16 |
| TODO.md | Next | Commit/push full QA + framing batch | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: Re-review triage | atan2 + vercel.json + docs | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: QA re-review post-triage | Report-only; led to fixes | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: QA framing + triage done | Finding 6 serve.py/_headers; summary written | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: QA triage axis-slide | Finding 5 corner clip fix | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: QA triage HUD floor | Finding 4 ceil→floor coords | 2026-11-16 |
| DECISIONS.md | 2026-11-16: Framing residual | Ban http.server docs; vercel.json | 2026-11-16 |
| DECISIONS.md | 2026-11-16: Dino bearing | Math.atan2 not atan | 2026-11-16 |
| DECISIONS.md | 2026-11-16: Framing headers | serve.py + _headers; not meta CSP | 2026-11-16 |
| DECISIONS.md | 2026-11-16: Movement collision | Axis-slide vs diagonal point sample | 2026-11-16 |
| ARCHITECTURE.md | Repository layout | + serve.py, _headers, vercel.json | 2026-11-16 |
| PROJECT_FRONTMATTER.md | Map | + serve.py, _headers, vercel.json | 2026-11-16 |
| triage-summary.md | (file) | Re-review 2 findings applied; prior in archive | 2026-11-16 |
| AGENT_LEARNINGS.md | 2026-11-10/16 | Prefer `py -3 serve.py` on Windows | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: QA triage sepia race | Finding 3 capturing/onload reset | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: QA triage dino occlusion | Findings 1–2 fixed in L1–L3 | 2026-11-16 |
| DECISIONS.md | 2026-11-16: HUD player coords | Math.floor to match collision/SUCCESS | 2026-11-16 |
| DECISIONS.md | 2026-11-16: Screenshot sepia | Block clicks while capturing; reset on load | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: qa-review-pipeline | 5 bugs + Low framing; report-only | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: Add Level 3 | Serpentine map, teal theme, L2 dual nav | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-16: Confirm SUCCESS HUD | L1+L2 exit via Math.floor; SUCCESS! 100% | 2026-11-16 |
| DECISIONS.md | 2026-11-16: Dino occlusion | Per-frame Euclidean + Euclidean wall compare | 2026-11-16 |
| DECISIONS.md | 2026-11-16: Level 3 as copy-edit | No shared game-core until Level 4+ | 2026-11-16 |
| RECENT_CHANGES.md | 2026-11-11: Hybrid art | 64×64 dino + pixel `camera.svg` (LCD hole) | 2026-11-12 |
| RECENT_CHANGES.md | 2026-11-11: Drop jaws / Filtrr2 / jQuery | First-party `engine.js`; smoked + shipped `2ae3778` | 2026-11-11 |
| RECENT_CHANGES.md | 2026-11-10: QA triage fixes | Controls/HUD/camera/canvas fixes from triage-summary | 2026-11-11 |
| DECISIONS.md | 2026-11-16: SUCCESS HUD verification method | Path proof + exit-entry walk; not full auto-maze | 2026-11-16 |
| DECISIONS.md | 2026-11-11: Hybrid art | PNG dino + pixel SVG camera (transparent LCD) | 2026-11-12 |
| AGENT_LEARNINGS.md | 2026-11-16 | Exit SUCCESS smoke vs full corridor auto-walk | 2026-11-16 |
| DECISIONS.md | 2026-11-11: Replace jaws / Filtrr2 / jQuery | `engine.js` replaces abandoned stack; keeps gameplay flow | 2026-11-11 |
| DECISIONS.md | 2026-11-10: Match maze canvas bitmap… | Canvas 600×300 FOV-preserving; screenshot polaroid 300×150 | 2026-11-11 |
| DECISIONS.md | 2026-11-10: Scale the layout block… | `fit.js` scales `#titleBlock` for viewport fit | 2026-11-11 |
| DECISIONS.md | 2026-11-10: Keep jQuery for Filtrr2… — superseded | Historical; replaced by `engine.js` sepia | 2026-11-11 |
| DECISIONS.md | 2026-11-10: Block jaws `eval`… — superseded | Historical; jaws deleted, CSP remains | 2026-11-11 |
| AGENT_LEARNINGS.md | 2026-11-11 | Poll-reset; ray/FOV coupling; delete abandoned libs via `engine.js` | 2026-11-11 |

## Related

- `WORKSPACE.md` — declares `WORKSPACE_ROOT` for multi-repo initiatives (absent here)
- `CONTEXT_HOOKS.md` — hook wiring that can keep this index current
