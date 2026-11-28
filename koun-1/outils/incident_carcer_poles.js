// Fouille : Carcer (10) et les pôles R1 / R7 → penalty ou rouge, et pour QUEL pôle (2026-11-25).
// Matchs à incident connu : scores-reels (penalty et rouge renseignés) + 20-23 novembre (incidents relevés ; les autres = aucun relevé).
// Pour chaque pôle, lectures annoncées avant le calcul ; cible « le pôle est concerné » (penalty pour lui ou rouge pour lui, tel que noté)
// et cible « incident dans le match ». Contrôle par mélange des étiquettes, sur le maximum de toutes les lectures.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const cote = s => ({ R1: /R1/.test(s || ''), R7: /R7/.test(s || '') });
const E = [];
lire('validation/scores-reels.json').forEach(x => { if (x.penalty == null || x.rouge == null) return; const p = cote(x.penalty), r = cote(x.rouge); E.push({ m: x.themes, match: x.match, lot: 'avant', pen: p, rouge: r }); });
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => E.push({ m: x.theme, match: x.match, lot: '20-23', pen: cote(x.penalty), rouge: cote(x.rouge) }));
const D = E.map(e => { const L = M.lire(e.m); return { ...e, L, b: L.theme.bases, rz: h => h < 16 ? L.theme.resultantes[h] : L.theme.bases[16],
  conc: { R1: e.pen.R1 || e.rouge.R1, R7: e.pen.R7 || e.rouge.R7 }, inc: e.pen.R1 || e.pen.R7 || e.rouge.R1 || e.rouge.R7 }; });
const OPP = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(h => [h, h + 6]);           // oppositions à 6 maisons (jusqu'à M10–M16)
const frontDe = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const LP = {   // lecture par pôle c (figure f, maison m) → 0/1
  'Carcer posé en base dans la maison du pôle': (d, c) => d.b[c.maison] === 10,
  'Carcer en résultante de la maison du pôle': (d, c) => d.rz(c.maison) === 10,
  'une opposition à 6 maisons qui part de la maison du pôle donne Carcer': (d, c) => OPP.some(([x, y]) => (x === c.maison || y === c.maison) && A(d.b[x], d.b[y]) === 10),
  'la figure du pôle fait partie d\'une opposition qui donne Carcer': (d, c) => OPP.some(([x, y]) => (d.b[x] === c.figure || d.b[y] === c.figure) && A(d.b[x], d.b[y]) === 10),
  'Carcer posé dans le front du pôle': (d, c) => frontDe(c.figure).some(h => d.b[h] === 10 || d.rz(h) === 10),
  'Carcer posé dans le front de la maison du pôle': (d, c) => frontDe(c.maison).some(h => d.b[h] === 10 || d.rz(h) === 10),
  'figure du pôle + Carcer : leur somme est posée en base': (d, c) => [...Array(16)].some((_, i) => d.b[i + 1] === A(c.figure, 10)),
  'le pôle a Carcer pour antagoniste ou protecteur (figure 13 ou 16)': (d, c) => c.figure === 13 || c.figure === 16,
};
const LM = {   // lecture du match → 0/1
  'R1 + R7 = Carcer': d => d.L.lien === 10,
  'maisons de R1 et R7 (opposées) : leurs bases donnent Carcer': d => A(d.b[d.L.R1.maison], d.b[d.L.R7.maison]) === 10,
  'au moins une opposition à 6 maisons donne Carcer (M1–M7 … M10–M16)': d => OPP.some(([x, y]) => A(d.b[x], d.b[y]) === 10),
  'Carcer en résultante d\'une des deux maisons des pôles': d => d.rz(d.L.R1.maison) === 10 || d.rz(d.L.R7.maison) === 10,
};
const pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
console.log(D.length + ' matchs à incident connu ; ' + D.filter(d => d.inc).length + ' avec penalty ou rouge ; ' + D.filter(d => d.conc.R1).length + ' fois R1 concerné, ' + D.filter(d => d.conc.R7).length + ' fois R7\n');
console.log('1. LE PÔLE CONCERNÉ (penalty ou rouge pour lui), sur ' + 2 * D.length + ' pôles-matchs');
const res = [];
for (const [k, f] of Object.entries(LP)) { let a = 0, n = 0, a0 = 0, n0 = 0, av = [0, 0]; D.forEach(d => ['R1', 'R7'].forEach(p => { const v = f(d, d.L[p]); if (v) { n++; if (d.conc[p]) a++; if (d.lot === '20-23') { av[1]++; if (d.conc[p]) av[0]++; } } else { n0++; if (d.conc[p]) a0++; } }));
  res.push({ k, a, n, a0, n0, av }); console.log('   ', k.padEnd(70), ('oui : ' + a + '/' + n + ' (' + pc(a, n) + ')').padEnd(20), ('non : ' + a0 + '/' + n0 + ' (' + pc(a0, n0) + ')').padEnd(20), '| 20-23 nov : ' + av[0] + '/' + av[1]); }
console.log('\n2. INCIDENT DANS LE MATCH');
for (const [k, f] of Object.entries(LM)) { const o = D.filter(f), x = D.filter(d => !f(d)), av = o.filter(d => d.lot === '20-23'); console.log('   ', k.padEnd(70), ('oui : ' + o.filter(d => d.inc).length + '/' + o.length + ' (' + pc(o.filter(d => d.inc).length, o.length) + ')').padEnd(20), ('non : ' + x.filter(d => d.inc).length + '/' + x.length).padEnd(20), '| 20-23 nov : ' + av.filter(d => d.inc).length + '/' + av.length); }
// contrôle : la meilleure séparation (pôle) comparée à des étiquettes mélangées entre matchs
const lab = D.map(d => d.conc), score = L0 => Math.max(...Object.values(LP).map(f => { let a = 0, n = 0, a0 = 0, n0 = 0; D.forEach((d, i) => ['R1', 'R7'].forEach(p => { const v = f(d, d.L[p]); if (v) { n++; if (L0[i][p]) a++; } else { n0++; if (L0[i][p]) a0++; } })); const p1 = (a + a0) / (n + n0); return n ? (a - n * p1) / Math.sqrt(n * p1 * (1 - p1) || 1) : 0; }));
const o0 = score(lab); let g = 0; const NP = 3000; for (let t = 0; t < NP; t++) { const q = lab.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (score(q) >= o0) g++; }
console.log('\nContrôle : la meilleure lecture par pôle est atteinte avec des incidents mélangés entre matchs dans ' + (100 * g / NP).toFixed(1) + ' % des cas.');
