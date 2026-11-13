/* Illustrated recipe book: discovered dishes only; the rest stay hidden. */
(function (WC) {
  'use strict';
  const U = WC.U;
  const Bk = {};
  const TYPE_LABEL = { familiar: 'Classic', unusual: 'Unusual', surreal: 'Surprise', improv: 'Improvisation' };
  const GROUPS = [['familiar', 'Classics'], ['unusual', 'Unusual experiments'], ['surreal', 'Surprises']];

  const ingIcons = (ids) => ids.map((id) =>
    `<span class="ing-chip" title="${WC.INGREDIENTS[id].name}">${U.svg('0 0 100 100', WC.Art.token(id, WC.INGREDIENTS[id].start), 'tok')}<em>${WC.INGREDIENTS[id].name}</em></span>`).join('');
  Bk.ingIcons = ingIcons;

  Bk.methodText = (facts) => ({ boil: 'Pot on the stove', bake: 'Oven' }[facts.method] || 'Cooked') + ' · ' + WC.PHASE_WORD[facts.P].toLowerCase();

  Bk.prepSteps = (steps) => (steps || []).filter((s) => !/^(Took out|Put back|Served)/.test(s));

  Bk.open = (focusId) => {
    const el = document.getElementById('book');
    el.hidden = false;
    document.body.classList.add('modal-open');
    if (focusId && WC.Storage.has(focusId)) Bk.detail(focusId); else Bk.grid();
  };
  Bk.close = () => {
    document.getElementById('book').hidden = true;
    document.body.classList.remove('modal-open');
  };

  Bk.grid = () => {
    const book = WC.Storage.data().book;
    const ids = Object.keys(WC.OUTCOMES);
    const found = ids.filter((id) => book[id]).length;
    const surprises = ids.filter((id) => WC.OUTCOMES[id].type === 'surreal');
    document.getElementById('book-progress').textContent =
      `${found} of ${ids.length} dishes discovered · ${surprises.filter((id) => book[id]).length} of ${surprises.length} surprises`;
    let html = '';
    GROUPS.forEach(([type, label]) => {
      const list = ids.filter((id) => WC.OUTCOMES[id].type === type);
      html += `<h3 class="book-group">${label} <small>${list.filter((id) => book[id]).length}/${list.length}</small></h3><div class="book-grid">`;
      list.sort((a, b) => (book[b] ? 1 : 0) - (book[a] ? 1 : 0)).forEach((id) => {
        const e = book[id];
        if (e) {
          html += `<button class="book-entry ${type}" data-entry="${id}" aria-label="${WC.OUTCOMES[id].name}">` +
            WC.dishSVG(id, e.facts, 'thumb still') + `<span class="be-name">${e.name || WC.OUTCOMES[id].name}</span></button>`;
        } else {
          html += `<div class="book-entry locked ${type}" aria-label="Undiscovered">` +
            U.svg('0 0 200 200', `<ellipse cx="100" cy="132" rx="86" ry="46" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="6 10"/><text x="100" y="128" text-anchor="middle" class="q">?</text>`, 'thumb') +
            `<span class="be-name">???</span></div>`;
        }
      });
      html += '</div>';
    });
    const imps = Object.keys(book).filter((k) => k.startsWith('imp:'));
    html += `<h3 class="book-group">Kitchen improvisations <small>${imps.length} invented</small></h3>` +
      (imps.length ? `<div class="book-grid">` + imps.map((id) => `<button class="book-entry improv" data-entry="${id}" aria-label="${book[id].name}">` +
        WC.dishSVG(id, book[id].facts, 'thumb still') + `<span class="be-name">${book[id].name}</span></button>`).join('') + '</div>'
        : `<p class="book-empty small">Combinations no classic recipe covers get their own name here.</p>`);
    if (!found) html = `<p class="book-empty">Nothing yet. Every dish you plate lands here — try anything.</p>` + html;
    document.getElementById('book-body').innerHTML = html;
    document.getElementById('book-body').scrollTop = 0;
  };

  Bk.detail = (id) => {
    const e = WC.Storage.data().book[id];
    const o = Object.assign({}, WC.OUTCOMES[id] || {}, e ? { name: e.name || (WC.OUTCOMES[id] || {}).name, desc: e.desc || (WC.OUTCOMES[id] || {}).desc,
      type: e.type || (WC.OUTCOMES[id] || {}).type, anim: e.anim || (WC.OUTCOMES[id] || {}).anim || 'pop', why: e.why || (WC.OUTCOMES[id] || {}).why } : {});
    if (!e) return Bk.grid();
    const steps = Bk.prepSteps(e.steps);
    document.getElementById('book-body').innerHTML =
      `<article class="book-detail ${o.type}"><button class="back" data-back="1">‹ all recipes</button>` +
      `<div class="bd-art">${WC.dishSVG(id, e.facts, 'big anim-' + o.anim)}</div>` +
      `<div class="bd-text"><span class="type-tag ${o.type}">${TYPE_LABEL[o.type]}</span><h3>${o.name}</h3><p class="bd-desc">${o.desc}</p>` +
      `<p class="bd-why">${typeof o.why === 'function' ? o.why(WC.Engine.wrap(e.facts)) : o.why}</p>` +
      `<h4>Ingredients</h4><div class="ing-row">${ingIcons(e.ingredients)}</div>` +
      `<h4>${Bk.methodText(e.facts)}</h4>` +
      `<h4>What you did</h4><ol class="steps">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>` +
      `<p class="bd-meta">Made ${e.times || 1}×</p>` +
      `<button class="btn primary" data-recreate="${id}">Recreate this recipe</button></div></article>`;
    document.getElementById('book-body').scrollTop = 0;
  };

  Bk.updateCount = () => {
    const c = document.getElementById('book-count');
    if (c) c.textContent = WC.Storage.count();
  };

  Bk.bind = () => {
    document.getElementById('book-close').addEventListener('click', Bk.close);
    document.getElementById('book').addEventListener('click', (ev) => {
      if (ev.target.id === 'book') return Bk.close();
      const en = ev.target.closest('[data-entry]');
      if (en) return Bk.detail(en.dataset.entry);
      if (ev.target.closest('[data-back]')) return Bk.grid();
      const rc = ev.target.closest('[data-recreate]');
      if (rc) { Bk.close(); WC.Game.recreate(rc.dataset.recreate); }
    });
  };

  WC.Book = Bk;
})(window.WC);
