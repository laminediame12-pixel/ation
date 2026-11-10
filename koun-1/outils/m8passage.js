// Passage de la figure M8 (= M7 + M12) en M4 ou M10 (base / résultante) : fréquence et lien avec le verdict 1.14.
const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
const core=fs.readFileSync(S+'/src/core.html','utf8'),bridge=fs.readFileSync(S+'/src/bridge.js','utf8');
await p.setContent(core.replace('</body>','<script>window.__BRIDGE__='+JSON.stringify(bridge)+'</script></body>'));await p.waitForTimeout(1000);
const out=await p.evaluate(()=>{const b=window.__BRIDGE__;const compact=eval('('+b.slice(b.indexOf('function compact'),b.indexOf('window.addEventListener')).trim()+')');
 const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const N=f=>F.indexOf(f)+1;const mir=f=>F[(N(f)+7)%16];
 const T={total:0,avec:0,lieux:{},role:{},issue:{}};const add=(o,k)=>o[k]=(o[k]||0)+1;
 for(let a=0;a<16;a++)for(let x=0;x<16;x++)for(let y=0;y<16;y++)for(let z=0;z<16;z++){const m=[F[a],F[x],F[y],F[z]];const th=window.buildThemeFromMothers(...m);
  const c=compact(window.MOTEUR_UNIQUE.analyser(th),th,m);T.total++;const s=th[8];const h=k=>c.houses[k-1];
  const lieux=[];if(h(4).base===s)lieux.push('M4 base');if(h(4).result===s)lieux.push('M4 rés');if(h(10).base===s)lieux.push('M10 base');if(h(10).result===s)lieux.push('M10 rés');
  if(!lieux.length)continue;T.avec++;lieux.forEach(l=>add(T.lieux,l));
  const P={R1:th[c.poles.R1],R7:th[c.poles.R7]};if((N(P.R1)%2)===(N(P.R7)%2)){add(T.issue,'même boucle');continue;}
  const campS=(N(s)%2)===(N(P.R1)%2)?'R1':'R7';const role=s===P[campS]?'pôle':s===mir(P[campS])?'miroir du pôle':'autre figure du camp';add(T.role,role);
  const v=c.decision.verdict;const gagnant=v==='1'?'R1':v==='2'?'R7':null;
  add(T.issue,(gagnant===null?(v==='N'?'nul':'bloqué'):gagnant===campS?'camp de la figure gagne':'camp de la figure perd')+' · '+lieux.map(l=>l.split(' ')[0]).filter((v,i,a)=>a.indexOf(v)===i).join('+'));}
 return T;});
console.log(JSON.stringify(out,null,1));await br.close();})();
