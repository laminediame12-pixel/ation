# Moteur 4 — le noyau et les seuls principes posés

`moteur4/moteur.js` repose sur `moteur3/noyau.js` (structure exacte). Le moteur gelé `moteur3/moteur.js` n'est pas modifié ; la page système l'utilise encore.

## Ce qu'il fait
- **VA-1** victoire assurée (boucles différentes, ≥3 figures du front ou du front binôme chez elles, sans annulation).
- **MF-2** même front : un seul partenaire de moitié chez lui.
- **MF-3** nul : front miroir, Tristitia en maison de Terre, **et** équilibre des deux parties du thème.
- **FI-5** validation du thème.
- Sinon : `verdict: null` — pas de verdict.

## Ce qu'il ne fait plus
Principes de développement (NU-1, AX-1, CL-1, CL-2, PF-2, NU-2, NU-3, FC-2, FP-1, CO-1), CC-1, « R1 par défaut », pénalité/carton, buts, corners, Over/Under, rythme.

## Preuve (`node outils/tester_moteur4.js`)
Sur les 65 536 thèmes : verdict identique au gelé pour les 4 138 thèmes où VA-1 (2 570), MF-2 (1 304) ou MF-3 (264) décide ; abstention sur les 61 398 autres ; FI-5 identique sur 524 288 lectures.

## Usage
```js
var r = KOUN4.analyser([m1, m2, m3, m4], jour); // mères en numéros 1..16
r.verdict   // { verdict: '1' | '2' | 'N' | null, principe, raison, assuree }
r.fiabilite // { niveau, total, valide }
```
