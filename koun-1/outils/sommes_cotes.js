// Sommes des deux côtés : côté M1 (1,2,3,4,9,10,13,15) et côté M7 (5,6,7,8,11,12,14,16).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const C1 = [1, 2, 3, 4, 9, 10, 13, 15], C7 = [5, 6, 7, 8, 11, 12, 14, 16], S = (b, hs) => hs.map(h => b[h]).reduce(A);
const ech = []; for (let k = 0; k < 400; k++) ech.push(K.construire([1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 16))).bases);
const combos = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length <= 3) combos.push(hs); }
for (const [lab, g] of [['côté M1', C1], ['côté M7', C7]]) { const eq = combos.filter(hs => ech.every(b => S(b, hs) === S(b, g))).map(hs => 'M' + hs.join('+M')); console.log('somme ' + lab + ' = ' + (eq.slice(0, 8).join(' = ') || '(pas de forme courte)')); }
const c = {}, add = k => c[k] = (c[k] || 0) + 1, vals = { c1: new Set(), c7: new Set() };
for (let x = 0; x < 65536; x++) { const b = K.construire([1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)]).bases, a = S(b, C1), e = S(b, C7); vals.c1.add(a); vals.c7.add(e);
  if (a === e) add('côté M1 = côté M7'); if (A(a, e) === b[16]) add('côté M1 + côté M7 = M16'); if (a === 16) add('côté M1 = Populus'); if (e === 16) add('côté M7 = Populus'); if (a === b[1]) add('côté M1 = M1'); if (e === b[7]) add('côté M7 = M7'); }
console.log('valeurs prises : côté M1', vals.c1.size, ', côté M7', vals.c7.size); console.log('sur 65 536 thèmes :', Object.entries(c).map(([k, v]) => k + ' ' + v).join(' · '));
// corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const fr = n => (n - 1) % 4, imp = f => K.niveaux(f).filter(v => v === 1).length, sat = f => 4 - imp(f);
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, b: L.theme.bases, nul: d.sc[0] === d.sc[1] ? 1 : 0, s: Math.sign(d.sc[0] - d.sc[1]) }; });
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
const lect = {
  'côté M1 = côté M7 (sommes égales)': d => S(d.b, C1) === S(d.b, C7) ? 'oui' : 'non',
  'niveaux saturés : côté M1 − côté M7': d => { const v = sat(S(d.b, C1)) - sat(S(d.b, C7)); return v > 0 ? 'côté M1 plus saturé' : v < 0 ? 'côté M7 plus saturé' : 'égal'; },
  'Terre : côté M1 / côté M7': d => (K.niveaux(S(d.b, C1))[3] === 2 ? 'sat' : 'ouv') + ' / ' + (K.niveaux(S(d.b, C7))[3] === 2 ? 'sat' : 'ouv'),
  'côté M1 : figure présente en base de son côté ?': d => { const f = S(d.b, C1); return C1.some(h => d.b[h] === f) ? (C7.some(h => d.b[h] === f) ? 'des deux côtés' : 'de son côté') : (C7.some(h => d.b[h] === f) ? 'de l\'autre côté' : 'absente'); },
  'côté M7 : figure présente en base de son côté ?': d => { const f = S(d.b, C7); return C7.some(h => d.b[h] === f) ? (C1.some(h => d.b[h] === f) ? 'des deux côtés' : 'de son côté') : (C1.some(h => d.b[h] === f) ? 'de l\'autre côté' : 'absente'); },
  'front de la somme côté M1 = front de R1 ; côté M7 = front de R7': d => (fr(S(d.b, C1)) === fr(d.L.R1.figure) ? 'M1→R1 oui' : 'M1→R1 non') + ' · ' + (fr(S(d.b, C7)) === fr(d.L.R7.figure) ? 'M7→R7 oui' : 'M7→R7 non'),
};
const rows = [];
for (const [lab, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.s > 0) t[k][2]++; if (d.s < 0) t[k][3]++; t[k][4] += d.sc[0]; t[k][5] += d.sc[1]; }); Object.keys(t).forEach(k => rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), t: t[k] })); console.log('  ' + lab); Object.keys(t).sort().forEach(k => console.log('      ', k.padEnd(24), 'n', String(t[k][0]).padStart(2), '| nuls', t[k][1], '| R1', t[k][2], 'R7', t[k][3], '| buts R1', (t[k][4] / t[k][0]).toFixed(1), 'R7', (t[k][5] / t[k][0]).toFixed(1))); }
const y = D.map(d => d.nul), p0 = y.reduce((a, b) => a + b) / D.length, rr = D.map(d => d.s), ok = r => r.t[0] >= 6 && r.t[0] <= D.length - 6;
const zN = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.t[0] * p0) / Math.sqrt(r.t[0] * p0 * (1 - p0)); };
const zV = (r, q) => { let a = 0, b = 0; r.x.forEach((v, i) => { if (v && q[i] > 0) a++; if (v && q[i] < 0) b++; }); return (a + b) ? Math.abs(a - b) / Math.sqrt(a + b) : 0; };
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
const R0 = rows.filter(ok), bN = Math.max(...R0.map(r => zN(r, y))), bV = Math.max(...R0.map(r => zV(r, rr))); let gN = 0, gV = 0;
for (let t = 0; t < 2000; t++) { if (Math.max(...R0.map(r => zN(r, mel(y)))) >= bN) gN++; if (Math.max(...R0.map(r => zV(r, mel(rr)))) >= bV) gV++; }
const tn = R0.slice().sort((a, b) => zN(b, y) - zN(a, y))[0], tv = R0.slice().sort((a, b) => zV(b, rr) - zV(a, rr))[0];
console.log('\n' + R0.length + ' cases ; NUL : meilleure', tn.lab, '=', tn.k, '(' + tn.t[1] + ' sur ' + tn.t[0] + ') — hasard', (100 * gN / 2000).toFixed(1) + ' % ; VAINQUEUR : meilleure', tv.lab, '=', tv.k, '(R1 ' + tv.t[2] + ', R7 ' + tv.t[3] + ') — hasard', (100 * gV / 2000).toFixed(1) + ' %');
