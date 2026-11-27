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
