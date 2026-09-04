// ═══════════════════════════════════════════════════════════════
// DOCTRINE ET TABLES
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════


// MAINTENANCE (03/09/26) : échappement HTML centralisé — avant ce correctif,
// plusieurs points d'injection (renderQuestionContext, historique des thèmes
// sauvegardés) inséraient team1/team2/stadium/postalCode/questionLibre/
// realScore/interpretation directement dans innerHTML sans échappement,
// permettant une injection HTML/JS (XSS) via un simple champ de formulaire
// (ex. nom d'équipe). Toute donnée saisie par l'utilisateur et réinjectée
// dans du HTML doit désormais passer par escHtml().
function escHtml(v){
  return String(v==null?'':v).replace(/[&<>"']/g,function(s){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s];
  });
}

const TEAM_NAMES_LIST = [
  "Paris Saint-Germain F.C.",
  "Olympique de Marseille",
  "AS Monaco FC",
  "Olympique Lyonnais",
  "LOSC Lille",
  "OGC Nice",
  "RC Strasbourg Alsace",
  "Stade Rennais FC",
  "RC Lens",
  "Stade Brestois 29",
  "Toulouse FC",
  "AJ Auxerre",
  "FC Nantes",
  "Angers SCO",
  "Le Havre AC",
  "FC Metz",
  "FC Lorient",
  "Paris FC",
  "Juventus FC",
  "Inter Milan",
  "AC Milan",
  "SSC Napoli",
  "AS Roma",
  "SS Lazio",
  "Atalanta BC",
  "ACF Fiorentina",
  "Bologna FC 1909",
  "Torino FC",
  "Udinese Calcio",
  "Genoa CFC",
  "Parma Calcio 1913",
  "US Lecce",
  "Hellas Verona FC",
  "Cagliari Calcio",
  "Como 1907",
  "Pisa SC",
  "US Sassuolo Calcio",
  "US Cremonese",
  "Al Hilal",
  "Al Nassr",
  "Al Ittihad",
  "Al Ahli",
  "Al Shabab",
  "Al Ettifaq",
  "Al Taawoun",
  "Al Qadsiah",
  "Al Riyadh",
  "Al Fateh",
  "Al Fayha",
  "Al Khaleej",
  "Al Kholood",
  "Al Okhdood",
  "Al Hazem",
  "Damac",
  "Al Najma",
  "NEOM SC",
  "Borussia Dortmund",
  "FC Bayern Munich",
  "RB Leipzig",
  "Bayer 04 Leverkusen",
  "Eintracht Frankfurt",
  "AFC Ajax",
  "PSV Eindhoven",
  "Feyenoord",
  "SL Benfica",
  "FC Porto",
  "Sporting CP",
  "Celtic F.C.",
  "Rangers F.C.",
  "Galatasaray S.K.",
  "Fenerbahçe S.K.",
  "Beşiktaş J.K.",
  "Club Brugge KV",
  "RSC Anderlecht",
  "FC Red Bull Salzburg",
  "Al Ahly SC",
  "Wydad AC",
  "Mamelodi Sundowns F.C.",
  "CR Flamengo",
  "SE Palmeiras",
  "Santos FC",

  // Angleterre - Premier League
  "Arsenal",
  "Aston Villa",
  "Bournemouth",
  "Brentford",
  "Brighton & Hove Albion",
  "Burnley",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Leeds United",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Newcastle United",
  "Nottingham Forest",
  "Sunderland",
  "Tottenham Hotspur",
  "West Ham United",
  "Wolverhampton Wanderers",
  // Angleterre - Championship / League One / League Two / National League
  "Accrington Stanley",
  "AFC Wimbledon",
  "Barnet",
  "Barnsley",
  "Birmingham City",
  "Blackburn Rovers",
  "Blackpool",
  "Bolton Wanderers",
  "Bradford City",
  "Bristol City",
  "Bristol Rovers",
  "Bromley",
  "Burton Albion",
  "Cambridge United",
  "Cardiff City",
  "Charlton Athletic",
  "Cheltenham Town",
  "Chesterfield",
  "Colchester United",
  "Crewe Alexandra",
  "Crawley Town",
  "Doncaster Rovers",
  "Derby County",
  "Exeter City",
  "Fleetwood Town",
  "Gillingham",
  "Grimsby Town",
  "Huddersfield Town",
  "Leicester City",
  "Leyton Orient",
  "Lincoln City",
  "Luton Town",
  "Mansfield Town",
  "Middlesbrough",
  "Milton Keynes Dons",
  "Millwall",
  "Newport County",
  "Northampton Town",
  "Norwich City",
  "Notts County",
  "Oldham Athletic",
  "Oxford United",
  "Peterborough United",
  "Plymouth Argyle",
  "Port Vale",
  "Portsmouth",
  "Preston North End",
  "Queens Park Rangers",
  "Reading",
  "Rochdale",
  "Rotherham United",
  "Salford City",
  "Sheffield United",
  "Sheffield Wednesday",
  "Shrewsbury Town",
  "Southampton",
  "Stevenage",
  "Stockport County",
  "Stoke City",
  "Swansea City",
  "Swindon Town",
  "Walsall",
  "Watford",
  "West Bromwich Albion",
  "Wigan Athletic",
  "Wycombe Wanderers",
  "Wrexham",
  "York City",

  // Argentine - Liga Profesional
  "Aldosivi",
  "Argentinos Juniors",
  "Atlético Tucumán",
  "Banfield",
  "Barracas Central",
  "Belgrano",
  "Boca Juniors",
  "Central Córdoba",
  "Defensa y Justicia",
  "Deportivo Riestra",
  "Estudiantes de La Plata",
  "Estudiantes de Río Cuarto",
  "Gimnasia La Plata",
  "Gimnasia Mendoza",
  "Huracán",
  "Independiente",
  "Independiente Rivadavia",
  "Instituto",
  "Lanús",
  "Newell's Old Boys",
  "Platense",
  "Racing Club",
  "River Plate",
  "Rosario Central",
  "San Lorenzo",
  "Sarmiento",
  "Talleres",
  "Tigre",
  "Unión",
  "Vélez Sarsfield",

  // Mexique - Liga MX
  "Atlas FC",
  "Atlético San Luis",
  "Club América",
  "Chivas de Guadalajara",
  "Cruz Azul",
  "FC Juárez",
  "Club León",
  "Mazatlán FC",
  "CF Monterrey",
  "Club Necaxa",
  "CF Pachuca",
  "Club Puebla",
  "Pumas UNAM",
  "Club Querétaro",
  "Tigres UANL",
  "Club Tijuana",
  "Toluca FC",
  "Santos Laguna",

  // Russie - Premier League russe (RPL)
  "Krasnodar",
  "Zenit Saint-Pétersbourg",
  "CSKA Moscou",
  "Spartak Moscou",
  "Lokomotiv Moscou",
  "Dynamo Moscou",
  "Rostov",
  "Rubin Kazan",
  "Krylia Sovetov Samara",
  "Akhmat Grozny",
  "Dynamo Makhachkala",
  "Nizhny Novgorod",
  "Akron Togliatti",
  "Orenbourg",
  "Sochi",
  "Baltika Kaliningrad",

  // Etats-Unis / Canada - MLS
  "Atlanta United",
  "Austin FC",
  "Charlotte FC",
  "Chicago Fire",
  "FC Cincinnati",
  "Colorado Rapids",
  "Columbus Crew",
  "D.C. United",
  "FC Dallas",
  "Houston Dynamo",
  "Inter Miami",
  "LA Galaxy",
  "Los Angeles FC",
  "Minnesota United",
  "CF Montréal",
  "Nashville SC",
  "New England Revolution",
  "New York City FC",
  "New York Red Bulls",
  "Orlando City",
  "Philadelphia Union",
  "Portland Timbers",
  "Real Salt Lake",
  "San Diego FC",
  "San Jose Earthquakes",
  "Seattle Sounders",
  "Sporting Kansas City",
  "St. Louis City",
  "Toronto FC",
  "Vancouver Whitecaps",

  // Espagne - La Liga
  "Alavés",
  "Athletic Bilbao",
  "Atlético de Madrid",
  "FC Barcelone",
  "Celta Vigo",
  "Elche CF",
  "Espanyol Barcelone",
  "Getafe CF",
  "Levante UD",
  "Osasuna",
  "Rayo Vallecano",
  "Real Betis",
  "Real Madrid",
  "Real Sociedad",
  "Racing Santander",
  "RC Deportivo La Corogne",
  "Málaga CF",
  "Séville FC",
  "Valence CF",
  "Villarreal CF"
];

const FIGS=['puer','laetitia','caput_draconis','albus','via','amissio','rubeus','tristitia','fortuna_minor','carcer','conjunctio','fortuna_major','cauda_draconis','puella','acquisitio','populus'];
const FL={puer:'Puer',laetitia:'Laetitia',caput_draconis:'Caput Draconis',albus:'Albus',via:'Via',amissio:'Amissio',rubeus:'Rubeus',tristitia:'Tristitia',fortuna_minor:'Fortuna Minor',carcer:'Carcer',conjunctio:'Conjunctio',fortuna_major:'Fortuna Major',cauda_draconis:'Cauda Draconis',puella:'Puella',acquisitio:'Acquisitio',populus:'Populus'};
const MAP_GEO={puer:[1,1,2,1],laetitia:[1,2,2,2],caput_draconis:[2,1,1,1],albus:[2,2,1,2],via:[1,1,1,1],amissio:[1,2,1,2],rubeus:[2,1,2,2],tristitia:[2,2,2,1],fortuna_minor:[1,1,2,2],carcer:[1,2,2,1],conjunctio:[2,1,1,2],fortuna_major:[2,2,1,1],cauda_draconis:[1,1,1,2],puella:[1,2,1,1],acquisitio:[2,1,2,1],populus:[2,2,2,2]};
// INDEX BINAIRE (28/07/26, doctrine Ellemine_D, vérifié : puer=11 exact).
// Poids par ligne (ordre feu/air/eau/terre) : feu=1, air=2, eau=4, terre=8.
// 1 point = OUVERT (poids plein) ; 2 points = FERMÉ (0). Voir la version
// jumelle dans le module matrice (indexBinaire/INDEX_BINAIRE).
function indexBinaireEngine(fig){
  const g = MAP_GEO[fig];
  if(!g) return null;
  const [feu, air, eau, terre] = g;
  const val = (d, w) => d===1 ? w : 0;
  return val(feu,1) + val(air,2) + val(eau,4) + val(terre,8);
}
const ELEMENTS={puer:'feu',laetitia:'feu',caput_draconis:'air',albus:'eau',via:'eau',amissio:'eau',rubeus:'air',tristitia:'terre',fortuna_minor:'feu',carcer:'terre',conjunctio:'air',fortuna_major:'terre',cauda_draconis:'eau',puella:'terre',acquisitio:'air',populus:'feu'};
const ELEMENT_COLORS = {feu:'#ef4444', air:'#eab308', eau:'#3b82f6', terre:'#000000'};

const BINOMES={puer:'caput_draconis',puella:'populus',albus:'amissio',rubeus:'fortuna_minor',fortuna_major:'puella',cauda_draconis:'acquisitio',laetitia:'albus',caput_draconis:'via',via:'rubeus',amissio:'tristitia',tristitia:'carcer',fortuna_minor:'conjunctio',carcer:'fortuna_major',conjunctio:'cauda_draconis',acquisitio:'puer',populus:'laetitia'};
const ANTAGONISTES={puer:'puella',puella:'conjunctio',conjunctio:'tristitia',tristitia:'via',via:'laetitia',laetitia:'acquisitio',acquisitio:'fortuna_major',fortuna_major:'fortuna_minor',fortuna_minor:'amissio',amissio:'caput_draconis',caput_draconis:'populus',populus:'cauda_draconis',cauda_draconis:'carcer',carcer:'rubeus',rubeus:'albus',albus:'puer'};
// ⚠️ Table historique corrigée (08/07/26) : M9-M16 étaient désynchronisés de
// MAISON_ELEM_V7 (la table validée — cf. concordance parfaite M1/M8/M9/M12).
// Valeurs désormais identiques à MAISON_ELEM_V7 — à terme, unifier les deux tables.
const MAISON_ELEM={1:'feu',2:'air',3:'eau',4:'terre',5:'feu',6:'air',7:'eau',8:'terre',9:'feu',10:'air',11:'eau',12:'terre',13:'feu',14:'air',15:'eau',16:'terre'};
const CAMP1=[1,2,3,4,9,10,13,16];
const CAMP2=[5,6,7,8,11,12,14,15];
const housePositions={1:{left:560,top:0},2:{left:480,top:0},3:{left:400,top:0},4:{left:320,top:0},5:{left:240,top:0},6:{left:160,top:0},7:{left:80,top:0},8:{left:0,top:0},9:{left:520,top:94},10:{left:360,top:94},11:{left:200,top:94},12:{left:40,top:94},13:{left:440,top:188},14:{left:120,top:188},15:{left:280,top:282},16:{left:440,top:322}};
const sumSlots=['sumHouse1','sumHouse2','sumHouse3','sumHouse4','sumHouse5','sumHouse6','sumHouse7','sumHouse8'];
let currentTheme=null; let currentAnalysis=null; let currentQuestionContext=null; let houseResultTimeouts={}; let showHouseLabels=true; let selectedHouse=1; let themeCastAt=null; let lastLaunchWasBlind=false;
let housePixelPos={};

