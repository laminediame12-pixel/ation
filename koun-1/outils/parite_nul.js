// Étude centrée sur la parité du nul : P = Feu M1 + Feu M2 + Feu M3 + Air M3 (points impairs comptés) ; P impaire → nul possible, P paire → pas de nul.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'], pc = v => { v ^= v >> 16; v ^= v >> 8; v ^= v >> 4; v ^= v >> 2; v ^= v >> 1; return v & 1; };
const bits = m => { let x = 0; m.forEach((f, i) => K.niveaux(f).forEach((v, l) => { if (v === 1) x |= 1 << (4 * i + l); })); return x; };
const MASK = (1 << 0) | (1 << 4) | (1 << 8) | (1 << 9); // Feu M1, Feu M2, Feu M3, Air M3
const P = m => pc(bits(m) & MASK);
// ── 1. ce que P représente : masque de chaque niveau de chaque somme de maisons (toutes les 65 535 combinaisons de maisons)
const unite = (i, l) => { const v = [[2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2], [2, 2, 2, 2]]; v[i][l] = 1; return v.map(n => [...Array(16)].map((_, j) => j + 1).find(f => K.niveaux(f).join() === n.join())); };
const B0 = K.construire([16, 16, 16, 16]).bases, BU = []; for (let i = 0; i < 4; i++) for (let l = 0; l < 4; l++) BU.push(K.construire(unite(i, l)).bases);
const maskSomme = (hs, l) => { let m = 0; BU.forEach((b, k) => { const v0 = K.niveaux(hs.map(h => B0[h]).reduce(A))[l], v1 = K.niveaux(hs.map(h => b[h]).reduce(A))[l]; if (v0 !== v1) m |= 1 << k; }); return m; };
const formes = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length > 6) continue; for (let l = 0; l < 4; l++) if (maskSomme(hs, l) === MASK) formes.push(NIV[l] + ' de M' + hs.join('+M')); }
console.log('1. P comme niveau d\'une somme de maisons (jusqu\'à 6 maisons) :', formes.length ? formes.slice(0, 10).join(' · ') : 'aucune : P n\'est le niveau d\'aucune somme de maisons');
// deux niveaux de deux sommes ?
const deux = []; const lv = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length > 2) continue; for (let l = 0; l < 4; l++) lv.push({ k: NIV[l] + ' de M' + hs.join('+M'), m: maskSomme(hs, l) }); }
for (let a = 0; a < lv.length; a++) for (let b = a + 1; b < lv.length; b++) if ((lv[a].m ^ lv[b].m) === MASK) deux.push(lv[a].k + ' + ' + lv[b].k);
console.log('   P comme somme de deux niveaux (maisons seules ou par paires) :', deux.slice(0, 12).join(' · '), '(' + deux.length + ' formes)');
// ── 2. corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, x: bits(d.m), p: P(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0 }; }), N = D.length;
const imp = D.filter(d => d.p), pair = D.filter(d => !d.p);
console.log('\n2. corpus : P impaire', imp.length, 'matchs, nuls', imp.filter(d => d.nul).length, '| P paire', pair.length, 'matchs, nuls', pair.filter(d => d.nul).length);
const ecart = s => s.map(d => Math.abs(d.sc[0] - d.sc[1])), moy = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2);
console.log('   écart de buts moyen : P paire', moy(ecart(pair)), '| P impaire (hors nuls)', moy(ecart(imp.filter(d => !d.nul))), '| buts par match : P paire', moy(pair.map(d => d.sc[0] + d.sc[1])), ', P impaire', moy(imp.map(d => d.sc[0] + d.sc[1])));
console.log('   nuls :', imp.filter(d => d.nul).map(d => (d.n || d.m.join('-')) + ' ' + d.sc.join('-')).join(' ; '));
// ── 3. stabilité : sous-ensembles et voisins du masque
console.log('\n3. stabilité : le masque et ses voisins (nuls côté impair / matchs côté impair ; nuls côté pair)');
const juge = m => { let n = 0, k = 0; D.forEach(d => { if (pc(d.x & m)) { n++; k += d.nul; } }); return k + '/' + n + ' (pair : ' + (15 - k) + '/' + (N - n) + ')'; };
const nomBit = b => NIV[b % 4] + ' M' + (Math.floor(b / 4) + 1);
console.log('   P complet (Feu M1, Feu M2, Feu M3, Air M3) :', juge(MASK));
[0, 4, 8, 9].forEach(b => console.log('   sans ' + nomBit(b).padEnd(10), ':', juge(MASK & ~(1 << b))));
const ajouts = []; for (let b = 0; b < 16; b++) if (!((MASK >> b) & 1)) { let n = 0, k = 0; D.forEach(d => { if (pc(d.x & (MASK | (1 << b)))) { n++; k += d.nul; } }); ajouts.push(nomBit(b) + ' ' + k + '/' + n); }
console.log('   avec un point de plus :', ajouts.join(' · '));
// autres parités qui contiennent tous les nuls dans au plus 45 matchs
const parfaites = []; for (let m = 1; m < 65536; m++) { let n = 0, k = 0; for (const d of D) if (pc(d.x & m)) { n++; k += d.nul; } if (k === 15 && n <= 45) parfaites.push({ m, n }); }
parfaites.sort((a, b) => a.n - b.n);
console.log('\n   parités qui contiennent les 15 nuls dans au plus 45 matchs :', parfaites.length); parfaites.slice(0, 8).forEach(p => console.log('     ', [...Array(16).keys()].filter(b => (p.m >> b) & 1).map(nomBit).join(', ').padEnd(60), 'dans', p.n, 'matchs'));
// ── 4. articulation avec le verdict actuel
console.log('\n4. avec le verdict actuel (niveau de nul) :');
const t = {}; D.forEach(d => { const V = M.verdict(d.L), f = V.nulExclu ? 'quasi impossible' : V.nulFrequent ? 'fréquent' : V.nulPeuProbable ? 'peu probable' : 'possible', k = (d.p ? 'P impaire' : 'P paire') + ' · ' + f; t[k] = t[k] || [0, 0]; t[k][0]++; t[k][1] += d.nul; });
Object.keys(t).sort().forEach(k => console.log('    ', k.padEnd(34), t[k][1], 'nuls sur', t[k][0]));
// ── 5. mi-temps : les nuls à la pause suivent-ils aussi P ?
const mt = lire('validation/scores-reels.json').filter(x => Array.isArray(x.mi_temps)), vu = new Set(), H = []; mt.concat(lire('validation/mi-temps.json').filter(x => Array.isArray(x.mi_temps))).forEach(x => { const k = x.themes.join('-'); if (vu.has(k)) return; vu.add(k); H.push({ p: P(x.themes), nul: x.mi_temps[0] === x.mi_temps[1] ? 1 : 0 }); });
console.log('\n5. nul à la mi-temps :', 'P impaire', H.filter(h => h.p && h.nul).length + '/' + H.filter(h => h.p).length, '| P paire', H.filter(h => !h.p && h.nul).length + '/' + H.filter(h => !h.p).length);
// ── 6. fréquence de P impaire sur les 65 536 thèmes, et par maison de R1
let f1 = 0; const parH = {}; for (let x = 0; x < 65536; x++) { const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], p = P(m); if (p) f1++; const h = m[0]; parH[h] = parH[h] || [0, 0]; parH[h][0]++; parH[h][1] += p; }
console.log('\n6. P impaire dans', f1, 'thèmes sur 65 536 ; par maison de R1 (= figure de M1) :', Object.keys(parH).map(h => 'M' + h + ' ' + Math.round(100 * parH[h][1] / parH[h][0]) + ' %').join(' · '));
