/* V2 cooking methods: a pot on the stove, or the oven. Readable time phases. */
(function (WC) {
  'use strict';

  WC.METHODS = {
    pot:  { id: 'boil', name: 'Pot',  verb: 'Cooked in the pot on the stove', label: 'pot' },
    oven: { id: 'bake', name: 'Oven', verb: 'Baked in the oven',              label: 'oven' }
  };
  WC.VESSELS = ['pot', 'oven'];

  /* Seconds of heat exposure: raw → heating → ready → overcooked → burnt */
  WC.PHASE_T = { ready: 3, over: 7.5, burnt: 11 };
  WC.PHASES = ['raw', 'heating', 'ready', 'over', 'burnt'];
  WC.PHASE_WORD = { raw: 'Raw', heating: 'Heating', ready: 'Ready', over: 'Overcooked', burnt: 'Burnt' };

  WC.phaseOf = (t) => {
    if (!t || t <= 0) return 'raw';
    if (t < WC.PHASE_T.ready) return 'heating';
    if (t < WC.PHASE_T.over) return 'ready';
    if (t < WC.PHASE_T.burnt) return 'over';
    return 'burnt';
  };
  WC.dial = (t) => Math.min(1, t / (WC.PHASE_T.burnt + 1));
})(window.WC);
