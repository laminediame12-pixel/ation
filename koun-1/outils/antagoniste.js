// Antagoniste du pôle (celui qui l'attaque : k-3) et son propre antagoniste (k-6, allié du pôle) : présence et positions.
const J=require('./src/J.json');const live=require('./refs130.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const fig=n=>F[((n-1)%16+16)%16];
const C={1:'Est',5:'Nord',9:'Ouest',13:'Sud',2:'Est',6:'Nord',10:'Ouest',14:'Sud',3:'Est',15:'Nord',11:'Ouest',7:'Sud',4:'Est',16:'Nord',12:'Ouest',8:'Sud'};
for(const r of J.references){const c=live.find(x=>x.id===r.id).c;
 const pos=f=>{const o=[];for(const h of c.houses){if(h.base===f)o.push('M'+h.house+' base '+(h.forceBase??'nc')+'%');if(h.house!==16&&h.result===f)o.push('M'+h.house+' rés '+(h.forceResultante??'nc')+'%');}return o.join(', ')||'absent';};
 console.log(r.id,'| attendu',r.expected);
 for(const k of ['R1','R7']){const p=N(c.theme[c.poles[k]]);const a=fig(p-3),ctl=fig(p-6);
  console.log('  '+k+' pôle '+fig(p)+' | antagoniste '+a+' : '+pos(a)+' | contrôleur '+ctl+' : '+pos(ctl));}}
