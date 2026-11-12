# Architecture

> **Context Safety:** Redact sensitive values. No secrets in this file.

## Repository layout

```text
Level1/          Level 1 page, game.js, CSS, dino.png
Level2/          Level 2 page, game2.js, CSS, dino.png
camera.svg       Shared HUD camera chrome
engine.js        Shared runtime: assets, rAF loop, keys, sprite, sepia
fit.js           Scales #titleBlock to the viewport on load/resize
.context/        Project handoff + pack-configs
.cursor/         Cursor rules + hooks (bootstrapped)
skills/          Project-local skills scaffold
scripts/         sync_manual_skill_routing.py
```

## Core components

- Component: Raycaster game loop
  - Responsibility: Cast rays, draw wall slivers, move player, HUD/instructions
  - Key files: `Level1/game.js`, `Level2/game2.js`
  - Inputs/outputs: Keyboard via `Engine.pressed`; canvas + minimap + screenshot canvas

- Component: Engine runtime
  - Responsibility: Load assets, `requestAnimationFrame` loop, key state (cleared on blur), simple sprite blit, sepia pixel filter
  - Key files: `engine.js`
  - Inputs/outputs: `Engine.start(Game, { assets })`

- Component: Viewport fit
  - Responsibility: CSS-transform scale of fixed 940×582 `#titleBlock` to window
  - Key files: `fit.js`, `Level1/game.css`, `Level2/game2.css`
  - Inputs/outputs: `resize` → `transform: scale(...)`

- Component: Screenshot / sepia
  - Responsibility: Space captures maze → polaroid; click toggles in-canvas sepia (no third-party filter lib)
  - Key files: camera handlers in game JS + `Engine.sepia` / `snapshot` / `restore`

## Data flow (high level)

1. Page loads scripts (`engine.js` → `fit.js` → level game JS)
2. `Engine.start(Game, { assets: ["dino.png"] })` loads images, runs `setup` / `update` / `draw`
3. Movement updates player coords; HUD rebuilt with DOM text nodes when values change
4. Space captures canvas → screenshot; click toggles sepia via `ImageData`

## Interfaces

- API routes / public interfaces: none (static)
- Background jobs: none
- Scheduled tasks: none

## Change notes

- Update this file only when structure/contracts change.
