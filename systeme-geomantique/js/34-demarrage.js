// ═══════════════════════════════════════════════════════════════
// DEMARRAGE
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════

(function(){
  
  
  function syncReferenceUI(){
    try{
      function esc(v){
        return String(v==null?'':v).replace(/[&<>"']/g,function(s){
          return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s];
        });
      }
      function label(fig){ return (typeof FL!=='undefined' && FL[fig]) ? FL[fig] : fig; }
      function elem(fig){
        return (typeof ELEMENTS!=='undefined' && ELEMENTS[fig]) ? ELEMENTS[fig] : '—';
      }
      function elemColor(fig){
        var e=elem(fig);
        return (typeof ELEMENT_COLORS!=='undefined' && ELEMENT_COLORS[e]) ? ELEMENT_COLORS[e] : '#94a3b8';
      }
      function glyph(fig){
        var g=(typeof MAP_GEO!=='undefined' && MAP_GEO[fig]) ? MAP_GEO[fig] : [1,1,1,1];
        return '<div class="ui-glyph">'+g.map(function(v,i){
          return '<span class="ui-dot" style="background:'+elemColor(fig)+';opacity:'+(v===1?'1':'.18')+'"></span>';
        }).join('')+'</div>';
      }

      // Verdict : le clone dupliquait "carte-verdict-r" dans le tableau de
      // bord de référence (supprimé le 20/08/26, demande Ellemine_D
      // "deux verdicts affichés" — un seul panneau désormais).

      // Match.
      var mt=document.getElementById('ui-mirror-match');
      if(mt){
        var t1=(document.getElementById('team1')||{}).value||'Équipe 1';
        var t2=(document.getElementById('team2')||{}).value||'Équipe 2';
        var d=(document.getElementById('matchDate')||{}).value||'—';
        var h=(document.getElementById('matchTime')||{}).value||'—';
        mt.innerHTML='<div class="ui-match-teams"><b>'+esc(t1)+'</b><span>VS</span><b>'+esc(t2)+'</b></div><div class="ui-match-meta">📅 '+esc(d)+' &nbsp; ⏰ '+esc(h)+'</div>';
      }

      // Thème : rendu direct en 4x4, centré. Aucune copie de la grille DOM originale.
      var tm=document.getElementById('ui-mirror-theme');
      if(tm && typeof currentTheme!=='undefined' && currentTheme){
        var order = typeof getRotationOrderFromRepos==='function' ? getRotationOrderFromRepos(currentTheme[1]) : null;
        var r1=order ? order[0] : null, r7=order ? order[6] : null;
        var th='<div class="ui-theme-grid">';
        for(var m=1;m<=16;m++){
          var f=currentTheme[m];
          th+='<div class="ui-house '+(m===r1?'is-r1 ':'')+(m===r7?'is-r7':'')+'">'
             +'<div class="ui-house-num">M'+m+(m===r1?' · R1':'')+(m===r7?' · R7':'')+'</div>'
             +'<div class="ui-house-fig" style="color:'+elemColor(f)+'">'+esc(label(f))+'</div>'
             +'<div class="ui-house-elem">'+esc(elem(f))+'</div>'+glyph(f)+'</div>';
        }
        th+='</div>';
        tm.innerHTML=th;
      }

      // Axes.
      var ax=document.getElementById('ui-mirror-axes');
      if(ax && typeof currentTheme!=='undefined' && currentTheme){
        var t=currentTheme;
        var axis=function(name,homes){
          var fig='—';
          try{ fig=combineMany(homes.map(function(m){return t[m];})); }
          catch(e){ try{ fig=combine(t[homes[0]],t[homes[1]]); }catch(_){ console.debug('[maintenance] erreur ignorée:', _); } }
          return '<div class="ui-axis-row"><b>'+name+'</b><span>'+homes.map(function(m){return 'M'+m+' · '+esc(label(t[m]));}).join(' &nbsp;|&nbsp; ')+'</span><strong>→ '+esc(label(fig))+'</strong></div>';
        };
        ax.innerHTML=axis('AXE ANGULAIRE (1-4-7-10)',[1,4,7,10])
          +axis('AXE SUCCÉDENT (2-5-8-11)',[2,5,8,11])
          +axis('AXE CADENT (3-6-9-12)',[3,6,9,12]);
      }

      // Domination : cinq plages fixes 0-20 / 20-40 / 40-60 / 60-80 / 80-100.
      var md=document.getElementById('ui-mirror-domination');
      if(md){
        var a=50,b=50;
        try{
          if(typeof currentTheme!=='undefined' && currentTheme && typeof buildVerdictCard==='function' && typeof getRotationOrderFromRepos==='function'){
            var ord=getRotationOrderFromRepos(currentTheme[1]);
            var vf=typeof verdictFinal==='function'?verdictFinal(currentTheme):null;
            var gw=vf&&(vf.winner==='M1'||vf.winner==='M7')?(vf.winner==='M1'?'R1':'R7'):null;
            var c=buildVerdictCard(ord[0],ord[6],'R1','R7',currentTheme,gw,undefined,true);
            a=Math.max(0,Math.min(100,Number(c.domPctA)||50));
            b=Math.max(0,Math.min(100,Number(c.domPctB)||100-a));
          }
        }catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
        var ranges=[[0,20,'r1','0–20%'],[20,40,'r2','20–40%'],[40,60,'r3','40–60%'],[60,80,'r4','60–80%'],[80,100,'r5','80–100%']];
        function rangeFill(p,lo,hi){
          if(p<=lo) return 0;
          if(p>=hi) return 100;
          return Math.round((p-lo)/(hi-lo)*100);
        }
        var dh='<div class="ui-domination-main">'
          +'<div class="ui-dom-score"><div><b>R1</b><span>'+Math.round(a)+'%</span></div><div class="ui-dom-center">DOMINATION</div><div><b>R7</b><span>'+Math.round(b)+'%</span></div></div>';
        ranges.forEach(function(r){
          dh+='<div class="ui-dom-range '+r[2]+'"><div class="ui-dom-range-head"><span>'+r[3]+'</span><span>'+((a>=r[0]&&a<=r[1])?'R1':'')+((b>=r[0]&&b<=r[1])?' R7':'')+'</span></div><div class="ui-dom-track"><div class="ui-dom-fill" style="width:'+rangeFill(a,r[0],r[1])+'%"></div></div></div>';
        });
        dh+='<div class="ui-dom-legend">Les cinq barres indiquent la zone de domination de R1. R7 est affiché en miroir par son pourcentage.</div>';
        dh+='<div class="ui-dom-levels"><div class="ui-dom-level"><b>NIVEAU 1</b>0–20%</div><div class="ui-dom-level"><b>NIVEAU 2</b>20–40%</div><div class="ui-dom-level"><b>NIVEAU 3</b>40–60%</div><div class="ui-dom-level"><b>NIVEAU 4</b>60–80%</div></div>';
        dh+='</div>';
        md.innerHTML=dh;
      }

      // Carré : rendu direct, indépendant du SVG caché de l'ancien module.
      var sq=document.getElementById('ui-mirror-square');
      if(sq && typeof currentTheme!=='undefined' && currentTheme){
        var sh='<div class="ui-square-grid">';
        for(var sm=1;sm<=16;sm++){
          var sf=currentTheme[sm];
          sh+='<div class="ui-house"><div class="ui-house-num">M'+sm+'</div><div class="ui-house-fig" style="color:'+elemColor(sf)+'">'+esc(label(sf))+'</div>'+glyph(sf)+'</div>';
        }
        sh+='</div>';
        // 03/09/26 : calculerVerdictCarreGeomantique (zones notées à la
        // dignité) a été remplacée par zonesTrajectoiresV7 (zones notées
        // aux trajectoires fortes). currentTheme est déjà canonique ici.
        var cv=null;
        try{cv=typeof zonesTrajectoiresV7==='function'?zonesTrajectoiresV7(currentTheme):null;}catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
        sh+='<div class="ui-square-result">Verdict du carré : '
          +esc(cv&&!cv.erreur?(cv.camp||'égalité'):'—')
          +(cv&&!cv.erreur?' · fortes '+esc(cv.nbFortes1)+'/'+esc(cv.nbFortes7)+' · force '+esc(cv.total1)+'/'+esc(cv.total7)+' ('+esc(cv.mode)+')':'')
          +'</div>';
        sq.innerHTML=sh;
      }

      var ref=document.getElementById('regression-reference-panel');
      var mr=document.getElementById('ui-mirror-reference');
      if(mr && ref && ref.innerHTML.trim()) mr.innerHTML=ref.innerHTML;
    }catch(e){ console.warn('UI référence : synchronisation partielle',e); }
  }
  function installObserver(){
    const ids=['carte-verdict-r','regression-reference-panel','carre-geo-verdict','verdict-familial','quatre-trones-verdict'];
    ids.forEach(id=>{const el=document.getElementById(id); if(el)new MutationObserver(()=>setTimeout(syncReferenceUI,50)).observe(el,{childList:true,subtree:true,characterData:true});});
    ['team1','team2','matchDate','matchTime'].forEach(id=>{const el=document.getElementById(id);if(el){el.addEventListener('input',syncReferenceUI);el.addEventListener('change',syncReferenceUI);}});
    setTimeout(syncReferenceUI,200);setTimeout(syncReferenceUI,800);setTimeout(syncReferenceUI,1800);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',installObserver); else installObserver();
  window.syncReferenceUI=syncReferenceUI;
})();


// ─── LES AUTO-TESTS, UNE FOIS TOUS LES FICHIERS CHARGÉS (04/09/26) ───
// Dernier fichier de la page : à cet instant toutes les fonctions et
// toutes les const existent. Cf. le registre dans 01-amorce.js.
try { jouerAutoTestsV7(); } catch (e) { console.warn('auto-tests non joués : ' + e.message); }
