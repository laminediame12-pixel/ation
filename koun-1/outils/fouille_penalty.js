// Fouille du penalty (2026-11-27). Algèbre : chaque figure g produit Caput en M(g+Caput) et Cauda en M(g+Cauda) ; ces deux maisons forment une paire Carcer
// (leurs figures de repos s'additionnent en Carcer) : M1-M7, M2-M8, M3-M13, M4-M14, M5-M11, M6-M12, M9-M15, M10-M16. Les résultantes d'une paire Carcer
// s'additionnent en Carcer exactement quand la même figure est posée dans les deux maisons (conflit, piste du propriétaire).
// 1. Les huit axes du dragon (deux figures par axe) ; 2. conflits Carcer ; 3. penalties inexpliqués et fausses alertes ; 4. camp. Contrôle par permutation.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const CAP = 3, CAU = 13, CAR = 10, PAIRES = [[1, 7], [2, 8], [3, 13], [4, 14], [5, 11], [6, 12], [9, 15], [10, 16]];
D.forEach(d => { const L = d.L = M.lire(d.m); d.b = L.theme.bases; d.r = L.theme.resultantes; d.pn = oui(d.pen) ? 1 : 0; d.rg = oui(d.rouge) ? 1 : 0; d.I = M.incidentVerdict(L); });
const ctrl = (lab, f, cible = 'pn') => { const y = D.map(d => d[cible]), X = D.map(f), A = D.filter((d, i) => X[i]), a = A.filter(d => d[cible]).length, a0 = y.reduce((s, v) => s + v, 0) - a; let k = 0;
  for (let t = 0; t < 3000; t++) { const z = y.slice().sort(() => Math.random() - 0.5); if (X.reduce((s, x, i) => s + (x ? z[i] : 0), 0) >= a) k++; }
  const h = [0, 1].map(p => { const S = D.filter((d, i) => i % 2 === p), B = S.filter(f); return B.filter(d => d[cible]).length + '/' + B.length + '·' + S.filter(d => !f(d) && d[cible]).length + '/' + (S.length - B.length); });
  console.log('  ' + lab.padEnd(62) + (a + '/' + A.length).padStart(6) + ' (' + Math.round(100 * a / (A.length || 1)) + ' % contre ' + Math.round(100 * a0 / (D.length - A.length)) + ' %) p ' + (k / 3000).toFixed(3) + '  moitiés ' + h.join(' | ')); };
