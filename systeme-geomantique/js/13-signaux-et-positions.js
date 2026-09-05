// ═══════════════════════════════════════════════════════════════
// SIGNAUX ET POSITIONS
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
function signalTemoinM1M7(theme){
  const fig1 = theme[1], fig7 = theme[7];
  const target1 = findFigureTargetByBinomeWitness(fig1);
  const target7 = findFigureTargetByBinomeWitness(fig7);
  const target1Active = !!target1 && figureExistsActive(target1, theme);
  const target7Active = !!target7 && figureExistsActive(target7, theme);
  return {fig1, target1, target1Active, fig7, target7, target7Active};
}

// ── 📚 ÉTUDE (branché le 27/07/26, candidat #1 proposé par Claude, choisi
// par Ellemine_D) : symétrique de ce que fait déjà getNegativeImpactDetails
// côté DÉFENSE (cible bien placée + son binôme présent = résiste totalement)
// mais jamais testé côté ATTAQUE. Sens ANTAGONISTES[X]=Y validé (guerre des
// 16, 12/07/26) : Y est l'antagoniste de X, donc Y ATTAQUE X. On regarde donc
// qui attaque fig1/fig7 (ANTAGONISTES[fig1]/[fig7]), si cet attaquant est
// bien actif dans le thème, et si LUI-MÊME est soutenu par son propre binôme
// (actif) ou au contraire isolé (binôme absent). Hypothèse non tranchée : un
// attaquant isolé frappe-t-il moins fort qu'un attaquant soutenu ? Pur
// diagnostic — ne pèse sur AUCUN verdict, cf. renderStatsTab.
function signalAttaquantIsole(theme){
  const fig1 = theme[1], fig7 = theme[7];
  const attacker1 = ANTAGONISTES[fig1];   // attaque M1
  const attacker7 = ANTAGONISTES[fig7];   // attaque M7
  const attacker1Active = figureExistsActive(attacker1, theme);
  const attacker7Active = figureExistsActive(attacker7, theme);
  const attacker1Binome = BINOMES[attacker1];
  const attacker7Binome = BINOMES[attacker7];
  const attacker1Supported = attacker1Active && figureExistsActive(attacker1Binome, theme);
  const attacker7Supported = attacker7Active && figureExistsActive(attacker7Binome, theme);
  const attacker1Isolated = attacker1Active && !attacker1Supported;
  const attacker7Isolated = attacker7Active && !attacker7Supported;
  return {fig1, fig7, attacker1, attacker7, attacker1Active, attacker7Active,
    attacker1Supported, attacker7Supported, attacker1Isolated, attacker7Isolated};
}

// ── 📚 ÉTUDE (branché le 27/07/26, candidat #2, doctrine Ellemine_D validée
// par calcul le 27/07/26 sur Puer/Laetitia/Cauda/Fortuna majeur) : une
// maison PAIRE est TOUJOURS favorable pour n'importe quelle figure (sa
// résultante y reste dans sa propre boucle A/B), une maison IMPAIRE est
// TOUJOURS défavorable (résultante bascule dans la boucle opposée) — règle
// universelle, indépendante de la figure. On l'applique ici à la position
// du BINÔME (le témoin qui renforce, cf. signalTemoinM1M7) de chaque camp :
// son renfort est-il bien placé (maison paire, favorable) ou mal placé
// (maison impaire, défavorable) ? Pur diagnostic — ne pèse sur AUCUN
// verdict, cf. renderStatsTab.
function signalFavorabiliteMaison(theme){
  const fig1 = theme[1], fig7 = theme[7];
  const bin1 = BINOMES[fig1], bin7 = BINOMES[fig7];
  const posBin1 = findActiveFigurePositions(bin1, theme);
  const posBin7 = findActiveFigurePositions(bin7, theme);
  const bin1Favorable = posBin1.some(m=>m%2===0);
  const bin1Defavorable = posBin1.some(m=>m%2===1);
  const bin7Favorable = posBin7.some(m=>m%2===0);
  const bin7Defavorable = posBin7.some(m=>m%2===1);
  return {fig1, fig7, bin1, bin7, posBin1, posBin7,
    bin1Favorable, bin1Defavorable, bin7Favorable, bin7Defavorable};
}

// ── 📚 ÉTUDE (branché le 27/07/26, candidat #3, loi des familles
// d'opposition vérifiée par calcul sur les 16 figures x 8 paires, ZÉRO
// exception) : la paire M1/M7 appartient TOUJOURS à la famille CARCER —
// combiner les résultantes de M1 et M7 donne systématiquement Carcer,
// quel que soit l'occupant (l'occupant s'annule algébriquement). Carcer
// est donc la "figure-loi" fixe de cet axe. Hypothèse non tranchée : la
// présence RÉELLE de Carcer dans le thème (base ou résultante, ailleurs
// que M1/M7) rend-elle la loi de cet axe plus "manifeste"/décisive ? Pur
// diagnostic — ne pèse sur AUCUN verdict, cf. renderStatsTab.
function signalFamilleOpposition(theme){
  const fig1 = theme[1], fig7 = theme[7];
  const carcerActive = figureExistsActive('carcer', theme);
  const puellaActive = figureExistsActive('puella', theme);
  const carcerAtM1orM7 = fig1==='carcer' || fig7==='carcer';
  return {fig1, fig7, carcerActive, puellaActive, carcerAtM1orM7};
}
function wrapHouse(pos){return ((pos-1+16)%16)+1;}

function findFigurePositions(fig,theme){return Object.keys(theme).filter(function(pos){return theme[pos]===fig;}).map(function(pos){return Number(pos);});}
function getRestHouse(fig){return FIGS.indexOf(fig)+1;}

function circularDistance(a,b){const diff=Math.abs(a-b); return Math.min(diff,16-diff);}

function hasBinomeInTheme(fig,theme){const binome=BINOMES[fig]; return !!binome && figureExistsInTheme(binome,theme);}



function findActiveFigurePositions(fig,theme){const direct=findFigurePositions(fig,theme); const resultants=Array.from({length:16},(_,i)=>i+1).filter(pos=>getResultant(theme[pos],pos)===fig); return [...new Set([...direct,...resultants])];}
function figureExistsActive(fig,theme){return findActiveFigurePositions(fig,theme).length>0;}
function getClosestActiveFigureDistance(fromPos,fig,theme){const positions=findActiveFigurePositions(fig,theme); if(!positions.length) return Infinity; return Math.min(...positions.map(pos=>circularDistance(fromPos,pos)));}
function hasActiveBinome(fig,theme){const binome=BINOMES[fig]; return !!binome && figureExistsActive(binome,theme);}
function isActiveAntagonistStrong(fig,theme){const antagonist=ANTAGONISTES[fig]; if(!antagonist) return false; return hasActiveBinome(antagonist,theme);}
function isActiveAntagonistVeryStrong(fig,theme){const antagonist=ANTAGONISTES[fig]; if(!antagonist) return false; const positions=findActiveFigurePositions(antagonist,theme); if(!positions.length || !hasActiveBinome(antagonist,theme)) return false; return positions.some(pos=>ELEMENTS[antagonist]==='terre' && ['terre','eau'].includes(MAISON_ELEM[pos]));}
function hasActiveFirstHalfBinomeSignal(sourcePos,theme){const fig=theme[sourcePos]; const binome=BINOMES[fig]; if(!binome) return false; const positions=findActiveFigurePositions(binome,theme); if(!positions.length) return false; return positions.some(pos=>MAISON_ELEM[pos]==='feu' && ['feu','air'].includes(ELEMENTS[binome]));}
function isFigureWellPositioned(fig,theme){return findFigurePositions(fig,theme).some(pos=>fig===FIGS[pos-1] || houseMatchesElement(pos,fig) || ELEMENTS[getResultant(fig,pos)]===MAISON_ELEM[pos]);}


function getNegativeImpactDetails(viseurFig,targetFig,forcePct,theme){if(!targetFig) return {pct:0, text:`Aucune figure visée.`}; const positions=findFigurePositions(targetFig,theme); if(!positions.length) return {pct:0, text:`${FL[targetFig]} est absente du thème.`}; const basePct=forcePct; const targetWellPlaced=isFigureWellPositioned(targetFig,theme); const targetBinome=BINOMES[targetFig]; const binomeReady=figureExistsInTheme(targetBinome,theme) && isFigureWellPositioned(targetBinome,theme); if(targetWellPlaced && binomeReady) return {pct:0, text:`${FL[targetFig]} résiste totalement à ${FL[viseurFig]} avec ${FL[targetBinome]} bien positionnée : impact nul.`}; if(targetWellPlaced) return {pct:Math.round(basePct/2), text:`${FL[targetFig]} résiste à ${FL[viseurFig]} car elle est bien positionnée.`}; return {pct:basePct, text:`${FL[viseurFig]} impacte négativement ${FL[targetFig]} à ${basePct}%.`};}
function renderHouseInsight(pos){const panel=document.getElementById('house-insight-content'); if(!panel || !currentTheme) return; panel.innerHTML='';}

// ═══════════════════════════════════════════════════════════════
// NOUVEAU MOTEUR V7 — Table fixe Binôme(+2)/Antagoniste(-3) par FIGURE
// Chaque figure a TOUJOURS le même binôme et le même antagoniste,
// peu importe sa position dans le thème. On cherche ensuite où se
// trouve ce binôme/antagoniste dans le thème courant.
// ═══════════════════════════════════════════════════════════════

// MAINTENANCE (03/09/26) : FIGS_V7/BINOMES_V7/ANTAGONISTES_V7 étaient une
// copie indépendante de FIGS/BINOMES/ANTAGONISTES (déclarées plus haut,
// lignes ~2952-2970) — deux tables à maintenir à la main en parallèle,
// déjà prises en flagrant délit de désynchronisation par le passé
// (autoTestTablesLegacyVsV7 plus bas). Elles sont désormais des alias du
// même objet : plus aucune divergence possible entre "legacy" et "V7".
const FIGS_V7 = FIGS;
const BINOMES_V7 = BINOMES;
const ANTAGONISTES_V7 = ANTAGONISTES;

// ─── RÈGLE ELLEMINE (21/08/26) : PROTECTEUR PAR CHAÎNE D'ANTAGONISME ───
// Fait universel découvert par Ellemine_D : dans chaque boucle (A ou B),
// chaque figure X a un "protecteur" Y qui neutralise indirectement la
// menace de son antagoniste direct. Exemple donné : l'antagoniste de
// Puer est Puella ; l'antagoniste de Puella est Conjonctio. Si Conjonctio
// est présente et contrôle Puella, Puer est libre — Conjonctio est donc
// le PROTECTEUR de Puer.
// Formule (vérifiée exactement sur les 8 exemples fournis, boucle
// impaire ET paire) : protecteur(X) = antagoniste(antagoniste(X)) —
// soit un décalage de +10 positions dans le cycle complet des 16
// figures. Comme 10 est pair, ce décalage reste TOUJOURS à l'intérieur
// de la même boucle (parité d'index préservée) — cohérent avec le fait
// que chaque boucle forme son propre cycle fermé de protection à 8
// figures : Puer→Conjonctio→Via→Acquisitio→Fortuna Minor→Caput→Cauda→
// Rubeus→(Puer) pour la boucle impaire ; Laetitia→Fortuna Major→Amissio→
// Populus→Carcer→Albus→Puella→Tristitia→(Laetitia) pour la boucle paire.
// 📚 Doctrine nouvelle, non encore validée empiriquement sur l'archive —
// affichage informatif uniquement, aucun poids sur verdictFinal pour
// l'instant.
const PROTECTEURS_V7 = {};
FIGS_V7.forEach(function(fig, i) {
  PROTECTEURS_V7[fig] = FIGS_V7[(i + 10) % 16];
});

// ─── RÈGLE ELLEMINE (24/08/26) : FIGURE DE FRONT — TROISIÈME PÔLE ───
// Doctrine utilisateur, donnée sous forme de chaîne causale (« qui détruit
// qui ») : X a un antagoniste direct qui le menace ; le protecteur de X
// (antagoniste de cet antagoniste) neutralise cette menace ; mais le
// protecteur a lui-même un antagoniste — une seconde menace, cette fois
// sur le protecteur ; la FIGURE DE FRONT (antagoniste de cette seconde
// menace) neutralise CETTE menace, ce qui sécurise la chaîne jusqu'au
// bout. Exemple donné (chaîne « détruit ») : Via détruit Tristitia,
// Tristitia détruit Conjonctio, Conjonctio détruit Puella, Puella détruit
// Puer — donc Puer ← Puella (menace) ← Conjonctio (protecteur) ←
// Tristitia (menace sur le protecteur) ← Via (figure de front).
// Formule (chaîne à 4 crans d'antagonisme, vérifiée sur les exemples ET
// sur les 16 figures) : front(X) = antagoniste⁴(X) = protecteur(protecteur(X)) = X + 4.
// Comme 4 est pair, le front reste TOUJOURS dans la même boucle. Les 16
// figures se répartissent en 4 quatuors fermés sous cette relation, un
// par élément : le front occupe toujours une maison de repos du MÊME
// élément que X (le protecteur occupe l'élément OPPOSÉ — feu↔eau,
// air↔terre, cf. neutralisationElementaireR1R7).
// Utilisée par analyserResistanceV7 ci-dessous : la voie A (protection
// par le protecteur) n'est fiable que si la seconde menace sur le
// protecteur est neutralisée par le front — voir ce commentaire pour le
// câblage réel dans le Réseau d'ancrage V2.
// 📚 Doctrine nouvelle, vérifiée structurellement sur les 16 figures —
// pas encore contre-testée sur l'archive de résultats réels.
const FRONT_V7 = {};
FIGS_V7.forEach(function(fig, i) {
  FRONT_V7[fig] = FIGS_V7[(i + 4) % 16];
});

// ═══════════════════════════════════════════════════════════════
// LES TROIS PÔLES, REFORMULÉS (25/08/26, Ellemine_D)
// « R1 ou R7 sera fig central ; le protecteur, antagoniste de
// l'antagoniste du fig central, sera fig bouclier ; et le binôme du binôme
// du fig central est fig de front, car la fig de front détruit la fig qui
// attaque le fig du bouclier. »
//
//   FIGURE CENTRALE   X          — R1 ou R7, celle dont on lit le réseau
//   FIGURE BOUCLIER   X + 10     — antagoniste(antagoniste(X))
//   FIGURE DE FRONT   X + 4      — binôme(binôme(X))
//
// AUCUN CHIFFRE NE CHANGE. Le bouclier est l'ancien « protecteur »
// (PROTECTEURS_V7, X+10) et le front reste FRONT_V7 (X+4) : seuls le nom
// et la dérivation changent. Le front avait été introduit le 24/08 comme
// antagoniste⁴(X) = protecteur(protecteur(X)) ; la dérivation par les
// binômes donne le même résultat, et c'est la plus simple des trois :
//     antagoniste⁴ = −3×4 = −12 ≡ +4 (mod 16)
//     protecteur²  = +10+10 = +20 ≡ +4
//     binôme²      = +2+2  =  +4
//
// LA RAISON EST VÉRIFIÉE, 16 FIGURES SUR 16. Avec la convention du fichier
// — antagoniste(Y) = Y−3 est la figure qui DÉTRUIT Y :
//     la figure qui attaque le bouclier est antagoniste(X+10) = X+7
//     celle qui détruit X+7 est (X+7)−3 = X+4 = la figure de front
// Le front défend donc bien le bouclier, qui défend le central.
// Exemple, central = Puer : bouclier Conjonctio, attaqué par Tristitia,
// que Via — le front de Puer — détruit.
//
// Les identifiants internes ne sont pas renommés (trop de sites, risque
// pour rien) ; ces alias portent le vocabulaire dans le code, et
// l'affichage, lui, dit bouclier.
const BOUCLIER_V7 = PROTECTEURS_V7;


// ─── RÈGLE ELLEMINE (25/08/26) : UNE FIGURE TIENT QUATRE RÔLES À LA FOIS ───
// Énoncé de l'utilisateur, mot pour mot : « une figure peut jouer un rôle de
// binôme pour une figure x et en même temps antagoniste pour une figure y,
// en même temps aussi elle peut être une figure de front d'une figure x et
// figure de protecteur pour une figure y, ou même elle peut être R1 ou R7 ».
// Ce n'est pas une exception, c'est la structure : les quatre relations sont
// des bijections du cycle des 16, donc CHAQUE figure X est, toujours et
// simultanément :
//     binôme     de X−2      antagoniste de X+3
//     protecteur de X−10     front       de X−4
// et rien n'empêche X d'être en plus R1 ou R7 du thème.
// Vérifié sur les 16 figures : le rôle d'antagoniste porte 16/16 sur l'AUTRE
// boucle (décalage impair), les trois rôles alliés 48/48 sur la MÊME boucle
// (décalages pairs +2, +10, +4). Un rôle hostile hors boucle et trois rôles
// alliés en boucle ne se contredisent donc jamais : ils ne s'adressent pas
// aux mêmes figures.
// Exemple qui a motivé la règle (cas Inter) : Acquisitio est protecteur de Via
// (boucle A, la sienne) ET antagoniste de Laetitia (boucle B) — normal, pas
// contradictoire. Elle est en outre binôme de Cauda Draconis et front de
// Conjonctio.
// ⚠️ CONSÉQUENCE DE DOCTRINE : l'hypothèse « une figure n'a qu'une action à
// la fois, donc celle qui attaque ne protège plus » est ÉCARTÉE. Aucun
// calcul ne doit désactiver un rôle parce que la figure en tient un autre.
// C'est aussi ce que la mesure disait déjà : toute pénalité sur les pôles
// tenus (×0,75 / ×0,50 / ×0,25 / ×0) casse le cas Inter ; seul ×1,00 garde 3/3.
function rolesDeLaFigureV7(fig) {
  const i = FIGS_V7.indexOf(fig);
  if (i < 0) return null;
  const a = function (d) { return FIGS_V7[(i + d + 16) % 16]; };
  return {
    figure: fig,
    // ce que la figure SUBIT (ses propres pôles)
    binome: a(2), antagoniste: a(-3), protecteur: a(10), front: a(4),
    // ce que la figure EXERCE sur les autres — les quatre rôles simultanés
    binomeDe: a(-2), antagonisteDe: a(3), protecteurDe: a(-10), frontDe: a(-4)
  };
}

// MAINTENANCE (03/09/26) : alias de ELEMENTS (ligne ~2966), voir la note sur
// FIGS_V7/BINOMES_V7/ANTAGONISTES_V7 ci-dessus — même raison, même correctif.
const ELEMENTS_V7 = ELEMENTS;
const ELEMENT_OF_HOUSE = {1:'feu',5:'feu',9:'feu',13:'feu', 2:'air',6:'air',10:'air',14:'air', 3:'eau',7:'eau',11:'eau',15:'eau', 4:'terre',8:'terre',12:'terre',16:'terre'};


