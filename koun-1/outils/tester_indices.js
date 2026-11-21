// Contrôle des indices du moteur 4 (marquage, incident, chaîne) sur les 65 536 thèmes : bornes, cohérence avec le noyau. Usage : node outils/tester_indices.js
const M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
let bad = 0, nb = 0; const err = m => { if (bad++ < 5) console.log('écart :', m); };
for (let a = 1; a <= 16; a++) for (let b = 1; b <= 16; b++) for (let c = 1; c <= 16; c++) for (let d = 1; d <= 16; d++) { nb++;
  const L = M.lire([a, b, c, d]), T = L.theme, q = M.marquage(L), I = M.incident(L), C = M.chaine(L);
  ['R1', 'R7'].forEach(p => { const z = (L[p].figure - 1) % 4; let n = 0;
    [0, 1, 2, 3].forEach(i => { const h = z + 4 * i + 1, r = h < 16 ? T.resultantes[h] : T.bases[16]; if (K.niveaux(r)[3] === 2) n++; });
    if (q[p].n !== n || n < 0 || n > 4) err('n ' + [a, b, c, d] + ' ' + p); });
  if (q.deuxMarquent < 0 || q.deuxMarquent > 1) err('deux marquent ' + [a, b, c, d]);
  if (I.parametres.length !== 6 || I.score !== I.parametres.filter(x => x.actif).length || I.probable !== (I.score >= 3)) err('incident ' + [a, b, c, d]);
  ['R1', 'R7'].forEach(p => { const x = C[p]; if (K.additionner(x.figure, x.antagoniste) !== x.filiations[0].somme || ![1, 3, 5, 11, 13].includes(x.filiations[0].somme) || ![1, 3, 5, 11, 13].includes(x.filiations[1].somme)) err('chaîne ' + [a, b, c, d] + ' ' + p); }); }
console.log(nb + ' thèmes ; écarts :', bad); process.exit(bad ? 1 : 0);
