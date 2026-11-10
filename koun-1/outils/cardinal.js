// Modèle cardinal : chaque front = Est, Nord, Ouest, Sud. Est face à Ouest (miroir M8), Nord face à Sud.
// Étiquetage : Est = plus petit numéro du front ; Ouest = son miroir (M8) ; Nord = ce que M4 accouche de l'Est ; Sud = miroir du Nord.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(process.argv[2]+'/src/core.html','utf8'));await p.waitForTimeout(1000);
console.log(await p.evaluate(()=>{const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const N=f=>F.indexOf(f)+1;
 const acc=(h,k)=>{const T={};for(let x=1;x<=16;x++)T[x]=F[0];T[h]=F[k-1];return N(window.resultanteMaison(h,T));};
 const front=k=>'ABCD'[(k-1)%4];const card={};
 for(const est of [1,2,3,4]){const ouest=acc(8,est),nord=acc(4,est),sud=acc(8,nord);card[est]='Est';card[ouest]='Ouest';card[nord]='Nord';card[sud]='Sud';}
 const out=['Étiquetage :',...'ABCD'.split('').map(fr=>' Front '+fr+' : '+[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].filter(k=>front(k)===fr).map(k=>card[k]+' = '+k+' '+F[k-1]).join(', '))];
 out.push('','Action de chaque maison (base → résultante), selon le point cardinal de la base :');
 for(let h=1;h<=15;h++){const par={};let uniforme=true;
  for(const c of ['Est','Nord','Ouest','Sud']){const vus=new Set();
   for(let k=1;k<=16;k++)if(card[k]===c){const r=acc(h,k);const rel=front(r)===front(k)?'même front':({A:'C',C:'A',B:'D',D:'B'}[front(k)]===front(r)?'front binôme':'autre boucle');vus.add(rel+' · '+card[r]);}
   par[c]=[...vus];if(vus.size>1)uniforme=false;}
  out.push(' M'+h+(uniforme?' (identique sur les 4 fronts)':' (dépend du front)')+' : '+['Est','Nord','Ouest','Sud'].map(c=>c+' → '+par[c].join(' / ')).join(' ; '));}
 return out.join('\n');}));await br.close();})();
