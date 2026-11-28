// M1 et M10 : les deux nœuds diagonaux où la figure de la maison (Puer, Carcer) a la Terre impaire et inverse la Terre de la base.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const fr = n => (n - 1) % 4, tS = f => K.niveaux(f)[3] === 2 ? 1 : 0;
// ── structure
console.log('M1 = nœud Feu × Feu (front A, en haut) ; M10 = nœud Air × Eau (front B, en bas). Figures des maisons : Puer', K.niveaux(1).join(''), ', Carcer', K.niveaux(10).join(''));
let s = { m1b2: 0, m10b2: 0, egT: 0, r1: {} };
for (let x = 0; x < 65536; x++) { const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], T = K.construire(m), b = T.bases; if (tS(b[1])) s.m1b2++; if (tS(b[10])) s.m10b2++; if (tS(b[1]) === tS(b[10])) s.egT++; }
console.log('Terre de la base saturée : M1 dans', s.m1b2, 'thèmes, M10 dans', s.m10b2, '; même Terre en M1 et M10 dans', s.egT);
console.log('rappel : la base de M1 donne la maison de R1 (R1 est en M' + 'b(M1)) ; Terre de la base de M1 saturée ⇔ R1 dans une maison à figure de Terre paire :', [...Array(16)].map((_, i) => i + 1).filter(n => tS(n)).map(n => 'M' + n).join(' '));
// ── corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s2) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s2 }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme, b = T.bases; return { ...d, L, b, r: Math.sign(d.sc[0] - d.sc[1]), nul: d.sc[0] === d.sc[1] ? 1 : 0, tb1: tS(b[1]), tr1: tS(T.resultantes[1]), tb10: tS(b[10]), tr10: tS(T.resultantes[10]) }; });
const etat = (tb, tr) => tb ? (tr ? 'saturée→saturée' : 'saturée→ouverte') : (tr ? 'ouverte→saturée' : 'ouverte→ouverte'); // impossible : M1 et M10 inversent toujours
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
const tab = (lab, f) => { const t = {}; D.forEach(d => { const k = f(d); t[k] = t[k] || [0, 0, 0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.r > 0) t[k][2]++; if (d.r < 0) t[k][3]++; t[k][4] += d.sc[0]; t[k][5] += d.sc[1]; }); console.log('\n' + lab); Object.keys(t).sort().forEach(k => console.log('    ', k.padEnd(40), 'n', String(t[k][0]).padStart(2), '| nuls', t[k][1], '| R1', t[k][2], 'R7', t[k][3], '| buts R1', (t[k][4] / t[k][0]).toFixed(1), 'R7', (t[k][5] / t[k][0]).toFixed(1))); };
tab('M1 : Terre de la base → résultante', d => etat(d.tb1, d.tr1));
tab('M10 : Terre de la base → résultante', d => etat(d.tb10, d.tr10));
tab('M1 et M10 ensemble (résultantes)', d => 'M1 ' + (d.tr1 ? 'saturée' : 'ouverte') + ' · M10 ' + (d.tr10 ? 'saturée' : 'ouverte'));
// pôles concernés : front A (M1) et front B (M10)
console.log('\npôles dont la figure est du front A (nœud M1) ou B (nœud M10) : buts selon le nœud');
const g = {}; D.forEach(d => [['R1', d.L.R1, d.sc[0], d.sc[1]], ['R7', d.L.R7, d.sc[1], d.sc[0]]].forEach(([p, c, gm, ge]) => { const z = fr(c.figure); if (z > 1) return; const tr = z === 0 ? d.tr1 : d.tr10, k = (z === 0 ? 'front A, M1 ' : 'front B, M10 ') + (tr ? 'saturée' : 'ouverte'); g[k] = g[k] || [0, 0, 0, 0, 0]; g[k][0]++; if (gm > 0) g[k][1]++; g[k][2] += gm; g[k][3] += ge; if (gm > ge) g[k][4]++; }));
Object.keys(g).sort().forEach(k => console.log('    ', k.padEnd(26), g[k][1] + '/' + g[k][0], 'marquent,', (g[k][2] / g[k][0]).toFixed(2), 'buts pour,', (g[k][3] / g[k][0]).toFixed(2), 'contre,', g[k][4], 'victoires'));
// figures en base et résultante de M1 / M10 sur le corpus
for (const [h, kb] of [[1, 'b'], [10, 'b']]) { const t = {}; D.forEach(d => { const k = nm(d.L.theme.resultantes[h]); t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.r > 0) t[k][2]++; if (d.r < 0) t[k][3]++; }); console.log('\nrésultante de M' + h + ' :', Object.keys(t).sort((a, b) => t[b][0] - t[a][0]).map(k => k + ' (' + t[k][0] + ' : nuls ' + t[k][1] + ', R1 ' + t[k][2] + ', R7 ' + t[k][3] + ')').join(' · ')); }
// liaisons de M1 et M10 : Terre vers le front direct (M1–M5, M10–M14) et miroir (M1–M9, M10–M2), par parité
const lien = (T, x, y, l) => K.niveaux(A(x < 16 ? T.resultantes[x] : T.bases[16], y < 16 ? T.resultantes[y] : T.bases[16]))[l] === 2;
tab('liaison Terre M1–M5 et M10–M14 (parité)', d => 'M1–M5 ' + (lien(d.L.theme, 1, 5, 3) ? 'liée' : 'arrêt') + ' · M10–M14 ' + (lien(d.L.theme, 10, 14, 3) ? 'liée' : 'arrêt'));
