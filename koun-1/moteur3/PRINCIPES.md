# Moteur 3 : table rase des principes

Le moteur 2 a été vidé de ses cas de décision. La **structure** (thème, résultantes, forces, pôles, paralysies) reste : ce sont des calculs exacts. Tout ce qui décide est reconstruit dans `moteur3/moteur.js`, avec la provenance de chaque principe.

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
| FP-1 | DEVELOPPEMENT | Dernier principe : la somme des forces des positions du pôle la plus haute gagne | 3/3 | 3/9 |

Abandonnés (ils ont échoué hors développement ou n'ont jamais été vérifiés) : PF-1, PF-3, MF-1, MF-4, PR-1 à PR-6, DR-1, DR-C, DR-6 à DR-9, ainsi que le contrôle de cohérence qui écartait des familles entières.

**Résultat :** développement 24/27 (repère « toujours R1 » : 13/27) ; lot 1 : 8/14 (repère « toujours R1 » : 9/14, moteur 2 d'avant : 6/14). Les cinq principes non-fallback qui ont décidé le lot 1 sont tous justes (5/5) ; le dernier principe FP-1 fait 3/9 : c'est lui qu'il faut remplacer.

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
**Mesures : 1,5 : 24/26 (repère 25/26) · 2,5 : 20/26 (repère 24/26) · 3,5 : 9/26 (repère 18/26).**
Les 26 scores sont très élevés (18 matchs sur 26 au-dessus de 3,5) : les seuils du propriétaire sont trop bas pour ces données. Je n'ai pas ajusté les seuils sur ces 26 scores, faute de lot de validation.

## Ce que cette reconstruction n'est pas
- Les principes de victoire reconstruits ne sont pas prouvés : ils sont réunis et classés par provenance et par résultats réels. Le dernier principe (FP-1) est le plus faible et décide encore 9 des 14 thèmes du lot 1.
- Les sorties de buts, de corners et de pénalité reprennent vos règles du 3.0.0 : elles ne sont pas validées, sauf là où les mesures sont données ci-dessus.
