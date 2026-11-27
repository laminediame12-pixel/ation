// Jugement du moteur actuel sur les matchs du 26/11/2026 (validation/resultats-2026-11-26.json) : décision, deux marquent, R1 / R7 marque, buts, incidents.
// Les scores de ces matchs n'ont servi à construire aucune règle de victoire ni de marquage ; leurs incidents, eux, font partie des 108 matchs des règles d'incident.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
const X = lire(process.argv[2] || 'validation/resultats-2026-11-26.json').matchs; const t = { dec: 0, r1: 0, deux: 0, m: 0, buts: 0, n: 0, rg: [0, 0], pn: [0, 0] };
X.forEach(x => { const L = M.lire(x.theme), V = M.verdict(L), H = M.hierarchie(L), I = M.incidentVerdict(L), [a, b] = x.score, r = Math.sign(a - b), d = V.decision.resultat;
  const dj = d === 'N' ? r === 0 : d === '1' ? r > 0 : r < 0, dm = H.deux.oui === (a > 0 && b > 0), m1 = H.R1.marque === a > 0, m7 = H.R7.marque === b > 0, eb = Math.abs(H.buts.valeur - (a + b));
  t.n++; t.dec += dj; t.r1 += r > 0; t.deux += dm; t.m += m1 + m7; t.buts += eb;
  const rg = x.rouge == null ? '?' : oui(x.rouge) ? 'rouge ' + x.rouge : '—', pn = x.penalty == null ? '?' : oui(x.penalty) ? 'pen ' + x.penalty : '—';
  if (x.rouge != null) { const p = I.rouge.niveau === 'probable' || I.rouge.niveau === 'possible'; if (p) { t.rg[1]++; if (oui(x.rouge)) t.rg[0]++; } }
  if (x.penalty != null) { const p = I.penalty.niveau !== 'faible'; if (p) { t.pn[1]++; if (oui(x.penalty)) t.pn[0]++; } }
  console.log(x.match.padEnd(36) + x.score.join('-').padEnd(5) + ('décision ' + (d === 'N' ? 'égalité' : 'R' + (d === '1' ? '1' : '7'))).padEnd(18) + (dj ? '✓' : '✗') + '  deux ' + (H.deux.oui ? 'oui' : 'non') + (dm ? '✓' : '✗') + '  R1 ' + (H.R1.marque ? 'm' : 'n') + (m1 ? '✓' : '✗') + ' R7 ' + (H.R7.marque ? 'm' : 'n') + (m7 ? '✓' : '✗') + '  buts ≈' + H.buts.valeur + ' (' + (a + b) + ')' + '  rouge ' + I.rouge.niveau + (I.rouge.veto ? '' : '→' + I.rouge.camp) + ' / ' + rg + '  penalty ' + I.penalty.niveau + '→' + I.penalty.camp + ' / ' + pn); });
console.log('\n' + t.n + ' matchs : décision ' + t.dec + '/' + t.n + ' (« R1 gagne toujours » ' + t.r1 + ') · deux marquent ' + t.deux + '/' + t.n + ' · marquage ' + t.m + '/' + 2 * t.n + ' · erreur moyenne sur les buts ' + (t.buts / t.n).toFixed(2));
console.log('incidents (non à l\'aveugle) : rouge annoncé possible ou probable → rouge ' + t.rg[0] + '/' + t.rg[1] + ' · penalty annoncé possible ou probable → penalty ' + t.pn[0] + '/' + t.pn[1]);
