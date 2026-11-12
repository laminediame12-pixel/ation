# koun · moteur 2

L'atelier (l'interface) est conservé. Le moteur est reconstruit en deux étages, dans un seul fichier court : [`moteur.js`](moteur.js).

## Étage 1 : la structure

Elle ne décide rien. Elle décrit le thème :
- les 16 figures, numérotées par leur maison de repos ;
- la construction des 16 maisons à partir des 4 mères ;
- la résultante de chaque maison (base + figure de repos de la maison) ;
- les fronts A, B, C, D, leurs points cardinaux et leurs éléments ;
- les forces (100 % dans sa maison de repos, sinon le barème des éléments) ;
- la maison antagoniste : une figure dans la maison de repos de celle qui l'attaque (k−3) est pénalisée, faible et fragile aux attaques ; c'est le contraire de sa propre maison, sa force s'inverse (0 %) ;
- le double repos (deux figures liées par l'attaque, chacune chez elle, s'annulent) ;
- les pôles (R1 = maison de repos de la figure de M1, R7 = R1 + 6) ;
- les attaques (k attaque k+3).

Sur les 11 thèmes réels, cette structure donne exactement les mêmes maisons, résultantes, forces et pôles que l'ancien moteur.

### Les trois modes de confrontation

La façon de lire R1 contre R7 dépend de leur position :
- **même front** : départage par les moitiés du front (CAS-001) ;
- **même boucle, fronts différents** : le front du pôle contre son front antagoniste ;
- **boucles différentes** (pair contre impair) : par paires, figure et son binôme contre figure et son binôme. Le camp d'un pôle est alors toute sa boucle (son front et le front binôme).

Le chemin de chaque pôle est dans `L.chemin` : étape par étape (pôle, binôme, front direct, miroir…), la figure est-elle chez elle, ailleurs ou absente, et sa maison est-elle tenue par un allié ou par l'adversaire. La page l'affiche en vert (bon emplacement) et en rouge (mauvais). Le chemin ne décide rien : il montre.

Le moteur donne le mode dans `L.mode` et, en boucles différentes, les huit figures de chaque camp dans `L.confrontation`.

## Étage 2 : les cas

Un cas est une condition écrite qui donne un résultat. Le moteur lit les cas dans l'ordre ; le premier qui s'applique tranche. Le dernier cas (CAS-009, équilibre des ancrages) tranche toujours : le moteur donne donc un verdict pour chaque thème.

