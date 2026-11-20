# Moteur 4 — le noyau, lu

Nouveau moteur, seul moteur du dépôt : `moteur4/moteur.js` sur `moteur3/noyau.js`. Il **ne prédit rien**.

## Ce qu'il contient (exact ou vérifié)
- Thème, bases, résultantes, pôles R1/R7, mode (même front / même boucle / boucles différentes), lien R1+R7 : fonctions exactes des 4 mères.
- Équilibre des deux parties : équation vérifiée sur les 65 536 thèmes.
- FI-5 : validation du thème posée par le propriétaire ; elle ne dit rien du résultat. Binôme de M1 en maison angulaire, somme de l'axe angulaire présente (emplacement ignoré), somme 3-5-11-15 présente, figure du jour présente.
- Contrôle : `node outils/tester_moteur4.js` (65 536 thèmes, 0 écart).

## Ce qu'il ne contient pas, et pourquoi
Aucune règle de verdict n'est démontrée. Retirées :
- **VA-1** : « assurée » est faux (juste 1/2, puis 1/1 ; faux 2 fois sur 4 dans l'audit) ; elle repose aussi sur le barème de force (25 points par niveau, destructeur, intrusion), inventé.
- **MF-2** (3 cas réels) et **MF-3** (1 cas réel) : posées, jamais prouvées.
- Tout le reste de l’ancien moteur (supprimé) : développement, CC-1, « R1 par défaut », pénalité/carton, buts, corners, Over/Under, rythme.

Une règle revient ici quand elle est posée avant les chiffres, testée une fois sur un lot neuf, et confirmée.
