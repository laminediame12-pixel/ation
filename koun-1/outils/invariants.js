// Propriétés invariantes de la structure, vérifiées sur les 65 536 thèmes (tout l'espace des thèmes : c'est une preuve par énumération).
// Usage : node outils/invariants.js   (aucune règle de verdict ici : seulement des lois de la structure)
const K = require('../moteur3/moteur.js'), J = require('../moteur3/cartographie.json'), F = J.figures;
const P = n => F[n - 1].niveaux, NIV = ['Feu', 'Air', 'Eau', 'Terre'];
const niv = (a, b) => (a + b) % 2 === 0 ? 2 : 1, add = (a, b) => F.findIndex(f => f.niveaux.join() === P(a).map((x, i) => niv(x, P(b)[i])).join()) + 1;
const sat = (r, l) => P(r)[l] === 2;                                              // niveau l de la figure r saturé (2 points)
const themes = [], bases = []; for (let q = 0; q < 65536; q++) { const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), L = K.lire(K.construireTheme(...m.map(K.fig))); const r = [0], b = [0]; L.maisons.forEach(x => { b.push(K.num(x.base)); r.push(add(K.num(x.base), x.maison)); }); themes.push(r); bases.push(b); }
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

// I5 — Les 16 lois de transposition : le niveau l' de la mère M(m+1) et le niveau m de la fille M(5+l') sont le même (les filles sont les colonnes des mères). Sur les résultantes : saturés ensemble, ou toujours opposés.
const REST = (h, l) => P(h)[l] === 1 ? 1 : 0, paires = [];
for (let m = 0; m < 4; m++) for (let lp = 0; lp < 4; lp++) { const a = m + 1, b = 5 + lp, meme = REST(a, lp) === REST(b, m); paires.push([a, lp, b, m, meme]);
  ok('I5 M' + a + ' ' + NIV[lp] + ' ~ M' + b + ' ' + NIV[m] + (meme ? ' : saturés ensemble' : ' : toujours opposés'), toujours(r => meme ? sat(r[a], lp) === sat(r[b], m) : sat(r[a], lp) !== sat(r[b], m))); }

// I6 — Ensembles de 4 maisons qui déterminent tout le thème : énumération des 1 820 ensembles (tous les thèmes doivent donner des quadruplets de bases distincts)
const generateurs = []; for (let a = 1; a <= 16; a++) for (let b = a + 1; b <= 16; b++) for (let c = b + 1; c <= 16; c++) for (let d = c + 1; d <= 16; d++) {
  const vu = new Uint8Array(65536); let distincts = 0; for (const t of bases) { const k = ((t[a] - 1) << 12) | ((t[b] - 1) << 8) | ((t[c] - 1) << 4) | (t[d] - 1); if (!vu[k]) { vu[k] = 1; distincts++; } }
  if (distincts === 65536) generateurs.push([a, b, c, d]); }
ok('I6 exactement 55 ensembles de 4 maisons (sur 1 820) déterminent tout le thème', generateurs.length === 55, generateurs.length + ' ensembles');
ok('I6 aucun ensemble générateur ne contient à la fois une mère (M1-M4) et une fille (M5-M8)', generateurs.every(g => !(g.some(h => h <= 4) && g.some(h => h >= 5 && h <= 8))));
ok('I6 M15 n\'appartient à aucun ensemble générateur ; M3, M4 et M13 sont dans 19 d\'entre eux', generateurs.every(g => !g.includes(15)) && [3, 4, 13].every(h => generateurs.filter(g => g.includes(h)).length === 19));
ok('I6 les 4 mères (M1-M4) et les 4 filles (M5-M8) sont chacune un ensemble générateur', [[1, 2, 3, 4], [5, 6, 7, 8]].every(x => generateurs.some(g => g.join() === x.join())));

