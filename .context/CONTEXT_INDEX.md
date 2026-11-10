# Context Index — section pointers across `.context/`

> **Context Safety:** Redact sensitive values. No secrets in this file.

<!-- ContextTemplateVersion: 1.0 -->
<!-- BootstrappedAt: {{BOOTSTRAP_TIMESTAMP}} -->

## Purpose

A lookup layer across the `.context/` corpus — which file, which heading, one-line summary — so a session can jump to "where is the X status" without reading a large file (especially `RECENT_CHANGES.md`, which grows large and reverse-chronological) top to bottom.

**Not the same as `WORKSPACE.md`** — that file declares `WORKSPACE_ROOT` for multi-repo work. This file indexes internal section content within this project's own `.context/*.md` files.

**Not the same as `context-compressor.md`'s job** — compression reduces total `.context/` size by archiving old entries. This file doesn't shrink anything; it adds a lookup layer on top of the current files. Complementary, not overlapping — an archived entry's pointer here should be updated to note it moved to the `_ARCHIVE.md` file, not deleted.

## Maintenance

Maintained at closure, inside `.kiro/hooks/context-closure-agentStop.kiro.hook`'s step 3 (alongside the `.context/` consistency check that hook already performs) — refreshed for whichever `.context/` file(s) changed materially during the session. Only re-index on a real content/heading change, not on every save.

## Index

| File | Section / heading | One-line summary | Last confirmed |
|------|--------------------|-------------------|-----------------|
| *(populate at bootstrap or first hook run — one row per major heading across PROJECT_STATE.md, TODO.md, RECENT_CHANGES.md, DECISIONS.md, AGENT_LEARNINGS.md, ARCHITECTURE.md)* | | | |

## Related

- `WORKSPACE.md` — declares `WORKSPACE_ROOT` for multi-repo initiatives, not internal section content (different lookup problem)
- `context-compressor.md` — shrinks `.context/` size via archiving; this file adds a lookup layer, doesn't reduce anything
- `CONTEXT_HOOKS.md` — the agentStop hook that keeps this index current
