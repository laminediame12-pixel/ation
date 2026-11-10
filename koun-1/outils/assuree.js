// Évalue la configuration « victoire assurée » actuelle du moteur (motifAncrage) sur les références.
const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(S+'/src/core.html','utf8'));await p.waitForTimeout(1000);
const J=JSON.parse(fs.readFileSync(S+'/src/J.json','utf8'));
const out=await p.evaluate((J)=>{const rows=[];
 const lire=(c)=>({complet:c.completude.frontsComplets,presents:c.completude.obtenuFrontDirect,favorables:c.completude.frontsBienAncres,favComplet:c.completude.frontsFavorablesComplets,
   pieges:c.piegesImpairs.map(t=>'M'+t.house+' '+t.base+'→'+t.resultante),terre:c.ancrages.maisonsTerre,air:c.ancrages.maisonsAir});
 for(const r of J.references){const a=window.MOTEUR_UNIQUE.analyser(window.buildThemeFromMothers(...r.mothers));
  const c=a.confrontationTransformations,k=a.arbitrageConfrontation.criteres;
  rows.push({id:r.id,exp:r.expected,v:a.decisionFinale.verdict,R1:{fig:c.R1.figurePole,front:c.R1.frontDirect,...lire(c.R1),motif:k.R1?.motifAncrage??"(nul confirmé, non évalué)",adv:k.R1?.adversaireIncompletOuMalPositionne,sup:k.R1?.ancrageSuperieur},
   R7:{fig:c.R7.figurePole,front:c.R7.frontDirect,...lire(c.R7),motif:k.R7?.motifAncrage??"(nul confirmé, non évalué)",adv:k.R7?.adversaireIncompletOuMalPositionne,sup:k.R7?.ancrageSuperieur},avantage:a.arbitrageConfrontation.avantageAncrage});}
 // banc exhaustif : fréquence du motif
 const figs=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const st={R1:0,R7:0,aucun:0,lesDeux:0};
 for(let x=0;x<16;x++)for(let y=0;y<16;y++)for(let z=0;z<16;z++)for(let w=0;w<16;w++){const a=window.MOTEUR_UNIQUE.analyser(window.buildThemeFromMothers(figs[x],figs[y],figs[z],figs[w]));
  const k=a.arbitrageConfrontation&&a.arbitrageConfrontation.criteres;if(!k||!k.R1){st.nulConfirme=(st.nulConfirme||0)+1;continue;}const m1=k.R1.motifAncrage,m7=k.R7.motifAncrage;m1&&m7?st.lesDeux++:m1?st.R1++:m7?st.R7++:st.aucun++;}
 return {rows,st};},J);
for(const x of out.rows){console.log('\n'+x.id,'| attendu',x.exp,'| moteur',x.v,'| avantage d’ancrage',x.avantage||'aucun');
 for(const c of ['R1','R7']){const d=x[c];console.log('  '+c,d.fig.padEnd(15),'front',d.presents+'/4','favorables',d.favorables+'/4','Terre',JSON.stringify(d.terre),'Air',JSON.stringify(d.air),'pièges',d.pieges.join(', ')||'—','| complet',d.complet,'adv. faible',d.adv,'ancrage sup.',d.sup,'=> MOTIF',d.motif);}}
console.log('\nBanc exhaustif (65 536) :',JSON.stringify(out.st));await br.close();})();