// I7 — Les 84 lois à trois niveaux = les 8 triples de construction × 4 niveaux, où chaque niveau d'une maison de M1..M8 peut être remplacé par son jumeau de transposition (I5).
// I8 — Ces lois sont complètes : 16 lois de transposition + 32 lois de construction = 48 lois indépendantes, qui engendrent toutes les lois entre niveaux de maisons.
{
  const e = (m, l) => 1 << (4 * m + l), Mm = {}; for (let m = 1; m <= 4; m++) Mm[m] = [0, 1, 2, 3].map(l => e(m - 1, l)); for (let l = 0; l < 4; l++) Mm[5 + l] = [0, 1, 2, 3].map(m => e(m, l));
  const ad = (a, b) => a.map((x, i) => x ^ b[i]); Mm[9] = ad(Mm[1], Mm[2]); Mm[10] = ad(Mm[3], Mm[4]); Mm[11] = ad(Mm[5], Mm[6]); Mm[12] = ad(Mm[7], Mm[8]); Mm[13] = ad(Mm[9], Mm[10]); Mm[14] = ad(Mm[11], Mm[12]); Mm[15] = ad(Mm[13], Mm[14]); Mm[16] = ad(Mm[15], Mm[1]);
  const bit = (h, l) => 4 * (h - 1) + l, formes = []; for (let h = 1; h <= 16; h++) for (let l = 0; l < 4; l++) formes.push({ h, l, f: Mm[h][l] });
  const jumeau = ([h, l]) => h <= 4 ? [5 + l, h - 1] : h <= 8 ? [l + 1, h - 5] : null, cle = t => t.map(([h, l]) => h + ':' + l).sort().join(' ');
  const triples = new Set(); for (let i = 0; i < 64; i++) for (let j = i + 1; j < 64; j++) for (let k = j + 1; k < 64; k++) if ((formes[i].f ^ formes[j].f ^ formes[k].f) === 0) triples.add(cle([formes[i], formes[j], formes[k]].map(v => [v.h, v.l])));
  // engendrées : 8 triples × 4 niveaux, puis toutes les substitutions par les jumeaux
  const engendrees = new Set(); TRIPLES.forEach(t => { for (let l = 0; l < 4; l++) { const base = t.map(h => [h, l]); const n = base.length; for (let m = 0; m < (1 << n); m++) { const v = base.map((b, i) => (m >> i & 1) && jumeau(b) ? jumeau(b) : b); engendrees.add(cle(v)); } } });
  ok('I7 il y a exactement 84 lois à trois niveaux, toutes engendrées par les 32 lois de construction et la transposition', triples.size === 84 && engendrees.size === 84 && [...triples].every(x => engendrees.has(x)), triples.size + ' lois');
  let tous = true; triples.forEach(x => { const t = x.split(' ').map(y => y.split(':').map(Number)); const c = t.reduce((a, [h, l]) => a ^ (P(h)[l] === 1 ? 1 : 0), 0); if (!themes.every(r => (t.filter(([h, l]) => !sat(r[h], l)).length % 2) === c)) tous = false; });
  ok('I7 chacune des 84 lois : parité du nombre de niveaux non saturés fixe sur les 65 536 thèmes', tous);
  // I8 : rang de l'ensemble des 48 lois (vecteurs sur 64 variables) = 48 = 64 − rang des 64 formes
  const lois = []; for (let m = 0; m < 4; m++) for (let lp = 0; lp < 4; lp++) lois.push((1n << BigInt(bit(m + 1, lp))) | (1n << BigInt(bit(5 + lp, m))));
  TRIPLES.forEach(t => { for (let l = 0; l < 4; l++) lois.push(t.reduce((a, h) => a | (1n << BigInt(bit(h, l))), 0n)); });
  const rang = vs => { const b = []; vs.forEach(x => { for (const y of b) { const z = x ^ y; if (z < x) x = z; } if (x) b.push(x); }); return b.length; };
  const rangFormes = (() => { const b = []; formes.forEach(v => { let x = v.f; for (const y of b) x = Math.min(x, x ^ y); if (x) b.push(x); }); return b.length; })();
  ok('I8 les 16 lois de transposition et les 32 lois de construction sont indépendantes (rang 48) et il n\'y a que 64 − 16 = 48 lois indépendantes en tout', rang(lois) === 48 && 64 - rangFormes === 48);
}

// I9 — Degrés de liberté des fronts : les 4 bases des maisons d'un front (canal) ne sont pas indépendantes ; combien de configurations possibles ?
{
  const canal = z => [z + 1, z + 5, z + 9, z + 13], noms = 'ABCD', attendu = { A: 8192, B: 4096, C: 4096, D: 8192 };
  const comptes = hs => { const vu = new Set(); for (const t of bases) vu.add(hs.map(h => t[h]).join()); return vu.size; };
  for (let z = 0; z < 4; z++) ok('I9 front ' + noms[z] + ' : ses 4 bases ne prennent que ' + attendu[noms[z]] + ' configurations sur 65 536', comptes(canal(z)) === attendu[noms[z]]);
  const paires = []; for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) paires.push([a, b]);
  paires.forEach(([a, b]) => { const n = comptes([...canal(a), ...canal(b)]), tout = !(a === 0 && b === 1); ok('I9 fronts ' + noms[a] + '+' + noms[b] + ' : leurs 8 maisons ' + (tout ? 'déterminent tout le thème' : 'ne déterminent pas tout le thème (32 768 configurations)'), tout ? n === 65536 : n === 32768); });
}
// I10 — Lois internes à chaque front : toutes les lois entre niveaux des 4 maisons d'un même canal (parité du nombre de niveaux non saturés des résultantes)
{
  const e = (m, l) => 1 << (4 * m + l), Mm = {}; for (let m = 1; m <= 4; m++) Mm[m] = [0, 1, 2, 3].map(l => e(m - 1, l)); for (let l = 0; l < 4; l++) Mm[5 + l] = [0, 1, 2, 3].map(m => e(m, l));
  const ad = (a, b) => a.map((x, i) => x ^ b[i]); Mm[9] = ad(Mm[1], Mm[2]); Mm[10] = ad(Mm[3], Mm[4]); Mm[11] = ad(Mm[5], Mm[6]); Mm[12] = ad(Mm[7], Mm[8]); Mm[13] = ad(Mm[9], Mm[10]); Mm[14] = ad(Mm[11], Mm[12]); Mm[15] = ad(Mm[13], Mm[14]); Mm[16] = ad(Mm[15], Mm[1]);
  const attendu = [7, 15, 15, 7]; let total = 0;
  for (let z = 0; z < 4; z++) { const hs = [z + 1, z + 5, z + 9, z + 13], vars = []; hs.forEach(h => { for (let l = 0; l < 4; l++) vars.push({ h, l, f: Mm[h][l], r: P(h)[l] === 1 ? 1 : 0 }); });
    const lois = []; for (let m = 1; m < 65536; m++) { let x = 0, c = 0; for (let i = 0; i < 16; i++) if (m >> i & 1) { x ^= vars[i].f; c ^= vars[i].r; } if (x === 0) lois.push({ m, c }); }
    const bon = lois.every(({ m, c }) => themes.every(r => (vars.filter((_, i) => m >> i & 1).filter(v => !sat(r[v.h], v.l)).length % 2) === c));
    ok('I10 front ' + 'ABCD'[z] + ' : ' + lois.length + ' lois internes (' + Math.log2(lois.length + 1) + ' indépendantes), toutes vérifiées', lois.length === attendu[z] && bon); total += lois.length; }
  ok('I10 le Juge M15 a toujours un nombre pair de niveaux non saturés (une loi interne du front C) : le Juge est toujours pair', themes.every(r => [0, 1, 2, 3].filter(l => !sat(r[15], l)).length % 2 === 0) && bases.every(b => P(b[15]).filter(x => x === 1).length % 2 === 0));
}
// I11 — Couche des fronts : les fronts des 16 maisons ne prennent que 4 096 configurations ; M5 et M6 sont les transposées de M1 et M2 ; chaque maison est la somme (loi de Klein) de ses constituantes
{
  const front = n => (n - 1) % 4, vu = new Set(); bases.forEach(b => vu.add(b.slice(1).map(front).join('')));
  ok('I11 les fronts des 16 maisons ne prennent que 4 096 configurations sur les 65 536 thèmes (chacune apparaît 16 fois)', vu.size === 4096);
  const kl = (x, y) => front(add(x + 1, y + 1));    // somme de deux fronts dans le groupe de Klein : A+B=C, A+C=B, A+D=A, B+C=A, B+D=B, C+D=C, X+X=D
  const construction = [[9, 1, 2], [10, 3, 4], [11, 5, 6], [12, 7, 8], [13, 9, 10], [14, 11, 12], [15, 13, 14], [16, 15, 1]];
  ok('I11 front(M9) = front(M1)+front(M2), …, front(M16) = front(M15)+front(M1) (somme de Klein)', bases.every(b => construction.every(([c, x, y]) => front(b[c]) === kl(front(b[x]), front(b[y])))));
  ok('I11 le front de M5 est la transposée de ceux de M1 et M2 : Feu(M5) = Feu(M1), Air(M5) = Feu(M2) ; le front de M6 : Feu(M6) = Air(M1), Air(M6) = Air(M2)', bases.every(b => P(b[5])[0] === P(b[1])[0] && P(b[5])[1] === P(b[2])[0] && P(b[6])[0] === P(b[1])[1] && P(b[6])[1] === P(b[2])[1]));
}

