# Recent Changes

> **Context Safety:** Redact sensitive values. No secrets in this file.

Reverse chronological log of notable implementation and operational changes.

## 2026-11-10: Context bootstrap + window fit + security hardening

- What changed:
  - Installed `.context/`, Cursor rules/hooks, `skills/` scaffold, pack-configs for context/qa/secrev
  - Added `fit.js` to scale `#titleBlock` to the viewport
  - Replaced jQuery `.html()` HUD/instructions with DOM builders; moved `on_keyup` to `setup`; scoped sliver arrays; clamped `containsBlock`
  - Added CSP; vendored jQuery; moved `jaws.start` into game JS files
- Why: Harden sinks, make the UI fill the window, give agents durable project memory
- Impact: Playable under CSP; layout scales; session handoff files exist
- Follow-ups: Restore missing PNG assets; optional vendor dedupe of jaws/filtrr2
