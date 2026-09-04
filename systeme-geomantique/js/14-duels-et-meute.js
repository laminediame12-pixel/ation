// ═══════════════════════════════════════════════════════════════
// DUELS ET MEUTE
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
function duelEmprisonnementV7(posA, posB, theme) {
  var figA = theme[posA], figB = theme[posB];
  var a = analyseEmprisonnementV7(figA, posA, theme);
  var b = analyseEmprisonnementV7(figB, posB, theme);

  var winner = 'Nul';
  var reasons = [];

  if (a.emprisonne && !b.emprisonne) { winner = 'B'; reasons.push('⛓ ' + FL[figA] + ' emprisonné (figure de base + binôme attaqués et renforcés)'); }
  else if (b.emprisonne && !a.emprisonne) { winner = 'A'; reasons.push('⛓ ' + FL[figB] + ' emprisonné (figure de base + binôme attaqués et renforcés)'); }
  else if (a.emprisonne && b.emprisonne) {
    if (Math.abs(a.scoreDestruction - b.scoreDestruction) <= 10) {
      winner = 'Nul';
      reasons.push('Les deux emprisonnés à concordance égale -> Nul (A:' + a.scoreDestruction + ' B:' + b.scoreDestruction + ')');
    } else if (a.scoreDestruction > b.scoreDestruction) {
      winner = 'B';
      reasons.push('⛓ ' + FL[figA] + ' plus détruit (concordance ' + a.scoreDestruction + ' vs ' + b.scoreDestruction + ') -> perd');
    } else {
      winner = 'A';
      reasons.push('⛓ ' + FL[figB] + ' plus détruit (concordance ' + b.scoreDestruction + ' vs ' + a.scoreDestruction + ') -> perd');
    }
  }

  return {a: a, b: b, winner: winner, reasons: reasons};
}

// ═══════════════════════════════════════════════════════════════
// RÈGLE AVANTAGE — SUPPRIMÉE (revue contradictions)
// Cette règle cherchait deux cas : (a) le binôme d'une figure est aussi
// son antagoniste, (b) l'antagoniste du binôme d'une figure est ce même
// binôme. Or BINOMES_V7 est toujours le décalage +2 dans FIGS_V7 et
// ANTAGONISTES_V7 toujours le décalage -3 : (a) demanderait +2≡-3 (mod 16)
// et (b) demanderait -1≡0 (mod 16), deux égalités fausses pour les 16
// figures sans exception. "avantage" valait donc TOUJOURS false, rendant
// ce départage totalement inerte (jamais consulté dans verdictCamp malgré
// son branchement) — supprimé plutôt que laissé comme code mort trompeur.
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// AUTO-CONSTRUCTION / AUTO-DESTRUCTION — table fixe par figure
// ═══════════════════════════════════════════════════════════════

// Maisons où chaque figure s'auto-construit (résultante = son propre binôme)
var AUTO_CONSTRUCT_HOUSE = {
  puer:6, laetitia:6, caput_draconis:2, albus:2, via:14, amissio:14,
  rubeus:2, tristitia:2, fortuna_minor:6, carcer:6, conjunctio:2,
  fortuna_major:2, cauda_draconis:14, puella:14, acquisitio:2, populus:2
};

// Maisons où chaque figure s'auto-détruit (résultante = son propre antagoniste)
var AUTO_DESTRUCT_HOUSE = {
  puer:11, laetitia:1, caput_draconis:3, albus:5, via:3, amissio:1,
  rubeus:11, tristitia:13, fortuna_minor:11, carcer:1, conjunctio:3,
  fortuna_major:5, cauda_draconis:3, puella:1, acquisitio:11, populus:13
};

function checkAutoConstruction(fig, pos) {
  return AUTO_CONSTRUCT_HOUSE[fig] === pos;
}
function checkAutoDestruction(fig, pos) {
  return AUTO_DESTRUCT_HOUSE[fig] === pos;
}

// ═══════════════════════════════════════════════════════════════
// MAISON FORTE — figure de base ET résultante du même élément que la maison
// ═══════════════════════════════════════════════════════════════

function checkMaisonDoubleConcordance(fig, pos) {
  var resFig = combine(fig, FIGS_V7[pos-1]);
  var eFig = ELEMENTS_V7[fig];
  var eRes = ELEMENTS_V7[resFig];
  var eMaison = MAISON_ELEM_V7[pos];
  var match = (eFig === eMaison) && (eRes === eMaison);
  return {match: match, fig:fig, resFig:resFig, eFig:eFig, eRes:eRes, eMaison:eMaison};
}

// ═══════════════════════════════════════════════════════════════
// CAS SPÉCIAL RUBEUS EN M11 — confrontation eau/eau/eau, pénalty/rouge
// ═══════════════════════════════════════════════════════════════

function checkRubeusM11Penalty(theme) {
  var rubeusPositions = trouverFigV7('rubeus', theme);
  var rubeusEnM11 = rubeusPositions.some(function(p) { return p.pos === 11; });
  if (!rubeusEnM11) return {actif:false};

  var albusFig = 'albus'; // antagoniste de rubeus
  var albusPositions = trouverFigV7(albusFig, theme);
  if (!albusPositions.length) return {actif:false};

  var binDeAlbus = BINOMES_V7[albusFig]; // rubeus lui-même
  var binDeAlbusBienPositionne = trouverFigV7(binDeAlbus, theme).some(function(p) {
    return forceMaisonV7(binDeAlbus, p.pos).force >= 70;
  });

  return {
    actif: true,
    albusControle: binDeAlbusBienPositionne,
    penaltyOuRouge: !binDeAlbusBienPositionne,
    rubeusGagneDonnePenalty: true // si Rubeus gagne le duel -> pénalty/rouge probable, géré dans verdictV7
  };
}

// ═══════════════════════════════════════════════════════════════
// CAPUT DRACONIS — toute figure dans sa propre maison de repos
// avec la plus forte concordance détruit la figure occupante
// ═══════════════════════════════════════════════════════════════




// ═══════════════════════════════════════════════════════════════
// CAS SPÉCIAL FORTUNA MAJOR EN M12 — risque rouge/penalty composite
// ═══════════════════════════════════════════════════════════════

function checkFortunaMajorM12Penalty(theme) {
  var fmPositions = trouverFigV7('fortuna_major', theme);
  var fmEnM12 = fmPositions.some(function(p) { return p.pos === 12; });
  if (!fmEnM12) return {actif:false};

  var facteurs = [];
  var scoreRisque = 0;

  // Puella (binôme de Fortuna Major) bien positionnée dans sa propre maison de repos
  var puellaPositions = trouverFigV7('puella', theme);
  var puellaBienPositionnee = puellaPositions.some(function(p) {
    return forceMaisonV7('puella', p.pos).repos === true;
  });
  if (puellaBienPositionnee) {
    scoreRisque += 35;
    facteurs.push('Puella (binôme) bien positionnée dans sa maison de repos');
  }

  // Rubeus présent en M11 (facteur indépendant)
  var rubeusPositions = trouverFigV7('rubeus', theme);
  var rubeusEnM11 = rubeusPositions.some(function(p) { return p.pos === 11; });
  if (rubeusEnM11) {
    scoreRisque += 30;
    facteurs.push('Rubeus présent en M11 (conflit supplémentaire)');
  }

  // Position de Via et élément de sa maison
  var viaPositions = trouverFigV7('via', theme);
  var viaEffet = null;
  if (viaPositions.length) {
    var viaPos = viaPositions[0].pos;
    var elemMaisonVia = MAISON_ELEM_V7[viaPos];
    if (elemMaisonVia === 'eau') {
      scoreRisque += 25;
      viaEffet = 'mouvement trouble (Via en maison eau M' + viaPos + ')';
      facteurs.push('Via en maison eau (M' + viaPos + ') -> mouvement trouble, amplifie le risque');
    } else if (elemMaisonVia === 'feu') {
      scoreRisque += 20;
      viaEffet = 'chaos (Via en maison feu M' + viaPos + ')';
      facteurs.push('Via en maison feu (M' + viaPos + ') -> chaos, amplifie le risque');
    } else if (elemMaisonVia === 'terre') {
      scoreRisque -= 20;
      viaEffet = 'stabilité (Via en maison terre M' + viaPos + ')';
      facteurs.push('Via en maison terre (M' + viaPos + ') -> stabilité, réduit le risque');
    }
  }

  return {
    actif: true,
    scoreRisque: scoreRisque,
    penaltyOuRouge: scoreRisque >= 40,
    facteurs: facteurs,
    viaEffet: viaEffet
  };
}


// ═══════════════════════════════════════════════════════════════
// MOTEUR PRINCIPAL — BLOCS BINÔME (porte défense) vs ANTAGONISTE (porte offensive)
// Chaque figure a 4 maillons en chaîne de binômes (Bloc A) et son
// antagoniste direct ouvre un Bloc B symétrique de 4 maillons qui se
// referme automatiquement (la 4e figure du Bloc B a pour antagoniste
// la figure de départ).
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// MOTEUR 4 MEUTES — boucles binôme complètes
// Meute 1 : boucle binôme de M1
// Meute 2 : boucle binôme de l'antagoniste de M1
// Meute 3 : boucle binôme de M7
// Meute 4 : boucle binôme de l'antagoniste de M7
// REVUE (principes des attaques effectives / meute vs meute) : contrairement
// à presque toutes les autres règles du fichier, ce moteur — bien que
// présenté dans verdictV7 comme "MOTEUR PRINCIPAL prioritaire" — n'a AUCUNE
// validation empirique citée nulle part (pas de "validé X/Y", pas de cas
// réel nommé) pour ses formules (forceMeute : concordance×atténuation+15
// si présent ; pouvoirDestructeur ; seuil "écart≤10→Nul" de duelMeutes ;
// seuils "faiblesse≥1.5"/"écart≤40" du départage final). Il pèse pourtant
// sur des sorties réellement affichées à l'utilisateur (premier buteur en
// 1ère mi-temps via v7.winner, carte "Verdict R1/R7" jamais recouverte par
// la doctrine, export image — ce dernier corrigé ci-dessous pour utiliser
// le verdict doctrinal plutôt que v7.winner brut).
// CAS PARTICULIER : quand M1 et M7 partagent la MÊME boucle binôme (mesuré
// 50,1% des thèmes aléatoires), Meute1 et Meute3 seraient la boucle
// EXACTEMENT IDENTIQUE (parcourue depuis un point de départ différent) —
// comparer "Meute1 vs Meute2" ne distinguerait donc pas M1 de M7. Le code
// le reconnaît et bascule vers un mécanisme différent (répartition de la
// boucle partagée en deux camps, cf. plus bas) — choix structurel
// nécessaire, pas un bug. Mais duelM1side/duelM7side sont alors gelés à
// {winner:'Nul', scoreA:0, scoreB:0} (jamais calculés), et les mêmes
// champs meute1..meute4 restent peuplés dans l'objet retourné : à première
// vue on pourrait croire qu'un vrai duel de meutes a eu lieu et a donné un
// score nul, alors qu'aucun calcul n'a eu lieu.
// ═══════════════════════════════════════════════════════════════

/**
 * Construit la boucle binôme complète d'une figure (8 maillons,
 * retombe sur la figure de départ = boucle fermée sans interruption).
 */
function construireMeute(figDepart) {
  var boucle = [figDepart];
  var cur = figDepart;
  for (var i = 0; i < 15; i++) {
    var next = BINOMES_V7[cur];
    if (next === figDepart) break; // boucle refermée
    boucle.push(next);
    cur = next;
  }
  return boucle; // 8 figures pour les cycles binôme
}

/**
 * Force interne d'une meute = somme des concordances élémentaires
 * entre maillons consécutifs (circulaire : dernier → premier).
 * Bonus +15 si le maillon est présent (visible ou résultante) dans le thème.
 * Atténuation progressive : maillon i → facteur max(0.3, 1 - i*0.1)
 */
function forceMeute(boucle, theme) {
  var totalForce = 0;
  var details = [];
  var n = boucle.length;
  for (var i = 0; i < n; i++) {
    var prev = boucle[i];
    var cur  = boucle[(i + 1) % n];
    var conc = concordanceV7(ELEMENTS_V7[cur], ELEMENTS_V7[prev]);
    var present = trouverFigV7(cur, theme).length > 0;
    var att = Math.max(0.3, 1 - i * 0.1);
    var force = Math.round(conc.score * att) + (present ? 15 : 0);
    totalForce += force;
    details.push({fig:cur, prev:prev, conc:conc, present:present, att:att, force:force});
  }
  return {totalForce:totalForce, details:details, boucle:boucle};
}

/**
 * Pouvoir destructeur d'une meute A sur une meute B :
 * Pour chaque maillon de A, vérifie si son antagoniste fixe
 * est un maillon de B. Si oui, ajoute la concordance élémentaire
 * (pondérée par présence dans le thème).
 */
// ═══════════════════════════════════════════════════════════════
// DEFENSE EN CHAINE — bataille de boucle binome complete
//
// Principe (valide par l'utilisateur sur un cas reel) :
// Une figure de tete F (M1 ou M7) attaque naturellement son antagoniste A=ANTAGONISTES_V7[F].
// Pour que cette attaque tienne (F "couvert"), il faut que la riposte de A soit neutralisee :
//   - A est lui-meme soutenu par son binome B=BINOMES_V7[A]
//   - C'est le maillon SUIVANT dans la boucle binome de F (le binome direct de F) qui doit
//     neutraliser B (le soutien de l'attaquant A), en etant lui-meme l'antagoniste de B
//     et present/concordant dans le theme.
// Si le maillon suivant ne peut pas neutraliser B, on remonte au maillon suivant de la boucle
// (et ainsi de suite) -- "il faut remonter jusqu'a X figures dans la boucle pour se liberer".
// Si aucun maillon de la boucle ne neutralise B, F reste sous pression (couverture incomplete).
// ═══════════════════════════════════════════════════════════════

/**
 * Verifie si une figure est presente dans le theme avec une concordance
 * favorable (force ou force_forte), c-a-d "active et concordante".
 */
function presenceConcordante(fig, theme) {
  var occs = trouverFigV7(fig, theme);
  if (!occs.length) return {present:false, bestScore:0, bestPos:null, count:0};
  var best = 0, bestPos = null;
  occs.forEach(function(o) {
    var conc = concordanceFigureMaisonV7(fig, o.pos);
    if (conc.force > best) { best = conc.force; bestPos = o.pos; }
  });
  return {present:true, bestScore:best, bestPos:bestPos, count:occs.length};
}

/**
 * Analyse complete des signaux d'une figure dans le theme, pour affichage transparent.
 * Inclut : sécurisation (figure en sa propre maison), evasion (antagoniste dans sa
 * propre maison), force d'attaque subie, force de defense disponible, neutralisations
 * croisees possibles. Ne produit PAS de verdict automatique -- juste les faits bruts.
 */
function analyserSignauxFigure(fig, theme) {
  var antag = ANTAGONISTES_V7[fig];
  var binome = BINOMES_V7[fig];
  var maisonRepos = FIGS_V7.indexOf(fig) + 1;

  var signaux = {fig:fig, antag:antag, binome:binome, maisonRepos:maisonRepos};

  var occsFig = trouverFigV7(fig, theme);
  var securisation = occsFig.filter(function(o){ return o.pos === maisonRepos; });
  signaux.securise = securisation.length > 0;
  signaux.securisationDetail = securisation.length
    ? FL[fig]+' occupe sa propre maison M'+maisonRepos+' ('+(securisation[0].hidden?'resultante':'figure de base')+') -> SECURISE'
    : FL[fig]+' n\'occupe pas sa propre maison M'+maisonRepos;

  var occsAntagDansMaisonRepos = trouverFigV7(antag, theme).filter(function(o){ return o.pos === maisonRepos; });
  if (occsAntagDansMaisonRepos.length) {
    var concEvasion = concordanceFigureMaisonV7(antag, maisonRepos);
    signaux.evasion = true;
    signaux.evasionForce = concEvasion.force;
    signaux.evasionDetail = FL[antag]+' (antagoniste de '+FL[fig]+') occupe la maison de repos M'+maisonRepos+' de '+FL[fig]+' avec concordance '+concEvasion.level+' ('+concEvasion.force+') -> EVASION, '+FL[fig]+' envahi chez lui';
  } else {
    signaux.evasion = false;
    signaux.evasionDetail = 'Pas d\'evasion : '+FL[antag]+' n\'occupe pas la maison de repos de '+FL[fig];
  }

  var presAntag = presenceConcordante(antag, theme);
  signaux.forceAttaqueSubie = presAntag.present ? presAntag.bestScore : 0;
  signaux.antagPresent = presAntag.present;
  signaux.antagPositions = trouverFigV7(antag, theme);

  var defenseur = ANTAGONISTES_V7[antag];
  var presDefenseur = presenceConcordante(defenseur, theme);
  signaux.defenseur = defenseur;
  signaux.forceDefense = presDefenseur.present ? presDefenseur.bestScore : 0;
  signaux.defenseurPresent = presDefenseur.present;

  signaux.bilanNet = signaux.forceDefense - signaux.forceAttaqueSubie;

  var antagDuBinome = ANTAGONISTES_V7[binome];
  var presAntagBinome = presenceConcordante(antagDuBinome, theme);
  signaux.binomeSansAntagoniste = !presAntagBinome.present || presAntagBinome.bestScore < 30;
  signaux.antagDuBinome = antagDuBinome;
  var presBinome = presenceConcordante(binome, theme);
  signaux.binomeBienConcordant = presBinome.present && presBinome.bestScore >= 70;
  signaux.binomeForceMax = presBinome.present ? presBinome.bestScore : 0;
  signaux.binomeSecurisationUtile = signaux.binomeSansAntagoniste && signaux.binomeBienConcordant;

  return signaux;
}

