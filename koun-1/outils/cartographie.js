// Cartographie des fronts : génère moteur3/cartographie.json et vérifie la structure.
// Usage : node outils/cartographie.js            (écrit moteur3/cartographie.json et affiche le bilan des vérifications)
//         node outils/cartographie.js --verifier (compare avec le fichier existant, sans l'écrire)
// Aucune règle du moteur n'utilise cette structure : c'est la description exacte de la carte (cartographe-fronts.html), pour une intégration future.
const fs = require('fs'), path = require('path');
const K = require('./_lecture.js');

// Niveaux d'activation (Feu, Air, Eau, Terre) de chaque figure, en points (1 ou 2), numérotées par leur maison de repos. Même table que le moteur (contrôlée plus bas).
const POINTS = [[1,1,2,1],[1,2,2,2],[2,1,1,1],[2,2,1,2],[1,1,1,1],[1,2,1,2],[2,1,2,2],[2,2,2,1],[1,1,2,2],[1,2,2,1],[2,1,1,2],[2,2,1,1],[1,1,1,2],[1,2,1,1],[2,1,2,1],[2,2,2,2]];
const NIV = ['Feu', 'Air', 'Eau', 'Terre'], FRONTS = ['A', 'B', 'C', 'D'];
const nom = n => K.FIG[n - 1];
const front = n => FRONTS[(n - 1) % 4];
const antagoniste = n => ((n - 4) % 16 + 16) % 16 + 1;                 // n − 3
const controleur = n => ((n - 7) % 16 + 16) % 16 + 1;                  // n − 6
const miroir = n => ((n + 7) % 16) + 1;                                // n + 8
const niveau = (a, b) => (a + b) % 2 === 0 ? 2 : 1;                    // niveaux égaux : 2 (saturé), différents : 1 (non saturé)
const additionner = (a, b) => { const s = POINTS[a - 1].map((x, i) => niveau(x, POINTS[b - 1][i])).join(); return POINTS.findIndex(p => p.join() === s) + 1; };
const recul = (h, d) => ((h - 1 - 3 * d) % 16 + 16) % 16 + 1;           // h − 3·d

// ── Branche : base + maison au repos = résultante, états des liaisons niveau par niveau
function branche(base, maison) {
  const res = additionner(base, maison), niv = POINTS[maison - 1].map((x, i) => niveau(POINTS[base - 1][i], x));
  return { maison, base, resultante: res, niveaux_resultante: niv, liens: niv.map(v => v === 2 ? 'sature' : 'non_sature'), saturees: niv.filter(v => v === 2).length };
}
// Croix : haut = f, droite = f+4, bas = f+8, gauche = f+12 (maisons au repos du front f). Liaisons haut↔bas et gauche↔droite, par niveau.
const SLOTS = [['haut', 0], ['droite', 4], ['bas', 8], ['gauche', 12]];
function croix(f, d) { const c = {}; SLOTS.forEach(([s, k]) => { const h = f + k; c[s] = branche(recul(h, d), h); }); return c; }

// ── Intersections : 9 (droites Feu, Air, Eau) + 6 (la Terre croise Feu, Air, Eau) = 15. Un point est « plein » si les deux liens qui s'y croisent sont saturés, « anneau » si les deux sont non saturés.
function intersections(c) {
  const st = (b, i) => b.liens[i], H = (i, droite) => st(droite ? c.droite : c.gauche, i), V = (j, bas) => st(bas ? c.bas : c.haut, j);
  const pts = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) pts.push([H(i, j >= 2), V(j, i >= 2)]);   // colonnes 0-1 : moitié gauche ; ligne 0-1 : moitié haute
  for (let i = 0; i < 3; i++) pts.push([H(i, true), st(c.haut, 3)]);                               // la Terre du haut descend puis tourne à droite : croise les horizontales
  for (let j = 0; j < 3; j++) pts.push([V(j, true), st(c.gauche, 3)]);                             // la Terre du bas monte puis tourne à gauche : croise les verticales
  return { total: pts.length, pleins: pts.filter(p => p[0] === 'sature' && p[1] === 'sature').length, anneaux: pts.filter(p => p[0] === 'non_sature' && p[1] === 'non_sature').length };
}

