// Fouille approfondie des arrêts (antagoniste h − 3 posé dans la maison h) et des buts, sur les 106 matchs connus (80 du corpus + 26 à l'aveugle).
// 1. La règle intégrée (au moins un arrêt → plus de buts) sur les deux lots séparément et réunis, avec test de permutation.
// 2. Variantes annoncées : nombre d'arrêts, arrêt en résultante, arrêt dans les maisons angulaires / succédentes / cadentes, arrêt d'un front,
//    arrêt du côté d'un pôle (son front, sa maison) → ses buts marqués ou encaissés. Toutes les variantes passent par le même contrôle (maximum sur
//    les variantes comparé aux mélanges), et chaque lecture retenue doit garder son sens sur les deux lots pris séparément.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme; return { ...d, L, T, g: d.sc[0] + d.sc[1] }; });
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, fr = h => (h - 1) % 4;
const arretB = (T, h) => h <= 15 && T.bases[h] === mod(h - 3), arretR = (T, h) => h <= 15 && T.resultantes[h] === mod(h - 3);
const frontDe = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const H15 = [...Array(15)].map((_, i) => i + 1), ANG = [1, 4, 7, 10, 13], SUC = [2, 5, 8, 11, 14], CAD = [3, 6, 9, 12, 15];
const moy = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN;
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
// ── lectures du match (oui / non) → total de buts
const LM = {
  'au moins un arrêt (règle intégrée)': T => H15.some(h => arretB(T, h)),
  'au moins deux arrêts': T => H15.filter(h => arretB(T, h)).length >= 2,
  'arrêt en résultante': T => H15.some(h => arretR(T, h)),
  'arrêt en base ou en résultante': T => H15.some(h => arretB(T, h) || arretR(T, h)),
  'arrêt en maison angulaire (1-4-7-10-13)': T => ANG.some(h => arretB(T, h)),
  'arrêt en maison succédente (2-5-8-11-14)': T => SUC.some(h => arretB(T, h)),
  'arrêt en maison cadente (3-6-9-12-15)': T => CAD.some(h => arretB(T, h)),
  'arrêt chez les mères (1-4)': T => [1, 2, 3, 4].some(h => arretB(T, h)),
  'arrêt chez les filles (5-8)': T => [5, 6, 7, 8].some(h => arretB(T, h)),
  'arrêt chez les nièces (9-12)': T => [9, 10, 11, 12].some(h => arretB(T, h)),
  'arrêt chez les témoins ou le juge (13-15)': T => [13, 14, 15].some(h => arretB(T, h)),
};
['A', 'B', 'C', 'D'].forEach((f, z) => { LM['arrêt dans le front ' + f] = T => frontDe(z + 1).some(h => arretB(T, h)); });
function ecart(D0, f) { const a = D0.filter(d => f(d.T)).map(d => d.g), b = D0.filter(d => !f(d.T)).map(d => d.g); return { na: a.length, nb: b.length, ma: moy(a), mb: moy(b), d: moy(a) - moy(b), t: (moy(a) - moy(b)) / Math.sqrt(1.7 ** 2 * (1 / (a.length || 1) + 1 / (b.length || 1))) }; }
console.log(D.length + ' matchs (' + D.filter(d => d.lot === 'corpus').length + ' corpus, ' + D.filter(d => d.lot === 'aveugle').length + ' à l\'aveugle) ; buts moyens ' + moy(D.map(d => d.g)).toFixed(2) + '\n');
console.log('1. TOTAL DE BUTS selon les arrêts (avec / sans) — corpus | aveugle | réunis');
const NP = +process.argv[2] || 2000, G = D.map(d => d.g);
const tm = Object.entries(LM).map(([k, f]) => { const c = ecart(D.filter(d => d.lot === 'corpus'), f), a = ecart(D.filter(d => d.lot === 'aveugle'), f), t = ecart(D, f); return { k, f, c, a, t }; });
tm.sort((x, y) => Math.abs(y.t.t) - Math.abs(x.t.t)).forEach(o => console.log('   ', o.k.padEnd(44), ('corpus ' + o.c.ma.toFixed(2) + ' (' + o.c.na + ') / ' + o.c.mb.toFixed(2) + ' (' + o.c.nb + ')').padEnd(32), ('| aveugle ' + (isNaN(o.a.ma) ? '—' : o.a.ma.toFixed(2)) + ' (' + o.a.na + ') / ' + (isNaN(o.a.mb) ? '—' : o.a.mb.toFixed(2)) + ' (' + o.a.nb + ')').padEnd(32), '| réunis écart ' + (o.t.d >= 0 ? '+' : '') + o.t.d.toFixed(2), o.c.d * o.a.d > 0 ? '' : ' ⚠ sens inversé à l\'aveugle'));
const regle = tm.find(o => o.k.startsWith('au moins un arrêt'));
{ let g = 0; for (let t = 0; t < NP; t++) { const q = mel(G); const a = [], b = []; D.forEach((d, i) => (LM['au moins un arrêt (règle intégrée)'](d.T) ? a : b).push(q[i])); if (moy(a) - moy(b) >= regle.t.d) g++; }
  console.log('\n   règle intégrée seule, 106 matchs : écart +' + regle.t.d.toFixed(2) + ' but ; atteint par hasard dans ' + (100 * g / NP).toFixed(1) + ' % des mélanges (test unilatéral, la règle était posée avant)'); }
{ const om = Math.max(...tm.map(o => Math.abs(o.t.t))); let g = 0; for (let t = 0; t < NP; t++) { const q = mel(G); const m = Math.max(...Object.values(LM).map(f => { const a = [], b = []; D.forEach((d, i) => (f(d.T) ? a : b).push(q[i])); return Math.abs((moy(a) - moy(b)) / Math.sqrt(1.7 ** 2 * (1 / (a.length || 1) + 1 / (b.length || 1)))); })); if (m >= om) g++; }
  console.log('   meilleure des ' + tm.length + ' variantes : ' + tm[0].k + ' ; atteinte par hasard dans ' + (100 * g / NP).toFixed(1) + ' % des mélanges'); }
