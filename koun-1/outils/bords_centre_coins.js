// Grille 4 × 4 : bords (2,3,5,8,9,12,14,15), centre (6,7,10,11), coins (1,4,13,16).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const BO = [2, 3, 8, 12, 15, 14, 9, 5], CE = [6, 7, 11, 10], CO = [1, 13, 16, 4], S = (b, hs) => hs.map(h => b[h]).reduce(A);
// ── 1. identités exactes : chaque somme égale à une maison ou à une somme de 2 ou 3 maisons ?
const ech = []; for (let k = 0; k < 400; k++) ech.push(K.construire([1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 16))).bases);
const combos = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length <= 3) combos.push(hs); }
for (const [lab, g] of [['bords', BO], ['centre', CE], ['coins', CO]]) { const eq = combos.filter(hs => ech.every(b => S(b, hs) === S(b, g))).map(hs => 'M' + hs.join('+M')); console.log('somme des ' + lab.padEnd(7) + '= ' + (eq.slice(0, 6).join(' = ') || '(pas de forme courte)')); }
console.log('somme de tout le thème = M16 ; donc bords + centre + coins = M16, et bords = M16 + centre + coins');
// ── 2. fréquences sur 65 536 thèmes
const c = {}, add = k => c[k] = (c[k] || 0) + 1;
for (let x = 0; x < 65536; x++) { const b = K.construire([1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)]).bases, Bo = S(b, BO), Ce = S(b, CE), Co = S(b, CO);
  if (Bo === Ce) add('bords = centre'); if (Bo === Co) add('bords = coins'); if (Ce === Co) add('centre = coins'); if (Bo === 16) add('bords = Populus'); if (Ce === 16) add('centre = Populus'); if (Co === 16) add('coins = Populus'); if (Bo === Ce && Ce === Co) add('les trois égales'); }
console.log('\nsur 65 536 thèmes :', Object.entries(c).map(([k, v]) => k + ' ' + v).join(' · '));
// ── 3. corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme; return { ...d, L, b: T.bases, r: [null, ...[...Array(16)].map((_, i) => i < 15 ? T.resultantes[i + 1] : T.bases[16])], nul: d.sc[0] === d.sc[1] ? 1 : 0, s: Math.sign(d.sc[0] - d.sc[1]) }; });
const fr = n => (n - 1) % 4, imp = f => K.niveaux(f).filter(v => v === 1).length;
const lect = {};
for (const [src, sn] of [['b', 'base'], ['r', 'résultante']]) for (const [lab, g] of [['bords', BO], ['centre', CE], ['coins', CO]]) {
  lect[lab + ' (' + sn + ') : niveaux impairs'] = d => imp(S(d[src], g));
  lect[lab + ' (' + sn + ') : Terre'] = d => K.niveaux(S(d[src], g))[3] === 2 ? 'saturée' : 'ouverte';
  lect[lab + ' (' + sn + ') : front de la somme = front de'] = d => { const f = fr(S(d[src], g)), a = f === fr(d.L.R1.figure), e = f === fr(d.L.R7.figure); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; };
}
// où sont les pôles : maison du pôle dans les bords, le centre ou les coins
const zone = h => BO.includes(h) ? 'bord' : CE.includes(h) ? 'centre' : 'coin';
lect['maisons des pôles (R1 / R7)'] = d => zone(d.L.R1.maison) + ' / ' + zone(d.L.R7.maison);
// Terre saturée des résultantes par zone dans le front de chaque pôle
const rows = [];
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
for (const [lab, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.s > 0) t[k][2]++; if (d.s < 0) t[k][3]++; }); Object.keys(t).forEach(k => rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), t: t[k] })); if (/front|pôles/.test(lab)) console.log('  ' + lab.padEnd(48), Object.keys(t).sort().map(k => k + ' : nuls ' + t[k][1] + '/' + t[k][0] + ', R1 ' + t[k][2] + ', R7 ' + t[k][3]).join(' · ')); }
const y = D.map(d => d.nul), p0 = y.reduce((a, b) => a + b) / D.length, rr = D.map(d => d.s), ok = r => r.t[0] >= 6 && r.t[0] <= D.length - 6;
const zN = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.t[0] * p0) / Math.sqrt(r.t[0] * p0 * (1 - p0)); };
const zV = (r, q) => { let a = 0, b = 0; r.x.forEach((v, i) => { if (v && q[i] > 0) a++; if (v && q[i] < 0) b++; }); return (a + b) ? Math.abs(a - b) / Math.sqrt(a + b) : 0; };
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
const R0 = rows.filter(ok), bN = Math.max(...R0.map(r => zN(r, y))), bV = Math.max(...R0.map(r => zV(r, rr))); let gN = 0, gV = 0;
for (let t = 0; t < 2000; t++) { if (Math.max(...R0.map(r => zN(r, mel(y)))) >= bN) gN++; if (Math.max(...R0.map(r => zV(r, mel(rr)))) >= bV) gV++; }
const tn = R0.slice().sort((a, b) => zN(b, y) - zN(a, y))[0], tv = R0.slice().sort((a, b) => zV(b, rr) - zV(a, rr))[0];
console.log('\n' + R0.length + ' cases ; meilleure pour le NUL :', tn.lab, '=', tn.k, '(' + tn.t[1] + ' nuls sur ' + tn.t[0] + ') — atteinte par hasard dans', (100 * gN / 2000).toFixed(1) + ' %');
console.log('meilleure pour le VAINQUEUR :', tv.lab, '=', tv.k, '(R1 ' + tv.t[2] + ', R7 ' + tv.t[3] + ') — atteinte par hasard dans', (100 * gV / 2000).toFixed(1) + ' %');
