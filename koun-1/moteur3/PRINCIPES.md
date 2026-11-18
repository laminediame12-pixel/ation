# Moteur 3 : table rase des principes

`moteur3/moteur.js` est un fichier autonome de 38 Ko (le moteur 2 et le moteur 3 pesaient 87 Ko ensemble dans la page). Il contient la **structure** exacte (thème, résultantes, forces, pôles, paralysies) et, principe par principe, tout ce qui décide. Les cas du moteur 2 abandonnés, sa fonction de décision, ses signaux et ses constantes inutilisées ont été supprimés ; une vérification sur les 65 536 thèmes confirme que les sorties n'ont pas changé.

Provenances : **PROPRIETAIRE** (posé par vous) · **PORTE_3.0.0** (règle de votre 3.0.0, reprise) · **DEVELOPPEMENT** (issu des matchs de développement, tient sur le lot 1) · **DEV_SEUL** (développement seulement, jamais confirmé) · **NON_TESTE** (aucune donnée réelle).

## Victoire et nul (ordre de lecture)

| Principe | Provenance | Énoncé | Développement | Lot 1 |
|---|---|---|---|---|
| VA-1 | PROPRIETAIRE | Boucles différentes : trois figures ou plus du front ou du front binôme chez elles | 1/2 | 1/1 |
| MF-2 | PROPRIETAIRE | Même front : un seul pôle a son partenaire de moitié chez lui | 1/1 | — |
| MF-3 | PROPRIETAIRE | Nul, front miroir : R1 + R7 = Tristitia, posée dans une maison de Terre | 1/1 | — |
| NU-1 | DEVELOPPEMENT | Nul, même front : équilibre d'activation des deux parties du thème, juge hors de son repos | 2/2 | — |
| AX-1 | DEV_SEUL | Pôles en M4 et M10 : le pôle de M4 engendre l'autre | 5/5 | — |
| CL-1 | DEVELOPPEMENT | Même boucle : un seul pôle chez lui | 2/2 | 1/1 |
| CL-2 | DEVELOPPEMENT | Boucles différentes : le pôle et son binôme chez eux | 2/3 | 1/1 |
| PF-2 | DEVELOPPEMENT | Attaque directe sur un pôle sans défense | 2/2 | 1/1 |
| NU-2 | DEVELOPPEMENT | Nul : équilibre d'activation des deux parties, juge hors de son repos | 3/3 | 1/1 |
| NU-3 | DEVELOPPEMENT | Nul : équilibre des affinités Feu-Air / Eau-Terre en base, juge hors de son repos | 2/3 | — |
| FC-1 | DEVELOPPEMENT | Dernier principe de victoire, par le cercle des fronts B → A → D → C → B : force du front du pôle + force de son front binôme (protecteur) − force du front qui l'attaque (prédateur) − force de la figure antagoniste du pôle | 3/3 | 3/7 |
| FP-1 | DEVELOPPEMENT | Mêmes forces de camps (cas des deux pôles de même front) : la somme des forces du pôle lui-même la plus haute gagne | — | 0/2 |

| CC-1 | PROPRIETAIRE (provisoire) | Forces des pôles égales : on compte les lignes à deux points des quatre résultantes du canal de la maison de chaque pôle. Égalité : nul ; sinon le canal qui en compte le plus donne la victoire à son pôle | aucun thème réel à égalité de forces | aucun |

