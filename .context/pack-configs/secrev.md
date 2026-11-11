# secrev — project config

> Static HTML/JS only. Threat model is browser XSS / sink misuse — not auth or server RCE.

## Plugins root

`C:\Users\aluca\OneDrive\Documents\AI_Plugins_Personal`

## Scope

- Focus: DOM sinks, CSP, asset loading, first-party `engine.js` / `fit.js` / level game JS
- Known removed: jaws.js (`eval`), Filtrr2, jQuery — do not reintroduce
- Known safe-today: HUD built with `textContent` / DOM nodes (do not reintroduce `.html()` string builds)

## Constraints

- No secrets/tokens in repo
- Do not hotlink CDNs without SRI; keep scripts same-origin for CSP `'self'`
