const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
const core=fs.readFileSync(S+'/src/core.html','utf8');const bridge=fs.readFileSync(S+'/src/bridge.js','utf8');
await p.setContent(core.replace('</body>','<script>window.__BRIDGE__='+JSON.stringify(bridge)+'</script></body>'));await p.waitForTimeout(1000);
const out=await p.evaluate(()=>{const src=window.__BRIDGE__;const compact=eval('('+src.slice(src.indexOf('function compact'),src.indexOf('window.addEventListener')).trim()+')');
 const figs=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));
 document.getElementById('team1').value='R1';document.getElementById('team2').value='R7';
 const causes={},cerr={};let btts={},inc={},nullForce=0,verd={};
 for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(let c=0;c<16;c++)for(let d=0;d<16;d++){
  const m=[figs[a],figs[b],figs[c],figs[d]];const th=window.buildThemeFromMothers(...m);const r=window.MOTEUR_UNIQUE.analyser(th);
  let k;try{k=compact(r,th,m);}catch(e){cerr[e.message]=(cerr[e.message]||0)+1;continue;}
  verd[k.decision.verdict??'bloqué']=(verd[k.decision.verdict??'bloqué']||0)+1;
  if(k.decision.victoireAssuree){const kk="assuree_"+k.decision.verdict;verd[kk]=(verd[kk]||0)+1;}if(k.decision.erreur){const c=k.decision.erreur.cause;causes[c]=(causes[c]||0)+1;}
  btts[k.labels.btts.split(' ')[0]]=(btts[k.labels.btts.split(' ')[0]]||0)+1;inc[k.labels.incidents]=(inc[k.labels.incidents]||0)+1;
  if(k.houses.some(h=>h.forceBase===null||(h.house!==16&&h.forceResultante===null)))nullForce++;
 }return {causes,cerr,btts,inc,nullForce,verd};});
console.log(JSON.stringify(out,null,1));await br.close();})();
