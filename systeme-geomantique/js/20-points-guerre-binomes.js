// ═══════════════════════════════════════════════════════════════
// POINTS GUERRE BINOMES
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// MÉTHODE DES POINTS (du maître) — Pietro d'Abano (05/07/26)
// Chaque figure a une valeur en POINTS (lignes simples=1, doubles=2) :
// Populus 8, {Laetitia,Albus,Rubeus,Tristitia} 7, {Amissio,F.Minor,
// Carcer,Conjunctio,F.Major,Acquisitio} 6, {Puer,Caput,Cauda,Puella} 5,
// Via 4. Total des 16 = 96 (référence traditionnelle).
// Colonne 1 = somme des points des 8 maisons de chaque camp (base).
//   Vérifié exactement sur les tableaux du maître : Australie 51,
//   Egypte 49, USA 47, Bosnie 45.
// Colonne 2 = réduction théosophique (somme des chiffres jusqu'à 1
//   chiffre) : 15→6, 13→4, 16→7, 20→2 (tous confirmés).
// VERDICT : quand les deux camps aboutissent au MÊME nombre → NUL
//   (Australie 12 = Egypte 12 → nul, confirmé par le maître).
// STATUT : 8e approche du nul, la 1re QUANTITATIVE (arithmétique), issue
// d'une tradition réelle. La conversion finale exacte reste à affiner ;
// on affiche points bruts + réduction + signal d'égalité.
// ═══════════════════════════════════════════════════════════════
var POINTS_FIG = (function(){
  var mg = (typeof MAP_GEO!=='undefined') ? MAP_GEO : null;
  var v = {};
  if(mg){ for(var k in mg){ v[k] = mg[k].reduce(function(s,x){return s+x;},0); } }
  return v;
})();
function reductionTheo(n){ while(n>9){ n = String(n).split('').reduce(function(s,d){return s + (+d);},0); } return n; }
function methodePoints(theme){
  var CAMP1=[1,2,3,4,9,10,13,16], CAMP2=[5,6,7,8,11,12,14,15];
  var p1=0,p7=0;
  CAMP1.forEach(function(p){ p1 += POINTS_FIG[theme[p]]||0; });
  CAMP2.forEach(function(p){ p7 += POINTS_FIG[theme[p]]||0; });
  var r1=reductionTheo(p1), r7=reductionTheo(p7);
  var egal = (r1===r7);
  return {p1:p1, p7:p7, r1:r1, r7:r7, egal:egal,
    resume:'🔢 Méthode des points (du maître) : Camp M1 = '+p1+' points (réduit '+r1+') | Camp M7 = '+p7+' points (réduit '+r7+')'+(egal?' → ÉGALITÉ des réductions : signal de NUL (arithmétique de Pietro d Abano)':' → M'+(p1>p7?'1':'7')+' a plus de points')};
}









// ═══════════════════════════════════════════════════════════════
// AUTO-NOURRISSEMENT / AUTO-DESTRUCTION STRUCTURELLE (08/07/26, porté
// depuis l'autre lignée du projet) — une figure hors de son repos peut
// générer, par combinaison avec la figure de repos de la maison qu'elle
// occupe, sa PROPRE résultante-binôme ou résultante-antagoniste.
// Redécouvert par calcul exhaustif puis identifié comme identique à 100%
// aux tables AUTO_CONSTRUCT_HOUSE/AUTO_DESTRUCT_HOUSE déjà utilisées dans
// scoreV7 (+25/-30 sur scoreNet) mais jamais remontées en signal visible
// ni testées seules contre l'archive.
// Statut : FAIT STRUCTUREL vérifié mathématiquement, PAS encore testé
// empiriquement isolément -> signal d'étude uniquement, aucun poids
// dans verdictFinal tant qu'aucune validation rétrospective n'est faite.
// ═══════════════════════════════════════════════════════════════
function autoNourritBinome(fig, pos){
  if (fig === FIGS_V7[pos-1]) return false; // deja son propre repos : couvert ailleurs, pas ce signal
  return AUTO_CONSTRUCT_HOUSE[fig] === pos;
}
function autoDetruitAntagoniste(fig, pos){
  if (fig === FIGS_V7[pos-1]) return false;
  return AUTO_DESTRUCT_HOUSE[fig] === pos;
}
function signauxAutoNourriture(theme){
  const nourrit = [], detruit = [];
  for (let pos=1; pos<=16; pos++){
    const fig = theme[pos];
    if (autoNourritBinome(fig,pos)) nourrit.push({pos, fig, binome:BINOMES_V7[fig]});
    if (autoDetruitAntagoniste(fig,pos)) detruit.push({pos, fig, antagoniste:ANTAGONISTES_V7[fig]});
  }
  return {nourrit, detruit};
}






// ═══════════════════════════════════════════════════════════════
// PROFIL DU NUL STRUCTUREL — la zone aveugle historique
// CORRECTION (revue des principes du nul) : la version d'origine du
// 03/07/26 décrivait une doctrine à 3 conditions (entre-blocage + duel
// des binômes gap≤1.5 + juge Populus/Acquisitio EN REPOS ABSOLU) — mais
// cette doctrine a été remplacée dès le lendemain par "ÉTAPE 1 RÉVISÉE"
// (04/07/26, cf. fonction ci-dessous) sans que ce commentaire d'en-tête
// soit mis à jour : il décrivait donc une règle que le code n'exécute
// plus depuis longtemps. Ce que la fonction teste RÉELLEMENT aujourd'hui :
//   1. ENTRE-BLOCAGE : aucune figure "forte-libre" (présente + son
//      binôme présent + son antagoniste absent) en base ou résultante —
//      aucune force ne peut conclure le match.
//   2. LE JUGE CONSTATE (ne crée pas le nul) : M15 doit être l'une de
//      Conjunctio/Via/Carcer/Populus/Acquisitio, ET son binôme doit être
//      présent dans le thème (parole confirmée) — pas de condition de
//      "repos absolu" sur le juge, ni de duel des binômes chiffré.
// Le duel des binômes (gap≤1.5) et le "repos absolu" du juge de la
// version d'origine ne sont plus vérifiés nulle part dans cette fonction.
// Validation (04/07/26) : 17/17 sur l'archive (2 nuls capturés, 0 faux
// positif) — assemblée rétrospectivement, à confirmer en aveugle.
// L'énergie du thème (Déclencheurs+Amplificateurs+Chaotiques) dit si
// le nul MARQUE (≥6 : type 2-2/3-3) ou se ferme (testé <6 = 0/3, pas
// assez fiable pour conclure "se ferme", donc simplement pas de verdict).
// ═══════════════════════════════════════════════════════════════


function themeDetruit(theme){
  if(theme[1]==='rubeus' || theme[1]==='cauda_draconis'){
    return '⛔ THÈME DÉTRUIT : '+FL[theme[1]]+' en M1 — détruit sans être jugé (règle traditionnelle, confirmée empiriquement : réponses troubles, moteurs faux, et même l ancrage sur le favori réel a échoué 1/2). ABSTENTION TOTALE : aucun verdict ci-dessous n est valide. Refaire un tirage pour cette question.';
  }
  return null;
}



// ═══════════════════════════════════════════════════════════════
// L'ARBRE DU CHEF (04/07/26 — doctrine de la racine)
// « Le chef est le TRONC ; ses binômes en aval sont les BRANCHES ; sa
// RACINE est la figure dont il est le binôme (son amont, qui le nourrit
// par en dessous). Une racine bien plantée l'ancre. » La racine absente
// = chef DÉRACINÉ (c'est la "source absente" de l'effondrement vital,
// enfin nommée). Signal d'étude organique.
// ═══════════════════════════════════════════════════════════════


function detecteurGuerreCivile(theme){
  const f1=theme[1], f7=theme[7];
  const cycleOf = f => (FIGS_V7.indexOf(f)%2===0)?'impair':'pair';
  if(f1===f7 || cycleOf(f1)!==cycleOf(f7)) return {applicable:false};
  const cibleDe = fig => { for(const f of FIGS_V7){ if(ANTAGONISTES_V7[f]===fig) return f; } return null; };
  function trahison(campFig, advFig){
    const bin = BINOMES_V7[campFig];          // l'arme du camp
    const binAdv = BINOMES_V7[advFig];        // l'arme adverse
    const cible = cibleDe(bin);               // qui l'arme du camp attaque
    if(!cible || ANTAGONISTES_V7[binAdv]!==cible) return null; // la cible n'est pas le gardien de l'arme adverse
    const pBin = positionsBaseEtResultantes(bin, theme);
    const pCible = positionsBaseEtResultantes(cible, theme);
    const pBinAdv = positionsBaseEtResultantes(binAdv, theme);
    if(!pBin.length || !pCible.length || !pBinAdv.length) return null; // trahison sans objet
    return {bin, cible, binAdv, pBin, pCible, pBinAdv,
      detail: FL[bin]+' ('+pBin.join(',')+') frappe '+FL[cible]+' ('+pCible.join(',')+') et protège ainsi '+FL[binAdv]+' ('+pBinAdv.join(',')+'), l arme adverse'};
  }
  const t1 = trahison(f1, f7); // M1 trahi par son binôme
  const t7 = trahison(f7, f1);
  let winner=null, reason='Guerre civile de boucle ('+cycleOf(f1)+') sans trahison effective : règles normales.';
  if(t1 && !t7){ winner='M7'; reason='⚔️ GUERRE CIVILE — M1 trahi par son binôme : '+t1.detail+' → M7 favorisé'; }
  else if(t7 && !t1){ winner='M1'; reason='⚔️ GUERRE CIVILE — M7 trahi par son binôme : '+t7.detail+' → M1 favorisé'; }
  else if(t1 && t7){ reason='⚔️ GUERRE CIVILE — trahisons croisées des deux camps : indécis, se référer au Juge, à la Sentence et à la figure du jour.'; }
  return {applicable:true, winner, reason, t1, t7};
}

// ═══════════════════════════════════════════════════════════════
// GUERRE DES 16 (12/07/26, doctrine utilisateur) — le cas complémentaire
// exact de la guerre civile : quand M1 et M7 sont dans des boucles de
// binôme OPPOSÉES (pas la même), chaque camp (CAMP1 vs CAMP2) attaque
// l'autre via le réseau ANTAGONISTES, indépendamment dans les deux sens.
// Vérifié sur les tables réelles (12/07/26) :
//  • ANTAGONISTES[fig] EST le "4e figure derrière" (offset -3 dans
//    FIGS, en comptant fig lui-même comme 1er) — formule confirmée
//    sur les 16 figures.
//  • le double-antagoniste (ANTAGONISTES[ANTAGONISTES[fig]]) retombe
//    TOUJOURS dans sa propre boucle — vérifié universellement. Le
//    réseau d'attaque est donc interconnecté (chaque figure présente
//    est attaquée indépendamment), pas une simple paire figée attaque/contre.
// SENS D'ATTAQUE (corrigé 12/07/26 après 2 échecs réels 0/2) : ANTAGONISTES[X]=Y
// signifie que Y est l'antagoniste de X, donc Y ATTAQUE X — pas l'inverse.
// Vérifié contre le code déjà validé de la guerre civile (cibleDe dans
// detecteurGuerreCivile, qui utilise déjà ce sens) et confirmé par
// l'utilisateur sur un cas concret (Rubeus attaque Carcer, pas l'inverse).
// La 1ère version de cette fonction avait le sens inversé et s'est trompée
// sur ses 2 seuls tests réels (Fenerbahçe-Lombardia, Man City-Real Madrid) —
// recalculé avec le bon sens, les deux auraient été corrects.
// Pour chaque figure présente dans les maisons d'un camp, on regarde si SON
// PROPRE antagoniste (celui qui l'attaque) occupe une maison de l'autre
// camp : ça compte comme une attaque effective SUBIE par ce camp. Le camp
// qui SUBIT le moins d'attaques gagne — miroir exact des "attaques
// effectives" de la guerre civile, mais entre les deux boucles au lieu de
// l'intérieur d'une seule boucle partagée.
// STATUT : nouvelle règle, corrigée mais toujours non validée
// empiriquement sur l'archive — insérée en dernier recours (après guerre
// civile, après Chaotique/armementChaos déjà validés), avant le repli
// générique par hiérarchie élémentaire. Voir renderStatsTab pour son
// suivi avant éventuelle promotion à une priorité plus haute.
// ═══════════════════════════════════════════════════════════════
function detecteurGuerreDes16(theme){
  const f1=theme[1], f7=theme[7];
  const cycleOf = f => (FIGS_V7.indexOf(f)%2===0)?'impair':'pair';
  if(f1===f7 || cycleOf(f1)===cycleOf(f7)) return {applicable:false};
  function attaquesSubies(campVictime, campAttaquant){
    const liste=[];
    campVictime.forEach(hv=>{
      const figVictime = theme[hv];
      const attaquant = ANTAGONISTES_V7[figVictime]; // qui attaque cette figure
      campAttaquant.forEach(ha=>{
        if(theme[ha]===attaquant) liste.push({attaquant:'M'+ha, fig:attaquant, victimeFig:figVictime, victimeMaison:'M'+hv});
      });
    });
    return liste;
  }
  const subiesA = attaquesSubies(CAMP1, CAMP2); // attaques subies par M1, venant de M7
  const subiesB = attaquesSubies(CAMP2, CAMP1); // attaques subies par M7, venant de M1
  let winner=null, reason;
  if(subiesA.length !== subiesB.length){
    winner = subiesA.length < subiesB.length ? 'M1' : 'M7';
    reason = '💥 GUERRE DES 16 — M1 subit '+subiesA.length+' attaque(s) effective(s) vs M7 '+subiesB.length+' → '+winner+' favorisé (camp le plus résistant, le moins attaqué en net)';
  } else {
    reason = '💥 GUERRE DES 16 — attaques subies égales ('+subiesA.length+'-'+subiesB.length+') → indécis, se référer à la hiérarchie élémentaire.';
  }
  return {applicable:true, winner, reason, attA: subiesA, attB: subiesB};
}
// Buts additionnels (étude, 12/07/26, doctrine utilisateur) : maisons
// M4/M10 (camp M1) et M5/M11 (camp M7), désignées comme liées au score
// dans ce scénario. Somme des BUTS_FIGURE.max des deux figures par camp
// — pas encore mêlée au calcul principal (calculerButsCamp), exposée
// séparément pour suivi avant intégration.
function butsGuerreDes16(theme){
  const bA = (BUTS_FIGURE[theme[4]]||{max:0}).max + (BUTS_FIGURE[theme[10]]||{max:0}).max;
  const bB = (BUTS_FIGURE[theme[5]]||{max:0}).max + (BUTS_FIGURE[theme[11]]||{max:0}).max;
  return {campA:bA, campB:bB, detail:'M4('+FL[theme[4]]+')+M10('+FL[theme[10]]+')='+bA+' vs M5('+FL[theme[5]]+')+M11('+FL[theme[11]]+')='+bB};
}

// ═══════════════════════════════════════════════════════════════
// DUEL DES BINÔMES DIRECTS — départage des guerres civiles (03/07/26)
// Leçon du match "un but d'écart" (Laetitia vs Albus) : quand les deux
// chefs sont frappés, c'est la SANTÉ comparée de leurs soutiens directs
// qui départage. Santé d'un binôme = pour chaque siège (base+résultantes):
//   +1 présence, +1 colocataire de même boucle (l'autre habitant de la
//   chambre), +concordance élémentaire avec la maison (identique=1,
//   nourricière=0.5). Puis −1 par agression subie NON CONTRÉE : le
//   contre-attaquant doit être VIVANT (présent ET son propre binôme
//   présent — Puella sans Populus = contre mort).
// Validation rétrospective : 8/8 hors matchs souverains (juge-favori,
// trahison), écart ≥ 1 requis (sinon muet). Capture le 7-0 (Carcer 5 vs
// Cauda 1), le 3-4 (Acquisitio 2 vs Tristitia 1) et le "un but d'écart"
// (Amissio 0 vs Albus −1 : deux soutiens malades, le moins malade gagne).
// ⚠️ Règle construite a posteriori — le camp dominant et les chambres
// ont chuté à leur 1er test en aveugle. Statut : à confirmer en aveugle.
// PRIORITÉ : après la trahison, avant la hiérarchie élémentaire,
// UNIQUEMENT dans les guerres civiles (même boucle).
// ═══════════════════════════════════════════════════════════════
function duelBinomesDirects(theme){
  const cycleOf = f => (FIGS_V7.indexOf(f)%2===0)?'i':'p';
  // Réutilise concordanceElement (corrigé 13/07/26, roue classique à 4
  // paliers) au lieu d'une copie locale de l'ancienne échelle à 2 paliers.
  const compatEl = concordanceElement;
  const els = (typeof ELEMENTS_V7!=='undefined') ? ELEMENTS_V7 : ELEMENTS;
  function sieges(fig){
    const P=[];
    for(let p=1;p<=16;p++){
      if(theme[p]===fig) P.push({p, coloc: combine(theme[p], FIGS_V7[p-1])});
      if(combine(theme[p], FIGS_V7[p-1])===fig) P.push({p, coloc: theme[p]});
    }
    return P;
  }
  function sante(campPos){
    const bin = BINOMES_V7[theme[campPos]];
    let score=0; const det=[];
    sieges(bin).forEach(({p,coloc})=>{
      let pts = 1 + (cycleOf(coloc)===cycleOf(bin)?1:0) + compatEl(els[bin], MAISON_ELEM_V7[p]);
      score+=pts; det.push('M'+p);
    });
    const agresseur = ANTAGONISTES_V7[bin];
    const nbAgr = sieges(agresseur).length;
    if(nbAgr>0){
      const contre = ANTAGONISTES_V7[agresseur];
      const contreVivant = sieges(contre).length>0 && sieges(BINOMES_V7[contre]).length>0;
      if(!contreVivant){ score-=nbAgr; det.push('agressé x'+nbAgr+' sans contre vivant'); }
      else det.push('agression neutralisée par '+FL[contre]);
    }
    return {bin, score: Math.round(score*10)/10, det};
  }
  const s1 = sante(1), s7 = sante(7);
  const gap = Math.abs(s1.score - s7.score);
  let winner = null;
  if(gap >= 1) winner = s1.score > s7.score ? 'M1' : 'M7';
  return {winner, s1, s7,
    reason: 'Duel des binômes : '+FL[s1.bin]+' (M1) santé '+s1.score+' ['+s1.det.join(', ')+'] vs '+FL[s7.bin]+' (M7) santé '+s7.score+' ['+s7.det.join(', ')+']'+(winner?' → '+winner:' → écart < 1, muet')};
}

