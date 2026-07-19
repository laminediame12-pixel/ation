# Repères du système géomantique (mis à jour 17/07/26)

Ce fichier sert de tableau de bord pour se repérer rapidement dans l'état du
système : ce qui est validé, ce qui est rejeté, ce qui reste ouvert. À
consulter avant de proposer une nouvelle piste (éviter de retester une
hypothèse déjà rejetée) et avant de modifier `verdictFinal` (connaître
l'ordre exact de la cascade et le score de chaque étage).

## 0. Principes déterminateurs du verdict (le fond, pas les matchs)

Ce sont les mécanismes géomantiques eux-mêmes — la logique qui décide qui
gagne, indépendamment de tel ou tel match. Classés par ordre d'intervention
réel dans `verdictFinal`.

| Principe | Ce qu'il dit | Ce qu'il détermine |
|---|---|---|
| **Loi du binôme ouvre la voie** | Si A attaque B (A = antagoniste de B), alors binôme(A) attaque TOUJOURS binôme(B) — identité algébrique, vraie sur les 16 figures sans exception (pas une observation, une conséquence directe de la construction de `FIGS_V7` : binôme = +2, antagoniste = −3 sur le même cycle de 16). Une attaque nominale ne devient réelle que si le binôme de l'attaquant neutralise (présent, bien positionné, concordance>0) le binôme de la cible. | Sert de brique de base à tous les autres principes : c'est elle qui dit si une attaque, une libération ou un blocage "passe" réellement dans un thème donné, et pas seulement sur le papier. |
| **Chaîne de dualité** | Pour un chef F : l'**assaillant** (antagoniste de F) l'attaque ; le **libérateur** (antagoniste de l'assaillant) attaque l'assaillant et libère F ; la **victime** est la figure que F attaque lui-même ; l'**ancre** est le binôme propre de F. Chaque lien de cette chaîne à 4 figures n'est réel que si la loi du binôme (ci-dessus) le confirme. | F "domine" si sa voie offensive vers sa victime est ouverte ET s'il est libre (pas menacé, ou menacé mais libéré). |
| **Petit calcul (soutien / obstacle)** | Pour une figure X : combine(X, puella) si X est du cycle pair → résultat = un **soutien** (renforce X s'il est présent dans le thème) ; combine(X, acquisitio) si X est du cycle impair → résultat = un **obstacle** (affaiblit X s'il est présent). Appliqué au chef ET à son assaillant : comme leurs cycles sont TOUJOURS opposés, les deux effets pointent TOUJOURS dans le même sens pour un chef donné (jamais contradictoires entre eux). | Score net (compte 0/1/2 blocs présents, signé selon le cycle du chef) qui départage M1 contre M7 en priorité dans la chaîne de dualité. |
| **Force des maisons (force relationnelle)** | La force réelle d'une figure dépend des maisons qu'elle occupe (base ou résultante) : élément de la figure/résultante face à l'élément de la maison, plus bonus si auto-construction (résultante = son propre binôme), pénalité si auto-destruction (résultante = son propre antagoniste), bonus si double concordance. | Départage les cas où le petit calcul est à égalité des deux côtés. |
| **Trahison directe (guerre civile)** | Quand M1 et M7 sont dans la même boucle de binôme (même cycle), le binôme protecteur d'un chef peut en réalité attaquer une figure qui protège le camp ADVERSE (`detecteurGuerreCivile`) — trahison structurelle, pas une simple comparaison de forces. Signal calculé de longue date mais jamais branché en priorité (testé le 10/07/26 sur `verdictElementaire` seul : régression 61%→57%). **Branché le 19/07/26** après retest sur la cascade actuelle complète (accord explicite utilisateur : "branche-le, si ça ne change pas les résultantes de 21 matchs") — neutre sur l'archive (0 flip, ne s'applique qu'à 1 seul match archive où il se trompait déjà), corrige le miss réel Laetitia/Tristitia (voir ligne suivante). | **PRIORITAIRE depuis le 19/07/26, juste avant la confirmation résultante+binôme** — neutre sur l'archive (21/25 inchangé), 1/2 en usage réel isolé (1 miss archive + 1 hit hors archive) — trop peu de données pour être pleinement validé, à surveiller. |
| **Confirmation résultante+binôme (M1/M7)** | Le résultante d'une maison "confirme" sa figure de base si : même polarité (favorable/défavorable), binôme de la figure de base présent dans le thème, résultante en harmonie élémentaire avec la maison, et binôme lui-même en harmonie avec une de ses maisons — demande explicite utilisateur, 18/07/26. Ne tranche que si exactement un des deux camps confirme. | **PRIORITAIRE depuis le 18/07/26** (juste après la trahison directe depuis le 19/07/26) — 9/10 (90%) isolé sur l'archive, `verdictFinal` complet passe de 18/25 à **21/25 (84%)**. **1er vrai match hors archive testé (19/07/26, Laetitia/Tristitia) : MISS net** (prédit Équipe 1 5-4, réel Équipe 2 10-2), **corrigé depuis par la trahison directe** placée juste avant elle dans la cascade. **2e vrai match hors archive (19/07/26, Acquisitio/Acquisitio miroir M1=M7) : HIT** (prédit Équipe 1 3-2, réel Équipe 1 4-3 — vainqueur ET écart net corrects) — track record isolé du palier confirmation désormais 1/2 en réel, à continuer de surveiller. |
| **Max des 4 forces (M1/M7/R1/R7)** | Compare directement les 4 forces de chaîne de dualité (`chaineDualite().forceMaisons` de M1, M7, R1, R7, Constat 11 inclus) et retient le CAMP auquel appartient le maximum absolu des 4 (M1 ou R1 → Équipe 1 ; M7 ou R7 → Équipe 2) — demande explicite utilisateur, 17/07/26 : "M1>M7 et R1 et R7 → équipe 1 gagne", etc. Ne tranche pas si le maximum est partagé entre les deux camps (repli sur l'ancrage classique). | **Repli quand la confirmation résultante+binôme est indécise** (n'est plus le premier mécanisme depuis le 18/07/26) — `verdictFinal` complet était passé de 17/27 à 18/27 grâce à elle (décide 19/27 matchs) avant l'ajout de la confirmation. Peut inverser un verdict déjà donné par l'ancrage classique sur le même thème (constaté sur le thème Amissio/Albus/Tristitia/Conjunctio : M1 avant, M7 après). |
| **Ancrage (chaîne complète)** | Compare la force de TOUTE la chaîne de dualité (chef, ancre, assaillant, libérateur, victime + leurs 3 binômes, **+ obstacle et son attaquant depuis le 17/07/26 (Constat 11, contribution signée +attaquant−obstacle)** — `chaineDualite().forceMaisons`) entre M1 et M7 — pas seulement l'ancre isolée ("l'ancrage doit constituer toute la chaîne", demande explicite). Étendu le même jour (17/07/26, "retour en ancrage côté rotation") au duel R1/R7 : les deux côtés (fixe et rotation) sont comparés, celui avec le plus grand écart de force gagne l'arbitrage. | Repli quand le max des 4 forces est indécis (maximum partagé entre les deux camps) — chaîne à 8 figures : validée seule 16/27 (fixe seul), `verdictFinal` complet 15/27 avec la rotation ajoutée, 17/27 avec Constat 11. |
| **Écart de dominance** | Entre le duel M1/M7 (mode fixe) et le duel R1/R7 (rotation par force du repos), on fait confiance à celui des deux qui affiche l'écart de dominance interne le plus large (le plus "tranché"), pas systématiquement à la rotation. | Mécanisme le mieux validé seul (20/27 sur l'archive) mais plus consulté en premier — l'ancrage direct tranche avant lui. |
| **Impasse totale de boucle** | Dans la guerre civile (attaques effectives + chaîne de force), si les deux camps sont à égalité parfaite sur les deux critères à la fois, c'est structurellement un nul. | Nul prioritaire, avant même l'ancrage direct et l'écart de dominance. |
| **Preuve structurelle (binôme/antagoniste)** | `antagoniste(binôme(X)) = binôme(antagoniste(X))` et `antagoniste²(X) = binôme⁵(X)` — toujours vraies sur les 16 figures, ce sont des identités algébriques (mêmes décalages fixes +2/−3 sur `FIGS_V7`), pas des lois statistiques. | Ne détermine rien directement — explique POURQUOI la loi du binôme et le petit calcul ne peuvent pas être pris en défaut. |

**Ordre d'intervention réel dans `verdictFinal`** : impasse totale de
boucle → écart de dominance → chaîne de dualité (petit calcul, puis
domine, puis force des maisons) → verrous de nul → règles de nul
spécifiques. Voir §1 pour le détail complet avec fonctions et scores.

## 1. Cascade `verdictFinal` — ordre exact et statut de chaque étage

| Ordre | Étage | Fonction / repère code | Score / validation | Statut |
|---|---|---|---|---|
| 1 | Abstention | `themeDetruit`, `themeInvalidite` | ~31% des thèmes aléatoires invalides | Actif |
| 2 | Impasse totale de boucle (nul) | `verdictElementaire` + `piliersReposCount<2` | 2/3 réel (Olympiacos-WestHam 7-7, FIFA 4-4 ; **MISS le 18/07/26** : caput_draconis/via/acquisitio/fortuna_major, réel 2-1 Équipe 1, PAS un nul) | Actif, à revoir si d'autres MISS s'accumulent |
| 2b | Superposition ancre/assaillant (nul) | `superpositionAncreAssaillant(theme)` | n=1 réel (Suisse-Colombie 0-0) | Actif, 0/27 sur l'archive (aucun risque de régression) |
| 2c | **Trahison directe (guerre civile)** | `detecteurGuerreCivile(theme)` — quand M1/M7 partagent la même boucle de binôme, détecte si le binôme protecteur d'un camp attaque en fait le gardien de l'arme adverse (`gcU.winner`), signal existant mais jamais branché avant | **Neutre sur l'archive (21/25 inchangé, 0 flip — ne s'applique qu'à 1 match archive, déjà un miss avant/après)**. Corrige le miss réel Laetitia/Tristitia (19/07/26, voir §3) — track record isolé 1/2 (1 miss archive + 1 hit réel) | **Actif, PRIORITAIRE sur la confirmation résultante+binôme** (branché 19/07/26, accord explicite utilisateur — "branche-le, si ça ne change pas les résultantes de 21 matchs" — condition vérifiée avant intégration) — signal encore peu testé (n=2 au total), à surveiller sur les prochains matchs |
| 2d | **Confirmation résultante+binôme (M1/M7)** | `confirmationResultanteBinome(pos, theme)` — le résultante de M1 (ou M7) "confirme" la figure de base si : polarité base=résultante (`FIGURE_MEANINGS_PERSO`) ET binôme présent dans le thème ET résultante en harmonie élémentaire avec la maison (`forceMaisonV7≥60`) ET binôme lui-même en harmonie avec une de ses maisons. Ne tranche que si EXACTEMENT un des deux camps confirme | **9/10 (90%) isolé sur l'archive** (10/27 matchs concernés) ; **21/25 (84%) pour `verdictFinal` complet avec ce palier en priorité**, contre 18/25 (72%) sans lui — +3 net (répare Argentine-Egypte, Chelsea-Napoli, Man City-Dortmund, Ferencvárosi-Qarabag ; casse Côte d'Ivoire-Norvège). **1er vrai match hors archive (19/07/26, Laetitia/Tristitia) : MISS** (prédit Équipe 1 5-4, réel Équipe 2 10-2) — **corrigé depuis par la trahison directe (2c) placée juste avant** — voir §3 | **Actif, repli quand 2c (trahison directe) est indécise, PRIORITAIRE sur "max des 4 forces"** (demande explicite utilisateur, 18/07/26 — "le resultante confirme ou nie la figure de base... ajoute la nécessité du binôme et aussi harmonie du resultante et aussi et du binôme pour la confirmation") — meilleure amélioration mesurée à ce jour sur l'archive, se déclenche sur ~16% des thèmes aléatoires (1500 testés, 0 crash) |
| 2e | **Max des 4 forces (M1/M7/R1/R7)** | `chaineDualite(...).forceMaisons` de M1, M7, R1, R7 comparées directement, dans `verdictFinal` — le camp du maximum absolu des 4 tranche (repli sur 2f si le maximum est partagé entre les deux camps) | **18/27 (67%) en priorité sur l'archive** (décide 19/27 matchs), contre 17/27 sans cette règle. **Sur les vrais matchs hors archive (§3) : 3 HIT (LA Galaxy, amissio×2/carcer/laetitia, via/acquisitio/caput×2) puis 1 MISS net le 18/07/26** (puer/laetitia/amissio/acquisitio, San Diego vs Montréal — prédit Montréal net, réel 5-0 San Diego, ET la capacité de but brute `calculerButsCamp` — calcul totalement indépendant — était elle aussi tombée d'accord pour Montréal : les deux mécanismes se sont trompés ensemble, pas une simple incohérence interne), **puis 1 nouveau HIT le 19/07/26** (albus/tristitia/tristitia/caput_draconis — mode fixe seul aurait favorisé M7 (210 vs 515), mais R1=1185 l'emportait sur les 4 valeurs → M1 prédit, réel 5-3 M1, score exact quasi juste 5-4 prédit), **puis encore 1 HIT le 19/07/26** (via/amissio/rubeus/rubeus — M1=920 maximum absolu des 4 valeurs, accord fixe+rotation → M1 prédit, réel 5-4 M1, même écart net +1 que le score estimé 3-2), **puis encore 1 HIT le 19/07/26** (tristitia/albus/fortuna_minor/conjunctio — M7=865 maximum absolu, accord fixe+rotation → M7 prédit, réel **8-2 M7**, score estimé 4-5 : vainqueur correct mais écart réel (+6) bien plus large que l'écart prédit (+1), la sous-estimation de magnitude déjà notée sur les 2 matchs précédents s'aggrave nettement ici) — **track record réel désormais 6/7 sur le vainqueur, mais l'écart de score estimé reste systématiquement trop faible sur les 3 derniers matchs (+1 prédit à chaque fois, réel +1/+1/+6) — piste à explorer si on veut un jour affiner l'estimation du score, pas seulement le vainqueur** | **Actif, repli quand 2c et 2d sont indécis** (demande explicite utilisateur, 17/07/26 — "instaure le mode fixe, on teste ça... par comparaison si M1>M7 et R1 et R7 équipe 1 gagne...") — n'est plus le premier mécanisme consulté depuis l'ajout de 2c/2d |
| 2f | **Ancrage (chaîne complète, fixe + rotation + obstacle)** | `chaineDualite(chef,theme).forceMaisons` (8 figures + Constat 11 obstacle/attaquant signé) comparée M1/M7 (fixe) ET R1/R7 (rotation, `getRotationOrderFromRepos`), dans `verdictFinal` — le côté à plus grand écart de force tranche | **2/2 HIT réel confirmés** (match virtuel Fortuna Minor/Albus 8-1 M1 ; St. Louis City SC vs Sporting Kansas City 3-2 M1 — voir §3) | **Actif, repli quand 2c, 2d et 2e sont indécis** (demande explicite utilisateur, 17/07/26 — "l'ancrage doit constituer toute la chaîne", puis "retour en ancrage côté rotation", puis "entre le [Constat 11] dans le calcul du verdict") — trajectoire du score mesuré de `verdictFinal` complet : 19/27 → 16/27 (rotation ajoutée) → 15/27 → 17/27 (Constat 11 ajouté) → 18/27 (max des 4 forces ajouté) → 21/25 (84%) (confirmation résultante+binôme ajoutée, 18/07/26) → **toujours 21/25** (trahison directe ajoutée en priorité, 19/07/26, neutre sur l'archive) |
| 3 | Plus grand écart de dominance | bloc `carteRot`/`carteFixe` dans `verdictFinal` | 20/27 (74%) sur l'archive, seul | N'est plus le premier mécanisme consulté depuis l'ajout de l'ancrage (2f) — ne s'exprime que si l'ancrage ne tranche pas |
| 4 | Chaîne de dualité (repli) | `verdictChaineDualite(theme)` | 19/27 (70%) seule | Repli, atteint seulement si ni l'ancrage ni l'écart de dominance ne tranchent |
| 5 | Verrou piliers / verrou M16 feu | `piliersReposCount>=2`, `verrouM16Feu` | 0/4 nul réel quand verrouillé ; M16 feu 6/6 | Bloque les règles de nul suivantes |
| 6 | Profil nul structurel (entre-blocage) | `profilNulStructurel` | 17/17 empirique | Règle de nul la mieux validée |
| 7 | Juge Conjunctio | condition `theme[15]==='conjunctio'` + binôme présent | 3/4 réel | — |
| 8 | Juge Acquisitio | condition `theme[15]==='acquisitio'` + résonance≥6 | 3/4 réel | — |
| 9 | Symétrie mères/filles | — | 2/3 réel | — |
| 10 | Double neutralisation + fusion | — | n=1 | — |

Rangs `rangParole()` (fiabilité décroissante de la source de la décision) :
5 = jamais démenti / 17-17 ; 4 = nul confirmé fort ; 3 = écart de
dominance ; 2 = chaîne de dualité (repli) ; 1 = indécis.

## 2. Chaîne de dualité — état détaillé (17/07/26)

Fonctions clés (toutes dans `index.html`, chercher par nom) :
- `victimeDe(fig)` — figure attaquée par `fig` (décalage +3 dans `FIGS_V7`).
- `petitCalcul(fig)` — `combine(fig, 'puella')` si `fig` cycle pair
  (`getBinomeCycle`==2), sinon `combine(fig, 'acquisitio')`.
- `scorePetitCalcul(chef, theme)` — **fonction de décision actuelle**.
  Compte les 2 blocs (`petitCalcul(chef)`, `petitCalcul(assaillant)`)
  présents dans le thème (0/1/2), signe selon le cycle du chef (pair=+,
  impair=−). **Fait structurel qui rend ce score jamais contradictoire** :
  le cycle du chef et celui de son assaillant sont TOUJOURS opposés
  (vérifié exhaustivement sur les 16 figures).
- `chaineDualite(chef, theme)` — objet complet : `assaillant`,
  `liberateur`, `victime`, `ancre`, les 3 binômes (`binAssaillant`,
  `binLiberateur`, `binVictime`), `forceMaisons` (8 figures via
  `forceRelationnelleFigure`), `pcScore`, `domine`.
- `verdictChaineDualite(theme)` — compare `pcScore` M1 vs M7 (verrou
  prioritaire) ; sinon `domine` net ; sinon `forceMaisons`.
- `forceRelationnelleFigure(fig, theme)` — réutilise `forceMaisonV7`,
  `checkAutoConstruction`, `checkAutoDestruction`,
  `checkMaisonDoubleConcordance` sur toutes les maisons occupées (base +
  résultante via `trouverFigV7`).
- `voieOuverte(attaquant, cible, theme)` — loi du binôme (16/16 prouvée) :
  une attaque ne passe que si le binôme de l'attaquant neutralise le
  binôme de la cible.
- `preuveLoiBinomeAntagoniste()` — preuve algébrique exhaustive (panneau
  🧮), `antagoniste(binôme)=binôme(antagoniste)` et `antagoniste²=binôme⁵`,
  16/16 toujours vraies (pas des lois statistiques, des identités).

### Historique des versions testées (pour ne pas revenir en arrière sans raison)

| Version | Archive | Liverpool-ManCity | Argentine-Egypte | Chelsea-Napoli | Statut |
|---|---|---|---|---|---|
| 5 figures, sans petit calcul | 16/27 | — | — | — | dépassée |
| 8 figures (+ 3 binômes) | 17/27 | — | — | — | dépassée |
| + verrou obstacle seul (impair) | 19/27 | raté | **correct** | correct | dépassée |
| + verrou obstacle/renforcement (OR simple) | 20/27 | **cassé** | correct | correct | dépassée (instable) |
| + comptage étagé (assaillant puis chef) | 19/27 | correct | correct | **cassé** | dépassée (instable) |
| **`scorePetitCalcul` (table exhaustive, jamais contradictoire)** | **19/27** | **correct** | **correct** | à revérifier | **version actuelle** |

### Limite connue

Sur 6 vrais matchs hors archive (voir tableau §3), la chaîne de dualité
seule fait 3/6 (50%) avec la version actuelle. Pas encore aussi fiable que
l'écart de dominance (20/27) — reste un repli, pas le mécanisme principal.

## 3. Table de référence des vrais matchs analysés (hors archive `export_data.json`)

| Match | Mères (M1→M4) | Réel | Chaîne de dualité | `verdictFinal` complet |
|---|---|---|---|---|
| Liverpool vs Man City | caput_draconis/amissio/via/caput_draconis | 9-10, **M7** | HIT (M7) | — |
| Chelsea vs Atlético | caput_draconis/albus/amissio/via | 0-5, **M7** | MISS (prédit M1) | — |
| France vs Espagne | fortuna_minor/albus/amissio/via | 0-2, **M7** (MT 0-1) | HIT (M7) | — |
| Suisse vs Colombie | carcer/carcer/cauda_draconis/amissio | 0-0, **Nul** | MISS (mécanisme binaire, ne peut pas dire Nul) | **HIT (Nul), corrigé le 17/07/26 par `superpositionAncreAssaillant`** |
| USA vs Belgique | via/caput_draconis/conjunctio/rubeus | 4-1 Belgique, **M7** | MISS (prédit M1) | — |
| Argentine vs Egypte | carcer/amissio/carcer/puer | 3-2, **M1** | HIT (M1) | — |
| (match virtuel, 05:30) M1=Fortuna Minor/M7=Albus | fortuna_minor/tristitia/conjunctio/acquisitio | 8-1, **M1** | — | **HIT (M1) via ancrage chaîne complète (force 1140 vs 570)** — le mode fixe classique (écart de dominance) se serait trompé : scoreMain interne 1-4 pour M7, sens opposé au réel |
| St. Louis City SC vs Sporting Kansas City | conjunctio/via/puella/puer | 3-2, **M1** | — | **HIT (M1) via ancrage chaîne complète (force M1=820, force M7=710)** — le `scoreMain` affiché par `buildVerdictCard` pour ce thème est **3-2**, exactement le score réel (mécanisme distinct : ancrage tranche le vainqueur, `buildScoreFromCamps` estime le score, coïncidence exacte à noter mais pas encore généralisable sur un seul cas) |
| LA Galaxy vs Los Angeles FC | via/albus/caput_draconis/via | 3-0, **M7** (2e but sur penalty, 1re MT) | ÉGALITÉ TOTALE (M1=M7=875 — même figure Via aux deux ancres, chaîne isolée incapable de départager) | **HIT (M7) via VERDICT MAX 4 FORCES (M1=875, M7=875, R1=645, R7=895)** — seul mécanisme ayant pu trancher ce thème, le mode fixe classique étant dans l'incapacité totale de départager. `Penalty/Rouge` prédit **Oui** et **confirmé** (LA Galaxy concède, Los Angeles FC transforme) — via `check(1)` (Via/eau en M1/feu → rôle "Chaotique"). Ce signal ne se retrouvait PAS en mode rotation seul (R1=maison 5=carcer=Absorbeur, R7=maison 11=albus=Adaptateur, aucun Chaotique) : `detectIncidentChaotique` COMBINE désormais les deux modes (18/07/26, demande explicite utilisateur "combine les deux", après un essai de remplacement pur qui avait fait perdre ce signal) — check(1)/check(7) fixes ET check(posA)/check(posB) du mode réellement affiché tournent tous les deux, dédoublonnés automatiquement (pos+label identiques) quand les deux modes coïncident. Le signal Rubeus-en-M12 (`[12,'rubeus']`, resté fixe intentionnellement) N'A PAS déclenché (`confrontationBinome` renvoie `rupture:false`) — c'est bien le combo Via/feu/M1 qui explique l'incident. Score prédit 2-3 (BTTS oui) faux face au 3-0 clean sheet réel — seuls le vainqueur et le signal penalty se confirment |
| (match, 18/07/26) M1=Caput Draconis/M7=Puer | caput_draconis/via/acquisitio/fortuna_major | 2-1, **M1** | — | **MISS du nul (impasse totale de boucle, "guerre civile" à 2/2 avant ce cas → 2/3 maintenant)** — `verdictFinal` avait tranché **Nul** ("impasse totale de boucle"), mais le match n'était PAS nul (2-1 Équipe 1). La carte affichée (estimation moteur V7, `verdictFinal` étant muet sur le vainqueur) donnait "Équipe 1, 3-2" — **vainqueur correct** malgré un score exact faux. `BTTS` prédit **Oui** et **confirmé** (2-1, les deux marquent) — Via N'ÉTAIT PAS en M4 (M4=fortuna_major) donc le correctif Via-M4 (18/07/26) ne s'applique pas ici, cohérent avec le résultat réel |
| (match, 18/07/26) M1=Amissio/M7=Fortuna Minor | amissio/amissio/carcer/laetitia | 4-0, **M1** | — | **HIT (M1) via VERDICT MAX 4 FORCES (M1=1395, M7=710, R1=925, R7=960)** — 2e confirmation réelle de ce mécanisme (après LA Galaxy). `Penalty/Rouge` prédit **Oui** et **confirmé** (carton rouge réel). `BTTS` prédit **Oui** mais **FAUX** — réel 4-0, Équipe 2 totalement muette. Score exact aussi faux (2-1 prédit vs 4-0 réel). Via N'ÉTAIT PAS en M4 (M4=laetitia) donc le correctif Via-M4 ne s'applique pas — mais **Via est présent EN MÊME TEMPS EN M5 ET M11** (les deux maisons "camp M7"/attaque désignées par `butsGuerreDes16`), et c'est justement le camp M7 qui reste à 0 — parallèle structurel frappant avec Via-M4 (même logique, côté opposé), mais **n=1 seulement** dans l'archive actuelle (aucun autre thème connu n'a Via en M5 ET M11 à la fois) : piste notée en §5, PAS intégrée (Via en M5 SEUL, lui, apparaît aussi sur Suisse-Colombie et Argentine-Egypte sans direction cohérente — c'est la conjonction M5+M11 qui semble spécifique, à confirmer) |
| (match, 18/07/26) M1=Via/M7=Puella | via/acquisitio/caput_draconis/caput_draconis | 3-1, **M7** (but M1 sur penalty) | — | **HIT (M7) via VERDICT MAX 4 FORCES (M1=930, M7=630, R1=745, R7=1155)** — 3e confirmation réelle de ce mécanisme. `Penalty/Rouge` prédit **Oui** et **confirmé** (penalty réel, mais attribué au camp PERDANT — R1/Équipe 1 — pas au camp gagnant comme sur LA Galaxy ; le signal ne prédit pas encore la direction du penalty, juste sa survenue). `BTTS` prédit **Oui** et **confirmé** (3-1, les deux marquent). Score exact proche mais faux (2-3 prédit vs 3-1 réel — même écart net que le vainqueur, magnitude légèrement différente). Aucun correctif Via-M4/M5+M11 applicable (M4=caput_draconis, M5=laetitia, M11=caput_draconis). Observation utilisateur à suivre ("à chaque fois il y a pénalité ça stabilise le score") : sur les 2 seuls cas réels avec penalty confirmé (LA Galaxy 3-0, celui-ci 3-1), le score final reste dans un écart net contenu (3 buts d'écart max) plutôt qu'un score qui explose — **n=2 seulement, beaucoup trop tôt pour valider**, mais à recontre-tester sur chaque nouveau vrai match avec penalty |
| San Diego vs Montréal (18/07/26) | puer/laetitia/amissio/acquisitio | 5-0, **M1 (San Diego)** | — | **MISS NET (M1=1020, M7=1210, R1=1020, R7=1210) → verdictFinal avait tranché Montréal (M7), réel 5-0 San Diego** — 1er vrai MISS de VERDICT MAX 4 FORCES (3/3 → 3/4). Fait notable : la capacité de but brute `calculerButsCamp` (calcul complètement indépendant de la chaîne de dualité) était ELLE AUSSI tombée d'accord pour Montréal (1 vs 2) — les deux mécanismes se sont trompés ENSEMBLE, pas de contradiction interne détectable à l'avance. Chaîne de dualité : Puer (M1/San Diego) jugé "entravé" (menacé par Puella, non libéré par Conjunctio — voie fermée), Albus (M7/Montréal) jugé "domine" (libre + offensif) — inversé par rapport au réel. Hypothèse ouverte (non prouvée, n=1) : le moteur sous-estime peut-être la capacité offensive brute de Puer (figure "feu agressif chaotique" selon la doctrine utilisateur) quand il est structurellement "entravé" sur le papier — à vérifier sur d'autres cas Puer. `Penalty/Rouge` prédit **Oui** et **confirmé** (carton rouge réel côté Montréal, exactement comme prédit par le signal Carcer-en-M6 tout juste intégré — **1ère confirmation réelle propre de ce signal spécifique**, contre l'équipe 2/Montréal). `BTTS` prédit Oui mais **FAUX** (5-0, Montréal muet) |
| Match FIFA (19/07/26) M1=Laetitia/M7=Tristitia | laetitia/laetitia/carcer/conjunctio | 10-2, **M7** | — | **MISS NET initial (Confirmation résultante+binôme seule, avant correction) — CORRIGÉ le 19/07/26 par la Trahison directe.** `verdictFinal` avait d'abord tranché **Équipe 1** ("Laetitia confirmé par son résultante et son binôme en harmonie, M7 non"), réel **Équipe 2 gagne 10-2**. En creusant (demande utilisateur "creuse, je sais tu vas découvrir quelque chose d'essentiel") : `detecteurGuerreCivile(theme)` détectait déjà correctement M7 via une trahison structurelle — Albus (binôme protecteur de M1) frappe Rubeus et protège ainsi Carcer, l'ancre de M7, au lieu d'attaquer le camp adverse — mais ce signal n'était jamais branché dans la cascade. Retesté sur l'archive complète : neutre (21/25 inchangé, 0 flip), branché en priorité juste avant la confirmation résultante+binôme (accord explicite utilisateur, condition de neutralité vérifiée). **Après correction, `verdictFinal` prédit désormais M7, HIT.** `BTTS` prédit Oui et confirmé (2-10, les deux marquent). La confirmation résultante+binôme seule reste 0/1 en réel isolé (voir §0/§1), mais la cascade complète corrige ce cas grâce à la trahison directe placée devant elle |
| (match, 19/07/26) M1=Acquisitio/M7=Acquisitio (miroir) | acquisitio/conjunctio/populus/puella | 4-3, **M1** | — | **HIT (Équipe 1) via Confirmation résultante+binôme.** Cas particulier : M1 et M7 sont la MÊME figure (Acquisitio des deux côtés) — `detecteurGuerreCivile` non applicable (exige M1≠M7), et la force brute des chaînes de dualité est parfaitement à égalité (forceM1=forceM7=1320), donc ni "max des 4 forces" ni l'écart de dominance ne pouvaient trancher. Seule la confirmation résultante+binôme a décidé (M1 confirmé, M7 non). Score estimé par `buildScoreFromCamps` : 3-2 (écart +1) — réel 4-3 (écart +1 aussi) : vainqueur ET écart net corrects, magnitude légèrement sous-estimée. Côté rotation (R1=M15=Carcer force 855, R7=M5=Tristitia force 835, écart serré de 20) confirmait aussi Équipe 1, cohérent avec le mode fixe. **2e vrai match hors archive pour ce palier : 1/2 (après le miss Laetitia/Tristitia)** |
| (match, 19/07/26) M1=Albus/M7=Carcer | albus/tristitia/tristitia/caput_draconis | 5-3, **M1** | — | **HIT (Équipe 1) via Max des 4 forces.** Mode fixe seul (M1=210, M7=515) aurait favorisé M7, mais R1=M4=Caput Draconis (1185) dépassait les 3 autres valeurs (M7=515, R7=M10=Conjunctio=1015) → maximum absolu côté Équipe 1, M1 prédit. Réel 5-3 M1 — score estimé 5-4 quasi juste (goalA exact, goalB à 1 près). Trahison directe applicable (même cycle) mais aucune trahison détectée des deux côtés — n'a pas tranché ici. **5e vrai match hors archive pour ce palier : 4/5** (après 3 HIT, 1 MISS San Diego-Montréal, ce nouveau HIT) |
| (match, 19/07/26) M1=Via/M7=Fortuna Minor | via/amissio/rubeus/rubeus | 5-4, **M1** | — | **HIT (Équipe 1) via Max des 4 forces.** M1=920, maximum absolu des 4 valeurs (M7=645, R1=645, R7=435), fixe et rotation d'accord. Réel 5-4 M1 — score estimé 3-2, même écart net +1 que le réel (+1), magnitude sous-estimée comme sur les 2 cas précédents. Signal incident notable : Rubeus en M12 (surface) avec binôme Fortuna Minor en rupture Chaotique en M7 → penalty prédit contre l'Équipe 2 (non confirmé/infirmé par l'utilisateur). **6e vrai match hors archive pour ce palier : 5/6** |
| (match, 19/07/26) M1=Tristitia/M7=Acquisitio | tristitia/albus/fortuna_minor/conjunctio | 8-2, **M7** | — | **HIT (Équipe 2) via Max des 4 forces.** M7=865, maximum absolu des 4 valeurs (R7=815, M1=660, R1=585), fixe et rotation d'accord. Réel **8-2 M7** — score estimé 4-5 (écart net +1) : vainqueur correct mais magnitude très sous-estimée (écart réel +6 contre +1 prédit). Aucun signal incident/carton spécifique sur ce thème (juste des notes génériques "buteur actif"). **7e vrai match hors archive pour ce palier : 6/7** — 3 HIT consécutifs mais avec un écart de score de plus en plus large par rapport à la prédiction, à surveiller |
| Ventura County vs Los Angeles II (19/07/26) — **TIRAGE NON-RADICAL** | fortuna_minor/rubeus/conjunctio/albus (tirage aléatoire, mères non fournies par l'utilisateur) | 2-0, **M1 (Ventura County)** | — | **MISS complet, mais tirage fait PENDANT le match (pas avant le coup d'envoi)** — radicalité déjà signalée comme faible au moment du tirage, donc **non comptabilisé dans le track record du palier Max des 4 forces (reste 6/7)**. `verdictFinal` avait prédit **M7 (Los Angeles II) 3-4** via Max des 4 forces (R7=1385 max) ; réel M1 2-0 — vainqueur ET score totalement inversés. Le signal incident/carton (Cauda Draconis en M6, prédit CONTRE l'équipe 2) s'est aussi trompé de camp : le carton rouge réel a touché M1, pas M7. Ce cas illustre concrètement pourquoi la radicalité du tirage compte — à garder comme référence si d'autres tirages non-radicaux sont testés |

L'archive complète (27 matchs, dont 19 esport) est dans
`/tmp/claude-0/-home-user-ation/43bdd8e4-4f60-5524-bd72-213622d663af/scratchpad/export_data.json`
(chemin scratchpad, peut disparaître entre sessions — si absent, redemander
à l'utilisateur ou reconstruire depuis les thèmes sauvegardés de l'app).

## 4. Hypothèses testées et REJETÉES (ne pas retester sans nouvel angle)

- Superposition dans les maisons stratégiques → aucun pattern net.
- R1 gagne toujours la 1ère mi-temps → contredit par USA-Belgique.
- htWinner single-side (M1 ou M7 seul ouvert/mobile) → contredit par
  France-Espagne (downgradé, laissé `null`).
- Rotation toujours prioritaire → 14/27 seulement sur l'archive complète
  (contre 4/5 mesuré sur un échantillon de 8 — remplacé par écart de
  dominance).
- "Bloc" = antagoniste de l'antagoniste → NON, coïncide seulement 2/16
  (laetitia, carcer) — c'est `petitCalcul` (combine avec puella/acquisitio),
  un mécanisme distinct.
- Force nette propre−adverse (séparer camp chef/camp adverse dans
  `forceMaisons`) → 12/27, nettement pire.
- Bonus additif du petit calcul dans `forceMaisons` (au lieu d'un verrou) →
  16/27, pire — la doctrine utilisateur l'exprime comme condition
  nécessaire ("il faut [figure]"), pas comme force graduelle.
- Antagoniste² comme signal prédictif indépendant → chance pure (6% sur
  3000 thèmes aléatoires, conforme au hasard 1/16).
- **"Antagonisme direct M1/M7 + force du chef seule (frChef) décide" →
  REJETÉ (18/07/26)**, malgré un départ très prometteur. Piste utilisateur :
  quand M1 et M7 sont dans une relation d'antagonisme direct (l'un attaque
  l'autre, `ANTAGONISTES_V7`), comparer seulement `frChef` (force propre du
  chef, sans le reste de la chaîne — assaillant/libérateur/victime/ancre)
  plutôt que `forceMaisons` complet. Sur les 3 vrais matchs examinés
  ensemble (Argentine-Egypte, amissio/amissio/carcer/laetitia, San Diego
  vs Montréal) : **3/3**, un résultat net et propre. MAIS testé ensuite
  sur l'archive complète des 27 matchs (`export_data.json`) : la condition
  s'applique à 7 matchs (pas 3), et frChef n'y est correct que **4/7
  (57%, à peine mieux que le hasard)**. Pire, en priorité par-dessus le
  moteur actuel, l'effet net est NÉGATIF : répare Argentine-Egypte (M7→M1
  correct) mais casse Olympique Lyonnais-Real Madrid et Dortmund-Lombardia
  (M7 correct → M1 faux) — score global 18/25 → **17/25**, pire
  qu'aujourd'hui. Le 3/3 initial était un pur effet de petit échantillon
  (les 3 cas examinés n'étaient pas représentatifs de l'ensemble). Leçon
  méthodologique reconfirmée (voir §5) : toujours tester une piste sur
  l'archive complète avant intégration, pas seulement sur les cas qui ont
  motivé l'hypothèse.
- **Tables classiques de géomancie (Inversion/Reversion/Conversion) en
  remplacement de BINOMES_V7/ANTAGONISTES_V7 → REJETÉ (18/07/26)**,
  recherche demandée par l'utilisateur ("creuse sur tiktok et youtube...
  pour récupérer des données outils à notre système"). Recherche web
  (WebFetch bloqué à 100% dans cet environnement — même example.com
  échoue en 403 ; TikTok/YouTube hors de portée, contenu vidéo
  inaccessible ; uniquement WebSearch/résumés utilisés) a trouvé un vrai
  système classique (Cattan/Fludd, XVIe siècle) : 3 opérations fixes sur
  les 16 figures (Inversion, Reversion, Conversion), chacune formant 8
  paires mutuelles stables — vérifié auto-cohérent (48 relations
  recoupées dans les deux sens). Confirmé structurellement DIFFÉRENT de
  nos tables actuelles (décalage fixe +2/-3 dans l'ordre `FIGS_V7`, un
  système propre à l'utilisateur, pas une reprise de la doctrine
  classique). Testé sur l'archive complète (27 matchs), tables
  substituées temporairement en mémoire puis restaurées (aucun fichier
  modifié) : **toutes les variantes sont pires que l'actuel (18/27,
  67%)** — swap complet (antagoniste=Reversion, binôme=Conversion) 13/27
  (48%) ; antagoniste=Reversion seul 17/27 (63%) ; antagoniste=Inversion
  seul 15/27 (56%) ; binôme=Conversion seul 14/27 (52%). Cohérent avec le
  fait que ces relations classiques visent la divination personnelle
  (mariage, voyage, santé), pas le football — nos tables actuelles,
  quoique construites à la main, restent mieux calées sur ce cas d'usage.
  0 crash sur les 4 variantes testées, restauration des tables originales
  vérifiée après chaque test.
- **Sélecteur de mode fixe/rotation par résultante(M1,M7)+binôme présents
  dans le thème → REJETÉ (18/07/26)**. Piste utilisateur : calculer
  `combine(M1,M7)` (résultante de la combinaison des deux chefs) ; si
  cette résultante ET son binôme sont tous les deux présents dans le
  thème (base ou résultante), analyser en mode fixe (M1 vs M7) ; sinon
  refaire le même test avec R1/R7 et analyser en mode rotation si ça
  matche. Testé sur l'archive complète (27 matchs, 25 avec un vainqueur
  réel non-nul) : **11/17 (65%)** applicable, avec **4 matchs sur 25
  laissés sans réponse** (ni fixe ni rotation validés par la condition).
  Comparé à deux repères : comparer M1 vs M7 directement SANS aucune
  sélection de mode donne 15/22 (68%, meilleure couverture ET meilleur
  taux) ; le mécanisme déjà en place ("max des 4 forces", qui compare
  simultanément M1/M7/R1/R7 et prend le maximum absolu) donne 18/25
  (72%, toujours décisif). La condition résultante+binôme n'apporte
  donc rien par rapport à une comparaison directe, et reste nettement
  sous le mécanisme actuel — pas de raison de la préférer. 0 crash.
- **Force = compatibilité résultante-maison seule (`forceMaisonV7`) au
  lieu de la chaîne complète → PAS ADOPTÉ, égalité de précision mais
  couverture moindre (18/07/26)**. Piste utilisateur : "le résultante
  détermine la force du fig de base" — au lieu de `forceMaisons`
  (somme sur 8 figures de la chaîne de dualité), comparer juste
  `forceMaisonV7(M1,1).force` vs `forceMaisonV7(M7,7).force` (la
  compatibilité élémentaire résultante×maison de la SEULE maison
  d'ancrage). Testé sur l'archive (27 matchs, 25 avec vainqueur réel) :
  **13/18 (72%)** — EXACTEMENT le taux du mécanisme actuel (max des 4
  forces, 18/25, 72%), mais avec 7 matchs sur 25 laissés sans réponse
  (égalités — l'échelle `forceMaisonV7` n'a que 8 valeurs possibles :
  20/25/40/60/70/90/95/100, donc les égalités sont fréquentes). Étendu à
  R1/R7 (même principe que "max des 4 forces" mais avec cette mesure
  simple) : s'effondre à 7/15 (47%) — le signal ne généralise pas à la
  rotation. Somme sur toutes les maisons occupées par la figure (variant
  B) : 11/23 (48%), niveau du hasard. Conclusion : précision égale au
  mécanisme actuel sur le sous-ensemble où cette mesure simple tranche,
  mais couverture nettement moindre et ne s'étend pas à la rotation —
  pas de raison de remplacer le mécanisme actuel, mais assez propre pour
  mériter un second regard si l'archive grandit (pas classé comme
  rejeté au même titre que les pistes clairement pires ci-dessus).
- **Le résultante "juge" (confirme/nie) la figure de base selon sa
  polarité → PAS ADOPTÉ, même profil que la piste précédente
  (18/07/26)**. Piste utilisateur : "le résultante confirme ou nie la
  figure de base par rapport à ce que le résultante exprime" — comparer
  la polarité (`FIGURE_MEANINGS_PERSO`, favorable/défavorable/mixte/
  neutre) de la figure de base à celle de son résultante en M1/M7 :
  même polarité (favorable+favorable ou défavorable+défavorable) =
  "confirme" (+1) ; polarité opposée = "nie" (−1) ; mixte/neutre
  impliqué = "ambigu" (0, pas de verdict net). Comparer le score net
  M1 vs M7. Testé sur l'archive (27 matchs) : **12/18 (67%)**,
  cohérent avec le mécanisme actuel mais pas meilleur. Étendu à R1/R7
  (somme des jugements M+R) : **10/18 (56%)**, pire — même schéma que
  la piste précédente (les signaux simples sur maison unique tiennent
  à peu près, mais s'effondrent dès qu'on les étend à la rotation).
  Pas intégré, même statut que la piste précédente (pas rejeté
  franchement, juste pas meilleur que l'existant).
  **MISE À JOUR (18/07/26)** : version durcie de cette même piste
  ("ajoute la nécessité du binôme et aussi harmonie du resultante et
  aussi et du binôme pour la confirmation") — **intégrée avec succès**,
  voir §0/§1 "Confirmation résultante+binôme" (9/10 isolé, `verdictFinal`
  complet 18/25 → 21/25). Les conditions supplémentaires (nécessité du
  binôme, harmonie du résultante ET du binôme) étaient la pièce
  manquante — la simple comparaison de polarité seule (ci-dessus)
  n'était pas assez sélective.
- "Résultante contestée" (antagoniste de la résultante — pas de la
  figure de base — plus fortement ancré `forceMaisonV7` que son propre
  binôme ⇒ résultante fragilisée ⇒ camp opposé favorisé) — piste testée
  après le miss réel du match laetitia/laetitia/carcer/conjunctio
  (10-2 pour M7, alors que R7=Fortuna Major avait un antagoniste
  Fortuna Minor très ancré, force 100 en siège caché M9, contre
  binôme Puella à 20/90 — écart -40 en défaveur de la résultante M7 ;
  côté M1, écart de seulement +7,5). Semblait prometteur sur ce cas
  isolé. Testé sur l'archive complète (27 matchs) : **10/24 (42%)**,
  pire que le hasard. REJETÉ franchement — l'asymétrie observée sur ce
  match était une coïncidence, pas une loi généralisable.

## 5. Pistes ouvertes / prochaines étapes possibles

- **SUPERPOSITION BASE+RÉSULTANTE — M8 ET M16 SONT "LINÉAIRES" (19/07/26,
  demande utilisateur, exemple concret Acquisitio/Rubeus en M8)** :
  l'utilisateur a remarqué que quand M7=Cauda Draconis, avoir Acquisitio
  (binôme de Cauda Draconis) comme figure de base en M8 donne TOUJOURS
  Rubeus comme résultante (= antagoniste(antagoniste(Cauda Draconis))),
  malgré un mauvais accord élémentaire (air/terre) — "leur union dans
  cette maison n'est pas inutile". Vérifié EXHAUSTIVEMENT (16/16 figures
  possibles pour le chef en M7) : c'est une vraie loi algébrique, pas une
  coïncidence liée à Cauda Draconis. En cherchant plus loin (demande "règle
  générale à chercher") : sur les 16 maisons, `combine(X, figureNaturelle
  DeLaMaison)` se réduit à un DÉCALAGE FIXE (mod 16) sur l'index de
  `FIGS_V7`, pour TOUTE figure X, dans EXACTEMENT 2 maisons : **M8**
  (décalage +8, ce qui donne précisément antagoniste²(chef) quand la base
  est binôme(chef)) et **M16** (décalage 0 — Populus est l'élément neutre
  de `combine()`, donc résultante=base toujours en M16, propriété déjà
  connue indépendamment). Les 14 autres maisons n'ont AUCUNE loi aussi
  propre (2, 4 ou 8 décalages distincts selon la figure de départ — pas
  un simple décalage universel). M8 appartient à CAMP2 (camp M7),
  M16 à CAMP1 (camp M1) — symétrie structurelle nette. Testé comme
  hypothèse de verdict sur l'archive : "M8 spécial (base M8=binôme(chef
  M7)) favorise M7" → **0/2** ; "M16 spécial (base M16=binôme(chef M1))
  favorise M1" → **0/1**. Échantillon bien trop petit pour trancher un
  sens (2 et 1 cas seulement dans l'archive de 27 matchs, cette
  configuration est rare) — NI validé NI rejeté, contrairement aux autres
  pistes rejetées du §4 qui avaient un échantillon plus solide. La
  découverte algébrique elle-même (M8/M16 uniques) est en revanche
  solide et vérifiée, indépendante de tout match réel. À retester dès
  que d'autres vrais matchs présentent cette configuration précise
  (base M8 = binôme du chef en M7, ou base M16 = binôme du chef en M1).
  **GÉNÉRALISATION TESTÉE ET REJETÉE (19/07/26, remarque utilisateur "là
  où il penche n'est pas uniquement M7... ça dépend de la figure en M1
  ou M7 ou en R1 ou R7")** : l'identité algébrique elle-même est
  agnostique de la position (elle ne dépend que de la figure F, pas
  d'où F se trouve) — donc M8 pourrait en théorie "pointer" vers M1, M7,
  R1 OU R7 selon lequel de ces quatre chefs a pour binôme la base réelle
  de M8 dans un thème donné. Testé sur l'archive (10/27 matchs où M8
  pointe vers l'un des 4) : **5/10 (50%)**, exactement le niveau du
  hasard — aucun signal. REJETÉ sous cette forme simple (une seule
  correspondance parmi 4 positions, sans pondération). Reste néanmoins
  une piste : peut-être qu'une version plus fine (ex. pondérer par la
  force du chef concerné, ou ne compter que la correspondance avec le
  chef réellement "actif"/dominant du thème) donnerait un résultat
  différent — pas testé, faute de méthode encore claire pour trancher
  QUEL chef privilégier quand plusieurs positions sont candidates.
  **FILTRE HARMONIE TESTÉ (19/07/26, demande utilisateur "vérifiez
  lesquelles sont solides harmonieuses avec la maison")** : parmi les 10
  cas où M8 pointe vers une des 4 positions, restreint aux cas où le
  chef concerné (F) est lui-même en harmonie avec SA PROPRE maison
  (`forceMaisonV7(F, sa_position).force >= 60`) : **4/7 (57%)** contre
  **1/3 (33%)** pour les cas disharmonieux — dans le bon sens (harmonie
  aide un peu) mais échantillon bien trop petit (7 et 3 cas) pour
  conclure quoi que ce soit, et 57% reste à peine au-dessus du hasard.
  NI validé ni rejeté — juste pas assez de données pour trancher. Pas
  intégré.
  **PRÉCISION (19/07/26, "je parle du tableau")** : le filtre pertinent
  n'est pas l'harmonie de F dans SA PROPRE position (M1/M7/R1/R7,
  ci-dessus), mais l'harmonie de la BASE RÉELLE de M8 dans M8 lui-même
  (`forceMaisonV7(theme[8], 8)`) — sur les 16 paires possibles, 12 sont
  harmonieuses (force≥60) et 4 sont dissonantes (force=20 pile, dont
  l'exemple de départ Cauda Draconis→Acquisitio). Retesté sur les 10 cas
  archive où M8 pointe vers une des 4 positions : **base harmonieuse
  5/7 (71%)** suit correctement le camp pointé, **base dissonante 0/3
  (0%)** se trompe TOUJOURS — sur les 2 cas dissonants à vainqueur net
  (hors le Nul), inverser la prédiction donnerait 2/2. Signal directionnel
  net et intéressant en isolé. **Testé en effet net sur la cascade
  complète `verdictFinal`** (règle combinée : harmonieux→suit,
  dissonant→inverse) : en PRIORITÉ ABSOLUE, **19/25 — net négatif**
  (casse 2 matchs déjà corrects sans en réparer aucun, `applicable`
  inchangé à 25/27). En REPLI (seulement sur les thèmes où `verdictFinal`
  n'a AUCUNE opinion) : les 2 seuls cas concernés sont tous les deux des
  **ABSTENTIONS** (thème détruit/invalide), pas des indécisions — utiliser
  ce signal reviendrait à outrepasser une abstention volontaire (contraire
  au principe même de l'abstention, §0), et même ainsi le résultat n'est
  que 1 hit / 1 miss sur ces 2 cas. **REJETÉ comme mécanisme de décision**
  malgré un signal isolé réel et propre (5/7 vs 0/3) — la découverte
  algébrique (M8/M16) et l'observation harmonie/dissonance restent
  valides et intéressantes en elles-mêmes, mais n'apportent aucune
  amélioration nette une fois injectées dans la cascade réelle.
  **ANCRAGE BINÔME TESTÉ (19/07/26, "vérifiez leur ancrage binôme")** :
  le binôme de la base réelle de M8 (présent ET harmonieux sur au moins
  un de ses propres sièges) est ancré dans **10/10 cas, sans exception**
  — aucun pouvoir discriminant, ce filtre ne sépare rien (pas de groupe
  "non ancré" pour comparer). N'explique pas les cas harmonieux qui
  ratent quand même (Man City-Dortmund, Ferencvárosi-Qarabag). La vraie
  ligne de partage reste l'harmonie élémentaire de la base DANS M8
  elle-même, pas l'ancrage de son binôme ailleurs dans le thème.
- **M2 — MAISON D'AUTO-CONSTRUCTION LA PLUS FRÉQUENTE (19/07/26, demande
  utilisateur "M2 s'oppose à M8", puis observation "fig avec son binôme
  c'est fréquent en m2", exemples Amissio/Albus, Fortuna Major/Puella,
  Acquisitio/Puer, Rubeus/Fortuna Minor)** : confirmé directement dans la
  table déjà existante `AUTO_CONSTRUCT_HOUSE` (résultante = binôme
  propre) — répartition sur les 16 figures : **M2 : 8 figures**
  (Caput Draconis, Albus, Rubeus, Tristitia, Conjunctio, Fortuna Major,
  Acquisitio, Populus), M6 : 4 (Puer, Laetitia, Fortuna Minor, Carcer),
  M14 : 4 (Via, Amissio, Cauda Draconis, Puella). M2 concentre bien la
  moitié des 16 figures, largement devant M6/M14 — observation exacte.
  Testé sur l'archive : base M2 dans le groupe des 8 (auto-construit) →
  M1 gagne **6/14 (43%)**, PAS auto-construit → M1 gagne **9/13 (69%)**
  (taux de base M1 sur l'archive : 60%) — signal réel mais dans le sens
  CONTRE-INTUITIF (l'auto-construction en M2 est associée à MOINS de
  victoires M1, pas plus). **Testé en effet net sur la cascade complète**
  (règle : pas auto-construit→M1, auto-construit→M7) : en PRIORITÉ
  ABSOLUE, **17/25 — net négatif** (casse 5 matchs corrects, n'en répare
  qu'1). En REPLI (thèmes où `verdictFinal` est indécis) : les 2 seuls
  cas concernés sont encore des ABSTENTIONS (même limite que pour M8),
  et cette fois les 2 résolutions sont FAUSSES (21/27, aucun gain).
  **REJETÉ comme mécanisme de décision**, même verdict que pour M8 :
  signal isolé réel (43% vs 69%, sens contre-intuitif) mais aucune
  amélioration nette une fois injecté dans la vraie cascade.

- **AMPLEUR DU SCORE — AMÉLIORÉ (19/07/26, demande utilisateur "améliore
  l'ampleur du score")** : sur les 3 derniers vrais matchs hors archive,
  la marge prédite (`buildScoreFromCamps`) était systématiquement trop
  faible (+1 prédit à chaque fois, réel +1/+1/+6). Vérifié que ce n'était
  pas une anecdote : sur les 21 matchs archivés où `verdictFinal` a le bon
  vainqueur, la marge réelle moyenne (2.24) dépasse déjà nettement la
  marge prédite moyenne (1.71) — biais systématique de sous-estimation,
  erreur absolue moyenne de 1.00 but. Testé plusieurs pistes sur
  l'archive complète avant de choisir : relever le plafond de score
  (`Math.min(5,...)` dans `enforceScoreMargin`) au-delà de 5 ne change
  RIEN ou dégrade (les totaux bruts de `calculerButsCamp` dépassent
  rarement 5 dans l'archive, donc le plafond n'est pas le vrai goulot) ;
  bonifier l'écart minimum selon l'écart de force de la cascade
  (`chaineDualite`) n'aide pas non plus. Ce qui marche : relever
  l'écart minimum de BASE dans `buildScoreFromCamps` de 1 à 2 (le
  verrou piliers reste à 3, le plafond reste à 5) — meilleure config
  testée (2/3/4/5 pour la base, 3/4/5 pour le palier piliers, 5/6/7/8/9/10
  pour le plafond) : erreur absolue moyenne 1.00 → **0.857** (-14%),
  aucun impact sur le taux de victoire (21/25 inchangé, cette valeur ne
  touche que la marge affichée, pas le vainqueur décidé plus haut dans
  la cascade). Intégré dans `buildScoreFromCamps`. Reste imparfait sur
  les écarts extrêmes (le cas 8-2 réel restait à seulement 3-5 prédit
  même après ce correctif) — pas de solution validée pour les vrais
  blowouts, à revisiter si plus de données réelles s'accumulent.
- Améliorer la chaîne de dualité au-delà de 19/27 sans réintroduire de
  contradiction (voir §2, tableau des versions).
- Le Nul reste structurellement hors de portée de `verdictChaineDualite`
  (mécanisme binaire M1/M7) — envisager un signal d'égalité explicite si
  `pcScore` M1 = M7 ET `domine` égal des deux côtés.
- Suisse-Colombie est CORRIGÉ (17/07/26, `superpositionAncreAssaillant`,
  voir §7) — ne plus le lister comme échec connu. Reste à réexaminer à
  la main : Chelsea-Atlético, USA-Belgique (voir §7 pour la méthode qui
  a fonctionné sur Argentine-Egypte et Suisse-Colombie).
- IMPORTANT (méthodologie, 17/07/26) : dériver une règle à la main sur UN
  match dont on connaît déjà le score peut presque toujours "réussir"
  après coup (trop de figures disponibles à chaque étape) — ça ne prouve
  rien tant que la règle n'est pas figée AVANT de regarder d'autres cas,
  puis testée à l'aveugle. Voir §7 pour le détail de cette leçon.
- Guerre civile R1/R7 (`guerreCivileR1R7`) reste display-only (54% vs
  50%, bruit) — jamais promue.
- `paralysieV7(pos, theme)` sur M5/M11 (BTTS) : mécanisme déjà câblé
  dans `calculerButsCamp` ("M5+M11 paralysees -> max 1 but") mais jamais
  documenté ni testé contre l'archive avant ce jour. Vérifié le
  18/07/26 (demande utilisateur "prends seulement les vrais matchs où
  les deux équipes ont marqué... porte ton attention sur ces maisons") :
  sur les 9 vrais matchs, **aucun** des 5 BTTS n'a de paralysie en M5
  OU M11 (5/5), et sur les 2 cas où la paralysie apparaît (Chelsea-
  Atlético M5, Suisse-Colombie M11), le match n'est JAMAIS BTTS (2/2).
  Condition **suffisante** pour "au moins un camp à 0" jamais contredite
  sur l'archive actuelle, mais pas nécessaire : France-Espagne (0-2) et
  LA Galaxy (3-0) finissent sans BTTS sans paralysie détectée en M5/M11
  — voir ci-dessous, un autre marqueur (Via en M4) explique ces deux cas.
  n=9 dont seulement 2 déclenchements pour paralysie M5/M11, à
  réévaluer à mesure que l'archive grandit. Aucune autre commonalité
  trouvée en M3/M9 (figure, rôle élémentaire, ouverture, mobilité) sur
  les 5 matchs BTTS — testé, rien au-delà du bruit.
- **Via en M4 → BTTS=false, piste forte** (18/07/26, demande utilisateur
  "cherche si m4 et m10 expliquent ces deux cas") : sur les 9 vrais
  matchs, Via en M4 (force 60, rôle "Absorbeur" via `forceMaisonV7`)
  apparaît dans EXACTEMENT les 3 matchs BTTS=false qui ont M4 comme
  maison camp1 concernée (Chelsea-Atlético 0-5, France-Espagne 0-2, LA
  Galaxy 3-0) et dans AUCUN des 5 matchs BTTS=true — split parfait 3/3
  vs 0/5. Base rate mesurée sur 3000 thèmes aléatoires : Via en M4
  n'apparaît que dans 5,6% des thèmes — avoir 3/9 dans l'archive réelle
  (33%) est net (P≈1% sous hasard pur, binomiale n=9 p=0,056). M10 ne
  suit PAS le même schéma (Chelsea et France-Espagne partagent
  M10=Acquisitio, mais LA Galaxy a M10=Laetitia — pas de figure commune
  aux 3), donc c'est spécifiquement M4=Via, pas la paire M4+M10, qui
  porte le signal. PRUDENCE MÉTHODOLOGIQUE (voir §5, note sur les règles
  dérivées à la main) : n=9 seulement, et plusieurs hypothèses ont été
  testées ce jour-là (comparaisons multiples) — un résultat propre sur
  un aussi petit échantillon peut encore être un coup de chance.
  **INTÉGRÉ le 18/07/26 (demande explicite utilisateur "intègre ça et
  le verdict doit le suivre")** dans `buildVerdictCard` : quand
  `theme[4]==='via'`, `campA.total` (capacité de but du camp 1, quelle
  que soit la carte fixe/rotation affichée) est forcé à 0, ET le
  `winner` de LA CARTE est corrigé vers labelB si besoin (jamais
  "vainqueur"/"nul" affiché avec 0 de capacité) — MÊME quand
  `winnerOverride` (donc `verdictFinal`) disait le contraire. Le
  correctif reste LOCAL à `buildVerdictCard` (affichage score/BTTS/
  winner de la carte) : `verdictFinal` lui-même (le cascade qui décide
  le "vainqueur doctrinal" utilisé pour le suivi archive 18/27 ou 19/27)
  n'est PAS modifié — trop tôt pour l'y intégrer avec seulement n=9.
  Vérifié : les 3 cas Via-M4 (Chelsea, France-Espagne, LA Galaxy)
  affichent désormais BTTS=Non et le bon vainqueur ; les 5 matchs
  BTTS=true et le cas Suisse-Colombie (déjà expliqué par paralysie
  M5/M11) restent inchangés (viaEnM4=false chez eux) ; 0 crash sur 800
  thèmes aléatoires (54 avec Via en M4, ~6,75%, cohérent avec le base
  rate mesuré). Note "🚫 Via en M4..." affichée sur la carte quand le
  correctif s'applique, pour transparence. À confirmer sur de nouveaux
  vrais matchs avant d'envisager une intégration dans `verdictFinal`
  lui-même.
  **BUG CORRIGÉ (19/07/26, demande utilisateur "vérifiez bien si le
  verdict final suis la logique")** : le correctif écrasait le
  `winner` affiché "MÊME quand `winnerOverride` disait le contraire"
  (voir plus haut) — ce qui semblait raisonnable au moment de
  l'écrire s'est avéré être une vraie incohérence : dès que Via était
  en M4, la carte pouvait afficher un vainqueur contraire à ce que
  `verdictFinal` avait réellement décidé, MÊME quand `verdictFinal`
  avait tranché via un mécanisme validé (Confirmation résultante+
  binôme, Max des 4 forces, Ancrage...). Détecté sur 32/2000 thèmes
  aléatoires (sondage de cohérence winner carte vs `verdictFinal`).
  Corrigé : la correction du `winner` ne s'applique plus que quand
  `winnerOverride` est ABSENT (le duel brut propre à cette carte, pas
  la doctrine) — ne touche plus jamais un vainqueur déjà tranché par
  `verdictFinal`. Revérifié : 0/2000 incohérences après correctif,
  archive toujours 21/25, les 3 vrais matchs Via-M4 toujours corrects
  (BTTS=Non, bon vainqueur).
- **Via en M5 ET M11 (les deux à la fois) → camp M7 muet, piste n=1
  SEULEMENT** (18/07/26, match amissio/amissio/carcer/laetitia, réel
  4-0 Équipe 1, Équipe 2 à 0) : parallèle structurel exact au
  correctif Via-M4 (même logique, camp opposé — M5/M11 sont les
  maisons "camp M7" désignées par `butsGuerreDes16`, comme M4/M10 le
  sont pour camp M1), mais un SEUL cas connu jusqu'ici, contre 3 pour
  Via-M4 avant intégration. Via en M5 SEUL (sans M11) apparaît aussi
  sur Suisse-Colombie (0-0) et Argentine-Egypte (3-2, BTTS=true) sans
  direction cohérente — c'est bien la conjonction M5+M11 qui semble
  spécifique, pas M5 seul. PAS intégré, à observer sur de nouveaux
  vrais matchs avant même d'envisager quoi que ce soit (n=1 est
  strictement insuffisant, contrairement à Via-M4 qui avait 3
  confirmations propres avant intégration).
- Rubeus/Fortuna Major/Puer penalty-rouge : n=1-2 seulement, à enrichir
  si de nouveaux vrais matchs avec penalty/rouge se présentent. Sur
  LA Galaxy vs Los Angeles FC (18/07/26), Rubeus ÉTAIT en M12 mais ce
  signal spécifique N'A PAS déclenché (`rupture:false`) — ne compte pas
  comme confirmation de cette règle précise malgré la présence de Rubeus.
  Sur via/acquisitio/caput/caput (18/07/26), la règle Rubeus-M12 A bien
  déclenché ET dans le bon sens ("PENALTY CONTRE l'équipe 2" = penalty
  pour R1/équipe 1, confirmé par l'utilisateur) — 1ère confirmation
  réelle propre de cette règle précise (condition de rupture remplie
  cette fois).
- **INTÉGRÉ (18/07/26, doctrine utilisateur explicite : "cauda,
  tristitia, carcer, amissio en m12 ou m6 font partie de ce qui
  provoque la pénalité... laetitia lui il évite la pénalité lorsqu'il
  est en m12 ou m6")** dans `detectIncidentChaotique` : Cauda Draconis,
  Tristitia, Carcer, Amissio en M12 OU M6 ajoutent désormais un signal
  d'incident (sans condition de rupture, contrairement à Rubeus/Fortuna
  Major — présence seule suffit selon la doctrine donnée). Laetitia est
  volontairement ABSENTE de cette liste (aucun signal ajouté pour elle
  en M12/M6), reflétant son rôle protecteur annoncé — sans pour autant
  annuler d'autres signaux indépendants déjà présents ailleurs dans le
  thème. Explique directement, pour la première fois via une règle
  nommée plutôt que le seul signal élémentaire générique, le carton
  rouge confirmé sur amissio/amissio/carcer/laetitia (Cauda Draconis en
  M12). Vérifié : 0 crash sur 400 thèmes aléatoires, le nouveau signal
  apparaît bien sur ce cas et n'apparaît PAS sur via/tristitia/carcer/
  populus (M6=laetitia, comme attendu). Direction du "évite" côté
  Laetitia pas encore testée sur un vrai match confirmé sans incident
  (n=0 pour ce sens précis) — à surveiller.
- **INTÉGRÉ (18/07/26, demande explicite utilisateur "intègre tout")**,
  complétant la doctrine Rubeus/Puer restée partielle : **Rubeus en M8**
  ajouté au même groupe rupture-conditionné que M11/M7 (`[[11,'rubeus'],
  [12,'rubeus'],[7,'rubeus'],[8,'rubeus'],[12,'fortuna_major']]`), suite
  à "rubeus en m11,7,8 pénalité" — n=0 réel confirmé pour M8
  spécifiquement, mécanisme identique à M11/M7 par cohérence. **Puer en
  M1** ajouté en signal simple/inconditionnel (même style que Puer-M6,
  PAS la condition binôme du cas M7) suite à "puer en m7,1" — n=0 réel
  confirmé pour M1 spécifiquement. Vérifié : aucune régression sur les
  13 thèmes déjà archivés (vainqueur/BTTS/penalty identiques avant/
  après, aucun des deux ne concernait ces thèmes), 0 crash sur 600
  thèmes aléatoires.
- Signal `detectIncidentChaotique` / `check` sur l'ancre équipe 1/équipe 2
  (figure en rôle "Chaotique" — combinaison élément figure × élément
  maison, table `ELEMENT_ROLE_MATRIX_V7`, ex. eau-feu ou feu-eau) :
  câblé en dur sur M1/M7 à l'origine ; un premier correctif (18/07/26,
  "le verdict porte sur la rotation... pourquoi analyse m1 et m7") l'a
  fait suivre uniquement les VRAIES maisons du mode affiché (posA/posB)
  — mais ça faisait perdre le signal Via/M1/feu validé en mode fixe sur
  LA Galaxy-Los Angeles FC dès que le mode affiché (rotation) ne
  retombait pas sur les mêmes maisons (carcer=M5=Absorbeur,
  albus=M11=Adaptateur, aucun Chaotique côté rotation sur ce thème).
  CORRIGÉ à nouveau le même jour (demande explicite utilisateur "combine
  les deux") : le check tourne maintenant sur M1/M7 fixe ET posA/posB du
  mode affiché simultanément (dédoublonné automatiquement quand les deux
  coïncident, mode fixe) — plus aucun signal perdu. n=1 réel confirmé
  (LA Galaxy vs Los Angeles FC). Mécanisme distinct de Rubeus-M11/M12 et
  Fortuna Major-M12 (restés fixes intentionnellement, voir plus haut) —
  à enrichir séparément si de nouveaux cas se présentent, ne pas
  fusionner les deux compteurs.
- `matchFermeOuvert(theme)` (panneau "🔒 Match fermé/ouvert") : compte les
  maisons dont la figure est classée "fermée" (table `OUVERTURE_FIGURE`,
  8 figures ouvertes / 8 fermées, doctrine fixe) sur les 16 maisons de
  base, prédit FERMÉ (risque qu'un camp reste à 0) si n≥7. RÉVISÉ
  (18/07/26, vérification demandée par l'utilisateur "vérifie match
  fermé ou ouverte") : le panneau affichait "validé sur 6 vrais matchs"
  sans taux — mesuré sur les 9 vrais matchs de l'archive §3, le score
  réel est **5/9 (56%), à peine au-dessus du hasard**. Sur les 6 premiers
  matchs connus au 16/07/26 c'était bien 5/6 (83%, HIT sur Liverpool-Man
  City, Chelsea-Atlético, France-Espagne, Suisse-Colombie, USA-Belgique ;
  MISS sur Argentine-Egypte), mais les 3 cas réels ajoutés depuis (match
  virtuel 8-1, St Louis City 3-2, LA Galaxy 3-0) ont TOUS raté — la
  revendication "6 matchs" du panneau était devenue fausse par
  obsolescence (jamais remise à jour), pas par erreur de calcul (la
  formule fait exactement ce qu'elle dit). Texte du panneau corrigé pour
  afficher le taux réel 5/9 au lieu de la revendication périmée. Reste
  display-only, jamais câblé dans `verdictFinal` ni dans le calcul du
  score — à ne pas promouvoir en signal fiable sans un échantillon plus
  large qui dépasse nettement le hasard.
- **Puer "entravé" sous-estimé ? Hypothèse ouverte, n=1 SEULEMENT**
  (18/07/26, San Diego vs Montréal, réel 5-0 San Diego) : sur ce thème,
  `chaineDualite` ET `calculerButsCamp` — deux calculs indépendants —
  sont tombés d'accord pour désigner Montréal (Puer/M1 jugé "entravé",
  menacé par Puella sans libération ; capacité de but brute 1 vs 2) —
  et se sont trompés ENSEMBLE dans le sens opposé du réel (5-0 San
  Diego). Hypothèse NON prouvée : Puer, décrit par l'utilisateur comme
  "un feu agressif chaotique", pourrait avoir une capacité offensive
  réelle mal captée par la logique structurelle "menacé/libéré" de la
  chaîne de dualité quand il est jugé entravé sur le papier. n=1 —
  strictement insuffisant, à observer sur d'autres thèmes avec Puer en
  M1 ou M7 avant d'y toucher.

## 6. Fonctionnement relationnel des 16 figures — constats (17/07/26)

Exploration figure par figure, colonne par colonne, avant tout code.
Colonnes : Repres (figure), M (maison de repos), B (binôme), B-B (binôme
du binôme), A (antagoniste), B-A (binôme de l'antagoniste), B-B-A
(binôme du binôme de l'antagoniste), A-A (antagoniste de l'antagoniste),
B-A-A (binôme de l'antagoniste de l'antagoniste).

**Boucle impair**

| Repres | M | B | B-B | A | B-A | B-B-A | A-A | B-A-A |
|---|---|---|---|---|---|---|---|---|
| Puer | 1 | Caput Draconis | Via | Puella | Populus | Laetitia | Conjunctio | Cauda Draconis |
| Caput Draconis | 3 | Via | Rubeus | Populus | Laetitia | Albus | Cauda Draconis | Acquisitio |
| Via | 5 | Rubeus | Fortuna Minor | Laetitia | Albus | Amissio | Acquisitio | Puer |
| Rubeus | 7 | Fortuna Minor | Conjunctio | Albus | Amissio | Tristitia | Puer | Caput Draconis |
| Fortuna Minor | 9 | Conjunctio | Cauda Draconis | Amissio | Tristitia | Carcer | Caput Draconis | Via |
| Conjunctio | 11 | Cauda Draconis | Acquisitio | Tristitia | Carcer | Fortuna Major | Via | Rubeus |
| Cauda Draconis | 13 | Acquisitio | Puer | Carcer | Fortuna Major | Puella | Rubeus | Fortuna Minor |
| Acquisitio | 15 | Puer | Caput Draconis | Fortuna Major | Puella | Populus | Fortuna Minor | Conjunctio |

**Boucle pair**

| Repres | M | B | B-B | A | B-A | B-B-A | A-A | B-A-A |
|---|---|---|---|---|---|---|---|---|
| Laetitia | 2 | Albus | Amissio | Acquisitio | Puer | Caput Draconis | Fortuna Major | Puella |
| Albus | 4 | Amissio | Tristitia | Puer | Caput Draconis | Via | Puella | Populus |
| Amissio | 6 | Tristitia | Carcer | Caput Draconis | Via | Rubeus | Populus | Laetitia |
| Tristitia | 8 | Carcer | Fortuna Major | Via | Rubeus | Fortuna Minor | Laetitia | Albus |
| Carcer | 10 | Fortuna Major | Puella | Rubeus | Fortuna Minor | Conjunctio | Albus | Amissio |
| Fortuna Major | 12 | Puella | Populus | Fortuna Minor | Conjunctio | Cauda Draconis | Amissio | Tristitia |
| Puella | 14 | Populus | Laetitia | Conjunctio | Cauda Draconis | Acquisitio | Tristitia | Carcer |
| Populus | 16 | Laetitia | Albus | Cauda Draconis | Acquisitio | Puer | Carcer | Fortuna Major |

### Constat 1 — maison(B-B-A) = maison(figure) + 1

Vérifié exhaustivement 16/16, dans les deux boucles. Le B-B-A d'une
figure est toujours exactement la figure de la maison suivante (avec
bouclage 16→1). Conséquence algébrique directe : binôme+binôme+
antagoniste = +2+2−3 = +1 sur `FIGS_V7`.

### Constat 2 — "figure de front" = B-B, pas B-B-A (piste abandonnée)

Exemples donnés (Laetitia→Amissio, Acquisitio→Caput Draconis,
Puer→Via) correspondent tous à la colonne **B-B** (binôme du binôme,
deux pas dans la même boucle), pas à B-B-A. Sujet mis de côté par
l'utilisateur après vérification, gardé ici pour mémoire — ne pas
reproposer B-B-A comme "figure de front" sans nouvel élément.

### Constat 3 — Obstacles de la boucle impair (= `petitCalcul`)

Pour 7 des 8 figures de la boucle impair, la "figure obstacle à
contrôler pour faciliter l'attaque" correspond exactement à
`petitCalcul(figure)` (déjà codé) :

| Figure | Obstacle |
|---|---|
| Puer | Laetitia |
| Caput Draconis | Albus |
| Via | Amissio |
| Rubeus | Tristitia |
| Fortuna Minor | Carcer |
| Conjunctio | Fortuna Major |
| Cauda Draconis | Puella |
| **Acquisitio** (exception, voir Constat 5) | Puella, Fortuna Major, Carcer, Tristitia, Amissio, Albus, Laetitia (7 figures, PAS Populus) |

### Constat 4 — Moyens/collaboration de la boucle paire

Dans la boucle paire, chaque figure attaque une victime directement
(via `ANTAGONISTES_V7`) et a besoin de son **B-B** comme collaborateur
pour que l'attaque fonctionne (et non d'un "obstacle" à détruire comme
en boucle impaire — différence de vocabulaire/nature).

| Attaquant | Victime attaquée | Collaborateur (B-B) |
|---|---|---|
| Laetitia | Via | Amissio |
| Albus | Rubeus | Tristitia |
| Amissio | Fortuna Minor | Carcer |
| Tristitia | Conjunctio | Fortuna Major |
| Carcer | Cauda Draconis | Puella |
| Fortuna Major | Acquisitio | Populus |
| **Puella** (exception, voir Constat 5) | Puer | Laetitia (cas général) — mais moyens = Fortuna Major, Carcer, Tristitia, Amissio, Albus, Laetitia (6 figures) |
| Populus | Caput Draconis | Albus |

### Constat 5 — Acquisitio et Puella sont les pivots fixes des deux boucles

`petitCalcul(fig)` = `combine(fig, 'acquisitio')` si boucle impaire,
`combine(fig, 'puella')` si boucle paire — Acquisitio et Puella sont
donc les pivots fixes à travers lesquels tous les obstacles/moyens de
leur boucle respective sont générés. Quand l'une de ces deux figures
est elle-même le chef, elle ne se limite pas à SON résultat individuel
(qui serait Populus dans les deux cas, `combine(acquisitio,acquisitio)
= combine(puella,puella) = populus`) — elle a accès à l'ensemble des
résultats qu'elle génère pour les autres figures de sa boucle :
- **Acquisitio** (impair, ne peut jamais s'auto-référencer dans une
  liste de figures paires) → 7 obstacles (tous les pair sauf Populus).
- **Puella** (paire, fait partie de l'ensemble qu'elle génère) → 6
  moyens (tous les pair sauf Populus ET Puella elle-même).

**Populus est neutre**, ainsi que sa maison de repos (M16).

### Constat 6 — Maisons concernées

- Obstacles boucle impair (les 7 figures du Constat 3, hors
  Acquisitio) → maisons **2, 4, 6, 8, 10, 12, 14** (paires, sauf M16).
- Moyens de Puella (Constat 5) → maisons **2, 4, 6, 8, 10, 12** (paires,
  sauf M14 = Puella elle-même et M16 = Populus).

### Constat 7 — Loi du binôme reconfirmée (nouvel exemple)

Si A attaque B, binôme(A) attaque binôme(B) — jamais l'inverse.
Exemple : Puer attaque Albus (antagoniste d'Albus = Puer) ⟹
binôme(Puer)=Caput Draconis attaque binôme(Albus)=Amissio (antagoniste
d'Amissio = Caput Draconis). Vérifié que l'inverse est impossible :
l'antagoniste de Puer est Puella (pas Albus), l'antagoniste de Caput
Draconis est Populus (pas Amissio). Cohérent avec le principe déjà
noté en §0.

### Constat 8 — Une figure attaquée contre-attaque le B-B-B de son attaquant

Si X attaque Y, alors Y attaque TOUJOURS B-B-B(X) (trois binômes
d'affilée de X, dans sa propre boucle). Exemple : Amissio attaque
Fortuna Minor ⟹ Fortuna Minor attaque Fortuna Major = B-B-B(Amissio)
(Amissio→Tristitia→Carcer→Fortuna Major). **Vérifié exhaustivement
16/16.** Preuve algébrique : "attaquer" = décalage +3 dans `FIGS_V7`
(deux fois de X à Y à Z = +6), et B-B-B = trois binômes = +2+2+2 = +6
également — les deux chemins tombent nécessairement au même endroit,
ce n'est pas une observation statistique mais une identité garantie
par la construction de `FIGS_V7`/`BINOMES_V7`/`ANTAGONISTES_V7`.

### Constat 9 — Configurations maison/figure fortes ou destructrices

Les maisons obstacle (2,4,6,8,10,12,14, voir Constat 6) sont le siège de
configurations où une figure se confond très fortement avec elle-même
(auto-construction) ou triple-concorde en élément — déjà codées
(`AUTO_CONSTRUCT_HOUSE`, `checkMaisonDoubleConcordance`, utilisées dans
`forceRelationnelleFigure`, bonus +25 et +20). Table complète des 16
figures, vérifiée exhaustivement :

| Figure | Maison repos | Auto-construction (résultante=binôme) | Double concordance (élément×3) | Auto-destruction (résultante=antagoniste) |
|---|---|---|---|---|
| Puer | 1 | M6 → Caput Draconis | M1 | M11 |
| Laetitia | 2 | M6 → Albus | — | M1 |
| Caput Draconis | 3 | M2 → Via | — | M3 |
| Albus | 4 | M2 → Amissio | — | M5 |
| Via | 5 | M14 → Rubeus | M15 | M3 |
| Amissio | 6 | M14 → Tristitia | M7, M15 | M1 |
| Rubeus | 7 | M2 → Fortuna Minor | — | M11 |
| Tristitia | 8 | M2 → Carcer | M4, M16 | M13 |
| Fortuna Minor | 9 | M6 → Conjunctio | M9 | M11 |
| Carcer | 10 | M6 → Fortuna Major | M4, M16 | M1 |
| Conjunctio | 11 | M2 → Cauda Draconis | — | M3 |
| Fortuna Major | 12 | M2 → Puella | M4, M16 | M5 |
| Cauda Draconis | 13 | M14 → Acquisitio | M7 | M3 |
| Puella | 14 | M14 → Populus | M4, M16 | M1 |
| Acquisitio | 15 | M2 → Puer | — | M11 |
| Populus | 16 | M2 → Laetitia | M1, M9 | M13 |

Exemple vérifié : Carcer en M4 est terre/terre ET sa résultante (Puella)
est aussi terre — triple concordance. Acquisitio en M2 résulte Puer, son
propre binôme — auto-construction.

Notable : M4 et M16 reviennent systématiquement ensemble en double
concordance, portées par les 4 figures terre de la boucle paire
(Tristitia, Carcer, Fortuna Major, Puella). L'auto-construction se
concentre presque entièrement sur M2, M6 et M14.

### Constat 10 — Table des moyens (collaborateurs) de la boucle paire, avec maisons

Complète le Constat 4 avec les maisons. Pour chaque attaquant de la
boucle paire : sa maison de repos, la maison de sa victime, et la
maison de son collaborateur (B-B).

| Attaquant | Maison | Victime | Maison | Collaborateur (B-B) | Maison |
|---|---|---|---|---|---|
| Laetitia | 2 | Via | 5 | Amissio | 6 |
| Albus | 4 | Rubeus | 7 | Tristitia | 8 |
| Amissio | 6 | Fortuna Minor | 9 | Carcer | 10 |
| Tristitia | 8 | Conjunctio | 11 | Fortuna Major | 12 |
| Carcer | 10 | Cauda Draconis | 13 | Puella | 14 |
| Fortuna Major | 12 | Acquisitio | 15 | Populus | 16 |
| Puella | 14 | Puer | 1 | Laetitia | 2 |
| Populus | 16 | Caput Draconis | 3 | Albus | 4 |

Deux régularités garanties algébriquement (identités, pas des
observations) : maison(collaborateur) = maison(attaquant)+4 (bouclage
16→4), maison(victime) = maison(attaquant)+3 (bouclage 16→3, comme
`victimeDe`).

Contrairement aux obstacles impairs (Constat 6, qui s'arrêtent à M14,
Populus neutre exclu), les collaborateurs paires couvrent les **8
maisons paires en entier** (2 à 16) — Populus participe pleinement ici
comme attaquant (collaborateur en M4), contrairement à son rôle neutre
côté obstacle impair.

### Constat 11 — L'attaquant de l'obstacle (B-B-A) d'une figure est TOUJOURS celle dont elle est le binôme (CORRIGÉ)

*Correction (17/07/26, même jour) : la première version de cette note
disait "l'antagoniste de l'obstacle = le binôme direct de la figure"
(donc = ancre) — FAUX, contredit par le calcul algébrique lui-même
juste en dessous (X−2 ≠ X+2). L'erreur venait de l'exemple isolé
(Acquisitio "a l'air" de boucler sur Puer) sans vérifier le sens de la
relation. Codé une première fois avec ce bug (`preuveConstat11()`
donnait 0/16 au lieu de 16/16), corrigé dans la foulée.*

Découvert sur Puer : antagoniste(Puer)=Puella → binôme(Puella)=Populus
→ binôme(Populus)=**Laetitia** (= B-B-A de Puer, son obstacle, Constat
1). Or **antagoniste(Laetitia)=Acquisitio**, et **binôme(Acquisitio)=
Puer** — la figure qui attaque l'obstacle de Puer (Acquisitio attaque
Laetitia) n'est PAS l'ancre de Puer (Caput Draconis) : c'est la figure
dont Puer lui-même est le binôme (relation inverse). Attaque et
soutien se rejoignent quand même sur Acquisitio, mais via le sens
inverse du binôme, pas le binôme direct.

**Vérifié exhaustivement sur les 16 figures (16/16, jamais pris en
défaut) — ce n'est pas une coïncidence isolée à Puer, c'est une
identité algébrique garantie** : obstacle(X) = binôme²(antagoniste(X))
= X+1 (décalages fixes −3+2+2) ; attaquantObstacle(X) =
antagoniste(obstacle(X)) = X+1−3 = X−2 ; binôme(attaquantObstacle(X))
= X−2+2 = X. La boucle se referme toujours sur X, mais en passant par
X−2 (l'attaquant), pas X+2 (l'ancre) — les deux sont des figures
différentes.

Distinct du "libérateur" déjà codé dans `chaineDualite`
(`antagoniste(assaillant)` — pour Puer donne Conjunctio, pas
Acquisitio) : ce sont deux mécanismes de libération différents et
non-contradictoires, pas la même chose vue sous un autre angle.
**Statut : identité structurelle prouvée (16/16), codée dans
`obstacleDe()`/`attaquantObstacleDe()`/`preuveConstat11()` (panneau
🧮 Preuve structurelle) et exposée comme champs d'observation
(`obstacle`, `attaquantObstacle`, `frObstacle`, `frAttaquantObstacle`,
`obstacleNeutralise`) dans `chaineDualite()`. INTÉGRÉE au calcul du
verdict le même jour (demande explicite utilisateur, "entre le dans le
calcul du verdict") : contribution SIGNÉE dans `forceMaisons`
(+`frAttaquantObstacle.total` −`frObstacle.total`) — testée en cascade
complète `verdictFinal` (pas en comparaison isolée, qui montrait une
légère régression à 15/27) : **17/27 sur l'archive, contre 15/27 sans
cette contribution** — première extension de la chaîne qui améliore le
score mesuré au lieu de le faire baisser.**

### Constat 12 — Axes d'opposition des maisons (19/07/26, doctrine utilisateur)

Table donnée directement par l'utilisateur, maison N ↔ maison N+6 (même
principe que l'axe classique 1-7 déjà central au système M1/M7) :

| Axe | Maisons | Camps (CAMP1=[1,2,3,4,9,10,13,16], CAMP2=[5,6,7,8,11,12,14,15]) |
|---|---|---|
| 1 | M1 ↔ M7 | camps différents |
| 2 | M2 ↔ M8 | camps différents |
| 3 | M3 ↔ M9 | **même camp** (CAMP1) |
| 4 | M4 ↔ M10 | **même camp** (CAMP1) |
| 5 | M5 ↔ M11 | **même camp** (CAMP2) |
| 6 | M6 ↔ M12 | **même camp** (CAMP2) |

Seuls M1↔M7 et M2↔M8 opposent deux camps différents ; les 4 autres axes
opposent deux maisons du MÊME camp — asymétrie structurelle notable,
pas encore expliquée.

En creusant l'axe M2↔M8 (demande utilisateur, exemple concret
Acquisitio/Rubeus en M8 quand M7=Cauda Draconis, "leur union dans cette
maison n'est pas inutile") : `combine(X, figureNaturelleDeLaMaison)` se
réduit à un décalage FIXE (mod 16) sur l'index de `FIGS_V7`, pour TOUTE
figure X, dans exactement 2 des 16 maisons — **M8** (décalage +8) et
**M16** (décalage 0, Populus = élément neutre de `combine()`). Élargi à
tout l'axe d'opposition (M2/M6/M8/M12/M14/M16, "ce que M6 est à M2, M12
l'est à M8") : les décalages sont TOUJOURS symétriques autour de 8,
avec 3 niveaux de précision —

| Maison | Figure naturelle | Décalages | Précision |
|---|---|---|---|
| M8 | Tristitia | {8} | 16/16 — loi pure |
| M16 | Populus | {0} | 16/16 — loi pure |
| M2 | Laetitia | {2, 14} | 8/8 — loi binaire |
| M12 | Fortuna Major | {4, 12} | 8/8 — loi binaire |
| M6 | Amissio | {2, 6, 10, 14} | 4/4/4/4 — loi à 4 voies |
| M14 | Puella | {2, 6, 10, 14} | 4/4/4/4 — loi à 4 voies |

M2 et M12 sont structurellement IDENTIQUES (même type binaire) ; M6 et
M14 aussi (même type 4 voies) ; M8 et M16 aussi (loi pure). Testé comme
signal directionnel de verdict pour M8 (base M8 = binôme d'un chef
M1/M7/R1/R7) et M2 (auto-construction, `AUTO_CONSTRUCT_HOUSE`) : signaux
isolés réels mais REJETÉS comme mécanismes de décision une fois testés
en effet net sur `verdictFinal` (voir §5, entrées "M8 — VÉRIFICATION..."
et "M2 — MAISON D'AUTO-CONSTRUCTION..."). **M6 et M12 testés le 19/07/26**
(taux de base archive : M1 60% (15/25), M7 40% (10/25)) :
- **M6 auto-construction** (groupe des 4, Puer/Laetitia/Fortuna Minor/
  Carcer) : seulement **n=3** dans l'archive (rareté attendue, 4/16),
  M7 2/2 (hors 1 Nul) — trop peu pour conclure, même limite que la
   1ère estimation.
- **M6 harmonie** (force≥60 de la base réelle dans M6) : harmonieux
  M1=9/16 (56%), dissonant M1=6/9 décisifs (67%) — les deux proches du
  taux de base (60%), **aucun signal net**, contrairement à M8 où le
  même test donnait un vrai écart (71% vs 0%).
- **M12 harmonie** : harmonieux M1=14/21 décisifs (67%, au-dessus du
  taux de base), dissonant M1=1/4 décisifs (25%, en-dessous) — direction
  intéressante et cohérente avec le paradoxe déjà vu sur M2 (l'harmonie/
  auto-construction d'une maison semble favoriser le camp OPPOSÉ à celui
  de la maison, pas le sien), mais échantillon dissonant minuscule
  (n=4) — à confirmer, pas assez solide pour tester en cascade.
- **Conclusion provisoire** : ni M6 ni M12 n'égalent la solidité de M8
  (5/7 vs 0/3, écart net) ou même de M2 (43% vs 69%, écart net sur bon
  échantillon) — cohérent avec leur position plus basse dans la
  hiérarchie de précision (M6/M14 = 4 voies, la moins précise des 3
  paliers ; M12 = binaire mais sans base d'auto-construction comme M2).
- **M14 testé (19/07/26)**, complète la famille : auto-construction
  (groupe des 4, Via/Amissio/Cauda Draconis/Puella) M1=3/4 décisifs
  (75%, au-dessus du taux de base 60%, mais n=4 minuscule) ; harmonie
  quasi au taux de base (61% harmonieux, dissonant n=2 seulement,
  inexploitable). Direction de l'auto-construction cohérente avec le
  paradoxe M2/M12 (favorise le camp OPPOSÉ à la maison — M14 est CAMP2,
  et c'est M1 qui est favorisé), mais échantillon bien trop petit pour
  rien en tirer. **Famille des 6 maisons désormais entièrement testée**
  (M2, M6, M8, M12, M14 empiriquement ; M16 triviale) : seul M8 montre
  un signal isolé net (5/7 vs 0/3) et seul M2 un signal isolé net sur
  bon échantillon (43% vs 69%) ; M6/M12/M14 restent tous sous le seuil
  d'un signal exploitable, cohérent avec leur rang plus bas dans la
  hiérarchie de précision algébrique.
- **TABLE COMPLÈTE DES 16 MAISONS (19/07/26, demande utilisateur "refais
  le tableau avec toute les maisons")** : balayage exhaustif de
  `combine(X, figureNaturelleDeLaMaison)` pour les 16 maisons — révèle
  **4 paliers, pas 3** :
  - **Pur (1 décalage, 16/16)** : M8 (+8), M16 (+0).
  - **Binaire (2 décalages, 8/8)** : M2 ({2,14}), M4 ({4,12}), M7
    ({7,9}), M10 ({6,10}), M12 ({4,12}), M15 ({1,15}).
  - **4 voies (4 décalages, 4/4/4/4)** : M1 ({1,3,13,15}), M3
    ({3,5,11,13}), M6 ({2,6,10,14}), M9 ({5,7,9,11}), M11
    ({3,5,11,13}), M14 ({2,6,10,14}).
  - **8 voies (8 décalages, 2×8)** : M5 ({1,3,5,7,9,11,13,15}), M13
    (idem) — les deux maisons les MOINS prévisibles du système.
  Fait notable : **M1 et M7 (les deux chefs qui décident tout le
  verdict) ne sont PAS dans le palier pur** — seulement "4 voies", le
  3e niveau sur 4. Sur les 6 axes d'opposition (Constat 12), seuls
  M1↔M7, M3↔M9 et M4↔M10 ont leurs deux maisons au MÊME palier ;
  M2↔M8, M5↔M11 et M6↔M12 ont des paliers différents entre les deux
  maisons opposées.
- **M1 et M7 testés directement (19/07/26, "teste M7 et M1 aussi")** :
  aucune figure ne s'auto-construit dans l'une ou l'autre (0/16 chacune,
  cohérent avec leurs paliers). Harmonie propre (force≥60 avec sa
  propre maison) corrélée à SA PROPRE victoire — sens INTUITIF cette
  fois, pas le paradoxe inverse des maisons satellites : M1 harmonieux
  → M1 gagne 13/20 (65%, vs 40% dissonant) ; M7 harmonieux → M7 gagne
  10/21 (48%, vs 0/4 dissonant). Signal combiné isolé (harmonieux d'un
  côté ET non de l'autre) : **7/10 (70%)**, le meilleur ratio isolé de
  toute l'exploration du jour. **Testé en effet net sur `verdictFinal`
  complet** : priorité absolue → **20/25, encore net négatif** (casse
  Dortmund-Roma sans rien réparer de solide). REJETÉ comme mécanisme de
  décision, même verdict que tous les autres signaux de maison testés
  ce jour — un bon signal isolé ne suffit toujours pas à améliorer la
  vraie cascade.

## 7. Analyse match par match (17/07/26) — méthode et résultat codé

Après les constats structurels (§6), tentative d'intégrer une règle
"qui gagne" à partir de la force des ancres/assaillants — plusieurs
formules testées, TOUTES rejetées comme mécanisme général (aucune ne
dépasse 16/27 sur l'archive, certaines se contredisent sur leur propre
exemple source, voir historique complet dans l'échange du 17/07/26).

**Leçon méthodologique retenue** : dériver une chaîne de raisonnement à
la main sur un match dont le score réel est déjà connu peut presque
toujours "marcher" après coup — il y a trop de figures disponibles à
chaque étape (assaillant, libérateur, ancre, victime, B-B...) pour ne
pas en trouver une qui colle. Ce n'est une preuve de rien tant que la
règle n'est pas figée AVANT de regarder d'autres cas, puis testée à
l'aveugle.

**Ce qui a été gardé, parce que assez spécifique pour ne jamais risquer
de régression** : `superpositionAncreAssaillant(theme)`, trouvée en
analysant Suisse-Colombie (réel 0-0) figure par figure :
- Rubeus (assaillant de Carcer/M1) fait presque le poids face à Carcer
  lui-même (170 contre 210) — Carcer s'auto-affaiblit en plus en M1
  (résultante = son propre antagoniste Rubeus, auto-destruction).
- M9 (maison pilier) est verrouillé par une triple concordance parfaite
  (Populus/Fortuna Minor/feu).
- À ce point verrouillé se superposent le binôme de l'ancre de M7
  (Populus = binôme de Puella) ET le binôme de l'assaillant de M1
  (Fortuna Minor = binôme de Rubeus), Fortuna Minor étant aussi
  l'antagoniste direct de Fortuna Major (M7 lui-même).

Codée et validée : n=1 (Suisse-Colombie) réel, **0/27 sur l'archive**
(jamais de faux positif, décisifs compris) — placée avant l'écart de
dominance dans `verdictFinal` (comme l'impasse totale de boucle),
précisément parce que sa rareté élimine tout risque de régression, à
la différence de la tentative abandonnée (16/07/26) de remonter
TOUTES les règles de nul.

**Rappel important (17/07/26, décision utilisateur)** : "il y a
plusieurs cas de nul" — en géomancie, à part le calcul algébrique pur
(binôme, antagoniste, preuve structurelle), rien n'est une loi
universelle unique. Chaque règle de nul du système (Juge Conjunctio,
Juge Acquisitio, symétrie mères/filles, impasse totale de boucle,
superposition ancre/assaillant) couvre son propre "cas" distinct, sur
un échantillon souvent réduit (n=1 à 4) — ce n'est pas un défaut, c'est
la nature du domaine. Ne pas chercher une formule unique qui expliquerait
tous les nuls à la fois ; ajouter des règles spécifiques une par une,
tant qu'elles ne créent aucune régression mesurée.
