// Nœuds doubles et marquage (2026-11-27) : M1 (Feu²), M6 (Air²), M11 (Eau²), M16 (Terre², pas de résultante : on lit la Terre de la base).
// Chaque nœud double appartient à un front (colonne de la grille) : M1 → A, M6 → B, M11 → C, M16 → D.
// 1. Le match : les deux marquent, buts, selon l'état de chaque nœud. 2. Le pôle : marque-t-il quand le nœud double de son front est plein ?
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, 'aveugle')));
const DBL = [[1, 0, 'M1 Feu²'], [6, 1, 'M6 Air²'], [11, 2, 'M11 Eau²'], [16, 3, 'M16 Terre²']];
const plein = (L, h, l) => K.niveaux(h < 16 ? L.theme.resultantes[h] : L.theme.bases[16])[l] === 2;
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), deux: d.sc[0] > 0 && d.sc[1] > 0, g: d.sc[0] + d.sc[1] }));
const pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—', moy = a => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(2) : '—';
console.log(D.length + ' matchs ; les deux marquent ' + pc(D.filter(d => d.deux).length, D.length) + '\n1. Le match');
DBL.forEach(([h, l, nom]) => { const o = D.filter(d => plein(d.L, h, l)), v = D.filter(d => !plein(d.L, h, l)), oa = o.filter(d => d.lot === 'aveugle'), va = v.filter(d => d.lot === 'aveugle');
  console.log('   ' + nom.padEnd(11) + ' plein : les deux marquent ' + pc(o.filter(d => d.deux).length, o.length).padEnd(5) + ' buts ' + moy(o.map(d => d.g)) + ' (' + o.length + ') · vide : ' + pc(v.filter(d => d.deux).length, v.length).padEnd(5) + ' buts ' + moy(v.map(d => d.g)) + ' (' + v.length + ')   | aveugle : ' + pc(oa.filter(d => d.deux).length, oa.length) + ' contre ' + pc(va.filter(d => d.deux).length, va.length)); });
console.log('\n2. Le pôle et le nœud double de son front (M1 pour A, M6 pour B, M11 pour C, M16 pour D)');
for (const st of [true, false]) for (const lot of ['corpus', 'aveugle']) { let a = 0, n = 0; D.filter(d => d.lot === lot).forEach(d => ['R1', 'R7'].forEach((p, i) => { const z = (d.L[p].figure - 1) % 4, [h, l] = DBL[z]; if (plein(d.L, h, l) !== st) return; n++; if (d.sc[i] > 0) a++; }));
  console.log('   nœud de son front ' + (st ? 'plein' : 'vide ') + ' · ' + lot.padEnd(8) + ' : marque ' + a + '/' + n + ' (' + pc(a, n) + ')'); }
console.log('\n3. Le pôle et le nœud double de son niveau de maison (maison du pôle dans la colonne du nœud)');
for (const st of [true, false]) { let a = 0, n = 0, av = [0, 0]; D.forEach(d => ['R1', 'R7'].forEach((p, i) => { const z = (d.L[p].maison - 1) % 4, [h, l] = DBL[z]; if (plein(d.L, h, l) !== st) return; n++; if (d.sc[i] > 0) a++; if (d.lot === 'aveugle') { av[1]++; if (d.sc[i] > 0) av[0]++; } }));
  console.log('   nœud ' + (st ? 'plein' : 'vide ') + ' : marque ' + a + '/' + n + ' (' + pc(a, n) + ') | aveugle ' + av[0] + '/' + av[1]); }
