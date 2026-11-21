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

  // Niveaux d'activation et canal (règle posée par le propriétaire) : un pôle a 4 niveaux d'activation (2 points = activé). Son canal est l'élément de son front ;
  // le canal compatible est Feu↔Air, Eau↔Terre. On compte les niveaux activés qui tombent sur son canal ou sur le canal compatible. Même procédé pour son miroir, son binôme et son antagoniste,
  // chacun avec son propre canal. Score 1 : le pôle seul (0 à 2) ; score 4 : pôle + miroir + binôme + antagoniste. H-NIV1 (score 1) et H-NIV4 (score 4) sont réfutées ; les comptes restent comme structure.
  var COMPAT = [1, 0, 3, 2];
  function activation(L) {
    function compte(f) { var z = (f - 1) % 4, lv = K.niveaux(f), n = []; lv.forEach(function (v, i) { if (v === 2 && (i === z || i === COMPAT[z])) n.push(LETTRES[i]); }); return { figure: f, niveaux: lv.map(function (v, i) { return v === 2 ? LETTRES[i] : '.'; }).join(''), canal: LETTRES[z], compatible: LETTRES[COMPAT[z]], coincide: n.join(''), n: n.length }; }
    function pole(c) {
      var p = c.figure, parts = [['pôle', p], ['miroir', K.miroir(p)], ['binôme', (p - 1) % 4 < 2 ? p + 2 : p - 2], ['antagoniste', mod(p - 3)]].map(function (x) { var r = compte(x[1]); r.role = x[0]; return r; });
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

  // Les deux témoins (M13 et M14) : leurs figures en base et en résultante, leurs niveaux saturés, la somme des niveaux saturés de leurs deux bases (hypothèse H-TEMOINS : 6 = nul).
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
  function verdict(L) {
    var R = repos(L);
    if (R.gagnant) return { v: R.gagnant === 'R1' ? '1' : '2', regle: 'H-REPOS', statut: 'règle du propriétaire (3 justes sur 6 appels sur 39 matchs)', raison: R.gagnant + ' possède ses deux fronts au repos, sans que leur antagoniste y soit' };
    return { v: null, regle: null, statut: null, raison: 'H-REPOS ne se prononce pas (aucun pôle ne possède seul ses deux fronts au repos)' };
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
  // par le niveau Terre : on compte, sur ces 4 maisons, celles dont la résultante (maison 16 : la base) a la Terre saturée. n va de 0 à 4. Observé sur 78 pôles-matchs :
  // buts moyens par n = 0:0,8 · 1:1,6 · 2:2,5 · 3:3,1 · 4:2,4 (5 obs seulement) ; corrélation 0,30 ; p = 0,016 après correction du choix parmi 6 mesures.
  var MARQUAGE_MOYENNES = [1.2, 1.5, 2.5, 3.1, 2.4];
  // H-MARQ-DOUBLE (signal post hoc) : part des pôles qui ont marqué 2 buts ou plus selon n, et nombre d'observations (78 pôles-matchs)
  // part des pôles qui ont marqué au moins 1 but selon n (78 pôles-matchs ; 4, 18, 34, 13, 5 observations)
  var MARQUAGE_P1 = [0.67, 0.79, 0.89, 1.00, 1.00];
  var MARQUAGE_P2 = [{ p: 0.33, obs: 6 }, { p: 0.32, obs: 19 }, { p: 0.63, obs: 35 }, { p: 0.69, obs: 13 }, { p: 0.80, obs: 5 }];
  function marquage(L) { var T = L.theme;
    function un(c) { var z = (c.figure - 1) % 4, hs = [0, 1, 2, 3].map(function (i) { return z + 4 * i + 1; }), n = 0;
      hs.forEach(function (h) { var r = h < 16 ? T.resultantes[h] : T.bases[16]; if (K.niveaux(r)[3] === 2) n++; });
      return { front: K.front(z + 1), maisons: hs, n: n, butsMoyens: MARQUAGE_MOYENNES[n], p2: MARQUAGE_P2[n].p, p1: MARQUAGE_P1[n], obs: MARQUAGE_P2[n].obs }; }
    var a = un(L.R1), b = un(L.R7);
    // deux marquent : produit des deux probabilités (hypothèse d'indépendance : 75 % prédit en moyenne contre 73 % observé sur 37 matchs) ; buts attendus : somme des moyennes par n
    return { R1: a, R7: b, deuxMarquent: a.p1 * b.p1, butsAttendus: Math.round((a.butsMoyens + b.butsMoyens) * 10) / 10 }; }
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
      rouge: { probable: p[5].actif, coordination: c2, noeudM1M7: c1, etatR1: e1, etatR7: e7, cote: cote } }; }
  var API = { incident: incident, marquage: marquage, chaine: chaine,  repos: repos, verdict: verdict, temoins: temoins, interactions: interactions, terreSaturee: terreSaturee, paralysie: paralysie, paralysieFigure: paralysieFigure, liaisonsTerre: liaisonsTerre, multiplicite: multiplicite, connexions: connexions, activation: activation, faits: faits, noeuds: noeuds, poles: poles, version: '4.1.0-noyau-indices', lire: lire, fiabilite: fiabilite, equilibre: equilibre, analyser: function (meres, jour) { var L = lire(meres); return { lecture: L, fiabilite: fiabilite(L, jour) }; } };
  root.KOUN4 = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
