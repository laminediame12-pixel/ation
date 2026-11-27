# Déchiffrage de la matrice des 256 combinaisons (propriétaire, 2026-11-27), vérifié par le calcul

Matrice : figure g (ligne) posée en maison h (colonne) → résultante g + h (niveau par niveau : identiques → 2, différents → 1).

1. **La saturation Terre saute une maison, sauf en 6–7 et 14–15** — exact. La Terre de la résultante est saturée quand la figure et la maison ont la même Terre.
   Or la Terre des figures-maisons suit M1 1, M2 2, M3 1, M4 2, M5 1, M6 2, **M7 2**, M8 1, M9 2, M10 1, M11 2, M12 1, M13 2, M14 1, **M15 1**, M16 2 :
   elle alterne partout, sauf entre M6 et M7 (Amissio, Rubeus : 2, 2) et entre M14 et M15 (Puella, Aquisitio : 1, 1). Toutes les lignes ont donc le même
   rythme décalé (ex. Puer : B·B·B··B·B·B·BB·).
2. **Toute figure chez elle est saturée à tous les niveaux** — exact : g + g = Populus (diagonale).
3. **En M15, 4 saturées en Terre et 4 non** — à corriger : chaque colonne, M15 comprise, a 8 figures saturées en Terre et 8 non (celles qui ont la même
   Terre que la figure de la maison). Par front, c'est 2 et 2 : c'est peut-être ce que donne le compte de 4.
4. **Trajectoires** — exact et général : chaque figure apparaît une seule fois par ligne et une seule fois par colonne (la matrice est un carré latin).
   La trajectoire de la résultante X est l'ensemble des 16 cases « g en maison g + X ».
   - **Populus** : la diagonale, chaque figure chez elle ; tous les niveaux saturés, entièrement actif.
   - **Via** : chaque figure posée dans la maison de son opposé (tous les niveaux inversés : Puer → M4, Laetitia → M3, Caput → M2, Albus → M1, Via → M16,
     Amissio → M15, Rubeus → M14, Tristitia → M13, Fortuna Minor → M12, Carcer → M11, Conjunctio → M10, Fortuna Major → M9, Cauda → M8, Puella → M7,
     Aquisitio → M6, Populus → M5). Aucun niveau saturé : trajectoire inactive.
   - Les 14 autres trajectoires sont actives sur les niveaux saturés de leur figure (ex. Cauda : Terre seule ; Tristitia : Feu, Air, Eau).

## Fouille sur les matchs (126 matchs, outils/fouille_matrice.js) — étude en cours
- **Activité totale du thème** (niveaux saturés des résultantes M1–M15) : plus elle est haute, moins il y a de buts — ≤ 26 : 3,89 buts ; ≥ 33 : 3,06 ;
  même sens à l'aveugle (3,54 contre 2,82).
- **Ruptures 6-7 et 14-15** : quand la Terre de la résultante est identique de part et d'autre des deux ruptures, moins de buts — 0 rupture identique :
  3,83 ; 2 : 2,97 ; aveugle 3,47 contre 2,70.
- **Front du pôle qui concrétise le plus la Terre** : gagne 38, perd 21, marque 2,18 contre 1,41 ; à l'aveugle 8 victoires sur 17 seulement.
- **Maison du pôle la plus active** : gagne 42, perd 34 ; à l'aveugle 14 sur 22.
- Cases inactives (Via) et cases pleines (Populus) : pas de lien net avec buts ou nul.

## Lois exactes de la matrice (déchiffrage, 2026-11-27)
1. **Le front d'une figure, ce sont ses niveaux Feu et Air** : A = Feu 1, Air 1 (Puer, Via, Fortuna Minor, Cauda) ; B = Feu 1, Air 2 (Laetitia, Amissio,
   Carcer, Puella) ; C = Feu 2, Air 1 (Caput, Rubeus, Conjunctio, Aquisitio) ; D = Feu 2, Air 2 (Albus, Tristitia, Fortuna Major, Populus).
   Eau et Terre donnent la place de la figure dans son front.
2. **Les deux points du haut de chaque case (Feu, Air) ne dépendent que des deux fronts** : la matrice est faite de 16 blocs de 4 × 4, chacun d'un seul front
   de résultante. Même front → résultante du front D (Feu et Air saturés) ; D est neutre (D + X = X) ; A + B = C, A + C = B, B + C = A.
   Feu saturé ⇔ même Feu (A et B entre eux, C et D entre eux) ; Air saturé ⇔ même Air (A et C, B et D).
3. **Les deux points du bas (Eau, Terre) ne dépendent que des places dans les fronts.**
4. **Le miroir (h + 8) inverse la Terre et rien d'autre** — toujours, pour les 16 figures (la somme f + (f + 8) est toujours Tristitia).
   Donc une figure n'a jamais la même Terre de résultante en M h et en M h + 8 : la moitié droite de la matrice (M9–M16) est la moitié gauche avec la Terre inversée.
5. **Pourquoi la Terre « saute une maison » sauf en 6-7 et 14-15** : Terre des figures-maisons M1 à M8 = 1 2 1 2 1 2 2 1 ; par la loi 4, M9 à M16 = 2 1 2 1 2 1 1 2.
   La rupture 6-7 de la première moitié est recopiée par le miroir en 14-15 : il n'y en a que deux, à 8 maisons d'écart.
6. **Front direct (f + 4) : il inverse toujours l'Eau** (et la Terre une fois sur deux) ; le binôme (± 2), l'antagoniste (− 3) et l'orbite (+ 6) prennent
   3 à 5 formes selon la figure : seul le miroir est une loi pure.
7. **Attaques de fronts relues** : A + D = A (Feu et Air bloqués), B + A = C (Feu passe), D + C = C (Feu passe), C + B = A (rien ne passe en Feu/Air) :
   c'est pourquoi l'Air ne survit jamais à une attaque.
