# Recipe outcome table — WHAT'S COOKING? V2.1

⚠️ Spoilers. Generated from `js/data/recipes.js` and `tests/solutions.js` by `node tests/make_docs.js`.

111 authored outcomes (82 familiar, 15 unusual, 14 surreal). Rules are checked in priority order; the first match wins. "Decided by" shows what beyond the ingredient list changes the result.

| # | Outcome | Type | Decided by | Trigger rule | Verified reproduction |
|---|---|---|---|---|---|
| 1 | **The Charcoal Phoenix** | Surreal / surprise | time | Anything cooked into the Burnt phase. | Bread → oven · oven heat on · wait 12s · oven door open · serve |
| 2 | **Lukewarm Hope** | Unusual | time | Serve before anything reaches Ready. | Potato → pot · pot heat on · wait 1s · pot heat off · serve |
| 3 | **The Impossible Tower** | Surreal / surprise | order | Oven: 4 ingredients, each added separately while baking (≥1 s apart). | oven heat on · Bread → oven · oven door closed · wait 1.2s · Cheese → oven · oven door closed · wait 1.2s · Tomato → oven · oven door closed · wait 1.2s · Mushroom → oven · oven door closed · wait 1.5s · oven door open · serve |
| 4 | **Onion Blossom** | Surreal / surprise | prep | Oven: a whole (uncut) onion, alone or with one other ingredient. | Onion → oven · oven heat on · wait 4s · oven door open · serve |
| 5 | **The Tiny Broccoli Forest** | Surreal / surprise | prep | Oven: a whole (uncut) broccoli, alone or with one other ingredient. | Broccoli → oven · oven heat on · wait 4s · oven door open · serve |
| 6 | **Runaway Cheese Monster** | Surreal / surprise | time | Oven: cheese (+ at most one other) baked until Overcooked. | Cheese → oven · oven heat on · wait 8s · oven door open · serve |
| 7 | **The Tortilla UFO** | Surreal / surprise | method | Oven: a tortilla alone. | Tortilla → oven · oven heat on · wait 4s · oven door open · serve |
| 8 | **Giant Strawberry Pancake** | Surreal / surprise | prep | Oven: flour + milk/egg stirred into batter + strawberry. | Flour → oven · Milk → oven · Strawberry → oven · stir oven 2 turns · oven heat on · wait 4s · oven door open · serve |
| 9 | **Runaway Cloud Soufflé** | Surreal / surprise | prep | Oven: egg cracked and stirred (whisked), with only dairy. | Egg → oven · crack egg · stir oven 2 turns · oven heat on · wait 4s · oven door open · serve |
| 10 | **The Blueberry Galaxy** | Surreal / surprise | action | Pot: blueberries + milk/cream/yogurt, stirred 4+ turns. | Blueberries → pot · Yogurt → pot · pot heat on · wait 1s · stir pot 4.5 turns · wait 2.5s · serve |
| 11 | **Bubbling Mystery Stew** | Surreal / surprise | ingredients | Pot: 3+ ingredients mixing chocolate/fruit with vegetables, eggs, chicken, tofu or cheese. | Strawberry → pot · Onion → pot · Potato → pot · pot heat on · wait 4s · serve |
| 12 | **Chocolate Spaghetti Creature** | Surreal / surprise | method | Pot: pasta + chocolate. | Pasta → pot · Chocolate → pot · pot heat on · wait 4s · serve |
| 13 | **Volcanic Mole** | Surreal / surprise | order | Pot: chopped tomato cooked to Ready, THEN chocolate. | Tomato → board · chop Tomato · Tomato → pot · pot heat on · wait 3.5s · Chocolate → pot · wait 0.5s · serve |
| 14 | **Popcorn Eruption** | Surreal / surprise | time | Pot: corn cooked until Overcooked. | Corn → pot · pot heat on · wait 8s · serve |
| 15 | **The Dough Blob** | Surreal / surprise | method | Pot: pizza dough. | Pizza dough → pot · pot heat on · wait 4s · serve |
| 16 | **Mashed Potatoes** | Familiar | order | Pot: potato cooked to Ready, then stirred hard. | Potato → pot · pot heat on · wait 4s · stir pot 2 turns · serve |
| 17 | **Shakshuka** | Familiar | order | Pot: chopped tomato cooked to Ready, THEN cracked egg, not stirred. | Tomato → board · chop Tomato · Tomato → pot · pot heat on · wait 3.5s · Egg → pot · crack egg · wait 1s · serve |
| 18 | **Tomato & Egg Stew** | Familiar | method | Pot: tomato + egg (any other way). | Tomato → pot · Egg → pot · crack egg · pot heat on · wait 4s · serve |
| 19 | **Soft-Boiled Egg** | Familiar | time | Pot: a whole (uncracked) egg alone, served at Ready before 5.5 s. | Egg → pot · pot heat on · wait 4s · serve |
| 20 | **Hard-Boiled Egg** | Familiar | time | Pot: a whole egg alone, served at 5.5 s or later. | Egg → pot · pot heat on · wait 6.5s · serve |
| 21 | **Peanut Noodles** | Familiar | ingredients | Pot: noodles + peanut butter. | Noodles → pot · Peanut butter → pot · pot heat on · wait 4s · serve |
| 22 | **Dessert Noodles** | Unusual | ingredients | Pot: noodles + chocolate, fruit, sugar or honey. | Noodles → pot · Chocolate → pot · pot heat on · wait 4s · serve |
| 23 | **Ramen Bowl** | Familiar | ingredients | Pot: noodles (+ savoury toppings). | Noodles → pot · Egg → pot · crack egg · Spinach → pot · pot heat on · wait 4s · serve |
| 24 | **Tuna Pasta** | Familiar | ingredients | Pot: pasta + tuna. | Pasta → pot · Tuna → pot · Tomato → pot · pot heat on · wait 4s · serve |
| 25 | **Mac & Cheese** | Familiar | ingredients | Pot: pasta + milk + cheese (no tomato). | Pasta → pot · Milk → pot · Cheese → pot · pot heat on · wait 4s · serve |
| 26 | **Tomato Mushroom Pasta** | Familiar | method | Pot: pasta + tomato + mushroom. | Pasta → pot · Tomato → pot · Cheese → pot · Mushroom → pot · pot heat on · wait 4s · serve |
| 27 | **Creamy Alfredo Pasta** | Familiar | ingredients | Pot: pasta + cream (no tomato). | Pasta → pot · Cream → pot · Cheese → pot · pot heat on · wait 4s · serve |
| 28 | **Pasta Pomodoro** | Familiar | order | Pot: pasta + tomato; cheese only after the pasta is cooked (or heat off). | Pasta → pot · Tomato → pot · pot heat on · wait 4s · Cheese → pot · serve |
| 29 | **Tangled Cheese-Rope Pasta** | Unusual | order | Pot: pasta + cheese added before the pasta cooked. | Pasta → pot · Cheese → pot · pot heat on · wait 4s · serve |
| 30 | **Chicken Noodle Soup** | Familiar | ingredients | Pot: pasta + chicken. | Pasta → pot · Chicken → pot · pot heat on · wait 4s · serve |
| 31 | **Sweet Fruit Pasta** | Unusual | ingredients | Pot: pasta + strawberry, banana, apple, sugar or honey. | Pasta → pot · Banana → pot · pot heat on · wait 4s · serve |
| 32 | **Garlic Butter Noodles** | Familiar | ingredients | Pot: pasta + garlic or butter. | Pasta → pot · Garlic → pot · Butter → pot · pot heat on · wait 4s · serve |
| 33 | **Pasta Primavera** | Familiar | ingredients | Pot: pasta + any vegetable. | Pasta → pot · Carrot → pot · Zucchini → pot · pot heat on · wait 4s · serve |
| 34 | **Tuna Rice Bowl** | Familiar | ingredients | Pot: rice + tuna. | Rice → pot · Tuna → pot · pot heat on · wait 4s · serve |
| 35 | **Creamy Curry** | Familiar | ingredients | Pot: chicken or tofu + yogurt or cream. | Chicken → board · chop Chicken · Chicken → pot · Yogurt → pot · Rice → pot · pot heat on · wait 4s · serve |
| 36 | **Rice Pudding** | Familiar | ingredients | Pot: rice + milk/sugar/honey/fruit, nothing savory. | Rice → pot · Milk → pot · Honey → pot · pot heat on · wait 4s · serve |
| 37 | **Creamy Risotto** | Familiar | ingredients | Pot: rice + mushroom, cheese or butter. | Rice → pot · Mushroom → pot · Cheese → pot · pot heat on · wait 4s · serve |
| 38 | **Chicken & Rice Pot** | Familiar | ingredients | Pot: rice + chicken. | Rice → pot · Chicken → pot · pot heat on · wait 4s · serve |
| 39 | **Vegetable Pilaf** | Familiar | ingredients | Pot: rice + vegetable, tofu or egg. | Rice → pot · Corn → pot · Bell pepper → pot · pot heat on · wait 4s · serve |
| 40 | **Porridge** | Familiar | ingredients | Pot: oats (+ milk, cream, yogurt or sweet things). | Oats → pot · Milk → pot · Blueberries → pot · pot heat on · wait 4s · serve |
| 41 | **Tortilla Soup** | Familiar | ingredients | Pot: tortilla + tomato, chicken, corn or pepper. | Tortilla → pot · Tomato → pot · Corn → pot · pot heat on · wait 4s · serve |
| 42 | **Warm Tzatziki** | Unusual | method | Pot: cucumber + yogurt. | Cucumber → board · chop Cucumber · Cucumber → pot · Yogurt → pot · Garlic → pot · pot heat on · wait 4s · serve |
| 43 | **Poached Egg** | Familiar | action | Pot: cracked egg, not stirred. | Egg → pot · crack egg · pot heat on · wait 4s · serve |
| 44 | **Egg Drop Soup** | Unusual | action | Pot: cracked egg stirred (≥1 turn). | Egg → pot · crack egg · pot heat on · wait 1s · stir pot 1.5 turns · wait 3s · serve |
| 45 | **Chocolate-Dipped Fruit** | Familiar | order | Pot: chocolate to Ready, stove off, then add strawberry/banana/apple. | Chocolate → pot · pot heat on · wait 3.5s · pot heat off · Strawberry → pot · serve |
| 46 | **Chocolate Pudding** | Familiar | action | Pot: flour + milk + chocolate, stirred to combine. | Flour → pot · Milk → pot · Chocolate → pot · Banana → pot · stir pot 2 turns · pot heat on · wait 4s · serve |
| 47 | **Stovetop Custard** | Familiar | action | Pot: flour + milk stirred to combine. | Flour → pot · Milk → pot · stir pot 2 turns · pot heat on · wait 4s · serve |
| 48 | **Lumpy Dumpling Soup** | Unusual | action | Pot: flour without stirring it in. | Flour → pot · Milk → pot · pot heat on · wait 4s · serve |
| 49 | **Silky Ganache** | Familiar | order | Pot: chocolate to Ready, THEN milk. | Chocolate → pot · pot heat on · wait 3.5s · Milk → pot · wait 0.5s · serve |
| 50 | **Hot Chocolate** | Familiar | order | Pot: chocolate + milk together. | Chocolate → pot · Milk → pot · pot heat on · wait 4s · serve |
| 51 | **Blueberry Jam** | Familiar | ingredients | Pot: blueberries (+ sugar or honey). | Blueberries → pot · Sugar → pot · pot heat on · wait 4s · serve |
| 52 | **Hot Citrus Punch** | Familiar | ingredients | Pot: orange + lemon. | Orange → board · chop Orange · Orange → pot · Lemon → pot · Honey → pot · pot heat on · wait 4s · serve |
| 53 | **Orange Marmalade** | Familiar | ingredients | Pot: orange + sugar or honey. | Orange → board · chop Orange · Orange → pot · Sugar → pot · pot heat on · wait 4s · serve |
| 54 | **Strawberry Jam** | Familiar | prep | Pot: sliced strawberry. | Strawberry → board · chop Strawberry · Strawberry → pot · pot heat on · wait 4s · serve |
| 55 | **Apple Compote** | Familiar | prep | Pot: chopped apple. | Apple → board · chop Apple · Apple → pot · Sugar → pot · pot heat on · wait 4s · serve |
| 56 | **Hot Honey Lemon** | Familiar | ingredients | Pot: lemon + honey or sugar. | Lemon → pot · Honey → pot · pot heat on · wait 4s · serve |
| 57 | **Ratatouille** | Familiar | ingredients | Pot: eggplant + tomato, zucchini or pepper. | Eggplant → board · chop Eggplant · Eggplant → pot · Zucchini → board · chop Zucchini · Zucchini → pot · Tomato → board · chop Tomato · Tomato → pot · pot heat on · wait 4s · serve |
| 58 | **Creamy Tomato Soup** | Familiar | ingredients | Pot: tomato + cream. | Tomato → board · chop Tomato · Tomato → pot · Cream → pot · pot heat on · wait 4s · serve |
| 59 | **Bean Chili** | Familiar | ingredients | Pot: beans + tomato, pepper or onion. | Beans → pot · Tomato → pot · Onion → pot · pot heat on · wait 4s · serve |
| 60 | **Bright Pea Soup** | Familiar | ingredients | Pot: peas. | Peas → pot · Milk → pot · pot heat on · wait 4s · serve |
| 61 | **Tofu Veggie Hotpot** | Familiar | ingredients | Pot: tofu + vegetable. | Tofu → pot · Spinach → pot · pot heat on · wait 4s · serve |
| 62 | **Chicken Soup** | Familiar | ingredients | Pot: chicken + vegetable. | Chicken → board · chop Chicken · Chicken → pot · Carrot → board · chop Carrot · Carrot → pot · pot heat on · wait 4s · serve |
| 63 | **Corn Chowder** | Familiar | ingredients | Pot: corn + milk or potato. | Corn → pot · Milk → pot · pot heat on · wait 4s · serve |
| 64 | **Cream of Mushroom Soup** | Familiar | ingredients | Pot: mushroom + milk. | Mushroom → pot · Milk → pot · pot heat on · wait 4s · serve |
| 65 | **Onion Soup** | Familiar | ingredients | Pot: onion + bread. | Onion → pot · Bread → pot · Cheese → pot · pot heat on · wait 4s · serve |
| 66 | **Tomato Soup** | Familiar | prep | Pot: chopped tomato. | Tomato → board · chop Tomato · Tomato → pot · Garlic → board · chop Garlic · Garlic → pot · pot heat on · wait 4s · serve |
| 67 | **Golden Carrot Soup** | Familiar | ingredients | Pot: carrot. | Carrot → board · chop Carrot · Carrot → pot · Onion → pot · pot heat on · wait 4s · serve |
| 68 | **Green Garden Soup** | Familiar | ingredients | Pot: spinach, broccoli or zucchini. | Broccoli → board · chop Broccoli · Broccoli → pot · Spinach → pot · pot heat on · wait 4s · serve |
| 69 | **Butter Cookies** | Familiar | prep | Oven: flour + butter or peanut butter + sugar/honey/chocolate, stirred, no milk or egg. | Flour → oven · Butter → oven · Sugar → oven · Chocolate → oven · stir oven 2 turns · oven heat on · wait 4s · oven door open · serve |
| 70 | **Blueberry Muffins** | Familiar | ingredients | Oven: flour + blueberries. | Flour → oven · Blueberries → oven · Milk → oven · Sugar → oven · stir oven 2 turns · oven heat on · wait 4s · oven door open · serve |
| 71 | **Chocolate Lava Cake** | Familiar | time | Oven: batter with egg + chocolate (no fruit), served before 5.5 s. | Flour → oven · Milk → oven · Egg → oven · crack egg · Chocolate → oven · stir oven 2 turns · oven heat on · wait 4s · oven door open · serve |
| 72 | **Brownie Brick** | Unusual | time | Oven: chocolate batter served Overcooked. | Flour → oven · Milk → oven · Chocolate → oven · stir oven 2 turns · oven heat on · wait 8s · oven door open · serve |
| 73 | **Chocolate Cake** | Familiar | prep | Oven: stirred batter + chocolate. | Flour → oven · Milk → oven · Chocolate → oven · Banana → oven · stir oven 2 turns · oven heat on · wait 4s · oven door open · serve |
| 74 | **Yogurt Cake** | Familiar | ingredients | Oven: flour + yogurt. | Flour → oven · Yogurt → oven · Lemon → oven · stir oven 2 turns · oven heat on · wait 4s · oven door open · serve |
| 75 | **Banana Bread** | Familiar | ingredients | Oven: flour + banana. | Flour → oven · Banana → oven · oven heat on · wait 4s · oven door open · serve |
| 76 | **Apple Pie** | Familiar | ingredients | Oven: flour + apple. | Apple → board · chop Apple · Apple → oven · Flour → oven · Butter → oven · oven heat on · wait 4s · oven door open · serve |
| 77 | **Sponge Cake** | Familiar | prep | Oven: stirred batter (flour + milk/egg/butter). | Flour → oven · Milk → oven · Honey → oven · stir oven 2 turns · oven heat on · wait 4s · oven door open · serve |
| 78 | **Patchwork Flour Bake** | Unusual | action | Oven: flour + something wet, not stirred. | Flour → oven · Milk → oven · oven heat on · wait 4s · oven door open · serve |
| 79 | **Fruit Crumble** | Familiar | ingredients | Oven: oats + strawberry, banana, apple, blueberries or orange. | Apple → board · chop Apple · Apple → oven · Oats → oven · Butter → oven · Sugar → oven · oven heat on · wait 4s · oven door open · serve |
| 80 | **Crunchy Granola** | Familiar | ingredients | Oven: oats + honey, sugar, butter or peanut butter. | Oats → oven · Honey → oven · oven heat on · wait 4s · oven door open · serve |
| 81 | **Quesadilla** | Familiar | ingredients | Oven: tortilla + cheese. | Tortilla → oven · Cheese → oven · Chicken → oven · oven heat on · wait 4s · oven door open · serve |
| 82 | **Sweet Tortilla Roll-ups** | Unusual | ingredients | Oven: tortilla + chocolate, fruit, peanut butter, sugar or honey. | Tortilla → oven · Banana → oven · Peanut butter → oven · oven heat on · wait 4s · oven door open · serve |
| 83 | **Pizza** | Familiar | method | Oven: pizza dough + tomato (toppings shown). | Pizza dough → oven · Tomato → oven · Cheese → oven · Mushroom → oven · oven heat on · wait 4s · oven door open · serve |
| 84 | **Dessert Pizza** | Unusual | ingredients | Oven: pizza dough + chocolate/fruit/sugar/honey. | Pizza dough → oven · Chocolate → oven · Banana → oven · oven heat on · wait 4s · oven door open · serve |
| 85 | **Fresh Bread Loaf** | Familiar | method | Oven: pizza dough alone. | Pizza dough → oven · oven heat on · wait 4s · oven door open · serve |
| 86 | **Flatbread** | Familiar | ingredients | Oven: pizza dough + anything but tomato or sweet things. | Pizza dough → oven · Garlic → oven · Cheese → oven · oven heat on · wait 4s · oven door open · serve |
| 87 | **Tuna Pasta Bake** | Familiar | ingredients | Oven: pasta + tuna. | Pasta → oven · Tuna → oven · Cheese → oven · oven heat on · wait 4s · oven door open · serve |
| 88 | **Crispy Noodle Nest** | Unusual | method | Oven: noodles. | Noodles → oven · oven heat on · wait 4s · oven door open · serve |
| 89 | **Baked Pasta Casserole** | Familiar | method | Oven: pasta + tomato, cheese or milk. | Pasta → oven · Tomato → oven · Cheese → oven · Mushroom → oven · oven heat on · wait 4s · oven door open · serve |
| 90 | **Crunchy Pasta Sticks** | Unusual | method | Oven: pasta without tomato, cheese or milk. | Pasta → oven · oven heat on · wait 4s · oven door open · serve |
| 91 | **Tuna Melt** | Familiar | ingredients | Oven: bread + tuna. | Bread → oven · Tuna → oven · Cheese → oven · oven heat on · wait 4s · oven door open · serve |
| 92 | **Peanut Butter Toast** | Familiar | ingredients | Oven: bread + peanut butter. | Bread → oven · Peanut butter → oven · Banana → oven · oven heat on · wait 4s · oven door open · serve |
| 93 | **Garlic Bread** | Familiar | ingredients | Oven: bread + garlic. | Bread → oven · Garlic → oven · Butter → oven · oven heat on · wait 4s · oven door open · serve |
| 94 | **Pizza Toast** | Familiar | method | Oven: bread + cheese + tomato. | Bread → oven · Cheese → oven · Tomato → oven · oven heat on · wait 4s · oven door open · serve |
| 95 | **Strawberry & Cheese Toast** | Unusual | ingredients | Oven: bread + cheese + strawberry. | Bread → oven · Cheese → oven · Strawberry → oven · oven heat on · wait 4s · oven door open · serve |
| 96 | **Cheese Toast** | Familiar | method | Oven: bread + cheese. | Bread → oven · Cheese → oven · oven heat on · wait 4s · oven door open · serve |
| 97 | **Chocolate Bread Bake** | Unusual | method | Oven: bread + chocolate. | Bread → oven · Chocolate → oven · oven heat on · wait 4s · oven door open · serve |
| 98 | **Crème Brûlée** | Familiar | ingredients | Oven: cracked egg + cream + sugar or honey. | Egg → oven · crack egg · Cream → oven · Sugar → oven · oven heat on · wait 4s · oven door open · serve |
| 99 | **Eggplant Parmesan** | Familiar | ingredients | Oven: eggplant + cheese. | Eggplant → board · chop Eggplant · Eggplant → oven · Cheese → oven · Tomato → oven · oven heat on · wait 4s · oven door open · serve |
| 100 | **Stuffed Peppers** | Familiar | prep | Oven: whole (uncut) bell pepper + something else. | Bell pepper → oven · Rice → oven · Cheese → oven · oven heat on · wait 4s · oven door open · serve |
| 101 | **Baked Egg & Veg Casserole** | Familiar | method | Oven: cracked egg + other ingredients. | Egg → oven · crack egg · Cheese → oven · Tomato → oven · Onion → oven · oven heat on · wait 4s · oven door open · serve |
| 102 | **Baked Eggs** | Familiar | method | Oven: cracked egg alone. | Egg → oven · crack egg · oven heat on · wait 4s · oven door open · serve |
| 103 | **Roasted Eggplant** | Familiar | method | Oven: eggplant. | Eggplant → board · chop Eggplant · Eggplant → oven · Garlic → oven · oven heat on · wait 4s · oven door open · serve |
| 104 | **Baked Beans** | Familiar | method | Oven: beans (+ tomato, honey or sugar). | Beans → oven · Honey → oven · oven heat on · wait 4s · oven door open · serve |
| 105 | **Roast Chicken** | Familiar | method | Oven: chicken. | Chicken → oven · Lemon → oven · Garlic → oven · oven heat on · wait 4s · oven door open · serve |
| 106 | **Crispy Baked Tofu** | Familiar | method | Oven: tofu. | Broccoli → board · chop Broccoli · Broccoli → oven · Tofu → oven · oven heat on · wait 4s · oven door open · serve |
| 107 | **Baked Potato** | Familiar | prep | Oven: whole potato. | Potato → oven · Butter → oven · oven heat on · wait 4s · oven door open · serve |
| 108 | **Baked Apple** | Familiar | prep | Oven: whole apple. | Apple → oven · Honey → oven · oven heat on · wait 4s · oven door open · serve |
| 109 | **Honey-Glazed Carrots** | Familiar | ingredients | Oven: carrot + honey/sugar/butter. | Carrot → board · chop Carrot · Carrot → oven · Honey → oven · oven heat on · wait 4s · oven door open · serve |
| 110 | **Roasted Corn** | Familiar | method | Oven: corn. | Corn → oven · Butter → oven · oven heat on · wait 4s · oven door open · serve |
| 111 | **Roasted Vegetable Tray** | Familiar | method | Oven: 2+ vegetables. | Zucchini → board · chop Zucchini · Zucchini → oven · Bell pepper → board · chop Bell pepper · Bell pepper → oven · Onion → board · chop Onion · Onion → oven · oven heat on · wait 4s · oven door open · serve |