// ═══════════════════════════════════════════════════════════════
// CAPACITÉ DE MARQUAGE PAR FIGURE (buts min/max)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// COMPÉTITIONS — coefficient d'enjeu et impact sur le moteur
// ═══════════════════════════════════════════════════════════════
const COMPETITION_REGIONS = {
  "Angleterre": [
    {value:"eng_pl", label:"Premier League", tier:1},
    {value:"eng_champ", label:"Championship", tier:2},
    {value:"eng_l1", label:"League One", tier:3},
    {value:"eng_l2", label:"League Two", tier:3},
  ],
  "Espagne": [
    {value:"esp_liga", label:"La Liga", tier:1},
    {value:"esp_liga2", label:"La Liga 2", tier:2},
  ],
  "Italie": [
    {value:"ita_seriea", label:"Serie A", tier:1},
    {value:"ita_serieb", label:"Serie B", tier:2},
  ],
  "France": [
    {value:"fra_l1", label:"Ligue 1", tier:1},
    {value:"fra_l2", label:"Ligue 2", tier:2},
    {value:"fra_nat", label:"National", tier:3},
  ],
  "Allemagne": [
    {value:"ger_bund", label:"Bundesliga", tier:1},
    {value:"ger_bund2", label:"2. Bundesliga", tier:2},
    {value:"ger_liga3", label:"3. Liga", tier:3},
  ],
  "Pays-Bas": [
    {value:"ned_ere", label:"Eredivisie", tier:1},
    {value:"ned_eerste", label:"Eerste Divisie", tier:2},
  ],
  "Portugal": [
    {value:"por_primeira", label:"Primeira Liga", tier:1},
    {value:"por_liga2", label:"Liga Portugal 2", tier:2},
  ],
  "Belgique": [
    {value:"bel_jupiler", label:"Jupiler Pro League", tier:1},
    {value:"bel_challenger", label:"Challenger Pro League", tier:2},
  ],
  "Écosse": [
    {value:"sco_prem", label:"Premiership", tier:1},
    {value:"sco_champ", label:"Championship", tier:2},
  ],
  "Suisse": [
    {value:"sui_super", label:"Super League", tier:1},
    {value:"sui_challenge", label:"Challenge League", tier:2},
  ],
  "Autriche": [
    {value:"aut_bund", label:"Bundesliga", tier:1},
    {value:"aut_liga2", label:"2. Liga", tier:2},
  ],
  "Turquie": [
    {value:"tur_super", label:"Süper Lig", tier:1},
    {value:"tur_lig1", label:"1. Lig", tier:2},
  ],
  "Grèce": [
    {value:"gre_super", label:"Super League", tier:1},
    {value:"gre_super2", label:"Super League 2", tier:2},
  ],
  "Danemark": [
    {value:"den_super", label:"Superliga", tier:1},
  ],
  "Suède": [
    {value:"swe_alls", label:"Allsvenskan", tier:1},
  ],
  "Norvège": [
    {value:"nor_elite", label:"Eliteserien", tier:1},
  ],
  "Finlande": [
    {value:"fin_veikkaus", label:"Veikkausliiga", tier:1},
  ],
  "Pologne": [
    {value:"pol_ekstra", label:"Ekstraklasa", tier:1},
  ],
  "République tchèque": [
    {value:"cze_chance", label:"Chance Liga", tier:1},
  ],
  "Croatie": [
    {value:"cro_hnl", label:"HNL", tier:1},
  ],
  "Serbie": [
    {value:"srb_super", label:"SuperLiga", tier:1},
  ],
  "Roumanie": [
    {value:"rou_liga1", label:"Liga I", tier:1},
  ],
  "Hongrie": [
    {value:"hun_nb1", label:"NB I", tier:1},
  ],
  "Bulgarie": [
    {value:"bul_first", label:"First League", tier:1},
  ],
  "Russie": [
    {value:"rus_rpl", label:"Premier League russe (RPL)", tier:1},
  ],
  "Ukraine": [
    {value:"ukr_prem", label:"Premier League", tier:1},
  ],
  "Irlande": [
    {value:"irl_prem", label:"Premier Division", tier:1},
  ],
  "Irlande du Nord": [
    {value:"nir_prem", label:"NIFL Premiership", tier:1},
  ],
  "Pays de Galles": [
    {value:"wal_cymru", label:"Cymru Premier", tier:1},
  ],
  "Islande": [
    {value:"isl_besta", label:"Besta deild karla", tier:1},
  ],
  "Brésil": [
    {value:"bra_seriea", label:"Brasileirão Série A", tier:1},
    {value:"bra_serieb", label:"Série B", tier:2},
  ],
  "Argentine": [
    {value:"arg_primera", label:"Primera División", tier:1},
    {value:"arg_nacional", label:"Primera Nacional", tier:2},
  ],
  "États-Unis": [
    {value:"usa_mls", label:"Major League Soccer", tier:1},
    {value:"usa_usl", label:"USL Championship", tier:2},
  ],
  "Mexique": [
    {value:"mex_ligamx", label:"Liga MX", tier:1},
    {value:"mex_expansion", label:"Liga de Expansión MX", tier:2},
  ],
  "Colombie": [
    {value:"col_primeraa", label:"Categoría Primera A", tier:1},
  ],
  "Chili": [
    {value:"chi_primera", label:"Primera División", tier:1},
  ],
  "Uruguay": [
    {value:"uru_primera", label:"Primera División", tier:1},
  ],
  "Paraguay": [
    {value:"par_primera", label:"Primera División", tier:1},
  ],
  "Pérou": [
    {value:"per_liga1", label:"Liga 1", tier:1},
  ],
  "Équateur": [
    {value:"ecu_seriea", label:"Serie A", tier:1},
  ],
  "Bolivie": [
    {value:"bol_profesional", label:"División Profesional", tier:1},
  ],
  "Venezuela": [
    {value:"ven_primera", label:"Primera División", tier:1},
  ],
  "Maroc": [
    {value:"mar_botola", label:"Botola Pro", tier:1},
  ],
  "Algérie": [
    {value:"alg_ligue1", label:"Ligue 1", tier:1},
  ],
  "Tunisie": [
    {value:"tun_ligue1", label:"Ligue Professionnelle 1", tier:1},
  ],
  "Égypte": [
    {value:"egy_prem", label:"Premier League", tier:1},
  ],
  "Afrique du Sud": [
    {value:"rsa_prem", label:"Premiership", tier:1},
  ],
  "Nigeria": [
    {value:"nga_prem", label:"Premier Football League", tier:1},
  ],
  "Ghana": [
    {value:"gha_prem", label:"Premier League", tier:1},
  ],
  "Sénégal": [
    {value:"sen_ligue1", label:"Ligue 1", tier:1},
  ],
  "Côte d'Ivoire": [
    {value:"civ_ligue1", label:"Ligue 1", tier:1},
  ],
  "Cameroun": [
    {value:"cmr_elite1", label:"Elite One", tier:1},
  ],
  "Arabie saoudite": [
    {value:"ksa_pro", label:"Saudi Pro League", tier:1},
  ],
  "Émirats arabes unis": [
    {value:"uae_pro", label:"UAE Pro League", tier:1},
  ],
  "Qatar": [
    {value:"qat_stars", label:"Stars League", tier:1},
  ],
  "Iran": [
    {value:"irn_persian", label:"Persian Gulf Pro League", tier:1},
  ],
  "Irak": [
    {value:"irq_stars", label:"Stars League", tier:1},
  ],
  "Japon": [
    {value:"jpn_j1", label:"J1 League", tier:1},
  ],
  "Corée du Sud": [
    {value:"kor_k1", label:"K League 1", tier:1},
  ],
  "Chine": [
    {value:"chn_super", label:"Super League", tier:1},
  ],
  "Inde": [
    {value:"ind_isl", label:"Indian Super League", tier:1},
  ],
  "Thaïlande": [
    {value:"tha_t1", label:"Thai League 1", tier:1},
  ],
  "Indonésie": [
    {value:"idn_liga1", label:"Liga 1", tier:1},
  ],
  "Malaisie": [
    {value:"mys_super", label:"Super League", tier:1},
  ],
  "Australie": [
    {value:"aus_aleague", label:"A-League Men", tier:1},
  ],
  "Nouvelle-Zélande": [
    {value:"nzl_national", label:"National League", tier:1},
  ],
  "Compétitions internationales": [
    {value:"uefa_cl", label:"Ligue des champions de l'UEFA", tier:4},
    {value:"uefa_el", label:"Ligue Europa", tier:4},
    {value:"uefa_ecl", label:"Ligue Conférence", tier:4},
    {value:"uefa_super", label:"Supercoupe de l'UEFA", tier:4},
    {value:"fifa_wc", label:"Coupe du monde de la FIFA", tier:5},
    {value:"fifa_cwc", label:"Coupe du monde des clubs", tier:5},
    {value:"uefa_euro", label:"Championnat d'Europe (Euro)", tier:5},
    {value:"caf_cl", label:"Ligue des champions de la CAF", tier:4},
    {value:"caf_cc", label:"Coupe de la Confédération CAF", tier:4},
    {value:"caf_can", label:"Coupe d'Afrique des nations (CAN)", tier:5},
    {value:"conmebol_lib", label:"Copa Libertadores", tier:4},
    {value:"conmebol_sud", label:"Copa Sudamericana", tier:4},
    {value:"conmebol_america", label:"Copa América", tier:5},
    {value:"concacaf_cl", label:"Coupe des champions de la CONCACAF", tier:4},
    {value:"concacaf_gc", label:"Gold Cup", tier:5},
    {value:"afc_cl_elite", label:"Ligue des champions Élite de l'AFC", tier:4},
    {value:"afc_cup", label:"Coupe d'Asie de l'AFC", tier:4},
    {value:"ofc_cl", label:"Ligue des champions de l'OFC", tier:4},
  ],
  "E-Sport": [
    {value:"esport_fc26_rush", label:"FC 26 — 5x5 Rush — Superligue", tier:7},
    {value:"esport_fc24_angleterre", label:"FC 24 — 4x4 — Championnat d'Angleterre", tier:7},
    {value:"esport_fc25_conference", label:"FC 25 — 3x3 — Ligue de Conférence", tier:7},
    {value:"esport_fc26_cl", label:"FC 26 — Champions League", tier:6},
    {value:"esport_fc26_monde", label:"FC 26 — Championnat du monde", tier:6},
    {value:"esport_fc25_cl", label:"FC 25 — Champions League", tier:6},
    {value:"esport_fc25_italy", label:"FC 25 — Italy Championship", tier:6},
    {value:"esport_fc25_espagne", label:"FC 25 — Championnat d'Espagne", tier:6},
    {value:"esport_fc25_penalty", label:"FC 25 — Penalty", tier:7},
  ],
  "Autres": [
    {value:"amical_club", label:"Amical club", tier:6},
    {value:"amical_selection", label:"Amical sélection", tier:6},
  ],
};

// Coefficients enjeu/tension derives du tier
//  tier 1 = championnat elite national, 2 = second niveau, 3 = troisieme niveau,
//  4 = competition de clubs internationale (C1/C3/Libertadores...), 5 = selection majeure (Mondial/Euro/CAN...)
const TIER_CONFIG = {
  1: {enjeu:1.0,  tension:1.0,  multButs:1.0},
  2: {enjeu:0.9,  tension:0.9,  multButs:1.0},
  3: {enjeu:0.8,  tension:0.8,  multButs:1.0},
  4: {enjeu:1.2,  tension:1.25, multButs:1.0},
  5: {enjeu:1.3,  tension:1.35, multButs:1.0},
  6: {enjeu:0.7,  tension:0.6,  multButs:1.0},
  7: {enjeu:1.5,  tension:1.4,  multButs:2.5} // formats arcade (Rush, 3x3, 4x4) : scores naturellement tres eleves
};

// Index value -> {label, tier} pour acces rapide
const COMPETITION_INDEX = {};
Object.keys(COMPETITION_REGIONS).forEach(function(region) {
  COMPETITION_REGIONS[region].forEach(function(item) {
    COMPETITION_INDEX[item.value] = {label:item.label, tier:item.tier, region:region};
  });
});

function getCompetitionConfig(competitionOverride) {
  var val = competitionOverride;
  if (val === undefined) { var sel = document.getElementById('competitionMode'); val = sel ? sel.value : 'fra_l1'; }
  var entry = COMPETITION_INDEX[val] || COMPETITION_INDEX['fra_l1'] || {label:'France — Ligue 1', tier:1};
  var tc = TIER_CONFIG[entry.tier] || TIER_CONFIG[1];
  return {label:entry.label, enjeu:tc.enjeu, tension:tc.tension, multButs:tc.multButs||1.0, tier:entry.tier};
}

function populateCompetitionRegions() {
  var regionSel = document.getElementById('competitionRegion');
  if (!regionSel) return;
  regionSel.innerHTML = Object.keys(COMPETITION_REGIONS).map(function(r) {
    return '<option value="'+r+'">'+r+'</option>';
  }).join('');
  updateCompetitionList();
}

function updateCompetitionList() {
  var regionSel = document.getElementById('competitionRegion');
  var compSel = document.getElementById('competitionMode');
  if (!regionSel || !compSel) return;
  var region = regionSel.value;
  var items = COMPETITION_REGIONS[region] || [];
  compSel.innerHTML = items.map(function(it) {
    return '<option value="'+it.value+'">'+it.label+'</option>';
  }).join('');
}

const BUTS_FIGURE = {
  puella:         {min:2, max:2, label:'2'},
  albus:          {min:2, max:4, label:'2-4'},
  puer:           {min:1, max:2, label:'1-2', concede:true},
  rubeus:         {min:1, max:3, label:'1-3', instable:true},
  fortuna_major:  {min:3, max:5, label:'3-5'},
  fortuna_minor:  {min:1, max:2, label:'1-2', fragile:true},
  laetitia:       {min:2, max:3, label:'2-3'},
  acquisitio:     {min:2, max:3, label:'2-3'},
  cauda_draconis: {min:1, max:2, label:'1-2', destructeur:true},
  caput_draconis: {min:0, max:1, label:'0-1'},
  tristitia:      {min:0, max:1, label:'0-1'},
  amissio:        {min:0, max:1, label:'0-1', concede:true},
  conjunctio:     {min:0, max:1, label:'0-1'},
  via:            {min:0, max:1, label:'0-1'},
  carcer:         {min:0, max:0, label:'0'},
  populus:        {min:0, max:0, label:'0'}
};

/**
 * Retourne le nombre de buts prédit pour une figure à une position,
 * en tenant compte de si elle peut marquer (canScore) et du score net.
 */



// ═══════════════════════════════════════════════════════════════
// CLASSIFICATIONS TRADITIONNELLES DES FIGURES
// Force / Ouverture / Mobilité / Active-Passive
// ═══════════════════════════════════════════════════════════════

const FORCE_FIGURE = {
  fortuna_major:'forte', acquisitio:'forte', laetitia:'forte', caput_draconis:'forte',
  albus:'forte', puella:'forte', populus:'forte', conjunctio:'forte',
  fortuna_minor:'faible', amissio:'faible', tristitia:'faible', cauda_draconis:'faible',
  rubeus:'faible', puer:'faible', via:'faible', carcer:'faible'
};

const OUVERTURE_FIGURE = {
  puer:'ouverte', puella:'ouverte', rubeus:'ouverte', albus:'ouverte',
  cauda_draconis:'ouverte', laetitia:'ouverte', acquisitio:'ouverte', via:'ouverte',
  fortuna_minor:'fermee', fortuna_major:'fermee', caput_draconis:'fermee', tristitia:'fermee',
  amissio:'fermee', populus:'fermee', conjunctio:'fermee', carcer:'fermee'
};

const MOBILITE_FIGURE = {
  puer:'mobile', puella:'mobile', rubeus:'mobile', albus:'mobile',
  via:'mobile', populus:'mobile', fortuna_minor:'mobile', fortuna_major:'mobile',
  cauda_draconis:'fixe', caput_draconis:'fixe', laetitia:'fixe', tristitia:'fixe',
  conjunctio:'fixe', carcer:'fixe', acquisitio:'fixe', amissio:'fixe'
};

const ACTIVE_PASSIVE_FIGURE = {
  puer:'active', rubeus:'active', fortuna_minor:'active', cauda_draconis:'active',
  laetitia:'active', acquisitio:'active', via:'active', conjunctio:'active',
  puella:'passive', albus:'passive', fortuna_major:'passive', caput_draconis:'passive',
  tristitia:'passive', amissio:'passive', populus:'passive', carcer:'passive'
};

function isOuverte(fig) { return OUVERTURE_FIGURE[fig] === 'ouverte'; }
function isActive(fig)  { return ACTIVE_PASSIVE_FIGURE[fig] === 'active'; }
function isForte(fig)   { return FORCE_FIGURE[fig] === 'forte'; }
function isMobile(fig)  { return MOBILITE_FIGURE[fig] === 'mobile'; }

// MAINTENANCE (03/09/26) : alias de MAISON_ELEM (ligne ~2974), même raison
// que FIGS_V7/BINOMES_V7/ANTAGONISTES_V7/ELEMENTS_V7 ci-dessus.
const MAISON_ELEM_V7 = MAISON_ELEM;

// ═══════════════════════════════════════════════════════════════
// AUTO-TEST TABLES LEGACY vs V7 (revue contradictions) — ELEMENTS/
// BINOMES/ANTAGONISTES/MAISON_ELEM et leurs équivalents _V7 étaient deux
// tables distinctes à maintenir en parallèle (déjà prises en flagrant
// délit de désynchronisation par le passé). MAINTENANCE (03/09/26) : les
// _V7 sont désormais des alias directs des tables legacy (même objet en
// mémoire) — cette divergence n'est plus possible par construction. Le
// test est conservé tel quel comme garde-fou bon marché si une future
// modification réintroduisait deux tables séparées par erreur.
// ═══════════════════════════════════════════════════════════════
function autoTestTablesLegacyVsV7() {
  var mismatches = [];
  FIGS.forEach(function(f) {
    if (ELEMENTS[f] !== ELEMENTS_V7[f]) mismatches.push('ELEMENTS/' + f + ' : ' + ELEMENTS[f] + ' ≠ ' + ELEMENTS_V7[f]);
    if (BINOMES[f] !== BINOMES_V7[f]) mismatches.push('BINOMES/' + f + ' : ' + BINOMES[f] + ' ≠ ' + BINOMES_V7[f]);
    if (ANTAGONISTES[f] !== ANTAGONISTES_V7[f]) mismatches.push('ANTAGONISTES/' + f + ' : ' + ANTAGONISTES[f] + ' ≠ ' + ANTAGONISTES_V7[f]);
  });
  for (var p = 1; p <= 16; p++) {
    if (MAISON_ELEM[p] !== MAISON_ELEM_V7[p]) mismatches.push('MAISON_ELEM/M' + p + ' : ' + MAISON_ELEM[p] + ' ≠ ' + MAISON_ELEM_V7[p]);
  }
  return { ok: mismatches.length === 0, mismatches: mismatches };
}
autoTestV7('tables legacy/V7', function() {
  var t = autoTestTablesLegacyVsV7();
  if (!t.ok) { console.warn('⚠️ Tables legacy/V7 désynchronisées :', t.mismatches); }
});


