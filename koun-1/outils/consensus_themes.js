// PISTE 2 (2026-11-25) : plusieurs thèmes valides pour un même match. Pour chacun des 106 matchs connus, on tire 10 thèmes valides
// (critères de validité sans la figure du jour, faute de date pour tous) et on compare :
//  - la justesse de la décision du moteur sur le thème d'origine, sur un thème tiré, et sur la majorité des 10 thèmes tirés ;
//  - l'accord entre deux thèmes d'un même match, et entre deux thèmes de matchs différents.
// Si le tirage capte le match, les thèmes d'un même match s'accordent plus entre eux qu'avec ceux des autres matchs, et leur majorité prédit mieux.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const dec = t => { const r = M.verdict(M.lire(t)).decision.resultat; return r === 'N' ? 0 : r === '1' ? 1 : -1; };
const tirer = () => { let t; do { t = [0, 1, 2, 3].map(() => 1 + crypto.randomInt(16)); } while (!M.fiabilite(M.lire(t)).valide); return t; };
const D = [...tous.values()].map(d => { const th = [...Array(10)].map(tirer); return { ...d, r: Math.sign(d.sc[0] - d.sc[1]), d0: dec(d.m), ds: th.map(dec), valide0: M.fiabilite(M.lire(d.m)).valide }; });
const maj = a => { const c = { 1: 0, 0: 0, '-1': 0 }; a.forEach(x => c[x]++); return [1, 0, -1].sort((x, y) => c[y] - c[x] || (x === 1 ? -1 : 0))[0]; };
let o0 = 0, o1 = 0, om = 0; D.forEach(d => { if (d.d0 === d.r) o0++; o1 += d.ds.filter(x => x === d.r).length / 10; if (maj(d.ds) === d.r) om++; });
console.log(D.length + ' matchs\n');
console.log('Décision juste : thème d\'origine ' + o0 + '/106 · un thème tiré au hasard ' + o1.toFixed(1) + '/106 (moyenne) · majorité de 10 thèmes tirés ' + om + '/106');
const acc = (a, b) => a === b ? 1 : 0; let sIn = 0, nIn = 0, sOut = 0, nOut = 0;
D.forEach((d, i) => { for (let x = 0; x < 10; x++) for (let y = x + 1; y < 10; y++) { sIn += acc(d.ds[x], d.ds[y]); nIn++; } const e = D[(i + 1 + crypto.randomInt(D.length - 1)) % D.length]; for (let x = 0; x < 10; x++) { sOut += acc(d.ds[x], e.ds[x]); nOut++; } });
console.log('Accord entre deux thèmes du même match : ' + (100 * sIn / nIn).toFixed(1) + ' % · entre deux thèmes de matchs différents : ' + (100 * sOut / nOut).toFixed(1) + ' %');
const v = D.filter(d => d.valide0), nv = D.filter(d => !d.valide0);
console.log('\n(Piste 3 en passant) thème d\'origine valide : ' + v.filter(d => d.d0 === d.r).length + '/' + v.length + ' justes · non valide : ' + nv.filter(d => d.d0 === d.r).length + '/' + nv.length);
for (const lot of ['corpus', 'aveugle']) { const X = D.filter(d => d.lot === lot); let a = 0, b = 0, c = 0; X.forEach(d => { if (d.d0 === d.r) a++; b += d.ds.filter(x => x === d.r).length / 10; if (maj(d.ds) === d.r) c++; });
  console.log(lot.padEnd(8) + ' (' + X.length + ') : thème d\'origine ' + a + ' · thème tiré ' + b.toFixed(1) + ' · majorité des tirés ' + c); }
