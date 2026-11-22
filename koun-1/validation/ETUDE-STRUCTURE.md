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
