const fs=require('fs'),R='/home/user/ation/koun-1',M=require(R+'/moteur4/moteur.js'),K=require(R+'/moteur3/noyau.js'),T=require(R+'/validation/themes-25-30-novembre.json');
const NOY=[4,8,12,16],MOB=[6,10,14],terre=(b,h)=>K.niveaux(b[h])[3]===2;
const ph=L=>{let n=0,m=0;for(let h=1;h<=16;h++)[L.theme.bases[h],L.resu(h)].forEach(f=>{if(NOY.includes(f))n++;if(MOB.includes(f))m++});return m>n?-1:1};
const sc=L=>{const d=((L.R7.figure-L.R1.figure)%16+16)%16;return ph(L)+(MOB.includes(d)||MOB.includes(L.lien)?-1:0)+(M.equilibre(L).equilibre?1:0)+([1,2,3].every(h=>terre(L.theme.bases,h))?1:0)+(terre(L.theme.bases,14)?1:0)};
const P=T.map(x=>{const s=sc(M.lire(x.theme.split('-').map(Number)));return{date:x.date,championnat:x.championnat,match:x.equipe1+' – '+x.equipe2,theme:x.theme,score:s,nul:s>=3?'fréquent':s<=0?'écarté':'possible'}});
fs.writeFileSync(R+'/validation/predictions-nul-convergence-24-30-novembre.json',JSON.stringify({fige_le:'2026-11-25',regle:'convergence des signes du nul (outils/nul_convergence.js) : score ≥ +3 nul fréquent, ≤ 0 nul écarté',matchs:P},null,1));
console.log('fréquent',P.filter(p=>p.nul==='fréquent').length,'· écarté',P.filter(p=>p.nul==='écarté').length,'· possible',P.filter(p=>p.nul==='possible').length);console.log('fréquent :',P.filter(p=>p.nul==='fréquent').map(p=>p.match).join(', '));
