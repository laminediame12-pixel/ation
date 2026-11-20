// Moteur 4 (lecture seule) contre le noyau et contre un comptage direct, sur les 65 536 thèmes.
const N = require('../moteur3/noyau.js'), K4 = require('../moteur4/moteur.js');
const bad = {}, add = k => bad[k] = (bad[k] || 0) + 1, pt = n => N.niveaux(n);
const P1 = [1, 2, 3, 4, 9, 10, 13, 15], P2 = [5, 6, 7, 8, 11, 12, 14, 16];
let t = 0;
for (let q = 0; q < 65536; q++) {
  const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1); t++;
  const L = K4.lire(m), T = N.construire(m), P = N.poles(T);
  for (let h = 1; h <= 16; h++) if (L.base(h) !== T.bases[h] || L.resu(h) !== (h === 16 ? T.bases[16] : T.resultantes[h])) { add('maisons'); break; }
  if (L.R1.maison !== P.R1.maison || L.R7.figure !== P.R7.figure) add('pôles');
  if (L.lien !== N.additionner(P.R1.figure, P.R7.figure)) add('lien');
  // équilibre : l'équation doit égaler le comptage direct (lignes à deux points, une ligne par maison tour à tour, base et résultante)
  const somme = (part, f) => part.reduce((s, h, i) => s + (pt(f(h))[i % 4] === 2 ? 1 : 0), 0), e = K4.equilibre(L);
  if (e.ecartBase !== somme(P2, L.base) - somme(P1, L.base) && e.ecartBase !== somme(P1, L.base) - somme(P2, L.base)) add('écart base');
  if (Math.abs(e.ecartRes) !== Math.abs(somme(P1, L.resu) - somme(P2, L.resu))) add('écart résultante');
  // FI-5 : même validation que l'invariant I18 (sans jour)
  const ANG = [1, 4, 7, 10], pres = hs => { const s = new Set(); hs.forEach(h => { s.add(L.base(h)); s.add(L.resu(h)); }); return s; }, tous = pres([...Array(16).keys()].map(i => i + 1)), ang = pres(ANG);
  const b = (m[0] - 1) % 4 < 2 ? m[0] + 2 : m[0] - 2, som = hs => hs.map(h => T.bases[h]).reduce(N.additionner);
  const v = ang.has(b) && tous.has(som(ANG)) && tous.has(som([3, 5, 11, 15]));
  if (K4.fiabilite(L).valide !== v) add('FI-5');
}
// Analyse des pôles : recalcul indépendant (somme des niveaux saturés de la résultante de chaque maison où se trouve la figure) ; effectifs attendus : 3 249 thèmes nets pour R1, 3 078 pour R7
let netR1 = 0, netR7 = 0, mal = 0;
const m16 = n => ((n - 1) % 16 + 16) % 16 + 1;
for (let q = 0; q < 65536; q++) {
  const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), T = N.construire(m), P0 = N.poles(T), L = K4.lire(m), P = K4.poles(L);
  const S = f => { let s = 0; for (let h = 1; h <= 16; h++) if (T.bases[h] === f || (h < 16 && T.resultantes[h] === f)) s += N.niveaux(h === 16 ? T.bases[16] : T.resultantes[h]).filter(v => v === 2).length; return s; };
  const ind = p => { const z = (p - 1) % 4, sum = zz => [1, 2, 3, 4].reduce((a, i) => a + S(zz + 4 * (i - 1) + 1), 0); return [sum(z), sum((z + 2) % 4), S((p - 1) % 4 < 2 ? p + 2 : p - 2), S(m16(p - 3))]; };
  const a = ind(P0.R1.figure), e = ind(P0.R7.figure), sg = x => x > 0 ? 1 : x < 0 ? -1 : 0, v = [sg(a[0] - e[0]), sg(a[1] - e[1]), sg(a[2] - e[2]), sg(e[3] - a[3])];
  if (JSON.stringify(v) !== JSON.stringify(P.indicateurs)) mal++;
  const net = v.every(x => x > 0) ? 'R1' : v.every(x => x < 0) ? 'R7' : null; if (net !== P.net) mal++; if (net === 'R1') netR1++; if (net === 'R7') netR7++;
}
if (mal || netR1 !== 3249 || netR7 !== 3078) add('analyse des pôles');
console.log('analyse des pôles : nets R1', netR1, 'R7', netR7, 'écarts', mal);
console.log(t, 'thèmes ; écarts :', JSON.stringify(bad)); process.exit(Object.keys(bad).length ? 1 : 0);
