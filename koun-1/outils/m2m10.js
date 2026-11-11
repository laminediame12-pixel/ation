// Sur les 11 thèmes réels : lecture d'ensemble 1.14 + M10/M2 (paire miroir Air), dans les deux sens possibles.
const J=require('./src/J.json');const live=require('./refs140.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const mir=f=>F[(N(f)+7)%16];
function lire(c,air){const p={R1:c.theme[c.poles.R1],R7:c.theme[c.poles.R7]};const camp=f=>(N(f)%2)===(N(p.R1)%2)?'R1':'R7';const autre=k=>k==='R1'?'R7':'R1';
 if((N(p.R1)%2)===(N(p.R7)%2))return {v:'N',det:['même boucle']};
 const pts={R1:0,R7:0},conc={R1:0,R7:0},det=[];const h=k=>c.houses[k-1];
 const porte=(m,k,mi)=>m.base===p[k]||m.result===p[k]||(mi&&(m.base===mir(p[k])||m.result===mir(p[k])));
 const regles=[[4,-1,false],[8,1,true],[12,1,false]].concat(air?[[10,air.m10,true],[2,air.m2,true]]:[]);
 for(const [k,s,mi] of regles){const m=h(k);for(const c2 of ['R1','R7'])if(porte(m,c2,mi)){if(s<0){pts[autre(c2)]++;det.push('M'+k+' affaiblit '+c2);}else{pts[c2]++;if(k%4===0)conc[c2]=Math.max(conc[c2],(m.forceBase||0)+(m.forceResultante||0));det.push('M'+k+' renforce '+c2);}}}
 for(const k of [15,7]){const m=h(k);const tag=f=>[p.R1,p.R7,mir(p.R1),mir(p.R7)].includes(f);const cb=camp(m.base),cr=camp(m.result);
  if((tag(m.base)||tag(m.result))&&cb!==cr&&m.forceBase!=null&&m.forceResultante!=null&&m.forceBase!==m.forceResultante){const w=m.forceBase>m.forceResultante?cb:cr;pts[w]++;det.push('M'+k+' : '+w);}}
 let t=pts.R1>pts.R7?'R1':pts.R7>pts.R1?'R7':null;if(!t&&pts.R1>0&&conc.R1!==conc.R7)t=conc.R1>conc.R7?'R1':'R7';
 const m16=['R1','R7'].filter(k=>c.theme[16]===p[k]||c.theme[16]===mir(p[k]));
 if(!t)return {v:det.length?'N':null,det};if(m16.includes(autre(t))&&!m16.includes(t))return {v:'N',det:[...det,'M16 annule']};return {v:t==='R1'?'1':'2',det};}
for(const [nom,air] of [['Sans M10/M2',null],['M10 affaiblit, M2 renforce',{m10:-1,m2:1}],['M10 renforce, M2 affaiblit',{m10:1,m2:-1}],['M10 et M2 renforcent',{m10:1,m2:1}],['M10 et M2 affaiblissent',{m10:-1,m2:-1}]]){
 let ok=0;const ko=[],touche=[];
 for(const r of J.references){const c=live.find(x=>x.id===r.id).c;const a=lire(c,air);if(a.v===r.expected)ok++;else ko.push(r.id.replace('_REFERENCE','').replace('VICTOIRE','V').replace('NUL','N')+' → '+a.v);
  if(air&&a.det.some(d=>/^M(10|2) /.test(d)))touche.push(r.id.replace('_REFERENCE','').replace('VICTOIRE','V').replace('NUL','N').replace('AZ_VILLARREAL','AZ'));}
 console.log(nom.padEnd(30),ok+'/11','| faux :',ko.join(', ')||'aucun','| concernés :',touche.join(', ')||'—');}
