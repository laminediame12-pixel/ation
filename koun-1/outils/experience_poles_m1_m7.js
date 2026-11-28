// EXPÉRIENCE (propriétaire, 2026-11-28) : les pôles du duel fixés dans les maisons M1 et M7 (R1 = figure posée en M1, R7 = figure posée en M7)
// au lieu de R1 = la maison dont le numéro est la figure de M1 (R7 = R1 + 6). Le moteur est rechargé avec ce seul changement, sans toucher moteur4/moteur.js.
// Usage : node outils/experience_poles_m1_m7.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), Module = require('module');
const src = fs.readFileSync(path.join(R, 'moteur4/moteur.js'), 'utf8'), ligne = '    var R1 = pole(P.R1), R7 = pole(P.R7);';
if (!src.includes(ligne)) throw new Error('ligne des pôles introuvable dans moteur4/moteur.js');
const charger = s => { const m = new Module(path.join(R, 'moteur4/moteur.js')); m.filename = path.join(R, 'moteur4/moteur.js'); m.paths = Module._nodeModulePaths(path.join(R, 'moteur4')); m._compile(s, m.filename); return m.exports; };
const MOTEURS = [['pôles actuels (maison de la figure de M1, et + 6)', charger(src)], ['pôles fixés en M1 et M7', charger(src.replace(ligne, '    var R1 = pole({ maison: 1, figure: b[1] }), R7 = pole({ maison: 7, figure: b[7] });'))]];
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), dev = new Map(), aj = (t, s) => { const k = t.join('-'); if (!dev.has(k)) dev.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score)));
const LOTS = [['126 matchs (développement)', [...dev.values()]], ['26 novembre (21)', lire('validation/resultats-2026-11-26.json').matchs.map(x => ({ m: x.theme, sc: x.score }))], ['27 novembre (13, jamais vus)', lire('validation/resultats-2026-11-27.json').matchs.map(x => ({ m: x.theme, sc: x.score }))]];
const res = d => d.sc[0] > d.sc[1] ? '1' : d.sc[0] < d.sc[1] ? '2' : 'N';
for (const [lab, S] of LOTS) { console.log(lab + ' · « R1 gagne toujours » ' + S.filter(d => res(d) === '1').length + '/' + S.length);
  for (const [nom, E] of MOTEURS) { let ok = 0, mq = 0, deux = 0; S.forEach(d => { const L = E.lire(d.m), H = E.hierarchie(L); if (H.decision === res(d)) ok++; ['R1', 'R7'].forEach((p, i) => { if (H[p].marque === (d.sc[i] > 0)) mq++; }); if (H.deux.oui === (d.sc[0] > 0 && d.sc[1] > 0)) deux++; });
    console.log('   ' + nom.padEnd(52) + 'bons verdicts ' + ok + '/' + S.length + ' · marquage ' + mq + '/' + 2 * S.length + ' · deux marquent ' + deux + '/' + S.length); } }
const TOUT = [].concat(...LOTS.map(x => x[1]));
for (const [nom, E] of MOTEURS) { const b = [0, 0, 0], m = [0, 0, 0]; TOUT.forEach(d => { const L = E.lire(d.m), B = E.boucles(L), r = res(d);
    if (B.domaine) { const w = B.gagnant === 'R1' ? '1' : '2'; b[r === 'N' ? 1 : r === w ? 0 : 2]++; return; }
    const q1 = E.marquePole(L, 'R1').marque, q7 = E.marquePole(L, 'R7').marque; if (q1 === q7) return; const w = q1 ? '1' : '2'; m[r === 'N' ? 1 : r === w ? 0 : 2]++; });
  console.log(nom.padEnd(52) + ' boucles différentes ' + b[0] + ' justes, ' + b[1] + ' nuls, ' + b[2] + ' faux · même boucle, un seul pôle marque ' + m[0] + ' justes, ' + m[1] + ' nuls, ' + m[2] + ' faux'); }