// I12 — Le miroir (n ↔ n+8) est l'inversion du niveau Terre ; l'antagoniste (n−3) et le miroir commutent ; mêmes résultantes pour deux maisons miroir
{
  const mir = n => ((n + 7) % 16) + 1, antag = n => ((n - 4) % 16 + 16) % 16 + 1, R = h => add(antag(h), h);
  ok('I12 chaque figure + son miroir = Tristitia : le miroir ne change que le niveau Terre (Feu, Air, Eau identiques)', F.every(f => add(f.num, mir(f.num)) === 8 && [0, 1, 2].every(l => P(mir(f.num))[l] === P(f.num)[l]) && P(mir(f.num))[3] !== P(f.num)[3]));
  ok('I12 l\'antagoniste du miroir est le miroir de l\'antagoniste ; figure + miroir de son antagoniste ∈ {Caput, Via, Fortuna Minor, Conjunctio, Cauda Draconis}', F.every(f => antag(mir(f.num)) === mir(antag(f.num))) && JSON.stringify([...new Set(F.map(f => add(f.num, mir(antag(f.num)))))].sort((a, b) => a - b)) === '[3,5,9,11,13]');
  ok('I12 deux maisons miroir ont la même résultante quand elles portent leurs antagonistes : R(h) = R(h+8) pour h = 1 à 8', [1, 2, 3, 4, 5, 6, 7, 8].every(h => R(h) === R(h + 8)));
  ok('I12 M8 est la seule maison dont la résultante (antagoniste dans sa maison) est l\'antagoniste de sa maison miroir', F.filter(f => R(f.num) === antag(mir(f.num))).map(f => f.num).join() === '8');
}
// I13 — Placements de l'antagoniste : quels ensembles de maisons peuvent porter ensemble leur antagoniste ? (deux lectures)
//   « attaquant » : la maison h porte en base la figure h−3 (l'antagoniste ancré chez la victime) ; « victime » : la maison h porte en base la figure h+3 (la figure chez son antagoniste, enMaisonAntagoniste du moteur)
const placements = {};
{
  const lectures = { attaquant: h => ((h - 4) % 16 + 16) % 16 + 1, victime: h => ((h + 2) % 16) + 1 }, attendu = { attaquant: [841, 6], victime: [638, 7] };
  for (const nom of Object.keys(lectures)) {
    const cible = lectures[nom], observes = new Set(), distribution = {};
    for (const b of bases) { let m = 0, k = 0; for (let h = 1; h <= 16; h++) if (b[h] === cible(h)) { m |= 1 << (h - 1); k++; } observes.add(m); distribution[k] = (distribution[k] || 0) + 1; }
    const faisables = new Set(); observes.forEach(m => { for (let t = m; ; t = (t - 1) & m) { faisables.add(t); if (t === 0) break; } });
    const maxK = Math.max(...[...observes].map(m => m.toString(2).split('1').length - 1));
    ok('I13 (' + nom + ') exactement ' + attendu[nom][0] + ' ensembles de maisons peuvent porter ensemble leur antagoniste, au plus ' + attendu[nom][1] + ' à la fois', faisables.size === attendu[nom][0] && maxK === attendu[nom][1], 'répartition du nombre de placements par thème : ' + JSON.stringify(distribution));
    const impossibles = []; for (let m = 1; m < 65536; m++) { if (faisables.has(m)) continue; let minimal = true; for (let h = 0; h < 16 && minimal; h++) if ((m >> h & 1) && !faisables.has(m & ~(1 << h))) minimal = false; if (minimal) impossibles.push(m); }
    placements[nom] = impossibles.map(m => { const o = []; for (let h = 0; h < 16; h++) if (m >> h & 1) o.push(h + 1); return o; });
  }
  ok('I13 (victime) M15 ne peut jamais porter la figure h+3 (Laetitia, impaire) : le Juge est toujours pair', placements.victime.some(x => x.length === 1 && x[0] === 15) && placements.victime.filter(x => x.length === 1).length === 1);
  ok('I13 les ensembles impossibles minimaux sont 26 couples + 23 triples + 16 quadruplets + 6 quintuplets (attaquant)', [2, 3, 4, 5].map(k => placements.attaquant.filter(x => x.length === k).length).join() === '26,23,16,6');
}

