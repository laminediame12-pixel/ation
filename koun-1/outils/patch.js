const fs=require('fs');const S=process.argv[2];
let b=fs.readFileSync(S+'/src/bundle.js','utf8');
const R=[];const rep=(a,c,label)=>{const n=b.split(a).length-1;if(n!==1)throw Error('count '+n+' for '+label+': '+a.slice(0,80));b=b.split(a).join(c);R.push(label);};
const fr=n=>`${n}.toLocaleString("fr-FR")`;
// 1. Banc technique exhaustif
rep(`technical:{themes:512,blocked:70,resolved:442,causes:[{id:"M15_EQUAL",title:"\\xC9galit\\xE9 des forces de M15",count:56},{id:"DOUBLE_REST",title:"Double repos du juge non chiffr\\xE9",count:14}],scope:"Contr\\xF4les techniques sur 512 th\\xE8mes distincts, sans r\\xE9sultats de matchs associ\\xE9s."}`,
`technical:{themes:65536,blocked:4104,resolved:61432,causes:[{id:"AUCUN_SIGNAL",title:"Aucun signal des maisons sur les p\\xF4les",count:4104},{id:"DOUBLE_REST",title:"Double repos du juge non chiffr\\xE9",count:0}],verdicts:{N:24842,"1":20044,"2":16546},assurees:{"1":10261,"2":8111},previous:{"1.14.1-essai":{blocked:578,verdicts:{N:40375,"1":13872,"2":10711}},"1.14.0-essai":{blocked:613,verdicts:{N:40743,"1":13673,"2":10507}},"1.13.0-essai":{blocked:1577,verdicts:{N:35895,"1":14274,"2":13790}},"1.12.0-essai":{blocked:8544,M15_EQUAL:6986,DOUBLE_REST:1558,verdicts:{N:36177,"1":10870,"2":9945}}},sample:{themes:512,blocked:70,M15_EQUAL:56,DOUBLE_REST:14},engineVersion:"1.15.0-essai",computedAt:"2026-11-10",scope:"Banc exhaustif : les 65 536 combinaisons de m\\xE8res (16\\u2074) recalcul\\xE9es avec koun-1 1.15.0-essai (nul seulement si m\\xEAme front ; lecture d\\u2019ensemble, \\xE9l\\xE9ments align\\xE9s sur les fronts), sans r\\xE9sultats de matchs associ\\xE9s. L\\u2019ancien \\xE9chantillon de 512 th\\xE8mes (70 blocages) donnait des proportions comparables."}`,'banc exhaustif');
rep(`(0,f.jsx)("strong",{children:"512"}),(0,f.jsx)("small",{children:"Th\\xE8mes distincts trait\\xE9s sans plantage"})`,
`(0,f.jsx)("strong",{children:${fr('J.technical.themes')}}),(0,f.jsx)("small",{children:"Combinaisons de m\\xE8res (16\\u2074) trait\\xE9es sans plantage"})`,'metric themes');
rep(`(0,f.jsx)("strong",{children:"70"})`,`(0,f.jsx)("strong",{children:${fr('J.technical.blocked')}})`,'metric blocked');
rep(`(0,f.jsx)("strong",{children:"442"}),(0,f.jsx)("span",{children:"sorties calcul\\xE9es sur 512 th\\xE8mes"})`,
`(0,f.jsx)("strong",{children:${fr('J.technical.resolved')}}),(0,f.jsx)("span",{children:"sorties calcul\\xE9es sur "+${fr('J.technical.themes')}+" th\\xE8mes"})`,'coverage number');
rep(`"aria-label":"442 sorties calcul\\xE9es, 70 th\\xE8mes sans arbitrage",children:(0,f.jsx)("span",{style:{width:442/512*100+"%"}})`,
`"aria-label":${fr('J.technical.resolved')}+" sorties calcul\\xE9es, "+${fr('J.technical.blocked')}+" th\\xE8mes sans arbitrage",children:(0,f.jsx)("span",{style:{width:J.technical.resolved/J.technical.themes*100+"%"}})`,'coverage bar');
rep(`children:"Existence d\\u2019un r\\xE9sultat calcul\\xE9, sans r\\xE9sultat r\\xE9el associ\\xE9 : ce n\\u2019est pas un taux de r\\xE9ussite."`,
`children:["Existence d\\u2019un r\\xE9sultat calcul\\xE9, sans r\\xE9sultat r\\xE9el associ\\xE9 : ce n\\u2019est pas un taux de r\\xE9ussite. R\\xE9partition des sorties : ",[["N","Nul"],["1","R1"],["2","R7"]].map(([k,t])=>t+" "+(J.technical.verdicts[k]/J.technical.themes*100).toLocaleString("fr-FR",{maximumFractionDigits:1})+" %").join(" \\xB7 ")," \\xB7 bloqu\\xE9 "+(J.technical.blocked/J.technical.themes*100).toLocaleString("fr-FR",{maximumFractionDigits:1})+" %."]`,'verdict distribution');
rep(`evidence:"56 cas sur le banc technique de 512 th\\xE8mes distincts ; ce nombre ne mesure pas des r\\xE9sultats de matchs."`,
`evidence:"Version 1.13.0 : 0 cas sur les 65 536 th\\xE8mes depuis l\\u2019alignement des \\xE9l\\xE9ments sur les fronts (6 986 avec l\\u2019ancienne table). La question ne se pose plus pour le banc exhaustif."`,'KAMB-001 evidence');
rep(`evidence:"REG-001 \\xB7 KREG-005 \\xB7 14 blocages du juge dans le banc technique",next:"Obtenir une valeur explicitement d\\xE9cid\\xE9e par le propri\\xE9taire ; conserver l\\u2019exception sym\\xE9trique.",status:"Ouverte"}`,
`evidence:"REG-001 \\xB7 KREG-005 \\xB7 AMB-001 \\xB7 0 blocage depuis la version 1.14.0 (le juge M15 ne tranche plus ; les forces non chiffr\\xE9es comptent 0 dans la concordance) ; 1 577 blocages en 1.13.0",next:"Obtenir une valeur explicitement d\\xE9cid\\xE9e par le propri\\xE9taire ; conserver l\\u2019exception sym\\xE9trique. Cette question compl\\xE8te AMB-001 (cons\\xE9quence sur le verdict).",status:"Ouverte"},{id:"KAMB-003",title:"Taux de nul structurel du moteur",question:"Sur les 65 536 th\\xE8mes possibles, koun-1 1.14.1 rendait 61,6 % de nuls ; depuis la version 1.15.0 (nul seulement si m\\xEAme front), le banc technique en compte 37,9 %. La m\\xEAme boucle (KREG-002) et les ressources partag\\xE9es (KREG-006) d\\xE9clarent nuls 32 768 th\\xE8mes, soit exactement la moiti\\xE9 : les 16 figures forment deux r\\xE9seaux de 8 et deux p\\xF4les se trouvent dans le m\\xEAme r\\xE9seau une fois sur deux. Faut-il restreindre KREG-006, encore en essai ?",evidence:"KREG-002 \\xB7 KREG-006 \\xB7 r\\xE9f\\xE9rences NUL 2 \\xE0 5 \\xB7 banc exhaustif 65 536 th\\xE8mes",next:"Enregistrer des pr\\xE9dictions avant de nouveaux matchs et comparer le taux de nul r\\xE9el (environ un match sur quatre en football) \\xE0 celui du moteur. Aucune modification sans d\\xE9cision explicite. Tranch\\xE9 en 1.15.0 : nul seulement si m\\xEAme front (KREG-002).",status:"R\\xE9solue"},{id:"KAMB-004",title:"\\xC9cart R1 / R7 : d\\xE9finition des p\\xF4les",question:"Sur les 65 536 th\\xE8mes, R1 gagne 20 044 fois et R7 16 546 fois (version 1.15.0). Le test d\\u2019inversion montre que le code de d\\xE9cision est neutre (65 536 verdicts invers\\xE9s \\xE0 l\\u2019identique) : l\\u2019\\xE9cart vient de la d\\xE9finition des p\\xF4les (R1 = maison de Repos de la figure en M1, R7 = R1 + 6). Cet \\xE9cart est-il voulu, par exemple comme avantage du terrain pour R1 ?",evidence:"TST-003 \\xB7 banc exhaustif \\xB7 essai R7 = R1 + 8 sur la version 1.12 : 6 r\\xE9f\\xE9rences sur 11 perdues et \\xE9cart maintenu",next:"V\\xE9rifier sur de nouveaux matchs si R1 correspond \\xE0 l\\u2019\\xE9quipe qui re\\xE7oit. Aucune modification des p\\xF4les sans d\\xE9cision explicite.",status:"Ouverte"},{id:"KAMB-005",title:"NUL 2 : nul r\\xE9el malgr\\xE9 des fronts bin\\xF4mes",question:"Depuis la version 1.15.0, seuls les p\\xF4les du m\\xEAme front donnent un nul. NUL 2 (Cauda contre Conjunctio, fronts A et C) est un nul r\\xE9el, mais la lecture d\\u2019ensemble donne une victoire R7 assur\\xE9e : son seul signal est M4, qui porte le p\\xF4le R1 (Fortuna Minor \\u2192 Cauda). Qu\\u2019est-ce qui maintient ce nul ?",evidence:"NUL 2 \\xB7 KREG-002 \\xB7 KREG-016",next:"Identifier le m\\xE9canisme qui neutralise l\\u2019affaiblissement par M4 quand les p\\xF4les sont bin\\xF4mes, puis le v\\xE9rifier sur de nouveaux matchs r\\xE9els.",status:"Ouverte"}`,'KAMB-002/KAMB-003');
// 2. Règles mobilisées tracées par phase
rep(`rules:["REG-001","KREG-005"],engineStatus:t?.decision?.statut`,
`rules:["REG-001","KREG-005",...({CAS_NUL_MEME_BOUCLE:["KREG-002"],DUELS_FIGURES:["KREG-003"],ESSAI_RESSOURCES_PARTAGEES:["KREG-006"],ESSAI_DOUBLE_RESISTANCE_DIRECTE:["KREG-007"],ESSAI_COMPENSATION_FRONTS:["KREG-008"],ESSAI_DUEL_POLES_REPOS:["KREG-009"],ESSAI_ARBITRAGE_JUGE_REPOS:["KREG-010"],ESSAI_ARBITRAGE_JUGE_FORCE:["KREG-010"],ESSAI_CONCORDANCES_ELEMENTAIRES:["KREG-011"]}[t?.decision?.phase]||[])],engineStatus:t?.decision?.statut`,'rules by phase');
rep(`engineStatus:Aa.engineStatus,`,`engineStatus:Aa.engineStatus,rules:Aa.rules,`,'rerun updates rules');
// 3. Lien de connexion hérité de la version en ligne
rep(`!r&&(0,c.jsx)("a",{href:"/signin-with-chatgpt?return_to=/",target:"_top",children:"Se connecter"})`,
`!r&&(0,c.jsx)("button",{className:"textbutton",type:"button",onClick:()=>location.reload(),children:"Recharger la page"})`,'signin link');
rep(`"Calculs effectu\\xE9s. Connecte-toi pour conserver ces observations."`,`"Calculs effectu\\xE9s. Stockage local indisponible : exporte tes donn\\xE9es pour conserver ces observations."`,'connecte-toi');
// 4. Élément des maisons dans Comparaison
rep(`children:v%4===0?"Terre":v%4===2?"Air":"Impaire"`,`children:["Terre","Feu","Air","Eau"][v%4]`,'house elements');
// 5. Filtre des tests
rep(`["Tous",...dm,"Cas limite","Non-r\\xE9gression"]`,`["Tous",...dm,"Non-r\\xE9gression","Cas limite","Exploration"]`,'test filter');
// 6. Compteurs codés en dur
rep(`(0,f.jsx)("em",{children:"/11"})`,`(0,f.jsx)("em",{children:"/"+pt.length})`,'/11 overview');
rep(`children:[L," / 11 issues concordantes"]`,`children:[L," / ",pt.length," issues concordantes"]`,'/11 refs');
rep(`"Rejouer les 11 r\\xE9f\\xE9rences"`,`"Rejouer les "+pt.length+" r\\xE9f\\xE9rences"`,'rejouer 11');
rep(`(o+1)%6`,`(o+1)%J.gallery.length`,'gal1');rep(`(o+5)%6`,`(o+J.gallery.length-1)%J.gallery.length`,'gal2');
rep(`t((e+5)%6)`,`t((e+J.gallery.length-1)%J.gallery.length)`,'gal3');rep(`t((e+1)%6)`,`t((e+1)%J.gallery.length)`,'gal4');
rep(`children:[e+1," / 6"]`,`children:[e+1," / ",J.gallery.length]`,'gal5');
// 7. Bouton « premier nul » cohérent avec le préréglage
rep(`onClick:()=>{b(J.references[0].mothers),S(J.references[0].codes.join(" ")),St()}`,
`onClick:()=>{let r0=J.references[0];b(r0.mothers),S(r0.codes.join(" ")),A(r0.title),p(r0.teams),q(Jt(r0.expected)),St()}`,'premier nul');
// 8. Protection des thèmes de référence / calculés
rep(`let Re=e[B].some(bt=>bt.id===$.id)?`,
`if(T==="theme"&&$.referenceId){d("Les th\\xE8mes de r\\xE9f\\xE9rence sont prot\\xE9g\\xE9s : leurs maisons proviennent du moteur.");return}if(T==="theme"&&$.result){let o0=e.themes.find(bt=>bt.id===$.id);o0&&($={...$,houses:o0.houses})}let Re=e[B].some(bt=>bt.id===$.id)?`,'protect themes save');
rep(`("input",{value:v[B]??"",onChange:`,`("input",{value:v[B]??"",readOnly:!!L.item.result,onChange:`,'readonly inputs');
rep(`("select",{value:v.rest,onChange:B=>I("houses"`,`("select",{value:v.rest,disabled:!!L.item.result,onChange:B=>I("houses"`,'disabled select');
rep(`(0,c.jsx)("div",{className:"themehouses"`,`L.item.result&&(0,c.jsx)("p",{className:"muted",children:L.item.referenceId?"Th\\xE8me de r\\xE9f\\xE9rence prot\\xE9g\\xE9 : consultation seule.":"Maisons calcul\\xE9es par koun-1 : seuls le titre et les notes sont modifiables."}),(0,c.jsx)("div",{className:"themehouses"`,'theme note');
rep(`disabled:i||!r,className:"primary",type:"submit"`,`disabled:i||!r||L.type==="theme"&&!!L.item.referenceId,className:"primary",type:"submit"`,'submit disabled ref');
// 9. Tutoiement homogène
for(const [a,c] of [["Renseignez le r\\xE9sultat","Renseigne le r\\xE9sultat"],["Mettez les maisons","Mets les maisons"],["attendent votre d\\xE9cision","attendent ta d\\xE9cision"],["Votre moteur, vos d\\xE9cisions.","Ton moteur, tes d\\xE9cisions."],["S\\xE9lectionnez plusieurs","S\\xE9lectionne plusieurs"],["Enregistrez votre premier","Enregistre ton premier"],["Lancez les nouveaux","Lance les nouveaux"],["Dupliquez la fiche","Duplique la fiche"],["d\\xE9duite de vos notes","d\\xE9duite de tes notes"]])rep(a,c,'tu: '+c);

