// La règle du nul avec les maisons opposées (h ↔ h ± 8) : M9 ↔ M1, M11 ↔ M3, M14 ↔ M6.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'], lv = (f, l) => K.niveaux(f)[l];
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => { const T = K.construire(d.m); return { ...d, b: T.bases, r: h => h < 16 ? T.resultantes[h] : T.bases[16], nul: d.sc[0] === d.sc[1] ? 1 : 0 }; });
const ouvert = d => lv(d.b[9], 0) !== lv(d.b[11], 2);
// structure : ce que valent les maisons et leurs opposées
const ech = []; for (let t = 0; t < 400; t++) ech.push(K.construire([1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 16))).bases);
const combos = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length <= 3) combos.push(hs); }
for (const [a, c] of [[9, 1], [11, 3], [14, 6]]) { const eq = combos.filter(hs => ech.every(b => hs.map(h => b[h]).reduce(A) === A(b[a], b[c]))).map(hs => 'M' + hs.join('+M')); console.log('M' + a + ' + M' + c + ' (maison + opposée) =', eq.slice(0, 5).join(' = ')); }
const juge = (lab, f, S) => { const a = S.filter(f), c = S.filter(d => !f(d)); console.log('  ' + lab.padEnd(58), 'oui :', String(a.filter(d => d.nul).length).padStart(2) + '/' + String(a.length).padEnd(3), '| non :', c.filter(d => d.nul).length + '/' + c.length); };
console.log('\n1. la règle sur les 80 matchs (' + D.filter(d => d.nul).length + ' nuls), « oui » = niveaux différents :');
juge('actuelle : Feu de M9 ≠ Eau de M11', ouvert, D);
juge('opposées : Feu de M1 ≠ Eau de M3', d => lv(d.b[1], 0) !== lv(d.b[3], 2), D);
juge('maison + opposée : Feu de M9+M1 ≠ Eau de M11+M3', d => lv(A(d.b[9], d.b[1]), 0) !== lv(A(d.b[11], d.b[3]), 2), D);
juge('croisée : Feu de M9 ≠ Eau de M3', d => lv(d.b[9], 0) !== lv(d.b[3], 2), D);
juge('croisée : Feu de M1 ≠ Eau de M11', d => lv(d.b[1], 0) !== lv(d.b[11], 2), D);
juge('résultantes : Feu de M9 ≠ Eau de M11 (résultantes)', d => lv(d.r(9), 0) !== lv(d.r(11), 2), D);
const S = D.filter(ouvert);
console.log('\n2. second étage, à l\'intérieur des ' + S.length + ' matchs à nul possible (' + S.filter(d => d.nul).length + ' nuls), « oui » = Terre saturée :');
juge('actuel : Terre de M14', d => lv(d.b[14], 3) === 2, S);
juge('opposée : Terre de M6', d => lv(d.b[6], 3) === 2, S);
juge('maison + opposée : Terre de M14+M6', d => lv(A(d.b[14], d.b[6]), 3) === 2, S);
juge('M14 et M6 même Terre', d => lv(d.b[14], 3) === lv(d.b[6], 3), S);
juge('Terre de M14 (résultante)', d => lv(d.r(14), 3) === 2, S);
// 3. tous les niveaux de M14, M6, M14+M6 pour voir si la Terre est bien le bon niveau
console.log('\n3. chaque niveau de M14, de M6 et de M14+M6 (à nul possible) :');
for (const [lab, g] of [['M14', d => d.b[14]], ['M6', d => d.b[6]], ['M14+M6', d => A(d.b[14], d.b[6])]]) console.log('   ', lab.padEnd(7), NIV.map((n, l) => { const a = S.filter(d => lv(g(d), l) === 2); return n + ' saturé ' + a.filter(d => d.nul).length + '/' + a.length; }).join(' · '));
// 4. troisième étage possible : dans « nul fréquent » (M14 saturée), l'opposée M6 sépare-t-elle encore ?
const F = S.filter(d => lv(d.b[14], 3) === 2), P = S.filter(d => lv(d.b[14], 3) !== 2);
console.log('\n4. dans « nul fréquent » (' + F.length + ' matchs, ' + F.filter(d => d.nul).length + ' nuls) et « nul peu probable » (' + P.length + ', ' + P.filter(d => d.nul).length + ') :');
for (const [lab, f] of [['Terre de M6 saturée', d => lv(d.b[6], 3) === 2], ['Feu de M1 ≠ Eau de M3', d => lv(d.b[1], 0) !== lv(d.b[3], 2)], ['Terre de M1 saturée', d => lv(d.b[1], 3) === 2], ['Terre de M3 saturée', d => lv(d.b[3], 3) === 2]]) { const a = F.filter(f), c = P.filter(f); console.log('   ', lab.padEnd(28), 'fréquent : oui', a.filter(d => d.nul).length + '/' + a.length, ', non', F.filter(d => !f(d) && d.nul).length + '/' + F.filter(d => !f(d)).length, '| peu probable : oui', c.filter(d => d.nul).length + '/' + c.length, ', non', P.filter(d => !f(d) && d.nul).length + '/' + P.filter(d => !f(d)).length); }
