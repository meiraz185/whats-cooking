/* localStorage persistence (safe if storage is unavailable) */
(function (WC) {
  'use strict';
  const KEY = 'whats-cooking-v2';
  let mem = { book: {}, muted: false };

  const St = {};
  St.load = () => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) mem = Object.assign(mem, JSON.parse(raw));
    } catch (e) { /* private mode etc. — keep in memory */ }
    if (!mem.book || typeof mem.book !== 'object') mem.book = {};
    return mem;
  };
  St.save = () => {
    try { window.localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* ignore */ }
  };
  St.data = () => mem;
  St.has = (id) => !!mem.book[id];
  /* record: {facts, ingredients, steps, method, at, times} */
  St.record = (id, entry, overwrite) => {
    const isNew = !mem.book[id];
    if (isNew || overwrite) {
      mem.book[id] = Object.assign({}, entry, { at: Date.now(), times: ((mem.book[id] && mem.book[id].times) || 0) + 1 });
    } else {
      mem.book[id].times = (mem.book[id].times || 1) + 1;
    }
    St.save();
    return isNew;
  };
  St.count = () => Object.keys(mem.book).filter((k) => WC.OUTCOMES[k]).length;
  St.setMuted = (m) => { mem.muted = !!m; St.save(); };
  St.clearAll = () => { mem.book = {}; St.save(); };
  WC.Storage = St;
})(window.WC);