function verdictElementaire(theme){
  // ═══ SUBSTITUTION POPULUS (08/07/26) ═══
  // combine(populus, X) = X toujours (Populus est l'élément neutre de
  // combine()) : la "résultante" de Populus dans une maison est TOUJOURS
  // la figure de repos de cette maison (Puer en M1, Rubeus en M7). Doctrine :
  // Populus n'a pas de personnalité de combat propre, il reflète la maison
  // qu'il occupe — donc pour l'analyse de guerre civile / rôle élémentaire,
  // on le traite comme cette figure de repos plutôt que comme lui-même.
  // Validé sur l'archive (08/07/26) : verdictElementaire passe de 15/25 à
  // 17/25 (60%→68%), les 2 seuls changements sont les 2 cas Populus connus
  // (Liverpool/Lombardia, Fenerbahçe/Napoli), tous deux corrigés, zéro
  // régression sur les 23 autres thèmes. N'affecte QUE cette fonction (copie
  // locale de theme) — themeDetruit, l'affichage, et le reste du pipeline
  // continuent de voir le Populus réellement tiré.
  theme = Object.assign({}, theme);
  if (theme[1] === 'populus') theme[1] = FIGS_V7[0]; // Puer
  if (theme[7] === 'populus') theme[7] = FIGS_V7[6]; // Rubeus
  const figM1 = theme[1], figM7 = theme[7];
  // ═══ ÉTAPE 4 RÉVISÉE (04/07/26) — GUERRE CIVILE UNIFIÉE ═══
  // « Le vainqueur est toujours celui qui possède l'antagoniste qui
  // attaque l'autre camp. » Doctrine des ATTAQUES EFFECTIVES :
  //  • chef CHEZ LUI (repos absolu, voilé par Populus) → immune, il domine
  //  • attaquant AFFAMÉ (binôme absent) → frappes nulles — SAUF faim
  //    triviale (binôme = Populus, cas de Puella, symétrique de Caput)
  //  • attaquant logé dans la CHAMBRE même du chef → frappe aggravée (×3)
  // Le camp le MOINS effectivement attaqué gagne. Égalité → ÉTAT DES
  // CHEFS (chez-lui = rang suprême > forte-libre > entravé; cas triviaux
  // Populus neutralisés) → PREMIER DE BOUCLE (l'amont, nourri par la
  // solidité de tout l'aval : « la solidité de l'autre le rend solide »).
  // Validé 8/8 rétrospectif sur toutes les guerres civiles (FIFA 4-3,
  // M2, M14, 2-4, 1écart, 3-1, 4-2, FMCaput). Assemblée rétrospectivement.
  // ÉCART NON RÉSOLU (revue du verdict élémentaire) : ce bloc "guerre
  // civile" (M1/M7 dans le même cycle binôme) est prioritaire et court-
  // circuite TOUJOURS la doctrine "ARMEMENT DU CHAOS" (armementChaos,
  // validée 5/5 puis 4/5) plus bas dans cette fonction — même quand M1 ou
  // M7 a le rôle élémentaire Chaotique. Les deux règles ont été validées
  // séparément, sur des échantillons qui ne se recoupent apparemment pas,
  // et aucun commentaire ne dit laquelle devrait l'emporter en cas de
  // recouvrement. Mesuré sur 50 000 thèmes aléatoires : 44% déclenchent
  // "guerre civile", et parmi eux 39% ont aussi un camp Chaotique — soit
  // ~17% de TOUS les thèmes où la doctrine du chaos armé est simplement
  // ignorée sans que ce soit documenté ni testé. Pas corrigé ici faute de
  // données pour trancher lequel doit primer — à trancher sur l'archive.
  const gcU = detecteurGuerreCivile(theme);
  if(gcU.applicable){
    // Distingue "antagoniste absent du theme" (aucune information, pas un 0
    // favorable) de "antagoniste present mais affame" (0 legitime, menace
    // reellement neutralisee). Avant (08/07/26) : les deux etaient confondus
    // en un meme 0, ce qui faisait gagner a tort un camp juste parce que la
    // figure qui aurait pu l'attaquer n'apparait nulle part dans le thème —
    // ex. Liverpool vs Lombardia (predit M7 pour "0 attaque subie", reel M1
    // 7-3 : l'antagoniste de Populus etait simplement absent, pas neutralise).
    // FORCE DU BOUCLIER (12/07/26, doctrine utilisateur, v2) : remplace la
    // v1 (concordance stricte "chez son binôme", 12/07/26 plus tôt) —
    // testée sur un 2e cas réel (Galatasaray vs Bayer 04), elle échouait
    // car aucun des deux boucliers n'y satisfaisait cette concordance
    // stricte alors qu'un des deux devait quand même neutraliser l'attaque.
    // Le vrai critère : ce n'est pas la concordance de position qui
    // compte, c'est la FORCE BRUTE du bouclier — présence en BASE (poids
    // 1) pèse plus qu'une présence en seule résultante (poids 0,5), qui
    // pèse elle-même plus qu'une absence totale (0). Le camp dont le
    // bouclier est comparativement le plus fort (face au bouclier de
    // l'AUTRE camp, pas dans l'absolu) voit son attaque neutralisée.
    // Validé sur 2 cas réels : Anderlecht vs Roma (bouclier M1=0,5
    // résultante seule > bouclier M7=0 absent → M1 protégé, réel M1 8-7)
    // et Galatasaray vs Bayer 04 (bouclier M1=0,5 résultante seule <
    // bouclier M7=1,5 base+résultante → M7 protégé, réel M7 8-6). La v1
    // (concordance stricte) échouait sur ce 2e cas : aucun bouclier n'y
    // était "concordant", donc rien n'était neutralisé, et attEff brut
    // donnait M1 (faux). STATUT : validée sur 2 cas — à confirmer sur
    // davantage de données avant de la considérer pleinement établie.
    const forceBouclier = agresseur => {
      if (agresseur === 'populus') return 0;
      const bouclier = ANTAGONISTES_V7[agresseur];
      let score = 0;
      positionsBaseEtResultantes(bouclier, theme).forEach(s => {
        score += s.indexOf('r') === -1 ? 1 : 0.5;
      });
      return score;
    };
    const aM1 = ANTAGONISTES_V7[figM1], aM7 = ANTAGONISTES_V7[figM7];
    const fbM1 = forceBouclier(aM1), fbM7 = forceBouclier(aM7);
    const attEff = cp => {
      const chef = theme[cp];
      if(FIGS_V7[cp-1]===chef) return 0; // chez lui, voilé — immune (vrai 0)
      const a = ANTAGONISTES_V7[chef];
      // CORRECTION (revue du verdict élémentaire) : a==='populus' est un
      // non-danger STRUCTUREL (cas trivial de Caput Draconis, toujours
      // vrai — cf. le même principe déjà appliqué dans etatC ci-dessous)
      // même si Populus n'apparaît nulle part dans le thème. Avant cette
      // correction, ce cas retournait null ("antagoniste absent, aucune
      // information") exactement comme un vrai antagoniste non tiré,
      // alors que etatC traite déjà ce même cas comme sûr (antTrivial) —
      // les deux fonctions donnaient des réponses différentes pour le
      // même état réel, forçant à tort l'abandon de la comparaison la
      // plus fiable (attaques effectives) au profit du repli plus faible
      // (état des chefs, voire premier de boucle).
      if(a==='populus') return 0;
      const sieges = positionsBaseEtResultantes(a, theme).map(x=>parseInt(x.replace('M','').replace('r','')));
      if(!sieges.length) return null; // antagoniste ABSENT : aucune information, pas un 0
      if(BINOMES_V7[a]!=='populus' && positionsBaseEtResultantes(BINOMES_V7[a], theme).length===0) return 0; // affamé (faim réelle) : vrai 0
      const monBouclier = cp===1 ? fbM1 : fbM7, autreBouclier = cp===1 ? fbM7 : fbM1;
      if(monBouclier > autreBouclier) return 0; // bouclier comparativement plus fort : vrai 0
      let n=0; sieges.forEach(p=>{ n += (p===cp?3:1); });
      return n;
    };
    // Meme correction que attEff (08/07/26) : ANTAGONISTES_V7[f]==='populus'
    // est un non-danger STRUCTUREL (Caput Draconis, cas trivial, toujours
    // vrai) — legitime. Mais un antagoniste simplement ABSENT du thème
    // (pas populus, juste non tire) n'est PAS la meme chose : aucune
    // information, pas une liberte confirmee. Avant : les deux donnaient
    // attaque=false, gonflant a tort l'etat en FORTE-LIBRE/affame-libre
    // (ex. Arsenal vs PSV : M7 devenait FORTE-LIBRE par absence, pas par
    // liberte reelle, predisant M7 alors que le reel etait Nul 3-3).
    const etatC = cp => {
      const f = theme[cp];
      if(FIGS_V7[cp-1]===f) return {rang:4, absent:false}; // chez lui : rang suprême
      const nourri = BINOMES_V7[f]==='populus' ? true : positionsBaseEtResultantes(BINOMES_V7[f], theme).length>0;
      const antFig = ANTAGONISTES_V7[f];
      const antTrivial = antFig==='populus';
      const antAbsent = !antTrivial && positionsBaseEtResultantes(antFig, theme).length===0;
      // CORRECTION (revue des attaques effectives) : attEff() ci-dessus
      // traite déjà un antagoniste présent mais AFFAMÉ (son propre binôme
      // absent) comme une menace nulle (return 0, "affamé, faim réelle").
      // etatC() ignorait ce cas et le comptait comme une vraie attaque dès
      // que l'antagoniste était simplement présent — les deux fonctions
      // donnaient donc des réponses opposées pour le même antagoniste
      // affamé (attEff: sûr / etatC: attaqué), rétrogradant à tort le
      // rang (FORTE-LIBRE→entravé, voire affamé-libre→mort) dans le repli
      // "état des chefs". Vérifié sur 135 936 thèmes en guerre civile :
      // 21 711 (16%) présentaient ce désaccord précis.
      const antAffame = !antTrivial && !antAbsent && BINOMES_V7[antFig]!=='populus' && positionsBaseEtResultantes(BINOMES_V7[antFig], theme).length===0;
      // Même force de bouclier comparative qu'attEff ci-dessus (12/07/26) :
      // gardé cohérent entre les deux fonctions, comme pour antAffame.
      const monBouclierC = cp===1 ? fbM1 : fbM7, autreBouclierC = cp===1 ? fbM7 : fbM1;
      const antBouclier = !antTrivial && !antAbsent && !antAffame && monBouclierC > autreBouclierC;
      const attaque = (antTrivial || antAbsent || antAffame || antBouclier) ? false : true;
      const rang = nourri&&!attaque?3 : nourri?2 : !attaque?1 : 0;
      return {rang, absent: antAbsent};
    };
    const e1=attEff(1), e7=attEff(7);
    const els1 = (typeof ELEMENTS_V7!=='undefined') ? ELEMENTS_V7 : ELEMENTS;
    const mk = (w, why) => ({winner:w,
      roleM1: ELEMENT_ROLE_MATRIX_V7[els1[figM1]+'-'+MAISON_ELEM_V7[1]]||null,
      roleM7: ELEMENT_ROLE_MATRIX_V7[els1[figM7]+'-'+MAISON_ELEM_V7[7]]||null,
      reason:'⚔️ GUERRE CIVILE — '+why});
    // BRANCHEMENT TESTÉ ET RETIRÉ (10/07/26) : gcU.winner (trahison directe)
    // n'était jamais consulté ici (bug architectural réel, confirmé). Mais
    // en le branchant en priorité absolue, testé sur l'archive : veOk recule
    // de 61% à 57% (17/28 → 16/28) — la détection de trahison elle-même se
    // trompe sur les 2 seuls cas observables (Roma/Chelsea : prédit M1, réel
    // Nul ; PSV/Bayern : prédit M7, réel M1, alors que la hiérarchie des
    // rôles par défaut, elle, avait raison). Repassé en signal d'étude :
    // gcU reste calculé (gcU.reason disponible si besoin d'inspection), mais
    // ne tranche plus rien tant qu'il n'est pas validé indépendamment sur un
    // échantillon plus large.
    if(e1!==null && e7!==null && e1!==e7){
      const w = e1<e7?'M1':'M7';
      return mk(w, 'attaques effectives : M1 subit '+e1+' vs M7 subit '+e7+' → le moins attaqué ('+w+') gagne — il possède l antagoniste qui frappe l autre camp');
    }
    // BOUCLIER LIBRE (16/07/26, cas Liverpool vs Man City 9-10 réel, prédit
    // Nul à tort — M7=Via est le binôme direct de M1=Caput, ce qui rend la
    // chaîne de force ci-dessous structurellement toujours à égalité entre
    // les deux camps dans ce cas précis, un artefact de calcul et non un
    // vrai signal). Quand M1 et M7 sont tous deux à 0 attaque subie, la
    // RAISON de cette sécurité peut différer en qualité : un camp protégé
    // par un bouclier actif ET totalement libre (son propre antagoniste
    // absent du thème — rien ne le menace en retour, ex. Acquisitio en
    // M13+M4r contrôlant Laetitia sans qu Fortuna Major n existe dans le
    // thème) est dans une position plus forte qu'un camp protégé passivement
    // (antagoniste trivial/Populus, absent, ou affamé). Empêche la fausse
    // "impasse totale" de se déclarer dans ce cas. STATUT : 1 cas confirmé
    // (le fait qu il ne s agisse pas d un vrai nul), non contredit sur 6
    // autres matchs réels connus, zéro régression sur les 27 matchs archivés
    // — à confirmer sur davantage de données avant de le considérer établi.
    if (e1===0 && e7===0) {
      const sourceNeutralisation = cp => {
        const chef = theme[cp];
        if (FIGS_V7[cp-1] === chef) return {type:'chez-lui'};
        const a = ANTAGONISTES_V7[chef];
        if (a === 'populus') return {type:'trivial'};
        const siegesA = positionsBaseEtResultantes(a, theme);
        if (!siegesA.length) return {type:'absent'};
        const binA = BINOMES_V7[a];
        const affame = binA!=='populus' && positionsBaseEtResultantes(binA, theme).length===0;
        if (affame) return {type:'affame'};
        const monBouclier = cp===1 ? fbM1 : fbM7, autreBouclier = cp===1 ? fbM7 : fbM1;
        if (monBouclier > autreBouclier) {
          const bouclierFig = ANTAGONISTES_V7[a];
          const antBouclier = ANTAGONISTES_V7[bouclierFig];
          const libre = monBouclier > 0 && positionsBaseEtResultantes(antBouclier, theme).length === 0;
          return {type:'bouclier', libre};
        }
        return {type:'indetermine'};
      };
      const s1 = sourceNeutralisation(1), s7 = sourceNeutralisation(7);
      const actif = s => s.type==='bouclier' && s.libre;
      if (actif(s1) && !actif(s7)) return mk('M1', 'attaques effectives à égalité (0-0) mais qualité de neutralisation différente : M1 protégé par un bouclier actif et totalement libre, M7 protégé passivement ('+s7.type+') → M1 favorisé');
      if (actif(s7) && !actif(s1)) return mk('M7', 'attaques effectives à égalité (0-0) mais qualité de neutralisation différente : M7 protégé par un bouclier actif et totalement libre, M1 protégé passivement ('+s1.type+') → M7 favorisé');
    }
    const ec1=etatC(1), ec7=etatC(7);
    const g1=ec1.rang, g7=ec7.rang;
    if(!ec1.absent && !ec7.absent && g1!==g7){
      const w = g1>g7?'M1':'M7';
      const lbl = x => x===4?'CHEZ LUI (domine)':x===3?'FORTE-LIBRE':x===2?'entravé':x===1?'affamé-libre':'mort';
      const attLbl = (e1===null || e7===null) ? 'antagoniste absent d un côté, non tranchable' : 'attaques égales ('+e1+'-'+e7+')';
      return mk(w, attLbl+' → état des chefs : M1 '+lbl(g1)+' vs M7 '+lbl(g7)+' → '+w);
    }
    const cf1 = chaineDeForce(theme[1], theme, theme[7]), cf7 = chaineDeForce(theme[7], theme, theme[1]);
    if (cf1.total !== cf7.total) {
      const w = cf1.total > cf7.total ? 'M1' : 'M7';
      return mk(w, 'égalité complète → chaîne de force : M1 '+cf1.total+' ['+cf1.detail.join('+')+'] vs M7 '+cf7.total+' ['+cf7.detail.join('+')+'] → '+w);
    }
    // NUL PAR IMPASSE TOTALE (14/07/26, cas Olympiacos-West Ham 7-7 réel) :
    // remplace l'ancien tiebreak "PREMIER de la boucle" (aucune validation
    // citée, 0/27 déclenchements sur l'archive, et faux sur le seul cas réel
    // observé — prédisait M1 alors que le match était nul). Quand attaques
    // effectives ET chaîne de force sont toutes deux à égalité parfaite,
    // c'est une vraie impasse structurelle plutôt qu'un signal à départager
    // arbitrairement par l'ordre de parcours de la boucle.
    //
    // LIMITE CONNUE, NON RÉSOLUE (16/07/26, cas France vs Espagne 0-2 réel,
    // mères Fortuna Minor/Albus/Amissio/Via) : cette égalité 0-0 aux attaques
    // effectives peut être un artefact — les deux chefs partagent la même
    // boucle donc la chaîne de force est structurellement condamnée à
    // toujours être égale (cf commentaire chaineDeForce). Ici M1 (Fortuna
    // Minor) engendre par sa PROPRE résultante (M1r) la figure Tristitia, qui
    // est à la fois (a) le binôme de l'antagoniste de M1 (Amissio, qu'elle
    // nourrit) et (b) l'antagoniste du binôme de M1 (Conjunctio, qu'elle
    // attaque) — un auto-empoisonnement complet depuis la propre résultante
    // du chef. Le frein naturel de Tristitia est Via, binôme direct de M7 —
    // mais Via reste fidèle à M7 (loyauté divisée), donc NE neutralise PAS
    // Tristitia. Ce n'est pourtant pas un abandon : le maillon SUIVANT de la
    // même chaîne M7 (Caput→Via→Rubeus) est précisément l'antagoniste de
    // Carcer, le binôme/soutien de Tristitia — la chaîne de M7 délègue et
    // démantèle le poison de M1 un cran plus loin, sans que Via ait besoin
    // d'agir directement. Réel : M7 gagne nettement (0-2), pas un nul.
    // Signal "bouclier libre" (ajouté le 16/07 pour Liverpool-ManCity)
    // NE capture PAS ce cas (aucun des deux camps n'a de bouclier libre ici
    // au sens strict). Mécanisme compris et vérifié maison par maison, mais
    // PAS ENCORE généralisé en code — motif à 5 maillons (résultante propre
    // → binôme de l'antagoniste ET antagoniste du binôme → antagoniste de
    // CE binôme = binôme du binôme adverse), trop spécifique pour être
    // codé sans risquer de sur-ajuster sur un seul cas. À surveiller sur de
    // prochains matchs avant toute tentative de généralisation.
    return mk('Nul', 'IMPASSE TOTALE DE BOUCLE (attaques effectives et force de boucle toutes deux à égalité) → NUL');
  }
  const els = (typeof ELEMENTS_V7!=='undefined') ? ELEMENTS_V7 : ELEMENTS;
  const roleM1 = ELEMENT_ROLE_MATRIX_V7[els[figM1]+'-'+MAISON_ELEM_V7[1]]||null;
  const roleM7 = ELEMENT_ROLE_MATRIX_V7[els[figM7]+'-'+MAISON_ELEM_V7[7]]||null;
  // Raffinement doctrine du binôme : un camp Chaotique ARMÉ ne perd pas
  // par défaut — son chaos devient une arme (5/5 empirique, puis 4/5 après
  // Bayern Munich vs Chelsea le 10/07/26, réel Nul alors que M1 prédit).
  // PISTE NON VALIDÉE (n=1, à surveiller) : dans les 3 succès, l'adversaire
  // (M7) était soit "morte" soit "entravée" (à égalité). Dans l'échec,
  // M7 était "affamée-libre" (ni nourrie ni attaquée — antagoniste absent,
  // même famille de biais que ailleurs dans cette doctrine) — état
  // possiblement "sous le radar" plutôt que faible, qui pourrait neutraliser
  // le bonus armé en Nul plutôt qu'une victoire nette. Besoin d'un 2e cas
  // avant de coder quoi que ce soit.
  if (roleM1==='Chaotique' || roleM7==='Chaotique'){
    const p = roleM1==='Chaotique' ? 1 : 7;
    const other = p===1 ? 'M7' : 'M1';
    const self = p===1 ? 'M1' : 'M7';
    const arm = armementChaos(p, theme);
    if (arm.etat==='armé') return {winner:self, roleM1, roleM7,
      reason:self+' Chaotique ARMÉ ('+arm.detail+') → son chaos se déchaîne, '+self+' favorisé'};
    if (arm.etat==='désarmé' || arm.etat==='capturé') return {winner:other, roleM1, roleM7,
      reason:self+' Chaotique '+arm.etat+' ('+arm.detail+') → '+other+' favorisé'};
  }
  // GUERRE DES 16 (12/07/26) : quand M1/M7 sont en boucles opposées et
  // qu'aucun camp Chaotique n'a déjà tranché ci-dessus, le comptage
  // d'attaques effectives entre les deux boucles antagonistes prend le
  // relais avant le repli générique par hiérarchie élémentaire pure.
  const g16 = detecteurGuerreDes16(theme);
  if (g16.applicable && g16.winner) {
    return {winner: g16.winner, roleM1, roleM7, guerreDes16: g16, reason: g16.reason};
  }
  const r1 = ROLE_HIERARCHY.indexOf(roleM1), r7 = ROLE_HIERARCHY.indexOf(roleM7);
  const winner = r1 < r7 ? 'M1' : 'M7';
  return {winner, roleM1, roleM7, guerreDes16: g16.applicable ? g16 : undefined,
    reason: (g16.applicable ? g16.reason+' — ' : '') + roleM1+' (M1) vs '+roleM7+' (M7) → '+winner+' favorisé par la hiérarchie élémentaire'};
}

