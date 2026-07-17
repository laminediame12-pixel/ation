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
| **Écart de dominance** | Entre le duel M1/M7 (mode fixe) et le duel R1/R7 (rotation par force du repos), on fait confiance à celui des deux qui affiche l'écart de dominance interne le plus large (le plus "tranché"), pas systématiquement à la rotation. | **Mécanisme PRINCIPAL** du verdict — tranche avant tout le reste (sauf l'impasse totale de boucle), 20/27 sur l'archive. |
| **Impasse totale de boucle** | Dans la guerre civile (attaques effectives + chaîne de force), si les deux camps sont à égalité parfaite sur les deux critères à la fois, c'est structurellement un nul. | Nul prioritaire, avant même l'écart de dominance. |
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
| 3 | **Plus grand écart de dominance** | bloc `carteRot`/`carteFixe` dans `verdictFinal` | **20/27 (74%) sur l'archive** | **Mécanisme principal**, tranche 27/27 sur l'archive (aucun repli sollicité) |
| 4 | **Chaîne de dualité (repli)** | `verdictChaineDualite(theme)` | **19/27 (70%) seule** | Repli, atteint seulement si l'étage 3 ne tranche pas (0 cas dans l'archive, 114-148/20000 sur thèmes aléatoires) |
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

| Match | Mères (M1→M4) | Réel | Chaîne de dualité (version actuelle) |
|---|---|---|---|
| Liverpool vs Man City | caput_draconis/amissio/via/caput_draconis | 9-10, **M7** | HIT (M7) |
| Chelsea vs Atlético | caput_draconis/albus/amissio/via | 0-5, **M7** | MISS (prédit M1) |
| France vs Espagne | fortuna_minor/albus/amissio/via | 0-2, **M7** (MT 0-1) | HIT (M7) |
| Suisse vs Colombie | carcer/carcer/cauda_draconis/amissio | 0-0, **Nul** | MISS (prédit M1 — un Nul ne peut jamais sortir de ce mécanisme binaire) |
| USA vs Belgique | via/caput_draconis/conjunctio/rubeus | 4-1 Belgique, **M7** (MT 2-1) | MISS (prédit M1) |
| Argentine vs Egypte | carcer/amissio/carcer/puer | 3-2, **M1** | HIT (M1) |

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
- Réexaminer les 3 échecs du §3 (Chelsea-Atlético, Suisse-Colombie,
  USA-Belgique) à la main, figure par figure, comme fait pour
  carcer/rubeus — voir si une pièce de la doctrine manque encore
  (victime ? libérateur lui-même a-t-il son propre petit calcul ?).
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