rep(`(0,f.jsx)("strong",{children:s.count})`,`(0,f.jsx)("strong",{children:s.count.toLocaleString("fr-FR")})`,'count format');
rep(`children:"Banc technique enregistr\\xE9"`,`children:"Banc technique exhaustif"`,'banc label');
rep(`observed:"",status:"\\xC0 ex\\xE9cuter",next:"Renseigner deux th\\xE8mes invers\\xE9s pour comparaison."`,`observed:"Banc exhaustif du 10 novembre 2026 (versions 1.12 \\xE0 1.15.0) : les 65 536 th\\xE8mes recalcul\\xE9s avec R1 et R7 \\xE9chang\\xE9s donnent tous le verdict invers\\xE9 (1\\u21942, nul\\u2194nul, blocage\\u2194blocage). Le code de d\\xE9cision ne favorise aucun camp.",status:"Conforme",next:"L\\u2019\\xE9cart global R1/R7 vient de la d\\xE9finition des p\\xF4les : voir KAMB-004."`,'TST-003');

rep(`next:"Consigner des th\\xE8mes dont le r\\xE9sultat est connu avant de proposer une r\\xE8gle. Aucun nul automatique.",status:"Ouverte"`,`next:"Aucune action : \\xE9galit\\xE9 disparue avec la table d\\u2019\\xE9l\\xE9ments align\\xE9e sur les fronts (version 1.13.0).",status:"R\\xE9solue"`,'KAMB-001 résolue');
rep(`children:"Deux situations d\\xE9cisionnelles \\xE0 formaliser"`,`children:"Aucun signal des maisons sur les p\\xF4les"`,'metric blocked text');
// 10. Fonctionnement en fichier local (file://) : origine opaque « null »
rep(`const parentOrigin=parent.location.origin;`,`const parentOrigin=parent.location.origin;const localFile=parentOrigin==='null'||parent.location.protocol==='file:';`,'bridge localFile');
rep(`parent.postMessage({channel,...data},parentOrigin==='null'?'*':parentOrigin);`,`parent.postMessage({channel,...data},localFile?'*':parentOrigin);`,'bridge emit');
rep(`if(event.source!==parent||event.origin!==parentOrigin||`,`if(event.source!==parent||(event.origin!==parentOrigin&&!(localFile&&event.origin==='null'))||`,'bridge listen');
rep(`A.origin!==location.origin||A.data?.channel`,`A.origin!==location.origin&&!(location.protocol==="file:"&&A.origin==="null")||A.data?.channel`,'app listen');
rep(`location.origin==="null"?"*":location.origin)})}`,`location.origin==="null"||location.protocol==="file:"?"*":location.origin)})}`,'app post');

