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

### Le cercle des fronts

Les 16 figures sont placées sur un cercle, dans l'ordre de leur maison de repos. Quatre points partagent le cercle (`K.AXES`) :
- **A = Est**, entre 16 et 1 ;
- **D = Nord**, entre 4 et 5 ;
- **B = Ouest**, entre 8 et 9 ;
- **C = Sud**, entre 12 et 13.

Les figures 1 à 4 sont donc entre l'Est et le Nord, 5 à 8 entre le Nord et l'Ouest, 9 à 12 entre l'Ouest et le Sud, 13 à 16 entre le Sud et l'Est (`K.ROSE`). La page dessine ce cercle sous le thème pyramidal, avec les quatre points reliés ; chaque front y forme un carré.

Les quatre quarts du cercle sont les quatre générations du thème pyramidal : mères (M1 à M4), filles (M5 à M8), nièces (M9 à M12), témoins, juge et sentence (M13 à M16). Les points D, B et C sont donc les passages d'une génération à la suivante, et le point A la fermeture (M16 + M1 = M15). Le cercle affiche la somme des deux maisons qui encadrent chaque point, les résultantes, et, pour la maison touchée, les traits de génération (d'où elle vient, ce qu'elle donne).

Chaque point du cercle a une valeur propre : la somme des deux figures de repos qui l'encadrent. Les points A, D, B, C valent tous Puer (1). Quatre points seconds, au milieu des quarts (`K.AXES2`), se font face deux à deux avec la même valeur : entre 2 et 3 et entre 10 et 11 valent Via (5) ; entre 6 et 7 et entre 14 et 15 valent Cauda Draconis (13). Tous les autres intervalles valent Aquisitio (15). Le cercle dessine les deux carrés et les lignes qui relient les points face à face.

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
| CAS-001 | R1 et R7 dans le même front. D'abord : si l'antagoniste d'un seul pôle est dans sa propre maison de repos, l'autre pôle gagne (même entre miroirs) ; si les deux le sont, nul. Ensuite : Chaque front a deux moitiés (A : 1-5 et 9-13 ; B : 2-6 et 10-14 ; C : 3-7 et 11-15 ; D : 4-8 et 12-16). Un seul pôle a son partenaire de moitié dans sa maison de repos (base ou résultante) | Ce pôle gagne ; sinon nul | Confirmé |
| CAS-010 | Lu juste après CAS-001. 1) Un pôle est éteint (sa figure ne dépasse 1 % dans aucune position) et l'autre non (match réel 8·7·10·8). 2) Sinon, un seul pôle est dans la maison de son antagoniste (0 %) sans être fort ailleurs en base (au moins 70 %) | L'autre pôle gagne | En essai |
| CAS-011 | Le thème a des figures au repos, mais chacune est annulée : son attaquant (k−3) est aussi au repos, ou il est deux fois en base (hors positions à 1 % ou 0 %). Tiré du match réel 2·9·6·5. Lu après CAS-010 | Nul | En essai |
| CAS-002 | Deux figures du front d'un pôle, en base, chacune dans sa maison de repos à 100 %, et pas de verrou en face | Victoire assurée de ce pôle | En essai |
| CAS-003 | Le pôle est dans sa maison de repos (en base), son antagoniste non ; son front est dans sa propre maison (base ou résultante), l'antagoniste de ce front non ; les deux autres figures du front occupent des maisons paires | Victoire assurée de ce pôle | En essai |
| CAS-004 | Le pôle attaque directement l'autre pôle ; il est en M8 et une autre figure de son front est en M4 ou M12 | Victoire assurée de ce pôle | En essai |
| CAS-005 | Le pôle est dans la maison de son antagoniste direct, et son front direct ou le front de son miroir est absent ; l'adversaire a une figure de son front en maison paire (en M4 ou M12 si son front est Terre ou Eau) | Victoire assurée de l'adversaire | En essai |
| CAS-006 | Un pôle attaque directement l'autre, et le pôle attaqué n'a pas son front direct dans le thème | Le pôle sans front direct perd | En essai |
| CAS-008 | Lu avant CAS-007. Même boucle : le pôle qui est dans sa maison de repos (non annulé) gagne si l'autre n'y est pas. Pôles dans des boucles différentes. R1 et son binôme contre R7 et son binôme : la paire qui a le plus de figures dans leur maison de repos (base ou résultante)  Une figure chez elle seulement en résultante, sur le pôle adverse Populus dans sa maison de pôle, n'est que le reflet de ce pôle et ne compte pas. La victoire est « assurée » quand une figure somme du camp vainqueur est sur l'axe angulaire en base, sans somme adverse sur l'axe ni somme égale à un pôle | Cette paire gagne ; à égalité, pas de verdict | En essai |
| CAS-007 | Pôles dans la même boucle. Une figure Sud ou Nord du front du pôle (autre que le pôle) est dans sa propre maison de repos, en base ou en résultante | Victoire de ce pôle | En essai |
| CAS-009 | Aucun autre cas ne tranche. 0) La somme de l'axe angulaire est un pôle qui siège lui-même en M1, M4, M7 ou M10 : ce pôle gagne (match réel 4·3·13·12). 1) Sinon, une figure somme (axe angulaire M1+M4+M7+M10, ou M3+M5+M11+M15) est elle-même un pôle : nul. 1 bis) La somme au point D du cercle (M4 + M5) est le miroir d'un pôle : nul. 2) Sinon, ancrages en base non annulés par boucle : la boucle la mieux ancrée gagne. 2 bis) À égalité, en boucles différentes, si la somme au point B (M8 + M9) ou C (M12 + M13) est le miroir d'un seul pôle, ce pôle gagne. 3) Sinon, lecture du cercle (`L.cercle`) : le pôle dont la figure est au bord d'un point (fronts A et D) face à un pôle de l'intérieur (fronts B et C), et le pôle en amont (l'autre est à 1, 3 ou 5 figures devant lui dans le sens de l'attaque). Si les signaux désignent un seul pôle, il gagne ; s'ils se contredisent, nul. 4) Sinon nul. Même boucle : nul | Voir la condition | En essai |

