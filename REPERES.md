# Repères du système géomantique (mis à jour 17/07/26)

Ce fichier sert de tableau de bord pour se repérer rapidement dans l'état du
système : ce qui est validé, ce qui est rejeté, ce qui reste ouvert. À
consulter avant de proposer une nouvelle piste (éviter de retester une
hypothèse déjà rejetée) et avant de modifier `verdictFinal` (connaître
l'ordre exact de la cascade et le score de chaque étage).

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
