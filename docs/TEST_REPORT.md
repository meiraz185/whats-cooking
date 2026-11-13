# Test report — WHAT'S COOKING? V2.1

Date: 2026-11-13. Browser: Google Chrome (headless), driven by Playwright. Engine tests ran in Node 22.
Only tests that were actually run are listed, and all of them passed on the final build.

## 1. Bug audit before the changes (V2 build)
- **Automated random play:** 700 random real taps and drags on V2 (desktop mouse). It produced **no JS errors and no stuck states**.
- **Bugs found by review and by the new tests, all fixed in V2.1:**
  1. **Serving too early:** the plate served instantly, even raw food, and the result appeared before any serving action.
  2. **Oven door:** you could "serve" from the oven with its door still closed, so taking the dish out was skipped.
  3. **Grabbing cut food:** on the board, you could only drag a cut ingredient by touching an actual piece. Touching the gaps between slices started a chop instead, so dragging chopped food off the board was unreliable. You can now grab the food anywhere on the board.
  4. **Mouse scrolling:** a mostly-horizontal mouse drag in the cabinet was always treated as scrolling, even when the shelf couldn't scroll, so that drag did nothing.
  5. **Hidden picks:** a newly picked ingredient was briefly ungrabbable during its arrival animation. It is now transparent rather than hidden, so it can be grabbed straight away.
  6. **Recipe steps:** a step mentioning "peanut butter" was wrongly treated as a step about "butter" and filtered out of the recipe card.

## 2. Engine tests (`node tests/engine_test.js`): 678 / 678 passed
- 42 ingredients, no duplicates, and no grater code.
- All **111 authored outcomes** reproduced from their scripts (`tests/solutions.js`), each run twice with the same result.
- 17 contrast and method scripts, including the three combinations from the brief cooked in both the pot and the oven.
- **Every combination works:** 300 random ingredient sets were each cooked in the pot and in the oven. Pot and oven gave different results in all 300, every one gave a result, and there were 86 distinct improvised names.
- 500 rounds of random commands with state checks after each one: **0 violations**.

## 3. Real-browser tests (`python3 tests/ui_test.py`): 54 / 54 passed

