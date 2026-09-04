// ═══════════════════════════════════════════════════════════════
// AXES RESULTANTES ROTATION
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// AXE SUCCÉDENT — CONFIRMATION CONDITIONNÉE DU NUL.
// M2+M5+M8+M11 sont traitées comme 4 nouvelles mères.
// Une figure associée au nul sur cet axe doit être présente aussi
// dans le thème initial. Ensuite M15 commande la lecture de M13/M14:
// Populus → identité; Carcer → L1/L4 impairs; Via → 4 niveaux impairs;
// Conjunctio → L2/L3 impairs.
// ═══════════════════════════════════════════════════════════════
// ─── DÉSACTIVÉ COMME MÉCANISME DÉCISIF (24/08/26, demande Ellemine_D :
// « les axes, désactive leur effet sur le verdict, ils troublent le
// calcul ») ───
// Contre-exemple qui a motivé la décision : thème Tristitia/Via/
// Conjonctio/Rubeus. L'Axe Succédent s'est confirmé et a imposé le nul,
// court-circuitant les trois autres couches — qui donnaient toutes R1.
// Score réel : 7-0. Le nul le plus faux possible sur le match le plus
// tranché du lot.
// C'est le second effondrement d'une règle de nul selon le même motif :
// la Structure du Nul avait imposé le nul sur un 6-1 (voir
// STRUCTURE_NUL_DECISIVE). Les deux fois, la règle a écrasé des couches
// qui avaient vu juste.
// ⚠️ NUANCE À NE PAS PERDRE : contrairement à la Structure du Nul (23%
// de précision, proche du taux de base de 24%), l'Axe Succédent était le
// SEUL signal de nul du fichier à dépasser nettement ce taux — validé
// sur 70 matchs archivés le 05/08/26. Il n'est donc pas retiré ni
// supprimé : son calcul, son panneau et son diagnostic restent intacts.
// Seul son pouvoir de décision est coupé, le temps de comprendre quand
// le nul arrive réellement. Remettre ce drapeau à true restaure
// exactement l'ancien comportement.
var AXE_SUCCEDENT_DECISIF = false;

function themeAxeSuccedent(theme) {
  return buildThemeFromMothers(theme[2], theme[5], theme[8], theme[11]);
}

function signalAxeSuccedentOpposition(theme) {
  const derive = themeAxeSuccedent(theme);
  const m13 = derive[13], m14 = derive[14], m15 = derive[15];

  // Figures associées au nul : elles ne deviennent un signal que
  // lorsqu'une occurrence existe aussi dans le thème initial.
  const nullFigures = new Set([
    'carcer','conjunctio','populus','via',
    'acquisitio','fortuna_minor','fortuna_major'
  ]);

  const positionsTheme = fig => {
    const p = [];
    for(let m=1;m<=16;m++) if(theme[m] === fig) p.push(m);
    return p;
  };

  const axeFigures = [theme[2], theme[5], theme[8], theme[11]];
  const ancrages = [];
  axeFigures.forEach(fig => {
    if(nullFigures.has(fig)) {
      const positions = positionsTheme(fig);
      if(positions.length) ancrages.push({fig, positions});
    }
  });

  const geo = (typeof MAP_GEO_V7 !== 'undefined' ? MAP_GEO_V7 :
               (typeof MAP_GEO !== 'undefined' ? MAP_GEO : null));
  const g13 = geo ? geo[m13] : null;
  const g14 = geo ? geo[m14] : null;

  function allOdd(g){ return !!g && g.every(v => v === 1); }
  function selectedOdd(g, idxs){
    return !!g && idxs.every(i => g[i] === 1);
  }

  let m15Rule = 'aucune';
  let conditioned = false;

  if(m15 === 'populus'){
    m15Rule = 'Populus → identité M13=M14';
    conditioned = m13 === m14;
  } else if(m15 === 'carcer'){
    m15Rule = 'Carcer → Feu/Terre impairs (L1/L4)';
    conditioned = selectedOdd(g13,[0,3]) && selectedOdd(g14,[0,3]);
  } else if(m15 === 'via'){
    m15Rule = 'Via → 4 niveaux impairs';
    conditioned = allOdd(g13) && allOdd(g14);
  } else if(m15 === 'conjunctio'){
    m15Rule = 'Conjunctio → Air/Eau impairs (L2/L3)';
    conditioned = selectedOdd(g13,[1,2]) && selectedOdd(g14,[1,2]);
  }

  // Confirmation complète : ancrage d'une figure de nul sur l'axe
  // + signature M15→M13/M14 satisfaite.
  const confirmed = ancrages.length > 0 && conditioned;

  return {
    derive, m13, m14, m15,
    opposition: confirmed, // compatibilité avec les anciens appels
    confirmed, ancrages, axeFigures, m15Rule,
    m15Conditioned: conditioned
  };
}



// ═══════════════════════════════════════════════════════════════
// JUGE DES RÉSULTANTES (04/08/26, 📚 étude, demande Ellemine_D) — rejoue
// la chaîne classique de génération du Juge (combine(M9,M10)=Niece1,
// combine(M11,M12)=Niece2, combine(Niece1,Niece2)=Juge) mais en partant
// des RÉSULTANTES de M9,M10,M11,M12 (pas des figures de base). R13/R14
// (résultantes des témoins eux-mêmes) sont calculées et affichées pour
// contexte, mais volontairement EXCLUES du calcul du nouveau Juge
// (décision explicite Ellemine_D, 04/08/26 : "rejouer la chaîne
// classique avec les résultantes... ignorer R13/R14 pour le calcul").
// Aucun poids sur verdictFinal — signal expérimental non validé.
// ═══════════════════════════════════════════════════════════════
function resultanteMaison(theme, pos) { return combine(theme[pos], FIGS_V7[pos-1]); }

function calculerJugeResultantes(theme) {
  const r9 = resultanteMaison(theme, 9);
  const r10 = resultanteMaison(theme, 10);
  const r11 = resultanteMaison(theme, 11);
  const r12 = resultanteMaison(theme, 12);
  const r13 = resultanteMaison(theme, 13);
  const r14 = resultanteMaison(theme, 14);
  const niece1 = combine(r9, r10);
  const niece2 = combine(r11, r12);
  const jugeResultantes = combine(niece1, niece2);
  return { r9: r9, r10: r10, r11: r11, r12: r12, r13: r13, r14: r14, niece1: niece1, niece2: niece2, jugeResultantes: jugeResultantes };
}

function symbFigureDots(fig, dotR) {
  dotR = dotR || 4;
  const gap = dotR * 1.3;
  return MAP_GEO[fig].map(function(v) {
    const dot = '<span style="width:'+(dotR*2)+'px; height:'+(dotR*2)+'px; border-radius:50%; background:#facc15; display:inline-block; flex-shrink:0;"></span>';
    const m = 'margin:'+Math.max(1,Math.round(dotR*0.5))+'px 0;';
    if (v === 2) return '<div style="display:flex; justify-content:center; gap:'+gap+'px; '+m+'">'+dot+dot+'</div>';
    return '<div style="display:flex; justify-content:center; '+m+'">'+dot+'</div>';
  }).join('');
}

function renderJugeResultantes(theme) {
  const el = document.getElementById('juge-resultantes-panel');
  if (!el) return;
  if (!theme) { el.innerHTML = ''; return; }
  const jr = calculerJugeResultantes(theme);

  function noeud(titre, fig, opts) {
    opts = opts || {};
    var bg = opts.sommet ? 'rgba(250,204,21,.12)' : (opts.contexte ? 'rgba(148,163,184,.06)' : 'rgba(199,161,67,.08)');
    var border = opts.sommet ? '#facc15' : (opts.contexte ? 'rgba(148,163,184,.4)' : 'var(--gold,#C7A143)');
    return '<div style="border:'+(opts.sommet?'2px':'1px')+' solid '+border+'; border-radius:10px; padding:'+(opts.sommet?'14px 20px':'8px 10px')+'; background:'+bg+'; text-align:center; min-width:'+(opts.sommet?'110px':'80px')+';">'
      + '<div style="font-size:10px; color:#94a3b8; margin-bottom:6px;">'+titre+'</div>'
      + symbFigureDots(fig, opts.sommet ? 5 : 4)
      + '<div style="font-size:'+(opts.sommet?'11px':'9px')+'; color:#94a3b8; margin-top:6px;">'+FL[fig]+'</div>'
      + '</div>';
  }
  function fleche() { return '<div style="font-size:18px; color:#94a3b8; align-self:center;">↓</div>'; }

  el.innerHTML =
    '<div style="margin:20px 0; text-align:center;">'
    + '<div style="font-size:12px; color:#94a3b8; margin-bottom:12px;">⚖️ Pyramide du Juge (résultantes M9–M12) — disposition du dessin original</div>'

    // Rangée du haut : M9, M10, M11, M12 (ordre exact demandé)
    + '<div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">'
      + noeud('R9 (M9='+FL[theme[9]]+')', jr.r9)
      + noeud('R10 (M10='+FL[theme[10]]+')', jr.r10)
      + noeud('R11 (M11='+FL[theme[11]]+')', jr.r11)
      + noeud('R12 (M12='+FL[theme[12]]+')', jr.r12)
    + '</div>'
    + '<div style="display:flex; justify-content:center; gap:24px; margin:6px 0;">' + fleche() + fleche() + '</div>'

    // Rangée du milieu : M13 (=R9+R10) à gauche, M14 (=R11+R12) à droite
    + '<div style="display:flex; justify-content:center; gap:40px; margin-bottom:6px;">'
      + noeud('M13 (résultantes) = R9 ⊕ R10', jr.niece1)
      + noeud('M14 (résultantes) = R11 ⊕ R12', jr.niece2)
    + '</div>'
    + '<div style="display:flex; justify-content:center; gap:120px; margin:6px 0;">' + fleche() + fleche() + '</div>'

    // Bas : M15, le Juge
    + '<div style="display:flex; justify-content:center;">' + noeud('M15 — JUGE (résultantes)', jr.jugeResultantes, {sommet:true}) + '</div>'

    // Contexte : R13/R14, hors calcul
    + '<div style="display:flex; justify-content:center; gap:14px; margin-top:16px; padding-top:12px; border-top:1px dashed rgba(148,163,184,.25);">'
      + noeud('R13 (M13='+FL[theme[13]]+') — contexte', jr.r13, {contexte:true})
      + noeud('R14 (M14='+FL[theme[14]]+') — contexte', jr.r14, {contexte:true})
    + '</div>'
    + '<div style="font-size:10px; color:#94a3b8; margin-top:6px;">R13/R14 affichées pour contexte, non utilisées dans le calcul du Juge.</div>'

    + '</div>'
    + '<div class="hint">📚 Étude (04/08/26) — signal expérimental, aucun poids sur verdictFinal.</div>';
}

// Le tirage live se fait désormais depuis le centre de saisie principal
// (mode "Live" du sélecteur #drawMode) — voir toggleDrawMode().

// ═══════════════════════════════════════════════════════════════
// THÈMES DÉRIVÉS — SUPERPOSITION & PHASE (04/08/26, demande Ellemine_D) —
// pas des thèmes saisis indépendamment : ils sont CALCULÉS à partir des
// mères (M1-M4) et filles (M5-M8) du thème principal déjà tiré :
//   Superposition : M1⊕M5, M2⊕M6, M3⊕M7, M4⊕M8 (mère + fille alignée)
//   Phase         : M4⊕M5, M3⊕M6, M2⊕M7, M1⊕M8 (mère + fille croisée)
// Ces 4 nouvelles "mères" repassent ensuite par EXACTEMENT le même
// moteur de génération (buildThemeFromMothers) que le thème principal —
// même structure à 16 maisons, même verdict (verdictFinal /
// verdictFamilialEngine, qui respecte les forces binôme/antagoniste
// entre figures), pas un signal simplifié séparé. Bascule via
// basculerThemeVariant() : remplace currentTheme et relance TOUT le
// pipeline de rendu existant (renderTheme(), déjà crochetée pour
// rafraîchir aussi la matrice/carré/pyramide) — donc le verdict affiché
// suit vraiment le thème actif, avec les mêmes forces que le principal.
// ═══════════════════════════════════════════════════════════════
let themeVariants = { principal: null, superposition: null, phase: null };
let themeVariantActif = 'principal';

function calculerThemesDerives(themeBase) {
  const m1 = themeBase[1], m2 = themeBase[2], m3 = themeBase[3], m4 = themeBase[4];
  const m5 = themeBase[5], m6 = themeBase[6], m7 = themeBase[7], m8 = themeBase[8];
  const superposition = buildThemeFromMothers(combine(m1, m5), combine(m2, m6), combine(m3, m7), combine(m4, m8));
  const phase = buildThemeFromMothers(combine(m4, m5), combine(m3, m6), combine(m2, m7), combine(m1, m8));
  return { superposition: superposition, phase: phase };
}

function basculerThemeVariant(variant) {
  if (!themeVariants[variant]) return;
  themeVariantActif = variant;
  currentTheme = themeVariants[variant];
  renderTheme();
  ['principal', 'superposition', 'phase'].forEach(function (v) {
    const btn = document.getElementById('variant-btn-' + v);
    if (btn) btn.classList.toggle('btn-primary', v === variant);
    if (btn) btn.classList.toggle('btn-secondary', v !== variant);
  });
}

// ═══════════════════════════════════════════════════════════════
// PLANÈTES D'INCIDENT EN M13 (04/08/26, 📚 étude, doctrine Ellemine_D) —
// doctrine classique : Mars (agression, faute, carton) et Saturne
// (blocage, accident, expulsion) sont les planètes les plus associées
// aux incidents de match (penalty, carton rouge). Parmi
// FIGURES_TRES_NEGATIVES, trois figures portent ces planètes :
//   Rubeus (Mars), Carcer (Saturne), Tristitia (Saturne)
// Signal : ces 3 figures EN M13, OU leur BINÔME en M13 (Ellemine_D,
// 04/08/26 : "leur binôme en m13 je pense suscite aussi"). Complémentaire
// au rôle élémentaire Chaotique déjà vérifié sur M13/M14/M15 — pas un
// doublon, une doctrine différente (planétaire, pas élémentaire).
// Statut : NON VALIDÉ — aucun match de l'archive n'a encore realPenalty
// rempli, donc aucun contre-test possible pour l'instant. Aucun poids
// sur verdictFinal.
// ═══════════════════════════════════════════════════════════════
const FIGURES_INCIDENT_PLANETES = ['rubeus', 'carcer', 'tristitia'];

function signalPlanetesIncidentM13(theme) {
  const fig13 = theme[13];
  const directe = FIGURES_INCIDENT_PLANETES.indexOf(fig13) !== -1;
  let viaBinome = false, figSource = null;
  if (!directe) {
    for (const f of FIGURES_INCIDENT_PLANETES) {
      if (BINOMES[f] === fig13) { viaBinome = true; figSource = f; break; }
    }
  }
  return { fig13: fig13, directe: directe, viaBinome: viaBinome, figSource: figSource, signal: directe || viaBinome };
}

// ═══════════════════════════════════════════════════════════════
// R1/R7 PAR ROTATION (04/08/26, 📚 étude, doctrine Ellemine_D : "la
// confrontation se fait au niveau de la rotation, prends R1 et R7").
// MÊME définition que moteurQuatreTrones (~ligne 1634) : R1 = la figure
// occupant la maison de repos naturelle de M1 (pas une combinaison) ;
// R7 = la figure 6 maisons plus loin dans cette même rotation.
// ATTENTION : NE PAS confondre avec la "résultante" de la matrice 16×16
// (combine(occupant, repos naturel de la maison)) — définition DIFFÉRENTE,
// propre au moteur Quatre Trônes. Confusion faite une première fois par
// Claude et corrigée par Ellemine_D le 04/08/26.
// ═══════════════════════════════════════════════════════════════
function calculerR1R7Rotation(theme) {
  const order = getRotationOrderFromRepos(theme[1]);
  const hR1 = order[0];
  const hR7 = order[6];
  return { figR1: theme[hR1], figR7: theme[hR7], hR1: hR1, hR7: hR7, startHouse: hR1 };
}
const FIGURE_ELEMENT_CODE = {
  puer:'feu', laetitia:'feu', fortuna_minor:'feu', populus:'feu',
  caput_draconis:'air', rubeus:'air', conjunctio:'air', acquisitio:'air',
  albus:'eau', via:'eau', amissio:'eau', cauda_draconis:'eau',
  tristitia:'terre', carcer:'terre', fortuna_major:'terre', puella:'terre'
};

// Signaux dérivés, calibrés le 04/08/26 sur 70 matchs réels archivés
// (dédupliqués, scores parsés). 📚 étude — corrélation brute observée,
// PAS causale, aucun poids sur verdictFinal. Chiffres trouvés (n=70) :
//  - Binôme R1 présent : Nul 33.3% (15/45) vs 8.0% (2/25) sans -> écart 25pts
//  - R1/R7 en équilibre : Victoire large 0% (0/3) vs 29.9% (20/67) sans
//  - R1/R7 même élément : Victoire large 17.6% (3/17) vs 32.1% (17/53) sans
function signalsR1R7Rotation(theme) {
  const { figR1, figR7 } = calculerR1R7Rotation(theme);
  const memeFigure = figR1 === figR7;
  const enEquilibre = estPaireEquilibre(figR1, figR7);
  const memeElement = FIGURE_ELEMENT_CODE[figR1] === FIGURE_ELEMENT_CODE[figR7];
  const themeValues = Object.keys(theme).map(function(k){return theme[k];});
  const binomeR1Present = themeValues.indexOf(BINOMES[figR1]) !== -1;
  const binomeR7Present = themeValues.indexOf(BINOMES[figR7]) !== -1;
  return { figR1: figR1, figR7: figR7, memeFigure: memeFigure, enEquilibre: enEquilibre, memeElement: memeElement, binomeR1Present: binomeR1Present, binomeR7Present: binomeR7Present };
}

// ═══════════════════════════════════════════════════════════════
// CHAÎNE R1 INTERCEPTÉE PAR LA BOUCLE DE R7 (04/08/26, 📚 étude, doctrine
// Ellemine_D — généralisation de l'analyse manuelle faite sur le thème
// Conjonctio/Fortuna Minor/Via/Albus, réel 0-1) : suit la chaîne de
// binômes de R1 (R1 → son binôme → le binôme de son binôme → ... jusqu'à
// boucler, 8 maillons max) et vérifie, à CHAQUE maillon, si son
// antagoniste est présent dans le thème ET appartient à la boucle de
// binômes de R7.
//
// PRÉCISION IMPORTANTE (04/08/26, vérifiée mathématiquement sur les 16
// figures) : l'antagoniste d'une figure appartient TOUJOURS à l'autre
// boucle que sa figure d'origine — c'est une certitude structurelle
// (binôme = décalage +2, antagoniste = décalage -3, un décalage impair
// qui traverse forcément la parité entre les deux boucles de 8), pas une
// observation empirique. Conséquence : quand R1 et R7 sont dans des
// boucles DIFFÉRENTES (cas le plus fréquent, ~50% des thèmes), la
// condition "antagoniste dans la boucle de R7" est automatiquement vraie
// dès que cet antagoniste est présent dans le thème — elle n'ajoute rien
// en soi. Le chiffre réellement informatif est donc `tauxExposition` :
// combien de maillons de la chaîne de R1 ont leur antagoniste présent
// quelque part dans le thème (base ou résultante). Quand R1 et R7
// partagent la MÊME boucle, l'inverse est vrai (l'antagoniste d'un
// membre de cette boucle n'y appartient jamais) — ce cas est de toute
// façon déjà couvert par guerreCivileR1R7.
// Statut : hypothèse née d'un seul cas réel confirmé (7/8 maillons
// exposés sur un vrai 0-1), à contre-tester sur l'archive. Aucun poids
// sur verdictFinal.
// ═══════════════════════════════════════════════════════════════
function construireBoucleBinome(fig) {
  const boucle = [fig];
  let cur = BINOMES[fig];
  for (let i = 0; i < 7 && cur !== fig; i++) { boucle.push(cur); cur = BINOMES[cur]; }
  return boucle;
}

