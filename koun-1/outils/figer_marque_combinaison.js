// Fige, avant les matchs, la piste du marquage par la combinaison M3+M7+M11 (2026-11-28) sur les matchs à venir de l'archive (28 au 30 novembre).
// Piste (outils/combinaisons_inevitables.js) : la figure-somme des bases de M3, M7 et M11 (même figure que M2+M4+M8+M16 ou M3+M5+M6+M7) désigne un pôle quand
// les quatre maisons du front de sa figure portent en base cette figure ou son protecteur (f − 6), comme la combinaison de deuxième mi-temps. Pôle désigné seul
// (l'autre non) → il marque : 58 sur 63 sur les 126 matchs (contre 136 sur 189 pour les autres pôles), puis 14 sur 15 sur les 34 matchs du 26 et du 27 novembre
// (contre 36 sur 53). Trouvée parmi 30 940 essais : à juger ici. Le fichier écrit n'est jamais réécrit. Usage : node outils/figer_marque_combinaison.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, A = K.additionner;
const SORTIE = path.join(R, 'validation/predictions-marque-combinaison-28-30-novembre.json');
if (fs.existsSync(SORTIE)) { console.log('déjà figé : ' + path.relative(R, SORTIE) + ' (jamais réécrit)'); process.exit(0); }
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, COMBI = [3, 7, 11];
const T = JSON.parse(fs.readFileSync(path.join(R, 'validation/themes-25-30-novembre.json'), 'utf8')).filter(x => x.date >= '2026-11-28');
const matchs = T.map(x => { const m = x.theme.split('-').map(Number), L = M.lire(m), b = L.theme.bases, f = COMBI.map(h => b[h]).reduce(A), pro = mod(f - 6), H = M.hierarchie(L);
  const par = p => { const z = (L[p].figure - 1) % 4; return [0, 1, 2, 3].map(i => z + 4 * i + 1).filter(h => b[h] === f || b[h] === pro); };
  const d1 = par('R1'), d7 = par('R7'), seul = d1.length && !d7.length ? 'R1' : d7.length && !d1.length ? 'R7' : null, ecr = l => l.length ? l.map(h => 'M' + h + ' ' + N(b[h])).join(', ') : null;
  return { date: x.date, championnat: x.championnat, match: x.equipe1 + ' – ' + x.equipe2, theme: x.theme, somme: N(f), protecteur: N(pro),
    designation: { R1: ecr(d1), R7: ecr(d7) }, annonce: seul ? seul + ' marque' : null, moteur: { R1: H.R1.marque ? 'marque' : 'ne marque pas', R7: H.R7.marque ? 'marque' : 'ne marque pas' } }; });
const doc = { note: 'Prédictions figées le 2026-11-28 avant de consulter tout résultat (lot du 24 au 30 novembre : matchs du 28 au 30 ; certains matchs du 28 ont pu commencer). Piste du marquage par la combinaison M3+M7+M11 (même figure que M2+M4+M8+M16) : le pôle dont le front porte en base la figure-somme ou son protecteur, l\'autre pôle non, est annoncé marqueur. Sur les 126 matchs : 58 sur 63 ; sur les 34 matchs du 26 et du 27 novembre, jamais vus : 14 sur 15 (les autres pôles : 72 % et 68 %). Trouvée parmi 30 940 essais (outils/combinaisons_inevitables.js) : c\'est ici qu\'elle se juge. moteur : marquage du moteur au moment du figeage, pour comparer. outils/figer_marque_combinaison.js.', matchs };
fs.writeFileSync(SORTIE, JSON.stringify(doc, null, 1));
const oui = matchs.filter(x => x.annonce);
console.log(matchs.length + ' matchs figés · pôle désigné seul, annoncé marqueur : ' + oui.length + ' · dont le moteur dit déjà qu\'il marque : ' + oui.filter(x => x.moteur[x.annonce.slice(0, 2)] === 'marque').length);
oui.forEach(x => console.log('  ' + x.date.slice(8) + '/11 ' + x.championnat.padEnd(18) + x.match.padEnd(38) + x.annonce.padEnd(11) + '(somme ' + x.somme + ', ' + x.designation[x.annonce.slice(0, 2)] + ') · moteur : ' + x.moteur[x.annonce.slice(0, 2)]));
