// Ce qu'accouche une maison H pour chacune des 16 figures (numérotation par maison de repos).
const {chromium}=require('playwright');const fs=require('fs');const H=+process.argv[3];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(process.argv[2]+'/src/core.html','utf8'));await p.waitForTimeout(1000);
console.log(await p.evaluate((H)=>{const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const rows=[];const ecart={};
 for(let k=1;k<=16;k++){const T={};for(let h=1;h<=16;h++)T[h]=F[0];T[H]=F[k-1];const r=window.resultanteMaison(H,T);const n=F.indexOf(r)+1;
  const d=((n-k)%16+16)%16;ecart[d]=(ecart[d]||0)+1;rows.push(k+' '+F[k-1]+' → '+n+' '+r);}
 return 'Écart k → résultante : '+JSON.stringify(ecart)+'\n'+rows.join(' | ');},H));await br.close();})();
