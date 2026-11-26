// Correction du propriétaire (2026-11-26) : le front direct d'une figure f est la figure suivante de son front, f + 4 (Puer → Via, et non l'inverse ;
// Aquisitio → Caput, pas Conjunctio). Circulation du flux (carte en croix : haut f, droite f+4, bas f+8, gauche f+12) : le pôle se lie à son front direct
// par le canal Terre, et à son miroir (f+8) par les trois autres canaux ; le front direct se lie de même à son miroir (f+12), où revient le canal Terre.
// Règle de marquage corrigée : un pôle marque si lui-même ou son front direct (f+4) est posé dans une maison des canaux Terre (M4, M8, M12, M13, M14, M15)
// saturée par un point 1 de la base, Terre de la résultante ouverte. Variantes : sans la condition Terre ouverte ; front direct seul ; avec le miroir.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot, nom) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus', x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus', '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus', 'lot 2');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle', x.match)); lire('validation/resultats-aveugles-2026-11-25.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle', x.match));
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, imp = f => K.niveaux(f).map(v => v === 1 ? 1 : 0), C6 = [4, 8, 12, 13, 14, 15];
const rouge = (b, h) => [0, 1, 2, 3].some(l => imp(b[h])[l] && imp(h)[l]), ouverte = (L, h) => K.niveaux(L.theme.resultantes[h])[3] !== 2;
const marque = (L, p, figs, terre) => { const b = L.theme.bases; return C6.filter(h => figs.includes(b[h]) && rouge(b, h) && (!terre || ouverte(L, h))); };
const VAR = {
  'lui-même ou son front direct (f+4), Terre ouverte [règle corrigée]': (L, p) => marque(L, p, [L[p].figure, mod(L[p].figure + 4)], true),
  'lui-même ou son front direct, sans condition Terre': (L, p) => marque(L, p, [L[p].figure, mod(L[p].figure + 4)], false),
  'front direct seul (f+4), Terre ouverte': (L, p) => marque(L, p, [mod(L[p].figure + 4)], true),
  'lui-même, front direct ou miroir (f+8), Terre ouverte': (L, p) => marque(L, p, [L[p].figure, mod(L[p].figure + 4), mod(L[p].figure + 8)], true),
};
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m) })), pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
const J = D.find(d => /Juventus – Venezia/.test(d.nom)), k0 = Object.keys(VAR)[0];
console.log('Juventus – Venezia (4-0) : R1 ' + K.nom(J.L.R1.figure) + ' (front direct ' + K.nom(mod(J.L.R1.figure + 4)) + ') → ' + (VAR[k0](J.L, 'R1').length ? 'marque (M' + VAR[k0](J.L, 'R1').join(', M') + ')' : 'ne marque pas') + ' · R7 ' + K.nom(J.L.R7.figure) + ' (front direct ' + K.nom(mod(J.L.R7.figure + 4)) + ') → ' + (VAR[k0](J.L, 'R7').length ? 'marque' : 'ne marque pas') + '\n');
console.log(D.length + ' matchs, ' + 2 * D.length + ' pôles ; un pôle marque dans ' + pc(D.reduce((s, d) => s + (d.sc[0] > 0) + (d.sc[1] > 0), 0), 2 * D.length) + ' des cas\n');
for (const [k, f] of Object.entries(VAR)) { console.log(k); for (const lot of ['corpus', 'aveugle']) { let a = 0, n = 0, a0 = 0, n0 = 0; D.filter(d => d.lot === lot).forEach(d => ['R1', 'R7'].forEach((p, i) => { const v = f(d.L, p).length > 0, m = d.sc[i] > 0; if (v) { n++; if (m) a++; } else { n0++; if (m) a0++; } }));
  console.log('    ' + lot.padEnd(8) + ' figure marquante : marque ' + a + '/' + n + ' (' + pc(a, n) + ') · aucune : marque ' + a0 + '/' + n0 + ' (' + pc(a0, n0) + ')'); } }
