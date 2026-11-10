const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(S+'/src/core.html','utf8'));await p.waitForTimeout(1000);
const out=await p.evaluate(()=>{const figs=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const orig=window.getPolesR1R7;
 const mir={'1':'2','2':'1','N':'N','null':'null'};const stats={},ex={};let n=0,ok=0;
 for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(let c=0;c<16;c++)for(let d=0;d<16;d++){
  const m=[figs[a],figs[b],figs[c],figs[d]];const th=window.buildThemeFromMothers(...m);
  window.getPolesR1R7=orig;const r=window.MOTEUR_UNIQUE.analyser(th);
  window.getPolesR1R7=t=>{const q=orig(t);return {R1:q.R7,R7:q.R1,figR1:q.figR7,figR7:q.figR1};};
  const s=window.MOTEUR_UNIQUE.analyser(th);window.getPolesR1R7=orig;
  const v=String(r.decisionFinale.verdict),w=String(s.decisionFinale.verdict);n++;
  if(mir[v]===w)ok++;else{const k=r.decisionFinale.phase+' '+v+' -> swapped '+s.decisionFinale.phase+' '+w;stats[k]=(stats[k]||0)+1;ex[k]=ex[k]||m.join(',');}
 }return {n,ok,stats,ex};});
fs.writeFileSync(S+'/swap.json',JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));await br.close();})();
