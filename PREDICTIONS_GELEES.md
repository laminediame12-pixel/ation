# Prédictions gelées

Chaque bloc est écrit **avant** le match et n'est plus modifié : seule la
ligne « RÉSULTAT » est ajoutée ensuite. L'horodatage de git fait foi.

> ⚠️ **Règle ajoutée le 01/09/2026, après une faute sur le match 1.**
> Tout bloc gelé doit porter le **hash du commit** qui l'a produit, et se
> juger contre CE build. Le moteur a été reconstruit entre le gel du
> match 1 et le match : le verdict MACHINE a basculé de `R1 1-0` à
> `R7 0-1`, c'est-à-dire vers le score réel. Un verdict qui change après
> le gel ne compte pas, même — surtout — quand il devient juste.

Le plan est **apparié** : pour chaque match, deux thèmes.

- **MACHINE** — les quatre mères dérivées par hachage des seules données
  publiques du match (`tirageDepuisMatchV7`). Le thème ne peut porter
  aucune information sur l'issue : c'est le témoin.
- **MAIN** — le tirage d'Ellemine_D.

Au bout de dix matchs on saura deux choses : si les règles marchent, et
si le tirage à la main porte quelque chose que le hachage ne porte pas.

---

## 1 — Aston Villa (R1) vs Arsenal (R7)
**31/08/2026, 19:00** · gelé le 31/08/2026

|  | MACHINE (hachage) | MAIN (Ellemine_D) |
|---|---|---|
| mères | Puella / Populus / Fortuna Minor / Acquisitio | Amissio / Conjunctio / Carcer / Cauda Draconis |
| graine | `Aston Villa\|Arsenal\|2026-08-31\|19:00` | tirage à la main |
| **validation** | 1/3 — **rejeté** | **3/3 + figure du jour** |
| **VERDICT** | **R1 1-0** (alt. 2-0) | **NUL 1-1** |
| **les deux marquent** | NON | **OUI** |
| R1 → R7 | M14 → M4 | M6 → M12 |
| porte du nul (42/49) | fermée, faisceau 0/7 | **OUVERTE**, faisceau 3/7 |
| théorème d'Ellemine | non applicable (M14 hors cycle) | camp doublé R1 |
| M13/M14/M15 | eau / feu / eau | terre / terre / eau |
| trois éléments différents | non → R7 | non → R7 |
| ★ règle renforcée | muette | muette |
| incident · sommes d'axes | 0/3 → non | 1/3 → **OUI** |
| incident · dérivés | 40 %, 0 rouge → non | 85 %, 1 rouge → **OUI** |

**Ce qui est en jeu sur ce match :**

1. Les deux verdicts s'opposent : R1 1-0 contre nul 1-1. Un seul peut avoir raison.
2. Le BTTS s'oppose aussi : NON contre OUI. C'est la famille la plus solide du fichier (28/39).
3. La porte du nul (42/49) est ouverte côté main, fermée côté machine.
4. L'incident : les deux lectures du thème à la main disent OUI, les deux du machine disent non.
5. La règle renforcée est **muette des deux côtés** — ce match ne compte ni pour ni contre elle.

**RÉSULTAT : Aston Villa 0 - 1 Arsenal.** Corners 6 au total — 2 Aston Villa, 4 Arsenal.

### ☠️ D'ABORD UNE FAUTE DE MA PART, ET ELLE EST GRAVE

Le thème MACHINE annonçait **R1 1-0** quand ce bloc a été gelé, au commit
`3110811`. Depuis, **j'ai reconstruit le moteur** (V8, commit `a70f8f9`).
Le même thème, sur le fichier d'aujourd'hui, annonce **R7 0-1** —
c'est-à-dire exactement le score réel.

**Ce n'est pas une réussite. C'est une prédiction changée après coup.**
Si je la comptais comme juste, ce journal ne vaudrait plus rien.

Vérifié en rejouant les deux thèmes sur quatre commits :

| commit | MACHINE | MAIN |
|---|---|---|
| `3110811` (le gel) | **M1 1-0** | nul 1-1 |
| `a70f8f9` (V8) | M7 0-1 | nul 1-1 |
| `843f5bc` | M7 0-1 | nul 1-1 |
| `HEAD` | M7 0-1 | nul 1-1 |

Le basculement date bien de la reconstruction V8. **Le seul verdict qui
compte pour ce match est celui du gel : R1 1-0, et il est faux.**

**Correctif de protocole, à partir de maintenant :** tout bloc gelé porte
le hash du commit qui l'a produit, et se juge contre CE build. Un moteur
qu'on retouche entre le gel et le match annule le gel.

### Le score, contre le build du gel

|  | MACHINE (`3110811`) | MAIN (`3110811`) | réel |
|---|---|---|---|
| camp | R1 ✘ | nul ✘ | **R7** |
| score | 1-0 ✘ | 1-1 ✘ | **0-1** |
| les deux marquent | **non ✔** | oui ✘ | **non** |
| porte du nul | **fermée ✔** | ouverte ✘ | pas de nul |
| validation | 1/3, rejeté | 3/3 + figure du jour | — |

