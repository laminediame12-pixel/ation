// Analyse complète d'un thème avec le moteur 1.14.1 : maisons, pôles, signaux de toutes les maisons, annulations, verrous.
const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];const M=process.argv.slice(3);
(async()=>{const br=await chromium.launch();const p=await br.newPage();
const core=fs.readFileSync(S+'/src/core.html','utf8'),bridge=fs.readFileSync(S+'/src/bridge.js','utf8');
await p.setContent(core.replace('</body>','<script>window.__BRIDGE__='+JSON.stringify(bridge)+'</script></body>'));await p.waitForTimeout(1000);
const o=await p.evaluate((M)=>{const b=window.__BRIDGE__;const compact=eval('('+b.slice(b.indexOf('function compact'),b.indexOf('window.addEventListener')).trim()+')');
 document.getElementById('team1').value='R1';document.getElementById('team2').value='R7';
 const th=window.buildThemeFromMothers(...M);const core=window.MOTEUR_UNIQUE.analyser(th);const c=compact(core,th,M);
 const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const N=f=>F.indexOf(f)+1;const fig=n=>F[((n-1)%16+16)%16];
 const CARD={1:'Est',5:'Nord',9:'Ouest',13:'Sud',2:'Est',6:'Nord',10:'Ouest',14:'Sud',3:'Est',15:'Nord',11:'Ouest',7:'Sud',4:'Est',16:'Nord',12:'Ouest',8:'Sud'};
 const q={R1:N(th[c.poles.R1]),R7:N(th[c.poles.R7])};
 const role=f=>{const n=N(f),t=[];for(const k of ['R1','R7']){const d=((n-q[k])%16+16)%16;const nm={0:'pôle',8:'miroir',3:'cible',13:'antagoniste',10:'contrôleur',6:'protégé',4:'voisin',12:'voisin'}[d];if(nm)t.push(nm+' '+k);}return t.join(', ');};
 const maisons=c.houses.map(h=>({h:h.house,el:h.elementMaison,b:h.base,bf:h.forceBase,bc:'ABCD'[(N(h.base)-1)%4]+'·'+CARD[N(h.base)],br:role(h.base),r:h.house===16?null:h.result,rf:h.forceResultante,rc:h.house===16?'':'ABCD'[(N(h.result)-1)%4]+'·'+CARD[N(h.result)],rr:h.house===16?'':role(h.result),repos:h.positions.filter(x=>x.reposPropreIci).map(x=>x.figure+' '+(x.forcePct===null?'nc':x.forcePct+'%'))}));
 const sig=[];const porte=(m,k,mi)=>{const P=fig(q[k]),Mi=fig(q[k]+8);return m.base===P||m.result===P||(mi&&(m.base===Mi||m.result===Mi));};
 for(const h of [4,8,12,16,2,6,10,14]){const m=c.houses[h-1];for(const k of ['R1','R7'])if(porte(m,k,true))sig.push('M'+h+' porte '+(m.base===fig(q[k])||m.result===fig(q[k])?'le pôle ':'le miroir de ')+k);}
 for(const h of [15,7]){const m=c.houses[h-1];const tags=[m.base,m.result].map(role).filter(Boolean);if(tags.length)sig.push('M'+h+' : '+m.base+' '+m.forceBase+' % / '+m.result+' '+m.forceResultante+' % ('+tags.join(' ; ')+')');}
 return {th,poles:c.poles,pf:{R1:th[c.poles.R1],R7:th[c.poles.R7]},decision:c.decision,labels:c.labels,maisons,sig,av:c.decision.annulationsEtVerrous,
  m8passage:[4,10].flatMap(h=>{const m=c.houses[h-1];return [m.base===th[8]?'M'+h+' base':null,m.result===th[8]?'M'+h+' résultante':null].filter(Boolean);})};},M);
console.log(JSON.stringify(o,null,1));await br.close();})();
