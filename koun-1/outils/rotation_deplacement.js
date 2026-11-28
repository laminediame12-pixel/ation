// Déplacement des figures au niveau de la rotation (2026-11-28) : (1) effet des déplacements de R1 et R7 sur les nœuds le long du cycle de la chaîne des vérifications ; (2) trajectoire +6 du panneau « Déplacement R1 / R7 ». Usage : node outils/rotation_deplacement.js
const R=require('path').join(__dirname,'..'),fs=require('fs'),M=require(R+'/moteur4/moteur.js'),K=require(R+'/moteur3/noyau.js'),N=K.nom,mod=n=>((n-1)%16+16)%16+1;
const lire=f=>JSON.parse(fs.readFileSync(R+'/'+f,'utf8'));const dev=new Map(),aj=(t,s,nom,lot)=>{const k=t.join('-');if(!dev.has(k))dev.set(k,{m:t,sc:s,nom,lot});};
lire('validation/scores-reels.json').forEach(x=>aj(x.themes,x.score,x.match,'dév.'));lire('validation/themes-18.json').forEach(x=>aj(x.themes,x.score.split('-').map(Number),x.match||'?','dév.'));
aj(lire('validation/lot-2.json')[0].themes[0],lire('validation/lot-2.json')[0].score.split('-').map(Number),'lot 2','dév.');
['validation/resultats-aveugles-2026-11-23.json','validation/resultats-aveugles-2026-11-25.json','validation/resultats-2026-11-25.json'].forEach(f=>lire(f).matchs.forEach(x=>aj(x.theme,x.score,x.match,'dév.')));
lire('validation/resultats-2026-11-26.json').matchs.forEach(x=>aj(x.theme,x.score,x.match,'26/11'));lire('validation/resultats-2026-11-27.json').matchs.forEach(x=>aj(x.theme,x.score,x.match,'27/11'));
const T=m=>{const b=K.construire(m).bases;return [b[1],b[4],b[7],b[10]];};
function cycle(m){const vu=new Map(),seq=[];let x=m,k=0;while(!vu.has(x.join('-'))){vu.set(x.join('-'),k);seq.push(x);x=T(x);k++;}return seq.slice(vu.get(x.join('-')));}
// effet du déplacement d'un pôle sur les nœuds pleins du front de sa maison (en contexte : thème réel contre le même thème avec la maison du pôle remise au repos)
const carte=Lx=>{const F=M.noeuds(Lx).fronts,o={};F.forEach((x,k)=>x.noeuds.forEach(n=>{o[k+':'+n.maison]=n.etat;}));return {F,o};};
function effet(m,p){const L=M.lire(m),h=L[p].maison,k=(h-1)%4,Cr=carte({theme:L.theme,resu:L.resu}),Cz=carte({theme:{bases:L.theme.bases.map((x,i)=>i===h?16:x)},resu:i=>i===h?(h===16?16:h):L.resu(i)});return Cr.F[k].pleins-Cz.F[k].pleins;}
const D=[...dev.values()].map(d=>{const C=cycle(d.m),e1=C.map(m=>effet(m,'R1')),e7=C.map(m=>effet(m,'R7'));return {...d,C,e1,e7,g0:Math.abs(effet(d.m,'R1')-effet(d.m,'R7')),r:d.sc[0]>d.sc[1]?'R1':d.sc[0]<d.sc[1]?'R7':'N'};});
const pc=(a,n)=>n?Math.round(100*a/n)+'%':'—';
const tab=(lab,key)=>{const G={};D.forEach(d=>{const k=key(d);G[k]=G[k]||{n:0,nul:0,l:{}};G[k].n++;if(d.r==='N')G[k].nul++;const q=G[k].l[d.lot]=G[k].l[d.lot]||[0,0];q[1]++;if(d.r==='N')q[0]++;});console.log(lab);Object.keys(G).sort().forEach(k=>console.log('   '+String(k).padEnd(44)+(G[k].nul+'/'+G[k].n).padStart(7)+' '+pc(G[k].nul,G[k].n).padStart(4)+' · '+Object.entries(G[k].l).map(([l,v])=>l+' '+v[0]+'/'+v[1]).join(' · ')));};
const sum=a=>a.reduce((s,x)=>s+x,0);
console.log(D.length+' matchs · nuls '+D.filter(d=>d.r==='N').length);
tab('repère : écart des deux déplacements dans le thème principal',d=>Math.min(d.g0,3)+(d.g0>=3?'+':''));
tab('écart des sommes d\'effets sur toute la rotation |ΣR1 − ΣR7|',d=>{const g=Math.abs(sum(d.e1)-sum(d.e7));return g>=4?'4+':String(g);});
tab('pas de la rotation où les deux effets sont égaux',d=>{const n=d.e1.filter((x,i)=>x===d.e7[i]).length;return n===d.C.length?'tous':n===0?'aucun':'certains';});
tab('écart moyen par pas (arrondi)',d=>{const g=sum(d.e1.map((x,i)=>Math.abs(x-d.e7[i])))/d.C.length;return g<1?'< 1':g<2?'1 à 2':'2 et plus';});
console.log('\nTRAJECTOIRE +6 (rotation du panneau « Déplacement R1 / R7 ») :');
const zone=f=>({4:1,8:1,12:1,16:1})[f]?'noyau Terre':({6:1,10:1,14:1})[f]?'mobile':'hors cycle';
D.forEach(d=>{const L=M.lire(d.m),f1=L.R1.figure,f7=L.R7.figure;d.f1=f1;d.f7=f7;let s=null;for(let k=0;k<8;k++)if(mod(f1+6*k)===f7){s=k;break;}d.pas6=s;
 // la figure de R7 vue depuis celle de R1 : 0 = même figure, 1 = un pas +6 (comme les maisons R1 → R7), 7 = un pas en arrière
});
tab('même orbite +6 (même parité de figure) et pas de R1 vers R7',d=>d.pas6===null?'orbites différentes':'pas '+d.pas6);
tab('zones des figures des pôles (R1 · R7)',d=>zone(d.f1)+' · '+zone(d.f7));
tab('pas de la maison de R1 vers sa figure (rotation +6)',d=>{let s=null;for(let k=0;k<8;k++)if(mod(M.lire(d.m).R1.maison+6*k)===d.f1){s=k;break;}return s===null?'autre orbite':'pas '+s;});
