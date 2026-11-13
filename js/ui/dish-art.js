/* Plated dish illustrations (200×200). Each authored outcome has its own composition,
   and the drawing adapts to what was actually used (extra ingredients, doneness). */
(function (WC) {
  'use strict';
  const U = WC.U, P = U.PAL, INK = U.INK, A = WC.Art, B = WC.Art.B, tn = U.tone;
  const O = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const O2 = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;

  const put = (inner, cx, cy, s, rot = 0, cls = '') =>
    `<g class="${cls}" transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s}) translate(-50 -50)">${inner}</g>`;
  const fake = (f, id) => {
    const i = f.ing[id];
    return { id, uid: 'd' + id, state: i.state, stir: i.stir, premixed: i.premixed, mixedWith: i.mixedWith, hotAdd: i.hotAdd, cookT: i.cookT, prog: 0 };
  };
  const cooked = (f, id, where) => A.inside(fake(f, id), { where: where || f.where, phase: f.ing[id].phase === 'raw' ? f.P : f.ing[id].phase });
  const ph = (f) => (f.P === 'over' ? 'heating' : 'raw');   // overcooked dishes get a touch darker

  /* ---------- props ---------- */
  const D = {};
  D.shadow = (cx = 100, cy = 160, rx = 78, ry = 13) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${INK}" opacity=".13"/>`;
  D.plate = (rim = P.turq) => D.shadow() +
    `<ellipse cx="100" cy="132" rx="86" ry="46" fill="#fffaf0" ${O}/><ellipse cx="100" cy="130" rx="62" ry="31" fill="#f6ecd6"/>` +
    `<ellipse cx="100" cy="132" rx="76" ry="39" fill="none" stroke="${rim}" stroke-width="3.5" stroke-dasharray="1 9" stroke-linecap="round"/>`;
  D.bowl = (soup, rim = P.turq) => D.shadow(100, 170, 64, 10) +
    `<path d="M28 104 Q32 168 100 168 Q168 168 172 104Z" fill="${rim}" ${O}/><path d="M40 128 Q100 146 160 128" fill="none" stroke="#fff" stroke-width="4" opacity=".35"/>` +
    `<ellipse cx="100" cy="104" rx="72" ry="22" fill="#fffaf0" ${O}/><ellipse cx="100" cy="105" rx="62" ry="16" fill="${soup}" ${O2}/>`;
  D.mug = (drink) => D.shadow(96, 172, 52, 9) +
    `<path d="M140 100 q30 2 28 28 q-2 24 -30 22" fill="none" stroke="${INK}" stroke-width="12"/><path d="M140 100 q30 2 28 28 q-2 24 -30 22" fill="none" stroke="${P.coral}" stroke-width="6"/>` +
    `<path d="M48 82 L52 160 Q96 176 140 160 L144 82Z" fill="${P.coral}" ${O}/><ellipse cx="96" cy="82" rx="48" ry="13" fill="#fffaf0" ${O}/><ellipse cx="96" cy="83" rx="41" ry="9" fill="${drink}"/>` +
    `<path d="M66 116 q30 10 60 0" stroke="${P.butter}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  D.glass = (drink) => D.shadow(100, 176, 40, 8) +
    `<path d="M66 60 L74 168 Q100 176 126 168 L134 60Z" fill="#ffffff" fill-opacity=".55" ${O}/><path d="M69 82 L75 166 Q100 173 125 166 L131 82Z" fill="${drink}"/>` +
    `<ellipse cx="100" cy="82" rx="31" ry="7" fill="${U.mix(drink, '#ffffff', 0.3)}" ${O2}/><path d="M112 82 L130 26 L142 26" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
    `<path d="M112 82 L130 26 L142 26" fill="none" stroke="${P.turq}" stroke-width="4" stroke-linecap="round"/>`;
  D.ramekin = (y = 120, c = P.coral) => D.shadow(100, 168, 52, 9) +
    `<path d="M50 ${y} L56 162 Q100 172 144 162 L150 ${y}Z" fill="${c}" ${O}/><path d="M56 ${y + 12} L144 ${y + 12} M57 ${y + 26} L143 ${y + 26}" stroke="#fff" stroke-width="3" opacity=".4"/>`;
  D.skillet = (fill) => D.shadow(96, 166, 84, 12) +
    `<path d="M160 120 L196 108" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M160 120 L196 108" stroke="#4a4a52" stroke-width="10" stroke-linecap="round"/>` +
    `<ellipse cx="94" cy="128" rx="80" ry="40" fill="#3d3d45" ${O}/><ellipse cx="94" cy="124" rx="68" ry="31" fill="${fill}" ${O2}/>`;
  D.board = () => D.shadow(100, 166, 86, 11) +
    `<path d="M14 120 Q14 104 34 104 L166 104 Q186 104 186 120 L186 146 Q186 160 166 160 L34 160 Q14 160 14 146Z" fill="#d9a066" ${O}/>` +
    `<path d="M30 124 L170 124 M36 142 L164 142" stroke="#b98048" stroke-width="2.5"/><circle cx="176" cy="114" r="4" fill="#f6ecd6" ${O2}/>`;
  D.dish = (fill) => D.shadow(100, 168, 84, 11) +
    `<path d="M16 106 L24 156 Q100 170 176 156 L184 106Z" fill="${P.turq}" ${O}/><ellipse cx="100" cy="106" rx="84" ry="18" fill="#fffaf0" ${O}/><ellipse cx="100" cy="107" rx="74" ry="12" fill="${fill}" ${O2}/>`;
  D.jar = (fill) => D.shadow(100, 172, 46, 9) +
    `<rect x="62" y="56" width="76" height="114" rx="16" fill="${fill}" ${O}/><rect x="56" y="42" width="88" height="22" rx="6" fill="${P.coral}" ${O}/>` +
    `<path d="M56 50 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>` +
    `<rect x="72" y="96" width="56" height="34" rx="6" fill="#fffaf0" ${O2}/><path d="M80 112 q10 -10 20 0 t20 0" stroke="${P.coral}" stroke-width="3" fill="none"/><path d="M70 70 L70 150" stroke="#fff" stroke-width="5" opacity=".35" stroke-linecap="round"/>`;
  D.steam = (x = 100, y = 70, n = 3) => {
    let s = '';
    for (let i = 0; i < n; i++) s += `<path class="steam" style="animation-delay:${i * 0.45}s" d="M${x - 18 + i * 18} ${y} q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#c9b9a6" stroke-width="4" stroke-linecap="round"/>`;
    return s;
  };
  D.leaf = (x, y, r = 0, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0 Q6 -9 14 -2 Q6 6 0 0Z" fill="${P.sage}" ${O2}/></g>`;
  D.herbs = (seed, n, cx, cy, w, h) => { const r = U.rng(seed); let s = ''; for (let i = 0; i < n; i++) s += D.leaf(cx - w + r() * w * 2, cy - h + r() * h * 2, r() * 360, 0.7 + r() * 0.4); return s; };
  D.eyes = (x, y, gap = 22, r = 9, cls = 'blink') =>
    `<g class="${cls}" style="transform-origin:${x}px ${y}px">` +
    [-1, 1].map((k) => `<circle cx="${x + k * gap / 2}" cy="${y}" r="${r}" fill="#fff" ${O2}/><circle cx="${x + k * gap / 2 + 2}" cy="${y + 1}" r="${r * 0.45}" fill="${INK}"/><circle cx="${x + k * gap / 2 + 3.5}" cy="${y - 1}" r="${r * 0.15}" fill="#fff"/>`).join('') + '</g>';
  D.friedEgg = (x, y, s, edge, yolkC = '#f7a823', seed = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    (edge ? `<path d="M-40 4 C-46 -22 -14 -34 6 -30 C30 -34 48 -14 42 8 C38 28 10 34 -8 30 C-30 32 -38 22 -40 4Z" fill="${edge}" ${O2}/>` : '') +
    `<path d="M-34 4 C-36 -16 -12 -26 4 -23 C24 -26 40 -12 35 6 C32 22 10 27 -6 24 C-24 26 -32 18 -34 4Z" fill="#fffdf6" ${O}/>` +
    `<circle cx="0" cy="0" r="12" fill="${yolkC}" ${O}/><circle cx="-4" cy="-4" r="3.5" fill="#ffe7a0"/></g>`;
  D.toast = (x, y, s, crumb = '#f0cf86', crust = '#c98a45', rot = 0) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-30 -8 C-40 -28 -22 -42 0 -40 C22 -42 40 -28 30 -8 L28 34 L-28 34Z" fill="${crust}" ${O}/>` +
    `<path d="M-22 -8 C-30 -22 -16 -32 0 -31 C16 -32 30 -22 22 -8 L20 26 L-20 26Z" fill="${crumb}"/></g>`;
  D.pancake = (x, y, rx, ry, c) => `<ellipse cx="${x}" cy="${y + 5}" rx="${rx}" ry="${ry}" fill="${U.mix(c, '#8a4a1c', 0.25)}" ${O}/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" ${O}/>`;
  D.omelette = (c, fillHtml = '') =>
    `${fillHtml}<path d="M38 130 C38 92 162 92 162 130 Q100 146 38 130Z" fill="${c}" ${O}/><path d="M50 124 Q100 136 150 124" fill="none" stroke="${U.mix(c, '#ffffff', 0.4)}" stroke-width="3"/>` +
    `<circle cx="78" cy="114" r="3" fill="${U.mix(c, '#c98a45', 0.4)}"/><circle cx="118" cy="108" r="2.5" fill="${U.mix(c, '#c98a45', 0.4)}"/><circle cx="134" cy="120" r="2" fill="${U.mix(c, '#c98a45', 0.4)}"/>`;
  D.strawberry = (x, y, s, rot = 0) => put(A.token('strawberry', 'whole'), x, y, s, rot);
  D.mash = (x, y, s, c = '#f6e3a8') => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-46 22 C-46 -6 -28 -18 -14 -16 C-10 -34 14 -34 16 -16 C32 -18 46 -4 46 22Z" fill="${c}" ${O}/>` +
    `<path d="M-26 4 q10 -10 20 0 q10 -10 20 0" fill="none" stroke="#fff6d2" stroke-width="3.5"/><path d="M-30 14 q14 -6 28 0 q14 -6 28 0" fill="none" stroke="#e8cf8a" stroke-width="2.5"/></g>`;
  D.drizzle = (x, y, w, c = P.choco) => `<path d="M${x - w} ${y} q${w / 4} 10 ${w / 2} 0 t${w / 2} 0 t${w / 2} 0 t${w / 2} 0" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M${x - w} ${y} q${w / 4} 10 ${w / 2} 0 t${w / 2} 0 t${w / 2} 0 t${w / 2} 0" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>`;

  /* small cooked side bits for any ingredient the main composition doesn't feature */
  const SPOTS = [[46, 136], [154, 136], [100, 160], [70, 156], [132, 156]];
  /* centered row of the actual ingredients, sized by how many there are */
  D.row = (f, cy, where, phaseFn, rotStep = 0) => {
    const n = f.n, sc = n === 1 ? 0.95 : n === 2 ? 0.66 : n === 3 ? 0.52 : 0.44, step = n === 1 ? 0 : Math.min(48, 124 / (n - 1));
    return f.ids.map((id, k) => put(A.inside(fake(f, id), { where, phase: phaseFn(id) }), 100 + (k - (n - 1) / 2) * step, cy + (k % 2 ? 4 : -2), sc, rotStep * (k % 2 ? 1 : -1))).join('');
  };
  D.sides = (f, used, where) => f.ids.filter((id) => !used.includes(id)).map((id, k) => {
    const [x, y] = SPOTS[k % SPOTS.length];
    return put(cooked(f, id, where), x, y, 0.36);
  }).join('');

  /* V2 helpers */
  D.kernel = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-7 2 q-3 -8 4 -9 q2 -6 8 -2 q7 -1 5 6 q4 6 -3 8 q-6 4 -10 0 q-6 0 -4 -3Z" fill="#fff8e0" ${O2}/><circle cx="0" cy="1" r="2" fill="#f6cf3a"/></g>`;
  D.grains = (seed, n, cx, cy, w, h) => { const r = U.rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = cx - w + r() * w * 2, y = cy - h + r() * h * 2; s += `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="1.9" fill="#fffdf6" stroke="#cfc2a4" stroke-width="1" transform="rotate(${r() * 180} ${x} ${y})"/>`; } return s; };
  D.cup = (fill) => D.shadow(100, 170, 44, 8) + `<path d="M58 88 Q60 150 100 160 Q140 150 142 88Z" fill="#ffffff" fill-opacity=".6" ${O}/><path d="M62 96 Q66 146 100 154 Q134 146 138 96Z" fill="${fill}"/>` +
    `<ellipse cx="100" cy="92" rx="38" ry="9" fill="${U.mix(fill, '#ffffff', 0.15)}" ${O2}/><path d="M92 160 L92 172 M108 160 L108 172" stroke="${INK}" stroke-width="3"/><ellipse cx="100" cy="174" rx="22" ry="5" fill="#fff" ${O2}/>`;
  D.cake = (top, body, top2, base) => D.shadow(100, 160, 70, 10) +
    `<path d="M52 ${top + 20} L52 132 Q100 148 148 132 L148 ${top + 20}Z" fill="${body}" ${O}/><ellipse cx="100" cy="${top + 20}" rx="48" ry="14" fill="${top2}" ${O}/>` +
    `<path d="M52 ${top + 46} Q100 ${top + 62} 148 ${top + 46}" stroke="${base}" stroke-width="4" fill="none"/><path d="M60 ${top + 26} q6 14 2 22 M140 ${top + 26} q-4 14 0 20" stroke="${top2}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  D.pizzaBase = (sauce, cheese) => D.board() + `<circle cx="100" cy="120" r="56" fill="#e2a85a" ${O}/><circle cx="100" cy="120" r="46" fill="${sauce}"/>` +
    (cheese ? `<path d="M64 112 C76 94 120 92 136 110 C142 128 128 146 104 148 C80 148 60 134 64 112Z" fill="#f6d36a"/><circle cx="84" cy="118" r="4" fill="#e2a43a"/><circle cx="118" cy="132" r="3" fill="#e2a43a"/>` : '') +
    [0, 60, 120].map((a) => `<path d="M${100 - Math.cos(a * Math.PI / 180) * 56} ${120 - Math.sin(a * Math.PI / 180) * 56} L${100 + Math.cos(a * Math.PI / 180) * 56} ${120 + Math.sin(a * Math.PI / 180) * 56}" stroke="${INK}" stroke-width="1.5" opacity=".5"/>`).join('');
  D.toppings = (f, ids) => { const r = U.rng('tp' + f.ids.join()); let s = ''; ids.filter((i) => f.ing[i]).forEach((id) => { for (let j = 0; j < 3; j++) { const a = r() * Math.PI * 2, d = 10 + r() * 28; s += put(cooked(f, id), 100 + Math.cos(a) * d, 120 + Math.sin(a) * d * 0.9, 0.2, r() * 360); } }); return s; };

  const toppings = (f, ids, cx = 100, cy = 112) => {
    let s = ''; const r = U.rng('top' + ids.join());
    ids.forEach((id, k) => {
      if (!f.ing[id]) return;
      for (let j = 0; j < 3; j++) s += put(cooked(f, id), cx - 36 + r() * 72, cy - 10 + r() * 16, 0.26, r() * 360);
    });
    return s;
  };

  /* ---------- the dishes ---------- */
  const ART = {
    phoenix: (f) => D.plate(P.coral) +
      `<path d="M58 132 C52 112 76 100 100 104 C126 100 150 112 142 132 C136 148 70 150 58 132Z" fill="#2b1a12" ${O}/>` +
      `<path d="M74 126 l10 -6 l6 8 l12 -10 M112 130 l10 -8 l8 6" fill="none" stroke="#ff8a3c" stroke-width="2.5" stroke-linecap="round"/>` +
      `<g class="phoenix-bird"><path d="M100 86 C90 70 70 64 52 70 C70 74 80 82 86 92 C72 88 60 92 54 100 C72 96 86 98 96 104 Z" fill="#6b5a52" ${O2}/>` +
      `<path d="M100 86 C110 70 130 64 148 70 C130 74 120 82 114 92 C128 88 140 92 146 100 C128 96 114 98 104 104 Z" fill="#6b5a52" ${O2}/>` +
      `<circle cx="100" cy="88" r="9" fill="#4a3a33" ${O2}/><circle cx="103" cy="86" r="2" fill="#ffb03c"/><path d="M108 88 l8 2 l-8 3Z" fill="${P.butter}" ${O2}/></g>` +
      `<circle class="ember" cx="80" cy="110" r="2" fill="#ff8a3c"/><circle class="ember" style="animation-delay:.6s" cx="120" cy="108" r="2.4" fill="#ffb03c"/><circle class="ember" style="animation-delay:1.1s" cx="100" cy="112" r="1.8" fill="#ff6a3c"/>`,

    tower: (f) => {
      const order = f.ids.slice().sort((a, b) => f.ing[a].addedVT - f.ing[b].addedVT);
      let s = D.plate(P.butter), y = 132;
      order.forEach((id, k) => {
        const c = tn(WC.INGREDIENTS[id].color === '#fffaf0' ? '#f4ead6' : WC.INGREDIENTS[id].color, k === 0 ? 'ready' : 'heating');
        const w = 58 - k * 9, h = 18, sk = (k % 2 ? 1 : -1) * (4 + k * 2);
        s += `<g class="layer" style="animation-delay:${0.15 + k * 0.25}s"><path d="M${100 - w + sk} ${y} L${100 + w + sk} ${y} L${100 + w - 4 + sk * 1.4} ${y - h} L${100 - w + 4 + sk * 1.4} ${y - h}Z" fill="${c}" ${O}/>` +
          `<path d="M${100 - w + 10 + sk} ${y - 6} L${100 + w - 10 + sk} ${y - 6}" stroke="#fff" stroke-width="2.5" opacity=".45"/></g>`;
        y -= h;
      });
      return s + `<g class="layer" style="animation-delay:1.2s"><path d="M${104} ${y} L104 ${y - 30}" ${O}/><path d="M104 ${y - 30} L126 ${y - 24} L104 ${y - 18}Z" fill="${P.coral}" ${O2}/></g>`;
    },

    stew: (f) => {
      const c = U.mix(U.mixMany(f.ids.map((i) => WC.INGREDIENTS[i].color)), '#6b3f5a', 0.45);
      return D.bowl(c, P.sage) + B.bubbles('stew', 9, 100, 104, 50, 10, '#e9c7da') +
        put(cooked(f, f.ids[0], 'pot'), 64, 102, 0.3, 20) + put(cooked(f, f.ids[1], 'pot'), 140, 104, 0.28, -30) +
        D.eyes(102, 96, 24, 8) + `<path class="steam" d="M70 76 q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#b58ac0" stroke-width="4" stroke-linecap="round"/><path class="steam" style="animation-delay:.6s" d="M132 76 q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#b58ac0" stroke-width="4" stroke-linecap="round"/>`;
    },

    creature: () => D.plate(P.coral) +
      `<g class="wig">${B.noodle('cr1', 7, '#7b4a33', 100, 126, 52, 14)}</g>` +
      `<path d="M84 104 C80 84 86 70 90 62" ${O} fill="none"/><path d="M84 104 C80 84 86 70 90 62" stroke="#7b4a33" stroke-width="4" fill="none"/>` +
      `<path d="M116 104 C122 84 116 70 112 62" ${O} fill="none"/><path d="M116 104 C122 84 116 70 112 62" stroke="#7b4a33" stroke-width="4" fill="none"/>` +
      D.eyes(101, 60, 24, 10) + `<path d="M90 120 q10 10 22 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,

    mole: (f) => D.plate(P.coral) +
      `<path d="M50 142 L82 84 L118 84 L150 142 Q100 154 50 142Z" fill="#b8392a" ${O}/>` +
      `<ellipse cx="100" cy="84" rx="18" ry="5" fill="#4b2a1c" ${O2}/>` +
      `<path d="M86 86 C84 100 92 104 88 118 M110 86 C114 98 106 106 112 120" stroke="#5a3524" stroke-width="7" stroke-linecap="round" fill="none"/>` +
      `<g class="erupt">${[[-20, 0], [-8, 0.2], [6, 0.4], [18, 0.1], [0, 0.6]].map(([dx, d], i) => `<circle style="animation-delay:${d}s;--dx:${dx * 2}px" cx="${100 + dx * 0.3}" cy="80" r="${5 - i * 0.5}" fill="${i % 2 ? '#5a3524' : '#d8452f'}" ${O2}/>`).join('')}</g>` +
      (f.has('onion') ? put(cooked(f, 'onion'), 150, 140, 0.3) : ''),

    cheese_monster: () => D.plate(P.butter) +
      `<path d="M60 136 q20 -8 40 -2 q20 4 46 -6" fill="none" stroke="#f6cf5a" stroke-width="6" stroke-linecap="round" opacity=".8"/>` +
      `<g class="runner"><path d="M120 128 l-6 18 M134 128 l4 18 M150 126 l8 16" ${O} fill="none"/>` +
      `<path d="M106 128 C100 96 124 78 146 84 C170 88 176 112 166 128 C160 136 116 138 106 128Z" fill="#f6cf5a" ${O}/>` +
      `<path d="M112 128 q4 10 8 0 q4 10 8 0" fill="#f6cf5a" ${O2}/><circle cx="128" cy="112" r="4" fill="#e2a43a"/><circle cx="154" cy="120" r="3" fill="#e2a43a"/>` +
      D.eyes(146, 100, 18, 7, '') + `<path d="M140 116 q6 5 12 0" fill="none" ${O2}/></g>`,

    giant_pancake: () => `<g class="growee">` + D.plate(P.coral) +
      D.pancake(100, 104, 96, 46, '#f0c36a') + `<path d="M24 100 q30 -26 76 -28 q48 2 76 28" fill="none" stroke="#fff3c8" stroke-width="4" opacity=".7"/>` +
      D.strawberry(70, 92, 0.36, -10) + D.strawberry(104, 82, 0.4, 8) + D.strawberry(136, 94, 0.36, 18) + D.strawberry(96, 108, 0.32, -6) + '</g>',

    onion_blossom: (f) => {
      let s = D.plate(P.butter);
      for (let i = 0; i < 10; i++) {
        const a = -170 + i * 18;
        s += `<g class="petal" style="animation-delay:${i * 0.06}s;transform-origin:100px 118px"><path transform="rotate(${a + 90} 100 118)" d="M100 118 C90 100 92 80 100 70 C108 80 110 100 100 118Z" fill="${tn('#d9965a', ph(f))}" ${O2}/></g>`;
      }
      return s + `<circle cx="100" cy="116" r="15" fill="#b65a7f" ${O}/><circle cx="100" cy="116" r="7" fill="#f2b874"/>`;
    },

    souffle: (f) => `<ellipse cx="100" cy="172" rx="40" ry="7" fill="${INK}" opacity=".12"/><g class="floater">` +
      `<path d="M58 106 L62 150 Q100 160 138 150 L142 106Z" fill="#fffaf0" ${O}/><path d="M62 118 L138 118 M62 132 L138 132" stroke="${P.turq}" stroke-width="3" opacity=".7"/>` +
      `<path d="M52 108 C48 60 152 60 148 108 Q100 118 52 108Z" fill="#f2c45a" ${O}/><path d="M62 84 q16 -12 32 0 q16 12 32 0" stroke="#ffe39a" stroke-width="3.5" fill="none"/>` +
      (f.has('cheese') ? `<circle cx="80" cy="92" r="3" fill="#e2a43a"/><circle cx="118" cy="86" r="3" fill="#e2a43a"/>` : '') + '</g>',

    lava: () => D.plate(P.pink) +
      `<path d="M66 132 L68 96 Q100 84 132 96 L134 132 Q100 144 66 132Z" fill="#5a3524" ${O}/><ellipse cx="100" cy="96" rx="32" ry="10" fill="#7b4a33" ${O2}/>` +
      `<path d="M100 120 C112 124 126 130 150 140 C158 146 140 150 120 148 C104 146 98 136 100 120Z" fill="#3a1d12" ${O2}/>` +
      `<circle cx="84" cy="94" r="1.6" fill="#fff"/><circle cx="100" cy="92" r="1.6" fill="#fff"/><circle cx="114" cy="96" r="1.6" fill="#fff"/>` + D.steam(100, 76, 2),

    brownie_brick: () => D.plate(P.sage) +
      `<path d="M58 134 L58 98 L130 90 L146 100 L146 132 L74 142Z" fill="#3e2316" ${O}/><path d="M58 98 L74 106 L146 100 M74 106 L74 142" fill="none" ${O}/>` +
      `<path d="M86 116 l8 6 l-4 8 M118 112 l-6 8 l8 6" fill="none" stroke="#7b4a33" stroke-width="2.5"/>` +
      `<path class="thud" d="M40 150 l-10 4 M44 158 l-12 0 M160 150 l10 4 M156 158 l12 0" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,

    shakshuka: (f) => D.skillet(tn('#c8382a', ph(f))) +
      B.tomChunk(60, 116, 0.7, 10, '#d8452f') + B.tomChunk(130, 132, 0.6, 60, '#d8452f') + B.tomChunk(116, 108, 0.55, 120, '#d8452f') +
      D.friedEgg(76, 128, 0.62) + D.friedEgg(118, 120, 0.58) +
      (f.has('onion') ? put(cooked(f, 'onion'), 140, 112, 0.3) : '') + D.herbs('shk', 5, 96, 124, 50, 18) +
      D.sides(f, ['tomato', 'egg', 'onion'], 'pot').replace(/translate\((\d+) (\d+)\)/g, (m, x, y) => `translate(${x} ${+y - 6})`),

    strawberry_cheese_toast: (f) => D.plate(P.pink) + D.toast(100, 118, 1.3) +
      `<path d="M74 104 C80 96 120 96 128 104 C132 116 128 128 122 136 Q100 140 78 136 C72 126 70 114 74 104Z" fill="#f6cf5a" ${O2}/>` +
      B.berrySlice(88, 112, 0.8, -10) + B.berrySlice(112, 108, 0.8, 15) + B.berrySlice(102, 128, 0.75, 0) + D.sides(f, ['bread', 'cheese', 'strawberry']),

    pizza_toast: (f) => D.plate(P.coral) + D.toast(100, 118, 1.3) + `<path d="M74 104 C80 98 120 98 128 104 L124 136 Q100 140 78 136Z" fill="#d23c2c" ${O2}/>` +
      `<path d="M78 108 C86 102 116 102 124 110 C126 120 120 132 104 134 C90 136 78 128 78 108Z" fill="#f6cf5a"/>` +
      [[92, 114], [112, 112], [102, 126]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#e9533f" ${O2}/><circle cx="${x}" cy="${y}" r="3" fill="#f7907a"/>`).join('') + D.leaf(118, 124, 30) + D.sides(f, ['bread', 'cheese', 'tomato']),

    cheese_toast: (f) => D.plate(P.butter) + D.toast(100, 118, 1.3) +
      `<path d="M72 106 C80 96 120 96 130 106 C132 118 128 130 122 138 Q100 142 78 138 C72 128 70 116 72 106Z" fill="#f6cf5a" ${O2}/>` +
      [[86, 112, 5], [110, 108, 4], [104, 126, 6], [120, 124, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#df9a36"/>`).join('') + D.sides(f, ['bread', 'cheese']),

    choc_bread: (f) => D.plate(P.pink) + D.toast(100, 118, 1.3, '#f2d08c') +
      `<path d="M78 104 C88 112 82 122 92 130 C100 136 108 120 116 128 C122 134 126 120 124 106" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M78 104 C88 112 82 122 92 130 C100 136 108 120 116 128 C122 134 126 120 124 106" fill="none" stroke="#5a3524" stroke-width="7" stroke-linecap="round"/>` + D.sides(f, ['bread', 'chocolate']),

    ganache: (f) => D.bowl('#4a2a1c', P.pink) + `<path d="M60 104 q20 -10 40 0 t40 0" fill="none" stroke="#7b4a33" stroke-width="4"/>` +
      `<path d="M124 100 L168 52" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M124 100 L168 52" stroke="#d9a066" stroke-width="5" stroke-linecap="round"/>` +
      `<ellipse cx="80" cy="100" rx="12" ry="3" fill="#fff" opacity=".35"/>`,

    hot_chocolate: () => D.mug('#6b3f28') + D.steam(96, 64, 3) + `<circle cx="84" cy="80" r="5" fill="#fff" ${O2}/><circle cx="106" cy="82" r="4" fill="#fff" ${O2}/>`,

    jam: () => D.jar('#c4243c') + `<circle cx="84" cy="76" r="4" fill="#ff8aa0" opacity=".7"/>` +
      `<path d="M150 70 L178 150" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M150 70 L178 150" stroke="#d9a066" stroke-width="5" stroke-linecap="round"/><ellipse cx="148" cy="64" rx="10" ry="7" fill="#c4243c" ${O2}/>`,

    mash: (f) => D.plate(P.sage) + D.mash(100, 118, 1.4, f.has('cheese') ? '#f6dc8a' : '#f6e6b4') +
      `<path d="M90 86 l16 -5 l12 5 l-16 5Z" fill="#fff1a8" ${O2}/>` + D.leaf(122, 92, -20, 1.2) + D.sides(f, ['potato', 'milk', 'cheese']),

    egg_soft: () => D.shadow(100, 170, 40, 8) + `<path d="M70 150 L76 132 L124 132 L130 150 Q100 162 70 150Z" fill="${P.turq}" ${O}/>` +
      `<path d="M74 132 C66 92 88 68 100 68 C112 68 134 92 126 132Z" fill="#fff4e0" ${O}/><path d="M72 104 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l6 4" fill="#ffffff" ${O2}/>` +
      `<ellipse cx="100" cy="106" rx="18" ry="5" fill="#f7a823" ${O2}/><path d="M92 108 q-2 12 2 18 q4 -8 0 -18Z" fill="#f7a823" ${O2}/>` +
      `<path d="M140 156 L176 132" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M140 156 L176 132" stroke="#e0e0e0" stroke-width="5" stroke-linecap="round"/>`,

    egg_hard: (f) => D.plate(P.turq) + [[78, 122], [124, 122]].map(([x, y]) =>
      `<ellipse cx="${x}" cy="${y}" rx="22" ry="16" fill="#fffaf0" ${O}/><circle cx="${x}" cy="${y - 1}" r="9" fill="${f.I('egg').cookT > 8 ? '#e4c24a' : '#f2b72e'}" ${O2}/>`).join('') +
      `<circle cx="78" cy="120" r="1" fill="${INK}"/><circle cx="124" cy="120" r="1" fill="${INK}"/>` + D.herbs('eh', 3, 100, 140, 30, 4),

    poached: (f) => D.plate(P.sage) + `<path d="M64 130 C54 112 76 96 92 100 C106 88 136 98 140 116 C146 132 126 142 104 140 C86 144 70 140 64 130Z" fill="#fffdf6" ${O}/>` +
      `<path d="M96 116 q8 -10 18 0 q-2 8 -10 8 q-6 0 -8 -8Z" fill="#f7b33a" ${O2}/>` + D.herbs('po', 3, 100, 140, 34, 4) + D.sides(f, ['egg']),

    egg_drop: (f) => D.bowl('#f3e6b8', P.coral) + B.noodle('ed', 4, '#f6d36a', 100, 104, 46, 6) +
      (f.has('cheese') ? B.shreds('edc', 6, '#f6cf5a', 100, 104, 30) : '') + D.leaf(130, 100, 20) + D.leaf(72, 102, 160) + D.steam(100, 70, 3),

    mac: () => {
      const r = U.rng('mac'); let s = D.bowl('#f4c542', P.turq);
      for (let i = 0; i < 14; i++) {
        const x = 50 + r() * 100, y = 96 + r() * 16, a = r() * 360;
        s += `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-7 0 A7 7 0 0 1 7 0" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-7 0 A7 7 0 0 1 7 0" fill="none" stroke="#f9da7a" stroke-width="4.5" stroke-linecap="round"/></g>`;
      }
      return s + D.steam(100, 70, 2);
    },

    pomodoro: (f) => D.plate(P.coral) + B.noodle('pom', 7, '#f6dc96', 100, 124, 46, 12) +
      `<path d="M78 112 C82 102 118 100 124 110 C128 120 110 126 100 124 C88 126 76 122 78 112Z" fill="#d23c2c" ${O2}/>` +
      B.tomChunk(94, 110, 0.5, 20, '#e9533f') + B.tomChunk(112, 114, 0.45, 80, '#e9533f') +
      (f.has('cheese') ? B.shreds('parm', 8, '#fff3c0', 100, 108, 18) : '') + D.leaf(118, 104, -30, 1.2) + D.leaf(108, 100, 200, 1),

    cheese_rope: (f) => D.plate(P.butter) + B.noodle('cr', 6, '#f6dc96', 100, 126, 46, 12) +
      `<g class="wig"><path d="M48 120 C70 90 90 150 110 110 C126 80 150 140 158 112" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
      `<path d="M48 120 C70 90 90 150 110 110 C126 80 150 140 158 112" fill="none" stroke="#f6cf5a" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M48 120 C70 90 90 150 110 110 C126 80 150 140 158 112" fill="none" stroke="#fff3c0" stroke-width="2.5" stroke-dasharray="4 8"/></g>` +
      (f.has('tomato') ? `<ellipse cx="100" cy="136" rx="22" ry="6" fill="#d23c2c" ${O2}/>` : ''),

    onion_soup: (f) => D.bowl('#a3622c', P.coral) + `<path d="M74 98 L126 96 L130 110 L72 112Z" fill="#e7b46a" ${O}/>` +
      (f.has('cheese') ? `<path d="M72 98 C84 90 116 88 128 96 C128 104 126 108 120 112 L80 112 C74 108 72 104 72 98Z" fill="#f6cf5a" ${O2}/><circle cx="92" cy="100" r="3" fill="#d98a2a"/><circle cx="112" cy="98" r="2.5" fill="#d98a2a"/>` : '') +
      B.onionBit(56, 106, 0.7, 10, '#e8b06a', '#9a5a2a') + B.onionBit(144, 106, 0.7, -20, '#e8b06a', '#9a5a2a') + D.steam(100, 72, 2),

    tomato_soup: (f) => D.bowl('#d8452f', P.butter) + `<path d="M72 104 q14 -8 28 0 t28 0" fill="none" stroke="#fff3e6" stroke-width="4" stroke-linecap="round"/>` +
      D.leaf(128, 100, 20, 1.2) + (f.has('onion') ? B.onionBit(70, 106, 0.6, 10) : '') + D.steam(100, 70, 3),

    mushroom_soup: () => D.bowl('#d9c09a', P.sage) + B.mushSlice(80, 104, 0.6, '#b98a62') + B.mushSlice(116, 102, 0.55, '#b98a62') + B.mushSlice(132, 108, 0.45, '#b98a62') +
      `<path d="M66 108 q10 -6 20 0" stroke="#fff6e6" stroke-width="3" fill="none"/>` + D.steam(100, 70, 2),

    baked_potato: (f) => D.plate(P.turq) + `<path d="M48 130 C42 100 74 86 100 88 C130 86 160 100 152 130 C146 148 60 150 48 130Z" fill="#a8743c" ${O}/>` +
      `<path d="M70 112 C80 100 120 98 132 110 C126 124 78 126 70 112Z" fill="#fbecc0" ${O2}/>` +
      (f.has('cheese') ? `<path d="M82 108 C92 100 112 100 120 108 C118 116 112 120 110 126 C104 118 90 120 82 108Z" fill="#f6cf5a" ${O2}/>` : `<path d="M92 104 l14 -4 l10 4 l-14 4Z" fill="#fff1a8" ${O2}/>`) +
      D.steam(100, 82, 2) + D.sides(f, ['potato', 'cheese']),

    baked_eggs: (f) => D.dish(tn(f.has('tomato') ? '#d23c2c' : '#f3e6c8', 'raw')) + D.friedEgg(82, 106, 0.5, null, '#f2a628') + D.friedEgg(122, 106, 0.46, null, '#f2a628') +
      (f.has('cheese') ? B.shreds('bec', 6, '#f6cf5a', 100, 104, 30) : '') + D.herbs('be', 3, 100, 104, 50, 4) + D.sides(f, ['egg', 'tomato', 'cheese']),

    lukewarm: (f) => D.plate(P.turq) + `<ellipse cx="100" cy="130" rx="58" ry="22" fill="#e8dfc8" opacity=".9"/>` +
      D.row(f, 118, f.where, (id) => f.ing[id].phase) +
      `<g transform="translate(166 92) rotate(20)"><rect x="-5" y="-30" width="10" height="44" rx="5" fill="#fff" ${O2}/><circle cx="0" cy="18" r="8" fill="#6cc3bf" ${O2}/><rect x="-2" y="0" width="4" height="14" fill="#6cc3bf"/></g>`,

    choc_fruit: (f) => {
      if (!f.has('strawberry')) {
        const piece = f.has('banana') ? A.token('banana', 'sliced') : A.token('apple', 'chopped');
        return D.plate(P.pink) + [[72, 120], [100, 112], [128, 122]].map(([x, y], k) => put(piece, x, y, 0.5, k * 40)).join('') +
          D.drizzle(100, 116, 34, P.choco) + `<path d="M64 132 q36 14 72 0" fill="none" stroke="${P.choco}" stroke-width="6" stroke-linecap="round"/>`;
      }
      return (D.plate(P.pink) + [[70, 122, -20], [100, 116, 0], [130, 124, 22]].map(([x, y, r]) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 26 C-14 18 -20 4 -16 -6 C-12 -14 -4 -14 0 -10 C4 -14 12 -14 16 -6 C20 4 14 18 0 26Z" fill="#e8434f" ${O}/>` +
      `<path d="M-15 2 C-8 8 8 8 15 2 C18 12 10 22 0 26 C-10 22 -18 12 -15 2Z" fill="#5a3524" ${O2}/><path d="M-10 -10 q10 -10 20 0" fill="${P.sageDk}" ${O2}/><path d="M-6 12 l4 2 M4 14 l4 -2" stroke="#fff" stroke-width="2"/></g>`).join('') + D.sides(f, ['chocolate', 'strawberry', 'banana', 'apple']));
    },

    /* ---------- V2 dishes ---------- */
    popcorn: () => D.bowl('#fff3c8', P.coral) + `<g class="erupt">${[[-30, 0], [-12, 0.2], [8, 0.4], [26, 0.1], [0, 0.6], [16, 0.8]].map(([dx, d]) =>
      `<g style="animation-delay:${d}s;--dx:${dx * 2}px">${D.kernel(100 + dx, 80)}</g>`).join('')}</g>` +
      [[64, 98], [82, 92], [100, 96], [118, 92], [136, 98], [74, 104], [94, 104], [114, 104], [128, 104]].map(([x, y]) => D.kernel(x, y)).join(''),

    dough_blob: () => D.plate(P.sage) + `<g class="wig"><path d="M48 136 C40 100 66 72 100 72 C134 72 160 100 152 136 Q100 150 48 136Z" fill="#f1dcae" ${O}/>` +
      `<path d="M70 96 q12 -14 30 -10" stroke="#fff6dc" stroke-width="5" fill="none" stroke-linecap="round"/></g>` + D.eyes(102, 104, 26, 9) +
      `<path d="M90 122 q12 10 24 0" fill="none" ${O2}/>` + D.steam(100, 62, 2),

    broccoli_forest: () => `<g class="growee">` + D.plate(P.sage) +
      [[60, 110, 0.55], [100, 96, 0.75], [140, 112, 0.55], [80, 124, 0.45], [122, 126, 0.45]].map(([x, y, k]) => put(A.token('broccoli', 'whole'), x, y, k)).join('') +
      `<circle cx="140" cy="84" r="5" fill="${P.butter}"/><path d="M70 82 l4 -6 l4 6Z" fill="${P.coral}"/></g>`,

    tomato_egg: (f) => D.bowl(tn('#d24a32', ph(f)), P.butter) +
      B.tomChunk(70, 104, 0.6, 20, '#e9533f') + B.tomChunk(134, 106, 0.55, 80, '#e9533f') +
      `<path d="M80 102 q10 -8 22 -2 q10 6 22 -2 q-4 10 -20 10 q-18 2 -24 -6Z" fill="#f9dc6c" ${O2}/>` +
      (f.has('cheese') ? `<path d="M104 98 q8 -6 18 0" stroke="#f6cf5a" stroke-width="6" stroke-linecap="round" fill="none"/>` : '') +
      (f.has('onion') ? B.onionBit(118, 108, 0.6, 20, '#f2dcb8', '#b07040') : '') + D.herbs('te', 3, 100, 100, 40, 4) + D.steam(100, 70, 2),

    pasta_tomato_mush: (f) => D.plate(P.coral) + B.noodle('ptm', 7, '#f6dc96', 100, 124, 46, 12) +
      `<path d="M74 114 C80 102 120 100 128 112 C130 122 112 128 100 126 C86 128 72 124 74 114Z" fill="#cf3b2b" ${O2}/>` +
      B.mushSlice(88, 112, 0.6, '#c8946a', '#8a5638') + B.mushSlice(114, 108, 0.55, '#c8946a', '#8a5638') +
      (f.has('cheese') ? `<path d="M94 104 q6 10 0 18 M110 104 q-4 12 4 20" stroke="#f6cf5a" stroke-width="5" fill="none" stroke-linecap="round"/>` : '') + D.leaf(124, 102, -20, 1.1),

    chicken_noodle: () => D.bowl('#f0cf7a', P.turq) + B.noodle('cn', 4, '#fbe7a8', 100, 104, 50, 6) +
      [[74, 102], [118, 104], [98, 108]].map(([x, y], k) => `<rect x="${x - 9}" y="${y - 7}" width="18" height="14" rx="5" fill="#e8b48e" ${O2} transform="rotate(${k * 20 - 10} ${x} ${y})"/>`).join('') +
      D.leaf(134, 98, 20) + D.leaf(64, 100, 160) + D.steam(100, 68, 3),

    garlic_pasta: (f) => D.plate(P.butter) + B.noodle('gp', 8, '#f7e2a0', 100, 122, 48, 13) +
      [[84, 110], [108, 104], [120, 120], [92, 126]].map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="5" rx="1.5" fill="#fff6e0" ${O2}/>`).join('') +
      (f.has('butter') ? `<path d="M96 96 l14 -4 l10 4 l-14 4Z" fill="#fff1a8" ${O2}/>` : '') + (f.has('lemon') ? put(A.token('lemon', 'sliced'), 146, 130, 0.35) : '') + D.herbs('gp', 4, 100, 116, 40, 10),

    sweet_pasta: (f) => D.plate(P.pink) + B.noodle('swp', 7, f.has('chocolate') ? '#a8704c' : '#f7b5c2', 100, 124, 46, 12) +
      (f.has('strawberry') ? B.berrySlice(84, 112, 0.7, -20) + B.berrySlice(112, 108, 0.7, 20) : '') +
      (f.has('banana') ? put(A.token('banana', 'sliced'), 104, 112, 0.5) : '') + (f.has('apple') ? put(A.token('apple', 'chopped'), 104, 112, 0.5) : '') +
      (f.any('honey', 'sugar') ? D.drizzle(100, 104, 30, '#f2a72c') : '') + D.sides(f, ['pasta', 'strawberry', 'banana', 'apple', 'honey', 'sugar']),

    primavera: (f) => D.plate(P.sage) + B.noodle('prim', 7, '#f6dc96', 100, 124, 46, 12) +
      f.ids.filter((i) => i !== 'pasta').map((id, k) => put(cooked(f, id), 76 + k * 26, 110 + (k % 2) * 8, 0.32, k * 30)).join('') + D.herbs('pr', 3, 100, 110, 40, 8),

    rice_pudding: (f) => D.cup('#fbf1d8') + `<path d="M74 92 q8 -6 16 0 t16 0 t16 0" stroke="#efe0bd" stroke-width="3" fill="none"/>` +
      (f.has('strawberry') ? D.strawberry(100, 78, 0.34) : f.has('banana') ? put(A.token('banana', 'sliced'), 100, 80, 0.4) : f.has('apple') ? put(A.token('apple', 'chopped'), 100, 80, 0.4) : '') +
      (f.has('honey') ? D.drizzle(100, 92, 24, '#f2a72c') : `<circle cx="96" cy="88" r="2" fill="#c98a45"/><circle cx="108" cy="92" r="2" fill="#c98a45"/>`),

    risotto: (f) => D.plate(P.butter) + `<path d="M50 132 C48 108 76 98 100 100 C126 98 152 108 150 132 Q100 146 50 132Z" fill="#f6e6b8" ${O}/>` +
      D.grains('ris', 22, 100, 120, 42, 10) + (f.has('mushroom') ? B.mushSlice(84, 112, 0.6, '#b98a62') + B.mushSlice(118, 116, 0.55, '#b98a62') : '') +
      (f.has('cheese') ? B.shreds('rc', 6, '#fff3c0', 100, 110, 22) : '') + D.leaf(110, 102, -20, 1.1),

    chicken_rice: () => D.dish('#f4e2b0') + D.grains('cr', 26, 100, 106, 60, 8) +
      [[74, 104], [104, 100], [128, 108]].map(([x, y], k) => `<path d="M${x - 12} ${y} q2 -10 12 -10 q12 0 12 10 q-2 8 -12 8 q-10 0 -12 -8Z" fill="#d99a6a" ${O2}/>`).join('') + D.herbs('chr', 3, 100, 100, 50, 4) + D.steam(100, 74, 2),

    veg_rice: (f) => D.plate(P.turq) + `<path d="M52 132 C50 108 76 98 100 100 C126 98 150 108 148 132 Q100 146 52 132Z" fill="#fbf3dc" ${O}/>` + D.grains('vr', 24, 100, 120, 42, 10) +
      f.ids.filter((i) => i !== 'rice').map((id, k) => put(cooked(f, id), 80 + k * 20, 112 + (k % 2) * 8, 0.24, k * 50)).join(''),

    choc_pudding: (f) => D.cup('#5a3524') + `<path d="M72 94 q14 -10 28 0 t28 0" stroke="#7b4a33" stroke-width="3" fill="none"/>` +
      `<path d="M86 86 q14 -12 28 0 q-14 8 -28 0Z" fill="#fffaf0" ${O2}/>` + (f.has('banana') ? put(A.token('banana', 'sliced'), 100, 76, 0.4) : f.has('strawberry') ? D.strawberry(100, 74, 0.32) : ''),

    pudding: (f) => D.cup('#f8e3a0') + `<path d="M72 94 q14 -10 28 0 t28 0" stroke="#fff3c8" stroke-width="3" fill="none"/>` +
      (f.has('banana') ? put(A.token('banana', 'sliced'), 100, 78, 0.4) : f.has('strawberry') ? D.strawberry(100, 74, 0.32) : f.has('apple') ? put(A.token('apple', 'chopped'), 100, 78, 0.4) : '') +
      (f.has('honey') ? D.drizzle(100, 90, 24, '#f2a72c') : `<circle cx="100" cy="88" r="3" fill="#c98a45"/>`),

    lumpy_soup: (f) => D.bowl(f.has('chocolate') ? '#8a5a40' : '#f3e6c4', P.butter) +
      [[72, 102, 9], [96, 98, 11], [124, 104, 8], [110, 110, 6], [84, 110, 6]].map(([x, y, r]) =>
        `<path d="M${x - r} ${y} q${r * 0.3} ${-r} ${r} ${-r * 0.8} q${r} 0 ${r} ${r * 0.8} q${-r * 0.4} ${r * 0.8} ${-r} ${r * 0.6} q${-r * 0.7} 0 ${-r} ${-r * 0.6}Z" fill="#efe0bd" ${O2}/>`).join('') + D.steam(100, 70, 2),

    compote: (f) => D.jar('#e3a24c') + put(A.token('apple', 'chopped'), 100, 140, 0.5) + `<circle cx="84" cy="76" r="4" fill="#ffd28a" opacity=".7"/>`,

    honey_lemon: () => D.mug('#f2c04a') + put(A.token('lemon', 'sliced'), 72, 76, 0.32, 20) + D.steam(96, 62, 3) +
      `<path d="M150 50 L132 82" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M150 50 L132 82" stroke="#d9a066" stroke-width="4" stroke-linecap="round"/><ellipse cx="154" cy="44" rx="9" ry="7" fill="#f2a72c" ${O2}/>`,

    tofu_stew: (f) => D.bowl('#e7c27a', P.sage) + [[76, 102], [100, 98], [124, 104]].map(([x, y]) => `<path d="M${x - 9} ${y - 4} L${x + 3} ${y - 9} L${x + 11} ${y - 3} L${x - 1} ${y + 2}Z" fill="#fffdf3" ${O2}/><path d="M${x - 1} ${y + 2} L${x + 11} ${y - 3} L${x + 11} ${y + 5} L${x - 1} ${y + 10}Z" fill="#efe6cc" ${O2}/>`).join('') +
      f.ids.filter((i) => i !== 'tofu').map((id, k) => put(cooked(f, id), 64 + k * 68, 104, 0.26)).join('') + D.steam(100, 70, 2),

    chicken_soup: (f) => D.bowl('#f2cf6a', P.coral) + [[78, 102], [118, 104]].map(([x, y], k) => `<rect x="${x - 9}" y="${y - 7}" width="18" height="14" rx="5" fill="#e8b48e" ${O2} transform="rotate(${k * 30 - 10} ${x} ${y})"/>`).join('') +
      f.ids.filter((i) => i !== 'chicken').map((id, k) => put(cooked(f, id), 98 + (k - 1) * 30, 104, 0.24, k * 20)).join('') + D.leaf(136, 98, 30) + D.steam(100, 70, 3),

    corn_chowder: (f) => D.bowl('#f6e4a0', P.turq) + [[70, 102], [84, 98], [104, 104], [120, 98], [132, 104], [94, 108], [114, 110]].map(([x, y]) => D.kernel(x, y, 0.8)).join('') +
      (f.has('potato') ? [[80, 108], [124, 106]].map(([x, y]) => `<rect x="${x - 6}" y="${y - 5}" width="12" height="10" rx="3" fill="#f3e2a8" ${O2}/>`).join('') : '') + D.leaf(100, 96, -10) + D.steam(100, 70, 2),

    carrot_soup: () => D.bowl('#f19434', P.sage) + `<path d="M76 104 q12 -8 24 0 t24 0" stroke="#fff3e6" stroke-width="4" fill="none" stroke-linecap="round"/>` + D.leaf(128, 100, 20, 1.2) + D.leaf(118, 98, 160) + D.steam(100, 70, 2),

    green_soup: (f) => D.bowl('#6fa64a', P.butter) + `<path d="M76 104 q12 -8 24 0 t24 0" stroke="#e6f0c2" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      (f.has('broccoli') ? put(A.token('broccoli', 'whole'), 128, 98, 0.24) : '') + (f.has('zucchini') ? put(A.token('zucchini', 'sliced'), 74, 102, 0.3) : '') + D.steam(100, 70, 2),

    choc_cake: (f) => D.plate(P.pink) + D.cake(66, '#5a3524', '#7b4a33', '#3a1d12') +
      (f.has('banana') ? [[84, 82], [100, 78], [116, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fbefc0" ${O2}/>`).join('') :
        f.has('strawberry') ? D.strawberry(100, 74, 0.3) : `<circle cx="100" cy="78" r="6" fill="${P.coral}" ${O2}/>`),

    banana_bread: () => D.plate(P.butter) + `<path d="M50 136 L54 96 Q100 76 146 96 L150 136 Q100 148 50 136Z" fill="#b4743a" ${O}/>` +
      `<path d="M56 98 Q100 80 144 98 Q100 110 56 98Z" fill="#8a5528" ${O2}/><path d="M70 92 Q100 82 130 92" stroke="#f6d64a" stroke-width="6" stroke-linecap="round" fill="none"/>` +
      `<path d="M70 92 Q100 82 130 92" stroke="${INK}" stroke-width="1.5" fill="none" stroke-dasharray="2 10"/>` + [[80, 120], [118, 118], [98, 128]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#6b3f20"/>`).join(''),

    apple_pie: () => D.plate(P.coral) + `<ellipse cx="100" cy="122" rx="60" ry="24" fill="#c98a45" ${O}/><ellipse cx="100" cy="116" rx="54" ry="19" fill="#e9b45c" ${O2}/>` +
      [-30, -10, 10, 30].map((d) => `<path d="M${100 + d - 10} ${99} L${100 + d + 10} ${133}" stroke="#f4d08c" stroke-width="7" stroke-linecap="round"/>`).join('') +
      [-30, -10, 10, 30].map((d) => `<path d="M${54} ${116 + d / 3} L${146} ${116 + d / 3}" stroke="#f4d08c" stroke-width="6" stroke-linecap="round" opacity=".9"/>`).join('') +
      `<path d="M74 112 q4 4 8 0 M110 120 q4 4 8 0" stroke="#d8443a" stroke-width="3" fill="none"/>` + D.steam(100, 82, 2),

    cookies: (f) => D.plate(P.sage) + [[74, 122], [104, 112], [130, 126], [96, 136]].map(([x, y]) =>
      `<ellipse cx="${x}" cy="${y}" rx="20" ry="12" fill="#e2b062" ${O}/>` + (f.has('chocolate') ? [[-6, -3], [5, 2], [-1, 5], [8, -4]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="2.6" fill="#5a3524"/>`).join('') : `<path d="M${x - 8} ${y} q8 -5 16 0" stroke="#f4d08c" stroke-width="2.5" fill="none"/>`)).join(''),

    sponge_cake: (f) => D.plate(P.butter) + D.cake(60, '#f2cf7a', '#f8e3a8', '#e2b062') +
      (f.has('lemon') ? `<path d="M64 86 q8 12 4 22 M136 86 q-6 14 -2 24 M100 80 q4 10 0 16" stroke="#f7dc3c" stroke-width="6" fill="none" stroke-linecap="round"/>` + put(A.token('lemon', 'sliced'), 100, 74, 0.3)
        : f.has('honey') ? D.drizzle(100, 84, 32, '#f2a72c') : `<circle cx="88" cy="80" r="2" fill="#fff"/><circle cx="110" cy="78" r="2" fill="#fff"/>`),

    patchwork: (f) => D.dish('#e9cf96') + [[60, 104], [84, 100], [108, 106], [132, 100], [72, 112], [120, 112], [96, 112], [146, 108]].map(([x, y], k) =>
      `<rect x="${x - 10}" y="${y - 6}" width="20" height="12" rx="3" fill="${['#e2b062', '#f3e2b8', '#c99050'][k % 3]}" ${O2}/>`).join('') +
      (f.has('chocolate') ? `<circle cx="90" cy="104" r="3" fill="${P.choco}"/><circle cx="126" cy="108" r="3" fill="${P.choco}"/>` : ''),

    pizza: (f) => D.pizzaBase('#cf3b2b', f.has('cheese')) + D.toppings(f, ['mushroom', 'pepper', 'onion', 'corn', 'spinach', 'chicken', 'zucchini', 'garlic', 'broccoli']) + D.leaf(110, 112, 30, 1.2),

    dessert_pizza: (f) => D.pizzaBase('#5a3524', false) + D.toppings(f, ['strawberry', 'banana', 'apple']) + (f.any('honey', 'sugar') ? D.drizzle(100, 118, 40, '#f2a72c') : '') +
      [[80, 108], [120, 128], [134, 108]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`).join(''),

    flatbread: (f) => D.plate(P.sage) + `<path d="M40 124 C38 102 70 92 102 94 C136 92 164 104 160 124 C156 142 46 146 40 124Z" fill="#ecc27a" ${O}/>` +
      [[70, 110], [96, 104], [126, 112], [110, 128], [80, 128]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#c98a45" opacity=".6"/>`).join('') +
      (f.has('cheese') ? `<path d="M74 116 q14 -8 30 0 q14 8 26 -2" stroke="#f6cf5a" stroke-width="7" fill="none" stroke-linecap="round"/>` : '') +
      (f.has('garlic') ? [[88, 112], [116, 118], [100, 126]].map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="5" rx="1.5" fill="#fff6e0" ${O2}/>`).join('') : '') +
      D.herbs('fb', 4, 100, 116, 46, 10) + D.sides(f, ['dough', 'cheese', 'garlic']),

    bread_loaf: () => D.board() + `<g class="growee"><path d="M48 132 C42 96 70 78 100 78 C130 78 158 96 152 132Z" fill="#c98a45" ${O}/>` +
      `<path d="M70 96 q8 -8 16 0 M94 90 q8 -8 16 0 M118 96 q8 -8 16 0" stroke="#f4d08c" stroke-width="4" fill="none" stroke-linecap="round"/></g>` + D.steam(100, 66, 2),

    pasta_bake: (f) => D.dish('#e8a24a') + `<path d="M28 104 q20 -10 40 0 t40 0 t40 0 t28 0" stroke="#f6cf5a" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      [[52, 108], [140, 106], [98, 100]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4" fill="#b8672a" opacity=".7"/>`).join('') +
      (f.has('tomato') ? `<path d="M64 112 q10 -4 20 0 M116 112 q10 -4 20 0" stroke="#cf3b2b" stroke-width="5" stroke-linecap="round"/>` : '') +
      (f.has('mushroom') ? B.mushSlice(82, 104, 0.45, '#b98a62') + B.mushSlice(122, 102, 0.42, '#b98a62') : '') + D.herbs('pb', 3, 100, 102, 50, 4) + D.steam(100, 74, 2),

    crunchy_pasta: () => D.plate(P.butter) + [0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
      const x = 62 + k * 10, a = -30 + (k % 3) * 25;
      return `<g transform="translate(${x} 120) rotate(${a})"><rect x="-3" y="-28" width="6" height="56" rx="3" fill="#d9a04a" ${O2}/></g>`;
    }).join('') + `<path d="M58 96 l-6 -6 M146 96 l6 -6 M150 110 l8 0" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,

    garlic_bread: () => D.board() + [[64, 118, -8], [100, 114, 0], [136, 118, 8]].map(([x, y, r]) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-18 14 L-16 -12 Q0 -20 16 -12 L18 14Z" fill="#c98a45" ${O}/><path d="M-12 -8 Q0 -14 12 -8 L12 8 L-12 8Z" fill="#f0c45a"/>` +
      `<circle cx="-4" cy="-2" r="2" fill="${P.sageDk}"/><circle cx="5" cy="2" r="2" fill="${P.sageDk}"/></g>`).join(''),

    stuffed_pepper: (f) => D.plate(P.turq) + [[78, 118], [122, 118]].map(([x, y]) =>
      `<path d="M${x - 22} ${y - 10} C${x - 26} ${y + 14} ${x - 10} ${y + 24} ${x} ${y + 22} C${x + 10} ${y + 24} ${x + 26} ${y + 14} ${x + 22} ${y - 10}Z" fill="${tn('#e8423a', 'heating')}" ${O}/>` +
      `<ellipse cx="${x}" cy="${y - 10}" rx="22" ry="8" fill="${f.has('rice') ? '#fbf3dc' : '#f6cf5a'}" ${O2}/>` + (f.has('cheese') ? `<path d="M${x - 14} ${y - 12} q14 -8 28 0" stroke="#f6cf5a" stroke-width="5" fill="none" stroke-linecap="round"/>` : '') +
      `<path d="M${x} ${y - 18} q2 -10 8 -12" stroke="${P.sageDk}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') + D.sides(f, ['pepper', 'rice', 'cheese']),

    baked_apple: (f) => D.plate(P.pink) + `<path d="M100 92 C88 80 62 86 64 110 C66 134 84 144 100 138 C116 144 134 134 136 110 C138 86 112 80 100 92Z" fill="#b8352c" ${O}/>` +
      `<path d="M100 92 Q98 80 104 72" ${O} fill="none"/>` + D.drizzle(100, 118, 26, f.has('honey') ? '#f2a72c' : '#c98a45') + D.steam(100, 68, 2) + D.sides(f, ['apple', 'honey', 'sugar', 'butter']),

    egg_casserole: (f) => D.dish('#f2c95a') + [[64, 104], [100, 100], [136, 104]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="6" fill="#f6dc7a" ${O2}/>`).join('') +
      f.ids.filter((i) => i !== 'egg').map((id, k) => put(cooked(f, id), 70 + k * 30, 106, 0.26, k * 40)).join('') + D.herbs('ec', 4, 100, 102, 60, 4) + D.steam(100, 76, 2),

    roast_chicken: (f) => D.plate(P.butter) + `<path d="M52 128 C44 94 80 80 104 84 C134 86 156 104 148 128 Q100 146 52 128Z" fill="#c9773a" ${O}/>` +
      `<path d="M68 104 q16 -14 36 -12" stroke="#e8a060" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      `<path d="M140 104 L162 88" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M140 104 L162 88" stroke="#fff6e8" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M58 106 L40 92" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M58 106 L40 92" stroke="#fff6e8" stroke-width="6" stroke-linecap="round"/>` +
      (f.has('lemon') ? put(A.token('lemon', 'sliced'), 150, 138, 0.3) : '') + D.herbs('rc', 3, 100, 100, 30, 6) + D.sides(f, ['chicken', 'lemon']),

    tofu_bake: (f) => D.plate(P.sage) + [[76, 118], [104, 110], [128, 122], [92, 132]].map(([x, y]) =>
      `<path d="M${x - 12} ${y - 4} L${x + 4} ${y - 11} L${x + 14} ${y - 4} L${x - 2} ${y + 3}Z" fill="#f0c46a" ${O2}/><path d="M${x - 2} ${y + 3} L${x + 14} ${y - 4} L${x + 14} ${y + 6} L${x - 2} ${y + 13}Z" fill="#d99a3a" ${O2}/><path d="M${x - 12} ${y - 4} L${x - 2} ${y + 3} L${x - 2} ${y + 13} L${x - 12} ${y + 6}Z" fill="#c9862a" ${O2}/>`).join('') +
      D.sides(f, ['tofu']),

    honey_carrots: () => D.plate(P.coral) + [[78, 116, -20], [100, 120, 10], [124, 114, 30]].map(([x, y, r]) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-6 -26 C2 -28 6 -24 6 -20 L2 24 Q0 28 -2 24 L-8 -20 C-8 -24 -8 -26 -6 -26Z" fill="#e8742a" ${O2}/><path d="M-6 -8 l4 0 M-4 6 l4 0" stroke="#b9561a" stroke-width="2"/></g>`).join('') +
      D.drizzle(100, 112, 32, '#f2a72c') + D.leaf(100, 92, -40),

    roast_corn: (f) => D.plate(P.butter) + [[82, 118, -16], [120, 120, 14]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r + 90}) scale(.6)"><g transform="translate(-50 -50)">${U.tone ? A.toneAll(A.token('corn', 'whole'), 'ready') : ''}</g></g>`).join('') +
      (f.has('butter') ? `<path d="M92 100 l14 -4 l10 4 l-14 4Z" fill="#fff1a8" ${O2}/>` : '') + [[70, 112], [128, 116]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#6b3f20"/>`).join(''),

    roast_veg: (f) => D.dish('#e8c890') + f.ids.map((id, k) => [0, 1].map((j) => put(cooked(f, id), 44 + (k * 2 + j) * (112 / Math.max(1, f.n * 2 - 1)), 104 + (j ? 4 : -2), 0.26, j * 50 + k * 20)).join('')).join('') + D.herbs('rv', 4, 100, 102, 60, 4),

    /* ---------- V2.1 dishes ---------- */
    galaxy: () => D.bowl('#2c2a6a', P.turq) + `<g class="spin" style="transform-origin:100px 105px">` +
      [[70, 102], [86, 98], [104, 106], [122, 100], [134, 106], [94, 110], [116, 110]].map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="${4 + (k % 3)}" fill="#5a6ad0" ${O2}/>`).join('') +
      `<path d="M66 104 q34 -14 68 0" stroke="#f6f0ff" stroke-width="2.5" fill="none" stroke-dasharray="2 6"/></g>` +
      [[60, 70], [140, 66], [100, 58], [78, 52], [124, 48]].map(([x, y], k) => `<path class="ember" style="animation-delay:${k * 0.3}s" d="M${x} ${y - 5} l1.5 3.5 l3.5 1.5 l-3.5 1.5 l-1.5 3.5 l-1.5 -3.5 l-3.5 -1.5 l3.5 -1.5Z" fill="#fff3a8"/>`).join(''),

    tortilla_ufo: () => `<ellipse cx="100" cy="172" rx="44" ry="7" fill="${INK}" opacity=".12"/><g class="floater">` +
      `<ellipse cx="100" cy="110" rx="70" ry="18" fill="#dcb874" ${O}/><path d="M64 104 C66 72 134 72 136 104Z" fill="#efd49a" ${O}/>` +
      `<ellipse cx="100" cy="88" rx="16" ry="9" fill="#bfe6ec" ${O2}/>` + [[52, 112], [78, 118], [122, 118], [148, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${P.butter}" ${O2}/>`).join('') +
      `<path d="M84 128 L74 156 M116 128 L126 156" stroke="#fff3a8" stroke-width="8" stroke-linecap="round" opacity=".6"/></g>`,

    ratatouille: (f) => D.skillet('#c8442e') + [[54, 122], [76, 112], [98, 122], [120, 112], [142, 122], [66, 136], [88, 136], [110, 136], [132, 134]].map(([x, y], k) =>
      `<ellipse cx="${x}" cy="${y}" rx="12" ry="9" fill="${['#6a3a78', '#5f9a4a', '#e8423a'][k % 3]}" ${O2}/><ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="${['#f4ecd2', '#e6f0c2', '#f7907a'][k % 3]}"/>`).join('') + D.herbs('rat', 4, 96, 124, 50, 14),

    creamy_tomato_soup: () => D.bowl('#e5745a', P.butter) + `<path d="M70 104 q15 -10 30 0 t30 0" stroke="#fff6e4" stroke-width="5" fill="none" stroke-linecap="round"/>` + D.leaf(130, 100, 20, 1.2) + D.steam(100, 70, 3),

    alfredo: (f) => D.plate(P.turq) + B.noodle('alf', 8, '#fbeec8', 100, 122, 48, 13) + `<path d="M64 128 C76 112 124 110 138 126" stroke="#fffaf0" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/>` +
      `<circle cx="88" cy="112" r="1.6" fill="${INK}"/><circle cx="110" cy="118" r="1.6" fill="${INK}"/><circle cx="98" cy="124" r="1.6" fill="${INK}"/>` + D.herbs('alf', 3, 100, 112, 34, 8) + D.sides(f, ['pasta', 'cream', 'cheese']),

    tuna_pasta: (f) => D.plate(P.sage) + B.noodle('tp', 7, '#f6dc96', 100, 124, 46, 12) +
      (f.has('tomato') ? `<path d="M76 116 C82 104 120 102 126 114 C128 124 110 128 100 126 C88 128 74 124 76 116Z" fill="#cf3b2b" ${O2}/>` : '') +
      [[86, 112], [108, 108], [118, 120], [94, 124]].map(([x, y]) => `<path d="M${x - 8} ${y} q3 -7 9 -5 q7 2 6 7 q-3 5 -9 4 q-6 -1 -6 -6Z" fill="#d9a08a" ${O2}/>`).join('') + D.leaf(124, 104, -20),

    tuna_rice: () => D.bowl('#fbf3dc', P.coral) + D.grains('tr', 20, 100, 104, 50, 6) +
      [[84, 100], [104, 96], [118, 104]].map(([x, y]) => `<path d="M${x - 9} ${y} q3 -8 10 -6 q8 2 7 8 q-3 6 -10 5 q-7 -1 -7 -7Z" fill="#d9a08a" ${O2}/>`).join('') + D.leaf(70, 100, 160) + D.leaf(132, 98, 20),

    curry: (f) => D.bowl('#e8a83a', P.sage) + `<path d="M70 104 q15 -8 30 0 t30 0" stroke="#fff3d6" stroke-width="4" fill="none"/>` +
      (f.has('chicken') ? [[80, 102], [116, 104]].map(([x, y], k) => `<rect x="${x - 9}" y="${y - 7}" width="18" height="14" rx="5" fill="#e09a5a" ${O2} transform="rotate(${k * 25 - 10} ${x} ${y})"/>`).join('')
        : [[80, 100], [116, 102]].map(([x, y]) => `<rect x="${x - 8}" y="${y - 7}" width="16" height="14" rx="3" fill="#fffdf3" ${O2}/>`).join('')) +
      (f.has('rice') ? `<path d="M118 100 C126 86 156 88 160 102 Q140 110 118 100Z" fill="#fbf3dc" ${O2}/>` + D.grains('cur', 8, 140, 98, 14, 4) : '') + D.leaf(98, 98, 0, 1.2) + D.steam(100, 70, 2),

    peanut_noodles: () => D.bowl('#e2b06a', P.coral) + B.noodle('pn', 5, '#f3d67e', 100, 104, 50, 6) +
      [[84, 100], [102, 96], [118, 102], [94, 108]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.4" fill="#c9853f" ${O2}/>`).join('') + D.leaf(130, 98, 20) + D.steam(100, 70, 2),

    ramen: (f) => D.bowl('#e8c27a', P.turq) + B.noodle('rmn', 5, '#f6dc86', 100, 106, 48, 6) +
      (f.has('egg') ? `<ellipse cx="80" cy="100" rx="12" ry="9" fill="#fffaf0" ${O2}/><circle cx="80" cy="100" r="5" fill="#f2a628"/>` : '') +
      (f.has('chicken') ? `<path d="M108 96 q10 -6 20 0 q-2 8 -10 8 q-8 0 -10 -8Z" fill="#e8b48e" ${O2}/>` : '') +
      (f.has('tofu') ? `<rect x="104" y="92" width="14" height="12" rx="2" fill="#fffdf3" ${O2}/>` : '') +
      `<path d="M128 88 L134 108" stroke="#3a5a2e" stroke-width="10" stroke-linecap="round"/>` + D.leaf(96, 96, 10) + D.steam(100, 66, 3) +
      `<path d="M150 46 L120 104 M160 50 L128 106" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,

    sweet_noodles: (f) => D.plate(P.pink) + B.noodle('swn', 7, f.has('chocolate') ? '#9c6a48' : '#f3d67e', 100, 124, 46, 12) +
      D.drizzle(100, 108, 34, f.has('honey') ? '#f2a72c' : P.choco) + D.sides(f, ['noodles', 'chocolate', 'honey']),

    porridge: (f) => D.bowl('#efe0bd', P.butter) + D.grains('por', 14, 100, 104, 46, 6).replace(/#fffdf6/g, '#f6ead0') +
      (f.has('blueberries') ? [[90, 100], [100, 96], [110, 100], [104, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#4a5fb8" ${O2}/>`).join('') :
        f.has('banana') ? put(A.token('banana', 'sliced'), 100, 100, 0.34) : f.has('strawberry') ? B.berrySlice(100, 100, 0.6, 0) : '') +
      (f.has('honey') || f.has('peanut') ? D.drizzle(100, 104, 26, f.has('peanut') ? '#c9853f' : '#f2a72c') : '') + D.steam(100, 70, 2),

    blueberry_jam: () => D.jar('#3b3f8a') + [[84, 76], [116, 140]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#8fa2e6" opacity=".7"/>`).join('') +
      [[150, 150], [162, 156], [156, 164]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#4a5fb8" ${O2}/>`).join(''),

    citrus_punch: () => D.mug('#f7a83a') + put(A.token('orange', 'sliced'), 70, 76, 0.3, 10) + put(A.token('lemon', 'sliced'), 118, 78, 0.26, -20) + D.steam(96, 62, 3),

    marmalade: () => D.jar('#f08a1a') + put(A.token('orange', 'sliced'), 156, 150, 0.32) + `<path d="M76 70 q20 6 48 0" stroke="#ffd08a" stroke-width="3" fill="none"/>`,

    tortilla_soup: () => D.bowl('#c8442e', P.butter) + [[76, 98, -20], [96, 94, 10], [118, 98, 30], [132, 104, -10]].map(([x, y, r]) =>
      `<path transform="rotate(${r} ${x} ${y})" d="M${x - 10} ${y} L${x + 10} ${y - 3} L${x + 9} ${y + 3} L${x - 9} ${y + 5}Z" fill="#efd49a" ${O2}/>`).join('') +
      [[86, 106], [108, 106]].map(([x, y]) => D.kernel(x, y, 0.7)).join('') + D.leaf(100, 100, 0) + D.steam(100, 70, 2),

    tzatziki: () => D.bowl('#f4f6ea', P.turq) + put(A.token('cucumber', 'sliced'), 100, 100, 0.4) + `<path d="M74 106 q12 -6 24 0" stroke="#d8e8c8" stroke-width="3" fill="none"/>` + D.leaf(130, 98, 20) + D.steam(100, 70, 1),

    creme_brulee: () => D.ramekin(110, P.turq) + `<ellipse cx="100" cy="110" rx="50" ry="12" fill="#c98a2a" ${O}/>` +
      `<path d="M66 108 l10 4 l8 -4 l12 5 M108 106 l10 5 l12 -3" stroke="#f2c46a" stroke-width="2.5" fill="none"/>` + D.strawberry(126, 102, 0.22, 10) +
      `<path d="M150 64 L118 104" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M150 64 L118 104" stroke="#e0e0e0" stroke-width="4" stroke-linecap="round"/>`,

    eggplant_parm: (f) => D.dish('#cf3b2b') + [[58, 102], [88, 98], [118, 102], [146, 98]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="7" fill="#f4ecd2" stroke="#6a3a78" stroke-width="3"/>`).join('') +
      `<path d="M40 100 q20 -10 40 0 t40 0 t40 0" stroke="#f6cf5a" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"/>` +
      [[70, 100], [130, 104]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" fill="#c98a45" opacity=".7"/>`).join('') + D.leaf(100, 98, 10, 1.2) + D.steam(100, 74, 2),

    roast_eggplant: (f) => D.plate(P.sage) + [[80, 118, -12], [122, 118, 14]].map(([x, y, r]) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-24 0 C-24 -14 24 -16 26 0 C24 14 -24 14 -24 0Z" fill="#4a2a58" ${O}/><path d="M-18 -2 C-16 -10 18 -10 20 -2 C18 6 -16 6 -18 -2Z" fill="#e2b062"/>` +
      `<path d="M-10 -4 l20 0 M-8 2 l16 0" stroke="#b98048" stroke-width="2"/></g>`).join('') + D.herbs('re', 4, 100, 112, 40, 8) + D.sides(f, ['eggplant']),

    quesadilla: (f) => D.plate(P.coral) + [[78, 120, -8], [124, 118, 10]].map(([x, y, r]) =>
      `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-30 10 A32 26 0 0 1 30 10Z" fill="#e6bf74" ${O}/><path d="M-24 10 q10 8 18 2 q8 8 18 0 q8 6 12 -2" fill="#f6cf5a" ${O2}/>` +
      `<ellipse cx="-8" cy="-4" rx="4" ry="2" fill="#c98a45"/><ellipse cx="10" cy="-8" rx="3" ry="2" fill="#c98a45"/></g>`).join('') +
      D.sides(f, ['tortilla', 'cheese']) + `<circle cx="100" cy="148" r="9" fill="#9db58a" ${O2}/>`,

    tortilla_rollups: (f) => D.plate(P.pink) + [[74, 120], [100, 112], [126, 122]].map(([x, y]) =>
      `<g transform="translate(${x} ${y}) rotate(-20)"><rect x="-26" y="-9" width="52" height="18" rx="9" fill="#e6bf74" ${O}/><circle cx="26" cy="0" r="8" fill="#e6bf74" ${O2}/>` +
      `<path d="M22 0 a4 4 0 1 0 4 -4" stroke="${f.has('chocolate') ? P.choco : f.has('peanut') ? '#c9853f' : '#f6d64a'}" stroke-width="3" fill="none"/></g>`).join('') +
      D.drizzle(100, 104, 30, f.has('chocolate') ? P.choco : '#f2a72c'),

    tuna_melt: (f) => D.plate(P.turq) + D.toast(100, 118, 1.3) + [[88, 108], [110, 112], [98, 124]].map(([x, y]) => `<path d="M${x - 8} ${y} q3 -7 9 -5 q7 2 6 7 q-3 5 -9 4 q-6 -1 -6 -6Z" fill="#d9a08a" ${O2}/>`).join('') +
      (f.has('cheese') ? `<path d="M76 104 C86 96 118 96 126 106 C128 116 124 126 118 134" stroke="#f6cf5a" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"/>` : '') + D.leaf(118, 120, 20),

    tuna_bake: (f) => D.dish('#e8b04a') + `<path d="M30 104 q20 -10 40 0 t40 0 t40 0 t24 0" stroke="#f6cf5a" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      [[64, 102], [104, 98], [140, 104]].map(([x, y]) => `<path d="M${x - 8} ${y} q3 -7 9 -5 q7 2 6 7 q-3 5 -9 4 q-6 -1 -6 -6Z" fill="#d9a08a" ${O2}/>`).join('') +
      [[84, 100], [124, 98]].map(([x, y]) => `<path d="M${x - 6} ${y} q6 -4 12 0" stroke="#f2d18b" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('') + D.steam(100, 74, 2),

    pb_toast: (f) => D.plate(P.butter) + D.toast(100, 118, 1.3, '#c9853f') + (f.has('banana') ? [[88, 108], [110, 106], [98, 124], [118, 124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#fbefc0" ${O2}/>`).join('') : '') +
      D.drizzle(100, 116, 22, '#f2a72c'),

    crumble: (f) => D.dish(f.has('blueberries') ? '#5a4a9a' : f.has('strawberry') ? '#c4243c' : '#e3a24c') +
      [[50, 104], [70, 100], [92, 104], [114, 100], [136, 104], [156, 100], [80, 108], [124, 108]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#e6c07a" ${O2}/>`).join('') +
      D.grains('cru', 10, 100, 102, 60, 5).replace(/#fffdf6/g, '#f6ead0') + D.steam(100, 74, 2),

    granola: (f) => D.bowl('#e6c07a', P.sage) + [[72, 100], [88, 96], [104, 102], [120, 96], [134, 102], [96, 108], [114, 108]].map(([x, y]) =>
      `<path d="M${x - 7} ${y} q2 -6 8 -6 q6 0 6 6 q-2 5 -7 5 q-6 0 -7 -5Z" fill="#c9903a" ${O2}/>`).join('') + D.drizzle(100, 98, 26, '#f2a72c'),

    muffins: () => D.plate(P.turq) + [[74, 118], [126, 118], [100, 104]].map(([x, y]) =>
      `<path d="M${x - 20} ${y} L${x - 16} ${y + 26} L${x + 16} ${y + 26} L${x + 20} ${y}Z" fill="${P.coral}" ${O2}/><path d="M${x - 18} ${y + 6} L${x + 18} ${y + 6}" stroke="#fff" stroke-width="2" opacity=".5"/>` +
      `<path d="M${x - 24} ${y + 2} C${x - 26} ${y - 22} ${x + 26} ${y - 22} ${x + 24} ${y + 2}Z" fill="#e8b45a" ${O}/>` +
      [[-8, -6], [6, -10], [10, -2], [-2, -12]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="3" fill="#4a5fb8"/>`).join('')).join(''),

    yogurt_cake: (f) => D.plate(P.pink) + D.cake(64, '#f6e2a8', '#fbf3dc', '#e2c07e') +
      (f.has('lemon') ? put(A.token('lemon', 'sliced'), 100, 76, 0.28) : f.has('blueberries') ? [[90, 82], [104, 78], [114, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#4a5fb8" ${O2}/>`).join('') : D.strawberry(100, 74, 0.28)),

    pea_soup: () => D.bowl('#7cbf4a', P.coral) + [[80, 102], [92, 98], [112, 100], [124, 104], [100, 106]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#a8dc6a" ${O2}/>`).join('') +
      `<path d="M74 106 q12 -6 24 0" stroke="#fffaf0" stroke-width="4" fill="none" stroke-linecap="round"/>` + D.leaf(128, 98, 20) + D.steam(100, 70, 2),
    chili: () => D.bowl('#a83a26', P.butter) + [[76, 102], [92, 98], [108, 104], [124, 99], [100, 108], [84, 108], [118, 108]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.4" fill="#7a2a1a" ${O2}/>`).join('') +
      `<path d="M104 94 q8 -6 16 0" stroke="#fffaf0" stroke-width="5" stroke-linecap="round"/>` + D.leaf(90, 96, 10) + D.steam(100, 70, 3),
    baked_beans: () => D.dish('#c8442e') + [[50, 104], [66, 100], [82, 106], [98, 100], [114, 106], [130, 100], [146, 104], [74, 110], [122, 110], [158, 108], [42, 110]].map(([x, y]) =>
      `<ellipse cx="${x}" cy="${y}" rx="6" ry="4" fill="#9a3a22" ${O2}/>`).join('') + `<path d="M60 98 q20 -6 40 0" stroke="#e8823a" stroke-width="3" fill="none" opacity=".7"/>` + D.steam(100, 74, 2),
    noodle_nest: () => D.plate(P.butter) + `<ellipse cx="100" cy="122" rx="44" ry="20" fill="#d99a3a" ${O}/>` + B.noodle('nest', 6, '#e8b44a', 100, 118, 40, 10) +
      `<ellipse cx="88" cy="114" rx="7" ry="9" fill="#cfe8f0" ${O2}/><ellipse cx="106" cy="116" rx="7" ry="9" fill="#cfe8f0" ${O2}/>`
,

    /* deterministic improvisations: drawn from the actual ingredients */
    imp_pot: (f) => {
      const c = U.mix(U.mixMany(f.ids.map((i) => WC.INGREDIENTS[i].color)), f.has('milk') ? '#fff4dc' : '#e8d7b4', 0.45);
      return D.bowl(tn(c, f.P === 'over' ? 'heating' : 'raw'), [P.sage, P.coral, P.turq, P.butter][f.n % 4]) +
        `<g transform="translate(0 6) scale(1 .8)">${D.row(f, 120, 'pot', () => f.P, 20)}</g>` + D.steam(100, 70, 2);
    },
    imp_oven: (f) => D.dish(tn(f.has('cheese') ? '#f2cf6a' : '#e6c08a', ph(f))) +
      `<g transform="translate(0 4) scale(1 .85)">${D.row(f, 112, 'oven', () => f.P, 10)}</g>` +
      (f.has('cheese') ? `<path d="M40 104 q20 -8 40 0 t40 0 t40 0" stroke="#f6cf5a" stroke-width="6" fill="none" stroke-linecap="round" opacity=".85"/>` : '') + D.steam(100, 70, 2)

  };

  /* main entry: returns a complete <svg> */
  WC.dishSVG = (outcomeId, facts, cls = '') => {
    const f = WC.Engine.wrap(facts);
    const fn = ART[outcomeId] || ART[String(outcomeId).startsWith('imp:boil') ? 'imp_pot' : 'imp_oven'];
    let inner = '';
    try { inner = fn(f); } catch (e) { console.error(outcomeId, e); inner = ART.imp_pot(f); }
    return U.svg('0 0 200 200', inner, 'dish ' + cls, `data-dish="${outcomeId}"`);
  };
  WC.DISH_ART = ART;
})(window.WC);
