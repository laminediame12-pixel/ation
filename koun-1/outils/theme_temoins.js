// Thème des quatre dernières maisons (demande du propriétaire, 2026-11-28 : « M16, M15, M14, M13 comme 4 mères, développé pour le comparer avec le thème normal,
// pour voir les interactions des deux »). Thème dérivé : mères = figures de M16, M15, M14, M13 du thème normal, dans cet ordre.
// 1. Faits de structure, vérifiés sur les 65 536 thèmes. 2. Sur les matchs joués : pôles, verdict du thème dérivé, accord avec le normal, point fixe de la chaîne.
// Usage : node outils/theme_temoins.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const Dv = x => { const b = K.construire(x).bases; return [b[16], b[15], b[14], b[13]]; };
// 1. structure
const fp = {}, pas = {}; let m9 = 0, m10 = 0, m13 = 0, somme = 0;
for (let m = 0; m < 65536; m++) { const x = [m & 15, (m >> 4) & 15, (m >> 8) & 15, (m >> 12) & 15].map(v => v + 1), b = K.construire(x).bases, d = K.construire(Dv(x)).bases;
  if (d[9] === b[1]) m9++; if (d[10] === b[15]) m10++; if (d[13] === b[16]) m13++;
  const S = []; for (let h = 1; h <= 16; h++) S.push(A(b[h], d[h])); const C = K.construire(S.slice(0, 4)).bases; if (S.every((f, j) => C[j + 1] === f)) somme++;
  let y = x, k = 0; while (Dv(y).join() !== y.join()) { y = Dv(y); k++; } pas[k] = (pas[k] || 0) + 1; const kf = y.map(N).join(', '); fp[kf] = (fp[kf] || 0) + 1; }
console.log('Structure (65 536 thèmes) :');
console.log('  M1, M2, M3, M4 du dérivé = M16, M15, M14, M13 du normal (par construction) ; M9 du dérivé = M1 du normal : ' + m9 + ' ; M10 = M15 : ' + m10 + ' ; M13 = M16 : ' + m13);
console.log('  les autres maisons du dérivé ne sont pas des sommes de maisons du normal (le passage croise les niveaux)');
console.log('  somme maison par maison du normal et du dérivé : un thème dans ' + somme + ' cas sur 65 536');
console.log('  chaîne (dérivé du dérivé…) : point fixe après ' + Object.keys(pas).map(k => k + ' pas : ' + pas[k]).join(', ') + ' · deux points fixes seulement : ' + Object.keys(fp).map(k => '(' + k + ') ← ' + fp[k] + ' thèmes').join(' ; '));
// 2. matchs joués
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jv')));
const n = (S, f) => S.filter(f).length, pc = (a, b) => b ? Math.round(100 * a / b) + ' %' : '—', res = d => d.sc[0] > d.sc[1] ? '1' : d.sc[0] < d.sc[1] ? '2' : 'N';
const DD = [...tous.values()].map(d => { const L = M.lire(d.m), Ld = M.lire(Dv(d.m)), v = M.verdict(L).decision.resultat, vd = M.verdict(Ld).decision.resultat; let y = d.m, k = 0; while (Dv(y).join() !== y.join()) { y = Dv(y); k++; }
  return { ...d, v, vd, fixe: y[0] === 16 ? 'Populus' : 'Puella', pas: k, r: res(d) }; });
const ok = (S, f) => n(S, x => f(x) === x.r);
console.log('\nMatchs joués (' + DD.length + ') :');
console.log('  verdict du thème normal juste ' + ok(DD, x => x.v) + '/' + DD.length + ' · verdict du thème dérivé juste ' + ok(DD, x => x.vd) + '/' + DD.length + ' (jamais vus ' + ok(DD.filter(x => x.lot === 'jv'), x => x.vd) + '/' + n(DD, x => x.lot === 'jv') + ')');
const acc = DD.filter(x => x.vd === x.v), des = DD.filter(x => x.vd !== x.v);
console.log('  les deux d\'accord : ' + acc.length + ' matchs, justes ' + ok(acc, x => x.v) + ' (' + pc(ok(acc, x => x.v), acc.length) + ') · en désaccord : ' + des.length + ', le normal juste ' + ok(des, x => x.v) + ', le dérivé juste ' + ok(des, x => x.vd));
const VA = DD.filter(x => x.v !== 'N'), perd = x => x.v === '1' ? '2' : '1';
[['le dérivé annonce le même vainqueur', x => x.vd === x.v], ['il annonce l\'autre pôle', x => x.vd === perd(x)], ['il annonce une égalité', x => x.vd === 'N']].forEach(([lab, f]) => { const S = VA.filter(f), J = S.filter(x => x.lot === 'jv');
  console.log('  victoire annoncée par le normal, ' + lab.padEnd(36) + String(S.length).padStart(4) + ' · le vainqueur gagne ' + n(S, x => x.r === x.v) + ' (' + pc(n(S, x => x.r === x.v), S.length) + ') · jamais vus ' + n(J, x => x.r === x.v) + '/' + J.length); });
['Populus', 'Puella'].forEach(f => { const S = DD.filter(x => x.fixe === f); console.log('  chaîne qui finit sur le point fixe ' + f.padEnd(8) + S.length + ' matchs · nuls ' + n(S, x => x.r === 'N') + ' (' + pc(n(S, x => x.r === 'N'), S.length) + ') · R1 ' + n(S, x => x.r === '1') + ' · R7 ' + n(S, x => x.r === '2')); });