// ── Construction
const figures = POINTS.map((p, i) => { const n = i + 1; return { num: n, nom: nom(n), niveaux: p, front: front(n), element: NIV[(n - 1) % 4], antagoniste: antagoniste(n), controleur: controleur(n), miroir: miroir(n) }; });
const fronts = {}; FRONTS.forEach((F, z) => { const c = croix(z + 1, 1); fronts[F] = { element: NIV[z], figures: [1, 5, 9, 13].map(k => z + k), croix: c, intersections: intersections(c) }; });
const sommes = [['A','B'],['A','C'],['A','D'],['B','C'],['B','D'],['C','D'],['D','C']].map(([X, Y]) => {
  const zx = FRONTS.indexOf(X), zy = FRONTS.indexOf(Y), d = ((zy - zx) % 4 + 4) % 4, c = croix(zx + 1, d);
  return { combinaison: X + '+' + Y, repos: X, base: Y, recul: 3 * d, croix: c, front_des_resultantes: front(additionner(zx + 1, zy + 1)), intersections: intersections(c),
           statut_alignement: d === 1 ? 'antagoniste (n−3) : identique à la carte du front ' + X : 'recul de 3 par pas de front : supposé, non confirmé par le propriétaire' };
});
// ── Les 16 maisons face à leur antagoniste : résultante, niveaux saturés, élément naturel, maison que la résultante attaque (R+3)
const maisons = Array.from({ length: 16 }, (_, i) => { const h = i + 1, a = antagoniste(h), r = additionner(a, h), sat = POINTS[r - 1].map((x, l) => x === 2 ? NIV[l] : null).filter(Boolean), el = NIV[(h - 1) % 4];
  return { maison: h, element: el, antagoniste: a, resultante: r, niveaux_satures: sat, element_sature: sat.includes(el), cible: ((r + 2) % 16) + 1, miroir: miroir(h) }; });
const doc = { version: 1, source: 'outils/cartographie.js', statut: 'description de la carte ; aucune règle du moteur ne l\'utilise ; non validé sur des scores',
  regles: { addition: 'niveaux égaux : 2 points (saturé) ; niveaux différents : 1 point (non saturé)', front: '(numéro − 1) mod 4 : A Feu, B Air, C Eau, D Terre', antagoniste: 'n − 3 (modulo 16)', controleur: 'n − 6', miroir: 'n + 8',
    croix: 'haut f, droite f+4, bas f+8, gauche f+12 (maisons au repos) ; de l\'extérieur vers le centre : base, maison au repos, résultante = base + maison', liaisons: 'la résultante décide, niveau par niveau : 2 saturé, 1 non saturé ; chaque moitié de liaison porte l\'état de sa résultante',
    terre: 'la Terre du haut (f) dévie vers la droite (f+4), celle du bas (f+8) vers la gauche (f+12) : 15 intersections, pas de seizième', somme: 'X+Y : figures du front X au repos, figures du front Y en base ; base de la maison h = h − 3·d, d = (Y − X) mod 4' },
  figures, fronts, sommes, maisons };

// ── Vérifications
const verifs = []; const ok = (nomV, cond, detail) => verifs.push([nomV, !!cond, detail || '']);
// la table des niveaux est celle du moteur : résultantes de la maison 9 à 16 et filles 5 à 8, sur 3 000 thèmes tirés
let tout = true; for (let t = 0; t < 3000 && tout; t++) {
  const m = [0, 1, 2, 3].map(() => 1 + Math.floor(Math.random() * 16)), L = K.lire(K.construireTheme(...m.map(K.fig)));
  const M = L.maisons.map(x => K.FIG.indexOf(x.base) + 1);
  if (M[8] !== additionner(m[0], m[1]) || M[9] !== additionner(m[2], m[3]) || M[12] !== additionner(M[8], M[9])) tout = false;
  for (let l = 0; l < 4; l++) if (POINTS[M[4 + l] - 1].join() !== m.map(f => POINTS[f - 1][l]).join()) tout = false;
}
ok('table des niveaux et addition identiques à celles du moteur (3 000 thèmes)', tout);
ok('chaque front compte 4 figures et les fronts partitionnent les 16 figures', FRONTS.every(F => figures.filter(f => f.front === F).length === 4));
ok('le front d\'une figure est fixé par ses niveaux Feu et Air', FRONTS.every(F => new Set(figures.filter(f => f.front === F).map(f => f.niveaux.slice(0, 2).join())).size === 1) && new Set(figures.map(f => f.niveaux.slice(0, 2).join())).size === 4);
ok('contrôleur = antagoniste de l\'antagoniste (n−6) ; miroir (n+8) dans le même front', figures.every(f => f.controleur === antagoniste(f.antagoniste) && front(f.miroir) === f.front && f.miroir === ((f.num + 7) % 16) + 1));
ok('chaque figure : base + maison = résultante, et résultante = maison + base', FRONTS.every(F => SLOTS.every(([s]) => { const b = fronts[F].croix[s]; return b.resultante === additionner(b.maison, b.base); })));
ok('carte du front A : 14+1=11, 2+5=3, 6+9=11, 10+13=3 (dessin du propriétaire)', [['haut',14,1,11],['droite',2,5,3],['bas',6,9,11],['gauche',10,13,3]].every(([s,b,h,r]) => { const x = fronts.A.croix[s]; return x.base === b && x.maison === h && x.resultante === r; }));
ok('15 intersections pour chaque carte (fronts et sommes)', [...Object.values(fronts), ...sommes].every(c => c.intersections.total === 15));
ok('somme X+Y : maisons dans le front X, bases dans le front Y', sommes.every(s => SLOTS.every(([sl]) => front(s.croix[sl].maison) === s.repos && front(s.croix[sl].base) === s.base)));
ok('somme de deux fronts : les résultantes tombent dans un seul front (A+B→C, A+C→B, A+D→A, B+C→A, B+D→B, C+D→C)', [['A','B','C'],['A','C','B'],['A','D','A'],['B','C','A'],['B','D','B'],['C','D','C']].every(([X,Y,Z]) => sommes.find(s => s.combinaison === X + '+' + Y).front_des_resultantes === Z));
ok('les 16 sommes d\'une figure de X et d\'une figure de Y forment un carré latin sur les 4 figures du front résultat', [['A','B'],['A','C'],['A','D'],['B','C'],['B','D'],['C','D']].every(([X,Y]) => { const xs = [1,5,9,13].map(k => FRONTS.indexOf(X) + k), ys = [1,5,9,13].map(k => FRONTS.indexOf(Y) + k); return xs.every(a => new Set(ys.map(b => additionner(a, b))).size === 4) && ys.every(b => new Set(xs.map(a => additionner(a, b))).size === 4); }));
ok('A+B, B+C, C+D (d = 1) donnent exactement la carte du front X', ['A+B','B+C','C+D'].every(c => { const s = sommes.find(x => x.combinaison === c); return JSON.stringify(s.croix) === JSON.stringify(fronts[c[0]].croix); }));
ok('D+C est différent de C+D (le premier front est au repos)', JSON.stringify(sommes.find(s => s.combinaison === 'D+C').croix) !== JSON.stringify(sommes.find(s => s.combinaison === 'C+D').croix));
ok('chaque somme : base + maison = résultante dans les 28 branches', sommes.every(s => SLOTS.every(([sl]) => { const b = s.croix[sl]; return b.resultante === additionner(b.base, b.maison); })));

