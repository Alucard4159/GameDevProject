# qa — project config

> Static client-side maze game. No backend workers, APIs, or containers.

## Plugins root

`C:\Users\aluca\OneDrive\Documents\AI_Plugins_Personal`

## Scope

- Prefer UI / game-loop bug hunts over backend-contract skills
- Primary surfaces: `Level1/game.js`, `Level2/game2.js`, `fit.js`, both `index.html` + CSS
- Browser verification via local static server (`py -3 -m http.server`)

## Constraints

- No server endpoints to contract-test
- Missing assets (`dino.png`, `camera.png`) are known; don't treat 404s for those as new regressions unless the task is asset restore
