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
| **Ancrage (chaîne complète)** | Compare la force de TOUTE la chaîne de dualité (chef, ancre, assaillant, libérateur, victime + leurs 3 binômes — `chaineDualite().forceMaisons`) entre M1 et M7 — pas seulement l'ancre isolée ("l'ancrage doit constituer toute la chaîne", demande explicite). Étendu le même jour (17/07/26, "retour en ancrage côté rotation") au duel R1/R7 : les deux côtés (fixe et rotation) sont comparés, celui avec le plus grand écart de force gagne l'arbitrage. | **PRIORITAIRE sur l'écart de dominance depuis le 17/07/26** — validé seul 16/27 (fixe seul) ; avec le côté rotation ajouté, `verdictFinal` complet tombe à **15/27** sur l'archive (contre 16/27 juste avant), régression mesurée et assumée en échange de la couverture doctrinale complète (fixe ET rotation) demandée explicitement. |
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
| 2 | Impasse totale de boucle (nul) | `verdictElementaire` + `piliersReposCount<2` | 2/2 réel (Olympiacos-WestHam 7-7, FIFA 4-4) | Actif |
| 2b | Superposition ancre/assaillant (nul) | `superpositionAncreAssaillant(theme)` | n=1 réel (Suisse-Colombie 0-0) | Actif, 0/27 sur l'archive (aucun risque de régression) |
| 2c | **Ancrage (chaîne complète, fixe + rotation)** | `chaineDualite(chef,theme).forceMaisons` comparée M1/M7 (fixe) ET R1/R7 (rotation, `getRotationOrderFromRepos`), dans `verdictFinal` — le côté à plus grand écart de force tranche | **15/27 (56%) seule** sur l'archive complète (fixe seul faisait 16/27 ; ajout du côté rotation coûte 1 match), mais **2/2 HIT réel confirmés** (match virtuel Fortuna Minor/Albus 8-1 M1 ; St. Louis City SC vs Sporting Kansas City 3-2 M1 — voir §3) | **Actif, PRIORITAIRE sur l'écart de dominance** (demande explicite utilisateur, 17/07/26 — "l'ancrage doit constituer toute la chaîne", puis "retour en ancrage côté rotation") — fait baisser le score mesuré de `verdictFinal` de 19/27 à 16/27 puis à **15/27** sur l'archive (assumé à chaque étape) |
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
- Rubeus/Fortuna Major/Puer penalty-rouge : n=1-2 seulement, à enrichir
  si de nouveaux vrais matchs avec penalty/rouge se présentent.

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

### Constat 11 — L'antagoniste de l'obstacle (B-B-A) d'une figure est TOUJOURS son propre binôme

Découvert sur Puer : antagoniste(Puer)=Puella → binôme(Puella)=Populus
→ binôme(Populus)=**Laetitia** (= B-B-A de Puer, son obstacle, Constat
1). Or **antagoniste(Laetitia)=Acquisitio**, et **binôme(Acquisitio)=
Puer** — la figure qui attaque/neutralise l'obstacle de Puer
(Acquisitio attaque Laetitia) est en même temps le binôme direct de
Puer (donc son propre soutien). Attaque et soutien se rejoignent sur
la même figure (Acquisitio) : elle combat l'obstacle ET renforce le
chef simultanément.

**Vérifié exhaustivement sur les 16 figures (16/16, jamais pris en
défaut) — ce n'est pas une coïncidence isolée à Puer, c'est une
identité algébrique garantie** : obstacle(X) = binôme²(antagoniste(X))
= X+1 (décalages fixes −3+2+2) ; antagoniste(obstacle(X)) = X+1−3 =
X−2 ; binôme(X−2) = X−2+2 = X. La boucle se referme toujours,
peu importe la figure de départ.

Distinct du "libérateur" déjà codé dans `chaineDualite`
(`antagoniste(assaillant)` — pour Puer donne Conjunctio, pas
Acquisitio) : ce sont deux mécanismes de libération différents et
non-contradictoires, pas la même chose vue sous un autre angle.
**Statut : identité structurelle prouvée (16/16), pas encore
intégrée au verdict** — reste à déterminer si elle doit devenir une
nouvelle règle de "libération de l'obstacle" à part entière, distincte
du libérateur du chef déjà codé.

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
