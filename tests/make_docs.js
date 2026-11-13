// Generates docs/RECIPES.md and docs/DISCOVERIES.md straight from the game data (no hand-copied tables).
const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx={console}; ctx.window=ctx; vm.createContext(ctx);
['js/core/util.js','js/data/ingredients.js','js/data/methods.js','js/data/recipes.js','js/engine/engine.js','js/engine/state.js','tests/solutions.js']
 .forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),ctx));
const {WC,WC_TEST:T}=ctx; const N=id=>WC.INGREDIENTS[id].name;
const VW={pot:'pot',oven:'oven',board:'board',counter:'counter'};
function human(steps){return steps.map(([c,a,b])=>{
 if(c==='pick')return b?`${N(a)} → ${VW[b]}`:`take ${N(a)}`;
 if(c==='move')return `${N(a)} → ${VW[b]}`; if(c==='chop')return `chop ${N(a)}`; if(c==='grate')return `grate ${N(a)}`;
 if(c==='crack')return 'crack egg'; if(c==='stir')return `stir ${a} ${b} turns`; 
 if(c==='door')return `oven door ${a?'open':'closed'}`; if(c==='heat')return `${a} heat ${b?'on':'off'}`; if(c==='wait')return `wait ${a}s`; if(c==='serve')return 'serve';}).join(' · ');}
const ids=Object.keys(WC.OUTCOMES); const prio=Object.fromEntries(WC.RULES.map((r,i)=>[r.id,i+1]));
const TL={familiar:'Familiar',unusual:'Unusual',surreal:'Surreal / surprise'};
let md=`# Recipe outcome table — WHAT'S COOKING? V2.1\n\n⚠️ Spoilers. Generated from \`js/data/recipes.js\` and \`tests/solutions.js\` by \`node tests/make_docs.js\`.\n\n`+
`${ids.length} authored outcomes (${ids.filter(i=>WC.OUTCOMES[i].type==='familiar').length} familiar, ${ids.filter(i=>WC.OUTCOMES[i].type==='unusual').length} unusual, ${ids.filter(i=>WC.OUTCOMES[i].type==='surreal').length} surreal). `+
`Rules are checked in priority order; the first match wins. "Decided by" shows what beyond the ingredient list changes the result.\n\n`+
`| # | Outcome | Type | Decided by | Trigger rule | Verified reproduction |\n|---|---|---|---|---|---|\n`;
ids.slice().sort((a,b)=>prio[a]-prio[b]).forEach(id=>{const o=WC.OUTCOMES[id];
 md+=`| ${prio[id]} | **${o.name}** | ${TL[o.type]} | ${o.dep} | ${o.trigger} | ${human(T.SOL[id])} |\n`;});
md+=`\n## Same ingredients, different result (order / prep / timing pairs)\n\n| A | B | What differs |\n|---|---|---|\n`;
const nm=k=>T.EXTRA[k]&&T.EXTRA[k].expect.endsWith(':')?'(improvisation)':WC.OUTCOMES[k]?WC.OUTCOMES[k].name:(T.EXTRA[k]?WC.OUTCOMES[T.EXTRA[k].expect].name+' (variant)':k);
T.CONTRASTS.forEach(([a,b,w])=>md+=`| ${nm(a)} | ${nm(b)} | ${w} |\n`);
md+=`\nAnything no rule covers becomes a deterministic **Kitchen improvisation**: its name, description and plate are built from the actual ingredients, their cut/whole state, the method and the doneness (e.g. "Rustic Tofu & Sugar Stew").\n`;
const dep=ids.filter(i=>/order|prep|time|action/.test(WC.OUTCOMES[i].dep)).length;
md+=`\n${dep} outcomes depend on preparation, order, action or timing (not ingredients alone).\n`;
fs.writeFileSync(path.join(__dirname,'..','docs','RECIPES.md'),md);
let d=`# Discovery list — surprises & special discoveries\n\n⚠️ Spoilers. Every surprise is authored and deterministic: repeating the same actions always reproduces it.\n\n| Surprise | What you see | How to cause it |\n|---|---|---|\n`;
const ANIM={wiggle2:'',phoenix:'smoke bird rises from the ashes and flaps',stack:'layers drop in one by one into a leaning tower',blink:'eyes blink from inside the stew',wiggle:'noodle creature wiggles on its stalk eyes',erupt:'sauce volcano erupts chocolate and tomato blobs',escape:'the food runs off the plate and back',grow:'pancake grows past the edges of the plate',unfurl:'petals unfold one by one',float:'soufflé lifts off and hovers'};
ids.filter(i=>WC.OUTCOMES[i].type==='surreal').forEach(id=>{const o=WC.OUTCOMES[id];d+=`| **${o.name}** | ${ANIM[o.anim]||o.anim} | ${o.trigger} |\n`;});
d+=`\nAlso unusual-but-plausible: ${ids.filter(i=>WC.OUTCOMES[i].type==='unusual').map(i=>WC.OUTCOMES[i].name).join(', ')}.\n`;
fs.writeFileSync(path.join(__dirname,'..','docs','DISCOVERIES.md'),d);
console.log('docs written', ids.length, 'dependent', dep);
