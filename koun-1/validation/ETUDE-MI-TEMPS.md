# Étude des buts de première mi-temps (13 matchs, 21/11/2026)

Données : `validation/mi-temps.json` et les matchs de `scores-reels.json` qui ont un score de mi-temps. Outil : `node outils/mi_temps.js`.

- 13 matchs, 10 avec au moins un but en première mi-temps, 16 buts au total.
- **Rythme de 1-5-12-15 (bases)** : rapide (Feu et Air saturés) 5 sur 5 avec but, 1,8 but en moyenne, premiers buts à la 3e, 5e, 16e et 18e ; intermédiaire 4 sur 6 (0,83 but) ; lente 1 sur 1 (26e) ; Populus 0 sur 1. Probabilité que les 5 rapides tombent toutes dans les 10 matchs avec but par hasard : 0,20 (non significatif).
- Classe, nombre de niveaux saturés, présence de la figure dans le thème : aucune séparation nette.
- **Témoin M5+M7** (Terre de base(M5)+base(M7) non saturée) : 7 sur 8 avec but (1,5 but en moyenne) contre 3 sur 5 (0,8). Même sens que pour « deux marquent » au match.
- Marquage par pôle : les pôles à n >= 2 ont marqué en première mi-temps 9 fois sur 19, ceux à n <= 1 6 fois sur 7 : sens inverse du match entier, sur trop peu de cas.
- Détecteur d'incident, somme des n : rien.
- Criblage des 255 combinaisons (10 matchs) : meilleures corrélations 0,80 à 0,85, au niveau du hasard (p = 0,73 et 0,92 par permutation). 1-5-12-15 ≡ M1+M13+M6 ; la partie M1+M13 (niveau Feu) est parmi les meilleures pour « au moins un but », piste à revoir.
- À poursuivre : il faut une trentaine de matchs, et surtout des 0-0 et des figures lentes.