/**
 * Cherche si une figure du camp ADVERSE neutralise l'antagoniste de fig
 * (neutralisation croisee : ex. Puella detruit Puer, antagoniste d'Albus).
 */
function chercherNeutralisationCroisee(fig, campAdverse, theme) {
  var antag = ANTAGONISTES_V7[fig];
  var trouve = [];
  campAdverse.forEach(function(figAdverse) {
    if (ANTAGONISTES_V7[antag] === figAdverse) {
      var pres = presenceConcordante(figAdverse, theme);
      if (pres.present && pres.bestScore >= 30) {
        trouve.push({figProtecteur:figAdverse, antagNeutralise:antag, force:pres.bestScore, pos:pres.bestPos});
      }
    }
  });
  return trouve;
}

/**
 * Teste si une figure de tete F est "couverte" (defendue avec succes) dans le theme.
 * F attaque son antagoniste A. A est soutenu par son binome B.
 * On remonte la boucle binome de F, maillon par maillon, jusqu'a trouver un maillon
 * qui est l'antagoniste direct de B (et present/concordant) -> B neutralise -> F couvert.
 *
 * Retourne {couvert:bool, profondeur:number, maillonLiberateur:fig|null, details:[...]}
 */
function testerCouverture(figF, theme) {
  var figA = ANTAGONISTES_V7[figF]; // l'antagoniste que F attaque
  var figB = BINOMES_V7[figA];      // le soutien de l'attaquant (binome de A)
  var antagDeB = ANTAGONISTES_V7[figB]; // qui peut neutraliser B

  var details = [];
  details.push(FL[figF]+' attaque son antagoniste '+FL[figA]+', soutenu par '+FL[figB]+' (binome de '+FL[figA]+')');
  details.push('Pour neutraliser '+FL[figB]+', il faut '+FL[antagDeB]+' (son antagoniste direct) present et concordant dans la boucle de '+FL[figF]);

  // Construire la boucle binome de F et chercher antagDeB dedans, maillon par maillon
  var boucle = construireMeute(figF);
  var profondeur = -1;
  for (var i = 0; i < boucle.length; i++) {
    if (boucle[i] === antagDeB) { profondeur = i; break; }
  }

  if (profondeur === -1) {
    details.push(antagDeB+' n\'est pas dans la boucle binome de '+FL[figF]+' -> impossible de neutraliser '+FL[figB]);
    return {couvert:false, force:'absente', profondeur:-1, maillonLiberateur:null, details:details};
  }

  var presLiberateur = presenceConcordante(antagDeB, theme);
  if (!presLiberateur.present || presLiberateur.bestScore < 30) {
    details.push(FL[antagDeB]+' present dans la boucle (profondeur '+profondeur+') mais absent ou trop faible dans le theme -> '+FL[figB]+' non neutralise');
    return {couvert:false, force:'absente', profondeur:profondeur, maillonLiberateur:antagDeB, details:details};
  }

  // Le liberateur est present et concordant : verifier si SON propre binome est aussi
  // present pour le soutenir pleinement (sinon couverture partielle/fragile)
  var binomeLiberateur = BINOMES_V7[antagDeB];
  var presBinomeLib = presenceConcordante(binomeLiberateur, theme);
  var soutenuPleinement = presBinomeLib.present && presBinomeLib.bestScore >= 30;

  if (soutenuPleinement) {
    details.push(FL[antagDeB]+' (profondeur '+profondeur+', score '+presLiberateur.bestScore+' en M'+presLiberateur.bestPos+') neutralise '+FL[figB]+', et son binome '+FL[binomeLiberateur]+' present (score '+presBinomeLib.bestScore+') le soutient pleinement -> '+FL[figF]+' COUVERT (fort)');
    return {couvert:true, force:'pleine', profondeur:profondeur, maillonLiberateur:antagDeB, details:details};
  } else {
    details.push(FL[antagDeB]+' (profondeur '+profondeur+', score '+presLiberateur.bestScore+' en M'+presLiberateur.bestPos+') neutralise '+FL[figB]+', MAIS son binome '+FL[binomeLiberateur]+' est absent du theme -> neutralisation fragile, non soutenue -> '+FL[figF]+' couvert partiellement (faible)');
    return {couvert:true, force:'partielle', profondeur:profondeur, maillonLiberateur:antagDeB, details:details};
  }
}

/**
 * Compte, pour la figure de tete d'un camp (M1 ou M7), si elle est couverte ou non,
 * et calcule un score de "pression" : combien de maillons de sa PROPRE boucle sont
 * eux-memes attaques sans couverture (par le meme principe, applique a chaque maillon).
 * Retourne {couvertureChef:bool, profondeurChef:number, maillonsNonCouverts:[...], totalMaillons:number}
 */
function compterNeutralisations(figDepart, theme) {
  var boucle = construireMeute(figDepart);
  var couvertureChef = testerCouverture(figDepart, theme);

  var nonCouverts = [];
  var partiels = [];
  boucle.forEach(function(fig) {
    var test = testerCouverture(fig, theme);
    if (!test.couvert) {
      nonCouverts.push({fig:fig, details:test.details});
    } else if (test.force === 'partielle') {
      partiels.push({fig:fig, details:test.details});
    }
  });

  // Score de pression total : un non-couvert = 1 point de faiblesse,
  // un couvert partiel = 0.5 point de faiblesse (couverture fragile)
  var scoreFaiblesse = nonCouverts.length + partiels.length * 0.5;

  return {
    count: nonCouverts.length,
    partielCount: partiels.length,
    scoreFaiblesse: scoreFaiblesse,
    neutralisees: nonCouverts,
    partielles: partiels,
    boucle: boucle,
    couvertureChef: couvertureChef
  };
}

function pouvoirDestructeur(meuteA, meuteB, theme) {
  var boucleB = {};
  meuteB.forEach(function(f) { boucleB[f] = true; });
  var score = 0;
  var details = [];
  meuteA.forEach(function(f) {
    var ant = ANTAGONISTES_V7[f];
    if (boucleB[ant]) {
      var conc = concordanceV7(ELEMENTS_V7[ant], ELEMENTS_V7[f]);
      var present = trouverFigV7(f, theme).length > 0;
      var s = present ? conc.score : Math.round(conc.score * 0.5);
      score += s;
      details.push({attaquant:f, cible:ant, conc:conc, present:present, score:s});
    }
  });
  return {score:score, details:details};
}

/**
 * Duel entre deux meutes.
 * Score total = force interne + pouvoir destructeur sur l'adversaire.
 * La meute avec le score total le plus élevé gagne.
 */
function duelMeutes(boucleA, boucleB, theme) {
  var fA = forceMeute(boucleA, theme);
  var fB = forceMeute(boucleB, theme);
  var dA = pouvoirDestructeur(boucleA, boucleB, theme);
  var dB = pouvoirDestructeur(boucleB, boucleA, theme);
  var scoreA = fA.totalForce + dA.score;
  var scoreB = fB.totalForce + dB.score;
  var gap = Math.abs(scoreA - scoreB);
  var winner = gap <= 10 ? 'Nul' : (scoreA > scoreB ? 'A' : 'B');
  return {
    boucleA:boucleA, boucleB:boucleB,
    forceA:fA, forceB:fB,
    destructeurA:dA, destructeurB:dB,
    scoreA:scoreA, scoreB:scoreB,
    gap:gap, winner:winner
  };
}

/**
 * Moteur principal 4 meutes.
 * Retourne winner:'A'|'B'|'Nul' (A=M1, B=M7) + raisons détaillées.
 */
function duelBlocsV7(posA, posB, theme) {
  var figA = theme[posA]; // M1
  var figB = theme[posB]; // M7

  var cycleA = getBinomeCycle(figA);
  var cycleB = getBinomeCycle(figB);

  var reasons = [];
  var winner = 'Nul';

  // ── Cas spécial : M1 et M7 dans la même boucle binôme ──
  if (cycleA === cycleB && cycleA !== 0) {
    reasons.push('⚠ M1('+FL[figA]+') et M7('+FL[figB]+') dans la même boucle binôme (cycle '+(cycleA===1?'impair':'pair')+')');

    // ── Decoupage de la boucle partagee en deux camps ──
    // On parcourt la boucle depuis figA (M1) ; tout maillon AVANT d'atteindre figB
    // appartient au camp M1, figB et tout ce qui suit jusqu'au retour appartient au camp M7.
    var boucleComplete = construireMeute(figA);
    var idxB = boucleComplete.indexOf(figB);
    var campM1 = idxB >= 0 ? boucleComplete.slice(0, idxB) : boucleComplete.slice();
    var campM7 = idxB >= 0 ? boucleComplete.slice(idxB) : [];

    reasons.push('Boucle partagee : '+boucleComplete.map(function(f){return FL[f];}).join(' → '));
    reasons.push('Camp M1 ('+FL[figA]+', avant '+FL[figB]+') : '+campM1.map(function(f){return FL[f];}).join(', '));
    reasons.push('Camp M7 ('+FL[figB]+' et apres) : '+campM7.map(function(f){return FL[f];}).join(', '));

    {
      // ── ANALYSE COMPLETE DES SIGNAUX (transparence totale, pas de verdict force) ──
      // On calcule pour chaque maillon des deux camps : securisation, evasion,
      // force d'attaque subie, force de defense, neutralisations croisees.
      // Le moteur affiche tout, et ne tranche QUE si un signal est suffisamment net.

      reasons.push('=== SIGNAUX DETAILLES (analyse complete, sans raccourci) ===');

      function analyserEtAfficherCamp(campListe, nomCamp, campAdverse) {
        var signauxCamp = [];
        reasons.push('--- Camp '+nomCamp+' ---');
        campListe.forEach(function(fig) {
          var sig = analyserSignauxFigure(fig, theme);
          signauxCamp.push(sig);

          reasons.push('• '+FL[fig]+' :');
          reasons.push('   '+sig.securisationDetail);
          if (sig.evasion) reasons.push('   ⚠ '+sig.evasionDetail);
          reasons.push('   Attaque subie ('+FL[sig.antag]+'): '+(sig.antagPresent?'force '+sig.forceAttaqueSubie:'absent -> aucune attaque'));
          reasons.push('   Defense possible ('+FL[sig.defenseur]+' neutraliserait l\'attaquant): '+(sig.defenseurPresent?'force '+sig.forceDefense:'absent -> defense impossible'));
          reasons.push('   Bilan net (defense - attaque) = '+sig.bilanNet);
          if (sig.binomeSecurisationUtile) {
            reasons.push('   ✓ Binome '+FL[sig.binome]+' sans antagoniste actif ET bien concordant (force '+sig.binomeForceMax+') -> securisation utile');
          } else if (sig.binomeSansAntagoniste) {
            reasons.push('   ~ Binome '+FL[sig.binome]+' sans antagoniste actif MAIS concordance insuffisante (force '+sig.binomeForceMax+') -> securisation sterile');
          }

          // Neutralisation croisee : le camp adverse neutralise-t-il l'antagoniste de fig ?
          var neutCroisee = chercherNeutralisationCroisee(fig, campAdverse, theme);
          neutCroisee.forEach(function(n) {
            reasons.push('   ⚡ '+FL[n.figProtecteur]+' (camp adverse) neutralise '+FL[n.antagNeutralise]+' (antagoniste de '+FL[fig]+') en M'+n.pos+' (force '+n.force+') -> protection croisee');
          });
        });
        return signauxCamp;
      }

      var signauxM1 = analyserEtAfficherCamp(campM1.length ? campM1 : [figA], 'M1 ('+FL[figA]+')', campM7);
      var signauxM7 = analyserEtAfficherCamp(campM7.length ? campM7 : [figB], 'M7 ('+FL[figB]+')', campM1);

      // ── Synthese chiffree (indicative, pas un verdict automatique) ──
      var bilanTotalM1 = signauxM1.reduce(function(s,x){ return s + x.bilanNet; }, 0);
      var bilanTotalM7 = signauxM7.reduce(function(s,x){ return s + x.bilanNet; }, 0);
      var securisesM1 = signauxM1.filter(function(x){return x.securise || x.binomeSecurisationUtile;}).length;
      var securisesM7 = signauxM7.filter(function(x){return x.securise || x.binomeSecurisationUtile;}).length;
      var evasionsM1 = signauxM1.filter(function(x){return x.evasion;}).length;
      var evasionsM7 = signauxM7.filter(function(x){return x.evasion;}).length;

      reasons.push('=== SYNTHESE INDICATIVE (a interpreter, pas un verdict automatique) ===');
      reasons.push('Camp M1 : bilan net total='+bilanTotalM1+', securisations='+securisesM1+'/'+signauxM1.length+', evasions subies='+evasionsM1);
      reasons.push('Camp M7 : bilan net total='+bilanTotalM7+', securisations='+securisesM7+'/'+signauxM7.length+', evasions subies='+evasionsM7);

      // Verdict prudent : seulement si l'ecart de bilan net est tres marque (>=80) ET
      // confirme par un ecart de securisation/evasion dans le meme sens.
      var gapBilan = bilanTotalM1 - bilanTotalM7;
      var signalSecurisationM1 = (securisesM1 - evasionsM1) - (securisesM7 - evasionsM7);
      if (Math.abs(gapBilan) >= 80 && ((gapBilan>0) === (signalSecurisationM1>0))) {
        winner = gapBilan > 0 ? 'A' : 'B';
        reasons.push('⚡ Signal net et convergent (bilan + securisation/evasion) → '+(winner==='A'?FL[figA]:FL[figB])+' gagne');
      } else {
        winner = 'Nul';
        reasons.push('Signaux mitiges ou divergents → pas de verdict automatique tranche (Nul par defaut, voir details pour interpretation manuelle)');
      }
    }

    // Résultats synthétiques pour compatibilité affichage
    var m1Dummy = construireMeute(figA);
    var m2Dummy = construireMeute(ANTAGONISTES_V7[figA]);
    var m3Dummy = construireMeute(figB);
    var m4Dummy = construireMeute(ANTAGONISTES_V7[figB]);
    return {
      figA:figA, figB:figB,
      memeBoucle:true,
      meute1:m1Dummy, meute2:m2Dummy, meute3:m3Dummy, meute4:m4Dummy,
      campM1:campM1, campM7:campM7,
      duelM1side:{winner:'Nul', scoreA:0, scoreB:0},
      duelM7side:{winner:'Nul', scoreA:0, scoreB:0},
      winner:winner, reasons:reasons,
      // compat display
      analyseA:{blocA:{chaine:m1Dummy, totalForce:0}, blocB:{chaine:m2Dummy, totalForce:0}, antagoniste:ANTAGONISTES_V7[figA], scoreNetGlobal:0},
      analyseB:{blocA:{chaine:m3Dummy, totalForce:0}, blocB:{chaine:m4Dummy, totalForce:0}, antagoniste:ANTAGONISTES_V7[figB], scoreNetGlobal:0}
    };
  }

  // ── Cas normal : M1 et M7 dans des boucles différentes ──
  var meute1 = construireMeute(figA);              // boucle M1
  var meute2 = construireMeute(ANTAGONISTES_V7[figA]); // boucle antagoniste M1
  var meute3 = construireMeute(figB);              // boucle M7
  var meute4 = construireMeute(ANTAGONISTES_V7[figB]); // boucle antagoniste M7

  reasons.push('Meute 1 (boucle M1='+FL[figA]+'): '+meute1.map(function(f){return FL[f];}).join(' → '));
  reasons.push('Meute 2 (boucle ant.M1='+FL[ANTAGONISTES_V7[figA]]+'): '+meute2.map(function(f){return FL[f];}).join(' → '));
  reasons.push('Meute 3 (boucle M7='+FL[figB]+'): '+meute3.map(function(f){return FL[f];}).join(' → '));
  reasons.push('Meute 4 (boucle ant.M7='+FL[ANTAGONISTES_V7[figB]]+'): '+meute4.map(function(f){return FL[f];}).join(' → '));

  // Duel côté M1 : Meute 1 vs Meute 2
  var duelM1side = duelMeutes(meute1, meute2, theme);
  reasons.push('Duel M1-side (Meute1 vs Meute2) : score '+duelM1side.scoreA+' vs '+duelM1side.scoreB+' → '+(duelM1side.winner==='A'?'Meute1':duelM1side.winner==='B'?'Meute2':'Égalité'));

  // Duel côté M7 : Meute 3 vs Meute 4
  var duelM7side = duelMeutes(meute3, meute4, theme);
  reasons.push('Duel M7-side (Meute3 vs Meute4) : score '+duelM7side.scoreA+' vs '+duelM7side.scoreB+' → '+(duelM7side.winner==='A'?'Meute3':duelM7side.winner==='B'?'Meute4':'Égalité'));

  // ── NEUTRALISATION EN CASCADE (priorite sur le score de boucle) ──
  // Une figure neutralisee perd sa capacite de marquer (binome attaque + antagoniste libre)
  var neutM1 = compterNeutralisations(figA, theme);
  var neutM7 = compterNeutralisations(figB, theme);
  reasons.push('--- Couverture de boucle (defense en chaine) ---');
  reasons.push(FL[figA]+' (chef M1) : '+(neutM1.couvertureChef.couvert?(neutM1.couvertureChef.force==='pleine'?'COUVERT (fort)':'couvert (fragile)'):'NON COUVERT (sous pression directe)'));
  reasons.push('Camp M1 ('+FL[figA]+') : '+neutM1.count+' non-couvert(s), '+neutM1.partielCount+' couverture(s) fragile(s) — score faiblesse='+neutM1.scoreFaiblesse+' sur '+neutM1.boucle.length+' maillons');
  neutM1.neutralisees.forEach(function(n) { reasons.push('  ✗ '+FL[n.fig]+' non couvert (sous pression)'); });
  reasons.push(FL[figB]+' (chef M7) : '+(neutM7.couvertureChef.couvert?(neutM7.couvertureChef.force==='pleine'?'COUVERT (fort)':'couvert (fragile)'):'NON COUVERT (sous pression directe)'));
  reasons.push('Camp M7 ('+FL[figB]+') : '+neutM7.count+' non-couvert(s), '+neutM7.partielCount+' couverture(s) fragile(s) — score faiblesse='+neutM7.scoreFaiblesse+' sur '+neutM7.boucle.length+' maillons');
  neutM7.neutralisees.forEach(function(n) { reasons.push('  ✗ '+FL[n.fig]+' non couvert (sous pression)'); });

  // Résultat côté M1 : si Meute1 gagne → M1 fort; si Meute2 gagne → M1 affaibli
  var scoreM1final = duelM1side.scoreA - duelM1side.scoreB; // positif = M1 dominant
  var scoreM7final = duelM7side.scoreA - duelM7side.scoreB; // positif = M7 dominant

  reasons.push('Score net M1 (Meute1 - Meute2) = '+scoreM1final);
  reasons.push('Score net M7 (Meute3 - Meute4) = '+scoreM7final);

  // La couverture du CHEF est prioritaire : si un chef n'est pas couvert (ou couvert
  // fragile) et l'autre l'est pleinement, c'est decisif independamment du reste.
  var forceChefA = !neutM1.couvertureChef.couvert ? 0 : (neutM1.couvertureChef.force==='pleine' ? 2 : 1);
  var forceChefB = !neutM7.couvertureChef.couvert ? 0 : (neutM7.couvertureChef.force==='pleine' ? 2 : 1);

  if (forceChefA !== forceChefB) {
    winner = forceChefA > forceChefB ? 'A' : 'B';
    reasons.push('⚡ Couverture du chef decisive : '+FL[figA]+'='+forceChefA+'/2 vs '+FL[figB]+'='+forceChefB+'/2 → '+(winner==='A'?FL[figA]:FL[figB])+' gagne');
  } else {
    // Chefs a egalite de couverture -> on regarde le score de faiblesse global de la boucle.
    // CORRECTIF (02/07/26, bug du 7-0) : la faiblesse ne peut trancher que si les
    // scores de duel sont PROCHES (ecart <= 40). Une micro-faiblesse defensive ne
    // doit pas renverser une domination massive (cas reel : net M1=+49 vs M7=-73,
    // ecart 122, et faiblesse 1.5 donnait le match a M7 sur un 7-0 pour M1).
    var faiblesseGap = neutM7.scoreFaiblesse - neutM1.scoreFaiblesse; // positif = M7 plus faible => M1 gagne
    if (Math.abs(faiblesseGap) >= 1.5 && Math.abs(scoreM1final - scoreM7final) <= 40) {
      winner = faiblesseGap > 0 ? 'A' : 'B';
      reasons.push('⚡ Faiblesse de boucle decisive : '+FL[figA]+' faiblesse='+neutM1.scoreFaiblesse+' vs '+FL[figB]+' faiblesse='+neutM7.scoreFaiblesse+' → '+(winner==='A'?FL[figA]:FL[figB])+' gagne');
    } else {
      // Pas d'ecart significatif -> fallback sur le score de boucle brut
      var gap2 = Math.abs(scoreM1final - scoreM7final);
      if (gap2 <= 10) {
        winner = 'Nul';
        reasons.push('Écart faible partout → Nul');
      } else if (scoreM1final > scoreM7final) {
        winner = 'A';
        reasons.push(FL[figA]+' plus résistant et dominant (score boucle) → gagne');
      } else {
        winner = 'B';
        reasons.push(FL[figB]+' plus résistant et dominant (score boucle) → gagne');
      }
    }
  }

  return {
    figA:figA, figB:figB,
    memeBoucle:false,
    meute1:meute1, meute2:meute2, meute3:meute3, meute4:meute4,
    duelM1side:duelM1side, duelM7side:duelM7side,
    scoreM1final:scoreM1final, scoreM7final:scoreM7final,
    winner:winner, reasons:reasons,
    // compat display (aliases pour renderTheme)
    analyseA:{
      blocA:{chaine:meute1, totalForce:duelM1side.forceA.totalForce},
      blocB:{chaine:meute2, totalForce:duelM1side.forceB.totalForce},
      antagoniste:ANTAGONISTES_V7[figA],
      scoreNetGlobal:scoreM1final
    },
    analyseB:{
      blocA:{chaine:meute3, totalForce:duelM7side.forceA.totalForce},
      blocB:{chaine:meute4, totalForce:duelM7side.forceB.totalForce},
      antagoniste:ANTAGONISTES_V7[figB],
      scoreNetGlobal:scoreM7final
    }
  };
}

