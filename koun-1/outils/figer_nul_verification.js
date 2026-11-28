// Fige, avant les matchs, la piste du nul par le thème de vérification (2026-11-28) sur les matchs à venir de l'archive (28 au 30 novembre).
// Piste : les deux pôles du thème principal libres dans la vérification, aucune maison de pôle qui y porte son miroir, une qui y porte une figure
// de l'autre boucle (15 nuls sur 32 dans les 160 matchs, choisie sur ces matchs : à juger ici). Le fichier écrit n'est jamais réécrit.
// Usage : node outils/figer_nul_verification.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom;
const SORTIE = path.join(R, 'validation/predictions-nul-verification-28-30-novembre.json');
if (fs.existsSync(SORTIE)) { console.log('déjà figé : ' + path.relative(R, SORTIE) + ' (jamais réécrit)'); process.exit(0); }
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, ANG = [1, 4, 7, 10];
const rel = (f, g) => g === f ? 'même figure' : g === 16 ? 'Populus' : g === mod(f - 3) ? 'antagoniste' : g === mod(f + 3) ? 'victime' : g === mod(f - 6) ? 'protecteur' : g === mod(f + 4) ? 'front direct' : g === mod(f + 8) ? 'miroir' : (g - 1) % 4 === (f - 1) % 4 ? 'même front' : (g % 2) === (f % 2) ? 'même boucle' : 'autre boucle';
const T = JSON.parse(fs.readFileSync(path.join(R, 'validation/themes-25-30-novembre.json'), 'utf8')).filter(x => x.date >= '2026-11-28');
const matchs = T.map(x => { const m = x.theme.split('-').map(Number), L = M.lire(m), V = M.lire(ANG.map(h => L.theme.bases[h])), bV = V.theme.bases;
  const libre = p => { const f = L[p].figure; return !M.bloqueurs(V, f, bV[f] === f ? f : undefined).length; };
  const r1 = rel(L.R1.figure, bV[L.R1.maison]), r7 = rel(L.R7.figure, bV[L.R7.maison]), A = libre('R1') && libre('R7'), C = r1 !== 'miroir' && r7 !== 'miroir', D = r1 === 'autre boucle' || r7 === 'autre boucle';
  const v = M.verdict(L).decision;
  return { date: x.date, championnat: x.championnat, match: x.equipe1 + ' – ' + x.equipe2, theme: x.theme, verification: ANG.map(h => L.theme.bases[h]).join('-'),
    poles_libres: A, sans_miroir: C, autre_boucle: D, maisons: { R1: 'M' + L.R1.maison + ' ' + N(bV[L.R1.maison]) + ' (' + r1 + ')', R7: 'M' + L.R7.maison + ' ' + N(bV[L.R7.maison]) + ' (' + r7 + ')' },
    nul_verification: A && C && D, verdict_moteur: v.resultat === 'N' ? 'égalité' + (v.type ? ' (' + v.type + ')' : '') : v.resultat === '1' ? 'R1' : 'R7' }; });
const doc = { note: 'Prédictions figées le 2026-11-28 avant les matchs (lot du 24 au 30 novembre : matchs du 28 au 30). Piste du nul par le thème de vérification (axe angulaire M1, M4, M7, M10 en thème de 16 figures) : les deux pôles du thème principal libres dans la vérification, aucune maison de pôle qui y porte son miroir, une qui y porte une figure de l\'autre boucle → nul annoncé. Sur les 160 matchs où elle a été choisie : 15 nuls sur 32 (47 %), contre 23 % en tout. verdict_moteur : décision du moteur au moment du figeage, pour comparer. outils/theme_verification.js, outils/figer_nul_verification.js.', matchs };
fs.writeFileSync(SORTIE, JSON.stringify(doc, null, 1));
const oui = matchs.filter(x => x.nul_verification);
console.log(matchs.length + ' matchs figés · nul annoncé par la vérification : ' + oui.length + ' · égalité annoncée par le moteur : ' + matchs.filter(x => /égalité/.test(x.verdict_moteur)).length);
oui.forEach(x => console.log('  ' + x.date.slice(8) + '/11 ' + x.championnat.padEnd(18) + x.match.padEnd(36) + x.theme.padEnd(12) + 'moteur : ' + x.verdict_moteur));
