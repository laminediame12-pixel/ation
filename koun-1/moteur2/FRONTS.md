# Les sommes à l'intérieur des fronts

Document produit par `outils/fronts_doc.js`. On additionne deux figures d'un même front (somme géomantique, ligne par ligne) et on note la figure obtenue par son numéro.

## Le fait général

La somme de deux figures d'un même front est toujours **4 (Albus), 8 (Tristitia) ou 12 (Fortuna Major)** : trois figures du front D, dont les maisons sont des maisons de Terre.

- Deux **miroirs** (k et k+8) donnent toujours **8**.
- Deux **voisines de front** (k et k+4) donnent **4 ou 12**, en alternance quand on fait le tour du front.

## Front par front

Pour chaque figure, la somme avec ses trois compagnes de front, prises dans l'ordre du cercle (la suivante k+4, le miroir k+8, la précédente k+12).

### Front A : 1 - 5 - 9 - 13

| Figure | avec la suivante | avec le miroir | avec la précédente | Ordre |
|---|---|---|---|---|
| 1 Puer | 1 + 5 = **4** | 1 + 9 = **8** | 1 + 13 = **12** | 4 - 8 - 12 |
| 5 Via | 5 + 9 = **12** | 5 + 13 = **8** | 5 + 1 = **4** | 12 - 8 - 4 |
| 9 Fortuna Minor | 9 + 13 = **4** | 9 + 1 = **8** | 9 + 5 = **12** | 4 - 8 - 12 |
| 13 Cauda Draconis | 13 + 1 = **12** | 13 + 5 = **8** | 13 + 9 = **4** | 12 - 8 - 4 |

Moitiés du départage : 1-5 et 9-13. Somme de chaque moitié : 1 + 5 = **4**, 9 + 13 = **4**. Entre les deux moitiés : 5 + 9 = **12**, 13 + 1 = **12**.

### Front B : 2 - 6 - 10 - 14

| Figure | avec la suivante | avec le miroir | avec la précédente | Ordre |
|---|---|---|---|---|
| 2 Laetitia | 2 + 6 = **4** | 2 + 10 = **8** | 2 + 14 = **12** | 4 - 8 - 12 |
| 6 Amissio | 6 + 10 = **12** | 6 + 14 = **8** | 6 + 2 = **4** | 12 - 8 - 4 |
| 10 Carcer | 10 + 14 = **4** | 10 + 2 = **8** | 10 + 6 = **12** | 4 - 8 - 12 |
| 14 Puella | 14 + 2 = **12** | 14 + 6 = **8** | 14 + 10 = **4** | 12 - 8 - 4 |

Moitiés du départage : 2-6 et 10-14. Somme de chaque moitié : 2 + 6 = **4**, 10 + 14 = **4**. Entre les deux moitiés : 6 + 10 = **12**, 14 + 2 = **12**.

### Front C : 3 - 7 - 11 - 15

| Figure | avec la suivante | avec le miroir | avec la précédente | Ordre |
|---|---|---|---|---|
| 3 Caput | 3 + 7 = **12** | 3 + 11 = **8** | 3 + 15 = **4** | 12 - 8 - 4 |
| 7 Rubeus | 7 + 11 = **4** | 7 + 15 = **8** | 7 + 3 = **12** | 4 - 8 - 12 |
| 11 Conjunctio | 11 + 15 = **12** | 11 + 3 = **8** | 11 + 7 = **4** | 12 - 8 - 4 |
| 15 Aquisitio | 15 + 3 = **4** | 15 + 7 = **8** | 15 + 11 = **12** | 4 - 8 - 12 |

Moitiés du départage : 3-7 et 11-15. Somme de chaque moitié : 3 + 7 = **12**, 11 + 15 = **12**. Entre les deux moitiés : 7 + 11 = **4**, 15 + 3 = **4**.

### Front D : 4 - 8 - 12 - 16

| Figure | avec la suivante | avec le miroir | avec la précédente | Ordre |
|---|---|---|---|---|
| 4 Albus | 4 + 8 = **12** | 4 + 12 = **8** | 4 + 16 = **4** | 12 - 8 - 4 |
| 8 Tristitia | 8 + 12 = **4** | 8 + 16 = **8** | 8 + 4 = **12** | 4 - 8 - 12 |
| 12 Fortuna Major | 12 + 16 = **12** | 12 + 4 = **8** | 12 + 8 = **4** | 12 - 8 - 4 |
| 16 Populus | 16 + 4 = **4** | 16 + 8 = **8** | 16 + 12 = **12** | 4 - 8 - 12 |

Moitiés du départage : 4-8 et 12-16. Somme de chaque moitié : 4 + 8 = **12**, 12 + 16 = **12**. Entre les deux moitiés : 8 + 12 = **4**, 16 + 4 = **4**.

## Ce que cela montre

- **Dans chaque moitié, les deux figures ont le même ordre renversé.** Dans le front A : 1 donne 4 - 8 - 12 et 5 donne 12 - 8 - 4 ; puis 9 donne 4 - 8 - 12 et 13 donne 12 - 8 - 4. Le milieu (le miroir, 8) ne bouge pas, les deux extrémités s'échangent.
- **Les deux moitiés d'un front ont toujours la même somme**, et le lien entre les deux moitiés a l'autre somme.
- **Fronts A et B : chaque moitié vaut 4 (Albus)**, et le passage d'une moitié à l'autre vaut 12 (Fortuna Major).
- **Fronts C et D : chaque moitié vaut 12 (Fortuna Major)**, et le passage vaut 4 (Albus). Les moitiés retenues pour C (3-7, 11-15) et D (4-8, 12-16) ne se comportent donc pas comme celles de A et B.
- **Avec la table des points cardinaux des fronts**, la règle devient la même partout : Est + Nord = 4 et Ouest + Sud = 4 dans les quatre fronts (A : 1+5, 9+13 ; B : 2+6, 10+14 ; C : 3+15, 11+7 ; D : 4+16, 12+8).

## Conséquence pour le départage du même front

Le moteur garde les moitiés données par le propriétaire (C : 3-7 et 11-15 ; D : 4-8 et 12-16). Le seul match réel du front D, 9·13·2·13, leur donne raison : Albus (4) gagne parce que son partenaire Tristitia (8) est chez lui. Avec des moitiés « Est-Nord » (4-16 et 12-8), ce match aurait été donné à l'autre pôle. Rien n'est donc changé ; la différence entre A-B et C-D est seulement notée ici.
