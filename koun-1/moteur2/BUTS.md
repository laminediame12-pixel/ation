# Les buts : première mi-temps et « les deux marquent »

Document produit par `outils/buts_doc.js` à partir des matchs réels dont le score est connu (6 matchs, dont 4 avec la mi-temps). Pour les autres matchs réels, seul le vainqueur ou le nul est connu : ils ne peuvent pas servir ici.

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

Sur les 4 matchs où la mi-temps est connue, le signal est juste 3 fois.

**Le cas qui manque.** Dans 9·13·2·13, les deux buts sont en première mi-temps (4e et 44e minutes), mais le moteur ne donne qu'un signal faible : la somme de l'axe (Tristitia) n'est qu'en résultante, en M1 et en M7 à la fois. Soit la résultante compte aussi en M1 et M7, soit elle compte quand la somme y est deux fois. À trancher par le propriétaire.

**L'hypothèse de la deuxième mi-temps** (axe miroir 9-12-15-2) n'est juste qu'une fois sur trois : elle n'est pas retenue.

## 2. Les deux équipes marquent

Aucune règle n'est encore dans le moteur. Voici ce que montrent les 6 matchs dont le score est connu, pôle par pôle.

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

**Ce qui ressort, sur 8 pôles qui ont marqué et 4 qui n'ont pas marqué :**

| Lecture | Pôles qui ont marqué | Pôles qui n'ont pas marqué |
|---|---|---|
| présent au moins 3 fois dans le thème | 6 sur 8 | 0 sur 4 |
| présent sur l'axe angulaire | 4 sur 8 | 0 sur 4 |
| dans sa maison de repos | 3 sur 8 | 0 sur 4 |

- Un pôle présent **au moins trois fois** dans le thème a toujours marqué ; aucun des pôles restés muets n'atteint trois positions.
- Un pôle présent **sur l'axe angulaire** ou **dans sa maison de repos** a toujours marqué.
- L'inverse n'est pas vrai : deux pôles peu présents ont quand même marqué (Caput, une seule position, dans le 3-1 ; Albus, deux positions, dans le 2-0).

**Lecture provisoire pour « les deux marquent » :** oui quand les deux pôles sont chacun présents au moins trois fois ; cela donne le bon résultat pour 5 des 6 matchs (le 3-1 est manqué). C'est une observation sur très peu de matchs, pas une règle : elle n'est pas dans le moteur.

## Ce qu'il faut pour aller plus loin

Le score exact, avec la mi-temps, des matchs réels déjà enregistrés. Quinze matchs sur vingt et un n'ont que le vainqueur ou le nul.
