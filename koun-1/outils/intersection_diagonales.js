// Les deux diagonales (1-6-11-16, 4-7-10-13) et leur intersection (le carré central 6-7-10-11) : égalités et Populus.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const POP = 16, S = (b, hs) => hs.map(h => b[h]).reduce(A), DP = [1, 6, 11, 16], DA = [4, 7, 10, 13], CE = [6, 7, 10, 11];
console.log('Populus =', nm(POP), K.niveaux(POP).join(''));
for (const src of ['bases', 'résultantes']) {
  const c = {}, add = k => c[k] = (c[k] || 0) + 1;
  for (let x = 0; x < 65536; x++) {
    const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], T = K.construire(m), b = src === 'bases' ? T.bases : [null, ...[...Array(16)].map((_, i) => i < 15 ? T.resultantes[i + 1] : T.bases[16])];
    const X = S(b, DP), Y = S(b, DA), Z = S(b, CE);
    if (X === Y) add('1-6-11-16 = 4-7-10-13'); if (X === Z) add('1-6-11-16 = 6-7-10-11'); if (Y === Z) add('4-7-10-13 = 6-7-10-11'); if (X === Y && Y === Z) add('les trois égales');
    if (A(X, Y) === POP) add('1-6-11-16 + 4-7-10-13 = Populus (diagonales égales)'); if (A(A(X, Y), Z) === POP) add('X + Y + centre = Populus'); if (Z === POP) add('centre 6-7-10-11 = Populus'); if (A(X, Y) === Z) add('X + Y = centre');
    if (S(b, [1, 16]) === S(b, [4, 13])) add('coins 1+16 = coins 4+13');
  }
  console.log('\n' + src + ' (sur 65 536 thèmes ; au hasard une égalité tombe dans environ 4 096) :'); Object.entries(c).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log('   ', k.padEnd(52), v));
}
// identité exacte : X + Y + Z = coins (1+16+4+13) car le centre est compté deux fois
console.log('\nidentité : (1-6-11-16) + (4-7-10-13) = (1+16+4+13) + 2 × centre = somme des 4 coins (le centre s\'annule) ; donc X = Y ⇔ coins 1+16 = coins 4+13 ⇔ somme des 4 coins = Populus');
// corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => { const T = M.lire(d.m).theme; return { ...d, b: T.bases, r: [null, ...[...Array(16)].map((_, i) => i < 15 ? T.resultantes[i + 1] : T.bases[16])], nul: d.sc[0] === d.sc[1] ? 1 : 0, s: Math.sign(d.sc[0] - d.sc[1]) }; });
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
const tab = (lab, f) => { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0, []]; t[k][0]++; t[k][1] += d.nul; if (d.s > 0) t[k][2]++; if (d.s < 0) t[k][3]++; t[k][4].push(d.sc.join('-')); }); console.log(lab); Object.keys(t).sort().forEach(k => console.log('    ', k.padEnd(14), 'n', String(t[k][0]).padStart(2), '| nuls', t[k][1], '| R1', t[k][2], 'R7', t[k][3], t[k][0] <= 8 ? '| ' + t[k][4].join(' ') : '')); };
for (const src of ['b', 'r']) { const nmSrc = src === 'b' ? 'bases' : 'résultantes';
  tab('diagonales égales (' + nmSrc + ')', d => S(d[src], DP) === S(d[src], DA) ? 'oui' : 'non');
  tab('centre 6-7-10-11 = Populus (' + nmSrc + ')', d => S(d[src], CE) === POP ? 'oui' : 'non');
  tab('centre 6-7-10-11 (' + nmSrc + ') : niveaux impairs', d => K.niveaux(S(d[src], CE)).filter(v => v === 1).length);
  tab('somme des 4 coins 1+4+13+16 (' + nmSrc + ') : niveaux impairs', d => K.niveaux(S(d[src], [1, 4, 13, 16])).filter(v => v === 1).length);
}
