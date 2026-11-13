# Ingredient & preparation rules — WHAT'S COOKING? V2.1

Source of truth: `js/data/ingredients.js`, `js/data/methods.js`, `js/engine/state.js`.

## Ingredients (42), as they appear in the cabinet

| Shelf | Ingredients | Can be cut on the board → state |
|---|---|---|
| Vegetables (14) | tomato, onion, mushroom, potato, carrot, zucchini, bell pepper, broccoli, garlic, spinach, corn, eggplant, cucumber, peas | tomato → chopped, onion → chopped, mushroom → sliced, potato → chopped, carrot → sliced, zucchini → sliced, pepper → chopped, broccoli → florets, garlic → minced, eggplant → sliced, cucumber → sliced (spinach, corn & peas go in as they are) |
| Protein & dairy (10) | egg, cheese, milk, butter, chicken, tofu, cream, tuna, yogurt, beans | chicken → pieces. The egg cracks over the pot or tray (tap it). |
| Carbs (8) | pasta, rice, bread, flour, pizza dough, tortilla, noodles, oats | — (straight into the pot or oven) |
| Sweet & fruit (10) | chocolate, strawberry, banana, apple, sugar, honey, lemon, blueberries, orange, peanut butter | strawberry → sliced, banana → sliced, apple → chopped, lemon → sliced, orange → sliced |

Leaving something whole is a real choice: a whole pepper becomes Stuffed Peppers, a whole onion or broccoli becomes a surprise, and a whole potato becomes a Baked Potato.

## Flow & actions

| Step | How | Alternative |
|---|---|---|
| Pick (up to 4) | tap in the cabinet; drag straight to the board, pot or oven | — |
| Put back / replace | tap the item in the cabinet again, or tap × on the pick | drag it back to the cabinet |
| Cut | swipe across the board | tap the board (3 cuts) |
| Add to a station | drag a pick into the pot or oven | tap the pick, then tap the station |
| Crack an egg | the egg waits on the rim — tap it | if you turn on the heat without cracking it, the egg goes in whole |
| Stir | circular motion on the pot (or on the oven tray while the door is open) | tap = ¼ turn |
| Heat | tap the stove knob or the oven dial | — |
| Oven door | tap the door | it opens automatically when you add food and closes when baking starts |
| Serve | when it's ready, drag "ladle it out" (pot) or "take it out" (oven, door open) onto the plate | tap the tag, then the plate — or tap the glowing plate |

Two full stirring turns combine what's in the station (and whisk a cracked egg). Stirring cooked potato in the pot mashes it.

## Constraints
- At most 4 ingredients, each one at most once. One station (pot **or** oven) per dish.
- The board holds one item, and only cuttable ones.
- Once something is in the pot or tray, it stays in. Undo takes it back out.
- Every command is validated first, so a refused command changes nothing.

## Time
Heat exposure in seconds: Heating < 3 ≤ **Ready** < 7.5 ≤ **Overcooked** < 11 ≤ **Burnt**. The oven only counts time while its door is closed.
You can tell the stage from the dial ring around the knob, the cue text, colour changes in the food and the pot's liquid, bubbles, steam, smoke, and the oven window's glow.
