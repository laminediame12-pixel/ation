// Double thème : aux maisons des pôles, figure du principal et figure de la vérification du même front (remarque du propriétaire, 2026-11-28).
// La vérification garde la première mère (donc la maison de R1) ; R7 est toujours en R1 + 6 : chaque pôle a la même maison dans les deux thèmes, et la page
// en vue double y montre la figure du pôle (principal) et celle de la vérification. Même front = mêmes Feu et Air ; même figure = Populus dans le thème somme.
// On ne juge que sur les matchs joués. Usage : node outils/double_meme_front.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jv')));
const fr = g => (g - 1) % 4, FR = 'ABCD';
let maisonsOk = 0;
const D = [...tous.values()].map(d => { const L = M.lire(d.m), V = M.lire(M.themeVerification(L).meres), H = M.hierarchie(L), dec = M.verdict(L).decision;
  if (V.R1.maison === L.R1.maison && V.R7.maison === L.R7.maison) maisonsOk++;
  const p = q => { const f = L[q].figure, g = V.theme.bases[L[q].maison]; return { f, g, meme: f === g, front: fr(f) === fr(g), moteur: H[q].marque }; };
  return { ...d, P: { R1: p('R1'), R7: p('R7') }, v: dec.resultat, r: d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'nul' }; });
console.log(D.length + ' matchs · maison des pôles identique dans les deux thèmes : ' + maisonsOk + '/' + D.length);
const n = (S, f) => S.filter(f).length, pc = (a, b) => b ? Math.round(100 * a / b) + ' %' : '—';
// 1. fréquence
const pol = D.flatMap(d => ['R1', 'R7'].map((q, i) => ({ d, q, i, ...d.P[q] })));
console.log('\nMaison d\'un pôle (' + pol.length + ' pôles) : même front ' + n(pol, x => x.front) + ' (' + pc(n(pol, x => x.front), pol.length) + ', dont même figure ' + n(pol, x => x.meme) + ') — au hasard on attendrait 25 %');
// 2. le pôle marque-t-il ?
const tp = (lab, S) => { const k = n(S, x => x.d.sc[x.i] > 0), J = S.filter(x => x.d.lot === 'jv'); console.log('  ' + lab.padEnd(58) + String(S.length).padStart(4) + ' pôles · ont marqué ' + k + ' (' + pc(k, S.length) + ') · jamais vus ' + n(J, x => x.d.sc[x.i] > 0) + '/' + J.length); };
console.log('Le pôle marque-t-il ?'); tp('même front (figure différente)', pol.filter(x => x.front && !x.meme)); tp('même figure', pol.filter(x => x.meme)); tp('autre front', pol.filter(x => !x.front));
tp('R1 même front', pol.filter(x => x.q === 'R1' && x.front)); tp('R1 autre front', pol.filter(x => x.q === 'R1' && !x.front)); tp('R7 même front', pol.filter(x => x.q === 'R7' && x.front)); tp('R7 autre front', pol.filter(x => x.q === 'R7' && !x.front));
// 3. issue du match selon les deux pôles
const tm = (lab, S) => { const J = S.filter(d => d.lot === 'jv'); console.log('  ' + lab.padEnd(58) + String(S.length).padStart(4) + ' matchs · R1 ' + n(S, d => d.r === 'R1') + ' · nul ' + n(S, d => d.r === 'nul') + ' · R7 ' + n(S, d => d.r === 'R7') + '  (jamais vus : R1 ' + n(J, d => d.r === 'R1') + ' · nul ' + n(J, d => d.r === 'nul') + ' · R7 ' + n(J, d => d.r === 'R7') + ')'); };
console.log('\nIssue du match :'); tm('tous', D);
tm('seul R1 a deux figures du même front', D.filter(d => d.P.R1.front && !d.P.R7.front)); tm('seul R7 a deux figures du même front', D.filter(d => !d.P.R1.front && d.P.R7.front));
tm('les deux pôles', D.filter(d => d.P.R1.front && d.P.R7.front)); tm('aucun', D.filter(d => !d.P.R1.front && !d.P.R7.front));
// 4. avec le verdict principal
const tv = (lab, S) => { const g = n(S, d => d.r === (d.v === '1' ? 'R1' : 'R7')), np = n(S, d => d.r === (d.v === '1' ? 'R1' : 'R7') || d.r === 'nul'), J = S.filter(d => d.lot === 'jv');
  console.log('  ' + lab.padEnd(58) + String(S.length).padStart(4) + ' · gagne ' + g + ' (' + pc(g, S.length) + ') · ne perd pas ' + np + ' (' + pc(np, S.length) + ') · jamais vus gagne ' + n(J, d => d.r === (d.v === '1' ? 'R1' : 'R7')) + '/' + J.length); };
const VA = D.filter(d => d.v !== 'N'), w = d => d.v === '1' ? 'R1' : 'R7', l = d => d.v === '1' ? 'R7' : 'R1';
console.log('\nVainqueur annoncé par le principal :'); tv('toutes les victoires annoncées', VA);
tv('le vainqueur a deux figures du même front, le perdant non', VA.filter(d => d.P[w(d)].front && !d.P[l(d)].front)); tv('le perdant en a, le vainqueur non', VA.filter(d => !d.P[w(d)].front && d.P[l(d)].front));
tv('les deux', VA.filter(d => d.P[w(d)].front && d.P[l(d)].front)); tv('aucun', VA.filter(d => !d.P[w(d)].front && !d.P[l(d)].front));
// 5. les fronts concernés
console.log('\nFront commun à la maison d\'un pôle et marquage :'); [0, 1, 2, 3].forEach(z => tp('front ' + FR[z], pol.filter(x => x.front && fr(x.f) === z)));
// recoupement avec la victoire confirmée par la vérification (cycle de 2) et probabilité de hasard
const lf = [0]; for (let i = 1; i <= 300; i++) lf[i] = lf[i - 1] + Math.log(i); const Cb = (a, b) => lf[a] - lf[b] - lf[a - b];
const fisher = (a, n1, b, n2) => { const T = n1 + n2, Kt = a + b; let s = 0; for (let x = a; x <= Math.min(n1, Kt); x++) s += Math.exp(Cb(Kt, x) + Cb(T - Kt, n1 - x) - Cb(T, n1)); return s; };
const piste = d => d.P[w(d)].front && !d.P[l(d)].front, gagne = d => d.r === w(d), A1 = VA.filter(piste), A0 = VA.filter(d => !piste(d));
console.log('\nPiste (vainqueur seul avec deux figures du même front) : ' + n(A1, gagne) + '/' + A1.length + ' contre ' + n(A0, gagne) + '/' + A0.length + ' · hasard ' + fisher(n(A1, gagne), A1.length, n(A0, gagne), A0.length).toFixed(2)
  + ' · 126 premiers ' + n(A1.filter(d => d.lot === 'dev'), gagne) + '/' + A1.filter(d => d.lot === 'dev').length + ' · jamais vus ' + n(A1.filter(d => d.lot === 'jv'), gagne) + '/' + A1.filter(d => d.lot === 'jv').length);
const conf = d => !!M.verdict(M.lire(d.m)).decision.confirmee;
console.log('Recoupement avec « victoire confirmée (vérification) » : ' + n(A1, conf) + ' des ' + A1.length + ' cas sont aussi confirmés · hors confirmées : ' + n(A1.filter(d => !conf(d)), gagne) + '/' + A1.filter(d => !conf(d)).length);
