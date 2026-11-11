# qa — project config

> Static client-side maze game. No backend workers, APIs, or containers.

## Plugins root

`C:\Users\aluca\OneDrive\Documents\AI_Plugins_Personal`

## Scope

- Prefer UI / game-loop bug hunts over backend-contract skills
- Primary surfaces: `Level1/game.js`, `Level2/game2.js`, `engine.js`, `fit.js`, both `index.html` + CSS
- Browser verification via local static server (`py -3 -m http.server`)
- No TypeScript — skip `typescript-review` unless `.ts` appears

## Constraints

- No server endpoints to contract-test
- Placeholder `dino.png` / `camera.png` are present (tiny); don't treat their existence as a regression
