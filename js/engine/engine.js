/* V2 recipe & discovery engine: facts from the real cooking history → prioritized rules.
   Anything no rule covers becomes a deterministic "improvisation" named and drawn from
   its actual ingredients, preparation, method and doneness. */
(function (WC) {
  'use strict';
  const E = {};

  E.facts = (st, items, where) => {
    const method = WC.METHODS[where].id;
    const ing = {};
    let maxT = 0;
    items.forEach((it) => {
      ing[it.id] = {
        state: it.state, cookT: +it.cookT.toFixed(2), phase: WC.phaseOf(it.cookT),
        premixed: !!it.premixed, mixedWith: it.mixedWith.slice(), stir: +it.stir.toFixed(2),
        addedVT: it.addedVT, heatAdd: !!it.heatAdd, hotAdd: !!it.hotAdd, afterHeat: !!it.afterHeat,
        cookAtAdd: Object.assign({}, it.cookAtAdd)
      };
      maxT = Math.max(maxT, it.cookT);
    });
    const ids = WC.ING_ORDER.filter((id) => ing[id]);
    return { method, where, ing, ids, n: ids.length, maxT: +maxT.toFixed(2), P: WC.phaseOf(maxT) };
  };

  E.wrap = (f) => {
    const g = Object.create(f);
    g.has = (...ids) => ids.every((i) => f.ing[i]);
    g.any = (...ids) => ids.some((i) => f.ing[i]);
    g.only = (...ids) => f.n === ids.length && ids.every((i) => f.ing[i]);
    g.none = (...ids) => !ids.some((i) => f.ing[i]);
    g.count = (list) => list.filter((i) => f.ing[i]).length;
    g.anyOf = (list) => list.some((i) => f.ing[i]);
    g.st = (id) => (f.ing[id] ? f.ing[id].state : null);
    g.I = (id) => f.ing[id] || {};
    g.before = (a, b, th) => !!(f.ing[a] && f.ing[b] && (f.ing[b].cookAtAdd[a] || 0) >= (th || WC.PHASE_T.ready));
    g.together = (a, b) => !!(f.ing[a] && f.ing[b] && f.ing[a].mixedWith.includes(b));
    g.batter = !!(f.ing.flour && f.ing.flour.premixed &&
      ['milk', 'egg', 'butter', 'honey', 'cream', 'yogurt'].some((x) => f.ing.flour.mixedWith.includes(x)));
    g.cooked = f.P === 'ready' || f.P === 'over';
    g.boil = f.method === 'boil'; g.bake = f.method === 'bake';
    g.sweet = WC.G.sweet.some((i) => f.ing[i]);
    g.savory = WC.G.savory.some((i) => f.ing[i]);
    return g;
  };

  E.evaluate = (facts) => {
    const f = E.wrap(facts);
    for (const r of WC.RULES) {
      let hit = false;
      try { hit = r.when(f); } catch (e) { hit = false; }
      if (hit) {
        const o = Object.assign({ id: r.id }, WC.OUTCOMES[r.id]);
        if (o.title) o.name = o.title(f);
        return o;
      }
    }
    return E.improvise(facts);
  };

  E.why = (outcome, facts) => {
    const w = outcome.why;
    return typeof w === 'function' ? w(E.wrap(facts)) : (w || '');
  };

  /* ---------- deterministic improvisation ---------- */
  const WEIGHT = { chicken: 1, tuna: 1.5, tofu: 2, egg: 3, pasta: 4, rice: 5, noodles: 5.5, dough: 6, tortilla: 6.5, bread: 7, oats: 7.5, potato: 8, eggplant: 8.5, cheese: 9 };
  const w = (id) => WEIGHT[id] || (WC.G.veg.includes(id) ? 20 : WC.G.fruit.includes(id) ? 30 : 40) + WC.ING_ORDER.indexOf(id) / 100;
  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const short = { pepper: 'Pepper', dough: 'Dough', peanut: 'Peanut' };
  const nm = (id) => short[id] || WC.INGREDIENTS[id].name;

  E.improvise = (facts) => {
    const f = E.wrap(facts);
    const main = facts.ids.slice().sort((a, b) => w(a) - w(b));
    const names = main.slice(0, 2).map(nm);
    const head = names.length > 1 ? names[0] + ' & ' + names[1] : names[0];
    const allSweet = facts.ids.every((i) => WC.G.sweet.includes(i) || ['milk', 'flour', 'butter', 'lemon', 'cream', 'yogurt', 'oats'].includes(i));
    let noun;
    if (f.boil) {
      noun = allSweet ? (f.has('milk') ? 'Pudding Pot' : 'Compote')
        : f.has('rice') ? 'Rice Pot' : f.has('milk') ? 'Chowder' : facts.n >= 3 ? 'Stew' : 'Broth';
    } else {
      noun = allSweet ? 'Bake' : f.has('cheese') ? 'Gratin' : f.anyOf(['chicken', 'tofu', 'egg']) ? 'Roast'
        : f.anyOf(['bread', 'dough']) ? 'Toastie' : f.anyOf(WC.G.veg) ? 'Traybake' : 'Bake';
    }
    const whole = facts.ids.filter((i) => facts.ing[i].state === 'whole' && WC.canChop(i, 'whole'));
    const prefix = facts.P === 'over' ? 'Well-Done ' : whole.length && facts.n > 1 ? 'Rustic ' : '';
    const name = prefix + head + ' ' + noun;
    const list = U.list(facts.ids.map((i) => WC.ingLabel(i, facts.ing[i].state)));
    const T = f.boil ? [
      `${list}, simmered side by side. Nobody has named this one — so now it's yours.`,
      `A pot of ${list}. Unexpected, honest, steaming.`,
      `${list} went swimming together and came out as one idea.`
    ] : [
      `${list}, roasted until the edges caught colour. An original.`,
      `The oven turned ${list} into something nobody has tried.`,
      `${list} on one tray. Golden, strange, yours.`
    ];
    const desc = T[hash(facts.ids.join() + facts.method) % T.length] + (facts.P === 'over' ? ' A little past its best.' : '');
    const why = `No classic recipe uses exactly ${list} ${f.boil ? 'in a pot' : 'in the oven'}, so the kitchen improvised` +
      (whole.length ? ` (the ${whole.map((i) => WC.INGREDIENTS[i].name.toLowerCase()).join(' and ')} went in whole).` : '.');
    return {
      id: 'imp:' + facts.method + ':' + facts.ids.join('+'), improv: true, name, type: 'improv',
      desc, why, anim: 'pop', art: f.boil ? 'imp_pot' : 'imp_oven'
    };
  };
  const U = WC.U;

  WC.Engine = E;
})(window.WC);
