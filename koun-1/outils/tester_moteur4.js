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
// Analyse des pôles : recalcul indépendant des cinq indicateurs sur les 65 536 thèmes
let mal = 0, netR1 = 0, netR7 = 0;
const m16 = n => ((n - 1) % 16 + 16) % 16 + 1, sg = x => x > 0 ? 1 : x < 0 ? -1 : 0;
for (let q = 0; q < 65536; q++) {
  const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), T = N.construire(m), P0 = N.poles(T), L = K4.lire(m), P = K4.poles(L);
  const res = h => h === 16 ? T.bases[16] : T.resultantes[h];
  const stats = (f, niv) => { let sat = 0, propres = 0; for (let h = 1; h <= 16; h++) if (T.bases[h] === f || (h < 16 && T.resultantes[h] === f)) { const lv = N.niveaux(res(h)); sat += lv.filter(v => v === 2).length; if (lv[niv] === 2) propres++; } return [sat, propres]; };
  const ind = p => { const z = (p - 1) % 4, col = zz => [1, 2, 3, 4].map(i => zz + 4 * (i - 1) + 1), grp = zz => col(zz).reduce((a, f) => { const s = stats(f, zz); return [a[0] + s[0], a[1] + s[1]]; }, [0, 0]);
    const g1 = grp(z), g2 = grp((z + 2) % 4), b = (p - 1) % 4 < 2 ? p + 2 : p - 2; return { f: g1[0], bf: g2[0], bin: stats(b, (b - 1) % 4)[0], ant: stats(m16(p - 3), (m16(p - 3) - 1) % 4)[0], propres: g1[1] + g2[1] }; };
  const a = ind(P0.R1.figure), e = ind(P0.R7.figure), v = [sg(a.f - e.f), sg(a.bf - e.bf), sg(a.bin - e.bin), sg(e.ant - a.ant), sg(a.propres - e.propres)];
  if (JSON.stringify(v) !== JSON.stringify(P.indicateurs)) mal++;
  const net = v.every(x => x > 0) ? 'R1' : v.every(x => x < 0) ? 'R7' : null; if (net !== P.net) mal++; if (net === 'R1') netR1++; if (net === 'R7') netR7++;
}
if (mal) add('analyse des pôles');
console.log('analyse des pôles (5 indicateurs) : nets R1', netR1, 'R7', netR7, 'écarts', mal);
// Faits : les placements « miroir », « binôme », « antagoniste ancré », « victime » doivent reproduire les distributions démontrées (I13, I16)
const dist = { miroir: {}, binôme: {}, 'antagoniste ancré': {}, victime: {} };
for (let q = 0; q < 65536; q++) { const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), F = K4.faits(K4.lire(m)), c = { miroir: 0, binôme: 0, 'antagoniste ancré': 0, victime: 0 };
  F.relations.forEach(r => r.relations.forEach(t => { if (t in c) c[t]++; })); Object.keys(c).forEach(k => dist[k][c[k]] = (dist[k][c[k]] || 0) + 1); }
const att = { miroir: [25350, 24400, 11357, 3524, 780, 116, 9], binôme: [23449, 26604, 12166, 2796, 489, 32], 'antagoniste ancré': [21831, 24726, 13454, 4336, 983, 178, 28], victime: [25823, 23842, 11171, 3717, 825, 144, 13, 1] };
Object.keys(att).forEach(k => { const lu = Object.keys(dist[k]).map(Number).sort((a, b) => a - b).map(n => dist[k][n]); if (JSON.stringify(lu) !== JSON.stringify(att[k])) { add('faits ' + k); console.log(k, JSON.stringify(lu)); } });
// Niveaux d'activation : recalcul indépendant des scores 1 et 4
let malA = 0;
for (let q = 0; q < 65536; q++) { const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), T = N.construire(m), P0 = N.poles(T), A = K4.activation(K4.lire(m));
  const cp = f => { const z = (f - 1) % 4, lv = N.niveaux(f); return [0, 1, 2, 3].filter(i => lv[i] === 2 && (i === z || i === [1, 0, 3, 2][z])).length; };
  const sc = p => [cp(p), cp(p) + cp(N.miroir(p)) + cp((p - 1) % 4 < 2 ? p + 2 : p - 2) + cp(m16(p - 3))];
  const a = sc(P0.R1.figure), e = sc(P0.R7.figure);
  if (A.R1.score1 !== a[0] || A.R1.score4 !== a[1] || A.R7.score1 !== e[0] || A.R7.score4 !== e[1]) malA++; }
