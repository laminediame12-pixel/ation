/* koun — moteur 4 : le noyau et rien d'autre.
   Repose sur moteur3/noyau.js (structure exacte). Ne porte que les principes posés par le propriétaire :
   VA-1 (victoire assurée), MF-2 (même front, un seul partenaire de moitié chez lui), MF-3 (nul : front miroir, Tristitia en maison de Terre,
   à condition que les deux parties du thème soient en équilibre), plus la validation FI-5.
   Si aucun de ces principes ne s'applique : verdict null (« pas de verdict »). Aucun repli, aucune force, aucune pénalité, aucun score.
   Le moteur gelé moteur3/moteur.js n'est pas modifié. */
(function (root) {
  'use strict';
  var K = (typeof require !== 'undefined' && typeof module !== 'undefined') ? require('../moteur3/noyau.js') : root.KOUN_NOYAU;
  var mod = function (n) { return ((n - 1) % 16 + 16) % 16 + 1; };
  var pts = function (n) { return K.niveaux(n); };
  var chaine = function (l) { return l.map(K.nom).join(', '); };

  function lire(meres) {
    var T = K.construire(meres), b = T.bases, r = T.resultantes, P = K.poles(T);
    var base = function (h) { return b[h]; }, resu = function (h) { return h === 16 ? b[16] : r[h]; };
    var presentEn = function (f, h) { return b[h] === f || resu(h) === f; };
    var chezElle = function (f) { return presentEn(f, f); };
    var doubleRepos = function (f) { return chezElle(f) && (chezElle(mod(f + 3)) || chezElle(mod(f - 3))); };
    function concordance(f, h) { var x = pts(f), y = pts(h), t = 0; for (var i = 0; i < 4; i++) if (x[i] === y[i]) t++; return t; }
    function destructeur(f, h) { var e = (f - 1) % 4, m = (h - 1) % 4; return (e === 2 && m === 0) || (e === 0 && m === 2) || (e === 1 && m === 3) || (e === 3 && m === 1); }
    function force(f, h) {
      if (f === h) return doubleRepos(f) ? null : 100;
      if (mod(f - 3) === h) return 0;
      if (b[f] === mod(f - 3) && destructeur(f, h)) return 0;
      if (destructeur(f, h)) return 1;
      return 25 * concordance(f, h);
    }
    function annuleePar(f) {
      if (!chezElle(f)) return null;
      var at = mod(f - 3);
      if (chezElle(at)) return at;
      var n = 0; for (var h = 1; h <= 16; h++) if (b[h] === at) { var fo = force(at, h); if (fo !== null && fo > 1) n++; }
      return n >= 2 ? at : null;
    }
    var pole = function (p) { return { maison: p.maison, figure: p.figure, front: K.front(p.figure), n: p.figure }; };
    var R1 = pole(P.R1), R7 = pole(P.R7);
    var mode = R1.front === R7.front ? 'MEME_FRONT' : (R1.figure % 2 === R7.figure % 2 ? 'MEME_BOUCLE' : 'BOUCLES_DIFFERENTES');
    return { theme: T, R1: R1, R7: R7, mode: mode, chezElle: chezElle, annuleePar: annuleePar, base: base, resu: resu, lien: K.additionner(R1.figure, R7.figure) };
  }

  // Équilibre des deux parties (équation établie sur les 65 536 thèmes, cf. moteur3/moteur.js) : nul permis seulement si écart base + écart résultante = 0.
  function equilibre(L) {
    var X = [1, 2, 3, 4].map(function (h) { return [0, 1, 2, 3].map(function (l) { return pts(L.base(h))[l] === 1 ? 1 : 0; }); });
    var A = [X[0][0] ^ X[1][0], X[2][1] ^ X[3][1], X[0][2] ^ X[1][2] ^ X[2][2] ^ X[3][2], X[0][3] ^ X[1][3] ^ X[2][3] ^ X[3][0] ^ X[3][1] ^ X[3][2]];
    var B = [X[0][0] ^ X[0][1], X[1][2] ^ X[1][3], X[2][0] ^ X[2][1] ^ X[2][2] ^ X[2][3], X[1][3] ^ X[2][3] ^ X[3][0] ^ X[3][1] ^ X[3][2]];
    var rA = [1, 0, 1, 1], rB = [0, 0, 1, 0], s = function (v) { return v.reduce(function (a, c) { return a + c; }, 0); };
    var eb = s(B) - s(A), er = s(B.map(function (v, k) { return v ^ rB[k]; })) - s(A.map(function (v, k) { return v ^ rA[k]; })) + 2 * (X[2][2] - X[3][3]);
    return { ecartBase: eb, ecartRes: er, equilibre: eb + er === 0 };
  }
  var partenaireMoitie = function (n) { return n <= 4 || (n > 8 && n <= 12) ? n + 4 : n - 4; };
  var camp = function (L, c) { return c === L.R1 ? 'R1' : 'R7'; };
  function sortie(L, c, principe, raison, assuree) { return { verdict: c === L.R1 ? '1' : '2', principe: principe, raison: raison, assuree: !!assuree }; }

  var PRINCIPES = [
    { id: 'VA-1', f: function (L) {
      if (L.mode !== 'BOUCLES_DIFFERENTES') return null;
      var chez = function (c) { var n = c.front === 'A' ? 0 : 'ABCD'.indexOf(c.front), bin = (n + 2) % 4, out = []; for (var h = 1; h <= 16; h++) if (((h - 1) % 4 === n || (h - 1) % 4 === bin) && L.chezElle(h) && !L.annuleePar(h)) out.push(h); return out; };
      var a = chez(L.R1), b = chez(L.R7);
      if ((a.length < 3 && b.length < 3) || a.length === b.length) return null;
      var g = a.length > b.length ? L.R1 : L.R7, l = a.length > b.length ? a : b;
      return sortie(L, g, 'VA-1', 'Victoire ' + camp(L, g) + ' assurée : boucles différentes, ' + l.length + ' figures du front ' + g.front + ' ou du front binôme chez elles (' + chaine(l) + ').', true);
    } },
    { id: 'MF-2', f: function (L) {
      if (L.R1.front !== L.R7.front || L.R1.figure === L.R7.figure) return null;
      var p1 = partenaireMoitie(L.R1.figure), p7 = partenaireMoitie(L.R7.figure);
      if (p1 === L.R7.figure) return null;
      var a = L.chezElle(p1), b = L.chezElle(p7);
      if (a === b) return null;
      var g = a ? L.R1 : L.R7, pg = a ? p1 : p7;
      return sortie(L, g, 'MF-2', 'Victoire ' + camp(L, g) + ' : même front ' + g.front + ', seul le partenaire de ' + K.nom(g.figure) + ', ' + K.nom(pg) + ', est dans sa maison de repos.');
    } },
    { id: 'MF-3', f: function (L) {
      if (L.R1.front !== L.R7.front || L.lien !== 8) return null;
      var th = [4, 8, 12, 16].filter(function (h) { return L.base(h) === 8 || L.resu(h) === 8; });
      if (!th.length) return null;
      if (!equilibre(L).equilibre) return null;
      return { verdict: 'N', principe: 'MF-3', raison: 'Nul : front miroir ' + L.R1.front + ', Tristitia en maison de Terre (M' + th.join(', M') + '), parties en équilibre.', assuree: false };
    } }
  ];

  function verdict(L) {
    for (var i = 0; i < PRINCIPES.length; i++) { var r = PRINCIPES[i].f(L); if (r) return r; }
    return { verdict: null, principe: null, raison: 'Aucun principe posé ne s’applique : pas de verdict.', assuree: false };
  }

  // FI-5 : binôme de M1 et somme de l'axe angulaire en maison angulaire, somme 3-5-11-15 présente, figure du jour présente (si jour donné).
  var FIGURE_DU_JOUR = [[12], [16, 5], [1, 7], [11], [15, 3], [6, 3], [10, 8]];
  function fiabilite(L, jour) {
    var ANG = [1, 4, 7, 10], T = L.theme.bases;
    var maisons = function (f) { var l = []; for (var h = 1; h <= 16; h++) if (T[h] === f || L.resu(h) === f) l.push(h); return l; };
    var somme = function (hs) { return hs.map(function (h) { return T[h]; }).reduce(K.additionner); };
    var m1 = T[1], bin = (m1 - 1) % 4 < 2 ? m1 + 2 : m1 - 2;
    var enAxe = function (f) { return maisons(f).some(function (h) { return ANG.indexOf(h) >= 0; }); };
    var c = [enAxe(bin), enAxe(somme([1, 4, 7, 10])), maisons(somme([3, 5, 11, 15])).length > 0];
    if (jour !== undefined && jour !== null && jour >= 0 && jour <= 6) c.push(FIGURE_DU_JOUR[jour].some(function (f) { return maisons(f).length > 0; }));
    var n = c.filter(Boolean).length;
    return { niveau: n, total: c.length, valide: n === c.length };
  }

  var API = { version: '4.0.0-noyau', lire: lire, verdict: verdict, fiabilite: fiabilite, equilibre: equilibre, PRINCIPES: PRINCIPES.map(function (p) { return p.id; }), analyser: function (meres, jour) { var L = lire(meres); return { lecture: L, verdict: verdict(L), fiabilite: fiabilite(L, jour) }; } };
  root.KOUN4 = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