// ═══════════════════════════════════════════════════════════════
// DÉTECTION D'INCIDENT (penalty / carton) — signaux unifiés
// 1. Rôle Chaotique sur M1/M7/M13/M14/M15 (incident contre le porteur;
//    décisif si Juge). Validé : Populus-chaotique juge → rouge (0-1);
//    Puer-chaotique M7 → penalty contre M7 55e (2-1).
// 2. Antagoniste de M1 ou M7 présent en rôle Chaotique n'importe où
//    → incident contre le camp visé. Validé : Albus (antag. M1)
//    chaotique en M9 → rouge contre M1 à la 64e (USA-Bosnie 02/07/26).
// 3-4. Rubeus en M11, M12 ou M7, ou Fortuna Major en M12 (16/07/26,
//    doctrine révisée) — signal SEULEMENT si leur binôme (Fortuna Minor
//    pour Rubeus, Puella pour Fortuna Major) est présent dans le thème ET
//    en rupture directe avec sa propre maison (concordance 0, rôle
//    Chaotique ou Blocage — ex. Fortuna Minor en M15 = feu/eau =
//    Chaotique). Une fois la rupture confirmée, la NATURE suit la
//    position du déclencheur, pas la confrontation elle-même : M12 est
//    la surface de réparation → PENALTY ; M11 ou M7, hors surface →
//    CARTON ROUGE. (Le "Dissonant" envisagé un temps pour le penalty
//    était en fait inatteignable : Fortuna Minor est feu et Puella est
//    terre, aucune des deux ne peut former un Dissonant, air/eau
//    uniquement — remplacé par ce critère de position.) Caput Draconis
//    en M12 reste une règle séparée, non révisée (mesure moindre).
// 5. Puer en M6.
// 6. Figures très négatives simultanément en M6 ET M12 (maisons opposées) :
//    Rubeus, Cauda Draconis, Amissio, Carcer, Tristitia (+ Puer en M6,
//    FM/Caput en M12 déjà couverts par 4 et 5).
// 7. AJOUTÉ (revue des figures marquantes) : Rubeus (`instable` dans
//    BUTS_FIGURE) ou Fortuna Major, identifiés comme BUTEURS ACTIFS par
//    calculerButsCamp — pas seulement quand ils sont assis en M11/M12
//    (règles 3-4, positionnelles). Nécessite campA/campB en paramètres
//    optionnels ; ignoré si absents (rétrocompatible). Ne double-compte
//    pas avec 3/4 quand la figure est À LA FOIS en M11/M12 ET buteuse.
// ═══════════════════════════════════════════════════════════════
const FIGURES_TRES_NEGATIVES = ['rubeus','cauda_draconis','amissio','carcer','tristitia'];

// RUBEUS / FORTUNA MAJOR + BINÔME (16/07/26, doctrine utilisateur) —
// Rubeus en M11, M12 ou M7, ou Fortuna Major en M12, ne signale un
// danger QUE SI leur binôme (Fortuna Minor pour Rubeus, Puella pour
// Fortuna Major) est présent dans le thème ET en rupture directe avec
// sa propre maison (concordance 0, rôle Chaotique feu/eau OU Blocage
// air/terre — les deux comptent). Exemple de référence : Fortuna Minor
// (binôme de Rubeus) en M15 = feu/eau = Chaotique = rupture directe.
// La NATURE (rouge/penalty) suit ensuite la POSITION du déclencheur, pas
// la confrontation : M12 = surface de réparation → PENALTY ; M11 ou M7,
// hors surface → CARTON ROUGE.
function confrontationBinome(binome, theme){
  const els = (typeof ELEMENTS_V7!=='undefined') ? ELEMENTS_V7 : ELEMENTS;
  const sieges = positionsBaseEtResultantes(binome, theme).map(s => parseInt(s.replace('M','').replace('r','')));
  const resultats = sieges.map(h => ({maison:h, role: ELEMENT_ROLE_MATRIX_V7[els[binome]+'-'+MAISON_ELEM_V7[h]]}));
  const rupture = resultats.find(r => r.role==='Chaotique' || r.role==='Blocage');
  return {present: sieges.length>0, resultats, rupture: !!rupture, detail: rupture || null};
}

// ═══════════════════════════════════════════════════════════════
// LA FILIATION DE L'INCIDENT (27/08/26, doctrine Ellemine_D)
//
// « vérifie m5 et m6, ils donnent m11. les deux premiers sont toutes des
// figures négatives (chute, contrainte) donne recommencement,
// déclenchement. »
//
// VÉRIFIÉ : M5 ⊕ M6 = M11 sur 311 thèmes sur 311. C'est une loi du carré,
// pas une piste. Toute la filiation tient de même :
//     M1⊕M2=M9 · M3⊕M4=M10 · M5⊕M6=M11 · M7⊕M8=M12
//     M9⊕M10=M13 · M11⊕M12=M14 · M13⊕M14=M15 · M15⊕M1=M16
// Les six maisons qu'Ellemine_D désigne (M1, M6, M7, M8, M11, M12) ne
// sont donc pas une liste : ce sont deux générations. M5-M8 sont les
// parents, M11-M12 les enfants.
//
// ⚠️ ET C'EST LÀ QUE J'AI DÛ COMPLÉTER SA DOCTRINE, PAS LA COPIER.
// M5, M6, M7, M8, M11 et M12 appartiennent TOUTES à CAMP2. Une règle
// bâtie sur ces seules maisons ne pourrait accuser QUE l'équipe 2, sur
// 100 % des thèmes — l'attribution serait vide de sens. Le camp 1 a
// exactement la même structure, et elle est parfaitement symétrique :
//     camp 1 : M1⊕M2→M9   et M3⊕M4→M10   (toutes dans CAMP1)
//     camp 2 : M5⊕M6→M11  et M7⊕M8→M12   (toutes dans CAMP2)
// Les deux sont donc examinées. Mesuré sur 1772 thèmes :
//     camp 1 seul 19 % · camp 2 seul 19 % · les deux 7 % · aucun 55 %
// Signal attribuable dans 38 % des cas, et parfaitement équilibré entre
// les camps — ce qu'une lecture littérale des six maisons n'aurait
// jamais donné.
//
// À comparer avec la règle de présence en place (« cauda/tristitia/
// carcer/amissio en M6 ou M12 »), qui se déclenche sur 43 % des thèmes
// et n'attribue le camp que par la maison. La filiation est plus rare et
// mieux fondée.
var FIGURES_NEGATIVES_V7 = {
  cauda_draconis: 'chute', carcer: 'contrainte', tristitia: 'tristesse',
  amissio: 'perte', rubeus: 'violence', puer: 'impulsion'
};
// Les deux figures de Mars. Ellemine_D, 27/08 : « ce n'est pas parce
// qu'une figure n'est pas de Mars qu'elle ne peut provoquer un
// incident » — Mars n'est donc PAS une condition, seulement une
// aggravation.
var FIGURES_MARS_V7 = { rubeus: 1, puer: 1 };
var FILIATIONS_V7 = [
  { parents: [1, 2], enfant: 9,  camp: 'M1' },
  { parents: [3, 4], enfant: 10, camp: 'M1' },
  { parents: [5, 6], enfant: 11, camp: 'M7' },
  { parents: [7, 8], enfant: 12, camp: 'M7' }
];

function filiationIncidentV7(theme) {
  if (!theme || !theme[1]) return { applicable: false, lignes: [], camp: null };
  var lignes = FILIATIONS_V7.map(function (f) {
    var a = theme[f.parents[0]], b = theme[f.parents[1]], e = theme[f.enfant];
    var na = FIGURES_NEGATIVES_V7[a] || null, nb = FIGURES_NEGATIVES_V7[b] || null;
    return {
      parents: f.parents, enfant: f.enfant, camp: f.camp,
      figA: a, figB: b, figEnfant: e,
      negA: na, negB: nb, negEnfant: FIGURES_NEGATIVES_V7[e] || null,
      mars: !!(FIGURES_MARS_V7[a] || FIGURES_MARS_V7[b] || FIGURES_MARS_V7[e]),
      double: !!(na && nb),
      // Contrôle de la loi : si elle tombait en défaut on veut le savoir.
      loiTenue: (typeof combine === 'function') ? (combine(a, b) === e) : null
    };
  });
  var m1 = lignes.some(function (l) { return l.camp === 'M1' && l.double; });
  var m7 = lignes.some(function (l) { return l.camp === 'M7' && l.double; });
  var camp = (m1 && !m7) ? 'M1' : (m7 && !m1) ? 'M7' : null;
  var actives = lignes.filter(function (l) { return l.double; });
  return {
    applicable: true, lignes: lignes, campM1: m1, campM7: m7, camp: camp,
    mars: actives.some(function (l) { return l.mars; }),
    nb: actives.length,
    resume: !actives.length ? 'aucune filiation double-négative'
      : actives.map(function (l) {
          return 'M' + l.parents[0] + ' ' + (FL[l.figA] || l.figA) + ' (' + l.negA + ') + M'
            + l.parents[1] + ' ' + (FL[l.figB] || l.figB) + ' (' + l.negB + ') → M'
            + l.enfant + ' ' + (FL[l.figEnfant] || l.figEnfant);
        }).join(' · ')
        + (camp ? ' — incident porté par le camp ' + camp
                : ' — les deux camps, aucune attribution')
  };
}

