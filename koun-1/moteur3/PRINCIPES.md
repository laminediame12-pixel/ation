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
| FC-2 | DEVELOPPEMENT | Dernier principe de victoire, par les portes du cercle des fronts B → A → D → C → B : figures du front du pôle placées chez sa proie ou chez son front binôme (protecteur) moins celles placées chez le front prédateur, en base et en résultante | 1/3 | 7/7 |
| FP-1 | DEVELOPPEMENT | Mêmes forces de camps (cas des deux pôles de même front) : la somme des forces du pôle lui-même la plus haute gagne | — | — |
| CC-1 | PROPRIETAIRE (provisoire) | Forces des pôles égales : on compte les lignes à deux points des quatre résultantes du canal de la maison de chaque pôle. Égalité : nul ; sinon le canal qui en compte le plus donne la victoire à son pôle | aucun thème réel à égalité de forces | — |

Abandonnés (ils ont échoué hors développement ou n'ont jamais été vérifiés) : PF-1, PF-3, MF-1, MF-4, PR-1 à PR-6, DR-1, DR-C, DR-6 à DR-9, ainsi que le contrôle de cohérence qui écartait des familles entières.

**Résultat :** développement 22/27 (repère « toujours R1 » : 13/27) ; lot 1 : 12/14 (repère « toujours R1 » : 8/14). Attention : FC-2 a été retenu parmi une quinzaine de lectures essayées sur ces mêmes 41 thèmes ; ce n'est donc pas une validation. Il faut un lot neuf. Ancien FC-1 (force des fronts) : 24/27 et 8/14, supprimé.

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
Indice net = flux (circuit 1-3-5-11-13 (M1 ajoutée par le propriétaire) et M10, juge, front A des pôles, deux marquent) moins 0,65 fois les verrous de Terre (M8, M12, juge). Seuils du propriétaire : 7 → Over 1,5 ; 9,5 → Over 2,5 ; 14,5 → Over 3,5.
**Mesures avec les principes PS-1, RY-1 et RY-2 (ci-dessous) : 1,5 : 24/26 (repère 24/26) · 2,5 : 23/26 (repère 23/26) · 3,5 : 21/26 (repère 17/26).**
Les 26 scores sont élevés (18 matchs sur 26 au-dessus de 3,5) : les seuils du propriétaire sont trop bas pour ces données. Je n'ai pas ajusté les seuils sur ces 26 scores, faute de lot de validation.

## Ce que cette reconstruction n'est pas
- Les principes de victoire reconstruits ne sont pas prouvés : ils sont réunis et classés par provenance et par résultats réels. Le dernier principe (FC-2) a été retenu après plusieurs variantes essayées sur les mêmes thèmes : il décide 7 des 14 thèmes du lot 1 et attend un lot neuf.
- Les sorties de buts, de corners et de pénalité reprennent vos règles du 3.0.0 : elles ne sont pas validées, sauf là où les mesures sont données ci-dessus.

## Dans la page koun-moteur-3.0.0.html
- Une seule couche de moteur : le Moteur 3. Le moteur 2 n'y est plus embarqué.
- Supprimés de la page : les fonctions de décision du 3.0.0 (PrincipeUniqueDuWin, Nul, Pénalité, calcul des buts et corners, impact stratégique des pôles, dualité des cercles, résonance des maisons Terre, structure du nul par parties) et l'ancienne `computeVerdict` (1 370 lignes environ).
- Restent, en lecture seule et sans rôle dans le verdict : la pyramide (paralysies réciproques, mutation des maisons), l'inspecteur de maison, la cartographie des canaux (rôles d'activation, trajets de flux), le cercle des fronts et les calculateurs de somme.

## Égalité des forces (CC-1)
Quand les forces des deux pôles sont égales, plus aucun thème n'est sans verdict : CC-1 tranche (sur les 65 536 combinaisons de mères : 3 928 thèmes, dont 591 nuls). C'est un principe provisoire posé par le propriétaire ; aucun des 41 matchs réels connus n'est à égalité de forces, donc il n'a aucune mesure réelle.