// 11. Camps des maisons attribués par les figures (base + résultante), et non par la distance au pôle
{const esc=t=>t.replace(/[^\x00-\x7f]/g,ch=>{const c=ch.charCodeAt(0);return c<256?'\\x'+c.toString(16).toUpperCase().padStart(2,'0'):'\\u'+c.toString(16).padStart(4,'0');});const old=esc(fs.readFileSync(S+'/mvc_old.txt','utf8').replace(/\n$/,''));
 const neu=`  window.maisonVersCamp = function(h, theme){
    // Camp d'une maison = camp des figures qu'elle porte, en base ET en résultante
    // (réseau front direct + binômes de chaque pôle). Base et résultante de camps
    // différents, ou figure commune aux deux réseaux : maison partagée (0).
    h = Number(h);
    theme = theme || window.currentTheme;
    if(!theme || !theme[h]) return 0;
    var poles = getPolesR1R7(theme), R = window.RELATIONS_4 || {};
    function reseau(f){
      var front = [], x = f;
      for(var i=0; i<4 && x && front.indexOf(x)<0; i++){ front.push(x); x = R[x] && R[x].front; }
      return front.concat(front.map(function(y){ return R[y] && R[y].binome; }).filter(Boolean));
    }
    var n1 = reseau(theme[poles.R1]), n7 = reseau(theme[poles.R7]);
    function campFigure(f){
      if(!f) return null;
      var a = n1.indexOf(f) >= 0, b = n7.indexOf(f) >= 0;
      return a && !b ? 1 : (b && !a ? 2 : 0);
    }
    var cb = campFigure(theme[h]);
    var res = (h === 16 || typeof resultanteMaison !== 'function') ? null : resultanteMaison(h, theme);
    var cr = campFigure(res);
    if(cr === null) return cb || 0;
    return cb === cr ? cb : 0;
  };`;
 rep(old,esc(neu),'maisonVersCamp par figures');}
