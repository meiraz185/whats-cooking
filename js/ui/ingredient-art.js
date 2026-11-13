/* Original SVG illustrations for every ingredient in every state (100×100 cells). */
(function (WC) {
  'use strict';
  const U = WC.U, P = U.PAL, INK = U.INK;
  const O = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const O2 = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
  const hl = (d, c = '#fff', w = 4, o = 0.7) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`;
  const tn = U.tone;

  /* ---------- small reusable bits ---------- */
  const B = {};
  B.yolk = (x, y, r, c = '#f7a823') =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${O}/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.3}" fill="#ffe7a0"/>`;
  B.eggWhite = (fill, op, edge) =>
    (edge ? `<path d="M14 56 C10 34 34 24 52 27 C74 24 92 40 86 60 C84 78 62 86 44 82 C26 84 15 72 14 56Z" fill="${edge}" ${O2}/>` : '') +
    `<path d="M20 55 C18 38 38 30 52 33 C70 30 84 42 80 58 C78 72 60 78 45 75 C30 76 21 68 20 55Z" fill="${fill}" fill-opacity="${op}" ${O}/>`;
  B.tomChunk = (x, y, s, rot, c = '#e9533f', inner = '#f7907a') =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-12 8 L-10 -9 Q2 -14 12 -6 L10 9 Z" fill="${c}" ${O}/>` +
    `<path d="M-7 4 L-6 -5 Q1 -8 7 -3 L6 5Z" fill="${inner}"/><circle cx="-2" cy="0" r="1.6" fill="#ffe2a6"/><circle cx="3" cy="-2" r="1.6" fill="#ffe2a6"/></g>`;
  B.shred = (x, y, len, rot, c) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><line x1="0" y1="0" x2="${len}" y2="0" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
    `<line x1="0" y1="0" x2="${len}" y2="0" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/></g>`;
  B.shreds = (seed, n, c, cx = 50, cy = 60, spread = 26) => {
    const r = U.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += B.shred(cx - spread + r() * spread * 2, cy - spread * 0.5 + r() * spread, 8 + r() * 8, r() * 180, c);
    return s;
  };
  B.mushSlice = (x, y, s, c = '#efd7b6', edge = '#a86d45') =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0 Q-14 -14 0 -15 Q14 -14 14 0 Q8 2 5 1 L5 12 Q0 15 -5 12 L-5 1 Q-8 2 -14 0Z" fill="${c}" ${O}/>` +
    `<path d="M-11 -2 Q-10 -11 0 -12 Q10 -11 11 -2" fill="none" stroke="${edge}" stroke-width="3"/></g>`;
  B.berrySlice = (x, y, s, rot, c = '#e8434f') =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 14 C-10 8 -14 -2 -11 -8 C-8 -13 -3 -12 0 -10 C3 -12 8 -13 11 -8 C14 -2 10 8 0 14Z" fill="${c}" ${O}/>` +
    `<path d="M0 9 C-6 5 -8 -1 -6 -5 C-4 -8 -1 -7 0 -5 C1 -7 4 -8 6 -5 C8 -1 6 5 0 9Z" fill="#ffb3bd"/><path d="M0 7 L0 -4" stroke="#fff" stroke-width="1.5" opacity=".7"/></g>`;
  B.shard = (x, y, s, rot, c = P.choco) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-10 -6 L6 -10 L12 4 L-2 10 L-12 4Z" fill="${c}" ${O}/><path d="M-6 -3 L4 -6" stroke="#8a5638" stroke-width="2.5" stroke-linecap="round"/></g>`;
  B.onionBit = (x, y, s, rot, c = '#f3d6e1', e = '#b65a7f') =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M-10 4 Q0 -12 10 4 Q0 -4 -10 4Z" fill="${c}" stroke="${e}" stroke-width="3" stroke-linejoin="round"/></g>`;
  B.fry = (x, y, len, rot, c) =>
    `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-len / 2}" y="-4.5" width="${len}" height="9" rx="3" fill="${c}" ${O2}/></g>`;
  B.noodle = (seed, n, c, cx = 50, cy = 55, w = 30, h = 16) => {
    const r = U.rng(seed); let a = '', b = '';
    for (let i = 0; i < n; i++) {
      const y = cy - h + r() * h * 2, x0 = cx - w + r() * 8, x1 = cx + w - r() * 8, a1 = 6 + r() * 6;
      const d = `M${x0} ${y} C${x0 + 10} ${y - a1} ${x0 + 18} ${y + a1} ${(x0 + x1) / 2} ${y} S${x1 - 6} ${y - a1} ${x1} ${y + 2}`;
      a += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
      b += `<path d="${d}" fill="none" stroke="${c}" stroke-width="3.8" stroke-linecap="round"/>`;
    }
    return a + b;
  };
  B.bubbles = (seed, n, cx, cy, w, h, c = '#ffffff') => {
    const r = U.rng(seed); let s = '';
    for (let i = 0; i < n; i++) s += `<circle class="bub" style="animation-delay:${(r() * 1.4).toFixed(2)}s" cx="${cx - w + r() * w * 2}" cy="${cy - h + r() * h * 2}" r="${1.5 + r() * 2.5}" fill="none" stroke="${c}" stroke-width="1.6"/>`;
    return s;
  };
  B.smoke = (n, x = 50, y = 30, dark = false) => {
    let s = '';
    for (let i = 0; i < n; i++) s += `<path class="smoke" style="animation-delay:${i * 0.5}s" d="M${x - 10 + i * 10} ${y} q-6 -8 0 -16 q6 -8 0 -16" fill="none" stroke="${dark ? '#4a3a33' : '#ffffff'}" stroke-width="${dark ? 5 : 3.5}" stroke-linecap="round" opacity=".8"/>`;
    return s;
  };

  /* ---------- raw / prepared tokens ---------- */
  const T = {
    egg: {
      whole: () => `<ellipse cx="50" cy="55" rx="23" ry="29" fill="#fff4e0" ${O}/>${hl('M38 40 Q41 33 47 31', '#fff', 5, 0.9)}` +
        `<circle cx="58" cy="66" r="1.8" fill="#d9b98f"/><circle cx="62" cy="58" r="1.4" fill="#d9b98f"/><circle cx="54" cy="73" r="1.4" fill="#d9b98f"/>`,
      cracked: () => B.eggWhite('#fffdf6', 0.85) + B.yolk(50, 53, 12),
      whisked: () => `<ellipse cx="50" cy="56" rx="32" ry="22" fill="#f6c94a" ${O}/><path d="M30 56 Q40 46 50 56 T70 56" fill="none" stroke="#ffe39a" stroke-width="3"/>`
    },
    tomato: {
      whole: () => `<circle cx="50" cy="57" r="28" fill="#e9533f" ${O}/>${hl('M32 50 Q34 40 44 36', '#ffc1b3', 5, 0.8)}` +
        `<path d="M50 31 l6 -8 l-1 9 l9 -1 l-8 5 l6 6 l-9 -3 l-3 8 l-3 -8 l-9 3 l6 -6 l-8 -5 l9 1 l-1 -9z" fill="${P.sageDk}" ${O2}/>`,
      chopped: () => B.tomChunk(34, 52, 1.2, -10) + B.tomChunk(62, 48, 1.15, 25) + B.tomChunk(46, 72, 1.15, 80) + B.tomChunk(70, 72, 1, 150) + B.tomChunk(28, 74, 0.9, 200)
    },
    cheese: {
      block: () => `<path d="M18 50 L60 30 L84 44 L42 64Z" fill="#fbe08a" ${O}/><path d="M42 64 L84 44 L84 64 L42 84Z" fill="#f2c443" ${O}/>` +
        `<path d="M18 50 L42 64 L42 84 L18 70Z" fill="#e2ac2c" ${O}/><ellipse cx="58" cy="68" rx="4" ry="3.2" fill="#d99a26"/><ellipse cx="72" cy="58" rx="3" ry="2.5" fill="#d99a26"/>` +
        `<ellipse cx="29" cy="66" rx="2.6" ry="3.4" fill="#c98e22"/><ellipse cx="52" cy="44" rx="4" ry="2" fill="#f2c443"/>`
    },
    milk: {
      carton: () => `<path d="M30 42 L50 24 L70 42 L70 86 L30 86Z" fill="#fffaf0" ${O}/><path d="M30 42 L50 24 L70 42Z" fill="${P.turq}" ${O}/>` +
        `<rect x="44" y="16" width="12" height="10" rx="2" fill="${P.turq}" ${O2}/><path d="M50 52 C45 60 43 64 43 67 a7 7 0 0 0 14 0 C57 64 55 60 50 52Z" fill="${P.turq}" ${O2}/>` +
        `<rect x="30" y="78" width="40" height="8" fill="${P.coral}" ${O2}/>`
    },
    mushroom: {
      whole: () => `<path d="M40 54 Q38 76 36 84 Q50 90 64 84 Q62 76 60 54Z" fill="#f4e6cf" ${O}/>` +
        `<path d="M16 54 Q18 22 50 20 Q82 22 84 54 Q50 62 16 54Z" fill="#b5764c" ${O}/>` +
        `<ellipse cx="38" cy="38" rx="6" ry="4" fill="#e8c9a4"/><ellipse cx="60" cy="33" rx="5" ry="3.5" fill="#e8c9a4"/><ellipse cx="68" cy="46" rx="4" ry="3" fill="#e8c9a4"/>`,
      sliced: () => B.mushSlice(32, 48, 1.25) + B.mushSlice(64, 44, 1.2) + B.mushSlice(48, 74, 1.15)
    },
    strawberry: {
      whole: () => `<path d="M50 86 C30 76 18 58 22 42 C26 30 40 30 50 35 C60 30 74 30 78 42 C82 58 70 76 50 86Z" fill="#e8434f" ${O}/>` +
        `<path d="M50 35 C44 26 34 26 30 30 C38 32 42 34 50 35 C58 34 62 32 70 30 C66 26 56 26 50 35Z" fill="${P.sageDk}" ${O2}/><path d="M50 34 L50 22" ${O} />` +
        [[38, 48], [50, 50], [62, 48], [44, 62], [56, 62], [50, 74], [34, 58], [66, 58]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4" fill="#ffd76a"/>`).join('') +
        hl('M30 46 Q32 40 38 38', '#ffb3bd', 4, 0.8),
      sliced: () => B.berrySlice(32, 50, 1.3, -15) + B.berrySlice(64, 46, 1.3, 15) + B.berrySlice(48, 74, 1.25, 0),
      mashed: () => `<path d="M18 64 C16 48 34 42 50 44 C68 42 86 50 82 64 C78 76 60 80 48 78 C32 80 20 74 18 64Z" fill="#e95a6e" ${O}/>` +
        `<path d="M30 60 q8 -6 16 0 q8 6 16 0" fill="none" stroke="#ffb3bd" stroke-width="3"/>` +
        [[34, 66], [48, 70], [62, 66], [56, 56], [40, 56]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.4" ry="2" fill="#ffd76a"/>`).join('')
    },
    pasta: {
      dry: () => {
        let s = '';
        for (let i = 0; i < 9; i++) { const o = i * 3.2 - 13; s += `<line x1="${28 + o}" y1="${84 + o * 0.25}" x2="${68 + o}" y2="${16 + o * 0.25}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`; }
        for (let i = 0; i < 9; i++) { const o = i * 3.2 - 13; s += `<line x1="${28 + o}" y1="${84 + o * 0.25}" x2="${68 + o}" y2="${16 + o * 0.25}" stroke="#f2d18b" stroke-width="3" stroke-linecap="round"/>`; }
        return s + `<path d="M36 54 L62 64 L64 56 L38 46Z" fill="${P.coral}" ${O2}/>`;
      }
    },
    flour: {
      powder: () => `<path d="M26 34 Q50 26 74 34 L80 84 Q50 92 20 84 Z" fill="#efe4cc" ${O}/>` +
        `<path d="M30 34 Q40 20 50 28 Q60 20 70 34" fill="#f8f0de" ${O}/>` +
        `<path d="M50 74 L50 50 M50 56 l-6 -5 M50 56 l6 -5 M50 64 l-6 -5 M50 64 l6 -5" stroke="${P.butterDk}" stroke-width="3" stroke-linecap="round" fill="none"/>` +
        `<rect x="34" y="42" width="32" height="40" rx="6" fill="none" stroke="${P.coral}" stroke-width="2.5" stroke-dasharray="4 3"/>`
    },
    potato: {
      whole: () => `<path d="M20 56 C18 38 36 26 56 28 C76 30 86 46 82 62 C78 78 58 84 42 80 C26 76 21 68 20 56Z" fill="#d9a85b" ${O}/>` +
        `<path d="M40 44 q3 -2 5 1 M62 52 q3 -2 5 1 M48 68 q3 -2 5 1" stroke="${P.chocoLt}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + hl('M30 50 Q33 40 42 36', '#f2d49a', 4, 0.9),
      chopped: () => B.fry(36, 44, 34, -20, '#f3e2a8') + B.fry(60, 50, 34, 25, '#f3e2a8') + B.fry(44, 66, 34, 5, '#f3e2a8') + B.fry(66, 72, 26, -35, '#f3e2a8'),
      mashed: () => `<path d="M18 74 C18 56 30 46 40 46 C42 36 58 36 60 46 C72 46 82 58 82 74Z" fill="#f6e3a8" ${O}/><path d="M34 62 q8 -8 16 0 q8 -8 16 0" fill="none" stroke="#fff3c8" stroke-width="3"/>`
    },
    chocolate: {
      bar: () => `<rect x="22" y="26" width="56" height="52" rx="5" fill="${P.choco}" ${O}/>` +
        [0, 1].map((cx) => [0, 1, 2].map((cy) => `<rect x="${28 + cx * 24}" y="${32 + cy * 14}" width="20" height="10" rx="2" fill="#6e432e" stroke="#3a2318" stroke-width="1.5"/>`).join('')).join('') +
        `<path d="M18 52 L82 52 L82 82 L18 82Z" fill="${P.coral}" ${O}/><path d="M18 60 L82 60" stroke="${P.butter}" stroke-width="4"/><circle cx="50" cy="71" r="6" fill="${P.butter}" ${O2}/>`,
      chopped: () => B.shard(34, 48, 1.2, 10) + B.shard(64, 44, 1.1, -30) + B.shard(48, 70, 1.25, 60) + B.shard(72, 70, 0.9, 120) + B.shard(28, 72, 0.8, 200)
    },
    bread: {
      slice: () => `<path d="M24 46 C16 30 30 18 50 20 C70 18 84 30 76 46 L74 84 L26 84 Z" fill="#c98a45" ${O}/>` +
        `<path d="M31 47 C25 35 35 27 50 28 C65 27 75 35 69 47 L67 77 L33 77 Z" fill="#f4dca3"/>` +
        `<circle cx="44" cy="44" r="2" fill="#e2c07e"/><circle cx="56" cy="56" r="2.4" fill="#e2c07e"/><circle cx="46" cy="66" r="1.8" fill="#e2c07e"/>`
    },
    onion: {
      whole: () => `<path d="M50 18 C46 30 20 40 20 62 C20 80 36 88 50 88 C64 88 80 80 80 62 C80 40 54 30 50 18Z" fill="#b65a7f" ${O}/>` +
        `<path d="M50 24 C44 38 32 46 34 66 M50 24 C56 38 68 46 66 66 M50 26 L50 82" fill="none" stroke="#d98bab" stroke-width="2.5"/>` +
        `<path d="M42 88 l-4 6 M50 89 l0 6 M58 88 l4 6" ${O2}/><path d="M50 18 q-2 -8 4 -12" ${O} fill="none"/>`,
      chopped: () => B.onionBit(34, 50, 1.4, -10) + B.onionBit(62, 46, 1.4, 20) + B.onionBit(46, 68, 1.4, 170) + B.onionBit(70, 70, 1.1, 40) + B.onionBit(28, 72, 1, 200)
    }
  };


  /* ---------- V2 ingredients ---------- */
  const coin = (x, y, r, c, inner) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${O2}/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="${inner}"/>`;
  Object.assign(T, {
    carrot: {
      whole: () => `<path d="M26 30 C34 24 44 26 48 32 L80 82 Q82 88 76 86 L28 46 C22 40 20 34 26 30Z" fill="#f08a2c" ${O}/>` +
        `<path d="M40 44 l8 -4 M50 56 l8 -4 M60 68 l7 -4" stroke="#c9631a" stroke-width="2.5" stroke-linecap="round"/>` +
        `<path d="M28 32 Q14 20 12 8 Q24 16 30 28 Q26 12 34 4 Q36 18 34 30" fill="${P.sage}" ${O2}/>`,
      sliced: () => coin(32, 46, 14, '#f08a2c', '#f7b066') + coin(62, 42, 13, '#f08a2c', '#f7b066') + coin(46, 70, 14, '#f08a2c', '#f7b066') + coin(74, 68, 11, '#f08a2c', '#f7b066')
    },
    zucchini: {
      whole: () => `<path d="M18 70 C14 62 22 54 32 50 L74 30 C84 26 92 34 86 42 L40 78 C30 84 22 80 18 70Z" fill="#5f9a4a" ${O}/>` +
        `<path d="M30 60 L76 36 M34 70 L82 42" stroke="#8cc06e" stroke-width="3" stroke-linecap="round"/>` +
        `<ellipse cx="84" cy="36" rx="5" ry="7" fill="#c9e3a0" ${O2} transform="rotate(40 84 36)"/><path d="M22 70 l-8 4" ${O}/>`,
      sliced: () => coin(30, 46, 15, '#5f9a4a', '#e6f0c2') + coin(62, 42, 14, '#5f9a4a', '#e6f0c2') + coin(46, 72, 15, '#5f9a4a', '#e6f0c2') + coin(76, 68, 11, '#5f9a4a', '#e6f0c2')
    },
    pepper: {
      whole: () => `<path d="M24 40 C20 28 34 24 42 30 Q50 24 58 30 C66 24 80 28 76 40 C82 56 76 82 62 86 Q50 90 38 86 C24 82 18 56 24 40Z" fill="#e8423a" ${O}/>` +
        `<path d="M42 32 Q40 60 44 84 M58 32 Q60 60 56 84" stroke="#b92a24" stroke-width="2.5" fill="none"/>` +
        `<path d="M46 30 Q46 18 56 14" stroke="${P.sageDk}" stroke-width="6" fill="none" stroke-linecap="round"/>` + hl('M30 46 Q30 38 36 34', '#ffb0a4', 4, 0.8),
      chopped: () => [[32, 46, -20], [62, 42, 30], [44, 70, 80], [72, 70, 10], [26, 70, 40]].map(([x, y, r]) =>
        `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-12 -5 Q0 -9 12 -5 L12 4 Q0 0 -12 4Z" fill="#e8423a" ${O2}/></g>`).join('')
    },
    broccoli: {
      whole: () => `<path d="M42 56 L38 88 Q50 92 62 88 L58 56Z" fill="#9ccc7a" ${O}/>` +
        `<path d="M22 50 C14 40 22 26 34 28 C36 16 54 12 60 22 C72 16 86 28 80 40 C88 48 80 62 68 58 C62 66 40 66 34 58 C24 62 16 56 22 50Z" fill="#4f9a4f" ${O}/>` +
        `<circle cx="36" cy="40" r="3" fill="#6fb86a"/><circle cx="54" cy="30" r="3" fill="#6fb86a"/><circle cx="66" cy="44" r="3" fill="#6fb86a"/><circle cx="48" cy="50" r="2.5" fill="#6fb86a"/>`,
      florets: () => [[32, 52, 0.55], [62, 46, 0.5], [48, 74, 0.5]].map(([x, y, k]) => `<g transform="translate(${x - 50 * k} ${y - 50 * k}) scale(${k})">${T.broccoli.whole()}</g>`).join('')
    },
    garlic: {
      whole: () => `<path d="M50 18 C46 30 22 40 24 62 C26 80 40 86 50 86 C60 86 74 80 76 62 C78 40 54 30 50 18Z" fill="#f3ead8" ${O}/>` +
        `<path d="M50 24 C42 40 36 54 40 82 M50 24 C58 40 64 54 60 82" stroke="#d8c6a8" stroke-width="2.5" fill="none"/>` +
        `<path d="M44 86 l-3 6 M50 87 l0 6 M56 86 l3 6" ${O2}/>`,
      minced: () => { const r = U.rng('garlic'); let s = ''; for (let i = 0; i < 16; i++) s += `<rect x="${26 + r() * 48}" y="${40 + r() * 34}" width="6" height="5" rx="1.5" fill="#f6efdf" ${O2} transform="rotate(${r() * 90} ${50} ${56})"/>`; return s; }
    },
    spinach: {
      leaves: () => [[36, 54, -30], [60, 50, 25], [48, 66, 0]].map(([x, y, r]) =>
        `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 26 C-18 14 -20 -14 0 -28 C20 -14 18 14 0 26Z" fill="#3f8a46" ${O}/><path d="M0 24 L0 -22 M0 0 l-8 -6 M0 10 l8 -6" stroke="#7cc07a" stroke-width="2.2" fill="none"/></g>`).join('')
    },
    corn: {
      whole: () => `<path d="M30 80 C20 60 30 30 50 20 C70 30 80 60 70 80 Q50 88 30 80Z" fill="#f6cf3a" ${O}/>` +
        [0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => `<ellipse cx="${40 + c * 10}" cy="${36 + r * 9}" rx="3.6" ry="3" fill="#ffe27a"/>`).join('')).join('') +
        `<path d="M30 80 C26 60 30 46 36 40 C38 60 44 72 50 86Z" fill="${P.sage}" ${O2}/><path d="M70 80 C74 60 70 46 64 40 C62 60 56 72 50 86Z" fill="${P.sage}" ${O2}/>`
    },
    chicken: {
      whole: () => `<path d="M62 36 L80 18" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M62 36 L80 18" stroke="#fff6e8" stroke-width="7" stroke-linecap="round"/>` +
        `<circle cx="80" cy="14" r="6" fill="#fff6e8" ${O2}/><circle cx="86" cy="20" r="6" fill="#fff6e8" ${O2}/>` +
        `<path d="M64 34 C80 50 70 80 46 84 C22 88 14 66 24 50 C34 34 52 24 64 34Z" fill="#f2b9a0" ${O}/>` + hl('M30 56 Q36 44 48 40', '#ffe0d0', 4, 0.9),
      pieces: () => [[32, 48], [60, 44], [44, 70], [72, 70]].map(([x, y], k) => `<rect x="${x - 11}" y="${y - 9}" width="22" height="18" rx="6" fill="#f2b9a0" ${O2} transform="rotate(${k * 17 - 20} ${x} ${y})"/>`).join('')
    },
    tofu: {
      block: () => `<path d="M20 44 L56 30 L82 42 L46 58Z" fill="#fffdf3" ${O}/><path d="M46 58 L82 42 L82 66 L46 84Z" fill="#f2ead2" ${O}/><path d="M20 44 L46 58 L46 84 L20 70Z" fill="#e8dfc2" ${O}/>`
    },
    butter: {
      block: () => `<path d="M16 52 L58 36 L86 46 L44 64Z" fill="#fff0b0" ${O}/><path d="M44 64 L86 46 L86 64 L44 82Z" fill="#fbe39a" ${O}/><path d="M16 52 L44 64 L44 82 L16 70Z" fill="#f1d27a" ${O}/>` +
        `<path d="M58 55 L86 46 L86 64 L58 73Z" fill="#fffaf0" ${O2}/><path d="M64 60 l16 -5" stroke="${P.turq}" stroke-width="3"/>`
    },
    rice: {
      dry: () => `<path d="M28 34 Q50 26 72 34 L78 82 Q50 90 22 82 Z" fill="#d9c49a" ${O}/><path d="M30 34 Q40 22 50 30 Q60 22 70 34" fill="#e8d6ae" ${O}/>` +
        (() => { const r = U.rng('rice'); let s = ''; for (let i = 0; i < 12; i++) s += `<ellipse cx="${36 + r() * 28}" cy="${50 + r() * 24}" rx="3.2" ry="1.7" fill="#fffaf0" stroke="${INK}" stroke-width="1" transform="rotate(${r() * 180} ${36 + r() * 28} ${50 + r() * 24})"/>`; return s; })()
    },
    dough: {
      ball: () => `<path d="M18 66 C16 40 34 28 50 28 C66 28 84 40 82 66 Q50 78 18 66Z" fill="#f1dcae" ${O}/>` + hl('M30 50 Q36 38 48 36', '#fff6dc', 5, 0.9) +
        `<circle cx="60" cy="48" r="1.6" fill="#fff"/><circle cx="66" cy="56" r="1.4" fill="#fff"/><circle cx="40" cy="58" r="1.4" fill="#fff"/>`
    },
    banana: {
      whole: () => `<path d="M16 40 C26 74 66 84 86 62 C78 64 52 66 34 46 C30 42 26 36 20 34Z" fill="#f6d64a" ${O}/>` +
        `<path d="M24 44 C38 64 62 72 80 64" stroke="#e2b42a" stroke-width="2.5" fill="none"/><path d="M16 40 l-4 -6 l6 -2Z" fill="${P.chocoLt}" ${O2}/><circle cx="86" cy="62" r="2.5" fill="${P.choco}"/>`,
      sliced: () => [[32, 48], [62, 44], [46, 70], [74, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#fbefc0" ${O2}/><circle cx="${x}" cy="${y}" r="3" fill="none" stroke="#d9c07a" stroke-width="2"/>`).join('')
    },
    apple: {
      whole: () => `<path d="M50 34 C40 24 18 28 20 52 C22 76 38 88 50 82 C62 88 78 76 80 52 C82 28 60 24 50 34Z" fill="#d8443a" ${O}/>` +
        `<path d="M50 34 Q48 22 54 14" ${O} fill="none"/><path d="M54 24 Q66 14 74 20 Q64 30 54 24Z" fill="${P.sage}" ${O2}/>` + hl('M30 46 Q32 38 40 36', '#ffb0a4', 4, 0.9),
      chopped: () => [[32, 48, -20], [62, 44, 30], [46, 72, 100], [72, 70, 200]].map(([x, y, r]) =>
        `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-14 6 A14 14 0 0 1 14 6Z" fill="#fbf0d0" ${O2}/><path d="M-14 6 A14 14 0 0 1 14 6" fill="none" stroke="#d8443a" stroke-width="4"/></g>`).join('')
    },
    sugar: {
      bag: () => `<path d="M28 30 L72 30 L76 86 L24 86Z" fill="#fffdf6" ${O}/><path d="M28 30 L36 22 L64 22 L72 30" fill="#f4ecd8" ${O2}/>` +
        `<rect x="38" y="48" width="12" height="12" fill="#ffffff" ${O2}/><rect x="52" y="52" width="12" height="12" fill="#ffffff" ${O2}/><rect x="44" y="62" width="12" height="12" fill="#ffffff" ${O2}/>` +
        `<path d="M28 40 L72 40" stroke="${P.pink}" stroke-width="5"/>`
    },
    honey: {
      jar: () => `<path d="M28 40 Q26 30 34 28 L66 28 Q74 30 72 40 L74 76 Q74 86 62 86 L38 86 Q26 86 26 76Z" fill="#f2a72c" ${O}/>` +
        `<rect x="32" y="20" width="36" height="10" rx="3" fill="${P.coral}" ${O2}/><path d="M36 50 l6 -4 l6 4 v7 l-6 4 l-6 -4Z M48 58 l6 -4 l6 4 v7 l-6 4 l-6 -4Z" fill="#f7c661" stroke="#c9801a" stroke-width="2"/>` +
        hl('M34 44 L34 74', '#ffd98a', 4, 0.9)
    },
    lemon: {
      whole: () => `<path d="M14 54 Q20 54 24 48 C32 30 68 30 76 48 Q80 54 86 54 Q80 56 76 62 C68 80 32 80 24 62 Q20 56 14 54Z" fill="#f7dc3c" ${O}/>` +
        hl('M32 46 Q40 38 52 38', '#fff4a8', 4, 0.9) + `<path d="M72 44 q8 -10 16 -8 q-6 8 -16 8Z" fill="${P.sage}" ${O2}/>`,
      sliced: () => [[34, 50], [64, 46], [50, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#f7dc3c" ${O2}/><circle cx="${x}" cy="${y}" r="11" fill="#fff3a6"/>` +
        [0, 60, 120].map((a) => `<path d="M${x} ${y} l${Math.cos(a * Math.PI / 180) * 11} ${Math.sin(a * Math.PI / 180) * 11} M${x} ${y} l${-Math.cos(a * Math.PI / 180) * 11} ${-Math.sin(a * Math.PI / 180) * 11}" stroke="#f0c93a" stroke-width="1.6"/>`).join('')).join('')
    }
  });


  /* ---------- V2.1 ingredients ---------- */
  Object.assign(T, {
    eggplant: {
      whole: () => `<path d="M30 40 C18 56 22 82 44 86 C66 90 84 74 80 54 C78 40 66 36 58 30 C48 24 38 30 30 40Z" fill="#6a3a78" ${O}/>` +
        hl('M32 56 Q34 46 42 42', '#a879b8', 5, 0.9) +
        `<path d="M50 30 C56 18 70 18 74 26 C66 26 62 32 60 38 C56 32 52 32 50 30Z" fill="${P.sageDk}" ${O2}/><path d="M66 20 L72 10" ${O}/>`,
      sliced: () => [[32, 48], [62, 44], [46, 72], [74, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="#f4ecd2" stroke="#6a3a78" stroke-width="4"/>` +
        `<circle cx="${x}" cy="${y}" r="14" fill="none" ${O2}/><circle cx="${x - 4}" cy="${y - 2}" r="1.6" fill="#b49a6a"/><circle cx="${x + 4}" cy="${y + 3}" r="1.6" fill="#b49a6a"/><circle cx="${x + 2}" cy="${y - 5}" r="1.4" fill="#b49a6a"/>`).join('')
    },
    cucumber: {
      whole: () => `<path d="M16 66 C12 58 20 50 30 46 L76 28 C86 24 92 34 86 42 L36 78 C26 84 20 76 16 66Z" fill="#5fa04e" ${O}/>` +
        [[34, 56], [48, 50], [62, 44], [42, 66], [56, 58], [70, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#3d7a32"/>`).join('') + hl('M26 60 L72 36', '#9fd08a', 3, 0.8),
      sliced: () => [[32, 48], [62, 44], [46, 72], [74, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="#dff0c8" stroke="#3d7a32" stroke-width="4"/><circle cx="${x}" cy="${y}" r="14" fill="none" ${O2}/>` +
        [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x + Math.cos(a * Math.PI / 180) * 6}" cy="${y + Math.sin(a * Math.PI / 180) * 6}" rx="1.6" ry="2.4" fill="#f6f6dc" transform="rotate(${a} ${x + Math.cos(a * Math.PI / 180) * 6} ${y + Math.sin(a * Math.PI / 180) * 6})"/>`).join('')).join('')
    },
    cream: {
      tub: () => `<path d="M30 40 L34 84 Q50 90 66 84 L70 40Z" fill="#fff6e4" ${O}/><ellipse cx="50" cy="40" rx="20" ry="6" fill="#fffaf0" ${O}/>` +
        `<path d="M40 40 Q38 28 44 22 L56 22 Q62 28 60 40" fill="#fffaf0" ${O2}/><path d="M56 22 L66 16" ${O}/>` +
        `<rect x="33" y="56" width="34" height="12" fill="${P.turq}" ${O2}/><path d="M42 62 q4 -4 8 0 q4 4 8 0" stroke="#fff" stroke-width="2" fill="none"/>`
    },
    tuna: {
      can: () => `<path d="M18 46 L18 70 Q50 84 82 70 L82 46" fill="#cfd8dc" ${O}/><path d="M18 52 Q50 66 82 52 L82 66 Q50 80 18 66Z" fill="${P.turq}"/>` +
        `<ellipse cx="50" cy="46" rx="32" ry="11" fill="#e6eef0" ${O}/><ellipse cx="50" cy="46" rx="24" ry="7" fill="none" stroke="#9aa3a8" stroke-width="2"/>` +
        `<path d="M36 64 Q46 56 56 62 L62 58 L62 68 L56 64 Q46 70 36 64Z" fill="#fffaf0" ${O2}/><circle cx="40" cy="62" r="1" fill="${INK}"/><path d="M62 40 L74 34 L76 38" ${O2} fill="none"/>`
    },
    yogurt: {
      cup: () => `<path d="M26 36 L34 84 Q50 90 66 84 L74 36Z" fill="#fbf8f2" ${O}/><ellipse cx="50" cy="36" rx="24" ry="7" fill="#d9e0e4" ${O}/>` +
        `<path d="M29 52 L71 52 L68 72 L32 72Z" fill="${P.pink}"/><circle cx="44" cy="62" r="4" fill="#e8434f" ${O2}/><circle cx="56" cy="60" r="3.4" fill="#e8434f" ${O2}/>` +
        `<path d="M70 36 L84 26" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M70 36 L84 26" stroke="#d9e0e4" stroke-width="2" stroke-linecap="round"/>`
    },
    tortilla: {
      flat: () => `<ellipse cx="50" cy="62" rx="36" ry="16" fill="#dcb874" ${O}/><ellipse cx="50" cy="56" rx="36" ry="16" fill="#efd49a" ${O}/>` +
        [[36, 52], [56, 50], [64, 60], [44, 62], [50, 56]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="2" fill="#c98a45" opacity=".75"/>`).join('')
    },
    noodles: {
      brick: () => `<rect x="20" y="34" width="60" height="40" rx="10" fill="#f3d67e" ${O}/>` +
        [40, 48, 56, 64].map((y, k) => `<path d="M24 ${y} q6 -5 12 0 t12 0 t12 0 t12 0 t6 0" fill="none" stroke="${k % 2 ? '#e2b44a' : '#fbe6a8'}" stroke-width="3"/>`).join('') +
        `<path d="M20 74 L80 74" ${O}/>`
    },
    oats: {
      box: () => `<rect x="30" y="26" width="40" height="58" rx="6" fill="#e6d1a2" ${O}/><ellipse cx="50" cy="26" rx="20" ry="6" fill="${P.coral}" ${O}/>` +
        `<path d="M40 50 l5 -12 l5 12 l5 -12 l5 12" stroke="${P.sageDk}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
        [[22, 84], [30, 88], [74, 86], [80, 82]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.4" fill="#f3e6c4" ${O2}/>`).join('')
    },
    blueberries: {
      whole: () => [[36, 58, 13], [60, 52, 14], [50, 74, 13], [72, 72, 11], [30, 78, 10]].map(([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="#4a5fb8" ${O}/><circle cx="${x - r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.25}" fill="#8fa2e6"/>` +
        `<path d="M${x - 3} ${y - r * 0.55} l3 2 l3 -2" stroke="#2c3a78" stroke-width="1.8" fill="none"/>`).join('') + `<path d="M46 44 Q52 34 62 38 Q54 46 46 44Z" fill="${P.sage}" ${O2}/>`
    },
    orange: {
      whole: () => `<circle cx="50" cy="56" r="28" fill="#f39a2a" ${O}/>` + [[40, 50], [56, 46], [62, 62], [44, 68], [52, 56], [34, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="#d9761a"/>`).join('') +
        hl('M32 48 Q36 38 46 34', '#ffd08a', 5, 0.9) + `<path d="M50 28 Q62 16 72 22 Q62 32 50 28Z" fill="${P.sage}" ${O2}/>`,
      sliced: () => [[34, 50], [64, 46], [50, 72]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="#f39a2a" ${O2}/><circle cx="${x}" cy="${y}" r="11" fill="#ffc46a"/>` +
        [0, 60, 120].map((a) => `<path d="M${x - Math.cos(a * Math.PI / 180) * 11} ${y - Math.sin(a * Math.PI / 180) * 11} L${x + Math.cos(a * Math.PI / 180) * 11} ${y + Math.sin(a * Math.PI / 180) * 11}" stroke="#f39a2a" stroke-width="1.6"/>`).join('')).join('')
    },
    peas: {
      pods: () => `<path d="M14 62 C24 40 60 30 86 38 C70 56 40 70 14 62Z" fill="#7cbf4a" ${O}/>` +
        [[30, 54], [44, 50], [58, 46], [72, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#a8dc6a" ${O2}/>`).join('') +
        `<path d="M14 62 C30 66 56 60 86 38" fill="none" ${O}/><path d="M86 38 q6 -6 4 -14" ${O} fill="none"/>`
    },
    beans: {
      can: () => `<path d="M26 32 L26 80 Q50 90 74 80 L74 32" fill="#cfd8dc" ${O}/><path d="M26 42 Q50 52 74 42 L74 70 Q50 80 26 70Z" fill="#e8423a"/>` +
        `<ellipse cx="50" cy="32" rx="24" ry="8" fill="#e6eef0" ${O}/>` + [[40, 58], [50, 62], [60, 58], [46, 52], [56, 52]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3" fill="#a8442e" ${O2}/>`).join('')
    },
    peanut: {
      jar: () => `<path d="M28 40 Q26 32 34 30 L66 30 Q74 32 72 40 L74 78 Q74 88 62 88 L38 88 Q26 88 26 78Z" fill="#c9853f" ${O}/>` +
        `<rect x="30" y="20" width="40" height="12" rx="3" fill="#e8423a" ${O2}/><rect x="34" y="48" width="32" height="24" rx="5" fill="#fffaf0" ${O2}/>` +
        `<path d="M44 54 C40 58 44 62 48 60 C52 64 58 60 56 56 C58 52 52 48 48 52 C46 50 44 52 44 54Z" fill="#d9a05a" ${O2}/>`
    }
  });

  /* tint every colour in a drawing toward brown as it cooks (ink & whites kept) */
  const toneAll = (svg, ph) => (ph === 'raw' ? svg : svg.replace(/#[0-9a-fA-F]{6}\b/g, (c) => (c.toLowerCase() === INK ? c : tn(c, ph))));

  const ART = {};
  ART.B = B;
  ART.toneAll = toneAll;
  ART.token = (id, state) => {
    const t = T[id] || {};
    const f = t[state] || t[WC.INGREDIENTS[id].start];
    return f ? f() : '';
  };

  /* chop progress: split the drawing into strips that drift apart */
  ART.board = (it) => {
    const raw = ART.token(it.id, it.state);
    if (!it.prog) return raw;
    const n = it.prog + 1, w = 100 / n, cid = 'cp' + it.uid;
    let defs = '<defs>', g = '';
    for (let k = 0; k < n; k++) {
      defs += `<clipPath id="${cid}${k}"><rect x="${k * w}" y="0" width="${w}" height="100"/></clipPath>`;
      g += `<g transform="translate(${(k - (n - 1) / 2) * 6} ${k % 2 ? 2 : 0})"><g clip-path="url(#${cid}${k})">${raw}</g></g>`;
    }
    return defs + '</defs>' + g;
  };
  /* ---------- in containers: the visual must follow the real cooking state ---------- */
  ART.inside = (it, ctx) => {
    const ph = ctx.phase, w = ctx.where, id = it.id, s = it.state;
    const heat = ph !== 'raw';
    const burnt = ph === 'burnt';
    switch (id) {
      case 'egg': {
        if (s === 'whole') return T.egg.whole() + (ph === 'over' || burnt ? `<path d="M40 40 l6 6 l-4 6 l6 5" fill="none" ${O2}/>` : '');
        if (s === 'whisked') {
          if (w === 'pot' && heat) return B.noodle('eggdrop', 4, tn('#f6d36a', ph), 50, 55, 30, 12);
          if (w === 'oven' && heat) {
            const h = { heating: 6, ready: 18, over: 24, burnt: 22 }[ph];
            return `<path d="M20 70 C20 ${70 - h - 20} 80 ${70 - h - 20} 80 70Z" fill="${tn('#f7d873', ph)}" ${O}/><path d="M30 ${64 - h * 0.6} q8 -5 16 0" stroke="#fff3c0" stroke-width="3" fill="none"/>`;
          }
          if (w === 'pan' && heat) {
            if (it.stir >= 1) return ART.curds(ph);
            return `<path d="M16 58 C16 36 84 36 84 58 Q50 70 16 58Z" fill="${tn('#f6cf4a', ph)}" ${O}/><path d="M16 58 Q50 70 84 58" fill="none" ${O}/><circle cx="40" cy="48" r="2.5" fill="${tn('#e2ac2c', ph)}"/><circle cx="60" cy="46" r="2" fill="${tn('#e2ac2c', ph)}"/>`;
          }
          return T.egg.whisked();
        }
        // cracked
        if (w === 'pot') {
          if (!heat) return B.eggWhite('#fffdf6', 0.6) + B.yolk(50, 53, 11);
          if (it.stir >= 1) return B.noodle('eggdrop2', 4, '#fbf3d6', 50, 55, 30, 12);
          return `<path d="M24 56 C18 38 40 30 52 36 C70 30 84 44 76 60 C70 74 40 76 30 68 C24 66 25 60 24 56Z" fill="#fffdf6" ${O}/>` + B.yolk(52, 52, 9, '#f6b13a');
        }
        if (w === 'pan' && it.stir >= 1 && heat) return ART.curds(ph);
        const op = { raw: 0.55, heating: 0.8, ready: 1, over: 1, burnt: 1 }[ph];
        const edge = (it.hotAdd || ph === 'over' || burnt) && heat && w !== 'bowl' ? tn('#d9893c', ph) : null;
        return B.eggWhite(burnt ? tn('#fffdf6', ph) : '#fffdf6', op, edge) + B.yolk(50, 53, 12, tn(ph === 'over' || burnt ? '#e8962a' : '#f7a823', burnt ? 'burnt' : 'raw'));
      }
      case 'tomato': {
        const c = tn('#e9533f', ph);
        if (s === 'whole') return T.tomato.whole().replace('#e9533f', c);
        if (!heat || w === 'bowl') return T.tomato.chopped();
        const pool = { heating: 0.4, ready: 0.85, over: 1, burnt: 1 }[ph];
        const sauce = w === 'pot' ? tn('#d8452f', ph) : tn('#c8382a', ph);
        return `<ellipse cx="50" cy="60" rx="${34 * pool}" ry="${20 * pool}" fill="${sauce}" ${O2}/>` +
          B.tomChunk(38, 54, 0.9 - pool * 0.2, 10, c) + B.tomChunk(62, 58, 0.85 - pool * 0.2, 60, c) + (pool < 0.9 ? B.tomChunk(48, 70, 0.8, 120, c) : '');
      }
      case 'cheese': {
        if (!heat || w === 'bowl') return ART.token('cheese', s);
        // block: slumps as it melts
        const sl = { heating: 0.15, ready: 0.45, over: 0.8, burnt: 0.9 }[ph];
        return `<g transform="translate(0 ${sl * 18}) scale(1 ${1 - sl * 0.45})">${T.cheese.block().replace(/#fbe08a|#f2c443|#e2ac2c/g, (m) => tn(m, ph))}</g>` +
          `<path d="M24 ${74 + sl * 4} Q36 ${86 + sl * 6} 50 ${80} Q64 ${88 + sl * 6} 80 ${72 + sl * 4}" fill="${tn('#f6cf5a', ph)}" ${O2} opacity="${sl}"/>`;
      }
      case 'milk': {
        const c = w === 'pot' ? '#fffaf0' : tn('#fffaf0', ph === 'ready' ? 'heating' : ph);
        return `<ellipse cx="50" cy="60" rx="34" ry="18" fill="${c}" ${O2}/>` + hl('M28 56 Q36 50 46 50', '#fff', 3, 0.9) +
          (heat ? `<path d="M30 64 Q50 70 70 64" stroke="#efe2c8" stroke-width="3" fill="none"/>` : '');
      }
      case 'mushroom': {
        if (s === 'whole') return T.mushroom.whole().replace('#b5764c', tn('#b5764c', ph)).replace('#f4e6cf', tn('#f4e6cf', ph));
        const k = heat ? 0.85 : 1;
        return B.mushSlice(32, 48, 1.25 * k, tn('#efd7b6', ph), tn('#a86d45', ph)) + B.mushSlice(64, 44, 1.2 * k, tn('#efd7b6', ph), tn('#a86d45', ph)) + B.mushSlice(48, 72, 1.15 * k, tn('#efd7b6', ph), tn('#a86d45', ph));
      }
      case 'strawberry': {
        const c = tn(heat ? '#c92f45' : '#e8434f', ph);
        if (s === 'whole') return T.strawberry.whole().replace('#e8434f', c);
        if (s === 'sliced' && !heat) return T.strawberry.sliced();
        if (!heat) return T.strawberry.mashed();
        return `<path d="M18 62 C16 46 34 42 50 44 C68 42 86 50 82 64 C78 76 60 80 48 78 C32 80 20 74 18 62Z" fill="${c}" ${O}/>` + hl('M30 54 Q40 48 52 50', '#ff9fb0', 4, 0.8) +
          (s === 'sliced' ? B.berrySlice(40, 62, 0.8, 0, c) + B.berrySlice(62, 60, 0.8, 20, c) : '');
      }
      case 'pasta': {
        if (w === 'pot' && heat) {
          if (ph === 'heating') return T.pasta.dry().replace(/#f2d18b/g, '#f4dc9c').replace('rotate', 'rotate') ;
          return B.noodle('pst', 6, tn('#f6dc96', ph === 'ready' ? 'raw' : ph), 50, 55, 32, 14);
        }
        return heat ? T.pasta.dry().replace(/#f2d18b/g, tn('#f2d18b', ph)) : T.pasta.dry();
      }
      case 'flour': {
        if (!heat) return `<path d="M20 70 C24 50 40 40 50 40 C60 40 76 50 80 70Z" fill="#fbf8ef" ${O}/><circle cx="34" cy="44" r="1.5" fill="#fff"/><circle cx="68" cy="40" r="1.2" fill="#fff"/>`;
        return [[34, 56, 14], [62, 52, 12], [48, 70, 13], [70, 70, 9]].map(([x, y, r]) =>
          `<path d="M${x - r} ${y} q${r * 0.4} ${-r} ${r} ${-r * 0.8} q${r * 0.8} ${r * 0.1} ${r} ${r * 0.9} q${-r * 0.5} ${r * 0.8} ${-r} ${r * 0.6} q${-r * 0.8} 0 ${-r} ${-r * 0.7}Z" fill="${tn('#efe0bd', ph)}" ${O2}/>`).join('');
      }
      case 'potato': {
        if (s === 'mashed') return T.potato.mashed().replace('#f6e3a8', tn('#f6e3a8', ph === 'ready' ? 'raw' : ph));
        if (s === 'whole') {
          const c = tn(w === 'oven' ? '#b98545' : '#d9a85b', ph);
          return T.potato.whole().replace('#d9a85b', c) + (heat && ph !== 'heating' && w === 'oven' ? `<path d="M38 48 L50 58 L62 46" fill="none" stroke="#fff1c2" stroke-width="4" stroke-linecap="round"/>` : '');
        }
        const c = heat ? tn('#f3c95f', ph === 'heating' ? 'raw' : ph) : '#f3e2a8';
        return B.fry(36, 44, 34, -20, c) + B.fry(60, 50, 34, 25, c) + B.fry(44, 66, 34, 5, c) + B.fry(66, 72, 26, -35, c);
      }
      case 'chocolate': {
        if (!heat) return ART.token('chocolate', s);
        if (ph === 'heating') return B.shard(36, 52, 1, 10) + B.shard(62, 50, 1, -30) + `<ellipse cx="50" cy="66" rx="22" ry="8" fill="${P.choco}" ${O2}/>`;
        return `<path d="M16 60 C14 44 36 40 50 42 C68 40 88 48 84 62 C80 76 58 80 46 78 C30 80 18 72 16 60Z" fill="${tn(P.choco, ph === 'ready' ? 'raw' : ph)}" ${O}/>` + hl('M28 54 Q38 46 52 48', '#a26a48', 4, 0.9);
      }
      case 'bread': {
        const crust = tn('#c98a45', ph), crumb = tn(it.premixed ? '#f1cf6e' : '#f4dca3', ph === 'heating' ? 'raw' : ph === 'ready' ? 'heating' : ph);
        return `<path d="M24 46 C16 30 30 18 50 20 C70 18 84 30 76 46 L74 84 L26 84 Z" fill="${crust}" ${O}/><path d="M31 47 C25 35 35 27 50 28 C65 27 75 35 69 47 L67 77 L33 77 Z" fill="${crumb}"/>` +
          (ph === 'ready' || ph === 'over' ? `<path d="M36 40 l10 0 M40 54 l12 0 M38 66 l14 0" stroke="${tn('#c98a45', 'heating')}" stroke-width="3" stroke-linecap="round" opacity=".6"/>` : '');
      }
      case 'onion': {
        if (s === 'whole') return T.onion.whole().replace('#b65a7f', tn('#b65a7f', ph));
        if (!heat) return T.onion.chopped();
        const c = ph === 'heating' ? '#f6e6ec' : ph === 'ready' ? '#f2dcb8' : tn('#c98a45', ph === 'over' ? 'heating' : ph);
        const e = ph === 'heating' ? '#c98aa6' : tn('#b07040', ph);
        return B.onionBit(34, 50, 1.3, -10, c, e) + B.onionBit(62, 46, 1.3, 20, c, e) + B.onionBit(46, 68, 1.3, 170, c, e) + B.onionBit(70, 70, 1.1, 40, c, e) + B.onionBit(28, 72, 1, 200, c, e);
      }
      case 'rice': {
        if (!heat) return T.rice.dry().replace(/<path[^>]*#d9c49a[^>]*\/>|<path[^>]*#e8d6ae[^>]*\/>/g, '');
        const r = U.rng('ricec'); let g = `<path d="M18 70 C20 50 36 42 50 42 C66 42 80 50 82 70 Q50 78 18 70Z" fill="${tn('#fbf6e9', ph === 'ready' ? 'raw' : ph)}" ${O}/>`;
        for (let i = 0; i < 18; i++) { const x = 28 + r() * 44, y = 50 + r() * 18; g += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="1.8" fill="#fff" stroke="#d8ccb0" stroke-width="1" transform="rotate(${r() * 180} ${x} ${y})"/>`; }
        return g;
      }
      case 'butter': {
        if (!heat) return T.butter.block();
        return `<ellipse cx="50" cy="62" rx="30" ry="14" fill="${tn('#fbe39a', ph === 'ready' ? 'raw' : ph)}" ${O2} opacity=".9"/>` + hl('M30 58 Q40 52 54 54', '#fff6c8', 3, 0.9);
      }
      case 'sugar': {
        if (!heat) { const r = U.rng('sug'); let g = `<path d="M24 72 C30 56 44 50 50 50 C58 50 72 56 76 72Z" fill="#fffdf6" ${O2}/>`; for (let i = 0; i < 6; i++) g += `<rect x="${32 + r() * 34}" y="${56 + r() * 12}" width="4" height="4" fill="#fff" stroke="#d8ccb0" stroke-width="1"/>`; return g; }
        return `<ellipse cx="50" cy="62" rx="26" ry="12" fill="${tn('#f3c46a', ph)}" ${O2}/>` + hl('M32 58 Q42 52 54 54', '#ffe7a8', 3, 0.9);
      }
      case 'honey':
        return `<path d="M20 64 C22 50 40 46 52 48 C68 46 82 54 78 66 C74 76 56 78 46 76 C30 78 18 74 20 64Z" fill="${tn('#f2a72c', ph === 'ready' ? 'raw' : ph)}" ${O}/>` + hl('M30 58 Q40 52 52 52', '#ffd98a', 4, 0.9);
      case 'dough': {
        if (!heat) return T.dough.ball();
        if (w === 'pot') { const k = { heating: 1.05, ready: 1.2, over: 1.3, burnt: 1.3 }[ph]; return `<g transform="translate(${50 - 50 * k} ${55 - 55 * k}) scale(${k})">${toneAll(T.dough.ball(), 'heating')}</g>`; }
        const h = { heating: 4, ready: 12, over: 14, burnt: 14 }[ph];
        return `<ellipse cx="50" cy="${66 - h / 2}" rx="38" ry="${12 + h}" fill="${tn('#e9c27a', ph)}" ${O}/><ellipse cx="44" cy="${58 - h}" rx="12" ry="4" fill="#fff6dc" opacity=".6"/>`;
      }
      case 'cream': case 'yogurt': {
        const c = id === 'cream' ? '#fff6e4' : '#fbf8f2';
        if (!heat && w !== 'pot') return T[id][s]();
        return `<ellipse cx="50" cy="62" rx="32" ry="15" fill="${tn(c, ph === 'ready' ? 'raw' : ph)}" ${O2}/>` + hl('M30 58 Q40 52 54 54', '#fff', 3, 0.9);
      }
      case 'noodles': {
        if (w === 'pot' && heat && ph !== 'heating') return B.noodle('ndl', 6, tn('#f3d67e', ph === 'ready' ? 'raw' : ph), 50, 55, 32, 14);
        return toneAll(T.noodles.brick(), heat ? ph : 'raw');
      }
      case 'oats': {
        if (!heat) return T.oats.box();
        const r = U.rng('oat'); let g = `<path d="M18 70 C22 52 36 46 50 46 C64 46 78 52 82 70 Q50 78 18 70Z" fill="${tn('#ead8ae', ph === 'ready' ? 'raw' : ph)}" ${O}/>`;
        for (let i = 0; i < 10; i++) { const x = 28 + r() * 44, y = 54 + r() * 14; g += `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.2" fill="#f6ead0" stroke="#c9a96a" stroke-width="1"/>`; }
        return g;
      }
      case 'peanut':
        if (!heat) return T.peanut.jar();
        return `<path d="M20 64 C22 50 40 46 52 48 C68 46 82 54 78 66 C74 76 56 78 46 76 C30 78 18 74 20 64Z" fill="${tn('#c9853f', ph === 'ready' ? 'raw' : ph)}" ${O}/>` + hl('M30 58 Q40 52 52 52', '#e6b47a', 4, 0.9);
      case 'peas':
        if (!heat) return T.peas.pods();
        return [[32, 54], [44, 50], [56, 56], [68, 50], [40, 66], [54, 68], [66, 64], [48, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${tn('#8fd05a', ph === 'ready' ? 'raw' : ph)}" ${O2}/>`).join('');
      case 'beans':
        if (!heat && w !== 'pot') return T.beans.can();
        return `<ellipse cx="50" cy="62" rx="30" ry="13" fill="${tn('#c8442e', heat ? ph : 'raw')}" opacity=".85" ${O2}/>` +
          [[36, 58], [48, 54], [60, 58], [42, 66], [56, 66]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.4" fill="${tn('#a8442e', heat ? ph : 'raw')}" ${O2}/>`).join('');
      case 'tuna':
        if (!heat && w !== 'pot') return T.tuna.can();
        return [[36, 54], [58, 50], [48, 68], [66, 66]].map(([x, y], k) => `<path d="M${x - 10} ${y} q4 -9 12 -7 q9 2 8 9 q-4 7 -12 6 q-8 -1 -8 -8Z" fill="${tn('#d9a08a', heat ? ph : 'raw')}" ${O2}/>`).join('');
      case 'spinach': {
        if (!heat) return T.spinach.leaves();
        return `<path d="M24 66 C30 52 44 50 50 54 C58 48 74 52 76 66 Q50 74 24 66Z" fill="${tn('#2f6e36', ph === 'ready' ? 'raw' : ph)}" ${O2}/><path d="M34 62 q8 -6 14 0 q8 -6 16 0" stroke="#5aa45e" stroke-width="2" fill="none"/>`;
      }
    }
    return toneAll(ART.token(id, s), heat ? (ph === 'ready' ? 'heating' : ph) : 'raw');
  };

  ART.curds = (ph) => {
    const r = U.rng('curd'); let s = '';
    for (let i = 0; i < 9; i++) {
      const x = 26 + r() * 48, y = 42 + r() * 30, rr = 7 + r() * 5;
      s += `<path d="M${x - rr} ${y} q${rr * 0.3} ${-rr} ${rr} ${-rr * 0.8} q${rr} 0 ${rr} ${rr * 0.8} q${-rr * 0.3} ${rr} ${-rr} ${rr * 0.8} q${-rr} 0 ${-rr} ${-rr * 0.8}Z" fill="${tn('#f9dc6c', ph === 'ready' ? 'raw' : ph)}" ${O2}/>`;
    }
    return s;
  };

  /* mixtures (premixed liquids) render as one blended pool */
  ART.LIQUID = (it) => ['egg', 'milk', 'flour', 'butter', 'honey', 'sugar', 'cream', 'yogurt', 'peanut'].includes(it.id) || it.state === 'mashed' || (it.id === 'chocolate' && it.mixedWith.includes('milk'));
  const POOL_C = { egg: '#f6c94a', milk: '#fffaf0', cream: '#fff3dc', yogurt: '#fbf6ee', peanut: '#c9853f', blueberries: '#5a5ab0', orange: '#f7a83a', flour: '#f3ead6', strawberry: '#f08ca0', chocolate: '#7b4a33', potato: '#f6e3a8' };
  ART.poolColor = (items) => U.mixMany(items.map((i) => POOL_C[i.id] || WC.INGREDIENTS[i.id].color));
  ART.pool = (items, ctx) => {
    const ph = ctx.phase, w = ctx.where, heat = ph !== 'raw';
    const hasFlour = items.some((i) => i.id === 'flour');
    const base = ART.poolColor(items);
    if (hasFlour && heat && w === 'pan') {
      const c = tn(U.mix(base, '#f2c46a', 0.5), ph === 'heating' ? 'raw' : ph);
      return `<ellipse cx="50" cy="62" rx="34" ry="16" fill="${tn('#c98a45', ph)}" ${O}/><ellipse cx="50" cy="58" rx="33" ry="15" fill="${c}" ${O2}/>` +
        (ph !== 'heating' ? '' : B.bubbles('pk', 6, 50, 58, 22, 8, '#fff6dc'));
    }
    if (hasFlour && heat && w === 'oven') {
      const h = { heating: 8, ready: 20, over: 24, burnt: 24 }[ph];
      return `<path d="M14 74 L86 74 L84 ${66 - h} Q50 ${50 - h * 1.5} 16 ${66 - h}Z" fill="${tn(U.mix(base, '#e6b45c', 0.5), ph)}" ${O}/><path d="M24 ${62 - h} q12 -6 24 0 q12 6 24 0" stroke="#fff0c4" stroke-width="3" fill="none" opacity=".7"/>`;
    }
    if (items.some((i) => i.id === 'egg') && !hasFlour && heat && w !== 'bowl') {
      const egg = items.find((i) => i.id === 'egg');
      return ART.inside(egg, ctx);
    }
    const c = heat ? tn(base, ph === 'ready' ? 'heating' : ph) : base;
    return `<ellipse cx="50" cy="60" rx="34" ry="18" fill="${c}" ${O}/>` + hl('M30 56 Q40 49 52 50', '#fff', 3, 0.6) +
      `<path d="M32 62 q9 -6 18 0 t18 0" stroke="${U.mix(c, '#ffffff', 0.35)}" stroke-width="2.5" fill="none"/>`;
  };

  WC.Art = ART;
})(window.WC);
