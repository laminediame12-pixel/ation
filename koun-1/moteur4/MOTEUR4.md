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

## Buts d'après la Terre : formule réfutée, puis marqueur retrouvé sous une autre forme
La formule ceil(T/2)+1 (T = maisons à résultante saturée en Terre) était juste sur 6 matchs hors Via en base de M8 mais a été réfutée à l'aveugle sur 2-12-4-4 (4 buts prévus, 6 réels). Elle est retirée du moteur et du verdict. Le comptage de Terre (`KOUN4.terreSaturee`) reste, comme structure exacte.

## Verdict
Un seul verdict est actif : H-REPOS (règle du propriétaire) : le pôle qui possède ses deux fronts au repos, sans que l'antagoniste y soit, gagne. Les règles H-CROIX, H-5, H-TEMOINS et H-BIN-E sont réfutées sur 22 matchs indépendants. Voir `validation/BILAN.md` ; `node outils/valider.js` refait l'évaluation.


## Indices (version 4.1.0) : lectures de signaux, pas des verdicts
Ces fonctions ne décident rien ; elles affichent des signaux dont le statut est tenu dans `validation/hypotheses.json` (règle du protocole : même exigence pour garder et pour retirer, voir `validation/PROTOCOLE.md`).
- `KOUN4.marquage(L)` : n = nombre de maisons du front direct d'un pôle dont la résultante a la Terre saturée (0 à 4). Fréquences observées par n (78 pôles-matchs) : part des pôles à 2 buts ou plus 33, 32, 63, 69, 80 % ; buts moyens 1,2, 1,5, 2,5, 3,1, 2,4 ; probabilité que les deux marquent (produit) et buts attendus (somme des moyennes). Corrélation n / buts 0,30 (p = 0,016 corrigée). H-MARQUAGE, H-MARQ-DOUBLE.
- `KOUN4.incident(L)` : détecteur à six paramètres (P1 arrêt reliant les fronts de R1 et R7, P2 résultante de M12 dans la liste, P3 résultante de M6 dans la liste, P4 base de M9 = figure d'un pôle, P5 Terre de M1+M7 non saturée, P6 coordination M6+M12 sur un nœud de la Terre) ; score 0 à 6 : 3 ou plus probable, 2 possible. `rouge` : P6 et côté (nœud M1+M7 vide dans le front du pôle). Ajusté sur 8 matchs étiquetés (5 incidents, 3 RAS) : ce n'est pas un test.
- `KOUN4.chaine(L)` : figure, antagoniste, protecteur du pôle et leurs filiations deux à deux (f+a et a+p sont toujours sur le Circuit Souverain 1-3-5-11-13).
- Contrôle : `node outils/tester_indices.js` (65 536 thèmes).

## Ce que la page affiche (`koun.html`)
Verdict de victoire : H-REPOS seul. Fenêtre du verdict : n et probabilité de marquer 2 buts ou plus par pôle, « Deux marquent » et buts attendus (indices), « Rouge ou penalty » (détecteur à six paramètres). Toutes ces lignes portent l'étiquette « indice non vérifié ».

## Combinaisons de maisons et témoins (exact + signal)
- `KOUN4.equivalences(maisons)` : il n'existe que 256 fonctions de somme distinctes pour les combinaisons de maisons (255 non nulles), parce que les 16 maisons n'ont que 8 maisons indépendantes. Renvoie la forme sur M1..M8 et la plus courte écriture (1-5-12-15 ≡ M1+M6+M13 ≡ M2+M3+M4+M6 ; Circuit souverain ≡ M2+M4+M6). La page l'affiche dans « Maisons de calcul ».
- `KOUN4.marquage(L).temoin` : témoin M5+M7 : Terre de base(M5)+base(M7) non saturée → les deux équipes marquent (20 matchs sur 20), saturée → 9 sur 20. Signal post hoc (H-TEMOIN-M5M7), affiché dans « Deux marquent ».

- `KOUN4.rythme(L)` : figure-somme des bases de 1-5-12-15 (buts de première mi-temps), sa classe (fermante, ouvrante, fixe, mobile) et son rythme (rapide si Feu et Air saturés, front D ; lent si Feu et Air ouverts, front A). Lecture du propriétaire (H-RYTHME), affichée dans la fenêtre du verdict, ligne « Rythme des buts (1re mi-temps) ». Deux cas au corpus : Troyes–Le Havre (rapide, buts à la 3e et à la 19e) et Orlando–Cincinnati (lente, buts à la 26e et à la 43e).
