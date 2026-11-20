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
  const v = ang.has(b) && ang.has(som(ANG)) && tous.has(som([3, 5, 11, 15]));
  if (K4.fiabilite(L).valide !== v) add('FI-5');
}
console.log(t, 'thèmes ; écarts :', JSON.stringify(bad)); process.exit(Object.keys(bad).length ? 1 : 0);
