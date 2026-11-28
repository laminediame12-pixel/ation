// Impact du 7e signe du nul (« le front de R7 attaque celui de R1 ») sur la décision du moteur : avant / après, lot par lot, match par match.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot, nom) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus', x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus', x.match || x.themes.join('-')));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus', 'lot 2');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle 20-23', x.match)); lire('validation/resultats-aveugles-2026-11-25.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle 24-25', x.match));
const FA = { 0: 3, 1: 0, 3: 2, 2: 1 }, attaque = L => FA[(L.R7.figure - 1) % 4] === (L.R1.figure - 1) % 4;
const dec = (V, sansSigne) => { const s = V.nulConvergence.score - (sansSigne && attaque(V.L) ? 1 : 0); return s >= 3 ? 0 : V.v ? (V.v === '1' ? 1 : -1) : 1; };
const D = [...tous.values()].map(d => { const L = M.lire(d.m), V = M.verdict(L); V.L = L; return { ...d, V, r: Math.sign(d.sc[0] - d.sc[1]), avant: dec(V, true), apres: dec(V, false) }; });
const lib = p => p === 0 ? 'Nul' : p > 0 ? 'Victoire R1' : 'Victoire R7';
for (const lot of ['corpus', 'aveugle 20-23', 'aveugle 24-25']) { const X = D.filter(d => d.lot === lot); console.log(lot.padEnd(14) + ' (' + X.length + ') : avant ' + X.filter(d => d.avant === d.r).length + ' justes · après ' + X.filter(d => d.apres === d.r).length + ' justes · « R1 toujours » ' + X.filter(d => d.r > 0).length); }
const ch = D.filter(d => d.avant !== d.apres);
console.log('\nDécisions changées : ' + ch.length + ' (toutes passent de Victoire à Nul) — devenues justes ' + ch.filter(d => d.apres === d.r).length + ', devenues fausses ' + ch.filter(d => d.avant === d.r).length + ', fausses avant et après ' + ch.filter(d => d.avant !== d.r && d.apres !== d.r).length);
ch.forEach(d => console.log('   ' + d.lot.padEnd(14) + String(d.nom).padEnd(34) + d.sc.join('-').padEnd(6) + lib(d.avant) + ' → ' + lib(d.apres) + (d.apres === d.r ? '  ✓ gagné' : d.avant === d.r ? '  ✗ perdu' : '  (faux des deux côtés)')));
const T = lire('validation/themes-25-30-novembre.json'); let n = 0; T.forEach(x => { const L = M.lire(x.theme.split('-').map(Number)), V = M.verdict(L); V.L = L; if (dec(V, true) !== dec(V, false)) n++; });
console.log('\nLot du 24 au 30 : ' + n + ' décisions passent de Victoire à Nul avec le nouveau signe (sur 147)');
