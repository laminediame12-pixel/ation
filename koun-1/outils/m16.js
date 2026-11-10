// M16 : renforce le pôle qu'elle porte (le pôle ou son miroir, comme M8) ; « sentence finale ».
// Lecture A : M16 compte +1 comme M8/M12. Lecture B : M16 juge en dernier — elle confirme le camp en tête,
// annule sa victoire (nul) si elle porte le pôle de l'autre camp, et ne crée pas seule une victoire.
const J=require('./src/J.json');const live=require('./refs130.json');const F=J.figures;const N=f=>F.indexOf(f)+1;
const mir=f=>F[(N(f)+7)%16];
const res={A:0,B:0};
for(const r of J.references){const c=live.find(x=>x.id===r.id).c;const p={R1:c.theme[c.poles.R1],R7:c.theme[c.poles.R7]};
 const memeBoucle=(N(p.R1)%2)===(N(p.R7)%2);const sc={R1:0,R7:0},conc={R1:0,R7:0},det=[];
 for(const h of [4,8,12]){const m=c.houses[h-1],s=h===4?-1:1;for(const k of ['R1','R7'])if(m.base===p[k]||m.result===p[k]){sc[k]+=s;if(s>0)conc[k]=Math.max(conc[k],(m.forceBase||0)+(m.forceResultante||0));det.push('M'+h+(s>0?'+':'−')+k);}}
 const b16=c.theme[16];const m16=['R1','R7'].filter(k=>b16===p[k]||b16===mir(p[k]));if(m16.length)det.push('M16+'+m16.join('+')+' ('+b16+')');
 const tete=(s)=>s.R1>s.R7?'R1':s.R7>s.R1?'R7':(s.R1>0&&conc.R1!==conc.R7?(conc.R1>conc.R7?'R1':'R7'):null);
 const V=k=>k==='R1'?'1':k==='R7'?'2':null;
 // Lecture A
 let a;if(memeBoucle)a='N';else{const s={...sc};m16.forEach(k=>s[k]++);const t=tete(s);a=V(t)||(det.length?'N':'?');}
 // Lecture B
 let bb;if(memeBoucle)bb='N';else{const t=tete(sc);if(t){const autre=t==='R1'?'R7':'R1';bb=m16.includes(autre)&&!m16.includes(t)?'N':V(t);}else bb=det.length?'N':'?';}
 if(a===r.expected)res.A++;if(bb===r.expected)res.B++;
 console.log(r.id.padEnd(21),'att',r.expected,'| A',a,a===r.expected?'✅':'❌','| B',bb,bb===r.expected?'✅':'❌','|',memeBoucle?'même boucle':det.join(' ')||'—');}
console.log('Lecture A (M16 = +1) :',res.A+'/11 ; Lecture B (M16 sentence finale) :',res.B+'/11');
