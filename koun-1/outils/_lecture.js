// Lecture de thèmes par noms de figures, au-dessus du noyau (utilisée par les outils). Aucun moteur de verdict.
const N = require('../moteur3/noyau.js'), M4 = require('../moteur4/moteur.js');
const FIG = N.FIGURES.map(f => f[0]), num = f => FIG.indexOf(f) + 1, fig = n => FIG[((n - 1) % 16 + 16) % 16];
function construireTheme(...noms) { const T = N.construire(noms.map(num)), t = {}; for (let h = 1; h <= 16; h++) t[h] = fig(T.bases[h]); return t; }
function lire(theme) {
  const meres = [1, 2, 3, 4].map(h => num(theme[h])), T = N.construire(meres), P = N.poles(T);
  const maisons = []; for (let h = 1; h <= 16; h++) maisons.push({ maison: h, base: fig(T.bases[h]), resultante: h === 16 ? null : fig(T.resultantes[h]) });
  const pole = p => ({ maison: p.maison, figure: fig(p.figure), front: N.front(p.figure) });
  return { maisons, R1: pole(P.R1), R7: pole(P.R7), meres };
}
const fiabilite = (L, jour) => M4.fiabilite(M4.lire(L.meres), jour);
module.exports = { FIG, num, fig, construireTheme, lire, fiabilite };
