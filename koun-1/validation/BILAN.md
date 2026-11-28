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


## État au 2026-11-21
- Corpus : 39 matchs avec score ; 8 d'entre eux ont penalty et rouge renseignés (5 avec incident, 3 RAS).
- Verdict de victoire : H-REPOS seul, 4 justes sur 6 appels ; « toujours R1 » : 64 % sur les décisifs. Rien ne bat clairement les bases de comparaison.
- Signal retenu : le marquage par la Terre du front direct (corrélation 0,30, p = 0,016 corrigée) ; part des pôles à 2 buts ou plus : 66 % pour n >= 2 contre 32 % pour n <= 1. Il a été choisi après coup et reste à confirmer.
- Incident : détecteur à six paramètres ajustés sur les 8 matchs étiquetés ; rouge annoncé par la coordination M6+M12 sur la Terre (4 sur 4, 0 fausse alerte sur 4). Tout reste à confirmer.
- Pistes retirées sur 22 matchs indépendants au niveau du hasard : H-PROTECTEUR, H-DEPART, H-CANAUX. Les autres sont « en observation ».


## Audit du 2026-11-21
- Contrôles : tous verts (noyau, moteur, indices sur 65 536 thèmes, invariants, cartographie, liste blanche, verdict, copies embarquées, prédictions gelées, page).
- Corrigé : les fréquences du marquage dataient d'avant l'ajout de 1-2-6-15 (n = 2 : 37 observations, 62 % de 2 buts ou plus, 86 % d'au moins un but ; 80 pôles-matchs) ; 5 entrées en double retirées de `scores-reels.json` (même thème, même score : 9-13-2-13, 4-1-6-7, 4-6-7-16, 2-9-6-5 ×2), corpus unifié inchangé (40 matchs).
- Ajouté : `outils/constantes.js`, branché sur la surveillance, qui refuse tout chiffre du moteur (fréquences, témoin, bilans des verdicts) qui ne correspond plus au corpus.
- État : 40 matchs ; verdict de victoire H-REPOS 4 justes sur 6 appels, puis H-COORD-VICTOIRE 17 justes sur 20 appels (« toujours R1 » 16 sur 20) ; marquage par la Terre (signal le plus solide) ; témoin M5+M7 pour « deux marquent » (20 sur 20 contre 9 sur 20, trouvé par criblage) ; détecteur d'incident construit sur 7 matchs, 2 cas sans incident jugés justes à l'aveugle ; rythme (1-5-12-15) sur 2 cas. Aucune règle n'a encore 15 appels indépendants de sa construction. 6 prédictions attendent leur score (coupon du 21/11 et 8-13-9-15).
