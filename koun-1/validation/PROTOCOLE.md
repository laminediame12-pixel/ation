# Protocole de validation sur lots neufs

But : savoir ce que vaut une règle sur des matchs qu'elle n'a jamais vus.

1. **Règle posée avant les chiffres**, écrite et datée. Aucune règle n'est ajustée après coup : si elle échoue, sa prémisse est fausse et elle est retirée.
2. **Lot neuf** : `validation/lots/<lot>.json` (thème en 4 mères, date, score équipe 1 – équipe 2, R1 = équipe 1).
3. **Évaluation unique** de la règle sur ce lot, avec effectifs et intervalle de Wilson à 95 %, comparée à « toujours R1 ».
4. Le lot évalué devient du développement. Une règle confirmée entre dans `moteur4/moteur.js` ; une règle refutée est retirée.