rep(`window.MOTEUR_UNIQUE.version = '1.12.0-essai';`,`window.MOTEUR_UNIQUE.version = '1.15.0-essai';`,'version moteur');
rep(`version:"1.12.0-essai",sourceHash:`,`version:"1.15.0-essai",sourceHash:`,'version atelier');
rep(`FICHIER SOURCE INT\\xC9GR\\xC9 SANS MODIFICATION`,`MOTEUR INT\\xC9GR\\xC9 \\xB7 CAMPS DES MAISONS PAR LES FIGURES`,'eyebrow moteur');
rep(`int\\xE9gr\\xE9 sans changer ses calculs.`,`int\\xE9gr\\xE9. Version 1.14.0 : lecture d\\u2019ensemble des maisons (M4, M8, M12, M15/M7, M16) et victoire assur\\xE9e en essai ; maisons attribu\\xE9es \\xE0 R1 ou R7 par leurs figures en base et en r\\xE9sultante ; \\xE9l\\xE9ment de chaque figure = \\xE9l\\xE9ment de son front.`,'sous-titre moteur');
rep(`(0,x.jsx)("th",{children:"FRONT"})`,`(0,x.jsx)("th",{children:"FRONT \\xB7 POINT \\xB7 CAMP"})`,'th camp');
rep(`(0,x.jsx)("td",{children:I.front})`,`(0,x.jsx)("td",{children:[(0,x.jsx)("strong",{children:I.front+" \\xB7 "+pointCardinal(I.base)}),I.house!==16&&I.result&&(0,x.jsx)("small",{children:"R\\xE9sultante : "+frontLettre(I.result)+" \\xB7 "+pointCardinal(I.result)}),(0,x.jsx)("small",{children:campMaisonAtelier(g,I)})]})`,'td camp');
rep(`function tA({`,`function pointCardinal(f){return {1:"Est",5:"Nord",9:"Ouest",13:"Sud",2:"Est",6:"Nord",10:"Ouest",14:"Sud",3:"Est",15:"Nord",11:"Ouest",7:"Sud",4:"Est",16:"Nord",12:"Ouest",8:"Sud"}[J.figures.indexOf(f)+1]||"\\u2014"}function frontLettre(f){let n=J.figures.indexOf(f);return n<0?"\\u2014":"ABCD"[n%4]}function campMaisonAtelier(g,I){let mb=(J.figures.indexOf(g.theme[g.poles.R1])%2)===(J.figures.indexOf(g.theme[g.poles.R7])%2),n=k=>new Set([...(g.fronts?.[k]?.front||[]),...(mb?[]:(g.fronts?.[k]?.binomes||[]))]),a=n("R1"),b=n("R7"),c=f=>f?a.has(f)&&!b.has(f)?"R1":b.has(f)&&!a.has(f)?"R7":a.has(f)&&b.has(f)?"commun aux deux":"aucun":null,x=c(I.base),y=I.house===16?null:c(I.result);return !y||x===y?"Camp "+x:"Partag\\xE9e ("+x+" / "+y+")"}function tA({`,'helper camp');

