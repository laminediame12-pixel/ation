# Étude des fronts — attaques, canaux et nœuds (propriétaire, 2026-11-26), vérifiée par le calcul

**Logique** : quand F1 attaque F2, les niveaux identiques restent (canaux survivants), les autres sont bloqués.
Les niveaux restants sont exactement les niveaux saturés de la somme F1 + F2. L'attaquant d'une figure f est son antagoniste f − 3.
Nœuds : un niveau seul i → M(5i+1) (Feu M1, Air M6, Eau M11, Terre M16) ; deux niveaux i, j → croisement M(4j+i+1) (Feu+Terre : M13, ou M4 dans l'autre sens).

**Cycle** : A → D, B → A, D → C, C → B (vérifié : l'antagoniste de chaque figure est dans le front attaquant).

| Attaque | Paires exactes (attaquant → attaqué) | Reste | Nœud |
|---|---|---|---|
| A → D | Puer → Albus ; Fortuna Minor → Fortuna Major | rien | blocage total |
| A → D | Via → Tristitia ; Cauda → Populus | Terre | M16 |
| B → A | Laetitia → Via ; Carcer → Cauda | Feu | M1 |
| B → A | Puella → Puer ; Amissio → Fortuna Minor | Feu + Terre | M13 |
| D → C | Populus → Caput ; Tristitia → Conjunctio | Feu | M1 |
| D → C | Albus → Rubeus ; Fortuna Major → Aquisitio | Feu + Terre | M13 |
| C → B | Aquisitio → Laetitia ; Caput → Amissio ; Rubeus → Carcer ; Conjunctio → Puella | Eau | M11 |

**Corrections par rapport au texte d'origine** : les parties A → D et B → A sont exactes. Pour D → C et C → B, les paires avaient été prises
dans l'ordre des listes (Albus → Caput…) au lieu de l'antagoniste (Populus → Caput…) ; avec les vraies paires, D → C laisse Feu ou Feu + Terre
(M1 / M13), pas l'Eau, et C → B laisse toujours l'Eau seule (M11), pas l'Air. (Même avec l'appariement d'origine, Albus → Caput laisserait Feu + Eau.)

**Conséquences structurelles exactes**
1. **L'Air ne survit jamais** : dans les 16 attaques, l'attaquant et l'attaqué diffèrent toujours en Air.
2. Les restes ne prennent que cinq formes : rien (Via), Terre (Cauda), Feu (Caput), Feu + Terre (Conjunctio), Eau (Puer) — ce sont les sommes f + (f − 3).
3. Les nœuds de sortie sont M1, M11, M13, M16 et le blocage total ; M6 (Air) n'est jamais une issue d'attaque.
4. C → B est la seule attaque à issue unique : B garde toujours l'Eau seule (M11).
5. Relation entre les fronts de R1 et R7 (9 363 thèmes) : R1 attaque R7 25 %, R7 attaque R1 25 %, même front 20 %, fronts alliés 30 %.
   (Une première version de cette note disait « toujours alliés » : c'était faux, corrigé.)

## Sur les matchs (117 connus, outils/attaque_poles.js)
- **Le front de R7 attaque celui de R1 : 11 nuls sur 30 (37 %)**, dont 5 sur 11 à l'aveugle, contre 14 nuls sur 87 dans les autres cas ;
  l'avantage du domicile disparaît (R1 9 victoires, R7 10).
- R1 attaque R7 : 19 / 5 / 15 ; même front : 9 / 4 / 2 ; fronts alliés : 19 / 5 / 9. L'attaquant gagne 29 fois, perd 24 : pas de loi de victoire.
- « R7 attaque R1 » devient le 7e signe de la convergence du nul (corrélation 0,355 → 0,391 ; nul fréquent à l'aveugle 4/9 → 6/13) ;
  décision du moteur à l'aveugle : 21 sur 37 (« R1 toujours » 19).
