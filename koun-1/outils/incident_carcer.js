// Piste du propriétaire (2026-11-25) : toute paire de maisons opposées (h et h+8) dont la somme donne Carcer suscite un conflit qui finit par un penalty ou un rouge.
// Étiquettes d'incident : scores-reels.json (penalty / rouge renseignés « Non », « R1 », « R7 » ; absents = inconnus) ;
// résultats à l'aveugle (seuls les incidents relevés sont notés : l'absence n'est pas une preuve, comptée à part).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const E = [];
lire('validation/scores-reels.json').forEach(x => { const conn = x.penalty !== undefined && x.penalty !== null && x.rouge !== undefined && x.rouge !== null; E.push({ m: x.themes, match: x.match, lot: 'corpus', connu: conn, inc: conn ? (x.penalty !== 'Non' || x.rouge !== 'Non') : null }); });
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => E.push({ m: x.theme, match: x.match, lot: 'aveugle', connu: !!(x.penalty || x.rouge), inc: (x.penalty || x.rouge) ? true : null }));
const vus = new Set(), D = E.filter(e => { const k = e.m.join('-'); if (vus.has(k)) return false; vus.add(k); return true; }).map(e => ({ ...e, L: M.lire(e.m) }));
const PAIRES = [1, 2, 3, 4, 5, 6, 7, 8].map(h => [h, h + 8]);
const rz = (L, h) => h < 16 ? L.theme.resultantes[h] : L.theme.bases[16];
const LECT = {
  'bases : une paire opposée donne Carcer': L => PAIRES.filter(([a, b]) => A(L.theme.bases[a], L.theme.bases[b]) === 10).length,
  'résultantes : une paire opposée donne Carcer': L => PAIRES.filter(([a, b]) => A(rz(L, a), rz(L, b)) === 10).length,
  'base ou résultante : une paire opposée donne Carcer': L => PAIRES.filter(([a, b]) => A(L.theme.bases[a], L.theme.bases[b]) === 10 || A(rz(L, a), rz(L, b)) === 10).length,
};
const etiq = D.filter(d => d.connu);
console.log('Matchs à incident étiqueté : ' + etiq.length + ' (incident ' + etiq.filter(d => d.inc).length + ', sans incident ' + etiq.filter(d => d.inc === false).length + ') ; taux d\'incident ' + Math.round(100 * etiq.filter(d => d.inc).length / etiq.length) + ' %');
console.log('À l\'aveugle : ' + D.filter(d => d.lot === 'aveugle' && d.inc).length + ' incidents relevés sur ' + D.filter(d => d.lot === 'aveugle').length + ' matchs (les autres non étiquetés)\n');
for (const [k, f] of Object.entries(LECT)) {
  console.log(k);
  [0, 1, 2, 3].forEach(n => { const X = etiq.filter(d => Math.min(f(d.L), 3) === n); if (!X.length) return; const x = X.filter(d => d.inc).length, av = D.filter(d => d.lot === 'aveugle' && Math.min(f(d.L), 3) === n);
    console.log('    ' + (n === 3 ? '3 paires ou plus' : n + ' paire' + (n > 1 ? 's' : '')).padEnd(18) + ('incident ' + x + '/' + X.length + ' (' + Math.round(100 * x / X.length) + ' %)').padEnd(24) + '| aveugle : incidents relevés ' + av.filter(d => d.inc).length + '/' + av.length); });
  const oui = etiq.filter(d => f(d.L) > 0), non = etiq.filter(d => f(d.L) === 0); console.log('    au moins une paire : ' + oui.filter(d => d.inc).length + '/' + oui.length + ' · aucune : ' + non.filter(d => d.inc).length + '/' + non.length + '\n');
}
console.log('Matchs à incident étiqueté, avec leurs paires Carcer (bases) :');
etiq.forEach(d => { const p = PAIRES.filter(([a, b]) => A(d.L.theme.bases[a], d.L.theme.bases[b]) === 10).map(([a, b]) => a + '-' + b); console.log('   ' + d.match.padEnd(34) + (d.inc ? 'INCIDENT ' : 'aucun    ') + (p.length ? 'paires ' + p.join(', ') : '')); });
// Comptage propre, lot par lot. Corpus : seulement les matchs où penalty ET rouge sont renseignés. Aveugle : tous les matchs, incident = relevé dans les
// comptes rendus (les autres comptés « sans incident relevé », hypothèse à garder en tête).
console.log('\nCOMPTAGE PROPRE (bases : au moins une paire opposée qui donne Carcer)');
const f0 = LECT['bases : une paire opposée donne Carcer'];
for (const lot of ['corpus', 'aveugle']) { const X = D.filter(d => d.lot === lot && (lot === 'aveugle' || d.connu)), inc = d => d.inc === true;
  const oui = X.filter(d => f0(d.L) > 0), non = X.filter(d => f0(d.L) === 0), deux = X.filter(d => f0(d.L) >= 2);
  console.log('   ' + lot.padEnd(8) + ' au moins une paire : incident ' + oui.filter(inc).length + '/' + oui.length + ' · aucune : ' + non.filter(inc).length + '/' + non.length + ' · deux paires ou plus : ' + deux.filter(inc).length + '/' + deux.length); }
