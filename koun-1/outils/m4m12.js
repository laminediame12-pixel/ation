// Hypothèse : M8 et M12 renforcent le pôle présent ; M4 a la fonction inverse (affaiblit le pôle présent).
const J=require('./src/J.json');const live=require('./refs130.json');const F=J.figures;const N=f=>F.indexOf(f)+1;
const C={1:'Est',5:'Nord',9:'Ouest',13:'Sud',2:'Est',6:'Nord',10:'Ouest',14:'Sud',3:'Est',15:'Nord',11:'Ouest',7:'Sud',4:'Est',16:'Nord',12:'Ouest',8:'Sud'};
let ok=0;
for(const r of J.references){const c=live.find(x=>x.id===r.id).c;const p1=c.theme[c.poles.R1],p7=c.theme[c.poles.R7];
 const memeBoucle=(N(p1)%2)===(N(p7)%2);
 const score={R1:0,R7:0},conc={R1:0,R7:0},det=[];
 for(const h of [4,8,12]){const m=c.houses[h-1];const sig=h===4?-1:1;
  for(const [k,p] of [['R1',p1],['R7',p7]])if(m.base===p||m.result===p){score[k]+=sig;const cc=(m.forceBase||0)+(m.forceResultante||0);if(sig>0)conc[k]=Math.max(conc[k],cc);
   det.push('M'+h+(sig>0?' renforce ':' affaiblit ')+k+' ('+m.base+' → '+m.result+', '+cc+')');}}
 let v;if(memeBoucle)v='N';else if(score.R1>score.R7)v='1';else if(score.R7>score.R1)v='2';else if(score.R1>0&&conc.R1!==conc.R7)v=conc.R1>conc.R7?'1':'2';else v=(score.R1===0&&score.R7===0&&!det.length)?'?':'N';
 if(v===r.expected)ok++;
 console.log(r.id.padEnd(21),'att',r.expected,'| lecture',v.padEnd(2),v===r.expected?'✅':v==='?'?'… aucun signal':'❌','|',memeBoucle?'même boucle → nul':'score R1 '+score.R1+' / R7 '+score.R7,'|',det.join(' ; ')||'—');}
console.log('Concordants :',ok+'/11');
