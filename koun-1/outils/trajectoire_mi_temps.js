// PISTE 6 (2026-11-25) : la trajectoire +6 de R1 et R7 vers le noyau Terre dit-elle QUAND le match se décide ?
// Structure exacte du pas +6 : orbite impaire 1-7-13-3-9-15-5-11 (n'atteint jamais le noyau, fait de figures paires) ;
// orbite paire 2-8-14-4-10-16-6-12 : toute figure paire hors noyau (2, 6, 10, 14) atteint le noyau en UN pas (2→8, 14→4, 10→16, 6→12).
// Classe d'un pôle : « dans le noyau » (4, 8, 12, 16), « à un pas » (2, 6, 10, 14), « hors d'atteinte » (impaire).
// Cibles (matchs dont la mi-temps est connue) : part des buts en 2e mi-temps ; le résultat de la mi-temps est-il celui de la fin ; but avant la pause.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const E = new Map(), aj = (t, s, mt, lot) => { const k = t.join('-'); if (!E.has(k) && mt) E.set(k, { m: t, sc: s, mt, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.mi_temps, 'corpus'));
lire('validation/mi-temps.json').forEach(x => aj(x.themes, x.score || null, x.mi_temps, 'corpus'));
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, x.mi_temps, 'aveugle'));
const D = [...E.values()].filter(d => d.sc).map(d => { const L = M.lire(d.m), V = M.verdict(L), g = d.sc[0] + d.sc[1], g1 = d.mt[0] + d.mt[1];
  return { ...d, L, V, g, g1, g2: g - g1, memeRes: Math.sign(d.mt[0] - d.mt[1]) === Math.sign(d.sc[0] - d.sc[1]) }; });
const classe = f => [4, 8, 12, 16].includes(f) ? 'noyau' : f % 2 === 0 ? 'un pas' : 'hors';
console.log(D.length + ' matchs avec la mi-temps ; buts : ' + D.reduce((s, d) => s + d.g1, 0) + ' en 1re, ' + D.reduce((s, d) => s + d.g2, 0) + ' en 2e mi-temps\n');
const tab = (nom, f) => { const t = {}; D.forEach(d => { const k = f(d); t[k] = t[k] || []; t[k].push(d); }); console.log(nom);
  Object.keys(t).sort().forEach(k => { const X = t[k], g1 = X.reduce((s, d) => s + d.g1, 0), g = X.reduce((s, d) => s + d.g, 0);
    console.log('    ' + k.padEnd(30) + ('n ' + X.length).padEnd(6) + ' part des buts en 2e mi-temps ' + (g ? Math.round(100 * (g - g1) / g) : 0) + ' % · but avant la pause ' + X.filter(d => d.g1 > 0).length + '/' + X.length + ' · mi-temps = résultat final ' + X.filter(d => d.memeRes).length + '/' + X.length); }); console.log(''); };
tab('1. Classe des deux pôles (R1 / R7)', d => classe(d.L.R1.figure) + ' / ' + classe(d.L.R7.figure));
tab('2. Nombre de pôles qui atteignent le noyau (dedans ou à un pas)', d => String([d.L.R1.figure, d.L.R7.figure].filter(f => f % 2 === 0).length));
tab('3. Phase du noyau Terre (moteur)', d => d.V.noyauTerre.phase);
tab('4. Décision du moteur', d => d.V.decision.resultat === 'N' ? 'Nul' : d.V.decision.force === 'nette' ? 'Victoire nette' : 'Victoire');
// détail par lot et comparaison avec la lecture « rythme » déjà dans le moteur (but attendu en 1re mi-temps)
const ligne = (nom, X) => console.log('    ' + nom.padEnd(52) + 'but avant la pause ' + X.filter(d => d.g1 > 0).length + '/' + X.length + ' (corpus ' + X.filter(d => d.lot === 'corpus' && d.g1 > 0).length + '/' + X.filter(d => d.lot === 'corpus').length + ' · aveugle ' + X.filter(d => d.lot === 'aveugle' && d.g1 > 0).length + '/' + X.filter(d => d.lot === 'aveugle').length + ')');
console.log('5. Lectures retenues');
ligne('phase en suspens (Tristitia dominante)', D.filter(d => d.V.noyauTerre.phase === 'équilibre en suspens'));
ligne('autres phases', D.filter(d => d.V.noyauTerre.phase !== 'équilibre en suspens'));
ligne('deux pôles sur l\'orbite paire (atteignent le noyau)', D.filter(d => d.L.R1.figure % 2 === 0 && d.L.R7.figure % 2 === 0));
ligne('au plus un pôle sur l\'orbite paire', D.filter(d => !(d.L.R1.figure % 2 === 0 && d.L.R7.figure % 2 === 0)));
const ry = d => { try { return M.rythme(d.L).butAttendu; } catch (e) { return '?'; } };
const t = {}; D.forEach(d => { const k = String(ry(d)); t[k] = t[k] || []; t[k].push(d); }); Object.keys(t).forEach(k => ligne('lecture « rythme » du moteur : ' + k, t[k]));
{ const X = D.filter(d => d.V.noyauTerre.phase === 'équilibre en suspens'); console.log('    recoupement : sur les ' + X.length + ' matchs « en suspens », la lecture rythme disait « pas de but » pour ' + X.filter(d => ry(d) === false).length);
  const Y = D.filter(d => ry(d) === true && d.V.noyauTerre.phase === 'équilibre en suspens'); console.log('    rythme « but » mais phase en suspens : but avant la pause ' + Y.filter(d => d.g1 > 0).length + '/' + Y.length); }
