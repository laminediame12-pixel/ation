/* koun — moteur 4 : le noyau, lu. Aucun verdict.
   Repose sur moteur3/noyau.js (structure exacte, démontrée sur les 65 536 thèmes). Le moteur lit : thème, résultantes, pôles, mode, présences,
   équilibre des deux parties (équation vérifiée), validation FI-5. Il ne prédit rien : aucune règle de victoire n'est démontrée
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

  // Équilibre des deux parties (équation établie sur les 65 536 thèmes,) : écart base + écart résultante = 0.
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
    // binôme d'un pôle = son protecteur f − 6 (propriétaire, 2026-11-27 : « Populus en M11 permet à Conjunctio de bloquer Puella et de protéger Puer ») ;
    // il bloque l'antagoniste du pôle. Son front est le même que celui de l'ancien binôme (f ± 2), donc le « front binôme » ne change pas.
    var binome = mod(p - 6);
    return { figure: p, maison: c.maison, front: c.front, saturationMaison: nsat(L.resu(c.maison)),
      front_: groupe('Front ' + K.front(p), colonne(z)), frontBinome: groupe('Front binôme ' + K.front(p + 2), colonne((z + 2) % 4)), binome: groupe('Binôme (protecteur)', [binome]), antagoniste: groupe('Antagoniste', [mod(p - 3)]) };
  }

  // Les 15 nœuds : intersections des canaux dans la croix de chaque front. Nœud (niveau horizontal i, niveau vertical j) = maison 4j + i + 1 (M16 n'a pas de nœud : coin de la Terre).
  // Croix du front f : haut f, droite f+4, bas f+8, gauche f+12 (maisons de repos). Une liaison est saturée quand la résultante de la maison qui la porte est saturée à ce niveau.
  // Moitié gauche : colonnes j = 0, 1 ; moitié droite : j = 2, 3 ; moitié haute : lignes i = 0, 1 ; moitié basse : i = 2, 3. La Terre dévie : colonne 3 = Terre verticale du haut, ligne 3 = Terre horizontale de gauche.
  // Un nœud est « plein » si ses deux liaisons sont saturées, « vide » si aucune ne l'est, « mixte » sinon. « Arrêt » : la maison porte en base son antagoniste (la figure h − 3) ancré chez elle.
  function noeuds(L) {
    var b = L.theme.bases, lv = function (h) { return K.niveaux(L.resu(h)); }, sat = function (h, l) { return lv(h)[l] === 2; };
    var stops = [];
    for (var h = 1; h <= 16; h++) if (b[h] === mod(h - 3)) stops.push({ maison: h, figure: b[h] });
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

  // Niveaux d'activation et canal (règle posée par le propriétaire) : un pôle a 4 niveaux d'activation (2 points = activé). Son canal est l'élément de son front ;
  // le canal compatible est Feu↔Air, Eau↔Terre. On compte les niveaux activés qui tombent sur son canal ou sur le canal compatible. Même procédé pour son miroir, son binôme et son antagoniste,
  // chacun avec son propre canal. Score 1 : le pôle seul (0 à 2) ; score 4 : pôle + miroir + binôme + antagoniste. H-NIV1 (score 1) et H-NIV4 (score 4) sont réfutées ; les comptes restent comme structure.
  var COMPAT = [1, 0, 3, 2];
  function activation(L) {
    function compte(f) { var z = (f - 1) % 4, lv = K.niveaux(f), n = []; lv.forEach(function (v, i) { if (v === 2 && (i === z || i === COMPAT[z])) n.push(LETTRES[i]); }); return { figure: f, niveaux: lv.map(function (v, i) { return v === 2 ? LETTRES[i] : '.'; }).join(''), canal: LETTRES[z], compatible: LETTRES[COMPAT[z]], coincide: n.join(''), n: n.length }; }
    function pole(c) {
      var p = c.figure, parts = [['pôle', p], ['miroir', K.miroir(p)], ['binôme (protecteur)', mod(p - 6)], ['antagoniste', mod(p - 3)]].map(function (x) { var r = compte(x[1]); r.role = x[0]; return r; });
      return { parts: parts, score1: parts[0].n, score4: parts.reduce(function (a, x) { return a + x.n; }, 0) };
    }
    var a = pole(L.R1), e = pole(L.R7);
    return { R1: a, R7: e };
  }

  // Niveaux connectés du front d'un pôle (structure ; l'hypothèse H-BUTS qui en faisait les buts est réfutée) : dans la croix du front (haut f, droite f+4, bas f+8, gauche f+12), un niveau est connecté quand la liaison
  // entre deux maisons opposées est saturée des deux côtés : Feu, Air, Eau en vertical (haut-bas) ou en horizontal (gauche-droite) ; Terre déviée (haut→droite ou bas→gauche).
  // On compte les niveaux distincts connectés (0 à 4).
  function connexions(L) {
    var sat = function (h, l) { return K.niveaux(L.resu(h))[l] === 2; };
    function front(c) {
      var f = (c.figure - 1) % 4 + 1, haut = f, droite = f + 4, bas = f + 8, gauche = f + 12, liaisons = [], niv = {};
      for (var l = 0; l < 3; l++) {
        if (sat(haut, l) && sat(bas, l)) { liaisons.push(LETTRES[l] + ' vertical M' + haut + '↔M' + bas); niv[l] = 1; }
        if (sat(gauche, l) && sat(droite, l)) { liaisons.push(LETTRES[l] + ' horizontal M' + gauche + '↔M' + droite); niv[l] = 1; }
      }
      if (sat(haut, 3) && sat(droite, 3)) { liaisons.push('T déviée M' + haut + '→M' + droite); niv[3] = 1; }
      if (sat(bas, 3) && sat(gauche, 3)) { liaisons.push('T déviée M' + bas + '→M' + gauche); niv[3] = 1; }
      var lettres = LETTRES.filter(function (x, i) { return niv[i]; }).join('');
      return { front: K.front(c.figure), niveaux: lettres, n: lettres.length, liaisons: liaisons };
    }
    return { R1: front(L.R1), R7: front(L.R7) };
  }

  // Multiplicité : combien de fois une même figure est placée dans le thème (maisons où elle est en base ou en résultante, une maison comptée une fois), et ce qu'elle fait de cette multiplicité.
  // Prédateur : la figure f attaque f+3 ; sa multiplicité s'oppose à celle de sa cible. Proie : elle est attaquée par f−3. Protecteur : f protège f+6, car f attaque f+3, l'attaquant de f+6.
  // La boucle d'un pôle est l'ensemble des 8 figures de même parité que sa figure (deux fronts : B et D pour les pairs, A et C pour les impairs).
  function multiplicite(L) {
    var T = L.theme, b = T.bases, mult = {};
    for (var f = 1; f <= 16; f++) { var c = 0; for (var h = 1; h <= 16; h++) if (b[h] === f || (h < 16 && T.resultantes[h] === f)) c++; mult[f] = c; }
    function boucle(c) {
      var par = c.figure % 2, figures = [], tot = 0, exposees = 0, predateurs = 0;
      for (var f = 1; f <= 16; f++) {
        if (f % 2 !== par) continue;
        var t = mod(f + 3), a = mod(f - 3), p = mod(f + 6), g = mod(f - 6);
        var x = { figure: f, front: K.front(f), m: mult[f], predateur: { cible: t, m: mult[t], libre: mult[f] > 0 && mult[t] === 0 }, proie: { attaquant: a, m: mult[a] }, protecteur: { protege: p, attaquantDuProtege: t, m: mult[t], garde: Math.min(mult[f], mult[t]) }, protegePar: { figure: g, m: mult[g] } };
        x.exposee = mult[f] > 0 && mult[a] > 0 && mult[g] === 0;
        tot += mult[f]; if (x.exposee) exposees++; if (mult[f] > 0 && mult[t] > 0) predateurs++;
        figures.push(x);
      }
      return { figures: figures, total: tot, exposees: exposees, predateurs: predateurs };
    }
    return { mult: mult, R1: boucle(L.R1), R7: boucle(L.R7) };
  }

  // Paralysie par l'antagoniste (lecture du propriétaire). La figure f de la maison h est paralysée quand son antagoniste a = f − 3 est ancré en base de sa maison : la résultante est a + f.
  // Les niveaux paralysés de f sont ceux dont la saturation change entre f et cette résultante : exactement les niveaux à un point de l'antagoniste. Le canal de f (l'élément de son front) est paralysé
  // quand son niveau fait partie des niveaux changés. Exemple : Conjunctio (2112) en M14 change l'Air et l'Eau de Puella.
  function paralysieFigure(f) {
    var a = mod(f - 3), x = K.niveaux(f), r = K.niveaux(K.additionner(a, f)), niv = [];
    for (var i = 0; i < 4; i++) if ((x[i] === 2) !== (r[i] === 2)) niv.push(LETTRES[i]);
    var canal = LETTRES[(f - 1) % 4];
    return { figure: f, antagoniste: a, resultante: K.additionner(a, f), niveaux: niv.join(''), canal: canal, canalParalyse: niv.indexOf(canal) >= 0 };
  }
  function paralysie(L) {
    var b = L.theme.bases, liste = [];
    for (var h = 1; h <= 16; h++) if (b[h] === mod(h - 3)) {
      var p = paralysieFigure(h), m = mod(h + 8), pm = paralysieFigure(m), commun = p.niveaux.split('').filter(function (l) { return pm.niveaux.indexOf(l) >= 0; }).join('');
      p.maison = h; p.front = K.front(h); p.miroir = m; p.niveauxMiroir = pm.niveaux; p.communAvecMiroir = commun; liste.push(p);
    }
    return liste;
  }
  // Liaisons de Terre : la Terre dévie dans la croix de chaque front (haut f → droite f+4, bas f+8 → gauche f+12) et relie ainsi les deux paires de maisons miroir du front.
  // Une liaison est connectée si les deux résultantes sont saturées en Terre ; sinon elle est rompue, et on dit de quel côté.
  function liaisonsTerre(L) {
    var sat = function (h) { return K.niveaux(L.resu(h))[3] === 2; };
    return [1, 2, 3, 4].map(function (f) {
      var lien = function (a, c) { var x = sat(a), y = sat(c); return { de: a, vers: c, etat: x && y ? 'connectée' : (!x && !y ? 'rompue des deux côtés' : (x ? 'rompue en M' + c : 'rompue en M' + a)) }; };
      return { front: K.front(f), liens: [lien(f, f + 4), lien(f + 8, f + 12)] };
    });
  }

  // Saturation de Terre : nombre de maisons dont la résultante est saturée en Terre (total sur les 16 maisons et par front). Structure seule.
  function terreSaturee(L) {
    var sat = function (h) { return K.niveaux(L.resu(h))[3] === 2; }, par = [0, 1, 2, 3].map(function (z) { return [1, 2, 3, 4].filter(function (i) { return sat(z + 4 * (i - 1) + 1); }).length; });
    return { total: par.reduce(function (a, b) { return a + b; }, 0), parFront: par };
  }

  // La formule des buts par la Terre (ceil(T/2)+1) a été réfutée (2-12-4-4 : 4 prévus, 6 réels) et retirée ; le comptage de Terre (terreSaturee) reste comme structure.

  // Interactions par canal (lecture du propriétaire : une figure dans une maison ne vaut rien sans ce qui l'entoure). Pour chaque maison h et chaque niveau l (Feu, Air, Eau, Terre) :
  //   miroir : la résultante de h et celle de sa maison miroir h+8 sont toutes deux saturées à ce niveau ;
  //   binôme : idem avec la maison binôme (couples 1-3, 2-4, 5-7, 6-8, 9-11, 10-12, 13-15, 14-16) ;
  //   paralysie : le niveau de h est saturé et l'antagoniste (f − 3) de sa figure de résultante est placé dans le thème avec ce niveau à un point ;
  //   propre : le niveau saturé est celui de l'élément de la maison.
  // Comptes sur la boucle de chaque pôle (les 8 maisons de ses deux fronts) et sur son front.
  function interactions(L) {
    var T = L.theme, s = function (h, l) { return K.niveaux(L.resu(h))[l] === 2; };
    var presente = function (f) { for (var h = 1; h <= 16; h++) if (T.bases[h] === f || (h < 16 && T.resultantes[h] === f)) return true; return false; };
    var mir = function (h) { return mod(h + 8); }, bin = function (h) { return (h - 1) % 4 < 2 ? h + 2 : h - 2; };
    function compte(maisons) {
      var o = { miroir: [0, 0, 0, 0], binome: [0, 0, 0, 0], paralysie: [0, 0, 0, 0], propre: [0, 0, 0, 0] };
      maisons.forEach(function (h) {
        var f = L.resu(h), a = mod(f - 3);
        for (var l = 0; l < 4; l++) {
          if (!s(h, l)) continue;
          if (s(mir(h), l)) o.miroir[l]++;
          if (s(bin(h), l)) o.binome[l]++;
          if (presente(a) && K.niveaux(a)[l] === 1) o.paralysie[l]++;
          if (l === (h - 1) % 4) o.propre[l]++;
        }
      });
      return o;
    }
    var fr = function (z) { return [1, 2, 3, 4].map(function (i) { return z + 4 * (i - 1) + 1; }); };
    function pole(c) { var z = (c.figure - 1) % 4, z2 = (z + 2) % 4; return { boucle: compte(fr(z).concat(fr(z2))), front: compte(fr(z)) }; }
    var a = pole(L.R1), b = pole(L.R7), eq = a.boucle.binome[2] === b.boucle.binome[2] && a.boucle.binome[2] > 0;
    return { R1: a, R7: b, binomeEauEquilibre: eq };
  }

  // Les deux témoins (M13 et M14) : leurs figures en base et en résultante, leurs niveaux saturés, la somme des niveaux saturés de leurs deux bases.
  function temoins(L) {
    var sat = function (f) { return K.niveaux(f).filter(function (v) { return v === 2; }).length; }, b = L.theme.bases;
    var base = [b[13], b[14]], res = [L.resu(13), L.resu(14)];
    return { base: base, resultante: res, saturesBase: [sat(base[0]), sat(base[1])], saturesResultante: [sat(res[0]), sat(res[1])], totalBase: sat(base[0]) + sat(base[1]), totalResultante: sat(res[0]) + sat(res[1]), juge: { base: b[15], resultante: L.resu(15) } };
  }

  // Figures au repos (règle du propriétaire, H-REPOS) : une figure est « au repos » quand elle est placée dans sa maison de repos (base ou résultante de la maison de même numéro) ;
  // elle n'est pas annulée quand son antagoniste (f − 3) n'est pas lui aussi au repos. Chaque pôle a deux fronts (le front de sa figure et son front binôme) ; il « possède » un front
  // quand au moins une de ses figures y est au repos sans être annulée.
  function repos(L) {
    var T = L.theme, chez = function (f) { return T.bases[f] === f || (f < 16 && T.resultantes[f] === f); };
    function pole(c) {
      var z = (c.figure - 1) % 4, fronts = [z, (z + 2) % 4].map(function (zz) {
        var figs = [1, 2, 3, 4].map(function (i) { return zz + 4 * (i - 1) + 1; }), ok = figs.filter(function (f) { return chez(f) && !chez(mod(f - 3)); });
        return { front: K.front(zz + 1), figures: ok, annulees: figs.filter(function (f) { return chez(f) && chez(mod(f - 3)); }), n: ok.length };
      });
      return { fronts: fronts, deuxFronts: fronts[0].n > 0 && fronts[1].n > 0, total: fronts[0].n + fronts[1].n };
    }
    var a = pole(L.R1), b = pole(L.R7);
    return { R1: a, R7: b, gagnant: a.deuxFronts && !b.deuxFronts ? 'R1' : b.deuxFronts && !a.deuxFronts ? 'R7' : null };
  }
  // VERDICT. Règle du propriétaire, activée à sa demande (H-REPOS) : le pôle qui possède ses deux fronts (le front de sa figure et son front binôme) au repos, sans que l'antagoniste des figures y soit, gagne.
  // Interprétation retenue : un front est « possédé » quand au moins une de ses figures est dans sa maison de repos sans que son antagoniste (f − 3) y soit aussi ; un pôle gagne s'il possède ses deux fronts et l'autre non.
  // Bilan sur 37 matchs (outils/valider.js) : 4 appels, 3 justes, 1 faux ; elle ne se prononce que sur environ un match sur dix. Les anciennes règles (H-CROIX, H-5, H-TEMOINS, H-BIN-E) sont réfutées et retirées.
  // RYTHME (lecture du propriétaire, H-RYTHME, 2 cas) : la figure-somme des bases de 1-5-12-15 (combinaison des buts de première mi-temps) donne le tempo des buts de la première
  // mi-temps : Feu et Air saturés (front D) = rapide, Feu et Air ouverts (front A) = lent, sinon intermédiaire ; classe de la figure : fermante (1 niveau saturé), ouvrante (3),
  // fixe (2, Terre non saturée), mobile (2, Terre saturée), Via (0), Populus (4).
  function rythme(L) { var T = L.theme, f = [1, 5, 12, 15].map(function (h) { return T.bases[h]; }).reduce(K.additionner), n = K.niveaux(f), s = n.filter(function (v) { return v === 2; }).length;
    // Mécanisme (H-MT-MECANISME, 12 matchs sur 13) : but en première mi-temps quand la figure est rapide (hors Populus, toute fermée), ou quand elle est attaquée :
    // son antagoniste (f−3) est en base quelque part sans que son protecteur (f−6) y soit.
    var enBase = function (g) { var r = []; for (var h = 1; h <= 16; h++) if (T.bases[h] === g) r.push(h); return r; }, ant = mod(f - 3), pro = mod(f - 6), ba = enBase(ant), bp = enBase(pro),
      // Correction après Nice–PSG (1-2) : les maisons 1, 5, 12, 15 fabriquent la figure. Un protecteur ancré dans l'une d'elles est pris dans la figure et ne protège pas ;
      // un antagoniste ancré dans l'une d'elles attaque de l'intérieur et rien ne le bloque. L'attaque n'est bloquée que par un protecteur ancré hors de ces maisons,
      // et seulement si aucun antagoniste n'est ancré dedans.
      COMBI = [1, 5, 12, 15], dedans = function (h) { return COMBI.indexOf(h) >= 0; },
      bloquee = ba.length > 0 && bp.some(function (h) { return !dedans(h); }) && !ba.some(dedans),
      vit = n[0] === 2 && n[1] === 2 ? 'rapide' : n[0] === 1 && n[1] === 1 ? 'lente' : 'intermédiaire', rapide = vit === 'rapide' && f !== 16, attaque = ba.length > 0 && !bloquee;
    // Liaison au binôme (2026-11-21, après Napoli–Torino 0-0, demande du propriétaire) : la figure ne fait marquer que si son binôme est relié au thème : le binôme,
    // son antagoniste ou son protecteur est ancré en base quelque part. Binôme isolé = la figure ne transmet pas.
    var bi = K.binome(f), biLie = enBase(bi).length > 0 || enBase(mod(bi - 3)).length > 0 || enBase(mod(bi - 6)).length > 0;
    return { figure: f, classe: s === 0 ? 'tout ouverte' : s === 4 ? 'toute fermée' : s === 1 ? 'fermante' : s === 3 ? 'ouvrante' : n[3] === 2 ? 'mobile' : 'fixe',
      // PUISSANCE (piste, H-MT-MECANISME) : nombre d'ancrages de la figure en base (0 faible, 1 moyenne, 2 ou plus forte) et fronts directs des pôles qu'elle touche (base ou résultante).
      ancrages: enBase(f).length, puissance: enBase(f).length >= 2 ? 'forte' : enBase(f).length === 1 ? 'moyenne' : 'faible',
      touche: ['R1', 'R7'].filter(function (p) { var z = (L[p].figure - 1) % 4; return [0, 1, 2, 3].some(function (i) { var h = z + 4 * i + 1; return T.bases[h] === f || (h < 16 && T.resultantes[h] === f); }); }),
      // MARQUEUR (piste, 7 pôles sur 7) : le pôle dont le front direct contient une maison où la figure ou son protecteur est ancré en base marque en première mi-temps.
      marqueurs: ['R1', 'R7'].filter(function (p) { var z = (L[p].figure - 1) % 4; return [0, 1, 2, 3].some(function (i) { var h = z + 4 * i + 1; return T.bases[h] === f || T.bases[h] === pro; }); }),
      vitesse: vit, front: K.front(f), antagoniste: ant, antagonisteEnBase: ba, protecteur: pro, protecteurEnBase: bp, attaquee: attaque, binome: bi, binomeLie: biLie, butAttendu: (rapide || attaque) && biLie,
      cause: (rapide || attaque) && !biLie ? 'binôme ' + K.nom(bi) + ' isolé (ni lui, ni son antagoniste, ni son protecteur en base) : la figure ne transmet pas' : rapide ? 'figure rapide (Feu et Air saturés)' : attaque ? 'figure attaquée : ' + K.nom(ant) + ' en base de M' + ba.join(', M') + (ba.some(dedans) ? ' (de l\'intérieur de 1-5-12-15)' : '') + (bp.length ? ', protecteur ' + K.nom(pro) + ' pris dans la combinaison (M' + bp.join(', M') + ')' : ', sans son protecteur ' + K.nom(pro)) :
        ba.length ? 'attaque de ' + K.nom(ant) + ' (M' + ba.join(', M') + ') bloquée par le protecteur ' + K.nom(pro) + ' (M' + bp.join(', M') + ')' : f === 16 ? 'Populus, toute fermée' : 'figure ni rapide ni attaquée' }; }
  // DEUXIÈME MI-TEMPS (piste, H-MT2-CANDIDATES, 2026-11-22) : la figure-somme des bases de 4-5-13-15 (même figure que M4+M5+M14). L'équipe dont le front direct porte en base
  // cette figure ou son protecteur (f−6) est désignée pour marquer en deuxième mi-temps : 14 équipes désignées sur 19 l'ont fait, contre 12 sur 39 non désignées.
  function secondeMiTemps(L) { var T = L.theme, f = [4, 5, 13, 15].map(function (h) { return T.bases[h]; }).reduce(K.additionner), pro = mod(f - 6),
      marqueurs = ['R1', 'R7'].filter(function (p) { var z = (L[p].figure - 1) % 4; return [0, 1, 2, 3].some(function (i) { var h = z + 4 * i + 1; return T.bases[h] === f || T.bases[h] === pro; }); });
    return { figure: f, protecteur: pro, marqueurs: marqueurs, obs: { designees: { oui: 14, sur: 19 }, autres: { oui: 14, sur: 41 } } }; }
  // COMBINAISONS DE MAISONS (exact) : la somme des bases d'un ensemble de maisons est une fonction linéaire (XOR) des 16 bits du thème. Les 16 maisons n'ont que 8 maisons
  // indépendantes (M1 à M8) : il n'existe que 256 fonctions de somme distinctes (255 non nulles), chacune égale à une somme de maisons parmi M1..M8. equivalences(maisons) donne
  // la forme sur M1..M8, la plus courte écriture et le nombre de combinaisons qui lui sont équivalentes (256).
  var CAT = null;
  function catalogue() { if (CAT) return CAT;
    var vec = {}, h, l, b, m, v = function (f) { return K.niveaux(f).reduce(function (x, n, i) { return x | ((n === 1 ? 1 : 0) << i); }, 0); },
      fig = function (x) { return K.FIGURES.map(function (f, i) { return i + 1; }).filter(function (i) { return K.niveaux(i).every(function (n, k) { return n === (((x >> k) & 1) ? 1 : 2); }); })[0]; };
    for (h = 1; h <= 16; h++) vec[h] = [0, 0, 0, 0];
    for (b = 0; b < 16; b++) { var meres = [0, 1, 2, 3].map(function (mm) { return fig(mm === (b >> 2) ? (1 << (b & 3)) : 0); }), T = K.construire(meres);
      for (h = 1; h <= 16; h++) { var x = v(T.bases[h]); for (l = 0; l < 4; l++) if ((x >> l) & 1) vec[h][l] |= (1 << b); } }
    var cle = function (hs) { var r = [0, 0, 0, 0]; hs.forEach(function (q) { for (var k = 0; k < 4; k++) r[k] ^= vec[q][k]; }); return r.join(','); }, classes = {}, forme = {};
    for (m = 0; m < 65536; m++) { var hs = []; for (h = 1; h <= 16; h++) if ((m >> (h - 1)) & 1) hs.push(h);
      var k = cle(hs), c = classes[k], mieux = !c || hs.length < c.length; if (c && hs.length === c.length) for (var z = 0; z < hs.length; z++) if (hs[z] !== c[z]) { mieux = hs[z] < c[z]; break; } if (mieux) classes[k] = hs; if (m < 256) forme[k] = hs; }
    CAT = { cle: cle, classes: classes, forme: forme, nb: Object.keys(classes).length }; return CAT; }
  function equivalences(maisons) { var C = catalogue(), k = C.cle(maisons); return { minimale: C.classes[k], forme: C.forme[k], equivalentes: 256, fonctions: C.nb }; }
  // COORDONNÉES (piste H-COORD-VICTOIRE, en observation) : l'état du nœud (plein 2, mixte 1, vide 0) de la coordination base(M1)+base(M7), puis de la résultante de M9,
  // dans le front de chaque pôle. Le pôle dont ces nœuds sont les plus pleins l'emporte (somme des signes des deux écarts, nulle = pas d'appel).
  function coordonnees(L) { var T = L.theme, N = noeuds(L), val = { plein: 2, mixte: 1, vide: 0 }, c1 = K.additionner(T.bases[1], T.bases[7]), c2 = T.resultantes[9], c3 = K.additionner(T.bases[2], T.bases[8]);
    function etat(front, c) { var f = N.fronts.filter(function (x) { return x.front === front; })[0], n = f && f.noeuds.filter(function (x) { return x.maison === c; })[0]; return n ? val[n.etat] : 0; }
    // axe M2+M8 ajouté le 2026-11-21 (criblage des six axes opposés : M1+M7 et M2+M8 sont les seuls à départager mieux que « toujours R1 »)
    var a1 = etat(L.R1.front, c1), b1 = etat(L.R7.front, c1), a2 = etat(L.R1.front, c2), b2 = etat(L.R7.front, c2), a3 = etat(L.R1.front, c3), b3 = etat(L.R7.front, c3), s = Math.sign(a1 - b1) + Math.sign(a2 - b2) + Math.sign(a3 - b3);
    return { coordination: c1, residuM9: c2, axe28: c3, R1: { m1m7: a1, m9: a2, m2m8: a3 }, R7: { m1m7: b1, m9: b2, m2m8: b3 }, ecart: s, gagnant: s > 0 ? 'R1' : s < 0 ? 'R7' : null }; }
  // NŒUDS DIAGONAUX (2026-11-22, H-DIAGONALES-TERRE) : dans le front de la figure du pôle, ses deux nœuds diagonaux, un sur 4-7-10-13 et un sur 1-6-11-16
  // (A : M13 et M1, B : M10 et M6, C : M7 et M11, D : M4 et M16). On compte ceux dont la résultante a la Terre saturée (0 à 2). Ils remplacent dans le verdict
  // la balance de la Terre sur les 4 maisons du front : les deux autres maisons n'apportaient que du bruit (79 matchs : 31 justes, 7 faux contre 30, 13).
  function diagonales(L) { var T = L.theme, rz = function (h) { return h < 16 ? T.resultantes[h] : T.bases[16]; };
    function un(c) { var z = (c.figure - 1) % 4, hs = [[4, 7, 10, 13], [1, 6, 11, 16]].map(function (d) { return d.filter(function (h) { return (h - 1) % 4 === z; })[0]; });
      return { maisons: hs, saturees: hs.filter(function (h) { return K.niveaux(rz(h))[3] === 2; }) }; }
    var a = un(L.R1), b = un(L.R7); return { R1: a, R7: b, ecart: a.saturees.length - b.saturees.length }; }
  // VERDICT DE VICTOIRE (2026-11-22) : Terre des nœuds diagonaux du front de chaque pôle, lue avec les nœuds de coordination, puis H-REPOS.
  // Catégories (lecture) : 1) Terre et coordonnées désignent le même pôle ; 2) H-REPOS ; 3) Terre seule ; 4) coordonnées seules. Depuis le 24/11, seule la catégorie 1 (et M1-M10) appelle la victoire ; 2 à 4 sont des indices.
  // 5) Terre et coordonnées opposées : pas d'appel ; 6) rien : pas d'appel. Résultats observés dans VERDICT_STATS (justes, faux, appels).
  var VERDICT_STATS = { accord: { ok: 15, ko: 1, n: 20 }, repos: { ok: 7, ko: 3, n: 13 }, terre: { ok: 7, ko: 3, n: 11 }, coord: { ok: 6, ko: 2, n: 8 }, oppose: { n: 11 }, rien: { n: 17 } };
  function categorieVerdict(L) { var Q = marquage(L), C = coordonnees(L), R = repos(L), G = diagonales(L), t = Math.sign(G.ecart), c = Math.sign(C.ecart), rp = R.gagnant === 'R1' ? 1 : R.gagnant === 'R7' ? -1 : 0;
    if (t && t === c) return { cat: 'accord', v: t, Q: Q, C: C, G: G };
    if (rp) return { cat: 'repos', v: rp, Q: Q, C: C, G: G };
    if (t && !c) return { cat: 'terre', v: t, Q: Q, C: C, G: G };
    if (c && !t) return { cat: 'coord', v: c, Q: Q, C: C, G: G };
    if (t && c) return { cat: 'oppose', v: 0, Q: Q, C: C, G: G };
    return { cat: 'rien', v: 0, Q: Q, C: C, G: G }; }
  // RELAIS M1–M10 (2026-11-22, H-M1-M10, intégré à la demande du propriétaire, en observation) : M1 (Puer) et M10 (Carcer) sont les seuls nœuds diagonaux
  // dont la maison inverse la Terre ; la résultante de M1 + Puer donne la maison de R1 (exact). Quand le verdict n'a pas d'appel et que les deux liaisons Terre
  // M1–M5 et M10–M14 (parité : 2+2 et 1+1 liées, 1+2 arrêt) sont en arrêt, R1 prend l'avantage. Il ne s'ajoute jamais à un appel existant.
  var M1M10_STATS = { ok: 9, ko: 3, n: 15 };
  function m1m10(L) { var T = L.theme, lien = function (x, y) { return K.niveaux(K.additionner(T.resultantes[x], T.resultantes[y]))[3] === 2; }, a = lien(1, 5), b = lien(10, 14);
    return { m1m5: a, m10m14: b, deuxArrets: !a && !b, stats: M1M10_STATS }; }
  // NOYAU TERRE (règle du propriétaire, Koun-35, 2026-11-25 ; affichage seulement, ne décide pas) : noyau Albus, Tristitia, Fortuna Major, Populus ; mobile Amissio, Carcer, Puella.
  function noyauTerre(L) {
    var NOYAU={4:1,8:1,12:1,16:1}, MOBILE={6:1,10:1,14:1};
    if(!L||!L.theme) return {phase:'inconnu',detail:'pas de thème',scoreN:0,scoreM:0,r1:null,r7:null,trajR1:[],trajR7:[]};
    var b=L.theme.bases||[], figs=[], count={}, scoreN=0, scoreM=0, h, n;
    // toute figure chez elle (posée dans sa propre maison) est saturée : sa résultante est Populus ; elle compte donc comme Populus (correction du propriétaire, 2026-11-25)
    for(h=1;h<=16;h++) if(b[h]) figs.push(b[h]===h?16:b[h]);
    for(h=1;h<=16;h++){ try{n=L.resu(h); if(n) figs.push(n);}catch(e){} }
    figs.forEach(function(n){ if(NOYAU[n]){scoreN++; count[n]=(count[n]||0)+1;} if(MOBILE[n]){scoreM++; count[n]=(count[n]||0)+1;} });
    var phase, detail, best=0, bestN=0;
    var CHEZ={4:'Albus en M4',8:'Tristitia en M8',12:'Fortuna Major en M12',16:'Populus en M16'}, chez=[4,8,12,16].filter(function(x){return b[x]===x;});
    if(chez.length){ phase='équilibre concrétisé'; detail=chez.map(function(x){return CHEZ[x];}).join(', ')+' : figure du noyau chez elle, saturée (résultante Populus)'; }
    else if(scoreM>scoreN){ phase='mobile'; detail='dominance Amissio / Carcer / Puella'; }
    else if(scoreN>0){
      [4,8,12,16].forEach(function(n){ if((count[n]||0)>best){best=count[n]; bestN=n;} });
      if(bestN===8){ phase='équilibre en suspens'; detail='Tristitia dominante (Terre ouverte)'; }
      else if(bestN===16){ phase='équilibre concrétisé'; detail='Populus dominant'; }
      else if(bestN===4){ phase='équilibre stable'; detail='Albus dominant'; }
      else if(bestN===12){ phase='équilibre stable'; detail='Fortuna Major dominante'; }
      else { phase='équilibre'; detail='noyau Terre atteint'; }
    } else { phase='neutre'; detail='ni mobile ni noyau Terre'; }
    function orbit(start){ var o=[], x=start; for(var i=0;i<8;i++){ o.push(x); x=((x-1+6)%16)+1; } return o; }
    function place(fig){ if(!fig) return {fig:null, zone:'—'}; if(NOYAU[fig]) return {fig:fig, zone:'noyau Terre'}; if(MOBILE[fig]) return {fig:fig, zone:'mobile'}; return {fig:fig, zone:'hors cycle'}; }
    var r1f=L.R1&&L.R1.figure, r7f=L.R7&&L.R7.figure;
    return {phase:phase, detail:detail, scoreN:scoreN, scoreM:scoreM, counts:count, r1:place(r1f), r7:place(r7f), trajR1:r1f?orbit(r1f):[], trajR7:r7f?orbit(r7f):[]};
  }
  // VICTOIRE PAR CONVERGENCE (piste 1, 2026-11-25) : chaque signe désigne R1 (+1), R7 (−1) ou personne ; le score est leur somme.
  // Signes : Terre des nœuds diagonaux, nœuds de coordination, M1-M10 (→ R1), figure du pôle chez elle, front du binôme posé, protecteur posé,
  // fronts différents où la figure du pôle est posée. 106 matchs : score ≥ +2 → R1 gagne 28 fois sur 34 ; ≤ −2 → R7 gagne 12 fois sur 17.
  function victoireConvergence(L) { var b = L.theme.bases, F = [], h, pose = function (g) { for (var x = 1; x <= 16; x++) if (b[x] === g) return true; return false; },
      fr = function (f) { var z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; }, sg = function (a, c) { return a > c ? 1 : a < c ? -1 : 0; }, a1 = L.R1.figure, a7 = L.R7.figure, sig = [];
    var fronts = function (f) { var s = {}; for (var x = 1; x <= 16; x++) if (b[x] === f) s[(x - 1) % 4] = 1; return Object.keys(s).length; };
    var fb = function (f) { return fr(K.binome(f)).filter(pose).length; };
    sig.push({ n: 'Terre des nœuds diagonaux', v: sg(diagonales(L).ecart, 0) });
    sig.push({ n: 'nœuds de coordination', v: sg(coordonnees(L).ecart, 0) });
    sig.push({ n: 'M1-M10 (deux arrêts)', v: m1m10(L).deuxArrets ? 1 : 0 });
    sig.push({ n: 'figure du pôle chez elle', v: sg(b[a1] === a1 ? 1 : 0, b[a7] === a7 ? 1 : 0) });
    sig.push({ n: 'front du binôme posé', v: sg(fb(a1), fb(a7)) });
    sig.push({ n: 'protecteur posé', v: sg(pose(mod(a1 - 6)) ? 1 : 0, pose(mod(a7 - 6)) ? 1 : 0) });
    sig.push({ n: 'fronts de la figure du pôle', v: sg(fronts(a1), fronts(a7)) });
    var s = sig.reduce(function (t, x) { return t + x.v; }, 0), act = sig.filter(function (x) { return x.v; });
    return { score: s, signes: sig, texte: 'score de victoire ' + (s > 0 ? '+' : '') + s + (act.length ? ' (' + act.map(function (x) { return x.n + ' ' + (x.v > 0 ? 'R1' : 'R7'); }).join(', ') + ')' : '') + ' ; ' + (Math.abs(s) >= 2 ? (s > 0 ? 'R1 a gagné 28 fois sur 34 à +2 ou plus' : 'R7 a gagné 12 fois sur 17 à −2 ou moins') : 'signes faibles') + ' (106 matchs, en observation)' }; }
  // CANAUX TERRE ET MARQUAGE (règle du propriétaire, 2026-11-26 ; outils/marquage_canaux_terre.js) : les maisons du canal Terre vertical (M13, M14, M15)
  // et horizontal (M4, M8, M12) marquent quand un niveau à 1 point de la base y devient 2 points dans la résultante (point rouge), même si la Terre de la
  // résultante n'est pas saturée. Au moins une telle maison (rouge, Terre de la résultante ouverte) → les deux équipes marquent.
  // 117 matchs : oui → les deux marquent 56 fois sur 86 ; non → 10 fois sur 31. À l'aveugle (37) : 26 justes, contre 18 pour la lecture du témoin M5 + M7 qu'elle remplace.
  var CANAUX_OBS = { oui: { oui: 56, sur: 86 }, non: { oui: 10, sur: 31 } };
  function canauxTerre(L) { var b = L.theme.bases, imp = function (f) { return K.niveaux(f).map(function (v) { return v === 1 ? 1 : 0; }); };
    var m = [13, 14, 15, 4, 8, 12].filter(function (h) { var rb = imp(b[h]), rh = imp(h); return [0, 1, 2, 3].some(function (l) { return rb[l] && rh[l]; }) && K.niveaux(L.theme.resultantes[h])[3] !== 2; });
    return { maisons: m, deuxMarquent: m.length > 0, obs: m.length ? CANAUX_OBS.oui : CANAUX_OBS.non }; }
  // MARQUAGE D'UN PÔLE (règle du propriétaire, 2026-11-26 ; remplace dans la page la lecture par parité et niveau, 37/74 à l'aveugle) :
  // les figures marquantes d'un pôle sont lui-même et son front direct (f + 4 : Puer → Via, Aquisitio → Caput), quand elles sont posées dans une maison
  // des canaux Terre (M4, M8, M12, M13, M14, M15) où elles sont saturées — par un point 1 de la base devenu 2, ou d'elles-mêmes si c'est Populus (saturation
  // totale ; correction du 2026-11-26 : Juventus–Venezia, R1 Populus en M8) — avec la Terre de la résultante ouverte. Sans figure marquante, il ne marque pas.
  // Troisième voie (2026-11-27) : le pôle ou son front direct logé en M11 (Eau × Eau) plein.
  // Observé (126 matchs, mesure du 2026-11-27 après le blocage figure par figure) : dans MARQUE_POLE_OBS (outils/mesure_marquage.js).
  var MARQUE_POLE_OBS = { assure: { oui: 17, sur: 25 }, marque: { oui: 115, sur: 147 }, possible: { oui: 13, sur: 16 }, non: { oui: 49, sur: 64 } }; // outils/mesure_marquage.js, 126 matchs
  // PUISSANCE DE MARQUAGE (2026-11-27, règles du propriétaire). Bonne position d'une figure (le pôle, son front direct f + 4, son miroir f + 8) :
  //   dans un canal Terre (M4, M8, M12, M13, M14, M15 : la boucle Terre de chaque front y passe) : la figure réagit — au moins un 1 de la figure rencontre
  //   un 1 de la maison (1 + 1 = 2), sur n'importe lequel de ses 4 niveaux ; la Terre de la résultante n'est pas exigée ;
  //   Populus en base d'un canal Terre (2 + 2 neutre, aucune réaction) : seulement si la Terre de la résultante est saturée (M4 → Albus, M13 → Cauda) ;
  //   le pôle dans sa propre maison : Terre de la résultante saturée, sauf s'il y est chez lui (résultante Populus, neutre comme M16).
  //   marque avec assurance : le pôle ET son front direct en bonne position ; marque : l'un des deux, ou l'un des deux en M11 plein (Eau saturée) ;
  //   marque possible : seul le miroir ; ne marque pas : aucun des trois.
  // BLOCAGE DANS LA CHAÎNE (2026-11-27, chaîne du propriétaire : « M1 attaque avec M5 et M2 attaque M5 ») : le pôle est celui qui attaque, son front direct (f + 4) est son
  //   moyen, et chacun a son attaquant (le pôle f − 3, le front direct f + 1, le miroir f + 5 ; voir bloqueurs). Pôle bloqué : il n'attaque plus, même avec son front direct,
  //   il ne marque pas. Front direct bloqué : le pôle marque encore par lui-même. Miroir bloqué : il ne compte plus. Paris – Marseille : Rubeus bloqué (Albus intact en M1,
  //   Albus reproduit par Populus en M4) → ne marque pas. 147 matchs : 79 bons verdicts contre 77 avant la chaîne (76 en lisant le blocage figure par figure).
  //   Depuis le 2026-11-28, chaque bloqueur n'agit que sur ses nœuds (zoneBlocage) : le pôle n'est paralysé que si sa propre maison en fait partie.
  //   Une figure posée chez elle ne peut pas y être bloquée (Populus en résultante laisse passer son énergie, voir bloqueurs).
  function marquePole(L, p) { var b = L.theme.bases, c = L[p], P = c.figure, F = mod(P + 4), Mi = mod(P + 8), imp = function (f) { return K.niveaux(f).map(function (v) { return v === 1 ? 1 : 0; }); };
    var bonnes = function (f) { return [4, 8, 12, 13, 14, 15].filter(function (h) { var rb = imp(b[h]), rh = imp(h); return b[h] === f && (f === 16 ? K.niveaux(L.theme.resultantes[h])[3] === 2 : [0, 1, 2, 3].some(function (l) { return rb[l] && rh[l]; })); }); };
    // le pôle dans sa propre maison, Terre de la résultante saturée (propriétaire, 2026-11-27 : Paris – Marseille, Populus en M4 → Albus)
    var rc = L.theme.resultantes[c.maison], chez = K.niveaux(rc)[3] === 2 && rc !== 16 ? [c.maison] : []; // chez lui (résultante Populus) : neutre, ne compte pas (Atlético – Viking)
    var BL = { pole: bloqueurs(L, P, c.maison), front: bloqueurs(L, F), miroir: bloqueurs(L, Mi) }, e11 = K.niveaux(L.theme.resultantes[11])[2] === 2;
    var bp0 = bonnes(P).concat(chez.filter(function (h) { return bonnes(P).indexOf(h) < 0; })), bf0 = bonnes(F), bm0 = bonnes(Mi);
    var niv = function (a, f, m, m11) { return a.length && f.length ? 'assure' : a.length || f.length || m11 ? 'marque' : m.length ? 'possible' : 'non'; };
    // chaque bloqueur n'agit que sur ses nœuds (zoneBlocage) ; pôle atteint dans sa propre maison : il n'attaque plus, même avec son front direct
    var ZP = zoneDe(L, BL.pole), ZF = zoneDe(L, BL.front), ZM = zoneDe(L, BL.miroir), hors = function (Z) { return function (h) { return Z.indexOf(h) < 0; }; };
    var libre = function (pos, fig, Z) { return pos.filter(function (h) { return h === fig || (Z.indexOf(h) < 0 && ZP.indexOf(h) < 0); }); }; // une position chez elle laisse passer l'énergie
    var tout = ZP.indexOf(c.maison) >= 0, bp = tout ? [] : bp0.filter(hors(ZP)), bf = tout ? [] : libre(bf0, F, ZF), bm = tout ? [] : libre(bm0, Mi, ZM),
      m11 = !tout && ZP.indexOf(11) < 0 && (b[11] === P || (b[11] === F && (ZF.indexOf(11) < 0 || F === 11))) && e11;
    var niveau0 = niv(bp0, bf0, bm0, (b[11] === P || b[11] === F) && e11), niveau = niv(bp, bf, bm, m11);
    // bloque : ce que le blocage a retiré quand il a fait baisser le niveau (sinon null) ; pôle bloqué = tout le pôle
    var p11 = (b[11] === P || b[11] === F) && e11 ? [11] : [], par = function (bl, pos) { return bl.filter(function (x) { return zoneBlocage(L, x.maison).some(function (n) { return pos.indexOf(n) >= 0; }); }); };
    var perdus = niveau === niveau0 ? [] : tout ? [{ role: 'pôle', figure: P, par: par(BL.pole, [c.maison]), positions: bp0.concat(bf0, p11, bm0), tout: true }]
      : [['pôle', P, BL.pole, bp0.filter(function (h) { return bp.indexOf(h) < 0; })], ['front direct', F, BL.front.concat(BL.pole), bf0.filter(function (h) { return bf.indexOf(h) < 0; }).concat(b[11] === F && e11 && !m11 ? [11] : [])],
        ['miroir', Mi, BL.miroir.concat(BL.pole), bm0.filter(function (h) { return bm.indexOf(h) < 0; })]].filter(function (x) { return x[3].length; })
        .map(function (x) { return { role: x[0], figure: x[1], par: par(x[2], x[3]), positions: x[3] }; }).filter(function (x) { return x.par.length; });
    var maisons = bp.concat(bf, m11 ? [11] : [], niveau === 'possible' ? bm : []).filter(function (h, i, t) { return t.indexOf(h) === i; }).sort(function (x, y) { return x - y; });
    return { marque: niveau !== 'non', niveau: niveau, niveauSansBlocage: niveau0, bloque: perdus.length ? perdus : null, bloqueurs: BL, zones: { pole: ZP, front: ZF, miroir: ZM }, maisons: maisons, positions: { pole: bp, front: bf, miroir: bm, m11: m11 }, avantage: bp.length + bf.length, figures: [P, F, Mi], obs: MARQUE_POLE_OBS[niveau] }; }
  // ESTIMATION DES BUTS (2026-11-27, à la demande du propriétaire) : arrêts × nœud double M11 (Eau × Eau). M11 est plein quand la résultante de M11 a l'Eau
  // saturée (⇔ Eau active en base de M11). 126 matchs (arrêts sur les 16 maisons depuis le 2026-11-27) : arrêt et M11 plein 4,28 buts (43 matchs) ; arrêt, M11 vide 3,39 (36) ;
  // sans arrêt, M11 plein 3,07 (28) ; ni l'un ni l'autre 2,21 (19). Erreur moyenne, chaque match jugé sans lui-même : 1,514 (1,526 avec les arrêts M1–M15).
  var BUTS_OBS = { AE: { sur: 43, buts: 184, plus25: 35, plus35: 28 }, A: { sur: 36, buts: 122, plus25: 22, plus35: 19 }, E: { sur: 28, buts: 86, plus25: 14, plus35: 9 }, rien: { sur: 19, buts: 42, plus25: 7, plus35: 3 } };
  // POPULUS ET FIGURES CHEZ ELLES (propriétaire, 2026-11-27) : avec Populus en base, les figures posées dans leur maison de repos (M1–M15) font monter les buts ;
  // sans Populus, ils sont déjà nombreux. Écart moyen à la valeur arrêts × M11 sur 126 matchs : avec Populus et 0 chez elle −0,32 (26 matchs), 1 −0,14 (30),
  // 2 et plus +0,65 (13) ; sans Populus +0,07 (57). Erreur moyenne, chaque match jugé sans lui-même : 1,528 (arrêts × M11 seuls : 1,514).
  var POP_CHEZ_OBS = { P0: { ecart: -0.32, sur: 26 }, P1: { ecart: -0.14, sur: 30 }, P2: { ecart: 0.65, sur: 13 }, S: { ecart: 0.07, sur: 57 } };
  function butsEstimes(L) { var A = arrets(L), e = K.niveaux(L.theme.resultantes[11])[2] === 2, k = A.nombre ? (e ? 'AE' : 'A') : (e ? 'E' : 'rien'), o = BUTS_OBS[k];
    var b = L.theme.bases, chez = []; for (var h = 1; h <= 15; h++) if (b[h] === h) chez.push(h); var pop = b.slice(1).indexOf(16) >= 0, kp = pop ? 'P' + Math.min(chez.length, 2) : 'S', pc = POP_CHEZ_OBS[kp];
    return { arrets: A, m11Plein: e, cas: k, populus: pop, chezElles: chez, casPopulus: kp, ecartPopulus: pc.ecart, base: Math.round(10 * o.buts / o.sur) / 10, attendus: Math.max(0, Math.round(10 * (o.buts / o.sur + pc.ecart)) / 10), plus25: o.plus25 / o.sur, plus35: o.plus35 / o.sur, obs: o }; }
  // HIÉRARCHIE DU VERDICT (2026-11-27, à la demande du propriétaire ; remplace le score prévu). Chaque partie applique SES conditions et ne cède que si
  // elle contredit une partie plus haute :
  //   1. Vainqueur (décision du moteur) → le vainqueur marque.
  //   2. Deux marquent (R1 et R7 marquent tous deux selon la règle de marquage ; M11 plein ne suffit plus, 2026-11-27) → si oui, chaque pôle marque ; si non : le perdant ne marque pas.
  //   3. R1 / R7 marque (règle des figures marquantes) → seulement là où 1 et 2 laissent le choix.
  //   4. Volume de buts (arrêts × M11) → au moins autant de buts que d'équipes qui marquent ; 0 si aucune ne marque.
  //   5. Mi-temps (1-5-12-15, H-MT) → ne désigne que des équipes qui marquent.  Les incidents ne peuvent contredire aucune partie.
  function hierarchie(L) { var V = verdict(L), d = V.decision.resultat, P1 = marquePole(L, 'R1'), P7 = marquePole(L, 'R7'), B = butsEstimes(L), e = B.m11Plein;
    var m = { R1: { marque: P1.marque, propre: P1, impose: null }, R7: { marque: P7.marque, propre: P7, impose: null } };
    // boucles différentes : le vainqueur désigné marque (imposé) — il a marqué 14 fois sur 17 quand la règle de marquage disait le contraire (126 matchs, 2026-11-28) ; le perdant garde sa règle.
    if (V.boucles && V.boucles.domaine && (d === '1' || d === '2')) { var wq = d === '1' ? 'R1' : 'R7'; if (!m[wq].marque) { m[wq].marque = true; m[wq].impose = 'imposé par la victoire (boucles différentes)'; } }
    // AUCUN PÔLE NE MARQUE ET UNE VICTOIRE EST ANNONCÉE (2026-11-27) : la partie 1 commande, le vainqueur marque (imposé) — sans cela le verdict se contredit
    // (une victoire sans but). 147 matchs : 1 cas depuis le blocage par les nœuds (2026-11-28), le vainqueur annoncé a marqué et gagné (5 cas, 5 et 4, avant).
    else if ((d === '1' || d === '2') && !m.R1.marque && !m.R7.marque) { var wq2 = d === '1' ? 'R1' : 'R7'; m[wq2].marque = true; m[wq2].impose = 'imposé par la victoire (aucun pôle ne marque selon la règle)'; }
    var deuxPropre = m.R1.marque && m.R7.marque, imp = m.R1.impose || m.R7.impose, deux = { oui: deuxPropre, raison: deuxPropre ? 'R1 et R7 marquent' + (imp ? ' (le vainqueur par imposition de la victoire)' : ' chacun selon la règle de marquage') : (m.R1.marque ? 'R7' : m.R7.marque ? 'R1' : 'ni R1 ni R7') + ' ne marque pas selon la règle de marquage', impose: false };
    // R1 / R7 marque = la règle de marquage, sur tous les thèmes ; deux exceptions : le vainqueur des boucles différentes marque, et le vainqueur annoncé quand aucun pôle ne marque (imposés, ci-dessus).
    var n = (m.R1.marque ? 1 : 0) + (m.R7.marque ? 1 : 0), v = B.attendus, aj = null;
    if (d === 'N' && n === 0) { v = 0; aj = 'égalité sans pôle qui marque : 0-0'; } // cohérence : une égalité où personne ne marque ne peut être que 0-0
    else if (v < n) { v = n; aj = n + ' équipes marquent'; }
    // mi-temps : ne désignent que les pôles qui marquent ; pas de but en 1re mi-temps si aucun pôle ne marque (calculé ici, la page ne fait qu'afficher).
    var Y = rythme(L), S = secondeMiTemps(L), mq = function (p) { return m[p].marque; };
    Y.marqueurs = Y.marqueurs.filter(mq); if (!n) Y.butAttendu = false; S.marqueurs = S.marqueurs.filter(mq);
    return { decision: d, deux: deux, R1: m.R1, R7: m.R7, buts: { valeur: v, propre: B.attendus, ajuste: aj, detail: B }, mt1: Y, mt2: S }; }
  function verdict(L) { var V = verdictBrut(L), Z = m1m10(L), NT = noyauTerre(L); V.noyauTerre = NT; V.m1m10 = Z;
    if (V.v === null && Z.deuxArrets) { var sz = M1M10_STATS; V.v = '1'; V.force = 'avantage'; V.regle = 'H-M1-M10'; V.statut = sz.ok + ' justes, ' + sz.ko + ' faux sur ' + (sz.ok + sz.ko) + ' appels tranchés'; V.raison = 'liaisons Terre M1–M5 et M10–M14 en arrêt : avantage R1'; }
    // DÉCISION FINALE (toujours une victoire ; tout ce qui concernait le nul a été supprimé du système le 2026-11-27, à la demande du propriétaire) :
    // la victoire appelée (accord Terre + coordination, ou M1-M10) ; sinon victoire de R1 (domicile). Le score de convergence de victoire reste un indice.
    var VC = victoireConvergence(L); V.victoireConvergence = VC;
    V.decision = V.v ? { resultat: V.v, raison: (V.regle || '') + ' : ' + V.raison + ' · indice : ' + VC.texte } : { resultat: '1', raison: 'aucun vainqueur appelé : avantage du domicile (R1) · indice : ' + VC.texte };
    // BOUCLES DIFFÉRENTES (règle du propriétaire, 2026-11-27, en cours d'étude) : R1 et R7 dans des boucles différentes (A/C contre B/D) = le front de l'un
    // attaque l'autre. L'arme de l'attaquant (antagoniste de l'attaqué) est dans son front ; la défense de l'attaqué (antagoniste de l'attaquant) est dans la
    // boucle de son binôme (front de son protecteur). Défense posée dans les Filles (M5–M8) → l'attaqué gagne ; sinon, arme ou défense posée → l'attaquant ;
    // ni arme ni défense posée → R7. Elle commande la victoire dans son domaine (prioritaire sur le marquage qui commande : 8 justes contre 4 sur 18 conflits).
    var BD = boucles(L), Q1 = marquePole(L, 'R1').marque, Q7 = marquePole(L, 'R7').marque; V.boucles = BD;
    if (BD.domaine) { var Nm = K.nom, mh = function (l) { return 'M' + l.join(', M'); }, FRL = 'ABCD', o = BD.obs;
      var txt = BD.cas === 'filles' ? 'la défense de ' + BD.attaque + ' (' + Nm(BD.defense) + ', antagoniste de ' + BD.attaquant + ', boucle de son binôme) est posée dans les Filles (' + mh(BD.maisonsDefense.filter(function (h) { return h >= 5 && h <= 8; })) + ')'
        : BD.cas === 'arme' ? 'l\'arme de ' + BD.attaquant + ' (' + Nm(BD.arme) + ', antagoniste de ' + BD.attaque + ') est posée (' + mh(BD.maisonsArme) + '), sans défense'
        : BD.cas === 'deux' ? 'arme (' + Nm(BD.arme) + ' en ' + mh(BD.maisonsArme) + ') et défense (' + Nm(BD.defense) + ' en ' + mh(BD.maisonsDefense) + ') posées, défense hors des Filles'
        : BD.cas === 'defense' ? 'défense (' + Nm(BD.defense) + ' en ' + mh(BD.maisonsDefense) + ') posée hors des Filles, sans arme' : 'ni arme ni défense posée';
      V.decision = { resultat: BD.gagnant === 'R1' ? '1' : '2', raison: 'boucles différentes : ' + BD.attaquant + ' (' + Nm(L[BD.attaquant].figure) + ', front ' + FRL[(L[BD.attaquant].figure - 1) % 4] + ') attaque ' + BD.attaque + ' (' + Nm(L[BD.attaque].figure) + ', front ' + FRL[(L[BD.attaque].figure - 1) % 4] + ') — ' + txt + ' → victoire de ' + BD.gagnant + ' (' + o.juste + ' justes, ' + o.nul + ' nuls, ' + o.faux + ' faux sur 87 matchs dans ce cas ; en cours d\'étude) · indice : ' + VC.texte }; }
    // Même boucle — le marquage commande (2026-11-27, propriétaire) : quand un seul pôle marque selon la règle de marquage, c'est lui qui gagne.
    else if (Q1 !== Q7) { var w = Q1 ? '1' : '2'; V.decision = { resultat: w, raison: 'seul ' + (Q1 ? 'R1' : 'R7') + ' marque selon la règle de marquage' + (w !== (V.v || '1') ? ' (l\'appel « ' + (V.regle || 'avantage du domicile') + ' » désignait ' + ((V.v || '1') === '1' ? 'R1' : 'R7') + ')' : '') + ' · indice : ' + VC.texte }; }
    else if (!Q1 && !Q7) {
      // LES DEUX PÔLES BLOQUÉS (2026-11-27, en cours d'étude ; suite du blocage unique) : hors boucles différentes le marquage commande ; quand aucun pôle ne marque
      // et que les deux figures des pôles sont bloquées, aucun ne prend le dessus : égalité (thème de repos Populus : les deux pôles bloqués par Cauda reproduite en M13).
      // 147 matchs : 1 cas, 1 nul (Tijuana – Pumas 1-1) depuis le blocage par les nœuds (3 cas, 2 nuls, avant).
      var b1 = blocages(L, 'R1'), b7 = blocages(L, 'R7');
      if (b1.length && b7.length) V.decision = { resultat: 'N', type: 'bloques', raison: 'les deux pôles bloqués (R1 en M' + b1.join(', M') + ', R7 en M' + b7.join(', M') + ') et aucun ne marque : égalité (en cours d\'étude : 1 nul sur 1) · indice : ' + VC.texte };
      else V.decision.raison += ' · aucun pôle ne marque selon la règle de marquage'; }
    // ÉGALITÉ n-n (propriétaire, 2026-11-27 ; en cours d'étude, protocole des 15 essais) : les deux pôles au même niveau de marquage, aucun pôle bloqué, et
    // Populus en base dans la boucle de front d'un pôle → chaque équipe peut marquer le même nombre n de buts. 126 matchs : 11 cas, 5 nuls (45 % ; 21 % en tout ; mesure du 2026-11-28, blocage par les nœuds).
    var EG = egalite(L); V.egalite = EG;
    if (EG.oui) V.decision = { resultat: 'N', type: 'n-n', raison: 'égalité n-n (en cours d\'étude) : ' + EG.raison + ' · indice : ' + VC.texte };
    if (Math.abs(VC.score) >= 2 && arrets(L).nombre >= 1 && (VC.score > 0) === (V.decision.resultat === '1')) { V.decision.force = 'nette'; V.decision.raison = 'victoire nette (score de victoire ' + (VC.score > 0 ? '+' : '') + VC.score + ' et ' + arrets(L).nombre + ' arrêt' + (arrets(L).nombre > 1 ? 's' : '') + ') · ' + V.decision.raison; }
    return V; }
  // BLOCAGE — une seule définition pour tout le moteur (2026-11-27, chaîne du propriétaire : la figure k attaque k + 3, « M(h+1) attaque M(h+4) », sur les 16 maisons).
  // La figure g est bloquée par son antagoniste A = g − 3 quand A est présent intact :
  //   posé en base et gardant ses points actifs — chacun de ses 1 tombe sur un 2 de la maison, aucune réaction ne le consomme (en M16, filtre final, toujours) ;
  //   ou reproduit par Populus — Populus posé dans la maison A y donne la figure A intacte (thème de repos Populus : chaque maison rend sa figure).
  //   Exemples du propriétaire : Populus en M4 donne Albus, qui bloque Rubeus (Paris – Marseille) ; Populus en M16 bloque Caput.
  // POPULUS (propriétaire, 2026-11-27) : « Populus en résultante laisse passer l'énergie de la figure où résulte Populus, mais aussi Populus en base bloque
  //   l'adversaire de la maison où loge Populus ». Populus en base : la maison rend sa figure, qui bloque son adversaire (ci-dessus). Populus en résultante (la figure
  //   chez elle, thème de repos saturé) : là où elle est chez elle, l'énergie de la figure passe — on ne peut pas l'y bloquer, et elle ne bloque pas (ses 1 rencontrent
  //   ses propres 1). 147 matchs : pôles chez eux que leur antagoniste bloquait, 8 changent de marquage, 6 justes ; lu à l'inverse (la figure chez elle bloque), 10 changent, 2 justes.
  // Le blocage reste à la figure de base (propriétaire) : la figure de la maison ne bloque que reproduite par Populus.
  function bloqueurs(L, g, ici) { var A = mod(g - 3), b = L.theme.bases, r = [];
    if (ici === g) return r; // la figure g posée chez elle (maison ici = g) : résultante Populus, son énergie passe
    for (var h = 1; h <= 16; h++) {
      if (b[h] === A && A !== 16 && K.niveaux(A).every(function (v, l) { return v !== 1 || K.niveaux(h)[l] === 2; })) r.push({ maison: h, figure: A, type: h === 16 ? 'M16' : 'intact' });
      else if (b[h] === 16 && h === A) r.push({ maison: h, figure: A, type: 'populus' });
    }
    return r; }
  // NŒUDS DU BLOQUEUR (propriétaire, 2026-11-28) : « pour les attaques de front, celui qui bloque bloque pour ses nœuds, aux niveaux actifs en résultante ».
  //   Un bloqueur posé en maison h n'agit que sur les nœuds dont h porte une liaison dans la croix de son front (cela dépend de la maison occupée : haut, droite,
  //   bas ou gauche), aux niveaux à 1 point de la résultante de h. La Terre déviée (rangée M13–M15 du haut, colonne M4–M8–M12 de la gauche) n'est pas comptée,
  //   comme dans l'exemple du propriétaire : Puer en résultante de M1 (haut du front A) bloque Albus sur le Feu et l'Air, en M1, M2, M5 et M6.
  //   147 matchs : pôles en bonne position que ce blocage arrête, 7 sur 12 ont marqué, contre 145 sur 188 pour les autres (blocage partout : 43/58 contre 109/142).
  var PORTE = (function () { var P = {}; for (var h = 1; h <= 16; h++) { var pos = Math.floor((h - 1) / 4), o = [[], [], [], []];
      for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) { if (i === 3 && j === 3) continue; var hor, ver;
        if (i < 3 && j < 3) { hor = [j < 2 ? 3 : 1, i]; ver = [i < 2 ? 0 : 2, j]; } else if (j === 3) { hor = [1, i]; ver = [0, 3]; } else { hor = [2, j]; ver = [3, 3]; }
        var x = 4 * j + i + 1; if (hor[0] === pos) o[hor[1]].push(x); if (ver[0] === pos) o[ver[1]].push(x); }
      P[h] = o; } return P; })(); // P[h][niveau] = nœuds dont la maison h porte la liaison à ce niveau (0 haut, 1 droite, 2 bas, 3 gauche ; même lecture que noeuds)
  function zoneBlocage(L, h) { var r = K.niveaux(L.resu(h)), z = []; for (var l = 0; l < 3; l++) if (r[l] === 1) z = z.concat(PORTE[h][l]); return z; }
  function zoneDe(L, bl) { var z = []; bl.forEach(function (x) { zoneBlocage(L, x.maison).forEach(function (n) { if (z.indexOf(n) < 0) z.push(n); }); }); return z.sort(function (a, c) { return a - c; }); }
  function blocages(L, p) { return bloqueurs(L, L[p].figure, L[p].maison).map(function (x) { return x.maison; }); }
  var EGALITE_OBS = { cas: 11, nuls: 5 };
  function egalite(L) { var b = L.theme.bases, P1 = marquePole(L, 'R1'), P7 = marquePole(L, 'R7'), B1 = blocages(L, 'R1'), B7 = blocages(L, 'R7');
    var boucle = function (f) { var z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13].filter(function (h) { return b[h] === 16; }); }, pb = { R1: boucle(L.R1.figure), R7: boucle(L.R7.figure) };
    var ident = P1.niveau === P7.niveau && !P1.bloque === !P7.bloque, libre = !B1.length && !B7.length, pop = pb.R1.length > 0 || pb.R7.length > 0, oui = ident && libre && pop;
    return { oui: oui, identiques: ident, blocages: { R1: B1, R7: B7 }, populusBoucle: pb, obs: EGALITE_OBS,
      raison: 'pôles au même niveau de marquage (' + P1.niveau + ')' + (libre ? ', aucun pôle bloqué' : ', pôle bloqué par son antagoniste en M' + B1.concat(B7).join(', M')) + (pop ? ', Populus dans la boucle de ' + (pb.R1.length ? 'R1 (M' + pb.R1.join(', M') + ')' : '') + (pb.R1.length && pb.R7.length ? ' et ' : '') + (pb.R7.length ? 'R7 (M' + pb.R7.join(', M') + ')' : '') : ', pas de Populus dans les boucles des pôles') }; }
  var BOUCLES_OBS = { filles: { juste: 12, nul: 3, faux: 3 }, arme: { juste: 15, nul: 5, faux: 9 }, deux: { juste: 9, nul: 8, faux: 5 }, defense: { juste: 4, nul: 2, faux: 0 }, personne: { juste: 7, nul: 4, faux: 1 } };
  function boucles(L) { var b = L.theme.bases, f1 = (L.R1.figure - 1) % 4, f7 = (L.R7.figure - 1) % 4, AT = { 0: 3, 1: 0, 3: 2, 2: 1 }, att = AT[f1] === f7 ? 'R1' : AT[f7] === f1 ? 'R7' : null;
    if (!att) return { domaine: false };
    var vic = att === 'R1' ? 'R7' : 'R1', pos = function (g) { var l = []; for (var h = 1; h <= 16; h++) if (b[h] === g) l.push(h); return l; };
    var arme = mod(L[vic].figure - 3), defense = mod(L[att].figure - 3), ha = pos(arme), hd = pos(defense), filles = hd.filter(function (h) { return h >= 5 && h <= 8; });
    var cas = filles.length ? 'filles' : !ha.length && !hd.length ? 'personne' : ha.length && hd.length ? 'deux' : ha.length ? 'arme' : 'defense';
    return { domaine: true, attaquant: att, attaque: vic, arme: arme, maisonsArme: ha, defense: defense, maisonsDefense: hd, cas: cas, gagnant: cas === 'filles' ? vic : cas === 'personne' ? 'R7' : att, obs: BOUCLES_OBS[cas] }; }
  function verdictBrut(L) {
    var K0 = categorieVerdict(L), S = VERDICT_STATS[K0.cat], Q = K0.Q, C = K0.C, cote = K0.v > 0 ? 'R1' : 'R7', v = K0.v ? (K0.v > 0 ? '1' : '2') : null,
      st = S.ok !== undefined ? S.ok + ' justes, ' + S.ko + ' faux sur ' + (S.ok + S.ko) + ' appels tranchés' : '',
      G = K0.G, terre = 'Terre des nœuds diagonaux : R1 ' + G.R1.saturees.length + '/2 (M' + G.R1.maisons.join(', M') + '), R7 ' + G.R7.saturees.length + '/2 (M' + G.R7.maisons.join(', M') + ')', noeuds = 'nœuds de coordination : écart ' + C.ecart;
    if (K0.cat === 'accord') return { v: v, force: 'confirmee', regle: 'H-DIAGONALES-TERRE et H-COORD-VICTOIRE', statut: st, raison: cote + ' : sa Terre et ses nœuds de coordination l\'emportent (' + terre + ' ; ' + noeuds + ')' };
    // Resserrement (2026-11-24, revue sur 106 matchs, à la demande du propriétaire) : seules l'accord Terre + coordination (18 justes, 1 faux ;
    // aveugle 3/0) et H-M1-M10 (dans verdict) appellent. H-REPOS (7/6, aveugle 0/3), la Terre seule (aveugle 5/4) et la coordination seule (8/4, au niveau
    // de « R1 gagne toujours ») ne décident plus : elles restent affichées comme indices.
    if (K0.cat === 'repos' || K0.cat === 'terre' || K0.cat === 'coord') return { v: null, force: null, regle: null, statut: null, indice: { cat: K0.cat, cote: cote, regle: K0.cat === 'repos' ? 'H-REPOS' : K0.cat === 'terre' ? 'H-DIAGONALES-TERRE' : 'H-COORD-VICTOIRE', statut: st }, raison: 'pas d\'appel : seul indice, ' + (K0.cat === 'repos' ? 'H-REPOS (' + cote + ' a ses deux fronts au repos)' : K0.cat === 'terre' ? 'la Terre des nœuds diagonaux (' + terre + ')' : 'les nœuds de coordination (' + noeuds + ')') + ' désigne ' + cote + ', sans l\'accord des deux forces ; à l\'aveugle cet indice seul ne fait pas mieux que le hasard' };
    if (K0.cat === 'oppose') return { v: null, force: null, regle: null, statut: null, raison: 'forces opposées : la Terre des nœuds diagonaux et les nœuds de coordination désignent des pôles différents (' + terre + ' ; ' + noeuds + ')' };
    return { v: null, force: null, regle: null, statut: null, raison: 'aucune force ne se dégage : Terre des nœuds diagonaux et nœuds de coordination à égalité, H-REPOS muet (' + terre + ')' };
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
  // CHAÎNE du protecteur : f (la figure du pôle), a = antagoniste (f−3) qui l'attaque, p = protecteur (f−6) qui attaque a. Filiations des trois figures prises deux à deux
  // (somme = XOR exact) : f+a et a+p tombent toujours sur le Circuit Souverain (figures 1-3-5-11-13) ; f+a+(a+p) = f+p. Lecture de structure, pas un verdict.
  function chaine(L) { var T = L.theme, A = K.additionner, chez = function (f) { return T.bases[f] === f || (f < 16 && T.resultantes[f] === f); };
    function un(c) { var f = c.figure, a = mod(f - 3), p = mod(f - 6), s1 = A(f, a), s2 = A(a, p), s3 = A(f, p), circuit = [1, 3, 5, 11, 13];
      return { figure: f, antagoniste: a, protecteur: p, protecteurChezLui: chez(p), antagonisteChezLui: chez(a),
        filiations: [{ de: [f, a], somme: s1, circuit: circuit.indexOf(s1) >= 0 }, { de: [a, p], somme: s2, circuit: circuit.indexOf(s2) >= 0 }, { de: [f, p], somme: s3, circuit: circuit.indexOf(s3) >= 0 }],
        protecteurEstSomme: s1 === p }; }
    return { R1: un(L.R1), R7: un(L.R7) }; }
  // MARQUAGE (signal découvert le 2026-11-20, à confirmer sur des matchs futurs ; ce n'est PAS une règle de verdict). Le front direct d'un pôle (les 4 maisons f, f+4, f+8, f+12) marque
  // par le niveau Terre : on compte, sur ces 4 maisons, celles dont la résultante (maison 16 : la base) a la Terre saturée. n va de 0 à 4. Observé sur 160 pôles-matchs :
  var NIVEAUX_MARQUAGE = { fort: { sur: 76, un: 61, deux: 41, moy: 2.14 }, 'freiné': { sur: 43, un: 31, deux: 18, moy: 1.65 }, faible: { sur: 23, un: 20, deux: 7, moy: 1.52 }, 'bloqué': { sur: 18, un: 13, deux: 4, moy: 1.06 } };
  function marquage(L) { var T = L.theme;
    function un(c) { var z = (c.figure - 1) % 4, hs = [0, 1, 2, 3].map(function (i) { return z + 4 * i + 1; }), n = 0;
      hs.forEach(function (h) { var r = h < 16 ? T.resultantes[h] : T.bases[16]; if (K.niveaux(r)[3] === 2) n++; });
      // CANAUX TERRE (règle sûre du propriétaire, 2026-11-21) : les deux liaisons Terre du front direct (haut → droite et bas → gauche) saturées dans les résultantes =
      // marquage presque inévitable (10 pôles sur 11 ont marqué ; seule exception Strasbourg–Brest 0-1, Strasbourg freiné, sans figure au repos).
      var t = function (h) { var r = h < 16 ? T.resultantes[h] : T.bases[16]; return K.niveaux(r)[3] === 2; }, ct = (t(z + 1) && t(z + 5) ? 1 : 0) + (t(z + 9) && t(z + 13) ? 1 : 0);
      return { front: K.front(z + 1), maisons: hs, n: n, canauxTerre: ct, marqueSur: ct === 2 }; }
    var a = un(L.R1), b = un(L.R7), RP = repos(L);
    // NIVEAU DE MARQUAGE d'une équipe (2026-11-21) : la Terre de son front direct (n) et son blocage (figures au repos sans antagoniste dans ses deux fronts, H-REPOS) lus ensemble.
    // Fréquences observées (160 pôles-matchs) : fort (n >= 2, au moins une figure au repos), freiné (n >= 2, aucune), faible (n <= 1, au moins une), bloqué (n <= 1, aucune).
    [[a, 'R1'], [b, 'R7']].forEach(function (x) { var q = x[0], r = RP[x[1]].total, k = q.n >= 2 ? (r ? 'fort' : 'freiné') : (r ? 'faible' : 'bloqué'), o = NIVEAUX_MARQUAGE[k];
      q.repos = r; q.niveau = k; q.p2n = o.deux / o.sur; q.p1n = o.un / o.sur; q.moyN = o.moy; q.obsN = o.sur; });
    // PARITÉ (paradigme du propriétaire, 2026-11-22, H-PARITE-EB, en observation) : on lit les points impairs (1) et pairs (2), somme = 1+2=1, 1+1=2, 2+2=2.
    // La figure f du pôle, posée dans sa maison, expulse son énergie dans les 15 autres nœuds : E = M16 + f (exact : la somme des 16 bases vaut M16).
    // Pour atteindre son binôme, elle traverse la boucle du front binôme : EB = E + somme des 4 maisons du front de binôme(f). EB à parité équilibrée
    // (exactement 2 niveaux impairs sur 4) : l'énergie passe, le pôle marque. Indépendant de la saturation (vrai dans chaque niveau fort, freiné, faible, bloqué).
    var PARITE_OBS = { equilibre: { oui: 52, sur: 55 }, autre: { oui: 73, sur: 105 } };
    [[a, L.R1], [b, L.R7]].forEach(function (x) { var q = x[0], f = x[1].figure, bf = K.binome(f), z = (bf - 1) % 4, E = K.additionner(T.bases[16], f),
      Fb = [0, 1, 2, 3].map(function (i) { return T.bases[z + 1 + 4 * i]; }).reduce(K.additionner), eb = K.additionner(E, Fb), imp = K.niveaux(eb).filter(function (v) { return v === 1; }).length;
      q.parite = { energie: E, boucleBinome: Fb, figure: eb, impairs: imp, equilibre: imp === 2, obs: imp === 2 ? PARITE_OBS.equilibre : PARITE_OBS.autre }; });
    // deux marquent : produit des deux probabilités (hypothèse d'indépendance : 75 % prédit en moyenne contre 73 % observé sur 37 matchs) ; buts attendus : somme des moyennes par n
    // TÉMOIN M5+M7 (signal post hoc, trouvé par criblage des 255 combinaisons distinctes) : quand la Terre de la figure base(M5)+base(M7) n'est pas saturée, les deux équipes ont marqué
    // dans 20 matchs sur 21 observés ; saturée, dans 9 sur 20.
    // second témoin M4+M10 (ajouté le 2026-11-21) : quand la Terre de M5+M7 est saturée, celle de M4+M10 départage (ouverte 5 sur 9, saturée 4 sur 11).
    var tf = K.additionner(T.bases[5], T.bases[7]), terre = K.niveaux(tf)[3] === 2, t2 = K.additionner(T.bases[4], T.bases[10]), terre2 = K.niveaux(t2)[3] === 2,
      // Binôme de la figure M5+M7 (2026-11-21, propriétaire) : placé chez lui (sa maison de repos) ou chez son antagoniste, il confirme l'état de la figure ;
      // Terre saturée et binôme placé : les deux n'ont jamais marqué (0 sur 5).
      bt = K.binome(tf), hbt = mod(bt - 3), btPlace = T.bases[bt] === bt || (bt < 16 && T.resultantes[bt] === bt) || T.bases[hbt] === bt || (hbt < 16 && T.resultantes[hbt] === bt),
      OBS_TEMOIN = { ouverte: { oui: 31, sur: 40 }, binomePlace: { oui: 2, sur: 12 }, m410ouverte: { oui: 7, sur: 13 }, m410saturee: { oui: 7, sur: 15 } };
    return { R1: a, R7: b, temoin: { figure: tf, terreSaturee: terre, figure2: t2, terre2Saturee: terre2, binome: bt, binomePlace: btPlace, deuxMarquent: !terre, obsPas: !terre ? OBS_TEMOIN.ouverte : btPlace ? OBS_TEMOIN.binomePlace : terre2 ? OBS_TEMOIN.m410saturee : OBS_TEMOIN.m410ouverte }, butsAttendus: butsEstimes(L).attendus, buts: butsEstimes(L), arrets: arrets(L) }; }
  // DÉFENSE (2026-11-22, demande du propriétaire : l'attaque ne sert à rien si la défense est mauvaise) : l'antagoniste du pôle (f−3) posé en base sans son protecteur
  // (f−6) = défense percée ; protecteur posé = défense tenue (attaque bloquée, ou protégée sans attaque) ; ni l'un ni l'autre = calme. Buts encaissés observés (DEFENSE_OBS).
  // Information sur les buts encaissés ; elle n'entre ni dans le verdict ni dans le calcul des buts (qui reste meilleur : 1,30 d'erreur contre 1,34).
  var DEFENSE_OBS = { 'percée': { sur: 47, encaisses: 99 }, 'attaque bloquée': { sur: 51, encaisses: 97 }, 'protégée': { sur: 45, encaisses: 67 }, calme: { sur: 17, encaisses: 25 } };
  function defense(L) { var b = L.theme.bases, pose = function (f) { var o = []; for (var h = 1; h <= 16; h++) if (b[h] === f) o.push(h); return o; };
    function un(c) { var a = mod(c.figure - 3), p = mod(c.figure - 6), A = pose(a), P = pose(p), etat = !A.length ? (P.length ? 'protégée' : 'calme') : (P.length ? 'attaque bloquée' : 'percée'), o = DEFENSE_OBS[etat];
      return { antagoniste: a, protecteur: p, maisonsAntagoniste: A, maisonsProtecteur: P, etat: etat, tenue: etat !== 'percée', encaisseMoyen: Math.round(10 * o.encaisses / o.sur) / 10, obs: o }; }
    return { R1: un(L.R1), R7: un(L.R7) }; }
  // ARRÊTS ET BUTS (2026-11-22, H-ARRETS-BUTS, intégré à la demande du propriétaire, en observation) : un arrêt = l'antagoniste d'une maison (h − 3) posé en base
  // dans cette maison (M1 à M16). Avec au moins un arrêt, le flux stoppé ressort en buts. Remplace l'ancien total (somme des buts moyens des deux niveaux de marquage) :
  // estimation du total, un match laissé de côté : 1,65 d'erreur contre 1,85.
  var ARRETS_OBS = { avec: { sur: 49, buts: 204, plus25: 37, plus35: 30 }, sans: { sur: 31, buts: 84, plus25: 14, plus35: 9 } };
  // M16 comprise (2026-11-27, chaîne du propriétaire « M13 attaque M16 » ; la matrice marque déjà Cauda en M16) : Cauda posée en M16 est un arrêt.
  function arrets(L) { var b = L.theme.bases, l = []; for (var h = 1; h <= 16; h++) if (b[h] === mod(h - 3)) l.push(h);
    var o = l.length ? ARRETS_OBS.avec : ARRETS_OBS.sans;
    return { maisons: l, nombre: l.length, butsAttendus: Math.round(10 * o.buts / o.sur) / 10, plus25: o.plus25 / o.sur, plus35: o.plus35 / o.sur, obs: o }; }
  // INCIDENTS (2026-11-27, à la demande du propriétaire ; en cours d'étude ; remplace la lecture arrêt / blocage). Mesures sur 108 matchs étiquetés
  // (outils/rouges_un_par_un.js, rouge_fausses_alertes.js, camp_du_rouge.js, penaltys_un_par_un.js).
  // ROUGE — veto (match calme) : le front de R7 attaque celui de R1, ou Albus / Puella posé sur son axe du dragon M9-M15 (Albus, la paix) — 2 rouges sur 40.
  //   Sinon trois signes : le dragon en M6/M12 (Rubeus ou Puer posé en base de M6 ou M12, qui y produit Caput ou Cauda), R7 bloqué, R1 bloqué (antagoniste
  //   présent intact : posé en base avec ses points actifs, ou reproduit par Populus — voir bloqueurs). Comptes dans INCIDENT_OBS (outils/mesure_incidents.js).
  //   Camp : un pôle bloqué reçoit le rouge, sauf si son bloqueur est posé dans les Filles (M5–M8) → l'adversaire ; sinon, avec le dragon, le pôle de même
  //   front que la figure martiale ; sinon R7. 19 rouges sur 21.
  // PENALTY — quatre signes : un arrêt avec des fronts de R1 et R7 non alliés, ou le front de R1 qui attaque celui de R7 ; la figure d'un pôle est celle de la
  //   sentence M16 ; le dragon M5-M11 (Laetitia ou Tristitia posé en base de M5 ou M11, qui y produit Caput ou Cauda : l'axe de la joie et de la tristesse,
  //   comme l'axe martial M6-M12 l'est pour le rouge) ; la 4e mère intacte (figure de base de M4 à Eau saturée, sans réaction avec Albus ; Populus exclu).
  //   0 signe 2/21 (peu probable), 1 ou 2 signes 24/69 (possible), 3 ou plus 12/18 (probable) (outils/fouille_penalty.js, fouille_albus_puella.js).
  //   Camp : le pôle dont la figure est en M16 ; sinon le pôle dont le front attaque l'autre ; sinon R1. 25 penalties sur 34.
  var INCIDENT_OBS = { rouge: { veto: { oui: 2, sur: 40 }, 0: { oui: 5, sur: 30 }, 1: { oui: 6, sur: 25 }, 2: { oui: 9, sur: 13 }, camp: { ok: 19, sur: 21 } },
    penalty: { faible: { oui: 2, sur: 21 }, possible: { oui: 24, sur: 69 }, probable: { oui: 12, sur: 18 }, camp: { ok: 25, sur: 34 } } };
  function incidentVerdict(L) { var b = L.theme.bases, f1 = (L.R1.figure - 1) % 4, f7 = (L.R7.figure - 1) % 4, AT = { 0: 3, 1: 0, 3: 2, 2: 1 };
    var rel = f1 === f7 ? 'meme' : AT[f1] === f7 ? 'R1' : AT[f7] === f1 ? 'R7' : 'allies';
    // rouge
    var dragon = [6, 12].filter(function (h) { return b[h] === 7 || b[h] === 1; }), bl = { R1: blocages(L, 'R1'), R7: blocages(L, 'R7') };
    var calme = [9, 15].filter(function (h) { return b[h] === 4 || b[h] === 14; }), sr = (dragon.length ? 1 : 0) + (bl.R7.length ? 1 : 0) + (bl.R1.length ? 1 : 0), nr = rel === 'R7' || calme.length ? 'veto' : Math.min(sr, 2);
    var niveauR = nr === 'veto' ? 'improbable' : nr === 2 ? 'probable' : nr === 1 ? 'possible' : 'faible', campR = null, pourquoiR = null, v1 = 0, v7 = 0;
    ['R1', 'R7'].forEach(function (p) { if (!bl[p].length) return; var filles = bl[p].some(function (h) { return h >= 5 && h <= 8; }), c = filles ? (p === 'R1' ? 'R7' : 'R1') : p; if (c === 'R1') v1++; else v7++; });
    if (v1 !== v7) { campR = v1 > v7 ? 'R1' : 'R7'; pourquoiR = 'blocage'; }
    if (!campR && dragon.length) { var meme = function (p) { var z = (L[p].figure - 1) % 4; return dragon.some(function (h) { return (b[h] - 1) % 4 === z; }); }, m1 = meme('R1'), m7 = meme('R7'); if (m1 !== m7) { campR = m1 ? 'R1' : 'R7'; pourquoiR = 'dragon'; } }
    if (!campR) { campR = 'R7'; pourquoiR = 'défaut'; }
    // penalty
    var A = arrets(L), e1 = b[16] === L.R1.figure, e7 = b[16] === L.R7.figure, s16 = e1 && e7 ? 'les deux' : e1 ? 'R1' : e7 ? 'R7' : null;
    var joie = [5, 11].filter(function (h) { return b[h] === 2 || b[h] === 8; }), arretSeul = A.nombre > 0 && rel !== 'allies', sigA = arretSeul || rel === 'R1';
    var mere4 = b[4] !== 16 && ![0, 1, 2, 3].some(function (l) { return K.niveaux(b[4])[l] === 1 && K.niveaux(4)[l] === 1; });
    var sp = (sigA ? 1 : 0) + (s16 ? 1 : 0) + (joie.length ? 1 : 0) + (mere4 ? 1 : 0), niveauP = sp >= 3 ? 'probable' : sp >= 1 ? 'possible' : 'faible';
    var campP = s16 === 'R1' || s16 === 'R7' ? s16 : rel === 'R1' || rel === 'R7' ? rel : 'R1', pourquoiP = s16 === 'R1' || s16 === 'R7' ? 'sentence' : rel === 'R1' || rel === 'R7' ? 'attaque' : 'défaut';
    var niveau = niveauR === 'probable' || niveauP === 'probable' ? 'probable' : niveauR === 'possible' || niveauP === 'possible' ? 'possible' : 'aucun';
    return { niveau: niveau, pole: null, arrets: A.maisons, fronts: rel,
      rouge: { niveau: niveauR, signes: sr, dragon: dragon, bloques: bl, veto: nr === 'veto', vetoAttaque: rel === 'R7', calme: calme, camp: campR, pourquoi: pourquoiR, obs: INCIDENT_OBS.rouge[nr], obsCamp: INCIDENT_OBS.rouge.camp },
      penalty: { niveau: niveauP, signes: sp, arret: sigA, arretSeul: arretSeul, attaqueR1: rel === 'R1', sentence: s16, joie: joie, mere4: mere4, camp: campP, pourquoi: pourquoiP, obs: INCIDENT_OBS.penalty[niveauP], obsCamp: INCIDENT_OBS.penalty.camp } }; }
  // INCIDENT : détecteur à six paramètres (signaux post hoc, ajustés sur 7 matchs étiquetés : 5 avec penalty ou rouge, 2 sans ; ce n'est PAS une règle de verdict).
  // Chaque paramètre vaut 1 quand il est actif ; score de 0 à 6 : 3 ou plus = probable, 2 = possible, 0 ou 1 = pas d'indice.
  //  P1 un arrêt (antagoniste ancré en base) relie les fronts directs de R1 et de R7 ; P2 la résultante de M12 est Via, Aquisitio, Caput, Puer ou Fortuna Major ;
  //  P3 la résultante de M6 est Cauda ou Rubeus ; P4 la base de M9 est la figure d'un des deux pôles ; P5 la Terre de la coordination base(M1)+base(M7) n'est pas saturée ;
  //  P6 la coordination base(M6)+base(M12) tombe sur un nœud touchant le canal Terre (maisons 4, 8, 12, 13, 14, 15).
  function incident(L) { var T = L.theme, z1 = (L.R1.figure - 1) % 4, z7 = (L.R7.figure - 1) % 4,
      liens = noeuds(L).arrets.filter(function (a) { var att = (a.figure - 1) % 4, vic = (a.maison - 1) % 4; return (att === z1 && vic === z7) || (att === z7 && vic === z1); }).map(function (a) { return { maison: a.maison, antagoniste: a.figure, sens: (a.figure - 1) % 4 === z1 ? 'R1→R7' : 'R7→R1' }; }),
      c1 = K.additionner(T.bases[1], T.bases[7]), c2 = K.additionner(T.bases[6], T.bases[12]), i2 = (c2 - 1) % 4, j2 = Math.floor((c2 - 1) / 4),
      p = [
        { id: 'P1', actif: liens.length > 0, texte: 'un arrêt relie les fronts de R1 et de R7' + (liens.length ? ' (M' + liens[0].maison + ', ' + liens[0].sens + ')' : '') },
        { id: 'P2', actif: [5, 15, 3, 1, 12].indexOf(T.resultantes[12]) >= 0, texte: 'la résultante de M12 (' + K.nom(T.resultantes[12]) + ') est une figure d\'incident' },
        { id: 'P3', actif: [13, 7].indexOf(T.resultantes[6]) >= 0, texte: 'la résultante de M6 (' + K.nom(T.resultantes[6]) + ') est une figure d\'incident' },
        { id: 'P4', actif: T.bases[9] === L.R1.figure || T.bases[9] === L.R7.figure, texte: 'la base de M9 (' + K.nom(T.bases[9]) + ') est la figure ' + (T.bases[9] === L.R1.figure ? 'de R1 : l\'autre pôle (R7) reçoit' : T.bases[9] === L.R7.figure ? 'de R7 : l\'autre pôle (R1) reçoit' : 'd\'un pôle') },
        { id: 'P5', actif: K.niveaux(c1)[3] !== 2, texte: 'la Terre de M1+M7 (' + K.nom(c1) + ') n\'est pas saturée' },
        { id: 'P6', actif: i2 === 3 || j2 === 3, texte: 'la coordination M6+M12 (' + K.nom(c2) + ', nœud M' + c2 + ') touche la Terre' }],
      score = p.filter(function (x) { return x.actif; }).length;
    // ROUGE (signal post hoc sur 7 matchs) : P6 (coordination M6+M12 sur un nœud de la Terre) est actif dans les 4 matchs avec rouge et dans aucun des 3 sans rouge ;
    // côté : le pôle dont le front a le nœud de la coordination M1+M7 vide (aucune des deux liaisons saturées) reçoit le rouge dans 3 cas sur 4.
    var nd = noeuds(L), etat = function (front) { var f = nd.fronts.filter(function (x) { return x.front === front; })[0], n = f && f.noeuds.filter(function (x) { return x.maison === c1; })[0]; return n ? n.etat : null; },
      e1 = etat(L.R1.front), e7 = etat(L.R7.front),
      cote = e1 === 'vide' && e7 !== 'vide' ? 'R1' : e7 === 'vide' && e1 !== 'vide' ? 'R7' : null;
    return { parametres: p, score: score, niveau: score >= 3 ? 'probable' : score === 2 ? 'possible' : 'aucun', probable: score >= 3, liens: liens,
      rouge: { probable: p[5].actif, coordination: c2, noeudM1M7: c1, etatR1: e1, etatR7: e7, cote: cote }, parite: pariteIncident(L) }; }
  // PARITÉ DE L'INCIDENT (2026-11-22, H-INCIDENT-PARITE, en observation) : l'énergie EB d'un pôle (voir marquage, H-PARITE-EB) à 3 niveaux impairs déborde.
  // Quand un seul des deux pôles est dans ce cas, l'incident se fixe sur lui : il obtient un penalty ou reçoit un rouge. Si les deux le sont, les débordements s'annulent.
  // Observé sur 31 matchs étiquetés (mis à jour le 2026-11-25) : un seul pôle à 3 impairs, incident dans 10 matchs sur 16 ; sinon 3 sur 15. Sur ce pôle : 5 penalties pour lui, 4 rouges contre lui ; penalty et rouge ne se distinguent pas encore.
  var INCIDENT_PARITE_OBS = { seul: { incident: 10, sur: 16 }, autres: { incident: 3, sur: 15 } };
  function pariteIncident(L) { var Q = marquage(L), a = Q.R1.parite.impairs === 3, b = Q.R7.parite.impairs === 3, pole = a !== b ? (a ? 'R1' : 'R7') : null;
    return { pole: pole, impairsR1: Q.R1.parite.impairs, impairsR7: Q.R7.parite.impairs, obs: pole ? INCIDENT_PARITE_OBS.seul : INCIDENT_PARITE_OBS.autres }; }
  var API = { boucles: boucles, egalite: egalite, blocages: blocages, bloqueurs: bloqueurs, zoneBlocage: zoneBlocage, hierarchie: hierarchie, butsEstimes: butsEstimes, marquePole: marquePole, canauxTerre: canauxTerre, victoireConvergence: victoireConvergence, incidentVerdict: incidentVerdict, arrets: arrets, defense: defense, m1m10: m1m10, diagonales: diagonales, pariteIncident: pariteIncident, secondeMiTemps: secondeMiTemps, rythme: rythme, equivalences: equivalences, coordonnees: coordonnees, incident: incident, marquage: marquage, chaine: chaine,  repos: repos, verdict: verdict, temoins: temoins, interactions: interactions, terreSaturee: terreSaturee, paralysie: paralysie, paralysieFigure: paralysieFigure, liaisonsTerre: liaisonsTerre, multiplicite: multiplicite, connexions: connexions, activation: activation, faits: faits, noeuds: noeuds, poles: poles, version: '4.1.0-noyau-indices', lire: lire, fiabilite: fiabilite, equilibre: equilibre, analyser: function (meres, jour) { var L = lire(meres); return { lecture: L, fiabilite: fiabilite(L, jour) }; } };
  root.KOUN4 = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
