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
    return { chezElleEnBase: chezElleEnBase, absente: absente, enMaisonPaire: enMaisonPaire, enMaisonAntagoniste: enMaisonAntagoniste, penalisees: penalisees, binomeM1: binomeM1, sommes: sommes, annuleePar: annuleePar, stabilite: stabilite(), mode: mode, confrontation: confrontation, chemin: { R1: chemin(R1, R7), R7: chemin(R7, R1) },
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
  // Un cas = { id, titre, statut, condition(lecture) }. La condition rend null, ou
  // { verdict: '1' | '2' | 'N', assuree: bool, raison: texte }. Le premier cas qui s'applique tranche.
  var CAS = [
    {
      id: 'CAS-001', titre: 'Même front : départage par les moitiés', statut: 'REGLE_CONFIRMEE',
      enonce: 'R1 et R7 dans le même front. D’abord les antagonistes : si l’antagoniste d’un seul pôle est dans sa propre maison de repos, ce pôle est dominé et l’autre gagne, même si les pôles sont miroirs ; si les deux antagonistes sont chez eux, nul. Ensuite les moitiés. Chaque front se partage en deux moitiés (A : 1-5 et 9-13 ; B : 2-6 et 10-14 ; C : 3-7 et 11-15 ; D : 4-8 et 12-16). Si un seul des deux pôles a son partenaire de moitié dans sa propre maison de repos (base ou résultante), ce pôle gagne. Sinon — les deux, aucun, ou pôles de la même moitié — : nul.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front) return null;
        function partenaire(f) { var n = num(f); return n <= 8 ? fig(n <= 4 ? n + 4 : n - 4) : fig(n <= 12 ? n + 4 : n - 4); }
        var p1 = partenaire(L.R1.figure), p7 = partenaire(L.R7.figure);
        // D'abord les antagonistes : si l'antagoniste d'un seul pôle est chez lui (dans sa propre maison de repos), ce pôle est dominé
        // et le verdict est déséquilibré, même si les pôles sont miroirs ou de la même moitié. Si les deux le sont, chacun est sous contrôle : nul.
        var a1 = L.chezElle(L.R1.antagoniste), a7 = L.chezElle(L.R7.antagoniste);
        function res(c) { var r = L.maisons[c.maison - 1].resultante; return r ? ' (résultante de M' + c.maison + ' : ' + r + ')' : ''; }
        if (a1 && a7) return { verdict: 'N', assuree: false, raison: 'Nul : même front ' + L.R1.front + ', les deux pôles sont sous le contrôle de leur antagoniste, chacun dans sa maison de repos (' + L.R1.antagoniste + ' en M' + num(L.R1.antagoniste) + ', ' + L.R7.antagoniste + ' en M' + num(L.R7.antagoniste) + ').' };
        if (a1 !== a7) {
          var perd = a1 ? L.R1 : L.R7, gagne = a1 ? L.R7 : L.R1;
          return { verdict: a1 ? '2' : '1', assuree: false, raison: 'Victoire ' + gagne.camp + ' : même front ' + gagne.front + ', mais l’antagoniste de ' + perd.camp + ' ' + perd.figure + ', ' + perd.antagoniste + ', est chez lui en M' + num(perd.antagoniste) + ' ; celui de ' + gagne.figure + ' ne l’est pas. ' + gagne.camp + ' ' + gagne.figure + res(gagne) + ' ; ' + perd.camp + ' ' + perd.figure + res(perd) + '.' };
        }
        if (L.R1.figure === L.R7.figure || p1 === L.R7.figure)
          return { verdict: 'N', assuree: false, raison: 'Nul : R1 ' + L.R1.figure + ' et R7 ' + L.R7.figure + ' sont dans la même moitié du front ' + L.R1.front + '.' };
        var a = L.chezElle(p1), b = L.chezElle(p7);
        if (a !== b) {
          var g = a ? L.R1 : L.R7, pg = a ? p1 : p7;
          return { verdict: a ? '1' : '2', assuree: false, raison: 'Victoire ' + g.camp + ' : même front ' + g.front + ', et seul le partenaire de ' + g.figure + ', ' + pg + ', est dans sa maison de repos (M' + num(pg) + ').' };
        }
        return { verdict: 'N', assuree: false, raison: 'Nul : même front ' + L.R1.front + ', ' + (a ? 'les deux partenaires (' + p1 + ' et ' + p7 + ') sont dans leur maison de repos.' : 'aucun des deux partenaires (' + p1 + ', ' + p7 + ') n’est dans sa maison de repos.') };
      }
    },
    {
      id: 'CAS-010', titre: 'Pôle dans la maison de son antagoniste', statut: 'EN_ESSAI',
      enonce: 'Un pôle se trouve dans la maison de son antagoniste : il est pénalisé, à 0 %, faible et fragile aux attaques. Si un seul des deux pôles est dans ce cas, l’autre gagne.',
      condition: function (L) {
        function pen(c) { return L.enMaisonAntagoniste(c.figure, c.maison); }
        var a = pen(L.R1), b = pen(L.R7);
        if (a === b) return null;
        var p = a ? L.R1 : L.R7, g = a ? L.R7 : L.R1;
        return { verdict: a ? '2' : '1', assuree: false, raison: 'Victoire ' + g.camp + ' : le pôle ' + p.camp + ', ' + p.figure + ', est en M' + p.maison + ', la maison de son antagoniste ' + fig(p.maison) + ' (0 %, pénalisé). ' + g.figure + ' n’est pas pénalisé.' };
      }
    },
    {
      id: 'CAS-011', titre: 'Toutes les figures au repos sont annulées', statut: 'EN_ESSAI',
      enonce: 'Le thème a des figures dans leur maison de repos, mais chacune est annulée : soit son attaquant (k−3) est lui aussi dans sa maison de repos, soit son attaquant est présent deux fois en base (sans compter une position à 1 % ou 0 %). Il ne reste aucun ancrage : nul.',
      condition: function (L) {
        var repos = FIG.filter(function (f) { return L.chezElle(f); });
        if (!repos.length) return null;
        var motifs = [];
        for (var i = 0; i < repos.length; i++) { var a = L.annuleePar(repos[i]); if (!a) return null; motifs.push(repos[i] + ' (M' + num(repos[i]) + ') est annulée par ' + a.attaquant + (a.motif === 'ATTAQUANT_AU_REPOS' ? ', elle aussi au repos' : ', ' + a.maisons.length + ' fois en base (M' + a.maisons.join(', M') + ')')); }
        return { verdict: 'N', assuree: false, raison: 'Nul : toutes les figures au repos sont annulées. ' + motifs.join(' ; ') + '.' };
      }
    },
    {
      id: 'CAS-002', titre: 'Verrou de front : victoire assurée', statut: 'EN_ESSAI',
      enonce: 'Deux figures du front d’un pôle, en base, chacune dans sa propre maison de repos à 100 % : victoire assurée de ce pôle, si l’autre pôle n’a pas de verrou.',
      condition: function (L) {
        var a = L.verrous.R1.length > 0, b = L.verrous.R7.length > 0;
        if (a === b) return null;
        var k = a ? 'R1' : 'R7', v = L.verrous[k][0];
        return { verdict: a ? '1' : '2', assuree: true, raison: 'Victoire ' + k + ' assurée : verrou du front ' + v.front + ', ' + v.figures[0] + ' en M' + v.maisons[0] + ' et ' + v.figures[1] + ' en M' + v.maisons[1] + ', chacune dans sa maison de repos.' };
      }
    }
    ,
    // Les cas suivants valent pour R1 comme pour R7. Si les deux pôles remplissent la même condition, le cas ne tranche pas.
    {
      id: 'CAS-003', titre: 'Pôle et son front au repos, autres en maisons paires', statut: 'EN_ESSAI',
      enonce: 'Le pôle est dans sa maison de repos (en base) et son antagoniste n’est pas dans la sienne ; son front (la figure suivante de son front) est dans sa propre maison (base ou résultante) et l’antagoniste de ce front n’est pas dans la sienne ; les deux autres figures du front occupent des maisons paires : ce pôle gagne, victoire assurée.',
      condition: function (L) {
        function ok(c) {
          var n = num(c.figure), front = fig(n + 4);
          return L.chezElleEnBase(c.figure) && !L.chezElle(fig(n - 3)) && L.chezElle(front) && !L.chezElle(fig(n + 1)) &&
            L.enMaisonPaire(fig(n + 8)) && L.enMaisonPaire(fig(n + 12));
        }
        return unSeul(L, ok, function (c) { return c.figure + ' est dans sa maison de repos, son front ' + fig(num(c.figure) + 4) + ' aussi, sans antagoniste au repos ; ' + fig(num(c.figure) + 8) + ' et ' + fig(num(c.figure) + 12) + ' occupent des maisons paires.'; });
      }
    },
    {
      id: 'CAS-004', titre: 'Pôle antagoniste direct, en M8 avec un front en M4 ou M12', statut: 'EN_ESSAI',
      enonce: 'Le pôle est l’antagoniste direct de l’autre pôle (il l’attaque) ; il est en M8, la maison miroir, et une autre figure de son front est en M4 ou en M12 : ce pôle gagne, victoire assurée.',
      condition: function (L) {
        function ok(c, autre) {
          var n = num(c.figure);
          return num(autre.figure) === num(fig(n + 3)) && L.maisons[7].base === c.figure &&
            [fig(n + 4), fig(n + 8), fig(n + 12)].some(function (f) { return L.presentEn(f, 4) || L.presentEn(f, 12); });
        }
        return unSeul(L, ok, function (c, autre) { return c.figure + ' attaque directement ' + autre.figure + ', il est en M8 et une figure de son front est en M4 ou M12.'; });
      }
    },
    {
      id: 'CAS-005', titre: 'Pôle chez son antagoniste, front absent', statut: 'EN_ESSAI',
      enonce: 'Le pôle est dans la maison de son antagoniste direct, et son front direct ou le front de son miroir est absent du thème ; l’adversaire a une figure de son front en maison paire (en M4 ou M12 si son front est Terre ou Eau) : l’adversaire gagne, victoire assurée.',
      condition: function (L) {
        function ok(c, autre) {        // c = le camp qui gagne, autre = le pôle mal placé
          var n = num(autre.figure), chezAntagoniste = L.maisons[num(fig(n - 3)) - 1].base === autre.figure;
          if (!chezAntagoniste || !(L.absente(fig(n + 4)) || L.absente(fig(n + 12)))) return false;
          var exigeM4M12 = c.element === 'Terre' || c.element === 'Eau';
          return c.frontDirect.some(function (f) { return exigeM4M12 ? (L.presentEn(f, 4) || L.presentEn(f, 12)) : L.enMaisonPaire(f); });
        }
        return unSeul(L, ok, function (c, autre) { return autre.figure + ' est dans la maison de son antagoniste ' + fig(num(autre.figure) - 3) + ' et son front est incomplet ; le front de ' + c.figure + ' tient ' + (c.element === 'Terre' || c.element === 'Eau' ? 'M4 ou M12' : 'une maison paire') + '.'; });
      }
    },
    {
      id: 'CAS-006', titre: 'Pôle attaqué sans front direct', statut: 'EN_ESSAI',
      enonce: 'Un pôle est l’antagoniste direct de l’autre, et le pôle attaqué n’a pas son front direct dans le thème : celui qui n’a pas de front direct perd.',
      condition: function (L) {
        function ok(c, autre) { return num(autre.figure) === num(fig(num(c.figure) + 3)) && L.absente(fig(num(autre.figure) + 4)); }
        return unSeul(L, ok, function (c, autre) { return c.figure + ' attaque directement ' + autre.figure + ', dont le front direct ' + fig(num(autre.figure) + 4) + ' est absent du thème.'; });
      }
    }
    ,
    {
      id: 'CAS-007', titre: 'Front Sud ou Nord du pôle dans sa maison de repos', statut: 'EN_ESSAI',
      enonce: 'Pôles dans la même boucle. Une figure Sud ou Nord du front du pôle (autre que le pôle lui-même) est dans sa propre maison de repos, en base ou en résultante : ce pôle gagne.',
      condition: function (L) {
        if (L.mode === 'BOUCLES_DIFFERENTES') return null;   // boucles différentes : la confrontation se lit par paires, pas par le seul front (match réel 2·12·4·4)
        function auRepos(c) {
          return c.frontDirect.filter(function (f) {
            var pt = CARDINAL[num(f)];
            return f !== c.figure && (pt === 'Sud' || pt === 'Nord') && L.chezElle(f);
          });
        }
        return unSeul(L, function (c) { return auRepos(c).length > 0; }, function (c) {
          var f = auRepos(c)[0];
          return f + ' (front ' + c.front + ' · ' + CARDINAL[num(f)] + ' de ' + c.figure + ') est dans sa maison de repos M' + num(f) + '.';
        });
      }
    },
    {
      id: 'CAS-008', titre: 'Boucles différentes : le pôle et son binôme', statut: 'EN_ESSAI',
      enonce: 'Pôles dans des boucles différentes. La confrontation se lit par paires : R1 et son binôme contre R7 et son binôme. La paire qui a le plus de figures dans leur maison de repos (base ou résultante), sans compter une figure annulée par son attaquant lui aussi au repos, gagne ; à égalité, le cas ne tranche pas.',
      condition: function (L) {
        if (L.mode !== 'BOUCLES_DIFFERENTES') return null;
        function paire(c) { return [c.figure, fig(num(c.figure) + 2)]; }
        function chez(c) { return paire(c).filter(function (f) { return L.chezElle(f) && !L.chezElle(fig(num(f) - 3 + 16)); }); }   // une figure dont l'attaquant est aussi au repos est annulée
        var a = chez(L.R1), b = chez(L.R7);
        if (a.length === b.length) return null;
        var g = a.length > b.length ? L.R1 : L.R7, p = g === L.R1 ? L.R7 : L.R1, cg = chez(g), cp = chez(p);
        var sa = L.sommes.filter(function (x) { return x.camp === g.camp && x.surAxe.length; })[0], sp = L.sommes.some(function (x) { return x.camp === p.camp && x.surAxe.length; }) || L.sommes.some(function (x) { return x.pole; });
        var sure = !!sa && !sp;
        return { verdict: g === L.R1 ? '1' : '2', assuree: sure, raison: 'Victoire ' + g.camp + (sure ? ' assurée' : '') + ' : boucles différentes, paire ' + paire(g).join(' + ') + ' contre ' + paire(p).join(' + ') + '. ' +
          cg.map(function (f) { return f + ' en M' + num(f); }).join(' et ') + (cg.length > 1 ? ' sont dans leur maison de repos' : ' est dans sa maison de repos') + ' ; en face, ' + (cp.length ? 'seulement ' + cp.join(', ') : 'aucune') + '.'  + (sure ? ' De plus, ' + sa.figure + ', ' + sa.nom + ', est sur l’axe angulaire en base (M' + sa.surAxe.join(', M') + ') et appartient au camp de ' + g.camp + '.' : '') };
      }
    },
    {
      id: 'CAS-009', titre: 'Équilibre des ancrages : motif commun des nuls', statut: 'EN_ESSAI',
      enonce: 'Aucun autre cas ne tranche. D’abord : si la somme de l’axe angulaire (M1+M4+M7+M10) ou la somme 3-5-11-15 est elle-même un pôle, le thème se referme sur ce pôle : nul. Sinon le moteur compte, dans la boucle de chaque pôle (pair ou impair), les figures dans leur maison de repos en base et non annulées. Si une boucle en a plus que l’autre, son pôle gagne ; à égalité, les ancrages s’équilibrent : nul. Dans la même boucle, les pôles sont liés par la chaîne des attaques (chacun est l’antagoniste de l’antagoniste de l’autre, ou son binôme) : nul.',
      condition: function (L) {
        function ancres(c) { var n = num(c.figure); return FIG.filter(function (f) { return num(f) % 2 === n % 2 && L.chezElleEnBase(f) && !L.annuleePar(f); }); }
        // Premier critère du nul : une figure somme est elle-même un pôle, le thème se referme sur ce pôle.
        var sp = L.sommes.filter(function (x) { return x.pole; });
        if (sp.length) return { verdict: 'N', assuree: false, raison: 'Nul : ' + sp.map(function (x) { return 'la ' + x.nom + ' donne ' + x.figure + ', qui est le pôle ' + x.pole; }).join(' ; ') + '. Le thème se referme sur ce pôle.' };
        var a = ancres(L.R1), b = ancres(L.R7);
        function dit(l) { return l.length ? l.map(function (f) { return f + ' en M' + num(f); }).join(', ') : 'aucun'; }
        var detail = 'ancrages en base, non annulés : boucle de R1 ' + dit(a) + ' ; boucle de R7 ' + dit(b) + '.';
        if (L.mode !== 'BOUCLES_DIFFERENTES') {
          // Même boucle : les pôles sont liés par la chaîne des attaques, ce qui les tient en équilibre.
          var n1 = num(L.R1.figure), n7 = num(L.R7.figure), d = ((n7 - n1) % 16 + 16) % 16;
          if (d === 6 || d === 10) {
            var haut = d === 6 ? L.R1 : L.R7, bas = d === 6 ? L.R7 : L.R1, med = fig(num(haut.figure) + 3), pm = L.positions(med);
            var repos = [L.R1, L.R7].filter(function (c) { return L.chezElle(c.figure); }).map(function (c) { return c.camp; });
            return { verdict: 'N', assuree: false, raison: 'Nul, les ancrages s’équilibrent : ' + haut.camp + ' ' + haut.figure + ' attaque ' + med + ', qui attaque ' + bas.camp + ' ' + bas.figure + '. Chaque pôle est l’antagoniste de l’antagoniste de l’autre (' + med + (pm.length ? ' en M' + pm.map(function (x) { return x.maison; }).join(', M') : ' absent du thème') + ').' +
              (repos.length === 2 ? ' Les deux pôles sont chacun dans leur maison de repos.' : repos.length === 1 ? ' Seul ' + repos[0] + ' est dans sa maison de repos.' : '') };
          }
          return { verdict: 'N', assuree: false, raison: 'Nul, les ancrages s’équilibrent : les deux pôles sont dans la même boucle, ' + L.R1.figure + ' et ' + L.R7.figure + ' sont binômes, et aucun cas ne les départage.' };
        }
        if (a.length > b.length) return { verdict: '1', assuree: false, raison: 'Victoire R1 : ' + detail };
        if (b.length > a.length) return { verdict: '2', assuree: false, raison: 'Victoire R7 : ' + detail };
        // Ancrages égaux : on regarde les figures somme présentes en base ; si un seul camp en a, il gagne.
        var s1 = L.sommes.filter(function (x) { return x.camp === 'R1' && x.enBase.length; }), s7 = L.sommes.filter(function (x) { return x.camp === 'R7' && x.enBase.length; });
        if (s1.length && !s7.length) return { verdict: '1', assuree: false, raison: 'Victoire R1 : ancrages égaux, mais seule une figure somme du camp de R1 est en base (' + s1[0].figure + ', ' + s1[0].nom + ', en M' + s1[0].enBase.join(', M') + ').' };
        if (s7.length && !s1.length) return { verdict: '2', assuree: false, raison: 'Victoire R7 : ancrages égaux, mais seule une figure somme du camp de R7 est en base (' + s7[0].figure + ', ' + s7[0].nom + ', en M' + s7[0].enBase.join(', M') + ').' };
        return { verdict: 'N', assuree: false, raison: 'Nul, les ancrages s’équilibrent : ' + detail };
      }
    }
  ];
  // Applique une condition aux deux pôles ; tranche seulement si un seul des deux la remplit.
  function unSeul(L, ok, pourquoi) {
    var a = ok(L.R1, L.R7), b = ok(L.R7, L.R1);
    if (a === b) return null;
    var g = a ? L.R1 : L.R7, p = a ? L.R7 : L.R1;
    return { verdict: a ? '1' : '2', assuree: true, raison: 'Victoire ' + g.camp + ' assurée : ' + pourquoi(g, p) };
  }

  function analyser(theme, polesForces) {
    var L = lire(theme, polesForces), decision = null;
    for (var i = 0; i < CAS.length && !decision; i++) {
      var r = CAS[i].condition(L);
      if (r) decision = { verdict: r.verdict, statut: CAS[i].statut, phase: CAS[i].id, regle: CAS[i].titre, raison: r.raison, victoireAssuree: !!r.assuree };
    }
    if (!decision) decision = { verdict: null, statut: 'AUCUN_CAS', phase: 'AUCUN_CAS', regle: null, victoireAssuree: false,
      raison: 'Aucun cas défini ne s’applique à ce thème. Le moteur ne donne pas de verdict.' };
    // Déséquilibre fort (au moins deux ancrages d'écart) : « 12 » (pas de nul) et double chance pour le camp le plus stable.
    var st = L.stabilite;
    // Toujours renseigné : écart nul = équilibre ; écart de 1 = double chance du camp le plus stable ; écart de 2 ou plus = « 12 » en plus.
    decision.marches = { ancragesR1: st.R1.length, ancragesR7: st.R7.length, ecart: st.ecart, camp: st.plusStable, douze: st.fort,
      doubleChance: st.plusStable === 'R1' ? '1X' : st.plusStable === 'R7' ? 'X2' : null,
      niveau: st.fort ? 'FORT' : st.ecart === 1 ? 'LEGER' : 'EQUILIBRE' };
    decision.parlant = L.binomeM1.parlant;
    return { lecture: L, decision: decision };
  }

  var API = { version: VERSION, FIG: FIG, CAS: CAS, CARDINAL: CARDINAL, num: num, fig: fig, frontDe: frontDe, elementDe: elementDe,
    elementMaison: elementMaison, additionner: additionner, construireTheme: construireTheme, lire: lire, analyser: analyser,
    temoin: temoin, figureDuJour: figureDuJour };
  root.KOUN = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
