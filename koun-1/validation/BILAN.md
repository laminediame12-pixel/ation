# Bilan de l'évaluation (20 novembre 2026)

Commande : `node outils/valider.js`. Données : 37 matchs avec score (15 sur lesquels les règles ont été construites, 22 indépendants).

## Résultat
| Question | Ce que donne la structure (validation croisée, un match laissé de côté) | Base de comparaison |
|---|---|---|
| Vainqueur, 31 matchs décisifs | 21 / 31 (68 %) | « toujours R1 » : 20 / 31 (65 %) |
| Nul, 37 matchs dont 6 nuls | 33 / 37 (89 %) | « jamais nul » : 31 / 37 (84 %) |

Écart de 1 et de 2 matchs : pas de signal démontré.

## Les anciennes règles sur les 22 matchs indépendants
| Règle | Appels justes / faux |
|---|---|
| H-CROIX (un pôle sous croix perd) | 1 / 2 |
| H-5 (cinq indicateurs concordants) | 0 appel |
| Nul par témoins = 6 et binôme Eau égal | 0 / 3 |
| Nul par binôme Eau seul | 0 / 12 |
| Nul par témoins = 6 seuls | 0 / 4 |

Aucun des 22 matchs indépendants n'est nul ; les règles de nul se sont donc déclenchées à tort 12 fois au plus.

## H-REPOS (règle du propriétaire, activée à sa demande)
Le pôle qui possède ses deux fronts au repos, sans que l'antagoniste y soit, gagne. Interprétation du moteur : au moins une figure de son front et une de son front binôme dans leur maison de repos, sans que leur antagoniste (f − 3) soit lui aussi chez lui. Résultat : 22 matchs indépendants, 3 appels dont 2 justes ; 15 matchs construits, 1 appel juste. Elle ne se prononce que sur environ un match sur dix ; c'est le seul verdict actif.

## Corrections
- 9-13-2-13 (2-0) et 2-9-6-5 (3-3) figuraient déjà avec leur score dans `scores-reels.json` : ils ne comptent pas comme appels à l'aveugle.
- Le « bon bilan » de l'échantillon (8 verdicts justes sur 8) venait de règles ajustées sur ces matchs.

## Ce qui est exact
La structure d'un thème (maisons, résultantes, pôles, liaisons, paralysies, témoins, interactions par canal) est calculée exactement et contrôlée (`node outils/surveiller.js`).


## Mise à jour du 2026-11-21 : thème 16-1-8-14 (3-1, penalty R1, rouge R7)

Premier match étiqueté avec incidents. H-REPOS appelait R7 ; R1 a gagné 3-1 : faux. Bilan H-REPOS : 3 justes sur 5 appels sur 38 matchs (indépendants : 2 justes, 2 faux ; construits : 1 juste), contre 66 % pour « toujours R1 ». Le signal de marquage tient sur ce match : R1 (n = 2) marque 3, R7 (n = 1) marque 1.