// ── Consultation personnelle (12/07/26) : mode distinct du moteur football, ──
// sans lien avec verdictFinal/verdictV7/calculerButsCamp. Utilise le même
// tirage (4 mères → combine()) mais l'interprète selon la géomancie
// classique de consultation : maisons I-XII (mères→I-IV, filles→V-VIII,
// nièces→IX-XII, méthode séquentielle Cattan/Greer — confirmée par
// recherche externe, cf. digitalambler.com "On Making the House Chart").
const FIGURE_MEANINGS_PERSO = {
  puer:            {sens:"Énergie impulsive, action rapide, conflit ou affirmation de soi", polarite:'mixte'},
  amissio:         {sens:"Perte, séparation, ce qui s'en va ou échappe", polarite:'defavorable'},
  albus:           {sens:"Calme, réflexion, sagesse — situation qui se clarifie lentement", polarite:'favorable'},
  populus:         {sens:"Influence du groupe ou de l'entourage — rien ne se décide seul", polarite:'neutre'},
  fortuna_major:   {sens:"Réussite solide et méritée, protection durable", polarite:'favorable'},
  fortuna_minor:   {sens:"Chance rapide mais changeante, aide extérieure passagère", polarite:'mixte'},
  conjunctio:      {sens:"Union, rencontre, lien qui se crée ou se renforce", polarite:'neutre'},
  puella:          {sens:"Harmonie, douceur, charme — évolution favorable mais passive", polarite:'favorable'},
  rubeus:          {sens:"Tension, désordre, passion incontrôlée ou danger", polarite:'defavorable'},
  via:             {sens:"Mouvement, changement, transition en cours", polarite:'mixte'},
  carcer:          {sens:"Blocage, restriction, retard ou enfermement", polarite:'defavorable'},
  tristitia:       {sens:"Tristesse, perte profonde, restriction douloureuse", polarite:'defavorable'},
  laetitia:        {sens:"Joie, succès, bonne santé, évolution positive", polarite:'favorable'},
  cauda_draconis:  {sens:"Fin, rupture, sortie ou dissolution d'une situation", polarite:'defavorable'},
  caput_draconis:  {sens:"Début, nouvelle opportunité, porte qui s'ouvre", polarite:'favorable'},
  acquisitio:      {sens:"Gain, acquisition, croissance matérielle", polarite:'favorable'}
};
// Noms classiques (latin traditionnel entre parenthèses) confirmés par
// recherche externe — ce sont les 12 maisons de l'astrologie classique
// reprises telle quelles par la géomancie (Cattan, Heydon, Greer).
const MAISON_PERSO = {
  1:  {nom:"Maison I — La Vie",                 domaine:"Toi-même, ta vitalité, ta situation générale actuelle"},
  2:  {nom:"Maison II — La Richesse",           domaine:"Argent, finances, possessions, gains ou pertes matérielles"},
  3:  {nom:"Maison III — Les Frères",           domaine:"Fratrie, voisins, courts déplacements, communication"},
  4:  {nom:"Maison IV — Le Foyer",              domaine:"Parents, maison, racines, fin des choses"},
  5:  {nom:"Maison V — Les Enfants",            domaine:"Enfants, créativité, amour naissant, projets personnels"},
  6:  {nom:"Maison VI — La Maladie",            domaine:"Santé, travail quotidien, difficultés mineures"},
  7:  {nom:"Maison VII — Le Mariage",           domaine:"Couple, union, associés, adversaires directs"},
  8:  {nom:"Maison VIII — La Mort",             domaine:"Pertes profondes, héritages, peurs, changements majeurs"},
  9:  {nom:"Maison IX — La Religion",           domaine:"Voyages lointains, études, croyances, sens de la vie"},
  10: {nom:"Maison X — La Royauté",             domaine:"Carrière, statut social, autorité, réussite, ambitions"},
  11: {nom:"Maison XI — Les Amis",              domaine:"Amitiés, projets d'avenir, soutiens, souhaits"},
  12: {nom:"Maison XII — Les Ennemis cachés",   domaine:"Ennemis cachés, secrets, épreuves invisibles, autolimitation"},
  // Maisons XIII-XVI : pas des domaines de vie (mères/filles/nièces I-XII
  // seules en ont), mais les 4 figures de synthèse classiques du bouclier
  // géomantique — témoins (issus des nièces), Juge (issu des témoins),
  // Réconciliation (Juge + 1ère mère). On les affiche pour compléter les
  // 16 positions comme demandé, avec leur rôle propre plutôt qu'un domaine.
  13: {nom:"Maison XIII — Témoin de droite",    domaine:"Ressources et influences internes du consultant, ce qui vient de lui"},
  14: {nom:"Maison XIV — Témoin de gauche",     domaine:"Circonstances et influences externes, ce qui échappe au consultant"},
  15: {nom:"Maison XV — Le Juge",               domaine:"Réponse et verdict final à la question posée"},
  16: {nom:"Maison XVI — La Réconciliation",    domaine:"Confirmation ou nuance finale, éclairage complémentaire au Juge"}
};
function interpreterFigureMaison(fig, houseNum) {
  var f = FIGURE_MEANINGS_PERSO[fig];
  var m = MAISON_PERSO[houseNum];
  if (!f || !m) return '';
  var couleur = f.polarite==='favorable' ? '#4ade80' : f.polarite==='defavorable' ? '#f87171' : f.polarite==='mixte' ? '#fbbf24' : '#94a3b8';
  return '<b>'+m.nom+'</b> <span class="muted" style="font-size:12px;">('+m.domaine+')</span><br/>Figure <b style="color:'+couleur+';">'+FL[fig]+'</b> — '+f.sens+'.';
}
function genererConsultationPersonnelle(theme, domaine) {
  if (!theme) return '<div class="muted">Lance un tirage d\'abord (mères 1 à 4 ci-dessus).</div>';
  var html = '<div class="card">';
  html += '<h3>🔮 Consultation personnelle — interprétation par maison (16 positions)</h3>';
  if (domaine === 'general' || !domaine) {
    for (var h = 1; h <= 16; h++) {
      var estJuge = (h === 15);
      var style = 'margin-top:6px; padding-bottom:6px; border-bottom:1px solid rgba(148,163,184,.2);' + (estJuge ? ' border:1px solid #60a5fa; border-radius:8px; padding:8px;' : '');
      html += '<div class="kv" style="'+style+'">' + interpreterFigureMaison(theme[h], h) + '</div>';
    }
  } else {
    var hNum = parseInt(domaine, 10);
    html += '<div class="kv" style="border:1px solid #60a5fa; border-radius:8px; padding:10px;">' + interpreterFigureMaison(theme[hNum], hNum) + '</div>';
  }
  html += '<div class="muted" style="font-size:11px; margin-top:8px;">Lecture géomantique classique — mères → maisons I-IV, filles → V-VIII, nièces → IX-XII (domaines de vie), témoins → XIII-XIV, Juge → XV, Réconciliation → XVI (figures de synthèse) — indépendante du moteur de prédiction football utilisé par ailleurs dans cette app.</div>';
  html += '</div>';
  return html;
}
function lancerConsultationPersonnelle() {
  var [m1,m2,m3,m4] = getCurrentMotherValues();
  var themePerso = buildThemeFromMothers(m1,m2,m3,m4);
  var domaine = (document.getElementById('domainePerso')||{}).value || 'general';
  var out = document.getElementById('consultation-perso-output');
  if (out) {
    out.innerHTML = genererConsultationPersonnelle(themePerso, domaine);
    out.style.display = 'block';
  }
  var toggleBtn = document.getElementById('toggleConsultationBtn');
  if (toggleBtn) { toggleBtn.style.display = 'inline-block'; toggleBtn.textContent = '🙈 Masquer l\'interprétation'; }
}
function toggleConsultationOutput() {
  var out = document.getElementById('consultation-perso-output');
  var toggleBtn = document.getElementById('toggleConsultationBtn');
  if (!out || !toggleBtn) return;
  var hidden = out.style.display === 'none';
  out.style.display = hidden ? 'block' : 'none';
  toggleBtn.textContent = hidden ? '🙈 Masquer l\'interprétation' : '👁️ Afficher l\'interprétation';
}

function populateSelect(id){const el=document.getElementById(id); if(el) el.innerHTML=FIGS.map(f=>`<option value="${f}">${FL[f]}</option>`).join('');}
function populateHouseSelect(id,p='M'){const el=document.getElementById(id); if(el) el.innerHTML=`<option value="">— Non sélectionné —</option>`+Array.from({length:16},(_,i)=>`<option value="${i+1}">${p}${i+1}</option>`).join('');}
function updateSumHouseLabels(){const mode=document.getElementById('sumModeBottom').value; const prefix=mode==='rotation'?'R':'M'; sumSlots.forEach(slot=>{const id=`${slot}Bottom`; var __el=document.getElementById(id); var v=(__el?__el.value:'')||''; populateHouseSelect(id,prefix); document.getElementById(id).value=v;});}
function populateFigureSelectOptional(id){const el=document.getElementById(id); if(el) el.innerHTML=`<option value="">— Non sélectionné —</option>`+FIGS.map(f=>`<option value="${f}">${FL[f]}</option>`).join('');}
// COMBINAISON AVEC LA FIGURE DE REPOS (14/07/26, demande utilisateur) :
// combine la figure choisie avec la figure de repos naturelle (FIGS[maison-1])
// de la maison choisie — outil de vérification manuelle indépendant du thème
// courant, aucune des deux saisies n'est requise pour l'autre d'exister.
function updateCombineRepos(){
  const figEl = document.getElementById('combineFigureSelect');
  const houseEl = document.getElementById('combineHouseSelect');
  const outEl = document.getElementById('combineResult');
  if(!figEl || !houseEl || !outEl) return;
  const fig = figEl.value, house = houseEl.value;
  if(!fig || !house){ outEl.value = '—'; return; }
  const repos = FIGS[parseInt(house)-1];
  outEl.value = FL[combine(fig, repos)] + ' (= ' + FL[fig] + ' + repos de M' + house + ' = ' + FL[repos] + ')';
}
// MODE LIVE : « Temps écoulé » et « Score actuel » étaient affichés et
// saisissables sans être relus par aucune ligne du fichier (constaté le
// 28/08/26). CORRIGÉ le 03/09/26 : getLiveMatchState()/appliquerEtatLiveV7()
// (cf. leur commentaire, près de scoreAfficheV7) les utilisent désormais
// pour poser un plancher sur le score final affiché et signaler une
// contradiction en fin de match — sans imposer de camp, faute de doctrine
// validée sur le direct (à la différence du reste du moteur).
function toggleDrawMode(){
  const mode=document.getElementById('drawMode').value;
  document.getElementById('manual-mothers').style.display=(mode==='manual'||mode==='live')?'grid':'none';
  document.getElementById('dice-mothers').style.display=mode==='dice'?'block':'none';
  // MODE LIVE (04/08/26, demande Ellemine_D) — pour un match déjà en
  // cours, on ne demande plus l'heure du coup d'envoi mais le temps
  // écoulé (minutes) + le score actuel, plus pertinents pour un tirage
  // radical pris en direct.
  const kickoffField = document.getElementById('kickoff-time-field');
  const liveFields = document.getElementById('live-match-fields');
  if (kickoffField) kickoffField.style.display = (mode==='live') ? 'none' : 'block';
  if (liveFields) liveFields.style.display = (mode==='live') ? 'flex' : 'none';
}
// CORRIGÉ (16/07/26) : getTopbarOpenPadding() renvoyait des valeurs figées
// (270/420/760px) devinées à une époque où la barre du haut était plus
// courte. Le formulaire a grossi au fil de la session (consultation
// personnelle, nouveaux boutons...) et la barre fixe atteint désormais
// ~650px de haut à largeur desktop — le padding figé ne suivait plus,
// donc tout ce qui tombait entre le padding et la vraie hauteur de la
// barre (ex. la carte "Verdict R1/R7" une fois remontée en tête) restait
// caché derrière elle. Remplacé par une mesure réelle (offsetHeight),
// recalculée au chargement, au redimensionnement et via ResizeObserver
// à chaque fois que le contenu de la barre change de taille.
function syncTopbarPadding(){
  const shell = document.querySelector('.topbar-shell');
  const content = document.getElementById('topbarContent');
  if (!shell) return;
  if (content && content.classList.contains('topbar-hidden')) {
    document.body.style.paddingTop = '110px';
  } else {
    document.body.style.paddingTop = (shell.offsetHeight + 14) + 'px';
  }
}
function toggleTopbarContent(){const shell=document.querySelector('.topbar-shell'); const content=document.getElementById('topbarContent'); const btn=document.getElementById('toggleTopbarBtn'); const hidden=content.classList.toggle('topbar-hidden'); btn.textContent=hidden?'Afficher':'Masquer'; if(shell) shell.style.paddingBottom=hidden?'0px':''; syncTopbarPadding();}
function toggleHouseLabels(){showHouseLabels=!showHouseLabels; const btn=document.getElementById('toggleHouseLabelsBtn'); if(btn) btn.textContent=showHouseLabels?'Masquer numérotation M/R':'Afficher numérotation M/R'; if(currentTheme) renderTheme();}

// ═══════════════════════════════════════════════════════════════
// THÈME DE VÉRIFICATION (07/07/26) — reconstruit un thème complet en
// prenant comme 4 mères les figures de l'axe cardinal du thème
// principal (M1, M4, M7, M10). Sert de contre-lecture indépendante,
// purement informative : n'écrase pas currentTheme, ne pèse sur aucun
// verdict officiel.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// POIDS BINAIRE & AUTO-TEST XOR (07/07/26) — chaque figure encode un
// nombre 0-15 (feu=1, air=2, eau=4, terre=8 ; ligne à 1 point compte,
// ligne à 2 points = 0). Propriété clé : combine(a,b) == poids(a) XOR
// poids(b) bit à bit, car la règle "pair+pair=pair, impair+pair=impair,
// impair+impair=pair" est exactement une addition XOR de parité.
// Sert d'auto-test indépendant de tout le moteur de combinaison
// (combine/combineMany/calcTheme) : toute divergence = bug caché.
// ═══════════════════════════════════════════════════════════════
function poidsFigureV7(fig) {
  var m = MAP_GEO[fig];
  if (!m) return null;
  var w = [1, 2, 4, 8];
  var total = 0;
  for (var i = 0; i < 4; i++) { if (m[i] === 1) total += w[i]; }
  return total;
}

function autoTestMoteurXOR() {
  var figs = Object.keys(MAP_GEO);
  var poids = {};
  figs.forEach(function(f) { poids[f] = poidsFigureV7(f); });

  var seen = {}, dupErrors = [];
  figs.forEach(function(f) {
    if (seen[poids[f]] !== undefined) dupErrors.push(f + ' et ' + seen[poids[f]] + ' partagent le poids ' + poids[f]);
    seen[poids[f]] = f;
  });

  var total = 0, fails = [];
  figs.forEach(function(a) {
    figs.forEach(function(b) {
      total++;
      var resFig = combine(a, b);
      var expected = poids[a] ^ poids[b];
      var resWeight = poids[resFig];
      if (resWeight !== expected) {
        fails.push(a + ' ⊕ ' + b + ' → ' + resFig + ' (poids ' + resWeight + '), attendu poids ' + expected);
      }
    });
  });

  return { poids: poids, dupErrors: dupErrors, total: total, fails: fails };
}

// Distance de Hamming entre deux figures (0 à 4) = nombre de lignes qui
// diffèrent = popcount(poids(a) XOR poids(b)). Mesure numérique de
// ressemblance/opposition entre deux figures, indépendante des tables
// de binômes/antagonistes classiques.
function hammingDistance(figA, figB) {
  var wa = poidsFigureV7(figA), wb = poidsFigureV7(figB);
  if (wa === null || wb === null) return null;
  var x = wa ^ wb, count = 0;
  while (x) { count += x & 1; x >>= 1; }
  return count;
}

function statsDistanceRelations() {
  var figs = Object.keys(MAP_GEO);
  var binDist = [], antDist = [];
  figs.forEach(function(f) {
    var bin = BINOMES_V7[f];
    var ant = ANTAGONISTES_V7[f];
    if (bin) binDist.push(hammingDistance(f, bin));
    if (ant) antDist.push(hammingDistance(f, ant));
  });
  function avg(arr) { return arr.length ? (arr.reduce(function(a,b){return a+b;},0) / arr.length).toFixed(2) : 'n/a'; }
  function repartition(arr) {
    var d = {0:0,1:0,2:0,3:0,4:0};
    arr.forEach(function(v) { d[v]++; });
    return '0:' + d[0] + ' 1:' + d[1] + ' 2:' + d[2] + ' 3:' + d[3] + ' 4:' + d[4];
  }
  return { binAvg: avg(binDist), antAvg: avg(antDist), binRepart: repartition(binDist), antRepart: repartition(antDist) };
}

