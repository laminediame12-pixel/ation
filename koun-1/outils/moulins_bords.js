// Les deux « moulins » des bords : {3,5,14,12} et {2,9,15,8}.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const G1 = [3, 5, 14, 12], G2 = [2, 9, 15, 8], CE = [6, 7, 10, 11], CO = [1, 4, 13, 16], S = (b, hs) => hs.map(h => b[h]).reduce(A);
const ech = []; for (let k = 0; k < 400; k++) ech.push(K.construire([1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 16))).bases);
const combos = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length <= 3) combos.push(hs); }
for (const [lab, g] of [['3-5-14-12', G1], ['2-9-15-8', G2]]) { const eq = combos.filter(hs => ech.every(b => S(b, hs) === S(b, g))).map(hs => 'M' + hs.join('+M')); console.log('somme ' + lab.padEnd(10) + '= ' + (eq.slice(0, 8).join(' = ') || '(pas de forme courte)')); }
// constantes : la somme vaut-elle toujours la même figure, ou un lien fixe avec centre / coins / M16 ?
const c = {}, add = k => c[k] = (c[k] || 0) + 1;
for (let x = 0; x < 65536; x++) { const b = K.construire([1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)]).bases, a = S(b, G1), e = S(b, G2);
  if (a === e) add('3-5-14-12 = 2-9-15-8'); if (A(a, e) === S(b, CE)) add('somme des deux = centre'); if (A(a, e) === S(b, CO)) add('somme des deux = coins'); if (A(a, e) === A(b[16], A(S(b, CE), S(b, CO)))) add('somme des deux = M16 + centre + coins (bords)');
  if (a === 16) add('3-5-14-12 = Populus'); if (e === 16) add('2-9-15-8 = Populus'); if (a === S(b, CE)) add('3-5-14-12 = centre'); if (e === S(b, CE)) add('2-9-15-8 = centre'); if (a === S(b, CO)) add('3-5-14-12 = coins'); if (e === S(b, CO)) add('2-9-15-8 = coins'); }
console.log('\nsur 65 536 thèmes (au hasard : 4 096) :'); Object.entries(c).sort((x, y) => y[1] - x[1]).forEach(([k, v]) => console.log('   ', k.padEnd(48), v));
// corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, b: L.theme.bases, nul: d.sc[0] === d.sc[1] ? 1 : 0, s: Math.sign(d.sc[0] - d.sc[1]) }; });
const fr = n => (n - 1) % 4, imp = f => K.niveaux(f).filter(v => v === 1).length;
const lect = {}; for (const [lab, g] of [['3-5-14-12', G1], ['2-9-15-8', G2]]) { lect[lab + ' : figure'] = d => nm(S(d.b, g)); lect[lab + ' : niveaux impairs'] = d => imp(S(d.b, g)); lect[lab + ' : Terre'] = d => K.niveaux(S(d.b, g))[3] === 2 ? 'saturée' : 'ouverte'; lect[lab + ' : front = front de'] = d => { const f = fr(S(d.b, g)), a = f === fr(d.L.R1.figure), e = f === fr(d.L.R7.figure); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; }; lect[lab + ' : figure présente en base dans le front de'] = d => { const f = S(d.b, g), inF = c => [0, 1, 2, 3].some(i => d.b[fr(c.figure) + 1 + 4 * i] === f), a = inF(d.L.R1), e = inF(d.L.R7); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; }; }
lect['les deux moulins égaux'] = d => S(d.b, G1) === S(d.b, G2) ? 'oui' : 'non';
lect['les deux moulins : même Terre'] = d => K.niveaux(S(d.b, G1))[3] === K.niveaux(S(d.b, G2))[3] ? 'oui' : 'non';
const rows = []; console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
for (const [lab, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.s > 0) t[k][2]++; if (d.s < 0) t[k][3]++; }); Object.keys(t).forEach(k => rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), t: t[k] })); if (!lab.endsWith(': figure')) console.log('  ' + lab.padEnd(52), Object.keys(t).sort().map(k => k + ' : nuls ' + t[k][1] + '/' + t[k][0] + ' R1 ' + t[k][2] + ' R7 ' + t[k][3]).join(' · ')); }
const y = D.map(d => d.nul), p0 = y.reduce((a, b) => a + b) / D.length, rr = D.map(d => d.s), ok = r => r.t[0] >= 6 && r.t[0] <= D.length - 6;
const zN = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.t[0] * p0) / Math.sqrt(r.t[0] * p0 * (1 - p0)); };
const zV = (r, q) => { let a = 0, b = 0; r.x.forEach((v, i) => { if (v && q[i] > 0) a++; if (v && q[i] < 0) b++; }); return (a + b) ? Math.abs(a - b) / Math.sqrt(a + b) : 0; };
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
const R0 = rows.filter(ok), bN = Math.max(...R0.map(r => zN(r, y))), bV = Math.max(...R0.map(r => zV(r, rr))); let gN = 0, gV = 0;
for (let t = 0; t < 2000; t++) { if (Math.max(...R0.map(r => zN(r, mel(y)))) >= bN) gN++; if (Math.max(...R0.map(r => zV(r, mel(rr)))) >= bV) gV++; }
const tn = R0.slice().sort((a, b) => zN(b, y) - zN(a, y))[0], tv = R0.slice().sort((a, b) => zV(b, rr) - zV(a, rr))[0];
console.log('\n' + R0.length + ' cases ; NUL : meilleure', tn.lab, '=', tn.k, '(' + tn.t[1] + ' sur ' + tn.t[0] + ') — hasard', (100 * gN / 2000).toFixed(1) + ' % ; VAINQUEUR : meilleure', tv.lab, '=', tv.k, '(R1 ' + tv.t[2] + ', R7 ' + tv.t[3] + ') — hasard', (100 * gV / 2000).toFixed(1) + ' %');
