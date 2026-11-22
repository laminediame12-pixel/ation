// La Terre des diagonales tient-elle l'équilibre du thème (nul) ?
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const DP = [1, 6, 11, 16], DA = [4, 7, 10, 13];
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16]; return { ...d, L, b, rz, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const tS = (f) => K.niveaux(f)[3] === 2 ? 1 : 0;
const node = (d, z, diag) => diag.find(x => (x - 1) % 4 === z);
const F = {
  'Terre saturée : diagonale 1-6-11-16 (résultantes, 0-4)': d => DP.filter(h => tS(d.rz(h))).length,
  'Terre saturée : diagonale 4-7-10-13 (résultantes, 0-4)': d => DA.filter(h => tS(d.rz(h))).length,
  'les deux diagonales ont autant de Terre saturée': d => DP.filter(h => tS(d.rz(h))).length === DA.filter(h => tS(d.rz(h))).length ? 'oui' : 'non',
  'Terre des 8 nœuds diagonaux (0-8)': d => DP.concat(DA).filter(h => tS(d.rz(h))).length,
  'Terre de la somme des résultantes, diag. 1-6-11-16': d => tS(DP.map(d.rz).reduce(A)),
  'Terre de la somme des résultantes, diag. 4-7-10-13': d => tS(DA.map(d.rz).reduce(A)),
  'Terre des deux sommes : même parité': d => tS(DP.map(d.rz).reduce(A)) === tS(DA.map(d.rz).reduce(A)) ? 'oui' : 'non',
  'Terre saturée en base : 1-6-11-16': d => DP.filter(h => tS(d.b[h])).length,
  'Terre saturée en base : 4-7-10-13': d => DA.filter(h => tS(d.b[h])).length,
  'nœuds diagonaux des fronts des pôles (R1 − R7)': d => { const f = c => { const z = (c.figure - 1) % 4; return [node(d, z, DP), node(d, z, DA)].filter(h => tS(d.rz(h))).length; }; return f(d.L.R1) + '-' + f(d.L.R7); },
  'nœuds diagonaux des pôles : égalité': d => { const f = c => { const z = (c.figure - 1) % 4; return [node(d, z, DP), node(d, z, DA)].filter(h => tS(d.rz(h))).length; }; return f(d.L.R1) === f(d.L.R7) ? 'égaux à ' + f(d.L.R1) : 'différents'; },
  'nœuds diagonaux des 2 fronts NON occupés par les pôles (0-4)': d => { const z1 = (d.L.R1.figure - 1) % 4, z7 = (d.L.R7.figure - 1) % 4; return [0, 1, 2, 3].filter(z => z !== z1 && z !== z7).map(z => [node(d, z, DP), node(d, z, DA)].filter(h => tS(d.rz(h))).length).reduce((a, c) => a + c, 0) + (z1 === z7 ? ' (même front)' : ''); },
};
console.log(D.length, 'matchs,', D.filter(d => d.nul).length, 'nuls (18 %)');
const rows = [];
for (const [lab, f] of Object.entries(F)) { const t = {}; D.forEach(d => { const k = f(d); t[k] = t[k] || [0, 0, 0, 0, []]; t[k][0]++; t[k][1] += d.nul; if (d.r > 0) t[k][2]++; if (d.r < 0) t[k][3]++; if (d.nul) t[k][4].push(d.sc.join('-')); }); console.log('\n' + lab); Object.keys(t).sort().forEach(k => { console.log('    ', String(k).padEnd(18), 'n', String(t[k][0]).padStart(2), '| nuls', t[k][1], '(' + Math.round(100 * t[k][1] / t[k][0]) + ' %) | R1', t[k][2], 'R7', t[k][3]); rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), n: t[k][0] }); }); }
// hasard : meilleure case pour le nul (au moins 5 matchs)
const y = D.map(d => d.nul), NN = y.reduce((a, b) => a + b), p0 = NN / D.length;
const best = yy => Math.max(...rows.filter(r => r.n >= 5 && r.n <= D.length - 5).map(r => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.n * p0) / Math.sqrt(r.n * p0 * (1 - p0)); }));
const ob = best(y); let ge = 0; for (let t = 0; t < 3000; t++) { const z = y.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } if (best(z) >= ob) ge++; }
const top = rows.filter(r => r.n >= 5).map(r => { let k = 0; r.x.forEach((v, i) => { if (v && y[i]) k++; }); return { r, k, z: (k - r.n * p0) / Math.sqrt(r.n * p0 * (1 - p0)) }; }).sort((a, b) => b.z - a.z).slice(0, 5);
console.log('\nles cases les plus liées au nul :'); top.forEach(t => console.log('    ', t.r.lab, '=', t.r.k, ':', t.k, 'nuls sur', t.r.n));
console.log('la meilleure case est atteinte par hasard dans', (100 * ge / 3000).toFixed(1) + ' % des mélanges');
