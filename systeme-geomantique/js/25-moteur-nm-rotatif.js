// ═══════════════════════════════════════════════════════════════
// MOTEUR NM ROTATIF + G_vol — PORTÉ DEPUIS Algothme-161.html (14/09/26)
//
// Ellemine_D a fourni un fichier de travail parallèle (Algothme-161.html,
// dernière modification interne 10/09/26) contenant trois moteurs absents
// de ce dépôt : ce moteur de verdict rotatif (remplacement proposé du
// moteur de verdict actuel), sa couche de volume/buts/BTTS associée
// (G_vol), et un second détecteur d'incident indépendant (à porter
// séparément). Ce fichier porte les deux premiers.
//
// MÉTHODE (telle que documentée dans la source) : thème réel M1-M16 →
// maison de repos de M1 → rotation NM1-NM16 → poids de figure × flux
// élémentaire → scores → verrou Terre (Under 2,5) → pôles Domicile/
// Extérieur → écart → verdict 1N2. Le volume des buts (G_vol) est une
// couche séparée, branchée uniquement pour lire le marché Over/Under et
// le BTTS — elle ne participe pas au calcul du camp.
//
// ⚠️ BUG TROUVÉ EN PORTANT CE CODE, CORRIGÉ ICI. Dans la source,
// verdictNMRatif compare l'élément d'une figure (ELEMENTS_V7[fig], qui
// vaut 'feu'/'air'/'eau'/'terre' EN MINUSCULES dans tout ce dépôt — et
// déjà dans le fichier source lui-même, cf. sa propre définition de
// ELEMENTS) à des littéraux 'Feu'/'Air'/'Eau'/'Terre' EN MAJUSCULES
// (nmElementOppose, l'objet scores, le test du verrou Terre). En JS,
// 'terre' !== 'Terre' : la comparaison échoue TOUJOURS. Conséquence dans
// la source telle quelle : scores[x.element] est toujours undefined (les
// scores élémentaires ne s'accumulent jamais), le verrou Terre est
// toujours à 0 (jamais actif), et nmElementOppose ne détecte jamais de
// discorde — trois pans du moteur tournent à vide sans qu'aucune erreur
// ne le signale. Corrigé ici en alignant sur les minuscules utilisées
// partout ailleurs (ELEMENTS_V7 / MAISON_ELEM_V7, cf. 13-signaux-et-
// positions.js). nmVolumeMatrix (G_vol), elle, est indemne : elle
// définit ses propres clés capitalisées et les utilise de bout en bout,
// sans dépendre de ELEMENTS_V7/MAISON_ELEM_V7.
//
// ⚠️ NI MESURÉ NI BRANCHÉ. L'archive ne compte que 20 cas (cf.
// CAS_REFERENCE_V7_SUPPRIMEE_LE) — pas assez pour juger un moteur qui
// remplacerait le verdict actuel. BRANCHES_V7.nm_rotatif_verdict reste
// actif:false tant qu'aucune mesure sérieuse n'a été faite contre
// l'archive réelle. Les deux fonctions restent appelables directement
// pour comparaison manuelle en attendant.
// ═══════════════════════════════════════════════════════════════
var NM_FIGURE_POIDS = {
  carcer: 1, tristitia: 1, cauda_draconis: 1, caput_draconis: 2,
  acquisitio: 2, amissio: 2.5, conjunctio: 3.5, fortuna_major: 3,
  fortuna_minor: 3, puella: 2.5, puer: 5, rubeus: 5, albus: 3.5,
  populus: 4.5, via: 4.5, laetitia: 2
};
var NM_FLUX = { symbiotique: 1.5, moteur: 1.2, discorde: 0.5 };