Les cas 003 à 007 valent pour R1 comme pour R7. Si les deux pôles remplissent la même condition, le cas ne tranche pas.

### « 12 » et double chance

Sous le verdict, la page affiche `decision.marches` :
- **« 12 » (pas de nul)** dès qu'un de ces signaux est présent : écart d'au moins deux ancrages ; en boucles différentes, majorité des 15 résultantes dans la boucle de R7 ; somme de l'axe angulaire égale à un pôle qui siège sur l'axe. Avec deux signaux ou plus, il est « renforcé ».
- **Double chance** : le camp que le verdict désigne ; à défaut, le pôle désigné par l'axe, ou le camp le mieux ancré (`1X` pour R1, `X2` pour R7).
- **Vers le nul** : majorité des résultantes dans la boucle de R1, ou figure somme égale à un pôle hors de l'axe.
- S'ajoutent aux signaux de nul : un point du cercle « au repos » (la somme des deux maisons du thème qui l'encadrent redonne la valeur propre du point), et M16 portant la figure d'un pôle (M16 est toujours la somme des huit points du cercle).
- « Signaux contraires » quand le « 12 » s'oppose à un verdict nul ou à un signal de nul.

### Combinaisons du cercle et but en première mi-temps

`K.COMBIS` liste des combinaisons de quatre maisons : l'axe angulaire 1-4-7-10, la combinaison 1-5-12-15, le témoin 3-5-11-15, chacune avec ses trois sœurs (un quart de tour, +4 maisons), et les quatre fronts. Pour chaque thème, `L.combinaisons` donne la somme des quatre maisons et dit si cette somme se trouve dans ces mêmes maisons, en base ou en résultante. `L.butMiTemps` applique la règle du propriétaire : un but en première mi-temps est annoncé quand la somme de l'axe angulaire, ou un des deux pôles, se trouve dans une maison de l'axe. La base compte dans les quatre maisons (M1, M4, M7, M10) ; la résultante ne compte qu'en M4 et M10. Une résultante en M1 ou M7 donne seulement un signal faible.

Pour la deuxième mi-temps, `L.butMiTemps2` applique la même lecture à l'axe miroir 9-12-15-2 (l'axe angulaire tourné d'un demi-cercle), avec M12 et M2 comme maisons fortes. C'est une hypothèse tirée de la symétrie du cercle, pas encore vérifiée sur des matchs.

### Précision du verdict

`decision.precision` compte les signaux qui vont dans le sens du verdict et ceux qui vont contre (signaux « 12 », signaux de nul, ancrages, cercle, miroir aux points, figure du lien). Niveaux : forte (au moins deux pour, aucun contre), moyenne (un pour), sans signal, discutée (plus de pour que de contre), contredite. La page l'affiche à côté du cas.

### Figure du lien

La somme des deux pôles (`L.lien`). Elle dit quel lien les unit : Tristitia pour des miroirs, Albus ou Fortuna Major pour un même front, une figure paire dans la même boucle, impaire en boucles différentes. La page l'affiche sous le verdict, avec ses maisons en base et en résultante. Elle ne change pas le verdict.

### Thème parlant

Quand le binôme de M1 se trouve en M4 ou en M10 (base ou résultante), le thème est beaucoup plus parlant. Le moteur le signale (`L.binomeM1`, `decision.parlant`) et la page l'affiche sous le témoin de validation. Cela ne change pas le verdict.

### Contrôle de cohérence

Un cas ne peut pas donner la victoire à un pôle quand au moins deux signaux de camp (ancrages, pôle désigné par l'axe angulaire, miroir aux points du cercle, favori du cercle) désignent l'autre pôle et qu'aucun ne le désigne lui. Le cas est alors écarté et le moteur passe au suivant ; la page le signale (« Cas écartés pour incohérence »).

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
