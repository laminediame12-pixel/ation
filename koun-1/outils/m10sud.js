// M10 porte-t-il le contrôleur (k−6) ou le miroir (k+8) d'un pôle ? Lien avec les verdicts 1.14 sur le banc.
const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
const core=fs.readFileSync(S+'/src/core.html','utf8'),bridge=fs.readFileSync(S+'/src/bridge.js','utf8');
await p.setContent(core.replace('</body>','<script>window.__BRIDGE__='+JSON.stringify(bridge)+'</script></body>'));await p.waitForTimeout(1000);
const out=await p.evaluate(()=>{const b=window.__BRIDGE__;const compact=eval('('+b.slice(b.indexOf('function compact'),b.indexOf('window.addEventListener')).trim()+')');
 const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const N=f=>F.indexOf(f)+1;
 const T={};const add=(k,v)=>{T[k]=T[k]||{};T[k][v]=(T[k][v]||0)+1;};
 for(let a=0;a<16;a++)for(let x=0;x<16;x++)for(let y=0;y<16;y++)for(let z=0;z<16;z++){const m=[F[a],F[x],F[y],F[z]];const th=window.buildThemeFromMothers(...m);
  const c=compact(window.MOTEUR_UNIQUE.analyser(th),th,m);const q={R1:N(th[c.poles.R1]),R7:N(th[c.poles.R7])};
  const meme=(q.R1%2)===(q.R7%2);const h=c.houses[9];const figs=[N(h.base),N(h.result)];
  const off=(n,qq)=>((n-qq)%16+16)%16;const sud=['Puella','Tristitia'].includes(h.base);let ctl=[],mir=[];
  for(const k of ['R1','R7'])for(const n of figs){if(off(n,q[k])===10)ctl.push(k);if(off(n,q[k])===8)mir.push(k);}
  const cle=(meme?'même boucle':'boucles ≠')+' · M10 '+(sud?'Puella→Albus ou Tristitia→Laetitia':'autre');
  const v=c.decision.verdict;add(cle,v===null?'bloqué':v);
  if(!meme&&(ctl.length||mir.length)&&(v==='1'||v==='2')){const w=v==='1'?'R1':'R7';const qui=ctl.length?ctl:mir;add('qui porte-t-il ? (boucles ≠, victoire)',qui.includes(w)&&qui.length===1?'pôle du gagnant':!qui.includes(w)?'pôle du perdant':'les deux');}}
 return T;});
for(const [k,v] of Object.entries(out)){const tot=Object.values(v).reduce((a,b)=>a+b,0);console.log(k.padEnd(48),'total',String(tot).padStart(6),'|',Object.entries(v).map(([a,b])=>a+' '+b+' ('+(b/tot*100).toFixed(1)+' %)').join(' · '));}
await br.close();})();
