// Fige, avant les matchs, la piste « le vainqueur annoncé possède des blocages dans le thème somme » (2026-11-28) sur les matchs restants de l'archive.
// Piste (outils/somme_fouille.js) : victoire annoncée par le thème principal, figure du vainqueur annoncé bloquée dans le thème somme et celle du perdant libre →
// victoire renforcée. 161 matchs : le vainqueur annoncé a gagné 22 fois sur 27 dans ce cas (126 premiers 17/21, jamais vus 5/6), contre 69 sur 105 sinon ;
// bloquée par un Populus du thème somme : 15 sur 19. Pas encore solide (hasard possible) : c'est ici qu'elle se juge. Le fichier écrit n'est jamais réécrit.
// Usage : node outils/figer_somme_blocage.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom;
const SORTIE = path.join(R, 'validation/predictions-somme-blocage-28-30-novembre.json');
if (fs.existsSync(SORTIE)) { console.log('déjà figé : ' + path.relative(R, SORTIE) + ' (jamais réécrit)'); process.exit(0); }
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), connus = new Set();
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => connus.add(x.theme.join('-') + '|' + x.date)));
const T = lire('validation/themes-25-30-novembre.json').filter(x => x.date >= '2026-11-28' && !connus.has(x.theme + '|' + x.date));
const matchs = T.map(x => { const L = M.lire(x.theme.split('-').map(Number)), S = M.lire(M.themeSomme(L).meres), v = M.verdict(L).decision.resultat;
  if (v === 'N') return null; const w = v === '1' ? 'R1' : 'R7', l = w === 'R1' ? 'R7' : 'R1', bW = M.bloqueurs(S, L[w].figure), bL = M.bloqueurs(S, L[l].figure);
  if (!bW.length || bL.length) return null;
  return { date: x.date, championnat: x.championnat, match: x.equipe1 + ' – ' + x.equipe2, theme: x.theme, theme_somme: S.theme.meres.join('-'), vainqueur_annonce: w === 'R1' ? x.equipe1 : x.equipe2,
    blocage: N(L[w].figure) + ' bloquée par ' + bW.map(y => N(y.figure) + (y.type === 'populus' ? ' reproduit par Populus en M' + y.maison : ' ' + (y.type === 'M16' ? 'en M16' : 'intact en M' + y.maison))).join(', '), par_populus: bW.some(y => y.type === 'populus'), resultat: null }; }).filter(Boolean);
fs.writeFileSync(SORTIE, JSON.stringify({ note: 'Piste du propriétaire « le vainqueur possède des blocages dans le thème somme », figée le 2026-11-28 avant de consulter tout résultat (matchs restants du 28 au 30 novembre). Victoire annoncée par le thème principal ; figure du vainqueur annoncé bloquée dans le thème somme, celle du perdant libre → victoire renforcée. 161 matchs : 22 victoires sur 27 (jamais vus 5/6), contre 69 sur 105 sinon. outils/somme_fouille.js, outils/figer_somme_blocage.js.', matchs }, null, 1));
console.log(matchs.length + ' matchs figés (sur ' + T.length + ' restants) · dont par Populus : ' + matchs.filter(x => x.par_populus).length);
matchs.forEach(x => console.log('  ' + x.date.slice(8) + '/11 ' + x.championnat.padEnd(17) + x.match.padEnd(38) + 'victoire renforcée : ' + x.vainqueur_annonce + (x.par_populus ? ' (Populus)' : '')));
