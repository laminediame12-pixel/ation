// Jugement à l'aveugle du moteur actuel (décision, nul, victoire nette, buts) sur les 11 matchs terminés trouvés le 2026-11-25.
const fs = require('fs'), path = require('path'), M = require('../moteur4/moteur.js');
const J = JSON.parse(fs.readFileSync(path.join(__dirname, '../validation/resultats-aveugles-2026-11-25.json'), 'utf8')).matchs;
let ok = 0, nulD = [0, 0], vic = [0, 0], nette = [0, 0]; const ga = [], gs = [];
J.forEach(x => { const L = M.lire(x.theme), V = M.verdict(L), d = V.decision, r = Math.sign(x.score[0] - x.score[1]), p = d.resultat === 'N' ? 0 : d.resultat === '1' ? 1 : -1, juste = p === r;
  if (juste) ok++; if (!p) { nulD[1]++; if (!r) nulD[0]++; } else { vic[1]++; if (juste) vic[0]++; if (d.force === 'nette') { nette[1]++; if (juste) nette[0]++; } }
  const A = M.arrets(L).nombre; (A ? ga : gs).push(x.score[0] + x.score[1]);
  console.log(x.match.padEnd(28) + x.score.join('-').padEnd(5) + ('moteur : ' + (p ? 'Victoire ' + (p > 0 ? 'R1' : 'R7') + (d.force === 'nette' ? ' (nette)' : '') : 'Nul')).padEnd(32) + (juste ? '✓' : '✗') + '   nul ' + V.nulConvergence.libelle.padEnd(13) + ' victoire ' + String(V.victoireConvergence.score).padStart(2) + ' · arrêts ' + A + ' · incident ' + M.incidentVerdict(L).niveau + (x.penalty || x.rouge ? ' ← ' + (x.penalty ? 'penalty ' + x.penalty : '') + (x.rouge ? ' rouge ' + x.rouge : '') : ''));
});
const moy = a => a.length ? (a.reduce((s, v) => s + v, 0) / a.length).toFixed(2) : '—';
console.log('\nDécision juste : ' + ok + '/' + J.length + ' · « Nul » dit ' + nulD[1] + ' fois, juste ' + nulD[0] + ' · victoires dites ' + vic[1] + ', justes ' + vic[0] + ' · victoires nettes ' + nette[0] + '/' + nette[1] + ' · référence « R1 toujours » : ' + J.filter(x => x.score[0] > x.score[1]).length + '/' + J.length);
console.log('Buts : avec arrêt ' + moy(ga) + ' (' + ga.length + ' matchs) · sans arrêt ' + moy(gs) + ' (' + gs.length + ')');