function signalChaineR1Interceptee(theme) {
  const { figR1, figR7 } = calculerR1R7Rotation(theme);
  const boucleR1 = construireBoucleBinome(figR1);
  const boucleR7 = construireBoucleBinome(figR7);
  const memeBoucle = boucleR1.indexOf(figR7) !== -1;

  const maillonsInterceptes = [];
  boucleR1.forEach(function (fig, niveau) {
    const antag = ANTAGONISTES_V7[fig];
    const posAntag = positionsBaseEtResultantes(antag, theme);
    if (posAntag.length > 0 && boucleR7.indexOf(antag) !== -1) {
      maillonsInterceptes.push({ niveau: niveau, fig: fig, antagoniste: antag, positions: posAntag });
    }
  });

  return {
    figR1: figR1, figR7: figR7, memeBoucle: memeBoucle,
    boucleR1: boucleR1, boucleR7: boucleR7,
    maillonsInterceptes: maillonsInterceptes,
    chaineCompromise: maillonsInterceptes.length > 0,
    premierMaillonTouche: maillonsInterceptes.length ? maillonsInterceptes[0].niveau : null,
    // Métrique honnête (voir précision ci-dessus) : taux d'exposition de
    // la chaîne de R1, indépendant de la question de boucle quand
    // memeBoucle=false (puisqu'alors la condition de boucle est automatique).
    tauxExposition: maillonsInterceptes.length + '/8'
  };
}

// ═══════════════════════════════════════════════════════════════
// FIGURE ARRIÈRE (RACINE) EN GUERRE CIVILE (05/08/26, 📚 étude, doctrine
// Ellemine_D : "la figure arrière gagne souvent, surtout si figure avec
// son binôme — exemple Fortuna Minor et Conjonctio"). "Arrière" = la
// RACINE, l'amont — la figure X telle que binôme(X) = chef (même
// vocabulaire que L'Arbre du Chef : chef=tronc, racine=amont, binôme du
// chef=branche/aval). Exemple donné : binôme(Fortuna Minor) = Conjonctio,
// donc si Conjonctio est le chef, Fortuna Minor en est la racine.
//
// Applicable uniquement quand R1 et R7 sont eux-mêmes dans une relation
// racine/chef directe (l'un est le binôme de l'autre). Vérifie en plus
// si la racine est "avec son binôme" (sa PROPRE chaîne de soutien, un
// cran plus loin, est présente dans le thème) — condition que la
// doctrine associe à la victoire de la racine.
// Statut : hypothèse non testée sur l'archive, aucun poids sur
// verdictFinal.
// ═══════════════════════════════════════════════════════════════
function signalRacineArriereGuerreCivile(theme) {
  const { figR1, figR7 } = calculerR1R7Rotation(theme);
  let racine = null, chef = null, racineEstR1 = null;
  if (BINOMES_V7[figR1] === figR7) { racine = figR1; chef = figR7; racineEstR1 = true; }
  else if (BINOMES_V7[figR7] === figR1) { racine = figR7; chef = figR1; racineEstR1 = false; }
  else return { applicable: false, figR1: figR1, figR7: figR7 };

  const racineBinome = BINOMES_V7[racine];
  const racineAvecSonBinome = positionsBaseEtResultantes(racineBinome, theme).length > 0;

  return {
    applicable: true, figR1: figR1, figR7: figR7,
    racine: racine, chef: chef, racineEstR1: racineEstR1,
    campRacine: racineEstR1 ? 'M1' : 'M7', campChef: racineEstR1 ? 'M7' : 'M1',
    racineBinome: racineBinome, racineAvecSonBinome: racineAvecSonBinome
  };
}

// ═══════════════════════════════════════════════════════════════
// RÉSEAU D'ANCRAGE R1/R7 (05/08/26, demande explicite Ellemine_D — moteur
// bien plus riche que le Jugement des Deux Trônes, qui ne regardait
// qu'une seule maison par camp). Principes intégrés :
//   1. BOUCLE : R1/R7 dans la même boucle de binômes = GUERRE CIVILE
//      (conflit interne à la même famille) ; boucles différentes =
//      GUERRE INTER-BOUCLE (deux réseaux indépendants qui s'affrontent).
//   2. TOUTES LES FIGURES COMPTENT : chaque figure de la chaîne (famille
//      = 5 crans de binômes, ombre = leurs antagonistes correspondants)
//      est cherchée dans TOUT le thème, en base ET en résultante.
//   3. REPOS UNIFIÉ : une figure dans sa propre maison compte pareil que
//      ce soit en base ou en résultante (doctrine confirmée 05/08/26).
//   4. PROXIMITÉ : plus une position est proche (en distance circulaire
//      sur les 16 maisons) du siège de R1/R7, plus elle pèse. Un
//      antagoniste ou binôme lointain affecte beaucoup moins qu'un
//      voisin immédiat.
//   5. COHABITATION : les maisons où famille ET ombre se retrouvent
//      ensemble sont relevées à part (zones de friction directe).
// Statut : 📚 étude, prototype non encore validé sur l'archive. Barème
// (100/20/proximité 1/0.7/0.4/0.15) choisi pour rester cohérent avec les
// autres échelles du système, à ajuster si besoin. Aucun poids sur
// verdictFinal pour l'instant.
// ═══════════════════════════════════════════════════════════════
function distanceMaisons(p, q) { const d = Math.abs(p - q); return Math.min(d, 16 - d); }
function poidsProximiteMaison(d) { if (d === 0) return 1; if (d <= 2) return 0.7; if (d <= 5) return 0.4; return 0.15; }

function reseauAncrageR1R7(chef, hSiege, theme, profondeur) {
  profondeur = profondeur || 5;
  const chaineChef = construireBoucleBinome(chef).slice(0, profondeur);
  const chaineOmbre = chaineChef.map(function (f) { return ANTAGONISTES_V7[f]; });

  function scorerChaine(chaine) {
    let total = 0;
    const detail = [];
    chaine.forEach(function (fig) {
      positionsBaseEtResultantes(fig, theme).forEach(function (posStr) {
        const p = parseInt(posStr.replace('M', '').replace('r', ''));
        const enRepos = (FIGS_V7[p - 1] === fig);
        const concordance = enRepos ? 1 : concordanceElement(ELEMENTS_V7[fig], MAISON_ELEM_V7[p]);
        const dist = distanceMaisons(p, hSiege);
        const proxi = poidsProximiteMaison(dist);
        const base = enRepos ? 100 : 20 * concordance;
        const score = base * proxi;
        total += score;
        detail.push({ fig: fig, position: p, enRepos: enRepos, concordance: concordance, distance: dist, proxi: proxi, score: Math.round(score * 100) / 100 });
      });
    });
    return { total: Math.round(total * 100) / 100, detail: detail };
  }

  const famille = scorerChaine(chaineChef);
  const ombre = scorerChaine(chaineOmbre);
  const maisonsFamille = {}; famille.detail.forEach(function (d) { maisonsFamille[d.position] = true; });
  const maisonsOmbre = {}; ombre.detail.forEach(function (d) { maisonsOmbre[d.position] = true; });
  const cohabitations = Object.keys(maisonsFamille).filter(function (m) { return maisonsOmbre[m]; }).map(Number);

  return { chaineChef: chaineChef, chaineOmbre: chaineOmbre, famille: famille, ombre: ombre, net: famille.total - ombre.total, cohabitations: cohabitations };
}

// ═══════════════════════════════════════════════════════════════
// RÉSEAU D'ANCRAGE PAR AXE (04/09/26, demande Ellemine_D : « pour les
// axes peux-tu en faire des ancrage ») — même moteur que
// reseauAncrageR1R7 juste au-dessus (chaîne famille de binômes contre
// chaîne ombre de leurs antagonistes, pondérée par proximité au siège),
// mais appliqué à la figure de CHAQUE axe (Cardinal, Succédent, Cadent,
// Partage — cf. AXES_VALIDITE_DEFS) plutôt qu'à un chef unique R1/R7.
// ⚠️ DIFFÉRENCE OBLIGÉE : un axe n'a pas UNE maison de siège, il en a 4.
// La distance à « la maison du chef » devient donc la distance à LA PLUS
// PROCHE des 4 maisons de l'axe (distanceAxeMaisons) — tout le reste
// (chaîne, score, proximité) est identique à reseauAncrageR1R7.
// 📚 étude, prototype non encore testé sur l'archive. Aucun poids sur
// le verdict.
function distanceAxeMaisons(p, maisonsAxe) {
  return Math.min.apply(null, maisonsAxe.map(function (h) { return distanceMaisons(p, h); }));
}

// ═══════════════════════════════════════════════════════════════
// LES DEUX AXES QUI PORTENT UNE LOI (04/09/26) — Ellemine_D :
// « pour m10 - m4 et les axes offensives, si tu portes attention à ces
// axes je sais que tu vas découvrir quelque chose. »
//
// Il avait raison, et ce n'est pas une statistique : c'est exact.
//
// ── LE FAIT ──
// Le thème a six axes d'opposition, M(h) ↔ M(h+6). Balayage exhaustif des
// 65 536 thèmes, en énumération directe :
//     M1 ⊕ M7  ..... aucune loi exacte
//     M2 ⊕ M8  ..... aucune loi exacte
//     M3 ⊕ M9  ..... aucune loi exacte
//   ★ M4 ⊕ M10 = M3    65536/65536
//   ★ M5 ⊕ M11 = M6    65536/65536
//     M6 ⊕ M12 ..... aucune loi exacte
// DEUX axes sur six portent une loi. Et ce sont exactement la DÉFENSE et
// l'ATTAQUE : M4 est la 4e maison depuis M1 et M10 la 4e depuis M7 — les
// deux buts ; M5 est la 5e depuis M1 et M11 la 5e depuis M7 — les deux
// attaques. Les quatre autres axes dépendent du tirage ; ces deux-là non.
//
// Conséquence directe : les deux maisons défensives NE SONT PAS
// INDÉPENDANTES. Tout signal construit sur le couple (M4, M10) est, qu'on
// le sache ou non, un énoncé sur M3. Idem pour (M5, M11) et M6. C'est
// pourquoi ces deux maisons sont nommées ici les GOUVERNEURS.
//     M3 « Les Frères »  gouverne l'axe défensif   — camp 1
//     M6 « La Maladie »  gouverne l'axe offensif   — camp 2
// M3 ⊕ M6 n'est, lui, lié à rien : vérifié, aucune loi exacte.
//
// ⚠️ CE N'EST PAS UNE LOI NOUVELLE, C'EST UNE DÉCOMPOSITION. Le fichier
// savait déjà que Cardinal ⊕ Succédent = Cadent. Ce qu'on ignorait, c'est
// que cette loi globale se casse en quatre lois locales — M3 = M4⊕M10,
// M6 = M5⊕M11, M9 = M1⊕M2, M12 = M7⊕M8 — et que parmi les six axes
// d'opposition, seuls la défense et l'attaque en portent une.
//
// ── CE QUE ÇA DONNE À LA MESURE : UNE PISTE, PAS UN RÉSULTAT ──
// 28 tests passés sur les 48 cas réels de l'archive (camp connu, hors
// e-sport). Un seul sort du lot :
//     M3 NÉGATIVE  (n=14) : R1 7 · R7 1 · nul 6     → R7 = 7,1 %
//     M3 autre     (n=34) : R1 13 · R7 16 · nul 5   → R7 = 47,1 %
//     Fisher exact bilatéral p = 0,009
// Autrement dit : quand le gouverneur de la défense est une figure
// négative (Cauda Draconis, Carcer, Tristitia, Amissio, Rubeus, Puer —
// 37,5 % des thèmes), le camp 2 ne gagne pratiquement jamais. Le seul
// contre-exemple de l'archive est VillaMain (Carcer).
//
// ☠️ ET CE p = 0,009 N'ÉTABLIT RIEN. C'est un test parmi 28 : corrigé du
// nombre d'essais il vaut ~0,25. n = 14 dans la cellule qui décide. Ce
// n'est pas une règle, c'est le meilleur candidat trouvé sur l'axe que
// Ellemine_D désignait — rien de plus, et il n'est branché sur AUCUN
// calcul.
//   (Écarté au passage : « M3 de Mars → incident », 2/2, p = 0,019. Deux
//   cas. Le p ne vient que de la rareté de l'incident dans l'archive.)
//
// ── LE TEST ÉTAIT POSÉ D'AVANCE. LA RÈGLE EST MORTE LE SOIR MÊME. ──
// Écrit le 04/09 avant les résultats : M3 est négative sur six des treize
// matchs, et dans cinq de ces six le moteur annonçait R7 malgré la règle.
// Huit résultats sont tombés le soir même, dont quatre sur des thèmes à M3
// négative :
//     Ipswich/Liverpool ..... M3 Cauda Draconis · réel R7   ← violée
//     Genoa/Como ............ M3 Puer           · réel R7   ← violée
//     Al-Shabab/Al-Hilal .... M3 Carcer         · réel R7   ← violée
//     RealBetis/RealMadrid .. M3 Rubeus         · réel R1   ✓ respectée
// R7 sur 3 des 4. L'archive donnait 1 sur 14 (7 %) ; la réalité hors
// échantillon donne 75 %. Cumulé : 4/18 = 22 %.
//
// ☠️ LA RÈGLE EST RÉFUTÉE, ET C'EST EXACTEMENT CE QU'ON VOULAIT D'ELLE.
// Un p = 0,009 tiré de 28 essais sur 48 cas a survécu douze heures. Sans
// l'écrire à l'avance on aurait pu la garder des mois, la « confirmer » en
// choisissant des cas, et finir par la brancher. Écrite d'avance, elle est
// morte en une soirée pour le prix d'un commentaire.
//   ➜ NE PAS LA RESSUSCITER en changeant la liste des figures négatives ou
//     en ajoutant une condition. Ce serait la retailler sur les cas qui
//     l'ont tuée. Elle est fermée.
//
// CE QUI SURVIT DE CE BLOC : la LOI, pas la piste. M4 ⊕ M10 = M3 et
// M5 ⊕ M11 = M6 restent vraies sur 65 536 thèmes, et restent le fait
// important — deux axes sur six seulement portent une loi, et ce sont la
// défense et l'attaque.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// L'AXE DU PARTAGE ET LES BUTS (04/09/26) — Ellemine_D : « c'est l'axe
// 3-5-9-11 par interaction avec l'axe 1-4-7-10 qui explique les buts.
// m3 découle de m4 et m10, m11 découle de m5 et m6. »
//
// ── SES TROIS DÉRIVATIONS SONT EXACTES, LES TROIS ──
//   ★ M3  = M4 ⊕ M10    65536/65536
//   ★ M11 = M5 ⊕ M6     65536/65536
//   ★ M9  = M1 ⊕ M2     65536/65536
// (M5 est une FILLE — une colonne transposée des mères — elle ne dérive
// d'aucun XOR. C'est la seule des quatre maisons du Partage qui ne soit
// pas une différence.)
//
// ── ET LES DEUX AXES NE SONT PAS LIÉS ENTRE EUX ──
// Partage = Cardinal, Partage ⊕ Cardinal = Succédent, = Cadent, =
// Populus… : toutes ces relations sortent à 4096/65536, soit 1/16, le
// pur hasard. L'axe du Partage est structurellement INDÉPENDANT du
// Cardinal. Leur « interaction » est donc une vraie question empirique,
// pas une identité algébrique déguisée — ce qui rend l'hypothèse
// testable, et c'est à son crédit.
//
// ── LA MESURE COUPE L'HYPOTHÈSE EN DEUX ──
// 49 matchs au score connu (41 archive + 8 du 04/09), test F par
// permutation, aucun groupe choisi à la main :
//     M9 SEULE ........................ F=1,086  p=0,0046  ★
//     axe du Partage COMPLET (3-5-9-11)  F=0,638  p=0,098
//     axe du Partage SANS M9 (3-5-11) .. F=0,347  p=0,535
//     axe CARDINAL (1-4-7-10) ......... F=0,202  p=0,965   ← inerte
//     Partage ⊕ Cardinal .............. F=0,341  p=0,721
//     couple (Partage, Cardinal) ...... p=0,219
//     éléments Partage → Cardinal ..... p=0,673
//     nb de figures communes aux 2 axes  p=0,719
//   témoins (quadruplets qui ne sont pas le Partage) :
//     4-6-10-12 p=0,486 · 2-6-8-12 p=0,722 · 1-5-7-11 p=0,827
//
// ✔ SA LOCALISATION EST BONNE : les buts sont bien dans l'axe 3-5-9-11,
//   et pas dans un quadruplet quelconque — les trois témoins ne disent
//   rien.
// ✘ MAIS TOUT LE SIGNAL EST DANS UNE SEULE DE SES QUATRE MAISONS. Ôter
//   M9 de l'axe le tue : p passe de 0,098 à 0,535. Et ajouter n'importe
//   quelle autre maison à M9 la dilue (M3⊕M9 p=0,382, M5⊕M9 p=0,812,
//   M9⊕M11 p=0,844).
// ✘ ET L'INTERACTION AVEC LE CARDINAL N'EXISTE PAS. L'axe 1-4-7-10 est
//   le DERNIER des treize facteurs testés (p=0,965), et les quatre
//   formes d'interaction essayées ne donnent rien.
//
// Ce qui reste : les buts se lisent en M9, c'est-à-dire dans M1 ⊕ M2 —
// le chef du camp 1 combiné à sa maison de ressource.
//
// ── LA RÈGLE, ET POURQUOI ELLE NE VAUT RIEN ENCORE ──
//     M9 HAUT (Albus, Conjunctio, Rubeus, Tristitia, Acquisitio)
//         n=15 · 5,40 buts/match · 100 % au-dessus de 2,5
//     M9 BAS  (Amissio, Laetitia, Puella, Populus)
//         n=13 · 1,69 buts/match ·  15 % au-dessus de 2,5
//     règle juste sur 26/28, Fisher p < 0,0001
//
// ☠️ CE 26/28 EST UN CHIFFRE D'AJUSTEMENT, PAS UNE PERFORMANCE. J'ai
// composé les deux listes EN REGARDANT le tableau des buts par figure de
// M9 : j'ai pris le haut et le bas. Choisir les groupes sur le résultat
// puis mesurer sur les mêmes données ne prouve rien, et un p < 0,0001
// obtenu ainsi est un artefact de méthode, pas une découverte.
//   Et le rappel du jour est frais : ce matin « M3 négative → R7 exclu »
//   sortait à p = 0,009 et il est mort à 15 heures d'intervalle, réfuté
//   3 fois sur 4 hors échantillon. M9 est dans la même zone de danger —
//   p brut 0,0046, mais 13 maisons ont été balayées, donc ~0,06 corrigé.
//
// ── INSCRIT D'AVANCE SUR 5 MATCHS · TROIS RÉSULTATS SONT TOMBÉS ──
//     ✓ Aveley/Cheshunt ..... M9 Rubeus     · annoncé PLUS de 2,5 · réel 4-2 = 6 buts
//     ✓ Quorn/Shepshed ...... M9 Acquisitio · annoncé PLUS de 2,5 · réel 2-1 = 3 buts
//     ✓ Ossett/Pontefract ... M9 Populus    · annoncé MOINS de 2,5 · réel 1-0 = 1 but
//   3 sur 3, HORS ÉCHANTILLON.
//   Restent : ThreeBridges/Kingstonian (M9 Acquisitio → plus de 2,5) et
//   Flackwell/Hanwell (M9 Fortuna Major → la règle se tait).
//
// CE QUE VAUT CE 3/3, EXACTEMENT. Le taux de base « plus de 2,5 buts »
// est de 57,1 % sur les 49 cas antérieurs. Les trois annonces étaient
// deux « plus » et un « moins » ; sous le seul hasard, les trois tombent
// justes avec probabilité 0,571 × 0,571 × 0,429 = 14,0 %. Ce n'est donc
// PAS une confirmation : une chance sur sept de voir ça sans aucun
// signal. Le 26/28 en échantillon reste, lui, sans valeur probante.
//
// ✔ MAIS ELLE A SURVÉCU LÀ OÙ L'AUTRE EST MORTE, et c'est la seule chose
// que cette soirée établit vraiment. Le même jour, sur le même protocole
// d'inscription préalable :
//     « M3 négative → R7 exclu »  archive 1/14 = 7 %  →  hors échantillon
//         3 R7 sur 5 = 60 %. RÉFUTÉE.
//     « M9 haut/bas → plus/moins de 2,5 buts »  →  3/3. SURVIT.
// Deux pistes nées le même jour du même fichier, l'une tuée en quinze
// heures, l'autre encore debout. C'est à ça que sert d'écrire avant.
//
// ➜ TOUJOURS PAS BRANCHÉE. Il faut d'autres matchs, et surtout des
// tirages À LA MAIN : les onze cas de contrôle sont des thèmes de
// hachage, aveugles au match par construction. Si la règle tient aussi
// sur des tirages à la main, elle deviendra intéressante. Prochain seuil
// raisonnable : dix annonces fermes hors échantillon.
// ═══════════════════════════════════════════════════════════════
var M9_BUTS_HAUT_V7 = ['albus', 'conjunctio', 'rubeus', 'tristitia', 'acquisitio'];
var M9_BUTS_BAS_V7  = ['amissio', 'laetitia', 'puella', 'populus'];
function lectureButsM9V7(theme) {
  if (!theme || !theme[9]) return null;
  var f = theme[9];
  var sens = M9_BUTS_HAUT_V7.indexOf(f) >= 0 ? 'haut'
          : M9_BUTS_BAS_V7.indexOf(f) >= 0 ? 'bas' : null;
  return {
    m9: f, origine: 'M9 = M1 ⊕ M2', sens: sens,
    annonce: sens === 'haut' ? 'plus de 2,5 buts'
           : sens === 'bas' ? 'moins de 2,5 buts' : 'la règle se tait',
    enEchantillon: sens === 'haut' ? '5,40 buts, 100 % au-dessus de 2,5 (n=15)'
                 : sens === 'bas' ? '1,69 buts, 15 % au-dessus de 2,5 (n=13)' : null,
    statut: 'NON DÉMONTRÉ — groupes choisis sur les mêmes données, 26/28 est un chiffre d\'ajustement',
    branche: false
  };
}

