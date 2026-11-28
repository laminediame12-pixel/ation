// Les composantes du verdict de victoire jugées sur les 106 matchs connus, lot par lot, chacune comparée à « R1 gagne toujours » sur les mêmes matchs.
// Diagonales de Terre (seules, sur tous les matchs où elles appellent), M1-M10 (deux arrêts → R1), et le verdict par règle.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, r: Math.sign(d.sc[0] - d.sc[1]) }; });
function juge(nom, appel) { for (const lot of ['corpus', 'aveugle', null]) { let ok = 0, ko = 0, nul = 0, r1ok = 0, r1ko = 0; D.filter(d => !lot || d.lot === lot).forEach(d => { const a = appel(d.L); if (!a) return; if (!d.r) { nul++; return; } if (a === d.r) ok++; else ko++; if (d.r > 0) r1ok++; else r1ko++; });
  console.log('   ', (lot ? nom : '').padEnd(48), (lot || 'réunis').padEnd(8), ('appel juste ' + ok + ', faux ' + ko + ', nuls ' + nul).padEnd(34), '| « R1 toujours » sur ces matchs : ' + r1ok + ' / ' + r1ko); } }
console.log('Victoire : composantes du verdict, lot par lot (106 matchs)\n');
juge('Diagonales de Terre (le pôle qui en a le plus)', L => Math.sign(M.diagonales(L).ecart));
juge('M1-M10 : deux arrêts → R1', L => M.m1m10(L).deuxArrets ? 1 : 0);
juge('Verdict complet', L => { const v = M.verdict(L).v; return v === '1' ? 1 : v === '2' ? -1 : 0; });
const regles = [...new Set(D.map(d => M.verdict(d.L).regle).filter(Boolean))];
regles.forEach(rg => juge('Verdict, règle ' + rg, L => { const V = M.verdict(L); if (V.regle !== rg) return 0; return V.v === '1' ? 1 : V.v === '2' ? -1 : 0; }));