**Deuxième match gelé, deuxième double échec sur le camp.** Sur deux
matchs annoncés à l'avance, les quatre thèmes ont tous manqué le camp.

- Le **thème le mieux validé s'est le plus trompé.** MAIN était 3/3 plus
  la figure du jour — le meilleur niveau atteignable — et il rate le camp,
  le score, le BTTS et lève une fausse alerte sur la porte du nul.
  MACHINE, rejeté, prend le BTTS et la porte. C'est la **troisième fois**
  que le niveau de validité joue à l'envers ; le fichier le notait déjà
  pour l'archive, il le note maintenant à l'aveugle.
- La **porte du nul** lève sa deuxième fausse alerte en deux matchs.

### Ce qui a marché, et qui ne décide rien

Deux moteurs `horsVote` ont parlé, et les deux ont eu raison :

- **✦ partage de la synthèse → R7 sur les DEUX thèmes.** Ses deux
  premières sorties à l'aveugle, justes toutes les deux, là où l'écran
  disait R1 d'un côté et nul de l'autre. Dossier : 31/41.
- **⚔ destruction directe → R7** sur le thème MACHINE : Acquisitio est
  l'antagoniste de Laetitia, donc R7 détruit R1. Première sortie à
  l'aveugle du moteur issu de la récolte, juste. Dossier : 6/7.

⚠️ **Mais les deux thèmes sont le MÊME match** : cela fait une seule
observation de football, pas deux. Et les deux moteurs restent `horsVote`
— ils n'ont touché à rien à l'écran. Dix déclenchements gelés avant d'en
reparler.

### Les corners

6 au total, 2 pour R1 et 4 pour R7 — dominant R7, le vainqueur. Deuxième
cas de l'archive avec le détail des corners ; le premier (PuellaAlbus)
annonçait 11 corners pour 4 réels et inversait le dominant. Deux cas ne
font pas une règle, mais la ligne « nombre de corners » du verdict standard
a maintenant deux points de mesure au lieu d'un.

---

## 2 — Porto (R1) vs Roma (R7) · **FIFA / e-sport**
**31/08/2026, 10:10** · gelé le 31/08/2026

|  | MACHINE (hachage) | MAIN (Ellemine_D) |
|---|---|---|
| mères | Acquisitio / Amissio / Caput Draconis / Acquisitio | Populus / Rubeus / Fortuna Minor / Cauda Draconis |
| graine | `Porto\|Roma\|2026-08-31\|10:10` | tirage à la main |
| **validation** | 1/3 — rejeté | 1/3 — rejeté |
| **VERDICT** | **NUL 0-0** (alt. 1-1) | **R7 0-4** |
| **les deux marquent** | NON | NON |
| R1 → R7 | M15 → M5 | M16 → M6 |
| porte du nul (42/49) | **OUVERTE**, faisceau 4/7 | fermée, faisceau 0/7 |
| théorème d'Ellemine | non applicable (M15 hors cycle) | non applicable (M16 hors cycle) |
| M13/M14/M15 | feu / eau / eau | air / air / terre |
| trois éléments différents | non → R7 | non → R7 |
| ★ règle renforcée | muette | muette |
| incident · sommes d'axes | 1/3 → **OUI** | 0/3 → non |
| incident · dérivés | 53 %, 1 rouge → **OUI** | 66 %, 1 rouge → **OUI** |

**Ce qui est en jeu :**

1. Les verdicts s'opposent à nouveau : nul 0-0 contre R7 0-4. Écart maximal.
2. La porte du nul (42/49) est **ouverte côté machine, fermée côté main** — l'inverse du match 1.
3. Les deux thèmes sont rejetés (1/3) : cette ligne ne dira rien sur la validité.
4. Le BTTS est d'accord des deux côtés : NON.
5. La règle renforcée est **muette des deux côtés**, comme au match 1.
6. Sur du FIFA (8,75 buts par match en moyenne contre 2,84 en réel), un 0-0 est une annonce très forte.

**RÉSULTAT : 6-3 pour R1 (Porto).**

|  | MACHINE | MAIN | réel |
|---|---|---|---|
| camp | nul ✘ | R7 ✘ | **R1** |
| score | 0-0 ✘ | 0-4 ✘ | **6-3** |
| les deux marquent | non ✘ | non ✘ | **oui** |
| porte du nul | ouverte ✘ | **fermée ✔** | pas de nul |
| incident · dérivés | oui | oui | _non renseigné_ |

**Les deux thèmes se sont trompés sur le camp, le score et le BTTS.**

- La **porte du nul** (43/51 sur l'archive) a levé une **fausse alerte** côté
  machine — ouverte, faisceau 4/7, sur un match à 9 buts. Côté main elle
  était fermée : sur cette ligne, c'est le tirage à la main qui a bien lu.
- Le **BTTS**, la famille la plus solide du fichier, annonçait « non » des
  deux côtés sur un 6-3.
- La règle renforcée était muette : ce match ne compte ni pour ni contre
  elle.

**Ce que ça vaut :** sur l'archive le verdict fait 59 % et le BTTS 68 %.
Sur le premier match jamais annoncé à l'avance, les deux tombent à zéro.
C'est précisément pourquoi ce fichier existe. Il en faut dix ; en voilà un.

---
