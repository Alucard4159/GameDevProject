# Jessie's Maze Deluxe

College HTML5 maze game (Interactive Web Page Scripting): two raycast levels, minimap, HUD, screenshot/sepia, and level links. Static files only — no backend, no npm.

## Run

```text
py -3 -m http.server
```

Then open `/Level1/` or `/Level2/`.

## Layout

- `engine.js` — game loop, input, sprite, sepia (replaces old jaws / Filtrr2 / jQuery)
- `fit.js` — scales the UI block to the window
- `Level1/`, `Level2/` — page, game script, CSS, PNG assets
