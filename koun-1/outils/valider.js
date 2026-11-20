// Évaluation honnête des règles sur tous les matchs avec score. Usage : node outils/valider.js
// 1. rassemble les thèmes et scores (scores-reels, themes-18, lot-2), sans doublon ; 2. sépare les matchs sur lesquels les règles ont été construites (validation/construits.json) des matchs indépendants ;
// 3. donne les bases de comparaison (toujours R1, jamais nul) ; 4. évalue les anciennes règles sur les matchs indépendants ; 5. validation croisée (un match laissé de côté) d'une règle apprise.
const fs = require('fs'), path = require('path'), M = require('../moteur4/moteur.js'), N = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
const tous = new Map(), ajouter = (th, sc) => { const k = th.join('-'); if (!tous.has(k)) tous.set(k, { m: th, sc }); };
lire('validation/scores-reels.json').forEach(x => ajouter(x.themes, x.score));
lire('validation/themes-18.json').forEach(x => ajouter(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; ajouter(l2.themes[0], l2.score.split('-').map(Number));   // deux thèmes d'un même match : un seul compte
const construits = new Set(lire('validation/construits.json').themes.map(t => t.join('-')));
const data = [...tous.values()].map(d => Object.assign(d, { c: d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'N', indep: !construits.has(d.m.join('-')) }));
const indep = data.filter(d => d.indep), dec = data.filter(d => d.c !== 'N');
console.log('Matchs avec score :', data.length, '| indépendants des règles :', indep.length, '| construits :', data.length - indep.length, '| nuls :', data.filter(d => d.c === 'N').length, '(dont', indep.filter(d => d.c === 'N').length, 'parmi les indépendants)');
const pct = (a, b) => a + '/' + b + ' (' + Math.round(100 * a / b) + ' %)';
console.log('Bases de comparaison : toujours R1 sur les décisifs =', pct(dec.filter(d => d.c === 'R1').length, dec.length), '; jamais nul =', pct(data.filter(d => d.c !== 'N').length, data.length));
// anciennes règles de verdict, évaluées sur les matchs indépendants
const reg = { 'H-CROIX': [0, 0], 'H-5': [0, 0], 'H-TEMOINS + H-BIN-E (nul)': [0, 0], 'H-BIN-E seule (nul)': [0, 0], 'témoins = 6 seuls (nul)': [0, 0] };
indep.forEach(d => { const L = M.lire(d.m), n = M.noeuds(L), P = M.poles(L), T = M.temoins(L), I = M.interactions(L), s1 = n.arrets.some(a => a.maison === L.R1.maison), s7 = n.arrets.some(a => a.maison === L.R7.maison);
  if (s1 !== s7) reg['H-CROIX'][(s1 ? 'R7' : 'R1') === d.c ? 0 : 1]++;
  if (P.net) reg['H-5'][P.net === d.c ? 0 : 1]++;
  if (T.totalBase === 6 && I.binomeEauEquilibre) reg['H-TEMOINS + H-BIN-E (nul)'][d.c === 'N' ? 0 : 1]++;
  if (I.binomeEauEquilibre) reg['H-BIN-E seule (nul)'][d.c === 'N' ? 0 : 1]++;
  if (T.totalBase === 6) reg['témoins = 6 seuls (nul)'][d.c === 'N' ? 0 : 1]++; });
console.log('\nAnciennes règles sur les matchs indépendants (appels justes / faux) :'); Object.entries(reg).forEach(([k, v]) => console.log('  ', k.padEnd(30), v[0], '/', v[1]));
// règle du propriétaire H-REPOS (deux fronts au repos, sans antagoniste) : appels sur les matchs indépendants et sur les matchs construits
for (const [nom, liste] of [['indépendants', indep], ['construits', data.filter(d => !d.indep)]]) { let ok = 0, faux = 0, si = 0; liste.forEach(d => { const g = M.repos(M.lire(d.m)).gagnant; if (!g) si++; else if (g === d.c) ok++; else faux++; }); console.log('H-REPOS sur les matchs ' + nom + ' : justes', ok, '| faux', faux, '| sans appel', si); }
// validation croisée d'une règle apprise (signe de l'écart R1 − R7 d'une mesure de structure)
const Lt = 'FAET';
function mesures(m) { const L = M.lire(m), P = M.poles(L), I = M.interactions(L), C = M.connexions(L), X = M.multiplicite(L), A = M.activation(L), TS = M.terreSaturee(L), n = M.noeuds(L), z1 = (L.R1.figure - 1) % 4, z7 = (L.R7.figure - 1) % 4, a = {}, b = {}, g = {};
  const put = (k, x, y) => { a[k] = x; b[k] = y; };
  ['front_', 'frontBinome', 'binome', 'antagoniste'].forEach(k => { put('sat ' + k, P.R1[k].saturation, P.R7[k].saturation); put('propres ' + k, P.R1[k].propres, P.R7[k].propres); put('empl ' + k, P.R1[k].emplacements, P.R7[k].emplacements); put('chez ' + k, P.R1[k].chezElle, P.R7[k].chezElle); });
  put('maison sat', P.R1.saturationMaison, P.R7.saturationMaison);
  ['boucle', 'front'].forEach(s => ['miroir', 'binome', 'paralysie', 'propre'].forEach(r => { for (let l = 0; l < 4; l++) put(s + ' ' + r + ' ' + Lt[l], I.R1[s][r][l], I.R7[s][r][l]); }));
  put('niveaux connectés', C.R1.n, C.R7.n); put('exposées', X.R1.exposees, X.R7.exposees); put('placements boucle', X.R1.total, X.R7.total); put('score4', A.R1.score4, A.R7.score4); put('Terre front', TS.parFront[z1], TS.parFront[z7]);
  put('sous croix', n.arrets.some(h => h.maison === L.R1.maison) ? 1 : 0, n.arrets.some(h => h.maison === L.R7.maison) ? 1 : 0);
  g.temoins = M.temoins(L).totalBase; g.binE = I.binomeEauEquilibre ? 1 : 0; g.T = TS.total; g.arrets = n.arrets.length; g.viaM8 = L.theme.bases[8] === 5 ? 1 : 0;
  return { a, b, g }; }
data.forEach(d => { d.f = mesures(d.m); });
const keys = Object.keys(dec[0].f.a);
const meilleure = train => { let best = null; for (const k of keys) for (const dir of [1, -1]) { let ok = 0; train.forEach(d => { const x = (d.f.a[k] - d.f.b[k]) * dir, p = x > 0 ? 'R1' : x < 0 ? 'R7' : 'R1'; if (p === d.c) ok++; }); if (!best || ok > best.ok) best = { k, dir, ok }; } return best; };
let hit = 0; dec.forEach((d, i) => { const r = meilleure(dec.filter((_, j) => j !== i)), x = (d.f.a[r.k] - d.f.b[r.k]) * r.dir, p = x > 0 ? 'R1' : x < 0 ? 'R7' : 'R1'; if (p === d.c) hit++; });
console.log('\nVainqueur (', dec.length, 'matchs décisifs ) : meilleure règle apprise, un match laissé de côté =', pct(hit, dec.length), 'contre « toujours R1 » =', pct(dec.filter(d => d.c === 'R1').length, dec.length));
const gk = ['temoins', 'binE', 'T', 'arrets', 'viaM8'];
const bn = train => { let best = null; for (const k of gk) for (let th = 0; th <= 12; th++) for (const dir of [1, -1]) { let ok = 0; train.forEach(d => { if (((d.f.g[k] - th) * dir >= 0) === (d.c === 'N')) ok++; }); if (!best || ok > best.ok) best = { k, th, dir, ok }; } return best; };
let h2 = 0; data.forEach((d, i) => { const r = bn(data.filter((_, j) => j !== i)); if (((d.f.g[r.k] - r.th) * r.dir >= 0) === (d.c === 'N')) h2++; });
console.log('Nul (', data.length, 'matchs ) : meilleur seuil appris, un match laissé de côté =', pct(h2, data.length), 'contre « jamais nul » =', pct(data.filter(d => d.c !== 'N').length, data.length));
