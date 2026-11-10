// Renforts du pôle par les maisons Terre : M8 (miroir) et M12 (voisin Est↔Sud / Nord↔Ouest).
const J=require('./src/J.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const md=n=>((n-1)%16+16)%16+1;
const CARD={1:'Est',5:'Nord',9:'Ouest',13:'Sud',2:'Est',6:'Nord',10:'Ouest',14:'Sud',3:'Est',15:'Nord',11:'Ouest',7:'Sud',4:'Est',16:'Nord',12:'Ouest',8:'Sud'};
const lab=n=>n+' '+F[n-1]+' ('+'ABCD'[(n-1)%4]+'·'+CARD[n]+')';
// Paires de chaque maison Terre, selon la table du moteur (instantané : figure de base -> résultante)
const pairs={4:{},8:{},12:{}};
for(const r of J.references)for(const h of r.snapshot.houses)if(pairs[h.house])pairs[h.house][N(h.base)]=N(h.result);
const acc={8:k=>md(k+8),12:k=>({1:13,13:1,2:14,14:2,3:7,7:3,4:8,8:4,5:9,9:5,6:10,10:6,11:15,15:11,12:16,16:12})[k],4:k=>({1:5,5:1,2:6,6:2,3:15,15:3,4:16,16:4,7:11,11:7,8:12,12:8,9:13,13:9,10:14,14:10})[k]};
const typ=(a,b)=>acc[8](a)===b?'vis-à-vis (M8)':acc[12](a)===b?'voisins Est↔Sud/Nord↔Ouest (M12)':acc[4](a)===b?'voisins Est↔Nord/Ouest↔Sud (M4)':'?';
console.log('Paire renforcée → paire attaquée (k attaque k+3) :');
for(const h of [8,12]){const vus={};for(let k=1;k<=16;k++){const a=k,b=acc[h](k);if(a>b)continue;const t=typ(md(a+3),md(b+3));vus[t]=(vus[t]||0)+1;}
 console.log(' M'+h+' :',JSON.stringify(vus));}
console.log(' Exemple M12 : '+lab(4)+' + '+lab(8)+' attaquent '+lab(7)+' + '+lab(11));
console.log('\nRéférences :');
for(const r of J.references){const s=r.snapshot,p1=N(s.theme[s.poles.R1]),p7=N(s.theme[s.poles.R7]);
 const ren=h=>{const b=N(s.theme[h]),res=acc[h](b);const c=[];if(b===p1||res===p1)c.push('R1');if(b===p7||res===p7)c.push('R7');return c.join('+')||'—';};
 console.log(' '+r.id.padEnd(21),'att',r.expected,'| R1',lab(p1).padEnd(28),'R7',lab(p7).padEnd(28),'| M8 :',ren(8).padEnd(5),'M12 :',ren(12).padEnd(5),'| M12 =',F[N(s.theme[12])-1],'→',F[acc[12](N(s.theme[12]))-1]);}
