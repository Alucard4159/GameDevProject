# Jessie's Maze Deluxe

College HTML5 maze game (Interactive Web Page Scripting): two raycast levels, minimap, HUD, screenshot/sepia, and level links. Static files only — no backend, no npm.

## Run

```text
py -3 serve.py
```

Then open `/Level1/`, `/Level2/`, or `/Level3/`.

**Do not** use `py -3 -m http.server` / `python -m http.server` for this project — it cannot set framing headers. `serve.py` sends `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`. Deploy headers: `_headers` (Netlify / Cloudflare Pages), `vercel.json` (Vercel).

## Layout

- `engine.js` — game loop, input, sprite, sepia (replaces old jaws / Filtrr2 / jQuery)
- `fit.js` — scales the UI block to the window
- `camera.svg` — shared HUD camera chrome
- `serve.py` — local static server with framing headers
- `_headers` — framing headers for Netlify / Cloudflare Pages
- `vercel.json` — framing headers for Vercel
- `Level1/`, `Level2/`, `Level3/` — page, game script, CSS, `dino.png`
