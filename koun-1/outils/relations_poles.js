// Relations exactes entre les deux pôles R1 et R7 sur les 65 536 thèmes (aucun score lu). Usage : node outils/relations_poles.js
const N=require('../moteur3/noyau.js');
const mod=n=>((n-1)%16+16)%16+1;
const rel={},H={},pairs=new Set(),pol={};let tot=0;
const inc=(o,k)=>o[k]=(o[k]||0)+1;
for(let q=0;q<65536;q++){const m=[q&15,(q>>4)&15,(q>>8)&15,(q>>12)&15].map(x=>x+1),T=N.construire(m),P=N.poles(T);tot++;
 const a=P.R1.figure,b=P.R7.figure,fa=N.front(a),fb=N.front(b);
 let r;
 if(a===b)r='même figure';
 else if(fa===fb&&N.miroir(a)===b)r='même front · miroir';
 else if(fa===fb)r='même front · autre figure';
 else if(mod(a-3)===b||mod(b-3)===a)r='attaque directe (k et k±3)';
 else if(N.binome(a)===b)r='binôme';
 else if(a%2===b%2)r='même boucle, fronts différents';
 else r='boucles différentes';
 inc(rel,r);inc(H,P.R1.maison);pairs.add(P.R1.maison+'|'+a+'|'+b);
 const k=P.R1.maison; (pol[k]=pol[k]||new Set()).add(a);}
console.log('relations R1/R7 :');Object.entries(rel).sort((x,y)=>y[1]-x[1]).forEach(([k,v])=>console.log(' ',k.padEnd(34),v,(100*v/tot).toFixed(1)+'%'));
console.log('maisons de R1 :',JSON.stringify(H));
console.log('triplets distincts (maison R1, figure R1, figure R7) :',pairs.size);
console.log('figures possibles pour R1 selon sa maison :',Object.entries(pol).map(([k,v])=>k+':'+v.size).join(' '));