console.log(D.length + ' matchs · penalty ' + D.filter(d => d.pn).length + ' · rouge ' + D.filter(d => d.rg).length);
console.log('\n1. LES HUIT AXES DU DRAGON (une des deux figures de l\'axe posée en base sur l\'axe, produisant Caput ou Cauda) — penalty');
const AXES = {}; for (let g = 1; g <= 16; g++) { const hc = K.additionner(g, CAP), hu = K.additionner(g, CAU), k = Math.min(hc, hu) + '-' + Math.max(hc, hu); (AXES[k] = AXES[k] || { h: [hc, hu], g: [] }).g.push(g); }
for (const [k, a] of Object.entries(AXES)) ctrl('axe M' + a.h.sort((x, y) => x - y).join('-M') + ' : ' + a.g.map(N).join(' / '), d => a.h.some(h => h < 16 && a.g.includes(d.b[h])));
console.log('   (même chose pour le rouge, pour mémoire)'); for (const [k, a] of Object.entries(AXES)) ctrl('axe M' + a.h.join('-M') + ' : ' + a.g.map(N).join(' / '), d => a.h.some(h => h < 16 && a.g.includes(d.b[h])), 'rg');
console.log('\n2. CONFLITS CARCER (même figure posée dans les deux maisons d\'une paire : leurs résultantes s\'additionnent en Carcer) — penalty');
const conf = d => PAIRES.filter(([h, p]) => d.b[h] === d.b[p]);
ctrl('au moins un conflit Carcer (8 paires)', d => conf(d).length > 0); ctrl('au moins un conflit sur les maisons opposées h/h+6 (M1-M7, M2-M8, M5-M11, M6-M12)', d => conf(d).some(([h]) => [1, 2, 5, 6].includes(h)));
ctrl('deux conflits Carcer ou plus', d => conf(d).length >= 2); ctrl('conflit Carcer touchant la maison d\'un pôle', d => conf(d).some(([h, p]) => [d.L.R1.maison, d.L.R7.maison].includes(h) || [d.L.R1.maison, d.L.R7.maison].includes(p)));
ctrl('conflit Carcer avec la figure d\'un pôle', d => conf(d).some(([h]) => [d.L.R1.figure, d.L.R7.figure].includes(d.b[h])));
for (const [h, p] of PAIRES) ctrl('   conflit sur M' + h + '-M' + p, d => d.b[h] === d.b[p]);
console.log('\n3. AXE M5-M11 (Laetitia / Tristitia) AVEC LES SIGNES ACTUELS — penalty');
const dJ = d => [5, 11].filter(h => d.b[h] === 2 || d.b[h] === 8), sA = d => d.I.penalty.arret, s16 = d => !!d.I.penalty.sentence;
ctrl('dragon M5-M11 seul', d => dJ(d).length > 0);
ctrl('dragon M5-M11 par Laetitia', d => dJ(d).some(h => d.b[h] === 2)); ctrl('dragon M5-M11 par Tristitia', d => dJ(d).some(h => d.b[h] === 8));
ctrl('dragon M5-M11 en M5', d => dJ(d).includes(5)); ctrl('dragon M5-M11 en M11', d => dJ(d).includes(11));
ctrl('signes actuels (arrêt avec fronts non alliés, ou figure d\'un pôle en M16)', d => sA(d) || s16(d));
ctrl('signes actuels OU dragon M5-M11', d => sA(d) || s16(d) || dJ(d).length > 0);
const T = {}; D.forEach(d => { const n = (sA(d) ? 1 : 0) + (s16(d) ? 1 : 0) + (dJ(d).length ? 1 : 0); T[n] = T[n] || [0, 0]; T[n][0] += d.pn; T[n][1]++; });
console.log('  échelle à trois signes : ' + Object.keys(T).sort().map(n => n + ' signe(s) ' + T[n][0] + '/' + T[n][1] + ' (' + Math.round(100 * T[n][0] / T[n][1]) + ' %)').join(' · '));
console.log('\n4. PENALTIES QUE RIEN N\'EXPLIQUE (aucun des trois signes)');
const FR = 'ABCD', fr = f => (f - 1) % 4;
D.filter(d => d.pn && !sA(d) && !s16(d) && !dJ(d).length).forEach(d => console.log('  ' + d.nom.padEnd(34) + ('pour ' + d.pen).padEnd(22) + 'R1 ' + N(d.L.R1.figure) + ' (M' + d.L.R1.maison + ', ' + FR[fr(d.L.R1.figure)] + ') · R7 ' + N(d.L.R7.figure) + ' (M' + d.L.R7.maison + ', ' + FR[fr(d.L.R7.figure)] + ') · M5 ' + N(d.b[5]) + ' · M11 ' + N(d.b[11]) + ' · M16 ' + N(d.b[16]) + ' · arrêts ' + (d.I.arrets.length ? 'M' + d.I.arrets.join(',M') : '—') + ' · fronts ' + d.I.fronts));
console.log('\n5. CAMP AVEC LE DRAGON M5-M11 (penalties à un seul camp)');
const P = D.filter(d => d.pn && !/R1 et R7/.test(d.pen)), pour = d => d.pen.includes('R1') ? 'R1' : 'R7';
P.filter(d => dJ(d).length).forEach(d => { const rel = p => dJ(d).map(h => { const z = fr(d.L[p].figure), g = fr(d.b[h]), AT = { 0: 3, 1: 0, 3: 2, 2: 1 }; return z === g ? 'même' : AT[g] === z ? 'attaqué' : AT[z] === g ? 'attaque' : 'allié'; }).join('/');
  console.log('  ' + d.nom.padEnd(34) + dJ(d).map(h => N(d.b[h]) + ' M' + h).join(', ').padEnd(26) + 'R1 ' + N(d.L.R1.figure).padEnd(14) + rel('R1').padEnd(10) + 'R7 ' + N(d.L.R7.figure).padEnd(14) + rel('R7').padEnd(10) + 'obtenu ' + pour(d) + ' · règle actuelle ' + d.I.penalty.camp + ' (' + d.I.penalty.pourquoi + ')'); });
