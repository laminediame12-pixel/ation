const fs=require('fs');const S=process.argv[2];
let b=fs.readFileSync(S+'/src/bundle.js','utf8');
const R=[];const rep=(a,c,label)=>{const n=b.split(a).length-1;if(n!==1)throw Error('count '+n+' for '+label+': '+a.slice(0,80));b=b.split(a).join(c);R.push(label);};
const fr=n=>`${n}.toLocaleString("fr-FR")`;
// 1. Banc technique exhaustif
rep(`technical:{themes:512,blocked:70,resolved:442,causes:[{id:"M15_EQUAL",title:"\\xC9galit\\xE9 des forces de M15",count:56},{id:"DOUBLE_REST",title:"Double repos du juge non chiffr\\xE9",count:14}],scope:"Contr\\xF4les techniques sur 512 th\\xE8mes distincts, sans r\\xE9sultats de matchs associ\\xE9s."}`,
`technical:{themes:65536,blocked:8544,resolved:56992,causes:[{id:"M15_EQUAL",title:"\\xC9galit\\xE9 des forces de M15",count:6986},{id:"DOUBLE_REST",title:"Double repos du juge non chiffr\\xE9",count:1558}],verdicts:{N:36177,"1":10870,"2":9945},sample:{themes:512,blocked:70,M15_EQUAL:56,DOUBLE_REST:14},engineVersion:"1.12.0-essai",computedAt:"2026-11-10",scope:"Banc exhaustif : les 65 536 combinaisons de m\\xE8res (16\\u2074) recalcul\\xE9es avec koun-1 1.12.0-essai, sans r\\xE9sultats de matchs associ\\xE9s. L\\u2019ancien \\xE9chantillon de 512 th\\xE8mes (70 blocages) donnait des proportions comparables."}`,'banc exhaustif');
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
`evidence:"6 986 cas sur les 65 536 th\\xE8mes du banc exhaustif (56 sur l\\u2019ancien \\xE9chantillon de 512) ; ce nombre ne mesure pas des r\\xE9sultats de matchs."`,'KAMB-001 evidence');
rep(`evidence:"REG-001 \\xB7 KREG-005 \\xB7 14 blocages du juge dans le banc technique",next:"Obtenir une valeur explicitement d\\xE9cid\\xE9e par le propri\\xE9taire ; conserver l\\u2019exception sym\\xE9trique.",status:"Ouverte"}`,
`evidence:"REG-001 \\xB7 KREG-005 \\xB7 AMB-001 \\xB7 1 558 blocages du juge sur les 65 536 th\\xE8mes du banc exhaustif",next:"Obtenir une valeur explicitement d\\xE9cid\\xE9e par le propri\\xE9taire ; conserver l\\u2019exception sym\\xE9trique. Cette question compl\\xE8te AMB-001 (cons\\xE9quence sur le verdict).",status:"Ouverte"},{id:"KAMB-003",title:"Taux de nul structurel du moteur",question:"Sur les 65 536 th\\xE8mes possibles, koun-1 rend 55,2 % de nuls. La m\\xEAme boucle (KREG-002) et les ressources partag\\xE9es (KREG-006) d\\xE9clarent nuls 32 768 th\\xE8mes, soit exactement la moiti\\xE9 : les 16 figures forment deux r\\xE9seaux de 8 et deux p\\xF4les se trouvent dans le m\\xEAme r\\xE9seau une fois sur deux. Faut-il restreindre KREG-006, encore en essai ?",evidence:"KREG-002 \\xB7 KREG-006 \\xB7 r\\xE9f\\xE9rences NUL 2 \\xE0 5 \\xB7 banc exhaustif 65 536 th\\xE8mes",next:"Enregistrer des pr\\xE9dictions avant de nouveaux matchs et comparer le taux de nul r\\xE9el (environ un match sur quatre en football) \\xE0 celui du moteur. Aucune modification sans d\\xE9cision explicite.",status:"Ouverte"},{id:"KAMB-004",title:"\\xC9cart R1 / R7 : d\\xE9finition des p\\xF4les",question:"Sur les 65 536 th\\xE8mes, R1 gagne 10 870 fois et R7 9 945 fois. Le test d\\u2019inversion montre que le code de d\\xE9cision est neutre (65 536 verdicts invers\\xE9s \\xE0 l\\u2019identique) : l\\u2019\\xE9cart vient de la d\\xE9finition des p\\xF4les (R1 = maison de Repos de la figure en M1, R7 = R1 + 6). Cet \\xE9cart est-il voulu, par exemple comme avantage du terrain pour R1 ?",evidence:"TST-003 \\xB7 banc exhaustif \\xB7 essai R7 = R1 + 8 : 6 r\\xE9f\\xE9rences sur 11 perdues et \\xE9cart maintenu (10 550 / 10 037)",next:"V\\xE9rifier sur de nouveaux matchs si R1 correspond \\xE0 l\\u2019\\xE9quipe qui re\\xE7oit. Aucune modification des p\\xF4les sans d\\xE9cision explicite.",status:"Ouverte"}`,'KAMB-002/KAMB-003');
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
rep(`observed:"",status:"\\xC0 ex\\xE9cuter",next:"Renseigner deux th\\xE8mes invers\\xE9s pour comparaison."`,`observed:"Banc exhaustif du 10 novembre 2026 : les 65 536 th\\xE8mes recalcul\\xE9s avec R1 et R7 \\xE9chang\\xE9s donnent tous le verdict invers\\xE9 (1\\u21942, nul\\u2194nul, blocage\\u2194blocage). Le code de d\\xE9cision ne favorise aucun camp.",status:"Conforme",next:"L\\u2019\\xE9cart global R1/R7 vient de la d\\xE9finition des p\\xF4les : voir KAMB-004."`,'TST-003');
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
rep(`window.MOTEUR_UNIQUE.version = '1.12.0-essai';`,`window.MOTEUR_UNIQUE.version = '1.12.1-essai';`,'version moteur');
rep(`version:"1.12.0-essai",sourceHash:`,`version:"1.12.1-essai",sourceHash:`,'version atelier');
rep(`FICHIER SOURCE INT\\xC9GR\\xC9 SANS MODIFICATION`,`MOTEUR INT\\xC9GR\\xC9 \\xB7 CAMPS DES MAISONS PAR LES FIGURES`,'eyebrow moteur');
rep(`int\\xE9gr\\xE9 sans changer ses calculs.`,`int\\xE9gr\\xE9. Version 1.12.1 : les maisons sont attribu\\xE9es \\xE0 R1 ou R7 par leurs figures en base et en r\\xE9sultante.`,'sous-titre moteur');
rep(`(0,x.jsx)("th",{children:"FRONT"})`,`(0,x.jsx)("th",{children:"FRONT \\xB7 CAMP"})`,'th camp');
rep(`(0,x.jsx)("td",{children:I.front})`,`(0,x.jsx)("td",{children:[(0,x.jsx)("strong",{children:I.front}),(0,x.jsx)("small",{children:campMaisonAtelier(g,I)})]})`,'td camp');
rep(`function tA({`,`function campMaisonAtelier(g,I){let n=k=>new Set([...(g.fronts?.[k]?.front||[]),...(g.fronts?.[k]?.binomes||[])]),a=n("R1"),b=n("R7"),c=f=>f?a.has(f)&&!b.has(f)?"R1":b.has(f)&&!a.has(f)?"R7":"commun":null,x=c(I.base),y=I.house===16?null:c(I.result);return !y||x===y?"Camp "+x:"Partag\\xE9e ("+x+" / "+y+")"}function tA({`,'helper camp');

