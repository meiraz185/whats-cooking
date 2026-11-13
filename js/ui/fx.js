/* Short action feedback: overlays tied to real events (crack, chop, splash...) + toasts */
(function (WC) {
  'use strict';
  const U = WC.U, INK = U.INK, Au = WC.Audio;
  const FX = {};
  const O2 = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;

  const st = (name) => document.getElementById('st-' + name);

  /* overlay svg inside a station; removed after its animation */
  FX.overlay = (where, inner, cls, ms = 900, vb = '0 0 100 100') => {
    const el = st(where);
    if (!el) return;
    const d = document.createElement('div');
    d.className = 'fx ' + (cls || '');
    d.innerHTML = U.svg(vb, inner);
    el.appendChild(d);
    setTimeout(() => d.remove(), ms);
  };
  FX.restart = (el, cls) => {
    if (!el) return;
    el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls);
  };
  FX.bump = (where, cls = 'bump') => FX.restart(st(where), cls);

  FX.burst = (where, colors, n = 8, cls = 'fx-burst') => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, c = colors[i % colors.length];
      s += `<circle style="--x:${Math.cos(a) * 38}px;--y:${Math.sin(a) * 30 - 6}px;animation-delay:${(i % 3) * 0.03}s" cx="50" cy="50" r="${3 + (i % 3)}" fill="${c}" ${O2}/>`;
    }
    FX.overlay(where, s, cls, 800);
  };

  const shell = `<path class="shell-l" d="M30 50 Q30 26 50 24 L46 34 L52 40 L46 48 Z" fill="#fff4e0" ${O2}/>` +
    `<path class="shell-r" d="M70 50 Q70 26 50 24 L54 34 L48 40 L54 48 Z" fill="#fff4e0" ${O2}/>` +
    `<path class="drip" d="M50 46 q-6 10 0 18 q6 -8 0 -18Z" fill="#f7a823" ${O2}/>`;
  const splash = (c) => [-1, 1].map((k) => `<path style="--k:${k}" class="splash" d="M50 60 q${k * 16} -20 ${k * 24} -6" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`).join('');
  const PREP_COL = { tomato: ['#e9533f', '#f7907a'], onion: ['#f3d6e1', '#b65a7f'], mushroom: ['#efd7b6', '#b5764c'], potato: ['#f3e2a8', '#d9a85b'],
    strawberry: ['#e8434f', '#ffb3bd'], chocolate: ['#5a3524', '#8a5638'], cheese: ['#f6cf5a', '#e2ac2c'] };

  /* ---------- flights: a real object travelling between parts of the kitchen ---------- */
  FX.fly = (html, from, to, ms = 420, opts = {}) => new Promise((resolve) => {
    if (!from || !to) return resolve();
    const d = document.createElement('div');
    d.className = 'flyer ' + (opts.cls || '');
    d.innerHTML = html;
    const w0 = opts.w0 || from.width, h0 = opts.h0 || from.height, w1 = opts.w1 || to.width, h1 = opts.h1 || to.height;
    Object.assign(d.style, { left: '0px', top: '0px', width: w0 + 'px', height: h0 + 'px' });
    document.body.appendChild(d);
    const x0 = from.left + from.width / 2 - w0 / 2, y0 = from.top + from.height / 2 - h0 / 2;
    const x1 = to.left + to.width / 2 - w1 / 2, y1 = to.top + to.height / 2 - h1 / 2;
    const lift = opts.lift === undefined ? 60 : opts.lift;
    const sx = w1 / w0, sy = h1 / h0;
    if (!d.animate) { d.remove(); return resolve(); }
    const anim = d.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(1)`, offset: 0 },
      { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - lift}px) scale(${(1 + sx) / 2}, ${(1 + sy) / 2}) rotate(${opts.spin || 0}deg)`, offset: 0.5 },
      { transform: `translate(${x1}px, ${y1}px) scale(${sx}, ${sy})`, offset: 1 }
    ], { duration: ms, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'forwards' });
    anim.onfinish = () => { d.remove(); resolve(); };
    setTimeout(() => { if (d.isConnected) { d.remove(); resolve(); } }, ms + 400);
  });
  /* cabinet → slot: the ingredient leaves the shelf and settles into its slot */
  FX.flyPick = (uid, from) => {
    const el = uid && document.querySelector(`#st-counter [data-uid="${uid}"]`);
    if (!el) return;
    const svg = el.querySelector('svg');
    const to = (svg || el).getBoundingClientRect();
    el.style.opacity = '0';   // still grabbable while the flight plays
    Au.play('whoosh');
    FX.fly(svg ? svg.outerHTML : '', from, to, 380, { lift: 30, spin: -12 }).then(() => {
      el.style.opacity = '';
      FX.restart(el, 'settle');
      Au.play('settle');
    });
  };
  /* slot → pot / oven (tap-to-place): the ingredient flies over, then drops in */
  FX.flyTo = (art, from, stationEl, ms) => {
    if (!stationEl) return;
    const r = stationEl.getBoundingClientRect();
    const to = { left: r.left + r.width * 0.3, top: r.top + r.height * 0.15, width: r.width * 0.4, height: r.height * 0.3 };
    FX.fly(U.svg('0 0 100 100', art), from, to, ms, { lift: 40, w1: Math.min(from.width, 70), h1: Math.min(from.height, 70) });
  };

  FX.toastT = null;
  FX.toast = (msg, kind) => {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = 'toast show ' + (kind || '');
    clearTimeout(FX.toastT);
    FX.toastT = setTimeout(() => { t.className = 'toast'; }, 2600);
  };

  FX.fail = (r, where) => {
    if (where) FX.bump(where, 'shake');
    if (r && r.msg) FX.toast(r.msg, 'warn');
    Au.play('no');
  };

  let stirSnd = 0, plopSnd = 0;
  FX.play = (events) => {
    (events || []).forEach((e) => {
      switch (e.type) {
        case 'pick': Au.play('pick'); break;
        case 'return': Au.play('drop'); break;
        case 'move':
          if (['board', 'counter'].includes(e.to)) { Au.play('drop'); FX.bump(e.to, 'land'); }
          break;
        case 'drop-in': {
          if (e.uid) WC.Render.justAdded[e.uid] = { t: performance.now(), delay: WC.Render.dropDelay || 0 };
          if (e.quiet) break;
          const now = performance.now();
          if (now - plopSnd > 120 && e.where !== 'pot') { setTimeout(() => Au.play('tray'), (WC.Render.dropDelay || 0) + 200); plopSnd = now; }
          const dly = WC.Render.dropDelay || 0;
          setTimeout(() => {
            if (e.where === 'pot') { FX.overlay('pot', splash('#9fd8e0'), 'fx-splash', 600); Au.play(e.id === 'egg' || e.id === 'cheese' ? 'plop' : 'splash'); }
            FX.bump(e.where, 'land');
          }, dly + 260);
          break;
        }
        case 'door-open': Au.play('doorOpen'); FX.bump('oven', 'land'); break;
        case 'door-close': Au.play('doorClose'); FX.bump('oven', 'land'); break;
        case 'crack': Au.play('crack'); FX.overlay(e.where, shell, 'fx-crack', 900); break;
        case 'chop': {
          Au.play('chop');
          const k = st('board') && st('board').querySelector('.knife');
          if (k) FX.restart(k, 'chop');
          const it = WC.State.find(e.uid);
          if (it) FX.burst('board', PREP_COL[it.id] || [WC.INGREDIENTS[it.id].color, '#fffaf0'], 5, 'fx-bits');
          break;
        }
        case 'prepped': if (e.state && e.state !== 'mashed') FX.bump('board', 'chopped'); Au.play('mixed'); FX.burst(WC.State.find(e.uid) ? WC.State.find(e.uid).loc : 'board', ['#fffaf0', '#f6cf5a', '#ef6a50'], 8); break;
        case 'stir': {
          const now = performance.now();
          if (now - stirSnd > 160) { Au.play('stir'); stirSnd = now; }
          const u = st(e.where) && st(e.where).querySelector('.utensil');
          if (u) FX.restart(u, 'swish');
          break;
        }
        case 'mixed': Au.play('mixed'); FX.burst(e.where, ['#fffaf0', '#f6cf5a'], 10, 'fx-swirl'); break;
        case 'heat-on': Au.play(e.where === 'pot' ? 'ignite' : 'ovenOn'); FX.bump(e.where, 'land'); break;
        case 'heat-off': Au.play('click'); break;
        case 'phase':
          if (e.phase === 'ready') { Au.play(e.where === 'oven' ? 'bakeDone' : 'ready'); FX.bump(e.where, 'ready-pulse'); }
          if (e.phase === 'burnt') Au.play('burnt');
          break;
        case 'undo': Au.play('drop'); break;
      }
    });
  };

  WC.FX = FX;
})(window.WC);