console.log('\n6. PÔLES LOGÉS SUR UN AXE, ET ATTAQUE DE R1 — penalty (et rouge pour mémoire)');
const ax = d => { const h = Math.min(d.L.R1.maison, d.L.R7.maison) ; return d.L.R1.maison + '-' + d.L.R7.maison; };
ctrl('pôles logés sur l\'axe M5-M11', d => [5, 11].includes(d.L.R1.maison));
ctrl('pôles logés sur l\'axe M6-M12', d => [6, 12].includes(d.L.R1.maison)); ctrl('pôles logés sur l\'axe M6-M12 (rouge)', d => [6, 12].includes(d.L.R1.maison), 'rg');
const TA = {}; D.forEach(d => { const k = 'R1 en M' + d.L.R1.maison; TA[k] = TA[k] || [0, 0, 0]; TA[k][0] += d.pn; TA[k][1] += d.rg; TA[k][2]++; }); console.log('  par maison de R1 : ' + Object.keys(TA).sort((a, b) => +a.slice(7) - +b.slice(7)).map(k => k.slice(3) + ' pen ' + TA[k][0] + '/' + TA[k][2] + ' rouge ' + TA[k][1]).join(' · '));
ctrl('le front de R1 attaque celui de R7', d => d.I.fronts === 'R1');
ctrl('(arrêt et fronts non alliés) ou front de R1 qui attaque', d => (d.I.penalty.arret) || d.I.fronts === 'R1');
const S3 = d => (sA(d) ? 1 : 0) + (s16(d) ? 1 : 0) + (dJ(d).length ? 1 : 0);
const S4 = d => ((sA(d) || d.I.fronts === 'R1') ? 1 : 0) + (s16(d) ? 1 : 0) + (dJ(d).length ? 1 : 0);
for (const [lab, f] of [['échelle S3 (arrêt ; M16 ; dragon M5-M11)', S3], ['échelle S4 (arrêt ou attaque de R1 ; M16 ; dragon M5-M11)', S4]]) { const T = {}; D.forEach(d => { const n = Math.min(f(d), 2); T[n] = T[n] || [0, 0]; T[n][0] += d.pn; T[n][1]++; }); console.log('  ' + lab.padEnd(60) + Object.keys(T).sort().map(n => n + (n === '2' ? '+' : '') + ' : ' + T[n][0] + '/' + T[n][1] + ' (' + Math.round(100 * T[n][0] / T[n][1]) + ' %)').join(' · ')); }
console.log('\n7. FAUSSES ALERTES : matchs à signe (S3 ≥ 1) avec et sans penalty — signes qui les séparent');
const G = D.filter(d => S3(d) > 0), yG = G.map(d => d.pn), CANAL = [4, 8, 12, 13, 14, 15];
const F = {
  'arrêt en canal Terre': d => d.I.arrets.some(h => CANAL.includes(h)), 'arrêt sur un nœud double (M1, M6, M11)': d => d.I.arrets.some(h => [1, 6, 11].includes(h)),
  'arrêt dans la boucle d\'un pôle': d => d.I.arrets.some(h => fr(h) === fr(d.L.R1.figure) || fr(h) === fr(d.L.R7.figure)), 'arrêt entre les fronts des pôles': d => d.I.arrets.some(h => { const a = fr(d.b[h]), v = fr(h), f1 = fr(d.L.R1.figure), f7 = fr(d.L.R7.figure); return (a === f1 && v === f7) || (a === f7 && v === f1); }),
  'deux arrêts ou plus': d => d.I.arrets.length >= 2, 'R1 bloqué': d => M.blocages(d.L, 'R1').length > 0, 'R7 bloqué': d => M.blocages(d.L, 'R7').length > 0, 'dragon M6-M12 (rouge)': d => [6, 12].some(h => d.b[h] === 7 || d.b[h] === 1),
  'M11 plein (Eau²)': d => K.niveaux(d.r[11])[2] === 2, 'M6 plein (Air²)': d => K.niveaux(d.r[6])[1] === 2, 'M1 plein (Feu²)': d => K.niveaux(d.r[1])[0] === 2,
  'les deux pôles marquent': d => M.marquePole(d.L, 'R1').marque && M.marquePole(d.L, 'R7').marque, 'aucun pôle ne marque': d => !M.marquePole(d.L, 'R1').marque && !M.marquePole(d.L, 'R7').marque,
  'juge M15 : Terre saturée': d => K.niveaux(d.r[15])[3] === 2, 'juge M15 : Feu saturé': d => K.niveaux(d.r[15])[0] === 2, 'Populus en base': d => d.b.slice(1).includes(16), 'figures chez elles ≥ 2': d => [...Array(15)].filter((_, i) => d.b[i + 1] === i + 1).length >= 2,
  'conflit Carcer': d => PAIRES.some(([h, p]) => d.b[h] === d.b[p]), 'Caput et Cauda en résultante': d => d.r.slice(1, 16).includes(CAP) && d.r.slice(1, 16).includes(CAU), 'un pôle Caput ou Cauda': d => [3, 13].includes(d.L.R1.figure) || [3, 13].includes(d.L.R7.figure),
  'un pôle Laetitia ou Tristitia': d => [2, 8].includes(d.L.R1.figure) || [2, 8].includes(d.L.R7.figure), 'front de R1 qui attaque': d => d.I.fronts === 'R1', 'fronts alliés': d => d.I.fronts === 'allies', 'même front': d => d.I.fronts === 'meme' };
