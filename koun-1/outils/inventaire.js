// Inventaire de toutes les couches d'analyse du moteur, appliquées aux 11 thèmes réels.
const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(S+'/src/core.html','utf8'));await p.waitForTimeout(1500);
const J=JSON.parse(fs.readFileSync(S+'/src/J.json','utf8'));
const out=await p.evaluate((J)=>{
 const noms=Object.keys(window).filter(k=>{try{return typeof window[k]==='function'}catch(e){return false}}).filter(k=>/^(analys|evaluer|detecter|calcul|moteur|lire|scor|duel|indice|signature|matrice|lecture)/i.test(k));
 const res={noms:[],erreurs:{},refs:{}};
 for(const r of J.references){document.getElementById('team1').value='R1';document.getElementById('team2').value='R7';
  const th=window.buildThemeFromMothers(...r.mothers);window.currentTheme=th;const feats={};
  for(const n of noms){let v;try{v=window[n](th);}catch(e){res.erreurs[n]=e.message;continue;}
   // feuilles numériques / booléennes, chemin limité
   const walk=(o,path,depth)=>{if(depth>6||o==null)return;if(typeof o==='number'&&isFinite(o)){feats[path]=o;return;}if(typeof o==='boolean'){feats[path]=o?1:0;return;}
    if(typeof o==='string'){if(o.length<=12)feats[path+'=']=o;return;}if(Array.isArray(o)){feats[path+'.length']=o.length;o.slice(0,20).forEach((x,i)=>walk(x,path+'['+i+']',depth+1));return;}
    if(typeof o==='object'){let i=0;for(const k of Object.keys(o)){if(i++>80)break;walk(o[k],path+'.'+k,depth+1);}}};
   walk(v,n,0);}
  res.refs[r.id]={exp:r.expected,feats};}
 res.noms=noms;return res;},J);
fs.writeFileSync(S+'/../inventaire.json',JSON.stringify(out));
console.log('couches appelées :',out.noms.length,'| erreurs :',Object.keys(out.erreurs).length);
console.log('mesures extraites par thème :',Object.keys(Object.values(out.refs)[0].feats).length);
console.log(out.noms.join(', '));await br.close();})();
