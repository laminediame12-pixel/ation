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
| **Max des 4 forces (M1/M7/R1/R7)** | Compare directement les 4 forces de chaîne de dualité (`chaineDualite().forceMaisons` de M1, M7, R1, R7, Constat 11 inclus) et retient le CAMP auquel appartient le maximum absolu des 4 (M1 ou R1 → Équipe 1 ; M7 ou R7 → Équipe 2) — demande explicite utilisateur, 17/07/26 : "M1>M7 et R1 et R7 → équipe 1 gagne", etc. Ne tranche pas si le maximum est partagé entre les deux camps (repli sur l'ancrage classique). | **PRIORITAIRE sur l'ancrage classique depuis le 17/07/26** — `verdictFinal` complet passe de 17/27 à **18/27** (décide 19/27 matchs). Peut inverser un verdict déjà donné par l'ancrage classique sur le même thème (constaté sur le thème Amissio/Albus/Tristitia/Conjunctio : M1 avant, M7 après). |
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
| 2c | **Max des 4 forces (M1/M7/R1/R7)** | `chaineDualite(...).forceMaisons` de M1, M7, R1, R7 comparées directement, dans `verdictFinal` — le camp du maximum absolu des 4 tranche (repli sur 2d si le maximum est partagé entre les deux camps) | **18/27 (67%) en priorité sur l'archive** (décide 19/27 matchs), contre 17/27 sans cette règle | **Actif, PRIORITAIRE sur l'ancrage classique** (demande explicite utilisateur, 17/07/26 — "instaure le mode fixe, on teste ça... par comparaison si M1>M7 et R1 et R7 équipe 1 gagne...") — meilleure amélioration mesurée de la journée |
| 2d | **Ancrage (chaîne complète, fixe + rotation + obstacle)** | `chaineDualite(chef,theme).forceMaisons` (8 figures + Constat 11 obstacle/attaquant signé) comparée M1/M7 (fixe) ET R1/R7 (rotation, `getRotationOrderFromRepos`), dans `verdictFinal` — le côté à plus grand écart de force tranche | **2/2 HIT réel confirmés** (match virtuel Fortuna Minor/Albus 8-1 M1 ; St. Louis City SC vs Sporting Kansas City 3-2 M1 — voir §3) | **Actif, repli quand 2c est indécis** (demande explicite utilisateur, 17/07/26 — "l'ancrage doit constituer toute la chaîne", puis "retour en ancrage côté rotation", puis "entre le [Constat 11] dans le calcul du verdict") — trajectoire du score mesuré de `verdictFinal` complet : 19/27 → 16/27 (rotation ajoutée) → 15/27 → 17/27 (Constat 11 ajouté) → **18/27** (max des 4 forces ajouté en priorité) |
| 3 | Plus grand écart de dominance | bloc `carteRot`/`carteFixe` dans `verdictFinal` | 20/27 (74%) sur l'archive, seul | N'est plus le premier mécanisme consulté depuis l'ajout de l'ancrage (2c) — ne s'exprime que si l'ancrage ne tranche pas |
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

## 5. Pistes ouvertes / prochaines étapes possibles

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
