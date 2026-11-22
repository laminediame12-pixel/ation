// Résultantes mobiles (2 niveaux saturés dont la Terre) dans le front de la figure de chaque pôle, et classes voisines.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const classe = f => { const n = K.niveaux(f), s = n.filter(v => v === 2).length; return s === 0 ? 'tout ouverte' : s === 4 ? 'toute fermée' : s === 1 ? 'fermante' : s === 3 ? 'ouvrante' : n[3] === 2 ? 'mobile' : 'fixe'; };
const fr = n => (n - 1) % 4;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme; return { ...d, L, b: h => T.bases[h], rz: h => h < 16 ? T.resultantes[h] : T.bases[16], r: Math.sign(d.sc[0] - d.sc[1]), nul: d.sc[0] === d.sc[1] ? 1 : 0 }; });
const maisons = c => [0, 1, 2, 3].map(i => fr(c.figure) + 1 + 4 * i);
const M_ = {
  'résultantes mobiles': (d, c) => maisons(c).filter(h => classe(d.rz(h)) === 'mobile').length,
  'rendues mobiles par la maison (base non mobile)': (d, c) => maisons(c).filter(h => classe(d.rz(h)) === 'mobile' && classe(d.b(h)) !== 'mobile').length,
  'bases mobiles': (d, c) => maisons(c).filter(h => classe(d.b(h)) === 'mobile').length,
  'résultantes fixes': (d, c) => maisons(c).filter(h => classe(d.rz(h)) === 'fixe').length,
  'résultantes fermantes': (d, c) => maisons(c).filter(h => classe(d.rz(h)) === 'fermante').length,
  'résultantes ouvrantes': (d, c) => maisons(c).filter(h => classe(d.rz(h)) === 'ouvrante').length,
  'résultantes Populus (toute fermée)': (d, c) => maisons(c).filter(h => classe(d.rz(h)) === 'toute fermée').length,
  'résultantes Via (tout ouverte)': (d, c) => maisons(c).filter(h => classe(d.rz(h)) === 'tout ouverte').length,
  'mobiles + Populus (Terre saturée, au moins 2 niveaux)': (d, c) => maisons(c).filter(h => ['mobile', 'toute fermée'].includes(classe(d.rz(h)))).length,
};
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls\n');
const sig = {};
for (const [k, f] of Object.entries(M_)) {
  const s = D.map(d => Math.sign(f(d, d.L.R1) - f(d, d.L.R7))); sig[k] = s;
  let ok = 0, ko = 0, eg = 0, ne = 0; D.forEach((d, i) => { if (!s[i]) { eg++; ne += d.nul; } else if (d.r) { if (s[i] === d.r) ok++; else ko++; } });
  const g = {}; D.forEach(d => [[d.L.R1, d.sc[0], d.sc[1]], [d.L.R7, d.sc[1], d.sc[0]]].forEach(([c, gm, ge]) => { const v = f(d, c); g[v] = g[v] || [0, 0, 0, 0]; g[v][0]++; if (gm > 0) g[v][1]++; g[v][2] += gm; g[v][3] += ge; }));
  console.log(('le plus de ' + k).padEnd(62), 'gagne', String(ok).padStart(2), 'perd', String(ko).padStart(2), '| égalité', eg, 'dont', ne, 'nuls');
  console.log(''.padEnd(62), Object.keys(g).sort().map(v => v + ' → ' + g[v][1] + '/' + g[v][0] + ' marquent (' + (g[v][2] / g[v][0]).toFixed(1) + ' pour, ' + (g[v][3] / g[v][0]).toFixed(1) + ' contre)').join(' · '));
}
const rr = D.map(d => d.r), z = (s, q) => { let a = 0, b = 0; s.forEach((v, i) => { if (v && q[i]) { if (v === q[i]) a++; else b++; } }); return (a - b) / Math.sqrt(a + b || 1); };
const ob = Math.max(...Object.values(sig).map(s => Math.abs(z(s, rr)))); let ge = 0;
for (let t = 0; t < 3000; t++) { const q = rr.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (Math.max(...Object.values(sig).map(s => Math.abs(z(s, q)))) >= ob) ge++; }
console.log('\nmeilleur des', Object.keys(M_).length, 'tests atteint par hasard dans', (100 * ge / 3000).toFixed(1) + ' % des mélanges');
// face au verdict actuel (nœuds diagonaux, Terre)
const vd = D.map(d => Math.sign(M.diagonales(d.L).ecart)), mob = sig['résultantes mobiles'];
const c = {}; D.forEach((d, i) => { const a = vd[i], m = mob[i], k = !a && !m ? 'aucun' : !a ? 'mobiles seules' : !m ? 'diagonales seules' : a === m ? 'accord' : 'opposés'; c[k] = c[k] || { juste: 0, faux: 0, nul: 0 }; if (!d.r) c[k].nul++; else if (k !== 'aucun') { const v = k === 'mobiles seules' || k === 'opposés' ? m : a; if (v === d.r) c[k].juste++; else c[k].faux++; } });
console.log('verdict (nœuds diagonaux) × résultantes mobiles du front (« opposés » compté selon les mobiles) :', JSON.stringify(c));
// quelles maisons portent les mobiles gagnantes ? par rang du front
const rk = {}; D.forEach(d => [[d.L.R1, d.sc[0] > d.sc[1]], [d.L.R7, d.sc[1] > d.sc[0]]].forEach(([cc, w]) => maisons(cc).forEach((h, i) => { if (classe(d.rz(h)) !== 'mobile') return; const k = ['rang 1 (f)', 'rang 2 (f+4)', 'rang 3 (f+8)', 'rang 4 (f+12)'][i]; rk[k] = rk[k] || [0, 0]; rk[k][0]++; if (w) rk[k][1]++; })));
console.log('résultante mobile selon le rang de la maison dans le front : victoires du pôle', Object.keys(rk).sort().map(k => k + ' ' + rk[k][1] + '/' + rk[k][0]).join(' · '));
const qf = {}; D.forEach(d => [[d.L.R1, d.sc[0] > d.sc[1]], [d.L.R7, d.sc[1] > d.sc[0]]].forEach(([cc, w]) => maisons(cc).forEach(h => { const x = d.rz(h); if (classe(x) !== 'mobile') return; const k = nm(x); qf[k] = qf[k] || [0, 0]; qf[k][0]++; if (w) qf[k][1]++; })));
console.log('quelle figure mobile :', Object.keys(qf).map(k => k + ' ' + qf[k][1] + '/' + qf[k][0]).join(' · '));
