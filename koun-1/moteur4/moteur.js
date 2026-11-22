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
    return { figure: f, protecteur: pro, marqueurs: marqueurs, obs: { designees: { oui: 14, sur: 19 }, autres: { oui: 12, sur: 39 } } }; }
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
  // VERDICT DE VICTOIRE (2026-11-22) : balance de la Terre (n du front direct de chaque pôle) lue avec les nœuds de coordination, puis H-REPOS.
  // Ordre : 1) Terre et coordonnées désignent le même pôle : victoire ; 2) H-REPOS ; 3) Terre seule : avantage, nul possible ; 4) coordonnées seules : avantage, nul possible ;
  // 5) Terre et coordonnées opposées : pas d'appel ; 6) rien : pas d'appel, nul possible. Résultats observés dans VERDICT_STATS (justes, faux, nuls, appels).
  var VERDICT_STATS = { accord: { ok: 19, ko: 2, nul: 4, n: 25 }, repos: { ok: 6, ko: 3, nul: 3, n: 12 }, terre: { ok: 6, ko: 5, nul: 2, n: 13 }, coord: { ok: 3, ko: 3, nul: 2, n: 8 }, oppose: { n: 6 }, rien: { n: 15 } };
  function categorieVerdict(L) { var Q = marquage(L), C = coordonnees(L), R = repos(L), t = Math.sign(Q.R1.n - Q.R7.n), c = Math.sign(C.ecart), rp = R.gagnant === 'R1' ? 1 : R.gagnant === 'R7' ? -1 : 0;
    if (t && t === c) return { cat: 'accord', v: t, Q: Q, C: C };
    if (rp) return { cat: 'repos', v: rp, Q: Q, C: C };
    if (t && !c) return { cat: 'terre', v: t, Q: Q, C: C };
    if (c && !t) return { cat: 'coord', v: c, Q: Q, C: C };
    if (t && c) return { cat: 'oppose', v: 0, Q: Q, C: C };
    return { cat: 'rien', v: 0, Q: Q, C: C }; }
  function verdict(L) {
    var K0 = categorieVerdict(L), S = VERDICT_STATS[K0.cat], Q = K0.Q, C = K0.C, cote = K0.v > 0 ? 'R1' : 'R7', v = K0.v ? (K0.v > 0 ? '1' : '2') : null,
      st = S.ok !== undefined ? S.ok + ' justes, ' + S.ko + ' faux, ' + S.nul + ' nuls sur ' + S.n + ' appels' : '',
      terre = 'Terre du front : R1 ' + Q.R1.n + '/4, R7 ' + Q.R7.n + '/4', noeuds = 'nœuds de coordination : écart ' + C.ecart;
    if (K0.cat === 'accord') return { v: v, force: 'confirmee', regle: 'H-BALANCE-TERRE et H-COORD-VICTOIRE', statut: st, raison: cote + ' : sa Terre et ses nœuds de coordination l\'emportent (' + terre + ' ; ' + noeuds + ')' };
    if (K0.cat === 'repos') return { v: v, force: 'repos', regle: 'H-REPOS', statut: 'règle du propriétaire : ' + st, raison: cote + ' possède ses deux fronts au repos, sans que leur antagoniste y soit (' + terre + ')' };
    if (K0.cat === 'terre') return { v: v, force: 'avantage', nulPossible: true, regle: 'H-BALANCE-TERRE', statut: st, raison: cote + ' a plus de Terre saturée dans son front (' + terre + ') ; les nœuds de coordination sont à égalité' };
    if (K0.cat === 'coord') return { v: v, force: 'avantage', nulPossible: true, regle: 'H-COORD-VICTOIRE', statut: st, raison: cote + ' a les nœuds de coordination les plus pleins (' + noeuds + ') ; Terre à égalité' };
    if (K0.cat === 'oppose') return { v: null, force: null, nulPossible: false, regle: null, statut: null, raison: 'forces opposées : la Terre et les nœuds de coordination désignent des pôles différents (' + terre + ' ; ' + noeuds + ')' };
    return { v: null, force: null, nulPossible: true, regle: null, statut: null, raison: 'aucune force ne se dégage : Terre et nœuds de coordination à égalité, H-REPOS muet (' + terre + ')' };
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
  // par le niveau Terre : on compte, sur ces 4 maisons, celles dont la résultante (maison 16 : la base) a la Terre saturée. n va de 0 à 4. Observé sur 158 pôles-matchs :
  var NIVEAUX_MARQUAGE = { fort: { sur: 75, un: 60, deux: 40, moy: 2.15 }, 'freiné': { sur: 42, un: 30, deux: 17, moy: 1.64 }, faible: { sur: 23, un: 20, deux: 7, moy: 1.52 }, 'bloqué': { sur: 18, un: 13, deux: 4, moy: 1.06 } };
  function marquage(L) { var T = L.theme;
    function un(c) { var z = (c.figure - 1) % 4, hs = [0, 1, 2, 3].map(function (i) { return z + 4 * i + 1; }), n = 0;
      hs.forEach(function (h) { var r = h < 16 ? T.resultantes[h] : T.bases[16]; if (K.niveaux(r)[3] === 2) n++; });
      // CANAUX TERRE (règle sûre du propriétaire, 2026-11-21) : les deux liaisons Terre du front direct (haut → droite et bas → gauche) saturées dans les résultantes =
      // marquage presque inévitable (10 pôles sur 11 ont marqué ; seule exception Strasbourg–Brest 0-1, Strasbourg freiné, sans figure au repos).
      var t = function (h) { var r = h < 16 ? T.resultantes[h] : T.bases[16]; return K.niveaux(r)[3] === 2; }, ct = (t(z + 1) && t(z + 5) ? 1 : 0) + (t(z + 9) && t(z + 13) ? 1 : 0);
      return { front: K.front(z + 1), maisons: hs, n: n, canauxTerre: ct, marqueSur: ct === 2 }; }
    var a = un(L.R1), b = un(L.R7), RP = repos(L);
    // NIVEAU DE MARQUAGE d'une équipe (2026-11-21) : la Terre de son front direct (n) et son blocage (figures au repos sans antagoniste dans ses deux fronts, H-REPOS) lus ensemble.
    // Fréquences observées (158 pôles-matchs) : fort (n >= 2, au moins une figure au repos), freiné (n >= 2, aucune), faible (n <= 1, au moins une), bloqué (n <= 1, aucune).
    [[a, 'R1'], [b, 'R7']].forEach(function (x) { var q = x[0], r = RP[x[1]].total, k = q.n >= 2 ? (r ? 'fort' : 'freiné') : (r ? 'faible' : 'bloqué'), o = NIVEAUX_MARQUAGE[k];
      q.repos = r; q.niveau = k; q.p2n = o.deux / o.sur; q.p1n = o.un / o.sur; q.moyN = o.moy; q.obsN = o.sur; });
    // deux marquent : produit des deux probabilités (hypothèse d'indépendance : 75 % prédit en moyenne contre 73 % observé sur 37 matchs) ; buts attendus : somme des moyennes par n
    // TÉMOIN M5+M7 (signal post hoc, trouvé par criblage des 255 combinaisons distinctes) : quand la Terre de la figure base(M5)+base(M7) n'est pas saturée, les deux équipes ont marqué
    // dans 20 matchs sur 21 observés ; saturée, dans 9 sur 20.
    // second témoin M4+M10 (ajouté le 2026-11-21) : quand la Terre de M5+M7 est saturée, celle de M4+M10 départage (ouverte 5 sur 9, saturée 4 sur 11).
    var tf = K.additionner(T.bases[5], T.bases[7]), terre = K.niveaux(tf)[3] === 2, t2 = K.additionner(T.bases[4], T.bases[10]), terre2 = K.niveaux(t2)[3] === 2,
      // Binôme de la figure M5+M7 (2026-11-21, propriétaire) : placé chez lui (sa maison de repos) ou chez son antagoniste, il confirme l'état de la figure ;
      // Terre saturée et binôme placé : les deux n'ont jamais marqué (0 sur 5).
      bt = K.binome(tf), hbt = mod(bt - 3), btPlace = T.bases[bt] === bt || (bt < 16 && T.resultantes[bt] === bt) || T.bases[hbt] === bt || (hbt < 16 && T.resultantes[hbt] === bt),
      OBS_TEMOIN = { ouverte: { oui: 30, sur: 39 }, binomePlace: { oui: 2, sur: 12 }, m410ouverte: { oui: 7, sur: 13 }, m410saturee: { oui: 7, sur: 15 } };
    return { R1: a, R7: b, temoin: { figure: tf, terreSaturee: terre, figure2: t2, terre2Saturee: terre2, binome: bt, binomePlace: btPlace, deuxMarquent: !terre, obsPas: !terre ? OBS_TEMOIN.ouverte : btPlace ? OBS_TEMOIN.binomePlace : terre2 ? OBS_TEMOIN.m410saturee : OBS_TEMOIN.m410ouverte }, butsAttendus: Math.round((a.moyN + b.moyN) * 10) / 10 }; }
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
  var API = { secondeMiTemps: secondeMiTemps, rythme: rythme, equivalences: equivalences, coordonnees: coordonnees, incident: incident, marquage: marquage, chaine: chaine,  repos: repos, verdict: verdict, temoins: temoins, interactions: interactions, terreSaturee: terreSaturee, paralysie: paralysie, paralysieFigure: paralysieFigure, liaisonsTerre: liaisonsTerre, multiplicite: multiplicite, connexions: connexions, activation: activation, faits: faits, noeuds: noeuds, poles: poles, version: '4.1.0-noyau-indices', lire: lire, fiabilite: fiabilite, equilibre: equilibre, analyser: function (meres, jour) { var L = lire(meres); return { lecture: L, fiabilite: fiabilite(L, jour) }; } };
  root.KOUN4 = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
