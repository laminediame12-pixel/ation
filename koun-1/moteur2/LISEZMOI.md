# koun · moteur 2

L'atelier (l'interface) est conservé. Le moteur est reconstruit en deux étages, dans un seul fichier court : [`moteur.js`](moteur.js).

## Trois couches, à ne pas mélanger

1. **La structure** décrit le thème (maisons, résultantes, forces, pôles, cercle). Elle ne juge rien.
2. **Les cas** décident le verdict. Un cas est une condition écrite ; le premier qui s'applique tranche.
3. **Les signaux** (12, double chance, poids des pôles, multiplicité, figure du lien, points du cercle, précision) accompagnent le verdict. Ils ne décident pas. La page les range dans un bloc replié, « Signaux et détails ».

Une observation nouvelle entre d'abord comme signal. Elle ne devient un cas que sur décision du propriétaire, après vérification sur des matchs réels.

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
- **même front** : départage par les moitiés du front (famille « Même front ») ;
- **même boucle, fronts différents** : le front du pôle contre son front antagoniste ;
- **boucles différentes** (pair contre impair) : par paires, figure et son binôme contre figure et son binôme. Le camp d'un pôle est alors toute sa boucle (son front et le front binôme).

Le chemin de chaque pôle est dans `L.chemin` : étape par étape (pôle, binôme, front direct, miroir…), la figure est-elle chez elle, ailleurs ou absente, et sa maison est-elle tenue par un allié ou par l'adversaire. La page l'affiche en vert (bon emplacement) et en rouge (mauvais). Le chemin ne décide rien : il montre.

Le moteur donne le mode dans `L.mode` et, en boucles différentes, les huit figures de chaque camp dans `L.confrontation`.

## Étage 2 : les cas

Un cas est simple : **une** condition, **un** résultat. Le moteur lit les cas dans l'ordre ci-dessous ; le premier qui s'applique tranche. Les cas sont rangés par familles ; dans une famille, chaque cas suppose que les précédents ne se sont pas appliqués. Le dernier cas (DR-10) s'applique toujours : le moteur donne donc un verdict pour chaque thème.

Quand une famille dit « un seul pôle remplit ceci », le cas ne tranche pas si les deux pôles le remplissent.

