// Victoire par blocage et protection (clarification du propriétaire, 2026-11-27) : « Populus en M11 permet à Conjunctio de bloquer Puella et de protéger Puer » ;
// le binôme d'un pôle est son protecteur (f − 6), qui bloque l'antagoniste du pôle (f − 3). Un pôle est réellement bloqué quand son antagoniste est présent
// et que son protecteur ne l'est pas. Présence : posé en base intact, reproduit par Populus (Populus en base de sa maison), ou produit en résultante.
// Développement sur les 126 matchs de la recherche ; test à l'aveugle sur les 21 matchs du 26 novembre.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const dev = new Map(), aj = (t, s, nom) => { const k = t.join('-'); if (!dev.has(k)) dev.set(k, { m: t, sc: s, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match)));
const DEV = [...dev.values()], TEST = lire('validation/resultats-2026-11-26.json').matchs.map(x => ({ m: x.theme, sc: x.score, nom: x.match }));
const intact = (g, h) => g !== 16 && (h === 16 || K.niveaux(g).every((v, l) => v !== 1 || K.niveaux(h)[l] === 2));
// présence d'une figure g selon le mode : 'intact' (posée en base intacte), 'populus' (Populus en base de la maison g), 'res' (résultante = g, M1-M15), combinaisons
const present = (L, g, modes) => { const b = L.theme.bases, r = L.theme.resultantes; let n = 0;
  if (modes.includes('i')) for (let h = 1; h <= 16; h++) if (b[h] === g && intact(g, h)) n++;
  if (modes.includes('p')) if (g < 16 && b[g] === 16) n++;
  if (modes.includes('r')) for (let h = 1; h <= 15; h++) if (r[h] === g && b[h] !== 16) n++;
  return n; };
const etat = (L, p, mt, mp) => { const f = L[p].figure, A = mod(f - 3), P = mod(f - 6), t = present(L, A, mt), pr = present(L, P, mp); return { menace: t, protege: pr, bloque: t > 0 && pr === 0 }; };
const MODES = { 'i': 'posé intact', 'p': 'reproduit par Populus', 'r': 'en résultante', 'ip': 'intact ou Populus', 'ipr': 'intact, Populus ou résultante' };
const juge = (S, mt, mp) => { const o = { R1: [0, 0], R7: [0, 0] }; S.forEach(d => { const L = M.lire(d.m), a = etat(L, 'R1', mt, mp).bloque, b = etat(L, 'R7', mt, mp).bloque, r = Math.sign(d.sc[0] - d.sc[1]); if (a === b || !r) return; const w = a ? 'R7' : 'R1'; o[w][1]++; if ((w === 'R1') === (r > 0)) o[w][0]++; }); return o; };
console.log('« R1 gagne toujours » : développement ' + DEV.filter(d => d.sc[0] > d.sc[1]).length + '/' + DEV.filter(d => d.sc[0] !== d.sc[1]).length + ' décidés · test ' + TEST.filter(d => d.sc[0] > d.sc[1]).length + '/' + TEST.filter(d => d.sc[0] !== d.sc[1]).length);
console.log('\nun seul pôle réellement bloqué → l\'autre gagne (matchs décidés) : désigne R1 → R1 gagne · désigne R7 → R7 gagne');
for (const mt of ['i', 'p', 'ip', 'ipr']) for (const mp of ['-', 'i', 'p', 'ip', 'ipr']) { const a = juge(DEV, mt, mp === '-' ? '' : mp), t = juge(TEST, mt, mp === '-' ? '' : mp);
  const f = o => ('R1 ' + o.R1[0] + '/' + o.R1[1]).padEnd(11) + ('R7 ' + o.R7[0] + '/' + o.R7[1]).padEnd(10);
  console.log('  menace ' + MODES[mt].padEnd(30) + ' protection ' + (mp === '-' ? 'ignorée' : MODES[mp]).padEnd(30) + ' dev ' + f(a) + ' | test ' + f(t)); }