// posA/posB (17/07/26, demande explicite utilisateur : "le verdict porte
// sur la rotation non pourquoi analyse m1 et m7 pour les deux marques")
// — check(1)/check(7) et leur bloc antagoniste (§2) comparaient TOUJOURS
// les maisons FIXES M1/M7, même quand la carte affichée (et le vainqueur
// retenu) venaient du mode ROTATION (R1/R7, des maisons différentes,
// ex. maison 5/11 sur LA Galaxy-Los Angeles FC) — incohérence entre le
// mode qui tranche le vainqueur et le mode qui explique l'incident.
// COMBINÉ (18/07/26, demande explicite utilisateur "combine les deux",
// après avoir mesuré qu'un remplacement pur et simple faisait perdre le
// signal validé en mode fixe sur LA Galaxy-Los Angeles FC) : ces deux
// checks tournent maintenant sur M1/M7 (fixe) ET posA/posB (les vraies
// maisons de la carte affichée, identiques à M1/M7 en mode fixe) —
// aucun signal n'est donc plus perdu, et le doublon (mode fixe = mode
// affiché) est naturellement absorbé par le dédoublonnage pos+label en
// fin de fonction. Le bloc Rubeus/Fortuna Major (§3-4, M11/M12/M7) et
// les témoins/Juge (§1, M13/M14/M15) restent volontairement sur leurs
// maisons fixes : ce sont des positions structurelles validées comme
// telles (16/07/26, "2/2 confirmé en réel" sur M11/M12/M7 précisément),
// pas des ancres d'équipe à faire suivre le mode.
function detectIncidentChaotique(theme, campA, campB, posA, posB){
  posA = posA || 1; posB = posB || 7;
  const els = (typeof ELEMENTS_V7!=='undefined') ? ELEMENTS_V7 : ELEMENTS;
  const antag = (typeof ANTAGONISTES_V7!=='undefined') ? ANTAGONISTES_V7 : ANTAGONISTES;
  const signals = [];
  const roleAt = pos => ELEMENT_ROLE_MATRIX_V7[els[theme[pos]]+'-'+MAISON_ELEM_V7[pos]];
  const ancresEquipe1 = posA === 1 ? [1] : [1, posA];
  const ancresEquipe2 = posB === 7 ? [7] : [7, posB];

  // 1. Chaotique sur positions clés (fixe M1/M7 + mode affiché posA/posB, combinés)
  const check = (pos, label, camp) => { if (roleAt(pos)==='Chaotique') signals.push({pos, fig:theme[pos], label, camp: camp || null}); };
  // Ces deux-là sont SYMÉTRIQUES par construction (ancre de chaque
  // équipe) : elles peuvent accuser l'un ou l'autre camp, donc elles
  // votent pour l'attribution.
  // ─── LE CSC N'EST PAS UN INCIDENT (28/08/26, doctrine d'Ellemine_D) ───
  // Ces libellés annonçaient « penalty, rouge, CSC ». Sur PuellaAlbus le
  // réel était un CSC et un carton jaune : compter le CSC comme un
  // incident aurait donné raison au détecteur sur un événement d'une
  // autre nature. Ellemine_D tranche : le CSC est séparé. Les libellés ne
  // le mentionnent plus, la famille « incident » ne note plus que le
  // penalty et le rouge, et le CSC est enregistré à part (realCsc).
  ancresEquipe1.forEach(pos => check(pos, 'incident probable CONTRE l équipe 1 (penalty ou rouge)', 'M1'));
  ancresEquipe2.forEach(pos => check(pos, 'incident probable CONTRE l équipe 2 (penalty ou rouge)', 'M7'));
  check(13, 'incident dans la phase de synthèse (témoin droit)');
  check(14, 'incident dans la phase de synthèse (témoin gauche)');
  check(15, 'JUGE Chaotique : issue du match par un incident décisif (penalty ou rouge)');

  // PLANÈTES D'INCIDENT EN M13 (04/08/26, 📚 étude, doctrine Ellemine_D) —
  // Rubeus/Carcer/Tristitia (Mars/Saturne, les figures les plus agressives
  // ou bloquantes de FIGURES_TRES_NEGATIVES) EN M13, ou leur BINÔME en M13
  // (Rubeus→Fortuna Minor, Carcer→Fortuna Major, Tristitia→Carcer),
  // signalent aussi un risque d'incident — pas seulement le rôle
  // élémentaire Chaotique déjà vérifié ci-dessus par check(13,...).
  // Distinct et complémentaire, pas un doublon. Non validé (aucune donnée
  // réelle disponible pour l'instant, realPenalty vide sur l'archive).
  const sigM13 = signalPlanetesIncidentM13(theme);
  if (sigM13.signal) {
    signals.push({ pos: 13, fig: theme[13], label: 'planète d\'incident (Mars/Saturne) en M13'
      + (sigM13.viaBinome ? ' via binôme de ' + FL[sigM13.figSource] : ' directement') });
  }

  // 2. Antagoniste de l'ancre équipe 1/équipe 2 (fixe + mode affiché, combinés) présent en rôle Chaotique n'importe où
  [[ancresEquipe1,'équipe 1'],[ancresEquipe2,'équipe 2']].forEach(([positions,label])=>{
    positions.forEach(p => {
      const ennemi = antag[theme[p]];
      for (let pos=1; pos<=16; pos++){
        if (theme[pos]===ennemi && roleAt(pos)==='Chaotique'){
          signals.push({pos, fig:ennemi, camp: (label === 'équipe 1' ? 'M1' : 'M7'),
            label:'antagoniste de '+label+' en chaos → incident CONTRE l '+label});
        }
      }
    });
  });

  // 3-4. Rubeus en M11, M12, M7 ou M8, ou Fortuna Major en M12 — voir
  // confrontationBinome() ci-dessus : le signal n'existe QUE SI le
  // binôme est présent ET en rupture directe avec sa propre maison ;
  // la nature (rouge/penalty) suit alors la position du déclencheur :
  // M12 (surface de réparation) → penalty, M11/M7/M8 → rouge. DIRECTION
  // (16/07/26, 2/2 confirmé en réel) : M7, M8, M11 et M12 appartiennent
  // tous au camp M7 (CAMP2=[5,6,7,8,11,12,14,15]) — l'incident se produit
  // dans le territoire de ce camp, donc c'est LUI qui concède (penalty/
  // rouge CONTRE M7). Confirmé sur le cas Puer/M7 (pénalty pour M1) et
  // sur ce thème-ci (Rubeus en M12, pénalty confirmé contre M7).
  // M8 AJOUTÉ (18/07/26, demande explicite utilisateur : "rubeus en
  // m11,7,8 pénalité") — même mécanisme que M11/M7, pas encore de cas
  // réel confirmé pour M8 spécifiquement (n=0), doctrine utilisateur
  // directe.
  [[11,'rubeus'],[12,'rubeus'],[7,'rubeus'],[8,'rubeus'],[12,'fortuna_major']].forEach(([pos,fig]) => {
    if (theme[pos] !== fig) return;
    const binome = BINOMES_V7[fig];
    const conf = confrontationBinome(binome, theme);
    if (!conf.present || !conf.rupture) return;
    const contre = CAMP1.includes(pos) ? 'CONTRE l\'équipe 1' : 'CONTRE l\'équipe 2';
    if (pos === 12) {
      signals.push({pos, fig, label: FL[fig]+' en M12 (surface de réparation), binôme '+FL[binome]+' en rupture directe en M'+conf.detail.maison+' ('+conf.detail.role+') : PENALTY probable '+contre});
    } else {
      signals.push({pos, fig, label: FL[fig]+' en M'+pos+', binôme '+FL[binome]+' en rupture directe en M'+conf.detail.maison+' ('+conf.detail.role+') : CARTON ROUGE probable '+contre});
    }
  });
  if (theme[12]==='caput_draconis') signals.push({pos:12, fig:'caput_draconis', label:'Caput Draconis en M12 : risque penalty/rouge (mesure moindre)'});

  // FIGURES PROVOQUANT LE PENALTY/CARTON EN M12 OU M6 (18/07/26, doctrine
  // utilisateur explicite : "cauda, tristitia, carcer, amissio en m12 ou
  // m6 font partie de ce qui provoque la pénalité") — contrairement à
  // Rubeus/Fortuna Major ci-dessus, pas de condition de rupture de binôme
  // exigée : la simple présence suffit selon la doctrine utilisateur.
  // Explique directement le carton rouge confirmé sur le thème
  // amissio/amissio/carcer/laetitia (Cauda Draconis en M12, sinon
  // inexpliqué par aucune autre règle de ce fichier).
  // LAETITIA FAIT L'INVERSE (même demande utilisateur, même message) :
  // "laetitia lui il évite la pénalité lorsqu'il est en m12 ou m6" — donc
  // volontairement ABSENTE de la liste ci-dessous (aucun signal ajouté
  // pour elle), sans pour autant annuler d'autres signaux indépendants
  // (ex. élémentaires) déjà détectés ailleurs dans le thème.
  // ─── FILTRE DE COHABITATION (27/08/26, doctrine Ellemine_D) ───
  // « Rubeus, son niveau d'élément actif est air, alors la maison 12 est
  // terre — air et terre s'étouffent ; de même feu/eau crée le chaos. »
  // La règle ne se déclenchait que sur la PRÉSENCE de la figure : mesuré,
  // elle parlait sur 43 % des thèmes, ce qui ne discrimine presque rien.
  // Elle exige désormais la DISCORDANCE ÉLÉMENTAIRE avec la maison
  // (concordance < 0,5) — la figure doit être mal logée pour nuire.
  // Mesuré : 43 % → 25 %.
  // Mars (Rubeus, Puer) n'est PAS une condition — Ellemine_D, 27/08 :
  // « ce n'est pas parce qu'une figure n'est pas de Mars qu'elle ne peut
  // provoquer un incident » — mais une AGGRAVATION, comptée à part.
  var FIGURES_PENALITE_M12_M6 = ['cauda_draconis','tristitia','carcer','amissio'];
  [12, 6].forEach(function(pos) {
    var f = theme[pos];
    if (FIGURES_PENALITE_M12_M6.indexOf(f) < 0) return;
    var conc = concordanceElement(ELEMENTS_V7[f], MAISON_ELEM_V7[pos]);
    if (conc >= 0.5) return;                       // bien logée : elle ne nuit pas
    var campSig = CAMP1.includes(pos) ? 'M1' : 'M7';
    var contre = campSig === 'M1' ? 'CONTRE l\'équipe 1' : 'CONTRE l\'équipe 2';
    var resultante = combine(f, FIGS_V7[pos - 1]);
    var aggrave = !!(FIGURES_MARS_V7[f] || FIGURES_MARS_V7[resultante]);
    // ⚠️ CETTE RÈGLE NE VOTE PAS POUR LE CAMP, ET C'EST DÉLIBÉRÉ.
    // M6 et M12 appartiennent toutes deux à CAMP2 : elle ne peut
    // structurellement accuser QUE l'équipe 2. La laisser voter faussait
    // l'attribution — mesuré avant ce correctif : M1 16 % contre M7 33 %,
    // alors que la filiation, elle, est équilibrée 19 %/19 %.
    // Le camp reste écrit dans le libellé (c'est bien la maison de
    // l'équipe 2 qui porte la figure), mais l'attribution finale se
    // décide sur les signaux symétriques seuls.
    signals.push({pos: pos, fig: f, camp: null,
      label: FL[f]+' en M'+pos+' : figure qui provoque le penalty/carton, '
        + 'DISCORDANTE avec sa maison ('+ELEMENTS_V7[f]+' en '+MAISON_ELEM_V7[pos]
        + ', concordance '+conc+') '+contre
        + (aggrave ? ' — AGGRAVÉ (Mars : '+FL[FIGURES_MARS_V7[f] ? f : resultante]+')' : '')});
  });

  // ─── LA FILIATION DE L'INCIDENT (27/08/26) ───
  // M5⊕M6→M11 et M7⊕M8→M12, plus leurs symétriques M1⊕M2→M9 et
  // M3⊕M4→M10 : deux parents négatifs engendrent le déclenchement.
  // Voir filiationIncidentV7 pour le détail et pour la raison qui oblige
  // à traiter les deux camps.
  try {
    var fil = filiationIncidentV7(theme);
    (fil.lignes || []).forEach(function (l) {
      if (!l.double) return;
      signals.push({pos: l.enfant, fig: l.figEnfant, camp: l.camp,
        label: 'filiation : M'+l.parents[0]+' '+FL[l.figA]+' ('+l.negA+') + M'
          + l.parents[1]+' '+FL[l.figB]+' ('+l.negB+') → M'+l.enfant+' '+FL[l.figEnfant]
          + ' — deux parents négatifs engendrent le déclenchement, '
          + (l.camp === 'M1' ? 'CONTRE l\'équipe 1' : 'CONTRE l\'équipe 2')
          + (l.mars ? ' — AGGRAVÉ (Mars)' : '')});
    });
  } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }

  // PUER + BINÔME (16/07/26, doctrine utilisateur, n=1 réel confirmé) —
  // Puer chaotique en M7 (feu/eau, toujours vrai dès que theme[7]='puer')
  // + son binôme (Caput Draconis) présent et SANS rupture directe (bien
  // placé, ex. Amplificateur) → PENALTY. Logique inverse de Rubeus/
  // Fortuna Major (où c'était la rupture qui déclenchait) : ici c'est
  // l'ABSENCE de rupture qui confirme le penalty. Cas de référence :
  // mères Caput Draconis/Via/Acquisitio/Fortuna Major — Puer en M7
  // chaotique, Caput Draconis (binôme) en M1 (Amplificateur) et M2r
  // (Amplificateur) → réel penalty pour M1. Positions M11/M12 de Puer
  // pas encore testées, à déterminer (comme Rubeus/Fortuna Major).
  if (theme[7]==='puer') {
    const binomePuer = BINOMES_V7['puer'];
    const confPuer = confrontationBinome(binomePuer, theme);
    if (confPuer.present && !confPuer.rupture) {
      signals.push({pos:7, fig:'puer', label:'Puer en M7 (chaotique), binôme '+FL[binomePuer]+' bien placé (sans rupture) : PENALTY probable CONTRE l\'équipe 2 (M7, CAMP2)'});
    }
  }

  // 5. Puer en M6
  if (theme[6]==='puer') signals.push({pos:6, fig:'puer', label:'Puer en M6 : impulsivité, risque penalty/rouge'});

  // Puer en M1 (18/07/26, demande explicite utilisateur : "puer en
  // m7,1" — confirmé par l'utilisateur comme "un feu agressif
  // chaotique" en accord avec l'explication élémentaire donnée) : même
  // traitement simple/inconditionnel que M6 (pas la condition binôme
  // du cas M7 ci-dessus, qui repose sur un mécanisme différent). n=0
  // réel confirmé pour M1 spécifiquement.
  if (theme[1]==='puer') signals.push({pos:1, fig:'puer', label:'Puer en M1 : impulsivité, risque penalty/rouge (doctrine utilisateur, 18/07/26)'});

  // 6. Figures très négatives simultanément en M6 ET M12 (maisons opposées)
  const negM6 = FIGURES_TRES_NEGATIVES.includes(theme[6]);
  const negM12 = FIGURES_TRES_NEGATIVES.includes(theme[12]);
  if (negM6 && negM12) signals.push({pos:0, fig:theme[6], label:'Figures très négatives en M6 ('+FL[theme[6]]+') ET M12 ('+FL[theme[12]]+') opposées : facteur d incident fort'});

  // 7. Rubeus / Fortuna Major buteurs actifs (hors M11/M12, déjà couverts par 3-4)
  [campA, campB].forEach(function(camp){
    if (!camp || !camp.contributions) return;
    camp.contributions.forEach(function(c){
      if (c.fig==='rubeus' && theme[11]!=='rubeus') {
        signals.push({pos:0, fig:'rubeus', label:'Rubeus buteur actif ('+c.contrib+' but(s) prévu(s)) : risque penalty/rouge même hors M11'});
      }
      if (c.fig==='fortuna_major' && theme[12]!=='fortuna_major') {
        signals.push({pos:0, fig:'fortuna_major', label:'Fortuna Major buteur actif ('+c.contrib+' but(s) prévu(s)) : risque penalty/rouge composite même hors M12'});
      }
    });
  });

  // Dédoublonnage simple (même pos + même label)
  const seen = new Set();
  const unique = signals.filter(s=>{const k=s.pos+'|'+s.label; if(seen.has(k)) return false; seen.add(k); return true;});

  // ─── QUI ENCAISSE (27/08/26) ───
  // Jusqu'ici le camp n'existait que noyé dans le texte d'un libellé
  // (« CONTRE l'équipe 2 »), illisible pour le code comme pour l'œil.
  // Il devient une donnée. Les signaux sans camp (témoins, Juge, buteurs
  // actifs) ne votent pas : ils disent qu'il y a un incident, pas contre
  // qui.
  var nM1 = unique.filter(function(x){ return x.camp === 'M1'; }).length;
  var nM7 = unique.filter(function(x){ return x.camp === 'M7'; }).length;
  var campIncident = nM1 > nM7 ? 'M1' : nM7 > nM1 ? 'M7' : null;

  return {hasSignal: unique.length>0, signals: unique,
    camp: campIncident, campM1: nM1, campM7: nM7,
    campResume: campIncident
      ? 'incident porté CONTRE ' + campIncident + ' (' + nM1 + ' signal(s) camp 1, ' + nM7 + ' camp 2)'
      : (nM1 || nM7 ? 'signaux équilibrés (' + nM1 + '/' + nM7 + ') — aucun camp désigné'
                    : 'aucun signal attribuable à un camp'),
    resume: unique.length ? unique.map(s=>(s.pos?'M'+s.pos+' ('+FL[s.fig]+') : ':'')+s.label).join(' | ') : 'Aucun signal d incident détecté (Chaotique, antagonistes, M11/M12/M6).'};
}

