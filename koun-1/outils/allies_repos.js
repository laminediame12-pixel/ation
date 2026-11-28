// Figures au repos alliées d'un pôle (règle du propriétaire, 2026-11-28 : « une figure au repos communique bien avec ses alliés si elle n'est pas bloquée »).
// Figure au repos : posée dans sa propre maison (base de Mh = h). Alliée d'un pôle : du même front que la figure du pôle (Málaga – Athletic : Caput au repos en M3,
// front C comme Conjunctio, R7). Non bloquée : son antagoniste (g − 3) n'est présent intact nulle part (posé avec ses points actifs, en M16, ou reproduit par
// Populus) — le moteur, lui, dit qu'une figure chez elle ne peut pas y être bloquée ; les deux lectures sont mesurées. On ne juge que sur les matchs joués.
// Usage : node outils/allies_repos.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jv')));
// alliés au repos d'un pôle : figures de son front posées chez elles (sans la figure du pôle elle-même), libres ou non
function allies(L, p, strict) { const b = L.theme.bases, z = (L[p].figure - 1) % 4, out = [];
  for (let h = 1; h <= 16; h++) if (b[h] === h && (h - 1) % 4 === z && h !== L[p].figure) { const bl = M.bloqueurs(L, h); if (!strict || !bl.length) out.push(h); } return out; }
const D = [...tous.values()].map(d => { const L = M.lire(d.m), H = M.hierarchie(L), v = M.verdict(L).decision.resultat;
  return { ...d, L, v, mq: { R1: H.R1.marque, R7: H.R7.marque }, r: d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'nul' }; });
const n = (S, f) => S.filter(f).length, pc = (a, b) => b ? Math.round(100 * a / b) + ' %' : '—';
const Lm = M.lire([9, 12, 3, 1]); console.log('Málaga – Athletic : alliés au repos de R1 ' + (allies(Lm, 'R1', false).map(h => N(h) + ' en M' + h).join(', ') || 'aucun') + ' · de R7 ' + (allies(Lm, 'R7', false).map(h => N(h) + ' en M' + h + (M.bloqueurs(Lm, h).length ? ' (antagoniste présent)' : ' (libre)')).join(', ') || 'aucun') + '\n');
for (const [lab, strict] of [['alliés au repos, sans condition (le moteur : chez elle, on ne peut pas la bloquer)', false], ['alliés au repos non bloqués (antagoniste absent)', true]]) {
  console.log(lab + ' :'); const P = D.flatMap(d => ['R1', 'R7'].map((p, i) => ({ d, p, i, a: allies(d.L, p, strict).length })));
  const tp = (lb, S) => { const J = S.filter(x => x.d.lot === 'jv'); console.log('  ' + lb.padEnd(60) + String(S.length).padStart(4) + ' pôles · ont marqué ' + pc(n(S, x => x.d.sc[x.i] > 0), S.length) + ' · ont gagné ' + pc(n(S, x => x.d.r === x.p), S.length) + ' · jamais vus marqué ' + n(J, x => x.d.sc[x.i] > 0) + '/' + J.length + ', gagné ' + n(J, x => x.d.r === x.p) + '/' + J.length); };
  tp('pôle avec au moins un allié au repos', P.filter(x => x.a > 0)); tp('pôle sans allié au repos', P.filter(x => x.a === 0));
  tp('… le moteur dit « ne marque pas », avec un allié au repos', P.filter(x => !x.d.mq[x.p] && x.a > 0)); tp('… le moteur dit « ne marque pas », sans allié', P.filter(x => !x.d.mq[x.p] && x.a === 0));
  tp('… le moteur dit « marque », avec un allié au repos', P.filter(x => x.d.mq[x.p] && x.a > 0)); tp('… le moteur dit « marque », sans allié', P.filter(x => x.d.mq[x.p] && x.a === 0));
  const S = D.filter(d => (allies(d.L, 'R1', strict).length > 0) !== (allies(d.L, 'R7', strict).length > 0)), ch = d => allies(d.L, 'R1', strict).length > 0 ? 'R1' : 'R7', J = S.filter(d => d.lot === 'jv');
  console.log('  un seul pôle a un allié au repos : il gagne ' + n(S, d => d.r === ch(d)) + '/' + S.length + ' (' + pc(n(S, d => d.r === ch(d)), S.length) + '), ne perd pas ' + n(S, d => d.r === ch(d) || d.r === 'nul') + ' · R1 seul ' + n(S.filter(d => ch(d) === 'R1'), d => d.r === 'R1') + '/' + n(S, d => ch(d) === 'R1') + ' · R7 seul ' + n(S.filter(d => ch(d) === 'R7'), d => d.r === 'R7') + '/' + n(S, d => ch(d) === 'R7') + ' · jamais vus ' + n(J, d => d.r === ch(d)) + '/' + J.length);
  const VA = D.filter(d => d.v !== 'N'), w = d => d.v === '1' ? 'R1' : 'R7', l = d => d.v === '1' ? 'R7' : 'R1';
  const A1 = VA.filter(d => allies(d.L, w(d), strict).length > 0 && !allies(d.L, l(d), strict).length), A2 = VA.filter(d => !allies(d.L, w(d), strict).length && allies(d.L, l(d), strict).length > 0);
  console.log('  vainqueur annoncé seul à avoir un allié au repos : gagne ' + n(A1, d => d.r === w(d)) + '/' + A1.length + ' · le perdant annoncé seul : le vainqueur gagne ' + n(A2, d => d.r === w(d)) + '/' + A2.length + ' (toutes : 91/132)\n'); }
