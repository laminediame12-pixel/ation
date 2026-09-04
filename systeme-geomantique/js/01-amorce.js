// ═══════════════════════════════════════════════════════════════
// AMORCE
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// LES AUTO-TESTS ATTENDENT QUE TOUT SOIT CHARGÉ (04/09/26)
//
// Le système était UN SEUL <script> de 29 000 lignes : le hoisting des
// déclarations de fonction couvrait le bloc entier, et un auto-test
// écrit ligne 700 pouvait donc appeler une fonction déclarée ligne
// 26 000. Découpé en fichiers, ce filet disparaît — chaque fichier ne
// hoiste que le sien, et l'auto-test s'exécute à l'instant où son
// fichier est lu, avant que les suivants existent.
//
// C'est LE SEUL endroit où le découpage change quelque chose au
// comportement, et il est nommé ici pour cette raison. Trois auto-tests
// tombaient : la loi de la résultante au siège (appelait campDeV7), la
// loi des axes d'opposition (appelait buildThemeFromMothers), et par
// ricochet tout ce qui suivait dans le même fichier — un throw en haut
// d'un fichier tue le reste du fichier, y compris les const qu'il
// déclare. C'est ainsi que PLANETES_V7 disparaissait.
//
// Les auto-tests s'inscrivent donc ici et sont joués par
// jouerAutoTestsV7(), appelée en toute fin de chargement (34-demarrage).
// Un auto-test qui échoue est signalé, il n'interrompt pas les autres.
var _AUTOTESTS_V7 = [];
function autoTestV7(nom, fn) { _AUTOTESTS_V7.push({ nom: nom, fn: fn }); }
function jouerAutoTestsV7() {
  var joues = 0;
  for (var i = 0; i < _AUTOTESTS_V7.length; i++) {
    try { _AUTOTESTS_V7[i].fn(); joues++; }
    catch (e) { console.warn('⚠️ auto-test « ' + _AUTOTESTS_V7[i].nom + ' » a échoué : ' + e.message); }
  }
  return joues;
}

/* Rendu des deux matrices de boucle. Calculé au chargement à partir de
   FIGS_V7 + combine() (moteur global défini plus bas dans le fichier) :
   DOMContentLoaded garantit que ce script s'exécute après. */
(function(){
  function render(){
    if(typeof combine !== 'function' || typeof FIGS_V7 === 'undefined') return;

    var PAIRES  = [2,4,6,8,10,12,14,16];
    var IMPAIRS = [1,3,5,7,9,11,13,15];
    function fig(n){ return FIGS_V7[n-1]; }
    function num(f){ return FIGS_V7.indexOf(f)+1; }
    function nom(n){ return (typeof FL!=='undefined' && FL[fig(n)]) ? FL[fig(n)] : fig(n); }

    function build(hostId, readId, axe){
      var host = document.getElementById(hostId);
      var read = document.getElementById(readId);
      if(!host) return;

      var html = '<div class="bl-h bl-corner">+</div>';
      axe.forEach(function(c){
        html += '<div class="bl-h bl-f'+c+'" data-col="'+c+'">'+c+'</div>';
      });
      axe.forEach(function(r){
        html += '<div class="bl-h bl-f'+r+'" data-row="'+r+'">'+r+'</div>';
        axe.forEach(function(c){
          var v = num(combine(fig(r), fig(c)));
          html += '<button type="button" class="bl-c bl-f'+v+(r===c?' bl-diag':'')+'"'
               +  ' data-row="'+r+'" data-col="'+c+'" data-val="'+v+'"'
               +  ' aria-label="'+r+' combiné '+c+' égale '+v+'">'+v+'</button>';
        });
      });
      host.innerHTML = html;

      function clear(){
        var on = host.querySelectorAll('.bl-lit,.bl-mirror');
        for(var i=0;i<on.length;i++){ on[i].classList.remove('bl-lit','bl-mirror'); }
      }
      function show(cell){
        clear();
        var r = cell.getAttribute('data-row'),
            c = cell.getAttribute('data-col'),
            v = cell.getAttribute('data-val');
        var same = host.querySelectorAll('[data-row="'+r+'"],[data-col="'+c+'"]');
        for(var i=0;i<same.length;i++){ same[i].classList.add('bl-lit'); }
        cell.classList.add('bl-mirror');
        var mir = host.querySelector('.bl-c[data-row="'+c+'"][data-col="'+r+'"]');
        if(mir) mir.classList.add('bl-mirror');
        if(read){
          read.innerHTML = '<b>'+r+'</b> '+nom(r)+' &nbsp;+&nbsp; <b>'+c+'</b> '+nom(c)
                         + ' &nbsp;=&nbsp; <b>'+v+'</b> '+nom(v);
        }
      }
      function pick(e){
        var t = e.target;
        var cell = (t && t.closest) ? t.closest('.bl-c') : null;
        if(cell) show(cell);
      }
      host.addEventListener('click', pick);
      host.addEventListener('mouseover', pick);
      host.addEventListener('focusin', pick);
    }

    build('bl-tab-paire',   'bl-read-paire',   PAIRES);
    build('bl-tab-impaire', 'bl-read-impaire', IMPAIRS);

    var pairs = document.getElementById('bl-pairs');
    if(pairs){
      var h = '';
      IMPAIRS.forEach(function(n){
        h += '<div class="bl-f'+n+'"><span class="bl-n">'+n+'</span>'
          +  '<span class="bl-nm">'+nom(n)+'</span>'
          +  '<span class="bl-lk">&#8596;</span>'
          +  '<span class="bl-n">'+(n+1)+'</span>'
          +  '<span class="bl-nm">'+nom(n+1)+'</span></div>';
      });
      pairs.innerHTML = h;
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();

