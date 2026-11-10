// Recherche systématique : « l'antagoniste du pôle est contrôlé par son antagoniste ou mal positionné ».
// Antagoniste A = k-3 (attaque le pôle k) ; contrôleur K = k-6 (attaque A, allié du pôle).
const J=require('./src/J.json');const live=require('./refs130.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const fig=n=>F[((n-1)%16+16)%16];
const cas=[];
for(const r of J.references){const c=live.find(x=>x.id===r.id).c;
 const pos=f=>{const o=[];for(const h of c.houses){if(h.base===f)o.push({h:h.house,c:'base',f:h.forceBase});if(h.house!==16&&h.result===f)o.push({h:h.house,c:'res',f:h.forceResultante});}return o;};
 const camps={};for(const k of ['R1','R7']){const p=N(c.theme[c.poles[k]]);const q=N(c.theme[c.poles[k==='R1'?'R7':'R1']]);camps[k]={A:pos(fig(q)),K:pos(fig(q-3)),P:pos(fig(p))};}
 cas.push({id:r.id,exp:r.expected,memeBoucle:(N(c.theme[c.poles.R1])%2)===(N(c.theme[c.poles.R7])%2),camps});}
const mx=l=>l.length?Math.max(...l.map(x=>x.f??0)):-1;
// Définitions candidates
const CTRL={
 'K plus fort que A (max)':(A,K)=>K.length>0&&mx(K)>mx(A),
 'K présent':(A,K)=>K.length>0,
 'K en maison paire':(A,K)=>K.some(x=>x.h%2===0),
 'K en maison Terre':(A,K)=>K.some(x=>x.h%4===0),
 'K en base':(A,K)=>K.some(x=>x.c==='base'),
 'K à 70 % ou plus':(A,K)=>mx(K)>=70,
 'K dans la même maison que A':(A,K)=>K.some(x=>A.some(y=>y.h===x.h)),
 'K plus fort que A dans une maison paire':(A,K)=>mx(K.filter(x=>x.h%2===0))>mx(A.filter(x=>x.h%2===0)),
 'K plus fort que A en maisons impaires':(A,K)=>mx(K.filter(x=>x.h%2))>mx(A.filter(x=>x.h%2)),
 'jamais contrôlé':()=>false};
const MAL={
 'A absent':A=>A.length===0,
 'A absent ou à 1 %':A=>mx(A)<=1,
 'A ≤ 55 %':A=>mx(A)<=55,
 'A seulement en maisons impaires':A=>A.every(x=>x.h%2),
 'A absent des maisons Terre':A=>!A.some(x=>x.h%4===0),
 'A seulement en résultante':A=>A.every(x=>x.c==='res'),
 'A pas à son repos':A=>!A.some(x=>x.f===100),
 'jamais mal positionné':()=>false};
const decisifs=cas.filter(x=>!x.memeBoucle);
const res=[];
for(const [nc,fc] of Object.entries(CTRL))for(const [nm,fm] of Object.entries(MAL)){if(nc==='jamais contrôlé'&&nm==='jamais mal positionné')continue;
 const couvert=k=>fc(k.A,k.K)||fm(k.A);let ok=0;const det=[];
 for(const x of decisifs){const c1=couvert(x.camps.R1),c7=couvert(x.camps.R7);const lec=c1&&!c7?'1':c7&&!c1?'2':'N';
  const bon=lec===x.exp;if(bon)ok++;det.push(x.id.replace('_REFERENCE','').replace('VICTOIRE','V').replace('NUL','N').replace('AZ_VILLARREAL','AZ')+':'+(c1?'✓':'✗')+(c7?'✓':'✗')+(bon?'':'!'));}
 res.push({ok,nc,nm,det});}
res.sort((a,b)=>b.ok-a.ok);
console.log('Références où les pôles sont dans des boucles différentes :',decisifs.length,'(NUL 1, NUL 6, 5 victoires)');
console.log('Lecture : couvert R1 seul → R1 ; R7 seul → R7 ; les deux ou aucun → nul.\n');
for(const x of res.slice(0,12))console.log(x.ok+'/'+decisifs.length,'| contrôlé :',x.nc.padEnd(40),'| mal positionné :',x.nm.padEnd(32),'|',x.det.join(' '));
console.log('\nCombinaisons testées :',res.length,'; à 7/7 :',res.filter(x=>x.ok===7).length,'; à 6/7 :',res.filter(x=>x.ok===6).length);
