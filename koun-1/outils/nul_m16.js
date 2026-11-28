// Demande du propriétaire (2026-11-25) : ajouter M16 (sentence = M15 + M1) à M2, M8, M14 ; sur le nul, puis dans la convergence v3 (ajout ou remplacement de M14).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] }));
const b = (d, h) => d.L.theme.bases[h], T = (d, h) => K.niveaux(b(d, h))[3];
const ligne = (nom, X) => { const c = X.filter(d => d.lot === 'corpus'), a = X.filter(d => d.lot === 'aveugle'), x = X.filter(d => d.nul).length; return '  ' + nom.padEnd(54) + ('nuls ' + x + '/' + X.length + ' (' + Math.round(100 * x / (X.length || 1)) + ' %)').padEnd(17) + '| corpus ' + c.filter(d => d.nul).length + '/' + c.length + ' · aveugle ' + a.filter(d => d.nul).length + '/' + a.length; };
console.log('1. M16 seule et avec M14');
console.log(ligne('Terre M16 saturée', D.filter(d => T(d, 16) === 2))); console.log(ligne('Terre M16 ouverte', D.filter(d => T(d, 16) === 1)));
for (const x of [2, 1]) for (const z of [2, 1]) console.log(ligne('Terre M14 ' + x + ' · M16 ' + z, D.filter(d => T(d, 14) === x && T(d, 16) === z)));
for (const x of [2, 1]) for (const z of [2, 1]) console.log(ligne('Terre M2 ' + x + ' · M14 2 · M16 ' + z, D.filter(d => T(d, 2) === x && T(d, 14) === 2 && T(d, 16) === z)));
const nS = d => [2, 8, 14, 16].filter(h => T(d, h) === 2).length;
[0, 1, 2, 3, 4].forEach(k => console.log(ligne('Terre saturée sur ' + k + ' de M2, M8, M14, M16', D.filter(d => nS(d) === k))));
console.log(ligne('M16 = Populus', D.filter(d => b(d, 16) === 16)));
const tb = M.lire([12, 10, 14, 5]).theme.bases; console.log('\n  thème 12-10-14-5 : M16 ' + K.nom(tb[16]) + ' (Terre ' + K.niveaux(tb[16])[3] + ')');
const NOY = [4, 8, 12, 16], MOB = [6, 10, 14];
const ph = L => { let n = 0, m = 0; for (let h = 1; h <= 16; h++) [L.theme.bases[h], L.resu(h)].forEach(f => { if (NOY.includes(f)) n++; if (MOB.includes(f)) m++; }); return m > n ? -1 : 1; };
const base5 = d => { const L = d.L, dd = ((L.R7.figure - L.R1.figure) % 16 + 16) % 16; return ph(L) + (MOB.includes(dd) || MOB.includes(L.lien) ? -1 : 0) + (M.equilibre(L).equilibre ? 1 : 0) + (T(d, 1) === T(d, 2) && T(d, 2) === T(d, 3) ? 1 : 0) + ([1, 6, 11, 16, 4, 7, 10, 13].filter(h => K.niveaux(h < 16 ? L.theme.resultantes[h] : L.theme.bases[16])[3] === 2).length < 4 ? 1 : 0); };
const y = D.map(d => d.nul ? 1 : 0), corr = (a, c) => { const n = a.length, ma = a.reduce((s, v) => s + v) / n, mb = c.reduce((s, v) => s + v) / n; let u = 0, v = 0, w = 0; for (let i = 0; i < n; i++) { u += (a[i] - ma) * (c[i] - mb); v += (a[i] - ma) ** 2; w += (c[i] - mb) ** 2; } return u / Math.sqrt(v * w); };
const V = { 'v3 actuelle (M14)': d => T(d, 14) === 2 ? 1 : 0, 'v3 + M16 saturée (ajout)': d => (T(d, 14) === 2 ? 1 : 0) + (T(d, 16) === 2 ? 1 : 0), 'v3 + M16 ouverte (ajout)': d => (T(d, 14) === 2 ? 1 : 0) + (T(d, 16) === 1 ? 1 : 0), 'M14 et M16 saturées (à la place de M14)': d => T(d, 14) === 2 && T(d, 16) === 2 ? 1 : 0, 'Terre saturée sur ≥ 3 de M2, M8, M14, M16 (à la place)': d => nS(d) >= 3 ? 1 : 0 };
console.log('\n2. Convergence (corrélation score / nul) — thème 12-10-14-5');
for (const [k, f] of Object.entries(V)) { const s = D.map(d => base5(d) + f(d)), dt = { L: M.lire([12, 10, 14, 5]) }; console.log('   ', k.padEnd(56), corr(s, y).toFixed(3), '| thème : ' + (base5(dt) + f(dt))); }