// lignes de paris classiques (sans parier : simple lecture du total)
console.log('\n   plus de 2,5 buts : avec arrêt ' + D.filter(d => regle.f(d.T) && d.g > 2.5).length + '/' + D.filter(d => regle.f(d.T)).length + ' · sans arrêt ' + D.filter(d => !regle.f(d.T) && d.g > 2.5).length + '/' + D.filter(d => !regle.f(d.T)).length);
const parNb = {}; D.forEach(d => { const n = H15.filter(h => arretB(d.T, h)).length; parNb[n] = parNb[n] || []; parNb[n].push(d.g); });
console.log('   buts moyens selon le nombre d\'arrêts : ' + Object.keys(parNb).map(n => n + ' arrêt' + (n > 1 ? 's' : '') + ' → ' + moy(parNb[n]).toFixed(2) + ' (' + parNb[n].length + ')').join(' · '));
// ── 2. arrêts du côté d'un pôle → buts de ce pôle (marqués / encaissés)
console.log('\n2. ARRÊTS DU CÔTÉ D\'UN PÔLE → ses buts (marqués, encaissés) — corrélation sur 212 pôles-matchs ; corpus | aveugle');
const LP = {
  'arrêts dans le front du pôle': (T, c) => frontDe(c.figure).filter(h => arretB(T, h)).length,
  'arrêts dans le front de la maison du pôle': (T, c) => frontDe(c.maison).filter(h => arretB(T, h)).length,
  'arrêts dans le front du binôme': (T, c) => frontDe(K.binome(c.figure)).filter(h => arretB(T, h)).length,
  'arrêts dans le front de l\'antagoniste': (T, c) => frontDe(mod(c.figure - 3)).filter(h => arretB(T, h)).length,
  'la maison du pôle est en arrêt': (T, c) => arretB(T, c.maison) ? 1 : 0,
  'la figure du pôle arrête une maison (elle y est l\'antagoniste)': (T, c) => H15.filter(h => T.bases[h] === c.figure && arretB(T, h)).length,
  'l\'antagoniste du pôle est posé dans la maison du pôle': (T, c) => T.bases[c.maison] === mod(c.figure - 3) ? 1 : 0,
};
const corr = (x, y) => { const n = x.length, mx = moy(x), my = moy(y); let a = 0, b = 0, c = 0; for (let i = 0; i < n; i++) { a += (x[i] - mx) * (y[i] - my); b += (x[i] - mx) ** 2; c += (y[i] - my) ** 2; } return b && c ? a / Math.sqrt(b * c) : 0; };
const rows = [];
for (const [k, f] of Object.entries(LP)) for (const cible of ['marqués', 'encaissés']) {
  const val = lot => { const X = [], Y = []; D.filter(d => !lot || d.lot === lot).forEach(d => [['R1', 0], ['R7', 1]].forEach(([p, i]) => { X.push(f(d.T, d.L[p])); Y.push(cible === 'marqués' ? d.sc[i] : d.sc[1 - i]); })); return corr(X, Y); };
  rows.push({ k: k + ' → buts ' + cible, c: val('corpus'), a: val('aveugle'), t: val(null) });
}
rows.sort((x, y) => Math.abs(y.t) - Math.abs(x.t)).forEach(o => console.log('   ', o.k.padEnd(78), 'corpus', o.c.toFixed(2).padStart(5), '| aveugle', o.a.toFixed(2).padStart(5), '| réunis', o.t.toFixed(2).padStart(5), o.c * o.a > 0 ? '' : ' ⚠ sens inversé'));
