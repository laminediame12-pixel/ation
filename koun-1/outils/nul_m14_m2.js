// Demande du propriétaire (2026-11-25) : comparer M14 (témoin des filles) avec M2.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] }));
const b = (d, h) => d.L.theme.bases[h], T = (d, h) => K.niveaux(b(d, h))[3], NV = ['Feu', 'Air', 'Eau', 'Terre'];
const ligne = (nom, X) => { const c = X.filter(d => d.lot === 'corpus'), a = X.filter(d => d.lot === 'aveugle'), x = X.filter(d => d.nul).length; return '  ' + nom.padEnd(50) + ('nuls ' + x + '/' + X.length + ' (' + Math.round(100 * x / (X.length || 1)) + ' %)').padEnd(17) + '| corpus ' + c.filter(d => d.nul).length + '/' + c.length + ' · aveugle ' + a.filter(d => d.nul).length + '/' + a.length; };
console.log('1. Terre de M2 et Terre de M14');
[[2, 2], [2, 1], [1, 2], [1, 1]].forEach(([x, y]) => console.log(ligne('Terre M2 ' + x + ' · Terre M14 ' + y, D.filter(d => T(d, 2) === x && T(d, 14) === y))));
console.log(ligne('même Terre en M2 et M14', D.filter(d => T(d, 2) === T(d, 14))));
console.log(ligne('Terre différente en M2 et M14', D.filter(d => T(d, 2) !== T(d, 14))));
console.log('\n2. Les figures');
console.log(ligne('M14 = M2 (même figure)', D.filter(d => b(d, 14) === b(d, 2))));
console.log(ligne('M2 + M14 = Populus… (même figure, rappel)', D.filter(d => A(b(d, 2), b(d, 14)) === 16)));
for (let l = 0; l < 4; l++) console.log(ligne('même ' + NV[l] + ' en M2 et M14', D.filter(d => K.niveaux(b(d, 2))[l] === K.niveaux(b(d, 14))[l])));
const nbEg = d => [0, 1, 2, 3].filter(l => K.niveaux(b(d, 2))[l] === K.niveaux(b(d, 14))[l]).length;
[0, 1, 2, 3, 4].forEach(k => console.log(ligne('niveaux identiques entre M2 et M14 : ' + k, D.filter(d => nbEg(d) === k))));
console.log('\n3. Résultantes de M2 et M14 (Terre)');
const TR = (d, h) => K.niveaux(d.L.theme.resultantes[h])[3];
console.log(ligne('même Terre dans les résultantes de M2 et M14', D.filter(d => TR(d, 2) === TR(d, 14))));
console.log(ligne('Terre différente', D.filter(d => TR(d, 2) !== TR(d, 14))));
const t = M.lire([12, 10, 14, 5]); console.log('\n  thème 12-10-14-5 : M2 ' + K.nom(t.theme.bases[2]) + ' (Terre ' + K.niveaux(t.theme.bases[2])[3] + '), M14 ' + K.nom(t.theme.bases[14]) + ' (Terre ' + K.niveaux(t.theme.bases[14])[3] + ')');
// 4. Dans la convergence v3 : remplacer le signe « Terre de M14 saturée » par une lecture M2–M14 (remplacement, pas ajout)
const NOY = [4, 8, 12, 16], MOB = [6, 10, 14];
const ph = L => { let n = 0, m = 0; for (let h = 1; h <= 16; h++) [L.theme.bases[h], L.resu(h)].forEach(f => { if (NOY.includes(f)) n++; if (MOB.includes(f)) m++; }); return m > n ? -1 : 1; };
const base5 = d => { const L = d.L, dd = ((L.R7.figure - L.R1.figure) % 16 + 16) % 16; return ph(L) + (MOB.includes(dd) || MOB.includes(L.lien) ? -1 : 0) + (M.equilibre(L).equilibre ? 1 : 0) + (T(d, 1) === T(d, 2) && T(d, 2) === T(d, 3) ? 1 : 0) + ([1, 6, 11, 16, 4, 7, 10, 13].filter(h => K.niveaux(h < 16 ? L.theme.resultantes[h] : L.theme.bases[16])[3] === 2).length < 4 ? 1 : 0); };
const y = D.map(d => d.nul ? 1 : 0), corr = (a, c) => { const n = a.length, ma = a.reduce((s, v) => s + v) / n, mb = c.reduce((s, v) => s + v) / n; let u = 0, v = 0, w = 0; for (let i = 0; i < n; i++) { u += (a[i] - ma) * (c[i] - mb); v += (a[i] - ma) ** 2; w += (c[i] - mb) ** 2; } return u / Math.sqrt(v * w); };
const V = { 'v3 actuelle (Terre M14 saturée)': d => T(d, 14) === 2 ? 1 : 0, 'Terre saturée en M2 ET en M14': d => T(d, 2) === 2 && T(d, 14) === 2 ? 1 : 0, 'même Terre en M2 et M14': d => T(d, 2) === T(d, 14) ? 1 : 0, 'ressemblance M2–M14 ≥ 3 niveaux': d => nbEg(d) >= 3 ? 1 : 0, 'Terre M14 saturée (+1) et ressemblance M2–M14 ≥ 3 (+1)': d => (T(d, 14) === 2 ? 1 : 0) + (nbEg(d) >= 3 ? 1 : 0) };
console.log('\n4. Convergence : le signe M14 remplacé par une lecture M2–M14 (corrélation score / nul)');
for (const [k, f] of Object.entries(V)) { const s = D.map(d => base5(d) + f(d)), t = {}; D.forEach((d, i) => { t[s[i]] = t[s[i]] || [0, 0]; t[s[i]][0] += d.nul; t[s[i]][1]++; });
  console.log('   ', k.padEnd(56), corr(s, y).toFixed(3), ' | ' + Object.keys(t).sort((a, c) => a - c).map(x => (x > 0 ? '+' : '') + x + ':' + t[x][0] + '/' + t[x][1]).join(' ')); }
