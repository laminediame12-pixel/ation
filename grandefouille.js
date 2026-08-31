const fs=require('fs'), vm=require('vm'), path=require('path');
const HB='/tmp/claude-0/-home-user-ation/1d73a2f7-b528-5f5c-9033-e1ce9b35452b/scratchpad/hB';
const src=fs.readFileSync(HB+'/verify.js','utf8');
const setup=src.split('// --- Direct unit checks')[0].replace(/__dirname/g, JSON.stringify(HB));
const mod={exports:{}}; const ctx={require,__dirname,console:{log(){},error(){},warn(){}},module:mod,exports:mod.exports};
vm.createContext(ctx); vm.runInContext(setup+'\nmodule.exports = sandbox;', ctx, {filename:'s.js'});
console.log(vm.runInContext(`(function(){
  var L=[]; var cas=tousCasBancV7();
  var CLASSIQUE={1:'feu',5:'feu',9:'feu',13:'feu',2:'air',6:'air',10:'air',14:'air',
                 3:'eau',7:'eau',11:'eau',15:'eau',4:'terre',8:'terre',12:'terre',16:'terre'};
  // ── les variables élémentaires, chacune binaire
  function variables(t){
    var r=null; try{ r=getRotationCombat(t); }catch(e){}
    if(!r||!r.hR1||!r.hR7) return null;
    var V={};
    var e1=CLASSIQUE[r.hR1], e7=CLASSIQUE[r.hR7];
    var f1=ELEMENTS_V7[r.figR1], f7=ELEMENTS_V7[r.figR7];
    V['R1 en maison de Feu']      = e1==='feu';
    V['R1 en maison d\\'Air']      = e1==='air';
    V['R1 en maison d\\'Eau']      = e1==='eau';
    V['R1 en maison de Terre']    = e1==='terre';
    V['R1 : figure et maison de même élément'] = (f1===e1);
    V['R7 : figure et maison de même élément'] = (f7===e7);
    V['R1 et R7 de même élément de figure']    = (f1===f7);
    V['R1 et R7 de même élément de maison']    = (e1===e7);
    // harmonie du thème : combien de figures dans une maison de leur élément
    var h=0; for(var m=1;m<=16;m++) if(ELEMENTS_V7[t[m]]===CLASSIQUE[m]) h++;
    V['harmonie du thème ≥ 5 figures']  = h>=5;
    V['harmonie du thème ≤ 2 figures']  = h<=2;
    // élément majoritaire des 16 figures
    var c={feu:0,air:0,eau:0,terre:0};
    for(var m2=1;m2<=16;m2++) c[ELEMENTS_V7[t[m2]]]++;
    var maj=Object.keys(c).sort(function(a,b){return c[b]-c[a];})[0];
    V['thème à dominante Feu']   = maj==='feu';
    V['thème à dominante Eau']   = maj==='eau';
    V['thème à dominante Terre'] = maj==='terre';
    V['thème à dominante Air']   = maj==='air';
    V['un élément absent du thème'] = (c.feu===0||c.air===0||c.eau===0||c.terre===0);
    // le juge
    V['Juge M15 de même élément que R1'] = (ELEMENTS_V7[t[15]]===f1);
    V['Juge M15 de même élément que R7'] = (ELEMENTS_V7[t[15]]===f7);
    V['Juge M15 dans une maison de son élément'] = (ELEMENTS_V7[t[15]]===CLASSIQUE[15]);
    // sa table à lui
    var f=null; try{ f=fusionElementV7(t); }catch(e){}
    if(f&&!f.anomalie){
      V['camp doublé gouverné par le partagé'] = !f.domineParSonSupplement;
      V['élément partagé = Eau (sa table)']    = f.commun==='E';
    }
    return V;
  }
  // ── les issues
  var RES=[];
  cas.forEach(function(c){
    if(!c.camp) return;
    var t=buildThemeFromMothers(c.meres[0],c.meres[1],c.meres[2],c.meres[3]);
    var V=variables(t); if(!V) return;
    var v=null; try{ v=avecFormatV7(c.format||formatMatchV7(),function(){return getVerdictAfficheReel(t);}); }catch(e){ return; }
    var dit=v.nulActif?'nul':(v.winner==='M1'?'R1':'R7');
    var out={
      'le match est nul': (c.camp==='nul'),
      'R1 gagne': (c.camp==='R1'),
      'les deux marquent': (typeof c.btts==='boolean')?c.btts:null,
      'le verdict affiché est juste': (dit===c.camp)
    };
    if(c.score){ var m=String(c.score).match(/^(\\d+)-(\\d+)$/);
      out['match serré (écart ≤ 1)'] = m?(Math.abs(+m[1]-+m[2])<=1):null; }
    else out['match serré (écart ≤ 1)']=null;
    RES.push({V:V,out:out});
  });
  // ── croisement
  var lignes=[], nTests=0;
  var noms={}; RES.forEach(function(r){ Object.keys(r.V).forEach(function(k){ noms[k]=1; }); });
  var issues=['le match est nul','R1 gagne','les deux marquent','match serré (écart ≤ 1)','le verdict affiché est juste'];
  Object.keys(noms).forEach(function(k){
    issues.forEach(function(o){
      var a=[0,0], b=[0,0];
      RES.forEach(function(r){
        if(!(k in r.V)) return;
        var y=r.out[o]; if(y===null||y===undefined) return;
        (r.V[k]?a:b)[y?0:1]++;
      });
      var na=a[0]+a[1], nb=b[0]+b[1];
      if(na<5||nb<5) return;
      nTests++;
      var p=fisherExactV7(a[0],a[1],b[0],b[1]);
      lignes.push({v:k,o:o,a:a,na:na,b:b,nb:nb,p:p,ecart:(a[0]/na)-(b[0]/nb)});
    });
  });
  lignes.sort(function(x,y){return x.p-y.p;});
  L.push('  ═══ GRANDE FOUILLE ÉLÉMENTAIRE — '+nTests+' croisements testés sur '+RES.length+' cas ═══');
  L.push('     seuil de Bonferroni : p doit être sous '+(0.05/nTests).toFixed(5));
  L.push('');
  L.push('     '+'variable'.padEnd(40)+'issue'.padEnd(28)+'avec'.padEnd(14)+'sans'.padEnd(14)+'p');
  L.push('     '+'─'.repeat(104));
  lignes.slice(0,12).forEach(function(x){
    L.push('     '+x.v.slice(0,38).padEnd(40)+x.o.slice(0,26).padEnd(28)
      +(x.a[0]+'/'+x.na+' '+Math.round(100*x.a[0]/x.na)+'%').padEnd(14)
      +(x.b[0]+'/'+x.nb+' '+Math.round(100*x.b[0]/x.nb)+'%').padEnd(14)
      +x.p.toFixed(4)+(x.p<0.05/nTests?'   ★ SURVIT':(x.p<0.05?'   (brut < 0,05, ne survit pas)':'')));
  });
  var survivants=lignes.filter(function(x){return x.p<0.05/nTests;});
  var bruts=lignes.filter(function(x){return x.p<0.05;});
  L.push('');
  L.push('     p bruts sous 0,05 : '+bruts.length+'   (le hasard seul en donnerait '+(nTests*0.05).toFixed(1)+')');
  L.push('     survivants après correction : '+survivants.length);
  return L.join('\\n');
})()`, mod.exports, {filename:"c.js"}));