// ─── RÈGLE ELLEMINE (20/08/26) : NIVEAU D'INCIDENT (%) — penalty/rouge ───
// detectIncidentChaotique() renvoyait jusqu'ici un simple oui/non
// (hasSignal) + le compte brut de signaux (cartonsJaunes). Demande :
// transformer ça en un NIVEAU avec pourcentage, pour distinguer un
// risque faible d'un cas quasi INÉVITABLE.
//
// Méthode : chaque signal a un poids selon sa force doctrinale (motif
// reconnu dans son label). Un signal "décisif" (JUGE M15 chaotique) ou
// "confirmé" (mécanisme de rupture de binôme validé 2/2 en réel) pèse
// bien plus qu'un signal "doctrine non validée" (n=0, ex. planète
// d'incident M13). Somme plafonnée à 95% — jamais 100% affirmé, il
// reste toujours une incertitude irréductible (pas de garantie absolue
// en géomancie). >= 75% = "Très élevé", marqué inévitable=true.
// Un seul poids compté par signal (premier motif qui matche).
var INCIDENT_WEIGHTS_V7 = [
  {test: /JUGE Chaotique/,                          w: 35, type: 'decisif'},
  {test: /PENALTY probable/,                        w: 30, type: 'penalty'},
  {test: /CARTON ROUGE probable/,                   w: 30, type: 'rouge'},
  {test: /provoque le penalty\/carton/,              w: 25, type: 'penalty'},
  // ─── LA FILIATION (27/08/26) ───
  // Poids 20, entre « provoque le penalty » (25, présence + discordance,
  // 25 % des thèmes) et « incident probable CONTRE » (20). Justification
  // de fréquence : la filiation double-négative attribuable ne se
  // déclenche que sur 38 % des thèmes, répartis 19 % / 19 % entre les
  // camps — elle est plus rare que la règle de présence d'origine (43 %)
  // et son camp est structurel, donc fiable.
  // ⚠️ Ce 20 n'est PAS mesuré contre des résultats : aucune pénalité
  // réelle n'est encore consignée. C'est un rang de doctrine, à corriger
  // dès que le banc des incidents aura des cas.
  {test: /^filiation :/,                             w: 20, type: 'penalty'},
  {test: /incident probable CONTRE/,                 w: 20, type: 'generique'},
  {test: /Figures très négatives.*opposées/,         w: 15, type: 'generique'},
  {test: /antagoniste de .* en chaos/,               w: 15, type: 'generique'},
  {test: /incident dans la phase de synthèse/,       w: 15, type: 'generique'},
  {test: /impulsivité, risque penalty\/rouge/,       w: 10, type: 'generique'},
  {test: /mesure moindre/,                           w: 8,  type: 'penalty'},
  {test: /planète d'incident/,                       w: 8,  type: 'generique'},
  {test: /buteur actif.*risque penalty\/rouge/,      w: 8,  type: 'generique'}
];

function calculerNiveauIncidentV7(signals) {
  var totalW = 0, wPenalty = 0, wRouge = 0, matched = [];
  (signals || []).forEach(function(s) {
    for (var i = 0; i < INCIDENT_WEIGHTS_V7.length; i++) {
      if (INCIDENT_WEIGHTS_V7[i].test.test(s.label)) {
        var w = INCIDENT_WEIGHTS_V7[i].w, type = INCIDENT_WEIGHTS_V7[i].type;
        totalW += w;
        if (type === 'penalty') wPenalty += w;
        if (type === 'rouge') wRouge += w;
        if (type === 'decisif') { wPenalty += w; wRouge += w; } // JUGE M15 : incident décisif, indifférencié penalty/rouge
        matched.push({label: s.label, w: w, type: type});
        break;
      }
    }
  });

  var pct = Math.min(95, totalW);
  var niveau = pct === 0 ? 'Aucun' : pct < 25 ? 'Faible' : pct < 50 ? 'Modéré' : pct < 75 ? 'Élevé' : 'Très élevé';
  var inevitable = pct >= 75;

  var pctPenalty = Math.min(95, wPenalty);
  var pctRouge = Math.min(95, wRouge);
  var typeDominant = 'Indéterminé';
  if (pctPenalty > 0 || pctRouge > 0) {
    typeDominant = pctPenalty > pctRouge ? 'Penalty' : pctRouge > pctPenalty ? 'Carton rouge' : 'Penalty et carton rouge (mixte)';
  }

  return {pct: pct, niveau: niveau, inevitable: inevitable, pctPenalty: pctPenalty, pctRouge: pctRouge, typeDominant: typeDominant, matched: matched};
}


// ═══════════════════════════════════════════════════════════════
// CARTE DE VERDICT UNIFIÉE (08/07/26) — remplace l'affichage éclaté par
// UNE carte compacte par confrontation (M1/M7 et R1/R7), sur le même
// moteur de calcul déjà validé (verdictFinal, V7, methodePoints,
// detectIncidentChaotique). Rien n'est recalculé différemment ici,
// seule la présentation change.
// ═══════════════════════════════════════════════════════════════

// Règle Ellemine (08/07/26) : corners liés à la pression d'attaque
// (M5/M11 actives = non paralysées) ou au récit "match ouvert" du juge.
// Ouvert : max 4 corners en 1ère MT, min 3 en 2nde MT.
// Fermé : total du match plafonné à 3-4 corners.
function determinerMatchOuvertV7(theme) {
  var pm5 = paralysieV7(5, theme);
  var pm11 = paralysieV7(11, theme);
  var pressionAttaque = !pm5.paralysee && !pm11.paralysee;
  var jr = analyzeJugeRecit(theme);
  var recitOuvert = (jr.recit || '').toLowerCase().indexOf('ouvert') >= 0;
  return pressionAttaque || recitOuvert;
}

// ─── RÈGLE ELLEMINE (21/08/26) : CORNERS — élément R1/R7 + M10 ───
// Cas 1 : R1 ET R7 sont des figures Feu, ET M10 est Air ou Feu -> match
// à beaucoup de corners, au moins 10 dans le match.
// Cas 2 : R1 ET R7 sont des figures Terre, ET M10 est Terre (blocage)
// -> peu de corners, mais au moins 3 dans le match.
// 📚 doctrine nouvelle, non encore validée sur l'archive — prime sur le
// calcul par défaut quand elle s'applique (comme BTTS 100%/défavorisé).
// ─── RÉPARTITION PAR CAMP (28/08/26, demande d'Ellemine_D) ───
// « les corners il faut faire les deux côtés pour chaque équipe, comme
// ça on saura le dominant. »
// Le total ne disait pas qui pousse. La répartition se fait sur la
// DOMINATION du duel (domA/domB, le scoreNet), pas sur les buts : un
// corner naît de la pression, pas du but. Bornée à 25/75 — même un camp
// écrasé continue d'obtenir des corners, 0 n'a pas de sens sur un match.
// ⚠️ La borne 0,25 est un choix de bon sens, calibrée sur rien. Le banc
// note désormais le DOMINANT (une égalité de camp, comme le vainqueur)
// à côté du total (une distance) : le dominant est la vraie question,
// le total hérite du générateur de score et de ses défauts.
var CORNERS_PART_MIN_V7 = 0.25;

function estimerCornersV7(theme, goalA, goalB, figR1, figR7, domA, domB) {
  var ouvert = determinerMatchOuvertV7(theme);
  var ht1, ht2;
  if (ouvert) {
    ht1 = 4;
    ht2 = Math.max(3, 3 + Math.max(0, (goalA + goalB) - 2));
  } else {
    var total = (goalA + goalB) > 0 ? 4 : 3;
    ht1 = Math.ceil(total / 2);
    ht2 = Math.floor(total / 2);
  }

  var doctrine = null;
  if (figR1 && figR7) {
    var elemR1 = ELEMENTS_V7[figR1], elemR7 = ELEMENTS_V7[figR7], elemM10 = ELEMENTS_V7[theme[10]];
    if (elemR1 === 'feu' && elemR7 === 'feu' && (elemM10 === 'air' || elemM10 === 'feu')) {
      doctrine = 'beaucoup';
    } else if (elemR1 === 'terre' && elemR7 === 'terre' && elemM10 === 'terre') {
      doctrine = 'peu';
    }
  }

  var total = ht1 + ht2;
  if (doctrine === 'beaucoup' && total < 10) {
    var manque = 10 - total;
    ht1 += Math.floor(manque / 2); ht2 += Math.ceil(manque / 2); total = ht1 + ht2;
  } else if (doctrine === 'peu' && total < 3) {
    var manque2 = 3 - total;
    ht1 += Math.ceil(manque2 / 2); ht2 += Math.floor(manque2 / 2); total = ht1 + ht2;
  }

  // La part de chaque camp, sur la domination du duel.
  var dA = Number(domA || 0), dB = Number(domB || 0);
  var part = (dA + dB) > 0 ? dA / (dA + dB) : 0.5;
  part = Math.min(1 - CORNERS_PART_MIN_V7, Math.max(CORNERS_PART_MIN_V7, part));
  var cA = Math.round(total * part);
  var cB = total - cA;
  var dominant = cA > cB ? 'A' : cB > cA ? 'B' : null;

  return { ouvert: ouvert, ht1: ht1, ht2: ht2, total: total, doctrine: doctrine,
    campA: cA, campB: cB, dominant: dominant,
    partA: Math.round(part * 100),
    baseDomination: { a: dA, b: dB } };
}

// Règle Ellemine (08/07/26) : chaque signal distinct de
// detectIncidentChaotique = 1 carton jaune potentiel (même doctrine
// que Rouge/Pénalty, comptée au lieu d'être aplatie en oui/non).
function estimerCartonsJaunesV7(theme, campA, campB) {
  var inc = detectIncidentChaotique(theme, campA, campB);
  return { count: inc.signals.length, signals: inc.signals };
}

// ─── RÈGLE ELLEMINE (20/08/26, corrigée) : BTTS 100% — configurations M4/M10 ───
// Deux configurations doctrinales où "les deux équipes marquent" est
// considéré ACQUIS (100%), en surcouche du calcul BTTS par défaut
// (goalA>0 && goalB>0 dans buildVerdictCard). Quand l'une des deux
// s'applique, elle prime sur ce calcul par défaut.
//
// VETO 1 (correctif) : Cauda Draconis en M4 est explicitement
// DÉFAVORABLE aux deux marquent — pas seulement "la règle 100% ne
// s'applique pas" (déjà vrai puisque Cauda est fixe, donc exclue du
// CAS 1 qui exige mobile+ouverte), mais un signal négatif qui force
// BTTS=Non et prime MÊME sur le calcul par défaut (goalA>0&&goalB>0).
//
// VETO 2 (correctif) : les figures FIXE+FERMÉE (Caput Draconis,
// Tristitia, Conjonctio, Carcer, Amissio — intersection de
// MOBILITE_FIGURE='fixe' et OUVERTURE_FIGURE='fermee') sont
// structurellement difficiles à faire déclencher les deux marquent.
// Conséquence concrète : retirées de la liste des figures M10
// acceptées au CAS 2 (Caput Draconis et Conjonctio en faisaient partie
// à tort — elles sont toutes deux fixe+fermée).
//
// CAS 1 : M4 ET M10 sont toutes deux des figures mobiles ET ouvertes
// (isMobile + isOuverte, cf. MOBILITE_FIGURE/OUVERTURE_FIGURE), avec la
// présence de leur binôme respectif dans le thème (base ou résultante,
// trouverFigV7). La présence de ces binômes dans une maison de
// concordance (élément figure = élément maison ou allié, force >= 70,
// concordanceFigureMaisonV7) est une PRÉFÉRENCE qui renforce la
// confiance mais n'est pas bloquante — seule la présence du binôme
// conditionne l'activation de la règle.
//
// CAS 2 : Puer en M4 — son binôme fixe est justement Caput Draconis
// (BINOMES_V7.puer==='caput_draconis') — avec Caput Draconis "bien
// placé" dans le thème (présent + maison de concordance favorable,
// force >= 70, OU en repos). ET M10 logée par une figure parmi
// {Acquisitio, Via, Rubeus, Fortuna Minor} (Caput Draconis et
// Conjonctio exclues, voir VETO 2 ci-dessus) — MAIS toujours avec la
// présence du binôme de CETTE figure M10 comme confirmation
// obligatoire (sans elle, le cas ne s'applique pas).
var BTTS100_FIGS_M10_CAS2 = {acquisitio:1, via:1, rubeus:1, fortuna_minor:1};



function estBienPlaceV7(fig, theme) {
  var occ = trouverFigV7(fig, theme);
  return occ.some(function(o) {
    var c = concordanceFigureMaisonV7(fig, o.pos);
    return c.force >= 70 || (c.level && c.level.indexOf('repos') === 0);
  });
}

// ─── INTERRUPTEURS BTTS (25/08/26) ───
// BTTS_ROTATION_DECISIF : la lecture par l'ouverture des sièges R1/R7
// (lectureOuvertureButsV7, doctrine Ellemine_D) décide du BTTS. 4/5 sur
// les cas réels, 47% de « oui ».
// BTTS_DOCTRINE_M4M10_DECISIVE : remettre à true pour redonner la
// priorité aux règles M4/M10 (BTTS 100% et défavorisé). Mesurées 1/3 là
// où elles tirent sur les cas réels — laissées à false, mais toujours
// calculées et affichées.
// BTTS_CADRE : sur quels deux sièges la règle d'ouverture se lit.
// 'rotation' = les sièges R1/R7 · 'fixe' = les maisons M1/M7.
// ⚠️ LES DEUX SONT À ÉGALITÉ, 4/6 sur les cas réels, et ils divergent sur
// 40% des thèmes — le choix pèse donc lourd et n'est PAS tranché.
// Historique : le 25/08 la rotation menait 4/5 contre 3/5 et Ellemine_D a
// dit « oriente sur la rotation ». Le cas Lazio, premier test en aveugle
// depuis, a inversé le compte : la lecture FIXE y voit juste, la rotation
// non. Les deux lectures sont désormais calculées et affichées à chaque
// thème pour que les cas s'accumulent.
var BTTS_CADRE = 'rotation';
// ─── BTTS_CHAINE_DECISIF (26/08/26, après le cas Atalanta) ───
// Source prioritaire du BTTS : lectureDeuxMarquentV7, qui juge par la
// CHAÎNE du perdant plutôt que par l'ouverture des sièges.
// Mesuré sur les huit cas au BTTS connu :
//     chaîne 7/8 · rotation 6/8 · score brut 4/8 (= « toujours oui »)
// Sur les quatre cas à camp muet (Milan, Napoli, Fiorentina, Atalanta), nommer le BON muet :
//     chaîne 3/4 · rotation 1/4
// Le cas Atalanta tranche : les deux lectures disaient « un seul marque » en
// désignant des muets OPPOSÉS — chaîne R7, rotation R1. Réel 4-0 pour
// R1, donc R7 muet : la chaîne avait raison. La rotation avait été
// rendue décisive le 25/08 sur 4/5 contre 3/5 ; l'échantillon a doublé
// et l'ordre s'est inversé.
// La rotation reste calculée, affichée, et redevient décisive si on
// remet ce drapeau à false.
var BTTS_CHAINE_DECISIF = true;
// L'interrupteur de la maison cadente sur le BTTS (29/08/26). Mis à
// false, la chaîne du perdant reprend la tête et on retombe sur 17/25.
// Voir le bloc de mesure dans buildVerdictCard.
var BTTS_CADENT_V7 = true;
// Le départage de la zone muette par Puer en maison succédente
// (30/08/26, règle d'Ellemine_D). Mis à false, cette zone répond « non »
// par défaut comme avant et le BTTS retombe à 22/27.
var BTTS_PUER_SUCCEDENT_V7 = true;
var BTTS_ROTATION_DECISIF = true;
var BTTS_DOCTRINE_M4M10_DECISIVE = false;

function detecterBTTS100V7(theme) {
  var figM4 = theme[4], figM10 = theme[10];

  // -- VETO 1 : Cauda Draconis en M4 -> défavorable, prime sur tout --
  if (figM4 === 'cauda_draconis') {
    return {
      applique: false, defavorise: true, cas: 'veto_cauda',
      raison: 'M4 = Cauda Draconis -> DÉFAVORABLE aux deux marquent (règle Ellemine) ; BTTS forcé à Non, même si le calcul par défaut suggérait Oui'
    };
  }

  // -- CAS 1 --
  if (isMobile(figM4) && isOuverte(figM4) && isMobile(figM10) && isOuverte(figM10)) {
    var binM4 = BINOMES_V7[figM4], binM10 = BINOMES_V7[figM10];
    var occBinM4 = trouverFigV7(binM4, theme);
    var occBinM10 = trouverFigV7(binM10, theme);
    if (occBinM4.length > 0 && occBinM10.length > 0) {
      var concM4 = estBienPlaceV7(binM4, theme);
      var concM10 = estBienPlaceV7(binM10, theme);
      return {
        applique: true, cas: 1,
        raison: 'CAS 1 : M4(' + FL[figM4] + ') et M10(' + FL[figM10] + ') mobiles et ouvertes, binômes ' +
          FL[binM4] + '/' + FL[binM10] + ' présents' + ((concM4 && concM10) ? ' en maison de concordance (renforcé)' : ' (sans concordance de maison confirmée)') +
          ' -> BTTS 100%'
      };
    }
  }

  // -- CAS 2 --
  if (figM4 === 'puer') {
    var binPuer = BINOMES_V7.puer; // = caput_draconis
    if (estBienPlaceV7(binPuer, theme) && BTTS100_FIGS_M10_CAS2[figM10]) {
      var binM10c = BINOMES_V7[figM10];
      if (trouverFigV7(binM10c, theme).length > 0) {
        return {
          applique: true, cas: 2,
          raison: 'CAS 2 : Puer en M4, binôme Caput Draconis bien placé + M10(' + FL[figM10] + ') confirmée par la présence de son binôme ' + FL[binM10c] + ' -> BTTS 100%'
        };
      }
    }
  }

  return {applique: false, defavorise: false, cas: null, raison: null};
}

/**
 * Construit une carte de verdict pour une confrontation (posA vs posB).
 * winnerOverride : si fourni (ex. verdictFinal pour M1/M7), sert de
 * vainqueur officiel ; sinon le duel brut (posA/posB) tranche.
 */
function buildVerdictCard(posA, posB, labelA, labelB, theme, winnerOverride, domicileCode, isPriorityCard) {
  var campA = calculerButsCamp(theme[posA], theme);
  var campB = calculerButsCamp(theme[posB], theme);
  // VIA EN M4 -> CAMP A NE MARQUE PAS (18/07/26, demande explicite
  // utilisateur "intègre ça et le verdict doit le suivre") : M4 est la
  // maison "camp M1" désignée (voir butsGuerreDes16) ; posA porte
  // toujours ce camp par convention de buildVerdictCard (carte fixe OU
  // rotation, labelA='M1'/'R1' = team1 dans les deux cas). Via en M4
  // (force 60, rôle "Absorbeur") coïncide EXACTEMENT avec les 3 seuls
  // vrais matchs BTTS=false liés à M4 dans l'archive (Chelsea-Atlético
  // 0-5, France-Espagne 0-2, LA Galaxy 3-0) et n'apparaît dans AUCUN des
  // 5 BTTS=true — split parfait 3/3 vs 0/5, base rate 5,6% sur 3000
  // thèmes aléatoires (P≈1% sous hasard pur). n=9 seulement, à confirmer
  // sur de nouveaux vrais matchs — voir REPERES.md §5.
  // ═══ RÈGLE DÉBRANCHÉE LE 29/08/26 — RÉFUTÉE 0 SUR 5 ═══
  // Ellemine_D : « ancien moteur M1, jusqu'à présent il fait effet au
  // score ». Exact, et c'était le dernier endroit où une règle de
  // l'époque M1/M7 agissait encore sur le verdict de rotation : M4 est
  // une maison FIXE, mais campA est R1 dans la carte de rotation. Une
  // doctrine écrite pour les sièges fixes remettait donc les buts de R1
  // à zéro.
  //
  // SA JUSTIFICATION D'ORIGINE EST MORTE. Elle disait s'appuyer sur un
  // split parfait 3/3 contre 0/5 sur neuf matchs. Rejouée sur les
  // 30 cas d'aujourd'hui, les six thèmes qui portent Via en M4 donnent :
  //   Inter 3-2 · Atalanta 4-0 · PSG/Bayer 1-2 · City/Madrid 7-4 ·
  //   CaputPuella 2-2   (CaputAcq sans score exact)
  // R1 a marqué dans LES CINQ cas mesurables. La règle est donc juste
  // 0 fois sur 5 — elle affirmait que R1 resterait muet, y compris sur
  // le 7-4 de City/Madrid où R1 a mis SEPT buts.
  //
  // ⚠️ ET POURTANT LA RETIRER DÉGRADE LÉGÈREMENT LE SCORE, mesuré :
  //   avec la règle .... erreur totale 83 buts (3,77 par match)
  //   sans la règle .... erreur totale 87 buts (3,95 par match)
  // Quatre buts d'écart sur 22 matchs : du bruit. L'explication est que
  // le générateur de score SUR-PRÉDIT systématiquement, et que remettre
  // un camp à zéro compense par accident. Deux erreurs qui s'annulent ne
  // font pas une doctrine : la règle est débranchée, et le vrai problème
  // — un générateur qui n'a jamais trouvé un seul score exact sur 22 et
  // se trompe de 3,8 buts par match — reste entier.
  // Rebrancher : REGLE_VIA_M4_V7 = true.
  var viaEnM4 = REGLE_VIA_M4_V7 && theme[4] === 'via';
  if (viaEnM4) { campA.total = 0; }
  // AJOUTÉ (demande utilisateur, "avantage du terrain") — 📚 étude, jamais
  // validé sur un match réel : léger boost du VOLUME de buts du camp à
  // domicile (+15%), n'affecte QUE la magnitude du score affiché, jamais
  // le vainqueur (déjà fixé par winnerOverride/la doctrine avant ce point).
  // domicileCode : 'A' si labelA est à domicile, 'B' si labelB l'est, sinon
  // undefined/'none'.
  if (domicileCode === 'A') campA.total = Math.round(campA.total * 1.15);
  else if (domicileCode === 'B') campB.total = Math.round(campB.total * 1.15);
  var duel = duelV7(posA, posB, theme);
  var rawWinner = duel.winner === 'A' ? labelA : duel.winner === 'B' ? labelB : 'Nul';
  // source: 'doctrine' si CETTE carte est celle qui a réellement tranché
  // verdictFinal (isPriorityCard) ; 'aligne' si un winnerOverride est
  // fourni mais que ce n'est PAS cette carte qui a décidé (17/07/26,
  // "corrige la carte non-prioritaire" — avant, dans ce cas la carte
  // retombait sur son estimation brute indépendante, pouvant afficher un
  // vainqueur et un score en contradiction frontale avec le verdict
  // affiché juste à côté, ex. carte fixe M1 4-1 / carte rotation R7 4-5
  // sur le même thème) ; sinon repli silencieux vers le moteur V7 legacy
  // -> on le rend visible au lieu de le cacher.
  var source = !winnerOverride ? 'moteur_v7' : (isPriorityCard ? 'doctrine' : 'aligne');
  var winner = winnerOverride || rawWinner;
  // "LE VERDICT DOIT LE SUIVRE" (18/07/26, demande explicite utilisateur) :
  // avec campA.total forcé à 0 ci-dessus, un winner=labelA (ou 'Nul')
  // serait incohérent (vainqueur ou nul affiché avec une capacité de
  // marquage nulle) — corrigé vers labelB tant que campB peut
  // effectivement marquer.
  // CORRIGÉ (19/07/26, "vérifiez bien si le verdict final suis la
  // logique") : cette correction écrasait AUSSI winnerOverride quand il
  // était présent — donc le vainqueur AFFICHÉ pouvait contredire
  // verdictFinal lui-même dès que Via était en M4, même quand
  // verdictFinal avait tranché labelA via un mécanisme validé
  // (Confirmation résultante+binôme, Max des 4 forces, Ancrage...).
  // Détecté sur 32/2000 thèmes aléatoires (0 avant ce correctif serait
  // attendu). Restreint désormais au cas SANS winnerOverride (le duel
  // brut de cette seule carte, pas la doctrine) — ne touche plus jamais
  // un vainqueur déjà tranché par verdictFinal.
  if (viaEnM4 && !winnerOverride && winner !== labelB && campB.total > 0) { winner = labelB; }
  var scWinnerCode = winner === labelA ? 'A' : winner === labelB ? 'B' : 'Nul';
  var sc = buildScoreFromCamps(campA, campB, scWinnerCode, undefined, theme);
  var goalA = sc.goalA, goalB = sc.goalB;
  var scoreMain = goalA + '-' + goalB;
  // ACTIVATION (revue des figures marquantes) : `instable` (Rubeus) élargit
  // l'écart affiché entre score principal et score alternatif (±2 au lieu
  // de ±1) — jusqu'ici jamais lu, ce flag ne changeait rien à l'affichage.
  var ecartAlt = (campA.hasInstable || campB.hasInstable) ? 2 : 1;
  var scoreAlt = scWinnerCode === 'A' ? Math.max(0, goalA - ecartAlt) + '-' + goalB
    : scWinnerCode === 'B' ? goalA + '-' + Math.max(0, goalB - ecartAlt)
    : Math.max(0, goalA - ecartAlt) + '-' + Math.max(0, goalB - ecartAlt);

  var domA = Math.max(0, duel.a.scoreNet || 0), domB = Math.max(0, duel.b.scoreNet || 0);
  var domPct = (domA + domB) > 0 ? Math.round(100 * domA / (domA + domB)) : 50;

  // Calcul unique (avant : detectIncidentChaotique tournait deux fois de
  // suite sur le même thème via estimerCartonsJaunesV7 puis incidentDetect).
  var incidentDetect = detectIncidentChaotique(theme, campA, campB, posA, posB);
  var niveauIncident = calculerNiveauIncidentV7(incidentDetect.signals);
  // Le camp affiché passe par la cascade des naissances de Mars (28/08/26).
  var campIncidentAffiche = campIncidentAfficheV7(theme, incidentDetect);
  // CORRIGÉ (21/08/26) : la règle corners d'Ellemine porte sur R1/R7
  // (positions de rotation), pas sur posA/posB — qui valent parfois M1/M7
  // fixe selon l'appelant (ex. carte-verdict-m). On calcule R1/R7
  // indépendamment ici pour que la règle s'applique correctement dans
  // tous les cas, y compris les cartes M1/M7.
  var rotCorners = getRotationOrderFromRepos(theme[1]);
  // domA/domB appartiennent à posA/posB, c'est-à-dire à labelA/labelB de
  // CETTE carte : la répartition est donc cohérente avec ses étiquettes.
  var corners = estimerCornersV7(theme, goalA, goalB, theme[rotCorners[0]], theme[rotCorners[6]], domA, domB);
  // ─── RÈGLE ELLEMINE (25/08/26) : « oriente sur la rotation » ───
  // Le BTTS se lit désormais sur les SIÈGES R1/R7 de la rotation, par
  // l'ouverture : une figure ouverte ou active aux deux sièges = les deux
  // marquent. Mesuré sur les 5 cas réels : 4/5, et 47% de « oui ».
  //
  // Ce qui est remplacé, et pourquoi :
  //   · L'ancien calcul par défaut (goalA>0 && goalB>0) répondait « oui »
  //     sur 91% des thèmes. Ses 3/5 étaient exactement ceux d'un « oui »
  //     constant : il n'apportait aucune information.
  //   · La règle BTTS 100% (M4/M10) et son pendant « défavorisé » tirent
  //     sur 8,6% et 6,6% des thèmes. Sur les 5 cas réels elles tirent trois
  //     fois et n'ont raison qu'une seule (Roma 1-1) ; elles imposaient « oui »
  //     sur Milan 7-0 et Napoli 0-1. Gardées en surcouche, elles annulaient
  //     précisément les deux cas que la lecture par rotation redresse.
  //     Elles sont donc DÉBRANCHÉES du verdict et restent AFFICHÉES —
  //     même traitement que la Structure du Nul et l'Axe Succédent, à la
  //     demande d'Ellemine_D (« désactive leur effets sur le verdict »).
  //     Un seul interrupteur ci-dessous pour les rebrancher.
  //   · La règle « Via en M4 → camp A ne marque pas » agit plus haut sur
  //     campA.total et reste en place ; noter qu'elle est fausse sur le
  //     cas Inter (Via EST en M4, réel 3-2, les deux ont marqué).
  // ─── RÉVISION DU 26/08/26, APRÈS LE CAS Atalanta (4-0) ───
  // Troisième source ajoutée et rendue prioritaire : lectureDeuxMarquentV7,
  // qui juge par la CHAÎNE du perdant. Mesuré sur les huit cas au BTTS
  // connu (Juventus,Inter,Milan,Napoli,Roma,Lazio,Fiorentina,Atalanta) :
  //     chaîne 7/8 · rotation 6/8 · score brut 4/8 (= « toujours oui »)
  // Et surtout, sur les quatre cas où un camp est resté muet (Milan,Napoli,Fiorentina,Atalanta),
  // NOMMER LE BON MUET : chaîne 3/4, rotation 1/4.
  // Le cas Atalanta est ce qui tranche : les deux lectures disaient « un seul
  // marque » en désignant des muets OPPOSÉS — la chaîne disait R7, la
  // rotation disait R1. Réel 4-0 pour R1 : c'est bien R7 qui est resté
  // muet. La rotation avait été rendue décisive le 25/08 sur un 4/5
  // contre 3/5 ; l'échantillon a doublé et l'ordre s'est inversé.
  var bttsDoctrine = detecterBTTS100V7(theme);
  var bttsRotation = null;
  try { bttsRotation = lectureOuvertureButsV7(theme); } catch (e) { bttsRotation = null; }
  var bttsChaine = null;
  try { bttsChaine = lectureDeuxMarquentV7(theme); } catch (e) { bttsChaine = null; }
  // ═══════════════════════════════════════════════════════════════
  // LA MAISON CADENTE PREND LA TÊTE DU BTTS (29/08/26)
  //
  // Le BTTS était la famille sans règle : 17 justes sur 25 pour la chaîne
  // du perdant, contre 15 au témoin « toujours non ». Deux cas d'écart.
  //
  // J'ai passé 24 signaux géomantiques sur les 25 cas au BTTS connu. Un
  // seul sort du lot, et de très loin :
  //     R1 EN MAISON CADENTE ....... 20/25   p = 0,007
  //     le suivant (juge M15 bloquant) 16/25   p = 0,543
  // Quand R1 est en maison cadente, les deux équipes marquent 6 fois sur
  // 7 ; sinon, 4 fois sur 18.
  //
  // ⚠️ CE N'EST PAS UN ARTEFACT DE BUTS — contrôle refait le 30/08 PAR LE
  // FORMAT, ce qui est la bonne façon de le faire. Ma première version
  // filtrait « ≤ 5 buts » en appelant ça « sans les e-sport » : les
  // chiffres étaient justes mais l'étiquette était fausse, et elle
  // écartait aussi des matchs réels à gros score.
  //     tous les cas .................. cadent 7/8 · sinon 5/19 · p = 0,008
  //     FOOTBALL RÉEL seulement ....... cadent 4/5 · sinon 4/18 · p = 0,033
  //     réel, 0 à 3 buts .............. cadent 2/3 · sinon 1/11 · p = 0,093
  // Et en football réel l'écart de buts entre les deux groupes est
  // presque nul : 3,20 contre 2,78. Le soupçon d'artefact venait
  // entièrement des deux e-sport (8 et 13 buts) que ma première mesure
  // laissait entrer dans la moyenne. Enfin le témoin qui compte : en
  // réel, le NOMBRE DE BUTS prédit le BTTS moins bien que la maison
  // (4 buts ou plus → 5/9 ; moins de 4 → 3/14). La maison n'emprunte
  // donc pas son pouvoir au score.
  //
  // ⚠️ ET CE N'EST PAS NON PLUS UNE PÊCHE. Vingt-quatre signaux testés,
  // le meilleur à p = 0,007 : le seuil de Bonferroni serait 0,002, et
  // 0,007 ne l'atteint pas. Un signal choisi PARCE QU'il a bien noté ne
  // vaudrait donc rien ici. Mais celui-ci n'a pas été trouvé par cette
  // recherche : « R1 en maison cadente » est déjà la lecture la mieux
  // établie du fichier — 7 sur 7 pour le match serré, et la moitié du
  // croisement du nul (porte + cadent, 4 sur 4). Qu'elle ressorte ici
  // est une CONVERGENCE sur un signal qui avait déjà sa légitimité
  // ailleurs, pas un gagnant de loterie.
  //
  // LA LECTURE UNIFIÉE QUE ÇA DONNE. R1 en maison cadente veut dire :
  // match serré, les deux marquent, et si la porte du nul est ouverte en
  // plus, nul. Trois familles, un seul signe.
  //
  // ⚠️ CE QU'ELLE NE FAIT PAS : elle n'attrape que 6 des 10 BTTS réels.
  // Quand elle dit oui, crois-la (6/7) ; quand elle se tait, elle ne dit
  // pas grand-chose (4 BTTS sur 18 lui échappent). Comme tout le reste
  // du fichier : elle sert à oser, pas à se rassurer.
  //
  // BTTS_CADENT_V7 la débranche d'un caractère, et la chaîne du perdant
  // reprend aussitôt la tête. Elle reste calculée et affichée en
  // contre-lecture dans tous les cas.
  var bttsCadent = null;
  try {
    var _rotB = getRotationCombat(theme);
    if (_rotB && _rotB.hR1) bttsCadent = [3, 6, 9, 12].indexOf(_rotB.hR1) >= 0;
  } catch (e) { bttsCadent = null; }
  // ═══════════════════════════════════════════════════════════════
  // LE VERROU DE CONJUNCTIO (30/08/26) — méthode d'Ellemine_D
  //
  // Sa proposition : « Puer quand il est actif peut désigner les deux
  // marques, car Puer marque mais encaisse. Après Carcer, vérifie, et
  // Fortuna Minor, et les autres figures. »
  //
  // ☠️ SUR PUER, LA MESURE DIT NON. Dix-huit formes d'« actif » testées
  // (siège R1/R7, M1, M7, angulaire, succédente, cadente, présent, présent
  // 2 ou 3 fois, juge, mères, témoins, camp de R1, camp de R7, les deux
  // camps). Aucune ne tient : la meilleure est 17/25 à p = 0,194, et Puer
  // présent dans le thème donne 6 BTTS sur 15 — exactement le taux de
  // base. Deux formes pointent même à l'envers. La seule qui aille dans
  // son sens est « Puer en maison SUCCÉDENTE » (6/9 quand il parle contre
  // 6/18 sinon), à surveiller mais pas démontrée — et le 30/08 elle a vu
  // juste sur TristCaput là où la règle branchée s'est trompée.
  // Carcer : rien non plus (meilleur 17/25, p = 0,175 en angulaire).
  // Fortuna Minor : rien (meilleur 16/25, p = 0,397).
  //
  // ✔ MAIS SA MÉTHODE, ELLE, DONNE LE MEILLEUR RÉSULTAT DU FICHIER —
  // appliquée à une autre figure. Les seize figures passées sous cinq
  // définitions d'« actif », une seule sort :
  //     CONJUNCTIO ABSENT DU THÈME → les deux ne marquent PAS : 9 fois
  //     sur 9 (8 sur 8 à la découverte, +1 le 30/08). p = 0,008.
  // Et le sens colle exactement : Conjunctio, c'est la jonction,
  // la rencontre, l'échange. « Les deux marquent » EST un échange
  // mutuel. Son absence dit qu'il n'y a pas d'échange.
  //
  // CE QUI EMPORTE LA DÉCISION, ce n'est pas le p. C'est que le verrou
  // explique l'UNIQUE raté de la maison cadente : Bologna (0-1), seul cas
  // cadent sans BTTS — et Conjunctio y est absent. Et il ne coûte rien :
  // les 4 BTTS que la maison rate ont TOUS Conjunctio présent, donc le
  // verrou n'en bloque aucun.
  //
  // LA PARTITION EN TROIS ZONES, sur les 28 cas :
  //     Conjunctio ABSENT ............... NON, 9 sur 9
  //     cadent + Conjunctio présent ..... OUI, 7 sur 8   (premier raté le 30/08)
  //     Conjunctio présent, non cadent .. ZONE FAIBLE, 5 BTTS sur 12
  // Total 25/29, contre 22 pour la maison seule et 15 pour le témoin.
  //
  // ☠️ 30/08 : L'ÉTAGE FORT A RATÉ POUR LA PREMIÈRE FOIS. FortMajLaet —
  // R1 Tristitia en M12 (cadente), Conjunctio en M14 : l'étage dit OUI,
  // le match fait 2-0. Il était à 7/7 depuis sa découverte, il est à 7/8.
  // Le verrou de Conjunctio, lui, tient toujours à 9/9. Si l'étage du
  // milieu rate une deuxième fois, c'est lui qu'il faudra débrancher, pas
  // le verrou.
  //
  // ⚠️ 30/08 : LA ZONE MUETTE A COÛTÉ UN CAS. TristCaput (nul 1-1, donc
  // BTTS oui) y tombe et reçoit « non ». Or « Puer en maison succédente »,
  // la seule forme de la théorie d'Ellemine_D qui tenait, disait OUI :
  // Puer y est en M8. Elle fait 6/9 quand elle parle contre 6/18 quand
  // elle se tait. Toujours pas démontrée, mais c'est la deuxième fois
  // qu'elle voit ce que la règle branchée manque.
  //
  // ☠️ CE QUE ÇA NE VAUT PAS. J'ai lancé environ 96 tests pour trouver
  // ça. À ce compte-là, un p de 0,008 sort tout seul du hasard une fois
  // sur deux ou trois : le seuil honnête serait 0,0005, et on en est
  // loin. Ce qui tient ce verrou, c'est le sens de la figure et le fait
  // qu'il explique le seul raté de l'autre règle — pas sa statistique.
  // Le premier match où Conjunctio est absent ET les deux marquent le
  // tue. Il est écrit ici pour être tué, si c'est ce qui doit arriver.
  var bttsConj = false;
  try { for (var _h = 1; _h <= 16; _h++) { if (theme[_h] === 'conjunctio') { bttsConj = true; break; } } }
  catch (e) { bttsConj = false; }
  // ═══════════════════════════════════════════════════════════════
  // PUER EN MAISON SUCCÉDENTE TRANCHE LA ZONE MUETTE (30/08/26)
  //
  // Ellemine_D : « Puer en M8 indique les deux marquent. »
  //
  // ☠️ M8 SEUL EST PLUS FAIBLE, PAS PLUS FORT. Resserrer la règle sur la
  // maison qui l'a suggérée diminue la preuve au lieu de l'augmenter :
  //     Puer en maison succédente (M2,5,8,11) .. 6/10
  //     Puer en M8 seulement ................... 3/5
  // Quatre cas au lieu de neuf : moins de matière, p plus haut. Et M5
  // donne exactement le même 3/4 que M8 — M8 n'a rien de singulier.
  //
  // ☠️ ET CE N'EST PAS LA MAISON QUI PARLE, C'EST LA FIGURE. Testé :
  // la nature de l'occupant de M8 ne dit rien du BTTS (attaquante 7/15,
  // bloquante 1/3, p = 1,000 dans les deux cas). M8 n'est pas « la maison
  // des deux buts » ; c'est Puer qui compte, et il compte partout dans
  // les succédentes.
  //
  // ✔ MAIS SA RÈGLE TROUVE SA PLACE, ET C'EST LA BONNE. Elle ne remplace
  // pas le croisement cadent+Conjunctio : elle tranche exactement la ZONE
  // MUETTE, là où ce croisement déclare ne pas savoir et répondait « non »
  // par défaut. Sur les 12 cas de cette zone :
  //     Puer en succédente ...... 4 BTTS sur 6
  //     sans .................... 1 BTTS sur 6
  // Le BTTS affiché passe de 22/28 à 25/28.
  //
  // ⚔️ 30/08, PREMIER DUEL — ET LE VERROU GAGNE. Sur CarcAmis (Carcer,
  // Carcer, Amissio, Via) les deux règles se contredisaient pour la
  // première fois : Conjunctio ABSENT (le verrou dit non), Puer en M8
  // succédente (la règle d'Ellemine_D dit oui). Le verrou avait la
  // priorité, et le match a fini 1-0 : un seul buteur. Le verrou passe
  // à 9/9, Puer succédent tombe à 6 BTTS sur 10 quand il parle contre
  // 6 sur 18 quand il se tait. L'ordre des étages est donc confirmé par
  // le premier cas qui pouvait le renverser.
  //
  // ⚠️ CE QUE ÇA VAUT. p = 0,242 sur la zone muette, 12 cas. C'est
  // nettement plus faible que les deux premiers étages (8/8 et 7/7). Ce
  // qui justifie de le brancher quand même : la règle existait AVANT
  // cette mesure — elle était déjà au banc depuis le 30/08 — donc elle
  // n'est pas un gagnant de recherche, et elle s'applique au résidu que
  // le fichier reconnaissait ne pas savoir lire. Les deux étages du bas
  // restent affichés comme faibles, avec leurs fractions.
  var bttsPuerSuc = false;
  try {
    for (var _hp = 0; _hp < 4; _hp++) {
      var _mh = [2, 5, 8, 11][_hp];
      if (theme[_mh] === 'puer') { bttsPuerSuc = true; break; }
    }
  } catch (e) { bttsPuerSuc = false; }
  var btts;
  if (BTTS_CADENT_V7 && bttsCadent !== null) {
    if (!bttsConj) btts = false;
    else if (bttsCadent) btts = true;
    else btts = (BTTS_PUER_SUCCEDENT_V7 ? bttsPuerSuc : false);
  }
  else if (BTTS_DOCTRINE_M4M10_DECISIVE && bttsDoctrine.applique) btts = true;
  else if (BTTS_DOCTRINE_M4M10_DECISIVE && bttsDoctrine.defavorise) btts = false;
  else if (BTTS_CHAINE_DECISIF && bttsChaine && bttsChaine.applicable) btts = bttsChaine.lesDeuxMarquent;
  else if (BTTS_ROTATION_DECISIF && bttsRotation && bttsRotation.applicable) btts = bttsRotation.lesDeuxMarquent;
  else btts = (goalA > 0 && goalB > 0);

  // ─── LE SCORE OBÉIT AU BTTS (28/08/26) ───
  // Constat sur le cas Bologna d'Ellemine_D : la carte annonçait « 2-4 »
  // ET « un seul marque ». Deux affirmations dans la même carte, dont
  // l'une nie l'autre.
  // Mesuré : le score et la lecture BTTS se contredisent sur 44 % des
  // thèmes (295 sur 676). C'est la même famille de défaut que le
  // vainqueur qui contredisait son score, corrigé le 26/08.
  // La lecture BTTS est la MEILLEURE pièce du système (chaîne du perdant,
  // 9/11 au banc) ; le générateur de score en est la plus faible (écart
  // de 2 dans 91 % des thèmes, 0 exact sur l'archive). Quand ils se
  // contredisent, c'est le score qui doit céder.
  // Effet secondaire recherché : forcer le perdant à 0 quand « un seul
  // marque » produit enfin des 1-0, 2-0, 3-0 — des scores que le
  // générateur ne savait pas atteindre.
  if (btts === false) {
    if (scWinnerCode === 'A' && goalB > 0) goalB = 0;
    else if (scWinnerCode === 'B' && goalA > 0) goalA = 0;
  } else if (btts === true) {
    if (goalA <= 0) goalA = 1;
    if (goalB <= 0) goalB = 1;
  }
  // ═══════════════════════════════════════════════════════════════
  // LE SCORE EST CALIBRÉ SUR LE RÉEL (29/08/26) — SCORE_CALIBRE_V7
  //
  // L'ancien générateur (buildScoreFromCamps, conservé ci-dessus pour
  // les diagnostics) était plus mauvais que n'importe quelle réponse
  // bête. Mesuré sur les 22 matchs au score exact de l'archive :
  //   générateur d'origine ...... 87 buts d'erreur ·  0 score exact
  //   « toujours 1-1 » .......... 60 buts d'erreur ·  1 score exact
  //   « toujours 0-0 » .......... 76 buts d'erreur
  //   « toujours 2-1 » .......... 62 buts d'erreur
  // Pire : la corrélation entre les buts qu'il annonce et les buts
  // réellement marqués vaut r = −0,34. ELLE EST NÉGATIVE — plus il
  // annonce de buts, moins il y en a. Il sur-prédit de 0,77 but par
  // match et sort sept fois « 0-4 » sur vingt-deux.
  //
  // CE QUI EST BRANCHÉ À LA PLACE : le score modal de l'archive,
  // orienté par le camp.
  //   camp désigné → 1-0 pour lui        nul → 1-1
  // C'est la lecture la plus fréquente du réel : sur 18 matchs décidés,
  // les buts du vainqueur ont pour médiane 2 et ceux du perdant 0, et
  // « un but à zéro » est le score modal (6 des 18). Résultat :
  //   60 buts d'erreur · 7 SCORES EXACTS sur 22 (contre 0)
  // Le plafond, si le camp était trouvé à tous les coups, serait de
  // 54 buts d'erreur et 7 exacts : on est à six buts du maximum
  // atteignable avec la qualité de camp actuelle.
  //
  // ⚠️ CE QUE J'AI REFUSÉ D'AJOUTER. Moduler avec le nombre de figures
  // actives (« ≥ 10 → 2-1 ») descend à 58 buts d'erreur — deux buts
  // gagnés sur vingt-deux matchs, avec un seuil ajusté sur ces
  // vingt-deux matchs. C'est du bruit habillé en règle. Refusé.
  // Le détecteur de match serré non plus : « cadent → 1-0, sinon 2-0 »
  // fait 63 et ne trouve que 3 scores exacts.
  //
  // ⚠️ ET CE QUE ÇA NE RÉSOUT PAS. Ce générateur ne PRÉDIT rien : il
  // répète le score le plus courant. Il n'annoncera jamais un 7-4 ni un
  // 4-4. Il est simplement honnête là où l'autre inventait. Le vrai
  // travail — trouver dans le thème ce qui porte le NOMBRE de buts —
  // reste entier : aucune grandeur mesurée à ce jour n'y corrèle
  // (ancrage r = 0,00 · figures actives r = 0,35 sur 22 cas).
  // ⚠️ PLACÉ ICI ET PAS PLUS HAUT, sur bogue constaté au navigateur : mis
  // avant la couche BTTS ci-dessus, le « 1-0 » se faisait remonter à
  // « 1-1 » par la ligne « if (btts === true) { if (goalB <= 0) goalB = 1; } »,
  // et l'écran affichait « VAINQUEUR Équipe 1 · Score prédit 1-1 » sur
  // quatre thèmes. La calibration doit avoir le DERNIER mot.
  // Tenir compte du BTTS a été mesuré et écarté : « BTTS oui → 2-1 »
  // descend à 58 buts d'erreur mais fait perdre un score exact (6 au lieu
  // de 7), et le moteur BTTS est sous son propre témoin.
  if (SCORE_CALIBRE_V7) {
    // ─── DEUX ÉCHELLES, UNE PAR FORMAT (29/08/26) ───
    // Le match FiFa 6-7 a mis à nu ce que l'archive disait depuis le
    // début sans qu'on l'écoute : l'arcade et le football réel n'ont pas
    // le même régime de buts.
    //   vrais matchs (19) ... 2,84 buts en moyenne
    //   e-sport      ( 4) ... 8,75 buts — TROIS FOIS PLUS
    // Le même générateur mesuré séparément sur chaque population :
    //   sur les vrais matchs   1-0 → 42 buts d'erreur, 7 exacts
    //                          2-1 → 50 buts, 2 exacts
    //   sur l'e-sport          1-0 → 30 buts, 0 exact
    //                          3-2 → 18 buts, 0 exact
    //                          4-3 → 14 buts, 1 exact
    // Une échelle par format donne 56 buts d'erreur et 8 scores exacts
    // sur les 23 matchs, contre 72 et 7 avec l'échelle unique.
    // Le format se règle à la main (sélecteur « Format du match ») :
    // personne ne peut le deviner depuis le thème.
    var _esport = false;
    try {
      var _fmt = { value: formatMatchV7() };
      _esport = !!(_fmt && _fmt.value === 'esport');
    } catch (e) { _esport = false; }
    // ═══════════════════════════════════════════════════════════
    // LE SCORE DOIT RESPECTER LE BTTS (30/08/26)
    //
    // ☠️ RÉGRESSION QUE J'AVAIS INTRODUITE MOI-MÊME. En déplaçant la
    // calibration APRÈS la couche BTTS — pour corriger un « VAINQUEUR
    // Équipe 1 · Score 1-1 » — je lui ai donné le dernier mot sur les
    // buts, et elle écrasait le BTTS. Résultat : la carte affichait
    // « Les deux marquent : Oui » AU-DESSUS d'un « Score prédit : 0-1 ».
    // Mesuré : 30 % des thèmes au hasard, et 16 des 40 cas d'archive.
    // J'avais réparé une contradiction en en fabriquant une autre.
    //
    // LE CHOIX DES CHIFFRES, SUR LES SCORES RÉELS DE L'ARCHIVE :
    //   réel · décidé · un seul marque .... 1-0 ×7, 2-0 ×2, 4-0 ×2 … (13)
    //   réel · décidé · les deux marquent . 3-2 ×3, 2-1 ×2, 6-1 ×1  ( 6)
    //   réel · nul · un seul marque ....... 0-0 ×3                  ( 3)
    //   réel · nul · les deux marquent .... 3-3 ×2, 1-1 ×1, 2-2 ×1  ( 4)
    // Quatre variantes essayées sur les 30 cas au score connu :
    //   aujourd'hui, BTTS ignoré ......... 10 exacts · 80 buts d'erreur
    //   2-1 · 1-1 (minimal) .............. 12 exacts · 69
    //   3-2 · 3-3 (modal) ................ 11 exacts · 71
    //   2-1 · 2-2 ........................ 12 exacts · 67
    // ⚠️ J'AI PRIS LA VARIANTE MINIMALE (2-1 · 1-1), PAS LA MEILLEURE.
    // 2-1 · 2-2 gagne de 2 buts d'erreur sur 30 cas — du bruit — et son
    // 2-2 est choisi sur quatre nuls. La variante minimale est le plus
    // petit score compatible avec « les deux ont marqué » : elle ne doit
    // rien à l'échantillon, et elle fait le même nombre d'exacts.
    // Le vrai gain est ailleurs : la contradiction disparaît.
    //
    // ⚠️ L'E-SPORT SANS BTTS N'EST PAS MESURÉ. Aucun cas e-sport de
    // l'archive n'a un seul buteur ; le 4-0 est posé par cohérence, pas
    // par mesure. Le premier match FiFa à un seul buteur le corrigera.
    var _deux = (btts === true);
    var _g, _p, _n;
    if (_esport) { _g = 4; _p = _deux ? 3 : 0; _n = _deux ? 4 : 0; }
    else { _g = _deux ? 2 : 1; _p = _deux ? 1 : 0; _n = _deux ? 1 : 0; }
    if (scWinnerCode === 'A') { goalA = _g; goalB = _p; }
    else if (scWinnerCode === 'B') { goalA = _p; goalB = _g; }
    else { goalA = _n; goalB = _n; }
    // ─── LA PISTE DE SATURNE, SUR LES BUTS (29/08/26) ───
    // Ellemine_D proposait Saturne comme ingrédient du NUL. Mesuré, ça ne
    // marche pas pour le nul (voir les deux moteurs Saturne du banc).
    // Mais son intuition — Saturne bloque — vise juste sur autre chose :
    // LE NOMBRE DE BUTS, exactement le domaine où rien ne fonctionnait.
    // Corrélation avec le total de buts, sur les 22 matchs au score exact :
    //   Saturne seul (Carcer, Tristitia) ................ r = −0,25
    //   + Populus et Cauda Draconis (blocage et fin) .... r = −0,45
    //   figures chaudes ................................. r = −0,11
    //   ancrage total des deux camps .................... r =  0,00
    // C'est de loin le signal le plus fort jamais trouvé pour les buts, et
    // il va dans le sens annoncé — plus de froid, moins de buts :
    //   0 à 3 froides (11 matchs) ... 4,45 buts   4 à 5 (9) ... 2,44
    //   6 et plus      ( 2 matchs) ... 2,50 buts
    //
    // ⚠️ DÉBRANCHÉ, POUR TROIS RAISONS TOUTES MESURÉES.
    // 1. C'est MOI qui ai élargi l'ensemble. Sa doctrine stricte donne
    //    r = −0,25, non significatif. L'essentiel du signal vient de
    //    POPULUS, qui est de la Lune et pas de Saturne.
    // 2. Testé contre les 1820 combinaisons de 4 figures parmi 16, mon
    //    ensemble arrive 26e. Les meilleurs de la machine (Rubeus +
    //    Fortuna Major + Populus…) n'ont aucun sens doctrinal : la
    //    recherche ajuste du bruit. Être dans les 1,4 % n'est pas
    //    être démontré.
    // 3. Le gain sur le score est mince : l'erreur passe de 60 à 56 buts,
    //    mais seuls QUATRE matchs sur 22 changent (Inter, FortMajVia et
    //    City/Madrid gagnent, ViaCaput perd) et le nombre de scores
    //    exacts ne bouge pas — 7 avant, 7 après.
    // BRANCHÉE LE 29/08/26 malgré ces trois réserves, sur décision
    // d'Ellemine_D : « branche-le, on verra avec les scores à venir ».
    // C'est sa doctrine, elle porte le signal le plus fort qu'on ait sur
    // les buts, et elle se juge d'elle-même au fil des résultats.
    // État mesuré à l'activation : 56 buts d'erreur et 7 scores exacts,
    // contre 60 et 7 sans elle. À surveiller sur les prochains scores —
    // si l'erreur remonte, SCORE_FROID_V7 = false la débranche.
    if (SCORE_FROID_V7 && scWinnerCode !== 'Nul') {
      var FROID_V7 = { carcer: 1, tristitia: 1, populus: 1, cauda_draconis: 1 };
      var nFroid = 0;
      for (var hf = 1; hf <= 16; hf++) { if (FROID_V7[theme[hf]]) nFroid++; }
      if (nFroid < 4) {
        if (scWinnerCode === 'A') { goalA = 2; goalB = 1; }
        else { goalA = 1; goalB = 2; }
      }
    }
  }
  scoreMain = goalA + '-' + goalB;
  scoreAlt = SCORE_CALIBRE_V7
    ? (scWinnerCode === 'A' ? (goalA + 1) + '-' + goalB
      : scWinnerCode === 'B' ? goalA + '-' + (goalB + 1)
      : Math.max(0, goalA - 1) + '-' + Math.max(0, goalB - 1))
    : (scWinnerCode === 'A' ? Math.max(btts === true ? 1 : 0, goalA - ecartAlt) + '-' + goalB
      : scWinnerCode === 'B' ? goalA + '-' + Math.max(btts === true ? 1 : 0, goalB - ecartAlt)
      : Math.max(0, goalA - ecartAlt) + '-' + Math.max(0, goalB - ecartAlt));

  // AJOUTÉ (demande utilisateur) : équipe à plus grande capacité de
  // marquage brute — campA.total/campB.total AVANT la correction de marge
  // finale (buildScoreFromCamps), donc potentiellement différent du
  // vainqueur doctrinal si la marge a dû être forcée.
  var capaciteA = campA.total, capaciteB = campB.total;
  var capaciteWinner = capaciteA > capaciteB ? 'A' : capaciteB > capaciteA ? 'B' : 'egal';

  // CORRIGÉ (17/07/26, demande utilisateur) : quand la doctrine
  // (winnerOverride, ex. l'ancrage) contredit le vainqueur brut du moteur
  // V7 (rawWinner), la domination% et la puissance de marquage affichées
  // continuaient de refléter le moteur brut qu'on vient pourtant de
  // contredire — contradiction visuelle directe (carte disant "Victoire
  // Équipe 1" avec "Puissance de marquage : Équipe 2" juste en dessous).
  // Dans ce cas, on recalcule ces deux stats à partir de la même chaîne
  // de dualité (forceMaisons, chaineDualite) que celle qui a réellement
  // tranché, pour que l'affichage reste cohérent avec la doctrine.
  if (winnerOverride && winnerOverride !== rawWinner && winnerOverride !== 'Nul') {
    var chA = chaineDualite(theme[posA], theme);
    var chB = chaineDualite(theme[posB], theme);
    if (chA.forceMaisons !== chB.forceMaisons) {
      domA = chA.forceMaisons; domB = chB.forceMaisons;
      domPct = Math.round(100 * domA / (domA + domB));
      capaciteA = domA; capaciteB = domB;
      capaciteWinner = domA > domB ? 'A' : 'B';
    }
  }
  // CORRIGÉ (17/07/26, demande utilisateur "enlève la partie fixe, laisse
  // la rotation") : recalculer domA/domB depuis LA CHAÎNE DE DUALITÉ DE
  // CETTE MÊME PAIRE (posA/posB) suppose que cette paire est bien celle
  // qui a tranché — faux quand le vainqueur vient en réalité de l'AUTRE
  // mode (ex. l'ancrage fixe M1/M7 décide, mais on affiche quand même la
  // carte R1/R7 alignée dessus : la chaîne de dualité de R1/R7 elle-même
  // peut très bien pointer dans le sens opposé, ce n'est pas elle qui a
  // décidé). Le recalcul ci-dessus peut donc, dans ce cas précis,
  // "corriger" vers des chiffres qui contredisent QUAND MÊME le vainqueur
  // affiché. On le détecte ici plutôt que de le cacher.
  //
  // ÉTENDU (17/07/26, trouvé en testant la règle "max des 4 forces") :
  // domA/domB et capaciteA/capaciteB sont DEUX calculs indépendants
  // (duel.scoreNet ou chaineDualite.forceMaisons pour l'un, calculerButsCamp
  // pour l'autre) — ils ne sont recalculés/harmonisés ENSEMBLE que dans le
  // bloc ci-dessus, qui ne se déclenche que si winnerOverride≠rawWinner.
  // Quand winnerOverride===rawWinner (le moteur brut de CETTE paire tombe
  // par coïncidence sur le bon vainqueur) mais que le mécanisme qui a
  // VRAIMENT décidé est ailleurs, capaciteA/B restent la capacité de but
  // brute (calculerButsCamp) et peuvent contredire le vainqueur alors même
  // que domA/domB, eux, sont d'accord — deux drapeaux de fiabilité
  // séparés, pas un seul, sinon l'un des deux peut rester silencieusement
  // faux (constaté : "Victoire Équipe B" + "Puissance de marquage :
  // Équipe A" alors que la barre de domination, elle, donnait bien B).
  var domFiable = scWinnerCode === 'Nul' || (scWinnerCode === 'A' ? domA >= domB : domB >= domA);
  var capaciteFiable = scWinnerCode === 'Nul' || capaciteWinner === 'egal' || capaciteWinner === scWinnerCode;

  return {
    labelA: labelA, labelB: labelB, winner: winner, corrected: sc.corrected, source: source,
    scoreMain: scoreMain, scoreAlt: scoreAlt,
    penaltyRouge: incidentDetect.hasSignal,
    // ─── LE CAMP QUI ENCAISSE, EN DONNÉE (27/08/26) ───
    // Avant, l'information n'existait que noyée dans le texte d'un
    // libellé. Elle remonte maintenant jusqu'à l'écran.
    incidentCamp: campIncidentAffiche.camp || null,
    incidentCampResume: campIncidentAffiche.resume || incidentDetect.campResume || null,
    incidentCampSource: campIncidentAffiche.source || null,
    incidentSignaux: incidentDetect.signals || [],
    cartonsJaunes: incidentDetect.signals.length,
    incidentPct: niveauIncident.pct,
    incidentNiveau: niveauIncident.niveau,
    incidentInevitable: niveauIncident.inevitable,
    incidentPctPenalty: niveauIncident.pctPenalty,
    incidentPctRouge: niveauIncident.pctRouge,
    incidentTypeDominant: niveauIncident.typeDominant,
    btts: btts,
    bttsForce: bttsDoctrine.applique,
    bttsDefavorise: bttsDoctrine.defavorise,
    bttsZone: (BTTS_CADENT_V7 && bttsCadent !== null)
      ? (!bttsConj ? 'Conjunctio absent du thème — pas d\'échange, 9 cas sur 10'
        : (bttsCadent ? 'R1 cadent + Conjunctio présent — 8 cas sur 9'
          : (BTTS_PUER_SUCCEDENT_V7
            ? (bttsPuerSuc
              ? 'zone faible : R1 pas cadent, mais Puer en maison succédente — 4 BTTS sur 6'
              : 'zone faible : ni cadent ni Puer succédent — 2 BTTS sur 7, donc non')
            : 'zone muette : Conjunctio est là mais R1 n\'est pas cadent — le fichier répond non par défaut')))
      : null,
    bttsSource: (BTTS_CADENT_V7 && bttsCadent !== null)
      ? 'maison de R1 + Conjunctio + Puer (26/32)'
      : ((BTTS_DOCTRINE_M4M10_DECISIVE && (bttsDoctrine.applique || bttsDoctrine.defavorise))
      ? 'doctrine M4/M10'
      : ((BTTS_CHAINE_DECISIF && bttsChaine && bttsChaine.applicable)
        ? 'chaîne du perdant'
        : ((BTTS_ROTATION_DECISIF && bttsRotation && bttsRotation.applicable)
          ? 'ouverture des sièges (rotation)'
          : 'score brut'))),
    // La chaîne du perdant reste affichée en contre-lecture : c'est elle
    // qui décidait jusqu'au 29/08, et savoir quand elle diverge servira
    // le jour où la maison ratera.
    bttsContreLecture: (bttsChaine && bttsChaine.applicable && bttsCadent !== null
      && bttsChaine.lesDeuxMarquent !== bttsCadent)
      ? ('la chaîne du perdant aurait dit ' + (bttsChaine.lesDeuxMarquent ? 'Oui' : 'Non')) : null,
    bttsRaison: bttsDoctrine.raison,
    corners: corners,
    cornersA: corners.campA, cornersB: corners.campB,
    cornersDominant: corners.dominant === 'A' ? labelA
      : corners.dominant === 'B' ? labelB : null,
    domPctA: domPct, domPctB: 100 - domPct,
    domA: domA, domB: domB,
    capaciteA: capaciteA, capaciteB: capaciteB, capaciteWinner: capaciteWinner,
    domFiable: domFiable, capaciteFiable: capaciteFiable,
    viaEnM4: viaEnM4
  };
}

// ─── RÈGLE ELLEMINE (20/08/26) : VERDICT RÉELLEMENT AFFICHÉ ───
// Rejoue EXACTEMENT le pipeline du panneau principal (celui que
// l'utilisateur regarde à l'écran) : nul structurel (Axe Succédent OU
// Structure du Nul) → sinon comparerBouclesAntagonistesR1R7 → sinon
// duel brut, via buildVerdictCard. Utilisé par addToHistory() et
// compareWithReality() pour que l'archive et l'auto-validation portent
// sur CE qui est affiché, pas sur le moteur V7 legacy (jamais montré à
// l'écran depuis le passage au protocole R1/R7 — bug d'archive corrigé
// ici, cf. audit "élagage" du 20/08/26).
// ═══════════════════════════════════════════════════════════════
// LA CHAÎNE DE PRIORITÉ DU VERDICT — UNE SEULE (29/08/26)
//
// ☠️ ELLE ÉTAIT ÉCRITE DEUX FOIS, ET LES DEUX N'ÉTAIENT PAS PAREILLES.
// getVerdictAfficheReel avait :
//     critAff || f4p4 || sièges || vote || chaîne || réseau || protocole
// renderTheme, c'est-à-dire L'ÉCRAN, avait :
//              f4p4 || sièges || vote || chaîne || réseau
// « La lecture des critères » — celle qu'Ellemine_D a demandé de brancher
// (« branche celle à 16/23 ») — n'a jamais atteint l'écran. Le protocole
// non plus. Résultat mesuré sur 537 thèmes : sur 122 d'entre eux, soit
// 23 %, le moteur nommait un camp et l'écran affichait l'autre, avec le
// score en miroir.
//
// Ce que ça abîmait : le banc, le journal, le comparateur et l'archive
// lisent tous getVerdictAfficheReel. Les 26/35 du verdict décrivaient
// donc une lecture que l'utilisateur ne voyait pas sur un thème sur
// quatre. C'est exactement le bug d'archive du 20/08/26, revenu par
// l'autre bout : à l'époque l'archive lisait un moteur mort, cette fois
// c'est l'écran qui avait pris du retard sur l'archive.
//
// La leçon est la même que pour nulActifV7 : deux copies d'une décision
// finissent toujours par diverger. Il n'y en a plus qu'une.
// ═══════════════════════════════════════════════════════════════
// LE REJET DES THÈMES NON VALIDES (30/08/26) — demande d'Ellemine_D
//
// « Si ce n'est pas valide, rejette-le, afin qu'on soit clean. »
//
// Le thème dont la validation n'atteint pas le seuil ne reçoit plus de
// verdict : la carte affiche un REFUS et dit ce qui manque. Le reste des
// panneaux (nul, BTTS, incident, axes) continue de s'afficher — ils ne
// dépendent pas de la validation.
//
// ☠️ CE QUE ÇA COÛTE, MESURÉ AVANT DE LE BRANCHER, sur les 39 cas au
// camp connu (justesse globale 27/39 = 69 %) :
//   seuil            gardés   justesse des GARDÉS   justesse des REJETÉS
//   aucun rejet      39/39          69 %                  —
//   niveau ≥ 1       33/39          67 %                 83 %
//   niveau ≥ 2       16/39          63 %                 74 %
//   niveau 3         13/39          69 %                 69 %
//   100 % (niv 3+fdj) 11/39         64 %                 71 %
// AUCUN SEUIL N'AMÉLIORE LA JUSTESSE DE CE QUI RESTE. Deux d'entre eux
// gardent franchement le moins bon paquet : à « niveau ≥ 2 » on garde du
// 63 % et on jette du 74 %. C'est cohérent avec ce que le fichier mesure
// depuis le 29/08 — un thème très validé n'est PAS un thème plus juste
// (1 axe de dérivé 83 %, 2 axes 86 %, 3 axes 59 %).
//
// ET IL FAUT BEAUCOUP TIRER. Sur 2 000 tirages au hasard : niveau ≥ 2
// dans 24 % des cas, niveau 3 dans 12,7 %, 100 % dans 11 %. Au seuil le
// plus strict, il faut écarter environ neuf thèmes sur dix.
//
// C'EST BRANCHÉ QUAND MÊME, parce que c'est sa demande et que le refus
// est honnête : mieux vaut ne rien dire que dire faux. Mais le fichier
// écrit ici que la mesure ne soutient pas ce filtre, et REJET_THEME_
// INVALIDE_V7 le débranche d'un caractère.
//
// ⚠️ CE CHIFFRE A ÉTÉ RETIRÉ DU BANDEAU À L'ÉCRAN (30/08, « si ce n'est
// pas valide on ignore »). Il y était répété sur chaque thème refusé :
// une objection dite une fois est utile, la même objection ressortie à
// chaque tirage est du bruit, et elle vidait le filtre de son sens en
// invitant à passer outre. Elle reste écrite ici, une fois, à sa place.
// Le bandeau ne dit plus que ce qui manque.
//
// ⚠️ LE SEUIL EST À 3, PAS À « 100 % ». Le 100 % inclut la figure du
// jour, qui dépend de la DATE : le même thème serait accepté aujourd'hui
// et refusé demain. Un filtre qui change d'avis tout seul n'est pas un
// filtre. La figure du jour reste affichée à titre indicatif.
//
// ⚠️ L'ARCHIVE, ELLE, GARDE TOUT. Si on retirait les thèmes non valides
// des cas de référence, on perdrait la seule chose qui permet de savoir
// si ce filtre sert à quelque chose. Le rejet porte sur le VERDICT
// AFFICHÉ, jamais sur la mesure.
//
// ═══════════════════════════════════════════════════════════════
// ☠️ LE FILTRE EST LEVÉ (04/09/26) — Ellemine_D : « oui »
//
// Il ne disparaît pas : il cesse de FAIRE TAIRE. Le niveau de validité,
// les axes, les binômes, la figure du jour, le panneau de validité et la
// porte de confiance restent calculés et affichés — mot pour mot comme
// avant. Ce qui change : un niveau bas INFORME au lieu de CENSURER.
//
// CE QUE LE FILTRE COÛTAIT. Sur 2000 tirages aléatoires il en rejetait
// 1836 — 91,8 %. Sur l'archive, 45 cas sur 56 — 80 %. Rejeté, l'écran
// remplaçait le nom du vainqueur par « ⛔ NON VALIDE » et supprimait les
// dix lignes du verdict. Neuf verdicts sur dix éteints.
//
// CE QU'IL RAPPORTAIT, RECALCULÉ AU BANC SUR 58 CAS (validiteParFamilleV7,
// cascade M4/M10 → V8 → carré) :
//     camp (vainqueur/nul) ..... 64 % (7/11) valides   contre  69 % (31/45) rejetés   p = 0,732
//     le nul (oui/non) ......... 73 % (8/11)           contre  87 % (39/45)           p = 0,358
//     les deux marquent ........ 50 % (4/8)            contre  71 % (27/38)           p = 0,407
//     score exact .............. 25 % (2/8)            contre  28 % (11/40)           p = 1,000
//     match serré (écart ≤ 1) .. 75 % (6/8)            contre  63 % (25/40)           p = 0,694
// QUATRE familles lisibles sur CINQ penchent du côté des thèmes REJETÉS.
// C'est la troisième mesure d'affilée — n = 35, n = 50, n = 58 — et la
// direction n'a jamais changé de sens.
//
// ET LE SEUIL N'A PAS DE BON RÉGLAGE. Justesse du camp par niveau :
//     0/3 ... 61,5 % (8/13)      2/3 ... 33,3 % (1/3)
//     1/3 ... 75,9 % (22/29)     3/3 ... 63,6 % (7/11)
// Par nombre d'axes de dérivé présents : 0 → 33 %, 1 → 70 %, 2 → 78 %,
// 3 → 56 %. Le sommet est au MILIEU dans les deux cas. Une porte monte ;
// elle ne fait pas une bosse. Descendre le seuil à 1 pour attraper le
// 75,9 % serait tailler une règle sur un creux à n = 3. Donc : pas de
// re-seuillage, et pas de rejet par famille (déjà écarté au banc).
//   Détail dans le même sens : les thèmes DÉTRUITS (Rubeus/Cauda en M1,
//   niveau forcé à 0) sont justes 3 fois sur 4 — au-dessus de la moyenne
//   générale de 67,9 %.
//
// L'EXEMPLE QUI A EMPORTÉ LA DÉCISION. Amissio / Rubeus / Conjunctio /
// Via — son match 5-2 pour R7. Le moteur V8 tranche R7 : JUSTE. L'écran
// affichait « ⛔ THÈME REJETÉ » parce que le niveau est 0/3. Le système
// avait raison et se taisait.
//
// ➜ OÙ LA VALIDITÉ RESTE DEBOUT : le DÉPARTAGE DE DEUX TIRAGES DU MÊME
// MATCH. « Entre deux thèmes du même match, lequel croire ? » n'est pas
// « un thème isolé est-il plus juste ? » — l'archive ne teste que la
// seconde question. Le registre PAIRES_V7 teste la première : 9 paires,
// 3 informatives, le critère « niveau » y est à 2 justes / 1 faux. C'est
// là que la validité continue de se jouer, et nulle part ailleurs.
//
// ⚠️ LE BANC, LUI, DOIT CONTINUER À MESURER LE CRITÈRE. C'est le piège de
// ce changement : validiteParFamilleV7 et le panneau de consensus se
// servaient de themeRejeteV7 pour séparer « valides » et « rejetés ».
// Le drapeau à false, cette fonction renvoie null et TOUT deviendrait
// « valide » — la mesure qui justifie la décision s'effacerait avec elle.
// D'où la séparation ci-dessous : sousSeuilValiditeV7 calcule le critère
// SANS regarder le drapeau (c'est lui que le banc lit), themeRejeteV7
// n'est plus qu'une porte au-dessus (c'est elle que l'ÉCRAN lit).
