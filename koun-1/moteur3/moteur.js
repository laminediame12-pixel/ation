/* koun — moteur 3 : table rase des principes (fichier autonome).
   Structure exacte (thème, résultantes, forces, pôles, paralysies) puis, principe par principe, victoire, nul, pénalité, deux marquent,
   buts MT-1, corners, Over/Under 1,5 · 2,5 · 3,5. Chaque principe porte sa provenance :
     PROPRIETAIRE : posé par le propriétaire ; PORTE_3.0.0 : règle du 3.0.0 reprise ; DEVELOPPEMENT : issu des matchs de développement,
     tient sur le lot 1 ; DEV_SEUL : développement seul, jamais confirmé ; NON_TESTE : aucune donnée réelle.
   Aucun principe n'est ajusté sur un lot de validation. */
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
  var CARDINAL = { 1: 'Est', 5: 'Nord', 9: 'Ouest', 13: 'Sud', 2: 'Est', 6: 'Nord', 10: 'Ouest', 14: 'Sud',
    3: 'Est', 15: 'Nord', 11: 'Ouest', 7: 'Sud', 4: 'Est', 16: 'Nord', 12: 'Ouest', 8: 'Sud' };
  // Barème des forces hors maison de repos : élément de la figure face à l'élément de la maison.

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
    // Concordance de niveaux : une ligne à deux points dans la résultante (base + figure de repos) est une ligne où la figure et la figure de repos
    // de la maison s'accordent. Chez elle, une figure s'accorde sur les 4 niveaux (résultante Populus) ; Populus en base redonne la figure de repos.
    function concordance(f, h) {
      var r = FIG[h - 1], t = 0;
      for (var i = 0; i < 4; i++) if (POINTS[f][i] === POINTS[r][i]) t++;
      return t;
    }
    // Élément destructeur : Eau contre Feu, Air contre Terre.
    function destructeur(f, h) {
      var e = elementDe(f), m = elementMaison(h);
      return (e === 'Eau' && m === 'Feu') || (e === 'Feu' && m === 'Eau') || (e === 'Air' && m === 'Terre') || (e === 'Terre' && m === 'Air');
    }
    // Intrusion : la figure k posée en base dans la maison de la figure qu'elle attaque (k+3) la paralyse.
    function intrus(f) { return maisons[num(f) - 1].base === fig(num(f) - 3); }
    function paralyseeGrave(f, h) { return intrus(f) && destructeur(f, h); }
    // Force : seule la maison de repos (100 %) est incontestable ; la maison de l'antagoniste vaut 0 %.
    // Ailleurs : 25 points par niveau de concordance avec la figure de repos de la maison (4 niveaux = 100 %, 0 niveau = 0 %),
    // 1 % en élément destructeur, 0 % si la figure est paralysée gravement par une intrusion.
    function force(f, h) {
      if (num(f) === h) return doubleRepos(f) ? null : 100;
      if (enMaisonAntagoniste(f, h)) return 0;
      if (paralyseeGrave(f, h)) return 0;
      if (destructeur(f, h)) return 1;
      return 25 * concordance(f, h);
    }
    function motif(f, h) {
      if (num(f) === h) return doubleRepos(f) ? 'DOUBLE_REPOS_NON_CHIFFRE' : 'REPOS_PROPRE_MAXIMAL';
      if (enMaisonAntagoniste(f, h)) return 'MAISON_ANTAGONISTE_FORCE_INVERSEE';
      if (paralyseeGrave(f, h)) return 'PARALYSIE_GRAVE_PAR_INTRUSION';
      if (destructeur(f, h)) return 'ELEMENT_DESTRUCTEUR';
      return 'CONCORDANCE_' + concordance(f, h) + '_NIVEAUX';
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
    function chezElleEnBase(f) { return maisons[num(f) - 1].base === f; }
    function absente(f) { return positions(f).length === 0; }
    var paralysies = [];
    FIG.forEach(function (t) {
      var k = fig(num(t) - 3 + 16);
      if (maisons[num(t) - 1].base !== k) return;
      var pos = positions(t), grave = pos.filter(function (x) { return destructeur(t, x.maison); });
      paralysies.push({ intrus: k, maison: num(t), cible: t, resultante: additionner(k, t), frontResultante: frontDe(additionner(k, t)), degre: !pos.length ? 'CIBLE_ABSENTE' : grave.length ? 'GRAVE' : 'SOUTIEN', positionsCible: pos });
    });
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
    function sommeDe(l) { return l.map(function (h) { return theme[h]; }).reduce(function (x, y) { return additionner(x, y); }); }
    var sommes = [{ nom: 'somme de l’axe angulaire', figure: sommeDe([1, 4, 7, 10]) }, { nom: 'somme 3-5-11-15', figure: sommeDe([3, 5, 11, 15]) }];
    sommes.forEach(function (x) {
      x.pole = x.figure === R1.figure ? 'R1' : x.figure === R7.figure ? 'R7' : null;
      x.enBase = maisons.filter(function (m) { return m.base === x.figure; }).map(function (m) { return m.maison; });
      x.surAxe = x.enBase.filter(function (h) { return h === 1 || h === 4 || h === 7 || h === 10; });
      x.camp = mode !== 'BOUCLES_DIFFERENTES' ? null : (num(x.figure) % 2 === num(R1.figure) % 2 ? 'R1' : 'R7');
    });
    var lien = (function () {
      var f = additionner(R1.figure, R7.figure), pos = positions(f);
      var b = pos.filter(function (x) { return x.couche === 'base'; }).map(function (x) { return x.maison; }), r = pos.filter(function (x) { return x.couche !== 'base'; }).map(function (x) { return x.maison; });
      return { figure: f, numero: num(f), base: b, resultante: r, chezElle: chezElle(f), etat: b.length ? 'EN_BASE' : chezElle(f) ? 'CHEZ_ELLE_EN_RESULTANTE' : r.length ? 'RESULTANTE_SEULEMENT' : 'ABSENTE' };
    })();
    var confrontation = { mode: mode, R1: mode === 'BOUCLES_DIFFERENTES' ? paires(R1) : null, R7: mode === 'BOUCLES_DIFFERENTES' ? paires(R7) : null };
    return { paralysies: paralysies,
      chezElleEnBase: chezElleEnBase,
      enMaisonAntagoniste: enMaisonAntagoniste,
      lien: lien,
      sommes: sommes,
      annuleePar: annuleePar,
      mode: mode,
      maisons: maisons,
      R1: R1,
      R7: R7,
      chezElle: chezElle,
      force: force,
      positions: positions };
  }

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

  // Équilibre d'activation entre les deux parties du thème.
  // Partie 1 : M1, M2, M3, M4, M9, M10, M13, M15 ; partie 2 : M5, M6, M7, M8, M11, M12, M14, M16.
  // Dans chaque partie, les maisons prennent tour à tour une ligne : Feu, Air, Eau, Terre, puis de nouveau Feu, Air, Eau, Terre.
  // Une ligne à deux points compte 1 (niveau concordant). On lit la base et la résultante (en M16, sans résultante, la base).
  var PARTIE1 = [1, 2, 3, 4, 9, 10, 13, 15], PARTIE2 = [5, 6, 7, 8, 11, 12, 14, 16];
  function niveauxParties(L) {
    function somme(part, couche) {
      return part.reduce(function (t, h, i) {
        var m = L.maisons[h - 1], f = couche === 'base' ? m.base : (m.resultante || m.base);
        return t + (POINTS[f][i % 4] === 2 ? 1 : 0);
      }, 0);
    }
    var b1 = somme(PARTIE1, 'base'), b2 = somme(PARTIE2, 'base'), r1 = somme(PARTIE1, 'res'), r2 = somme(PARTIE2, 'res');
    return { base1: b1, base2: b2, res1: r1, res2: r2, ecartBase: b1 - b2, ecartRes: r1 - r2 };
  }
  // Le juge (M15) tranche : s'il est dans sa maison de repos (Aquisitio en base ou en résultante, c'est-à-dire Aquisitio ou Populus en base), il est décisif et l'équilibre ne donne pas le nul.
  // Les 8 nuls réels ont un juge hors de son repos ; 8 matchs décidés sur 19 ont le juge chez lui.
  function jugeChezLui(L) { var m = L.maisons[14]; return m.base === 'Aquisitio' || m.resultante === 'Aquisitio'; }
  function canalDuPole(c) { return FRONTS[(c.maison - 1) % 4]; }
  function niveauxAffinites(L) {
    var lv = [0, 0, 0, 0];
    L.maisons.forEach(function (m) { for (var i = 0; i < 4; i++) if (POINTS[m.base][i] === 2) lv[i]++; });
    return { niveaux: lv, feuAir: lv[0] + lv[1], eauTerre: lv[2] + lv[3] };
  }
  function equilibreCompense(L) { if (jugeChezLui(L)) return null; var n = niveauxParties(L); return n.ecartBase + n.ecartRes === 0 ? n : null; }
  function texteEquilibre(n) {
    return 'partie 1 (M1, M2, M3, M4, M9, M10, M13, M15) : ' + n.base1 + ' en base, ' + n.res1 + ' en résultante ; partie 2 (M5, M6, M7, M8, M11, M12, M14, M16) : ' + n.base2 + ' en base, ' + n.res2 + ' en résultante. Ce que la base laisse d’un côté, la résultante le rend de l’autre : ' + (n.ecartBase === 0 ? 'équilibre parfait' : 'équilibre compensé') + ', et le juge (M15) n’est pas dans sa maison de repos.';
  }
  var CAS = [
    // ───────── Victoire assurée : boucles différentes ─────────
    { id: 'VA-1', famille: 'Victoire assurée', titre: 'Boucles différentes : trois figures du front ou du front binôme chez elles', statut: 'EN_ESSAI',
      enonce: 'Pôles dans des boucles différentes. Un pôle a trois figures ou plus de son front ou du front binôme dans leur maison de repos (base ou résultante, hors figures annulées), et l’autre en a moins : victoire assurée.',
      condition: function (L) {
        if (L.mode !== 'BOUCLES_DIFFERENTES') return null;
        function chez(c) { return c.frontDirect.concat(c.frontBinome).filter(function (f) { return L.chezElle(f) && !L.annuleePar(f); }); }
        var a = chez(L.R1), b = chez(L.R7);
        if (a.length < 3 && b.length < 3) return null;
        if (a.length === b.length) return null;
        var g = a.length > b.length ? L.R1 : L.R7, l = a.length > b.length ? a : b, o = a.length > b.length ? b : a;
        return V(g, L, 'Victoire ' + g.camp + ' assurée : boucles différentes, ' + l.length + ' figures du front ' + g.front + ' ou du front binôme sont chez elles (' + l.join(', ') + ') contre ' + o.length + ' pour l’autre.', true);
      } },
    { id: 'MF-2', famille: 'Même front', titre: 'Un seul partenaire de moitié chez lui', statut: 'REGLE_CONFIRMEE',
      enonce: 'Pôles dans le même front, moitiés différentes (A : 1-5 et 9-13 ; B : 2-6 et 10-14 ; C : 3-7 et 11-15 ; D : 4-8 et 12-16), et un seul pôle a son partenaire de moitié dans sa maison de repos (base ou résultante) : cette figure au repos est décisive, ce pôle gagne.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front) return null;
        var p1 = partenaireMoitie(L.R1.figure), p7 = partenaireMoitie(L.R7.figure);
        if (L.R1.figure === L.R7.figure || p1 === L.R7.figure) return null;      // même figure ou même moitié : pas de partenaire décisif
        var a = L.chezElle(p1), b = L.chezElle(p7);
        if (a === b) return null;
        var g = a ? L.R1 : L.R7, pg = a ? p1 : p7;
        return V(g, L, 'Victoire ' + g.camp + ' : même front ' + g.front + ', et seul le partenaire de ' + g.figure + ', ' + pg + ', est dans sa maison de repos (M' + num(pg) + ').');
      } },
    { id: 'MF-3', famille: 'Même front', titre: 'Le nul : front miroir, la somme est Tristitia en maison de Terre', statut: 'REGLE_CONFIRMEE',
      enonce: 'Le seul principe du nul. R1 + R7 donne Tristitia (les deux pôles sont miroirs, même front) et Tristitia se trouve dans une maison de Terre (M4, M8, M12, M16), en base ou en résultante : nul.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front || L.lien.figure !== 'Tristitia') return null;
        var th = [4, 8, 12, 16].filter(function (h) { var m = L.maisons[h - 1]; return m.base === 'Tristitia' || m.resultante === 'Tristitia'; });
        if (!th.length) return null;
        return N('Nul : front miroir ' + L.R1.front + ', ' + L.R1.figure + ' + ' + L.R7.figure + ' donne Tristitia, qui est dans une maison de Terre (M' + th.join(', M') + ').');
      } },
    { id: 'NU-1', famille: 'Même front', titre: 'Le nul : les deux parties du thème sont en équilibre d’activation', statut: 'EN_ESSAI',
      enonce: 'Pôles dans le même front, sans figure au repos décisive. Les niveaux d’activation des deux parties du thème s’équilibrent : l’écart de la base et celui de la résultante se compensent (somme nulle) : nul.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front) return null;
        var n = equilibreCompense(L); if (!n) return null;
        return N('Nul : même front ' + L.R1.front + ', sans figure au repos décisive. ' + texteEquilibre(n));
      } },
    { id: 'PF-2', famille: 'Pôle sans force', titre: 'Attaque directe sur un pôle sans défense', statut: 'EN_ESSAI',
      enonce: 'Un pôle attaque l’autre directement ; l’attaqué n’a que 1 % ou moins dans sa maison de pôle et l’attaquant tient la sienne à plus de 1 % : l’attaquant gagne.',
      condition: function (L) {
        var att = attaquantDirect(L); if (!att) return null;
        var cible = autrePole(L, att);
        if (!(forceChezSoi(L, cible) <= 1 && forceChezSoi(L, att) > 1)) return null;
        return V(att, L, 'Victoire ' + att.camp + ' : ' + att.figure + ' attaque directement ' + cible.figure + ', qui n’a que ' + forceChezSoi(L, cible) + ' % dans sa maison M' + cible.maison + ' ; ' + att.figure + ' tient la sienne (M' + att.maison + ') à ' + forceChezSoi(L, att) + ' %.');
      } },
    { id: 'AX-1', famille: 'Pôles sur l’axe', titre: 'Pôles en M4 et M10 : le pôle de M4 engendre l’autre', statut: 'EN_ESSAI',
      enonce: 'Les pôles sont en M4 et M10 (Albus en M1). M10 est la somme de M3 et M4 : le pôle de M4 engendre celui de M10. Le pôle de M4 gagne, sauf si le pôle de M10 l’attaque directement.',
      condition: function (L) {
        var m4 = L.R1.maison === 4 && L.R7.maison === 10 ? L.R1 : L.R7.maison === 4 && L.R1.maison === 10 ? L.R7 : null;
        if (!m4) return null;
        var m10 = autrePole(L, m4);
        if (attaquantDirect(L) === m10) return null;
        return V(m4, L, 'Victoire ' + m4.camp + ' : les pôles sont en M4 et M10. ' + m4.figure + ', en M4, engendre ' + m10.figure + ' en M10 (M10 = M3 + M4, avec ' + L.maisons[2].base + ' en M3), et ' + m10.figure + ' ne l’attaque pas directement.');
      } },
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
    { id: 'NU-2', famille: 'Équilibre d’activation', titre: 'Le nul : les deux parties du thème sont en équilibre d’activation', statut: 'EN_ESSAI',
      enonce: 'Même boucle ou boucles différentes, aucun cas de victoire ne s’est appliqué. Les niveaux d’activation des deux parties du thème s’équilibrent : l’écart de la base et celui de la résultante se compensent (somme nulle) : nul.',
      condition: function (L) {
        if (L.R1.front === L.R7.front) return null;
        var n = equilibreCompense(L); if (!n) return null;
        return N('Nul : aucun cas de victoire ne s’applique. ' + texteEquilibre(n));
      } },
    { id: 'NU-3', famille: 'Équilibre d’activation', titre: 'Le nul : les affinités Feu-Air et Eau-Terre s’équilibrent en base', statut: 'EN_ESSAI',
      enonce: 'Aucun cas de victoire ne s’est appliqué et le juge (M15) n’est pas chez lui. En base, les lignes à deux points des niveaux Feu et Air (réunis) égalent celles des niveaux Eau et Terre (réunis) sur les 16 maisons : nul.',
      condition: function (L) {
        if (jugeChezLui(L)) return null;
        var n = niveauxAffinites(L); if (n.feuAir !== n.eauTerre) return null;
        return N('Nul : aucun cas de victoire ne s’applique. En base, Feu + Air compte ' + n.feuAir + ' lignes à deux points (Feu ' + n.niveaux[0] + ', Air ' + n.niveaux[1] + ') et Eau + Terre en compte autant (Eau ' + n.niveaux[2] + ', Terre ' + n.niveaux[3] + ') : les affinités s’équilibrent, et le juge (M15) n’est pas dans sa maison de repos.');
      } },
  ];
  // Applique une condition aux deux pôles ; tranche seulement si un seul des deux la remplit.
  function unSeul(L, ok, pourquoi) {
    var a = ok(L.R1, L.R7), b = ok(L.R7, L.R1);
    if (a === b) return null;
    var g = a ? L.R1 : L.R7, p = a ? L.R7 : L.R1;
    return { verdict: a ? '1' : '2', assuree: false, raison: 'Victoire ' + g.camp + ' : ' + pourquoi(g, p) };
  }

  function theme16(L) { return L.maisons[15].base; }
  // Valeur propre d'un point : la somme des deux figures de repos qui l'encadrent. A, B, C, D valent Puer (1) ;
  // entre 2 et 3 et entre 10 et 11 : Via (5) ; entre 6 et 7 et entre 14 et 15 : Cauda Draconis (13).

  // ───────── Moteur 3 : les principes ─────────
  var K = { FIG: FIG, num: num, fig: fig, additionner: additionner, construireTheme: construireTheme, lire: lire, CAS: CAS };

  var MIROIR = { 'Puer': 'Puella', 'Puella': 'Puer', 'Albus': 'Rubeus', 'Rubeus': 'Albus', 'Caput': 'Cauda Draconis', 'Cauda Draconis': 'Caput',
    'Tristitia': 'Laetitia', 'Laetitia': 'Tristitia', 'Aquisitio': 'Amissio', 'Amissio': 'Aquisitio', 'Via': 'Populus', 'Populus': 'Via',
    'Carcer': 'Conjunctio', 'Conjunctio': 'Carcer', 'Fortuna Major': 'Fortuna Minor', 'Fortuna Minor': 'Fortuna Major' };
  var ANTAGONISTE_FRONT = { A: 'D', D: 'C', C: 'B', B: 'A' };
  function front(f) { return FRONTS[(num(f) - 1) % 4]; }
  function impair(f) { return num(f) % 2 === 1; }
  function ouverts(f) { return POINTS[f].filter(function (v) { return v === 1; }).length; }
  function res(L, h) { var m = L.maisons[h - 1]; return m.resultante || m.base; }

  // ───────── VICTOIRE ET NUL ─────────
  // On reprend du moteur 2 les conditions de ces principes, dans l'ordre d'origine. Les autres cas du moteur 2 sont abandonnés.
  var VERDICT = [
    ['VA-1', 'PROPRIETAIRE', 'Victoire assurée : trois figures ou plus du front ou du front binôme chez elles (boucles différentes).'],
    ['MF-2', 'PROPRIETAIRE', 'Même front : un seul pôle a son partenaire de moitié chez lui.'],
    ['MF-3', 'PROPRIETAIRE', 'Nul, front miroir : R1 + R7 donne Tristitia, posée dans une maison de Terre.'],
    ['NU-1', 'DEVELOPPEMENT', 'Nul, même front : équilibre d’activation des deux parties du thème, juge hors de son repos.'],
    ['AX-1', 'DEV_SEUL', 'Pôles en M4 et M10 : le pôle de M4 engendre l’autre.'],
    ['CL-1', 'DEVELOPPEMENT', 'Même boucle : un seul pôle chez lui.'],
    ['CL-2', 'DEVELOPPEMENT', 'Boucles différentes : le pôle et son binôme chez eux.'],
    ['PF-2', 'DEVELOPPEMENT', 'Attaque directe sur un pôle sans défense.'],
    ['NU-2', 'DEVELOPPEMENT', 'Nul : équilibre d’activation des deux parties du thème, juge hors de son repos.'],
    ['NU-3', 'DEVELOPPEMENT', 'Nul : équilibre des affinités Feu-Air et Eau-Terre en base, juge hors de son repos.']
  ];
  var PRINCIPES_VERDICT = VERDICT.map(function (p) {
    var cas = K.CAS.filter(function (c) { return c.id === p[0]; })[0];
    return { id: p[0], provenance: p[1], enonce: p[2], cas: cas };
  });
  // Dernier principe : la force des pôles. Une figure dans sa maison de repos garde sa force ; on additionne les forces de toutes les positions du pôle.
  function sommeForces(L, c) {
    return L.positions(L[c].figure).reduce(function (t, x) { return t + (x.force === null ? 100 : x.force); }, 0);
  }
  var FORCE_POLES = { id: 'FP-1', provenance: 'DEVELOPPEMENT', enonce: 'Le pôle dont la somme des forces (toutes ses positions, base et résultante) est la plus haute gagne ; égalité : pas de verdict.' };

  function verdict(L) {
    for (var i = 0; i < PRINCIPES_VERDICT.length; i++) {
      var p = PRINCIPES_VERDICT[i], r = p.cas.condition(L);
      if (r) return { verdict: r.verdict, principe: p.id, provenance: p.provenance, enonce: p.enonce, raison: r.raison, assuree: !!r.assuree, titre: p.cas.titre };
    }
    var a = sommeForces(L, 'R1'), b = sommeForces(L, 'R7');
    if (a === b) return { verdict: null, principe: null, provenance: null, enonce: 'Aucun principe ne tranche.', raison: 'Aucun principe ne s’applique et les forces des pôles sont égales.', assuree: false };
    var g = a > b ? 'R1' : 'R7';
    return { verdict: a > b ? '1' : '2', principe: FORCE_POLES.id, provenance: FORCE_POLES.provenance, enonce: FORCE_POLES.enonce, titre: 'La force des pôles',
      raison: 'Victoire ' + g + ' : aucun principe de victoire ou de nul ne s’applique. La somme des forces de ' + L[g].figure + ' (' + Math.max(a, b) + ') dépasse celle de l’autre pôle (' + Math.min(a, b) + ').', assuree: false };
  }

  // ───────── PÉNALITÉ ET CARTON ROUGE (règle du 3.0.0) ─────────
  function penalite(L) {
    var fR1 = {}, fR7 = {};
    [L.maisons[L.R1.maison - 1].base, res(L, L.R1.maison)].forEach(function (f) { fR1[front(f)] = true; });
    [L.maisons[L.R7.maison - 1].base, res(L, L.R7.maison)].forEach(function (f) { fR7[front(f)] = true; });
    var t1 = [], t7 = [], rouge = false, pen = false;
    for (var h = 1; h <= 16; h += 2) {
      var b = L.maisons[h - 1].base;
      if (b !== 'Rubeus') continue;
      if (fR1[front(b)]) { t1.push('Rubeus (front ' + front(b) + ') en base M' + h + ' (impaire) dans la boucle de R1 : carton rouge'); rouge = true; }
      if (fR7[front(b)]) { t7.push('Rubeus (front ' + front(b) + ') en base M' + h + ' (impaire) dans la boucle de R7 : carton rouge'); rouge = true; }
    }
    var m12 = L.maisons[11].base;
    if (m12 === 'Cauda Draconis') {
      if (fR1[front(m12)]) { t1.push('Cauda Draconis (front ' + front(m12) + ') en M12 dans la boucle de R1 : carton rouge'); rouge = true; }
      if (fR7[front(m12)]) { t7.push('Cauda Draconis (front ' + front(m12) + ') en M12 dans la boucle de R7 : carton rouge'); rouge = true; }
    }
    var duo = { 'Cauda Draconis': 1, 'Rubeus': 1 };
    [['R1', t1], ['R7', t7]].forEach(function (x) {
      var h = L[x[0]].maison, bf = L.maisons[h - 1].base, rf = res(L, h);
      var trouves = [bf, rf].filter(function (f, i, a) { return duo[f] && a.indexOf(f) === i; });
      if (trouves.length) { x[1].push(trouves.join(' / ') + ' dans la maison de repos de ' + x[0] + ' (M' + h + ') : pénalité contre ' + x[0]); pen = true; }
    });
    var camp = t1.length && t7.length ? 'R1 et R7' : t1.length ? 'R1' : t7.length ? 'R7' : null;
    return { actif: !!camp, camp: camp, carton: rouge, penalty: pen, libelle: !camp ? 'Aucun' : rouge && pen ? 'Carton rouge + pénalité' : rouge ? 'Carton rouge' : 'Pénalité', raisons: t1.concat(t7), provenance: 'PORTE_3.0.0', teste: 'NON_TESTE (aucun résultat de pénalité ou de carton dans les données)' };
  }

  // ───────── BUTS : indice de flux, verrous de Terre, deux marquent, buts MT-1, corners, Over/Under ─────────
  function somme(L, hs) {
    return hs.map(function (h) { return L.maisons[h - 1].base; }).reduce(function (x, y) { return K.additionner(x, y); });
  }
  function peutMarquer(L, c) {
    var f = L[c].figure, pos = L.positions(f);
    var forte = pos.some(function (x) { return x.force !== null && x.force >= 50 || x.force === null; });
    var paralysee = L.paralysies.some(function (p) { return p.cible === f && p.degre === 'GRAVE'; });
    return forte && !paralysee && !L.annuleePar(f);
  }
  function buts(L, v) {
    var sansVerdict = v === null || v === undefined;
    if (sansVerdict) v = '1';
    var sov = somme(L, [3, 5, 11, 13]), conv = K.additionner(sov, L.maisons[9].base), juge = L.maisons[14].base;
    var fr1 = [L.maisons[L.R1.maison - 1].base, res(L, L.R1.maison)].map(front), fr7 = [L.maisons[L.R7.maison - 1].base, res(L, L.R7.maison)].map(front);
    // deux marquent : les deux camps peuvent marquer et au moins une figure de boucle impaire donne l'élan
    var elan = [L.maisons[L.R1.maison - 1].base, res(L, L.R1.maison), L.maisons[L.R7.maison - 1].base, res(L, L.R7.maison), juge].some(impair);
    var p1 = peutMarquer(L, 'R1'), p7 = peutMarquer(L, 'R7'), btts = p1 && p7 && elan;
    // flux offensif
    var flux = ouverts(sov) * 2 + ouverts(conv) * 2 + ouverts(juge) * 1.5;
    if (impair(sov)) flux += 2.5;
    if (impair(conv)) flux += 2.5;
    if (fr1.indexOf('A') >= 0) flux += 2;
    if (fr7.indexOf('A') >= 0) flux += 2;
    if (btts) flux += 3;
    // verrous de Terre
    var verrous = 0;
    [L.maisons[7].base, res(L, 8), L.maisons[11].base, res(L, 12)].forEach(function (f) {
      if (front(f) === 'D') verrous += 1.5;
      if (f === 'Carcer' || f === 'Tristitia' || f === 'Populus') verrous += 1.5;
    });
    if (juge === 'Populus' || juge === 'Carcer' || juge === 'Tristitia') verrous += 2.5;
    [8, 12].forEach(function (h) {
      if (L.maisons[h - 1].base === 'Populus') verrous += 1;
      if (L.enMaisonAntagoniste(L.maisons[h - 1].base, h)) flux += 1.2;
    });
    var net = Math.max(0, flux - verrous * 0.65);
    // total de buts attendu : seuils du propriétaire (7, 9,5, 14,5), cohérent avec le verdict et « deux marquent »
    var nul = v === 'N', total;
    if (nul) { total = net < 7 ? 0 : net < 14.5 ? 2 : 4; if (btts && total < 2) total = 2; }
    else { total = net < 7 ? 1 : net < 9.5 ? 2 : net < 14.5 ? 3 : 4; if (btts && total < 3) total = 3; }
    var g1, g2;
    if (nul) { g1 = g2 = total / 2; }
    else {
      var perd = btts ? (total >= 4 ? 1 : 1) : 0, gagne = total - perd;
      if (v === '1') { g1 = gagne; g2 = perd; } else { g1 = perd; g2 = gagne; }
    }
    var bttsFinal = g1 > 0 && g2 > 0;
    var T = g1 + g2;
    // buts MT-1 (ButMT du 3.0.0) : somme M1+M5+M12+M15
    var bm = somme(L, [1, 5, 12, 15]), posBm = L.positions(bm), basesBm = posBm.filter(function (x) { return x.couche === 'base'; }).map(function (x) { return x.maison; });
    var pivots = [L.maisons[0].base, L.maisons[4].base, L.maisons[11].base, res(L, 15)].filter(impair).length;
    var reposDansFront = [['R1', 'base'], ['R1', 'res'], ['R7', 'base'], ['R7', 'res']].some(function (x) {
      var h = L[x[0]].maison, f = x[1] === 'base' ? L.maisons[h - 1].base : res(L, h);
      return front(f) === front(bm) && num(f) === h;
    });
    var miroirBm = MIROIR[bm], miroirPresent = miroirBm && L.positions(miroirBm).length > 0;
    var htBut = (impair(bm) && posBm.length > 0) || basesBm.some(function (h) { return h === 1 || h === 5 || h === 12 || h === 15; }) || (miroirPresent && reposDansFront && pivots >= 2);
    var mt = T === 0 ? 'Aucun but en première mi-temps' : htBut ? (T >= 3 && net >= 14.5 ? 'Au moins deux buts en première mi-temps' : 'Au moins un but en première mi-temps') : 'Aucun but en première mi-temps probable';
    // corners MT-1 (friction du 3.0.0)
    var fric = 0;
    [1, 5, 7, 8, 12].forEach(function (h) { var f = front(L.maisons[h - 1].base); if (f === 'A' || f === 'B') fric += 2; if (f === 'D') fric += 1.5; });
    var a = front(L.maisons[L.R1.maison - 1].base), b = front(L.maisons[L.R7.maison - 1].base);
    if (ANTAGONISTE_FRONT[a] === b || ANTAGONISTE_FRONT[b] === a) fric += 2.5;
    if (verrous >= 4.5 && flux >= 9) fric += 3;
    var corners = fric >= 13.5 ? 'Over 4.5' : fric >= 10.5 ? 'Over 3.5' : 'Under 4.5';
    var sortie = {
      deuxMarquent: { oui: bttsFinal, brut: btts, pole1PeutMarquer: p1, pole7PeutMarquer: p7, elan: elan, provenance: 'PORTE_3.0.0 (seuil de 50 %), reconstruit sur les forces de la structure', teste: 'testé sur 26 scores réels' },
      score: g1 + ' - ' + g2, g1: g1, g2: g2, total: T,
      overUnder: { over15: T > 1.5, over25: T > 2.5, over35: T > 3.5, indiceNet: Math.round(net * 10) / 10, flux: Math.round(flux * 10) / 10, verrous: verrous, provenance: 'PORTE_3.0.0 (indice de flux, seuils 7 / 9,5 / 14,5)', teste: 'testé sur 26 scores réels' },
      butsMT1: { oui: T > 0 && htBut, libelle: mt, somme: bm, provenance: 'PORTE_3.0.0 (ButMT M1+M5+M12+M15)', teste: 'testé sur 6 matchs avec mi-temps connue' },
      corners: { libelle: corners, friction: fric, provenance: 'PORTE_3.0.0 (indice de friction)', teste: 'NON_TESTE (aucun résultat de corners dans les données)' }
    };
    if (sansVerdict) { sortie.score = '—'; sortie.g1 = null; sortie.g2 = null; sortie.deuxMarquent.oui = btts; }
    return sortie;
  }

  function analyser(theme) {
    var L = K.lire(theme), v = verdict(L);
    return { lecture: L, verdict: v, penalite: penalite(L), buts: buts(L, v.verdict) };
  }
  var API = { version: '3.0.0-table-rase', PRINCIPES_VERDICT: PRINCIPES_VERDICT, FORCE_POLES: FORCE_POLES, construireTheme: construireTheme, fig: fig, num: num, FIG: FIG, lire: lire, analyser: analyser, verdict: verdict, penalite: penalite, buts: buts };
  root.KOUN3 = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