function gouverneursAxesV7(theme) {
  if (!theme || !theme[3]) return null;
  var NEG = (typeof FIGURES_NEGATIVES_V7 !== 'undefined') ? FIGURES_NEGATIVES_V7 : {};
  var g = {
    defense: { gouverneur: theme[3], maisons: [4, 10],
      figures: [theme[4], theme[10]], negatif: !!NEG[theme[3]] },
    attaque: { gouverneur: theme[6], maisons: [5, 11],
      figures: [theme[5], theme[11]], negatif: !!NEG[theme[6]] }
  };
  // Contrôle des deux lois à chaque appel : si l'une tombe, c'est que la
  // construction du thème a changé quelque part et il faut le savoir.
  try {
    if (combine(theme[4], theme[10]) !== theme[3]
      || combine(theme[5], theme[11]) !== theme[6]) {
      console.warn('\u26a0\ufe0f Loi des axes gouvernés violée — la construction du thème a changé');
      g.loiRompue = true;
    }
  } catch (e) { g.loiRompue = null; }
  // La piste « M3 négative → R7 exclu » a été RÉFUTÉE le 04/09 au soir
  // (3 R7 sur 4 hors échantillon contre 1/14 dans l'archive). Le champ
  // reste, à false, pour que personne ne la redécouvre en croyant qu'elle
  // est neuve. Cf. le bloc au-dessus.
  g.pisteR7Exclu = null;
  g.pisteR7ExcluRefutee = { quand: '04/09/26', archive: '1/14', horsEchantillon: '3/4 R7',
    verdict: 'RÉFUTÉE — ne pas rouvrir en modifiant la liste des figures négatives' };
  return g;
}

function reseauAncrageAxeV7(axeKey, theme, profondeur) {
  profondeur = profondeur || 5;
  var def = AXES_VALIDITE_DEFS.filter(function (a) { return a.key === axeKey; })[0];
  if (!def) return null;
  var maisonsAxe = def.houses;
  var chef = combineMany(maisonsAxe.map(function (h) { return theme[h]; }));
  var chaineChef = construireBoucleBinome(chef).slice(0, profondeur);
  var chaineOmbre = chaineChef.map(function (f) { return ANTAGONISTES_V7[f]; });

  function scorerChaine(chaine) {
    var total = 0, detail = [];
    chaine.forEach(function (fig) {
      positionsBaseEtResultantes(fig, theme).forEach(function (posStr) {
        var p = parseInt(posStr.replace('M', '').replace('r', ''), 10);
        var enRepos = (FIGS_V7[p - 1] === fig);
        var concordance = enRepos ? 1 : concordanceElement(ELEMENTS_V7[fig], MAISON_ELEM_V7[p]);
        var dist = distanceAxeMaisons(p, maisonsAxe);
        var proxi = poidsProximiteMaison(dist);
        var base = enRepos ? 100 : 20 * concordance;
        var score = base * proxi;
        total += score;
        detail.push({ fig: fig, position: p, enRepos: enRepos, concordance: concordance, distance: dist, proxi: proxi, score: Math.round(score * 100) / 100 });
      });
    });
    return { total: Math.round(total * 100) / 100, detail: detail };
  }

  var famille = scorerChaine(chaineChef);
  var ombre = scorerChaine(chaineOmbre);
  return { axe: def.label, maisons: maisonsAxe, figure: chef,
    chaineChef: chaineChef, chaineOmbre: chaineOmbre,
    famille: famille, ombre: ombre, net: Math.round((famille.total - ombre.total) * 100) / 100 };
}

// Les 4 ancrages d'un coup, pour comparer les axes entre eux.
function reseauAncrageTousAxesV7(theme, profondeur) {
  return AXES_VALIDITE_DEFS.map(function (a) { return reseauAncrageAxeV7(a.key, theme, profondeur); });
}

// ═══════════════════════════════════════════════════════════════
// PIÈGE CHEF+BINÔME (05/08/26, demande explicite Ellemine_D) — un camp
// est "piégé" quand SON PROPRE chef (R1 ou R7) ET son binôme sont TOUS
// LES DEUX pris en tenaille par la chaîne famille adverse (même maison,
// ou maison à élément concordant). Exemple donné : Amissio→Tristitia,
// Caput Draconis→Via. Si un seul camp est piégé (l'autre non), le camp
// piégé perd automatiquement, quel que soit le score net. Si les DEUX
// camps sont piégés en même temps, c'est le plus solide (score net le
// plus élevé) qui l'emporte — départage explicite demandé.
// ═══════════════════════════════════════════════════════════════


// ─── RÈGLE ELLEMINE (21/08/26) : ANALYSE PROTECTEUR PAR CHAÎNE D'ANTAGONISME ───
// Pour chaque figure du cycle (16), calcule si elle est PROTÉGÉE (son
// protecteur, cf. PROTECTEURS_V7, est présent dans le thème),
// VULNÉRABLE (son antagoniste direct est présent mais pas son
// protecteur) ou LIBRE (son antagoniste direct est absent — rien ne la
// menace, la protection n'est même pas nécessaire).
function analyserProtectionV7(theme) {
  return FIGS_V7.map(function(fig) {
    const antagoniste = ANTAGONISTES_V7[fig];
    const protecteur = PROTECTEURS_V7[fig];
    // CORRIGÉ (25/08/26) : exactement l'oubli qu'Ellemine_D avait déjà fait
    // corriger le 21/08 dans analyserResistanceV7 (« faut pas ignorer les
    // résultantes ») — cette fonction-ci avait été manquée. Une figure
    // présente uniquement en résultante n'était vue ni comme antagoniste
    // menaçant ni comme protecteur disponible.
    const antagonistePresent = trouverFigV7(antagoniste, theme).length > 0;
    const protecteurPresent = trouverFigV7(protecteur, theme).length > 0;
    const reposProtecteur = FIGS_V7.indexOf(protecteur) + 1;
    const protecteurEnRepos = theme[reposProtecteur] === protecteur;
    let statut, couleur;
    if (!antagonistePresent) { statut = 'libre'; couleur = '#4ade80'; }
    else if (protecteurPresent) { statut = 'protégé'; couleur = '#8E5FC7'; }
    else { statut = 'vulnérable'; couleur = '#f87171'; }
    return {fig: fig, antagoniste: antagoniste, protecteur: protecteur,
      antagonistePresent: antagonistePresent, protecteurPresent: protecteurPresent,
      protecteurEnRepos: protecteurEnRepos, statut: statut, couleur: couleur};
  });
}

// ═══════════════════════════════════════════════════════════════
// RÉSEAU D'ANCRAGE V2 (21/08/26, doctrine complète Ellemine_D)
// Refonte du principe d'interprétation du réseau d'ancrage, en un bloc.
// 📚 DOCTRINE NOUVELLE — non validée sur l'archive, purement informative,
// AUCUN poids sur verdictFinal ni sur le protocole R1/R7 affiché.
//
// Structure :
//  1. forceFigureMaisonV7   — les 4 facteurs de force d'une figure dans
//     une maison : concordance, environnement/déplacement, multiplicité.
//  2. analyserResistanceV7  — une figure menacée par son antagoniste a
//     deux voies de résistance indépendantes : (A) son protecteur
//     (antagoniste de son antagoniste) neutralise la menace, ou (B) elle
//     est chez elle (repos) ET sa chaîne binôme→binôme-du-binôme est
//     intégralement présente dans le thème.
//  3. analyserConfrontationDirecteV7 — la résultante combine(R1,R7) :
//     dans quelle boucle tombe-t-elle, et quelle est sa propre solidité.
//  4. detecterNulParPivotV7 — cas d'étude (Carcer/Fortuna Major) : un
//     pivot qui est À LA FOIS antagoniste direct de l'un des deux camps
//     ET binôme de l'antagoniste de l'autre neutralise les deux camps
//     simultanément par deux chemins relationnels différents.
//  5. filtreJugeM15M16V7 — M15/M16 peuvent imposer le nul malgré une
//     domination du réseau : M15 fréquent pour le nul = Populus, Carcer,
//     Conjonctio ; M13/M14 identiques ou opposées oriente la lecture ;
//     si le pivot de neutralisation (point 4) est actif, M16 met le
//     score EN SUSPENS plutôt que de trancher un chiffre.
//  6. analyserReseauAncrageV2 — orchestrateur : branche sur boucles
//     différentes (procédure complète décrite ci-dessus) ou même boucle
//     (comparaison directe de la solidité des deux chaînes, avec
//     renfort par élément de maison : une figure d'une boucle dans une
//     maison dont la figure native appartient À LA MÊME boucle est
//     renforcée, cf. Tristitia en M8/M4, Carcer en M12).
// ═══════════════════════════════════════════════════════════════

// BARÈME (21/08/26, proposé faute de barème explicite d'Ellemine_D —
// "vas-y branche-le, je suis confiant") : additif, même échelle que les
// autres signaux du moteur (points comparables à familleScoreEngine).
// - Concordance (0 à 1, cf. concordanceElement) × 10 -> 0 à 10 pts
// - Déplacement : chez soi +15 · maison alliée (binôme) +8 · neutre 0
//   · maison ennemie (antagoniste) -8
// - Multiplicité : +1.5 par occurrence (base+résultante), plafonné à
//   4 occurrences comptées (6 pts max) — au-delà, la présence est déjà
//   acquise, ça n'ajoute plus grand-chose à la force réelle.
// 📚 barème proposé, non validé sur l'archive — à ajuster dès qu'un cas
// le contredit.
var DEPLACEMENT_BONUS_V7 = {chez_soi: 15, favorable: 8, neutre: 0, defavorable: -8};
function forceFigureMaisonV7(fig, house, theme) {
  const elemFig = ELEMENTS_V7[fig];
  const elemMaison = MAISON_ELEM_V7[house];
  const concordanceC = concordanceElement(elemFig, elemMaison);
  const natif = FIGS_V7[house - 1];
  let deplacement;
  if (fig === natif) deplacement = 'chez_soi';
  else if (BINOMES_V7[fig] === natif || BINOMES_V7[natif] === fig) deplacement = 'favorable';
  else if (ANTAGONISTES_V7[fig] === natif || ANTAGONISTES_V7[natif] === fig) deplacement = 'defavorable';
  else deplacement = 'neutre';
  const multiplicite = trouverFigV7(fig, theme).length;
  const score = Math.round((concordanceC * 10 + DEPLACEMENT_BONUS_V7[deplacement] + Math.min(multiplicite, 4) * 1.5) * 100) / 100;
  return {fig: fig, house: house, elemFig: elemFig, elemMaison: elemMaison,
    concordance: concordanceC, natif: natif, deplacement: deplacement, multiplicite: multiplicite, score: score};
}

// ═══════════════════════════════════════════════════════════════
// PROFIL COMPLET D'UNE FIGURE DANS UNE MAISON (24/08/26, révision
// Ellemine_D de la méthode d'ancrage : « tu ignores des faits
// importants »). forceFigureMaisonV7 ne retenait que 3 dimensions sur 6.
// Les six exigées, dans l'ordre donné :
//   concordance · multiplicité · environnement · déplacement ·
//   cohabitation · niveau d'activation
//
// Trois viennent de forceFigureMaisonV7 avec leurs barèmes existants.
// Les trois autres sont ajoutées ici :
//   • environnement  = scoreEnvironnementInterpretation (chaîne de
//     binômes sur 5 crans, chaque maillon pris à sa meilleure position,
//     pondéré par concordance). Échelle large (±15 par maillon) donc
//     ramené par un coefficient.
//   • cohabitation   = dans la maison occupée, base et résultante
//     tombent-elles dans deux boucles différentes, et la figure est-elle
//     du côté le plus concordant à l'élément de la maison ?
//   • activation     = ligne du glyphe correspondant à l'élément de la
//     maison : 1 point simple = ACTIVE, 2 points = PASSIVE (même lecture
//     que elementaireFigureMaison).
// ⚠️ Les trois coefficients ci-dessous sont PROPOSÉS, pas validés sur
// l'archive — exposés dans une constante pour être réglés d'un seul
// endroit dès qu'un cas réel les contredit.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// ⚠️ LE SCORE DÉPEND DU JOUR OÙ ON REGARDE (découvert le 29/08/26)
//
// En cherchant pourquoi les deux scores exacts de l'archive avaient
// disparu, on a fini par tester la seule chose qui avait changé : la
// DATE. Le même thème, sans qu'une ligne bouge, donne un score différent
// selon le jour — parce que la planète du jour et la figure du jour
// entrent dans la force planétaire, donc dans le nombre de buts.
//
//   jour        figure du jour    Atalanta   LaetCarcer   scores exacts
//   26/08       Populus           4-0        4-0          2/17
//   27/08       Puer              4-0        4-0          2/17
//   28/08       Laetitia          4-0        4-0          2/17
//   29/08       Caput Draconis    3-0        3-0          0/17
//   30/08       Albus             4-0        4-0          2/17
//   01/09       Carcer            4-0        4-0          2/17
//   05/09       Puella            3-0        3-0          0/17
//
// CE QUI EST TOUCHÉ, ET CE QUI NE L'EST PAS :
// · le SCORE bouge — les deux scores exacts de l'archive n'existent que
//   les jours où la figure du jour ne pousse pas les buts vers le bas ;
// · le CAMP ne bouge pas — 15/23 sur les sept jours testés, identique.
//
// Conséquence pratique : un score « exact » n'est exact que le jour où il
// a été calculé. Rejouer l'archive un autre jour ne donne pas les mêmes
// scores, et toute mesure de la famille score doit dire à quelle date
// elle a été faite. Le vainqueur, lui, est stable — c'est sur lui que le
// banc doit se juger.
// (Ce n'est pas un défaut en soi : la doctrine VEUT que le jour compte.
// Le défaut serait de ne pas le savoir en comparant deux mesures.)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// LA CONCORDANCE, RETIRÉE PUIS REMESURÉE (28/08/26, demande d'Ellemine_D)
//
// Le constat qui a lancé le test : prise SEULE, en somme sur les cinq
// rôles d'un camp, la concordance est le plus mauvais des sept critères
// (4/12 sur l'archive) — et c'est le plus lourd, ×10. Sur ViaCaput elle
// donne à elle seule +7,5 à R7, ce qui inverse le camp : sans elle le
// camp de R1 passe devant (19,63 contre 15,05).
//
// Elle a donc été mise à 0 dans le profil, et TOUT a été remesuré :
//
//   configuration                          verdict affiché   pôles solides
//   référence (concordance ×10, seuil 12) ...... 15/23           33 %
//   concordance à 0, seuil inchangé ............ 12/23           12 %
//   concordance à 0, seuil abaissé à 6 ......... 12/23           37 %
//   concordance et environnement à 0 ........... 11/23            4 %
//
// TROIS POINTS PERDUS. Et le seuil n'y est pour rien : en l'abaissant
// pour retrouver le même taux de pôles solides, le verdict reste à 12/23.
//
// POURQUOI LES DEUX MESURES NE SE CONTREDISENT PAS. En somme de camp, la
// concordance discrimine mal. Mais dans le PROFIL, elle fait autre chose :
// c'est elle qui choisit la MEILLEURE POSITION d'une figure présente
// plusieurs fois, et qui décide si une figure « tient sa place ». La
// retirer ne supprime pas un mauvais juge, elle aveugle la sélection des
// positions — et tout ce qui en dépend (chaîne, pôles solides, ancrage)
// se dégrade.
//
// Ce que ça coûte, cas par cas : ViaCaput est redressé (R1 ✔ au lieu de
// R7), mais LaetCarcer perd son SCORE EXACT (3-0 au lieu de 4-0 pour un
// 4-0 réel) et deux autres cas basculent. La concordance reste donc à ×10.
// Le test est écrit ici pour qu'on ne le refasse pas, et pour qu'on sache
// que le vrai levier n'est pas son poids mais sa PLACE : bonne pour
// choisir une position, mauvaise pour départager deux camps.
// ═══════════════════════════════════════════════════════════════
var POIDS_PROFIL_V7 = {
  concordance: 10,     // existant (forceFigureMaisonV7)
  multiplicite: 1.5,   // existant, plafonné à 4 occurrences
  environnement: 0.3,  // ⚠️ proposé
  cohabitation: 2,     // ⚠️ proposé
  activation: 5,       // alignement actif : 0 ligne → −5, 1 → 0, 2 → +5
                       // (doctrine Ellemine_D du 25/08, cf. alignementActifV7)
  maisonNatale: 6      // ⚠️ proposé — allié chez soi +6, ennemi chez soi −6
};

