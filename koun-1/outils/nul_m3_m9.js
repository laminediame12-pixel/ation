// Le nul : Eau de M3 (= Eau de M7, point de la diagonale des mères) et M9 (= M1 + M2).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const NV = ['Feu', 'Air', 'Eau', 'Terre'];
let eq = 0; for (let x = 0; x < 65536; x++) { const b = K.construire([1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)]).bases; if (K.niveaux(b[3])[2] === K.niveaux(b[7])[2]) eq++; }
console.log('Eau de M3 = Eau de M7 dans', eq, 'thèmes sur 65 536\n');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme; return { ...d, L, b: T.bases, rz: h => h < 16 ? T.resultantes[h] : T.bases[16], nul: d.sc[0] === d.sc[1] ? 1 : 0, s: Math.sign(d.sc[0] - d.sc[1]) }; });
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls (19 %)\n');
const lect = {};
for (const h of [3, 7, 9]) for (const [src, sn] of [['b', 'base'], ['r', 'résultante']]) { NV.forEach((n, l) => { lect['M' + h + ' ' + sn + ' : ' + n] = d => K.niveaux(src === 'b' ? d.b[h] : d.rz(h))[l] === 2 ? 'saturé' : 'ouvert'; }); lect['M' + h + ' ' + sn + ' : figure'] = d => nm(src === 'b' ? d.b[h] : d.rz(h)); }
lect['Eau M3 (base) × Eau M9 (base)'] = d => (K.niveaux(d.b[3])[2] === 2 ? 'M3 sat' : 'M3 ouv') + ' · ' + (K.niveaux(d.b[9])[2] === 2 ? 'M9 sat' : 'M9 ouv');
lect['Eau M3 (base) × Terre M9 (résultante)'] = d => (K.niveaux(d.b[3])[2] === 2 ? 'M3 sat' : 'M3 ouv') + ' · ' + (K.niveaux(d.rz(9))[3] === 2 ? 'M9 T sat' : 'M9 T ouv');
lect['M9 base = figure d\'un pôle'] = d => d.b[9] === d.L.R1.figure ? 'R1' : d.b[9] === d.L.R7.figure ? 'R7' : 'non';
lect['Eau de M3 et M9 : liaison par parité (Eau)'] = d => K.niveaux(A(d.b[3], d.b[9]))[2] === 2 ? 'liée' : 'arrêt';
const rows = [];
for (const [lab, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0, []]; t[k][0]++; t[k][1] += d.nul; if (d.s > 0) t[k][2]++; if (d.s < 0) t[k][3]++; if (d.nul) t[k][4].push(d.sc.join('-')); }); Object.keys(t).forEach(k => rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), t: t[k] })); if (!lab.endsWith('figure')) console.log('  ' + lab.padEnd(40), Object.keys(t).sort().map(k => k + ' ' + t[k][1] + '/' + t[k][0]).join(' · ')); }
const y = D.map(d => d.nul), p0 = y.reduce((a, b) => a + b) / D.length, ok = r => r.t[0] >= 6 && r.t[0] <= D.length - 6;
const z = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.t[0] * p0) / Math.sqrt(r.t[0] * p0 * (1 - p0)); };
const R0 = rows.filter(ok), ob = Math.max(...R0.map(r => z(r, y))); let ge = 0;
for (let t = 0; t < 3000; t++) { const q = y.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (Math.max(...R0.map(r => z(r, q))) >= ob) ge++; }
console.log('\n' + R0.length + ' cases ; les plus liées au nul :'); R0.slice().sort((a, b) => z(b, y) - z(a, y)).slice(0, 8).forEach(r => console.log('    ', (r.lab + ' = ' + r.k).padEnd(56), r.t[1] + ' nuls sur ' + r.t[0], '(' + r.t[4].join(', ') + ')'));
console.log('la meilleure est atteinte par hasard dans', (100 * ge / 3000).toFixed(1) + ' % des mélanges');
console.log('cases sans nul (au moins 10 matchs) :', R0.filter(r => r.t[1] === 0 && r.t[0] >= 10).map(r => r.lab + ' = ' + r.k + ' (' + r.t[0] + ', R1 ' + r.t[2] + ' R7 ' + r.t[3] + ')').join(' · ') || 'aucune');
