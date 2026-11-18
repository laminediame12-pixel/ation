// Lit un thème avec le moteur 3 : node outils/lire_theme.js 12 6 3 2   (numéros des figures de M1 à M4)
const K = require('../moteur3/moteur.js');
const m = process.argv.slice(2).map(Number);
if (m.length !== 4 || m.some(x => !(x >= 1 && x <= 16))) { console.log('Usage : node outils/lire_theme.js M1 M2 M3 M4 (numéros 1 à 16)'); process.exit(1); }
const r = K.analyser(K.construireTheme(...m.map(K.fig))), L = r.lecture, v = r.verdict, b = r.buts, p = r.penalite;
console.log('Mères :', m.map(x => x + ' ' + K.fig(x)).join(' | '));
console.log('R1 : M' + L.R1.maison, L.R1.figure, '| R7 : M' + L.R7.maison, L.R7.figure, '|', L.mode);
console.log('Verdict :', v.verdict === 'N' ? 'nul' : v.verdict === '1' ? 'victoire R1' : v.verdict === '2' ? 'victoire R7' : 'aucun', '·', v.principe, '(' + v.provenance + ')');
console.log(v.raison);
console.log('Score prévu', b.score, '| deux marquent', b.deuxMarquent.oui ? 'oui' : 'non', '| Over 1,5 / 2,5 / 3,5 :', [b.overUnder.over15, b.overUnder.over25, b.overUnder.over35].map(x => x ? 'Over' : 'Under').join(' / '));
console.log('Buts MT-1 :', b.butsMT1.libelle, '| corners :', b.corners.libelle, '| pénalité / carton :', p.libelle);
