// ═══════════════════════════════════════════════════════════════
// SUGGESTIONS EQUIPES
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════

// ===== Crochet : relie le tirage réel de l'application à la matrice géomantique =====
(function(){
  if(typeof renderTheme === 'function' && window.__geomtxOnHostTheme){
    var _geomtxOrigRenderTheme = renderTheme;
    renderTheme = function(){
      _geomtxOrigRenderTheme();
      if(typeof currentTheme !== 'undefined' && currentTheme){
        window.__geomtxOnHostTheme(currentTheme);
      }
    };
  } else {
    console.warn('geomtx: crochet non installé (renderTheme ou __geomtxOnHostTheme introuvable)');
  }
})();