function toggleAutoTestXOR() {

  var panel = document.getElementById('autotest-xor-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    var r = autoTestMoteurXOR();
    var html = '<h3>🧮 Auto-test moteur (poids binaire vs XOR)</h3>';
    if (r.dupErrors.length === 0) {
      html += '<div class="kv"><span class="good">✅ Bijection confirmée</span> — les 16 figures donnent bien 16 poids distincts (0 à 15).</div>';
    } else {
      html += '<div class="kv"><span class="bad">❌ Bijection cassée :</span> ' + r.dupErrors.join(' | ') + '</div>';
    }
    if (r.fails.length === 0) {
      html += '<div class="kv"><span class="good">✅ ' + r.total + '/' + r.total + ' paires — combine() concorde parfaitement avec XOR(poids).</span></div>';
    } else {
      html += '<div class="kv"><span class="bad">❌ ' + r.fails.length + '/' + r.total + ' divergences détectées :</span></div>';
      r.fails.slice(0, 20).forEach(function(f) {
        html += '<div class="kv" style="font-size:12px; color:#f87171;">' + f + '</div>';
      });
      if (r.fails.length > 20) html += '<div class="muted" style="font-size:11px;">… et ' + (r.fails.length - 20) + ' autres.</div>';
    }
    html += '<div class="kv" style="margin-top:6px; font-size:12px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px;"><b>Table des poids :</b> ' +
      Object.keys(r.poids).sort(function(x,y){return r.poids[x]-r.poids[y];}).map(function(f){ return FL[f]+'='+r.poids[f]; }).join(', ') + '</div>';
    var sd = statsDistanceRelations();
    html += '<div class="kv" style="margin-top:8px; font-size:12px;"><b>📏 Distance de Hamming — binômes :</b> moyenne ' + sd.binAvg + '/4 — répartition (' + sd.binRepart + ')</div>';
    html += '<div class="kv" style="font-size:12px;"><b>📏 Distance de Hamming — antagonistes :</b> moyenne ' + sd.antAvg + '/4 — répartition (' + sd.antRepart + ')</div>';
    html += '<div class="muted" style="font-size:11px; margin-top:4px;">Si binômes et antagonistes ont des moyennes proches, la distance de Hamming ne les distingue pas — il faudra la tester directement sur M1↔M7/R1↔R7 de l\'archive plutôt que sur ces tables fixes.</div>';
    var ca = comparerAntagonistes();
    html += '<div class="kv" style="margin-top:8px; font-size:12px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px;"><b>⚔️ ANTAGONISTES_V7 (actuel) vs complément total (candidat) :</b> ' + ca.accords + '/' + ca.total + ' figures coïncident.</div>';
    ca.lignes.forEach(function(l) {
      html += '<div class="kv" style="font-size:11px; color:' + (l.meme ? '#4ade80' : '#94a3b8') + ';">' + FL[l.fig] + ' — actuel: ' + FL[l.actuel] + (l.meme ? ' (= complément)' : ', complément: ' + FL[l.complement]) + '</div>';
    });
    var tt = autoTestTablesLegacyVsV7();
    html += '<div class="kv" style="margin-top:8px; font-size:12px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px;"><b>🗂️ Tables legacy vs V7 (ELEMENTS/BINOMES/ANTAGONISTES/MAISON_ELEM) :</b> ' + (tt.ok ? '<span class="good">✅ identiques, aucune divergence</span>' : '<span class="bad">❌ ' + tt.mismatches.length + ' divergence(s)</span>') + '</div>';
    if (!tt.ok) {
      tt.mismatches.forEach(function(m) { html += '<div class="kv" style="font-size:11px; color:#f87171;">' + m + '</div>'; });
    }
    var lm = autoTestLoiMaisonV7();
    html += '<div class="kv" style="margin-top:8px; font-size:12px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px;"><b>🏠 Loi de la résultante au siège (table Ellemine du 28/08) :</b> ' + (lm.ok ? '<span class="good">✅ les 6 lois tiennent sur les ' + lm.total + ' couples figure × maison</span>' : '<span class="bad">❌ ' + lm.fautes.length + ' loi(s) violée(s)</span>') + '</div>';
    lm.lois.forEach(function(l) {
      html += '<div class="kv" style="font-size:11px; color:' + (l.ok === lm.total ? '#4ade80' : '#f87171') + ';">' + l.nom + ' — ' + l.ok + '/' + lm.total + '</div>';
    });
    html += '<div class="muted" style="font-size:11px; margin-top:4px;">Maison paire : la résultante reste dans la boucle (terre → front/identité, air → binôme/bouclier). Maison impaire : elle vient d\'en face. L\'agresseur (±3) n\'est engendré que par M1, M3, M5, M11, M13 — jamais par une maison air ou terre.</div>';
    panel.innerHTML = html;
    panel.style.display = 'block';
    try { renderBouclesAntagonistesR1R7Panel(currentTheme || null); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  } else {
    panel.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════
// CONVERGENCE NUL (07/07/26) — cas Portugal-Espagne : trois signaux
// indépendants (juge annonce nul, campDominant muet, miroir R1=R7 via
// distance de Hamming 0) pointaient vers un match fermé/serré, mais la
// hiérarchie élémentaire (rang 2, faible) a quand même tranché seule,
// à tort. Règle candidate : si ≥2 des 3 critères convergent, signaler
// une forte incertitude avant qu'un rang faible ne décide seul.
// STATUT : 📚 étude — n'entre pas encore dans verdictFinal, à
// contre-tester sur l'archive (compare converge=true/false vs réel).
// ═══════════════════════════════════════════════════════════════
function signalConvergenceNul(theme) {
  var jr = analyzeJugeRecit(theme);
  var jugeNul = !!jr.nulPossible;
  var cd = campDominant(theme);
  var campMuet = !cd.winner;
  var order = getRotationOrderFromRepos(theme[1]);
  var r1 = order[0], r7 = order[6];
  var distR = hammingDistance(theme[r1], theme[r7]);
  var miroirR = (distR === 0);
  // CORRECTION (10/07/26) : jugeNul (le Juge annonce un nul possible) s'est
  // avéré être le critère le plus trompeur — présent dans 6 des 7 erreurs
  // de nul_suspecte sur l'archive, absent dans l'unique cas juste. Testé :
  // remplacer "2 critères sur 3" par "campMuet ET miroirR strictement" (sans
  // compter jugeNul) fait passer vfOk de 48% à 62% sur l'archive (+4 net :
  // 5 thèmes gagnés — Argentine/Egypte, Chelsea/Barcelone, Dortmund/Roma,
  // Ferencvárosi/Qarabag, Potosi — contre 1 perdu, Roma/Chelsea).
  // CORRECTION (revue contradictions) : jugeNul reste calculé et affiché à
  // titre de contexte, mais n'a plus jamais compté dans "count" ni dans le
  // texte de résumé — avant, l'UI affichait un score "X/3 critères" qui
  // laissait croire que les 3 critères pesaient dans la décision, alors que
  // seuls campMuet et miroirR décidaient réellement (converge ci-dessous).
  var count = (campMuet ? 1 : 0) + (miroirR ? 1 : 0);
  var criteres = [
    (jugeNul ? '✅' : '❌') + ' Juge annonce nul possible (' + jr.recit + ') — contextuel, non déterminant',
    (campMuet ? '✅' : '❌') + ' Camp dominant muet (' + cd.reason + ') — déterminant',
    (miroirR ? '✅' : '❌') + ' Miroir R1=R7 (distance Hamming ' + distR + '/4) — déterminant'
  ];
  var converge = campMuet && miroirR;
  return {
    converge: converge,
    count: count,
    criteres: criteres,
    resume: converge
      ? '⚠️ Signal de convergence nul (' + count + '/2 critères déterminants) — 📚 étude : la hiérarchie élémentaire (rang 2) ne devrait probablement pas trancher seule ici.'
      : 'Convergence nul : ' + count + '/2 critères déterminants (sous le seuil).'
  };
}

// ═══════════════════════════════════════════════════════════════
// ANTAGONISTE "COMPLÉMENT TOTAL" (07/07/26) — candidat alternatif à
// ANTAGONISTES_V7 (décalage fixe de 3 dans FIGS_V7). Ici : la figure
// dont les 4 lignes sont TOUTES inversées (poids(a) XOR poids(b) = 15).
// C'est un antagonisme "pur" au sens géométrique (opposition totale
// ligne à ligne), indépendant de l'ordre FIGS_V7. Seuls Albus et
// Fortuna Major coïncident avec ANTAGONISTES_V7 actuel — les 14 autres
// figures ont un antagoniste candidat différent. 📚 étude, à
// contre-tester sur l'archive avant toute promotion.
// ═══════════════════════════════════════════════════════════════
function figureParPoidsV7(poids) {
  var figs = Object.keys(MAP_GEO);
  for (var i = 0; i < figs.length; i++) { if (poidsFigureV7(figs[i]) === poids) return figs[i]; }
  return null;
}
function antagonisteComplementV7(fig) {
  var w = poidsFigureV7(fig);
  if (w === null) return null;
  return figureParPoidsV7(15 ^ w);
}
function comparerAntagonistes() {
  var figs = Object.keys(MAP_GEO);
  var lignes = [], accords = 0;
  figs.forEach(function(f) {
    var actuel = ANTAGONISTES_V7[f];
    var complement = antagonisteComplementV7(f);
    var meme = (actuel === complement);
    if (meme) accords++;
    lignes.push({ fig: f, actuel: actuel, complement: complement, meme: meme });
  });
  return { lignes: lignes, accords: accords, total: figs.length };
}
// Signal étude : M1 et M7 sont-ils en antagonisme "complément total" ?
function oppositionComplementM1M7(theme) {
  var comp1 = antagonisteComplementV7(theme[1]);
  var comp7 = antagonisteComplementV7(theme[7]);
  var actif = (comp1 === theme[7]) || (comp7 === theme[1]);
  return {
    actif: actif,
    resume: actif
      ? '📚 étude — M1(' + FL[theme[1]] + ') et M7(' + FL[theme[7]] + ') sont en antagonisme "complément total" (opposition ligne à ligne complète).'
      : null
  };
}

// ═══════════════════════════════════════════════════════════════
// FORCE DU REPOS PAR MAISON (07/07/26) — étude Ellemine sur la façon
// dont l'énergie circule dans les 16 maisons quand chaque figure est
// dans sa maison de repos naturelle (FIGS_V7[pos-1]). Contrairement à
// concordanceFigureMaisonV7 qui aplatit tout repos absolu à 100, cette
// table distingue la force réelle selon le type de paire élémentaire :
// FF=TT (Forte,100) > FA=ET (Moyen fort,75) > AE=EA=FT (Moyen,50) >
// EF=TA (Faible,25). Table fixe, structurelle, indépendante du thème
// tiré. 📚 étude — n'écrase pas encore concordanceFigureMaisonV7.
// ═══════════════════════════════════════════════════════════════
const FORCE_REPOS_MAISON_V7 = {
  1:100, 2:75, 3:50, 4:75, 5:25, 6:50, 7:50, 8:100,
  9:100, 10:25, 11:50, 12:100, 13:25, 14:25, 15:50, 16:50
};
const TIER_REPOS_LABEL_V7 = {100:'Forte', 75:'Moyen fort', 50:'Moyen', 25:'Faible'};

function getForceReposMaison(pos) {
  var score = FORCE_REPOS_MAISON_V7[pos];
  var figRepos = FIGS_V7[pos-1];
  return {
    pos: pos,
    fig: figRepos,
    label: FL[figRepos],
    score: score,
    tier: TIER_REPOS_LABEL_V7[score],
    elemFig: ELEMENTS_V7[figRepos],
    elemMaison: MAISON_ELEM_V7[pos]
  };
}


// PROTOCOLE R1/R7 — comparaison des boucles antagonistes. Les résultantes
// comptent explicitement dans l'analyse de chaque figure.
function analyseFigureBoucleR1R7(fig, theme){
  // CORRIGÉ (21/08/26, demande Ellemine_D "pourquoi trop de verdicts
  // Indécis") : référençait FIGURES (tableau n/h/b/a) déclaré dans une
  // IIFE isolée (script tag séparé) et jamais exporté vers window —
  // ReferenceError systématique dès que ce point de code était atteint.
  // Ce crash était jusqu'ici invisible car MASQUÉ par le bug loopOf
  // (voir plus haut) qui coupait toujours court avant d'y arriver.
  // Remplacé par les tables canoniques déjà utilisées partout ailleurs
  // dans le moteur (FIGS_V7/BINOMES_V7/ANTAGONISTES_V7), qui éliminent
  // aussi la redondance/désynchronisation avec une source parallèle.
  // Même bug pour resultanteName() (dépend de GLYPHS, clés capitalisées,
  // elle aussi coincée dans cette IIFE isolée) -> remplacé par
  // getResultant(fig,pos), déjà utilisé ailleurs, compatible clés internes.
  const repos=FIGS_V7.indexOf(fig)+1, bin=BINOMES_V7[fig], ant=ANTAGONISTES_V7[fig], base=[], res=[];
  for(let h=1;h<=16;h++){ if(theme[h]===fig) base.push(h); if(getResultant(theme[h],h)===fig) res.push(h); }
  const tous=[...new Set([...base,...res])];
  const details=tous.map(h=>({h,source:base.includes(h)&&res.includes(h)?'base+résultante':base.includes(h)?'base':'résultante',elemMaison:MAISON_ELEM_V7[h],concordance:concordanceElement(ELEMENTS_V7[fig],MAISON_ELEM_V7[h]),resultante:getResultant(theme[h],h)}));
  return {fig,repos,base,res,tous,reposPresent:repos!=null&&(theme[repos]===fig||getResultant(theme[repos],repos)===fig),bin:bin,ant:ant,binPos:bin?positionsBaseEtResultantes(bin,theme):[],antPos:ant?positionsBaseEtResultantes(ant,theme):[],details,forcePositions:details.reduce((a,d)=>a+d.concordance,0),resultantesPropres:details.filter(d=>loopOf(d.resultante)===loopOf(fig)).length,resultantesAdverses:details.filter(d=>loopOf(d.resultante)&&loopOf(d.resultante)!==loopOf(fig)).length};
}
function comparerBouclesAntagonistesR1R7(theme){
  if(!theme||!theme[1]) return {applicable:false,reason:'Thème non disponible.'};
  const rot=getRotationOrderFromRepos(theme[1]),hR1=rot[0],hR7=rot[6],r1=theme[hR1],r7=theme[hR7],l1=loopOf(r1),l7=loopOf(r7);
  if(!l1||!l7||l1===l7) return {applicable:false,hR1,hR7,r1,r7,reason:'R1 et R7 ne sont pas dans deux boucles différentes.'};
  const loop1=l1==='A'?LOOP_A:LOOP_B,loop7=l7==='A'?LOOP_A:LOOP_B,a1=loop1.map(f=>analyseFigureBoucleR1R7(f,theme)),a7=loop7.map(f=>analyseFigureBoucleR1R7(f,theme));
  const synth=a=>a.reduce((t,x)=>t+x.forcePositions+(x.reposPresent?2:0)+Math.min(x.tous.length,3)*.5+x.binPos.length*.5+x.resultantesPropres*.75-x.resultantesAdverses*1.25,0);
  const duel=[]; const seen=new Set();
  [...a1,...a7].forEach(x=>{const yf=x.ant;if(!yf||loopOf(yf)===loopOf(x.fig))return;const y=(loopOf(yf)===l1?a1:a7).find(z=>z.fig===yf);if(!y)return;const k=[x.fig,y.fig].sort().join('|');if(seen.has(k))return;seen.add(k);const sx=x.forcePositions+(x.reposPresent?2:0)+Math.min(x.tous.length,3)*.5+x.binPos.length*.5+x.resultantesPropres*.75-x.resultantesAdverses*1.25,sy=y.forcePositions+(y.reposPresent?2:0)+Math.min(y.tous.length,3)*.5+y.binPos.length*.5+y.resultantesPropres*.75-y.resultantesAdverses*1.25;duel.push({a:x,b:y,scoreA:sx,scoreB:sy});});
  let s1=synth(a1),s7=synth(a7); duel.forEach(d=>{if(loopOf(d.a.fig)===l1){s1+=d.scoreA-d.scoreB;s7+=d.scoreB-d.scoreA;}});
  const total = s1 + s7;
  const pct1 = total > 0 ? (s1 / total) * 100 : 50;
  const pct7 = total > 0 ? (s7 / total) * 100 : 50;
  return {
    applicable:true, hR1, hR7, r1, r7, l1, l7, a1, a7, duel,
    total1:s1, total7:s7, scoreR1:s1, scoreR7:s7,
    pctR1:pct1, pctR7:pct7, gap:Math.abs(s1-s7),
    winner:s1>s7?'R1':s7>s1?'R7':'Égalité'
  };
}
// RENOMMÉ (correctif redéclaration) : cette version écrit directement dans
// #r1r7-boucles-protocole et était écrasée silencieusement par la version
// plus bas (même nom, qui RETOURNE une chaîne HTML) — l'appel de
// toggleAutoTestXOR() ci-dessous devenait alors sans effet observable.
function renderBouclesAntagonistesR1R7Panel(theme){
  const p=document.getElementById('r1r7-boucles-protocole');if(!p)return;const q=comparerBouclesAntagonistesR1R7(theme);
  if(!q.applicable){p.innerHTML='<div class="muted" style="font-size:11px;">⚖️ Protocole R1/R7 non activé : '+q.reason+'</div>';return;}
  const f=n=>Number(n).toFixed(2).replace('.',',');
  const row=x=>{const pos=x.tous.map(h=>{const d=x.details.find(z=>z.h===h);return 'M'+h+(d.source==='résultante'?'ᵣ':d.source==='base+résultante'?'ᵦᵣ':'')+' ['+d.resultante+']';}).join(' · ')||'aucune';return '<div style="padding:5px 7px;border:1px solid rgba(148,163,184,.18);border-radius:7px;margin:4px 0;font-size:11px;"><b>'+FL[x.fig]+'</b> — '+pos+' · repos M'+x.repos+(x.reposPresent?' ✓':' ✗')+' · binôme '+(FL[x.bin]||x.bin||'—')+' ('+x.binPos.length+') · antagoniste '+(FL[x.ant]||x.ant||'—')+' ('+x.antPos.length+') · force '+f(x.forcePositions)+' · résultantes propres '+x.resultantesPropres+' / adverses '+x.resultantesAdverses+'</div>';};
  let h='<h3>⚔️ Comparaison des boucles antagonistes R1 / R7</h3><div class="muted" style="font-size:11px;margin-bottom:7px;">R1/R7 sont dans deux boucles différentes. Les présences de base ET les résultantes sont comptées.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
  h+='<div><b style="color:#60a5fa;">R1 = '+FL[q.r1]+' · M'+q.hR1+' · boucle '+q.l1+'</b>'+q.a1.map(row).join('')+'</div><div><b style="color:#fb923c;">R7 = '+FL[q.r7]+' · M'+q.hR7+' · boucle '+q.l7+'</b>'+q.a7.map(row).join('')+'</div></div>';
  h+='<div style="margin-top:8px;padding:8px;border:1px solid rgba(96,165,250,.3);border-radius:8px;"><b>Comparaison :</b> R1 '+f(q.total1)+' vs R7 '+f(q.total7)+' → <b>'+q.winner+'</b></div>';
  if(q.duel.length) h+='<div style="margin-top:8px;font-size:11px;"><b>Duels figure ↔ antagoniste</b>'+q.duel.map(d=>'<div>'+FL[d.a.fig]+' ('+f(d.scoreA)+') ↔ '+FL[d.b.fig]+' ('+f(d.scoreB)+') → '+(d.scoreA>d.scoreB?'R1':d.scoreB>d.scoreA?'R7':'égalité')+'</div>').join('')+'</div>';
  p.innerHTML=h;
}

function toggleInterpretationPanel() {
  var panel = document.getElementById('interpretation-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    // Construit le textarea UNE SEULE FOIS : si on reconstruisait l'innerHTML
    // a chaque ouverture (comme les autres panneaux toggle), ca effacerait
    // le texte deja tape par l'utilisateur a chaque fermeture/reouverture.
    if (!document.getElementById('interpretationText')) {
      panel.innerHTML = '<div id="r1r7-boucles-protocole" style="margin-bottom:10px;"></div>'
        + '<h3>📝 Interprétation du thème</h3>'
        + '<div class="muted" style="font-size:11px; margin-bottom:6px;">Note libre, sert de repère personnel — sauvegardée avec le thème dans Historique/Sauvegardés.</div>'
        + '<textarea id="interpretationText" rows="8" style="width:100%; background:#0f172a; color:#e2e8f0; border:1px solid #334155; border-radius:8px; padding:8px; font-size:14px; font-family:inherit;" placeholder="Écris ton interprétation du thème ici..."></textarea>';
    }
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
function clearInterpretationText() {
  var ta = document.getElementById('interpretationText');
  if (ta) ta.value = '';
}
function getInterpretationText() {
  var ta = document.getElementById('interpretationText');
  return ta ? ta.value : '';
}

function toggleForceReposPanel() {
  var panel = document.getElementById('force-repos-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    var html = '<h3>📊 Force du repos par maison (structurelle, fixe)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Étude Ellemine (07/07/26) : quand chaque figure est dans sa maison de repos naturelle, la force réelle dépend du type de paire élémentaire, pas d\'un simple "chez soi = 100%".</div>';
    for (var p = 1; p <= 16; p++) {
      var r = getForceReposMaison(p);
      var color = r.score === 100 ? '#4ade80' : r.score === 75 ? '#a3e635' : r.score === 50 ? '#fbbf24' : '#f87171';
      html += '<div class="kv" style="font-size:12px; color:' + color + ';"><b>M' + p + '</b> — ' + r.label + ' (' + r.elemFig + '/' + r.elemMaison + ') : ' + r.tier + ' (' + r.score + ')</div>';
    }
    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════
// POINTS STRATÉGIQUES DE PARITÉ (14/07/26, doctrine utilisateur) : sur
// les 8 maisons PAIRES (M2,4,6,8,10,12,14,16), la résultante reste
// TOUJOURS dans la même boucle de binôme (pair/impair) que la figure de
// base — loi exacte et universelle, vérifiée sans exception sur les 128
// combinaisons (16 figures × 8 maisons paires). À l'inverse, sur les 8
// maisons IMPAIRES, la boucle change TOUJOURS (16/16 violations à
// chaque maison, sans exception non plus). Ces 8 maisons paires sont
// donc des points fixes structurels : leur figure ET sa résultante
// appartiennent à coup sûr à la même boucle, contrairement aux maisons
// impaires où c'est systématiquement l'inverse.
// Désignées comme POINTS STRATÉGIQUES pour la bataille des camps M1/M7 :
// un point dont la boucle correspond à celle de M1 (ou M7) renforce
// structurellement ce camp — base ET résultante alignées sur la même
// boucle, sans jamais fuir vers l'autre camp. Signal d'étude, non
// encore mêlé au calcul du verdict.
// ═══════════════════════════════════════════════════════════════
function pointsStrategiquesParite(theme){
  const cycleOf = f => (FIGS.indexOf(f)%2===0) ? 'impair' : 'pair';
  const cycleM1 = cycleOf(theme[1]);
  const cycleM7 = cycleOf(theme[7]);
  const maisons = [2,4,6,8,10,12,14,16];
  return maisons.map(function(h){
    const fig = theme[h];
    const res = getResultant(fig, h);
    const cycle = cycleOf(fig); // == cycleOf(res), toujours, par construction
    const camp = CAMP1.indexOf(h) >= 0 ? 'CAMP1 (M1)' : 'CAMP2 (M7)';
    let alignement;
    if (cycleM1 === cycleM7) alignement = 'neutre (M1 et M7 partagent la même boucle)';
    else alignement = (cycle === cycleM1) ? 'renforce M1' : 'renforce M7';
    return {maison:h, figure:fig, resultante:res, cycle:cycle, camp:camp, alignement:alignement};
  });
}
// FIGURE DU JOUR (14/07/26) : calculée depuis longtemps (renderTheme)
// mais jamais affichée ni utilisée nulle part — variable morte. Ce
// panneau lui donne enfin un rôle visible : savoir si elle renforce le
// thème du jour (présente quelque part) ou lui est étrangère.
// ═══════════════════════════════════════════════════════════════
// FIGURES D'ÉQUILIBRE (03/08/26, doctrine transmise par Ellemine_D,
// tradition géomantique classique) — chaque figure a une figure
// d'équilibre : l'une exprime une énergie vers l'extérieur, l'autre la
// même énergie tournée vers l'intérieur, retardée ou inversée. Table
// DISTINCTE de BINOMES et de ANTAGONISTES_V7 (troisième type de
// relation entre figures). 📚 étude — hypothèse en cours de test, non
// validée empiriquement.
// ═══════════════════════════════════════════════════════════════
const FIGURES_EQUILIBRE = {
  puer:'puella', puella:'puer',
  amissio:'acquisitio', acquisitio:'amissio',
  albus:'rubeus', rubeus:'albus',
  populus:'via', via:'populus',
  fortuna_major:'fortuna_minor', fortuna_minor:'fortuna_major',
  carcer:'conjunctio', conjunctio:'carcer',
  tristitia:'laetitia', laetitia:'tristitia',
  caput_draconis:'cauda_draconis', cauda_draconis:'caput_draconis'
};
function estPaireEquilibre(a, b) { return !!a && !!b && FIGURES_EQUILIBRE[a] === b; }

// SIGNAL DÉDIÉ — TÉMOINS EN ÉQUILIBRE (03/08/26, doctrine Ellemine_D :
// "au niveau des témoins souvent il y a nul quand les témoins sont
// opposés"). Isolé du score composite à 6 étages ci-dessous, car
// spécifiquement désigné comme plus fiable que les autres étages —
// mérite son propre statut plutôt que d'être noyé dans une moyenne sur 6.
// 📚 étude — "souvent" reste à quantifier sur l'archive réelle.
function signalTemoinsEnEquilibre(theme) {
  const td = theme[13], tg = theme[14];
  const enEquilibre = estPaireEquilibre(td, tg);
  return { td: td, tg: tg, enEquilibre: enEquilibre };
}

// ═══════════════════════════════════════════════════════════════
// STRUCTURE DU NUL (04/08/26, 📚 étude, doctrine complète Ellemine_D) —
// formalise la lecture du nul en 5 étapes sur la génération déjà
// existante du thème (rien de nouveau côté calcul, juste une nouvelle
// grille de lecture) :
//   1. 4 mères → M1-M16 (génération classique déjà en place)
//   2. Partie 1 (M1,M2,M3,M4,M9,M10 → M13) / Partie 2 (M5,M6,M7,M8,M11,
//      M12 → M14) — c'est exactement comment M13/M14 sont déjà
//      construits (M13=combine(M9,M10), M14=combine(M11,M12))
//   3. M13 = Juge 1, M14 = Juge 2
//   4. M15 = reconstruction de M13+M14 (déjà M15=combine(M13,M14))
//   5. M16 = sentence finale, indique la MANIÈRE dont le nul se
//      manifeste (déjà M16=combine(M15,M1))
//
// RELATIONS DE NUL :
//   - Identité   : M13 = M14 (même figure exacte)
//   - Opposition : M13 ↔ M14 forment une paire — RÉUTILISE
//     FIGURES_EQUILIBRE (déjà codé le 03/08/26) : les 8 paires que
//     Ellemine_D donne ici (Acquisitio/Amissio, Rubeus/Albus,
//     Tristitia/Laetitia, Conjonctio/Carcer, Via/Populus, Puer/Puella,
//     Caput/Cauda, Fortuna Minor/Fortuna Major) sont EXACTEMENT les
//     mêmes 8 paires déjà dans FIGURES_EQUILIBRE — pas une coïncidence,
//     la même relation vue sous un nom différent ("opposition" ici,
//     "équilibre" dans la doctrine générative). Réutilisée telle quelle.
//
// FIGURES ASSOCIÉES AU NUL (doctrine, non calculées) :
//   Fréquentes : Carcer, Conjonctio, Populus, Via
//   Conditionnelles : Acquisitio, Fortuna Minor, Fortuna Major
//
// ÉLÉMENTS DOCTRINAUX propres à CETTE lecture (M13=Feu, M14=Feu,
// M15=Air, M16=Terre) — ATTENTION, ceci est DIFFÉRENT de la table
// MAISON_ELEM_V7 générale (qui donne M13=feu, M14=air, M15=eau,
// M16=terre, un cycle répété toutes les 4 maisons). Les deux tables
// coexistent : MAISON_ELEM_V7 sert au calcul de concordance générale
// (chaineDeForce, etc.), celle-ci est une lecture doctrinale propre à
// la Structure du Nul, stockée à part pour ne rien écraser.
// Statut : 📚 étude, aucun poids sur verdictFinal.
// ═══════════════════════════════════════════════════════════════
const FIGURES_NUL_FREQUENTES = ['carcer', 'conjunctio', 'populus', 'via'];
const FIGURES_NUL_CONDITIONNELLES = ['acquisitio', 'fortuna_minor', 'fortuna_major'];
const ELEMENTS_STRUCTURE_NUL = { 13: 'Feu', 14: 'Feu', 15: 'Air', 16: 'Terre' };

// ═══════════════════════════════════════════════════════════════
// INTERPRÉTATIONS FOOTBALL PAR CASE (05/08/26, doctrine complète fournie
// par Ellemine_D — 256 cases : 16 figures × 16 maisons). Pour chaque
// figure en chaque maison : force/nature, faiblesse, impact football
// concret, tendance de buts, tendance de résultat, code couleur
// (🟦 favorable / 🟧 intermédiaire / 🟥 défavorable-danger / 🟨 neutre-
// équilibre / 🟪 neutre-collectif). Vérifié : 256/256 cases complètes,
// aucune manquante. 📚 étude — narration/lecture textuelle, aucun poids
// chiffré sur verdictFinal (c'est une couche d'interprétation en langage
// naturel, pas un signal numérique comme les autres 📚 étude).
// ═══════════════════════════════════════════════════════════════
const INTERPRETATIONS_FOOTBALL_V7 = {
  puer: { nature:'FF', maisons:{
    1: {force:'agressivité offensive',faiblesse:'excès',impact:'A attaque fortement',buts:'potentiel élevé',resultat:'victoire A si maîtrisée',couleur:'🟧'},
    2: {force:'énergie',faiblesse:'dépense excessive',impact:'A consomme ses ressources',buts:'potentiel élevé puis baisse',resultat:'avantage A',couleur:'🟧'},
    3: {force:'percussion',faiblesse:'précipitation',impact:'jeu offensif direct',buts:'élevés',resultat:'avantage A',couleur:'🟧'},
    4: {force:'combativité',faiblesse:'indiscipline',impact:'fin tendue',buts:'possibles tardivement',resultat:'bascule',couleur:'🟥'},
    5: {force:'attaque',faiblesse:'précipitation',impact:'forte pression offensive',buts:'élevés/précoces',resultat:'avantage de l\'équipe concernée',couleur:'🟧'},
    6: {force:'intensité',faiblesse:'agressivité',impact:'fautes/cartons',buts:'indirect',resultat:'risque disciplinaire',couleur:'🟥'},
    7: {force:'agressivité B',faiblesse:'excès',impact:'B attaque fortement',buts:'élevés',resultat:'avantage B',couleur:'🟧'},
    8: {force:'action',faiblesse:'violence',impact:'incident/penalty possible',buts:'potentiel élevé',resultat:'bascule',couleur:'🟥'},
    9: {force:'percussion B',faiblesse:'précipitation',impact:'attaque directe B',buts:'élevés',resultat:'avantage B',couleur:'🟧'},
    10: {force:'pression',faiblesse:'conflit avec arbitre',impact:'arbitrage sollicité',buts:'indirect',resultat:'risque de sanction',couleur:'🟥'},
    11: {force:'initiative A',faiblesse:'précipitation',impact:'A cherche à concrétiser',buts:'élevés',resultat:'victoire A possible',couleur:'🟧'},
    12: {force:'réaction',faiblesse:'erreurs sous pression',impact:'pertes A',buts:'occasion offerte à B',resultat:'risque B',couleur:'🟥'},
    13: {force:'combativité collective',faiblesse:'désorganisation',impact:'duel permanent',buts:'élevés',resultat:'match ouvert',couleur:'🟧'},
    14: {force:'percussion B',faiblesse:'désordre',impact:'B attaque',buts:'élevés',resultat:'match ouvert',couleur:'🟧'},
    15: {force:'accélération',faiblesse:'épuisement',impact:'changement rapide',buts:'possibles',resultat:'bascule',couleur:'🟧'},
    16: {force:'combat',faiblesse:'excès',impact:'thème offensif et tendu',buts:'élevés',resultat:'victoire risquée / bascule',couleur:'🟥'},
  }},
  laetitia: { nature:'FO', maisons:{
    1: {force:'confiance',faiblesse:'optimisme excessif',impact:'A prend l\'initiative',buts:'élevés',resultat:'victoire A',couleur:'🟦'},
    2: {force:'abondance',faiblesse:'gaspillage',impact:'bonnes ressources',buts:'élevés',resultat:'avantage A',couleur:'🟦'},
    3: {force:'créativité',faiblesse:'prise de risque',impact:'jeu offensif',buts:'élevés',resultat:'avantage A',couleur:'🟦'},
    4: {force:'réussite',faiblesse:'relâchement',impact:'fin favorable',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    5: {force:'créativité offensive',faiblesse:'excès',impact:'nombreuses occasions',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    6: {force:'confiance',faiblesse:'relâchement',impact:'fautes limitées',buts:'indirect',resultat:'favorable',couleur:'🟦'},
    7: {force:'confiance B',faiblesse:'excès',impact:'B dangereux',buts:'élevés',resultat:'victoire B possible',couleur:'🟦'},
    8: {force:'chance',faiblesse:'excès de confiance',impact:'événement favorable possible',buts:'élevés',resultat:'bascule',couleur:'🟦'},
    9: {force:'créativité B',faiblesse:'prise de risque',impact:'attaque B',buts:'élevés',resultat:'avantage B',couleur:'🟦'},
    10: {force:'climat favorable',faiblesse:'relâchement',impact:'public/arbitrage favorable',buts:'indirect',resultat:'avantage',couleur:'🟦'},
    11: {force:'concrétisation',faiblesse:'excès',impact:'A transforme ses occasions',buts:'élevés',resultat:'victoire A',couleur:'🟦'},
    12: {force:'récupération',faiblesse:'relâchement',impact:'pertes limitées',buts:'modérés',resultat:'avantage A',couleur:'🟦'},
    13: {force:'enthousiasme collectif',faiblesse:'déséquilibre',impact:'collectif offensif',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    14: {force:'enthousiasme B',faiblesse:'déséquilibre',impact:'B offensif',buts:'élevés',resultat:'victoire B possible',couleur:'🟦'},
    15: {force:'expansion',faiblesse:'excès',impact:'progression',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    16: {force:'réussite',faiblesse:'excès de confiance',impact:'thème très favorable',buts:'élevés',resultat:'victoire',couleur:'🟦'},
  }},
  caput_draconis: { nature:'FO', maisons:{
    1: {force:'naissance/initiative',faiblesse:'précipitation',impact:'A démarre fort',buts:'élevés',resultat:'victoire A possible',couleur:'🟦'},
    2: {force:'nouvelle ressource',faiblesse:'inexpérience',impact:'A gagne un moyen',buts:'modérés/élevés',resultat:'avantage A',couleur:'🟦'},
    3: {force:'lancement',faiblesse:'précipitation',impact:'jeu A démarre fort',buts:'élevés',resultat:'avantage A',couleur:'🟦'},
    4: {force:'nouveau cycle',faiblesse:'instabilité initiale',impact:'fin dépendante du départ',buts:'élevés',resultat:'victoire/bascule',couleur:'🟦'},
    5: {force:'déclenchement',faiblesse:'précipitation',impact:'but précoce possible',buts:'élevés',resultat:'avantage',couleur:'🟦'},
    6: {force:'initiative',faiblesse:'enthousiasme excessif',impact:'fautes initiales',buts:'indirect',resultat:'variable',couleur:'🟧'},
    7: {force:'départ B',faiblesse:'précipitation',impact:'B démarre fort',buts:'élevés',resultat:'avantage B',couleur:'🟦'},
    8: {force:'événement déclencheur',faiblesse:'excès',impact:'incident pouvant changer le match',buts:'élevés',resultat:'bascule',couleur:'🟧'},
    9: {force:'lancement B',faiblesse:'précipitation',impact:'B démarre fort',buts:'élevés',resultat:'avantage B',couleur:'🟦'},
    10: {force:'décision initiale',faiblesse:'précipitation',impact:'arbitrage influent',buts:'indirect',resultat:'variable',couleur:'🟧'},
    11: {force:'initiative A',faiblesse:'précipitation',impact:'A concrétise tôt',buts:'élevés',resultat:'victoire A',couleur:'🟦'},
    12: {force:'nouveau départ',faiblesse:'erreur de jeunesse',impact:'pertes initiales possibles',buts:'occasions concédées',resultat:'variable',couleur:'🟧'},
    13: {force:'lancement collectif',faiblesse:'précipitation',impact:'équipe se projette',buts:'élevés',resultat:'avantage',couleur:'🟦'},
    14: {force:'lancement B',faiblesse:'précipitation',impact:'B se projette',buts:'élevés',resultat:'avantage B',couleur:'🟦'},
    15: {force:'ascension',faiblesse:'démarrage irrégulier',impact:'progression',buts:'élevés',resultat:'victoire/bascule',couleur:'🟦'},
    16: {force:'ouverture',faiblesse:'précipitation',impact:'thème de commencement',buts:'élevés',resultat:'victoire / but précoce',couleur:'🟦'},
  }},
  albus: { nature:'fO', maisons:{
    1: {force:'intelligence',faiblesse:'lenteur',impact:'A maîtrise',buts:'modérés',resultat:'nul/victoire technique',couleur:'🟦'},
    2: {force:'gestion',faiblesse:'prudence excessive',impact:'ressources bien utilisées',buts:'modérés',resultat:'stable',couleur:'🟦'},
    3: {force:'organisation',faiblesse:'lenteur',impact:'jeu réfléchi',buts:'modérés',resultat:'nul/victoire technique',couleur:'🟦'},
    4: {force:'calme',faiblesse:'absence de rupture',impact:'fin posée',buts:'faibles à modérés',resultat:'nul',couleur:'🟦'},
    5: {force:'précision',faiblesse:'faible volume',impact:'occasions choisies',buts:'modérés',resultat:'score serré',couleur:'🟦'},
    6: {force:'maîtrise',faiblesse:'évitement',impact:'peu de fautes',buts:'indirect',resultat:'stable',couleur:'🟦'},
    7: {force:'intelligence B',faiblesse:'lenteur',impact:'B maîtrise',buts:'modérés',resultat:'nul/victoire technique',couleur:'🟦'},
    8: {force:'calme',faiblesse:'réaction tardive',impact:'incidents contrôlés',buts:'faibles',resultat:'stable',couleur:'🟦'},
    9: {force:'organisation B',faiblesse:'lenteur',impact:'jeu réfléchi',buts:'modérés',resultat:'nul/victoire technique',couleur:'🟦'},
    10: {force:'rationalité',faiblesse:'rigidité',impact:'arbitrage équilibré',buts:'indirect',resultat:'équilibré',couleur:'🟦'},
    11: {force:'précision A',faiblesse:'lenteur',impact:'A concrétise peu mais proprement',buts:'modérés',resultat:'avantage technique',couleur:'🟦'},
    12: {force:'conservation',faiblesse:'prudence',impact:'peu de pertes',buts:'faible',resultat:'stable',couleur:'🟦'},
    13: {force:'organisation',faiblesse:'manque de spontanéité',impact:'collectif structuré',buts:'modérés',resultat:'stable',couleur:'🟦'},
    14: {force:'organisation B',faiblesse:'lenteur',impact:'collectif B structuré',buts:'modérés',resultat:'stable',couleur:'🟦'},
    15: {force:'stabilisation',faiblesse:'lenteur',impact:'évolution progressive',buts:'modérés',resultat:'stable',couleur:'🟦'},
    16: {force:'clarté',faiblesse:'lenteur',impact:'thème maîtrisé',buts:'faibles/modérés',resultat:'nul ou victoire technique',couleur:'🟦'},
  }},
  via: { nature:'fO', maisons:{
    1: {force:'mobilité',faiblesse:'instabilité',impact:'A change de rythme',buts:'occasions irrégulières',resultat:'nul/bascule',couleur:'🟧'},
    2: {force:'adaptation',faiblesse:'ressources fluctuantes',impact:'A s\'adapte',buts:'potentiel variable',resultat:'avantage léger A',couleur:'🟧'},
    3: {force:'circulation',faiblesse:'manque de stabilité',impact:'jeu mobile',buts:'occasions variables',resultat:'nul/bascule',couleur:'🟧'},
    4: {force:'changement',faiblesse:'incertitude',impact:'résultat difficile à fixer',buts:'variables',resultat:'nul/bascule',couleur:'🟧'},
    5: {force:'mouvement',faiblesse:'irrégularité',impact:'occasions alternées',buts:'irréguliers',resultat:'score serré',couleur:'🟧'},
    6: {force:'adaptation',faiblesse:'réactions variables',impact:'fautes fluctuantes',buts:'indirect',resultat:'neutre',couleur:'🟨'},
    7: {force:'mobilité B',faiblesse:'instabilité',impact:'B change de rythme',buts:'occasions irrégulières',resultat:'nul/bascule',couleur:'🟧'},
    8: {force:'changement soudain',faiblesse:'imprévisibilité',impact:'incident possible',buts:'occasion créée',resultat:'bascule',couleur:'🟧'},
    9: {force:'circulation',faiblesse:'instabilité',impact:'jeu mobile B',buts:'variables',resultat:'nul/bascule',couleur:'🟧'},
    10: {force:'adaptation',faiblesse:'décision variable',impact:'arbitrage changeant',buts:'indirect',resultat:'équilibré',couleur:'🟨'},
    11: {force:'mouvement',faiblesse:'manque de fixation',impact:'A peut créer mais difficile à stabiliser',buts:'occasion variable',resultat:'avantage temporaire A',couleur:'🟧'},
    12: {force:'récupération',faiblesse:'pertes de balle',impact:'A peut perdre son avantage',buts:'occasions abandonnées',resultat:'risque de nul',couleur:'🟥'},
    13: {force:'adaptation',faiblesse:'manque de structure',impact:'collectif mobile',buts:'variables',resultat:'nul/bascule',couleur:'🟧'},
    14: {force:'adaptation B',faiblesse:'dispersion',impact:'collectif variable',buts:'variables',resultat:'nul/bascule',couleur:'🟧'},
    15: {force:'transformation',faiblesse:'instabilité',impact:'match évolutif',buts:'possibles tardivement',resultat:'bascule',couleur:'🟧'},
    16: {force:'mouvement',faiblesse:'imprévisibilité',impact:'thème évolutif',buts:'variables',resultat:'Nul ou bascule',couleur:'🟧'},
  }},
  amissio: { nature:'fF', maisons:{
    1: {force:'capacité de sacrifice',faiblesse:'perte',impact:'A perd du contrôle',buts:'bas',resultat:'défaite A',couleur:'🟥'},
    2: {force:'détachement',faiblesse:'pertes',impact:'ressources A diminuent',buts:'bas',resultat:'désavantage A',couleur:'🟥'},
    3: {force:'libération',faiblesse:'dispersion',impact:'possession perdue',buts:'bas/irréguliers',resultat:'défaite/nul',couleur:'🟥'},
    4: {force:'clôture',faiblesse:'perte',impact:'fin défavorable',buts:'bas',resultat:'défaite',couleur:'🟥'},
    5: {force:'occasions abandonnées',faiblesse:'inefficacité',impact:'occasions perdues',buts:'faibles',resultat:'défaite/nul',couleur:'🟥'},
    6: {force:'détachement',faiblesse:'frustration',impact:'fautes de frustration',buts:'indirect',resultat:'défavorable',couleur:'🟥'},
    7: {force:'perte B',faiblesse:'dispersion',impact:'B perd ses moyens',buts:'bas',resultat:'avantage A possible',couleur:'🟥'},
    8: {force:'libération',faiblesse:'perte brutale',impact:'incident',buts:'occasion de bascule',resultat:'retournement',couleur:'🟥'},
    9: {force:'relâchement',faiblesse:'dispersion',impact:'B perd la possession',buts:'bas',resultat:'avantage A',couleur:'🟥'},
    10: {force:'détachement',faiblesse:'décision perdue',impact:'arbitrage défavorable',buts:'indirect',resultat:'bascule',couleur:'🟥'},
    11: {force:'sacrifice',faiblesse:'concrétisation perdue',impact:'A gaspille',buts:'bas',resultat:'défaite/nul',couleur:'🟥'},
    12: {force:'libération',faiblesse:'perte',impact:'pertes A très fortes',buts:'occasions concédées',resultat:'avantage B',couleur:'🟥'},
    13: {force:'détachement',faiblesse:'désunion',impact:'collectif dispersé',buts:'bas',resultat:'défavorable',couleur:'🟥'},
    14: {force:'perte B',faiblesse:'dispersion',impact:'B se désunit',buts:'bas',resultat:'avantage A',couleur:'🟥'},
    15: {force:'changement',faiblesse:'régression',impact:'déclin',buts:'bas',resultat:'défavorable',couleur:'🟥'},
    16: {force:'libération',faiblesse:'perte',impact:'thème de diminution',buts:'bas',resultat:'défaite / nul',couleur:'🟥'},
  }},
  rubeus: { nature:'FF', maisons:{
    1: {force:'intensité',faiblesse:'chaos',impact:'A très agressive',buts:'élevés',resultat:'victoire risquée/bascule',couleur:'🟥'},
    2: {force:'énergie',faiblesse:'gaspillage',impact:'ressources consommées',buts:'élevés',resultat:'instable',couleur:'🟥'},
    3: {force:'percussion',faiblesse:'désordre',impact:'attaque anarchique',buts:'élevés',resultat:'match ouvert',couleur:'🟥'},
    4: {force:'explosivité',faiblesse:'perte de contrôle',impact:'fin explosive',buts:'élevés',resultat:'bascule',couleur:'🟥'},
    5: {force:'puissance offensive',faiblesse:'précipitation',impact:'énorme pression',buts:'élevés',resultat:'match ouvert',couleur:'🟥'},
    6: {force:'agressivité',faiblesse:'violence',impact:'cartons élevés',buts:'indirect',resultat:'risque rouge',couleur:'🟥'},
    7: {force:'intensité B',faiblesse:'chaos',impact:'B agressive',buts:'élevés',resultat:'victoire B risquée',couleur:'🟥'},
    8: {force:'explosion',faiblesse:'danger',impact:'penalty/expulsion possible',buts:'élevés',resultat:'bascule majeure',couleur:'🟥'},
    9: {force:'percussion B',faiblesse:'désordre',impact:'attaque anarchique',buts:'élevés',resultat:'ouvert',couleur:'🟥'},
    10: {force:'pression',faiblesse:'conflit',impact:'arbitrage très sollicité',buts:'indirect',resultat:'sanction possible',couleur:'🟥'},
    11: {force:'initiative',faiblesse:'précipitation',impact:'A crée beaucoup',buts:'élevés',resultat:'victoire A possible',couleur:'🟥'},
    12: {force:'réaction',faiblesse:'erreurs',impact:'pertes dangereuses',buts:'occasions B',resultat:'danger A',couleur:'🟥'},
    13: {force:'intensité collective',faiblesse:'chaos',impact:'match très ouvert',buts:'élevés',resultat:'bascule',couleur:'🟥'},
    14: {force:'intensité B',faiblesse:'chaos',impact:'B attaque',buts:'élevés',resultat:'bascule',couleur:'🟥'},
    15: {force:'rupture',faiblesse:'instabilité',impact:'retournement',buts:'élevés',resultat:'bascule',couleur:'🟥'},
    16: {force:'explosion',faiblesse:'danger',impact:'thème extrêmement tendu',buts:'élevés',resultat:'bascule / victoire risquée',couleur:'🟥'},
  }},
  tristitia: { nature:'FF', maisons:{
    1: {force:'résistance',faiblesse:'lourdeur',impact:'A manque d\'initiative',buts:'bas',resultat:'nul/défaite A',couleur:'🟥'},
    2: {force:'prudence',faiblesse:'manque de ressources',impact:'A limité',buts:'bas',resultat:'désavantage A',couleur:'🟥'},
    3: {force:'patience',faiblesse:'blocage',impact:'construction lente',buts:'bas',resultat:'nul',couleur:'🟥'},
    4: {force:'fermeture',faiblesse:'pessimisme',impact:'fin difficile',buts:'bas',resultat:'nul/défaite',couleur:'🟥'},
    5: {force:'résistance défensive',faiblesse:'stérilité offensive',impact:'peu d\'occasions',buts:'faibles',resultat:'nul',couleur:'🟥'},
    6: {force:'retenue',faiblesse:'frustration',impact:'cartons possibles',buts:'indirect',resultat:'tension',couleur:'🟥'},
    7: {force:'résistance B',faiblesse:'faiblesse',impact:'B limité',buts:'bas',resultat:'nul/défaite B',couleur:'🟥'},
    8: {force:'blocage',faiblesse:'événement négatif',impact:'incident possible',buts:'faible',resultat:'bascule défavorable',couleur:'🟥'},
    9: {force:'patience',faiblesse:'blocage',impact:'B construit lentement',buts:'bas',resultat:'nul',couleur:'🟥'},
    10: {force:'prudence',faiblesse:'pessimisme',impact:'arbitrage strict',buts:'bas',resultat:'fermé',couleur:'🟥'},
    11: {force:'résistance',faiblesse:'finition insuffisante',impact:'A peine à concrétiser',buts:'bas',resultat:'nul/défaite A',couleur:'🟥'},
    12: {force:'conservation',faiblesse:'pertes sous pression',impact:'erreurs A',buts:'occasions concédées',resultat:'B possible',couleur:'🟥'},
    13: {force:'discipline',faiblesse:'manque de créativité',impact:'collectif fermé',buts:'bas',resultat:'nul',couleur:'🟥'},
    14: {force:'discipline B',faiblesse:'manque de créativité',impact:'B fermé',buts:'bas',resultat:'nul',couleur:'🟥'},
    15: {force:'stabilité',faiblesse:'déclin',impact:'évolution négative',buts:'bas',resultat:'nul/défaite',couleur:'🟥'},
    16: {force:'résistance',faiblesse:'blocage',impact:'thème fermé',buts:'faibles',resultat:'nul ou défaite',couleur:'🟥'},
  }},
  fortuna_minor: { nature:'fO', maisons:{
    1: {force:'réussite ponctuelle',faiblesse:'instabilité',impact:'A domine momentanément',buts:'modérés/élevés',resultat:'avantage temporaire A',couleur:'🟧'},
    2: {force:'gain ponctuel',faiblesse:'perte rapide',impact:'ressources momentanées',buts:'modérés',resultat:'avantage temporaire',couleur:'🟧'},
    3: {force:'accélération',faiblesse:'irrégularité',impact:'bon passage',buts:'modérés/élevés',resultat:'bascule',couleur:'🟧'},
    4: {force:'succès court',faiblesse:'non-durabilité',impact:'résultat peut changer',buts:'variables',resultat:'nul/bascule',couleur:'🟧'},
    5: {force:'occasion ponctuelle',faiblesse:'irrégularité',impact:'but possible',buts:'modérés/élevés',resultat:'avantage temporaire',couleur:'🟧'},
    6: {force:'intensité ponctuelle',faiblesse:'irrégularité',impact:'faute/carton possible',buts:'indirect',resultat:'variable',couleur:'🟧'},
    7: {force:'succès B temporaire',faiblesse:'instabilité',impact:'B prend un passage',buts:'modérés',resultat:'avantage B temporaire',couleur:'🟧'},
    8: {force:'événement soudain',faiblesse:'instabilité',impact:'incident ponctuel',buts:'possible',resultat:'bascule',couleur:'🟧'},
    9: {force:'bon passage B',faiblesse:'durée limitée',impact:'B accélère',buts:'modérés/élevés',resultat:'avantage temporaire',couleur:'🟧'},
    10: {force:'décision ponctuelle',faiblesse:'fluctuation',impact:'arbitrage momentané',buts:'indirect',resultat:'variable',couleur:'🟧'},
    11: {force:'concrétisation rapide',faiblesse:'courte durée',impact:'A peut marquer',buts:'élevés ponctuellement',resultat:'avantage A',couleur:'🟧'},
    12: {force:'récupération ponctuelle',faiblesse:'perte rapide',impact:'A peut rendre son avantage',buts:'variable',resultat:'instable',couleur:'🟧'},
    13: {force:'cohésion ponctuelle',faiblesse:'instabilité',impact:'bon passage collectif',buts:'modérés',resultat:'bascule',couleur:'🟧'},
    14: {force:'cohésion B ponctuelle',faiblesse:'instabilité',impact:'bon passage B',buts:'modérés',resultat:'bascule',couleur:'🟧'},
    15: {force:'accélération',faiblesse:'retournement',impact:'évolution rapide',buts:'variables',resultat:'bascule',couleur:'🟧'},
    16: {force:'réussite momentanée',faiblesse:'instabilité',impact:'avantage non garanti',buts:'modérés',resultat:'bascule/nul',couleur:'🟧'},
  }},
  carcer: { nature:'FF', maisons:{
    1: {force:'défense',faiblesse:'enfermement',impact:'A bloque le jeu',buts:'bas',resultat:'nul/défaite',couleur:'🟥'},
    2: {force:'conservation',faiblesse:'ressources limitées',impact:'A joue avec peu',buts:'bas',resultat:'nul',couleur:'🟥'},
    3: {force:'structure',faiblesse:'rigidité',impact:'jeu fermé',buts:'bas',resultat:'nul',couleur:'🟥'},
    4: {force:'verrouillage',faiblesse:'absence de solution',impact:'fin fermée',buts:'bas',resultat:'nul',couleur:'🟥'},
    5: {force:'verrou défensif',faiblesse:'stérilité',impact:'buts difficiles',buts:'très faibles',resultat:'nul',couleur:'🟥'},
    6: {force:'discipline',faiblesse:'rigidité',impact:'fautes limitées mais physiques',buts:'indirect',resultat:'fermé',couleur:'🟥'},
    7: {force:'défense B',faiblesse:'enfermement',impact:'B bloque',buts:'bas',resultat:'nul/défaite',couleur:'🟥'},
    8: {force:'verrouillage',faiblesse:'incident bloqué',impact:'peu d\'incidents',buts:'bas',resultat:'nul',couleur:'🟥'},
    9: {force:'structure B',faiblesse:'rigidité',impact:'B fermé',buts:'bas',resultat:'nul',couleur:'🟥'},
    10: {force:'autorité',faiblesse:'rigidité',impact:'arbitrage strict',buts:'bas',resultat:'fermé',couleur:'🟥'},
    11: {force:'protection A',faiblesse:'finition bloquée',impact:'A conserve mais marque peu',buts:'bas',resultat:'nul',couleur:'🟥'},
    12: {force:'conservation',faiblesse:'blocage',impact:'peu de pertes mais peu de progression',buts:'bas',resultat:'nul',couleur:'🟥'},
    13: {force:'structure',faiblesse:'rigidité',impact:'collectif fermé',buts:'bas',resultat:'nul',couleur:'🟥'},
    14: {force:'structure B',faiblesse:'rigidité',impact:'collectif B fermé',buts:'bas',resultat:'nul',couleur:'🟥'},
    15: {force:'stabilité',faiblesse:'immobilité',impact:'match figé',buts:'bas',resultat:'nul',couleur:'🟥'},
    16: {force:'verrou',faiblesse:'blocage',impact:'thème fermé',buts:'très faibles',resultat:'NUL',couleur:'🟥'},
  }},
  conjunctio: { nature:'fO', maisons:{
    1: {force:'connexion',faiblesse:'dépendance',impact:'A profite du collectif',buts:'modérés',resultat:'nul/bascule',couleur:'🟨'},
    2: {force:'échanges',faiblesse:'dépendance',impact:'ressources partagées',buts:'modérés',resultat:'équilibré',couleur:'🟨'},
    3: {force:'combinaisons',faiblesse:'dépendance',impact:'jeu collectif',buts:'modérés',resultat:'nul/bascule',couleur:'🟨'},
    4: {force:'liaison',faiblesse:'indécision',impact:'résultat lié aux deux équipes',buts:'modérés',resultat:'nul/bascule',couleur:'🟨'},
    5: {force:'combinaison offensive',faiblesse:'manque d\'individualité',impact:'but collectif possible',buts:'modérés',resultat:'nul/bascule',couleur:'🟨'},
    6: {force:'coordination',faiblesse:'fautes collectives',impact:'fautes partagées',buts:'indirect',resultat:'équilibré',couleur:'🟨'},
    7: {force:'connexion B',faiblesse:'dépendance',impact:'B collectif',buts:'modérés',resultat:'nul/bascule',couleur:'🟨'},
    8: {force:'événement lié',faiblesse:'réaction collective',impact:'incident influencé par le contexte',buts:'modérés',resultat:'bascule',couleur:'🟨'},
    9: {force:'combinaisons B',faiblesse:'dépendance',impact:'B collectif',buts:'modérés',resultat:'nul/bascule',couleur:'🟨'},
    10: {force:'influence',faiblesse:'dépendance',impact:'arbitrage influent',buts:'indirect',resultat:'variable',couleur:'🟨'},
    11: {force:'combinaison A',faiblesse:'dépendance',impact:'A concrétise par le collectif',buts:'modérés',resultat:'avantage A possible',couleur:'🟨'},
    12: {force:'partage',faiblesse:'pertes collectives',impact:'erreurs partagées',buts:'modérés',resultat:'équilibré',couleur:'🟨'},
    13: {force:'union',faiblesse:'dépendance',impact:'collectif connecté',buts:'modérés',resultat:'nul/bascule',couleur:'🟨'},
    14: {force:'union B',faiblesse:'dépendance',impact:'collectif B connecté',buts:'modérés',resultat:'nul/bascule',couleur:'🟨'},
    15: {force:'transition',faiblesse:'indécision',impact:'évolution par interaction',buts:'modérés',resultat:'bascule',couleur:'🟨'},
    16: {force:'rencontre',faiblesse:'dépendance',impact:'les forces se combinent',buts:'modérés',resultat:'nul ou bascule',couleur:'🟨'},
  }},
  fortuna_major: { nature:'FO', maisons:{
    1: {force:'puissance maximale',faiblesse:'excès de confiance',impact:'domination A',buts:'élevés',resultat:'victoire A forte',couleur:'🟦'},
    2: {force:'ressources solides',faiblesse:'rigidité',impact:'A dispose de moyens',buts:'élevés',resultat:'avantage A',couleur:'🟦'},
    3: {force:'maîtrise',faiblesse:'excès de confiance',impact:'A contrôle le jeu',buts:'élevés',resultat:'victoire A',couleur:'🟦'},
    4: {force:'accomplissement',faiblesse:'relâchement final',impact:'fin favorable',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    5: {force:'puissance offensive',faiblesse:'excès',impact:'domination offensive',buts:'très élevés',resultat:'victoire',couleur:'🟦'},
    6: {force:'maîtrise',faiblesse:'confiance excessive',impact:'fautes contrôlées',buts:'indirect',resultat:'favorable',couleur:'🟦'},
    7: {force:'puissance B',faiblesse:'excès',impact:'domination B',buts:'élevés',resultat:'victoire B',couleur:'🟦'},
    8: {force:'contrôle',faiblesse:'excès',impact:'incident maîtrisé',buts:'potentiel élevé',resultat:'avantage de la partie forte',couleur:'🟦'},
    9: {force:'maîtrise B',faiblesse:'excès',impact:'B contrôle',buts:'élevés',resultat:'victoire B',couleur:'🟦'},
    10: {force:'autorité',faiblesse:'rigidité',impact:'arbitrage/public favorable',buts:'indirect',resultat:'avantage',couleur:'🟦'},
    11: {force:'concrétisation maximale',faiblesse:'relâchement',impact:'A finit ses actions',buts:'très élevés',resultat:'victoire A',couleur:'🟦'},
    12: {force:'protection',faiblesse:'confiance excessive',impact:'pertes faibles',buts:'modérés',resultat:'avantage A',couleur:'🟦'},
    13: {force:'domination collective',faiblesse:'rigidité',impact:'collectif supérieur',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    14: {force:'domination B',faiblesse:'rigidité',impact:'B supérieur',buts:'élevés',resultat:'victoire B',couleur:'🟦'},
    15: {force:'consolidation',faiblesse:'excès',impact:'progression forte',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    16: {force:'réussite maximale',faiblesse:'surconfiance',impact:'thème extrêmement favorable',buts:'élevés',resultat:'victoire forte',couleur:'🟦'},
  }},
  cauda_draconis: { nature:'fF', maisons:{
    1: {force:'capacité de clôture',faiblesse:'déclin',impact:'A perd progressivement',buts:'bas/tardifs',resultat:'défaite possible',couleur:'🟥'},
    2: {force:'liquidation',faiblesse:'ressources en baisse',impact:'A s\'épuise',buts:'bas',resultat:'désavantage',couleur:'🟥'},
    3: {force:'fin d\'une phase',faiblesse:'rupture',impact:'jeu A s\'éteint',buts:'bas',resultat:'déclin',couleur:'🟥'},
    4: {force:'clôture',faiblesse:'brutalité',impact:'fin décisive',buts:'but tardif possible',resultat:'retournement',couleur:'🟥'},
    5: {force:'conclusion',faiblesse:'manque de continuité',impact:'but tardif possible',buts:'faibles/tardifs',resultat:'bascule tardive',couleur:'🟥'},
    6: {force:'fin de tension',faiblesse:'sanction',impact:'carton tardif possible',buts:'indirect',resultat:'risque',couleur:'🟥'},
    7: {force:'déclin B',faiblesse:'rupture',impact:'B s\'éteint',buts:'bas',resultat:'avantage A possible',couleur:'🟥'},
    8: {force:'rupture',faiblesse:'brutalité',impact:'incident soudain',buts:'but/penalty tardif possible',resultat:'retournement',couleur:'🟥'},
    9: {force:'fin de phase',faiblesse:'rupture',impact:'B s\'éteint',buts:'bas',resultat:'déclin B',couleur:'🟥'},
    10: {force:'décision finale',faiblesse:'sanction',impact:'décision tardive',buts:'indirect',resultat:'retournement',couleur:'🟥'},
    11: {force:'conclusion A',faiblesse:'occasion perdue',impact:'A peut conclure tardivement',buts:'tardifs',resultat:'bascule',couleur:'🟥'},
    12: {force:'élimination',faiblesse:'pertes',impact:'A abandonne des ressources',buts:'faibles',resultat:'avantage B',couleur:'🟥'},
    13: {force:'fin collective',faiblesse:'rupture',impact:'collectif se désunit',buts:'bas',resultat:'défavorable',couleur:'🟥'},
    14: {force:'fin B',faiblesse:'rupture',impact:'collectif B s\'éteint',buts:'bas',resultat:'avantage A',couleur:'🟥'},
    15: {force:'transformation',faiblesse:'déclin',impact:'changement de cycle',buts:'tardifs',resultat:'retournement',couleur:'🟥'},
    16: {force:'clôture',faiblesse:'rupture',impact:'thème terminal',buts:'tardifs/faibles',resultat:'défaite / retournement',couleur:'🟥'},
  }},
  puella: { nature:'fF', maisons:{
    1: {force:'harmonie',faiblesse:'passivité',impact:'A joue proprement',buts:'modérés',resultat:'nul/victoire courte',couleur:'🟦'},
    2: {force:'bonne gestion',faiblesse:'dépendance',impact:'ressources équilibrées',buts:'modérés',resultat:'avantage léger A',couleur:'🟦'},
    3: {force:'technique',faiblesse:'manque d\'agressivité',impact:'jeu fluide',buts:'modérés',resultat:'nul/victoire courte',couleur:'🟦'},
    4: {force:'harmonie',faiblesse:'manque de rupture',impact:'fin calme',buts:'peu nombreux',resultat:'nul/victoire courte',couleur:'🟦'},
    5: {force:'construction',faiblesse:'manque de percussion',impact:'occasions travaillées',buts:'modérés',resultat:'score serré',couleur:'🟦'},
    6: {force:'maîtrise',faiblesse:'évitement du duel',impact:'peu de fautes',buts:'indirect',resultat:'stable',couleur:'🟦'},
    7: {force:'harmonie B',faiblesse:'passivité',impact:'B joue proprement',buts:'modérés',resultat:'nul/victoire courte',couleur:'🟦'},
    8: {force:'maîtrise',faiblesse:'faible réaction',impact:'incident généralement contrôlé',buts:'faible impact',resultat:'stable',couleur:'🟦'},
    9: {force:'technique B',faiblesse:'manque de percussion',impact:'jeu fluide',buts:'modérés',resultat:'nul/victoire courte',couleur:'🟦'},
    10: {force:'équilibre',faiblesse:'influence limitée',impact:'arbitrage harmonieux',buts:'indirect',resultat:'équilibré',couleur:'🟦'},
    11: {force:'coopération A',faiblesse:'manque de finition',impact:'A construit',buts:'modérés',resultat:'victoire courte possible',couleur:'🟦'},
    12: {force:'conservation',faiblesse:'passivité',impact:'peu de pertes',buts:'peu d\'occasions concédées',resultat:'stable',couleur:'🟦'},
    13: {force:'harmonie',faiblesse:'dépendance',impact:'collectif coordonné',buts:'modérés',resultat:'nul/victoire courte',couleur:'🟦'},
    14: {force:'harmonie B',faiblesse:'passivité',impact:'collectif B coordonné',buts:'modérés',resultat:'nul/victoire courte',couleur:'🟦'},
    15: {force:'stabilisation',faiblesse:'lenteur',impact:'évolution progressive',buts:'modérés',resultat:'stable',couleur:'🟦'},
    16: {force:'harmonie',faiblesse:'manque d\'initiative',impact:'thème équilibré',buts:'modérés',resultat:'nul ou victoire courte',couleur:'🟦'},
  }},
  acquisitio: { nature:'FO', maisons:{
    1: {force:'croissance',faiblesse:'surconfiance',impact:'A progresse',buts:'élevés',resultat:'victoire A',couleur:'🟦'},
    2: {force:'gains',faiblesse:'excès',impact:'ressources A fortes',buts:'élevés',resultat:'avantage A',couleur:'🟦'},
    3: {force:'productivité',faiblesse:'prise de risque',impact:'jeu efficace',buts:'élevés',resultat:'victoire A',couleur:'🟦'},
    4: {force:'réussite',faiblesse:'excès',impact:'aboutissement favorable',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    5: {force:'concrétisation',faiblesse:'gaspillage',impact:'nombreuses occasions',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    6: {force:'contrôle',faiblesse:'excès de confiance',impact:'fautes modérées',buts:'indirect',resultat:'favorable',couleur:'🟦'},
    7: {force:'croissance B',faiblesse:'surconfiance',impact:'B progresse',buts:'élevés',resultat:'victoire B',couleur:'🟦'},
    8: {force:'opportunité',faiblesse:'excès',impact:'événement favorable',buts:'élevés',resultat:'bascule',couleur:'🟦'},
    9: {force:'productivité B',faiblesse:'risque',impact:'B efficace',buts:'élevés',resultat:'victoire B',couleur:'🟦'},
    10: {force:'gain d\'influence',faiblesse:'excès',impact:'décision favorable',buts:'indirect',resultat:'avantage',couleur:'🟦'},
    11: {force:'concrétisation A',faiblesse:'surconfiance',impact:'A transforme ses occasions',buts:'élevés',resultat:'victoire A',couleur:'🟦'},
    12: {force:'récupération',faiblesse:'gaspillage',impact:'pertes limitées',buts:'modérés',resultat:'avantage A',couleur:'🟦'},
    13: {force:'croissance collective',faiblesse:'individualisme',impact:'collectif productif',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    14: {force:'croissance B',faiblesse:'individualisme',impact:'B productif',buts:'élevés',resultat:'victoire B possible',couleur:'🟦'},
    15: {force:'expansion',faiblesse:'excès',impact:'progression',buts:'élevés',resultat:'victoire',couleur:'🟦'},
    16: {force:'acquisition',faiblesse:'surconfiance',impact:'thème très favorable',buts:'élevés',resultat:'victoire',couleur:'🟦'},
  }},
  populus: { nature:'fF', maisons:{
    1: {force:'collectif',faiblesse:'dilution individuelle',impact:'A dépend du groupe',buts:'modérés',resultat:'nul',couleur:'🟪'},
    2: {force:'ressources partagées',faiblesse:'dilution',impact:'moyens équilibrés',buts:'modérés',resultat:'nul',couleur:'🟪'},
    3: {force:'circulation collective',faiblesse:'manque d\'individualité',impact:'jeu collectif',buts:'modérés',resultat:'nul',couleur:'🟪'},
    4: {force:'équilibre',faiblesse:'absence de séparation',impact:'résultat partagé',buts:'faibles/modérés',resultat:'nul',couleur:'🟪'},
    5: {force:'production collective',faiblesse:'manque de finisseur',impact:'occasions partagées',buts:'modérés',resultat:'nul',couleur:'🟪'},
    6: {force:'discipline collective',faiblesse:'fautes de groupe',impact:'fautes partagées',buts:'indirect',resultat:'équilibré',couleur:'🟪'},
    7: {force:'collectif B',faiblesse:'dilution individuelle',impact:'B dépend du groupe',buts:'modérés',resultat:'nul',couleur:'🟪'},
    8: {force:'événement collectif',faiblesse:'réaction collective',impact:'incident partagé',buts:'modérés',resultat:'nul/bascule',couleur:'🟪'},
    9: {force:'circulation B',faiblesse:'manque d\'individualité',impact:'jeu collectif B',buts:'modérés',resultat:'nul',couleur:'🟪'},
    10: {force:'influence collective',faiblesse:'neutralisation',impact:'public/arbitrage équilibré',buts:'indirect',resultat:'nul',couleur:'🟪'},
    11: {force:'concrétisation collective',faiblesse:'dilution',impact:'A dépend du collectif',buts:'modérés',resultat:'nul',couleur:'🟪'},
    12: {force:'pertes partagées',faiblesse:'absence de responsable',impact:'erreurs collectives',buts:'modérés',resultat:'équilibré',couleur:'🟪'},
    13: {force:'collectif maximal',faiblesse:'individualité faible',impact:'équipe unie',buts:'modérés',resultat:'nul',couleur:'🟪'},
    14: {force:'collectif B maximal',faiblesse:'individualité faible',impact:'B uni',buts:'modérés',resultat:'nul',couleur:'🟪'},
    15: {force:'répétition',faiblesse:'stagnation',impact:'évolution limitée',buts:'modérés',resultat:'nul',couleur:'🟪'},
    16: {force:'équilibre collectif',faiblesse:'dilution',impact:'synthèse neutre',buts:'faibles/modérés',resultat:'NUL',couleur:'🟪'},
  }},
};

// Retourne l'interprétation football complète pour une figure en une maison.
function getInterpretationFootball(fig, maison) {
  const entry = INTERPRETATIONS_FOOTBALL_V7[fig];
  if (!entry || !entry.maisons[maison]) return null;
  return Object.assign({ figure: fig, maison: maison, nature: entry.nature }, entry.maisons[maison]);
}

// Construit le tableau complet des 16 interprétations pour un thème donné
// (une par maison, selon la figure qui y est présente).
function getInterpretationsTheme(theme) {
  const out = [];
  for (let m = 1; m <= 16; m++) {
    const interp = getInterpretationFootball(theme[m], m);
    if (interp) out.push(interp);
  }
  return out;
}

// Rendu HTML d'une carte d'interprétation pour une maison donnée.
function renderInterpretationCard(interp) {
  if (!interp) return '';
  return '<div style="border:1px solid var(--gold,#C7A143); border-radius:8px; padding:8px 10px; margin-bottom:6px; font-size:12px; line-height:1.6;">'
    + '<div style="display:flex; justify-content:space-between; align-items:center;"><b>M'+interp.maison+' — '+FL[interp.figure]+'</b><span>'+interp.couleur+'</span></div>'
    + '<div><span style="color:#94a3b8;">Force :</span> '+interp.force+' &nbsp;·&nbsp; <span style="color:#94a3b8;">Faiblesse :</span> '+interp.faiblesse+'</div>'
    + '<div><span style="color:#94a3b8;">Impact :</span> '+interp.impact+'</div>'
    + '<div><span style="color:#94a3b8;">Buts :</span> '+interp.buts+' &nbsp;·&nbsp; <span style="color:#94a3b8;">Résultat :</span> '+interp.resultat+'</div>'
    + '</div>';
}

// Panneau complet : les 16 interprétations du thème actif, affichées ensemble.
function renderInterpretationsPanel(theme) {
  const el = document.getElementById('interpretations-football-panel');
  if (!el || !theme) return;
  const interps = getInterpretationsTheme(theme);
  let html = '<h3 style="margin-bottom:2px;">📖 Interprétations football (256 cases)</h3>';
  html += '<div class="muted" style="font-size:11px; margin-bottom:10px;">Lecture textuelle par maison — force, faiblesse, impact, buts, tendance de résultat. Depuis le 05/08/26, la couleur de chaque case est convertie en score et pèse sur verdictFinal via l\'environnement de R1/R7 (voir scoreEnvironnementInterpretation).</div>';
  interps.forEach(function(interp){ html += renderInterpretationCard(interp); });
  html += renderBouclesAntagonistesR1R7(theme);
  el.innerHTML = html;
}


// ═══════════════════════════════════════════════════════════════
// COUCHE D'INTERPRÉTATION — BOUCLES ANTAGONISTES R1/R7
// Ajout 20/08/26 — doctrine validée sur cas de contrôle :
// Eldense–Cartagena 3-0, test Populus–Cauda 4-0, Fortuna Minor–Carcer 7-0.
// IMPORTANT : cette couche est une INTERPRÉTATION. Elle ne modifie pas
// le calcul du thème, les axes, ni le verdictFinal tant qu'elle n'est pas
// explicitement promue après contre-test sur l'archive.
// Elle s'active uniquement lorsque R1 et R7 appartiennent à deux boucles
// binômes différentes.
// ═══════════════════════════════════════════════════════════════
function analyseBouclesAntagonistesR1R7(theme) {
  if (!theme) return {active:false, reason:'Thème absent'};
  var combat = getRotationCombat(theme);
  var r1 = combat.figR1, r7 = combat.figR7;
  if (!r1 || !r7) return {active:false, reason:'R1/R7 introuvables'};

  var boucleR1 = construireMeute(r1);
  var boucleR7 = construireMeute(r7);
  var memeBoucle = boucleR1.indexOf(r7) >= 0 || boucleR7.indexOf(r1) >= 0;
  if (memeBoucle) {
    return {active:false, reason:'R1 et R7 appartiennent à la même boucle', r1:r1, r7:r7,
      hR1:combat.hR1, hR7:combat.hR7, boucleR1:boucleR1, boucleR7:boucleR7};
  }

  function maillon(fig) {
    var occs = trouverFigV7(fig, theme);
    var repos = getMaisonReposFigure(fig);
    var best = {force:0, pos:null, conc:null, resultante:null};
    occs.forEach(function(o){
      var conc = concordanceFigureMaisonV7(fig, o.pos);
      var res = combine(fig, FIGS_V7[o.pos-1]);
      if (conc.force > best.force) best = {force:conc.force, pos:o.pos, conc:conc, resultante:res};
    });
    return {fig:fig, positions:occs.map(function(o){return o.pos;}), count:occs.length,
      repos:repos, reposPresent:occs.some(function(o){return o.pos===repos;}), best:best,
      binome:BINOMES_V7[fig], antagoniste:ANTAGONISTES_V7[fig]};
  }

  function analyseBoucle(boucle) {
    var membres = boucle.map(maillon);
    var presents = membres.filter(function(x){return x.count>0;});
    var repetitions = membres.filter(function(x){return x.count>1;});
    var totalPresence = membres.reduce(function(s,x){return s + Math.min(x.count,3);},0);
    var force = forceMeute(boucle, theme);
    return {boucle:boucle, membres:membres, presents:presents.length,
      absents:membres.length-presents.length, repetitions:repetitions.length,
      totalPresence:totalPresence, forceMeute:force.totalForce};
  }

  var A = analyseBoucle(boucleR1), B = analyseBoucle(boucleR7);
  var chefA = maillon(r1), chefB = maillon(r7);
  var binA = maillon(BINOMES_V7[r1]), binB = maillon(BINOMES_V7[r7]);
  var antA = maillon(ANTAGONISTES_V7[r1]), antB = maillon(ANTAGONISTES_V7[r7]);

  // Résultante du chef avec sa maison de siège réelle.
  var resA = combine(r1, FIGS_V7[combat.hR1-1]);
  var resB = combine(r7, FIGS_V7[combat.hR7-1]);

  // Une résultante du chef renforce son propre pôle si elle appartient à sa boucle,
  // renforce le pôle adverse si elle appartient à la boucle adverse.
  function effetResultante(res, propre, adverse) {
    if (res === propre) return 'propre';
    if (res === adverse) return 'adverse';
    if (construireMeute(propre).indexOf(res)>=0) return 'propre';
    if (construireMeute(adverse).indexOf(res)>=0) return 'adverse';
    return 'neutre';
  }

  var effetA = effetResultante(resA, r1, r7);
  var effetB = effetResultante(resB, r7, r1);

  // Soutien : le binôme du chef est évalué par son meilleur siège réel.
  var soutienA = binA.best.force;
  var soutienB = binB.best.force;

  // Score d'interprétation : transparent, indicatif, séparé du verdict.
  var scoreA = 0, scoreB = 0, raisons=[];
  if (A.presents > B.presents) { scoreA += 3; raisons.push('Boucle R1 plus matérialisée ('+A.presents+'/'+boucleR1.length+' contre '+B.presents+'/'+boucleR7.length+')'); }
  else if (B.presents > A.presents) { scoreB += 3; raisons.push('Boucle R7 plus matérialisée ('+B.presents+'/'+boucleR7.length+' contre '+A.presents+'/'+boucleR1.length+')'); }
  if (A.repetitions > B.repetitions) { scoreA += 1; raisons.push('R1 possède davantage de répétitions internes'); }
  else if (B.repetitions > A.repetitions) { scoreB += 1; raisons.push('R7 possède davantage de répétitions internes'); }
  if (chefA.reposPresent && !chefB.reposPresent) { scoreA += 2; raisons.push('R1 est ancré dans la maison de repos de son chef'); }
  else if (chefB.reposPresent && !chefA.reposPresent) { scoreB += 2; raisons.push('R7 est ancré dans la maison de repos de son chef'); }
  if (soutienA > soutienB) { scoreA += 2; raisons.push('Binôme de R1 plus fort que le binôme de R7 ('+soutienA+' > '+soutienB+')'); }
  else if (soutienB > soutienA) { scoreB += 2; raisons.push('Binôme de R7 plus fort que le binôme de R1 ('+soutienB+' > '+soutienA+')'); }
  if (effetA === 'propre') { scoreA += 2; raisons.push('Résultante du chef R1 renforce sa propre boucle'); }
  if (effetA === 'adverse') { scoreB += 2; raisons.push('Résultante du chef R1 renforce la boucle adverse'); }
  if (effetB === 'propre') { scoreB += 2; raisons.push('Résultante du chef R7 renforce sa propre boucle'); }
  if (effetB === 'adverse') { scoreA += 2; raisons.push('Résultante du chef R7 renforce la boucle de R1'); }

  var dominant = scoreA > scoreB ? 'R1' : scoreB > scoreA ? 'R7' : 'Équilibre';
  return {active:true, r1:r1, r7:r7, hR1:combat.hR1, hR7:combat.hR7,
    boucleR1:A, boucleR7:B, chefR1:chefA, chefR7:chefB,
    binomeR1:binA, binomeR7:binB, antagonisteR1:antA, antagonisteR7:antB,
    resultanteR1:resA, resultanteR7:resB, effetR1:effetA, effetR7:effetB,
    soutienR1:soutienA, soutienR7:soutienB, scoreR1:scoreA, scoreR7:scoreB,
    dominant:dominant, raisons:raisons};
}

function renderBouclesAntagonistesR1R7(theme) {
  var a = analyseBouclesAntagonistesR1R7(theme);
  if (!a.active) return '<div style="margin-top:14px; border:1px dashed #475569; border-radius:10px; padding:10px; color:#94a3b8; font-size:12px;">⚖️ <b>Boucles antagonistes R1/R7</b> — '+(a.reason||'couche inactive')+'</div>';
  function figs(list){ return list.map(function(f){return FL[f]||f;}).join(' → '); }
  function rows(loop){
    return loop.membres.map(function(x){
      var pos=x.positions.length?('M'+x.positions.join(',M').replace(/^M/,'M')):'absent';
      var res=x.best.resultante ? (FL[x.best.resultante]||x.best.resultante) : '—';
      var repos=x.reposPresent?'✓ repos':'—';
      return '<tr><td style="padding:4px 6px;">'+(FL[x.fig]||x.fig)+'</td><td style="padding:4px 6px;">'+pos+'</td><td style="padding:4px 6px;">'+repos+'</td><td style="padding:4px 6px;">'+x.count+'</td><td style="padding:4px 6px;">'+res+'</td></tr>';
    }).join('');
  }
  var html='<div style="margin-top:14px; border:1px solid #7c3aed; border-radius:10px; padding:12px; font-size:12px;">';
  html+='<div style="font-weight:700; font-size:14px; margin-bottom:6px;">⚔️ Boucles antagonistes R1/R7</div>';
  html+='<div class="muted" style="margin-bottom:8px;">Couche d’interprétation après les axes — aucune modification du calcul du thème ni du verdict automatique.</div>';
  html+='<div><b>R1</b> = '+FL[a.r1]+' (M'+a.hR1+') &nbsp; | &nbsp; <b>R7</b> = '+FL[a.r7]+' (M'+a.hR7+')</div>';
  html+='<div style="margin:7px 0;"><b>Boucle R1 :</b> '+figs(a.boucleR1.boucle)+'</div>';
  html+='<div style="margin:7px 0;"><b>Boucle R7 :</b> '+figs(a.boucleR7.boucle)+'</div>';
  html+='<div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; overflow:auto;">';
  html+='<div><b>R1 — '+a.boucleR1.presents+'/'+a.boucleR1.boucle.length+' maillons présents</b><table style="width:100%; border-collapse:collapse; margin-top:5px;"><tr><th style="text-align:left;">Figure</th><th>Maison</th><th>Repos</th><th>Nb</th><th>Rés.</th></tr>'+rows(a.boucleR1)+'</table></div>';
  html+='<div><b>R7 — '+a.boucleR7.presents+'/'+a.boucleR7.boucle.length+' maillons présents</b><table style="width:100%; border-collapse:collapse; margin-top:5px;"><tr><th style="text-align:left;">Figure</th><th>Maison</th><th>Repos</th><th>Nb</th><th>Rés.</th></tr>'+rows(a.boucleR7)+'</table></div>';
  html+='</div>';
  html+='<div style="margin-top:9px; padding:8px; background:rgba(124,58,237,.08); border-radius:8px;">';
  html+='<b>Chef :</b> '+FL[a.r1]+' → '+(FL[a.chefR1.binome]||a.chefR1.binome)+' (soutien '+a.soutienR1+') ; '+FL[a.r7]+' → '+(FL[a.chefR7.binome]||a.chefR7.binome)+' (soutien '+a.soutienR7+')';
  html+='<br><b>Résultantes chefs :</b> '+FL[a.r1]+' → '+(FL[a.resultanteR1]||a.resultanteR1)+' ('+a.effetR1+') ; '+FL[a.r7]+' → '+(FL[a.resultanteR7]||a.resultanteR7)+' ('+a.effetR7+')';
  html+='<br><b>Comparaison indicative :</b> R1 '+a.scoreR1+' — R7 '+a.scoreR7+' → <b>'+a.dominant+'</b>';
  if (a.raisons.length) html+='<ul style="margin:6px 0 0 18px;">'+a.raisons.map(function(r){return '<li>'+r+'</li>';}).join('')+'</ul>';
  html+='</div></div>';
  return html;
}

// ═══════════════════════════════════════════════════════════════
// POIDS DES INTERPRÉTATIONS SUR LE VERDICT (05/08/26, demande explicite
// Ellemine_D : "fais [que ce] poids se porte sur verdictFinal. Chaque
// figure liée à R1 ou R7, son environnement aussi doit être interprété
// pour voir son impact sur R1 ou R7"). Convertit chaque couleur de case
// (🟦🟧🟨🟪🟥) en score numérique, puis parcourt l'ENVIRONNEMENT de R1
// et R7 — leur propre maison, ET la chaîne de leurs binômes successifs
// (même profondeur que familleTeamsEngine, jusqu'à 5 crans) — pour
// cumuler un score d'ambiance/interprétation par camp.
//
// BARÈME (05/08/26, choix arbitraire assumé, pas donné par la doctrine
// source qui ne fournissait que des couleurs qualitatives) :
//   🟦 favorable        = +15
//   🟧 intermédiaire     = +3
//   🟨 neutre-équilibre  = 0
//   🟪 neutre-collectif  = 0
//   🟥 défavorable/danger = -15
// Échelle choisie pour peser un peu plus qu'un tier "alliée" (20-100)
// mais rester très en dessous du palier REPOS (1000) — ni négligeable,
// ni dominant. ⚠️ STATUT : branché directement sur demande explicite,
// PAS ENCORE contre-testé sur l'archive réelle — à vérifier en priorité
// sur les prochains matchs, revert si ça dégrade la précision.
// ═══════════════════════════════════════════════════════════════
function couleurToScore(couleur) {
  switch (couleur) {
    case '🟦': return 15;
    case '🟧': return 3;
    case '🟨': return 0;
    case '🟪': return 0;
    case '🟥': return -15;
    default: return 0;
  }
}

// ─── LECTURE DES SIÈGES R1/R7 (24/08/26, doctrine Ellemine_D) ───
// Découverte sur le cas réel Conjunctio/Rubeus/Cauda/Acquisitio (6-1) :
// le verdict était écrit noir sur blanc dans la maison de chaque chef,
// alors que TOUTES les couches agrégées se trompaient.
//   M11 = siège de R1 (Puer)        -> 🟧 « buts élevés · victoire A possible »  -> 6 buts
//   M1  = siège de R7 (Conjunctio)  -> 🟨 « buts modérés · nul/bascule »         -> 1 but
// Le score de résidence donnait pourtant R7 (8 vs 4,5), et la Structure du
// Nul suspendait tout. La lecture directe des deux sièges, elle, donnait
// le bon camp ET le bon sens de score.
//
// CHOIX DE CONCEPTION : on décide sur `couleur`, pas sur `resultat`.
// `resultat` est du texte libre (76 valeurs distinctes sur 256 entrées :
// « nul/bascule », « avantage léger A », « victoire A possible »...) —
// le parser par mots-clés serait de la devinette et casserait au premier
// libellé nouveau. `couleur` est un enum fermé à 5 valeurs, déjà doté
// d'un barème utilisé ailleurs dans le moteur (couleurToScore). `buts`
// sert de départage : c'est une échelle ordinale nette.
// 📚 Doctrine posée sur n=1 — à contre-tester dès que d'autres résultats
// réels seront disponibles.
var BUTS_ECHELLE_SIEGE = {
  'très élevés': 3, 'élevés/précoces': 2.5, 'élevés': 2, 'potentiel élevé': 2,
  'modérés/élevés': 1.5, 'modérés': 1, 'possibles': 0.5, 'faibles à modérés': 0.5,
  'faibles/modérés': 0.5, 'variables': 0, 'indirect': 0, 'irréguliers': 0,
  'possibles tardivement': 0, 'tardifs': 0,
  'bas': -1, 'faible': -1.5, 'faibles': -1.5, 'très faibles': -2
};
function butsScoreSiege(buts) {
  var v = BUTS_ECHELLE_SIEGE[buts];
  return typeof v === 'number' ? v : 0;
}

function lectureSiegesR1R7(theme) {
  if (!theme || !theme[1]) return {applicable: false, reason: 'Thème non disponible.'};
  var rot = getRotationCombat(theme);
  var iR1 = getInterpretationFootball(theme[rot.hR1], rot.hR1);
  var iR7 = getInterpretationFootball(theme[rot.hR7], rot.hR7);
  if (!iR1 || !iR7) return {applicable: false, hR1: rot.hR1, hR7: rot.hR7,
    reason: 'Interprétation absente pour l\'un des deux sièges.'};

  var cR1 = couleurToScore(iR1.couleur), cR7 = couleurToScore(iR7.couleur);
  var bR1 = butsScoreSiege(iR1.buts),    bR7 = butsScoreSiege(iR7.buts);

  var winner = null, motif;
  if (cR1 !== cR7) {
    winner = cR1 > cR7 ? 'R1' : 'R7';
    motif = 'couleur du siège (' + iR1.couleur + ' ' + cR1 + ' contre ' + iR7.couleur + ' ' + cR7 + ')';
  } else if (bR1 !== bR7) {
    winner = bR1 > bR7 ? 'R1' : 'R7';
    motif = 'couleurs égales (' + iR1.couleur + ') — départage par les buts (' + iR1.buts + ' contre ' + iR7.buts + ')';
  } else {
    motif = 'sièges strictement équivalents (' + iR1.couleur + ', buts ' + iR1.buts + ') — aucun départage';
  }

  return {
    applicable: true, winner: winner, motif: motif,
    hR1: rot.hR1, hR7: rot.hR7, figR1: rot.figR1, figR7: rot.figR7,
    interpR1: iR1, interpR7: iR7,
    couleurScoreR1: cR1, couleurScoreR7: cR7,
    butsScoreR1: bR1, butsScoreR7: bR7,
    synthese: 'Siège R1 (M' + rot.hR1 + ', ' + FL[rot.figR1] + ') ' + iR1.couleur
      + ' « buts ' + iR1.buts + ' · ' + iR1.resultat + ' » contre siège R7 (M' + rot.hR7 + ', '
      + FL[rot.figR7] + ') ' + iR7.couleur + ' « buts ' + iR7.buts + ' · ' + iR7.resultat + ' » — '
      + (winner ? 'avantage ' + winner : 'égalité') + ' par ' + motif + '.'
  };
}

// Parcourt fig et sa chaîne de binômes (jusqu'à profondeur crans), et pour
// chaque membre trouvé actif dans le thème (base ou résultante), prend sa
// MEILLEURE interprétation (position qui donne le score le plus favorable
// si plusieurs sièges) et cumule.
function scoreEnvironnementInterpretation(fig, mSiege, theme, profondeur) {
  profondeur = profondeur || 5;
  let total = 0;
  const detail = [];
  let cur = fig;
  for (let i = 0; i < profondeur; i++) {
    const positions = (i === 0 && mSiege) ? [mSiege] : positionsBaseEtResultantes(cur, theme).map(function(p){ return parseInt(p.replace('M','').replace('r','')); });
    if (positions.length) {
      let best = null, bestScore = -Infinity, bestConcordance = null, bestRepos = false;
      positions.forEach(function(p){
        const interp = getInterpretationFootball(cur, p);
        if (!interp) return;
        const brut = couleurToScore(interp.couleur);
        // PERSISTANCE SUR LA CONCORDANCE DES ÉLÉMENTS (05/08/26, demande
        // explicite Ellemine_D : "les concordances des éléments les plus
        // compatibles sont plus fortes, hormis celles qui sont dans leur
        // propre maison"). Une figure EN REPOS (chez elle) garde son
        // score plein, sans multiplicateur. Sinon, le score brut de la
        // couleur est pondéré par concordanceElement (déjà utilisée dans
        // chaineDeForce) : même élément=×1, alliée=×0.5, contraire=×0.25,
        // sans lien=×0 — pour que les concordances les plus compatibles
        // pèsent vraiment plus lourd que les combinaisons discordantes.
        const enRepos = (FIGS_V7[p-1] === cur);
        let s;
        if (enRepos) {
          s = brut;
        } else {
          const concordance = concordanceElement(ELEMENTS_V7[cur], MAISON_ELEM_V7[p]);
          s = brut * concordance;
        }
        if (s > bestScore) { bestScore = s; best = interp; bestConcordance = enRepos ? 'repos (plein)' : concordanceElement(ELEMENTS_V7[cur], MAISON_ELEM_V7[p]); bestRepos = enRepos; }
      });
      if (best) {
        total += bestScore;
        detail.push({ figure: cur, position: best.maison, score: bestScore, couleur: best.couleur, impact: best.impact, concordance: bestConcordance, repos: bestRepos });
      }
    }
    cur = BINOMES_V7[cur];
    if (cur === fig) break;
  }
  return { total: total, detail: detail };
}

// ─── DÉSACTIVÉE COMME MÉCANISME DÉCISIF (24/08/26, demande Ellemine_D) ───
// Doctrine corrigée par le cas réel Conjunctio/Rubeus/Cauda/Acquisitio :
// M13=Carcer et M14=Conjunctio formaient une paire d'équilibre, la
// Structure du Nul s'est donc déclenchée et a SUSPENDU tout le protocole
// R1/R7 + le Réseau d'ancrage. Score réel : 6-1 — le résultat le plus
// tranché possible, sur un thème que le système déclarait nul.
// Règle posée par Ellemine_D : « même il peut avoir un thème de structure
// nul sans que le résultat réel soit un nul » — la signature structurelle
// M13/M14 décrit une configuration, PAS une issue.
// Cohérent avec la mesure déjà notée dans ce fichier : précision 23%,
// contre 24% de taux de base — le signal n'apportait aucune information.
// Le calcul et le panneau de diagnostic restent en place (lecture utile) ;
// seul son pouvoir de décision est retiré via ce drapeau.
// Ancienne règle « Via en M4 → le camp A ne marque pas », héritée de la
// lecture M1/M7 et qui agissait encore sur le score de la carte R1/R7.
// Réfutée 0 fois juste sur 5 le 29/08/26 — voir buildVerdictCard.
// Le score affiché : true = calibré sur le réel (camp → 1-0, nul → 1-1),
// false = ancien générateur buildScoreFromCamps. Mesures dans
// buildVerdictCard — 60 buts d'erreur et 7 scores exacts contre 87 et 0.
// ☠️ LA LECTURE FROIDE EST MORTE — DÉBRANCHÉE LE JOUR MÊME (29/08/26).
// Branchée sur décision d'Ellemine_D (« branche-le, on verra avec les
// scores à venir »), elle est tombée au score suivant, et c'est très
// bien : c'est exactement le test qu'elle demandait.
// Le thème Amissio · Tristitia · Tristitia · Cauda porte SEPT figures
// froides sur seize — le plus fermé jamais vu, l'ancien maximum était
// six. La règle annonçait « match fermé, 1-0 ». Réel : 6-7, TREIZE buts.
// Et en le versant à l'archive, la corrélation qui la portait s'effondre :
//   r = −0,45 avant   →   r = −0,04 après
// ⚠️ ELLE ÉTAIT FAUSSE DÈS LE DÉPART, ET L'ERREUR EST DE MOI. Le −0,45
// ne venait pas des figures froides : il venait de l'E-SPORT. Les matchs
// arcade marquent 8,75 buts en moyenne contre 2,84 pour les vrais, et
// les trois qui étaient alors dans l'archive avaient peu de figures
// froides (3, 2 et 1). J'ai mesuré une corrélation à travers DEUX
// POPULATIONS qui n'ont rien à voir, et j'ai pris l'écart entre elles
// pour un signal. Sur les vrais matchs seuls, la corrélation valait
// r = −0,18 depuis le début — rien. J'aurais dû séparer avant de mesurer.
// Ne pas rebrancher sans avoir refait la mesure format par format.
var SCORE_FROID_V7 = false;
var SCORE_CALIBRE_V7 = true;
var REGLE_VIA_M4_V7 = false;
var STRUCTURE_NUL_DECISIVE = false;
// ─── LE NUL AU VERDICT PRINCIPAL (29/08/26) ───
// true  = porte ÉLARGIE : en même boucle le nul s'impose quand R7 est un
//         ALLIÉ PROCHE de R1 — binôme (+2) ou front (+4) ; en boucles
//         opposées, sur +11. C'est ce qui est branché : 22/30 sur le
//         verdict affiché, contre 18/30 sans le nul.
// false = porte STRICTE : +2 seulement en même boucle. 21/30.
//
// ⚠️ RÉVISION DU 29/08/26 AU SOIR, demandée par Ellemine_D
// (« revérifie encore les deux branches du nul »). MA JUSTIFICATION
// D'« ALLIÉ PROCHE » ÉTAIT FAUSSE comme notion de distance. Mesuré :
//     décalage  distance dans l'anneau min(k,16−k)  relation
//       +2            2                  binôme
//       +4            4                  front
//       +8            8                  front du front
//      +10            6                  bouclier
//      +12            4                  front à l'envers
//      +14            2                  binôme à l'envers
// Si « proche » voulait dire distance dans l'anneau, +14 (distance 2)
// serait AUSSI proche que +2, et +12 (distance 4) aussi proche que +4 —
// or ces deux-là n'ont aucun nul. Et +10 (distance 6) serait plus proche
// que +8 (distance 8), les deux à zéro. La distance n'explique rien.
//
// CE QUI SÉPARE VRAIMENT, ce sont deux choses ensemble :
//   1. LE SENS. +2 et +4 disent « R7 est le binôme ou le front DE R1 ».
//      +12 et +14 disent l'inverse — c'est R1 qui est le front ou le
//      binôme DE R7. Même relation, propriétaire opposé : 0 nul sur 4.
//   2. LA POSITION VERS L'AVANT. Parmi les rôles que R1 possède,
//      seuls les DEUX PREMIERS PAS PAIRS devant lui donnent le nul.
//      Plus loin devant — +8 front du front, +10 bouclier — 0 nul sur 5.
// La formule juste est donc : « R7 occupe l'un des deux premiers rôles
// que R1 projette devant lui ». Pas « allié proche ».
//
// Le tableau qui soutient la coupure, les 13 thèmes en même boucle :
//     +2  binôme .............. 2 nuls / 3
//     +4  front ............... 1 nul  / 1
//   ─────────────── la frontière ───────────────
//     +8  front du front ...... 0 nul  / 1
//     +10 bouclier ............ 0 nuls / 4
//     +12 front à l'envers ..... 0 nuls / 2
//     +14 binôme à l'envers .... 0 nuls / 2
//   R7 possédé par R1, 2 premiers pas {+2, +4} .. 3 nuls / 4
//   R7 possédé par R1, plus loin {+8, +10} ...... 0 nul  / 5
//   R1 possédé par R7 {+12, +14} ................ 0 nul  / 4
//
// ═══ MISE À JOUR DU 29/08/26 AU SOIR — +6 ENTRE, ET LA LECTURE PAR
// « RÔLE » TOMBE ═══
// Un nul 0-0 tiré DEUX FOIS (PuerFortMaj et PopFortMaj, le même match)
// porte un décalage de +6, jamais vu jusque-là. La porte est restée
// fermée deux fois sur un nul. Répartition complète en même boucle,
// sur 35 cas (mères de TristPop corrigées le 29/08 au soir : il passe
// de +10 à +4, et devient le SECOND faux positif de la porte) :
//   + 2   2 nuls /  3      + 8   0 nul / 1
//   + 4   1 nul  /  2      +10   0 nul / 4
//   + 6   2 nuls /  2      +12   0 nul / 2
//   ─────── frontière ───────  +14   0 nul / 2
// TOUS les nuls de même boucle sont à +2, +4 ou +6 — 5 sur 5. AUCUN
// au-delà,
// aucun en sens inverse : neuf cas de l'autre côté de la coupure.
//
// ⚠️ ET MA JUSTIFICATION PAR LES RÔLES ÉTAIT FAUSSE. Je disais « R7
// occupe l'un des rôles que R1 projette devant lui ». Or +6 n'EST PAS un
// rôle du camp : les rôles sont à +2 (binôme), +4 (front), +8 (front du
// front) et +10 (bouclier). +6 n'a pas de nom — c'est le bouclier lu à
// l'envers. La bonne lecture n'est donc pas doctrinale mais POSITIONNELLE :
// R7 est à 2, 4 ou 6 pas devant R1, dans l'arc proche. Rien d'autre.
//
// ⚠️⚠️ ET IL FAUT NOMMER LE DANGER : c'est la DEUXIÈME fois que j'élargis
// cette porte après un raté — +4 hier, +6 ce soir. Élargir une règle à
// chaque fois qu'elle se trompe, c'est la définition de l'ajustement
// progressif, et trois nuls ont servi à fixer trois bornes. Ce qui la
// sauve pour l'instant est la propreté de la coupure (neuf cas au-delà,
// zéro nul) et le fait qu'elle est FALSIFIABLE : le prochain nul à +8,
// +10, +12 ou +14 la tue. Si cela arrive, ne pas élargir une troisième
// fois — abandonner.
// Le camp entier {0,2,4,8,10} ferait 3 nuls sur 9 : la coupure est bien
// aux deux premiers pas, pas au camp.
// Fréquence de base : +4 seul 5,0 % des thèmes, {+2,+4} 12,3 %.
//
// ⚠️⚠️ ET LA DEUXIÈME CHOSE QUE J'AVAIS MAL DITE : LES DEUX BRANCHES NE
// SONT PAS ÉGALEMENT SOUTENUES. Je les ai présentées côte à côte comme
// si elles se valaient. Mesuré, elles ne se valent pas du tout :
//   MÊME BOUCLE, cible {+2,+4} : 3 nuls sur 3 dans la cible.
//     probabilité au hasard, cible trouvée APRÈS COUP ...... 1,7 %
//   BOUCLES OPPOSÉES, cible {+11} : 2 nuls sur 2 dans la cible.
//     probabilité au hasard, cible trouvée APRÈS COUP ..... 15,4 %
// Trois nuls qui tombent tous dans une case de quatre, c'est difficile
// à obtenir par hasard. DEUX nuls qui partagent un décalage parmi huit,
// c'est une chance sur six ou sept — ce n'est pas une preuve.
// Autrement dit : la porte de la MÊME BOUCLE est établie ; celle des
// BOUCLES OPPOSÉES est une HYPOTHÈSE en probation, qu'on fait tourner
// en vrai parce qu'elle n'a encore produit aucun faux positif (2 tirs,
// 2 nuls) et parce que sans elle on n'a rien du tout sur cette branche.
// Le troisième nul en boucles opposées la tuera ou la fera passer.
var NUL_PORTE_ELARGIE_V7 = true;

function structureDuNul(theme) {
  const juge1 = theme[13], juge2 = theme[14];
  const reconstruction = theme[15], sentence = theme[16];

  const nulParIdentite = (juge1 === juge2);
  const nulParOpposition = estPaireEquilibre(juge1, juge2);
  const nulDetecte = nulParIdentite || nulParOpposition;

  function classer(fig) {
    if (FIGURES_NUL_FREQUENTES.indexOf(fig) !== -1) return 'fréquente';
    if (FIGURES_NUL_CONDITIONNELLES.indexOf(fig) !== -1) return 'conditionnelle';
    return null;
  }

  return {
    juge1: juge1, juge2: juge2, reconstruction: reconstruction, sentence: sentence,
    nulParIdentite: nulParIdentite, nulParOpposition: nulParOpposition, nulDetecte: nulDetecte,
    classement: { juge1: classer(juge1), juge2: classer(juge2), reconstruction: classer(reconstruction), sentence: classer(sentence) },
    elements: ELEMENTS_STRUCTURE_NUL
  };
}

// ═══════════════════════════════════════════════════════════════
// AXE SUCCÉDENT COMME 4 MÈRES — SIGNAL DE NUL VALIDÉ (05/08/26, demande
// Ellemine_D : "essaie les axes comme les 4 mères"). Prend M2+M5+M8+M11
// (l'Axe Succédent) et les traite comme 4 nouvelles mères pour générer
// un THÈME DÉRIVÉ complet (même moteur buildThemeFromMothers). Si le
// M13/M14 de CE thème dérivé forment une paire d'opposition (équilibre),
// signal de nul.
//
// VALIDÉ SUR 70 MATCHS RÉELS ARCHIVÉS (05/08/26), le seul signal de nul
// de tout le système à dépasser nettement le taux de base :
//   Taux de base des nuls dans l'archive : 24%
//   Ce signal (opposition M13/M14 sur thème dérivé Axe Succédent) :
//     rappel 18% (3/17 nuls captés), faux positifs 8% (4/53),
//     PRÉCISION 43% (3/7) — quasi le double du taux de base.
// L'identité pure (M13=M14) sur ce même thème dérivé a été TESTÉE et
// REJETÉE (précision 30%, à peine au-dessus du bruit) — volontairement
// PAS branchée, contrairement à l'opposition.
// Statut : signal le mieux validé du système à ce jour, mais échantillon
// encore petit (7 cas) — à recroiser à mesure que l'archive grandit.
