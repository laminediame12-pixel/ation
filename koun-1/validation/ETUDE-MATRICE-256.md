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
