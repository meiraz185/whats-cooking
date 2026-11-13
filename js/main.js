/* Game controller: boot, cooking clock, serving, rounds, hints */
(function (WC) {
  'use strict';
  const S = WC.State, R = WC.Render, FX = WC.FX, Au = WC.Audio;
  const G = {};
  const TICK = 0.1;
  let acc = 0, last = 0;

  /* one short line + a soft glow on the place to touch next */
  G.hint = () => {
    const h = document.getElementById('hint');
    if (!h) return;
    const st = S.st;
    const a = S.active();
    const rim = st.items.find((i) => i.rim);
    const board = S.at('board')[0];
    const counter = S.at('counter');
    const ready = S.serveReady();
    let t, next = '';
    if (st.served) { t = 'Bon appétit!'; next = ''; }
    else if (R.sel === 'serve') { t = 'Tap the plate to serve.'; next = 'serve'; }
    else if (R.sel) { t = 'Tap where it goes: the board, the pot, the oven — or the cabinet to put it back.'; next = 'targets'; }
    else if (!st.items.length) { t = 'Pick something. Make something. (up to 4)'; next = 'cabinet'; }
    else if (rim) { t = 'Tap the egg to crack it in.'; next = a; }
    else if (board && WC.canChop(board.id, board.state)) { t = 'Tap or swipe the board to chop.'; next = 'board'; }
    else if (a && ready && a === 'oven' && !st.door) { t = 'Ready! Open the oven door to take it out.'; next = 'door'; }
    else if (a && ready) { t = a === 'pot' ? 'Ready! Ladle it onto the plate below.' : 'Take it out and onto the plate below.'; next = 'serve'; }
    else if (a === 'oven' && st.door && st.heat.oven) { t = 'Door open — baking is paused. Close the door to keep baking.'; next = 'door'; }
    else if (a === 'oven' && st.door && S.inside('oven').some((i) => i.id === 'flour') && !st.mixed.oven) { t = 'Stir the tray to make a batter, then turn the dial.'; next = 'oven'; }
    else if (a && S.cooking(a)) { t = a === 'pot' ? 'Stir with the spoon while it cooks…' : 'Watch it bake through the window…'; next = a; }
    else if (a) { t = counter.length ? 'Add the rest, then turn the ' + (a === 'oven' ? 'oven dial.' : 'stove knob.') : (a === 'oven' ? 'Turn the dial to bake (the door closes).' : 'Turn the knob to light the stove.'); next = counter.length ? 'stations' : 'knob-' + a; }
    else if (counter.some((i) => WC.canChop(i.id, i.state))) { t = 'Cut on the board — or drop straight into the pot or oven.'; next = 'prep'; }
    else { t = 'Choose: the pot or the oven? Drag your picks in.'; next = 'stations'; }
    h.textContent = t;
    document.body.dataset.next = next || '';
  };

  function loops() {
    const st = S.st;
    const on = !st.served;
    Au.loop('bubble', on && st.heat.pot && st.vt.pot > 1);
    Au.loop('oven', on && S.cooking('oven'));
  }

  function frame(ts) {
    const dt = Math.min(0.25, (ts - last) / 1000 || 0);
    last = ts;
    const heating = S.st.heat.pot || S.st.heat.oven;
    if (heating && !S.st.served) {
      acc += dt;
      let ev = [];
      while (acc >= TICK) { acc -= TICK; ev = ev.concat(S.tick(TICK)); }
      if (ev.length) { FX.play(ev); G.hint(); }
      R.all();
    } else acc = 0;
    loops();
    requestAnimationFrame(frame);
  }

  /* Serving: the cooked food physically travels from the pot / oven tray to the plate,
     settles, and only then is the dish revealed. */
  G.serve = () => {
    WC.Input.clearSel();
    if (S.st.served || G.serving) return;
    const src = S.serveSource();
    const srcEl = src === 'pot' ? document.querySelector('#st-pot .pot-contents') : src === 'oven' ? document.querySelector('#st-oven .tray, #st-oven .oven-door') : null;
    const from = srcEl ? srcEl.getBoundingClientRect() : null;
    const r = S.run('serve');
    if (!r.ok) return WC.Input.after(r, r.code === 'door' ? 'oven' : r.code === 'raw' && src ? src : 'serve');
    G.serving = true;
    Au.stopLoops();
    R.plated = false;
    R.all();
    G.hint();
    const spot = document.getElementById('plate-spot');
    const to = spot ? spot.getBoundingClientRect() : null;
    const dish = WC.dishSVG(r.outcome.id, r.facts, 'still');
    Au.play('serve');
    const size = from ? Math.min(from.width, from.height, 150) : 100;
    const land = () => {
      R.plated = true;
      R.all();
      Au.play('settle');
      FX.burst('serve', ['#fffaf0', '#f6cf5a', '#ef6a50'], 8);
      setTimeout(() => { G.serving = false; WC.Result.show(r.outcome, r.facts); }, 950);
    };
    if (from && to) FX.fly(dish, from, to, 720, { w0: size, h0: size, lift: 70 }).then(land);
    else land();
  };

  G.newRound = () => {
    S.reset();
    R.sel = null;
    R.plated = false;
    G.serving = false;
    G.note(null);
    R.all(true);
    G.hint();
  };

  G.note = (entry, name) => {
    const n = document.getElementById('note');
    if (!entry) { n.hidden = true; n.innerHTML = ''; return; }
    const steps = WC.Book.prepSteps(entry.steps);
    n.innerHTML = `<button class="close" aria-label="Hide recipe card">×</button><h4>${name}</h4><ol>${steps.map((s) => `<li>${s}</li>`).join('')}</ol>`;
    n.hidden = false;
    n.querySelector('.close').addEventListener('click', () => G.note(null));
  };

  /* Recreate: fresh kitchen, same ingredients on the counter, recipe card pinned */
  G.recreate = (id, entry) => {
    entry = entry || WC.Storage.data().book[id];
    G.newRound();
    if (!entry) return;
    entry.ingredients.forEach((ing) => S.pick(ing));
    S.undoStack = [];
    G.note(entry, entry.name || (WC.OUTCOMES[id] || {}).name || 'Recipe');
    R.all(true);
    G.hint();
    FX.toast('Same ingredients are out. Follow the card — or change one step.');
  };

  G.init = () => {
    const data = WC.Storage.load();
    Au.muted = !!data.muted;
    const snd = document.getElementById('btn-sound');
    const syncSnd = () => { snd.classList.toggle('muted', Au.muted); snd.setAttribute('aria-pressed', String(!Au.muted)); snd.setAttribute('aria-label', Au.muted ? 'Sound off' : 'Sound on'); };
    syncSnd();
    snd.addEventListener('click', () => { Au.init(); Au.setMuted(!Au.muted); WC.Storage.setMuted(Au.muted); syncSnd(); if (!Au.muted) Au.play('pick'); });
    document.getElementById('btn-undo').addEventListener('click', () => { WC.Input.clearSel(); WC.Input.after(S.run('undo')); R.all(true); });
    document.getElementById('btn-restart').addEventListener('click', () => { Au.init(); Au.play('drop'); G.newRound(); FX.toast('Clean kitchen. Start again.'); });
    document.getElementById('btn-book').addEventListener('click', () => { Au.init(); WC.Book.open(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { WC.Book.close(); if (S.st.served) { WC.Result.hide(); G.newRound(); } WC.Input.clearSel(); R.all(); }
    });
    WC.Book.bind();
    WC.Result.bind();
    WC.Input.bind();
    WC.Book.updateCount();
    R.all(true);
    G.hint();
    requestAnimationFrame((t) => { last = t; frame(t); });
  };

  WC.Game = G;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', G.init);
  else G.init();
})(window.WC);
