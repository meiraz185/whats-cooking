/* V2 reproduction scripts for every authored outcome (used by automated tests & docs).
   Steps use ingredient ids. 'wait' advances cooking time in 0.1 s ticks. stir amounts are in full turns. */
(function (root) {
  const W = (s) => ['wait', s];
  const pot = (...ids) => ids.map((i) => ['pick', i, 'pot']);
  const oven = (...ids) => ids.map((i) => ['pick', i, 'oven']);
  const chop = (id, to) => [['pick', id, 'board'], ['chop', id, 3], ['move', id, to]];
  const cookPot = (s = 4) => [['heat', 'pot', true], W(s), ['serve']];
  const bake = (s = 4) => [['heat', 'oven', true], W(s), ['door', true], ['serve']];
  const SOL = {
    phoenix: [...oven('bread'), ...bake(12)],
    lukewarm: [...pot('potato'), ['heat', 'pot', true], W(1), ['heat', 'pot', false], ['serve']],
    tower: [['heat', 'oven', true], ['pick', 'bread', 'oven'], ['door', false], W(1.2), ['pick', 'cheese', 'oven'], ['door', false], W(1.2),
      ['pick', 'tomato', 'oven'], ['door', false], W(1.2), ['pick', 'mushroom', 'oven'], ['door', false], W(1.5), ['door', true], ['serve']],
    onion_blossom: [...oven('onion'), ...bake()],
    broccoli_forest: [...oven('broccoli'), ...bake()],
    cheese_monster: [...oven('cheese'), ...bake(8)],
    giant_pancake: [...oven('flour', 'milk', 'strawberry'), ['stir', 'oven', 2], ...bake()],
    souffle: [...oven('egg'), ['crack', 'egg'], ['stir', 'oven', 2], ...bake()],
    stew: [...pot('strawberry', 'onion', 'potato'), ...cookPot()],
    creature: [...pot('pasta', 'chocolate'), ...cookPot()],
    mole: [...chop('tomato', 'pot'), ['heat', 'pot', true], W(3.5), ['pick', 'chocolate', 'pot'], W(0.5), ['serve']],
    popcorn: [...pot('corn'), ...cookPot(8)],
    dough_blob: [...pot('dough'), ...cookPot()],
    mash: [...pot('potato'), ['heat', 'pot', true], W(4), ['stir', 'pot', 2], ['serve']],
    shakshuka: [...chop('tomato', 'pot'), ['heat', 'pot', true], W(3.5), ['pick', 'egg', 'pot'], ['crack', 'egg'], W(1), ['serve']],
    tomato_egg: [...pot('tomato', 'egg'), ['crack', 'egg'], ...cookPot()],
    egg_soft: [...pot('egg'), ...cookPot(4)],
    egg_hard: [...pot('egg'), ...cookPot(6.5)],
    mac: [...pot('pasta', 'milk', 'cheese'), ...cookPot()],
    pasta_tomato_mush: [...pot('pasta', 'tomato', 'cheese', 'mushroom'), ...cookPot()],
    pomodoro: [...pot('pasta', 'tomato'), ['heat', 'pot', true], W(4), ['pick', 'cheese', 'pot'], ['serve']],
    cheese_rope: [...pot('pasta', 'cheese'), ...cookPot()],
    chicken_noodle: [...pot('pasta', 'chicken'), ...cookPot()],
    sweet_pasta: [...pot('pasta', 'banana'), ...cookPot()],
    garlic_pasta: [...pot('pasta', 'garlic', 'butter'), ...cookPot()],
    primavera: [...pot('pasta', 'carrot', 'zucchini'), ...cookPot()],
    rice_pudding: [...pot('rice', 'milk', 'honey'), ...cookPot()],
    risotto: [...pot('rice', 'mushroom', 'cheese'), ...cookPot()],
    chicken_rice: [...pot('rice', 'chicken'), ...cookPot()],
    veg_rice: [...pot('rice', 'corn', 'pepper'), ...cookPot()],
    poached: [...pot('egg'), ['crack', 'egg'], ...cookPot()],
    egg_drop: [...pot('egg'), ['crack', 'egg'], ['heat', 'pot', true], W(1), ['stir', 'pot', 1.5], W(3), ['serve']],
    choc_fruit: [...pot('chocolate'), ['heat', 'pot', true], W(3.5), ['heat', 'pot', false], ['pick', 'strawberry', 'pot'], ['serve']],
    choc_pudding: [...pot('flour', 'milk', 'chocolate', 'banana'), ['stir', 'pot', 2], ...cookPot()],
    pudding: [...pot('flour', 'milk'), ['stir', 'pot', 2], ...cookPot()],
    lumpy_soup: [...pot('flour', 'milk'), ...cookPot()],
    ganache: [...pot('chocolate'), ['heat', 'pot', true], W(3.5), ['pick', 'milk', 'pot'], W(0.5), ['serve']],
    hot_chocolate: [...pot('chocolate', 'milk'), ...cookPot()],
    jam: [...chop('strawberry', 'pot'), ...cookPot()],
    compote: [...chop('apple', 'pot'), ['pick', 'sugar', 'pot'], ...cookPot()],
    honey_lemon: [...pot('lemon', 'honey'), ...cookPot()],
    tofu_stew: [...pot('tofu', 'spinach'), ...cookPot()],
    chicken_soup: [...chop('chicken', 'pot'), ...chop('carrot', 'pot'), ...cookPot()],
    corn_chowder: [...pot('corn', 'milk'), ...cookPot()],
    mushroom_soup: [...pot('mushroom', 'milk'), ...cookPot()],
    onion_soup: [...pot('onion', 'bread', 'cheese'), ...cookPot()],
    tomato_soup: [...chop('tomato', 'pot'), ...chop('garlic', 'pot'), ...cookPot()],
    carrot_soup: [...chop('carrot', 'pot'), ...pot('onion'), ...cookPot()],
    green_soup: [...chop('broccoli', 'pot'), ...pot('spinach'), ...cookPot()],
    lava: [...oven('flour', 'milk', 'egg'), ['crack', 'egg'], ['pick', 'chocolate', 'oven'], ['stir', 'oven', 2], ...bake(4)],
    brownie_brick: [...oven('flour', 'milk', 'chocolate'), ['stir', 'oven', 2], ...bake(8)],
    choc_cake: [...oven('flour', 'milk', 'chocolate', 'banana'), ['stir', 'oven', 2], ...bake()],
    cookies: [...oven('flour', 'butter', 'sugar', 'chocolate'), ['stir', 'oven', 2], ...bake()],
    banana_bread: [...oven('flour', 'banana'), ...bake()],
    apple_pie: [...chop('apple', 'oven'), ...oven('flour', 'butter'), ...bake()],
    sponge_cake: [...oven('flour', 'milk', 'honey'), ['stir', 'oven', 2], ...bake()],
    patchwork: [...oven('flour', 'milk'), ...bake()],
    pizza: [...oven('dough', 'tomato', 'cheese', 'mushroom'), ...bake()],
    dessert_pizza: [...oven('dough', 'chocolate', 'banana'), ...bake()],
    bread_loaf: [...oven('dough'), ...bake()],
    flatbread: [...oven('dough', 'garlic', 'cheese'), ...bake()],
    pasta_bake: [...oven('pasta', 'tomato', 'cheese', 'mushroom'), ...bake()],
    crunchy_pasta: [...oven('pasta'), ...bake()],
    garlic_bread: [...oven('bread', 'garlic', 'butter'), ...bake()],
    pizza_toast: [...oven('bread', 'cheese', 'tomato'), ...bake()],
    strawberry_cheese_toast: [...oven('bread', 'cheese', 'strawberry'), ...bake()],
    cheese_toast: [...oven('bread', 'cheese'), ...bake()],
    choc_bread: [...oven('bread', 'chocolate'), ...bake()],
    stuffed_pepper: [...oven('pepper', 'rice', 'cheese'), ...bake()],
    egg_casserole: [...oven('egg'), ['crack', 'egg'], ...oven('cheese', 'tomato', 'onion'), ...bake()],
    baked_eggs: [...oven('egg'), ['crack', 'egg'], ...bake()],
    baked_potato: [...oven('potato', 'butter'), ...bake()],
    baked_apple: [...oven('apple', 'honey'), ...bake()],
    roast_chicken: [...oven('chicken', 'lemon', 'garlic'), ...bake()],
    tofu_bake: [...chop('broccoli', 'oven'), ...oven('tofu'), ...bake()],
    honey_carrots: [...chop('carrot', 'oven'), ...oven('honey'), ...bake()],
    roast_corn: [...oven('corn', 'butter'), ...bake()],
    roast_veg: [...chop('zucchini', 'oven'), ...chop('pepper', 'oven'), ...chop('onion', 'oven'), ...bake()],
    /* V2.1 */
    galaxy: [...pot('blueberries', 'yogurt'), ['heat', 'pot', true], W(1), ['stir', 'pot', 4.5], W(2.5), ['serve']],
    tortilla_ufo: [...oven('tortilla'), ...bake()],
    ratatouille: [...chop('eggplant', 'pot'), ...chop('zucchini', 'pot'), ...chop('tomato', 'pot'), ...cookPot()],
    creamy_tomato_soup: [...chop('tomato', 'pot'), ...pot('cream'), ...cookPot()],
    alfredo: [...pot('pasta', 'cream', 'cheese'), ...cookPot()],
    tuna_pasta: [...pot('pasta', 'tuna', 'tomato'), ...cookPot()],
    tuna_rice: [...pot('rice', 'tuna'), ...cookPot()],
    curry: [...chop('chicken', 'pot'), ...pot('yogurt', 'rice'), ...cookPot()],
    peanut_noodles: [...pot('noodles', 'peanut'), ...cookPot()],
    ramen: [...pot('noodles', 'egg'), ['crack', 'egg'], ...pot('spinach'), ...cookPot()],
    sweet_noodles: [...pot('noodles', 'chocolate'), ...cookPot()],
    porridge: [...pot('oats', 'milk', 'blueberries'), ...cookPot()],
    blueberry_jam: [...pot('blueberries', 'sugar'), ...cookPot()],
    citrus_punch: [...chop('orange', 'pot'), ...pot('lemon', 'honey'), ...cookPot()],
    marmalade: [...chop('orange', 'pot'), ...pot('sugar'), ...cookPot()],
    tortilla_soup: [...pot('tortilla', 'tomato', 'corn'), ...cookPot()],
    tzatziki: [...chop('cucumber', 'pot'), ...pot('yogurt', 'garlic'), ...cookPot()],
    creme_brulee: [...oven('egg'), ['crack', 'egg'], ...oven('cream', 'sugar'), ...bake()],
    eggplant_parm: [...chop('eggplant', 'oven'), ...oven('cheese', 'tomato'), ...bake()],
    roast_eggplant: [...chop('eggplant', 'oven'), ...oven('garlic'), ...bake()],
    quesadilla: [...oven('tortilla', 'cheese', 'chicken'), ...bake()],
    tortilla_rollups: [...oven('tortilla', 'banana', 'peanut'), ...bake()],
    tuna_melt: [...oven('bread', 'tuna', 'cheese'), ...bake()],
    tuna_bake: [...oven('pasta', 'tuna', 'cheese'), ...bake()],
    pb_toast: [...oven('bread', 'peanut', 'banana'), ...bake()],
    crumble: [...chop('apple', 'oven'), ...oven('oats', 'butter', 'sugar'), ...bake()],
    granola: [...oven('oats', 'honey'), ...bake()],
    muffins: [...oven('flour', 'blueberries', 'milk', 'sugar'), ['stir', 'oven', 2], ...bake()],
    yogurt_cake: [...oven('flour', 'yogurt', 'lemon'), ['stir', 'oven', 2], ...bake()],
    noodle_nest: [...oven('noodles'), ...bake()],
    pea_soup: [...pot('peas', 'milk'), ...cookPot()],
    chili: [...pot('beans', 'tomato', 'onion'), ...cookPot()],
    baked_beans: [...oven('beans', 'honey'), ...bake()]
  };

  /* Same ingredients, different method / order / prep / timing */
  const EXTRA = {
    ex1_pot: { expect: 'tomato_egg', steps: [...pot('egg'), ['crack', 'egg'], ...pot('cheese', 'tomato', 'onion'), ...cookPot()] },
    ex1_oven: { expect: 'egg_casserole', steps: [...oven('egg'), ['crack', 'egg'], ...oven('cheese', 'tomato', 'onion'), ...bake()] },
    ex2_pot: { expect: 'pasta_tomato_mush', steps: [...pot('pasta', 'tomato', 'cheese', 'mushroom'), ...cookPot()] },
    ex2_oven: { expect: 'pasta_bake', steps: [...oven('pasta', 'tomato', 'cheese', 'mushroom'), ...bake()] },
    ex3_pot: { expect: 'choc_pudding', steps: [...pot('flour', 'milk', 'chocolate', 'banana'), ['stir', 'pot', 2], ...cookPot()] },
    ex3_oven: { expect: 'choc_cake', steps: [...oven('flour', 'milk', 'chocolate', 'banana'), ['stir', 'oven', 2], ...bake()] },
    order_shak_vs_stew: { expect: 'tomato_egg', steps: [...chop('tomato', 'pot'), ...pot('egg'), ['crack', 'egg'], ...cookPot()] },
    cheese_late_vs_early: { expect: 'cheese_rope', steps: [...pot('pasta', 'tomato', 'cheese'), ...cookPot()] },
    unstirred_cake: { expect: 'patchwork', steps: [...oven('flour', 'milk', 'chocolate'), ...bake()] },
    unstirred_pudding: { expect: 'lumpy_soup', steps: [...pot('flour', 'milk', 'chocolate'), ...cookPot()] },
    potato_not_mashed: { expect: 'imp:', steps: [...pot('potato'), ...cookPot()] },
    potato_chopped_oven: { expect: 'imp:', steps: [...chop('potato', 'oven'), ...bake()] },
    pepper_chopped: { expect: 'imp:', steps: [...chop('pepper', 'oven'), ...oven('rice', 'cheese'), ...bake()] },
    onion_chopped_oven: { expect: 'imp:', steps: [...chop('onion', 'oven'), ...bake()] },
    egg_whole_oven: { expect: 'imp:', steps: [...oven('egg'), ...bake()] },
    imp_corn_lemon: { expect: 'imp:', steps: [...pot('corn', 'lemon'), ...cookPot()] },
    imp_chicken_apple_oven: { expect: 'imp:', steps: [...oven('chicken', 'apple', 'honey', 'sugar'), ['door', false], ...bake()] }
  };
  EXTRA.imp_chicken_apple_oven.expect = 'roast_chicken';
  const CONTRASTS = [
    ['ex1_pot', 'ex1_oven', 'Egg + Cheese + Tomato + Onion: pot vs oven'],
    ['ex2_pot', 'ex2_oven', 'Pasta + Tomato + Cheese + Mushroom: pot vs oven'],
    ['ex3_pot', 'ex3_oven', 'Flour + Milk + Chocolate + Banana: pot vs oven'],
    ['shakshuka', 'order_shak_vs_stew', 'egg after the tomato sauce cooked vs at the start'],
    ['egg_soft', 'egg_hard', 'same egg, served earlier vs later'],
    ['lava', 'brownie_brick', 'chocolate batter served early vs overcooked'],
    ['pomodoro', 'cheese_late_vs_early', 'cheese after the pasta cooked vs at the start'],
    ['ganache', 'hot_chocolate', 'chocolate melted before milk vs together'],
    ['pudding', 'lumpy_soup', 'flour stirred in vs not'],
    ['choc_cake', 'unstirred_cake', 'batter stirred in the tray vs not'],
    ['poached', 'egg_drop', 'cracked egg left alone vs stirred'],
    ['mash', 'potato_not_mashed', 'cooked potato stirred hard vs not'],
    ['baked_potato', 'potato_chopped_oven', 'whole vs chopped potato in the oven'],
    ['stuffed_pepper', 'pepper_chopped', 'whole vs chopped pepper with rice & cheese'],
    ['onion_blossom', 'onion_chopped_oven', 'whole vs chopped onion in the oven']
  ];

  function run(WC, steps) {
    const S = WC.State;
    S.reset();
    const errors = [];
    const uidOf = (id) => { const it = S.byId(id); return it && it.uid; };
    let result = null;
    for (const s of steps) {
      const [cmd, a, b] = s;
      let r;
      if (cmd === 'wait') { for (let t = 0; t < a - 1e-9; t += 0.1) S.tick(0.1); continue; }
      if (cmd === 'pick') r = S.run('pick', a, b);
      else if (cmd === 'move') r = S.run('move', uidOf(a), b);
      else if (cmd === 'crack') r = S.run('crack', uidOf(a));
      else if (cmd === 'chop') { for (let k = 0; k < b; k++) r = S.run('chop', uidOf(a)); }
      else if (cmd === 'stir') { S.checkpoint(); for (let k = 0; k < b / 0.25; k++) r = S.stir(a, 0.25); }
      else if (cmd === 'heat') r = S.run('setHeat', a, b);
      else if (cmd === 'door') r = S.run('setDoor', a);
      else if (cmd === 'serve') { r = S.run('serve'); if (r.ok) result = r.outcome.id; }
      if (r && !r.ok) errors.push(cmd + ' ' + (a || '') + ': ' + r.msg);
      if (r && r.warn) errors.push(cmd + ' ' + a + ': ' + r.warn);
    }
    return { outcome: result, errors, name: S.st.served && WC.Engine.evaluate(S.st.served.facts).name };
  }

  const api = { SOL, CONTRASTS, EXTRA, run };
  if (typeof module !== 'undefined') module.exports = api;
  root.WC_TEST = api;
})(typeof window !== 'undefined' ? window : globalThis);
