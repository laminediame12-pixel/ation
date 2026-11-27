// Fouille systématique du nul (2026-11-27) : 1324 caractéristiques du thème comparées entre les 27 nuls et les 99 autres matchs, avec contrôle par tirages au hasard.
const fs = require('fs'), path = require('path'), R = '/home/user/ation/koun-1', M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), N = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score)));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] }));
const nN = D.filter(d => d.nul).length; console.log(D.length + ' matchs, ' + nN + ' nuls');
// caractéristiques : base/résultante de chaque maison (figure, et chaque niveau), R1/R7 (figures, maisons, somme, distance), paires de maisons (somme)
const add = K.additionner, F = [];
const feats = d => { const L = d.L, b = L.theme.bases, r = L.theme.resultantes, s = new Set();
  for (let h = 1; h <= 16; h++) { s.add('b' + h + '=' + N(b[h])); s.add('r' + h + '=' + N(r[h])); K.niveaux(b[h]).forEach((v, l) => s.add('b' + h + 'n' + l + '=' + v)); K.niveaux(r[h]).forEach((v, l) => s.add('r' + h + 'n' + l + '=' + v)); }
  const a = L.R1.figure, c = L.R7.figure; s.add('R1=' + N(a)); s.add('R7=' + N(c)); s.add('R1+R7=' + N(add(a, c))); s.add('R1M=' + L.R1.maison);
  for (let h = 1; h <= 8; h++) { s.add('b' + h + '+b' + (h + 8) + '=' + N(add(b[h], b[h + 8]))); s.add('r' + h + '+r' + (h + 6 > 16 ? h - 10 : h + 6) + '=' + N(add(r[h], r[h + 6 > 16 ? h - 10 : h + 6]))); }
  for (let h = 1; h <= 16; h++) for (let g = h + 1; g <= 16; g++) { s.add('b' + h + '==b' + g + ':' + (b[h] === b[g])); }
  s.add('marque:' + M.marquePole(L, 'R1').niveau + '/' + M.marquePole(L, 'R7').niveau);
  return s; };
const cnt = {}; D.forEach(d => feats(d).forEach(f => { cnt[f] = cnt[f] || [0, 0]; cnt[f][d.nul ? 0 : 1]++; }));
const nV = D.length - nN, out = Object.entries(cnt).filter(([f, [a, b]]) => a >= 5).map(([f, [a, b]]) => ({ f, a, b, p: a / (a + b) })).sort((x, y) => y.p - x.p || y.a - x.a);
console.log('taux de base nul ' + (nN / D.length).toFixed(2)); out.slice(0, 25).forEach(o => console.log(o.f.padEnd(28) + ' nuls ' + o.a + '/' + nN + ' · non-nuls ' + o.b + '/' + nV + ' → ' + Math.round(100 * o.p) + ' % de nuls'));
// combien de caractéristiques testées
console.log(Object.keys(cnt).length + ' caractéristiques testées');
console.log('\nles plus fréquentes dans les nuls (écart au reste)');
Object.entries(cnt).map(([f, [a, b]]) => ({ f, a, b, e: a / nN - b / nV })).sort((x, y) => y.e - x.e).slice(0, 8).forEach(o => console.log(o.f.padEnd(28) + ' nuls ' + o.a + '/' + nN + ' · non-nuls ' + o.b + '/' + nV));
// hasard : même fouille sur des « nuls » tirés au sort
let mx = []; for (let t = 0; t < 30; t++) { const idx = new Set(); while (idx.size < nN) idx.add(Math.floor(Math.random() * D.length)); const c2 = {}; D.forEach((d, i) => feats(d).forEach(f => { c2[f] = c2[f] || [0, 0]; c2[f][idx.has(i) ? 0 : 1]++; }));
  mx.push(Math.max(...Object.values(c2).filter(([a]) => a >= 5).map(([a, b]) => a / (a + b)))); }
console.log('\nmeilleur taux obtenu avec 27 matchs tirés au hasard (30 tirages) : médiane ' + Math.round(100 * mx.sort()[15]) + ' %');
let me = []; for (let t = 0; t < 100; t++) { const idx = new Set(); while (idx.size < nN) idx.add(Math.floor(Math.random() * D.length)); const c2 = {}; D.forEach((d, i) => feats(d).forEach(f => { c2[f] = c2[f] || [0, 0]; c2[f][idx.has(i) ? 0 : 1]++; }));
  me.push(Math.max(...Object.values(c2).map(([a, b]) => a / nN - b / nV))); }
me.sort((a, b) => a - b); console.log('écart max au hasard : médiane ' + me[50].toFixed(2) + ', 95e ' + me[95].toFixed(2) + ' ; réel b12 Feu saturé ' + (22 / 27 - 46 / 99).toFixed(2) + ' ; tirages au hasard qui font mieux : ' + me.filter(x => x >= 22 / 27 - 46 / 99).length + '/100');
const f2 = d => K.niveaux(d.L.theme.bases[12])[0] === 2 && K.niveaux(d.L.theme.bases[9])[0] === 2; console.log('M12 et M9 Feu saturé en base : nuls ' + D.filter(d => d.nul && f2(d)).length + '/27 · non-nuls ' + D.filter(d => !d.nul && f2(d)).length + '/99');
