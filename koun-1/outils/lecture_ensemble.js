// Lecture d'ensemble du duel R1/R7 (principes du propriétaire), testée sur les références et le banc exhaustif.
const {chromium}=require('playwright');const fs=require('fs');const S=process.argv[2];
const REGLE=function(c){ // c = sortie compacte du pont (theme, houses, poles)
 const F=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));const N=f=>F.indexOf(f)+1;const mir=f=>F[(N(f)+7)%16];
 const p={R1:c.theme[c.poles.R1],R7:c.theme[c.poles.R7]};const camp=f=>(N(f)%2)===(N(p.R1)%2)?'R1':'R7';const autre=k=>k==='R1'?'R7':'R1';
 if((N(p.R1)%2)===(N(p.R7)%2))return {v:'N',motif:'MEME_BOUCLE',det:['Pôles dans la même boucle']};
 const pts={R1:0,R7:0},conc={R1:0,R7:0},det=[];
 const porte=(m,k,miroir)=>m.base===p[k]||m.result===p[k]||(miroir&&(m.base===mir(p[k])||m.result===mir(p[k])));
 for(const h of [4,8,12]){const m=c.houses[h-1];for(const k of ['R1','R7'])if(porte(m,k,h===8)){
   if(h===4){pts[autre(k)]++;det.push('M4 affaiblit '+k);}else{pts[k]++;conc[k]=Math.max(conc[k],(m.forceBase||0)+(m.forceResultante||0));det.push('M'+h+' renforce '+k);}}}
 for(const h of [15,7]){const m=c.houses[h-1];const cb=camp(m.base),cr=camp(m.result);
  const tag=f=>['R1','R7'].some(k=>f===p[k]||f===mir(p[k]));
  if((tag(m.base)||tag(m.result))&&cb!==cr&&m.forceBase!==null&&m.forceResultante!==null&&m.forceBase!==m.forceResultante){
   const w=m.forceBase>m.forceResultante?cb:cr;pts[w]++;det.push('M'+h+' : '+w+' domine ('+m.base+' '+m.forceBase+' % / '+m.result+' '+m.forceResultante+' %)');}}
 let tete=pts.R1>pts.R7?'R1':pts.R7>pts.R1?'R7':null,motif='POINTS';
 if(!tete&&pts.R1>0&&conc.R1!==conc.R7){tete=conc.R1>conc.R7?'R1':'R7';motif='CONCORDANCE';}
 const m16=['R1','R7'].filter(k=>c.theme[16]===p[k]||c.theme[16]===mir(p[k]));
 if(m16.length)det.push('M16 porte '+m16.join('+'));
 if(!tete)return {v:det.length?'N':null,motif:det.length?'EQUILIBRE':'AUCUN_SIGNAL',det,pts};
 if(m16.includes(autre(tete))&&!m16.includes(tete))return {v:'N',motif:'SENTENCE_M16_ANNULE',det,pts};
 return {v:tete==='R1'?'1':'2',motif:m16.includes(tete)?motif+'_CONFIRME_M16':motif,det,pts};};
(async()=>{const br=await chromium.launch();const p=await br.newPage();
const core=fs.readFileSync(S+'/src/core.html','utf8'),bridge=fs.readFileSync(S+'/src/bridge.js','utf8');
await p.setContent(core.replace('</body>','<script>window.__BRIDGE__='+JSON.stringify(bridge)+'</script></body>'));await p.waitForTimeout(1000);
const J=JSON.parse(fs.readFileSync(S+'/src/J.json','utf8'));
const out=await p.evaluate(([J,src,FULL])=>{const REGLE=eval('('+src+')');const b=window.__BRIDGE__;const compact=eval('('+b.slice(b.indexOf('function compact'),b.indexOf('window.addEventListener')).trim()+')');
 const run=m=>{const th=window.buildThemeFromMothers(...m);return compact(window.MOTEUR_UNIQUE.analyser(th),th,m);};
 const refs=J.references.map(r=>{const c=run(r.mothers);return {id:r.id,exp:r.expected,actuel:c.decision.verdict,...REGLE(c)};});
 let bench=null;if(FULL){bench={verdicts:{},motifs:{},changes:0};const figs=Array.from({length:16},(_,i)=>window.figureReposMaison(i+1));
  for(let a=0;a<16;a++)for(let x=0;x<16;x++)for(let y=0;y<16;y++)for(let z=0;z<16;z++){const c=run([figs[a],figs[x],figs[y],figs[z]]);const r=REGLE(c);const v=String(r.v);
   bench.verdicts[v]=(bench.verdicts[v]||0)+1;bench.motifs[r.motif]=(bench.motifs[r.motif]||0)+1;if(v!==String(c.decision.verdict))bench.changes++;}}
 return {refs,bench};},[J,REGLE.toString(),process.argv[3]==='full']);
let ok=0;for(const r of out.refs){if(r.v===r.exp)ok++;console.log(r.id.padEnd(21),'att',r.exp,'| nouvelle lecture',String(r.v).padEnd(4),r.v===r.exp?'✅':'❌','| moteur actuel',r.actuel,'|',r.motif,'|',r.det.join(' ; '));}
console.log('Références :',ok+'/11');if(out.bench)console.log('Banc exhaustif :',JSON.stringify(out.bench));await br.close();})();
