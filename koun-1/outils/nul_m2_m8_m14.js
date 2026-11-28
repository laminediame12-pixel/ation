// Demande du propriétaire (2026-11-25) : M8 ajoutée à M14 et M2 (Terre des trois, ressemblance, somme), sur le nul ; puis dans la convergence v3.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] }));
const b = (d, h) => d.L.theme.bases[h], T = (d, h) => K.niveaux(b(d, h))[3];
const ligne = (nom, X) => { const c = X.filter(d => d.lot === 'corpus'), a = X.filter(d => d.lot === 'aveugle'), x = X.filter(d => d.nul).length; return '  ' + nom.padEnd(54) + ('nuls ' + x + '/' + X.length + ' (' + Math.round(100 * x / (X.length || 1)) + ' %)').padEnd(17) + '| corpus ' + c.filter(d => d.nul).length + '/' + c.length + ' · aveugle ' + a.filter(d => d.nul).length + '/' + a.length; };
console.log('1. Terre de M2, M8, M14');
for (const x of [2, 1]) for (const y of [2, 1]) for (const z of [2, 1]) console.log(ligne('Terre M2 ' + x + ' · M8 ' + y + ' · M14 ' + z, D.filter(d => T(d, 2) === x && T(d, 8) === y && T(d, 14) === z)));
const nS = d => [2, 8, 14].filter(h => T(d, h) === 2).length;
[0, 1, 2, 3].forEach(k => console.log(ligne('Terre saturée sur ' + k + ' des trois maisons', D.filter(d => nS(d) === k))));
console.log(ligne('même Terre en M2, M8, M14', D.filter(d => T(d, 2) === T(d, 8) && T(d, 8) === T(d, 14))));
console.log('\n2. Somme M2 + M8 + M14');
const S = d => A(A(b(d, 2), b(d, 8)), b(d, 14));
console.log(ligne('somme : Terre saturée', D.filter(d => K.niveaux(S(d))[3] === 2)));
console.log(ligne('somme : Terre ouverte', D.filter(d => K.niveaux(S(d))[3] === 1)));
console.log(ligne('somme = Populus', D.filter(d => S(d) === 16)));
console.log(ligne('somme : nombre de niveaux saturés ≥ 3', D.filter(d => K.niveaux(S(d)).filter(v => v === 2).length >= 3)));
const t = M.lire([12, 10, 14, 5]).theme.bases; console.log('\n  thème 12-10-14-5 : M2 ' + K.nom(t[2]) + ' (T' + K.niveaux(t[2])[3] + '), M8 ' + K.nom(t[8]) + ' (T' + K.niveaux(t[8])[3] + '), M14 ' + K.nom(t[14]) + ' (T' + K.niveaux(t[14])[3] + '), somme ' + K.nom(A(A(t[2], t[8]), t[14])));
// 3. convergence : le signe « Terre de M14 saturée » remplacé (pas d'ajout)
const NOY = [4, 8, 12, 16], MOB = [6, 10, 14];
const ph = L => { let n = 0, m = 0; for (let h = 1; h <= 16; h++) [L.theme.bases[h], L.resu(h)].forEach(f => { if (NOY.includes(f)) n++; if (MOB.includes(f)) m++; }); return m > n ? -1 : 1; };
const base5 = d => { const L = d.L, dd = ((L.R7.figure - L.R1.figure) % 16 + 16) % 16; return ph(L) + (MOB.includes(dd) || MOB.includes(L.lien) ? -1 : 0) + (M.equilibre(L).equilibre ? 1 : 0) + (T(d, 1) === T(d, 2) && T(d, 2) === T(d, 3) ? 1 : 0) + ([1, 6, 11, 16, 4, 7, 10, 13].filter(h => K.niveaux(h < 16 ? L.theme.resultantes[h] : L.theme.bases[16])[3] === 2).length < 4 ? 1 : 0); };
const y = D.map(d => d.nul ? 1 : 0), corr = (a, c) => { const n = a.length, ma = a.reduce((s, v) => s + v) / n, mb = c.reduce((s, v) => s + v) / n; let u = 0, v = 0, w = 0; for (let i = 0; i < n; i++) { u += (a[i] - ma) * (c[i] - mb); v += (a[i] - ma) ** 2; w += (c[i] - mb) ** 2; } return u / Math.sqrt(v * w); };
const V = { 'v3 actuelle : Terre M14 saturée': d => T(d, 14) === 2 ? 1 : 0, 'Terre saturée sur au moins 2 de M2, M8, M14': d => nS(d) >= 2 ? 1 : 0, 'même Terre en M2, M8, M14': d => T(d, 2) === T(d, 8) && T(d, 8) === T(d, 14) ? 1 : 0, 'somme M2+M8+M14 Terre saturée': d => K.niveaux(S(d))[3] === 2 ? 1 : 0, 'Terre saturée en M14 et M8': d => T(d, 14) === 2 && T(d, 8) === 2 ? 1 : 0 };
console.log('\n3. Convergence : le signe M14 remplacé par une lecture M2-M8-M14 (corrélation score / nul) — thème 12-10-14-5');
for (const [k, f] of Object.entries(V)) { const s = D.map(d => base5(d) + f(d)), dt = { L: M.lire([12, 10, 14, 5]) }; console.log('   ', k.padEnd(46), corr(s, y).toFixed(3), '| thème 12-10-14-5 : ' + (base5(dt) + f(dt))); }