| Cas | Condition | Résultat | Statut |
|---|---|---|---|
| CAS-001 | R1 et R7 dans le même front. Chaque front a deux moitiés (A : 1-5 et 9-13 ; B : 2-6 et 10-14 ; C : 3-7 et 11-15 ; D : 4-8 et 12-16). Un seul pôle a son partenaire de moitié dans sa maison de repos (base ou résultante) | Ce pôle gagne ; sinon nul | Confirmé |
| CAS-010 | Un seul des deux pôles est dans la maison de son antagoniste (pénalisé, 0 %). Lu juste après CAS-001 | L'autre pôle gagne | En essai |
| CAS-011 | Le thème a des figures au repos, mais chacune est annulée : son attaquant (k−3) est aussi au repos, ou il est deux fois en base (hors positions à 1 % ou 0 %). Tiré du match réel 2·9·6·5. Lu après CAS-010 | Nul | En essai |
| CAS-002 | Deux figures du front d'un pôle, en base, chacune dans sa maison de repos à 100 %, et pas de verrou en face | Victoire assurée de ce pôle | En essai |
| CAS-003 | Le pôle est dans sa maison de repos (en base), son antagoniste non ; son front est dans sa propre maison (base ou résultante), l'antagoniste de ce front non ; les deux autres figures du front occupent des maisons paires | Victoire assurée de ce pôle | En essai |
| CAS-004 | Le pôle attaque directement l'autre pôle ; il est en M8 et une autre figure de son front est en M4 ou M12 | Victoire assurée de ce pôle | En essai |
| CAS-005 | Le pôle est dans la maison de son antagoniste direct, et son front direct ou le front de son miroir est absent ; l'adversaire a une figure de son front en maison paire (en M4 ou M12 si son front est Terre ou Eau) | Victoire assurée de l'adversaire | En essai |
| CAS-006 | Un pôle attaque directement l'autre, et le pôle attaqué n'a pas son front direct dans le thème | Le pôle sans front direct perd | En essai |
| CAS-007 | Pôles dans la même boucle. Une figure Sud ou Nord du front du pôle (autre que le pôle) est dans sa propre maison de repos, en base ou en résultante | Victoire de ce pôle | En essai |
| CAS-008 | Pôles dans des boucles différentes. R1 et son binôme contre R7 et son binôme : la paire qui a le plus de figures dans leur maison de repos (base ou résultante)  La victoire est « assurée » quand une figure somme du camp vainqueur est sur l'axe angulaire en base, sans somme adverse sur l'axe ni somme égale à un pôle | Cette paire gagne ; à égalité, pas de verdict | En essai |
| CAS-009 | Aucun autre cas ne tranche. 1) Une figure somme (axe angulaire M1+M4+M7+M10, ou M3+M5+M11+M15) est elle-même un pôle : nul. 2) Sinon, ancrages en base non annulés par boucle : la boucle la mieux ancrée gagne. 3) À égalité, si un seul camp a une figure somme en base, il gagne. 4) Sinon nul. Même boucle : nul | Voir la condition | En essai |

Les cas 003 à 007 valent pour R1 comme pour R7. Si les deux pôles remplissent la même condition, le cas ne tranche pas.

### Déséquilibre fort : « 12 » et double chance

Le moteur compte les ancrages de chaque camp : ses figures dans leur maison de repos, en base, non annulées (`L.stabilite`). La fenêtre du verdict affiche toujours ce compte. Écart nul : équilibre. Écart de un : double chance du camp le plus stable (`1X` pour R1, `X2` pour R7). Écart de deux ou plus : « 12 » (pas de nul) en plus. Le tout est dans `decision.marches`.

### Ajouter un cas

Dans `moteur.js`, ajouter un bloc à la liste `CAS` :

```js
{
  id: 'CAS-003', titre: '…', statut: 'EN_ESSAI',   // ou 'REGLE_CONFIRMEE'
  enonce: 'La condition, en une phrase.',
  condition: function (L) {
    // L = la lecture du thème : L.maisons, L.R1, L.R7, L.duels, L.annulations, L.verrous,
    //     L.force(figure, maison), L.positions(figure), L.chezElle(figure)…
    if (/* la condition n'est pas remplie */ false) return null;
    return { verdict: '1', assuree: false, raison: 'Pourquoi.' };   // '1' = R1, '2' = R7, 'N' = nul
  }
}
```

Puis reconstruire et tester :

```
node construire.js ../archives/koun-1-v1.15.4.html ../koun-1-complet.html
node tester.js /chemin/absolu/vers/koun-1-complet.html
```

`construire.js` recalcule les instantanés des références, vérifie qu'aucune des 65 536 combinaisons de mères ne fait planter le moteur et que R1 et R7 sont traités de la même façon (symétrie). Ce contrôle ne prouve aucune règle : seuls les matchs réels le peuvent.

## Fichiers

- `moteur.js` : le moteur (structure + cas).
- `pont.js` : met la lecture du moteur au format de l'atelier.
- `page.html` : la page affichée dans l'onglet « Moteur intégré ».
- `construire.js` : assemble l'atelier et le moteur dans `koun-1-complet.html`.
- `tester.js` : test de bout en bout dans un navigateur.
- `../archives/koun-1-v1.15.4.html` : l'atelier de départ, avec l'ancien moteur.
