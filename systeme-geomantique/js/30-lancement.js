// ═══════════════════════════════════════════════════════════════
// LANCEMENT
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
      console.log('Service Worker enregistré:', reg.scope);
    }).catch(function(err) {
      console.log('Erreur Service Worker:', err);
    });
  });
}

