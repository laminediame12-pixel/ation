/* koun — moteur 4 : le noyau, lu. Aucun verdict.
   Repose sur moteur3/noyau.js (structure exacte, démontrée sur les 65 536 thèmes). Le moteur lit : thème, résultantes, pôles, mode, présences,
   équilibre des deux parties (équation vérifiée), validation FI-5. Il ne prédit rien : aucune règle de victoire ou de nul n'est démontrée
   (voir moteur4/MOTEUR4.md). Une règle n'entre ici que prouvée. */
(function (root) {
  'use strict';
  var K = (typeof require !== 'undefined' && typeof module !== 'undefined') ? require('../moteur3/noyau.js') : root.KOUN_NOYAU;
  var mod = function (n) { return ((n - 1) % 16 + 16) % 16 + 1; };
  var pts = function (n) { return K.niveaux(n); };

  function lire(meres) {
    var T = K.construire(meres), b = T.bases, r = T.resultantes, P = K.poles(T);
    var base = function (h) { return b[h]; }, resu = function (h) { return h === 16 ? b[16] : r[h]; };
    var presentEn = function (f, h) { return b[h] === f || resu(h) === f; };
    var chezElle = function (f) { return presentEn(f, f); };
    var pole = function (p) { return { maison: p.maison, figure: p.figure, front: K.front(p.figure), n: p.figure }; };
    var R1 = pole(P.R1), R7 = pole(P.R7);
    var mode = R1.front === R7.front ? 'MEME_FRONT' : (R1.figure % 2 === R7.figure % 2 ? 'MEME_BOUCLE' : 'BOUCLES_DIFFERENTES');
    return { theme: T, R1: R1, R7: R7, mode: mode, chezElle: chezElle, base: base, resu: resu, lien: K.additionner(R1.figure, R7.figure) };
  }

  // Équilibre des deux parties (équation établie sur les 65 536 thèmes,) : nul permis seulement si écart base + écart résultante = 0.
  function equilibre(L) {
    var X = [1, 2, 3, 4].map(function (h) { return [0, 1, 2, 3].map(function (l) { return pts(L.base(h))[l] === 1 ? 1 : 0; }); });
    var A = [X[0][0] ^ X[1][0], X[2][1] ^ X[3][1], X[0][2] ^ X[1][2] ^ X[2][2] ^ X[3][2], X[0][3] ^ X[1][3] ^ X[2][3] ^ X[3][0] ^ X[3][1] ^ X[3][2]];
    var B = [X[0][0] ^ X[0][1], X[1][2] ^ X[1][3], X[2][0] ^ X[2][1] ^ X[2][2] ^ X[2][3], X[1][3] ^ X[2][3] ^ X[3][0] ^ X[3][1] ^ X[3][2]];
    var rA = [1, 0, 1, 1], rB = [0, 0, 1, 0], s = function (v) { return v.reduce(function (a, c) { return a + c; }, 0); };
    var eb = s(B) - s(A), er = s(B.map(function (v, k) { return v ^ rB[k]; })) - s(A.map(function (v, k) { return v ^ rA[k]; })) + 2 * (X[2][2] - X[3][3]);
    return { ecartBase: eb, ecartRes: er, equilibre: eb + er === 0 };
  }
  // FI-5 : binôme de M1 en maison angulaire ; somme de l'axe angulaire présente (son emplacement est ignoré) ; somme 3-5-11-15 présente ; figure du jour présente (si jour donné).
  var FIGURE_DU_JOUR = [[12], [16, 5], [1, 7], [11], [15, 3], [6, 3], [10, 8]];
  function fiabilite(L, jour) {
    var ANG = [1, 4, 7, 10], T = L.theme.bases;
    var maisons = function (f) { var l = []; for (var h = 1; h <= 16; h++) if (T[h] === f || L.resu(h) === f) l.push(h); return l; };
    var somme = function (hs) { return hs.map(function (h) { return T[h]; }).reduce(K.additionner); };
    var m1 = T[1], bin = (m1 - 1) % 4 < 2 ? m1 + 2 : m1 - 2;
    var enAxe = function (f) { return maisons(f).some(function (h) { return ANG.indexOf(h) >= 0; }); };
    var c = [enAxe(bin), maisons(somme([1, 4, 7, 10])).length > 0, maisons(somme([3, 5, 11, 15])).length > 0];
    if (jour !== undefined && jour !== null && jour >= 0 && jour <= 6) c.push(FIGURE_DU_JOUR[jour].some(function (f) { return maisons(f).length > 0; }));
    var n = c.filter(Boolean).length;
    return { niveau: n, total: c.length, valide: n === c.length };
  }


  // Analyse d'un pôle : pour chaque groupe (front du pôle, front binôme, binôme, antagoniste), emplacements des figures (base ou résultante) et niveaux saturés de la résultante de la maison où elles se trouvent.
  var LETTRES = ['F', 'A', 'E', 'T'];
  function analysePole(L, c) {
    var T = L.theme, b = T.bases, p = c.figure, z = (p - 1) % 4, nsat = function (f) { return K.niveaux(f).filter(function (v) { return v === 2; }).length; };
    function placer(f) {
      var out = [];
      for (var h = 1; h <= 16; h++) {
        var ib = b[h] === f, ir = h < 16 && T.resultantes[h] === f;
        if (ib || ir) { var r = L.resu(h); out.push({ maison: h, couche: ib && ir ? 'base+résultante' : ib ? 'base' : 'résultante', chezElle: h === f, niveaux: K.niveaux(r).map(function (v, i) { return v === 2 ? LETTRES[i] : '.'; }).join(''), satures: nsat(r) }); }
      }
      return out;
    }
    function groupe(nom, figures) {
      var niv = (figures[0] - 1) % 4;   // niveau propre du groupe : le niveau (Feu, Air, Eau, Terre) de son front
      var g = { nom: nom, niveau: LETTRES[niv], figures: figures.map(function (f) { var pl = placer(f); return { figure: f, emplacements: pl, absente: pl.length === 0 }; }), emplacements: 0, chezElle: 0, saturation: 0, absentes: 0, propres: 0 };
      g.figures.forEach(function (x) { if (x.absente) g.absentes++; x.emplacements.forEach(function (e) { g.emplacements++; g.saturation += e.satures; if (e.chezElle) g.chezElle++; if (e.niveaux.charAt(niv) !== '.') g.propres++; }); });
      return g;
    }
    var colonne = function (zz) { return [1, 2, 3, 4].map(function (i) { return zz + 4 * (i - 1) + 1; }); };
    var binome = (p - 1) % 4 < 2 ? p + 2 : p - 2;
    return { figure: p, maison: c.maison, front: c.front, saturationMaison: nsat(L.resu(c.maison)),
      front_: groupe('Front ' + K.front(p), colonne(z)), frontBinome: groupe('Front binôme ' + K.front(p + 2), colonne((z + 2) % 4)), binome: groupe('Binôme', [binome]), antagoniste: groupe('Antagoniste', [mod(p - 3)]) };
  }

  // Les 15 nœuds : intersections des canaux dans la croix de chaque front. Nœud (niveau horizontal i, niveau vertical j) = maison 4j + i + 1 (M16 n'a pas de nœud : coin de la Terre).
  // Croix du front f : haut f, droite f+4, bas f+8, gauche f+12 (maisons de repos). Une liaison est saturée quand la résultante de la maison qui la porte est saturée à ce niveau.
  // Moitié gauche : colonnes j = 0, 1 ; moitié droite : j = 2, 3 ; moitié haute : lignes i = 0, 1 ; moitié basse : i = 2, 3. La Terre dévie : colonne 3 = Terre verticale du haut, ligne 3 = Terre horizontale de gauche.
  // Un nœud est « plein » si ses deux liaisons sont saturées, « vide » si aucune ne l'est, « mixte » sinon. « Arrêt » : la maison porte en base son antagoniste (la figure h − 3) ancré chez elle.
  function noeuds(L) {
    var b = L.theme.bases, lv = function (h) { return K.niveaux(L.resu(h)); }, sat = function (h, l) { return lv(h)[l] === 2; };
    var stops = [];
    for (var h = 1; h <= 15; h++) if (b[h] === mod(h - 3)) stops.push({ maison: h, figure: b[h] });
    var fronts = [1, 2, 3, 4].map(function (f) {
      var haut = f, droite = f + 4, bas = f + 8, gauche = f + 12, liste = [], pleins = 0, vides = 0, mixtes = 0;
      for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) {
        if (i === 3 && j === 3) continue;
        var hor, ver;
        if (i < 3 && j < 3) { hor = sat(j < 2 ? gauche : droite, i); ver = sat(i < 2 ? haut : bas, j); }
        else if (j === 3) { hor = sat(droite, i); ver = sat(haut, 3); }
        else { hor = sat(bas, j); ver = sat(gauche, 3); }
        var etat = hor && ver ? 'plein' : !hor && !ver ? 'vide' : 'mixte';
        if (etat === 'plein') pleins++; else if (etat === 'vide') vides++; else mixtes++;
        var mh = 4 * j + i + 1;
        liste.push({ maison: mh, i: i, j: j, etat: etat, arret: b[mh] === mod(mh - 3) });
      }
      return { front: K.front(f), noeuds: liste, pleins: pleins, vides: vides, mixtes: mixtes };
    });
    return { fronts: fronts, arrets: stops, niveaux: LETTRES };
  }

  // Faits du thème : ce que la structure impose et que la simple lecture des placements ne montre pas.
  // 1. relations : pour chaque maison, la relation de sa base avec la maison (neutre = Populus, chez elle, miroir h+8, binôme, miroir du binôme, antagoniste ancré h−3, victime h+3).
  // 2. attaques : entre les groupes des deux pôles, figure k attaque k+3 (cercle des fronts A→D→C→B→A) ; attaquant absent = victime non attaquée ; deux chez elles = double repos.
  // 3. uniques : figures d'un groupe qui n'ont qu'un emplacement, et par quelle relation.
  // 4. liaisons : niveaux saturés des deux côtés entre la maison d'un pôle et sa maison miroir (h+8) et sa maison binôme.
  function faits(L) {
    var T = L.theme, b = T.bases, P = poles(L), nsat = function (f) { return K.niveaux(f).filter(function (v) { return v === 2; }).length; };
    function tags(h, f) {
      var t = [];
      if (f === 16 && h !== 16) t.push('neutre');
      if (f === h) t.push('chez elle');
      if (f === K.miroir(h)) t.push('miroir');
      if (f === K.binome(h)) t.push('binôme');
      if (f === K.miroir(K.binome(h))) t.push('miroir du binôme');
      if (f === mod(h - 3)) t.push('antagoniste ancré');
      if (f === mod(h + 3)) t.push('victime');
      return t;
    }
    var relations = [];
    for (var h = 1; h <= 16; h++) { var t = tags(h, b[h]); if (t.length) relations.push({ maison: h, figure: b[h], relations: t, resultante: L.resu(h) }); }
    function resume(g, f) { var x = g.figures.filter(function (y) { return y.figure === f; })[0]; var pl = x ? x.emplacements : []; return { figure: f, emplacements: pl.length, saturation: pl.reduce(function (a, e) { return a + e.satures; }, 0), chezElle: pl.some(function (e) { return e.chezElle; }) }; }
    var attaques = [];
    [['R1', 'R7'], ['R7', 'R1']].forEach(function (pr) {
      ['front_', 'frontBinome'].forEach(function (gk) {
        var G = P[pr[0]][gk], f0 = (G.figures[0].figure - 1) % 4;
        ['front_', 'frontBinome'].forEach(function (hk) {
          var H = P[pr[1]][hk];
          if ((H.figures[0].figure - 1) % 4 !== (f0 + 3) % 4) return;
          G.figures.forEach(function (x) {
            var k = x.figure, v = mod(k + 3), a = resume(G, k), w = resume(H, v), st;
            if (a.emplacements === 0 && w.emplacements === 0) st = 'les deux absents'; else if (a.emplacements === 0) st = 'attaquant absent : victime non attaquée'; else if (w.emplacements === 0) st = 'victime absente';
            else if (a.chezElle && w.chezElle) st = 'double repos : les deux chez elles'; else st = a.saturation > w.saturation ? 'attaquant plus saturé' : a.saturation < w.saturation ? 'victime plus saturée' : 'égalité';
            attaques.push({ de: pr[0], vers: pr[1], attaquant: a, victime: w, statut: st });
          });
        });
      });
    });
    var uniques = [];
    ['R1', 'R7'].forEach(function (c) { ['front_', 'frontBinome', 'binome', 'antagoniste'].forEach(function (gk) { P[c][gk].figures.forEach(function (x) { if (x.emplacements.length === 1) { var e = x.emplacements[0]; uniques.push({ pole: c, groupe: P[c][gk].nom, figure: x.figure, maison: e.maison, couche: e.couche, relations: tags(e.maison, x.figure) }); } }); }); });
    var liaisons = [];
    [['R1', L.R1], ['R7', L.R7]].forEach(function (pc) {
      var h = pc[1].maison, bn = (h - 1) % 4 < 2 ? h + 2 : h - 2;
      [['miroir', mod(h + 8)], ['binôme', bn]].forEach(function (o) {
        var x = K.niveaux(L.resu(h)), y = K.niveaux(L.resu(o[1])), n = [];
        for (var l = 0; l < 4; l++) if (x[l] === 2 && y[l] === 2) n.push(LETTRES[l]);
        liaisons.push({ pole: pc[0], maison: h, avec: o[0], maisonAvec: o[1], niveaux: n.join('') });
      });
    });
    return { relations: relations, attaques: attaques, uniques: uniques, liaisons: liaisons };
  }
  // Lecture comparée : chaque indicateur désigne le pôle favorisé (+1 : R1, −1 : R7, 0 : égal).
  // 1-3 : plus de saturation cumulée dans son front, son front binôme, son binôme ; 4 : moins dans son antagoniste ;
  // 5 : plus d'emplacements (front + front binôme) où le niveau propre du groupe, celui de son front, est saturé.
  function poles(L) {
    var a = analysePole(L, L.R1), e = analysePole(L, L.R7), sg = function (x) { return x > 0 ? 1 : x < 0 ? -1 : 0; };
    var ind = [sg(a.front_.saturation - e.front_.saturation), sg(a.frontBinome.saturation - e.frontBinome.saturation), sg(a.binome.saturation - e.binome.saturation), sg(e.antagoniste.saturation - a.antagoniste.saturation), sg((a.front_.propres + a.frontBinome.propres) - (e.front_.propres + e.frontBinome.propres))];
    var net = ind.every(function (x) { return x > 0; }) ? 'R1' : ind.every(function (x) { return x < 0; }) ? 'R7' : null;
    return { R1: a, R7: e, indicateurs: ind, net: net };
  }
  var API = { faits: faits, noeuds: noeuds, poles: poles, version: '4.0.0-noyau-sans-verdict', lire: lire, fiabilite: fiabilite, equilibre: equilibre, analyser: function (meres, jour) { var L = lire(meres); return { lecture: L, fiabilite: fiabilite(L, jour) }; } };
  root.KOUN4 = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
