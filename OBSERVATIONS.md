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

### La table partagée suit aussi (11/09/2026)

« Corrige ça. » `concordanceElement()`, que j'avais refusé de toucher, portait
encore l'ancienne échelle — deux tables dans le même fichier se contredisant sur
la même question. Elle est redressée, et le 1N2 n'a plus de copie : il y délègue.
Une définition, un endroit.

**Un seuil a dû suivre.** `bttsAxesResidenceV7` testait `maxConc > 0`, calibré
sur l'ancienne échelle où 0 voulait dire « opposition totale ». Dans la nouvelle,
rien ne vaut 0 entre deux éléments réels : la condition devenait toujours vraie
et **le BTTS répondait OUI sur les 65 536 thèmes**. Un moteur qui ne dit qu'une
chose ne prédit rien. Le seuil suit l'intention et non le chiffre —
`maxConc > 0,25`, strictement mieux qu'une opposition. BTTS intégralement
restauré : **0 thème de différence**.

**Une règle s'est alignée toute seule sur votre doctrine.** La règle d'incident
M12/M6 exige « concordance < 0,5 ». Le seuil n'a pas bougé, mais ce qu'il
désigne a changé :

| | couples retenus | déclenchement |
|---|---|---|
| avant | air×terre **et air×eau** | 25,0 % |
| après | air×terre seul | 12,5 % |

Votre phrase du 27/08 ne cite que deux couples : « air et terre s'étouffent ; de
même feu/eau crée le chaos ». **Air×eau n'y figure pas**, et la règle le retenait
quand même. Le redressement l'a supprimé sans qu'on touche à la règle.

C'est une vérification indépendante de l'échelle : elle ne doit rien au résultat
d'un match, seulement à ce que vous aviez écrit trois semaines plus tôt.

**Bilan sur les 65 536 thèmes** : BTTS 0 changement, Nul 0, Camp 0,
Incidents 186 thèmes (64 413 → 64 227).

---

## Le camp qui ne marque pas — 11/09/2026

Ellemine_D : « Ce qui reste à calibrer, le cas où le camp A ou B ne marque pas. »

Le BTTS disait **si** un camp reste à zéro. Il ne disait jamais **lequel**.

Or `bttsAxesResidenceV7` calcule déjà `bloqueR1` et `bloqueR7` **séparément** — voie
offensive sans résidence concordante face à une défense adverse fermée et passive —
puis les écrase immédiatement en `non = bloqueR1 || bloqueR7`. L'information
existait à chaque thème et était jetée.

**Mesuré sur les 65 536 thèmes :**

| | thèmes | |
|---|---|---|
| R1 muet seul | 1 352 | 2,06 % |
| R7 muet seul | 1 481 | 2,26 % |
| les deux muets | 81 | 0,12 % |
| aucun | 62 622 | 95,55 % |

Le camp muet est désormais **nommé sur la carte**.

### La contradiction à calibrer

Le score pose le zéro **sur le perdant, par défaut** :
`if (winner==='A' && goalB>0) goalB=0;` — il ne demande jamais quel camp la lecture
désigne.

Sur les 2 914 thèmes où un blocage est lu, le camp muet est celui que le moteur de
camp donne **vainqueur** dans **1 500 cas — 51 %**. Un vainqueur qui ne marque pas
ne peut pas gagner : les deux lectures sont incompatibles une fois sur deux.

Exemple : `populus/populus/albus/cauda_draconis` → « VAINQUEUR Équipe 1, score 1-0 »
alors que la lecture dit R1 muet.

**Je n'ai pas tranché.** Le score n'est pas retouché : choisir aujourd'hui laquelle
des deux lectures prime reviendrait à inventer une règle sur un partage 51/49 sans
la moindre donnée. La contradiction est affichée en clair sur la carte, avec la
mention qu'elle reste à calibrer.

Les deux options, pour mémoire :
- **le blocage prime** — le zéro va au camp lu muet, et le camp verdict devient
  douteux quand c'est le vainqueur (traitement analogue à l'indice de nul du 1N2) ;
- **le camp prime** — le blocage ne sert qu'à dire qu'un zéro existe, jamais où.

Seul le test prospectif peut départager : c'est exactement une question à
pré-enregistrer avant les 150 matchs, pas après.

### La correction est intégrée (11/09/2026)

« Intègre la correction. » Le zéro va désormais au camp que la lecture désigne,
et non plus au perdant par défaut.

La correction n'invente aucune règle. Elle applique une impossibilité :
**un camp qui ne marque pas ne peut pas gagner.**

- **Le camp lu muet est le perdant** → rien ne change, le zéro était déjà au bon
  endroit (64 392 thèmes).
- **Le camp lu muet est le vainqueur** → le vainqueur bascule (**1 063 thèmes,
  1,6 %**). L'en-tête nomme la correction au lieu d'annoncer le 1N2.
- **Les deux camps sont lus muets** → le score est 0-0, donc un **nul**, et il
  migre vers le moteur Nul pour confirmation, comme l'indice de nul du 1N2
  (**81 thèmes**, dont **22 confirmés**).

Une seule ligne de logique a été ajoutée en amont du générateur de score : le
générateur calibré donnait déjà zéro au perdant quand le BTTS est non, et zéro
partout quand le camp est « Nul ». Il suffit que le camp soit juste avant lui —
le zéro tombe alors tout seul au bon endroit. Aucune arithmétique nouvelle.

**Effet sur les 65 536 thèmes :**

