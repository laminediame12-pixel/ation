/* koun — noyau structurel (fichier autonome, sans aucune règle de verdict).
   Tout ce qui suit est une fonction exacte des quatre mères, démontrée sur les 65 536 thèmes (moteur3/INVARIANTS.md, outils/invariants.js).
   Une seule table : les 16 figures et leurs niveaux. Le reste est de l'algèbre : addition (niveaux égaux = 2 points, différents = 1),
   miroir = + Tristitia, binôme = + Amissio (blocs M1-4, M9-12) ou + Puella (blocs M5-8, M13-16), antagoniste = n − 3, front = (n − 1) mod 4.
   API : construire, verifier, deduire, poles, plus les opérations de base. Aucune règle de verdict. */
(function (root) {
  'use strict';
  var FIGURES = [
    ['Puer', [1, 1, 2, 1]], ['Laetitia', [1, 2, 2, 2]], ['Caput', [2, 1, 1, 1]], ['Albus', [2, 2, 1, 2]], ['Via', [1, 1, 1, 1]], ['Amissio', [1, 2, 1, 2]], ['Rubeus', [2, 1, 2, 2]], ['Tristitia', [2, 2, 2, 1]],
    ['Fortuna Minor', [1, 1, 2, 2]], ['Carcer', [1, 2, 2, 1]], ['Conjunctio', [2, 1, 1, 2]], ['Fortuna Major', [2, 2, 1, 1]], ['Cauda Draconis', [1, 1, 1, 2]], ['Puella', [1, 2, 1, 1]], ['Aquisitio', [2, 1, 2, 1]], ['Populus', [2, 2, 2, 2]]
  ];
  var NIVEAUX = ['Feu', 'Air', 'Eau', 'Terre'], FRONTS = ['A', 'B', 'C', 'D'];
  var PAR_CLE = {}; FIGURES.forEach(function (f, i) { PAR_CLE[f[1].join()] = i + 1; });
  function mod16(n) { return ((n - 1) % 16 + 16) % 16 + 1; }
  function nom(n) { return FIGURES[mod16(n) - 1][0]; }
  function niveaux(n) { return FIGURES[mod16(n) - 1][1].slice(); }
  function numero(nomFigure) { for (var i = 0; i < 16; i++) if (FIGURES[i][0] === nomFigure) return i + 1; return null; }
  // addition : niveaux égaux = 2 points (saturé), différents = 1 point
  function additionner(a, b) { var x = FIGURES[a - 1][1], y = FIGURES[b - 1][1]; return PAR_CLE[x.map(function (v, i) { return v === y[i] ? 2 : 1; }).join()]; }
  function front(n) { return FRONTS[(n - 1) % 4]; }
  function antagoniste(n) { return mod16(n - 3); }
  function miroir(n) { return additionner(n, 8); }                                   // + Tristitia : inverse le niveau Terre
  function binome(n) { return additionner(n, Math.floor((n - 1) / 4) % 2 === 0 ? 6 : 14); }  // + Amissio (blocs pairs) ou + Puella (blocs impairs)
  function bit(n, l) { return FIGURES[n - 1][1][l] === 1 ? 1 : 0; }

  // ── Construction d'un thème à partir des quatre mères : bases[1..16], résultantes[1..16] (M16 : résultante = base, car Populus est le neutre)
  function construire(meres) {
    if (!meres || meres.length !== 4 || meres.some(function (m) { return !(m >= 1 && m <= 16) || m % 1 !== 0; })) throw new Error('Quatre mères de 1 à 16 sont attendues.');
    var b = [null, meres[0], meres[1], meres[2], meres[3]];
    for (var l = 0; l < 4; l++) b[5 + l] = PAR_CLE[meres.map(function (m) { return FIGURES[m - 1][1][l]; }).join()];   // filles : la ligne l des quatre mères
    b[9] = additionner(b[1], b[2]); b[10] = additionner(b[3], b[4]); b[11] = additionner(b[5], b[6]); b[12] = additionner(b[7], b[8]);
    b[13] = additionner(b[9], b[10]); b[14] = additionner(b[11], b[12]); b[15] = additionner(b[13], b[14]); b[16] = additionner(b[15], b[1]);
    var r = [null]; for (var h = 1; h <= 16; h++) r.push(additionner(b[h], h));
    return { meres: meres.slice(), bases: b, resultantes: r };
  }
  // ── Pôles : R1 = maison dont le numéro est la figure de M1, R7 = R1 + 6 ; la figure d'un pôle est la base de sa maison
  function poles(theme) {
    var h1 = theme.bases[1], h7 = mod16(h1 + 6);
    return { R1: { maison: h1, figure: theme.bases[h1] }, R7: { maison: h7, figure: theme.bases[h7] } };
  }

  // ── Les 48 lois : formes linéaires des 64 niveaux de maisons en fonction des 16 bits des mères (variable 4·m + l : niveau l de la mère m+1)
  var FORMES = (function () {
    var e = function (m, l) { return 1 << (4 * m + l); }, M = {}, i, l;
    for (i = 1; i <= 4; i++) M[i] = [0, 1, 2, 3].map(function (k) { return e(i - 1, k); });
    for (l = 0; l < 4; l++) M[5 + l] = [0, 1, 2, 3].map(function (m) { return e(m, l); });
    var ad = function (a, b) { return a.map(function (x, k) { return x ^ b[k]; }); };
    M[9] = ad(M[1], M[2]); M[10] = ad(M[3], M[4]); M[11] = ad(M[5], M[6]); M[12] = ad(M[7], M[8]); M[13] = ad(M[9], M[10]); M[14] = ad(M[11], M[12]); M[15] = ad(M[13], M[14]); M[16] = ad(M[15], M[1]);
    return M;
  })();
  var TRIPLES = [[1, 2, 9], [3, 4, 10], [5, 6, 11], [7, 8, 12], [9, 10, 13], [11, 12, 14], [13, 14, 15], [1, 15, 16]];
  // loi de construction : M(c) = M(a) + M(b) pour les triples (a, b, c) ; loi de transposition : niveau l' de M(m+1) = niveau m de M(5+l')
  function verifierLois(bases) {
    var viol = [], t, l, m, lp;
    for (t = 0; t < TRIPLES.length; t++) for (l = 0; l < 4; l++) {
      var x = TRIPLES[t].reduce(function (s, h) { return s ^ bit(bases[h], l); }, 0);
      if (x) viol.push({ loi: 'construction', maisons: TRIPLES[t].slice(), niveau: NIVEAUX[l], texte: 'la somme des maisons M' + TRIPLES[t].join(' + M') + ' doit être Populus au niveau ' + NIVEAUX[l] });
    }
    for (m = 0; m < 4; m++) for (lp = 0; lp < 4; lp++) if (bit(bases[m + 1], lp) !== bit(bases[5 + lp], m))
      viol.push({ loi: 'transposition', maisons: [m + 1, 5 + lp], niveau: NIVEAUX[lp] + '/' + NIVEAUX[m], texte: 'M' + (m + 1) + ' ' + NIVEAUX[lp] + ' doit égaler M' + (5 + lp) + ' ' + NIVEAUX[m] });
    return viol;
  }
  // ── Vérificateur : un thème complet (bases[1..16]) est valide s'il est exactement celui que donnent ses quatre premières maisons
  function verifier(bases) {
    var erreurs = [], h;
    for (h = 1; h <= 16; h++) if (!(bases[h] >= 1 && bases[h] <= 16) || bases[h] % 1 !== 0) erreurs.push({ type: 'figure', maison: h, texte: 'M' + h + ' : figure inconnue' });
    if (erreurs.length) return { valide: false, erreurs: erreurs, lois: [] };
    var attendu = construire([bases[1], bases[2], bases[3], bases[4]]).bases;
    for (h = 5; h <= 16; h++) if (attendu[h] !== bases[h]) erreurs.push({ type: 'maison', maison: h, lu: bases[h], attendu: attendu[h], texte: 'M' + h + ' devrait être ' + nom(attendu[h]) + ' (lu : ' + nom(bases[h]) + ')' });
    return { valide: erreurs.length === 0, erreurs: erreurs, lois: erreurs.length ? verifierLois(bases) : [] };
  }

  // ── Déduction : à partir de quelques maisons connues (maison → figure en base), cohérence et niveaux imposés ailleurs
  function reduire(base, masque, rhs) {
    for (var b = 15; b >= 0; b--) if ((masque >> b) & 1) { var e = base[b]; if (e) { masque ^= e[0]; rhs ^= e[1]; } else return { masque: masque, rhs: rhs, bit: b }; }
    return { masque: 0, rhs: rhs, bit: -1 };
  }
  function systeme(connus) {
    var base = {}, vus = [], hs = Object.keys(connus).map(Number).sort(function (a, b) { return a - b; });
    for (var k = 0; k < hs.length; k++) {
      var h = hs[k];
      if (!(connus[h] >= 1 && connus[h] <= 16) || !(h >= 1 && h <= 16)) return { erreur: 'M' + h + ' : maison ou figure inconnue' };
      for (var l = 0; l < 4; l++) {
        var r = reduire(base, FORMES[h][l], bit(connus[h], l));
        if (r.bit < 0) { if (r.rhs) return { conflit: true, maison: h, base: base, vus: vus.slice() }; }
        else base[r.bit] = [r.masque, r.rhs];
      }
      vus.push(h);
    }
    return { conflit: false, base: base };
  }
  function deduire(connus) {
    var s = systeme(connus);
    if (s.erreur) return { coherent: false, erreur: s.erreur };
    if (s.conflit) {   // plus petit ensemble de maisons incompatibles : on retire les maisons une à une tant que le conflit demeure
      var courant = Object.keys(connus).map(Number).sort(function (a, b) { return a - b; }), i = 0;
      var sans = function (ens, h) { var c = {}; ens.forEach(function (x) { if (x !== h) c[x] = connus[x]; }); return c; };
      while (i < courant.length) { var essai = courant.filter(function (x, j) { return j !== i; }), obj = {}; essai.forEach(function (x) { obj[x] = connus[x]; }); if (systeme(obj).conflit) courant = essai; else i++; }
      return { coherent: false, conflit: courant };
    }
    var base = s.base, rang = Object.keys(base).length, imposes = [], determine = rang === 16, h, l;
    for (h = 1; h <= 16; h++) for (l = 0; l < 4; l++) {
      if (connus[h] !== undefined) continue;
      var r = reduire(base, FORMES[h][l], 0);
      if (r.bit < 0) imposes.push({ maison: h, niveau: NIVEAUX[l], points: r.rhs ? 1 : 2 });
    }
    var res = { coherent: true, rang: rang, determine: determine, imposes: imposes };
    if (determine) {
      var meres = [0, 1, 2, 3].map(function (m) {
        var lv = [0, 1, 2, 3].map(function (lev) { var b = 1 << (4 * m + lev); var r = reduire(base, b, 0); return r.bit < 0 ? (r.rhs ? 1 : 2) : null; });
        return PAR_CLE[lv.join()];
      });
      res.theme = construire(meres);
    }
    return res;
  }

  var API = { FIGURES: FIGURES, NIVEAUX: NIVEAUX, nom: nom, numero: numero, niveaux: niveaux, additionner: additionner, front: front, antagoniste: antagoniste, miroir: miroir, binome: binome,
    construire: construire, poles: poles, verifier: verifier, verifierLois: verifierLois, deduire: deduire, TRIPLES: TRIPLES, FORMES: FORMES };
  root.KOUN_NOYAU = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
