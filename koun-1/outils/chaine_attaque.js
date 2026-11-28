// Chaîne d'attaque du propriétaire (2026-11-27) et les deux thèmes de repos : contrôle que le moteur l'applique partout de la même façon.
//   « M1 attaque avec M5 et M2 attaque M5 … M16 attaque avec M4 et M1 attaque M4 » : Mh attaque avec M(h+4), et M(h+1) attaque M(h+4), sur les 16 maisons.
//   Thème de repos Populus (16-16-16-16) : chaque maison rend sa figure intacte (résultante = figure de la maison).
//   Thème de repos saturé (chaque figure chez elle) : chaque résultante est Populus ; il ne vient pas de quatre mères, on le pose directement.
// Usage : node outils/chaine_attaque.js
const M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
console.log('1. La chaîne sur les 16 maisons (h attaque avec h + 4 ; h + 1 attaque h + 4, donc k attaque k + 3)');
let ok = 0; for (let h = 1; h <= 16; h++) { const arme = mod(h + 4), att = mod(h + 1); if (mod(att + 3) === arme) ok++;
  console.log('   M' + h + ' attaque avec M' + arme + ' et M' + att + ' attaque M' + arme + '   (' + N(h) + ' avec ' + N(arme) + ' ; ' + N(att) + ' attaque ' + N(arme) + ')'); }
console.log('   ' + ok + '/16 lignes : l\'attaquant du front direct est g + 1 = (g + 4) − 3\n');
const faux = b => ({ theme: { bases: b } });
for (const [nom, b] of [['thème Populus (toutes les bases Populus)', [null, ...Array(16).fill(16)]], ['thème saturé (chaque figure chez elle)', [null, ...Array.from({ length: 16 }, (_, i) => i + 1)]]]) {
  const bl = []; for (let g = 1; g <= 16; g++) { const x = M.bloqueurs(faux(b), g, b[g] === g ? g : undefined); /* la figure chez elle n'y est pas bloquée */ if (x.length) bl.push(N(g) + ' (par ' + x.map(y => y.type === 'populus' ? (y.figure === 16 ? 'Populus en M16' : N(y.figure) + ' reproduit par Populus en M' + y.maison) : N(y.figure) + ' ' + y.type + ' en M' + y.maison).join(', ') + ')'); }
  console.log('2. ' + nom + ' : ' + bl.length + (bl.length > 1 ? ' figures bloquées' : ' figure bloquée') + ' sur 16' + (bl.length && bl.length < 16 ? ' — ' + bl.join(' ; ') : bl.length ? ' — chacune par son antagoniste reproduit dans sa maison' : '')); }
const L = M.lire([16, 16, 16, 16]), V = M.verdict(L), H = M.hierarchie(L);
console.log('\n3. Verdict du thème Populus : ' + (V.decision.resultat === 'N' ? 'égalité' + (V.decision.type ? ' (' + V.decision.type + ')' : '') : 'victoire ' + V.decision.resultat) + ' · buts ' + H.buts.valeur + ' · R1 ' + N(L.R1.figure) + ' en M' + L.R1.maison + ' ' + H.R1.propre.niveau + ', R7 ' + N(L.R7.figure) + ' en M' + L.R7.maison + ' ' + H.R7.propre.niveau);
console.log('   ' + V.decision.raison.split(' · indice')[0]);

// 4. Précision du propriétaire sur le blocage (2026-11-28) : « Puer comme résultante en M1 bloque Albus uniquement sur les niveaux Feu et Air, en M1, M5 et M2, M6.
//    Chaque front a ses 8 nœuds dans son camp et 8 dans l'autre camp. Mais M16 modifie l'équilibre. »
const NV = ['Feu', 'Air', 'Eau', 'Terre'], lvl = f => K.niveaux(f);
console.log('\n4. Blocs de la grille des nœuds (nœud = maison 4j + i + 1) et camps (boucle A/C : maisons impaires ; B/D : paires)');
[[1, 2, 5, 6], [3, 4, 7, 8], [9, 10, 13, 14], [11, 12, 15, 16]].forEach(q => { const i = [...new Set(q.map(h => (h - 1) % 4))], j = [...new Set(q.map(h => Math.floor((h - 1) / 4)))];
  console.log('   M' + q.join(', M') + ' : ' + i.map(x => NV[x]).join('/') + ' × ' + j.map(x => NV[x]).join('/') + ' · camp A/C M' + q.filter(h => h % 2).join(', M') + ' · camp B/D M' + q.filter(h => h % 2 === 0).join(', M')); });
const nds = M.noeuds(M.lire([16, 16, 16, 16])).fronts[0].noeuds.map(x => x.maison);
console.log('   cartographie : ' + nds.length + ' nœuds par front, ' + nds.filter(h => h % 2).length + ' du camp A/C et ' + nds.filter(h => h % 2 === 0).length + ' du camp B/D — M16 (Terre × Terre) n\'a pas de nœud : il rompt l\'équilibre 8/8');
console.log('   M1, M2, M5, M6 : liaisons horizontales portées par la gauche, verticales par le haut, toutes sur Feu ou Air');
const rang = { 0: [1, 2], 1: [5, 6], 2: [9, 10], 3: [13, 14, 15] };
console.log('   Puer (' + lvl(1).join('') + ', haut du front A, M1) contre Albus (' + lvl(4).join('') + ', haut du front D, M4), liaisons verticales du haut :');
for (let l = 0; l < 4; l++) console.log('     ' + NV[l].padEnd(6) + 'nœuds M' + rang[l].join(', M') + ' : Puer ' + (lvl(1)[l] === 1 ? 'actif' : 'saturé') + ', Albus ' + (lvl(4)[l] === 1 ? 'actif' : 'saturé') + (l < 2 ? '  ← bloc de M1' : l === 3 ? '  (hors du bloc de M1)' : ''));
