// Demande du propriétaire (2026-11-25) : la page dit toujours « Victoire X » ou « Nul ». Variantes de décision jugées sur les 106 matchs (résultat exact 1 / N / 2).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), V = M.verdict(L); return { ...d, V, nc: V.nulConvergence, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const appel = V => V.v === '1' ? 1 : V.v === '2' ? -1 : 0, indice = V => V.indice ? (V.indice.cote === 'R1' ? 1 : -1) : 0;
const VAR = {
  'A · appel → victoire ; sans appel : nul fréquent → nul, sinon indice ou R1': d => appel(d.V) || (d.nc.niveau === 'frequent' ? 0 : indice(d.V) || 1),
  'B · nul fréquent → nul toujours ; sinon appel, indice ou R1': d => d.nc.niveau === 'frequent' ? 0 : appel(d.V) || indice(d.V) || 1,
  'C · appel → victoire ; sans appel : nul possible ou fréquent → nul, sinon indice ou R1': d => appel(d.V) || (d.nc.niveau !== 'ecarte' ? 0 : indice(d.V) || 1),
  'D · appel → victoire ; sans appel → nul': d => appel(d.V),
  'E · appel → victoire ; sans appel : nul fréquent → nul, sinon R1': d => appel(d.V) || (d.nc.niveau === 'frequent' ? 0 : 1),
  'référence : R1 gagne toujours': d => 1,
};
console.log(D.length + ' matchs (R1 ' + D.filter(d => d.r > 0).length + ', nuls ' + D.filter(d => !d.r).length + ', R7 ' + D.filter(d => d.r < 0).length + ') — résultat exact juste :');
for (const [k, f] of Object.entries(VAR)) { const o = { corpus: 0, aveugle: 0 }, n = { corpus: 0, aveugle: 0 }; let nn = 0, nj = 0; D.forEach(d => { const p = f(d); n[d.lot]++; if (p === d.r) o[d.lot]++; if (!p) { nn++; if (!d.r) nj++; } });
  console.log('   ', k.padEnd(86), (o.corpus + o.aveugle) + '/' + D.length, '| corpus ' + o.corpus + '/' + n.corpus + ' · aveugle ' + o.aveugle + '/' + n.aveugle, '| « nul » dit ' + nn + ' fois, juste ' + nj); }
const VAR2 = { 'F · nul fréquent → nul toujours ; sinon appel, sinon R1': d => d.nc.niveau === 'frequent' ? 0 : appel(d.V) || 1 };
for (const [k, f] of Object.entries(VAR2)) { const o = { corpus: 0, aveugle: 0 }, n = { corpus: 0, aveugle: 0 }; let nn = 0, nj = 0; D.forEach(d => { const p = f(d); n[d.lot]++; if (p === d.r) o[d.lot]++; if (!p) { nn++; if (!d.r) nj++; } });
  console.log('   ', k.padEnd(86), (o.corpus + o.aveugle) + '/' + D.length, '| corpus ' + o.corpus + '/' + n.corpus + ' · aveugle ' + o.aveugle + '/' + n.aveugle, '| « nul » dit ' + nn + ' fois, juste ' + nj); }
