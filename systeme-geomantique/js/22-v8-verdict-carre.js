// ═══════════════════════════════════════════════════════════════
// V8 VERDICT CARRE
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
function memeBoucleV8(theme) {
  var r = null;
  try { r = getRotationCombat(theme); } catch (e) { return null; }
  if (!r || !r.figR1 || !r.figR7 || typeof loopOf !== 'function') return null;
  var a = loopOf(r.figR1), b = loopOf(r.figR7);
  if (!a || !b) return null;
  return a === b;
}

// Le moteur. Il ne rend QUE le camp : le nul est décidé en amont par
// nulActifV7, qui garde son dossier (8 nuls vus sur 12, 4 fausses
// alertes sur 39 non-nuls) et que rien n'a battu.
function moteurV8V7(theme) {
  var mb = memeBoucleV8(theme);
  var p = null;
  try { p = partageSyntheseV7(theme); } catch (e) { p = null; }
  if (ARCHI_V8 === 'deux' && mb === true) {
    return { camp: 'R1', voie: 'même boucle — rien ne bat le témoin (15/25)',
      memeBoucle: true, partage: p ? p.camp : null };
  }
  if (!p) return { camp: null, voie: 'partage de la synthèse indisponible', memeBoucle: mb, partage: null };
  return { camp: p.camp, memeBoucle: mb, partage: p.camp,
    voie: 'partage de la synthèse — M13/M14/M15 ' + p.e13 + '/' + p.e14 + '/' + p.e15
      + (p.tousDifferents ? ' : trois différents → R1' : ' : au moins deux partagent → R7')
      + (mb === true ? ' (même boucle : le partage n\'y rapporte rien de plus que « toujours R1 »)' : '') };
}

// ═══════════════════════════════════════════════════════════════
// ✦ LE VERDICT STANDARD — DIX LIGNES (31/08/26)
//
// Format demandé par Ellemine_D, mot pour mot : vainqueur · score exact ·
// double chance · les deux marquent · mi-temps 1 buts · nombre de corners
// · nombre de cartons jaunes · plus/moins de 2,5 buts · incidents ·
// buts de la tête.
//
// CHAQUE LIGNE SORT AVEC SON DOSSIER. Une prédiction sans son taux est
// une opinion déguisée en chiffre ; ici on ne peut plus lire l'une sans
// l'autre. Mesuré sur l'archive au 31/08/26 :
//     double chance ............ 42/51   82 %   ← la meilleure ligne
//     incident ................. 6/8     75 %
//     vainqueur ................ 35/51   69 %
//     les deux marquent ........ 28/41   68 %
//     plus de 2,5 buts ......... 23/43   53 %   ← à peine une pièce
//     but en 1re mi-temps ...... 2/5     40 %
//     score exact .............. 13/43   30 %
//     corners (±3) ............. 0/1
//     cartons jaunes ........... AUCUN CAS — le champ n'a jamais été saisi
//     buts de la tête .......... 0 CAS — la ligne n'existait pas
//
// ⚠️ CE QUE CE TABLEAU DIT DE TRAVERS SI ON NE LE LIT PAS EN ENTIER : la
// double chance n'est pas « meilleure » parce qu'elle voit mieux, elle
// est meilleure parce qu'elle demande MOINS. Elle couvre deux issues sur
// trois ; le hasard seul y ferait déjà 100 % − le taux de l'issue exclue,
// soit environ 76 % avec la répartition de l'archive (23 R1, 16 R7,
// 12 nuls). 82 % contre 76 % de base, ce n'est pas un exploit — c'est
// un pari plus large, à cote plus basse.
// Et « plus de 2,5 buts » à 53 % ne dit rien du tout.
//
// ☠️ BUTS DE LA TÊTE : cette ligne n'existait nulle part et l'archive
// n'a AUCUN cas. La lecture proposée ci-dessous est de la doctrine pure,
// jamais confrontée à un seul match — Caput Draconis, la TÊTE du dragon,
// présente EN BASE (pas en résultante) dans une maison de but. C'est
// cohérent avec le vocabulaire du système et ça ne vaut rien tant qu'un
// résultat ne l'aura pas touchée. Elle est marquée « 0 cas » à l'écran
// pour qu'on ne l'oublie pas.
var DOSSIER_LIGNES_V7 = {
  vainqueur:    { juste: 35, sur: 51 },
  score:        { juste: 13, sur: 43 },
  doubleChance: { juste: 42, sur: 51, note: 'pari plus large — le hasard y fait déjà ~76 %' },
  btts:         { juste: 28, sur: 41 },
  miTemps1:     { juste: 2,  sur: 5 },
  corners:      { juste: 0,  sur: 1 },
  cartons:      { juste: 0,  sur: 0 },
  buts25:       { juste: 23, sur: 43, note: 'à peine une pièce' },
  incident:     { juste: 6,  sur: 8 },
  tete:         { juste: 0,  sur: 0, note: 'doctrine pure, jamais mesurée' }
};

