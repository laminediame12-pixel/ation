// Liaisons des fronts : Feu, Air, Eau relient les miroirs (haut f ↔ bas f+8, droite f+4 ↔ gauche f+12) ; la Terre dévie (haut f → droite f+4, bas f+8 → gauche f+12).
// Une liaison est saturée quand les deux résultantes sont saturées sur ce niveau. Une figure intruse coupe les niveaux où elle diffère de la figure de la maison.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const fr = n => (n - 1) % 4, VIA = [...Array(16)].map((_, i) => i + 1).find(f => nm(f) === 'Via');
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }));
function front(L, z) {
  const T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16], s = (h, l) => K.niveaux(rz(h))[l] === 2;
  const H = z + 1, Dr = z + 5, Ba = z + 9, G = z + 13, o = { lv: [0, 0, 0, 0], tot: 0, axeV: 0, axeH: 0, inverse: 0, coupuresTotales: 0, intacts: 0 };
  for (let l = 0; l < 3; l++) { if (s(H, l) && s(Ba, l)) { o.lv[l]++; o.axeV++; } if (s(Dr, l) && s(G, l)) { o.lv[l]++; o.axeH++; } }
  if (s(H, 3) && s(Dr, 3)) o.lv[3]++; if (s(Ba, 3) && s(G, 3)) o.lv[3]++;
  o.tot = o.lv.reduce((a, c) => a + c);
  [H, Dr, Ba, G].forEach(h => { const r = rz(h); if (r === VIA) o.inverse++; if (nm(r) === 'Populus') o.intacts++; });
  return o;
}
const P = D.map(d => ({ d, a: front(d.L, fr(d.L.R1.figure)), e: front(d.L, fr(d.L.R7.figure)) }));
const tests = { 'liaisons saturées (total)': o => o.tot, 'liaisons Feu': o => o.lv[0], 'liaisons Air': o => o.lv[1], 'liaisons Eau': o => o.lv[2], 'liaisons Terre (déviées)': o => o.lv[3], 'axe vertical (haut↔bas)': o => o.axeV, 'axe horizontal (droite↔gauche)': o => o.axeH, 'maisons coupées sur les 4 niveaux (inverse, Via)': o => o.inverse, 'maisons intactes (Populus)': o => o.intacts };
console.log(D.length, 'matchs, nuls', D.filter(d => d.nul).length, '\n');
for (const [k, f] of Object.entries(tests)) {
  let ok = 0, ko = 0, eg = 0, ne = 0; const g = {};
  P.forEach(p => { const a = f(p.a), e = f(p.e), s = Math.sign(a - e); if (!s) { eg++; ne += p.d.nul; } else if (p.d.r) { if (s === p.d.r) ok++; else ko++; } [[a, p.d.sc[0]], [e, p.d.sc[1]]].forEach(([v, gm]) => { g[v] = g[v] || [0, 0, 0]; g[v][0]++; if (gm > 0) g[v][1]++; g[v][2] += gm; }); });
  console.log(k.padEnd(48), 'le plus lié gagne', String(ok).padStart(2), 'perd', String(ko).padStart(2), '| égalité', eg, 'dont', ne, 'nuls (' + Math.round(100 * ne / eg) + ' %)');
  console.log(''.padEnd(48), 'marquent selon la valeur :', Object.keys(g).sort((x, y) => x - y).map(v => v + ' → ' + g[v][1] + '/' + g[v][0] + ' (' + (g[v][2] / g[v][0]).toFixed(1) + ' buts)').join(' · '));
}
// le nul : les deux fronts également liés ? écart total
console.log('\nécart de liaisons |R1 − R7| et nul :'); const t = {}; P.forEach(p => { const k = Math.abs(p.a.tot - p.e.tot); t[k] = t[k] || [0, 0]; t[k][0]++; t[k][1] += p.d.nul; }); Object.keys(t).forEach(k => console.log('   écart', k, ':', t[k][1], 'nuls sur', t[k][0]));
// hasard : meilleur écart justes−faux parmi les 9 tests, scores mélangés
const sc0=D.map(d=>d.r),best=rr=>Math.max(...Object.values(tests).map(f=>{let ok=0,ko=0;P.forEach((p,i)=>{const s=Math.sign(f(p.a)-f(p.e));if(s&&rr[i]){if(s===rr[i])ok++;else ko++}});return Math.abs(ok-ko)/Math.sqrt(ok+ko||1)}));
const ob=best(sc0);let ge=0;for(let t=0;t<2000;t++){const z=sc0.slice();for(let i=z.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[z[i],z[j]]=[z[j],z[i]]}if(best(z)>=ob)ge++}
console.log('\nmeilleur test atteint par hasard dans',(100*ge/2000).toFixed(1)+' % des mélanges');
// apport face à la balance de la Terre (H-BALANCE-TERRE)
const tb=p=>Math.sign(M.marquage(p.d.L).R1.n-M.marquage(p.d.L).R7.n),ah=p=>Math.sign(p.a.axeH-p.e.axeH);
const c={};P.forEach(p=>{const t=tb(p),h=ah(p),k=!t&&!h?'aucun':!t?'axe H seul':!h?'Terre seule':t===h?'accord':'opposés';c[k]=c[k]||[0,0,0];if(!p.d.r)c[k][2]++;else{const v=k==='axe H seul'?h:t;if(k==='opposés'||k==='aucun'){c[k][0]+=0}else if(v===p.d.r)c[k][0]++;else c[k][1]++}});console.log('balance Terre × axe horizontal :',JSON.stringify(c),'(justes, faux, nuls)');
const PR=require(R+'/validation/predictions-20-25-novembre-v3.json');const o=[];PR.matchs.forEach(x=>{if(tous.has(x.theme.join('-')))return;const L=M.lire(x.theme),Q=M.marquage(L);if(Q.R1.n!==Q.R7.n)return;const a=front(L,fr(L.R1.figure)).axeH,e=front(L,fr(L.R7.figure)).axeH;if(a!==e)o.push(x.match+' '+(a>e?'R1':'R7'))});console.log('à venir, Terre à égalité, axe horizontal désigne :',o.length,o.join(' ; '));