| Cas | Famille | Condition et résultat | Matchs réels tranchés |
|---|---|---|---|
| MF-1 | Même front | Pôles dans le même front, et l’antagoniste de chaque pôle est dans sa propre maison de repos : nul. | aucun |
| MF-2 | Même front | Pôles dans le même front, et l’antagoniste d’un seul pôle est dans sa propre maison de repos : ce pôle est dominé, l’autre gagne, même entre miroirs. | aucun |
| MF-3 | Même front | Pôles dans le même front et dans la même moitié (A : 1-5 et 9-13 ; B : 2-6 et 10-14 ; C : 3-7 et 11-15 ; D : 4-8 et 12-16) : nul. | 1 juste |
| MF-4 | Même front | Pôles dans le même front, moitiés différentes, et un seul pôle a son partenaire de moitié dans sa maison de repos (base ou résultante) : ce pôle gagne. | 1 juste |
| MF-5 | Même front | Pôles dans le même front, et les deux partenaires de moitié sont chez eux, ou aucun : nul. | 2 justes |
| PF-1 | Pôle sans force | Un seul des deux pôles est éteint (sa figure ne dépasse 1 % dans aucune position) : l’autre gagne. | 1 juste |
| PF-2 | Pôle sans force | Un pôle attaque l’autre directement ; l’attaqué n’a que 1 % ou moins dans sa maison de pôle et l’attaquant tient la sienne à plus de 1 % : l’attaquant gagne. | 3 justes |
| PF-3 | Pôle sans force | Un seul pôle est dans la maison de son antagoniste (0 %) sans être fort ailleurs en base (au moins 70 %) : l’autre gagne. | aucun |
| RA-1 | Repos annulés | Le thème a des figures dans leur maison de repos, mais chacune est annulée (son attaquant est aussi au repos, ou il est deux fois en base hors positions à 1 % ou 0 %) : nul. | 1 juste |
| PR-1 | Verrou de front | Deux figures du front d’un pôle sont en base, chacune dans sa maison de repos à 100 %, et l’autre pôle n’a pas de verrou : ce pôle gagne. | aucun |
| PR-2 | Pôle et front au repos | Un seul pôle remplit ceci : il est chez lui en base, son antagoniste non ; son front direct est chez lui, l’antagoniste de ce front non ; les deux autres figures du front occupent des maisons paires. Ce pôle gagne. | aucun |
| PR-3 | Attaquant en M8 | Un seul pôle remplit ceci : il attaque l’autre directement, il est en M8, et une autre figure de son front est en M4 ou M12. Ce pôle gagne. | aucun |
| PR-4 | Pôle chez son antagoniste | Un pôle est dans la maison de son antagoniste direct, son front direct ou le front de son miroir est absent, et l’adversaire a une figure de son front en maison paire (M4 ou M12 si son front est Terre ou Eau) : l’adversaire gagne. | aucun |
| PR-5 | Attaqué sans front direct | Un pôle attaque l’autre directement, et le pôle attaqué n’a pas son front direct dans le thème : le pôle attaqué perd. | aucun |
| CL-1 | Pôle chez lui | Pôles dans la même boucle, fronts différents. Un seul pôle est dans sa maison de repos (non annulé, pas un simple reflet de Populus) : il gagne. | 2 justes |
| CL-2 | Pôle chez lui | Pôles dans des boucles différentes. On compare R1 et son binôme à R7 et son binôme : la paire qui a le plus de figures chez elles (sans les figures annulées ni les reflets) gagne. La victoire est « assurée » si une figure somme du vainqueur est sur l’axe angulaire en base, sans somme adverse sur l’axe ni somme égale à un pôle. | 3 justes |
| PR-6 | Front Sud ou Nord au repos | Pôles dans la même boucle ou le même front. Un seul pôle a une figure Sud ou Nord de son front (autre que lui) dans sa maison de repos, reflets de Populus exclus : ce pôle gagne. | aucun |
| DR-1 | Dernier recours | La somme de l’axe angulaire (M1+M4+M7+M10) est un pôle qui siège lui-même en M1, M4, M7 ou M10 : ce pôle gagne. | 1 juste |
| DR-2 | Dernier recours | La somme de l’axe angulaire ou la somme 3-5-11-15 est elle-même un pôle : le thème se referme sur ce pôle, nul. | 3 justes |
| DR-3 | Dernier recours | La somme au point D du cercle (M4 + M5) est le miroir d’un pôle : nul. | aucun |
| DR-4 | Dernier recours | Pôles dans la même boucle, à six figures d’écart (l’un attaque une figure qui attaque l’autre) : nul. | aucun |
| DR-5 | Dernier recours | Pôles dans la même boucle, et rien ne les a départagés : nul. | 1 juste, 1 faux (13·12·8·15) |
| DR-6 | Dernier recours | Boucles différentes. Une boucle a plus de figures chez elles en base (non annulées) que l’autre : son pôle gagne. | 1 juste |
| DR-7 | Dernier recours | Boucles différentes, ancrages égaux. La somme au point B (M8 + M9) ou C (M12 + M13) est le miroir d’un seul pôle : ce pôle gagne. | aucun |
| DR-8 | Dernier recours | Boucles différentes, ancrages égaux. Les signaux du cercle (pôle au bord d’un point, pôle en amont) désignent un seul pôle : il gagne. | aucun |
| DR-9 | Dernier recours | Boucles différentes, ancrages égaux, et les deux signaux du cercle désignent des pôles différents : nul. | aucun |
| DR-10 | Dernier recours | Rien ne départage les deux pôles : les ancrages s’équilibrent, nul. | aucun |

## Les signaux

Ils accompagnent le verdict et ne décident pas.

### « 12 » et double chance

Sous le verdict, la page affiche `decision.marches` :
- **« 12 » (pas de nul)** dès qu'un de ces signaux est présent : écart d'au moins deux ancrages ; en boucles différentes, majorité des 15 résultantes dans la boucle de R7 ; somme de l'axe angulaire égale à un pôle qui siège sur l'axe. Avec deux signaux ou plus, il est « renforcé ».
- **Double chance** : le camp que le verdict désigne ; à défaut, le pôle désigné par l'axe, ou le camp le mieux ancré (`1X` pour R1, `X2` pour R7).
- **Vers le nul** : majorité des résultantes dans la boucle de R1, ou figure somme égale à un pôle hors de l'axe.
- S'ajoutent aux signaux de nul : un point du cercle « au repos » (la somme des deux maisons du thème qui l'encadrent redonne la valeur propre du point), et M16 portant la figure d'un pôle (M16 est toujours la somme des huit points du cercle).
- « Signaux contraires » quand le « 12 » s'oppose à un verdict nul ou à un signal de nul.

### Combinaisons du cercle et but en première mi-temps

`K.COMBIS` liste des combinaisons de quatre maisons : l'axe angulaire 1-4-7-10, la combinaison 1-5-12-15, le témoin 3-5-11-15, chacune avec ses trois sœurs (un quart de tour, +4 maisons), et les quatre fronts. Pour chaque thème, `L.combinaisons` donne la somme des quatre maisons et dit si cette somme se trouve dans ces mêmes maisons, en base ou en résultante. `L.butMiTemps` applique la règle du propriétaire : un but en première mi-temps est annoncé quand la somme de l'axe angulaire, ou un des deux pôles, se trouve dans une maison de l'axe. La base compte dans les quatre maisons (M1, M4, M7, M10) ; la résultante ne compte qu'en M4 et M10. Une résultante en M1 ou M7 donne seulement un signal faible.

