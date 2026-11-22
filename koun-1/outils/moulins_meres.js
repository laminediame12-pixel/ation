// Les deux moulins sur la grille des points des 4 mères (même dessin que 3-5-14-12 et 2-9-15-8 sur la grille des maisons ; case (ligne, colonne) = (mère, niveau)).
// moulin A (cases de 3, 5, 14, 12) : Eau M1, Feu M2, Air M4, Terre M3 ; moulin B (cases de 2, 9, 15, 8) : Air M1, Feu M3, Eau M4, Terre M2.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const parNiv = v => [...Array(16)].map((_, i) => i + 1).find(f => K.niveaux(f).join() === v.join());
const cases = hs => hs.map(h => [Math.floor((h - 1) / 4), (h - 1) % 4]);
function moulins(m) { const p = m.map(K.niveaux); return { A: parNiv(cases([3, 5, 14, 12]).map(([r, c]) => p[r][c])), B: parNiv(cases([2, 9, 15, 8]).map(([r, c]) => p[r][c])) }; }
console.log('moulin A des mères = ' + cases([3, 5, 14, 12]).map(([r, c]) => ['Feu', 'Air', 'Eau', 'Terre'][c] + ' M' + (r + 1)).join(', ') + ' ; moulin B = ' + cases([2, 9, 15, 8]).map(([r, c]) => ['Feu', 'Air', 'Eau', 'Terre'][c] + ' M' + (r + 1)).join(', '));
// structure : lien avec les moulins des maisons ?
const S = (b, hs) => hs.map(h => b[h]).reduce(A); let eA = 0, eB = 0, tr = 0;
for (let x = 0; x < 65536; x++) { const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], b = K.construire(m).bases, g = moulins(m); if (g.A === S(b, [3, 5, 14, 12])) eA++; if (g.B === S(b, [2, 9, 15, 8])) eB++;
  // transposition : le moulin A des mères vu chez les filles
  const pf = [5, 6, 7, 8].map(h => K.niveaux(b[h])), fA = parNiv(cases([3, 5, 14, 12]).map(([r, c]) => pf[r][c])); if (fA === g.B) tr++; }
console.log('moulin A des mères = moulin 3-5-14-12 des maisons dans', eA, 'thèmes ; moulin B = 2-9-15-8 dans', eB, '(hasard : 4 096)');
console.log('le moulin A lu chez les filles = moulin B des mères dans', tr, 'thèmes sur 65 536');
// corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const fr = n => (n - 1) % 4;
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, b: L.theme.bases, g: moulins(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0, s: Math.sign(d.sc[0] - d.sc[1]) }; });
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
const dans = (d, f, c) => [0, 1, 2, 3].some(i => d.b[fr(c.figure) + 1 + 4 * i] === f);
for (const k of ['A', 'B']) {
  const t = {}; D.forEach(d => { const f = d.g[k], a = dans(d, f, d.L.R1), e = dans(d, f, d.L.R7), kk = a && e ? 'les deux' : a ? 'R1 seul' : e ? 'R7 seul' : 'aucun'; t[kk] = t[kk] || [0, 0, 0, 0]; t[kk][0]++; t[kk][1] += d.nul; if (d.s > 0) t[kk][2]++; if (d.s < 0) t[kk][3]++; });
  console.log('moulin ' + k + ' des mères posé en base dans le front de :', Object.keys(t).sort().map(x => x + ' → nuls ' + t[x][1] + '/' + t[x][0] + ', R1 ' + t[x][2] + ', R7 ' + t[x][3]).join(' · '));
  const u = {}; D.forEach(d => { const f = d.g[k], a = fr(f) === fr(d.L.R1.figure), e = fr(f) === fr(d.L.R7.figure), kk = a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; u[kk] = u[kk] || [0, 0, 0, 0]; u[kk][0]++; u[kk][1] += d.nul; if (d.s > 0) u[kk][2]++; if (d.s < 0) u[kk][3]++; });
  console.log('moulin ' + k + ' des mères : son front est celui de     :', Object.keys(u).sort().map(x => x + ' → nuls ' + u[x][1] + '/' + u[x][0] + ', R1 ' + u[x][2] + ', R7 ' + u[x][3]).join(' · '));
}
// face au verdict actuel : là où le verdict laisse « nul possible »
const v = {}; D.forEach(d => { const V = M.verdict(d.L); if (V.nulExclu || V.nulPeuProbable || V.nulFrequent) return; ['A', 'B'].forEach(k => { const a = dans(d, d.g[k], d.L.R1), e = dans(d, d.g[k], d.L.R7), kk = k + (a !== e ? ' un seul pôle' : ' autre'); v[kk] = v[kk] || [0, 0]; v[kk][0]++; v[kk][1] += d.nul; }); });
console.log('\nlà où le verdict laisse « nul possible » :', Object.keys(v).sort().map(x => 'moulin ' + x + ' : nuls ' + v[x][1] + '/' + v[x][0]).join(' · '));
