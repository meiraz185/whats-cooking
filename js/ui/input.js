/* V2.1 direct manipulation: pick from the cabinet (tap or drag), tap-to-select alternative,
   swipe/tap to chop, circular stirring in the pot (and the open oven tray), oven door & knobs.
   Mouse, touch and pen through Pointer Events. */
(function (WC) {
  'use strict';
  const S = WC.State, R = WC.Render, FX = WC.FX, Au = WC.Audio, U = WC.U;
  const IN = {};
  const VES = WC.VESSELS;
  let g = null;

  const $st = (n) => document.getElementById('st-' + n);
  const sidOf = (el) => (el ? el.id.replace('st-', '') : null);

  IN.after = (r, where) => {
    if (r && r.ok) { FX.play(r.events); if (r.warn) FX.fail({ msg: r.warn }, where); }
    else if (r) FX.fail(r, where);
    R.all();
    WC.Game.hint();
    return r;
  };

  function stationAt(x, y) {
    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      if (el.id === 'ghost' || (el.closest && el.closest('#ghost'))) continue;
      const s = el.closest && el.closest('[data-drop]');
      if (s) return s.dataset.drop;
    }
    return null;
  }

  function targetsFor(kind, ref) {
    const t = [];
    if (kind === 'pick') {
      if (S.count() >= S.MAX || S.byId(ref)) return [];
      t.push('counter');
      if (WC.canChop(ref, WC.INGREDIENTS[ref].start) && !S.at('board').length) t.push('board');
      VES.forEach((v) => { const a = S.active(); if (!a || a === v) t.push(v); });
    } else if (kind === 'item') {
      const it = S.find(ref);
      ['counter', 'board', 'pot', 'oven', 'pantry'].forEach((d) => { if (d !== it.loc && S.canGo(it, d)) t.push(d); });
    }
    return t;
  }
  function markTargets(list) {
    U.$$('.can-drop').forEach((e) => e.classList.remove('can-drop'));
    (list || []).forEach((d) => { const el = d === 'pantry' ? $st('cabinet') : $st(d); if (el) el.classList.add('can-drop'); });
    document.body.classList.toggle('targeting', !!(list && list.length));
  }
  IN.clearSel = () => { R.sel = null; markTargets(null); };

  /* ---------- ghost ---------- */
  const ghost = () => document.getElementById('ghost');
  function startDrag() {
    const v = S.active();
    const art = g.kind === 'pick' ? WC.Art.token(g.ref, WC.INGREDIENTS[g.ref].start)
      : g.kind === 'serve' ? `<path d="M14 40 Q14 88 50 88 Q86 88 86 40Z" fill="${v === 'oven' ? '#9aa3a8' : '#ef6a50'}" stroke="#3a2318" stroke-width="3"/><ellipse cx="50" cy="40" rx="36" ry="11" fill="${WC.Art.poolColor(S.inside(v))}" stroke="#3a2318" stroke-width="3"/>`
      : (() => { const it = S.find(g.ref); return WC.Art.token(it.id, it.state); })();
    const gh = ghost();
    gh.innerHTML = U.svg('0 0 100 100', art);
    gh.classList.add('on');
    g.drag = true;
    IN.clearSel();
    markTargets(g.kind === 'serve' ? ['serve'] : targetsFor(g.kind, g.ref));
    document.body.classList.add('dragging');
    if (g.kind === 'item') { const el = document.querySelector(`[data-uid="${g.ref}"]`); if (el) el.classList.add('lifted'); }
    if (g.kind === 'pick') Au.play('pick');
    moveGhost();
  }
  function moveGhost() {
    const gh = ghost();
    gh.style.transform = `translate(${g.x - 44}px, ${g.y - 56}px) rotate(${U.clamp((g.x - g.lx) * 0.6, -14, 14)}deg)`;
    g.lx = g.x;
    const over = stationAt(g.x, g.y);
    U.$$('.drop-hover').forEach((e) => e.classList.remove('drop-hover'));
    if (over) { const el = over === 'pantry' ? $st('cabinet') : $st(over); if (el && el.classList.contains('can-drop')) el.classList.add('drop-hover'); }
  }
  function endDrag() {
    const gh = ghost();
    gh.classList.remove('on'); gh.innerHTML = '';
    document.body.classList.remove('dragging');
    U.$$('.drop-hover,.lifted').forEach((e) => e.classList.remove('drop-hover', 'lifted'));
    markTargets(null);
  }

  function drop(kind, ref, dest) {
    if (kind === 'serve') { if (dest === 'serve') WC.Game.serve(); return; }
    if (!dest || dest === 'serve') return;
    if (kind === 'pick') {
      if (dest === 'pantry') return;
      return IN.after(S.run('pick', ref, dest), dest);
    }
    if (kind === 'item') {
      const it = S.find(ref);
      if (!it || dest === it.loc) return;
      return IN.after(S.run('move', ref, dest), dest === 'pantry' ? null : dest);
    }
  }

  const canCut = (it) => !!(it && WC.canChop(it.id, it.state));
  function cut() {
    const it = S.at('board')[0];
    if (!it || !canCut(it)) return;
    IN.after(S.run('chop', it.uid), 'board');
  }
  function stir(sid, amt) {
    if (!S.inside(sid).length) {
      if (S.at(sid).some((i) => i.rim)) return FX.toast('Tap the egg to crack it in.');
      if (sid === 'oven') return IN.after(S.run('toggleDoor'), 'oven');
      return FX.toast('Drop ingredients into the pot first.');
    }
    if (sid === 'oven' && !S.st.door) return IN.after(S.run('toggleDoor'), 'oven');
    if (g && !g.cp) { S.checkpoint(); g.cp = true; }
    IN.after(S.stir(sid, amt), sid);
  }

  function scrollToCat(cat) {
    const sh = document.getElementById('shelf');
    const grp = sh && sh.querySelector(`[data-cat="${cat}"]`);
    if (grp) sh.scrollTo({ left: grp.offsetLeft - sh.offsetLeft - 4, behavior: 'smooth' });
    R.cat = cat; U.$$('.cab-tab').forEach((t) => t.classList.toggle('on', t.dataset.act === 'cat:' + cat));
    if (grp) FX.restart(grp, 'flash');
    Au.play('click');
  }

  function tap(G) {
    const sid = G.sid;
    if (G.kind === 'act') {
      const [a, b] = G.actEl.dataset.act.split(':');
      if (a === 'crack') return IN.after(S.run('crack', b), sid);
      if (a === 'heat') { IN.clearSel(); return IN.after(S.run('toggleHeat', b), b); }
      if (a === 'door') { IN.clearSel(); return IN.after(S.run('toggleDoor'), 'oven'); }
      if (a === 'serve') return WC.Game.serve();
      if (a === 'cat') return scrollToCat(b);
      if (a === 'unpick') { IN.clearSel(); return IN.after(S.run('togglePick', b)); }
    }
    if (G.kind === 'pick') {
      if (R.sel) {          // a selected counter item tapped onto the cabinet = put it back
        const sel = R.sel; IN.clearSel();
        return IN.after(S.run('move', sel, 'pantry'));
      }
      const src = G.pickEl ? G.pickEl.querySelector('svg') : null;
      const from = src ? src.getBoundingClientRect() : null;
      const r = IN.after(S.run('togglePick', G.ref), 'counter');
      if (r && r.ok && from && r.events.some((e) => e.type === 'pick')) FX.flyPick(r.uid || (S.byId(G.ref) || {}).uid, from);
      if (G.pickEl) FX.restart(G.pickEl, 'pressed');
      return r;
    }
    if (G.kind === 'serve') {
      R.sel = R.sel === 'serve' ? null : 'serve';
      markTargets(R.sel ? ['serve'] : null);
      if (R.sel) FX.toast('Now tap the plate below.');
      R.all(); return WC.Game.hint();
    }
    if (G.kind === 'item') {
      const it = S.find(G.ref);
      if (!it) return;
      if (sid === 'board' && canCut(it) && R.sel !== it.uid) return cut();
      if (R.sel === it.uid) { IN.clearSel(); return R.all(); }
      R.sel = it.uid;
      markTargets(targetsFor('item', it.uid));
      FX.toast(canCut(it) ? 'Tap the board to cut it — or the pot or oven to cook it.' : 'Tap the pot or the oven to add it.');
      return R.all();
    }
    if (R.sel) {
      const sel = R.sel;
      IN.clearSel();
      if (!sid) return R.all();
      if (sel === 'serve') return sid === 'serve' ? WC.Game.serve() : R.all();
      const dest = sid === 'cabinet' ? 'pantry' : sid;
      const srcEl = document.querySelector(`[data-uid="${sel}"]`);
      const from = srcEl ? srcEl.getBoundingClientRect() : null;
      if (VES.includes(dest) && from) R.dropDelay = 280;
      const r = IN.after(S.run('move', sel, dest), dest === 'pantry' ? null : dest);
      R.dropDelay = 0;
      if (r && r.ok && from && VES.includes(dest)) { const it = S.find(sel); FX.flyTo(WC.Art.token(it.id, it.state), from, $st(dest), 280); }
      return r;
    }
    if (sid === 'serve') return WC.Game.serve();
    if (VES.includes(sid)) return stir(sid, 0.25);
    if (sid === 'board') {
      const it = S.at('board')[0];
      if (it && canCut(it)) return cut();
      if (it) return tap({ kind: 'item', ref: it.uid, sid: 'board' });   // a cut item: tapping the board picks it up
      return FX.toast('Drop a vegetable or fruit here to cut it.');
    }
  }

  /* ---------- pointer plumbing ---------- */
  function down(e) {
    if (e.button !== undefined && e.button > 0) return;
    if (document.body.classList.contains('modal-open')) return;
    Au.init();
    const t = e.target;
    let actEl = t.closest('[data-act]');
    const pickEl = t.closest('[data-pick]');
    const uidEl = t.closest('.draggable[data-uid], .draggable-svg[data-uid]');
    const station = t.closest('.station, .cabinet');
    const serveEl = t.closest('[data-serve]');
    // with an item selected, a tap on the oven door means "put it in the oven"
    if (actEl && R.sel && actEl.dataset.act === 'door') actEl = null;
    g = { id: e.pointerId, type: e.pointerType, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, lx: e.clientX, px: e.clientX, py: e.clientY,
      moved: false, drag: false, travel: 0, sid: sidOf(station), station, actEl };
    g.pickEl = pickEl;
    if (serveEl) g.kind = 'serve';
    else if (actEl) g.kind = 'act';
    else if (pickEl) { g.kind = 'pick'; g.ref = pickEl.dataset.pick; }
    else if (uidEl) { g.kind = 'item'; g.ref = uidEl.dataset.uid; }
    else if (VES.includes(g.sid)) g.kind = 'stir';
    else if (g.sid === 'board' && S.at('board')[0]) { g.kind = 'item'; g.ref = S.at('board')[0].uid; }   // grab the food anywhere on the board
    else if (g.sid === 'board') g.kind = 'rub';
    else g.kind = 'tap';
    if (g.kind === 'stir') {
      const r = station.getBoundingClientRect();
      g.cx = r.left + r.width / 2; g.cy = r.top + r.height * 0.45;
      g.a = Math.atan2(e.clientY - g.cy, e.clientX - g.cx); g.acc = 0; g.turned = 0;
    }
    // inside the cabinet shelf, let touch pan horizontally (browser) — we only take vertical drags
    if (!(pickEl && e.pointerType === 'touch')) {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    }
    if ((station && !pickEl) || (pickEl && e.pointerType !== 'touch')) e.preventDefault();
  }

  function move(e) {
    if (!g || e.pointerId !== g.id) return;
    g.x = e.clientX; g.y = e.clientY;
    const dist = Math.hypot(g.x - g.x0, g.y - g.y0);
    if (!g.moved && dist > 9) g.moved = true;
    const seg = Math.hypot(g.x - g.px, g.y - g.py);
    g.px = g.x; g.py = g.y;

    if (g.kind === 'item' && g.sid === 'board' && !g.drag) {
      const r = g.station.getBoundingClientRect();
      const inside = g.x > r.left && g.x < r.right && g.y > r.top && g.y < r.bottom;
      if (inside && canCut(S.find(g.ref))) {        // swipe across the board to chop
        g.travel += seg;
        if (g.travel >= 38) { g.travel = 0; g.rubbed = true; cut(); }
        return;
      }
      if (!inside && g.moved) startDrag();
      if (!g.drag) return;
    }
    if (g.kind === 'rub') {
      g.travel += seg;
      if (g.travel >= 38 && canCut(S.at('board')[0])) { g.travel = 0; g.rubbed = true; cut(); }
      return;
    }
    if (g.kind === 'pick' || g.kind === 'item' || g.kind === 'serve') {
      if (g.moved && !g.drag) {
        // in the shelf, a mostly-horizontal mouse drag scrolls (only if the shelf can scroll)
        const sh = document.getElementById('shelf');
        if (g.kind === 'pick' && g.type !== 'touch' && sh && sh.scrollWidth > sh.clientWidth + 4 && Math.abs(g.x - g.x0) > Math.abs(g.y - g.y0) * 1.4) {
          sh.scrollLeft -= (e.movementX || 0); g.scrolled = true;
          return;
        }
        if (g.scrolled) return;
        startDrag();
      }
      if (g.drag) moveGhost();
      return;
    }
    if (g.kind === 'stir') {
      if (Math.hypot(g.x - g.cx, g.y - g.cy) < 14) return;
      const a = Math.atan2(g.y - g.cy, g.x - g.cx);
      let d = a - g.a;
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      g.a = a;
      g.acc += Math.abs(d);
      const u = g.station.querySelector('.utensil');
      if (u) u.style.transform = `translate(${(g.x - g.cx) * 0.2}px, ${(g.y - g.cy) * 0.2}px) rotate(${a * 57 / 6}deg)`;
      g.swirl = (g.swirl || 0) + d * 57.3 * 0.35;
      g.station.style.setProperty('--swirl', `${g.swirl}deg`);
      while (g.acc >= Math.PI / 2) { g.acc -= Math.PI / 2; g.turned++; stir(g.sid, 0.25); }
    }
  }

  function up(e) {
    if (!g || e.pointerId !== g.id) return;
    const G = g;
    if (G.drag) {
      const dest = stationAt(G.x, G.y);
      endDrag();
      g = null;
      drop(G.kind, G.ref, dest);
      return;
    }
    g = null;
    if (G.scrolled) return;
    if (G.kind === 'stir') {
      const u = G.station && G.station.querySelector('.utensil');
      if (u) u.style.transform = '';
      if (G.station) G.station.style.setProperty('--swirl', '0deg');
      if (!G.moved || (!G.turned && Math.hypot(G.x - G.x0, G.y - G.y0) < 24)) tap(G);
      return;
    }
    if (G.rubbed) return;
    if (!G.moved || G.kind === 'tap' || G.kind === 'act') tap(G);
  }

  function cancel() {
    if (g && g.drag) endDrag();
    g = null;
  }

  IN.bind = () => {
    const k = document.getElementById('kitchen');
    k.addEventListener('pointerdown', down);
    k.addEventListener('pointermove', move);
    k.addEventListener('pointerup', up);
    k.addEventListener('pointercancel', cancel);
    k.addEventListener('lostpointercapture', (e) => { if (g && g.id === e.pointerId && !g.drag && g.type !== 'touch') g = null; });
    // the tab of the shelf group currently in view lights up
    k.addEventListener('scroll', (e) => {
      if (!e.target.classList || !e.target.classList.contains('shelf')) return;
      const sh = e.target, left = sh.getBoundingClientRect().left;
      let cur = WC.CATS[0][0];
      sh.querySelectorAll('.shelf-group').forEach((gEl) => { if (gEl.getBoundingClientRect().left - left < sh.clientWidth * 0.4) cur = gEl.dataset.cat; });
      if (cur !== R.cat) { R.cat = cur; U.$$('.cab-tab').forEach((t) => t.classList.toggle('on', t.dataset.act === 'cat:' + cur)); }
    }, true);
    // mouse wheel scrolls the cabinet sideways
    k.addEventListener('wheel', (e) => {
      const sh = e.target.closest && e.target.closest('.shelf');
      if (!sh || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      sh.scrollLeft += e.deltaY; e.preventDefault();
    }, { passive: false });
    k.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const t = e.target;
      const station = t.closest('.station, .cabinet');
      const G = { sid: sidOf(station), station, kind: 'tap', actEl: t.closest('[data-act]') };
      const pickEl = t.closest('[data-pick]'), uidEl = t.closest('[data-uid]');
      if (G.actEl) G.kind = 'act'; else if (pickEl) { G.kind = 'pick'; G.ref = pickEl.dataset.pick; } else if (uidEl) { G.kind = 'item'; G.ref = uidEl.dataset.uid; }
      e.preventDefault();
      Au.init();
      tap(G);
    });
  };

  WC.Input = IN;
})(window.WC);
