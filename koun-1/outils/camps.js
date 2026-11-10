const J=require('./src/J.json');
const theme=process.argv.slice(2);
function analyse(snap){const s1=new Set([...snap.fronts.R1.front,...snap.fronts.R1.binomes]),s7=new Set([...snap.fronts.R7.front,...snap.fronts.R7.binomes]);
 const cl=f=>!f?'—':s1.has(f)&&s7.has(f)?'commun':s1.has(f)?'R1':s7.has(f)?'R7':'?';
 const rows=snap.houses.map(h=>({h:h.house,b:h.base,cb:cl(h.base),r:h.house===16?'':h.result,cr:h.house===16?'—':cl(h.result)}));
 const full=c=>rows.filter(x=>x.cb===c&&(x.cr===c||x.cr==='—')).map(x=>'M'+x.h);return {rows,R1:full('R1'),R7:full('R7')};}
for(const r of J.references){const a=analyse(r.snapshot);console.log(r.id.padEnd(22),'attendu',r.expected,'| moteur',r.snapshot.decision.verdict,'| R1 tient',a.R1.length,a.R1.join(','),'| R7 tient',a.R7.length,a.R7.join(','));}
