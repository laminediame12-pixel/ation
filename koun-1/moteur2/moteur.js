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
    function force(f, h) {
      if (num(f) === h) return doubleRepos(f) ? null : 100;
      return BAREME[[elementDe(f), elementMaison(h)].sort().join('|')];
    }
    function motif(f, h) {
      if (num(f) === h) return doubleRepos(f) ? 'DOUBLE_REPOS_NON_CHIFFRE' : 'REPOS_PROPRE_MAXIMAL';
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
    return { theme: theme, maisons: maisons, R1: R1, R7: R7, duels: duels, annulations: annulations,
      verrous: { R1: verrousDuFront(R1.front), R7: verrousDuFront(R7.front) },
      presentEn: presentEn, chezElle: chezElle, force: force, motif: motif, positions: positions };
  }

  // ── Étage 2 : les cas ──────────────────────────────────────────────────
  // Un cas = { id, titre, statut, condition(lecture) }. La condition rend null, ou
  // { verdict: '1' | '2' | 'N', assuree: bool, raison: texte }. Le premier cas qui s'applique tranche.
  var CAS = [
    {
      id: 'CAS-001', titre: 'Même front : nul', statut: 'REGLE_CONFIRMEE',
      enonce: 'R1 et R7 dans le même front (figure identique, miroir ou voisine) : nul.',
      condition: function (L) {
        if (L.R1.front !== L.R7.front) return null;
        var lien = L.R1.figure === L.R7.figure ? 'identiques' : (L.R1.miroir === L.R7.figure ? 'miroirs' : 'voisines');
        return { verdict: 'N', assuree: false, raison: 'Nul : R1 ' + L.R1.figure + ' et R7 ' + L.R7.figure + ' sont dans le même front ' + L.R1.front + ' (figures ' + lien + ').' };
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
  ];

  function analyser(theme, polesForces) {
    var L = lire(theme, polesForces), decision = null;
    for (var i = 0; i < CAS.length && !decision; i++) {
      var r = CAS[i].condition(L);
      if (r) decision = { verdict: r.verdict, statut: CAS[i].statut, phase: CAS[i].id, regle: CAS[i].titre, raison: r.raison, victoireAssuree: !!r.assuree };
    }
    if (!decision) decision = { verdict: null, statut: 'AUCUN_CAS', phase: 'AUCUN_CAS', regle: null, victoireAssuree: false,
      raison: 'Aucun cas défini ne s’applique à ce thème. Le moteur ne donne pas de verdict.' };
    return { lecture: L, decision: decision };
  }

  var API = { version: VERSION, FIG: FIG, CAS: CAS, CARDINAL: CARDINAL, num: num, fig: fig, frontDe: frontDe, elementDe: elementDe,
    elementMaison: elementMaison, additionner: additionner, construireTheme: construireTheme, lire: lire, analyser: analyser };
  root.KOUN = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