// Barème de l'alignement actif, indexé par le nombre de lignes actives
// compatibles avec l'élément de la maison (0, 1 ou 2). Multiplié par
// POIDS_PROFIL_V7.activation. Séparé du poids pour pouvoir tester la
// FORME du barème (linéaire, conjonctif, binaire) sans toucher au reste.
// Lecture CONJONCTIVE de la doctrine : « une figure qui aligne ces trois
// est forte ». Aligner les deux lignes = force pleine (+1). N'en aligner
// qu'une n'est pas une demi-force, c'est un alignement manqué : −0,5.
// N'en aligner aucune : −1.
// Mesuré sur les 4 cas de référence — linéaire (−1/0/+1) : 2/4 ;
// conjonctif (−1/−0,5/+1) : 3/4, soit le score de l'ancien critère.
var BAREME_ALIGNEMENT_V7 = [-1, -0.5, 1];

// ─── ÉTAT DE LA MAISON NATALE (25/08/26, doctrine Ellemine_D) ───
// « Il est favorable que la maison d'une figure X soit occupée par son
// allié, pas par son ennemi. » Dimension indépendante des cinq autres :
// elle ne regarde pas où la figure SE TROUVE, mais qui occupe SA PROPRE
// maison de repos pendant ce temps. Un binôme qui garde la maison est un
// appui ; un antagoniste installé chez vous est une prise adverse.
function etatMaisonNatale(fig, theme) {
  const maison = FIGS_V7.indexOf(fig) + 1;
  if (maison < 1) return { maison: null, occupant: null, statut: 'inconnue', score: 0 };
  const occupant = theme[maison];
  let statut, score;
  if (occupant === fig) { statut = 'chez elle'; score = 0; }          // déjà compté par le déplacement
  else if (BINOMES_V7[fig] === occupant || BINOMES_V7[occupant] === fig) { statut = 'tenue par son binôme'; score = 1; }
  else if (ANTAGONISTES_V7[fig] === occupant || ANTAGONISTES_V7[occupant] === fig) { statut = 'tenue par son antagoniste'; score = -1; }
  else { statut = 'occupée par une neutre'; score = 0; }
  return { maison: maison, occupant: occupant, statut: statut, score: score };
}

// Cohabitation vue depuis UNE figure dans UNE maison : neutre si la
// maison ne croise pas les boucles (base et résultante dans la même),
// sinon la figure domine la maison si son élément y est plus concordant
// que celui de l'autre côté.
function cohabitationFigureMaison(fig, house, theme) {
  const base = theme[house];
  const res = getResultant(base, house);
  if (base === res) return {croise: false, statut: 'repos', score: 0};
  const lb = loopOf(base), lr = loopOf(res);
  if (!lb || !lr || lb === lr) return {croise: false, statut: 'même boucle', score: 0};
  const cote = (fig === base) ? 'base' : (fig === res) ? 'résultante' : null;
  if (!cote) return {croise: true, statut: 'croisée, figure absente de cette maison', score: 0};
  const elemMaison = MAISON_ELEM_V7[house];
  const concBase = concordanceElement(ELEMENTS_V7[base], elemMaison);
  const concRes = concordanceElement(ELEMENTS_V7[res], elemMaison);
  const concFig = cote === 'base' ? concBase : concRes;
  const concAutre = cote === 'base' ? concRes : concBase;
  let statut, score;
  if (concFig > concAutre) { statut = 'domine la cohabitation'; score = 1; }
  else if (concFig < concAutre) { statut = 'dominée dans la cohabitation'; score = -1; }
  else { statut = 'cohabitation à égalité'; score = 0; }
  return {croise: true, cote: cote, autre: cote === 'base' ? res : base,
    concFig: concFig, concAutre: concAutre, statut: statut, score: score};
}

function profilFigureMaison(fig, house, theme) {
  // Voir memoThemeV7 : on met le CALCUL en cache, on rend une copie,
  // parce que profilFigureTheme écrit « enResultante » sur ce qu'il reçoit.
  const memoP = memoThemeV7(theme, '__memoProfil');
  const cleP = fig + '|' + house;
  if (memoP && memoP[cleP]) return Object.assign({}, memoP[cleP]);
  const base = forceFigureMaisonV7(fig, house, theme);
  const elem = elementaireFigureMaison(fig, house);
  const cohab = cohabitationFigureMaison(fig, house, theme);
  let env = {total: 0, detail: []};
  try { env = scoreEnvironnementInterpretation(fig, house, theme, 5); } catch (e) { env = {total: 0, detail: []}; }

  // ─── ALIGNEMENT ACTIF (25/08/26) — remplace l'ancienne « activation » ───
  // Barème calé sur l'amplitude précédente (±5) : 0 ligne active compatible
  // = −5, une = 0, deux = +5.
  const align = alignementActifV7(fig, house);
  const activation = align.nb === 2 ? 'alignée (2 lignes)'
    : align.nb === 1 ? 'partielle (1 ligne)' : 'non alignée';
  const scoreActivation = BAREME_ALIGNEMENT_V7[align.nb] * POIDS_PROFIL_V7.activation;

  const natale = etatMaisonNatale(fig, theme);

  const parts = {
    concordance: base.concordance * POIDS_PROFIL_V7.concordance,
    deplacement: DEPLACEMENT_BONUS_V7[base.deplacement],
    multiplicite: Math.min(base.multiplicite, 4) * POIDS_PROFIL_V7.multiplicite,
    environnement: env.total * POIDS_PROFIL_V7.environnement,
    cohabitation: cohab.score * POIDS_PROFIL_V7.cohabitation,
    activation: scoreActivation,
    maisonNatale: natale.score * POIDS_PROFIL_V7.maisonNatale
  };
  const total = Object.keys(parts).reduce(function(s, k){ return s + parts[k]; }, 0);

  const sortieP = {
    fig: fig, house: house,
    elemFig: base.elemFig, elemMaison: base.elemMaison, natif: base.natif,
    concordance: base.concordance,
    multiplicite: base.multiplicite,
    environnement: env.total,
    environnementDetail: env.detail,
    deplacement: base.deplacement,
    cohabitation: cohab,
    activation: activation,
    alignement: align,
    maisonNatale: natale,
    parts: parts,
    total: Math.round(total * 100) / 100,
    forceSimple: base.score
  };
  if (memoP) { memoP[cleP] = sortieP; return Object.assign({}, sortieP); }
  return sortieP;
}

// Profil d'une figure sur TOUT le thème : une entrée par maison occupée
// (base ou résultante), plus la meilleure d'entre elles. Une figure
// absente renvoie present:false — c'est un fait, pas une erreur.
function profilFigureTheme(fig, theme, siegeImpose) {
  if (!fig) return {fig: fig, present: false, occurrences: [], meilleur: null};
  const occ = trouverFigV7(fig, theme);
  if (siegeImpose && !occ.some(function(o){ return o.pos === siegeImpose; })) {
    occ.push({pos: siegeImpose, hidden: false});
  }
  if (!occ.length) return {fig: fig, present: false, occurrences: [], meilleur: null};
  const profils = occ.map(function(o){
    const p = profilFigureMaison(fig, o.pos, theme);
    p.enResultante = !!o.hidden;
    return p;
  });
  let meilleurLibre = profils[0];
  profils.forEach(function(p){ if (p.total > meilleurLibre.total) meilleurLibre = p; });

  // CORRIGÉ (24/08/26) : quand un siège est imposé — c'est le cas de R1 et
  // R7, que la rotation place en hR1/hR7 — c'est CE profil qui fait foi,
  // pas le meilleur du thème. Sans ce garde-fou, Puer (R1, siège M11)
  // était analysé en M5 et Conjunctio (R7, siège M1) en M14 : tout le
  // réseau se construisait sur une position que le chef n'occupe pas au
  // titre du duel. meilleurLibre reste exposé pour la lecture.
  const siege = siegeImpose ? profils.filter(function(p){ return p.house === siegeImpose; })[0] : null;
  const meilleur = siege || meilleurLibre;

  return {fig: fig, present: true, occurrences: profils,
    meilleur: meilleur, meilleurLibre: meilleurLibre, siege: siege,
    nbBase: profils.filter(function(p){ return !p.enResultante; }).length,
    nbResultante: profils.filter(function(p){ return p.enResultante; }).length};
}

// Réseau des trois pôles d'UNE figure, chaque pôle profilé à son tour.
// C'est le « développe le réseau de chaque figure des trois pôles ».
function reseauTroisPolesV7(fig, theme, siegeImpose) {
  if (!fig) return null;
  const antagoniste = ANTAGONISTES_V7[fig];
  const protecteur = PROTECTEURS_V7[fig];
  const front = FRONT_V7[fig];
  const menace = protecteur ? ANTAGONISTES_V7[protecteur] : null;
  return {
    fig: fig,
    soi: profilFigureTheme(fig, theme, siegeImpose),
    antagoniste: {fig: antagoniste, profil: profilFigureTheme(antagoniste, theme)},
    protecteur: {fig: protecteur, profil: profilFigureTheme(protecteur, theme)},
    menaceProtecteur: {fig: menace, profil: profilFigureTheme(menace, theme)},
    front: {fig: front, profil: profilFigureTheme(front, theme)},
    resistance: analyserResistanceV7(fig, theme)
  };
}