## Same ingredients, different result (order / prep / timing pairs)

| A | B | What differs |
|---|---|---|
| Tomato & Egg Stew (variant) | Baked Egg & Veg Casserole (variant) | Egg + Cheese + Tomato + Onion: pot vs oven |
| Tomato Mushroom Pasta (variant) | Baked Pasta Casserole (variant) | Pasta + Tomato + Cheese + Mushroom: pot vs oven |
| Chocolate Pudding (variant) | Chocolate Cake (variant) | Flour + Milk + Chocolate + Banana: pot vs oven |
| Shakshuka | Tomato & Egg Stew (variant) | egg after the tomato sauce cooked vs at the start |
| Soft-Boiled Egg | Hard-Boiled Egg | same egg, served earlier vs later |
| Chocolate Lava Cake | Brownie Brick | chocolate batter served early vs overcooked |
| Pasta Pomodoro | Tangled Cheese-Rope Pasta (variant) | cheese after the pasta cooked vs at the start |
| Silky Ganache | Hot Chocolate | chocolate melted before milk vs together |
| Stovetop Custard | Lumpy Dumpling Soup | flour stirred in vs not |
| Chocolate Cake | Patchwork Flour Bake (variant) | batter stirred in the tray vs not |
| Poached Egg | Egg Drop Soup | cracked egg left alone vs stirred |
| Mashed Potatoes | (improvisation) | cooked potato stirred hard vs not |
| Baked Potato | (improvisation) | whole vs chopped potato in the oven |
| Stuffed Peppers | (improvisation) | whole vs chopped pepper with rice & cheese |
| Onion Blossom | (improvisation) | whole vs chopped onion in the oven |

Anything no rule covers becomes a deterministic **Kitchen improvisation**: its name, description and plate are built from the actual ingredients, their cut/whole state, the method and the doneness (e.g. "Rustic Tofu & Sugar Stew").

37 outcomes depend on preparation, order, action or timing (not ingredients alone).
