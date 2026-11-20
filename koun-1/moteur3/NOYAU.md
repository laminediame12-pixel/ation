# Noyau structurel

`moteur3/noyau.js` : tout ce qui est exact dans un thème, sans aucune règle de verdict. Fichier autonome. Le moteur de verdict (`moteur.js`, gelé) n'est pas modifié ; le noyau est testé contre lui.

## Une table, le reste est de l'algèbre
- Une seule table : les 16 figures et leurs niveaux.
- **Addition** : niveaux égaux = 2 points, différents = 1. **Miroir** = + Tristitia. **Binôme** = + Amissio (blocs M1-4, M9-12) ou + Puella (blocs M5-8, M13-16). **Antagoniste** = n − 3. **Front** = (n − 1) mod 4.

## Fonctions
| Fonction | Rôle |
|---|---|
| `construire([m1, m2, m3, m4])` | Thème complet : bases et résultantes des 16 maisons (M16 : résultante = base). |
| `poles(theme)` | R1 = maison du numéro de la figure de M1 ; R7 = R1 + 6 ; leurs figures. |
| `verifier(bases)` | Dit si un thème de 16 maisons est valide, nomme les maisons fausses et les lois violées (sur les 48). |
| `deduire({maison: figure, …})` | À partir de quelques maisons connues : cohérence, plus petit conflit, niveaux imposés dans les autres maisons, thème complet si 4 maisons bien choisies suffisent. |
| `additionner`, `miroir`, `binome`, `antagoniste`, `front`, `nom`, `numero`, `niveaux` | Opérations de base. |

## Garanties vérifiées (`node outils/tester_noyau.js`, 17 contrôles)
- `construire` et `poles` donnent exactement les mêmes bases, résultantes et pôles que le moteur gelé sur les 65 536 thèmes.
- `verifier` accepte les 65 536 thèmes et rejette 100 % de 37 517 thèmes dont une seule maison est altérée, en nommant au moins une loi violée.
- `deduire` retrouve les invariants : 55 ensembles de 4 maisons déterminent le thème ; 841, 638, 380, 568, 593 et 562 ensembles de maisons cohérents pour l'antagoniste (deux lectures), le binôme, le miroir, Rubeus et Tristitia ; M4 = Puer avec M5 = Laetitia est un conflit minimal.

## Ce que le noyau ne fait pas
Aucun verdict, aucun score, aucune pénalité : ces règles restent dans `moteur.js` (gelé) et ne sont pas encore confirmées. Étape suivante prévue : retirer du moteur les règles non confirmées et faire reposer le moteur sur ce noyau.
