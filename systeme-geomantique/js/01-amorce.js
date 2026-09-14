// ═══════════════════════════════════════════════════════════════
// AMORCE
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// L'AXE SUCCÉDENT — CORRIGÉ LE 06/09/26 : M2 + M6 + M8 + M12
//
// « succèdent 2-6-8-12, corriges » (Ellemine_D). Le fichier portait
// M2+M5+M8+M11 depuis l'import de doctrine du 03/08. Correction faite,
// et déclarée ICI, en un seul endroit, parce que le découpage en
// fichiers ne hoiste plus les valeurs : la constante doit exister avant
// que 02-carre-geo-glyphes la lise.
//
// ⚠️ CE QUE LA CORRECTION CASSE, ET QUI N'EST PAS RIEN.
// L'ancien découpage était l'une des trois classes de pas 3 —
// 1-4-7-10, 2-5-8-11, 3-6-9-12 — et il en découlait une loi EXACTE :
//     Cardinal ⊕ Succédent = Cadent ..... 65 536 / 65 536
// Avec 2-6-8-12 cette loi tombe à 4096/65 536, soit 6,25 % : le hasard
// pur. Le nouveau découpage n'est plus une partition des douze maisons
// — il partage M6 et M12 avec le Cadent, et laisse M5 et M11 hors de
// tout axe. C'est un fait géométrique, pas une objection : la doctrine
// est à Ellemine_D, le calcul est à moi, et je dis ce que le calcul dit.
// Les quatre lois LOCALES, elles, survivent intactes parce qu'elles ne
// dépendent d'aucun nommage : M3 = M4⊕M10, M6 = M5⊕M11, M9 = M1⊕M2,
// M12 = M7⊕M8.
//
// CE QUE LA CORRECTION CHANGE À LA MESURE — tout a été rejoué sur
// l'archive avant de toucher au code :
//   BTTS « Puer en maison succédente » (RÈGLE BRANCHÉE, elle décide) :
//     règle seule .. 2-5-8-11 : 11 tirs, 7 justes · accord 24/47
//                    2-6-8-12 : 10 tirs, 7 justes · accord 25/47
//     BTTS AFFICHÉ, chaîne entière, de bout en bout :
//                    2-5-8-11 : 31/47   ->   2-6-8-12 : 32/47
//     La correction gagne un point, et c'est la seule des trois qui pèse
//     sur ce que l'écran annonce.
//   Thème dérivé « les 4 maisons succédentes comme 4 mères », signal
//   de nul par opposition M13/M14 (calculé, non décisif) :
//       2-5-8-11 .. 6 déclenchements, 1 nul · 2-6-8-12 .. 8 pour 1 nul
//     ⚠️ Au passage : ce signal était annoncé dans 10-doctrine comme
//     « le mieux validé du système », 43 % de précision sur 7 cas au
//     05/08. Rejoué aujourd'hui sur l'archive corrigée il fait 1/6,
//     soit 16,7 %, SOUS le taux de base de 22,8 %. Le commentaire du
//     05/08 est périmé et il est corrigé là-bas.
//   Validité du thème (les 3 axes présents) : 51/59 -> 48/59 en
//     archive, 72,47 % -> 71,48 % sur les 65 536 thèmes. Et la validité
//     ne prédit rien de mesurable (49 valides 61,2 % de camp juste
//     contre 8 invalides à 50 % — huit cas, aucun écart démontrable).
// ═══════════════════════════════════════════════════════════════
var MAISONS_SUCCEDENT_V7 = [2, 6, 8, 12];
var MAISONS_SUCCEDENT_HISTORIQUE_V7 = [2, 5, 8, 11];
var LOI_TROIS_AXES_V7 = {
  cardinal: [1, 4, 7, 10], cadent: [3, 6, 9, 12],
  succedentAvant: [2, 5, 8, 11], succedentApres: [2, 6, 8, 12],
  loiXOR: { 'avec 2-5-8-11': '65536/65536', 'avec 2-6-8-12': '4096/65536 (6,25 %)' },
  loisLocalesIntactes: ['M3 = M4⊕M10', 'M6 = M5⊕M11', 'M9 = M1⊕M2', 'M12 = M7⊕M8'],
  partition: 'avec 2-6-8-12 les trois axes ne partitionnent plus les douze maisons : '
    + 'M6 et M12 sont partagées avec le Cadent, M5 et M11 ne sont dans aucun axe',
  mesures: {
    bttsPuerSuccedent: { avant: '7/11 · accord 24/47 · BTTS affiché 31/47',
      apres: '7/10 · accord 25/47 · BTTS affiché 32/47' },
    nulThemeDerive: { avant: '1/6', apres: '1/8', base: 22.8 },
    validite: { archive: '51/59 -> 48/59', exhaustif: '72,47 % -> 71,48 %' } }
};

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

