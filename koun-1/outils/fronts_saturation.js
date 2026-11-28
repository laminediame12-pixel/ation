// Fronts de R1 et R7 dans le thème principal et dans la vérification (demande du propriétaire, 2026-11-28) : « celui dont les fronts sont plus saturés, ou qui ne
// rencontre pas de blocage par l'adversaire sous Populus ». Front d'un pôle dans un thème : les quatre maisons du front de sa figure dans ce thème.
// Saturation : nombre de niveaux saturés (2 points) des résultantes de ces maisons (M16 : la base, comme dans la page), des bases, et nœuds pleins de la carte du front.
// Blocage sous Populus : Populus en base dans la maison de l'antagoniste, qui le reproduit et bloque (M.bloqueurs, type « populus »), sur la figure du pôle
// ou sur une figure posée dans son front. On ne juge que sur les matchs joués. Usage : node outils/fronts_saturation.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jv')));
const sat = g => K.niveaux(g).filter(v => v === 2).length, res = (X, h) => h === 16 ? X.theme.bases[16] : X.theme.resultantes[h];
const front = (X, p) => { const z = (X[p].figure - 1) % 4; return [0, 1, 2, 3].map(i => z + 4 * i + 1); };
function pole(X, p) { const H = front(X, p), b = X.theme.bases;
  const popPole = M.bloqueurs(X, X[p].figure, X[p].maison).some(y => y.type === 'populus');
  const popFront = H.some(h => b[h] !== 16 && M.bloqueurs(X, b[h], h).some(y => y.type === 'populus'));
  const pleins = M.noeuds(X).fronts[(X[p].figure - 1) % 4].noeuds.filter(x => x.etat === 'plein').length;
  return { satR: H.reduce((s, h) => s + sat(res(X, h)), 0), satB: H.reduce((s, h) => s + sat(b[h]), 0), pleins, popPole, popFront }; }
const D = [...tous.values()].map(d => { const L = M.lire(d.m), V = M.lire(M.themeVerification(L).meres), v = M.verdict(L).decision.resultat;
  const P = {}; ['R1', 'R7'].forEach(p => { const a = pole(L, p), c = pole(V, p); P[p] = { pleins: a.pleins + c.pleins, satR: a.satR + c.satR, satB: a.satB + c.satB, satRp: a.satR, satRv: c.satR, pop: a.popPole || c.popPole, popF: a.popFront || c.popFront || a.popPole || c.popPole }; });
  return { ...d, P, v, r: d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'nul' }; });
const n = (S, f) => S.filter(f).length, pc = (a, b) => b ? Math.round(100 * a / b) + ' %' : '—';
const regle = (lab, choix) => { const S = D.map(d => ({ d, c: choix(d) })).filter(x => x.c), J = S.filter(x => x.d.lot === 'jv'), g = n(S, x => x.d.r === x.c), np = n(S, x => x.d.r === x.c || x.d.r === 'nul');
  console.log('  ' + lab.padEnd(74) + String(S.length).padStart(4) + ' matchs · il gagne ' + g + ' (' + pc(g, S.length) + ') · ne perd pas ' + np + ' (' + pc(np, S.length) + ') · jamais vus gagne ' + n(J, x => x.d.r === x.c) + '/' + J.length); };
const plus = k => d => d.P.R1[k] > d.P.R7[k] ? 'R1' : d.P.R7[k] > d.P.R1[k] ? 'R7' : null;
const libre = k => d => !d.P.R1[k] && d.P.R7[k] ? 'R1' : !d.P.R7[k] && d.P.R1[k] ? 'R7' : null;
console.log(D.length + ' matchs · R1 gagne ' + n(D, d => d.r === 'R1') + ' · nul ' + n(D, d => d.r === 'nul') + ' · R7 ' + n(D, d => d.r === 'R7') + '\n\nLe pôle désigné gagne-t-il ?');
regle('fronts plus saturés (résultantes, principal + vérification)', plus('satR'));
regle('… principal seul', plus('satRp')); regle('… vérification seule', plus('satRv'));
regle('fronts plus saturés (bases, principal + vérification)', plus('satB'));
regle('plus de nœuds pleins dans la carte de son front (principal + vérification)', plus('pleins'));
regle('seul à ne pas être bloqué sous Populus (sa figure, dans l\'un des deux thèmes)', libre('pop'));
regle('seul à ne pas être bloqué sous Populus (sa figure ou son front)', libre('popF'));
regle('plus saturé ou seul libre sous Populus (règle du propriétaire)', d => plus('satR')(d) || libre('pop')(d));
regle('plus saturé et libre sous Populus (l\'autre bloqué ou pas)', d => { const c = plus('satR')(d); return c && !d.P[c].pop ? c : null; });
regle('verdict principal (repère)', d => d.v === '1' ? 'R1' : d.v === '2' ? 'R7' : null);
// avec le verdict principal : le vainqueur annoncé a-t-il les fronts les plus saturés / est-il libre ?
console.log('\nVainqueur annoncé par le principal :');
const VA = D.filter(d => d.v !== 'N'), w = d => d.v === '1' ? 'R1' : 'R7', l = d => d.v === '1' ? 'R7' : 'R1';
const tv = (lab, S) => { const g = n(S, d => d.r === w(d)), np = n(S, d => d.r === w(d) || d.r === 'nul'), J = S.filter(d => d.lot === 'jv');
  console.log('  ' + lab.padEnd(74) + String(S.length).padStart(4) + ' · gagne ' + g + ' (' + pc(g, S.length) + ') · ne perd pas ' + np + ' (' + pc(np, S.length) + ') · jamais vus gagne ' + n(J, d => d.r === w(d)) + '/' + J.length); };
tv('toutes', VA); tv('ses fronts plus saturés', VA.filter(d => d.P[w(d)].satR > d.P[l(d)].satR)); tv('autant', VA.filter(d => d.P[w(d)].satR === d.P[l(d)].satR)); tv('moins saturés', VA.filter(d => d.P[w(d)].satR < d.P[l(d)].satR));
tv('libre sous Populus, le perdant bloqué', VA.filter(d => !d.P[w(d)].pop && d.P[l(d)].pop)); tv('bloqué sous Populus, le perdant libre', VA.filter(d => d.P[w(d)].pop && !d.P[l(d)].pop));
tv('plus saturé et libre sous Populus', VA.filter(d => d.P[w(d)].satR > d.P[l(d)].satR && !d.P[w(d)].pop));