// I14 — Le binôme et le miroir sont des translations par des figures constantes
{
  const bin = n => ((n - 1) % 4 < 2) ? n + 2 : n - 2, mir = n => ((n + 7) % 16) + 1;
  ok('I14 miroir(n) = n + Tristitia ; binôme(n) = n + Amissio pour les blocs M1-4 et M9-12, n + Puella pour M5-8 et M13-16 ; Puella = Amissio + Tristitia ; binôme et miroir commutent',
    F.every(f => mir(f.num) === add(f.num, 8) && bin(f.num) === add(f.num, Math.floor((f.num - 1) / 4) % 2 === 0 ? 6 : 14) && bin(mir(f.num)) === mir(bin(f.num))) && add(6, 8) === 14);
}
{
  const bin = n => ((n - 1) % 4 < 2) ? n + 2 : n - 2, mir = n => ((n + 7) % 16) + 1, antag = n => ((n - 4) % 16 + 16) % 16 + 1, R = h => add(antag(h), h);
  ok('I14 antagonistes en place : les résultantes de deux maisons binômes des fronts A et C (maisons impaires) sont miroir l\'une de l\'autre ; jamais pour les fronts B et D', [1, 3, 5, 7, 9, 11, 13, 15].every(h => R(bin(h)) === mir(R(h))) && [2, 4, 6, 8, 10, 12, 14, 16].every(h => R(bin(h)) !== mir(R(h))));
}
// I15 — Les quartets : orbites des maisons sous le binôme et le miroir
const QUARTETS = [[1, 3, 9, 11], [2, 4, 10, 12], [5, 7, 13, 15], [6, 8, 14, 16]];
{
  const comptes = hs => { const vu = new Set(); for (const t of bases) vu.add(hs.map(h => t[h]).join()); return vu.size; };
  ok('I15 les quartets {M1,M3,M9,M11}, {M2,M4,M10,M12}, {M5,M7,M13,M15}, {M6,M8,M14,M16} : somme de leurs figures de repos = Populus', QUARTETS.every(q => q.reduce((a, h) => add(a, h), 16) === 16));
  ok('I15 les 4 bases d\'un quartet ne prennent que 8 192 configurations (1/8) ; deux quartets quelconques déterminent tout le thème', QUARTETS.every(q => comptes(q) === 8192) && QUARTETS.every((q, i) => QUARTETS.every((r, j) => j <= i || comptes([...q, ...r]) === 65536)));
  const e = (m, l) => 1 << (4 * m + l), Mm = {}; for (let m = 1; m <= 4; m++) Mm[m] = [0, 1, 2, 3].map(l => e(m - 1, l)); for (let l = 0; l < 4; l++) Mm[5 + l] = [0, 1, 2, 3].map(m => e(m, l));
  const ad = (a, b) => a.map((x, i) => x ^ b[i]); Mm[9] = ad(Mm[1], Mm[2]); Mm[10] = ad(Mm[3], Mm[4]); Mm[11] = ad(Mm[5], Mm[6]); Mm[12] = ad(Mm[7], Mm[8]); Mm[13] = ad(Mm[9], Mm[10]); Mm[14] = ad(Mm[11], Mm[12]); Mm[15] = ad(Mm[13], Mm[14]); Mm[16] = ad(Mm[15], Mm[1]);
  QUARTETS.forEach((q, i) => { const vars = []; q.forEach(h => { for (let l = 0; l < 4; l++) vars.push({ h, l, f: Mm[h][l], r: P(h)[l] === 1 ? 1 : 0 }); });
    const lois = []; for (let m = 1; m < 65536; m++) { let x = 0, c = 0; for (let k = 0; k < 16; k++) if (m >> k & 1) { x ^= vars[k].f; c ^= vars[k].r; } if (x === 0) lois.push({ m, c }); }
    ok('I15 quartet ' + (i + 1) + ' (M' + q.join(', M') + ') : 7 lois internes (3 indépendantes), toutes vérifiées', lois.length === 7 && lois.every(({ m, c }) => themes.every(r => (vars.filter((_, k) => m >> k & 1).filter(v => !sat(r[v.h], v.l)).length % 2) === c))); });
}
// I16 — Placements du binôme ou du miroir dans la maison : quels ensembles de maisons peuvent les porter ensemble ?
const placements2 = {};
{
  const bin = n => ((n - 1) % 4 < 2) ? n + 2 : n - 2, mir = n => ((n + 7) % 16) + 1;
  const lectures = { binome: [h => bin(h), [380, 5, { 1: 1, 2: 32, 3: 8, 4: 13, 5: 1 }]], miroir: [h => mir(h), [568, 6, { 1: 1, 2: 24, 3: 11, 4: 7, 5: 3 }]] };
  for (const nom of Object.keys(lectures)) {
    const [cible, [nbFais, maxAtt, minAtt]] = lectures[nom], observes = new Set(), distribution = {};
    for (const b of bases) { let m = 0, k = 0; for (let h = 1; h <= 16; h++) if (b[h] === cible(h)) { m |= 1 << (h - 1); k++; } observes.add(m); distribution[k] = (distribution[k] || 0) + 1; }
    const faisables = new Set(); observes.forEach(m => { for (let t = m; ; t = (t - 1) & m) { faisables.add(t); if (t === 0) break; } });
    const maxK = Math.max(...[...observes].map(m => m.toString(2).split('1').length - 1));
    const imp = []; for (let m = 1; m < 65536; m++) { if (faisables.has(m)) continue; let minimal = true; for (let h = 0; h < 16 && minimal; h++) if ((m >> h & 1) && !faisables.has(m & ~(1 << h))) minimal = false; if (minimal) imp.push(m); }
    const tailles = {}; imp.forEach(m => { const k = m.toString(2).split('1').length - 1; tailles[k] = (tailles[k] || 0) + 1; });
    placements2[nom] = imp.map(m => { const o = []; for (let h = 0; h < 16; h++) if (m >> h & 1) o.push(h + 1); return o; });
    ok('I16 (' + nom + ') exactement ' + nbFais + ' ensembles de maisons peuvent porter ensemble ' + (nom === 'binome' ? 'leur binôme' : 'leur miroir') + ', au plus ' + maxAtt + ' à la fois ; seule M15 ne peut jamais le faire seule (le Juge est toujours pair)',
      faisables.size === nbFais && maxK === maxAtt && JSON.stringify(tailles) === JSON.stringify(minAtt) && placements2[nom].filter(x => x.length === 1).map(x => x[0]).join() === '15', 'répartition : ' + JSON.stringify(distribution));
  }
}

