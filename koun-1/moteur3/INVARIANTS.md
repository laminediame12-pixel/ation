# Propriétés invariantes de la structure

Vraies pour les 65 536 thèmes (tout l'espace des thèmes : preuve par énumération). `node outils/invariants.js` les revérifie (58 contrôles). Elles décrivent la structure ; aucune ne parle encore d'un score. « Saturé » = niveau à 2 points ; la résultante d'une maison est sa base + sa figure de repos.

## I1 — La diagonale de transposition
Les mères (M1 à M4) et les filles (M5 à M8) partagent leur diagonale, et cela se lit sur les résultantes :
- **Feu** : M1 et M5 sont saturées ensemble (ou aucune des deux).
- **Air** : M2 et M6 sont saturées ensemble.
- **Eau** : M3 et M7 sont toujours opposées : exactement une des deux est saturée.
- **Terre** : M4 et M8 sont toujours opposées : exactement une des deux est saturée.

## I2 — Huit lois de conservation
Pour chaque triple de maisons issu de la construction du thème, le nombre de niveaux **non** saturés (1 point) à chaque niveau a une parité fixe. Cela vaut pour tout thème.

| Triple | Nombre impair de niveaux non saturés à : |
|---|---|
| M1 + M2 + M9 | Feu, Terre |
| M3 + M4 + M10 | Feu, Air |
| M5 + M6 + M11 | Eau, Terre |
| M7 + M8 + M12 | Air, Eau |
| M9 + M10 + M13 | Feu, Eau, Terre |
| M11 + M12 + M14 | Feu, Air, Eau |
| M13 + M14 + M15 | aucun (A + B = C sur la branche gauche) |
| M1 + M15 + M16 | Feu |

Aux autres niveaux, le nombre est pair. Conséquence : à un niveau « impair », trois maisons d'un triple ne sont jamais toutes saturées.

## I3 — Les 32 liaisons des fronts
Une liaison (front, axe, niveau) est connectée quand les deux résultantes opposées saturent le niveau.
- Chacune est connectée dans exactement 1/4 des thèmes (16 384 sur 65 536).
- **14 couples de liaisons ne sont jamais connectés ensemble**, et aucune implication ni équivalence n'existe entre deux liaisons.
- Le nombre de liaisons connectées par thème va de 0 à 19.

Les 14 exclusions :
- Front A : vertical Feu ✕ horizontal Air ; vertical Feu ✕ front B vertical Feu ; vertical Eau ✕ front C horizontal Air ; vertical Terre ✕ front B vertical Terre ; vertical Terre ✕ front D horizontal Feu ; vertical Terre ✕ front D horizontal Air ; horizontal Eau ✕ front C vertical Feu ; horizontal Terre ✕ front D vertical Feu.
- Front B : vertical Eau ✕ front C horizontal Air.
- Front C : vertical Eau ✕ horizontal Eau ; vertical Terre ✕ front D horizontal Eau ; horizontal Terre ✕ front D vertical Eau ; horizontal Terre ✕ front D vertical Terre.
- Front D : vertical Terre ✕ horizontal Terre.

## I4 — Bornes
- Sur les 16 résultantes, le nombre de niveaux saturés est toujours entre 17 et 47 (sur 64).
- Les résultantes des quatre maisons du canal Eau (ou du canal Terre) ont toujours au moins 2 niveaux saturés au total ; pour les canaux Feu et Air, il peut n'y en avoir aucun.

## I5 — Les 16 lois de transposition (toutes les égalités entre deux niveaux de deux maisons)
Le niveau l' de la mère M(m+1) est le même que le niveau m de la fille M(5+l') : les filles sont les colonnes des mères. Sur les résultantes, ces deux niveaux sont saturés ensemble (=) ou toujours opposés (≠), selon les figures de repos. C'est la liste complète des lois entre deux niveaux : il n'en existe pas d'autres.

| Mère | Feu avec… | Air avec… | Eau avec… | Terre avec… |
|---|---|---|---|---|
| M1 | M5 Feu = | M6 Feu = | M7 Feu = | M8 Feu ≠ |
| M2 | M5 Air = | M6 Air = | M7 Air ≠ | M8 Air = |
| M3 | M5 Eau ≠ | M6 Eau = | M7 Eau ≠ | M8 Eau ≠ |
| M4 | M5 Terre ≠ | M6 Terre = | M7 Terre ≠ | M8 Terre ≠ |

La diagonale est I1.

## I6 — Quelles maisons déterminent le thème
- **55 ensembles de 4 maisons seulement** (sur 1 820) déterminent tout le thème : deux thèmes différents ont toujours des figures différentes dans au moins une de ces 4 maisons. Les 4 mères en sont un, les 4 filles un autre.
- **Aucun de ces ensembles ne contient à la fois une mère et une fille** : chaque mère est liée à chaque fille par une loi de I5.
- **M15 n'appartient à aucun de ces ensembles** : c'est la somme de M1 à M8, elle ne porte aucune information propre. M3, M4 et M13 sont dans 19 de ces ensembles, M13 et M16 dans 13 ou plus.
- La liste complète s'obtient avec `node outils/invariants.js --liste`.

