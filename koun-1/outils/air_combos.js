const src=require('fs').readFileSync('air_modele.js','utf8');const lire=eval('(()=>{'+src.split('for(const [nom,air] of')[0]+';return lire;})()');
const J=require('./src/J.json');const live=require('./refs141.json');
const S={'+':1,'−':-1,'0':0};const res=[];
for(const m10 of ['+','−'])for(const m6 of ['+','−','0'])for(const m14 of ['+','−','0']){const air={m2:1,m10:S[m10],m6:S[m6],m14:S[m14]};
 let ok=0;const faux=[],touche=new Set();
 for(const r of J.references){const c=live.find(x=>x.id===r.id).c;const a=lire(c,air);if(a.v===r.expected)ok++;else faux.push(r.id.replace('_REFERENCE','').replace('VICTOIRE','V').replace('NUL','N'));
  a.det.forEach(d=>{const m=d.match(/^M(6|14) /);if(m)touche.add('M'+m[1]+':'+r.id.replace('_REFERENCE','').replace('VICTOIRE','V').replace('NUL','N').replace('AZ_VILLARREAL','AZ'));});}
 res.push({cle:'M10 '+m10+' · M6 '+m6+' · M14 '+m14,ok,faux,touche:[...touche]});}
res.sort((a,b)=>b.ok-a.ok);for(const x of res)console.log(x.cle.padEnd(24),x.ok+'/11','| faux :',x.faux.join(', ')||'aucun','| M6/M14 présents :',x.touche.join(' ')||'—');
