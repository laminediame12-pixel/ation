# Cartographie des fronts

Carte `cartographe-fronts.html`. Données complètes : `cartographie.json` (généré et vérifié par `node outils/cartographie.js`).

## Définitions
- **Addition** (celle du moteur) : niveaux égaux = 2 points (saturé) ; différents = 1 point (non saturé). Ex. 1-1-1-1 + 2-2-1-1 = 1-1-2-2.
- **Fronts** = (n − 1) mod 4 : A (Feu) 1·5·9·13, B (Air) 2·6·10·14, C (Eau) 3·7·11·15, D (Terre) 4·8·12·16.
- **Antagoniste** de n : n − 3. **Résultante** : base + figure de repos de la maison.

## La croix (front de première figure f)
Maisons au repos : **haut f, droite f+4, bas f+8, gauche f+12**. De l'extérieur vers le centre : **base** (antagoniste, anneau rouge), **maison au repos** (anneau jaune), **résultante** (anneau vert).

## Liaisons
- Elles relient les résultantes opposées (haut ↔ bas, gauche ↔ droite), niveau par niveau. **La résultante décide** : niveau 2 = saturée (trait épais), niveau 1 = non saturée (tireté). Chaque moitié porte l'état de sa résultante.
- **La Terre dévie** : haut (f) → droite (f+4) ; bas (f+8) → gauche (f+12).
- **15 intersections** : 9 (Feu, Air, Eau entre elles) + 6 (la Terre croise Feu, Air, Eau). Point plein : deux liens saturés ; anneau : deux non saturés.

## Les 4 fronts (base + maison = résultante : haut · droite · bas · gauche)
| Front | Haut | Droite | Bas | Gauche |
|---|---|---|---|---|
| A | 14+1=11 | 2+5=3 | 6+9=11 | 10+13=3 |
| B | 15+2=1 | 3+6=1 | 7+10=1 | 11+14=1 |
| C | 16+3=3 | 4+7=11 | 8+11=3 | 12+15=11 |
| D | 1+4=5 | 5+8=13 | 9+12=5 | 13+16=13 |

## Sommes X+Y
Les figures du front X sont au repos, celles du front Y en base ; D+C ≠ C+D. Base de la maison h : **h − 3·d**, d = (Y − X) mod 4 (d = 1 : l'antagoniste, donc A+B, B+C, C+D = carte du front X).

| X+Y | Haut | Droite | Bas | Gauche | Front des résultantes |
|---|---|---|---|---|---|
| A+B | 14+1=11 | 2+5=3 | 6+9=11 | 10+13=3 | C |
| A+C | 11+1=14 | 15+5=6 | 3+9=14 | 7+13=6 | B |
| A+D | 8+1=9 | 12+5=9 | 16+9=9 | 4+13=9 | A |
| B+C | 15+2=1 | 3+6=1 | 7+10=1 | 11+14=1 | A |
| B+D | 12+2=14 | 16+6=6 | 4+10=14 | 8+14=6 | B |
| C+D | 16+3=3 | 4+7=11 | 8+11=3 | 12+15=11 | C |
| D+C | 11+4=7 | 15+8=7 | 3+12=7 | 7+16=7 | C |

À confirmer : le recul de 6 ou 9 (A+C, A+D, B+D, D+C) n'est pas dans le dessin du propriétaire.

## Pour le moteur
```text
antagoniste(n) = ((n − 4) mod 16) + 1
niveau(a, b)   = 2 si a = b, sinon 1
branche(h, b)  = { maison: h, base: b, resultante: figure de niveaux niveau(b[i], h[i]),
                   liens[i] = 'sature' si niveau(b[i], h[i]) = 2, sinon 'non_sature' }
croix(f, d)    = haut branche(f, f−3d) · droite branche(f+4, f+4−3d) · bas branche(f+8, f+8−3d) · gauche branche(f+12, f+12−3d)
front : d = 1 ; somme X+Y : f = première figure de X, d = (Y − X) mod 4
```
Aucune règle du moteur ne l'utilise encore.
