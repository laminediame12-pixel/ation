// Forces recalculées avec les éléments des figures alignés sur leur front (A Feu, B Air, C Eau, D Terre)
// ou avec la table actuelle du moteur, puis lectures du duel sur les 11 références.
const J=require('./src/J.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const md=n=>((n-1)%16+16)%16+1;
const REL=JSON.parse(require('fs').readFileSync('rel.json','utf8'));
const EL_FRONT=f=>'FAET'[(N(f)-1)%4];
const ACT={Puer:'F',Laetitia:'F','Fortuna Minor':'F',Populus:'F',Caput:'A',Rubeus:'A',Conjunctio:'A',Aquisitio:'A',Albus:'E',Via:'E',Amissio:'E','Cauda Draconis':'E',Tristitia:'T',Carcer:'T','Fortuna Major':'T',Puella:'T'};
const EL_ACT=f=>ACT[f];
const PAIRS={ET:70,AF:70,FT:55,AE:55,EF:1,AT:1};
function forces(theme,res,elem){ // positions base + résultante
 const pos=[];for(let h=1;h<=16;h++){pos.push({h,f:theme[h],c:'base'});if(h<16)pos.push({h,f:res[h],c:'res'});}
 const atRest=f=>pos.some(p=>p.f===f&&p.h===N(f));
 for(const p of pos){const own=N(p.f)===p.h;
  const ants=[REL[p.f].antagoniste,...F.filter(g=>REL[g].antagoniste===p.f)];
  if(own&&ants.some(atRest))p.force=null;else if(own)p.force=100;
  else{const ef=elem(p.f),eh='FAET'[(p.h-1)%4];p.force=ef===eh?85:PAIRS[[ef,eh].sort().join('')];}}
 return pos;}
function lectures(elem){const out={};const add=(k,v)=>{(out[k]=out[k]||[]).push(v);};
 for(const r of J.references){const s=r.snapshot,T=s.theme,R={};for(const h of s.houses)R[h.house]=h.result;
  const p1=N(T[s.poles.R1]),camp=f=>(N(f)%2)===(p1%2)?0:1;const pos=forces(T,R,elem);
  const at=(h,c)=>pos.find(p=>p.h===h&&p.c===c);
  const w=[0,0],sum=[0,0],sumOdd=[0,0],max=[0,0],poleF=[at(s.poles.R1,'base').force,at(s.poles.R7,'base').force];
  for(let h=1;h<=15;h+=2){const b=at(h,'base'),x=at(h,'res');if(b.force!=null&&x.force!=null&&b.force!==x.force)w[b.force>x.force?camp(b.f):camp(x.f)]++;}
  for(const p of pos){if(p.force==null)continue;sum[camp(p.f)]+=p.force;if(p.h%2)sumOdd[camp(p.f)]+=p.force;}
  const id=r.id.replace('_REFERENCE','').replace('VICTOIRE','V').replace('NUL','N').replace('AZ_VILLARREAL','AZ');
  add('impaires gagnées',{id,exp:r.expected,a:w[0],b:w[1]});
  add('somme des forces',{id,exp:r.expected,a:sum[0],b:sum[1]});
  add('forces en impaires',{id,exp:r.expected,a:sumOdd[0],b:sumOdd[1]});
  add('force du pôle',{id,exp:r.expected,a:poleF[0]??-1,b:poleF[1]??-1});
 }return out;}
for(const [nom,elem] of [['TABLE ACTUELLE',EL_ACT],['ÉLÉMENTS = FRONTS',EL_FRONT]]){console.log('==',nom);
 for(const [k,v] of Object.entries(lectures(elem))){let ok=0,nul=0;const d=v.map(x=>{const pr=x.a>x.b?'1':x.b>x.a?'2':'N';if(x.exp!=='N'&&pr===x.exp)ok++;if(x.exp==='N'&&pr==='N')nul++;return x.id+':'+x.a+'-'+x.b;});
  console.log(' ',k.padEnd(20),'victoires',ok+'/5','nuls',nul+'/6','|',d.join(' '));}}