/**
 * Calcule les buts d'un camp (boucle binôme complète d'une figure de tête)
 * en fonction de la capacité de marquage de chaque figure de la meute (BUTS_FIGURE),
 * filtrée par la planète du jour et atténuée par l'antagoniste actif.
 * Fonction globale réutilisable par tous les moteurs (V7, mode fixe, mode rotation).
 */
function calculerButsCamp(figTete, theme, ctx) {
  var planeteJour = (ctx && ctx.planeteJour) ? ctx.planeteJour : getPlaneteDuJourDuMatch();
  // TEST 10/07/26 : quand l'antagoniste du binome DIRECT de la tete est
  // present ET lui-meme nourri (son propre binome present) — "attaque
  // vivante" — le camp marque en moyenne 2.90 buts contre 3.67 sinon
  // (48 vs 18 cas archives). Penalite ~21% appliquee au total.
  var binDirect = BINOMES_V7[figTete];
  var antBinDirect = ANTAGONISTES_V7[binDirect];
  var presN0 = function(f){ for(var p=1;p<=16;p++){ if(theme[p]===f) return true; if(f!=='populus' && combine(theme[p], FIGS_V7[p-1])===f) return true; } return false; };
  var attaqueVivante = presN0(antBinDirect) && presN0(BINOMES_V7[antBinDirect]);
  var boucle = construireMeute(figTete); // [tete, ...7 autres]
  var candidats = boucle.slice(1); // exclut la tete elle-meme
  var contributions = [];
  var total = 0;
  candidats.forEach(function(fig) {
    var b = BUTS_FIGURE[fig];
    if (!b || b.max === 0) return; // ne peut pas marquer
    var pres = presenceConcordante(fig, theme);
    if (!pres.present) return;

    var planeteFig = PLANETES_V7[fig];
    var concPlan = concordancePlanetaire(planeteFig, planeteJour);
    // CORRECTION (revue du calcul de buts, validée sur 4 matchs réels) : la
    // porte binaire d'origine ("identique/alliance = actif, sinon endormie
    // = 0") faisait tomber le total à 0 dans la majorité des cas — sur
    // 7 planètes, seules 2 relations sur 6 possibles (identique, alliance)
    // laissaient une figure marquer, les 4 autres (neutre/opposition la
    // plupart du temps) l'excluaient totalement. Remplacé par une
    // réduction graduée.
    // AJUSTEMENT (2e passe, même revue) : le premier jeu de coefficients
    // réutilisait tel quel l'échelle de concordancePlanetaire (100/80/50/20),
    // mais donnait une erreur cumulée de 18 sur les 4 matchs réels connus —
    // identique à la porte binaire d'origine. Passage à 100/70/35/10 (plus
    // prudent sur neutre/opposition) : erreur cumulée 12 sur les mêmes 4 cas.
    // Testé aussi 60/25/5 et plus bas : aucun gain supplémentaire sur cet
    // échantillon, donc pas de raison de descendre plus. Coefficients
    // propres à cette fonction, PAS l'échelle générale de
    // concordancePlanetaire (qui reste 100/80/50/20 ailleurs).
    // ⚠️ Calé sur seulement 4 matchs réels — à recontre-tester à mesure que
    // l'archive grossit, comme les autres règles "assemblées rétrospectivement"
    // de ce fichier.
    var PLANET_FACTOR_BUTS = {identique:1.0, alliance:0.7, neutre:0.35, opposition:0.1};
    var planetFactor = PLANET_FACTOR_BUTS[concPlan.type];

    // ── Impact de l'antagoniste : reduit la capacite reelle de marquage ──
    var antag = ANTAGONISTES_V7[fig];
    var presAntag = presenceConcordante(antag, theme);
    var forceAttaque = presAntag.present ? presAntag.bestScore : 0;
    // Facteur de reduction : 0 attaque = 100% de la capacite ; attaque forte (100) = capacite minimale
    var facteurReduction = 1 - (forceAttaque / 100) * 0.7; // attaque max reduit de 70% au plus
    // ACTIVATION (revue des figures marquantes) : `fragile` (Fortuna Minor)
    // s'effondre plus bas que les autres sous pression (plancher 0.15 au lieu
    // de 0.3) — flag jusqu'ici jamais lu nulle part dans le fichier.
    var plancherReduction = b.fragile ? 0.15 : 0.3;
    facteurReduction = Math.max(plancherReduction, facteurReduction); // jamais en dessous du plancher du potentiel

    // Contribution = capacite max (pas interpolee par sa propre concordance, mais
    // plafonnee par l'attaque subie et par l'alignement planetaire du jour) ->
    // Puella seule peut donner pile sa capacite fixe (min=max) quand alignee
    var contribBrut = Math.round(b.max * facteurReduction * planetFactor);
    // ACTIVATION (revue des figures marquantes) : `min` n'etait jamais lu —
    // une figure a min>0 (ex. Puella min=max=2) pouvait tomber sous son
    // propre plancher documente. `concede` (Puer, Amissio) est l'exception
    // volontaire : ces figures cedent plutot que de garantir un minimum,
    // donc elles ne beneficient PAS de ce plancher.
    // CORRECTION (ajustement des pourcentages planetaires) : le plancher
    // `min` etait applique en absolu (Math.max(b.min, contribBrut)), ce qui
    // ANNULAIT completement l'effet du facteur planetaire pour toute figure
    // a min>0 des qu'elle etait presente et peu attaquee -> Puella (et les
    // autres) gardaient leur plancher meme en opposition totale avec la
    // planete du jour, rendant plusieurs jeux de coefficients planetaires
    // strictement equivalents en pratique. Le plancher est desormais lui
    // aussi mis a l'echelle par planetFactor, pour rester coherent avec la
    // doctrine graduee plutot que de la contourner silencieusement.
    var plancherMin = Math.round(b.min * planetFactor);
    var contrib = b.concede ? contribBrut : Math.max(plancherMin, contribBrut);
    if (contrib > 0) {
      contributions.push({fig:fig, contrib:contrib, force:pres.bestScore, planete:planeteFig, concPlan:concPlan.type, forceAttaque:forceAttaque, facteurReduction:facteurReduction, instable:!!b.instable, destructeur:!!b.destructeur});
      total += contrib;
    }
  });
  if (attaqueVivante) total = Math.round(total * 0.79);
  var hasInstable = contributions.some(function(c){ return c.instable; });
  var hasDestructeur = contributions.some(function(c){ return c.destructeur; });
  return {total:total, contributions:contributions, planeteJour:planeteJour, attaqueVivante:attaqueVivante, hasInstable:hasInstable, hasDestructeur:hasDestructeur};
}

/**
 * Traduit les totaux bruts de calculerButsCamp en un score de buts coherent
 * avec le vainqueur fourni ('A'/'M1', 'B'/'M7' ou 'Nul'), en appliquant le
 * multiplicateur de competition. Reutilisable par tous les moteurs.
 */
/**
 * Garantit qu'un score "vainqueur" reste strictement superieur au score du perdant,
 * apres plafonnement a 5. Le vainqueur et la capacite de but peuvent provenir de deux
 * logiques independantes (cas du mode fixe/rotation ou winner=simpleScore et le score
 * vient de calculerButsCamp) : on privilegie ici la coherence affichee (jamais de
 * vainqueur avec un score egal ou inferieur au perdant), quitte a relever legerement
 * le vainqueur au minimum necessaire (perdant+1) plutot que d'abaisser le perdant a 0.
 */
function enforceScoreMargin(goalW, goalL, minGap, cap) {
  minGap = minGap || 1;
  cap = cap || 5;
  goalW = Math.min(cap, Math.max(0, goalW));
  goalL = Math.min(cap, Math.max(0, goalL));
  var corrected = false;
  if (goalW - goalL < minGap) {
    corrected = true;
    goalW = Math.min(cap, goalL + minGap);
    if (goalW - goalL < minGap) { goalL = Math.max(0, goalW - minGap); }
  }
  goalW = Math.min(cap, Math.max(0, goalW));
  goalL = Math.min(cap, Math.max(0, goalL));
  return [goalW, goalL, corrected];
}

function piliersReposCount(theme){
  var piliers = [1,8,9,12,15];
  var n = 0;
  piliers.forEach(function(p){ if (theme[p]===FIGS_V7[p-1]) n++; });
  return n;
}
// VERROU M16=FEU + BINÔME EN BASE (14/07/26, doctrine utilisateur) : quand
// la figure en M16 (Réconciliation) est de nature feu ET que son binôme
// occupe au moins une maison en BASE (pas seulement en résultante) quelque
// part dans le thème, le match ne finit jamais nul. Validé 6/6 sur les 27
// matchs archivés (0 contre-exemple) ; le seul cas M16=feu qui a donné un
// vrai nul (FK Jenis vs Astana, 2-2) avait son binôme UNIQUEMENT en
// résultante (jamais en base) — configuration qui ne satisfait donc pas ce
// verrou et reste soumise aux règles de nul normales.


// ═══════════════════════════════════════════════════════════════
// DOUBLE NEUTRALISATION DES BINÔMES + FUSION (14/07/26, doctrine
// utilisateur, cas Roma-Napoli 3-3) : le binôme direct d'un chef est
// "neutralisé" si son propre antagoniste est présent dans le thème,
// ANCRÉ (chez lui en maison de repos, sur un pilier, ou sur un point
// stratégique de parité), ET soutenu par son propre binôme (présent
// lui aussi). Quand les binômes de M1 ET de M7 sont TOUS LES DEUX
// neutralisés ainsi, ET qu'il y a en plus une FUSION (l'antagoniste de
// M1 EST le binôme de M7, ou l'inverse — la même figure joue double
// rôle dans les deux camps), le match est nul.
// Validé sur les 27 matchs archivés : 0 faux positif (0/25 matchs
// décisifs), capture 1 des 2 vrais nuls (Roma vs Napoli — l'autre,
// FK Jenis vs Astana, n'a pas la fusion). Échantillon minuscule (n=1
// capturé) mais précision parfaite — à recontre-tester à mesure que
// l'archive grossit.
// ═══════════════════════════════════════════════════════════════
function figureAncree(fig, positions){
  var piliers = [1,8,9,12,15];
  var maisonsStrat = [2,4,6,8,10,12,14,16];
  return positions.some(function(p){
    var h = parseInt(p.replace('M','').replace('r',''));
    return FIGS[h-1]===fig || piliers.indexOf(h)>=0 || maisonsStrat.indexOf(h)>=0;
  });
}
function binomeNeutralise(chef, theme){
  var binome = BINOMES[chef];
  var attaquant = ANTAGONISTES[binome];
  var posAttaquant = positionsBaseEtResultantes(attaquant, theme);
  if (!posAttaquant.length) return false;
  if (!figureAncree(attaquant, posAttaquant)) return false;
  return positionsBaseEtResultantes(BINOMES[attaquant], theme).length > 0;
}