Abandonnés (ils ont échoué hors développement ou n'ont jamais été vérifiés) : PF-1, PF-3, MF-1, MF-4, PR-1 à PR-6, DR-1, DR-C, DR-6 à DR-9, ainsi que le contrôle de cohérence qui écartait des familles entières.

**Résultat :** développement 24/27 (repère « toujours R1 » : 13/27) ; lot 1 : 9/14 (repère « toujours R1 » : 9/14, moteur à cas d'avant : 6/14). Les cinq principes spécifiques qui ont décidé le lot 1 sont tous justes (5/5) ; le dernier principe FC-1 fait 4/9 : c'est lui qui reste le plus faible.

## Pénalité et carton rouge — PORTE_3.0.0, NON_TESTE
- Rubeus en base dans une maison impaire, avec un front lié à un pôle : carton rouge pour ce camp.
- Cauda Draconis en M12 liée à un pôle : carton rouge.
- Cauda Draconis ou Rubeus dans la maison de repos d'un pôle : pénalité contre ce camp.
- Aucun résultat de pénalité ou de carton dans les données : aucune mesure possible.

## Deux marquent — PORTE_3.0.0 reconstruit sur les forces
Les deux pôles peuvent marquer (une position à 50 % ou plus, ni annulé ni paralysé gravement) et une figure de boucle impaire donne l'élan. Le score prévu est ensuite rendu cohérent.
**Mesure : 13/26** (repère « toujours Oui » : 16/26).

## Buts en première mi-temps — PORTE_3.0.0
Somme M1+M5+M12+M15 : le but a lieu si elle est de boucle impaire et présente, ou posée en M1, M5, M12 ou M15 en base, ou si son miroir est présent avec un pôle chez lui dans son front et au moins deux pivots impairs.
**Mesure : 5/6** (mi-temps connue pour 6 matchs seulement).

## Corners MT-1 — PORTE_3.0.0, NON_TESTE
Indice de friction (fronts Feu/Air en M1, M5, M7, M8, M12 ; Terre ; duel d'antagonistes ; verrou de Terre sous forte attaque) : 10,5 Over 3.5 ; 13,5 Over 4.5 ; sinon Under 4.5. Aucune donnée de corners.

## Over/Under 1,5 · 2,5 · 3,5 — PORTE_3.0.0
Indice net = flux (circuit 3-5-11-13 et M10, juge, front A des pôles, deux marquent) moins 0,65 fois les verrous de Terre (M8, M12, juge). Seuils du propriétaire : 7 → Over 1,5 ; 9,5 → Over 2,5 ; 14,5 → Over 3,5.
**Mesures avec les principes RY-1, RY-2 et SB-1 (ci-dessous) : 1,5 : 24/26 (repère 24/26) · 2,5 : 23/26 (repère 23/26) · 3,5 : 17/26 (repère 17/26).**
Les 26 scores sont élevés (18 matchs sur 26 au-dessus de 3,5) : les seuils du propriétaire sont trop bas pour ces données. Je n'ai pas ajusté les seuils sur ces 26 scores, faute de lot de validation.

## Ce que cette reconstruction n'est pas
- Les principes de victoire reconstruits ne sont pas prouvés : ils sont réunis et classés par provenance et par résultats réels. Le dernier principe (FC-1) est le plus faible et décide encore 9 des 14 thèmes du lot 1.
- Les sorties de buts, de corners et de pénalité reprennent vos règles du 3.0.0 : elles ne sont pas validées, sauf là où les mesures sont données ci-dessus.

## Dans la page koun-moteur-3.0.0.html
- Une seule couche de moteur : le Moteur 3. Le moteur 2 n'y est plus embarqué.
- Supprimés de la page : les fonctions de décision du 3.0.0 (PrincipeUniqueDuWin, Nul, Pénalité, calcul des buts et corners, impact stratégique des pôles, dualité des cercles, résonance des maisons Terre, structure du nul par parties) et l'ancienne `computeVerdict` (1 370 lignes environ).
- Restent, en lecture seule et sans rôle dans le verdict : la pyramide (paralysies réciproques, mutation des maisons), l'inspecteur de maison, la cartographie des canaux (rôles d'activation, trajets de flux), le cercle des fronts et les calculateurs de somme.

## Égalité des forces (CC-1)
Quand les forces des deux pôles sont égales, plus aucun thème n'est sans verdict : CC-1 tranche (sur les 65 536 combinaisons de mères : 3 928 thèmes, dont 591 nuls). C'est un principe provisoire posé par le propriétaire ; aucun des 41 matchs réels connus n'est à égalité de forces, donc il n'a aucune mesure réelle.

## FC-1 : la force des camps par le cercle des fronts
Les fronts circulent B → A → D → C → B : chaque front attaque le suivant, et le front binôme (A↔C, B↔D) protège le front, car le prédateur d'un front est le binôme de celui qu'il attaque. La force du camp d'un pôle = force de son front + force de son front binôme − force du front prédateur − force de la figure antagoniste du pôle ; la force d'un front est la somme des forces de toutes les positions de ses figures.
Quand les deux pôles ont le même front, les camps sont identiques : le moteur compare alors la force des deux pôles (FP-1), puis le comptage des deux points par canal (CC-1).
Mesures : développement 24/27, lot 1 9/14 (8/14 sans l'antagoniste du pôle). Les écarts entre variantes tiennent à un match.

## RY-1 : le rythme du thème Saturé donne l'Over (posé par le propriétaire)
Le rythme du thème est celui de la cartographie des 4 canaux, avec le niveau d'activation en lignes à deux points : Ouvert, Fermé, Saturé, Contenu, Structuré, Percé (le moteur le calcule comme la page ; vérifié identique sur 676 thèmes). Quand le rythme est Saturé, le moteur annonce Over 1,5, Over 2,5 et Over 3,5 (au moins quatre buts dans le score prévu).
Mesures sur les 26 scores réels : 12 matchs au rythme Saturé, avec plus de 1,5 buts 11 fois, plus de 2,5 buts 11 fois, plus de 3,5 buts 10 fois. Le principe fait passer les Over/Under de 23/19/10 à 24/23/18 sur 26. Observation du propriétaire avant mesure : les mesures la confirment, mais sur les mêmes matchs, sans lot de validation.
## RY-2 : le rythme du thème Fermé ne dépasse pas l'Over 2,5 (posé par le propriétaire)
Quand le rythme est Fermé, le moteur ne dépasse pas Over 2,5 : au plus trois buts dans le score prévu (deux pour un nul), donc Under 3,5. Le moteur annonçait déjà Under 3,5 sur les 7 matchs au rythme Fermé de vos données ; la mesure reste donc 24/23/18 sur 26 pour Over/Under 1,5 / 2,5 / 3,5. Parmi ces 7 matchs, 4 ont 3 buts ou moins et 3 en ont 4, 5 et 9 : le principe est juste 4 fois sur 7 pour le seuil 3,5. Un principe « Fermé donne Under 2,5 ou 1,5 » n'est pas retenu : un seul des 7 matchs est sous 1,5 but.

## SB-1 : les niveaux saturés du canal de la somme des fronts (posé par le propriétaire, seuil tiré des données)
On additionne les fronts de R1 et R7 dans le groupe des fronts (A+B = C, A+C = B, A+D = A, B+C = A, B+D = B, C+D = C ; deux fronts égaux donnent D). Cela désigne un canal. On compte, dans les maisons 1 à 15, les niveaux saturés de ce canal : le repos et la résultante sont tous deux à deux points sur sa ligne (c'est la même condition en base).
Règle : trois niveaux saturés ou plus, Over 3,5 ; deux ou moins, pas plus de Over 2,5. Le seuil de 3 vient des 26 scores réels (corrélation de 0,43 entre ce nombre et le total de buts sur le lot 1) ; ce n'est pas un seuil du propriétaire.
Mesure sur les 26 scores, Over 3,5 : SB-1 seul 20/26 ; avec les rythmes RY-1 et RY-2 appliqués ensuite 17/26. RY-2 (Fermé, au plus Over 2,5) contredit SB-1 sur trois matchs réels (5·14·6·14, Belgique–Italie, PSG–Real : plus de 3,5 buts) et RY-1 (Saturé, Over) le contredit sur 12·6·1·9. Dans le moteur, les rythmes sont appliqués après SB-1 : à choisir par le propriétaire.
