// ═══════════════════════════════════════════════════════════════
// FORMAT LIVE NUL
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// LES RÈGLES CONDITIONNELLES — elles ne parlent que sur leur motif.
//
// Elles NE VOTENT PAS (voteMoteursV7 ne les consulte pas) : une règle qui
// se prononce sur 3 % des thèmes n'a pas à peser sur les 97 autres. Elles
// sont au banc pour accumuler, rien d'autre.
//
// ─── CARCER EN M10 (28/08/26, théorie d'Ellemine_D) ───
// « Carcer en sa maison 10 a tendance à faire gagner R1 ou R7 quand ils
// sont de boucle différente. »
// CE QUE L'ARCHIVE DIT, sur les cinq cas à boucles différentes :
//     Inter      R1 B / R7 A   Carcer en M10   la boucle B gagne   ✔ réel R1
//     PSG/Bayer  R1 A / R7 B   Carcer en M10   la boucle B gagne   ✔ réel R7
//     Milan      R1 A / R7 B   —               la boucle B perd    (réel R1)
//     Napoli     R1 B / R7 A   —               la boucle B perd    (réel R7)
//     Torino     R1 B / R7 A   —               la boucle B perd    (réel R7)
// Avec Carcer en M10 : 2 fois sur 2. Sans : 0 fois sur 3. Séparation
// parfaite sur les cinq cas.
//
// POURQUOI C'EST « LA BOUCLE B ». Carcer appartient à la boucle B, et le
// réseau allié d'une figure EST sa boucle (loi de parité vérifiée
// 256/256). Quand les boucles diffèrent, exactement un des deux camps est
// en B — et sur ces deux cas c'est lui qui contient tout le réseau de
// Carcer (4 figures sur 5 pour Inter, 3 sur 5 pour PSG, 0 en face les
// deux fois). « Le camp le plus lié à Carcer » et « le camp de la boucle
// de Carcer » sont donc la MÊME règle, pas deux confirmations.
//
// ⚠️ DEUX CAS NE VÉRIFIENT RIEN, ET J'AI CHOISI LA FORMULATION APRÈS
// AVOIR VU LES DONNÉES. Si la boucle B gagnait une fois sur deux au
// hasard, obtenir 2/2 ici ET 0/3 ailleurs a environ 3 % de chances — mais
// ce calcul ne vaut que pour une hypothèse posée AVANT de regarder, ce
// qui n'est pas le cas. La règle est mise au banc pour être réfutée, pas
// parce qu'elle est établie. Le motif ne se présente que sur 3 % des
// thèmes : il faudra du temps.
var MOTEURS_CONDITIONNELS_V7 = [
  // L'ANCIENNE lecture de F4P4, gardée au banc depuis que la règle de la
  // centrale adverse est branchée (28/08/26) : ici le rival compte encore
  // parmi les pôles de son adversaire. Elle ne vote pas — elle sert à
  // mesurer ce que la nouvelle règle coûte ou rapporte, cas par cas.
  // Sur les dix cas réels : ancienne 6/10, nouvelle 5/10, un seul cas les
  // sépare (Juventus). C'est trop peu pour trancher, d'où sa présence.
  // ═══════════════════════════════════════════════════════════════
  // AUTOPSIE DE ViaCaput (28/08/26) — POURQUOI LE SYSTÈME A DIT R7
  //
  // Via/Caput/Amissio/Carcer, réel 1-0 pour R1, verdict affiché R7 0-4.
  // R1 = Puella en M5, R7 = Caput Draconis en M11, k=5, boucles
  // différentes, aucun rôle partagé.
  //
  // 1. LE VERDICT SUIT F4P4, ET F4P4 A TRANCHÉ SUR « PÔLES SOLIDES :
  //    0 CONTRE 2 ». C'est le premier critère de sa cascade en boucles
  //    différentes.
  // 2. OR LA FIGURE LA PLUS FORTE DU THÈME EST LE CHEF DE R1 : Puella
  //    pèse 27,38 aux sept critères, contre 8,10 pour Caput Draconis, le
  //    chef de R7. Le compte qui décide ne regarde QUE les quatre pôles :
  //    le chef lui-même n'y entre pas. reseauF4P4V7 calcule pourtant
  //    solidesAvecCentrale — un champ qui n'est utilisé NULLE PART.
  //    (Et l'utiliser ne sauverait pas ce cas : Puella n'est pas « solide »
  //    au sens de solidPoleV7, qui exige en plus que son propre réseau
  //    tienne — 0 contre 2 dans les deux comptes. Mesuré : 14/23 au lieu
  //    de 15/23 sur l'archive.)
  // 3. L'AUTRE DIFFÉRENCE DÉCISIVE EST L'ASSAILLANT, ET F4P4 NE LE
  //    REGARDE PAS ICI. L'assaillant de R7 est Populus (16,63), celui de
  //    R1 est Conjonctio (11,25) : c'est R7 le plus attaqué. Mais la
  //    cascade des boucles différentes est « solides → frappe → ancrage » ;
  //    l'assaillant n'apparaît QUE dans la branche même boucle. Cette
  //    asymétrie n'est justifiée nulle part dans le fichier.
  // 4. TOUTES LES LECTURES QUI COMPTENT LE CHEF ET RETRANCHENT
  //    L'ASSAILLANT ONT TROUVÉ R1 : sept critères (45,89 contre 43,42 —
  //    l'écart est exactement la soustraction des assaillants), table des
  //    pôles, sans concordance, cohabitation seule.
  //
  // ⚠️ ET LA CORRECTION NE FAIT PAS MIEUX EN TOTAL. La variante ci-dessous
  // — départager par « ancrage total moins l'assaillant », avant tout le
  // reste — fait 15/23, exactement comme F4P4 actuel. Elle redresse les
  // trois échecs les plus récents (ViaCaput, City/Madrid, ConjCaput) et
  // en casse trois anciens (Atalanta, LaetCarcer, PuerLaet). Elle entre
  // donc au banc, sans voter, comme les autres candidates.
  { cle: 'f4p4_moins_assaillant', nom: 'F4P4 · ancrage moins l\'assaillant', icone: '🧭', teinte: '#f0abfc',
    juste: 0, total: 0, note: 'le chef compte, et l\'assaillant est retranché même en boucles différentes — 15/23',
    verdict: function (t) {
      var m = null;
      try { m = moteurF4P4V7(t); } catch (e) { m = null; }
      if (!m || !m.applicable) return { camp: null, detail: 'non applicable' };
      var adv = function (r) { return (r.adverse && r.adverse.centrale) ? (r.adverse.centrale.ancrage || 0) : 0; };
      var a = Math.round((m.R1.ancrageTotal - adv(m.R1)) * 100) / 100;
      var b = Math.round((m.R7.ancrageTotal - adv(m.R7)) * 100) / 100;
      return { camp: a > b ? 'R1' : b > a ? 'R7' : null,
        detail: 'R1 ' + a + ' contre R7 ' + b + ' (assaillants retranchés : ' + adv(m.R1) + ' et ' + adv(m.R7) + ')' };
    } },

  // Les deux lectures issues de la fouille du 28/08 (voir moteurCritereV7).
  // Elles ne votent pas : elles sont là pour être suivies, parce que les
  // écarts qui les distinguent sont dans le bruit sur quatorze cas.
  // ─── LA SÉLECTION, PAS LA LECTURE (28/08/26 au soir) ───
  // Sur ConjCaput, SEPT moteurs sur neuf ont trouvé le bon camp (R7) et
  // le verdict affiché a dit R1 : la cascade met F4P4 en tête, et F4P4
  // s'est trompé. C'est la démonstration en un cas de ce que la fouille
  // annonçait — l'information est là, c'est le choix du porte-parole qui
  // rate.
  // Cette lecture-ci ne garde que les trois moteurs qui pèsent vraiment
  // les sept critères et prend leur majorité. Mesurée sur les dix-neuf
  // cas : 13/19, contre 12/19 pour le verdict affiché, pour la majorité
  // des neuf et pour F4P4 seul. UN point d'écart — c'est trop peu pour
  // rebrancher la cascade, assez pour la suivre au banc.
  { cle: 'majorite_purs', nom: 'Majorité des 3 moteurs qui appliquent les critères', icone: '🎯', teinte: '#5eead4',
    juste: 0, total: 0, note: 'F4P4 + sept critères + ancrage, à la majorité — 13/19',
    verdict: function (t) {
      // ─── RECÂBLÉ LE 01/09/26 ───
      // Cette lecture cherchait f4p4, sept_criteres et ancrage DANS
      // MOTEURS_V7. Les trois en sont partis avec les dix votants : elle
      // serait devenue muette en silence. Elle appelle maintenant les
      // trois fonctions directement — sa doctrine ne change pas.
      var r1 = 0, r7 = 0, det = [];
      [['f4p4', function () { var x = moteurF4P4V7(t); return x && x.applicable ? x.avantage : null; }],
       ['sept_criteres', function () { var x = moteurSeptCriteresV7(t); return x && x.applicable ? x.camp : null; }],
       ['ancrage', function () { var x = analyseAncrageDeveloppe(t); return x && x.applicable ? x.avantage : null; }]
      ].forEach(function (P) {
        var c = null;
        try { c = P[1](); } catch (e) { c = null; }
        if (c === 'R1') r1++; else if (c === 'R7') r7++;
        det.push(P[0] + ':' + (c || '—'));
      });
      return { camp: r1 > r7 ? 'R1' : r7 > r1 ? 'R7' : null, detail: det.join(' · ') };
    } },
  { cle: 'crit_sans_concordance', nom: 'Critères sans la concordance', icone: '🎯', teinte: '#67e8f9',
    juste: 0, total: 0, note: 'la concordance pèse ×10 et se trompe 4 fois sur 12 — mais la retirer seule dégrade (6/14)',
    verdict: function (t) { return moteurCritereV7(t, POIDS_SANS_CONCORDANCE_V7); } },
  { cle: 'crit_sans_conc_env', nom: 'Critères sans concordance ni environnement', icone: '🎯', teinte: '#22d3ee',
    juste: 0, total: 0, note: 'les deux critères les plus faibles retirés — meilleur score à couverture complète',
    verdict: function (t) { return moteurCritereV7(t, POIDS_SANS_CONC_ENV_V7); } },
  { cle: 'crit_cohabitation', nom: 'Cohabitation seule', icone: '🎯', teinte: '#a5f3fc',
    juste: 0, total: 0, note: 'le meilleur critère pris isolément — 9/12 à la mesure du 28/08',
    verdict: function (t) { return moteurCritereV7(t, POIDS_COHABITATION_SEULE_V7); } },
  { cle: 'f4p4_avec_adverse', nom: 'F4P4 — ancienne lecture (le rival compte dans les pôles)', icone: '🧭', teinte: '#c084fc',
    juste: 0, total: 0,
    note: 'à comparer au F4P4 courant : leur écart isole exactement l\'effet de la règle',
    verdict: function (t) { return moteurF4P4AvecAdverseV7(t); } },
  { cle: 'decalage_oblique', nom: 'Décalage oblique → celui qui touche le plus', icone: '⚔', teinte: '#60a5fa',
    juste: 0, total: 0,
    note: 'muet quand les boucles sont identiques (k pair) : là, aucun camp ne touche l\'autre',
    verdict: function (t) {
      var rot = getRotationCombat(t);
      if (!rot || !rot.figR1 || !rot.figR7) return { camp: null, detail: 'rotation indisponible' };
      var d = decalageCampsV7(rot.figR1, rot.figR7);
      if (!d || d.memeBoucle) return { camp: null, detail: d ? d.resume : 'indisponible' };
      return { camp: d.avantage, detail: d.resume };
    } },
  { cle: 'carcer_m10', nom: 'Carcer en M10 → la boucle de Carcer gagne', icone: '🔒', teinte: '#f472b6',
    juste: 0, total: 0, note: 'théorie Ellemine_D 28/08 — ne parle que si Carcer est en M10 et les boucles diffèrent',
    verdict: function (t) {
      if (!t || t[10] !== 'carcer') return { camp: null, detail: 'Carcer n\'est pas en M10' };
      var rot = getRotationCombat(t);
      if (!rot || !rot.figR1 || !rot.figR7) return { camp: null, detail: 'rotation indisponible' };
      var b1 = loopOf(rot.figR1), b7 = loopOf(rot.figR7);
      if (b1 === b7) return { camp: null, detail: 'même boucle (' + b1 + ')' };
      var bCarcer = loopOf('carcer');
      var camp = b1 === bCarcer ? 'R1' : b7 === bCarcer ? 'R7' : null;
      return { camp: camp,
        detail: 'Carcer en M10 · R1 ' + b1 + ' / R7 ' + b7 + ' · boucle de Carcer ' + bCarcer };
    } }
];

// ═══════════════════════════════════════════════════════════════
// LES MOTEURS DE CORNERS — mis au banc le 28/08/26, demande d'Ellemine_D.
//
// Le banc ne savait noter que des ÉGALITÉS : un camp (R1/R7) ou un
// booléen (les deux marquent, incident). Les corners sont un nombre : il
// a fallu un troisième mode de notation, à TOLÉRANCE (passeNum).
//
// ⚠️ LA TOLÉRANCE EST UN CHOIX, PAS UNE MESURE. ±2 corners, la même que
// la pastille verte du panneau des thèmes sauvegardés. Elle n'a été
// calibrée sur aucun résultat — il n'y en a aucun. À revoir dès que le
// banc aura des cas.
//
// ⚠️ ET LE TÉMOIN EST LÀ POUR ÇA. « Toujours 10 » ne regarde pas le
// thème : c'est la moyenne d'un match de football. Si le moteur ne le
// bat pas, il ne lit rien — exactement le rôle qu'a joué « BTTS toujours
// oui » (4/9), qui a servi d'étalon aux deux autres lectures.
// Pour information, distribution du total annoncé sur 311 thèmes :
// 11 dans 46 % des cas, 4 dans 25 % — deux valeurs couvrent 71 % des
// thèmes. Le moteur de corners hérite du générateur de score, qui est
// lui-même bloqué sur un écart de 2 dans 91 % des cas.
var BANC_TOLERANCE_CORNERS_V7 = 2;

// Le DOMINANT des corners — une égalité de camp, comme le vainqueur, et
// non une distance. C'est la vraie question posée par Ellemine_D : le
// total hérite du générateur de score, le dominant vient de la
// domination du duel, qui est une lecture à part.
// Le témoin ne lit pas le thème : il désigne toujours R1. Si les vraies
// lectures ne le battent pas, elles ne lisent rien.
var MOTEURS_CORNERS_DOM_V7 = [
  { cle: 'corners_dom', nom: 'Corners · dominant (domination du duel)', icone: '🚩', teinte: '#4ade80',
    juste: 0, total: 0, note: 'répartition sur domA/domB, bornée à 25/75',
    verdict: function (t) {
      var v = getVerdictAfficheReel(t);
      if (!v || !v.cornersDominant) return { camp: null, detail: 'égalité' };
      return { camp: v.cornersDominant === 'M1' ? 'R1' : 'R7',
        detail: v.cornersM1 + ' / ' + v.cornersM7 + ' · part ' + (v.corners ? v.corners.partA + '%' : '—') };
    } },
  { cle: 'corners_dom_vainqueur', nom: 'Corners · le vainqueur domine', icone: '🏆', teinte: '#a78bfa',
    juste: 0, total: 0, note: 'lecture naïve : celui qui gagne pousse le plus',
    verdict: function (t) {
      var v = getVerdictAfficheReel(t);
      if (!v || !v.winner || v.winner === 'Nul') return { camp: null, detail: 'nul' };
      return { camp: v.winner === 'M1' ? 'R1' : 'R7', detail: 'vainqueur ' + v.winner };
    } },
  { cle: 'corners_dom_temoin', nom: 'Corners · « toujours R1 »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin — ne lit pas le thème',
    verdict: function () { return { camp: 'R1', detail: 'réponse constante' }; } }
];

// ═══════════════════════════════════════════════════════════════
// BUT DANS LES DEUX MI-TEMPS (28/08/26, demande d'Ellemine_D)
//
// La question : y a-t-il au moins un but dans CHAQUE mi-temps ?
// Le fichier avait déjà trois lectures qui touchent aux mi-temps — le
// panneau « But par mi-temps » (hypothèse M1/M7 pour la première,
// R1/R7 pour la seconde, n=1), le signal htWinner (qui marque en
// première période), et la répartition des corners ht1/ht2 — et AUCUNE
// n'avait jamais vu un seul résultat, faute de champ pour l'enregistrer.
// Le champ existe maintenant (setRealHtScore) et cette famille rejoue
// les candidats dessus.
//
// Le réel se lit ainsi : but en 1re mi-temps = total du score à la pause
// > 0 ; but en 2e = total final > total à la pause. Les deux à la fois =
// « oui ». Il faut donc le score de mi-temps ET le score final.
//
// ⚠️ ZÉRO CAS AUJOURD'HUI. Les vingt thèmes de l'archive n'ont aucun
// score de mi-temps : la famille affichera 0/0 tant que tu n'en auras pas
// saisi. C'est le but — rendre visible qu'on ne sait pas, au lieu de
// laisser trois lectures non testées avoir l'air de fonctionner.
var MOTEURS_MITEMPS_V7 = [
  { cle: 'mt_deux_cartes', nom: 'Mi-temps · hypothèse M1/M7 puis R1/R7', icone: '🕐', teinte: '#38bdf8',
    juste: 0, total: 0, note: 'le panneau « But par mi-temps » : un but dans chaque moitié si les deux cartes marquent',
    verdict: function (t) {
      var b = null;
      try { b = butParMiTemps(t); } catch (e) { return { oui: null, detail: 'indisponible' }; }
      var tot = function (sc) {
        var m = String(sc || '').match(/(\d+)-(\d+)/);
        return m ? (+m[1]) + (+m[2]) : 0;
      };
      var a = tot(b.premiereMiTemps.score), c = tot(b.secondeMiTemps.score);
      return { oui: a > 0 && c > 0, detail: '1re ' + b.premiereMiTemps.score + ' · 2e ' + b.secondeMiTemps.score };
    } },
  { cle: 'mt_match_ouvert', nom: 'Mi-temps · match ouvert', icone: '🕐', teinte: '#a78bfa',
    juste: 0, total: 0, note: 'un match ouvert (M5 et M11 non paralysées, ou récit ouvert) marque dans les deux moitiés',
    verdict: function (t) {
      var o = false;
      try { o = determinerMatchOuvertV7(t); } catch (e) { return { oui: null, detail: 'indisponible' }; }
      return { oui: !!o, detail: o ? 'match ouvert' : 'match fermé' };
    } },
  { cle: 'mt_ht_signal', nom: 'Mi-temps · signal de première période (htWinner)', icone: '🕐', teinte: '#fb923c',
    juste: 0, total: 0, note: 'quelqu\'un marque avant la pause, et le score prédit dépasse ce total',
    verdict: function (t) {
      var v = null;
      try { v = verdictV7(t); } catch (e) { return { oui: null, detail: 'indisponible' }; }
      if (!v || !v.htBut) return { oui: null, detail: 'aucun signal de première période' };
      return { oui: true, detail: 'but avant la pause'
        + (v.htDeuxCamps ? ' (et le signal ajoute : des deux côtés)' : '') };
    } },
  { cle: 'mt_ht_signal_ferme', nom: 'Mi-temps · signal de première période, qui ose le non', icone: '🕐', teinte: '#fbbf24',
    juste: 0, total: 0, note: 'même signal, mais l\'absence de signal vaut « non » au lieu d\'une abstention',
    verdict: function (t) {
      var v = null;
      try { v = verdictV7(t); } catch (e) { return { oui: null, detail: 'indisponible' }; }
      if (!v) return { oui: null, detail: 'indisponible' };
      return { oui: !!v.htBut, detail: v.htBut ? 'but attendu avant la pause' : 'aucun but attendu avant la pause' };
    } },
  { cle: 'mt_temoin', nom: 'Mi-temps · « toujours oui »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin — ne lit pas le thème',
    verdict: function () { return { oui: true, detail: 'réponse constante' }; } }
];