| Check | Result | Detail |
|---|---|---|
| All ingredients appear in the cabinet (42, no duplicates) | PASS | 42 shown |
| Every cabinet category is filled (even counts → two full shelf rows, no gaps) | PASS | [['veg', 14, 7], ['dairy', 10, 5], ['carb', 8, 4], ['sweet', 10, 5]] |
| Layout order: cabinet → picks & board → pot & oven → serving plate at the very bottom | PASS | [128, 340, 340, 480, 480, 725] |
| Preparation area holds only the 4 slots, the board and the knife | PASS |  |
| The cabinet is at the top of the kitchen | PASS |  |
| The grater is completely gone (DOM, text, engine) | PASS |  |
| Two cooking stations only: pot + oven | PASS |  |
| Plate starts empty and inactive | PASS |  |
| Picking animates: the ingredient flies to its slot, then settles | PASS | flyer=1 settled=True |
| Every ingredient can be selected and deselected by tapping it in the cabinet | PASS | [] |
| No more than four can be selected (5th refused, selection shown "4/4 picked") | PASS | 4 4/4 picked |
| Replace: × on a pick puts it back, then another can be chosen | PASS |  |
| Cutting board works (tap ×3 → chopped tomato) | PASS | chopped |
| Only appropriate ingredients can be cut (pasta refused by the board) | PASS | counter |
| Cuttable list is logical | PASS | ['tomato', 'onion', 'mushroom', 'potato', 'carrot', 'zucchini', 'pepper', 'broccoli', 'garlic', 'eggplant', 'cucumber', 'chicken', 'strawberry', 'banana', 'apple', 'lemon |
| Ingredients visually enter the chosen station (tomato drawn in the pot) | PASS |  |
| Pot works: stove lights, flames + bubbles animate | PASS | flames=9 bubbles=12 |
| Food visibly falls into the pot and gently simmers (bobbing) while cooking | PASS | fall=True bob=2 |
| When ready, the pot offers a ladle and the plate lights up (no reveal yet) | PASS |  |
| Serving: the dish travels from the pot to the plate, settles, THEN the reveal shows | PASS | fly=1 plated=True |
| Final dish reveal works (Shakshuka from tomato cooked first, then egg) | PASS | shakshuka |
| Oven door opens and closes on tap | PASS |  |
| Oven works: tray reachable with door open, stirring makes batter, dial closes door and bakes, glow in window | PASS | open=True mixed=True baking=True |
| Opening the door pauses baking (genuinely interactive) | PASS | 2.7s → 2.7s while open |
| Oven must be opened to take the dish out (closed-door serve refused with a hint); oven light on | PASS | Open the oven door to take the dish out. |
| Oven dish taken out → Chocolate Banana Cake | PASS | Chocolate Banana Cake |
| Different cooking methods produce different dishes & illustrations (5 real combos) | PASS | egg+cheese+tomato+onion: pot → Cheesy Tomato & Egg Stew / oven → Baked Egg & Veg Casserole ; pasta+tomato+cheese+mushroom: pot → Cheesy Tomato Mushroom Pasta / oven → Bak |
| Unusual combination still produces a named, drawn result | PASS | Rustic Tofu & Sugar Stew |
| …and its picture/name change with method and ingredients | PASS | Baked Apple |
| Cooking time changes the result (soft vs hard-boiled egg) | PASS | Soft-Boiled Egg / Hard-Boiled Egg |
| Leaving it too long burns it (Charcoal Phoenix) | PASS |  |
| Sound effects fire on select (+whoosh/settle), chop, drop, splash, stir, ignite, ready (audio running) | PASS | running; ['chop', 'drop', 'ignite', 'pick', 'ready', 'settle', 'splash', 'stir', 'whoosh'] |
| Oven sounds: door open, door close, oven on, baking done | PASS | ['bakeDone', 'doorClose', 'doorOpen', 'ovenOn', 'pick', 'settle', 'tray', 'whoosh'] |
| All earlier (V1 + V2) sound effects are still present | PASS |  |
| Mute button works (master gain → 0, back on → restored) | PASS | 0.000 / 0.55 |
| Serving + reveal sounds play (serve, settle, reveal) | PASS | ['ignite', 'pick', 'ready', 'reveal', 'serve', 'settle', 'splash', 'whoosh'] |
| Restart (clean up) works (kitchen with food in an open oven → empty, door shut) | PASS |  |
| Choosing the pot locks out the oven for that dish | PASS |  |
| Undo takes the last ingredient back out | PASS |  |
| Recipe book records discoveries incl. improvisations | PASS | 17 |
| Six more complete sessions (cabinet → board → pot/oven → plate → reveal) give the right dishes | PASS | ['Ratatouille', 'Chicken Quesadilla', 'Peanut Noodles', 'Apple Crumble', 'Blueberry Porridge', 'Blueberry Muffins'] |
| Desktop: no page errors | PASS | [] |
| Mobile: no horizontal overflow, no page scroll | PASS | x=0 y=0 |
| Mobile: cabinet items and stations are touch-sized (items ≥ 60px, stations ≥ 80px) | PASS | item [61, 84], stations [144, 110, 180, 188] |
| Mobile: cabinet browses by compact horizontal scroll + category tabs | PASS | scrollWidth [1390, 348], after tab 1042 |
| Mobile: tap selects up to exactly four; tapping again deselects | PASS | 4 then 3 |
| Mobile: cutting on a touchscreen (swipe) works | PASS | sliced |
| Mobile: tap-to-place into the pot + circular touch stirring | PASS | in pot 4, mixed True |
| Mobile: ladle tapped then plate tapped → reveal (Chocolate Banana Pudding) | PASS | Chocolate Banana Pudding |
| Mobile: result card fits the screen | PASS |  |
| Mobile: oven door by touch, drag from the cabinet, bake, open, drag the tray to the plate → Pizza | PASS | open=True tray=3 closed=True → pizza |
| Phone landscape: no horizontal overflow | PASS |  |
| Mobile: no page errors | PASS | [] |
| All 111 authored outcomes reproduced in the browser engine and drawn | PASS | [] |

### Complete cooking sessions played through the real interface (17 in total)
Shakshuka (pot, tomato chopped and cooked before the egg) · Chocolate Banana Cake (oven, stirred tray, door opened to take it out) · Cheesy Tomato & Egg Stew / Baked Egg & Veg Casserole · Cheesy Tomato Mushroom Pasta / Baked Pasta Casserole · Chocolate Banana Pudding / Chocolate Banana Cake · Rustic Potato & Butter Broth / Baked Potato · Chicken Soup / Roast Chicken · Rustic Tofu & Sugar Stew · Baked Apple · Soft- and Hard-Boiled Egg · Charcoal Phoenix (burnt) · Hot Chocolate · **Ratatouille** (3 vegetables chopped on the board) · **Chicken Quesadilla** · **Peanut Noodles** · **Apple Crumble** · **Blueberry Porridge** · **Blueberry Muffins**. On touch: Chocolate Banana Pudding and Margherita Pizza.

## 4. Not covered
- Nothing was run on a physical iPhone or in Safari/WebKit. Mobile was emulated in Chrome with real touch events.
- Sound was checked by the game's own record of which sounds played, plus the audio-context state and master volume; nobody listened to it.
- The screenshot mentioned in the brief wasn't attached (only the text was), so the layout was judged against my own V2 screenshots.