// ═══════════════════════════════════════════════════════════════
// LOI DE LA RÉSULTANTE AU SIÈGE (28/08/26) — table d'Ellemine_D,
// vérifiée sur les 256 couples figure × maison, sans exception.
//
// ÉNONCÉ DE L'UTILISATEUR (M12) : « toute figure qui s'y trouve
// cohabite avec sa figure de front — Puer en M12 résulte Cauda,
// Puella en M12 résulte Laetitia ». VÉRIFIÉ 16/16 : en M12, la
// résultante combine(X, siège de M12) est TOUJOURS à ±4 de X, donc
// dans son quatuor de front. Huit figures donnent front(X), huit
// donnent front⁻¹(X) — ce n'est pas une exception mais la même
// relation lue dans l'autre sens : combine est une involution
// (combine(combine(X,S),S) = X, 256/256), donc la maison APPARIE les
// figures deux à deux ; dire « X donne son front » ou « X est le
// front de sa résultante » décrit le même couple.
// M4 fait exactement la même chose que M12 (même jeu de décalages) :
// la propriété n'appartient pas à M12, elle appartient à son ÉLÉMENT.
//
// ÉNONCÉ DE L'UTILISATEUR (M6) : les seize figures rangées en quatre
// familles, chacune donnant « son Binôme » ou « son Protecteur contre
// Ant ». VÉRIFIÉ : les seize RÉSULTANTES annoncées sont exactes,
// 16/16. Les quatre familles « Maison Feu / Air / Eau / Terre » ne
// sont pas ELEMENTS_V7 (4/16 seulement) mais l'élément de la MAISON
// DE REPOS de chaque figure (16/16) — les quatuors d'index ≡ 0,1,2,3
// mod 4, c'est-à-dire les quatuors de front.
//
// LA LOI GÉNÉRALE QUI CONTIENT LES DEUX :
//   1. parité — maison PAIRE ⇒ décalage PAIR, maison IMPAIRE ⇒
//      décalage IMPAIR (256/256). Donc en maison paire X et sa
//      résultante restent dans la même boucle et l'un est dans le
//      camp de l'autre (256/256) ; en maison impaire la résultante
//      vient toujours d'en face.
//   2. élément de la maison — TERRE ⇒ décalage ≡ 0 mod 4 (identité,
//      front, front du front : M16 rend X, M8 donne toujours le front
//      du front, M4 et M12 le front) ; AIR ⇒ décalage ≡ 2 mod 4
//      (binôme ou bouclier : M2 binôme, M10 bouclier, M6 et M14 les
//      deux) ; FEU et EAU ⇒ décalage impair. 256/256.
//   3. période 8 — X et son front du front réagissent à l'identique
//      dans TOUTE maison (256/256), conséquence de X ⊕ Tristitia =
//      front du front(X).
//
// CONSÉQUENCE POUR LES INCIDENTS : la résultante d'une figure à son
// siège n'est son AGRESSEUR ou sa VICTIME (±3) que dans cinq maisons,
// toutes feu ou eau — M1, M3, M11 (8 figures sur 16) et M5, M13
// (4/16). Aucune maison AIR ni TERRE n'en produit : 0/128. M6, M8 et
// M12 sont donc structurellement incapables d'engendrer une agression
// par résultante ; si elles pèsent sur un incident, c'est par
// cohabitation/discordance d'élément, pas par ce qu'elles engendrent.
// ═══════════════════════════════════════════════════════════════
function autoTestLoiMaisonV7() {
  var idx = {};
  FIGS_V7.forEach(function(f, i) { idx[f] = i; });
  var lois = [
    { nom: 'parité maison ↔ parité du décalage', ok: 0 },
    { nom: 'terre ≡0 mod 4, air ≡2 mod 4, feu/eau impair', ok: 0 },
    { nom: 'X et son front du front réagissent pareil', ok: 0 },
    { nom: 'maison paire ⟺ même boucle', ok: 0 },
    { nom: 'maison paire ⟺ l\'un est dans le camp de l\'autre', ok: 0 },
    { nom: 'involution : la maison rend X', ok: 0 }
  ];
  var total = 0;
  for (var h = 1; h <= 16; h++) {
    var siege = FIGS_V7[h - 1], pair = (h % 2 === 0), elem = MAISON_ELEM_V7[h];
    for (var i = 0; i < 16; i++) {
      total++;
      var f = FIGS_V7[i], r = combine(f, siege);
      var k = ((idx[r] - i) % 16 + 16) % 16;
      if (pair === (k % 2 === 0)) lois[0].ok++;
      if (elem === 'terre' ? k % 4 === 0 : elem === 'air' ? k % 4 === 2 : k % 2 === 1) lois[1].ok++;
      var f8 = FIGS_V7[(i + 8) % 16];
      if (((idx[combine(f8, siege)] - (i + 8)) % 16 + 16) % 16 === k) lois[2].ok++;
      if (pair === ((i % 2) === (idx[r] % 2))) lois[3].ok++;
      var lie = campDeV7(f).indexOf(r) >= 0 || campDeV7(r).indexOf(f) >= 0;
      if (pair === lie) lois[4].ok++;
      if (combine(r, siege) === f) lois[5].ok++;
    }
  }
  var fautes = lois.filter(function(l) { return l.ok !== total; });
  return { ok: fautes.length === 0, total: total, lois: lois, fautes: fautes };
}
autoTestV7('loi de la résultante au siège', function() {
  var t = autoTestLoiMaisonV7();
  if (!t.ok) { console.warn('⚠️ Loi de la résultante au siège violée :', t.fautes); }
});

// ═══════════════════════════════════════════════════════════════
// LOI DU TRIPLET → POPULUS (04/09/26, découverte en creusant « Somme des
// 3 axes » puis « Cardinal + Succédent = Cadent » sur demande
// Ellemine_D) — PAS UNE PISTE STATISTIQUE, UNE IDENTITÉ ALGÉBRIQUE DE
// combine() LUI-MÊME, vérifiée EXHAUSTIVEMENT :
//     Pour DEUX figures a, b QUELCONQUES : combine(a, b, combine(a,b))
//     = POPULUS, TOUJOURS (256/256 couples testés, 100%).
// Conséquence directe : n'importe quel triplet parent-parent-enfant de
// l'arbre géomantique (M9+M10+M13, M11+M12+M14, M13+M14+M15,
// M15+M1+M16 — vérifié sur un thème réel) redonne Populus. Et les 3 axes
// du carré (Cardinal, Succédent, Cadent) SE PARTAGENT EXACTEMENT les
// maisons M1-M12 en 3 groupes de 4, donc :
//     Cardinal ⊕ Succédent = Cadent   (et les 2 permutations)
// sont aussi des identités à 100% (65 536/65 536 thèmes testés) — PAS
// une propriété du hasard des figures tirées, une propriété de la
// PARTITION des maisons.
// ⚠️ CE QUE ÇA CORRIGE : coincidenceJugeAxesV7, plus bas, compare le
// Juge à combineMany([Cardinal, Succédent, Cadent]) — et cette somme
// est TOUJOURS Populus, quel que soit le thème (loi ci-dessus). Le
// commentaire d'origine parlait d'un « lien structurel partiel » entre
// le Juge et « l'ensemble des 3 axes » ; en réalité la fonction ne
// mesure qu'UNE SEULE CHOSE, plus simple qu'annoncé : la fréquence à
// laquelle le Juge (M15) tombe sur Populus. Le calcul et son résultat
// (8192/65536 = 1/8, deux fois le taux d'une coïncidence entre deux
// figures indépendantes) restent corrects et inchangés — c'est la
// LECTURE qui était trompeuse, pas le nombre.
function loiTripletPopulusV7(a, b) {
  return combineMany([a, b, combine(a, b)]) === 'populus';
}
autoTestV7('loi du triplet → Populus', function() {
  var manque = [];
  FIGS.forEach(function (a) {
    FIGS.forEach(function (b) {
      if (!loiTripletPopulusV7(a, b)) manque.push({ a: a, b: b });
    });
  });
  if (manque.length) { console.warn('⚠️ Loi du triplet → Populus violée :', manque); }
});


// ═══════════════════════════════════════════════════════════════
// PLANÈTES — tradition géomantique arabe médiévale
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// ⚠️ LE SENS DE LECTURE DES ANTAGONISTES (05/09/26) — rectifié par
// Ellemine_D : « Albus n'est pas ennemi de Puer, c'est Puer qui est
// l'ennemi d'Albus. »
//
// ANTAGONISTES_V7[X] NOMME L'AGRESSEUR DE X, pas sa victime.
//     ANTAGONISTES_V7['albus'] === 'puer'   se lit  « Puer agresse Albus »
//     ANTAGONISTES_V7['puer']  === 'puella' se lit  « Puella agresse Puer »
// La table est donc ORIENTÉE, et elle n'est pas symétrique : vérifié sur
// les 16 figures, A[A[f]] !== f dans les 16 cas. Idem pour BINOMES_V7.
//
// ☠️ CONSÉQUENCE POUR TOUT LE FICHIER. Une centaine d'endroits lisent
// ANTAGONISTES_V7[x] === y sans jamais tester ANTAGONISTES_V7[y] === x.
// La moitié des relations est donc invisible au moteur, et un test écrit
// dans le mauvais sens ne mesure pas ce qu'il croit. Je l'ai fait le
// 05/09 : j'ai testé « le chef voit sa défense comme ennemie » alors que
// l'exemple d'Ellemine_D dit l'inverse — « la défense a le chef pour
// agresseur ». Les deux lectures donnent des groupes différents.
// Audit non fait : chantier ouvert au registre des pistes.
//
// ── L'HYPOTHÈSE DE L'ÉPARGNE, TESTÉE ET NON CONCLUANTE ──
// « Est-il possible que Puer, au lieu de détruire, épargne, car Albus est
// dans le camp de Puer ? » Faute de savoir ce qui met une FIGURE dans le
// camp d'une autre — Puer et Albus ne partagent ni l'élément (feu/eau),
// ni la planète (Mars/Mercure), ni le binôme, ni la boucle (A contre B) —
// j'ai lu « camp » comme la MAISON occupée : une figure dont l'agresseur
// est le chef du camp auquel sa maison appartient serait épargnée.
// Sur 118 observations (deux camps par match) :
//     ≥1 maison épargnée par son propre chef ... 48,7 % contre 36,7 %  p = 0,236
//     ≥2 épargnées ............................ 16,7 % (n=6) contre 42,0 %
//     ≥1 agressée par le chef adverse ......... 41,9 % contre 40,0 %  p = 0,848
//     plus d'épargnées que d'agressées ........ 46,7 % contre 38,6 %  p = 0,520
// Direction juste sur la première, rien de significatif. ⚠️ ET MON
// OPÉRATIONNALISATION EST PEUT-ÊTRE FAUSSE : si « le camp de Puer » ne
// désigne pas la maison occupée, ce test ne teste pas sa règle. À
// reprendre quand la définition sera fixée.
//
// ── CE QUI SORT, EN REVANCHE : LAETITIA EN M2 ──
// « quand Laetitia est en m2, très souvent m1 gagne. »
//     Laetitia en M2 → R1 ..... 100 % (3/3) contre 42,9 %   p = 0,090
//   et le contrôle POSITIONNEL passe, ce qui est rare :
//     Laetitia en M8 (la ressource de M7) → R1 ... 50 % (3/6) contre 45,3 %  p = 1,000
//     Laetitia n'importe où en I-XII → R1 ........ 50 % (14/28) contre 41,9 % p = 0,606
// L'effet n'est donc pas « Laetitia favorise M1 » : il est propre à M2.
// n = 3 — c'est une piste à inscrire d'avance, pas un résultat. M2 est la
// ressource de M1 et M9 = M1 ⊕ M2 : la maison touche directement celle du
// rythme, la seule qui ait survécu à Bonferroni cette semaine.
// ═══════════════════════════════════════════════════════════════
const PLANETES_V7 = {
  puer:'Mars', rubeus:'Mars', cauda_draconis:'Mars',
  puella:'Vénus', amissio:'Vénus', caput_draconis:'Vénus',
  albus:'Mercure', conjunctio:'Mercure',
  populus:'Lune', via:'Lune',
  fortuna_major:'Soleil', fortuna_minor:'Soleil',
  acquisitio:'Jupiter', laetitia:'Jupiter',
  carcer:'Saturne', tristitia:'Saturne'
};

const PLANETE_SYMB = {'Mars':'\u2642','Vénus':'\u2640','Mercure':'\u263f','Lune':'\u263d','Soleil':'\u2609','Jupiter':'\u2643','Saturne':'\u2644'};
const PLANETE_COLOR = {'Mars':'#ef4444','Vénus':'#f472b6','Mercure':'#fbbf24','Lune':'#e2e8f0','Soleil':'#fb923c','Jupiter':'#60a5fa','Saturne':'#94a3b8'};
const PLANETE_ROLE = {'Mars':'Action / Buts / Duels','Vénus':'Contrôle / Technique / Équilibre','Mercure':'Vitesse / Passes / Transitions','Lune':'Réactions / Imprévisible / Flux','Soleil':'Leadership / Domination / Éclat','Jupiter':'Expansion / Chance / Efficacité','Saturne':'Défense / Blocage / Rigueur'};

// ═══════════════════════════════════════════════════════════════
// DIGNITÉS ESSENTIELLES PLANÉTAIRES (03/08/26, doctrine horaire classique
// importée d'une consultation OracleSanctum) — table doctrinale fournie
// telle quelle (7 planètes x 7 statuts : Maître/Exalt./Triplicité/Terme/
// Face/Détriment/Chute). ATTENTION : contrairement à l'astrologie
// zodiacale classique où les dignités se lisent par SIGNE, cette table
// est réduite à une correspondance planète→planète directe (sans signe),
// adaptée au système géomantique qui n'a pas de zodiaque. Statut :
// NOUVEAU, non validé empiriquement — signal d'étude uniquement, ne pèse
// sur aucun verdict tant que non contre-testé sur l'archive.
// ═══════════════════════════════════════════════════════════════
const PLANETARY_DIGNITIES = {
  'Lune':    {ruler:'Mars',    exalt:'Soleil',  trip:'Jupiter', term:'Jupiter', face:'Mars',    detr:'Vénus',   fall:'Saturne'},
  'Mercure': {ruler:'Lune',    exalt:'Jupiter', trip:'Mars',    term:'Vénus',   face:'Lune',    detr:'Saturne', fall:'Mars'},
  'Vénus':   {ruler:'Mercure', exalt:'Mercure', trip:'Lune',    term:'Mars',    face:'Mercure', detr:'Jupiter', fall:'Vénus'},
  'Soleil':  {ruler:'Soleil',  exalt:null,      trip:'Jupiter', term:'Mercure', face:'Jupiter', detr:'Saturne', fall:null},
  'Mars':    {ruler:'Mercure', exalt:null,      trip:'Mercure', term:'Saturne', face:'Soleil',  detr:'Jupiter', fall:null},
  'Jupiter': {ruler:'Soleil',  exalt:null,      trip:'Jupiter', term:'Mercure', face:'Saturne', detr:'Saturne', fall:null},
  'Saturne': {ruler:'Mars',    exalt:'Soleil',  trip:'Jupiter', term:'Mercure', face:'Soleil',  detr:'Vénus',   fall:'Saturne'}
};
const DIGNITE_LABELS = {ruler:'Maître (domicile)', exalt:'Exaltation', trip:'Triplicité', term:'Terme', face:'Face', detr:'Détriment', fall:'Chute'};
const DIGNITE_SCORES = {ruler:5, exalt:4, trip:3, term:2, face:1, detr:-5, fall:-4};

// Évalue le statut de digniteTestee dans la ligne doctrinale de planeteRef.
// Ex: evaluerDigniteEssentielle('Mars','Lune') -> Mars est le "Maître"
// (ruler) de la ligne Lune -> score +5, statut fort.
function evaluerDigniteEssentielle(planeteTestee, planeteRef) {
  var ligne = PLANETARY_DIGNITIES[planeteRef];
  if (!ligne || !planeteTestee) return {statut:null, label:'Aucune relation notable', score:0};
  for (var cle in ligne) {
    if (ligne[cle] === planeteTestee) {
      return {statut:cle, label:DIGNITE_LABELS[cle], score:DIGNITE_SCORES[cle]};
    }
  }
  return {statut:null, label:'Peregrin (aucune dignité)', score:0};
}

// ═══════════════════════════════════════════════════════════════
// CORRESPONDANCE MAISON → PLANÈTE (03/08/26, doctrine horaire classique,
// règne naturel des maisons I-XII sur le zodiaque traditionnel, limité aux
// 7 planètes classiques — cohérent avec PLANETARY_DIGNITIES). M13-16
// (Témoins, Juge, Réconciliation) volontairement LAISSÉES SANS RÉGENCE
// pour l'instant (demande explicite Ellemine_D, 03/08/26 : "ignore les on
// y reviendra") — aucune valeur ne doit être inventée pour ces 4 maisons.
// ═══════════════════════════════════════════════════════════════
const MAISON_PLANETE = {
  1:'Mars', 2:'Vénus', 3:'Mercure', 4:'Lune', 5:'Soleil', 6:'Mercure',
  7:'Vénus', 8:'Mars', 9:'Jupiter', 10:'Saturne', 11:'Saturne', 12:'Jupiter'
  // 13,14,15,16 : non définies (en attente doctrine)
};

// CATÉGORISATION ANGULAIRE / SUCCÉDENTE / CADENTE (03/08/26, doctrine
// horaire classique). M1+M4+M7+M10 = angulaires (déjà l'Axe Cardinal
// existant). M2+M5+M8+M11 = succédentes (Axe Succédent). M3+M6+M9+M12 =
// cadentes (Axe Cadent). M13-16 non classées (figures de synthèse sans
// équivalent classique à 12 maisons).
const MAISON_CATEGORIE = {
  1:'angulaire', 4:'angulaire', 7:'angulaire', 10:'angulaire',
  2:'succedente', 5:'succedente', 8:'succedente', 11:'succedente',
  3:'cadente', 6:'cadente', 9:'cadente', 12:'cadente'
};
// Barème simplifié à un seul palier par catégorie (03/08/26, PAS le barème
// complet de Lilly qui varie maison par maison au sein d'une même
// catégorie — simplification volontaire pour rester lisible; à raffiner
// si le contre-test sur l'archive le justifie).
const CATEGORIE_SCORE = {angulaire:5, succedente:2, cadente:-3};