// La question FORTE, séparée le 28/08/26 : les DEUX camps marquent-ils
// avant la pause ? C'est ce que htWinner='both' affirmait sans jamais
// être noté là-dessus. Il l'est maintenant.
var MOTEURS_MITEMPS_DEUX_V7 = [
  { cle: 'mtd_signal', nom: '1re mi-temps · les deux marquent (signal htWinner)', icone: '🕐', teinte: '#f472b6',
    juste: 0, total: 0, note: 'l\'affirmation forte de htWinner, enfin confrontée au réel',
    verdict: function (t) {
      var v = null;
      try { v = verdictV7(t); } catch (e) { return { oui: null, detail: 'indisponible' }; }
      if (!v) return { oui: null, detail: 'indisponible' };
      if (!v.htBut) return { oui: null, detail: 'aucun signal de première période' };
      return { oui: !!v.htDeuxCamps, detail: v.htDeuxCamps ? 'les deux marquent' : 'un seul côté' };
    } },
  { cle: 'mtd_temoin', nom: '1re mi-temps · « toujours les deux »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin — ne lit pas le thème',
    verdict: function () { return { oui: true, detail: 'réponse constante' }; } }
];

// ═══════════════════════════════════════════════════════════════
// LE NUL (29/08/26) — « vérifie R1 et R7 dans les matchs nuls, ils
// tombent dans quelle maison » (Ellemine_D)
//
// Vérifié. D'abord un fait structurel : R7 tombe TOUJOURS six maisons
// après R1 dans l'anneau — 28 cas sur 28, sans exception. La position de
// R7 ne dit donc rien de plus que celle de R1.
//
// Ensuite le résultat, et il est net sur ce qu'on a :
//   catégorie de la maison de R1     nuls / cas au résultat connu
//     angulaire (M1,4,7,10) ............ 0 / 7
//     succédente (M2,5,8,11) ........... 0 / 11
//     CADENTE (M3,6,9,12) .............. 2 / 6   ← les DEUX nuls
//     synthèse (M13-16) ................ 0 / 2
// Roma, R1 en M9. AmisPuer, R1 en M6. Les deux nuls de l'archive sont
// dans la même catégorie, et les vingt autres cas n'y sont pas.
// Fréquence de base : R1 tombe en maison cadente sur 25 % des thèmes
// (mesuré, la répartition est parfaitement uniforme entre les quatre
// catégories). Deux nuls sur deux dans un quart des thèmes : la
// probabilité que ce soit le hasard est de 1 sur 16.
//
// ⚠️ DEUX NULS. C'est la première chose de cette archive qui sépare les
// nuls du reste, et c'est aussi trop peu pour en faire une règle. Pire :
// le témoin « jamais de nul » a 24 cas justes sur 26, parce que les nuls
// sont rares. Tout détecteur de nul doit donc battre 92 % pour valoir
// quelque chose — aucun ne le fait aujourd'hui.
// La famille existe pour que les prochains nuls tombent dedans.
// ═══════════════════════════════════════════════════════════════
// 29/08/26 — LE TROISIÈME NUL TRANCHE : C'EST LA MAISON QUI TIENT
//
// Ellemine_D : « j'insiste sur la piste des maisons ». Il avait raison,
// et le thème Caput · Puella · Puella · Via (réel 2-2) l'a prouvé le
// soir même. Bilan de la famille Nul sur 27 cas et 3 nuls :
//
//   moteur                              justesse  nuls attrapés  faux+
//   R1 tombe en maison CADENTE ........  23/27       3/3           4
//   binôme ET juge partagé ............  26/27       2/3           0
//   R7 est le binôme de R1 ............  25/27       2/3           1
//   le juge M15 porte un pôle des 2 ...  24/27       2/3           2
//   témoin « jamais de nul » ..........  24/27       0/3           0
//   R1 et R7 dans la même boucle ......  17/27       2/3           9
//   juge M15 figé (les 4 symétriques) .  13/27       2/3          13
//
// La maison cadente était alors LA SEULE lecture à attraper les trois.
//
// ☠️ ET LE 0-0 DU 14/02/2026 A CASSÉ ÇA LE SOIR MÊME (Carcer · Albus ·
// Conjonctio · Rubeus). Quatrième nul, R1 = Albus en M10, ANGULAIRE.
//   « R1 en maison cadente » .......... 3 nuls sur 4, 24/29
//   « aucun nul en angulaire » ........ était 0 sur 8, devient 1 sur 9
//   témoin « jamais de nul » .......... 25/29  ← repasse DEVANT
// Les HUIT moteurs de la famille ont dit non sur ce thème. La lecture
// par la maison reste la meilleure couverture qu'on ait (3 nuls sur 4
// contre 2 sur 4 pour tout le reste), mais ce n'est plus une loi, et
// elle ne bat plus le témoin en justesse brute. Aucune règle de nul du
// fichier ne bat aujourd'hui « il n'y a jamais de nul ».
// C'est le rappel qu'il fallait : trois cas qui vont dans le même sens
// ne sont pas une loi, et le premier cas capable de le montrer l'a
// montré.
// Elle paie sa couverture en précision — 3 nuls pour 7 déclenchements,
// donc quand elle dit oui, c'est nul deux fois sur cinq. Elle sert à
// SAVOIR QUAND SE MÉFIER, pas à annoncer un nul.
//
// À l'inverse, tout ce qui reposait sur la nature des figures rate le
// même cas : CaputPuella a R7 à +11 de R1 (boucles opposées) et zéro
// rôle partagé entre les camps. Ces règles-là ne crient jamais à tort —
// elles se taisent. Les deux familles sont donc COMPLÉMENTAIRES : la
// maison ratisse, la figure confirme.
//
// ⚠️ ET LE PLUS GRAVE, SUR LE CAMP. Le système annonçait R7 avec l'écart
// le plus large de toute l'archive : sept critères 114,28 contre 27,75,
// lecture au volant 75 contre −9. Résultat : nul. Vérifié alors sur les
// 27 cas au camp connu, en triant par l'écart du moteur :
//     moitié aux écarts les plus LARGES ....  7 justes / 14
//     moitié aux écarts les plus SERRÉS .... 10 justes / 14
// (recalculé le 29/08 après RubCarcer, camp trouvé sur un écart moyen)
// L'écart du moteur n'est PAS un indice de fiabilité — le point estimé
// va même à l'envers. (6/13 contre 10/14 n'est pas significatif sur 27
// cas : ce n'est pas la preuve que l'écart trompe, c'est la preuve
// qu'il ne renseigne pas.) Ne jamais présenter un gros écart comme une
// prédiction plus sûre. C'était déjà l'erreur commise sur ce thème.
//
// ⚠️ CE QU'ON N'A PAS TROUVÉ, ET IL FAUT LE DIRE. Balayage refait sur
// les trois nuls : 232 traits testés à l'intérieur de la seule famille
// cadente (7 cas, 3 nuls contre 4 non-nuls). Douze traits séparent
// parfaitement, dont « M11 porte une figure répétée ». C'est du BRUIT :
// avec un partage 3 contre 4, un trait au hasard qui se déclenche sur
// trois cas sépare parfaitement une fois sur 35, donc sur 232 traits on
// en attend une petite dizaine — et on en a douze. Aucun n'est branché.
// Rien ne sépare encore les nuls des autres cadents.
// ═══════════════════════════════════════════════════════════════
// LE FAISCEAU DU NUL (29/08/26) — reproche fondé d'Ellemine_D
//
// « À chaque fois que nous avons une piste solide tu fais tout pour
// trouver une chose qui la contraint, au lieu de faire la corrélation
// avec ce que nous avons étudié jusqu'ici. »
//
// Le reproche porte, et l'erreur était de méthode : chaque lecture était
// jugée SEULE, contre le témoin « il n'y a jamais de nul » (25/29). Ce
// témoin est imbattable en justesse brute parce que les nuls sont rares
// — et il est INUTILISABLE, puisqu'il ne laisse jamais rien jouer. Le
// prendre comme barre revenait à déclarer mort tout ce qui ose parler.
// La bonne mesure, pour quelqu'un qui doit décider, n'est pas la
// justesse : c'est la PRÉCISION quand le signal parle, comparée aux
// 14 % de nuls que donne le hasard.
//
// Alors les sept lectures ont été croisées au lieu d'être opposées :
//   cadente ...... R1 tombe en maison cadente (M3, M6, M9, M12)
//   binôme ....... R7 est le binôme de R1 (+2)
//   boucle ....... R1 et R7 dans la même boucle (décalage pair)
//   partage ...... les deux camps partagent au moins 3 rôles sur 5
//   juge ......... la figure de M15 appartient aux deux camps
//   figé ......... M15 est une des quatre symétriques
//   structure .... structureDuNul (M13 = M14 ou paire d'équilibre)
//
// ET LES SIGNAUX S'ADDITIONNENT. Mesuré sur les 29 cas au résultat connu
// (4 nuls, soit 14 % au hasard) :
//   au moins 2 signaux → parle 14 fois, 3 nuls .... précision 21 %
//   au moins 3 signaux → parle  8 fois, 2 nuls .... précision 25 %
//   au moins 4 signaux → parle  5 fois, 2 nuls .... précision 40 %
//   au moins 5 signaux → parle  3 fois, 2 nuls .... précision 67 %
// De 14 % à 67 % en montant le seuil, sans inversion : c'est une échelle
// qui se tient, pas une coïncidence. AmisPuer (4-4) allume les SEPT.
// Roma (1-1) en allume cinq. Aucun autre thème de l'archive n'atteint
// six. À 5 signaux le seul faux positif est Juventus (6-1).
//
// Ce que ça vaut concrètement : un nul annoncé à 4 signaux est trois
// fois plus probable qu'au hasard, à 5 signaux presque cinq fois. C'est
// exactement le genre de signal sur lequel on peut décider — là où
// chaque lecture prise seule ne dépassait pas le témoin.
//
// ⚠️ CE QUE LE FAISCEAU NE VOIT PAS, et il faut le savoir en s'en
// servant : CarcAlbus (0-0 du 14/02) allume ZÉRO signal. Il est
// invisible pour les sept lectures à la fois. Le faisceau attrape donc
// 3 nuls sur 4, jamais le quatrième. Son silence ne prouve rien — c'est
// un outil pour OSER quand il parle, pas pour se rassurer quand il se
// tait.
// ═══════════════════════════════════════════════════════════════
// LE NUL A DEUX PORTES (29/08/26) — doctrine d'Ellemine_D
//
// « La table des pôles a vu juste sur le premier, sauf le dernier où R1
// et R7 ne partagent pas la même boucle. Conséquence : la manière dont
// le nul doit être opéré dans les deux cas doit être différente. »
//
// IL A RAISON, ET C'EST ÉCRIT DANS LE CODE LUI-MÊME. Dans tablePolesV7,
// la ligne « nul = true » n'existe QUE dans la branche if (memeBoucle).
// Quand R1 et R7 sont en boucles opposées, ce moteur ne PEUT PAS
// annoncer un nul, quoi qu'il voie. Mesuré sur les 30 cas au camp connu :
//   même boucle ...... 13 cas · table juste 7/13 · annonce NUL 3 fois,
//                      juste 2 fois, sur 3 vrais nuls du groupe
//   boucles opposées . 17 cas · table juste 6/17 · annonce NUL 0 fois,
//                      alors que le groupe contient 2 vrais nuls
// Les deux nuls que rien n'attrapait (CaputPuella 2-2, CarcAlbus 0-0)
// sont exactement les deux nuls de la branche opposée. Ils n'étaient pas
// imprévisibles : ils étaient dans l'angle mort d'une règle écrite pour
// l'autre branche.
//
// LA SECONDE PORTE. Dans la branche « boucles opposées », le décalage
// R1→R7 des 17 cas se répartit ainsi :
//   +1 → 6 cas · +3 → 2 · +5 → 2 · +7 → 1 · +9 → 3 · +13 → 1
//   +11 → 2 cas, ET CE SONT LES DEUX NULS (CaputPuella, CarcAlbus)
// +11 n'est pas un nombre au hasard : c'est victime(X) + 8, autrement
// dit R7 est LE FRONT DU FRONT DE LA VICTIME DE R1 (vérifié 16/16 sur
// les seize figures). En boucle opposée, le nul ne passe donc pas par
// l'alliance — il passe par la figure la plus lointaine de la proie.
//
// LES DEUX PORTES ENSEMBLE, sur 30 cas au camp connu (5 nuls) :
//   même boucle : binôme (+2) ................ 2 nuls / 5 · 1 faux+
//   opposées : +11 ........................... 2 nuls / 5 · 0 faux+
//   LES DEUX BRANCHES ........................ 4 nuls / 5 · 1 faux+
//   règle unique « binôme partout » .......... 2 nuls / 5 · 1 faux+
//   règle unique « R1 en maison cadente » .... 4 nuls / 5 · 4 faux+
// La règle à deux portes fait aussi bien que la maison en couverture
// avec quatre fois moins de faux positifs. Elle parle 5 fois sur 30 et
// a raison 4 fois : 80 % de précision contre 17 % au hasard.
//
// ⚠️ CE QUI EST AJUSTÉ ET CE QUI NE L'EST PAS, à lire avant d'y croire :
//   +2 (binôme) — trouvé par Ellemine_D sur AmisPuer AVANT toute
//      mesure, puis confirmé sur Roma qu'il n'avait pas regardé. C'est
//      une vraie prédiction hors échantillon.
//   +11 — trouvé après coup en regardant les deux nuls de la branche
//      opposée. Deux nuls qui partagent un décalage parmi huit : une
//      chance sur huit que ce soit fortuit. Zéro faux positif, mais
//      c'est de l'ajustement tant qu'un troisième cas ne l'a pas testé.
//   +4 (front) — le cinquième nul, FortMajConj, est en même boucle à
//      +4. Élargir la première porte à {+2, +4} le rattrapait.
//      ⚠️ MISE À JOUR DU 29/08 AU SOIR : +4 n'est plus une case pure.
//      TristPop, dont les mères ont été corrigées, y tombe aussi et n'est
//      PAS un nul (3-2 pour R7). La case +4 fait donc 1 nul sur 2, et
//      c'est le second faux positif de la porte. Elle reste dans la
//      règle parce que la coupure {+2,+4,+6} / au-delà tient toujours
//      sans exception (5 nuls sur 5 dedans, 0 sur 9 dehors) — mais elle
//      coûte, et le croisement avec la maison cadente est ce qui la
//      rattrape : les deux faux positifs ont R1 hors cadente.
function nulDeuxPortesV7(theme) {
  var rot = null;
  try { rot = getRotationCombat(theme); } catch (e) { return null; }
  if (!rot || !rot.figR1 || !rot.figR7) return null;
  var i1 = FIGS_V7.indexOf(rot.figR1), i7 = FIGS_V7.indexOf(rot.figR7);
  if (i1 < 0 || i7 < 0) return null;
  var k = (((i7 - i1) % 16) + 16) % 16;
  var meme = (k % 2 === 0);
  var oui = false, force = 'aucun', porte, detail;
  if (meme) {
    porte = 'même boucle';
    if (k === 2 || k === 4 || k === 6) { oui = true; force = 'ÉTABLIE';
      detail = 'R7 est à ' + k + ' pas devant R1 — dans l\'arc proche (2, 4 ou 6), où tombent TOUS les nuls de même boucle'; }
    else if (k === 8 || k === 10) {
      detail = 'R7 est trop loin devant (+' + k + ', ' + (k === 8 ? 'front du front' : 'bouclier') + ') — 0 nul sur 5 cas'; }
    else if (k === 12 || k === 14) {
      detail = 'sens inverse : c\'est R1 qui est le ' + (k === 12 ? 'front' : 'binôme') + ' de R7 — 0 nul sur 4 cas'; }
    else { detail = 'décalage +' + k; }
  } else {
    porte = 'boucles opposées';
    if (k === 11) { oui = true; force = 'EN PROBATION';
      detail = 'R7 est le front du front de la victime de R1 — 2 tirs, 2 nuls, mais 15,4 % de chance au hasard'; }
    else { detail = 'décalage +' + k + ' — la porte de cette branche est +11'; }
  }
  return { porte: porte, k: k, memeBoucle: meme, oui: oui, force: force, detail: detail };
}

