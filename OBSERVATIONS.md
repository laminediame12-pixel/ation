# Journal d'observations — hors protocole

Ce fichier n'est PAS le registre du test. Le test prospectif décrit dans
`PROTOCOLE.md` exige un code gelé ; le code change encore tous les jours, donc
aucune ligne ci-dessous ne compte statistiquement. Elles sont notées pour ne pas
être perdues, et pour que personne — moi le premier — ne puisse les réécrire
après coup.

Règle : on écrit la prédiction telle qu'elle a été donnée, le résultat tel qu'il
est tombé, et on ne commente pas dans la colonne.

---

## #1 — Tristitia / Via / Conjunctio / Rubeus

Prédit le 11/09/2026, avant le résultat. Code : commit `14f828d`.

| famille | prédit | réel | |
|---|---|---|---|
| Camp | **R7 — Équipe 2** | Équipe 1 | ✗ |
| Score | 1-2 (alt. 1-3) | 7-0 | ✗ |
| Volume | plus de 2,5 (2,93) | 7 buts | ✓ |
| BTTS | **OUI** | non (7-0) | ✗ |
| Nul | non | non | ✓ |
| Incidents | signal contre M1 | non renseigné | — |

Lecture du moteur 1N2 : R1 = M8 Fortuna Minor (feu dans terre, concordance 0),
R7 = M14 Carcer (terre dans air, concordance 0,25). Tranché au premier critère,
sur l'écart minimal de l'échelle — 0 contre 0,25.

Les deux familles justes (Volume, Nul) sont celles que leur témoin gagne aussi :
« toujours plus de 2,5 » et « toujours pas de nul ». Le système n'a donc rien
ajouté sur ce match. Les deux familles qui portent de l'information — Camp et
BTTS — sont fausses toutes les deux.

Hypothèse née de ce match, à pré-enregistrer avant d'être testée, jamais
après : quand les DEUX concordances valent 0 ou 0,25, le critère Concordance
départage deux mauvaises résidences et pourrait n'être que du bruit. Ne pas
toucher au moteur sur cette base — n = 1.

---

## Correction des axes — 11/09/2026

Ellemine_D : « Succédent 2-6-8-12, Cadent 3-5-9-11. » Cardinal inchangé (1-4-7-10).

L'« Axe du Partage » ajouté le 31/08/26 portait M3+M5+M9+M11 : c'était le Cadent,
classé sous un autre nom pendant que sa place était occupée par M3+M6+M9+M12.
Il fusionne dans le Cadent ; la validité redevient un test à trois axes.

Effet mesuré sur les 65 536 thèmes :

| | avant | après |
|---|---|---|
| thèmes valides | 41 983 | 46 483 |
| thèmes dont le nombre d'axes d'incident change | — | 29 280 (44,7 %) |
| déclenchement « au moins un axe d'incident » | 45,7 % | 45,7 % |

La fréquence de déclenchement est rigoureusement inchangée : les trois axes
partitionnent M1-M12 dans les deux cas, et la seule contrainte structurelle
(somme des trois axes = Populus, toujours) ne dépend pas du découpage.

**Ce que la correction a mis au jour.** Le moteur « une somme d'axe est figure
d'incident » était documenté 5/5. Remesuré sur les VINGT cas d'archive du
fichier, et non plus sur cinq :

| lecture | score |
|---|---|
| axes corrigés | **10/20 = 50 %** |
| anciennes maisons d'axes | 13/20 = 65 % |
| témoin « toujours incident » | **15/20 = 75 %** |

Le témoin idiot bat les deux. Le 5/5 était cinq cas choisis dans un lot de vingt
où la règle faisait déjà 13/20, et il tenait à des maisons d'axes fausses.

La règle reste branchée. On ne débranche pas un moteur sur une archive — ce
serait refaire la même erreur dans l'autre sens. Elle est au programme du test
prospectif, seuil ≥ 112/150.

### Suite — les classes de maisons suivent aussi (11/09/2026)

« Oui corrige-les aussi. » Les tests d'appartenance — « R1 est-il en maison
cadente ? », « Puer est-il en maison succédente ? » — employaient encore les
anciennes listes. Ils suivent : cadente 3-5-9-11, succédente 2-6-8-12.

Les trois listes étaient recopiées à **quatorze endroits**. Elles sont
maintenant déclarées une seule fois (`MAISONS_CARDINALES_V7`,
`MAISONS_SUCCEDENTES_V7`, `MAISONS_CADENTES_V7`) et tous les sites y pointent.

Effet mesuré sur les 65 536 thèmes, par rapport à la seule correction des axes :

| moteur | thèmes changés | total |
|---|---|---|
| BTTS | 147 | 62 043 → 62 076 OUI |
| Nul | 0 | 14 336 |
| Incidents | 0 | 64 413 |
| Camp (1N2) | 0 | R1 36 142 / R7 29 394 |

Le nul et les incidents ne bougent pas : leurs moteurs qui lisent la maison
cadente (« Saturne dans une maison cadente », « Serré · R1 en maison cadente »)
sont catalogués mais pas branchés sur la décision par défaut.