## I7 — Les 84 lois à trois niveaux
Ce sont les 8 triples de construction (I2) vus à chacun des 4 niveaux, où chaque niveau d'une maison de M1 à M8 peut être remplacé par son jumeau de transposition (I5). Il n'y en a pas d'autres.

| Triple | Formes par niveau | Lois |
|---|---|---|
| M1 + M2 + M9 | 4 | 16 |
| M3 + M4 + M10 | 4 | 16 |
| M5 + M6 + M11 | 4 | 16 |
| M7 + M8 + M12 | 4 | 16 |
| M9 + M10 + M13 | 1 | 4 |
| M11 + M12 + M14 | 1 | 4 |
| M13 + M14 + M15 | 1 | 4 |
| M1 + M15 + M16 | 2 | 8 |
| **Total** | | **84** |

Parité : celle du triple de départ, inversée à chaque remplacement par un jumeau « ≠ » de I5. Exemple : M5 + M6 + M11 au Feu a un nombre pair de niveaux non saturés ; en remplaçant M5 Feu par son jumeau M1 Feu (« = »), on obtient « M1 Feu + M6 Feu + M11 Feu : nombre pair ».
43 de ces lois mêlent des niveaux différents, 41 sont d'un seul niveau.

## I8 — Il n'y a rien d'autre
Les 16 lois de transposition (I5) et les 32 lois de construction (8 triples × 4 niveaux, I2) sont indépendantes (rang 48). Un thème a 64 niveaux de maisons pour 16 degrés de liberté (les 4 mères) : il n'y a que 64 − 16 = 48 lois indépendantes. **Toute loi entre niveaux de maisons est donc une combinaison de ces 48.**

## I9 — Les fronts entre eux : degrés de liberté
Les 4 bases des maisons d'un même front (canal : A = M1, M5, M9, M13 ; B = M2, M6, M10, M14 ; C = M3, M7, M11, M15 ; D = M4, M8, M12, M16) ne sont pas libres :

| Front | Configurations possibles de ses 4 bases (sur 65 536) |
|---|---|
| A | 8 192 (1/8) |
| B | 4 096 (1/16) |
| C | 4 096 (1/16) |
| D | 8 192 (1/8) |

- Pour deux fronts, les 8 maisons **déterminent tout le thème** pour A+C, A+D, B+C, B+D et C+D. **A+B est la seule paire qui ne le fait pas** (32 768 configurations) : il manque un degré de liberté.

## I10 — Lois internes à chaque front
Toutes les lois entre niveaux des 4 maisons d'un front (parité du nombre de niveaux non saturés des résultantes). Nombre de lois : A 7 (3 indépendantes), B 15 (4), C 15 (4), D 7 (3). Les plus courtes :

| Front | Loi | Non saturés |
|---|---|---|
| A | M1 Feu + M5 Feu | pair |
| A | M1 Feu + M5 Air + M9 Feu | impair |
| A | M5 Feu + M5 Air + M9 Feu | impair |
| B | M2 Air + M6 Air | pair |
| B | M6 Eau + M6 Terre + M10 Air | impair |
| C | M3 Eau + M7 Eau | impair |
| C | M3 Feu + M3 Air + M11 Eau | pair |
| C | M15 Feu + M15 Air + M15 Eau + M15 Terre | pair |
| D | M4 Terre + M8 Terre | impair |
| D | M4 Eau + M4 Terre + M12 Terre | pair |
| D | M4 Eau + M8 Terre + M12 Terre | impair |

- **Le Juge M15 est toujours pair** (nombre pair de niveaux à un point) : c'est une loi interne du front C, et elle retrouve la règle classique de la géomancie.
- Ces lois internes expliquent les exclusions de I3 qui restent dans un front (A vertical Feu ✕ A horizontal Air, C vertical Eau ✕ C horizontal Eau, D vertical Terre ✕ D horizontal Terre).

## I11 — La couche des fronts
- Les fronts des 16 maisons ne prennent que **4 096 configurations** sur 65 536 thèmes (chacune 16 fois) : 12 degrés de liberté et 20 lois entre fronts.
- Chaque maison est la somme de Klein de ses constituantes : front(M9) = front(M1) + front(M2), …, front(M16) = front(M15) + front(M1) (A+B=C, A+C=B, A+D=A, B+C=A, B+D=B, C+D=C, X+X=D).
- **Les fronts de M5 et M6 sont la transposée de ceux de M1 et M2** : Feu(M5) = Feu(M1), Air(M5) = Feu(M2), Feu(M6) = Air(M1), Air(M6) = Air(M2). Le front de M7 et de M8 n'est pas déterminé par les fronts de M1 et M2 : il dépend aussi de leur Eau et de leur Terre.
