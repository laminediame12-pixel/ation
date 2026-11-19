# Protocole de validation sur lots neufs

But : savoir ce que vaut le moteur sur des matchs qu'il n'a jamais vus, sans réglage préalable.

1. **Moteur gelé.** La version évaluée est figée : étiquette git `moteur3-gele-1` et empreinte dans `validation/GEL.json`. L'outil refuse de parler de « validation » si `moteur3/moteur.js` a changé depuis le gel.
2. **Lot neuf.** Copier `validation/lots/lot-modele.json`, le renommer (par exemple `lot-2026-11-22.json`), supprimer la ligne d'exemple fictive et saisir les matchs : thème (les 4 mères, par exemple `12-9-4-5`), score (équipe 1 - équipe 2, R1 = équipe 1), date (jj/mm/aaaa, pour la figure du jour). Ne rien régler sur ces matchs avant l'évaluation.
3. **Évaluation unique.** `node outils/evaluer_lot.js validation/lots/<lot>.json`. L'outil affiche, avec leurs effectifs et un intervalle à 95 % : le verdict (contre « toujours R1 »), par principe, par thème valide ou non, quand le moteur prédit R1, R7 ou nul, Deux marquent et Over/Under. Il inscrit le résultat dans `validation/registre.json` : le lot est alors du **développement** et ne peut plus valider quoi que ce soit.
4. **Essai à blanc.** `--a-blanc` évalue sans rien inscrire (pour vérifier un fichier).
5. **Après coup.** On peut régler le moteur à partir d'un lot évalué, mais il faut alors refaire un gel (nouvelle étiquette, nouvelle empreinte) et attendre un lot neuf. Les résultats d'un ancien gel ne valent que pour lui.

Lecture des résultats : avec peu de matchs, l'intervalle à 95 % est large (par exemple 44 % à 100 % pour 3 sur 3). Un écart avec « toujours R1 » ne se lit qu'avec cet intervalle.