// ═══════════════════════════════════════════════════════════════
// LA DÉCISION DU NUL, EN UN SEUL ENDROIT (29/08/26)
//
// « Fusionne les deux calculs de nulActif en un seul » (Ellemine_D).
// Fait, et c'était nécessaire : le nul était décidé DEUX FOIS, par du
// code dupliqué — une fois dans getVerdictAfficheReel (ce que mesure le
// banc), une fois dans le rendu (ce que voit l'écran). Le 29/08 les
// portes n'avaient été branchées que dans le premier : le banc annonçait
// 21/30 pendant que l'écran désignait encore un vainqueur sur les quatre
// nuls. Il n'y a plus qu'un seul endroit où le nul se décide.
//
// LA CLAUSE EN TROP QUE PORTAIT LE RENDU. Le rendu ajoutait un repli :
// « si le réseau dit Nul et qu'aucun autre moteur ne tranche, alors
// nul ». Vérifié EXHAUSTIVEMENT : sur les 65 536 thèmes possibles,
// reseauF4P4V7 ne renvoie JAMAIS winner === 'Nul'. C'était du code mort.
// Retiré — sa suppression ne change aucun verdict, et 430 thèmes ont été
// comparés moteur contre écran avant et après : 0 divergence.
//
// Les deux constantes historiques restent lues ici, et restent à false :
// STRUCTURE_NUL_DECISIVE (structureDuNul : 1 nul sur 5) et
// AXE_SUCCEDENT_DECISIF. Elles n'ont jamais mérité le volant.
// ═══════════════════════════════════════════════════════════════
// LE SIÈGE ET LA PORTE — deux signaux indépendants (29/08/26)
//
// « Pourquoi si R1 en M3 et R7 en M9, ou R1 en M6 et R7 en M12, il y a
// nul le plus souvent ? Tu peux fouiller. » (Ellemine_D)
//
// Fouillé. Sa question désigne exactement les deux configurations où
// R1 ET R7 sont tous les deux en maison cadente : comme R7 tombe
// toujours six maisons après R1, M3→M9 et M6→M12 gardent les deux
// centrales dans les cadentes, tandis que M9→M15 et M12→M2 en font
// sortir R7. L'intuition est juste, la conclusion ne l'est pas :
//   R1 en M3 ou M6 — LES DEUX en cadente ..... 2 nuls / 5 cas · 40 %
//   R1 en M9 ou M12 — R1 seul en cadente ..... 2 nuls / 3 cas · 67 %
// Que les deux centrales soient cadentes n'ajoute rien. Les quatre
// maisons cadentes se valent, et c'est la cadence de R1 seule qui parle.
//
// CE QUI PARLE VRAIMENT, C'EST LE CROISEMENT. En croisant le siège de
// R1 avec la porte du nul, sur les 30 cas au camp connu :
//   porte OUVERTE + R1 cadent .... 4 nuls / 4 cas .... 100 %
//   porte OUVERTE, R1 non cadent . 1 nul  / 2 cas ..... 50 %
//   porte fermée,  R1 cadent ..... 0 nul  / 4 cas ...... 0 %
//   porte fermée,  R1 non cadent . 0 nul  / 20 cas ..... 0 %
// Aucun des deux ne suffit seul : la maison cadente sans la porte ne
// donne AUCUN nul sur quatre cas, et la porte sans la maison en donne
// un sur deux. Ensemble, quatre sur quatre.
//
// ET ILS SONT INDÉPENDANTS, ce qui est la raison pour laquelle les
// croiser paie. Vérifié sur les 65 536 thèmes possibles : la porte
// s'ouvre dans 18,8 % des thèmes quand R1 est en maison cadente, et
// 18,4 % en moyenne toutes maisons confondues. La maison ne change
// donc pas la probabilité que la porte s'ouvre — les deux signaux
// mesurent des choses différentes.
//
// LA LECTURE, en une phrase : le nul vient quand une centrale MAL
// ASSISE (maison cadente, la plus faible) fait face à une figure QUI
// N'EST PAS UNE VRAIE ADVERSAIRE (un rôle de son propre camp en même
// boucle, ou le pôle lointain de sa proie en boucles opposées).
// Faiblesse du siège ET absence d'adversité. Ni l'une ni l'autre seule.
//
// ⚠️ Quatre cas sur quatre, ce n'est pas une loi — c'est le meilleur
// croisement de l'archive, sur quatre nuls. Il n'est PAS branché au
// verdict : le nul continue d'être imposé par la porte seule
// (nulParPorteV7), qui attrape les cinq nuls dont CarcAlbus, lequel
// n'est pas cadent. Ajouter la maison en condition ferait perdre ce
// nul-là. Le croisement sert à SAVOIR À QUEL POINT y croire, pas à
// décider — voir niveauNulV7 juste en dessous.
// ─── RÉVISÉ LE 29/08/26 : LA PAIRE, PAS LA CATÉGORIE ───
// « J'insiste sur les positions de R1 et R7, dans deux maisons position »
// (Ellemine_D). Lues comme PAIRE — et R7 tombant toujours six maisons
// après R1, la paire est fixée par R1 — les six cas où la porte s'ouvre
// donnent ceci :
//   M 9→M15  R1 cadente    R7 autre        NUL   Roma
//   M 6→M12  R1 cadente    R7 cadente      NUL   AmisPuer
//   M 3→M 9  R1 cadente    R7 cadente      NUL   CaputPuella
//   M12→M 2  R1 cadente    R7 autre        NUL   FortMajConj
//   M10→M16  R1 ANGULAIRE  R7 autre        NUL   CarcAlbus
//   M 1→M 7  R1 ANGULAIRE  R7 ANGULAIRE   pas nul  PuerCaput
// Le SEUL cas où la porte se trompe est le seul où LES DEUX SIÈGES sont
// angulaires. Deux centrales aux maisons les plus fortes : quelqu'un
// gagne, même entre alliées. C'est le complément exact de la lecture
// cadente — faiblesse d'un côté, force de l'autre.
//   porte seule ............................ 5 nuls / 6 tirs ·  83 %
//   porte + R1 cadent (ancien) ............. 4 nuls / 4 tirs · 100 % · rate CarcAlbus
//   porte SAUF deux sièges angulaires ...... 5 nuls / 5 tirs · 100 % · ne rate rien
// La nouvelle condition est aussi BEAUCOUP plus légère : exiger la
// cadence écartait 75 % des thèmes ; exclure les deux sièges angulaires
// n'en écarte que 12,5 % (seules les paires M1→M7 et M4→M10 le sont).
//
// ⚠️ L'exclusion repose sur UN seul cas, PuerCaput. C'est une condition
// étroite avec un sens clair, pas une liste ajustée — mais un second
// nul en paire angulaire↔angulaire la tuerait. Le fichier le dira.
function niveauNulV7(theme) {
  var rot = null;
  try { rot = getRotationCombat(theme); } catch (e) { return null; }
  if (!rot || !rot.hR1) return null;
  // ☠️ L'EXCLUSION « LES DEUX SIÈGES ANGULAIRES » EST MORTE (29/08/26 soir).
  // Elle reposait sur UN seul cas, PuerCaput. Le nul 0-0 d'aujourd'hui,
  // tiré deux fois, a donné PuerFortMaj : R1 = Puer en M1, R7 = Rubeus en
  // M7, LES DEUX ANGULAIRES, et c'est un nul. L'exclusion est donc à
  // 1 juste et 1 fausse — un pile ou face. Retirée.
  var porte = nulParPorteV7(theme);
  var cadent = [3, 6, 9, 12].indexOf(rot.hR1) >= 0;
  if (porte) return { niveau: 'MAXIMAL', taux: 73, sur: 11,
    detail: 'porte ouverte, paire M' + rot.hR1 + '→M' + rot.hR7
      + ' — 8 nuls sur 11 déclenchements dans l\'archive'
      + (cadent ? ' (R1 en cadente)' : '') };
  // ⚠️ Cette case était à 0 nul sur 5 jusqu'au 30/08. FortMajTrist l'a
  // ouverte : R1 cadent en M12, porte fermée, et le match a fait 1-1.
  if (cadent) return { niveau: 'faible', taux: 13, sur: 8,
    detail: 'R1 en maison cadente mais porte fermée — 1 nul sur 8' };
  return { niveau: 'aucun', taux: 0, sur: 23,
    detail: 'ni porte ouverte ni maison cadente — 0 nul sur 23' };
}

// ═══════════════════════════════════════════════════════════════
// L'ÉCHELLE DU MATCH, SOURCE UNIQUE (30/08/26)
//
// ☠️ LE BANC NOTAIT LES CAS E-SPORT SUR L'ÉCHELLE DU FOOTBALL RÉEL.
// L'échelle était lue directement dans le menu « Format du match » de la
// page — à deux endroits, scoreAfficheV7 et la calibration du score.
// Or le banc REJOUE des cas archivés, chacun avec son propre format
// (champ esport), pendant que le menu reste sur ce que l'utilisateur y a
// laissé. Constaté : AmisPuer, nul e-sport réel 4-4, était rejoué en
// « 0-0 » ; City/Madrid, e-sport 7-4, en « 1-0 ». Cinq cas sur 37 notés
// sur la mauvaise échelle, et l'échelle e-sport n'était en pratique
// jamais éprouvée.
//
// formatMatchV7() est désormais la seule lecture du format, et
// avecFormatV7() permet au banc d'imposer celui du cas rejoué le temps
// de l'évaluation. Sauvegarde et restauration, donc réentrant : un appel
// imbriqué ne casse pas le format de l'appelant.
var _formatReplayV7 = null;
function formatMatchV7() {
  if (_formatReplayV7) return _formatReplayV7;
  try {
    var f = document.getElementById('matchFormat');
    return (f && f.value) ? f.value : 'reel';
  } catch (e) { return 'reel'; }
}
function avecFormatV7(fmt, fn) {
  var avant = _formatReplayV7;
  _formatReplayV7 = fmt || null;
  try { return fn(); } finally { _formatReplayV7 = avant; }
}

// Le score AFFICHÉ, source unique. Quand le nul est imposé, la carte ne
// le sait pas — nulActif se décide en dehors de buildVerdictCard — et
// elle continuait de sortir un score décidé. Constaté au navigateur sur
// 330 thèmes : « ⚖️ NUL À VÉRIFIER » affiché au-dessus d'un « 0-1 ».
// Un match donné pour nul s'écrit 0-0, avec 1-1 en alternative
// (l'ordre a été inversé le 30/08, voir la mesure dans scoreAfficheV7).
// ─── MODE LIVE : LE SCORE ET LE TEMPS ÉCOULÉ SONT ENFIN LUS (03/09/26) ───
// Avant cette maintenance, les deux champs du mode "Live" (#matchElapsedMinutes,
// #matchLiveScore) s'affichaient et se saisissaient mais n'étaient lus par
// AUCUNE ligne du fichier (constaté le 28/08/26, cf. commentaire historique
// près de toggleDrawMode) : un thème tiré à la mi-temps d'un match mené 1-0
// était analysé exactement comme un thème d'avant-match.
//
// Il n'existe aucune doctrine géomantique d'Ellemine_D validée sur la façon
// dont un score déjà connu doit influencer la lecture d'un thème — à la
// différence de chaque autre règle de ce fichier, qui n'est écrite qu'après
// mesure sur l'archive des matchs réels. Inventer ici une règle doctrinale
// (« tel score impose tel camp ») serait donc malhonnête : ce n'est pas
// fait. On se limite à deux choses vérifiables qui ne demandent aucune
// doctrine nouvelle :
//   1) COHÉRENCE — si le camp donné vainqueur par le thème contredit le
//      camp actuellement mené au score avec peu de temps restant, c'est
//      SIGNALÉ, jamais corrigé : le fichier n'a aucune règle pour arbitrer
//      entre les deux.
//   2) PLANCHER DE SCORE — le score final affiché ne peut pas être inférieur
//      au score déjà acquis (un but marqué ne se retire pas) ; les buts que
//      le thème prédisait encore sont ajoutés par-dessus, réduits selon la
//      part du match qui reste à jouer.
// Statut : nouveau, NON validé empiriquement — contrairement au reste du
// moteur, qui ne s'écrit qu'après preuve sur l'archive réelle des matchs.
function getLiveMatchState(){
  var modeEl = document.getElementById('drawMode');
  if(!modeEl || modeEl.value !== 'live') return null;
  var scoreEl = document.getElementById('matchLiveScore');
  var m = scoreEl ? String(scoreEl.value||'').match(/^\s*(\d+)\s*-\s*(\d+)\s*$/) : null;
  if(!m) return null;
  var minEl = document.getElementById('matchElapsedMinutes');
  var minutesRaw = minEl ? parseInt(minEl.value, 10) : NaN;
  return {
    minutes: isNaN(minutesRaw) ? null : Math.max(0, Math.min(130, minutesRaw)),
    g1: parseInt(m[1], 10), g2: parseInt(m[2], 10)
  };
}
function appliquerEtatLiveV7(card, theme){
  if(!card) return card;
  var live = getLiveMatchState();
  if(!live) return card;
  card.liveState = live;
  var leaderLive = live.g1 > live.g2 ? 'M1' : live.g2 > live.g1 ? 'M7' : 'Nul';
  // card.winner est exprimé dans le référentiel de la carte (M1/M7 pour la
  // carte fixe, R1/R7 pour la carte rotation) — R1 vaut toujours M1 et R7
  // vaut toujours M7 côté vainqueur (cf. renderProtocoleVerdictPrincipal).
  var winnerCampM = card.winner==='R1' ? 'M1' : card.winner==='R7' ? 'M7' : card.winner;
  var minutesRestantes = live.minutes==null ? null : Math.max(0, 90 - live.minutes);
  if(winnerCampM && leaderLive!=='Nul' && winnerCampM!==leaderLive && minutesRestantes!=null && minutesRestantes<=15){
    card.liveContradiction = 'le direct donne '+(leaderLive==='M1'?'l\'équipe 1':'l\'équipe 2')+' devant ('+live.g1+'-'+live.g2+') à '+minutesRestantes+' min de la fin, le thème donne '+(winnerCampM==='M1'?'l\'équipe 1':winnerCampM==='M7'?'l\'équipe 2':'le nul')+' — aucune règle du fichier ne permet de trancher entre les deux.';
  }
  var mScore = String(card.scoreMain||'').match(/^(\d+)-(\d+)$/);
  if(mScore){
    var predG1 = parseInt(mScore[1],10), predG2 = parseInt(mScore[2],10);
    var frac = live.minutes==null ? 1 : Math.max(0, Math.min(1, (90-live.minutes)/90));
    var addG1 = Math.round(Math.max(0, predG1-live.g1)*frac);
    var addG2 = Math.round(Math.max(0, predG2-live.g2)*frac);
    var finalG1 = live.g1+addG1, finalG2 = live.g2+addG2;
    card.scoreMain = finalG1+'-'+finalG2;
    if(card.scoreAlt){
      card.scoreAlt = Math.max(finalG1-1,live.g1)+'-'+Math.max(finalG2-1,live.g2);
    }
  }
  return card;
}
function scoreAfficheV7(card, nulActif) {
  if (!card) return { main: '—', alt: '—' };
  if (nulActif) {
    // Le nul suit l'échelle du format, comme le reste du score : un nul
    // d'arcade s'écrit 4-4 (AmisPuer, le seul de l'archive, a fini 4-4),
    // un nul de football réel 0-0 (voir la mesure juste en dessous).
    var esp = (formatMatchV7() === 'esport');
    // ─── 0-0 PASSE DEVANT 1-1 (30/08/26) ───
    // Le nul imposé sortait 1-1, avec 0-0 en alternative. La correction
    // du score du 30/08 (3-3, pas 1-1) a fait relire les neuf nuls de
    // l'archive, et leur distribution ne soutient pas ce choix :
    //   football réel (7 nuls au score connu) :
    //     0-0 ... 3 fois       2-2 ... 1 fois
    //     1-1 ... 1 fois       3-3 ... 2 fois
    //   e-sport (1 nul) : 4-4
    // Ellemine_D a confirmé le 30/08 que le match à 3-3 est du football
    // RÉEL. Sur l'échelle réelle, le 1-1 imposé tombait donc juste 1 fois
    // sur 7 et le 0-0 en prend 3. L'échelle e-sport (4-4 / 3-3) garde son
    // seul cas connu et ne bouge pas.
    // ⚠️ Ça ne veut pas dire qu'un nul est un 0-0 : la moitié des nuls
    // de l'archive ont au moins deux buts par équipe. Ça veut dire que
    // le score le PLUS FRÉQUENT est 0-0, et qu'un score imposé n'a rien
    // de mieux à offrir qu'un mode. L'ampleur d'un nul n'est pas prédite
    // par ce fichier — c'est écrit ici pour qu'on ne l'oublie pas.
    // ─── LE NUL IMPOSÉ RESPECTE LE BTTS AUSSI (30/08/26) ───
    // Sinon la carte pouvait afficher « Les deux marquent : Oui » sur un
    // « 0-0 » — la même contradiction que du côté du score décidé.
    // Sur les nuls de l'archive : sans BTTS, 0-0 trois fois sur trois ;
    // avec BTTS, 3-3 ×2, 1-1 ×1, 2-2 ×1 — on prend le minimum compatible,
    // 1-1, pour ne rien devoir à quatre cas.
    var _deuxNul = (card.btts === true);
    if (esp) return _deuxNul ? { main: '4-4', alt: '3-3' } : { main: '0-0', alt: '1-1' };
    return _deuxNul ? { main: '1-1', alt: '2-2' } : { main: '0-0', alt: '1-1' };
  }
  return { main: card.scoreMain || '—', alt: card.scoreAlt || '—' };
}

function nulParPorteV7(theme) {
  var d = null;
  try { d = nulDeuxPortesV7(theme); } catch (e) { return false; }
  if (!d) return false;
  return NUL_PORTE_ELARGIE_V7
    ? d.oui
    : (d.memeBoucle ? d.k === 2 : d.k === 11);
  // (d.oui couvre désormais {+2, +4, +6} en même boucle et +11 en
  //  boucles opposées — voir nulDeuxPortesV7.)
}

// ─── LE CROISEMENT EST AU VOLANT (29/08/26, demande d'Ellemine_D) ───
// Le nul n'est plus imposé par la porte seule : il faut la porte OUVERTE
// ET R1 en maison cadente — le niveau MAXIMAL de niveauNulV7.
// Les deux branchements font le même score, avec des profils opposés :
//   porte seule ..... 22/30 · dit nul 6 fois, juste 5 ·  83 % · 1 FAUX nul
//   CROISEMENT ...... 22/30 · dit nul 4 fois, juste 4 · 100 % · 1 nul raté
// À score égal on prend celui qui ne se trompe jamais quand il parle :
// quand le fichier annonce NUL, il ne l'a jamais annoncé à tort. Le prix
// est CarcAlbus (0-0, R1 en M10 angulaire) qui n'est plus imposé — mais
// il n'est pas perdu pour autant : le niveau « fort » (porte ouverte
// sans la cadence) déclenche une ALERTE affichée à côté du vainqueur.
// Le verdict reste tranché, l'avertissement est là.
// Repasser à la porte seule : NUL_CROISEMENT_V7 = false.
var NUL_CROISEMENT_V7 = true;

