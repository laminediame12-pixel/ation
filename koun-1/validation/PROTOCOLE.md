# Protocole de validation sur lots neufs

But : savoir ce que vaut une règle sur des matchs qu'elle n'a jamais vus.

1. **Règle posée avant les chiffres**, écrite et datée. Aucune règle n'est ajustée après coup : si elle échoue, sa prémisse est fausse et elle est retirée.
2. **Lot neuf** : `validation/lots/<lot>.json` (thème en 4 mères, date, score équipe 1 – équipe 2, R1 = équipe 1).
3. **Évaluation unique** de la règle sur ce lot, avec effectifs et intervalle de Wilson à 95 %, comparée à « toujours R1 ».
4. Le lot évalué devient du développement. Une règle confirmée entre dans `moteur4/moteur.js` ; une règle refutée est retirée.


## Amendement du 2026-11-21 : une seule exigence, pour garder comme pour retirer

Un signal probabiliste (qui marche dans une partie des cas) ne se rejette pas sur un seul échec, pas plus qu'il ne s'adopte sur un seul succès. Chaque piste tient un registre (justes / essais) dans `validation/hypotheses.json` :

- **en observation** : elle reste affichée, comme indice ou paramètre, avec son registre visible ;
- **retirée** seulement quand, sur au moins 15 essais indépendants de sa construction, son score est indiscernable du hasard (ou d'une réponse constante) ;
- **adoptée comme verdict** seulement quand son score bat les bases de comparaison sur au moins 15 essais indépendants.

Une règle présentée comme exacte (identité algébrique, structure du noyau) reste, elle, réfutée par un seul contre-exemple. Les règles déjà retirées (H-PROTECTEUR, H-DEPART, H-CANAUX) l'ont été sur 22 matchs indépendants au niveau du hasard, pas sur un cas.