function nmElementOppose(a, b) {
  return (a === 'feu' && b === 'eau') || (a === 'eau' && b === 'feu') ||
         (a === 'air' && b === 'terre') || (a === 'terre' && b === 'air');
}
function nmFluxForHouse(fig, house) {
  var fe = ELEMENTS_V7[fig];
  var he = MAISON_ELEM_V7[house];
  if (fe === he) return { type: 'symbiotique', multiplicateur: NM_FLUX.symbiotique };
  if (nmElementOppose(fe, he)) return { type: 'discorde', multiplicateur: NM_FLUX.discorde };
  return { type: 'moteur', multiplicateur: NM_FLUX.moteur };
}

function verdictNMRatif(theme) {
  if (!theme || !theme[1]) throw new Error('Thème absent ou incomplet');
  var anchorFigure = theme[1];
  var maisonRepos = getMaisonReposFigure(anchorFigure);
  var order = Array.from({ length: 16 }, function (_, i) { return ((maisonRepos - 1 + i) % 16) + 1; });
  var nm = order.map(function (house, i) {
    var fig = theme[house];
    var poids = Number(NM_FIGURE_POIDS[fig] || 0);
    var flux = nmFluxForHouse(fig, house);
    var score = poids * flux.multiplicateur;
    return { nm: i + 1, house: house, figure: fig, figureLabel: FL[fig] || fig,
      element: ELEMENTS_V7[fig], poids: poids, flux: flux.type,
      multiplicateur: flux.multiplicateur, score: score };
  });
  var scores = { feu: 0, air: 0, eau: 0, terre: 0 };
  nm.forEach(function (x) { if (scores[x.element] !== undefined) scores[x.element] += x.score; });

  // Verrou rotatif : contribution Terre de NM1 + NM16.
  var t1 = nm[0].element === 'terre' ? nm[0].score : 0;
  var t16 = nm[15].element === 'terre' ? nm[15].score : 0;
  var terreLockScore = t1 + t16;
  var verrouTerre = { nm1: t1, nm16: t16, total: terreLockScore, seuil: 6, actif: terreLockScore >= 6 };

  // Pôles : NM1 + NM4 + NM13 contre NM7 + NM10 + NM14.
  var sumNm = function (ns) { return ns.reduce(function (a, n) { return a + (nm[n - 1] ? nm[n - 1].score : 0); }, 0); };
  var poleDomicile = sumNm([1, 4, 13]);
  var poleExterieur = sumNm([7, 10, 14]);
  var delta = Math.abs(poleDomicile - poleExterieur);
  var winnerRotation = 'Nul';
  if (delta > 1.5) winnerRotation = poleDomicile > poleExterieur ? 'R1' : 'R7';
  var winner = winnerRotation === 'R1' ? 'M1' : winnerRotation === 'R7' ? 'M7' : 'Nul';

  // Rupture offensive aux extrémités de la rotation.
  var rupture = nm[0].score + nm[15].score;
  var under25 = verrouTerre.actif;
  var over25 = !under25 && rupture >= 6;

  var reasons = [];
  reasons.push('M1 = ' + (FL[anchorFigure] || anchorFigure) + ' → maison de repos M' + maisonRepos + ' → rotation NM1-NM16');
  reasons.push('Pôle domicile ' + poleDomicile.toFixed(1) + ' vs extérieur ' + poleExterieur.toFixed(1)
    + ' → Δ ' + delta.toFixed(1) + (delta > 1.5 ? ' → signal 1N2' : ' → écart insuffisant, Nul'));
  reasons.push('Verrou Terre NM1+NM16 = ' + terreLockScore.toFixed(1) + ' / seuil 6.0 → '
    + (under25 ? 'UNDER 2.5' : 'pas de verrou Terre'));
  reasons.push('Rupture NM1+NM16 = ' + rupture.toFixed(1) + ' → ' + (over25 ? 'OVER 2.5' : 'pas de signal Over 2.5'));

  var hR1 = maisonRepos, hR7 = ((maisonRepos + 5) % 16) + 1;
  var volumeNM = nmVolumeMatrix(theme, { order: order, hR1: hR1, hR7: hR7 });
  return {
    type: winner === 'Nul' ? 'indecis' : 'verdict', winner: winner, winnerRotation: winnerRotation,
    label: winner === 'M1' ? '🏆 VAINQUEUR : R1' : winner === 'M7' ? '🏆 VAINQUEUR : R7' : '⚖️ MATCH NUL probable',
    reason: '🔄 MOTEUR NM ROTATIF — ' + reasons.join(' | '),
    anchorFigure: anchorFigure, maisonRepos: maisonRepos, order: order, nm: nm, scores: scores, volumeNM: volumeNM,
    verrouTerre: verrouTerre,
    under25: volumeNM.G_vol !== null ? volumeNM.G_vol < 1.30 : under25,
    over25: volumeNM.G_vol !== null ? volumeNM.G_vol >= 1.30 : over25,
    overUnder: volumeNM.G_vol === null ? 'INDÉTERMINÉ' : (volumeNM.G_vol >= 1.30 ? 'OVER 2.5' : 'UNDER 2.5'),
    poleDomicile: poleDomicile, poleExterieur: poleExterieur, delta: delta,
    rupture: rupture, signal1N2: delta > 1.5,
    hR1: hR1, hR7: hR7, figR1: theme[hR1], figR7: theme[hR7]
  };
}

