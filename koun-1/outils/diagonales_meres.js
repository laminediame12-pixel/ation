// Diagonales des points des 4 mères (grille mère × niveau) comparées aux diagonales de maisons 1-6-11-16 et 4-7-10-13.
// D1 = Feu M1, Air M2, Eau M3, Terre M4 (diagonale Feu-Air-Eau-Terre) ; D2 = la même lue à l'envers (Terre M4, Eau M3, Air M2, Feu M1 dans les niveaux Feu…Terre) ;
// D3 = Terre M1, Eau M2, Air M3, Feu M4 (diagonale Terre-Eau-Air-Feu) ; D4 = la même à l'envers (Feu M4, Air M3, Eau M2, Terre M1).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const parNiv = v => [...Array(16)].map((_, i) => i + 1).find(f => K.niveaux(f).join() === v.join());
function diags(m) { const p = m.map(K.niveaux); return { D1: parNiv([p[0][0], p[1][1], p[2][2], p[3][3]]), D2: parNiv([p[3][3], p[2][2], p[1][1], p[0][0]]), D3: parNiv([p[0][3], p[1][2], p[2][1], p[3][0]]), D4: parNiv([p[3][0], p[2][1], p[1][2], p[0][3]]) }; }
const DP = [1, 6, 11, 16], DA = [4, 7, 10, 13], NOMS = ['D1', 'D2', 'D3', 'D4'];
// ── 1. structure sur les 65 536 thèmes
const eg = {}, add = k => eg[k] = (eg[k] || 0) + 1;
for (let x = 0; x < 65536; x++) {
  const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], T = K.construire(m), b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16], d = diags(m);
  const cand = { 'somme bases 1-6-11-16': DP.map(h => b[h]).reduce(A), 'somme bases 4-7-10-13': DA.map(h => b[h]).reduce(A), 'somme résultantes 1-6-11-16': DP.map(rz).reduce(A), 'somme résultantes 4-7-10-13': DA.map(rz).reduce(A), 'M16': b[16], 'M15': b[15], 'M13': b[13], 'M1': b[1] };
  NOMS.forEach(n => { Object.entries(cand).forEach(([k, v]) => { if (d[n] === v) add(n + ' = ' + k); }); for (let h = 1; h <= 16; h++) if (d[n] === b[h]) add(n + ' présente en base M' + h); });
  if (A(d.D1, d.D3) === A(DP.map(h => b[h]).reduce(A), DA.map(h => b[h]).reduce(A))) add('D1+D3 = somme des 8 bases diagonales');
  if (A(d.D1, d.D2) === A(d.D3, d.D4)) add('D1+D2 = D3+D4');
}
console.log('relations sur 65 536 thèmes (une relation au hasard tombe dans environ 4 096 thèmes) :');
Object.entries(eg).filter(([k, v]) => v >= 8192 || v === 65536 || v < 2000).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('   ', k.padEnd(42), v));
// liens exacts : chaque niveau de D est un niveau d'une maison diagonale ?
{ const T = K.construire([5, 9, 2, 14]), b = T.bases; console.log('\nrappel : le niveau Feu de M5 (première fille) = Feu de M1 ; la diagonale des mères est aussi celle des filles (transposition) : D1 lue dans les filles =', nm(parNiv([K.niveaux(b[5])[0], K.niveaux(b[6])[1], K.niveaux(b[7])[2], K.niveaux(b[8])[3]])), 'contre D1 =', nm(diags([5, 9, 2, 14]).D1)); }
// ── 2. corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16]; return { ...d, L, b, rz, g: diags(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const fr = n => (n - 1) % 4, tS = f => K.niveaux(f)[3] === 2 ? 1 : 0, nodd = f => K.niveaux(f).filter(v => v === 1).length;
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
const lect = {};
NOMS.forEach(n => {
  lect[n + ' : figure'] = d => nm(d.g[n]);
  lect[n + ' : niveaux impairs'] = d => nodd(d.g[n]);
  lect[n + ' : Terre'] = d => tS(d.g[n]) ? 'saturée' : 'ouverte';
  lect[n + ' : front (A-D)'] = d => 'ABCD'[fr(d.g[n])];
  lect[n + ' : front d\'un pôle'] = d => { const a = fr(d.g[n]) === fr(d.L.R1.figure), e = fr(d.g[n]) === fr(d.L.R7.figure); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; };
  lect[n + ' : présente en base dans un front de pôle'] = d => { const inF = (c) => [0, 1, 2, 3].some(i => d.b[fr(c.figure) + 1 + 4 * i] === d.g[n]); const a = inF(d.L.R1), e = inF(d.L.R7); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; };
});
lect['D1 = D3'] = d => d.g.D1 === d.g.D3 ? 'oui' : 'non';
lect['D1 + D3 (figure)'] = d => nm(A(d.g.D1, d.g.D3));
lect['Terre D1 et D3'] = d => tS(d.g.D1) + '-' + tS(d.g.D3);
lect['D1 face à la diagonale de maisons 1-6-11-16 (somme des bases)'] = d => { const s = DP.map(h => d.b[h]).reduce(A); return d.g.D1 === s ? 'égales' : fr(d.g.D1) === fr(s) ? 'même front' : 'autre'; };
lect['D3 face à la diagonale de maisons 4-7-10-13 (somme des bases)'] = d => { const s = DA.map(h => d.b[h]).reduce(A); return d.g.D3 === s ? 'égales' : fr(d.g.D3) === fr(s) ? 'même front' : 'autre'; };
const rows = [];
for (const [lab, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.r > 0) t[k][2]++; if (d.r < 0) t[k][3]++; t[k][4] += d.sc[0] + d.sc[1]; }); Object.keys(t).forEach(k => rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), t: t[k] })); }
const y = D.map(d => d.nul), NN = y.reduce((a, b) => a + b), p0 = NN / D.length, rr = D.map(d => d.r);
const zN = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); const n = r.t[0]; return (k - n * p0) / Math.sqrt(n * p0 * (1 - p0)); };
const zV = (r, q) => { let a = 0, b = 0; r.x.forEach((v, i) => { if (v && q[i] > 0) a++; if (v && q[i] < 0) b++; }); return (a + b) ? Math.abs(a - b) / Math.sqrt(a + b) : 0; };
const ok = r => r.t[0] >= 6 && r.t[0] <= D.length - 6;
const melange = a => { const z = a.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } return z; };
const bN = Math.max(...rows.filter(ok).map(r => zN(r, y))), bV = Math.max(...rows.filter(ok).map(r => zV(r, rr))); let gN = 0, gV = 0;
for (let t = 0; t < 2000; t++) { const z = melange(y), q = melange(rr); if (Math.max(...rows.filter(ok).map(r => zN(r, z))) >= bN) gN++; if (Math.max(...rows.filter(ok).map(r => zV(r, q))) >= bV) gV++; }
console.log(rows.length, 'cases testées (au moins 6 matchs)');
console.log('\nles cases les plus liées au NUL (meilleure atteinte par hasard dans ' + (100 * gN / 2000).toFixed(1) + ' % des mélanges) :');
rows.filter(ok).sort((a, b) => zN(b, y) - zN(a, y)).slice(0, 8).forEach(r => console.log('    ', (r.lab + ' = ' + r.k).padEnd(70), r.t[1] + ' nuls sur ' + r.t[0], '| R1', r.t[2], 'R7', r.t[3]));
console.log('\nles cases qui penchent le plus vers un VAINQUEUR (meilleure atteinte par hasard dans ' + (100 * gV / 2000).toFixed(1) + ' % des mélanges) :');
rows.filter(ok).sort((a, b) => zV(b, rr) - zV(a, rr)).slice(0, 8).forEach(r => console.log('    ', (r.lab + ' = ' + r.k).padEnd(70), 'R1', r.t[2], 'R7', r.t[3], '| nuls', r.t[1], 'sur', r.t[0]));
