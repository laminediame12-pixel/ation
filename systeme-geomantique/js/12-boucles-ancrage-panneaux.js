// ═══════════════════════════════════════════════════════════════
// BOUCLES ANCRAGE PANNEAUX
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
function analyserCohabitationBouclesV7(theme, figR1, figR7) {
  const loopR1 = loopOf(figR1), loopR7 = loopOf(figR7);
  const cohabitations = [];
  for (let h = 1; h <= 16; h++) {
    const b = theme[h];
    const r = getResultant(b, h);
    if (b === r) continue; // maison de repos : pas de cohabitation entre boucles
    const loopB = loopOf(b), loopR = loopOf(r);
    if (!loopB || !loopR || loopB === loopR) continue;
    const campB = loopB === loopR1 ? 'R1' : (loopB === loopR7 ? 'R7' : null);
    const campR = loopR === loopR1 ? 'R1' : (loopR === loopR7 ? 'R7' : null);
    if (!campB || !campR || campB === campR) continue;
    const figCampB = campB === 'R1' ? figR1 : figR7;
    const figCampR = campR === 'R1' ? figR1 : figR7;
    const bFamille = (b === figCampB) || (BINOMES_V7[b] === figCampB) || (BINOMES_V7[figCampB] === b);
    const rFamille = (r === figCampR) || (BINOMES_V7[r] === figCampR) || (BINOMES_V7[figCampR] === r);
    const bEnnemi = (b === ANTAGONISTES_V7[figCampB]);
    const rEnnemi = (r === ANTAGONISTES_V7[figCampR]);
    if (!bFamille && !rFamille) continue; // maison sans lien de famille identifiable, ignorée

    // CORRIGÉ (21/08/26, "celui la plus concordante avec la maison") :
    // entre base et résultante, ce n'est PAS la base qui l'emporte par
    // défaut — c'est celle dont l'élément est le plus concordant avec
    // l'élément de la maison (concordanceElement) qui domine.
    const elemMaison = MAISON_ELEM_V7[h];
    const concB = concordanceElement(ELEMENTS_V7[b], elemMaison);
    const concR = concordanceElement(ELEMENTS_V7[r], elemMaison);
    let beneficiaire = null, force = 'simple', raison;
    if (bFamille && rEnnemi) { beneficiaire = campB; force = 'attaque'; raison = 'base amie de ' + campB + ' + résultante attaque ' + campR; }
    else if (rFamille && bEnnemi) { beneficiaire = campR; force = 'attaque'; raison = 'résultante amie de ' + campR + ' + base attaque ' + campB; }
    else if (bFamille && rFamille) {
      if (concB > concR) { beneficiaire = campB; force = 'double présence (base plus concordante, ' + concB + ' vs ' + concR + ')'; raison = 'base amie de ' + campB + ' ET résultante amie de ' + campR + ' — base plus concordante à la maison'; }
      else if (concR > concB) { beneficiaire = campR; force = 'double présence (résultante plus concordante, ' + concR + ' vs ' + concB + ')'; raison = 'base amie de ' + campB + ' ET résultante amie de ' + campR + ' — résultante plus concordante à la maison'; }
      else { beneficiaire = campB; force = 'double présence (égalité de concordance, base par défaut)'; raison = 'concordance identique (' + concB + ') des deux côtés'; }
    }
    else if (bFamille) { beneficiaire = campB; force = 'présence simple (base)'; raison = 'base amie de ' + campB + ', résultante neutre'; }
    else if (rFamille) { beneficiaire = campR; force = 'présence simple (résultante)'; raison = 'résultante amie de ' + campR + ', base neutre'; }
    if (beneficiaire) {
      cohabitations.push({house: h, base: b, resultante: r, campB: campB, campR: campR, concB: concB, concR: concR, beneficiaire: beneficiaire, force: force, raison: raison});
    }
  }
  // Pondération : attaque directe = 2 pts, double présence tranchée par concordance = 1.5, présence simple = 1
  let scoreR1 = 0, scoreR7 = 0;
  cohabitations.forEach(function(c) {
    const w = c.force.indexOf('attaque') === 0 ? 2 : c.force.indexOf('double présence') === 0 ? 1.5 : c.force.indexOf('base') !== -1 ? 1 : 0.5;
    if (c.beneficiaire === 'R1') scoreR1 += w; else if (c.beneficiaire === 'R7') scoreR7 += w;
  });
  return {cohabitations: cohabitations, scoreR1: Math.round(scoreR1 * 100) / 100, scoreR7: Math.round(scoreR7 * 100) / 100};
}

// Cas d'étude validé (21/08/26) : R1=Carcer/R7=Fortuna Major. Rubeus
// (antagoniste de Carcer) a pour binôme Fortuna Minor, qui est
// elle-même l'antagoniste direct de Fortuna Major. Fortuna Minor
// neutralise donc les DEUX camps par deux chemins relationnels
// différents en une seule figure-pivot -> nul structurel.
function detecterNulParPivotV7(theme, figR1, figR7) {
  const antR1 = ANTAGONISTES_V7[figR1];
  const antR7 = ANTAGONISTES_V7[figR7];
  let pivot = null, cibleDirecte = null, campNeutralise = null;
  if (BINOMES_V7[antR1] === antR7) { pivot = antR7; cibleDirecte = figR7; campNeutralise = 'R7 (via binôme de l\'antagoniste R1)'; }
  else if (BINOMES_V7[antR7] === antR1) { pivot = antR1; cibleDirecte = figR1; campNeutralise = 'R1 (via binôme de l\'antagoniste R7)'; }
  if (!pivot) return {actif: false};
  const pivotPresent = trouverFigV7(pivot, theme).length > 0;
  const relaisPresent = trouverFigV7(pivot === antR7 ? antR1 : antR7, theme).length > 0;
  return {actif: pivotPresent, pivot: pivot, antR1: antR1, antR7: antR7,
    cibleDirecte: cibleDirecte, campNeutralise: campNeutralise, relaisPresent: relaisPresent};
}

function filtreJugeM15M16V7(theme, pivotNul) {
  const figM15 = theme[15], figM16 = theme[16];
  // ─── VIA AJOUTÉE LE 29/08/26, ET LA RAISON EST STRUCTURELLE ───
  // Ellemine_D nomme quatre figures qui « figent la M15 » : Populus,
  // Carcer, Via, Conjonctio. La liste du fichier n'en avait que trois —
  // Via manquait. Vérifié : ces quatre-là sont EXACTEMENT les quatre
  // figures SYMÉTRIQUES du système, celles qui se lisent à l'identique
  // renversées (Via 1111, Carcer 1221, Conjonctio 2112, Populus 2222).
  // Les douze autres changent de figure quand on les retourne. La liste
  // n'était donc pas une liste : c'est une famille structurelle, et il en
  // manquait un membre.
  // À savoir aussi : le juge M15 ne peut être QUE l'une des huit figures
  // à points pairs — les quatre symétriques en forment exactement la
  // moitié. « M15 figée » est donc vrai sur 50 % des thèmes possibles
  // (mesuré : 32 768 sur 65 536), pas sur un quart.
  const NUL_FREQUENT_M15 = {populus: 1, carcer: 1, via: 1, conjunctio: 1};
  const m15FavoriseNul = !!NUL_FREQUENT_M15[figM15];
  const m13m14Identiques = theme[13] === theme[14];
  const m13m14Opposees = ANTAGONISTES_V7[theme[13]] === theme[14];
  const enSuspens = !!(pivotNul && pivotNul.actif);
  return {figM15: figM15, figM16: figM16, m15FavoriseNul: m15FavoriseNul,
    m13m14Identiques: m13m14Identiques, m13m14Opposees: m13m14Opposees, enSuspens: enSuspens};
}

function analyserReseauAncrageV2(theme) {
  const rot = getRotationOrderFromRepos(theme[1]);
  const hR1 = rot[0], hR7 = rot[6];
  const figR1 = theme[hR1], figR7 = theme[hR7];
  const loopR1 = loopOf(figR1), loopR7 = loopOf(figR7);
  const memeBoucle = !!(loopR1 && loopR7 && loopR1 === loopR7);

  const resistanceR1 = analyserResistanceV7(figR1, theme);
  const resistanceR7 = analyserResistanceV7(figR7, theme);
  const confrontation = analyserConfrontationDirecteV7(theme, figR1, figR7);
  const cohabitation = analyserCohabitationBouclesV7(theme, figR1, figR7);
  const pivotNul = detecterNulParPivotV7(theme, figR1, figR7);
  const filtreJuge = filtreJugeM15M16V7(theme, pivotNul);
  // BRANCHÉ (21/08/26, "vas-y branche-le, je suis confiant") : score de
  // force positionnelle des deux ancrages dans leur maison de siège
  // (concordance + déplacement + multiplicité, cf. forceFigureMaisonV7).
  const forceR1 = forceFigureMaisonV7(figR1, hR1, theme);
  const forceR7 = forceFigureMaisonV7(figR7, hR7, theme);

  let syntheseTxt, winner;
  if (filtreJuge.enSuspens) {
    winner = 'Nul';
    syntheseTxt = 'M16 MET LE SCORE EN SUSPENS — pivot de neutralisation actif (' + FL[pivotNul.pivot] + ' neutralise ' + pivotNul.campNeutralise + '). Score nul recommandé (0-0), aucun camp ne peut trancher net.';
  } else if (memeBoucle) {
    // CAS 2 (même boucle) : la solidité se compare directement par la
    // force positionnelle (concordance élémentaire de maison + renfort
    // allié/ennemi + multiplicité), pas par la chaîne d'antagonisme
    // (les deux camps partagent la même famille de figures).
    if (forceR1.score > forceR7.score) {
      winner = 'R1';
      syntheseTxt = 'Même boucle : chaîne R1 (' + FL[figR1] + ', score ' + forceR1.score + ') plus solide que R7 (' + FL[figR7] + ', score ' + forceR7.score + ') — avantage R1.';
    } else if (forceR7.score > forceR1.score) {
      winner = 'R7';
      syntheseTxt = 'Même boucle : chaîne R7 (' + FL[figR7] + ', score ' + forceR7.score + ') plus solide que R1 (' + FL[figR1] + ', score ' + forceR1.score + ') — avantage R7.';
    } else {
      winner = null;
      syntheseTxt = 'Même boucle : forces positionnelles égales (' + forceR1.score + ' de part et d\'autre) — pas de signal net.';
    }
  } else if (resistanceR1.statut === 'vulnérable' && resistanceR7.statut !== 'vulnérable') {
    winner = 'R7';
    syntheseTxt = 'R1 (' + FL[figR1] + ') vulnérable, R7 (' + FL[figR7] + ') tient — avantage R7' + (confrontation.camp === 'R7' ? ' (confirmé par la résultante)' : '') + '.';
  } else if (resistanceR7.statut === 'vulnérable' && resistanceR1.statut !== 'vulnérable') {
    winner = 'R1';
    syntheseTxt = 'R7 (' + FL[figR7] + ') vulnérable, R1 (' + FL[figR1] + ') tient — avantage R1' + (confrontation.camp === 'R1' ? ' (confirmé par la résultante)' : '') + '.';
  } else if (confrontation.attaqueR1 || confrontation.attaqueR7) {
    // AJOUTÉ (21/08/26) : la résultante R1+R7 attaque directement l'un
    // des deux camps — signal plus fort qu'une simple appartenance de
    // boucle, prioritaire sur la cohabitation et la force positionnelle.
    winner = confrontation.camp;
    syntheseTxt = 'Résistances comparables — mais la résultante (' + FL[confrontation.resultante] + ') ' + confrontation.natureLien + ' → avantage ' + confrontation.camp + '.';
  } else if (cohabitation.scoreR1 !== cohabitation.scoreR7) {
    // AJOUTÉ (21/08/26, "tu as ignoré la cohabitation") : maisons où les
    // figures des deux boucles cohabitent (base/résultante croisées),
    // départagées par concordance élémentaire à la maison.
    const campCohab = cohabitation.scoreR1 > cohabitation.scoreR7 ? 'R1' : 'R7';
    winner = campCohab;
    syntheseTxt = 'Résistances et résultante neutres — départage par cohabitation des boucles (R1 ' + cohabitation.scoreR1 + ' vs R7 ' + cohabitation.scoreR7 + ', ' + cohabitation.cohabitations.length + ' maison(s) croisée(s)) : avantage ' + campCohab + '.';
  } else if (forceR1.score !== forceR7.score) {
    // Départage par la force positionnelle en dernier recours.
    const campForce = forceR1.score > forceR7.score ? 'R1' : 'R7';
    winner = campForce;
    syntheseTxt = 'Résistances, résultante et cohabitation neutres — départage par la force positionnelle (R1 ' + forceR1.score + ' vs R7 ' + forceR7.score + ') : avantage ' + campForce + '.';
  } else {
    winner = null;
    syntheseTxt = 'Résistances, résultante, cohabitation et forces positionnelles tous neutres — pas de signal net.';
  }
  if (filtreJuge.m15FavoriseNul && !filtreJuge.enSuspens) {
    syntheseTxt += ' ⚠️ M15 (' + FL[filtreJuge.figM15] + ') est une figure fréquente pour le nul — à surveiller malgré le signal ci-dessus.';
  }

  return {
    hR1: hR1, hR7: hR7, figR1: figR1, figR7: figR7, memeBoucle: memeBoucle, winner: winner,
    resistanceR1: resistanceR1, resistanceR7: resistanceR7, forceR1: forceR1, forceR7: forceR7,
    confrontation: confrontation, cohabitation: cohabitation, pivotNul: pivotNul, filtreJuge: filtreJuge,
    synthese: syntheseTxt
  };
}

function renderReseauAncrageV2(theme) {
  const el = document.getElementById('reseau-ancrage-v2-panel');
  if (!el) return;
  if (!theme) { el.innerHTML = ''; return; }
  const a = analyserReseauAncrageV2(theme);

  function ligneResistance(label, r, couleur) {
    // La figure de front n'est affichée que quand elle est pertinente :
    // le protecteur est présent mais sa propre menace (antagoniste du
    // protecteur) l'est aussi — c'est le seul cas où le front peut faire
    // basculer voieA (protégé si front présent, vulnérable sinon).
    const frontTxt = r.protecteurPresent && r.menaceProtecteurPresent
      ? ' · figure de front ' + FL[r.front] + (r.frontPresent
          ? ' (présente — sécurise ' + FL[r.protecteur] + ' contre ' + FL[r.menaceProtecteur] + ')'
          : ' (ABSENTE — ' + FL[r.menaceProtecteur] + ' menace ' + FL[r.protecteur] + ' sans opposition)')
      : '';
    const voieTxt = r.statut === 'libre' ? 'rien ne la menace'
      : r.statut === 'protégé' ? 'protégée — voie ' + r.voieActive
      : r.protecteurMenace ? 'vulnérable — protecteur présent mais menacé, figure de front absente'
      : 'vulnérable, aucune voie de résistance active';
    return '<div style="font-size:11px; margin-bottom:3px;">'
      + '<b style="color:' + couleur + ';">' + label + ' (' + FL[r.fig] + ')</b> — antagoniste ' + FL[r.antagoniste] + (r.antagonistePresent ? ' (présent)' : ' (absent)')
      + ' · protecteur ' + FL[r.protecteur] + (r.protecteurPresent ? ' (présent)' : ' (absent)')
      + frontTxt
      + ' · repos ' + (r.enRepos ? 'oui' : 'non') + ' · binômes ' + FL[r.bin1] + '/' + FL[r.bin2] + ' ' + (r.bin1Present && r.bin2Present ? '(chaîne complète)' : '(incomplète)')
      + ' → <b>' + voieTxt + '</b></div>';
  }

  const c = a.confrontation;
  const p = a.pivotNul;
  const j = a.filtreJuge;

  el.innerHTML = '<h3 style="margin-bottom:2px;">🕸️ Réseau d\'ancrage — analyse complète</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:10px;">Doctrine complète Ellemine_D (21/08/26, figure de front ajoutée le 24/08/26) : résistance par chaîne (protecteur + figure de front), confrontation directe, pivot de neutralisation, filtre M15/M16. 📚 étude, moteur décisif du panneau principal (cf. renderTheme).</div>'
    + '<div style="font-size:12px; margin-bottom:8px;">Mode : <b>' + (a.memeBoucle ? 'MÊME BOUCLE' : 'BOUCLES DIFFÉRENTES') + '</b></div>'
    + '<div style="border:1px solid #334155; border-radius:8px; padding:10px; margin-bottom:10px;">'
      + '<div style="font-weight:700; font-size:12px; margin-bottom:6px; color:#f1f5f9;">① Résistance des deux ancrages</div>'
      + ligneResistance('R1', a.resistanceR1, '#4F7CF7')
      + ligneResistance('R7', a.resistanceR7, '#E08A3C')
      + '<div style="font-size:11px; margin-top:6px; color:#94a3b8;">Force positionnelle — R1 : concordance ' + a.forceR1.concordance + ', déplacement ' + a.forceR1.deplacement + ', ×' + a.forceR1.multiplicite + ' → <b style="color:#4F7CF7;">score ' + a.forceR1.score + '</b> · R7 : concordance ' + a.forceR7.concordance + ', déplacement ' + a.forceR7.deplacement + ', ×' + a.forceR7.multiplicite + ' → <b style="color:#E08A3C;">score ' + a.forceR7.score + '</b></div>'
    + '</div>'
    + '<div style="border:1px solid #334155; border-radius:8px; padding:10px; margin-bottom:10px;">'
      + '<div style="font-weight:700; font-size:12px; margin-bottom:6px; color:#f1f5f9;">② Confrontation directe (résultante R1+R7)</div>'
      + '<div style="font-size:11px;">' + FL[a.figR1] + ' + ' + FL[a.figR7] + ' = <b>' + FL[c.resultante] + '</b> — camp : <b>' + (c.camp || '—') + '</b></div>'
      + '<div style="font-size:11px;">Solidité de la résultante : repos ' + (c.enRepos ? 'oui' : 'non') + ', binôme ' + FL[c.binome] + ' en repos ' + (c.binomeEnRepos ? 'oui' : 'non') + ' → <b>' + c.resistance.statut + '</b></div>'
    + '</div>'
    + '<div style="border:1px solid ' + (p.actif ? '#f87171' : '#334155') + '; border-radius:8px; padding:10px; margin-bottom:10px;">'
      + '<div style="font-weight:700; font-size:12px; margin-bottom:6px; color:#f1f5f9;">③ Pivot de neutralisation (cas d\'étude Carcer/Fortuna Major)</div>'
      + (p.actif
          ? '<div style="font-size:11px; color:#f87171;">⚠️ ACTIF — ' + FL[p.pivot] + ' neutralise ' + p.campNeutralise + ' (antagoniste direct + binôme de l\'antagoniste adverse ' + FL[p.pivot === p.antR7 ? p.antR1 : p.antR7] + (p.relaisPresent ? ', présent' : ', absent du thème') + ')</div>'
          : '<div style="font-size:11px; color:#94a3b8;">Aucun pivot de double-neutralisation détecté sur ce thème.</div>')
    + '</div>'
    + '<div style="border:1px solid ' + (j.enSuspens ? '#f87171' : '#334155') + '; border-radius:8px; padding:10px; margin-bottom:10px;">'
      + '<div style="font-weight:700; font-size:12px; margin-bottom:6px; color:#f1f5f9;">④ Filtre Juge M15/M16</div>'
      + '<div style="font-size:11px;">M15 = ' + FL[j.figM15] + (j.m15FavoriseNul ? ' <span style="color:#facc15;">(figure fréquente pour le nul)</span>' : '') + ' · M16 = ' + FL[j.figM16] + '</div>'
      + '<div style="font-size:11px;">M13/M14 : ' + (j.m13m14Identiques ? 'identiques' : j.m13m14Opposees ? 'opposées' : 'ni identiques ni opposées') + '</div>'
      + (j.enSuspens ? '<div style="font-size:11px; color:#f87171; margin-top:4px;">⚠️ M16 MET LE SCORE EN SUSPENS — score nul recommandé (0-0)</div>' : '')
    + '</div>'
    + '<div style="background:#111a2e; border-radius:8px; padding:10px; font-size:12px; font-weight:600;">🔎 ' + a.synthese + '</div>';
}

// Réciproque des noms courts capitalisés utilisés par la grille du carré
// géo (data-fig="Puer","Caput"...) — nécessaire pour cibler les cellules
// depuis les clés internes minuscules (puer, caput_draconis...).
var REV_NORM_FIG_LOOP = {};
Object.keys(NORM_FIG_LOOP).forEach(function(k){ REV_NORM_FIG_LOOP[NORM_FIG_LOOP[k]] = k; });

function renderProtectionChaineV7(theme) {
  const el = document.getElementById('protection-chaine-panel');
  if (!theme) { if (el) el.innerHTML = ''; return; }
  const analyse = analyserProtectionV7(theme);

  if (!el) return;
  const libres = analyse.filter(function(a){ return a.statut === 'libre'; });
  const vulnerables = analyse.filter(function(a){ return a.statut === 'vulnérable'; });
  const proteges = analyse.filter(function(a){ return a.statut === 'protégé'; });
  const protecteursAbsents = analyse.filter(function(a){ return !a.protecteurPresent; });

  function ligne(a) {
    return '<div style="font-size:11px; color:'+a.couleur+'; margin-bottom:3px;">'
      + FL[a.fig] + ' — antagoniste '+FL[a.antagoniste]+(a.antagonistePresent?' (présent)':' (absent)')
      + ' · protecteur '+FL[a.protecteur]+(a.protecteurPresent?(a.protecteurEnRepos?' (présent, EN REPOS 🛡)':' (présent)'):' (absent ⚠️)')
      + ' → <b>'+a.statut+'</b></div>';
  }

  el.innerHTML = '<h3 style="margin-bottom:2px;">🛡️ Protection par chaîne d\'antagonisme</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:10px;">Fait découvert par Ellemine_D (21/08/26) : protecteur(X) = antagoniste(antagoniste(X)), décalage de +10 positions dans le cycle des 16 figures — reste toujours dans la même boucle. 📚 doctrine nouvelle, non validée sur l\'archive, aucun poids sur verdictFinal.</div>'
    + '<div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:10px; font-size:12px;">'
      + '<div>🟢 Libres : <b>'+libres.length+'</b></div>'
      + '<div>🟣 Protégées : <b>'+proteges.length+'</b></div>'
      + '<div>🔴 Vulnérables : <b>'+vulnerables.length+'</b></div>'
    + '</div>'
    + (protecteursAbsents.length ? '<div style="font-size:11px; color:#f87171; margin-bottom:8px;">⚠️ Boucliers absents du thème (base) : '+protecteursAbsents.map(function(a){return FL[a.protecteur];}).join(', ')+'</div>' : '')
    + '<details><summary style="cursor:pointer; font-size:12px;">Détail des 16 figures</summary>'
    + analyse.map(ligne).join('')
    + '</details>';
}


// AUTO-RÉFÉRENCE GÉNÉRATIVE (03/08/26, 📚 étude, hypothèse Ellemine_D) —
// parcourt les 6 étages de la génération classique (Mères → Filles →
// Nièces → Témoins → Juge → Réconciliation) et vérifie, à CHAQUE étage,
// si une paire d'équilibre ou une répétition exacte de figure apparaît.
// Hypothèse testée sur le tirage Carcer/Rubeus/Carcer/Conjonctio (score
// réel 2-2) : les 6 étages étaient positifs. À contre-tester sur
// d'autres nuls archivés avant toute promotion vers verdictFinal.
function analyserAutoReferenceGenerative(theme) {
  function diagnosticNiveau(figs, comparerA) {
    var paires = [];
    var repetitions = [];
    for (var i = 0; i < figs.length; i++) {
      for (var j = i + 1; j < figs.length; j++) {
        if (figs[i] === figs[j] && repetitions.indexOf(figs[i]) === -1) repetitions.push(figs[i]);
        if (estPaireEquilibre(figs[i], figs[j])) paires.push(figs[i] + ' / ' + figs[j]);
      }
    }
    // Pour les étages à figure unique (Juge, Réconciliation) : on compare
    // aussi à un ensemble de référence externe (les 4 mères, ou le repos
    // naturel de la maison).
    if (comparerA) {
      figs.forEach(function(f) {
        comparerA.forEach(function(ref) {
          if (f === ref && repetitions.indexOf(f) === -1) repetitions.push(f);
          if (estPaireEquilibre(f, ref)) paires.push(f + ' / ' + ref);
        });
      });
    }
    return { paires: paires, repetitions: repetitions, positif: (paires.length > 0 || repetitions.length > 0) };
  }

  const niveaux = [
    { nom: 'Mères', maisons: [1,2,3,4], diag: diagnosticNiveau([theme[1],theme[2],theme[3],theme[4]]) },
    { nom: 'Filles', maisons: [5,6,7,8], diag: diagnosticNiveau([theme[5],theme[6],theme[7],theme[8]]) },
    { nom: 'Nièces', maisons: [9,10,11,12], diag: diagnosticNiveau([theme[9],theme[10],theme[11],theme[12]]) },
    { nom: 'Témoins', maisons: [13,14], diag: diagnosticNiveau([theme[13],theme[14]]) },
    { nom: 'Juge', maisons: [15], diag: diagnosticNiveau([theme[15]], [theme[1],theme[2],theme[3],theme[4]]) },
    { nom: 'Réconciliation', maisons: [16], diag: diagnosticNiveau([theme[16]], [FIGS_V7[15], theme[15]]) }
  ];

  const score = niveaux.filter(function(n) { return n.diag.positif; }).length;
  return { niveaux: niveaux, score: score, ratio: score + '/6' };
}

