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

## Les incidents se lisent dans l'axe succédent (13/09/26)

> « Les incidents sont opérés dans l'axe succèdent. »

Axe succédent = **M2 · M6 · M8 · M12 · M14**. Les anciens détecteurs n'y
regardaient presque pas : ils lisaient M1, M7, M9, M13, M15 et des filiations.

### Ce que la doctrine révèle, avant même de mesurer

Cet axe est fait de maisons **air** (M2, M6, M14) et **terre** (M8, M12). Or
« Chaotique » vaut feu-eau. **Le rôle Chaotique est structurellement
impossible dans l'axe succédent** — vérifié, 0 fois sur 65 536 thèmes. Le
détecteur historique y cherchait une chose qui ne peut pas s'y trouver.

Les rôles qui mettent une figure en opposition avec sa maison dans un axe
air/terre sont :

| rôle | paire | ce que c'est |
|---|---|---|
| **Blocage** | air-terre | les *contraires* de l'échelle de concordance |
| **Dissonant** | air-eau | |

auxquels s'ajoutent les figures explosives déjà inscrites dans le fichier :
**Puer, Rubeus, Cauda Draconis**.

> charge d'une maison = (rôle Blocage ou Dissonant) + (figure explosive)

### Le camp ne peut pas se lire sur la charge brute

Charge moyenne par maison, sur les 65 536 thèmes :

| maison | élément | charge moyenne |
|---|---|---|
| M2 · M6 · M14 | air | **0,6875** |
| M8 · M12 | terre | **0,4375** |

Une maison air offre **deux** rôles d'incident (Blocage depuis une figure
terre, Dissonant depuis une figure eau) ; une maison terre un **seul**
(Blocage depuis une figure air). Le côté de l'équipe 1 (M2+M6, deux maisons
air) porte donc **1,57 fois** la charge du côté de l'équipe 2 (M8+M12, deux
maisons terre).

Lu brut, le moteur accusait l'équipe 1 **54,6 %** du temps contre **16,9 %**
l'équipe 2. Le camp se lit donc sur l'**écart à la moyenne de son propre
côté**. Après correction : M1 54,6 % / M7 45,4 %. M14 est le témoin : il
compte dans l'intensité, il n'accuse personne.

### Résultat sur la ligne 1

Tristitia / Tristitia / Conjunctio / Rubeus — 1-1, **rouge côté M1**

| maison | figure | rôle | charge | côté |
|---|---|---|---|---|
| M2 | Tristitia (terre) dans maison air | **Blocage** | 1 | équipe 1 |
| M6 | Fortuna Major (terre) dans maison air | **Blocage** | 1 | équipe 1 |
| M8 | Fortuna Minor (feu) dans maison terre | Absorbeur | 0 | équipe 2 |
| M12 | Cauda Draconis (eau) dans maison terre | Stabilisateur ⚡ | 1 | équipe 2 |
| M14 | Puer (feu) dans maison air | Amplificateur ⚡ | 1 | témoin |

M2+M6 = **2** pour 1,375 attendus (écart +0,625) · M8+M12 = 1 pour 0,875
(écart +0,125) · total **4**.

| | avant | après | réel |
|---|---|---|---|
| incident | non (intensité 5 / seuil 9) ✗ | **oui** (charge 4 / seuil 4) ✔ | rouge |
| camp | M1 ✔ | **M1** ✔ | M1 |

### Ce que cette ligne confirme : très peu

**La charge vaut 4 et le seuil vaut 4.** Un cran plus haut — charge 5, 13 %
des thèmes — et la ligne était ratée. Elle est sur le fil. Le camp, lui, était
déjà juste avant : sur cette ligne, l'axe succédent n'apporte rien de plus de
ce côté-là.

### Ce qui a été choisi après avoir vu la ligne 1, et ce qui ne l'a pas été

| | d'où ça vient |
|---|---|
| l'axe | **Ellemine_D**, avant toute mesure |
| les rôles Blocage et Dissonant | forcés — le Chaotique ne peut pas exister là |
| les figures explosives | déjà dans le fichier depuis longtemps |
| la normalisation du camp | forcée par l'asymétrie mesurée sur les 65 536 |
| le seuil de 4 | fréquence externe du penalty (~25 %) et du rouge (~8 %) — 35 % des thèmes |

Rien n'a été réglé pour faire tomber la ligne 1 juste. Le seuil ne bougera pas
pour elle.

### Ce qui reste branché en lecture

Les deux anciens détecteurs — V2 et la lecture large — sont toujours calculés
et exposés (`incidentIntensiteMixte`). Ils ne décident plus.
`INCIDENT_AXE_SUCCEDENT_DECIDE_V7 = false` les remet aux commandes.

La carte affiche maintenant :

> ⚠️ Incidents : **⚠️ SIGNAL INCIDENT · CONTRE M1** *(Présent · charge
> succédente 4 · 87e centile)*