function buildScoreFromCamps(campA, campB, winner, competitionOverride, theme) {
  var compConfig = (typeof getCompetitionConfig === 'function') ? getCompetitionConfig(competitionOverride) : {multButs:1.0, label:'?'};
  // MATCH FERMÉ → RÉDUCTION DU SCORE BRUT (19/07/26, demande utilisateur
  // "connecte matchFermeOuvert à verdictFinal pour ajuster le score").
  // `matchFermeOuvert(theme)` existait déjà (panneau "🔒 Match fermé/
  // ouvert") mais restait display-only, jamais consulté par le calcul du
  // score — trouvé en creusant le miss Vitesse-AEK (5-3 prédit, 0-0 réel,
  // 10/16 maisons fermées déjà signalées "FERMÉ" par ce panneau). Exclu
  // des compétitions "esport"/arcade (tier 7, multButs déjà 2.5x, scores
  // naturellement très élevés — l'archive esport confirme que "fermé" n'y
  // corrèle PAS avec moins de buts, contrairement au foot réel). Testé sur
  // 18 vrais matchs (hors esport, mothers/scores de §3 + 6 matchs réels de
  // l'archive) : facteur ×0.8 sur campA.total/campB.total avant le calcul
  // du score → MAE 4,89→4,67, ZÉRO régression sur les 18 cas (3 matchs
  // améliorés : France-Espagne, Amissio/Fortuna Minor, Vitesse-AEK ; les
  // 15 autres inchangés). Facteurs plus agressifs (0.5-0.7) amélioraient
  // encore plus mais introduisaient 2 régressions — 0.8 est le seul
  // testé sans aucun compromis. Ne touche jamais le vainqueur (déjà fixé
  // par `winner` avant cet appel), seulement la magnitude du score.
  var compVal = competitionOverride;
  if (compVal === undefined) { var compSel = document.getElementById('competitionMode'); compVal = compSel ? compSel.value : 'fra_l1'; }
  var esportComp = String(compVal || '').indexOf('esport') === 0;
  var mfo = (theme && typeof matchFermeOuvert === 'function') ? matchFermeOuvert(theme) : {ferme:false};
  var campATotal = (mfo.ferme && !esportComp) ? campA.total * 0.8 : campA.total;
  var campBTotal = (mfo.ferme && !esportComp) ? campB.total * 0.8 : campB.total;
  var goalA = Math.round(campATotal * compConfig.multButs);
  var goalB = Math.round(campBTotal * compConfig.multButs);
  var wA = (winner === 'A' || winner === 'M1');
  var wB = (winner === 'B' || winner === 'M7');
  var corrected = false;
  // TEST 10/07/26 : quand 2+ des 5 maisons-piliers (M1,M8,M9,M12,M15) sont
  // en repos absolu, l'ecart reel moyen archive est 3.25 contre 1.28-1.55
  // sinon (4 cas, tous ecart>=3) -> ecart minimum impose 3 au lieu de 1.
  // AJUSTEMENT (19/07/26, demande utilisateur "améliore l'ampleur du score") :
  // sur 3 vrais matchs récents hors archive, l'écart RÉEL moyen (2.24, mesuré
  // sur les 21 matchs archivés où verdictFinal a le bon vainqueur) dépassait
  // systématiquement l'écart minimum imposé de 1. Testé plusieurs valeurs
  // (2/3/4/5) et plusieurs plafonds (5/6/7/8/9/10) sur l'archive complète :
  // écart minimum de base 2 (piliers reste à 3, plafond reste à 5) donne la
  // MEILLEURE erreur absolue moyenne (0.86 contre 1.00 avec l'ancien 1) —
  // relever le plafond au-delà de 5, ou l'écart piliers au-delà de 3, ou
  // l'écart de base au-delà de 2, dégradait systématiquement le résultat.
  // Ne change PAS le taux de victoire (le vainqueur est décidé ailleurs,
  // cette valeur ne touche que la marge du score affiché).
  var minGap = (theme && piliersReposCount(theme) >= 2) ? 3 : 2;
  // MATCH FERMÉ → PLAFOND RÉDUIT DANS enforceScoreMargin (19/07/26, demande
  // utilisateur "étends le fix à enforceScoreMargin, teste sur l'archive
  // complète"). Sans ça, quand la doctrine contredit les buts bruts (cas
  // "marge ajustée"), enforceScoreMargin poussait le vainqueur au plafond
  // fixe de 5 et reconstruisait le perdant à partir de ce plafond — ce qui
  // effaçait totalement la réduction ×0.8 ci-dessus (constaté sur
  // Vitesse-AEK : toujours 5-3 malgré la réduction). Testé sur le SCORE
  // RÉELLEMENT AFFICHÉ (positions de rotation R1/R7, pas M1/M7 fixe) sur
  // 24 vrais matchs non-esport (6 de l'archive + 18 de §3) en balayant
  // facteur×plafond : plafond=4 est le meilleur compromis (MAE combinée
  // 4,83→4,17, 8 matchs améliorés, 1 seule régression mineure — Albus/
  // Carcer, un faux-positif connu de `matchFermeOuvert`, 5-3 correct
  // ramené à 4-2). Plafond=3 allait plus loin sur l'archive seule (2,83)
  // mais dégradait nettement les 18 vrais matchs (4,83, pire que sans
  // aucun fix) — écarté. Voir REPERES.md §5 pour le détail complet.
  var scoreCap = (mfo.ferme && !esportComp) ? 4 : 5;
  if (wA) { var rW=enforceScoreMargin(goalA, goalB, minGap, scoreCap); goalA=rW[0]; goalB=rW[1]; corrected=rW[2]; }
  else if (wB) { var rW2=enforceScoreMargin(goalB, goalA, minGap, scoreCap); goalB=rW2[0]; goalA=rW2[1]; corrected=rW2[2]; }
  else {
    goalA = Math.min(scoreCap, Math.max(0, goalA));
    goalB = Math.min(scoreCap, Math.max(0, goalB));
    if (goalA!==goalB) { var gN=Math.max(goalA,goalB); goalA=gN; goalB=gN; }
  }
  return {goalA:goalA, goalB:goalB, compConfig:compConfig, corrected:corrected};
}

function duelV7(posA, posB, theme, ctx) {
  var figA = theme[posA], figB = theme[posB];
  var a = scoreV7(figA, posA, theme);
  var b = scoreV7(figB, posB, theme);
  var winner = 'Nul', reasons = [];

  if (a.blocage && a.blocage.bloque) { reasons.push('🚫 '+a.blocage.raison); }
  if (b.blocage && b.blocage.bloque) { reasons.push('🚫 '+b.blocage.raison); }
  if (a.blocageMaison && a.blocageMaison.bloque) { reasons.push('🚫 '+a.blocageMaison.raison); }
  if (b.blocageMaison && b.blocageMaison.bloque) { reasons.push('🚫 '+b.blocageMaison.raison); }
  if (a.autoConstruct) { reasons.push('🔧 '+FL[figA]+' auto-construite en M'+posA+' (+25)'); }
  if (b.autoConstruct) { reasons.push('🔧 '+FL[figB]+' auto-construite en M'+posB+' (+25)'); }
  if (a.autoDestruct) { reasons.push('💥 '+FL[figA]+' auto-détruite en M'+posA+' (-30)'); }
  if (b.autoDestruct) { reasons.push('💥 '+FL[figB]+' auto-détruite en M'+posB+' (-30)'); }
  if (a.doubleConc && a.doubleConc.match) { reasons.push('⭐ '+FL[figA]+' double concordance avec sa maison (+20)'); }
  if (b.doubleConc && b.doubleConc.match) { reasons.push('⭐ '+FL[figB]+' double concordance avec sa maison (+20)'); }

  if (a.isDestroyed && !b.isDestroyed) { winner='B'; reasons.push('⛓ '+FL[figA]+' detruit'); }
  else if (b.isDestroyed && !a.isDestroyed) { winner='A'; reasons.push('⛓ '+FL[figB]+' detruit'); }
  else if (a.isDestroyed && b.isDestroyed) { winner='Nul'; reasons.push('Les deux detruits'); }

  // Règle boucle la plus solide : compare directement la force des chaînes de soutien
  if (winner==='Nul' && a.canScore && b.canScore) {
    var cycleA = (typeof getBinomeCycle==='function') ? getBinomeCycle(figA) : 0;
    var cycleB = (typeof getBinomeCycle==='function') ? getBinomeCycle(figB) : 0;
    var loopGap = Math.abs(a.soutien.totalForce - b.soutien.totalForce);

    if (cycleA === cycleB && cycleA !== 0) {
      // Même boucle : le perdant est celui dont la résultante n'est pas en concordance avec sa maison
      var resAOk = forceMaisonV7(combine(figA, FIGS_V7[posA-1]), posA).force >= 60;
      var resBOk = forceMaisonV7(combine(figB, FIGS_V7[posB-1]), posB).force >= 60;
      if (resAOk && !resBOk) { winner='A'; reasons.push('Même boucle : résultante '+FL[figB]+' non concordante -> perd'); }
      else if (resBOk && !resAOk) { winner='B'; reasons.push('Même boucle : résultante '+FL[figA]+' non concordante -> perd'); }
      else if (loopGap > 10) {
        if (a.soutien.totalForce > b.soutien.totalForce) { winner='A'; reasons.push('Même boucle, boucle plus solide: '+FL[figA]+' ('+a.soutien.totalForce+' vs '+b.soutien.totalForce+')'); }
        else { winner='B'; reasons.push('Même boucle, boucle plus solide: '+FL[figB]+' ('+b.soutien.totalForce+' vs '+a.soutien.totalForce+')'); }
      }
    } else if (loopGap > 15) {
      if (a.soutien.totalForce > b.soutien.totalForce) { winner='A'; reasons.push('Boucle plus solide: '+FL[figA]+' ('+a.soutien.totalForce+' vs '+b.soutien.totalForce+')'); }
      else { winner='B'; reasons.push('Boucle plus solide: '+FL[figB]+' ('+b.soutien.totalForce+' vs '+a.soutien.totalForce+')'); }
    }
  }

  if (winner==='Nul') {
    if (!a.canScore && !b.canScore) {
      return {a:a, b:b, winner:'Nul', goalA:0, goalB:0, reasons:reasons.concat(['Aucun ne peut marquer'])};
    }
    if (a.canScore && !b.canScore) { winner='A'; reasons.push('Seul '+FL[figA]+' peut marquer'); }
    else if (!a.canScore && b.canScore) { winner='B'; reasons.push('Seul '+FL[figB]+' peut marquer'); }
    else {
      var gap = Math.abs(a.scoreNet - b.scoreNet);
      if (gap <= 10) { winner='Nul'; reasons.push('Nul fort ('+a.scoreNet+' vs '+b.scoreNet+')'); }
      else if (a.scoreNet > b.scoreNet) { winner='A'; reasons.push(FL[figA]+' plus solide ('+a.scoreNet+' vs '+b.scoreNet+')'); }
      else { winner='B'; reasons.push(FL[figB]+' plus solide ('+b.scoreNet+' vs '+a.scoreNet+')'); }
    }
  }

  // ── BUTEURS FILTRES PAR LA PLANETE DU JOUR (M1/M7 exclues du marquage) ──
  // M1/M7 = la "reine", protegee mais jamais marqueuse elle-meme.
  // Seules les figures de la boucle dont la planete correspond a la planete du jour
  // (gouvernante au moment du tirage), ou en alliance avec elle, contribuent au score.
  // Les autres figures, meme presentes, restent "endormies" ce jour-la.
  var camp1 = calculerButsCamp(figA, theme, ctx);
  var camp7 = calculerButsCamp(figB, theme, ctx);
  var planeteJour = camp1.planeteJour;

  var sc = buildScoreFromCamps(camp1, camp7, winner, ctx && ctx.competition, theme);
  var goalA = sc.goalA, goalB = sc.goalB, compConfig = sc.compConfig;
  if (sc.corrected) {
    // COHÉRENCE (19/07/26, "cherche s'il y a d'autres endroits désynchronisés") :
    // ce message affichait "+1" en dur, resté figé depuis la base minGap=1
    // d'origine — désormais 2 (ou 3 sous verrou piliers). Calculé depuis
    // l'écart réellement affiché plutôt que redupliqué en dur une 3e fois.
    reasons.push('⚠️ Score ajusté : les buts bruts calculés ne donnaient pas d\'écart net pour le vainqueur doctrinal — marge minimale forcée (+'+Math.abs(goalA-goalB)+') pour rester affichable. Signale un désaccord interne entre la doctrine et le calcul de buts.');
  }

  reasons.push('Planete du jour : '+planeteJour+' (figures actives = meme planete ou alliance uniquement)');
  reasons.push('Competition : '+compConfig.label+' (multiplicateur buts x'+compConfig.multButs+')');
  reasons.push('Buteurs M1 (boucle de '+FL[figA]+', tete exclue) : '+(camp1.contributions.length?camp1.contributions.map(function(c){return FL[c.fig]+'('+c.contrib+', attaque subie='+c.forceAttaque+')';}).join(' + ')+' = '+camp1.total+' x'+compConfig.multButs:'aucun buteur actif')+' -> prédit '+goalA);
  reasons.push('Buteurs M7 (boucle de '+FL[figB]+', tete exclue) : '+(camp7.contributions.length?camp7.contributions.map(function(c){return FL[c.fig]+'('+c.contrib+', attaque subie='+c.forceAttaque+')';}).join(' + ')+' = '+camp7.total+' x'+compConfig.multButs:'aucun buteur actif')+' -> prédit '+goalB);
  return {a:a, b:b, winner:winner, goalA:goalA, goalB:goalB, reasons:reasons, corrected:sc.corrected};
}

// Paralysie M5/M11 : la figure résulte son propre antagoniste fixe + concordance + binôme antagoniste présent
function paralysieV7(pos, theme) {
  var fig = theme[pos];
  var antFig = ANTAGONISTES_V7[fig];
  var resFig = combine(fig, FIGS_V7[pos-1]);
  if (resFig !== antFig) return {paralysee:false, detail:''};
  var conc = concordanceV7(ELEMENTS_V7[antFig], MAISON_ELEM_V7[pos]);
  if (conc.score < 70) return {paralysee:false, detail:''};
  var antBinFig = BINOMES_V7[antFig];
  if (!trouverFigV7(antBinFig, theme).length) return {paralysee:false, detail:''};
  return {paralysee:true, detail:'M'+pos+'='+FL[fig]+' resultante='+FL[antFig]+' ('+conc.type+') + binome '+FL[antBinFig]+' present'};
}

// ═══════════════════════════════════════════════════════════════
// EXPLICATION DIVERGENCE M/R (06/07/26) — Camp M (M1/M7) et Camp R
// (R1/R7) utilisent la MÊME fonction duelV7, mais appliquée à des
// maisons différentes : R1/R7 sont les maisons de repos réelles
// (getRotationOrderFromRepos), pas forcément M1/M7. Comme l'élément
// de maison (MAISON_ELEM_V7), le camp territorial (CAMP1/CAMP2) et le
// statut de repos sont fixés par NUMÉRO de maison, un même procédé
// donne un résultat différent si les maisons d'entrée diffèrent.
// Signal purement explicatif, ne pèse sur aucun verdict.
// ═══════════════════════════════════════════════════════════════


