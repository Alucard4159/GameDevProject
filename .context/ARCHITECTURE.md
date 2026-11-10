# Architecture

> **Context Safety:** Redact sensitive values. No secrets in this file.

## Repository layout

```text
Level1/          Level 1 page, game.js, CSS, jaws/filtrr2 copies, assets (partial)
Level2/          Level 2 page, game2.js, CSS, jaws/filtrr2 copies, assets (partial)
vendor/          Shared jquery-3.7.1.slim.min.js
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
  - Inputs/outputs: Keyboard via jaws; canvas + minimap + screenshot canvas

- Component: Viewport fit
  - Responsibility: CSS-transform scale of fixed 940×582 `#titleBlock` to window
  - Key files: `fit.js`, `Level1/game.css`, `Level2/game2.css`
  - Inputs/outputs: `resize` → `transform: scale(...)`

- Component: Image filter
  - Responsibility: Sepia toggle on screenshot canvas (Filtrr2 needs jQuery)
  - Key files: `filtrr2.js`, camera click handler in game JS

## Data flow (high level)

1. Page loads scripts (jQuery → filtrr2 → jaws → fit → game)
2. `jaws.start(Game)` loads assets, runs `setup` / `update` / `draw`
3. Movement updates player coords; HUD rebuilt with DOM text nodes
4. Space captures canvas → screenshot; click toggles Filtrr2 sepia

## Interfaces

- API routes / public interfaces: none (static)
- Background jobs: none
- Scheduled tasks: none

## Change notes

- Update this file only when structure/contracts change.
