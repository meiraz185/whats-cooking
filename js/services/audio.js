/* Procedurally generated sound (Web Audio). Nothing plays before the first user gesture.
   The game works fully without sound. */
(function (WC) {
  'use strict';
  const Au = { muted: false, ctx: null, loops: {} };
  let noiseBuf = null;

  Au.init = () => {
    if (Au.ctx) { if (Au.ctx.state === 'suspended') Au.ctx.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    try {
      Au.ctx = new C();
      Au.master = Au.ctx.createGain();
      Au.master.gain.value = Au.muted ? 0 : 0.55;
      Au.master.connect(Au.ctx.destination);
      const len = Au.ctx.sampleRate * 1.5;
      noiseBuf = Au.ctx.createBuffer(1, len, Au.ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { Au.ctx = null; }
  };
  Au.setMuted = (m) => {
    Au.muted = !!m;
    if (Au.master) Au.master.gain.setTargetAtTime(m ? 0 : 0.55, Au.ctx.currentTime, 0.03);
  };
  const ok = () => Au.ctx && !Au.muted;

  function tone(freq, dur, type = 'sine', vol = 0.3, when = 0, slide) {
    if (!ok()) return;
    const t = Au.ctx.currentTime + when;
    const o = Au.ctx.createOscillator(), g = Au.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(Au.master); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(dur, freq, q = 1, vol = 0.3, type = 'bandpass', when = 0) {
    if (!ok()) return;
    const t = Au.ctx.currentTime + when;
    const s = Au.ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = Au.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = Au.ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(Au.master);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }

  const SFX = {
    pick: () => tone(520, 0.09, 'triangle', 0.18, 0, 760),
    drop: () => tone(300, 0.12, 'sine', 0.22, 0, 180),
    crack: () => { noise(0.05, 2400, 3, 0.5); noise(0.08, 1200, 2, 0.35, 'bandpass', 0.04); tone(180, 0.15, 'sine', 0.15, 0.08, 90); },
    chop: () => { noise(0.04, 3200, 2, 0.45); tone(140, 0.06, 'square', 0.08); },
    stir: () => noise(0.18, 900, 0.8, 0.08, 'lowpass'),
    mash: () => { tone(90, 0.14, 'sine', 0.35, 0, 60); noise(0.08, 400, 1, 0.2, 'lowpass'); },
    mixed: () => { tone(660, 0.12, 'triangle', 0.15); tone(880, 0.16, 'triangle', 0.13, 0.08); },
    click: () => tone(1400, 0.03, 'square', 0.08),
    plop: () => { tone(220, 0.12, 'sine', 0.3, 0, 480); },
    sizzleIn: () => noise(0.5, 6000, 0.7, 0.25, 'highpass'),
    oven: () => { tone(110, 0.25, 'sawtooth', 0.06, 0, 90); noise(0.1, 800, 1, 0.12, 'lowpass'); },
    ready: () => { tone(988, 0.12, 'sine', 0.16); tone(1318, 0.2, 'sine', 0.14, 0.1); },
    burnt: () => { tone(220, 0.3, 'sawtooth', 0.08, 0, 160); },
    no: () => { tone(200, 0.09, 'square', 0.07); tone(160, 0.12, 'square', 0.07, 0.09); },
    reveal: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.28, 'triangle', 0.16, i * 0.09)),
    // V2 additions — same procedural character, kept quiet
    ignite: () => { tone(1600, 0.025, 'square', 0.07); tone(1300, 0.025, 'square', 0.06, 0.06); noise(0.35, 700, 0.6, 0.16, 'lowpass', 0.1); },
    ovenOn: () => { tone(1400, 0.03, 'square', 0.07); tone(110, 0.3, 'sawtooth', 0.05, 0.05, 95); },
    doorOpen: () => { tone(320, 0.18, 'triangle', 0.08, 0, 220); noise(0.12, 500, 1, 0.1, 'lowpass', 0.05); },
    doorClose: () => { noise(0.06, 300, 1, 0.22, 'lowpass'); tone(90, 0.12, 'sine', 0.25, 0, 60); },
    tray: () => { tone(900, 0.06, 'triangle', 0.08); tone(600, 0.08, 'triangle', 0.06, 0.04); },
    bakeDone: () => { tone(1568, 0.14, 'sine', 0.13); tone(1568, 0.14, 'sine', 0.13, 0.22); tone(2093, 0.2, 'sine', 0.11, 0.44); },
    // V2.1 additions (quiet, same character)
    whoosh: () => noise(0.22, 1400, 0.7, 0.06, 'bandpass'),
    settle: () => tone(420, 0.07, 'triangle', 0.08, 0, 300),
    splash: () => { noise(0.18, 1800, 0.9, 0.12, 'bandpass'); tone(260, 0.1, 'sine', 0.12, 0.02, 520); },
    serve: () => { noise(0.25, 1100, 0.7, 0.07, 'bandpass'); tone(1760, 0.12, 'sine', 0.1, 0.32); tone(2349, 0.18, 'sine', 0.08, 0.38); },
    weird: () => [392, 466, 554, 740, 698].forEach((f, i) => tone(f, 0.3, i % 2 ? 'triangle' : 'sine', 0.14, i * 0.1, f * 1.06))
  };
  Au.log = [];
  Au.play = (name) => { Au.log.push(name); if (Au.log.length > 200) Au.log.shift(); try { if (SFX[name]) SFX[name](); } catch (e) { /* ignore */ } };
  Au.has = (name) => !!SFX[name];

  /* continuous loops: bubbling (pot) and oven hum (sizzle kept for future use) */
  Au.loop = (name, on) => {
    if (!Au.ctx) return;
    const L = Au.loops;
    if (on && !L[name]) {
      const g = Au.ctx.createGain(); g.gain.value = 0; g.connect(Au.master);
      let src;
      if (name === 'sizzle' || name === 'oven') {
        src = Au.ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
        const f = Au.ctx.createBiquadFilter();
        f.type = name === 'sizzle' ? 'highpass' : 'lowpass'; f.frequency.value = name === 'sizzle' ? 5000 : 220;
        src.connect(f); f.connect(g); src.start();
        g.gain.setTargetAtTime(name === 'sizzle' ? 0.06 : 0.1, Au.ctx.currentTime, 0.3);
      } else {
        // bubbling: periodic blips
        src = { stop: () => clearInterval(src.iv) };
        src.iv = setInterval(() => { if (ok()) tone(180 + Math.random() * 260, 0.07, 'sine', 0.06, 0, 300 + Math.random() * 300); }, 170);
      }
      L[name] = { src, g };
    } else if (!on && L[name]) {
      const { src, g } = L[name];
      try { g.gain.setTargetAtTime(0, Au.ctx.currentTime, 0.1); setTimeout(() => { try { src.stop(); } catch (e) {} }, 400); } catch (e) {}
      delete L[name];
    }
  };
  Au.stopLoops = () => Object.keys(Au.loops).forEach((k) => Au.loop(k, false));

  WC.Audio = Au;
})(window.WC);