ok('les attaques des antagonistes (résultante + 3) n\'arrivent que sur 5 maisons : M4, M6, M8, M14, M16', JSON.stringify([...new Set(maisons.map(m => m.cible))].sort((a, b) => a - b)) === '[4,6,8,14,16]');
ok('M8 est la seule maison où la résultante de l\'antagoniste est l\'antagoniste du miroir (Via en M8 → Cauda, antagoniste de Populus en M16)', maisons.filter(m => m.resultante === antagoniste(m.miroir)).map(m => m.maison).join() === '8');
ok('canaux : Feu et Eau attaquent l\'Air, l\'Air attaque la Terre, la Terre s\'attaque elle-même', [[0, 'Air'], [1, 'Terre'], [2, 'Air'], [3, 'Terre']].every(([c, e]) => maisons.filter(m => (m.maison - 1) % 4 === c).every(m => NIV[(m.cible - 1) % 4] === e)));
const binome = n => ((n - 1) % 4 < 2) ? n + 2 : n - 2;   // couples symétriques 1-3, 2-4, 5-7, 6-8, 9-11, 10-12, 13-15, 14-16
ok('figure + binôme : Amissio (Air+Terre saturés) dans les blocs M1-4 et M9-12, Puella (Air seul) dans M5-8 et M13-16 ; Air toujours saturé, Feu et Eau jamais', figures.every(f => { const s = additionner(f.num, binome(f.num)), b = Math.floor((f.num - 1) / 4); return s === (b % 2 === 0 ? 6 : 14) && POINTS[s - 1][0] === 1 && POINTS[s - 1][1] === 2 && POINTS[s - 1][2] === 1; }));
ok('résultante de la maison + résultante de son binôme : Feu et Air toujours saturés (Tristitia, Albus ou Fortuna Major)', maisons.every(m => { const s = additionner(m.resultante, maisons[binome(m.maison) - 1].resultante); return POINTS[s - 1][0] === 2 && POINTS[s - 1][1] === 2; }));
ok('binôme + antagoniste : A → Fortuna Minor, C → Puer, D → Aquisitio ; B → Caput (blocs M1-4, M9-12) ou Conjunctio (M5-8, M13-16)', figures.every(f => { const s = additionner(binome(f.num), antagoniste(f.num)), b = Math.floor((f.num - 1) / 4); const att = { A: 9, C: 1, D: 15, B: b % 2 === 0 ? 3 : 11 }[f.front]; return s === att; }));
ok('l\'antagoniste du binôme = le binôme de l\'antagoniste pour les figures des fronts A et C, et pour elles seules', figures.every(f => (antagoniste(binome(f.num)) === binome(antagoniste(f.num))) === (f.front === 'A' || f.front === 'C')));
const sortie = path.join(__dirname, '..', 'moteur3', 'cartographie.json'), json = JSON.stringify(doc, null, 1);
if (process.argv.includes('--verifier')) { const cur = fs.existsSync(sortie) ? fs.readFileSync(sortie, 'utf8') : ''; verifs.push(['fichier cartographie.json à jour', cur === json, '']); }
else fs.writeFileSync(sortie, json);
let mauvais = 0; verifs.forEach(([n, c, d]) => { if (!c) mauvais++; console.log((c ? 'OK     ' : 'ÉCHEC  ') + n + (d ? ' — ' + d : '')); });
console.log(mauvais ? mauvais + ' vérification(s) en échec' : 'Toutes les vérifications passent (' + verifs.length + ').');
process.exit(mauvais ? 1 : 0);