// DIGNITÉ ACCIDENTELLE ENRICHIE (03/08/26, 📚 étude non validée) — combine
// deux composantes indépendantes pour la planète régissant la figure en
// maison `posFig` :
//   1) la force positionnelle de la maison elle-même (angulaire/succédente/cadente)
//   2) la dignité essentielle de la planète-figure vis-à-vis de la planète
//      régente NATURELLE de cette maison (ex: Mars en M1 = "chez lui",
//      Mercure en M1 = peregrin ou en détriment selon la table)
// Score total informatif — n'affecte aucun verdict tant que non validé.
function calculerDigniteAccidentelle(posFig, fig, theme) {
  // ☠️ GARDE-FOU (03/09/26) — CETTE FONCTION RENDAIT UN SCORE PARTIEL
  // PLAUSIBLE SUR UN NOM NON CANONIQUE, SANS RIEN DIRE.
  // Ses trois tables (PLANETES_V7, FIGURE_ELEMENT_CODE, FIGS_V7) sont
  // toutes indexées par identifiant canonique ('carcer', 'conjunctio',
  // 'fortuna_minor'). Passez-lui un nom d'affichage ("Carcer",
  // "Conjonctio", "Fortuna minor") et les trois rendent undefined : la
  // régence tombe à 0, la concordance à 0, le repos n'est jamais
  // reconnu — il ne reste que le score de catégorie, et le total sort
  // sans la moindre erreur.
  //     calculerDigniteAccidentelle(1,'Carcer',t) -> 5    (cat 5 · rég 0 · conc 0)
  //     calculerDigniteAccidentelle(1,'carcer',t) -> 8.25 (cat 5 · rég 2 · conc 1.25)
  // C'est exactement le piège qui avait déjà fait rendre "via" au lieu
  // de "acquisitio" à combineMany. Désormais elle REFUSE au lieu de
  // deviner : total null, champ erreur rempli, l'appelant voit la panne.
  if (fig && typeof FIGS_V7 !== 'undefined' && FIGS_V7.indexOf(fig) < 0) {
    return {
      posFig: posFig, fig: fig, planeteFig: null,
      erreur: 'figure hors table : ' + fig + ' — nom non canonique, dignité refusée',
      categorie: MAISON_CATEGORIE[posFig] || null, scoreCategorie: 0,
      planeteNaturelle: null,
      regence: { statut: null, label: 'refusée (nom non canonique)', score: 0 },
      concordanceBonus: 0, concordanceInfo: null, total: null
    };
  }
  var planeteFig = PLANETES_V7[fig];
  var categorie = MAISON_CATEGORIE[posFig] || null;
  var scoreCategorie = categorie ? CATEGORIE_SCORE[categorie] : 0;
  var planeteNaturelle = MAISON_PLANETE[posFig] || null;
  var regence = planeteNaturelle
    ? evaluerDigniteEssentielle(planeteFig, planeteNaturelle)
    : {statut:null, label:(posFig>=13 ? 'Maison XIII-XVI — régence non définie (en attente)' : 'Régence inconnue'), score:0};

  // CONCORDANCE ÉLÉMENTAIRE GREFFÉE SUR LA DIGNITÉ PLANÉTAIRE (05/08/26,
  // demande explicite Ellemine_D : "fais le on verra ce que ça donne") —
  // ajoute au système planétaire (jusqu'ici indépendant des 4 éléments)
  // un bonus basé sur concordanceElement, même principe que partout
  // ailleurs : repos = plein bonus (+5), sinon pondéré par la concordance
  // (même élément ×1, alliée ×0.5, contraire ×0.25, sans lien ×0) sur une
  // échelle de ±5 — comparable aux autres composantes de cette fonction
  // (scoreCategorie et régence sont aussi sur une échelle ±5).
  // ⚠️ EXPÉRIMENTAL — mélange deux doctrines (planétaire + élémentaire)
  // qui n'ont jamais été combinées avant. Statut ouvertement incertain,
  // à observer plutôt qu'à présumer valide. Rétro-compatible : si theme
  // n'est pas fourni, ce bonus est nul et le comportement est identique
  // à avant le 05/08/26.
  var concordanceBonus = 0, concordanceInfo = null;
  if (theme) {
    var enRepos = (FIGS_V7[posFig-1] === fig);
    if (enRepos) {
      concordanceBonus = 5;
      concordanceInfo = 'repos (plein)';
    } else {
      var figElem = (typeof FIGURE_ELEMENT_CODE !== 'undefined' ? FIGURE_ELEMENT_CODE[fig] : null) || ELEMENTS_V7[fig];
      var maisonElem = MAISON_ELEM_V7[posFig];
      var c = concordanceElement(figElem, maisonElem);
      concordanceBonus = 5 * c;
      concordanceInfo = 'concordance ×' + c;
    }
  }

  return {
    posFig: posFig, fig: fig, planeteFig: planeteFig,
    categorie: categorie, scoreCategorie: scoreCategorie,
    planeteNaturelle: planeteNaturelle, regence: regence,
    concordanceBonus: concordanceBonus, concordanceInfo: concordanceInfo,
    total: scoreCategorie + regence.score + concordanceBonus
  };
}


// ═══════════════════════════════════════════════════════════════
// 🪐 LIAISON PLANÈTE ↔ FIGURE — couche d'étude intégrée
// La planète est la FAMILLE d'énergie; la figure est la FORME
// d'expression de cette énergie. Cette couche est informative et
// n'altère pas verdictFinal tant qu'elle n'est pas contre-testée.
// Doctrine conservée du fichier : PLANETES_V7.
// ═══════════════════════════════════════════════════════════════
const PLANETE_FIGURE_INFO = {
  Mars: {
    figures:['puer','rubeus','cauda_draconis'],
    primaire:'puer',
    effet:'Action, attaque, combat, intensité physique',
    nuances:{
      puer:'initiative, pressing, duel direct, attaque rapide',
      rubeus:'agressivité, excès, tension, risque de faute/carton',
      cauda_draconis:'rupture, retrait, perte de contrôle ou fin brutale'
    }
  },
  Vénus: {
    figures:['puella','amissio','caput_draconis'],
    primaire:'puella',
    effet:'Technique, équilibre, attraction, maîtrise du geste',
    nuances:{
      puella:'technique, finesse, équilibre, jeu posé',
      amissio:'perte, gaspillage, occasions laissées partir',
      caput_draconis:'ouverture, entrée dans une nouvelle dynamique, initiative'
    }
  },
  Mercure: {
    figures:['albus','conjunctio'],
    primaire:'albus',
    effet:'Intelligence de jeu, circulation, passes, transitions',
    nuances:{
      albus:'lecture, passes, précision, adaptation',
      conjunctio:'liaison, combinaison, relais, transition collective'
    }
  },
  Lune: {
    figures:['populus','via'],
    primaire:'populus',
    effet:'Flux, réaction, collectif, variations du match',
    nuances:{
      populus:'collectif, réaction au contexte, mouvement de masse',
      via:'flux, rythme, changement, match qui évolue rapidement'
    }
  },
  Soleil: {
    figures:['fortuna_major','fortuna_minor'],
    primaire:'fortuna_major',
    effet:'Leadership, domination, visibilité, réussite',
    nuances:{
      fortuna_major:'autorité, maîtrise, domination stable',
      fortuna_minor:'effort, avantage circonstanciel, réussite plus instable'
    }
  },
  Jupiter: {
    figures:['acquisitio','laetitia'],
    primaire:'acquisitio',
    effet:'Expansion, gain, opportunité, efficacité',
    nuances:{
      acquisitio:"gain, possession, avantage qui s'accumule",
      laetitia:'expansion, confiance, ouverture, réussite offensive'
    }
  },
  Saturne: {
    figures:['carcer','tristitia'],
    primaire:'carcer',
    effet:'Blocage, défense, rigueur, ralentissement',
    nuances:{
      carcer:'fermeture, bloc, verrou, limitation',
      tristitia:'ralentissement, baisse, lourdeur, difficulté à produire'
    }
  }
};

const PLANETE_FIGURE_RANG = {
  puer:1,rubeus:2,cauda_draconis:3,
  puella:1,amissio:2,caput_draconis:3,
  albus:1,conjunctio:2,
  populus:1,via:2,
  fortuna_major:1,fortuna_minor:2,
  acquisitio:1,laetitia:2,
  carcer:1,tristitia:2
};


// 🔴 MOTEUR INCIDENT R1 ↔ R7 — étude
const INCIDENT_FIGURES_R17={
  puer:{chaos:7,rupture:3,violence:6},rubeus:{chaos:10,rupture:8,violence:10},
  cauda_draconis:{chaos:10,rupture:10,violence:8},tristitia:{chaos:6,rupture:6,violence:3},
  carcer:{chaos:5,rupture:5,violence:4},caput_draconis:{chaos:4,rupture:5,violence:2},
  fortuna_minor:{chaos:5,rupture:4,violence:2}
};
const INCIDENT_EAU_HOUSES_R17=[3,7,11,15];
const INCIDENT_VULNERABLE_HOUSES_R17=[6,12];

function analyserIncidentR1R7(theme){
  if(!theme)return null;
  const repos=getMaisonReposFigure(theme[1]);
  const p1=repos, p7=((repos+5)%16)+1, f1=theme[p1], f7=theme[p7];
  const fp1=calculerForcePlanetaireMaison(p1,theme), fp7=calculerForcePlanetaireMaison(p7,theme);
  function camp(pos,fig,fp){
    const x=INCIDENT_FIGURES_R17[fig]||{chaos:0,rupture:0,violence:0};
    let score=x.chaos+x.rupture+x.violence, sig=[];
    if(INCIDENT_VULNERABLE_HOUSES_R17.includes(pos)){score+=5;sig.push('M6/M12');}
    if(INCIDENT_EAU_HOUSES_R17.includes(pos)){score+=4;sig.push('maison Eau');}
    if(['puer','rubeus','cauda_draconis'].includes(fig)){score+=5;sig.push('Mars');}
    if(fp){if(fp.score>=80){score+=5;sig.push('planète très forte')}else if(fp.score>=65){score+=3;sig.push('planète forte')}}
    return {pos,fig,score,chaos:x.chaos,rupture:x.rupture,violence:x.violence,signaux:sig,fp};
  }
  const r1=camp(p1,f1,fp1),r7=camp(p7,f7,fp7);
  let contradiction=0,raison='aucune';
  if(typeof estPaireEquilibre==='function'&&estPaireEquilibre(f1,f7)){contradiction=5;raison='paire opposée/équilibre'}
  else if(typeof ANTAGONISTES!=='undefined'&&ANTAGONISTES[f1]===f7){contradiction=6;raison='antagonisme direct'}
  const brut=r1.score-r7.score;
  if(brut>0)r1.score+=contradiction;else if(brut<0)r7.score+=contradiction;
  const diff=r1.score-r7.score;
  const campRisque=diff>0?'R1':diff<0?'R7':'égalité';
  const max=Math.max(r1.score,r7.score);
  return {r1,r7,r1Maison:p1,r7Maison:p7,difference:diff,campRisque,
    intensite:Math.abs(diff)>=12?'très forte':Math.abs(diff)>=7?'forte':Math.abs(diff)>=3?'moyenne':'faible',
    nature:max>=24?'rouge':max>=15?'penalty':'faute',contradiction:{score:contradiction,raison}};
}

function toggleIncidentR17Panel(){
  const panel=document.getElementById('incident-r17-panel'); if(!panel)return;
  if(panel.style.display==='none'||!panel.style.display){
    if(!currentTheme){panel.innerHTML='<div class="warn">Lance un thème d’abord.</div>';panel.style.display='block';return;}
    const d=analyserIncidentR1R7(currentTheme);
    panel.innerHTML='<h3>🔴 Incident R1 ↔ R7</h3>'+
      '<div class="muted" style="font-size:11px">Le camp le plus chaotique/contradictoire porte le risque. M6/M12, maisons d’Eau et Mars amplifient le signal.</div>'+
      '<div style="margin-top:10px;line-height:1.7">'+
      '<b>R1</b> = M'+d.r1Maison+' — '+FL[d.r1.fig]+' — score '+d.r1.score+
      '<br><b>R7</b> = M'+d.r7Maison+' — '+FL[d.r7.fig]+' — score '+d.r7.score+
      '<br><b>Camp le plus exposé :</b> '+d.campRisque+
      '<br><b>Écart :</b> '+d.difference+
      '<br><b>Intensité :</b> '+d.intensite+
      '<br><b>Nature théorique :</b> '+d.nature.toUpperCase()+
      '<br><b>Contradiction :</b> '+d.contradiction.raison+
      '</div><div class="force-planet-note">Signal expérimental : il n’écrase pas les règles historiques.</div>';
    panel.style.display='block';
  }else panel.style.display='none';
}

function infoLiaisonPlanetaire(fig){
  var pl = PLANETES_V7[fig];
  var info = PLANETE_FIGURE_INFO[pl];
  if(!pl || !info) return null;
  var rang = PLANETE_FIGURE_RANG[fig] || 1;
  var intensite = rang===1 ? 100 : (rang===2 ? 85 : 70);
  return {
    planete:pl,
    rang:rang,
    intensite:intensite,
    primaire:info.primaire===fig,
    effet:info.effet,
    nuance:(info.nuances && info.nuances[fig]) || ''
  };
}

function calculerForcePlanetaireMaison(posFig, theme){
  if(!theme || !theme[posFig]) return null;
  var fig = theme[posFig];
  var li = infoLiaisonPlanetaire(fig);
  if(!li) return null;

  var planeteMaison = MAISON_PLANETE[posFig] || null;
  var planeteJour = getPlaneteDuJourDuMatch();
  var heureEl = document.getElementById('matchTime');
  var dateEl = document.getElementById('matchDate');
  var planeteHeure = (typeof getPlaneteHeure==='function')
    ? getPlaneteHeure(dateEl ? dateEl.value : '', heureEl ? heureEl.value : '')
    : null;

  var score = li.intensite;
  var signaux = [];

  // 1. La planète de la figure face à la régente naturelle de la maison.
  var digniteMaison = planeteMaison && typeof evaluerDigniteEssentielle==='function'
    ? evaluerDigniteEssentielle(li.planete, planeteMaison)
    : {score:0,label:'Non définie'};

  score += digniteMaison.score * 3;

  // 2. Concordance avec la planète du jour.
  var jourRel = planeteJour ? concordancePlanetaire(li.planete, planeteJour) : null;
  if(jourRel){
    if(jourRel.type==='identique') score += 10;
    else if(jourRel.type==='alliance') score += 6;
    else if(jourRel.type==='neutre') score += 0;
    else if(jourRel.type==='opposition') score -= 8;
  }

  // 3. Heure planétaire : signal supplémentaire, volontairement léger.
  var heureRel = planeteHeure ? concordancePlanetaire(li.planete, planeteHeure) : null;
  if(heureRel){
    if(heureRel.type==='identique') score += 8;
    else if(heureRel.type==='alliance') score += 4;
    else if(heureRel.type==='opposition') score -= 5;
  }

  // 4. Force de la maison.
  var cat = MAISON_CATEGORIE[posFig];
  if(cat==='angulaire') score += 8;
  else if(cat==='succedente') score += 3;
  else if(cat==='cadente') score -= 3;

  // 5. Repos de la figure : la forme est parfaitement installée dans sa maison.
  if(typeof FIGS_V7!=='undefined' && FIGS_V7[posFig-1]===fig){
    score += 8;
    signaux.push('figure en repos');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    maison:posFig,
    figure:fig,
    planete:li.planete,
    rang:li.rang,
    primaire:li.primaire,
    intensiteNaturelle:li.intensite,
    effet:li.effet,
    nuance:li.nuance,
    regenteMaison:planeteMaison,
    digniteMaison:digniteMaison,
    planeteJour:planeteJour,
    relationJour:jourRel,
    planeteHeure:planeteHeure,
    relationHeure:heureRel,
    categorie:cat,
    score:score,
    signaux:signaux
  };
}

function couleurForcePlanetaire(score){
  if(score>=80) return '#4ade80';
  if(score>=60) return '#60a5fa';
  if(score>=40) return '#fbbf24';
  return '#f87171';
}

function toggleForcePlanetairePanel(){
  var panel=document.getElementById('force-planetaire-panel');
  if(!panel) return;
  if(panel.style.display==='none' || !panel.style.display){
    if(!currentTheme){
      panel.innerHTML='<div class="warn">Lance un thème d’abord.</div>';
      panel.style.display='block';
      return;
    }
    var theme=currentTheme;
    var html='<h3>🪐 Force planétaire — Figure × Maison × Jour × Heure</h3>';
    html+='<div class="muted" style="font-size:11px;">La planète donne la famille d’énergie; la figure montre comment cette énergie s’exprime. Le score ci-dessous est un indice d’étude et ne modifie pas encore le verdict final.</div>';
    html+='<div class="force-planet-grid">';

    for(var p=1;p<=16;p++){
      var r=calculerForcePlanetaireMaison(p,theme);
      if(!r) continue;
      var col=couleurForcePlanetaire(r.score);
      var maisonLabel=(typeof ROMAN_16!=='undefined' ? ROMAN_16[p] : ('M'+p));
      html+='<div class="force-planet-card">';
      html+='<div class="force-planet-head"><div class="force-planet-name">'+maisonLabel+' — '+FL[r.figure]+' <span style="font-weight:400;color:#94a3b8;">('+r.planete+')</span></div>';
      html+='<div class="force-planet-score" style="color:'+col+';">'+r.score+'/100</div></div>';
      html+='<div class="force-planet-bar"><span style="width:'+r.score+'%;background:'+col+';"></span></div>';
      html+='<div class="force-planet-row"><b>Liaison :</b> '+(r.primaire?'principale':'secondaire')+' — intensité naturelle '+r.intensiteNaturelle+'/100</div>';
      html+='<div class="force-planet-row"><b>Effet :</b> '+r.effet+'</div>';
      html+='<div class="force-planet-row"><b>Expression :</b> '+r.nuance+'</div>';
      html+='<div class="force-planet-row"><b>Maison :</b> '+(r.categorie||'synthèse')+(r.regenteMaison?' — régente '+r.regenteMaison:'')+'</div>';
      if(r.digniteMaison && r.digniteMaison.label){
        html+='<div class="force-planet-row"><b>Dignité vs maison :</b> '+r.digniteMaison.label+' ('+(r.digniteMaison.score>=0?'+':'')+r.digniteMaison.score+')</div>';
      }
      if(r.planeteJour){
        html+='<div class="force-planet-row"><b>Jour :</b> '+r.planeteJour+(r.relationJour?' — '+r.relationJour.label:'')+'</div>';
      }
      if(r.planeteHeure){
        html+='<div class="force-planet-row"><b>Heure :</b> '+r.planeteHeure+(r.relationHeure?' — '+r.relationHeure.label:'')+'</div>';
      }
      if(r.signaux.length) html+='<div class="force-planet-row" style="color:#4ade80;"><b>Signal :</b> '+r.signaux.join(' • ')+'</div>';
      html+='</div>';
    }
    html+='</div>';

    // Synthèse des familles planétaires présentes.
    var comptes={};
    for(var m=1;m<=16;m++){
      var pl=PLANETES_V7[theme[m]];
      if(pl) comptes[pl]=(comptes[pl]||0)+1;
    }
    var ordre=['Mars','Vénus','Mercure','Lune','Soleil','Jupiter','Saturne'];
    html+='<div style="margin-top:12px;"><b style="color:#bfdbfe;">Familles planétaires présentes :</b><div style="margin-top:5px;">';
    ordre.forEach(function(pl){
      if(comptes[pl]) html+='<span class="force-planet-tag '+(pl==='Mars'?'primary':'secondary')+'">'+PLANETE_SYMB[pl]+' '+pl+' × '+comptes[pl]+'</span>';
    });
    html+='</div></div>';
    html+='<div class="force-planet-note">Lecture : Mars → Puer/Rubeus/Cauda = même famille martienne, mais avec des expressions différentes. Puer est la forme primaire dans cette famille; Rubeus intensifie et désordonne l’énergie martienne. Cette couche reste expérimentale jusqu’au contre-test sur l’archive.</div>';

    panel.innerHTML=html;
    panel.style.display='block';
  }else{
    panel.style.display='none';
  }
}