## FC-2 : les portes du cercle des fronts
Les fronts circulent B → A → D → C → B : chaque front attaque le suivant (sa proie), le front binôme (A↔C, B↔D) le protège, et le front qui l'attaque est son prédateur. Chaque maison est d'un front (rang dans le bloc : Feu, Air, Eau, Terre) et agit comme une porte. Une figure du front du pôle placée chez le front prédateur est exposée (−1) ; chez sa proie ou chez son front binôme elle passe la porte (+1) ; chez son propre front elle est neutre. On compte en base et en résultante (M16 sans résultante). Le camp qui a le total le plus haut gagne.
Quand les totaux sont égaux : FP-1 (force des deux pôles), puis CC-1.
Mesures : développement 22/27, lot 1 12/14 (7/7 pour FC-2 seul), contre 24/27 et 8/14 avec l'ancien FC-1 (force des fronts moins la figure antagoniste), supprimé. FC-2 a été choisi après une quinzaine de variantes essayées sur ces 41 thèmes : sans lot neuf, c'est une hypothèse. Le « même front » en neutre (18/27 en le comptant bon) a été écarté par la théorie, pas par le résultat.

## RY-1 : le rythme du thème Saturé donne l'Over (posé par le propriétaire)
Le rythme du thème est celui de la cartographie des 4 canaux, avec le niveau d'activation en lignes à deux points : Ouvert, Fermé, Saturé, Contenu, Structuré, Percé (le moteur le calcule comme la page ; vérifié identique sur 676 thèmes). Quand le rythme est Saturé, le moteur annonce Over 1,5, Over 2,5 et Over 3,5 (au moins quatre buts dans le score prévu).
Mesures sur les 26 scores réels : 12 matchs au rythme Saturé, avec plus de 1,5 buts 11 fois, plus de 2,5 buts 11 fois, plus de 3,5 buts 10 fois. Le principe fait passer les Over/Under de 23/19/10 à 24/23/18 sur 26. Observation du propriétaire avant mesure : les mesures la confirment, mais sur les mêmes matchs, sans lot de validation.
## RY-2 : le rythme du thème Fermé ne dépasse pas l'Over 2,5 (posé par le propriétaire)
Quand le rythme est Fermé, le moteur ne dépasse pas Over 2,5 : au plus trois buts dans le score prévu (deux pour un nul), donc Under 3,5. Le moteur annonçait déjà Under 3,5 sur les 7 matchs au rythme Fermé de vos données ; la mesure reste donc 24/23/18 sur 26 pour Over/Under 1,5 / 2,5 / 3,5. Parmi ces 7 matchs, 4 ont 3 buts ou moins et 3 en ont 4, 5 et 9 : le principe est juste 4 fois sur 7 pour le seuil 3,5. Un principe « Fermé donne Under 2,5 ou 1,5 » n'est pas retenu : un seul des 7 matchs est sous 1,5 but.

## PS-1 : la saturation des fronts protecteurs de R1 et de R7 (étude des fronts, demandée par le propriétaire)
Chaque front protège son front binôme (A↔C, B↔D). Le niveau de saturation d'un front = nombre de maisons (1 à 15) où le repos et la résultante sont tous deux à deux points sur la ligne de ce front (même condition en base). PS-1 additionne la saturation des fronts protecteurs de R1 et de R7.
**Étude (26 scores réels) :** corrélation avec le total de buts : protecteur de R1 0,34 ; protecteur de R7 0,38 ; somme 0,46, la meilleure de toutes les mesures de saturation essayées (front de R1 −0,19, front de R7 0,11, prédateurs −0,04, total des quatre fronts 0,27). Sur la somme : 7 ou plus, 16 matchs, plus de 3,5 buts 14 fois ; moins de 7, 10 matchs, plus de 3,5 buts 3 fois. La relation est monotone (6 ou plus : 16/22 ; 7 ou plus : 14/16 ; 8 ou plus : 11/12 ; 9 ou plus : 7/8).
**Règle :** somme de 7 ou plus, Over 3,5 ; moins de 7, pas plus de Over 2,5. Le seuil de 7 est tiré de ces matchs, pas du propriétaire.
**Mesure Over 3,5 : PS-1 seul 21/26** (repère « toujours Over » 17/26 ; moteur sans PS-1 18/26).
**Rythmes :** RY-1 (Saturé donne Over) ne change rien (un match de plus juste, un de moins). RY-2 (Fermé, pas plus de Over 2,5) coûtait trois matchs réels : les trois matchs Fermés avec une somme de 7 ou plus (5·14·6·14, Belgique–Italie, PSG–Real) ont eu plus de 3,5 buts. RY-2 ne s'applique donc plus que lorsque PS-1 ne demande pas l'Over 3,5.

