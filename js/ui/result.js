/* The final dish reveal on a plate */
(function (WC) {
  'use strict';
  const Rs = { current: null };
  const TYPE_BADGE = { familiar: 'A classic', unusual: 'Unusual, but plausible', surreal: 'Surprise discovery!', improv: 'Kitchen improvisation' };

  Rs.show = (outcome, facts) => {
    const served = WC.State.st.served;
    const entry = { facts, ingredients: served.ingredients, steps: served.steps, method: facts.method, name: outcome.name,
      desc: outcome.desc, why: WC.Engine.why(outcome, facts), type: outcome.type, anim: outcome.anim };
    const isNew = WC.Storage.record(outcome.id, entry, false);
    Rs.current = { outcome, facts, entry, isNew, saved: isNew };
    WC.Book.updateCount();

    const el = document.getElementById('result');
    document.getElementById('res-badge').innerHTML =
      (isNew ? '<span class="new">New discovery</span>' : '<span class="again">Made it again</span>') +
      `<span class="type-tag ${outcome.type}">${TYPE_BADGE[outcome.type]}</span>`;
    document.getElementById('res-stage').innerHTML = WC.dishSVG(outcome.id, facts, 'big anim-' + outcome.anim);
    document.getElementById('res-name').textContent = outcome.name;
    document.getElementById('res-desc').textContent = outcome.desc;
    document.getElementById('res-why').textContent = WC.Engine.why(outcome, facts);
    const steps = WC.Book.prepSteps(served.steps).slice(-6);
    document.getElementById('res-facts').innerHTML =
      `<div class="ing-row">${WC.Book.ingIcons(served.ingredients)}</div>` +
      `<p class="res-method">${WC.Book.methodText(facts)}</p>` +
      `<ol class="steps small">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>`;
    const save = document.getElementById('res-save');
    save.textContent = isNew ? 'Saved to book ✓' : 'Save this version';
    save.classList.toggle('done', isNew);
    el.hidden = false;
    el.querySelector('.result-card').scrollTop = 0;
    document.body.classList.add('modal-open');
    WC.Audio.play(outcome.type === 'surreal' ? 'weird' : 'reveal');
    setTimeout(() => document.getElementById('res-again').focus({ preventScroll: true }), 50);
  };

  Rs.hide = () => {
    document.getElementById('result').hidden = true;
    document.body.classList.remove('modal-open');
  };

  Rs.bind = () => {
    document.getElementById('res-save').addEventListener('click', () => {
      const c = Rs.current;
      if (!c) return;
      if (!c.saved) {
        WC.Storage.record(c.outcome.id, c.entry, true);
        c.saved = true;
        const b = document.getElementById('res-save');
        b.textContent = 'Saved ✓'; b.classList.add('done');
        WC.FX.toast('This version is now in your recipe book.');
      } else {
        Rs.hide(); WC.Game.newRound(); WC.Book.open(c.outcome.id);
      }
    });
    document.getElementById('res-again').addEventListener('click', () => { Rs.hide(); WC.Game.newRound(); });
    document.getElementById('res-recreate').addEventListener('click', () => {
      const c = Rs.current;
      Rs.hide();
      WC.Game.recreate(c.outcome.id, c.entry);
    });
  };

  WC.Result = Rs;
})(window.WC);
