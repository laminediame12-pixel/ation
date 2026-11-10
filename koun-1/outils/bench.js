const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
const core=fs.readFileSync(S+'/src/core.html','utf8');await p.setContent(core);await p.waitForTimeout(1000);
const t0=Date.now();
const out=await p.evaluate(()=>{const figs=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));
 document.getElementById('team1').value='R1';document.getElementById('team2').value='R7';
 const stats={},themes=new Map(),err={};let n=0;const keyOf=t=>Array.from({length:15},(_,i)=>t[i+1]).join('|');
 const blockedEx={};
 for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(let c=0;c<16;c++)for(let d=0;d<16;d++){
  const m=[figs[a],figs[b],figs[c],figs[d]];const th=window.buildThemeFromMothers(...m);const k=keyOf(th);
  let r;try{r=window.MOTEUR_UNIQUE.analyser(th);}catch(e){err[e.message]=(err[e.message]||0)+1;continue;}
  const dec=r.decisionFinale||{};const key=(dec.verdict??'null')+'/'+dec.statut+'/'+dec.phase+'/'+(r.erreurDecision?.code||'');
  stats[key]=(stats[key]||0)+1;n++;
  if(dec.verdict==null){blockedEx[key]=blockedEx[key]||m.join(',');}
 }
 return {n,stats,err,blockedEx};});
console.log('ms',Date.now()-t0);console.log(JSON.stringify(out,null,1));await br.close();})();