// ═══════════════════════════════════════════════════════════════
// MATRICE DU VOLUME — G_vol (MOTEUR ALGOTHME-5, indépendant du verdict)
// G_vol = (P_circ × μ × T_flu) × V. BTTS = OUI seulement si (Trigone Eau
// ou Trigone Air actif) ET G_vol >= 1,30 ET R1 actif ET R7 actif.
// Auto-suffisant : ne dépend d'aucune table de ce dépôt (ELEMENTS_V7,
// etc.), seulement de MAP_GEO pour le repli nmFigurePoints/nmFigureEnergy.
// ═══════════════════════════════════════════════════════════════
function nmFigurePoints(fig) {
  var row = MAP_GEO[fig];
  return Array.isArray(row) ? row : null;
}
function nmFigureEnergy(fig) {
  var row = nmFigurePoints(fig);
  return row ? row.reduce(function (a, b) { return a + Number(b || 0); }, 0) : 6;
}

function nmVolumeMatrix(theme, nmResult) {
  var FIG = {
    via: { s: [1, 1, 1, 1], p: 4, x: false },
    populus: { s: [2, 2, 2, 2], p: 8, x: false },
    conjunctio: { s: [2, 1, 1, 2], p: 6, x: false },
    albus: { s: [2, 2, 1, 2], p: 7, x: false },
    tristitia: { s: [2, 2, 2, 1], p: 7, x: false },
    laetitia: { s: [1, 2, 2, 2], p: 7, x: false },
    puella: { s: [1, 2, 1, 1], p: 5, x: false },
    acquisitio: { s: [2, 1, 2, 1], p: 6, x: false },
    amissio: { s: [1, 2, 1, 2], p: 6, x: false },
    caput_draconis: { s: [2, 1, 1, 1], p: 5, x: false },
    cauda_draconis: { s: [1, 1, 1, 2], p: 5, x: true },
    fortuna_major: { s: [2, 2, 1, 1], p: 6, x: false },
    fortuna_minor: { s: [1, 1, 2, 2], p: 6, x: true },
    rubeus: { s: [2, 1, 2, 2], p: 7, x: true },
    puer: { s: [1, 1, 2, 1], p: 5, x: true },
    carcer: { s: [1, 2, 2, 1], p: 6, x: false }
  };
  var norm = function (f) { return String(f || '').toLowerCase().replace(/\s+/g, '_'); };
  var get = function (f) { return FIG[norm(f)] || { s: nmFigurePoints(f) || [2, 2, 2, 2], p: nmFigureEnergy(f), x: false }; };
  var M = theme || {};

  // 1. Masse cinétique
  var totalPoints = Array.from({ length: 16 }, function (_, i) { return get(M[i + 1]).p; }).reduce(function (a, b) { return a + b; }, 0);
  var m_circ = totalPoints / 16.0;
  var p_circ = m_circ / 6.0;

  // 2. Malus de densité
  var has_explosive = Array.from({ length: 16 }, function (_, i) { return get(M[i + 1]).x; }).some(Boolean);
  var mu = (m_circ <= 5.0 && !has_explosive) ? 0.80 : 1.00;

  // 3. Fluidité des trigones
  var trigones_indices = { Feu: [1, 5, 9], Terre: [2, 6, 10], Eau: [3, 7, 11], Air: [4, 8, 12] };
  var elemIdx = { Feu: 0, Air: 1, Eau: 2, Terre: 3 };
  var T_status = {};
  Object.keys(trigones_indices).forEach(function (elem) {
    var idx = elemIdx[elem];
    var conducteurs = trigones_indices[elem].filter(function (h) { return get(M[h]).s[idx] === 1; }).length;
    T_status[elem] = conducteurs >= 2 ? 1 : 0;
  });
  var t_sum = Object.values(T_status).reduce(function (a, b) { return a + b; }, 0);
  var t_flu = 1.0 + (0.15 * t_sum);

  // 4. Saturation / volatilité
  var m16_name = norm(M[16]);
  var m16_explosive = ['puer', 'rubeus', 'cauda_draconis'].indexOf(m16_name) >= 0;
  var cardinals_explosive = [1, 4, 7, 10].some(function (k) { return ['puer', 'rubeus'].indexOf(norm(M[k])) >= 0; });
  var v = 1.00;
  if (m16_explosive || cardinals_explosive) v = 2.00;
  else if (T_status.Feu === 1 && T_status.Eau === 1) v = 1.65;
  else if ([1, 4, 7, 10].some(function (k) { return get(M[k]).x; })) v = 1.35;

  var G_vol = (p_circ * mu * t_flu) * v;

  // 5. Données R1/R7 utilisées uniquement comme filtre Volume/BTTS.
  var getReposActivity = function (reposHouse) {
    var reposFig = M[reposHouse];
    var struct = get(reposFig).s;
    var elements = ['Feu', 'Air', 'Eau', 'Terre'];
    var channels = [];
    elements.forEach(function (elem, idx) {
      if (struct[idx] === 1 && T_status[elem] === 1) channels.push(elem);
    });
    return { active: channels.length > 0, channels: channels };
  };
  var r1 = getReposActivity(9);
  var r7 = getReposActivity(3);

  // 6. Filtre asymétrie / BTTS
  var r1_active = r1.active, r7_active = r7.active;
  var btts_trigger = (T_status.Eau === 1 || T_status.Air === 1) && G_vol >= 1.30 && r1_active && r7_active;

  // 7. Marché et projections
  var market, score_profile;
  if (G_vol < 1.10) { market = 'UNDER 1.5'; score_profile = '1 - 0 / 0 - 0'; }
  else if (G_vol < 1.35) { market = 'UNDER 2.5'; score_profile = '2 - 0 / 1 - 1'; }
  else if (G_vol < 1.80) { market = 'OVER 1.5 (2-3 buts)'; score_profile = btts_trigger ? '2 - 1 / 3 - 1' : '2 - 1 / 3 - 0'; }
  else if (G_vol < 2.30) { market = 'OVER 2.5 (3-4 buts)'; score_profile = btts_trigger ? '3 - 1 / 3 - 2' : '3 - 0 / 4 - 0'; }
  else { market = 'OVER 3.5 / SCORE FLEUVE (5+ buts)'; score_profile = btts_trigger ? '5 - 1 / 6 - 1 (Score Fleuve avec Réplique)' : '5 - 0 / 7 - 0 (Carnage Unilatéral)'; }

  var freq = {};
  ['Feu', 'Air', 'Eau', 'Terre'].forEach(function (e) {
    var idx = elemIdx[e];
    freq[e] = Array.from({ length: 16 }, function (_, i) { return get(M[i + 1]).s[idx] === 1 ? 1 : 0; }).reduce(function (a, b) { return a + b; }, 0) / 16;
  });
  var canauxActifs = Object.values(freq).filter(function (x) { return x >= 0.50; }).length;
  var energies = Array.from({ length: 16 }, function (_, i) { return nmFigureEnergy(M[i + 1]); });

  return {
    order: nmResult && nmResult.order ? nmResult.order : null,
    nm: nmResult && nmResult.order ? nmResult.order.map(function (house, i) { return { nm: i + 1, house: house, figure: M[house] }; }) : [],
    freq: freq, canauxActifs: canauxActifs, energies: energies,
    M_circ: m_circ, P_circ: p_circ, mu: mu, V: v,
    T_status: T_status, T_flu: t_flu, G_vol: G_vol,
    volume: G_vol >= 1.30 ? 'ÉLEVÉ' : 'FAIBLE',
    btts: btts_trigger, BTTS: btts_trigger ? 'OUI' : 'NON',
    Marche: market, 'Marché': market, Profil_Score: score_profile,
    M16: M[16], m16Explosive: m16_explosive,
    Canaux_R1_Volume: r1.channels.join(' + ') || 'Inerte',
    Canaux_R7_Volume: r7.channels.join(' + ') || 'Inerte',
    r1Active: r1_active, r7Active: r7_active,
    regleBTTS: '(Trigone Eau = 1 ou Trigone Air = 1) ET G_vol >= 1.30 ET R1 actif ET R7 actif',
    formuleGvol: 'G_vol = (P_circ × μ × T_flu) × V',
    source: 'Moteur GeomanticVolumeEngine porté depuis Algothme-161.html (14/09/26)'
  };
}

