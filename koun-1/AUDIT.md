# Audit de koun-1 · Atelier de validation (10 novembre 2026)

Fichier audité : `koun-1-complet.html` (version moteur `1.12.0-essai`).
Fichier corrigé : [`koun-1-complet.html`](koun-1-complet.html) dans ce dossier.

## 1. Ce qui a été vérifié

| Contrôle | Résultat |
|---|---|
| Intégrité du moteur (SHA-256 du cœur `81e86bad…`) | ✅ Identique. **Le moteur n'a pas été modifié.** |
| Les 11 références recalculées en direct et comparées aux instantanés enregistrés | ✅ 11/11 identiques : verdict, statut, phase et 16 maisons |
| Codes des mères ↔ figures (ordre 1–16) | ✅ Cohérents pour les 11 références |
| Règle KREG-006 : « 4 des 6 nuls partagent le même réseau » (NUL 2, 3, 4, 5) | ✅ Vérifiée |
| Barème KREG-005 et forces affichées | ✅ Cohérents |
| Banc exhaustif : les 65 536 combinaisons de mères (16⁴) | ✅ Aucun plantage du moteur ni du pont |
| Ouverture en fichier local (`file://`) | ❌ → ✅ corrigé (voir 2.1) |

## 2. Incohérences corrigées dans l'atelier

### 2.1 Bloquant : le moteur ne se chargeait pas en fichier local
Si on ouvrait le fichier par double-clic (`file://`), Chrome refusait les messages entre l'atelier et le moteur, parce que l'origine `file://` ne correspondait pas à l'origine opaque `null`. L'atelier restait bloqué sur « Chargement du moteur », alors qu'il se présente comme un « Fichier autonome ».
**Correction :** le pont et l'atelier acceptent maintenant l'origine opaque d'un fichier local. Ils vérifient toujours que le message vient de la bonne fenêtre. L'empreinte du pont a été recalculée (`bridgeHash` = `cedc1b5e…2f51`). Le cœur du moteur n'a pas changé.

### 2.2 Banc technique non reproductible
L'atelier affichait « 512 thèmes · 70 blocages · 442 sorties » sans dire quel échantillon avait été utilisé.
**Correction :** les chiffres viennent maintenant du banc exhaustif, recalculé sur les 65 536 thèmes :

| Sortie | Thèmes | Part |
|---|---|---|
| Nul | 36 177 | 55,2 % |
| Victoire R1 | 10 870 | 16,6 % |
| Victoire R7 | 9 945 | 15,2 % |
| Bloqué : égalité des forces de M15 | 6 986 | 10,7 % |
| Bloqué : double repos du juge non chiffré | 1 558 | 2,4 % |

L'ancien échantillon de 512 thèmes donnait des proportions comparables (10,9 % et 2,7 %). L'interface lit désormais ces valeurs depuis la configuration au lieu de nombres écrits en dur.

### 2.3 Autres corrections
1. **Lien « Se connecter » vers `/signin-with-chatgpt`** : c'était un reste de la version en ligne, sans effet dans un fichier autonome. Il est remplacé par « Recharger la page ».
2. **« Connecte-toi pour conserver ces observations »** : il n'existe pas de compte en version locale. Le message invite maintenant à exporter les données.
3. **Onglet Comparaison** : l'élément des maisons impaires s'affichait « Impaire ». Il affiche maintenant le bon élément, comme le moteur : M1 Feu, M2 Air, M3 Eau, M4 Terre, etc.
4. **Thèmes de référence modifiables** : on pouvait réécrire les 16 maisons d'une référence protégée et l'enregistrer. Les références sont maintenant en lecture seule. Pour les essais calculés, seuls le titre et les notes restent modifiables, ce qui garde les maisons cohérentes avec le calcul.
5. **Règles mobilisées** : chaque fiche de référence citait seulement REG-001 et KREG-005, quel que soit le mécanisme qui avait tranché. Elle cite maintenant aussi la règle de la phase décisive (KREG-002 même boucle, KREG-006 ressources partagées, KREG-007 à KREG-011…). La liste se met à jour à chaque rejeu.
6. **Filtre des tests** : le type « Exploration », utilisé par les fiches créées depuis un calcul, manquait dans le filtre.
7. **« Charger le premier nul »** remplissait les mères sans le titre, les équipes ni le résultat attendu, contrairement à « Étudier ce thème ». C'est harmonisé.
8. **Compteurs écrits en dur** (« /11 », « 11 références », « / 6 » dans la galerie) : ils sont calculés depuis les données.
9. **Tutoiement / vouvoiement mélangés** (« Renseignez », « Mettez », « Votre moteur, vos décisions »…) : tout est passé au tutoiement, qui était majoritaire.
10. **Questions KAMB-002 et AMB-001** : elles traitent le même double repos, l'une pour la valeur, l'autre pour le verdict. Elles se renvoient maintenant l'une à l'autre.

