# secrev — project config

> Static HTML/JS only. Threat model is browser XSS / sink misuse / supply-chain of vendored libs — not auth or server RCE.

## Plugins root

`C:\Users\aluca\OneDrive\Documents\AI_Plugins_Personal`

## Scope

- Focus: DOM sinks, CSP, asset loading, vendored `jaws.js` / `filtrr2.js` / jQuery
- Known mitigated: jaws `eval(_constructor)` blocked by CSP without `unsafe-eval`
- Known safe-today: HUD built with `textContent` / DOM nodes (do not reintroduce `.html()` string builds)

## Constraints

- No secrets/tokens in repo
- Do not hotlink CDNs without SRI; keep scripts under `vendor/` or level folders for CSP `'self'`
