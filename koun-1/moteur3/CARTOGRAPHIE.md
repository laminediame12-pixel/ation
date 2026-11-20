# Cartographie des fronts

Description exacte de la carte `cartographe-fronts.html`, pour que le moteur puisse l'exécuter plus tard. **Statut : structure documentée et vérifiée par calcul. Aucune règle du moteur ne l'utilise. Aucune mesure sur des scores ne la valide** (voir « Ce qui a été testé »).

Fichiers : `moteur3/cartographie.json` (la structure complète, générée), `outils/cartographie.js` (génère le JSON et vérifie 13 propriétés ; `--verifier` compare au fichier existant), `cartographe-fronts.html` (la carte), `tableau-dessin.html` (le tableau où le propriétaire a dessiné la représentation).

## 1. Définitions

- **Figures** : 16, numérotées par leur maison de repos (1 Puer … 16 Populus). Niveaux d'activation dans l'ordre Feu, Air, Eau, Terre ; 1 ou 2 points (2 = saturé).
- **Addition** (identique à `additionner` du moteur) : niveau par niveau, **niveaux égaux : 2 points (saturé) ; niveaux différents : 1 point (non saturé)**. Exemple : 1-1-1-1 + 2-2-1-1 = 1-1-2-2.
- **Fronts** : front d'une figure = (numéro − 1) mod 4. A (Feu) 1·5·9·13, B (Air) 2·6·10·14, C (Eau) 3·7·11·15, D (Terre) 4·8·12·16. Le front est fixé par les niveaux Feu et Air ; la Terre et l'Eau sont libres.
- **Antagoniste** de n : n − 3 (modulo 16) ; contrôleur : n − 6 ; miroir : n + 8 (même front).
- **Résultante** d'une maison : figure en base + figure de repos de la maison (l'addition ci-dessus).

## 2. La croix (règle du propriétaire, d'après son dessin)

Pour un front de première figure `f` : maisons au repos **haut f, droite f+4, bas f+8, gauche f+12**. Dans chaque branche, de l'extérieur vers le centre :

| Anneau | Contenu |
|---|---|
| rouge (extérieur) | figure de **base** : l'antagoniste de la maison (n − 3) |
| jaune (milieu) | figure de la **maison au repos** (le propriétaire de la maison) |
| vert (intérieur) | **résultante** = base + maison |

## 3. Les liaisons

- Les liaisons relient les **résultantes opposées**, niveau par niveau : haut ↔ bas et gauche ↔ droite.
- **La résultante décide** de l'état de chaque liaison : niveau de la résultante à 2 = saturée (trait épais), à 1 = non saturée (tireté). Chaque moitié d'une liaison porte l'état de sa propre résultante (elles sont identiques quand les deux résultantes opposées sont la même figure).
- **La Terre dévie** : la Terre du haut (f) descend puis tourne à droite vers la Terre de f+4 ; la Terre du bas (f+8) monte puis tourne à gauche vers la Terre de f+12. Le coin n'est pas une intersection.
- **Intersections : 15, jamais 16.** 9 pour les droites Feu, Air, Eau qui se croisent, 6 pour la Terre déviée qui croise Feu, Air et Eau. Un point est *plein* si les deux liens qui s'y croisent sont saturés, *anneau* s'ils sont tous deux non saturés, sinon neutre.

## 4. Les quatre fronts

Base + maison = résultante, dans l'ordre haut · droite · bas · gauche (le front A est le dessin du propriétaire).

| Front | Haut | Droite | Bas | Gauche | Intersections |
|---|---|---|---|---|---|
| A | 14+1=11 | 2+5=3 | 6+9=11 | 10+13=3 | 2 pleins, 6 anneaux |
| B | 15+2=1 | 3+6=1 | 7+10=1 | 11+14=1 | 1 plein, 8 anneaux |
| C | 16+3=3 | 4+7=11 | 8+11=3 | 12+15=11 | 2 pleins, 6 anneaux |
| D | 1+4=5 | 5+8=13 | 9+12=5 | 13+16=13 | 0 plein, 12 anneaux |

Les antagonistes d'un front sont dans le front précédent de la chaîne (ceux de A dans B, de B dans C, de C dans D, de D dans A).

## 5. Sommes de deux fronts X+Y

Règle du propriétaire (exemple A+B) : **les figures du front X sont au repos, celles du front Y sont en base.** Le premier front est celui du repos, donc D+C ≠ C+D.

Alignement base ↔ maison : la base de la maison `h` est `h − 3·d`, avec `d = (Y − X) mod 4`.
- `d = 1` (A+B, B+C, C+D) : c'est l'antagoniste n − 3 ; la carte est **identique à celle du front X**. Cohérent avec le dessin.
- `d = 2` ou `3` (A+C, A+D, B+D, D+C) : recul de 6 ou de 9. **Cette règle est de moi, elle n'est pas dans le dessin du propriétaire : à confirmer.**