// I17 — Le cycle d'attaque (h attaque h+3) et les quatre axes de quatre attaquants consécutifs, dont l'axe angulaire M1, M4, M7, M10
const AXES = [[1, 4, 7, 10], [13, 16, 3, 6], [9, 12, 15, 2], [5, 8, 11, 14]];
{
  const cycle = []; let h = 1; for (let i = 0; i < 16; i++) { cycle.push(h); h = ((h + 2) % 16) + 1; }
  ok('I17 l\'attaque h → h+3 est un seul cycle de 16 maisons ; il se découpe en 4 axes de 4 attaquants consécutifs : {M1,M4,M7,M10}, {M13,M16,M3,M6}, {M9,M12,M15,M2}, {M5,M8,M11,M14}', new Set(cycle).size === 16 && AXES.every((a, i) => a.join() === cycle.slice(4 * i, 4 * i + 4).join()));
  ok('I17 chaque axe contient une maison de chaque front, toujours dans l\'ordre A, D, C, B (le cercle des fronts)', AXES.every(a => a.map(x => 'ABCD'[(x - 1) % 4]).join('') === 'ADCB'));
  const comptes = hs => { const vu = new Set(); for (const t of bases) vu.add(hs.map(x => t[x]).join()); return vu.size; };
  ok('I17 les 4 bases d\'un axe prennent 8 192, 16 384, 8 192 et 65 536 configurations (axes 1 à 4) ; somme des figures de repos : Albus, Fortuna Major, Albus, Fortuna Major', JSON.stringify(AXES.map(comptes)) === '[8192,16384,8192,65536]' && JSON.stringify(AXES.map(a => a.reduce((x, y) => add(x, y), 16))) === '[4,12,4,12]');
}
// I18 — La somme de l'axe angulaire S = M1+M4+M7+M10
{
  const somme = (t, hs) => hs.reduce((x, h) => add(x, t[h]), 16), egalNiveau = l => bases.filter(t => P(somme(t, [1, 4, 7, 10]))[l] === P(t[1])[l]).length;
  ok('I18 S = M1+M4+M7+M10 est toujours égale à M1+M3+M7 (M10 = M3+M4)', bases.every(t => somme(t, [1, 4, 7, 10]) === somme(t, [1, 3, 7])));
  ok('I18 le niveau Eau de S est toujours celui de M1 ; Feu, Air et Terre le sont dans exactement la moitié des thèmes', egalNiveau(2) === 65536 && [0, 1, 3].every(l => egalNiveau(l) === 32768));
  const bitBase = (t, a, l) => P(somme(t, AXES[a]))[l] === 1 ? 1 : 0;
  ok('I18 les 4 sommes d\'axe n\'ont qu\'une seule loi entre leurs 16 niveaux : parité paire du nombre de niveaux Feu, Air et Terre à un point des sommes des axes 2, 3 et 4', bases.every(t => [1, 2, 3].reduce((x, a) => x ^ bitBase(t, a, 0) ^ bitBase(t, a, 1) ^ bitBase(t, a, 3), 0) === 0));
  // validation FI-5 sans le jour : binôme de M1, somme de l'axe, somme 3-5-11-15
  const bin = n => ((n - 1) % 4 < 2) ? n + 2 : n - 2, ANG = [1, 4, 7, 10], cnt = {}; let valides = 0;
  themes.forEach((r, i) => { const t = bases[i], angPres = new Set(); ANG.forEach(h => { angPres.add(t[h]); angPres.add(r[h]); }); const tous = new Set(); for (let h = 1; h <= 16; h++) { tous.add(t[h]); tous.add(r[h]); }
    const c1 = angPres.has(bin(t[1])), c2 = angPres.has(somme(t, [1, 4, 7, 10])), c3 = tous.has(somme(t, [3, 5, 11, 15])); const k = (c1 ? '1' : '-') + (c2 ? '2' : '-') + (c3 ? '3' : '-'); cnt[k] = (cnt[k] || 0) + 1; });
  let moteur = 0; for (let q = 0; q < 65536; q++) { const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1); if (K.fiabilite(K.lire(K.construireTheme(...m.map(K.fig)))).valide) moteur++; }
  ok('I18 validation FI-5 sans le jour : les 8 combinaisons des 3 critères existent toutes ; 8 785 thèmes les remplissent tous (le moteur compte aussi 8 785)', Object.keys(cnt).length === 8 && cnt['123'] === 8785 && moteur === 8785, JSON.stringify(cnt));
}
// I19 — Les maisons angulaires M1, M4, M7, M10 : degrés de liberté et lois internes
{
  const comptes = new Set(); for (const t of bases) comptes.add([1, 4, 7, 10].map(h => t[h]).join());
  ok('I19 les 4 bases des maisons angulaires ne prennent que 8 192 configurations (1/8)', comptes.size === 8192);
  ok('I19 lois internes (résultantes) : M1 Eau et M7 Feu saturés ensemble ; M4 Eau et M7 Terre toujours opposés ; M4 Eau + M7 Eau + M10 Eau : nombre impair de niveaux non saturés', themes.every(r => sat(r[1], 2) === sat(r[7], 0) && sat(r[4], 2) !== sat(r[7], 3) && ([4, 7, 10].filter(h => !sat(r[h], 2)).length % 2) === 1));
}

