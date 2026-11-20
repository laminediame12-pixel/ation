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

## Lecture de la structure (vérifié)
- **Les 15 et le 16e** : les 16 figures forment un groupe par l'addition ; Populus est le neutre (x + Populus = x) et chaque figure est son propre inverse (x + x = Populus, figure dans sa maison : tout saturé). Il y a 15 figures non neutres et 15 intersections. Le 16e point (Terre × Terre) est le coin où la Terre dévie : pas de croisement. M16 est la maison de Populus : sa résultante est sa base. *Hypothèse non prouvée par la géométrie : la cellule (niveau i, niveau j) correspond à la maison 4j+i+1 (canal × bloc), donc (Terre, Terre) = M16.*
- **Lien avec le Circuit Souverain** : la résultante d'une figure dans la maison de son antagoniste ne prend que 5 valeurs, exactement M1+M3+M5+M11+M13 du moteur : Puer ← maisons 2, 6, 10, 14 ; Caput ← 3, 5, 11, 13 ; Conjunctio ← 1, 7, 9, 15 ; Via ← 4, 12 ; Cauda Draconis ← 8, 16. Leur somme est Puer.
- **Fronts et binômes** : A et C (binômes) ont les mêmes résultantes {Conjunctio, Caput} en positions échangées ; B n'a que Puer ; D a {Via, Cauda Draconis}.
- **Extrêmes** : Populus (2222) est tout saturé ; Via (1111) est tout non saturé, et c'est la résultante des maisons 4 et 12 avec leur antagoniste : quatre liaisons non saturées.
- **Relations entre fronts (carte réelle)** : les résultantes réelles des 16 maisons n'ont que 8 relations de somme constante, toutes issues de la construction du thème (M9 = M1+M2 …) : r1+r2+r9 = Carcer ; r3+r4+r10 = Fortuna Minor ; r5+r6+r11 = Fortuna Major ; r7+r8+r12 = Conjunctio ; r9+r10+r13 = Puella ; r11+r12+r14 = Cauda Draconis ; r13+r14+r15 = Populus (donc A + B = C sur la branche gauche) ; r1+r15+r16 = Laetitia. Aucune autre : 255 sommes constantes = 2^8 − 1.
- **Carte réelle** : le mode « Thème réel » de la page met dans chaque maison la vraie base du thème (la carte structurelle étant le cas où l'antagoniste y est). Bases et résultantes identiques au moteur (80 maisons sur 5 thèmes).

## Les 16 maisons face à leur antagoniste (vérifié)
Résultante de l'antagoniste dans la maison h ; sa figure attaque la maison R+3 (k attaque k+3).

| Maison | Élément | Antagoniste | Résultante | Niveaux saturés | Élément de la maison saturé | Attaque (R+3) |
|---|---|---|---|---|---|---|
| M1 Puer | Feu | 14 Puella | 11 Conjunctio | Feu+Terre | oui | M14 |
| M2 Laetitia | Air | 15 Aquisitio | 1 Puer | Eau | non | M4 |
| M3 Caput | Eau | 16 Populus | 3 Caput | Feu | non | M6 |
| M4 Albus | Terre | 1 Puer | 5 Via | aucun | non | M8 |
| M5 Via | Feu | 2 Laetitia | 3 Caput | Feu | oui | M6 |
| M6 Amissio | Air | 3 Caput | 1 Puer | Eau | non | M4 |
| M7 Rubeus | Eau | 4 Albus | 11 Conjunctio | Feu+Terre | non | M14 |
| M8 Tristitia | Terre | 5 Via | 13 Cauda Draconis | Terre | oui | M16 (miroir) |
| M9 Fortuna Minor | Feu | 6 Amissio | 11 Conjunctio | Feu+Terre | oui | M14 |
| M10 Carcer | Air | 7 Rubeus | 1 Puer | Eau | non | M4 |
| M11 Conjunctio | Eau | 8 Tristitia | 3 Caput | Feu | non | M6 |
| M12 Fortuna Major | Terre | 9 Fortuna Minor | 5 Via | aucun | non | M8 |
| M13 Cauda Draconis | Feu | 10 Carcer | 3 Caput | Feu | oui | M6 |
| M14 Puella | Air | 11 Conjunctio | 1 Puer | Eau | non | M4 |
| M15 Aquisitio | Eau | 12 Fortuna Major | 11 Conjunctio | Feu+Terre | non | M14 |
| M16 Populus | Terre | 13 Cauda Draconis | 13 Cauda Draconis | Terre | oui | M16 |

- **Cinq cibles seulement** : M4, M6, M8, M14, M16. Les 11 autres maisons ne reçoivent jamais l'attaque d'un antagoniste ancré chez un autre.
- **Entre canaux** : Feu et Eau attaquent l'Air (M6, M14), l'Air attaque la Terre (M4), la Terre s'attaque elle-même (M8, M16). Air et Terre reçoivent, Feu et Eau émettent.
- **Élément de la maison** : il reste saturé dans les quatre maisons Feu et dans M8 et M16 ; il est perdu dans toutes les maisons Air et Eau, et dans M4 et M12 (résultante Via, tout non saturé).
- **M8 est unique** : Via en M8 donne Cauda, l'antagoniste de Populus, donc l'attaque passe à son miroir M16.
- **Terre** : M4 et M12 (Via) attaquent M8, M8 (Cauda) attaque M16, M16 se frappe elle-même.
- **Chaîne vers le puits** (maison numérotée par la résultante) : tout aboutit à M3 (Caput), en 1 à 3 pas.

## Binôme + figure (vérifié)
Binômes : couples symétriques 1-3, 2-4, 5-7, 6-8, 9-11, 10-12, 13-15, 14-16.
- **Figure + binôme** : toujours Amissio (1212) pour les figures des blocs M1-4 et M9-12 (Air et Terre saturés), toujours Puella (1211) pour M5-8 et M13-16 (Air seul). L'Air est toujours saturé, le Feu et l'Eau jamais ; la Terre seulement dans M1-4 et M9-12. Le résultat est toujours dans le front B (Air).
- **Résultante de la maison + résultante de son binôme** : Tristitia (Feu, Air, Eau saturés) pour les couples A/C (M1-3, M5-7, M9-11, M13-15) ; Albus (Feu, Air, Terre) pour M2-4 et M10-12 ; Fortuna Major (Feu, Air) pour M6-8 et M14-16. Feu et Air sont toujours saturés.

## Binôme + antagoniste (vérifié)
- **Binôme + antagoniste** d'une figure ne dépend que de son front : A donne toujours Fortuna Minor (Eau+Terre saturés), C donne Puer (Eau), D donne Aquisitio (Feu+Eau), B donne Caput (Feu) dans les blocs M1-4 et M9-12 ou Conjunctio (Feu+Terre) dans M5-8 et M13-16. Cinq résultats en tout : Puer, Caput, Fortuna Minor, Conjunctio, Aquisitio.
- **L'antagoniste du binôme est le binôme de l'antagoniste** pour les figures des fronts A et C, et pour elles seules (les fronts qui saturent le Feu et la Terre dans la carte).

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
