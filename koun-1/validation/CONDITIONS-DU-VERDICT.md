# Conditions de chaque partie du verdict (état du moteur au 2026-11-27)

Ordre de priorité : 1 Vainqueur / Nul → 2 Deux marquent → 3 R1 / R7 marque → 4 Volume de buts → 5 Mi-temps. Les incidents sont à part.
Une partie applique ses conditions et ne cède que si elle contredit une partie plus haute ; la page dit alors « imposé par… ».

## 1. Vainqueur ou Nul (`verdict` → `decision`)
**a. Nul fréquent d'abord** — on additionne 7 signes ; score **≥ +3 → Nul**, même si une victoire est appelée.
| Signe | Valeur |
|---|---|
| Noyau Terre : figures du noyau (Albus, Tristitia, Fortuna Major, Populus) comptées en bases et résultantes, figure chez elle comptée comme Populus ; noyau ≥ mobiles (Amissio, Carcer, Puella) | +1 ; sinon −1 |
| Triplet mobile : la distance de R1 à R7 ou leur somme est Amissio, Carcer ou Puella | −1 |
| Équilibre des deux parties (écarts de base et de résultante nuls) | +1 |
| Terre de M1, M2, M3 identique (toute saturée ou toute ouverte) | +1 |
| Terre de M14 saturée (témoin des filles) | +1 |
| Diagonales des nœuds peu concrétisées : moins de 4 résultantes à Terre saturée sur M1, M6, M11, M16, M4, M7, M10, M13 | +1 |
| Le front de R7 attaque celui de R1 (A→D, B→A, D→C, C→B) | +1 |

**b. Sinon, victoire appelée** (une seule des deux voies) :
- **Accord** : dans le front de chaque pôle, ses deux nœuds diagonaux (A : M13, M1 · B : M10, M6 · C : M7, M11 · D : M4, M16) ; on compte ceux dont la résultante a la Terre saturée.
  Le pôle qui en a le plus est désigné **et** les nœuds de coordination (base M1 + base M7, résultante de M9, base M2 + base M8, lus dans le front de chaque pôle) désignent le même pôle → victoire de ce pôle.
- **M1-M10** (seulement si l'accord n'appelle pas) : les liaisons Terre M1–M5 et M10–M14 (somme des résultantes) sont toutes deux en arrêt (Terre impaire) → victoire de R1.

**c. Sinon → victoire de R1** (avantage du domicile).
**Qualificatif « victoire nette »** : victoire appelée, score de convergence de victoire |≥ 2| et au moins un arrêt.

## 2. Deux marquent (`hierarchie` → `deux`)
**Oui** si R1 et R7 ont chacun une figure marquante (partie 3), **ou** si **M11 est plein** (résultante de M11 avec l'Eau saturée). Sinon Non.
Ce qu'elle impose : Oui → les deux pôles marquent ; Non avec un Nul → 0-0 ; Non avec une victoire → le perdant ne marque pas.

## 3. R1 / R7 marque (`marquePole`)
Figures du pôle : **lui-même et son front direct (f + 4)**. Le pôle a une figure marquante si l'une d'elles est :
- posée dans un **canal Terre** (M4, M8, M12, M13, M14, M15) où elle est **saturée** — un de ses niveaux à 1 point rencontre un 1 de la maison (1 + 1 = 2), ou c'est Populus —
  **et** la Terre de la résultante est **ouverte** ;
- ou posée en **M11** et M11 est plein (Eau²).
Elle cède si la victoire ou « deux marquent » impose le contraire.

## 4. Volume de buts (`butsEstimes`)
Arrêt = l'antagoniste d'une maison (h − 3) posé en base dans cette maison (M1 à M15). M11 plein = Eau saturée dans la résultante de M11.
| Arrêt | M11 | Buts attendus |
|---|---|---|
| oui | plein | 4,3 |
| oui | vide | 3,4 |
| non | plein | 3,1 |
| non | vide | 2,3 |
Elle cède : au moins autant de buts que d'équipes qui marquent ; 0 si aucune ne marque.

## 5. Mi-temps
- **1re mi-temps (`rythme`)** : figure = somme des bases de **M1, M5, M12, M15**. But attendu si la figure est **rapide** (Feu et Air saturés, hors Populus)
  **ou attaquée** (son antagoniste f − 3 posé en base, attaque non bloquée : bloquée seulement par un protecteur f − 6 posé hors de M1, M5, M12, M15 et sans antagoniste dans ces maisons),
  **et** son binôme relié au thème (le binôme, son antagoniste ou son protecteur posé en base). Équipe désignée : celle dont le front porte la figure ou son protecteur en base.
- **2e mi-temps (`secondeMiTemps`)** : figure = somme des bases de **M4, M5, M13, M15** ; équipe désignée : celle dont le front porte en base cette figure ou son protecteur.
- Elles cèdent : ne désignent que des équipes qui marquent ; pas de but en 1re mi-temps si aucune équipe ne marque.

## Incidents (`incidentVerdict`) — indépendants
- **Débordement** : énergie EB d'un pôle à 3 niveaux impairs (figure énergie M16 + figure du pôle, et boucle du front binôme) — l'incident se fixe sur ce pôle si un seul est dans ce cas.
- **Arrêt** dans le thème.
- Débordement **et** arrêt → **probable** ; l'un des deux → **possible** ; aucun → **aucun**.