// I20 — Les sommes des quatre axes s'écrivent avec peu de maisons
{
  const S = (t, a) => AXES[a].reduce((x, h) => add(x, t[h]), 16), M = (t, ...hs) => hs.reduce((x, h) => add(x, t[h]), 16);
  const egalites = [['S1 = M1+M3+M7', t => S(t, 0) === M(t, 1, 3, 7)], ['S3 = M12+M16', t => S(t, 2) === M(t, 12, 16)], ['S4 = M5+M7', t => S(t, 3) === M(t, 5, 7)], ['S1+S2 = M5+M8', t => add(S(t, 0), S(t, 1)) === M(t, 5, 8)],
    ['S1+S3 = M3+M8+M15', t => add(S(t, 0), S(t, 2)) === M(t, 3, 8, 15)], ['S1+S4 = M1+M3+M5', t => add(S(t, 0), S(t, 3)) === M(t, 1, 3, 5)], ['S2+S3 = M3+M5+M15', t => add(S(t, 1), S(t, 2)) === M(t, 3, 5, 15)],
    ['S2+S4 = M1+M3+M8', t => add(S(t, 1), S(t, 3)) === M(t, 1, 3, 8)], ['S3+S4 = M5+M8+M16', t => add(S(t, 2), S(t, 3)) === M(t, 5, 8, 16)]];
  egalites.forEach(([nom, f]) => ok('I20 ' + nom + ' (S1 = M1+M4+M7+M10, S2 = M13+M16+M3+M6, S3 = M9+M12+M15+M2, S4 = M5+M8+M11+M14)', bases.every(f)));
  ok('I20 la somme des 15 premières maisons est toujours Populus (M1+…+M15 = 0, donc la somme des 16 = M16)', bases.every(t => M(t, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15) === 16));
  ok('I20 somme des résultantes d\'un axe = somme de ses bases + (Albus pour les axes 1 et 3, Fortuna Major pour les axes 2 et 4)', themes.every((r, i) => AXES.every((a, k) => a.reduce((x, h) => add(x, r[h]), 16) === add(S(bases[i], k), [4, 12, 4, 12][k]))));
  const e = (m, l) => 1 << (4 * m + l), Mm = {}; for (let m = 1; m <= 4; m++) Mm[m] = [0, 1, 2, 3].map(l => e(m - 1, l)); for (let l = 0; l < 4; l++) Mm[5 + l] = [0, 1, 2, 3].map(m => e(m, l));
  const ad = (a, b) => a.map((x, i) => x ^ b[i]); Mm[9] = ad(Mm[1], Mm[2]); Mm[10] = ad(Mm[3], Mm[4]); Mm[11] = ad(Mm[5], Mm[6]); Mm[12] = ad(Mm[7], Mm[8]); Mm[13] = ad(Mm[9], Mm[10]); Mm[14] = ad(Mm[11], Mm[12]); Mm[15] = ad(Mm[13], Mm[14]); Mm[16] = ad(Mm[15], Mm[1]);
  const forme = hs => [0, 1, 2, 3].map(l => hs.reduce((x, h) => x ^ Mm[h][l], 0)); let trouve = false;
  for (let m = 1; m < 65536 && !trouve; m++) { if (m.toString(2).split('1').length - 1 > 3) continue; const hs = []; for (let h = 0; h < 16; h++) if (m >> h & 1) hs.push(h + 1); if (forme(hs).every((v, l) => v === forme(AXES[1])[l])) trouve = true; }
  ok('I20 S2 n\'est la somme d\'aucun ensemble de 3 maisons ou moins', !trouve);
  // I21 — Lois internes des axes 2, 3 et 4
  [[1, 3, 14], [2, 7, 13], [3, 0, 0]].forEach(([k, attendu, rang]) => { const a = AXES[k], vars = []; a.forEach(h => { for (let l = 0; l < 4; l++) vars.push({ h, l, f: Mm[h][l], r: P(h)[l] === 1 ? 1 : 0 }); });
    const lois = []; for (let m = 1; m < 65536; m++) { let x = 0, c = 0; for (let q = 0; q < 16; q++) if (m >> q & 1) { x ^= vars[q].f; c ^= vars[q].r; } if (x === 0) lois.push({ m, c }); }
    ok('I21 axe ' + (k + 1) + ' (M' + a.join(', M') + ') : ' + lois.length + ' lois internes' + (lois.length ? ', toutes vérifiées' : ' : ses 4 maisons sont libres et déterminent tout le thème'), lois.length === attendu && lois.every(({ m, c }) => themes.every(r => (vars.filter((_, q) => m >> q & 1).filter(v => !sat(r[v.h], v.l)).length % 2) === c))); });
  // I22 — La somme d'un axe est-elle présente dans les maisons de cet axe ?
  const pres = AXES.map((a, k) => bases.filter((t, i) => { const Sx = S(t, k), r = themes[i]; return a.some(h => t[h] === Sx || r[h] === Sx); }).length);
  ok('I22 somme d\'axe présente dans les maisons de son axe (base ou résultante) : 32 608 · 24 376 · 27 232 · 27 120 thèmes (axes 1 à 4)', JSON.stringify(pres) === '[32608,24376,27232,27120]');
  const vu = new Map(); bases.forEach(t => { const k = [0, 1, 2, 3].map(q => S(t, q)).join(); vu.set(k, (vu.get(k) || 0) + 1); });
  ok('I22 le quadruplet (S1, S2, S3, S4) prend 32 768 valeurs, chacune exactement pour 2 thèmes', vu.size === 32768 && [...vu.values()].every(v => v === 2));
}