if (malA) add('niveaux d\'activation');
// Niveaux connectés du front : recalcul indépendant à partir des nœuds (états « plein » et « vide » ne suffisent pas : on recompte les liaisons)
let malC = 0;
for (let q = 0; q < 65536; q++) { const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), L = K4.lire(m), C = K4.connexions(L), T = N.construire(m);
  const r = h => N.niveaux(h === 16 ? T.bases[16] : T.resultantes[h]);
  for (const [c, pole] of [['R1', L.R1], ['R7', L.R7]]) { const f = (pole.figure - 1) % 4 + 1, set = new Set();
    for (let l = 0; l < 3; l++) { if (r(f)[l] === 2 && r(f + 8)[l] === 2) set.add(l); if (r(f + 12)[l] === 2 && r(f + 4)[l] === 2) set.add(l); }
    if ((r(f)[3] === 2 && r(f + 4)[3] === 2) || (r(f + 8)[3] === 2 && r(f + 12)[3] === 2)) set.add(3);
    if (C[c].n !== set.size) malC++; } }
if (malC) add('niveaux connectés');
// Multiplicité : somme des placements de la boucle = recomptage indépendant
let malM = 0;
for (let q = 0; q < 65536; q += 7) { const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), L = K4.lire(m), T = N.construire(m), X = K4.multiplicite(L);
  const c = f => { let n = 0; for (let h = 1; h <= 16; h++) if (T.bases[h] === f || (h < 16 && T.resultantes[h] === f)) n++; return n; };
  for (const [k, pole] of [['R1', L.R1], ['R7', L.R7]]) { let tot = 0; for (let f = 1; f <= 16; f++) if (f % 2 === pole.figure % 2) tot += c(f); if (X[k].total !== tot || X[k].figures.length !== 8) malM++; } }
if (malM) add('multiplicité');
// Paralysie : les niveaux changés sont exactement les niveaux à un point de l'antagoniste, pour les 16 figures
for (let f = 1; f <= 16; f++) { const P = K4.paralysieFigure(f), an = N.niveaux(m16(f - 3)).map((v, i) => v === 1 ? 'FAET'[i] : '').join(''); if (P.niveaux !== an) add('paralysie ' + f); }
// Exemple du propriétaire : Conjunctio en M14 change l'Air et l'Eau de Puella
if (K4.paralysieFigure(14).niveaux !== 'AE' || K4.paralysieFigure(14).antagoniste !== 11) add('exemple Conjunctio/Puella');
// Terre saturée : total = somme des quatre fronts, et recomptage direct
let malT = 0; for (let q = 0; q < 65536; q += 5) { const m = [q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1), L = K4.lire(m), T = N.construire(m), X = K4.terreSaturee(L); let n = 0; for (let h = 1; h <= 16; h++) if (N.niveaux(h === 16 ? T.bases[16] : T.resultantes[h])[3] === 2) n++; if (X.total !== n || X.parFront.reduce((a, b) => a + b, 0) !== n) malT++; }
if (malT) add('terre saturée');
// Buts d'après la Terre : T des cinq matchs connus et formule
[[[4,1,6,7],4,3],[[10,2,12,3],5,4],[[6,8,8,11],6,4],[[4,6,7,16],8,5],[[14,9,16,9],8,5],[[1,3,15,4],9,6]].forEach(([m,T,b]) => { const x = K4.butsTerre(K4.lire(m)); if (x.T !== T || x.total !== b) add('buts Terre ' + m.join('-')); });
// Alerte M8 : seule 1-3-15-4 (Cauda en base de M8) la déclenche parmi les six matchs connus
[[[4,6,7,16],false],[[4,1,6,7],false],[[6,8,8,11],false],[[10,2,12,3],false],[[14,9,16,9],false],[[1,3,15,4],true]].forEach(([m,a]) => { if (!!K4.butsTerre(K4.lire(m)).alerte !== a) add('alerte M8 ' + m.join('-')); });
console.log(t, 'thèmes ; écarts :', JSON.stringify(bad)); process.exit(Object.keys(bad).length ? 1 : 0);