## Autres sorties étudiées sur la saturation des fronts (non retenues)
- Verdict : le front de R1 plus saturé que celui de R7 donne le gagnant 12 fois sur 24 ; protecteur plus saturé 10 sur 18 ; prédateur moins saturé 8 sur 23 ; front + protecteur − prédateur 12 sur 27 : aucun signal.
- Nul : l'égalité de saturation des deux fronts de R1 et R7 se retrouve dans 7 nuls sur 9 mais aussi dans 8 victoires sur 32 (écart moyen 0,33 contre 1,44). Comme principe de nul dans le moteur (NS-1), elle laisse le développement à 24/27 et fait passer le lot 1 de 8/14 à 7/14 : non retenue, à garder comme indice.

## Correction du rythme (Belgique–Italie 4-1 affiché « Fermé »)
Les rôles des figures d'activation (Fermante / Ouvrante) lisaient encore la maison de repos en logique « un point = ouvert », alors que le niveau d'activation est la ligne à deux points. Ils lisent maintenant les deux points, dans le moteur et dans la page. Belgique–Italie (4-1) passe de Fermé à Saturé ; Niger–Maroc (0-1) passe de Fermé à Contenu. Aucun résultat de buts ne change (Over/Under 24/23/21, Deux marquent 13/26) : c'est PS-1 qui décide, le rythme n'intervient plus que pour l'affichage.
Mesure du rythme Fermé : sur les 26 scores réels il ne sépare pas les matchs fermés des autres (5 matchs sur 9 à trois buts ou moins avec l'ancienne lecture, 3 sur 5 avec la nouvelle). RY-2 reste donc un principe posé par le propriétaire, non prouvé.

## CO-1 : deux thèmes d'un même match (DEVELOPPEMENT, non validé)
Deux thèmes lus avec le même repère (R1 = équipe 1) peuvent se contredire. Accord des deux verdicts : verdict commun. Désaccord, dans l'ordre :
1. **Validation (FI-3)** : le thème valide l'emporte (binôme de M1 et somme de l'axe angulaire tous deux en maison angulaire).
2. **Axe angulaire** : à fiabilité égale, le thème dont la somme M1+M4+M7+M10 est en maison angulaire.
3. La force du principe : victoire assurée (4), principe de structure (3), FC-2 (2), FP-1 (1), CC-1 (0).
4. À rang égal, la marge du principe ; égalité complète : nul.
Le score et les lignes de buts sont ceux du thème retenu ; la page affiche l'accord ou le désaccord sur Deux marquent et Over/Under 1,5 / 2,5 / 3,5, et la fiabilité de chaque thème.
Origine : match 1-15-3-9 / 1-9-8-1 (réel 1-4). Les deux thèmes sont « moyen » (le premier : binôme juré, axe non validé ; le second : binôme hors canal, axe validé), l'axe départage et donne le thème juste. Ce match a servi à poser les critères : il est du développement.

