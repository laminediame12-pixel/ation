// Teste plusieurs lectures de « l'ancrage » sur les 11 références (instantanés).
const J=require('./src/J.json');const F=J.figures;
const num=f=>F.indexOf(f)+1,front=f=>'ABCD'[(num(f)-1)%4],par=f=>num(f)%2;
const frontMaison=h=>'ABCD'[(h-1)%4];
const rows=[];
for(const r of J.references){const s=r.snapshot,p1=s.theme[s.poles.R1],p7=s.theme[s.poles.R7];
 const pos=[];for(const h of s.houses){for(const x of h.positions)pos.push({h:h.house,f:x.figure,c:x.couches,force:x.forcePct});}
 const camp=pole=>({front:new Set(F.filter(f=>front(f)===front(pole))),boucle:new Set(F.filter(f=>par(f)===par(pole)))});
 const c1=camp(p1),c7=camp(p7);
 const M={};
 const m=(name,fn)=>{M[name]=[fn(c1,p1),fn(c7,p7)];};
 // a) maisons paires tenues (base dans la boucle du camp)
 m('maisonsPairesTenues',c=>s.houses.filter(h=>h.house%2===0&&c.boucle.has(h.base)).length);
 // b) maisons Terre tenues
 m('maisonsTerreTenues',c=>s.houses.filter(h=>h.house%4===0&&c.boucle.has(h.base)).length);
 // c) figures du front du pôle placées dans une maison de leur front (base+résultante)
 m('frontDansSesMaisons',c=>pos.filter(x=>c.front.has(x.f)&&frontMaison(x.h)===front(x.f)).length);
 // d) figures de la boucle placées dans une maison de leur propre front
 m('boucleDansSesMaisons',c=>pos.filter(x=>c.boucle.has(x.f)&&frontMaison(x.h)===front(x.f)).length);
 // e) figures du front du pôle en maisons Terre
 m('frontEnTerre',c=>pos.filter(x=>c.front.has(x.f)&&x.h%4===0).length);
 // f) figures du front du pôle en maisons paires
 m('frontEnPaires',c=>pos.filter(x=>c.front.has(x.f)&&x.h%2===0).length);
 // g) présences totales du front du pôle
 m('presencesFront',c=>pos.filter(x=>c.front.has(x.f)).length);
 // h) somme des forces du front du pôle
 m('forcesFront',c=>pos.filter(x=>c.front.has(x.f)).reduce((t,x)=>t+(x.force||0),0));
 // i) figures de la boucle au repos propre
 m('reposPropres',c=>pos.filter(x=>c.boucle.has(x.f)&&num(x.f)===x.h).length);
 rows.push({id:r.id,exp:r.expected,p1:p1+'('+front(p1)+')',p7:p7+'('+front(p7)+')',memeBoucle:par(p1)===par(p7),memeFront:front(p1)===front(p7),M});}
const names=Object.keys(rows[0].M);
for(const x of rows)console.log(x.id.padEnd(21),'att',x.exp,x.p1.padEnd(18),x.p7.padEnd(20),x.memeFront?'MÊME FRONT':x.memeBoucle?'même boucle':'boucles ≠');
console.log('\nMétrique                 | victoires bien prédites (5) | détail R1–R7 par référence');
for(const n of names){let ok=0;const det=rows.map(x=>{const[a,b]=x.M[n];const v=a>b?'1':b>a?'2':'=';if(x.exp!=='N'&&v===x.exp)ok++;return x.id.replace('_REFERENCE','').replace('VICTOIRE','V').replace('NUL','N')+':'+a+'-'+b;});
 console.log(n.padEnd(24),'|',ok+'/5','|',det.join(' '));}