function verdictV7(theme, useRotationAsPrimary, ctx) {

  var order = getRotationOrderFromRepos(theme[1]);
  var r1 = order[0], r7 = order[6];

  // ─── MOTEUR PRINCIPAL : confrontation des blocs binôme/antagoniste ───
  // Par defaut sur M1/M7 ; si useRotationAsPrimary, sur R1/R7 (meme moteur,
  // juste applique aux figures repositionnees par la rotation).
  var duelBlocsM = duelBlocsV7(1, 7, theme);
  var duelBlocsR0 = duelBlocsV7(r1, r7, theme);
  var duelBlocs = useRotationAsPrimary ? duelBlocsR0 : duelBlocsM;

  // ─── Camp M : duel complet M1 vs M7 (facteurs secondaires) ───
  var duelM      = duelV7(1, 7, theme, ctx);
  var duelEmpM   = duelEmprisonnementV7(1, 7, theme);
  var duelCycM   = duelCyclesV7(1, 7, theme);

  // ─── Camp R : même procédé pour R1 vs R7 ───
  var duelR      = duelV7(r1, r7, theme, ctx);
  var duelEmpR   = duelEmprisonnementV7(r1, r7, theme);
  var duelCycR   = duelCyclesV7(r1, r7, theme);

  // ─── Verdict partiel camp M ───
  function verdictCamp(duel, duelEmp, duelCyc, label) {
    var toTeam = function(w) { return w==='A'?'M1':w==='B'?'M7':'Nul'; };
    var w = toTeam(duel.winner);
    var reasons = [].concat(duel.reasons);

    var wCyc = toTeam(duelCyc.winner);
    if (wCyc !== 'Nul') {
      if (w === 'Nul') { w = wCyc; reasons.push('['+label+'] Cycles decisifs -> '+w); }
      else if (w === wCyc) { reasons.push('['+label+'] Cycles confirment'); }
      else { reasons.push('['+label+'] Cycles contredisent -> Nul'); w = 'Nul'; }
    }

    var wEmp = toTeam(duelEmp.winner);
    if (wEmp !== 'Nul') {
      if (w === 'Nul') { w = wEmp; reasons.push('['+label+'] Emprisonnement decisif'); }
      else if (w !== wEmp) { w = wEmp; reasons.push('['+label+'] Emprisonnement renverse -> '+w); }
      else { reasons.push('['+label+'] Emprisonnement confirme'); }
    }

    return {winner: w, reasons: reasons};
  }

  var vcM = verdictCamp(duelM, duelEmpM, duelCycM, 'M');
  var vcR = verdictCamp(duelR, duelEmpR, duelCycR, 'R');

  // ─── MOTEUR PRINCIPAL prioritaire : confrontation des blocs ───
  var toTeamBlocs = function(w) { return w==='A'?'M1':w==='B'?'M7':'Nul'; };
  var wBlocs = toTeamBlocs(duelBlocs.winner);

  var winner = 'Nul';
  var reasons = duelBlocs.reasons.concat(vcM.reasons).concat(vcR.reasons);

  if (duelBlocs.memeBoucle) {
    // ── Cas M1/M7 dans la meme boucle binome : duelBlocs decide SEUL ──
    // Pas de fallback vers les moteurs M/R (rotation, mode fixe) qui sont concus
    // pour le cas de boucles opposees -> evite toute confusion de regles.
    winner = wBlocs;
    reasons.push('⚡ Cas MEME BOUCLE : moteur dedie decisif (sans fallback M/R) -> ' + winner);
  } else if (wBlocs !== 'Nul') {
    // Le moteur principal tranche : les facteurs secondaires (M/R) confirment ou nuancent seulement
    winner = wBlocs;
    reasons.push('⚡ MOTEUR PRINCIPAL (blocs binôme/antagoniste) decisif -> ' + winner);
    if (vcM.winner === winner || vcR.winner === winner) {
      reasons.push('Confirme par les facteurs secondaires (M/R)');
    } else if (vcM.winner !== 'Nul' && vcM.winner !== winner) {
      reasons.push('⚠ Nuance: facteur M suggérait ' + vcM.winner + ' mais moteur principal prévaut');
    }
  } else {
    // Moteur principal en Nul : on retombe sur la fusion M+R classique
    if (vcM.winner === vcR.winner) {
      winner = vcM.winner;
      reasons.push('Moteur principal neutre -> Consensus M+R: ' + winner);
    } else if (vcM.winner !== 'Nul' && vcR.winner === 'Nul') {
      winner = vcM.winner;
      reasons.push('Moteur principal neutre -> Camp M decisif (R neutre)');
    } else if (vcR.winner !== 'Nul' && vcM.winner === 'Nul') {
      winner = vcR.winner;
      reasons.push('Moteur principal neutre -> Camp R decisif (M neutre)');
    } else {
      winner = 'Nul';
      reasons.push('Tout neutre -> Nul');
    }
  }

  // ── DÉPARTAGE PAR LA NOUVELLE CHAÎNE (juge-favori > dominant > élémentaire) ──
  // Le "Nul" du moteur V7 par écart faible est une INDÉCISION structurelle, pas
  // une prédiction de match nul (cf. 7-0 du 27-02 rendu "Nul" par écart faible).
  // Quand V7 est indécis, la nouvelle chaîne tranche si elle a un signal.
  var conflitChaine = null;
  try {
    var _jf = verdictJugeFavori(theme);
    var _cd = campDominant(theme);
    var _ve = verdictElementaire(theme);
    var _tie = _jf.winner || _cd.winner || (_ve.winner !== 'muet' ? _ve.winner : null);
    var _src = _jf.winner ? 'juge-favori' : _cd.winner ? 'camp dominant' : (_ve.winner!=='muet' ? 'verdict élémentaire' : null);
    if (winner === 'Nul') {
      if (_tie) {
        winner = _tie;
        reasons.push('⚖️ V7 indécis (écart faible) → départage par ' + _src + ' : ' + _tie);
      } else {
        reasons.push('⚖️ V7 indécis et nouvelle chaîne muette → Nul maintenu (signal de nul renforcé)');
      }
    } else if (_tie && _tie !== winner) {
      // ⚠️ CONFLIT : V7 tranche mais la nouvelle chaîne dit l'inverse.
      // Statut actuel : ALERTE seulement (option prudente), V7 reste maître.
      // Historique des conflits au 02/07/26 : nouvelle chaîne 3-0 (USA-Bosnie,
      // Puebla, Real-Elche). Si les stats confirment sur 10+ conflits, basculer
      // vers la priorité nouvelle chaîne.
      conflitChaine = {v7: winner, chaine: _tie, source: _src};
      reasons.push('⚠️ CONFLIT MOTEURS : V7 dit ' + winner + ' mais la nouvelle chaîne (' + _src + ') dit ' + _tie + ' — historique des conflits favorable à la nouvelle chaîne (3-0), prudence sur ce verdict.');
    }
  } catch(e) { /* chaîne indisponible : verdict V7 conservé */ }

  var goalM1 = Math.max(duelM.goalA, duelR.goalA);
  var goalM7 = Math.max(duelM.goalB, duelR.goalB);

  var pm5  = paralysieV7(5, theme);
  var pm11 = paralysieV7(11, theme);
  var m1Dest = duelM.a.isDestroyed || duelR.a.isDestroyed;
  var m7Dest = duelM.b.isDestroyed || duelR.b.isDestroyed;
  var goalCap = null;

  if (pm5.paralysee && pm11.paralysee && m1Dest && m7Dest) { goalCap=0; reasons.push('Paralysie totale -> 0-0'); }
  else if (pm5.paralysee && pm11.paralysee) { goalCap=1; reasons.push('M5+M11 paralysees -> max 1 but'); }
  else if (pm5.paralysee && (m1Dest||m7Dest)) { goalCap=1; reasons.push('M5+destruction -> max 1 but'); }
  else if (pm5.paralysee) { goalCap=2; reasons.push('M5 paralysee -> max 2 buts'); }

  if (goalCap !== null) {
    if (goalCap===0) { goalM1=0; goalM7=0; winner='Nul'; }
    else if (goalM1+goalM7 > goalCap) {
      if (winner==='M1') { goalM1=goalCap; goalM7=0; }
      else if (winner==='M7') { goalM1=0; goalM7=goalCap; }
      else { goalM1=Math.ceil(goalCap/2); goalM7=Math.floor(goalCap/2); }
    }
  }

  var finalCorrected = false;
  // CORRECTION (vérification impact piliers M1/M8/M9/M12/M15) : ce garde-fou
  // final utilisait toujours minGap=1 (valeur par défaut d'enforceScoreMargin),
  // sans jamais consulter piliersReposCount(theme) — alors que buildScoreFromCamps
  // (utilisé par duelV7 pour calculer duelM.goalA/goalB et duelR.goalA/goalB
  // séparément) applique correctement minGap=3 quand 2+ piliers sont en repos.
  // Le Math.max() ci-dessus qui fusionne Camp M et Camp R peut détruire l'écart
  // de 3 déjà établi dans chacun séparément, et ce garde-fou final le
  // reconstruisait ensuite avec un écart minimum de seulement 1, pas 3.
  // Vérifié exhaustivement sur les 65 536 tirages de mères possibles : parmi
  // les 3089 thèmes avec verrou piliers actif ET un vainqueur M1/M7 tranché,
  // 1913 (62%) se retrouvaient avec un écart final < 3, violant la règle que
  // le système affiche pourtant comme active pour ces thèmes.
  // COHÉRENCE (19/07/26, demande utilisateur "ça fonctionne avec le verdict
  // final qui affiche pour les deux côtés") : la base de `buildScoreFromCamps`
  // est passée de 1 à 2 (voir plus haut, amélioration validée sur l'archive,
  // erreur moyenne 1.00→0.857) mais CE garde-fou final dupliquait la même
  // logique avec sa propre base codée en dur — restée à 1, désynchronisée du
  // changement. Remise à jour pour rester identique à `buildScoreFromCamps`.
  var minGapFinal = piliersReposCount(theme) >= 2 ? 3 : 2;
  // RÉGRESSION TROUVÉE ET CORRIGÉE (19/07/26, "cherche s'il y a d'autres
  // endroits désynchronisés") : quand la paralysie (M5/M11, `goalCap`
  // ci-dessus) plafonne le total de buts à 0/1/2, ce garde-fou de marge
  // MINIMALE pouvait le contredire — ex. goalCap=1 ("max 1 but") mais
  // marge minimale imposée à 2 → score final 2-0, violant le plafond que
  // le système affiche pourtant comme actif. Invisible avec l'ancienne
  // base 1 (jamais > goalCap en pratique), révélé par le passage à 2 :
  // vérifié sur 3000 thèmes aléatoires, 161/311 cas de paralysie (52%)
  // violaient leur propre plafond avant ce correctif, 0/311 après.
  if (goalCap !== null && goalCap > 0) { minGapFinal = Math.min(minGapFinal, goalCap); }
  if (winner==='M1') { var rM1=enforceScoreMargin(goalM1, goalM7, minGapFinal); goalM1=rM1[0]; goalM7=rM1[1]; finalCorrected=rM1[2]; }
  else if (winner==='M7') { var rM7=enforceScoreMargin(goalM7, goalM1, minGapFinal); goalM7=rM7[0]; goalM1=rM7[1]; finalCorrected=rM7[2]; }
  else {
    goalM1=Math.min(5,Math.max(0,goalM1));
    goalM7=Math.min(5,Math.max(0,goalM7));
    if (winner==='Nul' && goalCap===null) { var g2=Math.max(goalM1,goalM7,1); goalM1=g2; goalM7=g2; }
  }
  if (finalCorrected) {
    reasons.push('⚠️ Score final ajusté : les buts bruts (max de Camp M et Camp R) ne donnaient pas d\'écart net pour '+winner+' — marge minimale forcée (+'+minGapFinal+'). Désaccord interne entre doctrine et calcul de buts, à surveiller.');
  }

  // ─── BUT PREMIERE MI-TEMPS ───
  // CORRECTION (revue "but première mi-temps") : la version d'origine
  // testait "M1 ouverte OU M7 ouverte" (au moins une des deux) mais
  // tranchait TOUJOURS 'both' (les deux marquent) dès que la condition
  // passait — même quand une seule des deux était réellement ouverte.
  // Doctrine précisée par l'utilisateur : M1/M7 ouverte OU mobile (pas
  // seulement ouverte) ; M5 ouverte ; M10 ouverte.
  //
  // CORRECTION 2 (16/07/26, cas France vs Espagne réel) : la branche
  // "une seule des deux ouverte/mobile -> l'AUTRE (fermée) encaisse"
  // prédisait M1(France) marque / M7(Espagne, fermée) encaisse. Réel :
  // mi-temps 0-1 Espagne — c'est l'inverse exact. La branche 'both' (les
  // deux ouvertes/mobiles à la fois), elle, a été confirmée sur USA vs
  // Belgique (htWinner='both', réel 2-1, les deux ont bien marqué).
  // Donc seule la branche 'both' reste fiable ; la branche à un seul
  // côté est rétrogradée en 'indéterminé' plutôt que d'affirmer un
  // camp précis qui s'est avéré faux sur son seul vrai test.
  var figM1 = theme[1], figM7 = theme[7], figM5 = theme[5], figM10 = theme[10];
  var m1OuvOuMobile = isOuverte(figM1) || isMobile(figM1);
  var m7OuvOuMobile = isOuverte(figM7) || isMobile(figM7);
  var m5ActifOuOuvert = isActive(figM5) || isOuverte(figM5);
  var m10Ouverte = isOuverte(figM10);
  // ─── CORRECTION 3 (28/08/26, cas PuerLaet) : DEUX AFFIRMATIONS
  //     DIFFÉRENTES ÉTAIENT CONFONDUES DANS UNE SEULE ───
  // htWinner = 'both' voulait dire « les DEUX camps marquent avant la
  // pause ». Sur PuerLaet il annonçait 'both' et le réel est 2-0 : un
  // seul a marqué. Le signal était juste sur la question faible — y
  // a-t-il eu UN but avant la pause — et faux sur la forte.
  // Les deux sont désormais séparées :
  //     htBut ........ au moins un but avant la pause (question faible)
  //     htDeuxCamps .. les deux camps marquent avant la pause (forte)
  // htWinner garde sa valeur pour ne rien casser en aval, mais il ne
  // vaut 'both' que lorsque la forte est réellement soutenue, et le banc
  // note désormais les deux séparément.
  var htWinner = null;
  var htBut = false;
  var htDeuxCamps = false;
  var htReasons = [];

  if (m5ActifOuOuvert && m10Ouverte && (m1OuvOuMobile || m7OuvOuMobile)) {
    htBut = true;
    if (m1OuvOuMobile && m7OuvOuMobile) {
      htDeuxCamps = true;
      htWinner = 'both';
      htReasons.push('M1 et M7 ouvertes/mobiles + M5 active/ouverte + M10 ouverte -> but des deux cotes en 1ere mi-temps');
    } else if (m1OuvOuMobile) {
      htReasons.push('M1 ouverte/mobile, M7 fermee + M5 active/ouverte + M10 ouverte -> signal ancien "M7 encaisse" CONTREDIT sur France-Espagne reel (mi-temps 0-1 Espagne) -> indetermine');
    } else {
      htReasons.push('M7 ouverte/mobile, M1 fermee + M5 active/ouverte + M10 ouverte -> signal ancien "M1 encaisse" CONTREDIT sur France-Espagne reel (mi-temps 0-1 Espagne) -> indetermine');
    }
  } else {
    // Fallback : ancienne logique de concordance binome pour determiner un seul scorer HT
    var checkHT = function(pos, side) {
      var fig = theme[pos];
      var binFig = BINOMES_V7[fig];
      var conc = concordanceV7(ELEMENTS_V7[binFig], ELEMENTS_V7[fig]);
      if ((conc.type==='force_forte'||conc.type==='force') && trouverFigV7(binFig,theme).length>0) {
        htBut = true;
        if (htWinner !== null) htDeuxCamps = true;
        htWinner = htWinner===null ? side : 'both';
      }
    };
    checkHT(1,'M1'); checkHT(7,'M7');
  }

  // Signaux les plus parlants : Caput Draconis ou Via en M5, M1 ou M7
  var SIGNAL_HT_FIGS = {caput_draconis:1, via:1};
  [1,5,7].forEach(function(p) {
    if (SIGNAL_HT_FIGS[theme[p]]) {
      htReasons.push(FL[theme[p]]+' en M'+p+' -> signal fort de but premiere mi-temps');
    }
  });

  var DANG = {puer:1,rubeus:1,cauda_draconis:1,fortuna_minor:1,tristitia:1,carcer:1,caput_draconis:1};
  var penalty = {hasRed:false, hasPen:false, reasons:[]};
  var compConfig = (typeof getCompetitionConfig === 'function') ? getCompetitionConfig() : {tension:1.0, enjeu:1.0, label:'?'};
  // Regle revue empiriquement (tirages 16/18/24) : un rouge/penalty survient quand la figure
  // dangereuse en M6/M12 est MAL protegee (binome faible/absent), pas l'inverse comme suppose
  // initialement. Tension haute -> seuil plus haut -> plus facile de tomber sous le seuil -> plus facile a declencher.
  var seuilVulnerable = 40 * compConfig.tension;
  var vulnerableCamp = null; // camp structurel (M1 ou M7) qui porte la figure vulnerable en M6/M12
  [6,12].forEach(function(hPos) {
    var fig = theme[hPos];
    if (!DANG[fig]) return;
    var antFigH = ANTAGONISTES_V7[fig];
    var binFigH = BINOMES_V7[fig];
    var antP = trouverFigV7(antFigH, theme);
    var binP = trouverFigV7(binFigH, theme);
    var antScore = antP.length ? Math.round(concordanceV7(ELEMENTS_V7[antFigH],ELEMENTS_V7[fig]).score * proxV7(hPos,antP[0].pos)/100) : 0;
    var binScore = binP.length ? Math.round(concordanceV7(ELEMENTS_V7[binFigH],ELEMENTS_V7[fig]).score * proxV7(hPos,binP[0].pos)/100) : 0;
    if (binScore<seuilVulnerable) {
      penalty.hasPen=true;
      if (fig==='cauda_draconis'||fig==='rubeus') penalty.hasRed=true;
      vulnerableCamp = CAMP1.indexOf(hPos)>=0 ? 'M1' : 'M7';
      penalty.reasons.push(FL[fig]+' en M'+hPos+' mal protege (bin:'+FL[binFigH]+' '+binScore+', seuil '+Math.round(seuilVulnerable)+') attaque subie (ant:'+FL[antFigH]+' '+antScore+') ['+compConfig.label+', tension x'+compConfig.tension+'] -> camp '+vulnerableCamp+' expose');
    }
  });

  // Cas spécial : Rubeus en M11 (confrontation eau-eau-eau avec Albus)
  var rubeusM11 = checkRubeusM11Penalty(theme);
  if (rubeusM11.actif) {
    if (rubeusM11.penaltyOuRouge) {
      penalty.hasPen = true;
      penalty.reasons.push('Rubeus en M11 (eau/eau/eau face à Albus) non contrôlé -> pénalty/rouge probable');
    }
    if (winner === 'M1' && theme[1] === 'rubeus') {
      penalty.hasPen = true;
      penalty.reasons.push('Rubeus (M1) remporte le duel depuis M11 -> pénalty/rouge probable');
    }
    if (winner === 'M7' && theme[7] === 'rubeus') {
      penalty.hasPen = true;
      penalty.reasons.push('Rubeus (M7) remporte le duel depuis M11 -> pénalty/rouge probable');
    }
  }

  // Cas spécial : Fortuna Major en M12 (risque composite)
  var fmM12 = checkFortunaMajorM12Penalty(theme);
  if (fmM12.actif && fmM12.penaltyOuRouge) {
    penalty.hasPen = true;
    penalty.reasons.push('Fortuna Major en M12 (score risque:' + fmM12.scoreRisque + ') -> pénalty/rouge probable');
    fmM12.facteurs.forEach(function(f) { penalty.reasons.push('  • ' + f); });
  }

  // ─── QUI ENCAISSE LE PENALTY/ROUGE ───
  // Priorite 1 : si le declenchement vient du check M6/M12, ces maisons appartiennent
  // structurellement a un camp fixe (CAMP1/CAMP2) -> attribution directe et fiable.
  // Priorite 2 (fallback, cas speciaux Rubeus-M11/Fortuna Major-M12 sans maison de declenchement
  // claire) : le camp le plus negatif/dangereux encaisse (heuristique plus faible, a valider).
  var rubeusEnM11 = (rubeusM11.actif === true);
  var fmEnM12 = (fmM12.actif === true);
  penalty.encaisseur = null;
  if (penalty.hasPen && vulnerableCamp) {
    penalty.encaisseur = vulnerableCamp;
    penalty.reasons.push('Camp '+vulnerableCamp+' encaisse (figure vulnerable en maison structurelle de son camp)');
  } else if (penalty.hasPen) {
    function scoreNegativite(fig) {
      var s = 0;
      if (!isForte(fig)) s += 1;       // faible
      if (!isOuverte(fig)) s += 1;     // fermee
      if (!isActive(fig)) s += 1;      // passive
      return s;
    }
    var negM1 = scoreNegativite(theme[1]);
    var negM7 = scoreNegativite(theme[7]);
    if (negM1 > negM7) {
      penalty.encaisseur = 'M1';
      penalty.reasons.push(FL[theme[1]]+' (M1) plus negatif/dangereux (score '+negM1+' vs '+negM7+') -> encaisse la penalite');
    } else if (negM7 > negM1) {
      penalty.encaisseur = 'M7';
      penalty.reasons.push(FL[theme[7]]+' (M7) plus negatif/dangereux (score '+negM7+' vs '+negM1+') -> encaisse la penalite');
    } else {
      penalty.reasons.push('Negativite egale entre M1 et M7 -> encaisseur indetermine');
    }
  }

  var planM1 = analysePlanetaireCamp(1, theme);
  var planM7 = analysePlanetaireCamp(7, theme);
  var concPlanetes = concordancePlanetaire(planM1.planete, planM7.planete);

  return {
    winner:winner, goalM1:goalM1, goalM7:goalM7, duelBlocs:duelBlocs,
    scoreMain:goalM1+'-'+goalM7, corrected:finalCorrected,
    scoreAlt:winner==='M1'?Math.min(5,goalM1+1)+'-'+goalM7:goalM1+'-'+Math.min(5,goalM7+1),
    duelM:duelM, duelR:duelR, r1:r1, r7:r7,
    duelEmpM:duelEmpM, duelCycM:duelCycM,
    duelEmpR:duelEmpR, duelCycR:duelCycR,
    vcM:vcM, vcR:vcR,
    pm5:pm5, pm11:pm11, goalCap:goalCap,
    htWinner:htWinner, htBut:htBut, htDeuxCamps:htDeuxCamps,
    htReasons:htReasons, penalty:penalty, reasons:reasons,
    planM1:planM1, planM7:planM7, concPlanetes:concPlanetes,
    // compat aliases for display
    duelEmp:duelEmpM, duelCyc:duelCycM
  , conflitChaine: conflitChaine};
}

