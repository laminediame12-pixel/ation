# PROTOCOLE DE TEST PROSPECTIF — Système géomantique

**Objectif** : établir, une fois pour toutes et sans que rien ne puisse flatter le résultat,
si les 5 moteurs du système prédisent quelque chose.

**Principe** : on annonce d'avance, on gèle, on compare après. Aucune règle ne bouge pendant
le test. C'est la seule mesure qu'un rejeu sur archive ne peut pas imiter — parce qu'une règle
rejouée sur des cas déjà connus a été taillée sur eux.

---

## Ce qui est décidé MAINTENANT, avant de voir le moindre résultat

### 1. Le code est gelé

Le test porte sur le fichier `index.html` au commit noté ci-dessous. **Aucune modification
pendant toute la durée du test** — ni règle, ni seuil, ni branchement, ni affichage.

    commit gelé : 18feb2e0b6d828b5ca1779070ef529c0c9d9c3c2
    date du gel : 11 / 09 / 2026

> Si une seule ligne de logique change, le test est **annulé** et repart à zéro.
> Corriger un bug d'affichage pur (couleur, texte) est permis et doit être noté.

### 2. Les matchs sont choisis par une règle, pas à la main

Sélectionner les matchs après coup — même inconsciemment, même « celui-là le thème était
plus clair » — suffit à fabriquer un résultat. La règle de sélection est écrite ici et ne
change plus :

    competitions retenues : ______________________________________________
    regle : TOUS les matchs de ces competitions, aux dates jouees, sans exception
    mode de tirage : [ ] manuel (4 des)   [ ] aleatoire   (cocher, ne plus changer)

> Si un match est sauté (oubli, indisponibilité), il est noté comme **sauté** dans le
> registre avec sa raison. Plus de 10 % de matchs sautés rend le test non concluant.

### 3. Taille fixée : 150 matchs. Pas d'arrêt anticipé.

**N = 150.** On ne s'arrête ni avant ni après, quel que soit le score en cours.

> S'arrêter quand on est en avance est la façon la plus courante de se tromper soi-même :
> sur une pièce parfaitement équilibrée, si on s'autorise à arrêter au meilleur moment, on
> finit presque toujours « gagnant ». Le nombre est fixé maintenant, il ne bouge plus.

Un match donne **5 lignes de données** (une par famille) : 150 matchs suffisent aux 5 familles
en même temps.

### 4. Les 5 familles, leurs témoins et leurs seuils

Le témoin, c'est la règle idiote à battre. Un moteur qui ne bat pas sa règle idiote ne sert
à rien, même s'il a « souvent raison ».

| famille | ce qui est prédit | témoin à battre | seuil de réussite |
|---|---|---|---|
| **Camp** | R1 / R7 / Nul | toujours l'équipe à domicile (45 %) | **≥ 83/150** (55,3 %) |
| **BTTS** | oui / non | toujours « oui » (52 %) | **≥ 93/150** (62,0 %) |
| **Volume** | plus / moins de 2,5 buts | toujours « plus de 2,5 » (52 %) | **≥ 93/150** (62,0 %) |
| **Incidents** | penalty ou rouge : oui / non | toujours « non » (65 %) | **≥ 112/150** (74,7 %) |
| **Nul** | oui / non | toujours « pas de nul » (75 %) | **≥ 125/150** (83,3 %) |

Seuils calculés par test binomial unilatéral, α = 0,01 par famille (correction de Bonferroni
pour 5 familles testées, α global 0,05). Puissance : 76 % à 89 % selon la famille — c'est-à-dire
que si un vrai avantage existe, ce test le détecte dans ~8 cas sur 10.

> **Pourquoi pas 50 matchs ?** Calculé : à 50 matchs la puissance tombe à 22-34 %. Un vrai
> avantage serait raté 2 fois sur 3, et le test ne prouverait rien — ni dans un sens ni dans
> l'autre. 150 est le minimum honnête.

### 5. Ce qui compte comme succès

- **Camp** : le camp annoncé est celui qui a gagné. « Nul » annoncé compte juste si match nul.
- **BTTS** : les deux équipes ont marqué ⟺ « oui » annoncé.
- **Volume** : le total de buts est > 2,5 ⟺ « plus » annoncé. (Volume affiché ≥ 2,5 = « plus ».)
- **Incidents** : au moins un penalty **ou** un carton rouge dans le match ⟺ « oui » annoncé.
- **Nul** : match nul ⟺ « NUL OUI » annoncé.

**Abstentions** : si la carte affiche « Indécis » ou « THÈME INVALIDE », la ligne est notée
`abstention` et **sort du compte** pour la famille Camp. Les autres familles restent comptées.

> Plafond : si les abstentions dépassent **20 %** des matchs, le test est **non concluant** —
> parce qu'un système qui ne parle que sur les cas faciles peut paraître bon sans l'être.
> Le taux d'abstention est calculé à la fin et publié avec le reste.

### 6. Le verdict, écrit d'avance

À 150 matchs, pour chaque famille :

- **Seuil atteint** → il y a un signal réel dans cette famille. On le creuse sérieusement :
  on cherche quel moteur porte le signal, et on refait un second test prospectif de
  confirmation sur cette famille seule.
- **Seuil non atteint** → pas de signal démontrable dans cette famille. La question est close
  pour elle, avec tes propres chiffres.

Aucune interprétation après coup. Pas de « ça aurait marché si on avait retiré ces 3 matchs »,
pas de « en fait la règle voulait dire autre chose ». Le seuil est écrit ici, avant.

---

## Ce qui se passe pendant le test

1. **Avant le coup d'envoi** : tirer le thème, lire la carte verdict, enregistrer les
   5 prédictions dans le registre. Le registre horodate et chaîne les entrées par empreinte
   (SHA-256) : toute modification rétroactive casse la chaîne et devient visible.
2. **Après le match** : saisir le résultat réel (score, BTTS, penalty/rouge). Le registre
   refuse de modifier une prédiction déjà gelée.
3. **Ne rien regarder** : ne pas calculer le score en cours. Regarder le compteur pousse à
   ajuster — c'est humain, et ça ruine le test. Le bilan se calcule une seule fois, à 150.

## Outil

    python3 registre.py freeze  --match "Real Madrid - Barcelone" --date 2026-09-14 \
                                --camp R1 --btts oui --volume plus --incident non --nul non
    python3 registre.py result  --id 42 --score 2-1 --penalty non --rouge oui
    python3 registre.py verify              # controle l'integrite de la chaine
    python3 registre.py bilan               # verdict final, a n'utiliser qu'a 150

---

## Signature

En signant, on s'engage sur les règles ci-dessus, et notamment sur celle-ci : **le résultat
sera accepté tel qu'il tombe**, y compris s'il ne plaît pas.

    Ellemine_D : ______________________   date : ____ / ____ / ________
