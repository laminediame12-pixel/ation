// Contrôle des maisons par le front d'un pôle (lecture du propriétaire, 2026-11-28, Málaga – Athletic : « R7 contrôle M13, M8 et M3 (Caput à sa maison de repos)
// tandis que R1 contrôle seulement M1 ; chaque pôle suit son front pour essayer de marquer »). Contrôle d'un pôle de figure f : les maisons où son front direct
// (f + 4) et son miroir (f + 8) sont posés en base (Málaga : R7 Conjunctio → Aquisitio en M13, Caput en M8 et M3 ; R1 Via → Fortuna Minor en M1).
// Variantes : avec la figure du pôle posée ailleurs que chez lui, et avec f + 12. On ne juge que sur les matchs joués. Usage : node outils/controle_front.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jv')));
function controle(L, p, avec) { const f = L[p].figure, b = L.theme.bases, cibles = [mod(f + 4), mod(f + 8)].concat(avec.f12 ? [mod(f + 12)] : []), hs = [];
  for (let h = 1; h <= 16; h++) if (cibles.includes(b[h]) || (avec.figure && b[h] === f && h !== L[p].maison)) hs.push(h); return hs; }
const V0 = { f12: false, figure: false }, VARS = [['front direct et miroir (lecture du propriétaire)', V0], ['… et la figure du pôle posée ailleurs', { f12: false, figure: true }], ['… et f + 12 (tout le front)', { f12: true, figure: true }]];
const D = [...tous.values()].map(d => { const L = M.lire(d.m), v = M.verdict(L).decision.resultat; return { ...d, L, v, r: d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'nul' }; });
const n = (S, f) => S.filter(f).length, pc = (a, b) => b ? Math.round(100 * a / b) + ' %' : '—';
// exemple
const Lm = M.lire([9, 12, 3, 1]); console.log('Málaga – Athletic (9-12-3-1) : R1 ' + N(Lm.R1.figure) + ' contrôle M' + controle(Lm, 'R1', V0).join(', M') + ' · R7 ' + N(Lm.R7.figure) + ' contrôle M' + controle(Lm, 'R7', V0).join(', M') + '\n');
for (const [lab, av] of VARS) { console.log(lab + ' :');
  const P = D.flatMap(d => ['R1', 'R7'].map((p, i) => ({ d, i, c: controle(d.L, p, av).length })));
  [0, 1, 2, 3].forEach(k => { const S = P.filter(x => k < 3 ? x.c === k : x.c >= 3), J = S.filter(x => x.d.lot === 'jv'); console.log('  le pôle contrôle ' + (k < 3 ? k : '3 ou plus') + ' maison' + (k > 1 ? 's' : ' ') + ' : ' + String(S.length).padStart(3) + ' pôles · ont marqué ' + pc(n(S, x => x.d.sc[x.i] > 0), S.length) + ' · buts par pôle ' + (S.length ? (S.reduce((a, x) => a + x.d.sc[x.i], 0) / S.length).toFixed(2) : '—') + ' · jamais vus marqué ' + n(J, x => x.d.sc[x.i] > 0) + '/' + J.length); });
  const ch = d => { const a = controle(d.L, 'R1', av).length, c = controle(d.L, 'R7', av).length; return a > c ? 'R1' : c > a ? 'R7' : null; };
  const S = D.filter(ch), J = S.filter(d => d.lot === 'jv');
  console.log('  le pôle qui contrôle le plus de maisons gagne : ' + n(S, d => d.r === ch(d)) + '/' + S.length + ' (' + pc(n(S, d => d.r === ch(d)), S.length) + '), ne perd pas ' + n(S, d => d.r === ch(d) || d.r === 'nul') + ' · marque plus de buts que l\'autre : ' + n(S, d => d.sc[ch(d) === 'R1' ? 0 : 1] > d.sc[ch(d) === 'R1' ? 1 : 0]) + ' · jamais vus gagne ' + n(J, d => d.r === ch(d)) + '/' + J.length);
  const ec = d => controle(d.L, 'R1', av).length - controle(d.L, 'R7', av).length;
  [[2, 99, 'R1 contrôle 2 maisons de plus ou davantage'], [-99, -2, 'R7 contrôle 2 maisons de plus ou davantage']].forEach(([a, b2, lb]) => { const T = D.filter(d => ec(d) >= a && ec(d) <= b2); console.log('  ' + lb + ' : ' + T.length + ' matchs · R1 ' + n(T, d => d.r === 'R1') + ' · nul ' + n(T, d => d.r === 'nul') + ' · R7 ' + n(T, d => d.r === 'R7')); });
  console.log(''); }
// avec le verdict principal
console.log('Vainqueur annoncé par le principal (lecture du propriétaire) :');
const VA = D.filter(d => d.v !== 'N'), w = d => d.v === '1' ? 'R1' : 'R7', l = d => d.v === '1' ? 'R7' : 'R1';
const tv = (lab, S) => console.log('  ' + lab.padEnd(52) + String(S.length).padStart(4) + ' · gagne ' + n(S, d => d.r === w(d)) + ' (' + pc(n(S, d => d.r === w(d)), S.length) + ') · ne perd pas ' + pc(n(S, d => d.r === w(d) || d.r === 'nul'), S.length) + ' · jamais vus ' + n(S.filter(d => d.lot === 'jv'), d => d.r === w(d)) + '/' + S.filter(d => d.lot === 'jv').length);
tv('toutes', VA); tv('il contrôle plus de maisons que le perdant', VA.filter(d => controle(d.L, w(d), V0).length > controle(d.L, l(d), V0).length));
tv('autant', VA.filter(d => controle(d.L, w(d), V0).length === controle(d.L, l(d), V0).length)); tv('le perdant en contrôle plus', VA.filter(d => controle(d.L, w(d), V0).length < controle(d.L, l(d), V0).length));
// Sens inverse observé : le pôle qui contrôle le MOINS de maisons (écart d'au moins 2), gagne-t-il ?
const ec2 = d => controle(d.L, 'R1', V0).length - controle(d.L, 'R7', V0).length, G = D.filter(d => Math.abs(ec2(d)) >= 2), moins = d => ec2(d) > 0 ? 'R7' : 'R1';
console.log('\nÉcart de contrôle d\'au moins 2 maisons : le pôle qui en contrôle le moins gagne ' + n(G, d => d.r === moins(d)) + '/' + G.length + ' (' + pc(n(G, d => d.r === moins(d)), G.length) + '), celui qui en contrôle le plus ' + n(G, d => d.r !== moins(d) && d.r !== 'nul') + '/' + G.length
  + ' · 126 premiers ' + n(G.filter(d => d.lot === 'dev'), d => d.r === moins(d)) + '/' + G.filter(d => d.lot === 'dev').length + ' · jamais vus ' + n(G.filter(d => d.lot === 'jv'), d => d.r === moins(d)) + '/' + G.filter(d => d.lot === 'jv').length);
