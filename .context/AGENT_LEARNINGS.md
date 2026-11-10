# Agent Learnings

> **Context Safety:** Redact sensitive values. No secrets in this file.

## 2026-11-10

- jaws clears key callbacks in `switchGameState` before `setup` — register `on_keyup` in `setup`, never in `update` (update would also re-bind every frame)
- Filtrr2 depends on jQuery; removing jQuery without replacing the sepia path breaks screenshot filtering
- `fit.js` must stay a separate file so CSP can forbid inline scripts
- On Windows, prefer `py -3 -m http.server` — bare `python` may hit the Store alias stub