// 12. Vocabulaire cardinal (fronts = Est, Nord, Ouest, Sud) : doctrine des maisons et registre des règles
{const esc=t=>t.replace(/[^\x00-\x7f]/g,ch=>{const c=ch.charCodeAt(0);return c<256?'\\x'+c.toString(16).toUpperCase().padStart(2,'0'):'\\u'+c.toString(16).padStart(4,'0');});
 const old=esc(fs.readFileSync(S+'/labels_old.txt','utf8').replace(/\n$/,''));
 const neu=`  const annotations = Object.freeze({
    M4: 'Même front, voisins : Est↔Nord, Ouest↔Sud, identique sur les quatre fronts.',
    M14: 'Front binôme, point opposé : Est↔Ouest, Nord↔Sud. Cas particulier signalé : Puer (A · Est) en M14 produit Conjunctio (C · Ouest), mise en évidence d’un sauvetage face à Puella.'
  });
  const labels = Object.freeze({
    M6: 'Front binôme, même point cardinal',
    M8: 'Même front, vis-à-vis : Est↔Ouest, Nord↔Sud (figure miroir)',
    M10:'Front binôme : Est↔Sud, Nord↔Ouest',
    M12:'Même front, voisins : Est↔Sud, Nord↔Ouest',
    M4:'Même front, voisins : Est↔Nord, Ouest↔Sud',
    M14:'Front binôme, vis-à-vis : Est↔Ouest, Nord↔Sud'
  });`;
 rep(old,esc(neu),'doctrine cardinale des maisons');
 rep(esc('      // M8 = accouchement Front 2 pour TOUTE figure (sans exception)'),esc('      // M8 = accouchement du vis-à-vis (miroir) pour TOUTE figure (sans exception)'),'commentaire M8');
 const regles=`,{id:"KREG-012",title:"Orientation cardinale des fronts",text:"Chaque front compte quatre points cardinaux : Est face à Ouest, Nord face à Sud. A : Est Puer (1), Nord Via (5), Ouest Fortuna Minor (9), Sud Cauda Draconis (13). B : Est Laetitia (2), Nord Amissio (6), Ouest Carcer (10), Sud Puella (14). C : Est Caput (3), Nord Aquisitio (15), Ouest Conjunctio (11), Sud Rubeus (7). D : Est Albus (4), Nord Populus (16), Ouest Fortuna Major (12), Sud Tristitia (8). Les notions de front 1, 2 et 3 sont abandonnées.",status:"Confirmée",source:"Décision du propriétaire, 10 novembre 2026",locked:!0},{id:"KREG-013",title:"Mouvement cardinal des maisons",text:"Chaque maison déplace le point cardinal de la même façon sur les quatre fronts. Même point : M5, M6, M15. Est↔Nord et Ouest↔Sud : M1, M2, M3, M4. Vis-à-vis Est↔Ouest et Nord↔Sud : M7, M8, M13, M14. Est↔Sud et Nord↔Ouest : M9, M10, M11, M12. Les maisons Terre restent dans le même front, les maisons Air passent au front binôme, les maisons impaires passent dans l’autre boucle. M16 n’a pas de résultante.",status:"Confirmée",source:"Structure vérifiée sur les 16 figures et les 15 maisons de koun-1",locked:!0},{id:"KREG-015",title:"\u00C9l\u00E9ment des figures = \u00E9l\u00E9ment de leur front",text:"Front A (Est, Nord, Ouest, Sud) : Feu. Front B : Air. Front C : Eau. Front D : Terre. Le bar\u00E8me des forces (KREG-005) utilise cet \u00E9l\u00E9ment pour chaque figure.",status:"Confirm\u00E9e",source:"D\u00E9cision du propri\u00E9taire, 10 novembre 2026 (version 1.13.0)",locked:!0},{id:"KREG-014",title:"M8 renforce le pôle par son miroir",text:"Quand M8 porte le pôle et accouche son miroir (vis-à-vis), le pôle est renforcé : la paire miroir attaque la paire miroir de sa cible (exemple : Puer et Fortuna Minor attaquent Albus et Fortuna Major).",status:"En essai",source:"Principe énoncé par le propriétaire ; concorde avec VICTOIRE 2 et 3, question ouverte sur NUL 6",locked:!0}]`;
 rep(`source:"Concordances propos\\xE9es puis int\\xE9gr\\xE9es pour essai",locked:!0}]`,`source:"Concordances propos\\xE9es puis int\\xE9gr\\xE9es pour essai",locked:!0}`+esc(regles),'règles cardinales');}

