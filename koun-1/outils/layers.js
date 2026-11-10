const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const br=await chromium.launch();const p=await br.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent(fs.readFileSync(process.argv[2]+'/src/core.html','utf8'));await p.waitForTimeout(1000);
console.log(await p.evaluate(()=>{const names=['analyseAnneauProtecteur','analysePhasesAspects','analyseReseauPolesComplet','analyseMaisonsFavorables','analyseCroisementBoucles','analyseCroisement4Relations','analyseForceReposFront','analyseDeplacementFront','analyseRelationsConcordance'];
 const figs=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const out={};
 for(const n of names){out[n]={ok:0,err:0,msg:''};}
 for(let k=0;k<400;k++){const m=[0,0,0,0].map(()=>figs[Math.floor(Math.random()*16)]);const T=window.buildThemeFromMothers(...m);
  for(const n of names){try{window[n](T);out[n].ok++;}catch(e){out[n].err++;out[n].msg=e.message;}}}
 return JSON.stringify(out);}));console.log('pageerrors',errs.length);await br.close();})();