// I23 — Rubeus (7, 2122 : seul l'Air est à un point) dans toutes les maisons
const rubeus = {};
{
  const RUB = 7, bitR = l => P(RUB)[l] === 1 ? 1 : 0, nb = {};
  const par = h => bases.filter(t => t[h] === RUB).length, parR = h => themes.filter(r => r[h] === RUB).length;
  ok('I23 Rubeus est en base de chaque maison dans exactement 4 096 thèmes (1/16), sauf M15 où il n\'est jamais (Rubeus est impair, le Juge est toujours pair) ; même chose pour la résultante', [...Array(16).keys()].every(i => par(i + 1) === (i + 1 === 15 ? 0 : 4096) && parR(i + 1) === (i + 1 === 15 ? 0 : 4096)));
  let absent = 0, maxB = 0, maxR = 0, maxT = 0; themes.forEach((r, i) => { const t = bases[i]; let b = 0, c = 0; for (let h = 1; h <= 16; h++) { if (t[h] === RUB) b++; if (r[h] === RUB) c++; } if (b + c === 0) absent++; maxB = Math.max(maxB, b); maxR = Math.max(maxR, c); maxT = Math.max(maxT, b + c); });
  ok('I23 Rubeus est absent du thème (ni en base ni en résultante) dans 8 764 thèmes sur 65 536 ; au plus 7 en base (6 thèmes), 5 en résultante, 9 au total', absent === 8764 && maxB === 7 && maxR === 5 && maxT === 9);
  ok('I23 résultante de Rubeus en M7 : Populus ; en M16 : Rubeus ; en M14 : Via (aucun niveau saturé) ; en M10 : Puer', add(RUB, 7) === 16 && add(RUB, 16) === 7 && add(RUB, 14) === 5 && add(RUB, 10) === 1);
  // ce que Rubeus en base de la maison h impose dans tous les thèmes : niveaux constants ailleurs
  const attendu = {}; const bitDe = (h, l) => (t) => P(t[h])[l] === 1 ? 1 : 0;
  for (let h = 1; h <= 16; h++) { if (h === 15) continue; const cons = []; const sel = bases.filter(t => t[h] === RUB);
    for (let h2 = 1; h2 <= 16; h2++) if (h2 !== h) for (let l = 0; l < 4; l++) { const v0 = P(sel[0][h2])[l] === 1 ? 1 : 0; if (sel.every(t => (P(t[h2])[l] === 1 ? 1 : 0) === v0)) cons.push(h2 + ':' + l + '=' + v0); }
    attendu[h] = cons.sort().join(' '); }
  const att = {};
  for (let k = 1; k <= 4; k++) { const l = k - 1, c = []; for (let j = 0; j < 4; j++) c.push((5 + j) + ':' + l + '=' + bitR(j)); c.push('11:' + l + '=' + (bitR(0) ^ bitR(1)), '12:' + l + '=' + (bitR(2) ^ bitR(3)), '14:' + l + '=' + (bitR(0) ^ bitR(1) ^ bitR(2) ^ bitR(3))); att[k] = c.sort().join(' ');
    const l2 = k - 1, d = []; for (let j = 0; j < 4; j++) d.push((1 + j) + ':' + l2 + '=' + bitR(j)); d.push('9:' + l2 + '=' + (bitR(0) ^ bitR(1)), '10:' + l2 + '=' + (bitR(2) ^ bitR(3)), '13:' + l2 + '=' + (bitR(0) ^ bitR(1) ^ bitR(2) ^ bitR(3))); att[4 + k] = d.sort().join(' '); }
  for (let h = 9; h <= 14; h++) att[h] = ''; att[16] = '14:0=1';
  ok('I23 Rubeus en base de M1 à M4 (ou M5 à M8) impose 7 niveaux ailleurs : le niveau k des filles (ou des mères) reproduit Rubeus, et M11, M12, M14 (ou M9, M10, M13) en découlent ; en M16 : M14 Feu à un point ; en M9 à M14 : rien', Object.keys(att).every(h => attendu[h] === att[h]));
  rubeus.attendu = attendu;
  // familles de maisons portant Rubeus ensemble
  const famille = (nom, cible, nbFais, maxK, mins) => { const observes = new Set(); for (let i = 0; i < 65536; i++) { let m = 0; for (let h = 1; h <= 16; h++) if (cible(bases[i], themes[i], h)) m |= 1 << (h - 1); observes.add(m); }
    const fais = new Set(); observes.forEach(m => { for (let t = m; ; t = (t - 1) & m) { fais.add(t); if (t === 0) break; } });
    const imp = []; for (let m = 1; m < 65536; m++) { if (fais.has(m)) continue; let mn = true; for (let h = 0; h < 16 && mn; h++) if ((m >> h & 1) && !fais.has(m & ~(1 << h))) mn = false; if (mn) imp.push(m); }
    const tail = {}; imp.forEach(m => { const k = m.toString(2).split('1').length - 1; tail[k] = (tail[k] || 0) + 1; });
    const mx = Math.max(...[...observes].map(m => m.toString(2).split('1').length - 1));
    ok('I23 ' + nom + ' : ' + nbFais + ' ensembles de maisons possibles, au plus ' + maxK + ', impossibles minimaux ' + JSON.stringify(mins).replace(/"/g, ''), fais.size === nbFais && mx === maxK && JSON.stringify(tail) === JSON.stringify(mins)); rubeus[nom] = imp.map(m => { const o = []; for (let h = 0; h < 16; h++) if (m >> h & 1) o.push(h + 1); return o; }); };
  famille('Rubeus en base de plusieurs maisons', (t, r, h) => t[h] === RUB, 593, 7, { 1: 1, 2: 25, 3: 13, 4: 10, 5: 4 });
  famille('Rubeus en résultante de plusieurs maisons', (t, r, h) => r[h] === RUB, 317, 5, { 1: 1, 2: 34, 3: 14, 4: 7, 5: 3 });
}

// I24 — Le quartet de figures {Via, Rubeus, Cauda Draconis, Aquisitio} dans les maisons, et Rubeus comme pôle (R1 = maison du numéro de la figure de M1, R7 = R1 + 6)
{
  const Q = [5, 7, 13, 15], air = r => P(r)[1] === 2, feuEau = r => (P(r)[0] === 2) !== (P(r)[2] === 2);
  ok('I24 Via, Rubeus, Cauda, Aquisitio (5, 7, 13, 15) sont les figures à Air à un point et Feu = Eau ; dans chaque maison leurs quatre résultantes ont toutes le même état de l\'Air et le même rapport Feu/Eau', Q.every(f => P(f)[1] === 1 && P(f)[0] === P(f)[2]) && F.filter(f => f.niveaux[1] === 1 && f.niveaux[0] === f.niveaux[2]).length === 4
    && [...Array(16).keys()].every(i => { const h = i + 1, rs = Q.map(f => add(f, h)); return rs.every(r => air(r) === air(rs[0]) && feuEau(r) === feuEau(rs[0])); }));
  ok('I24 dans toutes les maisons paires (canaux Air et Terre, dont M6 et M12), ces quatre figures ont leur Air non saturé ; en M12 leurs résultantes sont Caput, Conjunctio, Puer, Fortuna Minor (Air non saturé, un seul de Feu et Eau saturé)',
    [2, 4, 6, 8, 10, 12, 14, 16].every(h => Q.every(f => !air(add(f, h)))) && JSON.stringify(Q.map(f => add(f, 12))) === '[9,3,1,11]');
  // pôles : niveaux imposés par M1
  const R7de = n => ((n + 5) % 16) + 1, avec = n => bases.filter(t => t[1] === n);
  ok('I24 si M1 = Amissio (pôles en M6 et M12), R1 a toujours son Feu à deux points et R7 à un point : les deux pôles ne sont jamais du même front', avec(6).every(t => P(t[6])[0] === 2 && P(t[12])[0] === 1));
  const parR1 = {}, parR7 = {}; bases.forEach(t => { const h1 = t[1], h7 = R7de(h1); if (t[h1] === 7) parR1[h1] = (parR1[h1] || 0) + 1; if (t[h7] === 7) parR7[h7] = (parR7[h7] || 0) + 1; });
  ok('I24 Rubeus peut être le pôle R1 dans 9 maisons (M2, M3, M4, M6, M7, M9, M10, M12, M13) et le pôle R7 dans 11 (M2 à M11 et M13) : jamais R7 en M12', JSON.stringify(Object.keys(parR1).map(Number).sort((a, b) => a - b)) === '[2,3,4,6,7,9,10,12,13]' && JSON.stringify(Object.keys(parR7).map(Number).sort((a, b) => a - b)) === '[2,3,4,5,6,7,8,9,10,11,13]' && !parR7[12], 'R1 : ' + JSON.stringify(parR1) + ' ; R7 : ' + JSON.stringify(parR7));
}

let mauvais = 0; verifs.forEach(([n, c, d]) => { if (!c) mauvais++; console.log((c ? 'OK     ' : 'ÉCHEC  ') + n + (d ? ' — ' + d : '')); });
if (process.argv.includes('--liste')) { for (const nom of Object.keys(rubeus)) if (Array.isArray(rubeus[nom])) { console.log('\\nEnsembles de maisons impossibles ensemble (' + nom + ') :'); [2, 3, 4, 5].forEach(k => console.log('  ' + k + ' maisons : ' + rubeus[nom].filter(x => x.length === k).map(x => 'M' + x.join('+M')).join(' | '))); } for (const nom of Object.keys(placements2)) { console.log('\\nEnsembles de maisons impossibles ensemble (' + nom + ') :'); [2, 3, 4, 5].forEach(k => console.log('  ' + k + ' maisons : ' + placements2[nom].filter(x => x.length === k).map(x => 'M' + x.join('+M')).join(' | '))); }
  for (const nom of Object.keys(placements)) { console.log('\\nEnsembles de maisons impossibles ensemble (' + nom + ') :'); [2, 3, 4, 5].forEach(k => console.log('  ' + k + ' maisons : ' + placements[nom].filter(x => x.length === k).map(x => 'M' + x.join('+M')).join(' | '))); } console.log('\nEnsembles générateurs :'); generateurs.forEach(g => console.log('  M' + g.join(', M'))); }
console.log('\nLes 14 couples de liaisons jamais connectées ensemble :'); excl.forEach(([a, b]) => console.log('  ' + a + '  ✕  ' + b));
console.log(mauvais ? '\n' + mauvais + ' échec(s)' : '\nToutes les propriétés sont vérifiées sur les 65 536 thèmes (' + verifs.length + ').'); process.exit(mauvais ? 1 : 0);