function concordancePlanetaire(p1, p2) {
  if (p1 === p2) return {type:'identique', score:100, label:'Même planète — force doublée'};
  var alliances = {'Mars-Jupiter':'Alliance offensive','Jupiter-Mars':'Alliance offensive','Soleil-Mars':'Domination agressive','Mars-Soleil':'Domination agressive','Vénus-Lune':'Fluidité technique','Lune-Vénus':'Fluidité technique','Mercure-Jupiter':'Expansion rapide','Jupiter-Mercure':'Expansion rapide','Soleil-Jupiter':'Domination totale','Jupiter-Soleil':'Domination totale'};
  var oppositions = {'Mars-Saturne':'Choc Mars/Saturne — blocage','Saturne-Mars':'Choc Mars/Saturne — blocage','Soleil-Saturne':'Autorité vs Rigueur','Saturne-Soleil':'Autorité vs Rigueur','Lune-Saturne':'Flux bloqué','Saturne-Lune':'Flux bloqué','Vénus-Mars':'Technique vs Brutalité','Mars-Vénus':'Technique vs Brutalité'};
  var key = p1+'-'+p2;
  if (alliances[key]) return {type:'alliance', score:80, label:alliances[key]};
  if (oppositions[key]) return {type:'opposition', score:20, label:oppositions[key]};
  return {type:'neutre', score:50, label:'Influence neutre'};
}

function getPlaneteDuJour(dateStr) {
  var jours = ['Soleil','Lune','Mars','Mercure','Jupiter','Vénus','Saturne'];
  var d;
  if (dateStr) {
    // Format attendu : YYYY-MM-DD (valeur native d'un input type=date)
    var parts = dateStr.split('-');
    if (parts.length === 3) {
      d = new Date(Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
    }
  }
  if (!d || isNaN(d.getTime())) d = new Date(); // fallback : date systeme actuelle
  return jours[d.getDay()];
}

function getPlaneteDuJourDuMatch() {
  var el = document.getElementById('matchDate');
  var dateStr = el ? el.value : '';
  return getPlaneteDuJour(dateStr);
}

// ═══════════════════════════════════════════════════════════════
// HEURES PLANÉTAIRES (10/07/26) — doctrine classique : chaque heure
// du jour est régie par une planète, cycle chaldéen (Saturne → Jupiter
// → Mars → Soleil → Vénus → Mercure → Lune, puis ça reboucle). La 1ère
// heure du jour (00h) est régie par la planète du jour elle-même —
// propriété classique vérifiée : 24h/jour et 7 planètes se recomposent
// exactement (24 mod 7 = 3, donc jour+1 démarre 3 crans plus loin dans
// le cycle chaldéen, ce qui correspond exactement à la séquence des
// jours de la semaine). Simplification assumée : heures calendaires
// égales (00h-23h), pas d'heures "temporelles" basées sur le lever du
// soleil (nécessiterait latitude/longitude, non disponibles ici).
// Statut : NOUVEAU, non encore validé empiriquement — à contre-tester
// sur l'archive (plusieurs entrées ont déjà une heure de match notée).
// ═══════════════════════════════════════════════════════════════
const CHALDEEN_ORDRE = ['Saturne','Jupiter','Mars','Soleil','Vénus','Mercure','Lune'];

// Figure "gouvernante" primaire par planète — choix parmi les figures
// partageant chacune planète dans PLANETES_V7 (ex. Mars a aussi Rubeus
// et Cauda Draconis). Pris ici : la figure "simple" la plus classiquement
// associée à la planète pour chaque groupe. Ouvert à correction.
const PLANETE_GOUVERNEUR = {
  'Mars':'puer', 'Vénus':'puella', 'Mercure':'albus', 'Lune':'populus',
  'Soleil':'fortuna_major', 'Jupiter':'acquisitio', 'Saturne':'carcer'
};

function getPlaneteHeure(dateStr, heureStr) {
  var jourPlanete = getPlaneteDuJour(dateStr);
  var dayIdx = CHALDEEN_ORDRE.indexOf(jourPlanete);
  if (dayIdx === -1) return jourPlanete; // securite, ne devrait pas arriver
  var h = 0;
  if (heureStr && heureStr.indexOf(':') >= 0) h = parseInt(heureStr.split(':')[0], 10) || 0;
  var idx = (dayIdx + h) % 7;
  return CHALDEEN_ORDRE[idx];
}



// ═══════════════════════════════════════════════════════════════
// HEURES PLANÉTAIRES VRAIES (10/07/26) — lever/coucher du soleil par
// coordonnées (algorithme NOAA/Meeus, formules publiques, autonome —
// aucune dépendance externe/CDN, cohérent avec un fichier unique
// fonctionnant hors-ligne). Précision testée ~1 min sur Paris vs
// références connues. Permet de calculer les 12 vraies heures
// "temporelles" du jour et 12 de la nuit (inégales, variables selon
// saison/latitude) au lieu de l'approximation calendaire (00h-23h)
// utilisée par défaut dans getPlaneteHeure.
// Limite assumée : décalage UTC fixe par ville dans VILLES_COORDS
// (heure standard, PAS d'ajustement heure d'été/hiver automatique) —
// peut décaler le calcul d'1h certaines périodes de l'année.
// ═══════════════════════════════════════════════════════════════
function calculerLeverCoucher(dateStr, lat, lng) {
  var parts = dateStr.split('-');
  var year = parseInt(parts[0],10), month = parseInt(parts[1],10), day = parseInt(parts[2],10);
  var a = Math.floor((14 - month) / 12);
  var y = year + 4800 - a;
  var m = month + 12 * a - 3;
  var JDN = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  var n = JDN - 2451545.0 + 0.0008;
  var Jstar = n - lng / 360;
  var M = (357.5291 + 0.98560028 * Jstar) % 360;
  var Mrad = M * Math.PI / 180;
  var C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad);
  var lambda = (M + 102.9372 + C + 180) % 360;
  var lambdaRad = lambda * Math.PI / 180;
  var Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad);
  var decl = Math.asin(Math.sin(lambdaRad) * Math.sin(23.4397 * Math.PI / 180));
  var latRad = lat * Math.PI / 180;
  var cosOmega = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
  if (cosOmega > 1) return { lever: null, coucher: null, note: 'nuit polaire' };
  if (cosOmega < -1) return { lever: null, coucher: null, note: 'jour polaire' };
  var omega = Math.acos(cosOmega) * 180 / Math.PI;
  var Jset = Jtransit + omega / 360;
  var Jrise = Jtransit - omega / 360;
  function jdToDate(jd) { return new Date((jd - 2440587.5) * 86400000); }
  return { lever: jdToDate(Jrise), coucher: jdToDate(Jset) };
}

// ~55 villes couvrant les régions les plus fréquentes de COMPETITION_INDEX.
// [latitude, longitude, décalage UTC standard]. Repli sur Paris si absente.
const VILLES_COORDS = {
  'paris':[48.8566,2.3522,1], 'marseille':[43.2965,5.3698,1], 'lyon':[45.7640,4.8357,1],
  'londres':[51.5074,-0.1278,0], 'london':[51.5074,-0.1278,0], 'manchester':[53.4808,-2.2426,0],
  'liverpool':[53.4084,-2.9916,0], 'birmingham':[52.4862,-1.8904,0], 'glasgow':[55.8642,-4.2518,0],
  'madrid':[40.4168,-3.7038,1], 'barcelone':[41.3874,2.1686,1], 'barcelona':[41.3874,2.1686,1],
  'seville':[37.3891,-5.9845,1], 'bilbao':[43.2630,-2.9350,1],
  'milan':[45.4642,9.1900,1], 'rome':[41.9028,12.4964,1], 'turin':[45.0703,7.6869,1], 'naples':[40.8518,14.2681,1],
  'munich':[48.1351,11.5820,1], 'berlin':[52.5200,13.4050,1], 'dortmund':[51.5136,7.4653,1],
  'lisbonne':[38.7223,-9.1393,0], 'porto':[41.1579,-8.6291,0],
  'amsterdam':[52.3676,4.9041,1], 'eindhoven':[51.4416,5.4697,1], 'rotterdam':[51.9244,4.4777,1],
  'bruxelles':[50.8503,4.3517,1], 'istanbul':[41.0082,28.9784,3], 'athenes':[37.9838,23.7275,2],
  'dakar':[14.6928,-17.4467,0], 'abidjan':[5.3600,-4.0083,0], 'accra':[5.6037,-0.1870,0],
  'moscou':[55.7558,37.6173,3],
  'buenos aires':[-34.6037,-58.3816,-3], 'sao paulo':[-23.5505,-46.6333,-3],
  'rio de janeiro':[-22.9068,-43.1729,-3], 'santiago':[-33.4489,-70.6693,-4],
  'bogota':[4.7110,-74.0721,-5], 'lima':[-12.0464,-77.0428,-5], 'la paz':[-16.5000,-68.1500,-4],
  'potosi':[-19.5836,-65.7531,-4], 'mexico':[19.4326,-99.1332,-6],
  'new york':[40.7128,-74.0060,-5], 'los angeles':[34.0522,-118.2437,-8],
  'tokyo':[35.6762,139.6503,9], 'seoul':[37.5665,126.9780,9],
  'le caire':[30.0444,31.2357,2], 'cairo':[30.0444,31.2357,2],
  'lagos':[6.5244,3.3792,1], 'kinshasa':[-4.4419,15.2663,1],
  'budapest':[47.4979,19.0402,1], 'vienne':[48.2082,16.3738,1], 'vienna':[48.2082,16.3738,1],
  'zurich':[47.3769,8.5417,1]
};
function getVilleCoords(nomVille) {
  if (!nomVille) return null;
  var v = VILLES_COORDS[nomVille.trim().toLowerCase()];
  return v ? {lat:v[0], lng:v[1], utcOffset:v[2]} : null;
}

// Version "vraie" de getPlaneteHeure, avec heures temporelles reelles si
// la ville est connue. Repli automatique sur la methode calendaire
// (getPlaneteHeure) si ville absente/inconnue ou nuit/jour polaire.
function getPlaneteHeureVraie(dateStr, heureStr, nomVille) {
  var coords = getVilleCoords(nomVille);
  if (!coords || !dateStr || !heureStr || heureStr.indexOf(':')<0) {
    return { planete: getPlaneteHeure(dateStr, heureStr), methode:'calendaire', villeUtilisee: null };
  }
  var soleil = calculerLeverCoucher(dateStr, coords.lat, coords.lng);
  if (!soleil.lever || !soleil.coucher) {
    return { planete: getPlaneteHeure(dateStr, heureStr), methode:'calendaire (jour/nuit polaire)', villeUtilisee: nomVille };
  }
  var hParts = heureStr.split(':');
  var hLocal = parseFloat(hParts[0]) + (parseFloat(hParts[1])||0)/60;
  var hUTC = hLocal - coords.utcOffset;
  var matchMs = new Date(dateStr+'T00:00:00Z').getTime() + hUTC*3600000;
  var dayIdx = CHALDEEN_ORDRE.indexOf(getPlaneteDuJour(dateStr));

  if (matchMs >= soleil.lever.getTime() && matchMs < soleil.coucher.getTime()) {
    var duree = soleil.coucher.getTime() - soleil.lever.getTime();
    var idx = Math.min(11, Math.floor((matchMs - soleil.lever.getTime()) / duree * 12));
    return { planete: CHALDEEN_ORDRE[(dayIdx+idx)%7], methode:'temporelle (jour, heure '+(idx+1)+'/12)', villeUtilisee: nomVille };
  } else if (matchMs < soleil.lever.getTime()) {
    var veilleDate = new Date(dateStr+'T00:00:00Z'); veilleDate.setUTCDate(veilleDate.getUTCDate()-1);
    var veilleStr = veilleDate.toISOString().slice(0,10);
    var soleilVeille = calculerLeverCoucher(veilleStr, coords.lat, coords.lng);
    if (!soleilVeille.coucher) return { planete: getPlaneteHeure(dateStr, heureStr), methode:'calendaire (repli)', villeUtilisee: nomVille };
    var dureeN = soleil.lever.getTime() - soleilVeille.coucher.getTime();
    var idxN = Math.min(11, Math.floor((matchMs - soleilVeille.coucher.getTime()) / dureeN * 12));
    var dayIdxV = CHALDEEN_ORDRE.indexOf(getPlaneteDuJour(veilleStr));
    return { planete: CHALDEEN_ORDRE[(dayIdxV+12+idxN)%7], methode:'temporelle (nuit veille, heure '+(idxN+1)+'/12)', villeUtilisee: nomVille };
  } else {
    var demainDate = new Date(dateStr+'T00:00:00Z'); demainDate.setUTCDate(demainDate.getUTCDate()+1);
    var demainStr = demainDate.toISOString().slice(0,10);
    var soleilDemain = calculerLeverCoucher(demainStr, coords.lat, coords.lng);
    if (!soleilDemain.lever) return { planete: getPlaneteHeure(dateStr, heureStr), methode:'calendaire (repli)', villeUtilisee: nomVille };
    var dureeN2 = soleilDemain.lever.getTime() - soleil.coucher.getTime();
    var idxN2 = Math.min(11, Math.floor((matchMs - soleil.coucher.getTime()) / dureeN2 * 12));
    return { planete: CHALDEEN_ORDRE[(dayIdx+12+idxN2)%7], methode:'temporelle (nuit, heure '+(idxN2+1)+'/12)', villeUtilisee: nomVille };
  }
}



// ═══════════════════════════════════════════════════════════════
// TABLE COMPLÈTE DES 24 HEURES PLANÉTAIRES (03/08/26, format calqué sur
// une consultation OracleSanctum) — réutilise le moteur d'heures
// temporelles réelles déjà en place (calculerLeverCoucher/VILLES_COORDS)
// pour produire les 12 heures de jour (lever→coucher) et les 12 heures
// de nuit (coucher→lever du lendemain) avec leurs plages horaires
// réelles, dans l'ordre chaldéen. Repli sur Paris si la ville n'est pas
// reconnue (cohérent avec getPlaneteHeureVraie). Signal informatif —
// aucun poids sur verdictFinal.
// ═══════════════════════════════════════════════════════════════
function genererTableHeuresPlanetairesComplete(dateStr, nomVille) {
  if (!dateStr) return null;
  var coords = getVilleCoords(nomVille);
  var villeUtilisee = nomVille;
  if (!coords) { coords = {lat:48.8566, lng:2.3522, utcOffset:1}; villeUtilisee = (nomVille ? nomVille + ' (non reconnue, repli Paris)' : 'Paris (repli par défaut)'); }

  var soleilJour = calculerLeverCoucher(dateStr, coords.lat, coords.lng);
  if (!soleilJour.lever || !soleilJour.coucher) return null; // jour/nuit polaire

  var demainDate = new Date(dateStr + 'T00:00:00Z'); demainDate.setUTCDate(demainDate.getUTCDate() + 1);
  var demainStr = demainDate.toISOString().slice(0, 10);
  var soleilDemain = calculerLeverCoucher(demainStr, coords.lat, coords.lng);
  if (!soleilDemain.lever) return null;

  var dayRuler = getPlaneteDuJour(dateStr);
  var dayIdx = CHALDEEN_ORDRE.indexOf(dayRuler);

  function fmtLocal(d) {
    var localMs = d.getTime() + coords.utcOffset * 3600000;
    var ld = new Date(localMs);
    var pad = function (n) { return String(n).length < 2 ? '0' + n : String(n); };
    return pad(ld.getUTCHours()) + ':' + pad(ld.getUTCMinutes());
  }

  var dayHours = [];
  var dureeJour = soleilJour.coucher.getTime() - soleilJour.lever.getTime();
  for (var i = 0; i < 12; i++) {
    var debut = new Date(soleilJour.lever.getTime() + dureeJour * i / 12);
    var fin = new Date(soleilJour.lever.getTime() + dureeJour * (i + 1) / 12);
    dayHours.push({ num: i + 1, planete: CHALDEEN_ORDRE[(dayIdx + i) % 7], debut: fmtLocal(debut), fin: fmtLocal(fin) });
  }

  var nightHours = [];
  var dureeNuit = soleilDemain.lever.getTime() - soleilJour.coucher.getTime();
  for (var j = 0; j < 12; j++) {
    var debutN = new Date(soleilJour.coucher.getTime() + dureeNuit * j / 12);
    var finN = new Date(soleilJour.coucher.getTime() + dureeNuit * (j + 1) / 12);
    nightHours.push({ num: 13 + j, planete: CHALDEEN_ORDRE[(dayIdx + 12 + j) % 7], debut: fmtLocal(debutN), fin: fmtLocal(finN) });
  }

  var joursNoms = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  var dparts = dateStr.split('-').map(Number);
  var ddate = new Date(dparts[0], dparts[1] - 1, dparts[2]);

  return {
    dateStr: dateStr, nomJour: joursNoms[ddate.getDay()], dayRuler: dayRuler,
    dayHours: dayHours, nightHours: nightHours, ville: villeUtilisee
  };
}

