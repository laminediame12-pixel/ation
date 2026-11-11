# koun · moteur 2

L'atelier (l'interface) est conservé. Le moteur est reconstruit en deux étages, dans un seul fichier court : [`moteur.js`](moteur.js).

## Étage 1 : la structure

Elle ne décide rien. Elle décrit le thème :
- les 16 figures, numérotées par leur maison de repos ;
- la construction des 16 maisons à partir des 4 mères ;
- la résultante de chaque maison (base + figure de repos de la maison) ;
- les fronts A, B, C, D, leurs points cardinaux et leurs éléments ;
- les forces (100 % dans sa maison de repos, sinon le barème des éléments) ;
- le double repos (deux figures liées par l'attaque, chacune chez elle, s'annulent) ;
- les pôles (R1 = maison de repos de la figure de M1, R7 = R1 + 6) ;
- les attaques (k attaque k+3).

Sur les 11 thèmes réels, cette structure donne exactement les mêmes maisons, résultantes, forces et pôles que l'ancien moteur.

## Étage 2 : les cas

Un cas est une condition écrite qui donne un résultat. Le moteur lit les cas dans l'ordre ; le premier qui s'applique tranche. Si aucun ne s'applique, le moteur répond « aucun cas applicable » et ne donne pas de verdict.

| Cas | Condition | Résultat | Statut |
|---|---|---|---|
| CAS-001 | R1 et R7 dans le même front (identique, miroir ou voisin) | Nul | Confirmé |
| CAS-002 | Deux figures du front d'un pôle, en base, chacune dans sa maison de repos à 100 %, et pas de verrou en face | Victoire assurée de ce pôle | En essai |
| CAS-003 | Le pôle est dans sa maison de repos (en base), son antagoniste non ; son front est dans sa propre maison (base ou résultante), l'antagoniste de ce front non ; les deux autres figures du front occupent des maisons paires | Victoire assurée de ce pôle | En essai |
| CAS-004 | Le pôle attaque directement l'autre pôle ; il est en M8 et une autre figure de son front est en M4 ou M12 | Victoire assurée de ce pôle | En essai |
| CAS-005 | Le pôle est dans la maison de son antagoniste direct, et son front direct ou le front de son miroir est absent ; l'adversaire a une figure de son front en maison paire (en M4 ou M12 si son front est Terre ou Eau) | Victoire assurée de l'adversaire | En essai |
| CAS-006 | Un pôle attaque directement l'autre, et le pôle attaqué n'a pas son front direct dans le thème | Le pôle sans front direct perd | En essai |

Les cas 003 à 006 valent pour R1 comme pour R7. Si les deux pôles remplissent la même condition, le cas ne tranche pas.

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