const eff = (y, f) => { let a = 0, n = 0, a0 = 0, n0 = 0; G.forEach((d, i) => { if (f(d)) { n++; a += y[i]; } else { n0++; a0 += y[i]; } }); return { a, n, a0, n0, e: n >= 5 && n0 >= 5 ? a / n - a0 / n0 : 0 }; };
const rows = Object.entries(F).map(([k, f]) => ({ k, ...eff(yG, f) })).sort((a, b) => Math.abs(b.e) - Math.abs(a.e)), mx = [];
for (let t = 0; t < 1000; t++) { const z = yG.slice().sort(() => Math.random() - 0.5); mx.push(Math.max(...Object.values(F).map(f => Math.abs(eff(z, f).e)))); } mx.sort((a, b) => a - b);
console.log('  ' + G.length + ' matchs à signe, ' + yG.reduce((a, b) => a + b, 0) + ' penalties · seuil du hasard (95e) ' + mx[950].toFixed(2));
rows.slice(0, 10).forEach(o => console.log('    ' + (o.e > 0 ? '+' : '') + o.e.toFixed(2) + '  ' + (Math.round(100 * o.a / o.n) + ' %').padStart(5) + ' (' + o.a + '/' + o.n + ') contre ' + Math.round(100 * o.a0 / o.n0) + ' %  ' + o.k + (Math.abs(o.e) >= mx[950] ? '   ← au-delà du hasard' : '')));
console.log('\n8. ÉCHELLE S4 : DÉTAIL ET CONTRÔLES');
{ const T = {}; D.forEach(d => { const n = S4(d); T[n] = T[n] || [0, 0]; T[n][0] += d.pn; T[n][1]++; }); console.log('  ' + Object.keys(T).sort().map(n => n + ' signe(s) ' + T[n][0] + '/' + T[n][1]).join(' · ')); }
ctrl('S4 ≥ 1', d => S4(d) >= 1); ctrl('S4 ≥ 2', d => S4(d) >= 2);
console.log('  les deux penalties sans signe : ' + D.filter(d => d.pn && S4(d) === 0).map(d => d.nom + ' (' + d.pen + ')').join(' ; '));
