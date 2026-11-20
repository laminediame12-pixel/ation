# Moteur 4 — le noyau, lu

Nouveau moteur, seul moteur du dépôt : `moteur4/moteur.js` sur `moteur3/noyau.js`. Il **ne prédit rien**.

## Ce qu'il contient (exact ou vérifié)
- Thème, bases, résultantes, pôles R1/R7, mode (même front / même boucle / boucles différentes), lien R1+R7 : fonctions exactes des 4 mères.
- Équilibre des deux parties : équation vérifiée sur les 65 536 thèmes.
- FI-5 : validation du thème posée par le propriétaire ; elle ne dit rien du résultat. Binôme de M1 en maison angulaire, somme de l'axe angulaire présente (emplacement ignoré), somme 3-5-11-15 présente, figure du jour présente.
- Contrôle : `node outils/tester_moteur4.js` (65 536 thèmes, 0 écart).

## Analyse d'un thème (`KOUN4.poles`)
Pour chaque pôle : front, front binôme, binôme, antagoniste. Pour chaque figure : emplacements (base, résultante, chez elle) et niveaux saturés de la résultante de la maison où elle se trouve. Cinq indicateurs, chacun désigne R1 ou R7 :
1. saturation cumulée du front ; 2. du front binôme ; 3. du binôme ; 4. de l'antagoniste (moins = mieux) ; 5. emplacements (front + front binôme) où le niveau propre du groupe, celui de son front, est saturé.
« Net » : les cinq désignent le même pôle. C'est une lecture de la structure, pas un verdict ; aucune règle de victoire n'est encore inscrite.

## Les 15 nœuds (`KOUN4.noeuds`)
Intersections des canaux dans la croix de chaque front : nœud (niveau horizontal i, niveau vertical j) = maison 4j + i + 1 ; M16 n'a pas de nœud. Pour chaque front : état de chaque nœud (plein : deux liaisons saturées, vide : aucune, mixte : une) et arrêts (maison qui porte en base son antagoniste h − 3). Recoupé avec la carte en croix de la page sur 40 thèmes × 4 fronts (0 écart).

## Ce qu'il ne contient pas, et pourquoi
Aucune règle de verdict n'est démontrée. Retirées :
- **VA-1** : « assurée » est faux (juste 1/2, puis 1/1 ; faux 2 fois sur 4 dans l'audit) ; elle repose aussi sur le barème de force (25 points par niveau, destructeur, intrusion), inventé.
- **MF-2** (3 cas réels) et **MF-3** (1 cas réel) : posées, jamais prouvées.
- Tout le reste de l’ancien moteur (supprimé) : développement, CC-1, « R1 par défaut », pénalité/carton, buts, corners, Over/Under, rythme.

Une règle revient ici quand elle est posée avant les chiffres, testée une fois sur un lot neuf, et confirmée.

## Buts d'après la Terre (`KOUN4.butsTerre`)
Règle du propriétaire : la saturation de Terre est le marquage. T = nombre de maisons à résultante saturée en Terre ; buts au total = ceil(T/2) + 1 (formule tirée de cinq matchs ; première prédiction à l'aveugle : 1-3-15-4, 6 buts prévus, score 4-2, exacte : admise, à confirmer sur d'autres matchs). La ligne « Buts au total » du verdict et l'Over/Under qui en découle sont alimentés par elle ; toutes les autres lignes restent sans verdict.

**Échec constaté :** 12-8-10-3 (Via en base de M8) : 5 buts prévus, 2 réels (1-1). La formule reste admise hors Via en base de M8 (6 matchs sur 6) ; ce cas n'a pas de formule.