// ═══════════════════════════════════════════════════════════════
// FIN NOUVEAU MOTEUR V7
// ═══════════════════════════════════════════════════════════════

/**
 * Variante experimentale : meme moteur V7 (confrontation des 4 meutes,
 * binome/antagoniste), mais appliquee a R1/R7 (figures repositionnees par
 * la rotation a partir de la maison de repos de M1) au lieu de M1/M7 en dur.
 * Permet de comparer "moteur principal sur M1/M7" vs "moteur principal sur R1/R7".
 */
function verdictV7Rotation(theme) {
  return verdictV7(theme, true);
}


function figureExistsBaseOnly(fig,theme){
  for(let p=1;p<=16;p++){
    if(theme[p]===fig) return true;
  }
  return false;
}
function analyzeValidation(theme){
  // Les 4 axes de validité (3 classes modulo 3 du carré + l'Axe du Partage,
  // ajouté le 31/08/26) sont désormais définis une seule fois dans
  // AXES_VALIDITE_DEFS/evaluerAxesValidite (cf. commentaire à leur
  // déclaration, près de combineMany) — voir là-bas pour l'historique et la
  // justification de chaque axe.
  // Condition binôme de M1 RETIRÉE (27/07/26, demande explicite Ellemine_D :
  // "on laisse les figures faire le choix") — on ne garde que les axes.
  const results=evaluerAxesValidite(theme);
  return {checks:results, valid:results.every(r=>r.exists)};
}

// ═══════════════════════════════════════════════════════════════
// RÉCIT DU JUGE (M15) — sens traditionnel → type de dénouement
// Validé rétrospectivement sur 4 matchs (juil. 2026) :
//   Populus chaotique → accident décisif (0-1 + rouge)
//   Acquisitio repos → gain net (1-0)
//   Amissio → celui qui mène perd (1-2 renversement 75e/86e)
//   Fortuna Major → le favori s'impose (3-2 Belgique favorite)
// Le vainqueur = récit du Juge × statut favori (champ matchFavorite)
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// ☠️ DEUX ENTRÉES DE CETTE TABLE NE PEUVENT PAS ÊTRE FAUSSES
// (constaté le 04/09/26 sur Abha–Al-Ettifaq, en direct)
//
// Populus porte « vainqueur: selon_chaos » et le texte « nul, SAUF si rôle
// Chaotique : accident décisif ». Le match a fini 0-2 pour R7 après 80
// minutes de 0-0, débloqué par un BUT CONTRE SON CAMP. On pourrait écrire
// que Populus a vu juste : il y a eu un accident, l'accident a désigné le
// vainqueur.
//
// C'EST PRÉCISÉMENT CE QU'IL NE FAUT PAS ÉCRIRE. « Nul, ou sinon celui que
// l'accident favorise » couvre les trois issues : pas de but → juste ;
// un but pour M1 → juste ; un but pour M7 → juste. Une phrase qui ne peut
// pas échouer ne prédit rien. Compter ça comme une réussite, c'est
// exactement la maladie que ce fichier traque depuis le premier jour —
// une règle écrite après le résultat.
//
// Les entrées concernées, à ne JAMAIS porter au crédit d'un moteur :
//   · populus ......... vainqueur: 'selon_chaos'
//   · les entrées 'indetermine' (albus, puella, conjunctio…), qui disent
//     « nul ou victoire courte » : elles ne tranchent pas non plus.
// Elles restent dans la table parce qu'elles décrivent un CLIMAT et que
// leur champ `nul: true` est, lui, testable. Mais leur champ `vainqueur`
// ne doit entrer dans aucun décompte de justesse.
//
// CE QUI RESTE FALSIFIABLE DANS LA TABLE, et qui doit porter les mesures :
//   · le champ `nul` (vrai/faux, vérifiable au coup de sifflet)
//   · les `vainqueur` qui NOMMENT quelqu'un : 'favori', 'outsider',
//     'premier_marqueur', 'dominant_structurel'. Ceux-là peuvent se
//     tromper, donc ceux-là valent quelque chose.
// ═══════════════════════════════════════════════════════════════
const JUGE_RECIT = {
  fortuna_major:  {denouement:'Le favori s impose par la force établie', vainqueur:'favori', nul:false},
  fortuna_minor:  {denouement:'Renversement — l outsider ou celui qui est mené finit par l emporter', vainqueur:'outsider', nul:false},
  acquisitio:     {denouement:'Gain net et conservé — victoire propre sans retournement', vainqueur:'dominant_structurel', nul:false},
  amissio:        {denouement:'Perte de l acquis — celui qui mène ou domine finit par perdre', vainqueur:'outsider', nul:false},
  populus:        {denouement:'Miroir/neutralité — nul, sauf si rôle Chaotique: accident décisif (penalty/rouge)', vainqueur:'selon_chaos', nul:true},
  via:            {denouement:'Mouvement permanent — match ouvert, issue par le flux (buts des deux côtés)', vainqueur:'indetermine', nul:false},
  carcer:         {denouement:'Verrou total — match fermé, nul probable', vainqueur:null, nul:true},
  tristitia:      {denouement:'Chute et pesanteur — match plombé, faible score, issue par affaissement d un camp', vainqueur:'indetermine', nul:false},
  laetitia:       {denouement:'Joie ascendante — match ouvert, victoire dans l élan', vainqueur:'dominant_structurel', nul:false},
  puer:           {denouement:'Impulsivité guerrière — victoire par l audace, cartons probables', vainqueur:'dominant_structurel', nul:false},
  puella:         {denouement:'Harmonie fragile — équilibre, nul ou victoire courte', vainqueur:'indetermine', nul:true},
  rubeus:         {denouement:'Passion brute — match violent, incidents, issue par le chaos', vainqueur:'selon_chaos', nul:false},
  albus:          {denouement:'Sagesse lente — match calme et fermé, victoire courte ou nul', vainqueur:'indetermine', nul:true},
  conjunctio:     {denouement:'Rencontre/liaison — les deux camps se répondent, nul ou victoire à l usure', vainqueur:'indetermine', nul:true},
  caput_draconis: {denouement:'Commencement fort — but précoce, celui qui commence tient', vainqueur:'premier_marqueur', nul:false},
  cauda_draconis: {denouement:'Fin et sortie — dénouement tardif, but ou incident en fin de match', vainqueur:'indetermine', nul:false}
};

function analyzeJugeRecit(theme){
  const juge = theme[15];
  const recit = JUGE_RECIT[juge];
  const eF = (typeof ELEMENTS_V7!=='undefined'?ELEMENTS_V7:ELEMENTS)[juge];
  const eM = MAISON_ELEM_V7 ? MAISON_ELEM_V7[15] : 'eau';
  const role = (typeof ELEMENT_ROLE_MATRIX_V7!=='undefined') ? (ELEMENT_ROLE_MATRIX_V7[eF+'-'+eM]||null) : null;
  const favEl = document.getElementById('matchFavorite');
  const favorite = favEl ? favEl.value : 'none';
  const t1 = (document.getElementById('team1')||{}).value || 'Équipe 1';
  const t2 = (document.getElementById('team2')||{}).value || 'Équipe 2';

  let vainqueurTexte = 'indéterminé par le récit seul';
  if (recit) {
    if (recit.vainqueur === 'favori') {
      vainqueurTexte = favorite==='team1' ? t1 : favorite==='team2' ? t2 : 'le favori du match (non renseigné)';
    } else if (recit.vainqueur === 'outsider') {
      vainqueurTexte = favorite==='team1' ? t2 : favorite==='team2' ? t1 : 'l outsider du match (favori non renseigné)';
    } else if (recit.vainqueur === null) {
      vainqueurTexte = 'match nul probable';
    }
  }
  // Modulation par le rôle élémentaire du Juge
  let modulation = '';
  if (role === 'Chaotique') modulation = 'Juge Chaotique : l issue passe par un accident (penalty, rouge, but casqué).';
  else if (role === 'Blocage') modulation = 'Juge en Blocage : dénouement retenu, verrouillage renforcé.';
  else if (role === 'Stabilisateur') modulation = 'Juge Stabilisateur : dénouement propre, sans incident décisif.';
  else if (role === 'Déclencheur') modulation = 'Juge Déclencheur : dénouement précoce ou brutal.';
  else if (role === 'Amplificateur') modulation = 'Juge Amplificateur : le scénario du récit est intensifié.';

  return {juge, recit: recit?recit.denouement:'—', role, vainqueurTexte, modulation, nulPossible: recit?recit.nul:false};
}

// ═══════════════════════════════════════════════════════════════
// CAMP DOMINANT — la figure d'un camp sature le thème jusqu'au Juge
// Règle : figure de M1 (ou M7) comptée en base + résultantes;
// si >= 3 occurrences ET présence au Juge M15 (base ou résultante)
// -> camp dominant, il gagne. Si les deux camps dominants : le compte
// le plus élevé l'emporte.
// Validation rétrospective 8/8 (juil. 2026) dont correction des 2
// échecs élémentaires (M8: Amissio x4>Via x3; M17: F.Major x3 J✓).
// ⚠️ Règle construite a posteriori — a ÉCHOUÉ en aveugle depuis (cf.
// commentaire de verdictFinal : "les signaux d'étude [dont dominant] ne
// participent PLUS au verdict"). CORRECTION (revue contradictions) :
// cette fonction n'est PLUS prioritaire sur le verdict élémentaire — ce
// commentaire le prétendait à tort, en désaccord avec verdictFinal qui
// n'appelle jamais campDominant().winner pour trancher M1/M7. Le seul
// usage restant dans la chaîne officielle est indirect et étroit : la
// règle "Juge Acquisitio" (verdictFinal) réutilise uniquement le COMPTE
// (c1.count+c7.count >= 6) pour détecter un nul, jamais .winner. Ailleurs,
// .winner ne sert qu'aux statistiques de rejeu (combinedWinner dans
// replayEntry) à titre de comparaison historique — pas au verdict affiché
// à l'utilisateur.
// ═══════════════════════════════════════════════════════════════
function campDominant(theme){
  const res = {};
  for(let p=1;p<=16;p++) res[p] = combine(theme[p], FIGS_V7[p-1]);
  const evalCamp = (fig) => {
    let count=0, positions=[], jugeTouch=false;
    for(let p=1;p<=16;p++){
      if(theme[p]===fig){count++; positions.push('M'+p);}
      if(res[p]===fig){count++; positions.push('M'+p+'r');}
      if(p===15 && (theme[p]===fig || res[p]===fig)) jugeTouch=true;
    }
    return {count, positions, jugeTouch, dominant: count>=3 && jugeTouch};
  };
  const c1 = evalCamp(theme[1]), c7 = evalCamp(theme[7]);
  let winner = null, reason = 'Aucun camp dominant (règle silencieuse, verdict élémentaire applicable).';
  if (c1.dominant && c7.dominant) {
    winner = c1.count >= c7.count ? 'M1' : 'M7';
    reason = 'Les deux camps dominants — départage par le compte : '+FL[theme[1]]+' x'+c1.count+' vs '+FL[theme[7]]+' x'+c7.count+' → '+winner;
  } else if (c1.dominant) {
    winner = 'M1'; reason = FL[theme[1]]+' x'+c1.count+' ('+c1.positions.join(',')+') atteint le Juge → camp M1 dominant';
  } else if (c7.dominant) {
    winner = 'M7'; reason = FL[theme[7]]+' x'+c7.count+' ('+c7.positions.join(',')+') atteint le Juge → camp M7 dominant';
  }
  return {winner, reason, M1:c1, M7:c7};
}