// ═══════════════════════════════════════════════════════════════
// ANCRAGE DÉVELOPPÉ (24/08/26, révision Ellemine_D de la méthode).
// Sept figures clés, chacune avec son réseau à trois pôles entièrement
// profilé : les deux chefs, leurs DEUX antagonistes, leurs DEUX binômes,
// et la figure X = R1 + R7.
// Reproche corrigé : l'ancienne méthode réduisait antagoniste et binôme
// à un booléen présent/absent et ne profilait jamais X ni les pôles
// eux-mêmes. Ici chaque figure du réseau est mesurée sur les six
// dimensions (profilFigureMaison), et X est pesée pour savoir de quel
// côté elle penche.
// ═══════════════════════════════════════════════════════════════
// ─── RÈGLE ELLEMINE (24/08/26) : LA SOLIDITÉ DE LA CHAÎNE PRIME ───
// « la solidité de la chaîne prime sur la force d'installation ».
// La force d'installation (concordance, déplacement, multiplicité) dit à
// quel point une figure est bien LOGÉE. Elle ne dit rien de ce qu'elle
// produit : sur le cas réel 6-1, Conjunctio était la mieux installée et
// Puer a gagné. Ce qui distinguait vraiment les deux camps, c'est que la
// chaîne de protection de Puer tenait EN BASE aux deux maillons, quand
// celle de Conjunctio avait son front en résultante.
//
// Les deux maillons alliés de la chaîne sont exactement les deux autres
// pôles de la doctrine : le PROTECTEUR (neutralise l'antagoniste direct)
// et la FIGURE DE FRONT (protège le protecteur de sa propre menace).
// Un maillon en base est ancré ; en résultante seule il est fragile ;
// absent, la chaîne est percée.
// ⚠️ Barème proposé, calé sur un seul cas réel — à revoir dès qu'un
// résultat le contredit.
//
// ═══════════════════════════════════════════════════════════════
// CAS DE RÉFÉRENCE — RÉSULTATS RÉELS ARCHIVÉS (24/08/26, Ellemine_D)
// ═══════════════════════════════════════════════════════════════
// LOI DE LA RÉSULTANTE (26/08/26) — analyse d'Ellemine_D sur M1 et M2,
// vérifiée puis généralisée aux 16 maisons.
//
// ─── SON VOCABULAIRE, DÉCODÉ SANS AMBIGUÏTÉ ───
// « figure maison X » = figure dont la MAISON DE REPOS est d'élément X.
// Ses quatre listes de M2 le fixent exactement :
//   maison feu   = Puer, Via, Fortuna Minor, Cauda Draconis   (repos M1,5,9,13)
//   maison air   = Laetitia, Amissio, Carcer, Puella          (repos M2,6,10,14)
//   maison eau   = Caput Draconis, Rubeus, Conjunctio, Acquisitio (repos M3,7,11,15)
//   maison terre = Albus, Tristitia, Fortuna Major, Populus   (repos M4,8,12,16)
// Autrement dit : les quatre groupes sont les classes de l'index de
// repos MODULO 4. Ce n'est pas l'élément propre de la figure — les deux
// découpages diffèrent sur 12 figures sur 16.
//
// ─── SES RÈGLES, VÉRIFIÉES 16/16 CHACUNE ───
// M1 : feu → le binôme de son antagoniste (décalage −1 ; sa formulation
//        « la figure dont elle est l'antagoniste du front » est le même
//        décalage, les translations commutent)
//      air → SON ANTAGONISTE          eau → celle dont elle est l'antagoniste
//      terre → l'antagoniste de son front (décalage +1)
// M2 : eau et terre  → SON BINÔME
//      feu et air    → celle dont elle est le binôme
// Les huit énoncés sont exacts, aucune exception.
//
// ─── CE QUE LA GÉNÉRALISATION AJOUTE, ET CORRIGE ───
// Son découpage mod 4 est uniforme sur 8 maisons seulement :
//   M1, M2, M7, M8, M9, M10, M15, M16.
// Sur les huit autres (M3, M4, M5, M6, M11, M12, M13, M14) chaque groupe
// se scinde en deux moitiés qui reçoivent des rôles différents.
// L'invariant exact est MODULO 8, et il vaut sur les 16 maisons :
//     le rôle de la résultante ne dépend que de (index mod 8, maison).
//
// ─── LA RACINE ALGÉBRIQUE ───
// combine() est un OU EXCLUSIF ligne à ligne (impair = 1, pair = 0) —
// vérifié 256/256 — et Populus en est le neutre, 16/16. Donc
//     résultante(f, h) = f ⊕ figure de repos de h.
// Et figure[i] ⊕ figure[i+8] = TRISTITIA pour les huit valeurs de i.
// Tristitia est donc l'élément qui décale l'index de 8 : deux figures
// distantes de 8 sur le cycle subissent le même décalage dans TOUTE
// maison. C'est de là que vient la période 8, et rien d'autre.
// (Les quatre relations, elles, ne sont PAS des ⊕ par une constante —
// vérifié : aucune des quatre. Elles sont des translations de l'index,
// ce qui est une structure différente. C'est cette double structure —
// ⊕ pour la résultante, translation pour les rôles — qui produit toute
// la richesse de la table.)
//
// ─── LOI DE PARITÉ, 256/256 ───
// maison IMPAIRE → décalage IMPAIR · maison PAIRE → décalage PAIR.
// Conséquence directe et forte :
//   · une figure ne peut régénérer un pôle ALLIÉ — binôme (+2), front
//     (+4), bouclier (+10) — QUE dans une maison PAIRE : M2, M4, M6,
//     M10, M12, M14, huit figures chaque fois.
//   · elle ne peut régénérer son ANTAGONISTE (+13) QUE dans une maison
//     IMPAIRE : M1×4, M3×4, M5×2, M11×4, M13×2.
// Les maisons paires régénèrent l'alliance, les impaires le conflit.
//
// ─── LES QUATRE MAISONS « PURES » ───
// Huit figures sur seize y régénèrent le même pôle :
//   M2  → SON BINÔME      M4  → SON FRONT
//   M10 → SON BOUCLIER    M12 → SON FRONT
// Le front ne se régénère QUE en M4 et M12, nulle part ailleurs.
// ⚠️ CONVERGENCE À NOTER : la règle « BTTS 100 % » d'Ellemine_D, écrite
// bien avant cette analyse, lit exactement M4 et M10 — c'est-à-dire la
// maison du front et la maison du bouclier. Il avait trouvé les deux
// maisons pures des pôles défensifs sans passer par la table.
//
// ─── POIDS SUR LE VERDICT : MESURÉ, ET NUL POUR L'INSTANT ───
// Test direct : « la figure centrale régénère-t-elle un pôle allié à son
// siège ? » Sur les sept cas au score connu — 1 juste, 2 faux, 4 muets.
// ⚠️ Et il est AVEUGLE là où il faudrait qu'il voie : Fiorentina (0-2
// pour R7) et Atalanta (4-0 pour R1) ont la MÊME rotation, les mêmes
// centrales aux mêmes sièges — Tristitia M7 → +7 et Albus M13 → +5 dans
// les deux cas. Le critère est rigoureusement identique sur deux thèmes
// aux résultats opposés. Il ne peut donc pas les départager.
// Fréquence : la centrale régénère un pôle allié sur 18,8 % des couples,
// son antagoniste sur 6,3 %, rien de nommé sur 43,8 %.
//
// CE QUE CETTE LOI SERT VRAIMENT, EN L'ÉTAT : elle dit que la résultante
// n'est PAS une information indépendante. résultante(h) = base(h) ⊕
// repos(h) : pour qu'une figure X paraisse en résultante en h, il faut
// et il suffit que la base de h soit X ⊕ repos(h) — une seule figure.
// Compter « présence en base + en résultante » comme deux témoignages
// revient donc à compter deux fois la même donnée sous deux angles.
// C'est un point à trancher avec Ellemine_D avant d'y toucher : le
// calcul actuel les additionne partout (soliditeChaineV7, forceCampV7,
// les trois fonctions de validité).
// ═══════════════════════════════════════════════════════════════
// ─── NOMS DES CAS DE RÉFÉRENCE (26/08/26, demande d'Ellemine_D) ───
// Les cas portaient les lettres A à I. Remplacées par des noms de clubs
// italiens, dans l'ordre d'entrée dans l'archive — les lettres seules
// devenaient illisibles à neuf cas :
//   Juventus = A · Inter = B · Milan = C · Napoli = D · Roma = E
//   Lazio = F · Fiorentina = G · Atalanta = H · Torino = I
// Ce sont des ÉTIQUETTES, sans rapport avec les équipes réelles des
// matchs.
//
// ⚠️ 27/08/26 — CES CAS SONT MAINTENANT DES DONNÉES : CAS_REFERENCE_V7,
// rejouées par bancMoteursV7() et affichées par renderBancPanel().
// Les notes ci-dessous restent le journal du raisonnement, mais LES
// CHIFFRES DE JUSTESSE QUI Y FIGURENT SONT DATÉS : seul le banc dit
// l'état courant. Motif : le 26/08 un changement d'échelle dans
// forceCampV7 a fait tomber chaîne, ancrage et duel de 5/7 à 3–4/7, et
// les panneaux ont continué d'afficher 5/7 pendant deux commits. Attention en relisant le code : « camp A », « équipe B »,
// « boucle A/B », « voie A », « axe D », « Bloc B », « B-B-A » et
// « F.Minor » gardent leur sens d'origine et n'ont pas été renommés.
// Les trois seuls thèmes de cette session dont le score réel est connu.
// Toute modification des règles de verdict doit être retestée contre eux.
//
//  Juventus — Conjunctio · Rubeus · Cauda Draconis · Acquisitio      RÉEL 6-1 (R1)
//     R1 = Puer (M11) · R7 = Conjunctio (M1) · même boucle
//     chaîne 10 vs 9,25 → R1 ✅   sièges 🟧+3 vs 🟨 0 → R1 ✅
//     réseau d'ancrage → R7 ✗ (installation 8 vs 4,5 : Conjunctio est
//       mieux logée, Puer gagne le match — c'est ce cas qui a établi que
//       la solidité de chaîne prime sur la force d'installation)
//     Structure du Nul s'était déclenchée et imposait le nul ✗
//
//  Inter — Puella · Via · Conjunctio · Via                        RÉEL 3-2 (R1)
//     R1 = Laetitia (M14) · R7 = Via (M4)
//     chaîne 6 vs 5,25 → R1 ✅   sièges 🟦+15 vs 🟧+3 → R1 ✅
//     réseau d'ancrage → R1 ✅
//     Cas décisif sur DEUX points : (1) les deux chaînes sont des images
//     miroir exactes (R1 protecteur en résultante + front en base ; R7
//     l'inverse) — aucun barème symétrique ne les départage, d'où le
//     poids supérieur du front ; (2) le siège de R1 est en M14, une
//     maison dont le texte parle du camp B alors que R1 est le camp A —
//     R1 ayant gagné, c'est L'OCCUPANT qui prime sur la maison dans la
//     lecture des sièges.
//     Troisième point, réglé le 25/08 : ici R1 (Laetitia) EST l'antagoniste
//     direct de R7 (Via), et Acquisitio est à la fois antagoniste de R1 et
//     protecteur de R7. Ce cumul de rôles est NORMAL (cf. rolesDeLaFigureV7)
//     et n'annule aucun des deux : toutes les dimensions chiffrées donnaient
//     R7, R1 a gagné. Lecture retenue — être attaqué n'empêche pas de
//     frapper, un pôle tenu garde son plein effet.
//
//  Milan — Tristitia · Via · Conjunctio · Rubeus                  RÉEL 7-0 (R1)
//     R1 = Fortuna Minor (M8) · R7 = Carcer (M14)
//     chaîne 8 vs 7,25 → R1 ✅   sièges 🟧+3 vs 🟥−15 → R1 ✅
//     réseau d'ancrage → R1 ✅
//     ⭐ SEULE PRÉDICTION HORS ÉCHANTILLON : la chaîne a été calculée et
//     annoncée AVANT que le score soit connu. C'est ce qui distingue ce
//     cas des deux autres, sur lesquels le barème a été calé.
//     L'Axe Succédent imposait le nul ✗ — motif du débranchement.
//
// MISE À JOUR 25/08 — LES DEUX CÔTÉS DES RÔLES SONT BRANCHÉS.
// ancrage = solidité de chaîne + rôles REÇUS + rôles EXERCÉS.
//   reçus   : scoreRolesRecusV7   — les 4 pôles du chef (X+10, X+4, X+2, X−3)
//   exercés : scoreRolesExercesV7 — ce que le chef fait à X−10, X−4, X−2, X+3
// Les deux ensembles sont DISJOINTS : 0 figure commune sur 64 (vérifié sur
// les 16 figures). Peser les reçus ne disait donc rien du côté actif — c'est
// la correction signalée par Ellemine_D (« tu ne l'as pas branché »).
//
// Effet cumulé sur les trois cas, marge de R1 :
//   Juventus 6-1 : 0,75 → 0,75 (reçus à égalité) → 0,63 (exercés) → R1 ✅
//   Inter 3-2 : 0,75 → 0,25 (reçus contre R1)  → 1,00 (exercés) → R1 ✅
//   Milan 7-0 : 0,75 → 1,75 (reçus pour R1)    → 1,75 (exercés à égalité) → R1 ✅
// Le côté actif RÉPARE le cas Inter, que le côté reçu avait ramené à 0,25.
//
// ⚠️ Ce que la mesure a écarté : compter les rôles exercés sur N'IMPORTE
// QUI donne 1/3 — dans les cas Juventus et Inter, R7 exerce plus de rôles effectifs
// que R1, et R1 a gagné les deux. Cela ne mesurait que la population du
// thème. Seuls les rôles touchant le camp adverse comptent, et le barème
// tient 3/3 pour tout k de 0,5 à 1,5 — c'est le réglage le plus stable
// des cinq essayés.
// ⚠️ Les rôles reçus SEULS donneraient 1/3 : les trois couches se
// complètent, aucune ne remplace les autres.
//
//  Napoli — Conjonctio · Fortuna Minor · Via · Albus              RÉEL 0-1 (M7)
//     R1 = Laetitia (M11) · R7 = Conjonctio (M1)
//     ⚠️ SEUL CAS OÙ LE SYSTÈME SE TROMPE DE CAMP : il annonce M1 4-2
//     avec un ancrage écrasant (10,75 contre −0,25), le réel est 0-1 pour
//     M7. Retrouvé le 25/08 dans un commentaire du fichier (« chaîne R1
//     interceptée par la boucle de R7 »), il n'était pas consigné ici.
//     C'est le contre-exemple le plus utile de l'archive : la chaîne de
//     R7 y est PERCÉE (total −1) et R7 gagne quand même.
//
//  ⚠️ CAS RETIRÉ DE L'ARCHIVE LE 29/08/26 (ni score ni vainqueur). Les
//  lignes qui suivent restent le journal du raisonnement de l'époque,
//  mais Lazio ne compte plus dans aucune mesure du banc.
//  Lazio — Fortuna Minor · Amissio · Carcer · Carcer     LES DEUX ONT MARQUÉ
//     R1 = R7 = Conjonctio (M9 et M15) — cas où les deux sièges portent la
//     MÊME figure (5,1% des thèmes). Score exact non communiqué.
//     ⭐ PREMIER TEST EN AVEUGLE de la règle d'ouverture depuis son
//     branchement, et elle le RATE : lue sur la rotation elle annonce
//     « un seul marque » (R1 Conjonctio en M9 fermée et inactive), alors
//     que les deux ont marqué. La lecture FIXE, elle, voit juste :
//     M1 Fortuna Minor fermée mais ACTIVE → marque, M7 Rubeus OUVERTE →
//     marque. La seconde lecture (perdant muet) rate aussi.
//     CONSÉQUENCE : le compte passe de 4/5 contre 3/5 en faveur de la
//     rotation à 4/6 PARTOUT — les deux cadres sont à égalité et le choix
//     n'est plus soutenu par les données. Voir BTTS_CADRE.
//
//  Roma — Fortuna Minor · Acquisitio · Carcer · Albus            RÉEL 1-1 (nul)
//     R1 = Carcer (M10) · R7 = Fortuna Major (M4)
//     Retrouvé le 25/08 dans renderRegressionReference, où la clé portait
//     « aquisitio » au lieu d'« acquisitio » : la référence ne pouvait
//     jamais se déclencher. Faute de frappe corrigée le 25/08.
//     Seul vrai NUL de l'archive consignée — précieux pour l'étude de
//     l'Axe Succédent, restée en suspens.
//
//  Fiorentina — Rubeus · Puer · Fortuna Minor · Caput Draconis        RÉEL 0-2 (M7)
//     R1 = Tristitia (M7) · R7 = Albus (M13)
//     ⭐ DEUXIÈME PRÉDICTION HORS ÉCHANTILLON de tout le projet, après Milan.
//     Analysé et annoncé AVANT qu'Ellemine_D donne le score.
//     Camp ✅ · « un seul marque » ✅ · chiffres du score ✗ (2-4 affiché).
//
//     Le thème le plus unanime rencontré jusqu'ici : ancrage, chaîne,
//     rôles reçus, rôles exercés, sièges, axes ET duel du bouclier
//     donnent TOUS R7, sans une dissidence.
//         ancrage −10,44 contre +10,13, soit un écart de 20,57 —
//         plus du double du cas Milan (1,75), qui était déjà un 7-0.
//
//     CE QUI LE REND SI NET — la chaîne de R1 n'existe pas. Ni Laetitia
//     (son bouclier) ni Fortuna Major (son front) ne sont dans le thème,
//     ni en base ni en résultante. Chaîne −7,5, percée des deux côtés.
//     Aucun autre cas de l'archive ne présente ça.
//     Et le front de R7 EST Tristitia, c'est-à-dire R1 elle-même : le
//     pôle le plus avancé d'Albus pointe le cœur adverse.
//
//     DUEL DU BOUCLIER — le bouclier absent de R1 est assailli par
//     Acquisitio, SIX occurrences (M2r conc 1 · M4r · M6r conc 1 · M7r
//     0,25 · M8 base · M9r 0,5) plus Puer en M2 et M14 : 8,75 contre 4
//     pour un front absent réduit à son seul binôme Puella. ROMPU
//     (−4,75), ce qui libère Via — laquelle est en M15 eau en eau,
//     concordance 1, alignement 2, sa position la plus forte possible.
//     Côté R7 le bouclier Puella TIENT (+1,75).
//
//  Atalanta — Rubeus · Tristitia · Laetitia · Via                    RÉEL 4-0 (R1)
//     R1 = Tristitia (M7) · R7 = Albus (M13) — MÊME ROTATION QUE Fiorentina.
//     ⚠️ PREMIER CAS D'ARBITRAGE DE L'ARCHIVE : les couches se divisent.
//         ancrage  R1 (9 contre 3,76)      duel du bouclier  R7 (−4,25 / +2)
//         chaîne   R1 (9,25 contre 3)      sièges            R7 (🟥−15 / 🟦+15)
//                                          axes              R7 (1 contre 2)
//     Verdict affiché AVANT le score : M1 4-2, un seul marque.
//     ⭐ TROISIÈME PRÉDICTION HORS ÉCHANTILLON, après Milan et Fiorentina.
//     Camp ✅ · « un seul marque » ✅ · le camp MUET ✅ (R7) ·
//     et pour la première fois un CHIFFRE juste : M1 = 4, exactement.
//     Le second chiffre reste faux (2 affiché, 0 réel).
//
//     CE QU'IL A TRANCHÉ. Sur les cinq cas précédents, ancrage, chaîne,
//     duel et sièges faisaient TOUS 4/5 — indiscernables, jamais mis en
//     désaccord sur un cas réel. Ici ils se divisaient 2 contre 3, et
//     c'est le groupe minoritaire qui avait raison :
//         ancrage 5/6 · chaîne 5/6 · duel CORRIGÉ 5/6
//         duel brut 4/6 · sièges 4/6 · axes 3/6
//     Les sièges et les axes, qui menaient encore 4/5, décrochent. Ils
//     redisaient R7 par pur automatisme : les sièges d'Atalanta sont ceux de Fiorentina
//     (M7 🟥, M13 🟦), et ils ne voient pas que la chaîne s'est inversée
//     entre les deux thèmes. Leur signal est celui du siège, pas du camp.
//
//     C'est presque le miroir de Fiorentina. Les sièges sont les mêmes (M7 🟥 et
//     M13 🟦) donc sièges et axes redisent R7. Ce qui a changé, c'est la
//     chaîne : dans Fiorentina le bouclier ET le front de R1 étaient absents du
//     thème (chaîne −7,5) ; ici les deux sont là (Laetitia M3 M16,
//     Fortuna Major M5 M6r → chaîne 9,25). Et c'est R7 qui est percée,
//     son bouclier Puella étant absent. Deux thèmes, mêmes sièges,
//     chaînes inversées.
//
//     ⚠️ IL ARBITRE AUSSI UNE FAILLE DU DUEL DU BOUCLIER, repérée ici :
//     duelBouclierV7 compare l'assaillant au front SANS VÉRIFIER QUE LE
//     BOUCLIER EXISTE. Sur ce thème, le bouclier de R7 (Puella) est
//     absent du thème, et le duel est pourtant déclaré TENU (+2) — on
//     défend un bouclier qui n'est pas là. Variante « bouclier absent =
//     rompu d'office » : identique sur les cinq cas connus (4/5, le cas
//     ne se présentait que dans Fiorentina, où les deux concluent pareil), mais elle
//     INVERSE ce thème-ci — R1 au lieu de R7. Non branchée en attendant
//     le résultat, qui la tranchera aussi.
//
//     ⚠️ ET UNE CONTRADICTION INTERNE DU BTTS, TRANCHÉE. Les deux lectures
//     disaient « un seul marque » en désignant des muets OPPOSÉS :
//        lectureDeuxMarquentV7   → le muet est Albus (R7)
//        lectureOuvertureButsV7  → le muet est Tristitia (R1)
//     Réel 4-0 pour R1 : c'est R7 qui est resté muet. La CHAÎNE avait
//     raison. Sur les huit cas au BTTS connu, chaîne 7/8 contre rotation
//     6/8 ; et sur les quatre cas à camp muet, nommer le bon muet donne
//     chaîne 3/4 contre rotation 1/4. BTTS_CHAINE_DECISIF passe à true.
//
//  Torino — Via · Rubeus · Via · Tristitia                        RÉEL 0-1 (R7)
//     R1 = Amissio (M5) · R7 = Rubeus (M11) — thème VALIDE (3 axes).
//     ANNONCÉ M1, un seul marque, muet = R7. RÉEL : R7 GAGNE 1-0.
//     Camp ✗ · « un seul marque » ✅ · camp muet ✗ (c'est R1 qui est muet).
//
//     LE CAS QUI CASSE LA HIÉRARCHIE. Les trois couches à 5/6 — ancrage,
//     chaîne, duel corrigé — disaient toutes R1. Les deux couches
//     « faibles » — sièges et axes — disaient R7. Ce sont elles qui
//     avaient raison. Après Torino, TOUT EST À ÉGALITÉ :
//         ancrage 5/7 · chaîne 5/7 · duel corrigé 5/7
//         duel brut 5/7 · sièges 5/7 · axes 4/7
//     ⚠️ 5/7 sur sept cas ne se distingue pas d'un tirage à pile ou face
//     (p ≈ 0,23). Le camp n'est PAS une capacité démontrée du système.
//     Il faut le dire ainsi tant qu'on n'a pas beaucoup plus de cas.
//
//     CE QUE LE THÈME MONTRAIT, ET QUI ÉTAIT TROMPEUR. R7 Rubeus était
//     amputé de deux pôles sur trois — bouclier Puer et front Conjunctio
//     tous deux ABSENTS du thème, binôme Fortuna Minor en résultante
//     seule (M2r), chaîne −7,5. C'est la signature exacte du camp perdant
//     du cas Fiorentina (chaîne −7,5 lui aussi, réel 0-2). Ici le même profil a
//     GAGNÉ. Une chaîne détruite ne suffit donc pas à faire perdre.
//     R1 Amissio n'était guère mieux : front Carcer absent, bouclier
//     Populus présent en M15 mais feu en eau, concordance 0, alignement
//     0 — présent et inutile.
//
//     ⚠️ LA CORRECTION « BOUCLIER ABSENT = ROMPU » EST NEUTRALISÉE.
//     Elle avait fait passer le duel de 4/6 à 5/6 en redressant Atalanta. Sur Torino
//     elle fait l'inverse : le bouclier de R7 est absent, elle force donc
//     le duel à R1, alors que le duel BRUT donnait R7 — le bon camp.
//         duel brut 5/7   ·   duel corrigé 5/7
//     Gain sur Atalanta, perte sur Torino, solde nul. Elle reste en place parce que
//     l'argument de doctrine tient (on ne défend pas un bouclier absent)
//     et qu'elle n'entre dans aucun verdict — COEF_BOUCLIER_ROMPU_V7
//     vaut toujours 1 — mais elle n'est plus soutenue par les chiffres.
//
//     ⚠️ LE BTTS, LUI, TIENT. Sur Torino, chaîne NON et rotation OUI : la
//     chaîne avait raison, un seul a marqué. Sur les neuf cas au BTTS
//     connu : chaîne 8/9 · rotation 6/9 · « toujours oui » 4/9. C'est
//     le seul endroit du système où l'écart au hasard est net.
//     En revanche NOMMER LE MUET reste faible, chaîne 3/5, et l'erreur
//     est mécanique : lectureDeuxMarquentV7 déclare muet le PERDANT
//     désigné par l'ancrage. Si le camp est faux, le muet l'est aussi.
//     Les deux ne sont pas indépendants — le 8/9 porte sur « un seul
//     marque », pas sur « lequel ».
//
//     ⚠️ VÉRIFIÉ, IL N'Y A PAS DE BIAIS R1/R7. Sur 2114 thèmes tirés :
//     ancrage 49,2/50,8 · chaîne 49,2/50,8 · duel 48,3/51,7 · sièges
//     50,1/49,9. Les erreurs groupées sur R1 (Napoli et Torino) sont un hasard
//     d'échantillon, pas un penchant du calcul.
//
// ─── HYPOTHÈSE NÉE DE Atalanta, NON BRANCHÉE ───
// Ancrage et duel corrigé sont tous deux à 5/6, et leurs erreurs sont
// COMPLÉMENTAIRES : l'ancrage rate Napoli, le duel rate Juventus. Une règle les
// réconcilie à 6/6 :
//     « si les DEUX boucliers sont rompus, le duel décide ; sinon
//       l'ancrage décide »
//   Juventus tenu/tenu → ancrage R1 ✓ · Inter tenu/rompu → ancrage R1 ✓
//   Milan tenu/rompu → ancrage R1 ✓ · Napoli ROMPU/ROMPU → duel R7 ✓
//   Fiorentina rompu/tenu → ancrage R7 ✓ · Atalanta ROMPU/ROMPU → duel R1 ✓
// ⚠️ NE PAS LA BRANCHER EN L'ÉTAT. Elle ne se déclenche que sur Napoli et Atalanta,
// et sur Atalanta elle dit la même chose que l'ancrage. Son seul apport réel
// sur l'échantillon est de corriger UN cas, Napoli. Une règle trouvée en
// regardant les six cas, confirmée par un seul, qui changerait 12,6 %
// de tous les verdicts (elle se déclenche sur 32,5 % des thèmes) : c'est
// la définition d'un surajustement. À tester sur des cas à venir où les
// deux boucliers sont rompus.
// ── SUITE, CAS Torino (26/08) : elle s'est déclenchée, et elle a ÉCHOUÉ.
// Les deux boucliers étaient rompus, elle a donc suivi le duel corrigé,
// qui disait R1 — même réponse que l'ancrage, et R7 a gagné. Elle passe
// à 6/7, toujours devant l'ancrage à 5/7, mais son unique cas
// discriminant reste Napoli, et elle vient d'encaisser son premier échec.
// Elle reste NON BRANCHÉE, et l'écart 6/7 contre 5/7 tient à un seul
// cas — c'est du bruit, pas une preuve.
//
//     Thème NON VALIDE : la résultante de l'axe Cadent (Populus) est
//     absente. Cardinal et Succédent passent (Puer présent).
//
//  Bologna — Laetitia · Rubeus · Carcer · Carcer            RÉSULTAT ATTENDU
//     R1 = Rubeus (M2) · R7 = Fortuna Major (M8) — thème NON VALIDE
//     (résultante de l'axe Cardinal, Tristitia, absente).
//     ANNONCÉ : M7 gagne, un seul marque, muet = R1.
//
//     UNANIMITÉ TOTALE, la première depuis Fiorentina : ancrage, chaîne,
//     duel, sièges et les TROIS axes donnent R7. Écart d'ancrage −15, le
//     deuxième de l'archive après Fiorentina (−20,6).
//     R1 Rubeus a bouclier (Puer) ET front (Conjunctio) absents du thème,
//     chaîne −6. R7 garde son front Populus, présent CINQ fois.
//
//     ⚠️ LA RÉSERVE, ET ELLE EST SÉRIEUSE. C'est la signature exacte de
//     Torino : là aussi Rubeus avait bouclier et front absents (chaîne
//     −7,5) — et ce camp-là a GAGNÉ 1-0. La différence tient à ce que
//     dans Torino les couches se divisaient 3 contre 2, sièges et axes
//     tenant le bon camp contre les autres ; ici il n'y a aucune dissidence.
//     Si Bologna se termine en faveur de R1, la leçon serait qu'une
//     chaîne doublement percée n'est PAS un signe de défaite, même quand
//     tout le reste concorde — et il faudra revoir POIDS_CHAINE_V7.
//
//     ⚠️ LE SEUL SIGNAL QUI POINTE VERS R1 vient de la loi de la
//     résultante : R1 Rubeus siège en M2, la maison PURE du binôme, et y
//     régénère son propre binôme Fortuna Minor — la meilleure
//     régénération possible à un siège. R7 Fortuna Major en M8 n'y
//     régénère que son opposée, Albus. Mais ce critère est mesuré NON
//     prédictif (1 juste, 2 faux, 4 muets sur les sept cas) et aveugle
//     sur Fiorentina/Atalanta. Il est noté, pas compté.
//
//     Les quatre maisons pures sont toutes « remplies » dans ce thème :
//     M2 Rubeus → son binôme · M4 Carcer → son front · M10 Populus →
//     son bouclier · M12 Fortuna Major → son front. Cas rare, à observer.
//
//     Signal de nul : 2 axes sur 4 montrent des témoins opposés.
//
// ─── CE QUE LE CAS Fiorentina ARBITRE, ET CE QU'IL N'ARBITRE PAS ───
//  · BTTS — la lecture actuelle passe à 6/7 (elle ne rate que Lazio), contre
//    4/7 pour « répondre toujours OUI ». Avant Fiorentina le compte était 5/6
//    contre 4/6, soit un avantage négligeable. Fiorentina est le premier cas qui
//    creuse un écart réel : la lecture par la rotation vaut mieux que la
//    constante. Le duel du bouclier en critère BTTS reste à 4/7.
//  · CAMP — n'arbitre RIEN entre ancrage et duel du bouclier. Les deux
//    passent à 4/5, et ils sont d'accord sur Fiorentina. Ils continuent de se
//    contredire sur Juventus et Napoli, chacun en gagnant un. COEF_BOUCLIER_ROMPU_V7
//    reste donc à 1.
//  · SCORE — toujours 0/6 en exact. Sur Fiorentina l'écart de buts affiché est
//    juste (M7 +2, réel M7 +2) mais c'est sans valeur : le moteur rend
//    ±2 sur les six cas, c'est une constante, pas une prédiction.
//
// BILAN : solidité de chaîne 3/3 · lecture des sièges 3/3 ·
//         réseau d'ancrage 2/3 · règles de nul 0/2 (elles se sont
//         déclenchées sur un 6-1 et un 7-0).
// ⚠️ Chaîne et sièges concordent sur ces trois cas, mais divergent sur
// 46% des thèmes tirés au hasard (mesuré sur 4000). Leur hiérarchie
// n'est donc PAS établie : il faut des résultats réels sur des thèmes où
// elles se contredisent. Le désaccord est signalé sur la carte.
// ⚠️ SUR LES SIX CAS, le camp affiché est juste 4/6 (Napoli et Roma ratés).
// L'ancrage seul, lui, est à 4/5 sur les cas départageables — Napoli reste
// son seul raté, Fiorentina confirmant le camp au plus large écart de l'archive.
// ⚠️ « LES DEUX MARQUENT » — BRANCHÉ LE 25/08 SUR LA ROTATION.
// Le BTTS est désormais rendu par lectureOuvertureButsV7 : une figure
// ouverte ou active aux DEUX SIÈGES R1/R7 = les deux marquent.
//   avant : 3/5, et « oui » sur 91% des thèmes (soit un oui constant)
//   après : 4/5, et « oui » sur 47% — proche du taux réel du BTTS
// ⚠️ RÉVISÉ APRÈS LE CAS Lazio : le cadre de rotation menait 4/5 contre 3/5,
// c'est ce qui avait motivé « oriente sur la rotation ». Le cas Lazio, premier
// test en aveugle, a inversé le compte : 4/6 pour les deux cadres. Le
// choix n'est plus soutenu par les données, et les deux cadres divergent
// sur 40% des thèmes. Les deux sont désormais affichés à chaque thème.
// Débranchées du verdict, toujours affichées : BTTS 100% et défavorisé
// (M4/M10), 1/3 là où elles tirent sur les cas réels ; interrupteur
// BTTS_DOCTRINE_M4M10_DECISIVE pour les rebrancher.
// Écarté sur preuve négative : le bonus « Via/Acquisitio/Fortuna Minor en
// 5 ou 8 », qui rend Milan 7-0 et Napoli 0-1 faussement positifs.
// Toujours en place et fausse sur Inter : « Via en M4 → camp A ne marque pas ».
// Seconde lecture affichée en comparaison : lectureDeuxMarquentV7 (le
// perdant garde-t-il sa frappe), 5/5 mais AJUSTÉE sur ces cinq cas, donc
// moins probante que le 4/5 de la règle d'ouverture, qui ne l'est pas.
// Les deux ne s'accordent que sur 50% des thèmes.
// ⚠️ Le SCORE reste faux sur les trois (5-3 / 4-2 / 4-2 contre 6-1 /
// 3-2 / 7-0) : le camp est juste, le chiffre non. buildVerdictCard
// surestime le total et comprime l'écart.
// ═══════════════════════════════════════════════════════════════
//
// Barème : la présence EN BASE est catégoriquement plus forte qu'en
// résultante — deux résultantes ne valent jamais une base. Les
// occurrences supplémentaires ne font qu'épaissir un ancrage déjà acquis.
// Le FRONT pèse plus que le protecteur : c'est le maillon le plus avancé,
// celui qui reçoit la menace avant qu'elle ne se propage vers le chef —
// et c'est lui qu'Ellemine_D a singularisé en énonçant la règle
// (« fig de front, son absence pénalise la fig qui elle devrait être
// front »). Sur les deux cas réels connus, le camp dont le FRONT tient en
// base a gagné, y compris quand les deux chaînes étaient par ailleurs
// des images miroir (thème Puella/Via/Conjonctio/Via).
// ⚠️ Calé sur n = 2. Deux points de données pour deux paramètres : ce
// réglage peut n'être qu'une coïncidence, à réviser au prochain résultat.
var POIDS_CHAINE_V7 = {
  ancre: 3,          // maillon présent en base : ancrage acquis
  renfort: 1,        // chaque base supplémentaire
  resultante: 0.5,   // appoint d'une résultante quand la base est déjà là
  resSeule: 1,       // maillon présent en résultante seulement
  maillonAbsent: -3, // maillon manquant — chaîne percée
  poidsFront: 1.5    // le front pèse plus que le protecteur
};