| | avant | après |
|---|---|---|
| R1 | 27 939 | 27 871 |
| R7 | 23 261 | 23 270 |
| Nul | 14 336 | 14 395 |
| score 1-0 | 1 532 | 1 464 |
| score 0-1 | 1 171 | 1 180 |
| score 0-0 | 757 | 816 |

Les bascules sont quasi symétriques : le total bouge de 68 thèmes pour
1 063 corrections. Ce n'est pas un biais, c'est une réassignation.

Le moteur 1N2 lui-même est inchangé (R1 36 057 / R7 29 479) : la correction est
en aval, dans la carte, et elle est nommée là où elle s'applique.

### Le camp muet lisait la mauvaise figure (11/09/2026)

Ellemine_D : « on avait bien déterminé que le camp 2 ne marque pas, pourquoi les
deux marquent ». Il avait raison, et la lecture que je venais de brancher ne
pouvait pas le voir.

`bttsAxesResidenceV7` **ne lit pas la figure du camp**. Il lit le *trigone
offensif* — la somme de trois maisons du thème tourné. Sur Tristitia / Via /
Conjunctio / Rubeus :

| | figure lue | état |
|---|---|---|
| trigone offensif de R7 | **Rubeus** | présent M9, M13, M14 · portes **ouvertes** · charges **actives** · concordance **1** |
| **camp R7 lui-même** | **Carcer en M14** | porte **fermée** · charge **passive** · mobilité **fixe** · concordance **0,25** |

Les quatre marqueurs du camp disent qu'il ne marque pas. La lecture regardait
une autre figure, grande ouverte, et concluait que les deux marquent.

**Deuxième route ajoutée** : la résidence du camp lui-même est muette quand elle
est *fermée + passive + fixe + mal logée* (concordance contraire).

La paire « fermée + passive » n'est pas inventée : c'est exactement la signature
que le fichier emploie déjà pour un verrou défensif. S'y ajoutent *fixe* (elle ne
bouge pas) et *mal logée* — la même exigence que la règle d'incident M12/M6.

Mesuré sur les 65 536 thèmes : parle sur **10,40 %** (R1 seul 5,32 %, R7 seul
4,54 %, les deux 0,54 %). Elle apporte **6 409 thèmes** que la lecture des axes
ne voyait pas — seuls 407 de ses 6 816 déclenchements étaient déjà couverts.

**Effet :**

| | avant | après |
|---|---|---|
| BTTS OUI | 62 076 | **58 257** |
| camp corrigé | 1 063 | **1 527** |
| vers nul (deux muets) | 81 | **617** (150 confirmés) |
| score 1-0 | 1 464 | **3 589** |
| score 0-1 | 1 180 | **3 624** |
| score 0-0 | 816 | **2 602** |

Sur le thème : **Équipe 1, 1-0, BTTS NON, camp muet R7 par résidence fermée.**
Le match a fini 7-0 : camp juste, BTTS juste, volume faux.

⚠️ **Règle neuve, aucune justesse mesurée.** Ses ingrédients viennent tous des
tables du fichier, mais l'assemblage date d'aujourd'hui et a été trouvé sur un
thème dont je connaissais le résultat. Elle part au test prospectif comme les
autres. Elle n'est pas démontrée.

---

## Nettoyage de l'encombrement — 12/09/2026

`bancMoteursV7` avait été supprimé le 11/09 comme code mort. Avec lui a disparu
le seul consommateur des catalogues de moteurs : **70 moteurs restaient déclarés
et n'étaient plus jamais exécutés**.

Supprimé — 937 lignes :

| | entrées |
|---|---|
| 12 catalogues `MOTEURS_*` | 70 moteurs |
| `MOTEURS_DESACTIVES_V7` / `SOUS_SURVEILLANCE` / `GARDES` | métadonnées |
| l'IIFE qui désactivait 60 moteurs par famille | — |
| `moteurDesactiveV7`, `moteursActifsV7` | le filtre |
| 4 drapeaux déclarés jamais lus | `M4M10_PILOTE_VERDICT_V7`, `MOTEUR_V8_ACTIF`, `PILOTE_CRITERES_V7`, `NUL_CROISEMENT_V7` |

Le dernier consommateur restant, dans `densiteIncidentV7`, lisait
`MOTEURS_INCIDENT_CAMP_V7` — dont les sept entrées étaient toutes désactivées :
la boucle n'ajoutait jamais rien.

**Huit branches de `BRANCHES_V7` marquées `inerte: true`** au lieu d'être
supprimées : elles sont déclarées, documentées, certaines marquées
`actif: true` avec un « mettre à false rend la cascade d'origine » — et aucun
code ne les lit. Elles ne commandent rien. Conservées pour la trace de ce qui a
été essayé ; leur drapeau ne veut simplement rien dire. Les cinq réellement
lues : `populus_volume`, `axe_volume`, `miroir_volume`, `carcer_miroir`,
`nul_seconde_porte`.

**Preuve que rien n'a bougé** : empreinte complète des sorties sur les 65 536
thèmes — camp, score, BTTS, incidents, nul, volume, camp muet, source BTTS —
prise avant et après. **Fichiers strictement identiques.**

34 496 → 33 559 lignes. 2 141 540 → 2 081 835 octets.

L'analyse de code mort propose 36 fonctions de plus (1 155 lignes). **Non
touchées** : vérification faite, elle donne des faux positifs — les `toggle*Panel`
qu'elle liste ont bien un `onclick` dans le HTML. À reprendre à la main, pas
automatiquement.