function verdictStandardV7(theme, teamA, teamB) {
  if (!theme || !theme[1]) return null;
  var A = teamA || 'R1', B = teamB || 'R7';
  var v = null;
  try { v = getVerdictAfficheReel(theme); } catch (e) { return null; }
  var dit = v.nulActif ? 'nul' : (v.winner === 'M1' ? 'R1' : 'R7');
  var p = String(v.scoreMain || '').match(/^(\d+)-(\d+)$/);
  var g1 = p ? +p[1] : null, g7 = p ? +p[2] : null;
  var r = null; try { r = getRotationCombat(theme); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }

  // 3 · double chance : on exclut l'issue que le verdict écarte le plus.
  var dc = (dit === 'R7') ? 'X2' : '1X';
  var dcTexte = (dc === '1X') ? ('1X — ' + A + ' ou nul') : ('X2 — nul ou ' + B);

  // 5 · mi-temps 1 : y a-t-il but avant la pause ?
  var mt1 = null, mt1Detail = '';
  try {
    var bm = butParMiTemps(theme);
    var sp = bm && bm.premiereMiTemps ? String(bm.premiereMiTemps.score || '').match(/^(\d+)-(\d+)$/) : null;
    if (sp) { mt1 = ((+sp[1]) + (+sp[2])) > 0; mt1Detail = bm.premiereMiTemps.score; }
  } catch (e) { mt1 = null; }

  // 6 · corners
  var corners = null;
  try {
    if (r && g1 !== null) {
      var ec = estimerCornersV7(theme, g1, g7, r.figR1, r.figR7, null, null);
      if (ec && typeof ec.total === 'number') corners = ec.total;
    }
  } catch (e) { corners = null; }

  // 7 · cartons jaunes
  var cartons = null;
  try {
    if (r) {
      var cj = estimerCartonsJaunesV7(theme, calculerButsCamp(r.figR1, theme), calculerButsCamp(r.figR7, theme));
      if (cj && typeof cj.count === 'number') cartons = cj.count;
    }
  } catch (e) { cartons = null; }

  // 9 · incidents — la somme d'axes (6/8) contre les dérivés, on dit les deux
  var incS = null, incD = null, incRouge = 0;
  try { var sa = sommesAxesIncidentV7(theme); if (sa) incS = sa.signal; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  try { var dd = incidentDerivesV7(theme); if (dd) { incD = dd.moyenne >= 50; incRouge = dd.rouges; } } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  var incTexte;
  if (incS === null && incD === null) incTexte = '—';
  else if (incS && incD) incTexte = (incRouge > 0) ? 'penalty ET rouge' : 'penalty ou rouge';
  else if (incS || incD) incTexte = 'possible — les deux lectures se contredisent';
  else incTexte = 'aucun';

  // 10 · buts de la tête — doctrine pure, 0 cas.
  var tete = null, teteOu = [];
  try {
    for (var h = 1; h <= 12; h++) if (theme[h] === 'caput_draconis') teteOu.push(h);
    tete = teteOu.length > 0;
  } catch (e) { tete = null; }

  return {
    vainqueur:    { valeur: v.nulActif ? 'NUL' : (dit === 'R1' ? A : B), brut: dit },
    score:        { valeur: v.scoreMain, alt: v.scoreAlt },
    doubleChance: { valeur: dc, texte: dcTexte },
    btts:         { valeur: v.btts === true ? 'OUI' : v.btts === false ? 'NON' : '—', brut: v.btts },
    miTemps1:     { valeur: mt1 === null ? '—' : (mt1 ? 'OUI' : 'NON'), detail: mt1Detail },
    corners:      { valeur: corners === null ? '—' : corners },
    cartons:      { valeur: cartons === null ? '—' : cartons },
    buts25:       { valeur: (g1 === null) ? '—' : ((g1 + g7) > 2.5 ? 'PLUS de 2,5' : 'MOINS de 2,5'),
                    total: (g1 === null) ? null : (g1 + g7) },
    incident:     { valeur: incTexte, sommes: incS, derives: incD, rouges: incRouge },
    tete:         { valeur: tete === null ? '—' : (tete ? 'OUI' : 'non'),
                    detail: teteOu.length ? ('Caput Draconis en base : M' + teteOu.join(', M')) : 'Caput Draconis absent des douze maisons' }
  };
}

// ═══════════════════════════════════════════════════════════════
// ✦ LE CAMP : UN SEUL DÉCIDEUR (01/09/26, rappel d'Ellemine_D)
//
// Son constat, et il est juste : « les anciens moteurs prennent toujours
// des décisions, alors qu'on avait bien décidé de les supprimer. »
// À la reprise à zéro (a70f8f9) j'avais branché le moteur V8 en tête et
// LAISSÉ derrière lui les sept étages de l'ancienne cascade, en repli.
// C'était mon choix de prudence, pas le sien, et il ne l'a jamais
// demandé. La cascade partait :
//     1. moteurCritereV7 (les sept critères)
//     2. moteurF4P4V7
//     3. lectureSiegesR1R7
//     4. voteMoteursV7 (les dix moteurs)
//     5. analyseAncrageDeveloppe
//     6. analyserReseauAncrageV2
//     7. comparerBouclesAntagonistesR1R7
//
// 📊 MESURÉ AVANT DE COUPER : sur 3000 thèmes au hasard et sur les 55
// cas de l'archive, la cascade n'a JAMAIS tranché — pas une fois. Le
// moteur V8 rend toujours un camp (le partage de la synthèse est
// disponible dès que M13, M14 et M15 existent, donc toujours). Les sept
// étages étaient déjà du code mort sur la décision ; ils étaient
// seulement encore exécutés, et encore lisibles comme s'ils décidaient.
// Les retirer ne change donc AUCUN verdict — vérifié par A/B.
//
// ➜ CE QUI DÉCIDE MAINTENANT, ET C'EST TOUT :
//     le nul .... nulActifV7 (doctrine des deux portes), en amont
//     le camp ... moteurV8V7, et rien d'autre
//     le score .. calculerButsCamp, dans buildVerdictCard
// ⚠️ Et par voie de conséquence : voteMoteursV7 et les dix moteurs qui
// votent ne décident PLUS RIEN du tout. Ils restent calculés et affichés
// comme panneau de lecture — c'est leur seul rôle désormais.
//
// ⏱️ CE QUE ÇA COÛTAIT. Avec la cascade et les sept calculs morts de
// getVerdictAfficheReel, un verdict prenait 6,27 ms. Sans eux : 2,37 ms.
// 62 % de moins, 2,6 fois plus rapide, pour une sortie STRICTEMENT
// identique (A/B par clé : 2055 clés, 0 différence). Une partie de la
// lenteur dont il se plaignait le 31/08 venait de là — de moteurs qu'on
// exécutait à chaque verdict et dont personne ne lisait la réponse.
// ═══════════════════════════════════════════════════════════════
// 🔲 LE CARRÉ COMME MOTEUR PILOTE (03/09/26, sa demande : « tu peux
// faire le carré comme moteur piloteur du verdict final »)
// ═══════════════════════════════════════════════════════════════
// Il agrège les signaux du carré EN CADRE TOURNÉ — le seul qui parle des
// camps (loi U.4bis : R1 ne vaut M1 que dans 4 cas d'archive sur 53) :
//   · affirmations   combien des cinq triangles du pôle affirment
//   · influence      total des occurrences des cinq sommes
//   · duels          triangle contre triangle, paire par paire
// Vote à trois voix. Quand le carré est muet (0), V8 répond.
//
// ☠️ ET VOICI CE QUE ÇA COÛTE, MESURÉ AVANT D'ÊTRE BRANCHÉ.
// Sur les 53 cas de l'archive qui portent un camp, en comptant LE
// VERDICT AFFICHÉ de bout en bout (porte du nul comprise), pas un
// moteur isolé — c'est getVerdictAfficheReel qui est rejoué, une fois
// avec chaque pilote :
//       pilote V8 (le précédent) ...................... 36/53  (68 %)
//       pilote CARRÉ, mode fixe (défaut) .............. 30/53  (57 %)
//       pilote CARRÉ, mode rotation ................... 24/53  (45 %)
//       « R1 toujours », taux de base ................. 23/53  (43 %)
// ➜ LE BRANCHEMENT COÛTE SIX CAS au défaut, douze en rotation.
// ⚠️ CHIFFRES DU 03/09/26, RÈGLE DES TRAJECTOIRES FORTES. La première
// version du pilote (comptage d'affirmations, cadre tourné) faisait
// 26/53. Sa règle des trajectoires fortes l'a fait remonter à 30/53 en
// mode fixe : elle est meilleure que ce que j'avais bricolé, et elle
// reste sous V8.
// ⚠️ Ces chiffres sont IN SAMPLE : l'archive a servi à les mesurer, pas
// à les valider. Le vrai test sera la prochaine prédiction gelée.
//
// ⚠️ ET CE N'EST PAS UN SIGNAL INVERSÉ. J'ai vérifié avant de le dire :
//   · sur 600 thèmes quelconques le carré est ÉQUILIBRÉ — 255 R1,
//     261 R7, 84 muets. Aucun biais de fabrication.
//   · s'il penche R7 sur l'archive (28 contre 18) alors que la réalité
//     penche R1 (23 contre 18), c'est un accident d'échantillon.
//   · retourner sa réponse donne 20/37 (54 %), p = 0,37. Rien.
// Le carré ne porte pas d'information sur le camp, ni à l'endroit ni à
// l'envers. Il est branché parce qu'il l'a demandé, et le fichier dit
// ce que ça coûte.
//
// 🔧 POUR REVENIR EN ARRIÈRE : passer PILOTE_VERDICT_V7 à 'v8'. Rien
// d'autre à toucher — la ligne « source décisive » du panneau VERDICT
// nomme toujours le pilote qui a réellement tranché.
// ═══════════════════════════════════════════════════════════════
// 🔲 LA FORCE D'UNE TRAJECTOIRE, ET LES DEUX ZONES (03/09/26, sa
// doctrine : « pour le verdict c'est la zone entre m1 et m7 qui a plus
// de trajectoires fortes qui remporte »)
// ═══════════════════════════════════════════════════════════════
// ☠️ CE QUE ÇA REMPLACE. Les zones étaient notées à la dignité
// accidentelle des cinq maisons de chaque moitié du dessin. Même après
// la correction de la loi T, ça ne pouvait rien dire : les deux moitiés
// portent le même jeu de catégories, l'écart tombait dans le bruit de la
// régence (−0,25 sur son thème du 03/09) et le panneau répondait
// « carré équilibré » presque à chaque fois. Le découpage spatial est
// abandonné pour la notation : une ZONE, c'est désormais LES CINQ
// TRAJECTOIRES DE SON PÔLE (loi R), et son score est leur force.
//
// LA FORCE D'UNE TRAJECTOIRE, telle qu'il l'a définie (loi Q : « le
// comment réside dans sa position, son environnant et son influence
// dans le thème ») :
//     · sa somme est ABSENTE du thème → force 0, trajectoire morte
//     · sa somme est PRÉSENTE → on additionne, sur CHAQUE maison où
//       elle figure, le poids de la catégorie de cette maison :
//           angulaire 3 · succédente 2 · cadente 1
//       — la position ET l'influence dans un seul nombre, puisqu'une
//       figure présente trois fois compte trois fois.
//     · une trajectoire est FORTE quand sa force atteint 3, c'est-à-dire
//       qu'elle touche une angulaire, ou qu'elle est présente assez de
//       fois pour valoir autant.
// La zone qui compte le plus de trajectoires fortes l'emporte ; à
// égalité, la force totale départage.
//
// ⚠️ LE SEUIL ET LES POIDS VIENNENT DE SA DOCTRINE, PAS DU SCORE. Je le
// dis parce que la tentation était réelle : sur l'archive, « force
// totale en maisons fixes » fait 27/53 (51 %) contre 25/53 pour la règle
// livrée. Choisir la variante qui gagne sur les cas qui servent à la
// mesurer, c'est se fabriquer un résultat. La règle livrée est celle
// qu'il a énoncée.
// MESURÉ, sur les 53 cas de l'archive qui portent un camp (base 43 %) :
//     maisons fixes  nb de fortes 16/53 · force totale 27/53 · règle livrée 25/53 (47 %)
//     cadre tourné   nb de fortes 22/53 · force totale 16/53 · règle livrée 17/53 (32 %)
// Meilleur p unilatéral : 0,44. Rien n'est significatif.
// Les cinq paires du miroir (loi R), déclarées ICI parce que le bloc du
// carré est une IIFE et ne peut rien exporter.
var PAIRES_MIROIR_V7 = [[2, 12], [3, 11], [4, 10], [5, 9], [6, 8]];
var POIDS_CATEGORIE_TRAJ_V7 = { angulaire: 3, succedente: 2, cadente: 1 };
var SEUIL_TRAJ_FORTE_V7 = 3;

// LE MODE DU CARRÉ (sa demande du 03/09/26, le choix est à l'écran).
//   'fixe'     les zones restent sur les maisons du DESSIN, M1 et M7.
//   'rotation' les zones suivent R1 et R7, en passant les cinq paires
//              du miroir par l'ordre de rotation.
//
// DÉFAUT : 'fixe', et pour une raison de doctrine, pas de score. Le
// carré est DESSINÉ en maisons fixes ; quand il regarde « la zone entre
// M1 et M7 », c'est celle-là qu'il a sous les yeux. Le mode qui
// correspond à ce qu'on voit doit être celui qui s'ouvre.
//
// ⚠️ ET LE PIÈGE DU MODE FIXE, dit franchement : en fixe, le moteur
// renvoie 'R1' quand la zone M1 l'emporte, alors que M1 n'est le siège
// R1 que si la rotation est triviale — 4 cas d'archive sur 53 (loi
// U.4bis). C'est un raccourci assumé, pas une équivalence. Le panneau
// écrit « M1 » et « M7 » en mode fixe, « R1 » et « R7 » en rotation,
// pour qu'on ne s'y trompe pas à la lecture.
//
// MESURÉ, verdict affiché de bout en bout, 53 cas avec camp :
//     pilote V8 ................................. 36/53  (68 %)
//     pilote carré, mode FIXE ................... 30/53  (57 %)  · muet 4 fois
//     pilote carré, mode ROTATION ............... 24/53  (45 %)  · muet 2 fois
//     « R1 toujours », taux de base ............. 23/53  (43 %)
// ☠️ Le mode fixe fait six cas de mieux que la rotation — sur 53 cas
// c'est DANS LE BRUIT, et ce n'est donc pas ce qui a décidé du défaut.
// Je l'écris pour qu'on ne relise pas ce choix comme une optimisation.
var MODE_CARRE_V7 = 'fixe';

// Bascule à l'écran (sa demande du 03/09/26). Elle change TOUT ce qui
// dépend du cadre d'un coup : les deux zones, le rapport de force, et le
// moteur pilote — puisque les trois passent par zonesTrajectoiresV7 ou
// par mapCarreV7. Un seul interrupteur, aucun réglage à retrouver
// ailleurs.
// ⚠️ CORRIGÉ LE 04/09/26 : ce commentaire disait « le mode CHANGE LE
// VERDICT quand le carré pilote ». Ce n'est plus vrai depuis que la
// cascade est passée à ORDRE_VERDICT_V7 = ['m4m10','v8','carre'] : le
// carré est désormais DERNIER RECOURS, donc le mode fixe/rotation ne
// peut plus changer le verdict que dans les thèmes où M4/M10 ET V8 se
// taisent tous les deux. Il change toujours l'affichage du carré et sa
// lecture, comme avant.
window.setModeCarreV7 = function (mode) {
  MODE_CARRE_V7 = (mode === 'fixe') ? 'fixe' : 'rotation';
  var sel = document.getElementById('carreModeSelect');
  if (sel && sel.value !== MODE_CARRE_V7) sel.value = MODE_CARRE_V7;
  try { if (typeof renderTheme === 'function' && typeof currentTheme !== 'undefined' && currentTheme) renderTheme(); }
  catch (e) { console.error('carré : re-rendu après changement de mode', e); }
  return MODE_CARRE_V7;
};

// ═══ STYLE DU CARRÉ — COULEUR / MONOCHROME (03/09/26, demande
// Ellemine_D : reproduire le rendu d'un thème astrologique classique
// qu'elle a envoyé en exemple, sans les couleurs) ═══
// N'affecte QUE le dessin (renderCarreGeomantique) : aucune donnée, aucun
// calcul, aucun verdict n'en dépend — contrairement à MODE_CARRE_V7 qui,
// lui, peut piloter le verdict. Purement visuel, réversible d'un clic.
var STYLE_CARRE_V7 = 'couleur';
window.setStyleCarreV7 = function (style) {
  STYLE_CARRE_V7 = (style === 'mono') ? 'mono' : 'couleur';
  var sel = document.getElementById('carreStyleSelect');
  if (sel && sel.value !== STYLE_CARRE_V7) sel.value = STYLE_CARRE_V7;
  try { window.redessinerCarreGeoV7(); } catch (e) { console.error('carré : re-rendu après changement de style', e); }
  return STYLE_CARRE_V7;
};

function mapCarreV7(theme) {
  if (MODE_CARRE_V7 !== 'rotation') return function (h) { return h; };
  var ordre = null;
  try { ordre = getRotationOrderFromRepos(theme[1]); } catch (e) { ordre = null; }
  if (!ordre) return function (h) { return h; };
  return function (h) { return ordre[h - 1]; };
}

// ⚠️ LE CAS DES MAISONS XIII À XVI, DIT EXPLICITEMENT plutôt que laissé
// à un repli tacite : MAISON_CATEGORIE ne va que jusqu'à XII (la
// doctrine angulaire/succédente/cadente est faite pour douze maisons).
// Une somme qui figure en XIII-XVI compte donc POIDS_HORS_DOUZE_V7 = 1,
// le poids le plus faible — elle est présente, mais dans une maison dont
// la doctrine ne dit rien. C'est le choix le plus prudent : il ne lui
// prête pas une force qu'aucune règle ne lui donne, et il ne l'efface
// pas non plus. À revoir le jour où M13-M16 auront une doctrine (cf. sa
// consigne « ignore les [M13-16] on y reviendra »).
var POIDS_HORS_DOUZE_V7 = 1;

function forceTrajectoireV7(theme, somme) {
  var f = 0, ou = [];
  for (var h = 1; h <= 16; h++) {
    if (theme[h] === somme) {
      var cat = MAISON_CATEGORIE[h];
      f += cat ? POIDS_CATEGORIE_TRAJ_V7[cat] : POIDS_HORS_DOUZE_V7;
      ou.push(h);
    }
  }
  return { force: f, ou: ou, forte: f >= SEUIL_TRAJ_FORTE_V7 };
}

// theme DOIT être canonique (identifiants 'carcer', pas "Carcer") —
// garde-fou de la loi T.
function zonesTrajectoiresV7(theme) {
  if (!theme || typeof FIGS_V7 === 'undefined' || typeof combineMany !== 'function') return null;
  for (var h = 1; h <= 16; h++) {
    if (theme[h] && FIGS_V7.indexOf(theme[h]) < 0) {
      return { erreur: 'thème non canonique (' + theme[h] + ') — calcul refusé' };
    }
  }
  var map = mapCarreV7(theme);
  function zone(apex) {
    return PAIRES_MIROIR_V7.map(function (p) {
      var maisons = [map(apex), map(p[0]), map(p[1])];
      var somme = combineMany([theme[maisons[0]], theme[maisons[1]], theme[maisons[2]]]);
      var F = forceTrajectoireV7(theme, somme);
      return { base: p, maisons: maisons, somme: somme, force: F.force, ou: F.ou, forte: F.forte };
    });
  }
  var z1 = zone(1), z7 = zone(7);
  var n1 = z1.filter(function (x) { return x.forte; }).length;
  var n7 = z7.filter(function (x) { return x.forte; }).length;
  var t1 = z1.reduce(function (s, x) { return s + x.force; }, 0);
  var t7 = z7.reduce(function (s, x) { return s + x.force; }, 0);
  var camp = null, motif = null;
  if (n1 !== n7) { camp = n1 > n7 ? 'R1' : 'R7'; motif = 'trajectoires fortes ' + n1 + ' contre ' + n7; }
  else if (t1 !== t7) { camp = t1 > t7 ? 'R1' : 'R7'; motif = 'à égalité de fortes (' + n1 + '), la force totale départage : ' + t1 + ' contre ' + t7; }
  else { motif = 'zones identiques — ' + n1 + ' fortes et ' + t1 + ' de force de chaque côté'; }
  return {
    mode: MODE_CARRE_V7, zone1: z1, zone7: z7,
    nbFortes1: n1, nbFortes7: n7, total1: t1, total7: t7,
    apex1: map(1), apex7: map(7), camp: camp, motif: motif
  };
}

var PILOTE_VERDICT_V7 = 'carre';   // 'carre' (sa demande) | 'v8'

function moteurCarreV7(theme) {
  var z = null;
  try { z = zonesTrajectoiresV7(theme); } catch (e) { return null; }
  if (!z || z.erreur) return null;
  return {
    camp: z.camp, voix: z.nbFortes1 - z.nbFortes7,
    nbFortes1: z.nbFortes1, nbFortes7: z.nbFortes7,
    total1: z.total1, total7: z.total7,
    hR1: z.apex1, hR7: z.apex7, mode: z.mode,
    voie: (z.mode === 'rotation' ? 'carré tourné' : 'carré en maisons fixes') + ' — ' + z.motif
  };
}

// ═══════════════════════════════════════════════════════════════
// M4/M10 BRANCHÉ EN TÊTE DU VERDICT (04/09/26, sa demande explicite :
// « branche le signal M4/M10 boucle dans le verdict »)
// C'est le PREMIER signal de ce fichier à passer du banc à la décision.
// MESURÉ AVANT DE BRANCHER, sur les 44 cas de l'archive au camp tranché :
//   moteurCarreV7 (pilote actuel) ..... 25/41 = 61,0 %
//   moteurV8V7 (repli) ................ 32/44 = 72,7 %
//   signalM4M10BoucleV7 ............... 10/13 = 76,9 % (s'applique 13/44)
// Et sur les 13 cas où M4/M10 parle, le carré tombe à 5/11 = 45,5 %.
// Sur leurs 7 désaccords directs : M4/M10 a raison 5 fois, le carré 2.
// EFFET DE CASCADE MESURÉ :
//   avant  carré → V8 .................... 27/44 = 61,4 %
//   après  M4/M10 → carré → V8 ........... 31/44 = 70,5 %  (+4 cas)
// ⚠️ SUITE, LE 04/09/26 : après avoir vu ces chiffres, Ellemine_D a
// tranché — « oui, mets M4/M10 → V8 → carré ». Le carré est donc passé
// de pilote à dernier recours, et la cascade complète est maintenant
// décrite en toutes lettres dans ORDRE_VERDICT_V7 juste en dessous
// (33/44 = 75,0 %, contre 61,4 % avant ce branchement).
// ⚠️ RÉSERVES HONNÊTES : n = 13 cas où la règle s'applique, c'est peu ;
// la mesure est faite sur l'archive qui a servi à formuler la règle
// (risque de surapprentissage, atténué par le fait que la règle vient
// d'une doctrine énoncée avant le test) ; et un contre-exemple est déjà
// archivé (Caput/Tristitia/Tristitia/Laetitia : M4/M10 disait M7, réel
// M1 4-2). Le drapeau ci-dessous permet de tout débrancher d'un mot.
// ⚠️ ESPACES DE NOMS : signalM4M10BoucleV7 répond en M1/M7, alors que
// moteurCarreV7 et moteurV8V7 répondent en R1/R7. La conversion est
// obligatoire — sans elle le branchement serait silencieusement inerte.
// ═══════════════════════════════════════════════════════════════
// ☠️ CE BRANCHEMENT NE RAPPORTE RIEN — MESURÉ LE 04/09/26 AU SOIR
//
// Le 03/09, sur demande d'Ellemine_D, le signal M4/M10 a été mis en tête
// de la cascade du verdict (M4/M10 → V8 → carré). Onze résultats réels
// plus tard, voici son bilan, drapeau levé contre drapeau baissé :
//     archive (56 cas) ... AVEC 38/56   SANS 37/56    +1
//     soir    (11 cas) ... AVEC  4/11   SANS  5/11    −1
//     cumulé  (67 cas) ... AVEC 42/67   SANS 42/67     0
// Exactement zéro. Il gagne un cas sur l'archive où il a été ajusté, il
// en perd un hors échantillon. C'est la signature d'un réglage qui a
// appris le bruit de son propre jeu d'entraînement.
//
// Quand il tranche, il est à 9/13 sur l'archive (69 %) mais 0/2 le soir.
// Et depuis le 04/09 on sait pourquoi ce signal ne peut pas être ce
// qu'on croyait : M4 ⊕ M10 = M3 sur 65 536 thèmes, donc « les deux
// maisons défensives dans la même boucle » n'est pas une lecture de deux
// maisons indépendantes — c'est un énoncé sur M3, déguisé.
//
// ➜ RECOMMANDATION : repasser M4M10_PILOTE_VERDICT_V7 à false. Le
//   drapeau reste à true tant qu'Ellemine_D ne l'a pas dit, parce que
//   c'est lui qui a demandé le branchement. Rien n'est changé ici sans
//   sa décision — seul le chiffre est inscrit.
// ═══════════════════════════════════════════════════════════════
var M4M10_PILOTE_VERDICT_V7 = true;   // false = retour au comportement d'avant

// ═══════════════════════════════════════════════════════════════
// L'ORDRE DE LA CASCADE, EN TOUTES LETTRES (04/09/26, sa décision :
// « oui, mets M4/M10 → V8 → carré »)
// Le PREMIER moteur qui répond tranche ; les suivants ne sont pas
// interrogés. Mesuré sur les 44 cas de l'archive au camp tranché :
//   ['carre','v8'] .............. 27/44 = 61,4 %  (l'ordre d'avant)
//   ['m4m10','carre','v8'] ...... 31/44 = 70,5 %
//   ['m4m10','v8','carre'] ...... 33/44 = 75,0 %  ← retenu
//   ['v8'] seul ................. 32/44 = 72,7 %
// ☠️ CE QUE CE CHOIX ACTE : le carré passe de pilote à dernier recours.
// Il n'est plus consulté que si M4/M10 ET V8 se taisent tous les deux.
// C'est mesuré, pas esthétique : sur les 13 cas où M4/M10 s'applique, le
// carré tombait à 5/11 = 45,5 %, et V8 seul battait déjà la cascade
// pilotée par le carré de 11 points.
// ⚠️ CONSÉQUENCE À CONNAÎTRE : le sélecteur « Mode du carré »
// (fixe/rotation) ne peut plus changer le verdict que dans les rares
// thèmes où les deux premiers moteurs sont muets — voir setModeCarreV7,
// dont le commentaire a été corrigé en conséquence.
// 🔧 POUR REVENIR EN ARRIÈRE : remettre ORDRE_VERDICT_V7 à
// ['carre','v8'] et M4M10_PILOTE_VERDICT_V7 à false.
var ORDRE_VERDICT_V7 = ['m4m10', 'v8', 'carre'];

function moteurM4M10VerdictV7(theme) {
  if (!M4M10_PILOTE_VERDICT_V7) return null;
  var s = null;
  try { s = signalM4M10BoucleV7(theme); } catch (e) { return null; }
  if (!s || !s.applicable || !s.campSoutenu) return null;
  return s.campSoutenu === 'M1' ? 'R1' : (s.campSoutenu === 'M7' ? 'R7' : null);
}

function overrideVerdictV7(theme, nulActif) {
  if (nulActif) return null;
  var d = decideurVerdictV7(theme, nulActif);
  return d ? d.camp : null;
}

// ═══════════════════════════════════════════════════════════════
// LE DÉCIDEUR, ET SON NOM, AU MÊME ENDROIT (04/09/26)
// ☠️ POURQUOI CETTE FONCTION EXISTE. Le panneau VERDICT nomme la
// « source décisive ». Cette ligne a DÉJÀ menti une fois dans l'histoire
// du fichier — elle nommait un moteur qui ne décidait plus rien, parce
// qu'elle refaisait la cascade dans son coin au lieu de demander au
// décideur. En réordonnant la cascade le 04/09 (M4/M10 → V8 → carré),
// le même bug est revenu aussitôt : l'écran annonçait « Carré
// géomantique » alors que le carré était devenu dernier recours et
// n'avait pas tranché.
// La cascade n'est donc plus écrite qu'ICI. overrideVerdictV7 en prend
// le camp, l'affichage en prend le nom : les deux ne peuvent plus
// diverger, parce qu'ils lisent le même objet.
function decideurVerdictV7(theme, nulActif) {
  if (nulActif) return { camp: null, moteur: 'nul', nom: 'Porte du nul — nul imposé' };
  var ordre = ORDRE_VERDICT_V7;
  // Ancien interrupteur conservé et toujours actif : 'v8' retire le
  // carré de la cascade, exactement comme avant.
  if (PILOTE_VERDICT_V7 === 'v8') {
    ordre = ordre.filter(function (n) { return n !== 'carre'; });
  }
  var mutisme = [];
  for (var i = 0; i < ordre.length; i++) {
    var camp = null, nom = null;
    try {
      if (ordre[i] === 'm4m10') {
        camp = moteurM4M10VerdictV7(theme);
        nom = 'Signal M4/M10 — les deux maisons défensives dans la boucle du camp soutenu';
      } else if (ordre[i] === 'v8') {
        var m8 = moteurV8V7(theme);
        camp = m8 && m8.camp ? m8.camp : null;
        nom = 'Moteur V8 — ' + ((m8 && m8.voie) || 'partage de la synthèse');
      } else if (ordre[i] === 'carre') {
        var mc = moteurCarreV7(theme);
        camp = mc && mc.camp ? mc.camp : null;
        nom = 'Carré géomantique — ' + ((mc && mc.voie) || 'trajectoires fortes');
      }
    } catch (e) { camp = null; }
    if (camp) {
      return { camp: camp, moteur: ordre[i],
        nom: nom + (mutisme.length ? ' (après ' + mutisme.join(' et ') + ' muet' + (mutisme.length > 1 ? 's' : '') + ')' : '') };
    }
    mutisme.push(ordre[i] === 'm4m10' ? 'M4/M10' : ordre[i] === 'v8' ? 'V8' : 'carré');
  }
  return { camp: null, moteur: null, nom: 'aucun décideur' };
}

function getVerdictAfficheReel(theme, favorite) {
  var orderR = getRotationOrderFromRepos(theme[1]);
  var structureNul = structureDuNul(theme);
  var nulAxe = (typeof signalAxeSuccedentOpposition === 'function') ? signalAxeSuccedentOpposition(theme) : null;
  // Structure du Nul débranchée du verdict (24/08/26) — cf.
  // STRUCTURE_NUL_DECISIVE. Seul l'Axe Succédent peut encore imposer le nul.
  // Structure du Nul et Axe Succédent tous deux débranchés (24/08/26) —
  // cf. STRUCTURE_NUL_DECISIVE et AXE_SUCCEDENT_DECISIF. Plus aucune règle
  // de nul n'impose le verdict ; elles restent calculées et affichées.
  //
  // ─── 29/08/26 : LE NUL EST BRANCHÉ AU VERDICT PRINCIPAL ───
  // Demande d'Ellemine_D, après que sa doctrine des deux portes soit
  // devenue la meilleure lecture du banc. C'est nulDeuxPortesV7 qui
  // impose désormais le nul — pas structureDuNul, pas l'axe succédent,
  // qui restent débranchés parce qu'ils ne l'ont jamais mérité
  // (structure : 1 nul sur 5 ; juge figé : 2 sur 5 pour 14 faux positifs).
  //
  // MESURÉ AVANT D'ÊTRE BRANCHÉ, sur les 30 cas au camp connu (5 nuls) —
  // c'est le verdict AFFICHÉ qui est compté, pas un moteur isolé :
  //   sans le nul (état du 28/08) .................. 18/30
  //   avec les deux portes (+2 / +11) .............. 21/30   ← branché
  //   avec les portes élargies ({+2,+4} / +11) ..... 22/30
  // Le détail de ce que change le branchement strict :
  //   Roma       nul  · R1  ✘ → nul ✔      gagné
  //   AmisPuer   nul  · R7  ✘ → nul ✔      gagné
  //   CaputPuella nul · R7  ✘ → nul ✔      gagné
  //   CarcAlbus  nul  · R7  ✘ → nul ✔      gagné
  //   PuerCaput  R1   · R1  ✔ → nul ✘      PERDU, le prix à payer
  // Quatre nuls gagnés contre un pronostic juste perdu.
  //
  // POURQUOI LA PORTE STRICTE ET PAS L'ÉLARGIE, alors qu'elle fait un
  // point de plus : le point supplémentaire est FortMajConj, et c'est
  // précisément le seul cas sur lequel le battant « +4 » a été ajusté.
  // Une règle ne peut pas se tromper sur le cas qui l'a fabriquée : ce
  // 22/30 ne mesure rien. Le battant élargi reste disponible par
  // NUL_PORTE_ELARGIE_V7 pour le jour où un second nul à +4 arrivera.
  var nulActif = nulActifV7(theme, structureNul, nulAxe);
  // ─── LES SEPT CALCULS MORTS SONT PARTIS (01/09/26) ───
  // protocoleWinner · siegesWinner · chaineAff · f4p4Aff · reseauAff ·
  // voteAff · critAff étaient calculés ici À CHAQUE VERDICT et n'étaient
  // LUS NULLE PART — le commentaire qui les accompagnait le disait déjà
  // (« elles alimentent les panneaux de comparaison, pas la décision »),
  // sauf que les panneaux les recalculent eux-mêmes. Sept appels de
  // moteurs par verdict, pour rien. Retirés sur le constat d'Ellemine_D.
  // Les panneaux qui les affichent appellent directement leur moteur.
  var winnerOverride = overrideVerdictV7(theme, nulActif);
  // ─── LE PROTOCOLE PEUT PILOTER LE CAMP (05/09/26, demande d'Ellemine_D) ───
  // Le mécanisme est ici, complet et testé. L'interrupteur est
  // BRANCHES_V7.protocole_pilote.actif, et il est à false.
  //
  // POURQUOI IL EST À FALSE, ce n'est pas de la prudence, c'est la
  // mesure : camp 38/56 aujourd'hui, 27/56 si le protocole décide dès
  // qu'il parle sans réserve. La variante écrite ici est la MOINS
  // MAUVAISE des deux — le nul garde la priorité, donc 29/56 — et elle
  // coûte quand même NEUF points. Vérifié en basculant le booléen à
  // chaud : 38/56 éteint, 29/56 allumé, 38/56 au retour.
  // Il ne s'exprime que quand
  // R1 et R7 sont dans des boucles différentes (50,00 % des thèmes) et,
  // sur ces cas-là, il tombe juste 12 fois sur 29 quand le verdict en
  // réussit 23. Hors des 4 nuls réels qu'il ne peut jamais annoncer :
  // 12/25 tel quel, 13/25 inversé, p = 1,0000. Ce n'est pas un signal
  // au signe retourné, c'est un pile ou face.
  //
  // Le détail complet, les huit autres cibles testées et le défaut
  // trouvé au passage (le nombre de duels vaut 16 sur tous les thèmes)
  // sont dans BRANCHES_V7.protocole_pilote. Un seul booléen à basculer
  // le jour où ces chiffres changent.
  var protoPilote = null;
  if (typeof BRANCHES_V7 !== 'undefined' && BRANCHES_V7.protocole_pilote
      && BRANCHES_V7.protocole_pilote.actif) {
    try {
      var qp = comparerBouclesAntagonistesR1R7(theme);
      if (qp && qp.applicable) {
        var ps1 = Number(qp.scoreR1 || 0), ps7 = Number(qp.scoreR7 || 0);
        if (ps1 !== ps7) protoPilote = ps1 > ps7 ? 'R1' : 'R7';
      }
    } catch (e) { protoPilote = null; }
    // Le nul garde la priorité : il est branché depuis le 29/08 sur une
    // mesure qui, elle, avait gagné (18/30 -> 21/30). Le protocole ne
    // peut pas annoncer de nul, il ne doit donc pas pouvoir en effacer un.
    if (protoPilote && !nulActif) winnerOverride = protoPilote;
  }
  var carteR = buildVerdictCard(orderR[0], orderR[6], 'R1', 'R7', theme, winnerOverride, undefined, true);
  var goals = String(carteR.scoreMain || '0-0').split('-').map(Number);
  // posA porte toujours le camp M1 par convention de buildVerdictCard
  // (voir commentaire "VIA EN M4" plus haut) -> goals[0]=camp M1, goals[1]=camp M7.
  return {
    winner: nulActif ? 'Nul' : (carteR.winner === 'R1' ? 'M1' : carteR.winner === 'R7' ? 'M7' : 'Nul'),
    goalM1: goals[0] || 0, goalM7: goals[1] || 0,
    scoreMain: scoreAfficheV7(carteR, nulActif).main,
    scoreAlt: scoreAfficheV7(carteR, nulActif).alt,
    // ─── LE BTTS ENTRE DANS LE VERDICT RENVOYÉ (29/08/26) ───
    // Il n'y était pas. Conséquence : ni le journal, ni le comparateur,
    // ni le contrôle de divergence ne pouvaient le voir — c'est la seule
    // affirmation affichée qui échappait entièrement au filet. C'est
    // aussi pour ça que je l'ai mesuré de travers pendant un moment, en
    // le déduisant du score au lieu de lire la ligne.
    // ─── LE REJET ENTRE DANS LA SOURCE UNIQUE (30/08/26) ───
    // Sans ça, le moteur renverrait un vainqueur pendant que l'écran
    // affiche « NON VALIDE » — exactement le défaut corrigé le 29/08 sur
    // la chaîne de priorité, refait par l'autre bout. Le contrôle de
    // divergence l'a attrapé dans la minute.
    // Le verdict SOUS-JACENT reste renvoyé : c'est lui que le banc mesure,
    // sinon on perdrait la seule façon de savoir si le filtre sert. Ce
    // champ dit seulement que l'écran, lui, ne l'annonce pas.
    rejete: (function () {
      try { var rj = themeRejeteV7(theme); return !!(rj && rj.rejete); } catch (e) { return false; }
    })(),
    // Depuis le 04/09/26 « rejete » ne dit plus que l'état de l'ÉCRAN (et
    // vaut donc false partout tant que le drapeau est levé). Le critère
    // lui-même vit ici, pour que le consensus et le journal continuent de
    // le montrer. Cf. le bloc de sousSeuilValiditeV7.
    sousSeuil: (function () {
      try { var sv = sousSeuilValiditeV7(theme); return !!(sv && sv.rejete); } catch (e) { return false; }
    })(),
    btts: carteR.btts === true ? true : carteR.btts === false ? false : null,
    bttsSource: carteR.bttsSource || null,
    // ═══ LE VOLUME DE BUTS EST BRANCHÉ AU VERDICT (05/09/26) ═══
    // Demande d'Ellemine_D : « branche-les au verdict ». Mesuré avant,
    // comme le nul l'avait été le 29/08 — sur les 48 cas d'archive au
    // score connu, famille plus/moins de 2,5 buts :
    //   moteur seul .................................. 26/48  (54 %)
    //   règle idiote « toujours plus de 2,5 » ........ 31/48  (65 %)
    //   zéro Populus -> plus, sinon moteur ........... 34/48  (71 %)  <- branché
    //   zéro -> plus ET au moins un -> moins ......... 32/48
    // Le moteur seul était donc MOINS BON qu'une règle idiote sur cette
    // famille : il annonce « moins de 2,5 » dans 73 % des cas quand la
    // réalité est au-dessus dans 65 %. Ce n'est pas un détail de
    // réglage, c'est un biais d'échelle — 1,52 but annoncé en moyenne
    // contre 4,12 réels.
    // Ce que le branchement change, cas par cas : 10 gagnés, 2 perdus.
    //   gagnés  Milan 7, City/Madrid 11, AmisPuer 8, Gel2Machine 9,
    //           Milan-like… tous à zéro Populus, tous annoncés « moins »
    //   perdus  Roma 2 buts, CarcAlbus 0-0 — deux thèmes à zéro Populus
    //           qui n'ont pas marqué. C'est le prix payé, il est écrit.
    // Fisher sur le 2x2 : p = 0,0137. Binomial sur les 12 discordants
    // (10 contre 2) : p = 0,039.
    //
    // CE QUI RESTE FAUX ET QUE LE BRANCHEMENT N'ARRANGE PAS : les 14
    // erreurs restantes sont presque toutes des thèmes AVEC du Populus
    // qui ont quand même beaucoup marqué (CarcCaput 7, AcqFortMaj 7,
    // Gel2Main 9). La règle ne sait rien dire d'eux — elle ne parle que
    // du groupe « zéro ».
    //
    // POURQUOI CETTE RÈGLE ET PAS UNE AUTRE : voir PISTES_V7.populus_zero
    // pour sa faiblesse, qui n'a pas disparu en la branchant — le
    // découpage « zéro contre au moins un » a été choisi après avoir vu
    // les données. Le branchement est réversible d'un booléen
    // (BRANCHES_V7.populus_volume.actif) et le champ dit toujours d'où
    // vient l'annonce, pour qu'on puisse la débrancher sur mesure.
    plus25: (function () {
      // Le score LU ICI doit être celui que l'écran affiche, pas le score
      // brut de la carte : quand le nul est actif, scoreAfficheV7 force un
      // score de parité et les deux divergent. Lire la carte brute faisait
      // annoncer un volume incohérent avec le score affiché juste à côté —
      // et déplaçait la mesure de référence de 26/48 à 28/48. Attrapé en
      // faisant recalculer le gain par le fichier lui-même au lieu de me
      // fier à mon script.
      var moteur = null;
      try {
        var g2 = String(scoreAfficheV7(carteR, nulActif).main || '0-0').split('-').map(Number);
        moteur = ((g2[0] || 0) + (g2[1] || 0)) > 2.5;
      } catch (e) { moteur = null; }
      var zero = null;
      try { var lp2 = lecturePopulusV7(theme); zero = lp2 ? lp2.zeroPopulus : null; }
      catch (e) { zero = null; }
      // ── LA BRANCHE SE VÉRIFIE ELLE-MÊME (05/09/26, deuxième passe) ──
      // Elle a été branchée le matin sur 26/48 contre 34/48, mesuré sur
      // les 56 cas du dépôt. Le balayage max-T rejoué sur les 105 cas
      // réels d'Ellemine_D a montré que « zéro Populus » n'est même plus
      // le meilleur prédicteur de sa famille : rho 0,390 à 56 cas, le
      // meilleur de la famille tombe à 0,272 à 95 cas. C'est la
      // signature d'un effet qui régresse vers la moyenne.
      // Une règle branchée sur un chiffre gelé qui a cessé d'être vrai
      // est pire qu'une règle absente. Celle-ci REFAIT SON PROPRE
      // COMPTAGE sur la base courante et se retire toute seule si elle
      // n'y gagne plus rien.
      var branche = (typeof BRANCHES_V7 !== 'undefined')
        && BRANCHES_V7.populus_volume && BRANCHES_V7.populus_volume.actif;
      var autoRetrait = null;
      if (branche) {
        try {
          var mv = mesurePopulusLiveV7();
          if (mv && mv.gain <= 0) {
            branche = false;
            autoRetrait = 'retirée d\'elle-même : sur les ' + mv.n + ' cas au score connu de '
              + 'ta base, elle fait ' + mv.moteurPlusRegle + '/' + mv.n + ' contre '
              + mv.moteurSeul + '/' + mv.n + ' pour le moteur seul — gain ' + mv.gain
              + '. Elle avait été branchée sur un gain de +8 mesuré sur 48 cas du dépôt.';
          }
        } catch (e) { }
      }
      if (branche && zero === true) {
        return { annonce: 'plus de 2,5 buts', valeur: true, source: 'zéro Populus',
          moteurDisait: moteur === null ? null : (moteur ? 'plus de 2,5' : 'moins de 2,5'),
          contreditLeMoteur: moteur === false };
      }
      if (moteur === null) return null;
      return { annonce: moteur ? 'plus de 2,5 buts' : 'moins de 2,5 buts', valeur: moteur,
        source: autoRetrait ? 'moteur (règle Populus auto-retirée)' : 'moteur',
        autoRetrait: autoRetrait,
        moteurDisait: moteur ? 'plus de 2,5' : 'moins de 2,5',
        contreditLeMoteur: false };
    })(),
    // htWinner : approximation (BTTS comme proxy "les deux marquent"),
    // le concept exact de "vainqueur de la 1ère mi-temps" du moteur V7
    // legacy n'a pas d'équivalent direct dans le pipeline R1/R7.
    // ⚠️ Depuis le 29/08 le BTTS vient de la maison de R1 : cette
    // approximation de mi-temps en dépend donc aussi. Elle n'a jamais été
    // mesurée, faute d'un seul score de mi-temps saisi dans l'archive.
    htWinner: carteR.btts ? 'both' : 'none',
    penalty: {
      hasPen: !!carteR.penaltyRouge && carteR.incidentPctPenalty > 0,
      hasRed: !!carteR.penaltyRouge && carteR.incidentPctRouge > 0
    },
    incidentPct: carteR.incidentPct, incidentNiveau: carteR.incidentNiveau,
    incidentCamp: carteR.incidentCamp || null,
    incidentCampSource: carteR.incidentCampSource || null,
    // Le total de corners annoncé — exposé le 27/08/26 pour pouvoir le
    // confronter au nombre réel saisi dans les thèmes sauvegardés.
    cornersTotal: (carteR.corners && carteR.corners.total != null && carteR.corners.total !== '—')
      ? Number(carteR.corners.total) : null,
    cornersM1: carteR.corners ? carteR.corners.campA : null,
    cornersM7: carteR.corners ? carteR.corners.campB : null,
    cornersDominant: carteR.cornersDominant === 'R1' ? 'M1'
      : carteR.cornersDominant === 'R7' ? 'M7' : (carteR.cornersDominant || null),
    corners: carteR.corners || null,
    // La lecture du protocole est renvoyée QUOI QU'IL ARRIVE, branchée
    // ou non : c'est la seule façon de continuer à mesurer si elle
    // s'améliore, et de voir sur quels thèmes elle contredit le verdict.
    protocole: (function () {
      try {
        var qq = comparerBouclesAntagonistesR1R7(theme);
        if (!qq || !qq.applicable) return { applicable: false,
          raison: qq && qq.reason ? qq.reason : 'R1 et R7 dans la même boucle' };
        var a = Number(qq.scoreR1 || 0), b2 = Number(qq.scoreR7 || 0);
        return { applicable: true, scoreR1: a, scoreR7: b2, ecart: a - b2,
          dit: a > b2 ? 'R1' : b2 > a ? 'R7' : 'égalité',
          pilote: !!(typeof BRANCHES_V7 !== 'undefined' && BRANCHES_V7.protocole_pilote
            && BRANCHES_V7.protocole_pilote.actif) };
      } catch (e) { return null; }
    })(),
    corrected: carteR.corrected, nulActif: nulActif
  };
}

function renderRegressionReference(theme){
  const el=document.getElementById('regression-reference-panel');
  if(!el || !theme) return;
  const d=(document.getElementById('matchDate')||{}).value||'';
  const t=(document.getElementById('matchTime')||{}).value||'';
  const mothers=[theme[1],theme[2],theme[3],theme[4]];
  const key=mothers.join('|');
  const refs={
    'fortuna_minor|acquisitio|carcer|albus':{date:'2026-08-18',time:'20:00',score:'1-1',verdict:'NUL'}
  };
  const r=refs[key];
  if(!r || d!==r.date || t!==r.time){ el.style.display='none'; el.innerHTML=''; return; }
  el.style.display='block';
  let engine='—';
  try{
    if(typeof verdictV7==='function'){
      const v=verdictV7(theme);
      if(v && v.scoreMain) engine=v.scoreMain;
    }
  }catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  el.innerHTML='<h3 style="margin-bottom:8px;color:#c4b5fd;">🧪 Contrôle de régression — cas validé</h3>'+
    '<div class="kv"><b>Date :</b> '+r.date+' à '+r.time+'</div>'+ 
    '<div class="kv"><b>Thème :</b> Fortuna Minor · Aquisitio · Carcer · Albus</div>'+ 
    '<div class="kv"><b>Score réel de référence :</b> <span style="font-size:20px;font-weight:800;color:#4ade80;">'+r.score+'</span></div>'+ 
    '<div class="kv"><b>Verdict réel :</b> '+r.verdict+'</div>'+ 
    '<div class="kv"><b>Score produit par le moteur :</b> <span style="font-weight:800;">'+engine+'</span></div>'+ 
    '<div class="hint" style="margin-top:6px;">Ce panneau est un contrôle de régression : il n’écrase ni le verdict ni le score du moteur.</div>';
}

/* ═══════════════════════════════════════════════════════════════
   UI PRINCIPALE — PROTOCOLE DE COMPARAISON R1/R7
   La carte supérieure reprend le protocole comme lecture principale.
   La structure du nul est affichée séparément et peut suspendre le
   protocole lorsqu'un signal structurel est actif.
   ═══════════════════════════════════════════════════════════════ */
function renderProtocoleVerdictPrincipal(containerId, card, teamA, teamB, theme, q, sdn, axeNul, nulActif) {
  var el=document.getElementById(containerId); if(!el) return;
  q=q||{}; sdn=sdn||{};
  // MAINTENANCE (03/09/26) : teamA/teamB viennent directement des champs
  // #team1/#team2 sans validation et sont réinjectés tels quels dans le HTML
  // de cette carte à de nombreux endroits plus bas (winnerName, cardWinner,
  // markLabel, etc.) — échappés une seule fois ici pour couvrir tous les
  // usages en aval sans devoir toucher chaque site d'injection séparément.
  teamA = escHtml(teamA); teamB = escHtml(teamB);
  var active=!!q.applicable;
  var s1=Number(q.scoreR1||0), s7=Number(q.scoreR7||0);
  // ☠️ 30/08/26 — LA BARRE POUVAIT AFFICHER « R7 107,1 % » ET « R1 -7,1 % ».
  // Les totaux du protocole sont des sommes signées : un camp peut finir
  // en négatif (Conjunctio contre Populus : R1 -3,75, R7 56,25). Divisés
  // par leur somme (52,5), ça donne des pourcentages hors de [0,100] et
  // une largeur CSS négative. On décale les deux totaux au-dessus de zéro
  // avant de faire la part de chacun ; l'écart affiché ne change pas.
  var _bas=Math.min(0, s1, s7), _v1=s1-_bas, _v7=s7-_bas, _sm=(_v1+_v7)||1;
  var p1=_v1/_sm*100, p7=_v7/_sm*100, gap=Math.abs(s1-s7);
  var winner = !nulActif && card && card.winner ? (card.winner === 'R1' ? 'R1' : card.winner === 'R7' ? 'R7' : null) : null;
  var winnerName=winner==='R1'?teamA:winner==='R7'?teamB:'Indécis';
  // ☠️ 30/08/26 — LE BLOC « VERDICT DU PROTOCOLE » NOMMAIT LE MAUVAIS CAMP.
  // Il montre les totaux du protocole (q.scoreR1 / q.scoreR7) mais il
  // nommait le vainqueur de la CARTE — la conclusion d'un autre moteur.
  // Quand les deux divergent, on lisait « VAINQUEUR FINAL : R1, avance
  // nette de 60,00 points » au-dessus d'un tableau où R1 fait -3,75 et R7
  // fait 56,25. Le chiffre était juste, le nom était faux, et rien ne le
  // signalait. Le thème Acquisitio/Fortuna Major/Caput/Acquisitio (réel
  // 0-7 pour R7) l'a mis à nu : six moteurs disaient R7, seule la lecture
  // des critères disait R1, et c'est elle qui pilote la carte.
  // Ces trois variables servent UNIQUEMENT au bloc du protocole ; la
  // grande carte « VAINQUEUR » garde winnerName, qui est bien le sien.
  var winnerProto = (!nulActif && q && q.winner === 'R1') ? 'R1' : ((!nulActif && q && q.winner === 'R7') ? 'R7' : null);
  var winnerProtoName = winnerProto==='R1'?teamA:winnerProto==='R7'?teamB:'Indécis';
  var divergeProto = !!(winnerProto && winner && winnerProto !== winner);
  var credibility=nulActif?0:Math.min(99,Math.max(50,Math.round(60+Math.min(gap,10)*3.5)));
  var label=function(f){return (typeof FL!=='undefined'&&FL[f])?FL[f]:f||'—';};
  var n=function(v){return Number(v||0).toFixed(2);};
  var esc=function(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
  var positions=function(xs){return xs&&xs.length?xs.map(function(x){return 'M'+x;}).join(', '):'—';};
  var loopRows=function(a){
    if(!a||!a.length) return '<tr><td colspan="3">Aucun maillon exploitable</td></tr>';
    return a.map(function(x){
      var present=x.tous&&x.tous.length?x.tous.length:0;
      var repos=x.reposPresent?'Présent':'Absent';
      var force=Number(x.forcePositions||0);
      var rep=Math.min(present,3)*.5;
      var anc=x.reposPresent?2:0;
      var bin=(x.binPos||[]).length*.5;
      var propre=Number(x.resultantesPropres||0)*.75;
      var adverse=Number(x.resultantesAdverses||0)*1.25;
      var total=force+anc+rep+bin+propre-adverse;
      return '<tr><td><b>'+label(x.fig)+'</b></td><td>'+positions(x.tous)+'</td><td>'+n(total)+'</td></tr>';
    }).join('');
  };
  var sumRows=function(a){
    var presence=(a||[]).reduce(function(t,x){return t+(x.tous?x.tous.length:0);},0);
    var repetitions=(a||[]).reduce(function(t,x){return t+Math.max(0,(x.tous?x.tous.length:0)-1);},0);
    var repos=(a||[]).filter(function(x){return x.reposPresent;}).length*2;
    var bin=(a||[]).reduce(function(t,x){return t+(x.binPos||[]).length*.5;},0);
    var propre=(a||[]).reduce(function(t,x){return t+(x.resultantesPropres||0)*.75;},0);
    var adverse=(a||[]).reduce(function(t,x){return t+(x.resultantesAdverses||0)*1.25;},0);
    return {presence:presence,repetitions:repetitions,repos:repos,bin:bin,propre:propre,adverse:adverse};
  };
  var d1=sumRows(q.a1), d7=sumRows(q.a7);
  var cardWinner=winnerName;
  var _sa = scoreAfficheV7(card, nulActif);
  var scoreMain = _sa.main;
  var scoreAlt = _sa.alt;
  var markLabel=card&&card.capaciteFiable?(card.capaciteWinner==='A'?teamA:card.capaciteWinner==='B'?teamB:'Égalité'):'—';
  var markA=card&&card.capaciteA!=null?card.capaciteA:'—', markB=card&&card.capaciteB!=null?card.capaciteB:'—';
  var bt=card&&card.btts?'Oui':'Non';
  if (card && card.bttsSource) bt += ' — ' + card.bttsSource;
  if (card && card.bttsZone) bt += '<br><span style="font-size:10px; color:#94a3b8; font-weight:400;">'
    + card.bttsZone + '</span>';
  if (card && card.bttsContreLecture) bt += ' · ' + card.bttsContreLecture;
  // La doctrine M4/M10 est signalée, plus imposée : elle est débranchée du
  // verdict depuis le 25/08 (1/3 là où elle tire sur les cas réels).
  if (card && card.bttsForce) bt += ' · M4/M10 aurait dit Oui 100%';
  if (card && card.bttsDefavorise) bt += ' · M4/M10 aurait dit Non';
  var corners=card&&card.corners?card.corners:{ht1:'—',ht2:'—',total:'—',ouvert:false};
  // CORRIGÉ (20/08/26) : lisait card.penaltyRed / card.yellowCards, des
  // champs qui n'existent pas dans buildVerdictCard (les vrais champs
  // sont penaltyRouge / cartonsJaunes) — d'où le "—" affiché à l'écran
  // au lieu du signal réel.
  var penalty=card&&card.penaltyRouge!=null?(card.penaltyRouge?'Oui':'Non'):'—';
  if (card && card.incidentPct > 0) {
    penalty = (card.penaltyRouge?'Oui':'Non') + ' — ' + card.incidentNiveau + ' (' + card.incidentPct + '%)'
      + (card.incidentCamp ? ' · CONTRE ' + card.incidentCamp
          + (card.incidentCampSource ? ' [' + card.incidentCampSource + ']' : '') : ' · camp non désigné')
      + (card.incidentInevitable ? ' ⚠️ quasi inévitable' : '');
  }
  var yellow=card&&card.cartonsJaunes!=null?card.cartonsJaunes:'—';
  var nulPorteTxt='';
  try {
    var _dp = nulDeuxPortesV7(theme);
    if (_dp && nulParPorteV7(theme)) {
      nulPorteTxt = 'Porte du nul ouverte — branche « ' + _dp.porte + ' », décalage +' + _dp.k
        + ' · porte ' + _dp.force
        + (_dp.force === 'EN PROBATION' ? ' (2 tirs seulement, 15,4 % au hasard — à confirmer)' : '');
    }
  } catch (e) { nulPorteTxt=''; }
  var nullStatus=nulActif?'NUL ACTIF':'NUL NON ACTIF';
  var nullColor=nulActif?'#fbbf24':'#22c55e';
  var nullReason=sdn.nulParIdentite?'Identité M13 = M14':sdn.nulParOpposition?'Opposition / paire d’équilibre M13 ↔ M14':'Aucune identité ni opposition directe entre les juges';
  var axeTxt=axeNul?(axeNul.confirmed?'✓ confirmation':'— non confirmé'):'—';
  var reasonList=(q.raisons||[]).map(function(r){return '<li>'+esc(r)+'</li>';}).join('');
  var duelRows=(q.duel||[]).map(function(d){var a=Number(d.scoreA||0),b=Number(d.scoreB||0);return '<tr><td>'+label(d.a&&d.a.fig)+'</td><td>'+n(a)+'</td><td>'+label(d.b&&d.b.fig)+'</td><td>'+n(b)+'</td><td><b>'+(a>b?'R1':b>a?'R7':'Égalité')+'</b></td></tr>';}).join('');
  var html='<style id="proto-verdict-ui">\
  .tek{font-family:inherit;color:#e5e7eb}.tek *{box-sizing:border-box}.tek-head{font-size:25px;font-weight:900;text-align:center;margin:0 0 6px;color:#dbeafe}.tek-head span{font-size:12px;color:#a78bfa}.tek-sub{text-align:center;color:#94a3b8;font-size:11px;margin-bottom:12px}.tek-hero{display:grid;grid-template-columns:1.02fr .98fr;gap:12px}.tek-winner{border:1px solid #22c55e;border-radius:13px;padding:16px;background:linear-gradient(135deg,rgba(20,83,45,.28),rgba(7,17,31,.96));text-align:center}.tek-winner.warn{border-color:#f59e0b}.tek-cap{font-size:12px;font-weight:900;color:#4ade80;letter-spacing:.08em}.tek-name{font-size:29px;line-height:1.08;font-weight:950;color:#4ade80;margin:6px 0}.tek-winner.warn .tek-name{color:#fbbf24}.tek-score{font-size:20px;font-weight:900;color:#dbeafe}.tek-stats{border:1px solid #334155;border-radius:13px;background:#07111f;padding:12px}.tek-stat{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px solid rgba(148,163,184,.11);font-size:12px}.tek-stat:last-of-type{border-bottom:0}.tek-note{color:#7dd3fc;font-size:12px;font-weight:800;margin-top:8px}.tek-credit{margin-top:10px;border:1px solid #22c55e;border-radius:10px;padding:8px;text-align:center}.tek-credit .num{font-size:28px;font-weight:950;color:#4ade80}.tek-section{margin-top:11px;border:1px solid #243b63;border-radius:13px;background:rgba(2,8,23,.58);padding:11px}.tek-title{font-size:17px;font-weight:950;text-align:center;color:#c4b5fd;margin-bottom:10px}.tek-camps{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tek-camp{border:1px solid #2563eb;border-radius:11px;background:#06101d;padding:11px}.tek-camp.r7{border-color:#b45309}.tek-camp h4{margin:0 0 5px;font-size:16px;color:#60a5fa}.tek-camp.r7 h4{color:#fb923c}.tek-meta{font-size:11px;color:#cbd5e1;line-height:1.55}.tek-bigscore{font-size:27px;font-weight:950;text-align:center;margin:8px 0;color:#60a5fa}.tek-camp.r7 .tek-bigscore{color:#fb923c}.tek-progress{height:22px;border:1px solid #334155;border-radius:6px;display:flex;overflow:hidden;margin-top:9px}.tek-progress div{display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900}.tek-tables{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.tek-tablebox{border:1px solid #1e4f83;border-radius:10px;overflow:hidden;background:#06101d}.tek-tablebox.r7{border-color:#7c4a13}.tek-tablebox h5{margin:0;padding:9px;color:#60a5fa;font-size:14px}.tek-tablebox.r7 h5{color:#fb923c}.tek-table{width:100%;border-collapse:collapse;font-size:10.5px}.tek-table th,.tek-table td{padding:6px 5px;border-bottom:1px solid rgba(148,163,184,.13);text-align:left}.tek-table th{color:#93c5fd}.tek-tablebox.r7 th{color:#fb923c}.tek-table td:last-child,.tek-table th:last-child{text-align:right}.tek-total{display:flex;justify-content:space-between;padding:9px;font-size:17px;font-weight:950}.tek-verdict{margin-top:10px;border:1px solid #475569;border-radius:11px;background:linear-gradient(90deg,rgba(30,41,59,.78),rgba(15,23,42,.9));padding:12px}.tek-verdictgrid{display:grid;grid-template-columns:145px 1fr;gap:12px;align-items:center}.tek-scale{text-align:center}.tek-scale .symbol{font-size:38px}.tek-scale b{font-size:13px}.tek-final{font-size:22px;font-weight:950;color:#4ade80}.tek-gap{color:#facc15;font-weight:900;margin-top:3px}.tek-list{font-size:10.5px;line-height:1.5;margin:7px 0 0 18px}.tek-null{border-color:#334155}.tek-null-grid{display:grid;grid-template-columns:.9fr 1.35fr .75fr;gap:9px}.tek-box{border:1px solid #334155;border-radius:9px;background:#08111f;padding:9px}.tek-box h5{margin:0 0 7px;color:#c4b5fd;font-size:13px}.tek-kv{display:flex;justify-content:space-between;gap:7px;padding:6px 2px;border-bottom:1px solid rgba(148,163,184,.1);font-size:10.5px}.tek-kv:last-child{border-bottom:0}.tek-nullstatus{height:100%;min-height:125px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;border:1px solid '+nullColor+';border-radius:9px;color:'+nullColor+'}.tek-nullstatus .ico{font-size:32px}.tek-nullstatus b{font-size:15px}.tek-bottom{display:grid;grid-template-columns:120px 1fr 1.35fr;gap:9px;align-items:stretch}.tek-bottom .box{border:1px solid #334155;border-radius:9px;padding:10px;background:#08111f}.tek-bottom .big{font-size:31px;font-weight:950;color:#4ade80;text-align:center}.tek-bottom p{margin:0;font-size:11px;line-height:1.5}.tek-mobile-only{display:none}@media(max-width:700px){.tek-hero,.tek-camps,.tek-tables,.tek-null-grid,.tek-bottom,.tek-verdictgrid{grid-template-columns:1fr}.tek-head{font-size:21px}.tek-name{font-size:25px}.tek-tables{display:grid}.tek-mobile-only{display:block}.tek-table{font-size:10px}.tek-table th,.tek-table td{padding:5px}.tek-nullstatus{min-height:105px}}\
  </style>';
  html+='<div class="tek" data-protocole-r1r7="1">';
  // ─── SIGNAL IMMÉDIAT : THÈME DÉTRUIT (28/08/26, demande d'Ellemine_D) ───
  var msgDetruit = null;
  try { msgDetruit = themeDetruit(theme); } catch (e) { msgDetruit = null; }
  if (msgDetruit) {
    html += '<div style="border:2px solid #ef4444; border-radius:12px; padding:12px 14px; margin-bottom:12px; '
      + 'background:linear-gradient(135deg, rgba(127,29,29,.35), rgba(7,17,31,.9));">'
      + '<div style="font-size:15px; font-weight:900; color:#fca5a5;">⛔ THÈME INVALIDE — DÉTRUIT</div>'
      + '<div style="font-size:11.5px; color:#fecaca; margin-top:4px;">' + esc(msgDetruit) + '</div></div>';
  }
  html+='<div class="tek-head">🏆 VERDICT DU MATCH <span>— '+esc(card && card.sourceDecisive ? card.sourceDecisive : 'Moteur V8')+'</span></div>';
  // Le bloc « vote des moteurs » est retiré (01/09/26) avec le vote.
  if (card && card.f4p4Synthese) {
    html+='<div style="margin-bottom:10px; padding:10px 12px; border-radius:8px; '
      +'background:#1e1633; border:1px solid #a78bfa; font-size:12px; color:#ede9fe;">'
      +'🧭 <b>Front 4 · Pôle 4</b> '
      +'<span style="color:#94a3b8;">(lecture — ne décide pas)</span>'
      +' : '+esc(card.f4p4Critere||'')+'</div>';
  }
  if (card && card.desaccordF4P4Ancrage) {
    html+='<div class="kv" style="font-size:11px;color:#fbbf24;">⚡ F4P4 et l\'ancrage développé se contredisent ('
      +esc(card.chaineWinner)+' pour l\'ancrage) — ni l\'un ni l\'autre ne tranche, '
      +'le désaccord est signalé pour que le cas s\'accumule au banc.</div>';
  }
  if (card && card.chaineSynthese) {
    // Depuis le 26/08/26 la chaîne n'est plus décisive : F4P4 pilote.
    var chaineRole = card.f4p4Winner ? (card.accordF4P4Ancrage ? 'contre-lecture — accord ✅'
                                      : card.desaccordF4P4Ancrage ? 'contre-lecture — désaccord ⚠️'
                                      : 'contre-lecture')
                                     : 'décisif — repli';
    html+='<div style="margin-bottom:10px; padding:9px 12px; border-radius:8px; background:#0d2b1f; border:1px solid #22c55e; font-size:12px; color:#e2e8f0;">⛓️ <b>Solidité de chaîne ('+chaineRole+')</b> : '+esc(card.chaineSynthese)+'</div>';
  }
  if (card && card.siegesSynthese) {
    var siegesRole = (card.f4p4Winner || card.chaineWinner) ? 'confirmation' : 'décisif — repli';
    var siegesAccord = card.accordSieges ? ' — <span style="color:#4ade80;">accord ✅</span>'
      : card.desaccordSieges ? ' — <span style="color:#f87171;">désaccord ⚠️</span>' : '';
    html+='<div style="margin-bottom:10px; padding:9px 12px; border-radius:8px; background:#13233a; border:1px solid #38bdf8; font-size:12px; color:#e2e8f0;">🪑 <b>Lecture des sièges ('+siegesRole+')</b> : '+esc(card.siegesSynthese)+siegesAccord+'</div>';
  }
  if (card && card.desaccordSieges) {
    html+='<div style="margin-bottom:10px; padding:9px 12px; border-radius:8px; background:#3b1d1d; border:1px solid #f87171; font-size:12px; color:#fecaca;">⚠️ <b>Les deux lectures se contredisent</b> — la chaîne donne <b>'+esc(card.chaineWinner)+'</b>, les sièges <b>'+esc(card.siegesWinner)+'</b>. Cas à noter : leur hiérarchie n\'est pas encore tranchée par les résultats réels (elles divergent sur ~46% des thèmes).</div>';
  }
  if (card && card.reseauSynthese) {
    var reseauRole = (card.f4p4Winner || card.chaineWinner || card.siegesWinner) ? 'comparaison' : 'décisif — repli';
    var reseauAccord = card.accordReseau ? ' — <span style="color:#4ade80;">accord ✅</span>' : card.desaccordReseau ? ' — <span style="color:#f87171;">désaccord ⚠️</span>' : '';
    html+='<div style="margin-bottom:10px; padding:9px 12px; border-radius:8px; background:#241a33; border:1px solid #8E5FC7; font-size:12px; color:#e2e8f0;">🕸️ <b>Réseau d\'ancrage ('+reseauRole+')</b> : '+card.reseauSynthese+reseauAccord+'</div>';
    if (card.protocoleWinnerCompare) {
      html+='<div style="margin-bottom:10px; padding:9px 12px; border-radius:8px; background:#111a2e; border:1px solid #334155; font-size:11.5px; color:#94a3b8;">📋 Protocole officiel (comparaison) : <b>'+esc(card.protocoleWinnerCompare)+'</b>'+(card.accordProtocole?' — <span style="color:#4ade80;">accord ✅</span>' : card.desaccordProtocole?' — <span style="color:#f87171;">désaccord ⚠️</span>' : '')+'</div>';
    }
  }
  if (card && card.contradictionReseau) {
    html+='<div style="margin-bottom:10px; padding:9px 12px; border-radius:8px; background:#7f1d1d33; border:1px solid #f87171; font-size:12px; color:#fecaca;">⚠️ <b>CONTRADICTION</b> — le Réseau d\'ancrage (👉 panneau ci-dessous) donne un vainqueur différent : <b>'+esc(card.reseauWinnerRotation)+'</b> ('+esc(card.reseauNiveauLabel)+', écart '+esc(card.reseauEcartNet)+(card.reseauPiege?', camp piégé':'')+'). Fiabilité réduite, à examiner avant de trancher.</div>';
  }
  // ─── LA PORTE DE CONFIANCE, AU-DESSUS DU VERDICT (29/08/26) ───
  // Elle se lit AVANT le vainqueur, parce qu'elle dit si le thème a le
  // droit de trancher. Elle ne modifie rien, et elle affiche le chiffre
  // d'archive qui la contredit. Voir porteConfianceV7.
  (function () {
    var pc = null;
    try { pc = porteConfianceV7(theme); } catch (e) { pc = null; }
    if (!pc) return;
    var col = pc.ouverte ? '#4ade80' : (pc.nbAxes === 2 ? '#fbbf24' : '#f87171');
    var fond = pc.ouverte ? 'rgba(22,101,52,.16)' : (pc.nbAxes === 2 ? 'rgba(180,83,9,.14)' : 'rgba(127,29,29,.16)');
    var puces = pc.dets.map(function (d) {
      return '<span style="font-size:10.5px; color:' + (d.axes ? '#86efac' : '#fca5a5') + ';">'
        + (d.axes ? '✔' : '✘') + ' ' + esc(d.nom) + '</span>';
    }).join('&nbsp;&nbsp;·&nbsp;&nbsp;');
    html += '<div style="margin-bottom:10px; padding:9px 12px; border-radius:9px; background:' + fond
      + '; border:1px solid ' + col + ';">'
      + '<div style="font-size:12.5px; font-weight:800; color:' + col + ';">'
      + (pc.ouverte ? '🔓 PORTE DE CONFIANCE OUVERTE — le thème tranche'
                    : '🔒 PORTE DE CONFIANCE FERMÉE — le verdict peut être faux')
      + ' <span style="font-weight:600; color:#cbd5e1;">(' + pc.nbAxes + '/3 dérivés d\'axe valides)</span></div>'
      + '<div style="font-size:11px; color:#e2e8f0; margin-top:3px;">' + esc(pc.texte) + '</div>'
      + '<div style="margin-top:5px;">' + puces
      + '<span style="font-size:10px; color:#64748b;">&nbsp;&nbsp;|&nbsp;&nbsp;binômes des dérivés '
      + pc.nbBinomes + '/3</span></div>'
      + (pc.taux != null ? '<div style="font-size:10px; color:#94a3b8; margin-top:5px;">'
          + '⚠️ <b>Le chiffre d\'archive va à l\'envers de cette règle</b> : à ce palier le verdict affiché '
          + 'est juste <b>' + pc.taux + ' %</b> du temps (' + pc.sur + ' cas), et le classement complet est '
          + '1 axe 83 %, 2 axes 86 %, <b>3 axes 59 %</b>. Un thème dont les trois dérivés sont valides est, '
          + 'dans ce qu\'on a, MOINS juste que les autres.</div>' : '')
      + '<div style="font-size:9.5px; color:#64748b; margin-top:4px;">'
      + 'Ta paire du 29/08 dit le contraire de l\'archive, et proprement : deux tirages pour un seul match, '
      + 'le tirage à trois dérivés valides a vu juste, l\'autre non. Ce sont deux questions différentes — '
      + '« ce thème isolé est-il fiable ? » et « entre deux thèmes du même match, lequel croire ? ». '
      + 'L\'archive (37 cas) répond à la première, tes paires à la seconde. '
      + '<b style="color:#fbbf24;">⚠️ 30/08 : la paire du nul 1-1 ne se laisse pas départager</b> — les deux '
      + 'thèmes sont à 3/3 dérivés valides et niveau 3/3, et pourtant l\'un voit juste et l\'autre non. '
      + 'Le critère est à 1 paire sur 2. '
      + 'La porte n\'est branchée sur aucun calcul tant que le comparateur de doubles tirages n\'a pas '
      + 'une dizaine de paires.</div></div>';
  })();
  // ─── L'ACCORD F4P4 / CRITÈRES SUR LE CAMP (30/08/26) ───
  // Affiché seulement, jamais décisif. Voir accordCampV7.
  (function () {
    var ac = null;
    try { ac = accordCampV7(theme); } catch (e) { ac = null; }
    if (!ac || !ac.lisible || nulActif) return;
    // Plus de vert : au 30/08/26 l'accord ne vaut plus rien (p = 0,499).
    // Une bordure grise pour un renseignement, pas un feu de circulation.
    var col = '#94a3b8';
    var nomF = ac.f4p4 === 'R1' ? teamA : teamB;
    var nomC = ac.criteres === 'R1' ? teamA : teamB;
    html += '<div style="margin-bottom:10px; padding:8px 11px; border-radius:9px; '
      + 'background:rgba(15,23,42,.55); border:1px solid ' + col + ';">'
      + '<div style="font-size:12px; font-weight:800; color:' + col + ';">'
      + (ac.accord
        ? '🤝 les deux lectures du camp s\'accordent sur ' + esc(nomF) + ' — sans valeur, voir ci-dessous'
        : '⚠️ les deux lectures du camp se contredisent — F4P4 dit ' + esc(nomF)
          + ', les critères disent ' + esc(nomC))
      + '</div>'
      + '<div style="font-size:10.5px; color:#cbd5e1; margin-top:3px;">'
      + 'Accord <b>' + (ac.accord ? ac.juste + '/' + ac.sur : ac.autreJuste + '/' + ac.autreSur) + '</b> · désaccord <b>'
      + (ac.accord ? ac.autreJuste + '/' + ac.autreSur : ac.juste + '/' + ac.sur) + '</b> — '
      + '<b style="color:#f87171;">p = ' + ac.p.toFixed(3) + '</b>. '
      + 'L\'écart n\'a jamais tenu en place : 79/55 à 19 cas, 70/46 à 33, 67/53 à 36, 67/50 à 37, avec un p '
      + 'qui a fait 0,225 → 0,276 → 0,499 → 0,336. Un vrai effet se resserre autour d\'une valeur ; celui-ci '
      + 'saute à chaque match. Ces chiffres se recalculent sur l\'archive à chaque ouverture — ils ne sont '
      + 'plus écrits à la main.'
      + '</div>'
      + '<div style="font-size:9.5px; color:#f87171; margin-top:4px;">'
      + '☠️ Sur les DEUX triplets joués, le thème en accord était le mauvais et le thème gagnant '
      + 'était en désaccord. 0 sur 2. <b>Ne choisis jamais un thème d\'un triplet là-dessus.</b> '
      + '<span style="color:#94a3b8;">(F4P4 seul 22/36, cascade complète 22/36, critères seuls 23/36, '
      + 'témoin « toujours R1 » 21/36 : les trois lectures tiennent dans un cas.)</span>'
      + '</div></div>';
  })();

  // ─── LE CAMP DOUBLÉ (30/08/26, découverte d'Ellemine_D) ───
  // Affiché, jamais décisif. Voir campDoubleV7.
  (function () {
    var cd = null;
    try { cd = campDoubleV7(theme); } catch (e) { cd = null; }
    if (!cd) return;
    if (!cd.applicable) {
      html += '<div style="margin-bottom:10px; padding:7px 11px; border-radius:9px; '
        + 'background:rgba(15,23,42,.5); border:1px solid #334155; font-size:11px; color:#94a3b8;">'
        + '⚖️ <b>Camp doublé</b> — inapplicable : ' + esc(cd.raison)
        + ' (R1 en M' + cd.hR1 + ', R7 en M' + cd.hR7 + ').</div>';
      return;
    }
    var nomDouble = cd.camp === 'R1' ? teamA : teamB;
    var accord = null;
    if (!nulActif && cardWinner) {
      var ditR1 = (cardWinner === teamA);
      accord = (cd.camp === 'R1') === ditR1;
    }
    var col = accord === true ? '#4ade80' : accord === false ? '#fbbf24' : '#64748b';
    html += '<div style="margin-bottom:10px; padding:8px 11px; border-radius:9px; '
      + 'background:rgba(15,23,42,.55); border:1px solid ' + col + ';">'
      + '<div style="font-size:12px; font-weight:800; color:' + col + ';">'
      + '✦ THÉORÈME D\'ELLEMINE — CAMP DOUBLÉ : ' + esc(nomDouble) + ', sa maison porte DEUX éléments'
      + (accord === true ? ' · <span style="color:#4ade80;">d\'accord avec le verdict</span>'
        : accord === false ? ' · <span style="color:#fbbf24;">en désaccord avec le verdict</span>' : '')
      + '</div>'
      + '<div style="font-size:10.5px; color:#cbd5e1; margin-top:3px;">'
      + 'R1 en M' + cd.hR1 + ' (' + esc(cd.elementR1) + ') · R7 en M' + cd.hR7 + ' ('
      + esc(cd.elementR7) + ') — M' + cd.maisonDouble + ' est une maison de confusion, M'
      + cd.maisonSimple + ' non.</div>'
      + (function () {
          var f = null;
          try { f = fusionElementV7(theme); } catch (e) { f = null; }
          if (!f || f.anomalie) return '';
          var nomD = esc(f.camp === 'R1' ? teamA : teamB);
          return '<div style="font-size:10.5px; color:#cbd5e1; margin-top:3px;">'
            + '<b>Fusion des éléments</b> (axe ' + esc(f.axe) + ') — les deux camps partagent <b>'
            + esc(f.nomCommun) + '</b> ; ' + nomD + ' a <b>' + esc(f.nomExtra) + '</b> en plus, et sa '
            + 'maison est dominée par <b>' + esc(f.nomDominant) + '</b> — '
            + (f.domineParSonSupplement
              ? 'donc par <b>ce qu\'il a en plus</b>, l\'élément que l\'autre n\'a pas.'
              : 'donc par <b>l\'élément partagé</b> : sa force est celle que l\'autre a aussi.')
            + '<span style="color:#94a3b8;"> Le camp doublé porte toujours l\'élément de l\'adversaire '
            + 'PLUS un — vrai des six axes, donc de tous les thèmes. Ni le supplément ni la domination ne '
            + 'prédisent quoi que ce soit (nul p = 0,669 · camp p = 1,000 · BTTS p = 0,183), et les deux '
            + 'lectures restent indiscernables tant qu\'aucun thème ne sort en axe M4/M10 — jamais vu en '
            + '50 tirages, attendu dans 6,25 % d\'entre eux.</span>'
            + (f.separateur
              ? '<div style="margin-top:4px; padding:5px 8px; border:1px solid #4ade80; border-radius:7px; '
                + 'background:rgba(74,222,128,.10); color:#86efac;"><b>⭐ AXE M4/M10 — LE THÈME QU\'ON ATTEND.</b> '
                + 'C\'est le seul axe où l\'ordre de la table (« TE » et non « ET ») change la classe. '
                + 'À enregistrer : il sépare pour la première fois les deux lectures.</div>'
              : '')
            + '</div>';
        })()
      + '<div style="font-size:9.5px; color:#94a3b8; margin-top:4px;">'
      + '<b>Jamais égaux, jamais étrangers.</b> Comme R7 est toujours six maisons après R1 — sur SEIZE, '
      + 'pas sur douze — <b>l\'un des deux camps est toujours en maison double et l\'autre en maison '
      + 'simple</b> quand les deux restent dans les douze : jamais les deux, jamais aucun (8 positions '
      + 'de départ sur 16, 0 violation). '
      + 'Ils ne sont d\'ailleurs jamais tous les deux en synthèse non plus. Il ne vaut donc que la '
      + 'moitié des thèmes. Le camp doublé PRIS SEUL ne bat pas le verdict (13/19 contre 14/19), et '
      + 'il ne dit rien du nul (p = 0,297). Ce qui compte, c\'est leur <b>accord</b> : d\'accord, le '
      + 'verdict est juste 10 fois sur 12 ; en désaccord, 4 fois sur 7. '
      + '<b style="color:#fbbf24;">Non démontré</b> — 19 cas — et branché sur aucun calcul. '
      + 'Il a déjà raté une fois en plein accord (30/08, 2-0 contre un R7 annoncé des deux côtés).'
      + '</div></div>';
  })();
  html+='<div class="tek-hero">';
  var _alerteNul=false; try{ _alerteNul = !nulActif && alerteNulV7(theme); }catch(e){ _alerteNul=false; }
  var _rej = null;
  try { _rej = themeRejeteV7(theme); } catch (e) { _rej = null; }
  var _refuse = !!(_rej && _rej.rejete);
  // LE NIVEAU INFORME MAINTENANT AU LIEU DE CENSURER (04/09/26). Le rejet
  // levé, _refuse vaut false partout — mais le critère continue d'être
  // calculé et de s'afficher, en bandeau, avec le chiffre qui a servi à
  // lever la porte. Rien n'est caché : ni le niveau, ni ce qui manque, ni
  // le fait que ce niveau n'a jamais prédit quoi que ce soit.
  var _sousSeuil = null;
  try { _sousSeuil = (!_refuse) ? sousSeuilValiditeV7(theme) : null; } catch (e) { _sousSeuil = null; }
  if (_sousSeuil && !_sousSeuil.rejete) _sousSeuil = null;
  // ─── LE VERDICT STANDARD EN DIX LIGNES (31/08/26) ───
  // Son format, en tête de carte, chaque ligne avec son taux mesuré.
  (function () {
    var vs = null;
    try { vs = verdictStandardV7(theme, teamA, teamB); } catch (e) { vs = null; }
    if (!vs || _refuse) return;
    var D = DOSSIER_LIGNES_V7;
    function dossier(d) {
      if (!d || !d.sur) return '<span style="color:#f87171;">0 cas — jamais mesuré</span>';
      var t = Math.round(100 * d.juste / d.sur);
      var col = d.sur < 6 ? '#94a3b8' : (t >= 65 ? '#4ade80' : t >= 55 ? '#fbbf24' : '#f87171');
      return '<span style="color:' + col + ';">' + d.juste + '/' + d.sur + ' · ' + t + ' %</span>'
        + (d.note ? '<span style="color:#94a3b8;"> — ' + esc(d.note) + '</span>' : '');
    }
    function ligne(num, nom, valeur, d, detail) {
      return '<tr>'
        + '<td style="padding:4px 6px; color:#64748b; font-size:10px;">' + num + '</td>'
        + '<td style="padding:4px 6px; color:#cbd5e1;">' + nom + '</td>'
        + '<td style="padding:4px 6px; font-weight:800; color:#e2e8f0;">' + esc(valeur)
          + (detail ? '<span style="font-weight:400; color:#94a3b8; font-size:10px;"> ' + esc(detail) + '</span>' : '')
          + '</td>'
        + '<td style="padding:4px 6px; text-align:right; font-size:10px;">' + dossier(d) + '</td></tr>';
    }
    html += '<div style="margin-bottom:10px; padding:10px 12px; border-radius:11px; '
      + 'border:2px solid #60a5fa; background:rgba(37,99,235,.10);">'
      + '<div style="font-size:13px; font-weight:900; color:#93c5fd; margin-bottom:2px;">📋 VERDICT — LES DIX LIGNES</div>'
      + '<div style="font-size:10px; color:#94a3b8; margin-bottom:6px;">Chaque ligne avec son taux mesuré sur l\'archive. '
      + 'Une prédiction sans son taux est une opinion déguisée en chiffre.</div>'
      + '<table style="width:100%; border-collapse:collapse; font-size:11.5px;">'
      + ligne(1, 'Vainqueur', vs.vainqueur.valeur, D.vainqueur)
      + ligne(2, 'Score exact', vs.score.valeur, D.score, 'alt. ' + vs.score.alt)
      + ligne(3, 'Double chance', vs.doubleChance.texte, D.doubleChance)
      + ligne(4, 'Les deux marquent', vs.btts.valeur, D.btts)
      + ligne(5, 'Mi-temps 1 — but ?', vs.miTemps1.valeur, D.miTemps1, vs.miTemps1.detail)
      + ligne(6, 'Nombre de corners', vs.corners.valeur, D.corners)
      + ligne(7, 'Cartons jaunes', vs.cartons.valeur, D.cartons)
      + ligne(8, 'Buts 2,5', vs.buts25.valeur, D.buts25)
      + ligne(9, 'Incidents', vs.incident.valeur, D.incident)
      + ligne(10, 'Buts de la tête', vs.tete.valeur, D.tete, vs.tete.detail)
      + '</table>'
      + '<div style="font-size:9.5px; color:#94a3b8; margin-top:6px; line-height:1.5;">'
      + '⚠️ La <b>double chance</b> n\'est pas meilleure parce qu\'elle voit mieux : elle demande MOINS. '
      + 'Elle couvre deux issues sur trois, et le hasard seul y ferait déjà ~76 % avec la répartition de '
      + 'l\'archive. 82 % contre 76 %, c\'est un pari plus large à cote plus basse, pas un exploit. '
      + 'Et <b>« plus de 2,5 buts » à 53 % ne dit rien du tout</b>.'
      + '</div></div>';
  })();
  html+='<div class="tek-winner '+(_refuse?'warn':(nulActif?'warn':''))+'"><div class="tek-cap">'
    +(_refuse?'THÈME REJETÉ':(nulActif?'VERDICT SUSPENDU':'VAINQUEUR'))+'</div><div class="tek-name">'
    +(_refuse?'⛔ NON VALIDE':(nulActif?'⚖️ NUL À VÉRIFIER':esc(cardWinner)))+'</div>'
    +(_refuse
      ? '<div class="tek-score" style="font-size:12px; line-height:1.5;">validation '
        + _rej.niveau + '/3 — le seuil est ' + _rej.seuil + '/3'
        + '<div style="font-size:10.5px; color:#fca5a5; margin-top:5px; text-align:left;">'
        + _rej.manques.slice(0, 6).map(function (m) { return '• ' + esc(m); }).join('<br>')
        + (_rej.manques.length > 6 ? '<br>• … et ' + (_rej.manques.length - 6) + ' autre(s)' : '')
        + '</div>'
        + '<div style="font-size:10px; color:#94a3b8; margin-top:6px; text-align:left;">'
        + 'Thème ignoré : ni vainqueur ni score. Les autres lectures restent affichées plus bas.'
        + '</div></div>'
      : '<div class="tek-score">Score prédit : '+esc(scoreMain)+'<br><span style="font-size:11px;color:#94a3b8">alternative : '+esc(scoreAlt)+'</span></div>')
    +(_sousSeuil ? '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #64748b; border-radius:7px; '
      + 'background:rgba(100,116,139,.12); font-size:11px; color:#cbd5e1; text-align:left;">'
      + '🗓️ <b>VALIDATION ' + _sousSeuil.niveau + '/3</b> — sous le seuil traditionnel de '
      + _sousSeuil.seuil + '/3. <b>Le verdict est annoncé quand même</b>, et c\'est délibéré : '
      + 'sur 58 cas au banc, les thèmes sous le seuil sont justes <b>69 %</b> du temps sur le camp, '
      + 'contre 64 % pour les thèmes au seuil (p = 0,732), et ils gagnent aussi sur le nul (87 % / 73 %) '
      + 'et sur les deux marquent (71 % / 50 %). Quatre familles lisibles sur cinq penchent de ce côté-ci. '
      + 'Le niveau reste affiché parce qu\'il fait partie de la lecture, pas parce qu\'il prédit.'
      + (_sousSeuil.manques && _sousSeuil.manques.length
        ? '<div style="font-size:10px; color:#94a3b8; margin-top:5px;">'
          + _sousSeuil.manques.slice(0, 4).map(function (m) { return '• ' + esc(m); }).join('<br>')
          + (_sousSeuil.manques.length > 4 ? '<br>• … et ' + (_sousSeuil.manques.length - 4) + ' autre(s)' : '')
          + '</div>' : '')
      + '</div>' : '')
    +(_alerteNul ? '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #f59e0b; border-radius:7px; '
      + 'background:rgba(245,158,11,.12); font-size:11px; color:#fbbf24; text-align:left;">'
      + '<b>⚠️ ALERTE NUL</b> — la porte du nul est ouverte, mais R1 n\'est pas en maison cadente. '
      + 'Le vainqueur reste annoncé parce que le croisement complet n\'est pas atteint, mais dans cette '
      + 'situation l\'archive donne <b>un nul sur deux</b> (le 0-0 du 14/02 en était un). '
      + 'À ne pas jouer sec.</div>' : '')
    // MODE LIVE (03/09/26) : le score et le temps écoulé saisis en mode
    // "Live" étaient auparavant affichés sans être lus par aucun calcul
    // (cf. commentaire historique près de toggleDrawMode). Ils servent
    // désormais à deux choses honnêtes — voir appliquerEtatLiveV7 — mais
    // sans prétendre à une doctrine géomantique validée sur le direct :
    // aucune règle de ce fichier n'a été mesurée sur des tirages en cours
    // de match, contrairement au reste du moteur.
    +(card.liveState ? '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #38bdf8; border-radius:7px; '
      + 'background:rgba(56,189,248,.10); font-size:11px; color:#7dd3fc; text-align:left;">'
      + '🔴 <b>EN DIRECT</b> — score actuel ' + esc(card.liveState.g1 + '-' + card.liveState.g2) + (card.liveState.minutes!=null ? ' à la ' + card.liveState.minutes + 'e minute' : '')
      + '. Score final ci-dessus ajusté avec un plancher au score en direct (aucun but déjà marqué n\'est retiré) ; '
      + 'non validé empiriquement, contrairement au reste du moteur.</div>' : '')
    +(card.liveContradiction ? '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #f87171; border-radius:7px; '
      + 'background:rgba(248,113,113,.12); font-size:11px; color:#fca5a5; text-align:left;">'
      + '<b>⚠️ CONTREDIT PAR LE DIRECT</b> — ' + esc(card.liveContradiction) + '</div>' : '')
    // COÏNCIDENCE JUGE/3-AXES (03/09/26) — cf. coincidenceJugeAxesV7 : signal
    // purement observationnel (2 cas connus dans l'archive à ce jour, tous
    // deux des scores serrés), aucun poids sur le verdict. Affiché pour
    // accumuler des cas au fil du temps, pas pour orienter la lecture.
    +((function(){ try { return coincidenceJugeAxesV7(theme); } catch(e){ return false; } })()
      ? '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #a78bfa; border-radius:7px; '
        + 'background:rgba(167,139,250,.10); font-size:11px; color:#c4b5fd; text-align:left;">'
        + '🎯 <b>COÏNCIDENCE JUGE/3-AXES</b> — le Juge égale la combinaison des axes Cardinal+Succédent+Cadent '
        + '(1 thème sur 8 en moyenne). Signal en observation, pas encore assez de cas réels pour conclure — '
        + 'aucun poids sur le verdict.</div>' : '')
    // SIGNAL M4/M10 (03/09/26) — cf. signalM4M10BoucleV7 : M1 et M7 dans deux
    // boucles différentes, et M4+M10 tous deux dans la boucle de l'un des
    // deux camps. Le plus net des signaux d'observation testés à ce jour
    // (8/11 = 73% sur les cas décidés de l'archive, contre 38% pour la
    // seule boucle de M1), mais échantillon encore modeste (11-13 cas) —
    // pas encore au niveau de preuve exigé ailleurs, aucun poids sur le verdict.
    // ─── ALERTE DE CONTRADICTION (03/09/26) ─── Vérifié sur l'archive :
    // quand le signal s'applique, il contredit le verdict officiel dans
    // 69% des cas (4/13 d'accord) — et dans CES cas précis, c'est
    // historiquement le verdict officiel qui se trompe le plus (4/11 = 36%
    // contre 52% sur le reste de l'archive), là où le signal reste à 73%.
    // Toujours affiché à titre d'alerte, jamais pour changer le vainqueur
    // affiché : aucune bascule automatique tant que l'échantillon (11 cas)
    // reste aussi modeste.
    +((function(){
        var s; try { s = signalM4M10BoucleV7(theme); } catch(e){ s = {applicable:false}; }
        if (!s.applicable) return '';
        var sigCampR = s.campSoutenu === 'M1' ? 'R1' : 'R7';
        var campNom = s.campSoutenu === 'M1' ? teamA : teamB;
        var html = '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #34d399; border-radius:7px; '
          + 'background:rgba(52,211,153,.10); font-size:11px; color:#6ee7b7; text-align:left;">'
          + '🧭 <b>SIGNAL M4/M10</b> — M1 et M7 dans deux boucles différentes, M4 et M10 tous deux dans la boucle de '
          + campNom + '. Sur l\'archive à ce jour : correct 8 fois sur 11 cas décidés (73%). Signal en observation, '
          + 'échantillon encore modeste — aucun poids sur le verdict.</div>';
        if (card.winner && card.winner !== 'Nul' && card.winner !== sigCampR) {
          html += '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #fbbf24; border-radius:7px; '
            + 'background:rgba(251,191,36,.12); font-size:11px; color:#fde68a; text-align:left;">'
            + '⚠️ <b>SIGNAL M4/M10 CONTREDIT LE VERDICT</b> — le verdict ci-dessus désigne '
            + (card.winner === 'R1' ? teamA : teamB) + ', le signal désigne ' + campNom
            + '. Sur les 11 cas de l\'archive où ce désaccord précis a été mesuré, le verdict officiel avait raison '
            + '4 fois (36%) contre 8 pour le signal (73%) — un échantillon encore modeste, mais qui va dans le sens du signal.</div>';
        }
        return html;
      })())
    // SIGNAL M15/M16 (03/09/26) — cf. signalM15M16BoucleV7 : quand le Juge
    // et la Sentence tombent ensemble dans la boucle d'un camp, c'est
    // l'AUTRE camp qui gagne le plus souvent sur l'archive (9/11 = 82%).
    // Statut plus fragile que M4/M10 (trouvé en inversant une hypothèse
    // après coup) — affiché quand même en observation, aucun poids sur
    // le verdict.
    +((function(){
        var s; try { s = signalM15M16BoucleV7(theme); } catch(e){ s = {applicable:false}; }
        if (!s.applicable) return '';
        var sigCampR = s.campPredit === 'M1' ? 'R1' : 'R7';
        var campNom = s.campPredit === 'M1' ? teamA : teamB;
        var html = '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #818cf8; border-radius:7px; '
          + 'background:rgba(129,140,248,.10); font-size:11px; color:#c7d2fe; text-align:left;">'
          + '🔮 <b>SIGNAL M15/M16 (inversé)</b> — Juge et Sentence tous deux dans la boucle de '
          + (s.campAccorde === 'M1' ? teamA : teamB) + ', ce qui a historiquement favorisé l\'AUTRE camp, '
          + campNom + '. Sur l\'archive : correct 9 fois sur 11 (82%). Signal plus fragile que M4/M10 '
          + '(trouvé en inversant l\'hypothèse de départ) — aucun poids sur le verdict.</div>';
        if (card.winner && card.winner !== 'Nul' && card.winner !== sigCampR) {
          html += '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #fbbf24; border-radius:7px; '
            + 'background:rgba(251,191,36,.12); font-size:11px; color:#fde68a; text-align:left;">'
            + '⚠️ <b>SIGNAL M15/M16 CONTREDIT LE VERDICT</b> — le verdict ci-dessus désigne '
            + (card.winner === 'R1' ? teamA : teamB) + ', le signal désigne ' + campNom + '.</div>';
        }
        return html;
      })())
    // SIGNAL AXE CADENT INVERSÉ (03/09/26) — cf. signalAxeCadentInverseV7 :
    // le camp vers lequel penche l'axe Cadent (M3+M6+M9+M12) perd le plus
    // souvent sur l'archive (70% en inversant, n=23 — le plus grand
    // échantillon des 3 signaux suivis). Statut : trouvé par inversion,
    // comme M15/M16, mais échantillon plus large. Aucun poids sur le verdict.
    +((function(){
        var s; try { s = signalAxeCadentInverseV7(theme); } catch(e){ s = {applicable:false}; }
        if (!s.applicable) return '';
        var sigCampR = s.campPredit === 'M1' ? 'R1' : 'R7';
        var campNom = s.campPredit === 'M1' ? teamA : teamB;
        var campVoteNom = s.voteDirect === 'M1' ? teamA : teamB;
        var html = '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #f472b6; border-radius:7px; '
          + 'background:rgba(244,114,182,.10); font-size:11px; color:#fbcfe8; text-align:left;">'
          + '🧿 <b>SIGNAL AXE CADENT (inversé)</b> — l\'axe Cadent penche vers ' + campVoteNom
          + ', ce qui a historiquement favorisé l\'AUTRE camp, ' + campNom
          + '. Sur l\'archive : correct 16 fois sur 23 (70%, le plus grand échantillon des signaux suivis). '
          + 'Trouvé par inversion (même réserve que M15/M16) — aucun poids sur le verdict.</div>';
        if (card.winner && card.winner !== 'Nul' && card.winner !== sigCampR) {
          html += '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #fbbf24; border-radius:7px; '
            + 'background:rgba(251,191,36,.12); font-size:11px; color:#fde68a; text-align:left;">'
            + '⚠️ <b>SIGNAL AXE CADENT CONTREDIT LE VERDICT</b> — le verdict ci-dessus désigne '
            + (card.winner === 'R1' ? teamA : teamB) + ', le signal désigne ' + campNom + '.</div>';
        }
        return html;
      })())
    // SIGNAL DE RECOUVREMENT DES CAMPS (03/09/26) — cf. signalRecouvrementCampsV7 :
    // plus les deux camps sont bâtis avec les mêmes figures, plus le thème
    // penche vers le nul (30,3% au-dessus du seuil contre 9,1% en dessous,
    // n=55, p≈0,10). Seul signal de nul suivi qui a un pourquoi mécanique
    // (matériau partagé) plutôt qu'une simple corrélation. Aucun poids sur le verdict.
    +((function(){
        var s; try { s = signalRecouvrementCampsV7(theme); } catch(e){ s = {overlap:0, eleve:false}; }
        if (!s.eleve) return '';
        var html = '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #a78bfa; border-radius:7px; '
          + 'background:rgba(167,139,250,.10); font-size:11px; color:#ddd6fe; text-align:left;">'
          + '🪞 <b>SIGNAL DE RECOUVREMENT DES CAMPS</b> — les deux camps partagent '
          + s.overlap + ' figure(s) sur 8 maisons (' + s.detail.map(function(d){ return FL[d.fig] || d.fig; }).join(', ')
          + '). Sur l\'archive, ce niveau de partage penche vers le nul (30% contre 9% en dessous du seuil, n=55, p≈0,10). '
          + 'Aucun poids sur le verdict.</div>';
        if (card.winner && card.winner !== 'Nul') {
          html += '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #fbbf24; border-radius:7px; '
            + 'background:rgba(251,191,36,.12); font-size:11px; color:#fde68a; text-align:left;">'
            + '⚠️ <b>SIGNAL DE RECOUVREMENT CONTREDIT LE VERDICT</b> — le verdict ci-dessus désigne un vainqueur net, '
            + 'le signal penche vers un nul.</div>';
        }
        return html;
      })())
    // SIGNAL DE FRAGILITÉ M4/M10 (03/09/26) — cf. signalFragiliteM4M10V7 :
    // M4 ou M10 mobile+ouverte (défense qui bouge et qui laisse passer)
    // penche vers le BTTS (64,5% contre 28,6%, n=45, p≈0,05). L'attaque
    // M1/M7 ouverte et l'axe offensif commun ont été vérifiés et écartés
    // (voir le commentaire de signalFragiliteM4M10V7). Aucun poids sur le verdict.
    +((function(){
        var s; try { s = signalFragiliteM4M10V7(theme); } catch(e){ s = {applicable:false}; }
        if (!s.applicable) return '';
        var maisons = [];
        if (s.fragileM4) maisons.push('M4 (' + (FL[s.m4] || s.m4) + ')');
        if (s.fragileM10) maisons.push('M10 (' + (FL[s.m10] || s.m10) + ')');
        var html = '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #34d399; border-radius:7px; '
          + 'background:rgba(52,211,153,.10); font-size:11px; color:#a7f3d0; text-align:left;">'
          + '🥅 <b>SIGNAL DE FRAGILITÉ DÉFENSIVE</b> — ' + maisons.join(' et ')
          + ' mobile(s) et ouverte(s).'
          + (s.fragileM4
            ? ' <b>M4 est celle qui porte</b> : 63 % de BTTS contre 39 % sinon (n=52, p=0,150).'
            : '')
          + (s.fragileM10 && !s.fragileM4
            ? ' <b>Seule M10 l\'est, et M10 va en SENS INVERSE</b> : 36 % de BTTS contre 53 % sinon.'
            : '')
          + ' <span style="color:#fbbf24;">Chiffre corrigé le 05/09 : le « 65 % contre 29 %, n=45, p≈0,05 » '
          + 'affiché jusqu\'ici était périmé — sur 52 cas, M4 OU M10 donne 52 % contre 44 %, p=0,592. '
          + 'Les deux maisons tirent en sens contraire et s\'annulent.</span> Aucun poids sur le verdict.</div>';
        // La contradiction ne se signale plus que sur M4, la seule des deux
        // maisons qui porte quelque chose (05/09/26).
        if (card.btts === false && s.fragileM4) {
          html += '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #fbbf24; border-radius:7px; '
            + 'background:rgba(251,191,36,.12); font-size:11px; color:#fde68a; text-align:left;">'
            + '⚠️ <b>M4 FRAGILE CONTREDIT LE VERDICT</b> — le verdict ci-dessus exclut le BTTS, '
            + 'et M4 mobile+ouverte penche vers les deux équipes qui marquent (63 % contre 39 %).</div>';
        }
        return html;
      })())
    // SIGNAL M4 — DOCTRINE JUGE_RECIT (04/09/26) — cf.
    // signalM4JugeRecitBttsV7 : M4 dans {Via, Conjunctio, Amissio,
    // Fortuna Minor} penche vers le BTTS. REMESURÉ le 05/09 sur 52 cas
    // (41 archive + 11 du 04/09) : 77 % contre 38 %, p = 0,025 — le
    // signal a MONTÉ avec les cas neufs, il était à 75 % contre 44-50 %
    // sur 45. C'est à ce jour le plus fort des signaux mesurés du
    // fichier, et il est fondé sur le TEXTE doctrinal JUGE_RECIT, écrit
    // avant toute statistique — pas sur une corrélation pêchée dans les
    // données. Aucun poids sur le verdict tant qu'il n'a pas été annoncé
    // d'avance sur dix matchs (protocole du 04/09).
    +((function(){
        var s; try { s = signalM4JugeRecitBttsV7(theme); } catch(e){ s = {applicable:false}; }
        if (!s.applicable) return '';
        var html = '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #34d399; border-radius:7px; '
          + 'background:rgba(52,211,153,.10); font-size:11px; color:#a7f3d0; text-align:left;">'
          + '📖 <b>SIGNAL M4 — DOCTRINE JUGE_RECIT</b> — M4 (' + (FL[s.m4] || s.m4) + ') fait partie des figures '
          + 'dont le dénouement suppose des buts des deux côtés. <b>77 % contre 38 % sinon</b> '
          + '(n=52, p = 0,025) — remesuré le 05/09, le signal a MONTÉ avec les onze cas neufs. '
          + 'Le plus fort du fichier à ce jour, et fondé sur le texte doctrinal, pas sur une '
          + 'corrélation pêchée. Aucun poids sur le verdict tant qu\'il n\'aura pas été annoncé '
          + 'd\'avance sur dix matchs.</div>';
        if (card.btts === false) {
          html += '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #fbbf24; border-radius:7px; '
            + 'background:rgba(251,191,36,.12); font-size:11px; color:#fde68a; text-align:left;">'
            + '⚠️ <b>SIGNAL M4 CONTREDIT LE VERDICT</b> — le verdict ci-dessus exclut le BTTS, '
            + 'le signal penche vers les deux équipes qui marquent.</div>';
        }
        return html;
      })())
    // SIGNAL JUGE POPULUS + AXES CHARGÉS (04/09/26) — cf.
    // signalJugePopulusChaosV7 : ne s'affiche que si le Juge est Populus
    // (1/8 des thèmes). Sens de lecture NON établi — vérifié sur les 3
    // seuls cas connus, et ça ne tient pas (voir le commentaire de la
    // fonction). Affiché à titre purement informatif pour accumuler des
    // cas ; aucune alerte de contradiction, aucun poids sur le verdict.
    +((function(){
        var s; try { s = signalJugePopulusChaosV7(theme); } catch(e){ s = {applicable:false}; }
        if (!s.applicable) return '';
        var detail = s.axes.map(function(a){
          var charge = FIGURES_MARS_V7[a.fig] || FIGURES_NEGATIVES_V7[a.fig];
          return a.nom + ' : ' + (FL[a.fig] || a.fig) + (charge ? ' ⚠' : '');
        }).join(' · ');
        return '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #94a3b8; border-radius:7px; '
          + 'background:rgba(148,163,184,.10); font-size:11px; color:#cbd5e1; text-align:left;">'
          + '🪞 <b>JUGE POPULUS</b> — doctrine : miroir/neutralité, nul sauf accident chaotique. '
          + s.nbChargees + '/3 axes chargés (Mars ou négatif) — ' + detail
          + '. Sens de lecture NON établi (3 cas connus, résultat contraire à l\'attendu) — informatif seulement.</div>';
      })())
    // DENSITÉ DE L'INCIDENT (04/09/26) — cf. densiteIncidentV7 : combien
    // de mécanismes d'incident se déclenchent, et sont-ils d'accord sur
    // le camp ? Le incidentPct affiché plus haut ne vient que du
    // détecteur de signaux seul. Aucun poids sur le verdict.
    +((function(){
        var d; try { d = densiteIncidentV7(theme); } catch(e){ d = null; }
        if (!d || !d.nbDeclenches) return '';
        var campNom = d.campMajoritaire === 'M1' ? teamA : (d.campMajoritaire === 'M7' ? teamB : null);
        return '<div style="margin:6px 8px 2px; padding:5px 8px; border:1px solid #38bdf8; border-radius:7px; '
          + 'background:rgba(56,189,248,.10); font-size:11px; color:#bae6fd; text-align:left;">'
          + '📊 <b>DENSITÉ DE L\'INCIDENT</b> — ' + d.nbDeclenches + '/' + d.surFactuels + ' mécanismes se déclenchent'
          + (d.nbCamps ? ' · ' + d.nbCamps + ' nomment un camp, ' + d.accordPct + '% d\'accord sur '
              + (campNom || d.campMajoritaire) : ' · aucun ne nomme de camp')
          + '. Purement informatif, aucun poids sur le verdict.</div>';
      })())
    +'</div>';
  // ─── LA BANNIÈRE DU GEL (30/08/26) ───
  // Elle est ici, sous le vainqueur, parce que c'est le seul endroit qu'on
  // regarde à coup sûr. Voir etatGelV7.
  (function () {
    var g = null;
    try { g = etatGelV7(theme, teamA, teamB); } catch (e) { g = null; }
    if (!g) return;
    if (g.gelee) {
      var aScore = !!(g.entry && g.entry.realScore);
      html += '<div style="margin:8px 0 0; padding:8px 11px; border-radius:9px; border:1px solid '
        + (aScore ? '#4ade80' : '#fbbf24') + '; background:rgba(15,23,42,.55); font-size:11px; color:#cbd5e1;">'
        + (aScore
          ? '<b style="color:#4ade80;">✔ Prédiction gelée et notée.</b> Elle compte dans le journal.'
          : '<b style="color:#fbbf24;">⏳ Prédiction gelée, score non saisi.</b> Elle ne comptera dans le '
            + 'journal que quand tu auras entré le score réel — panneau <b>💾 Thèmes sauvegardés</b>.')
        + '</div>';
    } else {
      html += '<div style="margin:8px 0 0; padding:9px 11px; border-radius:9px; border:2px solid #60a5fa; '
        + 'background:rgba(37,99,235,.12); font-size:11.5px; color:#dbeafe; line-height:1.55;">'
        + '<b style="color:#93c5fd;">🧊 CETTE PRÉDICTION N\'EST PAS GELÉE.</b> Tant qu\'elle ne l\'est pas, '
        + 'elle ne prouvera rien : tous les chiffres de ce fichier sont rejoués sur une archive dont les '
        + 'règles ont été taillées. Un verdict gelé <b>avant</b> le match, comparé au score saisi <b>après</b>, '
        + 'est la seule mesure que rien ne peut flatter.'
        + '<div style="margin-top:7px;"><button onclick="saveManuel()" style="padding:7px 14px; border-radius:8px; '
        + 'border:1px solid #60a5fa; background:#1d4ed8; color:#fff; font-weight:800; font-size:12px; cursor:pointer;">'
        + '🧊 Geler cette prédiction</button></div></div>';
    }
    if (g.enAttente > 0) {
      html += '<div style="margin:6px 0 0; padding:7px 10px; border-radius:8px; border:1px solid #fbbf24; '
        + 'background:rgba(251,191,36,.10); font-size:10.5px; color:#fde68a;">'
        + '<b>' + g.enAttente + ' prédiction' + (g.enAttente > 1 ? 's' : '') + ' gelée'
        + (g.enAttente > 1 ? 's' : '') + ' attend' + (g.enAttente > 1 ? 'ent' : '')
        + ' encore son score.</b> Chacune est une ligne de journal perdue tant qu\'elle reste vide.</div>';
    }
  })();
  var incColorTek = card && card.incidentInevitable ? '#f87171' : card && card.incidentPct >= 50 ? '#fb923c' : card && card.incidentPct > 0 ? '#facc15' : null;
  // ─── LE DÉTAIL DE L'INCIDENT, AVEC SON CAMP (27/08/26) ───
  // ─── LA SOMME DES AXES, AU-DESSUS DES SIGNAUX (29/08/26) ───
  // Elle fait 5/5 quand les signaux du thème principal font 1/5 : elle
  // s'affiche donc AVANT eux, et elle les contredit ouvertement quand
  // c'est le cas. Voir sommesAxesIncidentV7 pour la mesure complète.
  var sommesHtml = '';
  (function () {
    var sa = null;
    try { sa = sommesAxesIncidentV7(theme); } catch (e) { sa = null; }
    if (!sa) return;
    var col = sa.signal ? '#f87171' : '#4ade80';
    var lignes = sa.detail.map(function (x) {
      return '<div style="display:flex; justify-content:space-between; gap:8px; font-size:11px; padding:2px 0;">'
        + '<span>' + esc(x.axe) + '</span><b style="color:' + (x.incident ? '#f87171' : '#94a3b8') + ';">'
        + esc(label(x.somme)) + (x.incident ? ' ★' : '') + '</b></div>';
    }).join('');
    var ditPrincipal = !!(card && card.penaltyRouge);
    var accord = (ditPrincipal === sa.signal);
    sommesHtml = '<div style="margin:10px 0 0; padding:8px 10px; border-radius:9px; '
      + 'background:rgba(15,23,42,.6); border:1px solid ' + col + ';">'
      + '<div style="font-size:11.5px; font-weight:800; color:' + col + ';">'
      + '➕ Somme des quatre mères de chaque axe — '
      + (sa.signal ? sa.nb + ' AXE(S) SUR 3 DONNENT UNE FIGURE D\'INCIDENT' : 'aucune figure d\'incident')
      + '</div>' + lignes
      + '<div style="font-size:10px; color:#94a3b8; margin-top:4px;">'
      + 'Rubeus, Carcer et Tristitia sont les figures d\'incident. Cette lecture fait <b>5 justes sur 5</b> '
      + 'dans l\'archive, contre 1 sur 5 pour les signaux du thème principal, et elle ne se déclenche que sur '
      + '46 % des thèmes (vérifié sur les 65 536). '
      + (accord ? 'Ici elle est <b>d\'accord</b> avec le thème principal.'
               : '<b style="color:#fbbf24;">Ici elle CONTREDIT le thème principal — c\'est elle qu\'il faut croire.</b>')
      + ' n = 5, elle peut encore tomber.</div></div>';
  })();
  var incHtml = sommesHtml;
  if (card && card.penaltyRouge && card.incidentSignaux && card.incidentSignaux.length) {
    incHtml += '<div style="margin:10px 0 0; padding:8px 10px; border-radius:9px; '
      + 'background:rgba(127,29,29,.14); border:1px solid #b91c1c;">'
      + '<div style="font-size:11.5px; font-weight:800; color:#fca5a5;">⚠ Incident — '
      + esc(card.incidentCampResume || '') + '</div>'
      + card.incidentSignaux.map(function (sg) {
          return '<div style="font-size:9.5px; margin-top:2px; color:'
            + (sg.camp ? (sg.camp === 'M1' ? '#7dd3fc' : '#fdba74') : '#94a3b8') + ';">'
            + (sg.camp ? '[' + sg.camp + '] ' : '[—] ') + esc(sg.label) + '</div>';
        }).join('')
      + '<div class="hint" style="font-size:8.5px; margin-top:4px;">'
      + '[M1] / [M7] = signal qui désigne un camp. [—] = signal sans camp : il dit '
      + 'qu\'il y a incident, pas contre qui. La règle M6/M12 ne vote pas — ces deux '
      + 'maisons sont toutes deux du camp 2, elle ne pourrait accuser que lui.</div>'
      + '</div>';
  }
  html+='<div class="tek-stats"><div class="tek-stat"><span>🟥 Penalty / Rouge</span><b'+(incColorTek?' style="color:'+incColorTek+'"':'')+'>'+esc(penalty)+'</b></div><div class="tek-stat"><span>🟨 Cartons jaunes (estimé)</span><b>'+esc(yellow)+'</b></div><div class="tek-stat"><span>🎯 Puissance de marquage</span><b>'+esc(markLabel)+' ('+esc(markA)+' vs '+esc(markB)+')</b></div><div class="tek-stat"><span>⚽ Les deux marquent (BTTS)</span><b>'+bt+'</b></div><div class="tek-stat"><span>🚩 Corners</span><b>'+esc(corners.ht1)+' (1MT) + '+esc(corners.ht2)+' (2MT) = '+esc(corners.total)
    +(corners.campA!=null?' &nbsp;·&nbsp; <span style="color:#7dd3fc;">'+esc(teamA)+' '+esc(corners.campA)+'</span> / <span style="color:#fdba74;">'+esc(teamB)+' '+esc(corners.campB)+'</span>':'')
    +(card&&card.cornersDominant?' &nbsp;→&nbsp; <span style="color:#4ade80;">dominant '+esc(card.cornersDominant==='R1'?teamA:teamB)+'</span>':'')
    +'</b></div><div class="tek-note">'+(nulActif?'⚠️ '+(nulPorteTxt||'Le nul est imposé')+' — le protocole est suspendu.':'✓ Match sous lecture du protocole R1/R7 — aucune porte du nul n’est ouverte.')+'</div>'+incHtml+'</div></div>';
  // ─── LE NUL PASSE AVANT LES MOTEURS (29/08/26) ───
  // Ellemine_D : « le verdict : les moteurs sont après celui qui décide
  // pour le nul ». Ces deux panneaux étaient en fin de page, après les
  // tables de forces, la crédibilité et les duels. Ils sont désormais
  // juste sous le vainqueur, AVANT le protocole de comparaison : c'est le
  // nul qui décide s'il y a un vainqueur à lire, il se lit donc en premier.
  // ─── LE FAISCEAU DU NUL (29/08/26) — les sept lectures croisées ───
  // Affiché sur chaque thème, parce que c'est le NOMBRE de signaux qui
  // parle, jamais une ligne prise seule.
  (function(){
    var f=null; try{ f=faisceauNulV7(theme); }catch(e){ f=null; }
    if(!f) return;
    var teinte = f.n>=5 ? '#ef4444' : (f.n>=4 ? '#f59e0b' : (f.n>=2 ? '#38bdf8' : '#64748b'));
    var dp=null; try{ dp=nulDeuxPortesV7(theme); }catch(e){ dp=null; }
    if(dp){
      var dpOuverte = nulParPorteV7(theme);
      var tp2 = dpOuverte ? (dp.force==='ÉTABLIE' ? '#22c55e' : '#84cc16') : '#64748b';
      var niv=null; try{ niv=niveauNulV7(theme); }catch(e){ niv=null; }
      var nivCol = niv ? (niv.niveau==='MAXIMAL' ? '#ef4444' : (niv.niveau==='fort' ? '#f59e0b'
        : (niv.niveau==='faible' ? '#64748b' : '#475569'))) : '#64748b';
      html+='<div class="tek-section"><div class="tek-title">🚪 LES DEUX PORTES DU NUL — branche « '+esc(dp.porte)+' »</div>'
        +'<div style="padding:6px 2px; font-size:12px;"><b style="color:'+tp2+';">'
        +(dpOuverte?'PORTE OUVERTE — '+esc(dp.force):'porte fermée')+'</b> · décalage R1→R7 = +'+dp.k
        +'<div style="font-size:10px; color:#94a3b8; margin-top:3px;">'+esc(dp.detail)+'</div></div>'
        +(niv ? '<div style="padding:6px 8px; margin:4px 0; border-left:3px solid '+nivCol+'; background:rgba(148,163,184,.08);">'
            +'<b style="color:'+nivCol+'; font-size:12px;">NIVEAU DE NUL : '+esc(niv.niveau)+'</b>'
            +' <span style="font-size:11px; color:#cbd5e1;">— '+niv.taux+' % des cas de cette catégorie ont fini nuls ('
            +niv.sur+' cas d\'archive)</span>'
            +'<div style="font-size:10px; color:#94a3b8; margin-top:2px;">'+esc(niv.detail)+'</div>'
            +'<div style="font-size:10px; color:#94a3b8; margin-top:3px;">Le siège et la porte sont deux signaux '
            +'INDÉPENDANTS : vérifié sur les 65 536 thèmes, la porte s\'ouvre dans 18,8 % des thèmes quand R1 est '
            +'cadent contre 18,4 % en moyenne — la maison ne change pas la chance que la porte s\'ouvre. '
            +'C\'est pour ça que les croiser paie : <b>porte + cadent 4/5</b>, porte seule 4/6, '
            +'cadent seul 1/8, ni l\'un ni l\'autre 0/23. '
            +'<b style="color:#f87171;">⚠️ 30/08 au soir : le croisement a perdu sa perfection.</b> Il était '
            +'à 4 sur 4 — le seul record parfait du fichier. Le thème FortMajLaet2 avait la porte ouverte à '
            +'+2 ET R1 en cadente, et le match a fini 3-1. Les trois faux positifs de la porte sont '
            +'PuerCaput, TristPop et celui-là.</div></div>' : '')
        +'<div style="font-size:10px; color:#94a3b8;">Le nul ne se lit pas pareil selon la boucle. '
        +'<b>Même boucle — porte ÉTABLIE</b> : R7 occupe l\'un des DEUX PREMIERS rôles que R1 projette '
        +'devant lui, binôme (+2) ou front (+4). Plus loin devant (+8, +10) ou dans le sens inverse '
        +'(+12, +14) : aucun nul sur 9 cas. Les 6 nuls de cette branche sont tous dans la cible. '
        +'<b>Boucles opposées — porte EN PROBATION</b> : +11, le front du front de la victime de R1. '
        +'2 tirs, 2 nuls, aucun faux positif — mais deux nuls qui partagent un décalage parmi huit, '
        +'c\'est 15,4 % au hasard. Ce n\'est pas une preuve, c\'est une hypothèse qu\'on fait tourner. '
        +'<b style="color:#fbbf24;">⚠️ 30/08 : cette branche a laissé passer son premier nul</b> — '
        +'FortMajTrist, décalage +9. Élargir à {+9, +11} le rattraperait au prix de 3 faux positifs '
        +'(+9 fait 1 nul sur 4) : ça ne vaut pas le coup, et la porte reste à +11. '
        +'La table des pôles ne sait faire que la première : son code ne peut littéralement pas annoncer un nul '
        +'en boucles opposées, et c\'est là que sont les deux nuls qu\'aucun moteur n\'attrapait. '
        +'Les deux portes ensemble : <b>8 nuls sur 9, trois faux positifs, 36 cas justes sur 42</b> — '
        +'contre 33/42 pour le témoin « il n\'y a jamais de nul », qui n\'attrape évidemment aucun nul.</div></div>';
    }
    html+='<div class="tek-section"><div class="tek-title">🔆 FAISCEAU DU NUL — '+f.n+' signaux sur '+f.sur+'</div>';
    html+='<div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap; padding:6px 2px;">';
    html+='<div style="font-size:26px; font-weight:800; color:'+teinte+';">'+f.n+'/'+f.sur+'</div>';
    html+='<div><b style="color:'+teinte+';">'+f.niveau.toUpperCase()+'</b>'
      +'<div style="font-size:10px; color:#94a3b8;">'
      +(f.casNiveau ? 'à ce niveau exact, <b>'+f.nulsNiveau+' cas sur '+f.casNiveau+'</b> ('+f.precision
          +' %) ont fini sur un nul' : 'aucun cas d\'archive n\'est à ce niveau exact')
      +(f.casCumul ? ' · à ce niveau <b>ou au-dessus</b>, '+f.nulsCumul+'/'+f.casCumul
          +' ('+f.precisionCumul+' %)' : '')
      +' — contre '+f.base+' % sur l\'ensemble de l\'archive ('+f.baseNuls+'/'+f.baseCas+')'
      +'</div></div></div>';
    html+='<table class="tek-table"><tr><th>signal</th><th>état</th><th>lecture</th></tr>'
      + f.signaux.map(function(x){
          return '<tr><td>'+esc(x.nom)+'</td><td style="color:'+(x.on?'#4ade80':'#475569')+'; font-weight:700;">'
            +(x.on?'✓ allumé':'—')+'</td><td>'+esc(x.detail)+'</td></tr>';
        }).join('') + '</table>';
    var _ech = Object.keys(f.echelle || {}).sort(function(a,b){ return a-b; }).map(function(k){
      return k+' → '+f.echelle[k].nul+'/'+f.echelle[k].n;
    }).join(' · ');
    html+='<div style="font-size:10px; color:#94a3b8; margin-top:5px;">Les sept lectures ne valent rien prises '
      +'une par une — le témoin « il n\'y a jamais de nul » les bat toutes en justesse brute, et ne sert à rien. '
      +'L\'échelle complète, <b>recalculée sur l\'archive à chaque ouverture</b> (signaux → nuls/cas) : '
      +_ech+'. Elle n\'est plus écrite à la main : elle l\'était, et elle avait vieilli de travers. '
      +'Les paliers hauts reposent sur deux ou trois cas — lis les fractions, pas les pourcentages. '
      +'<b style="color:#fbbf24;">Attention</b> : le 0-0 du 14/02/2026 n\'allume AUCUN signal. Le faisceau attrape '
      +'3 nuls sur 4 — il sert à oser quand il parle, pas à se rassurer quand il se tait.</div></div>';
  })();
  // ─── LA STRUCTURE DU THÈME (05/09/26) — panneau des faits exacts ───
  // Trois choses que le fichier savait calculer sans jamais les montrer :
  // le rang des mères, le compte de Populus, et le rang défensif de M4
  // et M10. Rien ici n'entre dans le verdict : ce sont des faits exacts
  // (énumération des 65536) et une piste pré-enregistrée, affichés pour
  // qu'on puisse les contredire.
  (function(){
    var lp=null, ld=null;
    try{ lp=lecturePopulusV7(theme); }catch(e){ lp=null; }
    try{ ld=lectureDefensiveV7(theme); }catch(e){ ld=null; }
    if(!lp && !ld) return;
    html+='<div class="tek-section"><div class="tek-title">🧱 STRUCTURE DU THÈME</div>';
    // Le volume de buts est BRANCHÉ depuis le 05/09 : il s'affiche donc
    // en tête du panneau, et en disant d'où il vient.
    (function(){
      var pv=null; try{ pv=(avecFormatV7('reel',function(){return getVerdictAfficheReel(theme);})||{}).plus25; }catch(e){ pv=null; }
      if(!pv) return;
      var col = pv.autoRetrait ? '#f87171' : (pv.contreditLeMoteur ? '#fbbf24' : '#38bdf8');
      html+='<div style="padding:8px 10px; margin:2px 0 8px; border-left:4px solid '+col+'; background:rgba(56,189,248,.10);">'
        +'<b style="color:'+col+'; font-size:13px;">VOLUME DE BUTS : '+esc(pv.annonce.toUpperCase())+'</b>'
        +' <span style="font-size:11px; color:#94a3b8;">— branché au verdict, source : <b>'+esc(pv.source)+'</b></span>'
        +(pv.autoRetrait
          ? '<div style="font-size:11px; color:#f87171; margin-top:3px;">🛑 <b>LA RÈGLE ZÉRO POPULUS '
            +'S\'EST RETIRÉE TOUTE SEULE</b> — ' + esc(pv.autoRetrait)
            +' Le verdict revient au moteur. Rien à faire : c\'est le garde-fou qui a joué.</div>'
          : '')
        +(!pv.autoRetrait && pv.contreditLeMoteur
          ? '<div style="font-size:11px; color:#fbbf24; margin-top:3px;">⚠️ La règle CONTREDIT le moteur, '
            +'qui annonçait « '+esc(pv.moteurDisait)+' ». Sur l\'archive c\'est la règle qui gagne ce '
            +'duel 10 fois contre 2.</div>'
          : '')
        +(function(){
          // Les chiffres se REJOUENT sur tes cas, pas sur les 56 du dépôt.
          var m=null; try{ m=mesurePopulusLiveV7(); }catch(e){ m=null; }
          var p2=null; try{ p2=porteeDesMesuresV7(); }catch(e){ p2=null; }
          if(!m) return 'Mesuré sur les 48 cas au score connu du dépôt : moteur seul '
            +'<b>26/48</b>, règle idiote <b>31/48</b>, moteur + zéro Populus <b>34/48</b>.';
          return 'Rejoué à l\'instant sur <b>'+m.n+' cas au score connu</b>'
            +(p2&&p2.dontSaisisParToi?' (dont '+p2.dontSaisisParToi+' saisis par toi)':'')
            +' : moteur seul <b>'+m.moteurSeul+'/'+m.n+'</b>, règle idiote « toujours plus de '
            +'2,5 » <b>'+m.regleIdiote+'/'+m.n+'</b>, moteur + zéro Populus <b>'
            +m.moteurPlusRegle+'/'+m.n+'</b> — gain <b>'+(m.gain>=0?'+':'')+m.gain+'</b>.'
            +'<br>zéro Populus : '+m.zero.plus+'/'+m.zero.n+' au-dessus de 2,5 ('+m.zero.taux+' %) '
            +'contre '+m.autre.plus+'/'+m.autre.n+' ('+m.autre.taux+' %) pour les autres.'
            +'<br><span style="color:#fbbf24;">Les chiffres gelés du 05/09 (26/48, 31/48, 34/48) '
            +'ne portaient que sur les 56 cas du dépôt — tes thèmes sauvegardés n\'y étaient pas.</span>';
        })()
        +' Réversible par BRANCHES_V7.populus_volume.actif.</div></div>';
    })();
    // Le protocole de comparaison, et pourquoi il ne pilote pas.
    (function(){
      var pr=null; try{ pr=(avecFormatV7('reel',function(){return getVerdictAfficheReel(theme);})||{}).protocole; }catch(e){ pr=null; }
      if(!pr) return;
      if(!pr.applicable){
        // Muet — mais c'est justement le domaine où la version serrée
        // montre quelque chose. On l'affiche à la place.
        var ps=null; try{ ps=protocoleSerreV7(theme); }catch(e){ ps=null; }
        html+='<div style="font-size:11px; color:#64748b; margin:0 0 8px;">'
          +'⚖️ <b>Protocole de comparaison : muet sur ce thème</b> — '+esc(pr.raison)
          +' Il ne parle que sur la moitié des thèmes (32 768 sur 65 536, mesuré).'
          +(ps && ps.domainePorteur
            ? '<div style="margin-top:5px; padding:5px 8px; border-left:3px solid #a78bfa; background:rgba(167,139,250,.10); color:#cbd5e1;">'
              +'🔎 <b style="color:#a78bfa;">Version serrée — R1 contre R7 seules : '+esc(ps.dit)+'</b>'
              +' ('+label(ps.figR1)+' '+ps.scoreR1.toFixed(2)+' contre '+label(ps.figR7)+' '+ps.scoreR7.toFixed(2)
              +', écart '+(ps.ecart>=0?'+':'')+ps.ecart.toFixed(2)+')'
              +'<div style="font-size:10px; color:#94a3b8; margin-top:3px;">C\'est ICI que l\'élagage '
              +'montre quelque chose : sur les thèmes à même boucle, où le protocole large renonce, '
              +'la comparaison des deux seules figures tombe juste 14 fois sur 19 (74 %) dans '
              +'l\'archive. Six tests menés, meilleur p = 0,064 — <b>rien n\'est démontré</b>, et '
              +'branchée comme override elle ne gagnerait qu\'un point sur 56. NON BRANCHÉE. '
              +'Seuil pour trancher : 25 rencontres à même boucle annoncées à l\'avance.</div></div>'
            : '')
          +'</div>';
        return;
      }
      var dit=pr.dit, pil=pr.pilote;
      html+='<div style="padding:7px 10px; margin:0 0 8px; border-left:4px solid '+(pil?'#f87171':'#64748b')+'; background:rgba(100,116,139,.10);">'
        +'⚖️ <b style="font-size:12px;">Protocole de comparaison : '+esc(dit)+'</b>'
        +' <span style="font-size:11px; color:#94a3b8;">— R1 '+pr.scoreR1.toFixed(2)
        +' contre R7 '+pr.scoreR7.toFixed(2)+', écart '+(pr.ecart>=0?'+':'')+pr.ecart.toFixed(2)+'</span>'
        +'<div style="font-size:10px; color:'+(pil?'#f87171':'#94a3b8')+'; margin-top:4px;">'
        +(pil
          ? '<b>IL PILOTE LE VERDICT</b> (BRANCHES_V7.protocole_pilote.actif = true). '
            +'Mesuré : le camp tombe de 38/56 à 29/56.'
          : '<b>Il ne pilote PAS le verdict</b>, et c\'est mesuré, pas prudent : sur les 29 cas '
            +'d\'archive où il parle, il tombe juste 12 fois (41 %) quand le verdict en réussit '
            +'23 (79 %) ; sur leurs 18 désaccords, protocole 3, verdict 14. L\'hypothèse d\'un '
            +'signe inversé a été testée et rejetée (12/25 tel quel, 13/25 inversé, p = 1,0000). '
            +'Pour l\'activer quand même : BRANCHES_V7.protocole_pilote.actif = true.')
        +'</div></div>';
    })();
    // Le miroir M5 — exact, et il touche directement la doctrine des camps.
    (function(){
      var mi=null; try{ mi=miroirM5V7(theme); }catch(e){ mi=null; }
      if(!mi) return;
      html+='<div style="padding:7px 10px; margin:0 0 8px; border-left:4px solid #a78bfa; background:rgba(167,139,250,.10);">'
        +'🪞 <b style="font-size:12px;">Le partage qui commence en M5 — le thème vu du camp adverse</b>'
        +'<div style="font-size:11px; color:#cbd5e1; margin-top:3px;">'
        +'En reconstruisant tout le bouclier sur M5-M8 : les mères et les filles '
        +'s\'échangent, les neveux aussi (M9↔M11, M10↔M12), les témoins aussi (M13↔M14). '
        +'<b>Sept des huit maisons du camp 1 deviennent des maisons du camp 2.</b></div>'
        +'<div style="font-size:11px; margin-top:4px; color:'+(mi.jugeIdentique?'#4ade80':'#f87171')+';">'
        +'⚖️ Le Juge M15 ('+label(theme[15])+') est '+(mi.jugeIdentique?'INCHANGÉ':'CHANGÉ — anomalie')
        +' — c\'est la seule maison que les deux camps lisent à l\'identique. '
        +'Vérifié 65 536 fois sur 65 536.</div>'
        +'<div style="font-size:10px; color:#94a3b8; margin-top:4px;">'
        +'La Réconciliation M16 est la seule cassure : elle vaut M15⊕M1 à l\'endroit et '
        +'M15⊕M5 à l\'envers, donc elle ne revient que si M1 = M5 — un thème sur huit. '
        +'Ici '+(mi.m16Revient?'elle revient':'elle ne revient pas')+'.</div>'
        // ── POURQUOI CE MIROIR N'EST PAS BRANCHÉ AU VERDICT (05/09) ──
        // Demande d'Ellemine_D. Le branchement naturel — « lire depuis
        // l'autre bord doit donner le même match, camps échangés » — a
        // été mesuré, et l'attente est FAUSSE. Ce n'est pas une question
        // de preuve : le miroir n'est pas une symétrie du verdict.
        +(function(){
          var act=false;
          try{ act=!!(BRANCHES_V7.miroir_m5 && BRANCHES_V7.miroir_m5.actif); }catch(e){}
          var vm=null;
          if(act){ try{ vm=avecFormatV7('reel',function(){return getVerdictAfficheReel(mi.theme);}); }catch(e){} }
          return '<div style="font-size:10px; color:#94a3b8; margin-top:5px; border-top:1px solid rgba(148,163,184,.2); padding-top:5px;">'
            +'<b style="color:#fbbf24;">Pourquoi ce miroir n\'entre PAS dans le verdict.</b> '
            +'Le contrôle qui semblait s\'imposer — les deux lectures doivent donner le même '
            +'match, camps échangés — a été mesuré et l\'attente est fausse : camps inversés '
            +'seulement <b>4,4 %</b> du temps, identiques <b>56,7 %</b>, sommes des camps '
            +'échangées <b>0,8 %</b>, rotation suivant le miroir <b>8,6 %</b>. '
            +'La cause est écrite plus haut : le miroir échange sept maisons sur huit par camp, '
            +'et la huitième — M15 fixe, M16 cassée — suffit à rompre l\'échange. Le verdict, '
            +'lui, ne tourne pas sur les camps mais sur la ROTATION, qui ne suit pas le miroir. '
            +'<b>La loi reste exacte ; c\'est l\'usage qui était faux.</b> '
            +'miroirM5V7 sert à TRANSPOSER une règle du camp 1 vers le camp 7 sans la '
            +'réécrire — un outil de construction, pas une entrée du verdict.'
            +(act && vm
              ? '<div style="color:#a78bfa; margin-top:4px;">Seconde lecture affichée '
                +'(BRANCHES_V7.miroir_m5.actif = true) : le thème miroir donne <b>'
                +(vm.nulActif?'nul':(vm.winner==='M1'?'R1':'R7'))+' '+esc(vm.scoreMain)
                +'</b>. À lire comme un autre point de vue, PAS comme une confirmation ni '
                +'une contradiction — les deux ne sont pas censés s\'accorder.</div>'
              : '<div style="margin-top:3px;">Pour afficher quand même la seconde lecture : '
                +'BRANCHES_V7.miroir_m5.actif = true.</div>')
            +'</div>';
        })()
        +'<div style="display:none;">'
        +'<b>Et l\'encadrement d\'Ellemine_D est exact</b> : M4 et M10 sont les SEULES '
        +'maisons dont les deux voisines sont dans l\'axe offensif {3,5,9,11}, et ce sont '
        +'les deux maisons défensives. Les deux seules lois d\'opposition du carré, '
        +'M4⊕M10=M3 et M5⊕M11=M6, sont portées par les maisons VOISINES M4 et M5 et '
        +'produisent M3 et M6, qui encadrent la paire.</div></div>';
    })();
    // La défense par les propriétés — mesuré sur les VRAIS scores.
    (function(){
      var dt=null; try{ dt=defenseTenueV7(theme); }catch(e){ dt=null; }
      if(!dt) return;
      var col = dt.indice>=5?'#4ade80':(dt.indice>=4?'#84cc16':(dt.indice>=2?'#fbbf24':'#f87171'));
      var live=null; try{ live=defenseTenueLiveV7(); }catch(e){}
      html+='<div style="padding:7px 10px; margin:0 0 8px; border-left:4px solid '+col+'; background:rgba(148,163,184,.08);">'
        +'🛡️ <b style="font-size:12px;">Défense tenue : '+dt.indice+' / 6</b>'
        +' <span style="font-size:11px; color:'+col+';">'+esc(dt.lecture)+'</span>'
        +'<div style="font-size:11px; color:#cbd5e1; margin-top:3px;">'
        + dt.detail.map(function(d){
            return d.maison+' '+label(d.figure)+' — '
              +(d.fermee?'<span style="color:#4ade80;">fermée</span>':'<span style="color:#f87171;">ouverte</span>')
              +' · '+(d.passive?'<span style="color:#4ade80;">passive</span>':'<span style="color:#f87171;">active</span>')
              +' · '+(d.fixe?'fixe':'mobile')+' → '+d.tenu+'/3';
          }).join('<br>')
        +'</div>'
        +'<div style="font-size:10px; color:#94a3b8; margin-top:4px;">'
        +'Mesuré sur les VRAIS SCORES, pas sur les verdicts du moteur — la vérification '
        +'importait, le moteur BTTS utilisant déjà ouverture et mobilité sur M4/M10. '
        +'rho = −0,336 contre les buts (p = 0,0101 sur 48 cas, 0,040 après Bonferroni). '
        +'<b>Ce ne sont PAS les figures fixes qui défendent</b> : la fermeture porte '
        +'(p = 0,027), la passivité porte (p = 0,029), la fixité ne porte rien (p = 0,296). '
        +'Et il faut les DEUX maisons — ni M4 ni M10 n\'y arrive seule.'
        +(live?' <b>Rejoué sur ta base ('+live.n+' cas) : rho = '+live.rho.toFixed(3)+'.</b>':'')
        +' L\'indice symétrique en attaque (M5/M11) ne donne rien. NON BRANCHÉ.</div></div>';
    })();
    // La loi des boucles M1/M4 — le plus gros effet du moteur.
    (function(){
      var lb=null; try{ lb=lectureBouclesV7(theme); }catch(e){ lb=null; }
      if(!lb) return;
      var col = lb.ecartBase>=8 ? '#4ade80' : (lb.ecartBase<=-8 ? '#f87171' : '#94a3b8');
      html+='<div style="padding:7px 10px; margin:0 0 8px; border-left:4px solid '+col+'; background:rgba(148,163,184,.08);">'
        +'🔁 <b style="font-size:12px;">Boucles : M1 en '+lb.boucleM1+', M4 en '+lb.boucleM4+' — '
        +(lb.accordM1M4?'ACCORD':'désaccord')+'</b>'
        +' <span style="font-size:11px; color:'+col+';">R1 '+lb.tauxR1Moteur.toFixed(1)+' % sur cette strate '
        +'('+(lb.ecartBase>=0?'+':'')+lb.ecartBase.toFixed(1)+' contre 27,9 % de base)</span>'
        +(lb.maximale?'<div style="font-size:11px; color:#4ade80; margin-top:3px;">★ STRATE MAXIMALE — '
          +'Laetitia en M2, M1 en boucle A, M4 en boucle A. Le meilleur R1 du moteur.</div>':'')
        +'<div style="font-size:10px; color:#94a3b8; margin-top:4px;">'
        +esc(lb.strate)+'. La loi de fond : M1 et M4 dans la même boucle donnent R1 36,7 %, '
        +'opposées 19,0 % — 17,7 points, le plus gros effet structurel du moteur, et c\'est une '
        +'INTERACTION PURE (la boucle de M4 seule ne vaut rien, 27,7 contre 28,0). '
        +'<b>Laetitia en M2 brise la symétrie</b> : avec M1 en boucle A la loi passe à 30,8 points '
        +'d\'écart, avec M1 en boucle B elle s\'effondre à −2,6. '
        +'Taux EXACTS du moteur sur les 65 536 thèmes — pas une mesure sur des matchs joués.</div></div>';
    })();
    // La soudure des chefs — exacte, sans statistique.
    (function(){
      var sd=null; try{ sd=soudureChefsV7(theme); }catch(e){ sd=null; }
      if(!sd) return;
      var a=sd.m1m7;
      html+='<div style="padding:7px 10px; margin:0 0 8px; border-left:4px solid #34d399; background:rgba(52,211,153,.10);">'
        +'🔗 <b style="font-size:12px;">Soudure des chefs : M1 et M7 partagent un point</b>'
        +'<div style="font-size:11px; color:#cbd5e1; margin-top:3px;">'
        +'La <b>3e ligne de '+label(a.figMere)+' (M1)</b> EST la <b>1re ligne de '+label(a.figFille)+' (M7)</b> — '
        +'valeur '+a.valeur+(a.valeur===1?' point':' points')+'. '
        +(sd.coherent?'':'<b style="color:#ef4444;"> INCOHÉRENT — le calcul des filles est cassé.</b>')
        +'</div>'
        +'<div style="font-size:10px; color:#94a3b8; margin-top:4px;">'
        +'Exact, sur tout thème : la mère Mi et la fille M(4+j) se touchent au point (i,j) du '
        +'carré — 16 paires, 16 points de contact, aucune exception. C\'est la SEULE façon dont '
        +'une mère et une fille se rencontrent, et ça vaut aussi pour M2/M8 (4e ligne de M2 = '
        +'2e ligne de M8). <b>M1 et M7 ne sont donc pas deux camps indépendants.</b> '
        +'Ni M4/M10 ni M5/M11 n\'ont cette soudure : eux portent une LOI (M4⊕M10=M3, '
        +'M5⊕M11=M6), ce qui est un lien d\'une autre nature. Soudure et loi ne tombent '
        +'jamais sur le même axe.</div></div>';
    })();
    if(lp){
      var attendu = lp.moteurAttendu || {buts:'—',btts:'—'};
      var tz = lp.zeroPopulus ? '#f59e0b' : '#64748b';
      html+='<div style="padding:6px 2px; font-size:12px;">'
        +'<b>Rang des quatre mères : '+lp.rang+' / 4</b>'
        +' <span style="color:#94a3b8;">— indépendance linéaire des mères sur Z2. '
        +'Il BORNE le nombre de Populus du thème : ici '+lp.bornes[0]+' à '+lp.bornes[1]+'.</span>'
        +'<div style="margin-top:4px;">Populus dans le thème : <b>'+lp.nbPopulus+'</b>'
        +(lp.coherent?'':' <b style="color:#ef4444;">HORS BORNES — le calcul du thème est cassé</b>')
        +'</div>'
        +'<div style="margin-top:4px; color:#cbd5e1;">Le moteur, sur les 65 536 thèmes de ce rang : '
        +'<b>'+attendu.buts+'</b> but(s) · BTTS <b>'+attendu.btts+' %</b> '
        +'<span style="color:#94a3b8;">(base tous rangs : 1,29 et 27,2 %)</span></div>'
        +'</div>';
      html+='<div style="padding:6px 8px; margin:6px 0; border-left:3px solid '+tz+'; background:rgba(148,163,184,.08);">'
        +'<b style="color:'+tz+'; font-size:12px;">PISTE PRÉ-ENREGISTRÉE — '
        +(lp.zeroPopulus?'CE THÈME EST DANS LE GROUPE « ZÉRO POPULUS »':'ce thème contient du Populus, la règle le classe « peu de buts »')
        +'</b>'
        +'<div style="font-size:11px; color:#cbd5e1; margin-top:3px;">Sur l\'archive, à rang fixé : '
        +'<b>zéro Populus = 5,57 buts</b>, au moins un = 3,00. Écart +2,57, p = 0,0027 en permutation '
        +'à l\'intérieur de chaque strate de rang. Survit au retrait des cinq plus gros scores '
        +'(p = 0,0414) et les médianes disent pareil.</div>'
        +'<div style="font-size:10px; color:#94a3b8; margin-top:4px;">'
        +'<b>Ce n\'est PAS le moteur qui parle.</b> Lui annonce +0,18 but à rang 3 et −0,05 à rang 4, '
        +'quand l\'archive donne +2,22 et +4,67. Si la règle tient, c\'est une loi qui manque au fichier. '
        +'<b style="color:#f87171;">Ce qui cloche :</b> le découpage « zéro contre au moins un » a été '
        +'choisi APRÈS avoir vu les données. Seules 30 rencontres annoncées avant coup d\'envoi, '
        +'10 de chaque côté, le trancheront. <b style="color:#38bdf8;">Depuis le 05/09 cette règle EST '
        +'branchée au verdict</b> sur la famille plus/moins de 2,5 buts — mesurée avant '
        +'(26/48 sans elle, 34/48 avec), réversible par BRANCHES_V7. Sa faiblesse n\'a pas '
        +'disparu en la branchant.</div></div>';
    }
    if(ld && ld.m4 && ld.m10){
      function ligne(l,maison,repos){
        var col = l.rang<=5 ? '#4ade80' : (l.rang>=12 ? '#f87171' : '#cbd5e1');
        return '<tr><td>M'+maison+'</td><td><b>'+label(l.figure)+'</b>'
          +(l.figure===repos?' <span style="color:#fbbf24;">(sa maison de repos)</span>':'')+'</td>'
          +'<td style="color:'+col+';"><b>'+l.rang+'ᵉ / '+l.sur+'</b></td>'
          +'<td>'+l.buts.toFixed(2)+' <span style="color:#94a3b8;">('+(l.ecartButs>=0?'+':'')+l.ecartButs.toFixed(2)+')</span></td>'
          +'<td>'+l.btts.toFixed(1)+' % <span style="color:#94a3b8;">('+(l.ecartBtts>=0?'+':'')+l.ecartBtts.toFixed(1)+')</span></td>'
          +'<td>'+l.incident.toFixed(1)+' %</td></tr>';
      }
      html+='<div style="margin-top:8px;"><b style="font-size:12px;">Rang défensif de M4 et M10</b>'
        +' <span style="font-size:10px; color:#94a3b8;">— ce que LE MOTEUR croit, mesuré par énumération '
        +'des 65 536 thèmes (4096 par ligne). Taux exacts, aucun p n\'aurait de sens. Ce n\'est pas une '
        +'mesure sur des matchs joués.</span>'
        +'<table class="tek-table" style="margin-top:4px;"><tr><th>maison</th><th>figure</th><th>rang défensif</th>'
        +'<th>buts</th><th>BTTS</th><th>incident</th></tr>'
        + ligne(ld.m4,4,'albus') + ligne(ld.m10,10,'carcer') + '</table>'
        +'<div style="font-size:10px; color:#94a3b8; margin-top:3px;">1ᵉʳ = le plus défensif. '
        +'Albus est 1ᵉʳ en M4 et 3ᵉ en M10 : il défend dans les deux maisons. '
        +'<b>Carcer est 15ᵉ sur 16 en M4 et 13ᵉ en M10</b> — le moteur le dit ouvrant, y compris dans sa '
        +'propre maison de repos. Contradiction assumée avec la doctrine de terrain, à trancher.</div>'
        + (ld.m3Force ? '<div style="font-size:11px; color:#fbbf24; margin-top:4px;">'
            +'⚙️ Albus en M4 ET Carcer en M10 : la loi M4 ⊕ M10 = M3 force M3 = '+label(ld.m3Force)+'. '
            +'Les trois maisons de l\'axe défensif ne peuvent JAMAIS être au repos ensemble — une seule '
            +'loi sur 24 le permet, M13 ⊕ M14 = M15.</div>' : '')
        +'</div>';
    }
    // La parité de M15, pour que personne ne remesure contre 1/16.
    try{
      if(typeof pariteFigureV7==='function'){
        html+='<div style="font-size:10px; color:#94a3b8; margin-top:8px; border-top:1px solid rgba(148,163,184,.2); padding-top:6px;">'
          +'<b>M15 est '+label(theme[15])+', et M15 est TOUJOURS paire</b> — 65 536 thèmes sur 65 536, '
          +'sans exception : les filles M5–M8 étant la transposée des mères, les deux moitiés de '
          +'M15 = M1⊕…⊕M8 portent la même parité et s\'annulent. Le Juge ne prend donc que 8 valeurs '
          +'sur 16. Conséquence à ne pas oublier en mesurant : « M15 est X » vaut 1/8 et non 1/16, '
          +'et « M15 est une des quatre symétriques » tombe sur <b>la moitié</b> des thèmes, pas un quart.'
          +'</div>';
      }
    }catch(e){}
    html+='</div>';
  })();
  html+='<div class="tek-section"><div class="tek-title">⚔️ PROTOCOLE DE COMPARAISON R1 / R7</div><div class="tek-camps">';
  // ── UN ZÉRO N'EST PAS UNE MESURE (05/09/26) ──
  // Quand R1 et R7 sont dans la MÊME boucle, ce protocole ne se prononce
  // pas — c'est la moitié des thèmes. Le panneau affichait pourtant
  // « 0.00 / 100 » des deux côtés et concluait « Indécis, aucune avance
  // décisive », ce qui se lit comme un calcul serré alors que c'est une
  // ABSTENTION. Vu sur une capture d'écran d'Ellemine_D.
  var muet = !q.applicable;
  function score(v) {
    return muet ? '<span style="font-size:15px; color:#64748b;">ne se prononce pas</span>'
      : (n(v) + ' / 100');
  }
  html+='<div class="tek-camp"><h4>R1 — '+esc(teamA)+'</h4><div class="tek-meta">Figure : <b>'+label(q.r1)+'</b><br>Position : <b>M'+q.hR1+'</b><br>Boucle : <b>'+esc(q.l1||'—')+'</b></div><div class="tek-bigscore">'+score(s1)+'</div></div>';
  html+='<div class="tek-camp r7"><h4>R7 — '+esc(teamB)+'</h4><div class="tek-meta">Figure : <b>'+label(q.r7)+'</b><br>Position : <b>M'+q.hR7+'</b><br>Boucle : <b>'+esc(q.l7||'—')+'</b></div><div class="tek-bigscore">'+score(s7)+'</div></div></div>';
  if (muet) {
    html+='<div style="margin-top:8px; padding:8px 10px; border-left:4px solid #64748b; '
      +'background:rgba(100,116,139,.12); font-size:11px; color:#cbd5e1;">'
      +'⚖️ <b>Ce protocole NE SE PRONONCE PAS sur ce thème</b> — '+esc(q.reason||'')
      +' Il ne parle que sur la moitié des thèmes (32 768 sur 65 536, mesuré). '
      +'<b>Les zéros affichés auparavant n\'étaient pas des scores</b>, c\'était une '
      +'abstention lue comme une égalité — et « Indécis » plus bas est à lire comme '
      +'« pas d\'avis », pas comme « match serré ». La version serrée du protocole, '
      +'elle, parle : voir le panneau Structure.</div>';
  }
  html+='<div class="tek-progress"><div style="width:'+p1+'%;background:#2563eb">R1 '+p1.toFixed(1)+'%</div><div style="width:'+p7+'%;background:#f59e0b">R7 '+p7.toFixed(1)+'%</div></div>';
  html+='<div class="tek-meta" style="margin-top:7px;text-align:center">R1 : base / résultantes '+(q.a1||[]).length+' maillons · R7 : base / résultantes '+(q.a7||[]).length+' maillons</div></div>';
  html+='<div class="tek-tables">';
  html+='<div class="tek-tablebox"><h5>🔵 DÉTAIL DES FORCES — BOUCLE R1</h5><table class="tek-table"><tr><th>Critère évalué</th><th>Détail</th><th>Points</th></tr><tr><td>Présence des maillons</td><td>'+d1.presence+' présences</td><td>'+n(d1.presence)+'</td></tr><tr><td>Répétitions des figures</td><td>'+d1.repetitions+' répétitions</td><td>'+n(d1.repetitions*.5)+'</td></tr><tr><td>Ancrage au repos</td><td>'+((q.a1||[]).filter(function(x){return x.reposPresent;}).length?'Présence au repos':'Pas d’ancrage au repos')+'</td><td>'+n(d1.repos)+'</td></tr><tr><td>Force du binôme</td><td>'+((q.binomeR1&&label(q.binomeR1))||'—')+'</td><td>'+n(d1.bin)+'</td></tr><tr><td>Résultantes propres</td><td>'+d1.propre/0.75+' résultat(s)</td><td>'+n(d1.propre)+'</td></tr><tr><td>Résultantes adverses</td><td>'+d1.adverse/1.25+' résultat(s)</td><td>-'+n(d1.adverse)+'</td></tr></table><div class="tek-total"><span>TOTAL R1</span><span style="color:#60a5fa">'+n(s1)+'</span></div></div>';
  html+='<div class="tek-tablebox r7"><h5>🟠 DÉTAIL DES FORCES — BOUCLE R7</h5><table class="tek-table"><tr><th>Critère évalué</th><th>Détail</th><th>Points</th></tr><tr><td>Présence des maillons</td><td>'+d7.presence+' présences</td><td>'+n(d7.presence)+'</td></tr><tr><td>Répétitions des figures</td><td>'+d7.repetitions+' répétitions</td><td>'+n(d7.repetitions*.5)+'</td></tr><tr><td>Ancrage au repos</td><td>'+((q.a7||[]).filter(function(x){return x.reposPresent;}).length?'Présence au repos':'Pas d’ancrage au repos')+'</td><td>'+n(d7.repos)+'</td></tr><tr><td>Force du binôme</td><td>'+((q.binomeR7&&label(q.binomeR7))||'—')+'</td><td>'+n(d7.bin)+'</td></tr><tr><td>Résultantes propres</td><td>'+d7.propre/0.75+' résultat(s)</td><td>'+n(d7.propre)+'</td></tr><tr><td>Résultantes adverses</td><td>'+d7.adverse/1.25+' résultat(s)</td><td>-'+n(d7.adverse)+'</td></tr></table><div class="tek-total"><span>TOTAL R7</span><span style="color:#fb923c">'+n(s7)+'</span></div></div></div>';
  html+='<div class="tek-verdict"><div class="tek-verdictgrid"><div class="tek-scale"><div class="symbol">⚖️</div><b>VERDICT DU PROTOCOLE</b><div style="font-size:9px;color:#94a3b8">Comparaison des deux boucles antagonistes</div></div><div><div class="tek-final">'+(nulActif?'⚠️ PROTOCOLE SUSPENDU':'➜ VAINQUEUR FINAL : '+esc(winnerProtoName)+' ('+winnerProto+')')+'</div><div class="tek-gap">'+(winnerProto?'Avance nette de '+n(gap)+' points.':'Aucune avance décisive.')+'</div><div class="tek-meta">'+(winnerProto?'Le modèle indique que la force structurelle et la qualité des maillons de '+esc(winnerProtoName)+' sont supérieures à celles de '+esc(winnerProto==='R1'?teamB:teamA)+'.':'Les deux boucles ne présentent pas de domination suffisamment nette.')+'</div>'+(divergeProto?'<div style="margin-top:7px; padding:8px 10px; border:2px solid #f87171; border-radius:9px; background:rgba(248,113,113,.10); font-size:11px; color:#fecaca; line-height:1.5;"><b>⚠️ LE PROTOCOLE CONTREDIT LA CARTE DU HAUT.</b> Sur ses propres totaux le protocole donne <b>'+esc(winnerProtoName)+' ('+winnerProto+')</b> ; la carte annonce <b>'+esc(winnerName)+' ('+winner+')</b>, parce que c\'est la lecture des sept critères qui la pilote, pas ce tableau. Les deux sont affichés tels quels : sur l\'archive, <b>aucun des deux n\'a de supériorité démontrée</b> (critères 23/36, F4P4 22/36, chaîne complète 22/36, et parier toujours R1 fait 21/36). Quand ils divergent, le camp est à pile ou face — <b>ne le joue pas.</b></div>':'')+(reasonList?'<ul class="tek-list">'+reasonList+'</ul>':'')+'</div></div></div>';
  html+='<div class="tek-section tek-null"><div class="tek-title">⚖️ STRUCTURE DU NUL</div><div class="tek-null-grid">';
  html+='<div class="tek-box"><h5>Juges de structure</h5><div class="tek-kv"><span>1ère partie (M13)</span><b>'+label(sdn.juge1)+'</b></div><div class="tek-kv"><span>2ème partie (M14)</span><b>'+label(sdn.juge2)+'</b></div><div class="tek-kv"><span>Juge final (M15)</span><b>'+label(sdn.reconstruction)+'</b></div><div class="tek-kv"><span>Sentence (M16)</span><b>'+label(sdn.sentence)+'</b></div></div>';
  html+='<div class="tek-box"><h5>Indicateurs de nul</h5><div class="tek-kv"><span>Identité des juges</span><b>'+ (sdn.nulParIdentite?'✓ active':'—') +'</b></div><div class="tek-kv"><span>Opposition / équilibre</span><b>'+ (sdn.nulParOpposition?'✓ active':'—') +'</b></div><div class="tek-kv"><span>Axe succédent</span><b>'+axeTxt+'</b></div><div class="tek-kv"><span>Signature</span><b>'+esc(nullReason)+'</b></div><div class="tek-kv"><span>Règle M15</span><b>'+esc(axeNul&&axeNul.m15Rule?axeNul.m15Rule:'—')+'</b></div></div>';
  html+='<div class="tek-nullstatus"><div class="ico">'+(nulActif?'⚠️':'⊘')+'</div><b>'+nullStatus+'</b><div style="font-size:9px;margin:5px 8px;color:#cbd5e1">'+(nulActif?esc(nulPorteTxt||'Le nul est imposé')+'. Le protocole R1/R7 est suspendu.':'Aucune porte du nul n’est ouverte — le vainqueur du protocole tient.')+'</div></div></div></div>';
  html+='<div class="tek-section"><div class="tek-title">🛡️ CRÉDIBILITÉ GLOBALE DU VERDICT</div><div class="tek-bottom"><div class="box"><div class="big">'+credibility+'%</div></div><div class="box"><p><b>'+(nulActif?'Le nul est actif.':'Le nul n’est pas actif.')+'</b> '+(nulActif?'Le protocole de comparaison ne reçoit pas de priorité décisionnelle.':'Le protocole de comparaison R1 / R7 est pleinement disponible pour désigner le vainqueur.')+'</p></div><div class="box"><p><b>ANALYSE</b><br>'+ (winnerProto?'Thème orienté : domination structurelle de '+esc(winnerProtoName)+' selon le protocole'+(divergeProto?' — <b style="color:#fca5a5;">qui contredit la carte du haut</b>':'')+'.':'Thème équilibré : aucune domination structurelle claire.')+'<br>La crédibilité est un indicateur de disponibilité du protocole, pas une validation empirique.</p></div></div></div>';
  if((q.duel||[]).length){html+='<div class="tek-section"><div class="tek-title">⚔️ DUELS FIGURE ↔ ANTAGONISTE</div><table class="tek-table"><tr><th>R1 / R7</th><th>Score</th><th>Opposant</th><th>Score</th><th>Issue</th></tr>'+duelRows+'</table></div>';}
  html+='</div>';
  el.innerHTML=html;
}

function renderCarteVerdict(containerId, card, teamA, teamB, titre, htInfo, isPriority) {
  var el = document.getElementById(containerId);
  if (!el) return;
  // CORRIGÉ (16/07/26) : isPriority déduit avant de la card 'carte-verdict-r'
  // en dur — devenu faux dès que la décoration "prioritaire" a commencé à
  // basculer dynamiquement (mode fixe vs rotation, voir renderTheme), la
  // taille de police restait figée sur la carte rotation même quand
  // c'était la carte M1/M7 qui portait le badge. Passé en paramètre
  // explicite désormais, calculé une seule fois par l'appelant.
  isPriority = !!isPriority;
  var winnerName = card.winner === card.labelA ? teamA : card.winner === card.labelB ? teamB : 'Nul';
  var html = '<h3 style="text-align:center;">' + titre + '</h3>';
  html += '<div style="display:flex; gap:14px; align-items:center; justify-content:center; flex-wrap:wrap; margin-bottom:8px;">';
  html += '<div style="background:#0f172a; border:2px solid #4ade80; border-radius:10px; padding:' + (isPriority ? '12px 22px' : '8px 16px') + '; text-align:center;"><div class="muted" style="font-size:11px;">Victoire</div><div style="font-size:' + (isPriority ? '30px' : '20px') + '; font-weight:900; color:#4ade80;' + (isPriority ? ' text-shadow:0 0 16px rgba(74,222,128,.55);' : '') + '">' + winnerName + '</div></div>';
  html += '<div style="background:#0f172a; border:1px solid #60a5fa; border-radius:10px; padding:' + (isPriority ? '12px 22px' : '8px 16px') + '; text-align:center;"><div class="muted" style="font-size:11px;">Score</div><div style="font-size:' + (isPriority ? '30px' : '20px') + '; font-weight:900;' + (isPriority ? ' text-shadow:0 0 16px rgba(96,165,250,.45);' : '') + '">' + card.scoreMain + '</div><div class="muted" style="font-size:11px;">alt: ' + card.scoreAlt + '</div></div>';
  if (card.incidentPct > 0) {
    var incColor = card.incidentInevitable ? '#f87171' : card.incidentPct >= 50 ? '#fb923c' : '#facc15';
    html += '<div style="background:#0f172a; border:2px solid ' + incColor + '; border-radius:10px; padding:' + (isPriority ? '12px 22px' : '8px 16px') + '; text-align:center;' + (card.incidentInevitable ? ' box-shadow:0 0 16px rgba(248,113,113,.55);' : '') + '"><div class="muted" style="font-size:11px;">⚠️ Penalty / Rouge</div><div style="font-size:' + (isPriority ? '30px' : '20px') + '; font-weight:900; color:' + incColor + ';">' + card.incidentPct + '%</div><div class="muted" style="font-size:11px;">' + card.incidentNiveau + (card.incidentInevitable ? ' — quasi inévitable' : '') + '</div></div>';
  }
  html += '</div>';
  html += '<div style="text-align:left; margin-left:24px;">';
  // ⚠️ 27/08/26 — renderCarteVerdict n'est appelée NULLE PART. Vérifié :
  // une seule occurrence du nom dans tout le fichier, sa définition.
  // C'est du code mort. J'y avais d'abord posé le détail des signaux
  // d'incident : il ne s'affichait pas, forcément. Il vit maintenant
  // dans renderProtocoleVerdictPrincipal, le panneau réellement rendu.
  html += '<div class="kv"><b>Penalty/Rouge :</b> ' + (card.penaltyRouge ? 'Oui' : 'Non') +
    (card.incidentPct > 0 ? ' — <span style="font-weight:900; color:' + (card.incidentInevitable ? '#f87171' : card.incidentPct >= 50 ? '#fb923c' : '#facc15') + ';">' + card.incidentNiveau + ' (' + card.incidentPct + '%)' + (card.incidentInevitable ? ' ⚠️ quasi inévitable' : '') + '</span>' : '') + '</div>';
  if (card.incidentPct > 0) {
    html += '<div class="kv muted" style="font-size:11px;">Type dominant : ' + card.incidentTypeDominant +
      ' (penalty ' + card.incidentPctPenalty + '% / rouge ' + card.incidentPctRouge + '%)</div>';
  }
  html += '<div class="kv"><b>Cartons jaunes (estimé) :</b> ' + card.cartonsJaunes + '</div>';
  // CORRIGÉ (17/07/26) : quand capaciteFiable=false, la capacité de but
  // brute de CETTE paire (posA/posB, calculerButsCamp — calcul INDÉPENDANT
  // de domA/domB) pointe dans le sens opposé au vainqueur affiché. Montrer
  // "Puissance de marquage : [équipe perdante]" juste sous "Victoire :
  // [équipe gagnante]" serait une contradiction visuelle directe — les
  // chiffres restent affichés (rien d'inventé), mais sans les présenter
  // comme l'explication du vainqueur.
  if (card.capaciteFiable) {
    var capaciteLabel = card.capaciteWinner === 'A' ? teamA : card.capaciteWinner === 'B' ? teamB : 'Égalité';
    html += '<div class="kv"><b>Puissance de marquage :</b> ' + capaciteLabel + ' (' + card.capaciteA + ' vs ' + card.capaciteB + ')</div>';
  } else {
    html += '<div class="kv muted" style="font-size:11px;"><b>Puissance de marquage (ce calcul seul) :</b> ' + card.capaciteA + ' vs ' + card.capaciteB + ' — ne détermine pas le vainqueur ici, tranché par un autre mécanisme</div>';
  }
  html += '<div class="kv"><b>Les deux marquent (BTTS) :</b> ' + (card.btts ? 'Oui' : 'Non') +
    (card.bttsSource ? ' <span class="muted" style="font-size:11px;">— ' + card.bttsSource + '</span>' : '') +
    (card.bttsForce ? ' <span style="color:#94a3b8;font-size:11px;">· M4/M10 aurait dit Oui 100% (signalé, non décisif)</span>' : '') +
    (card.bttsDefavorise ? ' <span style="color:#94a3b8;font-size:11px;">· M4/M10 aurait dit Non (signalé, non décisif)</span>' : '') + '</div>';
  if (card.bttsRotation && card.bttsRotation.applicable) {
    html += '<div class="kv muted" style="font-size:11px;"><b>Ouverture des sièges :</b> '
      + card.bttsRotation.synthese + '</div>';
  }
  if ((card.bttsForce || card.bttsDefavorise) && card.bttsRaison) {
    html += '<div class="kv muted" style="font-size:11px;"><b>Doctrine BTTS :</b> ' + card.bttsRaison + '</div>';
  }
  html += '<div class="kv"><b>Corners :</b> ' + card.corners.ht1 + ' (1MT) + ' + card.corners.ht2 + ' (2MT) = ' + card.corners.total + ' — match ' + (card.corners.ouvert ? 'ouvert' : 'fermé') + (card.corners.doctrine === 'beaucoup' ? ' — <span style="color:#facc15;">R1/R7 Feu + M10 Air/Feu : beaucoup de corners (≥10)</span>' : card.corners.doctrine === 'peu' ? ' — <span style="color:#94a3b8;">R1/R7 Terre + M10 Terre : blocage, peu de corners (≥3)</span>' : '') + '</div>';
  if (htInfo) {
    var htLabel = htInfo.htWinner === 'M1' ? teamA : htInfo.htWinner === 'M7' ? teamB : htInfo.htWinner === 'both' ? 'Les deux' : 'Indéterminé';
    html += '<div class="kv"><b>Premier but (mi-temps) :</b> ' + htLabel + '</div>';
    html += '<div class="kv"><b>But 1ère mi-temps fiable :</b> ' + (htInfo.htWinner === 'M1' || htInfo.htWinner === 'M7' || htInfo.htWinner === 'both' ? 'Oui' : 'Non') + '</div>';
    // AJOUTÉ (16/07/26, demande utilisateur) : buts prévus en 1ère mi-temps,
    // intégrés directement dans le verdict affiché plutôt que caché derrière
    // le bouton "🕐 But par mi-temps". Théorie gardée active (M1/M7 gouverne
    // la 1ère mi-temps, R1/R7 la 2e) : le score de CETTE carte (M1/M7)
    // représente donc directement le score prévu à la mi-temps.
    html += '<div class="kv" style="color:#93c5fd;"><b>⏱️ Buts prévus 1ère mi-temps (théorie M1/M7) :</b> ' + card.scoreMain + '</div>';
  }
  html += '</div>';
  html += '<div style="text-align:center; margin-top:10px;">';
  html += (card.source === 'doctrine'
    ? '<div class="kv" style="color:#4ade80; font-size:12px; margin-bottom:4px;"><b>✓ Vainqueur doctrinal (verdictFinal a tranché ici)</b></div>'
    : card.source === 'aligne'
    ? '<div class="kv" style="color:#60a5fa; font-size:12px; margin-bottom:4px;"><b>↔️ Aligné sur le verdict final (ce niveau seul ne tranche pas — voir la carte prioritaire)</b></div>'
    : '<div class="kv" style="color:#fbbf24; font-size:12px; margin-bottom:4px;"><b>⚠️ Estimation moteur V7 (non validé — verdictFinal indécis/muet sur ce niveau, aucune règle validée ne tranche ici)</b></div>');
  if (card.corrected) html += '<div class="kv" style="color:#f87171; font-size:11px;">⚠️ marge ajustée (désaccord doctrine/buts bruts)</div>';
  if (card.viaEnM4) html += '<div class="kv" style="color:#fbbf24; font-size:11px;">🚫 Via en M4 → ' + teamA + ' ne marque pas (piste n=9, 3/3 vs 0/5 sur l\'archive, non encore validée à grande échelle)</div>';
  html += '<div class="kv" style="margin-top:6px;"><b>Domination / fiabilité :</b></div>';
  if (!card.domFiable) html += '<div class="kv muted" style="font-size:11px;">⚠️ cette barre reflète la force propre de cette paire, pas nécessairement le mécanisme qui a désigné le vainqueur</div>';
  html += '</div>';
  html += '<div style="display:flex; height:22px; border-radius:6px; overflow:hidden; border:1px solid #334155; max-width:480px; margin:0 auto;">';
  html += '<div style="width:' + card.domPctA + '%; background:#4ade80; display:flex; align-items:center; justify-content:center; font-size:11px; color:#022c22;">' + teamA + ' ' + card.domPctA + '%</div>';
  html += '<div style="width:' + card.domPctB + '%; background:#f87171; display:flex; align-items:center; justify-content:center; font-size:11px; color:#450a0a;">' + teamB + ' ' + card.domPctB + '%</div>';
  html += '</div>';
  el.innerHTML = html;
}

