// Mesure de la puissance de marquage (marquePole) sur tous les matchs au score connu : pour chaque niveau, combien de pôles ont réellement marqué.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, 'aveugle')));
const T = {}, A = {}; let n = 0;
[...tous.values()].forEach(d => { const L = M.lire(d.m); ['R1', 'R7'].forEach((p, i) => { const q = M.marquePole(L, p), k = q.niveau, o = d.sc[i] > 0 ? 1 : 0; n++;
  T[k] = T[k] || { oui: 0, sur: 0 }; T[k].oui += o; T[k].sur++; if (d.lot === 'aveugle') { A[k] = A[k] || { oui: 0, sur: 0 }; A[k].oui += o; A[k].sur++; } }); });
console.log(n + ' pôles'); for (const k of ['assure', 'marque', 'possible', 'non']) { const t = T[k] || { oui: 0, sur: 0 }, a = A[k] || { oui: 0, sur: 0 }; console.log(k.padEnd(9) + ' ' + t.oui + '/' + t.sur + ' ont marqué' + (t.sur ? ' (' + Math.round(100 * t.oui / t.sur) + ' %)' : '') + ' · aveugle ' + a.oui + '/' + a.sur); }
console.log('MARQUE_POLE_OBS = ' + JSON.stringify(T));
