# Conditions de chaque partie du verdict (état du moteur au 2026-11-27)

Ordre de priorité : 1 Vainqueur → 2 Deux marquent → 3 R1 / R7 marque → 4 Volume de buts → 5 Mi-temps. Les incidents sont à part.
La règle de marquage (partie 3) s'applique telle quelle à tous les thèmes, avec une seule exception : dans les boucles différentes, le vainqueur marque. En même boucle, si un seul pôle marque, c'est lui qui gagne.

## 1. Vainqueur (`verdict` → `decision`)
Les anciennes règles du nul ont été supprimées le 2026-11-27 ; seule l'égalité n-n (d) peut donner un nul.
**a. Victoire appelée** (une seule des deux voies) :
- **Accord** : dans le front de chaque pôle, ses deux nœuds diagonaux (A : M13, M1 · B : M10, M6 · C : M7, M11 · D : M4, M16) ; on compte ceux dont la résultante a la Terre saturée.
  Le pôle qui en a le plus est désigné **et** les nœuds de coordination (base M1 + base M7, résultante de M9, base M2 + base M8, lus dans le front de chaque pôle) désignent le même pôle → victoire de ce pôle.
- **M1-M10** (seulement si l'accord n'appelle pas) : les liaisons Terre M1–M5 et M10–M14 (somme des résultantes) sont toutes deux en arrêt (Terre impaire) → victoire de R1.

**b. Sinon → victoire de R1** (avantage du domicile).
**d. Égalité n-n (en cours d'étude)** : les deux pôles au même niveau de marquage, **aucun pôle bloqué** (blocage : l'antagoniste f − 3 du pôle posé en base, M1 à M16, garde ses points actifs dans la résultante — chacun de ses 1 tombe sur un 2 de la maison ; en M16, filtre final, c'est toujours le cas), et **Populus en base dans la boucle de front d'un pôle** (maisons f, f + 4, f + 8, f + 12) → chaque équipe peut marquer n buts. 126 matchs : 11 cas, 5 nuls.
**c. Boucles différentes** (R1 et R7 l'un en A/C, l'autre en B/D : le front de l'un attaque l'autre ; règle du propriétaire, en cours d'étude) — prioritaire sur a, b et c' :
- l'**arme** de l'attaquant = l'antagoniste de l'attaqué (figure du front de l'attaquant) ; la **défense** de l'attaqué = l'antagoniste de l'attaquant (figure de la boucle de son binôme, front de son protecteur f − 6) ;
- défense posée dans les **Filles (M5–M8)** → l'attaqué gagne (12 justes, 3 nuls, 3 faux sur 87) ; sinon arme ou défense posée → l'attaquant gagne (arme seule 15/5/9 ; les deux, défense hors Filles 9/8/5 ; défense seule hors Filles 4/2/0) ; ni arme ni défense → R7 (7/4/1).
- Le vainqueur désigné marque (imposé) : il a marqué 21 fois sur 25 quand la règle de marquage disait le contraire.

**c'. Même boucle — le marquage commande** : si un seul pôle marque selon la partie 3, la victoire lui revient, quel que soit l'appel.
**Qualificatif « victoire nette »** : score de convergence de victoire |≥ 2| dans le sens de la décision et au moins un arrêt.

## 2. Deux marquent (`hierarchie` → `deux`)
**Oui** seulement si R1 **et** R7 marquent selon la règle de marquage (partie 3). Sinon Non.
Ce qu'elle impose : Oui → les deux pôles marquent ; Non → le perdant ne marque pas.

## 3. R1 / R7 marque (`marquePole`)
Bonne position d'une figure (le pôle, son front direct f + 4, son miroir f + 8) :
- en base dans un **canal Terre** (M4, M8, M12, M13, M14, M15) et elle **réagit** : un 1 de la figure rencontre un 1 de la maison (1 + 1 = 2), sur l'un de ses 4 niveaux ;
- **Populus** en base d'un canal Terre (2 + 2 neutre) : seulement si la Terre de la résultante est saturée (M4, M13) ;
- le **pôle dans sa propre maison** avec la Terre de la résultante saturée, **sauf s'il y est chez lui** (résultante Populus : neutre, ne compte pas).

Verdict :
- **Marque (assuré)** : le pôle et son front direct en bonne position.
- **Marque** : le pôle ou son front direct, ou l'un d'eux en **M11** avec l'Eau de la résultante saturée.
- **Marque possible** : seul le miroir.
- **Ne marque pas** : aucun des trois.
- **Ne marque pas (bloqué par l'antagoniste)** : l'antagoniste f − 3 du pôle posé en base (M1–M16) garde ses points actifs dans la résultante (en M16 toujours). Seule la figure de base bloque ; la maison ne bloque pas.
- **Ne marque pas (bloqué)** : Populus en base produit l'antagoniste (f − 3) du pôle **et** celui de son front direct (Paris – Marseille : Albus en M4 contre Rubeus, Tristitia en M8 contre Conjunctio). En cours d'étude.
- En suspens : but annulé ou bloqué par l'antagoniste. Elle ne cède qu'au vainqueur des boucles différentes, qui marque.

## 4. Volume de buts (`butsEstimes`)
Arrêt = l'antagoniste d'une maison (h − 3) posé en base dans cette maison (M1 à M15). M11 plein = Eau saturée dans la résultante de M11.
| Arrêt | M11 | Buts attendus |
|---|---|---|
| oui | plein | 4,3 |
| oui | vide | 3,4 |
| non | plein | 3,1 |
| non | vide | 2,3 |
Puis **Populus et figures chez elles** (figure posée en base dans sa propre maison, M1–M15), ajouté à la valeur :
| Thème | Écart |
|---|---|
| Populus en base, 0 figure chez elle | −0,3 |
| Populus en base, 1 figure chez elle | −0,1 |
| Populus en base, 2 figures ou plus chez elles | +0,6 |
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
- Sinon, trois signes : **dragon en M6/M12** (Rubeus ou Puer posé en base de M6 ou M12, qui y produit Caput ou Cauda) ; **R7 bloqué** ; **R1 bloqué** (antagoniste f − 3 posé en base qui garde ses points actifs ; en M16, toute figure bloque son adversaire, Populus compris).
  0 signe : peu probable (4/30) · 1 signe : possible (8/26) · 2 signes ou plus : probable (8/12).
- Camp : le pôle bloqué reçoit le rouge, **sauf si son bloqueur est posé dans les Filles (M5–M8)** → l'adversaire ; sinon, avec le dragon, le pôle de même front que la figure martiale ; sinon R7. Juste 19 fois sur 21.

**Penalty**
- Signes : **un arrêt avec des fronts de R1 et R7 non alliés, ou le front de R1 qui attaque celui de R7** ; **la figure d'un pôle est celle de la sentence M16** ; **le dragon M5-M11** (Laetitia ou Tristitia posé en base de M5 ou M11, qui y produit Caput ou Cauda — l'axe de la joie et de la tristesse, comme M6-M12 l'axe martial du rouge).
- Quatrième signe : **la 4e mère intacte** — la figure de base de M4 (maison de repos d'Albus) a l'Eau saturée et ne réagit pas avec Albus (Populus exclu) ; Fortuna Minor ou Aquisitio en 4e mère y produisent le dragon (7 penalties sur 11).
  0 signe : peu probable (2/21) · 1 ou 2 signes : possible (24/69) · 3 signes ou plus : probable (12/18).
- Camp : le pôle dont la figure est en M16 ; sinon le pôle dont le front attaque l'autre ; sinon R1. Juste 25 fois sur 34.