function renderHeuresPlanetairesTable() {
  var dateEl = document.getElementById('matchDate');
  var dateStr = (dateEl && dateEl.value) ? dateEl.value : new Date().toISOString().slice(0, 10);
  var stadiumEl = document.getElementById('stadium');
  var nomVille = stadiumEl ? stadiumEl.value : '';
  var container = document.getElementById('heuresPlanetairesContent');
  if (!container) return;
  var data = genererTableHeuresPlanetairesComplete(dateStr, nomVille);
  if (!data) {
    container.innerHTML = '<div class="history-empty">Calcul impossible pour cette date/ville (jour ou nuit polaire, ou date absente).</div>';
    return;
  }
  function rowsHtml(hours, dominante) {
    return hours.map(function (h) {
      var symb = PLANETE_SYMB[h.planete] || '';
      var col = PLANETE_COLOR[h.planete] || '#e2e8f0';
      var dign = dominante ? evaluerDigniteEssentielle(h.planete, dominante) : null;
      var dignTxt = (dign && dign.statut) ? ' <span style="color:' + (dign.score > 0 ? '#4ade80' : '#f87171') + '; font-size:11px;">(' + dign.label + ' vs ' + dominante + ', ' + (dign.score > 0 ? '+' : '') + dign.score + ')</span>' : '';
      return '<tr><td>' + h.num + '</td><td style="color:' + col + '; font-weight:600;">' + symb + ' ' + h.planete + '</td><td>' + h.debut + ' - ' + h.fin + '</td><td>' + dignTxt + '</td></tr>';
    }).join('');
  }
  var dominanteRef = data.dayRuler;
  container.innerHTML =
    '<div class="topbar-mini" style="margin-bottom:10px; font-size:12px;">📅 ' + data.dateStr + ' | Jour : <b>' + data.nomJour + '</b> — Régent du jour : <b style="color:' + (PLANETE_COLOR[data.dayRuler] || '#a78bfa') + '">' + (PLANETE_SYMB[data.dayRuler] || '') + ' ' + data.dayRuler + '</b><br>Ville utilisée : ' + data.ville + ' <span class="muted">(heures temporelles réelles, lever/coucher du soleil — pas d\'heures calendaires égales)</span></div>' +
    '<div style="display:flex; gap:20px; flex-wrap:wrap;">' +
      '<div style="flex:1; min-width:260px;"><h4 style="margin:0 0 6px; color:#dbeafe;">☀️ Heures de jour</h4><table class="dign-table"><thead><tr><th>Heure</th><th>Régent</th><th>Plage</th><th>Dignité vs jour</th></tr></thead><tbody>' + rowsHtml(data.dayHours, dominanteRef) + '</tbody></table></div>' +
      '<div style="flex:1; min-width:260px;"><h4 style="margin:0 0 6px; color:#dbeafe;">🌙 Heures de nuit</h4><table class="dign-table"><thead><tr><th>Heure</th><th>Régent</th><th>Plage</th><th>Dignité vs jour</th></tr></thead><tbody>' + rowsHtml(data.nightHours, dominanteRef) + '</tbody></table></div>' +
    '</div>' +
    '<div class="hint" style="margin-top:10px;">📚 Étude — la colonne « Dignité vs jour » compare le régent de chaque heure au régent du jour selon la table doctrinale importée. Signal expérimental, non validé, à contre-tester sur l\'archive avant toute promotion vers verdictFinal.</div>';
}

function openHeuresPlanetairesPanel() {
  renderHeuresPlanetairesTable();
  var o = document.getElementById('heuresPlanetairesOverlay');
  if (o) o.classList.add('open');
}
function closeHeuresPlanetairesPanel() {
  var o = document.getElementById('heuresPlanetairesOverlay');
  if (o) o.classList.remove('open');
}

// Signal d'etude : la figure gouvernante de l'heure est-elle presente
// dans le theme, et de quel cote (CAMP1/CAMP2, ou tete M1/M7 directement) ?
// Ne pese sur aucun verdict tant que non valide.


// ═══════════════════════════════════════════════════════════════
// RADICALITÉ DU TIRAGE (06/07/26) — doctrine classique : un thème tiré
// trop loin du moment radical de la question (ici le coup d'envoi)
// perd en fiabilité. On mesure l'écart entre l'instant de tirage
// (themeCastAt, capturé dans launchTheme) et l'heure de match déclarée
// (matchDate+matchTime), et on le classe en paliers. Signal informatif
// + traçable dans l'archive pour contre-test empirique (aucun poids
// sur verdictFinal tant que non validé statistiquement).
// ═══════════════════════════════════════════════════════════════
// FUSEAU HORAIRE DU MATCH (16/07/26, demande utilisateur — "l'heure des
// USA et celle du Sénégal sont deux heures différentes, fais une
// relativité entre les deux") : avant, l'heure de match saisie était
// interprétée dans le fuseau du NAVIGATEUR de la personne qui lance le
// thème — juste pour un match qui se joue dans le même fuseau, mais faux
// dès que le match a lieu ailleurs (ex. tirage fait au Sénégal, UTC+0,
// pour un match aux USA, UTC-5 : "20:00" saisi était compté comme 20:00
// Sénégal au lieu de 20:00 heure du match). Résultat : la radicalité
// (délai tirage → coup d'envoi) pouvait se tromper de plusieurs heures.
// tzOffsetHours (nouveau champ #matchTimezone, défaut 0/UTC si absent —
// rétrocompatible avec les tirages sauvegardés avant ce correctif)
// permet de convertir l'heure saisie (heure LOCALE DU MATCH) en instant
// UTC réel avant de comparer à l'instant du tirage (déjà un instant UTC
// absolu via Date.now()/toISOString(), peu importe où on se trouve).
function calculerDelaiTirageMinutes(matchDate, matchTime, castISO, tzOffsetHours) {
  if (!matchDate) return null;
  var timeStr = matchTime || '00:00';
  var parts = matchDate.split('-').map(Number);
  var hm = timeStr.split(':').map(Number);
  if (parts.length !== 3 || isNaN(parts[0])) return null;
  var tz = (tzOffsetHours === undefined || tzOffsetHours === null || tzOffsetHours === '' || isNaN(parseFloat(tzOffsetHours))) ? 0 : parseFloat(tzOffsetHours);
  var kickoffUTCms = Date.UTC(parts[0], parts[1]-1, parts[2], hm[0]||0, hm[1]||0, 0) - tz*3600000;
  if (isNaN(kickoffUTCms)) return null;
  var cast = castISO ? new Date(castISO) : new Date();
  if (isNaN(cast.getTime())) cast = new Date();
  return Math.round((kickoffUTCms - cast.getTime()) / 60000); // minutes ; positif = tirage AVANT le coup d'envoi
}

function radicaliteBucket(delaiMin) {
  if (delaiMin === null || delaiMin === undefined) return 'inconnu';
  var abs = Math.abs(delaiMin);
  if (abs <= 15) return '≤15min';
  if (abs <= 60) return '15-60min';
  if (abs <= 120) return '1-2h';
  return '>2h';
}

function radicaliteTirage(matchDate, matchTime, castISO, tzOffsetHours) {
  var delai = calculerDelaiTirageMinutes(matchDate, matchTime, castISO, tzOffsetHours);
  if (delai === null) {
    return { texte: '⏳ Aucune heure de match saisie — radicalité du tirage non vérifiable.', niveau: 'inconnu', delaiMin: null, couleur: '#94a3b8' };
  }
  var abs = Math.abs(delai);
  var avantApres = delai >= 0 ? 'avant' : 'après';
  var h = Math.floor(abs / 60), m = abs % 60;
  var dureeTxt = (h > 0 ? h + 'h' : '') + (m > 0 ? m + 'min' : '') || '0min';
  var niveau, msg, couleur;
  if (abs <= 15) { niveau = 'fort'; msg = 'radicalité forte — tirage quasi au moment du coup d\'envoi.'; couleur = '#4ade80'; }
  else if (abs <= 60) { niveau = 'moyen'; msg = 'radicalité correcte — sous 1h, doctrine classique acceptable.'; couleur = '#a3e635'; }
  else if (abs <= 120) { niveau = 'faible'; msg = 'radicalité affaiblie — au-delà d\'1h, le thème s\'éloigne du moment radical (doctrine classique).'; couleur = '#fbbf24'; }
  else { niveau = 'tres_faible'; msg = 'radicalité très faible — tirage trop loin du coup d\'envoi (>2h), fiabilité douteuse.'; couleur = '#f87171'; }
  return { texte: '⏳ Tirage ' + dureeTxt + ' ' + avantApres + ' le coup d\'envoi — ' + msg, niveau: niveau, delaiMin: delai, couleur: couleur };
}

function updatePlaneteJourIndicator() {
  var indicator = document.getElementById('planeteJourIndicator');
  if (!indicator) return;
  var el = document.getElementById('matchDate');
  var dateStr = el ? el.value : '';
  var planete = getPlaneteDuJourDuMatch();
  var symb = PLANETE_SYMB[planete] || '';
  var role = PLANETE_ROLE[planete] || '';
  if (dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    var joursNoms = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    var nomJour = joursNoms[d.getDay()];
    indicator.innerHTML = '🪐 Planète gouvernante du tirage (date saisie, '+nomJour+') : <b style="color:'+(PLANETE_COLOR[planete]||'#a78bfa')+'">'+symb+' '+planete+'</b> — '+role;
  } else {
    indicator.innerHTML = '🪐 Planete gouvernante du tirage (aujourd hui, aucune date saisie) : <b style="color:'+(PLANETE_COLOR[planete]||'#a78bfa')+'">'+symb+' '+planete+'</b> — '+role+' <span class="muted">(saisis une date pour un match passé ou futur)</span>';
  }
}

function analysePlanetaireCamp(posFig, theme) {
  var fig = theme[posFig];
  var planete = PLANETES_V7[fig];
  var comptage = {};
  for (var p = 1; p <= 16; p++) {
    var pl = PLANETES_V7[theme[p]];
    if (pl) comptage[pl] = (comptage[pl] || 0) + 1;
    var resFig = combine(theme[p], FIGS_V7[p-1]);
    var plRes = PLANETES_V7[resFig];
    if (plRes) comptage[plRes] = (comptage[plRes] || 0) + 0.5;
  }
  var dominante = Object.keys(comptage).reduce(function(a,b){return comptage[a]>=comptage[b]?a:b;},'Lune');
  var planeteDuJour = getPlaneteDuJourDuMatch();
  var concJour = concordancePlanetaire(planete, planeteDuJour);
  var boucle = construireMeute(fig);
  var planetesBoucle = boucle.map(function(f){return PLANETES_V7[f];}).filter(function(v,i,a){return a.indexOf(v)===i;});
  // 📚 étude (03/08/26) — dignité essentielle du significateur du camp
  // face à la planète du jour, doctrine importée. Informatif seul, aucun
  // poids sur verdictFinal tant que non contre-testé sur l'archive.
  var digniteVsJour = evaluerDigniteEssentielle(planete, planeteDuJour);
  // 📚 étude (03/08/26) — dignité accidentelle enrichie : catégorie de
  // maison (angulaire/succédente/cadente) + régence naturelle de la
  // maison posFig. Informatif seul, aucun poids sur verdictFinal tant
  // que non contre-testé sur l'archive.
  var digniteAccidentelle = calculerDigniteAccidentelle(posFig, fig, theme);
  return {fig:fig, planete:planete, planeteDuJour:planeteDuJour, concJour:concJour, dominante:dominante, comptage:comptage, planetesBoucle:planetesBoucle, digniteVsJour:digniteVsJour, digniteAccidentelle:digniteAccidentelle};
}

function concordanceV7(e1, e2) {
  if (!e1 || !e2) return {type:'neutre', score:0};
  if (e1==='terre' && e2==='terre') return {type:'destruction_forte', score:100};
  if ((e1==='terre'&&e2==='eau')||(e1==='eau'&&e2==='terre')) return {type:'destruction_forte', score:90};
  if (e1==='eau' && e2==='eau') return {type:'destruction', score:70};
  if (e1==='feu' && e2==='feu') return {type:'force_forte', score:100};
  if ((e1==='feu'&&e2==='air')||(e1==='air'&&e2==='feu')) return {type:'force_forte', score:90};
  if (e1==='air' && e2==='air') return {type:'force', score:70};
  return {type:'neutre', score:30};
}

function proxV7(posA, posB) {
  var d = Math.abs(posA - posB);
  if (d===0) return 100;
  if (d===1) return 90;
  if (d<=3) return 70;
  if (d<=6) return 50;
  if (d<=9) return 30;
  return 15;
}

// Trouve toutes les positions d'une figure dans le thème (visible + résultante invisible)
// ⚡ 30/08/26 — MÉMOÏSATION (« le système répond très lent », Ellemine_D).
// Profilé au chronomètre sur un lancement : trouverFigV7 était appelée
// 433 977 fois et profilFigureMaison 210 513 fois pour UN thème. Les deux
// sont des fonctions pures de (figure, maison, thème) : le même appel
// refait le même calcul des milliers de fois.
//
// ☠️ LE PIÈGE, ET IL EST RÉEL : leurs résultats sont MODIFIÉS par les
// appelants. profilFigureTheme fait « p.enResultante = ... » sur le profil
// renvoyé, et « occ.push(...) » sur le tableau de trouverFigV7. Rendre
// l'objet du cache directement ferait fuiter ces écritures d'un appel à
// l'autre — un bug silencieux bien pire que la lenteur. On rend donc une
// COPIE à chaque fois ; ce qui est mis en cache, c'est le CALCUL, pas
// l'objet. La copie coûte quelques microsecondes, le calcul des
// millisecondes.
//
// Le cache est posé sur l'objet thème lui-même, en propriété NON
// énumérable : il disparaît avec le thème, et Object.assign({}, theme)
// — que fait verdictElementaire pour voiler Populus — ne le recopie pas,
// donc la copie repart avec un cache vierge. C'est exactement ce qu'on
// veut : ce n'est plus le même thème.
//
// ✔ RÉSULTAT MESURÉ, lancement d'un thème, du même banc de mesure :
//     avant .......................... 5 132 ms puis 1 120 ms
//     mémo trouverFig + profilFigure .. 1 315 ms
//     + mémo par thème corrigé ........   859 ms puis   277 ms
// Six fois plus rapide au premier lancement, quatre fois ensuite.
// ⚠️ Les valeurs ABSOLUES bougent avec la charge de la machine de
// mesure : la même version relancée le lendemain donne 1 100 ms puis
// 510 ms, sans qu'une ligne ait changé. Seules les comparaisons faites
// dans la même session valent quelque chose — c'est pour ça que chaque
// modification est chronométrée contre le commit précédent et non
// contre un chiffre noté ici. (Vérifié ainsi pour la bannière de gel :
// coût nul.)
//
// ✔ ET VÉRIFIÉ IDENTIQUE, parce qu'un cache qui change un résultat est
// pire qu'une lenteur : les 48 cas de l'archive plus 2 000 thèmes tirés
// au hasard, rejoués sur la version d'avant et sur celle-ci, comparés
// sur le verdict, le score, le BTTS, le rejet, la table des pôles, la
// chaîne, le réseau, le profil, trouverFigV7, la marge des critères,
// F4P4, la validité et le faisceau. 2 048 lignes, ZÉRO différence.
function memoThemeV7(theme, nom) {
  if (!theme || typeof theme !== 'object') return null;
  var m = theme[nom];
  if (m) return m;
  m = {};
  try { Object.defineProperty(theme, nom, { value: m, enumerable: false, writable: true, configurable: true }); }
  catch (e) { return null; }
  return m;
}

function trouverFigV7(fig, theme) {
  var memo = memoThemeV7(theme, '__memoTrouve');
  if (memo) {
    var vu = memo[fig];
    if (vu) {
      // copie : profilFigureTheme pousse dans le tableau qu'il reçoit
      var out = new Array(vu.length);
      for (var i = 0; i < vu.length; i++) out[i] = { pos: vu[i].pos, hidden: vu[i].hidden };
      return out;
    }
  }
  var res = [];
  for (var p = 1; p <= 16; p++) {
    if (theme[p] === fig) res.push({pos:p, hidden:false});
    else {
      var resFig = combine(theme[p], FIGS_V7[p-1]);
      if (resFig === fig) res.push({pos:p, hidden:true});
    }
  }
  if (memo) {
    memo[fig] = res;
    var cp = new Array(res.length);
    for (var j = 0; j < res.length; j++) cp[j] = { pos: res[j].pos, hidden: res[j].hidden };
    return cp;
  }
  return res;
}


// Barème unique élément(figure) x élément(maison) — UNE seule source de vérité
// pour les 4 paliers de compatibilité + chaotique/blocage (08/07/26, portage
// depuis l'autre lignée du projet — avant, concordanceFigureMaisonV7 regroupait
// chaotique et blocage dans un même "neutre"=30 que forceMaisonV7 distinguait).
function elementMaisonBareme(eF, eM) {
  if (eF === eM) return {score:90, level:'compatible_90'};
  if ((eF==='feu'&&eM==='air')||(eF==='air'&&eM==='feu')||(eF==='terre'&&eM==='eau')||(eF==='eau'&&eM==='terre')) return {score:70, level:'compatible_70'};
  if ((eF==='feu'&&eM==='terre')||(eF==='terre'&&eM==='feu')||(eF==='air'&&eM==='eau')||(eF==='eau'&&eM==='air')) return {score:60, level:'semi_compatible'};
  if ((eF==='feu'&&eM==='eau')||(eF==='eau'&&eM==='feu')) return {score:40, level:'chaotique'};
  if ((eF==='air'&&eM==='terre')||(eF==='terre'&&eM==='air')) return {score:20, level:'blocage'};
  return {score:0, level:'oppose'};
}

// Concordance directe entre une figure (de base ou résultante) et l'élément de la maison
function concordanceFigureMaisonV7(fig, pos) {
  var eF = ELEMENTS_V7[fig];
  var eM = MAISON_ELEM_V7[pos];
  if (fig === FIGS_V7[pos-1]) { var s0=FORCE_REPOS_MAISON_V7[pos]; return {fig:fig, pos:pos, elemFig:eF, elemMaison:eM, force:s0, level:'repos_'+TIER_REPOS_LABEL_V7[s0].toLowerCase().replace(/ /g,'_')}; }
  var b = elementMaisonBareme(eF, eM);
  return {fig:fig, pos:pos, elemFig:eF, elemMaison:eM, force:b.score, level:b.level};
}

// Rôle élémentaire qualitatif (Feu/Air/Eau/Terre × maison) — cf. matrice validée
// Déclencheur/Amplificateur/Adaptateur/Stabilisateur = identique ou compatible
// Absorbeur/Dissonant = semi-compatible (tension sans effet marqué)
// Chaotique = Feu-Eau (contradictoire, mais peut générer un événement ponctuel: penalty/carton)
// Blocage = Air-Terre (contradictoire, tend vers verrouillage/match fermé)
const ELEMENT_ROLE_MATRIX_V7 = {
  'feu-feu':'Déclencheur', 'air-air':'Amplificateur', 'eau-eau':'Adaptateur', 'terre-terre':'Stabilisateur',
  'feu-air':'Amplificateur', 'air-feu':'Amplificateur',
  'terre-eau':'Stabilisateur', 'eau-terre':'Stabilisateur',
  'feu-terre':'Absorbeur', 'terre-feu':'Absorbeur',
  'air-eau':'Dissonant', 'eau-air':'Dissonant',
  'feu-eau':'Chaotique', 'eau-feu':'Chaotique',
  'air-terre':'Blocage', 'terre-air':'Blocage'
};
function getElementalRoleV7(eF, eM) {
  return ELEMENT_ROLE_MATRIX_V7[eF + '-' + eM] || null;
}