// ═══════════════════════════════════════════════════════════════
// SOLIDITÉ ET LIBÉRATIONS EN CASCADE (25/08/26, doctrine Ellemine_D)
//
// Exemple fondateur donné par Ellemine_D (R1 = Puer, R7 = Laetitia),
// vérifié intégralement contre ANTAGONISTES_V7 — 13 relations sur 13 :
//
//   Chaîne offensive, par le binôme :
//     Caput Draconis (binôme de R1) détruit Amissio (front de R7)
//       -> Fortuna Minor libérée   (Amissio la tenait)
//         -> attaque Fortuna Major
//           -> Acquisitio libérée  (Fortuna Major la tenait)
//             -> détruit Laetitia = R7
//     En parallèle : Puer détruit directement Albus, binôme de R7.
//
//   Chaîne défensive, conditionnée par l'échappement :
//     Laetitia (R7) tient Via, le front de R1.
//     Si Via échappe à Laetitia :
//       Via détruit Tristitia
//         -> Conjunctio (protecteur de R1) n'est plus contrainte
//           -> Conjunctio détruit Puella, antagoniste direct de R1.
//
// PRINCIPE : ce n'est pas la PRÉSENCE d'un pôle qui compte, c'est sa
// DISPONIBILITÉ. Une figure de front présente mais tenue par son propre
// antagoniste est occupée à survivre : elle ne protège personne. Et
// détruire un maillon adverse LIBÈRE la figure qu'il tenait, laquelle
// libère la suivante — l'effet se propage le long du cycle.
//
// RÈGLES FIXÉES PAR ELLEMINE_D :
//  1. Une figure ne tient sa cible que si elle est présente ET SOLIDE :
//     dans sa maison de repos, ou concordante avec l'élément de la
//     maison qu'elle occupe. « Une figure au repos est plus solide que
//     celle qui déserte ou qui s'oppose à la maison occupée. »
//  2. La cascade se propage dans toute la boucle, jusqu'au chef.
//  3. Même hiérarchie que précédemment : la solidité prime.
// ⚠️ Doctrine nouvelle, non contre-testée sur l'archive.
// ═══════════════════════════════════════════════════════════════

// Seuil de PROFIL à partir duquel une figure « tient » sa maison. Le
// repos court-circuite ce seuil (forte par nature). ⚠️ valeur proposée.
var SEUIL_SOLIDITE_V7 = 0;

// Une figure est solide si l'une au moins de ses occurrences est en
// repos, ou concorde assez avec l'élément de sa maison. Absente = jamais
// solide. Présente mais partout discordante = elle déserte.
function figureSolideV7(fig, theme, siegeImpose) {
  if (!fig) return { solide: false, present: false, raison: 'figure inconnue' };
  let occ = trouverFigV7(fig, theme);
  if (!occ.length) return { solide: false, present: false, raison: 'absente du thème' };
  // Pour un chef, c'est le SIÈGE que la rotation lui assigne qui fait foi,
  // pas sa meilleure position ailleurs dans le thème — même correctif que
  // pour profilFigureTheme.
  if (siegeImpose) {
    const auSiege = occ.filter(function (o) { return o.pos === siegeImpose; });
    occ = auSiege.length ? auSiege : [{ pos: siegeImpose, hidden: false }];
  }

  // RÉVISÉ (25/08/26, Ellemine_D) : la solidité ne se juge plus sur un
  // test binaire (repos ou concordance ≥ 0,5) mais sur TOUS les niveaux —
  // déplacement, environnement, multiplicité, concordance, cohabitation,
  // activation, plus l'état de la maison natale. C'est exactement ce que
  // profilFigureMaison calcule déjà : on s'en sert plutôt que de garder
  // une seconde définition parallèle qui divergerait.
  // « Mais dans leur maison elles sont de nature forte, direct, car elles
  // sont chez elles » : le repos rend solide sans passer par le score.
  let meilleur = null;
  occ.forEach(function (o) {
    const pr = profilFigureMaison(fig, o.pos, theme);
    pr.enResultante = !!o.hidden;
    pr.enRepos = (FIGS_V7[o.pos - 1] === fig);
    if (!meilleur || pr.total > meilleur.total) meilleur = pr;
  });

  const enRepos = occ.some(function (o) { return FIGS_V7[o.pos - 1] === fig; });
  const solide = enRepos || meilleur.total >= SEUIL_SOLIDITE_V7;

  return {
    solide: solide, present: true, meilleure: meilleur, enRepos: enRepos,
    total: meilleur.total,
    raison: enRepos ? 'en repos en M' + meilleur.house + ' (forte par nature)'
      : solide ? 'profil ' + meilleur.total + ' en M' + meilleur.house
        + ' (concordance ' + meilleur.concordance + ', ' + meilleur.deplacement
        + ', ' + meilleur.activation + ', maison natale ' + meilleur.maisonNatale.statut + ')'
      : 'profil trop faible (' + meilleur.total + ' en M' + meilleur.house + ' — '
        + meilleur.deplacement + ', ' + meilleur.activation + ')'
  };
}

// Résolution des libérations sur tout le cycle d'antagonisme.
// X est TENUE si son antagoniste est présent, solide ET lui-même libre.
// X est LIBRE si son antagoniste est absent, faible, ou tenu.
// On part des figures dont l'antagoniste ne peut rien (ancres), puis on
// propage jusqu'au point fixe. Un cycle sans aucune ancre reste
// « indéterminé » — signalé plutôt que tranché arbitrairement.
function resoudreLiberationsV7(theme) {
  const etat = {};
  const solidite = {};
  FIGS_V7.forEach(function (f) { solidite[f] = figureSolideV7(f, theme); etat[f] = null; });

  let change = true, tours = 0;
  while (change && tours < 40) {
    change = false; tours++;
    FIGS_V7.forEach(function (f) {
      if (etat[f] !== null) return;
      const a = ANTAGONISTES_V7[f];
      if (!solidite[a].solide) { etat[f] = 'libre'; change = true; return; }
      if (etat[a] === 'tenue') { etat[f] = 'libre'; change = true; return; }
      if (etat[a] === 'libre') { etat[f] = 'tenue'; change = true; return; }
    });
  }
  const indetermines = FIGS_V7.filter(function (f) { return etat[f] === null; });
  return { etat: etat, solidite: solidite, indetermines: indetermines, tours: tours };
}

// Rapport de cascade pour les deux chefs — DIAGNOSTIC UNIQUEMENT.
// ⚠️ NON BRANCHÉ AU VERDICT, et c'est un choix mesuré : appliquer une
// pénalité aux pôles tenus fait basculer le cas de référence Inter (réel 3-2
// pour R1) du mauvais côté, quelle que soit la pondération essayée
// (×0,75 / ×0,50 / ×0,25 / ×0). Seul l'absence de pénalité conserve le
// 3/3. Sur ce cas, R1 a gagné alors que son front était tenu ET que son
// propre antagoniste était libre et au repos — la doctrine de libération
// et le résultat réel se contredisent frontalement. À éclaircir avant
// tout branchement.


// ═══════════════════════════════════════════════════════════════
// FORCE D'UN CAMP ET DUEL DU BOUCLIER (26/08/26)
// Branchement de ce que l'étude du 7-0 a établi et vérifié :
//
//  1. « On ne juge pas un pôle présent ou absent, ni même solide ou
//     fragile en soi. On suit la chaîne — qui attaque le bouclier, qui
//     devrait arrêter cet attaquant, et avec quelle force élémentaire,
//     binôme compris. Un attaquant en résultante seule peut détruire,
//     si celui qui devait l'arrêter est plus faible que lui. »
//     (Ellemine_D, 25/08.) soliditeChaineV7 comptait le bouclier en
//     PRÉSENCES — exactement ce que cette remarque interdit.
//
//  2. Le défenseur du bouclier EST le front. Vérifié en table sur les
//     16 : assaillant du bouclier = antagoniste(X+10) = X+7, et son
//     antagoniste est X+4 = front(X). Le front et le défenseur du
//     bouclier sont la même figure au même geste — d'où la formule
//     d'Ellemine_D : « la fig de front détruit la fig qui attaque le
//     fig du bouclier ».
//
//  3. La mesure de force employée est celle qu'il a faite à la main sur
//     le 7-0 : concordance cumulée sur toutes les occurrences, plus le
//     niveau d'alignement actif, binôme compris. Reproduite au chiffre
//     près (camp Puer 2,75 contre camp Puella 0,25).
var POIDS_ALIGNEMENT_CAMP_V7 = 0.5;   // conc + 0,5 × alignement actif
// Quelle mesure de force ? 'profil' = les sept critères de
// profilFigureMaison (concordance, déplacement, multiplicité,
// environnement, cohabitation, alignement actif, maison natale).
// 'brut' = l'ancienne, concordance + 0,5 × alignement seulement.
var F4P4_MESURE_V7 = 'profil';

