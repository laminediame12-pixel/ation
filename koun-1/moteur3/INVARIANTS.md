# Propriétés invariantes de la structure

Vraies pour les 65 536 thèmes (tout l'espace des thèmes : preuve par énumération). `node outils/invariants.js` les revérifie (108 contrôles). Elles décrivent la structure ; aucune ne parle encore d'un score. « Saturé » = niveau à 2 points ; la résultante d'une maison est sa base + sa figure de repos.

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

## I12 — Le miroir et l'antagoniste
- **Le miroir (n ↔ n+8) inverse seulement le niveau Terre.** Chaque figure + son miroir = Tristitia (2221), pour les 8 paires : Puer 1121 ↔ Fortuna Minor 1122, Tristitia 2221 ↔ Populus 2222, etc. Feu, Air et Eau sont identiques, la Terre est inversée. Tristitia est l'« opérateur miroir ».
- L'antagoniste (n−3) et le miroir commutent : l'antagoniste du miroir est le miroir de l'antagoniste. Figure + miroir de son antagoniste ne prend que 5 valeurs : Caput, Via, Fortuna Minor, Conjunctio, Cauda Draconis.
- **Deux maisons miroir ont la même résultante** quand elles portent leurs antagonistes : R(h) = R(h+8). C'est pourquoi, dans la carte en croix, les résultantes opposées (haut/bas, gauche/droite) sont la même figure.
- **M8 est la seule maison** dont la résultante (avec son antagoniste) est l'antagoniste de sa maison miroir.

## I13 — Quels antagonistes peuvent être en place ensemble
Deux lectures d'« antagoniste dans la maison ennemie » :
- **attaquant** : la maison h porte en base la figure h−3 (l'antagoniste ancré chez la victime, lecture de la carte) ;
- **victime** : la maison h porte en base la figure h+3 (la figure dans la maison de son antagoniste, `enMaisonAntagoniste` du moteur).

| | Attaquant | Victime |
|---|---|---|
| Ensembles de maisons qui peuvent porter ensemble leur antagoniste (sur 65 536 ensembles) | 841 | 638 |
| Maximum simultané | 6 (28 thèmes) | 7 (1 seul thème : 4-8-15-13, M1, M5, M7, M8, M9, M14, M16) |
| Thèmes sans aucun placement | 21 831 | 25 823 |
| Avec 1, 2, 3, 4, 5, 6 placements | 24 726 · 13 454 · 4 336 · 983 · 178 · 28 | 23 842 · 11 171 · 3 717 · 825 · 144 · 13 |

Maisons qui ne peuvent jamais le faire ensemble (minimaux) :
- Attaquant : 26 couples, 23 triples, 16 quadruplets, 6 quintuplets. Couples : M4+M5, M3+M6, M1+M7, M3+M7, M3+M8, M6+M9, M7+M9, M6+M10, M7+M10, M1+M11, M2+M11, M4+M11, M9+M11, M1+M12, M4+M12, M9+M12, M6+M13, M7+M13, M8+M13, M12+M13, M1+M14, M2+M14, M3+M14, M4+M14, M9+M14, M14+M16. Les triples de construction M1+M2+M9, M3+M4+M10, M5+M6+M11, M7+M8+M12, M9+M10+M13, M11+M12+M14 sont aussi impossibles.
- Victime : 1 maison seule (M15 ne peut jamais porter Laetitia : le Juge est toujours pair), 22 couples, 14 triples, 8 quadruplets, 6 quintuplets. Couples : M2+M5, M3+M5, M4+M5, M1+M6, M4+M6, M2+M7, M3+M7, M4+M7, M3+M8, M6+M10, M8+M10, M1+M11, M9+M11, M1+M12, M2+M12, M3+M12, M4+M12, M9+M12, M5+M13, M11+M13, M2+M14, M13+M14.
- La liste complète s'obtient avec `node outils/invariants.js --liste`.

## I14 — Le binôme et le miroir sont des translations
- **Miroir** : n ↦ n + Tristitia (inversion du niveau Terre), pour toutes les figures.
- **Binôme** (couples 1-3, 2-4, 5-7, …) : n ↦ n + Amissio (1212) dans les blocs M1-4 et M9-12, n ↦ n + Puella (1211) dans les blocs M5-8 et M13-16.
- **Puella = Amissio + Tristitia** : dans les blocs impairs, le binôme est le miroir du binôme des blocs pairs. Binôme et miroir commutent.
- Avec leurs antagonistes en place, **les résultantes de deux maisons binômes des fronts A et C sont miroir l'une de l'autre** (M1-M3 : Conjunctio et Caput, etc.) ; jamais pour les fronts B et D.

## I15 — Les quartets
Les orbites des maisons sous le binôme et le miroir sont quatre quartets : **{M1, M3, M9, M11}, {M2, M4, M10, M12}, {M5, M7, M13, M15}, {M6, M8, M14, M16}**.
- La somme des figures de repos de chaque quartet est Populus.
- Les 4 bases d'un quartet ne prennent que 8 192 configurations (1/8) ; **deux quartets quelconques déterminent tout le thème**.
- Chaque quartet a 7 lois internes (3 indépendantes). Exemples : M1 Feu + M1 Air + M11 Feu : pair ; M3 Feu + M3 Air + M11 Eau : pair ; dans le quartet de M15, M15 Feu + Air + Eau + Terre : pair (le Juge).

## I16 — Le binôme ou le miroir dans la maison
Quels ensembles de maisons peuvent porter ensemble leur binôme (b = binôme de h), ou leur miroir (b = miroir de h) ?

| | Binôme | Miroir |
|---|---|---|
| Ensembles possibles (sur 65 536) | 380 | 568 |
| Maximum simultané | 5 (32 thèmes) | 6 (9 thèmes) |
| Thèmes avec 0, 1, 2, 3, 4, 5, 6 placements | 23 449 · 26 604 · 12 166 · 2 796 · 489 · 32 | 25 350 · 24 400 · 11 357 · 3 524 · 780 · 116 · 9 |
| Impossibles minimaux (1, 2, 3, 4, 5 maisons) | 1 · 32 · 8 · 13 · 1 | 1 · 24 · 11 · 7 · 3 |

Dans les deux cas, **la seule maison impossible seule est M15** : le Juge est toujours pair, or son binôme (Cauda) et son miroir (Rubeus) sont impairs. Les listes de couples s'obtiennent avec `node outils/invariants.js --liste`.

## I17 — Le cycle d'attaque et les quatre axes
- L'attaque h → h+3 est **un seul cycle de 16 maisons** : 1 → 4 → 7 → 10 → 13 → 16 → 3 → 6 → 9 → 12 → 15 → 2 → 5 → 8 → 11 → 14.
- Il se découpe en quatre axes de quatre attaquants consécutifs : **{M1, M4, M7, M10}** (l'axe angulaire), {M13, M16, M3, M6}, {M9, M12, M15, M2}, {M5, M8, M11, M14}.
- Chaque axe contient une maison de chaque front, **toujours dans l'ordre A, D, C, B** : c'est le cercle des fronts.
- Les 4 bases d'un axe prennent 8 192, 16 384, 8 192 et 65 536 configurations (axes 1 à 4) ; l'axe 4 {M5, M8, M11, M14} détermine tout le thème. La somme des figures de repos est Albus pour les axes 1 et 3, Fortuna Major pour les axes 2 et 4.

## I18 — La somme de l'axe angulaire
- **S = M1 + M4 + M7 + M10 est toujours égale à M1 + M3 + M7** (M10 = M3 + M4, M4 s'annule).
- **Le niveau Eau de S est toujours celui de M1.** Pour le Feu, l'Air et la Terre, S et M1 s'accordent dans exactement la moitié des thèmes.
- Les 4 sommes d'axe n'ont qu'une seule loi entre leurs 16 niveaux : le nombre de niveaux Feu, Air et Terre à un point des sommes des axes 2, 3 et 4 est toujours pair.
- **Validation FI-5 (sans le jour)** : les 8 combinaisons des 3 critères existent toutes. 8 785 thèmes les remplissent tous (le moteur compte aussi 8 785). Effectifs : binôme de M1 en maison angulaire 21 632 ; somme de l'axe en maison angulaire 32 608 ; somme 3-5-11-15 présente 57 171.

## I19 — Les maisons angulaires
- Les 4 bases de M1, M4, M7, M10 ne prennent que 8 192 configurations (1/8). Lois internes : M1 Eau et M7 Feu sont saturés ensemble ; M4 Eau et M7 Terre sont toujours opposés ; M4 Eau + M7 Eau + M10 Eau : nombre impair de niveaux non saturés.

## I20 — Les sommes des quatre axes
S1 = M1+M4+M7+M10 (axe angulaire), S2 = M13+M16+M3+M6, S3 = M9+M12+M15+M2, S4 = M5+M8+M11+M14. Toujours :

| Somme | Égale à |
|---|---|
| S1 | M1 + M3 + M7 |
| S3 | **M12 + M16** (deux maisons seulement) |
| S4 | **M5 + M7** (deux maisons seulement) |
| S2 | aucun ensemble de 3 maisons ou moins : la plus irréductible |
| S1 + S2 | M5 + M8 |
| S1 + S3 | M3 + M8 + M15 |
| S1 + S4 | M1 + M3 + M5 |
| S2 + S3 | M3 + M5 + M15 |
| S2 + S4 | M1 + M3 + M8 |
| S3 + S4 | M5 + M8 + M16 |

- **La somme des 15 premières maisons est toujours Populus** (M1+…+M15 = 0), donc la somme des 16 maisons vaut M16.
- La somme des résultantes d'un axe est sa somme de bases plus Albus (axes 1 et 3) ou Fortuna Major (axes 2 et 4).

## I21 — Lois internes des axes 2, 3, 4
- **Axe 2** (M13, M16, M3, M6) : rang 14, 3 lois internes. Exemple : M3 Air et M6 Eau saturés ensemble.
- **Axe 3** (M9, M12, M15, M2) : rang 13, 7 lois internes, dont le Juge M15 pair.
- **Axe 4** (M5, M8, M11, M14) : aucune loi interne. Ses 4 maisons sont libres et déterminent tout le thème.

## I22 — La somme d'un axe dans son axe
- La somme d'un axe est présente dans les maisons de son axe (base ou résultante) pour 32 608 · 24 376 · 27 232 · 27 120 thèmes (axes 1 à 4).
- Le quadruplet (S1, S2, S3, S4) prend 32 768 valeurs (2 puissance 15), chacune pour exactement 2 thèmes : les quatre sommes d'axe ne distinguent pas deux thèmes sur deux.

## I23 — Rubeus dans toutes les maisons
Rubeus (7, 2122) : seul l'Air est à un point. Son binôme est Via, son miroir Aquisitio, son antagoniste Albus ; il est lui-même l'antagoniste de la maison M10 (Carcer). Résultante de Rubeus en base de chaque maison :

| Maison (figure de repos) | Résultante de Rubeus | Niveaux saturés |
|---|---|---|
| M1 Puer | 10 Carcer | Air+Eau |
| M2 Laetitia | 9 Fortuna Minor | Eau+Terre |
| M3 Caput | 12 Fortuna Major | Feu+Air |
| M4 Albus (chez son antagoniste Albus) | 11 Conjunctio | Feu+Terre |
| M5 Via | 14 Puella | Air |
| M6 Amissio | 13 Cauda Draconis | Terre |
| M7 Rubeus (sa propre maison) | 16 Populus | Feu+Air+Eau+Terre |
| M8 Tristitia | 15 Aquisitio | Feu+Eau |
| M9 Fortuna Minor | 2 Laetitia | Air+Eau+Terre |
| M10 Carcer (l'attaquant dans la maison qu'il attaque) | 1 Puer | Eau |
| M11 Conjunctio | 4 Albus | Feu+Air+Terre |
| M12 Fortuna Major | 3 Caput | Feu |
| M13 Cauda Draconis | 6 Amissio | Air+Terre |
| M14 Puella | 5 Via | aucun |
| M15 Aquisitio | impossible : Rubeus est impair, le Juge est pair | |
| M16 Populus | 7 Rubeus | Feu+Eau+Terre |

- **Fréquence** : Rubeus est en base de chaque maison dans exactement 4 096 thèmes (1/16), et résultante de chaque maison dans 4 096, **sauf M15 où il n'est jamais** (le Juge est pair). Il est absent du thème (ni base ni résultante) dans 8 764 thèmes sur 65 536 ; au plus 7 en base (6 thèmes), 5 en résultante, 9 au total.
- **Ce que Rubeus impose ailleurs** : en base de M1 à M4, le niveau k des filles M5 à M8 reproduit Rubeus (M5 saturé, M6 à un point, M7 et M8 saturés pour le niveau k), et M11, M12, M14 en découlent (1 point, saturé, 1 point). En base de M5 à M8, c'est le niveau des mères M1 à M4 qui le reproduit, et M9, M10, M13 en découlent. En M16, M14 Feu est à un point. En M9 à M14 : rien n'est imposé ailleurs.
- **Rubeus en base de plusieurs maisons** : 593 ensembles de maisons possibles, 7 au plus. Impossibles minimaux : M15 seule, 25 couples, 13 triples, 10 quadruplets, 4 quintuplets.
- **Rubeus en résultante de plusieurs maisons** : 317 ensembles possibles, 5 au plus. Impossibles minimaux : M15 seule, 34 couples, 14 triples, 7 quadruplets, 3 quintuplets.
- La liste des couples s'obtient avec `node outils/invariants.js --liste`.