function forceMaisonV7(fig, pos) {
  var resFig = combine(fig, FIGS_V7[pos-1]);
  var eF = ELEMENTS_V7[resFig];
  var eM = MAISON_ELEM_V7[pos];
  var role = getElementalRoleV7(eF, eM);
  if (fig === FIGS_V7[pos-1]) { var s0=FORCE_REPOS_MAISON_V7[pos]; return {fig:fig, pos:pos, res:resFig, elemRes:eF, elemMaison:eM, force:s0, level:'repos_'+TIER_REPOS_LABEL_V7[s0].toLowerCase().replace(/ /g,'_'), repos:true, role:role}; }
  if (resFig === 'populus') return {fig:fig, pos:pos, res:resFig, elemRes:eF, elemMaison:eM, force:95, level:'populus_max', repos:false, role:role};
  var b = elementMaisonBareme(eF, eM);
  return {fig:fig, pos:pos, res:resFig, elemRes:eF, elemMaison:eM, force:b.score, level:b.level, repos:false, role:role};
}

// Chaîne de soutien : binôme fixe de la figure → binôme fixe du binôme → ... (circulaire sur les FIGURES)

// ═══════════════════════════════════════════════════════════════
// RÈGLE BLOCAGE DOUBLE INCOMPATIBILITÉ DE MAISON (M1/M7)
// ═══════════════════════════════════════════════════════════════

/**
 * M1/M7 ne marque pas si :
 * - sa résultante (figure x sa maison) n'a AUCUNE concordance avec sa maison (force=0/"oppose")
 * - ET la résultante de son binôme, calculée dans la maison de repos DU BINÔME, n'a non plus aucune concordance
 */
function figureBloqueeIncompatibiliteMaisonV7(fig, pos) {
  var fmFig = forceMaisonV7(fig, pos);
  if (fmFig.force > 0) return {bloque:false, raison:''};

  var binFig = BINOMES_V7[fig];
  var posReposBinome = FIGS_V7.indexOf(binFig) + 1; // maison de repos du binôme
  var fmBin = forceMaisonV7(binFig, posReposBinome);
  if (fmBin.force > 0) return {bloque:false, raison:''};

  return {
    bloque: true,
    raison: FL[fig] + ' (M' + pos + ') incompatible avec sa maison (résultante ' + FL[fmFig.res] + ', ' + fmFig.elemRes + '/' + fmFig.elemMaison + ') ET son binôme ' + FL[binFig] + ' incompatible avec sa propre maison de repos M' + posReposBinome + ' (résultante ' + FL[fmBin.res] + ', ' + fmBin.elemRes + '/' + fmBin.elemMaison + ')'
  };
}

// ═══════════════════════════════════════════════════════════════
// VULNÉRABILITÉ DES BINÔMES FAIBLES (T-A, E-A, F-E)
// ═══════════════════════════════════════════════════════════════

/**
 * Vérifie si la concordance binôme/figure correspond à une paire élémentaire
 * jugée "facile à contrecarrer" : Terre-Air, Eau-Air, Feu-Eau (dans les deux sens)
 */
function binomeEstFaibleV7(figBinome, figBase) {
  var eB = ELEMENTS_V7[figBinome];
  var eF = ELEMENTS_V7[figBase];
  var pairesFaibles = ['terre-air','air-terre','eau-air','air-eau','feu-eau','eau-feu'];
  var key = eB + '-' + eF;
  return pairesFaibles.indexOf(key) >= 0;
}

// ═══════════════════════════════════════════════════════════════
// ANTAGONISTES RENFORCÉS (T-T/T-E engagés + maison de repos)
// ═══════════════════════════════════════════════════════════════

/**
 * Retourne Y tel que ANTAGONISTES_V7[Y] === fig, c-a-d la figure dont `fig` est l'antagoniste
 * (la figure que `fig` detruit). Le cycle ANTAGONISTES_V7 etant une permutation complete des
 * 16 figures, Y existe toujours et est unique.
 */


/**
 * Regle empirique : une figure a sa maison de repos AVEC son binome present dans le theme
 * est difficile a deraciner (resistance accrue a la destruction), se soutient elle-meme,
 * et detruit plus efficacement la figure dont elle est l'antagoniste.
 */
function estReposAvecBinomeV7(fig, theme) {
  var posRepos = FIGS_V7.indexOf(fig) + 1;
  var atRepos = theme[posRepos] === fig;
  var binFig = BINOMES_V7[fig];
  var binPresent = trouverFigV7(binFig, theme).length > 0;
  return {actif: atRepos && binPresent, atRepos: atRepos, binPresent: binPresent, posRepos: posRepos, binFig: binFig};
}

/**
 * Calcule le score de destruction d'un antagoniste sur une figure, avec bonus :
 * - concordance terre-terre ou terre-eau : antagoniste plus engagé à bloquer (+25%)
 * - antagoniste dans SA PROPRE maison de repos : bonus de destruction (+30%)
 * - binôme de l'antagoniste dans SA PROPRE maison de repos : bonus supplémentaire (+20%)
 * - si le binôme de la figure de base est "faible" (T-A/E-A/F-E) : l'attaque pèse encore plus (+20%)
 */
function scoreDestructionAntagonisteV7(fig, pos, theme) {
  var antFig = ANTAGONISTES_V7[fig];
  var antPositions = trouverFigV7(antFig, theme);
  if (!antPositions.length) return {score:0, detail:'antagoniste absent', bonus:[]};

  var conc = concordanceV7(ELEMENTS_V7[antFig], ELEMENTS_V7[fig]);
  var score = conc.score;
  var bonus = [];

  // Antagoniste engagé : terre-terre ou terre-eau
  var eAnt = ELEMENTS_V7[antFig], eFig = ELEMENTS_V7[fig];
  var keyConc = eAnt + '-' + eFig;
  if (keyConc === 'terre-terre' || keyConc === 'terre-eau' || keyConc === 'eau-terre') {
    score = Math.round(score * 1.25);
    bonus.push('antagoniste engagé (' + keyConc + ') +25%');
  }

  // Antagoniste dans sa propre maison de repos
  var antPos = antPositions[0];
  var posReposAnt = FIGS_V7.indexOf(antFig) + 1;
  if (antPos.pos === posReposAnt && !antPos.hidden) {
    score = Math.round(score * 1.30);
    bonus.push('antagoniste dans sa maison de repos M' + posReposAnt + ' +30%');
  }

  // Binôme de l'antagoniste dans sa propre maison de repos
  var binDeAnt = BINOMES_V7[antFig];
  var binDeAntPositions = trouverFigV7(binDeAnt, theme);
  if (binDeAntPositions.length) {
    var posReposBinAnt = FIGS_V7.indexOf(binDeAnt) + 1;
    var binAntInRepos = binDeAntPositions.some(function(p) { return p.pos === posReposBinAnt && !p.hidden; });
    if (binAntInRepos) {
      score = Math.round(score * 1.20);
      bonus.push('binôme antagoniste (' + FL[binDeAnt] + ') dans sa maison de repos M' + posReposBinAnt + ' +20%');
    } else {
      score = Math.round(score * 1.10);
      bonus.push('binôme antagoniste présent +10%');
    }
  }

  // Binôme de la figure de base est faible (T-A/E-A/F-E) -> plus vulnérable
  var binFig = BINOMES_V7[fig];
  if (binomeEstFaibleV7(binFig, fig)) {
    score = Math.round(score * 1.20);
    bonus.push('binôme ' + FL[binFig] + ' vulnérable (concordance faible) +20%');
  }

  // Antagoniste lui-même à sa maison de repos avec son binôme présent : "difficile à déraciner"
  // -> il détruit plus efficacement la figure dont il est l'antagoniste (regle empirique)
  var antRepos = estReposAvecBinomeV7(antFig, theme);
  if (antRepos.actif) {
    score = Math.round(score * 1.25);
    bonus.push(FL[antFig] + ' à sa maison de repos M' + antRepos.posRepos + ' avec binôme ' + FL[antRepos.binFig] + ' présent (difficile à déraciner) +25%');
  }

  return {score: score, antFig: antFig, conc: conc, bonus: bonus, detail: FL[antFig] + ' score=' + score + (bonus.length ? ' (' + bonus.join(', ') + ')' : '')};
}

function chaineSoutienV7(figDepart, theme) {
  var chaine = [], totalForce = 0, vus = {};
  vus[figDepart] = true;
  var cur = figDepart;
  for (var step = 1; step <= 16; step++) {
    var binFig = BINOMES_V7[cur];
    if (!binFig || vus[binFig]) break; // circulaire : retombe sur une figure déjà vue
    var positions = trouverFigV7(binFig, theme);
    if (!positions.length) break; // maillon absent du thème -> chaîne stoppée
    var attenuation = Math.max(0.2, 1 - (step-1)*0.15);
    var conc = concordanceV7(ELEMENTS_V7[binFig], ELEMENTS_V7[cur]);
    var forceMaillon = Math.round(conc.score * attenuation);
    chaine.push({fig:binFig, pos:positions[0].pos, hidden:positions[0].hidden, step:step, conc:conc, force:forceMaillon});
    totalForce += forceMaillon;
    vus[binFig] = true;
    cur = binFig;
    if (BINOMES_V7[binFig] === figDepart) { totalForce += 20; break; } // boucle complète refermée
  }
  return {chaine:chaine, totalForce:totalForce, longueur:chaine.length};
}

// Chaîne d'attaque : antagoniste fixe de la figure (cherché dans le thème) + voisins (ordre repos) → leurs binômes
function chaineAttaqueV7(fig, pos, theme) {
  var antFig = ANTAGONISTES_V7[fig];
  var antPositions = trouverFigV7(antFig, theme);
  var totalForce = 0, branches = [];

  if (antPositions.length > 0) {
    var bp = antPositions[0];
    var prox = proxV7(pos, bp.pos);
    var conc = concordanceV7(ELEMENTS_V7[antFig], ELEMENTS_V7[fig]);
    var destRenf = scoreDestructionAntagonisteV7(fig, pos, theme);
    var force = Math.round(destRenf.score * prox / 100);
    totalForce += force;
    branches.push({type:'direct', fig:antFig, pos:bp.pos, force:force, conc:conc, bonus:destRenf.bonus});
  }

  // Voisins dans l'ordre des figures de repos (±1), pas dans l'ordre des maisons du thème
  var idx = FIGS_V7.indexOf(fig);
  var voisins = [FIGS_V7[(idx-1+16)%16], FIGS_V7[(idx+1)%16]];

  voisins.forEach(function(voisin) {
    var vPos = trouverFigV7(voisin, theme);
    if (!vPos.length) return;
    var cur2 = voisin, vus2 = {}, forceAcc = 0, chain2 = [{fig:voisin, pos:vPos[0].pos}];
    vus2[voisin] = true;
    for (var s = 1; s <= 8; s++) {
      var bf = BINOMES_V7[cur2];
      if (!bf || vus2[bf]) break;
      var bpos = trouverFigV7(bf, theme);
      if (!bpos.length) break;
      var att = Math.max(0.1, 1 - s*0.2);
      var conc2 = concordanceV7(ELEMENTS_V7[bf], ELEMENTS_V7[cur2]);
      var f2 = Math.round(conc2.score * att);
      forceAcc += f2;
      chain2.push({fig:bf, pos:bpos[0].pos, force:f2});
      vus2[bf] = true;
      cur2 = bf;
      if (bf === antFig) {
        var fi = Math.round(forceAcc * 0.5);
        totalForce += fi;
        branches.push({type:'indirect', voisin:voisin, chaine:chain2, force:fi, atteint:true});
        return;
      }
    }
    if (chain2.length > 1) {
      var fp = Math.round(forceAcc * 0.2);
      totalForce += fp;
      branches.push({type:'partiel', voisin:voisin, chaine:chain2, force:fp, atteint:false});
    }
  });

  return {antFig:antFig, totalForce:totalForce, branches:branches};
}

// Neutralisation : un maillon du soutien qui est l'antagoniste FIXE d'un maillon de l'attaque
function neutralisationV7(soutien, attaque) {
  var soutienFigs = {};
  soutien.chaine.forEach(function(m) { soutienFigs[m.fig] = true; });
  var neutralForce = 0, details = [];
  attaque.branches.forEach(function(b) {
    var figs = b.chaine ? b.chaine.map(function(m){return m.fig;}) : [b.fig];
    figs.forEach(function(af) {
      var antOfAtk = ANTAGONISTES_V7[af];
      if (soutienFigs[antOfAtk]) {
        var nf = Math.round((b.force||0) * 0.7);
        neutralForce += nf;
        details.push(FL[antOfAtk] + ' (soutien) neutralise ' + FL[af] + ' (-' + nf + ')');
      }
    });
  });
  return {neutralForce:neutralForce, details:details};
}

// Score complet d'une figure à sa position
function scoreV7(fig, pos, theme) {
  var soutien = chaineSoutienV7(fig, theme);
  var attaque = chaineAttaqueV7(fig, pos, theme);
  var neutral = neutralisationV7(soutien, attaque);
  var attaqueNette = Math.max(0, attaque.totalForce - neutral.neutralForce);

  // Regle empirique "difficile a deraciner" : fig a sa maison de repos AVEC son binome
  // present dans le theme -> resistance accrue (attaque subie reduite) + soutien renforce.
  var reposBinome = estReposAvecBinomeV7(fig, theme);
  var reposBinomeActif = reposBinome.actif && pos === reposBinome.posRepos;
  if (reposBinomeActif) {
    attaqueNette = Math.round(attaqueNette * 0.7); // -30% d'attaque subie (difficile a deraciner)
  }

  var scoreNet = Math.max(0, soutien.totalForce - attaqueNette);
  if (reposBinomeActif) {
    scoreNet = scoreNet + 20; // bonus "elle soutient"
  }
  var fm = forceMaisonV7(fig, pos);

  var canScore = scoreNet > 0 && soutien.chaine.some(function(m) {
    return m.conc && (m.conc.type === 'force_forte' || m.conc.type === 'force');
  });
  var isDestroyed = attaqueNette > soutien.totalForce && attaque.totalForce > 0;

  // Paralysie par chaîne résultante : pas de binôme direct présent dans le thème
  var binomeDirFig = BINOMES_V7[fig];
  var binomeDirPositions = trouverFigV7(binomeDirFig, theme);
  var chainDestruction = false, chainParalysis = false, chainDetail = '';

  if (!binomeDirPositions.length) {
    var resFig = combine(fig, FIGS_V7[pos-1]);
    var resBinFig = BINOMES_V7[resFig];
    var resBinPositions = trouverFigV7(resBinFig, theme);
    if (resBinPositions.length) {
      var resBinBinFig = BINOMES_V7[resBinFig];
      if (resBinBinFig === ANTAGONISTES_V7[fig]) {
        var antPos2 = trouverFigV7(resBinBinFig, theme);
        if (antPos2.length) {
          var concChain = concordanceV7(ELEMENTS_V7[resBinBinFig], ELEMENTS_V7[fig]);
          var proxChain = proxV7(pos, antPos2[0].pos);
          if (concChain.score >= 70 && proxChain >= 70) {
            chainDestruction = true;
            chainDetail = FL[fig]+' chaine: '+FL[resFig]+'->'+FL[resBinFig]+'->'+FL[resBinBinFig];
            var antBinFig = BINOMES_V7[resBinBinFig];
            if (trouverFigV7(antBinFig, theme).length) {
              chainParalysis = true;
              chainDetail += ' + '+FL[antBinFig]+' present = PARALYSIE';
            }
          }
        }
      }
    }
  }

  if (chainDestruction) { canScore = false; isDestroyed = true; }

  // Règle de blocage : pas de binôme dans le thème + antagoniste concordant
  var blocage = figureBloqueeParAntagonisteV7(fig, pos, theme);
  if (blocage.bloque) { canScore = false; isDestroyed = true; }

  // Règle de blocage : double incompatibilité de maison (figure + binôme dans sa propre maison de repos)
  var blocageMaison = figureBloqueeIncompatibiliteMaisonV7(fig, pos);
  if (blocageMaison.bloque) { canScore = false; isDestroyed = true; }

  // Score de destruction renforcé par antagoniste (engagement T-T/T-E, maison de repos, binôme faible)
  var destructionRenforcee = scoreDestructionAntagonisteV7(fig, pos, theme);

  // Auto-construction : bonus de force si résultante = binôme propre
  var autoConstruct = checkAutoConstruction(fig, pos);
  var scoreNetAjuste = scoreNet;
  if (autoConstruct) {
    scoreNetAjuste = scoreNet + 25;
  }

  // Auto-destruction : pénalité au score net (affaibli mais peut encore marquer)
  var autoDestruct = checkAutoDestruction(fig, pos);
  if (autoDestruct) {
    scoreNetAjuste = Math.max(0, scoreNetAjuste - 30);
  }

  // Maison forte par double concordance (figure ET résultante du même élément que la maison)
  var doubleConc = checkMaisonDoubleConcordance(fig, pos);
  if (doubleConc.match) {
    scoreNetAjuste = scoreNetAjuste + 20;
  }

  return {
    fig:fig, pos:pos, fm:fm,
    soutien:soutien, attaque:attaque, neutral:neutral,
    attaqueNette:attaqueNette, scoreNet:scoreNetAjuste, scoreNetBrut:scoreNet,
    canScore:canScore, isDestroyed:isDestroyed,
    chainDestruction:chainDestruction, chainParalysis:chainParalysis, chainDetail:chainDetail,
    blocage:blocage, blocageMaison:blocageMaison, destructionRenforcee:destructionRenforcee,
    autoConstruct:autoConstruct, autoDestruct:autoDestruct, doubleConc:doubleConc,
    reposBinomeActif:reposBinomeActif,
    binomeFig: BINOMES_V7[fig], antagonisteFig: ANTAGONISTES_V7[fig]
  };
}


// Regle de blocage : aucun binome dans le theme, antagoniste concordant -> ne marque pas
function figureBloqueeParAntagonisteV7(fig, pos, theme) {
  var binFig = BINOMES_V7[fig];
  var binPositions = trouverFigV7(binFig, theme);
  if (binPositions.length > 0) return {bloque:false, raison:''}; // binôme présent -> pas bloqué

  var antFig = ANTAGONISTES_V7[fig];
  var antPositions = trouverFigV7(antFig, theme);
  if (!antPositions.length) return {bloque:false, raison:''}; // pas d'antagoniste présent -> pas bloqué

  var eFig = ELEMENTS_V7[fig];
  var eAnt = ELEMENTS_V7[antFig];
  var concordancesBlocage = [
    'feu-feu','air-air','eau-eau','terre-terre','feu-air','air-feu','eau-terre','terre-eau'
  ];
  var key = eFig + '-' + eAnt;
  if (concordancesBlocage.indexOf(key) === -1) return {bloque:false, raison:''};

  var bp = antPositions[0];
  return {
    bloque: true,
    raison: FL[fig] + ' (M' + pos + ') sans binôme dans le thème, contré par antagoniste ' + FL[antFig] + ' (M' + bp.pos + (bp.hidden?'/inv':'') + ') — concordance ' + eFig + '/' + eAnt
  };
}


