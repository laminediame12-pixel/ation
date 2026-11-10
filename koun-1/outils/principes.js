// Vérifie les principes du propriétaire sur le moteur : boucles, fronts, accouchements.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(process.argv[2]+'/src/core.html','utf8'));await p.waitForTimeout(1000);
console.log(await p.evaluate(()=>{
 const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));
 const num=f=>F.indexOf(f)+1, front=f=>'ABCD'[(num(f)-1)%4], parite=f=>num(f)%2===0?'paire':'impaire';
 const R=window.RELATIONS_4;const out=[];
 // 1. Fronts et binômes du moteur vs principe
 let okFront=0,okBin=0;for(const f of F){const chain=[f];let x=R[f].front;while(x&&x!==f&&chain.length<5){chain.push(x);x=R[x].front;}
  if(chain.every(g=>front(g)===front(f))&&chain.length===4)okFront++;
  const bf=front(R[f].binome),attendu={A:'C',C:'A',B:'D',D:'B'}[front(f)];if(bf===attendu)okBin++;}
 out.push('Fronts (cercle de 4, même front) : '+okFront+'/16 ; binômes A↔C, B↔D : '+okBin+'/16');
 // 2. Accouchement par la résultante : toutes maisons × toutes figures
 const stat={terre:[0,0],air:[0,0],airMemeFront:0,airBinome:0,impaire:[0,0]};const ecarts=[];
 for(let h=1;h<=15;h++)for(const f of F){const T={};for(let k=1;k<=16;k++)T[k]=F[0];T[h]=f;const r=window.resultanteMaison(h,T);
  if(h%4===0){stat.terre[1]++;if(front(r)===front(f))stat.terre[0]++;else ecarts.push('M'+h+' '+f+'→'+r);}
  else if(h%2===0){stat.air[1]++;if(parite(r)===parite(f)){stat.air[0]++;front(r)===front(f)?stat.airMemeFront++:stat.airBinome++;}else ecarts.push('M'+h+' '+f+'→'+r);}
  else{stat.impaire[1]++;if(parite(r)!==parite(f))stat.impaire[0]++;else ecarts.push('M'+h+' '+f+'→'+r);}}
 out.push('Maisons Terre (même front) : '+stat.terre[0]+'/'+stat.terre[1]);
 out.push('Maisons Air (même boucle) : '+stat.air[0]+'/'+stat.air[1]+' (dont même front '+stat.airMemeFront+', binôme '+stat.airBinome+')');
 out.push('Maisons impaires (changement de boucle) : '+stat.impaire[0]+'/'+stat.impaire[1]);
 out.push('Écarts : '+(ecarts.slice(0,12).join(', ')||'aucun'));
 return out.join('\n');}));await br.close();})();
