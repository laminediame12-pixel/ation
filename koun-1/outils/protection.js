// Principe du propriétaire : k attaque k+3 pour protéger k+6 (front 1 du binôme), qui protège k+12 (front 3 de k).
const J=require('./src/J.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const fig=n=>F[((n-1)%16+16)%16];
// 1. Le graphe d'attaque du moteur (cible = figure dont l'attaquant est l'antagoniste) est-il k -> k+3 ?
const REL=JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));
let ok=0;for(const f of F){const cibles=F.filter(t=>REL[t].antagoniste===f);if(cibles.length===1&&N(cibles[0])===((N(f)+2)%16)+1)ok++;}
console.log('Attaque k -> k+3 dans le moteur :',ok+'/16');
let okP=0;for(let k=1;k<=16;k++){const bin=N(REL[fig(k)].binome),f1=N(REL[fig(bin)].front);const f3=N(REL[REL[REL[fig(k)].front].front].front);
 if(f1===((k+5)%16)+1&&f3===((k+11)%16)+1)okP++;}
console.log('k+6 = front 1 du binôme et k+12 = front 3 de k :',okP+'/16');
// 2. Sur les références : menaces, réponses, chaînes de protection par camp
const rows=[];
for(const r of J.references){const s=r.snapshot,p1=N(s.theme[s.poles.R1]),p7=N(s.theme[s.poles.R7]);
 const pres={};for(const h of s.houses)for(const x of h.positions){(pres[N(x.figure)]=pres[N(x.figure)]||[]).push({h:h.house,c:x.couches.join('+'),force:x.forcePct});}
 const has=n=>!!pres[((n-1)%16+16)%16+1];
 const campOf=n=>(n%2)===(p1%2)?'R1':'R7';
 const M={R1:{},R7:{}};
 for(const camp of ['R1','R7']){const allies=Array.from({length:16},(_,i)=>i+1).filter(n=>campOf(n)===camp);
  // menaces : ennemi Y présent qui attaque un allié Y+3 présent
  const menaces=allies.filter(a=>has(a)&&has(a-3));
  const repondues=menaces.filter(a=>has(a-6)); // l'allié a-6 attaque a-3 et protège a
  const protections=allies.filter(x=>has(x)&&has(x+3)&&has(x+6)); // x attaque x+3 pour protéger x+6
  // chaîne depuis le pôle : p, p+6, p+12, ... tant que la protection tient
  const p=camp==='R1'?p1:p7;let chaine=0,x=p;for(let i=0;i<8;i++){if(has(x)&&has(x+3)&&has(x+6)){chaine++;x+=6;}else break;}
  const poleMenace=has(p-3),poleProtege=has(p-6);
  M[camp]={menaces:menaces.length,repondues:repondues.length,nonRepondues:menaces.length-repondues.length,protections:protections.length,chainePole:chaine,poleMenace,poleProtege,presents:allies.filter(has).length};}
 rows.push({id:r.id,exp:r.expected,p1,p7,M});}
const keys=['presents','menaces','repondues','nonRepondues','protections','chainePole'];
for(const x of rows){console.log(x.id.padEnd(21),'att',x.exp,'| R1',x.p1,fig(x.p1).padEnd(15),'R7',x.p7,fig(x.p7).padEnd(15),'|',keys.map(k=>k+' '+x.M.R1[k]+'-'+x.M.R7[k]).join(' · '),'| pôle menacé/protégé R1',+x.M.R1.poleMenace+'/'+(+x.M.R1.poleProtege),'R7',+x.M.R7.poleMenace+'/'+(+x.M.R7.poleProtege));}
