# Conditions de chaque partie du verdict (état du moteur au 2026-11-27)

Ordre de priorité : 1 Vainqueur → 2 Deux marquent → 3 R1 / R7 marque → 4 Volume de buts → 5 Mi-temps. Les incidents sont à part.

**Chaîne d'attaque (propriétaire, 2026-11-27)** : Mh attaque avec M(h+4) et M(h+1) attaque M(h+4), sur les 16 maisons. La figure g attaque g + 3 ; elle attaque avec son front direct g + 4, qui a son propre attaquant g + 1.
**Blocage — une seule définition pour tout le moteur (`bloqueurs`)** : la figure g est bloquée par son antagoniste g − 3 présent intact, soit **posé en base avec ses points actifs** (chacun de ses 1 tombe sur un 2 de la maison ; en M16 toujours), soit **reproduit par Populus** posé dans sa maison (Populus en M4 donne Albus, qui bloque Rubeus ; Populus en M16 bloque Caput). **Populus (propriétaire)** : « Populus en résultante laisse passer l'énergie de la figure où résulte Populus, mais aussi Populus en base bloque l'adversaire de la maison où loge Populus ». Populus en base : la maison rend sa figure, qui bloque son adversaire. Populus en résultante (la figure posée chez elle) : son énergie passe — on ne peut pas l'y bloquer, et elle ne bloque pas. Thème saturé (chaque figure chez elle) : rien n'est bloqué ; thème Populus : tout est bloqué, sauf Populus chez lui en M16. 147 matchs : pôles chez eux que leur antagoniste bloquait, 8 changent de marquage, 6 justes (lu à l'inverse, la figure chez elle qui bloque : 2 justes sur 10). Seule la figure de base bloque ; la figure de la maison ne bloque que reproduite par Populus.
La règle de marquage (partie 3) s'applique telle quelle à tous les thèmes, avec une seule exception où la partie 1 commande : le vainqueur annoncé marque toujours (imposé quand sa règle dit le contraire ; 126 matchs : 30 vainqueurs imposés, 25 ont marqué). En même boucle, si un seul pôle marque, c'est lui qui gagne.

**Vue « thème somme » (propriétaire, 2026-11-28)** : le moteur calcule le thème de vérification (`themeVerification` : mères M1, M4, M7, M10) et le thème somme (`themeSomme` : principal + vérification, maison par maison, qui est lui-même un thème — mères Populus, M2+M4, M3+M7, M3 ; vérifié sur les 65 536). En vue « thème somme », la page donne au moteur les mères du thème somme : le verdict affiché (titre « Verdict du thème somme »), l'analyse des pôles, les maisons de calcul, le cercle et la cartographie sont tous calculés sur ce thème, avec les mêmes conditions que ci-dessous. Contrôlé par `outils/verifier_affichage.js` (deuxième passe).

## 1. Vainqueur (`verdict` → `decision`)
Les anciennes règles du nul ont été supprimées le 2026-11-27 ; seules l'égalité n-n (d), l'égalité des pôles bloqués (c'') et l'égalité par le thème de vérification (e) peuvent donner un nul.
**a. Victoire appelée** (une seule des deux voies) :
- **Accord** : dans le front de chaque pôle, ses deux nœuds diagonaux (A : M13, M1 · B : M10, M6 · C : M7, M11 · D : M4, M16) ; on compte ceux dont la résultante a la Terre saturée.
  Le pôle qui en a le plus est désigné **et** les nœuds de coordination (base M1 + base M7, résultante de M9, base M2 + base M8, lus dans le front de chaque pôle) désignent le même pôle → victoire de ce pôle.
- **M1-M10** (seulement si l'accord n'appelle pas) : les liaisons Terre M1–M5 et M10–M14 (somme des résultantes) sont toutes deux en arrêt (Terre impaire) → victoire de R1.

**b. Sinon → victoire de R1** (avantage du domicile).
**d. Égalité n-n (en cours d'étude)** : les deux pôles au même niveau de marquage, **aucun pôle bloqué** (blocage : définition unique ci-dessus), et **Populus en base dans la boucle de front d'un pôle** (maisons f, f + 4, f + 8, f + 12) → chaque équipe peut marquer n buts. 126 matchs : 11 cas, 5 nuls.
**c. Boucles différentes** (R1 et R7 l'un en A/C, l'autre en B/D : le front de l'un attaque l'autre ; règle du propriétaire, en cours d'étude) — prioritaire sur a, b et c' :
- l'**arme** de l'attaquant = l'antagoniste de l'attaqué (figure du front de l'attaquant) ; la **défense** de l'attaqué = l'antagoniste de l'attaquant (figure de la boucle de son binôme, front de son protecteur f − 6) ;
- défense posée dans les **Filles (M5–M8)** → l'attaqué gagne (12 justes, 3 nuls, 3 faux sur 87) ; sinon arme ou défense posée → l'attaquant gagne (arme seule 15/5/9 ; les deux, défense hors Filles 9/8/5 ; défense seule hors Filles 4/2/0) ; ni arme ni défense → R7 (7/4/1).
- Le vainqueur désigné marque (imposé) : il a marqué 14 fois sur 17 quand la règle de marquage disait le contraire.
- **Indice contre les boucles** (2026-11-28, après Real Salt Lake – Vancouver 0-1, où la règle donnait R1 ; en cours d'étude) : si la victoire des boucles reste en place après la vérification (partie e) et que l'indice de victoire (score de convergence) est à −2 ou moins contre elle, **l'autre pôle gagne**. 161 matchs : 10 cas, 7 victoires de l'autre pôle, 2 nuls, 1 du vainqueur des boucles ; verdicts justes 104 → 110 (126 premiers matchs 80 → 85, jamais vus 24 → 25). Placée avant la vérification, elle n'en gagnait que 2.
- Arme et défense jouent par leur **présence** en base (attaque entre fronts) : lues avec le blocage strict, la règle tombe à 47 justes contre 62 ; la présence est gardée.

**c'. Même boucle — le marquage commande (corrigée le 2026-11-28)** : si un seul pôle marque selon la partie 3 : **seul R1 marque → R1 gagne**, sauf s'il marque **par M11 plein → R7 gagne** (le seul marqueur par M11 a perdu 7 fois sur 7) ; **seul R7 marque → R1 garde l'avantage du domicile** (R1 a gagné 10 fois sur 15, 2 nuls). Avant la correction : 11 justes, 5 nuls, 15 faux ; après : 21 justes, 5 nuls, 5 faux. Bons verdicts : 126 matchs 70 → 75, 26/11 9 → 12, 27/11 6 → 8.
**c''. Les deux pôles bloqués (en cours d'étude)** : hors boucles différentes, aucun pôle ne marque et les deux figures des pôles sont bloquées → égalité (147 matchs : 1 cas, 1 nul — Tijuana – Pumas 1-1 ; 3 cas et 2 nuls avec le blocage partout).
**e. Égalité par le thème de vérification (propriétaire, 2026-11-28 ; en cours d'étude)** : le thème de vérification a pour mères les figures de M1, M4, M7, M10 du thème principal (l'axe angulaire développé en 16 figures ; il montre les zones d'ombre du principal). La vérification d'une vérification… : la chaîne garde la première mère, donc les maisons des pôles, et finit toujours sur un **point fixe** (un thème qui est sa propre vérification : mères a, x, Populus, x), un cycle de 2 ou un cycle de 4 thèmes. Nuls selon la fin de la chaîne (160 matchs) : point fixe 6 sur 9, cycle de 2 16 sur 65, cycle de 4 15 sur 86.
- **Point fixe → égalité** (plus rien ne bouge), **sauf** si la figure répétée du point fixe (mères 2 et 4) est **Tristitia** (l'équilibre reste en suspens) ou si **Populus est en M16** du thème principal (M16 modifie l'équilibre). Les 3 points fixes manqués ont l'un ou l'autre, aucun des 6 nuls ; affiné sur ces 9 cas (sur les 160 matchs, Populus en M16 : 2 nuls sur 11, R1 gagne 7 fois).
- **Cycle de 2** (les deux thèmes du cycle ne diffèrent que par l'échange des mères 2 et 4) : **aucun des deux thèmes du cycle ne désigne le vainqueur annoncé et la figure de M7 ou de M14 est commune au thème et à sa vérification → égalité** (65 matchs en cycle de 2 : 6 nuls sur 8 ; quand le cycle confirme le vainqueur : 2 nuls sur 22).
- Égalités décidées par cette règle : 13, dont 11 nuls (85 %). Bons verdicts : 95 sans cette règle, 104 avec (126 matchs 80, 26/11 13, 27/11 11 ; 105 avec l'ancienne voie du cycle de 2, moins précise : 14 nuls sur 21). Toutes égalités annoncées : 19 nuls sur 29. Exemples : Leganés – Sabadell 0-0 et Groningue – Willem II 1-1 (points fixes), Lyon – Lillestrøm 0-0.
**Qualificatif « victoire confirmée (vérification) »** (2026-11-28, renforcé le même jour ; en cours d'étude ; la décision ne change pas) : la chaîne des vérifications finit sur un cycle de 2 ou de 4 thèmes et aucun de ces thèmes n'annonce le perdant (ils annoncent le vainqueur ou une égalité). Matchs joués : 45 cas, le vainqueur annoncé a gagné 38 fois et n'a perdu que 4 fois (jamais vus 7/8 ; cycle de 2 25/29, cycle de 4 13/16) ; autres victoires annoncées 53 sur 87. Première forme (cycle de 2, les deux thèmes d'accord) : 19 sur 22. **Affinée** (après Al Ettifaq – Al Hilal, où le cycle annonçait Al Ettifaq et la vérification elle-même Al Hilal) : le thème de vérification ne doit pas non plus annoncer le perdant — quand il l'annonce, 9 victoires sur 13 seulement ; sinon 29 sur 32 (126 premiers 26/29, jamais vus 3/3 ; cycle de 2 19/21, cycle de 4 10/11), autres victoires annoncées 62 sur 100. Affiché « ✔ Confirmée (vérification) » à côté de la ligne Victoire.

**Qualificatif « victoire nette »** (jamais sur une égalité) : score de convergence de victoire |≥ 2| dans le sens de la décision et au moins un arrêt.

## 2. Deux marquent (`hierarchie` → `deux`)
**Oui** seulement si R1 **et** R7 marquent selon la règle de marquage (partie 3). Sinon Non.
Ce qu'elle impose : Oui → les deux pôles marquent ; Non → le perdant ne marque pas.

## 3. R1 / R7 marque (`marquePole`)
**Duel des fronts (propriétaire, 2026-11-28)** : tout le front attaque — la quatrième figure du front (f + 12) compte comme le miroir (« marque possible » si elle seule est en bonne position). 161 matchs : marquage par la règle 206 → 219 justes sur 322 pôles, marquage affiché 236 → 239, deux marquent 86 → 89, verdicts inchangés. La saturation de la Terre hors des canaux Terre, essayée aussi, faisait perdre 6 verdicts : non retenue. **Marquage fragile** (signal, pas une règle) : la figure du pôle bloquée par un Populus (blocage total) — 8 pôles sur 15 ont marqué.
Bonne position d'une figure (le pôle, son front direct f + 4, son miroir f + 8) :
- en base dans un **canal Terre** (M4, M8, M12, M13, M14, M15) et elle **réagit** : un 1 de la figure rencontre un 1 de la maison (1 + 1 = 2), sur l'un de ses 4 niveaux ;
- **Populus** en base d'un canal Terre (2 + 2 neutre) : seulement si la Terre de la résultante est saturée (M4, M13) ;
- le **pôle dans sa propre maison** avec la Terre de la résultante saturée, **sauf s'il y est chez lui** (résultante Populus : neutre, ne compte pas).

Verdict :
- **Marque (assuré)** : le pôle et son front direct en bonne position.
- **Marque** : le pôle ou son front direct, ou l'un d'eux en **M11** avec l'Eau de la résultante saturée.
- **Marque possible** : seul le miroir.
- **Ne marque pas** : aucun des trois.
- **Blocage dans la chaîne** (« M1 attaque avec M5 et M2 attaque M5 ») : le pôle est celui qui attaque, son front direct est son moyen ; chacun a son attaquant — le pôle f − 3, le front direct f + 1, le miroir f + 5 (définition unique du blocage). **Pôle bloqué** : il n'attaque plus, même avec son front direct → ne marque pas. **Front direct bloqué** : le pôle marque encore par lui-même. **Miroir bloqué** : il ne compte plus. Paris – Marseille : Rubeus bloqué (Albus intact en M1, Albus reproduit par Populus en M4) → ne marque pas.
- Une figure posée chez elle n'y est pas bloquée (Populus en résultante laisse passer son énergie).
- **Nœuds du bloqueur (propriétaire, 2026-11-28)** : « pour les attaques de front, celui qui bloque bloque pour ses nœuds, aux niveaux actifs en résultante ». Un bloqueur posé en maison h n'agit que sur les nœuds dont h porte une liaison dans la croix de son front (selon qu'elle est haut, droite, bas ou gauche), aux niveaux à 1 point de la résultante de h ; la Terre déviée n'est pas comptée (exemple du propriétaire : Puer en résultante de M1 bloque Albus sur le Feu et l'Air, en M1, M2, M5, M6). Le pôle n'est paralysé (il n'attaque plus, même avec son front direct) que si sa propre maison est parmi ces nœuds ; sinon seules ses positions touchées tombent. Pôles en bonne position arrêtés ainsi : 7 sur 12 ont marqué, contre 145 sur 188 pour les autres (avec le blocage partout : 43/58 contre 109/142).
- Pour le rouge et l'égalité, « pôle bloqué » reste la présence de l'antagoniste intact (lu par les nœuds, le camp du rouge tombe de 19 à 14 justes sur 21).
- Observé (126 matchs, 252 pôles) : assuré 17/25, marque 115/147, possible 13/16, ne marque pas 49/64 ont marqué.
- Elle ne cède qu'au vainqueur des boucles différentes, qui marque.

## 4. Volume de buts (`butsEstimes`)
Arrêt = l'antagoniste d'une maison (h − 3) posé en base dans cette maison (M1 à M16 : Cauda en M16 comprise, chaîne « M13 attaque M16 »). M11 plein = Eau saturée dans la résultante de M11.
| Arrêt | M11 | Buts attendus |
|---|---|---|
| oui | plein | 4,3 |
| oui | vide | 3,4 |
| non | plein | 3,1 |
| non | vide | 2,2 |
Puis **Populus et figures chez elles** (figure posée en base dans sa propre maison, M1–M15), ajouté à la valeur :
| Thème | Écart |
|---|---|
| Populus en base, 0 figure chez elle | −0,3 |
| Populus en base, 1 figure chez elle | −0,1 |
| Populus en base, 2 figures ou plus chez elles | +0,7 |
| Sans Populus | +0,1 |
Elle cède : au moins autant de buts que d'équipes qui marquent ; une égalité où aucun pôle ne marque donne 0 but (0-0).

## 5. Mi-temps
- **1re mi-temps (`rythme`)** : figure = somme des bases de **M1, M5, M12, M15**. But attendu si la figure est **rapide** (Feu et Air saturés, hors Populus)
  **ou attaquée** (son antagoniste f − 3 posé en base, attaque non bloquée : bloquée seulement par un protecteur f − 6 posé hors de M1, M5, M12, M15 et sans antagoniste dans ces maisons),
  **et** son binôme relié au thème (le binôme, son antagoniste ou son protecteur posé en base). Équipe désignée : celle dont le front porte la figure ou son protecteur en base.
- **2e mi-temps (`secondeMiTemps`)** : figure = somme des bases de **M4, M5, M13, M15** ; équipe désignée : celle dont le front porte en base cette figure ou son protecteur.
- Elles cèdent : ne désignent que des équipes qui marquent ; pas de but en 1re mi-temps si aucune équipe ne marque.

## Incidents (`incidentVerdict`) — indépendants, en cours d'étude (108 matchs étiquetés)
**Rouge**
- Veto (match calme) : le front de R7 attaque celui de R1, **ou Albus / Puella posé sur son axe du dragon M9-M15** (Albus, la paix) → pas de rouge (2 rouges sur 40).
- Sinon, trois signes : **dragon en M6/M12** (Rubeus ou Puer posé en base de M6 ou M12, qui y produit Caput ou Cauda) ; **R7 bloqué** ; **R1 bloqué** (définition unique du blocage).
  0 signe : peu probable (5/30) · 1 signe : possible (6/25) · 2 signes ou plus : probable (9/13).
- Camp : le pôle bloqué reçoit le rouge, **sauf si son bloqueur est posé dans les Filles (M5–M8)** → l'adversaire ; sinon, avec le dragon, le pôle de même front que la figure martiale ; sinon R7. Juste 19 fois sur 21.

**Penalty**
- Signes : **un arrêt avec des fronts de R1 et R7 non alliés, ou le front de R1 qui attaque celui de R7** ; **la figure d'un pôle est celle de la sentence M16** ; **le dragon M5-M11** (Laetitia ou Tristitia posé en base de M5 ou M11, qui y produit Caput ou Cauda — l'axe de la joie et de la tristesse, comme M6-M12 l'axe martial du rouge).
- Quatrième signe : **la 4e mère intacte** — la figure de base de M4 (maison de repos d'Albus) a l'Eau saturée et ne réagit pas avec Albus (Populus exclu) ; Fortuna Minor ou Aquisitio en 4e mère y produisent le dragon (7 penalties sur 11).
  0 signe : peu probable (2/21) · 1 ou 2 signes : possible (24/69) · 3 signes ou plus : probable (12/18).
- Camp : le pôle dont la figure est en M16 ; sinon le pôle dont le front attaque l'autre ; sinon R1. Juste 25 fois sur 34.
