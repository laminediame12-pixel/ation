// Signe demandé par le propriétaire (2026-11-25) : les témoins. M13 = M9 + M10 (fusion des mères, côté M1–M4), M14 = M11 + M12 (fusion des filles, côté M5–M8).
// Le juge M15 = M13 + M14 : Terre saturée, il confirme ; Terre ouverte, il nie. Identité : Terre de M15 saturée ⇔ M13 et M14 ont la même Terre.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] }));
const T = (L, h) => K.niveaux(L.theme.bases[h])[3];
console.log('identité Terre(M15) = 2 ⇔ Terre(M13) = Terre(M14) sur les 106 thèmes : ' + (D.every(d => (T(d.L, 15) === 2) === (T(d.L, 13) === T(d.L, 14))) ? 'exacte' : 'FAUSSE'));
const ligne = (nom, X) => { const c = X.filter(d => d.lot === 'corpus'), a = X.filter(d => d.lot === 'aveugle'), x = X.filter(d => d.nul).length; return '  ' + nom.padEnd(52) + ('nuls ' + x + '/' + X.length + ' (' + Math.round(100 * x / (X.length || 1)) + ' %)').padEnd(17) + '| corpus ' + c.filter(d => d.nul).length + '/' + c.length + ' · aveugle ' + a.filter(d => d.nul).length + '/' + a.length; };
console.log(ligne('juge M15 Terre saturée (confirme)', D.filter(d => T(d.L, 15) === 2)));
console.log(ligne('juge M15 Terre ouverte (nie)', D.filter(d => T(d.L, 15) === 1)));
[[2, 2], [2, 1], [1, 2], [1, 1]].forEach(([a, b]) => console.log(ligne('témoins : Terre M13 ' + a + ' · Terre M14 ' + b, D.filter(d => T(d.L, 13) === a && T(d.L, 14) === b))));
console.log(ligne('Terre M1-M3 identique et juge confirme', D.filter(d => T(d.L, 1) === T(d.L, 2) && T(d.L, 2) === T(d.L, 3) && T(d.L, 15) === 2)));
console.log(ligne('Terre M1-M3 identique et juge nie', D.filter(d => T(d.L, 1) === T(d.L, 2) && T(d.L, 2) === T(d.L, 3) && T(d.L, 15) === 1)));
console.log('  thème 12-10-14-5 : Terre M13 ' + T(M.lire([12, 10, 14, 5]), 13) + ', M14 ' + T(M.lire([12, 10, 14, 5]), 14) + ', juge M15 ' + T(M.lire([12, 10, 14, 5]), 15));
// dans la convergence v3 : le juge confirme (+1) ou nie (−1), ou confirme seulement (+1 / 0)
const NOY = [4, 8, 12, 16], MOB = [6, 10, 14];
const ph = L => { let n = 0, m = 0; for (let h = 1; h <= 16; h++) [L.theme.bases[h], L.resu(h)].forEach(f => { if (NOY.includes(f)) n++; if (MOB.includes(f)) m++; }); return m > n ? -1 : 1; };
const v3 = L => { const d = ((L.R7.figure - L.R1.figure) % 16 + 16) % 16; return ph(L) + (MOB.includes(d) || MOB.includes(L.lien) ? -1 : 0) + (M.equilibre(L).equilibre ? 1 : 0) + (T(L, 1) === T(L, 2) && T(L, 2) === T(L, 3) ? 1 : 0) + (T(L, 14) === 2 ? 1 : 0) + ([1, 6, 11, 16, 4, 7, 10, 13].filter(h => K.niveaux(h < 16 ? L.theme.resultantes[h] : L.theme.bases[16])[3] === 2).length < 4 ? 1 : 0); };
const y = D.map(d => d.nul ? 1 : 0), corr = (a, b) => { const n = a.length, ma = a.reduce((s, v) => s + v) / n, mb = b.reduce((s, v) => s + v) / n; let u = 0, v = 0, w = 0; for (let i = 0; i < n; i++) { u += (a[i] - ma) * (b[i] - mb); v += (a[i] - ma) ** 2; w += (b[i] - mb) ** 2; } return u / Math.sqrt(v * w); };
console.log('\nconvergence v3 seule : corrélation ' + corr(D.map(d => v3(d.L)), y).toFixed(3));
console.log('v3 + juge (confirme +1 / nie −1) : ' + corr(D.map(d => v3(d.L) + (T(d.L, 15) === 2 ? 1 : -1)), y).toFixed(3));
console.log('v3 + juge (confirme +1 / nie 0)  : ' + corr(D.map(d => v3(d.L) + (T(d.L, 15) === 2 ? 1 : 0)), y).toFixed(3));
console.log('v3, Terre M14 remplacée par le juge (±1) : ' + corr(D.map(d => v3(d.L) - (T(d.L, 14) === 2 ? 1 : 0) + (T(d.L, 15) === 2 ? 1 : -1)), y).toFixed(3));
const tab = f => { const t = {}; D.forEach(d => { const s = f(d.L); t[s] = t[s] || [0, 0, 0, 0]; t[s][0] += d.nul; t[s][1]++; if (d.lot === 'aveugle') { t[s][2] += d.nul; t[s][3]++; } }); return Object.keys(t).sort((a, b) => a - b).map(k => (k > 0 ? '+' : '') + k + ' → ' + t[k][0] + '/' + t[k][1] + ' (aveugle ' + t[k][2] + '/' + t[k][3] + ')').join(' · '); };
console.log('\nv3 + juge (±1) par score : ' + tab(L => v3(L) + (T(L, 15) === 2 ? 1 : -1)));
