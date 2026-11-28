// « Double concordance » (définition du propriétaire, 2026-11-26) : une maison diagonale M1, M6, M11, M16 (nœuds Feu², Air², Eau², Terre²) possède,
// en base, le niveau de son propre élément actif (1 point). Juventus–Venezia : M11 Albus, Eau active → concordance Eau.
// Lectures : pour un pôle, les niveaux i et j du nœud de sa maison sont-ils concordants (les deux / au moins un) ? Pour le match, nombre de concordances (0 à 4).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot, nom) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus', x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus', '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus', 'lot 2');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle', x.match)); lire('validation/resultats-aveugles-2026-11-25.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle', x.match));
const conc = (b, l) => K.niveaux(b[5 * l + 1])[l] === 1, noeud = h => [(h - 1) % 4, Math.floor((h - 1) / 4)];
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m) })), pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
const LP = { 'les deux niveaux du nœud du pôle concordants': (L, p) => noeud(L[p].maison).every(l => conc(L.theme.bases, l)), 'au moins un niveau du nœud du pôle concordant': (L, p) => noeud(L[p].maison).some(l => conc(L.theme.bases, l)) };
const J = D.find(d => /Juventus – Venezia/.test(d.nom)); console.log('Juventus : concordances ' + [0, 1, 2, 3].map(l => 'FAET'[l] + (conc(J.L.theme.bases, l) ? '✓' : '·')).join(' ') + ' · R1 M' + J.L.R1.maison + ' nœud ' + noeud(J.L.R1.maison).map(l => 'FAET'[l]).join('×') + ' · R7 M' + J.L.R7.maison + ' nœud ' + noeud(J.L.R7.maison).map(l => 'FAET'[l]).join('×') + '\n');
for (const [k, f] of Object.entries(LP)) { console.log(k); for (const lot of ['corpus', 'aveugle']) { let a = 0, n = 0, a0 = 0, n0 = 0; D.filter(d => d.lot === lot).forEach(d => ['R1', 'R7'].forEach((p, i) => { const v = f(d.L, p), m = d.sc[i] > 0; if (v) { n++; if (m) a++; } else { n0++; if (m) a0++; } }));
  console.log('    ' + lot.padEnd(8) + ' oui : marque ' + a + '/' + n + ' (' + pc(a, n) + ') · non : marque ' + a0 + '/' + n0 + ' (' + pc(a0, n0) + ')'); } }
const t = {}; D.forEach(d => { const c = [0, 1, 2, 3].filter(l => conc(d.L.theme.bases, l)).length; t[c] = t[c] || []; t[c].push(d.sc[0] + d.sc[1]); });
console.log('\nNombre de concordances dans le thème → buts moyens : ' + Object.keys(t).sort().map(c => c + ' → ' + (t[c].reduce((s, v) => s + v, 0) / t[c].length).toFixed(2) + ' (' + t[c].length + ')').join(' · '));
