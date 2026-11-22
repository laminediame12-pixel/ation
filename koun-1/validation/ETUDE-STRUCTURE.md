# Étude de la structure : fronts, maisons, niveaux (22/11/2026)

## 1. Le thème est une grille 4 × 4 d'éléments (exact)
Une maison h a deux éléments : son **front** (colonne i = (h−1) mod 4 : A Feu, B Air, C Eau, D Terre) et son **rang** (ligne j = (h−1) div 4) :
- rang Feu : M1-M4 (les mères) ; rang Air : M5-M8 (les filles) ; rang Eau : M9-M12 (les nièces) ; rang Terre : M13-M16 (témoins, juge, sentence).
- Le nœud de la maison h est exactement le croisement du canal de son front (i) et du canal de son rang (j) : la grille des maisons et la grille des 15 nœuds sont la même grille.
- Diagonale (même élément deux fois) : M1 Feu × Feu, M6 Air × Air, M11 Eau × Eau, M16 Terre × Terre (le coin qui manque : la Terre ne se croise pas, elle relie).
- Chaque front contient une maison de chaque rang : front A = M1 (mère), M5 (fille), M9 (nièce), M13 (témoin).

## 2. Les niveaux d'une rangée forment une figure (exact)
- Lire le niveau l des quatre mères (M1 à M4) donne exactement la fille M(5+l) : le Feu des mères = M5, l'Air = M6, l'Eau = M7, la Terre = M8 (c'est la transposition).
- Lire le niveau l des quatre filles redonne la mère M(l+1).
- Les rangs Eau (M9-M12) et Terre (M13-M16) ne donnent aucune figure du thème quand on lit un niveau ; lire un niveau le long d'un **front** (colonne) non plus. Seules les deux premières générations sont « figures et niveaux » l'une de l'autre.

## 3. La Terre fait marquer et défend (sur 79 matchs, 156 pôles)
- Corrélation avec les buts du pôle : Terre saturée dans son front direct +0,19 ; Feu +0,12 ; Air −0,02 ; Eau +0,04 ; niveau propre du front +0,04 ; **Terre du front adverse −0,26**.
- Buts de R1 selon la Terre du front de R7 : 0 → 2,80 ; 1 → 2,79 ; 2 → 1,90 ; 3 → 1,60 ; 4 → 1,00 : la Terre adverse ferme.
- **Balance de la Terre** (n propre − n adverse) : corrélation 0,34 avec les buts ; le pôle à la plus grande Terre gagne 30 fois sur 42 (« toujours R1 » 22 sur 42).
- Sur les matchs ajoutés après le choix de la mesure n (non vus pendant sa construction) : 14 justes sur 21, « toujours R1 » 8 sur 21. C'est le signal de victoire le plus solide trouvé à ce jour.

## 4. Zones d'ombre restantes
- Pourquoi les rangs Eau et Terre (nièces, témoins) ne se lisent pas comme figures : ils sont des sommes, la lecture par niveau n'y est pas une transposition.
- La 2e mi-temps : 4-5-13-15 reste une piste (14 sur 19 équipes désignées), à confirmer.
- Le nul : il tombe là où les nœuds de coordination sont à égalité et où les Terre se compensent ; à mesurer avec la balance de la Terre.

## Déplacement des figures dans les fronts (2026-11-22)

Thème neutre : chaque figure dans sa propre maison, toutes les résultantes sont Populus (tous les canaux saturés). Une figure f posée dans la maison h donne la résultante f + h : un canal reste saturé exactement quand f et la figure de la maison h ont le même niveau sur ce canal.

Loi exacte (256 couples figure / maison) : le front d'une figure est fixé par ses niveaux Feu et Air (A : Feu 1 Air 1, B : Feu 1 Air 2, C : Feu 2 Air 1, D : Feu 2 Air 2). Donc :

| La figure tombe… | Feu | Air | Eau, Terre |
|---|---|---|---|
| dans son propre front | saturé | saturé | selon sa place dans le front |
| chez l'allié (front du binôme : A↔C, B↔D) | ouvert | saturé | selon sa place |
| chez l'ennemi (les deux autres fronts) | selon le front | ouvert | selon sa place |

Air ouvert signale toujours l'ennemi ; Feu ouvert avec Air saturé signale l'allié.

Sur les 79 matchs : seule la Terre saturée dans le front du pôle désigne le vainqueur (30 justes, 13 faux, c'est H-BALANCE-TERRE). Feu (16/21), Air (24/17) et Eau (21/19), donc la classe du déplacement, ne désignent rien ; compter qui occupe le front (propre, allié, ennemi) ou où vont les figures du pôle ne désigne rien non plus. Séparer la Terre selon l'occupant n'améliore pas le total. Script : `outils/deplacement.js`.

### Liaisons miroirs et Terre rapportée au front de la figure (2026-11-22)

Une figure posée dans une maison coupe la liaison avec la maison miroir (h ± 8) sur les niveaux où elle diffère de la figure de la maison ; son inverse complet (somme Via) coupe tout (exemple : Puer en M4 inverse Albus, l'axe M4–M12 est coupé sur les 4 niveaux).

Lectures de la Terre testées sur 79 matchs (le pôle le plus fort gagne / perd) :

| Lecture | Gagne | Perd |
|---|---|---|
| Terre saturée dans les 4 maisons du front (H-BALANCE-TERRE, actuelle) | 30 | 13 |
| Terre rapportée par les figures du front, depuis les maisons où elles sont posées | 28 | 20 |
| Résultantes appartenant au front, Terre saturée | 29 | 20 |
| Figures du front posées avec la Terre à 2 | 28 | 18 |
| Maisons + Terre rapportée | 30 | 16 |
| Terre déviée gardée dans les maisons du front | 22 | 12 |
| Terre rapportée depuis le terrain ennemi | 18 | 19 |
| Liaisons miroir gardées (Feu, Air, Eau) | 22 | 27 |

Quand la Terre des maisons et la Terre rapportée désignent le même pôle : 15 justes, 2 faux, 5 nuls. Quand elles s'opposent, la Terre des maisons a raison 13 fois, la Terre rapportée 8 fois. Script : `outils/terre_rapportee.js`.

### Liaisons par parité (règle du propriétaire, 2026-11-22)

Une liaison vaut la somme des deux niveaux : 2+2 = 2 (saturée), 1+2 = 1 (coupée), 1+1 = 2. Feu, Air, Eau relient la maison à son miroir (h ↔ h+8) ; la Terre relie la maison à son front direct (haut f ↔ droite f+4, bas f+8 ↔ gauche f+12). Exemple vérifié : Terre M4 (Albus) 2 + Terre M8 (Tristitia) 2 = 2 ; Puer en base de M4 : 1 + 2 = 1, la liaison M4–M8 est coupée.

Sur 79 matchs (le pôle le plus lié gagne / perd) : liaisons Terre du front 14 / 21 ; miroir Feu 17 / 13, Air 15 / 22, Eau 16 / 16 ; miroir ensemble 26 / 22 ; toutes 21 / 23 ; meilleur test atteint par hasard dans 72 % des mélanges. Sur la seule maison du pôle : Terre 10 / 17, miroir 21 / 22, toutes 20 / 30. Aucun signal ; la Terre par parité va plutôt à l'inverse (le pôle dont la liaison Terre est coupée gagne un peu plus souvent). Quand elle s'oppose à la balance de la Terre (H-BALANCE-TERRE), la balance a raison 11 fois sur 14. Script : `outils/liaisons_parite.js`.

### Qui sabote, qui renforce (2026-11-22)

Liaisons par parité du front de chaque pôle ; liaison coupée (1+2) : saboteur = figure posée en base dans la maison impaire ; liaison renforcée : 1+1. Saboteurs classés : figures du pôle, de l'allié (front binôme), du front adverse (celui de l'autre pôle), de l'autre front. Sur 79 matchs, rien ne ressort sauf : le pôle qui a le moins de liaisons Terre renforcées (1+1, les deux maisons à Terre ouverte) gagne 22 fois, perd 7 (meilleur des 13 tests atteint par hasard dans 6 % des mélanges). Ce n'est pas un signal nouveau : il ne contredit jamais la balance de la Terre (H-BALANCE-TERRE) et en est un cas particulier (deux maisons du front à Terre ouverte). Le sabotage par le front adverse ou par l'allié ne désigne rien (21/22, 10/14). Script : `outils/sabotage.js`.

### Circuit Eau–Terre dans la boucle occupée par le pôle (propriétaire, 2026-11-22)

Le pôle est lu dans la boucle de front de la maison qu'il occupe. Circuit : pôle P —Terre— front direct Q —Eau— miroir de Q —Terre— miroir de P —Eau— P (boucle fermée de 4 liaisons) ; Feu et Air vont ensemble sur les liaisons miroir. Relations de fronts : ennemi = front de l'antagoniste (front + 1), allié = binôme (front + 2), proie = front − 1. R7 occupe toujours la boucle alliée de celle de R1 (maison + 6).

Exemple 8-5-11-7 (7-0) : R1 Fortuna Minor en M8 (boucle de sa proie, front D) : Terre M8–M4 arrêt, Eau M4–M12 arrêt, Terre M12–M16 arrêt, Eau M16–M8 liée ; R7 Carcer en M14 (sa boucle) : 2 liaisons sur 4.

Sur 79 matchs (parité) : le pôle au circuit Eau–Terre le plus lié gagne 17 fois, perd 31 (c'est le plus coupé qui gagne) ; circuit coupé sur ses 4 liaisons : le pôle a marqué 12 fois sur 12 (8 fois 2 buts ou plus) ; Feu–Air 23 / 23. Lecture stricte (liée seulement 2+2) : 24 / 22. Meilleur des 8 tests atteint par hasard dans 26 % des mélanges. Boucle occupée : chez sa proie 26/31 pôles marquent (2,1 buts), dans son front 49/62 (1,9), chez l'allié 23/31 (1,6), chez l'ennemi 25/34 (1,4). Script : `outils/circuit.js`.

### La Terre des diagonales et le nul (2026-11-22)

Question du propriétaire : la Terre des diagonales (1-6-11-16 et 4-7-10-13) tient-elle l'équilibre du thème ? Sur 79 matchs (14 nuls), 12 lectures : nombre de nœuds à Terre saturée par diagonale, sur les 8 nœuds, égalité entre les deux diagonales, parité de la Terre des sommes, bases, nœuds des fronts des pôles, nœuds des fronts non occupés. Meilleure case : 3 nœuds sur 8 saturés, 7 nuls sur 20 ; atteinte par hasard dans 53 % des mélanges. La Terre des diagonales ne tient pas le nul. Elle désigne le vainqueur : nœuds diagonaux des fronts des pôles 1 contre 0 : R1 gagne 7 fois sur 7 ; 1 contre 2 : R7 gagne 7 fois, aucun R1, 3 nuls ; 0 contre 2 : R7 3 fois sur 3 (voir H-DIAGONALES-TERRE). Script : `outils/diagonale_nul.js`.

### Diagonales des points des 4 mères (2026-11-22)

Grille mère × niveau. D1 = Feu M1, Air M2, Eau M3, Terre M4 ; D2 = D1 lue à l'envers (la figure retournée) ; D3 = Terre M1, Eau M2, Air M3, Feu M4 ; D4 = D3 retournée. Structure : la diagonale des mères est aussi celle des filles (transposition) ; D1 partage un niveau avec chacune des mères M1 à M4 et des filles M5 à M8 (D1 = M1 dans 1 thème sur 8) ; D2 et D4 n'apportent rien de plus que D1 et D3 (même partition des thèmes, figure retournée) ; D1+D2 = D3+D4 dans 1 thème sur 4. Aucune relation exacte avec les sommes des diagonales de maisons 1-6-11-16 et 4-7-10-13.

Sur 79 matchs, 168 cases testées : nul, meilleure case D1 = Tristitia (D2 = Laetitia, la même) 5 nuls sur 9, atteinte par hasard dans 14 % des mélanges ; vainqueur, meilleure case atteinte par hasard dans 47 % des mélanges. Pas de signal. Script : `outils/diagonales_meres.js`.

### Thème angulaire (2026-11-22)

Les figures des maisons angulaires M1, M4, M7, M10 deviennent les 4 mères d'un nouveau thème. Structure (65 536 thèmes) : ses mères sont M1, M4, M7, M10 ; sa M9 = M1+M4, sa M10 = M7+M10 (ses quatre premières maisons reprennent donc M1, M4, M7 et M10 du principal). Comme sa M1 est la M1 du principal, **R1 tombe toujours dans la même maison** dans les deux thèmes (65 536 sur 65 536) ; la figure de R1 est la même dans 10 752 thèmes. Les deux thèmes sont identiques dans 64 cas.

Sur 79 matchs, 49 cases : vainqueur, rien (meilleure case atteinte par hasard dans 97 % des mélanges ; le verdict du thème angulaire : 14 justes, 10 faux pour R1 ; 8 justes, 12 faux pour R7). Nul : la seule case forte est « R1 en M2 » (5 nuls sur 7), qui est exactement la règle H-ORDRE-R1M2 du thème principal, puisque la maison de R1 ne change pas. Le thème angulaire n'apporte rien de nouveau. Script : `outils/theme_angulaire.js`.

### Thème angulaire : les nœuds par rapport aux canaux (2026-11-22)

Nœuds (croisements des canaux, plein / mixte / vide) dans la boucle de front de chaque pôle, thème principal contre thème angulaire, 12 lectures (justes / faux, le plus fort gagne) :

| Lecture | Principal | Angulaire |
|---|---|---|
| nœuds pleins | 31 / 22 | 22 / 29 |
| pleins − vides | 31 / 20 | 22 / 28 |
| nœuds 4-7-10-13 | 31 / 18 | 18 / 25 |
| nœuds de la ligne et colonne Terre | 31 / 17 | 25 / 21 |
| coordonnées | 27 / 11 | 21 / 21 |
| nœuds diagonaux, Terre (verdict) | 31 / 7 | 23 / 13 |

Seul, le thème angulaire ne désigne rien (meilleur test atteint par hasard dans 57 % des mélanges ; ses nœuds tendent même à l'inverse). Mais il travaille avec le principal : quand ses nœuds pleins contredisent le verdict principal, le principal a raison 15 fois sur 17 ; quand le principal est à égalité (31 matchs), les nœuds diagonaux du thème angulaire désignent le vainqueur 10 fois sur 13 décidés (H-ANGULAIRE-RELAIS, candidate). Script : `outils/angulaire_noeuds.js`.

### Diagonales du thème angulaire, niveau par niveau (2026-11-22)

24 lectures par thème (diagonale 1-6-11-16, 4-7-10-13 ou les deux ; Feu, Air, Eau, Terre ; résultante ou base) dans le front de chaque pôle. Principal : seule la Terre porte le signal (les deux diagonales : 31 justes, 7 faux ; atteinte par hasard dans 0,1 % des mélanges) ; Feu et Air ne disent rien. Angulaire : aucune lecture significative seule (meilleure : Feu de 1-6-11-16, 7 / 19 à l'inverse, atteinte par hasard dans 31 % des mélanges).

Croisé (Terre des 2 nœuds diagonaux, écart principal × écart angulaire) : principal pour R1 et angulaire à égalité : R1 11, R7 1, 2 nuls ; principal à égalité et angulaire pour R1 : R1 9, R7 3, 1 nul ; principal pour R7 et angulaire à égalité : 6 nuls, R7 3, R1 0. Relais (principal, sinon angulaire) : 41 justes, 10 faux, 16 sans appel. Script : `outils/diagonales_angulaire.js`.

### Nœuds diagonaux : base contre résultante, et disposition des figures (2026-11-22)

Structure : la résultante d'une maison = base + figure de la maison. Sur les 8 nœuds diagonaux, seules M1 (Puer) et M10 (Carcer) ont une figure de maison à Terre impaire : ce sont les deux seuls nœuds où la maison inverse la Terre de la base ; ailleurs la Terre de la base passe telle quelle dans la résultante.

Sur 79 matchs (front de chaque pôle, le plus fort gagne) : Terre des résultantes 31 justes / 7 faux ; Terre des bases 21 / 20 (rien) ; base ouverte rendue saturée par la maison 24 / 6 ; base saturée rendue ouverte 6 / 18 (c'est le pôle qui en a le moins qui gagne). Par nœud : base ouverte, résultante saturée : le pôle marque 36 fois sur 41, 2,29 buts pour, 1,17 contre ; base saturée, résultante ouverte : 21 sur 33, 1,24 pour, 2,55 contre. La figure posée (propre, alliée, ennemie, proie) ne départage rien (au mieux 15 / 14). Script : `outils/diagonales_dispositions.js`.

### M1 et M10 (2026-11-22)

M1 (nœud Feu × Feu, front A) et M10 (Air × Eau, front B) sont les seuls nœuds diagonaux où la maison inverse la Terre de la base (Puer et Carcer ont la Terre impaire). Exact : résultante de M1 + Puer = maison de R1 ; la résultante de M1 désigne la maison de R1 (Aquisitio ⇔ R1 en M2 : 5 nuls sur 7 ; Populus ⇔ R1 en M1 : 0 nul sur 10).

Pôle du front A : M1 saturée, 19 victoires sur 25 (2,40 buts pour, 0,92 contre) ; ouverte, 2 sur 10 (1,70 pour, 3,30 contre). Pôle du front B : M10 saturée, 8 sur 16 ; ouverte, 6 sur 23 (1,04 pour, 2,22 contre). Liaisons Terre M1–M5 et M10–M14 (parité) : deux arrêts, R1 14, R7 3, 3 nuls ; deux liées, 6 nuls sur 18. Candidate H-M1-M10. Script : `outils/m1_m10.js`.

### M1, M3, M5, M7, M10 : fermées, ouvertes, mobiles, fixes (2026-11-22)

Classes (nombre de niveaux saturés) : fermante (1 : Puer, Caput, Cauda Draconis, Puella), ouvrante (3 : Laetitia, Albus, Rubeus, Tristitia), mobile (2, Terre saturée : Amissio, Fortuna Minor, Conjunctio), fixe (2, Terre ouverte : Carcer, Fortuna Major, Aquisitio), tout ouverte (Via), toute fermée (Populus). Sur 79 matchs, 67 cases (classe de la base et de la résultante de chaque maison, nombres de mobiles et de fixes) : nul, meilleure case « résultante de M1 fixe » 6 nuls sur 13 (atteinte par hasard dans 21 % ; elle contient les thèmes où R1 est en M2, car résultante de M1 Aquisitio ⇔ R1 en M2) ; vainqueur, rien (57 %). Côté des pôles (ces maisons dans le front de la figure du pôle) : le plus de résultantes mobiles gagne 15 fois, perd 5 ; le plus de bases mobiles gagne 8, perd 17 (la maison qui rend mobile ce qui ne l'était pas aide le pôle) ; peu de matchs départagés. Script : `outils/classes_m1_3_5_7_10.js`.

### Résultantes mobiles dans le front du pôle (2026-11-22)

Les 4 maisons du front de la figure de chaque pôle, classe de leur résultante. Le plus de résultantes mobiles gagne 22 fois, perd 11 ; rendues mobiles par la maison 21 / 11 ; bases mobiles 20 / 23 (rien) ; fixes 15 / 20 ; Via 7 / 14 (Via fait perdre) ; Populus 16 / 10 ; mobiles + Populus (Terre saturée et au moins 2 niveaux saturés) 30 / 13. Meilleur des 9 tests atteint par hasard dans 7 % des mélanges. Pôle sans aucune résultante mobile ni Populus dans son front : 1,3 but pour, 2,5 contre. Face au verdict : quand les nœuds diagonaux ne tranchent pas, les mobiles font 6 justes, 6 faux ; elles ne complètent pas le verdict, elles en sont une autre face (la Terre saturée). Rang de la maison et figure mobile (Fortuna Minor, Conjunctio, Amissio) : aucune différence. Script : `outils/mobiles_front.js`.

### Ancrage : front du pôle contre binôme (2026-11-22)

Ancrage = figure posée dans sa propre maison (en base, ou en base ou résultante). Sur 79 matchs (le plus ancré gagne / perd) : en base, front du pôle 16 / 10, front du binôme 11 / 13, figure du pôle 16 / 7, figure du binôme 3 / 5 ; en base ou résultante, front du pôle 20 / 12, front du binôme 18 / 18. Face à face (front et binôme désignent des pôles opposés) : le front a raison 8 fois contre 5 (en base), 10 contre 7 (base ou résultante). L'ancrage du front du pôle compte plus que celui du binôme, et la figure du pôle ancrée elle-même est le meilleur indice (pôle ancré : 2,5 buts pour, 1,5 contre ; sinon 1,6 / 1,9) ; mais aucun test n'est significatif (meilleur atteint par hasard dans 40 % des mélanges). Script : `outils/ancrage_front_binome.js`.

### Attaque et défense (2026-11-22)

Défense d'un pôle : son antagoniste (f−3) posé en base et son protecteur (f−6) absent = défense percée. Sur 79 matchs : défense percée, le pôle encaisse 2,11 buts (clean sheet 7 sur 46) ; protégée (protecteur posé, pas d'antagoniste) 1,48 (13 sur 44) ; calme 1,47 ; attaque bloquée par le protecteur 1,90. Antagoniste posé dans le front du pôle sans protecteur : 2,10 encaissés contre 1,69. Défense seule (une tient, l'autre percée) : 20 victoires, 11 défaites. Attaque (parité équilibrée) contre défense adverse : forte contre percée, 16 pôles sur 17 marquent (2,29 buts) ; faible contre tenue, 48 sur 74 (1,53). Attaque + défense : le pôle le plus complet gagne 24 fois, perd 13. Face au verdict : quand verdict et défense sont d'accord, 14 justes, 2 faux ; quand ils s'opposent, le verdict a raison 7 fois sur 10 ; sans appel, la défense seule fait 3 justes, 2 faux. Script : `outils/attaque_defense.js`.

### Le nul par l'équilibre des diagonales entre les deux pôles (2026-11-22)

80 matchs, 15 nuls (19 %). 63 cases : catégorie du verdict, égalité des sommes des nœuds diagonaux des deux pôles, même profil par niveau, écart de saturation, liaisons par parité entre les nœuds des deux pôles (chaque niveau, chaque diagonale), somme des 4 nœuds des deux pôles, sommes des diagonales entières. Meilleure case : somme des 8 résultantes diagonales à 3 niveaux impairs, 9 nuls sur 24 (38 %) ; atteinte par hasard dans 21 % des mélanges. Aucune lecture d'équilibre des diagonales ne tient le nul. Cases sans aucun nul (8 matchs chacune) : verdict par les coordonnées seules, somme des 4 nœuds des deux pôles = Rubeus, somme des 8 = Conjunctio. Script : `outils/diagonales_nul2.js`.
