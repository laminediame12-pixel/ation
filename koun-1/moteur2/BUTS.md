# Les buts : première mi-temps et « les deux marquent »

Document produit par `outils/buts_doc.js` à partir des matchs réels dont le score est connu (10 matchs, dont 4 avec la mi-temps). Pour les autres matchs réels, seul le vainqueur ou le nul est connu : ils ne peuvent pas servir ici.

## 1. But en première mi-temps

**La règle du propriétaire, telle que le moteur l'applique (`L.butMiTemps`).** On regarde la somme de l'axe angulaire (M1 + M4 + M7 + M10) et les deux pôles :
- **sûr** : l'un d'eux est dans une maison de l'axe en base (M1, M4, M7, M10), ou en résultante en M4 ou M10 ;
- **faible** : il n'est sur l'axe qu'en résultante, en M1 ou M7 ;
- **pas de signal** : aucun n'est sur l'axe.

| Match | Score | Mi-temps | Signal du moteur | Ce que le thème montre | Juste ? |
|---|---|---|---|---|---|
| 8·5·11·7 | 7-0 | inconnue | sûr | la somme de l’axe angulaire donne Tristitia, présente en M1 (base) | non vérifiable |
| 9·13·2·13 | 2-0 | 2-0 | faible | signal en résultante hors de M4 et M10 : la somme Tristitia n’est qu’en résultante en M1, M7 | **non** |
| 2·9·6·5 | 3-3 | inconnue | sûr | pôle sur l’axe : R1 Fortuna Minor en M10 (résultante) | non vérifiable |
| Latium – Bologna (5·14·6·14) | 3-1 | 1-0 | sûr | pôle sur l’axe : R1 Via en M1 (base), R1 Via en M7 (base) | oui |
| Milano – Genoa (7·5·9·6) | 4-0 | 3-0 | sûr | pôle sur l’axe : R1 Aquisitio en M7 (base) | oui |
| Cremonese – Torino (13·12·8·15) | 0-3 | 0-0 | faible | signal en résultante hors de M4 et M10 : la somme Fortuna Major n’est qu’en résultante en M1 | oui |
| 4·7·5·8 | 1-0 | inconnue | sûr | la somme de l’axe angulaire donne Caput, présente en M10 (résultante) ; pôle sur l’axe : R1 Tristitia en M4 (base), R7 Cauda Draconis en M10 (base) | non vérifiable |
| 4·7·10·10 | 2-1 | inconnue | sûr | pôle sur l’axe : R1 Carcer en M4 (base), R1 Carcer en M10 (résultante), R7 Populus en M10 (base) | non vérifiable |
| 4·1·6·7 | 3-0 | inconnue | sûr | la somme de l’axe angulaire donne Albus, présente en M1 (base) ; pôle sur l’axe : R1 Rubeus en M4 (base), R7 Cauda Draconis en M10 (base) | non vérifiable |
| 4·6·7·16 | 5-0 | inconnue | sûr | pôle sur l’axe : R1 Populus en M4 (base), R7 Rubeus en M10 (base) | non vérifiable |

Sur les 4 matchs où la mi-temps est connue, le signal est juste 3 fois.

**Le cas qui manque.** Dans 9·13·2·13, les deux buts sont en première mi-temps (4e et 44e minutes), mais le moteur ne donne qu'un signal faible : la somme de l'axe (Tristitia) n'est qu'en résultante, en M1 et en M7 à la fois. Soit la résultante compte aussi en M1 et M7, soit elle compte quand la somme y est deux fois. À trancher par le propriétaire.

**L'hypothèse de la deuxième mi-temps** (axe miroir 9-12-15-2) n'est juste qu'une fois sur trois : elle n'est pas retenue.

## 2. Les deux équipes marquent

Aucune règle n'est encore dans le moteur. Voici ce que montrent les 10 matchs dont le score est connu, pôle par pôle.

