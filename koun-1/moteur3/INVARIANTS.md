# Propriétés invariantes de la structure

Vraies pour les 65 536 thèmes (tout l'espace des thèmes : preuve par énumération). `node outils/invariants.js` les revérifie (17 contrôles). Elles décrivent la structure ; aucune ne parle encore d'un score. « Saturé » = niveau à 2 points ; la résultante d'une maison est sa base + sa figure de repos.

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
