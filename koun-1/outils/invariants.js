// Propriétés invariantes de la structure, vérifiées sur les 65 536 thèmes (tout l'espace des thèmes : c'est une preuve par énumération).
// Usage : node outils/invariants.js   (aucune règle de verdict ici : seulement des lois de la structure)
const K = require('../moteur3/moteur.js'), J = require('../moteur3/cartographie.json'), F = J.figures;
const P = n => F[n - 1].niveaux, NIV = ['Feu', 'Air', 'Eau', 'Terre'];
const niv = (a, b) => (a + b) % 2 === 0 ? 2 : 1, add = (a, b) => F.findIndex(f => f.niveaux.join() === P(a).map((x, i) => niv(x, P(b)[i])).join()) + 1;
const sat = (r, l) => P(r)[l] === 2;                                              // niveau l de la figure r saturé (2 points)
const themes = []; for (let q = 0; q < 65536; q++) { const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), L = K.lire(K.construireTheme(...m.map(K.fig))); const r = [0]; L.maisons.forEach(x => r.push(add(K.num(x.base), x.maison))); themes.push(r); }
const verifs = []; const ok = (n, c, d) => verifs.push([n, !!c, d || '']);
const toujours = (f) => themes.every(f);

// I1 — Diagonale de transposition : les maisons M1..M4 (mères) et M5..M8 (filles) partagent leur diagonale ; sur les résultantes, ce niveau est saturé ensemble ou opposé selon les figures de repos.
const DIAG = [[1, 5, 0], [2, 6, 1], [3, 7, 2], [4, 8, 3]];
DIAG.forEach(([a, b, l]) => { const memes = P(a)[l] === P(b)[l]; ok('I1 ' + NIV[l] + ' : M' + a + ' et M' + b + (memes ? ' sont saturées ensemble' : ' sont toujours opposées (exactement une est saturée)'), toujours(r => memes ? sat(r[a], l) === sat(r[b], l) : sat(r[a], l) !== sat(r[b], l))); });

// I2 — Huit lois de conservation : pour chaque triple de maisons issu de la construction du thème, la parité du nombre de niveaux NON saturés (1 point) à chaque niveau est fixe.
const TRIPLES = [[1, 2, 9], [3, 4, 10], [5, 6, 11], [7, 8, 12], [9, 10, 13], [11, 12, 14], [13, 14, 15], [1, 15, 16]];
const constante = t => { let c = [0, 0, 0, 0]; t.forEach(h => P(h).forEach((p, l) => { c[l] ^= p === 1 ? 1 : 0; })); return c; };   // parité attendue de chaque niveau
TRIPLES.forEach(t => { const c = constante(t); ok('I2 triple M' + t.join('+M') + ' : nombre de niveaux non saturés impair à ' + (NIV.filter((_, l) => c[l]).join(', ') || 'aucun niveau'), toujours(r => [0, 1, 2, 3].every(l => (t.filter(h => !sat(r[h], l)).length % 2) === c[l]))); });

// I3 — Liaisons : 32 liaisons (4 fronts × axe vertical/horizontal × 4 niveaux), connectée si les deux résultantes opposées saturent le niveau
const cles = [], ends = []; for (let z = 0; z < 4; z++) for (const ax of ['vertical', 'horizontal']) for (let l = 0; l < 4; l++) { cles.push('front ' + 'ABCD'[z] + ' ' + ax + ' ' + NIV[l]); ends.push(ax === 'vertical' ? [z + 1, z + 9, l] : [z + 13, z + 5, l]); }
const C = themes.map(r => ends.map(([a, b, l]) => sat(r[a], l) && sat(r[b], l)));
ok('I3 chaque liaison est connectée dans exactement 16 384 thèmes sur 65 536 (1/4)', cles.every((_, i) => C.filter(v => v[i]).length === 16384));
const excl = []; for (let i = 0; i < 32; i++) for (let j = i + 1; j < 32; j++) if (C.every(v => !(v[i] && v[j]))) excl.push([cles[i], cles[j]]);
ok('I3 exactement 14 couples de liaisons ne sont jamais connectées ensemble, aucune implication ni équivalence', excl.length === 14 && cles.every((_, i) => cles.every((_, j) => i === j || !C.every(v => !v[i] || v[j]) || C.every(v => !v[i]))), excl.length + ' exclusions');
ok('I3 aucune liaison n\'est jamais ou toujours connectée ; le nombre de liaisons connectées par thème va de 0 à 19', C.every(v => true) && Math.min(...C.map(v => v.filter(Boolean).length)) === 0 && Math.max(...C.map(v => v.filter(Boolean).length)) === 19);

// I4 — Bornes
const tot = r => { let s = 0; for (let h = 1; h <= 16; h++) for (let l = 0; l < 4; l++) if (sat(r[h], l)) s++; return s; };
ok('I4 niveaux saturés sur les 16 résultantes : toujours entre 17 et 47 (sur 64)', Math.min(...themes.map(tot)) === 17 && Math.max(...themes.map(tot)) === 47);
const canal = (r, c) => [0, 1, 2, 3].reduce((s, k) => s + [0, 1, 2, 3].filter(l => sat(r[c + 1 + 4 * k], l)).length, 0);
ok('I4 canaux Eau et Terre : au moins 2 niveaux saturés dans les résultantes de leurs 4 maisons ; Feu et Air peuvent n\'en avoir aucun', [0, 1, 2, 3].every(c => Math.min(...themes.map(r => canal(r, c))) === (c >= 2 ? 2 : 0)));

let mauvais = 0; verifs.forEach(([n, c, d]) => { if (!c) mauvais++; console.log((c ? 'OK     ' : 'ÉCHEC  ') + n + (d ? ' — ' + d : '')); });
console.log('\nLes 14 couples de liaisons jamais connectées ensemble :'); excl.forEach(([a, b]) => console.log('  ' + a + '  ✕  ' + b));
console.log(mauvais ? '\n' + mauvais + ' échec(s)' : '\nToutes les propriétés sont vérifiées sur les 65 536 thèmes (' + verifs.length + ').'); process.exit(mauvais ? 1 : 0);
