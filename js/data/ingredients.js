/* V2 ingredient definitions & preparation rules (pure data).
   29 ingredients, one shared cabinet with categories. Preparation = cutting board only. */
(function (WC) {
  'use strict';

  // cat: cabinet shelf. taste: used by sweet/savory rules. start: raw state.
  WC.INGREDIENTS = {
    // vegetables
    tomato:     { name: 'Tomato',      cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#e9533f' },
    onion:      { name: 'Onion',       cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#b65a7f' },
    mushroom:   { name: 'Mushroom',    cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#b5764c' },
    potato:     { name: 'Potato',      cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#d9a85b' },
    carrot:     { name: 'Carrot',      cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#f08a2c' },
    zucchini:   { name: 'Zucchini',    cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#5f9a4a' },
    pepper:     { name: 'Bell pepper', cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#e8423a' },
    broccoli:   { name: 'Broccoli',    cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#4f9a4f' },
    garlic:     { name: 'Garlic',      cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#f3ead8' },
    spinach:    { name: 'Spinach',     cat: 'veg',   start: 'leaves', taste: 'savory',  color: '#3f8a46' },
    corn:       { name: 'Corn',        cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#f6cf3a' },
    eggplant:   { name: 'Eggplant',    cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#6a3a78' },
    cucumber:   { name: 'Cucumber',    cat: 'veg',   start: 'whole',  taste: 'savory',  color: '#5fa04e' },
    peas:       { name: 'Peas',        cat: 'veg',   start: 'pods',   taste: 'savory',  color: '#7cbf4a' },
    // proteins & dairy
    egg:        { name: 'Egg',         cat: 'dairy', start: 'whole',  taste: 'savory',  color: '#fff4e0' },
    cheese:     { name: 'Cheese',      cat: 'dairy', start: 'block',  taste: 'savory',  color: '#f6cf5a' },
    milk:       { name: 'Milk',        cat: 'dairy', start: 'carton', taste: 'neutral', color: '#fffaf0' },
    butter:     { name: 'Butter',      cat: 'dairy', start: 'block',  taste: 'neutral', color: '#fbe39a' },
    chicken:    { name: 'Chicken',     cat: 'dairy', start: 'whole',  taste: 'savory',  color: '#f2b9a0' },
    tofu:       { name: 'Tofu',        cat: 'dairy', start: 'block',  taste: 'savory',  color: '#f7f1df' },
    cream:      { name: 'Cream',       cat: 'dairy', start: 'tub',    taste: 'neutral', color: '#fff6e4' },
    tuna:       { name: 'Tuna',        cat: 'dairy', start: 'can',    taste: 'savory',  color: '#d9a08a' },
    yogurt:     { name: 'Yogurt',      cat: 'dairy', start: 'cup',    taste: 'neutral', color: '#fbf8f2' },
    beans:      { name: 'Beans',       cat: 'dairy', start: 'can',    taste: 'savory',  color: '#a8442e' },
    // carbohydrates
    pasta:      { name: 'Pasta',       cat: 'carb',  start: 'dry',    taste: 'neutral', color: '#f2d18b' },
    rice:       { name: 'Rice',        cat: 'carb',  start: 'dry',    taste: 'neutral', color: '#fbf6e9' },
    bread:      { name: 'Bread',       cat: 'carb',  start: 'slice',  taste: 'neutral', color: '#c98a45' },
    flour:      { name: 'Flour',       cat: 'carb',  start: 'powder', taste: 'neutral', color: '#f3ead6' },
    dough:      { name: 'Pizza dough', cat: 'carb',  start: 'ball',   taste: 'neutral', color: '#f1dcae' },
    tortilla:   { name: 'Tortilla',    cat: 'carb',  start: 'flat',   taste: 'neutral', color: '#efd49a' },
    noodles:    { name: 'Noodles',     cat: 'carb',  start: 'brick',  taste: 'neutral', color: '#f3d67e' },
    oats:       { name: 'Oats',        cat: 'carb',  start: 'box',    taste: 'neutral', color: '#e6d1a2' },
    // sweet
    chocolate:  { name: 'Chocolate',   cat: 'sweet', start: 'bar',    taste: 'sweet',   color: '#5a3524' },
    strawberry: { name: 'Strawberry',  cat: 'sweet', start: 'whole',  taste: 'sweet',   color: '#e8434f' },
    banana:     { name: 'Banana',      cat: 'sweet', start: 'whole',  taste: 'sweet',   color: '#f6d64a' },
    apple:      { name: 'Apple',       cat: 'sweet', start: 'whole',  taste: 'sweet',   color: '#d8443a' },
    sugar:      { name: 'Sugar',       cat: 'sweet', start: 'bag',    taste: 'sweet',   color: '#fffdf6' },
    honey:      { name: 'Honey',       cat: 'sweet', start: 'jar',    taste: 'sweet',   color: '#f2a72c' },
    lemon:      { name: 'Lemon',       cat: 'sweet', start: 'whole',  taste: 'sour',    color: '#f7dc3c' },
    blueberries:{ name: 'Blueberries', cat: 'sweet', start: 'whole',  taste: 'sweet',   color: '#4a5fb8' },
    orange:     { name: 'Orange',      cat: 'sweet', start: 'whole',  taste: 'sweet',   color: '#f39a2a' },
    peanut:     { name: 'Peanut butter', cat: 'sweet', start: 'jar',  taste: 'sweet',   color: '#c9853f' }
  };

  WC.CATS = [
    ['veg', 'Vegetables'], ['dairy', 'Protein & dairy'], ['carb', 'Carbs'], ['sweet', 'Sweet & fruit']
  ];
  WC.ING_ORDER = Object.keys(WC.INGREDIENTS);

  /* The cutting board is the only preparation tool. Only these can be cut. */
  WC.PREP = {
    chop: {
      station: 'board', steps: 3, verb: 'Chopped',
      map: {
        tomato: { whole: 'chopped' }, onion: { whole: 'chopped' }, mushroom: { whole: 'sliced' },
        potato: { whole: 'chopped' }, carrot: { whole: 'sliced' }, zucchini: { whole: 'sliced' },
        pepper: { whole: 'chopped' }, broccoli: { whole: 'florets' }, garlic: { whole: 'minced' },
        chicken: { whole: 'pieces' }, strawberry: { whole: 'sliced' }, banana: { whole: 'sliced' },
        apple: { whole: 'chopped' }, lemon: { whole: 'sliced' },
        eggplant: { whole: 'sliced' }, cucumber: { whole: 'sliced' }, orange: { whole: 'sliced' }
      }
    },
    crack: { verb: 'Cracked', map: { egg: { whole: 'cracked' } } }
  };
  WC.canChop = (id, state) => !!(WC.PREP.chop.map[id] && WC.PREP.chop.map[id][state]);

  WC.STATE_WORD = {
    whole: '', cracked: 'cracked', whisked: 'whisked', chopped: 'chopped', sliced: 'sliced', mashed: 'mashed',
    florets: '', minced: 'minced', pieces: '', block: '', carton: '', dry: '', powder: '', bar: '', slice: '',
    leaves: '', ball: '', bag: '', jar: '', pods: '', tub: '', can: '', cup: '', flat: '', brick: '', box: ''
  };
  const SPECIAL = { florets: 'broccoli florets', pieces: 'chicken pieces' };
  WC.ingLabel = (id, state) => {
    if (SPECIAL[state]) return SPECIAL[state];
    const w = WC.STATE_WORD[state] || '';
    const n = WC.INGREDIENTS[id].name.toLowerCase();
    return (w ? w + ' ' : '') + n;
  };

  /* groups used by rules and the improvisation fallback */
  WC.G = {
    veg: ['tomato', 'onion', 'mushroom', 'potato', 'carrot', 'zucchini', 'pepper', 'broccoli', 'garlic', 'spinach', 'corn', 'eggplant', 'cucumber', 'peas'],
    green: ['spinach', 'broccoli', 'zucchini', 'peas'],
    protein: ['egg', 'chicken', 'tofu', 'tuna', 'beans'],
    sweet: ['chocolate', 'strawberry', 'banana', 'apple', 'sugar', 'honey', 'blueberries', 'orange', 'peanut'],
    fruit: ['strawberry', 'banana', 'apple', 'blueberries', 'orange'],
    savory: ['tomato', 'onion', 'mushroom', 'potato', 'carrot', 'zucchini', 'pepper', 'broccoli', 'garlic', 'spinach', 'corn', 'eggplant', 'cucumber', 'peas', 'egg', 'cheese', 'chicken', 'tofu', 'tuna', 'beans'],
    liquid: ['milk', 'cream', 'yogurt', 'egg', 'butter', 'honey']
  };
})(window.WC);
