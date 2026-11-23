// Jugement à l'aveugle des règles du moteur sur les matchs joués après leur construction (validation/resultats-aveugles-2026-11-23.json).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const J = JSON.parse(fs.readFileSync(path.join(R, 'validation/resultats-aveugles-2026-11-23.json'), 'utf8')).matchs;
const res = { victoire: [0, 0, 0], nulExclu: [0, 0], nulFreq: [0, 0], nulPeu: [0, 0], marque: [0, 0], butsAvec: [], butsSans: [], incProb: [0, 0], incPoss: [0, 0], incAucun: [0, 0] };
const ligne = [];
J.forEach(x => {
  const L = M.lire(x.theme), V = M.verdict(L), Q = M.marquage(L), I = M.incidentVerdict(L), s = x.score, r = Math.sign(s[0] - s[1]), nul = r === 0;
  const v = V.v === '1' ? 1 : V.v === '2' ? -1 : 0; if (v) { if (nul) res.victoire[2]++; else if (v === r) res.victoire[0]++; else res.victoire[1]++; }
  const nv = V.nulExclu ? 'exclu' : V.nulFrequent ? 'fréquent' : 'peu probable', k = nv === 'exclu' ? 'nulExclu' : nv === 'fréquent' ? 'nulFreq' : 'nulPeu'; res[k][1]++; if (nul) res[k][0]++;
  ['R1', 'R7'].forEach((p, i) => { if (Q[p].parite.equilibre) { res.marque[1]++; if (s[i] > 0) res.marque[0]++; } });
  (Q.arrets.nombre ? res.butsAvec : res.butsSans).push(s[0] + s[1]);
  const inc = x.penalty || x.rouge ? 1 : 0, ik = I.niveau === 'probable' ? 'incProb' : I.niveau === 'possible' ? 'incPoss' : 'incAucun'; if (inc) res[ik][0]++; res[ik][1]++;
  ligne.push((x.match.padEnd(32) + s.join('-').padEnd(5) + '| victoire ' + (V.v ? (V.v === '1' ? 'R1' : 'R7') + (v === r ? ' ✓' : nul ? ' (nul)' : ' ✗') : '—   ').padEnd(12) + '| nul ' + nv.padEnd(13) + (nul ? '← NUL' : '     ') + ' | arrêts ' + Q.arrets.nombre + ', buts ' + (s[0] + s[1]) + ' | incident ' + I.niveau + (inc ? ' ← ' + (x.penalty ? 'penalty ' : '') + (x.rouge ? 'rouge' : '') : '')));
});
ligne.forEach(l => console.log(l));
const pc = a => a[1] ? Math.round(100 * a[0] / a[1]) + ' %' : '—', moy = a => a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : '—';
console.log('\nBILAN À L\'AVEUGLE (' + J.length + ' matchs, ' + J.filter(x => x.score[0] === x.score[1]).length + ' nuls)');
console.log('  victoire : ' + res.victoire[0] + ' justes, ' + res.victoire[1] + ' faux, ' + res.victoire[2] + ' nuls (sur ' + (res.victoire[0] + res.victoire[1] + res.victoire[2]) + ' appels)');
console.log('  nul : « quasi impossible » ' + res.nulExclu[0] + '/' + res.nulExclu[1] + ' · « peu probable » ' + res.nulPeu[0] + '/' + res.nulPeu[1] + ' · « fréquent » ' + res.nulFreq[0] + '/' + res.nulFreq[1]);
console.log('  marque (parité équilibrée) : ' + res.marque[0] + '/' + res.marque[1] + ' (' + pc(res.marque) + ')');
console.log('  buts : avec arrêt ' + moy(res.butsAvec) + ' (' + res.butsAvec.length + ' matchs) · sans arrêt ' + moy(res.butsSans) + ' (' + res.butsSans.length + ')');
console.log('  incident connu (penalty ou rouge relevés dans les comptes rendus ; les autres matchs ne sont pas étiquetés) : probable ' + res.incProb.join('/') + ' · possible ' + res.incPoss.join('/') + ' · aucun ' + res.incAucun.join('/'));