// ═══════════════════════════════════════════════════════════════
// VERDICT JUGE-FAVORI — quand le Juge est Fortuna Major ou Fortuna
// Minor ET que le favori du match est renseigné, le Juge désigne
// directement le vainqueur. Validé 3/3 pour F.Major (Belgique 3-2;
// Real 4-1; favori M7 4-0 contre TOUS les autres moteurs).
// PRIORITÉ : juge-favori > élémentaire. Le favori est une donnée du
// monde réel — ne JAMAIS le déduire des figures du thème.
// CORRECTION (revue des principes du juge-favori) : ce commentaire disait
// "juge-favori > dominant > élémentaire" — campDominant ne participe plus
// au verdict affiché (cf. son propre commentaire, corrigé séparément) et
// n'intervient jamais entre juge-favori et verdictElementaire dans
// verdictFinal ; la mention "dominant" ici était un résidu du même
// oubli.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// VERDICT FINAL — hiérarchie unique et validée (03/07/26)
// Ordre : détruit/invalide → abstention | profil du nul → NUL |
// MIROIRS (M1=M7) → concordance élémentaire départage (ÉTAPE 2 RÉVISÉE,
// 04/07/26 — remplace l'ancienne doctrine "le Juge décide" décrite plus
// bas dans une version antérieure de ce commentaire, jamais mise à jour ;
// voir CORRECTION ci-dessous) | juge-favori | guerre civile (attaques
// effectives > état des chefs > égalité de boucle) | inter-boucles
// (chaos armé > hiérarchie).
// Les signaux d'étude (dominant, chambres, alignements, nœuds) ne
// participent PLUS au verdict (échecs en aveugle) — affichés à part.
// CORRECTION (revue des principes du juge-favori) : ce commentaire disait
// "MIROIRS → le Juge décide (Populus=nul, Conjunctio=victoire à l'usure,
// F.Major/Minor=favori)". Le code réel du cas miroir (theme[1]===theme[7],
// cf. "ÉTAPE 2 RÉVISÉE" plus bas) ne regarde JAMAIS la figure du Juge
// (M15) et n'appelle jamais verdictJugeFavori — il tranche uniquement par
// la concordance élémentaire de la figure partagée. Concrètement : si un
// thème tombe en miroir (M1=M7) ET que le Juge est Fortuna Major/Minor
// avec un favori renseigné, la règle juge-favori ne s'applique PAS (le
// miroir est vérifié avant, à la ligne du "if(theme[1]===theme[7])").
// C'est un choix délibéré et validé pour le cas miroir testé (M6 Populus
// → réel 3-1 M1), pas un bug — mais l'écart avec l'ancienne doctrine
// documentée ici n'avait jamais été signalé.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// PROTOCOLE DES TIRAGES MULTIPLES (04/07/26)
// Deux thèmes VALIDES sur le même sujet, verdicts différents :
// 1. LE PREMIER TIRAGE LIE — la question est consommée par sa réponse ;
//    on ne retire que si le thème est irrecevable (invalide/détruit).
// 2. EXCEPTION : un tirage ultérieur ne supplante le premier que s'il
//    parle depuis un ÉTAGE STRICTEMENT PLUS HAUT ET CONFIRMÉ (doctrine
//    de la parole confirmée, étendue au thème entier).
// Hauteur de parole (rang affiché avec chaque verdict) :
//   5 = souveraine : nul par entre-blocage confirmé, juge-favori à
//       parole saine, chef chez lui (état des chefs tranché par un chef
//       en repos absolu), chaîne de repos souveraine
//   4 = haute : état des chefs (hors chef chez lui), attaques effectives,
//       miroir par concordance, nul — juge spécifique confirmé par binôme
//       (Conjunctio/Acquisitio, 75% empirique chacun)
//   3 = moyenne : guerre civile — égalité de boucle (premier de boucle),
//       chaos armé, nul — symétrie mères/filles (67% empirique, échantillon
//       le plus petit des règles de nul)
//   2 = basse : hiérarchie élémentaire (dernier recours)
//   1 = récit seul / indécis
// CORRECTION (revue des principes du nul) : avant cette correction, les
// nuls "Juge Conjunctio"/"symétrie mères-filles"/"Juge Acquisitio"
// (calculés dans verdictFinal, cf. plus bas) ne matchaient AUCUNE branche
// de rangParole et retombaient tous au rang 1 "récit / indécis" — le même
// niveau qu'une absence totale de signal, alors que ce sont des règles de
// nul validées empiriquement (67-75%). Un second tirage ne parlant que
// par hiérarchie élémentaire (rang 2) aurait pu, à tort, supplanter un
// premier tirage avec un vrai nul Juge Acquisitio (rang 4 après
// correction). Rangs assignés par confiance empirique décroissante,
// cohérents avec nul_suspecte (rang 4) et entre-blocage (rang 5, 100%).
// À égalité d'étage : le premier tirage lie. STATUT : protocole
// provisoire, à éprouver sur des paires réelles de l'archive.
// CORRECTION (revue contradictions) : "trahison" et "duel des binômes"
// ont été retirés de cette hiérarchie. La trahison directe a été
// désactivée du calcul le 10/07/26 (gcU.winner n'est plus consulté dans
// verdictElementaire, seul gcU.applicable sert de porte — cf. commentaire
// "BRANCHEMENT TESTÉ ET RETIRÉ"), et le duel des binômes
// (duelBinomesDirects) n'a jamais été branché dans verdictFinal : il ne
// sert qu'au vote de convergence des statistiques de rejeu (replayEntry),
// jamais à un verdict affiché. Les textes "trahison"/"Duel des binômes"
// n'apparaissent donc plus jamais dans un vf.reason réel — rangParole ne
// les cherche plus, pour ne pas laisser croire que ces étages sont actifs.
// CORRECTION (revue des principes du juge-favori) : le test du palier
// "juge-favori à parole saine" cherchait 'juge' en minuscule ET 'favori',
// ou 'FAVORI' en majuscules — mais le texte réellement généré par
// verdictJugeFavori commence toujours par 'Juge' (J majuscule, ex. "Juge
// Fortuna Major + favori renseigné → ..."), et 'FAVORI' tout en
// majuscules n'apparaît nulle part. Résultat : LA règle présentée partout
// ailleurs comme la plus sûre du système ("PRIORITÉ : juge-favori en
// tête", "1000 chances de gagner, jamais démenti" en rang 5) retombait en
// réalité systématiquement au rang 1 "récit / indécis", le niveau le plus
// bas — un second tirage tranchant par la simple hiérarchie élémentaire
// (rang 2) aurait pu supplanter à tort un verdict juge-favori validé.
// Remplacé par la recherche du marqueur 'favori renseigné', unique aux
// deux textes réels de verdictJugeFavori (Fortuna Major/Minor).
// ═══════════════════════════════════════════════════════════════
function rangParole(vf){
  const r = (vf.reason||'')+' '+(vf.label||'');
  if(vf.type==='abstention') return {rang:0, etage:'abstention'};
  if(r.indexOf('VERDICT FAMILIAL')>=0) return {rang:1, etage:'verdict familial (28/07/26, NON VALIDÉ, paliers + réseau + duel, remplace la cascade complète)'};
  if(r.indexOf('VERDICT ROTATION SEULE')>=0) return {rang:1, etage:'rotation seule + domination (27/07/26, NON VALIDÉ, étape intermédiaire)'};
  if(vf.type==='nul_suspecte') return {rang:4, etage:'convergence nul (promu 07/07/26)'};
  // SUPERPOSITION ANCRE/ASSAILLANT (17/07/26) : validée n=1 seulement
  // (Suisse-Colombie) — rang prudent, pas au niveau des règles établies.
  if(r.indexOf('SUPERPOSITION ANCRE/ASSAILLANT')>=0) return {rang:2, etage:'superposition ancre/assaillant (17/07/26, n=1)'};
  // ANCRAGE DIRECT (17/07/26) : validé seul à 16/27 sur l'archive — rang
  // prudent malgré sa place prioritaire dans verdictFinal (demande
  // explicite utilisateur).
  if(r.indexOf('VERDICT MAX 4 FORCES')>=0) return {rang:2, etage:'max des 4 forces M1/M7/R1/R7 (17/07/26, 18/27 en priorité sur archive)'};
  if(r.indexOf('VERDICT ANCRAGE')>=0) return {rang:2, etage:'ancrage chaîne complète (17/07/26, 16/27 seul sur archive)'};
  // VERDICT ROTATION / MODE FIXE (16/07/26) : depuis le 16/07, ce n'est
  // plus la rotation qui est toujours prioritaire — c'est la carte
  // (fixe ou rotation) avec le plus grand écart de dominance qui
  // tranche (validé 20/27 sur l'archive complète, contre 14/27 pour
  // l'ancienne règle "rotation toujours prioritaire" sur ce même
  // échantillon). Rang provisoire, pas au niveau des règles à rang 5
  // (17/17 ou "jamais démenti").
  if(r.indexOf('VERDICT ROTATION')>=0 || r.indexOf('VERDICT MODE FIXE')>=0) return {rang:3, etage:'plus grand écart de dominance (16/07/26, 20/27 sur archive)'};
  // VERDICT CHAÎNE DE DUALITÉ (17/07/26) : repli quand l'écart de
  // dominance ci-dessus ne tranche pas. Validée seule à 19/27 (70%) avec
  // le score net du petit calcul (voir scorePetitCalcul), plus faible que
  // l'écart de dominance (20/27) — rang inférieur en conséquence.
  if(r.indexOf('CHAÎNE DE DUALITÉ')>=0) return {rang:2, etage:'chaîne de dualité — repli (17/07/26, 19/27 seul sur archive)'};
  if(r.indexOf('ENTRE-BLOCAGE')>=0) return {rang:5, etage:'nul par entre-blocage confirmé'};
  if(r.indexOf('Juge Conjunctio')>=0 || r.indexOf('Juge Acquisitio')>=0) return {rang:4, etage:'nul — juge spécifique confirmé par binôme'};
  if(r.indexOf('symétrie mères/filles')>=0) return {rang:3, etage:'nul — symétrie mères/filles'};
  if(r.indexOf('double neutralisation')>=0) return {rang:3, etage:'nul — double neutralisation + fusion (14/07/26, n=1)'};
  if(r.indexOf('favori renseigné')>=0) return {rang:5, etage:'juge-favori à parole saine'};
  if(r.indexOf('état des chefs')>=0 && r.indexOf('CHEZ LUI (domine)')>=0) return {rang:5, etage:'chef chez lui'};
  if(r.indexOf('SOUVERAINE')>=0) return {rang:5, etage:'chaîne de repos souveraine'};
  // IMPASSE TOTALE DE BOUCLE (14/07/26) : doit être vérifiée AVANT
  // 'attaques effectives' et 'état des chefs', car son texte contient ces
  // deux expressions ("attaques effectives et force de boucle toutes
  // deux à égalité", "ÉTAT DES CHEFS" n'y figure pas mais la prudence
  // s'impose vu l'expérience du même piège avec 'chaîne de force').
  if(r.indexOf('IMPASSE TOTALE DE BOUCLE')>=0) return {rang:4, etage:'guerre civile — impasse totale, nul (14/07/26)'};
  if(r.indexOf('ÉTAT DES CHEFS')>=0 || r.indexOf('état des chefs')>=0) return {rang:4, etage:'état des chefs'};
  if(r.indexOf('attaques effectives')>=0) return {rang:4, etage:'attaques effectives'};
  if(r.indexOf('miroir')>=0 || r.indexOf('Camps-miroirs')>=0) return {rang:4, etage:'miroir par concordance'};
  // CHAÎNE DE FORCE (13/07/26) : oubliée lors de son ajout, tombait par
  // défaut au rang 1 ("récit/indécis") faute de branche dédiée — repérée
  // sur l'export statistiques réel de l'utilisateur (match Anderlecht).
  if(r.indexOf('chaîne de force')>=0) return {rang:3, etage:'guerre civile — chaîne de force'};
  if(r.indexOf('ARMÉ')>=0 || r.indexOf('chaos')>=0) return {rang:3, etage:'chaos armé'};
  if(r.indexOf('hiérarchie')>=0) return {rang:2, etage:'hiérarchie élémentaire'};
  // GUERRE DES 16 (12/07/26) : atteint ce point seulement quand décisive
  // (pas d'égalité — le cas égalité contient aussi 'hiérarchie' et est déjà
  // classé ci-dessus). Rang provisoire aligné sur la hiérarchie élémentaire
  // qu'elle remplace (rang 2), PAS sur la guerre civile (rang 4, validée
  // 8/8) — la guerre des 16 est neuve et son bilan réel est encore trop
  // maigre (2/3 après correction du sens d'attaque, 12/07/26) pour
  // mériter une confiance plus haute. À réévaluer avec plus de données.
  if(r.indexOf('GUERRE DES 16')>=0) return {rang:2, etage:'guerre des 16 (non validé, n=3)'};
  return {rang:1, etage:'récit / indécis'};
}

function themeInvalidite(theme){
  // ─── THÈME DÉTRUIT : LA RÈGLE ÉTAIT ÉCRITE, ELLE N'ÉTAIT BRANCHÉE
  //     NULLE PART (constat d'Ellemine_D, 28/08/26) ───
  // themeDetruit() existait depuis le 03/07/26 et n'était appelée par
  // AUCUNE ligne du fichier : Rubeus ou Cauda Draconis en M1 ne
  // produisait donc aucun signal à l'écran. Elle passe en tête de la
  // validité : c'est le premier motif d'invalidité, avant les axes.
  const detruit = themeDetruit(theme);
  if (detruit) return detruit;
  // Les 4 axes (Cardinal/Succédent/Cadent + Axe du Partage) sont calculés
  // une seule fois par evaluerAxesValidite (cf. combineMany) — même
  // définition que celle utilisée par analyzeValidation/isThemeValideStrict/
  // niveauValiditeV7/toggleValiditePanel.
  const axesRes = evaluerAxesValidite(theme);
  const byKey = {}; axesRes.forEach(function(r){ byKey[r.key] = r; });
  const manquants = [];
  if (!byKey.cardinal.exists) manquants.push('Axe Cardinal (M1+M4+M7+M10 = '+FL[byKey.cardinal.fig]+', absent du thème)');
  if (!byKey.succedent.exists) manquants.push('Axe Succédent (M2+M5+M8+M11 = '+FL[byKey.succedent.fig]+', absent du thème)');
  if (!byKey.cadent.exists) manquants.push('Axe Cadent (M3+M6+M9+M12 = '+FL[byKey.cadent.fig]+', absent du thème)');
  if (!byKey.partage.exists) manquants.push('Axe du Partage (M3+M5+M9+M11 = '+FL[byKey.partage.fig]+', absent du thème)');
  if (!manquants.length) return null;
  return '⛔ THÈME INVALIDE : '+manquants.join(' ; ')+' — protocole de validité structurelle (même critère que celui utilisé pour exclure les thèmes invalides des statistiques rétrospectives, maintenant appliqué en direct).';
}
// SUPERPOSITION ANCRE/ASSAILLANT SUR MAISON VERROUILLÉE (17/07/26, cas
// Suisse-Colombie réel 0-0, M1=Carcer/M7=Fortuna Major binômes directs).
// Cherche une maison en triple concordance (checkMaisonDoubleConcordance
// — figure ET résultante du même élément que la maison) où se
// superposent à la fois le binôme de l'ancre d'un chef ET le binôme de
// l'assaillant de l'autre (ou du même) chef. Sur ce cas précis (M9,
// Populus/Fortuna Minor, feu) : Populus = binôme de Puella (ancre de
// M7) et Fortuna Minor = binôme de Rubeus (assaillant de M1) ET
// antagoniste direct de Fortuna Major (M7 lui-même) — les deux camps se
// nouent au même point figé au lieu de se dégager l'un de l'autre.
// VALIDÉ n=1 (Suisse-Colombie) UNIQUEMENT — aucune trace de ce
// mécanisme sur les 2 autres nuls connus de l'archive (Roma-Napoli,
// FK Jenis-Astana, qui ont chacun leur propre profil de nul, cf.
// discussion "plusieurs cas de nul" du 17/07/26) ni sur aucun des 27
// matchs de l'archive (0/27 occurrences, décisifs compris) — donc
// AUCUN risque de régression mesurée en l'ajoutant. Positionnée avant
// l'écart de dominance (comme l'impasse totale de boucle) précisément
// parce qu'elle est assez rare pour ne jamais entrer en conflit avec
// les 27 cas déjà validés — contrairement à la tentative abandonnée de
// remonter TOUTES les règles de nul (qui cassait 4 cas archivés).

// CONFIRMATION RÉSULTANTE+BINÔME (18/07/26, demande explicite
// utilisateur : "le résultante confirme ou nie la figure de base par
// rapport à ce que le résultante exprime", puis "ajoute la nécessité
// du binôme et aussi harmonie du resultante et aussi et du binôme pour
// la confirmation") — une maison est "confirmée" si TOUTES ces
// conditions tiennent à la fois : (1) la polarité de la figure de base
// (FIGURE_MEANINGS_PERSO, favorable/défavorable) coïncide avec celle
// de son résultante ; (2) le binôme de la figure de base est présent
// dans le thème (nécessité) ; (3) le résultante est en harmonie
// élémentaire avec sa maison (forceMaisonV7 ≥ seuil "compatible") ;
// (4) le binôme lui-même est en harmonie avec au moins une de ses
// propres maisons. Testé isolé (exactement un des deux camps M1/M7
// confirme, l'autre non) : 9/10 (90%) sur les 27 matchs de l'archive.
// Utilisé en priorité dans verdictFinal, repli sur la cascade
// existante sinon : 21/26 contre 18/25 pour le moteur actuel seul —
// +3 net (répare Argentine-Egypte, Chelsea-Napoli, Man City-Dortmund,
// Ferencvárosi-Qarabag ; casse Côte d'Ivoire-Norvège, seule régression
// mesurée).
var HARMONIE_SEUIL_CONFIRMATION = 60;
function binomeEnHarmonie(binome, theme) {
  var sieges = trouverFigV7(binome, theme);
  return sieges.some(function(s) { return forceMaisonV7(binome, s.pos).force >= HARMONIE_SEUIL_CONFIRMATION; });
}


// CONVERGENCE FIXE/ROTATION (19/07/26, demande utilisateur "indique si les
// deux côtés du verdict se pointe une seule équipe") : compare le camp
// favorisé par le mode fixe (M1 vs M7, chaineDualite().forceMaisons) au
// camp favorisé par la rotation (R1 vs R7, mêmes positions que "Max des
// 4 forces" ci-dessous) — indépendamment de QUEL mécanisme a réellement
// tranché verdictFinal. Signal de confiance affiché à l'utilisateur, PAS
// un nouvel étage de décision (verdictFinal reste inchangé).


// SUPPRIMÉ (20/08/26, élagage demandé par Ellemine_D) : verdictRotationSeule()
// — jamais appelée en dehors d'elle-même et de commentaires, moteur mort
// depuis le passage à verdictFamilialEngine (28/07/26). Dépendait aussi de
// evalSeatRotationSeule() et TIER_SCORE_ROTATION, supprimés avec elle.

