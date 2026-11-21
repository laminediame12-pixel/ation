// Vérifie que les chiffres écrits dans le moteur (fréquences du marquage, témoin M5+M7, bilans de H-REPOS et H-COORD-VICTOIRE) correspondent au corpus actuel.
// Usage : node outils/constantes.js   (sortie 1 si un chiffre est périmé)
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), src = fs.readFileSync(path.join(R, 'moteur4/moteur.js'), 'utf8');
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()]; let nbErr = 0;
const O = []; D.forEach(d => { const q = M.marquage(M.lire(d.m)); O.push({ n: q.R1.n, g: d.sc[0] }, { n: q.R7.n, g: d.sc[1] }); });
const f2 = x => x.toFixed(2), P2 = [], P1 = [], MO = [];
[0, 1, 2, 3, 4].forEach(n => { const o = O.filter(x => x.n === n); P2.push('{ p: ' + f2(o.filter(x => x.g >= 2).length / o.length) + ', obs: ' + o.length + ' }'); P1.push(f2(o.filter(x => x.g >= 1).length / o.length)); MO.push(+(o.reduce((a, x) => a + x.g, 0) / o.length).toFixed(1)); });
const lu = re => ((src.match(re) || [])[1] || '').replace(/\s+/g, ' ');
if (lu(/MARQUAGE_P2 = \[([^\]]+)\]/).trim() !== P2.join(', ')) err('MARQUAGE_P2 : moteur [' + lu(/MARQUAGE_P2 = \[([^\]]+)\]/) + '] données [' + P2.join(', ') + ']');
if (lu(/MARQUAGE_P1 = \[([^\]]+)\]/).split(',').map(x => (+x).toFixed(2)).join(',') !== P1.join(',')) err('MARQUAGE_P1 : moteur [' + lu(/MARQUAGE_P1 = \[([^\]]+)\]/) + '] données [' + P1.join(', ') + ']');
if (lu(/MARQUAGE_MOYENNES = \[([^\]]+)\]/).split(',').map(x => +x).join(',') !== MO.join(',')) err('MARQUAGE_MOYENNES : données [' + MO.join(', ') + ']');
if (!src.includes(O.length + ' pôles-matchs')) err('nombre de pôles-matchs : données ' + O.length);
const t = { ouverte: [0, 0], m410ouverte: [0, 0], m410saturee: [0, 0] }; D.forEach(d => { const T = M.lire(d.m).theme, s1 = K.niveaux(A(T.bases[5], T.bases[7]))[3] === 2, s2 = K.niveaux(A(T.bases[4], T.bases[10]))[3] === 2, k = !s1 ? 'ouverte' : s2 ? 'm410saturee' : 'm410ouverte'; t[k][1]++; if (d.sc[0] > 0 && d.sc[1] > 0) t[k][0]++; });
const attendu = 'ouverte: { oui: ' + t.ouverte[0] + ', sur: ' + t.ouverte[1] + ' }, m410ouverte: { oui: ' + t.m410ouverte[0] + ', sur: ' + t.m410ouverte[1] + ' }, m410saturee: { oui: ' + t.m410saturee[0] + ', sur: ' + t.m410saturee[1] + ' }';
if (!src.includes(attendu)) err('témoins M5+M7 et M4+M10 : données ' + attendu);
let rp = 0, rn = 0; D.forEach(d => { const g = M.repos(M.lire(d.m)).gagnant; if (g) { rn++; if (g === (d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'N')) rp++; } });
if (!src.includes(rp + ' justes sur ' + rn + ' appels sur ' + D.length + ' matchs')) err('H-REPOS : données ' + rp + ' justes sur ' + rn + ' appels sur ' + D.length + ' matchs');
const dec = D.filter(d => d.sc[0] !== d.sc[1]); let c = { o: 0, n: 0, r1: 0 }; dec.forEach(d => { const g = M.coordonnees(M.lire(d.m)).gagnant; if (!g) return; c.n++; const r = d.sc[0] > d.sc[1] ? 'R1' : 'R7'; if (g === r) c.o++; if (r === 'R1') c.r1++; });
if (!src.includes(c.o + ' justes sur ' + c.n + ' appels sur ' + dec.length + ' matchs décisifs') || !src.includes('« toujours R1 » : ' + c.r1 + ' sur ' + c.n)) err('H-COORD-VICTOIRE : données ' + c.o + ' justes sur ' + c.n + ' appels sur ' + dec.length + ' matchs décisifs ; toujours R1 ' + c.r1 + ' sur ' + c.n);
function err(m) { nbErr++; console.log('PÉRIMÉ :', m); }
console.log(D.length + ' matchs, ' + O.length + ' pôles-matchs ; chiffres périmés : ' + nbErr); process.exit(nbErr ? 1 : 0);
