// Maisons M1, M3, M5, M7, M10 : classe des figures (fermante, ouvrante, fixe, mobile, tout ouverte, toute fermée) en base et en résultante.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const classe = f => { const n = K.niveaux(f), s = n.filter(v => v === 2).length; return s === 0 ? 'tout ouverte' : s === 4 ? 'toute fermée' : s === 1 ? 'fermante' : s === 3 ? 'ouvrante' : n[3] === 2 ? 'mobile' : 'fixe'; };
console.log('classes des 16 figures :'); const parC = {}; for (let f = 1; f <= 16; f++) (parC[classe(f)] = parC[classe(f)] || []).push(nm(f)); Object.entries(parC).forEach(([c, l]) => console.log('   ', c.padEnd(13), l.join(', ')));
const HS = [1, 3, 5, 7, 10], fr = n => (n - 1) % 4;
console.log('\nmaisons étudiées : ' + HS.map(h => 'M' + h + ' (front ' + 'ABCD'[fr(h)] + ', figure de la maison ' + nm(h) + ' : ' + classe(h) + ')').join(' · '));
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme; return { ...d, L, b: h => T.bases[h], rz: h => h < 16 ? T.resultantes[h] : T.bases[16], r: Math.sign(d.sc[0] - d.sc[1]), nul: d.sc[0] === d.sc[1] ? 1 : 0 }; });
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
const rows = [], lect = {};
HS.forEach(h => { lect['M' + h + ' base'] = d => classe(d.b(h)); lect['M' + h + ' résultante'] = d => classe(d.rz(h)); });
const groupe = c => c === 'mobile' || c === 'ouvrante' || c === 'tout ouverte' ? 'ouvert/mobile' : 'fermé/fixe';
lect['nombre de bases mobiles (M1,3,5,7,10)'] = d => HS.filter(h => classe(d.b(h)) === 'mobile').length;
lect['nombre de bases fixes'] = d => HS.filter(h => classe(d.b(h)) === 'fixe').length;
lect['nombre de résultantes mobiles'] = d => HS.filter(h => classe(d.rz(h)) === 'mobile').length;
lect['nombre de résultantes fixes'] = d => HS.filter(h => classe(d.rz(h)) === 'fixe').length;
lect['résultantes fermantes ou toutes fermées'] = d => HS.filter(h => ['fermante', 'toute fermée'].includes(classe(d.rz(h)))).length;
lect['résultantes ouvrantes ou tout ouvertes'] = d => HS.filter(h => ['ouvrante', 'tout ouverte'].includes(classe(d.rz(h)))).length;
for (const [lab, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.r > 0) t[k][2]++; if (d.r < 0) t[k][3]++; t[k][4] += d.sc[0] + d.sc[1]; }); console.log('\n' + lab); Object.keys(t).sort().forEach(k => { console.log('    ', k.padEnd(14), 'n', String(t[k][0]).padStart(2), '| nuls', t[k][1], '(' + Math.round(100 * t[k][1] / t[k][0]) + ' %) | R1', t[k][2], 'R7', t[k][3], '| buts/match', (t[k][4] / t[k][0]).toFixed(1)); rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), t: t[k] }); }); }
// côté des pôles : maisons du front de la figure de chaque pôle parmi M1,3,5,7,10, mobiles ou fixes
const cote = { 'résultantes mobiles dans le front du pôle': (d, c) => HS.filter(h => fr(h) === fr(c.figure) && classe(d.rz(h)) === 'mobile').length, 'résultantes fixes dans le front du pôle': (d, c) => HS.filter(h => fr(h) === fr(c.figure) && classe(d.rz(h)) === 'fixe').length, 'bases mobiles dans le front du pôle': (d, c) => HS.filter(h => fr(h) === fr(c.figure) && classe(d.b(h)) === 'mobile').length };
console.log('\ncomparaison des pôles (maisons M1,3,5,7,10 de leur front) :');
for (const [k, f] of Object.entries(cote)) { let ok = 0, ko = 0, eg = 0, ne = 0; D.forEach(d => { const s = Math.sign(f(d, d.L.R1) - f(d, d.L.R7)); if (!s) { eg++; ne += d.nul; } else if (d.r) { if (s === d.r) ok++; else ko++; } }); console.log('    le plus de ' + k.padEnd(44), 'gagne', ok, 'perd', ko, '| égalité', eg, 'dont', ne, 'nuls'); }
// hasard
const y = D.map(d => d.nul), p0 = y.reduce((a, b) => a + b) / D.length, rr = D.map(d => d.r), ok = r => r.t[0] >= 6 && r.t[0] <= D.length - 6;
const zN = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.t[0] * p0) / Math.sqrt(r.t[0] * p0 * (1 - p0)); };
const zV = (r, q) => { let a = 0, b = 0; r.x.forEach((v, i) => { if (v && q[i] > 0) a++; if (v && q[i] < 0) b++; }); return (a + b) ? Math.abs(a - b) / Math.sqrt(a + b) : 0; };
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
const R0 = rows.filter(ok), bN = Math.max(...R0.map(r => zN(r, y))), bV = Math.max(...R0.map(r => zV(r, rr))); let gN = 0, gV = 0;
for (let t = 0; t < 2000; t++) { if (Math.max(...R0.map(r => zN(r, mel(y)))) >= bN) gN++; if (Math.max(...R0.map(r => zV(r, mel(rr)))) >= bV) gV++; }
const tN = R0.slice().sort((a, b) => zN(b, y) - zN(a, y))[0], tV = R0.slice().sort((a, b) => zV(b, rr) - zV(a, rr))[0];
console.log('\n' + R0.length + ' cases testées ; meilleure pour le NUL :', tN.lab, '=', tN.k, '(' + tN.t[1] + ' nuls sur ' + tN.t[0] + ') — atteinte par hasard dans', (100 * gN / 2000).toFixed(1) + ' %');
console.log('meilleure pour le VAINQUEUR :', tV.lab, '=', tV.k, '(R1 ' + tV.t[2] + ', R7 ' + tV.t[3] + ') — atteinte par hasard dans', (100 * gV / 2000).toFixed(1) + ' %');
