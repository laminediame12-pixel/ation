/* koun — moteur 3 : table rase des principes.
   La structure (thème, résultantes, forces, pôles) vient du moteur 2 : ce sont des calculs exacts, pas des principes de verdict.
   Tout ce qui décide (victoire, nul, pénalité, deux marquent, buts MT-1, corners, Over/Under) est reconstruit ici, principe par principe.
   Chaque principe porte sa provenance :
     PROPRIETAIRE : posé par le propriétaire.
     PORTE_3.0.0  : règle du 3.0.0 du propriétaire, reprise telle quelle.
     DEVELOPPEMENT: issu des matchs de développement, tient sur le lot 1 de validation.
     DEV_SEUL     : issu des matchs de développement seulement, jamais confirmé hors développement.
   Aucun principe ajusté sur un lot de validation. Un principe sans donnée réelle est marqué NON_TESTE. */
(function (root) {
  'use strict';
  var K = (typeof require !== 'undefined' && typeof module !== 'undefined') ? require('../moteur2/moteur.js') : root.KOUN2;
  var FIG = K.FIG, num = K.num, fig = K.fig, FRONTS = ['A', 'B', 'C', 'D'];
  var POINTS = {
    'Puer': [1, 1, 2, 1], 'Laetitia': [1, 2, 2, 2], 'Caput': [2, 1, 1, 1], 'Albus': [2, 2, 1, 2],
    'Via': [1, 1, 1, 1], 'Amissio': [1, 2, 1, 2], 'Rubeus': [2, 1, 2, 2], 'Tristitia': [2, 2, 2, 1],
    'Fortuna Minor': [1, 1, 2, 2], 'Carcer': [1, 2, 2, 1], 'Conjunctio': [2, 1, 1, 2], 'Fortuna Major': [2, 2, 1, 1],
    'Cauda Draconis': [1, 1, 1, 2], 'Puella': [1, 2, 1, 1], 'Aquisitio': [2, 1, 2, 1], 'Populus': [2, 2, 2, 2]
  };
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
    return {
      deuxMarquent: { oui: bttsFinal, brut: btts, pole1PeutMarquer: p1, pole7PeutMarquer: p7, elan: elan, provenance: 'PORTE_3.0.0 (seuil de 50 %), reconstruit sur les forces du moteur 2', teste: 'testé sur 26 scores réels' },
      score: g1 + ' - ' + g2, g1: g1, g2: g2, total: T,
      overUnder: { over15: T > 1.5, over25: T > 2.5, over35: T > 3.5, indiceNet: Math.round(net * 10) / 10, flux: Math.round(flux * 10) / 10, verrous: verrous, provenance: 'PORTE_3.0.0 (indice de flux, seuils 7 / 9,5 / 14,5)', teste: 'testé sur 26 scores réels' },
      butsMT1: { oui: T > 0 && htBut, libelle: mt, somme: bm, provenance: 'PORTE_3.0.0 (ButMT M1+M5+M12+M15)', teste: 'testé sur 6 matchs avec mi-temps connue' },
      corners: { libelle: corners, friction: fric, provenance: 'PORTE_3.0.0 (indice de friction)', teste: 'NON_TESTE (aucun résultat de corners dans les données)' }
    };
  }

  function analyser(theme) {
    var L = K.lire(theme), v = verdict(L);
    return { lecture: L, verdict: v, penalite: penalite(L), buts: buts(L, v.verdict || '1') };
  }
  var API = { version: '3.0.0-table-rase', PRINCIPES_VERDICT: PRINCIPES_VERDICT, FORCE_POLES: FORCE_POLES, construireTheme: K.construireTheme, fig: fig, num: num, FIG: FIG, lire: K.lire, analyser: analyser, verdict: verdict, penalite: penalite, buts: buts };
  root.KOUN3 = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
