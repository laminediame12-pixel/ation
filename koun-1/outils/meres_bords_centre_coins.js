// Grille des points des 4 mères (ligne = mère, colonne = Feu, Air, Eau, Terre) découpée comme la grille des maisons : coins, centre, bords.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const parNiv = v => [...Array(16)].map((_, i) => i + 1).find(f => K.niveaux(f).join() === v.join());
const S = (b, hs) => hs.map(h => b[h]).reduce(A);
function groupes(m) { const p = m.map(K.niveaux); // p[mère][niveau], 1 = impair, 2 = pair
  const coins = parNiv([p[0][0], p[0][3], p[3][0], p[3][3]]), centre = parNiv([p[1][1], p[1][2], p[2][1], p[2][2]]);
  const bordsH = parNiv([p[0][1], p[0][2], p[3][1], p[3][2]]), bordsV = parNiv([p[1][0], p[2][0], p[1][3], p[2][3]]); // bords haut/bas (Air, Eau de M1 et M4) et gauche/droite (Feu, Terre de M2 et M3)
  const impairs = pts => pts.filter(v => v === 1).length;
  return { coins, centre, bordsH, bordsV, iCoins: impairs([p[0][0], p[0][3], p[3][0], p[3][3]]), iCentre: impairs([p[1][1], p[1][2], p[2][1], p[2][2]]), iBords: impairs([p[0][1], p[0][2], p[3][1], p[3][2], p[1][0], p[2][0], p[1][3], p[2][3]]) };
}
// ── 1. structure : liens avec les groupes de la grille des maisons
const BO = [2, 3, 8, 12, 15, 14, 9, 5], CE = [6, 7, 11, 10], CO = [1, 13, 16, 4];
const c = {}, add = k => c[k] = (c[k] || 0) + 1;
for (let x = 0; x < 65536; x++) { const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], b = K.construire(m).bases, g = groupes(m);
  if (g.coins === S(b, CO)) add('coins des mères = coins des maisons'); if (g.centre === S(b, CE)) add('centre des mères = centre des maisons'); if (A(g.bordsH, g.bordsV) === S(b, BO)) add('bords des mères = bords des maisons');
  if (A(A(g.coins, g.centre), A(g.bordsH, g.bordsV)) === S(b, [1, 2, 3, 4])) add('les 4 figures des mères additionnées = M1+M2+M3+M4 (= M13)');
  for (let h = 1; h <= 16; h++) { if (g.coins === b[h]) add('coins des mères = M' + h); if (g.centre === b[h]) add('centre des mères = M' + h); } }
console.log('liens sur 65 536 thèmes (au hasard : 4 096) :'); Object.entries(c).filter(([k, v]) => v > 6000 || v < 2500).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('   ', k.padEnd(56), v));
console.log('   (les autres liens tombent au hasard, environ 4 096)');
// ── 2. corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, b: L.theme.bases, g: groupes(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0, s: Math.sign(d.sc[0] - d.sc[1]) }; });
const fr = n => (n - 1) % 4, imp = f => K.niveaux(f).filter(v => v === 1).length;
const lect = {
  'points impairs aux coins des mères (0-4)': d => d.g.iCoins, 'points impairs au centre des mères (0-4)': d => d.g.iCentre, 'points impairs aux bords des mères (0-8)': d => d.g.iBords,
  'coins des mères = coins des maisons': d => d.g.coins === S(d.b, CO) ? 'oui' : 'non', 'centre des mères = centre des maisons': d => d.g.centre === S(d.b, CE) ? 'oui' : 'non',
  'coins (mères) : front de la figure = front de': d => { const f = fr(d.g.coins), a = f === fr(d.L.R1.figure), e = f === fr(d.L.R7.figure); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; },
  'centre (mères) : front de la figure = front de': d => { const f = fr(d.g.centre), a = f === fr(d.L.R1.figure), e = f === fr(d.L.R7.figure); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; },
  'centre des mères = Populus ou Via (tout pair / tout impair)': d => nm(d.g.centre) === 'Populus' ? 'Populus' : nm(d.g.centre) === 'Via' ? 'Via' : 'autre',
  'coins des mères : Terre': d => K.niveaux(d.g.coins)[3] === 2 ? 'saturée' : 'ouverte', 'centre des mères : Terre': d => K.niveaux(d.g.centre)[3] === 2 ? 'saturée' : 'ouverte',
  'centre impair et coins pairs, ou l\'inverse (parité croisée)': d => (d.g.iCentre % 2) !== (d.g.iCoins % 2) ? 'croisée' : 'même parité',
};
const rows = [];
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
for (const [lab, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.s > 0) t[k][2]++; if (d.s < 0) t[k][3]++; }); Object.keys(t).forEach(k => rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), t: t[k] })); console.log('  ' + lab.padEnd(60), Object.keys(t).sort().map(k => k + ' : nuls ' + t[k][1] + '/' + t[k][0] + ' R1 ' + t[k][2] + ' R7 ' + t[k][3]).join(' · ')); }
const y = D.map(d => d.nul), p0 = y.reduce((a, b) => a + b) / D.length, rr = D.map(d => d.s), ok = r => r.t[0] >= 6 && r.t[0] <= D.length - 6;
const zN = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.t[0] * p0) / Math.sqrt(r.t[0] * p0 * (1 - p0)); };
const zV = (r, q) => { let a = 0, b = 0; r.x.forEach((v, i) => { if (v && q[i] > 0) a++; if (v && q[i] < 0) b++; }); return (a + b) ? Math.abs(a - b) / Math.sqrt(a + b) : 0; };
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
const R0 = rows.filter(ok), bN = Math.max(...R0.map(r => zN(r, y))), bV = Math.max(...R0.map(r => zV(r, rr))); let gN = 0, gV = 0;
for (let t = 0; t < 2000; t++) { if (Math.max(...R0.map(r => zN(r, mel(y)))) >= bN) gN++; if (Math.max(...R0.map(r => zV(r, mel(rr)))) >= bV) gV++; }
const tn = R0.slice().sort((a, b) => zN(b, y) - zN(a, y))[0], tv = R0.slice().sort((a, b) => zV(b, rr) - zV(a, rr))[0];
console.log('\n' + R0.length + ' cases ; NUL : meilleure', tn.lab, '=', tn.k, '(' + tn.t[1] + ' sur ' + tn.t[0] + ') — hasard', (100 * gN / 2000).toFixed(1) + ' % ; VAINQUEUR : meilleure', tv.lab, '=', tv.k, '(R1 ' + tv.t[2] + ', R7 ' + tv.t[3] + ') — hasard', (100 * gV / 2000).toFixed(1) + ' %');