| Match | Score | Pôle | A marqué ? | Positions (dont base) | Force dans sa maison | Meilleure force | Sur l'axe | Chez lui |
|---|---|---|---|---|---|---|---|---|
| 8·5·11·7 | 7-0 | R1 Fortuna Minor | oui (7) | 3 (2) | 55 % | 85 % | oui | non |
| 8·5·11·7 | 7-0 | R7 Carcer | **non** | 2 (1) | 85 % | 85 % | non | non |
| 9·13·2·13 | 2-0 | R1 Albus | oui (2) | 2 (2) | 55 % | 70 % | non | non |
| 9·13·2·13 | 2-0 | R7 Fortuna Major | **non** | 1 (1) | 70 % | 70 % | non | non |
| 2·9·6·5 | 3-3 | R1 Fortuna Minor | oui (3) | 4 (1) | 70 % | 70 % | oui | non |
| 2·9·6·5 | 3-3 | R7 Tristitia | oui (3) | 4 (3) | 100 % | 100 % | non | oui |
| Latium – Bologna (5·14·6·14) | 3-1 | R1 Via | oui (3) | 4 (4) | 100 % | 100 % | oui | oui |
| Latium – Bologna (5·14·6·14) | 3-1 | R7 Caput | oui (1) | 1 (1) | 85 % | 85 % | non | non |
| Milano – Genoa (7·5·9·6) | 4-0 | R1 Aquisitio | oui (4) | 3 (2) | 85 % | 100 % | oui | oui |
| Milano – Genoa (7·5·9·6) | 4-0 | R7 Puer | **non** | 1 (1) | 85 % | 85 % | non | non |
| Cremonese – Torino (13·12·8·15) | 0-3 | R1 Carcer | **non** | 2 (2) | 70 % | 85 % | non | non |
| Cremonese – Torino (13·12·8·15) | 0-3 | R7 Tristitia | oui (3) | 4 (2) | 70 % | 70 % | non | non |
| 4·7·5·8 | 1-0 | R1 Tristitia | oui (1) | 1 (1) | 85 % | 85 % | oui | non |
| 4·7·5·8 | 1-0 | R7 Cauda Draconis | **non** | 2 (1) | 0 % | 1 % | oui | non |
| 4·7·10·10 | 2-1 | R1 Carcer | oui (2) | 3 (2) | 1 % | 100 % | oui | oui |
| 4·7·10·10 | 2-1 | R7 Populus | oui (1) | 1 (1) | 1 % | 1 % | oui | non |
| 4·1·6·7 | 3-0 | R1 Rubeus | oui (3) | 2 (2) | 0 % | 70 % | oui | non |
| 4·1·6·7 | 3-0 | R7 Cauda Draconis | **non** | 4 (3) | 0 % | 55 % | oui | non |
| 4·6·7·16 | 5-0 | R1 Populus | oui (5) | 3 (2) | 85 % | 85 % | oui | non |
| 4·6·7·16 | 5-0 | R7 Rubeus | **non** | 5 (4) | 55 % | 85 % | oui | non |

**Ce qui ressort, sur 13 pôles qui ont marqué et 7 qui n'ont pas marqué :**

| Lecture | Pôles qui ont marqué | Pôles qui n'ont pas marqué |
|---|---|---|
| présent au moins 3 fois dans le thème | 8 sur 13 | 2 sur 7 |
| présent sur l'axe angulaire | 9 sur 13 | 3 sur 7 |
| dans sa maison de repos | 4 sur 13 | 0 sur 7 |

- Pôle présent au moins trois fois : 8 des 13 pôles qui ont marqué, 2 des 7 pôles restés muets. Ce n'est donc pas un signe sûr.
- Pôle présent sur l'axe angulaire : 9 des 13 pôles qui ont marqué, 3 des 7 pôles restés muets. Ce n'est donc pas un signe sûr.
- Pôle dans sa maison de repos : 4 des 13 pôles qui ont marqué, 0 des 7 pôles restés muets. Aucun pôle muet n'est dans ce cas.

**Essai de lecture pour « les deux marquent »** : oui quand les deux pôles sont chacun présents au moins trois fois. Résultat : juste pour 7 des 10 matchs. C'est une observation sur peu de matchs, pas une règle : elle n'est pas dans le moteur.

## Ce qu'il faut pour aller plus loin

Le score exact, avec la mi-temps, des matchs réels déjà enregistrés. La plupart n'ont que le vainqueur ou le nul.
