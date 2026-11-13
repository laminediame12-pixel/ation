// Ce que chaque figure a « dit » dans les matchs réels : écrit moteur2/FIGURES.md. Usage : node outils/figures_doc.js
const fs = require('fs'), path = require('path');
const K = require('../moteur2/moteur.js');
const R = [['10·8·1·8', [10, 8, 1, 8], 'N'], ['11·7·3·9', [11, 7, 3, 9], 'N'], ['8·8·4·12', [8, 8, 4, 12], 'N'], ['13·6·6·15', [13, 6, 6, 15], 'N'], ['3·14·13·5', [3, 14, 13, 5], 'N'], ['2·7·2·12', [2, 7, 2, 12], 'N'], ['5·9·7·13', [5, 9, 7, 13], 'N'], ['2·9·6·5', [2, 9, 6, 5], 'N'],
  ['6·4·10·16', [6, 4, 10, 16], '2'], ['3·10·14·5', [3, 10, 14, 5], '2'], ['8·5·11·7', [8, 5, 11, 7], '1'], ['1·2·6·15', [1, 2, 6, 15], '1'], ['3·4·12·3', [3, 4, 12, 3], '1'], ['9·13·2·13', [9, 13, 2, 13], '1'], ['2·12·4·4', [2, 12, 4, 4], '1'], ['4·3·13·12', [4, 3, 13, 12], '1'],
  ['5·14·6·14', [5, 14, 6, 14], '1'], ['7·5·9·6', [7, 5, 9, 6], '1'], ['13·12·8·15', [13, 12, 8, 15], '2'], ['8·7·10·8', [8, 7, 10, 8], '2'], ['4·16·1·2', [4, 16, 1, 2], '2'], ['4·7·5·8', [4, 7, 5, 8], '1'], ['4·7·10·10', [4, 7, 10, 10], '1'], ['4·1·6·7', [4, 1, 6, 7], '1'], ['4·6·7·16', [4, 6, 7, 16], '1']];