// 13. Élément des figures = élément de leur front (A Feu, B Air, C Eau, D Terre) — décision du propriétaire
{const old=fs.readFileSync(S+'/elems_old.txt','utf8').replace(/\n$/,'');
 const neu=`const FIGURE_ELEMENTS={
'Puer':'Feu','Via':'Feu','Fortuna Minor':'Feu','Cauda Draconis':'Feu',
'Laetitia':'Air','Amissio':'Air','Carcer':'Air','Puella':'Air',
'Caput':'Eau','Rubeus':'Eau','Conjunctio':'Eau','Aquisitio':'Eau',
'Albus':'Terre','Tristitia':'Terre','Fortuna Major':'Terre','Populus':'Terre'
};`;
 rep(old,neu,'éléments = fronts');}

// 14. Instantanés des références recalculés avec koun-1 1.13.0-essai
{const esc=t=>t.replace(/[^\x00-\x7f]/g,ch=>{const c=ch.charCodeAt(0);return c<256?'\\x'+c.toString(16).toUpperCase().padStart(2,'0'):'\\u'+c.toString(16).padStart(4,'0');});
 const live=JSON.parse(fs.readFileSync(S+'/refs150.json','utf8'));
 const i0=b.indexOf('var J={engine:'),a=b.indexOf('references:[',i0),z=b.indexOf('],technical:{',a);
 if(a<0||z<0)throw Error('références introuvables');
 const refs=eval('['+b.slice(a+'references:['.length,z)+']');
 if(refs.length!==live.length)throw Error('nombre de références');
 for(const r of refs){const l=live.find(x=>x.id===r.id);if(!l)throw Error('ref '+r.id);r.snapshot=l.c;}
 b=b.slice(0,a)+'references:'+esc(JSON.stringify(refs))+b.slice(z+1);R.push('instantanés 1.13.0');}

// 15. Lecture d'ensemble du duel R1/R7 et victoire assurée (version 1.14.0-essai)
{const esc=t=>t.replace(/[^\x00-\x7f]/g,ch=>{const c=ch.charCodeAt(0);return c<256?'\\x'+c.toString(16).toUpperCase().padStart(2,'0'):'\\u'+c.toString(16).padStart(4,'0');});
 const rd=f=>fs.readFileSync(S+'/p140/'+f,'utf8').replace(/\n$/,'');
 rep(esc(rd('old_chain.txt')),esc(rd('new_chain.txt')),'chaîne de décision 1.14');
 rep(`  window.MOTEUR_UNIQUE.analyser = function(theme){`,esc(rd('fonction.txt')),'fonction lecture d’ensemble');
 rep(`var predictionEssai=null;`,`var predictionEssai=null,lectureEnsemble=null;`,'variable lecture');
 rep(`causeBlocage=figuresJuge.some(function(p){return p.forcePct===null;})?`,`causeBlocage=lectureEnsemble&&lectureEnsemble.motif==='AUCUN_SIGNAL'?'AUCUN_SIGNAL_LECTURE_ENSEMBLE':figuresJuge.some(function(p){return p.forcePct===null;})?`,'cause aucun signal');
 rep(`raison=causeBlocage==='DOUBLE_REPOS_JUGE_NON_CHIFFRE'?`,esc(`raison=causeBlocage==='AUCUN_SIGNAL_LECTURE_ENSEMBLE'?'Calcul bloqué : aucun signal des maisons M4, M8, M12, M16 ni de M15/M7 sur les pôles.':causeBlocage==='DOUBLE_REPOS_JUGE_NON_CHIFFRE'?`),'raison aucun signal');
 rep(`decisionFinale:{verdict:vainqueur,statut:statutDecision,phase:phaseFinale,raison:raison,regle:predictionEssai?predictionEssai.motif:arbitrage.regle},`,`decisionFinale:{verdict:vainqueur,statut:statutDecision,phase:phaseFinale,raison:raison,regle:predictionEssai?predictionEssai.motif:arbitrage.regle,victoireAssuree:!!(lectureEnsemble&&lectureEnsemble.assuree&&predictionEssai&&predictionEssai.motif==='LECTURE_ENSEMBLE'),annulationsEtVerrous:typeof window.annulationsEtVerrous==='function'?window.annulationsEtVerrous(theme,poles,confrontation.baremeForces):null},lectureEnsemble:lectureEnsemble,`,'decisionFinale assurée');
 rep(`        etabli:arbitrage.phase==='CAS_VICTOIRE_ASSUREE'&&(vainqueur==='1'||vainqueur==='2'),`,`        etabli:!!(lectureEnsemble&&lectureEnsemble.assuree&&predictionEssai&&predictionEssai.motif==='LECTURE_ENSEMBLE')||(arbitrage.phase==='CAS_VICTOIRE_ASSUREE'&&(vainqueur==='1'||vainqueur==='2')),`,'indice assurée');
}

