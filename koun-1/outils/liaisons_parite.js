// Liaisons par parité (règle du propriétaire) : une liaison vaut la somme des deux niveaux : 2+2 = 2 (saturée), 1+2 = 1 (coupée), 1+1 = 2 (saturée).
// Feu, Air, Eau : maison h ↔ miroir h+8 (haut f ↔ bas f+8, droite f+4 ↔ gauche f+12). Terre : front direct (haut f ↔ droite f+4, bas f+8 ↔ gauche f+12).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const fr = n => (n - 1) % 4;
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }));
// exemple du propriétaire
{ const n = f => K.niveaux(f)[3]; console.log('exemple : Terre M4 neutre (Albus+Albus)', n(A(4, 4)), '+ Terre M8 (Tristitia+Tristitia)', n(A(8, 8)), '→ liaison', K.niveaux(A(A(4, 4), A(8, 8)))[3], '| Puer en base de M4 : Terre', n(A(1, 4)), '+', n(A(8, 8)), '→ liaison', K.niveaux(A(A(1, 4), A(8, 8)))[3]); }
function front(L, z) {
  const T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16], lien = (x, y, l) => K.niveaux(A(rz(x), rz(y)))[l] === 2;
  const H = z + 1, Dr = z + 5, Ba = z + 9, G = z + 13, o = { terre: 0, feu: 0, air: 0, eau: 0, total: 0, terreHaut: 0, terreBas: 0 };
  if (lien(H, Dr, 3)) { o.terre++; o.terreHaut = 1; } if (lien(Ba, G, 3)) { o.terre++; o.terreBas = 1; }
  ['feu', 'air', 'eau'].forEach((k, l) => { if (lien(H, Ba, l)) o[k]++; if (lien(Dr, G, l)) o[k]++; });
  o.miroir = o.feu + o.air + o.eau; o.total = o.miroir + o.terre;
  return o;
}
const P = D.map(d => ({ d, a: front(d.L, fr(d.L.R1.figure)), e: front(d.L, fr(d.L.R7.figure)) }));
const tests = { 'liaisons Terre du front direct (0-2)': o => o.terre, 'liaisons miroir Feu': o => o.feu, 'liaisons miroir Air': o => o.air, 'liaisons miroir Eau': o => o.eau, 'liaisons miroir (Feu+Air+Eau)': o => o.miroir, 'toutes les liaisons (0-8)': o => o.total };
const run = rr => { const out = {}; for (const [k, f] of Object.entries(tests)) { let ok = 0, ko = 0, eg = 0, ne = 0; P.forEach((p, i) => { const s = Math.sign(f(p.a) - f(p.e)); if (!s) { eg++; if (!rr[i]) ne++; } else if (rr[i]) { if (s === rr[i]) ok++; else ko++; } }); out[k] = { ok, ko, eg, ne, z: (ok - ko) / Math.sqrt(ok + ko || 1) }; } return out; };
const sc0 = D.map(d => d.r), obs = run(sc0);
console.log('\n' + D.length, 'matchs, nuls', D.filter(d => d.nul).length);
for (const [k, o] of Object.entries(obs)) console.log('  ', k.padEnd(38), 'le plus lié gagne', String(o.ok).padStart(2), 'perd', String(o.ko).padStart(2), '| égalité', o.eg, 'dont', o.ne, 'nuls (' + Math.round(100 * o.ne / o.eg) + ' %)');
const bz = Math.max(...Object.values(obs).map(o => Math.abs(o.z))); let ge = 0; for (let t = 0; t < 2000; t++) { const z = sc0.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } if (Math.max(...Object.values(run(z)).map(o => Math.abs(o.z))) >= bz) ge++; }
console.log('   meilleur test atteint par hasard dans', (100 * ge / 2000).toFixed(1) + ' % des mélanges');
for (const k of ['terre', 'miroir', 'total']) { const g = {}; P.forEach(p => [[p.a, p.d.sc[0], p.d.sc[1]], [p.e, p.d.sc[1], p.d.sc[0]]].forEach(([o, gm, ge2]) => { const v = o[k]; g[v] = g[v] || [0, 0, 0, 0]; g[v][0]++; if (gm > 0) g[v][1]++; g[v][2] += gm; g[v][3] += ge2; })); console.log('\nbuts selon', k + ' :', Object.keys(g).sort((x, y) => x - y).map(v => v + ' → ' + g[v][1] + '/' + g[v][0] + ' marquent, ' + (g[v][2] / g[v][0]).toFixed(1) + ' pour, ' + (g[v][3] / g[v][0]).toFixed(1) + ' contre').join(' · ')); }
// nul : configurations des deux fronts
console.log('\nnul selon (Terre R1, Terre R7) :'); const t = {}; P.forEach(p => { const k = p.a.terre + '-' + p.e.terre; t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; t[k][1] += p.d.nul; if (p.d.r > 0) t[k][2]++; if (p.d.r < 0) t[k][3]++; }); Object.keys(t).sort().forEach(k => console.log('   R1 ' + k.replace('-', ' / R7 '), ': n', t[k][0], 'nuls', t[k][1], 'R1', t[k][2], 'R7', t[k][3]));
// apport face à la balance actuelle
const tb = p => Math.sign(M.marquage(p.d.L).R1.n - M.marquage(p.d.L).R7.n), lt = p => Math.sign(p.a.terre - p.e.terre);
const c = {}; P.forEach(p => { const x = tb(p), y = lt(p), k = !x && !y ? 'aucun' : !x ? 'liaison Terre seule' : !y ? 'balance seule' : x === y ? 'accord' : 'opposés'; c[k] = c[k] || { juste: 0, faux: 0, nul: 0 }; if (!p.d.r) c[k].nul++; else if (k !== 'aucun') { const v = k === 'liaison Terre seule' || k === 'opposés' ? y : x; if (v === p.d.r) c[k].juste++; else c[k].faux++; } });
console.log('\nbalance actuelle × liaison Terre (pour « opposés », compté selon la liaison) :', JSON.stringify(c));
