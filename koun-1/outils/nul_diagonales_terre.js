// Signe demandé par le propriétaire (2026-11-25) : les diagonales des nœuds (les 15 nœuds : diagonales 1-6-11-16 et 4-7-10-13), niveaux Terre.
// Lectures candidates, annoncées avant le calcul ; jugées seules sur le nul, puis comme 6e signe de la convergence v2.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D1 = [1, 6, 11, 16], D2 = [4, 7, 10, 13], ter = f => K.niveaux(f)[3] === 2;
const rz = (L, h) => h < 16 ? L.theme.resultantes[h] : L.theme.bases[16], bz = (L, h) => L.theme.bases[h];
const nT = (L, hs, c) => hs.filter(h => ter(c(L, h))).length;
const LECT = {
  'résultantes : même nombre de Terre saturées sur les deux diagonales': L => nT(L, D1, rz) === nT(L, D2, rz),
  'bases : même nombre de Terre saturées sur les deux diagonales': L => nT(L, D1, bz) === nT(L, D2, bz),
  'somme des bases de 1-6-11-16 : Terre saturée': L => ter(D1.map(h => bz(L, h)).reduce(A)),
  'somme des bases de 4-7-10-13 : Terre saturée': L => ter(D2.map(h => bz(L, h)).reduce(A)),
  'les deux sommes de diagonales : même Terre (⇔ coins M1+M4+M13+M16 Terre saturée)': L => ter(D1.map(h => bz(L, h)).reduce(A)) === ter(D2.map(h => bz(L, h)).reduce(A)),
  'résultantes des 8 maisons diagonales : 4 Terre saturées ou plus': L => nT(L, D1, rz) + nT(L, D2, rz) >= 4,
  'Terre des nœuds diagonaux des deux pôles à égalité (règle du verdict)': L => M.diagonales(L).ecart === 0,
};
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] }));
const C = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return r; }, p0 = D.filter(d => d.nul).length / D.length;
const ligne = (nom, X) => { const c = X.filter(d => d.lot === 'corpus'), a = X.filter(d => d.lot === 'aveugle'), x = X.filter(d => d.nul).length; return '  ' + nom.padEnd(84) + ('nuls ' + x + '/' + X.length + ' (' + Math.round(100 * x / (X.length || 1)) + ' %)').padEnd(17) + '| corpus ' + c.filter(d => d.nul).length + '/' + c.length + ' · aveugle ' + a.filter(d => d.nul).length + '/' + a.length; };
console.log('1. Chaque lecture seule (oui / non) — taux de nul général ' + Math.round(100 * p0) + ' %');
for (const [k, f] of Object.entries(LECT)) { console.log(ligne(k + ' : oui', D.filter(d => f(d.L)))); console.log(ligne('      non', D.filter(d => !f(d.L)))); }
console.log('\n   thème 12-10-14-5 : ' + Object.entries(LECT).map(([k, f]) => (f(M.lire([12, 10, 14, 5])) ? 'oui' : 'non')).join(' · '));
// 2. Chaque lecture ajoutée comme 6e signe (pour le nul) à la convergence v2 : le lien score / nul monte-t-il ?
const NOY = [4, 8, 12, 16], MOB = [6, 10, 14], t = (L, h) => K.niveaux(L.theme.bases[h])[3];
const ph = L => { let n = 0, m = 0; for (let h = 1; h <= 16; h++) [L.theme.bases[h], L.resu(h)].forEach(f => { if (NOY.includes(f)) n++; if (MOB.includes(f)) m++; }); return m > n ? -1 : 1; };
const v2 = L => { const d = ((L.R7.figure - L.R1.figure) % 16 + 16) % 16; return ph(L) + (MOB.includes(d) || MOB.includes(L.lien) ? -1 : 0) + (M.equilibre(L).equilibre ? 1 : 0) + (t(L, 1) === t(L, 2) && t(L, 2) === t(L, 3) ? 1 : 0) + (t(L, 14) === 2 ? 1 : 0); };
const y = D.map(d => d.nul ? 1 : 0), corr = (a, b) => { const n = a.length, ma = a.reduce((s, v) => s + v) / n, mb = b.reduce((s, v) => s + v) / n; let u = 0, v = 0, w = 0; for (let i = 0; i < n; i++) { u += (a[i] - ma) * (b[i] - mb); v += (a[i] - ma) ** 2; w += (b[i] - mb) ** 2; } return u / Math.sqrt(v * w); };
console.log('\n2. Ajout comme 6e signe à la convergence v2 (corrélation score / nul ; v2 seule : ' + corr(D.map(d => v2(d.L)), y).toFixed(3) + ')');
for (const [k, f] of Object.entries(LECT)) console.log('   ', k.padEnd(84), 'pour si oui : ' + corr(D.map(d => v2(d.L) + (f(d.L) ? 1 : 0)), y).toFixed(3), '· pour si non : ' + corr(D.map(d => v2(d.L) + (f(d.L) ? 0 : 1)), y).toFixed(3));
