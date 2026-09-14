# Le système, en fichiers

Avant le 04/09/26 : **un** fichier HTML de 32 460 lignes / 2,03 Mo, dont
un seul bloc `<script>` de 29 398 lignes.

Maintenant : une page de 96 Ko qui charge 22 fichiers `js/`.

## Ce qui a changé, et ce qui n'a pas changé

**L'ordre est celui d'origine, octet pour octet.** Le découpage n'a
coupé qu'aux frontières de niveau supérieur (profondeur 0, hors chaîne,
gabarit, commentaire et littéral regex), et chaque fichier a été validé
par `node --check`. Les `<script src>` sont aux emplacements exacts des
blocs qu'ils remplacent.

**Une seule chose change vraiment : le hoisting.** Dans un bloc unique,
les déclarations `function` étaient visibles sur les 29 398 lignes — un
auto-test écrit ligne 700 pouvait appeler une fonction déclarée ligne
26 000. Par fichier, ce filet s'arrête au fichier. Trois auto-tests en
dépendaient et tombaient, et un `throw` en haut d'un fichier tue le
reste du fichier — **y compris les `const` qu'il déclare** : c'est
comme ça que `PLANETES_V7` disparaissait.

D'où le registre `autoTestV7()` / `jouerAutoTestsV7()` dans
`01-amorce.js`, joué en toute fin de chargement par `34-demarrage.js`.
**Cinq auto-tests** y sont inscrits.

## Règles

- Scripts **classiques**. Pas de `type="module"`, pas de `defer`, pas
  d'`async` : l'ordre est la sémantique.
- Tout est global et partagé, comme avant. Un fichier peut appeler une
  fonction d'un autre — mais **pas au moment du chargement** si l'autre
  vient après. Du code exécuté au niveau supérieur qui appelle du code
  d'un fichier ultérieur doit passer par `autoTestV7()` ou attendre
  `initializeApp`.
- Ça fonctionne en `file://` (vérifié) : pas besoin de serveur.

## Les fichiers

| fichier | contenu |
|---|---|
| `01-amorce.js` | registre des auto-tests, amorce |
| `02-carre-geo-glyphes.js` | module du carré géomantique (IIFE fermée, portée privée) |
| `10-doctrine-et-tables.js` | figures, glyphes, éléments, binômes, antagonistes, camps |
| `11-axes-resultantes-rotation.js` | axes, résultantes, variantes, rotation R1/R7 |
| `12-boucles-ancrage-panneaux.js` | boucles, nul par pivot, figure du jour, panneaux |
| `13-signaux-et-positions.js` | signaux de maison, recherche de positions, planètes |
| `14-duels-et-meute.js` | emprisonnement, auto-construction/destruction, meute |
| `15-elementaire-roles-f4p4.js` | élémentaire R1/R7, rôles, moteur F4P4 |
| `16-archive-et-consensus.js` | `CAS_REFERENCE_V7`, double tirage, consensus |
| `17-banc-et-mesures.js` | paires, balayage, arbitrage, validité par famille, banc, mémos |
| `18-format-live-nul.js` | format réel/e-sport, mode direct, portes du nul |
| `19-rendu-panneaux-verdict.js` | panneaux de rendu, procédure R1/R7, verdicts |
| `20-points-guerre-binomes.js` | méthode des points, thème détruit, guerre civile |
| `21-validite-accord-v8.js` | rejet/validité, accord, architecture V8, trajectoires |
| `22-v8-verdict-carre.js` | moteur V8, verdict standard, carré, cascade du verdict |
| `23-theme-rotation-validite.js` | construction du thème, rotation, niveau de validité |
| `24-sauvegarde-et-ui.js` | tableau BTTS, sauvegarde, onglets, cohérence |
| `30-lancement.js` … `34-demarrage.js` | échappement, heures planétaires, démarrage |

## Revenir à un fichier unique

    python3 outils/construire_fichier_unique.py [sortie.html]

Réinsère chaque `js/*.js` à la place de son `<script src>`. Vérifié :
même précision d'archive (38/56), zéro erreur, cinq auto-tests joués.