// L'UNIQUE décision de nul du fichier. Tout ce qui affiche ou mesure un
// verdict doit passer par elle — ne jamais réécrire ce test ailleurs.
function nulActifV7(theme, structureNul, nulAxe) {
  var parLeNul = false;
  if (NUL_CROISEMENT_V7) {
    var niv = null;
    try { niv = niveauNulV7(theme); } catch (e) { niv = null; }
    parLeNul = !!(niv && niv.niveau === 'MAXIMAL');
  } else {
    parLeNul = nulParPorteV7(theme);
  }
  // La seconde porte n'impose le nul que si elle est branchée. Elle ne
  // l'est pas par défaut (−3 points de justesse, cf. SECONDE_PORTE_NUL_V7),
  // mais elle est affichée dès qu'elle contredit celle-ci : c'est le choix
  // d'Ellemine_D, pas le mien, et il se prend avec les chiffres à l'écran.
  var parSeconde = false;
  try {
    if (BRANCHES_V7 && BRANCHES_V7.nul_seconde_porte && BRANCHES_V7.nul_seconde_porte.actif) {
      var sp = secondePorteNulV7(theme);
      parSeconde = !!(sp && sp.secondePorte);
    }
  } catch (e) { parSeconde = false; }
  return !!(parLeNul || parSeconde
    || (STRUCTURE_NUL_DECISIVE && structureNul && structureNul.nulDetecte)
    || (AXE_SUCCEDENT_DECISIF && nulAxe && nulAxe.confirmed));
}

// ═══════════════════════════════════════════════════════════════
// LA SECONDE PORTE DU NUL — celle qu'on avait jetée, et qui a eu
// raison le 22/02/2026 (écrit le 05/09/26)
// ═══════════════════════════════════════════════════════════════
//
// Ce que le match Laetitia/Fortuna Minor/Amissio/Via a montré : 3-3,
// et la règle BRANCHÉE (les deux portes) a dit « pas de nul » pendant
// que structureDuNul — DÉBRANCHÉE le 24/08 pour n'avoir trouvé qu'un
// nul sur cinq — voyait le nul par OPPOSITION. La règle qu'on garde
// s'est trompée, celle qu'on a jetée avait raison.
//
// Les deux règles rejouées sur les 57 cas au camp connu (13 nuls réels,
// base 22,8 %) — la deuxième porte n'est PAS un doublon de la première,
// elles attrapent des nuls DIFFÉRENTS :
//
//   règle                          annonce  justes  faux  ratés  justesse
//   deux portes (branchée) ......    13       8      5     5      82,5 %
//   structureDuNul (débranchée) .    11       4      7     9      71,9 %
//   opposition seule ............     8       3      5    10      73,7 %
//   UNION portes OU opposition ..    20      10     10     3      77,2 %
//
// ⚖️ LE CHOIX N'EST PAS À MOI. Brancher l'union attrape 10 nuls sur 13
// au lieu de 8 — mais annonce 10 faux nuls au lieu de 5, et la JUSTESSE
// GLOBALE TOMBE de 82,5 % à 77,2 %. Sur le critère « avoir raison le
// plus souvent », c'est un recul de 3 points : je ne la branche pas.
// Sur le critère « ne pas rater un nul », c'est +2 nuls sur 13.
// Ces deux critères ne sont pas le même, et le second n'est pas le
// mien à trancher. D'où ce qui suit : la seconde porte est CALCULÉE et
// AFFICHÉE à chaque fois qu'elle contredit la porte branchée, avec ses
// chiffres rejoués sur la base courante. Un booléen la branche.
//
// ⚠️ HONNÊTETÉ SUR LA MESURE : ces chiffres incluent le match du 22/02
// qui a fait poser la question. Sur 56 cas sans lui, l'union faisait
// 9 nuls sur 12 pour 10 faux. L'écart de justesse ne vient donc pas
// de ce cas — mais le fait que je regarde ici, si.
var SECONDE_PORTE_NUL_V7 = {
  gelees: { n: 57, nuls: 13, base: 22.8,
    portes: { annonce: 13, justes: 8, faux: 5, rates: 5, justesse: 82.5 },
    structure: { annonce: 11, justes: 4, faux: 7, rates: 9, justesse: 71.9 },
    opposition: { annonce: 8, justes: 3, faux: 5, rates: 10, justesse: 73.7 },
    union: { annonce: 20, justes: 10, faux: 10, rates: 3, justesse: 77.2 } },
  cout: 'l\'union attrape 2 nuls de plus sur 13 et annonce 5 faux nuls de plus ; '
    + 'la justesse globale passe de 82,5 % à 77,2 %',
  pourLActiver: 'BRANCHES_V7.nul_seconde_porte.actif = true'
};

// La seconde porte, calculée à part de la première.
function secondePorteNulV7(theme) {
  if (!theme) return null;
  var sd = null, dp = null;
  try { sd = structureDuNul(theme); } catch (e) { return null; }
  try { dp = nulDeuxPortesV7(theme); } catch (e) { dp = null; }
  if (!sd) return null;
  // LA SECONDE PORTE EST L'OPPOSITION SEULE, pas structureDuNul entière.
  // C'est l'opposition qui a vu le nul du 22/02, et c'est elle seule qui a
  // été mesurée. L'identité est une TROISIÈME porte, plus faible (1 juste
  // pour 2 faux sur 57 cas) : elle est renvoyée pour information, elle
  // n'ouvre rien. Sans cette séparation, le compteur affichait le coût de
  // l'identité en plus (−7,1 points au lieu de −5,3) sous le nom de la
  // règle qu'on discute.
  var ouverte = !!sd.nulParOpposition, ident = !!sd.nulParIdentite;
  var portesOui = !!(dp && dp.oui);
  return { opposition: ouverte, identite: ident, secondePorte: ouverte,
    premierePorte: portesOui,
    contredit: ouverte && !portesOui,
    juge1: sd.juge1, juge2: sd.juge2, sentence: sd.sentence,
    reconstruction: sd.reconstruction,
    lecture: ouverte ? 'nul par OPPOSITION des deux témoins'
      : 'la seconde porte est fermée' };
}