// 16. Atelier 1.14.0 : règles de la lecture d'ensemble, anciens arbitrages remplacés, badge victoire assurée
{const esc=t=>t.replace(/[^\x00-\x7f]/g,ch=>{const c=ch.charCodeAt(0);return c<256?'\\x'+c.toString(16).toUpperCase().padStart(2,'0'):'\\u'+c.toString(16).padStart(4,'0');});
 for(const src of ['Profil exploratoire, r\\xE9f\\xE9rence NUL 6','Hypoth\\xE8se issue de la r\\xE9f\\xE9rence NUL 1','Arbitrage exp\\xE9rimental de koun-1, r\\xE9f\\xE9rence VICTOIRE 4','Priorit\\xE9 exp\\xE9rimentale \\xE9labor\\xE9e avec le corpus de r\\xE9f\\xE9rences','Concordances propos\\xE9es puis int\\xE9gr\\xE9es pour essai'])
  rep(`status:"En essai",source:"${src}"`,`status:"Remplac\\xE9e",source:"${src} \\xB7 remplac\\xE9e en 1.14.0 par la lecture d\\u2019ensemble (KREG-016)"`,'remplacée '+src.slice(0,20));
 const regles=`,{id:"KREG-016",title:"Lecture d’ensemble du duel R1/R7",text:"Pôles dans la même boucle : nul. Sinon, un point par signal : M8, M12 et M16 renforcent le pôle qu’elles portent (M8 et M16 aussi par son miroir) ; M4 affaiblit le pôle qu’elle porte ; en M15 et son miroir M7, quand un pôle ou son miroir fait face à l’autre camp, le plus fort marque. À égalité, le renfort Terre le plus concordant (force base + résultante) l’emporte. M16, sentence finale : confirme le camp en tête, annule sa victoire si elle porte l’autre pôle, ne crée jamais seule une victoire. Remplace KREG-007 à KREG-011.",status:"En essai",source:"Principes du propriétaire (M4, M8, M12, M16, M15/M7) ; 11 références sur 11 ; version 1.14.0",locked:!0},{id:"KREG-017",title:"Victoire assurée",text:"Le gagnant de la lecture d’ensemble a la victoire assurée si l’antagoniste de son pôle (la figure qui l’attaque, k−3) est contrôlé par son propre antagoniste (k−6, plus fort) ou mal positionné (absent ou à 1 % partout). Une victoire peut exister sans être assurée.",status:"En essai",source:"Principe du propriétaire ; corrélation sur le corpus : VICTOIRE 3, VICTOIRE 4 et AZ–Villarreal assurées, VICTOIRE 1 et 2 non assurées",locked:!0}`;
 const regles2=`,{id:"KREG-018",title:"Annulation circulaire",text:"Deux figures liées par l’attaque (k attaque k+3), chacune dans sa maison de repos, sont deux puissances maximales face à face : elles s’annulent (double repos). Le thème au repos complet est un nul absolu : les 16 duels s’annulent d’une figure à l’autre. Dans un thème réel, une annulation est un morceau de ce cercle et fait pencher vers le nul.",status:"En essai",source:"Principe du propriétaire ; observé dans NUL 3 (Amissio ↔ Fortuna Minor) et NUL 6 (Fortuna Minor ↔ Fortuna Major), jamais dans les victoires",locked:!0},{id:"KREG-019",title:"Verrou de front : victoire assurée",text:"Deux figures du même front, en base, chacune dans sa maison de repos à 100 % (exemple : Puer en M1 et Via en M5) : leurs puissances maximales ne s’attaquent pas et s’additionnent. Le camp qui tient seul un verrou a la victoire assurée.",status:"En essai",source:"Principe du propriétaire ; lecture « en base » retenue car la lecture « base ou résultante » est contredite par VICTOIRE 1 ; aucun cas dans le corpus actuel",locked:!0}`;
 rep(`,{id:"KREG-015",`,esc(regles+regles2)+`,{id:"KREG-015",`,'règles 1.14');
 rep(`ESSAI_CONCORDANCES_ELEMENTAIRES:["KREG-011"]}`,`ESSAI_CONCORDANCES_ELEMENTAIRES:["KREG-011"],ESSAI_LECTURE_ENSEMBLE:["KREG-016","KREG-017","KREG-019"]}`,'phase lecture -> règles');
 rep(`rules:es(t.rules||[],hh)`,`rules:[...(t.rules||[]).map(r=>hh.find(x=>x.id===r.id)||r),...hh.filter(x=>!(t.rules||[]).some(r=>r.id===x.id))]`,'registre des règles rafraîchi');
 rep(`ambiguities:es(t.ambiguities||[],bh)`,`ambiguities:[...(t.ambiguities||[]).map(r=>bh.find(x=>x.id===r.id)||r),...bh.filter(x=>!(t.ambiguities||[]).some(r=>r.id===x.id))]`,'questions rafraîchies');
 rep(`e.decision&&(0,x.jsx)(ss,{decision:e.decision})`,`e.decision&&(0,x.jsx)(ss,{decision:e.decision}),e.decision?.victoireAssuree&&(0,x.jsx)("span",{className:"badge green",children:"Victoire assur\\xE9e"})`,'badge assurée');
}