// ═══════════════════════════════════════════════════════════════
// RÈGLE EMPRISONNEMENT — double attaque sur figure de base + binôme
// ═══════════════════════════════════════════════════════════════

/**
 * Analyse l'emprisonnement d'une figure à sa position :
 * - Attaque niveau 1 : la figure de base est attaquée par son antagoniste (présent)
 * - Attaque niveau 2 : le binôme de la figure est attaqué par SON antagoniste (présent)
 * - Emprisonnement total : si l'antagoniste de la figure possède un binôme présent,
 *   ET l'antagoniste du binôme de la figure possède aussi un binôme présent
 */
function analyseEmprisonnementV7(fig, pos, theme) {
  var antFig = ANTAGONISTES_V7[fig];
  var antPositions = trouverFigV7(antFig, theme);
  var attaqueNiveau1 = antPositions.length > 0;
  var concNiveau1 = attaqueNiveau1 ? concordanceV7(ELEMENTS_V7[antFig], ELEMENTS_V7[fig]) : {type:'neutre', score:0};

  var binFig = BINOMES_V7[fig];
  var antDuBinomeFig = ANTAGONISTES_V7[binFig];
  var antDuBinomePositions = trouverFigV7(antDuBinomeFig, theme);
  var attaqueNiveau2 = antDuBinomePositions.length > 0;
  var concNiveau2 = attaqueNiveau2 ? concordanceV7(ELEMENTS_V7[antDuBinomeFig], ELEMENTS_V7[binFig]) : {type:'neutre', score:0};

  // Renfort 1 : l'antagoniste de la figure possède un binôme présent dans le thème
  var binDeAntFig = BINOMES_V7[antFig];
  var binDeAntPresent = trouverFigV7(binDeAntFig, theme).length > 0;

  // Renfort 2 : l'antagoniste du binôme de la figure possède aussi un binôme présent
  var binDeAntDuBinomeFig = BINOMES_V7[antDuBinomeFig];
  var binDeAntDuBinomePresent = trouverFigV7(binDeAntDuBinomeFig, theme).length > 0;

  var emprisonne = attaqueNiveau1 && attaqueNiveau2 && binDeAntPresent && binDeAntDuBinomePresent;

  // Score de destruction total = somme des concordances pondérées par les renforts
  var scoreDestruction = 0;
  if (attaqueNiveau1) scoreDestruction += concNiveau1.score;
  if (attaqueNiveau2) scoreDestruction += concNiveau2.score;
  if (binDeAntPresent) scoreDestruction += Math.round(concNiveau1.score * 0.4);
  if (binDeAntDuBinomePresent) scoreDestruction += Math.round(concNiveau2.score * 0.4);

  return {
    fig: fig, pos: pos,
    antFig: antFig, attaqueNiveau1: attaqueNiveau1, concNiveau1: concNiveau1,
    binFig: binFig, antDuBinomeFig: antDuBinomeFig, attaqueNiveau2: attaqueNiveau2, concNiveau2: concNiveau2,
    binDeAntPresent: binDeAntPresent, binDeAntDuBinomePresent: binDeAntDuBinomePresent,
    emprisonne: emprisonne,
    scoreDestruction: scoreDestruction
  };
}

/**
 * Compare l'emprisonnement de M1 et M7 : celui qui a le score de destruction
 * le plus élevé (le plus détruit / le plus concordant dans ses attaques) perd.
 */

// ═══════════════════════════════════════════════════════════════
// DUALITÉ M1/M7 PAR CYCLES DE BINÔMES ET CYCLE ANTAGONISTE
// ═══════════════════════════════════════════════════════════════

// Deux cycles de binômes fixes
var BINOME_CYCLE_1 = ['puer','caput_draconis','via','rubeus','fortuna_minor','conjunctio','cauda_draconis','acquisitio'];
var BINOME_CYCLE_2 = ['laetitia','albus','amissio','tristitia','carcer','fortuna_major','puella','populus'];

// Grand cycle antagoniste (un seul de 16)
var ANT_CYCLE = ['puer','puella','conjunctio','tristitia','via','laetitia','acquisitio','fortuna_major','fortuna_minor','amissio','caput_draconis','populus','cauda_draconis','carcer','rubeus','albus'];

function getBinomeCycle(fig) {
  if (BINOME_CYCLE_1.indexOf(fig) >= 0) return 1;
  if (BINOME_CYCLE_2.indexOf(fig) >= 0) return 2;
  return 0;
}

// Score d'impact antagoniste sur une figure (concordance * présence binôme de l'antagoniste)
function scoreImpactAntagoniste(fig, theme) {
  var antFig = ANTAGONISTES_V7[fig];
  var antPositions = trouverFigV7(antFig, theme);
  if (!antPositions.length) return {score:0, detail:'antagoniste absent'};
  var conc = concordanceV7(ELEMENTS_V7[antFig], ELEMENTS_V7[fig]);
  var binDeAnt = BINOMES_V7[antFig];
  var binDeAntPresent = trouverFigV7(binDeAnt, theme).length > 0;
  var score = conc.score;
  if (binDeAntPresent) score = Math.round(score * 1.4);
  return {
    score: score,
    conc: conc,
    antFig: antFig,
    binDeAnt: binDeAnt,
    binDeAntPresent: binDeAntPresent,
    detail: FL[antFig] + ' conc=' + conc.type + '(' + conc.score + ')' + (binDeAntPresent ? ' + binôme ' + FL[binDeAnt] + ' présent' : '')
  };
}

// Figures présentes dans le thème entre posA et posB dans le cycle antagoniste
function figuresEntreAntCycle(figA, figB, theme) {
  var posA = ANT_CYCLE.indexOf(figA);
  var posB = ANT_CYCLE.indexOf(figB);
  if (posA < 0 || posB < 0) return {A_vers_B: [], B_vers_A: []};
  var n = ANT_CYCLE.length;

  var entre_A_B = [];
  var i = (posA + 1) % n;
  while (i !== posB) {
    if (trouverFigV7(ANT_CYCLE[i], theme).length > 0) entre_A_B.push(ANT_CYCLE[i]);
    i = (i + 1) % n;
  }

  var entre_B_A = [];
  i = (posB + 1) % n;
  while (i !== posA) {
    if (trouverFigV7(ANT_CYCLE[i], theme).length > 0) entre_B_A.push(ANT_CYCLE[i]);
    i = (i + 1) % n;
  }

  return {A_vers_B: entre_A_B, B_vers_A: entre_B_A};
}

/**
 * Duel M1 vs M7 basé sur les cycles de binômes et le cycle antagoniste.
 * Retourne {winner:'A'|'B'|'Nul', reasons:[], details:{}}
 */
function duelCyclesV7(posA, posB, theme) {
  var figA = theme[posA];
  var figB = theme[posB];
  var cycleA = getBinomeCycle(figA);
  var cycleB = getBinomeCycle(figB);
  var reasons = [];
  var winner = 'Nul';

  // --- RÈGLE 1 : Cycles de binômes ---
  var impactA = scoreImpactAntagoniste(figA, theme);
  var impactB = scoreImpactAntagoniste(figB, theme);

  if (cycleA === cycleB) {
    // Même cycle : celui le plus affecté par son antagoniste perd
    reasons.push('Cycle binôme identique (' + (cycleA === 1 ? 'cycle impair' : 'cycle pair') + ') : ' + FL[figA] + ' impact=' + impactA.score + ' / ' + FL[figB] + ' impact=' + impactB.score);
    if (Math.abs(impactA.score - impactB.score) <= 10) {
      reasons.push('Impact antagoniste quasi-égal -> pas de tranchée par ce critère');
    } else if (impactA.score > impactB.score) {
      winner = 'B';
      reasons.push(FL[figA] + ' plus affecté par son antagoniste (' + impactA.detail + ') -> perd');
    } else {
      winner = 'A';
      reasons.push(FL[figB] + ' plus affecté par son antagoniste (' + impactB.detail + ') -> perd');
    }
  } else {
    // Cycles différents : opposition directe, note informative
    reasons.push('Cycles binôme différents : ' + FL[figA] + ' (cycle ' + cycleA + ') vs ' + FL[figB] + ' (cycle ' + cycleB + ') — opposition directe');
  }

  // --- RÈGLE 2 : Cycle antagoniste — pression par figures intermédiaires ---
  var entre = figuresEntreAntCycle(figA, figB, theme);
  var pressionSurB = entre.A_vers_B.length; // figures du cycle entre A et B (pression sur B)
  var pressionSurA = entre.B_vers_A.length; // figures du cycle entre B et A (pression sur A)

  reasons.push('Cycle antagoniste : ' + pressionSurB + ' fig(s) entre ' + FL[figA] + '→' + FL[figB] + ' / ' + pressionSurA + ' fig(s) entre ' + FL[figB] + '→' + FL[figA]);

  if (Math.abs(pressionSurA - pressionSurB) >= 2) {
    if (pressionSurA > pressionSurB) {
      // Plus de pression sur A -> A affaibli
      if (winner === 'Nul') { winner = 'B'; reasons.push('Pression antagoniste plus forte sur ' + FL[figA] + ' (' + pressionSurA + ' figs) -> perd'); }
      else if (winner === 'B') { reasons.push('Pression antagoniste confirme : ' + FL[figA] + ' affaibli'); }
      else { reasons.push('Pression antagoniste contredit cycle binôme -> maintenu Nul (contradiction)'); winner = 'Nul'; }
    } else {
      if (winner === 'Nul') { winner = 'A'; reasons.push('Pression antagoniste plus forte sur ' + FL[figB] + ' (' + pressionSurB + ' figs) -> perd'); }
      else if (winner === 'A') { reasons.push('Pression antagoniste confirme : ' + FL[figB] + ' affaibli'); }
      else { reasons.push('Pression antagoniste contredit cycle binôme -> maintenu Nul (contradiction)'); winner = 'Nul'; }
    }
  } else {
    reasons.push('Pression antagoniste équilibrée (écart < 2) -> pas de tranchée');
  }

  return {
    figA: figA, figB: figB,
    cycleA: cycleA, cycleB: cycleB,
    impactA: impactA, impactB: impactB,
    pressionSurA: pressionSurA, pressionSurB: pressionSurB,
    entre: entre,
    winner: winner, reasons: reasons
  };
}


// ═══════════════════════════════════════════════════════════════
// FIXE OU MOBILE EN DÉFENSE ? LA RÉPONSE (05/09/26)
// ═══════════════════════════════════════════════════════════════
// Ellemine_D : « est-ce les figures fixes qui sont bonnes en défense,
// ou encore les mobiles ouvertes, comment favorisent-elles les buts ?
// Via n'est pas bonne en défense, elle bouge trop. »
//
// CONTRÔLE FAIT D'ABORD, parce qu'il pouvait tout invalider : le moteur
// BTTS utilise DÉJÀ mobilité et ouverture sur M4 et M10 (« CAS 1 : M4 et
// M10 sont toutes deux mobiles ET ouvertes », voir 20-points-guerre).
// Mesurer ça sur le MOTEUR aurait donc été circulaire. Tout ce qui suit
// est mesuré sur les VRAIS SCORES de l'archive, pas sur ses verdicts.
//
// L'INDICE, opérationnalisation directe de ta doctrine :
//        DÉFENSE TENUE = fermée + passive + fixe, sur M4 ET M10
//        (un point par propriété tenue, de 0 à 6)
//
//        rho = −0,336 contre les buts réels, p unilatéral = 0,0101
//        quatre tests menés, donc 0,040 après Bonferroni — ça tient.
//
//        buts moyens par niveau (n = 48) :
//          1/6 → 5,00    2/6 → 5,56    3/6 → 4,50
//          4/6 → 3,29    5/6 → 0,75 buts et 0 % de BTTS (n = 4)
//
// ── LA RÉPONSE À TA QUESTION, ET ELLE CORRIGE LE CADRE ──
// Décomposé propriété par propriété, contre les buts réels :
//        FERMETURE seule (M4+M10) ..... rho −0,280   p = 0,027   PORTE
//        PASSIVITÉ seule (M4+M10) ..... rho −0,277   p = 0,029   PORTE
//        FIXITÉ    seule (M4+M10) ..... rho −0,079   p = 0,296   NE PORTE PAS
//
// Ce ne sont donc PAS les figures fixes qui défendent. C'est le FERMÉ et
// le PASSIF. La mobilité, prise seule, ne dit rien. Ton intuition sur
// Via était juste, mais pas pour la raison que tu donnais : Via nuit en
// défense parce qu'elle est OUVERTE et ACTIVE, pas parce qu'elle bouge.
//
// ── ET IL FAUT LES DEUX MAISONS ──
//        M4 seule (0 à 3) ..... rho −0,184   p = 0,103
//        M10 seule (0 à 3) .... rho −0,195   p = 0,091
//        les deux ensemble .... rho −0,336   p = 0,010
// Ni l'une ni l'autre n'atteint le seuil seule. C'est l'AXE qui parle,
// pas la maison — ce qui est cohérent avec la loi M4 ⊕ M10 = M3.
//
// ── L'ATTAQUE, EN REVANCHE, NE RÉPOND PAS ──
//        ATTAQUE VIVE = ouverte + active + mobile, sur M5 et M11
//        rho = +0,156 contre les buts, p = 0,143. RIEN.
// La symétrie que tu supposais n'existe pas dans les chiffres : on sait
// mesurer ce qui FERME un match, pas ce qui l'ouvre.
//
// CE QUI CLOCHE ET QUE JE NE PEUX PAS RÉPARER : la DIRECTION était
// donnée par ta doctrine avant toute mesure, mais la composition exacte
// de l'indice — ces trois propriétés-là, ces deux maisons-là — a été
// choisie APRÈS avoir vu le tableau des 64 croisements. Seules des
// rencontres annoncées à l'avance lèveront ça.
var DEFENSE_PROPRIETES_V7 = {
  indice: 'fermée + passive + fixe, sur M4 et M10, de 0 à 6',
  contreLesButs: { rho: -0.336, p: 0.0101, n: 48, bonferroni4: 0.040 },
  decomposition: {
    fermeture: { rho: -0.280, p: 0.0267, porte: true },
    passivite: { rho: -0.277, p: 0.0285, porte: true },
    fixite:    { rho: -0.079, p: 0.2956, porte: false } },
  parMaison: { M4: { rho: -0.184, p: 0.103 }, M10: { rho: -0.195, p: 0.091 } },
  attaque: { indice: 'ouverte + active + mobile sur M5 et M11',
    rho: 0.156, p: 0.143, porte: false },
  reponse: 'ce ne sont PAS les fixes qui défendent, ce sont les FERMÉES et les '
    + 'PASSIVES ; la mobilité seule ne dit rien, et il faut les DEUX maisons '
    + 'de l\'axe, aucune ne suffit seule',
  circularite: 'écarté — le moteur BTTS utilise mobilité et ouverture sur M4/M10, '
    + 'donc tout est mesuré sur les VRAIS SCORES, pas sur ses verdicts',
  faiblesse: 'la direction venait de la doctrine, mais la composition exacte a été '
    + 'choisie après avoir vu les 64 croisements'
};

// L'indice sur un thème, plus son niveau et ce qu'on en sait.
function defenseTenueV7(theme) {
  if (!theme || typeof OUVERTURE_FIGURE === 'undefined') return null;
  var det = [];
  var n = 0;
  [4, 10].forEach(function (h) {
    var f = theme[h];
    var fe = OUVERTURE_FIGURE[f] === 'fermee';
    var pa = ACTIVE_PASSIVE_FIGURE[f] === 'passive';
    var fi = MOBILITE_FIGURE[f] === 'fixe';
    if (fe) n++; if (pa) n++; if (fi) n++;
    det.push({ maison: 'M' + h, figure: f, fermee: fe, passive: pa, fixe: fi,
      tenu: (fe ? 1 : 0) + (pa ? 1 : 0) + (fi ? 1 : 0) });
  });
  return { indice: n, sur: 6, detail: det,
    lecture: n >= 5 ? 'défense très tenue — sur l\'archive ce niveau donne 0,75 but'
      : n >= 4 ? 'défense tenue — 3,29 buts en moyenne'
      : n >= 2 ? 'défense ouverte — 4,5 à 5,6 buts'
      : 'défense béante',
    ceQuiPorte: 'la fermeture et la passivité ; la fixité ne porte rien (p = 0,296)' };
}

// Rejoué sur TA base, pas sur les 48 du dépôt.
function defenseTenueLiveV7() {
  var CAS = [];
  try { CAS = tousCasBancV7() || []; } catch (e) { return null; }
  var pts = [];
  CAS.forEach(function (c) {
    var g = /^(\d+)-(\d+)$/.exec(c.score || '');
    if (!g || !c.meres) return;
    var t; try { t = calcTheme(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    var d = defenseTenueV7(t);
    if (d) pts.push({ x: d.indice, y: +g[1] + +g[2] });
  });
  if (pts.length < 12) return null;
  function rangs(v) {
    var i2 = v.map(function (_, i) { return i; });
    i2.sort(function (a, b) { return v[a] - v[b]; });
    var r = new Array(v.length), i = 0;
    while (i < i2.length) {
      var j = i;
      while (j + 1 < i2.length && v[i2[j + 1]] === v[i2[i]]) j++;
      var m = (i + j) / 2 + 1;
      for (var k = i; k <= j; k++) r[i2[k]] = m;
      i = j + 1;
    }
    return r;
  }
  var xr = rangs(pts.map(function (p) { return p.x; }));
  var yr = rangs(pts.map(function (p) { return p.y; }));
  var n = pts.length, mx = 0, my = 0, i;
  for (i = 0; i < n; i++) { mx += xr[i]; my += yr[i]; }
  mx /= n; my /= n;
  var num = 0, dx = 0, dy = 0;
  for (i = 0; i < n; i++) {
    var a = xr[i] - mx, b = yr[i] - my; num += a * b; dx += a * a; dy += b * b;
  }
  var rho = (dx > 0 && dy > 0) ? num / Math.sqrt(dx * dy) : 0;
  var parNiveau = {};
  pts.forEach(function (p) {
    var o = parNiveau[p.x] || (parNiveau[p.x] = { n: 0, buts: 0 });
    o.n++; o.buts += p.y;
  });
  Object.keys(parNiveau).forEach(function (k) {
    parNiveau[k].moyenne = Math.round(100 * parNiveau[k].buts / parNiveau[k].n) / 100;
  });
  return { n: n, rho: Math.round(rho * 1000) / 1000, parNiveau: parNiveau,
    gele: { n: 48, rho: -0.336, p: 0.0101 } };
}
