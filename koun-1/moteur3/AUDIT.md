# Audit du Moteur 3 : ce qui vient de vous, ce qui vient de moi

Lecture seule : cet audit ne change rien au moteur. Chaque ligne a une case de décision pour le propriétaire : **garder**, **corriger** ou **supprimer**.

Légende de provenance :
- **PROPRIÉTAIRE** : posé par vous (règle, seuil, consigne).
- **3.0.0** : repris de votre page d'origine, non retesté depuis.
- **MOI** : posé par moi, à partir de mes tests sur les mêmes thèmes que ceux qui servent à mesurer.

Chiffres : « combinaisons » = part des 65 536 combinaisons de mères que le principe décide. Mesures réelles : développement (27 thèmes), lot 1 (14), 18 thèmes de travail. Les trois jeux se recoupent en partie (voir section F).

---

## A. Principes de verdict (ordre d'application)

Le moteur applique ces principes dans l'ordre ; le premier qui s'applique décide. En même front, un nul n'est retenu que si les deux parties sont équilibrées (règle du propriétaire).

| # | Principe | Provenance | Condition exacte | Combinaisons | Dév. | Lot 1 | 18 thèmes | Risque | Décision |
|---|---|---|---|---|---|---|---|---|---|
| 1 | VA-1 | PROPRIÉTAIRE | Boucles différentes : un pôle a 3 figures ou plus de son front ou de son front binôme dans leur maison de repos (base ou résultante, hors annulées), l'autre en a moins. Victoire « assurée ». | 3,9 % | 1/2 | 1/1 | 1/1 | « Assuré » est faux sur 2 matchs sur 4 (thème 1-15-3-9 du lot 2) | ☐ |
| 2 | MF-2 | PROPRIÉTAIRE | Même front : un seul pôle a son partenaire de moitié chez lui. | 2,0 % | 1/1 | 0/0 | 1/1 | 3 cas réels en tout | ☐ |
| 3 | MF-3 | PROPRIÉTAIRE | Nul : R1 + R7 = Tristitia, placée dans une maison de Terre. | 0,4 % | 1/1 | 0/0 | 0/0 | 1 cas réel ; soumis à l'équilibre des parties en même front (à confirmer) | ☐ |
| 4 | NU-1 | MOI (équilibre par équation) | Même front : somme des écarts de la base et de la résultante entre les deux parties nulle, juge (M15) hors de son repos : nul. | 4,0 % | 2/2 | 0/0 | 0/0 | Équilibre des parties choisi sur 9 nuls | ☐ |
| 5 | AX-1 | 3.0.0 / MOI | Pôles en M4 et M10 : le pôle de M4 gagne, sauf attaque directe du pôle de M10. | 5,2 % | 5/5 | 0/0 | 3/3 | Aucun test hors développement | ☐ |
| 6 | CL-1 | MOI | Même boucle, fronts différents : un seul pôle est vraiment chez lui (non annulé, pas un simple reflet de Populus). | 6,1 % | 2/2 | 1/1 | 1/1 | 5 cas réels | ☐ |
| 7 | CL-2 | MOI | Boucles différentes : le pôle et son binôme (**couples symétriques de la page d'origine : 1-3, 2-4, 5-7, 6-8, 9-11, 10-12, 13-15, 14-16**, corrigé) contre l'autre pôle et le sien ; la paire avec le plus de figures chez elles gagne. | 14,3 % → voir PRINCIPES | 1/2 | 1/1 | 1/1 | Corrigé à votre demande : 3 908 verdicts changent sur les combinaisons, développement 22/27 → 20/27 | ☐ |
| 8 | PF-2 | MOI | Un pôle attaque directement l'autre (k attaque k+3) ; l'attaqué a 1 % ou moins dans sa maison ; l'attaquant plus de 1 % : l'attaquant gagne. | 1,7 % | 2/2 | 1/1 | 1/1 | 4 cas réels | ☐ |
| 9 | NU-2 | MOI (équilibre par équation) | Fronts différents : mêmes équilibre et juge que NU-1 : nul (assuré si les deux écarts sont nuls, probable sinon). | 11,9 % | 3/3 | 1/1 | 2/2 | Niveau « assuré » : 3 thèmes distincts | ☐ |
| 10 | NU-3 | MOI | En base, lignes à deux points Feu+Air = Eau+Terre sur les 16 maisons, juge hors repos : nul. | 3,6 % | 2/3 | 0/0 | 0/0 | Aucun cas dans les 18 thèmes ; 2 sur 3 en développement | ☐ |
| 11 | FC-2 | MOI | Le camp qui passe le plus de portes du cercle B→A→D→C→B gagne (figures du front du pôle chez sa proie ou son binôme : +1 ; chez son prédateur : −1 ; base + résultante). | 29,5 % | 1/3 | 7/7 | 6/7 | Choisi parmi une quinzaine de variantes sur ces thèmes ; décide près d'un thème sur trois | ☐ |
| 12 | FP-1 | MOI | Camps à égalité : la somme des forces de toutes les positions du pôle la plus haute gagne. | 12,8 % | 0/0 | 0/2 | 0/1 | 0 juste sur 3 thèmes réels | ☐ |
| 13 | CC-1 | PROPRIÉTAIRE (provisoire) | Forces égales : lignes à deux points des 4 résultantes du canal de la maison de chaque pôle ; égalité : nul, sinon le plus grand. | 4,5 % | — | — | — | Aucun thème réel ne l'a jamais exercé | ☐ |
| 14 | Repli R1 | **MOI** | CC-1 à égalité en même front, parties non équilibrées : « R1 par défaut ». | 390 combinaisons | — | — | — | **Inventé par moi**, aucune règle ne le fonde | ☐ |

Observation d'ensemble : sur les 18 thèmes, 16 verdicts sont justes, mais « toujours R1 » fait 12 sur 18 ; les trois principes les plus actifs sur nos données sont FC-2 (7), CL-2 (1) et AX-1 (3).

---

## B. Sorties de buts

| Élément | Provenance | Contenu | Test réel | Décision |
|---|---|---|---|---|
| Indice de flux : poids 2 par ligne ouverte de S et de S+M10, 1,5 par ligne du Juge, +2,5 si S ou S+M10 impaire, +2 par pôle en front A, +3 si deux marquent, +1,2 par figure en maison ennemie M8/M12 | 3.0.0 | Repris de votre page | Over/Under 24/23/21 sur 26 | ☐ |
| Circuit S = M1+M3+M5+M11+M13 (M1 ajoutée) | PROPRIÉTAIRE | Les seuils n'ont pas été recalés après l'ajout | non retesté | ☐ |
| Verrous de Terre (+1,5 front D, +1,5 Carcer/Tristitia/Populus, +2,5 Juge, +1 Populus en M8/M12), facteur 0,65 | 3.0.0 | | idem | ☐ |
| Seuils du total de buts 7 / 9,5 / 14,5 | PROPRIÉTAIRE | | idem | ☐ |
| PS-1 : somme de saturation des fronts protecteurs de R1 et R7 ≥ 7 → Over 3,5 ; sinon pas plus de Over 2,5 | **MOI** | Seuil 7 tiré des 26 scores qui servent à le mesurer | 21/26 contre 17 sans | ☐ |
| RY-1 (rythme Saturé : au moins 4 buts), RY-2 (rythme Fermé : pas plus de Over 2,5, cède à PS-1) | PROPRIÉTAIRE | Le rythme Fermé ne sépare rien sur 26 scores | non confirmé | ☐ |
| Deux marquent : les deux pôles peuvent marquer (force ≥ 50, ni paralysé gravement, ni annulé) et une figure impaire donne l'élan | 3.0.0 | | 13/26, sous « toujours Oui » (16/26) | ☐ |
| Répartition du score : le perdant a 1 but si deux marquent, sinon 0 | **MOI** | Simplification | score exact non mesuré | ☐ |
| Buts MT-1 (M1+M5+M12+M15), corners (indice de friction), pénalité, carton rouge | 3.0.0 | | MT-1 5/6 ; corners, pénalité et carton **sans aucune donnée réelle** | ☐ |

---

## C. Validation du thème et conciliation

| Élément | Provenance | Contenu | Décision |
|---|---|---|---|
| FI-5 : le thème est valide si (1) le binôme de M1 et (2) la somme de l'axe angulaire sont présents et en maison angulaire, (3) la somme 3-5-11-15 et (4) la figure du jour sont présentes quelque part | PROPRIÉTAIRE (mise en œuvre : MOI) | 8 785 valides sur 65 536 sans la figure du jour ; aucune date dans nos 26 scores | ☐ |
| Binôme de M1 = partenaire de front binôme (1-3, 2-4, 5-7, 6-8, 9-11, 10-12, 13-15, 14-16) | 3.0.0 | **J'avais d'abord utilisé n+2 pour toutes les figures : erreur corrigée** | ☐ |
| CO-1 : deux thèmes d'un même match, désaccord : le thème valide l'emporte, puis celui dont l'axe est validé, puis le principe le plus fort (assuré 4, structure 3, FC-2 2, FP-1 1, CC-1 0), puis la marge, puis nul | PROPRIÉTAIRE (axe, validité) / **MOI** (rangs, marge) | Testé sur un seul match (lot 2), qui a servi à poser le critère de l'axe | ☐ |

---

## D. Éléments d'affichage ajoutés de ma main (sans effet sur le verdict)

| Élément | Où | Contenu | Décision |
|---|---|---|---|
| Légende des 4 canaux (Feu+Air, Eau+Terre, différence, %) | sous la pyramide | Demandé par vous | ☐ |
| Saturation par canal, énergie qui passe | cartes des canaux | Demandé par vous (la définition de « énergie qui passe » est mienne) | ☐ |
| Carte « Figures par canal d'accueil » | cartographie des canaux | Demandée par vous | ☐ |
| Carte « Deux thèmes du même match » | champ « Deuxième thème » | Demandé par vous | ☐ |
| Liste des thèmes sauvegardés : tri valides / non valides, bilan séparé | liste sauvegardée | **Initiative de moi** après « classer de côté » | ☐ |
| Panneau Validation : deux critères comptés, figure du jour et somme 3-5-11-15 en indications | colonne gauche | Corrigé après votre remarque | ☐ |
| Deux niveaux de nul « assuré » / « probable » (NU-2 seulement) | bannière | Demandé par vous ; mon essai sur NU-1 a été annulé | ☐ |

---

## E. Couches de l'ancien système

**Retirées de la page (à votre demande « tout ce qui ne fonctionne pas ou n'intervient pas dans le calcul du moteur ») :**
- le panneau « Thème porté » ;
- le badge « période » (jour/nuit), la table `BINOMES_MAP` ;
- les cartes de verrous des canaux, les pastilles Fermante / Ouvrante, la ligne « Trajet flux » et leurs fonctions (`evaluateActivationRole`, `ELEMENT_ACTIVATION_ROLES`, `analyzeHouseFluxPath`, `evalFluxTrajectory`, `vecToNotation`) ;
- le calcul parallèle du rythme du thème : la page affiche maintenant le rythme calculé par le moteur ;
- l'étiquette « maison paire / impaire » (« aucun rôle dans le verdict »), la règle « Rubeus toujours rouge », la couleur « résultante alliée », les « opérateurs » des maisons ;
- les forces 100/75/50/0 de l'inspecteur de maison : il affiche les forces du moteur ;
- le calcul parallèle des paralysies (`detectReciprocalParalyses`) ;
- les « Ant. : … » des cartes de figures absentes (la table de la page donnait l'antagoniste dans le sens opposé à celui du moteur) ;
- les règles CSS devenues inutiles.

**Maison ennemie :** la pyramide et le cercle des fronts utilisent maintenant `enMaisonAntagoniste` du moteur (figure k dans la maison k − 3, force 0). L'ancienne page marquait la maison k + 3 : les cœurs de la pyramide ont donc changé de place.

**Encore présent, à votre décision :**
- La somme 3-5-11-15 et la figure du jour servent à la validation du thème (FI-5), comme vous l'avez précisé.
- Le tableau des cases de lignes de la cartographie (4 canaux × 16 maisons, ligne B et ligne R) : pur affichage des bits du thème ; il regroupe par ligne (Feu sur les 16 maisons), alors que la saturation par canal regroupe par colonne de 4 maisons.
- Les tables de la page `ALL_16_VECS` et `HOUSE_REST_FIG` (noms, fronts, maison de repos, maison attaquée) : structure statique, cohérente avec le moteur pour l'attaque (k attaque k + 3).
- Deux orthographes de la figure 15 : « Acquisitio » (page, vos exports) et « Aquisitio » (moteur et documents).

---

## F. Hygiène des données

- Le développement (27 thèmes), le lot 1 (14), les 26 scores réels et les 18 thèmes **se recoupent** : plusieurs règles ont été choisies sur les mêmes thèmes que ceux qui les mesurent. Aucune mesure de ce document n'est donc une validation.
- Le lot 2 (thème à deux thèmes, score 1-4) a servi à poser le critère de l'axe : il est devenu du développement.
- Le score de Niger–Maroc avait été saisi 5-0 au lieu de 0-1 (corrigé ; le moteur se trompe maintenant sur ce match).
- Les 18 thèmes de travail ont été choisis avec une ancienne règle de validation (FI-1), puis figés dans `validation/themes-18.json`.

---

## G. Erreurs trouvées et corrigées pendant le travail

1. Binôme de M1 calculé « n + 2 » au lieu des couples symétriques de la page d'origine (8 figures sur 16 touchées).
2. Ancien panneau de validation du 3.0.0 qui comptait une figure comme valide dès qu'elle était présente quelque part.
3. Rythme « Fermé » calculé avec la logique à un point des rôles, alors que le niveau d'activation est à deux points.
4. Plusieurs lectures annoncées dans la discussion et fausses (par exemple « le camp avec le plus de figures en propre canal gagne » : 3 sur 6).
5. Modification de NU-1 sans consigne (annulée).

---

## H. Points qui attendent votre décision

1. **Repli « R1 par défaut »** (principe 14) : le garder, le remplacer par autre chose, ou laisser le moteur sans verdict ?
2. ~~CL-2 et le binôme n + 2~~ : fait (couples symétriques).
3. **MF-3** : garder le nul quel que soit l'équilibre des parties, ou le soumettre à l'équilibre comme les autres ?
4. **VA-1 « assuré »** : garder le mot, alors qu'il est juste 2 fois sur 4 ?
5. **FP-1 et FC-2** : garder, remplacer ou supprimer ? FP-1 a 0 juste sur 3 thèmes réels, FC-2 décide 29,5 % des combinaisons.
6. **PS-1, RY-2, répartition du score** : garder ou retirer (seuil et règles tirés des mêmes scores).
7. **Seuils de buts avec le circuit à 5 maisons** : à recaler ou à garder.
8. **Éléments de l'ancien système restants** (section E) : la somme 3-5-11-15 dans CL-2, les rôles Fermante / Ouvrante, l'orthographe de la figure 15.
