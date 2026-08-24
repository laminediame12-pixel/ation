# Rapport de fouille d'erreurs — Système Géomantique (Protocole R1/R7) UI

Fichier analysé : `systeme_geomantique.html` (copie du fichier uploadé, 14 314 lignes, 7 blocs `<script>`, ~927 Ko).

Méthode : vérification syntaxique de chaque bloc `<script>` (`node --check`), équilibrage des accolades CSS, recherche des `id` dupliqués / `getElementById` orphelins, et détection des fonctions redéclarées dans la portée globale (les scripts ne sont pas des modules : toute `function nom(){...}` déclarée deux fois au même niveau écrase silencieusement la précédente).

## 1. CSS corrompu — règle `.pcard.rel-dim` tronquée (ligne 975)

```css
973:  .pcard.selected{outline:2px solid #FFFFFF; outline-offset:1px;}
974:  .pcard.rel-binome-strong{box-shadow: inset 0 0 0 2px #4CD97B, 0 0 0 4px #4CD97B !important;}
975:  .pcard.rel-dim);
976:    line-height:1.6;
977:  }
```

La règle `.pcard.rel-dim` est coupée en plein milieu (parenthèse fermante orpheline, propriété `line-height` qui ne lui appartient pas), ce qui casse l'équilibre des accolades de tout le bloc `<style>` (372→979 : 260 `{` pour 261 `}`). Les navigateurs récupèrent de l'erreur en ignorant la déclaration invalide, donc ça ne casse pas visuellement la page, mais c'est un bloc CSS syntaxiquement invalide qu'il faut corriger ou supprimer.

Remarque annexe : toute la famille de classes `.pcard*` (lignes 940-978, la "pyramide" à base de cartes) n'est référencée nulle part ailleurs dans le HTML/JS — aucun élément ne reçoit `class="pcard"` et aucun `classList` ne le manipule. C'est du CSS mort (résidu d'une ancienne version, la pyramide actuelle est dessinée via `renderThemeWithSize()` / `#theme-grid` avec des maisons positionnées en pixels, pas des `.pcard`).

## 2. `renderTheme` déclarée deux fois dans la portée globale — casse le pont "thème hôte"

- **Ligne 1705** (dans le 1er `<script>`, lignes 1025-1802) :
  `function renderTheme(theme){ ... lastTheme = theme; ... }` — prend le thème en paramètre.
- **Ligne 12068** (dans le 2e `<script>`, lignes 1804-14061) :
  `function renderTheme(){ if(!currentTheme) return; ... }` — ne prend **aucun** paramètre, travaille sur la variable globale `currentTheme`.

Comme les scripts ne sont pas des modules, les deux partagent la portée globale : la seconde déclaration (ligne 12068) écrase silencieusement la première dès que le 2e `<script>` s'exécute. La version à paramètre (ligne 1705) devient du code mort.

Conséquence concrète : le pont d'intégration avec un thème hôte externe, ligne 1792 :
```js
window.__geomtxOnHostTheme = function(hostTheme){
  ...
  renderTheme(convertHostTheme(hostTheme));   // <-- ligne 1795
  ...
};
```
appelle `renderTheme(...)` avec l'argument `convertHostTheme(hostTheme)`. Mais au moment où `__geomtxOnHostTheme` est réellement invoquée (après chargement complet), `renderTheme` pointe vers la version sans paramètre (ligne 12068) : **l'argument est silencieusement ignoré**, et la fonction affiche `currentTheme` (le thème interne courant) au lieu du thème converti reçu de l'hôte. L'intégration hôte → widget ne fonctionne donc pas.

Il y a un risque supplémentaire : le script des lignes 14156-14171 re-wrap `renderTheme` :
```js
if(typeof renderTheme === 'function' && window.__geomtxOnHostTheme){
  var _geomtxOrigRenderTheme = renderTheme;
  renderTheme = function(){
    _geomtxOrigRenderTheme();
    if(typeof currentTheme !== 'undefined' && currentTheme){
      window.__geomtxOnHostTheme(currentTheme);
    }
  };
}
```
Ce wrapper appelle `window.__geomtxOnHostTheme(currentTheme)` à la fin de chaque rendu, qui elle-même rappelle `renderTheme(...)` — si `currentTheme` est déjà défini au moment du premier déclenchement, cette chaîne peut boucler indéfiniment (`__geomtxOnHostTheme` → `renderTheme` → `__geomtxOnHostTheme` → ...) et provoquer un dépassement de pile (`Maximum call stack size exceeded`).

## 3. `renderBouclesAntagonistesR1R7` déclarée deux fois — un appel devient sans effet

- **Ligne 2579** : `function renderBouclesAntagonistesR1R7(theme){ ... p.innerHTML = h; }` — écrit directement dans le DOM (`#r1r7-boucles-protocole`), ne retourne rien.
- **Ligne 3191** : `function renderBouclesAntagonistesR1R7(theme) { ... return html; }` — calcule et **retourne** une chaîne HTML, ne touche pas le DOM.

Les deux sont dans le même `<script>` global (1804-14061) : la seconde (3191) écrase la première.

Deux points d'appel existent :
- **Ligne 2409**, dans `toggleAutoTestXOR()` : `try { renderBouclesAntagonistesR1R7(currentTheme || null); } catch(e) {}` — appel « pour effet de bord », attend la version qui écrit dans `#r1r7-boucles-protocole`.
- **Ligne 3087** : `html += renderBouclesAntagonistesR1R7(theme);` — attend la version qui **retourne** une chaîne.

Avec la fonction réellement active (celle de la ligne 3191, qui retourne une chaîne), l'appel de la ligne 2409 ne fait plus rien d'observable : la sous-section « ⚔️ Comparaison des boucles antagonistes R1/R7 » du panneau `#r1r7-boucles-protocole` (dans le panneau « Interprétation du thème ») ne sera jamais remplie via ce chemin.

## Autres points annexes (mineurs, non bloquants)

- `sw.js` (ligne 14065, `navigator.serviceWorker.register('sw.js')`) : l'enregistrement du service worker échouera si ce fichier n'est pas fourni à côté du HTML — l'échec est déjà intercepté (`.catch`) donc sans impact fonctionnel, juste une trace dans la console.
- Vérifications qui n'ont **rien** révélé d'anormal : tous les blocs `<script>` sont syntaxiquement valides (`node --check`), les balises HTML sont équilibrées (`div`, `span`, `table`, `tr`, `td`, `th`, `button`, `select`, `option`, etc.), aucun `id` dupliqué, aucun appel `getElementById` sur un id inexistant (hormis un cas déjà protégé par un test `if(oldElem)`).

## Recommandation

Les points 2 et 3 sont les plus sérieux : il s'agit de vraies redéclarations qui font disparaître silencieusement une moitié du comportement prévu. La correction demande de choisir, pour chaque nom, quelle version garder (ou de renommer l'une des deux pour que les deux comportements coexistent) — je peux appliquer le correctif si vous me confirmez l'intention voulue pour chacune des deux fonctions.