Pour la deuxième mi-temps, `L.butMiTemps2` applique la même lecture à l'axe miroir 9-12-15-2 (l'axe angulaire tourné d'un demi-cercle), avec M12 et M2 comme maisons fortes. C'est une hypothèse tirée de la symétrie du cercle. Sur les trois matchs où la mi-temps est connue, elle n'est juste qu'une fois : elle n'est plus affichée dans le verdict, seulement dans le bloc des combinaisons.

### Précision du verdict

`decision.precision` compte les signaux qui vont dans le sens du verdict et ceux qui vont contre. Seuls les signaux jamais pris en défaut sur les matchs réels sont comptés : miroir au point D, poids des pôles (même front, même boucle), ancrages, bord du cercle, miroir aux points B et C, signaux « 12 ». Les signaux déjà vus du mauvais côté (somme égale à un pôle, point au repos, M16 porteur d'un pôle, amont, figure du lien) sont listés comme indices faibles et ne comptent pas contre une victoire. Niveaux : forte (au moins deux pour, aucun contre), moyenne (un pour), sans signal, discutée (plus de pour que de contre), contredite. La page l'affiche à côté du cas.

### Poids des pôles en base

`L.poidsPoles` additionne les forces de la figure de chaque pôle dans toutes ses positions en base. Sur les huit matchs réels où les pôles sont dans le même front ou la même boucle, R1 plus lourd que R7 annonce un match qui se décide, et R1 pas plus lourd un nul (8 sur 8). C'est un signal : il entre dans le « 12 », le « vers le nul » et la précision, pas dans les cas, parce qu'il ne traite pas R1 et R7 de la même façon.

### Multiplicité des pôles

`L.multiplicite` compte les positions de la figure de chaque pôle, en base et en résultante. Sur les matchs réels décidés, le pôle le plus présent est le vainqueur 9 fois sur 10 quand les deux nombres diffèrent. Elle sert de signal de camp (double chance, précision) ; elle ne dit pas si le match est nul.

### Figure du lien

La somme des deux pôles (`L.lien`). Elle dit quel lien les unit : Tristitia pour des miroirs, Albus ou Fortuna Major pour un même front, une figure paire dans la même boucle, impaire en boucles différentes. La page l'affiche sous le verdict, avec ses maisons en base et en résultante. Elle ne change pas le verdict.

### Thème parlant

Quand le binôme de M1 se trouve en M4 ou en M10 (base ou résultante), le thème est beaucoup plus parlant. Le moteur le signale (`L.binomeM1`, `decision.parlant`) et la page l'affiche sous le témoin de validation. Cela ne change pas le verdict.

### Contrôle de cohérence

Un cas ne peut pas donner la victoire à un pôle quand au moins deux signaux de camp (ancrages, pôle désigné par l'axe angulaire, miroir aux points du cercle, favori du cercle) désignent l'autre pôle et qu'aucun ne le désigne lui. Le cas est alors écarté et le moteur passe au suivant ; la page le signale (« Cas écartés pour incohérence »).

### Thème de vérification

Les quatre maisons de l'axe angulaire (M1, M4, M7, M10) sont prises comme quatre mères d'un second thème, le thème de vérification (`decision.verification`). Il garde la même figure en M1, donc les mêmes maisons de pôles. Le moteur le construit et le lit, la page l'affiche avec un bouton pour l'ouvrir ; il ne décide rien dans le thème principal. Lu tel quel par les cas actuels, il ne retrouve le résultat réel que 8 fois sur 21 : la façon de le lire reste à définir par le propriétaire.

Deux signaux viennent aussi de l'axe : les deux pôles sur l'axe (M1 et M7, ou M4 et M10) annoncent un match décidé ; la somme de l'axe égale au pôle R7 penche vers le nul.

## Écrire un cas

### Ajouter un cas

Dans `moteur.js`, ajouter un bloc à la liste `CAS` :

```js
{
  id: 'XX-1', famille: 'Nom de la famille', titre: '…', statut: 'EN_ESSAI',   // ou 'REGLE_CONFIRMEE'
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

## État des cas (audit du 13 novembre 2026)

Vingt et un matchs réels servent de référence. Le moteur en explique vingt ; le seul écart est 13·12·8·15 (pôles dans la même boucle, aucun chez lui).

La dernière colonne du tableau des cas ci-dessus donne, pour chaque cas, le nombre de matchs réels qu'il tranche.

Quatre verdicts ont été donnés avant de connaître le résultat (trois matchs FIFA du 12 novembre et 8·7·10·8) : les quatre étaient faux. Les règles ont été corrigées après coup. Tant qu'une série de verdicts donnés d'avance n'a pas été vérifiée, le moteur explique le passé mais ne prédit pas.

## Fichiers

- `moteur.js` : le moteur (structure + cas).
- `pont.js` : met la lecture du moteur au format de l'atelier.
- `page.html` : la page affichée dans l'onglet « Moteur intégré ».
- `construire.js` : assemble l'atelier et le moteur dans `koun-1-complet.html`.
- `tester.js` : test de bout en bout dans un navigateur.
- `../archives/koun-1-v1.15.4.html` : l'atelier de départ, avec l'ancien moteur.
