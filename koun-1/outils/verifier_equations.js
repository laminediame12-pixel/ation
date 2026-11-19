// Vérifie que les équations de l'équilibre (poids des quatuors) donnent exactement les mêmes écarts que le comptage direct des deux parties, sur les 65 536 thèmes.
const K = require('../moteur3/moteur.js');
const P = { Feu: 0, Air: 1, Eau: 2, Terre: 3 };
const PARTIE1 = [1, 2, 3, 4, 9, 10, 13, 15], PARTIE2 = [5, 6, 7, 8, 11, 12, 14, 16];
const PTS = (f) => { const v = K.FIG.indexOf(f); return v; };
let mauvais = 0, assure = 0, probable = 0, n = 0;
const points = (f, l) => { const t = { Puer:[1,1,2,1], Laetitia:[1,2,2,2], Caput:[2,1,1,1], Albus:[2,2,1,2], Via:[1,1,1,1], Amissio:[1,2,1,2], Rubeus:[2,1,2,2], Tristitia:[2,2,2,1], 'Fortuna Minor':[1,1,2,2], Carcer:[1,2,2,1], Conjunctio:[2,1,1,2], 'Fortuna Major':[2,2,1,1], 'Cauda Draconis':[1,1,1,2], Puella:[1,2,1,1], Aquisitio:[2,1,2,1], Populus:[2,2,2,2] }; return t[f][l]; };
for (let i = 0; i < 65536; i++) {
  const m = [i & 15, (i >> 4) & 15, (i >> 8) & 15, (i >> 12) & 15].map(x => x + 1), L = K.lire(K.construireTheme(...m.map(K.fig)));
  const comp = (part, couche) => part.reduce((t, h, k) => { const mm = L.maisons[h - 1], f = couche === 'b' ? mm.base : (mm.resultante || mm.base); return t + (points(f, k % 4) === 2 ? 1 : 0); }, 0);
  const eb = comp(PARTIE1, 'b') - comp(PARTIE2, 'b'), er = comp(PARTIE1, 'r') - comp(PARTIE2, 'r'), q = K.equilibre(L);
  n++; if (eb !== q.ecartBase || er !== q.ecartRes) mauvais++;
  if (q.assure) assure++; else if (q.probable) probable++;
}
console.log('thèmes :', n, '| écarts entre l’équation et le comptage direct :', mauvais, '| équilibre strict :', assure, '| équilibre compensé :', probable);
