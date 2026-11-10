// Mécanique M7 + M12 : quelle figure, où réapparaît-elle (M4, M10, base ou résultante), et que dit-elle des pôles ?
const J=require('./src/J.json');const live=require('./refs140.json');const F=J.figures;const N=f=>F.indexOf(f)+1;
const PTS={Puer:[1,1,2,1],Laetitia:[1,2,2,2],Caput:[2,1,1,1],Albus:[2,2,1,2],Via:[1,1,1,1],Amissio:[1,2,1,2],Rubeus:[2,1,2,2],Tristitia:[2,2,2,1],'Fortuna Minor':[1,1,2,2],Carcer:[1,2,2,1],Conjunctio:[2,1,1,2],'Fortuna Major':[2,2,1,1],'Cauda Draconis':[1,1,1,2],Puella:[1,2,1,1],Aquisitio:[2,1,2,1],Populus:[2,2,2,2]};
const plus=(a,b)=>{const s=PTS[a].map((x,i)=>((x+PTS[b][i])%2===0)?2:1);return Object.keys(PTS).find(k=>PTS[k].join()===s.join());};
const C={1:'Est',5:'Nord',9:'Ouest',13:'Sud',2:'Est',6:'Nord',10:'Ouest',14:'Sud',3:'Est',15:'Nord',11:'Ouest',7:'Sud',4:'Est',16:'Nord',12:'Ouest',8:'Sud'};
const lab=f=>f+' ('+'ABCD'[(N(f)-1)%4]+'·'+C[N(f)]+')';const mir=f=>F[(N(f)+7)%16];
for(const r of J.references){const c=live.find(x=>x.id===r.id).c;const h=k=>c.houses[k-1];
 const p={R1:c.theme[c.poles.R1],R7:c.theme[c.poles.R7]};const camp=f=>(N(f)%2)===(N(p.R1)%2)?'R1':'R7';
 const role=f=>{const t=[];for(const k of ['R1','R7']){if(f===p[k])t.push('pôle '+k);else if(f===mir(p[k]))t.push('miroir '+k);}return t.join(',')||camp(f);};
 const variantes={'base7+base12':plus(h(7).base,h(12).base),'rés7+rés12':plus(h(7).result,h(12).result),'base7+rés12':plus(h(7).base,h(12).result),'rés7+base12':plus(h(7).result,h(12).base)};
 console.log('\n'+r.id,'| attendu',r.expected,'| R1',p.R1,'R7',p.R7,'| M8 =',c.theme[8],'| moteur',c.decision.verdict);
 for(const [k,f] of Object.entries(variantes)){const ou=[];for(const m of [4,10]){if(h(m).base===f)ou.push('M'+m+' base');if(h(m).result===f)ou.push('M'+m+' rés');}
  console.log('  '+k.padEnd(13),'→',lab(f).padEnd(30),'['+role(f)+']','| en M4/M10 :',ou.join(', ')||'—');}
 console.log('  M4 :',h(4).base,'→',h(4).result,'| M10 :',h(10).base,'→',h(10).result);}