Un comptage historique du fichier — « R1 succédente 0/11, R1 CADENTE 2/6, les
deux nuls » — a été obtenu avec les anciennes classes. Il n'a pas été refait et
ne vaut plus pour le code actuel ; c'est noté à côté dans le source.

---

## Audit du repérage de R1 et R7 — 11/09/2026

Vérifié exhaustivement sur les 65 536 thèmes.

**Le repérage lui-même est sain.** R1 = maison de repos de la figure en M1,
R7 = septième position de la rotation (R1 + 6). Les cinq implémentations du
fichier — `getRotationCombat`, `getRotationOrderFromRepos`,
`calculerR1R7Rotation`, `themeTourneR1V7`, `analyserReseauAncrageV2` —
**s'accordent sur 65 536 thèmes sur 65 536, zéro désaccord**.

La table `MAISON_REPOS_NM` est confirmée par le procédé complet lui-même : son
§8 énumère les 16 figures dans exactement l'ordre qui donne leur maison de
repos (Fortuna Major est la 12e de la liste, sa maison de repos est M12).

**Le repli silencieux ne se déclenche jamais** dans le chemin normal (0 thème
sur 65 536), mais il existait et il était muet : un nom de figure inconnu
renvoyait M1 sans rien dire, et la rotation devenait triviale R1=M1 / R7=M7 —
indiscernable à l'écran d'une rotation triviale légitime (Puer en M1 donne
vraiment M1). Le fichier documente un cas où ça a duré, « vérifié 400/400
tirages ». Le repli parle maintenant dans la console.

**Ce qui était réellement faux : l'export image.**

| | couple | moteur |
|---|---|---|
| écran | R1 / R7 (rotation) | 1N2 |
| export image (avant) | M1 / M7 | `verdictFinal` |

L'image exportée nommait un **autre vainqueur que l'écran sur 15 765 thèmes
(24 %)**. Le commentaire du code disait qu'elle était « recalculée exactement
comme la carte principale » — c'était vrai quand la carte principale était la
carte M1/M7. Elle ne l'est plus depuis que le 1N2 pilote le verdict.

Troisième occurrence de la même faute dans ce fichier : la bannière qui nommait
un moteur et en appliquait un autre, la source du BTTS, et maintenant l'export.

---

## Correction de l'échelle de concordance — 11/09/2026

Ellemine_D : « Le verdict doit forcément changer si tout est respecté. »

Ce qui n'était pas respecté : l'échelle de concordance du 1N2 classait
Feu↔Terre et Air↔Eau **sous** les contraires. Le fichier le démentait tout seul.

| paire | qualité commune | `concordanceElement` (historique) | 1N2 (1ʳᵉ version) |
|---|---|---|---|
| feu × air | chaud | 0,5 | 0,5 |
| eau × terre | froid | 0,5 | 0,5 |
| feu × terre | **sec** | 0,25 | **0** ← inversé |
| air × eau | **humide** | 0,25 | **0** ← inversé |
| feu × eau | aucune | 0 | **0,25** ← inversé |
| air × terre | aucune | 0 | **0,25** ← inversé |

Les deux tables sont exactement retournées sur les quatre paires du bas. Feu et
Terre partagent le sec ; Feu et Eau ne partagent rien. Aucune lecture
élémentaire ne peut donner à feu×terre moins de relation qu'à feu×eau.

La correction « Air × Terre = contraire = 0,25 » disait dans quel sens
redresser : les vraies oppositions remontent de 0 à 0,25, donc tout ce qui
était au-dessus remonte aussi d'un rang. Échelle corrigée :

- **1** même élément
- **0,5** alliés — partagent une qualité : feu-air, eau-terre, feu-terre, air-eau
- **0,25** contraires — ne partagent rien : feu-eau, air-terre
- **0** sans relation — aucun élément lisible (cas dégénéré)

« Sans relation » ne décrit pas un couple d'éléments : entre deux éléments
réels il y a toujours au moins un contraire.

**Effet sur les 65 536 thèmes : 10 187 changent de camp (15,5 %)**, dont
5 051 R7→R1 et 5 136 R1→R7. Le changement est symétrique : ce n'est pas un
biais vers R1. Total R1 36 142 → 36 057, R7 29 394 → 29 479.

Sur le thème du 7-0 (Tristitia / Via / Conjunctio / Rubeus) : R1 = Fortuna
Minor (feu) en M8 (terre) passe de 0 à **0,5** ; R7 = Carcer (terre) en M14
(air) reste à 0,25. **Le verdict passe de R7 à R1 — le camp qui a gagné 7-0.**

⚠️ Ce n'est PAS une preuve. La faute a été trouvée sur un thème dont je
connaissais déjà le résultat. Ce qui la rend défendable est que l'argument ne
dépend pas de ce résultat : les deux tables du fichier sont inversées, et cela
se constate sans regarder aucun match. Mais un système qu'on corrige après
avoir vu tomber un score finit toujours par avoir raison sur le passé. Seul le
test prospectif peut trancher.