## 3. Constat important pour faire avancer le système (nouvelle question KAMB-003)

**Le moteur déclare nul 55,2 % des thèmes possibles.** En football, le nul arrive à peu près une fois sur quatre.

La cause est structurelle. Les 16 figures se répartissent en **deux réseaux de 8** :

- Puer, Via, Fortuna Minor, Cauda Draconis, Caput, Rubeus, Conjunctio, Aquisitio
- Puella, Laetitia, Amissio, Carcer, Populus, Albus, Tristitia, Fortuna Major

Quand les deux pôles sont dans le même réseau, KREG-002 (même boucle, 6 656 thèmes) ou KREG-006 (ressources partagées, 26 112 thèmes) déclare le nul. Cela fait **32 768 thèmes, soit exactement la moitié**. KREG-006 colle parfaitement au corpus : 4 nuls sur 6, et aucune des 5 victoires. Mais elle a été construite à partir de ce corpus, et un accord sur ces 11 cas ne prouve pas qu'elle prédit bien de nouveaux matchs.

Cette observation est ajoutée comme question ouverte **KAMB-003**. Aucune règle n'a été changée : la décision te revient.

Autres points à examiner (non modifiés) :
- **Asymétrie R1/R7** sur le banc exhaustif : 10 870 victoires R1 contre 9 945 R7. Pour la règle confirmée DUELS_FIGURES, c'est 152 contre 40, et pour les concordances élémentaires, 60 contre 11. Voir la section 3 bis.

## 3 bis. Asymétrie R1/R7 : diagnostic

**Test d'inversion (TST-003, désormais Conforme).** Les 65 536 thèmes ont été recalculés avec les pôles R1 et R7 échangés. Les **65 536 verdicts s'inversent exactement** : 1↔2, nul↔nul, blocage↔blocage. Le code de décision ne favorise donc aucun camp, et il n'y a aucun biais de programmation à corriger.

**Origine de l'écart.** L'écart vient de la définition des pôles dans le moteur : R1 = maison de repos de la figure en M1, et R7 = R1 + 6. Les deux pôles ne sont pas construits de la même façon, donc leurs chances ne sont pas égales sur l'ensemble des thèmes.

**Pourquoi ne pas « forcer » la symétrie.** J'ai essayé R7 = R1 + 8 (la maison opposée) :

| Définition | Victoires R1 | Victoires R7 | Références conservées |
|---|---|---|---|
| R7 = R1 + 6 (actuelle) | 10 870 | 9 945 | 11/11 |
| R7 = R1 + 8 (essai) | 10 550 | 10 037 | 5/11 |

L'écart persiste et 6 références sont perdues. Changer la définition des pôles serait une nouvelle doctrine, pas une correction. La question est consignée en **KAMB-004**. L'écart (52 % des victoires pour R1) peut aussi refléter un avantage voulu, par exemple l'avantage du terrain si R1 est l'équipe qui reçoit : à vérifier sur de nouveaux matchs.

