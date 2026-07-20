# Repères du système géomantique (mis à jour 17/07/26)

Ce fichier sert de tableau de bord pour se repérer rapidement dans l'état du
système : ce qui est validé, ce qui est rejeté, ce qui reste ouvert. À
consulter avant de proposer une nouvelle piste (éviter de retester une
hypothèse déjà rejetée) et avant de modifier `verdictFinal` (connaître
l'ordre exact de la cascade et le score de chaque étage).

**Repères structurels à conserver durablement** (demande explicite
utilisateur, 19/07/26 : "garde dans le référent... on aura forcément
les besoins après") — ces 4 blocs sont la base de travail de toute
future exploration sur la cartographie des maisons, à ne jamais
supprimer ni résumer :
- **Tableau O-D/O-C des 16 maisons** (§6, "Cartographie complète des
  16 figures × 16 maisons") — pour chaque maison M1 à M16, les 16
  résultantes possibles avec Fig-Base/R-M(n)/Binôme/Antagoniste/
  O-D/O-C/Niveau/Force.
- **Les 3 groupes de blocage A/B/C** (§6, "Récapitulatif : les 3
  groupes de blocage sur les 16 maisons") — Groupe A {M2,M6}, Groupe B
  {M4,M8,M12,M16}, Groupe C {M10,M14}, déduits du tableau ci-dessus.
- **Le "carré logique" et la disposition des maisons** (§6, "Le carré
  logique et la relation subalterne") — axes opposé (Constat 12) et
  familles subalterne {M2,M6,M8,M12} / {M3,M5,M9,M11}, avec leur
  énergie doctrinale commune (incidents pour M6/M12, capacité de
  marquage pour M5/M11, ressource d'équipe pour M2/M8).
- **Comparaisons de maisons sur le tableau** (§6, tests M8/M12 et
  boucle M2/M8) — méthode de comparaison ligne à ligne du tableau
  O-D/O-C entre deux maisons d'une même famille subalterne, pour en
  déduire leurs points communs/divergences.

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
| **Confirmation résultante+binôme (M1/M7)** | Le résultante d'une maison "confirme" sa figure de base si : même polarité (favorable/défavorable), binôme de la figure de base présent dans le thème, résultante en harmonie élémentaire avec la maison, et binôme lui-même en harmonie avec une de ses maisons — demande explicite utilisateur, 18/07/26. Ne tranche que si exactement un des deux camps confirme. | **PRIORITAIRE depuis le 18/07/26** (juste après la trahison directe depuis le 19/07/26) — 9/10 (90%) isolé sur l'archive, `verdictFinal` complet passe de 18/25 à **21/25 (84%)**. **1er vrai match hors archive testé (19/07/26, Laetitia/Tristitia) : MISS net** (prédit Équipe 1 5-4, réel Équipe 2 10-2), **corrigé depuis par la trahison directe** placée juste avant elle dans la cascade. **2e vrai match hors archive (19/07/26, Acquisitio/Acquisitio miroir M1=M7) : HIT** (prédit Équipe 1 3-2, réel Équipe 1 4-3 — vainqueur ET écart net corrects). **3e cas découvert le 19/07/26 (St. Louis City SC vs Sporting Kansas City, en revérifiant contre la cascade actuelle) : MISS** — confirme M7 alors que rotation ET mode fixe favorisent tous deux M1, le vainqueur réel (3-2) — track record isolé du palier confirmation désormais **1/3 en réel**, nettement moins bon que son 9/10 sur l'archive, à surveiller de près. **Inversion de priorité testée (19/07/26, "teste" si ancrage avant confirmation ferait mieux)** : REJETÉ nettement — 17/25 contre 22/25 baseline, casse 5 matchs archive corrects (Argentine-Egypte, Fenerbahçe-Galatasaray, Chelsea-Napoli, Man City-Dortmund, Ferencvárosi-Qarabag) pour n'en réparer aucun. L'ordre actuel reste le meilleur mesuré malgré le raté sur St. Louis — ancrage seul (16/27, 59%) est structurellement plus faible que confirmation résultante+binôme (9/10 isolé), le déplacer devant coûterait bien plus qu'il ne rapporterait. Aucun changement de code. |
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
| 2 | Impasse totale de boucle (nul) | `verdictElementaire` + `piliersReposCount<2` | 2/4 réel (Olympiacos-WestHam 7-7, FIFA 4-4 ; **MISS le 18/07/26** : caput_draconis/via/acquisitio/fortuna_major, réel 2-1 Équipe 1 ; **2e MISS découvert le 19/07/26** en revérifiant France-Espagne (fortuna_minor/albus/amissio/via, réel 0-2 M7) suite à une question sur la rotation — `verdictFinal.type` vaut bien `'nul'` ici aussi, PAS un nul réel. Jamais compté comme miss avant car le suivi §3 utilise la carte affichée (moteur V7 indépendant, qui donne correctement "Équipe 2" malgré `verdictFinal` muet), pas `verdictFinal.winner` directement — donc pas une régression, juste une limite de cette règle jamais mesurée sous cet angle) | Actif, 2 MISS sur 4 cas réels connus maintenant — la règle semble moins fiable qu'annoncé, à revoir sérieusement si un 3e cas se présente |
| 2b | Superposition ancre/assaillant (nul) | `superpositionAncreAssaillant(theme)` | n=1 réel (Suisse-Colombie 0-0) | Actif, 0/27 sur l'archive (aucun risque de régression) |
| 2c | **M2+M8 dissonants simultanément** | Les deux maisons de l'axe d'opposition le plus "pur" algébriquement (Constat 12 : M8 = loi à 1 décalage 16/16, M2 = loi à 2 décalages 8/8) sont TOUTES LES DEUX en désaccord élémentaire avec leur propre maison (`forceMaisonV7<60` pour M2 ET M8) → M1 favorisé | **3/3 (100%) décisifs sur l'archive (n=4, dont 1 Nul)** — testé en priorité absolue sur `verdictFinal` complet : **22/25, +1 net, ZÉRO régression** (corrige Arsenal-Barcelone) | **Actif, PRIORITAIRE sur la trahison directe** (branché 19/07/26, demande explicite utilisateur "intègre-le, avec la mise en garde sur l'échantillon") — **⚠️ échantillon TRÈS petit (n=4, 3 décisifs)**, à surveiller de très près sur les prochains vrais matchs |
| 2d | **Trahison directe (guerre civile)** | `detecteurGuerreCivile(theme)` — quand M1/M7 partagent la même boucle de binôme, détecte si le binôme protecteur d'un camp attaque en fait le gardien de l'arme adverse (`gcU.winner`), signal existant mais jamais branché avant | **Neutre sur l'archive (21/25 inchangé, 0 flip — ne s'applique qu'à 1 match archive, déjà un miss avant/après)**. Corrige le miss réel Laetitia/Tristitia (19/07/26, voir §3) — track record isolé 1/2 (1 miss archive + 1 hit réel) | **Actif, repli quand 2c est indécis, PRIORITAIRE sur la confirmation résultante+binôme** (branché 19/07/26, accord explicite utilisateur — "branche-le, si ça ne change pas les résultantes de 21 matchs" — condition vérifiée avant intégration) — signal encore peu testé (n=2 au total), à surveiller sur les prochains matchs |
| 2e | **Confirmation résultante+binôme (M1/M7)** | `confirmationResultanteBinome(pos, theme)` — le résultante de M1 (ou M7) "confirme" la figure de base si : polarité base=résultante (`FIGURE_MEANINGS_PERSO`) ET binôme présent dans le thème ET résultante en harmonie élémentaire avec la maison (`forceMaisonV7≥60`) ET binôme lui-même en harmonie avec une de ses maisons. Ne tranche que si EXACTEMENT un des deux camps confirme | **9/10 (90%) isolé sur l'archive** (10/27 matchs concernés) ; **21/25 (84%) pour `verdictFinal` complet avec ce palier en priorité**, contre 18/25 (72%) sans lui — +3 net (répare Argentine-Egypte, Chelsea-Napoli, Man City-Dortmund, Ferencvárosi-Qarabag ; casse Côte d'Ivoire-Norvège). **1er vrai match hors archive (19/07/26, Laetitia/Tristitia) : MISS** (prédit Équipe 1 5-4, réel Équipe 2 10-2) — **corrigé depuis par la trahison directe (2d) placée juste avant**. **3e cas réel (St. Louis vs Sporting) découvert MISS le 19/07/26 en revérifiant contre la cascade actuelle** — track record réel isolé désormais 1/3 — voir §3 | **Actif, repli quand 2c et 2d sont indécis, PRIORITAIRE sur "max des 4 forces"** (demande explicite utilisateur, 18/07/26 — "le resultante confirme ou nie la figure de base... ajoute la nécessité du binôme et aussi harmonie du resultante et aussi et du binôme pour la confirmation") — meilleure amélioration mesurée à ce jour sur l'archive, se déclenche sur ~16% des thèmes aléatoires (1500 testés, 0 crash) |
| 2f | **Max des 4 forces (M1/M7/R1/R7)** | `chaineDualite(...).forceMaisons` de M1, M7, R1, R7 comparées directement, dans `verdictFinal` — le camp du maximum absolu des 4 tranche (repli sur 2g si le maximum est partagé entre les deux camps) | **18/27 (67%) en priorité sur l'archive** (décide 19/27 matchs), contre 17/27 sans cette règle. **Sur les vrais matchs hors archive (§3) : 3 HIT (LA Galaxy, amissio×2/carcer/laetitia, via/acquisitio/caput×2) puis 1 MISS net le 18/07/26** (puer/laetitia/amissio/acquisitio, San Diego vs Montréal — prédit Montréal net, réel 5-0 San Diego, ET la capacité de but brute `calculerButsCamp` — calcul totalement indépendant — était elle aussi tombée d'accord pour Montréal : les deux mécanismes se sont trompés ensemble, pas une simple incohérence interne), **puis 1 nouveau HIT le 19/07/26** (albus/tristitia/tristitia/caput_draconis — mode fixe seul aurait favorisé M7 (210 vs 515), mais R1=1185 l'emportait sur les 4 valeurs → M1 prédit, réel 5-3 M1, score exact quasi juste 5-4 prédit), **puis encore 1 HIT le 19/07/26** (via/amissio/rubeus/rubeus — M1=920 maximum absolu des 4 valeurs, accord fixe+rotation → M1 prédit, réel 5-4 M1, même écart net +1 que le score estimé 3-2), **puis encore 1 HIT le 19/07/26** (tristitia/albus/fortuna_minor/conjunctio — M7=865 maximum absolu, accord fixe+rotation → M7 prédit, réel **8-2 M7**, score estimé 4-5 : vainqueur correct mais écart réel (+6) bien plus large que l'écart prédit (+1), la sous-estimation de magnitude déjà notée sur les 2 matchs précédents s'aggrave nettement ici) — **track record réel désormais 6/7 sur le vainqueur, mais l'écart de score estimé reste systématiquement trop faible sur les 3 derniers matchs (+1 prédit à chaque fois, réel +1/+1/+6) — piste à explorer si on veut un jour affiner l'estimation du score, pas seulement le vainqueur** | **Actif, repli quand 2c, 2d et 2e sont indécis** (demande explicite utilisateur, 17/07/26 — "instaure le mode fixe, on teste ça... par comparaison si M1>M7 et R1 et R7 équipe 1 gagne...") — n'est plus le premier mécanisme consulté depuis l'ajout de 2c/2d/2e |
| 2g | **Ancrage (chaîne complète, fixe + rotation + obstacle)** | `chaineDualite(chef,theme).forceMaisons` (8 figures + Constat 11 obstacle/attaquant signé) comparée M1/M7 (fixe) ET R1/R7 (rotation, `getRotationOrderFromRepos`), dans `verdictFinal` — le côté à plus grand écart de force tranche | **2/2 HIT confirmés SI on isole ce palier seul** (match virtuel Fortuna Minor/Albus 8-1 M1 ; St. Louis City SC vs Sporting Kansas City 3-2 M1) — **mais St. Louis n'atteint plus jamais ce palier dans la cascade actuelle** (la confirmation résultante+binôme, plus prioritaire, tranche M7 avant, à tort — voir §3, découvert 19/07/26) — voir §3 | **Actif, repli quand 2c à 2f sont indécis** (demande explicite utilisateur, 17/07/26 — "l'ancrage doit constituer toute la chaîne", puis "retour en ancrage côté rotation", puis "entre le [Constat 11] dans le calcul du verdict") — trajectoire du score mesuré de `verdictFinal` complet : 19/27 → 16/27 (rotation ajoutée) → 15/27 → 17/27 (Constat 11 ajouté) → 18/27 (max des 4 forces ajouté) → 21/25 (84%) (confirmation résultante+binôme ajoutée, 18/07/26) → toujours 21/25 (trahison directe ajoutée, 19/07/26, neutre) → **22/25** (M2+M8 dissonants ajouté en priorité, 19/07/26, +1 net) |
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
| France vs Espagne | fortuna_minor/albus/amissio/via | 0-2, **M7** (MT 0-1) | HIT (M7) | **Vérifié le 19/07/26 (demande utilisateur "regarde côté rotation")** : `verdictFinal` renvoie en fait `type:'nul'` sur ce thème (voir §1, "impasse totale de boucle", 2e MISS découvert) — le HIT provient de la carte affichée (moteur V7 indépendant). Côté rotation : **R1=M9=Cauda Draconis (force 725) vs R7=M15=Via (force 1055, ouverte+mobile)** — R7 domine nettement, cohérent avec la victoire réelle d'Espagne, et Via (R7) est ouverte+mobile là où Caput Draconis (M7 fixe) ne l'est pas — la rotation "révèle" un signal que le mode fixe masquait sur ce match précis |
| Suisse vs Colombie | carcer/carcer/cauda_draconis/amissio | 0-0, **Nul** | MISS (mécanisme binaire, ne peut pas dire Nul) | **HIT (Nul), corrigé le 17/07/26 par `superpositionAncreAssaillant`** |
| USA vs Belgique | via/caput_draconis/conjunctio/rubeus | 4-1 Belgique, **M7** | MISS (prédit M1) | — |
| Argentine vs Egypte | carcer/amissio/carcer/puer | 3-2, **M1** | HIT (M1) | — |
| (match virtuel, 05:30) M1=Fortuna Minor/M7=Albus | fortuna_minor/tristitia/conjunctio/acquisitio | 8-1, **M1** | — | **HIT (M1) via ancrage chaîne complète (force 1140 vs 570)** — le mode fixe classique (écart de dominance) se serait trompé : scoreMain interne 1-4 pour M7, sens opposé au réel |
| St. Louis City SC vs Sporting Kansas City | conjunctio/via/puella/puer | 3-2, **M1** (MT 2-1, penalty M1 86e) | — | **HIT (M1) via ancrage chaîne complète (force M1=820, force M7=710)** — le `scoreMain` affiché par `buildVerdictCard` pour ce thème est **3-2**, exactement le score réel (mécanisme distinct : ancrage tranche le vainqueur, `buildScoreFromCamps` estime le score, coïncidence exacte à noter mais pas encore généralisable sur un seul cas). **Mi-temps donnée le 19/07/26** : 2-1 M1 = les deux camps marquent en 1ère mi-temps (`htWinner` réel = 'both'), voir §5 "BUT PAR MI-TEMPS" pour le MISS du mécanisme sur ce point précis. **⚠️ RÉGRESSION DÉCOUVERTE LE 19/07/26 (demande utilisateur "regarde côté rotation")** : cette lecture "HIT via ancrage" date du 17/07/26, AVANT l'ajout de la Confirmation résultante+binôme (18/07/26) — jamais revérifiée depuis contre la cascade complète. `confirmationResultanteBinome(7,theme)` vaut `true` (Cauda Draconis confirmé) et ce palier, plus prioritaire que l'ancrage, **tranche maintenant M7** alors que rotation (R1=Amissio force 1315 domine, vs R7 force 950) ET mode fixe (M1=950 > M7=770) favorisent tous les deux M1, le vainqueur réel. `verdictFinal` actuel sur ce thème est donc un **MISS**, pas un HIT — track record réel de la confirmation résultante+binôme passe à 1/3 (voir §0) |
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
| Vitesse vs AEK Athènes (19/07/26) | carcer/fortuna_major/populus/puer | 0-0 (22 tirs) | — | **MISS NET (score) — `verdictFinal` prédit 5-3 Équipe 1** via convergence fixe+rotation (M1=750 vs M7=1150 en fixe... voir détail carte : fixe ET rotation pointaient tous deux Équipe 2 en fait, 750/1150 vs 785/825 — la carte affichée nuance déjà "marge ajustée, désaccord doctrine/buts bruts"). **ANALYSE COMPLÈTE menée le 19/07/26** (demande utilisateur "fais une analyse complète") après une longue série de tests maison par maison (M1 à M16, voir §6) : (1) seules **M2 et M6** sont en `level:'blocage'` sur les 16 maisons, mais seul M6 montre un vrai signal archive-wide (5,5 vs 7,16 buts, n=8/19) ; (2) **4 des 16 maisons portent une figure `BUTS_FIGURE` à 0-0 garanti** (Carcer×3 en M1/M5/M12, Populus en M3) — surreprésentation notable de figures "vides" ; (3) **`matchFermeOuvert` donne 10/16 maisons fermées → "FERMÉ, risque qu'un camp reste à 0" — signal JUSTE** (voir §5, track record réel désormais 6/10), mais ce détecteur reste display-only et n'est jamais consulté par `verdictFinal` pour modérer son estimation de score, d'où l'incohérence 5-3 prédit vs signal interne "fermé" ignoré. **Conclusion : le 0-0 n'était pas invisible à la doctrine — plusieurs signaux convergents existaient (M6 blocage, 4 figures 0-0, matchFermeOuvert=FERMÉ) mais aucun n'était câblé dans le calcul du score final.** Pistes rejetées en cours de route : M3+M9 "rythme" (contredit par ce match précis, voir §6), Populus en M3 (intestable), Carcer en M12 = "Blocage" par coïncidence de texte (rejeté, archive va dans le sens inverse). **CORRIGÉ le 19/07/26** : `matchFermeOuvert` connecté à `buildScoreFromCamps` (voir §5, "MATCH FERMÉ → RÉDUCTION DU SCORE"). Première version (réduction ×0.8 des totaux seule) restait invisible sur la carte réellement affichée (positions de ROTATION R1/R7) à cause d'`enforceScoreMargin` qui poussait le vainqueur au plafond fixe de 5 en cas de "marge ajustée" (désaccord doctrine/buts bruts, le cas précis de ce thème). **Étendu le même jour** : `enforceScoreMargin` accepte désormais un plafond réduit (4 au lieu de 5) dans ce cas — testé sur 24 vrais matchs non-esport, 8 améliorés/1 régression mineure (voir §5 détail complet). **Score affiché maintenant 4-2** (vérifié en direct sur l'UI complète), toujours pas 0-0 exact mais l'écart avec le réel continue de se réduire (8→6 d'erreur absolue depuis le 5-3 initial). **Côté rotation vérifié le 19/07/26 (demande utilisateur "regarde côté rotation")** : R1=M10=Puer (force 785) vs R7=M16=Via (force 825) — écart de seulement **40**, très serré, contre un écart de **400** en mode fixe (M1=Carcer 750 vs M7=Rubeus 1150). Fixe ET rotation pointent tous deux vers Équipe 2 (déjà signalé sur la carte), mais `verdictFinal` tranche quand même M1 via Confirmation résultante+binôme (mécanisme prioritaire). Le réel étant un nul, aucun des deux camps ne "valide" proprement le vainqueur ici — mais l'écart de force nettement plus resserré en rotation (40 contre 400) reflète mieux l'équilibre réel du match (0-0) que le mode fixe seul, qui suggérait une domination nette côté Équipe 2 |

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
  **PISTE "M8 = MORT" TESTÉE (19/07/26, doctrine utilisateur "M8 est liée
  à la mort")** : M8 appartient structurellement à CAMP2/camp M7 (déjà
  noté). Hypothèse : la loi linéaire (résultante = décalage+8) ne
  "tuerait" vraiment que quand elle pointe vers le chef NATIF de M8
  (M7/R7), pas vers le chef "emprunté" (M1/R1) — testé sur les 10 cas
  archive avec deux proxys réels disponibles (pas de carton rouge réel
  dans l'archive, seulement le score) : défaite et écrasement (score du
  camp pointé à 0, ou écart ≥3). Résultat : **M7 seul (fixe) : 2/2
  défaites dont 1/2 score à 0** ; **M7+R7 combiné : 3/5 défaites (60%),
  1/5 à 0 (20%)** contre **M1+R1 combiné : 1/5 défaite (20%), 0/5 à 0**
  — asymétrie dans le sens attendu par la doctrine (le camp natif de M8
  souffre plus que le camp emprunté), mais **n=2 et n=5, bien trop petit
  pour conclure ou intégrer**. Aucun écrasement net (+3) observé dans
  aucun groupe — la "mort" ne se lit pas comme une déroute massive sur
  cet échantillon, plutôt comme une défaite simple ou un score nul côté
  camp M7. Lien à noter avec la doctrine déjà intégrée "Rubeus en M8 →
  pénalité" (`[[11,'rubeus'],[12,'rubeus'],[7,'rubeus'],[8,'rubeus'],
  [12,'fortuna_major']]`, §5) : l'exemple de départ de cette section
  (Acquisitio en base M8 → résultante Rubeus) tombe justement sur la
  figure surveillée par cette doctrine, mais celle-ci contrôle la BASE
  de M8 (`theme[8]==='rubeus'`), pas la résultante — deux signaux
  distincts qui se recoupent seulement pour ce cas précis (Acquisitio en
  base). Aucun changement de code. Piste ouverte : soit accumuler plus
  de vrais matchs avec cette configuration (M8 pointe M7/R7), soit
  redéfinir "mort" autrement que défaite/écrasement (carton rouge non
  vérifiable faute de données réelles dans l'archive actuelle).
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
  afficher le taux réel 5/9 au lieu de la revendication périmée. **10e
  cas réel (19/07/26, Vitesse-AEK, 0-0) : HIT** — `matchFermeOuvert`
  donne 10/16 maisons fermées → "FERMÉ, au moins un camp risque de
  rester à 0", exactement ce qui s'est produit. Track record réel
  désormais **6/10 (60%)** — toujours proche du hasard sur le VAINQUEUR,
  mais ce cas a révélé que le signal, quand il dit juste, n'était jamais
  exploité pour la MAGNITUDE du score. Voir analyse complète de
  Vitesse-AEK en §7 (demande utilisateur "fais une analyse complète").
  **CONNECTÉ à `buildScoreFromCamps` le 19/07/26** (demande explicite
  utilisateur "connecte matchFermeOuvert à verdictFinal pour ajuster le
  score") — voir détail complet et résultats de test dans l'entrée
  dédiée ci-dessous ("MATCH FERMÉ → RÉDUCTION DU SCORE").
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
- **MATCH FERMÉ → RÉDUCTION DU SCORE (19/07/26, `buildScoreFromCamps`,
  demande explicite utilisateur "connecte matchFermeOuvert à
  verdictFinal pour ajuster le score") — INTÉGRÉ.** `matchFermeOuvert`
  restait display-only depuis sa création (voir entrée ci-dessus) ;
  trouvé en creusant le miss de score sur Vitesse-AEK (5-3 prédit, 0-0
  réel, 10/16 maisons fermées déjà signalées à l'écran mais jamais
  utilisées). **Formule intégrée** : quand `matchFermeOuvert(theme).ferme`
  est vrai (≥7/16 maisons fermées) ET que la compétition n'est PAS
  esport/arcade (`competition` commence par `"esport"`), `campA.total`
  et `campB.total` sont réduits ×0.8 avant le calcul de `goalA`/`goalB`
  dans `buildScoreFromCamps` — ne touche JAMAIS le vainqueur (déjà fixé
  par le paramètre `winner` avant cet appel), seulement la magnitude
  du score affiché. **Exclusion esport testée et nécessaire** : sur
  l'archive complète (27 matchs, dont 21 esport avec `competition`
  correctement passée en `competitionOverride`), appliquer la réduction
  PARTOUT (esport inclus) donne un léger gain global illusoire
  (2,63→2,33 à ×0.4) mais dégrade légèrement l'esport lui-même
  (1,95→2,00) — cohérent avec `TIER_CONFIG[7].multButs=2.5` : les
  formats arcade ont des scores naturellement élevés, "fermé" n'y
  corrèle PAS avec moins de buts (ex. Fenerbahçe-Napoli, 10/16 fermé,
  réel 4-6 = 10 buts). **Testé sur 18 vrais matchs non-esport** (les
  6 réels de l'archive `export_data.json` + 12 matchs documentés en §3
  avec mères connues) en balayant le facteur de 1.0 à 0.4 : **×0.8 est
  le seul facteur donnant un gain net SANS AUCUNE régression** (MAE
  4,89→4,67 sur les 18 cas, 3 matchs améliorés — France-Espagne 8→6,
  Amissio/Fortuna Minor 3→2, Vitesse-AEK 7→6 — et 15 inchangés, 0
  empiré). Des facteurs plus agressifs (0.5-0.7) amélioraient davantage
  la MAE globale (jusqu'à 4,22 à ×0.4) mais au prix de 2 régressions
  (Acquisitio/Acquisitio et Via/Fortuna Minor, +2 d'erreur chacun) —
  écarté au profit de ×0.8, cohérent avec la discipline de cette
  session (préférer un gain net PROPRE, zéro régression, à un gain plus
  gros mais avec compromis). **Vérifié en appel direct** (posA=1/posB=7,
  mode fixe) : Chelsea-Atlético 3-5→2-4, France-Espagne 5-5→4-4,
  Vitesse-AEK 5-2→4-2, etc. — cohérent avec les prédictions de test.
  **Vérifié que le taux de victoire de `verdictFinal` sur l'archive
  reste inchangé** (22/27, identique à avant le changement) — confirme
  que seule la magnitude du score est touchée, jamais le vainqueur.

  **⚠️ LIMITE DÉCOUVERTE (19/07/26, demande utilisateur "teste
  vitesse-aek en direct pour vérifier") : le fix restait invisible sur
  la carte RÉELLEMENT AFFICHÉE dans certains cas.** `carte-verdict-r`
  (la carte priorité affichée à l'écran) utilise les positions de
  ROTATION (R1/R7, `getRotationOrderFromRepos`), pas M1/M7 fixe comme
  testé ci-dessus. Sur Vitesse-AEK, testé en direct sur le vrai code :
  la carte affichée restait **5-3, INCHANGÉE malgré le fix**. Cause :
  en rotation, campA(R1=Puer)=3 < campB(R7=Via)=5, alors que
  `verdictFinal` tranche R1 vainqueur — contradiction déjà signalée par
  "⚠️ marge ajustée (désaccord doctrine/buts bruts)". `enforceScoreMargin`
  (appelé APRÈS la réduction ×0.8) poussait alors le vainqueur vers le
  plafond fixe de 5 et reconstruisait le perdant à partir de ce plafond
  — indépendamment de la valeur d'entrée réduite.

  **✅ CORRIGÉ le 19/07/26 (demande explicite "étends le fix à
  enforceScoreMargin, teste sur l'archive complète").** `enforceScoreMargin`
  accepte désormais un 4e paramètre `cap` (défaut 5, rétrocompatible —
  l'autre site d'appel dans `verdictV7`, ligne ~4249, n'en passe pas et
  garde son comportement inchangé). `buildScoreFromCamps` lui passe un
  plafond réduit (**4** au lieu de 5) quand `matchFermeOuvert(theme).ferme`
  est vrai et hors esport — même condition que la réduction ×0.8 des
  totaux. **Testé sur le SCORE RÉELLEMENT AFFICHÉ** (reproduit
  fidèlement le calcul des positions de rotation R1/R7, avec
  `competitionOverride` correctement propagé match par match — `buildVerdictCard`
  ne le fait pas nativement, toujours `undefined` en interne, donc testé
  en appelant `calculerButsCamp`+`buildScoreFromCamps` directement avec
  les mêmes positions de rotation) sur **24 vrais matchs non-esport**
  (6 de l'archive + 18 documentés en §3), en balayant facteur (1.0 à
  0.6) × plafond (5 à 2) :
  - **Plafond=3** (testé en premier) : très bon sur l'archive seule
    (MAE 5,17→2,83) mais **dégrade nettement les 18 vrais matchs**
    (4,72→4,83, PIRE que sans aucun fix) — écarté.
  - **Plafond=4** : MEILLEUR compromis global — MAE combinée (24 matchs)
    **4,83→4,17**. Détail : **8 matchs améliorés** (Argentine-Egypte,
    Ferencvárosi-Qarabag ×2, Côte d'Ivoire-Norvège, FK Jenis-Astana,
    France-Espagne, Suisse-Colombie, Amissio/Fortuna Minor,
    Vitesse-AEK — tous -2 d'erreur), **15 inchangés**, **1 SEULE
    régression** : Albus/Carcer (réel 5-3, base prédisait déjà 5-3
    exact, err=0 → cap4 le ramène à 4-2, err=2). Cette régression est
    un **faux-positif connu de `matchFermeOuvert`** (theme flagué
    "fermé" mais le match était en réalité une victoire nette 5-3) —
    risque inhérent et attendu de connecter un signal à ~60% de
    fiabilité réelle (voir entrée `matchFermeOuvert` plus haut) à un
    plafond de score : ne peut pas être éliminé sans améliorer
    `matchFermeOuvert` lui-même. **Net : 8 gains contre 1 perte
    mineure, retenu.**
  - Facteur <0.8 combiné à un plafond réduit (0.6+cap3, 0.6+cap2)
    n'apportait rien de plus que 0.8+cap4 et dégradait aussi les 18
    vrais matchs — écarté.
  - **Plafond=2** : encore plus agressif sur l'archive (2,50) mais
    dégrade fortement les 18 matchs (5,06-5,28) — écarté.
  **Vérifié en direct sur le vrai code (UI complète, sélection des 4
  mères + clic "Lancer le thème")** : la carte affichée pour
  Vitesse-AEK montre maintenant **4-2** (au lieu de 5-3), confirmant
  que le fix est visible cette fois, y compris dans le cas "marge
  ajustée" qui l'annulait avant. **Taux de victoire de `verdictFinal`
  sur l'archive vérifié inchangé (22/27)** — seule la magnitude du
  score est touchée, jamais le vainqueur, à chaque étape de cette
  extension. ⚠️ Échantillon de calibration limité (24 vrais matchs
  non-esport, dont 9 où le fix change effectivement le résultat) — à
  surveiller sur les prochains vrais matchs avant de pousser plus loin
  (facteur/plafond plus agressif, ou fusion avec d'autres signaux de
  blocage comme M6 en `level:'blocage'`, voir §6).

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
- **Règle de direction pour le palier binaire de M12 (19/07/26,
  hypothèse utilisateur "pair/impair")** — M12 est classée "binaire"
  (2 décalages {4,12} en 8/8, voir table ci-dessus), mais QUELLE figure
  de base reçoit quel décalage restait non expliqué. Hypothèse testée :
  "si la figure de base est dans la boucle de binôme paire (celle qui
  commence par Laetitia), résultante(M12) = binôme(binôme(base)) ; si
  elle est dans la boucle impaire (celle qui commence par Puer),
  résultante(M12) = le 5e élément derrière elle dans sa boucle".
  `BINOMES_V7` forme exactement deux boucles de 8 figures : boucle
  "paire" = Laetitia→Albus→Amissio→Tristitia→Carcer→Fortuna Major→
  Puella→Populus→(retour Laetitia) ; boucle "impaire" = Puer→Caput
  Draconis→Via→Rubeus→Fortuna Minor→Conjunctio→Cauda Draconis→
  Acquisitio→(retour Puer). **Vérifié sur les 16 figures de base
  possibles (calcul direct, exhaustif) : les 2 exemples fournis par
  l'utilisateur sont exacts (Fortuna Major→Populus, Puer→Cauda
  Draconis), et la conclusion structurelle est confirmée — résultante
  (M12) est TOUJOURS exactement à ±2 positions dans la boucle de
  binôme de la figure de base, jamais un autre écart (cohérent à
  100% avec le palier binaire 8/8).** Mais la règle telle
  qu'énoncée ("toute la boucle paire → +2, toute la boucle impaire →
  -2") ne tient que sur 8 des 16 cas — l'appartenance à une boucle ne
  détermine PAS la direction. Le vrai facteur est la **position à
  l'intérieur de la boucle** : en numérotant chaque boucle à partir de
  son point de départ (1=Laetitia/Puer), les positions 1, 4, 5, 8
  donnent toujours -2 (Laetitia, Tristitia, Carcer, Populus / Puer,
  Rubeus, Fortuna Minor, Acquisitio) et les positions 2, 3, 6, 7
  donnent toujours +2 (Albus, Amissio, Fortuna Major, Puella / Caput
  Draconis, Via, Conjunctio, Cauda Draconis) — motif en bloc de 4
  (-2,+2,+2,-2) IDENTIQUE dans les deux boucles, indépendant de
  laquelle des deux boucles on regarde. Les 2 exemples de l'utilisateur
  tombaient chacun du bon côté par coïncidence de position (Fortuna
  Major = position 6 → +2 ; Puer = position 1 → -2), pas par
  appartenance à la boucle paire/impaire. Aucun changement de code —
  résultat purement structurel/documentaire, aucun mécanisme de
  verdict ne dépend de M12 seule à ce jour.
- **Même vérification étendue à M4 (19/07/26, "m4 vérifie si fig
  résulte binôme du binôme")** — M4 partage déjà le même jeu de
  décalages bruts {4,12} que M12 dans la table complète (même palier
  binaire). Vérifié exhaustivement sur les 16 figures de base
  possibles : **M4 suit exactement la même structure que M12** —
  résultante(M4) est toujours à ±2 dans la boucle de binôme de la
  figure de base (8/8 split, jamais un autre écart). La vérification
  précise de l'utilisateur est confirmée : Puer en M4 (le cas réel de
  Vitesse-AEK) donne bien résultante=Via=binôme(binôme(Puer)). **Fait
  notable en bonus : M4 et M12 donnent des décalages EXACTEMENT
  OPPOSÉS, figure par figure** — Puer donne +2 en M4 mais -2 en M12 ;
  Caput Draconis donne -2 en M4 mais +2 en M12 ; et ainsi de suite sur
  les 16 figures, miroir parfait. Cohérent avec leur même jeu de
  décalages bruts {4,12}, mais précise qu'elles sont inversées l'une
  par rapport à l'autre plutôt qu'identiques. Aucun changement de
  code — résultat structurel/documentaire.
- **Extension à M10 (19/07/26, "teste m10")** — M10 est aussi classée
  "binaire" dans la table complète (décalages bruts {6,10}) mais avec
  un jeu DIFFÉRENT de M4/M12. Vérifié exhaustivement sur les 16
  figures : **M10 ne suit PAS la même magnitude que M4/M12** —
  résultante(M10) est toujours à **±3** dans la boucle de binôme (pas
  ±2), toujours 8/8 split. Donc pas "binôme(binôme(base))" mais
  "binôme³(base)" (ou son inverse) : Puer→Rubeus en M10 =
  binôme(binôme(binôme(Puer))). Sur Vitesse-AEK, M10 = Puer (comme
  M4), résultante = Rubeus, `forceMaisonV7` renvoie `level:
  'compatible_90'`, rôle "Amplificateur" — **pas de blocage non plus**,
  comme M4. Donc sur ce match précis, seul M6 est en blocage parmi les
  maisons testées jusqu'ici (M4, M6, M10, M12). Aucun changement de
  code — résultat structurel/documentaire, confirme que le palier
  "binaire" n'implique pas toujours la même magnitude de décalage
  (M2/M4/M12 semblent ±2, M10 est ±3 — reste à vérifier M2, M7, M15
  si utile).
- **Extension à M2 (19/07/26, "teste m2")** — vérifié exhaustivement
  sur les 16 figures : **M2 a sa PROPRE magnitude, ±1** dans la boucle
  de binôme (ni ±2 comme M4/M12, ni ±3 comme M10) — troisième magnitude
  distincte trouvée parmi les maisons "binaires" (8/8 split, toujours
  cohérent). **Sur Vitesse-AEK, M2 EST en blocage** : base Fortuna
  Major, résultante Puella, `forceMaisonV7` renvoie `level:'blocage'`,
  force=20 — un DEUXIÈME foyer de blocage sur ce match, en plus de M6.
  Table complète des 16 maisons de Vitesse-AEK (calcul direct) :
  seules **M2 et M6** sont en blocage, les 14 autres sont compatibles/
  semi-compatibles/repos normal. Mais testé archive-wide, **le blocage
  sur M2 ne montre AUCUN signal** : 6,57 buts (n=7) contre 6,70 sans
  (n=20) — quasiment identique, contrairement à M6 (5,5 vs 7,16, un
  vrai écart, voir plus haut). **Conclusion : le blocage sur M2 semble
  être du bruit sur ce match, pas un vrai contributeur — renforce
  l'idée que c'est M6 spécifiquement qui porte le signal, pas "le
  blocage" en tant que concept général.** Aucun changement de code.
- **Extension à M11 (19/07/26, "teste m11")** — résultat DIFFÉRENT de
  toute la famille M2/M4/M10/M12 : sur les 16 figures testées, la
  résultante(M11) **traverse TOUJOURS vers l'autre boucle de binôme**,
  jamais dans la même boucle que la base — donc aucune loi "±N dans sa
  propre boucle" ne s'applique à M11. **Explication structurelle** :
  les deux boucles de binôme séparent exactement les figures d'index
  PAIR (Puer, Caput Draconis, Via...) et IMPAIR (Laetitia, Albus,
  Amissio...) dans `FIGS_V7`. M2/M4/M10/M12 ont des décalages bruts
  PAIRS ({2,14},{4,12},{6,10}) → restent dans leur boucle. M11, palier
  "4 voies" avec décalages IMPAIRS ({3,5,11,13}) → traverse toujours
  vers l'autre boucle. Confirme pourquoi seuls les paliers binaires à
  décalage pair suivent la loi "±N dans sa propre boucle" — les
  paliers à décalage impair (M11, et probablement M7/M15 qui ont aussi
  des décalages impairs {7,9}/{1,15}) ne peuvent structurellement pas
  la suivre. Sur Vitesse-AEK : M11 = Laetitia, résultante = Cauda
  Draconis, `level:'compatible_90'` — **pas en blocage**, confirme le
  tableau des 16 maisons déjà établi (seules M2 et M6). Archive-wide,
  blocage sur M11 : **0 cas** — intestable, même limite que Populus-M3
  et Carcer-M12. Aucun changement de code — résultat structurel.
- **Extension à M7 (19/07/26, "teste m7")** — confirme exactement la
  prédiction de l'entrée M11 ci-dessus : M7 a des décalages bruts
  IMPAIRS ({7,9}) → traverse lui aussi **toujours** vers l'autre boucle
  de binôme (16/16 cas, jamais dans sa propre boucle), même
  comportement que M11. Sur Vitesse-AEK : M7 = Rubeus, et fait notable,
  **M7 est "à repos absolu"** ici (base = figure naturelle de M7) donc
  sa résultante tombe automatiquement sur Populus, cohérent avec
  l'identité `combine(X,X)=Populus` découverte plus tôt dans la session
  (voir §5). `level:'repos_moyen'`, rôle "Chaotique" — **pas en
  blocage**. Archive-wide, blocage sur M7 : **0 cas**, intestable comme
  M11. Confirme que la carte des 16 maisons de Vitesse-AEK reste
  inchangée : seules M2 et M6 en blocage. Aucun changement de code —
  résultat structurel.
- **Extension à M15 (19/07/26, "teste m15")** — troisième et dernière
  confirmation de la règle de parité : M15 a des décalages bruts
  IMPAIRS ({1,15}) → traverse lui aussi **toujours** vers l'autre
  boucle de binôme (16/16 cas). **Complète la vérification des 3
  maisons à décalage impair (M7, M11, M15), toutes cohérentes avec la
  règle : décalage pair → reste dans sa boucle (M2/M4/M10/M12),
  décalage impair → traverse toujours (M7/M11/M15).** Sur Vitesse-AEK :
  M15 = Conjunctio, résultante = Fortuna Major, `level:'compatible_70'`
  — **pas en blocage**. Archive-wide, blocage sur M15 : **0 cas**. La
  carte des 16 maisons de Vitesse-AEK reste stable : seules M2 et M6.
  Aucun changement de code — résultat structurel.
- **TABLE COMPLÈTE M15 "LE JUGE" (19/07/26, "m15 juge fait un teste avec
  tout les 16. le tableau")** — balayage exhaustif des 16 figures de
  base possibles en M15 : révèle une loi **encore plus précise** que le
  simple "traverse toujours" noté ci-dessus. **M15 forme une involution
  parfaite** — chaque figure a un "jumeau" FIXE dans l'autre boucle de
  binôme, et résultante(résultante(X)) = X toujours (appliquer la règle
  deux fois ramène à la figure de départ) :

  | Base | Résultante M15 | Base | Résultante M15 |
  |---|---|---|---|
  | Puer | Laetitia | Laetitia | Puer |
  | Caput Draconis | Albus | Albus | Caput Draconis |
  | Via | Amissio | Amissio | Via |
  | Rubeus | Tristitia | Tristitia | Rubeus |
  | Fortuna Minor | Carcer | Carcer | Fortuna Minor |
  | Conjunctio | Fortuna Major | Fortuna Major | Conjunctio |
  | Cauda Draconis | Puella | Puella | Cauda Draconis |
  | Acquisitio | Populus | Populus | Acquisitio |

  Plus propre que M7/M11 (qui traversent aussi vers l'autre boucle mais
  à des écarts variables selon la position) : M15 apparie chaque figure
  avec exactement UNE contrepartie fixe, jamais une autre — une
  identité algébrique déterministe et symétrique (16/16), cohérente
  avec le rôle de M15 dans les consultations personnelles ("XV — Le
  Juge, verdict final") : une résultante sans ambiguïté de degré,
  contrairement aux paliers 4-voies/8-voies. Aucun changement de code
  — résultat structurel/documentaire.
- **CERTAINES FIGURES NE SONT JAMAIS EN M15 (19/07/26, remarque
  utilisateur "certaines ne sont jamais en m15")** — vérifié
  exhaustivement sur les **65 536 thèmes possibles** (16⁴ combinaisons
  de mères, via `buildThemeFromMothers`) : **exactement 8 des 16
  figures ne peuvent JAMAIS apparaître comme figure de BASE en M15**,
  0 cas sur 65 536. Les 8 autres apparaissent chacune exactement
  8192/65536 fois (réparties également).
  - **Jamais en M15** : Puer, Laetitia, Caput Draconis, Albus, Rubeus,
    Tristitia, Cauda Draconis, Puella.
  - **Toujours possibles en M15** : Via, Amissio, Fortuna Minor, Carcer,
    Conjunctio, Fortuna Major, Acquisitio, Populus.

  **Explication trouvée** : ça correspond exactement à la distinction
  classique en géomancie entre figures **paires** et **impaires**
  (nombre de points simples dans `MAP_GEO`, valeur `1`) — les 8 figures
  "jamais en M15" ont TOUTES un nombre IMPAIR de points simples (Puer=3,
  Laetitia=1, Caput Draconis=3, Albus=1, Rubeus=1, Tristitia=1, Cauda
  Draconis=3, Puella=3), les 8 "toujours possibles" ont TOUTES un
  nombre PAIR (Via=4, Amissio=2, Fortuna Minor=2, Carcer=2,
  Conjunctio=2, Fortuna Major=2, Acquisitio=2, Populus=0). **M15 (Le
  Juge) ne peut structurellement recevoir qu'une figure PAIRE comme
  base, jamais une impaire** — cohérent avec son rôle de verdict final :
  seul un sous-ensemble stable des 16 figures peut y siéger. Aucun
  changement de code — résultat structurel/documentaire, mais utile
  à garder en tête si une future doctrine veut s'appuyer sur "quelle
  figure siège en M15" (la moitié des 16 figures est structurellement
  exclue d'office). **Table complète des 8 figures possibles (19/07/26,
  "fais le tableau des 8 figures possibles en m15")** :

  | Figure | Élément | Points | Polarité | Binôme | Antagoniste | Résultante M15 | BUTS_FIGURE | Sens |
  |---|---|---|---|---|---|---|---|---|
  | Via | eau | [1,1,1,1] | mixte | Rubeus | Laetitia | Amissio | 0-1 | Mouvement, changement, transition en cours |
  | Amissio | eau | [1,2,1,2] | défavorable | Tristitia | Caput Draconis | Via | 0-1 (concède) | Perte, séparation, ce qui s'en va ou échappe |
  | Fortuna Minor | feu | [1,1,2,2] | mixte | Conjunctio | Amissio | Carcer | 1-2 (fragile) | Chance rapide mais changeante, aide extérieure passagère |
  | Carcer | terre | [1,2,2,1] | défavorable | Fortuna Major | Rubeus | Fortuna Minor | 0-0 | Blocage, restriction, retard ou enfermement |
  | Conjunctio | air | [2,1,1,2] | neutre | Cauda Draconis | Tristitia | Fortuna Major | 0-1 | Union, rencontre, lien qui se crée ou se renforce |
  | Fortuna Major | terre | [2,2,1,1] | favorable | Puella | Fortuna Minor | Conjunctio | 3-5 | Réussite solide et méritée, protection durable |
  | Acquisitio | air | [2,1,2,1] | favorable | Puer | Fortuna Major | Populus | 2-3 | Gain, acquisition, croissance matérielle |
  | Populus | feu | [2,2,2,2] | neutre | Laetitia | Cauda Draconis | Acquisitio | 0-0 | Influence du groupe ou de l'entourage |

  À noter : sur ces 8 figures, seule **Fortuna Major** est franchement
  favorable avec un vrai potentiel offensif (3-5 buts) ; **Carcer et
  Populus** sont les deux seules figures 0-0 garanties de tout le
  système (`BUTS_FIGURE`) et sont TOUJOURS possibles en M15, jamais
  exclues — cohérent avec le fait que M15 (Le Juge) penche
  structurellement plutôt vers des figures neutres/défensives que vers
  des figures franchement offensives (seules 2 des 8 — Fortuna Major et
  Acquisitio — sont "favorable"). **Précision (19/07/26, "donne les
  resultante dans le tableau") : l'involution de M15 ne mélange JAMAIS
  les deux groupes de parité.** La résultante d'une figure paire est
  toujours une autre figure paire (Via↔Amissio, Fortuna Minor↔Carcer,
  Conjunctio↔Fortuna Major, Acquisitio↔Populus — 4 paires internes,
  fermées sur elles-mêmes), et il en va de même pour les 8 figures
  impaires (jamais en M15) entre elles (Puer↔Laetitia, Caput
  Draconis↔Albus, Rubeus↔Tristitia, Cauda Draconis↔Puella). Cohérent
  avec la loi de parité déjà établie (décalage pair reste dans sa
  boucle de binôme, impair traverse) : l'involution de M15 respecte
  strictement cette même partition en deux groupes de 8.

  **Table complète des 16 figures (19/07/26, "donnes le tableau
  complet")** :

  | Figure | Élément | Points | Parité | Possible en M15 ? | Binôme | Antagoniste | Résultante M15 | BUTS_FIGURE | Sens |
  |---|---|---|---|---|---|---|---|---|---|
  | Puer | feu | [1,1,2,1] (3) | impaire | ❌ jamais | Caput Draconis | Puella | Laetitia | 1-2 (concède) | Énergie impulsive, action rapide |
  | Laetitia | feu | [1,2,2,2] (1) | impaire | ❌ jamais | Albus | Acquisitio | Puer | 2-3 | Joie, succès, bonne santé |
  | Caput Draconis | air | [2,1,1,1] (3) | impaire | ❌ jamais | Via | Populus | Albus | 0-1 | Début, nouvelle opportunité |
  | Albus | eau | [2,2,1,2] (1) | impaire | ❌ jamais | Amissio | Puer | Caput Draconis | 2-4 | Calme, réflexion, sagesse |
  | Rubeus | air | [2,1,2,2] (1) | impaire | ❌ jamais | Fortuna Minor | Albus | Tristitia | 1-3 (instable) | Tension, désordre, passion incontrôlée |
  | Tristitia | terre | [2,2,2,1] (1) | impaire | ❌ jamais | Carcer | Via | Rubeus | 0-1 | Tristesse, perte profonde |
  | Cauda Draconis | eau | [1,1,1,2] (3) | impaire | ❌ jamais | Acquisitio | Carcer | Puella | 1-2 (destructeur) | Fin, rupture, dissolution |
  | Puella | terre | [1,2,1,1] (3) | impaire | ❌ jamais | Populus | Conjunctio | Cauda Draconis | 2 | Harmonie, douceur, charme |
  | Via | eau | [1,1,1,1] (4) | paire | ✅ oui | Rubeus | Laetitia | Amissio | 0-1 | Mouvement, changement |
  | Amissio | eau | [1,2,1,2] (2) | paire | ✅ oui | Tristitia | Caput Draconis | Via | 0-1 (concède) | Perte, séparation |
  | Fortuna Minor | feu | [1,1,2,2] (2) | paire | ✅ oui | Conjunctio | Amissio | Carcer | 1-2 (fragile) | Chance rapide mais changeante |
  | Carcer | terre | [1,2,2,1] (2) | paire | ✅ oui | Fortuna Major | Rubeus | Fortuna Minor | 0-0 | Blocage, restriction |
  | Conjunctio | air | [2,1,1,2] (2) | paire | ✅ oui | Cauda Draconis | Tristitia | Fortuna Major | 0-1 | Union, rencontre |
  | Fortuna Major | terre | [2,2,1,1] (2) | paire | ✅ oui | Puella | Fortuna Minor | Conjunctio | 3-5 | Réussite solide et méritée |
  | Acquisitio | air | [2,1,2,1] (2) | paire | ✅ oui | Puer | Fortuna Major | Populus | 2-3 | Gain, acquisition |
  | Populus | feu | [2,2,2,2] (0) | paire | ✅ oui | Laetitia | Cauda Draconis | Acquisitio | 0-0 | Influence du groupe |
- **Hypothèse testée : "résultante(M15) = binôme(antagoniste(X))"
  (19/07/26, remarque utilisateur "conséquence du figure en m15 donne
  binôme de son antagoniste") — REJETÉE.** Testé exhaustivement sur les
  16 figures : la formule ne tient que **8/16 (50%)**, pas une loi
  universelle comme l'involution M15 elle-même (16/16). Le motif est
  net : dans chaque paire de l'involution (Via↔Amissio, Puer↔Laetitia,
  Fortuna Minor↔Carcer, Conjunctio↔Fortuna Major, Acquisitio↔Populus,
  Caput Draconis↔Albus, Rubeus↔Tristitia, Cauda Draconis↔Puella), la
  formule est vraie pour UN SEUL des deux membres, fausse pour l'autre
  (ex. `binôme(antagoniste(Amissio))=Via` ✅, mais
  `binôme(antagoniste(Via))=Albus≠Amissio` ❌). Autres variantes testées
  (`antagoniste(binôme(X))`, et leurs versions avec lookup inverse du
  binôme/antagoniste) : soit le même 8/16, soit 0/16. Rejeté, aucun
  changement de code — l'involution M15 pure (résultante directe via
  `combine`) reste la seule loi propre trouvée pour cette maison.
  **Discriminant trouvé (19/07/26, "c'est quoi la conséquence de cette
  variation")** : la variation n'est pas du bruit — vérifié 16/16, la
  formule `binôme(antagoniste(X))` est vraie EXACTEMENT quand X
  appartient à la boucle de binôme "Laetitia" (Cycle B), et fausse
  EXACTEMENT quand X appartient à la boucle "Puer" (Cycle A) — aucune
  exception. Même partition en deux groupes de 8 que la règle de
  parité pair/impair déjà établie (les deux boucles de binôme
  correspondent exactement aux deux classes de parité). Donc la
  formule EST une loi complète, mais conditionnelle à la boucle
  d'appartenance plutôt qu'universelle — reste sans utilité pratique
  au-delà de l'involution directe déjà connue (il faut déjà savoir
  dans quelle boucle est X pour savoir si la formule s'applique, ce
  qui revient à déjà connaître la moitié de la réponse).
  **Impact sur le verdict testé (19/07/26, "mais à quoi ça pèse sur le
  verdict") : AUCUN.** M15 harmonieux (force≥60, 18/27 cas archive) →
  M1 gagne seulement **50%** ; M15 dissonant (9/27) → M1 gagne **67%**
  (plutôt l'inverse de l'intuition). Testé en priorité absolue sur
  `verdictFinal` complet : le score **chute de 22/27 à 17/27** (7
  vainqueurs changés, tous vers le pire) — nettement destructeur.
  Cohérent avec la conclusion déjà établie plus haut (§6, "Couverture
  complète des 6 axes terminée") : sur les 12 maisons satellites
  testées (M2 à M15), aucune ne bat la cascade actuelle en usage isolé.
  Toute l'exploration algébrique de M15 aujourd'hui (involution,
  contrainte de parité, discriminant boucle) reste un corpus de
  connaissance structurelle solide, mais ne pèse pas sur le verdict —
  pas intégré, aucun changement de code.
  **Ancrage complet de M15 testé aussi (19/07/26, "regarde ancrage
  binôme et antagoniste [...] de m15")** — pas seulement l'harmonie
  simple ci-dessus, mais le mécanisme d'ancrage COMPLET
  (`chaineDualite(theme[15], theme)`, qui traite la figure de M15
  comme un "chef" avec sa propre ancre=binôme, assaillant=antagoniste,
  libérateur, victime, etc. — exactement la mécanique déjà utilisée
  pour M1/M7). M15 appartient à CAMP2 (Constat 12, groupe M7). Résultat
  archive : **M15 "domine" (15/27) → M7 gagne 47%** (quasi hasard) ;
  **M15 pas "domine" (12/27) → M7 gagne seulement 25%** (plutôt
  l'inverse de l'attendu pour une maison CAMP2) ; force M15 plus proche
  de M7 que de M1 → M7 gagne aussi seulement 25%. Testé en priorité
  absolue sur `verdictFinal` complet : **22/27 → 16/27**, destructeur.
  Même conclusion : l'ancrage complet de M15 (avec binôme et
  antagoniste, pas seulement l'harmonie de base) ne pèse pas plus sur
  le verdict. Aucun changement de code.
  **LE JUGE NE CONFIRME JAMAIS (19/07/26, "quand dit on le juge
  confirme ou nie") — preuve structurelle, pas seulement empirique.**
  `confirmationResultanteBinome(pos, theme)` (mécanisme déjà intégré
  pour M1/M7, voir §0/§1) est une fonction générique testable sur
  n'importe quelle position. Appliquée à M15 : **0/27 sur l'archive,
  et `false` sur Vitesse-AEK** — le Juge "nie" (`confirme=false`)
  SYSTÉMATIQUEMENT, jamais une seule confirmation. **Raison
  structurelle trouvée** : `confirmationResultanteBinome` exige que la
  polarité (`FIGURE_MEANINGS_PERSO`) de la base ET de sa résultante
  soient toutes deux "favorable" ou toutes deux "défavorable". Or sur
  les 8 figures possibles en M15, l'involution (voir plus haut) apparie
  toujours une figure avec une autre dont la polarité est "mixte" ou
  "neutre" — jamais deux figures franchement tranchées du même bord :

  | Base | Polarité | Résultante | Polarité |
  |---|---|---|---|
  | Via | mixte | Amissio | défavorable |
  | Amissio | défavorable | Via | mixte |
  | Fortuna Minor | mixte | Carcer | défavorable |
  | Carcer | défavorable | Fortuna Minor | mixte |
  | Conjunctio | neutre | Fortuna Major | favorable |
  | Fortuna Major | favorable | Conjunctio | neutre |
  | Acquisitio | favorable | Populus | neutre |
  | Populus | neutre | Acquisitio | favorable |

  **Conclusion : `confirmationResultanteBinome(15, theme)` est
  mathématiquement IMPOSSIBLE à être vraie, pas juste rare dans
  l'archive** — une garantie structurelle, pas une tendance
  probabiliste. Le Juge nie toujours, pour n'importe quel thème
  possible. Cohérent avec le fait que M15 ne pèse déjà pas sur le
  verdict (voir entrées ci-dessus) : même son mécanisme de confirmation
  le plus sophistiqué ne peut structurellement jamais s'activer pour
  cette maison. Aucun changement de code — résultat structurel/
  documentaire.
  **Piste des Témoins M13/M14 (19/07/26, remarque utilisateur "m15 elle
  est impartiale mais à travers des témoignages elle va trancher")** —
  intuition juste et bien fondée : `calcTheme` construit littéralement
  M15 comme `combine(t[13], t[14])` (le Juge = combinaison des deux
  Témoins). Testé si M13/M14, individuellement, PEUVENT confirmer via
  `confirmationResultanteBinome` (contrairement à M15 qui ne peut
  JAMAIS confirmer, voir ci-dessus) : **oui, elles peuvent** — M13
  confirme 5/27 fois sur l'archive, M14 confirme 7/27 fois (pas de
  contrainte structurelle équivalente à celle de M15). Sur Vitesse-AEK :
  M13 nie, M14 confirme — témoignages contradictoires. **Mais aucune
  corrélation utile avec le vainqueur réel** : M13 confirme → M1 gagne
  60% (3/5) ; M13 nie → 55% (12/22) ; M14 confirme → 57% (4/7) ; M14
  nie → 55% (11/20) ; les deux nient ensemble (16/27, cas le plus
  fréquent) → 56% — toutes ces valeurs restent proches du taux de base
  archive (~56% M1), échantillons trop petits (5 et 7) pour espérer un
  signal exploitable de toute façon. **Testé quand même en cascade
  complète (19/07/26, "teste m13 et m14 en cascade quand même")** :
  toutes les variantes DÉGRADENT le score, aucune n'aide.

  | Règle testée | Score | Flips |
  |---|---|---|
  | Base (`verdictFinal` actuel) | **22/27** | — |
  | M13 confirme → M1 (priorité) | 21/27 | 1 flip, vers faux |
  | M14 confirme → M1 (priorité) | 20/27 | 2 flips, tous vers faux |
  | M13 OU M14 confirme → M1 (priorité) | 19/27 | 3 flips, tous vers faux |
  | M13 ET M14 confirment → M1 (priorité) | 22/27 (neutre) | 0 flip (n=1 trop rare) |

  Chaque flip forcé va dans le mauvais sens, zéro amélioration —
  contrairement à M2+M8 qui avait passé ce même test avec succès,
  M13/M14 n'a aucune valeur en cascade : pas juste "plat" en isolé,
  mais activement nuisible dès qu'on force la priorité. **Rejeté
  définitivement, aucun changement de code** — mais confirme que les
  Témoins, contrairement au Juge, ne sont pas structurellement
  condamnés à l'impartialité : leur silence collectif (M13 ET M14
  nient, le cas majoritaire à 16/27) reste néanmoins le statu quo le
  plus probable, cohérent avec le fait que le Juge lui-même (leur
  synthèse) ne confirme jamais.
  **Extension à M16 "La Réconciliation" (19/07/26, "teste m16 aussi les
  témoignages")** — `calcTheme` construit M16 comme `combine(t[15],
  t[1])` (Réconciliation = combinaison du Juge et du chef M1).
  Contrairement à M15, **M16 PEUT confirmer**. Raison structurelle :
  M16 a un décalage nul (loi triviale déjà trouvée, `combine(X,
  Populus)=X`) — sa résultante est TOUJOURS égale à sa propre base,
  donc la condition de polarité de `confirmationResultanteBinome` se
  réduit à une seule question : la figure atterrissant en M16 est-elle
  elle-même franchement favorable ou défavorable (pas mixte/neutre) ?
  Testé exhaustivement sur les 8×16=128 combinaisons possibles (M15 ×
  M1) : **88/128 (69%) ont une polarité qui matche** — conditionnel à
  la figure qui atterrit, pas structurellement impossible comme M15.
  Sur Vitesse-AEK : M16 nie. Sur l'archive : **M16 confirme** (8/27) →
  M1: 4, M7: 3, Nul: 1 (50%, quasi pile) ; **M16 nie** (19/27) → M1:
  11, M7: 7, Nul: 1 (58%, proche du taux de base). **Même conclusion
  que M13/M14** : M16 peut témoigner (contrairement au Juge, structurel
  -lement muet), mais son témoignage ne corrèle pas avec le vainqueur
  réel. Aucun changement de code.
- **Extension à M3 (19/07/26, "teste m3")** — M3 (palier 4-voies,
  décalages IMPAIRS {3,5,11,13}) traverse lui aussi **toujours** vers
  l'autre boucle de binôme, cohérent avec la règle de parité (déjà
  vérifiée sur M7, M11, M15). Sur Vitesse-AEK : M3 = Populus,
  résultante = Caput Draconis, `level:'semi_compatible'`, rôle
  "Dissonant" — **pas en blocage**. Archive-wide, blocage sur M3 :
  **0 cas**. La règle de parité tient désormais sur 7 maisons testées
  (M2/M4/M10/M12 pairs → restent dans leur boucle ; M3/M7/M11/M15
  impairs → traversent toujours), et la carte des 16 maisons de
  Vitesse-AEK reste stable : toujours seulement M2 et M6 en blocage.
  Aucun changement de code — résultat structurel.
- **Extension à M1 (19/07/26, "teste m1")** — M1 (palier 4-voies,
  décalages IMPAIRS {1,3,13,15}) traverse lui aussi **toujours** vers
  l'autre boucle de binôme, cohérent avec la règle de parité. Sur
  Vitesse-AEK : M1 = Carcer (l'ancre du match, camp Équipe 1),
  résultante = Rubeus, `level:'compatible_70'`, rôle "Amplificateur" —
  **pas en blocage**. Archive-wide, blocage sur M1 : **0 cas**. La
  règle de parité tient désormais sur 8 maisons testées, et la carte
  des 16 maisons de Vitesse-AEK reste stable : toujours seulement M2
  et M6 en blocage. Aucun changement de code — résultat structurel.
- **Extension à M5 (19/07/26, "teste m5")** — M5 est le palier
  "8 voies" (le moins prévisible du système, décalages
  {1,3,5,7,9,11,13,15} — TOUS impairs). Vérifié : traverse lui aussi
  **toujours** vers l'autre boucle de binôme (16/16), cohérent avec la
  règle de parité même sur ce palier le moins structuré. **La règle de
  parité tient désormais sur les 4 paliers de précision (pur, binaire,
  4-voies, 8-voies).** Sur Vitesse-AEK : M5 = Carcer, résultante =
  Conjunctio, `level:'compatible_70'`, rôle "Amplificateur" — **pas en
  blocage**. Archive-wide, blocage sur M5 : **0 cas**. Carte des 16
  maisons de Vitesse-AEK toujours stable : seules M2 et M6. Aucun
  changement de code — résultat structurel.
- **Extension à M8 (19/07/26, "teste m8")** — **résultat le plus propre
  de toute la cartographie.** M8 est le palier "pur" (16/16, un seul
  décalage brut {8}) — vérifié en termes de boucle de binôme :
  résultante(M8) = base décalée d'**exactement +4, TOUJOURS, sans
  aucune exception** (16/16, aucun split 8/8 contrairement à
  M2/M4/M10/M12). Cohérent avec le fait que M8 n'a qu'un seul décalage
  brut possible, contrairement aux paliers binaires (2 options) ou
  4/8-voies. Sur Vitesse-AEK : M8 = Puer, résultante = Fortuna Minor,
  `level:'semi_compatible'`, rôle "Absorbeur" — **pas en blocage**.
  Archive-wide, blocage sur M8 : n=9, moyenne **6,11 buts** contre
  **6,94** sans (n=18) — léger écart dans le bon sens, plus faible que
  M6 (5,5 vs 7,16). Carte des 16 maisons de Vitesse-AEK toujours
  stable : seules M2 et M6. Aucun changement de code — résultat
  structurel.
- **Extension à M9 (19/07/26, "teste m9")** — M9 (palier 4-voies,
  décalages impairs {5,7,9,11}) traverse aussi **toujours** vers
  l'autre boucle, cohérent avec la règle de parité. Sur Vitesse-AEK :
  M9 = Amissio, résultante = Conjunctio, `level:'compatible_70'`, rôle
  "Amplificateur" — **pas en blocage**. Archive-wide, blocage sur M9 :
  **0 cas**. Carte des 16 maisons de Vitesse-AEK toujours stable :
  seules M2 et M6. Aucun changement de code — résultat structurel.
- **Extension à M13 (19/07/26, "teste m13")** — deuxième maison du
  palier "8-voies" (avec M5), décalages tous impairs {1,3,5,7,9,11,
  13,15} : traverse aussi **toujours**, cohérent avec la règle de
  parité. Sur Vitesse-AEK : M13 = Caput Draconis, résultante = Carcer,
  `level:'semi_compatible'`, rôle "Absorbeur" — **pas en blocage**.
  Archive-wide, blocage sur M13 : **0 cas**. Carte des 16 maisons de
  Vitesse-AEK toujours stable : seules M2 et M6. Aucun changement de
  code — résultat structurel.
- **Extension à M14 (19/07/26, "teste m14")** — M14 (palier 4-voies,
  décalages bruts PAIRS {2,6,10,14}) : confirme qu'il **reste bien
  dans sa boucle** (cohérent avec la règle : décalage pair → reste,
  impair → traverse), mais avec **4 offsets différents cette fois (1,
  3, 5, 7, chacun 4/16)** plutôt qu'un split binaire à 2 valeurs comme
  M2/M4/M10/M12 — cohérent avec son palier "4 voies" (4 issues
  possibles au lieu de 2). Sur Vitesse-AEK : M14 = Tristitia,
  résultante = Amissio, `level:'semi_compatible'`, rôle "Dissonant" —
  **pas en blocage**. Archive-wide, blocage sur M14 : n=2 (échantillon
  minuscule), moyenne **8,5 buts** contre 6,52 sans — va dans le
  MAUVAIS sens (comme M12), pas dans le bon sens comme M6. Renforce
  l'idée que M6 reste le seul signal fiable trouvé dans cette série de
  tests. Carte des 16 maisons de Vitesse-AEK toujours stable : seules
  M2 et M6. Aucun changement de code — résultat structurel.
- **Extension à M16 (19/07/26, "teste m16") — DERNIÈRE MAISON, CARTE
  COMPLÈTE DES 16 MAISONS DE VITESSE-AEK TERMINÉE.** M16 (l'autre
  palier "pur") donne un décalage **toujours 0** (16/16) : résultante
  (M16) = base, systématiquement — cohérent avec Populus (figure
  naturelle de M16) comme élément neutre de `combine()` (`combine(X,
  Populus)=X`, symétrique de l'identité `combine(X,X)=Populus` déjà
  établie), et confirme ce que ce document notait déjà comme "M16
  triviale". Sur Vitesse-AEK : M16 = Via, résultante = Via (identique),
  `level:'compatible_70'` — **pas en blocage**. Archive-wide, blocage
  sur M16 : n=5, moyenne **8,4 buts** contre 6,27 sans — mauvais sens
  (comme M12/M14).

  **BILAN FINAL des 16 maisons de Vitesse-AEK (carcer/fortuna_major/
  populus/puer)** — seules **M2 et M6** sont en `level:'blocage'`,
  les 14 autres compatibles/semi-compatibles/repos normal. Sur les 6
  maisons dont le blocage a été testé archive-wide (M2, M4, M6, M8,
  M10, M12, M14, M16 — les maisons à décalage pair, seules capables
  d'atteindre le niveau blocage terre/air de façon récurrente dans
  l'archive), **seul M6 montre un signal net dans le bon sens** (5,5
  vs 7,16 buts) ; M4/M8/M10 montrent un signal modeste dans le bon
  sens mais ne se déclenchent pas sur ce match ; M2/M12/M14/M16 vont
  soit dans le mauvais sens soit sont neutres. **Conclusion de toute
  cette série d'exploration (M1 à M16) : le gap Vitesse-AEK (0-0 réel
  contre 5-3 prédit) reste partiellement expliqué par M6 en blocage,
  mais aucune maison individuelle ne l'explique entièrement — le
  0-0 est probablement le produit d'une combinaison de facteurs
  (M6 blocage + finition inefficace malgré 22 tirs) plutôt que d'un
  signal unique manquant à la doctrine.** Aucun changement de code sur
  l'ensemble de cette série — résultat structurel/documentaire.
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
- **M4 et M10 testés (19/07/26, "teste M4 et M10 aussi")** : les deux
  appartiennent à CAMP1 (comme M2), aucune figure ne s'auto-construit
  dans l'une ou l'autre (0/16 chacune, cohérent avec leur palier
  binaire). Harmonie corrélée à M1 (leur camp) : **M4 harmonieux 68%
  vs dissonant 33%** (n=19/6) ; **M10 harmonieux 64% vs dissonant 33%**
  (n=22/3, dissonant trop mince). Sens intuitif, comme M1/M7, PAS le
  paradoxe inverse de M2 (pourtant même camp CAMP1) — la direction du
  paradoxe n'est donc pas systématique par camp. **Testé comme règle
  "toujours active" (harmonieux→M1, dissonant→M7) sur l'archive
  complète, en priorité absolue** : M4 → **16/25** (contre 21/25
  baseline, casse 7 corrects pour en réparer 2) ; M10 → **15/25**
  (casse 7, répare 1) — rejet net et plus marqué que les autres
  maisons testées ce jour, le groupe "harmonieux" étant trop large
  (19-22 matchs sur 27) et trop proche du taux de base pour battre
  une cascade déjà affinée.
- **M3 et M9 testés (19/07/26, "teste M3 et M9 aussi")** : même camp
  (CAMP1), 0/16 auto-construction chacune, direction intuitive
  (harmonieux favorise M1) : **M3 harmonieux 71% vs dissonant 38%**
  (n=17/8) ; **M9 harmonieux 63% vs dissonant 50%** (n=19/6, plus
  faible). En règle "toujours active" sur l'archive complète : M3 →
  **16/25** (baseline 21/25) ; M9 → **14/25**, le pire résultat de
  toute la série testée aujourd'hui. Même conclusion que M4/M10 :
  rejeté, aucun signal de maison satellite ne bat la cascade actuelle.
- **M5 et M11 testés (19/07/26, "M5-M11")** — dernier axe, boucle la
  couverture complète des 6 axes d'opposition. Même camp (CAMP2),
  0/16 auto-construction chacune. Signal plus faible et moins net que
  les autres axes : **M5** harmonieux→M7 53% (quasi hasard), dissonant→
  M1 80% (n=10, c'est le côté dissonant qui porte le signal, motif
  inhabituel) — cascade priorité **15/25**. **M11** harmonieux→M7 45%
  (aucun signal), dissonant→M1 80% (n=5) — cascade priorité **13/25**,
  presque aussi mauvais que M9 (14/25, le pire de la série).
- **BUT PAR MI-TEMPS (M1/M7/M5/M10, + tentative M4) — 3e cas réel testé
  (19/07/26)** : le mécanisme `htWinner` (§0 code, "BUT PREMIERE MI-
  TEMPS") exige M5 active/ouverte ET M10 ouverte pour trancher, sinon
  repli sur une comparaison de concordance binôme M1/M7 individuelle.
  3 vrais cas connus au total : **USA-Belgique** (M5/M10 actives, HIT
  'both') ; **France-Espagne** (M5/M10 actives mais M1/M7 en désaccord,
  correctement rétrogradé "indéterminé" après avoir été contredit une
  1ère fois) ; **St. Louis City SC vs Sporting Kansas City (nouveau,
  19/07/26, mi-temps 2-1 M1 donnée par l'utilisateur = réel 'both')** :
  ICI M5 (Caput Draconis, ni actif ni ouvert) ET M10 (Conjunctio, fermé)
  échouent TOUS LES DEUX, donc le mécanisme reste muet (`htWinner=null`)
  alors que le réel était 'both' — un vrai MISS PAR SILENCE (pas une
  mauvaise réponse, mais une occasion manquée). **Tentative d'ajouter
  M4 à la condition, testée sur les 3 cas** : M4 est ouvert+mobile dans
  LES 3 CAS SANS EXCEPTION (Rubeus, Via, Puer), quel que soit le résultat
  réel (both/single/both) — **M4 ne discrimine rien, confirmé sur 3/3**,
  abandonné comme piste de raffinement. Conclusion : le verrou M5+M10
  semble trop restrictif (rate un vrai cas "both"), mais 3 cas restent
  insuffisants pour le desserrer sans risquer d'inventer une règle sur
  mesure — à revoir avec un 4e cas réel.
  **Couverture complète des 6 axes terminée** : sur 12 maisons
  satellites testées (M2 à M15, hors M1/M7 eux-mêmes et M16 triviale),
  AUCUNE ne bat la cascade `verdictFinal` actuelle en usage "toujours
  actif" — seuls des sous-échantillons isolés (souvent le groupe
  harmonieux OU dissonant, jamais les deux de façon cohérente) montrent
  un écart par rapport au taux de base, mais jamais assez large ni
  assez stable pour survivre au test en conditions réelles de cascade.
  Conclusion générale de cette exploration (19/07/26) : la structure
  algébrique des maisons (Constat 12) est réelle et solide, mais
  n'apporte, à ce stade, AUCUNE amélioration mesurable de `verdictFinal`
  — reste un corpus de connaissance structurelle utile, pas encore un
  levier de décision.
  **PROLONGEMENT (19/07/26, demande utilisateur "il y a une chose qu'on
  a raté... 5 maison piliers c'est impossible, M8 et M16 tout ça pèse
  sur le verdict")** : deux vérifications de plus avant de clore. (1)
  **Vote consensus** (chaque maison, sur les 14 non-M8/M16, vote M1 ou
  M7 selon l'harmonie apprise de l'archive) : dégénère en "prédire M1
  systématiquement" (13/14 maisons apprennent la même direction, reflet
  du taux de base 60%, pas un signal caché) — pire que la cascade
  (14/24 contre 21/25). (2) **Identité algébrique nouvelle et exacte,
  vérifiée 16/16** : `combine(X, X) = Populus`, pour TOUTE figure X —
  explique structurellement pourquoi une maison "au repos absolu"
  (base = sa propre figure naturelle) produit TOUJOURS Populus comme
  résultante cachée, quelle que soit la maison. Testé si généraliser
  `piliersReposCount` (limité aux 5 piliers [1,8,9,12,15]) à un compte
  sur les 16 maisons donnait un signal plus fort sur l'écart réel :
  **NON** — corrélation piliers actuels r=0.389 contre r=0.108 sur les
  16 maisons. **Les 5 piliers ne sont pas arbitraires : ils captent près
  de 4× plus de signal que la moyenne des 16** — la loi algébrique
  explique le MÉCANISME (pourquoi le repos compte) mais ne se généralise
  pas également ; le choix des 5 piliers reste spécifiquement le bon.
  Résultat qui VALIDE le système existant plutôt que d'en réviser un
  nouveau — pas de changement de code, juste une explication structurelle
  plus profonde d'un mécanisme déjà intégré et déjà correct.
- **CORRECTIF : la conclusion "AUCUNE ne bat la cascade" ci-dessus n'est
  plus tout à fait vraie (19/07/26, demande utilisateur "interaction
  M2+M8 ensemble")** : M2 et M8 seuls, chacun de leur côté, ne battaient
  effectivement pas la cascade — mais leur **croisement** (harmonie(M2)
  × harmonie(M8), 4 cellules) révèle une cellule propre : quand les
  DEUX sont dissonants EN MÊME TEMPS, M1 gagne 3/3 décisifs (n=4).
  Testé en priorité absolue sur `verdictFinal` complet : **22/25,
  contre 21/25 baseline, +1 net, zéro régression** (corrige Arsenal-
  Barcelone). **INTÉGRÉ le 19/07/26** (demande explicite utilisateur
  "intègre-le, avec la mise en garde sur l'échantillon") comme nouveau
  palier 2c, voir §1. Leçon méthodologique : une maison seule peut être
  un signal trop faible pour être utile, mais le CROISEMENT de deux
  maisons structurellement liées (même axe d'opposition, Constat 12)
  peut révéler une cellule nette même quand aucune des deux marges
  seules ne l'était — à garder en tête pour d'éventuelles autres
  interactions à tester (M4+M10, M3+M9, M5+M11, M6+M12) si de nouvelles
  données réelles justifient d'y revenir.
- **M4+M10 (déjà rejeté ci-dessus, voir plus haut) + les 3 derniers axes
  testés (19/07/26, "revenons aux tests des maisons")** : couverture
  complète des interactions à 2 maisons désormais terminée.
  - **M3+M9 dissonants→M7** (isolé 3/4, 75%) : cascade **21/25, net -1**
    (casse Arsenal-Barcelone). Rejeté.
  - **M5+M11 (dissonant+harmonieux)→M1** (isolé 6/7, 86%) : cascade
    **22/25, INCHANGÉ, 0 flip** — la règle est entièrement redondante
    avec la cascade actuelle sur ces 7 cas, n'apporte rien de neuf.
    Neutre mais inutile, pas intégré.
  - **M6+M12 (harmonieux+dissonant)→M7** (isolé 3/4, 75%) : cascade
    **22/25 au total mais 2 flips qui s'annulent** (répare Fenerbahçe-
    Napoli, casse PSV-Bayern) — pas un gain net propre, rejeté malgré
    le compteur stable.
  **Conclusion** : sur les 6 axes d'opposition testés en interaction,
  **seul M2+M8 a montré un gain net propre (+1, zéro régression)** —
  déjà intégré. Aucune autre paire de maisons ne mérite d'être ajoutée
  à la cascade en l'état des données actuelles.
- **Reformulation utilisateur des axes (19/07/26)** : "je crois que axe
  m12,6 est lié aux incidents, axe m3,9 est lié aux rythme du match,
  axe m5,11 a la Capacité de marquages". Vérification : M6/M12
  (incidents) correspond déjà à `detectIncidentChaotique` (Cauda
  Draconis/Tristitia/Carcer/Amissio en M6 OU M12 comme signal
  incident/penalty) — doctrine DÉJÀ établie et intégrée. M5/M11
  (capacité de marquage) correspond déjà à `paralysieV7` sur M5/M11 qui
  fixe le `goalCap` utilisé dans `calculerButsCamp`/verdictV7 — doctrine
  DÉJÀ établie et intégrée. Les deux intuitions étaient donc déjà
  couvertes par du code existant, sans rien à ajouter. Reste M3+M9
  (rythme) comme piste réellement nouvelle, testée ci-dessous.
- **M3+M9 comme prédicteur du "rythme" du match (19/07/26) — REJETÉ,
  motif contredit par les données réelles.** Rythme défini par
  l'utilisateur comme "pression attaque par contre-attaque, beaucoup
  d'occasions de corner, pas d'arrêts de jeu" — aucune donnée aussi
  granulaire n'existe dans l'archive JSON ni dans le code (pas de
  tracking corner/pressing/stoppage-time par minute). Faute de mieux,
  testé le nombre de buts total comme proxy grossier du rythme :
  - **Archive complète** : corrélation harmonie(M3)+harmonie(M9) vs
    buts totaux = **r=0,176** — faible/non concluant à lui seul.
  - **4 vrais matchs avec données minute-par-minute fournies par
    l'utilisateur**, testés comme validation supplémentaire :

    | Match | Thème | M3 | M9 | Catégorie | Buts réels | Timing |
    |---|---|---|---|---|---|---|
    | St. Louis vs Sporting KC | conjunctio/via/puella/puer | Puella (40, dissonant) | Carcer (70, harmonieux) | dis+harm | 3-2 (5 buts) | serré (15',30',43',75',86'+pen) |
    | USA vs Belgique | via/caput_draconis/conjunctio/rubeus | Conjunctio (70, harm) | Laetitia (70, harm) | **harm+harm** | 1-4 (5 buts) | serré (15',30',30',60',75') |
    | France vs Espagne | fortuna_minor/albus/amissio/via | Amissio (40, dis) | Cauda Draconis (40, dis) | dis+dis | 0-2 (2 buts) | espacé (20',60', écart 40mn) |
    | Vitesse vs AEK Athènes | carcer/fortuna_major/populus/puer | Populus (60, harm) | Amissio (70, harm) | **harm+harm** | 0-0 (0 but, 22 tirs) | — |

    Sur les 3 premiers cas, un motif semblait émerger (dis+dis = rythme
    bas/espacé, harm+harm et dis+harm = rythme élevé/serré). Le 4e cas
    (Vitesse-AEK) **contredit directement** ce motif : même catégorie
    exacte "harm+harm" que USA-Belgique, mais résultat opposé (0 but vs
    5 buts) malgré un volume de tirs élevé (22) qui montre que le match
    n'était pas "fermé" en soi — juste inefficace/mal fini. Deux cas
    harm+harm ne peuvent pas prédire à la fois 5 buts et 0 but : le
    motif ne tient pas.
  - **Conclusion** : M3+M9 en l'état (harmonie/dissonance simple,
    proxy = nombre de buts) **ne prédit pas le rythme du match** — piste
    **REJETÉE**, cohérent avec la faible corrélation archive (r=0,176).
    Ne pas retester cette opérationnalisation précise sans un nouvel
    angle : soit une vraie donnée de rythme (corners/tirs par tranche de
    temps, arrêts de jeu réels) plutôt que le nombre de buts comme proxy,
    soit une définition différente de ce que M3/M9 pourraient représenter.
  - **Piste dérivée testée (19/07/26) : Populus en M3 spécifiquement**
    (figure "vide/neutre" — Vitesse-AEK avait M3=Populus et 0 but).
    **Intestable sur l'archive : 0/27 matchs archive n'ont Populus en
    M3** — Vitesse-AEK reste le seul cas connu, aucune comparaison
    possible. Élargi à "Populus n'importe où dans le thème (16
    positions)" : 16/27 matchs l'ont, moyenne **7,06 buts** contre
    **6,09 buts** pour les 11/27 qui ne l'ont pas — légèrement
    l'INVERSE de l'hypothèse (à nuancer : archive dominée par de
    l'esport à score élevé). Note pour mémoire : `BUTS_FIGURE` traite
    déjà Populus comme `{min:0, max:0}` (aucune capacité de marquage
    garantie) mais cette table s'applique aux maisons de capacité de
    marquage M4/M5/M10/M11, pas à M3/M9 — doctrine déjà en place,
    rien à étendre à M3/M9 sans données supplémentaires. Rejeté par
    absence de données exploitables, pas retesté sans nouveaux vrais
    matchs avec Populus en M3.
  - **Piste dérivée testée (19/07/26) : relation algébrique croisée
    M3↔M9 repérée sur Vitesse-AEK, hypothèse utilisateur** — "M9 son
    résultante Conjunctio est antagoniste direct de la figure que
    Populus a binômée [par lookup inverse dans `BINOMES_V7`, soit
    Puella], et résultante M3 est antagoniste direct de la figure de
    base M9 [Amissio]". **Les deux relations sont exactes pour ce
    thème précis** (vérifié : résultante(M3)=Caput Draconis=
    antagoniste(Amissio) ; résultante(M9)=Conjunctio=
    antagoniste(Puella)). Mais testées comme identité générale sur
    les **65 536 thèmes possibles** (16⁴ combinaisons de mères, via
    `buildThemeFromMothers`) : chacune des deux relations n'est vraie
    que sur **4096/65536 = 6,3%** des cas — exactement **1/16**, le
    taux attendu par pur hasard (résultante = une figure parmi 16,
    coïncidence de tomber juste). Les deux relations en même temps :
    1,6%. Contrairement à la loi M8 (`résultante(M8) =
    antagoniste(antagoniste(binôme(base)))`, validée 16/16 = 100% —
    voir §6 Constat 12), **ceci n'est PAS une identité algébrique
    cachée** — c'est une coïncidence propre à Vitesse-AEK, pas une loi
    généralisable. Rejeté, aucun changement de code. Leçon
    méthodologique : une relation combine/antagoniste/binôme repérée
    sur UN thème doit systématiquement être testée sur l'espace complet
    des thèmes avant d'être crue être une loi (comme pour M8/M16) —
    le taux de base "hasard" pour ce type de test est 1/16 (6,25%), à
    garder en tête comme seuil de comparaison.
  - **Élargissement à l'axe M5↔M11 (19/07/26, demande utilisateur)** :
    mêmes relations testées sur cet axe (capacité de marquage,
    `paralysieV7`), dans les deux sens possibles (4 variantes :
    résultante(M11)=antagoniste(reverseBinôme(baseM5)),
    résultante(M5)=antagoniste(baseM11), et les 2 variantes inverses).
    **Résultat identique sur les 65 536 thèmes : les 4 variantes
    tombent toutes exactement à 4096/65536 = 6,3% = 1/16**, le même
    taux de pur hasard que sur M3↔M9. Confirme et généralise la
    conclusion : ce type de relation croisée résultante↔antagoniste↔
    binôme-inverse n'est structurellement vraie sur AUCUN axe
    d'opposition testé à ce jour — seule la loi M8 (16/16, un seul
    décalage constant, voir Constat 12) est une véritable identité
    algébrique. Rejeté, aucun changement de code.
  - **⚠️ GAP OUVERT identifié (19/07/26, "il y a blocage quelque part")
    sur Vitesse-AEK — NON RÉSOLU, thème gardé pour y revenir.** En
    revérifiant ce thème (carcer/fortuna_major/populus/puer) contre la
    cascade actuelle : `verdictFinal` prédit **5-3** (score exact),
    réel **0-0** malgré 22 tirs — miss net sur le vainqueur ET sur le
    volume de buts. Aucun mécanisme de blocage existant ne s'est
    déclenché pour expliquer ce silence total : `figureBloqueeParAntagonisteV7`
    = false sur M4/M5/M10/M11, `figureBloqueeIncompatibiliteMaisonV7` =
    false partout, `paralysieV7` = non paralysée sur M5 ET M11. Le
    calcul brut `calculerButsCamp` donne même 5 vs 2 (bien au-dessus du
    réel). **Conclusion : il existe un vrai trou de doctrine — un
    thème peut rester à 0-0 malgré un volume de tirs élevé sans qu'aucun
    signal de blocage actuel ne le capture.** Piste explicitement mise
    en pause par l'utilisateur ("garde ce thème, on y revient") — pas
    encore de maison/mécanisme candidat identifié, à reprendre plus tard
    (explorer les 16 maisons du thème complet, ou une maison précise si
    l'utilisateur en a une en tête).
  - **Piste testée pour combler le gap : M12=Carcer sur Vitesse-AEK
    (19/07/26, "teste sur un match pour voir impact")** — suite à la
    découverte de la règle de direction du palier binaire de M12
    (ci-dessus), calcul concret sur Vitesse-AEK : base M12 = **Carcer**
    (sens doctrinal `FIGURE_MEANINGS_PERSO` : *"Blocage, restriction,
    retard ou enfermement"*, littéralement), résultante = **Amissio**
    ("Perte, séparation, ce qui s'en va"). Les deux figures ont un
    `BUTS_FIGURE` quasi nul (Carcer 0-0, Amissio 0-1 avec `concede`) —
    coïncidence narrative séduisante avec le 0-0 réel. **Mais rejetée
    sur l'archive complète** : Carcer précisément en M12 n'apparaît que
    sur **2 matchs archive, tous deux à FORT volume de buts (7 et 10)**
    — l'inverse de l'hypothèse. Figure "incident" (Cauda Draconis/
    Tristitia/Carcer/Amissio, déjà doctrine `detectIncidentChaotique`)
    en base M12 : n=7, 5,57 buts contre 7,05 sans — léger, mais déjà
    couvert par le mécanisme existant, rien de neuf. **Base ET
    résultante toutes deux à 0 but garanti (situation exacte de
    Vitesse-AEK) : 0 cas dans l'archive** — intestable, même limite que
    Populus en M3 (voir plus haut). Rejeté, aucun changement de code —
    le gap M12/Carcer reste donc ouvert, cette piste précise ne
    l'explique pas.
  - **Piste testée : M6 sur Vitesse-AEK (19/07/26, "teste m6")** — sur
    ce thème, `forceMaisonV7('tristitia', 6)` renvoie **`level:
    'blocage'`, `role: 'Blocage'`** (incompatibilité élémentaire
    terre/air, force=20) — contrairement au cas M12/Carcer ci-dessus,
    ce n'est pas une coïncidence de texte : c'est le vrai palier
    "blocage" déjà codé dans `forceMaisonV7` (concordance élémentaire
    §2420). Testé sur l'archive complète (27 matchs) si ce niveau
    `level==='blocage'` corrèle avec moins de buts :
    - **`level==='blocage'` sur M6 précisément** : n=8, moyenne **5,5
      buts**, contre **7,16 buts** pour les 19 matchs sans blocage sur
      M6 — écart réel, dans le bon sens.
    - **`level==='blocage'` sur M12** : n=4, moyenne **10,25 buts**
      contre 6,04 sans — dans le sens INVERSE, confirme que ce n'est
      pas un effet symétrique de l'axe M6↔M12, seulement M6.
    - **`level==='blocage'` sur les maisons de capacité de marquage
      (M4/M5/M10/M11)** : n=10, 6,0 buts contre 7,06 sans — léger écart
      dans le bon sens, plus faible que M6 seul.
    - **Corrélation globale (nombre total de maisons en blocage, toutes
      maisons confondues, vs buts totaux) : r=0,056** — quasi nulle,
      confirme que l'effet n'est PAS un effet générique du blocage
      partout, seulement localisé sur M6.
    **Conclusion : signal réel mais faible, spécifique à M6, non
    intégrable en l'état** (échantillon modeste 8 vs 19, archive
    dominée par de l'esport à score élevé) — nettement plus solide que
    la piste M12/Carcer (qui allait dans le mauvais sens), mais pas
    assez net pour trancher le gap Vitesse-AEK à lui seul (Vitesse-AEK
    a M6 en blocage ET reste à 0-0, cohérent avec la direction du
    signal, mais un seul cas réel ne suffit pas). Aucun changement de
    code — piste à garder en tête pour de futurs vrais matchs avec M6
    en blocage.
    **Table complète des 27 matchs (triés par buts croissants)** :

    | Match | Score réel | Buts | M6 blocage ? | Maisons en blocage |
    |---|---|---|---|---|
    | Ferencvárosi vs Qarabag | 1-0 | 1 | non | M8 |
    | Ferencvárosi vs Qarabag | 1-0 | 1 | **OUI** | M6 |
    | Autriche vs Espagne | 0-3 | 3 | non | M4 |
    | Côte d'Ivoire vs Norvège | 1-2 | 3 | non | M4 |
    | FK Jenis vs Astana | 2-2 | 4 | **OUI** | M2, M6, M8, M10 |
    | Argentine vs Egypte | 3-2 | 5 | **OUI** | M6 |
    | Manchester City F.C. vs Napoli | 3-2 | 5 | **OUI** | M2, M4, M6, M8 |
    | Chelsea vs Napoli | 2-3 | 5 | non | M4, M8 |
    | Dorussia Dortmund vs Roma | 3-2 | 5 | non | — |
    | Lombardia vs Borussia Dortmund | 1-5 | 6 | non | M10 |
    | Chelsea F.C. vs Barcelone | 4-2 | 6 | **OUI** | M2, M6 |
    | Roma vs Napoli | 3-3 | 6 | **OUI** | M6 |
    | Lombardia vs Roma | 6-1 | 7 | non | M14, M16 |
    | Fenerbahçe S.K. vs Galatasaray S.K. | 5-2 | 7 | **OUI** | M4, M6 |
    | Bayern Munich vs Fenerbahçe | 5-2 | 7 | non | — |
    | Real Madrid vs Club Atlético de Madrid | 5-2 | 7 | non | M2, M8, M10 |
    | Manchester City vs Borussia Dortmund | 4-3 | 7 | non | M2, M16 |
    | Arsenal vs Barcelone | 4-3 | 7 | non | M2, M8 |
    | Club Atlético de Madrid vs Napoli | 5-3 | 8 | non | M8 |
    | PSV Eindhoven vs Bayern Munich | 5-3 | 8 | non | M8, M12, M16 |
    | Dorussia Dortmund vs Lombardia | 2-6 | 8 | non | — |
    | Fenerbahçe S.K. vs Napoli | 4-6 | 10 | non | M8, M12, M16 |
    | Liverpool F.C. vs Lombardia | 7-3 | 10 | non | M16 |
    | West Ham United vs Liverpool | 4-6 | 10 | **OUI** | M2, M4, M6 |
    | Wolverhampton vs Arsenal | 4-6 | 10 | non | M10, M12, M14 |
    | Olympique Lyonnais vs Real Madrid | 4-7 | 11 | non | — |
    | Manchester City F.C. vs Juventus FC | 5-8 | 13 | non | M12 |

    Lecture : les 8 matchs "M6 blocage" se concentrent plutôt en haut
    du tableau (1 à 10 buts, majorité ≤7), mais West Ham-Liverpool (10
    buts) casse la tendance — cohérent avec un signal réel mais pas
    assez net pour être fiable seul.
  - **Piste testée : M4 (19/07/26, "teste m4")** — sur Vitesse-AEK, M4
    N'EST PAS en blocage : base Puer, `forceMaisonV7` renvoie `level:
    'compatible_70'`, rôle "Stabilisateur" (contrairement à M6, en vrai
    blocage terre/air). M4 n'ajoute donc rien pour expliquer le 0-0 sur
    CE match précis. Mais testé archive-wide par cohérence avec M6 :
    - **`level==='blocage'` sur M4** : n=6, moyenne **5,5 buts** contre
      **7,0** sans (n=21) — même magnitude d'écart que M6 (5,5 vs
      7,16), dans le même sens.
    - **Puer précisément en M4** (juste la figure de base réelle de
      Vitesse-AEK, sans rapport au blocage) : n=3, 7,0 buts contre
      6,625 sans — aucun signal, plutôt l'inverse.
    **Conclusion** : le "blocage élémentaire" (terre/air) montre un
    effet modeste et cohérent à la fois sur M4 et M6 (même magnitude),
    ce qui renforce un peu la piste générale "blocage → moins de buts"
    sur les maisons de capacité de marquage — mais sur Vitesse-AEK
    spécifiquement, seul M6 se déclenche, pas M4. N'explique pas
    entièrement le 0-0 à lui seul. Aucun changement de code.

### Cartographie complète des 16 figures × 16 maisons (19/07/26, projet en cours)

Demande utilisateur : "il faut qu'on analyse bien la cartographie
totale des 16 figures dans toutes les maisons un par un, et d'en
déduire la conséquence. on va travailler sur un tableau." Objectif :
pour CHAQUE maison (M1 à M16), documenter les 16 résultantes possibles
(une par figure de base), leur niveau d'harmonie (`forceMaisonV7`), et
en déduire toute conséquence exploitable (déjà connue ou nouvelle).
Beaucoup de maisons individuelles ont déjà été couvertes plus haut
dans ce §6 (lois de décalage, blocage, involutions...) — cette section
consolide/complète la démarche maison par maison avec le niveau
d'harmonie systématique, en commençant par M1.

**M1 (le chef, figure naturelle = Puer)** :

**Légende des colonnes ajoutées (19/07/26, demande utilisateur)** :
**O-D** (Auto-Destruction) = la résultante coïncide avec l'antagoniste
de la figure de base ; **O-C** (Auto-Construction) = la résultante
coïncide avec le binôme de la figure de base. Fig-Base = figure de
base, R-M1 = résultante en M1.

| Fig-Base | R-M1 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Populus | Caput Draconis | Puella | — | — | repos_forte | 100 |
| Laetitia | Acquisitio | Albus | Acquisitio | ✅ | — | compatible_70 | 70 |
| Caput Draconis | Amissio | Via | Populus | — | — | chaotique | 40 |
| Albus | Via | Amissio | Puer | — | — | chaotique | 40 |
| Via | Albus | Rubeus | Laetitia | — | — | chaotique | 40 |
| Amissio | Caput Draconis | Tristitia | Caput Draconis | ✅ | — | compatible_70 | 70 |
| Rubeus | Carcer | Fortuna Minor | Albus | — | — | semi_compatible | 60 |
| Tristitia | Fortuna Minor | Carcer | Via | — | — | compatible_90 | 90 |
| Fortuna Minor | Tristitia | Conjunctio | Amissio | — | — | semi_compatible | 60 |
| Carcer | Rubeus | Fortuna Major | Rubeus | ✅ | — | compatible_70 | 70 |
| Conjunctio | Puella | Cauda Draconis | Tristitia | — | — | semi_compatible | 60 |
| Fortuna Major | Cauda Draconis | Puella | Fortuna Minor | — | — | chaotique | 40 |
| Cauda Draconis | Fortuna Major | Acquisitio | Carcer | — | — | semi_compatible | 60 |
| Puella | Conjunctio | Populus | Conjunctio | ✅ | — | compatible_70 | 70 |
| Acquisitio | Laetitia | Puer | Fortuna Major | — | — | compatible_90 | 90 |
| Populus | Puer | Laetitia | Cauda Draconis | — | — | compatible_90 | 90 |

Répartition des niveaux : 1 repos_forte, 4 compatible_70, 4 chaotique,
4 semi_compatible, 3 compatible_90 — **aucun niveau "blocage" possible
en M1** (M1 est feu ; le blocage vient d'une incompatibilité terre/air,
jamais présente ici, contrairement à M6/M2 sur Vitesse-AEK).
**4 cas O-D** (Laetitia, Amissio, Carcer, Puella), **0 cas O-C**. Fait
notable à vérifier sur les autres maisons : les 4 O-D sont
EXACTEMENT les 4 figures classées "compatible_70", rien d'autre —
possible coïncidence ou vrai motif structurel, à confirmer.

**Conséquence** (déjà établie plus haut, "M1 et M7 testés directement") :
harmonie de M1 (force≥60, couvre 12/16 figures — tout sauf les 4
"chaotique" Caput Draconis/Albus/Via/Fortuna Major) corrélée à SA
PROPRE victoire dans le sens intuitif — M1 harmonieux → M1 gagne 65%
(13/20 archive) contre 40% si dissonant. C'est la seule maison, avec
M7, où l'harmonie se lit dans le sens attendu plutôt que le paradoxe
inverse observé sur les maisons satellites (M2-M15, voir plus haut).
Cohérent avec le rôle de M1 comme chef décisionnel plutôt que maison
d'observation.

**M2 (figure naturelle = Laetitia)** :

| Fig-Base | R-M2 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Acquisitio | Caput Draconis | Puella | — | — | compatible_90 | 90 |
| Laetitia | Populus | Albus | Acquisitio | — | — | repos_moyen_fort | 75 |
| Caput Draconis | Via | Via | Populus | — | ✅ | semi_compatible | 60 |
| Albus | Amissio | Amissio | Puer | — | ✅ | semi_compatible | 60 |
| Via | Caput Draconis | Rubeus | Laetitia | — | — | compatible_90 | 90 |
| Amissio | Albus | Tristitia | Caput Draconis | — | — | semi_compatible | 60 |
| Rubeus | Fortuna Minor | Fortuna Minor | Albus | — | ✅ | compatible_70 | 70 |
| Tristitia | Carcer | Carcer | Via | — | ✅ | blocage | 20 |
| Fortuna Minor | Rubeus | Conjunctio | Amissio | — | — | compatible_90 | 90 |
| Carcer | Tristitia | Fortuna Major | Rubeus | — | — | blocage | 20 |
| Conjunctio | Cauda Draconis | Cauda Draconis | Tristitia | — | ✅ | semi_compatible | 60 |
| Fortuna Major | Puella | Puella | Fortuna Minor | — | ✅ | blocage | 20 |
| Cauda Draconis | Conjunctio | Acquisitio | Carcer | — | — | compatible_90 | 90 |
| Puella | Fortuna Major | Populus | Conjunctio | — | — | blocage | 20 |
| Acquisitio | Puer | Puer | Fortuna Major | — | ✅ | compatible_70 | 70 |
| Populus | Laetitia | Laetitia | Cauda Draconis | — | ✅ | compatible_70 | 70 |

**Inversion frappante par rapport à M1** : **0 O-D, mais 8 O-C**
(exactement la moitié). Directement expliqué par la loi de M2 déjà
établie (§6, "Extension à M2") : M2 a un décalage de magnitude ±1 dans
sa boucle de binôme — un décalage de "+1" dans cette boucle EST
littéralement le binôme lui-même. La moitié des figures (côté "+1")
tombe donc automatiquement en O-C, l'autre moitié (côté "-1", inverse
du binôme) ne matche jamais l'antagoniste non plus (0 O-D). 4 cas
"blocage" (Tristitia, Carcer, Fortuna Major, Puella), contre 0 en M1.

**M3 (figure naturelle = Caput Draconis)** :

| Fig-Base | R-M3 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Amissio | Caput Draconis | Puella | — | — | compatible_90 | 90 |
| Laetitia | Via | Albus | Acquisitio | — | — | compatible_90 | 90 |
| Caput Draconis | Populus | Via | Populus | ✅ | — | repos_moyen | 50 |
| Albus | Acquisitio | Amissio | Puer | — | — | semi_compatible | 60 |
| Via | Laetitia | Rubeus | Laetitia | ✅ | — | chaotique | 40 |
| Amissio | Puer | Tristitia | Caput Draconis | — | — | chaotique | 40 |
| Rubeus | Fortuna Major | Fortuna Minor | Albus | — | — | compatible_70 | 70 |
| Tristitia | Conjunctio | Carcer | Via | — | — | semi_compatible | 60 |
| Fortuna Minor | Puella | Conjunctio | Amissio | — | — | compatible_70 | 70 |
| Carcer | Cauda Draconis | Fortuna Major | Rubeus | — | — | compatible_90 | 90 |
| Conjunctio | Tristitia | Cauda Draconis | Tristitia | ✅ | — | compatible_70 | 70 |
| Fortuna Major | Rubeus | Puella | Fortuna Minor | — | — | semi_compatible | 60 |
| Cauda Draconis | Carcer | Acquisitio | Carcer | ✅ | — | compatible_70 | 70 |
| Puella | Fortuna Minor | Populus | Conjunctio | — | — | chaotique | 40 |
| Acquisitio | Albus | Puer | Fortuna Major | — | — | compatible_90 | 90 |
| Populus | Caput Draconis | Laetitia | Cauda Draconis | — | — | semi_compatible | 60 |

**Motif proche de M1** : 4 O-D (Caput Draconis, Via, Conjunctio, Cauda
Draconis), 0 O-C — cohérent avec le fait que M3, comme M1, est du
palier à décalage impair (traverse toujours vers l'autre boucle de
binôme, ce qui rend O-C impossible dans cette configuration). 0
"blocage" (M3=air, aucune résultante terre incompatible dans cette
liste). Cas particulier : Caput Draconis est à la fois "au repos"
(base=figure naturelle) ET en O-D (coïncidence : au repos, résultante
=Populus toujours par l'identité déjà établie, et antagoniste(Caput
Draconis)=Populus aussi).

**M4 (figure naturelle = Albus)** :

| Fig-Base | R-M4 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Via | Caput Draconis | Puella | — | — | compatible_70 | 70 |
| Laetitia | Amissio | Albus | Acquisitio | — | — | compatible_70 | 70 |
| Caput Draconis | Acquisitio | Via | Populus | — | — | blocage | 20 |
| Albus | Populus | Amissio | Puer | — | — | repos_moyen_fort | 75 |
| Via | Puer | Rubeus | Laetitia | — | — | semi_compatible | 60 |
| Amissio | Laetitia | Tristitia | Caput Draconis | — | — | semi_compatible | 60 |
| Rubeus | Conjunctio | Fortuna Minor | Albus | — | — | blocage | 20 |
| Tristitia | Fortuna Major | Carcer | Via | — | — | compatible_90 | 90 |
| Fortuna Minor | Cauda Draconis | Conjunctio | Amissio | — | — | compatible_70 | 70 |
| Carcer | Puella | Fortuna Major | Rubeus | — | — | compatible_90 | 90 |
| Conjunctio | Rubeus | Cauda Draconis | Tristitia | — | — | blocage | 20 |
| Fortuna Major | Tristitia | Puella | Fortuna Minor | — | — | compatible_90 | 90 |
| Cauda Draconis | Fortuna Minor | Acquisitio | Carcer | — | — | semi_compatible | 60 |
| Puella | Carcer | Populus | Conjunctio | — | — | compatible_90 | 90 |
| Acquisitio | Caput Draconis | Puer | Fortuna Major | — | — | blocage | 20 |
| Populus | Albus | Laetitia | Cauda Draconis | — | — | compatible_70 | 70 |

**ZÉRO O-D et ZÉRO O-C** — premier cas de la série. Cohérent avec la
loi déjà établie : M4 a une magnitude de décalage ±2 dans sa boucle de
binôme (ni ±1 comme M2, qui donne du O-C, ni le "traverse toujours" de
M1/M3, qui donne du O-D) — un écart de 2 ne coïncide ni avec le binôme
(écart 1) ni avec l'antagoniste (permutation totalement différente,
cycle de 16 distinct). 4 cas "blocage" (Caput Draconis, Rubeus,
Conjunctio, Acquisitio).

**M5 (figure naturelle = Via, palier "8 voies" le moins prévisible)** :

| Fig-Base | R-M5 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Albus | Caput Draconis | Puella | — | — | chaotique | 40 |
| Laetitia | Caput Draconis | Albus | Acquisitio | — | — | compatible_70 | 70 |
| Caput Draconis | Laetitia | Via | Populus | — | — | compatible_90 | 90 |
| Albus | Puer | Amissio | Puer | ✅ | — | compatible_90 | 90 |
| Via | Populus | Rubeus | Laetitia | — | — | repos_faible | 25 |
| Amissio | Acquisitio | Tristitia | Caput Draconis | — | — | compatible_70 | 70 |
| Rubeus | Puella | Fortuna Minor | Albus | — | — | semi_compatible | 60 |
| Tristitia | Cauda Draconis | Carcer | Via | — | — | chaotique | 40 |
| Fortuna Minor | Fortuna Major | Conjunctio | Amissio | — | — | semi_compatible | 60 |
| Carcer | Conjunctio | Fortuna Major | Rubeus | — | — | compatible_70 | 70 |
| Conjunctio | Carcer | Cauda Draconis | Tristitia | — | — | semi_compatible | 60 |
| Fortuna Major | Fortuna Minor | Puella | Fortuna Minor | ✅ | — | compatible_90 | 90 |
| Cauda Draconis | Tristitia | Acquisitio | Carcer | — | — | semi_compatible | 60 |
| Puella | Rubeus | Populus | Conjunctio | — | — | compatible_70 | 70 |
| Acquisitio | Amissio | Puer | Fortuna Major | — | — | chaotique | 40 |
| Populus | Via | Laetitia | Cauda Draconis | — | — | chaotique | 40 |

**2 O-D** (Albus, Fortuna Major), **0 O-C** — cohérent avec le palier
"8 voies" de M5 (décalages tous impairs, traverse toujours la boucle
comme M1/M3, donc O-C structurellement impossible), mais le nombre
d'O-D est plus faible qu'en M1/M3 (2 au lieu de 4) puisque M5 a 8
magnitudes de décalage différentes au lieu de 2 — moins de chances de
tomber pile sur la relation antagoniste par hasard. 0 "blocage".

**M6 (figure naturelle = Amissio)** :

| Fig-Base | R-M6 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Caput Draconis | Caput Draconis | Puella | — | ✅ | compatible_90 | 90 |
| Laetitia | Albus | Albus | Acquisitio | — | ✅ | semi_compatible | 60 |
| Caput Draconis | Puer | Via | Populus | — | — | compatible_70 | 70 |
| Albus | Laetitia | Amissio | Puer | — | — | compatible_70 | 70 |
| Via | Acquisitio | Rubeus | Laetitia | — | — | compatible_90 | 90 |
| Amissio | Populus | Tristitia | Caput Draconis | — | — | repos_moyen | 50 |
| Rubeus | Cauda Draconis | Fortuna Minor | Albus | — | — | semi_compatible | 60 |
| Tristitia | Puella | Carcer | Via | — | — | blocage | 20 |
| Fortuna Minor | Conjunctio | Conjunctio | Amissio | — | ✅ | compatible_90 | 90 |
| Carcer | Fortuna Major | Fortuna Major | Rubeus | — | ✅ | blocage | 20 |
| Conjunctio | Fortuna Minor | Cauda Draconis | Tristitia | — | — | compatible_70 | 70 |
| Fortuna Major | Carcer | Puella | Fortuna Minor | — | — | blocage | 20 |
| Cauda Draconis | Rubeus | Acquisitio | Carcer | — | — | compatible_90 | 90 |
| Puella | Tristitia | Populus | Conjunctio | — | — | blocage | 20 |
| Acquisitio | Via | Puer | Fortuna Major | — | — | semi_compatible | 60 |
| Populus | Amissio | Laetitia | Cauda Draconis | — | — | semi_compatible | 60 |

**0 O-D, 4 O-C** (Puer, Laetitia, Fortuna Minor, Carcer). **4 cas
"blocage" — EXACTEMENT les mêmes 4 figures qu'en M2** (Tristitia,
Carcer, Fortuna Major, Puella). Confirme directement ce qui avait été
trouvé sur Vitesse-AEK (M2=Fortuna Major et M6=Tristitia, les deux en
blocage sur ce match, voir plus haut) : ce n'était pas une coïncidence
isolée — M2 et M6 partagent EXACTEMENT le même ensemble de 4 figures
"à risque de blocage".

**M7 (l'autre chef, figure naturelle = Rubeus)** :

| Fig-Base | R-M7 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Carcer | Caput Draconis | Puella | — | — | compatible_70 | 70 |
| Laetitia | Fortuna Minor | Albus | Acquisitio | — | — | chaotique | 40 |
| Caput Draconis | Fortuna Major | Via | Populus | — | — | compatible_70 | 70 |
| Albus | Conjunctio | Amissio | Puer | — | — | semi_compatible | 60 |
| Via | Puella | Rubeus | Laetitia | — | — | compatible_70 | 70 |
| Amissio | Cauda Draconis | Tristitia | Caput Draconis | — | — | compatible_90 | 90 |
| Rubeus | Populus | Fortuna Minor | Albus | — | — | repos_moyen | 50 |
| Tristitia | Acquisitio | Carcer | Via | — | — | semi_compatible | 60 |
| Fortuna Minor | Laetitia | Conjunctio | Amissio | — | — | chaotique | 40 |
| Carcer | Puer | Fortuna Major | Rubeus | — | — | chaotique | 40 |
| Conjunctio | Albus | Cauda Draconis | Tristitia | — | — | compatible_90 | 90 |
| Fortuna Major | Caput Draconis | Puella | Fortuna Minor | — | — | semi_compatible | 60 |
| Cauda Draconis | Amissio | Acquisitio | Carcer | — | — | compatible_90 | 90 |
| Puella | Via | Populus | Conjunctio | — | — | compatible_90 | 90 |
| Acquisitio | Tristitia | Puer | Fortuna Major | — | — | compatible_70 | 70 |
| Populus | Rubeus | Laetitia | Cauda Draconis | — | — | semi_compatible | 60 |

**ZÉRO O-D et ZÉRO O-C** — comme M4, mais pour une raison différente :
M7 traverse aussi toujours la boucle de binôme (décalages impairs
{7,9}, donc O-C structurellement impossible comme M1/M3/M5), mais
contrairement à eux, sa magnitude de décalage (7 ou 9) ne coïncide
avec l'antagoniste d'aucune figure — donc 0 O-D aussi, pas seulement 0
O-C. 0 "blocage" (M7 est air).

**M8 (le "palier pur", figure naturelle = Tristitia)** :

| Fig-Base | R-M8 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Fortuna Minor | Caput Draconis | Puella | — | — | semi_compatible | 60 |
| Laetitia | Carcer | Albus | Acquisitio | — | — | compatible_90 | 90 |
| Caput Draconis | Conjunctio | Via | Populus | — | — | blocage | 20 |
| Albus | Fortuna Major | Amissio | Puer | — | — | compatible_90 | 90 |
| Via | Cauda Draconis | Rubeus | Laetitia | — | — | compatible_70 | 70 |
| Amissio | Puella | Tristitia | Caput Draconis | — | — | compatible_90 | 90 |
| Rubeus | Acquisitio | Fortuna Minor | Albus | — | — | blocage | 20 |
| Tristitia | Populus | Carcer | Via | — | — | repos_forte | 100 |
| Fortuna Minor | Puer | Conjunctio | Amissio | — | — | semi_compatible | 60 |
| Carcer | Laetitia | Fortuna Major | Rubeus | — | — | semi_compatible | 60 |
| Conjunctio | Caput Draconis | Cauda Draconis | Tristitia | — | — | blocage | 20 |
| Fortuna Major | Albus | Puella | Fortuna Minor | — | — | compatible_70 | 70 |
| Cauda Draconis | Via | Acquisitio | Carcer | — | — | compatible_70 | 70 |
| Puella | Amissio | Populus | Conjunctio | — | — | compatible_70 | 70 |
| Acquisitio | Rubeus | Puer | Fortuna Major | — | — | blocage | 20 |
| Populus | Tristitia | Laetitia | Cauda Draconis | — | — | compatible_90 | 90 |

**0 O-D, 0 O-C** — cohérent avec le décalage constant +4 de M8 (loi
pure, déjà établie), qui ne coïncide ni avec le binôme (écart 1) ni
avec l'antagoniste. **4 cas "blocage" — EXACTEMENT les mêmes 4
figures qu'en M4** (Caput Draconis, Rubeus, Conjunctio, Acquisitio).
Troisième paire de maisons (après M2/M6) à partager le même ensemble
exact de figures à risque de blocage.

**M9 (figure naturelle = Fortuna Minor)** :

| Fig-Base | R-M9 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Tristitia | Caput Draconis | Puella | — | — | semi_compatible | 60 |
| Laetitia | Rubeus | Albus | Acquisitio | — | — | compatible_70 | 70 |
| Caput Draconis | Puella | Via | Populus | — | — | semi_compatible | 60 |
| Albus | Cauda Draconis | Amissio | Puer | — | — | chaotique | 40 |
| Via | Fortuna Major | Rubeus | Laetitia | — | — | semi_compatible | 60 |
| Amissio | Conjunctio | Tristitia | Caput Draconis | — | — | compatible_70 | 70 |
| Rubeus | Laetitia | Fortuna Minor | Albus | — | — | compatible_90 | 90 |
| Tristitia | Puer | Carcer | Via | — | — | compatible_90 | 90 |
| Fortuna Minor | Populus | Conjunctio | Amissio | — | — | repos_forte | 100 |
| Carcer | Acquisitio | Fortuna Major | Rubeus | — | — | compatible_70 | 70 |
| Conjunctio | Amissio | Cauda Draconis | Tristitia | — | — | chaotique | 40 |
| Fortuna Major | Via | Puella | Fortuna Minor | — | — | chaotique | 40 |
| Cauda Draconis | Albus | Acquisitio | Carcer | — | — | chaotique | 40 |
| Puella | Caput Draconis | Populus | Conjunctio | — | — | compatible_70 | 70 |
| Acquisitio | Carcer | Puer | Fortuna Major | — | — | semi_compatible | 60 |
| Populus | Fortuna Minor | Laetitia | Cauda Draconis | — | — | compatible_90 | 90 |

**0 O-D, 0 O-C** — comme M4/M7/M8, décalages de M9 ({5,7,9,11}) ne
coïncident ni avec le binôme ni avec l'antagoniste d'aucune figure. 0
"blocage" aussi.

**M10 (figure naturelle = Carcer)** :

| Fig-Base | R-M10 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Rubeus | Caput Draconis | Puella | — | — | compatible_90 | 90 |
| Laetitia | Tristitia | Albus | Acquisitio | — | — | blocage | 20 |
| Caput Draconis | Cauda Draconis | Via | Populus | — | — | semi_compatible | 60 |
| Albus | Puella | Amissio | Puer | — | — | blocage | 20 |
| Via | Conjunctio | Rubeus | Laetitia | — | — | compatible_90 | 90 |
| Amissio | Fortuna Major | Tristitia | Caput Draconis | — | — | blocage | 20 |
| Rubeus | Puer | Fortuna Minor | Albus | — | — | compatible_70 | 70 |
| Tristitia | Laetitia | Carcer | Via | — | — | compatible_70 | 70 |
| Fortuna Minor | Acquisitio | Conjunctio | Amissio | — | — | compatible_90 | 90 |
| Carcer | Populus | Fortuna Major | Rubeus | — | — | repos_faible | 25 |
| Conjunctio | Via | Cauda Draconis | Tristitia | — | — | semi_compatible | 60 |
| Fortuna Major | Amissio | Puella | Fortuna Minor | — | — | semi_compatible | 60 |
| Cauda Draconis | Caput Draconis | Acquisitio | Carcer | — | — | compatible_90 | 90 |
| Puella | Albus | Populus | Conjunctio | — | — | semi_compatible | 60 |
| Acquisitio | Fortuna Minor | Puer | Fortuna Major | — | — | compatible_70 | 70 |
| Populus | Carcer | Laetitia | Cauda Draconis | — | — | blocage | 20 |

**0 O-D, 0 O-C** — même famille que M4/M7/M8/M9. **4 cas "blocage"
(Laetitia, Albus, Amissio, Populus) — un ENSEMBLE NOUVEAU**, différent
des deux paires déjà vues (M2/M6 = Tristitia/Carcer/Fortuna Major/
Puella ; M4/M8 = Caput Draconis/Rubeus/Conjunctio/Acquisitio). Pas de
partenaire connu pour l'instant.

**M11 (figure naturelle = Conjunctio)** :

| Fig-Base | R-M11 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Puella | Caput Draconis | Puella | ✅ | — | compatible_70 | 70 |
| Laetitia | Cauda Draconis | Albus | Acquisitio | — | — | compatible_90 | 90 |
| Caput Draconis | Tristitia | Via | Populus | — | — | compatible_70 | 70 |
| Albus | Rubeus | Amissio | Puer | — | — | semi_compatible | 60 |
| Via | Carcer | Rubeus | Laetitia | — | — | compatible_70 | 70 |
| Amissio | Fortuna Minor | Tristitia | Caput Draconis | — | — | chaotique | 40 |
| Rubeus | Albus | Fortuna Minor | Albus | ✅ | — | compatible_90 | 90 |
| Tristitia | Caput Draconis | Carcer | Via | — | — | semi_compatible | 60 |
| Fortuna Minor | Amissio | Conjunctio | Amissio | ✅ | — | compatible_90 | 90 |
| Carcer | Via | Fortuna Major | Rubeus | — | — | compatible_90 | 90 |
| Conjunctio | Populus | Cauda Draconis | Tristitia | — | — | repos_moyen | 50 |
| Fortuna Major | Acquisitio | Puella | Fortuna Minor | — | — | semi_compatible | 60 |
| Cauda Draconis | Laetitia | Acquisitio | Carcer | — | — | chaotique | 40 |
| Puella | Puer | Populus | Conjunctio | — | — | chaotique | 40 |
| Acquisitio | Fortuna Major | Puer | Fortuna Major | ✅ | — | compatible_70 | 70 |
| Populus | Conjunctio | Laetitia | Cauda Draconis | — | — | semi_compatible | 60 |

**4 O-D** (Puer, Rubeus, Fortuna Minor, Acquisitio), **0 O-C** —
cohérent avec le palier 4-voies à décalage impair de M11 (traverse
toujours, comme M1/M3/M9). 0 "blocage".

**M12 (figure naturelle = Fortuna Major)** :

| Fig-Base | R-M12 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Cauda Draconis | Caput Draconis | Puella | — | — | compatible_70 | 70 |
| Laetitia | Puella | Albus | Acquisitio | — | — | compatible_90 | 90 |
| Caput Draconis | Rubeus | Via | Populus | — | — | blocage | 20 |
| Albus | Tristitia | Amissio | Puer | — | — | compatible_90 | 90 |
| Via | Fortuna Minor | Rubeus | Laetitia | — | — | semi_compatible | 60 |
| Amissio | Carcer | Tristitia | Caput Draconis | — | — | compatible_90 | 90 |
| Rubeus | Caput Draconis | Fortuna Minor | Albus | — | — | blocage | 20 |
| Tristitia | Albus | Carcer | Via | — | — | compatible_70 | 70 |
| Fortuna Minor | Via | Conjunctio | Amissio | — | — | compatible_70 | 70 |
| Carcer | Amissio | Fortuna Major | Rubeus | — | — | compatible_70 | 70 |
| Conjunctio | Acquisitio | Cauda Draconis | Tristitia | — | — | blocage | 20 |
| Fortuna Major | Populus | Puella | Fortuna Minor | — | — | repos_forte | 100 |
| Cauda Draconis | Puer | Acquisitio | Carcer | — | — | semi_compatible | 60 |
| Puella | Laetitia | Populus | Conjunctio | — | — | semi_compatible | 60 |
| Acquisitio | Conjunctio | Puer | Fortuna Major | — | — | blocage | 20 |
| Populus | Fortuna Major | Laetitia | Cauda Draconis | — | — | compatible_90 | 90 |

**0 O-D, 0 O-C** — cohérent avec la magnitude ±2 déjà connue de M12
(miroir exact de M4). **4 cas "blocage" — EXACTEMENT le même ensemble
que M4 ET M8** (Caput Draconis, Rubeus, Conjunctio, Acquisitio). Ces
trois maisons (M4, M8, M12) partagent désormais toutes le même
quatuor de figures à risque de blocage.

**M13 (figure naturelle = Cauda Draconis, deuxième palier "8 voies" avec M5)** :

| Fig-Base | R-M13 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Fortuna Major | Caput Draconis | Puella | — | — | semi_compatible | 60 |
| Laetitia | Conjunctio | Albus | Acquisitio | — | — | compatible_70 | 70 |
| Caput Draconis | Carcer | Via | Populus | — | — | semi_compatible | 60 |
| Albus | Fortuna Minor | Amissio | Puer | — | — | compatible_90 | 90 |
| Via | Tristitia | Rubeus | Laetitia | — | — | semi_compatible | 60 |
| Amissio | Rubeus | Tristitia | Caput Draconis | — | — | compatible_70 | 70 |
| Rubeus | Amissio | Fortuna Minor | Albus | — | — | chaotique | 40 |
| Tristitia | Via | Carcer | Via | ✅ | — | chaotique | 40 |
| Fortuna Minor | Albus | Conjunctio | Amissio | — | — | chaotique | 40 |
| Carcer | Caput Draconis | Fortuna Major | Rubeus | — | — | compatible_70 | 70 |
| Conjunctio | Laetitia | Cauda Draconis | Tristitia | — | — | compatible_90 | 90 |
| Fortuna Major | Puer | Puella | Fortuna Minor | — | — | compatible_90 | 90 |
| Cauda Draconis | Populus | Acquisitio | Carcer | — | — | repos_faible | 25 |
| Puella | Acquisitio | Populus | Conjunctio | — | — | compatible_70 | 70 |
| Acquisitio | Puella | Puer | Fortuna Major | — | — | semi_compatible | 60 |
| Populus | Cauda Draconis | Laetitia | Cauda Draconis | ✅ | — | chaotique | 40 |

**2 O-D** (Tristitia, Populus), **0 O-C** — même profil que M5 (l'autre
palier 8-voies), cohérent avec ses 8 magnitudes de décalage
différentes. 0 "blocage".

**M14 (figure naturelle = Puella)** :

| Fig-Base | R-M14 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Conjunctio | Caput Draconis | Puella | — | — | compatible_90 | 90 |
| Laetitia | Fortuna Major | Albus | Acquisitio | — | — | blocage | 20 |
| Caput Draconis | Fortuna Minor | Via | Populus | — | — | compatible_70 | 70 |
| Albus | Carcer | Amissio | Puer | — | — | blocage | 20 |
| Via | Rubeus | Rubeus | Laetitia | — | ✅ | compatible_90 | 90 |
| Amissio | Tristitia | Tristitia | Caput Draconis | — | ✅ | blocage | 20 |
| Rubeus | Via | Fortuna Minor | Albus | — | — | semi_compatible | 60 |
| Tristitia | Amissio | Carcer | Via | — | — | semi_compatible | 60 |
| Fortuna Minor | Caput Draconis | Conjunctio | Amissio | — | — | compatible_90 | 90 |
| Carcer | Albus | Fortuna Major | Rubeus | — | — | semi_compatible | 60 |
| Conjunctio | Puer | Cauda Draconis | Tristitia | — | — | compatible_70 | 70 |
| Fortuna Major | Laetitia | Puella | Fortuna Minor | — | — | compatible_70 | 70 |
| Cauda Draconis | Acquisitio | Acquisitio | Carcer | — | ✅ | compatible_90 | 90 |
| Puella | Populus | Populus | Conjunctio | — | ✅ | repos_faible | 25 |
| Acquisitio | Cauda Draconis | Puer | Fortuna Major | — | — | semi_compatible | 60 |
| Populus | Puella | Laetitia | Cauda Draconis | — | — | blocage | 20 |

**0 O-D, 4 O-C** (Via, Amissio, Cauda Draconis, Puella). **4 cas
"blocage" — EXACTEMENT le même ensemble que M10** (Laetitia, Albus,
Amissio, Populus) — le partenaire de M10 trouvé.

**M15 (figure naturelle = Acquisitio, "Le Juge" — déjà couvert en
détail plus haut, table O-D/O-C ajoutée ici par cohérence)** :

| Fig-Base | R-M15 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Laetitia | Caput Draconis | Puella | — | — | chaotique | 40 |
| Laetitia | Puer | Albus | Acquisitio | — | — | chaotique | 40 |
| Caput Draconis | Albus | Via | Populus | — | — | compatible_90 | 90 |
| Albus | Caput Draconis | Amissio | Puer | — | — | semi_compatible | 60 |
| Via | Amissio | Rubeus | Laetitia | — | — | compatible_90 | 90 |
| Amissio | Via | Tristitia | Caput Draconis | — | — | compatible_90 | 90 |
| Rubeus | Tristitia | Fortuna Minor | Albus | — | — | compatible_70 | 70 |
| Tristitia | Rubeus | Carcer | Via | — | — | semi_compatible | 60 |
| Fortuna Minor | Carcer | Conjunctio | Amissio | — | — | compatible_70 | 70 |
| Carcer | Fortuna Minor | Fortuna Major | Rubeus | — | — | chaotique | 40 |
| Conjunctio | Fortuna Major | Cauda Draconis | Tristitia | — | — | compatible_70 | 70 |
| Fortuna Major | Conjunctio | Puella | Fortuna Minor | — | — | semi_compatible | 60 |
| Cauda Draconis | Puella | Acquisitio | Carcer | — | — | compatible_70 | 70 |
| Puella | Cauda Draconis | Populus | Conjunctio | — | — | compatible_90 | 90 |
| Acquisitio | Populus | Puer | Fortuna Major | — | — | repos_moyen | 50 |
| Populus | Acquisitio | Laetitia | Cauda Draconis | — | — | semi_compatible | 60 |

0 O-D, 0 O-C, 0 blocage.

**M16 (figure naturelle = Populus, "La Réconciliation")** :

| Fig-Base | R-M16 | Binôme | Antagoniste | O-D | O-C | Niveau | Force |
|---|---|---|---|---|---|---|---|
| Puer | Puer | Caput Draconis | Puella | — | — | semi_compatible | 60 |
| Laetitia | Laetitia | Albus | Acquisitio | — | — | semi_compatible | 60 |
| Caput Draconis | Caput Draconis | Via | Populus | — | — | blocage | 20 |
| Albus | Albus | Amissio | Puer | — | — | compatible_70 | 70 |
| Via | Via | Rubeus | Laetitia | — | — | compatible_70 | 70 |
| Amissio | Amissio | Tristitia | Caput Draconis | — | — | compatible_70 | 70 |
| Rubeus | Rubeus | Fortuna Minor | Albus | — | — | blocage | 20 |
| Tristitia | Tristitia | Carcer | Via | — | — | compatible_90 | 90 |
| Fortuna Minor | Fortuna Minor | Conjunctio | Amissio | — | — | semi_compatible | 60 |
| Carcer | Carcer | Fortuna Major | Rubeus | — | — | compatible_90 | 90 |
| Conjunctio | Conjunctio | Cauda Draconis | Tristitia | — | — | blocage | 20 |
| Fortuna Major | Fortuna Major | Puella | Fortuna Minor | — | — | compatible_90 | 90 |
| Cauda Draconis | Cauda Draconis | Acquisitio | Carcer | — | — | compatible_70 | 70 |
| Puella | Puella | Populus | Conjunctio | — | — | compatible_90 | 90 |
| Acquisitio | Acquisitio | Puer | Fortuna Major | — | — | blocage | 20 |
| Populus | Populus | Laetitia | Cauda Draconis | — | — | repos_moyen | 50 |

0 O-D, 0 O-C (attendu : base=résultante toujours, et aucune figure
n'est son propre binôme ni antagoniste dans ces permutations). **4 cas
"blocage" — encore le même ensemble que M4/M8/M12** (Caput Draconis,
Rubeus, Conjunctio, Acquisitio). Quatrième maison à rejoindre ce
groupe.

### Récapitulatif : les 3 groupes de blocage sur les 16 maisons

Après avoir couvert les 16 maisons, un motif net émerge pour le
niveau "blocage" (`forceMaisonV7`, incompatibilité élémentaire
terre/air) :
- **{M2, M6}** partagent {Tristitia, Carcer, Fortuna Major, Puella}
- **{M4, M8, M12, M16}** partagent {Caput Draconis, Rubeus, Conjunctio,
  Acquisitio}
- **{M10, M14}** partagent {Laetitia, Albus, Amissio, Populus}
- **M1, M3, M5, M7, M9, M11, M13, M15 n'ont jamais de blocage** (0 cas
  partout) — uniquement les maisons à décalage PAIR (qui restent dans
  leur boucle de binôme) peuvent produire du blocage ; les maisons à
  décalage impair (qui traversent toujours) n'en produisent jamais.

Exactement **3 groupes de 4 figures**, couvrant 12 des 16 figures,
répartis sur 8 des 16 maisons (celles à décalage pair).

**Testé si ça pèse sur le verdict (19/07/26, "teste si ça pèse sur le
verdict")** — pour chaque groupe, compte le nombre de maisons du
groupe en blocage sur l'archive, corrélé aux buts réels ET au
vainqueur réel :

| Groupe | Buts moy. (présent) | Buts moy. (absent) | M1 gagne (présent) | M1 gagne (absent) |
|---|---|---|---|---|
| **A (M2/M6)** | 5,91 (n=11) | 7,19 (n=16) | **73%** | **44%** |
| B (M4/M8/M12/M16) | 6,94 (n=18) | 6,11 (n=9) | 56% | 56% |
| C (M10/M14) | 6,80 (n=5) | 6,64 (n=22) | 40% | 59% |

**Le Groupe A (M2/M6) montre le signal isolé le plus net de toute
cette exploration** — double effet (moins de buts ET M1 favorisé,
73% contre 44%), plus net que M6 seul déjà connu. Mais **testé en
priorité absolue sur `verdictFinal`** ("Groupe A présent → M1") :
**21/27, contre 22/27 de base** (2 flips) — légèrement EN DESSOUS du
score actuel, donc ne passe pas la barre du gain net malgré un signal
isolé prometteur. Groupes B et C : aucun signal exploitable (B quasi
plat 56%/56% ; C trop petit n=5 et dans le mauvais sens). **Conclusion :
même le meilleur candidat de cette cartographie (Groupe A) reste
net-négatif en cascade — pas intégré, cohérent avec la discipline
établie cette session (isolé ≠ suffisant, seul le gain net cascade
compte).** Aucun changement de code.

### Le "carré logique" et la relation "subalterne" (19/07/26)

L'utilisateur a fourni un diagramme manuscrit ("carré logique") censé
donner une compréhension conceptuelle de la cartographie des maisons.
Photos trop floues/pivotées pour être lues avec précision numérique —
compréhension construite via les clarifications verbales de
l'utilisateur plutôt que la lecture directe de l'image.

Deux structures confirmées/introduites :
- **Rouge = boucle impaire, bleu = boucle paire** : confirme exactement
  la règle de parité déjà établie (maisons à décalage impair traversent
  toujours l'autre cycle binôme, maisons à décalage pair restent dans
  leur propre cycle).
- **Relation "opposé"** : correspond aux axes Constat 12 déjà connus
  (M1↔M7, M2↔M8, M3↔M9, M4↔M10, M5↔M11, M6↔M12).
- **Relation "subalterne" (NOUVEAU)** : relie deux axes d'opposition en
  une famille à 4 maisons partageant une "énergie commune" doctrinale :
  {M2,M6,M8,M12} via M2-subalterne-M6 et M8-subalterne-M12 (liant les
  axes M2↔M8 et M6↔M12) ; {M3,M5,M9,M11} via M11-subalterne-M3 et
  M9-subalterne-M5 (liant les axes M3↔M9 et M5↔M11). M1↔M7 et M4↔M10
  restent des axes opposé isolés, sans partenaire subalterne mentionné.

Énergies doctrinales données par l'utilisateur : M6/M12 = "incidents"
(déjà couvert par `detectIncidentChaotique`, Cauda Draconis/Tristitia/
Carcer/Amissio en M6 ou M12) ; M5/M11 = "capacité de marquage" (déjà
couvert par `paralysieV7`/`goalCap`) ; **M2/M8 = "ressource pour les
équipes"**, précisé comme "profondeur d'effectif / rotations
(remplaçants)" — thème neuf, pas encore codé.

**Test exploratoire M2/M8 vs profondeur d'effectif (19/07/26)** : seuls
4 matchs réels de cette session disposent de données minute par minute
permettant d'observer un but tardif (proxy approximatif d'un effet
"banc/rotation") :

| Match | M2 | M8 | Dissonants ensemble ? | But tardif réel |
|---|---|---|---|---|
| St Louis | Via (90) | Caput Draconis (blocage, 20) | ❌ | ✅ (75', 86') |
| USA-Belgique | Caput Draconis (60) | Fortuna Minor (60) | ❌ | ✅ (75') |
| France-Espagne | Albus (60) | Tristitia (100) | ❌ | ❌ |
| Vitesse-AEK | Fortuna Major (blocage, 20) | Puer (60) | ❌ | ❌ |

**Aucun des 4 matchs ne satisfait la condition "M2 ET M8 dissonants
ensemble"** (le déclencheur exact déjà utilisé ailleurs dans
`verdictFinal` pour d'autres paires) — impossible de tester
rigoureusement cette condition précise avec les données disponibles.
Un pattern faible et non fiable a été repéré (M2 plus fort — force 90,
60 — dans les 2 matchs AVEC but tardif, contre plus faible — force 60,
blocage 20 — dans les 2 SANS) mais **n=4, à prendre avec de très
grandes pincettes, ne permet aucune conclusion**. Aucun changement de
code. Piste laissée en attente : soit accumuler plus de matchs réels
avec données minute par minute, soit trouver une autre façon de tester
l'hypothèse "ressource d'équipe" (question posée à l'utilisateur, sans
réponse à ce stade).

**Observation utilisateur (19/07/26) : "même boucle" M2/M8.** Sur les 4
matchs ci-dessus, l'utilisateur a remarqué que M2 et M8 partagent la
même boucle de binôme (`BINOMES_V7`, cycle Puer-A ou Laetitia-B) dans
les 3 premiers matchs (St Louis, USA-Belgique, France-Espagne), et sont
dans deux boucles différentes uniquement sur le dernier (Vitesse-AEK :
Fortuna Major=B, Puer=A). **Vérifié par calcul : observation exacte**
(appartenance de boucle = parité de l'index dans `FIGS_V7`).

Contrairement au test "dissonants ensemble" (limité aux 4 matchs à
données minute par minute), "même boucle vs boucles différentes" ne
dépend que du thème — testable sur l'**archive complète (27 matchs)**.
Testé en deux temps :
- D'abord avec le champ `verdict.winner` stocké dans l'archive
  (calculé au moment de la sauvegarde, donc potentiellement obsolète
  par rapport à la cascade actuelle) : 69% (11/16) même boucle contre
  55% (6/11) boucles différentes — écart trompeur.
- **Recalculé en direct avec `verdictFinal()` de la cascade actuelle**
  (via Playwright, `file://index.html`, appel direct de la fonction
  sur chaque thème archivé) : **81% (13/16) même boucle contre 82%
  (9/11) boucles différentes — aucun écart réel**, l'écart précédent
  n'était qu'un artefact du verdict obsolète stocké dans l'archive.
- Buts moyens et écart de score moyen également quasi identiques entre
  les deux groupes (6,75 buts/1,88 écart même boucle vs 6,55 buts/2,36
  écart boucles différentes) — pas de signal exploitable ici non plus.

**Conclusion : le partage de boucle M2/M8 est une observation
structurelle exacte, mais ne corrèle avec aucun résultat mesurable
(ni précision du vainqueur, ni buts, ni écart) sur l'archive complète.**
Aucun changement de code. Reste une piste ouverte si une autre variable
à tester est proposée (l'angle "profondeur d'effectif" lui-même n'a
pas encore de proxy fiable, voir ci-dessus).

*(Première passe des 16 maisons terminée. Prochaine étape possible :
approfondir un groupe précis, tester l'impact verdict des autres
paliers, ou une nouvelle direction à la demande de l'utilisateur.)*

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
