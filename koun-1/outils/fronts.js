// Fronts de R1 et R7 : chaque figure du front direct et du binôme, positions, forces, ancrage, attaques subies et portées.
const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];const M=process.argv.slice(3);
(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.setContent(fs.readFileSync(S+'/src/core.html','utf8'));await p.waitForTimeout(1000);
const o=await p.evaluate((M)=>{document.getElementById('team1').value='R1';document.getElementById('team2').value='R7';
 const th=window.buildThemeFromMothers(...M);const a=window.MOTEUR_UNIQUE.analyser(th);const d=a.confrontationTransformations,b=d.baremeForces,g=d.duelsFigures;
 const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const N=f=>F.indexOf(f)+1;const fig=n=>F[((n-1)%16+16)%16];
 const CARD={1:'Est',5:'Nord',9:'Ouest',13:'Sud',2:'Est',6:'Nord',10:'Ouest',14:'Sud',3:'Est',15:'Nord',11:'Ouest',7:'Sud',4:'Est',16:'Nord',12:'Ouest',8:'Sud'};
 const pos=f=>(b.parFigure[f]||[]).filter(x=>x.couches.includes('base')||x.couches.includes('resultante')).map(x=>'M'+x.house+(x.couches.includes('base')?' b ':' r ')+(x.forcePct===null?'nc':x.forcePct+'%')+(x.house%4===0?' T':x.house%2===0?' A':''));
 const edge=(at,ci)=>g.attaques.find(e=>e.attaquant===at&&e.cible===ci);
 const ligne=f=>{const n=N(f),cible=fig(n+3),att=fig(n-3),eo=edge(f,cible),ei=edge(att,f);
  return {f,card:'ABCD'[(n-1)%4]+'·'+CARD[n],pos:pos(f),repos:(b.parFigure[f]||[]).some(x=>x.reposPropreIci&&x.forcePct===100),
   attaque:cible+' ('+(eo?eo.etat:'—')+')',subit:att+' ('+(ei?ei.etat:'—')+')'};};
 const camp=k=>{const c=d[k];return {pole:c.figurePole,maison:c.maisonPole,front:c.frontDirect.map(ligne),binome:c.frontBinome.map(ligne),
   completude:c.completude.obtenuFrontDirect+'/4 front, '+c.completude.obtenuFrontBinome+'/4 binôme, '+c.completude.frontsBienAncres+'/4 bien ancrés',
   terre:c.ancrages.maisonsTerre,air:c.ancrages.maisonsAir,pieges:c.piegesImpairs.map(t=>'M'+t.house+' '+t.base+'→'+t.resultante)};};
 return {R1:camp('R1'),R7:camp('R7')};},M);
for(const k of ['R1','R7']){const c=o[k];console.log('\n=== '+k+' pôle '+c.pole+' M'+c.maison+' | '+c.completude+' | Terre '+JSON.stringify(c.terre)+' Air '+JSON.stringify(c.air)+' | pièges '+(c.pieges.join(', ')||'—'));
 for(const [t,l] of [['FRONT',c.front],['BINÔME',c.binome]]){console.log(' '+t);for(const x of l)console.log('   '+x.f.padEnd(14),x.card.padEnd(8),(x.repos?'100% repos ':'')+'| '+(x.pos.join(', ')||'absent')+' | attaque '+x.attaque+' | subit '+x.subit);}}
await br.close();})();
