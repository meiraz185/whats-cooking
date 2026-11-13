/* WHAT'S COOKING? V1 — core utilities (no dependencies) */
window.WC = window.WC || {};
(function (WC) {
  'use strict';
  const U = {};

  U.INK = '#3a2318';
  U.PAL = {
    cream: '#fbf1dc', cream2: '#f4e3c3', coral: '#ef6a50', coralDk: '#c9452f',
    butter: '#f6cf5a', butterDk: '#e2ac2c', sage: '#9db58a', sageDk: '#6f8c5e',
    turq: '#6cc3bf', turqDk: '#3f9a96', choco: '#5a3524', chocoLt: '#8a5638',
    pink: '#f39ab0', white: '#fffaf0', char: '#2b1a12'
  };

  U.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  U.lerp = (a, b, t) => a + (b - a) * t;

  U.hex2rgb = (h) => {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  U.rgb2hex = (r, g, b) =>
    '#' + [r, g, b].map((v) => Math.round(U.clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
  U.mix = (a, b, t) => {
    const A = U.hex2rgb(a), B = U.hex2rgb(b);
    return U.rgb2hex(U.lerp(A[0], B[0], t), U.lerp(A[1], B[1], t), U.lerp(A[2], B[2], t));
  };
  U.mixMany = (cols) => {
    if (!cols.length) return '#ffffff';
    const s = [0, 0, 0];
    cols.forEach((c) => { const r = U.hex2rgb(c); s[0] += r[0]; s[1] += r[1]; s[2] += r[2]; });
    return U.rgb2hex(s[0] / cols.length, s[1] / cols.length, s[2] / cols.length);
  };

  /* Cooking phase -> browning amount. Used to tint food as it cooks. */
  U.BROWN = { raw: 0, heating: 0.04, ready: 0.16, over: 0.38, burnt: 0.82 };
  U.tone = (c, phase) => {
    const k = U.BROWN[phase] || 0;
    if (!k) return c;
    const mid = phase === 'burnt' ? U.PAL.char : '#8a4a1c';
    return U.mix(c, mid, k);
  };

  /* Deterministic pseudo random (same dish => same drawing every time) */
  U.rng = (seed) => {
    let s = 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0;
    s = s || 1;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };

  U.svg = (vb, inner, cls = '', extra = '') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" class="${cls}" ${extra}>${inner}</svg>`;

  U.$ = (sel, root) => (root || document).querySelector(sel);
  U.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  U.clone = (o) => JSON.parse(JSON.stringify(o));

  let uidN = 0;
  U.uid = (p = 'u') => p + (++uidN) + Math.random().toString(36).slice(2, 5);

  U.list = (arr) => {
    if (arr.length <= 1) return arr.join('');
    return arr.slice(0, -1).join(', ') + ' & ' + arr[arr.length - 1];
  };

  WC.U = U;
})(window.WC);
