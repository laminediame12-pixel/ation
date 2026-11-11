// Corrélation de toutes les mesures R1/R7 du moteur avec les 11 résultats réels, avec contrôle par permutation.
const fs=require('fs');const inv=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const ids=Object.keys(inv.refs);const exp=Object.fromEntries(ids.map(i=>[i,inv.refs[i].exp]));
// paires R1/R7 : on remplace un jeton R1 par son équivalent R7
const pairs=[['R1','R7'],['r1','r7'],['camp1','camp2'],['Camp1','Camp2'],['.1.','.2.'],['[1]','[2]'],['figR1','figR7'],['_1','_2']];
const all=new Set();for(const i of ids)for(const k of Object.keys(inv.refs[i].feats))all.add(k);
const exclus=/^(moteurVainqueurIncidence|lectureEnsembleR1R7|calculerProbabilitesVerdict|evaluerArbitrageEssai)/; // sorties de décision du moteur (construites sur le corpus)
const feats=[];
for(const k of all){if(exclus.test(k))continue;for(const [a,b] of pairs){if(!k.includes(a))continue;const k2=k.split(a).join(b);if(!all.has(k2)||k2===k)continue;
 const d={};let ok=true;for(const i of ids){const x=inv.refs[i].feats[k],y=inv.refs[i].feats[k2];if(typeof x!=='number'||typeof y!=='number'){ok=false;break;}d[i]=x-y;}
 if(ok)feats.push({k,d});break;}}
// dédoublonnage par vecteur de différences
const seen=new Map();for(const f of feats){const key=ids.map(i=>Math.sign(f.d[i])).join(',');if(!seen.has(key))seen.set(key,f);}
const uniques=[...seen.values()];
const decisifs=ids.filter(i=>!/NUL_REFERENCE_[2345]$/.test(i)); // les 4 nuls « même boucle » sont tranchés par la règle de boucle
const score=(f,E,sgn)=>{let ok=0;for(const i of decisifs){const s=Math.sign(f.d[i])*sgn;const v=s>0?'1':s<0?'2':'N';if(v===E[i])ok++;}return ok;};
const best=uniques.map(f=>{const a=score(f,exp,1),b=score(f,exp,-1);return {k:f.k,ok:Math.max(a,b),sens:a>=b?'+':'−',d:f.d};}).sort((x,y)=>y.ok-x.ok);
const parfait=best.filter(x=>x.ok===decisifs.length);
console.log('Mesures R1/R7 appariées :',feats.length,'| profils distincts :',uniques.length,'| matchs décisifs évalués :',decisifs.length);
const hist={};best.forEach(x=>hist[x.ok]=(hist[x.ok]||0)+1);console.log('Répartition des scores :',JSON.stringify(hist));
console.log('\nMeilleures mesures :');best.slice(0,15).forEach(x=>console.log(' ',x.ok+'/'+decisifs.length,x.sens,x.k.slice(0,110),'|',decisifs.map(i=>Math.sign(x.d[i])).join(' ')));
// contrôle par permutation des résultats
let tot=0,max=[];const R=200;const vals=decisifs.map(i=>exp[i]);
for(let t=0;t<R;t++){const sh=[...vals].sort(()=>Math.random()-.5);const E={...exp};decisifs.forEach((i,j)=>E[i]=sh[j]);let n=0,m=0;
 for(const f of uniques){const s=Math.max(score(f,E,1),score(f,E,-1));if(s===decisifs.length)n++;if(s>m)m=s;}tot+=n;max.push(m);}
console.log('\nContrôle (résultats mélangés au hasard, '+R+' tirages) : mesures « parfaites » en moyenne :',(tot/R).toFixed(1),'| meilleur score moyen :',(max.reduce((a,b)=>a+b,0)/R).toFixed(2));
console.log('Avec les vrais résultats : mesures parfaites :',parfait.length);
fs.writeFileSync(process.argv[2].replace('inventaire.json','correl_resultats.json'),JSON.stringify(best.slice(0,200),null,1));
