// M10 dans les nuls et les victoires : figures, camps, rôles par rapport aux pôles, liens avec les autres maisons.
const J=require('./src/J.json');const live=require('./refs140.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const fig=n=>F[((n-1)%16+16)%16];
const C={1:'Est',5:'Nord',9:'Ouest',13:'Sud',2:'Est',6:'Nord',10:'Ouest',14:'Sud',3:'Est',15:'Nord',11:'Ouest',7:'Sud',4:'Est',16:'Nord',12:'Ouest',8:'Sud'};
const lab=f=>f+' '+'ABCD'[(N(f)-1)%4]+'·'+C[N(f)];
const mir=f=>fig(N(f)+8);
for(const r of J.references){const c=live.find(x=>x.id===r.id).c;const h=k=>c.houses[k-1];
 const P={R1:c.theme[c.poles.R1],R7:c.theme[c.poles.R7]};
 const role=f=>{const t=[];for(const k of ['R1','R7']){const q=N(P[k]),n=N(f);
   if(f===P[k])t.push('pôle '+k);else if(f===mir(P[k]))t.push('miroir '+k);
   else if(n===((q+3-1)%16)+1)t.push('cible de '+k);else if(n===((q-3-1+16)%16)+1)t.push('antagoniste de '+k);
   else if(n===((q-6-1+32)%16)+1)t.push('contrôleur de '+k);else if('ABCD'[(n-1)%4]==='ABCD'[(q-1)%4])t.push('front de '+k);
   else if((n%2)===(q%2))t.push('boucle de '+k);}return t.join(', ');};
 const ailleurs=f=>c.houses.filter(x=>x.house!==10&&(x.base===f||(x.house!==16&&x.result===f))).map(x=>'M'+x.house+(x.base===f?'b':'r')).join(' ');
 console.log(r.id.padEnd(21),'att',r.expected,'| R1',lab(P.R1),'(M'+c.poles.R1+') R7',lab(P.R7),'(M'+c.poles.R7+')');
 for(const [k,f,force] of [['base',h(10).base,h(10).forceBase],['rés',h(10).result,h(10).forceResultante]])
  console.log('    M10 '+k.padEnd(4),lab(f).padEnd(24),(force??'nc')+'%'.padEnd(2),'|',role(f).padEnd(38),'| aussi en',ailleurs(f)||'—');}
