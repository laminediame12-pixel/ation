// Vérifie que les chiffres écrits dans le moteur (fréquences du marquage, témoin M5+M7, bilans de H-REPOS et H-COORD-VICTOIRE) correspondent au corpus actuel.
// Usage : node outils/constantes.js   (sortie 1 si un chiffre est périmé)
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), src = fs.readFileSync(path.join(R, 'moteur4/moteur.js'), 'utf8');
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()]; let nbErr = 0;
const O = []; D.forEach(d => { const q = M.marquage(M.lire(d.m)); O.push({ n: q.R1.n, g: d.sc[0] }, { n: q.R7.n, g: d.sc[1] }); });
if (!src.includes(O.length + ' pôles-matchs')) err('nombre de pôles-matchs : données ' + O.length);
const t = { ouverte: [0, 0], binomePlace: [0, 0], m410ouverte: [0, 0], m410saturee: [0, 0] }; D.forEach(d => { const q = M.marquage(M.lire(d.m)).temoin, k = !q.terreSaturee ? 'ouverte' : q.binomePlace ? 'binomePlace' : q.terre2Saturee ? 'm410saturee' : 'm410ouverte'; t[k][1]++; if (d.sc[0] > 0 && d.sc[1] > 0) t[k][0]++; });
const attendu = Object.keys(t).map(k => k + ': { oui: ' + t[k][0] + ', sur: ' + t[k][1] + ' }').join(', ');
if (!src.includes(attendu)) err('témoins M5+M7 et M4+M10 : données ' + attendu);
const VS = {}; D.forEach(d => { const L = M.lire(d.m), q = M.marquage(L), C = M.coordonnees(L), R = M.repos(L), t = Math.sign(M.diagonales(L).ecart), c = Math.sign(C.ecart), rp = R.gagnant === 'R1' ? 1 : R.gagnant === 'R7' ? -1 : 0, r = d.sc[0] > d.sc[1] ? 1 : d.sc[0] < d.sc[1] ? -1 : 0; let k, v; if (t && t === c) { k = 'accord'; v = t; } else if (rp) { k = 'repos'; v = rp; } else if (t && !c) { k = 'terre'; v = t; } else if (c && !t) { k = 'coord'; v = c; } else if (t && c) { k = 'oppose'; v = 0; } else { k = 'rien'; v = 0; } const o = VS[k] = VS[k] || { ok: 0, ko: 0, n: 0 }; o.n++; if (v) { if (!r) o.nul++; else if (v === r) o.ok++; else o.ko++; } });
const vs = ['accord', 'repos', 'terre', 'coord'].map(k => k + ': { ok: ' + (VS[k] || {}).ok + ', ko: ' + (VS[k] || {}).ko + ', n: ' + (VS[k] || {}).n + ' }').join(', ') + ', oppose: { n: ' + ((VS.oppose || {}).n || 0) + ' }, rien: { n: ' + ((VS.rien || {}).n || 0) + ' }';
if (!src.includes('VERDICT_STATS = { ' + vs + ' }')) err('VERDICT_STATS : données { ' + vs + ' }');
const NV = { fort: [0, 0, 0, 0], 'freiné': [0, 0, 0, 0], faible: [0, 0, 0, 0], 'bloqué': [0, 0, 0, 0] }; D.forEach(d => { const L = M.lire(d.m), R = M.repos(L), q = M.marquage(L); [['R1', 0], ['R7', 1]].forEach(([p, i]) => { const k = q[p].n >= 2 ? (R[p].total ? 'fort' : 'freiné') : (R[p].total ? 'faible' : 'bloqué'), g = d.sc[i]; NV[k][0]++; if (g >= 1) NV[k][1]++; if (g >= 2) NV[k][2]++; NV[k][3] += g; }); });
const nv = Object.entries(NV).map(([k, v]) => (k === 'fort' || k === 'faible' ? k : "'" + k + "'") + ': { sur: ' + v[0] + ', un: ' + v[1] + ', deux: ' + v[2] + ', moy: ' + (v[3] / v[0]).toFixed(2).replace(/0$/, '').replace(/\.$/, '') + ' }').join(', ');
if (!src.includes(nv)) err('NIVEAUX_MARQUAGE : données ' + nv);
const SR = lire('validation/scores-reels.json'), vu2 = new Set(); let d2 = { o: 0, n: 0 }, a2 = { o: 0, n: 0 }; SR.forEach(x => { const k = x.themes.join('-'); if (!Array.isArray(x.mi_temps) || vu2.has(k)) return; vu2.add(k); const S = M.secondeMiTemps(M.lire(x.themes)); ['R1', 'R7'].forEach((p, i) => { const o = S.marqueurs.includes(p) ? d2 : a2; o.n++; if (x.score[i] - x.mi_temps[i] > 0) o.o++; }); });
if (!src.includes('designees: { oui: ' + d2.o + ', sur: ' + d2.n + ' }, autres: { oui: ' + a2.o + ', sur: ' + a2.n + ' }')) err('2e mi-temps : désignées ' + d2.o + '/' + d2.n + ', autres ' + a2.o + '/' + a2.n);
const pa = { e: [0, 0], a: [0, 0] }; D.forEach(d => { const q = M.marquage(M.lire(d.m)); [['R1', 0], ['R7', 1]].forEach(([p, i]) => { const o = q[p].parite.equilibre ? pa.e : pa.a; o[1]++; if (d.sc[i] > 0) o[0]++; }); });
if (!src.includes('PARITE_OBS = { equilibre: { oui: ' + pa.e[0] + ', sur: ' + pa.e[1] + ' }, autre: { oui: ' + pa.a[0] + ', sur: ' + pa.a[1] + ' } }')) err('parité EB : équilibre ' + pa.e + ' autre ' + pa.a);
const ip = { s: [0, 0], a: [0, 0] }, vuI = new Set(); lire('validation/scores-reels.json').forEach(x => { const k = x.themes.join('-'); if (vuI.has(k) || !('penalty' in x)) return; vuI.add(k); const o = M.pariteIncident(M.lire(x.themes)).pole ? ip.s : ip.a, y = v => v === 'R1' || v === 'R7'; o[1]++; if (y(x.penalty) || y(x.rouge)) o[0]++; });
if (!src.includes('INCIDENT_PARITE_OBS = { seul: { incident: ' + ip.s[0] + ', sur: ' + ip.s[1] + ' }, autres: { incident: ' + ip.a[0] + ', sur: ' + ip.a[1] + ' } }')) err('parité de l\'incident : seul ' + ip.s + ' autres ' + ip.a);
const mz = { ok: 0, ko: 0, n: 0 }; D.forEach(d => { const L = M.lire(d.m), V = M.verdict(L); if (V.regle !== 'H-M1-M10') return; mz.n++; const r = Math.sign(d.sc[0] - d.sc[1]); if (r > 0) mz.ok++; else if (r < 0) mz.ko++; });
if (!src.includes('M1M10_STATS = { ok: ' + mz.ok + ', ko: ' + mz.ko + ', n: ' + mz.n + ' }')) err('relais M1–M10 : ' + JSON.stringify(mz));
const df = {}; D.forEach(d => { const L = M.lire(d.m), F = M.defense(L); [['R1', 1], ['R7', 0]].forEach(([p, i]) => { const e = F[p].etat; df[e] = df[e] || { sur: 0, encaisses: 0 }; df[e].sur++; df[e].encaisses += d.sc[i]; }); });
const dfs = "DEFENSE_OBS = { 'percée': { sur: " + df['percée'].sur + ", encaisses: " + df['percée'].encaisses + " }, 'attaque bloquée': { sur: " + df['attaque bloquée'].sur + ", encaisses: " + df['attaque bloquée'].encaisses + " }, 'protégée': { sur: " + df['protégée'].sur + ", encaisses: " + df['protégée'].encaisses + " }, calme: { sur: " + df.calme.sur + ", encaisses: " + df.calme.encaisses + " } }";
if (!src.includes(dfs)) err('défense : ' + dfs);
const ar = { avec: [0, 0, 0, 0], sans: [0, 0, 0, 0] }; D.forEach(d => { const o = M.arrets(M.lire(d.m)).nombre ? ar.avec : ar.sans, g = d.sc[0] + d.sc[1]; o[0]++; o[1] += g; if (g > 2.5) o[2]++; if (g > 3.5) o[3]++; });
const ars = 'ARRETS_OBS = { avec: { sur: ' + ar.avec.join(', ').replace(/^(\d+), (\d+), (\d+), (\d+)$/, '$1, buts: $2, plus25: $3, plus35: $4') + ' }, sans: { sur: ' + ar.sans.join(', ').replace(/^(\d+), (\d+), (\d+), (\d+)$/, '$1, buts: $2, plus25: $3, plus35: $4') + ' } }';
if (!src.includes(ars)) err('arrêts : ' + ars);
function err(m) { nbErr++; console.log('PÉRIMÉ :', m); }
console.log(D.length + ' matchs, ' + O.length + ' pôles-matchs ; chiffres périmés : ' + nbErr); process.exit(nbErr ? 1 : 0);
