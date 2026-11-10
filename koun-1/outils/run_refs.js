const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
(async()=>{const br=await chromium.launch();const p=await br.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text())});
const core=fs.readFileSync(S+'/src/core.html','utf8');const bridge=fs.readFileSync(S+'/src/bridge.js','utf8');
await p.setContent(core.replace('</body>','<script>window.__BRIDGE__='+JSON.stringify(bridge)+'</script></body>'));
await p.waitForTimeout(1500);
const J=JSON.parse(fs.readFileSync(S+'/src/J.json','utf8'));
const out=await p.evaluate((J)=>{eval(window.__BRIDGE__.replace(/^\(function\s*\(\)\s*\{/,'window.__compactHolder=function(){').replace(/\}\)\(\);\s*$/,'};'));
 const figs=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));
 // re-implement compact by grabbing bridge compact function
 const src=window.__BRIDGE__;const cstart=src.indexOf('function compact');const cend=src.indexOf('window.addEventListener');
 const compact=eval('('+src.slice(cstart,cend).trim()+')');
 const res=[];for(const r of J.references){document.getElementById('team1').value=r.teams[0];document.getElementById('team2').value=r.teams[1];
  const theme=window.buildThemeFromMothers(...r.mothers);const core=window.MOTEUR_UNIQUE.analyser(theme);
  const c=JSON.parse(JSON.stringify(compact(core,theme,r.mothers)));res.push({id:r.id,c});}
 return {figs,version:window.MOTEUR_UNIQUE.version,res};},J);
console.log('errors',errs.slice(0,10));console.log('figs',out.figs.join(','));console.log('same order as J.figures:',JSON.stringify(out.figs)===JSON.stringify(J.figures),out.version);
fs.writeFileSync(S+'/src/live_refs.json',JSON.stringify(out.res,null,1));
for(const {id,c} of out.res){const r=J.references.find(x=>x.id===id);const snap=r.snapshot;
 const same=JSON.stringify(snap)===JSON.stringify(c);
 const diffs=[];for(const k of Object.keys({...snap,...c}))if(JSON.stringify(snap[k])!==JSON.stringify(c[k]))diffs.push(k);
 const codesOk=r.codes.every((n,i)=>J.figures[n-1]===r.mothers[i]);
 console.log(id,'exp',r.expected,'live',c.decision.verdict,c.decision.statut,c.decision.phase,'| snapEqual',same,diffs.join(','),'| codesOk',codesOk,'| btts',c.labels.btts,'| inc',c.labels.incidents,'| winnerLabel',c.labels.winner);}
await br.close();})();
