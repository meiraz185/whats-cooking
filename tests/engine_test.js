// V2.1 engine tests (Node): every outcome script, method/order contrasts, improvisation fallback, fuzzing.
const fs=require('fs'),vm=require('vm'),path=require('path');
const ctx={console}; ctx.window=ctx; ctx.globalThis=ctx; vm.createContext(ctx);
['js/core/util.js','js/data/ingredients.js','js/data/methods.js','js/data/recipes.js','js/engine/engine.js','js/engine/state.js','tests/solutions.js']
 .forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),ctx,{filename:f}));
const {WC,WC_TEST:T}=ctx; let pass=0,fail=0; const S=WC.State;
const ok=(c,msg)=>{ if(c) pass++; else {fail++; console.log('FAIL',msg);} };
const ids=Object.keys(WC.OUTCOMES);
ok(WC.ING_ORDER.length>=38 && WC.ING_ORDER.length<=44, 'ingredient count '+WC.ING_ORDER.length);
ok(new Set(WC.ING_ORDER.map(i=>WC.INGREDIENTS[i].name)).size===WC.ING_ORDER.length,'duplicate names');
ok(!('grate' in WC.PREP),'grater gone');
for(const id of ids){ const s=T.SOL[id]; if(!s){ok(false,'no solution '+id);continue;}
  const r=T.run(WC,s); ok(r.outcome===id && !r.errors.length, id+' -> '+r.outcome+' '+r.errors.join('; '));
  ok(T.run(WC,s).outcome===r.outcome,'nondeterministic '+id); }
const names={};
for(const [k,v] of Object.entries(T.EXTRA)){ const r=T.run(WC,v.steps);
  const good = v.expect.endsWith(':') ? (r.outcome||'').startsWith(v.expect) : r.outcome===v.expect;
  ok(good && !r.errors.length, 'extra '+k+' -> '+r.outcome+' '+r.errors); names[k]=r.name; }
for(const [a,b] of T.CONTRASTS){ const ra=(T.SOL[a]?T.run(WC,T.SOL[a]):T.run(WC,T.EXTRA[a].steps)).outcome, rb=(T.SOL[b]?T.run(WC,T.SOL[b]):T.run(WC,T.EXTRA[b].steps)).outcome; ok(ra!==rb,'contrast same '+a+' '+b); }
ids.forEach(id=>ok(WC.RULES.find(r=>r.id===id),'no rule '+id));
// method matters broadly: for many random 1-4 ingredient sets, count how often pot != oven
let diff=0,total=0, impNames=new Set();
let seed=3; const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff};
for(let k=0;k<300;k++){ const set=[...WC.ING_ORDER].sort(()=>rnd()-.5).slice(0,1+Math.floor(rnd()*4));
  const run=(v)=>T.run(WC,[...set.map(i=>['pick',i,v]),...set.includes('egg')?[['crack','egg']]:[],['heat',v,true],['wait',4],...(v==='oven'?[['door',true]]:[]),['serve']]);
  const a=run('pot'), b=run('oven'); total++; if(a.outcome!==b.outcome) diff++;
  ok(a.outcome && b.outcome, 'no result for '+set); [a,b].forEach(r=>{ if(r.outcome.startsWith('imp:')) impNames.add(r.name); }); }
console.log(`random sets: pot≠oven in ${diff}/${total}; distinct improvised names: ${impNames.size}`);
ok(diff/total>0.95,'method rarely matters');
// limits
S.reset(); ['egg','tomato','cheese','milk'].forEach(i=>S.run('pick',i)); ok(!S.run('pick','onion').ok,'limit');
S.reset(); S.run('pick','egg'); ok(!S.run('pick','egg').ok,'dup');
ok(S.run('togglePick','egg').ok && S.count()===0,'deselect');
S.reset(); S.run('pick','pasta'); ok(!S.run('move',S.st.items[0].uid,'board').ok,'pasta refused on board');
S.reset(); S.run('pick','tomato','pot'); ok(!!S.run('pick','onion','oven').warn,'vessel lock');
S.reset(); S.run('pick','tomato','oven'); ok(S.st.door===true,'oven opens on drop'); S.run('setHeat','oven',true); ok(S.st.door===false,'heat closes door');
S.run('setDoor',true); for(let i=0;i<30;i++) S.tick(0.1); ok(S.st.items[0].cookT===0,'open door pauses baking');
// fuzz
const LOCS=['counter','board','pot','oven'];
function inv(st){ const e=[]; if(st.items.length>4)e.push('>4'); const d=st.items.map(i=>i.id); if(new Set(d).size!==d.length)e.push('dup');
  st.items.forEach(i=>{ if(!LOCS.includes(i.loc))e.push('loc'); if(i.loc==='board'&&!WC.PREP.chop.map[i.id])e.push('uncuttable on board'); if(i.rim&&!(i.id==='egg'&&i.state==='whole'))e.push('rim'); });
  if(st.items.filter(i=>i.loc==='board').length>1)e.push('board');
  if(['pot','oven'].filter(v=>st.heat[v]||st.items.some(i=>i.loc===v)).length>1)e.push('2 vessels'); return e; }
const pick=a=>a[Math.floor(rnd()*a.length)]; let bad=0, served=0;
for(let round=0;round<500;round++){ S.reset();
  for(let k=0;k<40;k++){ const it=S.st.items.length?pick(S.st.items):null; const c=rnd();
    if(c<.2) S.run('pick',pick(WC.ING_ORDER),pick([undefined,...LOCS]));
    else if(c<.3) S.run('togglePick',pick(WC.ING_ORDER));
    else if(c<.42&&it) S.run('move',it.uid,pick([...LOCS,'pantry']));
    else if(c<.5&&it) S.run(pick(['chop','crack']),it.uid);
    else if(c<.6) S.stir(pick(['pot','oven']),0.25);
    else if(c<.7) S.run('setHeat',pick(['pot','oven']),rnd()<.7);
    else if(c<.75) S.run('toggleDoor');
    else if(c<.9) for(let t=0;t<10;t++) S.tick(0.1);
    else if(c<.95) S.run('undo');
    else { const r=S.run('serve'); if(r.ok){served++; break;} }
    const e=inv(S.st); if(e.length){bad++; console.log('INV',e); break;} } }
ok(!bad,'fuzz'); console.log('fuzz 500 rounds, served',served,'violations',bad);
console.log('outcomes:',ids.length,'surreal:',ids.filter(i=>WC.OUTCOMES[i].type==='surreal').length,'familiar:',ids.filter(i=>WC.OUTCOMES[i].type==='familiar').length,'unusual:',ids.filter(i=>WC.OUTCOMES[i].type==='unusual').length,'| pass',pass,'fail',fail);
process.exit(fail?1:0);
