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

## Combinaison 5-7-12-15 pour la 2e mi-temps (2026-11-22)

30 matchs avec mi-temps et score final (une équipe marque en 2e mi-temps 28 fois sur 60). 5-7-12-15 : lecture des côtés (figure fixe : son côté encaisse, sinon il marque) 5 justes sur 12 ; lecture de l'ancrage 11 sur 25. Ne marche pas (classée 1230e sur 1789 combinaisons de 4 maisons). 4-5-13-15 reste la combinaison de la 2e mi-temps : ancrage 14 sur 19 ; côtés 6 sur 11. Script : `outils/combinaison_mt2.js`.

## Lecture des côtés sur les 80 thèmes acquis, score final (2026-11-22)

Une équipe marque dans le match 125 fois sur 160 (78 %). Figure posée d'un seul côté (fixe : ce côté encaisse, sinon il marque), l'équipe désignée : 1-5-12-15, marque 34 fois sur 41, gagne 16, perd 16 ; 4-5-13-15, marque 33 sur 39, gagne 21, perd 10, 8 nuls ; 5-7-12-15, marque 26 sur 32, gagne 13, perd 12. Pour le match entier, seule 4-5-13-15 penche vers un vainqueur, mais elle n'apporte rien au verdict : d'accord avec lui 12 justes, 1 faux, 2 nuls ; quand il est sans appel 4 justes, 2 faux, 3 nuls ; quand elle s'y oppose, le verdict a raison 7 fois contre 5.

## Les 1820 combinaisons de 4 maisons sous le mécanisme complet (2026-11-28)

31 mi-temps connues. Le mécanisme de 1-5-12-15 (figure rapide ou attaquée, nuance des maisons de la combinaison, binôme lié) appliqué à chacune des 1820 combinaisons de 4 maisons : 1-5-12-15 arrive 1re (but 21 fois sur 22 quand il est attendu, 3 sur 9 sinon), à égalité seulement avec ses écritures équivalentes (2-3-4-6, 2-6-9-13, 6-13-15-16). Pour la 2e mi-temps, 4-5-13-15 (pôle désigné : 15 sur 20, autres 14 sur 42) arrive 6e. Ces mi-temps ont en partie servi à régler les deux mécanismes, et aucune mi-temps des matchs du 26 et du 27 n'a été trouvée : pas encore de jugement hors échantillon. Script : `outils/combinaisons_inevitables.js`.
