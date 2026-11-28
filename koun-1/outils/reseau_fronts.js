// Modèle du propriétaire : liaison connectée à un niveau si les deux figures miroir (branches opposées) saturent ce niveau ; elle traverse des maisons (nœuds) ; un nœud dont la maison est ancrée chez l'antagoniste coupe la liaison.
const K=require('./_lecture.js');const J=require('../moteur3/cartographie.json');const F=J.figures;
const NIV=['Feu','Air','Eau','Terre'];
const ant=h=>((h-4)%16+16)%16+1;
const niv=(a,b)=>(a+b)%2===0?2:1;const P=n=>F[n-1].niveaux;
const add=(a,b)=>F.findIndex(f=>f.niveaux.join()===P(a).map((x,i)=>niv(x,P(b)[i])).join())+1;
// maison du nœud (niveau horizontal i, niveau vertical j) = 4j+i+1 ; (Terre,Terre)=16 n'est pas un nœud
const maison=(i,j)=>4*j+i+1;
function reseau(basesReelles){            // basesReelles[h] = numéro de la figure en base de la maison h (1..16) ; sinon l'antagoniste de chaque maison
  const base=h=>basesReelles?basesReelles[h]:ant(h);
  const res=h=>add(base(h),h);
  const out={};
  'ABCD'.split('').forEach((X,z)=>{const T=z+1,R=z+5,B=z+9,Lf=z+13,rT=P(res(T)),rB=P(res(B)),rL=P(res(Lf)),rR=P(res(R));const liens=[];
    for(let l=0;l<4;l++){
      const cV=rT[l]===2&&rB[l]===2, cH=rL[l]===2&&rR[l]===2;
      [['vertical (haut↔bas)',cV,j=>[0,1,2,3].map(i=>maison(i,j))],['horizontal (gauche↔droite)',cH,i=>[0,1,2,3].map(j=>maison(i,j))]].forEach(([nom,c,cross])=>{
        if(!c)return;const hs=cross(l).filter(h=>h!==16);
        const stops=hs.filter(h=>basesReelles&&basesReelles[h]===ant(h));
        const compat=hs.filter(h=>(h-1)%4===l);
        liens.push({niveau:NIV[l],sens:nom,maisons:hs,arrets:stops,compatibles:compat,coupee:stops.length>0});
      });
    }
    out[X]={resultantes:{haut:res(T),droite:res(R),bas:res(B),gauche:res(Lf)},liens};});
  return out}
module.exports={reseau,ant,add};
if(require.main===module){
  const arg=process.argv[2];const show=(r)=>{for(const X in r){console.log('Front '+X+' — résultantes haut/droite/bas/gauche :',Object.values(r[X].resultantes).join('/'));
    if(!r[X].liens.length)console.log('   aucune liaison connectée');r[X].liens.forEach(l=>console.log('   '+l.niveau.padEnd(5)+l.sens.padEnd(28)+' maisons traversées M'+l.maisons.join(',M')+' | compatibles (élément de la maison = niveau) : '+(l.compatibles.length?'M'+l.compatibles.join(',M'):'aucune')+' | arrêts : '+(l.arrets.length?'M'+l.arrets.join(',M')+' → COUPÉE':'aucun')))}};
  if(!arg){console.log('STRUCTURE (chaque maison porte son antagoniste)');show(reseau(null))}
  else{const m=arg.split('-').map(Number);const L=K.lire(K.construireTheme(...m.map(K.fig)));const b={};for(let h=1;h<=16;h++)b[h]=K.num(L.maisons[h-1].base);console.log('THÈME '+arg);show(reseau(b))}
}
