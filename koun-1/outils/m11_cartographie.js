// Cartographie des fronts (mode thème réel) : dans la croix d'un front z (haut z+1, droite z+5, bas z+9, gauche z+13), le nœud M11 (Eau × Eau) est au
// croisement du canal Eau de la branche droite (maison z+5) et du canal Eau de la branche basse (maison z+9) — lu dans le code de la carte (hS / vS).
// Un canal Eau est saturé si la résultante de sa maison a l'Eau à 2. Question du propriétaire : quand le canal de R1 ou R7 touche M11, le pôle marque-t-il ?
// Le pôle « touche M11 » si sa figure est la branche droite ou basse de la croix de son front (figures 5 à 12) ; son canal y est actif si l'Eau de la
// résultante de la maison de même numéro est saturée. Nœud M11 de la croix : plein si les deux canaux Eau (z+5, z+9) sont saturés.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot, nom) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus', x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus', '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus', 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, 'aveugle', x.match)));
const eau = (L, h) => K.niveaux(L.theme.resultantes[h])[2] === 2;
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m) })), pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
const touche = (L, p) => { const f = L[p].figure; return f >= 5 && f <= 12; };
const canal = (L, p) => touche(L, p) && eau(L, L[p].figure);
const noeud = (L, p) => { const z = (L[p].figure - 1) % 4; return eau(L, z + 5) && eau(L, z + 9); };
const LECT = { 'le canal du pôle touche M11 (figure 5 à 12)': touche, 'le canal du pôle touche M11 et son Eau est saturée': canal, 'le nœud M11 de la croix de son front est plein': noeud, 'le pôle touche M11 et ce nœud est plein': (L, p) => touche(L, p) && noeud(L, p) };
console.log(D.length + ' matchs, ' + 2 * D.length + ' pôles ; un pôle marque dans ' + pc(D.reduce((s, d) => s + (d.sc[0] > 0) + (d.sc[1] > 0), 0), 2 * D.length) + ' des cas\n');
for (const [k, f] of Object.entries(LECT)) { console.log(k); for (const lot of ['corpus', 'aveugle']) { let a = 0, n = 0, a0 = 0, n0 = 0; D.filter(d => d.lot === lot).forEach(d => ['R1', 'R7'].forEach((p, i) => { const v = f(d.L, p), m = d.sc[i] > 0; if (v) { n++; if (m) a++; } else { n0++; if (m) a0++; } }));
  console.log('    ' + lot.padEnd(8) + ' oui : marque ' + a + '/' + n + ' (' + pc(a, n) + ') · non : marque ' + a0 + '/' + n0 + ' (' + pc(a0, n0) + ')'); } }
['Juventus – Venezia', 'Atlético – Viking', 'Sporting – Manchester United', 'PSG – Roma'].forEach(nm => { const d = D.find(x => x.nom === nm); if (!d) return; console.log('\n' + nm + ' ' + d.sc.join('-') + ' : ' + ['R1', 'R7'].map(p => p + ' ' + K.nom(d.L[p].figure) + (touche(d.L, p) ? ' touche M11, canal Eau ' + (canal(d.L, p) ? 'saturé' : 'ouvert') : ' ne touche pas M11') + ', nœud M11 de sa croix ' + (noeud(d.L, p) ? 'plein' : 'vide')).join(' · ')); });
// Correction du propriétaire : à Juventus, Albus — front direct de Populus (R1) — est posé en M11. Critère : la figure du pôle ou son front direct (f + 4)
// est posée en base dans M11 ; M11 plein = Eau saturée dans la résultante (le point Eau de la figure posée rencontre celui de Conjunctio).
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, loge = (L, p, h) => [L[p].figure, mod(L[p].figure + 4)].includes(L.theme.bases[h]);
const plein = (L, h, l) => K.niveaux(h < 16 ? L.theme.resultantes[h] : L.theme.bases[16])[l] === 2;
const L2 = { 'le pôle ou son front direct loge en M11': (L, p) => loge(L, p, 11), '… et M11 est plein (Eau²)': (L, p) => loge(L, p, 11) && plein(L, 11, 2),
  'même lecture sur les quatre nœuds doubles (M1, M6, M11, M16), nœud plein': (L, p) => [[1, 0], [6, 1], [11, 2], [16, 3]].some(([h, l]) => loge(L, p, h) && plein(L, h, l)) };
console.log('\n--- Le pôle ou son front direct logé dans le nœud ---');
for (const [k, f] of Object.entries(L2)) { console.log(k); for (const lot of ['corpus', 'aveugle']) { let a = 0, n = 0, a0 = 0, n0 = 0; D.filter(d => d.lot === lot).forEach(d => ['R1', 'R7'].forEach((p, i) => { const v = f(d.L, p), m = d.sc[i] > 0; if (v) { n++; if (m) a++; } else { n0++; if (m) a0++; } }));
  console.log('    ' + lot.padEnd(8) + ' oui : marque ' + a + '/' + n + ' (' + pc(a, n) + ') · non : marque ' + a0 + '/' + n0 + ' (' + pc(a0, n0) + ')'); } }
{ const d = D.find(x => x.nom === 'Juventus – Venezia'); console.log('\nJuventus : M11 = ' + K.nom(d.L.theme.bases[11]) + ', M11 ' + (plein(d.L, 11, 2) ? 'plein' : 'vide') + ' · R1 ' + (L2['… et M11 est plein (Eau²)'](d.L, 'R1') ? 'marque par M11' : 'non') + ' · R7 ' + (L2['… et M11 est plein (Eau²)'](d.L, 'R7') ? 'marque par M11' : 'non')); }
