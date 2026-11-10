// Point 1 : M8 accouche la figure miroir (k <-> k+8).
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(process.argv[2]+'/src/core.html','utf8'));await p.waitForTimeout(1000);
console.log(await p.evaluate(()=>{const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const out=[];let ok=0,okNul=0;
 for(let k=1;k<=16;k++){const T={};for(let h=1;h<=16;h++)T[h]=F[0];T[8]=F[k-1];const r=window.resultanteMaison(8,T);const m=F[(k+7)%16];
  if(r===m)ok++;out.push(k+' '+F[k-1]+' → '+r);
  const t2={};for(let h=1;h<=16;h++)t2[h]=F[0];const c=window.evaluerCasNulR1R7({...t2,1:F[k-1],7:m},{R1:1,R7:7});if(c.figuresMiroirs)okNul++;}
 return 'M8 accouche k+8 : '+ok+'/16 ; même miroir dans la règle du nul : '+okNul+'/16\n'+out.join(' | ');}));await br.close();})();
