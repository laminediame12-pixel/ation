// ═══════════════════════════════════════════════════════════════
// VALIDITE ACCORD V8
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
var REJET_THEME_INVALIDE_V7 = false;
var SEUIL_VALIDITE_V7 = 3;
// La porte de l'écran : elle ne parle que si le rejet est armé.
function themeRejeteV7(theme) {
  if (!REJET_THEME_INVALIDE_V7) return null;
  return sousSeuilValiditeV7(theme);
}
// Le critère pur, toujours calculé, jamais gouverné par le drapeau.
function sousSeuilValiditeV7(theme) {
  var nv = null;
  try { nv = niveauValiditeV7(theme); } catch (e) { return null; }
  if (!nv || !nv.applicable) return null;
  if (nv.detruit) {
    return { rejete: true, niveau: 0, detruit: true, seuil: SEUIL_VALIDITE_V7,
      manques: ['thème détruit — ' + (FL[nv.figM1] || nv.figM1) + ' en M1'] };
  }
  if (nv.niveau >= SEUIL_VALIDITE_V7) return { rejete: false, niveau: nv.niveau, seuil: SEUIL_VALIDITE_V7 };
  // Ce qui manque se lit maintenant sur les TROIS critères du thème
  // lui-même (04/09/26) — plus une ligne par axe de chaque dérivé. Cf. le
  // bloc de niveauValiditeV7 : les dérivés restent calculés, mais ils
  // appartiennent à la porte de confiance, pas à la validation.
  var manques = [];
  if (!nv.base.axes.ok) {
    ['cardinal', 'succedent', 'cadent'].forEach(function (k) {
      if (nv.base.axes[k] && !nv.base.axes[k].ok) manques.push('axe ' + k + ' ('
        + (FL[nv.base.axes[k].fig] || nv.base.axes[k].fig) + ') absent');
    });
  }
  if (!nv.base.binome.ok) manques.push('binôme de M1 ('
    + (FL[nv.base.binome.fig] || nv.base.binome.fig) + ') absent');
  if (!nv.fdjOk) manques.push('figure du jour ('
    + (FL[nv.fdj] || nv.fdj) + ') absente');
  return { rejete: true, niveau: nv.niveau, seuil: SEUIL_VALIDITE_V7,
    manques: manques, fdj: nv.fdj, fdjOk: nv.fdjOk };
}

