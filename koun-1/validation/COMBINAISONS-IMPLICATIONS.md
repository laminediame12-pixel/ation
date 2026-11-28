# Combinaisons de maisons et leurs implications (2026-11-28)

On cherche sur 126 matchs, puis on juge sur les 34 matchs du 26 et du 27 novembre, jamais vus. La figure-somme est la somme des bases des maisons de la combinaison. Outil : `node outils/combinaisons_inevitables.js` (section « liste par événement »).

**Lecture.**
- **But attendu** : la figure-somme doit remplir deux conditions.
  - Elle est rapide (Feu et Air saturés, hors Populus) ou attaquée. Attaquée veut dire que son antagoniste (f − 3) est en base et qu'aucun protecteur (f − 6) n'est posé hors de la combinaison, ou que l'antagoniste est posé dans la combinaison.
  - Son binôme est lié : le binôme, son antagoniste ou son protecteur est en base.
- **Pôle désigné** : les quatre maisons du front de sa figure portent en base la figure-somme ou son protecteur.
- **Désigné seul** : le pôle est désigné et l'autre pôle ne l'est pas.

## A. Implications retenues

| Combinaison | Implication | 126 matchs | Jamais vus | Pour le moteur |
|---|---|---|---|---|
| M1+M5+M12+M15 (≡ M1+M6+M13) | but attendu → but en 1re mi-temps | 21/22, sinon 3/9 · 1re des 1820 combinaisons de 4 maisons | aucune mi-temps trouvée | déjà dans le moteur (rythme) |
| M4+M5+M13+M15 (≡ M4+M5+M14) | pôle désigné → il marque en 2e mi-temps | 15/20, autres 14/42 · 6e des 1820 | aucune mi-temps trouvée | déjà dans le moteur (2e mi-temps) |
| M3+M7+M11 (≡ M2+M4+M8+M16) | pôle désigné seul → il marque | 58/63, autres 136/189 | 14/15, autres 36/53 (hasard : 4 %) | non intégrée ; figée sur les matchs du 28 au 30 (40 pôles annoncés, dont 7 que le moteur donne non marqueurs) |

## B. Pistes faibles (le sens se confirme, l'écart reste petit)

| Combinaison | Implication | 126 matchs | Jamais vus |
|---|---|---|---|
| M1+M7+M15+M16 (figure de M7) | but attendu → pas de nul | nuls 5/59, sinon 22/67 | nuls 2/14, sinon 8/20 (hasard : 11 %) |
| M1+M5+M12+M15 | but attendu → rarement 0 ou 1 but dans le match | 4/65, sinon 18/61 | 4/18, sinon 5/16 (hasard : 42 %) |

Sans but attendu de M1+M7+M15+M16, il y a eu 30 nuls sur 87 matchs (34 %, contre 23 % en tout).

## C. Démenties sur les jamais vus (à écarter)

| Combinaison | Implication | 126 matchs | Jamais vus |
|---|---|---|---|
| M1+M2+M8+M9 (figure de M8) | but attendu → les deux marquent | 48/67, sinon 22/59 | 8/16, sinon 12/18 |
| M1+M2+M8+M9 | but attendu → au moins 3 buts | 50/67, sinon 28/59 | 9/16, sinon 10/18 |
| M6+M7+M14+M16 | but attendu → penalty | 22/44, sinon 7/41 | 5/15, sinon 6/17 |
| M1+M2+M11+M14 | but attendu → carton rouge | 18/55, sinon 1/31 | 1/12, sinon 3/20 |
| M4+M5 | pôle désigné seul → il perd | 32/57, autres 67/195 | 2/14, autres 22/54 |
| M5+M7+M15 | la figure est le protecteur du pôle → il marque | 21/21 | 5/8 |
| M2+M5+M8 | pôle désigné → il marque moins souvent | 70/106, autres 124/146 | 17/24, autres 33/44 : écart minime ; elle peut contredire M3+M7+M11 pour le même pôle |

## D. Règles « jamais » : vraies sur les 126 matchs, sans valeur

Ces événements sont rares : la seule fréquence les tient aussi souvent. Sur les 255 sommes, on trouve 3 713 règles sans exception ; des résultats mélangés au hasard en donnent 3 813 en moyenne.

| Combinaison | Implication | 126 matchs | Jamais vus | Ce que la fréquence seule donne |
|---|---|---|---|---|
| M4+M7 | la figure désigne R1 seul → jamais de rouge | 21/21 | 8/8 | 7 |
| M2+M3+M5 | la figure désigne R1 seul → jamais de penalty | 17/17 | 6/7 | 4,6 |
| M5+M8+M16 | la figure est en base → jamais 0-0 | 89/89 | 21/23 | 20,3 |
| M3+M9+M12 | la figure est fixe → jamais nul | 19/19 | 5/5 | 3,5 |

Dans la page, « Maisons de calcul : somme des figures » a une rangée « Combinaisons de la liste et leur implication » avec M1+M5+M12+M15, M4+M5+M13+M15, M3+M7+M11 et M1+M7+M15+M16. La lecture et l'implication y sont calculées par le moteur (KOUN4.lectureCombinaison).
- Les deux combinaisons de mi-temps suivent les lignes de mi-temps du verdict : seuls les pôles qui marquent y sont désignés (0 écart sur les 65 536 thèmes).
- Les pistes hors verdict gardent leur annonce et disent en rouge quand le verdict dit autre chose (« le verdict, lui, ne fait pas marquer R1 »).

## Ce que cela implique

- Une figure-somme ne dit rien seule. Il faut la lire comme la combinaison de 1re mi-temps : attaque, protection, binôme, pôle désigné.
- **Mi-temps** : les deux combinaisons du moteur sont les meilleures de leur famille, mais il manque des mi-temps jamais vues pour les juger.
- **Marquage** : M3+M7+M11 est la seule règle nouvelle et forte. Si elle tient sur les matchs du 28 au 30, elle corrigera des « ne marque pas » du moteur (9 justes sur 11 jusqu'ici).
- **Nul** : aucune combinaison ne l'annonce. M1+M7+M15+M16 aide seulement à l'écarter, ce qui renforce une victoire.
- **Penalty et rouge** : aucune combinaison ne tient.
