# Validation

## Règle
- **Développement** : les 27 matchs de référence (25 du build d'origine plus les deux thèmes Brésil–Norvège). Ce sont les seuls matchs qui servent à écrire ou ajuster un principe.
- **Validation** : chaque lot de matchs réels est évalué **avant** tout ajustement, puis rangé dans `validation/`. Il n'est jamais utilisé pour ajuster un principe.
- Un ajustement est accepté s'il est justifié par le développement ou par une règle du propriétaire, puis **vérifié sur le lot suivant**, jamais sur celui qui l'a inspiré. Un lot qui a servi à décider d'un ajustement devient du développement.
- On compare toujours à deux repères : « toujours R1 » et, quand c'est possible, un autre moteur.
- **Les 65 536 combinaisons de mères sont un contrôle technique seulement** (aucun plantage, symétrie R1/R7, fréquence d'un principe). Elles n'ont pas de résultat réel : leur accord avec les verdicts du moteur n'est jamais une preuve.

## Commandes
- `node outils/evaluer3.js` : évalue le moteur 3 sur les 27 de développement, le lot 1 et les 26 scores réels (`--detail` pour le détail).
- `node outils/lire_theme.js 12 6 3 2` : lit un thème avec le moteur 3.
- `node outils/embarquer.js` : réembarque `moteur3/moteur.js` dans la page `koun-moteur-3.0.0.html`.

## Lot 1 (14 thèmes, export du 18 novembre 2026)
Évalué avant tout ajustement avec l'ancien moteur à cas : 6/14, contre 9/14 pour « toujours R1 » et 9/14 pour le 3.0.0 d'origine (avec le score de Niger–Maroc saisi à l'époque, 5-0, corrigé depuis). Cet ancien moteur et ses couches ont été supprimés.
Moteur 3 (table rase, FC-2 : portes du cercle) : développement 22/27, lot 1 12/14 (retenu après une quinzaine de variantes essayées sur ces mêmes thèmes, donc à valider sur un lot neuf ; avec l'ancien FC-1 : 24/27 et 8/14) (« toujours R1 » : 13/27 et 8/14). Scores réels (`scores-reels.json`, 26 matchs) : Deux marquent 13/26, Over/Under 1,5 24/26, 2,5 23/26, 3,5 21/26 (« toujours Over » : 24, 23, 17), but en première mi-temps 5/6 ; corners, pénalité et carton non testés.

## Mesures sur résultats réels, victoires seulement
| Mesure | 27 de développement | Lot 1 |
|---|---|---|
| Canal avec plus de lignes à deux points dans les résultantes | 13/18 | 4/13 |
| Comptage des lignes à deux points de la boucle (boucles différentes) | 10/12 | 4/5 |
| Toujours R1 | 13/19 | 9/13 |

Le comptage des deux points par canal ne tient pas hors développement quand il décide une victoire. CC-1 ne l'utilise que pour départager l'égalité des forces, où aucun match réel n'existe.

## Correction de données (18 novembre 2026)
Niger–Maroc : le score enregistré dans l'export était 5-0 ; le propriétaire indique 0-1. `lot-1.json` et `scores-reels.json` sont corrigés. Conséquence : le moteur donne Niger (R1) pour ce thème, ce qui est faux avec le score correct ; le lot 1 passe à 8/14 (« toujours R1 » : 8/14).

## Lot 2 : un match à deux thèmes (1-15-3-9 et 1-9-8-1), score réel 1-4
Fichier `lot-2.json`. Réel : victoire équipe 2, les deux équipes marquent, 5 buts (Over 3,5).
- Thème 1-15-3-9 : R1 gagne par VA-1 (assuré), 3-1 : verdict faux.
- Thème 1-9-8-1 : R7 gagne par FC-2, 0-4 : verdict juste, total de buts juste en Over 3,5, Deux marquent faux.
- CO-1 retient le thème 1-15-3-9 (VA-1 assuré, rang 4) : verdict final faux. Premier test de CO-1 : 0/1. Aucun ajustement fait sur ce cas, qui reste en validation.
- Au passage : VA-1 (assuré) n'a plus que 2 matchs justes sur 4 (dév. 1/2, lot 1 1/1, lot 2 0/1).
