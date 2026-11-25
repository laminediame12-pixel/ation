// H-NOYAU-TERRE, version formalisée par le propriétaire (2026-11-25) : la phase se lit sur les figures DIAGNOSTIQUES (R1, R7 et nœuds),
// et non sur tout le thème comme dans la page. Figures diagnostiques retenues : R1, R7 et les résultantes des nœuds diagonaux des deux pôles
// (H-DIAGONALES-TERRE, 2 maisons par pôle). Majorité mobile → mobile ; sinon majorité noyau → équilibre (Tristitia suspens, Populus concrétisé,
// Albus / Fortuna Major stables) ; sinon neutre. Jugé sur le nul, 106 matchs.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const NOY = [4, 8, 12, 16], MOB = [6, 10, 14];
console.log('vérification : noyau = figures à Feu et Air saturés : ' + ([...Array(16)].map((_, i) => i + 1).filter(f => K.niveaux(f)[0] === 2 && K.niveaux(f)[1] === 2).join(', ')));
function phase(L) { const G = M.diagonales(L), rz = h => h < 16 ? L.theme.resultantes[h] : L.theme.bases[16];
  const figs = [L.R1.figure, L.R7.figure].concat(G.R1.maisons.map(rz), G.R7.maisons.map(rz)), n = figs.filter(f => NOY.includes(f)), m = figs.filter(f => MOB.includes(f));
  if (m.length > n.length) return 'mobile'; if (!n.length) return 'neutre';
  const c = {}; n.forEach(f => c[f] = (c[f] || 0) + 1); const best = NOY.filter(f => c[f]).sort((a, b) => c[b] - c[a] || b - a)[0];
  return { 8: 'équilibre en suspens (Tristitia)', 16: 'équilibre concrétisé (Populus)', 4: 'équilibre stable (Albus)', 12: 'équilibre sec (Fortuna Major)' }[best]; }
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, ph: phase(L), nul: d.sc[0] === d.sc[1] }; });
const t = {}; D.forEach(d => { t[d.ph] = t[d.ph] || { c: [0, 0], a: [0, 0] }; const k = d.lot === 'corpus' ? 'c' : 'a'; t[d.ph][k][0] += d.nul; t[d.ph][k][1]++; });
console.log('\nPhase sur les figures diagnostiques (R1, R7, nœuds diagonaux) — nuls :');
Object.keys(t).sort().forEach(k => { const x = t[k].c[0] + t[k].a[0], n = t[k].c[1] + t[k].a[1]; console.log('   ', k.padEnd(36), (x + '/' + n + ' (' + Math.round(100 * x / n) + ' %)').padEnd(14), '| corpus ' + t[k].c.join('/') + ' · aveugle ' + t[k].a.join('/')); });
const eq = D.filter(d => d.ph.startsWith('équilibre')), mo = D.filter(d => d.ph === 'mobile');
console.log('    équilibre (toutes qualités) : ' + eq.filter(d => d.nul).length + '/' + eq.length + ' · mobile : ' + mo.filter(d => d.nul).length + '/' + mo.length + ' · neutre : ' + D.filter(d => d.ph === 'neutre' && d.nul).length + '/' + D.filter(d => d.ph === 'neutre').length);
console.log('    thème 12-10-14-5 : ' + phase(M.lire([12, 10, 14, 5])));