function figureDuJour(d){
  d = d || new Date();
  return FIGS[(d.getDate() + d.getMonth()*3) % 16];
}
function toggleValiditePanel() {
  var panel = document.getElementById('validite-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var theme = currentTheme;
    // MAINTENANCE (03/09/26) : les 4 axes viennent désormais du même calcul
    // partagé que les 4 autres chemins de validité (evaluerAxesValidite,
    // cf. combineMany) au lieu d'une 5e copie locale.
    var axesRes = evaluerAxesValidite(theme);
    var axesByKey = {}; axesRes.forEach(function(r){ axesByKey[r.key] = r; });
    var axeC = axesByKey.cardinal.fig, axeS = axesByKey.succedent.fig,
      axeCad = axesByKey.cadent.fig, axePartage = axesByKey.partage.fig;
    var binM1 = BINOMES[theme[1]];
    var posAxeC = axesByKey.cardinal.positions;
    var posAxeS = axesByKey.succedent.positions;
    var posAxeCad = axesByKey.cadent.positions;
    var posAxePartage = axesByKey.partage.positions;
    var posBinM1 = positionsBaseEtResultantes(binM1, theme);
    var invalide = themeInvalidite(theme);

    var fdj = figureDuJour();
    var posFdj = positionsBaseEtResultantes(fdj, theme);
    var dateLabel = new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'});

    function condCard(titre, sousTitre, figure, positions){
      var present = positions.length > 0;
      var bg = present ? 'linear-gradient(135deg, rgba(74,222,128,.12), rgba(74,222,128,.03))' : 'linear-gradient(135deg, rgba(248,113,113,.12), rgba(248,113,113,.03))';
      var border = present ? '#4ade80' : '#f87171';
      var badge = present ? '<span style="background:#166534; color:#4ade80; border-radius:999px; padding:2px 10px; font-size:11px; font-weight:600;">✓ PRÉSENTE</span>' : '<span style="background:#7f1d1d; color:#f87171; border-radius:999px; padding:2px 10px; font-size:11px; font-weight:600;">✗ ABSENTE</span>';
      return '<div style="background:'+bg+'; border:1px solid '+border+'; border-radius:10px; padding:12px 14px; display:flex; flex-direction:column; gap:6px;">'
        + '<div style="display:flex; justify-content:space-between; align-items:center;"><b style="font-size:13px;">'+titre+'</b>'+badge+'</div>'
        + '<div style="font-size:11px; color:#94a3b8;">'+sousTitre+'</div>'
        + '<div style="font-size:16px; font-weight:600;">'+FL[figure]+'</div>'
        + '<div style="font-size:11px; color:#cbd5e1;">'+(present ? 'en '+positions.join(', ') : 'absente du thème (base et résultante)')+'</div>'
        + '</div>';
    }

    var html = '<h3 style="margin-bottom:2px;">🗓️ Validité du thème &amp; figure du jour</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:12px;">Les TROIS axes du carré — Cardinal M1+M4+M7+M10 (angulaire), Succédent M2+M5+M8+M11, Cadent M3+M6+M9+M12 — plus l\'Axe du Partage M3+M5+M9+M11 ajouté le 31/08/26 — doivent tous exister dans le thème (base ou résultante) pour qu\'il soit valide, protocole appliqué en direct au verdict. Les trois premiers sont les seules classes de pas 3 : prolonger un axe y ramène (4-7-10-1 = 1-4-7-10). Le quatrième n\'est pas une classe de pas 3 et ne prétend pas l\'être : c\'est le rectangle de deux oppositions croisées (3-9 et 5-11), dont les diagonales coupent celles du carré cardinal aux quatre paires, et qui est la part PARTAGÉE par les deux trigones de M1 et M7 — trigone(M1) ⊕ trigone(M7) = ce rectangle ⊕ M1 ⊕ M7, vérifié 2000/2000 (loi N). Coût mesuré : le taux de thèmes valides passe de 72,3 % à 63,6 %. L\'ancien « Axe Temporel » M3+M5+M11+M15, lui, reste retiré : il empruntait M15, un témoin hors du carré des douze. La figure du jour et le binôme de M1 restent affichés à titre indicatif (non bloquants). Doctrine angulaire/succédente/cadente importée le 03/08/26, non encore validée empiriquement.</div>';

    html += '<div style="border-radius:10px; padding:12px 16px; margin-bottom:14px; font-weight:600; text-align:center; '
      + (invalide ? 'background:#7f1d1d; color:#fecaca;' : 'background:#166534; color:#bbf7d0;') + '">'
      + (invalide ? '⛔ THÈME INVALIDE' : '✅ THÈME VALIDE') + '</div>';

    // ─── VALIDITÉ — TROIS CRITÈRES SUR LE THÈME LUI-MÊME (04/09/26) ───
    // Ellemine_D : « ne compte plus les dérivés ». Le panneau suit : les
    // trois critères comptés d'abord, les dérivés en dessous, désignés
    // pour ce qu'ils sont devenus — la matière de la porte de confiance,
    // hors du compte. Cf. le bloc de niveauValiditeV7.
    var nv = null;
    try { nv = niveauValiditeV7(theme); } catch (e) { nv = null; }
    if (nv && nv.applicable) {
      var couleurNv = nv.complet ? '#4ade80' : nv.niveau >= 2 ? '#fbbf24' : '#94a3b8';
      html += '<div style="border:1px solid ' + couleurNv + '; border-radius:10px; padding:10px 14px; margin-bottom:14px;">'
        + '<div style="display:flex; justify-content:space-between; align-items:center;">'
        + '<b style="font-size:13px;">🎯 Validité — les 3 axes · le binôme de M1 · la figure du jour</b>'
        + '<span style="background:' + couleurNv + '33; color:' + couleurNv + '; border-radius:999px; padding:2px 10px; font-size:11px; font-weight:600;">'
        + nv.niveau + '/3</span></div>'
        + '<div style="font-size:11px; margin-top:6px; color:#cbd5e1;">'
        + 'les 3 axes du thème ' + (nv.base.axes.ok ? '✓' : '✗')
        + ' <span style="color:#94a3b8;">(Cardinal ' + (nv.base.axes.cardinal && nv.base.axes.cardinal.ok ? '✓' : '✗')
        + ' · Succédent ' + (nv.base.axes.succedent && nv.base.axes.succedent.ok ? '✓' : '✗')
        + ' · Cadent ' + (nv.base.axes.cadent && nv.base.axes.cadent.ok ? '✓' : '✗') + ')</span><br>'
        + 'binôme de M1 ' + (nv.base.binome.ok ? '✓' : '✗')
        + ' <span style="color:#94a3b8;">(' + (FL[nv.base.binome.fig] || '') + ')</span><br>'
        + 'figure du jour ' + (nv.fdjOk ? '✓' : '✗')
        + ' <span style="color:#94a3b8;">(' + (FL[nv.fdj] || nv.fdj) + ')</span>'
        + '</div>'
        + '<div style="font-size:10.5px; margin-top:8px; padding-top:7px; border-top:1px solid #33415555; color:#94a3b8;">'
        + '<b>Hors du compte</b> — les trois thèmes dérivés, gardés pour la porte de confiance :<br>'
        + nv.derives.map(function (d) {
            return '&nbsp;&nbsp;' + d.nom + ' : axes ' + (d.axes.ok ? '✓' : '✗') + ' · binôme ' + (d.binome.ok ? '✓' : '✗');
          }).join('<br>')
        + '</div>'
        + '<div class="muted" style="font-size:11px; margin-top:6px;">⚠️ <b>Ce niveau ne pèse rien sur le verdict, et il ne le peut pas.</b> '
        + 'Mesuré au banc sur 58 cas, l\'ancien niveau ne gagnait aucune famille — quatre des cinq familles lisibles penchaient du côté des thèmes SOUS le seuil (camp 64 % / 69 %, p = 0,732). C\'est pourquoi le rejet a été levé le 04/09. '
        + 'Et le critère « figure du jour » dépend de la DATE : le même thème peut valoir 3/3 aujourd\'hui et 2/3 demain, donc aucun taux « par niveau » n\'est une constante. '
        + 'La validité continue de se jouer ailleurs : le départage de deux tirages du MÊME match (registre des paires).</div>'
        + '</div>';
    }
    html += '<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:10px; margin-bottom:14px;">';
    html += condCard('Axe Cardinal (angulaire)', 'M1 + M4 + M7 + M10', axeC, posAxeC);
    html += condCard('Axe Succédent', 'M2 + M5 + M8 + M11', axeS, posAxeS);
    html += condCard('Axe Cadent', 'M3 + M6 + M9 + M12', axeCad, posAxeCad);
    html += condCard('Axe du Partage', 'M3 + M5 + M9 + M11', axePartage, posAxePartage);
    html += condCard('Binôme de M1 (indicatif)', 'BINOMES[' + FL[theme[1]] + ']', binM1, posBinM1);
    html += '</div>';

    // SIGNAL DÉDIÉ — TÉMOINS EN ÉQUILIBRE (03/08/26, 📚 étude, doctrine
    // Ellemine_D). Affiché séparément et en évidence, avant le score
    // composite à 6 étages, car désigné comme spécifiquement plus fiable.
    var sigTem = signalTemoinsEnEquilibre(theme);
    var temCol = sigTem.enEquilibre ? '#f87171' : '#4ade80';
    html += '<div style="border:2px solid '+temCol+'; background:'+temCol+'18; border-radius:10px; padding:12px 16px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">';
    html += '<div><b style="font-size:13px;">⚖️ Témoins en équilibre (M13/M14)</b><br><span style="font-size:12px; color:#cbd5e1;">'+FL[sigTem.td]+' (droit) / '+FL[sigTem.tg]+' (gauche)</span></div>';
    html += '<span style="background:'+temCol+'33; color:'+temCol+'; border-radius:999px; padding:4px 12px; font-size:12px; font-weight:700;">'+(sigTem.enEquilibre ? '⚠️ OPPOSÉS' : '✓ non opposés')+'</span>';
    html += '</div>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:14px; margin-top:-8px;">📚 Étude (03/08/26) — doctrine : "au niveau des témoins, souvent nul quand les témoins sont opposés (en équilibre)". Signal isolé, taux réel encore à établir sur l\'archive, aucun poids sur verdictFinal.</div>';

    // STRUCTURE DU NUL (04/08/26, 📚 étude, doctrine complète Ellemine_D) —
    // Juge 1/Juge 2 (M13/M14) → Reconstruction (M15) → Sentence (M16).
    var sdn = structureDuNul(theme);
    var sdnCol = sdn.nulDetecte ? '#f87171' : '#4ade80';
    html += '<div style="border:2px solid '+sdnCol+'; background:'+sdnCol+'12; border-radius:10px; padding:12px 16px; margin-bottom:14px;">';
    html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><b style="font-size:13px;">⚖️ Structure du Nul</b><span style="background:'+sdnCol+'33; color:'+sdnCol+'; border-radius:999px; padding:4px 12px; font-size:12px; font-weight:700;">'+(sdn.nulDetecte ? '⚠️ NUL DÉTECTÉ' : '✓ pas de nul structurel')+'</span></div>';
    html += '<div style="font-size:12px; line-height:1.7;">';
    html += 'Juge 1 (M13) : <b>'+FL[sdn.juge1]+'</b>'+(sdn.classement.juge1 ? ' <span style="color:#94a3b8;">('+sdn.classement.juge1+')</span>' : '')+'<br>';
    html += 'Juge 2 (M14) : <b>'+FL[sdn.juge2]+'</b>'+(sdn.classement.juge2 ? ' <span style="color:#94a3b8;">('+sdn.classement.juge2+')</span>' : '')+'<br>';
    html += 'Identité (M13=M14) : '+(sdn.nulParIdentite ? '<span style="color:#f87171;">OUI</span>' : 'non')+' — Opposition (paire) : '+(sdn.nulParOpposition ? '<span style="color:#f87171;">OUI</span>' : 'non')+'<br>';
    html += 'Reconstruction (M15) : <b>'+FL[sdn.reconstruction]+'</b>'+(sdn.classement.reconstruction ? ' <span style="color:#94a3b8;">('+sdn.classement.reconstruction+')</span>' : '')+'<br>';
    html += 'Sentence (M16) : <b>'+FL[sdn.sentence]+'</b>'+(sdn.classement.sentence ? ' <span style="color:#94a3b8;">('+sdn.classement.sentence+')</span>' : '')+' — manière dont le nul se manifeste';
    html += '</div></div>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:14px; margin-top:-8px;">📚 Étude (04/08/26) — nul par identité (M13=M14) ou par opposition (paire de FIGURES_EQUILIBRE), figures fréquentes (Carcer/Conjonctio/Populus/Via) et conditionnelles (Acquisitio/Fortuna Minor/Fortuna Major) en italique. Aucun poids sur verdictFinal.</div>';

    // AUTO-RÉFÉRENCE GÉNÉRATIVE (03/08/26, 📚 étude) — voir
    // analyserAutoReferenceGenerative. Affichage informatif seul.
    var autoRef = analyserAutoReferenceGenerative(theme);
    var autoRefCol = autoRef.score >= 5 ? '#f87171' : (autoRef.score >= 3 ? '#facc15' : '#4ade80');
    html += '<div style="border:1px solid '+autoRefCol+'; border-radius:10px; padding:12px 16px; margin-bottom:14px;">';
    html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"><b style="font-size:13px;">🔁 Auto-référence générative (Mères → Réconciliation)</b><span style="background:'+autoRefCol+'33; color:'+autoRefCol+'; border-radius:999px; padding:2px 10px; font-size:11px; font-weight:600;">'+autoRef.ratio+' étages</span></div>';
    html += '<div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">📚 Étude (03/08/26) — hypothèse en cours de test : plus la chaîne Mères→Filles→Nièces→Témoins→Juge→Réconciliation manifeste de paires d\'équilibre ou de répétitions exactes, plus le thème serait structurellement enclin au nul. Non validé, aucun poids sur verdictFinal.</div>';
    html += '<div style="display:flex; flex-direction:column; gap:4px; font-size:11px;">';
    autoRef.niveaux.forEach(function(n) {
      var marque = n.diag.positif ? '✅' : '➖';
      var detail = n.diag.paires.concat(n.diag.repetitions.map(function(r){return r+' (répété)';})).join(', ');
      html += '<div>'+marque+' <b>'+n.nom+'</b> (M'+n.maisons.join('/M')+')' + (detail ? ' — '+detail : '') + '</div>';
    });
    html += '</div></div>';

    var fdjPresent = posFdj.length > 0;
    var fdjBg = fdjPresent ? 'linear-gradient(135deg, rgba(96,165,250,.16), rgba(96,165,250,.03))' : 'linear-gradient(135deg, rgba(148,163,184,.12), rgba(148,163,184,.02))';
    var fdjBorder = fdjPresent ? '#60a5fa' : '#475569';
    html += '<div style="background:'+fdjBg+'; border:1px solid '+fdjBorder+'; border-radius:10px; padding:14px 16px; display:flex; flex-direction:column; gap:6px;">';
    html += '<div style="display:flex; justify-content:space-between; align-items:center;"><b style="font-size:13px;">🔮 Figure du jour — ' + dateLabel + '</b>'
      + (fdjPresent ? '<span style="background:#1e3a8a; color:#93c5fd; border-radius:999px; padding:2px 10px; font-size:11px; font-weight:600;">DANS LE THÈME</span>' : '<span style="background:#334155; color:#94a3b8; border-radius:999px; padding:2px 10px; font-size:11px; font-weight:600;">ABSENTE</span>') + '</div>';
    html += '<div style="font-size:18px; font-weight:600;">' + FL[fdj] + '</div>';
    html += '<div style="font-size:12px; color:#cbd5e1;">' + (fdjPresent
      ? 'Présente en ' + posFdj.join(', ') + ' — le climat du jour rejoint le thème, sa figure y résonne directement.'
      : 'Absente du thème — le jour ne s\'imprime pas directement dans ce tirage.') + '</div>';
    html += '</div>';

    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
function toggleGuerreCivileR1R7Panel() {
  var panel = document.getElementById('guerre-civile-r1r7-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var theme = currentTheme;
    var gc = guerreCivileR1R7(theme);
    var html = '<h3>⚔️ Guerre civile généralisée — R1 vs R7</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Hypothèse en test (16/07/26) : la vraie confrontation ne serait pas M1 contre M7, mais R1 (maison de repos naturelle de M1) contre R7 (6 crans plus loin). Rejoue ici toute la cascade guerre civile du jour (attaques effectives, bouclier libre, état des chefs, chaîne de force) sur ce nouveau couple. Statut (04/08/26, recalculé sur 70 matchs réels) : R1/R7 = 26,8% de précision (11/41 applicable), M1/M7 = 37,1% (13/35) — R1/R7 est en réalité MOINS fiable que M1/M7 sur l\'archive complète (inverse du 54%/50% trouvé sur les 27 premiers matchs). Ne confirme pas non plus les signaux binôme R1 / éléments trouvés par ailleurs. Gardé en observation, non promu en verdict.</div>';
    if (!gc.applicable) {
      html += '<div class="kv">R1 (' + FL[gc.figR1] + ', M' + gc.hR1 + ') et R7 (' + FL[gc.figR7] + ', M' + gc.hR7 + ') ne partagent pas la même boucle — guerre des 16, pas de guerre civile ici.</div>';
    } else {
      html += '<div class="kv">R1 = ' + FL[gc.figR1] + ' (M' + gc.hR1 + ')</div>';
      html += '<div class="kv">R7 = ' + FL[gc.figR7] + ' (M' + gc.hR7 + ')</div>';
      html += '<div class="kv" style="font-size:15px; font-weight:600; margin-top:6px;">Verdict R1/R7 : ' + gc.winner + '</div>';
      html += '<div class="kv" style="font-size:12px; color:#94a3b8;">' + gc.why + '</div>';
    }
    var gcM1M7 = guerreCivileGenerale(theme[1], 1, theme[7], 7, theme);
    html += '<div class="kv" style="margin-top:10px; padding-top:8px; border-top:1px dashed #334155;">Pour comparaison, la même cascade sur M1/M7 : ' + (gcM1M7.applicable ? gcM1M7.winner + ' (' + gcM1M7.why + ')' : 'non applicable (boucles différentes)') + '</div>';
    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
// MATCH FERMÉ / OUVERT (16/07/26) — comptage des figures "fermée" (table
// OUVERTURE_FIGURE déjà existante dans l'app) sur les 16 maisons de BASE
// du thème. Testé sur 6 vrais matchs (hors esport — les scores esport
// sont d'une autre nature et faussent la comparaison, cf. discussion du
// 16/07) : ≥7 fermées → les 4/4 cas ont eu au moins un camp resté à 0
// (Vitesse vs AEK 0-0, Chelsea vs Atlético 0-5, France vs Espagne 0-2,
// Suisse vs Colombie 0-0). ≤6 fermées → les 2/2 cas n'ont eu AUCUN camp
// resté à 0 (USA vs Belgique 4-1, Liverpool vs Man City 9-10). Séparation
// nette au seuil 6/7 sur cet échantillon. STATUT : n=6, séparation
// parfaite mais échantillon petit — à confirmer sur d'autres vrais
// matchs avant de le considérer pleinement établi. Ne prédit PAS un
// score bas en soi (contre-exemple : Chelsea 0-5, 5 buts au total) —
// seulement qu'au moins un camp risque d'être bloqué à 0.
function matchFermeOuvert(theme){
  var n = 0, detail = [];
  for (var h=1; h<=16; h++){ if (OUVERTURE_FIGURE[theme[h]]==='fermee') { n++; detail.push('M'+h+' ('+FL[theme[h]]+')'); } }
  var ferme = n >= 7;
  return {
    n: n,
    ferme: ferme,
    detail: detail,
    label: ferme
      ? 'FERMÉ ('+n+'/16 maisons fermées) — au moins un camp risque de rester à 0'
      : 'OUVERT ('+n+'/16 maisons fermées) — les deux camps devraient marquer'
  };
}
// BUT PAR MI-TEMPS (théorie M1/M7 ↔ R1/R7, 16/07/26) — hypothèse
// utilisateur, gardée active dans le système : le duel M1/M7 (mode fixe)
// gouverne la PREMIÈRE mi-temps, le duel R1/R7 (rotation) gouverne la
// SECONDE. Testé qualitativement sur USA vs Belgique (réel) : carte
// M1/M7 = M7 favori écart serré (4-5), réel mi-temps 2-1 (écart serré,
// 1 but) ; carte R1/R7 = R7 favori écart large (2-5), réel 2e mi-temps
// 0-2 (écart qui s'élargit). Cohérent mais n=1 et qualitatif (pas de
// correspondance numérique exacte) — à continuer de tester sur chaque
// nouveau vrai match, PAS retiré tant que non contredit.
function butParMiTemps(theme){
  var carteM = buildVerdictCard(1, 7, 'M1', 'M7', theme, verdictFinal(theme).winner);
  var orderR = getRotationOrderFromRepos(theme[1]);
  var carteR = buildVerdictCard(orderR[0], orderR[6], 'R1', 'R7', theme, null);
  return {
    premiereMiTemps: { winner: carteM.winner, score: carteM.scoreMain, labelA: carteM.labelA, labelB: carteM.labelB },
    secondeMiTemps: { winner: carteR.winner, score: carteR.scoreMain, labelA: carteR.labelA, labelB: carteR.labelB }
  };
}
function toggleButMiTempsPanel() {
  var panel = document.getElementById('but-mi-temps-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var team1 = document.getElementById('team1').value || 'Équipe 1';
    var team2 = document.getElementById('team2').value || 'Équipe 2';
    var bmt = butParMiTemps(currentTheme);
    var w1 = bmt.premiereMiTemps.winner === 'M1' ? team1 : bmt.premiereMiTemps.winner === 'M7' ? team2 : 'Nul';
    var w2 = bmt.secondeMiTemps.winner === 'R1' ? team1 : bmt.secondeMiTemps.winner === 'R7' ? team2 : 'Nul';
    var html = '<h3>🕐 But par mi-temps (théorie M1/M7 ↔ R1/R7)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Hypothèse gardée active (16/07/26) : M1/M7 (mode fixe) gouverne la 1ère mi-temps, R1/R7 (rotation) gouverne la 2e. Cohérent sur USA vs Belgique (n=1, qualitatif) — à confirmer sur d\'autres vrais matchs.</div>';
    html += '<div class="kv" style="font-size:15px; font-weight:600;">1ère mi-temps (M1/M7) : ' + w1 + ' <span class="muted" style="font-weight:normal; font-size:12px;">(' + bmt.premiereMiTemps.score + ')</span></div>';
    html += '<div class="kv" style="font-size:15px; font-weight:600;">2e mi-temps (R1/R7) : ' + w2 + ' <span class="muted" style="font-weight:normal; font-size:12px;">(' + bmt.secondeMiTemps.score + ')</span></div>';
    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
// LOI DU BINÔME "OUVRE LA VOIE" (16/07/26, doctrine utilisateur, validée
// 16/16 exhaustif sur toutes les figures, aucune exception) : quand A
// attaque B (antagoniste direct), le binôme de A attaque TOUJOURS le
// binôme de B — loi structurelle exacte des tables. Pour qu'une attaque
// nominale (A sur B) se réalise vraiment dans un thème donné, le binôme
// de B (son soutien/protection) doit être neutralisé par le binôme de A
// (la clé). Cette fonction vérifie si la voie est ouverte dans un thème
// précis : le binôme de A doit être présent ET positionné avec une
// concordance non nulle pour neutraliser efficacement le binôme de B.
function voieOuverte(attaquant, cible, theme){
  const binCible = BINOMES_V7[cible];
  const binAttaquant = BINOMES_V7[attaquant];
  const cleValide = ANTAGONISTES_V7[binCible] === binAttaquant; // toujours vrai (loi 16/16), garde-fou
  const siegesCible = positionsBaseEtResultantes(binCible, theme);
  const siegesAttaquant = positionsBaseEtResultantes(binAttaquant, theme);
  const cibleProtegee = siegesCible.length > 0;
  const cleDisponible = siegesAttaquant.length > 0;
  let forceCle = 0;
  siegesAttaquant.forEach(s => {
    const h = parseInt(s.replace('M','').replace('r',''));
    const c = concordanceElement(ELEMENTS_V7[binAttaquant], MAISON_ELEM_V7[h]);
    if (c > forceCle) forceCle = c;
  });
  const ouverte = cleValide && (!cibleProtegee || (cleDisponible && forceCle > 0));
  const resume = !cibleProtegee
    ? FL[cible]+' n\'a pas de protection (binôme '+FL[binCible]+' absent du thème) → attaque directe déjà ouverte'
    : cleDisponible
      ? FL[attaquant]+' '+(forceCle>0?'peut':'ne peut PAS')+' neutraliser la protection de '+FL[cible]+' via son binôme '+FL[binAttaquant]+' (concordance '+forceCle+') qui attaque '+FL[binCible]+' → voie '+(forceCle>0?'OUVERTE':'FERMÉE (concordance nulle)')
      : FL[attaquant]+' n\'a pas sa clé ('+FL[binAttaquant]+' absent du thème) → voie FERMÉE, '+FL[cible]+' reste protégée par '+FL[binCible];
  return {attaquant, cible, binAttaquant, binCible, cleValide, cibleProtegee, cleDisponible, forceCle, ouverte, resume};
}
function toggleVoieOuvertePanel() {
  var panel = document.getElementById('voie-ouverte-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var theme = currentTheme;
    var antM1 = ANTAGONISTES_V7[theme[1]], antM7 = ANTAGONISTES_V7[theme[7]];
    var v1 = voieOuverte(antM1, theme[1], theme);
    var v7 = voieOuverte(antM7, theme[7], theme);
    var html = '<h3>🔑 Voie ouverte (loi du binôme)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Quand A attaque B, le binôme de A attaque toujours le binôme de B (loi exacte, 16/16 figures). La voie est ouverte si ce binôme est présent et bien placé pour neutraliser la protection de B.</div>';
    html += '<div class="kv" style="margin-top:6px;"><b>Antagoniste de M1 (' + FL[theme[1]] + ') : ' + FL[antM1] + '</b></div>';
    html += '<div class="kv" style="color:' + (v1.ouverte ? '#f87171' : '#4ade80') + ';">' + v1.resume + '</div>';
    html += '<div class="kv" style="margin-top:10px;"><b>Antagoniste de M7 (' + FL[theme[7]] + ') : ' + FL[antM7] + '</b></div>';
    html += '<div class="kv" style="color:' + (v7.ouverte ? '#f87171' : '#4ade80') + ';">' + v7.resume + '</div>';
    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
// Chaîne de dualité (16/07/26, doctrine utilisateur) : pour un chef F,
// tout se joue sur 3 figures reliées par les mêmes tables BINOMES_V7/
// ANTAGONISTES_V7 déjà prouvées structurelles (voir preuveLoiBinomeAntagoniste) :
// - victime    = la figure que F attaque lui-même (F = ANTAGONISTES_V7[victime])
// - assaillant = ANTAGONISTES_V7[F] → attaque F directement
// - libérateur = ANTAGONISTES_V7[assaillant] → attaque l'assaillant, donc
//   libère F de cette attaque s'il est présent et bien placé (voie ouverte)
// Chaque attaque ne "passe" que si voieOuverte() le confirme (le binôme de
// l'attaquant doit neutraliser le binôme de la cible). En complément, une
// figure qui occupe une maison dont la résultante est SON PROPRE binôme
// "engendre son compagnon" (ex : amissio en M14 résulte tristitia = binôme
// d'amissio) — bonus de force structurelle sur cette figure à cette maison.
function victimeDe(fig) {
  const i = FIGS_V7.indexOf(fig);
  return FIGS_V7[(i + 3) % 16];
}
// Constat 11 (17/07/26, REPERES.md §6, CORRIGÉ après erreur de calcul
// initiale) : l'obstacle (B-B-A, Constat 1) d'une figure est attaqué par
// une figure distincte de son ancre — CE N'EST PAS l'ancre elle-même
// (X+2 ≠ X-2 en général, seule confusion : dans l'exemple Puer,
// antagoniste(obstacle)=Acquisitio, qui n'a l'air de "boucler" que parce
// que binôme(Acquisitio)=Puer, PAS parce qu'Acquisitio=ancre(Puer)).
// Identité algébrique réelle, vérifiée sur les 16 figures (16/16, voir
// preuveConstat11()) : binôme(attaquantObstacleDe(fig)) === fig — la
// figure qui attaque l'obstacle de X est TOUJOURS celle dont X est le
// binôme (décalages fixes : obstacle=-3+2+2=+1, antagoniste(obstacle)=
// +1-3=-2, donc attaquantObstacle(X)=X-2 ; binôme(X-2)=X-2+2=X, retour
// exact). C'est un décalage fixe de -2, distinct de tous les autres
// champs déjà nommés dans chaineDualite (assaillant=-3, libérateur=-6,
// victime=+3, ancre=+2, binAssaillant=-1, binLiberateur=-4,
// binVictime=+5) — une vraie 9e figure, pas une redite.
function obstacleDe(fig) {
  return BINOMES_V7[BINOMES_V7[ANTAGONISTES_V7[fig]]];
}
function attaquantObstacleDe(fig) {
  return ANTAGONISTES_V7[obstacleDe(fig)];
}
// Figure de front (27/07/26, doctrine Ellemine_D) : binôme du binôme de LA
// FIGURE ELLE-MÊME (pas de son antagoniste, contrairement à obstacleDe) —
// ex. front(puer)=binôme(binôme(puer))=binôme(caput_draconis)=via ;
// front(albus)=tristitia ; front(fortuna_minor)=cauda_draconis. Doctrine :
// pour qu'une figure sorte CARRÉMENT (complètement) de son propre obstacle
// (B-B-A), sa figure de front doit être présente/active dans le thème.
// Distinct de obstacleNeutralise (comparaison de force ci-dessous) — les
// deux champs coexistent pour l'instant, aucun n'a été retiré au profit de
// l'autre, en attente de test sur l'archive.
function frontDe(fig) {
  return BINOMES_V7[BINOMES_V7[fig]];
}
function preuveFrontDe() {
  const rows = FIGS_V7.map(f => ({ figure: f, front: frontDe(f) }));
  return { rows, n: rows.length };
}
function preuveConstat11() {
  const rows = FIGS_V7.map(f => {
    const obstacle = obstacleDe(f);
    const attaquantObstacle = attaquantObstacleDe(f);
    const binAttaquant = BINOMES_V7[attaquantObstacle];
    const matches = binAttaquant === f;
    return { figure: f, obstacle, attaquantObstacle, binAttaquant, matches };
  });
  const total = rows.filter(r => r.matches).length;
  return { rows, total, n: rows.length };
}
// "Petit calcul" (17/07/26, doctrine utilisateur) : pour une figure F,
// combine(F, puella) si F est du cycle pair (BINOME_CYCLE_2), sinon
// combine(F, acquisitio) si F est du cycle impair (BINOME_CYCLE_1).
// VÉRIFIÉ : sur les 16 figures, ce résultat NE COÏNCIDE PAS avec
// l'antagoniste de l'antagoniste (2/16 seulement, laetitia et carcer,
// coïncidence) — c'est un mécanisme réellement distinct de "libérateur".
// Appliqué à une figure du cycle pair, la doctrine le nomme SOUTIEN
// (aide cette figure) ; appliqué à une figure du cycle impair, OBSTACLE
// (gêne cette figure). "il faut [figure]" = condition nécessaire, donc
// utilisé comme verrou prioritaire (pas un simple bonus additif) —
// testé : en verrou, l'archive passe de 17/27 à 19/27 ; en bonus additif
// dans forceMaisons, elle RÉGRESSE à 16/27 (rejeté).
function petitCalcul(fig) {
  // Exception Acquisitio/Puella (constat 5, REPERES.md §6) : ce sont les
  // pivots fixes de leur boucle (combine(acquisitio,acquisitio) et
  // combine(puella,puella) donnent tous les deux Populus — un résultat
  // dégénéré). Au lieu d'une seule figure, elles se rapportent à
  // l'ENSEMBLE des figures que leur boucle génère pour les autres :
  // Acquisitio (impair, jamais dans l'ensemble des sorties paires) → les
  // 7 autres figures paires (Populus exclu, son propre résultat naturel).
  // Puella (paire, appartient elle-même à cet ensemble) → les 6 autres
  // figures paires (Populus ET elle-même exclus).
  if (fig === 'acquisitio') return BINOME_CYCLE_2.filter(f => f !== 'populus');
  if (fig === 'puella') return BINOME_CYCLE_2.filter(f => f !== 'populus' && f !== 'puella');
  const cycle = getBinomeCycle(fig);
  const pivot = cycle === 2 ? 'puella' : 'acquisitio';
  return combine(fig, pivot);
}
// Présence dans le thème d'un "bloc" de petitCalcul — gère à la fois le
// cas normal (une seule figure) et l'exception Acquisitio/Puella (liste
// de figures, présent si AU MOINS UNE d'entre elles est là).
function blocPresent(bloc, theme) {
  const figs = Array.isArray(bloc) ? bloc : [bloc];
  return figs.some(f => positionsBaseEtResultantes(f, theme).length > 0);
}
function blocLabel(bloc) {
  return Array.isArray(bloc) ? bloc.map(f => FL[f]).join(', ') : FL[bloc];
}
// Score net du petit calcul pour un chef (17/07/26, reconstruit depuis un
// tableau exhaustif des 16 figures plutôt que deviné par essais-erreurs).
// FAIT STRUCTUREL vérifié sur les 16 figures : le cycle du chef et celui
// de son assaillant sont TOUJOURS opposés (chef pair ⟺ assaillant impair).
// Donc petitCalcul(chef) et petitCalcul(assaillant) jouent TOUJOURS dans
// le même sens pour ce chef (jamais contradictoires) : si chef est pair,
// les deux sont des soutiens (bons pour lui) ; si impair, les deux sont
// des obstacles (mauvais pour lui). On compte combien des deux blocs sont
// présents dans le thème (0, 1 ou 2) et on signe selon le cycle du chef.
// Comparer ce score entre M1 et M7 (le plus élevé gagne) répare
// simultanément deux cas réels qu'aucune formule précédente ne réparait
// ensemble (Argentine-Egypte ET Liverpool-Man City) — remplace les
// anciens booléens assaillantObstrue/assaillantRenforce pris isolément
// (qui pouvaient se contredire entre chef et assaillant côté affichage,
// même si la comparaison M1/M7 restait correcte).
function scorePetitCalcul(chef, theme) {
  const cycleChef = getBinomeCycle(chef);
  const assaillant = ANTAGONISTES_V7[chef];
  const blocChef = petitCalcul(chef);
  const blocAssaillant = petitCalcul(assaillant);
  const presentChef = blocPresent(blocChef, theme);
  const presentAssaillant = blocPresent(blocAssaillant, theme);
  const n = (presentChef ? 1 : 0) + (presentAssaillant ? 1 : 0);
  const signe = cycleChef === 2 ? 1 : -1;
  return { chef, cycleChef, assaillant, blocChef, blocAssaillant, presentChef, presentAssaillant, n, score: signe * n };
}
// Force relationnelle d'une figure sur les maisons qu'elle occupe réellement
// dans le thème (base ET résultante, via trouverFigV7) — réutilise l'arsenal
// déjà bâti et validé pour scoreV7 plutôt que de réinventer un critère isolé :
// forceMaisonV7 (élément figure/résultante × élément maison, ou repos),
// checkAutoConstruction (résultante = binôme propre, table AUTO_CONSTRUCT_HOUSE),
// checkAutoDestruction (résultante = antagoniste propre, table AUTO_DESTRUCT_HOUSE),
// checkMaisonDoubleConcordance (figure ET résultante du même élément que la maison).
function forceRelationnelleFigure(fig, theme) {
  const sieges = trouverFigV7(fig, theme);
  let total = 0;
  const detail = sieges.map(function(s) {
    const fm = forceMaisonV7(fig, s.pos);
    const ac = checkAutoConstruction(fig, s.pos);
    const ad = checkAutoDestruction(fig, s.pos);
    const dc = checkMaisonDoubleConcordance(fig, s.pos);
    let apport = fm.force;
    if (ac) apport += 25;
    if (ad) apport -= 30;
    if (dc.match) apport += 20;
    total += apport;
    return { pos: s.pos, hidden: s.hidden, force: fm.force, role: fm.role, autoConstruct: ac, autoDestruct: ad, doubleConc: dc.match, apport: apport };
  });
  return { fig, sieges: sieges.map(function(s){return s.pos;}), total, detail };
}
function chaineDualite(chef, theme) {
  const assaillant = ANTAGONISTES_V7[chef];
  const liberateur = ANTAGONISTES_V7[assaillant];
  const victime = victimeDe(chef);
  const menace = voieOuverte(assaillant, chef, theme);
  const liberation = voieOuverte(liberateur, assaillant, theme);
  const offensive = voieOuverte(chef, victime, theme);
  const ancre = BINOMES_V7[chef];
  // Constat 11 (17/07/26, REPERES.md §6, voir obstacleDe()/
  // attaquantObstacleDe()) : l'obstacle (B-B-A) du chef est attaqué par une
  // figure DISTINCTE de l'ancre (décalage -2, pas +2 — CORRIGÉ après une
  // première version qui confondait les deux). N'entre PAS dans
  // forceMaisons (pas encore validé comme mécanisme de verdict, simple
  // champ d'observation pour l'instant).
  const obstacle = obstacleDe(chef);
  const attaquantObstacle = attaquantObstacleDe(chef);
  // Score net du petit calcul (17/07/26, voir scorePetitCalcul) : compte
  // les 2 blocs (celui du chef, celui de l'assaillant — toujours dans le
  // même sens pour un chef donné, jamais contradictoires) et signe selon
  // le cycle du chef. Utilisé en comparaison directe M1 vs M7 dans
  // verdictChaineDualite (le score le plus élevé gagne).
  const pcScore = scorePetitCalcul(chef, theme);
  // Structure complète (17/07/26, doctrine utilisateur exhaustive) : 8
  // figures, pas 5. Le binôme de l'assaillant (son bouclier) et le binôme
  // de la victime (son bouclier) sont déjà utilisés À L'INTÉRIEUR de
  // voieOuverte() pour décider si une attaque passe, mais leur force de
  // position PROPRE n'était jusqu'ici jamais comptée dans forceMaisons.
  // Exemple utilisateur complet (fortuna_minor) : chef=fortuna_minor,
  // ancre=conjunctio, victime=fortuna_major, binôme(victime)=puella,
  // assaillant=amissio, binôme(assaillant)=tristitia, libérateur=
  // caput_draconis, binôme(libérateur)=via — les 8 figures nommées.
  // ÉTENDU (17/07/26, Constat 11, demande utilisateur "entre le dans le
  // calcul du verdict") : forceMaisons inclut maintenant AUSSI la
  // contribution SIGNÉE de l'obstacle (B-B-A du chef) et de son
  // attaquant — l'attaquant de l'obstacle renforce le chef (+), l'obstacle
  // lui pénalise (−), voir obstacleDe()/attaquantObstacleDe() plus haut.
  // Testé en cascade complète verdictFinal (pas en comparaison isolée,
  // qui aurait montré une légère régression) : 17/27 sur l'archive,
  // contre 15/27 sans cette contribution — amélioration mesurée.
  const binAssaillant = BINOMES_V7[assaillant];
  const binLiberateur = BINOMES_V7[liberateur];
  const binVictime = BINOMES_V7[victime];
  const frChef = forceRelationnelleFigure(chef, theme);
  const frAssaillant = forceRelationnelleFigure(assaillant, theme);
  const frLiberateur = forceRelationnelleFigure(liberateur, theme);
  const frVictime = forceRelationnelleFigure(victime, theme);
  const frAncre = forceRelationnelleFigure(ancre, theme);
  const frBinAssaillant = forceRelationnelleFigure(binAssaillant, theme);
  const frBinLiberateur = forceRelationnelleFigure(binLiberateur, theme);
  const frBinVictime = forceRelationnelleFigure(binVictime, theme);
  const frObstacle = forceRelationnelleFigure(obstacle, theme);
  const frAttaquantObstacle = forceRelationnelleFigure(attaquantObstacle, theme);
  const obstacleNeutralise = frAttaquantObstacle.total > frObstacle.total;
  // Figure de front (27/07/26, voir frontDe() plus haut) : échappement
  // COMPLET de l'obstacle (pas une comparaison de force — une présence
  // binaire). Utilisé dans forceMaisons ci-dessous (annule la pénalité de
  // l'obstacle plutôt que de la comparer par force).
  const front = frontDe(chef);
  const frontPresent = figureExistsActive(front, theme);
  const obstacleEchappeParFront = frontPresent;
  // Figure de front dans le calcul du verdict (27/07/26, demande explicite
  // Ellemine_D : "ajoute le dans le calcul") : si la figure de front (voir
  // frontDe() plus haut) est active dans le thème, le chef sort CARRÉMENT
  // de son obstacle — la pénalité de l'obstacle (-frObstacle.total) est
  // annulée entièrement, plutôt que comparée par force comme le fait
  // obstacleNeutralise (qui reste calculé, à titre d'observation, mais
  // n'intervient plus dans le calcul : l'échappement par front est
  // désormais la règle appliquée). PAS ENCORE testé sur l'archive complète
  // à ce stade — à surveiller sur les prochains matchs réels.
  const obstaclePenalite = obstacleEchappeParFront ? 0 : frObstacle.total;
  const forceMaisons = frChef.total + frAssaillant.total + frLiberateur.total + frVictime.total + frAncre.total + frBinAssaillant.total + frBinLiberateur.total + frBinVictime.total + frAttaquantObstacle.total - obstaclePenalite;
  const libere = !menace.ouverte || liberation.ouverte;
  const domine = offensive.ouverte && libere;
  let resume = !menace.ouverte
    ? FL[chef] + ' n\'est pas réellement menacé par ' + FL[assaillant] + ' (voie fermée) → libre d\'agir.'
    : liberation.ouverte
      ? FL[chef] + ' est attaqué par ' + FL[assaillant] + ' mais ' + FL[liberateur] + ' neutralise cette menace (libération active) → libre d\'agir.'
      : FL[chef] + ' reste sous la menace de ' + FL[assaillant] + ', ' + FL[liberateur] + ' ne peut pas le libérer (voie fermée) → entravé.';
  resume += ' ' + (offensive.ouverte
    ? FL[chef] + ' atteint sa cible ' + FL[victime] + ' (voie ouverte) → capacité offensive active.'
    : FL[chef] + ' n\'atteint pas ' + FL[victime] + ' (voie fermée) → capacité offensive bloquée.');
  return { chef, assaillant, liberateur, victime, ancre, obstacle, attaquantObstacle, binAssaillant, binLiberateur, binVictime, menace, liberation, offensive, frChef, frAssaillant, frLiberateur, frVictime, frAncre, frObstacle, frAttaquantObstacle, frBinAssaillant, frBinLiberateur, frBinVictime, obstacleNeutralise, front, frontPresent, obstacleEchappeParFront, forceMaisons, libere, domine, pcScore, resume };
}
// Verdict opérationnel de la chaîne de dualité (17/07/26) : extrait de
// l'ancien panneau d'inspection pour être réellement exploitable par
// verdictFinal, pas seulement affiché. Domine = voie offensive ouverte
// ET (pas de menace réelle OU menace neutralisée par le libérateur).
// PRIORITÉ au score net du petit calcul (pcScore, voir scorePetitCalcul) :
// comparaison directe M1 vs M7, le score le plus élevé gagne — traité en
// VERROU (pas en bonus additif dans forceMaisons, testé et rejeté à
// 16/27) car la doctrine utilisateur l'exprime comme une condition
// nécessaire ("il faut [figure]"), pas comme une force graduelle. Sinon,
// départage double-domination/aucune-domination par la force des maisons
// (8 figures : chef/ancre/assaillant/libérateur/victime + leurs 3 binômes).
// RECONSTRUIT (17/07/26) depuis un tableau exhaustif des 16 figures après
// que deux formules ad-hoc précédentes (verrou obstacle+renforcement en
// OR simple, 20/27 archive ; comptage étagé, 19/27) se soient contredites
// sur des vrais matchs hors archive (l'une réparait Liverpool-Man City en
// cassant Chelsea-Napoli, l'autre l'inverse). Cette version, dérivée du
// fait structurel que le cycle du chef et de son assaillant sont TOUJOURS
// opposés (jamais de signaux contradictoires pour un même chef), répare
// SIMULTANÉMENT Argentine-Egypte ET Liverpool-Man City — validé 19/27 sur
// l'archive (légèrement sous les 20/27 de l'ancienne formule, mais sans
// aucune contradiction interne constatée sur les vrais matchs testés).
// L'écart de dominance tranche TOUJOURS sur l'archive (27/27, 0 cas de
// repli) : la chaîne de dualité est câblée dans verdictFinal UNIQUEMENT
// pour les thèmes où l'écart de dominance ne tranche pas (aucun cas connu
// dans l'archive, mais possible ailleurs) — ne peut donc jamais dégrader
// le score mesuré.
function verdictChaineDualite(theme) {
  var cM1 = chaineDualite(theme[1], theme);
  var cM7 = chaineDualite(theme[7], theme);
  var winner = null, mode = '';
  if (cM1.pcScore.score !== cM7.pcScore.score) {
    winner = cM1.pcScore.score > cM7.pcScore.score ? 'M1' : 'M7';
    mode = 'score net petit calcul (' + cM1.pcScore.score + ' vs ' + cM7.pcScore.score + ')';
  }
  else if (cM1.domine && !cM7.domine) { winner = 'M1'; mode = 'domination nette'; }
  else if (cM7.domine && !cM1.domine) { winner = 'M7'; mode = 'domination nette'; }
  else if (cM1.forceMaisons !== cM7.forceMaisons) {
    winner = cM1.forceMaisons > cM7.forceMaisons ? 'M1' : 'M7';
    mode = (cM1.domine && cM7.domine ? 'double domination' : 'aucune domination') + ' tranchée par la force des maisons';
  }
  // ANCRAGE DIRECT (17/07/26, dérivé pas à pas sur Argentine-Egypte et
  // Suisse-Colombie) : dernier niveau de départage, quand même le score
  // du petit calcul ET la force des maisons sont à égalité — compare la
  // force de l'ancre directe (binôme du chef) entre M1 et M7. Validé
  // n=2 en réel, 16/27 (59%) SEUL sur l'archive (plus faible que l'écart
  // de dominance) — d'où sa place tout en bas de la cascade de repli,
  // jamais avant les niveaux mieux validés ci-dessus.
  else if (cM1.frAncre.total !== cM7.frAncre.total) {
    winner = cM1.frAncre.total > cM7.frAncre.total ? 'M1' : 'M7';
    mode = 'ancrage direct (n=2, ' + cM1.frAncre.total + ' vs ' + cM7.frAncre.total + ')';
  }
  return { winner: winner, mode: mode, cM1: cM1, cM7: cM7 };
}
function toggleChaineDualitePanel() {
  var panel = document.getElementById('chaine-dualite-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var theme = currentTheme;
    var cM1 = chaineDualite(theme[1], theme);
    var cM7 = chaineDualite(theme[7], theme);
    // ÉTENDU (17/07/26, demande utilisateur "applique ça au mode rotation ET
    // mode fixe") : chaineDualite() est une fonction générique — le Constat
    // 11 (obstacle/attaquant, déjà dans forceMaisons) s'applique donc DÉJÀ
    // automatiquement aux deux modes dans le calcul. Ce panneau, lui, ne
    // montrait jusqu'ici QUE M1/M7 (fixe) — ajout de R1/R7 (rotation) pour
    // que l'affichage soit visible sur les deux modes, pas seulement le
    // calcul interne.
    var orderR = getRotationOrderFromRepos(theme[1]);
    var cR1 = chaineDualite(theme[orderR[0]], theme);
    var cR7 = chaineDualite(theme[orderR[6]], theme);
    var html = '<h3>⚖️ Chaîne de dualité (assaillant / libérateur / victime)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Pour chaque chef : ancre = son binôme, assaillant = qui l\'attaque, libérateur = qui attaque l\'assaillant (le libère), victime = qui il attaque lui-même. Chaque lien dépend de la voie ouverte (loi du binôme). "Force maisons" = somme, sur les maisons réellement occupées (base + résultante) par chef/ancre/assaillant/libérateur/victime, de forceMaisonV7 + bonus auto-construction (+25) − pénalité auto-destruction (−30) + bonus double concordance (+20) + contribution signée obstacle/attaquant (Constat 11).</div>';
    function renderBlocChaine(label, c) {
      var out = '<div class="kv" style="margin-top:8px; font-weight:600;">' + label + ' (' + FL[c.chef] + ') — ancre ' + FL[c.ancre] + '</div>';
      out += '<div class="kv" style="font-size:11px;">Assaillant : ' + FL[c.assaillant] + ' · Libérateur : ' + FL[c.liberateur] + ' · Victime : ' + FL[c.victime] + '</div>';
      out += '<div class="kv" style="font-size:11px;">Petit calcul — chef (' + (c.pcScore.cycleChef === 2 ? 'pair' : 'impair') + ') : ' + blocLabel(c.pcScore.blocChef) + ' ' + (c.pcScore.presentChef ? '✓ présent' : '✗ absent') + ' · assaillant : ' + blocLabel(c.pcScore.blocAssaillant) + ' ' + (c.pcScore.presentAssaillant ? '✓ présent' : '✗ absent') + ' → score net ' + c.pcScore.score + '</div>';
      var frLine = [
        { lbl: label, fr: c.frChef },
        { lbl: 'ancre', fr: c.frAncre },
        { lbl: 'assaillant', fr: c.frAssaillant },
        { lbl: 'libérateur', fr: c.frLiberateur },
        { lbl: 'victime', fr: c.frVictime }
      ].map(function(o) {
        var flags = o.fr.detail.map(function(d) {
          var tags = [];
          if (d.autoConstruct) tags.push('AC');
          if (d.autoDestruct) tags.push('AD');
          if (d.doubleConc) tags.push('DC');
          return 'M' + d.pos + (d.hidden ? 'r' : '') + '(' + d.apport + (tags.length ? ' ' + tags.join('+') : '') + ')';
        }).join(',') || '—';
        return o.lbl + ': ' + o.fr.total + ' [' + flags + ']';
      }).join(' | ');
      out += '<div class="kv" style="font-size:11px;">Force maisons — ' + frLine + '</div>';
      out += '<div class="kv" style="font-size:11px;">Obstacle (B-B-A, Constat 11) : ' + FL[c.obstacle] + ' (force ' + c.frObstacle.total + ') vs son attaquant ' + FL[c.attaquantObstacle] + ' (force ' + c.frAttaquantObstacle.total + ') → <span style="color:' + (c.obstacleNeutralise ? '#4ade80' : '#f87171') + ';">' + (c.obstacleNeutralise ? 'obstacle neutralisé' : 'obstacle non neutralisé') + '</span></div>';
      out += '<div class="kv" style="color:' + (c.domine ? '#4ade80' : '#f87171') + ';">' + c.resume + '</div>';
      out += '<div class="kv" style="font-weight:600; color:' + (c.domine ? '#4ade80' : '#f87171') + ';">→ ' + (c.domine ? 'DOMINE (libre + offensif)' : (c.libere ? 'libre mais offensive bloquée' : 'entravé')) + ' — total force maisons : ' + c.forceMaisons + '</div>';
      return out;
    }
    html += '<div class="kv" style="font-weight:600; margin-top:4px;">— Mode fixe —</div>';
    html += renderBlocChaine('M1', cM1) + renderBlocChaine('M7', cM7);
    html += '<div class="kv" style="font-weight:600; margin-top:12px;">— Mode rotation (R1=M' + orderR[0] + ', R7=M' + orderR[6] + ') —</div>';
    html += renderBlocChaine('R1', cR1) + renderBlocChaine('R7', cR7);
    var vcdPanel = verdictChaineDualite(theme);
    var moFixe = vcdPanel.winner ? (vcdPanel.winner + ' — ' + vcdPanel.mode) : 'ÉQUILIBRE / INDÉTERMINÉ (force des maisons égale, ' + cM1.forceMaisons + ' vs ' + cM7.forceMaisons + ')';
    var moRot = cR1.forceMaisons !== cR7.forceMaisons ? ((cR1.forceMaisons > cR7.forceMaisons ? 'R1' : 'R7') + ' — force maisons (' + cR1.forceMaisons + ' vs ' + cR7.forceMaisons + ')') : 'ÉQUILIBRE / INDÉTERMINÉ (force des maisons égale, ' + cR1.forceMaisons + ' vs ' + cR7.forceMaisons + ')';
    html += '<div class="kv" style="margin-top:10px; font-size:14px; font-weight:700;">Fixe : ' + moFixe + '</div>';
    html += '<div class="kv" style="font-size:14px; font-weight:700;">Rotation : ' + moRot + '</div>';
    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
// Preuve structurelle (16/07/26) : binôme = décalage +2 dans FIGS_V7,
// antagoniste = décalage -3 dans FIGS_V7 (même cycle de 16). Deux
// conséquences algébriques nécessaires, vraies pour les 16 figures sans
// aucune exception possible (ce ne sont pas des additions qui peuvent
// "ne pas commuter") :
// 1) antagoniste(binôme(f)) === binôme(antagoniste(f))  → c'est la preuve
//    exacte de la "loi du binôme ouvre la voie" (déjà exploitée dans
//    voieOuverte()).
// 2) antagoniste(antagoniste(f)) === binôme appliqué 5 fois de suite à f
//    (soit -3 dans l'autre sens) → l'antagoniste de l'antagoniste reste
//    toujours dans la boucle de départ, à une position fixe de la chaîne.
function preuveLoiBinomeAntagoniste() {
  const rows = FIGS_V7.map(f => {
    const bin = BINOMES_V7[f];
    const ant = ANTAGONISTES_V7[f];
    const lhs = ANTAGONISTES_V7[bin];
    const rhs = BINOMES_V7[ant];
    const commute = lhs === rhs;
    let b5 = f;
    for (let k = 0; k < 5; k++) b5 = BINOMES_V7[b5];
    const antAnt = ANTAGONISTES_V7[ant];
    const shiftOk = antAnt === b5;
    return { figure: f, bin, ant, lhs, rhs, commute, antAnt, b5, shiftOk };
  });
  const totalCommute = rows.filter(r => r.commute).length;
  const totalShift = rows.filter(r => r.shiftOk).length;
  return { rows, totalCommute, totalShift, n: rows.length };
}
function togglePreuveStructurellePanel() {
  var panel = document.getElementById('preuve-structurelle-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    var p = preuveLoiBinomeAntagoniste();
    var html = '<h3>🧮 Preuve structurelle (loi du binôme)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Vérification exhaustive sur les 16 figures, indépendante du thème en cours : (1) antagoniste(binôme) = binôme(antagoniste) — preuve exacte de la loi "le binôme ouvre la voie" ; (2) antagoniste(antagoniste) = binôme appliqué 5 fois (l\'antagoniste de l\'antagoniste reste toujours dans la boucle de départ, à position fixe).</div>';
    html += '<div class="kv" style="font-weight:600; color:' + (p.totalCommute === p.n ? '#4ade80' : '#f87171') + ';">Commutation binôme/antagoniste : ' + p.totalCommute + '/' + p.n + '</div>';
    html += '<div class="kv" style="font-weight:600; color:' + (p.totalShift === p.n ? '#4ade80' : '#f87171') + '; margin-bottom:6px;">Décalage fixe antagoniste² = binôme⁵ : ' + p.totalShift + '/' + p.n + '</div>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:11px;"><thead><tr style="text-align:left; color:#94a3b8;"><th>Figure</th><th>Binôme</th><th>Antagoniste</th><th>Ant(Bin)</th><th>Bin(Ant)</th><th>Commute</th><th>Ant²</th><th>Bin⁵</th><th>OK</th></tr></thead><tbody>';
    p.rows.forEach(function(r) {
      html += '<tr><td>' + FL[r.figure] + '</td><td>' + FL[r.bin] + '</td><td>' + FL[r.ant] + '</td><td>' + FL[r.lhs] + '</td><td>' + FL[r.rhs] + '</td><td style="color:' + (r.commute ? '#4ade80' : '#f87171') + ';">' + (r.commute ? '✓' : '✗') + '</td><td>' + FL[r.antAnt] + '</td><td>' + FL[r.b5] + '</td><td style="color:' + (r.shiftOk ? '#4ade80' : '#f87171') + ';">' + (r.shiftOk ? '✓' : '✗') + '</td></tr>';
    });
    html += '</tbody></table>';
    // Constat 11 (17/07/26, REPERES.md §6) : l'attaquant de l'obstacle
    // (B-B-A) d'une figure est TOUJOURS la figure dont elle est le binôme
    // (sens inverse — CE N'EST PAS l'ancre, erreur initiale corrigée le
    // même jour) — même style de preuve exhaustive, ajoutée dans le même
    // panneau.
    var c11 = preuveConstat11();
    html += '<h3 style="margin-top:14px;">🧮 Preuve structurelle (Constat 11 — attaquant de l\'obstacle)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Pour chaque figure X : son obstacle (B-B-A, Constat 1) est attaqué par une figure Y distincte de l\'ancre — Y est toujours celle DONT X est le binôme (binôme(Y)=X, sens inverse). Identité algébrique (décalages fixes -3+2+2=+1 sur l\'obstacle, puis -3 pour trouver Y=X-2, puis +2 pour revenir à X), pas une observation limitée à un exemple.</div>';
    html += '<div class="kv" style="font-weight:600; color:' + (c11.total === c11.n ? '#4ade80' : '#f87171') + '; margin-bottom:6px;">binôme(attaquant obstacle) = figure de départ : ' + c11.total + '/' + c11.n + '</div>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:11px;"><thead><tr style="text-align:left; color:#94a3b8;"><th>Figure</th><th>Obstacle (B-B-A)</th><th>Attaquant de l\'obstacle</th><th>Binôme(attaquant)</th><th>OK</th></tr></thead><tbody>';
    c11.rows.forEach(function(r) {
      html += '<tr><td>' + FL[r.figure] + '</td><td>' + FL[r.obstacle] + '</td><td>' + FL[r.attaquantObstacle] + '</td><td>' + FL[r.binAttaquant] + '</td><td style="color:' + (r.matches ? '#4ade80' : '#f87171') + ';">' + (r.matches ? '✓' : '✗') + '</td></tr>';
    });
    html += '</tbody></table>';
    var pf = preuveFrontDe();
    html += '<h3 style="margin-top:14px;">🧮 Figure de front (binôme du binôme de la figure elle-même)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Distinct de l\'obstacle (B-B-A de l\'ANTAGONISTE) : ici on part de la figure elle-même. Doctrine Ellemine_D (27/07/26) : pour sortir CARRÉMENT de son propre obstacle, la figure de front doit être active dans le thème.</div>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:11px;"><thead><tr style="text-align:left; color:#94a3b8;"><th>Figure</th><th>Figure de front</th></tr></thead><tbody>';
    pf.rows.forEach(function(r) {
      html += '<tr><td>' + FL[r.figure] + '</td><td>' + FL[r.front] + '</td></tr>';
    });
    html += '</tbody></table>';
    html += '<h3 style="margin-top:14px;">🧮 Index binaire (poids feu=1, air=2, eau=4, terre=8 — ligne fermée = 0)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Doctrine Ellemine_D (28/07/26), vérifiée : Puer = 1(feu)+2(air)+0(eau fermée)+8(terre) = 11. Bijection exacte 0-15 sur les 16 figures.</div>';
    html += '<table style="width:100%; border-collapse:collapse; font-size:11px;"><thead><tr style="text-align:left; color:#94a3b8;"><th>Figure</th><th>Glyphe (feu-air-eau-terre)</th><th>Index</th></tr></thead><tbody>';
    FIGS_V7.slice().sort(function(a,b){ return indexBinaireEngine(a)-indexBinaireEngine(b); }).forEach(function(fig) {
      var g = MAP_GEO[fig];
      html += '<tr><td>' + FL[fig] + '</td><td>' + g.join('-') + '</td><td style="font-weight:600; color:#e8c547;">' + indexBinaireEngine(fig) + '</td></tr>';
    });
    html += '</tbody></table>';
    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
function toggleMatchFermeOuvertPanel() {
  var panel = document.getElementById('match-ferme-ouvert-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var mf = matchFermeOuvert(currentTheme);
    var html = '<h3>🔒 Match fermé / ouvert</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Compte les figures "fermée" (table de doctrine existante) sur les 16 maisons de base. RÉVISÉ (18/07/26) : mesuré sur 9 vrais matchs (hors esport) → 5/9 (56%), à peine au-dessus du hasard — sur les 6 premiers matchs connus au 16/07/26 c\'était 5/6 (83%), mais les 3 cas réels ajoutés depuis ont tous raté. Affichage purement informatif, PAS une règle du moteur, ne pas utiliser pour un pronostic BTTS.</div>';
    html += '<div class="kv" style="font-size:16px; font-weight:600; color:' + (mf.ferme ? '#f87171' : '#4ade80') + ';">' + mf.label + '</div>';
    html += '<div class="kv" style="font-size:12px; margin-top:6px;">' + mf.detail.join(', ') + '</div>';
    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}
function togglePointsStrategiquesPanel() {
  var panel = document.getElementById('points-strategiques-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var pts = pointsStrategiquesParite(currentTheme);
    var html = '<h3>🎯 Points stratégiques (maisons paires)</h3>';
    html += '<div class="muted" style="font-size:11px; margin-bottom:6px;">Sur M2,4,6,8,10,12,14,16, la résultante reste toujours dans la même boucle de binôme que la figure de base (loi exacte, vérifiée sur 128 cas sans exception) — l\'inverse des maisons impaires. Chaque point renforce donc structurellement le camp dont la boucle correspond.</div>';
    pts.forEach(function(p){
      var color = p.alignement === 'renforce M1' ? '#60a5fa' : p.alignement === 'renforce M7' ? '#f87171' : '#94a3b8';
      html += '<div class="kv" style="font-size:12px; color:' + color + ';"><b>M' + p.maison + '</b> (' + p.camp + ') — ' + FL[p.figure] + ' → ' + FL[p.resultante] + ' (boucle ' + p.cycle + ') : ' + p.alignement + '</div>';
    });
    panel.innerHTML = html;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}


// ═══════════════════════════════════════════════════════════════
// BINÔME M1↔M7 (07/07/26) — cas Suisse-Colombie (0-0) : M1=Carcer et
// M7=Fortuna Major sont binômes l'un de l'autre plutôt qu'antagonistes.
// Hypothèse : quand les deux camps sont liés par le binôme plutôt que
// par l'antagonisme, l'agressivité réelle se déplace/se neutralise
// ailleurs dans le thème (cf. l'analyse M9-M14 sur ce cas), plutôt que
// de trancher net entre M1 et M7 → piste de nul/match équilibré.
// Vérifié sur 4 matchs connus : 1/1 sur le seul nul, 0/3 sur les
// victoires nettes (USA-Belgique, Portugal-Espagne, Argentine-Égypte).
// Échantillon minuscule — 📚 étude, à recontre-tester à mesure que
// l'archive grossit avant toute promotion en règle décisionnelle.
// ═══════════════════════════════════════════════════════════════
// RETIRÉ (13/07/26) : "double concordance par camp" (base+résultante
// concordantes avec la maison, camp avec le plus de maisons l'emporte).
// Construite le 12-13/07/26, validée 3/3 sur les 3 seuls matchs
// décortiqués manuellement, puis retestée sur 2 nouveaux matchs réels
// en aveugle (sans être retouchée) : 2 échecs consécutifs, taux tombé
// à 3/5 (60%). Retirée à la demande de l'utilisateur plutôt que
// laissée en signal d'étude — la dérive rapide (100%→75%→60% en 5 cas)
// ne justifiait pas de continuer à la suivre.
function signalBinomeM1M7(theme) {
  var b1 = BINOMES_V7[theme[1]];
  var b7 = BINOMES_V7[theme[7]];
  var actif = (b1 === theme[7]) || (b7 === theme[1]);
  return {
    actif: actif,
    resume: actif
      ? '📚 étude — M1(' + FL[theme[1]] + ') et M7(' + FL[theme[7]] + ') sont binômes l\'un de l\'autre (pas antagonistes) — piste de match équilibré/nul, à confirmer sur plus de cas.'
      : null
  };
}


// ═══════════════════════════════════════════════════════════════
// SUPERPOSITION DE RÉSEAUX M1↔M7 (07/07/26) — analyse couche par
// couche (Ellemine) sur 3 nuls réels : les chaînes antagoniste/binôme
// de M1 et M7 ne restent pas séparées, elles se superposent dans les
// mêmes maisons (une maison porte à la fois un maillon du réseau M1 et
// un maillon du réseau M7, en base ou en résultante).
// Réseau d'une figure = {elle-même, son antagoniste, l'antagoniste de
// son antagoniste, son binôme, l'antagoniste de son binôme} (5 figures,
// 2 sauts de chaque type).
// Vérifié sur 6 matchs connus : les 3 nuls donnent EXACTEMENT 6 maisons
// en superposition, aucune des 3 victoires nettes ne tombe sur 6 (5,3,7).
// 📚 étude — échantillon minuscule (n=6), à recontre-tester avant toute
// promotion en règle décisionnelle.
// ═══════════════════════════════════════════════════════════════
function reseauFigureV7(fig) {
  var a1 = ANTAGONISTES_V7[fig];
  var a2 = ANTAGONISTES_V7[a1];
  var b1 = BINOMES_V7[fig];
  var ab1 = ANTAGONISTES_V7[b1];
  var set = {};
  [fig, a1, a2, b1, ab1].forEach(function(f) { if (f) set[f] = true; });
  return Object.keys(set);
}

function analyseSuperpositionReseaux(theme) {
  var r1 = reseauFigureV7(theme[1]);
  var r7 = reseauFigureV7(theme[7]);
  var houses = [];
  for (var p = 1; p <= 16; p++) {
    var base = theme[p];
    var res = getResultant(base, p);
    var in1 = r1.indexOf(base) >= 0 || r1.indexOf(res) >= 0;
    var in7 = r7.indexOf(base) >= 0 || r7.indexOf(res) >= 0;
    if (in1 && in7) houses.push(p);
  }
  return { count: houses.length, houses: houses, reseauM1: r1, reseauM7: r7 };
}


function toggleThemeVerification(){
  var panel = document.getElementById('verif-theme-panel');
  if(!panel) return;
  if(panel.style.display === 'none' || !panel.style.display){
    if(!currentTheme){ alert('Lance un theme avant.'); return; }
    var mA = currentTheme[1], mB = currentTheme[4], mC = currentTheme[7], mD = currentTheme[10];
    var vt = calcTheme(mA, mB, mC, mD);
    var html = '<h3>🔎 Thème de vérification — mères = axe cardinal (M1, M4, M7, M10)</h3>';
    html += '<div class="kv"><b>Mères utilisées :</b> M1=' + FL[mA] + ', M4=' + FL[mB] + ', M7=' + FL[mC] + ', M10=' + FL[mD] + '</div>';
    html += '<div style="overflow-x:auto; padding:10px 0;"><div id="verif-theme-grid"></div></div>';
    try {
      var vf = verdictFinal(vt);
      var rp = rangParole(vf);
      html += '<div class="kv" style="margin-top:8px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px;"><b>Verdict (sur ce thème de vérification) :</b> ' + vf.label + ' <span style="font-size:11px; opacity:.7;">(rang ' + rp.rang + '/5, ' + rp.etage + ')</span></div>';
    } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    panel.innerHTML = html;
    renderMiniTheme(vt, 'verif-theme-grid', 46);
    panel.style.display = 'block';
    var btn = document.getElementById('verifThemeBtn');
    if (btn) btn.textContent = '🔎 Masquer thème de vérification';
  } else {
    panel.style.display = 'none';
    var btn2 = document.getElementById('verifThemeBtn');
    if (btn2) btn2.textContent = '🔎 Thème de vérification';
  }
}

function buildQuestionContext(){const questions=Array.from(document.querySelectorAll('.userQuestionCb:checked')).map(o=>o.value); const compSel=document.getElementById('competitionMode'); const domEl=document.getElementById('matchDomicile'); const favEl=document.getElementById('matchFavorite'); const qTextEl=document.getElementById('userQuestionText'); return {team1:(document.getElementById('team1').value||'').trim(),team2:(document.getElementById('team2').value||'').trim(),date:document.getElementById('matchDate').value,time:document.getElementById('matchTime').value,stadium:(document.getElementById('stadium').value||'').trim(),postalCode:(document.getElementById('postalCode').value||'').trim(),competition:compSel?compSel.value:'fra_l1',domicile:domEl?domEl.value:'none',favorite:favEl?favEl.value:'none',questionLabels:questions,questionLibre:(qTextEl?qTextEl.value:'').trim(),valid:true};}
function renderQuestionContext(c){const el=document.getElementById('question-context'); if(!c){el.innerHTML='<div class="muted">Sélectionne le match, puis lance le thème (les questions sont facultatives).</div>'; return;} const compEntry=COMPETITION_INDEX[c.competition]||{label:'France — Ligue 1',tier:1}; const compTier=TIER_CONFIG[compEntry.tier]||TIER_CONFIG[1]; const compCfg={label:compEntry.label,enjeu:compTier.enjeu,tension:compTier.tension}; const team1Safe=escHtml(c.team1||'Équipe 1'), team2Safe=escHtml(c.team2||'Équipe 2'); const domLabel=c.domicile==='team1'?team1Safe:c.domicile==='team2'?team2Safe:'non renseignée'; const favLabel=c.favorite==='team1'?team1Safe:c.favorite==='team2'?team2Safe:'aucun favori net'; el.innerHTML=`<div class="kv"><b>Match ciblé :</b> ${team1Safe} vs ${team2Safe}</div><div class="kv"><b>Compétition :</b> <span class="ok">${escHtml(compCfg.label)}</span> (enjeu x${compCfg.enjeu}, tension x${compCfg.tension})</div><div class="kv"><b>Date :</b> ${escHtml(c.date)||'non renseignée'}</div><div class="kv"><b>Heure :</b> ${escHtml(c.time)||'non renseignée'}</div><div class="kv"><b>Lieu :</b> ${escHtml(c.stadium)||'non renseigné'}</div><div class="kv"><b>Code postal :</b> ${escHtml(c.postalCode)||'non renseigné'}</div><div class="kv"><b>Équipe à domicile :</b> ${domLabel}</div><div class="kv"><b>Favori du match :</b> <span class="ok">${favLabel}</span></div><div class="kv"><b>Questions retenues :</b> ${c.questionLabels.length?escHtml(c.questionLabels.join(' | ')):'aucune'}</div>${c.questionLibre?'<div class="kv"><b>Ta question :</b> <span class="ok">'+escHtml(c.questionLibre)+'</span></div>':''}`;}

// AJOUTÉ (demande utilisateur) : les "questions à traiter" cochées par
// l'utilisateur étaient collectées et listées (renderQuestionContext),
// mais jamais RÉPONDUES nulle part dans le code — notamment
// "domicile_gagne", qui ne pouvait de toute façon pas l'être avant
// l'ajout du champ "Équipe à domicile" ci-dessus. Appelé depuis
// renderTheme() une fois le verdict disponible.
function renderQuestionAnswers(context, vf, carte, htWinner){
  if (!context || !context.questionLabels || !context.questionLabels.length) return;
  var el = document.getElementById('question-context');
  if (!el) return;
  var t1 = context.team1 || 'Équipe 1', t2 = context.team2 || 'Équipe 2';
  var winnerName = vf.winner==='M1' ? t1 : vf.winner==='M7' ? t2 : vf.winner==='Nul' ? 'Nul' : 'Indéterminé';
  var lines = [];
  context.questionLabels.forEach(function(q){
    if (q==='nul_ou_victoire') {
      lines.push('<b>Nul ou victoire ?</b> ' + (vf.winner==='Nul' ? 'Nul probable' : (vf.winner ? 'Victoire (' + winnerName + ')' : 'Indéterminé')));
    } else if (q==='penalty_ou_rouge') {
      var incTxt = carte.penaltyRouge
        ? 'Oui, signal présent — ' + (carte.incidentNiveau || '') + (carte.incidentPct ? ' (' + carte.incidentPct + '%)' : '') + (carte.incidentInevitable ? ' ⚠️ quasi inévitable' : '')
        : 'Aucun signal détecté';
      lines.push('<b>Penalty ou rouge ?</b> ' + incTxt);
    } else if (q==='domicile_gagne') {
      if (context.domicile==='none') {
        lines.push('<b>L\'équipe à domicile va-t-elle gagner ?</b> Indéterminé — équipe à domicile non renseignée ci-dessus');
      } else {
        var domicileTeam = context.domicile==='team1' ? t1 : t2;
        var exterieurTeam = context.domicile==='team1' ? t2 : t1;
        var domicileCode = context.domicile==='team1' ? 'M1' : 'M7';
        var rep = vf.winner==='Nul' ? 'Non — nul probable, ni l\'un ni l\'autre'
          : (vf.winner===domicileCode ? 'Oui, ' + domicileTeam + ' (domicile) est favorite'
          : (vf.winner ? 'Non, ' + exterieurTeam + ' (extérieur) est favorite' : 'Indéterminé'));
        lines.push('<b>L\'équipe à domicile va-t-elle gagner ?</b> ' + rep);
      }
    } else if (q==='premier_but') {
      var htLabel = htWinner==='M1' ? t1 : htWinner==='M7' ? t2 : htWinner==='both' ? 'Les deux' : 'Indéterminé';
      lines.push('<b>Qui va marquer en premier ?</b> ' + htLabel);
    } else if (q==='equipe1_gagne') {
      var rep1 = vf.winner==='Nul' ? 'Non — nul probable'
        : (vf.winner==='M1' ? 'Oui, ' + t1 + ' est favorite'
        : (vf.winner ? 'Non, ' + t2 + ' est favorite' : 'Indéterminé'));
      lines.push('<b>' + t1 + ' va-t-il gagner ce match ?</b> ' + rep1);
    }
  });
  if (lines.length) {
    el.innerHTML += '<div class="kv" style="margin-top:8px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px;"><b>📋 Réponses aux questions retenues :</b></div>'
      + lines.map(function(l){ return '<div class="kv" style="font-size:12px;">' + l + '</div>'; }).join('');
  }
}
// Met à jour en direct le libellé "Équipe 1 va-t-il gagner ?" avec le vrai
// nom saisi (ex. "Real va-t-il gagner ce match ?"), demande explicite
// Ellemine_D (28/07/26).
function updateEquipe1QuestionLabel(name){
  var el = document.getElementById('q-equipe1-label');
  if (el) el.textContent = (name && name.trim()) ? name.trim() : 'Équipe 1';
}
function randomDie(){return Math.floor(Math.random()*6)+1;}
function oddEvenToPoint(v){return v%2===1?1:2;}
function figFromArray(arr){for(const k in MAP_GEO) if(MAP_GEO[k].every((v,i)=>v===arr[i])) return k; return 'via';}
function symb(fig){return MAP_GEO[fig].map(v=>v===2?'◆◆':'◆ ').join('<br>');}
function combine(a,b){const x=MAP_GEO[a]||MAP_GEO.via,y=MAP_GEO[b]||MAP_GEO.via; return figFromArray(x.map((v,i)=>((v+y[i])%2===0?2:1)));}
function combineMany(arr){return arr.slice(1).reduce((acc,f)=>combine(acc,f),arr[0]||'via');}

// ═══════════════════════════════════════════════════════════════
// MAINTENANCE (03/09/26) — CRITÈRE DE VALIDITÉ CENTRALISÉ
// Le test « les 3 axes du carré (Cardinal/Succédent/Cadent) + l'Axe du
// Partage doivent tous exister dans le thème, en base ou en résultante »
// était recalculé indépendamment dans 5 fonctions du fichier
// (toggleValiditePanel, analyzeValidation, themeInvalidite,
// niveauValiditeV7, isThemeValideStrict) — le commentaire historique sur
// niveauValiditeV7 documente qu'elles s'étaient déjà retrouvées
// désynchronisées une fois (une copie à 3 axes pendant que les autres
// étaient passées à 4). Les 5 s'appuient désormais sur ce calcul unique ;
// une seule mise à jour future suffit à les garder synchronisées.
const AXES_VALIDITE_DEFS = [
  {key:'cardinal',  label:'Axe Cardinal (M1 + M4 + M7 + M10)',   houses:[1,4,7,10]},
  {key:'succedent', label:'Axe Succédent (M2 + M5 + M8 + M11)',  houses:[2,5,8,11]},
  {key:'cadent',    label:'Axe Cadent (M3 + M6 + M9 + M12)',     houses:[3,6,9,12]},
  {key:'partage',   label:"Axe du Partage (M3 + M5 + M9 + M11)", houses:[3,5,9,11]}
];
function evaluerAxesValidite(theme){
  return AXES_VALIDITE_DEFS.map(function(def){
    const fig = combineMany(def.houses.map(function(h){ return theme[h]; }));
    const positions = positionsBaseEtResultantes(fig, theme);
    return {key:def.key, label:def.label, houses:def.houses, fig:fig, exists:positions.length>0, positions:positions};
  });
}

// ═══════════════════════════════════════════════════════════════
// COÏNCIDENCE JUGE / 3 AXES (03/09/26, piste d'Ellemine_D : « le Juge est
// l'ensemble des figures des 3 axes »)
// ⚠️ CORRIGÉ LE 04/09/26 — LA LECTURE D'ORIGINE ÉTAIT FAUSSE. Elle
// disait : « ce n'est pas une identité, mais ça arrive 8192/65536 = 1/8
// des thèmes — deux fois le taux du hasard — donc un vrai lien
// structurel existe, partiel ». En creusant « Somme des 3 axes » puis
// « Cardinal + Succédent = Cadent » (demande Ellemine_D), on a prouvé
// EXHAUSTIVEMENT (cf. la loi du triplet → Populus, juste avant
// autoTestLoiMaisonV7) que combineMany([Cardinal, Succédent, Cadent])
// est TOUJOURS Populus, sur les 65 536 thèmes sans exception — parce
// que les 3 axes partagent exactement les maisons M1-M12 en 3 groupes
// de 4, et que combiner un triplet parent-parent-enfant redonne
// toujours Populus.
// CETTE FONCTION NE MESURE DONC QU'UNE SEULE CHOSE : la fréquence à
// laquelle le Juge (M15) tombe sur Populus — 8192/65536 = 1/8 exactement
// (vérifié directement, sans passer par les axes). Ce n'est pas un lien
// entre le Juge et « l'ensemble des axes » : c'est la distribution de
// M15 elle-même, qui n'est pas uniforme (1/8 au lieu de 1/16 si les 16
// figures étaient équiprobables en M15) — une question intéressante en
// soi, mais différente de celle posée à l'origine.
// Le calcul, son résultat (true/false par thème) et son statut
// (informatif, aucun poids sur le verdict) restent inchangés : seule la
// lecture du POURQUOI était trompeuse.
function coincidenceJugeAxesV7(theme){
  var axeCard = combineMany([theme[1], theme[4], theme[7], theme[10]]);
  var axeSucc = combineMany([theme[2], theme[5], theme[8], theme[11]]);
  var axeCad = combineMany([theme[3], theme[6], theme[9], theme[12]]);
  return combineMany([axeCard, axeSucc, axeCad]) === theme[15];
}

// ═══════════════════════════════════════════════════════════════
// SIGNAL M4/M10 — BOUCLE DE M1 OU M7 (03/09/26, piste d'Ellemine_D :
// « M4 et M10 sont les maisons où M1 ou M7 sont directement atteints ; si
// M4 et M10 soutiennent un camp, ce camp gagne ») — formalisé comme :
// M1 et M7 doivent être dans deux boucles binôme différentes (sinon la
// règle est muette), puis M4 ET M10 doivent être TOUS LES DEUX dans la
// même boucle que M1 (→ M1 soutenu) ou que M7 (→ M7 soutenu).
// Vérifié sur l'archive réelle (45 cas) : s'applique 13/45 fois, exact
// 8/13 (62%), 8/11 (73%) en excluant les nuls (jamais prédits par cette
// règle). Contrôle fait : regarder la seule boucle de M1 (sans M4/M10) ne
// donne que 38%, sous le hasard — c'est bien l'accord de M4 ET M10 qui
// porte le signal, pas la boucle de M1 seule. C'est le résultat le plus
// net trouvé à ce jour sur l'archive, mais l'échantillon (11-13 cas)
// reste modeste — statut : signal EN OBSERVATION, pas encore au niveau de
// preuve exigé ailleurs dans ce fichier (souvent 80%+ sur des échantillons
// plus larges). Aucun poids sur le verdict pour l'instant.
function signalM4M10BoucleV7(theme){
  var l1 = loopOf(theme[1]), l7 = loopOf(theme[7]);
  if (!l1 || !l7 || l1 === l7) return {applicable:false, campSoutenu:null};
  var l4 = loopOf(theme[4]), l10 = loopOf(theme[10]);
  var camp = null;
  if (l4 === l10 && l4 === l1) camp = 'M1';
  else if (l4 === l10 && l4 === l7) camp = 'M7';
  return {applicable: camp !== null, campSoutenu: camp, l1:l1, l7:l7, l4:l4, l10:l10};
}

// ═══════════════════════════════════════════════════════════════
// SIGNAL M15/M16 — BOUCLE INVERSÉE DU JUGE/SENTENCE (03/09/26, piste
// d'Ellemine_D : « M13/M14 sont des témoins, 15 Juge, 16 Sentence, sont
// dans une autre dimension ») — même mécanisme que signalM4M10BoucleV7
// (M1/M7 dans deux boucles différentes, puis les deux maisons choisies
// tombent-elles ensemble dans l'une des deux boucles ?), mais appliqué à
// M15+M16, et dans le sens INVERSÉ : sur l'archive, quand M15 et M16
// tombent ensemble dans la boucle d'un camp, c'est l'AUTRE camp qui gagne
// le plus souvent (9/11 = 82%, contre 55% pour deviner le camp majoritaire
// du même sous-groupe — soit +27 points).
// ⚠️ STATUT PLUS FRAGILE que signalM4M10BoucleV7 : ce sens inversé a été
// trouvé en retournant l'hypothèse directe après coup (qui, elle, donnait
// 2/11 = 18%, très en dessous du hasard) — tester les deux sens d'une
// hypothèse augmente le risque de fausse piste par rapport à une
// prédiction faite à l'avance. Échantillon (11 cas) modeste. Aucun poids
// sur le verdict.
function signalM15M16BoucleV7(theme){
  var l1 = loopOf(theme[1]), l7 = loopOf(theme[7]);
  if (!l1 || !l7 || l1 === l7) return {applicable:false, campPredit:null};
  var l15 = loopOf(theme[15]), l16 = loopOf(theme[16]);
  var campAccorde = null;
  if (l15 === l16 && l15 === l1) campAccorde = 'M1';
  else if (l15 === l16 && l15 === l7) campAccorde = 'M7';
  var campPredit = campAccorde === 'M1' ? 'M7' : campAccorde === 'M7' ? 'M1' : null;
  return {applicable: campAccorde !== null, campAccorde: campAccorde, campPredit: campPredit, l1:l1, l7:l7, l15:l15, l16:l16};
}

// ═══════════════════════════════════════════════════════════════
// SIGNAL AXE CADENT INVERSÉ (03/09/26, demande Ellemine_D : « creusez
// l'utilité des axes ») — pour chaque axe (Cardinal, Succédent, Cadent,
// Partage), on regarde dans quel camp (CAMP1/CAMP2) tombent le plus les
// positions (base+résultante) de la figure combinée de l'axe, et on
// compare ce "vote" au vainqueur réel. Sur l'archive (45 cas) :
//   Cardinal ........ 56% (baseline locale 52%, +4 pts)
//   Succédent ....... 62% (baseline locale 54%, +8 pts)
//   Partage ......... 52% (baseline locale 62%, -10 pts)
//   Cadent (direct) . 30% (baseline locale 52%, -22 pts) ← très en dessous
//   Cadent INVERSÉ .. 70% (baseline locale 52%, +18 pts, n=23)
// Le Cadent direct est si mauvais qu'inversé il devient le signal avec le
// plus grand échantillon testé à ce jour (23 cas, contre 11-13 pour
// M4/M10 et M15/M16). Même réserve que M15/M16 : trouvé en inversant une
// hypothèse après coup, donc plus fragile qu'une prédiction faite à
// l'avance — mais l'échantillon plus large rend celui-ci un peu plus
// crédible. Aucun poids sur le verdict.
function signalAxeCadentInverseV7(theme){
  var fig = combineMany([theme[3], theme[6], theme[9], theme[12]]);
  var pos = positionsBaseEtResultantes(fig, theme);
  var inCamp1 = 0, inCamp2 = 0;
  pos.forEach(function(p){
    var h = parseInt(p.replace('M','').replace('r',''), 10);
    if (CAMP1.indexOf(h) >= 0) inCamp1++;
    else if (CAMP2.indexOf(h) >= 0) inCamp2++;
  });
  var voteDirect = null;
  if (inCamp1 > inCamp2) voteDirect = 'M1';
  else if (inCamp2 > inCamp1) voteDirect = 'M7';
  var campPredit = voteDirect === 'M1' ? 'M7' : voteDirect === 'M7' ? 'M1' : null;
  return {applicable: campPredit !== null, voteDirect: voteDirect, campPredit: campPredit, fig: fig, inCamp1: inCamp1, inCamp2: inCamp2};
}
// ═══════════════════════════════════════════════════════════════
// SIGNAL DE RECOUVREMENT DES CAMPS (03/09/26, demande Ellemine_D :
// « la disposition des figures dans les maisons divise le thème en
// deux, dis-moi ce que tu remarques ») — pour chaque figure du thème,
// on compte ses occurrences dans les 8 maisons de CAMP1 et dans les 8
// maisons de CAMP2, et on somme le minimum des deux : plus les deux
// camps sont bâtis avec LES MÊMES figures, plus le calcul de force
// interne du thème tend à s'annuler des deux côtés — c'est exactement
// ce que verdictV7 calcule en interne (« Cycles contredisent → Nul »
// côté M ET côté R) avant qu'un arbitrage de départage ne force un
// vainqueur.
// MESURÉ SUR 55 CAS AU CAMP CONNU :
//   recouvrement < 3 (camps peu partagés) ..... 2/22 nuls = 9,1 %
//   recouvrement >= 3 (camps très partagés) ... 10/33 nuls = 30,3 %
//   recouvrement >= 5 ......................... 1/2 nuls = 50,0 %
//   baseline globale .......................... 12/55 = 21,8 %
// Fisher exact sur le seuil <3/≥3 : p≈0,10 — pas encore significatif,
// mais c'est le seul signal de nul testé jusqu'ici qui a un POURQUOI
// mécanique (le matériau des deux camps se ressemble), pas seulement
// une corrélation trouvée après coup. Aucun poids sur le verdict.
function signalRecouvrementCampsV7(theme){
  var c1 = {}, c2 = {};
  CAMP1.forEach(function(h){ c1[theme[h]] = (c1[theme[h]]||0) + 1; });
  CAMP2.forEach(function(h){ c2[theme[h]] = (c2[theme[h]]||0) + 1; });
  var figs = Object.keys(c1).concat(Object.keys(c2)).filter(function(f, i, arr){ return arr.indexOf(f) === i; });
  var overlap = 0, detail = [];
  figs.forEach(function(f){
    var a = c1[f] || 0, b = c2[f] || 0, m = Math.min(a, b);
    overlap += m;
    if (m > 0) detail.push({fig: f, campM1: a, campM7: b});
  });
  return {overlap: overlap, eleve: overlap >= 3, detail: detail};
}
// ═══════════════════════════════════════════════════════════════
// SIGNAL DE FRAGILITÉ M4/M10 — MOTIF DU "LES DEUX MARQUENT" (03/09/26,
// demande Ellemine_D : « pour que les deux marquent découle de la
// fragilité de M4 et M10 »)
// ⚠️ CORRIGÉ LE 04/09/26 (sa question directe : « M4 et M10 sont pour
// quel camp ? ») — ce commentaire disait « M4 et M10 forment la ligne
// défensive commune aux deux camps ». FAUX au sens de CAMP1/CAMP2
// (const CAMP1=[1,2,3,4,9,10,13,16]) : M4 ET M10 appartiennent TOUS LES
// DEUX à CAMP1, aucun des deux n'est dans CAMP2. « Commune aux deux
// camps » venait d'un AUTRE découpage, purement visuel, celui du carré
// (ZONE_M1_MAISONS/ZONE_M7_MAISONS/ZONE_NEUTRE_MAISONS=[4,10]) où M4 et
// M10 sont NEUTRES parce qu'ils tombent exactement sur l'axe central du
// dessin — rien à voir avec CAMP1/CAMP2. Le signal ci-dessous ne s'appuie
// sur AUCUN des deux découpages de camp : il regarde seulement si LA
// FIGURE en M4 ou M10 est mobile et ouverte, quel que soit le camp
// auquel la maison appartient. Une figure "fragile" ici = mobile ET
// ouverte à la fois (tables traditionnelles MOBILITE_FIGURE /
// OUVERTURE_FIGURE) : une défense qui bouge et qui laisse passer.
// MESURÉ SUR 45 CAS AU BTTS CONNU (baseline 53,3 %) :
//   M4 ou M10 mobile+ouverte ......... 64,5 % (20/31) — Fisher p≈0,05
//   ni l'une ni l'autre ............... 28,6 % (4/14)
// ⚠️ DEUX PISTES ÉCARTÉES APRÈS VÉRIFICATION (03/09/26, sur sa demande
// « creuse la version inversée » puis « axe offensive des deux camps ») :
//   - M1/M7 mobiles+ouvertes ("l'attaque ouverte fait marquer") va dans
//     le sens INVERSE (38,1 % vs 66,7 %) — c'est la fermeture de M1/M7,
//     pas leur ouverture, qui accompagne le BTTS. Combinée à ce
//     signal-ci, la significativité BAISSE (p≈0,14 au lieu de 0,05) :
//     les deux se recouvrent trop (18/45 cas où les deux sont vraies
//     ensemble) pour être deux mécanismes indépendants qui s'additionnent.
//   - la figure de l'axe offensif commun (combine de M3+M5+M9+M11)
//     mobile+ouverte est EXACTEMENT à la baseline (53,3 % pile des deux
//     côtés) — nulle, ne discrimine rien, seule ou combinée.
// Seul le signal M4/M10 survit à ces deux vérifications ; c'est le seul
// retenu ici. Aucun poids sur le verdict.
// ═══════════════════════════════════════════════════════════════
// COMMENT ON LIT M4 ET M10, ÉTAPE PAR ÉTAPE (05/09/26)
// Ellemine_D : « comment tu analyses m4 et m10, étape par étape ».
// La procédure est écrite ici en fonction exécutable plutôt qu'en
// commentaire, pour qu'elle soit vérifiable sur n'importe quel thème et
// qu'elle porte ses propres pièges.
// ═══════════════════════════════════════════════════════════════
function analyseM4M10V7(theme) {
  if (!theme || !theme[4] || !theme[10]) return null;
  var E = [];
  var f4 = theme[4], f10 = theme[10];
  var nom = function (f) { return FL[f] || f; };

  // ÉTAPE 1 — QUI EST DANS CHAQUE MAISON, ET DE QUI ELLE EST LA DÉFENSE.
  // M4 est la 4e maison comptée depuis M1 : la défense du camp 1.
  // M10 est la 4e comptée depuis M7 (7→8→9→10) : la défense du camp 2.
  // C'est la lecture en maisons dérivées, pas une convention arbitraire.
  E.push({ n: 1, titre: 'Qui garde quel but',
    m4: nom(f4) + ' — 4e depuis M1, défense du camp 1',
    m10: nom(f10) + ' — 4e depuis M7, défense du camp 2' });

  // ÉTAPE 2 — LE PIÈGE DES CAMPS, dans lequel je suis tombé le 03/09.
  // M4 ET M10 SONT TOUTES LES DEUX DANS CAMP1 (=[1,2,3,4,9,10,13,16]).
  // Elles ne sont donc PAS « une maison par camp » au sens du tableau des
  // camps, même si elles gardent chacune un but. Confondre les deux
  // lectures fait écrire des faussetés — j'en ai écrit une ce jour-là.
  E.push({ n: 2, titre: 'Le piège des camps',
    fait: 'M4 et M10 appartiennent TOUTES DEUX à CAMP1',
    consequence: 'lecture « maison dérivée » ≠ lecture « tableau des camps » — ne pas les mélanger' });

  // ÉTAPE 3 — LA LOI. M4 ⊕ M10 = M3, vérifié sur 65 536 thèmes.
  // Conséquence pratique : les deux maisons ne sont pas indépendantes.
  // Tout énoncé sur le COUPLE (M4, M10) est un énoncé sur M3, déguisé.
  var loi = null;
  try { loi = (combine(f4, f10) === theme[3]); } catch (e) { loi = null; }
  E.push({ n: 3, titre: 'La loi qui les lie',
    formule: 'M4 ⊕ M10 = M3', verifie: loi, m3: nom(theme[3]),
    consequence: 'un signal bâti sur le COUPLE parle en réalité de M3' });

  // ÉTAPE 4 — LES PROPRIÉTÉS DOCTRINALES DE CHAQUE FIGURE, séparément.
  // Mobilité, ouverture, force, planète, et le dénouement de JUGE_RECIT.
  function props(f) {
    var jr = (typeof JUGE_RECIT !== 'undefined') ? JUGE_RECIT[f] : null;
    return { figure: nom(f),
      mobilite: MOBILITE_FIGURE[f], ouverture: OUVERTURE_FIGURE[f],
      force: (typeof FORCE_FIGURE !== 'undefined') ? FORCE_FIGURE[f] : null,
      planete: (typeof PLANETES_V7 !== 'undefined') ? PLANETES_V7[f] : null,
      denouement: jr ? jr.denouement : null,
      vainqueur: jr ? jr.vainqueur : null,
      // ⚠️ seuls 'favori', 'outsider', 'premier_marqueur' et
      // 'dominant_structurel' NOMMENT quelqu'un et sont donc
      // falsifiables. 'selon_chaos' et 'indetermine' ne peuvent pas
      // échouer et ne doivent entrer dans aucun décompte (cf. 04/09).
      falsifiable: jr ? ['favori', 'outsider', 'premier_marqueur', 'dominant_structurel']
        .indexOf(jr.vainqueur) >= 0 : null };
  }
  E.push({ n: 4, titre: 'Ce que dit chaque figure, séparément',
    m4: props(f4), m10: props(f10) });

  // ÉTAPE 5 — LA FRAGILITÉ, ET SON PIÈGE DE LECTURE.
  // « mobile ET ouverte » = la maison laisse passer. Le signal existant
  // renvoie applicable = fragileM4 OU fragileM10, et n'a PAS de champ
  // `fragile` — lire s.fragile renvoie undefined, donc false. J'ai fait
  // l'erreur toute la journée du 04/09.
  var sig = null;
  try { sig = signalFragiliteM4M10V7(theme); } catch (e) { sig = null; }
  E.push({ n: 5, titre: 'Fragilité',
    m4Fragile: sig ? !!sig.fragileM4 : null,
    m10Fragile: sig ? !!sig.fragileM10 : null,
    piege: 'le champ `fragile` N\'EXISTE PAS — lire fragileM4 et fragileM10 séparément' });

  // ÉTAPE 6 — LA LECTURE SÉPARÉE, qui est la seule que les mesures
  // soutiennent. Trois protocoles différents disent que M4 porte et que
  // M10 ne porte pas :
  //   · balayage des 13 maisons sur les buts : M4 p=0,285 · M10 p=0,958 (dernière)
  //   · doctrine du M4 : Albus/Carcer marchent en M4, rien en M10 (p=0,643)
  //   · fragilité : M4 seule +24 pts de BTTS, M10 seule −17 pts
  // Donc on lit M4, on note M10, et on ne les additionne pas.
  E.push({ n: 6, titre: 'Le poids à leur donner',
    m4: 'PORTE — c\'est elle qu\'on lit',
    m10: 'NE PORTE PAS sur les mesures faites à ce jour — on la note, on ne s\'appuie pas dessus',
    interdit: 'ne PAS additionner les deux : elles tirent en sens contraire et s\'annulent',
    statut: 'aucune des trois mesures n\'atteint seule la significativité — c\'est leur convergence qui parle' });

  // ÉTAPE 7 — CE QU'ON NE SAIT TOUJOURS PAS, dit explicitement.
  E.push({ n: 7, titre: 'Ce qui reste ignoré',
    points: ['M4 seule n\'a jamais été testée hors échantillon (n=19, un seul cas dans les 11 du 04/09)',
             'pourquoi M10 est muette n\'est pas expliqué',
             'M3, leur différence, ne dit rien sur six cibles testées le 05/09'] });

  return { m4: nom(f4), m10: nom(f10), m3: nom(theme[3]), loiVerifiee: loi, etapes: E };
}

// ═══════════════════════════════════════════════════════════════
// M4 PORTE, M10 NE PORTE PAS — ET LES APPARIER ANNULE LE SIGNAL
// (05/09/26, après les 11 résultats réels du 04/09)
//
// ☠️ D'ABORD UNE ERREUR DE LECTURE, LA MIENNE, RÉPÉTÉE TOUTE LA JOURNÉE.
// Cette fonction renvoie { applicable, fragileM4, fragileM10, m4, m10 }.
// Il n'y a AUCUN champ `fragile`. J'ai lu `s.fragile` dans tous mes tests
// du 04/09 — sur Abha, sur Lyon, dans le tableau des 13 matchs — et
// `undefined` s'évalue à false. Chaque « fragilité : false » rapporté ce
// jour-là ne portait sur rien. Le signal n'était pas en cause.
//
// ── LE VRAI TEST, SUR 52 CAS AU BTTS CONNU (41 archive + 11 du soir) ──
//     OU  — M4 ou M10 fragile (ce que le code fait) . 51,9 % contre 44,0 %  p = 0,592
//     ET  — M4 ET M10 fragiles ...................... 50,0 % contre 47,8 %  p = 1,000
//     M4 fragile SEULE .............................. 63,2 % contre 39,4 %  p = 0,150
//     M10 fragile SEULE ............................. 35,7 % contre 52,6 %  (sens INVERSE)
//
// Les deux maisons tirent en SENS CONTRAIRE. M4 fragile pousse le BTTS
// vers le haut, M10 fragile le pousse vers le bas. C'est exactement pour
// ça que le OU et le ET s'annulent : on additionne deux forces opposées
// et on obtient zéro.
//
// ── ET CE N'EST PAS UN ACCIDENT : TROIS MESURES INDÉPENDANTES DISENT LA
//    MÊME CHOSE, chacune faite pour une autre raison ──
//   1. Balayage des 13 maisons sur les buts (04/09) :
//      M4 p = 0,285 · M10 p = 0,958, DERNIÈRE des treize.
//   2. Doctrine d'Ellemine_D sur M4 (04/09) : Albus/Carcer en M4 tiennent
//      les buts (2,50 contre 3,49) ; les mêmes figures en M10 ne font
//      rien (p = 0,643). Le contrôle positionnel était déjà là.
//   3. Ce test-ci : M4 fragile +24 points de BTTS, M10 fragile −17.
//
// Trois protocoles différents, trois fois la même asymétrie. Aucun des
// trois n'atteint seul la significativité — mais ils ne sont pas
// indépendants par hasard : ils pointent tous le même endroit.
//
// ➜ CE QUE ÇA PROPOSE, ET CE QUE ÇA N'AUTORISE PAS ENCORE.
//   Proposition : les signaux « défensifs » devraient se lire sur M4
//   SEULE. Apparier M4 à M10 n'ajoute pas d'information — ça en retire.
//   Ce qui manque : le M4 seul n'a JAMAIS été testé hors échantillon
//   (n = 19, presque tous d'archive ; un seul cas dans les 11 du soir).
//   Donc : ne rien recâbler. Inscrire, et attendre des cas.
//
//   ⚠️ Et se souvenir du 04/09 : M4 ⊕ M10 = M3 sur 65 536 thèmes. Si M4
//   porte et M10 non, alors M3 — leur différence — mélange un porteur et
//   un muet. Ça pourrait expliquer pourquoi M3 ne dit rien nulle part
//   (balayage du 05/09 : buts p = 0,43, BTTS p = 0,92, nul p = 0,86,
//   R1 p = 0,92, incident p = 0,45, corners p = 0,73 — six cibles, rien).
// ═══════════════════════════════════════════════════════════════
function signalFragiliteM4M10V7(theme){
  function fragile(fig){ return MOBILITE_FIGURE[fig] === 'mobile' && OUVERTURE_FIGURE[fig] === 'ouverte'; }
  var fragileM4 = fragile(theme[4]), fragileM10 = fragile(theme[10]);
  return {applicable: fragileM4 || fragileM10, fragileM4: fragileM4, fragileM10: fragileM10, m4: theme[4], m10: theme[10]};
}
// ═══════════════════════════════════════════════════════════════
// SIGNAL M4 — DOCTRINE JUGE_RECIT APPLIQUÉE À M4 (04/09/26, demande
// Ellemine_D : « Via en M4 implique souvent les deux marquent, Fortuna
// Major en M4 est bon en défensive, Fortuna Minor et Via pour les deux
// marquent ») — JUGE_RECIT décrit le dénouement propre à chaque figure,
// écrit AVANT tout test statistique. Quatre figures y disent, chacune à
// sa façon, "les deux camps marquent" :
//   Via         : « issue par le flux (buts des deux côtés) » — explicite
//   Conjunctio  : « les deux camps se répondent »
//   Amissio     : « celui qui mène finit par perdre » — suppose que
//                 les deux ont marqué, sinon pas de retournement possible
//   Fortuna Minor : « renversement, l'outsider finit par l'emporter » — idem
// La piste d'origine (Via + Fortuna Minor) a été élargie à Conjunctio et
// Amissio en relisant JUGE_RECIT en entier, pas en re-fouillant l'archive.
// MESURÉ SUR 45 CAS AU BTTS CONNU (baseline 53,3 %) :
//   M4 dans ce groupe de 4 (n=12) ......... 75,0 % (9/12), Fisher p≈0,10
//   M4 = Carcer/Tristitia/Albus (n=8) ..... 50,0 % (4/8) — proche baseline
//   toutes les autres figures (n=25) ...... 44,0 % (11/25)
// ⚠️ Fortuna Major (« le favori s'impose par la force établie », donc
// PAS un scénario à deux marqueurs) n'a qu'1 seul cas dans l'archive —
// pas assez pour juger sa piste "bon en défensive" séparément ; non
// retenue ici, à revoir avec plus de cas. Aucun poids sur le verdict.
function signalM4JugeRecitBttsV7(theme){
  var FAVORABLE_BTTS = ['via', 'conjunctio', 'amissio', 'fortuna_minor'];
  var m4 = theme[4];
  return {applicable: FAVORABLE_BTTS.indexOf(m4) >= 0, m4: m4};
}
// ═══════════════════════════════════════════════════════════════
// SIGNAL JUGE POPULUS + AXES CHARGÉS (04/09/26, demande Ellemine_D) —
// JUGE_RECIT dit du Juge Populus : « miroir/neutralité — nul, SAUF rôle
// Chaotique : accident décisif (penalty/rouge) ». Trouvé sur un thème
// réel (Laetitia/Laetitia/Caput/Carcer) que Cardinal et Cadent y étaient
// Puer et Rubeus — les deux SEULES figures de Mars du système
// (FIGURES_MARS_V7) — et que ce thème affichait justement un incident à
// 58 % avec penalty ET rouge signalés ensemble. Hypothèse : compter,
// parmi Cardinal/Succédent/Cadent, combien sont des figures de Mars ou
// négatives (FIGURES_NEGATIVES_V7) donnerait une mesure du risque
// « accident » qui explique l'exception de la doctrine.
// ⚠️ VÉRIFIÉ SUR LES 3 SEULS CAS DE L'ARCHIVE À JUGE POPULUS, ET ÇA NE
// TIENT PAS — dans le mauvais sens en plus :
//   Torino (2 axes chargés) ......... AUCUN incident, vainqueur net
//   FortMajTrist (1 axe chargé) ..... AUCUN incident, NUL (le cas qui
//                                     colle le mieux à la doctrine)
//   AmisAmisCarcLaet (0 axe chargé) . INCIDENT réel, vainqueur net
// Le cas avec le PLUS d'axes chargés n'a pas eu d'incident ; celui avec
// AUCUN axe chargé, si. n=3 est beaucoup trop petit pour conclure quoi
// que ce soit, mais la belle histoire du thème d'origine ne se généralise
// pas telle quelle. Gardé comme signal informatif à réévaluer à chaque
// nouveau cas Juge=Populus (rare : 1/8 des thèmes) ; AUCUN poids sur le
// verdict, et pas encore de sens de lecture fiable.
function signalJugePopulusChaosV7(theme){
  if (theme[15] !== 'populus') return {applicable: false};
  var axeCard = combineMany([theme[1], theme[4], theme[7], theme[10]]);
  var axeSucc = combineMany([theme[2], theme[5], theme[8], theme[11]]);
  var axeCad = combineMany([theme[3], theme[6], theme[9], theme[12]]);
  var axes = [{nom: 'Cardinal', fig: axeCard}, {nom: 'Succédent', fig: axeSucc}, {nom: 'Cadent', fig: axeCad}];
  var chargees = axes.filter(function (a) { return !!(FIGURES_MARS_V7[a.fig] || FIGURES_NEGATIVES_V7[a.fig]); });
  return {applicable: true, axes: axes, nbChargees: chargees.length, chargees: chargees};
}
// ═══════════════════════════════════════════════════════════════
// DENSITÉ DE L'INCIDENT (04/09/26, demande Ellemine_D : « vérifie la
// densité de l'incident ») — le chiffre affiché à l'écran (incidentPct)
// ne vient que du détecteur de signaux seul. Cette fonction rassemble
// TOUS les mécanismes d'incident du fichier (comme faisceauNulV7 le fait
// pour le nul) : combien se déclenchent (densité), et parmi ceux qui
// nomment un camp, sont-ils d'accord (cohérence) ? Le témoin constant
// « toujours M1 » de MOTEURS_INCIDENT_CAMP_V7 est exclu — il n'apporte
// aucune lecture du thème. Purement informatif, aucun poids sur le
// verdict — sert à voir si un incidentPct modéré cache en fait un
// accord large entre mécanismes indépendants, ou l'inverse.
// ═══════════════════════════════════════════════════════════════
// ☠️ L'ATTRIBUTION DU CAMP DE L'INCIDENT EST BATTUE PAR UNE CONSTANTE
// (mesuré le 04/09/26, en direct sur Abha–Al-Ettifaq)
//
// RAPPEL DE SÉMANTIQUE, parce que je l'ai moi-même mal dite en direct :
// incidentCamp désigne le camp qui SUBIT l'incident — le rouge est de son
// côté, le penalty est concédé par lui. Pas celui qui en profite.
//
// Les 7 cas de l'archive au camp d'incident connu :
//     ✓ Bologna .............. réel M1   annoncé M1
//     ✓ Jeudi 27/08 .......... réel M1   annoncé M1
//     ✓ PuerRubeus ........... réel M1   annoncé M1
//     ✗ PopFortMin ........... réel M1   annoncé M7
//     ✗ LaetPop .............. réel M1   annoncé M7
//     ✓ AmisAmisCarcLaet ..... réel M7   annoncé M7
//     ✗ CaputCarcCaputPuer ... réel M1   annoncé M7
//   4/7 juste, et LES TROIS ERREURS VONT DANS LE MÊME SENS : annoncé M7,
//   réel M1.
//
// Abha–Al-Ettifaq du 04/09 ajoute la quatrième, identique : densité
// annoncée M7 avec 100 % d'accord entre ses mécanismes, et l'accident réel
// est un BUT CONTRE SON CAMP d'Abha — donc côté M1. Quatre erreurs, quatre
// fois la même direction.
//
// LE CHIFFRE QUI CONDAMNE : dans la réalité l'incident tombe côté M1 six
// fois sur sept ; le système annonce M7 quatre fois sur sept. Dire
// « toujours M1 » sans rien calculer donnerait 6/7 = 86 %, contre 57 %
// pour le détecteur. Un détecteur battu par une constante ne détecte pas —
// il ajoute du bruit à un taux de base.
//
// ⚠️ NE PAS CÂBLER « TOUJOURS M1 » POUR AUTANT. n = 7, et ce 6/7 peut
// n'être qu'un déséquilibre de l'archive.
//
// ── CORRECTION DU SOIR MÊME (04/09/26) : J'AI CONCLU TROP VITE ──
// Cinq incidents réels sont tombés le soir, et le détecteur en a lu
// QUATRE justes :
//     RealBetis/RealMadrid . dit M1 → réel M1  ✓ (penalty manqué de M7, concédé par M1)
//     Stuttgart/Koln ....... dit M7 → réel M7  ✓ (CSC contre M7)
//     Al-Ahli/Al-Riyadh .... dit M7 → réel M7  ✓ (deux penalties concédés par M7)
//     Al-Shabab/Al-Hilal ... dit M1 → réel M1  ✓ (penalty concédé par M1)
//     Abha/Al-Ettifaq ...... dit M7 → réel M1  ✘ (CSC d'Abha)
// Cumul archive + soir : détecteur 8/12 = 67 %, « toujours M1 » 9/12 =
// 75 %. L'écart tombe de 29 points à 8, soit UN cas. Ma phrase de
// l'après-midi — « un détecteur battu par une constante » — était juste
// sur les 7 cas que j'avais alors, et elle est devenue trop dure dès que
// cinq cas de plus sont arrivés. C'est ce que valent les conclusions à
// n = 7 ; je la corrige plutôt que de la laisser vieillir.
// Ce qui reste vrai : le détecteur n'a toujours rien DÉMONTRÉ, et son
// avantage sur une constante n'est pas établi. Ce qui n'est plus vrai :
// qu'il fasse pire qu'elle.
// ═══════════════════════════════════════════════════════════════
function densiteIncidentV7(theme){
  var factuels = [];
  function safe(fn){ try { return fn(); } catch(e){ return null; } }

  var nm = safe(function(){ return naissancesMarsV7(theme); });
  factuels.push({nom: 'Naissance de Mars (fait)', declenche: !!(nm && nm.length)});

  var air = safe(function(){ return analyserIncidentR1R7(theme); });
  factuels.push({nom: 'Analyse R1/R7', declenche: !!air});

  var sa = safe(function(){ return sommesAxesIncidentV7(theme); });
  factuels.push({nom: 'Sommes des axes', declenche: !!(sa && sa.signal)});

  var idv = safe(function(){ return incidentDerivesV7(theme); });
  factuels.push({nom: 'Dérivés d\'axes', declenche: !!(idv && (idv.rouges > 0 || idv.moyenne >= 50))});

  var fil = safe(function(){ return filiationIncidentV7(theme); });
  factuels.push({nom: 'Filiation', declenche: !!(fil && fil.applicable)});

  var spm = safe(function(){ return signalPlanetesIncidentM13(theme); });
  factuels.push({nom: 'Signal planètes M13', declenche: !!(spm && spm.signal)});

  var camps = [];
  if (air && (air.campRisque === 'R1' || air.campRisque === 'R7')) {
    camps.push({nom: 'Analyse R1/R7', camp: air.campRisque === 'R1' ? 'M1' : 'M7'});
  }
  if (fil && fil.camp) camps.push({nom: 'Filiation', camp: fil.camp});
  if (typeof MOTEURS_INCIDENT_CAMP_V7 !== 'undefined') {
    moteursActifsV7(MOTEURS_INCIDENT_CAMP_V7).forEach(function(m){
      if (m.cle === 'inc_camp_temoin') return; // témoin constant : exclu, n'apporte rien
      var v = safe(function(){ return m.verdict(theme); });
      if (v && v.camp) camps.push({nom: m.nom, camp: v.camp});
    });
  }

  var nbDeclenches = factuels.filter(function(f){ return f.declenche; }).length;
  var comptes = {};
  camps.forEach(function(c){ comptes[c.camp] = (comptes[c.camp] || 0) + 1; });
  var campMajoritaire = null, maxCompte = 0;
  Object.keys(comptes).forEach(function(k){ if (comptes[k] > maxCompte) { maxCompte = comptes[k]; campMajoritaire = k; } });

  return {
    factuels: factuels, nbDeclenches: nbDeclenches, surFactuels: factuels.length,
    camps: camps, nbCamps: camps.length,
    campMajoritaire: campMajoritaire, accordPct: camps.length ? Math.round(maxCompte / camps.length * 100) : null
  };
}
// ═══════════════════════════════════════════════════════════════
// GÉOMÉTRIE DES DEUX POINTS D'INTERSECTION SUR LA LIGNE M1-M7 (03/09/26,
// observation Ellemine_D : « m2 et m6 sont liés à m10, m8 et m12 sont
// liés à m4 ... il crée deux points d'intersection sur la ligne m1 et
// m7 »).
//
// VÉRIFIÉ GÉOMÉTRIQUEMENT, PAS SEULEMENT À L'ŒIL — calcul fait sur les
// coordonnées réelles du carré (CARRE_GEO_PTS, mêmes que le dessin) :
//   droite M2→M10  ET  droite M12→M4  se croisent EXACTEMENT au même
//     point sur la ligne horizontale M1-M7, côté M1 (x≈104,8 sur 400).
//   droite M6→M10  ET  droite M8→M4   se croisent EXACTEMENT au même
//     point elle aussi, côté M7 (x≈295,2 sur 400).
// Ce n'est pas approximatif : conséquence exacte de la symétrie du carré
// autour de l'axe vertical M4-M10 — M2 et M12 sont le miroir l'un de
// l'autre par rapport à cet axe, M6 et M8 aussi. Vrai sur TOUT thème
// (c'est la forme du carré qui le garantit, pas son contenu) — d'où la
// séparation stricte ci-dessous entre la géométrie (acquise) et le
// contenu (encore à découvrir).
//   groupe côté M1 : M2, M12, M10, M4
//   groupe côté M7 : M6, M8, M10, M4
//
// ⚠️ CE QUI N'EST PAS ENCORE ÉTABLI : POURQUOI cette géométrie compterait
// pour telle ou telle figure. Premier test fait avec Puer (sa proposition
// du même jour : « puer parle, les deux marquent ») sur les 45 cas à BTTS
// connu — Puer dans ce groupe de maisons ne fait pas mieux que Puer
// n'importe où dans le thème (60% contre 57,7%, baseline 53,3%), et par
// maison c'est incohérent (M4 80% sur n=5, M10 33% sur n=3 — SOUS la
// baseline alors que M10 est justement le point commun des deux
// groupes). Fisher p≈0,75 sur le groupe entier — dans le bruit.
// La géométrie reste ici pour qu'on la reteste à chaque nouveau cas et
// avec d'autres figures, comme la famille MOTEURS_INCIDENT_CAMP_V7 :
// la forme est prouvée, le sens qu'elle porte ne l'est pas encore.
function geometrieIntersectionsM1M7V7(theme){
  return {
    coteM1: { maisons: [2, 12, 10, 4],
      figures: { M2: theme[2], M12: theme[12], M10: theme[10], M4: theme[4] } },
    coteM7: { maisons: [6, 8, 10, 4],
      figures: { M6: theme[6], M8: theme[8], M10: theme[10], M4: theme[4] } }
  };
}
// ═══════════════════════════════════════════════════════════════
// TABLEAU DE RÉFÉRENCE — MOTIF DU "LES DEUX MARQUENT" (03/09/26, demande
// Ellemine_D) — rassemble dans un seul objet les ingrédients dont on
// soupçonne qu'ils pourraient expliquer BTTS, pour les archiver au fil des
// tirages réels plutôt que de les re-tester sur les mêmes 45 cas déjà
// épuisés dans la discussion : figures offensive/défensive (axe 3-5-9-11
// et axe 4-10 discutés précédemment), confirmation du Juge sur M1/M7 (le
// Juge est-il le binôme de la figure de M1 ou de M7 ?), figure du jour et
// planète gouvernante du jour du match. AUCUNE de ces colonnes n'est une
// règle validée — c'est un tableau d'observation à faire grossir au fil
// des vrais matchs, pas un moteur de décision. Utilisé par le panneau
// "📊 Tableau de référence" (renderTableauReferenceBTTS) et persisté dans
// chaque entrée sauvegardée (addToHistory/saveManuel).
function tableauReferenceBTTS(theme, matchDateStr){
  var figOffensive = combineMany([theme[3], theme[5], theme[9], theme[11]]);
  var figDefensiveM1 = combineMany([theme[4], theme[10], theme[1]]);
  var figDefensiveM7 = combineMany([theme[4], theme[10], theme[7]]);
  var juge = theme[15];
  var jugeConfirmeM1 = juge === BINOMES_V7[theme[1]];
  var jugeConfirmeM7 = juge === BINOMES_V7[theme[7]];
  var fdj = figureDuJour(matchDateStr ? new Date(matchDateStr) : undefined);
  var planete = getPlaneteDuJour(matchDateStr);
  var figGouvernante = PLANETE_GOUVERNEUR[planete] || null;
  return {
    figOffensive: figOffensive,
    offensivePresente: positionsBaseEtResultantes(figOffensive, theme).length > 0,
    figDefensiveM1: figDefensiveM1,
    defensiveM1Presente: positionsBaseEtResultantes(figDefensiveM1, theme).length > 0,
    figDefensiveM7: figDefensiveM7,
    defensiveM7Presente: positionsBaseEtResultantes(figDefensiveM7, theme).length > 0,
    juge: juge, jugeConfirmeM1: jugeConfirmeM1, jugeConfirmeM7: jugeConfirmeM7,
    figureDuJour: fdj,
    figureDuJourPresente: positionsBaseEtResultantes(fdj, theme).length > 0,
    planeteDuJour: planete, figureGouvernante: figGouvernante,
    figureGouvernantePresente: figGouvernante ? positionsBaseEtResultantes(figGouvernante, theme).length > 0 : false
  };
}
function getResultant(fig,pos){return combine(fig,FIGS[pos-1]);}
function figureExistsInTheme(fig,theme){return Object.values(theme).includes(fig);}
function findFigureTargetByBinomeWitness(fig){return Object.keys(BINOMES).find(key=>BINOMES[key]===fig) || null;}

// ── 📚 ÉTUDE (branché le 26/07/26 à la demande d'Ellemine_D, pour observer
// l'effet de findFigureTargetByBinomeWitness) : fig1/fig7 sont-elles elles-
// mêmes le TÉMOIN (binôme) d'une autre figure, et cette figure "renforcée"
// est-elle active dans le thème ? Hypothèse non tranchée : une figure qui
// sert de témoin ailleurs a-t-elle son énergie "engagée" hors de M1/M7, ou
// au contraire cette charge de renfort la rend-elle plus forte ? Pur
// diagnostic pour l'instant — ne pèse sur AUCUN verdict, cf. renderStatsTab.

// ═══════════════════════════════════════════════════════════════
// LE CLASSEMENT DÉFENSIF DU MOTEUR (05/09/26) — table exacte
// ═══════════════════════════════════════════════════════════════
// Ellemine_D, de mémoire : « ce qui sont très bons pour la défense :
// Albus, Carcer en M4 ». Et de fait, la maison de repos d'Albus EST M4,
// celle de Carcer EST M10 — les deux maisons défensives. Restait à
// savoir ce que le moteur, lui, en fait.
//
// Mesuré par ÉNUMÉRATION DES 65536 THÈMES : pour chaque figure et
// chacune des deux maisons défensives, getVerdictAfficheReel a été
// rejoué sur les 4096 thèmes concernés. Aucune incertitude
// d'échantillonnage : ce sont les taux EXACTS du moteur, pas des
// estimations, et aucun p n'aurait de sens ici.
//
// CE QUE ÇA MESURE, ET CE QUE ÇA NE MESURE PAS. C'est la croyance du
// FICHIER, dérivée des tables de doctrine — pas une mesure sur des
// matchs joués. Personne ne l'avait jamais calculée : le classement
// défensif du moteur était invisible, y compris pour qui l'a écrit.
//
// Vérifié avant de publier : aucune règle n'écrit « Albus en M4 » ni
// « Carcer en M10 » dans le chemin du verdict. La seule règle en dur,
// carcer_m10, vit dans MOTEURS_CONDITIONNELS_V7, qui ne sert qu'au banc.
// Les écarts ci-dessous sont donc ÉMERGENTS, pas programmés.
//
// Base sur les 65536 : buts 1,29 - BTTS 27,2 - incident 55,6 - nul 25,4
//
// CE QUE LA TABLE CONFIRME ET CE QU'ELLE CONTREDIT :
//   . Albus — CONFIRMÉ, et au-delà. 1er en M4, 3e en M10, et c'est lui
//     qui écrase le plus les incidents (40,0 en M10 contre 55,6 de
//     base, le plus bas des deux tables). Albus défend partout, pas
//     seulement dans sa maison de repos.
//   . Carcer — CONTREDIT. 15e sur 16 en M4, 13e sur 16 en M10. Dans les
//     deux maisons défensives il OUVRE le match, y compris chez lui.
//     À trancher : soit la doctrine du fichier se trompe sur Carcer,
//     soit le souvenir de terrain porte sur autre chose que ces deux
//     maisons. Ne pas enterrer l'un pour sauver l'autre.
//   . Populus en M10 — le vrai verrou, que personne n'avait nommé.
//     BTTS 9,6 contre 27,2 : le plus gros écart des deux tables.
var DEFENSE_M4_V7 = {
  albus          : { buts: 1.15, btts: 20.4, incident: 52.3, nul: 26.0 },
  cauda_draconis : { buts: 1.17, btts: 21.8, incident: 58.0, nul: 26.8 },
  populus        : { buts: 1.20, btts: 22.0, incident: 58.3, nul: 24.0 },
  puer           : { buts: 1.21, btts: 22.9, incident: 62.4, nul: 24.4 },
  fortuna_major  : { buts: 1.24, btts: 26.0, incident: 51.5, nul: 27.9 },
  tristitia      : { buts: 1.25, btts: 23.7, incident: 62.2, nul: 22.1 },
  fortuna_minor  : { buts: 1.29, btts: 25.3, incident: 57.3, nul: 21.7 },
  caput_draconis : { buts: 1.29, btts: 27.7, incident: 48.9, nul: 26.4 },
  via            : { buts: 1.29, btts: 26.7, incident: 51.5, nul: 24.0 },
  rubeus         : { buts: 1.30, btts: 27.6, incident: 62.9, nul: 25.6 },
  acquisitio     : { buts: 1.31, btts: 29.5, incident: 56.0, nul: 28.3 },
  puella         : { buts: 1.33, btts: 30.3, incident: 48.2, nul: 27.1 },
  amissio        : { buts: 1.34, btts: 29.4, incident: 55.5, nul: 25.2 },
  laetitia       : { buts: 1.38, btts: 31.2, incident: 54.3, nul: 24.8 },
  carcer         : { buts: 1.41, btts: 31.8, incident: 59.3, nul: 22.9 },
  conjunctio     : { buts: 1.49, btts: 39.1, incident: 51.4, nul: 29.1 },
};
var DEFENSE_M10_V7 = {
  populus        : { buts: 0.90, btts: 9.6, incident: 56.7, nul: 28.7 },
  fortuna_minor  : { buts: 1.11, btts: 20.5, incident: 68.2, nul: 29.7 },
  albus          : { buts: 1.13, btts: 18.0, incident: 40.0, nul: 22.9 },
  fortuna_major  : { buts: 1.14, btts: 18.6, incident: 52.5, nul: 23.2 },
  tristitia      : { buts: 1.19, btts: 23.1, incident: 46.0, nul: 26.8 },
  cauda_draconis : { buts: 1.26, btts: 26.2, incident: 61.6, nul: 27.0 },
  rubeus         : { buts: 1.26, btts: 25.4, incident: 63.2, nul: 24.8 },
  via            : { buts: 1.29, btts: 27.3, incident: 66.4, nul: 25.8 },
  puer           : { buts: 1.29, btts: 30.7, incident: 65.5, nul: 32.4 },
  laetitia       : { buts: 1.33, btts: 29.5, incident: 51.1, nul: 26.2 },
  acquisitio     : { buts: 1.36, btts: 31.9, incident: 59.2, nul: 27.5 },
  amissio        : { buts: 1.42, btts: 31.1, incident: 43.2, nul: 20.3 },
  carcer         : { buts: 1.44, btts: 35.1, incident: 48.1, nul: 25.8 },
  caput_draconis : { buts: 1.45, btts: 32.5, incident: 62.1, nul: 20.1 },
  puella         : { buts: 1.52, btts: 36.9, incident: 51.8, nul: 22.3 },
  conjunctio     : { buts: 1.55, btts: 39.1, incident: 54.3, nul: 22.9 },
};

// Lecture d'un thème contre la table : rang (1 = plus défensif) et
// écart à la base, pour les deux maisons défensives.
function lectureDefensiveV7(theme) {
  if (!theme || !theme[4] || !theme[10]) return null;
  var BASE = { buts: 1.29, btts: 27.2, incident: 55.6, nul: 25.4 };
  function lire(table, fig) {
    var rangs = Object.keys(table).sort(function (a, b) {
      return table[a].buts - table[b].buts; });
    var e = table[fig];
    if (!e) return null;
    return { figure: fig, rang: rangs.indexOf(fig) + 1, sur: rangs.length,
      buts: e.buts, btts: e.btts, incident: e.incident, nul: e.nul,
      ecartButs: Math.round((e.buts - BASE.buts) * 100) / 100,
      ecartBtts: Math.round((e.btts - BASE.btts) * 10) / 10,
      ecartIncident: Math.round((e.incident - BASE.incident) * 10) / 10 };
  }
  return { base: BASE, m4: lire(DEFENSE_M4_V7, theme[4]),
    m10: lire(DEFENSE_M10_V7, theme[10]),
    auRepos: { m4: theme[4] === 'albus', m10: theme[10] === 'carcer' },
    // Contrainte exacte : les trois maisons de l'axe défensif ne
    // peuvent JAMAIS être au repos ensemble. Si M4 et M10 le sont, la
    // loi M4 + M10 = M3 force M3 à Puella, qui n'est pas chez elle.
    m3Force: (theme[4] === 'albus' && theme[10] === 'carcer') ? 'puella' : null };
}

// ── UNE SEULE LOI SUR 24 SURVIT AU REPOS SIMULTANÉ ──
// Question posée le 05/09 : peut-on avoir les trois maisons d'une loi
// occupées chacune par sa propre figure de repos ? Réponse par
// énumération des 24 lois de paires : NON, sauf une.
//   M13 + M14 = M15   Cauda Draconis + Puella = Acquisitio   ✓
// Les 23 autres l'interdisent. Sur l'axe défensif en particulier, au
// plus DEUX des trois maisons peuvent être au repos, jamais les trois,
// et la troisième est alors forcée à une figure déterminée :
//   Albus en M4 + Carcer en M10          -> M3  = Puella
//   Caput Draconis en M3 + Albus en M4   -> M10 = Acquisitio
//   Caput Draconis en M3 + Carcer en M10 -> M4  = Cauda Draconis
// L'ordre de FIGS n'est d'ailleurs pas conventionnel : ses huit paires
// consécutives donnent TOUTES Acquisitio par combinaison (8 sur 8).
var LOIS_REPOS_V7 = {
  seuleLoiSurvivante: { maisons: [13, 14, 15],
    figures: ['cauda_draconis', 'puella', 'acquisitio'] },
  axeDefensif: {
    'albus@4+carcer@10': 'puella@3',
    'caput_draconis@3+albus@4': 'acquisitio@10',
    'caput_draconis@3+carcer@10': 'cauda_draconis@4' },
  pairesDeFigs: 'combine(FIGS[2k], FIGS[2k+1]) = Acquisitio pour k = 0..7'
};

// ═══════════════════════════════════════════════════════════════
// POPULUS, LE RANG DES MÈRES, ET UN EFFET QUE LE MOTEUR IGNORE
// ═══════════════════════════════════════════════════════════════
// Parti de « Populus en M10 est le plus gros verrou de la table
// défensive ». C'était une tranche d'autre chose.
//
// 1. POPULUS EST LE NEUTRE. combine(populus, X) = X. Donc dans toute
//    maison dérivée, Populus signifie que ses DEUX PARENTS SONT
//    IDENTIQUES : M10 = Populus équivaut exactement à M3 = M4, M9 à
//    M1 = M2, M11 à M5 = M6, et ainsi de suite. Vérifié : les lignes
//    « jumelle » et « pop@ » coïncident au thème près.
//
// 2. CE N'EST PAS M10, C'EST PARTOUT. Populus assèche les buts dans
//    14 maisons sur 16 (exceptions M14 et M16, qui les augmentent).
//    Le plus fort n'est pas M10 mais M1 : 0,85 but et 5,1 % de BTTS
//    contre 1,29 et 27,2 % de base.
//
// 3. LA CAUSE EST LE RANG DES MÈRES. En écrivant chaque figure comme
//    un vecteur de Z2 puissance 4, le rang des quatre mères BORNE le
//    nombre de Populus du thème — exact sur les 65536 :
//      rang 4 : 0 ou 1 Populus, jamais plus   (20160 thèmes)
//      rang 3 : 0 à 4                         (37800)
//      rang 2 : 0 à 8                         ( 7350)
//      rang 1 : 4 à 12                        (  225)
//      rang 0 : exactement 16                 (    1, les 4 mères Populus)
//    Et le moteur suit ce rang de façon monotone :
//      rang 1  0,85 but  BTTS  1,3 %
//      rang 2  1,03      BTTS 13,2 %
//      rang 3  1,27      BTTS 26,2 %
//      rang 4  1,43      BTTS 34,5 %
//
// 4. L'ARCHIVE NE PEUT PAS TESTER LE RANG : 47 cas sur 48 sont de rang
//    3 ou 4. Un tirage réel ne descend presque jamais plus bas. Le
//    gradient le plus net du moteur est donc, en l'état, invérifiable.
//
// 5. MAIS À RANG FIXÉ, LE COMPTE DE POPULUS DIT QUELQUE CHOSE QUE LE
//    MOTEUR N'ENCODE PAS. Voir PISTES_V7, entrée `populus_zero`.
var RANG_ET_POPULUS_V7 = {
  bornes: { 4: [0, 1], 3: [0, 4], 2: [0, 8], 1: [4, 12], 0: [16, 16] },
  effectifs: { 4: 20160, 3: 37800, 2: 7350, 1: 225, 0: 1 },
  moteurParRang: {
    1: { buts: 0.85, btts: 1.3 }, 2: { buts: 1.03, btts: 13.2 },
    3: { buts: 1.27, btts: 26.2 }, 4: { buts: 1.43, btts: 34.5 } },
  base: { buts: 1.29, btts: 27.2 }
};

// Rang des quatre mères sur Z2 : 0 à 4. Une figure devient un vecteur
// en notant 1 la ligne à un point et 0 la ligne à deux.
function rangMeresV7(theme) {
  if (!theme || typeof MAP_GEO === 'undefined') return null;
  var m = [1, 2, 3, 4].map(function (h) {
    var p = MAP_GEO[theme[h]];
    return p ? p.map(function (v) { return v === 1 ? 1 : 0; }) : null; });
  if (m.indexOf(null) >= 0) return null;
  var r = 0;
  for (var c = 0; c < 4; c++) {
    var piv = -1;
    for (var i = r; i < m.length; i++) if (m[i][c]) { piv = i; break; }
    if (piv < 0) continue;
    var t = m[r]; m[r] = m[piv]; m[piv] = t;
    for (var k = 0; k < m.length; k++) if (k !== r && m[k][c])
      for (var j = 0; j < 4; j++) m[k][j] ^= m[r][j];
    r++;
  }
  return r;
}

function nbPopulusV7(theme) {
  if (!theme) return null;
  var n = 0;
  for (var h = 1; h <= 16; h++) if (theme[h] === 'populus') n++;
  return n;
}

// Lecture combinée, avec le garde-fou de la borne : si le compte sort
// des bornes du rang, le calcul du thème est cassé quelque part.
function lecturePopulusV7(theme) {
  var rg = rangMeresV7(theme), np = nbPopulusV7(theme);
  if (rg === null || np === null) return null;
  var b = RANG_ET_POPULUS_V7.bornes[rg];
  return { rang: rg, nbPopulus: np, bornes: b,
    coherent: !!b && np >= b[0] && np <= b[1],
    moteurAttendu: RANG_ET_POPULUS_V7.moteurParRang[rg] || null,
    // La condition pré-enregistrée. 38 % des thèmes la remplissent
    // (25004 sur 65536) : c'est fréquent, donc utilisable.
    zeroPopulus: np === 0 };
}

autoTestV7('rang des mères et bornes de Populus', function () {
  if (typeof calcTheme !== 'function' || typeof FIGS_V7 === 'undefined') return;
  var essais = [['puer', 'laetitia', 'caput_draconis', 'albus'],
    ['populus', 'populus', 'populus', 'populus'],
    ['via', 'via', 'via', 'via'], ['tristitia', 'amissio', 'cauda_draconis', 'laetitia']];
  essais.forEach(function (m) {
    var l = lecturePopulusV7(calcTheme(m[0], m[1], m[2], m[3]));
    if (!l || !l.coherent)
      throw new Error('nb de Populus hors des bornes du rang pour ' + m.join('/'));
  });
});

// ═══════════════════════════════════════════════════════════════
// REGISTRE DES BRANCHEMENTS (05/09/26) — ce qui décide, et ce qui non
// ═══════════════════════════════════════════════════════════════
// « Branche-les au verdict » — Ellemine_D. Quatre trouvailles étaient
// sur la table. Une seule a été branchée, et pas par prudence : les
// trois autres ont été MESURÉES et ne le méritent pas, ou ne peuvent
// pas l'être. Chacune garde son booléen, pour qu'on puisse rouvrir le
// débat avec un chiffre plutôt qu'un avis.
var BRANCHES_V7 = {

  populus_volume: {
    actif: true,
    nom: 'Zéro Populus dans le thème -> plus de 2,5 buts',
    cible: 'famille plus/moins de 2,5 buts',
    mesureAvant: '26/48 (54 %) — moins bon que la règle idiote « toujours plus », 31/48',
    mesureApres: '34/48 (71 %)',
    detail: '10 gagnés, 2 perdus. Fisher 2x2 p = 0,0137 ; binomial sur les 12 '
      + 'discordants p = 0,039.',
    prixPaye: 'Roma (2 buts) et CarcAlbus (0-0) : deux thèmes à zéro Populus qui '
      + 'n\'ont pas marqué. Le moteur avait juste sur eux, la règle les casse.',
    faiblesse: 'le découpage « zéro contre au moins un » a été choisi APRÈS avoir vu '
      + 'les données. Le brancher ne répare pas ça — voir PISTES_V7.populus_zero. '
      + '30 rencontres annoncées avant coup d\'envoi restent le seul juge.' },

  faisceau_elague: {
    actif: false,
    nom: 'Faisceau du nul restreint aux signaux dont le taux n\'est pas 50 %',
    cible: 'le camp, via l\'imposition du nul',
    refus: 'MESURÉ, ET ÇA NUIT. Camp actuel 32/48. Avec nElague >= 2 : 29/48, huit '
      + 'thèmes basculés, deux gagnés cinq perdus. Avec >= 3 : 30/48. Avec >= 4 ou '
      + '5 : aucun thème basculé, le branchement ne fait rien du tout. L\'élagage '
      + 'avait amélioré le p (0,177 -> 0,073) sans améliorer le verdict : les deux '
      + 'ne sont pas la même question, et c\'est le verdict qui compte ici.',
    rouvrir: 'si l\'archive dépasse 100 cas, refaire la mesure — trois nuls de plus '
      + 'au bon endroit renverseraient le compte.' },

  defense_m4_m10: {
    actif: false,
    nom: 'Table du rang défensif de M4 et M10',
    cible: 'buts, BTTS, incident',
    refus: 'INBRANCHABLE, ET CE N\'EST PAS UNE QUESTION DE PREUVE. La table a été '
      + 'construite en rejouant getVerdictAfficheReel sur les 65536 thèmes : elle '
      + 'est la SORTIE du verdict. La rebrancher en ENTRÉE ferait boucler le moteur '
      + 'sur ses propres croyances — il se confirmerait lui-même, et la table '
      + 'mesurerait alors sa propre influence au lieu de la doctrine. Aucun chiffre '
      + 'ne peut sortir de ce circuit.',
    utile: 'elle reste juste et utile en LECTURE : elle rend visible ce que le '
      + 'fichier croit, ce qui a déjà permis de voir que Carcer y est classé ouvrant '
      + '(15e sur 16 en M4) alors que la doctrine de terrain le dit fermant. C\'est '
      + 'une contradiction à trancher, pas un moteur à brancher.',
    rouvrir: 'seulement en la reconstruisant à partir de RÉSULTATS RÉELS, pas des '
      + 'verdicts du moteur. Il faudrait des centaines de matchs par figure.' },

  protocole_pilote: {
    actif: false,
    nom: 'Le protocole de comparaison R1/R7 pilote le verdict final',
    cible: 'le camp',
    demande: 'Ellemine_D, 05/09 : « le protocole de comparaison doit piloter le verdict final ».',
    refus: 'MESURÉ, ET C\'EST LE CHANGEMENT LE PLUS NUISIBLE DE LA SÉANCE. Camp actuel '
      + '38/56. Si le protocole décide dès qu\'il parle : 27/56 (−11), 3 gagnés contre 14 '
      + 'perdus. Même en le bloquant quand le nul est imposé : 29/56 (−9).',
    pourquoi: 'le protocole ne parle que si R1 et R7 sont dans des boucles différentes — '
      + 'exactement 50,00 % des thèmes (32768 sur 65536), et 29 des 56 cas d\'archive. '
      + 'Sur ces 29 cas il tombe juste 12 fois (41 %) quand le verdict actuel en réussit 23 '
      + '(79 %). Sur leurs 18 désaccords : protocole 3, verdict 14.',
    inversionEcartee: 'l\'hypothèse d\'un signe inversé a été testée et REJETÉE : en écartant '
      + 'les 4 nuls réels (que le protocole ne peut jamais annoncer), il fait 12/25 tel quel '
      + 'et 13/25 inversé — binomial bilatéral p = 1,0000. L\'amplitude de l\'écart n\'aide pas '
      + 'davantage : à |écart| >= 50 il fait 3/5, à >= 10 il fait 7/16. Ce n\'est pas un signe '
      + 'à retourner, c\'est un pile ou face.',
    autresCibles: 'testé contre huit autres familles pour voir s\'il visait ailleurs — écart '
      + 'vers le nul, |écart| vers le nul, somme vers les buts, somme vers le BTTS, |écart| '
      + 'vers les buts, |écart| vers le BTTS, duels vers les buts, duels vers le nul. Rien : '
      + 'le meilleur est écart -> nul à p = 0,064, ce qui ne survit à aucune correction sur '
      + 'huit tests.',
    defautTrouve: 'le nombre de duels vaut 16 sur TOUS les thèmes testés — c\'est une '
      + 'constante structurelle, pas une mesure. Et la somme s1+s7 ne varie qu\'entre 47,50 '
      + 'et 60,75 : le protocole est un partage à somme presque fixe. Il produit une '
      + 'grandeur qui varie réellement (écart de −12,25 à +67,00) mais qui ne corrèle avec '
      + 'rien de ce qui est mesuré.',
    pourLActiver: 'BRANCHES_V7.protocole_pilote.actif = true. Le code est écrit et testé ; '
      + 'seul le booléen le retient. Il coûtera 11 points sur 56 tant que ces chiffres '
      + 'tiennent — c\'est écrit ici pour que la décision se prenne avec, pas contre.',
    rouvrir: 'si le protocole est REPENSÉ (la somme quasi fixe et les 16 duels constants '
      + 'suggèrent qu\'il mesure une propriété des boucles, pas du thème), refaire la mesure '
      + 'avant tout branchement.' },

  axe_volume: {
    actif: true,
    branchePar: 'Ellemine_D, 05/09 : « branche-les », les chiffres sous les yeux. Elle prend '
      + 'sa place mesurée : entre zéro Populus et le miroir. 38/49 contre 37/49.',
    ceQueJAvaisDit: 'j\'avais laissé le booléen à false en disant qu\'un +1 trouvé au '
      + 'neuvième placement est du bruit de sélection. Ça reste vrai et c\'est écrit ici : '
      + 'le gain de +1 n\'est pas démontré. Mais l\'effet SOUS la règle l\'est (rho −0,319, '
      + 'p = 0,0234 par permutation, et 40 points d\'écart là où Populus se tait) — ce qui '
      + 'n\'est pas démontré, c\'est le placement, pas le signal. La branche se rejoue et '
      + 'se retire d\'elle-même si elle ne gagne plus rien.',
    nom: 'L\'axe offensif — les deux sommes de trigone présentes en base ferment le match',
    cible: 'famille plus/moins de 2,5 buts',
    demande: 'Ellemine_D, 05/09 : « l\'axe offensif peut marquer si et seulement si la '
      + 'figure somme est présente dans le thème résultant ou base. Creuse sur ces pistes '
      + 'et ne cherche pas à les réfuter automatiquement. »',
    ceQuiEstVrai: 'IL Y A UN EFFET, ET IL EST FORT — mais pas celui annoncé. Le sens est '
      + 'INVERSÉ (somme présente = MOINS de buts) et ce n\'est pas un effet de CAMP mais de '
      + 'MATCH : le test apparié à l\'intérieur des matchs donne 7 contre 8, p = 1,0000. '
      + 'Le nombre de sommes présentes (0, 1 ou 2) corrèle au total du match : rho −0,319, '
      + 'p = 0,0234 par permutation.',
    laRegle: 'quand les DEUX axes ont leur somme présente en base : 2,90 buts, 9/20 '
      + 'au-dessus de 2,5. Au plus une : 5,0 buts, 23/29.',
    ouElleEstForte: 'là où zéro Populus se tait — 28,6 % contre 69,2 % au-dessus de 2,5, '
      + '40 points d\'écart dans la seule région où le système n\'avait rien.',
    pasBranche: 'en tête de chaîne elle écrase Populus : 37/49 -> 34/49. À sa meilleure '
      + 'place (Populus > axe > miroir) elle fait 38/49, soit +1 — après NEUF placements '
      + 'essayés. Un +1 trouvé au neuvième essai n\'est pas un gain, c\'est de la sélection. '
      + 'Je ne rebranche pas la chaîne dessus.',
    ceQuiEstBranche: 'ce qui SORT de cette piste et qui est branché, c\'est l\'ACCORD entre '
      + 'l\'axe et le miroir — deux lectures indépendantes qui se valent (19/27 contre '
      + '18/27, McNemar 5-4). Quand elles s\'accordent : 14/18 justes. Quand elles se '
      + 'contredisent : 5 contre 4, rien. Le panneau le dit, le verdict ne change pas.',
    pourLActiver: 'BRANCHES_V7.axe_volume.actif = true — elle prendra alors la place entre '
      + 'zéro Populus et le miroir.' },

  carcer_miroir: {
    actif: true,
    conjonction: false,
    branchePar: 'Ellemine_D, 05/09 : « branche-les ». Troisième porte du nul : au moins une '
      + 'des SIX paires miroir libres a pour somme Carcer.',
    lePrix: 'MESURÉ SUR LE VERDICT AFFICHÉ, ET J\'AVAIS ANNONCÉ PIRE QUE LA RÉALITÉ. '
      + 'Sur la règle du nul prise isolément : 8 justes / 5 faux / 5 ratés (82,5 %) avant, '
      + '11 / 11 / 2 (77,2 %) après — d\'où le « −5,3 points » que j\'avais donné. Mais sur '
      + 'le CAMP RÉELLEMENT AFFICHÉ, le total ne bouge pas : 38/57 avant, 38/57 après. '
      + 'Les 6 faux nuls supplémentaires tombent en grande partie sur des thèmes où le camp '
      + 'était DÉJÀ annoncé de travers. Le décompte exact : +3 nuls attrapés (8 -> 11 sur 13) '
      + 'et −3 pronostics de camp justes perdus. Net zéro en justesse brute, et la FORME des '
      + 'erreurs change : le système rate 2 nuls sur 13 au lieu de 5, et en annonce 11 faux '
      + 'au lieu de 5. C\'est un arbitrage réel, pas un cadeau — mais il ne coûte pas les '
      + '5,3 points que j\'avais annoncés.',
    conjonctionEnAttente: 'la variante « deux portes OU (Carcer ET opposition) » fait 84,2 %, '
      + 'MIEUX que l\'état d\'avant — mais la conjonction ne s\'allume qu\'UNE fois sur tout '
      + 'le banc, et c\'est sur le 22/02 qui a fait poser la question. Une règle ne peut pas '
      + 'se valider sur le cas qui l\'a fabriquée. Dès qu\'un deuxième thème de cette classe '
      + 'arrive, refaire la mesure et passer conjonction = true si elle tient.',
    nom: 'Carcer en paires miroir — le blocage comme somme de deux maisons opposées',
    cible: 'le nul',
    demande: 'Ellemine_D, 05/09 : « les maisons miroir donnent — exemple Carcer, '
      + 'contrainte, blocage. Si elles sont en maisons miroir elles ont tendance à donner '
      + 'même force. »',
    ceQuiEstExact: 'LA LOI DERRIÈRE EST EXACTE ET ELLE EST BELLE : M15 = (M1⊕M5) ⊕ (M2⊕M6) '
      + '⊕ (M3⊕M7) ⊕ (M4⊕M8), vérifié 65 536 fois sur 65 536. Le Juge ne juge pas les seize '
      + 'maisons : il mesure de combien le thème s\'écarte de son propre miroir. Et la '
      + 'liste de paires d\'Ellemine_D était juste (Caput+Cauda, Laetitia+Tristitia, '
      + 'Amissio+Fortuna Major sont bien trois des huit paires qui donnent Carcer).',
    mesure: 'sur 57 cas au camp connu, 13 nuls, base 22,8 % — « >= 1 Carcer hors M13/M14 » '
      + 'donne 4 nuls sur 11 (36,4 %) contre 9 sur 46 (19,6 %). Direction juste, écart de '
      + '17 points, Fisher p = 0,2508.',
    pasBranche: 'p = 0,25 sur 11 annonces. Pas parce que l\'idée est mauvaise — parce que '
      + 'le compteur n\'a pas assez tourné. Il faudrait environ 25 thèmes de cette classe.',
    laDistinctionQuiCompte: 'la lecture CLASSIQUE — « Juge Carcer donc blocage donc nul » — '
      + 'est FAUSSE ici : 1 nul sur 6 (16,7 %) contre 23,5 %, elle penche du mauvais côté. '
      + 'C\'est la lecture d\'Ellemine_D, Carcer comme SOMME DE DEUX MAISONS MIROIR, qui '
      + 'pointe dans le bon sens. Sa version bat la version classique.',
    affiche: 'le compte de Carcer en paires miroir est affiché sur chaque thème avec sa '
      + 'rareté et le taux courant, pour que le compteur tourne au lieu de dormir.' },

  nul_seconde_porte: {
    actif: false,
    nom: 'La seconde porte du nul — structureDuNul remise en service à côté des deux portes',
    cible: 'le nul',
    demande: 'Ellemine_D, 22/02/2026 : match 3-3 que le verdict a donné 0-1 pour M7. '
      + 'La règle branchée a dit « pas de nul » ; la règle DÉBRANCHÉE a vu le nul.',
    mesure: 'sur 57 cas au camp connu, 13 nuls réels (base 22,8 %) — deux portes '
      + '(branchée) 8 justes / 5 faux / 5 ratés, justesse 82,5 % · union avec la seconde '
      + 'porte 10 justes / 10 faux / 3 ratés, justesse 77,2 %.',
    pasBranche: 'PAS parce que ce n\'est pas prouvé — parce que c\'est MESURÉ NÉGATIF sur '
      + 'la justesse : −3 points. L\'union attrape 2 nuls de plus et annonce 5 faux de plus.',
    maisPourquoiCEstAffiche: 'ces deux critères ne sont pas le même. « Avoir raison le plus '
      + 'souvent » dit non ; « ne pas rater un nul » dit oui, +2 sur 13. Le second n\'est pas '
      + 'à moi de trancher : la seconde porte est donc CALCULÉE et AFFICHÉE chaque fois '
      + 'qu\'elle contredit la porte branchée, avec ses chiffres rejoués sur la base '
      + 'courante. Ellemine_D voit le désaccord au moment où il compte, match après match, '
      + 'et décide avec les chiffres sous les yeux au lieu de les recevoir tranchés.',
    complementaires: 'ce n\'est pas un doublon : les deux portes attrapent des nuls '
      + 'DIFFÉRENTS. Sur les 13 nuls réels, la première en voit 8 que la seconde rate, la '
      + 'seconde en voit 3 que la première rate (FortMajTrist, LaetPop, et le 22/02).',
    pourLActiver: 'BRANCHES_V7.nul_seconde_porte.actif = true — le code est écrit et le '
      + 'nul sera alors imposé aussi par la seconde porte.' },

  miroir_volume: {
    actif: true,
    nom: 'Le miroir M5 branché au VOLUME DE BUTS — somme des deux lectures',
    cible: 'famille plus/moins de 2,5 buts',
    demande: 'Ellemine_D, 05/09 : « branche le miroir au verdict ». J\'avais refusé en '
      + 'testant autre chose que ce qui était demandé. Voici la mesure qu\'il fallait faire.',
    mesureAvant: 'lecture directe seule 26/48 (54 %)',
    mesureApres: 'somme des deux lectures > 2 : 31/48 (65 %), gain +5',
    surLaChaineEntiere: 'LE CHIFFRE QUI COMPTE VRAIMENT, parce que « zéro Populus » '
      + 'est déjà branché devant : la chaîne SANS le miroir fait 34/48, AVEC le miroir '
      + '36/48. Gain +2 — 2 cas gagnés, 0 perdu. Le +5 se mesure contre le moteur nu, '
      + 'qui n\'est plus l\'état du système ; le +2 est le gain réel du branchement. '
      + 'McNemar sur 2 gagnés 0 perdu : p = 0,50. Petit, mais sans un seul cas cassé.',
    correlations: 'contre les buts réels : directe rho +0,238 (p = 0,104), MIROIR SEUL '
      + 'rho +0,297 (p = 0,041), SOMME rho +0,362 (p = 0,012). Le miroir seul bat la '
      + 'lecture directe ; les deux ensemble battent les deux.',
    seuil: 'la somme a pour médiane structurelle 2, mesurée par énumération des thèmes — '
      + 'le seuil ne vient JAMAIS des résultats.',
    discrimine: 'quand elle dit plus (20 cas) : 85 % au-dessus de 2,5 et 5,20 buts ; '
      + 'quand elle dit moins (28 cas) : 50 % et 3,36 buts. Ce n\'est pas la règle idiote.',
    faiblesse: 'McNemar apparié contre le moteur nu gagne 6 perd 1, p = 0,125 ; sur la '
      + 'chaîne entière gagne 2 perd 0, p = 0,50. Rien de significatif à n = 48. '
      + 'Et dix-huit tests ont été menés dans cet exercice de branchement ; le p de 0,012 '
      + 'sur la corrélation ne survit pas à une correction sur dix-huit. La branche se '
      + 'rejoue et se retire d\'elle-même si le gain tombe à zéro sur la base courante.',
    neMarchePas: 'le camp (−3 à −15 sur 56), le nul (−2 à −10 sur 58), le BTTS (+1 seul). '
      + 'Le miroir sert aux BUTS et à rien d\'autre — mesuré, pas supposé.' },

  miroir_m5: {
    actif: false,
    nom: 'Le partage qui commence en M5 pilote ou contrôle le verdict',
    cible: 'le camp',
    demande: 'Ellemine_D, 05/09 : « maintenant branche-le au verdict ».',
    refus: 'MESURÉ, ET CE N\'EST PAS UNE QUESTION DE PREUVE : LE MIROIR N\'EST PAS UNE '
      + 'SYMÉTRIE DU VERDICT. Le branchement naturel aurait été un contrôle de cohérence — '
      + 'lire le thème depuis l\'autre bord doit donner le même match, camps échangés. '
      + 'Testé, et l\'attente est fausse :',
    mesures: {
      'camps inversés (attendu)': '4,4 % (45 / 1024)',
      'camps identiques': '56,7 % (581 / 1024)',
      'sommes des camps échangées': '0,8 % (128 / 16384)',
      'rotation suivant le miroir': '8,6 % (1408 / 16384)' },
    cause: 'le miroir échange SEPT des huit maisons de chaque camp, mais CAMP1 contient M16 '
      + 'et CAMP2 contient M15 — précisément les deux maisons où il casse (M15 est fixe, M16 '
      + 'ne revient que si M1 = M5). La huitième maison suffit à rompre l\'échange. Et le '
      + 'verdict ne tourne pas sur les camps : il tourne sur R1/R7, des positions de '
      + 'ROTATION, qui ne suivent pas le miroir (8,6 %).',
    cequiRESTEVRAI: 'la correspondance maison par maison est EXACTE, 65536/65536 : '
      + 'M1↔M5, M2↔M6, M3↔M7, M4↔M8, M9↔M11, M10↔M12, M13↔M14, M15 fixe. Ce n\'est pas '
      + 'la loi qui est fausse, c\'est l\'usage que je voulais en faire.',
    usageJuste: 'miroirM5V7 sert à TRANSPOSER une règle : toute règle écrite pour le camp 1 '
      + 'se lit pour le camp 7 en passant par le miroir, sans la réécrire à la main et sans '
      + 'risquer une asymétrie par inadvertance. C\'est un outil de construction, pas une '
      + 'entrée du verdict.',
    pourLActiver: 'BRANCHES_V7.miroir_m5.actif = true afficherait le verdict du thème '
      + 'miroir à côté du verdict direct. Ce serait une SECONDE LECTURE, pas un contrôle : '
      + 'les deux ne sont pas censés s\'accorder, et exiger qu\'ils s\'accordent ferait '
      + 'signaler 57 % des thèmes à tort.' },

  parite_m15: {
    actif: true,
    nom: 'M15 est toujours paire — huit valeurs possibles, pas seize',
    cible: 'les taux de base, pas le verdict',
    note: 'RIEN À BRANCHER : ce n\'est pas une règle de prédiction, c\'est une '
      + 'correction de dénominateur. Elle est déjà appliquée partout où un taux de '
      + 'base est affiché (TAUX_BASE_FAISCEAU_V7, pied du panneau Structure). '
      + 'Marquée active parce qu\'elle EST en vigueur — pas parce qu\'elle décide.' }
};

// Ce que le verdict annonce en plus depuis le branchement, en une ligne
// lisible par le banc et par les annonces prospectives.
function annonceVolumeV7(theme) {
  var v = null;
  try { v = avecFormatV7('reel', function () { return getVerdictAfficheReel(theme); }); }
  catch (e) { return null; }
  return v ? v.plus25 : null;
}

// ═══════════════════════════════════════════════════════════════
// L'ÉLAGAGE DU PROTOCOLE R1/R7 (05/09/26) — question fermée avec
// des chiffres, pas avec un avis
// ═══════════════════════════════════════════════════════════════
// Ellemine_D : « élagage plus protocole de comparaison R1 et R7 ».
// Deux lectures, les deux faites.
//
// 1) LES DEUX BRANCHEMENTS ENSEMBLE — mesuré sur les 56 cas au camp
//    connu, huit combinaisons :
//      élagage aucun · protocole non ..... 38/56   <- l'état actuel
//      élagage aucun · protocole OUI ..... 29/56   (−9)
//      élagage >=2   · protocole non ..... 34/56   (−4)
//      élagage >=2   · protocole OUI ..... 26/56   (−12)
//      élagage >=3   · protocole OUI ..... 27/56   (−11)
//      élagage >=4   · protocole OUI ..... 29/56   (−9)
//    Ils ne se compensent pas, ils s'additionnent en mal.
//
// 2) L'ÉLAGAGE APPLIQUÉ AU PROTOCOLE LUI-MÊME. Sa formule somme six
//    termes sur les huit figures de chaque boucle. Chaque terme testé
//    seul, hors les 4 nuls réels (n = 25, choix binaire) :
//      force     12/24   p = 1,0000        repos     9/17   p = 1,0000
//      presence  10/23   p = 0,6776        binome    8/18   p = 0,8145
//      propres    9/25   p = 0,2295        adverses 10/18   p = 0,8145
//    AUCUN terme ne porte d'information sur le camp. Il n'y a rien à
//    garder après élagage : la somme est vide parce que chaque part
//    l'est.
//
// 3) LE DÉFAUT EXACT TROUVÉ EN CHEMIN. L'appareil des duels — seize
//    paires, deux scores chacune, la moitié du code du protocole — est
//    une MULTIPLICATION PAR TROIS de l'écart brut. Démontré : les 16
//    duels couvrent les 16 figures une fois chacune, donc la somme des
//    (scoreA − scoreB) vaut exactement (s1brut − s7brut), et l'écart
//    final vaut 3 fois l'écart brut. Vérifié sur 4608 thèmes :
//    4608/4608, sans une exception. Il n'ajoute aucune information,
//    seulement une échelle.
//
// 4) L'ÉLAGAGE POUSSÉ AU BOUT — ne garder que les deux figures qui
//    combattent, R1 contre R7, au lieu des huit de chaque boucle. Et
//    là, un motif : ça marche exactement où le protocole actuel SE
//    TAIT.
//      boucles différentes (le protocole parle) ....... 10/23  (43 %)
//      même boucle (le protocole est muet) ............ 14/19  (74 %)  p = 0,064
//    Six tests menés ici, donc 0,064 ne démontre rien. Et surtout,
//    branché comme override du verdict sur les thèmes à même boucle :
//    38/56 -> 39/56, quatre gagnés (ConjCaput, RubCarcer, ConjCaput2,
//    CaputCarcCaputPuer) contre trois perdus (Fiorentina, FortMajLaet,
//    CarcCaput). +1 sur 56, c'est du bruit.
//    Gardé en PISTE, pas branché : voir PISTES_V7.protocole_serre.
//
// CE QUE ÇA DIT DE LA DOCTRINE, et c'est le vrai résultat : le
// protocole repose sur « la boucle la plus forte gagne ». Sur 56 cas,
// cette idée ne tient pas — et pas parce qu'elle serait inversée
// (12/25 tel quel, 13/25 inversé, p = 1,0000), parce qu'elle est
// muette. Comparer deux AGRÉGATS de boucles conflue ce qui ne se
// compare pas. Comparer deux FIGURES de la même boucle, en revanche,
// donne le seul signe de vie de tout ce chantier.

// Le protocole réduit aux deux figures qui combattent. Rendu disponible
// pour que la piste reste testable, et parce qu'il parle sur les thèmes
// où l'autre se tait — la moitié d'entre eux.
function protocoleSerreV7(theme) {
  if (!theme || !theme[1]) return null;
  try {
    var S = function (x) {
      return x.forcePositions + (x.reposPresent ? 2 : 0)
        + Math.min(x.tous.length, 3) * 0.5 + x.binPos.length * 0.5
        + x.resultantesPropres * 0.75 - x.resultantesAdverses * 1.25; };
    var rot = getRotationOrderFromRepos(theme[1]);
    var r1 = theme[rot[0]], r7 = theme[rot[6]];
    var s1 = S(analyseFigureBoucleR1R7(r1, theme));
    var s7 = S(analyseFigureBoucleR1R7(r7, theme));
    var meme = loopOf(r1) === loopOf(r7);
    return { figR1: r1, figR7: r7, scoreR1: s1, scoreR7: s7, ecart: s1 - s7,
      memeBoucle: meme,
      dit: Math.abs(s1 - s7) < 1e-9 ? 'égalité' : (s1 > s7 ? 'R1' : 'R7'),
      // Le domaine où il montre quelque chose est celui où le protocole
      // large est muet. C'est l'inverse d'un hasard commode : c'est la
      // seule chose de ce chantier qui ressemble à un signal.
      domainePorteur: meme,
      mesure: meme ? '14/19 (74 %) sur l\'archive, p = 0,064 sur six tests — non démontré'
        : '10/23 (43 %) sur l\'archive — rien' };
  } catch (e) { return null; }
}

// ═══════════════════════════════════════════════════════════════
// LE MIROIR M5 EST BRANCHÉ AU VERDICT (05/09/26)
// ═══════════════════════════════════════════════════════════════
// Ellemine_D me l'avait demandé, j'avais refusé en testant AUTRE CHOSE
// que ce qu'il demandait — un contrôle de symétrie que personne n'avait
// réclamé — et je m'étais servi de l'échec de MON test pour décliner SA
// demande. Le reproche était juste. Voici la mesure qu'il fallait faire.
//
// LE MIROIR PORTE DE L'INFORMATION SUR LES BUTS, et plus que la lecture
// directe. Corrélation de rang contre les buts réels (n = 48) :
//        lecture directe seule .......... rho +0,238   p = 0,104
//        MIROIR SEUL .................... rho +0,297   p = 0,041
//        SOMME DES DEUX LECTURES ........ rho +0,362   p = 0,012
// Le miroir seul bat la lecture directe. Les deux ensemble battent les
// deux. Je serais passé à côté en m'arrêtant au camp.
//
// LE SEUIL N'EST PAS AJUSTÉ SUR LES RÉSULTATS. La somme des deux scores
// annoncés a pour MÉDIANE STRUCTURELLE 2 — mesuré par énumération des
// thèmes, jamais sur l'archive. C'est ce 2 qui sert de seuil.
//
// CE QUE ÇA DONNE SUR LA FAMILLE NOTÉE, plus/moins de 2,5 buts :
//        lecture directe seule .......... 26/48   (54 %)
//        SOMME DES DEUX > 2 ............. 31/48   (65 %)   +5
//        McNemar apparié : gagne 6, perd 1, p = 0,125
//
// ET ELLE DISCRIMINE VRAIMENT — ce n'est pas la règle idiote déguisée :
//        quand elle dit PLUS  (20 cas) : 85 % au-dessus de 2,5 · 5,20 buts
//        quand elle dit MOINS (28 cas) : 50 % au-dessus de 2,5 · 3,36 buts
//
// CE QUI NE MARCHE PAS, ET QUI EST ÉCRIT ICI POUR QU'ON N'Y REVIENNE PAS :
// sur le CAMP, toutes les combinaisons dégradent (de −3 à −15 sur 56).
// Sur le NUL aussi (−2 à −10 sur 58). Sur le BTTS, +1 seulement. Le
// miroir sert aux BUTS, et à rien d'autre — mesuré, pas supposé.
var MIROIR_VOLUME_V7 = {
  seuil: 2,
  seuilOrigine: 'médiane structurelle de la somme des deux scores annoncés, '
    + 'mesurée par énumération des thèmes — jamais ajustée sur les résultats',
  correlations: { directe: { rho: 0.238, p: 0.104 }, miroir: { rho: 0.297, p: 0.041 },
    somme: { rho: 0.362, p: 0.012 } },
  surPlusMoins25: { directe: '26/48', somme: '31/48', gain: 5,
    mcnemar: 'gagne 6, perd 1, p = 0,125' },
  discrimination: { ditPlus: { n: 20, tauxReel: 85, butsMoyens: 5.20 },
    ditMoins: { n: 28, tauxReel: 50, butsMoyens: 3.36 } },
  neMarchePas: 'le camp (−3 à −15 sur 56), le nul (−2 à −10 sur 58), le BTTS (+1). '
    + 'Le miroir sert aux BUTS et à rien d\'autre.'
};

// ═══════════════════════════════════════════════════════════════
// LES DEUX PISTES D'ELLEMINE_D DU 05/09 — MESURÉES, PAS RÉFUTÉES
// ═══════════════════════════════════════════════════════════════
//
// « il n'y a pas une seule structure pour le nul, tout dépend du calcul.
//   les maisons miroir donnent — exemple Carcer, contrainte, blocage.
//   quelles figures peuvent donner Carcer : Cauda et Caput, Tristitia et
//   Laetitia, Fortuna Major et Amissio. Si elles sont en maisons miroir
//   elles ont tendance à donner même force. »
//
// ─── CE QUI EST EXACT, ET QUI EST UNE LOI, PAS UNE MESURE ───
//
// LE JUGE EST LA SOMME DES QUATRE DÉPLACEMENTS MIROIR.
//     M15 = (M1⊕M5) ⊕ (M2⊕M6) ⊕ (M3⊕M7) ⊕ (M4⊕M8)
// Vérifié par énumération : 65 536 sur 65 536, aucune exception.
// L'intuition d'Ellemine_D — « lire le thème par ses maisons miroir » —
// n'est pas une lecture parmi d'autres : c'est EXACTEMENT ce que le Juge
// calcule. Le Juge ne juge pas les seize maisons, il mesure de combien le
// thème s'écarte de son propre miroir.
//
// Et sa liste de paires était juste. Les huit paires qui donnent Carcer :
//   Puer+Rubeus · Laetitia+Tristitia · Caput+Cauda · Albus+Puella
//   Via+Conjunctio · Amissio+Fortuna Major · Fortuna Minor+Acquisitio
//   Carcer+Populus
// (Toute figure a exactement UNE partenaire pour un total donné : la
// somme est une bijection. Il y a donc 8 paires pour Carcer, comme pour
// n'importe quelle autre figure.)
//
// Combien de Carcer parmi les 7 paires miroir, sur les 65 536 thèmes :
//   0 Carcer : 46 080 (70,3 %) · 1 : 15 360 (23,4 %)
//   2 Carcer :  3 072  (4,7 %) · 3 :  1 024  (1,6 %) · jamais plus de 3.
// Le thème du 22/02 (3-3) en a TROIS. Ellemine_D disait « un thème aussi
// miroir qu'aucun autre » — il est dans les 1,6 % les plus rares. Ce
// n'était pas une impression.
//
// ─── CE QUE ÇA PRÉDIT, HONNÊTEMENT : PAS ENCORE ASSEZ ───
// Sur les 57 cas au camp connu (13 nuls, base 22,8 %) :
//   Juge M15 = Carcer .............. 1/6  (16,7 %) — Fisher p = 1,00
//   >= 1 Carcer (7 paires) ......... 4/14 (28,6 %) — p = 0,71
//   >= 1 Carcer HORS M13/M14 ....... 4/11 (36,4 %) — p = 0,25   ← le mieux
// La direction est celle qu'annonce Ellemine_D, l'écart est de 17 points,
// et RIEN n'est significatif à ces effectifs. Ce n'est pas un refus :
// c'est un compteur qui a besoin de cas. À 11 annonces, il faudrait
// environ 25 thèmes « >= 1 Carcer hors M13/M14 » pour que 36 % contre
// 20 % passe sous p = 0,05.
//
// ⚠️ ET UNE DISTINCTION QUI COMPTE : la lecture CLASSIQUE — « Juge Carcer
// donc blocage donc nul » — est FAUSSE ici (16,7 % contre 23,5 %, elle
// penche du mauvais côté). C'est la lecture d'Ellemine_D, Carcer comme
// SOMME DE DEUX MAISONS MIROIR, qui pointe dans le bon sens. Les deux ne
// sont pas la même chose, et la sienne est la meilleure des deux.
var LOI_MIROIR_JUGE_V7 = {
  enonce: 'M15 = (M1⊕M5) ⊕ (M2⊕M6) ⊕ (M3⊕M7) ⊕ (M4⊕M8)',
  verifie: '65536/65536',
  lecture: 'le Juge est la somme des quatre déplacements miroir du thème',
  pairesMiroir: [[1, 5], [2, 6], [3, 7], [4, 8], [9, 11], [10, 12], [13, 14]],
  note: 'la paire M13/M14 n\'est pas libre : sa somme EST le Juge, par construction. '
    + 'Les six autres sont les seules qui apportent une information nouvelle.',
  distributionCarcer: { 0: 46080, 1: 15360, 2: 3072, 3: 1024 },
  mesureNul: { n: 57, nuls: 13, base: 22.8,
    jugeCarcer: { oui: '1/6', taux: 16.7, p: 1.0, sens: 'à contresens' },
    auMoinsUn: { oui: '4/14', taux: 28.6, p: 0.71 },
    horsJuge: { oui: '4/11', taux: 36.4, contre: 19.6, p: 0.2508 } },
  ceQuiManque: 'environ 25 thèmes à « >= 1 Carcer hors M13/M14 » pour trancher à p < 0,05'
};

// Les huit paires de figures dont la somme vaut Carcer.
var PAIRES_CARCER_V7 = [['puer', 'rubeus'], ['laetitia', 'tristitia'],
  ['caput_draconis', 'cauda_draconis'], ['albus', 'puella'], ['via', 'conjunctio'],
  ['amissio', 'fortuna_major'], ['fortuna_minor', 'acquisitio'], ['carcer', 'populus']];

// Les quatre déplacements miroir, leur somme (= le Juge), et le compte
// de Carcer parmi les sept paires.
function deplacementsMiroirV7(theme) {
  if (!theme) return null;
  try {
    var d = [combine(theme[1], theme[5]), combine(theme[2], theme[6]),
             combine(theme[3], theme[7]), combine(theme[4], theme[8])];
    var total = combine(combine(d[0], d[1]), combine(d[2], d[3]));
    var paires = LOI_MIROIR_JUGE_V7.pairesMiroir.map(function (pr) {
      return { maisons: pr, somme: combine(theme[pr[0]], theme[pr[1]]),
        carcer: combine(theme[pr[0]], theme[pr[1]]) === 'carcer' };
    });
    var nC = paires.filter(function (x) { return x.carcer; }).length;
    var nHorsJuge = paires.filter(function (x, i) { return x.carcer && i < 6; }).length;
    return { deplacements: d, total: total, juge: theme[15],
      loiTenue: total === theme[15], paires: paires,
      nbCarcer: nC, nbCarcerHorsJuge: nHorsJuge,
      rarete: LOI_MIROIR_JUGE_V7.distributionCarcer[nC] || 0,
      raretePct: Math.round(1000 * (LOI_MIROIR_JUGE_V7.distributionCarcer[nC] || 0) / 65536) / 10 };
  } catch (e) { return null; }
}

// ═══════════════════════════════════════════════════════════════
// L'AXE OFFENSIF — LA RÈGLE D'ELLEMINE_D, RETOURNÉE PAR LA MESURE
// ═══════════════════════════════════════════════════════════════
//
// « axe offensif : on confirme que cet axe peut marquer si et seulement
//   si la figure somme est présente dans le thème résultant ou base. »
//
// Les deux trigones offensifs, tels qu'Ellemine_D les a posés :
//   camp 1 : M1 + M5 + M9      camp 7 : M7 + M11 + M3
//
// ─── CE QUE LA MESURE DIT, ET ELLE DIT DEUX CHOSES ───
//
// 1. LE SENS EST INVERSÉ. Sur 98 observations (49 matchs × 2 camps),
//    somme présente dans le thème de base : marque 70,3 % du temps,
//    1,78 but ; somme ABSENTE : marque 85,3 %, 2,65 buts. L'axe marque
//    PLUS quand sa somme est absente, pas moins. Ce n'est pas l'effet
//    Populus déguisé : en écartant les sommes qui valent Populus,
//    l'écart tient (70,3 % / 1,78 contre 83,3 % / 2,40).
//    Et c'est la BASE qui porte, pas les résultantes (78 % contre 71,8 %,
//    l'autre sens et sans force).
//
// 2. CE N'EST PAS UN EFFET DE CAMP, C'EST UN EFFET DE MATCH. Test
//    APPARIÉ à l'intérieur de chaque match, sur les 24 matchs où un seul
//    des deux camps a sa somme présente : le camp à somme absente marque
//    plus 7 fois, le camp à somme présente 8 fois, 9 égalités —
//    p = 1,0000. Le camp n'y est pour rien. C'est le NOMBRE de sommes
//    présentes qui parle, et il parle du total du match :
//        0 somme présente ..  5 matchs · 4,80 buts · 4/5  au-dessus de 2,5
//        1 somme présente .. 24 matchs · 5,08 buts · 19/24
//        2 sommes présentes  20 matchs · 2,90 buts · 9/20
//        rho = −0,319 · p = 0,0234 (permutation, 20 000 tirages)
//
// LA RÈGLE UTILE, TELLE QUE MESURÉE : quand les DEUX axes offensifs ont
// leur somme présente dans le thème de base, le match est fermé.
//
// ─── OÙ ELLE SERT, ET OÙ ELLE NE SERT PAS ───
// Elle recoupe largement « zéro Populus », déjà branché devant : mise en
// tête de chaîne elle écrase Populus et fait perdre 3 points (37 -> 34).
// Sa vraie place est LÀ OÙ POPULUS SE TAIT, et là elle est forte :
//        2 sommes présentes .. 14 cas · 28,6 % au-dessus de 2,5 · 2,21 buts
//        au plus 1 ........... 13 cas · 69,2 % · 3,85 buts
// Soit 40 points d'écart dans la seule région où le système n'avait rien.
// Sur la chaîne entière : Populus > axe > miroir fait 38/49 contre 37/49
// pour la chaîne actuelle. +1 après avoir essayé NEUF placements — je ne
// prends pas ce +1 pour un gain, et je ne rebranche pas la chaîne dessus.
var AXE_VOLUME_V7 = {
  axes: { camp1: [1, 5, 9], camp7: [7, 11, 3] },
  regleEllemine: 'l\'axe marque si et seulement si sa somme est présente',
  mesure: 'RETOURNÉE : présente -> 70,3 % et 1,78 but · absente -> 85,3 % et 2,65 buts',
  pasUnEffetDeCamp: 'test apparié sur 24 matchs : 7 contre 8, p = 1,0000. '
    + 'C\'est le nombre de sommes présentes qui parle, et il parle du MATCH.',
  parNombre: { 0: { n: 5, buts: 4.80, plus: '4/5' }, 1: { n: 24, buts: 5.08, plus: '19/24' },
    2: { n: 20, buts: 2.90, plus: '9/20' } },
  correlation: { rho: -0.319, p: 0.0234, methode: 'permutation, 20 000 tirages' },
  ouPopulusSeTait: { deux: { n: 14, taux: 28.6, buts: 2.21 },
    auPlusUne: { n: 13, taux: 69.2, buts: 3.85 } },
  surLaChaine: 'Populus > axe > miroir : 38/49 contre 37/49 — +1 après neuf '
    + 'placements essayés, ce n\'est pas un gain, c\'est du bruit de sélection.',
  pourLActiver: 'BRANCHES_V7.axe_volume.actif = true'
};

function axeVolumeV7(theme) {
  if (!theme) return null;
  try {
    var dansBase = function (f) {
      for (var h = 1; h <= 16; h++) if (theme[h] === f) return true;
      return false;
    };
    var s = function (a, b, c) { return combine(combine(theme[a], theme[b]), theme[c]); };
    var s1 = s(1, 5, 9), s7 = s(7, 11, 3);
    var p1 = dansBase(s1), p7 = dansBase(s7);
    var n = (p1 ? 1 : 0) + (p7 ? 1 : 0);
    return { somme1: s1, somme7: s7, presente1: p1, presente7: p7, nbPresentes: n,
      ferme: n === 2, valeur: n !== 2,
      annonce: n === 2 ? 'moins de 2,5 buts' : 'plus de 2,5 buts',
      attendu: n === 2 ? '2,90 buts en moyenne sur l\'archive'
        : '5,0 buts en moyenne sur l\'archive' };
  } catch (e) { return null; }
}

// ═══════════════════════════════════════════════════════════════
// L'ACCORD DES DEUX LECTURES — CE QUI SORT VRAIMENT DE CES DEUX PISTES
// ═══════════════════════════════════════════════════════════════
//
// L'axe et le miroir sont deux lectures INDÉPENDANTES du volume, et
// elles se valent : dans la région où Populus se tait, 19/27 pour l'axe,
// 18/27 pour le miroir, McNemar 5 contre 4 — un pile ou face entre les
// deux. Aucune ne mérite de remplacer l'autre.
//
// MAIS LEUR ACCORD, LUI, DIT QUELQUE CHOSE. Sur ces 27 cas :
//     ils s'accordent (18 cas) ................. 14/18 justes (78 %)
//        et quand tous deux disent PLUS (5 cas) : 5/5 au-dessus de 2,5
//        et quand tous deux disent MOINS (13)  : 9/13 justes
//     ils se contredisent (9 cas) .............. 5 contre 4 — RIEN
//
// C'est ça, le résultat de ces deux pistes : pas une règle de plus, une
// mesure de CONFIANCE. Quand les deux lectures se contredisent, le
// système ne sait pas, et il vaut mieux qu'il le dise que qu'il devine.
// Le verdict ne change pas — l'annonce reste celle de la chaîne — mais
// le panneau prévient. Les 5/5 portent sur CINQ cas : c'est écrit gros
// pour qu'on ne le lise pas comme une certitude.
function accordVolumeV7(theme) {
  if (!theme) return null;
  var av = null, mv = null;
  try { av = axeVolumeV7(theme); } catch (e) { }
  try { mv = volumeMiroirV7(theme); } catch (e) { }
  if (!av || !mv) return null;
  var accord = av.valeur === mv.valeur;
  return { axe: av.valeur, miroir: mv.valeur, accord: accord,
    sens: accord ? (av.valeur ? 'plus' : 'moins') : null,
    confiance: accord ? (av.valeur ? 'les deux lectures disent PLUS' : 'les deux disent MOINS')
      : 'LES DEUX LECTURES SE CONTREDISENT',
    mesure: accord ? '14/18 justes quand elles s\'accordent'
      : '5 contre 4 quand elles se contredisent — pile ou face',
    fiable: accord };
}

autoTestV7('loi du Juge comme somme des déplacements miroir', function () {
  if (typeof calcTheme !== 'function') return;
  ['populus,via,albus,puella', 'laetitia,fortuna_minor,amissio,via',
   'puer,rubeus,carcer,acquisitio'].forEach(function (k) {
    var m = k.split(',');
    var t = calcTheme(m[0], m[1], m[2], m[3]);
    var d = deplacementsMiroirV7(t);
    if (!d) throw new Error('deplacementsMiroirV7 muet sur ' + k);
    if (!d.loiTenue) throw new Error('M15 != somme des déplacements sur ' + k);
    if (d.nbCarcer > 3) throw new Error('plus de 3 Carcer en paires miroir : impossible');
  });
});

// ═══════════════════════════════════════════════════════════════
// LES DEUX TÉMOINS M13 / M14 — la demande d'Ellemine_D du 05/09
// ═══════════════════════════════════════════════════════════════
//
// « étudier carrément les témoignages M13 et M14, qui sont la somme de
//   chaque partie. Pourquoi en général quand elles sont miroir elles
//   impliquent nul — exemple Puella et Puer, ou Albus et Puer,
//   Tristitia et Laetitia. »
//
// ─── D'ABORD : SES TROIS EXEMPLES NE SONT PAS LA MÊME RELATION ───
//   Puella / Puer ......... RENVERSEMENT (Puer est Puella lue à l'envers)
//   Tristitia / Laetitia .. RENVERSEMENT
//   Albus / Puer .......... COMPLÉMENT (chaque ligne inversée)
// Deux relations distinctes. Mais les trois donnent le même genre de
// Juge : Conjunctio, Carcer, Via — trois des QUATRE figures qui sont
// leur propre renversement. C'est ce qui les unit, et c'est exact.
//
// ─── LES LOIS, VÉRIFIÉES SUR LES 65 536 THÈMES ───
//   Les seules figures égales à leur renversement (les « palindromes ») :
//        VIA · CARCER · CONJUNCTIO · POPULUS — il n'y en a pas d'autres.
//   M13 = M14 ......................... Juge = POPULUS, toujours (16/16)
//   M14 = complément(M13) ............. Juge = VIA, toujours (16/16)
//   M14 = renversement(M13) ........... Juge dans les quatre palindromes
//   M14 = conversion(M13) ............. Juge dans les quatre palindromes
//   Chaque relation couvre exactement 12,5 % des thèmes ; un Juge
//   palindromique, exactement 50 %.
//   La DISTANCE entre les deux témoins (nombre de lignes qui diffèrent)
//   ne vaut jamais 1 ni 3 : seulement 0, 2 ou 4 — conséquence directe de
//   « le Juge est toujours pair ». Répartition 12,5 / 75 / 12,5 %.
//
// ─── ET MAINTENANT CE QUE ÇA PRÉDIT : RIEN, SUR 57 CAS ───
// Base : 13 nuls sur 57, soit 22,8 %.
//   Juge PALINDROMIQUE ......... 5/28 = 17,9 % contre 27,6 % ailleurs
//                                À CONTRESENS · p = 0,5301
//   M13 = M14 (Juge Populus) ... 1/3  = 33,3 % · p = 0,5474
//   renversement ............... 3/6  = 50,0 % contre 19,6 % · p = 0,1246
//   complément (Juge Via) ...... 1/9  = 11,1 % · À CONTRESENS · p = 0,6678
//   conversion ................. 1/7  = 14,3 % · p = 1,0000
// La même batterie passée sur SIX paires symétriques du carré
// (M13/M14, M1/M7, R1/R7, M4/M10, M9/M11, M10/M12) × quatre relations,
// soit 21 tests : meilleur p brut 0,1009, Bonferroni 1,0000. Aucun.
// La distance entre témoins ne dit rien non plus : vers le nul
// rho −0,129 (p = 0,438), vers les buts rho +0,115 (p = 0,434).
//
// ─── CE QUE LA MESURE SÉPARE DANS L'INTUITION D'ELLEMINE_D ───
// Ses deux exemples en RENVERSEMENT pointent dans le bon sens (3 nuls
// sur 6, contre 19,6 % ailleurs). Son exemple en COMPLÉMENT pointe à
// L'ENVERS (1 sur 9, soit 11,1 %). Et l'idée qui les unifiait — le Juge
// palindromique — est celle qui va le plus franchement à contresens.
// Donc : ce n'est PAS « miroir » en général. S'il y a quelque chose,
// c'est le RENVERSEMENT seul, et seulement sur les deux témoins.
// Six cas. Ça ne se tranche pas à six cas, et ça ne se jette pas non
// plus : le compteur ci-dessous tourne pour que la question puisse être
// tranchée un jour. Il faut environ 25 thèmes de la classe
// « renversement M13/M14 », soit ~200 matchs enregistrés au rythme de
// 12,5 %. On en a 6.
var TEMOINS_V7 = {
  palindromes: ['via', 'carcer', 'conjunctio', 'populus'],
  loisExactes: {
    'M13 = M14': 'Juge = Populus, toujours',
    'M14 = complément(M13)': 'Juge = Via, toujours',
    'M14 = renversement(M13)': 'Juge parmi les quatre palindromes',
    'M14 = conversion(M13)': 'Juge parmi les quatre palindromes',
    distance: 'jamais 1 ni 3 — seulement 0, 2 ou 4, parce que le Juge est toujours pair' },
  frequences: { identique: 12.5, renversement: 12.5, complement: 12.5, conversion: 12.5,
    jugePalindromique: 50, distance: { 0: 12.5, 2: 75, 4: 12.5 } },
  mesureNul: { n: 57, nuls: 13, base: 22.8,
    palindrome: { r: '5/28', taux: 17.9, ailleurs: 27.6, p: 0.5301, sens: 'À CONTRESENS' },
    identique: { r: '1/3', taux: 33.3, p: 0.5474 },
    renversement: { r: '3/6', taux: 50.0, ailleurs: 19.6, p: 0.1246, sens: 'bon sens' },
    complement: { r: '1/9', taux: 11.1, p: 0.6678, sens: 'À CONTRESENS' },
    conversion: { r: '1/7', taux: 14.3, p: 1.0 } },
  batterie: '21 tests (6 paires symétriques × 4 relations) — meilleur p brut 0,1009, '
    + 'Bonferroni 1,0000. Rien ne survit.',
  distance: { versNul: { rho: -0.129, p: 0.438 }, versButs: { rho: 0.115, p: 0.434 } },
  conclusion: 'le renversement des deux témoins est la SEULE direction juste, sur six cas. '
    + 'Ni branché ni jeté : compté.',
  ceQuiManque: '~25 thèmes en renversement M13/M14 pour trancher — environ 200 matchs '
    + 'enregistrés, la classe faisant 12,5 %. On en a 6.'
};

function _figParPointsV7(pts) {
  var k = pts.join('');
  for (var i = 0; i < FIGS.length; i++) if (MAP_GEO[FIGS[i]].join('') === k) return FIGS[i];
  return null;
}
function renversementFigureV7(f) { return _figParPointsV7(MAP_GEO[f].slice().reverse()); }
function complementFigureV7(f) {
  return _figParPointsV7(MAP_GEO[f].map(function (x) { return x === 1 ? 2 : 1; }));
}

// La relation entre les deux témoins, et ce qu'elle vaut.
function temoinsV7(theme) {
  if (!theme) return null;
  try {
    var A = theme[13], B = theme[14], J = theme[15];
    var d = 0;
    for (var i = 0; i < 4; i++) if (MAP_GEO[A][i] !== MAP_GEO[B][i]) d++;
    var rel = null;
    if (A === B) rel = 'identiques';
    else if (renversementFigureV7(A) === B) rel = 'renversement';
    else if (complementFigureV7(A) === B) rel = 'complément';
    else if (complementFigureV7(renversementFigureV7(A)) === B) rel = 'conversion';
    var pal = TEMOINS_V7.palindromes.indexOf(J) >= 0;
    var m = rel ? TEMOINS_V7.mesureNul[rel === 'identiques' ? 'identique'
      : rel === 'complément' ? 'complement' : rel] : null;
    return { m13: A, m14: B, juge: J, distance: d, relation: rel,
      jugePalindromique: pal,
      mesure: m,
      lecture: rel ? ('les deux témoins sont en ' + rel) : 'aucune relation de miroir',
      aCompter: rel === 'renversement' };
  } catch (e) { return null; }
}

autoTestV7('les lois des deux témoins', function () {
  if (typeof calcTheme !== 'function') return;
  // Les quatre palindromes sont bien les seules figures auto-renversantes.
  var auto = FIGS.filter(function (f) { return renversementFigureV7(f) === f; });
  if (auto.length !== 4) throw new Error('il doit y avoir exactement 4 figures auto-renversantes');
  TEMOINS_V7.palindromes.forEach(function (f) {
    if (auto.indexOf(f) < 0) throw new Error(f + ' devrait être auto-renversante');
  });
  // Les deux lois exactes, sur les 16 figures.
  FIGS.forEach(function (f) {
    if (combine(f, f) !== 'populus') throw new Error('M13 = M14 doit donner Populus');
    if (combine(f, complementFigureV7(f)) !== 'via') throw new Error('complément doit donner Via');
    var j = combine(f, renversementFigureV7(f));
    if (TEMOINS_V7.palindromes.indexOf(j) < 0)
      throw new Error('renversement doit donner un Juge palindromique, pas ' + j);
  });
  // La distance ne vaut jamais 1 ni 3.
  var t = calcTheme('albus', 'laetitia', 'populus', 'acquisitio');
  var tm = temoinsV7(t);
  if (!tm) throw new Error('temoinsV7 muet');
  if (tm.distance % 2 !== 0) throw new Error('la distance entre témoins doit être paire');
});

// ═══════════════════════════════════════════════════════════════
// LA FIABILITÉ DU VERDICT — testée le 05/09/26 sur l'hypothèse
// d'Ellemine_D : « si un thème se contredit, la fiabilité est faible »
// ═══════════════════════════════════════════════════════════════
//
// ─── L'HYPOTHÈSE EST FAUSSE SUR L'ARCHIVE, ET C'EST MESURÉ ───
// Indice de contradiction construit en comptant, pour chaque thème, le
// nombre de lectures indépendantes qui contredisent l'annonce :
//   sur le VOLUME (5 voix : moteur, Populus, miroir, axe, défense)
//     0 voix contre : 9/12  (75,0 %)     3 voix contre : 5/5 (100 %)
//     1 voix contre : 13/19 (68,4 %)     4 voix contre : 1/1 (100 %)
//     2 voix contre : 8/12  (66,7 %)
//     rho = +0,080 · p = 0,594 — et le SIGNE est à l'envers
//   sur le CAMP (4 voix : protocole, corners, boucles, protocole serré)
//     rho = −0,142 · p = 0,297
//   indice global (volume + camp) -> camp : rho −0,046 · p = 0,757
//   indice global -> volume ............... rho +0,015 · p = 0,922
// Un thème qui se contredit n'est PAS moins fiable. Compter les
// désaccords ne mesure rien.
//
// ⚠️ ET LA MÊME MESURE DÉGONFLE MA PROPRE COUCHE DE LA VEILLE. L'accord
// axe/miroir que j'avais branché comme « mesure de confiance » (14/18
// quand elles s'accordent contre 5-4 sinon) donne Fisher p = 0,3748 sur
// ses 27 cas. Ce n'est pas significatif non plus. Elle appartient à la
// même classe que l'hypothèse d'Ellemine_D — direction plausible, preuve
// mince — et elle ne mérite pas d'être traitée autrement parce que c'est
// moi qui l'ai écrite. Elle reste affichée, avec ce p à côté.
//
// ─── CE QUI EST VRAI, ET QUI EST LE VRAI INDICATEUR ───
// Ce n'est pas la contradiction, c'est CE QUE LE VERDICT ANNONCE. Et il
// faut lire le LEVIER SUR LA BASE, pas le pourcentage brut : un taux de
// 50 % sur un événement qui arrive 22,8 % du temps vaut mieux qu'un taux
// de 78 % sur un événement qui arrive 42 % du temps.
//
//   CAMP (57 cas)        juste      base     levier
//     dit R1 .......  14/18 77,8 %  42,1 %   1,85x   (+35,7 pts)
//     dit R7 .......  13/17 76,5 %  35,1 %   2,18x   (+41,4 pts)
//     dit NUL ......  11/22 50,0 %  22,8 %   2,19x   (+27,2 pts)
//   VOLUME (49 cas)
//     dit PLUS .....  22/25 88,0 %  65,3 %   1,35x   (+22,7 pts)
//     dit MOINS ....  14/24 58,3 %  34,7 %   1,68x   (+23,6 pts)
//
// LE RENVERSEMENT : les deux annonces qui SEMBLENT les plus faibles —
// le nul à 50 % et le « moins de 2,5 » à 58 % — sont en fait celles qui
// apportent LE PLUS d'information. Le nul à 50 % est à 2,19x sa base,
// autant que R7 et mieux que R1. Le « plus de 2,5 » à 88 % n'est qu'à
// 1,35x, parce que 65 % des matchs de l'archive passent 2,5 buts de
// toute façon. Juger une annonce à son pourcentage brut, c'est confondre
// la fréquence de l'événement avec la valeur de l'annonce.
// Fisher : camp nul contre camp gagnant p = 0,0460 ; volume plus contre
// moins p = 0,0009 — les DEUX écarts bruts sont réels, et les DEUX
// disparaissent une fois la base retirée. C'est le point.
var FIABILITE_VERDICT_V7 = {
  hypothese: 'Ellemine_D, 05/09 : « si un thème se contredit, la fiabilité du verdict est faible »',
  verdict: 'FAUSSE sur l\'archive — compter les désaccords ne prédit rien',
  mesures: { volume: { rho: 0.080, p: 0.594 }, camp: { rho: -0.142, p: 0.297 },
    global: { versCamp: { rho: -0.046, p: 0.757 }, versVolume: { rho: 0.015, p: 0.922 } } },
  maProprCouche: 'l\'accord axe/miroir branché la veille : Fisher p = 0,3748 sur 27 cas. '
    + 'Pas plus démontré que l\'hypothèse ci-dessus. Écrit ici pour ne pas m\'accorder un '
    + 'traitement de faveur.',
  leVrai: 'ce n\'est pas la contradiction, c\'est CE QUE LE VERDICT ANNONCE, lu en LEVIER '
    + 'SUR LA BASE et jamais en pourcentage brut',
  table: {
    R1:    { juste: '14/18', taux: 77.8, base: 42.1, levier: 1.85 },
    R7:    { juste: '13/17', taux: 76.5, base: 35.1, levier: 2.18 },
    nul:   { juste: '11/22', taux: 50.0, base: 22.8, levier: 2.19 },
    plus:  { juste: '22/25', taux: 88.0, base: 65.3, levier: 1.35 },
    moins: { juste: '14/24', taux: 58.3, base: 34.7, levier: 1.68 } },
  renversement: 'le nul à 50 % et le « moins » à 58 % — les deux annonces qui semblent les '
    + 'plus faibles — sont celles qui apportent le plus d\'information. Le « plus de 2,5 » '
    + 'à 88 % n\'est qu\'à 1,35x sa base, parce que 65 % des matchs y passent de toute façon.'
};

// Le levier de l'annonce courante, rejoué sur la base d'Ellemine_D.
var _CACHE_FIAB_V7 = null;
function fiabiliteAnnonceV7() {
  var CAS = [];
  try { CAS = (tousCasBancV7() || []).filter(function (c) { return c.meres; }); }
  catch (e) { return null; }
  var cle = CAS.length;
  if (_CACHE_FIAB_V7 && _CACHE_FIAB_V7.cle === cle) return _CACHE_FIAB_V7.val;
  if (_MESURE_EN_COURS_V7 || _GARDE_MIROIR_V7) return null;
  return _sousMesureV7(function () {
    var camp = { R1: [0, 0, 0], R7: [0, 0, 0], nul: [0, 0, 0] }, nC = 0;
    var vol = { plus: [0, 0, 0], moins: [0, 0, 0] }, nV = 0;
    CAS.forEach(function (c) {
      var t;
      try { t = calcTheme(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
      var v; try { v = avecFormatV7('reel', function () { return getVerdictAfficheReel(t); }); }
      catch (e) { return; }
      if (!v) return;
      if (c.camp) {
        nC++;
        var dit = v.nulActif ? 'nul' : (v.winner === 'M1' ? 'R1' : 'R7');
        camp[dit][0]++; if (dit === c.camp) camp[dit][1]++;
        if (camp[c.camp]) camp[c.camp][2]++;
      }
      var g = /^(\d+)-(\d+)$/.exec(c.score || '');
      if (g && v.plus25) {
        nV++;
        var vrai = (+g[1] + +g[2]) > 2.5;
        var k = v.plus25.valeur ? 'plus' : 'moins';
        vol[k][0]++; if (v.plus25.valeur === vrai) vol[k][1]++;
        vol[vrai ? 'plus' : 'moins'][2]++;
      }
    });
    var fin = function (o, n) {
      var r = {};
      Object.keys(o).forEach(function (k) {
        var a = o[k];
        if (!a[0] || !n) { r[k] = null; return; }
        var taux = 100 * a[1] / a[0], base = 100 * a[2] / n;
        r[k] = { annonces: a[0], justes: a[1], taux: Math.round(taux * 10) / 10,
          base: Math.round(base * 10) / 10,
          levier: base ? Math.round(100 * taux / base) / 100 : null };
      });
      return r;
    };
    var val = { nCamp: nC, nVolume: nV, camp: fin(camp, nC), volume: fin(vol, nV) };
    if (nC || nV) _CACHE_FIAB_V7 = { cle: cle, val: val };
    return val;
  });
}

// ═══════════════════════════════════════════════════════════════
// LE DRAPEAU DE MESURE — sans lui, le fichier ne se charge plus
// ═══════════════════════════════════════════════════════════════
// Chaque branche du volume se rejoue sur le banc pour savoir si elle
// gagne encore : elle calcule donc un ou deux VERDICTS par cas. Mais
// chacun de ces verdicts repasse par le champ plus25, qui relance les
// mêmes mesures — et comme le cache n'est écrit qu'à la FIN de la
// boucle, rien ne l'arrête. Attrapé en branchant l'axe : la page ne
// finissait plus de charger (timeout au chargement, pas une erreur —
// donc silencieux si on ne l'ouvre pas).
// Ce drapeau est levé pendant toute mesure : à l'intérieur, plus25
// prend les branches telles quelles et ne recompte rien. On ne lit de
// ces verdicts intérieurs que leur score, jamais leur auto-retrait.
var _MESURE_EN_COURS_V7 = false;
function _sousMesureV7(fn) {
  var av = _MESURE_EN_COURS_V7;
  try { _MESURE_EN_COURS_V7 = true; return fn(); }
  finally { _MESURE_EN_COURS_V7 = av; }
}

// GARDE DE RÉENTRANCE. Le verdict appelle le miroir, et le miroir appelle le
// verdict sur le thème retourné : sans ce drapeau, la récursion est infinie.
// Quand il est levé, le champ plus25 se contente du moteur — c'est exactement
// ce qu'on veut de la lecture intérieure, dont on ne lit que le score.
var _GARDE_MIROIR_V7 = false;

// Le total de buts affiché par la LECTURE RETOURNÉE seule (thème rebâti sur
// M5..M8). Rien d'autre — le total direct, l'appelant l'a déjà sous la main.
function totalMiroirSeulV7(theme) {
  if (!theme || _GARDE_MIROIR_V7) return null;
  try {
    _GARDE_MIROIR_V7 = true;
    var u = calcTheme(theme[5], theme[6], theme[7], theme[8]);
    var vm = avecFormatV7('reel', function () { return getVerdictAfficheReel(u); });
    var g = /^(\d+)-(\d+)$/.exec((vm && vm.scoreMain) || '');
    return g ? { total: (+g[1]) + (+g[2]), score: vm.scoreMain } : null;
  } catch (e) { return null; }
  finally { _GARDE_MIROIR_V7 = false; }
}

// La somme des deux lectures et ce qu'elle annonce.
function volumeMiroirV7(theme) {
  if (!theme) return null;
  try {
    var vd, tmi;
    // La lecture DIRECTE se calcule garde levée : on ne lui demande que son
    // score, et on ne veut surtout pas qu'elle rebâtisse le miroir pour rien.
    var av = _GARDE_MIROIR_V7;
    try { _GARDE_MIROIR_V7 = true;
      vd = avecFormatV7('reel', function () { return getVerdictAfficheReel(theme); });
    } finally { _GARDE_MIROIR_V7 = av; }
    tmi = totalMiroirSeulV7(theme);
    var g1 = /^(\d+)-(\d+)$/.exec((vd && vd.scoreMain) || '');
    if (!g1 || !tmi) return null;
    var td = (+g1[1]) + (+g1[2]), tm = tmi.total;
    return { direct: td, miroir: tm, somme: td + tm, seuil: MIROIR_VOLUME_V7.seuil,
      annonce: (td + tm) > MIROIR_VOLUME_V7.seuil ? 'plus de 2,5 buts' : 'moins de 2,5 buts',
      valeur: (td + tm) > MIROIR_VOLUME_V7.seuil,
      scoreMiroir: tmi.score,
      attendu: (td + tm) > MIROIR_VOLUME_V7.seuil ? '5,20 buts en moyenne sur l\'archive'
        : '3,36 buts en moyenne sur l\'archive' };
  } catch (e) { return null; }
}

// Rejoué sur TA base — et la branche se retire si elle n'y gagne plus.
//
// ⚠️ CE QUI EST COMPTÉ ICI EST LA CHAÎNE ENTIÈRE, pas le miroir tout seul.
// Le champ plus25 annonce dans cet ordre : zéro Populus, puis miroir, puis
// moteur. La seule question honnête est donc « la chaîne AVEC le miroir
// bat-elle la chaîne SANS ? » — pas « le miroir bat-il le moteur nu »,
// qui était la mesure du 05/09 mais qui ignore la règle Populus déjà
// branchée devant lui. Les deux chiffres sont renvoyés.
// Mémoïsée : le champ plus25 l'appelle à CHAQUE verdict, et elle-même
// calcule deux verdicts par cas du banc. Sans le cache, afficher un thème
// coûterait deux cents verdicts. La clé est la taille du banc, qui change
// dès qu'un match est enregistré.
// Le branchement du miroir tient debout, ou il le dit au chargement.
// Ce que ces tests attrapent, et qui a failli passer :
//  1. la récursion infinie verdict -> miroir -> verdict, si la garde saute ;
//  2. une garde qui reste levée après une exception, ce qui éteindrait la
//     branche en silence pour tout le reste de la session ;
//  3. une somme qui ne serait plus direct + miroir — le seul calcul de la
//     règle, et donc la seule chose qu'Ellemine_D puisse refaire à la main.
autoTestV7('miroir M5 branché au volume de buts', function () {
  if (typeof calcTheme !== 'function' || typeof getVerdictAfficheReel !== 'function') return;
  var t = calcTheme('populus', 'via', 'albus', 'puella');
  var v = volumeMiroirV7(t);
  if (!v) throw new Error('volumeMiroirV7 muet sur un thème valide');
  if (v.somme !== v.direct + v.miroir) throw new Error('la somme n\'est pas direct + miroir');
  if (v.valeur !== (v.somme > MIROIR_VOLUME_V7.seuil)) throw new Error('seuil non respecté');
  if (_GARDE_MIROIR_V7) throw new Error('la garde de réentrance est restée levée');
  // La garde doit se rabaisser même quand l'appel intérieur explose.
  var av = _GARDE_MIROIR_V7;
  try { totalMiroirSeulV7(null); } catch (e) { }
  if (_GARDE_MIROIR_V7 !== av) throw new Error('la garde ne se rabaisse pas après échec');
  // Le verdict complet doit terminer — s'il récursait, on n'arriverait pas ici.
  var vv = avecFormatV7('reel', function () { return getVerdictAfficheReel(t); });
  if (!vv || !vv.plus25) throw new Error('plus25 absent du verdict');
  if (BRANCHES_V7.miroir_volume.actif && vv.plus25.miroir) {
    if (vv.plus25.miroir.somme !== vv.plus25.miroir.direct + vv.plus25.miroir.miroir)
      throw new Error('la somme affichée par le verdict ne recompose pas');
  }
});

var _CACHE_MIR_CHAINE_V7 = null;
function volumeMiroirChaineLiveV7() {
  var CAS = [];
  try { CAS = tousCasBancV7() || []; } catch (e) { return null; }
  var cle = CAS.length + '|' + (typeof BRANCHES_V7 !== 'undefined'
    && BRANCHES_V7.populus_volume && BRANCHES_V7.populus_volume.actif ? 1 : 0);
  if (_CACHE_MIR_CHAINE_V7 && _CACHE_MIR_CHAINE_V7.cle === cle) return _CACHE_MIR_CHAINE_V7.val;
  if (_MESURE_EN_COURS_V7) return null;
  return _sousMesureV7(function () {
  var pop = false;
  try { pop = !!(BRANCHES_V7 && BRANCHES_V7.populus_volume && BRANCHES_V7.populus_volume.actif); }
  catch (e) { }
  var n = 0, sans = 0, avec = 0, g = 0, pe = 0;
  CAS.forEach(function (c) {
    var m = /^(\d+)-(\d+)$/.exec(c.score || '');
    if (!m || !c.meres) return;
    var vrai = (+m[1] + +m[2]) > 2.5;
    var t; try { t = calcTheme(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    var v = volumeMiroirV7(t);
    if (!v) return;
    var zero = null;
    try { var lp = lecturePopulusV7(t); zero = lp ? lp.zeroPopulus : null; } catch (e) { }
    var moteur = v.direct > 2.5;
    var chaineSans = (pop && zero === true) ? true : moteur;
    var chaineAvec = (pop && zero === true) ? true : v.valeur;
    n++;
    if (chaineSans === vrai) sans++;
    if (chaineAvec === vrai) avec++;
    if (chaineAvec !== chaineSans) { if (chaineAvec === vrai) g++; else pe++; }
  });
  var res = n ? { n: n, sansMiroir: sans, avecMiroir: avec, gain: avec - sans,
    gagnes: g, perdus: pe, populusDevant: pop } : null;
  // Jamais de résultat vide en cache : cf. le commentaire d'axeChaineLiveV7.
  if (res) _CACHE_MIR_CHAINE_V7 = { cle: cle, val: res };
  return res;
  });
}

function volumeMiroirLiveV7() {
  var CAS = [];
  try { CAS = tousCasBancV7() || []; } catch (e) { return null; }
  var direct = 0, avec = 0, n = 0, plusN = 0, plusVrai = 0, moinsN = 0, moinsVrai = 0;
  CAS.forEach(function (c) {
    var g = /^(\d+)-(\d+)$/.exec(c.score || '');
    if (!g || !c.meres) return;
    var vrai = (+g[1] + +g[2]) > 2.5;
    var t; try { t = calcTheme(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    var v = volumeMiroirV7(t);
    if (!v) return;
    n++;
    if ((v.direct > 2.5) === vrai) direct++;
    if (v.valeur === vrai) avec++;
    if (v.valeur) { plusN++; if (vrai) plusVrai++; } else { moinsN++; if (vrai) moinsVrai++; }
  });
  if (!n) return null;
  return { n: n, direct: direct, avecMiroir: avec, gain: avec - direct,
    ditPlus: { n: plusN, taux: plusN ? Math.round(1000 * plusVrai / plusN) / 10 : null },
    ditMoins: { n: moinsN, taux: moinsN ? Math.round(1000 * moinsVrai / moinsN) / 10 : null },
    gele: { n: 48, direct: 26, avecMiroir: 31 } };
}

// ═══════════════════════════════════════════════════════════════
// L'AXE OFFENSIF REJOUÉ SUR LA BASE COURANTE — le garde-fou de sa branche
// ═══════════════════════════════════════════════════════════════
// Même contrat que le miroir : la branche recompte la CHAÎNE ENTIÈRE sur
// les cas d'Ellemine_D et se retire d'elle-même si elle n'y gagne plus.
// Mémoïsée sur la taille du banc et l'état des booléens : le champ plus25
// l'appelle à chaque verdict, et elle calcule un verdict par cas.
var _CACHE_AXE_CHAINE_V7 = null;
function axeChaineLiveV7() {
  var CAS = [];
  try {
    CAS = (tousCasBancV7() || []).filter(function (c) {
      return c.meres && /^\d+-\d+$/.test(c.score || '');
    });
  } catch (e) { return null; }
  var cle = CAS.length;
  if (_CACHE_AXE_CHAINE_V7 && _CACHE_AXE_CHAINE_V7.cle === cle) return _CACHE_AXE_CHAINE_V7.val;
  // Deux sorties, et la seconde a coûté cher à trouver. La garde du miroir
  // peut être levée quand on arrive ici (le verdict intérieur du miroir
  // repasse par plus25) : dans cet état volumeMiroirV7 renvoie null pour
  // TOUS les cas, la boucle compte zéro, et le résultat vide se figeait
  // dans le cache pour toute la session — la branche paraissait morte
  // alors qu'elle marchait. Rien ne le signalait : pas d'erreur, juste un
  // null. D'où la sortie ci-dessous ET la règle « on ne met en cache que
  // ce qui a compté au moins un cas ».
  if (_MESURE_EN_COURS_V7 || _GARDE_MIROIR_V7) return null;
  return _sousMesureV7(function () {
  var n = 0, sans = 0, avec = 0, g = 0, pe = 0;
  CAS.forEach(function (c) {
    var t;
    try { t = calcTheme(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    var m = /^(\d+)-(\d+)$/.exec(c.score);
    var vrai = (+m[1] + +m[2]) > 2.5;
    var zero = null;
    try { var lp = lecturePopulusV7(t); zero = lp ? lp.zeroPopulus : null; } catch (e) { }
    var mv = null; try { mv = volumeMiroirV7(t); } catch (e) { }
    var ax = null; try { ax = axeVolumeV7(t); } catch (e) { }
    if (!mv || !ax) return;
    var pop = false;
    try { pop = !!(BRANCHES_V7.populus_volume && BRANCHES_V7.populus_volume.actif); } catch (e) { }
    var base = (pop && zero === true) ? true : mv.valeur;
    var aveq = (pop && zero === true) ? true : (ax.ferme ? false : mv.valeur);
    n++;
    if (base === vrai) sans++;
    if (aveq === vrai) avec++;
    if (aveq !== base) { if (aveq === vrai) g++; else pe++; }
  });
  var val = n ? { n: n, sansAxe: sans, avecAxe: avec, gain: avec - sans,
    gagnes: g, perdus: pe } : null;
  if (val) _CACHE_AXE_CHAINE_V7 = { cle: cle, val: val };
  return val;
  });
}

autoTestV7('les trois portes du nul et l\'axe branché', function () {
  if (typeof calcTheme !== 'function') return;
  var t = calcTheme('laetitia', 'fortuna_minor', 'amissio', 'via');
  var cm = nulCarcerMiroirV7(t);
  if (!cm) throw new Error('nulCarcerMiroirV7 muet');
  if (cm.nbCarcer < 1) throw new Error('le thème du 22/02 doit avoir >= 1 Carcer hors M13/M14');
  if (!cm.oui) throw new Error('la troisième porte doit s\'ouvrir sur le 22/02');
  if (!nulActifV7(t, structureDuNul(t), null)) throw new Error('le nul doit être actif sur le 22/02');
  var ax = axeVolumeV7(t);
  if (!ax || ax.nbPresentes !== 2) throw new Error('les deux sommes d\'axe doivent être présentes');
  var v = avecFormatV7('reel', function () { return getVerdictAfficheReel(t); });
  if (!v || !v.plus25) throw new Error('plus25 absent');
});

autoTestV7('les mesures vivantes ne se figent jamais à vide', function () {
  if (typeof tousCasBancV7 !== 'function') return;
  // Le piège attrapé le 05/09 : une mesure lancée pendant qu'une garde est
  // levée compte zéro cas, et son résultat vide reste en cache pour la
  // session. Chaque mesure doit renvoyer un compte non nul quand on
  // l'appelle proprement — et ne rien mettre en cache sinon.
  [['axeChaineLiveV7', typeof axeChaineLiveV7 === 'function' ? axeChaineLiveV7 : null],
   ['volumeMiroirChaineLiveV7', typeof volumeMiroirChaineLiveV7 === 'function' ? volumeMiroirChaineLiveV7 : null],
   ['mesurePopulusLiveV7', typeof mesurePopulusLiveV7 === 'function' ? mesurePopulusLiveV7 : null]
  ].forEach(function (x) {
    if (!x[1]) return;
    var r = x[1]();
    if (!r || !r.n) throw new Error(x[0] + ' renvoie une mesure vide');
  });
});