autoTestV7('le moteur NM Rotatif calcule sans jamais planter, sur un thème réel', function () {
  if (typeof calcTheme !== 'function') return;
  var t = calcTheme('laetitia', 'amissio', 'fortuna_minor', 'laetitia');
  var v = verdictNMRatif(t);
  if (!v || !v.winner) throw new Error('verdictNMRatif ne renvoie pas de vainqueur exploitable');
  if (typeof v.volumeNM.G_vol !== 'number' || isNaN(v.volumeNM.G_vol))
    throw new Error('G_vol doit être un nombre, reçu ' + v.volumeNM.G_vol);
});

autoTestV7('le verrou Terre du moteur NM Rotatif peut s\'activer (bug de casse corrigé)', function () {
  // ☠️ Avant le portage, ce test aurait échoué EN SILENCE dans la
  // source : scores/verrouTerre comparaient un élément en minuscules à
  // des littéraux en majuscules et ne s'activaient JAMAIS. On vérifie
  // ici que la version corrigée peut réellement accumuler des scores
  // élémentaires et activer le verrou sur au moins un thème construit
  // pour ça (rotation à forte dominance Terre).
  if (typeof calcTheme !== 'function') return;
  var t = calcTheme('carcer', 'tristitia', 'fortuna_major', 'carcer');
  var v = verdictNMRatif(t);
  var total = v.scores.feu + v.scores.air + v.scores.eau + v.scores.terre;
  if (total <= 0) throw new Error('les scores élémentaires ne s\'accumulent jamais — le bug de casse est revenu');
});

autoTestV7('le moteur NM Rotatif reste hors du verdict tant qu\'il n\'est pas mesuré', function () {
  if (typeof BRANCHES_V7 === 'undefined' || !BRANCHES_V7.nm_rotatif_verdict) return;
  if (BRANCHES_V7.nm_rotatif_verdict.actif)
    throw new Error('nm_rotatif_verdict est actif sans mesure contre l\'archive — impossible aujourd\'hui');
});
