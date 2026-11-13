/* V2 deterministic kitchen state machine.
   Locations: counter (the selection), board, pot, oven. Every command validates first. */
(function (WC) {
  'use strict';
  const U = WC.U;
  const MAX = 4;
  const VESSELS = WC.VESSELS;
  const PLACE = { counter: 'the counter', board: 'the cutting board', pot: 'the pot', oven: 'the oven tray' };

  function fresh() {
    return {
      items: [],
      heat: { pot: false, oven: false },
      vt: { pot: 0, oven: 0 },          // seconds each station has actually been cooking
      door: false,                      // oven door open?
      mix: { pot: 0, oven: 0 }, mixed: { pot: false, oven: false },
      log: [],
      served: null
    };
  }

  const S = { st: fresh(), undoStack: [] };
  const fail = (msg, code) => ({ ok: false, msg, code: code || 'no' });
  const ok = (events, extra) => Object.assign({ ok: true, events: events || [] }, extra || {});
  const name = (it) => WC.INGREDIENTS[it.id].name.toLowerCase();

  S.find = (uid) => S.st.items.find((i) => i.uid === uid);
  S.byId = (id) => S.st.items.find((i) => i.id === id);
  S.at = (loc) => S.st.items.filter((i) => i.loc === loc);
  S.inside = (loc) => S.st.items.filter((i) => i.loc === loc && !i.rim);
  S.active = () => VESSELS.find((v) => S.st.heat[v] || S.st.items.some((i) => i.loc === v)) || null;
  S.count = () => S.st.items.length;
  S.cooking = (v) => !!S.st.heat[v] && (v !== 'oven' || !S.st.door);

  function log(text) {
    const L = S.st.log;
    const last = L[L.length - 1];
    if (last && last.t === text) { last.n++; return; }
    L.push({ t: text, n: 1 });
  }
  S.logText = () => S.st.log.map((l) => l.t + (l.n > 1 ? ' ×' + l.n : ''));

  /* ---------- undo ---------- */
  S.checkpoint = () => { S.undoStack.push(U.clone(S.st)); if (S.undoStack.length > 40) S.undoStack.shift(); };
  S.canUndo = () => S.undoStack.length > 0 && !S.st.served;
  S.undo = () => {
    if (!S.canUndo()) return fail('Nothing to undo');
    S.st = S.undoStack.pop();
    return ok([{ type: 'undo' }]);
  };
  S.reset = () => { S.st = fresh(); S.undoStack = []; return ok([{ type: 'reset' }]); };
  S.run = (cmd, ...args) => {
    if (S.st.served && cmd !== 'reset') return fail('Plate is served. Cook again for a new experiment.', 'served');
    const snap = U.clone(S.st);
    const r = S[cmd](...args);
    if (r && r.ok && r.events && r.events.length && cmd !== 'undo' && cmd !== 'reset') {
      S.undoStack.push(snap);
      if (S.undoStack.length > 40) S.undoStack.shift();
    }
    return r;
  };

  /* ---------- selection (the cabinet) ---------- */
  S.pick = (id, dest) => {
    if (!WC.INGREDIENTS[id]) return fail('Unknown ingredient');
    if (S.byId(id)) return fail('That one is already out.', 'dup');
    if (S.count() >= MAX) return fail('Four ingredients is the limit. Tap one to put it back first.', 'limit');
    const it = {
      uid: U.uid('i'), id, state: WC.INGREDIENTS[id].start, loc: 'counter', prog: 0, mashP: 0,
      cookT: 0, stir: 0, premixed: false, mixedWith: [], rim: false,
      addedVT: null, cookAtAdd: {}, heatAdd: false, hotAdd: false, afterHeat: false
    };
    S.st.items.push(it);
    log('Took out ' + name(it));
    const ev = [{ type: 'pick', uid: it.uid, id }];
    if (dest && dest !== 'counter') {
      const r = S.move(it.uid, dest);
      if (!r.ok) return Object.assign(ok(ev, { uid: it.uid }), { warn: r.msg });
      return ok(ev.concat(r.events), { uid: it.uid });
    }
    return ok(ev, { uid: it.uid });
  };
  /* tapping a selected ingredient in the cabinet deselects it (if it is not cooking yet) */
  S.togglePick = (id) => {
    const it = S.byId(id);
    if (!it) return S.pick(id);
    if (!S.movable(it)) return fail('The ' + name(it) + ' is already cooking. Use undo to take it back.', 'stuck');
    return S.move(it.uid, 'pantry');
  };

  S.movable = (it) => ['counter', 'board'].includes(it.loc) || it.rim;

  function enter(it, v) {
    const others = S.inside(v).filter((o) => o !== it);
    it.loc = v;
    it.rim = false;
    it.addedVT = +S.st.vt[v].toFixed(2);
    it.heatAdd = !!S.st.heat[v];                       // the heat was on when it went in
    it.hotAdd = !!S.st.heat[v] && S.st.vt[v] >= 2;     // ...and it was already hot
    it.cookAtAdd = {};
    others.forEach((o) => { it.cookAtAdd[o.id] = +o.cookT.toFixed(2); });
    it.afterHeat = !S.st.heat[v] && others.some((o) => o.cookT > 0);
    S.st.mix[v] = 0; S.st.mixed[v] = false;    // something new: needs stirring again to combine
  }

  S.canGo = (it, dest) => {
    if (!it || !S.movable(it)) return false;
    if (dest === 'pantry' || dest === 'counter') return true;
    if (dest === 'board') return WC.canChop(it.id, it.state) && !S.at('board').some((o) => o !== it);
    if (VESSELS.includes(dest)) { const a = S.active(); return !a || a === dest; }
    return false;
  };

  S.move = (uid, dest) => {
    const it = S.find(uid);
    if (!it) return fail('Nothing there');
    if (it.loc === dest) return ok([]);
    if (!S.movable(it)) return fail('Once it is in, it stays in. Undo to take it back.', 'stuck');
    if (dest === 'pantry') {
      S.st.items = S.st.items.filter((i) => i !== it);
      log('Put back ' + name(it));
      return ok([{ type: 'return', id: it.id }]);
    }
    if (dest === 'board') {
      if (!WC.canChop(it.id, it.state)) {
        return fail(WC.INGREDIENTS[it.id].name + (WC.PREP.chop.map[it.id] ? ' is already cut' : ' doesn\'t need cutting') + ' — put it straight into the pot or oven.', 'nocut');
      }
      if (S.at('board').some((o) => o !== it)) return fail('The board is busy — finish that one first.', 'busy');
    }
    if (VESSELS.includes(dest)) {
      const a = S.active();
      if (a && a !== dest) return fail('You chose the ' + a + ' for this dish. Clean up to try the ' + dest + '.', 'vessel');
    }
    const from = it.loc;
    if (dest === 'counter' || dest === 'board') {
      it.loc = dest; it.rim = false;
      if (dest === 'board') log('Put ' + name(it) + ' on the cutting board');
      return ok([{ type: 'move', uid, from, to: dest }]);
    }
    if (VESSELS.includes(dest)) {
      const ev = [{ type: 'move', uid, from, to: dest }];
      if (dest === 'oven' && !S.st.door) { S.st.door = true; ev.push({ type: 'door-open' }); log('Opened the oven'); }
      if (it.id === 'egg' && it.state === 'whole') {
        it.loc = dest; it.rim = true;
        log('Held the egg over ' + PLACE[dest]);
        return ok(ev);
      }
      enter(it, dest);
      const hot = S.cooking(dest) ? (S.st.vt[dest] >= 2 ? ' (already hot)' : ' (warming up)') : '';
      log('Added ' + WC.ingLabel(it.id, it.state) + ' to ' + PLACE[dest] + hot);
      ev.push({ type: 'drop-in', where: dest, id: it.id, uid: it.uid });
      return ok(ev);
    }
    return fail('Can\'t go there');
  };

  /* ---------- preparation: the cutting board ---------- */
  S.crack = (uid) => {
    const it = S.find(uid);
    if (!it || it.id !== 'egg' || it.state !== 'whole' || !it.rim) return fail('Nothing to crack');
    it.state = 'cracked';
    enter(it, it.loc);
    log('Cracked the egg into ' + PLACE[it.loc] + (S.cooking(it.loc) && S.st.vt[it.loc] >= 2 ? ' (hot!)' : ''));
    return ok([{ type: 'crack', uid, where: it.loc }, { type: 'drop-in', where: it.loc, id: 'egg', uid, quiet: true }]);
  };

  S.chop = (uid) => {
    const it = S.find(uid);
    if (!it || it.loc !== 'board') return fail('Put something on the board first');
    const m = WC.PREP.chop.map[it.id];
    if (!m || !m[it.state]) return fail('Already cut — drag it into the pot or oven.', 'cant');
    it.prog++;
    const ev = [{ type: 'chop', uid, prog: it.prog }];
    if (it.prog >= WC.PREP.chop.steps) {
      it.state = m[it.state];
      it.prog = 0;
      log('Chopped the ' + name(it));
      ev.push({ type: 'prepped', uid, state: it.state });
    }
    return ok(ev);
  };

  /* ---------- stirring (pot anytime, oven tray only with the door open) ---------- */
  S.stir = (where, amt) => {
    amt = amt || 0.25;
    if (where === 'oven' && !S.st.door) return fail('Open the oven door to reach the tray.', 'closed');
    const inside = S.inside(where);
    if (!inside.length) return fail('Nothing to stir yet', 'empty');
    const ev = [{ type: 'stir', where }];
    const before = Math.floor(inside[0].stir);
    inside.forEach((i) => { i.stir += amt; });
    if (Math.floor(inside[0].stir) > before) log('Stirred the ' + (where === 'oven' ? 'tray' : 'pot') + (S.cooking(where) ? ' while cooking' : ''));
    // combining: two full turns blends what is there (and whisks a cracked egg)
    S.st.mix[where] += amt;
    if (!S.st.mixed[where] && S.st.mix[where] >= 2 && (inside.length >= 2 || inside.some((i) => i.id === 'egg' && i.state === 'cracked'))) {
      S.st.mixed[where] = true;
      inside.forEach((i) => {
        i.premixed = true;
        i.mixedWith = Array.from(new Set(i.mixedWith.concat(inside.filter((o) => o !== i).map((o) => o.id))));
        if (i.id === 'egg' && i.state === 'cracked') i.state = 'whisked';
      });
      log(inside.length === 1 ? 'Whisked the egg' : 'Mixed ' + U.list(inside.map(name)) + ' together');
      ev.push({ type: 'mixed', where });
    }
    // stirring soft cooked potato in the pot mashes it
    if (where === 'pot') inside.forEach((i) => {
      if (i.id === 'potato' && i.state !== 'mashed' && i.cookT >= WC.PHASE_T.ready) {
        i.mashP += amt;
        if (i.mashP >= 1.5) { i.state = 'mashed'; log('Stirred the soft potato into mash'); ev.push({ type: 'prepped', uid: i.uid, state: 'mashed' }); }
      }
    });
    return ok(ev);
  };

  /* ---------- heat & the oven door ---------- */
  S.setHeat = (v, on) => {
    if (!VESSELS.includes(v)) return fail('?');
    const a = S.active();
    if (on && a && a !== v) return fail('You chose the ' + a + ' for this dish. Clean up to try the ' + v + '.', 'vessel');
    if (S.st.heat[v] === !!on) return ok([]);
    const ev = [];
    S.st.heat[v] = !!on;
    if (on && v === 'oven' && S.st.door) { S.st.door = false; ev.push({ type: 'door-close' }); log('Closed the oven door'); }
    log(on ? (v === 'oven' ? 'Started baking' : 'Lit the stove under the pot') : (v === 'oven' ? 'Turned the oven off' : 'Turned off the stove'));
    ev.push({ type: on ? 'heat-on' : 'heat-off', where: v });
    if (on) S.at(v).filter((i) => i.rim).forEach((egg) => {   // an uncracked egg rolls in whole
      enter(egg, v);
      log('The whole egg rolled into ' + PLACE[v]);
      ev.push({ type: 'drop-in', where: v, id: 'egg', uid: egg.uid });
    });
    return ok(ev);
  };
  S.toggleHeat = (v) => S.setHeat(v, !S.st.heat[v]);

  S.setDoor = (open) => {
    if (S.st.door === !!open) return ok([]);
    S.st.door = !!open;
    log(open ? 'Opened the oven' + (S.st.heat.oven ? ' (baking paused)' : '') : 'Closed the oven door');
    return ok([{ type: open ? 'door-open' : 'door-close' }]);
  };
  S.toggleDoor = () => S.setDoor(!S.st.door);

  S.tick = (dt) => {
    if (S.st.served) return [];
    const ev = [];
    VESSELS.forEach((v) => {
      if (!S.cooking(v)) return;
      S.st.vt[v] += dt;
      S.inside(v).forEach((i) => {
        const p0 = WC.phaseOf(i.cookT);
        i.cookT += dt;
        const p1 = WC.phaseOf(i.cookT);
        if (p0 !== p1) ev.push({ type: 'phase', where: v, uid: i.uid, phase: p1 });
      });
    });
    return ev;
  };

  /* ---------- serve ---------- */
  S.serveSource = () => { const a = S.active(); return a && S.inside(a).length ? a : null; };
  /* food can go onto the plate once it is cooked — or once you stopped the heat after cooking it a bit */
  S.serveReady = () => {
    const a = S.serveSource();
    if (!a) return false;
    const t = S.inside(a).reduce((m, i) => Math.max(m, i.cookT), 0);
    return t >= WC.PHASE_T.ready || (!S.st.heat[a] && t > 0);
  };

  S.serve = () => {
    const src = S.serveSource();
    if (!src) return fail('Put something in the pot or the oven first.', 'empty');
    if (!S.serveReady()) return fail(S.st.heat[src] ? 'Not cooked yet — wait for "ready!" (or turn the heat off to serve it early).' : 'Cook it first: turn on the ' + (src === 'oven' ? 'oven dial.' : 'stove.'), 'raw');
    if (src === 'oven' && !S.st.door) return fail('Open the oven door to take the dish out.', 'door');
    const items = S.inside(src);
    const facts = WC.Engine.facts(S.st, items, src);
    const ev = [];
    VESSELS.forEach((v) => { S.st.heat[v] = false; });
    log(src === 'oven' ? 'Took the tray out of the oven and plated it' : 'Ladled it onto the plate');
    const outcome = WC.Engine.evaluate(facts);
    S.st.served = {
      outcome: outcome.id, facts,
      ingredients: items.map((i) => i.id),
      steps: S.logText().filter((t) => {
        // strip the names of ingredients in the dish, then drop lines that still mention another ingredient
        let low = t.toLowerCase();
        items.map((i) => WC.INGREDIENTS[i.id].name.toLowerCase()).sort((a, b) => b.length - a.length).forEach((n) => { low = low.split(n).join(' '); });
        return WC.ING_ORDER.every((id) => items.some((i) => i.id === id) || !low.includes(WC.INGREDIENTS[id].name.toLowerCase()));
      })
    };
    ev.push({ type: 'serve', outcome: outcome.id });
    return ok(ev, { outcome, facts });
  };

  S.MAX = MAX;
  WC.State = S;
})(window.WC);