// Les deux portes rejouées sur la base courante — mémoïsée, elle calcule
// deux lectures par cas et le panneau l'appelle à chaque verdict.
var _CACHE_PORTES_V7 = null;
function comparerPortesNulV7() {
  var CAS = [];
  try { CAS = (tousCasBancV7() || []).filter(function (c) { return c.camp && c.meres; }); }
  catch (e) { return null; }
  if (_CACHE_PORTES_V7 && _CACHE_PORTES_V7.cle === CAS.length) return _CACHE_PORTES_V7.val;
  var n = 0, nuls = 0;
  var P = { j: 0, f: 0, r: 0 }, S = { j: 0, f: 0, r: 0 }, U = { j: 0, f: 0, r: 0 };
  CAS.forEach(function (c) {
    var t; try { t = calcTheme(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    var sp; try { sp = secondePorteNulV7(t); } catch (e) { return; }
    if (!sp) return;
    var vrai = c.camp === 'nul';
    n++; if (vrai) nuls++;
    var p = sp.premierePorte, s = sp.secondePorte, u = p || s;
    [[p, P], [s, S], [u, U]].forEach(function (x) {
      if (x[0] && vrai) x[1].j++; else if (x[0] && !vrai) x[1].f++; else if (!x[0] && vrai) x[1].r++;
    });
  });
  if (!n) { _CACHE_PORTES_V7 = { cle: CAS.length, val: null }; return null; }
  var pct = function (o) { return Math.round(1000 * (n - o.f - o.r) / n) / 10; };
  var val = { n: n, nuls: nuls, base: Math.round(1000 * nuls / n) / 10,
    portes: { annonce: P.j + P.f, justes: P.j, faux: P.f, rates: P.r, justesse: pct(P) },
    seconde: { annonce: S.j + S.f, justes: S.j, faux: S.f, rates: S.r, justesse: pct(S) },
    union: { annonce: U.j + U.f, justes: U.j, faux: U.f, rates: U.r, justesse: pct(U) },
    gainNuls: U.j - P.j, coutFaux: U.f - P.f, gainJustesse: pct(U) - pct(P) };
  _CACHE_PORTES_V7 = { cle: CAS.length, val: val };
  return val;
}

// L'alerte : la porte est ouverte mais R1 n'est pas en maison cadente.
// Un nul sur deux dans cette situation (CarcAlbus 0-0 oui, PuerCaput
// non). Le verdict n'est PAS suspendu — c'est un avertissement.
function alerteNulV7(theme) {
  var niv = null;
  try { niv = niveauNulV7(theme); } catch (e) { return false; }
  return !!(niv && niv.niveau === 'fort');
}

// Taux de déclenchement exacts des sept signaux du faisceau, obtenus
// par énumération des 65536 thèmes (05/09/26). Constantes du système.
// `fige` vaut 50 % et non 25 % à cause de la loi de parité : M15 ne
// peut porter que huit figures, et les quatre symétriques sont toutes
// paires — voir LOIS_PARITE_V7.
var TAUX_BASE_FAISCEAU_V7 = { cadente: 0.2500, binome: 0.0742, boucle: 0.5000,
  partage: 0.3984, juge: 0.1387, fige: 0.5000, structure: 0.2500 };

function faisceauNulV7(theme) {
  var rot = null;
  try { rot = getRotationCombat(theme); } catch (e) { return null; }
  if (!rot || !rot.figR1 || !rot.figR7) return null;
  function campDe(X) {
    return [X, BOUCLIER_V7[X], FRONT_V7[X], BINOMES_V7[X], frontDuFrontV7(X)];
  }
  var c1 = campDe(rot.figR1), c7 = campDe(rot.figR7);
  var part = c1.filter(function (x) { return c7.indexOf(x) >= 0; });
  var i1 = FIGS_V7.indexOf(rot.figR1), i7 = FIGS_V7.indexOf(rot.figR7);
  var k = (i1 < 0 || i7 < 0) ? null : ((((i7 - i1) % 16) + 16) % 16);
  var FIGE = { populus: 1, carcer: 1, via: 1, conjunctio: 1 };
  var structure = false;
  try { var sn = structureDuNul(theme); structure = !!(sn && sn.nulDetecte); } catch (e) { structure = false; }
  var signaux = [
    { cle: 'cadente', nom: 'R1 en maison cadente', on: [3, 6, 9, 12].indexOf(rot.hR1) >= 0,
      detail: 'R1 en M' + rot.hR1 },
    { cle: 'binome', nom: 'R7 est le binôme de R1', on: k === 2, detail: 'décalage +' + k },
    { cle: 'boucle', nom: 'R1 et R7 dans la même boucle', on: k !== null && k % 2 === 0,
      detail: k % 2 ? 'boucles opposées' : 'même boucle' },
    { cle: 'partage', nom: 'les camps partagent 3 rôles ou plus', on: part.length >= 3,
      detail: part.length + '/5 rôles partagés' },
    { cle: 'juge', nom: 'le juge M15 appartient aux deux camps',
      on: part.indexOf(theme[15]) >= 0, detail: 'juge ' + (FL[theme[15]] || theme[15]) },
    { cle: 'fige', nom: 'M15 est une des quatre symétriques', on: !!FIGE[theme[15]],
      detail: FL[theme[15]] || theme[15] },
    { cle: 'structure', nom: 'structure du nul (M13 = M14 ou équilibre)', on: structure,
      detail: structure ? 'détectée' : 'aucune' }
  ];
  // ── LES SEPT SIGNAUX N'ONT PAS LA MÊME RARETÉ (05/09/26) ──
  // Taux mesurés par ÉNUMÉRATION EXHAUSTIVE des 65536 thèmes, pas sur
  // l'archive : ce sont des constantes du système, pas des estimations.
  //   même boucle              50,00 %      symétriques (fige)  50,00 %
  //   3 rôles partagés         39,84 %      R1 cadente          25,00 %
  //   structure du nul         25,00 %      juge des deux camps 13,87 %
  //   R7 binôme de R1           7,42 %
  // Le compte n/7 les additionne à poids égal. Un signal qui tombe une
  // fois sur deux y pèse donc autant qu'un qui tombe une fois sur
  // treize, et deux thèmes à « 3 sur 7 » peuvent être sans rapport.
  // On ne touche PAS au compte — le verdict continue de s'appuyer
  // dessus — mais on publie à côté de quoi il est fait.
  signaux.forEach(function (x) { x.tauxBase = TAUX_BASE_FAISCEAU_V7[x.cle]; });
  var n = signaux.filter(function (x) { return x.on; }).length;
  // Rareté du tirage, en bits : -log2(taux) sommé sur les signaux
  // allumés. Ce n'est PAS une prédiction de nul, c'est une mesure de
  // combien la configuration est inhabituelle.
  var bits = 0;
  signaux.forEach(function (x) {
    if (x.on && x.tauxBase) bits += -Math.log(x.tauxBase) / Math.LN2; });
  // Compte restreint aux signaux dont le taux n'est pas exactement
  // 50 % — critère décidé sur le calcul exhaustif SEUL, sans regarder
  // un seul résultat. Il retire `boucle` et `fige`. Publié en piste,
  // pas encore utilisé par le verdict : voir PISTES_V7.
  var nElague = signaux.filter(function (x) {
    return x.on && x.tauxBase !== 0.5; }).length;
  // ─── L'ÉCHELLE EST CALCULÉE, PLUS ÉCRITE À LA MAIN (29/08/26) ───
  // Elle était figée : { 0:0, 1:13, 2:21, 3:25, 4:40, 5:67, 6:100, 7:100 },
  // mesurée sur 29 cas. À 35 cas elle était fausse partout — elle annonçait
  // 40 % à 4 signaux quand l'archive disait 0 sur 2, et 0 % à 0 signal
  // quand un nul y était tombé. Un chiffre à la main vieillit à chaque
  // match ajouté ; celui-ci se recalcule.
  var pr = precisionFaisceauV7();
  var cell = pr.table[n] || { n: 0, nul: 0 };
  var cum = { n: 0, nul: 0 };
  Object.keys(pr.table).forEach(function (k) {
    if (+k >= n) { cum.n += pr.table[k].n; cum.nul += pr.table[k].nul; }
  });
  var niveau = n >= 5 ? 'FORTE ALERTE' : (n >= 4 ? 'alerte' : (n >= 2 ? 'veille' : 'aucun signe'));
  return { n: n, sur: 7, signaux: signaux, niveau: niveau,
    bits: Math.round(bits * 100) / 100, nElague: nElague, surElague: 5,
    precision: cell.n ? Math.round(cell.nul * 100 / cell.n) : null,
    casNiveau: cell.n, nulsNiveau: cell.nul,
    precisionCumul: cum.n ? Math.round(cum.nul * 100 / cum.n) : null,
    casCumul: cum.n, nulsCumul: cum.nul,
    base: pr.base, baseCas: pr.total, baseNuls: pr.nuls,
    echelle: pr.table,
    allumes: signaux.filter(function (x) { return x.on; }).map(function (x) { return x.nom; }) };
}

// L'échelle du faisceau, mesurée sur l'archive au lieu d'être recopiée.
// ⚠️ Le cache est posé AVANT la boucle exprès : faisceauNulV7 appelle
// cette fonction, qui rappelle faisceauNulV7 sur chaque cas d'archive.
// Le cache vide sert de fond de récursion — les appels internes reçoivent
// une table vide et une précision nulle, ce qui ne les gêne pas puisque
// seul leur compte de signaux est lu ici.
var _cacheFaisceauPrecV7 = null;
function precisionFaisceauV7() {
  if (_cacheFaisceauPrecV7) return _cacheFaisceauPrecV7;
  _cacheFaisceauPrecV7 = { table: {}, base: 0, total: 0, nuls: 0 };
  var tab = {}, tot = 0, nuls = 0;
  try {
    tousCasBancV7().forEach(function (c) {
      if (!c.camp) return;
      var t = buildThemeFromMothers(c.meres[0], c.meres[1], c.meres[2], c.meres[3]);
      var f = faisceauNulV7(t);
      if (!f) return;
      tab[f.n] = tab[f.n] || { n: 0, nul: 0 };
      tab[f.n].n += 1; tot += 1;
      if (c.camp === 'nul') { tab[f.n].nul += 1; nuls += 1; }
    });
  } catch (e) { /* archive indisponible : on garde la table vide */ }
  _cacheFaisceauPrecV7 = { table: tab, total: tot, nuls: nuls,
    base: tot ? Math.round(nuls * 100 / tot) : 0 };
  return _cacheFaisceauPrecV7;
}

var MOTEURS_NUL_V7 = [
  // ─── LA FUSION DES ÉLÉMENTS COMME LECTURE DU NUL (31/08/26) ───
  // Ellemine_D, après AmisPuer : « cette lecture est adéquate au résultat
  // du nul, alors soit on en fait un moteur, soit tu le fusionnes au
  // moteur similaire. » Les deux ont été mesurés avant d'être branchés,
  // et c'est le premier qui entre — le second est refusé, mesure à
  // l'appui.
  //
  // L'IDÉE. Sur les axes M2/M8 et M6/M12, le camp doublé est gouverné par
  // l'élément qu'il PARTAGE avec l'adversaire, pas par son supplément :
  // sa force est celle que l'autre a aussi. AmisPuer est de ce type
  // (M6/M12, partagé Eau) et le match a fini 4-4. La lecture est belle.
  //
  // ☠️ ET ELLE EST MAUVAISE, SUR LES 29 CAS OÙ LE THÉORÈME S'APPLIQUE :
  //     dominant = partagé → nul ......... 17/29   59 %
  //     témoin « jamais nul » ............ 23/29   79 %
  // Elle attrape 3 nuls, en rate 3, et lève 9 fausses alertes. Elle fait
  // vingt points de MOINS que de ne jamais annoncer de nul. AmisPuer
  // était un cas juste dans une lecture qui perd.
  //
  // ☠️ ET LA FUSION AVEC LA PORTE DU NUL ABÎME LA PORTE :
  //     porte du nul SEULE ............... 25/29   86 %
  //     porte ET dominant partagé ........ 24/29   83 %
  // La conjonction ne retire qu'une fausse alerte et coûte un vrai nul.
  // La meilleure lecture du nul de tout le fichier ressort dégradée. Je
  // ne fusionne donc pas : ce serait payer un chiffre en baisse pour une
  // idée qui, seule, est sous le témoin.
  //
  // Le moteur est ici parce que c'est sa place — le banc le note à côté
  // des autres, sur chaque nouveau cas, et il remontera tout seul s'il
  // avait raison. Il ne décide de rien.
  { cle: 'nul_fusion_partage', nom: 'Nul · le camp doublé est gouverné par l\'élément PARTAGÉ', icone: '🜄', teinte: '#22d3ee',
    juste: 0, total: 0, note: 'doctrine Ellemine_D (31/08) — 17/29 contre 23/29 pour « jamais nul » : sous le témoin, affiché et noté, branché sur rien',
    verdict: function (t) {
      var f = null;
      try { f = fusionElementV7(t); } catch (e) { return { oui: null, detail: 'théorème indisponible' }; }
      if (!f || f.anomalie) return { oui: null, detail: 'théorème non applicable (une maison hors des douze)' };
      return { oui: !f.domineParSonSupplement,
        detail: 'axe ' + f.axe + ' · partagé ' + (NOM_ELEMENT_V7[f.commun] || f.commun)
          + ' · dominant ' + (NOM_ELEMENT_V7[f.dominant] || f.dominant)
          + ' → ' + (f.domineParSonSupplement ? 'son supplément' : 'le PARTAGÉ') };
    } },
  { cle: 'nul_fusion_et_porte', nom: 'Nul · porte ouverte ET gouverné par le partagé', icone: '🜄', teinte: '#0ea5e9',
    juste: 0, total: 0, note: 'la fusion proposée le 31/08 : 24/29 contre 25/29 pour la porte SEULE — la conjonction dégrade, gardée pour que ça reste vérifiable',
    verdict: function (t) {
      var f = null;
      try { f = fusionElementV7(t); } catch (e) { return { oui: null, detail: 'théorème indisponible' }; }
      if (!f || f.anomalie) return { oui: null, detail: 'théorème non applicable' };
      var porte = false;
      try { porte = !!nulParPorteV7(t); } catch (e) { porte = false; }
      return { oui: porte && !f.domineParSonSupplement,
        detail: 'porte ' + (porte ? 'ouverte' : 'fermée') + ' · '
          + (f.domineParSonSupplement ? 'gouverné par son supplément' : 'gouverné par le PARTAGÉ') };
    } },
  { cle: 'nul_r1_cadente', nom: 'Nul · R1 tombe en maison cadente', icone: '⚖', teinte: '#fbbf24',
    juste: 0, total: 0, note: 'la maison seule : 4 nuls sur 7 attrapés, mais 5 faux positifs — 44 % de précision',
    verdict: function (t) {
      var rot = null;
      try { rot = getRotationCombat(t); } catch (e) { return { oui: null, detail: 'rotation indisponible' }; }
      if (!rot || !rot.hR1) return { oui: null, detail: 'rotation indisponible' };
      var cadente = [3, 6, 9, 12].indexOf(rot.hR1) >= 0;
      return { oui: cadente, detail: 'R1 en M' + rot.hR1 + (cadente ? ' (cadente)' : '') };
    } },
  { cle: 'nul_structure', nom: 'Nul · structure (M13=M14 ou paire d\'équilibre)', icone: '⚖', teinte: '#a78bfa',
    juste: 0, total: 0, note: 'le détecteur historique, débranché du verdict',
    verdict: function (t) {
      var s2 = null;
      try { s2 = structureDuNul(t); } catch (e) { return { oui: null, detail: 'indisponible' }; }
      return { oui: !!(s2 && s2.nulDetecte), detail: s2 && s2.nulParIdentite ? 'M13 = M14'
        : (s2 && s2.nulParOpposition ? 'M13/M14 en paire d\'équilibre' : 'aucun signal') };
    } },
  { cle: 'nul_juge_fige', nom: 'Nul · juge M15 figé (les 4 symétriques)', icone: '⚖', teinte: '#38bdf8',
    juste: 0, total: 0, note: 'Populus, Carcer, Via, Conjonctio — parle sur la moitié des thèmes : 2 nuls sur 7 pour 15 faux positifs, 12 % de précision',
    verdict: function (t) {
      var FIGE = { populus: 1, carcer: 1, via: 1, conjunctio: 1 };
      return { oui: !!FIGE[t[15]], detail: 'juge ' + (FL[t[15]] || t[15]) };
    } },
  // ── AJOUT DU 29/08/26, sur la théorie d'Ellemine_D ──────────────
  // « si c'est les natures des figures qui déterminent si c'est nul ou
  // pas, ou bien leur disposition d'équilibre […] R1 et R7 sont de
  // relation binôme en maison cadente M6 et M12 ».
  // Lu sur son thème AmisPuer (4-4) : R1 = Conjunctio en M6, R7 = Cauda
  // Draconis en M12, décalage +2, binôme. Exact.
  // ⚠️ MISE À JOUR DU 29/08/26 — PREMIER FAUX NÉGATIF. Le troisième nul,
  // CaputPuella 2-2, a R7 à +11 de R1 : boucles opposées, aucun binôme,
  // et les deux camps ne partagent AUCUN rôle (0/5) là où les deux
  // premiers nuls en partageaient trois. La règle est restée muette.
  // Elle ne crie donc pas à tort — elle se tait quand il faut parler :
  // 2 nuls sur 3, 1 faux positif, 25/27. Elle reste devant le témoin
  // (24/27) mais elle n'est plus « la » règle du nul : c'est LA MAISON
  // qui a tenu ce soir-là, pas la nature des figures.
  // Mesuré sur l'archive de l'époque (2 nuls) :
  //   relation R1→R7      nuls / cas au résultat connu
  //     +2  BINÔME ........ 2 / 3   ← les DEUX nuls y sont
  //     +1  ............... 0 / 6
  //     +10 bouclier ...... 0 / 4
  //     +9  ............... 0 / 3
  //     (huit autres relations) 0 nul
  //   même boucle (décalage pair) 2/11 · boucles opposées (impair) 0/15
  // Fréquence de base du binôme : 7,5 % des thèmes. Que les deux nuls
  // tombent dans une case qui ne contient que 3 des 26 cas vaut
  // C(3,2)/C(26,2) = 0,9 % au hasard.
  // Le sens est net : le binôme est la relation d'ALLIANCE la plus
  // proche. Deux centrales binômes ne sont pas des adversaires, et un
  // match entre alliés ne désigne pas de vainqueur.
  // Le seul faux positif est PuerCaput (e-sport, camp connu sans score).
  { cle: 'nul_r7_binome', nom: 'Nul · R7 est le binôme de R1 (+2)', icone: '⚖', teinte: '#f472b6',
    juste: 0, total: 0, note: 'théorie Ellemine_D — la case la plus pure (2 nuls sur 3 déclenchements) mais elle en rate cinq',
    verdict: function (t) {
      var rot = null;
      try { rot = getRotationCombat(t); } catch (e) { return { oui: null, detail: 'rotation indisponible' }; }
      if (!rot || !rot.figR1 || !rot.figR7) return { oui: null, detail: 'rotation indisponible' };
      var b = BINOMES_V7[rot.figR1] === rot.figR7;
      return { oui: b, detail: 'R7 = ' + (FL[rot.figR7] || rot.figR7)
        + (b ? ' = binôme de ' + (FL[rot.figR1] || rot.figR1) : '') };
    } },
  { cle: 'nul_meme_boucle', nom: 'Nul · R1 et R7 dans la même boucle', icone: '⚖', teinte: '#22d3ee',
    juste: 0, total: 0, note: 'décalage pair — 5 nuls sur 16 en même boucle, contre 2 sur 19 en boucles opposées',
    verdict: function (t) {
      var rot = null;
      try { rot = getRotationCombat(t); } catch (e) { return { oui: null, detail: 'rotation indisponible' }; }
      if (!rot || !rot.figR1 || !rot.figR7) return { oui: null, detail: 'rotation indisponible' };
      var i1 = FIGS_V7.indexOf(rot.figR1), i7 = FIGS_V7.indexOf(rot.figR7);
      if (i1 < 0 || i7 < 0) return { oui: null, detail: 'figure inconnue' };
      var k = (((i7 - i1) % 16) + 16) % 16;
      return { oui: k % 2 === 0, detail: 'décalage +' + k + (k % 2 ? ' (boucles opposées)' : ' (même boucle)') };
    } },
  // ── LA PISTE DES MAISONS, REPRISE LE 29/08/26 ──────────────────
  // « J'insiste sur la piste des maisons. Essaie de trouver des pôles
  // identiques ou une corrélation dans le thème. Oriente ta recherche
  // sur le résultat positif. » (Ellemine_D)
  //
  // Fait donc : balayage de 258 traits, tous formulés par ce que les
  // nuls ONT (jamais par ce qui leur manque), en ne gardant que ceux qui
  // attrapent LES DEUX nuls.
  //
  // 1. « PÔLES IDENTIQUES » AU SENS LITTÉRAL — deux maisons portant la
  //    même figure : les 120 paires M(a)/M(b) ont été testées. AUCUNE
  //    n'attrape les deux nuls. Réponse nette et négative.
  //
  // ⚠️ RÉSULTAT PÉRIMÉ PAR LE 3e NUL (29/08/26). CaputPuella 2-2 n'a
  //    AUCUN rôle partagé entre les camps : le pôle du juge ne pouvait
  //    donc pas s'allumer, et il ne s'est pas allumé. M15 tombe à 2 nuls
  //    sur 3 (24/27), et « binôme ET juge partagé » à 2 sur 3 aussi —
  //    toujours 0 faux positif, mais un raté. Le balayage ci-dessous a
  //    été REFAIT sur les trois nuls : plus aucun trait de pôle partagé
  //    ne les attrape tous les trois. Ce qui suit est le journal de la
  //    mesure d'alors, gardé pour mémoire, pas une règle vivante.
  // 2. CE QUI RESSORTAIT ALORS : le pôle partagé au siège du JUGE. Les
  //    camps de R1 et de R7 peuvent avoir des rôles communs ; la
  //    question est quelle maison porte l'un d'eux. Testé sur les seize :
  //      M15 .... attrape 2/2 nuls, 2 faux positifs, 24/26  ← LE JUGE
  //      M10 .... 1/2 nuls, 0 faux positif
  //      M4, M12, M16 ... 1/2 nuls
  //      les onze autres ... 0/2 nul
  //    M15 est la SEULE des seize maisons à attraper les deux. Et elle
  //    a une raison d'être celle-là : M15 est le juge, la maison qui
  //    prononce le verdict. Un juge dont la figure appartient aux deux
  //    camps ne peut favoriser personne — donc personne ne gagne.
  //
  // 3. COMBINÉE À LA RÈGLE DU BINÔME, elle ne laisse plus rien passer :
  //      juge partagé seul ......... 24/26 · 2 faux positifs
  //      binôme seul ............... 25/26 · 1 faux positif (PuerCaput)
  //      binôme ET juge partagé .... 26/26 · 0 faux positif
  //      témoin « jamais de nul » .. 24/26 · 0 nul attrapé
  //    Fréquences de base : juge partagé 13,9 %, binôme 7,3 %, les deux
  //    ensemble 1,4 % des thèmes.
  //
  // ⚠️ CE QU'IL NE FAUT PAS EN CONCLURE. 258 traits balayés, 26 en
  // attrapent deux ; avec seulement DEUX nuls parmi 26 cas, un trait qui
  // se déclenche sur 4 cas les attrape tous les deux par pure chance une
  // fois sur 54. Sur 258 traits, le hasard seul en produit une poignée.
  // « 26/26 » est donc DEUX conditions ajustées sur DEUX cas : non
  // infirmé, pas confirmé. Ce qui distingue M15 du bruit n'est pas son
  // score, c'est d'être la seule des seize maisons à tenir ET d'avoir un
  // sens doctrinal. Et la règle ne se déclenche que sur 1,4 % des
  // thèmes : au mieux elle attrapera un nul réel sur cinq. Précision
  // haute, rappel très bas — à croire quand elle parle, jamais à lire
  // comme « pas de signal donc pas de nul ».
  { cle: 'nul_juge_partage', nom: 'Nul · le juge M15 porte un pôle des DEUX camps', icone: '⚖', teinte: '#fb923c',
    juste: 0, total: 0, note: 'le juge ne peut trancher — 4 nuls sur 6 déclenchements, 67 % de précision',
    verdict: function (t) {
      var rot = null;
      try { rot = getRotationCombat(t); } catch (e) { return { oui: null, detail: 'rotation indisponible' }; }
      if (!rot || !rot.figR1 || !rot.figR7) return { oui: null, detail: 'rotation indisponible' };
      var c1 = [rot.figR1, BOUCLIER_V7[rot.figR1], FRONT_V7[rot.figR1], BINOMES_V7[rot.figR1], frontDuFrontV7(rot.figR1)];
      var c7 = [rot.figR7, BOUCLIER_V7[rot.figR7], FRONT_V7[rot.figR7], BINOMES_V7[rot.figR7], frontDuFrontV7(rot.figR7)];
      var partage = c1.indexOf(t[15]) >= 0 && c7.indexOf(t[15]) >= 0;
      return { oui: partage, detail: 'juge ' + (FL[t[15]] || t[15]) + (partage ? ' — des deux camps' : '') };
    } },
  { cle: 'nul_binome_et_juge', nom: 'Nul · binôme ET juge partagé', icone: '⚖', teinte: '#e879f9',
    juste: 0, total: 0, note: '0 faux positif en 2 déclenchements, 2 nuls — non infirmé, jamais confirmé non plus',
    verdict: function (t) {
      var rot = null;
      try { rot = getRotationCombat(t); } catch (e) { return { oui: null, detail: 'rotation indisponible' }; }
      if (!rot || !rot.figR1 || !rot.figR7) return { oui: null, detail: 'rotation indisponible' };
      if (BINOMES_V7[rot.figR1] !== rot.figR7) return { oui: false, detail: 'R7 n\'est pas le binôme de R1' };
      var c1 = [rot.figR1, BOUCLIER_V7[rot.figR1], FRONT_V7[rot.figR1], BINOMES_V7[rot.figR1], frontDuFrontV7(rot.figR1)];
      var c7 = [rot.figR7, BOUCLIER_V7[rot.figR7], FRONT_V7[rot.figR7], BINOMES_V7[rot.figR7], frontDuFrontV7(rot.figR7)];
      var partage = c1.indexOf(t[15]) >= 0 && c7.indexOf(t[15]) >= 0;
      return { oui: partage, detail: partage ? 'binôme + juge ' + (FL[t[15]] || t[15]) + ' partagé'
        : 'binôme mais juge non partagé' };
    } },
  { cle: 'nul_deux_portes', nom: 'Nul · LES DEUX PORTES (+2 même boucle / +11 opposées)', icone: '🚪', teinte: '#22c55e',
    juste: 0, total: 0, note: 'doctrine Ellemine_D, forme d\'origine {+2} — 4 nuls sur 7, un faux positif',
    verdict: function (t) {
      var d = nulDeuxPortesV7(t);
      if (!d) return { oui: null, detail: 'rotation indisponible' };
      var oui = d.memeBoucle ? (d.k === 2) : (d.k === 11);
      return { oui: oui, detail: d.porte + ' · +' + d.k };
    } },
  { cle: 'nul_deux_portes_large', nom: 'Nul · LES DEUX PORTES élargies ({+2,+4} / +11)', icone: '🚪', teinte: '#84cc16',
    juste: 0, total: 0, note: 'la forme branchée {+2,+4,+6} — les 7 nuls attrapés, 2 faux positifs, 78 % de précision',
    verdict: function (t) {
      var d = nulDeuxPortesV7(t);
      if (!d) return { oui: null, detail: 'rotation indisponible' };
      return { oui: d.oui, detail: d.porte + ' · +' + d.k + ' · ' + d.force };
    } },
  { cle: 'nul_faisceau4', nom: 'Nul · FAISCEAU — 4 signaux ou plus', icone: '🔆', teinte: '#f59e0b',
    juste: 0, total: 0, note: 'parle 5 fois sur 35, 2 nuls dedans — 40 % contre 20 % au hasard',
    verdict: function (t) {
      var f = faisceauNulV7(t);
      if (!f) return { oui: null, detail: 'rotation indisponible' };
      return { oui: f.n >= 4, detail: f.n + '/7 signaux — ' + f.niveau };
    } },
  { cle: 'nul_faisceau5', nom: 'Nul · FAISCEAU — 5 signaux ou plus', icone: '🔆', teinte: '#ef4444',
    juste: 0, total: 0, note: 'parle 3 fois sur 35, 2 nuls dedans — 67 % contre 20 % au hasard',
    verdict: function (t) {
      var f = faisceauNulV7(t);
      if (!f) return { oui: null, detail: 'rotation indisponible' };
      return { oui: f.n >= 5, detail: f.n + '/7 signaux — ' + f.niveau };
    } },
  // ─── LA DOCTRINE DE SATURNE (29/08/26, Ellemine_D) ───
  // « Saturne symbolise blocage, défense, stabilité, rigueur. Il faut
  // associer les figures liées à Saturne et opérer les maisons les plus
  // susceptibles du nul. Ça, c'est l'ingrédient pour le nul. »
  //
  // Figures de Saturne dans la table du fichier : CARCER et TRISTITIA.
  // Maisons de Saturne : M10 et M11.
  //
  // ⚠️ MESURÉ SUR LES 30 CAS, ET AUCUNE LECTURE NE BAT LE HASARD (17 %) :
  //   R1 est de Saturne .............. 1 nul /  6 tirs · 17 %
  //   R7 est de Saturne .............. 0 nul /  1
  //   le juge M15 est de Saturne ..... 0 nul /  4
  //   M13 ou M14 est de Saturne ...... 2 nuls /  8 · 25 %
  //   R1 en maison de Saturne ........ 1 nul /  7 · 14 %
  //   Saturne chez lui (M10/M11) ..... 0 nul /  4
  //   Saturne dans une cadente ....... 2 nuls / 14 · 14 %
  //   M1 ou M7 est de Saturne ........ 2 nuls /  9 · 22 %
  //   au moins 2 Saturne dans le thème 3 nuls / 21 · 14 %
  // Et le fait qui tranche : AmisPuer, le 4-4, le nul le plus net de
  // l'archive — sept signaux sur sept au faisceau — ne contient AUCUNE
  // figure de Saturne dans ses seize maisons.
  //
  // La doctrine n'est donc pas branchée au verdict. Les deux moteurs
  // ci-dessous la mettent SOUS SURVEILLANCE : chaque nouveau nul les
  // départagera tout seul, sans qu'on ait à y revenir à la main.
  { cle: 'nul_saturne_siege', nom: 'Nul · Saturne sur un siège (R1, R7, M1 ou M7)', icone: '♄', teinte: '#a3a3a3',
    juste: 0, total: 0, note: 'doctrine Ellemine_D — sous surveillance : parle sur 14 thèmes sur 35 et n\'y trouve que 2 nuls (14 %, sous le hasard)',
    verdict: function (t) {
      var rot = null;
      try { rot = getRotationCombat(t); } catch (e) { return { oui: null, detail: 'rotation indisponible' }; }
      if (!rot || !rot.figR1) return { oui: null, detail: 'rotation indisponible' };
      var SAT = { carcer: 1, tristitia: 1 };
      var ou = [];
      if (SAT[rot.figR1]) ou.push('R1');
      if (SAT[rot.figR7]) ou.push('R7');
      if (SAT[t[1]]) ou.push('M1');
      if (SAT[t[7]]) ou.push('M7');
      return { oui: ou.length > 0, detail: ou.length ? 'Saturne en ' + ou.join(', ') : 'aucun siège saturnien' };
    } },
  { cle: 'nul_saturne_cadent', nom: 'Nul · Saturne dans une maison cadente', icone: '♄', teinte: '#737373',
    juste: 0, total: 0, note: 'Saturne croisé aux maisons susceptibles — parle sur 18 thèmes sur 35, 3 nuls (17 %, sous le hasard)',
    verdict: function (t) {
      var ou = [];
      [3, 6, 9, 12].forEach(function (h) {
        if (t[h] === 'carcer' || t[h] === 'tristitia') ou.push('M' + h);
      });
      return { oui: ou.length > 0, detail: ou.length ? 'Saturne en ' + ou.join(', ') : 'aucune cadente saturnienne' };
    } },
  { cle: 'nul_temoin', nom: 'Nul · « jamais de nul »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin — la barre à battre est très haute, les nuls sont rares',
    verdict: function () { return { oui: false, detail: 'réponse constante' }; } }
];

// ══════════════════════════════════════════════════════════════
// MATCH SERRÉ (29/08/26) — « vérifie si les 4 cas cadents non-nuls ont un
// point commun » (Ellemine_D)
//
// Oui, et ce n'est pas « ils ne sont pas nuls » : les quatre sont des
// matchs à UN BUT D'ÉCART. PSG/Bayer 1-2, Bologna 0-1, FortMajVia 1-2
// (CaputAcq n'a pas de score exact). Avec les nuls à 0 d'écart, TOUS les
// cas cadents au score exact sont serrés, sans exception.
//
// ── TENU APRÈS LE 3e NUL (CaputPuella 2-2, 29/08/26) : le compte est
// passé de 5/5 à 6/6, le détecteur n'a toujours jamais crié à tort.
//
// Écart de buts selon la catégorie de maison de R1 (21 cas au score exact) :
//   angulaire  6 cas · écart moyen 2,33 · serrés 3/6 · larges (3+) 2/6
//   succédent  7 cas · écart moyen 3,14 · serrés 3/7 · larges     4/7
//   CADENTE    6 cas · écart moyen 0,50 · serrés 6/6 · larges     0/6
//   synthèse   2 cas · écart moyen 1,50 · serrés 1/2 · larges     0/2
// 13 des 21 cas sont serrés ; que les 6 cadents le soient tous vaut
// C(13,6)/C(21,6) = 3,1 % de chance au hasard.
//
// ⚠️ SON FAUX NÉGATIF, VU EN VRAI LE 29/08 (RubCarcer). R1 = Tristitia
// en M7, angulaire : le détecteur s'est tu, le match a fini 1-0. Serré,
// et il ne l'a pas vu. Il rate maintenant 7 serrés sur 13 — plus de la
// moitié. SON SILENCE NE VEUT RIEN DIRE : ce n'est jamais un feu vert
// pour un gros score, seulement l'absence d'alerte. Le moteur de camp
// annonçait 4-2 ce soir-là ; c'est lui qu'il faut cesser de croire sur
// les chiffres, pas le détecteur qu'il faut élargir.
//
// C'EST LE DÉTECTEUR DE MATCH SERRÉ demandé depuis longtemps (« les matchs
// serrés sont souvent faussés par le système, juste les matchs de score
// large »). Il ne dit pas qui gagne — il dit quand ne PAS croire un gros
// score annoncé. Sa force est sa précision : quand il dit serré, 5 fois
// sur 5. Sa faiblesse est son rappel : il rate 6 serrés sur 11.
//
// ☠️ LE RAFFINEMENT « M6 OU M9 » EST MORT (29/08/26). Il disait : parmi
// les cadentes, M6 et M9 donnent le nul (écart 0) et M3/M12 la victoire
// d'un but. Le troisième nul, CaputPuella 2-2, a R1 = Puella en M3.
// Un nul en M3. La règle est réfutée par le premier cas qui pouvait la
// réfuter, exactement comme il fallait s'y attendre d'un motif ajusté
// après coup sur deux cas. Le moteur reste au banc comme témoin de ce
// qu'une jolie coïncidence vaut : 2 nuls sur 3, et un raté.
var MOTEURS_SERRE_V7 = [
  { cle: 'serre_r1_cadente', nom: 'Serré · R1 en maison cadente', icone: '⚖', teinte: '#34d399',
    juste: 0, total: 0, note: '7 cas sur 7 quand il ose le oui — écart moyen 0,57 contre 2,05 ailleurs',
    verdict: function (t) {
      var rot = null;
      try { rot = getRotationCombat(t); } catch (e) { return { oui: null, detail: 'rotation indisponible' }; }
      if (!rot || !rot.hR1) return { oui: null, detail: 'rotation indisponible' };
      var cadente = [3, 6, 9, 12].indexOf(rot.hR1) >= 0;
      return { oui: cadente, detail: 'R1 en M' + rot.hR1 + (cadente ? ' (cadente)' : '') };
    } },
  { cle: 'serre_m6m9', nom: 'Serré · R1 en M6 ou M9 (le couple des nuls)', icone: '⚖', teinte: '#a78bfa',
    juste: 0, total: 0, note: '3 cas sur 3, écart moyen 0,33 — trois cas seulement, motif à confirmer',
    verdict: function (t) {
      var rot = null;
      try { rot = getRotationCombat(t); } catch (e) { return { oui: null, detail: 'rotation indisponible' }; }
      if (!rot || !rot.hR1) return { oui: null, detail: 'rotation indisponible' };
      var vise = (rot.hR1 === 6 || rot.hR1 === 9);
      return { oui: vise, detail: 'R1 en M' + rot.hR1 };
    } },
  { cle: 'serre_temoin', nom: 'Serré · « toujours serré »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin — 19 des 27 cas au score connu sont serrés',
    verdict: function () { return { oui: true, detail: 'réponse constante' }; } },
  { cle: 'serre_temoin_non', nom: 'Serré · « jamais serré »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin inverse',
    verdict: function () { return { oui: false, detail: 'réponse constante' }; } }
];

var MOTEURS_CORNERS_V7 = [
  { cle: 'corners_moteur', nom: 'Corners · moteur affiché', icone: '🚩', teinte: '#38bdf8',
    juste: 0, total: 0, note: 'estimerCornersV7 — mi-temps + doctrine Feu/Terre',
    verdict: function (t) {
      var v = getVerdictAfficheReel(t);
      if (!v || v.cornersTotal == null) return { n: null, detail: '—' };
      var c = v.corners || {};
      return { n: v.cornersTotal,
        detail: (c.ht1 != null ? c.ht1 + '+' + c.ht2 + '=' : '') + v.cornersTotal
          + (c.doctrine ? ' · ' + c.doctrine : '') };
    } },
  { cle: 'corners_ouvert', nom: 'Corners · match ouvert ou fermé', icone: '🚪', teinte: '#a78bfa',
    juste: 0, total: 0, note: 'lecture seule de l\'ouverture : ouvert 10, fermé 4',
    verdict: function (t) {
      var ouvert = false;
      try { ouvert = !!determinerMatchOuvertV7(t); } catch (e) { return { n: null, detail: '—' }; }
      return { n: ouvert ? 10 : 4, detail: ouvert ? 'ouvert → 10' : 'fermé → 4' };
    } },
  { cle: 'corners_temoin', nom: 'Corners · « toujours 10 »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin — ne lit pas le thème, c\'est la moyenne d\'un match',
    verdict: function () { return { n: 10, detail: 'réponse constante' }; } }
];

// ═══════════════════════════════════════════════════════════════
// QUI ENCAISSE L'INCIDENT — étude du 28/08/26, demandée par Ellemine_D
// « en se référant aux relations des figures des 4 pôles ».
//
// ─── CE QUE LA STRUCTURE INTERDIT, ET QUI ORIENTE TOUTE LA RECHERCHE ───
// Un camp ne peut PAS produire de violence interne :
//     un camp contient son propre agresseur ......... 0 / 16
//     un pôle attaque un membre de son propre camp .. 0 / 80
// La raison est la même que pour le non-contact en même boucle : les cinq
// rôles sont à des décalages PAIRS (+0, +10, +4, +2, +8) et l'attaque est
// à +3, impair. Un camp est donc structurellement pacifique envers
// lui-même. La violence qu'il SUBIT ne peut venir que de deux endroits :
// la MAISON où il siège, ou la RÉSULTANTE qu'il y engendre.
//
// ─── LA PISTE RETENUE : LE SIÈGE QUI ENGENDRE MARS ───
// C'est la loi de la résultante appliquée au siège : ce que la centrale
// PRODUIT là où elle est assise. Quand ce qu'elle engendre est Rubeus ou
// Puer, le camp porte la violence.
//
// RÉGULARITÉ PARFAITE, vérifiée sur les 256 couples figure × maison :
// CHAQUE figure engendre Rubeus dans EXACTEMENT UNE maison et Puer dans
// EXACTEMENT UNE autre. 32 couples sur 256, soit 12,5 %.
//     Puer M10→Rubeus, M16→Puer      · Fortuna Major M3→Rubeus, M13→Puer
//     Carcer M1→Rubeus, M7→Puer      · Cauda Draconis M6→Rubeus, M12→Puer
//     (table complète calculable par combine(fig, FIGS_V7[maison-1]))
//
// POURQUOI CELLE-CI PLUTÔT QU'UNE AUTRE. Sept candidats mesurés sur 676
// thèmes, sur deux exigences : DÉSIGNER UN SEUL camp (sinon pas de
// coupable) et être ÉQUILIBRÉ entre R1 et R7 (sinon c'est un biais) :
//     le camp contient Mars ................. 52 % · 204/145  déséquilibré
//     un pôle Mars discordant ............... 41 % · 161/115  déséquilibré
//     le siège régénère hors réseau .......... 0 % ·   0/0    n attribue JAMAIS
//     l assaillant est Mars ................. 19 % ·  71/59
//     3 figures négatives ou plus ........... 19 % ·  76/52   déséquilibré
//     ⭐ le siège régénère MARS .............. 19 % ·  63/63  PARFAIT
//     le siège régénère Mars ET hors réseau .. 9 % ·  32/30
// « Le siège régénère Mars » est le seul à la fois rare (il se tait sur
// 81 % des thèmes) et rigoureusement équilibré.
//
// ⚠️ ET IL N'Y A QU'UN SEUL CAS RÉEL. Bologna : R1 Fortuna Major en M3
// engendre RUBEUS, R7 Cauda Draconis en M9 engendre Albus. La règle
// désigne R1 — et le carton rouge est tombé côté R1. Le détecteur
// d'incident en place, lui, annonçait M7 : il s'est trompé.
// 1 sur 1 ne démontre RIEN. La règle entre au banc pour être réfutée.
// Elle n'entre PAS dans l'affichage tant qu'elle n'a pas dix cas.
// ═══════════════════════════════════════════════════════════════
// LA NAISSANCE DE MARS (28/08/26) — et ce qu'elle ne dit PAS.
//
// Point de départ : sur le match du 27/08 les deux sièges (R1 en M10,
// R7 en M16) sont en maison paire, donc incapables d'engendrer une
// agression par la loi de la résultante. Les deux moteurs « le siège
// engendre Mars » se taisent — et il y a eu deux incidents. Ce n'est
// donc pas le siège de la centrale qui porte l'incident.
//
// Piste retenue : les maisons dont la RÉSULTANTE est une figure de Mars
// (Rubeus ou Puer). Le camp serait celui de la MAISON, pas celui de la
// centrale.
//     Bologna .... une naissance, M3 Fortuna Major → Rubeus → camp 1,
//                  et l'unique incident réel est un rouge côté R1. ✔
//     27/08 ...... deux naissances, M1 Carcer → Rubeus et M12 Cauda →
//                  Puer, et les deux incidents réels (rouge ET penalty)
//                  sont côté R1.
//
// ⚠️ CE QUE LE 27/08 INTERDIT DE CONCLURE. Les deux naissances tombent
// dans des camps opposés, et dans les DEUX repères à la fois :
//     repère fixe (CAMP1/CAMP2) ...... M1 → camp 1, M12 → camp 2
//     repère tourné (getRotationOrderFromRepos) . M1 → camp 2, M12 → camp 1
// Puisque les deux incidents réels sont dans le même camp, AU MOINS UNE
// des deux naissances est un faux positif — quel que soit le repère
// choisi. La coïncidence « deux naissances, deux incidents » n'existe
// pas. Le repère fixe explique tout par M1 ; le repère tourné explique
// tout par M12 ; les deux tiennent, et rien ici ne les départage. Les
// deux lectures sont donc au banc, côte à côte, en attendant un match
// qui les sépare.
//
// ⚠️ ET SURTOUT : les TROIS incidents réels connus sont côté camp 1.
// Le témoin « toujours M1 » les a tous. Aucune règle ne peut être dite
// meilleure que lui tant qu'un incident ne sera pas tombé côté camp 2.
//
// Autres réserves, mesurées sur les 65 536 thèmes : 1,88 naissance par
// thème en moyenne, et seulement 12,2 % des thèmes n'en ont aucune — la
// règle LOCALISE, elle ne DÉTECTE pas ; elle annoncerait un incident
// dans 88 % des matchs. Restreindre aux naissances par agression (k=±3)
// ne sauve rien : ça supprimerait la naissance juste de Bologna. Enfin
// le camp des naissances penche déjà de lui-même vers le camp 1 en
// repère fixe (65 536 contre 57 344, soit 53,3 % / 46,7 %), l'écart
// venant des maisons de synthèse — une raison de plus de se méfier d'un
// score obtenu sur trois incidents tous côté camp 1.
// Banc uniquement, aucun poids sur le verdict.
function naissancesMarsV7(theme) {
  var out = [];
  if (!theme) return out;
  for (var h = 1; h <= 16; h++) {
    var f = theme[h];
    if (!f) continue;
    var r = combine(f, FIGS_V7[h - 1]);
    if (!FIGURES_MARS_V7[r]) continue;
    out.push({ maison: h, fig: f, resultante: r,
      camp: (CAMP1.indexOf(h) >= 0) ? 'M1' : 'M7', penalty: (h === 12) });
  }
  return out;
}

// Le camp d'une maison, dans l'un ou l'autre repère. En repère TOURNÉ,
// les positions de CAMP1 sont lues sur l'anneau qui commence à la maison
// de repos de M1 — c'est l'anneau qui sert déjà à situer R1 et R7.
function campMaisonV7(maison, tourne, theme) {
  if (!tourne) return (CAMP1.indexOf(maison) >= 0) ? 'M1' : 'M7';
  var ordre = getRotationOrderFromRepos(theme[1]);
  var rang = ordre.indexOf(maison);            // 0 = R1, 6 = R7
  if (rang < 0) return null;
  return (CAMP1.indexOf(rang + 1) >= 0) ? 'M1' : 'M7';
}

// Camp désigné par les naissances de Mars ; muet si elles se répartissent
// des deux côtés — c'est exactement ce qui arrive le 27/08.
function campNaissancesMarsV7(theme, tourne) {
  var n = naissancesMarsV7(theme);
  if (!n.length) return { camp: null, detail: 'aucune naissance de Mars' };
  var camps = n.map(function (x) { return campMaisonV7(x.maison, tourne, theme); });
  var dit = n.map(function (x, i) {
    return 'M' + x.maison + ' ' + (FL[x.fig] || x.fig) + '→' + (FL[x.resultante] || x.resultante)
      + ' (' + camps[i] + ')';
  }).join(' · ');
  var m1 = camps.indexOf('M1') >= 0, m7 = camps.indexOf('M7') >= 0;
  if (m1 && !m7) return { camp: 'M1', detail: dit };
  if (m7 && !m1) return { camp: 'M7', detail: dit };
  return { camp: null, detail: 'naissances des deux côtés : ' + dit };
}

// ─── BRANCHÉ À L'ÉCRAN LE 28/08/26, SUR DEMANDE D'ELLEMINE_D ───
// Le camp de l'incident affiché ne vient plus du seul détecteur de
// signaux : il vient d'abord des NAISSANCES DE MARS, avec le détecteur
// en repli. Cascade :
//   1. les deux repères (fixe et tourné) désignent le même camp → lui ;
//   2. sinon le repère fixe désigne un camp → lui (c'est le repère
//      qu'utilise déjà le reste du code d'incident) ;
//   3. sinon → le détecteur de signaux, comme avant.
// Mesuré sur les deux seuls cas réels : la cascade donne M1 sur Bologna
// (les deux repères d'accord) et M1 sur le 27/08 (les naissances se
// contredisent, le détecteur reprend la main), soit 2/2 contre 1/2 pour
// le détecteur seul, qui se trompait sur Bologna.
// ⚠️ DEUX CAS. Et les trois incidents réels connus sont tous côté camp 1,
// où le témoin « toujours M1 » fait le même score. Ce branchement ne
// change QUE le camp désigné : il ne touche ni au « y a-t-il incident »
// (les naissances ne savent pas détecter : 88 % des thèmes en ont au
// moins une), ni au vainqueur, ni au score.
function campIncidentAfficheV7(theme, detect) {
  var d = detect || {};
  var nais = naissancesMarsV7(theme);
  if (nais.length) {
    var fixe = campNaissancesMarsV7(theme, false);
    var tour = campNaissancesMarsV7(theme, true);
    if (fixe.camp && fixe.camp === tour.camp) {
      return { camp: fixe.camp, source: 'naissance de Mars, les deux repères d\'accord',
        resume: 'incident porté CONTRE ' + fixe.camp + ' — ' + fixe.detail
          + ' (repère fixe et repère tourné d\'accord)' };
    }
    if (fixe.camp) {
      return { camp: fixe.camp, source: 'naissance de Mars, repère fixe',
        resume: 'incident porté CONTRE ' + fixe.camp + ' — ' + fixe.detail
          + ' (repère tourné : ' + (tour.camp || 'ne tranche pas') + ')' };
    }
  }
  return { camp: d.camp || null, source: 'détecteur de signaux',
    resume: (d.campResume || '')
      + (nais.length ? ' · les naissances de Mars ne tranchent pas (' + nais.map(function (x) {
          return 'M' + x.maison;
        }).join(', ') + ')' : ' · aucune naissance de Mars') };
}

// Qui CONCÈDE le penalty. Famille distincte du carton rouge depuis le
// 27/08 : un même match peut donner un rouge à un camp et un penalty à
// l'autre, et une seule case « contre qui » ne pouvait pas le dire.
var MOTEURS_PENALTY_CAMP_V7 = [
  { cle: 'pen_camp_m12', nom: 'Penalty · Mars naît en M12 → le camp 2 concède', icone: '⚽', teinte: '#f472b6',
    juste: 0, total: 0, note: 'RÉFUTÉE sur son unique cas (27/08 : penalty côté R1) — gardée pour mémoire, accuse toujours M7',
    verdict: function (t) {
      var n = naissancesMarsV7(t).filter(function (x) { return x.penalty; });
      if (!n.length) return { camp: null, detail: 'M12 n\'engendre pas Mars' };
      return { camp: 'M7', detail: 'M12 ' + (FL[n[0].fig] || n[0].fig) + ' engendre '
        + (FL[n[0].resultante] || n[0].resultante) };
    } },
  { cle: 'pen_camp_v7', nom: 'Penalty · moteur verdictV7 (encaisseur)', icone: '⚠', teinte: '#fb923c',
    juste: 0, total: 0, note: 'la lecture déjà en place',
    verdict: function (t) {
      var v = null;
      try { v = verdictV7(t); } catch (e) { return { camp: null, detail: 'erreur' }; }
      var e2 = v && v.penalty ? v.penalty.encaisseur : null;
      return { camp: (e2 === 'M1' || e2 === 'M7') ? e2 : null,
        detail: v && v.penalty && v.penalty.reasons ? String(v.penalty.reasons[0] || '') : '' };
    } },
  { cle: 'pen_camp_temoin', nom: 'Penalty · « toujours M7 »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin — ne lit pas le thème, à comparer à la règle M12',
    verdict: function () { return { camp: 'M7', detail: 'réponse constante' }; } },
  // ☠️ 30/08/26 — TOUTE CETTE FAMILLE EST À ZÉRO. Les trois moteurs
  // ci-dessus font 0/1, 0/2 et 0/3 : aucun n'a jamais désigné le bon
  // camp. La raison est bête et il fallait la voir : les TROIS cas
  // connus ont le penalty concédé par M1, et le seul témoin qu'on avait
  // répond toujours M7. Un témoin qui ne peut pas gagner ne mesure rien.
  // Celui-ci est son inverse. Il fait 3/3 — et ça ne vaut RIEN : trois
  // cas, p = 0,125 contre une pièce. Il est là pour que le plancher de
  // la famille soit visible, pas pour être joué. Le jour où un match
  // donnera un penalty concédé par M7, il tombera à 3/4 et on saura
  // enfin quelque chose.
  { cle: 'pen_camp_temoin_m1', nom: 'Penalty · « toujours M1 » (témoin inverse)', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin inverse (30/08) — les 3 cas connus sont tous M1 ; 3/3 ne démontre rien, p = 0,125',
    verdict: function () { return { camp: 'M1', detail: 'réponse constante — témoin, pas une règle' }; } }
];

var MOTEURS_INCIDENT_CAMP_V7 = [
  { cle: 'inc_camp_naissance', nom: 'Camp · maison où Mars naît — repère FIXE', icone: '🩸', teinte: '#ef4444',
    juste: 0, total: 0, note: 'CAMP1/CAMP2 tels quels ; muet si les naissances sont des deux côtés',
    verdict: function (t) { return campNaissancesMarsV7(t, false); } },
  { cle: 'inc_camp_naissance_rot', nom: 'Camp · maison où Mars naît — repère TOURNÉ', icone: '🩸', teinte: '#f97316',
    juste: 0, total: 0, note: 'mêmes naissances, camps lus après la rotation de l\'anneau',
    verdict: function (t) { return campNaissancesMarsV7(t, true); } },
  { cle: 'inc_camp_mars', nom: 'Camp · le siège engendre Mars', icone: '⚔', teinte: '#f472b6',
    juste: 0, total: 0, note: 'loi de la résultante au siège — se tait sur 81 % des thèmes',
    verdict: function (t) {
      var rot = getRotationCombat(t);
      if (!rot || !rot.figR1 || !rot.figR7) return { camp: null, detail: 'rotation indisponible' };
      var mars = function (f, h) {
        var r = combine(f, FIGS_V7[h - 1]);
        return FIGURES_MARS_V7[r] ? r : null;
      };
      var a = mars(rot.figR1, rot.hR1), b = mars(rot.figR7, rot.hR7);
      if (a && !b) return { camp: 'M1', detail: 'R1 engendre ' + (FL[a] || a) + ' à son siège' };
      if (b && !a) return { camp: 'M7', detail: 'R7 engendre ' + (FL[b] || b) + ' à son siège' };
      if (a && b) return { camp: null, detail: 'les deux engendrent Mars — aucun coupable désigné' };
      return { camp: null, detail: 'aucun siège n\'engendre Mars' };
    } },
  // Raffinement du 28/08/26, issu de la loi de la résultante au siège
  // (cf. autoTestLoiMaisonV7) : en maison PAIRE la résultante reste dans
  // le camp — le Mars engendré est un allié ; en maison IMPAIRE elle
  // vient d'en face. Ne retenir que le second cas divise par deux la
  // fréquence du critère sans casser son équilibre, et il désigne
  // toujours R1 sur Bologna — le seul cas réel connu.
  // Mesuré sur les 65 536 thèmes possibles (exhaustif, pas un échantillon) :
  //   « le siège engendre Mars » ............ R1 6144 / R7 6144, tranche 18,8 %
  //   « … depuis une maison impaire » ....... R1 2880 / R7 2880, tranche  8,8 %
  //   « … depuis une maison paire » ......... R1 3264 / R7 3264, tranche 10,0 %
  // ⚠️ NE PAS remplacer Mars par l'agression directe (±3) : « le siège
  // engendre son agresseur » donne R1 2432 / R7 3456 et « son agresseur
  // ou sa victime » R1 3072 / R7 7168 — ces deux-là sont structurellement
  // biaisés vers R7, ils désigneraient un coupable par la forme du thème
  // et non par ce qu'il contient. Vérifié exhaustivement le 28/08/26.
  // Au banc uniquement, comme le précédent.
  { cle: 'inc_camp_mars_hors', nom: 'Camp · le siège engendre Mars d\'en face', icone: '⚔', teinte: '#fb7185',
    juste: 0, total: 0, note: 'idem, restreint aux maisons impaires — se tait sur ≈ 91 % des thèmes',
    verdict: function (t) {
      var rot = getRotationCombat(t);
      if (!rot || !rot.figR1 || !rot.figR7) return { camp: null, detail: 'rotation indisponible' };
      var mars = function (f, h) {
        if (!f || !h || h % 2 === 0) return null;
        var r = combine(f, FIGS_V7[h - 1]);
        return FIGURES_MARS_V7[r] ? r : null;
      };
      var a = mars(rot.figR1, rot.hR1), b = mars(rot.figR7, rot.hR7);
      if (a && !b) return { camp: 'M1', detail: 'R1 engendre ' + (FL[a] || a) + ' en M' + rot.hR1 + ' (impaire — hors camp)' };
      if (b && !a) return { camp: 'M7', detail: 'R7 engendre ' + (FL[b] || b) + ' en M' + rot.hR7 + ' (impaire — hors camp)' };
      if (a && b) return { camp: null, detail: 'les deux engendrent Mars hors camp' };
      return { camp: null, detail: 'aucun siège n\'engendre Mars depuis une maison impaire' };
    } },
  { cle: 'inc_camp_affiche', nom: 'Camp · ce que l\'application AFFICHE', icone: '📺', teinte: '#a78bfa',
    juste: 0, total: 0, note: 'cascade branchée le 28/08 : naissances de Mars, puis détecteur en repli',
    verdict: function (t) {
      var orderR = getRotationOrderFromRepos(t[1]);
      var d = detectIncidentChaotique(t, calculerButsCamp(t[orderR[0]], t),
        calculerButsCamp(t[orderR[6]], t), orderR[0], orderR[6]);
      var c = campIncidentAfficheV7(t, d);
      return { camp: c.camp || null, detail: c.source + ' — ' + c.resume };
    } },
  { cle: 'inc_camp_detecteur', nom: 'Camp · détecteur de signaux seul (ancien affichage)', icone: '⚠', teinte: '#fb923c',
    juste: 0, total: 0, note: 'ce que l\'application montrait avant le 28/08',
    verdict: function (t) {
      var orderR = getRotationOrderFromRepos(t[1]);
      var d = detectIncidentChaotique(t, calculerButsCamp(t[orderR[0]], t),
        calculerButsCamp(t[orderR[6]], t), orderR[0], orderR[6]);
      return { camp: d.camp || null, detail: d.campResume || '' };
    } },
  { cle: 'inc_camp_temoin', nom: 'Camp · « toujours M1 »', icone: '➖', teinte: '#64748b',
    juste: 0, total: 0, note: 'témoin — ne lit pas le thème',
    verdict: function () { return { camp: 'M1', detail: 'réponse constante' }; } }
];

// ═══════════════════════════════════════════════════════════════
// LES MOTEURS D'INCIDENT — mis au banc le 27/08/26.
//
// Il y avait DEUX mécanismes de pénalité dans le fichier, et ils se
// contredisaient sans que rien ne le signale : sur le thème
// puer/laetitia/amissio/acquisitio, detectIncidentChaotique disait OUI à
// 66 % et verdictV7.penalty disait NON. Seul le premier arrivait à
// l'écran, et le second était le seul à savoir nommer un camp.
// Ils sont maintenant notés côte à côte, comme les moteurs de camp.
//
// ⚠️ AUCUN D'EUX N'A ENCORE UN SEUL CAS. Le champ « Rouge / pénalty
// réel » n'était pas enregistré (cf. setRealPenalty). Le banc affichera
// 0/0 jusqu'à ce que des matchs soient saisis — c'est exactement le but :
// rendre visible qu'on ne sait pas.
// ═══════════════════════════════════════════════════════════════
// L'INCIDENT LU DANS LES TROIS DÉRIVÉS D'AXES (29/08/26)
//
// Ellemine_D : « vérifie dans les dérivés des axes s'il y a signal
// d'incident : si oui ça confirme le thème principal, si non le signal
// est peu fiable. »
//
// Chaque axe du carré — cardinal (M1,4,7,10), succédent (M2,5,8,11),
// cadent (M3,6,9,12) — donne quatre mères et donc un thème dérivé
// complet, qui a son propre pourcentage d'incident.
//
// MESURÉ SUR LES CINQ CAS OÙ L'ON SAIT CE QUI S'EST PASSÉ :
//   cas          principal   moyenne des 3 dérivés   réel
//   CaputPop      78 % M7           39 %             RIEN
//   PuellaVia     20 % M1           80 % (2 rouges)  CARTON ROUGE
//   Bologna       85 % M1           26 %             incident
//   Jeudi 27/08   28 % M1           66 % (1 rouge)   incident + penalty
//   PuellaAlbus   93 % M7           68 %             rien (un CSC)
// Au seuil de 50 % :
//   le thème principal a raison ..... 1 fois sur 5
//   la moyenne des dérivés .......... 3 fois sur 5
//
// ⚠️ MAIS SA RÈGLE, PRISE À LA LETTRE, NE MARCHE PAS. « Les dérivés
// confirment → fiable » suppose qu'ils soient d'accord avec le principal.
// Or ils ne le sont presque jamais : un seul cas d'accord dans toute
// l'archive (PuellaAlbus, les deux au-dessus de 50 %), et ce cas-là est
// justement celui où il ne s'est rien passé. Le vrai constat est plus
// fort et plus simple : LES DÉRIVÉS NE CONFIRMENT PAS LE PRINCIPAL, ILS
// LE CORRIGENT. Sur ses deux thèmes, ils ont eu raison exactement là où
// le principal s'est trompé, et dans les deux sens — ils se sont tus
// quand il criait, ils ont crié quand il se taisait.
//
// ⚠️ ET SUR LE CAMP, ILS SONT MAUVAIS. Sur PuellaVia le rouge est tombé
// du côté M1 que désignait le principal, alors que les dérivés disaient
// M7. Ils voient donc LE FAIT, pas LE CÔTÉ. Le moteur ci-dessous ne
// répond qu'à la question « y aura-t-il un incident », jamais « pour
// qui » — c'est tout ce que la mesure autorise.
//
// n = 5. Rien n'est établi, et rien n'est branché au verdict : le moteur
// est au banc pour que les prochains cas tranchent.
// ═══════════════════════════════════════════════════════════════
// LA SOMME DES QUATRE MÈRES DE CHAQUE AXE (29/08/26) — Ellemine_D
//
// « J'insiste, c'est impossible : les axes vérifient ce qui se passe
// dans le thème principal, surtout l'axe cardinal, et même la SOMME des
// 4 mères de chaque axe confirme une chose dans le thème. N'ignore pas
// ou ne minimise pas ça. »
//
// Il avait raison et j'étais passé à côté. J'avais MOYENNÉ les trois
// dérivés — ce qui dilue justement le cardinal — et je n'avais pas du
// tout testé la somme des quatre mères, qui est pourtant la chose qu'il
// nommait explicitement.
//
// La somme d'un axe, c'est combineMany de ses quatre maisons : la figure
// que le carré produit sur cet axe. Les figures d'incident du fichier
// sont RUBEUS (Mars), CARCER et TRISTITIA (Saturne).
//
// MESURÉ SUR LES CINQ CAS AU RÉSULTAT CONNU :
//   Bologna    incident   cadent = Tristitia ★
//   Jeudi      incident   cardinal = Carcer ★ · succédent = Tristitia ★
//   PuellaVia  incident   succédent = Rubeus ★
//   PuellaAlbus  rien     aucune somme d'incident
//   CaputPop     rien     aucune somme d'incident
//   → « AU MOINS UNE DES TROIS SOMMES EST UNE FIGURE D'INCIDENT » : 5/5
// Aucune erreur. Comparé à tout le reste :
//   au moins une somme d'incident ......... 5/5   ← sa doctrine
//   filiation double-négative ............. 4/5
//   somme du succédent seule .............. 4/5
//   moyenne des trois dérivés ............. 3/5
//   témoin « toujours oui » ............... 3/5
//   somme du cardinal seule ............... 3/5
//   dérivé cardinal seul ≥ 50 % ........... 2/5
//   signaux du thème principal ............ 1/5
//
// ET ELLE DISCRIMINE VRAIMENT. Vérifié sur les 65 536 thèmes possibles :
//   somme d'un axe donné = figure d'incident ....... 18,8 %
//   au moins une des trois ......................... 45,7 %
//   au moins deux .................................. 10,5 %
//   les trois ...................................... 0,0 % (impossible)
// Se déclencher sur 46 % des thèmes, c'est trancher : une règle qui
// dirait oui à 90 % ne vaudrait rien à 5/5.
//
// ⚠️ n = 5, dont 3 incidents. Une règle qui répond oui sur 3 cas et juste
// sur les 5 a une chance sur dix d'y arriver par hasard. Ce qui la sauve
// n'est pas ce chiffre : c'est qu'elle a été ÉNONCÉE AVANT d'être
// mesurée, par Ellemine_D, et qu'elle bat les huit autres lectures.
// C'est branché au verdict — mais chaque nouveau cas peut la défaire.
function sommesAxesIncidentV7(theme) {
  if (!theme || !theme[1] || typeof AXES_V7 === 'undefined') return null;
  var INC = { rubeus: 1, carcer: 1, tristitia: 1 };
  var det = [], n = 0;
  for (var i = 0; i < AXES_V7.length; i++) {
    var meres = AXES_V7[i].maisons.map(function (h) { return theme[h]; });
    var som = null;
    try { som = combineMany(meres); } catch (e) { som = null; }
    var estInc = !!(som && INC[som]);
    if (estInc) n++;
    det.push({ axe: AXES_V7[i].nom, cle: AXES_V7[i].cle, somme: som, incident: estInc });
  }
  return { nb: n, total: AXES_V7.length, detail: det, signal: n >= 1 };
}

function incidentDerivesV7(theme) {
  if (!theme || !theme[1] || typeof AXES_V7 === 'undefined') return null;
  var pcts = [], rouges = 0, det = [];
  for (var i = 0; i < AXES_V7.length; i++) {
    var meres = AXES_V7[i].maisons.map(function (h) { return theme[h]; });
    var derive = null;
    try { derive = buildThemeFromMothers(meres[0], meres[1], meres[2], meres[3]); }
    catch (e) { continue; }
    var v = null;
    try { v = getVerdictAfficheReel(derive); } catch (e) { continue; }
    if (!v || typeof v.incidentPct !== 'number') continue;
    pcts.push(v.incidentPct);
    if (v.penalty && v.penalty.hasRed) rouges++;
    det.push({ axe: AXES_V7[i].nom, pct: v.incidentPct, rouge: !!(v.penalty && v.penalty.hasRed) });
  }
  if (!pcts.length) return null;
  var moy = Math.round(pcts.reduce(function (s, x) { return s + x; }, 0) / pcts.length);
  return { moyenne: moy, rouges: rouges, detail: det, nb: pcts.length };
}

var MOTEURS_INCIDENT_V7 = [
  { cle: 'incident_sommes_axes', nom: 'Incident · une somme d\'axe est figure d\'incident', icone: '➕', teinte: '#22c55e',
    juste: 0, total: 0, note: 'doctrine Ellemine_D — 5/5, la meilleure lecture de la famille',
    verdict: function (t) {
      var s = null;
      try { s = sommesAxesIncidentV7(t); } catch (e) { return { oui: null, detail: 'sommes indisponibles' }; }
      if (!s) return { oui: null, detail: 'sommes indisponibles' };
      var q = s.detail.filter(function (x) { return x.incident; }).map(function (x) { return x.axe; });
      return { oui: s.signal, detail: s.nb + '/3 · ' + (q.length ? q.join(', ') : 'aucune somme d\'incident') };
    } },
  { cle: 'incident_derives', nom: 'Incident · moyenne des trois dérivés d\'axes ≥ 50 %', icone: '🧭', teinte: '#f472b6',
    juste: 0, total: 0, note: 'doctrine Ellemine_D — 3 justes sur 5 contre 1 sur 5 pour le thème principal',
    verdict: function (t) {
      var d = null;
      try { d = incidentDerivesV7(t); } catch (e) { return { oui: null, detail: 'dérivés indisponibles' }; }
      if (!d) return { oui: null, detail: 'dérivés indisponibles' };
      return { oui: d.moyenne >= 50,
        detail: 'moyenne ' + d.moyenne + ' % sur ' + d.nb + ' axes' + (d.rouges ? ' · ' + d.rouges + ' rouge(s)' : '') };
    } },
  { cle: 'incident_derives_rouge', nom: 'Incident · au moins un dérivé porte un rouge', icone: '🟥', teinte: '#ef4444',
    juste: 0, total: 0, note: 'la lecture la plus stricte des dérivés',
    verdict: function (t) {
      var d = null;
      try { d = incidentDerivesV7(t); } catch (e) { return { oui: null, detail: 'dérivés indisponibles' }; }
      if (!d) return { oui: null, detail: 'dérivés indisponibles' };
      return { oui: d.rouges > 0, detail: d.rouges + ' dérivé(s) sur ' + d.nb + ' portent un rouge' };
    } },
  { cle: 'incident_signaux', nom: 'Incident · signaux', icone: '⚠', teinte: '#f87171',
    juste: 0, total: 0, note: 'affiché — chaos, filiation, M6/M12 discordantes',
    verdict: function (t) {
      var orderR = getRotationOrderFromRepos(t[1]);
      var d = detectIncidentChaotique(t, calculerButsCamp(t[orderR[0]], t),
        calculerButsCamp(t[orderR[6]], t), orderR[0], orderR[6]);
      var niv = calculerNiveauIncidentV7(d.signals);
      return { oui: niv.pct >= 50, camp: d.camp || null,
        detail: niv.pct + '% ' + niv.niveau + (d.camp ? ' · contre ' + d.camp : '') };
    } },
  { cle: 'incident_binome', nom: 'Incident · binôme non protecteur', icone: '🛡', teinte: '#fb923c',
    juste: 0, total: 0, note: 'non affiché — figure dangereuse en M6/M12 mal protégée',
    verdict: function (t) {
      var v = verdictV7(t, false, {});
      return { oui: !!(v.penalty && (v.penalty.hasPen || v.penalty.hasRed)),
        camp: (v.penalty && v.penalty.encaisseur) || null,
        detail: (v.penalty && v.penalty.hasPen ? 'penalty' : 'aucun')
          + (v.penalty && v.penalty.encaisseur ? ' · contre ' + v.penalty.encaisseur : '') };
    } },
  { cle: 'incident_filiation', nom: 'Incident · filiation double-négative', icone: '🧬', teinte: '#c084fc',
    juste: 0, total: 0, note: 'doctrine Ellemine_D 27/08 — M5⊕M6→M11 et symétriques',
    verdict: function (t) {
      var f = filiationIncidentV7(t);
      return { oui: f.nb > 0, camp: f.camp || null, detail: f.resume };
    } }
];

// ═══════════════════════════════════════════════════════════════
// LE VOTE DES MOTEURS — au volant depuis le 27/08/26, choix d'Ellemine_D.
//
// Ce qui l'a motivé : sur le cas Inter (réel 3-2 pour R1), SEPT moteurs
// sur huit disaient R1 et c'est F4P4, le huitième, qui pilotait — et
// affichait R7. Le système voyait juste et montrait faux.
//
// ⚠️ CE QUE LA MESURE DIT VRAIMENT, ET QUE JE DOIS ÉCRIRE ICI.
// Le « 7/7 » que j'avais annoncé à Ellemine_D était PÉRIMÉ : il datait
// d'avant la correction de la fuite d'échelle de forceCampV7, quand
// ancrage, chaîne et duel étaient cassés. Remesuré une fois réparés :
//     vote seul ....................... 5/7   (Torino reste à égalité)
//     vote, égalité → F4P4 ............ 6/7   ← retenu
//     vote, égalité → ancrage ......... 5/7
//     F4P4 seul (l'ancien) ............ 5/7
// Le vote seul ne gagne donc RIEN sur le banc : il répare Inter et perd
// Torino. C'est le départage à l'égalité qui fait la différence, et ce
// départage est un choix binaire mesuré sur sept cas — une pièce lancée
// en l'air en aurait choisi le bon une fois sur deux. 6/7 sur sept cas
// n'est pas une preuve.
//
// Ce qui reste vrai sans statistique : le verdict ne dépend plus de
// l'angle mort d'un seul moteur. C'est la raison de doctrine, pas la
// raison chiffrée.
//
// ⚠️ ET LES VOTANTS NE SONT PAS INDÉPENDANTS. Accord mesuré par paires :
//     ancrage ↔ chaîne .... 91 %      ancrage ↔ hypo .... 80 %
//     chaîne ↔ hypo ....... 76 %      duel ↔ hypo ....... 74 %
// Quatre moteurs sur huit lisent à peu près la même chose. Une majorité
// de jumeaux n'est pas une majorité : le vote penche mécaniquement du
// côté de la famille chaîne/ancrage. À garder en tête avant de conclure
// quoi que ce soit d'un 6-2.
// ─── LE VOTE DES MOTEURS EST SUPPRIMÉ (01/09/26) ───
// voteMoteursV7 et VERDICT_VOTE_V7 sont retirés avec les dix moteurs qui
// le nourrissaient. Le vote avait été mis « au volant » le 27/08 ; la
// cascade l'en a délogé le 01/09 sans que personne ne le dise à l'écran,
// et Ellemine_D a fini par le voir tout seul. Plutôt que de laisser un
// vote sans votants, il part.
//
// ☠️ ET IL EMPORTE UN MENSONGE D'ÉCRAN. L'en-tête de la carte de verdict
// affichait « — Front 4 · Pôle 4 », ou « Vote des moteurs (repli) »,
// pendant que le camp venait en réalité de moteurV8V7. Le champ
// sourceDecisive nommait un décideur qui ne décidait plus. Corrigé en
// même temps : il nomme maintenant ce qui décide vraiment.
function renderMoteursPanel(theme) {
  var ancien = document.getElementById('moteurs-panel');
  if (ancien) ancien.remove();
  if (!theme) return;
  // Même chaîne d'accueil que les autres panneaux : la carte de verdict
  // vit dans une grille à deux colonnes, s'y insérer directement fait
  // chevaucher le tableau avec le formulaire (constaté à l'écran).
  var hote = document.getElementById('f4p4-panel')
          || document.getElementById('duel-bouclier-panel')
          || document.getElementById('lieux-marquage-panel')
          || document.getElementById('carte-verdict-r');
  if (!hote || !hote.parentNode) return;

  var panneau = document.createElement('div');
  panneau.id = 'moteurs-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:12px; border:1px solid #475569; '
    + 'background:linear-gradient(160deg,#0b1220 0%,#111827 100%);';

  // 1. verdicts de chaque moteur
  var res = moteursActifsV7(MOTEURS_V7).map(function (m) {
    var v = null;
    try { v = m.verdict(theme); } catch (e) { v = null; }
    return { m: m, v: v };
  });
  var nR1 = res.filter(function (r) { return r.v && r.v.camp === 'R1'; }).length;
  var nR7 = res.filter(function (r) { return r.v && r.v.camp === 'R7'; }).length;
  var majorite = nR1 > nR7 ? 'R1' : nR7 > nR1 ? 'R7' : null;

  // 2. noms d'équipe si disponibles
  var t1 = 'R1', t7 = 'R7';
  try {
    var e1 = document.getElementById('team1'), e7 = document.getElementById('team2');
    if (e1 && e1.value) t1 = e1.value;
    if (e7 && e7.value) t7 = e7.value;
  } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }

  function barre(juste, total, teinte) {
    var pct = Math.round(100 * juste / total);
    return '<div style="height:4px; border-radius:3px; background:#1e293b; overflow:hidden; margin-top:4px;">'
      + '<div style="height:100%; width:' + pct + '%; background:' + teinte + ';"></div></div>';
  }

  function carte(r) {
    var m = r.m, v = r.v;
    var j = justesseMoteurV7(m, 'camp');
    var camp = v && v.camp;
    var accord = majorite && camp && camp === majorite;
    var coulCamp = camp === 'R1' ? '#38bdf8' : camp === 'R7' ? '#fb923c' : '#64748b';
    return '<div style="border:1px solid '
      + (accord ? '#334155' : '#475569') + '; border-left:3px solid ' + m.teinte + '; '
      + 'border-radius:8px; padding:8px 10px; background:#0f172a;">'
      + '<div style="display:flex; align-items:baseline; gap:6px;">'
      + '<span style="font-size:13px;">' + m.icone + '</span>'
      + '<span style="font-size:11px; font-weight:700; flex:1;">' + m.nom + '</span>'
      + '<span style="font-size:10px; font-weight:700; color:' + m.teinte + ';"'
      + ' title="' + (j.mesure ? 'justesse rejouée sur le banc' : 'chiffre consigné, non rejoué') + '">'
      + j.juste + '/' + j.total + (j.mesure ? '' : ' ?') + '</span></div>'
      + barre(j.juste, j.total, m.teinte)
      + '<div style="margin-top:7px; font-size:17px; font-weight:800; color:' + coulCamp + '; letter-spacing:.5px;">'
      + (camp ? (camp === 'R1' ? t1 : t7) : 'sans avis') + '</div>'
      + (v && v.detail ? '<div class="muted" style="font-size:9px; line-height:1.35; margin-top:2px;">'
          + v.detail + '</div>' : '')
      + '<div class="muted" style="font-size:8.5px; margin-top:5px; opacity:.75;">' + m.note + '</div>'
      + (majorite && camp && !accord
          ? '<div style="font-size:8.5px; color:#fbbf24; margin-top:3px;">⚡ contre la majorité</div>' : '')
      + '</div>';
  }

  var bttsRes = moteursActifsV7(MOTEURS_BTTS_V7).map(function (m) {
    var v = null; try { v = m.verdict(theme); } catch (e) { v = null; }
    return { m: m, v: v };
  });
  function carteB(r) {
    var m = r.m, v = r.v;
    var j = justesseMoteurV7(m, 'btts');
    var oui = v && v.oui;
    return '<div style="border:1px solid #334155; '
      + 'border-left:3px solid ' + m.teinte + '; border-radius:8px; padding:7px 10px; background:#0f172a;">'
      + '<div style="display:flex; align-items:baseline; gap:6px;">'
      + '<span style="font-size:12px;">' + m.icone + '</span>'
      + '<span style="font-size:10.5px; font-weight:700; flex:1;">' + m.nom + '</span>'
      + '<span style="font-size:10px; font-weight:700; color:' + m.teinte + ';">'
      + j.juste + '/' + j.total + (j.mesure ? '' : ' ?') + '</span></div>'
      + barre(j.juste, j.total, m.teinte)
      + '<div style="margin-top:6px; font-size:15px; font-weight:800; color:'
      + (v ? (oui ? '#4ade80' : '#f87171') : '#64748b') + ';">'
      + (v ? (oui ? 'LES DEUX' : 'UN SEUL') : 'sans avis') + '</div>'
      + (v && v.detail ? '<div class="muted" style="font-size:9px;">' + v.detail + '</div>' : '')
      + '<div class="muted" style="font-size:8.5px; margin-top:4px; opacity:.75;">' + m.note + '</div>'
      + '</div>';
  }

  var ordre = res.slice().sort(function (a, b) {
    var ja = justesseMoteurV7(a.m, 'camp'), jb = justesseMoteurV7(b.m, 'camp');
    return (jb.juste / (jb.total || 1)) - (ja.juste / (ja.total || 1));
  });

  panneau.innerHTML =
      '<div style="display:flex; align-items:baseline; gap:10px; margin-bottom:3px;">'
    + '<h3 style="margin:0;">🏁 Les moteurs gelés</h3>'
    + '<span class="muted" style="font-size:10px;">classés par justesse sur les cas réels</span></div>'
    // ─── PLUS DE « MAJORITÉ » ICI (01/09/26) ───
    // Ce panneau annonçait « majorité R1 » comme si le compte tranchait.
    // Il ne reste que les trois moteurs horsVote, dont la documentation
    // dit qu'ils ne décident de RIEN : afficher leur majorité serait
    // refaire, en plus petit, le mensonge d'écran qu'on vient d'enlever.
    + '<div style="font-size:11px; margin-bottom:9px; color:#94a3b8;">'
    + '<b style="color:#38bdf8;">' + t1 + '</b> ' + nR1 + '  ·  '
    + '<b style="color:#fb923c;">' + t7 + '</b> ' + nR7
    + '  —  <b>aucun de ces moteurs ne décide du verdict.</b> '
    + 'Le camp vient du moteur V8 ; ceux-ci sont en cours de vérification '
    + 'à l\'aveugle sur les matchs gelés.</div>'
    + '<div style="display:grid; gap:8px; grid-template-columns:repeat(auto-fill,minmax(215px,1fr));">'
    + ordre.map(carte).join('') + '</div>'
    + '<div style="margin:12px 0 5px; font-size:11px; font-weight:700; color:#94a3b8;">Les deux marquent</div>'
    + '<div style="display:grid; gap:8px; grid-template-columns:repeat(auto-fill,minmax(215px,1fr));">'
    + bttsRes.map(carteB).join('') + '</div>'
    + '<div class="hint" style="margin-top:9px; font-size:9px;">'
    + 'Les scores sont désormais REJOUÉS à chaque affichage sur les cas de '
    + 'CAS_REFERENCE_V7 (voir le banc, plus bas) — ils suivent le code au lieu d\'être '
    + 'recopiés à la main. Aucun moteur ne dépasse 6/7, et 5/7 sur sept cas ne se '
    + 'distingue pas d\'un tirage à pile ou face — ce tableau sert à accumuler, pas à conclure. '
    + 'Un moteur « contre la majorité » n\'a pas tort pour autant : c\'est là que se gagnent '
    + 'les départages.</div>';
  hote.parentNode.insertBefore(panneau, hote.nextSibling);
}

// ═══════════════════════════════════════════════════════════════
// LE PROFIL DU SCORE — ce que le générateur de score produit VRAIMENT.
//
// Constat du 27/08/26, en cherchant pourquoi le score est 0/8 en exact.
// Ce n'est pas un défaut de réglage, c'est structurel :
//     écart de buts = 2 dans 91 % des thèmes (jamais 0, jamais 1)
//     total de buts = 6 dans 74 %, 8 dans 16 %
// Autrement dit le moteur dit presque toujours « quelqu'un gagne de deux
// buts, dans un match à six buts ». Il ne peut donc structurellement PAS
// annoncer un nul ni une victoire d'un but — c'est-à-dire la moitié des
// matchs réels. Les scores de l'archive : 6-1, 3-2, 7-0, 0-1, 1-1, 0-2,
// 4-0, 0-1 — écarts 5, 1, 7, 1, 0, 2, 4, 1.
//
// La mesure est refaite par le code, jamais recopiée. Elle coûte ~27 ms
// par thème, donc elle est calculée EN DIFFÉRÉ après le premier rendu,
// une seule fois par session, et le panneau se remplit quand elle
// arrive. Bloquer le rendu trois secondes pour ça serait absurde.
var _profilScoreV7 = null;
var _profilScoreEnCoursV7 = false;
var PROFIL_SCORE_ECHANTILLON_V7 = 96;

function profilScoreV7(quandPret) {
  if (_profilScoreV7) { if (quandPret) quandPret(_profilScoreV7); return _profilScoreV7; }
  if (_profilScoreEnCoursV7) return null;
  _profilScoreEnCoursV7 = true;
  var ecarts = {}, totaux = {}, n = 0, i = 0;
  var graines = [];
  for (var a = 0; a < 16 && graines.length < PROFIL_SCORE_ECHANTILLON_V7; a++) {
    for (var b = 0; b < 16 && graines.length < PROFIL_SCORE_ECHANTILLON_V7; b++) {
      graines.push([FIGS_V7[a], FIGS_V7[b], FIGS_V7[(a * 5 + 3) % 16], FIGS_V7[(b * 7 + 1) % 16]]);
    }
  }
  function tranche() {
    var fin = Math.min(i + 8, graines.length);
    for (; i < fin; i++) {
      try {
        var t = buildThemeFromMothers(graines[i][0], graines[i][1], graines[i][2], graines[i][3]);
        var v = getVerdictAfficheReel(t);
        if (!v || v.goalM1 == null) continue;
        var d = Math.abs(Number(v.goalM1) - Number(v.goalM7));
        var som = Number(v.goalM1) + Number(v.goalM7);
        ecarts[d] = (ecarts[d] || 0) + 1;
        totaux[som] = (totaux[som] || 0) + 1;
        n++;
      } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    }
    if (i < graines.length) { setTimeout(tranche, 0); return; }
    _profilScoreV7 = { n: n, ecarts: ecarts, totaux: totaux };
    _profilScoreEnCoursV7 = false;
    if (quandPret) quandPret(_profilScoreV7);
    var cible = document.getElementById('banc-score-profil');
    if (cible) cible.innerHTML = htmlProfilScoreV7(_profilScoreV7);
  }
  setTimeout(tranche, 0);
  return null;
}

function htmlProfilScoreV7(p) {
  if (!p || !p.n) return '<span class="muted">mesure indisponible</span>';
  function top(o, libelle) {
    var cles = Object.keys(o).sort(function (x, y) { return o[y] - o[x]; }).slice(0, 3);
    return cles.map(function (k) {
      var pct = Math.round(o[k] * 1000 / p.n) / 10;
      return '<span style="display:inline-block; margin-right:10px;">'
        + libelle + ' <b>' + k + '</b> — <b style="color:'
        + (pct > 60 ? '#f87171' : pct > 30 ? '#fbbf24' : '#94a3b8') + ';">' + pct + '%</b></span>';
    }).join('');
  }
  var e2 = p.ecarts[2] || 0;
  return '<div>' + top(p.ecarts, 'écart') + '</div>'
    + '<div style="margin-top:2px;">' + top(p.totaux, 'total') + '</div>'
    + '<div style="margin-top:3px; color:#f87171;">'
    + 'Sur ' + p.n + ' thèmes, l\'écart de buts vaut 2 dans '
    + Math.round(e2 * 1000 / p.n) / 10 + '% des cas. Le moteur n\'annonce jamais un nul '
    + 'ni une victoire d\'un but — soit environ la moitié des matchs réels. '
    + 'Tant que ce profil ne bouge pas, le SCORE exact n\'est pas prédictible, '
    + 'quel que soit le moteur de camp.</div>';
}