// 17. Fiche du duel calculée (pôle, maison de repos, antagoniste, contrôleur, maison attaquante)
{const esc=t=>t.replace(/[^\x00-\x7f]/g,ch=>{const c=ch.charCodeAt(0);return c<256?'\\x'+c.toString(16).toUpperCase().padStart(2,'0'):'\\u'+c.toString(16).padStart(4,'0');});
 const fiche=fs.readFileSync(S+'/p140/fiche.js','utf8').trim();
 rep(`function tA({`,esc(fiche)+`function tA({`,'fonction fiche du duel');
 const anchor=`(0,x.jsxs)("section",{className:"panel runform",children:[(0,x.jsx)("h2",{children:"Attendu, observ\\xE9, prochaine \\xE9tape"})`;
 const section=`(0,x.jsxs)("section",{className:"panel runform",children:[(0,x.jsx)("h2",{children:"Fiche du duel"}),(0,x.jsx)("p",{className:"muted",children:"Calcul\\xE9e par le moteur \\xE0 partir des 16 maisons : aucune valeur saisie \\xE0 la main."}),(0,x.jsx)("div",{className:"tablewrap",children:(0,x.jsxs)("table",{className:"comparison",children:[(0,x.jsx)("thead",{children:(0,x.jsxs)("tr",{children:[(0,x.jsx)("th",{children:"\\xC9L\\xC9MENT"}),(0,x.jsx)("th",{children:"R1"}),(0,x.jsx)("th",{children:"R7"})]})}),(0,x.jsx)("tbody",{children:(()=>{let fd=ficheDuel(g);return fd[0].lignes.map((l,i)=>(0,x.jsxs)("tr",{children:[(0,x.jsx)("td",{children:(0,x.jsx)("strong",{children:l[0]})}),(0,x.jsx)("td",{children:l[1]}),(0,x.jsx)("td",{children:fd[1].lignes[i][1]})]},i))})()})]})})]}),`;
 rep(anchor,section+anchor,'section fiche du duel');}

// 18. Nul seulement si même front (identité, miroir ou voisin) — décision du propriétaire (1.15.0)
{const esc=t=>t.replace(/[^\x00-\x7f]/g,ch=>{const c=ch.charCodeAt(0);return c<256?'\\x'+c.toString(16).toUpperCase().padStart(2,'0'):'\\u'+c.toString(16).padStart(4,'0');});
 rep(`    return {verifie:sameLoop&&(mirror||identical),regle:'MEME_BOUCLE_ET_MIROIR_OU_IDENTITE',`,`    return {verifie:sameLoop,figuresVoisines:sameLoop&&!mirror&&!identical,regle:'MEME_FRONT_IDENTITE_MIROIR_OU_VOISIN',`,'cas nul : même front');
 rep(`    var relation=cas.figuresIdentiques?'identiques':'miroirs';`,`    var relation=cas.figuresIdentiques?'identiques':(cas.figuresMiroirs?'miroirs':'voisines');`,'relation voisines');
 rep(esc(`raison:'Nul : R1 '+cas.R1.figure+' en M'+cas.R1.maison+' et R7 '+cas.R7.figure+' en M'+cas.R7.maison+' appartiennent à la même boucle de front et sont '+relation+'.',`),esc(`raison:'Nul : R1 '+cas.R1.figure+' en M'+cas.R1.maison+' et R7 '+cas.R7.figure+' en M'+cas.R7.maison+' sont dans le même front ('+relation+').',`),'raison même front');
 rep(esc(`regle:'Même boucle de front ET (figures miroirs OU figure identique) => nul. Aucun filtre supplémentaire.'};`),esc(`regle:'Même front (identité, miroir ou voisin) => nul. Aucun filtre supplémentaire.'};`),'règle même front');
 rep(`id:"KREG-002",title:"Nul : m\\xEAme boucle et identit\\xE9 ou miroir",text:"R1 et R7 dans la m\\xEAme boucle de front et figures identiques ou miroirs : nul. Aucun filtre de juge suppl\\xE9mentaire."`,esc(`id:"KREG-002",title:"Nul : même front (identité, miroir ou voisin)",text:"R1 et R7 dans le même front — figure identique, miroir (vis-à-vis) ou voisine — : nul. La même boucle seule (fronts binômes) ne donne plus un nul : le duel est lu par la lecture d’ensemble, chaque camp étant défini par le front de son pôle. Décision du propriétaire, version 1.15.0."`),'KREG-002 même front');
 rep(`status:"En essai",source:"Comparaison des r\\xE9f\\xE9rences NUL 2, 3, 4 et 5"`,`status:"Remplac\\xE9e",source:"Comparaison des r\\xE9f\\xE9rences NUL 2, 3, 4 et 5 \\xB7 remplac\\xE9e en 1.15.0 : nul seulement si m\\xEAme front (KREG-002)"`,'KREG-006 remplacée');
}

{const i=b.indexOf('var Bn={core:`');const j=b.indexOf('};var Ue=he(yt());',i);const Bn=eval('('+b.slice(i+7,j+1)+')');const h=k=>require('crypto').createHash('sha256').update(Bn[k]).digest('hex');
 rep('sourceHash:"81e86badd4b915e00f03cbc6dda749f9fe214d95e9c6aebe541edc74e5dd749d"','sourceHash:"'+h('core')+'"','core hash');console.log('nouvelle empreinte du moteur',h('core'));
 rep('bridgeHash:"d1590cd0c379a833aeeebac712d573988e03ea30ed24d340e90666beee65b914"','bridgeHash:"'+h('bridge')+'"','bridge hash');console.log('nouvelle empreinte du pont',h('bridge'));}
fs.writeFileSync(S+'/src/bundle.fixed.js',b);
const html=fs.readFileSync(process.argv[3],'utf8');const m=html.match(/base64,([A-Za-z0-9+\/=]+)"/);
let out=html.replace(m[1],Buffer.from(b,'utf8').toString('base64'));
out=out.replace('<title>koun-1 · Moteur et avancement</title>','<title>koun-1 · Moteur et avancement</title>');
fs.writeFileSync(process.argv[4],out);console.log(R.length+' corrections appliquées');