{const i=b.indexOf('var Bn={core:`');const j=b.indexOf('};var Ue=he(yt());',i);const Bn=eval('('+b.slice(i+7,j+1)+')');const h=k=>require('crypto').createHash('sha256').update(Bn[k]).digest('hex');
 rep('sourceHash:"81e86badd4b915e00f03cbc6dda749f9fe214d95e9c6aebe541edc74e5dd749d"','sourceHash:"'+h('core')+'"','core hash');console.log('nouvelle empreinte du moteur',h('core'));
 rep('bridgeHash:"d1590cd0c379a833aeeebac712d573988e03ea30ed24d340e90666beee65b914"','bridgeHash:"'+h('bridge')+'"','bridge hash');console.log('nouvelle empreinte du pont',h('bridge'));}
fs.writeFileSync(S+'/src/bundle.fixed.js',b);
const html=fs.readFileSync(process.argv[3],'utf8');const m=html.match(/base64,([A-Za-z0-9+\/=]+)"/);
let out=html.replace(m[1],Buffer.from(b,'utf8').toString('base64'));
out=out.replace('<title>koun-1 · Moteur et avancement</title>','<title>koun-1 · Moteur et avancement</title>');
fs.writeFileSync(process.argv[4],out);console.log(R.length+' corrections appliquées');
