// ═══════════════════════════════════════════════════════════════
// CARRE GEO GLYPHES
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════

(function(){

// glyphes = carte de points corrigée (Geo-Map d'Ellemine), 1=point simple, 2=point double
const GLYPHS = {
  "Puer":[1,1,2,1], "Laetitia":[1,2,2,2], "Caput":[2,1,1,1], "Albus":[2,2,1,2],
  "Via":[1,1,1,1], "Amissio":[1,2,1,2], "Rubeus":[2,1,2,2], "Tristitia":[2,2,2,1],
  "Fortuna minor":[1,1,2,2], "Carcer":[1,2,2,1], "Conjonctio":[2,1,1,2], "Fortuna majeur":[2,2,1,1],
  "Cauda":[1,1,1,2], "Puella":[1,2,1,1], "Aquisitio":[2,1,2,1], "Populus":[2,2,2,2]
};
// INDEX BINAIRE (28/07/26, doctrine Ellemine_D, vérifié : Puer=11 exact).
// Ordre des lignes du glyphe = feu, air, eau, terre. Poids par ligne :
// feu=1, air=2, eau=4, terre=8. 1 point = OUVERT (compte le poids plein) ;
// 2 points = FERMÉ (compte toujours 0, quelle que soit la ligne). Somme
// des 4 lignes = index binaire (0 à 15, bijection exacte sur les 16
// figures — Populus=0 tout fermé, Via=15 tout ouvert).
function indexBinaire(figName){
  const g = GLYPHS[figName];
  if(!g) return null;
  const [feu, air, eau, terre] = g;
  const val = (d, w) => d===1 ? w : 0;
  return val(feu,1) + val(air,2) + val(eau,4) + val(terre,8);
}
const INDEX_BINAIRE = {};
Object.keys(GLYPHS).forEach(n => { INDEX_BINAIRE[n] = indexBinaire(n); });
const ABBR = {
  "Puer":"Puer","Laetitia":"Laet.","Caput":"Caput","Albus":"Albus","Via":"Via",
  "Amissio":"Amis.","Rubeus":"Rub.","Tristitia":"Trist.","Fortuna minor":"F.min",
  "Carcer":"Carc.","Conjonctio":"Conj.","Fortuna majeur":"F.maj","Cauda":"Cauda",
  "Puella":"Puella","Aquisitio":"Aqui.","Populus":"Popul."
};
// CORRIGÉ (21/08/26, demande Ellemine_D "pourquoi trop de verdicts
// Indécis") : BUG FONDAMENTAL — LOOP_A/LOOP_B contenaient des noms
// d'affichage capitalisés ("Caput", "Conjonctio", "Aquisitio", "Fortuna
// minor"...) alors que loopOf() est appelé PARTOUT dans le moteur avec
// les clés internes minuscules du thème ("caput_draconis", "conjunctio",
// "acquisitio", "fortuna_minor"...). Aucune figure réelle ne matchait
// donc jamais → loopOf() renvoyait TOUJOURS null → comparerBouclesAntagonistesR1R7
// se déclarait "non applicable" à 100% des thèmes (vérifié sur 3000
// thèmes aléatoires) → le panneau "VERDICT DU MATCH" affichait
// systématiquement "Indécis", quel que soit le thème. Corrigé avec les
// clés internes exactes de MAP_GEO/FIGS_V7 (répartition par parité
// d'index, déjà démontrée exacte ailleurs dans le moteur).
var LOOP_A = ["puer","caput_draconis","via","rubeus","fortuna_minor","conjunctio","cauda_draconis","acquisitio"];
var LOOP_B = ["laetitia","albus","amissio","tristitia","carcer","fortuna_major","puella","populus"];
// CORRIGÉ (21/08/26) : loopOf() est utilisé à la fois avec les clés
// internes minuscules du thème ("caput_draconis") ET, localement dans
// le module carré géo ci-dessous, avec les noms courts capitalisés de
// son propre tableau FIGURES ("Caput", "Cauda", "Conjonctio",
// "Aquisitio"...). NORM_FIG_LOOP fait le pont entre les deux formats
// sans casser ni l'un ni l'autre appelant.
var NORM_FIG_LOOP = {
  "Puer":"puer","Laetitia":"laetitia","Caput":"caput_draconis","Albus":"albus",
  "Via":"via","Amissio":"amissio","Rubeus":"rubeus","Tristitia":"tristitia",
  "Fortuna minor":"fortuna_minor","Carcer":"carcer","Conjonctio":"conjunctio",
  "Fortuna majeur":"fortuna_major","Cauda":"cauda_draconis","Puella":"puella",
  "Aquisitio":"acquisitio","Populus":"populus"
};
// API globale du protocole R1/R7 : évite toute perte de portée entre les blocs du système.
function loopOf(name){ const n = NORM_FIG_LOOP[name] || name; return LOOP_A.indexOf(n)!==-1 ? 'A' : (LOOP_B.indexOf(n)!==-1 ? 'B' : null); }
if(typeof window!=='undefined'){ window.LOOP_A=LOOP_A; window.LOOP_B=LOOP_B; window.loopOf=loopOf; window.NORM_FIG_LOOP=NORM_FIG_LOOP; }
function chaseDistance(fromName, toName){
  const loop = loopOf(fromName);
  if(loop !== loopOf(toName)) return null; // pas dans la même boucle -> chasse impossible
  const arr = loop==='A' ? LOOP_A : LOOP_B;
  const i0 = arr.indexOf(fromName), i1 = arr.indexOf(toName);
  return (i1 - i0 + 8) % 8;
}
const glyphKey = g => g.join('');
const GLYPH_TO_NAME = {};
Object.keys(GLYPHS).forEach(n => GLYPH_TO_NAME[glyphKey(GLYPHS[n])] = n);
function addFigures(g1, g2){
  return g1.map((v,i)=> v===g2[i] ? 2 : 1);
}
function resultanteName(figName, houseName){
  const r = addFigures(GLYPHS[figName], GLYPHS[houseName]);
  return GLYPH_TO_NAME[glyphKey(r)] || '?';
}

// figure -> maison de repos (1..16), binome, antagoniste (donnees Ellemine)
const FIGURES = [
  {n:"Puer",     h:1,  b:"Caput",         a:"Puella"},
  {n:"Laetitia", h:2,  b:"Albus",         a:"Aquisitio"},
  {n:"Caput",    h:3,  b:"Via",           a:"Populus"},
  {n:"Albus",    h:4,  b:"Amissio",       a:"Puer"},
  {n:"Via",      h:5,  b:"Rubeus",        a:"Laetitia"},
  {n:"Amissio",  h:6,  b:"Tristitia",     a:"Caput"},
  {n:"Rubeus",   h:7,  b:"Fortuna minor", a:"Albus"},
  {n:"Tristitia",h:8,  b:"Carcer",        a:"Via"},
  {n:"Fortuna minor", h:9,  b:"Conjonctio",    a:"Amissio"},
  {n:"Carcer",   h:10, b:"Fortuna majeur",a:"Rubeus"},
  {n:"Conjonctio",h:11,b:"Cauda",         a:"Tristitia"},
  {n:"Fortuna majeur",h:12,b:"Puella",    a:"Fortuna minor"},
  {n:"Cauda",    h:13, b:"Aquisitio",     a:"Carcer"},
  {n:"Puella",   h:14, b:"Populus",       a:"Conjonctio"},
  {n:"Aquisitio",h:15, b:"Puer",          a:"Fortuna majeur"},
  {n:"Populus",  h:16, b:"Laetitia",      a:"Cauda"}
];

// Élément propre de chaque figure (doctrine Ellemine — indépendant de sa maison de repos)
const FIGURE_ELEMENT = {
  'Puer':'feu', 'Laetitia':'feu', 'Fortuna minor':'feu', 'Populus':'feu',
  'Caput':'air', 'Rubeus':'air', 'Conjonctio':'air', 'Aquisitio':'air',
  'Albus':'eau', 'Via':'eau', 'Amissio':'eau', 'Cauda':'eau',
  'Tristitia':'terre', 'Carcer':'terre', 'Fortuna majeur':'terre', 'Puella':'terre'
};

const HOUSE_PAIRS = [[1,7],[2,8],[3,9],[4,10],[5,11],[6,12]];
const ELEM_COLOR = {feu:'#C0392B', air:'#E8C547', eau:'#3B82C4', terre:'#9AA0A6'};
const FAMILY_COLORS = ['#6C7BFF','#C77A3B','#3FBF8F','#E85D9E'];
const PILIERS = [1,8,9,12,15];

const houseOf = {}; FIGURES.forEach(f=>houseOf[f.h]=f.n);

// ── LOI DES FAMILLES D'OPPOSITION (27/07/26, doctrine Ellemine_D, vérifiée
// par calcul sur les 16 figures x 8 paires, ZÉRO exception) : pour toute
// paire de maisons opposées (M, M+6), combiner les deux résultantes de
// N'IMPORTE QUELLE figure occupante donne TOUJOURS la même figure fixe —
// l'occupant s'annule algébriquement (X⊕A⊕X⊕B = A⊕B, Populus = neutre).
// Deux familles seulement, indépendantes de qui occupe le thème :
const OPPOSITION_PAIRS = [[1,7],[2,8],[3,9],[4,10],[5,11],[6,12],[13,15],[14,16]];
const OPPOSITION_FAMILY_OF_HOUSE = {
  1:'Carcer', 7:'Carcer', 2:'Carcer', 8:'Carcer', 5:'Carcer', 11:'Carcer', 6:'Carcer', 12:'Carcer',
  3:'Puella', 9:'Puella', 4:'Puella', 10:'Puella', 13:'Puella', 15:'Puella', 14:'Puella', 16:'Puella'
};
const byName = {}; FIGURES.forEach(f=>byName[f.n]=f);

const ELEMENT_OF_HOUSE = {1:'feu',5:'feu',9:'feu',13:'feu', 2:'air',6:'air',10:'air',14:'air', 3:'eau',7:'eau',11:'eau',15:'eau', 4:'terre',8:'terre',12:'terre',16:'terre'};
const ELEMENT_COLORS = {feu:'#C0392B', air:'#E8C547', eau:'#3B82C4', terre:'#9AA0A6'};

function pairDiffKey(m1,m2){
  const g1 = GLYPHS[houseOf[m1]], g2 = GLYPHS[houseOf[m2]];
  return g1.map((v,i)=> v===g2[i] ? '0' : '1').join('');
}
const houseFamily = {};   // maison -> index de famille
const familyDiffKey = {}; // index -> clé de diff (quelles lignes changent)
const familyMembers = {}; // index -> liste des maisons
const familyResultName = {}; // index -> nom de la figure = somme des 2 maisons opposées
{
  const famMap = {};
  let famIdx = 0;
  HOUSE_PAIRS.forEach(([a,b])=>{
    const key = pairDiffKey(a,b);
    if(!(key in famMap)) famMap[key] = famIdx++;
    const idx = famMap[key];
    houseFamily[a] = idx; houseFamily[b] = idx;
    familyDiffKey[idx] = key;
    (familyMembers[idx] = familyMembers[idx]||[]).push(a,b);
    const sumGlyph = addFigures(GLYPHS[houseOf[a]], GLYPHS[houseOf[b]]);
    familyResultName[idx] = GLYPH_TO_NAME[glyphKey(sumGlyph)] || '?';
  });
}
// matrix
const table = document.getElementById('matrix');
const SPECIALES = {5:'complément total', 8:'protection indirecte', 13:'chasse antagoniste', 16:'terre — incompatible avec air (défavorable pour les figures air)'};
let thead = '<tr><th class="corner"></th>';
for(let m=1;m<=16;m++){
  const cls = [PILIERS.includes(m)?'pilier':'', SPECIALES[m]?'special-col':'', 'elem-'+ELEMENT_OF_HOUSE[m], (m%2===0?'fav-even':'fav-odd'), 'opp-'+OPPOSITION_FAMILY_OF_HOUSE[m].toLowerCase()].join(' ');
  const title = ` title="${SPECIALES[m] ? SPECIALES[m]+' — ' : ''}${m%2===0 ? 'FAVORABLE (maison paire) : la résultante de toute figure y retombe dans sa propre boucle' : 'DÉFAVORABLE (maison impaire) : la résultante de toute figure y retombe dans la boucle opposée'} — famille d'opposition M${OPPOSITION_PAIRS.find(p=>p.includes(m)).filter(x=>x!==m)[0]} : ${OPPOSITION_FAMILY_OF_HOUSE[m]} (fixe, indépendant de l'occupant)"`;
  const famStyle = houseFamily[m]!==undefined ? ` style="border-top:4px solid ${FAMILY_COLORS[houseFamily[m]]};"` : '';
  thead += `<th class="colhead ${cls}"${title}${famStyle}>M${m}${SPECIALES[m]?'✦':''}</th>`;
}
thead += '</tr>';
table.innerHTML = thead;

FIGURES.forEach(f=>{
  const tr = document.createElement('tr');
  let row = `<th class="rowhead">${f.n}</th>`;
  for(let m=1;m<=16;m++){
    const resident = houseOf[m];
    let tier, label;
    if(m===f.h){tier='repos'; label='R';}
    else if(resident===f.b){tier='binome'; label='B';}
    else if(resident===f.a){tier='antag'; label='A';}
    else {tier='neutre'; label='·';}

    const resultName = resultanteName(f.n, resident);
    let relClass, relColor;
    if(tier==='repos'){relClass='res-autorepos'; relColor='#8E5FC7';}
    else if(resultName===f.n){relClass='res-self'; relColor='#C7A143';}
    else if(resultName===f.b){relClass='res-binome'; relColor='#4CD97B';}
    else if(resultName===f.a){relClass='res-antag'; relColor='#FF5A45';}
    else if(resultName===resident){relClass='res-resident'; relColor='#4C7A70';}
    else {relClass='res-autre'; relColor='#B9AD8F';}

    const dist = chaseDistance(resultName, f.a);
    const distLabel = dist===null ? '' : (dist===0 ? '★antag' : `→${dist} saut${dist>1?'s':''}`);
    const distColor = dist===0 ? '#FF5A45' : (dist!==null ? '#E7B84B' : '');

    const pilierCls = PILIERS.includes(m) ? 'pilier-col' : '';
    const specialCls = SPECIALES[m] ? 'special-col' : '';
    const elemHouse = ELEMENT_OF_HOUSE[m];
    const elemFig = FIGURE_ELEMENT[f.n];
    const concordance = elemHouse === elemFig;
    // Favorabilité PAR CASE (pas par colonne) : la case (f.n, M${m}) est AMIE
    // (favorable) si sa résultante reste dans la boucle propre de f.n, ou
    // ENNEMIE (défavorable) si la résultante bascule dans la boucle opposée
    // — la relation entre LES DEUX FIGURES de cette case précise (f.n et sa
    // résultante), doctrine Ellemine_D confirmée par calcul le 27/07/26.
    // EXCEPTION M16 (27/07/26, maison spéciale, élément terre) : toute
    // figure d'élément AIR y est défavorable par incompatibilité élémentaire
    // directe (air/terre incompatibles), même si la règle générale de
    // boucle donnerait favorable (M16 est paire). Override explicite.
    let favorable = tier==='repos' ? true : (loopOf(f.n) === loopOf(resultName));
    if (m===16 && FIGURE_ELEMENT[f.n]==='air') favorable = false;
    const favCls = favorable ? 'fav-friend' : 'fav-enemy';
    const favTitle = (m===16 && FIGURE_ELEMENT[f.n]==='air')
      ? `Case ENNEMIE (défavorable) pour ${f.n} : M16 (terre) incompatible avec l élément air`
      : (favorable
        ? `Case AMIE (favorable) pour ${f.n} : la résultante (${resultName}) reste dans sa boucle propre`
        : `Case ENNEMIE (défavorable) pour ${f.n} : la résultante (${resultName}) bascule dans la boucle opposée`);
    row += `<td class="cell ${tier} ${pilierCls} ${specialCls} elem-${elemHouse}" data-fig="${f.n}" data-house="${m}" data-tier="${tier}" data-resident="${resident}" data-result="${resultName}" data-relclass="${relClass}" data-dist="${dist===null?'':dist}">
      <span class="elem-mark elem-${elemHouse}${concordance?' concordance':''}" title="element de M${m} : ${elemHouse}${concordance?' -- concordance avec element propre de '+f.n:''}"></span>
      <span class="match-mark match-fig" title="figure de base concernée par le clic"></span>
      <span class="match-mark match-res" title="résultante concernée par le clic"></span>
      <span class="fav-mark ${favCls}" title="${favTitle}"></span>
      <div class="tier-label">${label}</div>
      <div class="result-label" style="color:${relColor}">${ABBR[resultName]||resultName}</div>
      ${distLabel ? `<div class="dist-label" style="color:${distColor}">${distLabel}</div>` : ''}
    </td>`;
  }
  tr.dataset.fig = f.n;
  tr.innerHTML = row;
  table.appendChild(tr);
});

const readings = {
  repos: (f,m) => `<span class="t">${f} au repos en M${m}</span><br>Pleine puissance : la figure exprime sa nature propre sans filtre. Lecture foot : la zone/fonction de M${m} est totalement gouvernée par ${f} — effet maximal, peu de résistance attendue.`,
  binome: (f,m,r) => `<span class="t">${f} en M${m} — binôme (${r}) en résidence</span><br>Concordance : la maison nourrit la figure plutôt que de la freiner. Lecture foot : l'événement/zone de M${m} amplifie ou soutient ce que porte ${f}, alliance plutôt qu'opposition.`,
  antag: (f,m,r) => `<span class="t">${f} en M${m} — antagoniste (${r}) en résidence</span><br>Discordance : la maison s'oppose structurellement à la figure. Lecture foot : ${f} est freinée/contestée sur la fonction de M${m}, à croiser avec les piliers avant de trancher.`,
  neutre: (f,m) => `<span class="t">${f} en M${m} — neutre</span><br>Ni repos, ni binôme, ni antagoniste : la figure s'exprime normalement, sans renfort ni frein doctrinal particulier depuis cette couche.`
};

function clearHighlights(){
  document.querySelectorAll('.cell.selected, .cell.selected-antag, .cell.selected-binome, .cell.hl-antag, .cell.hl-binome, .cell.rel-binome-strong, .cell.rel-binome-weak, .cell.rel-antag-strong, .cell.rel-antag-weak, .cell.blink-antag, .cell.blink-binome').forEach(el=>{
    el.classList.remove('selected','selected-antag','selected-binome','hl-antag','hl-binome','rel-binome-strong','rel-binome-weak','rel-antag-strong','rel-antag-weak','blink-antag','blink-binome');
  });
  document.querySelectorAll('.match-mark.active').forEach(el=>{ el.classList.remove('active'); el.style.background=''; el.style.borderColor=''; });
  document.querySelectorAll('.rowhead.hl-antag, .rowhead.hl-binome').forEach(el=>{
    el.classList.remove('hl-antag','hl-binome');
  });
  document.querySelectorAll('tr.row-hl-antag, tr.row-hl-binome').forEach(el=>{
    el.classList.remove('row-hl-antag','row-hl-binome');
  });
}

function selectMatrixCell(td, fromNetworkPanel){
  if(!td) return;
  const f = td.dataset.fig, m = td.dataset.house, tier = td.dataset.tier, resident = td.dataset.resident;
  const result = td.dataset.result, relClass = td.dataset.relclass;
  const mNum = parseInt(m);

  clearHighlights();
  if(relClass==='res-antag'){ td.classList.add('selected-antag'); }
  else if(relClass==='res-binome'){ td.classList.add('selected-binome'); }
  else { td.classList.add('selected'); }
  td.scrollIntoView({block:'center', inline:'center', behavior:'smooth'});

  const fig = byName[f];
  const foundBinome = [], foundAntag = [];

  const isM1Net = fromNetworkPanel && mNum===1 && (f===lastFig1 || f===lastR1) && lastFig1 && lastR1;
  const isM7Net = fromNetworkPanel && mNum===7 && (f===lastFig7 || f===lastR7) && lastFig7 && lastR7;

  let antagTargets = [], binomeTargets = [], networkLabel = '';
  if(isM1Net){
    const bf = byName[lastFig1], br = byName[lastR1];
    antagTargets = [...new Set([bf.a, br.a])];
    binomeTargets = [...new Set([bf.b, br.b])];
    networkLabel = `<br><br><em>Réseau complet de M1 suivi : ${lastFig1} (base) + ${lastR1} (rotation R1).</em>`;
  } else if(isM7Net){
    const bf = byName[lastFig7], br = byName[lastR7];
    antagTargets = [...new Set([bf.a, br.a])];
    binomeTargets = [...new Set([bf.b, br.b])];
    networkLabel = `<br><br><em>Réseau complet de M7 suivi : ${lastFig7} (base) + ${lastR7} (rotation R7).</em>`;
  } else if(fig){
    antagTargets = [fig.a];
    binomeTargets = [fig.b];
  }

  if(antagTargets.length || binomeTargets.length){
    document.querySelectorAll('td.cell.theme-active').forEach(el=>{
      const otherFig = el.dataset.fig;
      const otherHouse = el.dataset.house;
      const otherResult = el.dataset.result;
      if(parseInt(otherHouse) === mNum) return;
      const strong = TIER_SCORE[el.dataset.tier] >= 2;
      const figIsAntag = antagTargets.includes(otherFig);
      const resIsAntag = antagTargets.includes(otherResult);
      const figIsBinome = binomeTargets.includes(otherFig);
      const resIsBinome = binomeTargets.includes(otherResult);
      if(figIsAntag || resIsAntag){
        el.classList.add('blink-antag');
        const via = figIsAntag && resIsAntag ? 'base+résultante' : (figIsAntag ? 'base' : `résultante ${otherResult}`);
        foundAntag.push(`M${otherHouse}=${otherFig} (${strong?'forte':'faible'}, via ${via})`);
        if(figIsAntag){ const mm = el.querySelector('.match-fig'); if(mm){ mm.classList.add('active'); const c=ELEM_COLOR[FIGURE_ELEMENT[otherFig]]; if(c){ mm.style.background=c; mm.style.borderColor=c; } } }
        if(resIsAntag){ const mm = el.querySelector('.match-res'); if(mm){ mm.classList.add('active'); const c=ELEM_COLOR[FIGURE_ELEMENT[otherResult]]; if(c){ mm.style.background=c; mm.style.borderColor=c; } } }
      } else if(figIsBinome || resIsBinome){
        el.classList.add('blink-binome');
        const via = figIsBinome && resIsBinome ? 'base+résultante' : (figIsBinome ? 'base' : `résultante ${otherResult}`);
        foundBinome.push(`M${otherHouse}=${otherFig} (${strong?'forte':'faible'}, via ${via})`);
        if(figIsBinome){ const mm = el.querySelector('.match-fig'); if(mm){ mm.classList.add('active'); const c=ELEM_COLOR[FIGURE_ELEMENT[otherFig]]; if(c){ mm.style.background=c; mm.style.borderColor=c; } } }
        if(resIsBinome){ const mm = el.querySelector('.match-res'); if(mm){ mm.classList.add('active'); const c=ELEM_COLOR[FIGURE_ELEMENT[otherResult]]; if(c){ mm.style.background=c; mm.style.borderColor=c; } } }
      }
    });
    document.querySelectorAll('th.rowhead').forEach(th=>{
      if(antagTargets.includes(th.textContent)) th.classList.add('hl-antag');
      if(binomeTargets.includes(th.textContent)) th.classList.add('hl-binome');
    });
    document.querySelectorAll('tr[data-fig]').forEach(rowEl=>{
      if(antagTargets.includes(rowEl.dataset.fig)) rowEl.classList.add('row-hl-antag');
      if(binomeTargets.includes(rowEl.dataset.fig)) rowEl.classList.add('row-hl-binome');
    });
  }

  const relText = {
    'res-autorepos':`${f} au repos s'additionne à elle-même (${f} ⊕ ${f}) → résultante toujours Populus, la figure vide/neutre — expression pure sans reste, pas une relation vers une autre figure`,
    'res-self':'la résultante boucle sur la figure de base elle-même',
    'res-binome':`la résultante EST le binôme (${result}) — la maison pousse ${f} droit vers son allié`,
    'res-antag':`la résultante EST l'antagoniste (${result}) — la maison pousse ${f} droit vers son ennemi`,
    'res-resident':`la résultante EST la figure de repos de M${m} (${resident}) elle-même — la maison absorbe ${f} dans sa propre nature`,
    'res-autre':`la résultante (${result}) est extérieure au triangle base/binôme/antagoniste — relation à explorer`
  }[relClass];

  const dist = td.dataset.dist;
  let chaseText = '';
  if(dist !== ''){
    chaseText = dist === '0'
      ? `<br><br><strong style="color:#FF5A45">Chasse : cible atteinte directement</strong> — la résultante EST déjà l'antagoniste (${fig.a}), 0 saut.`
      : `<br><br><strong style="color:#E7B84B">Chasse binôme : ${dist} saut${dist>1?'s':''}</strong> — depuis ${result}, en suivant la chaîne binôme, on atteint l'antagoniste (${fig.a}) en ${dist} pas.`;
  } else if(fig) {
    chaseText = `<br><br><span style="color:#B9AD8F">Pas de chasse possible : ${result} reste dans la boucle de ${f}, l'antagoniste (${fig.a}) est dans l'autre boucle — inatteignable par binôme depuis cette case.</span>`;
  }

  const antagLabel = isM1Net || isM7Net ? antagTargets.join(' + ') : (fig?fig.a:'?');
  const binomeLabel = isM1Net || isM7Net ? binomeTargets.join(' + ') : (fig?fig.b:'?');

  const detail = document.getElementById('detail');
  detail.innerHTML = readings[tier](f, m, resident) +
    (PILIERS.includes(mNum) ? `<br><br><em>M${m} est une maison pilier — vérifier l'état du veto structurel avant application.</em>` : '') +
    (SPECIALES[mNum] ? `<br><br><em>M${m} maison spéciale : ${SPECIALES[mNum]}.</em>` : '') +
    `<br><br><strong>Résultante (${f} ⊕ ${resident}) = ${result}</strong><br>${relText}` +
    chaseText +
    networkLabel +
    `<br><br><span style="color:#FF5A45">■</span> antagoniste(s) ${antagLabel} : ${foundAntag.length ? `<span style="color:#FF5A45">visible</span> dans le thème en ${foundAntag.join(', ')}` : '<span style="color:#B9AD8F">invisible (absent du thème actif)</span>'} &nbsp;|&nbsp; <span style="color:#4CD97B">■</span> binôme(s) ${binomeLabel} : ${foundBinome.length ? `<span style="color:#4CD97B">visible</span> dans le thème en ${foundBinome.join(', ')}` : '<span style="color:#B9AD8F">invisible (absent du thème actif)</span>'}`;
}

document.getElementById('matrix').addEventListener('click', e=>{
  const td = e.target.closest('td.cell');
  if(!td) return;
  selectMatrixCell(td);
});

const TIER_SCORE = {repos:3, binome:2, neutre:1, antag:0};
function tierOf(figName, house){
  const resident = houseOf[house];
  const fig = byName[figName];
  if(house === fig.h) return 'repos';
  if(resident === fig.b) return 'binome';
  if(resident === fig.a) return 'antag';
  return 'neutre';
}

const TIER_LABEL = {repos:'REPOS', binome:'BINÔME', antag:'ANTAGONISTE', neutre:'NEUTRE'};

function renderVerdictM1M7(theme){
  const fig1 = theme[1], fig7 = theme[7];

  // R1/R7 = rotation ouverte par la maison de repos naturelle de la figure en M1.
  // Exemple : Caput Draconis en M1 -> repos M3 -> R1=M3, R9=M9.
  // CORRIGÉ (24/08/26) : getRotationOrderFromRepos est le moteur GLOBAL du
  // script suivant — il résout la maison de repos via FIGS_V7.indexOf(fig)
  // et attend donc un code en minuscules ('populus'). On lui passait le nom
  // local capitalisé ("Populus") : indexOf renvoyait -1, la maison de repos
  // retombait sur 1, et la rotation était TRIVIALE (R1=M1, R7=M7) pour les
  // 16 figures — vérifié 400/400 tirages. Le widget affichait donc en
  // permanence « confondue avec M1 — rotation triviale » au lieu de la
  // vraie rotation (Populus en M1 -> repos M16 -> R1=M16, R7=M6).
  const orderRot = getRotationOrderFromRepos(OUR_TO_HOST[fig1] || fig1);
  const hR1 = orderRot[0], hR7 = orderRot[6];
  const figR1 = theme[hR1], figR7 = theme[hR7];

  const tier1 = tierOf(fig1, 1), tier7 = tierOf(fig7, 7);
  const tierR1 = tierOf(figR1, hR1), tierR7 = tierOf(figR7, hR7);

  const s1 = TIER_SCORE[tier1], s7 = TIER_SCORE[tier7];
  const sR1 = TIER_SCORE[tierR1], sR7 = TIER_SCORE[tierR7];

  const baseWinner = s1 > s7 ? 'M1' : (s7 > s1 ? 'M7' : 'égalité');
  const facteurPlanetaireR = comparerForcePlanetaireR1R7(theme, hR1, hR7);
  const scorePlanR1 = sR1 + facteurPlanetaireR.r1.facteur;
  const scorePlanR7 = sR7 + facteurPlanetaireR.r7.facteur;
  const resWinner = scorePlanR1 > scorePlanR7 ? 'R1' : (scorePlanR7 > scorePlanR1 ? 'R7' : 'égalité');

  const el = document.getElementById('verdict-m1m7');
  const r1Note = hR1===1 ? ' <span class="tierline" style="color:#4F7CF7;">(confondue avec M1 — rotation triviale)</span>' : ` <span class="tierline" style="color:#4F7CF7;">(anneau en M${hR1} — rotation depuis ${fig1})</span>`;
  const r7Note = hR7===7 ? ' <span class="tierline" style="color:#E08A3C;">(confondue avec M7 — rotation triviale)</span>' : ` <span class="tierline" style="color:#E08A3C;">(anneau en M${hR7} — rotation depuis ${fig1})</span>`;
  // CORRIGÉ (20/08/26, demande Ellemine_D "duplication du verdict dans
  // l'UI") : ce widget calculait et affichait SON PROPRE "Vainqueur
  // R1/R7" via un tier brut (TIER_SCORE) + facteur planétaire — un
  // mécanisme totalement différent de comparerBouclesAntagonistesR1R7,
  // qui pilote le vrai panneau "VERDICT DU MATCH". Les deux pouvaient
  // afficher des vainqueurs contradictoires à l'écran. Ce widget garde
  // son rôle utile (repérage M1/M7/R1/R7 + surlignage de la matrice au
  // clic) mais n'affiche plus de verdict concurrent — seulement les
  // repères de figures/tiers/planète, à titre de lecture, pas de verdict.
  el.innerHTML =
    `<div class="side m1">` +
      `<span class="label">M1</span>` +
      `<span class="fig net-click" data-house="1" data-fig="${fig1}">${fig1}</span>` +
      `<span class="tierline">${TIER_LABEL[tier1]}</span>` +
      `<span class="res net-click" data-house="${hR1}" data-fig="${figR1}">R1 = ${figR1} <span class="tierline">(${TIER_LABEL[tierR1]})</span>${r1Note}</span>` +
      `<span class="tierline" style="color:#c4b5fd;">🪐 ${facteurPlanetaireR.r1.planete||'—'} : force ${facteurPlanetaireR.r1.force}/100, facteur ${(facteurPlanetaireR.r1.facteur>=0?'+':'')+facteurPlanetaireR.r1.facteur}</span>` +
    `</div>` +
    `<div class="verdict-mid"><span class="vs">vs</span><span class="winner-line" style="color:#94a3b8;font-size:11px;">Voir le verdict complet dans le panneau "🏆 VERDICT DU MATCH" (protocole R1/R7)</span></div>` +
    `<div class="side m7">` +
      `<span class="label">M7</span>` +
      `<span class="fig net-click" data-house="7" data-fig="${fig7}">${fig7}</span>` +
      `<span class="tierline">${TIER_LABEL[tier7]}</span>` +
      `<span class="res net-click" data-house="${hR7}" data-fig="${figR7}">R7 = ${figR7} <span class="tierline">(${TIER_LABEL[tierR7]})</span>${r7Note}</span>` +
      `<span class="tierline" style="color:#c4b5fd;">🪐 ${facteurPlanetaireR.r7.planete||'—'} : force ${facteurPlanetaireR.r7.force}/100, facteur ${(facteurPlanetaireR.r7.facteur>=0?'+':'')+facteurPlanetaireR.r7.facteur}</span>` +
    `</div>`;

  document.querySelectorAll('td.cell.net-m1').forEach(td=>td.classList.remove('net-m1'));
  document.querySelectorAll('td.cell.net-m7').forEach(td=>td.classList.remove('net-m7'));
  document.querySelectorAll('td.cell.net-m1-spin').forEach(td=>td.classList.remove('net-m1-spin'));
  document.querySelectorAll('td.cell.net-m7-spin').forEach(td=>td.classList.remove('net-m7-spin'));
  const tdM1 = document.querySelector(`td.cell[data-fig="${fig1}"][data-house="1"]`);
  if(tdM1) tdM1.classList.add('net-m1');
  if(hR1 !== 1){
    const tdR1 = document.querySelector(`td.cell[data-fig="${figR1}"][data-house="${hR1}"]`);
    if(tdR1) tdR1.classList.add('net-m1-spin');
  }
  const tdM7 = document.querySelector(`td.cell[data-fig="${fig7}"][data-house="7"]`);
  if(tdM7) tdM7.classList.add('net-m7');
  if(hR7 !== 7){
    const tdR7 = document.querySelector(`td.cell[data-fig="${figR7}"][data-house="${hR7}"]`);
    if(tdR7) tdR7.classList.add('net-m7-spin');
  }

  // Réseau suivi pour le clic matrice (selectMatrixCell) : base M1/M7 + figure de rotation R1/R7
  lastFig1 = fig1; lastR1 = figR1;
  lastFig7 = fig7; lastR7 = figR7;
}

document.getElementById('verdict-m1m7').addEventListener('click', e=>{
  const target = e.target.closest('.net-click');
  if(!target) return;
  const td = document.querySelector(`td.cell[data-fig="${target.dataset.fig}"][data-house="${target.dataset.house}"]`);
  if(td) selectMatrixCell(td, true);
});

let lastTheme = null;
let lastFig1 = null, lastR1 = null, lastFig7 = null, lastR7 = null;

function clearThemeHighlights(){
  document.querySelectorAll('td.cell.theme-active').forEach(el=>el.classList.remove('theme-active'));
  clearHighlights();
}

const ROMAN_12 = {1:'I',2:'II',3:'III',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII'};
// En cadre tourné, R1 et R7 peuvent tomber en M13-M16 (le carré ne les
// dessine pas, mais la lecture les traverse) : ROMAN_12 y rendait
// undefined. Ce libellé couvre les seize.
function labelMaisonV7(h) {
  return ROMAN_12[h] || ({ 13: 'XIII', 14: 'XIV', 15: 'XV', 16: 'XVI' })[h] || ('M' + h);
}
const ROMAN_16 = {13:'XIII',14:'XIV',15:'XV',16:'XVI'};
const SYNTH_NOM_16 = {13:'Témoin de droite',14:'Témoin de gauche',15:'Le Juge',16:'La Réconciliation'};

// CARRÉ GÉOMANTIQUE CLASSIQUE v2 (03/08/26, construction géométrique réelle
// demandée par Ellemine_D). Coordonnées dans un viewBox 400x400 :
//   Carré extérieur : A(0,0) B(400,0) C(400,400) D(0,400)
//   Carré central tourné 45° (pointes = milieux des côtés du carré
//     extérieur) : T(200,0)=X  R(400,200)=VII  Bo(200,400)=IV  L(0,200)=I
//   Carré intérieur (vide, moitié de la taille, ses coins reposent
//     exactement sur les côtés du carré central) :
//     p1(100,100) p2(300,100) p3(300,300) p4(100,300)
// Chaque maison angulaire (I,IV,VII,X) = le triangle formé par une pointe
// du carré central et les 2 coins adjacents du carré intérieur. Chaque
// gros triangle de coin du carré extérieur (ex: A-T-L) est scindé en 2
// maisons par le segment reliant le coin extérieur au coin intérieur le
// plus proche (ex: A-p1), donnant les 8 maisons succédentes/cadentes.
const CARRE_GEO_PTS = {
  1:  [[0,200],[100,300],[100,100]],   // I   (pointe gauche)
  2:  [[0,400],[100,300],[0,200]],     // II
  3:  [[0,400],[200,400],[100,300]],   // III (coin bas-gauche)
  4:  [[200,400],[300,300],[100,300]], // IV  (pointe bas)
  5:  [[400,400],[300,300],[200,400]], // V   (coin bas-droit)
  6:  [[400,400],[400,200],[300,300]], // VI
  7:  [[400,200],[300,100],[300,300]], // VII (pointe droite)
  8:  [[400,0],[300,100],[400,200]],   // VIII
  9:  [[400,0],[200,0],[300,100]],     // IX  (coin haut-droit)
  10: [[200,0],[100,100],[300,100]],   // X   (pointe haut)
  11: [[0,0],[200,0],[100,100]],       // XI  (coin haut-gauche)
  12: [[0,0],[100,100],[0,200]]        // XII
};
// ─── MAISONS À PLAFOND BAS (03/09/26, sa demande : « vérifiez bien si
// les figures sont centrées dans les maisons ») ───
// Calculé géométriquement, pas à l'œil : la hauteur disponible SOUS le
// centroïde (là où le nom de la figure puis ses points en losange sont
// posés) n'est pas la même partout. Sur les 12 triangles, elle vaut
// 66,7px pour 9 d'entre eux — mais seulement 33,3px pour III, V et X.
// Avec le pas fixe de 8px x 4 rangs (32px) utilisé jusqu'ici, les points
// débordaient hors du triangle sur ces trois maisons-là. Elles reçoivent
// un pas et une police resserrés (cf. l'appel dans renderCarreGeomantique).
const MAISONS_CARRE_PLAFOND_BAS = {3:1, 5:1, 10:1};

// Petits décalages du centroïde vers le bord extérieur pour que le texte
// respire mieux dans les triangles étroits (purement cosmétique).
function centroid(pts){
  const cx = (pts[0][0]+pts[1][0]+pts[2][0])/3;
  const cy = (pts[0][1]+pts[1][1]+pts[2][1])/3;
  return [cx, cy];
}

// VERDICT DU CARRÉ GÉOMANTIQUE (03/08/26, 📚 étude, demande Ellemine_D) —
// utilise le découpage spatial déjà établi (zone M1 = moitié gauche, zone
// M7 = moitié droite, X et IV neutres car exactement sur l'axe central) et
// la dignité accidentelle déjà calculée par maison (catégorie angulaire/
// succédente/cadente + régence naturelle). Somme les dignités des 5
// maisons de chaque camp et compare. AUCUN poids sur verdictFinal tant
// que non contre-testé sur l'archive — c'est un second avis indépendant,
// pas un remplacement du moteur M1/M7 principal.
// Ce bloc travaille en noms d'affichage ("Carcer") ; la dignité est
// indexée par identifiant canonique ('carcer'). Traduction avant appel —
// garde-fou de la loi T. Sert à la dignité écrite dans chaque maison du
// dessin et au panneau de détail au clic.
// ⚠️ Elle avait été emportée le 03/09/26 avec l'ancien bloc des zones :
// renderCarreGeomantique levait alors un ReferenceError à chaque rendu.
// Trouvé tout de suite parce que le catch du pont geomtx PARLE — c'est
// exactement ce pour quoi il a cessé d'être muet.
function digniteAccidentelleCarre(h, fig, theme){
  var code = OUR_TO_HOST[fig] || fig;
  var hostTheme = theme ? toHostTheme(theme) : null;
  return calculerDigniteAccidentelle(h, code, hostTheme);
}

// ═══ LES DEUX ZONES, NOTÉES AUX TRAJECTOIRES FORTES (03/09/26) ═══
// ☠️ CE QUI A ÉTÉ JETÉ ET POURQUOI. Jusqu'ici les zones étaient les deux
// moitiés du DESSIN (gauche I·II·III·XI·XII, droite V·VI·VII·VIII·IX),
// notées à la dignité accidentelle. Même réparé (loi T), ce panneau
// répondait « carré équilibré » presque toujours : les deux moitiés
// portent le même jeu de catégories, donc l'écart ne tenait qu'au bruit
// de la régence — −0,25 sur son thème du 03/09, pour des scores de +20,75
// et +21. Il l'a vu et a donné la règle : « pour le verdict c'est la zone
// entre m1 et m7 qui a plus de trajectoires fortes qui remporte ».
// ➜ Une ZONE, c'est désormais LES CINQ TRAJECTOIRES DE SON PÔLE. Le
// découpage spatial ne sert plus qu'au dessin. Tout le calcul est dans
// zonesTrajectoiresV7 (bloc canonique) — une seule implémentation,
// partagée avec le moteur pilote, qui ne peut donc pas en diverger.
const ZONE_M1_MAISONS = [1,2,3,11,12];   // conservées pour le DESSIN seul
const ZONE_M7_MAISONS = [5,6,7,8,9];
const ZONE_NEUTRE_MAISONS = [4,10];

function renderVerdictCarreGeomantique(theme){
  const el = document.getElementById('carre-geo-verdict');
  if(!el) return;
  let canon = theme;
  try { canon = toHostTheme(theme); } catch(e) { canon = theme; }
  let z = null;
  try { z = zonesTrajectoiresV7(canon); } catch(e) { z = { erreur: String(e && e.message || e) }; }
  if(!z){ el.innerHTML=''; return; }
  if(z.erreur){
    el.innerHTML='<div class="cgv-card" style="background:#f8717122; border:1px solid #f87171;">⚠️ '+z.erreur+'</div>';
    return;
  }
  const rot = (z.mode === 'rotation');
  const n1 = rot ? 'R1' : 'M1', n7 = rot ? 'R7' : 'M7';
  const coul = z.camp==='R1' ? '#60a5fa' : (z.camp==='R7' ? '#fb923c' : '#94a3b8');
  const titre = z.camp==='R1' ? ('🔵 La zone '+n1+' remporte')
              : z.camp==='R7' ? ('🟠 La zone '+n7+' remporte')
              : '⚖️ Les deux zones sont identiques';
  // ⚠️ EN ROTATION, LES TRAJECTOIRES SORTENT DU CARRÉ. L'ordre de
  // rotation tourne sur SEIZE maisons (getRotationOrderFromRepos rend une
  // permutation de 1..16), donc R1..R12 ne sont pas les douze maisons
  // dessinées : ils tombent dans M13-M16 une fois sur deux. Mesuré sur
  // 600 thèmes : 3811 trajectoires sur 6000 (63,5 %) touchent une maison
  // hors du carré en rotation, contre 0 sur 6000 en fixe — et 95,8 % des
  // thèmes sont concernés. Les maisons concernées sont signalées.
  const horsCarre = z.zone1.concat(z.zone7).filter(function(x){
    return x.maisons.some(function(h){ return h > 12; });
  }).length;
  function liste(zone){
    return zone.map(function(x){
      const col = x.forte ? '#4ade80' : (x.force>0 ? '#fcd34d' : '#f87171');
      const ou = x.ou.length ? x.ou.map(function(h){return labelMaisonV7(h);}).join('·') : '—';
      const dehors = x.maisons.some(function(h){ return h > 12; });
      return '<div class="rft-li"><span class="rft-base">'
        + x.maisons.map(function(h){
            return h > 12 ? '<span style="color:#fb923c;">'+labelMaisonV7(h)+'</span>' : labelMaisonV7(h);
          }).join('·') + (dehors ? ' <span style="color:#fb923c;" title="sort des 12 maisons dessinées">⚠</span>' : '') + '</span>'
        + '<span style="color:'+col+';">' + (FL[x.somme]||x.somme)
        + ' &nbsp;force ' + x.force + (x.forte ? ' <b>FORTE</b>' : '') + ' <span style="color:#64748b;">('+ou+')</span></span></div>';
    }).join('');
  }
  let html = '<div class="cgv-card" style="background:'+coul+'22; border:1px solid '+coul+';">'+titre
    + '<div style="font-size:12px; font-weight:400; margin-top:4px; color:#cbd5e1;">'
    + 'Trajectoires fortes : '+n1+' '+z.nbFortes1+'/5 &nbsp;vs&nbsp; '+n7+' '+z.nbFortes7+'/5'
    + ' &nbsp;·&nbsp; force totale '+z.total1+' vs '+z.total7
    + '<br>'+z.motif+'</div></div>';
  html += '<div class="rft-grid">'
    + '<div class="rft-col"><b style="color:#93c5fd;">Zone '+n1+' — sommet '+labelMaisonV7(z.apex1)+'</b>'+liste(z.zone1)+'</div>'
    + '<div class="rft-col"><b style="color:#fcd34d;">Zone '+n7+' — sommet '+labelMaisonV7(z.apex7)+'</b>'+liste(z.zone7)+'</div>'
    + '</div>';
  if(horsCarre){
    html += '<div class="cgv-card" style="margin-top:10px; background:#fb923c22; border:1px solid #fb923c; font-size:12px; font-weight:400;">'
      + '⚠️ <b>'+horsCarre+' des 10 trajectoires sortent du carré dessiné.</b> '
      + 'L\'ordre de rotation tourne sur SEIZE maisons, donc R1…R12 ne sont pas les douze maisons du dessin : ils tombent dans M13-M16, '
      + 'que le carré ne trace pas et dont la doctrine des catégories ne dit rien. Les maisons concernées sont en orange ci-dessus.<br>'
      + 'Mesuré sur 600 thèmes : en rotation 63,5 % des trajectoires sortent du carré (95,8 % des thèmes touchés) ; en mode fixe, 0 %.'
      + '</div>';
  }
  html += '<div class="hint" style="margin-top:8px; text-align:center;">'
    + 'Sa règle (03/09/26) — <b>la zone qui a le plus de trajectoires fortes remporte</b> ; à égalité, la force totale départage.<br>'
    + '<b>Force d\'une trajectoire</b> : 0 si sa somme est absente du thème ; sinon la somme, sur chaque maison où elle figure, du poids de cette maison — angulaire 3, succédente 2, cadente 1. Position et influence dans un seul nombre. <b>Forte</b> = force ≥ 3.<br>'
    + '⚠️ <b>MESURÉ, ET CE N\'EST PAS SIGNIFICATIF.</b> Sur les 53 cas de l\'archive qui portent un camp (base 43 %) : cadre tourné 17/53 (32 %), maisons fixes 25/53 (47 %). Meilleur p = 0,44. Les poids et le seuil viennent de sa doctrine, pas du score — « force totale en maisons fixes » ferait 27/53, mais choisir la variante qui gagne sur les cas qui servent à la mesurer, c\'est se fabriquer un résultat.</div>';
  el.innerHTML = html;
}

// ═══ LES TROIS AXES ET LEUR COULEUR (01/09/26, ses couleurs) ═══
// Cardinal vert, succédent jaune, cadent rouge.
// 🎨 TEINTES MESURÉES, PAS CHOISIES. Contrôleur de daltonisme sur le fond
// parchemin du carré, mode « toutes les paires » — les trois sont visibles
// ensemble, pas côte à côte :
//     vert #008300 · jaune #c98500 · rouge #e34948
//     vision normale ΔE 15,1 (plancher 15) · contraste ≥ 3:1 · TOUT PASSE
// ⚠️ Le rouge et le jaune tombent à ΔE 6,2 en deutéranopie, dans la bande
// 6-8 : légal SEULEMENT avec encodage secondaire. Il est là — chaque
// maison porte son chiffre romain, et de I à XII on lit son axe sans la
// couleur ; la légende nomme les maisons de chaque axe. La couleur
// accélère la lecture, elle ne la porte pas seule.
// ☠️ Ses couleurs littérales (#22c55e, #eab308, #ef4444) ont été testées
// et REFUSÉES : jaune contre rouge à ΔE 13,0 en vision normale, sous le
// plancher de 15 — deux lecteurs sur deux les auraient confondues. Les
// trois retenues sont les plus proches qui passent.
var AXES_CARRE_V7 = [
  { nom: 'Cardinal', maisons: [1, 4, 7, 10], couleur: '#008300' },
  { nom: 'Succédent', maisons: [2, 5, 8, 11], couleur: '#c98500' },
  { nom: 'Cadent', maisons: [3, 6, 9, 12], couleur: '#e34948' }
];
function COULEUR_AXE_CARRE_V7(m) {
  var a = AXES_CARRE_V7[(m - 1) % 3];
  return a ? a.couleur : '#8E7A4A';
}

// ═══ LA FIGURE EN POINTS (03/09/26, demande Ellemine_D : reproduire le
// style d'un thème astrologique classique envoyé en exemple, où chaque
// position porte son symbole en petits points plutôt qu'un nom écrit) ═══
// MAP_GEO stocke déjà chaque figure comme 4 valeurs 1 (point simple) ou 2
// (point double) — c'est la notation géomantique traditionnelle elle-même,
// rien à recalculer : un rang par valeur, un ou deux losanges par rang.
function dessinerPointsFigureV7(fig, cx, yTop, coul, pas, tailleFont){
  // Le carré géo travaille avec les noms d'affichage du thème ("Fortuna
  // minor", "Aquisitio"...), MAP_GEO avec les clés internes minuscules
  // ("fortuna_minor", "acquisitio"...) — même pont que loopOf, cf.
  // NORM_FIG_LOOP juste au-dessus.
  var m = MAP_GEO[NORM_FIG_LOOP[fig] || fig];
  if (!m) return '';
  // ⚠️ pas/tailleFont sont réglables : les 12 triangles du carré n'ont
  // PAS tous la même hauteur disponible sous leur centroïde (03/09/26,
  // sa demande : « vérifiez bien si les figures sont centrées dans les
  // maisons ») — un pas fixe de 8px déborde hors du triangle sur les
  // maisons III, V et X, mesuré géométriquement (cf. l'appel dans
  // renderCarreGeomantique). Valeurs par défaut = comportement d'origine.
  pas = pas || 8;
  var out = '', fs = tailleFont || 9, decal = Math.round(fs * 0.55);
  for (var i = 0; i < 4; i++) {
    var y = yTop + i * pas;
    if (m[i] === 1) {
      out += '<text x="'+cx+'" y="'+y+'" font-size="'+fs+'" style="fill:'+coul+'; text-anchor:middle; pointer-events:none;">◆</text>';
    } else {
      out += '<text x="'+(cx-decal)+'" y="'+y+'" font-size="'+fs+'" style="fill:'+coul+'; text-anchor:middle; pointer-events:none;">◆</text>'
           + '<text x="'+(cx+decal)+'" y="'+y+'" font-size="'+fs+'" style="fill:'+coul+'; text-anchor:middle; pointer-events:none;">◆</text>';
    }
  }
  return out;
}

function renderCarreGeomantique(theme){
  const svg = document.getElementById('carre-geo-svg');
  if(!svg) return;
  let html = '';
  const mono = (typeof STYLE_CARRE_V7 !== 'undefined' && STYLE_CARRE_V7 === 'mono');
  // ─── FOND NOIR EN MONOCHROME (03/09/26, sa demande explicite : « la
  // couleur de fond doit être noir ou bleu foncé ») — posé en style
  // INLINE sur l'élément (pas dans la feuille de style globale) parce que
  // le fond parchemin (#1c1206) reste la valeur par défaut du mode
  // couleur, inchangée. On la retire (chaîne vide) en revenant au mode
  // couleur pour laisser le CSS reprendre la main.
  svg.style.background = mono ? '#04060d' : '';
  svg.style.borderColor = mono ? '#334155' : '';

  // 2) ZONES M1/M7 (03/08/26, demande Ellemine_D) — I à gauche = zone M1,
  // VII à droite = zone M7, X et IV (exactement sur l'axe central x=200)
  // restent neutres. Fond léger, purement visuel, sous les triangles.
  // ─── RETIRÉES EN STYLE MONOCHROME (03/09/26, sa demande) — le thème
  // astrologique de référence n'a pas de fond teinté par zone.
  if (!mono) {
    html += '<rect x="0" y="0" width="200" height="400" fill="#3b82f6" fill-opacity="0.07"></rect>';
    html += '<rect x="200" y="0" width="200" height="400" fill="#f59e0b" fill-opacity="0.07"></rect>';
    html += '<text x="60" y="392" font-size="9" fill="#93c5fd" font-style="italic">zone M1</text>';
    html += '<text x="340" y="392" font-size="9" fill="#fcd34d" font-style="italic">zone M7</text>';
  }

  for(let m=1; m<=12; m++){
    const pts = CARRE_GEO_PTS[m];
    const fig = theme[m];
    const elem = FIGURE_ELEMENT[fig];
    // ─── LA COULEUR DIT L'AXE, PLUS L'ÉLÉMENT (01/09/26, sa demande) ───
    // ☠️ CE QUE ÇA REMPLACE, ET IL FAUT LE SAVOIR : la maison était
    // teintée par l'ÉLÉMENT de la figure qui l'occupe. Cette information
    // SORT du carré. Elle reste lisible au clic sur la maison et dans la
    // matrice figures × maisons juste au-dessus — mais le carré ne la
    // montre plus. C'est le prix de la lecture par axe.
    const col = COULEUR_AXE_CARRE_V7(m);
    const ptsStr = pts.map(p=>p.join(',')).join(' ');
    const [cx, cy] = centroid(pts);
    const isGrand = (m===1||m===4||m===7||m===10); // maisons angulaires (pointes)
    const fsNum = isGrand ? 11 : 9;
    const fsFig = isGrand ? 11 : 9;

    // 1) HALO ANGULAIRE — bordure dorée épaisse + surbrillance pour les
    // 4 maisons angulaires, pour que la force saute aux yeux sans lire
    // le doctrinal.
    // ─── EN MONOCHROME, UN SEUL TRAIT BLANC, MÊME ÉPAISSEUR PARTOUT ───
    // (03/09/26, sa demande) — comme le thème de référence, où les douze
    // secteurs sont tracés du même trait, sans distinction de couleur.
    const strokeCol = mono ? '#e8dcc0' : (isGrand ? '#facc15' : 'var(--gold,#C7A143)');
    const strokeW = mono ? 1.2 : (isGrand ? 3.5 : 1.5);
    const glow = (!mono && isGrand) ? ' filter="drop-shadow(0 0 4px rgba(250,204,21,.65))"' : '';
    const fillAttr = mono ? 'none' : col;
    const fillOpacity = mono ? '1' : '0.28';

    // ⚠️ fill/stroke posés DANS style="", pas en attributs nus : la règle
    // globale "#carre-geo-svg polygon{stroke:...}" du CSS gagnerait sinon
    // sur l'attribut de présentation, quelle que soit la valeur calculée
    // ici (cascade CSS : attribut de présentation < règle de feuille de
    // style, même par sélecteur de type).
    html += '<polygon points="'+ptsStr+'" style="cursor:pointer; fill:'+fillAttr+'; fill-opacity:'+fillOpacity+'; stroke:'+strokeCol+'; stroke-width:'+strokeW+'px;"'+glow+' onclick="carreGeoClickHouse('+m+')" data-house="'+m+'"></polygon>';
    // ═══ LE NUMÉRO DE ROTATION, À CÔTÉ DU NUMÉRO DE MAISON (03/09/26,
    // sa demande : « vérifie bien si les figures changent en mode
    // rotation dans les maisons ») ═══
    // ELLES NE CHANGENT PAS, et c'est maintenant visible sans me croire
    // sur parole : la maison garde son chiffre romain ET sa figure, quel
    // que soit le mode. En rotation, on ajoute seulement son numéro R —
    // « III · R9 » se lit « la troisième maison, qui est la neuvième à
    // partir du siège ». La figure reste où elle est ; c'est la
    // NUMÉROTATION qui tourne, jamais le contenu.
    var rNum = '';
    if (typeof MODE_CARRE_V7 !== 'undefined' && MODE_CARRE_V7 === 'rotation') {
      try {
        var ordreDessin = getRotationOrderFromRepos(toHostTheme(theme)[1]);
        var kR = ordreDessin.indexOf(m);
        if (kR >= 0) rNum = ' · R' + (kR + 1);
      } catch (e) { rNum = ''; }
    }
    // ⚠️ La couleur va DANS style="" : la règle CSS ".cg-num{fill:#c4b5fd}"
    // gagnerait sur un attribut fill="" nu, même quand mono le calcule.
    const numColStyle = mono ? 'fill:#e8dcc0; ' : '';
    html += '<text class="cg-num" x="'+cx+'" y="'+(cy-7)+'" font-size="'+fsNum+'" style="'+numColStyle+'pointer-events:none;">'+ROMAN_12[m]+rNum+(isGrand?' ★':'')+'</text>';
    html += '<text class="cg-fig" x="'+cx+'" y="'+(cy+6)+'" font-size="'+fsFig+'" style="'+numColStyle+'pointer-events:none;">'+(fig||'—')+'</text>';

    // 4) BADGE DE DIGNITÉ ACCIDENTELLE (03/08/26, 📚 étude non validée) —
    // petit score coloré (vert=positif, rouge=négatif) sous la figure.
    // ─── L'ÉLÉMENT REVIENT DANS LA MAISON (01/09/26, sa demande) ───
    // « Remets l'élément de la figure dans la maison. » Il était porté par
    // le FOND de la maison, que la couleur d'axe a pris. Il revient sous
    // la figure, en toutes lettres, avec sa pastille.
    // ⚠️ POURQUOI UN HALO SOMBRE ET PAS UNE PASTILLE COLORÉE SEULE : les
    // couleurs d'élément entrent en collision avec celles des axes — feu
    // est rouge #C0392B sur une maison cadente rouge, air est jaune
    // #E8C547 sur une maison succédente jaune. Invisible. Le halo sombre
    // (paint-order:stroke) détache le texte de n'importe quel fond, sans
    // avoir à mesurer une boîte.
    // ✔ ET LE NOM EST ÉCRIT À CÔTÉ DE LA PASTILLE : l'identité de
    // l'élément ne repose jamais sur la seule couleur — ce qui règle du
    // même coup le cas de « terre », qui est un gris.
    // 📏 Les quatre couleurs d'élément du fichier sont CONSERVÉES telles
    // quelles : passées au contrôleur sur fond sombre, elles tiennent les
    // deux contrôles qui décident si on les distingue — séparation
    // daltonienne ΔE 12,9 (cible ≥ 8) et vision normale ΔE 15,8
    // (plancher 15). Elles ne sortent de la bande de clarté que parce que
    // ce sont les teintes historiques du projet, pas une rampe neuve.
    if(fig && mono){
      // ─── EN MONOCHROME, LA FIGURE SE LIT EN POINTS, PAS EN BADGE
      // COLORÉ (03/09/26, sa demande) — élément et dignité accidentelle
      // restent lisibles au clic sur la maison, comme en mode couleur
      // l'élément était devenu lisible là plutôt que sur le fond.
      // III, V et X ont un plafond bas (cf. MAISONS_CARRE_PLAFOND_BAS) :
      // pas et police resserrés pour que les 4 rangs restent DANS le
      // triangle au lieu de déborder par-dessus le trait du carré.
      if (MAISONS_CARRE_PLAFOND_BAS[m]) {
        html += dessinerPointsFigureV7(fig, cx, cy+13, '#e8dcc0', 5.5, 7);
      } else {
        html += dessinerPointsFigureV7(fig, cx, cy+16, '#e8dcc0');
      }
    } else if(fig){
      const elemCol = ELEMENT_COLORS[elem] || '#94a3b8';
      let daTxt = '', daCol = '#94a3b8';
      if(typeof calculerDigniteAccidentelle === 'function'){
        const da = digniteAccidentelleCarre(m, fig, theme);
        if(typeof da.total === 'number'){
          daCol = da.total > 0 ? '#4ade80' : (da.total < 0 ? '#f87171' : '#94a3b8');
          const v = Math.round(da.total*100)/100;
          daTxt = (v>=0?'+':'')+v;
        } else { daCol = '#f87171'; daTxt = '⚠️'; }
      }
      html += '<text x="'+cx+'" y="'+(cy+17)+'" style="font-size:'+(isGrand?8:7)+'px; '
        + 'paint-order:stroke; stroke:#0b1220; stroke-width:2.6px; pointer-events:none;">'
        + '<tspan style="fill:'+elemCol+';">●</tspan>'
        + '<tspan style="fill:#e2e8f0;"> '+elem+'</tspan>'
        + (daTxt ? '<tspan style="fill:'+daCol+';"> '+daTxt+'</tspan>' : '')
        + '</text>';
    }
  }

  // Carré intérieur vide (100,100)-(300,300) subdivisé en 4 pour M13-16
  // (03/08/26 : "ignore les [M13-16] on y reviendra" — affichées ici sans
  // prétendre à une position classique, juste pour occuper l'espace vide).
  const quads = {13:[100,100], 14:[200,100], 15:[100,200], 16:[200,200]};
  for(const m in quads){
    const [x,y] = quads[m];
    const fig = theme[m];
    const elem = FIGURE_ELEMENT[fig];
    const col = mono ? 'none' : (ELEMENT_COLORS[elem] || '#8E7A4A');
    // ⚠️ Même remarque que pour les polygones : couleurs dans style="",
    // sinon les règles CSS ("rect.cg-inner-cell{...}", ".cg-num{...}")
    // gagnent toujours sur un attribut de présentation nu.
    html += '<rect class="cg-inner-cell" x="'+x+'" y="'+y+'" width="100" height="100" style="cursor:pointer; fill:'+col+'; fill-opacity:'+(mono?1:0.14)+'; stroke:'+(mono?'#e8dcc0':'var(--gold,#C7A143)')+'; stroke-width:1px;" onclick="carreGeoClickHouse('+m+')"></rect>';
    html += '<text class="cg-num" x="'+(x+50)+'" y="'+(y+38)+'" font-size="8" style="'+(mono?'fill:#e8dcc0; ':'')+'pointer-events:none;">'+ROMAN_16[m]+' (M'+m+')</text>';
    if (mono) {
      html += dessinerPointsFigureV7(fig, x+50, y+62, '#e8dcc0');
    } else {
      html += '<text class="cg-fig" x="'+(x+50)+'" y="'+(y+52)+'" font-size="9" style="pointer-events:none;">'+(fig||'—')+'</text>';
      html += '<text x="'+(x+50)+'" y="'+(y+64)+'" font-size="6" fill="#94a3b8" style="pointer-events:none;">'+SYNTH_NOM_16[m]+'</text>';
    }
  }
  // ═══ LES AXES CLOS ET LES TRAJECTOIRES (01/09/26, demande Ellemine_D) ═══
  // « Clore l'axe de couleur différente, et les trajectoires possibles par
  // des traits de couleurs différentes des axes. »
  //
  // 🎨 LE CHOIX DES COULEURS N'EST PAS UN GOÛT, IL EST MESURÉ.
  // Palette validée par le contrôleur de daltonisme sur le fond sombre du
  // panneau (#0f172a), en mode « toutes les paires » — parce qu'ici les
  // trois axes sont visibles EN MÊME TEMPS, pas côte à côte :
  //     bleu #3987e5 · orange #d95926 · vert d'eau #199e70
  //     pire paire deutan ΔE 9,4 (cible ≥ 8) · vision normale ΔE 20,9
  //     (plancher 15) · contraste ≥ 3:1 pour les trois. TOUT PASSE.
  // ⚠️ ET UNE QUATRIÈME TEINTE NE PASSE PAS. Testé : ajouter le jaune
  // #c98500 fait tomber la pire paire à ΔE 10,6 en vision normale — sous
  // le plancher de 15, donc deux lecteurs sur deux les confondraient.
  // Les trajectoires ne prennent donc PAS une quatrième couleur : elles
  // sont en blanc cassé, en TIRETS, et chacune porte son nom écrit à
  // côté. Elles restent parfaitement distinctes des axes — ce qu'il
  // demandait — sans casser la lisibilité des trois axes entre eux.
  // ─── LES TRAITS D'AXE SONT RETIRÉS (01/09/26, sa demande) ───
  // « Au lieu des traits permanents des axes, fais des couleurs dans les
  // maisons des axes. » Les trois quadrilatères fermés encombraient le
  // carré et masquaient les trajectoires, qui sont ce qu'on vient y lire.
  // Ce sont les MAISONS qui portent maintenant la couleur de leur axe —
  // voir COULEUR_AXE_CARRE_V7 et le commentaire dans la boucle.
  function centreMaisonV7(m) { return centroid(CARRE_GEO_PTS[m]); }
  // les trajectoires demandées
  var choix = 'aucune', une = '';
  try { peuplerTrajectoiresCarreV7(); } catch (e) { /* menu absent */ }
  try {
    var sel = document.getElementById('carreTrajSelect');
    if (sel) choix = sel.value;
    var selU = document.getElementById('carreTrajUne');
    if (selU) une = selU.value;
  } catch (e) { /* panneau absent : on ne trace que les axes */ }
  var aTracer = trajectoiresAffichéesV7(choix, une);
  aTracer.forEach(function (T) {
    var pts = T.maisons.map(centreMaisonV7);
    var d = pts.map(function (p) { return p[0] + ',' + p[1]; }).join(' ');
    var estIsolee = (trajIsoleeV7 === T.nom);
    // ⚠️ ZONE DE CLIC SÉPARÉE. Le trait visible fait 2 px : viser 2 px à la
    // souris est impossible en pratique, et le clic tombait dans le vide
    // (fill:none + pointer-events:stroke = seul le trait est cliquable).
    // Constaté en cliquant vraiment, pas en relisant le code. On pose donc
    // un polygone JUMEAU, transparent, épais de 16 px, qui porte le clic ;
    // le trait visible, lui, n'écoute plus rien.
    html += '<polygon points="' + d + '" data-traj="' + T.nom + '"'
      + ' onclick="isolerTrajectoireV7(\'' + T.nom + '\')"'
      + ' style="fill:none; stroke:transparent; stroke-width:16px; '
      + 'pointer-events:stroke; cursor:pointer;"></polygon>';
    html += '<polygon points="' + d + '"'
      + ' style="fill:none; stroke:#e2e8f0; stroke-width:' + (estIsolee ? 3.2 : 2) + 'px; '
      + 'stroke-dasharray:7 4; stroke-linejoin:round; opacity:' + (estIsolee ? 1 : 0.9) + '; '
      + 'pointer-events:none;"></polygon>';
    // ⚠️ L'ÉTIQUETTE N'EST PAS AU CENTROÏDE. Les quatre trigones ont
    // EXACTEMENT le même centre — le milieu du carré — et leurs quatre
    // noms se superposaient les uns sur les autres et sur les cases
    // M13-M16. Vu à la capture d'écran. On la pose donc aux deux tiers
    // du chemin entre le centre et le premier sommet : les étiquettes
    // s'écartent, et chacune reste sur son propre triangle.
    // ⚠️ OÙ POSER L'ÉTIQUETTE — deux pièges vus à la capture d'écran.
    // 1) au centroïde : les quatre trigones ont le MÊME centre, leurs
    //    quatre noms se superposaient sur les cases M13-M16 ;
    // 2) vers le premier sommet : les sept trajectoires d'un pôle
    //    PARTAGENT ce sommet, les sept noms s'empilaient dessus.
    // On la pose donc au milieu du PLUS LONG CÔTÉ, tiré de 18 % vers le
    // centre. Ce côté diffère d'une trajectoire à l'autre dans les deux
    // familles, donc les étiquettes s'écartent d'elles-mêmes.
    var gx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, gy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
    var meilleur = 0, longMax = -1;
    for (var e = 0; e < 3; e++) {
      var p1 = pts[e], p2 = pts[(e + 1) % 3];
      var lg = (p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]);
      if (lg > longMax) { longMax = lg; meilleur = e; }
    }
    var q1 = pts[meilleur], q2 = pts[(meilleur + 1) % 3];
    var mx = (q1[0] + q2[0]) / 2, my = (q1[1] + q2[1]) / 2;
    var cx = mx + (gx - mx) * 0.18, cy = my + (gy - my) * 0.18;
    html += '<text x="' + cx + '" y="' + cy + '" style="font-size:10px; fill:#0b1220; '
      + 'stroke:#e2e8f0; stroke-width:3.5px; paint-order:stroke; font-weight:700; pointer-events:none;">'
      + T.nom + '</text>';
  });
  svg.innerHTML = html;
  renderSommeCampsEtJugeV7(theme);
  majLegendeCarreV7(AXES_CARRE_V7, aTracer);
  majLectureCarreV7(theme, aTracer);
}

// ⚠️ CE BLOC DE SCRIPT EST UNE IIFE : renderCarreGeomantique y est privée,
// et un onchange="..." écrit dans le HTML ne peut donc PAS l'appeler.
// C'est le piège dans lequel je suis tombé en écrivant les menus. On
// expose un seul point d'entrée, et les menus passent par lui.
window.redessinerCarreGeoV7 = function () {
  // ☠️ CE catch AVALAIT TOUT EN SILENCE. Une erreur dans la fenêtre de
  // lecture laissait le SVG à jour et le panneau figé sur son message
  // précédent, sans une ligne dans la console : le défaut était
  // invisible. Un catch muet sur un chemin d'affichage est un piège ; il
  // parle maintenant.
  try { renderCarreGeomantique(lastTheme || window.currentTheme); }
  catch (e) { if (window.console && console.error) console.error('carré géomantique :', e); }
};

// Les trajectoires traçables. Ce sont celles de la loi P : une maison par
// axe, aucune paire de maisons voisines — les 28 où sa règle « isocèle ou
// équilatéral » est exacte, restreintes ici aux familles utiles.
// Les cinq triangles dont un pôle est le SOMMET : le pôle, plus chacune
// des cinq paires symétriques par rapport au diamètre pôle ↔ pôle+6.
// Le sommet est à égale distance des deux autres : isocèle par
// construction, sans exception possible (loi R).
function trianglesApexV7(pole) {
  var out = [];
  for (var k = 1; k <= 5; k++) {
    var a = ((pole + k - 1) % 12) + 1;
    var b = ((pole - k - 1 + 12) % 12) + 1;
    out.push([pole, a, b].sort(function (x, y) { return x - y; }));
  }
  return out;
}
var TRAJ_CARRE_V7 = {
  trigones: [[1, 5, 9], [2, 6, 10], [3, 7, 11], [4, 8, 12]],
  // Les quatre triangles du carré cardinal — ses deux couples opposés.
  // Tous isocèles de forme (3,3,6), loi P.4.
  cardinales: [[1, 4, 7], [1, 7, 10], [4, 7, 10], [1, 4, 10]],
  // ─── LES CINQ D'UN PÔLE, PAR LA RÈGLE DU MIROIR (01/09/26) ───
  // Sa remarque : « M1 s'oppose à M7 ; M1 est lié 6-8, 5-9, 4-10, 3-11,
  // 2-12 ; M7 est lié par l'inverse. » Ces paires sont les REFLETS l'un
  // de l'autre à travers le diamètre M1-M7 : le triangle a donc son
  // SOMMET sur le pôle, et il est isocèle par construction.
  // ⚠️ MES ANCIENNES LISTES ÉTAIENT AUTRE CHOSE. Je donnais sept
  // triangles « de M1 » qui contenaient M1 sans que M1 en soit le
  // sommet — 1-3-5 est isocèle, mais son sommet est M3. Les siens sont
  // les cinq où M1 EST le sommet, et c'est ce qui fait la dualité.
  m1: trianglesApexV7(1),
  m7: trianglesApexV7(7)
};
// ─── L'ISOLEMENT AU CLIC (01/09/26, demande Ellemine_D) ───
// « Quand on clique sur une trajectoire les autres ne doivent pas
// s'afficher, pour avoir une meilleure vue. » Un second clic sur la même
// rend la famille. Changer de famille dans le menu remet tout à zéro.
var trajIsoleeV7 = null;
window.isolerTrajectoireV7 = function (nom) {
  trajIsoleeV7 = (trajIsoleeV7 === nom) ? null : nom;
  window.redessinerCarreGeoV7();
};
function trajectoiresCarreV7(choix, une) {
  function pack(a) { return { maisons: a, nom: a.join('-') }; }
  if (choix === 'trigones') return TRAJ_CARRE_V7.trigones.map(pack);
  if (choix === 'cardinales') return TRAJ_CARRE_V7.cardinales.map(pack);
  if (choix === 'm1') return TRAJ_CARRE_V7.m1.map(pack);
  if (choix === 'm7') return TRAJ_CARRE_V7.m7.map(pack);
  if (choix === 'une' && une) {
    var t = une.split('-').map(Number);
    if (t.length === 3 && t.every(function (x) { return x >= 1 && x <= 12; })) return [pack(t)];
  }
  return [];
}
// Enveloppe : applique l'isolement par-dessus le choix de famille.
function trajectoiresAffichéesV7(choix, une) {
  var toutes = trajectoiresCarreV7(choix, une);
  if (!trajIsoleeV7) return toutes;
  var seule = toutes.filter(function (T) { return T.nom === trajIsoleeV7; });
  // si l'isolée n'appartient plus à la famille choisie, l'isolement tombe
  if (!seule.length) { trajIsoleeV7 = null; return toutes; }
  return seule;
}
// ═══ LE MENU DES TRAJECTOIRES — REFAIT SUR SA RÈGLE DU MIROIR ═══
//
// ✔✔ SA RÈGLE ENGENDRE TOUS LES ISOCÈLES DU CARRÉ, ET RIEN D'AUTRE.
// « M1 est lié 6-8, 5-9, 4-10, 3-11, 2-12 ; M7 par l'inverse. »
// Ces cinq paires sont les reflets par le diamètre M1-M7. Appliquée aux
// douze pôles, la règle produit :
//     triangles engendrés .................... 52
//     isocèles + équilatéraux du carré ....... 52
//     identiques ? ........................... OUI
//     scalènes engendrés par erreur .......... ZÉRO
// 48 n'ont qu'un sommet, 4 en ont trois — et ces quatre sont exactement
// les équilatéraux. La règle du sommet EST la définition de l'isocèle
// sur douze points, et elle est complète.
//
// ☠️ MES DEUX FILTRES PRÉCÉDENTS ÉTAIENT DONC MAL POSÉS. « Une maison
// par axe, aucune voisine » donnait 28 triangles, « même axe » en
// ajoutait 12 : 40, en excluant 12 vrais isocèles et sans jamais dire
// où était le sommet. Le menu porte maintenant les 52, groupés par
// SOMMET, dans son ordre : M1, M7, M4, M10, puis les autres.
function peuplerTrajectoiresCarreV7() {
  var sel = document.getElementById('carreTrajUne');
  if (!sel || sel.options.length) return;
  var vus = {}, groupes = [];
  var ordre = [1, 7, 4, 10, 2, 3, 5, 6, 8, 9, 11, 12];
  ordre.forEach(function (pole) {
    var lignes = [];
    trianglesApexV7(pole).forEach(function (T) {
      var cle = T.join('-');
      if (vus[cle]) return;              // un équilatéral a trois sommets : on le range au premier
      vus[cle] = pole;
      var d = [T[1] - T[0], T[2] - T[1], 12 - (T[2] - T[0])].sort(function (x, y) { return x - y; });
      var nat = (d[0] === d[1] && d[1] === d[2]) ? 'équilatéral' : 'isocèle';
      var paire = T.filter(function (h) { return h !== pole; });
      lignes.push({ cle: cle, nat: nat, paire: paire.join('-') });
    });
    if (lignes.length) groupes.push({ pole: pole, lignes: lignes });
  });
  var OPPOSES = { '1-4-7': '1-7-10', '1-7-10': '1-4-7', '4-7-10': '1-4-10', '1-4-10': '4-7-10' };
  sel.innerHTML = groupes.map(function (G) {
    return '<optgroup label="— sommet M' + G.pole + ' —">'
      + G.lignes.map(function (o) {
          return '<option value="' + o.cle + '">' + o.cle + ' — ' + o.nat
            + ' · miroir ' + o.paire
            + (OPPOSES[o.cle] ? ' · s\'oppose à ' + OPPOSES[o.cle] : '') + '</option>';
        }).join('')
      + '</optgroup>';
  }).join('');
}

// 📐 L'ÉCHELLE DE LA BARRE D'INFLUENCE, mesurée sur 32 000 couples
// (figure, thème) — 2000 thèmes × 16 figures :
//     minimum 0 % · 1er quartile 3,1 % · MÉDIANE 9,4 %
//     3e quartile 12,5 % · 9e décile 18,8 % · maximum observé 53,1 %
// La barre va de 0 à 56 % et porte un repère à la médiane : sans lui,
// « 12 % » ne se lit pas ; avec, on voit que c'est au-dessus de l'ordinaire.
// ☠️ CES DEUX CONSTANTES ONT ÉTÉ EMPORTÉES une fois par une réécriture du
// menu juste au-dessus, et la fenêtre de lecture est restée MUETTE sans
// un mot dans la console — parce que redessinerCarreGeoV7 avalait
// l'erreur. Les deux défauts sont corrigés ensemble.
var INFLUENCE_MEDIANE_V7 = 9.4, INFLUENCE_MAX_V7 = 56;
function majLectureCarreV7(theme, traj) {
  var el = document.getElementById('carre-geo-lecture');
  if (!el) return;
  if (!traj || traj.length !== 1) {
    el.innerHTML = '<div style="font-size:11px; color:#94a3b8; text-align:center; padding:8px;">'
      + (traj && traj.length
          ? 'Clique une trajectoire pour l\'isoler et lire son verdict — les autres disparaîtront.'
          : 'Choisis une famille de trajectoires ci-dessus, puis clique celle que tu veux lire.')
      + '</div>';
    return;
  }
  var T = traj[0];
  // ⚠️ ON CALCULE SUR LE THÈME CANONIQUE, PAS SUR CELUI DU CARRÉ.
  // Le carré porte un thème aux clés d'affichage (voir le garde-fou dans
  // lectureTrajectoireV7). Les MAISONS sont les mêmes, les figures aussi,
  // mais seul window.currentTheme porte les identifiants que combine
  // comprend.
  var themeCalcul = (typeof window.themeCanoniqueV7 === 'function' && window.themeCanoniqueV7())
    ? window.themeCanoniqueV7() : theme;
  var L = null;
  try { L = lectureTrajectoireV7(themeCalcul, T.maisons); } catch (e) { L = null; }
  if (!L) { el.innerHTML = ''; return; }
  if (L.erreur) {
    el.innerHTML = '<div style="border:1px solid #d95926; border-radius:10px; padding:10px 13px; '
      + 'background:#0f172a; font-size:11px; color:#fecaca;">⚠️ ' + L.erreur + '</div>';
    return;
  }
  var nom = function (f) { return (typeof FL !== 'undefined' && FL[f]) ? FL[f] : f; };
  var nBase = L.positions.filter(function (P) { return P.source === 'base'; }).length;
  var nRes = L.positions.filter(function (P) { return P.source === 'résultante'; }).length;
  var inf = (nBase + 0.5 * nRes) / 16 * 100;
  var pctBarre = Math.min(100, inf / INFLUENCE_MAX_V7 * 100);
  var pctMed = INFLUENCE_MEDIANE_V7 / INFLUENCE_MAX_V7 * 100;
  var teinte = L.affirme ? '#199e70' : '#d95926';

  var h = '<div style="border:1px solid ' + teinte + '; border-radius:10px; padding:11px 14px; '
    + 'background:#0f172a;">'
    + '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:10px;">'
    + '<b style="font-size:13px; color:#e2e8f0;">Trajectoire ' + T.nom + '</b>'
    + '<span style="font-size:12px; font-weight:800; color:' + teinte + ';">'
    + (L.affirme ? '✔ EXISTE DANS LE THÈME' : '✘ ABSENTE DU THÈME') + '</span></div>'
    + '<div style="font-size:12px; color:#cbd5e1; margin-top:4px;">Somme des maisons M'
    + T.maisons.join(' + M') + ' = <b>' + L.nomResultante + '</b></div>';

  // la barre — échelle nommée, repère de médiane, valeur écrite en toutes lettres
  h += '<div style="margin-top:9px;">'
    + '<div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8;">'
    + '<span>Influence dans le thème</span><span><b style="color:#e2e8f0; font-size:12px;">'
    + inf.toFixed(1) + ' %</b></span></div>'
    + '<div style="position:relative; height:13px; background:#1e293b; border-radius:7px; '
    + 'margin-top:3px; overflow:hidden;">'
    + '<div style="width:' + pctBarre + '%; height:100%; background:' + teinte + '; border-radius:7px;"></div>'
    + '<div style="position:absolute; left:' + pctMed + '%; top:0; width:2px; height:100%; '
    + 'background:#e2e8f0; opacity:.85;"></div>'
    + '</div>'
    + '<div style="display:flex; justify-content:space-between; font-size:9.5px; color:#64748b; margin-top:2px;">'
    + '<span>0 %</span><span style="color:#cbd5e1;">| médiane ' + INFLUENCE_MEDIANE_V7 + ' %</span>'
    + '<span>' + INFLUENCE_MAX_V7 + ' %</span></div>'
    + '<div style="font-size:9.5px; color:#64748b; margin-top:3px;">'
    + nBase + ' position' + (nBase > 1 ? 's' : '') + ' en base (×1) · ' + nRes + ' en résultante (×0,5) '
    + '→ (' + nBase + ' + ' + (0.5 * nRes) + ') / 16. Échelle mesurée sur 32 000 couples figure-thème.</div>'
    + '</div>';

  if (L.positions.length) {
    h += '<div style="font-size:11px; color:#cbd5e1; margin-top:7px;"><b>Position</b> — '
      + L.positions.map(function (P) {
          return 'M' + P.maison + ' (' + P.source + ', maison ' + (P.elemMaison || '?')
            + ', concordance ' + (P.concordance === null ? '?' : P.concordance) + ')';
        }).join(' · ') + '</div>'
      + '<div style="font-size:11px; color:#cbd5e1; margin-top:2px;"><b>Environnement</b> — '
      + L.positions.map(function (P) {
          return 'M' + P.maison + ' entre ' + nom(P.avant.figure) + ' et ' + nom(P.apres.figure);
        }).join(' · ') + '</div>';
  }
  if (L.influence) {
    h += '<div style="font-size:11px; color:#cbd5e1; margin-top:2px;"><b>Influence sur les chefs</b> — '
      + 'R1 ' + nom(L.influence.figR1) + ' : ' + (L.influence.versR1 || 'aucun lien direct')
      + ' · R7 ' + nom(L.influence.figR7) + ' : ' + (L.influence.versR7 || 'aucun lien direct') + '</div>';
  }
  h += '<div style="font-size:9.5px; color:#94a3b8; margin-top:6px; border-top:1px solid #1e293b; padding-top:5px;">'
    + '⚠️ ' + L.avertissement + '</div>'
    + '<div style="font-size:9.5px; color:#64748b; margin-top:3px;">Clique à nouveau la trajectoire pour revoir toute la famille.</div>'
    + '</div>';
  el.innerHTML = h;
}

// ═══════════════════════════════════════════════════════════════
// SOMME DES 8 MAISONS DE CHAQUE CAMP, ET LE JUGE JUSTE APRÈS (04/09/26,
// demande Ellemine_D) — combineMany des 8 maisons de CAMP1 et des 8
// maisons de CAMP2 (les mêmes groupes que signalRecouvrementCampsV7),
// puis relation du Juge (M15) à chacune des deux sommes : identique,
// binôme, antagoniste, ou neutre. Affiché juste sous le carré, à la
// suite de sa légende. Purement observationnel, aucun poids sur le
// verdict — à suivre au fil des cas, comme les autres pistes du fichier.
function sommeCampsEtJugeV7(theme) {
  function canon(fig) { return NORM_FIG_LOOP[fig] || fig; }
  var sommeCamp1 = combineMany(CAMP1.map(function (h) { return canon(theme[h]); }));
  var sommeCamp2 = combineMany(CAMP2.map(function (h) { return canon(theme[h]); }));
  var juge = canon(theme[15]);
  function relation(fig) {
    if (fig === juge) return 'identique';
    if (BINOMES_V7[fig] === juge || BINOMES_V7[juge] === fig) return 'binôme';
    if (ANTAGONISTES_V7[fig] === juge || ANTAGONISTES_V7[juge] === fig) return 'antagoniste';
    return 'neutre';
  }
  return {
    sommeCamp1: sommeCamp1, sommeCamp2: sommeCamp2, juge: juge,
    jugeVsCamp1: relation(sommeCamp1), jugeVsCamp2: relation(sommeCamp2)
  };
}
window.sommeCampsEtJugeV7 = sommeCampsEtJugeV7;

function majLegendeCarreV7(axes, traj) {
  var el = document.getElementById('carre-geo-legende');
  if (!el) return;
  // La légende est TOUJOURS là dès qu'il y a deux séries : l'identité ne
  // doit jamais reposer sur la seule couleur.
  // La légende décrit maintenant des MAISONS COLORÉES, plus des traits :
  // pastille pleine, et le nom de l'axe écrit à côté — l'identité ne
  // repose jamais sur la seule couleur (le rouge et le jaune sont à
  // ΔE 6,2 en deutéranopie, l'étiquette est obligatoire).
  var h = axes.map(function (A) {
    return '<span style="display:inline-flex; align-items:center; gap:5px; margin-right:14px;">'
      + '<span style="display:inline-block; width:13px; height:13px; border-radius:3px; '
      + 'background:' + A.couleur + '; opacity:.45; border:1px solid ' + A.couleur + ';"></span>'
      + '<span style="color:#cbd5e1;">maisons de l\'axe ' + A.nom + ' — M' + A.maisons.join(' M') + '</span></span>';
  }).join('');
  if (traj.length) {
    h += '<span style="display:inline-flex; align-items:center; gap:5px;">'
      + '<span style="display:inline-block; width:18px; height:0; border-top:2px dashed #e2e8f0;"></span>'
      + '<span style="color:#cbd5e1;">' + traj.length + ' trajectoire' + (traj.length > 1 ? 's' : '')
      + ' — ' + traj.map(function (T) { return T.nom; }).join(' · ') + '</span></span>';
  }
  el.innerHTML = h;
}

// ─── SOMME DES 8 MAISONS DE CHAQUE CAMP, LE JUGE JUSTE APRÈS (04/09/26,
// sa demande) — cf. sommeCampsEtJugeV7. D'ABORD DANS LA MAUVAISE CASE :
// posé sous la légende des axes, donc sous le carré lui-même. Sa demande
// exacte était l'inverse : la FENÊTRE du carré doit venir APRÈS cette
// somme, pas avant. Déplacé dans #carre-geo-somme, posé dans le HTML
// avant le <svg> — purement un changement d'ordre d'affichage, aucun
// changement de calcul.
function renderSommeCampsEtJugeV7(theme) {
  var el = document.getElementById('carre-geo-somme');
  if (!el) return;
  var sc = null;
  try { sc = sommeCampsEtJugeV7(theme); } catch (e) { sc = null; }
  if (!sc) { el.innerHTML = ''; return; }
  var nomFig = function (f) { return (typeof FL !== 'undefined' && FL[f]) ? FL[f] : f; };
  el.innerHTML = '<div style="padding:7px 10px; border:1px solid #1e293b; border-radius:8px; '
    + 'background:#0f172a; font-size:11px; color:#cbd5e1;">'
    + '<b>Somme des 8 maisons</b> — Camp 1 : <b>' + nomFig(sc.sommeCamp1) + '</b> · '
    + 'Camp 2 : <b>' + nomFig(sc.sommeCamp2) + '</b>'
    + ' &nbsp;·&nbsp; <b>Juge (M15)</b> : <b>' + nomFig(sc.juge) + '</b>'
    + ' — face au Camp 1 : ' + sc.jugeVsCamp1 + ', face au Camp 2 : ' + sc.jugeVsCamp2
    + '</div>';
}

// 5) CLIC INTERACTIF (03/08/26, demande Ellemine_D) — même esprit que le
// clic sur une case de la matrice : affiche figure, maison, camp (zone
// M1/M7), régence naturelle, dignité essentielle et dignité accidentelle
// dans le panneau #detail déjà utilisé par la matrice.
window.carreGeoClickHouse = function(m){
  const detail = document.getElementById('detail');
  if(!detail || !lastTheme) return;
  const fig = lastTheme[m];
  if(!fig){ detail.innerHTML = 'Aucune figure pour cette maison (thème non chargé).'; return; }

  const label = m<=12 ? ROMAN_12[m] : ROMAN_16[m];
  const isGrand = (m===1||m===4||m===7||m===10);
  const cx = m<=12 ? centroid(CARRE_GEO_PTS[m])[0] : (quadsCenterX(m));
  const zone = m===10 || m===4 ? 'axe central (neutre, X/IV)' : (cx<200 ? 'zone M1 (gauche)' : (cx>200 ? 'zone M7 (droite)' : 'axe central'));

  let html = '<strong style="font-size:15px;">'+label+' (M'+m+') — '+fig+'</strong><br>';
  html += '<span style="color:#94a3b8;">Camp : '+zone+'</span><br>';

  if(m<=12 && typeof MAISON_CATEGORIE!=='undefined'){
    const cat = MAISON_CATEGORIE[m];
    const catLabel = cat==='angulaire' ? 'Angulaire ★ (la plus forte, action rapide et directe)'
      : cat==='succedente' ? 'Succédente (force moyenne)'
      : cat==='cadente' ? 'Cadente (la plus faible, lente/discrète)' : '—';
    html += '<br>Catégorie : <strong>'+catLabel+'</strong>';
  } else if(m>=13){
    html += '<br><em>Maison de synthèse (XIII-XVI) — hors classification angulaire/succédente/cadente classique, doctrine en attente.</em>';
  }

  if(typeof PLANETES_V7 !== 'undefined'){
    const planeteFig = PLANETES_V7[fig];
    html += '<br>Planète de la figure : <strong>'+(planeteFig||'—')+'</strong>';
    if(typeof infoLiaisonPlanetaire==='function'){
      const li = infoLiaisonPlanetaire(fig);
      if(li){
        html += '<br><span style="color:#c4b5fd;">Liaison planétaire :</span> <strong>' +
          (li.primaire ? 'principale' : 'secondaire') + '</strong> — intensité naturelle ' +
          li.intensite + '/100';
        html += '<br><span style="color:#cbd5e1;">Effet :</span> '+li.effet;
        html += '<br><span style="color:#cbd5e1;">Expression de la figure :</span> '+li.nuance;
      }
    }
    if(m<=12 && typeof MAISON_PLANETE !== 'undefined'){
      const planeteNat = MAISON_PLANETE[m];
      html += ' — Régente naturelle de '+label+' : <strong>'+(planeteNat||'—')+'</strong>';
      if(typeof evaluerDigniteEssentielle==='function' && planeteNat){
        const dig = evaluerDigniteEssentielle(planeteFig, planeteNat);
        const digCol = dig.score>0?'#4ade80':(dig.score<0?'#f87171':'#94a3b8');
        html += '<br>Dignité essentielle vs régente : <span style="color:'+digCol+';">'+dig.label+' ('+(dig.score>=0?'+':'')+dig.score+')</span>';
      }
    }
  }

  if(m<=12 && typeof calculerDigniteAccidentelle==='function'){
    // 03/09/26 : troisième appel qui passait un nom d'affichage — même
    // correctif que les deux autres de ce bloc.
    const da = digniteAccidentelleCarre(m, fig, lastTheme);
    if(da.erreur){
      html += '<br><br><strong style="color:#f87171;">Dignité accidentelle : ⚠️ '+da.erreur+'</strong>';
    } else {
      const daCol = da.total>0?'#4ade80':(da.total<0?'#f87171':'#94a3b8');
      const daV = Math.round(da.total*100)/100;
      html += '<br><br><strong>Dignité accidentelle totale : <span style="color:'+daCol+';">'+(daV>=0?'+':'')+daV+'</span></strong>';
      html += '<br><span style="font-size:11px; color:#94a3b8;">(catégorie '+(da.categorie||'—')+' : '+(da.scoreCategorie>=0?'+':'')+da.scoreCategorie+' &nbsp;+&nbsp; régence : '+da.regence.label+' '+(da.regence.score>=0?'+':'')+da.regence.score+' &nbsp;+&nbsp; concordance élémentaire ('+da.concordanceInfo+') '+(da.concordanceBonus>=0?'+':'')+(Math.round(da.concordanceBonus*100)/100)+')</span>';
    }
  }

  html += '<br><br><span class="hint">📚 Étude (03/08/26) — dignités et régences non validées empiriquement, informatif seul.</span>';
  detail.innerHTML = html;
};
function quadsCenterX(m){ return ({13:150,14:250,15:150,16:250})[m] || 200; }

// RENOMMÉ (correctif redéclaration) : cette fonction s'appelait renderTheme(theme)
// et était écrasée silencieusement par la fonction renderTheme() (sans paramètre,
// pipeline verdict complet) déclarée plus bas dans le script suivant — ses effets
// (surlignage matrice, widget M1/M7, carré géomantique, sync UI de référence,
// fermeture auto du panneau force planétaire) n'étaient donc plus jamais exécutés.
// Renommée et appelée explicitement depuis renderTheme() pour restaurer ces effets.
function renderThemeLegacyWidgets(theme){
  clearThemeHighlights();
  for(let m=1;m<=16;m++){
    const figName = theme[m];
    const td = document.querySelector(`td.cell[data-fig="${figName}"][data-house="${m}"]`);
    if(td) td.classList.add('theme-active');
  }
  lastTheme = theme;
  initAxisThemeControls(theme);
  renderVerdictM1M7(theme);
  // SUPPRIMÉ (21/08/26, focalisation sur un seul moteur, demande
  // Ellemine_D) : renderQuatreTrones(theme) et renderVerdictFamilial(theme)
  // — deux verdicts concurrents supplémentaires, retirés au profit du
  // Réseau d'ancrage V2 comme unique moteur décisif.
  renderCarreGeomantique(theme);
  // ⚠️ renderRapportForceCarre A ÉTÉ RETIRÉ (03/09/26). Le panneau
  // « rapport de force » montrait les MÊMES dix trajectoires que le
  // panneau des zones, en binaire (✔/✘) là où les zones les notent
  // maintenant en force graduée. Deux panneaux disant la même chose sur
  // deux échelles, c'est une invitation à se demander lequel décide.
  // Le panneau des zones les subsume : il porte les dix trajectoires,
  // leur somme, leur force, leurs maisons, et le mode fixe/rotation.
  renderVerdictCarreGeomantique(theme);
  setTimeout(function(){ if(window.syncReferenceUI) window.syncReferenceUI(); }, 0);
  var pp=document.getElementById('force-planetaire-panel');
  if(pp && pp.style.display==='block' && typeof toggleForcePlanetairePanel==='function'){
    pp.style.display='none';
    toggleForcePlanetairePanel();
  }
}

// ═══════════════════════════════════════════════════════════════
// 🏛️ LE JUGEMENT DES QUATRE TRÔNES — moteur expérimental (27/07/26,
// demande explicite : "construire un autre moteur basé sur le tableau de
// la matrice", créatif, indépendant de verdictFinal). N'utilise QUE les
// propriétés déjà établies et validées de la matrice elle-même :
//   • TIER (repos=+3, binôme=+2, neutre=+1, antagoniste=+0)
//   • FAVORABILITÉ PAR CASE (amie=+2 / ennemie=-2, boucle A/B, avec
//     l'exception M16/air)
//   • CONCORDANCE ÉLÉMENTAIRE (élément propre de la figure = élément de
//     la maison -> +1)
// Additionné sur 4 sièges : M1 + R1 (rotation depuis M1) pour le Trône
// M1, M7 + R7 pour le Trône M7. Le trône au score total le plus élevé
// l'emporte. PUREMENT EXPÉRIMENTAL, jamais testé sur l'archive — un
// jouet créatif à ce stade, pas un remplaçant de verdictFinal.
// RÈGLE DE DOMINATION (27/07/26, doctrine Ellemine_D, "utilise seulement la
// rotation comme verdict" + "antagoniste ou binôme dans leur propre maison
// avec la présence de leur binôme dans le thème ils dominent ou impactent
// beaucoup") : une figure qui agit comme antagoniste OU binôme du résident
// naturel de sa maison, ET dont le binôme PROPRE est actif ailleurs dans le
// thème, domine/impacte fortement — remplace l'ancien score (tier +
// favorabilité + élément) : seule la rotation (M1/R1 vs M7/R7) + cette
// règle de domination comptent désormais.
// 28/07/26, revue couche par couche : Quatre Trônes utilisait encore
// l'ancien système plat (tierOf/TIER_SCORE, domination binaire) —
// contradictoire avec la hiérarchie à paliers calibrée pour le Verdict
// Familial juste après dans ce fichier (tierWeightFF). Unifié : les deux
// moteurs partagent maintenant EXACTEMENT le même calcul de force par
// case, donc les mêmes conclusions sur une même case.




// ===== Intégration avec le thème de l'application hôte =====
const HOST_TO_OUR = {
  puer:"Puer", laetitia:"Laetitia", caput_draconis:"Caput", albus:"Albus",
  via:"Via", amissio:"Amissio", rubeus:"Rubeus", tristitia:"Tristitia",
  fortuna_minor:"Fortuna minor", carcer:"Carcer", conjunctio:"Conjonctio",
  fortuna_major:"Fortuna majeur", cauda_draconis:"Cauda", puella:"Puella",
  acquisitio:"Aquisitio", populus:"Populus"
};

function convertHostTheme(hostTheme){
  const t = {};
  for(let m=1;m<=16;m++){
    const code = hostTheme[m];
    t[m] = HOST_TO_OUR[code] || code;
  }
  return t;
}

// AJOUTÉ (24/08/26) : comparerForcePlanetaireR1R7 était appelée par
// renderVerdictM1M7 mais n'existait NULLE PART dans le fichier — chaque
// rendu du panneau de référence levait un ReferenceError, avalé par le
// try/catch du pont geomtx, si bien que le widget M1/M7 restait vide en
// permanence (panne silencieuse, jamais visible en console sans ouvrir
// les outils de développement).
// Elle relit la force planétaire du moteur principal
// (calculerForcePlanetaireMaison) au lieu de dupliquer la doctrine ; il
// faut donc retraduire le thème local (convention capitalisée "Puer",
// "Fortuna minor") vers les codes attendus par ce moteur ('puer',
// 'fortuna_minor').
const OUR_TO_HOST = {};
Object.keys(HOST_TO_OUR).forEach(function(code){ OUR_TO_HOST[HOST_TO_OUR[code]] = code; });

function toHostTheme(theme){
  const t = {};
  for(let m=1;m<=16;m++){ t[m] = OUR_TO_HOST[theme[m]] || theme[m]; }
  return t;
}

// Facteur borné, à l'échelle de TIER_SCORE (0..3) : la force planétaire
// nuance le repérage sans le dominer. Seuils repris de
// couleurForcePlanetaire (80/60/40) pour rester cohérent avec le panneau
// "🪐 Force planétaire".
function facteurDepuisForcePlanetaire(score){
  if(score >= 80) return 2;
  if(score >= 60) return 1;
  if(score >= 40) return 0;
  return -1;
}

// hR1/hR7 sont passées par l'appelant : le widget doit afficher la
// planète des maisons qu'il désigne lui-même comme R1/R7, jamais d'une
// rotation recalculée séparément qui pourrait diverger.
function comparerForcePlanetaireR1R7(theme, hR1, hR7){
  const vide = {planete:null, force:0, facteur:0};
  if(typeof calculerForcePlanetaireMaison !== 'function') return {r1:vide, r7:vide};
  const hostTheme = toHostTheme(theme);
  function mesurer(h){
    try{
      const fp = calculerForcePlanetaireMaison(h, hostTheme);
      if(!fp) return vide;
      return {planete:fp.planete, force:fp.score, facteur:facteurDepuisForcePlanetaire(fp.score)};
    }catch(err){
      return vide;
    }
  }
  return {r1:mesurer(hR1), r7:mesurer(hR7)};
}

window.__geomtxOnHostTheme = function(hostTheme){
  // CORRIGÉ (régression du 24/08/26) : un précédent correctif faisait
  // pointer cet appel sur currentTheme + la renderTheme() globale du
  // pipeline verdict (script suivant) — celle-ci attend des codes en
  // minuscules ('puer', 'fortuna_minor', ...), alors que
  // convertHostTheme() traduit vers la convention capitalisée propre à
  // CE panneau (GLYPHS, MAP_GEO locaux : "Puer", "Fortuna minor", ...).
  // Injecter le thème converti dans currentTheme cassait donc le verdict
  // principal (FL[...] undefined, "Cannot read properties of undefined
  // (reading '0')") à chaque rendu, puisque le crochet plus bas dans le
  // fichier appelle déjà window.__geomtxOnHostTheme(currentTheme) après
  // CHAQUE renderTheme(). Restauré : on alimente uniquement le panneau
  // de référence local (renderThemeLegacyWidgets), jamais currentTheme.
  if(!hostTheme) return;
  try{
    renderThemeLegacyWidgets(convertHostTheme(hostTheme));
  }catch(err){
    console.error('geomtx: erreur de conversion du theme hote', err);
  }
};

})();

