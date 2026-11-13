# WHAT'S COOKING? — V2.1
*Mix it. Cook it. See what happens.*

An interactive 2D cooking experiment about **choices and consequences** (University Visual Communication project).
Pick up to four ingredients from the cabinet, cut what needs cutting, choose the **pot on the stove** or the **oven**, and cook.
The dish you get depends on what you used, how you prepared it, the order you added things, which station you chose and when you stopped.

V2.1 improves on V2 (`../v2/`); V1 and V2 are untouched. See `docs/CHANGES.md` for what changed.

## Run it
- **Locally:** open `index.html` in a browser. There's no build step and no server needed.
- **GitHub Pages:** push the `whats-cooking/` folder and open `.../whats-cooking/v2.1/`.
- There's no backend. Fonts load from Google Fonts when available and fall back to system fonts otherwise.

## How to play
1. **Pick:** tap ingredients in the cabinet at the top (up to 4). They fly into your slots. Tap again, or tap ×, to put one back.
2. **Cut:** drag a vegetable or fruit onto the board and swipe or tap it.
3. **Choose & add:** drag your picks into the pot or the oven, or tap a pick and then tap the station. Food falls into the pot or slides onto the oven tray.
4. **Cook:** light the stove or turn the oven dial, and stir in circles. Wait for "ready!".
5. **Serve:** drag "ladle it out" from the pot, or open the oven and drag "take it out", onto the plate at the bottom. The dish travels to the plate, settles, and is then revealed and saved to the recipe book.

## Content
- 42 ingredients, each with its own raw, cut and cooked drawings.
- 2 cooking stations, plus 5 readable cooking stages (raw, heating, ready, overcooked, burnt).
- 111 authored dishes (82 familiar, 15 unusual, 14 surreal surprises). Each has its own plated illustration and reveal animation.
- Every other combination becomes a deterministic **kitchen improvisation**, named and drawn from what you actually cooked.

Docs: `docs/CHANGES.md` (summary of changes), `docs/RULES.md` (ingredients and rules), `docs/RECIPES.md` (outcome table, ⚠️ spoilers), `docs/DISCOVERIES.md`, `docs/TEST_REPORT.md`.

## Code structure
```
v2.1/
├── index.html · css/style.css
├── js/core/util.js
├── js/data/ingredients.js      42 ingredients, categories, cutting rules
├── js/data/methods.js          pot & oven, cooking stages
├── js/data/recipes.js          111 outcomes + prioritized rules
├── js/engine/state.js          deterministic state machine (cabinet, board, pot, oven door, undo)
├── js/engine/engine.js         facts → rules → deterministic improvisation fallback
├── js/services/storage.js · audio.js
├── js/ui/ingredient-art.js · dish-art.js · render.js · fx.js · input.js · book.js · result.js
├── js/main.js
├── tests/                      engine tests, browser tests, reproduction scripts, dish gallery, doc generator
└── docs/
```

## Tests
```
node tests/engine_test.js                  # 111 outcomes, method contrasts, fuzzing
python3 -m http.server 8767 &              # from v2.1/
python3 tests/ui_test.py                   # real browser, mouse + touch
node tests/make_docs.js                    # regenerate RECIPES.md & DISCOVERIES.md
```

## Known limitations
- The serving and plating animations use the Web Animations API. Very old browsers skip the flight and go straight to the plated dish.
- On a small phone, the pot and oven sit side by side at a modest size, so the cabinet and board stay readable without page scrolling.
- The food bobbing and the dish settling are restarted when a station redraws mid-animation. This is rare and only cosmetic.
- You use one station per dish, so you can't boil pasta and bake it afterwards.
- The pot always holds water, so sweet "puddings" made in it are playful rather than exact.
- How done a dish is depends on its longest-cooked ingredient.
- Tested in Chrome desktop and emulated iPhone touch. It hasn't been tried on a real iPhone or in Safari, and the sound hasn't been checked by ear.
- The recipe book is saved in this browser's localStorage.