| X+Y | Recul | Haut | Droite | Bas | Gauche | Front des résultantes | Pleins / anneaux |
|---|---|---|---|---|---|---|---|
| A+B | 3 | 14+1=11 | 2+5=3 | 6+9=11 | 10+13=3 | C | 2 / 6 |
| A+C | 6 | 11+1=14 | 15+5=6 | 3+9=14 | 7+13=6 | B | 2 / 6 |
| A+D | 9 | 8+1=9 | 12+5=9 | 16+9=9 | 4+13=9 | A | 3 / 4 |
| B+C | 3 | 15+2=1 | 3+6=1 | 7+10=1 | 11+14=1 | A | 1 / 8 |
| B+D | 6 | 12+2=14 | 16+6=6 | 4+10=14 | 8+14=6 | B | 2 / 6 |
| C+D | 3 | 16+3=3 | 4+7=11 | 8+11=3 | 12+15=11 | C | 2 / 6 |
| D+C | 9 | 11+4=7 | 15+8=7 | 3+12=7 | 7+16=7 | C | 8 / 1 |

## 6. Faits de structure (vérifiés par `outils/cartographie.js`)

- La somme d'une figure d'un front X et d'une figure d'un front Y tombe toujours dans un seul front : A+B → C, A+C → B, A+D → A, B+C → A, B+D → B, C+D → C. Le front D joue le rôle de neutre (A+D reste A, B+D reste B, C+D reste C).
- Les 16 sommes (4 figures de X × 4 figures de Y) forment un **carré latin** : les 4 figures du front résultat apparaissent une fois par ligne et par colonne.
- Dans chaque branche, base + maison = résultante et l'addition est commutative.
- Chaque carte compte 15 intersections.
- La page et `cartographie.json` donnent les mêmes branches et les mêmes intersections pleines et en anneau sur les 11 cartes (4 fronts, 7 sommes).

## 7. Ce qui a été testé, sans effet retenu

À la demande du propriétaire, avec les 27 thèmes (18 de travail + 9 documentés). **Rien n'est retenu dans le moteur.**
- **« Une saturation gagnée = un but »** (niveau actif en base devenu saturé en résultante), quatre lectures : maison du pôle, canal du pôle, front du pôle, front hors pôle (base et résultante). Score exact de R1 retrouvé 2 fois sur 24 ou 27 selon la lecture, de R7 de 0 à 5 fois ; pour la dernière lecture, la corrélation entre le total des saturations et le total des buts est de −0,07, et le camp qui a le plus de saturations marque le plus 8 fois sur 19. Aucune lecture ne mesure les buts.
- **Terre des pôles R1 et R7** (saturé ou non) et deux marquent : les deux pôles saturés en Terre, 1 thème sur 5 où les deux marquent contre 16 sur 22 sinon ; l'intervalle de Wilson (4 % à 62 %) chevauche la base de 63 %. Descriptif, sur des effectifs de 5 à 17, et la lecture « majorité des positions en base » a été choisie après coup. Piste, pas preuve.
- Le fait de regarder plusieurs lectures sur les mêmes 27 thèmes empêche d'en tirer une règle : toute règle issue de ces essais doit être posée avant les chiffres et testée une fois sur un lot neuf (`validation/PROTOCOLE.md`).

## 8. Spécification pour une intégration au moteur (non implémentée)

```text
antagoniste(n)  = ((n − 4) mod 16) + 1
niveau(a, b)    = 2 si a = b, sinon 1
resultante(b,h) = figure dont les niveaux sont niveau(b[i], h[i]), i = Feu..Terre
branche(h, b)   = { base: b, maison: h, resultante: resultante(b, h),
                    liens[i] = 'sature' si niveau(b[i], h[i]) = 2, sinon 'non_sature' }
croix(f, d)     = { haut: branche(f, recul(f)), droite: branche(f+4, recul(f+4)),
                    bas: branche(f+8, recul(f+8)), gauche: branche(f+12, recul(f+12)) }   avec recul(h) = h − 3·d
front : d = 1 ; somme X+Y : f = première figure de X, d = (Y − X) mod 4
```

L'état d'une liaison haut ↔ bas (resp. gauche ↔ droite) au niveau `i` est celui de la résultante de chaque côté ; la Terre (i = 3) relie haut → droite et bas → gauche. Le fichier `moteur3/cartographie.json` contient ces valeurs calculées pour les 4 fronts et les 7 sommes, avec le statut de l'alignement.

## 9. Utilisation

- Ouvrir `cartographe-fronts.html` (la liste en haut choisit « Les 4 fronts » ou « Sommes de deux fronts »). Avec `?theme=2-6-2-12` ou le champ thème : cadres R1 (bleu) et R7 (rouge), tireté pour une figure absente du thème, 💔 quand l'antagoniste est bien en base dans la maison dans ce thème.
- `node outils/cartographie.js` régénère `moteur3/cartographie.json` ; `node outils/cartographie.js --verifier` contrôle qu'il est à jour.

## 10. Points ouverts

- Alignement base ↔ maison pour A+C, A+D, B+D, D+C (recul de 6 ou de 9, supposé).
- La présentation de l'état « deux moitiés » par liaison : sans effet quand les deux résultantes opposées sont identiques (cas du front A), à confirmer dans les autres.
- Aucun effet de la carte sur le verdict ou sur les buts n'est posé : si le propriétaire pose une règle (par exemple une condition sur des liaisons saturées ou non), elle doit être écrite avant d'être testée.
