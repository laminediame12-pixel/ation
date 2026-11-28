// PISTE 4 (2026-11-25) : le type de match — nul, serré (un but d'écart), large (deux buts ou plus) — d'après les signes déjà connus.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), V = M.verdict(L), e = Math.abs(d.sc[0] - d.sc[1]); return { ...d, L, V, type: e === 0 ? 'nul' : e === 1 ? 'serré' : 'large', vc: V.victoireConvergence.score, nc: V.nulConvergence.score, arr: M.arrets(L).nombre }; });
const T = L => K.niveaux(L.theme.bases[1])[3] === K.niveaux(L.theme.bases[2])[3] && K.niveaux(L.theme.bases[2])[3] === K.niveaux(L.theme.bases[3])[3];
const tab = (nom, f) => { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || { nul: 0, serré: 0, large: 0, n: 0, av: 0, avl: 0 }; t[k][d.type]++; t[k].n++; if (d.lot === 'aveugle') { t[k].av++; if (d.type === 'large') t[k].avl++; } });
  console.log(nom); Object.keys(t).sort((a, b) => (+a - +b) || a.localeCompare(b)).forEach(k => { const o = t[k]; console.log('    ' + k.padEnd(28) + ('n ' + o.n).padEnd(6) + ' nul ' + String(o.nul).padStart(2) + ' · serré ' + String(o.serré).padStart(2) + ' · large ' + String(o.large).padStart(2) + ' (' + Math.round(100 * o.large / o.n) + ' %)  | aveugle large ' + o.avl + '/' + o.av); }); console.log(''); };
console.log(D.length + ' matchs : nul ' + D.filter(d => d.type === 'nul').length + ', serré ' + D.filter(d => d.type === 'serré').length + ', large ' + D.filter(d => d.type === 'large').length + '\n');
tab('1. Force de la victoire (|score de victoire|)', d => Math.min(Math.abs(d.vc), 4));
tab('2. Terre de M1, M2, M3 identique', d => T(d.L) ? 'oui' : 'non');
tab('3. Nombre d\'arrêts', d => Math.min(d.arr, 3));
tab('4. Niveau du nul (convergence)', d => d.V.nulConvergence.niveau);
tab('5. Score du nul ≤ +1 et |victoire| ≥ 2', d => d.nc <= 1 && Math.abs(d.vc) >= 2 ? 'oui' : 'non');
// règles de type de match (le nul reste celui de la décision du moteur)
const RG = {
  'A · décision Nul → nul ; sinon |victoire| ≥ 2 ou arrêt → large ; sinon serré': d => d.V.decision.resultat === 'N' ? 'nul' : (Math.abs(d.vc) >= 2 || d.arr >= 1) ? 'large' : 'serré',
  'B · décision Nul → nul ; sinon |victoire| ≥ 2 et arrêt → large ; sinon serré': d => d.V.decision.resultat === 'N' ? 'nul' : (Math.abs(d.vc) >= 2 && d.arr >= 1) ? 'large' : 'serré',
  'C · décision Nul → nul ; sinon large': d => d.V.decision.resultat === 'N' ? 'nul' : 'large',
  'référence : toujours large': d => 'large',
};
console.log('6. Type de match prédit (nul / serré / large) : justes');
for (const [k, f] of Object.entries(RG)) { const o = { corpus: 0, aveugle: 0 }; let sl = [0, 0], ss = [0, 0]; D.forEach(d => { const p = f(d); if (p === d.type) o[d.lot]++; if (p === 'large') { sl[1]++; if (d.type === 'large') sl[0]++; } if (p === 'serré') { ss[1]++; if (d.type === 'serré') ss[0]++; } });
  console.log('   ', k.padEnd(78), (o.corpus + o.aveugle) + '/106 | corpus ' + o.corpus + ' · aveugle ' + o.aveugle + '/26 | « large » juste ' + sl.join('/') + ' · « serré » juste ' + ss.join('/')); }
{ const X = D.filter(d => d.V.decision.resultat !== 'N' && Math.abs(d.vc) >= 2 && d.arr >= 1); console.log('\n7. Victoire désignée avec |victoire| ≥ 2 et au moins un arrêt : ' + X.length + ' matchs → large ' + X.filter(d => d.type === 'large').length + ', serré ' + X.filter(d => d.type === 'serré').length + ', nul ' + X.filter(d => d.type === 'nul').length + ' ; vainqueur désigné juste ' + X.filter(d => (d.V.decision.resultat === '1' ? 1 : -1) === Math.sign(d.sc[0] - d.sc[1])).length + '/' + X.length + ' | aveugle : large ' + X.filter(d => d.lot === 'aveugle' && d.type === 'large').length + '/' + X.filter(d => d.lot === 'aveugle').length);
  X.forEach(d => console.log('     ' + d.m.join('-').padEnd(12) + d.sc.join('-').padEnd(6) + 'décision ' + d.V.decision.resultat + ' (victoire ' + d.vc + ', arrêts ' + d.arr + ')' + (d.lot === 'aveugle' ? '  [aveugle]' : ''))); }
