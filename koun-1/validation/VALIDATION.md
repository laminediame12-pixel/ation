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
- CO-1, tel qu'il était (principe le plus fort), retenait le thème 1-15-3-9 (VA-1 assuré) : verdict final faux, 0/1.
- Ensuite, le propriétaire a posé un critère d'axe angulaire (somme M1+M4+M7+M10 en maison angulaire) à partir de ce match : CO-1 donne maintenant le bon verdict (victoire équipe 2, 0-4), mais ce match est devenu du développement. Il n'est plus une validation.
- Au passage : VA-1 (assuré) n'a plus que 2 matchs justes sur 4 (dév. 1/2, lot 1 1/1, lot 2 0/1).

## Tri par fiabilité du thème (règle du propriétaire)
Les thèmes fiables (deux validations) et moyens (une) sont étudiés ; les thèmes peu fiables (aucune validation : binôme de M1 hors de son canal et somme de l'axe angulaire hors maison angulaire) sont classés de côté et ne servent pas à poser un principe. Ils restent comptés à part dans les mesures (`node outils/evaluer3.js`, bloc « par fiabilité »).
Classement actuel (41 thèmes) : fiables 8 (moteur 7/8), moyens 22 (20/22), peu fiables 11 (7/11), mis de côté : 3-14-13-5, 6-4-10-16, 5-14-6-14, 7-5-9-6, 4-16-1-2, 4-7-10-10, 12-6-1-9, 13-7-3-13 (développement), 11-13-9-13, 7-16-3-12, 6-11-14-11 (lot 1). La page affiche la même séparation dans la liste des thèmes sauvegardés (thèmes peu fiables en fin de liste, bilan séparé).
Étude du canal opposé refaite sur les thèmes étudiés (30) : concordance 1 : 3 gagnent, 0 perd ; concordance 2 : 0 gagne, 3 perdent ; concordance 3 : 1 gagne, 0 perd. L'inversion de polarité se retrouve aussi chez les thèmes mis de côté (2 gagnent à la concordance 1, 3 perdent à la concordance 2) : le tri ne la change pas. Toujours à valider sur un lot neuf.

## Règle posée par le propriétaire : M16 conciliateur, les deux camps marquent (testée une seule fois)
Sur les 18 thèmes fiables ou moyens avec score réel (3 fiables, 15 moyens) : figure du front Feu (1, 5, 9, 13) en M16 : 6 thèmes, les deux équipes marquent dans 3 (Rome–Chelsea, Belgique–Italie, Atletico–Dortmund) et pas dans 3 (9·13·2·13, 13·12·8·15, 4·1·6·7). Les autres figures en M16 : 12 thèmes, deux marquent dans 7. Taux de base : 10/18. Règle non confirmée.
Vérification du binôme de la figure de M16 (la figure qui suit de deux numéros), quatre lectures : présent dans le thème (toujours vrai, 3/6) ; chez lui ou dans son canal (1/4 contre 2/2 sinon) ; en base (2/5 contre 1/1) ; dans le canal de M16, Terre : M4, M8, M12, M16 (0/2 contre 3/4 sinon). Aucune lecture ne sépare avec 6 thèmes ; la lecture « binôme hors du canal Terre de M16 donne deux marquent » (3/4) n'est qu'une observation, à tester sur des thèmes neufs. Aucun changement du moteur.
