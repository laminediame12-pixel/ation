# Validation des moteurs

## Règle
- **Développement** : les 27 matchs de référence (25 du build plus les deux thèmes Brésil–Norvège). Ce sont les seuls matchs qui servent à écrire ou ajuster un cas.
- **Validation** : chaque lot de matchs réels est évalué **avant** tout ajustement, puis rangé dans `validation/`. Il n'est jamais utilisé pour ajuster un cas.
- Un ajustement est accepté s'il est justifié par le développement ou par une règle du propriétaire, puis **vérifié sur le lot suivant**, jamais sur celui qui l'a inspiré.
- Un lot, une fois qu'il a servi à décider d'un ajustement, devient du développement et ne compte plus comme validation.
- On compare toujours à deux repères : « toujours R1 » et le 3.0.0 d'origine.

## Commande
`node outils/evaluer.js validation/lot-1.json --pages`

## Lot 1 (14 thèmes, export du 18 novembre 2026) — évalué à l'état du dépôt 619dccb, sans ajustement

| Moteur | Justes |
|---|---|
| Toujours R1 (première équipe) | 9/14 (64 %) |
| 3.0.0 d'origine | 9/14 (64 %) |
| Moteur 2 seul (aucun cas = raté) | 6/14 (43 %) |
| Page actuelle (Moteur 2 puis repli 3.0.0) | 6/14 (43 %) |

- Matchs réels : 2/6 pour le Moteur 2 ; simulations : 4/8.
- Cas du Moteur 2 sur ce lot (lecture seule) : PF-1 0/2, DR-C 1/2, NU-2 1/1, PR-4 0/1, PF-2 1/1, PR-1 0/1, MF-4 0/1, VA-1 1/1, CL-2 1/1, MF-1 0/1, CL-1 1/1, un thème sans cas.
- À l'état actuel, le Moteur 2 est sous les deux repères sur un lot qu'il n'a jamais vu : ses 25/27 sont mesurés sur les matchs qui l'ont construit.
- Les noms d'équipes de deux verdicts enregistrés dans l'export sont ceux d'une saisie précédente (« Pays Bas » pour Roma–Bayern) : les verdicts enregistrés ne servent pas de référence.