function forceCampV7(fig, theme) {
  if (!fig) return {fig: null, present: false, conc: 0, align: 0, occ: 0, base: 0, total: 0, detail: []};
  const occ = trouverFigV7(fig, theme) || [];
  let conc = 0, align = 0, base = 0;
  const detail = occ.map(function (o) {
    const c = concordanceElement(ELEMENTS_V7[fig], MAISON_ELEM_V7[o.pos]);
    const a = alignementActifV7(fig, o.pos);
    conc += c; align += a.nb; if (!o.hidden) base++;
    return {pos: o.pos, resultante: !!o.hidden, conc: c, align: a.nb,
      libelle: 'M' + o.pos + (o.hidden ? 'r' : '') + ' ' + ELEMENTS_V7[fig]
        + ' en ' + MAISON_ELEM_V7[o.pos] + ' — conc ' + c + ', align ' + a.nb};
  });
  // ─── CORRECTION DU 26/08/26 ───
  // Même défaut que dans analyseFigureV7 : cette force ne pesait que la
  // concordance et l'alignement — deux critères sur sept. Une figure
  // CHEZ ELLE, ou en maison alliée, ou bien entourée, valait pareil
  // qu'une figure de passage. F4P4_MESURE_V7 permet de comparer les deux
  // barèmes ; 'profil' est celui des sept critères, retenu.
  let profilSomme = 0, profilBest = 0;
  occ.forEach(function (o) {
    let pr = null;
    try { pr = profilFigureMaison(fig, o.pos, theme); } catch (e) { pr = null; }
    if (pr) { profilSomme += pr.total; if (pr.total > profilBest) profilBest = pr.total; }
  });
  const brut = Math.round((conc + align * POIDS_ALIGNEMENT_CAMP_V7) * 100) / 100;
  // ─── FUITE D'ÉCHELLE CORRIGÉE LE 27/08/26 ───
  // Le 26/08, F4P4_MESURE_V7 = 'profil' faisait basculer CE total sur
  // l'échelle des sept critères (−20 à +30) alors que tous ses
  // consommateurs sont calés sur l'échelle brute (0 à 3) :
  //   duelBouclierV7 compare A.total et D.total pour dire tenu/rompu ;
  //   soliditeChaineV7 divise la chaîne par deux quand le duel est perdu ;
  //   poleF4P4V7 compare la marge à ±2.
  // Changer l'échelle a donc changé QUELS boucliers sont rompus, et
  // silencieusement déplacé la chaîne et l'ancrage — les deux moteurs
  // calés sur Juventus, Inter et Milan.
  // Mesuré au banc (bancMoteursV7) : la chaîne de R1 sur Juventus
  // passait de 10 à 8 et le cas basculait de R1 à R7 ; sur Inter elle
  // passait de 6 à 5,25, à égalité avec R7. Deux des trois cas de
  // calibrage perdus par un effet de bord.
  // La correction demandée par Ellemine_D (« Carcer est chez elle, tu ne
  // peux pas le voir ») porte sur analyseFigureV7, qui EST le chemin
  // actif de F4P4 et qui garde les sept critères. Elle ne portait pas
  // sur forceCampV7, qui sert les moteurs d'avant.
  // profilSomme et profilMeilleur restent exposés pour comparaison.
  const total = brut;
  return {fig: fig, present: occ.length > 0, occ: occ.length, base: base,
    conc: Math.round(conc * 100) / 100, align: align,
    ancrageBrut: brut,
    profilSomme: Math.round(profilSomme * 100) / 100,
    profilMeilleur: Math.round(profilBest * 100) / 100,
    total: total,
    detail: detail};
}

// Une figure et son binôme, pris ensemble : c'est ainsi qu'Ellemine_D a
// pesé Puer+Caput contre Puella+Populus.
function forceAvecBinomeV7(fig, theme) {
  const a = forceCampV7(fig, theme), b = forceCampV7(BINOMES_V7[fig], theme);
  return {fig: fig, binome: BINOMES_V7[fig], soi: a, appui: b,
    occ: a.occ + b.occ, base: a.base + b.base,
    conc: Math.round((a.conc + b.conc) * 100) / 100,
    align: a.align + b.align,
    total: Math.round((a.total + b.total) * 100) / 100};
}

// Le duel qui décide si le bouclier tient. Assaillant contre front.
function duelBouclierV7(centrale, theme) {
  if (!centrale) return null;
  const bouclier = BOUCLIER_V7[centrale];
  const assaillant = ANTAGONISTES_V7[bouclier];
  const defenseur = FRONT_V7[centrale];      // === ANTAGONISTES_V7[assaillant]
  const A = forceAvecBinomeV7(assaillant, theme);
  const D = forceAvecBinomeV7(defenseur, theme);
  const marge = Math.round((D.total - A.total) * 100) / 100;
  // ─── CORRECTIF DU 26/08/26, RÉVÉLÉ ET VALIDÉ PAR LE CAS Atalanta ───
  // On ne défend pas un bouclier qui n'est pas là. La première version
  // comparait l'assaillant au front SANS vérifier que le bouclier existe :
  // sur le cas Atalanta, le bouclier de R7 (Puella) est absent du thème et le
  // duel était déclaré TENU (+2) parce que le front Tristitia battait
  // l'assaillant Conjunctio. Défendre le vide.
  // Un bouclier absent est rompu d'office, quelle que soit la marge.
  // Mesuré : la correction ne change RIEN sur Juventus, Inter, Milan, Napoli, Fiorentina (le cas ne se
  // présentait que dans Fiorentina, où les deux versions concluent pareil) et INVERSE
  // le cas Atalanta — R1 au lieu de R7. Réel 4-0 pour R1.
  //     duel brut     4/6      duel corrigé  5/6
  const boucliePresent = !!(trouverFigV7(bouclier, theme) || []).length;
  const tenu = boucliePresent && marge >= 0;
  return {
    centrale: centrale, bouclier: bouclier,
    assaillant: assaillant, defenseur: defenseur,
    campAssaillant: A, campDefenseur: D, marge: marge, tenu: tenu,
    bouclierPresent: boucliePresent,
    // Quand le bouclier tombe, l'antagoniste de la centrale est libéré :
    // c'est le double rôle d'Albus dans le 7-0 (bouclier de Carcer ET
    // antagoniste de Rubeus). Vérifié en table : antagoniste(X) = X−3 et
    // bouclier(X) = X+10 ; le bouclier est l'antagoniste de X+13 = X−3.
    // Le bouclier d'une figure est TOUJOURS l'antagoniste de son propre
    // antagoniste. Neutraliser le bouclier libère donc toujours l'assaut.
    libere: ANTAGONISTES_V7[centrale],
    resume: (FL[defenseur] || defenseur) + ' ' + D.total + ' contre '
      + (FL[assaillant] || assaillant) + ' ' + A.total + ' — bouclier '
      + (FL[bouclier] || bouclier)
      + (!boucliePresent ? ' ABSENT DU THÈME — rompu d\'office'
        : (tenu ? ' tenu' : ' ROMPU'))
  };
}

// ═══════════════════════════════════════════════════════════════
// RÉGÉNÉRATION AU SIÈGE — VERSION 2 (26/08/26)
//
// ⚠️ LA VERSION 1 ÉTAIT FAUSSE, ET ELLEMINE_D L'A CORRIGÉE :
// « comme tu analyses en se référant seulement aux figures résultantes,
// ce n'est pas ça. Chaque figure a un RÉSEAU. Cette clarification sur les
// résultantes, c'est juste pour comprendre la force des figures, comment
// leur réseau est constitué. Ce n'est pas pour rien qu'on a établi les
// critères d'analyse d'une figure. »
// Son exemple : « Fortuna Major en M8 résulte Albus. Albus actif, son
// élément eau en terre, c'est acceptable. Albus est de la même boucle que
// Fortuna Major. Quelle est sa position par rapport aux trois pôles de
// Fortuna Major ? Albus est la figure de front de la figure de front de
// Fortuna Major. Cette configuration est FAVORABLE. »
//
// La v1 ne regardait que les TROIS PÔLES DIRECTS (+2, +4, +10) et
// classait tout le reste « neutre ». Elle déclarait donc neutre le +8 de
// son exemple. C'est le contresens : +8 = front ∘ front, deux pas dans le
// réseau ALLIÉ, sans jamais passer par l'antagoniste.
//
// ─── CE QUE LA CORRECTION ÉTABLIT, VÉRIFIÉ 16/16 ───
// Le réseau allié — engendré par binôme (+2), front (+4), bouclier (+10) —
// couvre EXACTEMENT les décalages PAIRS, et rien d'autre. Un décalage
// impair exige au moins un pas par l'antagoniste (+13). Donc :
//     résultante à décalage PAIR   → elle est DANS le réseau de la figure
//     résultante à décalage IMPAIR → il a fallu passer par l'antagoniste
// Distance dans le réseau allié : +2, +4, +10 sont à UN pas (les trois
// pôles) ; +6, +8, +12, +14 sont à DEUX pas (compositions) ; +0 est la
// figure elle-même. Tous les impairs sont à un pas hostile.
//
// C'est aussi la boucle : le réseau allié d'une figure = les huit figures
// de sa boucle (loopOf). D'où la remarque d'Ellemine_D « il arrive même
// que R1 et R7 aient le même réseau » — c'est le cas dès que leurs index
// ont la même parité, soit une fois sur deux.
//
// ─── DEUXIÈME DIMENSION, EXIGÉE PAR LUI ───
// « Albus ACTIF, son élément eau en terre, c'est acceptable. » La
// résultante ne compte pas seulement par sa position dans le réseau :
// elle doit elle-même tenir dans la maison où elle paraît. On la pèse
// donc par les critères d'analyse d'une figure déjà en place —
// concordance et alignement actif. Albus en M8 : eau en terre,
// concordance 0,5, alignement 1 (ligne eau active et compatible).
// Un nœud du réseau qui ne tient pas dans sa maison ne vaut rien.
// POIDS 0,5. ⚠️ MESURÉ, ET TOUJOURS NON PRÉDICTIF — la v2 lit juste, elle
// ne prédit pas mieux. Sur les sept cas au score connu, le critère est
// désormais actif partout (plus aucun « neutre »), et il pousse dans le
// bon sens 3 fois sur 7 :
//   Juventus  ✘   Inter ✘   Milan ✔   Napoli ✔
//   Fiorentina ✘  Atalanta ✔  Torino ✘
// Balayage : 0 → 5/7 · 0,25 → 5/7 · 0,5 → 5/7 · 0,75 → 5/7 · 1 → 4/7.
// À partir de 1 c'est Juventus qui casse. 0,75 tient encore mais laisse
// Juventus à 0,07 de marge ; 0,5 le laisse à 0,25, c'est ce qui est retenu.
// Le signe inverse ne fait pas mieux (5/7 jusqu'à −1, puis 4/7).
// ⚠️ ET IL RESTE STRUCTURELLEMENT AVEUGLE sur Fiorentina et Atalanta :
// mêmes sièges, mêmes centrales, donc même valeur — pour deux résultats
// opposés. Aucun réglage ne peut les séparer par ce critère.
// La v2 est néanmoins gardée sur la v1 parce qu'elle est DOCTRINALEMENT
// juste là où la v1 était fausse : elle voit le réseau, pas seulement les
// trois pôles directs. Mettre 0 la débranche.
var POIDS_REGENERATION_V7 = 0.5;

// Distance dans le réseau allié, par décalage (calculée une fois pour
// toutes ; 99 = inatteignable sans passer par l'antagoniste).
var PAS_RESEAU_ALLIE_V7 = {0: 0, 2: 1, 4: 1, 10: 1, 6: 2, 8: 2, 12: 2, 14: 2};

function regenerationSiegeV7(fig, house) {
  if (!fig || !house) return null;
  const i = FIGS_V7.indexOf(fig);
  const r = getResultant(fig, house);
  const j = FIGS_V7.indexOf(r);
  if (i < 0 || j < 0) return null;
  const d = (j - i + 16) % 16;
  const CHEMIN = {
    0: 'elle-même', 2: 'son binôme', 4: 'son front', 10: 'son bouclier',
    6: 'le binôme de son front', 8: 'le front de son front',
    12: 'le bouclier de son binôme', 14: 'le bouclier de son front',
    13: 'son antagoniste', 1: 'le front de son antagoniste',
    3: 'celle qu\'elle attaque', 5: 'le front de celle qu\'elle attaque',
    7: 'le bouclier de son antagoniste', 9: 'le binôme de son antagoniste… + front',
    11: 'l\'antagoniste de son binôme', 15: 'le binôme de son antagoniste'
  };
  const dansReseau = (d % 2 === 0);
  const pas = dansReseau ? PAS_RESEAU_ALLIE_V7[d] : null;
  // Le nœud tient-il dans la maison où il paraît ? (critères d'analyse
  // d'une figure : concordance + alignement actif, exactement comme
  // forceCampV7 les emploie ailleurs.)
  const conc = concordanceElement(ELEMENTS_V7[r], MAISON_ELEM_V7[house]);
  const align = alignementActifV7(r, house);
  const qualite = Math.round((conc + align.nb * POIDS_ALIGNEMENT_CAMP_V7) * 100) / 100;
  // Un pôle direct pèse plein, une composition à deux pas pèse moitié.
  const portee = dansReseau ? (pas === 1 ? 1 : pas === 2 ? 0.5 : 0) : 1;
  const signe = dansReseau ? (d === 0 ? 0 : 1) : -1;
  return {
    fig: fig, house: house, resultante: r, decalage: d,
    role: CHEMIN[d] || ('décalage +' + d),
    dansReseau: dansReseau, pas: pas,
    concordance: conc, alignement: align.nb, qualite: qualite,
    allie: dansReseau && d !== 0, hostile: !dansReseau,
    score: Math.round(signe * portee * qualite * POIDS_REGENERATION_V7 * 100) / 100,
    resume: (FL[fig] || fig) + ' en M' + house + ' régénère ' + (FL[r] || r)
      + ' — ' + (CHEMIN[d] || ('décalage +' + d))
      + (dansReseau ? ' (dans son réseau, ' + pas + ' pas)' : ' (hors réseau, par l\'antagoniste)')
      + ' · ' + (FL[r] || r) + ' en M' + house + ' : concordance ' + conc
      + ', alignement ' + align.nb
  };
}

// Coefficient appliqué au maillon « bouclier » quand son duel est perdu.
// BRANCHÉ LE 26/08/26 SUR DEMANDE EXPRESSE D'ELLEMINE_D — « tu ne l'as
// pas encore branché au verdict ». Il valait 1, c'est-à-dire neutre :
// le duel était calculé et affiché mais ne déplaçait pas un point.
// Il vaut désormais 0,5 — un bouclier dont le duel est perdu ne compte
// plus que pour moitié dans la chaîne.
//
// CE QUE LA MESURE DIT, ET QU'IL FAUT GARDER SOUS LES YEUX :
//  · Balayé de 1 à −2 sur les SEPT cas au score connu, AUCUNE valeur ne
//    dépasse 5/7 — le même score que le neutre. Le branchement ne fait
//    pas gagner un cas.
//        1 → 5/7 · 0,75 → 5/7 · 0,5 → 5/7 · 0,25 → 4/7 · 0 → 4/7
//        −0,25 → 5/7 · −0,5 → 5/7 · −1 → 5/7 · −2 → 5/7
//  · 0,5 est la valeur la plus forte qui ne retourne AUCUN cas de
//    référence : Juventus, Inter, Milan, Fiorentina et Atalanta restent
//    justes, Napoli et Torino restent faux — exactement comme au neutre.
//    Sous 0,5 c'est Atalanta qui bascule ; à −0,25 et au-delà, Atalanta
//    devient faux et Torino juste, un simple échange.
//  · Effet réel : le verdict change sur 5,9 % des thèmes (43 sur 1395 à
//    0,75 ; 83 à 0,5 ; 166 à 0). Au moins un bouclier est rompu sur
//    78,8 % des thèmes, donc le maillon est presque toujours touché ;
//    c'est la marge de la chaîne qui absorbe le reste.
//  · Ce que ça CREUSE : les marges d'Inter (0,3 → 1,8) et de Milan
//    (1,8 → 4,3), les deux cas les plus serrés de l'archive. Ce que ça
//    coûte : la marge de Fiorentina se resserre (−20,6 → −19,1) et
//    celle de Napoli, déjà fausse, s'aggrave (12,8 → 13,8).
//
// Autrement dit : le branchement rend la lecture plus tranchée sans
// rien démontrer de plus. Remettre 1 rétablit exactement le
// comportement d'avant.
var COEF_BOUCLIER_ROMPU_V7 = 0.5;

// ─── MÊME RÈGLE DU 28/08/26 : UN CAMP NE COMPTE PAS SON RIVAL PARMI SES FORCES ───
// Découverte d'Ellemine_D (les deux quatuors de front, cf.
// contaminationCampsV7) : quand R1 et R7 sont dans la même boucle — la
// moitié des thèmes — l'un est TOUJOURS un rôle du camp de l'autre. R7
// est le binôme, le front, le front du front ou le bouclier de R1, ou
// l'inverse ; huit décalages pairs sur huit. Les compteurs de force
// créditaient donc un camp de la présence de son adversaire : mesuré,
// 24,5 % des thèmes ont R7 parmi les quatre pôles de R1, et 12,6 %
// l'y comptent SOLIDE.
// Branché sur demande d'Ellemine_D. Les rôles POSITIFS (bouclier, front,
// binôme, front du front) ne comptent plus lorsqu'ils sont tenus par la
// centrale adverse. Le rôle NÉGATIF — l'antagoniste — reste compté :
// être attaqué par l'autre chef est un fait réel, pas un appui.
function soliditeChaineV7(fig, theme, figAdverse) {
  if (!fig) return null;
  function maillon(f, role, poids) {
    const occ = f ? trouverFigV7(f, theme) : [];
    const nbBase = occ.filter(function(o){ return !o.hidden; }).length;
    const nbRes  = occ.filter(function(o){ return  o.hidden; }).length;
    let brut;
    if (nbBase) brut = POIDS_CHAINE_V7.ancre + (nbBase - 1) * POIDS_CHAINE_V7.renfort + nbRes * POIDS_CHAINE_V7.resultante;
    else if (nbRes) brut = POIDS_CHAINE_V7.resSeule + (nbRes - 1) * POIDS_CHAINE_V7.resultante;
    else brut = POIDS_CHAINE_V7.maillonAbsent;
    return {role: role, fig: f, nbBase: nbBase, nbResultante: nbRes,
      present: occ.length > 0, enBase: nbBase > 0,
      brut: Math.round(brut * 100) / 100, score: Math.round(brut * poids * 100) / 100};
  }
  const mProt  = maillon(BOUCLIER_V7[fig], 'bouclier', 1);
  const mFront = maillon(FRONT_V7[fig], 'front', POIDS_CHAINE_V7.poidsFront);
  [mProt, mFront].forEach(function (mm) {
    if (REGLE_CENTRALE_ADVERSE_V7 && figAdverse && mm.fig === figAdverse) {
      mm.estAdverse = true; mm.scoreAvantAdverse = mm.score; mm.score = 0;
    }
  });
  // Le bouclier ne vaut pas ce qu'il pèse, il vaut ce qu'il tient.
  const duel = duelBouclierV7(fig, theme);
  if (duel && !duel.tenu && COEF_BOUCLIER_ROMPU_V7 !== 1) {
    mProt.duelPerdu = true;
    mProt.scoreAvantDuel = mProt.score;
    mProt.score = Math.round(mProt.score * COEF_BOUCLIER_ROMPU_V7 * 100) / 100;
  }
  const total = Math.round((mProt.score + mFront.score) * 100) / 100;
  return {
    fig: fig, maillons: [mProt, mFront], duelBouclier: duel,
    total: total,
    toutEnBase: mProt.enBase && mFront.enBase,
    perce: !mProt.present || !mFront.present,
    resume: 'bouclier ' + (mProt.present ? (mProt.nbBase + ' base / ' + mProt.nbResultante + ' rés.') : 'ABSENT')
      + ' · front ' + (mFront.present ? (mFront.nbBase + ' base / ' + mFront.nbResultante + ' rés.') : 'ABSENT')
  };
}

