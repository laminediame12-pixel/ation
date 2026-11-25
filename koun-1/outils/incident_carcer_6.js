// Piste du propriétaire corrigée (2026-11-25) : oppositions à 6 maisons (M1–M7, M2–M8, M3–M9, M4–M10, M5–M11, M6–M12 ; « M2 vs M7 » et « M5 vs M5 »
// lus comme M2–M8 et M5–M11). Chaque opposition dont la somme donne Carcer (10) provoque une pénalité (penalty ou rouge).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const E = [];
lire('validation/scores-reels.json').forEach(x => { if (x.penalty !== undefined && x.penalty !== null && x.rouge !== undefined && x.rouge !== null) E.push({ m: x.themes, match: x.match, lot: 'avant', inc: x.penalty !== 'Non' || x.rouge !== 'Non', det: 'penalty ' + x.penalty + ', rouge ' + x.rouge }); });
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => E.push({ m: x.theme, match: x.match, lot: '20-23 nov', inc: !!(x.penalty || x.rouge), det: x.penalty || x.rouge ? (x.penalty ? 'penalty ' + x.penalty : '') + (x.rouge ? ' rouge ' + x.rouge : '') : 'aucun relevé' }));
const P = [[1, 7], [2, 8], [3, 9], [4, 10], [5, 11], [6, 12]];
const rows = E.map(e => { const b = M.lire(e.m).theme.bases; return { ...e, p: P.filter(([x, y]) => A(b[x], b[y]) === 10).map(([x, y]) => 'M' + x + '–M' + y) }; });
rows.forEach(r => console.log((r.lot.padEnd(10) + r.match).padEnd(46), (r.p.length ? 'Carcer : ' + r.p.join(', ') : '—').padEnd(28), r.inc ? 'PÉNALITÉ (' + r.det.trim() + ')' : 'aucune'));
const ok = rows.filter(r => r.p.length), non = rows.filter(r => !r.p.length);
console.log('\nAvec au moins une opposition Carcer : pénalité ' + ok.filter(r => r.inc).length + ' sur ' + ok.length + ' · sans : ' + non.filter(r => r.inc).length + ' sur ' + non.length);
['avant', '20-23 nov'].forEach(l => { const a = ok.filter(r => r.lot === l), b = non.filter(r => r.lot === l); console.log('   ' + l.padEnd(10) + ' avec : ' + a.filter(r => r.inc).length + '/' + a.length + ' · sans : ' + b.filter(r => r.inc).length + '/' + b.length); });