// ═══════════════════════════════════════════════════════════════
// L'ACCORD F4P4 / CRITÈRES — la seule structure du CAMP (30/08/26)
//
// Ellemine_D : « creuse le camp ». C'est la famille qui traîne — le nul
// est à 34/39, le BTTS à 25/29, le camp à 27/39.
//
// CHAQUE MOTEUR SEUL, sur les 30 matchs DÉCIDÉS de l'archive :
//     F4P4 ..................... 21/30 = 70 %
//     critères (sans conc./env.) 20/30 = 67 %
//     chaîne d'ancrage ......... 18/30 = 60 %
//     vote des moteurs ......... 16/29 = 55 %
//     protocole R1/R7 ...........  9/17 = 53 %   (muet 13 fois)
//     lecture des sièges ....... 13/28 = 46 %
//     réseau d'ancrage ......... 12/28 = 43 %
//     témoin « toujours R1 » ... 18/30 = 60 %
//
// ☠️ DEUX MOTEURS DE LA CHAÎNE SONT SOUS LE TÉMOIN. Les sièges (46 %) et
// le réseau (43 %) font moins bien que de parier toujours sur R1. Ils
// restent dans la cascade parce qu'ils ne sont atteints qu'après quatre
// autres — mais il faut le savoir.
//
// ☠️ ET LA CASCADE ENTIÈRE NE FAIT PAS MIEUX QUE SON PREMIER MOTEUR.
// (Chiffres repris le 30/08/26 après le deuxième triplet, archive à 36
// matchs décidés. Les séries à 30 et 33 sont périmées.)
//     la chaîne branchée (critères en tête) ... 22/36
//     F4P4 en tête, même suite ............... 22/36
//     F4P4 TOUT SEUL ......................... 22/36
//     critères tout seuls .................... 23/36
//     témoin « toujours R1 » ................. 21/36
// Six moteurs derrière F4P4 n'ajoutent toujours pas un seul cas : « F4P4
// en tête » et « F4P4 tout seul » donnent le MÊME nombre. La cascade est
// une décoration. Et les trois lectures tiennent maintenant dans un
// écart d'un cas — laquelle est « la meilleure » change à chaque match
// qui arrive. Rien ne justifie de retoucher l'ordre, aujourd'hui pas
// plus qu'en 2023.
//
// ⚠️ ET LA MISE EN GARDE QUE JE M'ÉTAIS FAITE À MOI-MÊME. J'allais
// écrire « le camp ne bat pas le témoin, p = 0,589 ». C'est vrai en
// justesse brute et c'est TROMPEUR : le témoin « toujours R1 » obtient
// ses 58 % en ne nommant JAMAIS R7. Découpé par camp réel (36 cas) :
//     F4P4   — R1 14/21 (67 %) · R7 8/15 (53 %)   → équilibré à 60 %
//     témoin — R1 21/21 (100 %) · R7 0/15 (0 %)   → équilibré à 50 %
// Sur les 15 matchs gagnés par R7, F4P4 en trouve 8 et le témoin 0 :
// p = 0,0002. C'est le SEUL résultat solide de tout cet étage — le
// moteur de camp lit les deux côtés, le témoin est dégénéré. Mais
// l'avantage équilibré s'est réduit de 69 % à 60 % en six matchs.
//
// ☠️ CE QUE VAUT F4P4 SELON CE QU'IL DIT, ET COMMENT JE M'EN SUIS SERVI
// DE TRAVERS. À 33 cas j'avais mesuré « quand F4P4 dit R1 → 14/18,
// 78 % », en notant que ça battait une pièce (p = 0,015) mais pas le
// taux de base de R1. Puis le deuxième triplet est arrivé : F4P4 disait
// R1 sur ses TROIS thèmes, j'ai pris cette unanimité pour un signal, et
// le match a fini 3-4 pour R7. Le compteur :
//     quand F4P4 dit R1 → 14 justes sur 21   (67 %, p = 0,095 vs pièce)
//     quand F4P4 dit R7 →  8 justes sur 15   (53 %)
// Le 78 % n'a jamais existé : c'était 18 cas. ⚠️ ET SURTOUT : TROIS
// LECTURES DU MÊME MOTEUR NE SONT PAS TROIS MOTEURS. Quand F4P4 se
// trompe, il se trompe sur les trois thèmes à la fois. Une unanimité
// interne n'ajoute AUCUNE information — c'est un cas, pas trois. Je le
// savais et je l'ai fait quand même parce que le mot « unanime » sonne
// comme une preuve.
//
// ☠️ L'ACCORD DES DEUX PREMIERS EST MORT. C'était la structure que je
// croyais utilisable ; voici sa trajectoire, mesure après mesure :
//     19 cas → accord 79 % · désaccord 55 %   p = 0,225
//     33 cas → accord 70 % · désaccord 46 %   p = 0,276
//     36 cas → accord 67 % (14/21) · désaccord 53 % (8/15)   p = 0,499
// L'écart rétrécit à CHAQUE fois que des données arrivent. C'est la
// signature d'un motif qui n'existait pas : un vrai effet se resserre
// autour de sa valeur, il ne fond pas. p = 0,499, c'est pile ou face.
//
// ☠️ ET IL A DÉSIGNÉ LE MAUVAIS THÈME SUR LES DEUX TRIPLETS JOUÉS.
//   30/08, réel 3-1 R1 :
//     FortMajLaet2  dit nul   F4P4 R1 · critères R7   désaccord
//     FortMajAlbus  dit R1    F4P4 R7 · critères R1   désaccord  ← LE BON
//     ConjCaput2    dit R7    F4P4 R7 · critères R7   ACCORD     ← faux
//   30/08, réel 3-4 R7 :
//     CarcPuella    dit R1    F4P4 R1 · critères R1   ACCORD     ← faux
//     CarcCaput     dit R7    F4P4 R1 · critères R7   désaccord  ← LE BON
//     FortMajFMin   dit R7    F4P4 R1 · critères R7   désaccord  ← LE BON
// 0 sur 2, et les deux fois le thème gagnant était en DÉSACCORD. C'est
// le seul test répété que cette bande possède et elle le perd
// systématiquement. NE JAMAIS s'en servir pour choisir dans un triplet.
// Affiché seulement, branché sur rien — et à ne plus lire comme un
// signal du tout.
// ⚠️ 30/08/26 — CES TAUX ÉTAIENT CODÉS EN DUR ET ILS ONT VIEILLI TROIS
// FOIS EN UN JOUR (15/20 puis 14/20 puis 14/21, pendant que l'écran
// affichait encore les premiers). Un chiffre écrit à la main dans du
// code est un chiffre qui ment dès le cas suivant. Il se calcule
// maintenant sur l'archive, une fois, et se met à jour tout seul.
var _CACHE_ACCORD_V7 = null;
function bilanAccordV7() {
  if (_CACHE_ACCORD_V7) return _CACHE_ACCORD_V7;
  var vide = { accord: { juste: 0, sur: 0, taux: 0 }, desaccord: { juste: 0, sur: 0, taux: 0 }, p: 1 };
  var cas = [];
  try { cas = tousCasBancV7() || []; } catch (e) { return vide; }
  var a = [0, 0], d = [0, 0];
  // Le cache est posé AVANT la boucle : accordCampV7 est atteignable
  // depuis getVerdictAfficheReel, et sans ça on repartirait en boucle.
  _CACHE_ACCORD_V7 = vide;
  cas.forEach(function (c) {
    if (!c || !c.camp || c.camp === 'nul') return;
    var t, f4 = null, cr = null;
    try { t = buildThemeFromMothers(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    try { var m = moteurF4P4V7(t); f4 = m && m.applicable && m.avantage ? m.avantage : null; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var q = moteurCritereV7(t, POIDS_SANS_CONC_ENV_V7); cr = q && q.camp ? q.camp : null; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    if (!f4 || !cr) return;
    // ⚠️ Ne PAS rejouer getVerdictAfficheReel ici. Mesuré au chronomètre,
    // premier lancement / lancement suivant :
    //     avant ce cache ................ 5 132 ms / 1 120 ms
    //     cache avec la carte complète .. 6 063 ms / 1 379 ms
    //     cache par la chaîne seule ..... 5 369 ms / 1 401 ms  ← retenu
    // (Les 5 s du premier lancement existaient DÉJÀ : elles viennent des
    // autres rejeux d'archive, pas d'ici. J'ai d'abord lu « 1,4 s → 6,1 s »
    // en comparant le premier lancement au second du même build, ce qui
    // ne compare rien. Ce cache-ci coûte ~240 ms.)
    // Le camp affiché, quand le nul n'est pas imposé, c'est exactement ce
    // que renvoie la chaîne de priorité : résultat identique (14/21 et
    // 8/16) pour une fraction du coût.
    var nulActif = false;
    try {
      nulActif = nulActifV7(t,
        (typeof STRUCTURE_NUL_DECISIVE !== 'undefined' && STRUCTURE_NUL_DECISIVE) ? structureDuNul(t) : null,
        (typeof AXE_SUCCEDENT_DECISIF !== 'undefined' && AXE_SUCCEDENT_DECISIF
          && typeof signalAxeSuccedentOpposition === 'function') ? signalAxeSuccedentOpposition(t) : null);
    } catch (e) { nulActif = false; }
    var dit = 'nul';
    if (!nulActif) { try { dit = overrideVerdictV7(t, false) || cr; } catch (e) { dit = cr; } }
    var b = (f4 === cr) ? a : d;
    b[dit === c.camp ? 0 : 1] += 1;
  });
  function pack(x) {
    var n = x[0] + x[1];
    return { juste: x[0], sur: n, taux: n ? Math.round(100 * x[0] / n) : 0 };
  }
  _CACHE_ACCORD_V7 = { accord: pack(a), desaccord: pack(d), p: fisherExactV7(a[0], a[1], d[0], d[1]) };
  return _CACHE_ACCORD_V7;
}

function accordCampV7(theme) {
  var f4 = null, cr = null;
  try { var m = moteurF4P4V7(theme); f4 = m && m.applicable && m.avantage ? m.avantage : null; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  try { var c = moteurCritereV7(theme, POIDS_SANS_CONC_ENV_V7); cr = c && c.camp ? c.camp : null; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  if (!f4 || !cr) return { lisible: false, f4p4: f4, criteres: cr };
  var b = bilanAccordV7();
  var cle = (f4 === cr) ? 'accord' : 'desaccord';
  return { lisible: true, f4p4: f4, criteres: cr, accord: f4 === cr,
    taux: b[cle].taux, juste: b[cle].juste, sur: b[cle].sur,
    autreJuste: b[f4 === cr ? 'desaccord' : 'accord'].juste,
    autreSur: b[f4 === cr ? 'desaccord' : 'accord'].sur,
    p: b.p, mort: true };
}

// ═══════════════════════════════════════════════════════════════
// ✦✦ LE MOTEUR V8 — LA REPRISE À ZÉRO (31/08/26) ✦✦
//
// Décision d'Ellemine_D : « on reprend à zéro. Le socle on le garde —
// MAP_GEO, les figures et leur élément naturel, les binômes,
// l'antagoniste, les maisons et leurs éléments, la rotation, la
// compatibilité des quatre éléments, les pôles, F4P4, le théorème
// d'Ellemine, les tableaux, les planètes. C'est seulement les MOTEURS
// qu'on attaque, et deux moteurs suffiront : quand R1 et R7 sont dans
// une même boucle, et quand ils sont dans des boucles différentes. »
//
// ✔ ET LA MESURE LUI DONNE RAISON SUR LE FOND : les deux configurations
// ne se comportent pas pareil. Sur les 51 cas au camp connu, chacune
// pèse exactement la moitié des thèmes (32 768 sur 65 536, vérifié) :
//                            MÊME BOUCLE   BOUCLES DIFFÉRENTES
//     fréquence du nul .....  8/25  32 %    4/26  15 %
//     R1 gagne (décidés) ... 12/17  71 %   11/22  50 %
//     partage de la synthèse 11/17  65 %   18/22  82 %
//     porte du nul ......... 19/25  76 %   24/26  92 %
//     les deux marquent .... 11/19  58 %   17/22  77 %
//     camp doublé ..........  3/8   38 %   11/15  73 %
// Aucun de ces contrastes n'est significatif seul (p de 0,14 à 0,33) —
// mais LES SIX POINTENT DANS LE MÊME SENS. Six familles mesurées
// indépendamment, unanimes : tout se lit mieux en boucles différentes,
// et le nul est deux fois plus fréquent en même boucle. C'est la
// cohérence qui parle, pas les p isolés.
//
// ☠️ ET LA SURPRISE QU'IL FAUT DIRE : LE PARTAGE NE RAPPORTE RIEN EN
// MÊME BOUCLE. Là, rien ne bat le témoin « toujours R1 » (15/25 pour le
// témoin, 15/25 pour le partage). Le découpage en deux moteurs
// n'améliore donc PAS le score total — les deux architectures font
// 35/51. Ce que le découpage apporte, c'est de savoir OÙ la lecture
// travaille et où elle ne fait que suivre un taux de base.
//
// LES DEUX FORMES, mesurées sur les 51 cas :
//     règle simple partout ... 35/51  69 %  · équilibré 70 % · R7 14/16
//     les deux moteurs ....... 35/51  69 %  · équilibré 68 % · R7 11/16
//     l'ancienne cascade ..... 30/51  59 %  · équilibré 61 % · R7 11/16
// Même total pour les deux nouvelles ; la simple est meilleure sur R7,
// le camp le plus dur à voir. L'archive ne peut donc pas les départager
// et trancher sur deux points d'écart serait ajuster du bruit : les deux
// sont construites, ARCHI_V8 passe de l'une à l'autre, et c'est le
// journal gelé qui décidera sur des matchs à venir.
//
// ☠️ CE QUE CES 69 % NE SONT PAS. Le partage de la synthèse a été
// DÉCOUVERT sur ces mêmes 51 cas. 69 % est donc une description du
// passé, exactement comme les 59 % de l'ancienne cascade l'étaient. Le
// premier match jamais annoncé à l'avance (Porto-Roma, 6-3) a vu les
// deux thèmes se tromper sur le camp, le score ET le BTTS. Ce moteur
// n'aura une performance que le jour où PREDICTIONS_GELEES.md en
// portera dix.
//
// L'ancienne cascade reste entière derrière MOTEUR_V8_ACTIF = false :
// rien n'est détruit, tout est réversible d'un booléen.
var MOTEUR_V8_ACTIF = true;
var ARCHI_V8 = 'simple';   // 'simple' (une règle partout) ou 'deux' (par boucle)

// R1 et R7 sont-ils dans la même boucle ? C'est le seul aiguillage.
// ═══════════════════════════════════════════════════════════════
// ✦ LA RÉCOLTE (31/08/26) — « on récolte les détails d'abord »
//
// ┌───────────────────────────────────────────────────────────────┐
// │  L'INVENTAIRE — VINGT-DEUX LOIS, ET CE QUI LES GARDE          │
// └───────────────────────────────────────────────────────────────┘
// Tout ce que la fouille a établi est ici, et chaque loi de STRUCTURE
// est revérifiée à chaque appel de autoTestAlternanceV7(), qui rend
// tout: true seulement si les quatre-vingt-onze contrôles passent. Une loi
// qui céderait un jour ferait basculer ce drapeau — elle n'est pas
// seulement écrite, elle est gardée.
//
//   A · les cinq relations sont des décalages constants ...... decalages 16
//   B · maison impaire → boucle A, paire → boucle B .......... pariteBoucle 16
//   C · même boucle → B, boucles différentes → A ............. composition 256
//   D · pourquoi l'alternance existe : tous les pas basculent . (A+B+C)
//   E · les quatre figures d'air se reposent en M3-7-11-15 ... airMod4 16
//       et le partage d'élément avec la maison vaut le hasard . partageElement 4
//   F · les lignes actives suivent le triangle de Pascal ..... pascal 1
//   H · la figure dans la maison de son antagoniste .......... pariteDecalage 16
//   I · les cinq relations, la table complète ................ boucliersBinome 16
//       le bouclier est le front du front du binôme ..... binomeBouclierTristitia 16
//       la loi du cardinal : impair → permutation ....... cardImpair 16 / cardPair 15
//       le quatuor est le front décalé de Tristitia ..... quatuorTristitia 16
//       la roue est double ............................. roueDouble 15
//       quatre maisons inatteignables .................. inatteignables 4 / couvertes 12
//   J · la destruction est l'antagonisme retourné ............ destAntag 16
//       l'antagonisme n'est pas réciproque ............. destPasReciproque 16
//       le bouclier détruit l'antagoniste .............. bouclierTueAntag 16
//       personne ne rend son coup ...................... riposteDirecte 0 / DeuxCoups 0
//       détruire 2 fois = binôme(front), 4 fois = bouclier(binôme) . destDeux/Quatre 16
//       cinq voies pour seize attaques, jamais mêlées ... nbVoies 5 · voiesSeparees 1
//   K · le binôme est le voisin, vers l'extérieur ............ binomeVoisin 14 / retour 2
//       l'antagoniste dessine quatre faisceaux concentriques . famillesArcs 4
//       les concentriques ne se croisent jamais ........ croiseDedans 0 / Dehors 45
//       la pyramide de couverture ...................... pyramide 16
//   L · l'énergie saute la victime : f compatible avec f+6 ... energieSaut 15
//       l'unique exception est Populus ⇢ Amissio ....... exceptionEnergie populus
//       au coup direct il n'y a rien ................... energieDirecte 8
//   M · le bas ne se croise jamais ........................... croisBas 0
//       le binôme est la seule relation planaire ....... decalagesPlanaires 2
//       chaque retour monté coûte douze ................ 45 · 57 · 69
//       un arc n'épargne que ses voisins ............... plEpargne 16
//       le fossé : dans un faisceau 2-6, dehors 11-13 .. fosse 1
//       Laetitia et Populus seules déséquilibrées ...... degreEquilibre 16
//       un panier fermé, un panier ouvert .............. couvercle 7
//   N · les identités du thème, et les trajectoires qui s'effondrent
//       ................................................ identitesTheme 1 · reductions 1
//       trigone(M1) ⊕ trigone(M7) = rectangle ⊕ M1 ⊕ M7 . partageTrigones 1
//       les quatre diagonales se croisent .............. diagonales 4
//   O · le moteur de la destruction et le quatrième axe ...... (mesures, pas structure)
//   P · les triangles du carré : sa règle et son domaine exact . triTotal 220
//       un par axe et sans voisines → toujours isocèle ... triUnParAxeSansVoisin 28 / Scal 0
//       même axe toujours isocèle, deux axes jamais ...... triMemeAxeIso 12 · triDeuxAxesScal 144
//   Q · l'affirmation d'une trajectoire ....................... (mesures, pas structure)
//   R · la règle du miroir : sa remarque engendre TOUS les isocèles
//       ................................................ miroirEngendres 52 · miroirScalenes 0
//   S · le diamètre de la troisième paire, et l'angle droit .. diamTroisieme 12 · diamPerp 12
//   T · les deux zones du carré portent le même jeu de catégories
//       ................................................ zoneCatM1 3 · zoneCatM7 3
//       et la dignité refuse désormais un nom non canonique . digniteRefuseAffichage 4
//   U · la base miroir est partagée : tout score additif s'annule
//       ................................ baseAnnuleeConst 1 · baseAnnuleeApex 1
//       le pôle n'est qu'une translation : somme = apex ⊕ base
//       ................................ trianglesTranslation 1 · MemeCollapse 1
//       deux triangles coïncident ssi leurs bases coïncident . CoincidenceBase 1
//   V · la force d'une trajectoire, et les zones aux trajectoires fortes
//       ................................ forceMaxPopulus 28 · forceNulleSsiAbsente 1
//       le seuil de « forte » vaut une angulaire . seuilForteVautAngulaire 1
//   G · ce qui reste sans réponse ............ (en dernier, rien à vérifier)
//
// ⚠️ L'ORDRE DES LETTRES. G a été écrite avant H à O et elle est restée
// EN FIN DE BLOC, à sa place logique : c'est la liste des questions
// ouvertes, elle se lit en dernier. Les lettres ne sont donc pas dans
// l'ordre alphabétique du fichier — elles sont citées vingt-sept fois
// ailleurs dans le code et les renommer casserait ces renvois.
//
// ☠️ ET CE QUE LA RÉCOLTE N'A PAS DONNÉ, redit ici pour que personne ne
// lise cet inventaire comme une victoire : AUCUNE de ces lois ne
// bat le hasard sur les 39 duels de l'archive (loi O.4). Elles disent
// comment la table est faite. Elles ne disent pas qui gagne.
//
// Sa consigne, et elle est la bonne : rassembler les faits AVANT de
// bâtir un moteur. Ce qui suit ne prédit rien et n'est branché sur rien.
// Ce sont des propriétés de la table, vraies avant qu'un thème existe,
// toutes vérifiées exhaustivement (16/16 ou 256/256).
//
// ── A · LES CINQ RELATIONS SONT DES DÉCALAGES CONSTANTS ── 16/16 chacune
//     binôme .......... +2 maisons
//     front ........... +4
//     front du front .. +8
//     bouclier ........ +10
//     antagoniste ..... +13
//     et aucune figure n'est jamais son propre rôle (0 cas sur 64).
//
// ── B · PARITÉ ET BOUCLE ── 16/16
//     maison IMPAIRE → sa figure de repos est de boucle A
//     maison PAIRE   → boucle B
//     L'alternance est parfaite sur les seize.
//
// ── C · LA LOI DE COMPOSITION DES BOUCLES ── 256/256
//     deux figures de la MÊME boucle donnent une figure de boucle B
//     deux figures de boucles DIFFÉRENTES donnent une figure de boucle A
//     ☠️ Je l'avais d'abord écrite à l'envers (« même boucle → A »), et
//     mon propre contrôle a répondu 0/256. C'est LOOP_B le sous-groupe,
//     parce que c'est lui qui contient Populus, l'élément neutre.
//
// ── D · POURQUOI L'ALTERNANCE A/B EXISTE ── vérifié figure par figure
//     Combiner avec une figure de boucle A fait TOUJOURS basculer la
//     boucle (16/16 pour chacune des huit). Combiner avec une figure de
//     boucle B la préserve toujours.
//     Or les quatre pas de la marche des repos — Acquisitio, Via, Puer,
//     Cauda Draconis — sont TOUS DE BOUCLE A. Donc chaque pas bascule,
//     et partant de Puer (boucle A) on obtient A, B, A, B…
//     ➜ La loi B n'est pas une coïncidence : elle découle de la loi D.
//     ☠️ J'avais d'abord écrit « la marche alterne un pas qui bascule et
//     un pas qui préserve ». Faux : TOUS les pas basculent, et
//     l'explication est plus simple que celle que j'avais donnée.
//
// ── E · LES ÉLÉMENTS ──
//     Les quatre figures d'AIR se reposent exactement en M3, M7, M11,
//     M15 — toutes les maisons ≡ 3 (mod 4). Aucun des trois autres
//     éléments n'a de régularité comparable :
//         feu   M1, M2, M9, M16       terre M8, M10, M12, M14
//         eau   M4, M5, M6, M13
//     Une figure partage l'élément de sa maison de repos 4 fois sur 16 —
//     exactement ce que donnerait le hasard. Il n'y a rien là.
//
// ── F · LES LIGNES ACTIVES ──
//     Répartition du nombre de lignes à un point : 1, 4, 6, 4, 1.
//     C'est le triangle de Pascal : les seize figures sont TOUTES les
//     combinaisons de quatre lignes, sans exception ni doublon.
//     Deux extrêmes : Populus (0 active, M16, boucle B) et Via
//     (4 actives, M5, boucle A). Elles ne sont ni binômes ni
//     antagonistes l'une de l'autre.
//
// ── H · LA FIGURE DANS LA MAISON DE SON ANTAGONISTE ── (sa question)
//     Son exemple : Puer en M14, la maison de Puella son antagoniste.
//     Puer + Puella = Conjunctio. VÉRIFIÉ, et les seize suivent.
//     Les résultantes ne sont que CINQ figures, toutes de boucle A,
//     toutes en maison impaire :
//         Puer M1 (4×) · Caput Draconis M3 (4×) · Conjunctio M11 (4×)
//         Via M5 (2×) · Cauda Draconis M13 (2×)
//
//     ✔✔ ET LA LOI QUI L'EXPLIQUE, vérifiée sur les cinq relations,
//     16/16 chacune :
//         binôme .......... +2  pair    → résultante de boucle B
//         front ........... +4  pair    → boucle B
//         front du front .. +8  pair    → boucle B
//         bouclier ........ +10 pair    → boucle B
//         antagoniste ..... +13 IMPAIR  → boucle A
//     DÉCALAGE PAIR → résultante de boucle B, en maison paire.
//     DÉCALAGE IMPAIR → résultante de boucle A, en maison impaire.
//     C'est une conséquence directe de la loi C : un décalage pair garde
//     la même boucle (donc la combinaison donne B), un décalage impair
//     change de boucle (donc la combinaison donne A).
//
//     ➜ DES CINQ RELATIONS, SEUL L'ANTAGONISTE A UN DÉCALAGE IMPAIR.
//     C'est le seul dont la résultante tombe en maison impaire, et donc
//     le seul qui ne se comporte pas comme les quatre autres. Le fichier
//     le traitait déjà à part partout — on le RETRANCHE dans le moteur
//     des sept critères, il est le seul « ennemi » du quatuor — mais
//     c'était une doctrine. C'en est maintenant une conséquence de la
//     structure : l'antagoniste est le seul rôle qui change de boucle.
//
//     Deux cas particuliers dans la table, et ils viennent tous deux de
//     Populus, l'élément neutre : Caput Draconis + Populus = Caput
//     Draconis (elle reste elle-même), et Populus + Cauda = Cauda.
//     Ce sont les deux seuls cas où la résultante EST l'une des deux.
//
// ── I · LES CINQ RELATIONS, LA TABLE COMPLÈTE ── (« on creuse »)
//     La figure PLACÉE DANS LA MAISON de chacun de ses cinq parents,
//     et combinée avec l'occupant de cette maison. Les seize, à chaque
//     fois. Ce qui sort :
//         binôme     +2  → 3 résultantes  M2 Laetitia ×8 · M6 Amissio ×4
//                                         · M14 Puella ×4
//         front      +4  → 2  M4 Albus ×8 · M12 Fortuna Major ×8
//         front du front +8 → 1  M8 Tristitia ×16
//         bouclier   +10 → 3  M6 Amissio ×4 · M10 Carcer ×8 · M14 Puella ×4
//         antagoniste +13 → 5 M1 Puer ×4 · M3 Caput Dr. ×4 · M5 Via ×2
//                            · M11 Conjunctio ×4 · M13 Cauda Dr. ×2
//     Les nombres 3, 2, 1, 3, 5 ne sont pas neufs : ce sont ceux du
//     point 7 de la loi d'alternance, qui dit déjà que le nombre de
//     résultantes ne dépend QUE de la distance. C'est le contenu des
//     cases qui est neuf.
//
//     ✔ I.1 · LE BOUCLIER EST LE FRONT DU FRONT DU BINÔME ── 16/16
//         +10 = +2 puis +8, et l'ordre ne compte pas : bouclier(f) vaut
//         aussi bien frontDuFront(binôme(f)) que binôme(frontDuFront(f)).
//         Conséquence immédiate, vérifiée à part : binôme ⊕ bouclier =
//         TRISTITIA, 16/16 — la même constante que figure ⊕ front du
//         front. Le bouclier n'est donc pas un cinquième rôle
//         indépendant : c'est le binôme vu depuis l'autre bout de l'axe.
//         ➜ ET C'EST CE QUI EXPLIQUE LE SEUL CHEVAUCHEMENT DE LA TABLE.
//         Sur les dix paires de relations, neuf ont des résultantes
//         entièrement disjointes ; la seule qui partage quelque chose est
//         binôme ∩ bouclier = { M6 Amissio, M14 Puella }. Elles se
//         touchent parce qu'elles sont à huit maisons l'une de l'autre.
//
//     ✔ I.2 · LA LOI DU CARDINAL ── 31/31 sous-ensembles
//         On somme un sous-ensemble quelconque des cinq rôles (figure,
//         binôme, front, bouclier, antagoniste) :
//           nombre IMPAIR de rôles → le résultat est une PERMUTATION des
//             seize figures : chacune sort exactement une fois. 16/16
//             sous-ensembles impairs.
//           nombre PAIR de rôles → au plus CINQ valeurs, jamais plus.
//             15/15 sous-ensembles pairs.
//         Aucun cas intermédiaire sur les trente et un.
//
//     ✔ I.3 · LE QUATUOR EST LE FRONT DÉCALÉ DE TRISTITIA ── 16/16
//         figure ⊕ binôme ⊕ front ⊕ bouclier donne les deux mêmes
//         figures que le front seul — M4 Albus ×8, M12 Fortuna Major ×8 —
//         mais ÉCHANGÉES : 0 maison sur 16 donne la même. Raison :
//         binôme ⊕ bouclier = Tristitia (I.1), et Albus ⊕ Tristitia =
//         Fortuna Major. Le quatuor ne dit rien de plus que le front ;
//         il le dit à l'envers.
//         En ajoutant l'antagoniste, la somme des CINQ redevient une
//         permutation des seize (loi I.2) : image = h+1 pour douze
//         maisons, h+9 pour les quatre maisons h ≡ 2 (mod 4).
//
//     ✔ I.4 · LA ROUE EST DOUBLE ── 15/15 distances
//         Pour n'importe quelle distance d, la résultante en maison h et
//         celle en maison h+8 sont la MÊME figure. Les huit premières
//         maisons décident tout ; les huit suivantes répètent.
//         Ce n'est pas une coïncidence : repos(h+8) = repos(h) ⊕
//         Tristitia (point 5 de la loi d'alternance), et le Tristitia
//         s'annule des deux côtés de la combinaison.
//         Même chose pour le miroir : l'ensemble des résultantes à
//         distance d est identique à celui à distance 16−d, 7/7.
//
//     ✔ I.5 · LES QUATRE MAISONS INATTEIGNABLES
//         L'union des cinq relations couvre douze maisons sur seize.
//         Quatre ne sont JAMAIS la résultante d'aucune des cinq :
//             M7 Rubeus · M9 Fortuna Minor · M15 Acquisitio · M16 Populus
//         Deux d'entre elles sont les figures les plus singulières de la
//         table : Populus, l'élément neutre, et Acquisitio, le pas de
//         toutes les maisons impaires.
//
//     ⚠️ CE QUE ÇA NE FAIT PAS. Aucune de ces cinq lois ne touche un
//     thème, un match ni un verdict. Elles sont vraies avant qu'on tire.
//     Sa consigne tient : on récolte, on ne bâtit pas encore.
//
// ── J · LA RELATION DE DESTRUCTION ── (sa trouvaille, 31/08/26)
//     Il apporte une relation que le fichier n'avait pas nommée : qui
//     détruit qui. Ses cinq exemples, lus comme des décalages :
//         Puella M14 → Puer M1 ....... +3
//         Puer M1 → Albus M4 ......... +3
//         Albus M4 → Rubeus M7 ....... +3
//         Rubeus M7 → Carcer M10 ..... +3
//         Carcer M10 → Cauda M13 ..... +3
//     LES CINQ SONT EXACTS. La destruction est le décalage +3.
//
//     ✔✔ J.1 · LA DESTRUCTION EST L'ANTAGONISME RETOURNÉ ── 16/16
//         +3 = −13. Donc : la figure qui détruit f EST l'antagoniste de
//         f, et f est l'antagoniste de sa propre victime. 16/16 dans les
//         deux sens. Sa relation de destruction n'est pas une sixième
//         relation : c'est la cinquième, lue dans le sens de l'attaque.
//         Le fichier avait la table ; il lui manquait la FLÈCHE.
//
//     ☠️ J.2 · IL N'Y A PAS DE DUALITÉ ── 0/16
//         Il dit « la dualité Puer et Puella ». Elle n'existe pas.
//         L'antagonisme n'est PAS réciproque : antagoniste(antagoniste(f))
//         vaut +26 = +10, c'est-à-dire le BOUCLIER, jamais f. 0/16.
//         L'antagoniste de Puella n'est pas Puer, c'est Conjunctio.
//         Il n'y a donc pas huit couples : il y a UN SEUL CYCLE DE SEIZE.
//           M1 Puer → M4 Albus → M7 Rubeus → M10 Carcer → M13 Cauda →
//           M16 Populus → M3 Caput → M6 Amissio → M9 Fortuna Minor →
//           M12 Fortuna Major → M15 Acquisitio → M2 Laetitia → M5 Via →
//           M8 Tristitia → M11 Conjunctio → M14 Puella → et retour.
//         Chaque figure a EXACTEMENT un attaquant et EXACTEMENT une
//         victime. Aucune n'échappe, aucune n'est frappée deux fois.
//
//     ✔✔ J.3 · LA RÉPONSE À SA QUESTION SUR LA FIGURE AU REPOS
//         Il demande : la figure au repos bloque-t-elle la voie de son
//         antagoniste, ou constitue-t-elle une voie destructrice contre
//         son adversaire, ou les deux ?
//         RÉPONSE : LES DEUX, TOUJOURS, ET JAMAIS UN BLOCAGE.
//           toute figure est détruite par son antagoniste ...... 16/16
//           toute figure est l'antagoniste de sa victime ....... 16/16
//           les deux à la fois ................................ 16/16
//           une figure détruit-elle son propre attaquant ? ..... 0/16
//           ... même en deux coups ? .......................... 0/16
//         Le blocage n'existe pas dans la table. Personne ne peut rendre
//         son coup à celui qui l'a frappé : il faudrait QUINZE
//         destructions d'affilée pour qu'une figure atteigne son propre
//         antagoniste.
//
//     ✔✔ J.4 · MAIS LE BOUCLIER, LUI, DÉTRUIT L'ANTAGONISTE ── 16/16
//         bouclier(f) = f+10, et (f+10)+3 = f+13 = antagoniste(f).
//         LE BOUCLIER EST EXACTEMENT LA FIGURE QUI TUE CELUI QUI TE TUE.
//         Le fichier l'appelait « bouclier » par doctrine depuis le
//         début ; le nom est maintenant mérité, et démontré.
//         La riposte existe donc, mais elle passe par un relais :
//           quinze pas par la destruction seule ;
//           DEUX pas en passant par son bouclier. 16/16.
//         ➜ C'est ce qui explique son « 1 par la voie de Conjunctio »
//         dans la riposte de Puer : Conjunctio EST le bouclier de Puer,
//         et c'est bien Conjunctio qui détruit Puella.
//
//     ✔✔ J.5 · SA LOI DU BINÔME DU FRONT ── 16/16
//         Il écrit : « chaque voie qui gagne est directement liée au
//         binôme de sa figure de front », et donne Puer → Albus → Rubeus.
//         VÉRIFIÉ, ET C'EST UNE IDENTITÉ EXACTE :
//             détruire DEUX FOIS (+6) = binôme(front(f)). 16/16
//         En détruisant Albus, Puer libère bien Rubeus — la victime de
//         sa victime — et Rubeus est bien le binôme de Via, le front de
//         Puer. De même : détruire QUATRE fois (+12) = bouclier(binôme(f)),
//         16/16 ; détruire CINQ fois (+15) = la maison précédente.
//
//     ✔✔ J.6 · IL N'Y A QUE CINQ VOIES POUR SEIZE ATTAQUES
//         La « voie » d'une attaque, c'est la combinaison des deux
//         combattants. Sur les seize attaques du cycle, elle ne prend que
//         CINQ valeurs — et ce sont exactement les cinq résultantes de
//         l'antagoniste déjà connues (loi H), toutes de boucle A, toutes
//         en maison impaire :
//           voie Puer M1 ...... Caput→Amissio · Rubeus→Carcer ·
//                               Conjunctio→Puella · Acquisitio→Laetitia
//           voie Caput M3 ..... Laetitia→Via · Tristitia→Conjunctio ·
//                               Carcer→Cauda · Populus→Caput
//           voie Via M5 ....... Puer→Albus · Fortuna Minor→Fortuna Major
//           voie Conjunctio M11 Albus→Rubeus · Amissio→Fortuna Minor ·
//                               Fortuna Major→Acquisitio · Puella→Puer
//           voie Cauda M13 .... Via→Tristitia · Cauda→Populus
//
//     ✔ J.7 · SON FAIT PAIR/IMPAIR, DANS SA FORME EXACTE
//         Il dit que les attaques des paires vers les impaires n'ont pas
//         d'intersection et que celles des impaires vers les paires en
//         ont. Ce qui est vrai, mesuré :
//           attaques depuis une maison IMPAIRE (boucle A vers boucle B)
//             → voies { Puer, Via, Cauda } = SON AXE 1-5-13
//           attaques depuis une maison PAIRE (boucle B vers boucle A)
//             → voies { Caput Draconis, Conjunctio }
//           LES DEUX FAMILLES NE PARTAGENT AUCUNE VOIE. Jamais une
//           attaque impaire ne rencontre une attaque paire.
//         ⚠️ MAIS LE SENS EST INVERSÉ. Ce n'est pas que l'une n'a pas
//         d'intersection : chacune se rencontre abondamment CHEZ ELLE.
//         Les impaires se répartissent sur trois voies (4+2+2), les
//         paires sur deux seulement (4+4) — les PAIRES se rencontrent
//         donc plus, pas moins. Ce qui est vrai et fort, c'est la
//         SÉPARATION : zéro rencontre entre les deux familles.
//
//     ✔ J.8 · SON EXEMPLE CARCER / RUBEUS, VÉRIFIÉ ET CORRIGÉ
//         Rubeus→Carcer voyage sur la voie Puer, et ce groupe compte
//         EXACTEMENT QUATRE attaques — son chiffre est juste.
//         Il en nomme quatre : Conjunctio→Puella ✔ et Acquisitio→Laetitia
//         ✔ sont dans le groupe ; « Acquisitio vers Puer » est cette même
//         attaque désignée par sa voie ; « Cauda vers Populus » n'y est
//         pas — celle-là voyage sur la voie Cauda. Et il en manque une :
//         Caput Draconis → Amissio. Trois sur quatre.
//         Sa conclusion, elle, est exacte : Carcer détruit bien Cauda.
//
//     ✔ J.9 · LES QUATRE ATTAQUES OÙ LA VOIE EST DANS LE COMBAT
//         Sur les seize, quatre seulement voient leur voie engagée :
//           Cauda → Populus ....... la voie EST l'attaquant (Cauda)
//           Populus → Caput ....... la voie EST la cible (Caput)
//           Puella → Puer ......... la voie (Conjunctio) détruit l'attaquant
//           Conjunctio → Puella ... la cible détruit la voie
//         Les deux premières viennent de Populus, l'élément neutre. Les
//         deux dernières sont le couple Puer/Puella-Conjunctio — c'est-à-
//         dire précisément l'exemple qu'il a choisi pour commencer.
//
//     ⚠️ ET CE QUI N'EST PAS RETROUVÉ. Dans la riposte de Puer il nomme
//     trois voies : Conjunctio, Cauda, Acquisitio. Conjunctio est exacte
//     et expliquée (J.4). Cauda est bien une voie du cycle, mais pas
//     celle de ce combat. Acquisitio n'est voie d'aucune des seize
//     attaques — elle y figure comme CIBLE (Fortuna Major → Acquisitio,
//     dans le groupe de la voie Conjunctio). Je ne force pas la table
//     pour les faire entrer.
//
//     ⚠️ RIEN DE TOUT CECI N'EST BRANCHÉ SUR UN VERDICT. On récolte.
//
// ── K · LE DESSIN DE LA LIGNE ── (sa construction, 31/08/26)
//     Sa consigne : une droite, seize points, un trait vertical ; les
//     IMPAIRES à gauche avec Puer collé au trait, les PAIRES à droite
//     avec Laetitia collée au trait. Puis des demi-cercles pour le
//     binôme et pour l'antagoniste. « Si tu le fais bien, ça va sauter
//     aux yeux. » Ça saute aux yeux.
//
//     LA LIGNE — X va de 1 à 16, le trait est entre X8 et X9 :
//       X    1   2   3   4   5   6   7   8 ‖  9  10  11  12  13  14  15  16
//          M15 M13 M11  M9  M7  M5  M3  M1 ‖ M2  M4  M6  M8 M10 M12 M14 M16
//       (impair : X = 8−(h−1)/2 · pair : X = 8+h/2)
//
//     ✔ K.1 · LE BINÔME EST LE VOISIN IMMÉDIAT, VERS L'EXTÉRIEUR ── 14/16
//         Sur la ligne, le binôme n'est jamais un saut : c'est toujours
//         le point d'à côté, et toujours EN S'ÉLOIGNANT du trait. Quatorze
//         arcs de portée 1. Les deux derniers sont les GRANDS RETOURS,
//         de portée 7 : Acquisitio (X1) revient sur Puer (X8), Populus
//         (X16) revient sur Laetitia (X9). Les deux bouts se replient
//         sur le trait. Le binôme est donc une marche qui s'éloigne du
//         centre et qui, arrivée au bord, y retombe d'un seul coup.
//
//     ✔✔ K.2 · L'ANTAGONISTE DESSINE QUATRE FAMILLES CONCENTRIQUES
//         Les seize demi-cercles de l'antagoniste ne se dispersent pas :
//         ils se rangent en quatre faisceaux de cercles CONCENTRIQUES.
//           centre  7.5 (l'écart Caput/Puer) ...... 6 arcs, tous IMPAIRS
//           centre  9   (Laetitia elle-même) ...... 7 arcs, tous PAIRS
//           centre 11.5 (l'écart Amissio/Tristitia) 2 arcs : Puer→Puella
//                                                   et CAPUT→POPULUS
//           centre  5   (Rubeus) ................. 1 arc : Laetitia→Acquisitio
//         Et des arcs concentriques NE SE CROISENT JAMAIS :
//           croisements à l'intérieur d'une famille ......  0
//           croisements entre familles différentes ....... 45
//         ➜ C'est ça, son « intersection » : elle n'existe qu'ENTRE
//         faisceaux. À l'intérieur d'un faisceau, tout est emboîté.
//
//     ✔✔ K.3 · ET SON EXCEPTION CAPUT / POPULUS EST DANS LE DESSIN
//         Il écrit : « je vois Caput et Populus seuls comme une
//         exception ». L'arc Caput→Populus est en effet l'un des DEUX
//         SEULS arcs impairs hors du grand faisceau — avec Puer→Puella.
//         Les trois figures dont l'arc quitte son faisceau sont
//         exactement les trois collées au trait : Caput (X7), Puer (X8),
//         Laetitia (X9). Toutes les autres restent emboîtées.
//
//     ✔✔ K.4 · LA PYRAMIDE DE COUVERTURE ── exacte sur les seize
//         Nombre d'arcs qui passent AU-DESSUS de chaque point :
//             0  2  4  6  8 10 12 14 ‖ 14 12 10  8  6  4  2  0
//         C'est exactement 2 × (distance au bout le plus proche), et
//         c'est parfaitement symétrique autour du trait.
//         ➜ PLUS ON EST PRÈS DU TRAIT, PLUS ON EST COUVERT. Puer et
//         Laetitia, collées au trait, passent sous QUATORZE des seize
//         arcs. Acquisitio et Populus, aux deux bouts, ne passent sous
//         AUCUN. Voilà son « cela dépend de la position de la figure ».
//         Et son exemple tombe juste : Caput (X7) est couverte par douze
//         arcs, dont Cauda Draconis→Carcer — « la voie de Carcer est
//         prolongée jusqu'à Caput », mot pour mot.
//
// ── L · L'ÉNERGIE SAUTE LA VICTIME ── (sa règle des éléments)
//     Il donne la compatibilité : eau+terre, feu+air, eau+air oui ;
//     terre+air et feu+eau non. Il ne dit rien de feu+terre.
//     ✔ SA RÈGLE EST DÉJÀ CELLE DU FICHIER. concordanceElement donne
//     0 pour feu/eau et air/terre — « opposition totale » — et une
//     valeur non nulle pour les quatre autres paires, feu/terre compris.
//     Ses deux paires interdites sont exactement les deux oppositions.
//
//     ✔✔ ET SON CONSTAT EST EXACT ── 15/16
//         Il dit : Populus attaque Caput, l'énergie doit CONTINUER
//         jusqu'à Amissio, et là Populus est feu quand Amissio est eau —
//         « mais le reste ils ont une compatibilité ».
//         Mesuré avec la table du fichier :
//           f compatible avec la victime de sa victime (+6) .... 15/16
//           EXCEPTION UNIQUE : Populus (feu) ⇢ Amissio (eau)
//         Pas une de plus. Son exception est LA seule.
//         Et c'est bien au SAUT que la loi vit, pas au coup direct :
//           f avec sa victime directe (+3) ..................... 8/16
//         L'énergie de la destruction ne se mesure donc pas entre le
//         frappeur et sa victime, mais entre le frappeur et CE QUE SA
//         VICTIME ALLAIT FRAPPER. Or +6 = binôme(front(f)) (loi J.5) :
//         c'est exactement « la voie qui sauve » dont il parlait.
//
//     ✔✔ UN FAIT DE PLUS, SORTI DE LÀ. La compatibilité élémentaire par
//     distance ne prend que cinq valeurs, et elle suit EXACTEMENT le
//     nombre de résultantes de la loi I point 7 :
//         d = 8 ................... 16/16   (1 résultante)
//         d = 2, 6, 10, 14 ........ 15/16   (3 résultantes)
//         d = 1, 7, 9, 15 ......... 12/16   (4 résultantes)
//         d = 4, 12 ............... 10/16   (2 résultantes)
//         d = 3, 5, 11, 13 ......... 8/16   (5 résultantes)
//     ➜ LES RELATIONS QUI LIENT SONT LES DISTANCES ÉLÉMENTAIREMENT
//     COMPATIBLES, CELLES QUI DÉTRUISENT SONT LES INCOMPATIBLES.
//     Le front du front (+8) est parfait, le binôme (+2) et le bouclier
//     (+10) au maximum ; la destruction (+3) et l'antagoniste (+13) sont
//     au minimum, 8/16. La table des éléments et la table des
//     combinaisons ne sont pas indépendantes.
//
//     ☠️ MA FAUTE, notée pour qu'elle ne se répète pas. Mon premier
//     contrôle a rendu 4/16 et douze exceptions, ce qui aurait enterré
//     son constat. La cause : mes clés de compatibilité étaient écrites
//     'feu|air' alors que je les cherchais triées ('air|feu'). Deux des
//     trois paires compatibles ne matchaient jamais. Le fichier avait
//     raison, lui, depuis le début — j'aurais dû partir de
//     concordanceElement au lieu de réécrire la règle à la main.
//
// ── M · LES DEUX DEMI-PLANS ── (sa construction, suite)
//     Sa consigne : les antagonistes AU-DESSUS de la ligne, les binômes
//     AU-DESSOUS ; sauf que le retour Acquisitio→Puer reste en bas et
//     que le retour Populus→Laetitia passe en haut. « Tu auras des
//     intersections. » Voici le dessin, calculé :
//
//       ╭───────────────────────────────────────────────────────╮
//       │   HAUT : 16 antagonistes + le retour Populus→Laetitia  │
//       │          17 arcs · 57 CROISEMENTS                      │
//       ╰───────────────────────────────────────────────────────╯
//        M15 M13 M11 M9 M7 M5 M3 M1 ‖ M2 M4 M6 M8 M10 M12 M14 M16
//       ╭───────────────────────────────────────────────────────╮
//       │   BAS : 15 binômes, dont le couvercle Acquisitio→Puer  │
//       │         15 arcs · ZÉRO CROISEMENT                      │
//       ╰───────────────────────────────────────────────────────╯
//
//     ✔✔ M.1 · LE BAS NE SE CROISE JAMAIS, ET CE N'EST PAS UN HASARD
//         Zéro croisement en bas — et zéro quel que soit le placement des
//         deux retours. Raison : SA LIGNE EST L'ORDRE DU BINÔME. Le
//         demi-plan gauche lu de l'extérieur vers le trait donne M15,
//         M13, M11, M9, M7, M5, M3, M1 — la chaîne des binômes ; le
//         demi-plan droit donne M2, M4, M6, M8, M10, M12, M14, M16 —
//         l'autre chaîne. Sa ligne, c'est les deux cycles de binômes mis
//         à plat, dos à dos contre le trait. Un cycle tracé dans son
//         propre ordre s'emboîte toujours ; il ne peut pas se croiser.
//
//     ✔✔ M.2 · ET LE BINÔME EST LA SEULE RELATION PLANAIRE SUR CETTE LIGNE
//         Croisements de chaque décalage tracé seul, sur sa ligne :
//             d= 1 ...  13     d= 9 ...  61
//             d= 2 ...   0 ←   d=10 ...  32   (bouclier)
//             d= 3 ...  45     d=11 ...  61
//             d= 4 ...  16     d=12 ...  16
//             d= 5 ...  61     d=13 ...  45   (antagoniste)
//             d= 6 ...  32     d=14 ...   0 ←
//             d= 7 ...  61     d=15 ...  13
//             d= 8 ...  48
//         Sur les quinze distances, DEUX SEULEMENT donnent zéro : le
//         binôme et son miroir. Toutes les autres se croisent, et le
//         maximum (61) est atteint quatre fois, à d = 5, 7, 9, 11.
//         ⚠️ Et il faut sa ligne pour voir ça. Sur la roue ordinaire
//         (M1..M16 dans l'ordre) le compte est plat et sans intérêt :
//         0, 16, 32, 48, 64, 80, 96, 112, 96, 80… — une simple montée.
//         C'est SA disposition qui fait apparaître la structure.
//
//     ✔✔ M.3 · CHAQUE RETOUR MONTÉ EN HAUT COÛTE EXACTEMENT DOUZE
//         Les quatre placements possibles des deux retours :
//             les deux en bas ................ haut 45 · bas 0
//             son choix (AP bas, PL haut) .... haut 57 · bas 0
//             le miroir (PL bas, AP haut) .... haut 57 · bas 0
//             les deux en haut ............... haut 69 · bas 0
//         45, 57, 57, 69 : douze de plus par retour monté, et les deux
//         retours sont interchangeables — ils ne se croisent pas entre
//         eux, chacun tient dans sa moitié. Le bas reste à zéro dans les
//         quatre cas. ➜ Le prix d'un passage de la paix à la guerre est
//         constant : douze.
//
//     ✔✔ M.4 · CE QUE POPULUS→LAETITIA NE CROISE PAS
//         Il croise 12 des 16 arcs d'antagoniste. Les QUATRE qu'il
//         épargne sont exactement les quatre arcs qui touchent l'une de
//         ses deux extrémités :
//             Via→Laetitia · Laetitia→Acquisitio (touchent Laetitia)
//             Caput→Populus · Populus→Cauda      (touchent Populus)
//         Un arc ne croise pas ses propres voisins ; il croise tout le
//         reste. C'est la règle complète, sans exception.
//
//     ✔✔ M.5 · LE FOSSÉ — un arc qui quitte son faisceau se fait déchirer
//         Nombre de fois où chaque arc du haut est croisé :
//             dans un faisceau concentrique .... 2 à 6
//             hors faisceau .................... 11 à 13
//             entre les deux ................... RIEN (aucun arc à 7, 8, 9 ou 10)
//         Les quatre arcs les plus croisés sont exactement les quatre qui
//         sortent des faisceaux : Laetitia→Acquisitio 13, Puer→Puella 12,
//         Populus→Laetitia 12, Caput→Populus 11. Le moins croisé est
//         Populus→Cauda Draconis, à 2.
//         ➜ La loi K.2 disait que les concentriques ne se croisent
//         jamais. M.5 dit le revers : celui qui sort du faisceau paye.
//
//     ✔✔ M.6 · SA MANIPULATION ISOLE EXACTEMENT DEUX FIGURES
//         Chaque figure porte quatre arcs — deux en haut, deux en bas.
//         Toutes, sauf DEUX : Laetitia et Populus portent 3 en haut et 1
//         en bas. Ce sont précisément les deux extrémités de l'arc qu'il
//         a demandé de retourner. Aucune autre figure n'est déséquilibrée.
//
//     ✔✔ M.7 · UN PANIER FERMÉ, UN PANIER OUVERT
//         En bas, le côté IMPAIR garde son couvercle (Acquisitio→Puer,
//         qui ne croise rien et ENFERME les sept autres arcs) : la boucle
//         A est un panier CLOS. Le côté PAIR a perdu le sien : la boucle
//         B est une chaîne OUVERTE, sept arcs sans couvercle.
//         ➜ Et c'est la boucle B qui est ouverte — celle qui contient
//         Populus, l'élément neutre, celle que la loi C désigne comme le
//         SOUS-GROUPE. Sa construction ouvre exactement le côté que
//         l'algèbre désignait déjà comme le côté « fermé sur lui-même ».
//
//     ⚠️ On récolte. Rien de ceci ne touche un verdict.
//
// ── N · LES TRAJECTOIRES ── (ses axes, 31/08/26)
//     Il demande d'attaquer les axes 1-4-7, 1-10-7, 4-7-10, 4-1-10, et
//     les trigones de M1 et M7 : « 3-5-9-11 est partagé par M1 et M7,
//     ainsi 1-5-9 et 7-3-11 ». Puis d'exploiter pour trouver où les
//     figures doivent se loger pour qu'il y ait penalty, rouge, les deux
//     marquent, un camp faible ou fort.
//     La géométrie répond très bien. LA MESURE, ELLE, NE RÉPOND PAS —
//     et il faut le dire avant tout le reste.
//
//     ✔✔ N.1 · SES DEUX CARRÉS S'INTERSECTENT, 4 DIAGONALES SUR 4
//         Le carré 1-4-7-10 porte les diagonales 1-7 et 4-10 ; le
//         rectangle 3-5-9-11 porte 3-9 et 5-11. Les QUATRE paires se
//         croisent, sans exception. Son « carrés intrasect de 4
//         diagonales » est exact.
//
//     ✔✔ N.2 · SA PHRASE SUR LE PARTAGE, VÉRIFIÉE 2000/2000
//         trigone(M1) ⊕ trigone(M7) = rectangle 3-5-9-11 ⊕ M1 ⊕ M7
//         Le rectangle est bien la part COMMUNE ; chaque trigone n'y
//         ajoute que son propre pôle. C'est exactement ce qu'il décrit.
//
//     ✔✔ N.3 · LES TRAJECTOIRES S'EFFONDRENT — et ça, c'est neuf
//         Le thème obéit à M9 = M1⊕M2, M10 = M3⊕M4, M11 = M5⊕M6,
//         M12 = M7⊕M8, M13 = M9⊕M10, M14 = M11⊕M12, M15 = M13⊕M14
//         (7/7 vérifiées). Donc TOUTE trajectoire qui contient une
//         maison ET l'un de ses deux parents perd les deux et ne garde
//         que l'autre parent. Ses trajectoires se réduisent :
//             trigone M1  1-5-9 ....... = M2 ⊕ M5      (deux maisons !)
//             triangle 4-7-10 ......... = M3 ⊕ M7      (deux maisons)
//             triangle 4-1-10 ......... = M1 ⊕ M3      (deux maisons)
//             carré cardinal 1-4-7-10 . = M1 ⊕ M3 ⊕ M7
//             triangle 1-4-7 .......... = M1 ⊕ M4 ⊕ M7
//             triangle 1-10-7 ......... = M1 ⊕ M3 ⊕ M4 ⊕ M7
//             trigone M7  3-7-11 ...... = M3 ⊕ M5 ⊕ M6 ⊕ M7
//             rectangle 3-5-9-11 ...... = M1 ⊕ M2 ⊕ M3 ⊕ M6
//             succédent 2-5-8-11 ...... = M2 ⊕ M6 ⊕ M8
//             cadent 3-6-9-12 ......... = M1⊕M2⊕M3⊕M6⊕M7⊕M8
//         ☠️ LE TRIGONE DE M1 ANNULE M1. 1-5-9 ne dépend NI de M1 NI de
//         M9 : il vaut M2 ⊕ M5, deux mères. La « trajectoire de M1 » est
//         la seule des dix qui ne contient pas M1. Même chose pour le
//         triangle 4-7-10, qui n'a plus M4 dedans.
//         ➜ Une trajectoire n'est donc PAS l'addition de ce qu'elle
//         traverse. Trois maisons peuvent n'en valoir que deux, et
//         parfois pas celles qu'on croit.
//
//     ☠️☠️ N.4 · ET LA MESURE NE DONNE RIEN. Il faut le dire net.
//         Balayage préenregistré : 10 trajectoires × 4 lectures
//         (résultante en boucle A · résultante = Populus · résultante
//         ancrée · majorité de boucle A dans la trajectoire) × 4 sorties
//         (camp · nul · les deux marquent · plus de 2,5 buts) = 160
//         tests, plus 64 tests de maisons seules = 224.
//             seuil de Bonferroni ......... 0,000223
//             meilleur p obtenu ........... 0,0015
//             SURVIVANTS .................. ZÉRO
//             sous 0,05 brut .............. 8 sur 224
//             attendus par le seul hasard . 11,2
//         LE BALAYAGE PRODUIT MOINS DE TOUCHES QUE LE HASARD. Ce n'est
//         pas « peu concluant » : c'est un résultat négatif franc.
//
//     ☠️ N.5 · L'INCIDENT NE PEUT PAS ÊTRE MESURÉ DU TOUT
//         Sur les 53 cas de l'archive, le champ « incident » n'est
//         rempli que sur HUIT — six oui, deux non. Aucune trajectoire,
//         aucune figure, aucun test ne peut sortir de huit observations
//         dont deux d'une classe. La question « dans quelle trajectoire
//         une figure doit se loger pour qu'il y ait penalty ou rouge »
//         N'EST PAS RÉPONDABLE en l'état, et aucune fouille ne la rendra
//         répondable. Ce qui la débloquerait est simple et n'est pas du
//         calcul : remplir le champ incident sur les quarante-cinq cas
//         qui l'ont vécu. Vingt oui et vingt non, et le test devient
//         possible.
//
//     📌 N.6 · DEUX PISTES GELÉES, NON BRANCHÉES
//         Les deux meilleures du balayage — hors trajectoires, ce sont
//         des MAISONS SEULES, ce qui répond déjà non à sa question :
//             M15 (le JUGE) en boucle A → les deux marquent MOINS
//                 9/25 = 36 %  contre  14/16 = 88 %   p brut 0,0015
//             M4 en boucle A → plus de 2,5 buts
//                 23/28 = 82 % contre 5/15 = 33 %     p brut 0,0024
//                 (et l'effet se renforce en excluant l'e-sport :
//                  17/21 contre 5/16, p = 0,0059 — ce n'est donc pas le
//                  piège des 8,75 buts de l'arcade)
//         Aucune des deux ne survit à la correction. Elles sont notées
//         ICI, gelées, pour être retestées sur les prochains matchs — et
//         elles ne touchent aucun verdict. La règle du projet tient :
//         une piste trouvée dans l'échantillon se vérifie DEHORS.
//
// ── O · LE MOTEUR, ET LE QUATRIÈME AXE ── (31/08/26, sa demande)
//     « Crée le moteur et ajoute cet axe comme condition de validation
//     de thème : axe 3-5-9-11. »
//
//     ✔ O.1 · LE QUATRIÈME AXE EST BRANCHÉ, SUR LES CINQ CHEMINS
//         Le fichier avait CINQ endroits qui calculaient la validité, et
//         chacun avait sa propre copie du test — c'est la troisième fois
//         que ce fichier se désynchronise là-dessus. Les cinq portent
//         maintenant l'Axe du Partage M3+M5+M9+M11 :
//             analyzeValidation ....... le panneau de validation
//             themeInvalidite ......... la bannière en direct
//             isThemeValideStrict ..... le gate et les statistiques
//             niveauValiditeV7 ........ le niveau 0-3 et les dérivés
//             toggleValiditePanel ..... les cartes à l'écran
//         Accord vérifié : 1500/1500 thèmes, les trois fonctions
//         booléennes disent la même chose.
//     ⚠️ CE N'EST PAS UNE CLASSE MODULO 3, et le fichier ne prétend pas
//         le contraire. Les trois premiers axes sont les seules classes
//         de pas 3 ; celui-ci est un RECTANGLE de deux oppositions
//         croisées (3-9 et 5-11), et c'est sa loi N : la part partagée
//         par les trigones de M1 et M7. L'ancien « Axe Temporel »
//         M3+M5+M11+M15 reste retiré — il empruntait M15, hors du carré.
//
//     📊 O.2 · LE COÛT, MESURÉ AVANT DE BRANCHER
//         thèmes valides ............. 72,3 % → 63,6 %  (sur 4000 tirages)
//         archive ................... 46 → 42 cas valides
//             perdus : Juventus · TristPop · ConjCaput2 · Gel2Main
//         niveau 3 (« 100 % valide ») . 14,5 % → 8,7 %
//             le bouton 🎯 devra tirer ~11 fois au lieu de 7 ; son
//             plafond de 200 essais reste très largement suffisant.
//         A/B contre la version précédente : 129 lignes changées sur
//         2053, et elles ne touchent QUE deux champs — le rejet (10) et
//         le niveau de validité (119). AUCUN verdict, AUCUN score,
//         AUCUN camp, AUCUN BTTS n'a bougé. Le 4e axe filtre, il ne
//         prédit pas.
//
//     ⚔ O.3 · LE MOTEUR : moteurDestructionV7
//         Bâti sur la loi J — R1 et R7 en relation directe de
//         destruction, c'est-à-dire l'un antagoniste de l'autre.
//         Son dossier est écrit en entier au-dessus de la fonction, et
//         il tient en une ligne : 5 sur 6, p = 0,219, et deux des six
//         portent la même paire. IL EST horsVote. Il ne décide rien.
//
//     ☠️ O.4 · ET LA VÉRITÉ SUR LA RÉCOLTE, PUISQU'IL FAUT LA DIRE
//         Quatorze lois de structure, toutes exactes, toutes vérifiées à
//         l'exécution. AUCUNE ne bat le hasard sur les 39 duels de
//         l'archive : huit lectures tirées des lois J, K et L donnent
//         41, 51, 38, 54, 46, 47, 49 % — le taux de base est 59 %.
//         Une structure exacte n'est pas une structure prédictive.
//         C'est le résultat de la récolte, et il ne faut pas le
//         maquiller : le fichier sait beaucoup mieux COMMENT la table
//         est faite, et pas mieux qui va gagner.
//         Ce qui manque n'est pas de la fouille — c'est des matchs.
//
// ── P · LES TRIANGLES DU CARRÉ ── (sa question, 01/09/26)
//     « Chaque trajectoire dans le carré est un triangle isocèle ou
//     équilatéral, comme 1-5-9 ou 3-5-10. Vérifie. »
//     Vérifié exhaustivement sur les 220 triangles des douze maisons.
//
//     ☠️ P.1 · LA RÈGLE EST FAUSSE TELLE QUELLE
//         Sur les 220 triangles possibles :
//             équilatéraux ....   4   1,8 %
//             isocèles ........  48  21,8 %
//             SCALÈNES ........ 168  76,4 %
//         Trois triangles sur quatre sont scalènes. Prise au pied de la
//         lettre, la phrase est démentie par les trois quarts des cas.
//
//     ✔✔ P.2 · MAIS ELLE DEVIENT EXACTE SOUS DEUX CONDITIONS — 28/28
//         Ses deux exemples ne sont pas pris au hasard : 1-5-9 et 3-5-10
//         ont tous les deux UNE MAISON PAR AXE (un cardinal, un
//         succédent, un cadent) et AUCUNE PAIRE DE MAISONS VOISINES.
//         Sous ces deux conditions, et seulement sous elles :
//             triangles concernés ........ 28
//             équilatéraux ...............  4
//             isocèles ................... 24
//             SCALÈNES ...................  0
//         ZÉRO exception sur vingt-huit. Sa règle est vraie, et voici
//         son domaine exact.
//
//     ✔ P.3 · POURQUOI, ET OÙ ÇA CASSE
//         Une maison par axe force les trois arcs à ne pas être des
//         multiples de 3. Les seules découpes de 12 qui respectent ça
//         sont (1,1,10), (2,2,8), (2,5,5), (4,4,4) et (1,4,7).
//         Les quatre premières sont isocèles ou équilatérales.
//         LA CINQUIÈME EST LA SEULE SCALÈNE, et elle est aussi la seule
//         qui contienne un arc de 1 — c'est-à-dire deux maisons
//         VOISINES. Les 24 scalènes des 64 triangles un-par-axe ont
//         toutes la forme (1,4,7), et toutes contiennent deux voisines :
//         24 sur 24. Interdire le pas de 1, c'est exactement interdire
//         la seule forme scalène.
//
//     ✔✔ P.4 · DEUX FAITS DE PLUS, TOMBÉS DE LA MÊME FOUILLE
//         • LES TROIS MAISONS D'UN MÊME AXE : 12 triangles, TOUS
//           isocèles, tous de forme (3,3,6). 12/12, sans exception.
//           Ce sont 1-4-7, 1-4-10, 1-7-10, 4-7-10 et leurs équivalents
//           succédents et cadents — ses quatre triangles du carré
//           cardinal en font partie.
//         • DEUX AXES SEULEMENT (deux maisons d'un axe, une d'un autre) :
//           144 triangles, TOUS SCALÈNES. 144/144, sans une seule
//           exception. Raison : deux maisons d'un même axe sont à 3 ou 6
//           maisons l'une de l'autre ; pour un isocèle il faudrait un
//           troisième point équidistant des deux, or à distance 6 les
//           deux points équidistants sont à 3 et 9 — donc du MÊME axe —
//           et à distance 3 le point équidistant tomberait à 1,5, qui
//           n'est pas une maison.
//         ➜ LA DICHOTOMIE EST TOTALE : trois axes ou un seul, ça peut
//         être isocèle ; deux axes, jamais.
//
//     ✔ P.5 · LES QUATRE ÉQUILATÉRAUX SONT LES QUATRE TRIGONES
//             1-5-9 · 2-6-10 · 3-7-11 · 4-8-12
//         Il n'y en a pas d'autres, et tous les quatre portent une
//         maison de chaque axe. Ses deux « offensives » — 1-5-9 pour M1
//         et 3-7-11 pour M7 — sont donc les deux seuls équilatéraux qui
//         passent par ces pôles.
//
//     📋 P.6 · CE QUE ÇA LUI DONNE POUR SES QUATRE ÉVÉNEMENTS
//         Il veut relier les trajectoires à : force potentielle de M1/M7
//         (en rotation), force de défense, force offensive, trajectoire
//         des incidents. La géométrie lui livre un jeu propre et fini :
//             par M1 : 1-3-5 · 1-3-8 · 1-3-11 · 1-5-9 · 1-6-8 ·
//                      1-6-11 · 1-9-11 ................. SEPT
//             par M7 : 2-7-9 · 2-7-12 · 3-5-7 · 3-7-11 · 5-7-9 ·
//                      5-7-12 · 7-9-11 ................. SEPT
//         Sept de chaque côté, parfaitement symétriques, dont un seul
//         équilatéral par pôle. C'est le vivier où ses quatre catégories
//         doivent se loger.
//     ⚠️ MAIS L'ATTRIBUTION AUX ÉVÉNEMENTS N'EST PAS VÉRIFIÉE, et elle
//     ne peut pas l'être aujourd'hui. Sur les 55 cas de l'archive, le
//     champ « incident » n'est rempli que sur HUIT (loi N.5), et rien
//     ne distingue une force « offensive » d'une force « défensive » dans
//     les données enregistrées. La géométrie est donnée ; le lien aux
//     événements reste à mesurer, et il faudra des matchs pour ça.
//
// ── Q · L'AFFIRMATION D'UNE TRAJECTOIRE ── (sa règle, 01/09/26)
//     « La somme de la trajectoire résulte une figure ; si elle existe
//     dans le thème, oui. Le comment réside dans sa position, son
//     environnement et son influence. »
//
//     ✔ Q.1 · LA PREMIÈRE MOITIÉ EST DÉJÀ LE PROTOCOLE DU FICHIER.
//         « Exister en base ou en résultante » est positionsBaseEtResultantes,
//         le test même des quatre axes de validité. Sa règle applique au
//         triangle ce que le fichier appliquait déjà à l'axe. Cohérent.
//
//     ☠️ Q.2 · MAIS LE OUI/NON NE FILTRE PRESQUE RIEN — 87 %
//         Un thème contient en moyenne 13,9 des 16 figures (base ou
//         résultante), mesuré sur 4000 tirages. Demander si une figure
//         est là, c'est poser une question dont la réponse est oui neuf
//         fois sur dix. Sur les quatorze trajectoires des deux pôles,
//         l'affirmation tombe entre 80 % (5-7-12, la plus sélective) et
//         96 % (1-9-11, 2-7-9, 7-9-11).
//         C'est aussi pourquoi les quatre axes de validité ne servent
//         qu'ENSEMBLE : seuls ils passent à 86-91 %, tous les quatre à
//         la fois seulement à 63 %.
//
//     ☠️ Q.3 · ET LE OUI/NON NE PRÉDIT RIEN — 0 sur 14
//         Quatorze tests directionnels (une trajectoire de M1 qui affirme
//         devrait annoncer R1, une de M7 devrait annoncer R7) :
//             survivants à Bonferroni (0,0036) ..... ZÉRO
//             sous 0,05 brut ....................... ZÉRO
//             attendus par le hasard ............... 0,7
//         Pas une touche. Meilleur p : 0,187.
//
//     ✔✔ Q.4 · DONC C'EST SA SECONDE MOITIÉ QUI PORTE TOUT
//         Le oui étant quasi gratuit, l'information est entièrement dans
//         « sa position, son environnement et son influence » — ses
//         propres mots. lectureTrajectoireV7 les rend dans cet ordre :
//             position ...... maison, base ou résultante, élément de la
//                             maison, concordance avec la figure
//             environnement . les deux maisons qui bordent chaque position
//             influence ..... le lien de la résultante à R1 et à R7
//                             (binôme, front, bouclier, antagoniste,
//                             front du front, destruction) et la boucle
//         Affichée sous chaque préréglage de la somme. Elle ne décide de
//         rien : elle donne à lire, et elle porte l'avertissement du
//         point Q.2 à chaque affichage, pour qu'un « oui » ne soit jamais
//         pris pour une preuve.
//
// ── R · LA RÈGLE DU MIROIR ── (sa remarque, 01/09/26)
//     « M1 s'oppose à M7. M1 est lié 6-8, 5-9, 4-10, 3-11, 2-12 ; M7 est
//     lié par l'inverse. Ces liaisons sont isocèles ou équilatérales.
//     C'est là que la dualité M1/M7 se fait. Exploite, tu verras. »
//     Vu. C'est le résultat le plus net de toute la fouille du carré.
//
//     ✔✔ R.1 · SES CINQ PAIRES SONT LES REFLETS DU DIAMÈTRE M1-M7
//         Le diamètre M1↔M7 est un axe de symétrie des douze maisons. La
//         réflexion à travers lui donne exactement :
//             2 ↔ 12 · 3 ↔ 11 · 4 ↔ 10 · 5 ↔ 9 · 6 ↔ 8
//         et laisse M1 et M7 fixes. Ce sont ses cinq paires, sans une de
//         plus ni une de moins. Un pôle est donc à ÉGALE DISTANCE des
//         deux maisons de chaque paire : le triangle est isocèle par
//         construction, et il ne peut PAS ne pas l'être.
//
//     ✔✔ R.2 · ET « PAR L'INVERSE » EST EXACT
//             M1 : 1-2-12 · 1-3-11 · 1-4-10 · 1-5-9 · 1-6-8
//             M7 : 6-7-8 · 5-7-9 · 4-7-10 · 3-7-11 · 2-7-12
//         Les mêmes cinq paires en sens contraire, et la même suite
//         d'écarts (1,1,10) (2,2,8) (3,3,6) (4,4,4) (2,5,5). La dualité
//         des deux pôles est une SYMÉTRIE, pas une analogie.
//         Un seul équilatéral par pôle : 1-5-9 pour M1, 3-7-11 pour M7 —
//         ses deux « offensives » du début, retrouvées par un autre
//         chemin.
//
//     ✔✔✔ R.3 · SA RÈGLE ENGENDRE TOUS LES ISOCÈLES DU CARRÉ
//         Appliquée aux douze pôles :
//             triangles engendrés .................. 52
//             isocèles + équilatéraux du carré ..... 52
//             identiques ? ......................... OUI
//             scalènes engendrés par erreur ........ ZÉRO
//         48 n'ont qu'un sommet, 4 en ont trois — et ces quatre sont
//         exactement les équilatéraux (loi P.5). La règle du sommet EST
//         la définition de l'isocèle sur douze points, et elle est
//         COMPLÈTE : rien n'y échappe, rien de faux n'y entre.
//
//     ☠️ R.4 · ET ELLE CORRIGE MES DEUX FILTRES
//         Je donnais « les 7 trajectoires de M1 » : 1-3-5, 1-3-8, 1-3-11,
//         1-5-9, 1-6-8, 1-6-11, 1-9-11. QUATRE contiennent M1 sans que M1
//         en soit le sommet — 1-3-5 est isocèle, mais son sommet est M3.
//         Elles ne lui appartiennent pas ; elles passent par lui.
//         Et il me manquait 1-2-12 (deux voisines de M1, écartées par mon
//         filtre) et 1-4-10 (tout entière dans l'axe cardinal, écartée
//         par l'autre). Mes deux filtres donnaient 40 triangles, en
//         laissant 12 vrais isocèles dehors et sans jamais dire où était
//         le sommet.
//         ➜ Le menu porte maintenant les 52, groupés par SOMMET, dans son
//         ordre : M1, M7, M4, M10, puis les autres.
//
//     ➜ POUR LA SUITE : chaque pôle a exactement CINQ trajectoires dont
//     il est le sommet, dont une équilatérale. Un jeu fini, symétrique et
//     fondé, au lieu des sept arbitraires que mes filtres produisaient.
//     Si ses quatre événements doivent se loger quelque part, c'est là.
//     ⚠️ L'attribution aux événements reste non mesurée : le champ
//     incident n'est rempli que sur 8 cas sur 55 (loi N.5).
//
// ── S · LE DIAMÈTRE, ET L'ANGLE DROIT ── (sa remarque, 01/09/26)
//     « Chaque maison par rapport à son opposé possède 5 triangles, et sa
//     TROISIÈME maison est toujours son diamètre — exemple M1 → M2, M3,
//     M4 : ici M4 avec son opposé M10 est le diamètre de M1 par rapport à
//     M7. » Exact sur les douze pôles, et ça va plus loin qu'il ne dit.
//
//     ✔✔ S.1 · UNE SEULE PAIRE DIAMÈTRE, TOUJOURS LA TROISIÈME ── 12/12
//         Les cinq paires miroir d'un pôle sont à distance k = 1, 2, 3, 4,
//         5 de lui ; les deux maisons d'une paire sont donc séparées de
//         2k. Un diamètre vaut 6. La paire diamètre est celle où 2k = 6,
//         c'est-à-dire k = 3 : la TROISIÈME, toujours, et jamais une
//         autre. Vérifié sur les douze pôles.
//             M1  → (2,12) (3,11) [4,10] (5,9) (6,8)
//             M7  → (6,8) (5,9) [4,10] (3,11) (2,12)
//             M4  → (3,5) (2,6) [1,7] (8,12) (9,11)
//             M10 → (9,11) (8,12) [1,7] (2,6) (3,5)
//
//     ✔✔ S.2 · ET CE DIAMÈTRE EST PERPENDICULAIRE À L'AXE DU PÔLE ── 12/12
//         Il l'a écrit sans le nommer : « M4 avec son opposé M10 est le
//         diamètre de M1 par rapport à M7 ». L'axe M1-M7 et le diamètre
//         M4-M10 se coupent à angle droit, et c'est vrai pour les douze :
//         la troisième paire d'un pôle est TOUJOURS la perpendiculaire de
//         son propre axe.
//
//     ✔✔✔ S.3 · DONC CE TRIANGLE EST RECTANGLE — THALÈS
//         Un triangle inscrit dont un côté est un diamètre a un angle
//         droit sur le troisième point. La troisième trajectoire de
//         chaque pôle a pour base un diamètre : elle est donc RECTANGLE,
//         et isocèle par la loi R. Douze triangles rectangles isocèles,
//         un par pôle, tous de forme (3,3,6) :
//             M1 → 1-4-10   M7 → 4-7-10   M4 → 1-4-7   M10 → 1-7-10
//         L'angle droit est au sommet, c'est-à-dire sur le pôle lui-même.
//
//     ✔✔ S.4 · ET ÇA BOUCLE SUR SES QUATRE OPPOSÉES
//         Chaque diamètre porte DEUX triangles rectangles, dont les
//         sommets sont eux-mêmes opposés :
//             base 1-7 (diamètre)  → sommets M4 et M10 → 1-4-7 et 1-7-10
//             base 4-10 (diamètre) → sommets M1 et M7  → 1-4-10 et 4-7-10
//         Ce sont EXACTEMENT les quatre trajectoires opposées qu'il
//         signalait au message précédent. Elles ne sont pas quatre cas
//         particuliers : ce sont les deux triangles rectangles de chacun
//         des deux diamètres cardinaux. Sa remarque d'hier et celle
//         d'aujourd'hui sont le même fait, vu de deux côtés.
//         Les six diamètres du carré portent donc douze rectangles :
//             1-7 → M4, M10   ·   2-8 → M5, M11   ·   3-9 → M6, M12
//             4-10 → M1, M7   ·   5-11 → M2, M8   ·   6-12 → M3, M9
//
//     ➜ CHAQUE PÔLE A DONC UNE TRAJECTOIRE PARTICULIÈRE parmi ses cinq :
//     la troisième, celle qui s'appuie sur la perpendiculaire de son axe
//     et forme l'angle droit. Si l'une des cinq doit porter un rôle
//     distinct dans ses quatre événements, c'est celle-là qui a la
//     géométrie la plus marquée.
//     ⚠️ Non mesuré : l'archive ne peut pas trancher (loi N.5).
//
// ── T · LES DEUX ZONES DU CARRÉ ── (sa demande, 03/09/26 : « revois le
//     calcul des zones »)
//
//     ☠️ IL AVAIT RAISON DE DEMANDER. Le panneau qu'il a recopié —
//     « Zone M1 (I·II·III·XI·XII) … Axe neutre (X·IV) … Zone M7
//     (V·VI·VII·VIII·IX) » — n'affichait pas une lecture. Il affichait
//     une CONSTANTE. « M1 +3 · M7 +3 · carré équilibré », sur tous les
//     thèmes, depuis le 03/08/26.
//
//     T.1 · LA PANNE — LE PIÈGE DES NOMS D'AFFICHAGE, UNE DEUXIÈME FOIS.
//     Ce panneau travaille en noms d'affichage ("Carcer", "Conjonctio",
//     "Fortuna minor"). calculerDigniteAccidentelle est indexée par
//     identifiant canonique ('carcer', 'conjunctio', 'fortuna_minor').
//     Elle ne protestait pas : PLANETES_V7[fig] et FIGURE_ELEMENT_CODE
//     [fig] rendaient undefined, la régence tombait à 0, la concordance
//     à 0, le repos n'était jamais reconnu, et il ne restait que le
//     score de catégorie. Mesuré, sur la même maison et le même thème :
//         calculerDigniteAccidentelle(1,'Carcer',t) → 5    (cat 5 · rég 0 · conc 0)
//         calculerDigniteAccidentelle(1,'carcer',t) → 8.25 (cat 5 · rég 2 · conc 1.25)
//     C'est EXACTEMENT le piège qui avait fait rendre "via" au lieu de
//     "acquisitio" à combineMany dans le même bloc. Je l'avais bouché
//     à un endroit et pas cherché ailleurs. Il y était trois fois : le
//     verdict des zones, la dignité écrite dans chaque maison du dessin,
//     et le panneau de détail au clic. Les trois sont corrigées, et
//     calculerDigniteAccidentelle REFUSE désormais un nom non canonique
//     (total null + champ erreur) au lieu de noter au rabais.
//
//     T.2 · MAIS LA VRAIE RAISON DU +3 CONTRE +3 EST STRUCTURELLE, et
//     elle vaut d'être écrite comme une loi, parce qu'elle survivra à
//     toute correction de code :
//         zone M1 = I(angulaire +5) II(succ +2) III(cad −3) XI(succ +2) XII(cad −3) = +3
//         zone M7 = V(succ +2) VI(cad −3) VII(angulaire +5) VIII(succ +2) IX(cad −3) = +3
//     Les deux zones portent le MÊME multi-ensemble de catégories :
//     une angulaire, deux succédentes, deux cadentes. Leur somme de
//     catégorie est donc égale sur TOUS les thèmes possibles.
//     ➜ LA GÉOMÉTRIE DU DÉCOUPAGE NE PEUT RIEN DÉPARTAGER. Tout ce qui
//     sépare les deux camps dans le carré vient de la régence planétaire
//     et de la concordance élémentaire. C'est vérifié à chaque appel :
//     zoneCatM1 3 · zoneCatM7 3.
//
//     T.3 · CE QUE ÇA DONNE UNE FOIS RÉPARÉ — et c'est une déception,
//     dite franchement. Les zones bougent enfin : écart de −28 à +30,
//     médiane −2, sur 150 thèmes aléatoires. Rejoué sur les 53 cas de
//     l'archive qui portent un camp (23 R1 · 18 R7 · 12 nuls) :
//         seuil ±0 : 21/53 (40 %)      seuil ±3 : 25/53 (47 %)
//         seuil ±2 : 25/53 (47 %)      seuil ±5 : 22/53 (42 %)
//     Le taux de base — annoncer R1 à chaque coup — vaut 43 %. Le
//     meilleur seuil rend 47 %, soit deux cas de mieux sur 53. C'est du
//     bruit, et le seuil a été choisi APRÈS avoir vu les réponses, ce
//     qui gonfle encore ce chiffre. Le carré ne prédit pas le camp.
//
//     T.4 · ET LA ROTATION LE DÉGRADE. J'ai essayé la version qui suit
//     sa doctrine habituelle (« M1 ou M7 selon la rotation ») : zone R1
//     = {R1,R2,R3,R11,R12} passée par l'ordre de rotation, zone R7 de
//     même. Résultat 17/53 (32 %) au même seuil — nettement PIRE que le
//     hasard, et pire que la version en maisons fixes. Le découpage
//     gauche/droite du dessin n'est donc pas une rotation déguisée : il
//     mesure autre chose, et cette autre chose ne vaut rien non plus.
//     ➜ La version en maisons fixes est conservée telle quelle, hors
//     vote, affichée comme relevé avec sa justesse mesurée écrite sous
//     le panneau. Aucun poids sur verdictFinal.
//
//     ⚠️ CE QUE ÇA DIT DU RESTE DU FICHIER. Deux pannes silencieuses de
//     la même famille en deux jours, dans le même bloc, toutes deux
//     rendant un résultat plausible sans lever d'erreur. La règle qui
//     en sort : toute fonction indexée par une table de figures doit
//     REFUSER une clé absente, jamais la traiter comme un zéro.
//
// ── U · LE RAPPORT DE FORCE DES CINQ TRIANGLES ── (sa doctrine,
//     03/09/26 : « le carré prédit par les rapports de force entre m1 et
//     m7 avec leur 5 triangles »)
//
//     U.1 · CE QUE SA RÈGLE DU MIROIR IMPOSE, ET QUI N'EST PAS ÉVIDENT.
//     Loi R : M1 est lié aux paires 2-12, 3-11, 4-10, 5-9, 6-8 ; M7 aux
//     mêmes paires par l'inverse. Ce ne sont donc pas dix triangles
//     indépendants : ce sont CINQ BASES PARTAGÉES, chacune portée d'un
//     côté par l'apex M1, de l'autre par l'apex M7.
//     ➜ Conséquence immédiate et fatale pour toute lecture additive :
//     la base étant commune, elle s'annule dans la soustraction. Pour
//     tout score qui s'additionne maison par maison — la dignité
//     accidentelle en premier lieu — les cinq écarts valent TOUS
//     score(M1) − score(M7). Mesuré sur tristitia/via/rubeus/albus :
//     écarts 7 · 7 · 7 · 7 · 7, et dignité(M1) − dignité(M7) = 7.
//     Ce ne sont pas cinq triangles, c'est UNE comparaison recopiée cinq
//     fois. Vérifié à chaque appel sur 64 thèmes tirés :
//     baseAnnuleeConst 1 · baseAnnuleeApex 1.
//
//     U.2 · IL N'Y A DONC QU'UNE LECTURE POSSIBLE, ET C'EST LA SIENNE :
//     la SOMME de la trajectoire (loi Q), qui est un XOR et ne
//     s'additionne pas. M1 ⊕ Ma ⊕ Mb d'un côté, M7 ⊕ Ma ⊕ Mb de l'autre.
//
//     U.3 · ET ALORS LE PÔLE N'EST QU'UNE TRANSLATION. C'est le vrai
//     résultat, et je ne l'attendais pas.
//         somme(pôle, paire i) = figure(pôle) ⊕ base_i,  base_i = Ma ⊕ Mb
//     Le XOR par une figure fixe est une bijection. Donc :
//     ➜ les cinq lectures d'un pôle SONT les cinq bases, déplacées en
//       bloc par la figure de ce pôle ;
//     ➜ M1 et M7 ont TOUJOURS le même nombre de lectures distinctes, et
//       c'est celui des cinq bases. Mesuré sur 2000 thèmes, les deux
//       histogrammes sont identiques au cas près :
//           5 distinctes 1004 · 4 → 843 · 3 → 148 · 2 → 5 · jamais 1
//     ➜ deux triangles d'un même pôle coïncident SSI leurs bases
//       coïncident : 5000/5000, et simultanément pour M1 et pour M7.
//     ➜ les deux lectures d'une même paire diffèrent TOUJOURS de
//       M1 ⊕ M7, une seule figure, la même pour les cinq.
//     Le « rapport de force » se réduit donc à une question unique :
//     des deux translations M1 et M7, laquelle envoie les cinq bases sur
//     des figures présentes dans le thème ? C'est une fonction très
//     mince — ce qui explique sans excuser le résultat qui suit.
//     Gardé à chaque appel : trianglesTranslation 1 ·
//     trianglesMemeCollapse 1 · trianglesCoincidenceBase 1.
//
//     U.4 · ET ÇA NE PRÉDIT PAS. 53 cas de l'archive portent un camp
//     (23 R1 · 18 R7 · 12 nuls), taux de base 43 %.
//         lecture                    maisons fixes     cadre tourné
//         affirmations (5 vs 5)      22/53 (42 %)      17/53 (32 %)
//         influence (occurrences)    26/53 (49 %)      21/53 (40 %)
//         présence en angulaire      17/53 (32 %)      21/53 (40 %)
//         duels triangle/triangle    25/53 (47 %)      20/53 (38 %)
//     Meilleur p unilatéral sur les cas tranchés : 0,077 — soit 0,62
//     après correction pour les huit lectures essayées. Rien.
//
//     ☠️ U.4bis · ET LA COLONNE DE GAUCHE N'EST MÊME PAS UNE MESURE DE
//     CAMP. Je l'ai écrite avant de vérifier ce qu'elle comparait. Le
//     carré est dessiné en MAISONS fixes ; l'archive étiquette les camps
//     en R1/R7. Les deux ne coïncident que si la rotation est triviale,
//     et sur les 53 cas c'est vrai 4 FOIS. Dans les 49 autres, « M1
//     l'emporte » ne dit rien de « R1 l'emporte ». Les 42-49 % de la
//     colonne fixe sont donc un chiffre sans objet, pas un résultat
//     faible : à ne pas citer.
//     ➜ Seule la colonne tournée mesure ce qu'on croit mesurer, et elle
//     donne 32 à 40 % — sous le taux de base. Le rapport de force ne
//     désigne pas le camp.
//     (Sur les 4 cas à rotation triviale la lecture fixe fait 2/4, dont
//     2 sans verdict. Quatre cas ne disent rien.)
//
//     U.5 · L'HYPOTHÈSE DU 5/5, NÉE DES DONNÉES ET MORTE À LA MESURE.
//     Son thème du 03/09/26 (tristitia/via/conjunctio/rubeus) donne un
//     R1 qui affirme 5/5 contre 3/5 — et R1 est bien le vainqueur réel.
//     J'ai voulu savoir si la PERFECTION valait mieux que l'écart. Sur
//     l'archive, les cas où un seul pôle fait 5/5 : 9 en maisons fixes,
//     9 en cadre tourné ; le pôle parfait gagne 5 fois sur 9 dans les
//     deux cas (56 %, p = 0,50). C'est un tirage à pile ou face. Le 5/5
//     survient dans 16 % des thèmes fixes et 23 % des tournés — il n'est
//     même pas rare.
//     ➜ Écrit ici précisément parce que le cas qui l'a fait naître était
//     joli : une hypothèse tirée d'un seul thème se teste avant d'être
//     crue, et celle-ci ne survit pas.
//
//     ☠️ U.6 · UNE FAUSSE JOIE, ÉCRITE POUR NE PAS LA REFAIRE.
//     Un premier passage donnait 26 % en rotation sur presque toutes les
//     lectures — assez bas et assez constant pour ressembler à un signal
//     inversé (« il suffirait de lire à l'envers »). C'était MON bug :
//     j'avais fait tourner l'apex en gardant les paires en maisons
//     fixes, un cadre bâtard qui n'est ni l'un ni l'autre. Cadre tourné
//     pour de bon, ça remonte à 38-40 %, c'est-à-dire rien.
//     Règle : un chiffre trop beau se vérifie AVANT de se raconter.
//
// ── V · LA FORCE D'UNE TRAJECTOIRE, ET LES DEUX ZONES ── (sa règle,
//     03/09/26 : « pour le verdict c'est la zone entre m1 et m7 qui a
//     plus de trajectoires fortes qui remporte »)
//
//     V.1 · CE QU'ELLE REMPLACE, ET POURQUOI IL AVAIT RAISON DE LE
//     SIGNALER. Les zones étaient les deux moitiés du DESSIN, notées à
//     la dignité accidentelle. Réparé le matin même (loi T), le panneau
//     restait faux par construction : les deux moitiés portent le même
//     jeu de catégories, donc l'écart ne tenait qu'au bruit de la
//     régence. Sur son propre thème : +20,75 contre +21, écart −0,25,
//     « carré équilibré ». Un panneau qui ne tranche jamais n'est pas
//     prudent, il est cassé.
//     ➜ Une ZONE, c'est désormais LES CINQ TRAJECTOIRES DE SON PÔLE
//     (loi R). Le découpage spatial ne sert plus qu'au dessin.
//
//     V.2 · LA FORCE, telle qu'il l'avait déjà définie en loi Q (« le
//     comment réside dans sa position, son environnant et son influence
//     dans le thème ») :
//         somme ABSENTE du thème ........ force 0, trajectoire morte
//         somme PRÉSENTE ................ on additionne, sur CHAQUE
//             maison où elle figure, le poids de cette maison :
//                 angulaire 3 · succédente 2 · cadente 1
//         maisons XIII-XVI .............. poids 1, choix explicite : la
//             doctrine des catégories s'arrête à XII, on ne leur prête
//             pas une force qu'aucune règle ne leur donne, et on ne les
//             efface pas non plus.
//     Position ET influence dans un seul nombre — une figure présente
//     trois fois compte trois fois. FORTE = force ≥ 3, c'est-à-dire le
//     poids d'une angulaire. La zone qui compte le plus de fortes
//     l'emporte ; à égalité, la force totale départage.
//     Gardé à chaque appel : forceMaxPopulus 28 (le plafond, seize
//     maisons de la même figure : 4×3 + 4×2 + 4×1 + 4×1) ·
//     forceNulleSsiAbsente 1 (3200/3200 au banc) ·
//     seuilForteVautAngulaire 1.
//
//     V.3 · LA RÈGLE DISCRIMINE, ET C'EST DÉJÀ UN PROGRÈS. Sur 800
//     thèmes tirés, le carré est MUET (autant de fortes ET même force
//     totale des deux côtés) 10,5 % du temps en mode fixe, 9,8 % en
//     rotation. L'ancien panneau, lui, répondait « équilibré » presque
//     toujours. La répartition du nombre de fortes d'un pôle, en fixe :
//         0 → 124 · 1 → 290 · 2 → 242 · 3 → 117 · 4 → 18 · 5 → 9
//     Elle s'étale sur les six valeurs : la note n'est pas dégénérée.
//
//     V.4 · MESURÉ, ET SOUS V8. Verdict affiché de bout en bout, 53 cas
//     de l'archive qui portent un camp, taux de base 43 % :
//         pilote V8 ........................ 36/53  (68 %)
//         carré, mode FIXE (défaut) ........ 30/53  (57 %)  muet 4 fois
//         carré, mode ROTATION ............. 24/53  (45 %)  muet 2 fois
//     ➜ Sa règle fait MIEUX que ce que j'avais bricolé la veille
//     (comptage d'affirmations, 26/53) — de quatre cas. Elle reste sous
//     V8 de six cas. Le carré pilote parce qu'il l'a demandé, et le
//     fichier dit ce que ça coûte.
//
//     ⚠️ V.5 · LES POIDS ET LE SEUIL VIENNENT DE SA DOCTRINE, PAS DU
//     SCORE — et je l'écris parce que la tentation était réelle. Sur
//     l'archive, « force totale seule, en maisons fixes » fait 27/53
//     contre 25/53 pour la règle livrée. J'ai gardé la sienne. Choisir
//     la variante qui gagne sur les cas mêmes qui servent à la mesurer,
//     c'est se fabriquer un résultat, pas en trouver un.
//     Même raison pour le défaut du mode : 'fixe' est retenu parce que
//     le carré est DESSINÉ en maisons fixes et que c'est cette zone-là
//     qu'on a sous les yeux. Qu'il mesure aussi six cas de mieux que la
//     rotation est DANS LE BRUIT à 53 cas, et n'a pas décidé.
//
//     ☠️ V.6 · ET UNE FAUTE DE MA MÉTHODE, NOTÉE ICI PARCE QU'ELLE
//     TOUCHE TOUT CE QUE J'AFFIRME. Le banc A/B que je cite à chaque
//     livraison (« 2055 clés, 0 différence ») construit une empreinte
//     par thème à partir de getVerdictAfficheReel, tablePolesV7,
//     analyseAncrageDeveloppe, analyserReseauAncrageV2, moteurCritereV7,
//     moteurF4P4V7, niveauValiditeV7 et faisceauNulV7.
//     LE CARRÉ N'Y ÉTAIT PAS. J'ai donc annoncé « 0 différence » après
//     avoir corrigé le calcul des zones, alors que l'empreinte ne
//     regardait pas les zones : elle disait seulement que les AUTRES
//     moteurs n'avaient pas bougé. Ce n'était pas faux, c'était à côté
//     de ce que je venais de changer. (Le travail lui-même était
//     vérifié — les écarts des zones ont été mesurés à part sur huit
//     thèmes — mais pas par la ligne que je citais.)
//     ➜ CORRIGÉ : le carré est entré dans l'empreinte
//     (camp:fortes1/fortes2:total1/total2), et la base de comparaison
//     est désormais passée en argument au lieu d'être un cache figé —
//     celui-ci datait de la loi S, plusieurs commits en arrière, sans
//     que rien ne le signale.
//     ➜ RÈGLE : quand un moteur entre dans la décision, il entre dans
//     l'empreinte le même jour. Un banc de non-régression qui ne
//     regarde pas la pièce qu'on vient de toucher ne prouve rien sur
//     elle.
//
//     ☠️ V.7 · ET LE PIÈGE DU MODE FIXE, DIT EN FACE. En fixe, le moteur
//     renvoie 'R1' quand la zone M1 l'emporte — or M1 n'est le siège R1
//     que si la rotation est triviale, 4 cas d'archive sur 53 (loi
//     U.4bis). C'est un raccourci assumé, pas une équivalence. Le
//     panneau écrit « M1 » et « M7 » en fixe, « R1 » et « R7 » en
//     rotation, pour qu'on ne confonde pas à la lecture ce que le code
//     confond dans son étiquette.
//
// ── G · CE QUI RESTE SANS RÉPONSE ──
//     « Pourquoi Via se repose-t-elle en M5 ? » La densité du quatuor ne
//     l'explique pas (M5 donne 6, comme sept autres maisons). La loi
//     d'alternance engendre l'ordre mais ne dit pas pourquoi CET ordre.
//     L'élément ne l'explique pas non plus. C'est la question ouverte de
//     la table, et elle est notée ici pour ne pas être oubliée.
//
// ═══════════════════════════════════════════════════════════════
// ✦ LA LOI D'ALTERNANCE (31/08/26) — extension du théorème d'Ellemine
//
// Il apporte quatre constats sur la table des repos, écrits de mémoire,
// avec leurs listes de nombres. LES QUATRE SONT EXACTS, 8 sur 8 chacun,
// et chaque nombre de ses deux tables tombe juste. Vérifié exhaustivement.
//
//   1. Toute figure de maison PAIRE, combinée à la maison DERRIÈRE,
//      donne ACQUISITIO.                                        8/8 ✔
//        exemple : Laetitia (M2) + Puer (M1) = Acquisitio
//   2. Toute figure de maison IMPAIRE, combinée à la maison DEVANT,
//      donne ACQUISITIO.                                        8/8 ✔
//        (c'est la même paire, lue dans l'autre sens : la combinaison
//         est commutative)
//   3. Figure PAIRE + maison DEVANT — sa liste, vérifiée :
//        M2→M5 · M4→M1 · M6→M13 · M8→M1 · M10→M5 · M12→M1 · M14→M13 · M16→M1
//   4. Figure IMPAIRE + maison DERRIÈRE — sa liste, vérifiée :
//        M1→M1 · M3→M5 · M5→M1 · M7→M13 · M9→M1 · M11→M5 · M13→M1 · M15→M13
//   Son « axe 1-5-13 » est donc réel : les résultantes ne tombent JAMAIS
//   ailleurs que sur M1 (Puer), M5 (Via), M13 (Cauda Draconis) — plus
//   M15 (Acquisitio) pour les deux premiers constats.
//
// ✔✔ ET VOICI LA LOI QUI LES EXPLIQUE TOUS LES QUATRE D'UN COUP.
// La table des seize repos n'est pas une liste : c'est une MARCHE qui
// alterne deux pas.
//     d'une maison IMPAIRE vers la suivante : le pas est TOUJOURS
//        ACQUISITIO ......................................... 8/8
//     d'une maison PAIRE vers la suivante : le pas est TOUJOURS
//        l'un des trois de son axe — Via, Puer ou Cauda ..... 8/8
//        et il suit le motif (Via, Puer, Cauda, Puer), répété deux fois.
// Partant de Puer et en appliquant ces pas, on reconstruit les SEIZE
// repos exactement — 16/16. La table des repos EST cette loi ; il n'y a
// rien d'autre dedans. Ses quatre constats en découlent mécaniquement.
//
// ✔ DEUX FAITS DE PLUS, SORTIS DE LA MÊME FOUILLE :
//   5. Sur les quinze distances possibles, UNE SEULE donne une
//      résultante constante : repos(h) + repos(h+8) = TRISTITIA, 16/16.
//      C'est la loi « X + front du front = Tristitia » vue depuis la
//      table des repos — les deux ne font qu'une.
//   6. POPULUS n'est jamais la résultante de deux repos distincts, à
//      aucune distance. Raison : la combinaison ne s'annule que pour
//      deux figures identiques, et les seize repos sont tous différents.
//   7. Le nombre de résultantes distinctes ne dépend que de la distance :
//        1 résultante  → d = 8
//        2             → d = 4, 12
//        3             → d = 2, 6, 10, 14
//        4             → d = 1, 7, 9, 15
//        5             → d = 3, 5, 11, 13
//
// ⚠️ CE QUE ÇA N'EST PAS. Aucune de ces lois ne prédit un match : ce
// sont des propriétés de la table, vraies avant qu'aucun thème ne soit
// tiré. Leur valeur est ailleurs — elles montrent que l'ordre des repos
// n'est pas arbitraire, et le théorème d'Ellemine s'appuie dessus.
// ═══════════════════════════════════════════════════════════════
// LA DENSITÉ DU QUATUOR (31/08/26) — « un moteur à double tranche »
//
// Sa demande : lire les niveaux d'activation des éléments dans le
// quatuor figure / binôme / antagoniste / protecteur, par rapport à la
// maison occupée — Via en M5, Conjunctio en M12 — et en faire un moteur
// à double tranche.
//
// ☠️ D'ABORD UNE CORRECTION SUR SA TABLE. Il donne les quatre lignes de
// Via, Rubeus, Laetitia, Acquisitio. Via et Acquisitio sont exactes.
// RUBEUS ET LAETITIA SONT INVERSÉES :
//     il écrit  Rubeus 1 2 2 2 · Laetitia 2 1 2 2
//     MAP_GEO   Rubeus 2 1 2 2 · Laetitia 1 2 2 2
// Laetitia porte le point simple sur le FEU, Rubeus sur l'AIR. C'est la
// troisième fois que cette paire précise s'inverse dans ce projet — le
// noyau V1 les avait déjà échangées, et je l'avais corrigé le 26/08.
// Sa STRUCTURE, elle, est juste : Rubeus est bien le binôme de Via,
// Laetitia bien son antagoniste, Acquisitio bien son bouclier.
//
// ✔ ET SA NOTION D'ACTIVATION EXISTE DÉJÀ DANS LE FICHIER. C'est
// alignementActifV7 : une ligne à UN point est active, et par-dessus on
// regarde si elle est compatible avec l'élément de la maison. Sa
// question était déjà la question du code.
//
// LES DEUX TABLEAUX QU'IL DEMANDE, calculés :
//   VIA en M5 (feu)          actives              compatibles
//     figure      Via 1111   feu,air,eau,terre    2 (feu, air)
//     binôme      Rubeus     air                  1
//     antagoniste Laetitia   feu                  1
//     bouclier    Acquisitio air, terre           1
//     front       Fort. Min. feu, air             2
//     densité offensive 6/8 · défensive 1/2
//   CONJUNCTIO en M12 (terre)
//     figure      Conj. 2112 air, eau             1 (eau)
//     binôme      Cauda      feu, air, eau        1
//     antagoniste Tristitia  terre                1
//     bouclier    Via        les quatre           2 (eau, terre)
//     front       Acquisitio air, terre           1
//     densité offensive 5/8 · défensive 1/2
//
// ✔ UN FAIT DE STRUCTURE : la densité du quatuor de Via ne prend que
// DEUX valeurs selon la maison — 6 en maison de feu ou d'air, 3 en
// maison d'eau ou de terre. Jamais autre chose.
// ⚠️ ET SA MAISON DE REPOS N'EST PAS SA MAISON DE DENSITÉ MAXIMALE :
// M5 donne 6, comme M1, M2, M6, M9, M10, M13, M14. « Pourquoi M5 » ne
// se répond donc pas par la densité — la question reste ouverte.
//
// ☠️ ET LE MOTEUR À DOUBLE TRANCHE NE MARCHE PAS. Huit formes testées,
// deux mesures (lignes actives brutes / actives ET compatibles) croisées
// avec quatre lectures, dont la vraie double tranche — l'attaque de l'un
// contre la DÉFENSE de l'autre, pas attaque contre attaque :
//     off(R1)−déf(R7) contre off(R7)−déf(R1) ..... 18/33  55 %
//     attaque contre défense, figure seule ....... 19/27  70 %  ← la meilleure
//     défense adverse la plus faible ............. 19/29  66 %
//     offensive brute la plus forte .............. 19/36  53 %
// La meilleure fait 70 %, p = 0,026 en brut — mais la recherche portait
// sur HUIT combinaisons, seuil de Bonferroni 0,00625 : elle NE SURVIT
// PAS. Et trois choses l'achèvent :
//   • elle est MUETTE sur 12 des 39 cas ;
//   • sur ses 27 cas, le partage de la synthèse fait 18/27 — la même
//     chose, sans rien de neuf ;
//   • sur leurs 11 divergences, la tranche a raison 6 fois, le partage 5.
//     Pile ou face. Et la tranche dit R1 sur DIX de ces onze : dans la
//     zone où elle se distingue, elle est presque le témoin dégénéré.
//
// ➜ La densité du quatuor décrit bien une figure dans sa maison. Elle ne
// désigne pas un vainqueur. Les deux passes ont été faites — casser,
// puis chercher la meilleure forme — et c'est la meilleure forme qui est
// donnée ci-dessus.
// La flèche de la destruction : f détruit la figure de la maison f+3.
// C'est l'antagonisme retourné (loi J.1) — aucun moteur ne s'en sert,
// elle sert la récolte et l'auto-test.
function detruitV7(fig) {
  var i = FIGS_V7.indexOf(fig);
  if (i < 0) return null;
  return FIGS_V7[(i + 3) % 16];
}
// La voie d'une attaque : la combinaison des deux combattants.
function voieAttaqueV7(fig) {
  var c = detruitV7(fig);
  return c ? combine(fig, c) : null;
}

// La ligne du dessin d'Ellemine_D (loi K) : impaires a gauche, Puer
// collee au trait ; paires a droite, Laetitia collee au trait.
function positionLigneV7(fig) {
  var h = FIGS_V7.indexOf(fig) + 1;
  if (h < 1) return null;
  return (h % 2 === 1) ? 8 - (h - 1) / 2 : 8 + h / 2;
}

// Les trajectoires d'Ellemine_D (loi N) : la combinaison des maisons
// qu'une trajectoire traverse. Elle ne sert qu'a la recolte et a
// l'auto-test — aucun moteur ne l'appelle.
var TRAJECTOIRES_V7 = [
  { cle: 'cardinal', nom: 'carre cardinal 1-4-7-10', maisons: [1, 4, 7, 10], reduit: [1, 3, 7] },
  { cle: 'rectangle', nom: 'rectangle 3-5-9-11', maisons: [3, 5, 9, 11], reduit: [1, 2, 3, 6] },
  { cle: 'trigone1', nom: 'trigone de M1 1-5-9', maisons: [1, 5, 9], reduit: [2, 5] },
  { cle: 'trigone7', nom: 'trigone de M7 3-7-11', maisons: [3, 7, 11], reduit: [3, 5, 6, 7] },
  { cle: 'tri147', nom: 'triangle 1-4-7', maisons: [1, 4, 7], reduit: [1, 4, 7] },
  { cle: 'tri1107', nom: 'triangle 1-10-7', maisons: [1, 10, 7], reduit: [1, 3, 4, 7] },
  { cle: 'tri4710', nom: 'triangle 4-7-10', maisons: [4, 7, 10], reduit: [3, 7] },
  { cle: 'tri4110', nom: 'triangle 4-1-10', maisons: [4, 1, 10], reduit: [1, 3] }
];
function trajectoireV7(theme, maisons) {
  if (!theme) return null;
  var r = null;
  for (var i = 0; i < maisons.length; i++) {
    var f = theme[maisons[i]];
    if (!f) return null;
    r = (r === null) ? f : combine(r, f);
  }
  return r;
}

function autoTestAlternanceV7() {
  function rep(h) { return FIGS_V7[((h - 1) % 16 + 16) % 16]; }
  var AXE = { puer: 1, via: 1, cauda_draconis: 1 };
  var r = { impairAcq: 0, pairAxe: 0, recon: 0, d8: 0, pasPairs: [] };
  for (var h = 1; h <= 16; h++) {
    var pas = combine(rep(h), rep(h + 1));
    if (h % 2 === 1) { if (pas === 'acquisitio') r.impairAcq += 1; }
    else { r.pasPairs.push(pas); if (AXE[pas]) r.pairAxe += 1; }
    if (combine(rep(h), rep(h + 8)) === 'tristitia') r.d8 += 1;
  }
  // reconstruction : Puer, puis les pas alternés
  var cour = rep(1), iPair = 0;
  r.recon = 1;
  for (var k = 1; k <= 15; k++) {
    var p2 = (k % 2 === 1) ? 'acquisitio' : r.pasPairs[iPair++];
    cour = combine(cour, p2);
    if (cour === rep(k + 1)) r.recon += 1;
  }
  r.periode4 = r.pasPairs.slice(0, 4).join() === r.pasPairs.slice(4, 8).join();
  // ── les lois de la récolte, vérifiées à l'exécution ──
  r.pariteBoucle = 0;
  for (var m = 1; m <= 16; m++) {
    var att = (m % 2 === 1) ? 'A' : 'B';
    if (loopOf(FIGS_V7[m - 1]) === att) r.pariteBoucle += 1;
  }
  r.composition = 0;
  for (var i = 0; i < 16; i++) for (var j = 0; j < 16; j++) {
    var a = FIGS_V7[i], b = FIGS_V7[j];
    var attendu = (loopOf(a) === loopOf(b)) ? 'B' : 'A';
    if (loopOf(combine(a, b)) === attendu) r.composition += 1;
  }
  // loi H : parité du décalage → boucle de la résultante
  r.pariteDecalage = 0;
  var REL_H = [[BINOMES_V7, 2], [FRONT_V7, 4], [BOUCLIER_V7, 10], [ANTAGONISTES_V7, 13]];
  for (var k3 = 1; k3 <= 16; k3++) {
    var f3 = FIGS_V7[k3 - 1], bonH = true;
    REL_H.forEach(function (R) {
      var att = (R[1] % 2 === 0) ? 'B' : 'A';
      if (loopOf(combine(f3, R[0][f3])) !== att) bonH = false;
    });
    if (loopOf(combine(f3, frontDuFrontV7(f3))) !== 'B') bonH = false;
    if (bonH) r.pariteDecalage += 1;
  }
  r.decalages = 0;
  var REL = [[BINOMES_V7, 2], [FRONT_V7, 4], [BOUCLIER_V7, 10], [ANTAGONISTES_V7, 13]];
  for (var k2 = 1; k2 <= 16; k2++) {
    var f2 = FIGS_V7[k2 - 1], bon = true;
    REL.forEach(function (R) {
      if (FIGS_V7.indexOf(R[0][f2]) + 1 !== (((k2 - 1 + R[1]) % 16) + 1)) bon = false;
    });
    if (bon) r.decalages += 1;
  }
  // ── loi I : les cinq relations, la table complète ──
  // I.1 le bouclier est le front du front du binome
  r.boucliersBinome = 0; r.binomeBouclierTristitia = 0;
  FIGS_V7.forEach(function (f4) {
    if (BOUCLIER_V7[f4] === frontDuFrontV7(BINOMES_V7[f4])
      && BOUCLIER_V7[f4] === BINOMES_V7[frontDuFrontV7(f4)]) r.boucliersBinome += 1;
    if (combine(BINOMES_V7[f4], BOUCLIER_V7[f4]) === 'tristitia') r.binomeBouclierTristitia += 1;
  });
  // I.2 la loi du cardinal : impair -> permutation des 16, pair -> au plus 5
  var ROLES_I = [function (f) { return f; },
    function (f) { return BINOMES_V7[f]; },
    function (f) { return FRONT_V7[f]; },
    function (f) { return BOUCLIER_V7[f]; },
    function (f) { return ANTAGONISTES_V7[f]; }];
  r.cardImpair = 0; r.cardPair = 0;
  for (var msk = 1; msk < 32; msk++) {
    var card = 0, vus = {}, nb = 0;
    for (var b = 0; b < 5; b++) if (msk & (1 << b)) card += 1;
    for (var h4 = 1; h4 <= 16; h4++) {
      var f5 = rep(h4), acc = null;
      for (var b2 = 0; b2 < 5; b2++) if (msk & (1 << b2)) {
        var v = ROLES_I[b2](f5); acc = (acc === null) ? v : combine(acc, v);
      }
      if (!vus[acc]) { vus[acc] = 1; nb += 1; }
    }
    if (card % 2 === 1) { if (nb === 16) r.cardImpair += 1; }
    else if (nb <= 5) r.cardPair += 1;
  }
  // I.3 le quatuor est le front decale de Tristitia
  r.quatuorTristitia = 0;
  for (var h5 = 1; h5 <= 16; h5++) {
    var f6 = rep(h5);
    var q = combine(combine(combine(f6, BINOMES_V7[f6]), FRONT_V7[f6]), BOUCLIER_V7[f6]);
    if (q === combine(combine(f6, FRONT_V7[f6]), 'tristitia')) r.quatuorTristitia += 1;
  }
  // I.4 la roue est double : resultante(h) === resultante(h+8), toute distance
  r.roueDouble = 0;
  for (var d = 1; d <= 15; d++) {
    var okD = true;
    for (var h6 = 1; h6 <= 16; h6++) {
      if (combine(rep(h6), rep(h6 + d)) !== combine(rep(h6 + 8), rep(h6 + 8 + d))) okD = false;
    }
    if (okD) r.roueDouble += 1;
  }
  // I.5 les quatre maisons inatteignables par les cinq relations
  var atteintes = {};
  [2, 4, 8, 10, 13].forEach(function (dd) {
    for (var h7 = 1; h7 <= 16; h7++) atteintes[FIGS_V7.indexOf(combine(rep(h7), rep(h7 + dd))) + 1] = 1;
  });
  r.inatteignables = [7, 9, 15, 16].filter(function (m) { return !atteintes[m]; }).length;
  r.couvertes = Object.keys(atteintes).length;
  // ── loi J : la relation de destruction ──
  r.destAntag = 0; r.destPasReciproque = 0; r.destDeux = 0; r.destQuatre = 0;
  r.bouclierTueAntag = 0; r.riposteDirecte = 0; r.riposteDeuxCoups = 0;
  FIGS_V7.forEach(function (f7) {
    var victime = detruitV7(f7);
    if (ANTAGONISTES_V7[victime] === f7 && detruitV7(ANTAGONISTES_V7[f7]) === f7) r.destAntag += 1;
    if (ANTAGONISTES_V7[ANTAGONISTES_V7[f7]] === BOUCLIER_V7[f7]) r.destPasReciproque += 1;
    if (detruitV7(victime) === BINOMES_V7[FRONT_V7[f7]]) r.destDeux += 1;
    if (detruitV7(detruitV7(detruitV7(victime))) === BOUCLIER_V7[BINOMES_V7[f7]]) r.destQuatre += 1;
    if (detruitV7(BOUCLIER_V7[f7]) === ANTAGONISTES_V7[f7]) r.bouclierTueAntag += 1;
    if (victime === ANTAGONISTES_V7[f7]) r.riposteDirecte += 1;
    if (detruitV7(victime) === ANTAGONISTES_V7[f7]) r.riposteDeuxCoups += 1;
  });
  // les cinq voies, et la separation des deux familles
  var voiesImp = {}, voiesPai = {}, toutesVoies = {};
  for (var h8 = 1; h8 <= 16; h8++) {
    var f8 = FIGS_V7[h8 - 1], v8 = voieAttaqueV7(f8);
    toutesVoies[v8] = 1;
    if (h8 % 2 === 1) voiesImp[v8] = 1; else voiesPai[v8] = 1;
  }
  r.nbVoies = Object.keys(toutesVoies).length;
  r.voiesImpaires = Object.keys(voiesImp).length;
  r.voiesPaires = Object.keys(voiesPai).length;
  r.voiesSeparees = Object.keys(voiesImp).every(function (v) { return !voiesPai[v]; }) ? 1 : 0;
  // les voies impaires sont exactement l'axe 1-5-13
  r.voiesAxe = (Object.keys(voiesImp).sort().join() ===
    ['puer', 'via', 'cauda_draconis'].sort().join()) ? 1 : 0;
  // les cinq voies sont les cinq resultantes de l'antagoniste (loi H)
  var resAnt = {}; FIGS_V7.forEach(function (f9) { resAnt[combine(f9, ANTAGONISTES_V7[f9])] = 1; });
  r.voiesEgalesLoiH = (Object.keys(resAnt).length === r.nbVoies
    && Object.keys(resAnt).every(function (v) { return toutesVoies[v]; })) ? 1 : 0;
  // ── loi K : le dessin de la ligne ──
  r.binomeVoisin = 0; r.binomeRetour = 0;
  FIGS_V7.forEach(function (fk) {
    var p1 = positionLigneV7(fk), p2 = positionLigneV7(BINOMES_V7[fk]);
    var e = Math.abs(p2 - p1);
    if (e === 1) r.binomeVoisin += 1; else if (e === 7) r.binomeRetour += 1;
  });
  var arcsK = FIGS_V7.map(function (fk2) {
    var p3 = positionLigneV7(fk2), p4 = positionLigneV7(ANTAGONISTES_V7[fk2]);
    return { lo: Math.min(p3, p4), hi: Math.max(p3, p4), c: (p3 + p4) / 2 };
  });
  var centres = {};
  arcsK.forEach(function (A) { centres[A.c] = (centres[A.c] || 0) + 1; });
  r.famillesArcs = Object.keys(centres).length;
  r.croiseDedans = 0; r.croiseDehors = 0;
  for (var ia = 0; ia < 16; ia++) for (var ja = ia + 1; ja < 16; ja++) {
    var A1 = arcsK[ia], A2 = arcsK[ja];
    var x = (A1.lo < A2.lo && A2.lo < A1.hi && A1.hi < A2.hi)
      || (A2.lo < A1.lo && A1.lo < A2.hi && A2.hi < A1.hi);
    if (x) { if (A1.c === A2.c) r.croiseDedans += 1; else r.croiseDehors += 1; }
  }
  r.pyramide = 0;
  for (var xk = 1; xk <= 16; xk++) {
    var nb2 = arcsK.filter(function (A) { return A.lo < xk && xk < A.hi; }).length;
    if (nb2 === 2 * Math.min(xk - 1, 16 - xk)) r.pyramide += 1;
  }
  // ── loi L : l'energie saute la victime ──
  r.energieSaut = 0; r.energieDirecte = 0; r.exceptionEnergie = null;
  FIGS_V7.forEach(function (fl) {
    var v = detruitV7(fl), w = detruitV7(v);
    if (concordanceElement(ELEMENTS_V7[fl], ELEMENTS_V7[w]) > 0) r.energieSaut += 1;
    else r.exceptionEnergie = fl;
    if (concordanceElement(ELEMENTS_V7[fl], ELEMENTS_V7[v]) > 0) r.energieDirecte += 1;
  });
  // ── loi M : les deux demi-plans ──
  function arcLigneV7(a, b) {
    var p = positionLigneV7(a), q = positionLigneV7(b);
    return { lo: Math.min(p, q), hi: Math.max(p, q) };
  }
  function croiseV7(P, Q) {
    return (P.lo < Q.lo && Q.lo < P.hi && P.hi < Q.hi)
      || (Q.lo < P.lo && P.lo < Q.hi && Q.hi < P.hi);
  }
  function compteCroisV7(arcs) {
    var t = 0;
    for (var i = 0; i < arcs.length; i++) for (var j = i + 1; j < arcs.length; j++)
      if (croiseV7(arcs[i], arcs[j])) t += 1;
    return t;
  }
  var hautM = FIGS_V7.map(function (fm) { return arcLigneV7(fm, ANTAGONISTES_V7[fm]); });
  var retPL = arcLigneV7('populus', 'laetitia');
  var retAP = arcLigneV7('acquisitio', 'puer');
  var basM = FIGS_V7.filter(function (fm2) { return fm2 !== 'populus'; })
    .map(function (fm3) { return arcLigneV7(fm3, BINOMES_V7[fm3]); });
  r.croisHaut = compteCroisV7(hautM.concat([retPL]));
  r.croisBas = compteCroisV7(basM);
  r.croisHautNu = compteCroisV7(hautM);
  r.croisHautDeux = compteCroisV7(hautM.concat([retPL, retAP]));
  // le binome est la seule relation planaire sur cette ligne
  r.decalagesPlanaires = 0; r.maxCrois = 0;
  for (var dm = 1; dm <= 15; dm++) {
    var am = FIGS_V7.map(function (fm4) {
      return arcLigneV7(fm4, FIGS_V7[(FIGS_V7.indexOf(fm4) + dm) % 16]);
    });
    var cm = compteCroisV7(am);
    if (cm === 0) r.decalagesPlanaires += 1;
    if (cm > r.maxCrois) r.maxCrois = cm;
  }
  // le retour PL epargne exactement ses quatre voisins
  r.plEpargne = 0;
  hautM.forEach(function (am2, im) {
    var fm5 = FIGS_V7[im], gm = ANTAGONISTES_V7[fm5];
    var voisin = (fm5 === 'populus' || fm5 === 'laetitia' || gm === 'populus' || gm === 'laetitia');
    if (!croiseV7(am2, retPL) === voisin) r.plEpargne += 1;
  });
  // le fosse : aucun arc croise entre 7 et 10 fois
  var tousM = hautM.concat([retPL]);
  r.fosse = 1;
  tousM.forEach(function (am3, im2) {
    var c2 = 0;
    tousM.forEach(function (bm, jm) { if (im2 !== jm && croiseV7(am3, bm)) c2 += 1; });
    if (c2 >= 7 && c2 <= 10) r.fosse = 0;
  });
  // le degre : 2/2 partout sauf Laetitia et Populus
  r.degreEquilibre = 0;
  FIGS_V7.forEach(function (fm6) {
    var pf = positionLigneV7(fm6), h2 = 0, b2 = 0;
    tousM.forEach(function (am4) { if (am4.lo === pf || am4.hi === pf) h2 += 1; });
    basM.forEach(function (bm2) { if (bm2.lo === pf || bm2.hi === pf) b2 += 1; });
    var attendu = (fm6 === 'laetitia' || fm6 === 'populus') ? [3, 1] : [2, 2];
    if (h2 === attendu[0] && b2 === attendu[1]) r.degreEquilibre += 1;
  });
  // le couvercle impair enferme les sept autres arcs de gauche
  r.couvercle = basM.filter(function (bm3) {
    if (bm3.lo === retAP.lo && bm3.hi === retAP.hi) return false;  // le couvercle lui-meme
    return retAP.lo <= bm3.lo && bm3.hi <= retAP.hi && !croiseV7(bm3, retAP);
  }).length;
  // ── loi N : les trajectoires ──
  r.identitesTheme = 0; r.reductions = 0; r.partageTrigones = 0; r.diagonales = 0;
  try {
    var essais = 0, idOk = 0, redOk = 0, parOk = 0;
    for (var it = 0; it < 60; it++) {
      var mm = [0, 1, 2, 3].map(function () { return FIGS_V7[Math.floor(Math.random() * 16)]; });
      var th = null;
      try { th = buildThemeFromMothers(mm[0], mm[1], mm[2], mm[3]); } catch (e) { continue; }
      essais += 1;
      var IDS = [[9, 1, 2], [10, 3, 4], [11, 5, 6], [12, 7, 8], [13, 9, 10], [14, 11, 12], [15, 13, 14]];
      var bonId = true;
      IDS.forEach(function (P) { if (th[P[0]] !== combine(th[P[1]], th[P[2]])) bonId = false; });
      if (bonId) idOk += 1;
      var bonRed = true;
      TRAJECTOIRES_V7.forEach(function (T) {
        if (trajectoireV7(th, T.maisons) !== trajectoireV7(th, T.reduit)) bonRed = false;
      });
      if (bonRed) redOk += 1;
      // trigone(M1) + trigone(M7) = rectangle + M1 + M7
      var g = combine(trajectoireV7(th, [1, 5, 9]), trajectoireV7(th, [3, 7, 11]));
      var dr = combine(combine(trajectoireV7(th, [3, 5, 9, 11]), th[1]), th[7]);
      if (g === dr) parOk += 1;
    }
    r.identitesTheme = (essais > 0 && idOk === essais) ? 1 : 0;
    r.reductions = (essais > 0 && redOk === essais) ? 1 : 0;
    r.partageTrigones = (essais > 0 && parOk === essais) ? 1 : 0;
  } catch (e) { /* le builder n'est pas la : les trois restent a 0 */ }
  // les quatre diagonales se croisent
  var D1 = [[1, 7], [4, 10]], D2 = [[3, 9], [5, 11]];
  D1.forEach(function (P) {
    D2.forEach(function (Q) {
      if ((P[0] < Q[0] && Q[0] < P[1] && P[1] < Q[1])
        || (Q[0] < P[0] && P[0] < Q[1] && Q[1] < P[1])) r.diagonales += 1;
    });
  });
  // ── lois E et F : elles n'avaient aucun controle a l'execution, ajoute
  //    le 31/08/26 pour que TOUTE loi de structure de la recolte soit
  //    gardee, pas seulement decrite ──
  // E : les quatre figures d'air se reposent en M3, M7, M11, M15
  r.airMod4 = 0; r.partageElement = 0;
  for (var he = 1; he <= 16; he++) {
    var fe = FIGS_V7[he - 1];
    if (ELEMENTS_V7[fe] === 'air' && he % 4 === 3) r.airMod4 += 1;
    else if (ELEMENTS_V7[fe] !== 'air' && he % 4 !== 3) r.airMod4 += 1;
    // le partage avec l'element de la maison : 4/16, soit le hasard.
    // ⚠️ table MAISON_ELEM_V7 (celle des moteurs), pas ELEMENT_MAISON_V7
    // qui est la table d'affichage et donne 0/16 — les deux coexistent.
    if (typeof MAISON_ELEM_V7 !== 'undefined' && ELEMENTS_V7[fe] === MAISON_ELEM_V7[he]) r.partageElement += 1;
  }
  // F : la distribution des lignes a UN point est le triangle de Pascal
  var distF = [0, 0, 0, 0, 0];
  FIGS_V7.forEach(function (ff) {
    var m = MAP_GEO[ff];
    if (!m) return;
    var k = m.filter(function (x) { return x === 1; }).length;
    if (k >= 0 && k <= 4) distF[k] += 1;
  });
  r.pascal = (distF.join() === [1, 4, 6, 4, 1].join()) ? 1 : 0;
  // ── loi P : les triangles du carre des douze maisons ──
  function arcsTriV7(t) {
    var a = t.slice().sort(function (x, y) { return x - y; });
    return [a[1] - a[0], a[2] - a[1], 12 - (a[2] - a[0])].sort(function (x, y) { return x - y; });
  }
  function natureTriV7(t) {
    var d = arcsTriV7(t);
    if (d[0] === d[1] && d[1] === d[2]) return 'equilateral';
    return (d[0] === d[1] || d[1] === d[2]) ? 'isocele' : 'scalene';
  }
  function axeMaisonV7(h) { return ((h - 1) % 3); }  // 0 cardinal · 1 succedent · 2 cadent
  r.triTotal = 0; r.triEqui = 0; r.triIso = 0; r.triScal = 0;
  r.triUnParAxeBons = 0; r.triUnParAxeSansVoisin = 0; r.triUnParAxeSansVoisinScal = 0;
  r.triMemeAxeIso = 0; r.triMemeAxeTotal = 0;
  r.triDeuxAxesScal = 0; r.triDeuxAxesTotal = 0;
  for (var ta = 1; ta <= 12; ta++) for (var tb = ta + 1; tb <= 12; tb++) for (var tc = tb + 1; tc <= 12; tc++) {
    var T = [ta, tb, tc], nat = natureTriV7(T);
    r.triTotal += 1;
    if (nat === 'equilateral') r.triEqui += 1; else if (nat === 'isocele') r.triIso += 1; else r.triScal += 1;
    var ax = {}; T.forEach(function (h) { ax[axeMaisonV7(h)] = 1; });
    var nbAxes = Object.keys(ax).length;
    if (nbAxes === 3) {
      if (nat !== 'scalene') r.triUnParAxeBons += 1;
      if (arcsTriV7(T)[0] >= 2) {
        r.triUnParAxeSansVoisin += 1;
        if (nat === 'scalene') r.triUnParAxeSansVoisinScal += 1;
      }
    } else if (nbAxes === 1) {
      r.triMemeAxeTotal += 1;
      if (nat === 'isocele') r.triMemeAxeIso += 1;
    } else {
      r.triDeuxAxesTotal += 1;
      if (nat === 'scalene') r.triDeuxAxesScal += 1;
    }
  }
  // ── loi R : la règle du miroir ──
  function apexV7(pole) {
    var o = [];
    for (var k = 1; k <= 5; k++) {
      o.push([pole, ((pole + k - 1) % 12) + 1, ((pole - k - 1 + 12) % 12) + 1]
        .sort(function (x, y) { return x - y; }));
    }
    return o;
  }
  var engendres = {}, apexCompte = {};
  for (var pr = 1; pr <= 12; pr++) {
    apexV7(pr).forEach(function (T) {
      var cle = T.join('-');
      engendres[cle] = 1;
      apexCompte[cle] = (apexCompte[cle] || 0) + 1;
    });
  }
  var isocelesCarre = {};
  for (var ra = 1; ra <= 12; ra++) for (var rb = ra + 1; rb <= 12; rb++) for (var rc = rb + 1; rc <= 12; rc++) {
    if (natureTriV7([ra, rb, rc]) !== 'scalene') isocelesCarre[[ra, rb, rc].join('-')] = 1;
  }
  r.miroirEngendres = Object.keys(engendres).length;
  r.miroirIsoceles = Object.keys(isocelesCarre).length;
  r.miroirIdentiques = (r.miroirEngendres === r.miroirIsoceles
    && Object.keys(engendres).every(function (k) { return isocelesCarre[k]; })) ? 1 : 0;
  r.miroirScalenes = Object.keys(engendres).filter(function (k) {
    return natureTriV7(k.split('-').map(Number)) === 'scalene';
  }).length;
  r.miroirTroisApex = Object.keys(apexCompte).filter(function (k) { return apexCompte[k] === 3; }).length;
  r.miroirUnApex = Object.keys(apexCompte).filter(function (k) { return apexCompte[k] === 1; }).length;
  r.miroirPaires = 0;
  [[2, 12], [3, 11], [4, 10], [5, 9], [6, 8]].forEach(function (P) {
    if (((2 - P[0] - 1 + 24) % 12) + 1 === P[1]) r.miroirPaires += 1;
  });
  // ── loi S : le diamètre de la troisième paire, et l'angle droit ──
  function pairesPoleV7(pole) {
    var o = [];
    for (var k = 1; k <= 5; k++) {
      o.push([((pole + k - 1) % 12) + 1, ((pole - k - 1 + 12) % 12) + 1]);
    }
    return o;
  }
  function estDiametreV7(a, b) { var d = Math.abs(a - b); return Math.min(d, 12 - d) === 6; }
  r.diamTroisieme = 0; r.diamPerp = 0; r.diamRectangles = 0;
  var basesRect = {};
  for (var ps = 1; ps <= 12; ps++) {
    var P = pairesPoleV7(ps);
    var rangs = [];
    P.forEach(function (pr2, i) { if (estDiametreV7(pr2[0], pr2[1])) rangs.push(i + 1); });
    if (rangs.length === 1 && rangs[0] === 3) r.diamTroisieme += 1;
    // la 3e paire est-elle la perpendiculaire de l'axe du pôle ?
    var att = [((ps + 3 - 1) % 12) + 1, ((ps - 3 - 1 + 12) % 12) + 1].sort(function (x, y) { return x - y; });
    var eff = P[2].slice().sort(function (x, y) { return x - y; });
    if (att[0] === eff[0] && att[1] === eff[1]) r.diamPerp += 1;
    // le triangle correspondant est isocèle de forme (3,3,6)
    var T3 = [ps, P[2][0], P[2][1]].sort(function (x, y) { return x - y; });
    var d3 = [T3[1] - T3[0], T3[2] - T3[1], 12 - (T3[2] - T3[0])].sort(function (x, y) { return x - y; });
    if (d3[0] === 3 && d3[1] === 3 && d3[2] === 6) r.diamRectangles += 1;
    basesRect[eff.join('-')] = (basesRect[eff.join('-')] || 0) + 1;
  }
  // six diamètres, deux sommets chacun
  r.diamBases = Object.keys(basesRect).length;
  r.diamDeuxSommets = Object.keys(basesRect).filter(function (k) { return basesRect[k] === 2; }).length;
  // ═══ LOI T — LES DEUX ZONES DU CARRÉ NE PEUVENT PAS SE DÉPARTAGER PAR
  // LA CATÉGORIE (03/09/26, « revois le calcul des zones ») ═══
  // Zone M1 = I·II·III·XI·XII, zone M7 = V·VI·VII·VIII·IX. Ce ne sont pas
  // deux paquets quelconques : chacun porte EXACTEMENT une angulaire,
  // deux succédentes et deux cadentes. Leur somme de catégorie vaut donc
  // +3 des deux côtés, sur TOUS les thèmes possibles, sans exception.
  // Conséquence : tout ce qui départage les deux camps dans le carré vient
  // de la régence planétaire et de la concordance élémentaire — jamais de
  // la géométrie. Ce contrôle est ici pour qu'un panneau qui perdrait de
  // nouveau ces deux composantes (le piège des noms d'affichage) reparte
  // en écart nul et se fasse voir tout de suite.
  (function () {
    var Z1 = [1, 2, 3, 11, 12], Z7 = [5, 6, 7, 8, 9];
    function cat(l) {
      return l.reduce(function (a, h) {
        var c = MAISON_CATEGORIE[h];
        return a + (c ? CATEGORIE_SCORE[c] : 0);
      }, 0);
    }
    r.zoneCatM1 = cat(Z1);
    r.zoneCatM7 = cat(Z7);
    // Et le garde-fou de la dignité : un nom d'affichage doit être REFUSÉ,
    // plus jamais noté au rabais.
    var refus = 0, canon = 0;
    ['Carcer', 'Cauda', 'Fortuna minor', 'Conjonctio'].forEach(function (n) {
      var d = calculerDigniteAccidentelle(1, n, null);
      if (d && d.erreur && d.total === null) refus++;
    });
    ['carcer', 'cauda_draconis', 'fortuna_minor', 'conjunctio'].forEach(function (n) {
      var d = calculerDigniteAccidentelle(1, n, null);
      if (d && !d.erreur && typeof d.total === 'number') canon++;
    });
    r.digniteRefuseAffichage = refus;
    r.digniteAccepteCanonique = canon;
  })();

  // ═══ LOI U — LA BASE PARTAGÉE S'ANNULE (03/09/26, sa doctrine des
  // « rapports de force entre m1 et m7 avec leur 5 triangles ») ═══
  // Les cinq paires miroir sont les MÊMES des deux côtés : chacune porte
  // un triangle d'apex M1 et un triangle d'apex M7. Donc pour TOUT score
  // additif par maison, l'écart entre les deux triangles d'une même paire
  // vaut score(M1) − score(M7), identique pour les cinq. Vérifié ici sur
  // 64 thèmes tirés : les cinq écarts sont toujours égaux entre eux ET
  // égaux à l'écart des seuls apex.
  // ➜ Une lecture additive n'est pas cinq triangles, c'est une seule
  // comparaison recopiée cinq fois. Seule une fonction NON additive — la
  // somme XOR de la trajectoire, loi Q — fait vraiment cinq lectures.
  (function () {
    var paires = [[2, 12], [3, 11], [4, 10], [5, 9], [6, 8]];
    var okConst = 0, okApex = 0, n = 0;
    for (var k = 0; k < 64; k++) {
      var m = [0, 0, 0, 0].map(function () { return FIGS_V7[Math.floor(Math.random() * 16)]; });
      var t;
      try { t = buildThemeFromMothers(m[0], m[1], m[2], m[3]); } catch (e) { continue; }
      if (!t) continue;
      n++;
      function dig(h) {
        var d = calculerDigniteAccidentelle(h, t[h], t);
        return (typeof d.total === 'number') ? d.total : 0;
      }
      var ec = paires.map(function (p) {
        return (dig(1) + dig(p[0]) + dig(p[1])) - (dig(7) + dig(p[0]) + dig(p[1]));
      });
      var ref = Math.round(ec[0] * 1e6);
      if (ec.every(function (v) { return Math.round(v * 1e6) === ref; })) okConst++;
      if (Math.round((dig(1) - dig(7)) * 1e6) === ref) okApex++;
    }
    r.baseAnnuleeConst = (n > 0 && okConst === n) ? 1 : 0;
    r.baseAnnuleeApex = (n > 0 && okApex === n) ? 1 : 0;
    // ET LA SOMME XOR : l'apex n'est qu'une TRANSLATION.
    // somme(pôle, i) = figure(pôle) ⊕ base_i. Le pôle ne change donc pas
    // combien de lectures distinctes il y a — il déplace les cinq en
    // bloc. Trois contrôles :
    //   · la somme du triangle est bien apex ⊕ base
    //   · M1 et M7 ont TOUJOURS le même nombre de sommes distinctes, et
    //     c'est celui des cinq bases
    //   · deux triangles d'un même pôle coïncident SSI leurs bases
    //     coïncident (mesuré 5000/5000)
    var trad = 0, memeNb = 0, ssi = 0, ssiTot = 0, nb2 = 0;
    for (var q = 0; q < 40; q++) {
      var mm = [0, 0, 0, 0].map(function () { return FIGS_V7[Math.floor(Math.random() * 16)]; });
      var tt;
      try { tt = buildThemeFromMothers(mm[0], mm[1], mm[2], mm[3]); } catch (e) { continue; }
      if (!tt) continue;
      nb2++;
      var bases = paires.map(function (p) { return combineMany([tt[p[0]], tt[p[1]]]); });
      var s1 = paires.map(function (p) { return combineMany([tt[1], tt[p[0]], tt[p[1]]]); });
      var s7 = paires.map(function (p) { return combineMany([tt[7], tt[p[0]], tt[p[1]]]); });
      var okT = s1.every(function (v, i) { return v === combine(tt[1], bases[i]); })
        && s7.every(function (v, i) { return v === combine(tt[7], bases[i]); });
      if (okT) trad++;
      function nd(l) { return l.filter(function (v, i) { return l.indexOf(v) === i; }).length; }
      if (nd(s1) === nd(bases) && nd(s7) === nd(bases)) memeNb++;
      for (var i = 0; i < 5; i++) for (var j = i + 1; j < 5; j++) {
        ssiTot++;
        var eb = (bases[i] === bases[j]);
        if ((s1[i] === s1[j]) === eb && (s7[i] === s7[j]) === eb) ssi++;
      }
    }
    r.trianglesTranslation = (nb2 > 0 && trad === nb2) ? 1 : 0;
    r.trianglesMemeCollapse = (nb2 > 0 && memeNb === nb2) ? 1 : 0;
    r.trianglesCoincidenceBase = (ssiTot > 0 && ssi === ssiTot) ? 1 : 0;
  })();

  // ═══ LOI V — LA FORCE D'UNE TRAJECTOIRE (03/09/26, sa règle) ═══
  // Trois faits qui gardent la notation. Ils tomberaient tout de suite si
  // la table des poids, le seuil ou le repli des maisons XIII-XVI étaient
  // touchés sans y penser.
  (function () {
    var t = null;
    try { t = buildThemeFromMothers('populus', 'populus', 'populus', 'populus'); } catch (e) { t = null; }
    // 1) le plafond : seize maisons de la même figure
    //    4 angulaires ×3 + 4 succédentes ×2 + 4 cadentes ×1 + 4 hors-douze ×1 = 28
    r.forceMaxPopulus = (t && forceTrajectoireV7(t, 'populus').force) || 0;
    // 2) force nulle SI ET SEULEMENT SI la somme est absente du thème
    var ok = 0, n = 0;
    for (var k = 0; k < 12; k++) {
      var m = [0, 0, 0, 0].map(function () { return FIGS_V7[Math.floor(Math.random() * 16)]; });
      var th;
      try { th = buildThemeFromMothers(m[0], m[1], m[2], m[3]); } catch (e) { continue; }
      if (!th) continue;
      FIGS_V7.forEach(function (f) {
        var present = false;
        for (var h = 1; h <= 16; h++) if (th[h] === f) present = true;
        var F = forceTrajectoireV7(th, f);
        n++;
        if (present === (F.force > 0)) ok++;
      });
    }
    r.forceNulleSsiAbsente = (n > 0 && ok === n) ? 1 : 0;
    // 3) le seuil de « forte » est bien celui d'une angulaire
    r.seuilForteVautAngulaire = (SEUIL_TRAJ_FORTE_V7 === POIDS_CATEGORIE_TRAJ_V7.angulaire) ? 1 : 0;
  })();

  r.tout = (r.forceMaxPopulus === 28 && r.forceNulleSsiAbsente === 1
    && r.seuilForteVautAngulaire === 1
    && r.baseAnnuleeConst === 1 && r.baseAnnuleeApex === 1
    && r.trianglesTranslation === 1 && r.trianglesMemeCollapse === 1
    && r.trianglesCoincidenceBase === 1
    && r.zoneCatM1 === 3 && r.zoneCatM7 === 3
    && r.digniteRefuseAffichage === 4 && r.digniteAccepteCanonique === 4
    && r.impairAcq === 8 && r.pairAxe === 8 && r.recon === 16 && r.d8 === 16 && r.periode4
    && r.pariteBoucle === 16 && r.composition === 256 && r.decalages === 16
    && r.pariteDecalage === 16
    && r.boucliersBinome === 16 && r.binomeBouclierTristitia === 16
    && r.cardImpair === 16 && r.cardPair === 15
    && r.quatuorTristitia === 16 && r.roueDouble === 15
    && r.inatteignables === 4 && r.couvertes === 12
    && r.destAntag === 16 && r.destPasReciproque === 16
    && r.destDeux === 16 && r.destQuatre === 16 && r.bouclierTueAntag === 16
    && r.riposteDirecte === 0 && r.riposteDeuxCoups === 0
    && r.nbVoies === 5 && r.voiesImpaires === 3 && r.voiesPaires === 2
    && r.voiesSeparees === 1 && r.voiesAxe === 1 && r.voiesEgalesLoiH === 1
    && r.binomeVoisin === 14 && r.binomeRetour === 2
    && r.famillesArcs === 4 && r.croiseDedans === 0 && r.croiseDehors === 45
    && r.pyramide === 16
    && r.energieSaut === 15 && r.exceptionEnergie === 'populus'
    && r.energieDirecte === 8
    && r.croisBas === 0 && r.croisHautNu === 45 && r.croisHaut === 57
    && r.croisHautDeux === 69
    && r.decalagesPlanaires === 2 && r.maxCrois === 61
    && r.plEpargne === 16 && r.fosse === 1
    && r.degreEquilibre === 16 && r.couvercle === 7
    && r.identitesTheme === 1 && r.reductions === 1 && r.partageTrigones === 1
    && r.diagonales === 4
    && r.airMod4 === 16 && r.partageElement === 4 && r.pascal === 1
    && r.triTotal === 220 && r.triEqui === 4 && r.triIso === 48 && r.triScal === 168
    && r.triUnParAxeBons === 40 && r.triUnParAxeSansVoisin === 28
    && r.triUnParAxeSansVoisinScal === 0
    && r.triMemeAxeTotal === 12 && r.triMemeAxeIso === 12
    && r.triDeuxAxesTotal === 144 && r.triDeuxAxesScal === 144
    && r.miroirEngendres === 52 && r.miroirIsoceles === 52 && r.miroirIdentiques === 1
    && r.miroirScalenes === 0 && r.miroirTroisApex === 4 && r.miroirUnApex === 48
    && r.miroirPaires === 5
    && r.diamTroisieme === 12 && r.diamPerp === 12 && r.diamRectangles === 12
    && r.diamBases === 6 && r.diamDeuxSommets === 6);
  return r;
}

