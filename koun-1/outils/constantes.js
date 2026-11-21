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
const t = { ouverte: [0, 0], m410ouverte: [0, 0], m410saturee: [0, 0] }; D.forEach(d => { const T = M.lire(d.m).theme, s1 = K.niveaux(A(T.bases[5], T.bases[7]))[3] === 2, s2 = K.niveaux(A(T.bases[4], T.bases[10]))[3] === 2, k = !s1 ? 'ouverte' : s2 ? 'm410saturee' : 'm410ouverte'; t[k][1]++; if (d.sc[0] > 0 && d.sc[1] > 0) t[k][0]++; });
const attendu = 'ouverte: { oui: ' + t.ouverte[0] + ', sur: ' + t.ouverte[1] + ' }, m410ouverte: { oui: ' + t.m410ouverte[0] + ', sur: ' + t.m410ouverte[1] + ' }, m410saturee: { oui: ' + t.m410saturee[0] + ', sur: ' + t.m410saturee[1] + ' }';
if (!src.includes(attendu)) err('témoins M5+M7 et M4+M10 : données ' + attendu);
let rp = 0, rn = 0; D.forEach(d => { const g = M.repos(M.lire(d.m)).gagnant; if (g) { rn++; if (g === (d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'N')) rp++; } });
if (!src.includes(rp + ' justes sur ' + rn + ' appels sur ' + D.length + ' matchs')) err('H-REPOS : données ' + rp + ' justes sur ' + rn + ' appels sur ' + D.length + ' matchs');
const dec = D.filter(d => d.sc[0] !== d.sc[1]); let c = { o: 0, n: 0, r1: 0 }; dec.forEach(d => { const g = M.coordonnees(M.lire(d.m)).gagnant; if (!g) return; c.n++; const r = d.sc[0] > d.sc[1] ? 'R1' : 'R7'; if (g === r) c.o++; if (r === 'R1') c.r1++; });
if (!src.includes(c.o + ' justes sur ' + c.n + ' appels sur ' + dec.length + ' matchs décisifs') || !src.includes('« toujours R1 » : ' + c.r1 + ' sur ' + c.n)) err('H-COORD-VICTOIRE : données ' + c.o + ' justes sur ' + c.n + ' appels sur ' + dec.length + ' matchs décisifs ; toujours R1 ' + c.r1 + ' sur ' + c.n);
const NV = { fort: [0, 0, 0, 0], 'freiné': [0, 0, 0, 0], faible: [0, 0, 0, 0], 'bloqué': [0, 0, 0, 0] }; D.forEach(d => { const L = M.lire(d.m), R = M.repos(L), q = M.marquage(L); [['R1', 0], ['R7', 1]].forEach(([p, i]) => { const k = q[p].n >= 2 ? (R[p].total ? 'fort' : 'freiné') : (R[p].total ? 'faible' : 'bloqué'), g = d.sc[i]; NV[k][0]++; if (g >= 1) NV[k][1]++; if (g >= 2) NV[k][2]++; NV[k][3] += g; }); });
const nv = Object.entries(NV).map(([k, v]) => (k === 'fort' || k === 'faible' ? k : "'" + k + "'") + ': { sur: ' + v[0] + ', un: ' + v[1] + ', deux: ' + v[2] + ', moy: ' + (v[3] / v[0]).toFixed(2).replace(/0$/, '').replace(/\.$/, '') + ' }').join(', ');
if (!src.includes(nv)) err('NIVEAUX_MARQUAGE : données ' + nv);
function err(m) { nbErr++; console.log('PÉRIMÉ :', m); }
console.log(D.length + ' matchs, ' + O.length + ' pôles-matchs ; chiffres périmés : ' + nbErr); process.exit(nbErr ? 1 : 0);
