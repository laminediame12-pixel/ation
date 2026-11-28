// Y a-t-il, dans les 106 matchs déjà connus (80 du corpus + 26 à l'aveugle), un principe apprenable qui relie le thème au vainqueur ?
// On donne à un modèle TOUT le thème : niveaux des 16 bases et des 15 résultantes, puis la même chose vue depuis les pôles (front de R1, front de R7,
// et différence R1 − R7), et on le juge en validation croisée : chaque match est prédit par un modèle appris SANS lui. Rien n'est réglé après coup.
// Modèles : régression logistique régularisée (plusieurs forces), plus proches voisins (thèmes les plus semblables), et lecture par pôles seule.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number));
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score));
const D = [...tous.values()].filter(d => d.sc[0] !== d.sc[1]);   // vainqueur seulement (les nuls à part)
const bits = f => K.niveaux(f).map(v => v === 1 ? 1 : -1);
const front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
function vecteurs(d) {
  const L = M.lire(d.m), T = L.theme, rz = h => h < 16 ? T.resultantes[h] : T.bases[16];
  const tout = []; for (let h = 1; h <= 16; h++) tout.push(...bits(T.bases[h]), ...bits(rz(h)));
  const pole = c => { const o = []; front(c.figure).forEach(h => o.push(...bits(T.bases[h]), ...bits(rz(h)))); o.push(...bits(T.bases[c.maison]), ...bits(rz(c.maison)), ...bits(c.figure)); return o; };
  const p1 = pole(L.R1), p7 = pole(L.R7), diff = p1.map((v, i) => (v - p7[i]) / 2);
  return { tout, poles: p1.concat(p7), diff };
}
const X = D.map(vecteurs), y = D.map(d => d.sc[0] > d.sc[1] ? 1 : 0), N = D.length;
function logistique(Xs, ys, lam) { const p = Xs[0].length; let w = new Array(p + 1).fill(0); const lr = 0.05;
  for (let it = 0; it < 400; it++) { const g = new Array(p + 1).fill(0); for (let i = 0; i < Xs.length; i++) { let z = w[p]; for (let j = 0; j < p; j++) z += w[j] * Xs[i][j]; const e = 1 / (1 + Math.exp(-z)) - ys[i]; for (let j = 0; j < p; j++) g[j] += e * Xs[i][j]; g[p] += e; }
    for (let j = 0; j < p; j++) w[j] -= lr * (g[j] / Xs.length + lam * w[j]); w[p] -= lr * g[p] / Xs.length; } return x => { let z = w[p]; for (let j = 0; j < p; j++) z += w[j] * x[j]; return z; }; }
function voisins(Xs, ys, k) { return x => { const d = Xs.map((v, i) => [v.reduce((s, a, j) => s + (a - x[j]) ** 2, 0), ys[i]]).sort((a, b) => a[0] - b[0]).slice(0, k); return d.reduce((s, q) => s + (q[1] ? 1 : -1), 0); }; }
function croisee(nom, champ, fab, yy) { yy = yy || y; let ok = 0; for (let i = 0; i < N; i++) { const Xs = [], ys = []; for (let j = 0; j < N; j++) if (j !== i) { Xs.push(X[j][champ]); ys.push(yy[j]); } const f = fab(Xs, ys), s = f(X[i][champ]); if ((s > 0 ? 1 : 0) === yy[i]) ok++; } return ok; }
const base = Math.max(y.filter(v => v).length, y.filter(v => !v).length);
console.log(N + ' matchs avec un vainqueur (R1 gagne ' + y.filter(v => v).length + ', R7 gagne ' + y.filter(v => !v).length + ') ; référence « toujours la classe la plus fréquente » : ' + base + '/' + N + '\n');
const essais = [];
for (const [champ, lib] of [['tout', 'thème entier (' + X[0].tout.length + ' traits)'], ['poles', 'vu des deux pôles (' + X[0].poles.length + ' traits)'], ['diff', 'différence R1 − R7 (' + X[0].diff.length + ' traits)']]) {
  for (const lam of [0.3, 0.1, 0.03]) essais.push([lib + ' · logistique, régularisation ' + lam, champ, (a, b) => logistique(a, b, lam)]);
  for (const k of [5, 9, 15]) essais.push([lib + ' · ' + k + ' plus proches voisins', champ, (a, b) => voisins(a, b, k)]);
}
const res = essais.map(([nom, champ, fab]) => { const ok = croisee(nom, champ, fab); console.log('   ', nom.padEnd(64), ok + '/' + N, '(' + Math.round(100 * ok / N) + ' %)'); return { nom, champ, fab, ok }; });
// le meilleur modèle comparé au même meilleur choix quand on mélange les vainqueurs (le hasard a les mêmes chances de « gagner »)
const meilleur = Math.max(...res.map(r => r.ok)), NP = +process.argv[2] || 20; let g = 0;
for (let t = 0; t < NP; t++) { const q = y.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } const m = Math.max(...res.map(r => croisee(r.nom, r.champ, r.fab, q))); if (m >= meilleur) g++; }
console.log('\nMeilleur modèle : ' + meilleur + '/' + N + ' ; atteint ou dépassé avec des vainqueurs mélangés dans ' + g + ' essais sur ' + NP);
