const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];const OFF=+process.argv[3];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(S+'/src/core.html','utf8'));await p.waitForTimeout(1000);
const J=JSON.parse(fs.readFileSync(S+'/src/J.json','utf8'));
const out=await p.evaluate(([J,OFF])=>{const orig=window.getPolesR1R7;
 window.getPolesR1R7=t=>{const q=orig(t);const r7=((q.R1-1+OFF)%16)+1;return {R1:q.R1,R7:r7,figR1:t[q.R1],figR7:t[r7]};};
 const refs=J.references.map(r=>{const v=window.MOTEUR_UNIQUE.analyser(window.buildThemeFromMothers(...r.mothers)).decisionFinale.verdict;return r.id+':'+r.expected+'/'+v+(v===r.expected?'':' ✗');});
 const figs=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const c={};
 for(let a=0;a<16;a++)for(let b=0;b<16;b++)for(let d=0;d<16;d++)for(let e=0;e<16;e++){const v=String(window.MOTEUR_UNIQUE.analyser(window.buildThemeFromMothers(figs[a],figs[b],figs[d],figs[e])).decisionFinale.verdict);c[v]=(c[v]||0)+1;}
 return {refs,c};},[J,OFF]);
console.log('OFFSET',OFF,JSON.stringify(out.c));console.log(out.refs.join('  '));await br.close();})();