function penchantFigureX(X, figR1, figR7, theme) {
  if (!X) return {X: null, penche: null, raisons: []};
  const raisons = [];
  let scoreR1 = 0, scoreR7 = 0;

  // Lien structurel direct : l'antagoniste frappe, le binôme soutient.
  if (X === ANTAGONISTES_V7[figR1]) { scoreR7 += 2; raisons.push('X est l\'antagoniste direct de R1 — elle frappe R1'); }
  if (X === ANTAGONISTES_V7[figR7]) { scoreR1 += 2; raisons.push('X est l\'antagoniste direct de R7 — elle frappe R7'); }
  if (X === BINOMES_V7[figR1] || X === figR1) { scoreR1 += 2; raisons.push('X est R1 elle-même ou son binôme — elle soutient R1'); }
  if (X === BINOMES_V7[figR7] || X === figR7) { scoreR7 += 2; raisons.push('X est R7 elle-même ou son binôme — elle soutient R7'); }
  if (X === PROTECTEURS_V7[figR1]) { scoreR1 += 1.5; raisons.push('X est le protecteur de R1'); }
  if (X === PROTECTEURS_V7[figR7]) { scoreR7 += 1.5; raisons.push('X est le protecteur de R7'); }
  if (X === FRONT_V7[figR1]) { scoreR1 += 1; raisons.push('X est la figure de front de R1'); }
  if (X === FRONT_V7[figR7]) { scoreR7 += 1; raisons.push('X est la figure de front de R7'); }

  // À défaut de lien direct, l'appartenance de boucle penche faiblement.
  if (!raisons.length) {
    const lX = loopOf(X), l1 = loopOf(figR1), l7 = loopOf(figR7);
    if (lX && l1 && l7 && l1 !== l7) {
      if (lX === l1) { scoreR1 += 0.5; raisons.push('X partage la boucle de R1 (lien faible)'); }
      else if (lX === l7) { scoreR7 += 0.5; raisons.push('X partage la boucle de R7 (lien faible)'); }
    }
  }

  const profil = profilFigureTheme(X, theme);
  return {
    X: X, present: profil.present, profil: profil,
    scoreR1: scoreR1, scoreR7: scoreR7,
    penche: scoreR1 > scoreR7 ? 'R1' : scoreR7 > scoreR1 ? 'R7' : null,
    raisons: raisons
  };
}

// ─── MÉMO PAR THÈME (27/08/26) ───
// Le vote appelle huit moteurs, dont QUATRE passent par
// analyseAncrageDeveloppe (ancrage, chaîne, duel, « 2 boucliers ») et
// deux par moteurF4P4V7. Mesuré : le verdict affiché est passé de 27 ms
// à 82 ms par thème en branchant le vote, dont ~28 ms de recalculs
// identiques. Ces deux fonctions ne lisent ni le DOM, ni l'heure, ni le
// hasard — vérifié sur tout leur arbre d'appel — elles sont donc
// mémoïsables sans risque. Cache de quatre thèmes, signature = les seize
// maisons.
var _memoThemeV7 = {};
function _cleThemeV7(theme) {
  if (!theme) return null;
  var k = '';
  for (var i = 1; i <= 16; i++) k += (theme[i] || '?') + ',';
  return k;
}
// ⚡ 30/08/26 — CE MÉMO NE GARDAIT QU'UNE SEULE ENTRÉE PAR NOM.
// Un seul emplacement { cle, val } : dès que le code parcourt plusieurs
// thèmes à la suite — le banc en rejoue 48, le balayage aussi — chaque
// appel chassait le précédent et NE TOUCHAIT JAMAIS. Au chronomètre,
// analyseAncrageDeveloppe était appelée 1 413 fois et recalculée 968
// fois : le cache servait à moins d'un tiers.
// Le mémo vit maintenant sur l'objet thème (propriété non énumérable) :
// chaque thème garde le sien, il n'y a plus de chasse entre thèmes, et
// il disparaît avec le thème. La sémantique ne change pas — deux appels
// sur le même thème rendaient déjà le même objet.
// L'ancien emplacement unique reste le repli quand le thème n'est pas un
// objet où l'on peut écrire.
function memoParThemeV7(nom, theme, calcul) {
  var m = memoThemeV7(theme, '__memoCalcul');
  if (m) {
    if (Object.prototype.hasOwnProperty.call(m, nom)) return m[nom];
    var w = calcul();
    m[nom] = w;
    return w;
  }
  var k = _cleThemeV7(theme);
  if (!k) return calcul();
  var e = _memoThemeV7[nom];
  if (e && e.cle === k) return e.val;
  var v = calcul();
  _memoThemeV7[nom] = { cle: k, val: v };
  return v;
}

function analyseAncrageDeveloppe(theme) {
  return memoParThemeV7('ancrage', theme, function () {
    return analyseAncrageDeveloppeBrut(theme);
  });
}

function analyseAncrageDeveloppeBrut(theme) {
  if (!theme || !theme[1]) return {applicable: false, reason: 'Thème non disponible.'};
  const rot = getRotationCombat(theme);
  const figR1 = rot.figR1, figR7 = rot.figR7;
  const X = combine(figR1, figR7);

  const membres = {
    R1:          reseauTroisPolesV7(figR1, theme, rot.hR1),
    R7:          reseauTroisPolesV7(figR7, theme, rot.hR7),
    antagoR1:    reseauTroisPolesV7(ANTAGONISTES_V7[figR1], theme),
    antagoR7:    reseauTroisPolesV7(ANTAGONISTES_V7[figR7], theme),
    binomeR1:    reseauTroisPolesV7(BINOMES_V7[figR1], theme),
    binomeR7:    reseauTroisPolesV7(BINOMES_V7[figR7], theme),
    figX:        reseauTroisPolesV7(X, theme)
  };

  const penchantX = penchantFigureX(X, figR1, figR7, theme);

  // ─── HIÉRARCHIE DE DÉPARTAGE (24/08/26, règle Ellemine_D) ───
  // « la solidité de la chaîne prime sur la force d'installation ».
  // 1. Ancrage = solidité de chaîne + rôles reçus
  // 2. À égalité seulement : force d'installation, chef + binôme −
  //    antagoniste, sur les six dimensions du profil.
  // La force d'installation reste calculée et exposée — elle n'est plus
  // décisive, elle départage.
  //
  // ─── BRANCHEMENT DES RÔLES EXERCÉS (25/08/26, demande Ellemine_D) ───
  // La chaîne ne comptait que la PRÉSENCE du protecteur et du front. Les
  // rôles reçus ajoutent la qualité du service : un protecteur fragile
  // protège mal, une frappe sur un chef à son repos est contrée. Les
  // acteurs sont les mêmes quatre pôles — c'est la portée qui est neuve.
  // Somme simple, sans coefficient : k = 1.
  //
  // ⚠️ CE QUE LA MESURE DIT, ET CE QU'ELLE NE DIT PAS.
  // Balayage du coefficient k sur les trois cas réels + 2000 thèmes :
  //   k=0      3/3 · marges 0,75 / 0,75 / 0,75 · 0 % de renversement
  //   k=0,5    3/3 · marges 0,75 / 0,50 / 1,25 · 2,6 %
  //   k=1      3/3 · marges 0,75 / 0,25 / 1,75 · 3,9 %   ← retenu
  //   k=1,25   3/3 · marges 0,75 / 0,13 / 2,00 · 5,4 %
  //   k=1,5    2/3 · le cas Inter bascule
  // Donc : tout k dans [0 ; 1,25] garde 3/3. Les données NE TRANCHENT PAS
  // entre eux — k=1 est choisi parce qu'il est la somme sans artifice, pas
  // parce qu'il serait démontré. Le cas Inter ne tient qu'à 0,25 : c'est le
  // cas où toutes les dimensions chiffrées donnaient R7 et où R1 a gagné.
  // À l'inverse les rôles ÉLARGISSENT la marge du cas Milan (0,75 → 1,75),
  // seule prédiction posée avant de connaître le score.
  // Les rôles seuls donneraient 1/3 : ils complètent la chaîne, ils ne la
  // remplacent pas.
  const chaineR1 = soliditeChaineV7(figR1, theme, figR7);
  const chaineR7 = soliditeChaineV7(figR7, theme, figR1);
  const rolesR1 = scoreRolesRecusV7(figR1, theme, rot.hR1, figR7);
  const rolesR7 = scoreRolesRecusV7(figR7, theme, rot.hR7, figR1);
  // ─── CÔTÉ ACTIF (25/08/26) : « tu ne l'as pas branché » ───
  // Les rôles REÇUS visent les quatre pôles du chef — les mêmes figures que
  // la chaîne. Les rôles EXERCÉS visent quatre figures entièrement
  // différentes : aucune n'est commune aux deux côtés (vérifié 0/64).
  const exercesR1 = scoreRolesExercesV7(figR1, figR7, theme, rot.hR1);
  const exercesR7 = scoreRolesExercesV7(figR7, figR1, theme, rot.hR7);
  // Quatrième couche (26/08/26) : ce que la centrale régénère à son siège.
  const regenR1 = regenerationSiegeV7(figR1, rot.hR1);
  const regenR7 = regenerationSiegeV7(figR7, rot.hR7);
  const ancrageR1 = Math.round((chaineR1.total + rolesR1.total + exercesR1.total
    + (regenR1 ? regenR1.score : 0)) * 100) / 100;
  const ancrageR7 = Math.round((chaineR7.total + rolesR7.total + exercesR7.total
    + (regenR7 ? regenR7.score : 0)) * 100) / 100;

  function val(m) { return m && m.soi && m.soi.meilleur ? m.soi.meilleur.total : 0; }
  const installR1 = val(membres.R1) + val(membres.binomeR1) - val(membres.antagoR1);
  const installR7 = val(membres.R7) + val(membres.binomeR7) - val(membres.antagoR7);

  let avantage = null, critere;
  if (ancrageR1 !== ancrageR7) {
    avantage = ancrageR1 > ancrageR7 ? 'R1' : 'R7';
    critere = 'ancrage ' + ancrageR1 + ' contre ' + ancrageR7
      + ' (chaîne ' + chaineR1.total + '/' + chaineR7.total
      + ' + rôles reçus ' + rolesR1.total + '/' + rolesR7.total
      + ' + rôles exercés ' + exercesR1.total + '/' + exercesR7.total + ')';
  } else if (installR1 !== installR7) {
    avantage = installR1 > installR7 ? 'R1' : 'R7';
    critere = 'ancrages équivalents (' + ancrageR1 + ') — départage par la force d\'installation ('
      + Math.round(installR1 * 10) / 10 + ' contre ' + Math.round(installR7 * 10) / 10 + ')';
  } else {
    critere = 'ancrages et installations équivalents — aucun départage';
  }

  return {
    applicable: true,
    hR1: rot.hR1, hR7: rot.hR7, figR1: figR1, figR7: figR7, X: X,
    membres: membres, penchantX: penchantX,
    chaineR1: chaineR1, chaineR7: chaineR7,
    regenR1: regenR1, regenR7: regenR7,
    rolesR1: rolesR1, rolesR7: rolesR7,
    exercesR1: exercesR1, exercesR7: exercesR7,
    ancrageR1: ancrageR1, ancrageR7: ancrageR7,
    installR1: Math.round(installR1 * 100) / 100,
    installR7: Math.round(installR7 * 100) / 100,
    avantage: avantage, critere: critere,
    synthese: 'R1 ' + FL[figR1] + ' — ancrage ' + ancrageR1 + ' (chaîne ' + chaineR1.total
      + ' · rôles reçus ' + rolesR1.total + ' · rôles exercés ' + exercesR1.total
      + ' : ' + exercesR1.resume + ') · '
      + 'R7 ' + FL[figR7] + ' — ancrage ' + ancrageR7 + ' (chaîne ' + chaineR7.total
      + ' · rôles reçus ' + rolesR7.total + ' · rôles exercés ' + exercesR7.total
      + ' : ' + exercesR7.resume + ') → '
      + (avantage ? 'avantage ' + avantage : 'égalité') + ' par ' + critere + '.'
  };
}

function analyserResistanceV7(X, theme) {
  // CORRIGÉ (21/08/26, demande Ellemine_D "faut pas ignorer les
  // résultantes") : figureExistsBaseOnly ne regardait que les figures de
  // base (1-16) — une figure présente UNIQUEMENT en résultante (ex.
  // Fortuna Major en M13/M14 dans le cas Puella/Via/Conjonctio/Via)
  // n'était jamais détectée comme protecteur ni comme antagoniste actif.
  // Remplacé par trouverFigV7 (base + résultante), déjà utilisé ailleurs
  // dans le moteur pour cette même distinction.
  const antagoniste = ANTAGONISTES_V7[X];
  const protecteur = PROTECTEURS_V7[X];
  const antagonisteOcc = trouverFigV7(antagoniste, theme);
  const protecteurOcc = trouverFigV7(protecteur, theme);
  const antagonistePresent = antagonisteOcc.length > 0;
  const protecteurPresent = protecteurOcc.length > 0;
  const protecteurEnBase = protecteurOcc.some(function(o){ return !o.hidden; });
  const protecteurEnResultanteSeule = protecteurPresent && !protecteurEnBase;

  // TROISIÈME PÔLE — FIGURE DE FRONT (24/08/26, doctrine Ellemine_D, voir
  // FRONT_V7 ci-dessous pour la chaîne complète). Le protecteur a lui-même
  // un antagoniste — une seconde menace, cette fois sur le protecteur. La
  // figure de front (antagoniste de cette seconde menace, = FRONT_V7[X])
  // neutralise cette menace et sécurise la chaîne de protection jusqu'au
  // bout. Sans elle, si la menace sur le protecteur est présente dans le
  // thème, le protecteur peut lui-même être détruit — la voie A n'est
  // donc fiable que si cette seconde menace est absente OU neutralisée
  // par le front. Exemple : Puer ← Puella (menace) ← Conjonctio
  // (protecteur) ← Tristitia (menace sur le protecteur) ← Via (front).
  const menaceProtecteur = protecteur ? ANTAGONISTES_V7[protecteur] : null;
  const front = FRONT_V7[X];
  const menaceProtecteurPresent = menaceProtecteur ? trouverFigV7(menaceProtecteur, theme).length > 0 : false;
  const frontPresent = front ? trouverFigV7(front, theme).length > 0 : false;
  const protecteurMenace = menaceProtecteurPresent && !frontPresent;

  const reposHouse = FIGS_V7.indexOf(X) + 1;
  const enRepos = theme[reposHouse] === X;
  const bin1 = BINOMES_V7[X];
  const bin2 = BINOMES_V7[bin1];
  const bin1Present = trouverFigV7(bin1, theme).length > 0;
  const bin2Present = trouverFigV7(bin2, theme).length > 0;
  const voieB = enRepos && bin1Present && bin2Present;
  const voieA = antagonistePresent && protecteurPresent && !protecteurMenace;
  const libre = !antagonistePresent;
  const statut = libre ? 'libre' : (voieA || voieB) ? 'protégé' : 'vulnérable';
  const voieALabel = 'A (protecteur'
    + (protecteurEnResultanteSeule ? ', en résultante seule' : '')
    + (menaceProtecteurPresent ? ', sécurisé par la figure de front' : '')
    + ')';
  const voieActive = voieA && voieB ? voieALabel + '+B' : voieA ? voieALabel : voieB ? 'B (repos+binômes)' : null;
  return {fig: X, antagoniste: antagoniste, protecteur: protecteur,
    antagonistePresent: antagonistePresent, protecteurPresent: protecteurPresent,
    protecteurEnResultanteSeule: protecteurEnResultanteSeule,
    menaceProtecteur: menaceProtecteur, menaceProtecteurPresent: menaceProtecteurPresent,
    front: front, frontPresent: frontPresent, protecteurMenace: protecteurMenace,
    enRepos: enRepos, bin1: bin1, bin2: bin2, bin1Present: bin1Present, bin2Present: bin2Present,
    voieA: voieA, voieB: voieB, voieActive: voieActive, statut: statut};
}

function analyserConfrontationDirecteV7(theme, figR1, figR7) {
  const resultante = combine(figR1, figR7);
  const loopR1 = loopOf(figR1), loopR7 = loopOf(figR7), loopRC = loopOf(resultante);
  const campLoop = loopRC === loopR1 ? 'R1' : (loopRC === loopR7 ? 'R7' : null);
  // AJOUTÉ (21/08/26, "la résultante doit être analysée de quel côté
  // elle penche, attaque-t-elle l'autre côté ou l'inverse") : la
  // résultante peut être l'antagoniste DIRECT de l'un des deux camps —
  // signal plus fort et plus explicite que la simple appartenance de
  // boucle (rappel : l'antagoniste change TOUJOURS de boucle, donc une
  // résultante côté R1 qui attaque R7 est structurellement cohérente,
  // mais le camp d'appartenance seul ne dit pas QUI elle attaque).
  const attaqueR1 = (resultante === ANTAGONISTES_V7[figR1]);
  const attaqueR7 = (resultante === ANTAGONISTES_V7[figR7]);
  const allieR1 = (resultante === BINOMES_V7[figR1]) || (resultante === figR1);
  const allieR7 = (resultante === BINOMES_V7[figR7]) || (resultante === figR7);
  let camp, natureLien;
  if (attaqueR1 && !attaqueR7) { camp = 'R7'; natureLien = 'attaque directe de R1'; }
  else if (attaqueR7 && !attaqueR1) { camp = 'R1'; natureLien = 'attaque directe de R7'; }
  else if (allieR1 && !allieR7) { camp = 'R1'; natureLien = 'alliée de R1 (elle-même ou son binôme)'; }
  else if (allieR7 && !allieR1) { camp = 'R7'; natureLien = 'alliée de R7 (elle-même ou son binôme)'; }
  else { camp = campLoop; natureLien = 'appartenance de boucle uniquement (pas d\'attaque ni alliance directe)'; }
  const resistance = analyserResistanceV7(resultante, theme);
  const reposHouse = FIGS_V7.indexOf(resultante) + 1;
  const enRepos = theme[reposHouse] === resultante;
  const binome = BINOMES_V7[resultante];
  const binomeReposHouse = FIGS_V7.indexOf(binome) + 1;
  const binomeEnRepos = theme[binomeReposHouse] === binome;
  return {resultante: resultante, camp: camp, campLoop: campLoop, natureLien: natureLien,
    attaqueR1: attaqueR1, attaqueR7: attaqueR7, resistance: resistance,
    enRepos: enRepos, binome: binome, binomeEnRepos: binomeEnRepos};
}

// ─── RÈGLE ELLEMINE (21/08/26) : COHABITATION DES DEUX BOUCLES ───
// Fait mathématique vérifié : le binôme reste TOUJOURS dans la même
// boucle (décalage +2, pair) mais l'antagoniste passe TOUJOURS dans
// l'autre boucle (décalage -3, impair). Donc chaque maison dont la
// base et la résultante appartiennent à des boucles différentes est
// une COHABITATION entre la boucle de R1 et celle de R7.
// Une cohabitation est BÉNÉFIQUE pour un camp X quand, dans la même
// maison : la figure de BASE est une amie de X (X lui-même ou son
// binôme) ET la RÉSULTANTE produite est l'antagoniste direct de
// l'autre camp Y — la maison héberge visiblement un allié de X tout en
// produisant secrètement une attaque contre Y.
