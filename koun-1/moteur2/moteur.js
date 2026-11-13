/* koun — moteur 2 : structure + cas explicites.
   Étage 1 : la structure (figures, thème, résultantes, fronts, forces, pôles, attaques).
   Étage 2 : les cas. Chaque cas est une condition écrite qui donne un résultat.
   Le moteur lit les cas dans l'ordre ; si aucun ne s'applique, il le dit. */
(function (root) {
  'use strict';
  var VERSION = '2.0.0';

  // ── Étage 1 : structure ────────────────────────────────────────────────
  // Les figures sont numérotées par leur maison de repos (1 Puer … 16 Populus).
  var FIG = ['Puer', 'Laetitia', 'Caput', 'Albus', 'Via', 'Amissio', 'Rubeus', 'Tristitia',
    'Fortuna Minor', 'Carcer', 'Conjunctio', 'Fortuna Major', 'Cauda Draconis', 'Puella', 'Aquisitio', 'Populus'];
  // Points de chaque figure, de la tête aux pieds (1 = impair, 2 = pair).
  var POINTS = {
    'Puer': [1, 1, 2, 1], 'Laetitia': [1, 2, 2, 2], 'Caput': [2, 1, 1, 1], 'Albus': [2, 2, 1, 2],
    'Via': [1, 1, 1, 1], 'Amissio': [1, 2, 1, 2], 'Rubeus': [2, 1, 2, 2], 'Tristitia': [2, 2, 2, 1],
    'Fortuna Minor': [1, 1, 2, 2], 'Carcer': [1, 2, 2, 1], 'Conjunctio': [2, 1, 1, 2], 'Fortuna Major': [2, 2, 1, 1],
    'Cauda Draconis': [1, 1, 1, 2], 'Puella': [1, 2, 1, 1], 'Aquisitio': [2, 1, 2, 1], 'Populus': [2, 2, 2, 2]
  };
  var FRONTS = ['A', 'B', 'C', 'D'];                       // A 1-5-9-13, B 2-6-10-14, C 3-7-11-15, D 4-8-12-16
  var ELEMENTS = ['Feu', 'Air', 'Eau', 'Terre'];           // élément du front = élément de ses maisons
  // Cercle des fronts : les 16 figures dans l'ordre de leur maison de repos. Quatre points partagent le cercle :
  // A = Est, entre 16 et 1 ; D = Nord, entre 4 et 5 ; B = Ouest, entre 8 et 9 ; C = Sud, entre 12 et 13.
  var AXES = [{ point: 'A', nom: 'Est', entre: [16, 1] }, { point: 'D', nom: 'Nord', entre: [4, 5] }, { point: 'B', nom: 'Ouest', entre: [8, 9] }, { point: 'C', nom: 'Sud', entre: [12, 13] }];
  // Quatre points seconds, au milieu de chaque quart, face à face deux à deux : entre 2 et 3 face à entre 10 et 11 ; entre 6 et 7 face à entre 14 et 15.
  var AXES2 = [{ point: 'NE', entre: [2, 3] }, { point: 'NO', entre: [6, 7] }, { point: 'SO', entre: [10, 11] }, { point: 'SE', entre: [14, 15] }];
  // Combinaisons de quatre maisons sur le cercle. Chaque combinaison a trois sœurs, obtenues en tournant d'un quart de cercle (+4 maisons).
  // L'axe angulaire 1-4-7-10 et ses sœurs sont les quatre chaînes d'attaque qui se partagent le cercle.
  var COMBIS = [];
  [['Axe angulaire', [1, 4, 7, 10]], ['Combinaison 1-5-12-15', [1, 5, 12, 15]], ['Témoin 3-5-11-15', [3, 5, 11, 15]], ['Front A', [1, 5, 9, 13]]].forEach(function (c, g) {
    for (var t = 0; t < (g === 3 ? 4 : 4); t++) {
      var l = c[1].map(function (h) { return ((h - 1 + (g === 3 ? t : 4 * t)) % 16) + 1; });
      COMBIS.push({ famille: c[0], nom: g === 3 ? 'Front ' + 'ABCD'.charAt(t) : t === 0 ? c[0] : g === 0 && t === 2 ? 'Axe miroir 9-12-15-2' : 'sœur ' + l.join('-'), maisons: l, origine: t === 0 });
    }
  });
  var ROSE = [];
  (function () { var q = ['entre A (Est) et D (Nord)', 'entre D (Nord) et B (Ouest)', 'entre B (Ouest) et C (Sud)', 'entre C (Sud) et A (Est)'], bord = { 16: 'A', 1: 'A', 4: 'D', 5: 'D', 8: 'B', 9: 'B', 12: 'C', 13: 'C' };
    for (var k = 1; k <= 16; k++) ROSE.push(q[Math.floor((k - 1) / 4)] + (bord[k] ? ', au bord du point ' + bord[k] : '')); })();
  var CARDINAL = { 1: 'Est', 5: 'Nord', 9: 'Ouest', 13: 'Sud', 2: 'Est', 6: 'Nord', 10: 'Ouest', 14: 'Sud',
    3: 'Est', 15: 'Nord', 11: 'Ouest', 7: 'Sud', 4: 'Est', 16: 'Nord', 12: 'Ouest', 8: 'Sud' };
  // Barème des forces hors maison de repos : élément de la figure face à l'élément de la maison.
  var BAREME = { 'Feu|Feu': 85, 'Air|Air': 85, 'Eau|Eau': 85, 'Terre|Terre': 85, 'Eau|Terre': 70, 'Air|Feu': 70,
    'Feu|Terre': 55, 'Air|Eau': 55, 'Eau|Feu': 1, 'Air|Terre': 1 };

  function num(f) { return FIG.indexOf(f) + 1; }
  function fig(n) { return FIG[((n - 1) % 16 + 16) % 16]; }
  function frontDe(f) { return FRONTS[(num(f) - 1) % 4]; }
  function elementDe(f) { return ELEMENTS[(num(f) - 1) % 4]; }
  function elementMaison(h) { return ELEMENTS[(h - 1) % 4]; }
  function figuresDuFront(lettre) { var i = FRONTS.indexOf(lettre); return FIG.filter(function (f, k) { return k % 4 === i; }); }
  function additionner(a, b) {
    var s = POINTS[a].map(function (x, i) { return (x + POINTS[b][i]) % 2 === 0 ? 2 : 1; }).join();
    for (var k = 0; k < 16; k++) if (POINTS[FIG[k]].join() === s) return FIG[k];
    return null;
  }
  function construireTheme(m1, m2, m3, m4) {
    var m = [m1, m2, m3, m4], t = {};
    for (var i = 0; i < 4; i++) { if (!POINTS[m[i]]) throw new Error('Figure inconnue : ' + m[i]); t[i + 1] = m[i]; }
    for (var l = 0; l < 4; l++) {                          // filles : la ligne l des quatre mères
      var lignes = m.map(function (f) { return POINTS[f][l]; }).join();
      for (var k = 0; k < 16; k++) if (POINTS[FIG[k]].join() === lignes) t[5 + l] = FIG[k];
    }
    t[9] = additionner(t[1], t[2]); t[10] = additionner(t[3], t[4]);
    t[11] = additionner(t[5], t[6]); t[12] = additionner(t[7], t[8]);
    t[13] = additionner(t[9], t[10]); t[14] = additionner(t[11], t[12]);
    t[15] = additionner(t[13], t[14]); t[16] = additionner(t[15], t[1]);
    return t;
  }

  function lire(theme, polesForces) {
    // Maisons : base, résultante (base + figure de repos de la maison ; aucune en M16).
    var maisons = [];
    for (var h = 1; h <= 16; h++) maisons.push({ maison: h, base: theme[h], resultante: h === 16 ? null : additionner(theme[h], fig(h)) });
    function presentEn(f, h) { var m = maisons[h - 1]; return m.base === f || m.resultante === f; }
    function chezElle(f) { return presentEn(f, num(f)); }
    // Double repos : deux figures liées par l'attaque (k et k±3), chacune dans sa maison de repos, s'annulent.
    function doubleRepos(f) { return chezElle(f) && (chezElle(fig(num(f) + 3)) || chezElle(fig(num(f) - 3))); }
    // Maison antagoniste : la maison de repos de la figure qui l'attaque (k-3). C'est le contraire de sa propre maison :
    // la figure y est pénalisée, faible et fragile aux attaques ; sa force s'inverse (100 % chez elle, 0 % chez son antagoniste).
    function enMaisonAntagoniste(f, h) { return num(fig(num(f) - 3 + 16)) === h; }
    function force(f, h) {
      if (num(f) === h) return doubleRepos(f) ? null : 100;
      if (enMaisonAntagoniste(f, h)) return 0;
      return BAREME[[elementDe(f), elementMaison(h)].sort().join('|')];
    }
    function motif(f, h) {
      if (num(f) === h) return doubleRepos(f) ? 'DOUBLE_REPOS_NON_CHIFFRE' : 'REPOS_PROPRE_MAXIMAL';
      if (enMaisonAntagoniste(f, h)) return 'MAISON_ANTAGONISTE_FORCE_INVERSEE';
      return elementDe(f) === elementMaison(h) ? 'MEME_ELEMENT' : 'ELEMENTS_' + [elementDe(f), elementMaison(h)].sort().join('_').toUpperCase();
    }
    function positions(f) {
      var l = [];
      maisons.forEach(function (m) {
        if (m.base === f) l.push({ maison: m.maison, couche: 'base', force: force(f, m.maison) });
        if (m.resultante === f && m.resultante !== m.base) l.push({ maison: m.maison, couche: 'resultante', force: force(f, m.maison) });
      });
      return l;
    }
    // Pôles : R1 = maison de repos de la figure de M1 ; R7 = R1 + 6.
    var r1 = num(theme[1]), r7 = ((r1 - 1 + 6) % 16) + 1;
    if (polesForces) { r1 = polesForces.R1; r7 = polesForces.R7; }
    function camp(k, h) {
      var p = theme[h], lettre = frontDe(p), binome = FRONTS[(FRONTS.indexOf(lettre) + 2) % 4];
      return { camp: k, maison: h, figure: p, front: lettre, pointCardinal: CARDINAL[num(p)], element: elementDe(p),
        frontDirect: figuresDuFront(lettre), frontBinome: figuresDuFront(binome),
        antagoniste: fig(num(p) - 3), controleur: fig(num(p) - 6), miroir: fig(num(p) + 8) };
    }
    var R1 = camp('R1', r1), R7 = camp('R7', r7);
    // Attaques : chaque figure k attaque k+3.
    var duels = FIG.map(function (a) {
      var c = fig(num(a) + 3), pa = positions(a), pc = positions(c), etat;
      if (!pa.length) etat = 'ATTAQUANT_ABSENT';
      else if (!pc.length) etat = 'CIBLE_ABSENTE';
      else if (chezElle(a) && chezElle(c)) etat = 'DOUBLE_REPOS_ANNULATION';
      else if (chezElle(a)) etat = 'CIBLE_MAITRISEE_PAR_REPOS_MAXIMAL';
      else if (chezElle(c)) etat = 'RESISTANCE_CIBLE_AU_REPOS_MAXIMAL';
      else etat = 'FORCES_A_COMPARER';
      return { attaquant: a, cible: c, present: pa.length > 0, ciblePresente: pc.length > 0, etat: etat };
    });
    // Annulations (double repos) et verrous de front (deux figures d'un même front, en base, chez elles à 100 %).
    var annulations = duels.filter(function (d) { return d.etat === 'DOUBLE_REPOS_ANNULATION'; })
      .map(function (d) { return { attaquant: d.attaquant, cible: d.cible, maisonAttaquant: num(d.attaquant), maisonCible: num(d.cible) }; });
    function verrousDuFront(lettre) {
      var chez = figuresDuFront(lettre).filter(function (f) { return maisons[num(f) - 1].base === f && force(f, num(f)) === 100; });
      var l = [];
      for (var i = 0; i < chez.length; i++) for (var j = i + 1; j < chez.length; j++) l.push({ figures: [chez[i], chez[j]], maisons: [num(chez[i]), num(chez[j])], front: lettre });
      return l;
    }
    function chezElleEnBase(f) { return maisons[num(f) - 1].base === f; }
    function absente(f) { return positions(f).length === 0; }
    function enMaisonPaire(f) { return positions(f).some(function (x) { return x.maison % 2 === 0; }); }
    // Mode de confrontation, selon la position des deux pôles :
    //  MEME_FRONT            : départage par les moitiés du front ;
    //  MEME_BOUCLE           : front du pôle contre le front antagoniste ;
    //  BOUCLES_DIFFERENTES   : par paires, figure et son binôme (k et k+2) contre figure et son binôme.
    var n1 = num(R1.figure), n7 = num(R7.figure);
    var mode = R1.front === R7.front ? 'MEME_FRONT' : (n1 % 2 === n7 % 2 ? 'MEME_BOUCLE' : 'BOUCLES_DIFFERENTES');
    function paires(c) {
      var l = [], n = num(c.figure);
      for (var i = 0; i < 8; i++) { var f = fig(n + 2 * i); l.push({ figure: f, numero: num(f), front: frontDe(f), positions: positions(f), chezElle: chezElle(f), absente: positions(f).length === 0 }); }
      return l;
    }
    // Annulation d'une figure au repos : par son attaquant (k-3) s'il est lui aussi au repos, ou s'il est deux fois en base (positions à 1 % ou 0 % non comptées).
    function annuleePar(f) {
      if (!chezElle(f)) return null;
      var at = fig(num(f) - 3 + 16);
      if (chezElle(at)) return { attaquant: at, motif: 'ATTAQUANT_AU_REPOS', maisons: [num(at)] };
      var b = positions(at).filter(function (x) { return x.couche === 'base' && x.force !== null && x.force > 1; });
      if (b.length >= 2) return { attaquant: at, motif: 'ATTAQUANT_DEUX_FOIS_EN_BASE', maisons: b.map(function (x) { return x.maison; }) };
      return null;
    }
    // Stabilité : les ancrages de chaque camp = ses figures dans leur maison de repos, en base, non annulées.
    // Camp : la boucle du pôle (boucles différentes), son front (même boucle) ou sa moitié de front (même front).
    function stabilite() {
      function campDe(c) {
        var n = num(c.figure);
        if (mode === 'BOUCLES_DIFFERENTES') return FIG.filter(function (f) { return num(f) % 2 === n % 2; });
        if (mode === 'MEME_BOUCLE') return c.frontDirect;
        return [c.figure, fig(n + (n <= 8 ? (n <= 4 ? 4 : -4) : (n <= 12 ? 4 : -4)))];
      }
      function ancres(c) { return campDe(c).filter(function (f) { return chezElleEnBase(f) && !annuleePar(f); }); }
      var a = ancres(R1), b = ancres(R7), e = Math.abs(a.length - b.length);
      return { R1: a, R7: b, ecart: e, fort: e >= 2, plusStable: a.length > b.length ? 'R1' : b.length > a.length ? 'R7' : null };
    }
    // Les deux figures somme du thème : l'axe angulaire (M1+M4+M7+M10) et la somme M3+M5+M11+M15.
    function sommeDe(l) { return l.map(function (h) { return theme[h]; }).reduce(function (x, y) { return additionner(x, y); }); }
    var sommes = [{ nom: 'somme de l’axe angulaire', figure: sommeDe([1, 4, 7, 10]) }, { nom: 'somme 3-5-11-15', figure: sommeDe([3, 5, 11, 15]) }];
    sommes.forEach(function (x) {
      x.pole = x.figure === R1.figure ? 'R1' : x.figure === R7.figure ? 'R7' : null;
      x.enBase = maisons.filter(function (m) { return m.base === x.figure; }).map(function (m) { return m.maison; });
      x.surAxe = x.enBase.filter(function (h) { return h === 1 || h === 4 || h === 7 || h === 10; });
      x.camp = mode !== 'BOUCLES_DIFFERENTES' ? null : (num(x.figure) % 2 === num(R1.figure) % 2 ? 'R1' : 'R7');
    });
    // Binôme de M1 en M4 ou M10 (base ou résultante) : le thème est beaucoup plus parlant.
    var bm1 = fig(num(theme[1]) + 2), ou = positions(bm1).filter(function (x) { return x.maison === 4 || x.maison === 10; });
    var binomeM1 = { figure: bm1, positions: ou.map(function (x) { return { maison: x.maison, couche: x.couche === 'base' ? 'base' : 'résultante' }; }), parlant: ou.length > 0 };
    // Lecture du cercle (boucles différentes). Deux signaux désignent un favori :
    //  - le bord : un pôle dont la figure est au bord d'un point A, B, C, D (fronts A et D) face à un pôle de l'intérieur (fronts B et C) ;
    //  - l'amont : le pôle d'où l'on rejoint l'autre en avançant de 1, 3 ou 5 figures dans le sens de l'attaque.
    var cercle = (function () {
      var a = num(R1.figure), b = num(R7.figure), d = ((b - a) % 16 + 16) % 16;
      function auBord(k) { return k % 4 === 1 || k % 4 === 0; }
      var o = { ecart: d, bordR1: auBord(a), bordR7: auBord(b), favoriBord: null, amont: null, favori: null, conflit: false, signaux: [] };
      if (mode !== 'BOUCLES_DIFFERENTES') return o;
      if (o.bordR1 !== o.bordR7) { o.favoriBord = o.bordR1 ? 'R1' : 'R7'; o.signaux.push((o.bordR1 ? R1 : R7).figure + ' (' + o.favoriBord + ') est au bord d’un point, ' + (o.bordR1 ? R7 : R1).figure + ' à l’intérieur'); }
      if (d === 1 || d === 3 || d === 5) o.amont = 'R1'; else if (d === 15 || d === 13 || d === 11) o.amont = 'R7';
      if (o.amont) o.signaux.push((o.amont === 'R1' ? R1 : R7).figure + ' (' + o.amont + ') est en amont, à ' + (o.amont === 'R1' ? d : 16 - d) + ' figure(s) de l’autre pôle dans le sens de l’attaque');
      if (o.favoriBord && o.amont && o.favoriBord !== o.amont) o.conflit = true;
      else o.favori = o.favoriBord || o.amont;
      return o;
    })();
    // Sommes aux quatre points du cercle : A = M16+M1 (toujours M15), D = M4+M5, B = M8+M9, C = M12+M13.
    // Quand une somme est le miroir d'un pôle, le point où elle tombe compte : au point D, nul ; au point B ou C, ce pôle est favori.
    var pointsCercle = AXES.map(function (x) {
      var f = additionner(theme[x.entre[0]], theme[x.entre[1]]);
      return { point: x.point, nom: x.nom, maisons: x.entre, figure: f, miroirDe: f === R1.miroir ? 'R1' : f === R7.miroir ? 'R7' : null, pole: f === R1.figure ? 'R1' : f === R7.figure ? 'R7' : null };
    });
    // Les huit points (A, D, B, C et les quatre points du milieu des quarts) : somme du thème à chaque point, comparée à la valeur propre du point.
    // Un point « au repos » est un point où le thème redonne la valeur propre du point. La somme des huit points est toujours M16.
    var huitPoints = AXES.concat(AXES2).map(function (x) {
      var f = additionner(theme[x.entre[0]], theme[x.entre[1]]);
      return { point: x.point, maisons: x.entre, valeur: x.valeur, figure: f, auRepos: f === x.valeur };
    });
    var pointsAuRepos = huitPoints.filter(function (x) { return x.auRepos; });
    var sentencePole = theme[16] === R1.figure ? 'R1' : theme[16] === R7.figure ? 'R7' : null;
    // Poids des pôles en base : somme des forces de la figure du pôle dans toutes ses positions en base.
    // Sur les matchs réels où les pôles sont dans le même front ou la même boucle (8 matchs) : R1 plus lourd que R7, le match se décide ; sinon, nul.
    var poidsPoles = (function () {
      function poids(c) { return positions(c.figure).filter(function (x) { return x.couche === 'base'; }).reduce(function (t, x) { return t + (x.force === null ? 100 : x.force); }, 0); }
      var a = poids(R1), b = poids(R7);
      return { R1: a, R7: b, ecart: a - b, applicable: mode !== 'BOUCLES_DIFFERENTES', decide: a > b };
    })();
    // Multiplicité des pôles : nombre de positions de la figure du pôle dans le thème, base et résultante.
    // Sur les matchs réels décidés, le pôle le plus présent est le vainqueur 9 fois sur 10 quand les deux nombres diffèrent.
    var multiplicite = (function () {
      function compte(c) { var p = positions(c.figure); return { base: p.filter(function (x) { return x.couche === 'base'; }).length, total: p.length }; }
      var a = compte(R1), b = compte(R7);
      return { R1: a, R7: b, favori: a.total > b.total ? 'R1' : b.total > a.total ? 'R7' : null };
    })();
    // Figure du lien : la somme des deux pôles. Elle dit quel lien les unit (miroir : Tristitia ; même front : Albus ou Fortuna Major ; etc.).
    var lien = (function () {
      var f = additionner(R1.figure, R7.figure), pos = positions(f);
      var b = pos.filter(function (x) { return x.couche === 'base'; }).map(function (x) { return x.maison; }), r = pos.filter(function (x) { return x.couche !== 'base'; }).map(function (x) { return x.maison; });
      return { figure: f, numero: num(f), base: b, resultante: r, chezElle: chezElle(f), etat: b.length ? 'EN_BASE' : chezElle(f) ? 'CHEZ_ELLE_EN_RESULTANTE' : r.length ? 'RESULTANTE_SEULEMENT' : 'ABSENTE' };
    })();
    // Pour chaque combinaison : la somme des quatre maisons du thème, et où cette somme se trouve parmi ces mêmes maisons.
    var combinaisons = COMBIS.map(function (c) {
      var f = c.maisons.map(function (h) { return theme[h]; }).reduce(function (x, y) { return additionner(x, y); });
      return { famille: c.famille, nom: c.nom, maisons: c.maisons, origine: c.origine, somme: f,
        enBase: c.maisons.filter(function (h) { return maisons[h - 1].base === f; }), enResultante: c.maisons.filter(function (h) { return maisons[h - 1].resultante === f && maisons[h - 1].base !== f; }),
        ailleurs: positions(f).filter(function (x) { return c.maisons.indexOf(x.maison) < 0; }).map(function (x) { return x.maison; }) };
    });
    // But en première mi-temps : la somme de l'axe angulaire se retrouve dans une maison de l'axe ; sûr si elle est en M4 ou M10, en base ou en résultante.
    // Signal de but sur un axe de quatre maisons. Règle du propriétaire : dans toute maison de l'axe, la base compte ;
    // dans les deux maisons fortes (M4 et M10 pour l'axe angulaire), la résultante compte aussi. On regarde la somme de l'axe et les deux pôles.
    function butSur(c, fortes, nomAxe) {
      function compte(h, couche) { return couche === 'base' || fortes.indexOf(h) >= 0; }
      var ou = c.enBase.map(function (h) { return 'M' + h + ' (base)'; }).concat(c.enResultante.filter(function (h) { return compte(h, 'res'); }).map(function (h) { return 'M' + h + ' (résultante)'; }));
      var faibleSomme = c.enResultante.filter(function (h) { return !compte(h, 'res'); });
      var poles = [], faiblePoles = [];
      [R1, R7].forEach(function (p) { positions(p.figure).forEach(function (x) {
        if (c.maisons.indexOf(x.maison) < 0) return;
        var t = p.camp + ' ' + p.figure + ' en M' + x.maison + (x.couche === 'base' ? ' (base)' : ' (résultante)');
        (compte(x.maison, x.couche === 'base' ? 'base' : 'res') ? poles : faiblePoles).push(t);
      }); });
      var sur = ou.length + poles.length > 0, faible = faibleSomme.length + faiblePoles.length > 0, t = [];
      if (ou.length) t.push('la somme de ' + nomAxe + ' donne ' + c.somme + ', présente en ' + ou.join(' et '));
      if (poles.length) t.push('pôle sur l’axe : ' + poles.join(', '));
      var tf = [];
      if (faibleSomme.length) tf.push('la somme ' + c.somme + ' n’est qu’en résultante en M' + faibleSomme.join(', M'));
      if (faiblePoles.length) tf.push(faiblePoles.join(', '));
      return { maisons: c.maisons, fortes: fortes, somme: c.somme, enBase: c.enBase, enResultante: c.enResultante, poles: poles, niveau: sur ? 'SUR' : faible ? 'RESULTANTE' : 'AUCUN',
        texte: sur ? t.join(' ; ') : faible ? 'signal en résultante hors de M' + fortes.join(' et M') + ' : ' + tf.join(' ; ') : 'la somme de ' + nomAxe + ' donne ' + c.somme + ', absente de ses maisons ; aucun pôle sur l’axe' };
    }
    // Première mi-temps : l'axe angulaire 1-4-7-10, maisons fortes M4 et M10 (règle du propriétaire).
    var butMiTemps = butSur(combinaisons[0], [4, 10], 'l’axe angulaire');
    // Deuxième mi-temps (hypothèse à vérifier) : l'axe miroir 9-12-15-2, en face sur le cercle ; maisons fortes M12 et M2, miroirs de M4 et M10.
    var butMiTemps2 = butSur(combinaisons[2], [12, 2], 'l’axe miroir 9-12-15-2');
    var miroirPoints = (function () {
      function de(p) { return pointsCercle.filter(function (x) { return x.point === p; })[0]; }
      var D = de('D'), o = { nul: null, favori: null, texte: null };
      if (R1.miroir === R7.figure) return o;                         // pôles miroirs l'un de l'autre : le signal ne s'applique pas
      if (D.miroirDe) { o.nul = D; o.texte = 'la somme au point D (M4 + M5) donne ' + D.figure + ', le miroir de ' + D.miroirDe; return o; }
      if (mode !== 'BOUCLES_DIFFERENTES') return o;
      var bc = [de('B'), de('C')].filter(function (x) { return x.miroirDe; }), camps = {};
      bc.forEach(function (x) { camps[x.miroirDe] = true; });
      if (bc.length && Object.keys(camps).length === 1) { o.favori = bc[0].miroirDe; o.texte = 'la somme au point ' + bc[0].point + ' (M' + bc[0].maisons[0] + ' + M' + bc[0].maisons[1] + ') donne ' + bc[0].figure + ', le miroir de ' + o.favori; }
      return o;
    })();
    // Figures pénalisées : celles qui se trouvent dans la maison de leur antagoniste (base ou résultante).
    var penalisees = [];
    maisons.forEach(function (m) {
      if (enMaisonAntagoniste(m.base, m.maison)) penalisees.push({ figure: m.base, maison: m.maison, couche: 'base', antagoniste: fig(m.maison) });
      if (m.resultante && m.resultante !== m.base && enMaisonAntagoniste(m.resultante, m.maison)) penalisees.push({ figure: m.resultante, maison: m.maison, couche: 'résultante', antagoniste: fig(m.maison) });
    });
    // Chemin d'un pôle : ses figures, étape par étape, et qui tient leur maison de repos.
    function chemin(c, autre) {
      var n = num(c.figure), etapes;
      if (mode === 'BOUCLES_DIFFERENTES') etapes = [[0, 'Pôle'], [2, 'Binôme du pôle'], [4, 'Front direct'], [6, 'Binôme du front direct'], [8, 'Miroir'], [10, 'Binôme du miroir'], [12, 'Front du miroir'], [14, 'Binôme du front du miroir']];
      else if (mode === 'MEME_BOUCLE') etapes = [[0, 'Pôle'], [4, 'Front direct'], [8, 'Miroir'], [12, 'Front du miroir']];
      else etapes = [[0, 'Pôle'], [(n <= 8 ? (n <= 4 ? 4 : -4) : (n <= 12 ? 4 : -4)), 'Partenaire de moitié']];
      var miens = etapes.map(function (e) { return fig(n + e[0] + 16); });
      var na = num(autre.figure), siens;
      if (mode === 'BOUCLES_DIFFERENTES') siens = FIG.filter(function (f) { return num(f) % 2 === na % 2; });
      else if (mode === 'MEME_BOUCLE') siens = autre.frontDirect;
      else siens = [autre.figure, fig(na + (na <= 8 ? (na <= 4 ? 4 : -4) : (na <= 12 ? 4 : -4)))].filter(function (f) { return miens.indexOf(f) < 0; });
      function cote(f) { return !f ? null : miens.indexOf(f) >= 0 ? 'ALLIE' : siens.indexOf(f) >= 0 ? 'ADVERSAIRE' : 'NEUTRE'; }
      function annulee(f) { return annulations.some(function (x) { return x.attaquant === f || x.cible === f; }); }
      var l = [{ titre: 'Maison du pôle', figure: c.figure, maison: c.maison, etat: 'POLE', occupant: c.figure, coteOccupant: 'ALLIE',
        resultante: maisons[c.maison - 1].resultante, coteResultante: cote(maisons[c.maison - 1].resultante), positions: [] }];
      etapes.forEach(function (e) {
        var f = fig(n + e[0] + 16), h = num(f), m = maisons[h - 1], pos = positions(f), chez = chezElle(f);
        l.push({ titre: e[1], figure: f, maison: h, etat: chez ? 'CHEZ_ELLE' : pos.length ? 'AILLEURS' : 'ABSENTE',
          couche: chez ? (m.base === f ? 'base' : 'résultante') : null, penalisee: pos.filter(function (x) { return enMaisonAntagoniste(f, x.maison); }).map(function (x) { return x.maison; }), annulee: chez && annulee(f), positions: pos,
          occupant: m.base, coteOccupant: m.base === f ? 'ELLE' : cote(m.base), resultante: m.resultante, coteResultante: m.resultante === f ? 'ELLE' : cote(m.resultante) });
      });
      return l;
    }
    var confrontation = { mode: mode, R1: mode === 'BOUCLES_DIFFERENTES' ? paires(R1) : null, R7: mode === 'BOUCLES_DIFFERENTES' ? paires(R7) : null };
    return { chezElleEnBase: chezElleEnBase, absente: absente, enMaisonPaire: enMaisonPaire, enMaisonAntagoniste: enMaisonAntagoniste, penalisees: penalisees, combinaisons: combinaisons, butMiTemps: butMiTemps, butMiTemps2: butMiTemps2, poidsPoles: poidsPoles, multiplicite: multiplicite, lien: lien, huitPoints: huitPoints, pointsAuRepos: pointsAuRepos, sentencePole: sentencePole, pointsCercle: pointsCercle, miroirPoints: miroirPoints, cercle: cercle, binomeM1: binomeM1, sommes: sommes, annuleePar: annuleePar, stabilite: stabilite(), mode: mode, confrontation: confrontation, chemin: { R1: chemin(R1, R7), R7: chemin(R7, R1) },
      theme: theme, maisons: maisons, R1: R1, R7: R7, duels: duels, annulations: annulations,
      verrous: { R1: verrousDuFront(R1.front), R7: verrousDuFront(R7.front) },
      presentEn: presentEn, chezElle: chezElle, force: force, motif: motif, positions: positions };
  }

  // Témoin de validation du thème : quatre figures témoins qui doivent être présentes dans le thème
  // (en base ou en résultante) : somme de l'axe angulaire (M1, M4, M7, M10), binôme de M1,
  // figure du jour (jour de la semaine, de jour 6 h–18 h ou de nuit), somme des maisons 3, 5, 11, 15.
  var FIGURE_DU_JOUR = [
    { jour: 'Dimanche', diurne: 'Fortuna Major', nocturne: 'Fortuna Minor' }, { jour: 'Lundi', diurne: 'Populus', nocturne: 'Via' },
    { jour: 'Mardi', diurne: 'Puer', nocturne: 'Rubeus' }, { jour: 'Mercredi', diurne: 'Albus', nocturne: 'Conjunctio' },
    { jour: 'Jeudi', diurne: 'Aquisitio', nocturne: 'Laetitia' }, { jour: 'Vendredi', diurne: 'Puella', nocturne: 'Amissio' },
    { jour: 'Samedi', diurne: 'Tristitia', nocturne: 'Carcer' }];
  function figureDuJour(date) {
    var d = (date instanceof Date && !isNaN(date.getTime())) ? date : new Date();
    var j = FIGURE_DU_JOUR[d.getDay()], deJour = d.getHours() >= 6 && d.getHours() < 18;
    return { figure: deJour ? j.diurne : j.nocturne, jour: j.jour, moment: deJour ? 'jour' : 'nuit' };
  }
  function temoin(theme, date) {
    function somme(maisons) { return maisons.map(function (h) { return theme[h]; }).reduce(function (a, b) { return additionner(a, b); }); }
    function presence(f) {
      var base = [], res = [];
      for (var h = 1; h <= 16; h++) { if (theme[h] === f) base.push(h); if (h < 16 && additionner(theme[h], fig(h)) === f) res.push(h); }
      return { base: base, resultante: res, present: base.length > 0 };
    }
    var fdj = figureDuJour(date);
    var lignes = [
      { id: 'axeAngulaire', titre: 'Axe angulaire', detail: 'M1 + M4 + M7 + M10', figure: somme([1, 4, 7, 10]) },
      { id: 'binome', titre: 'Binôme de M1', detail: 'binôme de ' + theme[1], figure: fig(num(theme[1]) + 2) },
      { id: 'figureDuJour', titre: 'Figure du jour', detail: fdj.jour + ', de ' + fdj.moment, figure: fdj.figure },
      { id: 'somme35115', titre: 'Somme 3-5-11-15', detail: 'M3 + M5 + M11 + M15', figure: somme([3, 5, 11, 15]) }
    ];
    lignes.forEach(function (l) { var p = presence(l.figure); l.base = p.base; l.resultante = p.resultante; l.present = p.present; });
    return { lignes: lignes, presents: lignes.filter(function (l) { return l.present; }).length, valide: lignes.every(function (l) { return l.present; }) };
  }

  // ── Étage 2 : les cas ──────────────────────────────────────────────────
  // Un cas simple = { id, famille, titre, statut, enonce, condition(lecture) } : UNE condition, UN résultat.
  // La condition rend null, ou { verdict: '1' | '2' | 'N', assuree: bool, raison: texte }. Les cas sont lus dans l'ordre ; le premier qui s'applique tranche.
  // Les cas d'une même famille se suivent : chacun suppose que les précédents de sa famille ne se sont pas appliqués.
  function partenaireMoitie(f) { var n = num(f); return n <= 8 ? fig(n <= 4 ? n + 4 : n - 4) : fig(n <= 12 ? n + 4 : n - 4); }
  function N(raison) { return { verdict: 'N', assuree: false, raison: raison }; }
  function V(c, L, raison, assuree) { return { verdict: c === L.R1 ? '1' : '2', assuree: !!assuree, raison: raison }; }
  function meilleureForce(L, c) { var m = 0; L.positions(c.figure).forEach(function (x) { var f = x.force === null ? 100 : x.force; if (f > m) m = f; }); return m; }
  function forceChezSoi(L, c) { var f = L.force(c.figure, c.maison); return f === null ? 100 : f; }
  function attaquantDirect(L) { var d = ((num(L.R7.figure) - num(L.R1.figure)) % 16 + 16) % 16; return d === 3 ? L.R1 : d === 13 ? L.R7 : null; }
  function autrePole(L, c) { return c === L.R1 ? L.R7 : L.R1; }
  function ancresBoucle(L, c) { var n = num(c.figure); return FIG.filter(function (f) { return num(f) % 2 === n % 2 && L.chezElleEnBase(f) && !L.annuleePar(f); }); }
  function ditAncres(l) { return l.length ? l.map(function (f) { return f + ' en M' + num(f); }).join(', ') : 'aucun'; }
  function detailAncres(L) { return 'ancrages en base, non annulés : boucle de R1 ' + ditAncres(ancresBoucle(L, L.R1)) + ' ; boucle de R7 ' + ditAncres(ancresBoucle(L, L.R7)) + '.'; }
  // Paire du pôle (lui et son binôme) : figures chez elles, sans celles annulées par leur attaquant au repos ni les reflets.
  function paireDe(c) { return [c.figure, fig(num(c.figure) + 2)]; }
  function paireChezElle(L, c) {
    var adv = autrePole(L, c);
    return paireDe(c).filter(function (f) {
      var refletAdverse = !L.chezElleEnBase(f) && adv.figure === 'Populus' && L.maisons[num(f) - 1].base === 'Populus' && adv.maison === num(f);
      var refletPole = f === c.figure && f !== 'Populus' && !L.chezElleEnBase(f) && L.maisons[num(f) - 1].base === 'Populus';
      return L.chezElle(f) && !L.chezElle(fig(num(f) - 3 + 16)) && !refletAdverse && !refletPole;
    });
  }
  function poleVraimentChezLui(L, c) { var f = c.figure; return L.chezElle(f) && !L.annuleePar(f) && !(f !== 'Populus' && !L.chezElleEnBase(f) && L.maisons[num(f) - 1].base === 'Populus'); }

  var CAS = [
    // ───────── Famille « Même front » ─────────
    { id: 'MF-1', famille: 'Même front', titre: 'Les deux antagonistes chez eux', statut: 'EN_ESSAI',
      enonce: 'Pôles dans le même front, et l’antagoniste de chaque pôle est dans sa propre maison de repos : nul.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front || !(L.chezElle(L.R1.antagoniste) && L.chezElle(L.R7.antagoniste))) return null;
        return N('Nul : même front ' + L.R1.front + ', les deux pôles sont sous le contrôle de leur antagoniste, chacun dans sa maison de repos (' + L.R1.antagoniste + ' en M' + num(L.R1.antagoniste) + ', ' + L.R7.antagoniste + ' en M' + num(L.R7.antagoniste) + ').');
      } },
    { id: 'MF-2', famille: 'Même front', titre: 'Un seul antagoniste chez lui', statut: 'EN_ESSAI',
      enonce: 'Pôles dans le même front, et l’antagoniste d’un seul pôle est dans sa propre maison de repos : ce pôle est dominé, l’autre gagne, même entre miroirs.',
      condition: function (L) {
        var a1 = L.chezElle(L.R1.antagoniste), a7 = L.chezElle(L.R7.antagoniste);
        if (L.R1.front !== L.R7.front || a1 === a7) return null;
        var perd = a1 ? L.R1 : L.R7, gagne = a1 ? L.R7 : L.R1;
        function res(c) { var r = L.maisons[c.maison - 1].resultante; return r ? ' (résultante de M' + c.maison + ' : ' + r + ')' : ''; }
        return V(gagne, L, 'Victoire ' + gagne.camp + ' : même front ' + gagne.front + ', mais l’antagoniste de ' + perd.camp + ' ' + perd.figure + ', ' + perd.antagoniste + ', est chez lui en M' + num(perd.antagoniste) + ' ; celui de ' + gagne.figure + ' ne l’est pas. ' + gagne.camp + ' ' + gagne.figure + res(gagne) + ' ; ' + perd.camp + ' ' + perd.figure + res(perd) + '.');
      } },
    { id: 'MF-3', famille: 'Même front', titre: 'Même moitié du front', statut: 'REGLE_CONFIRMEE',
      enonce: 'Pôles dans le même front et dans la même moitié (A : 1-5 et 9-13 ; B : 2-6 et 10-14 ; C : 3-7 et 11-15 ; D : 4-8 et 12-16) : nul.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front || !(L.R1.figure === L.R7.figure || partenaireMoitie(L.R1.figure) === L.R7.figure)) return null;
        return N('Nul : R1 ' + L.R1.figure + ' et R7 ' + L.R7.figure + ' sont dans la même moitié du front ' + L.R1.front + '.');
      } },
    { id: 'MF-4', famille: 'Même front', titre: 'Un seul partenaire de moitié chez lui', statut: 'REGLE_CONFIRMEE',
      enonce: 'Pôles dans le même front, moitiés différentes, et un seul pôle a son partenaire de moitié dans sa maison de repos (base ou résultante) : ce pôle gagne.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front) return null;
        var p1 = partenaireMoitie(L.R1.figure), p7 = partenaireMoitie(L.R7.figure), a = L.chezElle(p1), b = L.chezElle(p7);
        if (a === b) return null;
        var g = a ? L.R1 : L.R7, pg = a ? p1 : p7;
        return V(g, L, 'Victoire ' + g.camp + ' : même front ' + g.front + ', et seul le partenaire de ' + g.figure + ', ' + pg + ', est dans sa maison de repos (M' + num(pg) + ').');
      } },
    { id: 'MF-5', famille: 'Même front', titre: 'Même front, partenaires à égalité', statut: 'REGLE_CONFIRMEE',
      enonce: 'Pôles dans le même front, et les deux partenaires de moitié sont chez eux, ou aucun : nul.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front) return null;
        var p1 = partenaireMoitie(L.R1.figure), p7 = partenaireMoitie(L.R7.figure);
        return N('Nul : même front ' + L.R1.front + ', ' + (L.chezElle(p1) ? 'les deux partenaires (' + p1 + ' et ' + p7 + ') sont dans leur maison de repos.' : 'aucun des deux partenaires (' + p1 + ', ' + p7 + ') n’est dans sa maison de repos.'));
      } },
    // ───────── Famille « Pôle sans force » ─────────
    { id: 'PF-1', famille: 'Pôle sans force', titre: 'Pôle éteint', statut: 'EN_ESSAI',
      enonce: 'Un seul des deux pôles est éteint (sa figure ne dépasse 1 % dans aucune position) : l’autre gagne.',
      condition: function (L) {
        var m1 = meilleureForce(L, L.R1), m7 = meilleureForce(L, L.R7);
        if ((m1 <= 1) === (m7 <= 1)) return null;
        var e = m1 <= 1 ? L.R1 : L.R7, v = m1 <= 1 ? L.R7 : L.R1;
        return V(v, L, 'Victoire ' + v.camp + ' : le pôle ' + e.camp + ', ' + e.figure + ', est éteint (au plus 1 % dans toutes ses positions : ' + L.positions(e.figure).map(function (x) { return 'M' + x.maison; }).join(', ') + '). ' + v.figure + ' atteint ' + (v === L.R1 ? m1 : m7) + ' %.');
      } },
    { id: 'PF-2', famille: 'Pôle sans force', titre: 'Attaque directe sur un pôle sans défense', statut: 'EN_ESSAI',
      enonce: 'Un pôle attaque l’autre directement ; l’attaqué n’a que 1 % ou moins dans sa maison de pôle et l’attaquant tient la sienne à plus de 1 % : l’attaquant gagne.',
      condition: function (L) {
        var att = attaquantDirect(L); if (!att) return null;
        var cible = autrePole(L, att);
        if (!(forceChezSoi(L, cible) <= 1 && forceChezSoi(L, att) > 1)) return null;
        return V(att, L, 'Victoire ' + att.camp + ' : ' + att.figure + ' attaque directement ' + cible.figure + ', qui n’a que ' + forceChezSoi(L, cible) + ' % dans sa maison M' + cible.maison + ' ; ' + att.figure + ' tient la sienne (M' + att.maison + ') à ' + forceChezSoi(L, att) + ' %.');
      } },
    { id: 'PF-3', famille: 'Pôle sans force', titre: 'Pôle dans la maison de son antagoniste', statut: 'EN_ESSAI',
      enonce: 'Un seul pôle est dans la maison de son antagoniste (0 %) sans être fort ailleurs en base (au moins 70 %) : l’autre gagne.',
      condition: function (L) {
        function pen(c) { return L.enMaisonAntagoniste(c.figure, c.maison) && !L.positions(c.figure).some(function (x) { return x.couche === 'base' && x.maison !== c.maison && (x.force === null || x.force >= 70); }); }
        var a = pen(L.R1), b = pen(L.R7);
        if (a === b) return null;
        var p = a ? L.R1 : L.R7, g = a ? L.R7 : L.R1;
        return V(g, L, 'Victoire ' + g.camp + ' : le pôle ' + p.camp + ', ' + p.figure + ', est en M' + p.maison + ', la maison de son antagoniste ' + fig(p.maison) + ' (0 %, pénalisé). ' + g.figure + ' n’est pas pénalisé.');
      } },
    // ───────── Famille « Pôles sur l'axe » ─────────
    { id: 'AX-1', famille: 'Pôles sur l’axe', titre: 'Pôles en M4 et M10 : le pôle de M4 engendre l’autre', statut: 'EN_ESSAI',
      enonce: 'Les pôles sont en M4 et M10 (Albus en M1). M10 est la somme de M3 et M4 : le pôle de M4 engendre celui de M10. Le pôle de M4 gagne, sauf si le pôle de M10 l’attaque directement.',
      condition: function (L) {
        var m4 = L.R1.maison === 4 && L.R7.maison === 10 ? L.R1 : L.R7.maison === 4 && L.R1.maison === 10 ? L.R7 : null;
        if (!m4) return null;
        var m10 = autrePole(L, m4);
        if (attaquantDirect(L) === m10) return null;
        return V(m4, L, 'Victoire ' + m4.camp + ' : les pôles sont en M4 et M10. ' + m4.figure + ', en M4, engendre ' + m10.figure + ' en M10 (M10 = M3 + M4, avec ' + L.maisons[2].base + ' en M3), et ' + m10.figure + ' ne l’attaque pas directement.');
      } },
    // ───────── Famille « Repos annulés » ─────────
    { id: 'RA-1', famille: 'Repos annulés', titre: 'Toutes les figures au repos sont annulées', statut: 'EN_ESSAI',
      enonce: 'Le thème a des figures dans leur maison de repos, mais chacune est annulée (son attaquant est aussi au repos, ou il est deux fois en base hors positions à 1 % ou 0 %) : nul.',
      condition: function (L) {
        var repos = FIG.filter(function (f) { return L.chezElle(f); });
        if (!repos.length) return null;
        var motifs = [];
        for (var i = 0; i < repos.length; i++) { var a = L.annuleePar(repos[i]); if (!a) return null; motifs.push(repos[i] + ' (M' + num(repos[i]) + ') est annulée par ' + a.attaquant + (a.motif === 'ATTAQUANT_AU_REPOS' ? ', elle aussi au repos' : ', ' + a.maisons.length + ' fois en base (M' + a.maisons.join(', M') + ')')); }
        return N('Nul : toutes les figures au repos sont annulées. ' + motifs.join(' ; ') + '.');
      } },
    // ───────── Conditions du propriétaire, pas encore vérifiées sur un match réel (une famille chacune) ─────────
    { id: 'PR-1', famille: 'Verrou de front', titre: 'Verrou de front', statut: 'EN_ESSAI',
      enonce: 'Deux figures du front d’un pôle sont en base, chacune dans sa maison de repos à 100 %, et l’autre pôle n’a pas de verrou : ce pôle gagne.',
      condition: function (L) {
        var a = L.verrous.R1.length > 0, b = L.verrous.R7.length > 0;
        if (a === b) return null;
        var k = a ? 'R1' : 'R7', v = L.verrous[k][0];
        return V(L[k], L, 'Victoire ' + k + ' : verrou du front ' + v.front + ', ' + v.figures[0] + ' en M' + v.maisons[0] + ' et ' + v.figures[1] + ' en M' + v.maisons[1] + ', chacune dans sa maison de repos.');
      } },
    { id: 'PR-2', famille: 'Pôle et front au repos', titre: 'Pôle et son front au repos, autres en maisons paires', statut: 'EN_ESSAI',
      enonce: 'Un seul pôle remplit ceci : il est chez lui en base, son antagoniste non ; son front direct est chez lui, l’antagoniste de ce front non ; les deux autres figures du front occupent des maisons paires. Ce pôle gagne.',
      condition: function (L) {
        function ok(c) { var n = num(c.figure); return L.chezElleEnBase(c.figure) && !L.chezElle(fig(n - 3)) && L.chezElle(fig(n + 4)) && !L.chezElle(fig(n + 1)) && L.enMaisonPaire(fig(n + 8)) && L.enMaisonPaire(fig(n + 12)); }
        return unSeul(L, ok, function (c) { return c.figure + ' est dans sa maison de repos, son front ' + fig(num(c.figure) + 4) + ' aussi, sans antagoniste au repos ; ' + fig(num(c.figure) + 8) + ' et ' + fig(num(c.figure) + 12) + ' occupent des maisons paires.'; });
      } },
    { id: 'PR-3', famille: 'Attaquant en M8', titre: 'Pôle attaquant en M8 avec un front en M4 ou M12', statut: 'EN_ESSAI',
      enonce: 'Un seul pôle remplit ceci : il attaque l’autre directement, il est en M8, et une autre figure de son front est en M4 ou M12. Ce pôle gagne.',
      condition: function (L) {
        function ok(c, autre) { var n = num(c.figure); return num(autre.figure) === num(fig(n + 3)) && L.maisons[7].base === c.figure && [fig(n + 4), fig(n + 8), fig(n + 12)].some(function (f) { return L.presentEn(f, 4) || L.presentEn(f, 12); }); }
        return unSeul(L, ok, function (c, autre) { return c.figure + ' attaque directement ' + autre.figure + ', il est en M8 et une figure de son front est en M4 ou M12.'; });
      } },
    { id: 'PR-4', famille: 'Pôle chez son antagoniste', titre: 'Pôle chez son antagoniste, front incomplet', statut: 'EN_ESSAI',
      enonce: 'Un pôle est dans la maison de son antagoniste direct, son front direct ou le front de son miroir est absent, et l’adversaire a une figure de son front en maison paire (M4 ou M12 si son front est Terre ou Eau) : l’adversaire gagne.',
      condition: function (L) {
        function ok(c, autre) {
          var n = num(autre.figure), chezAntagoniste = L.maisons[num(fig(n - 3)) - 1].base === autre.figure;
          if (!chezAntagoniste || !(L.absente(fig(n + 4)) || L.absente(fig(n + 12)))) return false;
          var exigeM4M12 = c.element === 'Terre' || c.element === 'Eau';
          return c.frontDirect.some(function (f) { return exigeM4M12 ? (L.presentEn(f, 4) || L.presentEn(f, 12)) : L.enMaisonPaire(f); });
        }
        return unSeul(L, ok, function (c, autre) { return autre.figure + ' est dans la maison de son antagoniste ' + fig(num(autre.figure) - 3) + ' et son front est incomplet ; le front de ' + c.figure + ' tient ' + (c.element === 'Terre' || c.element === 'Eau' ? 'M4 ou M12' : 'une maison paire') + '.'; });
      } },
    { id: 'PR-5', famille: 'Attaqué sans front direct', titre: 'Pôle attaqué sans front direct', statut: 'EN_ESSAI',
      enonce: 'Un pôle attaque l’autre directement, et le pôle attaqué n’a pas son front direct dans le thème : le pôle attaqué perd.',
      condition: function (L) {
        function ok(c, autre) { return num(autre.figure) === num(fig(num(c.figure) + 3)) && L.absente(fig(num(autre.figure) + 4)); }
        return unSeul(L, ok, function (c, autre) { return c.figure + ' attaque directement ' + autre.figure + ', dont le front direct ' + fig(num(autre.figure) + 4) + ' est absent du thème.'; });
      } },
    // ───────── Famille « Pôle chez lui » ─────────
    { id: 'CL-1', famille: 'Pôle chez lui', titre: 'Même boucle : un seul pôle chez lui', statut: 'EN_ESSAI',
      enonce: 'Pôles dans la même boucle, fronts différents. Un seul pôle est dans sa maison de repos (non annulé, pas un simple reflet de Populus) : il gagne.',
      condition: function (L) {
        if (L.mode !== 'MEME_BOUCLE') return null;
        var h1 = poleVraimentChezLui(L, L.R1), h7 = poleVraimentChezLui(L, L.R7);
        if (h1 === h7) return null;
        var gg = h1 ? L.R1 : L.R7, pp = h1 ? L.R7 : L.R1;
        return V(gg, L, 'Victoire ' + gg.camp + ' : même boucle, ' + gg.figure + ' est dans sa maison de repos M' + num(gg.figure) + (L.chezElleEnBase(gg.figure) ? ' en base' : ' en résultante') + ' ; ' + pp.figure + ' (' + pp.camp + ') n’est pas chez lui.');
      } },
    { id: 'CL-2', famille: 'Pôle chez lui', titre: 'Boucles différentes : le pôle et son binôme', statut: 'EN_ESSAI',
      enonce: 'Pôles dans des boucles différentes. On compare R1 et son binôme à R7 et son binôme : la paire qui a le plus de figures chez elles (sans les figures annulées ni les reflets) gagne. La victoire est « assurée » si une figure somme du vainqueur est sur l’axe angulaire en base, sans somme adverse sur l’axe ni somme égale à un pôle.',
      condition: function (L) {
        if (L.mode !== 'BOUCLES_DIFFERENTES') return null;
        var a = paireChezElle(L, L.R1), b = paireChezElle(L, L.R7);
        if (a.length === b.length) return null;
        var g = a.length > b.length ? L.R1 : L.R7, p = autrePole(L, g), cg = g === L.R1 ? a : b, cp = g === L.R1 ? b : a;
        var sa = L.sommes.filter(function (x) { return x.camp === g.camp && x.surAxe.length; })[0], sp = L.sommes.some(function (x) { return x.camp === p.camp && x.surAxe.length; }) || L.sommes.some(function (x) { return x.pole; });
        var sure = !!sa && !sp;
        return V(g, L, 'Victoire ' + g.camp + (sure ? ' assurée' : '') + ' : boucles différentes, paire ' + paireDe(g).join(' + ') + ' contre ' + paireDe(p).join(' + ') + '. ' +
          cg.map(function (f) { return f + ' en M' + num(f); }).join(' et ') + (cg.length > 1 ? ' sont dans leur maison de repos' : ' est dans sa maison de repos') + ' ; en face, ' + (cp.length ? 'seulement ' + cp.join(', ') : 'aucune') + '.' + (sure ? ' De plus, ' + sa.figure + ', ' + sa.nom + ', est sur l’axe angulaire en base (M' + sa.surAxe.join(', M') + ') et appartient au camp de ' + g.camp + '.' : ''), sure);
      } },
    { id: 'PR-6', famille: 'Front Sud ou Nord au repos', titre: 'Front Sud ou Nord du pôle dans sa maison de repos', statut: 'EN_ESSAI',
      enonce: 'Pôles dans la même boucle ou le même front. Un seul pôle a une figure Sud ou Nord de son front (autre que lui) dans sa maison de repos, reflets de Populus exclus : ce pôle gagne.',
      condition: function (L) {
        if (L.mode === 'BOUCLES_DIFFERENTES') return null;
        function auRepos(c) { return c.frontDirect.filter(function (f) { var pt = CARDINAL[num(f)]; return f !== c.figure && (pt === 'Sud' || pt === 'Nord') && L.chezElle(f) && !(!L.chezElleEnBase(f) && L.maisons[num(f) - 1].base === 'Populus' && c.front !== 'D'); }); }
        return unSeul(L, function (c) { return auRepos(c).length > 0; }, function (c) { var f = auRepos(c)[0]; return f + ' (front ' + c.front + ' · ' + CARDINAL[num(f)] + ' de ' + c.figure + ') est dans sa maison de repos M' + num(f) + '.'; });
      } },
    // ───────── Famille « Dernier recours » : lue quand rien d'autre n'a tranché ─────────
    { id: 'DR-1', famille: 'Dernier recours', titre: 'L’axe angulaire désigne un pôle', statut: 'EN_ESSAI',
      enonce: 'La somme de l’axe angulaire (M1+M4+M7+M10) est un pôle qui siège lui-même en M1, M4, M7 ou M10 : ce pôle gagne.',
      condition: function (L) {
        var ax = L.sommes[0]; if (!ax.pole) return null;
        var cp = L[ax.pole], autre = autrePole(L, cp);
        if (!((cp.maison === 1 || cp.maison === 4 || cp.maison === 7 || cp.maison === 10) && autre.figure !== L.sommes[1].figure)) return null;
        var rr = L.maisons[cp.maison - 1].resultante, fr = cp.frontDirect.filter(function (f) { return f !== cp.figure && !L.absente(f); });
        return V(cp, L, 'Victoire ' + ax.pole + ' : la somme de l’axe angulaire donne ' + ax.figure + ', le pôle ' + ax.pole + ', qui siège lui-même sur l’axe en M' + cp.maison + '. L’axe désigne ce pôle.' +
          (rr ? ' En M' + cp.maison + ' il donne ' + rr + ' en résultante.' : '') + (fr.length ? ' Son front est présent : ' + fr.join(', ') + '.' : ''));
      } },
    { id: 'DR-2', famille: 'Dernier recours', titre: 'Une figure somme est un pôle', statut: 'EN_ESSAI',
      enonce: 'La somme de l’axe angulaire ou la somme 3-5-11-15 est elle-même un pôle : le thème se referme sur ce pôle, nul.',
      condition: function (L) {
        var sp = L.sommes.filter(function (x) { return x.pole; }); if (!sp.length) return null;
        return N('Nul : ' + sp.map(function (x) { return 'la ' + x.nom + ' donne ' + x.figure + ', qui est le pôle ' + x.pole; }).join(' ; ') + '. Le thème se referme sur ce pôle.');
      } },
    { id: 'DR-3', famille: 'Dernier recours', titre: 'Le miroir d’un pôle au point D', statut: 'EN_ESSAI',
      enonce: 'La somme au point D du cercle (M4 + M5) est le miroir d’un pôle : nul.',
      condition: function (L) { return L.miroirPoints.nul ? N('Nul : ' + L.miroirPoints.texte + '. Au point D, le miroir tient le thème en équilibre.') : null; } },
    { id: 'DR-4', famille: 'Dernier recours', titre: 'Même boucle : antagoniste de l’antagoniste', statut: 'EN_ESSAI',
      enonce: 'Pôles dans la même boucle, à six figures d’écart (l’un attaque une figure qui attaque l’autre) : nul.',
      condition: function (L) {
        if (L.mode === 'BOUCLES_DIFFERENTES') return null;
        var d = ((num(L.R7.figure) - num(L.R1.figure)) % 16 + 16) % 16; if (d !== 6 && d !== 10) return null;
        var haut = d === 6 ? L.R1 : L.R7, bas = d === 6 ? L.R7 : L.R1, med = fig(num(haut.figure) + 3), pm = L.positions(med);
        var repos = [L.R1, L.R7].filter(function (c) { return L.chezElle(c.figure); }).map(function (c) { return c.camp; });
        return N('Nul, les ancrages s’équilibrent : ' + haut.camp + ' ' + haut.figure + ' attaque ' + med + ', qui attaque ' + bas.camp + ' ' + bas.figure + '. Chaque pôle est l’antagoniste de l’antagoniste de l’autre (' + med + (pm.length ? ' en M' + pm.map(function (x) { return x.maison; }).join(', M') : ' absent du thème') + ').' +
          (repos.length === 2 ? ' Les deux pôles sont chacun dans leur maison de repos.' : repos.length === 1 ? ' Seul ' + repos[0] + ' est dans sa maison de repos.' : ''));
      } },
    { id: 'DR-5', famille: 'Dernier recours', titre: 'Même boucle : pôles binômes', statut: 'EN_ESSAI',
      enonce: 'Pôles dans la même boucle, et rien ne les a départagés : nul.',
      condition: function (L) {
        if (L.mode === 'BOUCLES_DIFFERENTES') return null;
        return N('Nul, les ancrages s’équilibrent : les deux pôles sont dans la même boucle, ' + L.R1.figure + ' et ' + L.R7.figure + ' sont binômes, et aucun cas ne les départage.');
      } },
    { id: 'DR-6', famille: 'Dernier recours', titre: 'La boucle la mieux ancrée', statut: 'EN_ESSAI',
      enonce: 'Boucles différentes. Une boucle a plus de figures chez elles en base (non annulées) que l’autre : son pôle gagne.',
      condition: function (L) {
        var a = ancresBoucle(L, L.R1), b = ancresBoucle(L, L.R7);
        if (a.length === b.length) return null;
        return V(a.length > b.length ? L.R1 : L.R7, L, 'Victoire ' + (a.length > b.length ? 'R1' : 'R7') + ' : ' + detailAncres(L));
      } },
    { id: 'DR-7', famille: 'Dernier recours', titre: 'Le miroir d’un pôle au point B ou C', statut: 'EN_ESSAI',
      enonce: 'Boucles différentes, ancrages égaux. La somme au point B (M8 + M9) ou C (M12 + M13) est le miroir d’un seul pôle : ce pôle gagne.',
      condition: function (L) { return L.miroirPoints.favori ? V(L[L.miroirPoints.favori], L, 'Victoire ' + L.miroirPoints.favori + ' : ancrages égaux, et ' + L.miroirPoints.texte + '.') : null; } },
    { id: 'DR-8', famille: 'Dernier recours', titre: 'Le favori du cercle', statut: 'EN_ESSAI',
      enonce: 'Boucles différentes, ancrages égaux. Les signaux du cercle (pôle au bord d’un point, pôle en amont) désignent un seul pôle : il gagne.',
      condition: function (L) { var ce = L.cercle; return ce.favori ? V(L[ce.favori], L, 'Victoire ' + ce.favori + ' par le cercle : ancrages égaux, et ' + ce.signaux.join(' ; ') + '.') : null; } },
    { id: 'DR-9', famille: 'Dernier recours', titre: 'Le cercle se contredit', statut: 'EN_ESSAI',
      enonce: 'Boucles différentes, ancrages égaux, et les deux signaux du cercle désignent des pôles différents : nul.',
      condition: function (L) { var ce = L.cercle; return ce.conflit ? N('Nul : ancrages égaux, et le cercle se contredit (' + ce.signaux.join(' ; ') + ').') : null; } },
    { id: 'DR-10', famille: 'Dernier recours', titre: 'Équilibre des ancrages', statut: 'EN_ESSAI',
      enonce: 'Rien ne départage les deux pôles : les ancrages s’équilibrent, nul.',
      condition: function (L) { return N('Nul, les ancrages s’équilibrent : ' + detailAncres(L)); } }
  ];
  // Applique une condition aux deux pôles ; tranche seulement si un seul des deux la remplit.
  function unSeul(L, ok, pourquoi) {
    var a = ok(L.R1, L.R7), b = ok(L.R7, L.R1);
    if (a === b) return null;
    var g = a ? L.R1 : L.R7, p = a ? L.R7 : L.R1;
    return { verdict: a ? '1' : '2', assuree: false, raison: 'Victoire ' + g.camp + ' : ' + pourquoi(g, p) };
  }

  function theme16(L) { return L.maisons[15].base; }
  function analyser(theme, polesForces, sansVerification) {
    var L = lire(theme, polesForces || undefined), decision = null;
    // Signaux de camp : ancrages, pôle désigné par l'axe angulaire, miroir aux points du cercle, favori du cercle.
    var axP = L.sommes[0].pole && [1, 4, 7, 10].indexOf(L[L.sommes[0].pole].maison) >= 0 ? L.sommes[0].pole : null;
    var campSig = [['ancrages', L.stabilite.plusStable], ['axe angulaire', axP], ['miroir aux points', L.miroirPoints.favori], ['cercle', L.cercle.favori]].filter(function (x) { return x[1]; });
    var ecartes = [];
    var famillesEcartees = {};
    for (var i = 0; i < CAS.length && !decision; i++) {
      if (famillesEcartees[CAS[i].famille]) continue;      // un cas écarté pour incohérence écarte le reste de sa famille
      var r = CAS[i].condition(L);
      if (!r) continue;
      // Cohérence : un cas ne peut pas donner la victoire à un pôle quand au moins deux signaux de camp désignent l'autre et qu'aucun ne le désigne.
      if (r.verdict === '1' || r.verdict === '2') {
        var g = r.verdict === '1' ? 'R1' : 'R7', pour = campSig.filter(function (x) { return x[1] === g; }), contre = campSig.filter(function (x) { return x[1] !== g; });
        if (contre.length >= 2 && !pour.length) { ecartes.push({ cas: CAS[i].id, verdict: r.verdict, contre: contre.map(function (x) { return x[0]; }) }); famillesEcartees[CAS[i].famille] = true; continue; }
      }
      decision = { verdict: r.verdict, statut: CAS[i].statut, phase: CAS[i].id, famille: CAS[i].famille, regle: CAS[i].titre, raison: r.raison, victoireAssuree: !!r.assuree };
    }
    if (decision) decision.casEcartes = ecartes;
    if (!decision) decision = { verdict: null, statut: 'AUCUN_CAS', phase: 'AUCUN_CAS', regle: null, victoireAssuree: false,
      raison: 'Aucun cas défini ne s’applique à ce thème. Le moteur ne donne pas de verdict.' };
    // Déséquilibre fort (au moins deux ancrages d'écart) : « 12 » (pas de nul) et double chance pour le camp le plus stable.
    var st = L.stabilite;
    // Toujours renseigné : écart nul = équilibre ; écart de 1 = double chance du camp le plus stable ; écart de 2 ou plus = « 12 » en plus.
    // « 12 » (pas de nul) : on réunit les signaux tirés des matchs réels. Double chance : le camp que le verdict ou la stabilité désigne.
    var sig = [];
    if (st.fort) sig.push('écart d’ancrages de ' + st.ecart + ' (' + st.R1.length + ' pour R1, ' + st.R7.length + ' pour R7)');
    var resR1 = null, resR7 = null;
    if (L.mode === 'BOUCLES_DIFFERENTES') {
      var par = num(L.R1.figure) % 2;
      resR1 = L.maisons.filter(function (m) { return m.resultante && num(m.resultante) % 2 === par; }).length; resR7 = 15 - resR1;
      if (resR7 > resR1) sig.push('majorité des résultantes dans la boucle de R7 (' + resR7 + ' contre ' + resR1 + ')');
    }
    var ax = L.sommes[0], axePole = ax.pole && [1, 4, 7, 10].indexOf(L[ax.pole].maison) >= 0 ? ax.pole : null;
    if (axePole) sig.push('la somme de l’axe angulaire est le pôle ' + axePole + ', qui siège sur l’axe');
    // Les deux pôles sur l'axe angulaire (M1 et M7, ou M4 et M10) : le match se décide (3 matchs réels sur 3).
    var polesSurAxe = [1, 4, 7, 10].indexOf(L.R1.maison) >= 0 && [1, 4, 7, 10].indexOf(L.R7.maison) >= 0;
    if (polesSurAxe) sig.push('les deux pôles sont sur l’axe angulaire (M' + L.R1.maison + ' et M' + L.R7.maison + ')');
    var nulProbable = [];
    if (L.poidsPoles.applicable) {
      if (L.poidsPoles.decide) sig.push('le pôle R1 pèse plus en base que le pôle R7 (' + L.poidsPoles.R1 + ' contre ' + L.poidsPoles.R7 + ')');
      else nulProbable.push('le pôle R1 ne pèse pas plus en base que le pôle R7 (' + L.poidsPoles.R1 + ' contre ' + L.poidsPoles.R7 + ')');
    }
    if (resR1 !== null && resR1 > resR7) nulProbable.push('majorité des résultantes dans la boucle de R1 (' + resR1 + ' contre ' + resR7 + ')');
    if (!axePole && L.sommes.some(function (x) { return x.pole; })) nulProbable.push('une figure somme est un pôle');
    // La somme de l'axe angulaire est le pôle R7 : vers le nul (4 matchs réels sur 5).
    if (!axePole && L.sommes[0].pole === 'R7') nulProbable.push('la somme de l’axe angulaire donne ' + L.sommes[0].figure + ', le pôle R7');
    if (L.miroirPoints.nul) nulProbable.push(L.miroirPoints.texte);
    if (L.pointsAuRepos.length) nulProbable.push(L.pointsAuRepos.map(function (x) { return 'le point ' + (x.point.length === 1 ? x.point : 'entre ' + x.maisons[0] + ' et ' + x.maisons[1]) + ' est au repos (M' + x.maisons[0] + ' + M' + x.maisons[1] + ' redonne ' + x.valeur + ')'; }).join(' ; '));
    if (L.sentencePole) nulProbable.push('M16, somme des huit points, porte ' + theme16(L) + ', le pôle ' + L.sentencePole);
    var campDC = decision.verdict === '1' ? 'R1' : decision.verdict === '2' ? 'R7' : (axePole || st.plusStable || L.miroirPoints.favori || L.cercle.favori || L.multiplicite.favori);
    decision.marches = { ancragesR1: st.R1.length, ancragesR7: st.R7.length, ecart: st.ecart, resultantesR1: resR1, resultantesR7: resR7,
      poidsPoles: L.poidsPoles, multiplicite: L.multiplicite, lien: L.lien, cercle: L.cercle, miroirPoints: L.miroirPoints, douze: sig.length > 0, signaux12: sig, signauxNul: nulProbable, renforce: sig.length >= 2,
      camp: campDC, doubleChance: campDC === 'R1' ? '1X' : campDC === 'R7' ? 'X2' : null,
      conflit: (sig.length > 0 && decision.verdict === 'N') || (sig.length > 0 && nulProbable.length > 0),
      niveau: sig.length >= 2 ? 'FORT' : sig.length === 1 ? 'SIMPLE' : campDC ? 'LEGER' : 'EQUILIBRE' };
    // Précision du verdict. Les signaux sont classés d'après les 20 matchs réels :
    //  fiables (jamais pris en défaut) : résultantes, miroir au point D, ancrages, bord du cercle, miroir aux points B et C ;
    //  faibles (déjà vus du mauvais côté) : somme égale à un pôle, point au repos, M16 porteur d'un pôle, amont, figure du lien.
    (function () {
      var m = decision.marches, pour = [], contre = [], indices = [], v = decision.verdict, g = v === '1' ? 'R1' : v === '2' ? 'R7' : null;
      var nulFiables = [], nulFaibles = [];
      if (m.resultantesR1 !== null && m.resultantesR1 > m.resultantesR7) nulFaibles.push('majorité des résultantes dans la boucle de R1 (' + m.resultantesR1 + ' contre ' + m.resultantesR7 + ')');
      if (L.miroirPoints.nul) nulFiables.push(L.miroirPoints.texte);
      if (L.poidsPoles.applicable && !L.poidsPoles.decide) nulFiables.push('le pôle R1 ne pèse pas plus en base que le pôle R7 (' + L.poidsPoles.R1 + ' contre ' + L.poidsPoles.R7 + ')');
      if (!axePole && L.sommes.some(function (x) { return x.pole; })) nulFaibles.push('une figure somme est un pôle');
      if (L.pointsAuRepos.length) nulFaibles.push('un point du cercle est au repos');
      if (L.sentencePole) nulFaibles.push('M16 porte le pôle ' + L.sentencePole);
      if (!axePole && L.sommes[0].pole === 'R7') nulFaibles.push('la somme de l’axe angulaire est le pôle R7');
      function camp(nom, c) { if (!c) return; (c === g ? pour : contre).push(nom + ' pour ' + c); }
      if (g) {
        m.signaux12.forEach(function (x) { pour.push('pas de nul : ' + x); });
        nulFiables.forEach(function (x) { contre.push('vers le nul : ' + x); });
        nulFaibles.forEach(function (x) { indices.push('vers le nul : ' + x); });
        if (st.plusStable) (st.plusStable === g ? pour : indices).push('ancrages pour ' + st.plusStable);   // pris en défaut une fois (4·16·1·2) : ne compte plus contre
        camp('bord du cercle', L.cercle.favoriBord); camp('miroir aux points', L.miroirPoints.favori);
        if (L.cercle.amont) (L.cercle.amont === g ? pour : indices).push('amont pour ' + L.cercle.amont);
        if (L.multiplicite.favori) (L.multiplicite.favori === g ? pour : indices).push('multiplicité du pôle pour ' + L.multiplicite.favori);
        if (L.lien.etat === 'RESULTANTE_SEULEMENT' && L.mode === 'BOUCLES_DIFFERENTES') indices.push('figure du lien en résultante seulement');
      } else if (v === 'N') {
        nulFiables.concat(nulFaibles).forEach(function (x) { pour.push(x); });
        m.signaux12.forEach(function (x) { contre.push('pas de nul : ' + x); });
        if (st.plusStable) indices.push('ancrages pour ' + st.plusStable);
        if (L.cercle.favoriBord) indices.push('bord du cercle pour ' + L.cercle.favoriBord);
        if (L.multiplicite.favori) indices.push('multiplicité du pôle pour ' + L.multiplicite.favori);
      }
      var niveau = !pour.length && !contre.length ? 'SANS_SIGNAL' : !contre.length ? (pour.length >= 2 ? 'FORTE' : 'MOYENNE') : pour.length > contre.length ? 'DISCUTEE' : 'CONTREDITE';
      decision.precision = { niveau: niveau, pour: pour, contre: contre, indices: indices };
    })();
    decision.butMiTemps = L.butMiTemps; decision.butMiTemps2 = L.butMiTemps2;
    decision.parlant = L.binomeM1.parlant;
    // Thème de vérification : les quatre maisons de l'axe angulaire (M1, M4, M7, M10) prises comme quatre mères d'un second thème.
    // Il est seulement construit et lu ; il ne décide rien dans le thème principal.
    if (!sansVerification) {
      var mv = [theme[1], theme[4], theme[7], theme[10]], tv = construireTheme(mv[0], mv[1], mv[2], mv[3]), av = analyser(tv, null, true);
      var Lv = av.lecture;
      // Validation : ce que devient, dans le thème de vérification, chaque figure qui est dans sa maison de repos dans le thème principal, et chaque pôle.
      function etatVerif(f) {
        var p = Lv.positions(f), b = p.filter(function (x) { return x.couche === 'base'; });
        return { positions: p.map(function (x) { return { maison: x.maison, couche: x.couche === 'base' ? 'base' : 'résultante' }; }),
          etat: Lv.chezElle(f) ? 'AU_REPOS' : b.length ? 'EN_BASE' : p.length ? 'RESULTANTE' : 'ABSENTE' };
      }
      function campDe(f) {
        if (f === L.R1.figure) return 'pôle R1'; if (f === L.R7.figure) return 'pôle R7';
        if (L.mode === 'BOUCLES_DIFFERENTES') return num(f) % 2 === num(L.R1.figure) % 2 ? 'camp R1' : 'camp R7';
        return frontDe(f) === L.R1.front && frontDe(f) === L.R7.front ? 'front commun' : frontDe(f) === L.R1.front ? 'front R1' : frontDe(f) === L.R7.front ? 'front R7' : 'autre front';
      }
      var validations = FIG.filter(function (f) { return L.chezElle(f); }).map(function (f) { var e = etatVerif(f); return { figure: f, camp: campDe(f), principal: L.chezElleEnBase(f) ? 'base' : 'résultante', etat: e.etat, positions: e.positions }; });
      decision.verification = { meres: mv, codes: mv.map(num), R1: { maison: Lv.R1.maison, figure: Lv.R1.figure }, R7: { maison: Lv.R7.maison, figure: Lv.R7.figure },
        verdict: av.decision.verdict, cas: av.decision.phase, regle: av.decision.regle, raison: av.decision.raison, juge: tv[15], sentence: tv[16],
        temoinDroit: tv[13], sommeAxe: L.sommes[0].figure,       // M13 du thème de vérification = somme de l'axe du thème principal, toujours
        validations: validations, valideesAuRepos: validations.filter(function (x) { return x.etat === 'AU_REPOS'; }),
        poles: { R1: etatVerif(L.R1.figure), R7: etatVerif(L.R7.figure), memeR1: Lv.R1.figure === L.R1.figure, memeR7: Lv.R7.figure === L.R7.figure } };
    }
    return { lecture: L, decision: decision };
  }

  // Valeur propre d'un point : la somme des deux figures de repos qui l'encadrent. A, B, C, D valent Puer (1) ;
  // entre 2 et 3 et entre 10 et 11 : Via (5) ; entre 6 et 7 et entre 14 et 15 : Cauda Draconis (13).
  AXES.concat(AXES2).forEach(function (x) { x.valeur = additionner(fig(x.entre[0]), fig(x.entre[1])); });
  var API = { version: VERSION, FIG: FIG, CAS: CAS, CARDINAL: CARDINAL, ROSE: ROSE, AXES: AXES, AXES2: AXES2, COMBIS: COMBIS, rose: function (f) { return ROSE[num(f) - 1]; }, num: num, fig: fig, frontDe: frontDe, elementDe: elementDe,
    elementMaison: elementMaison, additionner: additionner, construireTheme: construireTheme, lire: lire, analyser: analyser,
    temoin: temoin, figureDuJour: figureDuJour };
  root.KOUN = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