Scripts : `outils/symetrie_r1_r7.js` (test d'inversion) et `outils/poles_decalage.js` (essai d'un autre décalage).
- **Libellé du moteur** : « Victoire R7 — R7 — en essai ». Le nom d'équipe par défaut répète le camp. C'est un détail cosmétique, situé dans le moteur, donc non modifié.
- **Titre interne du moteur** : « Système_teste-4 — UI de référence » ne correspond pas au nom koun-1. Non modifié, pour garder l'empreinte du cœur.

## 3 ter. Camp des maisons : correction du moteur (version 1.12.1-essai)

**Signalement du propriétaire** (thème Amissio · Amissio · Carcer · Laetitia) : « Les maisons M10, M6, M8, M16 sont pour R1 en base et en résultante. »

**Constat.** Le moteur attribuait les maisons aux camps de deux façons contradictoires :
- **Par les figures** (réseau front direct + binômes de chaque pôle) : c'est ce qu'utilisent le verdict, le BTTS et les incidents. C'était déjà conforme.
- **Par la distance au pôle** (`maisonVersCamp`) : la maison va au pôle le plus proche sur le cercle. Avec R1 = M6 et R7 = M12, M10 et M16 étaient données à R7. Neuf couches d'analyse de l'onglet « Moteur intégré » utilisaient ce calcul.

**Correction.** `maisonVersCamp` attribue maintenant la maison au camp des figures qu'elle porte, en base **et** en résultante. Si la base et la résultante appartiennent à des camps différents, la maison est « partagée ». M16, qui n'a pas de résultante, suit sa base.

Résultat sur ce thème :

| Camp | Maisons |
|---|---|
| R1 | M2, M4, M6, M8, M10, M14, M16 |
| R7 | M12 |
| Partagées | M1, M3, M5, M7, M9, M11, M13, M15 |

**Vérifications :**
- Les 11 références sont inchangées (11/11).
- Le banc exhaustif de 65 536 thèmes est identique : aucun verdict ne change, puisque le verdict utilisait déjà les figures.
- Les 9 couches d'analyse tournent sans erreur sur 400 thèmes au hasard.
- L'empreinte du moteur est recalculée : `642bb266…beb7`.

L'atelier affiche désormais le camp de chaque maison dans la colonne « Front · Camp » du calcul.

**À noter.** Ce thème reste une **Victoire R7 en essai**. R1 tient 7 maisons et R7 une seule, mais le verdict est tranché par M15, qui est partagée : Populus (R1) y a 1 %, Aquisitio (R7) y a 100 % en repos propre. Compter les maisons tenues ne colle pas au corpus : VICTOIRE 1 est gagnée par R7 alors que R1 tient 5 maisons contre 3, et VICTOIRE 4 est gagnée par R1 alors qu'il en tient 3 contre 5. Aucune règle de décision n'a donc été ajoutée.

## 3 quater. Points cardinaux et éléments alignés sur les fronts (version 1.13.0-essai)

**Vocabulaire cardinal (KREG-012, KREG-013).** Chaque front compte quatre points : Est face à Ouest, Nord face à Sud. Chaque maison déplace le point cardinal de la même façon sur les 4 fronts :
- même point : M5, M6, M15 ;
- Est↔Nord et Ouest↔Sud : M1 à M4 ;
- vis-à-vis : M7, M8, M13, M14 ;
- Est↔Sud et Nord↔Ouest : M9 à M12.

Les notions de front 1, 2 et 3 sont retirées de l'atelier et de la doctrine des maisons du moteur. Les anciens panneaux du moteur complet utilisent encore des étiquettes F1/F2/F3 en interne.

**Éléments des figures = élément du front (KREG-015).** A Feu, B Air, C Eau, D Terre. C'est la décision du propriétaire, et c'est la seule table qui donne raison à la règle « le renfort le plus concordant domine » sur VICTOIRE 3 (renfort M8 de R1 : 110 ; renfort M12 de R7 : 2).