// ═══════════════════════════════════════════════════════════════
// 🌳 VERDICT FAMILIAL — MOTEUR (28/07/26, revue couche par couche demandée
// par Ellemine_D : "câble les parties qui vont ensemble"). Port fidèle,
// dans le scope du moteur principal (clés minuscules FIGS_V7/BINOMES_V7/
// ANTAGONISTES_V7), du système construit et validé dans le module matrice
// (byName/houseOf, voir tierWeightFF/familleScore/attaqueVsResistance
// plus haut dans le fichier). AVANT cette revue, verdictFinal() tournait
// sur verdictRotationSeule() — une hiérarchie plate (repos=3, binôme=2,
// neutre=1, antag=0) totalement DÉCONNECTÉE de la hiérarchie à paliers
// (repos=1000, concordance+binôme=100, alliée+binôme=60, concordance=40,
// alliée=20, neutre=3, contradictoire=1) qu'on a patiemment calibrée. Le
// vrai verdict affiché à l'utilisateur n'utilisait RIEN de tout ce travail
// — contradiction majeure, corrigée ici.
function tierWeightFFEngine(fig, m, theme){
  if(!fig) return 1;
  const resident = FIGS_V7[m-1];
  if(fig===resident) return 1000; // REPOS — palier suprême

  // EFFET DE LA RÉSULTANTE (05/08/26, demande explicite Ellemine_D :
  // "Verdict Familial a ignoré les effets de Cauda sur Populus" — exemple
  // concret : Populus en M13, dont la figure de repos est Cauda Draconis ;
  // comme combine(X, Populus)=X toujours (Populus = élément neutre de la
  // combinaison), la résultante en M13 = Cauda Draconis exactement, et ça
  // n'entrait dans AUCUN calcul du moteur familial avant. Ajouté ici comme
  // bonus/malus, via le même système d'interprétation (256 cases) déjà
  // branché ailleurs — additif au tier de base, donc surtout déterminant
  // quand le tier de base est faible (3/1/20/40), quasi négligeable face
  // au palier REPOS (1000).
  let bonusResultante = 0;
  if (theme) {
    const resultante = combine(fig, resident);
    if (resultante !== fig && typeof getInterpretationFootball === 'function') {
      const interp = getInterpretationFootball(resultante, m);
      if (interp) bonusResultante = couleurToScore(interp.couleur);
    }
  }

  const figElem = ELEMENTS_V7[fig], maisonElem = ELEMENT_OF_HOUSE[m];
  const monBinome = BINOMES_V7[fig];
  const binomeActif = figureExistsActive(monBinome, theme);
  if(figElem===maisonElem){
    return (binomeActif ? 100 : 40) + bonusResultante; // CONCORDANCE PARFAITE
  }
  const alliee = (figElem==='feu'&&maisonElem==='air')||(figElem==='air'&&maisonElem==='feu')||(figElem==='eau'&&maisonElem==='terre')||(figElem==='terre'&&maisonElem==='eau');
  if(alliee){
    return (binomeActif ? 60 : 20) + bonusResultante; // CONCORDANCE ALLIÉE
  }
  const contra = (figElem==='feu'&&maisonElem==='eau')||(figElem==='eau'&&maisonElem==='feu')||(figElem==='air'&&maisonElem==='terre')||(figElem==='terre'&&maisonElem==='air');
  return (contra ? 1 : 3) + bonusResultante; // CONTRADICTOIRE : 1 — NEUTRE : 3
}
function poidsSiegeFFEngine(fig, m, theme){
  return tierWeightFFEngine(fig, m, theme);
}
function poidsMembreFFEngine(fig, theme){
  const basePos = []; for(let m=1;m<=16;m++){ if(theme[m]===fig) basePos.push(m); }

  // CORRIGÉ DEUX FOIS (05/08/26) : la première correction ne vérifiait le
  // repos par résultante QUE si la figure n'avait AUCUNE position de
  // base nulle part dans le thème — donc si Carcer avait ne serait-ce
  // qu'une position de base faible ailleurs, la vérification de
  // résultante-repos (à M10, sa propre maison, révélée par Populus) ne
  // se déclenchait jamais. Corrigé : le repos par résultante est
  // maintenant TOUJOURS vérifié, en plus des positions de base, et le
  // meilleur des deux est retenu. Doctrine confirmée par Ellemine_D :
  // "toute figure a sa propre maison qu'elle soit fig de base ou
  // résultante, c'est la même".
  let bestReposResultante = 0;
  for(let m=1;m<=16;m++){
    if (FIGS_V7[m-1] === fig && combine(theme[m], FIGS_V7[m-1]) === fig) { bestReposResultante = 1000; break; }
  }

  if (basePos.length === 0) {
    if (bestReposResultante) return bestReposResultante;
    for(let m=1;m<=16;m++){ if(combine(theme[m], FIGS_V7[m-1])===fig) return 2; }
    return 0;
  }

  const bestBase = Math.max(...basePos.map(m => tierWeightFFEngine(fig, m, theme)));
  return Math.max(bestBase, bestReposResultante);
}
function poidsAttaquantFFEngine(fig, theme){
  const base = poidsMembreFFEngine(fig, theme);
  const monBinome = BINOMES_V7[fig];
  if(!monBinome) return base;
  const soutien = poidsMembreFFEngine(monBinome, theme);
  return base + soutien/10;
}
function attaqueVsResistanceEngine(figCible, mSiege, theme){
  const antagoniste = ANTAGONISTES_V7[figCible];
  const binomeCible = BINOMES_V7[figCible];
  const forceAttaque = poidsAttaquantFFEngine(antagoniste, theme);
  const forceSiege = poidsSiegeFFEngine(figCible, mSiege, theme);
  const soutienBinomeCible = poidsMembreFFEngine(binomeCible, theme);
  const forceResistance = forceSiege + soutienBinomeCible/10;
  const attaqueReussie = forceAttaque > forceResistance;
  return { figCible, antagoniste, binomeCible, forceAttaque, forceSiege, soutienBinomeCible, forceResistance, attaqueReussie, ecart: forceAttaque - forceResistance };
}
function familleTeamsEngine(fig, n){
  const teamA=[fig]; let cur=fig;
  for(let i=1;i<n;i++){ cur = BINOMES_V7[cur]; teamA.push(cur); }
  const teamB = teamA.map(f => ANTAGONISTES_V7[f]);
  return {teamA, teamB};
}
function familleScoreEngine(fig, theme, mSiege){
  const d = familleTeamsEngine(fig, 2), t = familleTeamsEngine(fig, 3), q = familleTeamsEngine(fig, 4), c = familleTeamsEngine(fig, 5);
  function scoreTeamA(arr){ return poidsSiegeFFEngine(arr[0], mSiege, theme) + arr.slice(1).reduce((s,f)=>s+poidsMembreFFEngine(f,theme),0); }
  function scoreTeamB(arr){ return arr.reduce((s,f)=>s+poidsAttaquantFFEngine(f,theme),0); }
  const dA=scoreTeamA(d.teamA), dB=scoreTeamB(d.teamB);
  const tA=scoreTeamA(t.teamA), tB=scoreTeamB(t.teamB);
  const qA=scoreTeamA(q.teamA), qB=scoreTeamB(q.teamB);
  const cA=scoreTeamA(c.teamA), cB=scoreTeamB(c.teamB);
  return { d,t,q,c, net: (dA-dB)+(tA-tB)+(qA-qB)+(cA-cB) };
}
// ═══════════════════════════════════════════════════════════════
// DUALITÉ R1/R7 — FIGURE X + BINÔME/ANTAGONISTE + CHAÎNE D'ANCRAGE
// Intégration au verdict final :
//   R1 + R7 -> X ; si X existe dans le thème et entretient une relation
//   directe avec R1/R7 (binôme, antagoniste, ou binôme de l'antagoniste),
//   sa chaîne d'ancrage peut départager les deux camps.
// Exemple doctrinal : R1=Acquisitio, R7=Fortuna Major -> X=Conjunctio.
// Conjunctio = binôme de l'antagoniste de Fortuna Major (Fortuna Minor),
// donc X peut devenir un ancrage défavorable à R7 et favoriser R1.
// La règle est symétrique pour R7.
// ═══════════════════════════════════════════════════════════════
function dualiteXAncrageR1R7(theme, hR1, hR7, figR1, figR7){
  const X = combine(figR1, figR7);
  if(!X) return {decisive:false, X:X, reason:'Figure X inexistante.'};

  const present = figureExistsBaseOnly(X, theme) || positionsBaseEtResultantes(X, theme).length > 0;
  if(!present) return {decisive:false, X:X, reason:'Figure X absente du thème.'};

  const b1 = BINOMES_V7[figR1];
  const b7 = BINOMES_V7[figR7];
  const a1 = ANTAGONISTES_V7[figR1];
  const a7 = ANTAGONISTES_V7[figR7];
  const ba1 = b1 ? BINOMES_V7[b1] : null;
  const ba7 = b7 ? BINOMES_V7[b7] : null;
  const aa1 = a1 ? ANTAGONISTES_V7[a1] : null;
  const aa7 = a7 ? ANTAGONISTES_V7[a7] : null;

  const relationsR1=[];
  const relationsR7=[];
  if(X===b1) relationsR1.push('binôme direct de R1');
  if(X===a1) relationsR1.push('antagoniste de R1');
  if(X===ba1) relationsR1.push('binôme de l\'antagoniste de R1');
  if(X===aa1) relationsR1.push('antagoniste de l\'antagoniste de R1');
  if(X===b7) relationsR7.push('binôme direct de R7');
  if(X===a7) relationsR7.push('antagoniste de R7');
  if(X===ba7) relationsR7.push('binôme de l\'antagoniste de R7');
  if(X===aa7) relationsR7.push('antagoniste de l\'antagoniste de R7');

  // Chaîne d'ancrage de X évaluée depuis chacun des deux sièges.
  // net > 0 = chaîne favorable au camp du siège ; net < 0 = chaîne défavorable.
  const ancrageR1 = reseauAncrageR1R7(X, hR1, theme, 5);
  const ancrageR7 = reseauAncrageR1R7(X, hR7, theme, 5);
  const netX1 = ancrageR1.net;
  const netX7 = ancrageR7.net;

  // Cas direct : X est rattachée au camp par sa relation et sa chaîne
  // confirme ce camp. Cas adverse : X est liée à R1/R7 mais sa chaîne
  // est défavorable au camp opposé.
  const soutienR1 = relationsR1.length > 0;
  const soutienR7 = relationsR7.length > 0;
  const r1Fort = soutienR1 && netX1 > netX7;
  const r7Fort = soutienR7 && netX7 > netX1;

  if(r1Fort && !r7Fort){
    return {
      decisive:true, winner:'R1', X:X, hR1:hR1, hR7:hR7,
      relationsR1:relationsR1, relationsR7:relationsR7,
      ancrageR1:netX1, ancrageR7:netX7,
      reason:'⚖️ DUALITÉ R1/R7 : R1='+FL[figR1]+' + R7='+FL[figR7]+' → X='+FL[X]+' présente dans le thème. '+FL[X]+' est '+relationsR1.join(' + ')+' ; sa chaîne d\'ancrage est favorable à R1 / défavorable à R7 ('+netX1.toFixed(1)+' vs '+netX7.toFixed(1)+').'
    };
  }
  if(r7Fort && !r1Fort){
    return {
      decisive:true, winner:'R7', X:X, hR1:hR1, hR7:hR7,
      relationsR1:relationsR1, relationsR7:relationsR7,
      ancrageR1:netX1, ancrageR7:netX7,
      reason:'⚖️ DUALITÉ R1/R7 : R1='+FL[figR1]+' + R7='+FL[figR7]+' → X='+FL[X]+' présente dans le thème. '+FL[X]+' est '+relationsR7.join(' + ')+' ; sa chaîne d\'ancrage est favorable à R7 / défavorable à R1 ('+netX7.toFixed(1)+' vs '+netX1.toFixed(1)+').'
    };
  }

  // Règle forte explicitement demandée : X lié au camp et chaîne
  // défavorable à l'autre camp. On exige un net négatif sur le siège adverse.
  if(soutienR1 && netX7 < 0 && netX1 >= netX7){
    return {decisive:true, winner:'R1', X:X, hR1:hR1, hR7:hR7,
      relationsR1:relationsR1, relationsR7:relationsR7, ancrageR1:netX1, ancrageR7:netX7,
      reason:'⚖️ DUALITÉ R1/R7 : X='+FL[X]+' est liée à R1 ('+relationsR1.join(' + ')+') et sa chaîne d\'ancrage est défavorable à R7 (net '+netX7.toFixed(1)+') → R1 gagne.'};
  }
  if(soutienR7 && netX1 < 0 && netX7 >= netX1){
    return {decisive:true, winner:'R7', X:X, hR1:hR1, hR7:hR7,
      relationsR1:relationsR1, relationsR7:relationsR7, ancrageR1:netX1, ancrageR7:netX7,
      reason:'⚖️ DUALITÉ R1/R7 : X='+FL[X]+' est liée à R7 ('+relationsR7.join(' + ')+') et sa chaîne d\'ancrage est défavorable à R1 (net '+netX1.toFixed(1)+') → R7 gagne.'};
  }

  return {decisive:false, X:X, hR1:hR1, hR7:hR7, relationsR1:relationsR1, relationsR7:relationsR7,
    ancrageR1:netX1, ancrageR7:netX7,
    reason:'⚖️ DUALITÉ R1/R7 : X='+FL[X]+' présente, mais la relation/ancrage ne départage pas R1 et R7.'};
}

// ═══════════════════════════════════════════════════════════════
// PUISSANCE ÉLÉMENTAIRE R1/R7 — BRANCHÉE AU MOTEUR PRINCIPAL
// Règle : le niveau correspondant à la nature propre de la figure
// détermine son activation (1=actif, 2=passif). La maison fournit
// l'environnement. Le binôme fournit le relais d'expression.
// Pondération : pouvoir pleinement exprimé +30 ; activation partielle
// +15 ; activation seule +5. Cette couche est additive et ne remplace
// pas les familles, le duel, l'environnement ni les résultantes.
// ═══════════════════════════════════════════════════════════════
// RECONSTRUIT (21/08/26, audit "améliore les moteurs") : elementaireFigureMaison()
// et neutralisationElementaireR1R7() (plus bas) n'existaient NULLE PART
// dans le fichier — appelées mais jamais écrites. Depuis le correctif
// procR1R7 d'hier (qui a mis EN ROUTE l'appel réel à procedureR1R7,
// jusque-là jamais atteint), cette lacune faisait planter
// verdictFamilialEngine sur 100% des thèmes, ET son propre filet de
// secours moteurVerdictFamilial (même dépendance), d'où le repli vers
// le pire cas ("repli secondaire impossible"). Reconstruction basée sur
// les conventions déjà en place dans le moteur :
// - MAP_GEO[fig] = [bitFeu, bitAir, bitEau, bitTerre], valeurs 1=actif
//   (point simple) / 2=passif (point double) — structure géomantique
//   classique déjà utilisée pour les glyphes.
// - figureNature = élément propre de la figure (ELEMENTS_V7).
// - houseNature = élément de la maison (MAISON_ELEM_V7) — "la maison
//   fournit l'environnement" : on lit le bit de la figure correspondant
//   à l'élément de la maison où elle se trouve.
// ⚠️ À VALIDER PAR ELLEMINE_D — reconstruction de bonne foi à partir du
// commentaire doctrinal existant, PAS une règle confirmée par toi.
// ═══════════════════════════════════════════════════════════════
// ALIGNEMENT ACTIF (25/08/26, doctrine Ellemine_D)
// « Ce sont deux choses distinctes, et toutes deux par rapport à la maison
// occupée. Une figure qui aligne ces trois est forte : le niveau d'élément
// actif coïncide avec celui de la maison, ET la figure elle-même coïncide
// avec l'élément de la maison. »
// Exemples donnés, tous deux vérifiés :
//   Puer en M1 (feu) — lignes 1121, actives feu, air, terre. Retenues :
//   feu (conc 1) et air (conc 0,5). Terre est ÉCARTÉE bien qu'active,
//   parce que feu-terre ne vaut que 0,25.
//   Fortuna Major en M4 (terre) — lignes 2211, actives eau et terre, les
//   deux compatibles (0,5 et 1).
//
// ⚠️ CE QUE CET EXEMPLE FIXE : « compatible » veut dire concordance ≥ 0,5.
// Le palier 0,25 (feu-terre, eau-air) n'est PAS compatible ici, même s'il
// n'est pas non plus une opposition. J'avais d'abord conclu « compatible =
// score > 0 » d'après la liste seule ; l'exemple Puer le corrige.
//
// Le compte ne peut valoir que 0, 1 ou 2 : pour un élément de maison donné,
// seuls deux éléments sont compatibles à ≥ 0,5 — lui-même et son partenaire
// de trigone (feu↔air, eau↔terre).
//
// REMPLACE l'ancien critère « activation », qui ne regardait qu'UNE ligne,
// celle de l'élément de la maison, et la disait active ou passive. Pour
// Puer en M1 il comptait 1 là où la doctrine en compte 2 : il ne voyait pas
// que la ligne air est active ET compatible.
function alignementActifV7(fig, house) {
  const ORDRE = ['feu', 'air', 'eau', 'terre'];
  const bits = MAP_GEO[fig] || [2, 2, 2, 2];
  const elemMaison = MAISON_ELEM_V7[house];
  const actives = [], compatibles = [];
  ORDRE.forEach(function (e, i) {
    if (bits[i] !== 1) return;
    actives.push(e);
    if (concordanceElement(e, elemMaison) >= 0.5) compatibles.push(e);
  });
  return {
    fig: fig, house: house, elemMaison: elemMaison,
    lignesActives: actives, actievesCompatibles: compatibles,
    nb: compatibles.length,          // 0, 1 ou 2
    resume: compatibles.length
      ? compatibles.join(' + ') + ' actives et compatibles avec ' + elemMaison
      : (actives.length ? 'aucune ligne active compatible avec ' + elemMaison : 'aucune ligne active')
  };
}

