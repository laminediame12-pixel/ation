// Recherche exhaustive des motifs du nul.
// 1) Toute lecture « niveau d'une maison ou d'une somme de maisons » est une parité des 16 points des mères : on teste les 65 535 parités.
// 2) Lectures liées aux pôles (maisons des pôles, fronts, verdict, marquage, défense, parité, coordonnées…).
// 3) Croisements (ET) des meilleures lectures deux à deux.
// Garde-fous : hasard par mélange des scores (maximum sur toutes les lectures) et validation « un match laissé de côté ».
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()]; const N = D.length, Y = D.map(d => d.sc[0] === d.sc[1] ? 1 : 0), NN = Y.reduce((a, b) => a + b), P0 = NN / N;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'];
const bits = m => { let x = 0; m.forEach((f, i) => K.niveaux(f).forEach((v, l) => { if (v === 1) x |= 1 << (4 * i + l); })); return x; };
const X = D.map(d => bits(d.m));
const pc = v => { v ^= v >> 16; v ^= v >> 8; v ^= v >> 4; v ^= v >> 2; v ^= v >> 1; return v & 1; };
console.log(N + ' matchs, ' + NN + ' nuls (' + Math.round(100 * P0) + ' %)\n');
const MIN = 10;
const zOf = (k, n) => (k - n * P0) / Math.sqrt(n * P0 * (1 - P0));
// ── 1. les 65 535 parités (et leur complément)
function scanLin(y) { let best = -1e9, bm = 0, bv = 0; for (let m = 1; m < 65536; m++) { let n1 = 0, k1 = 0; for (let i = 0; i < N; i++) if (pc(X[i] & m)) { n1++; k1 += y[i]; } const n0 = N - n1, k0 = NN - k1; if (n1 >= MIN) { const z = zOf(k1, n1); if (z > best) { best = z; bm = m; bv = 1; } } if (n0 >= MIN) { const z = zOf(k0, n0); if (z > best) { best = z; bm = m; bv = 0; } } } return { best, bm, bv }; }
const t0 = Date.now(), obs = scanLin(Y);
// traduire un masque en lecture du thème : niveau l de la somme d'au plus 3 maisons
const maskOf = (hs, l) => { let m = 0; for (let b = 0; b < 16; b++) { const mm = [1, 2, 3, 4].map((_, i) => (b >> 2) === i ? [1, 1, 1, 1].map((__, ll) => (b & 3) === ll ? 2 : 1) : [2, 2, 2, 2]).map(v => [...Array(16)].map((_, j) => j + 1).find(f => K.niveaux(f).join() === v.join())); const base = K.construire([16, 16, 16, 16]).bases, bb = K.construire(mm).bases; const v0 = K.niveaux(hs.map(h => base[h]).reduce(A))[l], v1 = K.niveaux(hs.map(h => bb[h]).reduce(A))[l]; if (v0 !== v1) m |= 1 << b; } return m; };
const dico = new Map(); for (let a = 1; a <= 16; a++) for (let b = a; b <= 16; b++) for (let c = b; c <= 16; c++) { const hs = [...new Set([a, b, c])]; for (let l = 0; l < 4; l++) { const m = maskOf(hs, l); if (m && !dico.has(m)) dico.set(m, NIV[l] + ' de M' + hs.join('+M')); } }
const lisible = m => dico.get(m) || 'parité des points (masque ' + m.toString(2).padStart(16, '0') + ')';
const etat = (m, v) => { const base = K.construire([16, 16, 16, 16]).bases; return v ? 'impair (ouvert)' : 'pair (saturé)'; };
const perm = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
let ge = 0; const NP = +process.argv[2] || 100; for (let t = 0; t < NP; t++) if (scanLin(perm(Y)).best >= obs.best) ge++;
{ let n = 0, k = 0; for (let i = 0; i < N; i++) if (pc(X[i] & obs.bm) === obs.bv) { n++; k += Y[i]; } console.log('1. parités des points des mères (65 535 lectures) : meilleure =', lisible(obs.bm), obs.bv ? 'ouvert' : 'saturé', '→', k, 'nuls sur', n, '(' + Math.round(100 * k / n) + ' %) ; atteinte par hasard dans', (100 * ge / NP).toFixed(0) + ' % des mélanges (' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)'); }
// top 15 parités
const top = []; for (let m = 1; m < 65536; m++) { let n1 = 0, k1 = 0; for (let i = 0; i < N; i++) if (pc(X[i] & m)) { n1++; k1 += Y[i]; } const n0 = N - n1, k0 = NN - k1; if (n1 >= MIN) top.push({ m, v: 1, n: n1, k: k1, z: zOf(k1, n1) }); if (n0 >= MIN) top.push({ m, v: 0, n: n0, k: k0, z: zOf(k0, n0) }); }
top.sort((a, b) => b.z - a.z); console.log('   les 10 meilleures :'); top.slice(0, 10).forEach(t => console.log('     ', (lisible(t.m) + ' ' + (t.v ? 'ouvert' : 'saturé')).padEnd(46), t.k + '/' + t.n));
// validation « un match laissé de côté » : choisir la meilleure parité sans le match, prédire « nul » si le match tombe dans la case choisie
{ let tp = 0, fp = 0, call = 0; for (let i = 0; i < N; i++) { let best = -1e9, bm = 0, bv = 0; const y = Y.slice(); const nn = NN - Y[i], p0 = nn / (N - 1); for (let m = 1; m < 65536; m++) { let n1 = 0, k1 = 0; for (let j = 0; j < N; j++) if (j !== i && pc(X[j] & m)) { n1++; k1 += Y[j]; } const n0 = N - 1 - n1, k0 = nn - k1, zz = (k, n) => (k - n * p0) / Math.sqrt(n * p0 * (1 - p0)); if (n1 >= MIN && zz(k1, n1) > best) { best = zz(k1, n1); bm = m; bv = 1; } if (n0 >= MIN && zz(k0, n0) > best) { best = zz(k0, n0); bm = m; bv = 0; } } if (pc(X[i] & bm) === bv) { call++; if (Y[i]) tp++; else fp++; } }
  console.log('   validation (un match laissé de côté) : la parité choisie annonce le nul dans', call, 'matchs : ', tp, 'nuls (' + (call ? Math.round(100 * tp / call) : 0) + ' %) contre', Math.round(100 * P0), '% au hasard'); }
// ── 2. lectures liées aux pôles
const L = D.map(d => M.lire(d.m)), fr = n => (n - 1) % 4;
const F = {};
const add = (k, f) => { F[k] = L.map((l, i) => { try { return String(f(l, D[i])); } catch (e) { return 'err'; } }); };
add('maison de R1', l => l.R1.maison); add('figure de R1', l => nm(l.R1.figure)); add('figure de R7', l => nm(l.R7.figure)); add('front de R1', l => 'ABCD'[fr(l.R1.figure)]); add('mode des pôles', l => l.mode); add('R1+R7', l => nm(l.lien));
add('verdict : catégorie', l => { const V = M.verdict(l); return V.v ? V.regle : 'sans appel'; }); add('verdict : niveau de nul', l => { const V = M.verdict(l); return V.nulExclu ? 'exclu' : V.nulFrequent ? 'fréquent' : V.nulPeuProbable ? 'peu probable' : 'possible'; });
add('marquage : niveaux R1 / R7', l => { const q = M.marquage(l); return q.R1.niveau + '/' + q.R7.niveau; }); add('marquage : n égaux', l => { const q = M.marquage(l); return q.R1.n === q.R7.n ? 'oui' : 'non'; });
add('parité EB : équilibrée R1 / R7', l => { const q = M.marquage(l); return (q.R1.parite.equilibre ? 'o' : 'n') + (q.R7.parite.equilibre ? 'o' : 'n'); }); add('parité EB : impairs égaux', l => { const q = M.marquage(l); return q.R1.parite.impairs === q.R7.parite.impairs ? 'oui' : 'non'; });
add('défense R1 / R7', l => { const f = M.defense(l); return f.R1.etat + '/' + f.R7.etat; }); add('défenses : même état', l => { const f = M.defense(l); return f.R1.tenue === f.R7.tenue ? 'oui' : 'non'; });
add('coordonnées : écart', l => M.coordonnees(l).ecart); add('diagonales : écart', l => M.diagonales(l).ecart); add('repos : gagnant', l => M.repos(l).gagnant || 'aucun');
add('rythme : but attendu', l => M.rythme(l).butAttendu ? 'oui' : 'non'); add('rythme : vitesse', l => M.rythme(l).vitesse); add('2e MT : marqueurs', l => M.secondeMiTemps(l).marqueurs.join('') || 'aucun');
add('incident : niveau', l => M.incident(l).niveau); add('incident : pôle', l => M.incident(l).parite.pole || 'aucun'); add('témoin deux marquent', l => M.marquage(l).temoin.deuxMarquent ? 'oui' : 'non');
add('ordre : R1 en M2', l => M.ordre(l).nulFrequent ? 'oui' : 'non'); add('moulin', l => M.moulin(l).actif ? 'oui' : 'non'); add('M3–M9', l => M.nulM3M9(l).actif ? 'oui' : 'non'); add('M1–M10 : deux arrêts', l => M.m1m10(l).deuxArrets ? 'oui' : 'non');
add('témoins/juge', l => { const j = M.temoinsJuge(l); return j.attaque ? 'attaque' : j.front ? 'front' : j.conteste ? 'conteste' : 'rien'; }); add('Rubeus', l => M.desequilibre(l).rubeus ? 'oui' : 'non');
add('chez elle : R1 / R7', l => (l.chezElle(l.R1.figure) ? 'o' : 'n') + (l.chezElle(l.R7.figure) ? 'o' : 'n'));
add('R1 et R7 même front', l => fr(l.R1.figure) === fr(l.R7.figure) ? 'oui' : 'non');
const cases = []; for (const [k, v] of Object.entries(F)) [...new Set(v)].forEach(val => { const x = v.map(z => z === val ? 1 : 0), n = x.reduce((a, b) => a + b); if (n >= MIN && n <= N - MIN) cases.push({ k, val, x, n }); });
const sc = (c, y) => { let k = 0; c.x.forEach((v, i) => { if (v && y[i]) k++; }); return { k, z: zOf(k, c.n) }; };
const ob2 = Math.max(...cases.map(c => sc(c, Y).z)); let ge2 = 0; for (let t = 0; t < 1000; t++) { const y = perm(Y); if (Math.max(...cases.map(c => sc(c, y).z)) >= ob2) ge2++; }
console.log('\n2. lectures liées aux pôles (' + cases.length + ' cases) : la meilleure est atteinte par hasard dans', (100 * ge2 / 1000).toFixed(1) + ' %');
cases.map(c => ({ c, ...sc(c, Y) })).sort((a, b) => b.z - a.z).slice(0, 10).forEach(r => console.log('     ', (r.c.k + ' = ' + r.c.val).padEnd(52), r.k + '/' + r.c.n, '(' + Math.round(100 * r.k / r.c.n) + ' %)'));
// ── 3. croisements deux à deux (ET) : 60 meilleures cases (parités + pôles)
const pool = top.slice(0, 40).map(t => ({ k: lisible(t.m) + ' ' + (t.v ? 'ouvert' : 'saturé'), x: X.map(x => pc(x & t.m) === t.v ? 1 : 0) })).concat(cases.map(c => ({ c, z: sc(c, Y).z })).sort((a, b) => b.z - a.z).slice(0, 20).map(r => ({ k: r.c.k + ' = ' + r.c.val, x: r.c.x })));
function bestPair(y) { let best = -1e9, bp = null; for (let a = 0; a < pool.length; a++) for (let b = a + 1; b < pool.length; b++) { let n = 0, k = 0; for (let i = 0; i < N; i++) if (pool[a].x[i] && pool[b].x[i]) { n++; k += y[i]; } if (n >= 8) { const z = zOf(k, n); if (z > best) { best = z; bp = { a, b, n, k }; } } } return { best, bp }; }
const ob3 = bestPair(Y); console.log('\n3. croisements deux à deux (' + pool.length + ' lectures) : meilleur =', pool[ob3.bp.a].k, 'ET', pool[ob3.bp.b].k, '→', ob3.bp.k, 'nuls sur', ob3.bp.n);
console.log('   (attention : le choix des 60 lectures et du meilleur croisement a vu les scores ; ce croisement n\'est qu\'une piste)');
