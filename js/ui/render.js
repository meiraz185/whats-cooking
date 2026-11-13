/* V2.1 kitchen rendering: drawn from WC.State. Each station re-renders only when its visual key changes. */
(function (WC) {
  'use strict';
  const U = WC.U, P = U.PAL, INK = U.INK, A = WC.Art, S = WC.State;
  const O = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const O2 = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
  const put = (inner, cx, cy, s, rot = 0, attrs = '') =>
    `<g ${attrs} transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s}) translate(-50 -50)">${inner}</g>`;
  const R = { keys: {}, vkeys: {}, sel: null, justAdded: {}, cat: 'veg', serving: false, plated: false };

  const SLOTS = { 1: [[0, 0]], 2: [[-30, 0], [30, 0]], 3: [[-40, 4], [0, -6], [40, 4]], 4: [[-48, 4], [-16, -6], [16, -6], [48, 4]] };
  const maxT = (v) => S.inside(v).reduce((m, i) => Math.max(m, i.cookT), 0);
  const phaseOfVessel = (v) => WC.phaseOf(maxT(v));

  /* what is inside a cooking station: blended pool of stirred liquids + individual pieces + egg on the rim */
  function contents(where, cx, cy, scale, rimX, rimY) {
    if (S.st.served) return '';                      // the food has gone onto the plate
    const items = S.at(where);
    const inside = items.filter((i) => !i.rim);
    const pooled = inside.filter((i) => i.premixed && A.LIQUID(i));
    const solo = inside.filter((i) => !pooled.includes(i));
    const cooking = S.cooking(where);
    const now = performance.now();
    const arrive = (it) => {                          // just dropped in: falls into the pot / slides onto the tray
      const j = R.justAdded[it.uid];
      if (!j || now - j.t > 900 + j.delay) return ['', ''];
      return [where === 'pot' ? 'fall' : 'place', `animation-delay:${j.delay}ms`];
    };
    let s = '';
    if (pooled.length) {
      const ph = WC.phaseOf(Math.max(...pooled.map((i) => i.cookT)));
      s += `<g class="${cooking ? 'bob slow' : ''}" style="transform-origin:${cx}px ${cy}px">` + put(A.pool(pooled, { where, phase: ph }), cx, cy + 2, scale * 1.6) + '</g>';
    }
    const pos = SLOTS[Math.min(4, solo.length)] || [];
    const k0 = [1, 1.5, 1.25, 1.1, 1][Math.min(4, solo.length)] * (pooled.length ? 0.85 : 1);
    const spread = scale / 0.46;
    solo.forEach((it, k) => {
      const [dx, dy] = pos[k];
      const x = cx + dx * spread, y = cy + dy - 6;
      const [fcls, fsty] = arrive(it);
      s += `<g class="${cooking ? 'bob' : ''}" style="transform-origin:${x}px ${y}px;animation-delay:${k * 0.35}s">` +
        `<g class="${fcls}" style="${fsty}">` + put(A.inside(it, { where, phase: WC.phaseOf(it.cookT) }), x, y, scale * k0, 0, `data-uid="${it.uid}"`) + '</g></g>';
    });
    items.filter((i) => i.rim).forEach((it) => {
      s += `<g class="rim-egg" data-act="crack:${it.uid}" role="button" aria-label="Tap to crack the egg">` +
        `<circle cx="${rimX}" cy="${rimY}" r="34" fill="transparent"/>` +
        `<g class="wob" style="transform-origin:${rimX}px ${rimY}px">` + put(A.token('egg', 'whole'), rimX, rimY, 0.6, 25) + '</g>' +
        `<text x="${rimX}" y="${rimY - 38}" class="tap-hint" text-anchor="middle">tap to crack</text></g>`;
    });
    return s;
  }

  function flames(cx, cy, on, w) {
    let s = `<ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="11" fill="#4a3a3a" ${O2}/>`;
    if (!on) return s + `<ellipse cx="${cx}" cy="${cy}" rx="${w * 0.6}" ry="6" fill="none" stroke="#7a6a66" stroke-width="2"/>`;
    for (let i = 0; i < 9; i++) {
      const x = cx - w * 0.8 + i * (w * 1.6 / 8);
      s += `<path class="flame" style="animation-delay:${(i % 3) * 0.12}s" d="M${x - 6} ${cy} Q${x} ${cy - 26} ${x + 6} ${cy} Z" fill="${i % 2 ? '#ff9a3c' : '#5aa9e6'}" stroke="${INK}" stroke-width="1.6"/>`;
    }
    return s;
  }

  function knob(v, cx, cy, r, label) {
    const on = S.st.heat[v];
    const t = maxT(v);
    const ph = WC.phaseOf(t);
    const col = { raw: '#c9b9a6', heating: P.butter, ready: '#7cc36a', over: '#e8893a', burnt: '#3a2318' }[ph];
    const circ = 2 * Math.PI * (r + 7);
    return `<g class="knob ${on ? 'on' : ''}" data-act="heat:${v}" role="button" aria-label="${on ? 'Turn off' : 'Turn on'} the ${v === 'oven' ? 'oven' : 'stove'}">` +
      `<circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="transparent"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="none" stroke="#e8dcc6" stroke-width="5"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="none" stroke="${col}" stroke-width="5" stroke-dasharray="${circ * WC.dial(t)} ${circ}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="round"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${on ? P.coral : '#fffaf0'}" ${O}/>` +
      `<rect x="${cx - 3.5}" y="${cy - r + 3}" width="7" height="${r}" rx="3" fill="${on ? '#fffaf0' : INK}" transform="rotate(${on ? 120 : 0} ${cx} ${cy})"/>` +
      (label ? `<text x="${cx}" y="${cy + r + 24}" class="knob-label" text-anchor="middle">${label}</text>` : '') + '</g>';
  }

  const CUE = { raw: '', heating: 'warming…', ready: 'ready!', over: 'getting dark…', burnt: 'burnt!' };
  function cue(v, x, y) {
    if (!S.inside(v).length || S.st.served) return '';
    if (v === 'oven' && !S.st.door && S.serveReady() && S.active() === 'oven') return `<text x="${x}" y="${y}" class="cue cue-ready blink" text-anchor="middle">ready — open the door</text>`;
    if (v === 'oven' && S.st.door && S.serveReady() && S.active() === 'oven') return '';
    if (v === 'oven' && S.st.door && S.st.heat.oven) return `<text x="${x}" y="${y}" class="cue cue-heating" text-anchor="middle">door open — paused</text>`;
    if (!S.st.heat[v] && phaseOfVessel(v) === 'raw') return '';
    const ph = phaseOfVessel(v);
    return `<text x="${x}" y="${y}" class="cue cue-${ph}" text-anchor="middle">${CUE[ph]}</text>`;
  }

  /* "ladle it out" / "take it out": drag it to the plate, or tap it then tap the plate */
  function serveTag(v, x, y) {
    if (S.active() !== v || !S.serveReady() || S.st.served) return '';
    if (v === 'oven' && !S.st.door) return '';
    const label = v === 'pot' ? 'ladle it out' : 'take it out';
    return `<g class="serve-tag ${R.sel === 'serve' ? 'on' : ''}" data-serve="${v}" role="button" aria-label="${label} — then tap the plate">` +
      `<rect x="${x}" y="${y}" width="118" height="30" rx="15" fill="${P.coral}" ${O2}/>` +
      (v === 'pot' ? `<path d="M${x + 16} ${y + 9} q0 12 10 12 q10 0 10 -12" fill="#e6eef0" ${O2}/><path d="M${x + 26} ${y + 9} L${x + 26} ${y - 4}" ${O2}/>`
        : `<rect x="${x + 10}" y="${y + 9}" width="24" height="12" rx="3" fill="#9aa3a8" ${O2}/>`) +
      `<text x="${x + 76}" y="${y + 20}" class="tab-label light" text-anchor="middle">${label}</text></g>`;
  }

  const ST = {};

  /* ---------- the ingredient cabinet ---------- */
  ST.cabinet = () => {
    const taken = {};
    S.st.items.forEach((i) => { taken[i.id] = i; });
    const full = S.count() >= S.MAX;
    let shelf = '';
    WC.CATS.forEach(([cat, label]) => {
      const ids = WC.ING_ORDER.filter((id) => WC.INGREDIENTS[id].cat === cat);
      const cols = Math.ceil(ids.length / 2);
      shelf += `<div class="shelf-group cat-${cat}" data-cat="${cat}" style="--cols:${cols}"><span class="shelf-tag">${label}</span><div class="shelf-items">` + ids.map((id) => {
        const t = taken[id];
        const cls = t ? (S.movable(t) ? 'picked' : 'cooking') : full ? 'full' : '';
        return `<button class="pantry-item ${cls}" data-pick="${id}" aria-pressed="${!!t}" aria-label="${WC.INGREDIENTS[id].name}${t ? ' (picked — tap to put back)' : ''}">` +
          U.svg('0 0 100 100', A.token(id, WC.INGREDIENTS[id].start), 'tok') + `<span>${WC.INGREDIENTS[id].name}</span>` +
          (t ? `<i class="tick" aria-hidden="true">${S.movable(t) ? '✓' : '♨'}</i>` : '') + '</button>';
      }).join('') + '</div></div>';
    });
    return `<div class="cab-frame"><div class="cab-tabs">` +
      WC.CATS.map(([cat, label]) => `<button class="cab-tab cat-${cat} ${R.cat === cat ? 'on' : ''}" data-act="cat:${cat}">${label}</button>`).join('') +
      `<span class="cab-count ${full ? 'full' : ''}">${S.count()}/4 picked</span></div>` +
      `<div class="shelf" id="shelf">${shelf}</div></div>`;
  };

  ST.counter = () => {
    const items = S.at('counter');
    let html = '';
    for (let k = 0; k < S.MAX; k++) {
      const it = items[k];
      html += `<div class="slot">` + (it ? `<div class="item draggable ${R.sel === it.uid ? 'selected' : ''} ${WC.canChop(it.id, it.state) ? 'cuttable' : ''}" data-uid="${it.uid}" role="button" tabindex="0" aria-label="${WC.ingLabel(it.id, it.state)}">` +
        U.svg('0 0 100 100', A.token(it.id, it.state), 'tok') +
        `<span class="unpick" data-act="unpick:${it.id}" role="button" aria-label="Put ${WC.INGREDIENTS[it.id].name} back">×</span></div>` : '') + '</div>';
    }
    const placed = S.st.items.filter((i) => i.loc !== 'counter').length;
    return `<div class="slots">${html}</div><div class="counter-label">your picks <b>${S.count()}/4</b>${placed ? ` · ${placed} cooking` : ''}</div>`;
  };

  ST.board = () => {
    const it = S.at('board')[0];
    const cut = it && WC.canChop(it.id, it.state);
    return U.svg('0 0 300 140',
      `<ellipse cx="140" cy="128" rx="128" ry="9" fill="${INK}" opacity=".12"/>` +
      `<path d="M14 48 Q14 30 36 30 L244 30 Q266 30 266 48 L266 106 Q266 124 244 124 L36 124 Q14 124 14 106Z" fill="#d9a066" ${O}/>` +
      `<path d="M30 54 L250 54 M38 80 L242 80 M30 104 L250 104" stroke="#c48a52" stroke-width="2.5"/><circle cx="254" cy="42" r="5" fill="#f6ecd6" ${O2}/>` +
      (it ? put(A.board(it), 136, 76, 0.95, 0, `class="draggable-svg" data-uid="${it.uid}"`) : `<text x="140" y="86" class="ghost-label" text-anchor="middle">cutting board</text>`) +
      `<g class="knife ${cut ? 'ready' : ''}"><path d="M232 18 L292 2 L294 12 L238 32Z" fill="#e6eef0" ${O2}/><rect x="206" y="24" width="34" height="13" rx="5" transform="rotate(-16 223 30)" fill="${P.choco}" ${O2}/></g>` +
      (it && it.prog ? `<g>${[0, 1, 2].map((k) => `<circle cx="${122 + k * 16}" cy="134" r="4" fill="${k < it.prog ? P.coral : '#e8dcc6'}"/>`).join('')}</g>` : '') +
      (cut && !it.prog ? `<text x="140" y="22" class="tap-hint" text-anchor="middle">tap or swipe to chop</text>` : ''),
      'st-svg');
  };

  /* ---------- the pot on the stove ---------- */
  ST.pot = () => {
    const on = S.st.heat.pot;
    const ph = phaseOfVessel('pot');
    const inside = S.inside('pot');
    const boiling = on && S.st.vt.pot > 1;
    // the liquid takes on the colour of what is cooking in it
    const mixC = inside.length ? A.poolColor(inside) : '#bfe6ec';
    const k = U.clamp(maxT('pot') / WC.PHASE_T.over, 0, 1) * (inside.length ? 0.75 : 0);
    const liquid = S.st.served ? '#bfe6ec' : U.tone(U.mix('#bfe6ec', mixC, k), ph === 'over' || ph === 'burnt' ? ph : 'raw');
    return U.svg('0 0 300 250',
      flames(150, 228, on, 96) + `<rect x="34" y="226" width="232" height="12" rx="6" fill="#5a4a48" ${O2}/>` +
      `<ellipse cx="150" cy="92" rx="118" ry="32" fill="#fffaf0" ${O}/>` +
      `<ellipse cx="150" cy="95" rx="104" ry="24" fill="${liquid}"/>` +
      (S.st.mixed.pot && inside.length && !S.st.served ? `<ellipse cx="150" cy="95" rx="104" ry="24" fill="${U.mix(mixC, '#ffffff', 0.1)}" opacity="${0.35 + k * 0.6}"/>` : '') +
      `<g clip-path="url(#potclip)"><g class="pot-contents">${contents('pot', 150, 98, 0.7, 236, 58)}</g></g>` +
      (S.st.mixed.pot && inside.length && !S.st.served ? `<path class="thick" d="M84 96 q22 -10 44 0 t44 0 t40 0" stroke="${U.mix(mixC, '#ffffff', 0.45)}" stroke-width="${3 + k * 4}" fill="none" stroke-linecap="round" opacity=".8"/>` : '') +
      `<defs><clipPath id="potclip"><path d="M0 0 H300 V104 Q150 140 0 104Z"/></clipPath></defs>` +
      (boiling ? A.B.bubbles('pot', 12, 150, 94, 86, 12) : '') +
      `<path d="M32 92 L44 206 Q150 232 256 206 L268 92 Q150 136 32 92Z" fill="${P.coral}" ${O}/>` +
      `<path d="M18 104 q-14 0 -14 14 q0 12 16 12 L36 128" fill="none" ${O}/><path d="M282 104 q14 0 14 14 q0 12 -16 12 L264 128" fill="none" ${O}/>` +
      `<path d="M62 150 Q150 176 238 150" stroke="#fff" stroke-width="5" opacity=".35" fill="none"/>` +
      `<g transform="translate(212 40) rotate(28)"><g class="utensil spoon"><rect x="-5" y="-8" width="10" height="84" rx="5" fill="#d9a066" ${O2}/><ellipse cx="0" cy="84" rx="13" ry="17" fill="#d9a066" ${O2}/></g></g>` +
      (boiling || (inside.length && on) ? `<g>${[0, 1, 2].map((i) => `<path class="steam" style="animation-delay:${i * 0.5}s" d="M${110 + i * 40} 56 q-8 -10 0 -20 q8 -10 0 -20" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}</g>` : '') +
      (on && (ph === 'over' || ph === 'burnt') ? A.B.smoke(3, 150, 52, ph === 'burnt') : '') +
      cue('pot', 214, 22) + knob('pot', 252, 188, 16) + serveTag('pot', 18, 22) +
      (!inside.length && !S.at('pot').length ? `<text x="150" y="182" class="ghost-label light" text-anchor="middle">pot</text>` : ''),
      'st-svg');
  };

  /* ---------- the oven (door opens and closes) ---------- */
  /* ---------- the oven: door, light, tray, window ---------- */
  ST.oven = () => {
    const on = S.st.heat.oven;
    const open = S.st.door;
    const ph = phaseOfVessel('oven');
    const baking = on && !open;
    const lit = on || open;                                   // the oven light
    const items = S.at('oven');
    const ready = S.active() === 'oven' && S.serveReady() && !S.st.served;
    const bulb = (x, y) => `<circle cx="${x}" cy="${y}" r="${lit ? 9 : 0}" fill="#fff3a8" opacity=".55"/><circle cx="${x}" cy="${y}" r="4.5" fill="${lit ? '#fff3a8' : '#8a8a90'}" ${O2}/>`;
    const panel = `<rect x="8" y="8" width="284" height="236" rx="20" fill="${P.butter}" ${O}/>` +
      `<rect x="20" y="16" width="260" height="40" rx="12" fill="#fbe08a" ${O2}/>` +
      `<circle cx="44" cy="36" r="7" fill="${baking ? '#ff6a3c' : '#e8dcc6'}" ${O2}/>` +
      `<text x="140" y="43" class="oven-temp" text-anchor="middle">${S.st.served ? 'oven' : baking ? WC.PHASE_WORD[ph === 'raw' ? 'heating' : ph].toLowerCase() : open ? 'door open' : on ? 'paused' : 'oven'}</text>`;
    let body;
    if (open) {
      body = `<rect x="30" y="66" width="240" height="118" rx="12" fill="${lit ? '#5a4c46' : '#3d3d45'}" ${O2}/>` +
        `<rect x="30" y="66" width="240" height="118" rx="12" fill="url(#ovenlight)"/>` + bulb(48, 82) +
        `<path d="M44 150 L256 150" stroke="#9aa3a8" stroke-width="4"/>` +
        (on ? `<rect x="30" y="66" width="240" height="118" rx="12" fill="url(#ovenglow)" opacity=".45" class="glow"/>` : '') +
        `<g class="tray ${ready ? 'lift' : ''}"><path d="M40 168 L56 186 L244 186 L260 168Z" fill="#9aa3a8" ${O2}/>` + contents('oven', 150, 152, 0.56, 226, 102) + '</g>' +
        `<g class="oven-door open" data-act="door" role="button" aria-label="Close the oven door"><rect x="10" y="196" width="280" height="46" rx="10" fill="#f2c443" ${O}/>` +
        `<rect x="40" y="206" width="220" height="26" rx="8" fill="#5c5650" ${O2}/><rect x="110" y="236" width="80" height="8" rx="4" fill="#fffaf0" ${O2}/>` +
        `<text x="150" y="225" class="door-label" text-anchor="middle">close door</text></g>` + serveTag('oven', 91, 70);
    } else {
      body = `<g class="oven-door ${ready ? 'nudge' : ''}" data-act="door" role="button" aria-label="Open the oven door"><rect x="22" y="64" width="256" height="172" rx="16" fill="#f2c443" ${O}/>` +
        `<rect x="40" y="88" width="220" height="122" rx="12" fill="${baking ? '#5a3524' : lit ? '#5a4c46' : '#3d3d45'}" ${O2}/>` +
        (lit ? `<rect x="40" y="88" width="220" height="122" rx="12" fill="url(#ovenlight)"/>` : '') +
        (baking ? `<rect x="40" y="88" width="220" height="122" rx="12" fill="url(#ovenglow)" class="glow"/>` : '') + bulb(56, 102) +
        `<path d="M52 180 L248 180" stroke="#9aa3a8" stroke-width="4"/><path d="M62 180 L72 192 L228 192 L238 180Z" fill="#9aa3a8" ${O2}/>` +
        `<g clip-path="url(#ovenclip)">${contents('oven', 150, 160, 0.44, 220, 120)}</g>` +
        (baking ? `<g class="heatwave">${[0, 1, 2].map((i) => `<path style="animation-delay:${i * 0.5}s" d="M${100 + i * 50} 136 q-5 -8 0 -16 q5 -8 0 -16" stroke="#ffd08a" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>`).join('')}</g>` : '') +
        `<path d="M70 100 L100 100" stroke="#fff" stroke-width="3" opacity=".3" stroke-linecap="round"/>` +
        `<rect x="100" y="70" width="100" height="10" rx="5" fill="#fffaf0" ${O2}/>` +
        (!items.length && !S.st.served ? `<text x="150" y="156" class="ghost-label light" text-anchor="middle">tap to open</text>` : '') + '</g>' +
        `<defs><clipPath id="ovenclip"><rect x="40" y="88" width="220" height="122" rx="12"/></clipPath></defs>` +
        (baking && (ph === 'over' || ph === 'burnt') ? A.B.smoke(2, 150, 110, ph === 'burnt') : '');
    }
    return U.svg('0 0 300 250', panel + body +
      `<defs><radialGradient id="ovenglow"><stop offset="0" stop-color="#ffb347" stop-opacity=".75"/><stop offset="1" stop-color="#ff6a3c" stop-opacity=".15"/></radialGradient>` +
      `<radialGradient id="ovenlight" cx=".15" cy=".1" r=".9"><stop offset="0" stop-color="#fff3a8" stop-opacity=".35"/><stop offset="1" stop-color="#fff3a8" stop-opacity="0"/></radialGradient></defs>` +
      cue('oven', 150, open ? 64 : 116) + knob('oven', 252, 36, 12), 'st-svg ' + (open ? 'is-open' : ''));
  };

  /* ---------- the serving area: a wooden pass with the plate ---------- */
  ST.serve = () => {
    const ready = S.serveReady() && !S.st.served;
    const plated = S.st.served && R.plated;
    let plate;
    if (plated) {
      const svg = WC.dishSVG(S.st.served.outcome, S.st.served.facts, 'still');
      plate = `<g class="settle" style="transform-origin:200px 70px">${svg.replace('<svg ', '<svg x="104" y="-82" width="192" height="192" ')}</g>`;
    } else {
      plate = `<ellipse cx="200" cy="96" rx="78" ry="12" fill="${INK}" opacity=".12"/>` +
        `<ellipse cx="200" cy="74" rx="84" ry="30" fill="#fffaf0" ${O} class="${ready ? 'plate-ready' : ''}"/><ellipse cx="200" cy="72" rx="60" ry="19" fill="#f6ecd6"/>` +
        `<ellipse cx="200" cy="74" rx="74" ry="25" fill="none" stroke="${ready ? P.coral : '#d9cbb2'}" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>` +
        `<text x="200" y="80" class="serve-label ${ready ? 'ready' : ''}" text-anchor="middle">${S.st.served ? '' : ready ? 'serve here' : 'plate'}</text>`;
    }
    return U.svg('0 0 400 110',
      `<g opacity=".9"><rect x="22" y="46" width="44" height="54" rx="6" fill="#fffaf0" ${O2} transform="rotate(-6 44 73)"/><path d="M32 60 l24 -2 M33 70 l20 -2 M34 80 l22 -2" stroke="${P.coral}" stroke-width="2.5" transform="rotate(-6 44 73)"/></g>` +
      `<g transform="translate(90 64)"><rect x="-3" y="-30" width="6" height="58" rx="3" fill="#cfd8dc" ${O2}/><path d="M-9 -30 l0 -12 M-3 -30 l0 -14 M3 -30 l0 -14 M9 -30 l0 -12" ${O2}/></g>` +
      plate + `<rect id="plate-spot" x="128" y="-46" width="144" height="144" fill="none"/>` +
      `<g transform="translate(330 70)"><ellipse cx="0" cy="22" rx="26" ry="6" fill="${INK}" opacity=".15"/><path d="M-22 18 Q-22 -14 0 -14 Q22 -14 22 18Z" fill="#e6c25a" ${O}/><rect x="-26" y="16" width="52" height="8" rx="4" fill="#c9a24a" ${O2}/><circle cx="0" cy="-18" r="5" fill="#e6c25a" ${O2}/></g>`,
      'st-svg ' + (ready ? 'serveable' : ''));
  };

  function key(name) {
    const st = S.st;
    const itemKey = (loc) => S.at(loc).map((i) => [i.id, i.state, i.rim, i.prog, i.premixed, i.stir >= 1, WC.phaseOf(i.cookT)].join('.')).join('|');
    switch (name) {
      case 'cabinet': return st.items.map((i) => i.id + S.movable(i)).join() + S.count() + R.cat;
      case 'counter': return itemKey('counter') + R.sel + S.count() + st.items.map((i) => i.loc).join();
      case 'board': return itemKey('board');
      case 'pot': case 'oven':
        return vkey(name) + st.heat[name] + (st.vt[name] > 1) + Math.round(WC.dial(maxT(name)) * 24) + (name === 'oven' ? st.door : '') +
          S.serveReady() + !!st.served + R.sel + st.mixed[name] + S.cooking(name) + Object.keys(R.justAdded).length;
      case 'serve': return String(S.serveReady()) + !!st.served + R.plated;
    }
    return Math.random();
  }
  /* what the food looks like (a change here cross-fades instead of popping) */
  const vkey = (name) => S.at(name).map((i) => [i.id, i.state, i.rim, i.premixed, i.stir >= 1, WC.phaseOf(i.cookT)].join('.')).join('|') +
    Math.round(U.clamp(maxT(name) / WC.PHASE_T.over, 0, 1) * 6) + !!S.st.served;

  R.all = (force) => {
    Object.keys(ST).forEach((name) => {
      const el = document.getElementById('st-' + name);
      if (!el) return;
      const k = key(name);
      if (!force && R.keys[name] === k) return;
      R.keys[name] = k;
      const box = el.querySelector('.art') || el;
      if (name === 'cabinet') {   // keep the shelf scroll position
        const sh = box.querySelector('.shelf');
        const x = sh ? sh.scrollLeft : 0;
        box.innerHTML = ST[name]();
        const sh2 = box.querySelector('.shelf');
        if (sh2) sh2.scrollLeft = x;
        return;
      }
      if (name === 'pot' || name === 'oven') {
        const vk = vkey(name);
        const old = box.querySelector(':scope > svg:not(.xfade)');
        const fade = !force && old && R.vkeys[name] !== undefined && R.vkeys[name] !== vk && !Object.keys(R.justAdded).length;
        R.vkeys[name] = vk;
        box.innerHTML = ST[name]();
        if (fade) { old.classList.add('xfade'); box.appendChild(old); setTimeout(() => old.remove(), 650); }
        return;
      }
      box.innerHTML = ST[name]();
    });
    const a = S.active();
    document.body.classList.toggle('has-active', !!a);
    WC.VESSELS.forEach((v) => {
      const el = document.getElementById('st-' + v);
      el.classList.toggle('locked', !!a && a !== v);
      el.classList.toggle('hot', S.cooking(v));
      el.classList.toggle('chosen', a === v);
    });
    const undo = document.getElementById('btn-undo');
    if (undo) undo.disabled = !S.canUndo();
    // forget drop-in animations once they have played
    const now = performance.now();
    Object.keys(R.justAdded).forEach((u) => { if (now - R.justAdded[u].t > 1000 + R.justAdded[u].delay) delete R.justAdded[u]; });
  };

  const MQ = '(max-width: 899px) and (orientation: portrait), (max-width: 639px)';
  R.compact = () => !!(window.matchMedia && window.matchMedia(MQ).matches);
  window.addEventListener('resize', () => R.all(true));
  R.put = put;
  WC.Render = R;
})(window.WC);
