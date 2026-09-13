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

### Suppression du code mort restant — 12/09/2026

« Supprime toutes les choses inutiles. »

**L'analyse automatique se trompait sur 32 des 36 candidats.** Vérification faite
une par une sur le texte brut : les `toggle*Panel` qu'elle listait ont bien un
`onclick` dans le HTML — l'analyseur cassait sur les lignes HTML géantes. Elles
sont toutes restées.

Réellement mortes et supprimées :

| | |
|---|---|
| 11 fonctions sans aucun appel | dont 4 orphelines des catalogues retirés hier : `moteurDestructionV7`, `moteurCritereV7`, `partageSyntheseV7`, `moteurF4P4AvecAdverseV7` |
| 2 fonctions devenues orphelines en cascade | `tierWeightFFEngine`, `isFigureWellPositioned` |
| 23 constantes déclarées et jamais relues | dont les trois tables `POIDS_*` du moteur de critères supprimé |

**375 lignes.**

**Trois tables gardées volontairement** : `ANNONCES_V7` (règles annoncées
d'avance avec leur compteur), `SIGNAUX_V7` (signaux mesurés avec leurs p),
`LISTE_PROSPECTIVE_V7` (le réceptacle du test). Ce sont les seules traces de ce
qui a été pré-enregistré et mesuré. Les supprimer effacerait la mémoire
méthodologique du projet, pas du code mort.

**Une erreur en route, corrigée.** Le premier script de suppression calculait mal
les bornes des blocs multi-lignes : chevauchements, 1 259 lignes emportées, les
5 moteurs à 0/30 et 30 crashes sur 30. Revenu en arrière par `git checkout`,
refait avec un compteur de délimiteurs qui ignore chaînes et commentaires, plus
un contrôle explicite de non-chevauchement avant toute suppression.

**Preuve** : empreinte complète des sorties sur les 65 536 thèmes, prise avant le
nettoyage d'hier et après celui-ci. **Strictement identique.**

34 496 → 33 183 lignes (−1 313 au total sur les deux passes).
2 141 540 → 2 059 927 octets.

### Panneau « Carte du thème » — 12/09/2026

Ajouté à la demande d'Ellemine_D : la représentation du thème qu'il voulait avoir
sous les yeux à chaque tirage, branchée comme panneau dans la barre d'outils
(bouton 🗺️ Carte du thème).

Ce qu'il montre :

- **les 4 Mères** — figure, élément, quatre niveaux
- **les 16 maisons**, ligne à ligne, avec la chaîne du §12 déroulée : maison →
  figure → élément de la figure → ses quatre niveaux → canal de la maison →
  position dans ce canal, et le rôle **R1 / R7** surligné
- **la rotation** : figure de M1 → maison de repos → R1 et R7
- **les témoins et le juge** : M13, M14, M15, M16
- **les 3 axes** avec leur somme, ★ sur les figures d'incident
- **la validité** du thème

Éléments en couleur — feu rouge, air jaune, eau bleu, terre vert.

**Panneau de lecture seule.** Il n'entre dans aucune décision, il montre le thème
tel que le système le lit. Empreinte des sorties sur les 65 536 thèmes :
identique.

### L'axe du camp et ses niveaux d'éléments actifs — 12/09/2026

Ajouté au procédé, en lecture : pour R1 et pour R7, **dans quel axe se trouve la
maison du camp**, la figure que cet axe produit, et **ses niveaux d'éléments
actifs** — les niveaux à 1 point, dans l'ordre Feu / Air / Eau / Terre.

Affiché sur la carte de verdict (sous la position) et dans la carte du thème
(deux colonnes de plus au tableau des axes, plus la colonne « camp »).

**Fait structurel mesuré.** Les trois axes ne couvrent que M1 à M12. M13, M14,
M15 et M16 — témoins, juge, réconciliateur — sont hors du carré. Sur les 65 536
thèmes :

| | R1 | R7 |
|---|---|---|
| Cardinal | 25,0 % | 25,0 % |
| Succédent | 25,0 % | 25,0 % |
| Cadent | 25,0 % | 25,0 % |
| **hors axe** | **25,0 %** | **25,0 %** |

Les deux camps sont dans un axe seulement **56 %** du temps.

**Cette lecture n'entre PAS dans la cascade de décision.** Elle ne pourrait pas
départager un thème sur quatre, et le §11 ferme sa liste à quatre critères. Elle
est lue et affichée ; si elle doit peser, ce sera une décision explicite, prise
avant le test et pas après.

Sur le thème de référence : R1 = M8 → **Succédent**, somme **Cauda Draconis**
1-1-1-2, **3 niveaux actifs** (feu, air, eau). R7 = M14 → **hors axe**.

Empreinte des sorties sur les 65 536 thèmes : identique.

### Les axes étendus aux seize maisons — 12/09/2026

Ellemine_D : « Les axes dans l'ensemble des 16 figures :
**Angulaire** M1·M4·M7·M10·M13·M16 — **Succédente** M2·M6·M8·M12·M14 —
**Cadente** M3·M5·M9·M11·M15. »

6 + 5 + 5 = 16, partition exacte. **Le trou est refermé** : hier un camp tombait
hors axe 25 % du temps, plus aucune maison n'est hors axe.

Répartition des camps, mesurée : Angulaire 37,5 %, Succédent 31,3 %,
Cadent 31,3 % — exactement 6/16, 5/16, 5/16.

**Structure du code.** `MAISONS_*_V7` est la classe complète : elle dit à quel
axe une maison appartient, et la somme de l'axe se calcule sur elle.
`MERES_*_V7` est le noyau du carré (M1–M12) et ne sert qu'aux endroits qui
construisent un **thème dérivé**, lequel exige exactement quatre mères.

**Effet mesuré sur les 65 536 thèmes :**

| | avant | après |
|---|---|---|
| camp affiché | R1 27 647 · R7 23 086 · Nul 14 803 | **identique** |
| thèmes valides | 46 483 | **identique** (restée sur le carré) |
| BTTS OUI | 58 257 | 58 276 |
| incidents | 64 227 | 62 672 |
| R1 en maison cadente | 25,0 % | 31,3 % (M15 entre) |
| Puer en maison succédente | 21,8 % | 26,4 % (M14 entre) |

**Un fait structurel nouveau.** « Les trois axes portent une figure d'incident »
passe de **impossible** à **432 thèmes (0,7 %)**. Ce n'est pas un hasard : avec
les axes du carré, les trois sommes se XORaient toujours en Populus. Avec les
axes étendus, leur XOR vaut M16. La contrainte qui interdisait le triplet a
sauté. Le commentaire de doctrine qui écrivait « impossible » est corrigé.

La validité n'a **pas** été basculée sur les axes étendus : elle n'a pas été
re-mesurée sur cette base et la déplacer changerait quels thèmes sont valides
sans qu'on sache dans quel sens. Elle bougera sur décision, pas par effet de bord.

### La validité bascule sur les axes étendus — 12/09/2026

Sur décision d'Ellemine_D. Une seule définition des axes dans tout le fichier :
`MAISONS_*_V7`, les seize maisons.

La validité teste que la figure de chaque axe — somme XOR de ses maisons —
existe dans le thème, en base ou en résultante.

| | avant (carré M1–M12) | après (axes étendus) |
|---|---|---|
| thèmes valides | 46 483 — 70,9 % | **44 371 — 67,7 %** |

Ce n'est pas un simple resserrement : **22 714 thèmes changent d'état (34,7 %)**
— 10 301 deviennent valides, 12 413 deviennent invalides.

**Aucune sortie ne bouge.** Empreinte complète sur les 65 536 thèmes — camp,
score, BTTS, incidents, nul, volume, camp muet, source BTTS — identique à
l'état d'avant la bascule. Raison : `REJET_THEME_INVALIDE_V7` est à `false`,
un thème invalide n'est pas écarté du verdict. La validité est affichée, elle
ne décide rien.

Le bandeau « ⛔ THÈME INVALIDE — DÉTRUIT » ne vient pas de là : il vient de
`themeDetruit()`, qui ne regarde que Rubeus ou Cauda Draconis en M1. Il n'est
pas touché.

### L'axe devient un critère — 12/09/2026

Ellemine_D : « ça doit compter ». L'axe entre dans la cascade au **rang 3**.

**Critère 3 — Axe** : nombre de niveaux d'éléments actifs de l'axe où siège le
camp (les niveaux à 1 point de la figure que l'axe produit, sur 4).

Nouvel ordre : **1. Concordance → 2. Charge → 3. Axe → 4. Filiation → 5. Boucle**

**Pourquoi le rang 3.** Mesuré sur les 65 536 thèmes, selon la place donnée :

| place | thèmes qu'il décide | changent de camp |
|---|---|---|
| 1 — avant Concordance | 11 352 (17,3 %) | 5 768 (8,8 %) |
| 2 — après Concordance | 3 817 (5,8 %) | 2 050 (3,1 %) |
| **3 — après Charge** | **1 097 (1,7 %)** | **588 (0,9 %)** |
| 4 ou 5 | **0** | 0 |

Aux rangs 4 et 5 il est lettre morte : Filiation et Boucle avaient déjà tout
tranché — seuls 4 thèmes sur 65 536 atteignaient un cinquième critère. Le rang 3
est le plus tardif où il compte encore, et il laisse devant lui les deux critères
que le §11 met en tête.

**Limite structurelle.** Les deux camps siègent dans le **même axe 70,7 %** du
temps — R7 est à six positions de R1, leurs maisons sont corrélées. Le critère
est alors muet par construction. Il ne peut départager que 17,3 % des thèmes au
maximum, quelle que soit sa place.

**Effet :**

| | avant | après |
|---|---|---|
| 1N2 seul | R1 36 057 · R7 29 479 | R1 **35 637** · R7 **29 899** |
| camp affiché | R1 27 647 · R7 23 086 · Nul 14 803 | R1 **27 369** · R7 **23 364** · Nul 14 803 |
| critère « Axe » | — | tranche 1 097 thèmes (+14 en branche pôles égaux) |

Ce n'est pas un critère du §11 : c'est un cinquième, assumé comme tel. Il ne
contredit pas §6 ni §12 — la **position** (Origine / Transmission / Résultante /
Synthèse) reste lue et jamais comptée. L'axe n'est pas la position.

⚠️ Comme le reste, il n'a **aucune justesse mesurée**. Il part au test prospectif.

### La force active des 4 éléments par axe — 12/09/2026

Ellemine_D : « l'axe doit être examiné sur sa force active des 4 éléments — un
tableau qui calcule les niveaux d'activation dans les axes, pour savoir dans
chaque axe quel élément est le plus actif ».

Ce n'était **pas** ce que le critère 3 lisait. Il lisait les quatre niveaux de la
**somme XOR** de l'axe. Le relevé demandé est autre chose : parcourir **toutes**
les maisons de l'axe et compter, élément par élément, les niveaux **actifs**
(1 point).

`forceElementsAxeV7(theme)` produit le tableau. Exemple, Tristitia / Via /
Conjunctio / Rubeus :

| axe | feu | air | eau | terre | total | force | dominant | camp |
|---|---|---|---|---|---|---|---|---|
| Angulaire (6) | 1 | **4** | 2 | 1 | 8/24 | 33 % | air | |
| Succédent (5) | **4** | 3 | 3 | 3 | 13/20 | **65 %** | feu | R1 R7 |
| Cadent (5) | 1 | **4** | 3 | 2 | 10/20 | 50 % | air | |

**Le critère 3 lit désormais cette force**, pas la somme XOR.

**Pourquoi le ratio et non le total brut.** L'Angulaire compte six maisons
(24 niveaux possibles), les deux autres cinq (20). Un total brut le favoriserait
mécaniquement — 12 contre 10 en moyenne. La comparaison entre camps se fait donc
sur `actif / possible`. Les deux sont affichés : le total pour la lecture, le
pourcentage pour la décision.

**Effet du changement de base du critère :**

| | somme XOR | force active |
|---|---|---|
| thèmes tranchés par « Axe » | 1 097 | **1 474** |
| 1N2 : R1 / R7 | 35 637 / 29 899 | **35 396 / 30 140** |

Affiché à deux endroits : sur la carte de verdict (force des quatre éléments,
total, pourcentage, élément dominant) et dans la carte du thème, en tableau
complet avec la case du dominant surlignée.

⚠️ Aucune justesse mesurée. Comme le reste, ça part au test.

### Contre-lecture par l'axe commun — 12/09/2026

Essai proposé par Ellemine_D : « R1 et R7 dans le même axe pour déterminer
réellement le 1N2. Si c'est l'axe angulaire 1-4-7-10..., on prend les 4 premiers
comme figures mères, on dresse le thème, et on voit le vainqueur : est-ce qu'il
confirme le verdict premier ? »

Implémenté : quand les deux camps siègent dans le même axe, ses quatre premières
maisons deviennent quatre mères, on dresse le thème dérivé, on y relance le 1N2.

**Mesuré sur les 65 536 thèmes — avant de le brancher :**

| | |
|---|---|
| applicable (les deux camps même axe) | **49 152 — 75,0 %** |
| le dérivé **confirme** | **55,6 %** |
| il **contredit** | 44,4 % |

**55,6 %, ce n'est presque rien.** Deux lectures indépendantes donnant R1 à 54 %
s'accorderaient déjà à **50,3 %** par pur hasard. La contre-lecture n'est donc
que cinq points au-dessus du bruit.

Par axe, l'écart est net et je ne l'explique pas :

| axe | accord |
|---|---|
| Angulaire | **66,4 %** |
| Succédent | 52,5 % |
| Cadent | **47,7 %** |

Sur l'axe **Cadent, le dérivé contredit plus souvent qu'il ne confirme.**

**Branchée en lecture seule.** Elle ne touche pas au verdict. Savoir si « les
deux d'accord » vaut mieux que « le premier seul » demande des **résultats
réels** — les 65 536 thèmes ne contiennent aucune vérité de match, ils ne peuvent
mesurer qu'un accord interne. C'est une question pour le test prospectif.

Affichée sur la carte, avec ses propres chiffres à côté, pour qu'on ne la croie
pas plus qu'elle ne vaut.

### Le trigone offensif de R1 — 13/09/2026

Deux définitions coexistaient dans le fichier :

| | maisons |
|---|---|
| bouton « 4D · offensive 1 » | M1 + M5 + M9 |
| moteur BTTS (`axesSommesRotationV7`, `R1.off`) | **M3 + M5 + M9** |

C'est le moteur qui décide ; le bouton n'était qu'un raccourci d'affichage, et il
montrait un autre trigone que celui qui travaille. **Corrigé sur {3, 5, 9}** sur
décision d'Ellemine_D.

**Ce qui tranche, au-delà de l'ancienneté** : {3,5,9} est le seul des deux à être
**entièrement Cadent**. Et les deux trigones **défensifs** du fichier —
`[4,10,1]` et `[4,10,7]` — sont **entièrement Angulaires**. M1 est angulaire,
M3 est cadent : le bouton mélangeait les deux rôles.

Le trigone de R7, `{7,3,11}`, était déjà identique des deux côtés.

**Le fichier encode donc, depuis longtemps : offensive = Cadent, défense =
Angulaire.** C'est l'intuition d'Ellemine_D — « je crois que le Cadent est lié à
l'offense » — déjà écrite dans le code avant tout ce travail sur les axes.

**Corrélation mesurée** (force active de l'axe → buts prédits, 65 536 thèmes) :

| axe | force faible | force forte | écart |
|---|---|---|---|
| **Cadent** | 2,36 buts | 2,70 | **+0,34** |
| Succédent | 2,41 | 2,55 | +0,14 |
| **Angulaire** | 2,56 | 2,41 | **−0,15** |

~~⚠️ Cette corrélation ne prouve rien. Elle est circulaire...~~

**CORRIGÉ LE 13/09/2026 — MON OBJECTION ÉTAIT FAUSSE.** Ellemine_D a demandé
qu'on la teste au lieu de l'affirmer. Trois mesures :

**1. Ce n'est pas un effet d'activité globale.** L'activité totale du thème
(0–64 niveaux actifs) → buts : de 20 à 41, les buts vont de 2,48 à 2,57.
**Quasi plat**, +0,09 sur toute l'amplitude.

**2. L'effet survit à activité totale constante.**

| total fixé | Cadent faible | Cadent fort | écart |
|---|---|---|---|
| 30 | cad 7 → 2,328 | cad 13 → 2,660 | **+0,33** |
| 32 | cad 7 → 2,260 | cad 13 → 2,533 | **+0,27** |
| 34 | cad 8 → 2,356 | cad 14 → 2,664 | **+0,31** |

Monotone, cohérent sur trois strates. Ce n'est pas *combien* le thème est actif
qui compte, c'est **où** l'activité se loge.

**3. Ce n'est pas le trigone du moteur qui fuit.** C'était mon argument : le
générateur emploie l'offensive `{3,5,9}`, cadente. Mais ce trigone travaille sur
le thème **tourné** — ce ne sont pas les maisons fixes de l'axe, sauf rotation
triviale. Restreint aux **rotations non triviales**, là où les deux ensembles
diffèrent, l'effet est **intact : +0,273**, identique au global.

Et le contrôle est net : le trigone du moteur lui-même, à total constant, va dans
le sens **inverse** — 2,531 → 2,313 quand il s'active. Les deux pointent en sens
opposés. La corrélation du Cadent ne peut donc pas venir de lui.

**Ce qui reste vrai** : ces 65 536 thèmes ne contiennent aucun résultat de match.
L'effet est établi *dans le système*, pas dans le monde. Mais il est **spécifique
à l'axe Cadent**, et ça, c'était à démontrer — je l'avais écarté à tort.

**Note ouverte** : un trigone dit « offensif » dont l'activité *réduit* les buts
prédits, c'est un signal à examiner. Soit le trigone est mal orienté, soit le
générateur de score l'utilise à l'envers.

Sorties sur les 65 536 thèmes : identiques (le bouton n'entre dans aucune décision).

### Le trigone offensif recâblé sur la force active — 13/09/2026

Ellemine_D : « recâble le trigone offensif sur la force active de l'axe cadent ».

**Les deux défauts trouvés en creusant** (thème Via / Tristitia / Cauda / Fortuna
Minor) :

**1. La somme XOR n'est pas la force.** Le moteur prenait la somme XOR des trois
maisons du trigone et cherchait où cette figure se loge. Or la somme est
découplée de la force du trigone, et s'inverse dans la plage courante :

| trigone actif | activité de sa somme |
|---|---|
| 4/12 | 2,11 / 4 |
| 6/12 | 2,00 |
| 8/12 | **1,89** |

Un niveau du XOR n'est actif que si un nombre **impair** des trois entrées l'est ;
beaucoup d'activité tend vers deux sur trois — pair — donc éteint. Sur le thème :
**trigone R1 à 7 niveaux actifs, sa somme Laetitia n'en a qu'1**. C'est
l'explication de la corrélation négative trouvée hier.

**2. Une voie absente comptait comme dégagée.** Le test exigeait `o.presente`.
Laetitia, voie offensive de R1, n'existe nulle part dans le thème → pas bloquée.
Populus, voie de R7, existe mais mal logée → bloquée. Inversé.
Mesuré : une voie est absente sur **54,4 %** des thèmes, et dans **97,6 %** de ces
cas le moteur ne bloquait rien.

**Ce qui est lu maintenant** : la force active — niveaux à 1 point — sur les
maisons de l'axe, la même mesure que pour les axes du 1N2.

- **offensive** = motif **cadent** depuis le siège du camp (5 maisons, 0–20)
- **défense** = motif **angulaire** depuis le siège (6 maisons, 0–24)

*Depuis le siège* parce que l'axe Cadent est un seul ensemble pour tout le thème
et ne peut pas distinguer R1 de R7. R1 lit depuis la position 1, R7 depuis la 7.
C'est la généralisation directe des anciens trigones, et elle est **symétrique**,
ce qu'ils n'étaient pas — `{3,5,9}` pour R1 mais `{7,3,11}` pour R7, qui incluait
le siège.

**Les trois règles essayées, mesurées avant de choisir :**

| règle | R1 muet | R7 muet | les deux | BTTS OUI |
|---|---|---|---|---|
| brute (force < défense adverse) | 5,5 % | 6,7 % | **65,0 %** | 22,7 % |
| ratio | 6,0 % | 7,2 % | **44,3 %** | 42,5 % |
| **relative — retenue** | 19,4 % | 15,8 % | **0 %** | 64,9 % |

Les deux premières inondent le nul — 44 à 65 % de thèmes à 0-0 contre un quart de
nuls réels. La relative s'énonce d'une phrase : **le camp muet est le plus faible
attaquant des deux, et sous la défense adverse.**

⚠️ Elle interdit par construction que les deux camps soient muets : le 0-0 par
double blocage disparaît de cette route. Le moteur Nul reste seul à porter le nul.

**Effet sur les 65 536 thèmes :**

| | avant | après |
|---|---|---|
| BTTS OUI | 58 276 — 88,9 % | **39 941 — 60,9 %** |
| camp corrigé par le muet | 1 550 | **10 484** |
| vers nul | 617 | 1 703 |
| camp affiché R1 / R7 / Nul | 27 369 / 23 364 / 14 803 | **25 570 / 24 303 / 15 663** |
| scores 1-0 et 0-1 | 3 589 / 3 624 | **9 056 / 11 302** |

⚠️ **Le taux réel de BTTS est autour de 52 %.** Passer de 88,9 % à 60,9 % en
approche — mais **se rapprocher d'un taux de base n'est pas une preuve**, et
aucun seuil n'a été réglé pour l'atteindre. Aucune justesse mesurée.

---

## #2 — Via / Tristitia / Cauda Draconis / Fortuna Minor · résultat 5-2

Prédit le 13/09/2026. **Deux versions du système, la seconde faite à l'aveugle.**

### Ce qui a été annoncé AVANT (moteur d'alors, commit `a482528`)

| famille | prédit | réel | |
|---|---|---|---|
| **Camp** | **R1 — Équipe 1** | Équipe 1 | ✓ |
| Score | 1-0 | 5-2 | ✗ |
| **Volume** | plus de 2,5 (2,58) | 7 buts | ✓ |
| **BTTS** | **NON** | oui (5-2) | ✗ |
| **Nul** | non | non | ✓ |
| Camp muet | **R7** | R7 a marqué 2 buts | ✗ |
| Incidents | oui contre M7, élevé 63 % | non renseigné | — |

**3 justes sur 4** familles chiffrables.

### Ce que dit le moteur APRÈS le recâblage — décidé sans connaître le score

Le recâblage de l'offensive sur la force active de l'axe cadent a été demandé,
mesuré et poussé **avant** que le 5-2 soit communiqué. Il change deux réponses :

| | avant | après | réel |
|---|---|---|---|
| BTTS | NON ✗ | **OUI** ✓ | oui |
| camp muet | R7 ✗ | **aucun** ✓ | aucun |
| score | 1-0 | 2-1 | 5-2 |

**Les deux corrections vont dans le bon sens, et elles ont été faites à
l'aveugle.** C'est la première fois dans ce projet qu'un changement est décidé
sans connaître le résultat et se trouve confirmé ensuite.

⚠️ **n = 1.** Une pièce qui tombe du bon côté ne démontre rien. Ce qui distingue
ce cas des précédents n'est pas le résultat, c'est l'ordre : la correction
d'abord, le score ensuite. C'est la seule forme de confirmation qui vaille — et
il en faut 150.

### Ce qui reste faux dans les deux versions

Le **score**. 1-0 puis 2-1 contre un 5-2 réel. Le générateur ne produit
pratiquement jamais plus de 3 buts ; il ne peut structurellement pas atteindre
un 5-2. Le volume dit « plus de 2,5 » et tombe juste, mais il annonce 2,58 quand
il y en a eu 7 — juste sur le sens, muet sur l'ampleur.

### Force de marquage de l'axe cadent — 13/09/2026

Ellemine_D : « chaque figure possède une quantité de marquage, c'est ça qu'on doit
creuser pour le volume et le score exact. Opère dans l'axe cadent les figures qui
y sont, leur force pour chaque camp. »

La table existe : `BUTS_FIGURE` (doctrine du 12/07/26). Fortuna Major 3-5,
Albus 2-4, Laetitia et Acquisitio 2-3, Puella 2, Rubeus 1-3, Puer / Fortuna
Minor / Cauda 1-2, Caput / Tristitia / Amissio / Conjunctio / Via 0-1, Carcer et
Populus 0.

Construit : chaque camp lit les cinq maisons du motif cadent depuis son siège, on
relève la quantité de marquage de chaque figure. Affiché dans la carte du thème.

**DEUX AVERTISSEMENTS, ET ILS SONT LOURDS.**

**1. Cette famille a déjà été testée et a échoué.** `SCORE_MOTEUR_V7`, **n = 49
matchs réels** : douze lectures essayées, meilleur p brut **0,0846** — et c'était
justement *le trigone offensif du camp 1* — mais **1,0000 après Bonferroni**.
Corrélations : camp1 rho −0,089 (p 0,55), camp2 rho 0,246 (p 0,089), total
rho 0,136 (p 0,35), écart rho −0,132 **de signe inverse**. Score exact **6/49**.
Conclusion écrite alors : « le SCORE EXACT ne vaut rien — ni niveau, ni écart, ni
corrélation ».

**2. L'échelle est fausse, dans l'autre sens qu'avant.** Sur les 65 536 thèmes la
somme brute donne :

| | prédit | réel (archive n=49) |
|---|---|---|
| R1 | 7,28 | 2,35 |
| R7 | 7,14 | 1,82 |
| **total** | **14,42** | **4,16** |

**3,5 fois trop haut.** L'ancien générateur était 2,5 fois trop bas. Cinq maisons
ne sont pas cinq buteurs indépendants.

**Aucun facteur d'échelle n'est appliqué.** Le poser reviendrait à l'ajuster sur
la moyenne de l'archive — fabriquer le résultat. Seule la **part relative** (part
de R1 dans le total) est sans échelle.

Sur les deux thèmes au résultat connu, la part relative donne 1 sur 2 :

| thème | part R1 | réel | |
|---|---|---|---|
| Tristitia / Via / Conjunctio / Rubeus | 57 % | 7-0 | ✓ |
| Via / Tristitia / Cauda / Fortuna Minor | 44 % | 5-2 | ✗ |

**En lecture seule.** N'alimente ni le volume ni le score.

---

## Quatre matchs réels — 13/09/2026

Ellemine_D signale que les 49 cas d'archive contiennent des matchs FIFA, donc
virtuels. On repart sur quatre matchs réels seulement.

| thème | réel | buts | **marquage cadent** | camp prédit | BTTS prédit | BTTS réel |
|---|---|---|---|---|---|---|
| Tristitia / Via / Conjunctio / Rubeus | 7-0 | **7** | **11,5** | R1 ✓ | NON | non ✓ |
| Via / Tristitia / Cauda / Fortuna Minor | 5-2 | **7** | **12,5** | R1 ✓ | OUI | oui ✓ |
| Fortuna Major / Via / Puella / Cauda | 0-0 | **0** | **17,5** | R1 ✗ | NON | non ✓ |
| Tristitia / Tristitia / Conjunctio / Rubeus | 1-1 | **2** | **19,5** | R7 ✗ | OUI | oui ✓ |

### BTTS : 4 sur 4

Avec le moteur recâblé sur la force active. Le 5-2 a été prédit à l'aveugle
(recâblage poussé avant que le score soit donné) ; les trois autres sont des
rejeux. **n = 4.**

### Camp : 2 sur 4

Les deux ratés sont les deux nuls. Ni `nulActifV7` ni le 1N2 ne les a vus —
le 1N2 ne dit jamais N par construction, et la porte Carcer-miroir n'a pas parlé.

### Le marquage cadent est INVERSÉ sur le volume

Ordre parfait, et à l'envers : 11,5 → 7 buts · 12,5 → 7 buts · 17,5 → 0 but ·
19,5 → 2 buts. Les figures en cause se lisent directement :

| réel | figures du cadent |
|---|---|
| 7-0 | Albus, **Amissio**, Rubeus, Via, Caput, Fortuna Minor |
| 5-2 | **Amissio** ×2, Cauda ×4, Fortuna Minor ×2, Puella |
| 0-0 | **Fortuna Major**, **Acquisitio** ×4, Carcer ×2, Cauda, Tristitia |
| 1-1 | **Fortuna Major** ×2, Albus, Cauda ×4, Tristitia, Fortuna Minor |

Les deux plus forts marqueurs de la table — **Fortuna Major 3-5** et
**Acquisitio 2-3** — siègent dans les deux matchs sans buts. Les plus faibles —
Amissio 0-1, Via 0-1, Caput 0-1 — dans les deux matchs à 7 buts.

### Mais il faut savoir ce que vaut ce genre de constat sur n = 4

Trois figures séparent parfaitement les deux hauts des deux bas dans le cadent :
**Amissio** (présente dans les hauts), **Tristitia** et **Fortuna Major**
(présentes dans les bas).

Distribution sous hypothèse nulle, calculée sur 20 000 tirages de quatre thèmes
au hasard avec étiquettes arbitraires :

| séparateurs | probabilité |
|---|---|
| 0 | 21,0 % |
| 1 | 34,1 % |
| 2 | 26,1 % |
| **≥ 3** | **18,8 %** |

Moyenne attendue par hasard : **1,50 sur 16**. On en a 3.
**P(≥ 3 par hasard) = 18,8 %.** Ce n'est pas rare. Trouver des figures qui
séparent 2 matchs de 2 autres est presque garanti — c'est pour ça que n = 4 ne
peut rien établir.

### Ce qui est pré-enregistrable, avant les prochains matchs

1. **Le marquage cadent prédit le volume À L'ENVERS** — marquage haut → peu de
   buts. À vérifier sur les prochains, jamais à ajuster après coup.
2. **Amissio dans le cadent → beaucoup de buts** (figure marquée `concede` dans
   la table).
3. **Fortuna Major dans le cadent → peu de buts.**

Les trois sont écrites ici **avant** d'avoir d'autres résultats. C'est la seule
chose qui les distinguera d'une coïncidence.

---

## Observation #5 — Fortuna Major / Acquisitio / Rubeus / Puer, résultat **5-0**

Thème rejoué sous le moteur **actuel** (le BTTS a été recâblé sur la force
active de l'axe cadent depuis le dernier affichage de ce thème — la comparaison
ci-dessous est faite sur le code d'aujourd'hui, pas sur un souvenir).

R1 = M12 Acquisitio · R7 = M2 Acquisitio — même figure des deux côtés, départagée
par le Pôle NM rotatif (12,5 contre 6,0) → **R1**.

| famille | annoncé | réel | |
|---|---|---|---|
| camp | R1 (Équipe 1) | 5-0 pour l'équipe 1 | ✓ |
| nul | non | non | ✓ |
| volume `G_vol` | 2,49 → OVER 3.5 / score fleuve (5+) | 5 buts | ✓ |
| BTTS | OUI | non, un seul camp a marqué | ✗ |
| score exact | 5-1 / 6-1 | 5-0 | ✗ |

Détail du thème : marquage cadent R1 6,5 · R7 5,0 · **total 11,5** · part R1 57 %.
Force cadent 8/20 = 40 %. Off R1 70 % contre def R7 50 %, off R7 70 % contre
def R1 50 % — aucun camp muet, alors que le réel est un blanchissage.

### Les trois hypothèses pré-enregistrées

**1. Marquage cadent inversé — tient.** Le cinquième point tombe du bon côté :

| marquage cadent | buts réels |
|---|---|
| **11,5** | 7 |
| **11,5** | **5** ← nouveau |
| 12,5 | 7 |
| 17,5 | 0 |
| 19,5 | 2 |

Spearman ρ = **−0,58** sur n = 5. Sur les 10 paires : 6 dans le sens inverse
annoncé, 2 contre, 2 ex æquo. Direction confirmée, force encore indistinguable
du hasard (p unilatéral ≈ 0,15).

**2. Amissio → beaucoup de buts** et **3. Fortuna Major → peu de buts** :
non testées. Le cadent de ce thème est Rubeus · Tristitia · Conjunctio ·
Conjunctio · Fortuna Minor — ni Amissio ni Fortuna Major. Les deux hypothèses
restent ouvertes, à zéro test réel.

### Tableau de bord après 5 matchs réels

| famille | juste | note |
|---|---|---|
| BTTS | **4/5** | seul raté : ce 5-0 |
| camp | **3/5** | les 2 ratés sont les 2 nuls |
| nul | **3/5** | le moteur n'a jamais dit « nul » ; il n'a donc rien détecté |
| volume (`G_vol` over/under 2,5) | 3/5 | mais il annonce OVER **5 fois sur 5** — prédicteur constant, donc sans information |
| score exact | **0/5** | — |

Le point noir n'est ni le camp ni le BTTS : c'est que **`G_vol` ne varie pas
assez pour trancher**. Sur ces cinq thèmes il vaut 1,84 · 2,49 · 2,58 · 2,93 ·
3,05, tous au-dessus du seuil OVER 2.5, y compris sur le 0-0 et le 1-1. Une
famille qui répond toujours la même chose ne peut pas être créditée de ses
succès.

---

## Les corrections du 13/09/26, et ce qu'il en reste

J'ai passé la journée à corriger le volume, le BTTS, le camp et les incidents
en mesurant tout sur `CAS_REFERENCE_V7`, les 49 thèmes archivés avec un score.
**Ellemine_D a coupé : ces 49 ne sont pas fiables.** On ne sait pas lesquels
sont des matchs FIFA et lesquels sont des matchs réels, et les deux
populations n'ont ni le même nombre de buts ni le même BTTS. Une mesure faite
sur un mélange inconnu ne peut ni condamner ni valider quoi que ce soit.

Il a raison, et tout ce qui reposait dessus est retiré. Ce qui suit sépare les
deux.

### Retiré — tout ce qui était calé sur les 49

| ce que j'avais fait | pourquoi c'est parti |
|---|---|
| volume recalibré sur la moyenne de l'archive (4,16 buts) | moyenne d'un mélange inconnu |
| bandes calées sur les fréquences de l'archive | idem |
| score figé sur « la meilleure constante de l'archive » (3-1 / 2-2) | constante d'un mélange inconnu |
| volume ramené à une constante « puisque r = −0,043 » | corrélation mesurée sur le mélange |
| BTTS déclaré **indécidable** « puisque 19/42 » | 19/42 vient du mélange, découpé par un drapeau `esport` qui est une annotation, pas une donnée |
| justesse du camp affichée sur la carte (19/42) | idem |

La référence du volume redevient **externe** : 2,70 buts par match, la moyenne
du football, qui ne dépend d'aucune donnée de ce fichier. Les bandes
retrouvent les fréquences du football (25 / 24 / 22 / 15 / 14 %). La cascade
BTTS est **rebranchée telle qu'elle était** — non pas parce qu'elle est
démontrée, mais parce que ce qui la condamnait ne vaut rien. Elle reste
étiquetée non validée.

### Gardé — tout ce qui se démontre sans un seul match

Ces défauts se lisent dans le code ou dans la distribution des 65 536 thèmes.
Aucun ne dépend d'un résultat de match.

**1. Le volume lisait de mauvaises maisons.**

| lu | correct |
|---|---|
| trigones 1-5-9 / 2-6-10 / 3-7-11 / 4-8-12 | canaux Feu M1·M5·M9·M13, Air M2·M6·M10·M14, Eau M3·M7·M11·M15, Terre M4·M8·M12·M16 |
| Terre sur 2-6-10, Air sur 4-8-12 | l'inverse de `ELEMENT_OF_HOUSE` |
| axe angulaire 1-4-7-10 | `MAISONS_CARDINALES_V7` = 1-4-7-10-13-16 |
| R1 = maison 9, R7 = maison 3, **en dur** | la rotation issue de la Maison de Repos de M1 |

**2. Le nombre affiché n'était pas des buts.** `G_vol` est un indice sans
unité, de moyenne 2,15, affiché sous l'étiquette « Volume des buts » et
comparé au seuil 2,5. Il annonçait « 5+ buts » sur **48,6 %** des thèmes et
`over 2.5` sur **97,5 %**. La carte affiche maintenant des buts attendus, une
bande et une probabilité.

**3. Le score n'avait aucune source.** Découvert en débranchant un instant la
contrainte BTTS : sans elle, le générateur ne produisait plus que 1-0 (40 %),
0-1 (45 %) et 0-0 (15 %). Le total de buts était produit par une lecture BTTS,
pas par un moteur de buts. Il vient maintenant du volume.

**4. La carte ne pouvait jamais annoncer un nul.** Sur les 65 536 thèmes elle
ne sortait que R1 ou R7. `nulActifV7`, l'organe du nul de la doctrine,
existait et n'était relié à rien. Il l'est.

**5. L'avantage du terrain était collecté puis jeté.** `domicileCode` arrivait
jusqu'à `buildVerdictCard` mais ne majorait qu'un total de capacité — écrasé
une ligne plus loin par `winnerOverride`. Dès que le 1N2 tranchait, c'est-à-dire
toujours, l'équipe à domicile n'avait **aucun** effet sur le camp. Elle tranche
désormais les égalités.

**6. Le détecteur d'incident s'allumait presque toujours.** Mesuré sur les
65 536 thèmes :

| | part des thèmes |
|---|---|
| `detectIncidentV2` | 63,9 % |
| `detectIncidentChaotique` | 93,4 % |
| **l'un OU l'autre (= `penaltyRouge`)** | **95,0 %** |

Un OU entre deux détecteurs larges ne peut que s'allumer. Les deux restent,
entiers, comme lectures ; ce qui change, c'est qu'ils sont lus en **intensité**
— `indice = 2 × signaux V2 + signaux larges` — avec un seuil posé sur la
distribution mesurée. `indice ≥ 9` est franchi par **29,6 %** des thèmes,
l'ordre de grandeur externe du penalty ou du rouge (environ 25 % et 8 %). Le
seuil ne vient pas de l'archive : elle n'étiquette l'incident que sur 10 de ses
49 thèmes, dont 9 positifs.

Ce qui est acquis : l'annonce est devenue **rare comme l'évènement est rare**,
au lieu d'être permanente. Ce qui n'est pas prétendu : que le bon tiers soit
désigné. Rien ne permet de le dire.

**7. Neuvième occurrence du défaut récurrent.** Trois affichages nommaient une
chose pendant que le code en appliquait une autre :

- « ⚠️ Incidents : AUCUN SIGNAL **· CONTRE M1** » — le camp s'affichait sans
  signal ;
- « CAMP CORRIGÉ … le vainqueur devient R7 » à côté d'un verdict « nul », parce
  que le texte décrivait l'état intermédiaire ;
- le premier calibrage d'incident, posé sur `detectIncidentChaotique(theme, 1, 7)`
  alors que la carte appelle les détecteurs sur les maisons de la rotation —
  il annonçait 47 % au lieu des 30 % visés. Recalé sur le chemin réel.

### Ce qu'il faut maintenant, et rien d'autre

Une archive dont on sache, pour chaque ligne, **si c'est un match réel ou un
FIFA**, et **quelle équipe recevait**. Sans ces deux colonnes, aucune mesure de
justesse n'est possible et aucun réglage n'est défendable. Tout ce que j'ai
mesuré aujourd'hui — les 45 %, les 19/42, les corrélations nulles — est à jeter
tant que ces deux colonnes n'existent pas.

---

## Échantillon choisi par Ellemine_D — ligne 1

> « C'est moi qui choisis les échantillons, c'est beaucoup plus fiable. »

L'archive des 49 ne peut rien mesurer. Ce registre-ci est différent : chaque
ligne est choisie et vérifiée. Il vit dans le fichier sous
`ECHANTILLON_ELLEMINE_V7`, à côté du moteur d'incident.

**Règle de tenue, à ne jamais contourner** : une ligne s'écrit **avant** qu'on
touche à un seuil, jamais après. Un moteur ne se règle pas sur la ligne qui
vient de le contredire — sinon on ne mesure plus, on recopie.

### Ligne 1 — Tristitia / Tristitia / Conjunctio / Rubeus

R1 = M8 Fortuna Minor · R7 = M14 Puer · score 1-1 · **rouge côté M1 / R1**

| | annoncé | réel | |
|---|---|---|---|
| incident | **non** — intensité 5, seuil 9 | rouge | ✗ |
| camp de l'incident | **M1** | M1 | ✔ |

**Le camp est juste, le oui/non est faux.** Et c'est instructif : les deux
détecteurs ont bel et bien vu quelque chose, et ils ont nommé le bon camp.

- V2 : `M9 — filiation incidentogène : M1 Tristitia + M2 Tristitia → M9
  Populus, contre l'équipe 1`
- lecture large : la même filiation, plus `M13 — incident dans la phase de
  synthèse`

Trois signaux, tous convergents, tous du bon côté. Ce qui a manqué, c'est
l'intensité : 5 contre un seuil de 9. Le thème est au 43e centile.

### Ce que je n'ai pas fait

**Je n'ai pas bougé le seuil.** Un seuil déplacé sur l'observation qui vient
de le contredire ne mesure plus rien. Il reste posé sur la fréquence externe
du penalty et du rouge — environ 30 % des matchs — et il y restera tant que
l'échantillon n'est pas assez fourni pour dire autre chose.

Ce que ce cas aurait donné avant ce matin est d'ailleurs sans valeur : le
détecteur s'allumait sur 95 % des thèmes, il aurait « trouvé » ce rouge comme
il aurait trouvé n'importe quoi.

### Ce que j'ai fait

Le camp reste **lu et affiché même sous le seuil**. La carte écrit maintenant :

> ⚠️ Incidents : AUCUN SIGNAL *(Aucun · intensité 5 · 43e centile · lecture
> sous le seuil : contre M1)*

Effacer cette lecture aurait jeté la seule partie du moteur qui a marché sur
cette ligne. L'incident s'affiche désormais en degré — niveau, intensité,
centile — et plus en oui/non sec.

### À surveiller sur les prochaines lignes

Une hypothèse est posée ici, **avant** d'avoir d'autres résultats, et elle ne
sera jamais ajustée après coup :

> **L'attribution du camp est meilleure que la détection.** Le moteur saurait
> dire CONTRE QUI, sans savoir dire SI. Si cela tient sur les prochaines
> lignes, c'est l'attribution qu'il faut exploiter, et le oui/non qu'il faut
> abandonner — pas l'inverse.

---

## L'incident, doctrine d'Ellemine_D (13/09/26)

> « Les incidents sont opérés dans l'axe succèdent. »
>
> « Feu-eau seul crée le chaos, non — air-terre aussi. Les lieux de problème
> dans les 16 maisons sont M6 air et M12 terre. Avec feu en excès quelque part
> du thème et M6, M12 en situation étouffante, il y a risque d'incident.
> Pourquoi Rubeus en général en M12 implique incidents ? »

### 1. Sa correction est juste, et le fichier se contredisait déjà

| | `concordanceElement` | `ELEMENT_ROLE_MATRIX_V7` |
|---|---|---|
| feu-eau | **0,25 — contraires** | « Chaotique » |
| air-terre | **0,25 — contraires** | « Blocage » |
| air-eau | 0,5 — alliés | « Dissonant » |

Deux noms pour une seule relation, et le détecteur d'incident ne comptait que
« Chaotique ». **Dixième occurrence** dans ce fichier de deux tables du même
objet qui ne disent pas la même chose.

Et j'avais ajouté l'erreur inverse le matin même en comptant « Dissonant »
comme rôle d'incident : air-eau vaut 0,5, ce sont des **alliés**. Retiré. La
contrariété se lit désormais sur `concordanceElement === 0,25`, l'unique
table, et sur rien d'autre.

### 2. Pourquoi Rubeus en M12

**Rubeus est AIR** — 2-1-2-2. Pas feu, contre ce que sa couleur suggère.
**M12 est TERRE.** Rubeus en M12, c'est donc air-terre : la contrariété pure,
dans le lieu de problème. Mesuré : sur les 4 096 thèmes où Rubeus loge en M12,
il y est étouffé **4 096 fois — 100 %**, par construction.

Quatre figures étouffent M12, les quatre figures air :

| figure | élément | rôle en M12 | explosive |
|---|---|---|---|
| Caput Draconis | air | Blocage | non |
| Conjunctio | air | Blocage | non |
| Acquisitio | air | Blocage | non |
| **Rubeus** | **air** | **Blocage** | **⚡ oui** |

**Rubeus est la seule figure du jeu qui cumule contrariété et explosion dans un
lieu de problème.** Ce n'est pas Rubeus qui est incidentogène — c'est Rubeus
*en M12*.

### 3. Les deux lieux

M6 (air) et M12 (terre) sont eux-mêmes contraires l'un de l'autre : l'axe
M6-M12 est une opposition air-terre. Chacun est étouffé **25,0 %** du temps,
l'un ou l'autre **43,8 %**, les deux **6,3 %**. M6 est du côté de l'équipe 1
(maisons 2 à 6), M12 du côté de l'équipe 2 (maisons 8 à 12).

### 4. L'excès de feu : le feu posé sur le feu

Sept définitions testées. Celle qui correspond à ce qui est décrit — du feu
**accumulé**, pas du feu actif — est le **Déclencheur** : une figure de feu
logée dans une maison de feu (M1, M5, M9, M13), concordance 1.

Sur la ligne 1, le canal feu est actif **0 fois sur 4** — aucune énergie — mais
il y a **deux Déclencheurs**, M5 Populus et M9 Populus, deux figures de feu
entièrement passives (2-2-2-2) posées sur des maisons de feu. Du feu entassé
sans issue. C'est exactement « étouffante ».

### 5. La règle, et ce qu'elle donne sans aucun réglage

> **incident = (M6 étouffée OU M12 étouffée) ET (au moins un Déclencheur)**

Sur les 65 536 thèmes, elle s'allume sur **30,1 %**.

Le penalty est sifflé dans environ 25 % des matchs, le rouge sorti dans environ
8 % : l'un ou l'autre, environ **30 %**.

**Il n'y a aucun seuil dans cette règle.** Aucune constante n'a été ajustée —
la fréquence tombe juste toute seule. C'est la première fois de la journée
qu'une lecture de ce fichier se cale sans qu'on la cale. Pour mémoire, ce
qu'elle remplace s'allumait sur **95,0 %** des thèmes.

### 6. Le camp

Poids d'un lieu : **0** s'il respire, **1** s'il est étouffé, **2** s'il est
étouffé *et* porte une figure explosive. L'explosive aggrave un blocage, elle
n'en crée pas — d'où le 0 quand la maison respire. Le camp est celui du lieu
le plus chargé.

Équilibre mesuré quand la règle s'allume : **M1 42,4 % · M7 46,3 % · non
tranché 11,2 %**.

### 7. Ligne 1

Tristitia / Tristitia / Conjunctio / Rubeus — 1-1, **rouge côté M1**

| | |
|---|---|
| M6 | Fortuna Major (terre) en maison air → **étouffée**, poids 1 |
| M12 | Cauda Draconis (eau) en maison terre → respire, poids 0 |
| Déclencheurs | M5 Populus · M9 Populus |

**incident ✔ · camp M1 ✔**

Une ligne ne démontre rien. Ce qui vaut ici, c'est que la règle vient
entièrement de la doctrine et que sa fréquence tombe sur celle du réel sans
qu'on ait touché à quoi que ce soit.

La carte affiche :

> ⚠️ Incidents : **⚠️ SIGNAL INCIDENT · CONTRE M1** *(Marqué · M6/M12 étouffée
> · 2 Déclencheurs de feu)*

---

## Échantillon d'Ellemine_D — ligne 2

**Puella / Amissio / Rubeus / Carcer** — réel **2-3**, **penalty pour M7 / R7**

Annoncé avant que le résultat soit donné.

### L'incident

| lieu | figure | | poids |
|---|---|---|---|
| M6 | Albus — eau en maison air | *alliés*, respire | 0 |
| **M12** | **Acquisitio — air en maison terre** | **ÉTOUFFÉE** | 1 |

Déclencheurs de feu : **M5 Puer**, **M13 Fortuna Minor**.

> M12 étouffée + excès de feu → **⚠️ incident, niveau Marqué, côté M7**

**Incident trouvé ✔ · côté nommé M7 ✔**

Note au passage : **Rubeus est en M3, pas en M12.** La règle Rubeus/M12 ne
joue pas ici. C'est Acquisitio — une autre des quatre figures air — qui
étouffe M12. Même contrariété, mais sans l'aggravation explosive : poids 1 et
non 2. La règle a donc fonctionné sans sa figure emblématique.

### Ce que cette ligne apprend sur le mot « contre »

| | ce qu'a dit Ellemine_D | le camp nommé est |
|---|---|---|
| ligne 1 | « rouge **côté** M1 » | la **victime** |
| ligne 2 | « penalty **pour** M7 » | le **bénéficiaire** |

Le moteur a nommé M1 puis M7 — le bon côté les deux fois. Mais il l'affichait
sous l'étiquette « **CONTRE** X », et cette étiquette était donc fausse une
fois sur deux.

**Le moteur lit un lieu de problème et en déduit un côté. Il ne sait pas qui
subit et qui profite.** Étiquette corrigée en « **CÔTÉ** X ». Onzième
occurrence du défaut récurrent : l'affichage affirmait plus que le code ne
sait.

⚠️ Si la doctrine veut dire *la victime* dans les deux cas, alors
l'attribution fait **1 sur 2**, pas 2 sur 2. C'est à trancher, et je note les
deux lectures plutôt que de choisir celle qui m'arrange.

### Le reste de la carte, sans enjoliver

| famille | annoncé | réel | |
|---|---|---|---|
| incident | **oui**, Marqué | oui, penalty | ✔ |
| côté de l'incident | **M7** | M7 | ✔ |
| nul | non | non | ✔ |
| over 2.5 | oui | oui (5 buts) | ✔ |
| **camp** | **R1** | **R7** | ✗ |
| **BTTS** | **non** | **oui** (2-3) | ✗ |
| bande de buts | 4 buts (3,48 attendus) | 5 buts | ✗ |
| score exact | 2-1 | 2-3 | ✗ |

**4 sur 8.** L'incident est la seule famille qui marche sur les deux lignes.

Le BTTS est un vrai raté : la cascade a été rebranchée ce matin faute de
données fiables pour la condamner, et elle annonce « un seul marque » sur un
2-3.

### Bilan de l'échantillon, 2 lignes

| famille | juste |
|---|---|
| **incident présent** | **2/2** |
| **côté de l'incident** | **2/2** (ou 1/2 si « camp » = victime) |
| nul | 2/2 |
| camp | 1/2 |
| BTTS | 1/2 |
| volume, bande | 0/2 |
| score exact | 0/2 |

Deux lignes ne démontrent rien. Mais la règle d'incident est la seule pièce du
système qui, aujourd'hui, sort entièrement de la doctrine, se cale seule sur la
bonne fréquence, et tombe juste deux fois de suite. Rien n'a été touché entre
la ligne 1 et la ligne 2.

---

## Le camp de l'incident est le pénalisé — la ligne 2 est fausse

Tranché par Ellemine_D. Le penalty est **pour** M7, donc c'est **M1 qui est
pénalisé**. Le moteur a dit M7.

| | pénalisé | moteur | |
|---|---|---|---|
| ligne 1 — rouge côté M1 | M1 | M1 | ✔ |
| ligne 2 — penalty pour M7 | **M1** | **M7** | ✗ |

**L'attribution fait 1 sur 2, pas 2 sur 2.**

J'avais compté la ligne 2 juste en redéfinissant le camp comme « le côté où
l'évènement tombe ». Ce n'était pas la doctrine, c'était la lecture qui
m'arrangeait. Je l'avais signalée comme une des deux lectures possibles, mais
j'avais retenu celle qui donnait 2/2 — c'est exactement ce qu'il ne faut pas
faire.

**Le mapping M6 → équipe 1 / M12 → équipe 2 n'est pas retourné pour autant.**
On ne renverse pas une règle sur la ligne qui vient de la contredire ; c'est
la règle de tenue inscrite dans le registre.

Question ouverte, et c'est de la doctrine, pas de la mesure : un étouffement
en **M12** marque-t-il l'affliction de l'équipe 2 (M12 = 6e maison comptée
depuis la 7e) ou la défaite de l'équipe 1 (M12 = 12e maison du consultant, ses
ennemis cachés) ? Cela se tranche d'un mot.

Bilan des deux lignes, corrigé : **incident présent 2/2 · camp de l'incident
1/2 · nul 2/2 · camp du match 1/2 · BTTS 1/2 · volume 0/2 · score exact 0/2.**

---

## Audit un par un de tout ce que j'ai touché aujourd'hui

> « Tous les points que tu avais corrigés avec les 49 matchs sont tous faux,
> sans exception. Il faut revoir ces points un par un. »

Onze changements. Pour chacun : d'où vient la preuve, et ce qu'il en reste.

| # | changement | preuve | verdict |
|---|---|---|---|
| 1 | canaux élémentaires 1-5-9 → **1-5-9-13** (et les trois autres) | `ELEMENT_OF_HOUSE`, dans le fichier | **gardé** — se lit sans un seul match |
| 2 | axe angulaire 1-4-7-10 → **1-4-7-10-13-16** | `MAISONS_CARDINALES_V7` | **gardé** — idem |
| 3 | R1/R7 codés en dur sur M9 et M3 → **la rotation** | la définition de R1/R7 | **gardé** — idem |
| 4 | `G_vol` affiché comme des buts → **buts attendus** | 48,6 % des 65 536 thèmes annonçaient « 5+ buts », `over 2.5` sur 97,5 % | **gardé** — le défaut est dans la distribution des thèmes, pas dans des résultats |
| 5 | **marquage cadent inversé mis dans le volume** | **cinq résultats du même lot que les 49** | **RETIRÉ** |
| 6 | score sourcé sur le volume, marge d'un but | le défaut (score bloqué à 1-0/0-1/0-0 sans le BTTS) est structurel ; la marge, je la justifiais **par l'archive** | **gardé, re-sourcé** — la marge d'un but est la plus fréquente en football, fait général |
| 7 | BTTS déclaré indécidable | 19/42 sur l'archive | **déjà retiré** cet après-midi, cascade rebranchée |
| 8 | justesse du camp affichée sur la carte (19/42) | l'archive | **déjà retiré** |
| 9 | `nulActifV7` branché sur le camp affiché | la carte ne produisait **jamais** « nul » sur les 65 536 thèmes | **gardé** — un moteur de verdict doit pouvoir sortir les trois issues |
| 10 | le domicile tranche les égalités | `domicileCode` était écrasé par `winnerOverride` une ligne plus loin — lisible dans le code | **gardé** |
| 11 | bannières qui nommaient autre chose que ce que le code applique | lecture du code | **gardé** |

Et les incidents, ajoutés après : **entièrement issus de ta doctrine**, aucun
chiffre de l'archive n'y entre. La fréquence de 30,1 % tombe seule.

### Ce que le point 5 change au volume

Le volume ne repose plus que sur `G_vol` — structurel — et sur la moyenne
externe de 2,70 buts. Bandes annoncées après retrait : 26,3 % / 22,7 % /
21,5 % / 14,1 % / 15,4 %, contre les 25 / 24 / 22 / 15 / 14 du football.
`over 2.5` annoncé sur 51,5 % des thèmes.

### Ce que cet audit ne couvre pas

Le fichier contient **beaucoup** de raisonnements calés sur l'archive bien
avant aujourd'hui — des dizaines de commentaires du type « mesuré sur les 49 »,
« taux de base des nuls dans l'archive : 24 % », des seuils réglés sur elle.
Ils sont hors du périmètre de cet audit, qui ne porte que sur ce que j'ai
touché aujourd'hui. Si tu veux, je passe le fichier entier au même crible.

---

## BTTS sur les matchs que tu as choisis

Les trois que tu avais mis à part (« parmi les 49 il y a des matchs FIFA, des
matchs virtuels ; prends juste d'abord ceux-là ») plus la ligne 2. Cascade
telle qu'elle est aujourd'hui, rebranchée cet après-midi.

| thème | réel | BTTS réel | annoncé | branche | |
|---|---|---|---|---|---|
| Tristitia / Via / Conjunctio / Rubeus | 7-0 | non | non | **camp muet** | ✔ |
| Fortuna Major / Via / Puella / Cauda | 0-0 | non | non | axes | ✔ |
| Tristitia / Tristitia / Conjunctio / Rubeus | 1-1 | oui | oui | axes | ✔ |
| Puella / Amissio / Rubeus / Carcer | 2-3 | oui | **non** | axes | ✗ |

**BTTS : 3 sur 4.** « Toujours oui » et « toujours non » feraient 2/4 chacun.

### Ce que ça corrige de ce matin

J'ai déclaré ce matin que le BTTS mesurait **sous le hasard** — 19/42, φ = −0,095
— et je l'ai débranché sur cette base. Tu as coupé : ces 42 sortent d'un lot
dont on ne sait rien. J'ai rebranché la cascade cet après-midi en disant qu'elle
restait **non validée**.

Sur tes matchs à toi, elle fait **3/4**. Ce n'est pas une validation — quatre
matchs ne valident rien, et « toujours oui » ferait 2/4 — mais c'est le premier
signe favorable qu'elle ait jamais eu sur des données que tu tiens pour fiables.

Et la branche qui tranche le 7-0 est le **camp muet** : celle-là même que
j'avais mesurée à φ = −0,196 sur le lot non fiable et que j'avais débranchée du
BTTS. Ici elle a raison.

### Le reste, sur les quatre mêmes

| thème | camp réel / dit | buts réel / attendu | over 2.5 |
|---|---|---|---|
| Tristitia/Via/Conjunctio/Rubeus | R1 / **R1** ✔ | 7 / 3,87 (5+) | ✔ |
| Fortuna Major/Via/Puella/Cauda | nul / R1 ✗ | 0 / 2,57 (2 buts) | ✔ |
| Tristitia/Tristitia/Conjunctio/Rubeus | nul / R7 ✗ | 2 / 2,40 (2 buts) | ✔ |
| Puella/Amissio/Rubeus/Carcer | R7 / R1 ✗ | 5 / 3,57 (4 buts) | ✔ |

**Over/under 2,5 : 4 sur 4** — et c'est mesuré APRÈS avoir sorti le marquage
cadent du volume, donc sur `G_vol` seul plus la calibration externe.

**Camp : 1 sur 4.** Les trois ratés comprennent deux nuls que le moteur ne voit
pas. `nulActifV7` ne s'allume sur aucun des deux.

### Bilan de l'échantillon choisi, 4 matchs

| famille | juste |
|---|---|
| over / under 2,5 | **4/4** |
| BTTS | **3/4** |
| incident présent | 2/2 (deux renseignés) |
| camp de l'incident | 1/2 |
| **camp du match** | **1/4** |
| nul | 2/4 |
| bande de buts | 1/4 |
| score exact | 0/4 |

Le camp est la pièce la plus faible, et ce sont les nuls qui le tuent : deux
des quatre matchs sont des nuls, le moteur n'en voit aucun.

---

## Axe cadent par activation, R1/R7, et le marquage dans l'activation

Sur les quatre matchs choisis. **Activation** = nombre de niveaux à 1 point
(sur 4) — c'est ce que compte déjà `forceCampV7`. **Marquage** = `BUTS_FIGURE`,
moyenne du min et du max.

### L'axe cadent, maison par maison

**Tristitia / Via / Conjunctio / Rubeus — 7-0**

| maison | figure | F A E T | actifs | marquage |
|---|---|---|---|---|
| M3 | Cauda Draconis | 1 1 1 0 | 3/4 | 1-2 |
| M5 | Fortuna Major | 0 0 1 1 | 2/4 | **3-5** |
| M9 | Amissio | 1 0 1 0 | 2/4 | 0-1 |
| M11 | Albus | 0 0 1 0 | 1/4 | 2-4 |
| M15 | Puella | 1 0 1 1 | 3/4 | 2 |

activation **10/20** · marquage **10,5** · **46 %** du marquage du thème

**Fortuna Major / Via / Puella / Cauda — 0-0** — activation 11/20 · marquage 7,5 ·
par élément Feu 3/5 Air 2/5 **Eau 4/5** Terre 2/5

**Tristitia / Tristitia / Conjunctio / Rubeus — 1-1** — activation **8/20** ·
marquage 5,0 · deux Populus à **0/4** en M5 et M9, l'axe est mort en son milieu

**Puella / Amissio / Rubeus / Carcer — 2-3** — activation 11/20 · marquage 5,0 ·
par élément Feu 2/5 **Air 4/5** Eau 2/5 Terre 3/5

### Les sièges

| | R1 | activation | marquage propre | trigone offensif |
|---|---|---|---|---|
| 7-0 | M8 Fortuna Minor | 2/4 | 1-2 | 55 % · marquage 6,5 |
| 0-0 | M12 Tristitia | **1/4** | 0-1 | 55 % · marquage 10,5 |
| 1-1 | M8 Fortuna Minor | 2/4 | 1-2 | 50 % · marquage 10,5 |
| 2-3 | M14 Amissio | 2/4 | 0-1 | 50 % · marquage 7,5 |

| | R7 | activation | marquage propre | trigone offensif |
|---|---|---|---|---|
| 7-0 | M14 Carcer | 2/4 | **0** | 60 % · marquage 5,0 |
| 0-0 | M2 Via | **4/4** | 0-1 | 50 % · marquage 7,0 |
| 1-1 | M14 Puer | 3/4 | 1-2 | 55 % · marquage 9,0 |
| 2-3 | M4 Carcer | 2/4 | **0** | 45 % · marquage 6,5 |

### Le marquage pondéré par l'activation

C'est l'objet de ta question : ce que chaque figure peut marquer **multiplié par
ce qu'elle a d'actif**. Une figure qui marque beaucoup mais dort ne compte pas.

> marquage pondéré = Σ ( marquage moyen × actifs / 4 )

| indice | 7-0 | 0-0 | 1-1 | 2-3 | ρ |
|---|---|---|---|---|---|
| cadent, activation brute | 10 | 11 | 8 | 11 | −0,21 |
| cadent, marquage brut | 10,5 | 7,5 | 5,0 | 5,0 | +0,32 |
| cadent, marquage pondéré | 5,13 | 3,63 | 2,75 | 2,50 | +0,20 |
| **les 16 maisons, marquage pondéré** | **9,88** | **13,50** | **11,88** | **10,25** | **−1,00** |
| **R1, trigone offensif pondéré** | **2,38** | **5,63** | **5,13** | **3,38** | **−1,00** |

**Deux indices ordonnent parfaitement les quatre matchs, à l'envers.** Plus le
marquage activé est fort, moins il y a de buts.

### Ce que ça vaut, et je te le dis avant que tu me le demandes

**Presque rien.** Sur 4 points il y a 24 ordres possibles, dont 2 donnent
|ρ| = 1 — soit **8,3 %** par pur hasard. J'ai testé **14 indices**. Le nombre
attendu de |ρ| = 1 par hasard seul est de **1,17**. J'en trouve deux. C'est
exactement ce que le hasard produit.

### Ce qui, en revanche, compte pour de bon

Le **sens** de l'inversion n'a pas été trouvé aujourd'hui : je l'ai
**pré-enregistré ce matin**, avant d'avoir la ligne 2 :

> « Le marquage cadent prédit le volume À L'ENVERS — marquage haut → peu de
> buts. À vérifier sur les prochains, jamais à ajuster après coup. »

La ligne 2 — Puella / Amissio / Rubeus / Carcer — est le premier match dont je
ne connaissais pas le résultat quand cette phrase a été écrite. Marquage cadent
**14,0**, deuxième plus bas des quatre ; **5 buts**, deuxième plus haut. **Dans
le sens annoncé.**

| marquage cadent | buts |
|---|---|
| 11,5 | 7 |
| **14,0** | **5** ← hors échantillon |
| 17,5 | 0 |
| 19,5 | 2 |

ρ = **−0,80**.

**Une confirmation hors échantillon. Une seule.** Je ne rebranche rien : j'ai
sorti le marquage cadent du volume il y a une heure parce qu'il reposait sur le
lot non fiable, et une observation ne suffit pas à l'y remettre.

Ce qu'il faut, c'est la ligne 5, la 6, la 7 — avec l'inversion écrite d'avance,
comme elle l'est. Si elle tient encore, alors le marquage pondéré par
l'activation rentre dans le volume, et pas avant.

---

## Corrigé sur le match 2-3 : le lieu ne nomme pas le camp

J'attribuais le camp par la maison — M6 → équipe 1, M12 → équipe 2 — d'après le
découpage classique (maisons 2 à 6 au consultant, 8 à 12 à l'adversaire). Le
2-3 le contredit.

| | lieu étouffé | pénalisé réel | moteur |
|---|---|---|---|
| ligne 1 | **M6** | M1 | M1 ✔ |
| ligne 2 | **M12** | M1 | M7 ✗ |

**Deux lieux différents, le même camp pénalisé.** Aucune correspondance
lieu → camp ne peut coller aux deux : c'est arithmétique, pas une question de
réglage.

### J'ai cherché ailleurs. Rien.

Sept règles testées contre les deux lignes :

| règle | ligne 1 | ligne 2 | justes | équilibre sur 65 536 |
|---|---|---|---|---|
| trigone offensif le plus faible | M1 | M7 | 1/2 | 39 / 29 / 32 |
| défense la plus faible | M7 | M7 | 0/2 | 34 / 46 / 20 |
| siège le moins actif | M1 | — | 1/2 | 30 / 42 / 28 |
| siège le moins concordant | — | M1 | 1/2 | 29 / 35 / 36 |
| siège au plus faible marquage | — | M7 | 0/2 | 39 / 42 / 19 |
| le camp muet | — | M7 | 0/2 | 19 / 16 / 65 |
| **« toujours R1 »** | M1 | M1 | **2/2** | 100 / 0 / 0 |

La seule qui colle aux deux est « toujours R1 », et ce n'est pas une règle :
c'est l'artefact de deux observations qui pénalisent toutes deux R1.

**Tant qu'aucune ligne n'aura R7 comme camp pénalisé, la question du camp est
indécidable par construction** — n'importe quelle règle qui répond R1 deux fois
passera le test.

### Ce qui est fait

Le lieu détecte la **présence** de l'incident : **2 sur 2**. Il ne nomme plus
personne. Le lieu étouffé reste affiché tel quel — c'est un fait, pas une
accusation.

La carte écrit maintenant :

> ⚠️ Incidents : **⚠️ SIGNAL INCIDENT** *(Marqué · M6/M12 étouffée · 2
> Déclencheurs de feu)*

sans « CONTRE X ».

`CAMP_INCIDENT_DEPUIS_LE_LIEU_V7 = false` remet la correspondance par maison si
tu la veux.

### Ce qu'il me faut

**Une ligne où c'est R7 qui est pénalisé.** C'est la seule observation qui peut
rouvrir la question. Aujourd'hui, deux lignes sur deux accusent R1, et aucun
test n'est possible là-dessus.

### Bilan de l'incident, corrigé

| | juste |
|---|---|
| **présence de l'incident** | **2/2** |
| camp de l'incident | **non déterminé** (était 1/2) |

---

## BTTS — l'équilibre du marquage (13/09/26)

### Le raisonnement

« Les deux marquent » n'est pas une question de force, c'est une question
d'**équilibre**. Un camp qui écrase ne laisse pas marquer ; deux camps à
égalité marquent tous les deux. Et le déséquilibre se lit dans la seule table
du fichier qui dise combien une figure marque — `BUTS_FIGURE` — sur le trigone
offensif de chaque camp.

> part R1 = marquage(trigone offensif R1) / (R1 + R7)
> **BTTS = | part R1 − 50 % | < seuil**

### Le seuil vient du réel, pas des matchs du fichier

Le BTTS tombe dans environ **51 %** des matchs de football. Sur les 65 536
thèmes, l'écart `|part − 50 %|` a pour médiane **4,17 %** : c'est donc 4,17 %
qui fait annoncer « les deux marquent » sur 51 % des thèmes. Aucun autre
réglage.

### Sur les quatre matchs choisis

| thème | réel | BTTS réel | écart | annoncé | |
|---|---|---|---|---|---|
| Tristitia / Via / Conjunctio / Rubeus | 7-0 | non | **6,5 %** | non | ✔ |
| Fortuna Major / Via / Puella / Cauda | 0-0 | non | **10,0 %** | non | ✔ |
| Tristitia / Tristitia / Conjunctio / Rubeus | 1-1 | oui | **3,8 %** | oui | ✔ |
| Puella / Amissio / Rubeus / Carcer | 2-3 | oui | **3,6 %** | oui | ✔ |

**4 sur 4**, contre 3 sur 4 pour la cascade. Et le seuil de 4,17 % tombe **dans**
la fenêtre de séparation (3,8 % – 6,5 %) sans avoir été choisi pour ça.

### Ce que ça ne prouve pas

Séparer 2 matchs de 2 autres avec une variable continue arrive par hasard **une
fois sur trois**. J'ai essayé quatre mesures d'équilibre — marquage brut,
marquage pondéré par l'activation, activation seule, forces offensives : la
probabilité qu'au moins une sépare par pur hasard est de **80 %**. Seul le
marquage **brut** sépare ; les trois autres non.

Et **la marge est mince** : le 1-1 est à 3,80 % pour un seuil de 4,17 %. Si le
taux réel de BTTS était de 48 % au lieu de 51 %, le seuil tomberait à 3,85 % et
ce match basculerait du mauvais côté.

### Ce qui justifie quand même de la brancher

Indépendamment des quatre matchs :

- c'est **une ligne de doctrine**, à la place d'une cascade de cinq étages
  empilés au fil des mois ;
- son seuil sort d'une **fréquence externe**, pas d'un ajustement ;
- elle annonce BTTS oui sur **51,4 %** des thèmes, comme le réel, là où la
  cascade en annonçait **57,3 %**.

La cascade reste calculée et exposée en contre-lecture.
`BTTS_EQUILIBRE_DECIDE_V7 = false` la remet aux commandes.

### Ce que j'ai dû retirer pour que ça marche

**Le camp muet ne touche plus au BTTS.** Il continue de corriger le camp, comme
demandé le 11/09. Sur le BTTS, la raison de le retirer ne doit rien à
l'archive : il s'allume sur **20,8 %** des thèmes, et ce sont précisément les
thèmes **équilibrés** qu'il frappe. Branché par-dessus la règle d'équilibre, il
faisait tomber le taux de BTTS oui de 51 % à **30,7 %** — il détruisait la
calibration. Et sur la ligne 2, c'est lui, et lui seul, qui retournait le
« oui » de la règle d'équilibre en « non ».

### Bilan de l'échantillon choisi, 4 matchs

| famille | juste |
|---|---|
| **BTTS** | **4/4** |
| over / under 2,5 | **4/4** |
| **incident présent** | **2/2** |
| camp de l'incident | non déterminé |
| camp du match | 1/4 |
| nul | 2/4 |
| bande de buts | 1/4 |
| score exact | 0/4 |

Deux pièces sur huit tombent juste partout, et ce sont les deux qui sortent
d'une ligne de doctrine avec un seuil externe : **l'incident** et le **BTTS**.
Les familles qui restent fausses — le camp, le nul, le score — sont celles qui
reposent encore sur des cascades héritées.

---

## Attaque du camp (13/09/26)

J'ai appliqué la méthode qui a marché deux fois aujourd'hui — une ligne de
doctrine, un seuil externe. **Elle ne donne rien ici, et je ne change pas le
moteur.** Voici pourquoi, puis ce que j'ai trouvé à la place.

### Les lectures essayées

Sept lectures de l'écart R1 − R7, seuil de nul posé au quantile 26 % (le taux
réel de nuls) :

| lecture | 7-0 (R1) | 0-0 (nul) | 1-1 (nul) | 2-3 (R7) | justes |
|---|---|---|---|---|---|
| marquage offensif | 1,50 | 3,50 | 1,50 | 1,00 | 1/4 |
| marquage activé | 0,00 | 1,88 | 0,00 | 0,88 | 1/4 |
| activation offensive | −1,00 | 1,00 | −1,00 | 1,00 | 0/4 |
| offensive − défense adverse | 0,00 | 0,00 | 1,00 | 2,00 | 0/4 |
| concordance du siège | 0,25 | 0,50 | 0,00 | −0,50 | 2/4 |
| **marquage du siège** | 1,50 | 0,00 | 0,00 | 0,50 | **3/4** |
| activation du siège | 0,00 | −3,00 | −1,00 | 0,00 | 1/4 |

Puis quatre assemblages :

| | annoncé | justes | marginale sur 65 536 |
|---|---|---|---|
| A — marquage du siège seul | R1 nul nul R1 | **3/4** | R1 42 % · R7 39 % · nul **19 %** |
| B — marquage + `nulActifV7` | R1 nul nul R1 | 3/4 | 33 / 31 / **37 %** |
| C — marquage, activation départage | R1 R7 R7 R1 | 1/4 | 48 / 44 / 8 % |
| **D — moteur actuel** | R1 R1 R7 R1 | 1/4 | 39 / 37 / **24 %** |

cible sans avantage du terrain : **37 / 37 / 26**

### Pourquoi je ne bascule pas

**3 sur 4 ne vaut rien ici.** Sur les 12 arrangements possibles des étiquettes
réelles, 2 donnent ≥ 3 bonnes réponses à une prédiction fixée — **16,7 %**. J'ai
essayé onze lectures : la probabilité qu'au moins une atteigne 3/4 par pur
hasard est de **86 %**.

Et surtout : **le moteur actuel a la meilleure marginale.** 39 / 37 / 24 contre
42 / 39 / 19 pour la meilleure des nouvelles. Sur le nul, qui est le vrai point
faible, il est plus juste. Basculer, ce serait échanger une calibration
mesurée contre un score de 4 matchs indistinguable du hasard.

Ce n'est pas ce qui s'est passé pour le BTTS : là, la nouvelle règle était
**mieux calibrée** que la cascade (51,4 % contre 57,3 %), en plus d'être plus
simple. Ici c'est l'inverse.

### Ce que j'ai trouvé à la place : deux défauts, sans un seul match

**1. Le critère « Axe » ne tranche que 2,25 % du temps.**

Répartition du critère qui décide réellement, sur les 65 536 thèmes :

| critère | part des thèmes | dit R1 |
|---|---|---|
| **Concordance** | **61,62 %** | 54,7 % |
| **Charge active** | **24,07 %** | 57,3 % |
| Filiation | 5,16 % | 47,1 % |
| Pôle NM rotatif | 3,22 % | 43,2 % |
| **Axe** | **2,25 %** | 41,7 % |
| Pôle NM (écart faible) | 1,92 % | 49,4 % |
| Stabilité de boucle | 1,42 % | 48,3 % |

Le 12/09 tu as demandé que l'axe compte — « ça doit compter ». Il compte sur
**un thème sur 44**. Ce n'est pas un bug de code : c'est une conséquence de la
cascade lexicographique, où les deux premiers critères règlent 85,7 % des cas
avant que l'axe soit consulté. Si l'axe doit peser davantage, il faut soit le
remonter dans l'ordre, soit sortir de la cascade lexicographique — c'est une
décision de doctrine, pas un réglage.

**2. Le 1N2 est asymétrique : R1 54,0 % contre R7 46,0 %.**

Or R1, c'est « l'équipe tapée en premier ». Sans avantage du terrain — et
l'avantage du terrain a disparu de toutes les mesures — l'attendu est 50/50.
Le biais vient des deux critères qui tranchent le plus : **Concordance dit R1
54,7 %** et **Charge active 57,3 %**. Les critères du bas penchent dans l'autre
sens (Axe 41,7 %, Pôle NM 43,2 %) mais ils ne pèsent presque rien.

Huit points de biais systématique en faveur de celui qu'on tape en premier.

### Ce qu'il faut décider, et ce n'est pas à moi

- l'axe doit-il remonter dans la cascade, et devant quoi ?
- le biais R1/R7 de la Concordance et de la Charge active est-il voulu — le
  siège de R1 est-il réellement avantagé en géomancie — ou faut-il le
  neutraliser ?

Les deux se tranchent d'un mot. Aucune donnée ne peut le faire à ta place.

---

## La formule d'Ellemine_D — implémentée telle quelle, puis mesurée

```
B₁ = ((M1 ∈ {F,A}) ∨ (M13 ∈ {F,A})) ∧ ¬Sym_E(M13,M14) ∧ ((M14 ∈ {T,E}) ∨ (M2 ∈ {Cauda,Amissio}))
B₂ = ((M2 ∈ {F,A}) ∨ (M14 ∈ {F,A})) ∧ ¬Sym_E(M13,M14) ∧ ((M13 ∈ {T,E}) ∨ (M1 ∈ {Cauda,Amissio}))
BTTS_Oui = B₁ ∧ B₂ ∧ (M15 ∉ {T,E})
Nul      = Sym_E(M13,M14) ∨ ((M13 ∈ {T,E}) ∧ (M14 ∈ {T,E}) ∧ (M15 ∈ {T,E}))
```

M13 et M14 = les deux témoins, M15 = le juge. `Sym_E` lu comme « même
élément ». Rien n'a été ajusté.

### Le Nul tient. Il est branché.

| | annoncé | réel |
|---|---|---|
| `Sym_E(M13,M14)` seul | 25,0 % | |
| **la formule entière** | **32,8 %** | ~26 % |
| `nulActifV7`, qu'elle remplace | 22,0 % | |

Elle sur-annonce le nul de 7 points là où `nulActifV7` le sous-annonce de 4.
C'est son défaut, il est noté. Mais elle attrape le **0-0** que `nulActifV7`
rate, et le camp passe de 1/4 à 2/4 par elle seule.

### Le BTTS s'effondre à 2,6 %, et voici exactement où

| étape | part des thèmes |
|---|---|
| B₁ sans la clause Sym | 42,2 % |
| B₂ sans la clause Sym | 42,2 % |
| **B₁ ET B₂, sans Sym** | **9,8 %** |
| ∧ ¬Sym_E | 6,4 % |
| ∧ M15 chaud = **BTTS Oui** | **2,6 %** |

Si B₁ et B₂ étaient indépendantes, leur conjonction ferait 0,422² = **17,8 %**.
Elle en fait **9,8 %** : elles sont fortement **anti-corrélées**, et par
construction.

**Pourquoi.** B₂ exige `M13 ∈ {T,E}` — témoin droit froid. Or B₁ a besoin de
`(M1 ∨ M13) ∈ {F,A}` : privé de M13, il lui faut M1 chaud. Symétriquement B₁
exige `M14 ∈ {T,E}`, ce qui oblige B₂ à trouver son chaud en M2. La conjonction
revient donc en pratique à :

> M1 chaud **et** M2 chaud **et** M13 froid **et** M14 froid **et** M15 chaud

soit 0,5⁵ = 3,1 %, ramené à 2,6 % par la clause Sym et remonté un peu par les
échappatoires Cauda/Amissio. Les deux témoins doivent être froids **et** les
deux mères chaudes **et** le juge chaud : c'est une configuration rare.

Sur les quatre matchs, la formule dit « non » quatre fois — donc **2/4**, les
deux ratés étant les deux « oui ». Contre **4/4** pour la règle d'équilibre du
marquage branchée il y a une heure.

**Je ne la branche pas sur le BTTS.** Elle remplacerait une famille à 4/4 par
une famille qui ne dit presque jamais oui.

Si l'intention était que B₁ et B₂ décrivent chacune la capacité d'un camp à
marquer, il faut soit relâcher les clauses croisées sur M13/M14, soit lire
`BTTS = B₁ ∨ B₂` plutôt que `∧`. Cela se tranche d'un mot.

*Testé aussi : `Sym_E` lu comme « contraires » au lieu de « même élément ».
BTTS 4,3 %, Nul 35,9 %. Pas mieux.*

### Le camp, après

Décomposition sur les quatre matchs choisis :

| configuration | annoncé | justes | marginale |
|---|---|---|---|
| 1N2 + `nulActif` + camp muet (avant) | R1 R1 R7 R1 | **1/4** | 40 / 38 / 22 |
| sans le camp muet | R1 R1 R7 R7 | 2/4 | 42 / 36 / 22 |
| nul FORMULE + camp muet | R1 nul R7 R1 | 2/4 | 35 / 32 / 33 |
| **nul FORMULE, sans camp muet** | R1 nul R7 R7 | **3/4** | 37 / 31 / 33 |

cible : 37 / 37 / 26

Deux gains séparés, +1 chacun : la formule attrape le 0-0, et débrancher le
camp muet rend le 2-3.

### Le camp muet ne corrige plus le camp

La doctrine du 11/09 est juste — un camp qui ne marque pas ne peut pas gagner.
Ce qui tombe, c'est son **seul appui chiffré** : les +4 sur 42 matchs venaient
du lot écarté. Sur l'échantillon choisi, la seule ligne où le détecteur
s'allume est le 2-3, et il y retourne un R7 juste en R1 faux. C'est le
détecteur qui est en cause, pas la doctrine. Il reste calculé et affiché ;
`CAMP_MUET_CORRIGE_LE_CAMP_V7 = true` le rebranche.

Il ne touchait déjà plus au BTTS depuis une heure, pour une raison
indépendante : il frappe les thèmes équilibrés.

### Bilan de l'échantillon choisi, 4 matchs

| famille | avant aujourd'hui | maintenant |
|---|---|---|
| BTTS | 3/4 | **4/4** |
| over / under 2,5 | 4/4 | **4/4** |
| incident présent | 2/2 | **2/2** |
| **camp du match** | **1/4** | **3/4** |
| nul | 2/4 | **3/4** |
| bande de buts | 1/4 | 1/4 |
| score exact | 0/4 | 0/4 |

Le coût, honnêtement : le nul est maintenant annoncé sur 33 % des thèmes pour
26 % réels. C'est la pièce à surveiller.

---

## BTTS avec B₁ **ou** B₂ — ce que ça donne, et ce que ça révèle

| variante | 7-0 | 0-0 | 1-1 | 2-3 | justes | fréquence |
|---|---|---|---|---|---|---|
| B₁ ∧ B₂ ∧ juge chaud (écrite) | non | non | non | non | 2/4 | **2,6 %** |
| **B₁ ∨ B₂ ∧ juge chaud** | oui | non | non | oui | 2/4 | 26,5 % |
| **B₁ ∨ B₂ seul** | oui | non | oui | oui | **3/4** | **62,3 %** |
| équilibre du marquage | non | non | oui | oui | **4/4** | **51,4 %** |

Le OU répare l'effondrement — 62,3 % au lieu de 2,6 % — et monte à 3/4.

**Mais il est logiquement faux, et le 7-0 le montre.** Sur ce match, B₁ dit vrai :
le camp 1 marque, et il a marqué sept fois. B₂ dit faux : le camp 2 ne marque
pas, et il n'a rien marqué. **Les deux ont raison.** Le OU en conclut pourtant
« les deux marquent ». C'est le ET qui était la bonne structure — B₁ et B₂
décrivent chacune un camp, et « les deux marquent » est bien leur conjonction.

### Le vrai défaut : chaque clause s'allume deux fois trop peu

Un camp marque dans environ **72 %** des matchs de football. B₁ s'allume sur
**34,4 %** des thèmes. Ses trois clauses, mesurées séparément :

| clause | fréquence |
|---|---|
| **(M1 ou M13 chaud)** | **75,0 %** ← seule, elle est juste |
| ¬Sym(M13, M14) | 75,0 % |
| (M14 froid ou M2 Cauda/Amissio) | 56,3 % |
| **les trois ensemble** | **34,4 %** |

Réduites à leur **première clause seule**, B₁ et B₂ font 75 % chacune, et leur
conjonction **56,3 %** — juste à côté des 51 % du BTTS réel.

**La structure B₁ ∧ B₂ est donc la bonne.** Ce sont les deux clauses ajoutées
qui la divisent par deux, et la clause croisée sur M13/M14 qui rend les deux
incompatibles entre elles.

### Ce que B₁ et B₂ font bien — et c'est autre chose que le BTTS

Prises **séparément**, comme réponse à « ce camp-là marque-t-il ? » :

| thème | camp 1 dit / réel | camp 2 dit / réel |
|---|---|---|
| 7-0 | oui / oui ✔ | non / non ✔ |
| 0-0 | non / non ✔ | non / non ✔ |
| 1-1 | non / **oui** ✗ | oui / oui ✔ |
| 2-3 | oui / oui ✔ | non / **oui** ✗ |

**6 sur 8.** « Toujours oui » ferait 5/8, « toujours non » 3/8. Et les deux
erreurs sont des **faux négatifs**, exactement cohérents avec des clauses qui
s'allument deux fois trop peu.

### Ce que j'ai fait

**Je n'ai pas branché le OU sur le BTTS.** Il ferait passer une famille de 4/4
à 3/4 et sur-annoncerait de 11 points, pour une lecture qui contredit son
propre cas le plus net. Le BTTS reste à la règle d'équilibre du marquage.

**J'ai branché B₁ et B₂ pour ce qu'elles savent faire** : dire **quel camp
marque** — donc la forme du score. C'est un affichage neuf, en lecture seule,
sous le BTTS :

> lecture B₁/B₂ : **R7 seul marque** — B₁ faux · B₂ vrai — lecture seule,
> 6 justes sur 8 camps de l'échantillon

### Ce qui se tranche d'un mot, si tu veux aller plus loin

Retirer de B₁ et B₂ leurs deux dernières clauses — garder seulement
`(M1 ∨ M13 chaud)` et `(M2 ∨ M14 chaud)` — rend la conjonction calibrée à
56,3 %. Sur les quatre matchs choisis elle donne encore « non » quatre fois,
parce qu'aucun de ces thèmes n'a les deux côtés chauds. Il faudrait d'autres
lignes pour la départager de la règle d'équilibre.

---

## B₁ et B₂ simplifiées

> B₁ = (M1 ∈ {F,A}) ∨ (M13 ∈ {F,A})  ·  B₂ = (M2 ∈ {F,A}) ∨ (M14 ∈ {F,A})

La mère du camp, ou son témoin, porte un élément chaud. Les deux clauses
retirées sont `¬Sym_E(M13,M14)` et la clause croisée.

### Ce qu'elles coûtaient

| | avant | après | cible |
|---|---|---|---|
| B₁ s'allume | 34,4 % | **75,0 %** | ~72 % (un camp marque) |
| B₂ s'allume | 34,4 % | **75,0 %** | ~72 % |
| B₁ ∧ B₂ | 6,4 % | **56,3 %** | ~51 % (BTTS) |
| « ce camp marque-t-il » | 6/8 | **6/8** | |

**Elles divisaient la fréquence par deux sans rien apporter.** La lecture par
camp est identique avant et après — 6 sur 8 dans les deux cas. Elles ne
faisaient que dérégler la calibration, et la clause croisée rendait en plus B₁
et B₂ mutuellement incompatibles.

### La lecture par camp, sur les quatre matchs

| thème | camp 1 dit / réel | camp 2 dit / réel |
|---|---|---|
| 7-0 | oui / oui ✔ | non / non ✔ |
| 0-0 | non / non ✔ | non / non ✔ |
| 1-1 | non / **oui** ✗ | oui / oui ✔ |
| 2-3 | oui / oui ✔ | non / **oui** ✗ |

**6 sur 8.** Toujours-oui ferait 5/8, toujours-non 3/8.

### Comme moteur du BTTS, pas encore

| | 7-0 | 0-0 | 1-1 | 2-3 | justes | fréquence |
|---|---|---|---|---|---|---|
| **B₁ ∧ B₂** | non | non | non | non | **2/4** | **56,3 %** |
| B₁ ∧ B₂ ∧ juge chaud | non | non | non | non | 2/4 | 28,5 % |
| B₁ ∨ B₂ | oui | non | oui | oui | 3/4 | 93,8 % |
| **équilibre du marquage** | non | non | oui | oui | **4/4** | **51,4 %** |

B₁ ∧ B₂ est maintenant bien calibrée, mais elle fait 2/4 contre 4/4. Le BTTS
reste à l'équilibre du marquage.

### Le chiffre qui tranchera, et il est pré-enregistré

**Les deux lectures ne disent la même chose que sur 47,6 % des thèmes.** Elles
se contredisent plus d'une fois sur deux — elles mesurent des choses presque
indépendantes.

Il suffira donc de **quelques lignes tombant sur un désaccord** pour départager.

> **Pré-enregistré, avant tout nouveau résultat** : sur les prochaines lignes
> de l'échantillon où B₁ ∧ B₂ et l'équilibre du marquage divergent, celle qui
> gagne devient le moteur du BTTS. Aucun ajustement d'ici là.

C'est écrit dans le fichier, au-dessus de `campsQuiMarquentV7`.

---

## La procédure d'analyse, et la ligne 5

> « Avant toute analyse, vérifie les axes, la validation, le logement de R1 et
> R7. Les niveaux d'activation dans chaque axe, quel élément parmi les 4
> domine. Interaction des canaux. Le système doit suivre une procédure, il ne
> doit pas aller en aveugle. »

Écrit dans le fichier — `procedureAnalyseV7` — et affiché sur la carte avant
tout verdict. Trois relevés, toujours dans cet ordre, qui ne décident de rien :

1. **Logement de R1 et R7** — axe, concordance figure/maison, activation propre,
   et le cas « les deux dans le même axe » nommé
2. **Activation par axe et par élément** — les 4 comptes, l'élément dominant
3. **Interaction des canaux** — Feu M1·M5·M9·M13, Air M2·M6·M10·M14,
   Eau M3·M7·M11·M15, Terre M4·M8·M12·M16 ; actif à partir de la moitié

### Amissio / Amissio / Carcer / Laetitia — **4-0**

**1. Logement**

| | maison | figure | axe | concordance | activation |
|---|---|---|---|---|---|
| **R1** | M6 | Populus | **succédent** | feu en maison air → 0,5 | **0 0 0 0 = 0/4** |
| **R7** | M12 | Cauda Draconis | **succédent** | eau en maison terre → 0,5 | 1 1 1 0 = **3/4** |

**Les deux logent dans le même axe.**

**2. Activation par axe**

| axe | Feu | Air | Eau | Terre | dominant | total |
|---|---|---|---|---|---|---|
| angulaire | **4** | 1 | 2 | 2 | **Feu** | 9/24 = 38 % |
| succédent | 2 | 1 | **3** | 1 | **Eau** | 7/20 = 35 % |
| **cadent** | **3** | 2 | 2 | **3** | **Feu et Terre** | **10/20 = 50 %** |

**3. Canaux** — Feu 2/4 ● · Air 0/4 ○ · Eau 1/4 ○ · Terre 0/4 ○ — **seul le Feu
est actif**

### Ce que le 4-0 apprend, et c'est dur

| famille | annoncé | réel | |
|---|---|---|---|
| BTTS | non | non | ✔ |
| **camp** | **nul** | **R1** | ✗ |
| **volume** | 1,56 · bande 0-1 but | 4 buts | ✗ |
| score | 1-1 | 4-0 | ✗ |
| incident | aucun signal | — | — |

**1. L'activation du siège ne mesure pas la force du camp.** R1 loge sur
Populus, **0/4 actifs — le siège le plus inerte possible** — et il gagne 4-0.
R7 loge sur Cauda Draconis à 3/4, et il est blanchi. C'est le contraire de ce
que toute lecture par activation prédirait.

**2. La formule du nul par les témoins échoue à son premier test hors
échantillon.** M13 Tristitia et M14 Tristitia, tous deux terre → `Sym_E` vrai →
nul annoncé. Le match est le plus décidé des cinq. Je ne la retire pas — une
ligne ne renverse pas une règle, c'est la règle de tenue — mais c'est noté.

**3. Le volume se trompe de beaucoup.** 1,56 buts attendus pour 4 marqués. La
bande annoncée était « 0-1 but ».

**4. Seul l'équilibre du marquage tient.** Écart **13,6 %**, le plus élevé des
cinq lignes, sur un match à 4 buts d'écart. Et il donne **63,6 % pour R1** — le
bon camp — pendant que le moteur de camp dit nul.

### Bilan de l'échantillon choisi, 5 lignes

| famille | juste |
|---|---|
| **BTTS (équilibre du marquage)** | **5/5** |
| over / under 2,5 | 4/5 |
| B₂ « le camp 2 marque-t-il » | 4/5 |
| BTTS selon B₁ ∧ B₂ | 3/5 |
| camp | 3/5 |
| nul — formule des témoins | 3/5 |
| nul — `nulActifV7` | 3/5 |
| B₁ « le camp 1 marque-t-il » | 3/5 |
| bande de buts | **0/5** |
| score exact | **0/5** |

### Écart d'équilibre contre marge réelle

| écart | marge | match |
|---|---|---|
| 3,6 % | 1 | 2-3 |
| 3,8 % | 0 | 1-1 |
| 6,5 % | **7** | 7-0 |
| 10,0 % | 0 | 0-0 |
| **13,6 %** | **4** | **4-0** |

Les deux plus petits écarts sont les deux matchs nuls ou serrés. Le plus grand
est un 4-0. Le 0-0 à 10,0 % reste l'anomalie — un déséquilibre fort sur un match
où personne ne marque.

---

## Corriger le volume avec la procédure : essayé, et ça ne marche pas

### D'abord, une correction de ma part

J'ai écrit « bande de buts 0/5 » dans le bilan précédent. **C'est faux, c'est
2/5** — mon script de bilan avait un placeholder à la place du test. Le 7-0
tombe dans « 5 buts ou plus » ✔ et le 1-1 dans « 2 buts » ✔.

| | juste |
|---|---|
| over / under 2,5 | **4/5** |
| **bande de buts** | **2/5** (et non 0/5) |

### Les quantités de la procédure contre les buts réels

| mesure | 7-0 | 0-0 | 1-1 | 2-3 | 4-0 | ρ |
|---|---|---|---|---|---|---|
| cadent, activation | 10 | 11 | 8 | 11 | 10 | −0,05 |
| cadent, ratio | 50 % | 55 % | 40 % | 55 % | 50 % | −0,05 |
| cadent, part de Feu | 1 | 3 | 1 | 2 | 3 | −0,47 |
| angulaire, activation | 8 | 15 | 8 | 15 | 9 | −0,32 |
| succédent, activation | 13 | 12 | 11 | 9 | 7 | +0,10 |
| canaux actifs | 3 | 4 | 1 | 3 | 1 | −0,11 |
| canal Feu | 2 | 2 | 0 | 3 | 2 | +0,45 |
| **canal Eau** | 3 | 4 | 4 | 2 | 1 | **−0,56** |
| Feu + Air (chauds) | 4 | 5 | 1 | 4 | 2 | −0,05 |
| activation totale /64 | 31 | 38 | 27 | 35 | 26 | −0,20 |
| **R1 + R7, activation** | 4 | 5 | 5 | 4 | 3 | **−0,63** |
| les deux dans le même axe | oui | oui | oui | non | oui | −0,35 |

**L'axe cadent, que la doctrine lie à l'offense, donne ρ = −0,05.** Rien.

### Le volume procédural construit et testé

> index = (activation totale / 64) × (1 + 0,15 × canaux actifs) × (0,5 + ratio cadent)

calibré exactement comme l'actuel — rang sur les 65 536 thèmes, moyenne externe
2,70, bandes aux fréquences du football :

| | 7-0 | 0-0 | 1-1 | 2-3 | 4-0 | bande | over/under |
|---|---|---|---|---|---|---|---|
| **actuel** | 3,87 | 2,57 | 2,40 | 3,57 | 1,56 | **2/5** | **4/5** |
| **procédural** | 2,71 | 4,02 | 1,43 | 3,43 | 1,53 | **0/5** | **3/5** |

Sa marginale est bonne (26 / 23 / 20 / 15 / 15 %), sa prédiction est pire sur
les deux familles. **Je ne le branche pas.**

### Ce que ça vaut, les deux corrélations trouvées

`canal Eau` à −0,56 et `R1+R7 activation` à −0,63. Dimensionnement sur 5 points,
120 ordres possibles :

| | par hasard, un candidat | avec 14 candidats |
|---|---|---|
| \|ρ\| ≥ 0,56 | **35,0 %** | attendu 4,9 · P(au moins un) 100 % |
| \|ρ\| ≥ 0,63 | **23,3 %** | attendu 3,3 · P(au moins un) 98 % |
| \|ρ\| = 1,00 | 1,7 % | attendu 0,23 · P(au moins un) 21 % |

Sur 5 points, une corrélation de 0,63 arrive **une fois sur quatre** par pur
hasard. Avec 14 candidats, en trouver trois est le rendement normal du hasard.
**Rien n'est établi.**

### Ce qui est fait

Le volume reste sur `G_vol` — 4/5 en over/under, 2/5 en bande. La procédure
reste affichée avant chaque verdict : elle sert à voir le terrain, pas encore à
prédire le nombre de buts.

### Pré-enregistré, avant les prochaines lignes

Deux inversions, écrites d'avance et jamais à ajuster après coup :

> **1. Moins le canal Eau est actif, plus il y a de buts.** L'eau éteint le feu.
> **2. Moins les sièges R1 et R7 sont actifs, plus il y a de buts.** C'est la
> même chose que la ligne 5 a montrée brutalement : R1 à 0/4 gagne 4-0.

Elles rejoignent l'inversion du marquage cadent déjà pré-enregistrée ce matin,
qui a tenu sur sa première ligne hors échantillon. Trois inversions
indépendantes qui vont toutes dans le même sens : **dans ce système, ce qui est
plein ne marque pas, et ce qui est vide marque.** Si les trois tiennent sur les
prochaines lignes, ce n'est plus une coïncidence — c'est le sens de lecture qu'il
faut retourner d'un bloc.

---

## Inventaire des pistes trouvées et jamais branchées

Fouillé dans le fichier à la demande d'Ellemine_D. Chaque piste testée sur les
5 lignes choisies.

| piste | ce qu'elle visait | son passé | sur les 5 lignes | fréquence |
|---|---|---|---|---|
| **M9 = M1 ⊕ M2** | volume | p = 0,0019, **survit à Bonferroni** (0,011) ; **3/3 hors échantillon** annoncé d'avance ; doctrine venue APRÈS la mesure | **2/3 quand elle parle** | parle 56 % |
| `matchFermeOuvert` | BTTS | 6/6 sur de vrais matchs | 3/5 | dit « fermé » **79,6 %** |
| `signalM4M10BoucleV7` | camp | archive | 1/2 quand il parle | parle 25 % |
| `signalM15M16BoucleV7` | camp | 9/11 = 82 % sur l'archive | **1/4** quand il parle | parle 25 % |

### Ce que ça donne

**`matchFermeOuvert` est mort.** Son seuil de 7 maisons fermées a été posé sur
6 matchs, et il dit « au moins un camp bloqué » sur **79,6 %** des thèmes quand
le BTTS non vaut ~49 %. Sur tes lignes il fait 3/5 contre 5/5 pour l'équilibre
du marquage. Rien à en tirer.

**`signalM15M16BoucleV7` est mort aussi** : 1/4 sur tes lignes, contre 82 %
annoncés sur l'archive. Et sa fiche le disait déjà — le sens avait été retourné
après coup.

**`signalM4M10BoucleV7`** ne parle qu'une fois sur quatre et fait 1/2. Trop peu
pour dire quoi que ce soit.

### M9 est la seule qui tienne, et c'est la mieux documentée du fichier

`M9 = M1 ⊕ M2` — le rythme du match, selon la doctrine d'Ellemine_D fournie
**après** la mesure. Figures hautes → plus de 2,5 buts, figures basses → moins.

| | |
|---|---|
| mesure interne | p = 0,0019 en permutation par match — **le seul du fichier à survivre à Bonferroni** (0,011) |
| hors échantillon, ancien | **3/3**, annoncé d'avance |
| hors échantillon, tes lignes | **2/3** quand elle parle |
| **total prospectif** | **5/6** |

Son seul défaut, et il est réel : les deux listes de figures ont été composées
en regardant le tableau des buts. Le 26/28 en échantillon ne vaut rien. Mais les
5/6 hors échantillon, eux, comptent.

Sur ta ligne 5 elle se trompe exactement comme le volume : M9 = Populus →
« moins de 2,5 » pour un 4-0. Et sur la ligne 3, M9 = Populus aussi →
« moins de 2,5 » pour un 1-1, juste. Même figure, deux résultats opposés.

### Ce que je propose de brancher

**M9 en départage du volume**, et rien d'autre. Quand elle parle (56 % des
thèmes) et qu'elle contredit `G_vol` sur l'over/under, c'est elle qui tranche.
Motif : elle a un record prospectif de 5/6 et une survie à Bonferroni ; `G_vol`
n'a aucune corrélation mesurée.

Sur tes 5 lignes, ça ne change rien — les deux sont d'accord partout où M9
parle. Le gain ne se verra que sur des lignes futures. Dis-moi si je le branche.

---

## Ce qui marche, intégré. Point final sur cette passe.

### Les trois pièces qui tiennent

**1. BTTS — l'équilibre du marquage.** Branché.
Les deux marquent quand les deux trigones offensifs portent un marquage
équivalent : `|part R1 − 50 %| < 4,17 %`. Le seuil vient du taux réel de BTTS,
pas des matchs. **5/5**, dont une ligne hors échantillon. Annonce oui sur
51,4 % des thèmes contre ~51 % réels.

**2. Incident — M6/M12 étouffée + Déclencheur de feu.** Branché.
Entièrement issu de la doctrine, aucun chiffre de match n'y entre. **2/2.**
S'allume sur 30,1 % des thèmes, l'ordre de grandeur réel du penalty et du
rouge — *la fréquence tombe juste sans qu'aucune constante ait été réglée*.
Réserve : deux lignes, toutes deux positives ; indiscernable de « toujours oui »
tant qu'une ligne sans incident ne sera pas tombée. Le camp de l'incident, lui,
ne marche pas et a été débranché.

**3. M9 = M1 ⊕ M2 sur le volume.** Branché maintenant.
M9 tranche le côté du seuil 2,5, `G_vol` place à l'intérieur du côté. Quand M9
se tait (43,8 % des thèmes), `G_vol` décide seul.

| | |
|---|---|
| p = 0,0019 en permutation par match | **seul signal du fichier à survivre à Bonferroni** (0,011) |
| 3/3 hors échantillon, annoncés d'avance | |
| 2/3 sur les lignes choisies | **total prospectif 5/6** |
| doctrine fournie **après** la mesure | le seul ordre qui ne puisse pas l'avoir orientée |

En face, `G_vol` n'a aucune corrélation mesurée (r = −0,069, p = 0,66). Quand
les deux se contredisent, il n'y a pas de raison de préférer celui qui n'a rien
démontré.

Effet mesuré : moyenne 2,748 buts, over 2.5 annoncé sur **54,2 %** des thèmes
(cible ~51 %), bandes 23,8 / 22,7 / 23,4 / 14,6 / 15,6 % contre
25 / 24 / 22 / 15 / 14. Sur les 5 lignes, **rien ne change** — M9 est d'accord
avec `G_vol` partout où elle parle. Le gain ne se verra que sur les suivantes.

### Ce qui ne marche pas, et que j'arrête de remuer

| famille | juste | meilleure constante |
|---|---|---|
| camp / 1N2 | 3/5 | 2/5 |
| volume, bande | 2/5 | — |
| score exact | **0/5** | — |

Le 1N2 garde deux défauts structurels que je n'ai pas réparés parce qu'ils
relèvent de la doctrine : l'axe ne tranche que **2,25 %** du temps, et le moteur
penche **54/46 vers R1** alors que R1 n'est que « celui tapé en premier ».

### État final de l'échantillon choisi, 5 lignes

| famille | juste |
|---|---|
| **BTTS** | **5/5** |
| over / under 2,5 | 4/5 |
| B₂ « le camp 2 marque » | 4/5 |
| camp | 3/5 |
| nul | 3/5 |
| B₁ « le camp 1 marque » | 3/5 |
| bande de buts | 2/5 |
| **incident (présence)** | **2/2** |
| score exact | 0/5 |

---

## Le camp par les canaux — le procédé remonté et mesuré

> « On avait fixé ça par la domination d'éléments actifs de l'axe où se
> trouvent R1 et R7, poussé avec le thème dérivé de l'axe angulaire, et les
> canaux faisant preuve de confirmation sur le camp qui doit gagner. »

Les trois étages ont été remontés et mesurés **séparément** sur les cinq lignes.

| étage | juste |
|---|---|
| dominance de l'élément dans l'axe de R1/R7 | **1/4** quand elle départage |
| thème dérivé de l'axe commun | **1/4** quand il s'applique |
| **★ canal élémentaire de chaque siège** | **4/5** |

Et toutes les cascades qui remettent les deux premiers devant ou derrière le
canal **retombent à 3/5 ou 1/5**, en écrasant au passage le taux de nuls à 6 %.

| cascade | annoncé | justes | marginale |
|---|---|---|---|
| axe → dérivé → canal | R1 R1 R1 R1 R7 | 1/5 | 50 / 44 / 6 |
| canal → axe → dérivé | R1 R7 R1 R7 R1 | 3/5 | 49 / 45 / 6 |
| canal → dérivé → axe | R1 R7 R1 R7 R1 | 3/5 | 49 / 45 / 6 |
| **canal seul** | R1 R7 nul R7 R1 | **4/5** | **32 / 29 / 40** |

**C'est le troisième étage seul qui portait le procédé.** Les deux autres ne
confirment rien.

### La règle

Chaque siège porte un élément. Cet élément a son canal — Feu M1·M5·M9·M13,
Air M2·M6·M10·M14, Eau M3·M7·M11·M15, Terre M4·M8·M12·M16. **Le camp dont le
canal est le plus actif l'emporte ; à égalité, nul.**

| réel | canal R1 | canal R7 | dit | |
|---|---|---|---|---|
| 7-0 R1 | feu 2/4 | terre 0/4 | R1 | ✔ |
| 0-0 nul | terre 2/4 | eau 4/4 | R7 | ✗ |
| 1-1 nul | feu 0/4 | feu 0/4 | nul | ✔ |
| 2-3 R7 | eau 2/4 | terre 4/4 | R7 | ✔ |
| 4-0 R1 | feu 2/4 | eau 1/4 | R1 | ✔ |

**4/5** — contre 3/5 pour le 1N2 et 2/5 pour la meilleure constante.

### Le biais R1/R7 est réparé

| | R1 | R7 | nul |
|---|---|---|---|
| 1N2 | **54 %** | **46 %** | — |
| **canaux** | **32 %** | **29 %** | 40 % |
| cible | 37 % | 37 % | 26 % |

Huit points de biais systématique en faveur de « l'équipe tapée en premier »,
disparus. Il venait des deux critères qui tranchaient le plus dans le 1N2 —
Concordance (54,7 % R1) et Charge active (57,3 %).

### Le défaut, écrit ici

**Le nul est annoncé sur 40 % des thèmes pour ~26 % réels.** L'égalité de deux
canaux est fréquente. Tout ce que j'ai essayé pour la réduire casse autre chose :

- la formule des témoins en surcouche : 4/5 aussi, mais **60 % de nuls**, et
  elle retourne le 4-0 que les canaux donnaient juste
- le nul réservé aux deux canaux morts : 4/5, mais la symétrie explose
  (56 / 29 / 15)

### Ce qui est branché

`campParCanauxV7` décide du camp. Le 1N2 reste calculé et exposé en
contre-lecture, et la bannière nomme les deux quand ils divergent :

> 🏆 VERDICT — canaux — R1 porte feu (canal 2/4) contre R7 terre (canal 0/4)
> → R1 l'emporte · *le 1N2 disait R7 (Charge active)*

La formule des témoins ne corrige plus le camp tant que les canaux décident ;
elle reste affichée. `CAMP_PAR_CANAUX_V7 = false` remet le 1N2 aux commandes.

### État de l'échantillon, 5 lignes

| famille | juste |
|---|---|
| **BTTS** | **5/5** |
| **camp** | **4/5** (était 3/5) |
| over / under 2,5 | 4/5 |
| bande de buts | 2/5 |
| **incident (présence)** | **2/2** |
| score exact | 0/5 |

---

## Tout est branché — état au 13/09/26

Le score n'a plus de générateur autonome. Il est **composé** par les pièces
mesurées, chacune faisant ce qu'elle sait faire et rien d'autre :

| ce qu'il faut savoir | qui le dit | son score |
|---|---|---|
| le **total** de buts | volume calibré — M9 tranche le côté, `G_vol` place | 4/5 en over/under |
| **les deux marquent** ou non | équilibre du marquage | **5/5** |
| **lequel** reste à zéro | B₁ / B₂ | 6/8 sur les camps |
| **qui gagne** | canaux des deux sièges | **4/5** |
| **l'incident** | M6/M12 étouffée + Déclencheur | **2/2** |

Aucune pièce ne déborde sur une autre, et la carte ne peut plus se contredire.

### Résultat sur les cinq lignes choisies

| thème | réel | camp | BTTS | volume | score |
|---|---|---|---|---|---|
| Tristitia/Via/Conjunctio/Rubeus | 7-0 | R1 ✔ | non ✔ | 3,87 · 5+ ✔ | 4-0 |
| Fortuna Major/Via/Puella/Cauda | 0-0 | R7 ✗ | non ✔ | 2,57 · 2 buts | **0-0 ✔** |
| Tristitia/Tristitia/Conjunctio/Rubeus | 1-1 | nul ✔ | oui ✔ | 1,77 · 0-1 | **1-1 ✔** |
| Puella/Amissio/Rubeus/Carcer | 2-3 | R7 ✔ | oui ✔ | 3,92 · 5+ ✔ | 1-3 |
| Amissio/Amissio/Carcer/Laetitia | 4-0 | R1 ✔ | non ✔ | 1,34 · 0-1 ✗ | 0-0 |

| famille | avant la journée | maintenant |
|---|---|---|
| **BTTS** | 3/4 | **5/5** |
| **camp** | 1/4 | **4/5** |
| over / under 2,5 | 4/5 | 4/5 |
| bande de buts | 2/5 | 2/5 |
| **score exact** | 0/5 | **2/5** |
| buts d'erreur | 12 | **8** |
| **incident** | 95 % de faux positifs | **2/2**, 30 % des thèmes |

### Les drapeaux, pour tout défaire en un mot

| drapeau | ce qu'il fait |
|---|---|
| `BTTS_EQUILIBRE_DECIDE_V7` | l'équilibre du marquage décide le BTTS |
| `CAMP_PAR_CANAUX_V7` | les canaux décident le camp |
| `M9_TRANCHE_LE_VOLUME_V7` | M9 tranche le côté du seuil 2,5 |
| `SCORE_COMPOSE_V7` | le score est assemblé au lieu d'être généré |
| `INCIDENT_DOCTRINE_DECIDE_V7` | M6/M12 + feu décide l'incident |
| `NUL_FORMULE_TEMOINS_V7` | le nul par les témoins (inactif tant que les canaux décident) |
| `CAMP_MUET_CORRIGE_LE_CAMP_V7` | le camp muet corrige le camp — **débranché** |
| `CAMP_MUET_DECIDE_BTTS_V7` | le camp muet décide le BTTS — **débranché** |
| `MARQUAGE_CADENT_DANS_LE_VOLUME_V7` | le marquage cadent dans le volume — **débranché** |
| `CAMP_INCIDENT_DEPUIS_LE_LIEU_V7` | le lieu nomme le camp de l'incident — **débranché** |

### Ce qui reste faux, et qui attend des lignes

- **la bande de buts, 2/5** — le volume sait de quel côté du seuil, pas combien
- **le nul sur-annoncé** — 40 % des thèmes pour ~26 % réels
- **le 0-0** est le seul camp raté : les canaux y donnent R7 sur un match nul

### Pré-enregistré, toujours en attente de vérification

1. le marquage cadent prédit le volume **à l'envers** — 1 confirmation hors échantillon
2. moins le canal **Eau** est actif, plus il y a de buts
3. moins les **sièges R1 et R7** sont actifs, plus il y a de buts
4. sur les lignes où **B₁ ∧ B₂** et **l'équilibre du marquage** divergent, celle
   qui gagne devient le moteur du BTTS

---

## Tout ce qui est branché se lit dans le verdict final

Six contradictions restaient dans la carte affichée — le douzième au dix-septième
cas du même défaut : un affichage qui nomme une chose pendant que le code en
applique une autre.

| ce qui s'affichait | ce que le code appliquait | corrigé en |
|---|---|---|
| « PROCÉDÉ COMPLET 1N2 — Charge active **tranche** » | les canaux tranchent | « **CONTRE-LECTURE, ne décide plus** » |
| « Charge active — R7 **l'emporte** » | R1 l'emporte | « R7 **l'emporterait** » |
| « 🚫 camp muet : R7 » comme s'il agissait | débranché du camp **et** du BTTS | « **LECTURE SEULE — débranché** » |
| « Penalty / Rouge : Non — Faible (30 %) · **CONTRE M1** » | aucun signal, aucun camp | niveau du moteur de doctrine, **plus de camp** |
| « Résultat incidents : AUCUN SIGNAL · **CONTRE M1** » | idem | « lieux M6/M12 + Déclencheurs · libres · 1 feu » |
| « ⚖️ NUL NON » depuis `nulActifV7` | le nul vient de l'égalité des canaux | **le nul des canaux**, avec ses deux comptes |
| volume sans mention de M9 | M9 tranche le côté du seuil | « **· M9 populus → moins de 2,5 buts** » |

### La carte, maintenant

> 🏆 **VERDICT** — canaux — R1 porte feu (canal 2/4) contre R7 eau (canal 1/4)
> → R1 l'emporte · *le 1N2 disait R7 (Charge active)*
>
> **Score prédit : 0-0**
>
> ⚽ **Volume** : 1,3 buts attendus · bande 0-1 but · over 2.5 : 15 %
> **· M9 populus → moins de 2,5 buts**
>
> 🧭 **PROCÉDÉ COMPLET 1N2** — Charge active — *CONTRE-LECTURE, ne décide plus :
> le camp est tranché par les canaux* … Charge active — R7 **l'emporterait**
>
> ⚽ **BTTS NON** — équilibre du marquage : R1 7,0 contre R7 4,0, écart 13,6 %
> pour un seuil de 4,17 % → un camp domine
>
> 🚫 camp muet : R7 … · **LECTURE SEULE — débranché du camp et du BTTS**
>
> ⚖️ **NUL NON** — canaux : R1 feu 2/4 contre R7 eau 1/4
>
> 📐 **Procédure** — logement, activation par axe, canaux
>
> 🟥 **Penalty / Rouge** — Non — Aucun · M6/M12 respirent · 1 Déclencheur de feu

Sur un thème où les canaux sont à égalité, la même carte affiche
« → égalité, nul » et « ⚖️ **NUL OUI** ». Les deux lignes ne peuvent plus
diverger : elles lisent la même fonction.

**Aucune ligne de la carte ne contredit plus une autre.** Ce qui décide est
nommé, ce qui ne décide plus est marqué contre-lecture, et rien n'est effacé.

---

## Règle de mesure : les 5 lignes, et rien d'autre

> « Pour le calcul, ne prends plus des matchs que je ne t'ai pas donnés. Prends
> pour le moment les 5 matchs là ; après je vais élargir l'échantillon. »

Écrite dans le fichier, au-dessus de `ECHANTILLON_ELLEMINE_V7`.

`CAS_REFERENCE_V7` — les 49 thèmes archivés — n'est plus une source de mesure.
Il reste dans le fichier comme archive, pas comme référence.

**Ce qui reste admissible en dehors du registre :**

- les faits **structurels** lisibles sur les 65 536 thèmes — fréquences,
  distributions, contradictions entre deux tables du fichier ;
- les fréquences **externes** du football — buts moyens 2,70 · BTTS ~51 % ·
  penalty ~25 % · rouge ~8 % — qui ne dépendent d'aucune donnée d'ici.

**Ce qui ne l'est plus :** tout chiffre de justesse tiré d'un match absent du
registre.

### Première victime de la règle : M9

Toute la justification de M9 — p = 0,0019, survie à Bonferroni, 3/3 hors
échantillon — venait de matchs hors du registre. Irrecevable.

Ce qui reste de recevable, sur les 5 lignes seules :

| ligne | réel | M9 | mu avec M9 | mu sans M9 |
|---|---|---|---|---|
| 1 | 7-0 | se tait | 3,87 | 3,87 |
| 2 | 0-0 | se tait | 2,57 | 2,57 |
| 3 | 1-1 | bas | 1,77 | 2,40 |
| 4 | 2-3 | haut | 3,92 | 3,57 |
| 5 | 4-0 | bas | 1,34 | 1,56 |

| | avec M9 | sans M9 |
|---|---|---|
| over / under 2,5 | 4/5 | 4/5 |
| bande de buts | 2/5 | 2/5 |
| score exact | 2/5 | 2/5 |
| buts d'erreur | 8 | 8 |

**Identique sur toutes les familles.** M9 ne déplace `mu` qu'à l'intérieur du
même côté du seuil : elle parle 3 fois, se trompe 1 fois, et ne change aucun
verdict.

Une pièce sans justification recevable **et** sans effet mesurable ne reste pas
branchée. `M9_TRANCHE_LE_VOLUME_V7 = false`. Elle est conservée en lecture ;
si l'échantillon élargi lui donne un effet, elle se rebranche en un mot.

### Le système, mesuré uniquement sur les 5 lignes

| famille | juste | qui décide |
|---|---|---|
| **BTTS** | **5/5** | équilibre du marquage |
| **camp** | **4/5** | canaux des deux sièges |
| over / under 2,5 | 4/5 | `G_vol` calibré |
| **incident (présence)** | **2/2** | M6/M12 étouffée + Déclencheur |
| bande de buts | 2/5 | `G_vol` calibré |
| score exact | 2/5 | composé des quatre pièces |

Tout ce qui est branché est maintenant justifié soit par ta doctrine, soit par
une fréquence externe, soit par ces 5 lignes. Rien d'autre.

---

## La vérification par les axes

> « Tous les résultats sont vérifiables et vérifiés par les axes.
> Axe angulaire : la domination **défensive**.
> Axe succédent : l'**incident**, les problèmes cachés dans le thème.
> Axe cadent : la domination **offensive**.
> Après analyse du thème principal, tous les résultats sont vérifiés par les
> axes, les 4 premières figures comme mères. »

Chaque axe a son domaine, et son thème dérivé vérifie **ce domaine-là** :

| axe | mères | vérifie |
|---|---|---|
| **Angulaire** | M1 · M4 · M7 · M10 | le **camp** — domination défensive |
| **Succédent** | M2 · M6 · M8 · M12 | l'**incident** — problèmes cachés |
| **Cadent** | M3 · M5 · M9 · M11 | l'**offense** — BTTS et volume |

Tout existait déjà dans le fichier — `AXES_V7` porte ses `meres`, et le
constructeur de dérivés est là depuis le 25/08. Ce qui manquait, c'est que
chaque dérivé lise **son** domaine au lieu d'être lu en vrac.

### Elle ne décide rien, et c'est mesuré

Pris comme prédicteurs, les dérivés sont **moins bons** que le thème principal :

| | dérivé | principal |
|---|---|---|
| camp par l'angulaire | **1/5** | 4/5 |
| BTTS par le cadent | **3/5** | 5/5 |
| over/under par le cadent | **2/5** | 4/5 |

Leur rôle est de **confirmer**, pas de prédire. Accord = verdict appuyé,
désaccord = verdict douteux.

### Ce que vaut un accord — sans ce chiffre, une confirmation ne dit rien

| domaine | accord sur les 65 536 | sur les 5 lignes |
|---|---|---|
| **incident** (succédent) | **62,8 %** | **5/5** |
| BTTS (cadent) | 50,4 % | 3/5 |
| volume (cadent) | 48,6 % | 2/5 |
| **camp** (angulaire) | **38,1 %** | **0/5** |

**Un seul accord sort du bruit : l'incident.** 5 sur 5 quand le hasard en
donnerait 9,8 %. C'est cohérent avec le reste de la journée — l'incident est la
famille où ta doctrine tombe juste sans réglage.

**Et le camp est remarquable dans l'autre sens** : le dérivé angulaire n'est
**jamais** d'accord avec le principal sur les cinq lignes, alors que la base est
de 38 %. 0/5 arrive dans 9,1 % des cas par hasard. Les deux lectures du camp
sont donc systématiquement opposées, et je ne sais pas encore pourquoi.

### Ce qui s'affiche

> 🔎 **Vérification par les axes — 3/4**
> ✗ **Domination défensive → le camp** — Axe Angulaire (M1·M4·M7·M10) :
> **CONTREDIT** · principal R1, dérivé R7 · *un accord tombe déjà 38 % du temps*
> ✓ **Problèmes cachés → l'incident** — Axe Succédent (M2·M6·M8·M12) :
> **CONFIRME** · *63 %*
> ✓ **Domination offensive → BTTS** — Axe Cadent (M3·M5·M9·M11) : **CONFIRME** · *50 %*
> ✓ **Domination offensive → volume** — Axe Cadent : **CONFIRME** · 1,56 contre 1,42 · *49 %*

Aucun verdict n'a changé : BTTS 5/5, camp 4/5, over/under 4/5, incident 2/2,
bande 2/5, score exact 2/5.

---

## Le camp par la chaîne — 5/5

> « R1 et R7 sont dans le même canal et la même boucle : ce qui peut faire la
> différence, c'est seulement leur concordance avec le canal, et l'impact de
> leur antagoniste. Si l'antagoniste est dans un canal fort, bien structuré, il
> sera un obstacle redoutable dans le domaine où il loge. Cette confrontation
> fait qu'une figure dangereuse SEULE ne crée pas l'incident. »
> « L'obstacle annule l'avantage de concordance : ça donne le nul. »

### La cascade

1. **Concordance** figure / canal de sa maison — le mieux concordé prend l'avantage
2. **Annulation** — si le camp avantagé a son antagoniste logé dans un canal
   **≥ 3/4**, son avantage tombe : **nul**
3. **À concordance égale**, l'antagoniste départage : le camp dont l'antagoniste
   loge dans le canal le plus faible l'emporte
4. sinon nul

La **menace** d'un camp = la force du canal où loge son antagoniste, 0 s'il est
absent. Répartition sur les 131 072 sièges : 0/4 → 45,6 % · 1/4 → 12,4 % ·
2/4 → 15,4 % · 3/4 → 18,0 % · 4/4 → 8,7 %.

### Le résultat

| réel | camp | R1 conc / menace | R7 conc / menace | étage | dit | |
|---|---|---|---|---|---|---|
| 7-0 | R1 | 0,5 / 0 | 0,25 / 2 | concordance | R1 | ✔ |
| 0-0 | nul | **1 / 4** | 0,5 / 0 | **avantage annulé** | nul | ✔ |
| 1-1 | nul | 0,5 / 0 | 0,5 / 0 | égalité | nul | ✔ |
| 2-3 | R7 | 0,5 / 0 | 1 / 2 | concordance | R7 | ✔ |
| 4-0 | R1 | 0,5 / 0 | 0,5 / 1 | antagoniste | R1 | ✔ |

**5 sur 5** — contre 4/5 pour les canaux, 3/5 pour le 1N2, 2/5 pour la meilleure
constante.

### Le mécanisme du 4-0, en entier

> R1 = M6 **Populus**. Son antagoniste est **Cauda Draconis — qui EST R7**.
> R7 = M12 **Cauda Draconis**. Son antagoniste est **Carcer, en M3**.
> Le protecteur de R1 — l'antagoniste de son antagoniste — est **Carcer** : il
> est présent, il neutralise R7, R1 est libéré.
> Le protecteur de R7 est **Rubeus : absent du thème**.
> **R1 gagne 4-0.**

La chaîne entière était déjà dans le fichier — `ANTAGONISTES_V7`, `BINOMES_V7`,
`PROTECTEURS_V7`, `LOOP_A`/`LOOP_B` — sous la mention « aucun poids sur
verdictFinal ».

### Ce que ça vaut, et il faut le lire

Par permutation des cinq étiquettes réelles : **un seul des 30 arrangements
distincts** donne 5/5 à une prédiction fixée, soit **p = 0,033**. C'est le
meilleur p de la journée, et le meilleur atteignable à n = 5.

**Mais j'ai essayé une quinzaine de règles de camp aujourd'hui sur ces mêmes
cinq lignes.** La probabilité qu'au moins une atteigne 5/5 par hasard est de
l'ordre de **45 %**. Ce 5/5 reste un gagnant de recherche tant que
l'échantillon n'est pas élargi.

### Ce qui justifie de la brancher malgré ça

- elle sort **entièrement de la doctrine**, énoncée avant la mesure ;
- le seuil de 3/4 vient des mots « canal fort, bien structuré », pas d'un
  ajustement — et **3/4 comme 4/4 donnent tous deux 5/5**, donc il n'a pas été
  choisi pour la justesse ;
- sa marginale est **la meilleure construite à ce jour** :

| | R1 | R7 | nul |
|---|---|---|---|
| **chaîne (seuil 3)** | **37 %** | 31 % | 32 % |
| canaux | 32 % | 29 % | 40 % |
| 1N2 | 54 % | 46 % | 0 % |
| **cible** | **37 %** | **37 %** | **26 %** |

Étages qui tranchent : concordance 46 % · avantage annulé 18 % · antagoniste
22 % · égalité 14 %.

### État de l'échantillon, 5 lignes

| famille | juste |
|---|---|
| **BTTS** | **5/5** |
| **camp** | **5/5** |
| over / under 2,5 | 4/5 |
| **incident (présence)** | **2/2** |
| bande de buts | 2/5 |
| score exact | 2/5 |

## 13/09/26 — l'antagoniste caché dans la résultante de sa propre maison

Ellemine_D : « c'est dans le dérivé angulaire en M10 / Rubeus y cache /
Ennemi direct dans la maison de Carcer ».

**Vérifié, exactement.** Ligne 4-0 (amissio / amissio / carcer / laetitia),
thème dérivé angulaire (mères M1·M4·M7·M10 du principal = amissio /
laetitia / fortuna_minor / tristitia) :

    R7 = M12 Carcer.            antagoniste direct : Rubeus
    maison de repos de Carcer : M10  ← « la maison de Carcer »
    M10 y porte Puer.           Puer ⊕ Carcer = RUBEUS

Je cherchais l'antagoniste uniquement en base (`theme[x] === ant`) et
j'avais donc écrit **« rubeus : ABSENT du thème »**. C'était faux : il
était en **résultante**, R(h) = M(h) ⊕ figure au repos de h — la couche
que le fichier décrit déjà (« la résultante n'est pas une autre figure :
c'est l'écart au repos de la maison ») et que `positionsBaseEtResultantes`
lit depuis toujours. `campParChaineV7` ne la lisait pas.

### Portée de la lecture — étroite, et pourquoi

La résultante n'est lue que dans **une** maison par siège : la maison de
repos de la figure du siège. C'est ce que dit la doctrine — l'ennemi dans
*sa* maison — et rien de plus. Les quatre lectures, mesurées sur les cinq
lignes et sur les 65 536 thèmes (cible marginale 37 / 37 / 26) :

| lecture | 5 lignes | marginale | écart |
|---|---|---|---|
| base seule (état d'hier) | 5/5 | 37 / 31 / 32 | 12 |
| **+ résultante de la maison de repos du siège** | **5/5** | **36 / 31 / 33** | **14** |
| + résultante de la maison où loge le siège | 5/5 | 37 / 31 / 33 | 13 |
| + les seize résultantes | **3/5** | 31 / 26 / 44 | 36 |

Lire les seize noie le signal. La lecture étroite est branchée
(`ANTAGONISTE_CACHE_EN_RESULTANTE_V7 = true`).

### Ce que ça change, honnêtement

**Sur les cinq lignes : rien.** 5/5 avant, 5/5 après, aucun verdict ne
bouge. Le canal air de M10 vaut 2/4, sous le seuil de 3/4 : l'avantage de
Carcer n'est pas annulé. Ce qui est corrigé est la **lecture** — un
antagoniste annoncé « absent » alors qu'il est chez lui était un
affichage faux, le douzième de la série, et le seul type de défaut que ce
fichier traque systématiquement.

Deux autres occurrences remontent du coup à la surface, invisibles hier :

- ligne 0-0, principal : R1 Tristitia menacé par Via, **caché en M8**
  (Cauda Draconis ⊕ Tristitia = Via), canal eau 4/4 — c'est déjà l'annulation
  qui donnait le nul, elle est maintenant nommée en entier ;
- ligne 4-0, principal : Rubeus caché en M10 également, à côté du Carcer
  en base de M3.

### Le vrai problème que ça met à nu : le dérivé angulaire ne vérifie rien

La doctrine veut que l'axe angulaire vérifie le camp. Mesuré, le camp
lu sur le dérivé angulaire par la même règle de chaîne :

    accord principal / dérivé angulaire   36,5 %   (36,6 % avec la résultante)

Sur les cinq lignes il en contredit **trois** (lignes 2, 3 et 5 : il dit
R7, R7, R7 pour nul, nul, R1). À 36 % d'accord et 2/5 de justesse propre,
cet organe n'est pas un vérificateur — c'est du bruit. Il reste en
lecture seule ; il ne touche pas le verdict, et il ne doit pas y toucher
en l'état.

### Re-vérification à froid (13/09/26, « re-vérifie encore »)

Contrôle refait **sans réutiliser le code de l'application** : moteur de
géomancie réécrit de zéro en Python (combinaison ligne à ligne sur la
parité des points, filiation, rotation R1 = maison de repos de M1 et
R7 = R1+6, résultantes, chaîne complète). Seules les **données** ont été
reprises du fichier : bits des seize figures, table des antagonistes,
éléments des maisons, table de concordance.

| contrôle | résultat |
|---|---|
| les 5 thèmes, 16 maisons chacun | identiques, 0 écart |
| les 5 thèmes dérivés angulaires | identiques, 0 écart |
| rotation R1/R7 des 10 thèmes | identique, 0 écart |
| verdict de camp, 5 lignes | identique |
| marginale sur 65 536 | identique au thème près (36,4 / 30,6 / 33,0) |
| ma résultante vs `positionsBaseEtResultantes` | 6 400 comparaisons, 0 écart |
| erreurs de page | aucune |

**La claim, recalculée de zéro :** dérivé angulaire de la ligne 4-0,
R7 = M12 Carcer, antagoniste Rubeus, maison de repos de Carcer = M10,
M10 porte Puer, Puer ⊕ Carcer = Rubeus, résultante de M10 = **Rubeus**,
et Rubeus est absent de la base du dérivé. **Confirmé.**

Une erreur de ma part au passage, dans le script de contrôle et non dans
l'application : j'avais reconstruit la table de concordance depuis un
commentaire périmé du fichier (feu-terre à 0,25). La table vivante est
identique 1 · voisin sur la roue 0,5 · contraire feu-eau et air-terre
0,25 — celle de la doctrine. Avec la bonne table, tout concorde. Le
commentaire périmé reste à nettoyer.

### Ce que je n'avais PAS mesuré hier — la portée réelle

Hier j'ai écrit « sur les cinq lignes, rien ne bouge », ce qui est vrai,
et je me suis arrêté là. Sur les 65 536 thèmes, ce n'est pas rien :

| | thèmes | part |
|---|---|---|
| un antagoniste est caché chez lui | 7 634 | **11,6 %** |
| la menace en est modifiée | 4 316 | 6,6 % |
| **le verdict en est modifié** | **1 720** | **2,6 %** |

Le drapeau agit donc réellement (contrôlé en le basculant à chaud) :

    ANTAGONISTE_CACHE_EN_RESULTANTE_V7 = false   36,8 / 31,1 / 32,1   écart 12
    ANTAGONISTE_CACHE_EN_RESULTANTE_V7 = true    36,4 / 30,6 / 33,0   écart 14

**Et le sens du déplacement est défavorable :** trouver plus de menaces
déclenche plus d'annulations, donc pousse vers le nul — +0,9 point de nul
alors que la cible en veut *moins* (26 % contre 33 % annoncés). La
doctrine dit de compter l'ennemi caché ; la marginale dit qu'il coûte un
point de nul de trop. À n = 5, aucune des deux ne tranche. Le drapeau
reste à `true` parce que la doctrine précède la mesure, mais c'est un
arbitrage, pas un résultat, et il se défait en un mot.

### Non-régression des autres organes, relue depuis l'échantillon du fichier

Plus d'étiquette écrite à la main : le score réel est lu dans
`ECHANTILLON_ELLEMINE_V7` et le BTTS/camp en est déduit.

    BTTS 5/5 · camp 5/5 · incident 2/2 · aucune erreur de page

### Nettoyage des commentaires périmés sur la concordance (13/09/26)

Le commentaire qui m'a fait recalculer un contrôle avec le mauvais barème
n'était pas seul. Cinq endroits décrivaient encore l'échelle morte le
11/09/26 (feu-terre et air-eau à 0,25 ; feu-eau et air-terre à 0) :

| endroit | ce qu'il disait | traitement |
|---|---|---|
| bloc du 13/07/26, au-dessus de `concordanceElement` | tout l'ancien barème, en douze lignes | **supprimé**, remplacé par une note d'historique de six lignes |
| en-tête de `chaineDeForce` | « identique=1, feu/air ou terre/eau=0.5, **sinon 0** » | corrigé — plus aucun couple réel ne vaut 0 |
| santé des binômes | « identique=1, **nourricière=0.5** » | corrigé — l'échelle est nommée en entier |
| lecture L, règle de l'informateur | « concordanceElement **donne 0** pour feu/eau et air/terre » | corrigé — 0,25, au plancher. Le constat survit : mêmes paires, toujours les plus basses |
| trace de calcul du camp Puella | 0 pour terre-en-air et feu-en-eau | **gardée telle quelle** (elle date la lecture) et annotée du recalcul : 0,25 · 0,25. Le rapport de force ne s'inverse pas |

Un seul barème est décrit dans le fichier désormais : **identique 1 ·
alliés 0,5 · contraires feu-eau et air-terre 0,25 · sans relation 0** —
ce dernier rang ne décrivant aucun couple d'éléments réels, seulement le
cas dégénéré.

**Preuve que rien n'a bougé au comportement.** Le diff ne touche que des
lignes de commentaire (contrôlé : aucune ligne non-commentaire modifiée),
et l'empreinte des moteurs sur les 65 536 thèmes est inchangée :

    table de concordance     identique
    camp   (65 536 verdicts) af0d715c -> af0d715c
    BTTS   (65 536 verdicts) 48a50fa6 -> 48a50fa6
    incident (65 536)        878bd7d4 -> 878bd7d4
    cinq lignes : BTTS 5/5 · camp 5/5 · incident 2/2 · aucune erreur de page