## FI-3 : la validation du thème (corrigée par le propriétaire)
Le binôme de M1 ne décide pas du vainqueur : il valide le thème. Binôme de M1 = sa partenaire de front binôme, comme dans la page d'origine : 1-3, 2-4, 5-7, 6-8, 9-11, 10-12, 13-15, 14-16 (Puer ↔ Caput, Caput ↔ Puer, Fortuna Major ↔ Carcer). **Règle (FI-3) : le binôme de M1 et la figure somme de l'axe angulaire (M1+M4+M7+M10) doivent tous deux être présents dans le thème et avoir au moins un emplacement en maison angulaire (M1, M4, M7 ou M10, en base ou en résultante). Sinon le thème est non valide.** Une figure absente du thème ne peut pas être en maison angulaire : le thème est non valide. Il n'y a plus de niveau « moyen » : valide ou non valide. La validation ne change pas le verdict : elle s'affiche avec la confiance et départage deux thèmes d'un même match (CO-1).
Historique : FI-1 (binôme chez lui ou dans son canal, et somme en maison angulaire), puis FI-2 (trois niveaux fiable / moyen / peu fiable), remplacés. La liste des 18 thèmes de travail (`validation/themes-18.json`) a été choisie avec FI-1 et reste figée.
Mesure avec FI-3 (binôme corrigé) : 41 thèmes (développement + lot 1), verdict juste : valides 10/10, non valides 24/31. 26 scores réels : valides 3 thèmes (9·13·2·13, 13·12·8·15, PSG–Bayern ; verdict 3/3, Deux marquent 0/3, Over 3,5 2/3), non valides 23 (verdict 18/23, Deux marquent 13/23, Over 3,5 19/23). Sur les combinaisons de mères : 10 016 valides, 55 520 non valides. Soudan–Sénégal, Allemagne–Pays Bas, Belgique–Italie, 12-9-4-5 et 2-16-15-1 sont tous non valides.
Réserves : définition posée pour « voir », effectifs faibles, thèmes de mesure aussi thèmes de choix de la règle.
## NU-2 : deux niveaux de nul (à la demande du propriétaire)
Partie 1 = M1, M2, M3, M4, M9, M10, M13, M15 (branche des mères et juge) ; partie 2 = M5, M6, M7, M8, M11, M12, M14, M16 (branche des filles et conciliateur). Chaque maison lit un seul niveau, en diagonale (Feu, Air, Eau, Terre, puis on recommence). Au repos : partie 1 = 3 niveaux saturés, partie 2 = 5 en base (écart −2) ; 8 et 8 en résultante.
- **Nul assuré** : l'écart de la base et celui de la résultante sont tous deux nuls (équilibre strict) et le juge est hors de son repos.
- **Nul probable** : les deux écarts sont opposés et non nuls (équilibre compensé).
Mesure sur les 41 thèmes (juge hors repos) : équilibre strict 4 nuls sur 4 (3 thèmes distincts : 3-14-13-5, 2-7-2-12, 2-9-6-5) ; équilibre compensé 3 nuls et 3 fausses alertes. Retrancher l'écart de repos (3 contre 5) fait tomber la détection à 1 nul sur 9 : les nuls sont des équilibres de comptage brut. Sur les 65 536 combinaisons : nul assuré 2 331, nul probable 5 481. Le niveau est trouvé en regardant ces thèmes (3 distincts) : à valider sur un lot neuf. La page affiche « Match nul assuré » ou « Match nul probable » ; les autres principes de nul (NU-1, NU-3, MF-3, CC-1) restent « Match nul ».

## Figures par canal d'accueil (structure, sans effet sur le verdict)
`KOUN3.canauxDifferents(L)` et la carte « Figures par canal d'accueil » de la page donnent, pour chaque maison, la figure de base, sa relation avec le canal de la maison (propre, adjacent, opposé), l'orientation (front de la résultante), la saturation (niveaux à deux points de la figure), la concordance (niveaux accordés avec le repos de la maison) et les niveaux fixes attendus. Lois vérifiées sur les 256 couples (figure, maison) : propre canal → résultante de front D, Feu et Air concordants ; canal opposé → résultante de front B (Air), Air toujours concordant, Feu jamais ; canal adjacent → résultante de front A ou C. La carte affiche aussi, par camp, le nombre de figures en propre canal, adjacent et opposé.
Correction : une lecture annoncée dans la discussion, « le camp qui compte le plus de figures dans leur propre canal gagne », est fausse sur les 18 thèmes de travail (3 justes sur 6 cas décidés, 3 égalités). Le canal d'accueil du pôle est un indice plus net : pôle gagnant en propre canal 8 fois, en adjacent 5, en opposé 3 ; pôle perdant en propre canal 5 fois, en adjacent 10, en opposé 1. Rien n'est branché sur le verdict.

**Correction du binôme.** Le moteur calculait le binôme de M1 comme « numéro + 2 » pour toutes les figures, alors que la page d'origine (`BINOMES_MAP`) donne des couples symétriques (Caput a pour binôme Puer, pas Via). L'erreur touchait 8 figures sur 16 en M1 (Caput, Albus, Rubeus, Tristitia, Conjunctio, Fortuna Major, Aquisitio, Populus). Corrigée. Les mesures de validation, les listes de thèmes (Soudan–Sénégal et 12-9-4-5 : binôme Carcer et non Puella) et l'étude de l'emplacement du binôme de M1 sont recalculées. Le test M16 (figure Feu, binôme) n'est pas touché : toutes les figures Feu sont de rang 1 dans le bloc. `paireDe(pôle)`, utilisée par CL-2, garde « numéro + 2 » (principe posé avec ses mesures) : à confirmer avec le propriétaire.