| Banc exhaustif (65 536) | 1.12 | 1.13.0 |
|---|---|---|
| Nul | 36 177 | 35 895 (54,8 %) |
| Victoire R1 | 10 870 | 14 274 (21,8 %) |
| Victoire R7 | 9 945 | 13 790 (21,0 %) |
| Bloqué : égalité M15 | 6 986 | **0** |
| Bloqué : double repos | 1 558 | 1 577 |
| Symétrie R1/R7 | 65 536/65 536 | 65 536/65 536 |

Le BTTS et les incidents sont inchangés. Avec les règles de décision actuelles, **9 références sur 11** sont concordantes : NUL 1 donne R1 et VICTOIRE 3 donne nul. Ces deux cas doivent être tranchés par les règles de renfort en cours d'élaboration (KREG-014 : M8 ; M12 ; concordance). Les instantanés des références ont été recalculés avec la version 1.13.0, et KAMB-001 (égalité M15) est résolue.

## 3 quinquies. Lecture d'ensemble et victoire assurée (version 1.14.0-essai)

Les principes ont été donnés par le propriétaire maison par maison, puis intégrés au moteur, **en essai** :

- **KREG-016, lecture d'ensemble.** Pôles dans la même boucle : nul. Sinon, 1 point par signal :
  - M8, M12 et M16 renforcent le pôle qu'elles portent (M8 et M16 aussi par son miroir) ;
  - M4 affaiblit le pôle qu'elle porte ;
  - en M15 et M7, le plus fort marque quand un pôle ou son miroir fait face à l'autre camp.

  À égalité, le renfort Terre le plus concordant l'emporte. M16, sentence finale, confirme ou annule la victoire du camp en tête.
- **KREG-017, victoire assurée.** Le gagnant a la victoire assurée si l'antagoniste de son pôle (k−3) est contrôlé par k−6 (plus fort) ou mal positionné (absent ou à 1 %). Cette définition a été trouvée par une recherche systématique de 79 définitions : aucune ne fait de cette condition, à elle seule, la règle qui désigne le gagnant.
- Les anciens arbitrages en essai (KREG-007 à KREG-011 : double résistance, compensation, duel des pôles, juge M15, concordances) sont marqués **Remplacée**. Les règles confirmées (même boucle et miroir, duels de figures) gardent la priorité.

| Contrôle | Résultat |
|---|---|
| Références | **11/11** (9/11 en 1.13.0) |
| Victoires assurées dans le corpus | VICTOIRE 3, VICTOIRE 4, AZ–Villarreal |
| Victoires non assurées | VICTOIRE 1, VICTOIRE 2 |
| Symétrie R1/R7 | 65 536/65 536 |
| Banc : nul / R1 / R7 / sans signal | 40 743 (62,2 %) / 13 673 (20,9 %) / 10 507 (16,0 %) / 613 (0,9 %) |
| Victoires assurées sur le banc | R1 6 459, R7 4 617 |
| BTTS et incidents | inchangés |

**Limites :**
- Le 11/11 est obtenu sur le corpus qui a servi à élaborer les règles : ce n'est pas une preuve de fiabilité.
- Le taux de nul (62 %) reste bien au-dessus de celui du football.
- Il faut maintenant enregistrer des prédictions **avant** de nouveaux matchs.

## 4. Prochaine étape recommandée
Enregistrer les prédictions du moteur **avant** de nouveaux matchs (Essayer un thème → Enregistrer l'essai), puis comparer après coup. C'est la seule façon de mesurer la fiabilité réelle, et en particulier de trancher KAMB-001, KAMB-002 et KAMB-003.

## 5. Reproduire l'audit
Les scripts sont dans [`outils/`](outils/) :
- `split.js` et `j.js` extraient le moteur, le pont et la configuration.
- `run_refs.js` rejoue les 11 références.
- `bench.js` et `bench2.js` lancent le banc exhaustif (environ 4 minutes).
- `patch.js` applique les corrections et reconstruit le HTML. Il refuse de s'exécuter si le cœur du moteur a été modifié.