const n = K.num;
const F = {}; K.FIG.forEach(f => F[f] = { pole: [], repos: [], valide: [], axe: [], juge: [], sentence: [], m1: [] });
for (const [id, m, att] of R) {
  const t = K.construireTheme(...m.map(K.fig)), a = K.analyser(t), L = a.lecture, v = a.decision.verification;
  const camp = f => f === L.R1.figure ? 'R1' : f === L.R7.figure ? 'R7' : L.mode === 'BOUCLES_DIFFERENTES' ? (n(f) % 2 === n(L.R1.figure) % 2 ? 'R1' : 'R7') : (K.frontDe(f) === L.R1.front && K.frontDe(f) !== L.R7.front ? 'R1' : K.frontDe(f) === L.R7.front && K.frontDe(f) !== L.R1.front ? 'R7' : null);
  const issue = c => att === 'N' ? 'nul' : c === null ? 'décidé' : (c === (att === '1' ? 'R1' : 'R7') ? 'victoire' : 'défaite');
  F[L.R1.figure].pole.push({ id, r: issue('R1') }); if (L.R7.figure !== L.R1.figure) F[L.R7.figure].pole.push({ id, r: issue('R7') }); else F[L.R7.figure].pole[F[L.R7.figure].pole.length - 1].r = 'nul';
  K.FIG.filter(f => L.chezElle(f)).forEach(f => F[f].repos.push({ id, r: issue(camp(f)), couche: L.chezElleEnBase(f) ? 'base' : 'rés.' }));
  v.valideesAuRepos.forEach(x => F[x.figure].valide.push({ id, r: issue(camp(x.figure)) }));
  F[L.sommes[0].figure].axe.push({ id, r: issue(camp(L.sommes[0].figure)) });
  F[t[15]].juge.push({ id, r: issue(camp(t[15])) }); F[t[16]].sentence.push({ id, r: issue(camp(t[16])) }); F[t[1]].m1.push({ id, r: issue(camp(t[1])) });
}
const compte = l => { const c = { victoire: 0, défaite: 0, nul: 0, décidé: 0 }; l.forEach(x => c[x.r]++); return c; };
const dit = l => { if (!l.length) return '—'; const c = compte(l); return [c.victoire ? c.victoire + ' victoire' + (c.victoire > 1 ? 's' : '') : '', c.défaite ? c.défaite + ' défaite' + (c.défaite > 1 ? 's' : '') : '', c.nul ? c.nul + ' nul' + (c.nul > 1 ? 's' : '') : '', c.décidé ? c.décidé + ' décidé' + (c.décidé > 1 ? 's' : '') : ''].filter(Boolean).join(', '); };
const parole = f => { // tendance globale, tous rôles confondus sauf M1
  const tout = [].concat(F[f].pole, F[f].repos, F[f].valide, F[f].axe, F[f].juge, F[f].sentence), c = compte(tout), t = tout.length;
  if (t < 4) return 'trop peu de matchs';
  const dec = c.victoire + c.défaite + c.décidé;
  if (c.nul >= 0.6 * t) return 'parle surtout le nul';
  if (c.victoire >= 0.6 * t) return 'parle surtout la victoire de son camp';
  if (c.défaite >= 0.5 * t) return 'parle surtout la défaite de son camp';
  if (dec >= 0.7 * t) return 'parle un match décidé';
  return 'partagée';
};
let md = '# Ce que chaque figure a dit dans les matchs réels\n\nCe document est produit par `outils/figures_doc.js` à partir des ' + R.length + ' matchs réels. Pour chaque figure et chaque rôle, il compte ce qui est arrivé **au camp de la figure** : victoire, défaite ou nul. « Décidé » veut dire que le match a eu un vainqueur mais que la figure n\'appartient à aucun des deux camps.\n\nLes nombres sont petits : une figure n\'a tenu chaque rôle que quelques fois. C\'est un relevé, pas une règle.\n\nLe renversement (une équipe menée qui finit par gagner) ne peut pas encore être documenté : la mi-temps n\'est connue que pour quatre matchs, et aucun n\'est un renversement.\n\n';
md += '## Vue d\'ensemble\n\n| Figure | Comme pôle | Au repos (thème principal) | Validée par la vérification | Somme de l\'axe | Juge (M15) | Sentence (M16) | Ce qu\'elle a dit |\n|---|---|---|---|---|---|---|---|\n';
K.FIG.forEach(f => { md += '| ' + n(f) + ' ' + f + ' | ' + dit(F[f].pole) + ' | ' + dit(F[f].repos) + ' | ' + dit(F[f].valide) + ' | ' + dit(F[f].axe) + ' | ' + dit(F[f].juge) + ' | ' + dit(F[f].sentence) + ' | ' + parole(f) + ' |\n'; });
md += '\n## Détail par figure\n\n';
K.FIG.forEach(f => {
  md += '### ' + n(f) + ' · ' + f + ' (front ' + K.frontDe(f) + ', ' + K.CARDINAL[n(f)] + ')\n\n';
  const ligne = (titre, l, extra) => { if (l.length) md += '- **' + titre + '** : ' + l.map(x => x.id + (extra && x.couche ? ' (' + x.couche + ')' : '') + ' → ' + x.r).join(' ; ') + '.\n'; };
  ligne('Pôle', F[f].pole); ligne('Au repos dans le thème principal', F[f].repos, true); ligne('Validée par le thème de vérification', F[f].valide); ligne('Somme de l\'axe angulaire', F[f].axe); ligne('Juge, en M15', F[f].juge); ligne('Sentence, en M16', F[f].sentence); ligne('En M1', F[f].m1);
  if (![F[f].pole, F[f].repos, F[f].valide, F[f].axe, F[f].juge, F[f].sentence, F[f].m1].some(l => l.length)) md += '- Aucun de ces rôles dans les matchs réels.\n';
  md += '\n';
});
fs.writeFileSync(path.join(__dirname, '../moteur2/FIGURES.md'), md);
K.FIG.forEach(f => console.log((n(f) + ' ' + f).padEnd(18), '| pôle', dit(F[f].pole).padEnd(34), '| repos', dit(F[f].repos).padEnd(30), '| axe', dit(F[f].axe).padEnd(22), '| M15', dit(F[f].juge).padEnd(22), '| M16', dit(F[f].sentence).padEnd(22), '|', parole(f)));
