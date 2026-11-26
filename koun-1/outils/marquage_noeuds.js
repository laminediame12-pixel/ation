// Précision du propriétaire (2026-11-26, exemple Juventus – Venezia 4-0) : une figure marque quand elle sature les niveaux du nœud de sa maison
// (chaque maison h est le croisement des niveaux i = (h−1) mod 4 et j = ⌊(h−1)/4⌋ : M1 Feu², M6 Air², M11 Eau², M16 Terre², M9 Feu×Eau, M13 Feu×Terre…).
// Les canaux Terre (M4, M8, M12, M13, M14, M15) sont les nœuds qui touchent la Terre. Juventus : R1 = Populus en M9 (Feu×Eau) sature Feu et Eau.
// Lectures (figure de son front, lui compris, posée dans la maison) :
//   N1 : la figure posée sature les deux niveaux du nœud de sa maison (en base)
//   N2 : idem, seulement dans les canaux Terre
//   N3 : la résultante de la maison sature les deux niveaux du nœud
//   N4 : la figure du pôle elle-même, dans la maison du pôle, sature les niveaux de son nœud
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot, nom) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus', x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus', '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus', 'lot 2');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle', x.match)); lire('validation/resultats-aveugles-2026-11-25.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle', x.match));
const noeud = h => [(h - 1) % 4, Math.floor((h - 1) / 4)], sat = (f, h) => noeud(h).every(l => K.niveaux(f)[l] === 2);
const front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; }, CANAL = [4, 8, 12, 13, 14, 15];
const rz = (L, h) => h < 16 ? L.theme.resultantes[h] : L.theme.bases[16];
const LECT = {
  'N1 · figure du front saturant le nœud de sa maison (base)': (L, p) => [...Array(16)].some((_, i) => { const h = i + 1, f = L.theme.bases[h]; return front(L[p].figure).includes(f) && sat(f, h); }),
  'N2 · idem, dans les canaux Terre seulement': (L, p) => CANAL.some(h => { const f = L.theme.bases[h]; return front(L[p].figure).includes(f) && sat(f, h); }),
  'N3 · figure du front dont la résultante sature le nœud': (L, p) => [...Array(16)].some((_, i) => { const h = i + 1, f = L.theme.bases[h]; return front(L[p].figure).includes(f) && sat(rz(L, h), h); }),
  'N4 · le pôle lui-même sature le nœud de sa maison': (L, p) => sat(L[p].figure, L[p].maison),
};
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m) })), pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
console.log(D.length + ' matchs, ' + 2 * D.length + ' pôles ; un pôle marque dans ' + pc(D.reduce((s, d) => s + (d.sc[0] > 0) + (d.sc[1] > 0), 0), 2 * D.length) + ' des cas\n');
const J = D.find(d => /Juventus – Venezia/.test(d.nom)); if (J) console.log('Juventus – Venezia (' + J.m.join('-') + ', ' + J.sc.join('-') + ') : R1 ' + K.nom(J.L.R1.figure) + ' en M' + J.L.R1.maison + ', R7 ' + K.nom(J.L.R7.figure) + ' en M' + J.L.R7.maison + ' → ' + Object.entries(LECT).map(([k, f]) => k.slice(0, 2) + ' R1 ' + (f(J.L, 'R1') ? 'oui' : 'non') + ' / R7 ' + (f(J.L, 'R7') ? 'oui' : 'non')).join(' · ') + '\n');
for (const [k, f] of Object.entries(LECT)) { console.log(k); for (const lot of ['corpus', 'aveugle']) { let a = 0, n = 0, a0 = 0, n0 = 0; D.filter(d => d.lot === lot).forEach(d => ['R1', 'R7'].forEach((p, i) => { const v = f(d.L, p), m = d.sc[i] > 0; if (v) { n++; if (m) a++; } else { n0++; if (m) a0++; } }));
  console.log('    ' + lot.padEnd(8) + ' oui : marque ' + a + '/' + n + ' (' + pc(a, n) + ') · non : marque ' + a0 + '/' + n0 + ' (' + pc(a0, n0) + ')'); } }
