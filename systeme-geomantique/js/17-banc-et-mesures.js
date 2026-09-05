// ═══════════════════════════════════════════════════════════════
// BANC ET MESURES
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
var PAIRES_V7 = [
  { a: 'PuerFortMaj', b: 'PopFortMaj', camp: 'nul', quand: '29/08/26', match: '0-0' },
  { a: 'TristPop', b: 'ConjTrist', camp: 'R7', quand: '29/08/26', match: '3-2 pour R7' },
  { a: 'TristCaput', b: 'FortMajTrist', camp: 'nul', quand: '30/08/26', match: '3-3' },
  // Le triplet du 30/08 entre comme trois paires : chaque thème contre
  // chaque autre. C'est la seule façon honnête de le compter — un
  // triplet n'est pas une paire, mais il contient trois comparaisons.
  { a: 'FortMajLaet2', b: 'FortMajAlbus', camp: 'R1', quand: '30/08/26', match: '3-1 (triplet A/B)' },
  { a: 'FortMajLaet2', b: 'ConjCaput2', camp: 'R1', quand: '30/08/26', match: '3-1 (triplet A/C)' },
  { a: 'FortMajAlbus', b: 'ConjCaput2', camp: 'R1', quand: '30/08/26', match: '3-1 (triplet B/C)' },
  { a: 'CarcPuella', b: 'CarcCaput', camp: 'R7', quand: '30/08/26', match: '3-4 (triplet 2 A/B)' },
  { a: 'CarcPuella', b: 'FortMajFMin', camp: 'R7', quand: '30/08/26', match: '3-4 (triplet 2 A/C)' },
  { a: 'CarcCaput', b: 'FortMajFMin', camp: 'R7', quand: '30/08/26', match: '3-4 (triplet 2 B/C)' }
];

// Les valeurs comparables d'un thème, pour départager une paire.
// Toutes se lisent « plus il y en a, plus on fait confiance ».
function criteresPaireV7(theme) {
  var o = { niveau: 0, axes: 0, fdj: 0, faisceau: 0, theoreme: 0, cadent: 0, verdict: '?' };
  try {
    var v = getVerdictAfficheReel(theme);
    o.verdict = v.nulActif ? 'nul' : (v.winner === 'M1' ? 'R1' : 'R7');
  } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  try { var nv = niveauValiditeV7(theme); o.niveau = nv.niveau; o.fdj = nv.fdjOk ? 1 : 0; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  try { var pc = porteConfianceV7(theme); if (pc) o.axes = pc.nbAxes; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  try { var f = faisceauNulV7(theme); if (f) o.faisceau = f.n; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  try { var cd = campDoubleV7(theme); o.theoreme = (cd && cd.applicable) ? 1 : 0; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  try { var r = getRotationCombat(theme); o.cadent = (r && [3, 6, 9, 12].indexOf(r.hR1) >= 0) ? 1 : 0; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  return o;
}

var CRITERES_PAIRE_V7 = [
  { cle: 'niveau', nom: 'niveau de validité' },
  { cle: 'axes', nom: 'dérivés d\'axe valides' },
  // Depuis le 04/09/26 la figure du jour est DANS le niveau : « complet »
  // ferait doublon avec « niveau ». Le critère devient la figure du jour
  // seule, qui reste une information distincte pour départager une paire.
  { cle: 'fdj', nom: 'figure du jour présente' },
  { cle: 'faisceau', nom: 'faisceau du nul' },
  { cle: 'theoreme', nom: 'théorème d\'Ellemine applicable' },
  { cle: 'cadent', nom: 'R1 en maison cadente' }
];

function registrePairesV7() {
  var bilan = {}, informatives = 0, total = 0, lignes = [];
  CRITERES_PAIRE_V7.forEach(function (c) { bilan[c.cle] = { juste: 0, faux: 0, muet: 0 }; });
  (PAIRES_V7 || []).forEach(function (p) {
    var ca = null, cb = null;
    try {
      var la = tousCasBancV7().filter(function (x) { return x.nom === p.a; })[0];
      var lb = tousCasBancV7().filter(function (x) { return x.nom === p.b; })[0];
      if (!la || !lb) return;
      ca = criteresPaireV7(buildThemeFromMothers(la.meres[0], la.meres[1], la.meres[2], la.meres[3]));
      cb = criteresPaireV7(buildThemeFromMothers(lb.meres[0], lb.meres[1], lb.meres[2], lb.meres[3]));
    } catch (e) { return; }
    total += 1;
    var aJuste = (ca.verdict === p.camp), bJuste = (cb.verdict === p.camp);
    if (aJuste === bJuste) {
      lignes.push({ paire: p, informative: false,
        resume: aJuste ? 'les deux ont raison' : 'les deux ont tort' });
      return;
    }
    informatives += 1;
    var bon = aJuste ? 'a' : 'b';
    var detail = [];
    CRITERES_PAIRE_V7.forEach(function (c) {
      var va = ca[c.cle], vb = cb[c.cle];
      var choix = (va === vb) ? null : (va > vb ? 'a' : 'b');
      if (choix === null) { bilan[c.cle].muet += 1; detail.push({ cle: c.cle, etat: 'muet' }); }
      else if (choix === bon) { bilan[c.cle].juste += 1; detail.push({ cle: c.cle, etat: 'juste' }); }
      else { bilan[c.cle].faux += 1; detail.push({ cle: c.cle, etat: 'faux' }); }
    });
    lignes.push({ paire: p, informative: true, bon: bon === 'a' ? p.a : p.b, detail: detail });
  });
  return { bilan: bilan, informatives: informatives, total: total, lignes: lignes };
}

// ═══════════════════════════════════════════════════════════════
// LE BALAYAGE DE SÉPARATION (30/08/26)
//
// La question d'Ellemine_D après le deuxième triplet : « comment séparer
// les thèmes qui tiennent le vrai verdict ? » Elle mérite mieux qu'une
// opinion, et elle mérite mieux qu'une réponse d'un jour.
//
// Ce balayage prend TOUTES les propriétés qu'un thème peut avoir —
// validité, axes, faisceau, porte, maison de R1, théorème, figure du
// Juge, accord des moteurs, ce que le verdict annonce — et demande pour
// chacune : « les thèmes qui l'ont sont-ils plus souvent justes que ceux
// qui ne l'ont pas ? » Puis il applique la correction qu'on oublie
// toujours : quand on teste 17 propriétés, il en sort UNE sous p = 0,05
// par pur hasard (17 × 0,05 = 0,85). Un p brut de 0,03 sur le meilleur
// de 17 candidats ne vaut rien. Bonferroni multiplie par le nombre de
// tests ; c'est brutal et c'est le minimum honnête.
//
// ☠️ AU 30/08/26, SUR 45 CAS : AUCUNE PROPRIÉTÉ NE SÉPARE.
//     faisceau ≥ 4/7 ......... 43 % contre 71 %   p = 0,199
//     3 dérivés d'axe sur 3 .. 57 % contre 77 %   p = 0,208
//     BTTS annoncé ........... 57 % contre 75 %   p = 0,226
//     …14 autres, toutes au-dessus de 0,49
// Meilleur p brut 0,199 ; corrigé pour 17 tests : 0,199 × 17 = 3,4,
// plafonné à 1,00 — autrement dit rien du tout. Et les trois plus gros
// écarts pointent tous À L'ENVERS : plus le thème a de signal, moins il
// est juste. C'est la même inversion que sur les axes (1 axe 83 %,
// 2 axes 86 %, 3 axes 59 %) et je n'ai pas d'explication à en donner —
// seulement le fait qu'elle se répète.
//
// ⚠️ CE QUE ÇA VEUT DIRE. « Ce thème est-il fiable ? » n'a pas de
// réponse mesurable dans ce fichier. Toutes les tentatives de SÉLECTION
// ont échoué : la validité, les axes, la porte, le faisceau, le
// théorème, l'accord des moteurs (0/2 sur les triplets), l'unanimité de
// F4P4 (fausse le jour où je m'en suis servi). Le balayage reste
// branché pour que le jour où une propriété sépare vraiment, elle se
// signale toute seule au lieu d'être devinée.
function balayageSeparationV7() { return memoArchiveV7('balayageSeparationV7', _balayageSeparationV7); }
function _balayageSeparationV7() {
  var cas = [];
  try { cas = tousCasBancV7() || []; } catch (e) { return null; }
  var props = {}, nJ = 0, nT = 0;
  function add(nom, val, juste) {
    if (val === null || val === undefined) return;
    if (!props[nom]) props[nom] = { oui: [0, 0], non: [0, 0] };
    var b = props[nom][val ? 'oui' : 'non'];
    b[juste ? 0 : 1] += 1;
  }
  cas.forEach(function (c) {
    if (!c || !c.camp) return;
    var t, v;
    try { t = buildThemeFromMothers(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    try { v = getVerdictAfficheReel(t); } catch (e) { return; }
    var dit = v.nulActif ? 'nul' : (v.winner === 'M1' ? 'R1' : 'R7');
    var juste = (dit === c.camp);
    nT += 1; if (juste) nJ += 1;
    var nv = null, pc = null, f = null, r = null, cd = null, ac = null;
    try { nv = niveauValiditeV7(t); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { pc = porteConfianceV7(t); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { f = faisceauNulV7(t); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { r = getRotationCombat(t); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { cd = campDoubleV7(t); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { ac = accordCampV7(t); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    // 04/09/26 : la figure du jour étant maintenant DANS le niveau, le
    // second critère lit fdjOk et non complet — sinon les deux lignes
    // mesureraient exactement la même chose et le panneau afficherait
    // deux fois le même chiffre en le faisant passer pour deux tests.
    if (nv) { add('validité 3/3', nv.niveau >= 3, juste); add('figure du jour présente', !!nv.fdjOk, juste); }
    if (pc) { add('3 dérivés d\'axe sur 3', pc.nbAxes >= 3, juste); add('3 binômes sur 3', pc.nbBinomes >= 3, juste); }
    if (f) add('faisceau ≥ 4/7', f.n >= 4, juste);
    add('porte du nul ouverte', !!nulParPorteV7(t), juste);
    if (r && r.hR1) {
      add('R1 en maison cadente', [3, 6, 9, 12].indexOf(r.hR1) >= 0, juste);
      add('R1 en maison angulaire', [1, 4, 7, 10].indexOf(r.hR1) >= 0, juste);
      if (r.hR1 <= 12) add('R1 en maison de confusion', !!maisonConfusionV7(r.hR1), juste);
    }
    add('théorème d\'Ellemine applicable', !!(cd && cd.applicable), juste);
    if (ac && ac.lisible) add('F4P4 et critères d\'accord', !!ac.accord, juste);
    add('le Juge (M15) est Via ou Populus', t[15] === 'via' || t[15] === 'populus', juste);
    add('Conjunctio présent dans le thème', (function () {
      for (var h = 1; h <= 16; h++) if (t[h] === 'conjunctio') return true; return false;
    })(), juste);
    add('verdict annoncé = nul', dit === 'nul', juste);
    add('verdict annoncé = R1', dit === 'R1', juste);
    if (typeof v.btts === 'boolean') add('les deux marquent annoncé', v.btts === true, juste);
    try { add('sommes d\'incident > 0', sommesAxesIncidentV7(t).nb > 0, juste); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  });
  var lignes = [];
  Object.keys(props).forEach(function (k) {
    var o = props[k].oui, n = props[k].non;
    var no = o[0] + o[1], nn = n[0] + n[1];
    if (no < 4 || nn < 4) return;   // moins de 4 d'un côté : illisible
    var to = o[0] / no, tn = n[0] / nn;
    lignes.push({ nom: k, oui: o[0], nOui: no, non: n[0], nNon: nn,
      tauxOui: to, tauxNon: tn, ecart: to - tn, p: fisherExactV7(o[0], o[1], n[0], n[1]) });
  });
  lignes.sort(function (a, b) { return a.p - b.p; });
  var k = lignes.length;
  return { lignes: lignes, tests: k, justes: nJ, total: nT,
    meilleurP: k ? lignes[0].p : null,
    corrige: k ? Math.min(1, lignes[0].p * k) : null,
    attenduSous5: Math.round(k * 0.05 * 100) / 100 };
}

// ═══════════════════════════════════════════════════════════════
// L'ARBITRAGE DES MOTEURS (30/08/26) — « il y a trop de contradiction »
//
// Ellemine_D a raison sur le fait, et le 0-7 le montre en grand : sept
// lectures du même thème, six disent R7, celle qui pilote dit R1, et
// c'est elle qui s'affiche. La question naturelle est « laquelle
// suivre ? ». Elle a une réponse mesurable, et la réponse est : aucune.
//
// ☠️ SUR 33 MATCHS DÉCIDÉS OÙ AU MOINS TROIS MOTEURS SE PRONONCENT :
//     les critères (le pilote, ce qui s'affiche) .... 20/33   61 %
//     la MAJORITÉ des six autres moteurs ........... 19/33   58 %
//     ils divergent sur 13 matchs :
//        le pilote a raison ......................... 7/13
//        la majorité a raison ....................... 6/13     p = 1,000
//
// ☠️ ET PIRE — QUAND LES SIX AUTRES SONT UNANIMES : 4 justes sur 9.
// Sous la pièce. Unanimes CONTRE le pilote : 1 sur 4 (Napoli 6/6 pour
// R1, réel R7 ; ConjVia 6/6 pour R7, réel R1 ; City/Madrid 6/6 pour R7,
// réel R1 ; le 0-7 est le seul où ils avaient raison).
//
// ⚠️ CE QU'IL FAUT EN COMPRENDRE, ET C'EST LA MÊME LEÇON QUE CELLE DE
// L'UNANIMITÉ DE F4P4 SUR LE DEUXIÈME TRIPLET : ces moteurs ne sont pas
// indépendants. Ils lisent tous les mêmes seize figures par des chemins
// voisins — présence, position, boucle, résultantes. Quand la structure
// du thème penche, ils penchent tous ensemble, juste ou faux. Leur
// accord n'est donc pas une confirmation : c'est le même avis compté
// six fois. Un vote entre eux ne peut pas produire d'information qu'ils
// n'ont pas séparément.
//
// ➜ LA CONTRADICTION N'EST PAS UNE ÉNIGME À RÉSOUDRE, C'EST DU BRUIT.
// Suivre le pilote, suivre la majorité, ou tirer à pile ou face donnent
// la même chose. Ce qu'il faut en faire : ne pas jouer le camp sur un
// thème où les moteurs se contredisent — et ne pas le jouer davantage
// quand ils s'accordent, parce que leur accord ne vaut pas mieux.
function arbitrageMoteursV7() { return memoArchiveV7('arbitrageMoteursV7', _arbitrageMoteursV7); }
function _arbitrageMoteursV7() {
  var cas = [];
  try { cas = tousCasBancV7() || []; } catch (e) { return null; }
  var r = { pilote: [0, 0], majorite: [0, 0], divergences: [], unanime: [0, 0], unanimeContre: [0, 0], n: 0 };
  cas.forEach(function (c) {
    if (!c || !c.camp || c.camp === 'nul') return;
    var t;
    try { t = buildThemeFromMothers(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    var pil = null, autres = [];
    try { var mc = moteurCritereV7(t, POIDS_SANS_CONC_ENV_V7); pil = mc && mc.camp ? mc.camp : null; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    if (!pil) return;
    function pousse(v) { if (v === 'R1' || v === 'R7') autres.push(v); }
    try { var m = moteurF4P4V7(t); pousse(m && m.applicable ? m.avantage : null); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var sg = lectureSiegesR1R7(t); pousse(sg && sg.applicable ? sg.winner : null); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var an = analyseAncrageDeveloppe(t); pousse(an && an.applicable ? an.avantage : null); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var rz = analyserReseauAncrageV2(t); pousse(rz ? rz.winner : null); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var pr = comparerBouclesAntagonistesR1R7(t); pousse(pr && pr.applicable ? pr.winner : null); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var tp = tablePolesV7(t); pousse(tp ? (tp.winner || tp.camp) : null); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    if (autres.length < 3) return;
    var n1 = 0;
    autres.forEach(function (x) { if (x === 'R1') n1 += 1; });
    var n7 = autres.length - n1;
    if (n1 === n7) return;
    var maj = n1 > n7 ? 'R1' : 'R7';
    r.n += 1;
    r.pilote[pil === c.camp ? 0 : 1] += 1;
    r.majorite[maj === c.camp ? 0 : 1] += 1;
    if (n1 === 0 || n7 === 0) {
      r.unanime[maj === c.camp ? 0 : 1] += 1;
      if (maj !== pil) r.unanimeContre[maj === c.camp ? 0 : 1] += 1;
    }
    if (pil !== maj) {
      r.divergences.push({ nom: c.nom, pilote: pil, majorite: maj,
        force: Math.max(n1, n7) + '/' + autres.length, reel: c.camp,
        bon: maj === c.camp ? 'majorité' : 'pilote' });
    }
  });
  var dp = [0, 0], dm = [0, 0];
  r.divergences.forEach(function (d) {
    dp[d.pilote === d.reel ? 0 : 1] += 1;
    dm[d.majorite === d.reel ? 0 : 1] += 1;
  });
  r.divPilote = dp; r.divMajorite = dm;
  r.p = fisherExactV7(dp[0], dp[1], dm[0], dm[1]);
  return r;
}

// ═══════════════════════════════════════════════════════════════
// CE QUE LA VALIDITÉ GOUVERNE, FAMILLE PAR FAMILLE (30/08/26)
//
// Ellemine_D, sur un thème à 1/3 qui avait vu l'incident du match :
// « le mode d'analyse n'est pas juste, ça reste. » Son idée implicite
// est excellente : le rejet est GLOBAL alors que l'erreur ne l'est pas.
// Peut-être faut-il taire le thème sur le camp et le laisser parler sur
// l'incident. J'allais le construire. Je l'ai mesuré d'abord.
//
// ☠️ ET IL N'Y A RIEN À RAFFINER : LA VALIDITÉ NE GOUVERNE AUCUNE
// FAMILLE. Sur 50 cas, thèmes valides contre thèmes rejetés :
//     camp (vainqueur/nul) .... 60 % contre 64 %    p = 0,772
//     le nul (oui/non) ........ 85 % contre 89 %    p = 0,683
//     les deux marquent ....... 71 % contre 75 %    p = 1,000
//     score exact ............. 20 % contre 32 %    p = 0,486
//     match serré ............. 67 % contre 68 %    p = 1,000
//     incident (somme d'axes) . 1/1  contre 5/6     p = 1,000
// CINQ familles sur six, l'écart penche du côté des thèmes REJETÉS. La
// sixième — l'incident — penche de l'autre côté sur UN SEUL cas valide
// (1/1 contre 5/6) : ça ne pèse rien.
// (⚠️ J'avais écrit « six sur six » dans ce commentaire pendant que le
// code affichait « cinq sur six ». Le code avait raison. C'est la
// troisième fois en deux jours qu'un chiffre écrit à la main dans ce
// fichier ment ; les chiffres du banc, eux, se recalculent.)
// Rien n'est significatif — p de 0,486 à 1,000 — mais un filtre censé
// garder les bons thèmes qui ne gagne dans aucune famille, ce n'est
// plus « non démontré », c'est « jamais vu marcher ».
//
// ➜ DONC PAS DE REJET PAR FAMILLE. On ne raffine pas un signal qui
// n'existe dans aucune famille : ce serait donner une apparence de
// finesse à un tri qui n'en a aucune. Le choix reste entier et il est à
// lui : garder le filtre (il coûte peu et il le rassure) ou le lever.
// Ce qui est écarté, c'est la troisième voie — elle n'a pas de base.
// ═══════════════════════════════════════════════════════════════
// LE REGISTRE DES SIGNAUX (05/09/26) — un champ de vérité, un chiffre,
// une date. Ellemine_D : « intègre ce qui est évident d'abord ».
//
// ☠️ POURQUOI CE REGISTRE EXISTE. En deux jours j'ai lu TROIS FOIS un
// champ qui n'existait pas, en le devinant au lieu de lire la fonction :
//   · s.fragile   sur signalFragiliteM4M10V7  (le champ est fragileM4/fragileM10)
//   · s.signal    sur signalM4JugeRecitBttsV7 (le champ est applicable)
//   · s.fragile   à nouveau, dans trois scripts d'affilée
// `undefined` vaut false en silence : le signal paraissait ne jamais se
// déclencher et j'ai failli conclure qu'il ne valait rien. Ce n'est plus
// une étourderie à ce stade, c'est un défaut de structure — d'où cette
// table. Un seul endroit dit, pour chaque signal, QUEL CHAMP porte la
// vérité et CE QU'IL VAUT.
//
// ⚠️ ET LES CHIFFRES AFFICHÉS À L'ÉCRAN ÉTAIENT PÉRIMÉS. Le badge de
// fragilité annonçait « 65 % contre 29 %, n=45, p≈0,05 » ; remesuré sur
// 52 cas le 05/09, le OU donne 52 % contre 44 %, p = 0,592. L'app
// montrait un chiffre faux. Les valeurs ci-dessous sont celles du 05/09
// et remplacent tout ce qui traîne ailleurs.
var SIGNAUX_V7 = [
  { fn: 'signalM4JugeRecitBttsV7', champ: 'applicable', cible: 'BTTS',
    nom: 'M4 dans {Via, Conjunctio, Amissio, Fortuna Minor} → les deux marquent',
    oui: 77, non: 38, n: 52, nOui: 13, p: 0.025, date: '05/09/26',
    origine: 'doctrine JUGE_RECIT d\'Ellemine_D, écrite AVANT toute mesure',
    note: 'le plus fort des signaux mesurés ; il a MONTÉ avec les 11 cas neufs (75 % sur 12 → 77 % sur 13)' },

  { fn: 'signalRecouvrementCampsV7', champ: 'eleve', cible: 'nul',
    nom: 'recouvrement des camps ≥ 3 → nul',
    oui: 26, non: 7, n: 61, nOui: 34, p: 0.092, date: '05/09/26',
    note: 'tient avec les cas neufs (était 30 % / 9 %)' },

  { fn: 'signalFragiliteM4M10V7', champ: 'fragileM4', cible: 'BTTS',
    nom: 'M4 SEULE mobile+ouverte → les deux marquent',
    oui: 63, non: 39, n: 52, nOui: 19, p: 0.150, date: '05/09/26',
    note: 'c\'est M4 SEULE qui porte ; M10 seule va en sens inverse (36 % / 53 %) '
      + 'et le OU des deux s\'annule à 52 % / 44 %, p = 0,592' },

  { fn: 'signalFragiliteM4M10V7', champ: 'applicable', cible: 'BTTS',
    nom: 'M4 OU M10 mobile+ouverte → les deux marquent  [ANCIENNE LECTURE]',
    oui: 52, non: 44, n: 52, nOui: 27, p: 0.592, date: '05/09/26',
    note: 'REMPLACE le « 65 % contre 29 %, n=45, p≈0,05 » affiché jusqu\'ici — périmé' },

  { fn: 'signalM4M10BoucleV7', champ: 'applicable', cible: 'match tranché',
    nom: 'M4 et M10 dans la boucle d\'un camp',
    oui: 84, non: 81, n: 61, nOui: 19, p: 1.000, date: '05/09/26',
    note: 'ne discrimine pas ; et son branchement en tête de cascade ne rapporte rien (42/67 avec comme sans)' },

  { fn: 'signalM15M16BoucleV7', champ: 'applicable', cible: 'match tranché',
    oui: 79, non: 83, n: 61, nOui: 19, p: 0.726, date: '05/09/26' },

  { fn: 'signalAxeCadentInverseV7', champ: 'applicable', cible: 'match tranché',
    oui: 80, non: 88, n: 61, nOui: 45, p: 0.711, date: '05/09/26' }
];

// Lit un signal SANS deviner son champ. Si le champ déclaré n'existe pas
// dans l'objet renvoyé, on le dit tout haut au lieu de renvoyer false.
function lireSignalV7(nomFn, theme) {
  var def = null;
  for (var i = 0; i < SIGNAUX_V7.length; i++) {
    if (SIGNAUX_V7[i].fn === nomFn) { def = SIGNAUX_V7[i]; break; }
  }
  if (!def) { console.warn('⚠️ signal inconnu du registre : ' + nomFn); return null; }
  var fn = (typeof window !== 'undefined') ? window[nomFn] : null;
  if (typeof fn !== 'function') { console.warn('⚠️ fonction absente : ' + nomFn); return null; }
  var o = null;
  try { o = fn(theme); } catch (e) { return null; }
  if (!o || !Object.prototype.hasOwnProperty.call(o, def.champ)) {
    console.warn('⚠️ le champ « ' + def.champ + " » n'existe pas dans le retour de "
      + nomFn + ' — le registre est à corriger, PAS à contourner');
    return null;
  }
  return { actif: !!o[def.champ], brut: o, def: def };
}

// Contrôle d'intégrité : tous les champs déclarés existent-ils vraiment ?
function verifierRegistreSignauxV7(theme) {
  var t = theme;
  if (!t) { try { t = buildThemeFromMothers('via', 'via', 'via', 'via'); } catch (e) { return null; } }
  var manquants = [];
  SIGNAUX_V7.forEach(function (d) {
    var fn = (typeof window !== 'undefined') ? window[d.fn] : null;
    if (typeof fn !== 'function') { manquants.push(d.fn + ' : fonction absente'); return; }
    var o = null; try { o = fn(t); } catch (e) { manquants.push(d.fn + ' : lève ' + e.message); return; }
    if (!o || !Object.prototype.hasOwnProperty.call(o, d.champ)) {
      manquants.push(d.fn + ' : champ « ' + d.champ + ' » absent');
    }
  });
  return { ok: manquants.length === 0, manquants: manquants, nb: SIGNAUX_V7.length };
}

// ═══════════════════════════════════════════════════════════════
// LE REGISTRE DES PISTES (05/09/26) — Ellemine_D : « chaque piste est
// une piste pour une autre piste. mais toi tu détruis les pistes sans
// proposer une piste concrète, juste semer le doute dans les faits. »
//
// Le reproche est fondé et le fichier en porte la preuve : 10 mentions
// « réfuté », 24 « aucun poids sur le verdict », 16 « ne dit rien », 16
// « écarté », 15 « p = 1,000 » — pour 63 fonctions de signal. On a
// beaucoup mieux tué que bâti, et surtout on a tué SANS GARDER LA CARTE.
//
// Une règle morte n'est pas une maison morte. « M3 négative → R7 exclu »
// est réfutée ; M3 n'a jamais été testée sur les buts, ni le BTTS, ni le
// score, ni l'incident — uniquement sur le camp. La réfutation ferme UNE
// PORTE, pas le bâtiment. C'est ce que ce registre enregistre : pour
// chaque piste morte, ce que sa mort N'EXCLUT PAS.
//
// Règle d'usage : on n'efface jamais une ligne. Une piste réfutée reste,
// avec son chiffre et sa date, pour qu'on ne la redécouvre pas dans six
// mois en croyant qu'elle est neuve — et pour que son « non exclu »
// serve de point de départ à la suivante.
var PISTES_V7 = [
  { cle: 'protocole_serre', nom: 'Le protocole R1/R7 réduit aux deux figures qui combattent',
    auteur: 'Ellemine_D, 05/09 — « élagage plus protocole de comparaison R1 et R7 »',
    etat: 'PISTE — NON BRANCHÉE, ET LE SEUL SIGNE DE VIE DE CE CHANTIER',
    chiffre: 'le protocole large somme six termes sur les HUIT figures de chaque boucle. '
      + 'Réduit aux deux figures réellement en combat (R1 contre R7), il tombe juste '
      + '14 fois sur 19 (74 %) là où le protocole large SE TAIT — c\'est-à-dire quand R1 et '
      + 'R7 sont dans la même boucle, soit la moitié des thèmes. Là où le large parle, il '
      + 'fait 10/23 (43 %).',
    piege: 'six tests menés dans ce fil, meilleur p = 0,064 : rien n\'est démontré. Et '
      + 'branché comme override sur les thèmes à même boucle, il fait passer le camp de '
      + '38/56 à 39/56 — quatre gagnés (ConjCaput, RubCarcer, ConjCaput2, '
      + 'CaputCarcCaputPuer) contre trois perdus (Fiorentina, FortMajLaet, CarcCaput). '
      + '+1 sur 56, c\'est du bruit. C\'est pour ça qu\'il n\'est pas branché.',
    pourquoiCEstCredible: 'le domaine où il fonctionne est exactement celui où l\'autre '
      + 'renonce, et la raison est doctrinale : comparer deux AGRÉGATS de boucles conflue ce '
      + 'qui ne se compare pas, comparer deux FIGURES de la même boucle compare comparable. '
      + 'L\'hypothèse n\'a pas été fabriquée après coup pour sauver le protocole — elle sort '
      + 'de l\'élagage demandé.',
    seuil: '25 rencontres À MÊME BOUCLE, annoncées avant coup d\'envoi, avec le camp de '
      + 'protocoleSerreV7 écrit à côté du verdict. En dessous de 20 sur 25, la piste meurt.',
    suite: 'protocoleSerreV7(theme) rend figR1, figR7, scoreR1, scoreR7, ecart, memeBoucle, '
      + 'dit et domainePorteur. Rien ne le branche.' },

  { cle: 'protocole_duels_x3', nom: 'Les seize duels du protocole ne sont qu\'un facteur 3',
    auteur: 'calcul, 05/09', etat: 'ACQUISE — DÉFAUT EXACT, PAS UNE PISTE',
    chiffre: '4608 thèmes testés, 4608 fois l\'égalité écart_final = 3 × écart_brut. '
      + 'Démonstration : les 16 duels couvrent les 16 figures une fois chacune, donc la '
      + 'somme des (scoreA − scoreB) vaut exactement (s1brut − s7brut).',
    consequence: 'la moitié du code du protocole — construction des paires, dédoublonnage '
      + 'par clé triée, double calcul de score — produit une multiplication par trois. '
      + 'Elle n\'ajoute aucune information, seulement une échelle. Tout classement, tout '
      + 'seuil ou toute corrélation bâtis sur l\'écart final valent exactement ce qu\'ils '
      + 'valent sur l\'écart brut.',
    suite: 'ne pas supprimer le code sans vérifier qui lit encore duel[] pour l\'affichage ; '
      + 'mais ne plus jamais traiter les duels comme un signal indépendant.' },

  { cle: 'populus_zero', nom: 'Un thème SANS AUCUN Populus annonce plus de buts',
    auteur: 'calcul du 05/09, en creusant « Populus en M10 » demandé par Ellemine_D',
    etat: 'BRANCHÉE AU VERDICT LE 05/09 (famille plus/moins de 2,5 buts) — '
      + 'ET TOUJOURS NON DÉMONTRÉE. Les deux à la fois : elle décide, et elle reste à prouver.',
    branchement: 'mesuré avant, comme le nul l\'avait été le 29/08 : moteur seul 26/48 (54 %), '
      + 'règle idiote « toujours plus de 2,5 » 31/48, moteur + zéro Populus 34/48 (71 %). '
      + '10 gagnés, 2 perdus (Roma 2 buts et CarcAlbus 0-0, deux thèmes à zéro Populus restés '
      + 'muets). Fisher 2x2 p = 0,0137, binomial sur les 12 discordants p = 0,039. '
      + 'Réversible : BRANCHES_V7.populus_volume.actif = false.',
    chiffre: 'archive, stratifié par le rang des mères : 0 Populus = 5,57 buts contre '
      + '3,00 pour au moins un, écart +2,57, p unilatéral = 0,0027 (permutation À '
      + 'L\'INTÉRIEUR de chaque strate de rang, 200 000 tirages).',
    robustesse: 'survit au retrait des gros scores, contrairement à sa version non '
      + 'stratifiée : sans les 3 plus gros p = 0,0333, sans les 5 plus gros p = 0,0414. '
      + 'Les médianes disent la même chose — rang 3 : 5,0 contre 3,0 ; rang 4 : 6,5 '
      + 'contre 1,0 — donc ce ne sont pas quelques matchs à forte marque.',
    controles: 'ce n\'est PAS la règle M9 déguisée (Populus n\'est en M9 que dans 3 cas '
      + 'sur 48 ; en retirant M9 du compte, rho reste −0,246, p = 0,0465). Ce n\'est PAS '
      + 'un effet de provenance (les 21 « zéro » et les 27 autres viennent tous de '
      + 'CAS_REFERENCE_V7). Et surtout ce n\'est PAS circulaire : LE MOTEUR NE PRÉDIT PAS '
      + 'CET ÉCART — à rang 3 il annonce +0,18 but, à rang 4 il annonce −0,05, quand '
      + 'l\'archive donne +2,22 et +4,67. Si la règle tient, le fichier lui manque une loi.',
    piege: 'le découpage « zéro contre au moins un » a été choisi APRÈS avoir vu que la '
      + 'dose du moteur ne se retrouvait pas dans l\'archive (au-delà de 1 Populus la '
      + 'pente s\'inverse, rho = +0,377). C\'est la faiblesse qui reste, et aucune '
      + 'correction ne la répare : seul un test hors échantillon la lèvera. Une douzaine '
      + 'de tests ont été menés dans ce fil ; à 12, Bonferroni laisse 0,0027 × 12 = 0,032.',
    seuil: '30 rencontres annoncées AVANT le coup d\'envoi, dont au moins 10 sans aucun '
      + 'Populus et 10 avec, puis le même test stratifié. En dessous, on ne saura pas.',
    utilisable: 'la condition n\'est pas rare : 25004 thèmes sur 65536, soit 38 %.',
    suite: 'lecturePopulusV7(theme) rend rang, compte et le drapeau zeroPopulus ; le verdict '
      + 'expose plus25 {annonce, source, contreditLeMoteur} ; annoncerMatchV7 l\'écrit dans '
      + 'chaque annonce prospective et resultatMatchV7 le note. Le seuil des 30 rencontres '
      + 'reste le juge — le branchement ne le remplace pas, il rend seulement la règle '
      + 'mesurable en conditions réelles au lieu de la laisser dormir.' },

  { cle: 'parite_m15', nom: 'M15 est toujours paire — huit figures possibles, pas seize',
    auteur: 'calcul, 05/09', etat: 'ACQUISE — LOI EXACTE, PAS UNE PISTE',
    chiffre: '65536/65536, aucune exception ; cause démontrée, pas mesurée : '
      + 'la parité s\'additionne sous combine, et les filles M5–M8 étant la transposée '
      + 'des mères M1–M4, les deux moitiés de M15 = M1⊕…⊕M8 portent la même parité et s\'annulent',
    consequence: 'toute règle « M15 est X » a un taux de base de 1/8, pas 1/16. '
      + 'Deux mesures du fichier valaient le double du taux supposé : « le Juge est Via ou '
      + 'Populus » 25 % et non 12,5 %, « M15 est une des quatre symétriques » 50 % et non 25 %.',
    suite: 'aucune — c\'est établi. Voir LOIS_PARITE_V7 et verifierLoisPariteV7(true).' },

  { cle: 'faisceau_elague', nom: 'Faisceau du nul restreint aux signaux dont le taux ≠ 50 %',
    auteur: 'calcul, 05/09', etat: 'PRÉ-ENREGISTRÉE — NON DÉMONTRÉE',
    chiffre: 'les sept signaux vont de 7,42 % (R7 binôme de R1) à 50,00 % (même boucle, '
      + 'symétriques), mesurés exhaustivement sur 65536 thèmes. Le compte n/7 les additionne '
      + 'à poids égal.',
    nonExclu: 'sur les 56 cas d\'archive : compte actuel p = 0,177 ; compte restreint aux cinq '
      + 'signaux gardés p = 0,073 ; rareté en bits sur ces cinq p = 0,053. AUCUN n\'atteint le '
      + 'seuil. Le critère d\'élagage a été décidé sur le calcul exhaustif seul, sans regarder '
      + 'un résultat — et il retire `boucle` qui aidait (+16 pts) autant que `fige` qui nuisait '
      + '(−13 pts), donc le gain n\'est pas un réglage.',
    piege: 'les variantes « sans fige » et « fige à l\'envers » ont été essayées APRÈS avoir vu '
      + 'que fige avait le mauvais signe. Leurs p (0,063 et 0,019) sont des artefacts de '
      + 'sélection et ne comptent pas. Elles sont notées ici pour qu\'on ne les ressorte pas '
      + 'plus tard comme des preuves.',
    seuil: 'annoncer nElague AVANT le match sur 15 rencontres, puis comparer à n/7 sur les '
      + 'mêmes rencontres. Sans ça, on ne saura pas trancher.',
    suite: 'faisceauNulV7 publie déjà nElague et bits ; le verdict, lui, continue de s\'appuyer '
      + 'sur n/7 tant que rien n\'est démontré.' },

  { cle: 'm9_buts', nom: 'M9 (= M1 ⊕ M2) annonce le volume de buts',
    auteur: 'trouvée au balayage des 13 maisons, 04/09', etat: 'VIVANTE',
    chiffre: '3/3 hors échantillon · 26/28 en échantillon (sans valeur) · p ≈ 0,14 pour le 3/3 seul',
    seuil: '10 annonces fermes hors échantillon avant tout branchement',
    renforce: '05/09 — p = 0,0019 en permutation par match sur les buts marqués, SURVIT à Bonferroni '
      + '(0,011 sur six tests) ; et Ellemine_D en a donné l\'explication APRÈS la mesure : '
      + 'M9 = M1 ⊕ M2 = initial + ressource = le rythme du match. Une doctrine qui explique une '
      + 'mesure déjà faite ne peut pas l\'avoir orientée.',
    suite: 'la tester sur des tirages À LA MAIN — les 11 cas de contrôle sont des thèmes de hachage' },

  { cle: 'triplet_defensif', nom: 'Triplet défensif : chef ⊕ M4 ⊕ M10 (= chef ⊕ M3)',
    auteur: 'Ellemine_D, 05/09', etat: 'À SUIVRE — RÉSULTAT À L\'ENVERS DE SON NOM',
    chiffre: 'prédit les buts MARQUÉS (p = 0,034) et non les encaissés (p = 0,495) · '
      + 'ni le chef seul (p = 0,852) ni M3 seule ne disent rien : c\'est leur combinaison',
    nonExclu: 'la loi M4 ⊕ M10 = M3 réduit le triplet à « chef ⊕ M3 », vérifié 65536/65536. '
      + 'Le modèle d\'Ellemine_D est donc structurellement exact ; seul le RÔLE qu\'il lui donne '
      + '(défensif) est démenti par la mesure.',
    suite: 'ne survit pas à la correction pour tests multiples (0,21) — accumuler' },

  { cle: 'laetitia_m2', nom: 'Laetitia en M2 → M1 gagne',
    auteur: 'Ellemine_D, 05/09', etat: 'À INSCRIRE D\'AVANCE',
    chiffre: '100 % (3/3) contre 42,9 %, p = 0,090 · contrôle positionnel PASSÉ : Laetitia en M8 '
      + '(ressource de M7) ne donne rien (50 % contre 45 %, p = 1,000), Laetitia n\'importe où non plus '
      + '(50 % contre 42 %, p = 0,606)',
    nonExclu: 'n = 3. Mais M2 est la ressource de M1 et M9 = M1 ⊕ M2 — la maison touche directement '
      + 'celle du rythme, la seule qui ait survécu à Bonferroni.',
    suite: 'annoncer d\'avance sur les prochains matchs où M2 est Laetitia (environ 1 tirage sur 16)' },

  { cle: 'epargne_agresseur', nom: 'L\'agresseur épargne quand sa victime sert dans son camp',
    auteur: 'Ellemine_D, 05/09', etat: 'TESTÉ, NON CONCLUANT — ET PEUT-ÊTRE MAL COMPRIS',
    chiffre: '≥1 maison épargnée par son chef : 48,7 % contre 36,7 %, p = 0,236 (n=118 observations)',
    nonExclu: 'Puer et Albus ne partagent ni élément, ni planète, ni binôme, ni boucle (A contre B). '
      + 'J\'ai donc lu « camp » comme la MAISON occupée, faute de mieux. Si ce n\'est pas ça, le test '
      + 'ne teste pas la règle.',
    suite: 'faire préciser ce qui met une FIGURE dans le camp d\'une autre, puis refaire' },

  { cle: 'antagonistes_orientes', nom: 'Les tables antagonistes et binômes ne sont PAS symétriques',
    auteur: 'découvert le 05/09 en testant l\'exemple d\'Ellemine_D', etat: 'FAIT STRUCTUREL',
    chiffre: '16 figures sur 16. SENS RECTIFIÉ par Ellemine_D le 05/09 : ANTAGONISTES_V7[X] nomme '
      + 'l\'AGRESSEUR de X. A[albus] = puer se lit « Puer agresse Albus », pas l\'inverse.',
    nonExclu: 'AUCUN signal du fichier ne tient compte de l\'orientation. Tous lisent ANT[x] === y '
      + 'sans jamais tester ANT[y] === x. La moitié des relations est donc invisible au moteur.',
    suite: 'audit des signaux qui lisent ANTAGONISTES_V7 et BINOMES_V7 — chantier ouvert' },

  { cle: 'm3_r7', nom: 'M3 négative → R7 exclu',
    auteur: 'trouvée le 04/09 au matin', etat: 'RÉFUTÉE le 04/09 au soir',
    chiffre: 'archive 1/14 = 7 % · hors échantillon 3 R7 sur 5 = 60 %',
    nonExclu: 'PORTE REFERMÉE le 05/09. M3 est passée au balayage systématique sur SIX cibles : '
      + 'buts p = 0,43 · incident p = 0,45 · dominance corners p = 0,73 · nul p = 0,86 · '
      + 'BTTS p = 0,92 · R1 p = 0,92. Rien nulle part.',
    suite: 'aucune. Piste explicable : M4 ⊕ M10 = M3, or M4 porte et M10 non — M3 mélange '
      + 'un porteur et un muet, ce qui pourrait suffire à la rendre sourde.' },

  { cle: 'm12_m6_buts', nom: 'M12 et M6 sur les buts',
    auteur: 'apparues 2e et 3e au balayage du 04/09, jamais suivies', etat: 'À SUIVRE',
    chiffre: 'M12 p = 0,055 · M6 p = 0,067 · Puella en M12 : 5,43 buts (n=7) · Caput Draconis en M6 : 5,80 (n=5)',
    suite: 'même protocole que M9 : composer les listes, puis INSCRIRE AVANT sur les prochains matchs' },

  { cle: 'juge_outsider', nom: 'Juge « outsider » contre défense « dominante »',
    auteur: 'proposée par Claude le 04/09 après Lyon et Al-Ahli', etat: 'MORTE',
    chiffre: 'R1 5/9 en conflit contre 22/50 ailleurs · p = 0,719',
    nonExclu: 'testée sur le CAMP seulement. Le renversement en cours de match — '
      + 'mener puis perdre — n\'a pas été testé, faute de scores de mi-temps en nombre.',
    suite: 'reprendre quand l\'archive aura 20 mi-temps saisies' },

  { cle: 'corners_total', nom: 'Le total de corners annoncé',
    auteur: 'sortie historique du moteur', etat: 'SANS INFORMATION',
    chiffre: 'n=11 · Spearman 0,10 · erreur absolue 6,00 pour une moyenne réelle de 10,7',
    nonExclu: 'PORTE REFERMÉE le 05/09. La dominance a été testée sur la sortie cornersDominant '
      + 'que le moteur produit déjà : 3/9, PIRE que le hasard (il dit M1 cinq fois, le réel est M1 trois fois).',
    suite: 'aucune sur les corners tant que l\'archive n\'en aura pas trente' },

  { cle: 'm4m10_cascade', nom: 'Signal M4/M10 en tête de la cascade du verdict',
    auteur: 'branché le 03/09 sur demande d\'Ellemine_D', etat: 'GAIN NUL',
    chiffre: 'AVEC 42/67 · SANS 42/67 · (+1 sur l\'archive d\'ajustement, −1 hors échantillon)',
    nonExclu: 'le signal reste à 9/13 quand il tranche sur l\'archive. C\'est sa PLACE EN TÊTE '
      + 'qui ne rapporte rien, pas nécessairement sa lecture.',
    suite: 'essayer en dernier recours plutôt qu\'en tête, et mesurer' },

  { cle: 'validite', nom: 'Le filtre de validité du thème',
    auteur: 'doctrine ancienne', etat: 'LEVÉ le 04/09',
    chiffre: 'aucune famille gagnée sur 58 cas · camp 64 % valides contre 69 % rejetés · p = 0,732',
    nonExclu: 'la validité n\'a jamais été testée sur la seule question qu\'elle prétend trancher : '
      + 'entre DEUX tirages du MÊME match, lequel croire. Le registre des paires est à 3 informatives sur 9.',
    suite: 'accumuler des paires, viser 6 informatives' },

  { cle: 'incident_camp', nom: 'Le camp qui subit l\'incident',
    auteur: 'doctrine ancienne', etat: 'NON DÉMONTRÉ',
    chiffre: '8/12 = 67 % · « toujours M1 » ferait 9/12 = 75 % · un seul cas d\'écart',
    nonExclu: 'la PRÉSENCE de l\'incident et son CAMP sont deux questions distinctes. '
      + 'La présence n\'a pas été réfutée.',
    suite: 'accumuler ; ne pas câbler « toujours M1 », n = 12' },

  { cle: 'fragilite_m4m10', nom: 'Fragilité M4/M10 → BTTS',
    auteur: 'Ellemine_D, 03/09', etat: 'RETESTÉE le 05/09 — LE COUPLE NE PORTE PAS',
    chiffre: '52 cas · OU 51,9 % contre 44,0 % (p = 0,592) · ET 50,0 % contre 47,8 % (p = 1,000)',
    nonExclu: 'M4 SEULE donne 63,2 % contre 39,4 % (p = 0,150) pendant que M10 SEULE va en sens '
      + 'inverse (35,7 % contre 52,6 %). Les apparier annule le signal. Et deux autres mesures '
      + 'faites pour d\'autres raisons disent la même asymétrie : M10 est dernière des 13 maisons '
      + 'sur les buts (p = 0,958), et la doctrine du M4 d\'Ellemine_D ne marche qu\'en M4 (p = 0,643 en M10).',
    suite: 'lire les signaux défensifs sur M4 SEULE ; M4 seul n\'a jamais été testé hors '
      + 'échantillon (n = 19, un seul cas dans les 11 du soir) — accumuler avant de recâbler' },

  { cle: 'm4_doctrine', nom: 'Albus/Carcer en M4 tiennent les buts, Via les ouvre',
    auteur: 'Ellemine_D, 04/09', etat: 'DIRECTION JUSTE, SEUIL NON ATTEINT',
    chiffre: 'Albus/Carcer 2,50 buts contre 3,49 (p = 0,255) · Via 4,17 contre 3,21 (p = 0,321) · '
      + 'contrôle : les mêmes figures en M10 ne font rien (p = 0,958)',
    nonExclu: 'les deux moitiés vont dans le bon sens et le contrôle positionnel tient. '
      + 'Seul l\'effectif manque : n=8 et n=6.',
    suite: 'accumuler des matchs ; c\'est une des rares pistes où le CONTRÔLE a déjà réussi' }
];

// Ce que le registre sait dire de lui-même.
function bilanPistesV7() {
  var par = {};
  PISTES_V7.forEach(function (p) { par[p.etat] = (par[p.etat] || 0) + 1; });
  return {
    total: PISTES_V7.length, parEtat: par,
    vivantes: PISTES_V7.filter(function (p) { return p.etat === 'VIVANTE' || p.etat === 'À SUIVRE' || p.etat === 'À RETESTER'; }),
    // Une piste morte qui laisse une porte ouverte n'est pas une impasse :
    // c'est là que se trouve le travail suivant.
    portesOuvertes: PISTES_V7.filter(function (p) { return !!p.nonExclu; })
      .map(function (p) { return { piste: p.nom, ouvre: p.nonExclu, suite: p.suite }; })
  };
}

function validiteParFamilleV7() { return memoArchiveV7('validiteParFamilleV7', _validiteParFamilleV7); }
function _validiteParFamilleV7() {
  var cas = [];
  try { cas = tousCasBancV7() || []; } catch (e) { return null; }
  var F = {}, ordre = [];
  function add(fam, valide, juste) {
    if (juste === null || juste === undefined) return;
    if (!F[fam]) { F[fam] = { val: [0, 0], rej: [0, 0] }; ordre.push(fam); }
    F[fam][valide ? 'val' : 'rej'][juste ? 0 : 1] += 1;
  }
  cas.forEach(function (c) {
    var t, v;
    try { t = buildThemeFromMothers(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    // ⚠️ sousSeuilValiditeV7 et NON themeRejeteV7 : depuis que le rejet est
    // levé (04/09/26) la porte renvoie null, et lire la porte ici ferait
    // passer TOUS les thèmes pour valides — le banc mesurerait le drapeau
    // au lieu de mesurer le critère qui a servi à le lever.
    var rj = null;
    try { rj = sousSeuilValiditeV7(t); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    var valide = !(rj && rj.rejete);
    try { v = avecFormatV7(c.format || formatMatchV7(), function () { return getVerdictAfficheReel(t); }); }
    catch (e) { return; }
    var dit = v.nulActif ? 'nul' : (v.winner === 'M1' ? 'R1' : 'R7');
    if (c.camp) {
      add('camp (vainqueur/nul)', valide, dit === c.camp);
      add('le nul (oui/non)', valide, (dit === 'nul') === (c.camp === 'nul'));
    }
    if (typeof c.btts === 'boolean' && typeof v.btts === 'boolean') {
      add('les deux marquent', valide, v.btts === c.btts);
    }
    if (c.score) {
      add('score exact', valide, String(v.scoreMain) === String(c.score));
      var m = String(c.score).match(/^(\d+)-(\d+)$/), mm = String(v.scoreMain).match(/^(\d+)-(\d+)$/);
      if (m && mm) {
        add('match serré (écart ≤ 1)', valide,
          (Math.abs(+m[1] - +m[2]) <= 1) === (Math.abs(+mm[1] - +mm[2]) <= 1));
      }
    }
    if (typeof c.incident === 'boolean') {
      var sg = null;
      try { sg = sommesAxesIncidentV7(t); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
      if (sg) add('incident (somme d\'axes)', valide, sg.signal === c.incident);
    }
  });
  var lignes = [], pencheRejet = 0, lisibles = 0;
  ordre.forEach(function (k) {
    var o = F[k], nv = o.val[0] + o.val[1], nr = o.rej[0] + o.rej[1];
    if (!nv || !nr) { lignes.push({ nom: k, val: o.val, nVal: nv, rej: o.rej, nRej: nr, lisible: false }); return; }
    lisibles += 1;
    var tv = o.val[0] / nv, tr = o.rej[0] / nr;
    if (tr >= tv) pencheRejet += 1;
    lignes.push({ nom: k, val: o.val, nVal: nv, rej: o.rej, nRej: nr, lisible: true,
      tauxVal: tv, tauxRej: tr, ecart: tv - tr, p: fisherExactV7(o.val[0], o.val[1], o.rej[0], o.rej[1]) });
  });
  return { lignes: lignes, lisibles: lisibles, pencheRejet: pencheRejet };
}

// Fisher exact bilatéral sur un tableau 2×2, en log-factorielles pour
// que les grands effectifs ne débordent pas.
function fisherExactV7(a, b, c, d) {
  var LF = [0];
  function lf(n) { for (var i = LF.length; i <= n; i++) LF[i] = LF[i - 1] + Math.log(i); return LF[n]; }
  var n = a + b + c + d;
  if (!n) return 1;
  lf(n);
  function pr(x, y, z, w) {
    return Math.exp(lf(x + y) + lf(z + w) + lf(x + z) + lf(y + w) - lf(n) - lf(x) - lf(y) - lf(z) - lf(w));
  }
  var p0 = pr(a, b, c, d), tot = 0;
  var r1 = a + b, r2 = c + d, c1 = a + c;
  var lo = Math.max(0, c1 - r2), hi = Math.min(r1, c1);
  for (var i = lo; i <= hi; i++) {
    var pi = pr(i, r1 - i, c1 - i, r2 - c1 + i);
    if (pi <= p0 * (1 + 1e-9)) tot += pi;
  }
  return Math.min(1, tot);
}

// ═══════════════════════════════════════════════════════════════
// LE GARDE-FOU DE L'ARCHIVE (29/08/26, révision d'ensemble)
//
// Toute l'archive écrit le score dans l'ordre R1-R7 : le premier nombre
// est celui du camp 1, jamais celui du vainqueur. J'ai saisi les deux
// cas du 29/08 dans l'autre sens — « 3-2 » pour un match gagné 3-2 par
// R7 — et rien ne l'a signalé. Le camp déclaré disait R7, le score
// disait R1, et les deux familles de moteurs lisaient chacune la sienne.
//
// Une contradiction pareille ne se voit pas à l'œil dans 35 lignes.
// Elle se voit ici : coherenceArchiveV7 relit l'archive et signale tout
// cas dont le score contredit le camp. Le banc l'affiche en rouge.
function coherenceArchiveV7() {
  var soucis = [];
  var cas = [];
  try { cas = tousCasBancV7() || []; } catch (e) { return { soucis: [], total: 0 }; }
  cas.forEach(function (c) {
    if (!c || !c.camp || !c.score) return;
    var m = String(c.score).match(/^(\d+)\s*-\s*(\d+)$/);
    if (!m) return;
    var a = +m[1], b = +m[2];
    var implique = a === b ? 'nul' : (a > b ? 'R1' : 'R7');
    var declare = c.camp === 'M1' ? 'R1' : c.camp === 'M7' ? 'R7' : c.camp;
    if (implique !== declare) {
      soucis.push({ nom: c.nom, score: c.score, implique: implique, declare: declare });
    }
  });
  return { soucis: soucis, total: cas.length };
}

// ═══════════════════════════════════════════════════════════════
// LE GEL DES PRÉDICTIONS (30/08/26) — le seul chantier qui reste
//
// Tout ce que ce fichier mesure est mesuré SUR L'ARCHIVE : on rejoue les
// moteurs d'aujourd'hui sur des matchs dont les règles ont été taillées.
// La porte du nul a été corrigée deux fois après des ratés de cette même
// archive ; forcément qu'elle y fait 42/48. Ça décrit le passé sans se
// contredire, ça ne prouve pas qu'on prédit.
//
// Le journal, lui, compare le verdict GELÉ avant le match au score saisi
// après. Rien ne peut le flatter. Il est vide depuis le premier jour —
// non pas parce que le mécanisme manque (saveManuel gèle déjà tout ce
// qu'il faut) mais parce que RIEN NE LE RAPPELLE au moment où il
// faudrait le faire, c'est-à-dire quand le thème vient de sortir.
//
// D'où ces deux fonctions et la bannière qu'elles alimentent : savoir si
// le thème affiché est gelé, et savoir combien de prédictions gelées
// attendent encore leur score. Aucune n'invente de mesure ; elles
// rendent seulement visible le geste qui manque.
function etatGelV7(theme, team1, team2) {
  var out = { gelee: false, entry: null, enAttente: 0 };
  if (!theme) return out;
  var list = [];
  try { list = getSavedList() || []; } catch (e) { return out; }
  var fp = null;
  try { fp = themeFingerprint(team1, team2, theme); } catch (e) { fp = null; }
  list.forEach(function (e) {
    if (!e) return;
    if (e.verdict && !e.realScore) out.enAttente += 1;
    if (!out.entry && fp) {
      var f2 = null;
      try { f2 = themeFingerprint(e.team1, e.team2, e.theme); } catch (x) { f2 = null; }
      if (f2 && f2 === fp) { out.gelee = true; out.entry = e; }
    }
  });
  return out;
}

// Les prédictions gelées qui n'ont pas encore de score : c'est là que le
// journal se perd. Un thème enregistré et jamais complété ne compte pas.


function journalPredictionsV7() {
  var list = [];
  try { list = getSavedList() || []; } catch (e) { return null; }
  var lignes = [], campJ = 0, campN = 0, scoreJ = 0, scoreN = 0, nulJ = 0, nulN = 0;
  list.forEach(function (e) {
    if (!e || !e.verdict || !e.realScore) return;
    var m = String(e.realScore).match(/(\d+)\s*-\s*(\d+)/);
    if (!m) return;
    var rA = +m[1], rB = +m[2];
    // ─── LE VAINQUEUR SAISI PASSE AVANT LE SCORE (29/08/26) ───
    // Le journal déduisait le camp réel du seul score et ignorait le
    // champ « Vainqueur réel » du panneau « Résultat réel », que
    // l'application collecte pourtant. Quand les deux se contredisent —
    // un score noté vainqueur-en-premier, par exemple — le journal
    // comptait un raté qui n'en était pas un. Ce que tu as déclaré
    // toi-même l'emporte ; le score ne sert que si tu n'as rien déclaré.
    var reelCamp;
    if (e.realWinner === 'M1' || e.realWinner === 'M7' || e.realWinner === 'Nul') {
      reelCamp = e.realWinner === 'Nul' ? 'nul' : e.realWinner;
    } else {
      reelCamp = rA === rB ? 'nul' : (rA > rB ? 'M1' : 'M7');
    }
    var ditCamp = e.verdict.winner === 'Nul' ? 'nul' : e.verdict.winner;
    var ditScore = e.verdict.scoreMain || '';
    campN++; if (ditCamp === reelCamp) campJ++;
    if (reelCamp === 'nul' || ditCamp === 'nul') {
      nulN++; if ((ditCamp === 'nul') === (reelCamp === 'nul')) nulJ++;
    }
    var p = String(ditScore).match(/^(\d+)-(\d+)$/);
    if (p) { scoreN++; if (+p[1] === rA && +p[2] === rB) scoreJ++; }
    lignes.push({
      quand: (e.savedAt || '').slice(0, 10),
      equipes: (e.team1 || '?') + ' — ' + (e.team2 || '?'),
      ditCamp: ditCamp, ditScore: ditScore,
      reelCamp: reelCamp, reelScore: e.realScore,
      campJuste: ditCamp === reelCamp,
      scoreJuste: !!(p && +p[1] === rA && +p[2] === rB)
    });
  });
  return { lignes: lignes, campJuste: campJ, campTotal: campN,
    scoreJuste: scoreJ, scoreTotal: scoreN, nulJuste: nulJ, nulTotal: nulN };
}

function tousCasBancV7() {
  var sup = [];
  try { sup = casSauvegardesV7(); } catch (e) { sup = []; }
  return CAS_REFERENCE_V7.concat(sup);
}

// Signature des cas saisis : sert à invalider le cache quand tu ajoutes
// ou modifies un score, sans avoir à recharger la page.
function signatureCasV7() {
  try {
    return casSauvegardesV7().map(function (c) {
      return c.meres.join('|') + '=' + c.score;
    }).join(';');
  } catch (e) { return ''; }
}

// ═══════════════════════════════════════════════════════════════
// LE MÉMO D'ARCHIVE (04/09/26) — ce qui rendait le système lent
//
// bancMoteursV7 était mémoïsé depuis longtemps. Ses trois voisins ne
// l'étaient pas : balayageSeparationV7, arbitrageMoteursV7 et
// validiteParFamilleV7 rejouaient les 58 cas de l'archive À CHAQUE
// lancement de thème, alors qu'aucun des trois ne regarde le thème
// courant.
//
// PROFILÉ SUR 10 LANCEMENTS (04/09/26, avant correction) :
//     launchTheme .............. 590 ms
//       renderBancPanel ........ 473 ms   ← 80 % du temps
//         balayageSeparationV7 . 179 ms
//         validiteParFamilleV7 . 163 ms
//         arbitrageMoteursV7 ....  95 ms
//     getVerdictAfficheReel appelé 132 fois par lancement
//     trouverFigV7 appelé      76 798 fois par lancement
// Ce n'étaient pas les 2 Mo du fichier : le chargement, lui, coûte
// 890 ms UNE FOIS. C'était 437 ms de recalcul d'une archive qui ne
// change que lorsqu'on lui ajoute un cas.
//
// LA CLÉ DU MÉMO PORTE TROIS CHOSES, et il faut les trois :
//   · la signature des cas saisis — un score corrigé doit invalider ;
//   · le format du match — les moteurs lisent des seuils différents en
//     e-sport, le même calcul ne donne pas le même résultat ;
//   · la figure du jour — depuis le 04/09 la validité en dépend, donc
//     validiteParFamilleV7 change de valeur à minuit. Sans elle, le
//     mémo servirait demain un chiffre calculé hier.
// Oublier l'un des trois ne casse rien de visible : ça sert simplement
// un résultat périmé. C'est pour ça qu'ils sont énumérés ici.
var _memoArchiveV7 = {};
function cleMemoArchiveV7() {
  var sig = '', fmt = '', jour = '';
  try { sig = signatureCasV7(); } catch (e) { sig = '?'; }
  try { fmt = formatMatchV7(); } catch (e) { fmt = '?'; }
  try { jour = figureDuJour(); } catch (e) { jour = '?'; }
  return sig + '§' + fmt + '§' + jour;
}
function memoArchiveV7(nom, calcul) {
  var cle = nom + '§' + cleMemoArchiveV7();
  if (Object.prototype.hasOwnProperty.call(_memoArchiveV7, cle)) return _memoArchiveV7[cle];
  var v = calcul();
  _memoArchiveV7[cle] = v;
  return v;
}
// À appeler si un jour un calcul d'archive devient dépendant d'autre
// chose que les trois clés ci-dessus.
function viderMemoArchiveV7() { _memoArchiveV7 = {}; }

// Rejoue tous les moteurs sur tous les cas. Mémoïsé : le banc ne dépend
// pas du thème courant, seulement du code.
var _bancCacheV7 = null;
var _bancSignatureV7 = null;
function bancMoteursV7(force) {
  var sig = signatureCasV7();
  if (_bancCacheV7 && !force && sig === _bancSignatureV7) return _bancCacheV7;
  _bancSignatureV7 = sig;
  var CAS = tousCasBancV7();
  var themes = CAS.map(function (c) {
    var t = null;
    try { t = buildThemeFromMothers(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); }
    catch (e) { t = null; }
    return t;
  });
  // Notation À TOLÉRANCE, pour les grandeurs numériques (les corners).
  // Un moteur est juste sur un cas si l'écart au réel ne dépasse pas
  // BANC_TOLERANCE_CORNERS_V7.
  function passeNum(liste, attendu, tolerance) {
    return liste.map(function (m) {
      var juste = 0, total = 0, ecartTotal = 0;
      var details = CAS.map(function (c, i) {
        var reel = attendu(c);
        if (reel === null || reel === undefined || !themes[i]) {
          return { cas: c.nom, dit: null, reel: null, compte: false, ok: null };
        }
        var v = null;
        try { v = avecFormatV7(c.esport ? 'esport' : 'reel', function () { return m.verdict(themes[i]); }); }
        catch (e) { v = null; }
        var dit = v && v.n != null ? v.n : null;
        if (dit === null) {
          return { cas: c.nom, dit: null, reel: reel, compte: false, ok: null };
        }
        total++;
        var ecart = Math.abs(dit - reel);
        ecartTotal += ecart;
        var ok = ecart <= tolerance;
        if (ok) juste++;
        return { cas: c.nom, dit: dit, reel: reel, compte: true, ok: ok, ecart: ecart };
      });
      return { cle: m.cle, nom: m.nom, icone: m.icone, teinte: m.teinte,
        juste: juste, total: total, details: details,
        ecartMoyen: total ? Math.round(ecartTotal * 10 / total) / 10 : null };
    });
  }

  // ─── L'ABSTENTION N'EST PLUS UNE ERREUR (28/08/26) ───
  // Avant, un moteur qui ne se prononçait pas comptait comme s'étant
  // trompé. C'était supportable tant que tous parlaient presque toujours ;
  // ça devient absurde avec une règle conditionnelle comme « Carcer en
  // M10 », qui ne se prononce que sur 3 % des thèmes et aurait affiché
  // 0/8 quoi qu'elle dise.
  // Désormais : le score porte sur les cas où le moteur PARLE, et le
  // nombre d'abstentions est affiché à côté. Un moteur muet n'a donc pas
  // tort — mais il ne se cache pas non plus : on voit sa couverture.
  function passe(liste, champ, attendu) {
    return liste.map(function (m) {
      var juste = 0, total = 0, abstentions = 0;
      var details = CAS.map(function (c, i) {
        var reel = attendu(c);
        if (reel === null || reel === undefined || !themes[i]) {
          return { cas: c.nom, dit: null, reel: null, compte: false, ok: null };
        }
        var v = null;
        try { v = avecFormatV7(c.esport ? 'esport' : 'reel', function () { return m.verdict(themes[i]); }); }
        catch (e) { v = null; }
        var dit = v ? v[champ] : null;
        // ─── CORRIGÉ LE 28/08/26 ───
        // Cette ligne transformait un moteur MUET (oui = null) en « non ».
        // Un moteur qui s'abstient était donc noté comme s'étant trompé
        // chaque fois que la réponse réelle était « oui » — l'inverse
        // exact de la règle posée le matin même pour les autres familles.
        // Trouvé sur la famille mi-temps : le signal de première période,
        // muet sur son unique cas, s'affichait 0/1.
        if (champ === 'oui' && v) dit = (typeof v.oui === 'boolean') ? v.oui : null;
        if (dit === null || dit === undefined) {
          abstentions++;
          return { cas: c.nom, dit: null, reel: reel, compte: false, ok: null, abstenu: true };
        }
        total++;
        var ok = dit === reel;
        if (ok) juste++;
        return { cas: c.nom, dit: dit, reel: reel, compte: true, ok: ok };
      });
      return { cle: m.cle, nom: m.nom, icone: m.icone, teinte: m.teinte,
        juste: juste, total: total, abstentions: abstentions, details: details };
    });
  }
  // Le moteur « ⚑ VOTE DES MOTEURS » est retiré du banc le 01/09/26 avec
  // le vote lui-même : il n'y a plus de votants à compter.
  _bancCacheV7 = {
    camp: passe(MOTEURS_V7, 'camp', function (c) {
      return (c.camp === 'R1' || c.camp === 'R7') ? c.camp : null;
    }),
    btts: passe(MOTEURS_BTTS_V7, 'oui', function (c) {
      return (typeof c.btts === 'boolean') ? c.btts : null;
    }),
    incident: passe(MOTEURS_INCIDENT_V7, 'oui', function (c) {
      return (typeof c.incident === 'boolean') ? c.incident : null;
    }),
    incidentCamp: passe(MOTEURS_INCIDENT_CAMP_V7, 'camp', function (c) {
      return (c.incidentCamp === 'M1' || c.incidentCamp === 'M7') ? c.incidentCamp : null;
    }),
    penaltyCamp: passe(MOTEURS_PENALTY_CAMP_V7, 'camp', function (c) {
      return (c.penaltyCamp === 'M1' || c.penaltyCamp === 'M7') ? c.penaltyCamp : null;
    }),
    // But dans les deux mi-temps : vrai si on a marqué avant la pause ET
    // après. Demande les deux scores — mi-temps et final.
    // Les DEUX camps marquent-ils en première période ? Se lit sur le
    // seul score de mi-temps : les deux nombres non nuls.
    miTempsDeux: passe(MOTEURS_MITEMPS_DEUX_V7, 'oui', function (c) {
      if (!c.htScore) return null;
      var h = String(c.htScore).match(/(\d+)-(\d+)/);
      if (!h) return null;
      return (+h[1]) > 0 && (+h[2]) > 0;
    }),
    // MATCH SERRÉ : écart de buts <= 1 (le nul compte comme serré).
    // Demande le score exact ; muet sans lui.
    serre: passe(MOTEURS_SERRE_V7, 'oui', function (c) {
      if (!c.score) return null;
      var m = String(c.score).match(/^(\d+)-(\d+)$/);
      if (!m) return null;
      return Math.abs((+m[1]) - (+m[2])) <= 1;
    }),
    // Le NUL : vrai si le score réel est égal, ou si le camp vaut 'nul'.
    nul: passe(MOTEURS_NUL_V7, 'oui', function (c) {
      if (c.camp === 'nul') return true;
      if (!c.score) return c.camp ? false : null;
      var m = String(c.score).match(/(\d+)-(\d+)/);
      if (!m) return null;
      return m[1] === m[2];
    }),
    miTemps: passe(MOTEURS_MITEMPS_V7, 'oui', function (c) {
      // Un cas peut porter directement le fait, quand seul le fait est
      // connu (« il y a but dans chaque mi-temps ») sans les deux scores.
      if (typeof c.butsDeuxMiTemps === 'boolean') return c.butsDeuxMiTemps;
      if (!c.htScore || !c.score) return null;
      var h = String(c.htScore).match(/(\d+)-(\d+)/), f = String(c.score).match(/(\d+)-(\d+)/);
      if (!h || !f) return null;
      var totH = (+h[1]) + (+h[2]), totF = (+f[1]) + (+f[2]);
      return totH > 0 && totF > totH;
    }),
    corners: passeNum(MOTEURS_CORNERS_V7, function (c) {
      return (typeof c.corners === 'number') ? c.corners : null;
    }, BANC_TOLERANCE_CORNERS_V7),
    conditionnels: passe(MOTEURS_CONDITIONNELS_V7, 'camp', function (c) {
      return (c.camp === 'R1' || c.camp === 'R7') ? c.camp : null;
    }),
    cornersDom: passe(MOTEURS_CORNERS_DOM_V7, 'camp', function (c) {
      return (c.cornersDominant === 'R1' || c.cornersDominant === 'R7') ? c.cornersDominant : null;
    }),
    cas: CAS,
    nbArchive: CAS_REFERENCE_V7.length,
    nbSaisis: CAS.length - CAS_REFERENCE_V7.length,
    nbEsport: CAS.filter(function (c) { return c.esport; }).length
  };
  return _bancCacheV7;
}

// Justesse mesurée d'un moteur, par sa clé. Remplace les chiffres écrits
// en dur : si aucun cas ne s'applique, on retombe sur eux.
function justesseMoteurV7(m, famille) {
  var b = bancMoteursV7();
  var l = (famille === 'btts' ? b.btts : b.camp);
  for (var i = 0; i < l.length; i++) {
    if (l[i].cle === m.cle) {
      if (l[i].total > 0) return { juste: l[i].juste, total: l[i].total, mesure: true };
      break;
    }
  }
  return { juste: m.juste, total: m.total, mesure: false };
}

// Les champs juste/total ci-dessous ne sont plus que des VALEURS DE
// REPLI : justesseMoteurV7 les remplace par la justesse rejouée sur le
// banc dès qu'un cas s'applique. Ils sont laissés tels quels, non mis à
// jour, précisément pour qu'on cesse de s'y fier.
// ═══════════════════════════════════════════════════════════════
// MOTEUR « TABLE DES PÔLES » (28/08/26, doctrine Ellemine_D)
//
// Énoncé, mot pour mot : « les vrais critères d'analyse d'une figure ;
// les 4 pôles de chaque figure qui est dans le thème, c'est-à-dire
// développer les 4 pôles de toutes les figures existantes dans le thème ;
// après on lie R1 et R7 aux pôles qui les incluent et les excluent, afin
// de déterminer celui qui tient le poids, la solidité des figures dans le
// thème. […] mais attention au cas où R1 et R7 sont dans la même boucle :
// ils partageront les mêmes pôles, mais leur antagoniste direct de
// l'autre boucle va les différencier du plus solide au moins solide, ou
// s'ils ont le nul. »
//
// CE QUE FAIT LE MOTEUR, LIGNE À LIGNE.
// 1. Il développe les SEIZE maisons : pour chacune, la figure qui l'occupe
//    et ses quatre pôles — bouclier (X+10), front (X+4), binôme (X+2),
//    front du front (X+8), dans cet ordre (polesDeV7).
// 2. Chaque ligne porte un POIDS : le profil de la figure À CETTE PLACE,
//    c'est-à-dire les sept critères d'analyse (profilFigureMaison) —
//    « les vrais critères ». Une figure bien placée pèse ; une figure
//    déplacée en maison ennemie pèse peu, voire négativement.
// 3. On lie : si R1 figure parmi les quatre pôles de la ligne, cette ligne
//    TIENT R1, pour poids × le coefficient du rôle (POIDS_ROLES_V7 :
//    front 1,5, bouclier 1, binôme 1 ; le front du front n'a pas de valeur
//    dans cette table — il prend 1, le neutre, plutôt qu'une hiérarchie
//    inventée). Idem pour R7. Une ligne peut tenir les deux.
// 4. On EXCLUT : si la figure de la ligne est l'antagoniste direct de R1,
//    elle le détruit — la ligne compte alors NÉGATIVEMENT pour lui
//    (POIDS_ROLES_V7.antagoniste = −2). Idem pour R7.
// 5. Verdict. Boucles différentes : celui dont le total est le plus haut
//    tient le poids du thème. MÊME BOUCLE : les deux camps partagent
//    l'essentiel de leurs pôles, le total ne veut plus rien dire — c'est
//    l'antagoniste direct, qui vit dans l'AUTRE boucle, qui départage.
//    Celui dont l'assaillant est le plus lourdement installé est le moins
//    solide ; si aucun des deux assaillants n'est là, ou s'ils pèsent
//    pareil, c'est le NUL.
//
// La règle de la même boucle n'est pas un garde-fou ajouté après coup :
// c'est une conséquence mesurée. Les cinq rôles d'un camp sont à
// décalages PAIRS, donc un camp tient entièrement dans une boucle ; quand
// R1 et R7 sont dans la même, leurs deux camps se recouvrent (jusqu'à 3
// rôles sur 5 partagés), et seule l'attaque — décalage impair, donc de
// l'autre boucle — peut encore les distinguer.
function tablePolesV7(theme) {
  var rot = null;
  try { rot = getRotationCombat(theme); } catch (e) { rot = null; }
  if (!theme || !rot || !rot.figR1 || !rot.figR7) return { applicable: false, lignes: [] };
  var R1 = rot.figR1, R7 = rot.figR7;
  var ROLES = [
    { cle: 'bouclier',       poids: POIDS_ROLES_V7.protecteur },
    { cle: 'front',          poids: POIDS_ROLES_V7.front },
    { cle: 'binôme',         poids: POIDS_ROLES_V7.binome },
    { cle: 'front du front', poids: POIDS_ROLES_V7.binome }
  ];
  var antaR1 = ANTAGONISTES_V7[R1], antaR7 = ANTAGONISTES_V7[R7];
  var lignes = [], totalR1 = 0, totalR7 = 0, contreR1 = 0, contreR7 = 0;
  var tenuR1 = 0, tenuR7 = 0;
  for (var h = 1; h <= 16; h++) {
    var f = theme[h];
    if (!f) continue;
    var pr = null;
    try { pr = profilFigureMaison(f, h, theme); } catch (e) { pr = null; }
    var poids = pr ? pr.total : 0;
    var poles = polesDeV7(f);
    var l = { maison: h, fig: f, poids: Math.round(poids * 100) / 100, poles: poles,
      roleR1: null, roleR7: null, gainR1: 0, gainR7: 0, attaque: null, estR1: f === R1, estR7: f === R7 };
    for (var i = 0; i < poles.length; i++) {
      // 28/08/26 : une ligne occupée par la centrale ADVERSE ne tient pas
      // le camp d'en face — un camp ne compte pas son rival dans ses forces.
      if (poles[i] === R1 && !(REGLE_CENTRALE_ADVERSE_V7 && l.estR7)) { l.roleR1 = ROLES[i].cle; l.gainR1 += poids * ROLES[i].poids; tenuR1++; }
      if (poles[i] === R7 && !(REGLE_CENTRALE_ADVERSE_V7 && l.estR1)) { l.roleR7 = ROLES[i].cle; l.gainR7 += poids * ROLES[i].poids; tenuR7++; }
    }
    if (f === antaR1) { l.attaque = 'R1'; l.gainR1 += poids * POIDS_ROLES_V7.antagoniste; contreR1 += poids; }
    if (f === antaR7) { l.attaque = l.attaque ? 'les deux' : 'R7'; l.gainR7 += poids * POIDS_ROLES_V7.antagoniste; contreR7 += poids; }
    l.gainR1 = Math.round(l.gainR1 * 100) / 100;
    l.gainR7 = Math.round(l.gainR7 * 100) / 100;
    totalR1 += l.gainR1; totalR7 += l.gainR7;
    lignes.push(l);
  }
  totalR1 = Math.round(totalR1 * 100) / 100;
  totalR7 = Math.round(totalR7 * 100) / 100;
  contreR1 = Math.round(contreR1 * 100) / 100;
  contreR7 = Math.round(contreR7 * 100) / 100;
  var iR1 = FIGS_V7.indexOf(R1), iR7 = FIGS_V7.indexOf(R7);
  var memeBoucle = (iR1 % 2) === (iR7 % 2);
  var campR1 = campDeV7(R1), campR7 = campDeV7(R7);
  var partages = campR1.filter(function (x) { return campR7.indexOf(x) >= 0; });
  var camp = null, nul = false, resume = '';
  if (memeBoucle) {
    // Les pôles sont largement communs : seul l'assaillant, qui vient de
    // l'autre boucle, peut encore séparer les deux.
    if (contreR1 === contreR7) {
      nul = true;
      resume = 'même boucle (' + partages.length + '/5 rôles partagés) — les deux assaillants pèsent pareil ('
        + contreR1 + ') : NUL';
    } else {
      camp = contreR1 < contreR7 ? 'R1' : 'R7';
      resume = 'même boucle (' + partages.length + '/5 rôles partagés) — départage par l\'assaillant : '
        + (FL[antaR1] || antaR1) + ' pèse ' + contreR1 + ' contre R1, '
        + (FL[antaR7] || antaR7) + ' pèse ' + contreR7 + ' contre R7 → ' + camp + ' est le plus solide';
    }
  } else {
    if (totalR1 === totalR7) {
      nul = true;
      resume = 'boucles différentes — les deux tables pèsent pareil (' + totalR1 + ') : NUL';
    } else {
      camp = totalR1 > totalR7 ? 'R1' : 'R7';
      resume = 'boucles différentes — R1 tenu par ' + tenuR1 + ' pôle(s) pour ' + totalR1
        + ', R7 par ' + tenuR7 + ' pôle(s) pour ' + totalR7 + ' → ' + camp;
    }
  }
  return {
    applicable: true, figR1: R1, figR7: R7, hR1: rot.hR1, hR7: rot.hR7,
    lignes: lignes, totalR1: totalR1, totalR7: totalR7,
    tenuR1: tenuR1, tenuR7: tenuR7,
    antaR1: antaR1, antaR7: antaR7, contreR1: contreR1, contreR7: contreR7,
    memeBoucle: memeBoucle, partages: partages,
    camp: camp, nul: nul, ecart: Math.round(Math.abs(totalR1 - totalR7) * 100) / 100,
    resume: resume
  };
}

// ─── CONTRÔLE DU TABLEAU DES PÔLES (28/08/26, demande d'Ellemine_D) ───
// « tu as oublié le binôme du front du front, qui est le protecteur
// bouclier ». Vérifié : ce n'est pas un oubli, c'est la même figure.
//     binôme(front du front(X)) = (X+8)+2 = X+10 = le BOUCLIER
// Le bouclier de la première colonne EST le binôme du front du front —
// 16 figures sur 16. Il n'existe donc pas de cinquième pôle : les quatre
// colonnes plus la centrale forment exactement le camp de cinq rôles, et
// aucune figure n'y apparaît deux fois. Les sept contrôles ci-dessous le
// figent, et le panneau les affiche.
// ═══════════════════════════════════════════════════════════════
// CE QUE DONNE UNE FIGURE COMBINÉE À SES PROPRES RELATIONS (30/08/26)
//
// Ellemine_D : « une figure résulte antagoniste de son binôme, vérifie
// ça. »
//
// ☠️ PAS SOUS CETTE FORME : 1 sur 16. X combiné à son binôme ne donne
// son antagoniste que pour Fortuna Minor, et c'est une coïncidence.
//
// ✔ MAIS SON INTUITION DE FOND EST JUSTE : « X + son binôme » n'est pas
// n'importe quoi. Sur les seize figures, ça ne donne que TROIS
// résultats, jamais un autre :
//     = Amissio ..... Puer, Laetitia, Fortuna Minor, Carcer
//     = Laetitia .... Caput, Albus, Rubeus, Tristitia, Conjunctio,
//                     Fortuna Major, Acquisitio, Populus
//     = Puella ...... Via, Amissio, Cauda, Puella
// Et « X + son front » n'en donne que DEUX : Albus ou Fortuna Major.
//
// ✔✔ ET IL Y A UNE LOI EXACTE, 16 SUR 16, qu'il cherchait au mauvais
// endroit :
//     X + LE FRONT DE SON FRONT (+8) = TRISTITIA, TOUJOURS.
// Autrement dit : avancer de 8 rangs dans l'ordre de repos revient
// EXACTEMENT à combiner avec Tristitia.
//
// POURQUOI. La combinaison des figures est un ou-exclusif : elle est
// commutative, associative, Populus est son élément neutre, et chaque
// figure est sa propre inverse (X + X = Populus, vérifié 16/16 par
// autoTestMoteurXOR). Dans un groupe pareil, « X + décalage(X) » ne peut
// être CONSTANT que si le décalage revient à ajouter une figure fixe.
// Deux décalages seulement le font, et on peut le prouver en les
// balayant tous :
//     combiner avec Populus ..... avancer de  0 rang
//     combiner avec Tristitia ... avancer de  8 rangs
// Aucune autre figure ne correspond à un décalage constant. C'est
// pourquoi +2 donne trois résultats et +4 deux : ces décalages ne sont
// pas des additions de figure fixe.
//
// CE QUE ÇA DIT À LA DOCTRINE. Le +8 est déjà la frontière du nul —
// au-delà de {+2, +4, +6}, zéro nul sur neuf cas. On sait maintenant ce
// que ce +8 EST : la marque de Tristitia, l'une des trois figures
// d'incident et l'une des deux figures de Saturne. Quand R7 est à +8 de
// R1, R7 est littéralement R1 marqué par Tristitia. La frontière du nul
// n'est donc pas un rang arbitraire dans une liste : c'est l'endroit où
// la tristesse de Saturne s'interpose entre les deux camps.
// ═══════════════════════════════════════════════════════════════
// LES MAISONS DE CONFUSION — découverte d'Ellemine_D (30/08/26)
//
// Son dessin : quatre courbes sur les douze maisons.
//   rouge  les fronts de M1 ....... M1, M5, M9        (pas de 4)
//   vert   les binômes de M1 ...... M1, M3, M5, M7, M9, M11  (pas de 2)
//   noir   les fronts de M2 ....... M2, M6, M10       (pas de 4)
//   bleu   les binômes de M2 ...... M2, M4, M6, M8, M10, M12 (pas de 2)
// Là où la ligne de front et la ligne de binôme se rejoignent, il parle
// de « confusion ». Sa liste des maisons SANS confusion — M3, M4, M7,
// M8, M11, M12 — est exacte, vérifiée ici.
// Deux précisions sur ses notes : en boucle paire M2 est aussi un point
// de confusion (c'est l'origine des deux lignes, comme M1 pour l'impaire),
// et sa dernière ligne « boucle pair : m1, 10, 12 » est un lapsus — c'est
// M2, M6, M10.
//
// ✔ ET SA TABLE DES ÉLÉMENTS DIT EXACTEMENT LA MÊME CHOSE.
//     M1, M5, M9 ..... FA        M2, M6, M10 .... ET / TE
//     M3, M7, M11 .... A         M4, M8, M12 .... E
// Les maisons de confusion sont EXACTEMENT les maisons à deux éléments,
// et les maisons sans confusion exactement celles à un seul. Ce n'est
// pas une coïncidence de notation : les deux découpages sont le même.
//
// ═══════════════════════════════════════════════════════════════
//                  ✦  LE THÉORÈME D'ELLEMINE  ✦
//         nommé le 31/08/26, sur sa demande et de son nom
// ═══════════════════════════════════════════════════════════════
//
//   ÉNONCÉ. Dans le cycle des douze maisons, les deux camps d'un
//   thème ne sont JAMAIS à égalité élémentaire : l'un occupe
//   toujours une maison à deux éléments, l'autre une maison à un
//   seul. Jamais les deux, jamais aucun.
//
//   FORME ÉLÉMENTAIRE — la plus forte, trouvée le 31/08. L'élément
//   du camp simple est toujours l'UN DES DEUX du camp doublé. Les
//   deux camps partagent donc toujours exactement un élément, et
//   l'un en a toujours exactement un de plus.
//        JAMAIS ÉGAUX, JAMAIS ÉTRANGERS.
//
//   CAUSE. R7 est toujours six maisons après R1 — sur SEIZE, pas
//   sur douze. Ce pas de six fait alterner maisons doubles et
//   maisons simples sans exception possible.
//
//   PORTÉE. Vrai sur 8 des 16 positions de départ, 0 violation ;
//   muet sur les 8 autres, où l'un des camps sort dans les maisons
//   de synthèse (M13 à M16), hors du cycle où le pas boucle.
//
//   CE QU'IL NE FAIT PAS. Il ne prédit rien : le camp doublé pris
//   seul fait 14/23 sur les matchs décidés (p = 0,202), et la
//   lecture par la fusion des éléments est sous le témoin sur le
//   nul (17/29 contre 23/29). C'est un théorème de STRUCTURE — il
//   dit ce que le thème est, pas ce que le match sera. Il est vrai
//   et il n'est pas rentable ; les deux à la fois.
//
//   ✔ MAIS LA ROTATION EST ESSENTIELLE — testé le 31/08 sur sa
//   proposition « et si on lisait le théorème sur M1 et M7 au lieu
//   de R1 et R7 ». M1 et M7 sont des maisons FIXES : M1 est
//   toujours FA (double), M7 toujours A (simple). Le théorème y est
//   donc toujours applicable et le camp doublé est TOUJOURS le
//   camp 1, sur tous les thèmes, pour toujours. C'est le témoin
//   dégénéré « toujours R1 » sous un autre nom.
//   Et le piège est que LES DEUX LECTURES DONNENT LE MÊME BRUT :
//       lecture M1/M7 (constante) ..... 14/23
//       lecture R1/R7 (le théorème) ... 14/23
//   Identiques. On aurait pu conclure « ça revient au même ».
//   Découpé par camp réellement vainqueur, tout change :
//       M1/M7  — R1 gagne 14/14 (100 %) · R7 gagne 0/9 (0 %)  → équilibré 50 %
//       R1/R7  — R1 gagne  7/14 (50 %) · R7 gagne 7/9 (78 %)  → équilibré 64 %
//   Sur les 9 matchs gagnés par R7, la lecture fixe en trouve ZÉRO
//   et le théorème en trouve SEPT : p = 0,0023.
//   ➜ La rotation n'est pas un détail de mise en œuvre, c'est ce
//   qui donne au théorème son seul contenu mesurable. Lu sur des
//   maisons fixes il devient une constante et ne dit plus rien.
//   (Même piège que le témoin « toujours R1 » face à F4P4 : le
//   score brut cache tout, seule la justesse équilibrée parle.)
//
//   ☠️ ET IL NE FAUT PAS SUR-LIRE CE 7/9. J'ai écrit à Ellemine_D
//   que c'était « le résultat le plus solide du fichier sur le
//   camp ». C'était trop dire, et voici le chiffre qui manquait —
//   la matrice complète, nuls compris, des 30 cas applicables :
//                        R1 gagne   R7 gagne   nul   total
//       dit R7 ........      7          7        3     17
//       dit R1 ........      7          2        4     13
//   QUAND IL DIT R7, R7 GAGNE 7 FOIS SUR 17 — 41 %, contre 30 % de
//   taux de base. p = 0,225. Il attrape 7 des 9 victoires de R7
//   parce qu'il annonce R7 SUR PLUS DE LA MOITIÉ DES THÈMES (17 sur
//   30), pas parce qu'il les reconnaît. C'est l'image inverse du
//   témoin dégénéré : beaucoup de rappel, peu de précision.
//   Et sur ces mêmes 17 cas, le verdict affiché fait 11/17 quand le
//   théorème fait 7/17.
//   ➜ CE QUI TIENT : la rotation porte une information que la
//   lecture fixe ne peut pas porter (équilibré 64 % contre 50 %).
//   CE QUI NE TIENT PAS : « camp doublé = R7 donc joue R7 ». Ce
//   n'est pas une règle de pari, et le p de 0,0023 ne dit pas
//   l'inverse — il compare le théorème à un témoin qui, par
//   construction, ne peut JAMAIS nommer R7. Battre ça est facile
//   pour n'importe quoi qui nomme R7 de temps en temps.
//
// ✔✔ ET IL EN SORT UN THÉORÈME.
// R7 est toujours SIX maisons après R1 — mais SUR SEIZE, pas sur douze.
// ☠️ MA PREMIÈRE DÉMONSTRATION ÉTAIT FAUSSE SUR LA MOITIÉ DE SA TABLE.
// J'avais écrit le pas comme +6 modulo 12, ce qui donne M7 → M1. Le
// moteur fait M7 → M13. Six lignes sur douze étaient inventées :
//     je disais M7→M1, M8→M2, M9→M3, M10→M4, M11→M5, M12→M6
//     le moteur fait M7→M13, M8→M14, M9→M15, M10→M16, M11→M1, M12→M2
// Et autoTestConfusionV7 « vérifiait » cette table imaginaire : il
// passait 12/12 sur une règle que le fichier n'applique pas.
//
// LA VRAIE TABLE, +6 SUR SEIZE :
//     M1  → M7    FA / A      classes opposées ✔
//     M2  → M8    ET / E      ✔
//     M3  → M9    A / FA      ✔
//     M4  → M10   E / TE      ✔
//     M5  → M11   FA / A      ✔
//     M6  → M12   ET / E      ✔
//     M11 → M1    A / FA      ✔      (le pas repasse par 16 puis 1)
//     M12 → M2    E / ET      ✔
//     M7 M8 M9 M10 → M13 M14 M15 M16   hors du cycle
//     M13 M14 M15 M16 → M3 M4 M5 M6    hors du cycle
// LE THÉORÈME TIENT QUAND MÊME, et sans exception : sur les 8 positions
// de départ où les deux camps restent dans les douze maisons, l'un est
// TOUJOURS en maison double et l'autre en maison simple. Zéro violation.
// Simplement, il vaut sur 8 positions sur 16 — 50 %, ce qui colle aux
// 48,9 % mesurés sur 4 000 tirages.
//
// ✔ ET UN SECOND FAIT, CELUI-LÀ SANS EXCEPTION SUR LES SEIZE POSITIONS :
// R1 et R7 ne sont JAMAIS tous les deux en maison de synthèse (M13-M16).
// Zéro cas sur 4 000 tirages. Exactement un des deux, ou aucun.
//
// Il y a donc, dans chaque thème du cycle, un camp « doublé » et un camp
// « simple », et c'est une donnée qu'on n'avait jamais lue.
//
// ⚠️ IL NE S'APPLIQUE QU'À LA MOITIÉ DES THÈMES. Mesuré sur 3 000
// tirages : 50 % ont R1 ou R7 dans les maisons de synthèse M13-M16, qui
// sortent du cycle des douze. Le pas de +6 n'y boucle pas, et le
// théorème ne les concerne pas. Sur l'archive, 23 cas sur 37.
//
// ☠️ SUR LE NUL, ÇA NE DONNE RIEN. Tout testé sur les 23 cas :
//     camp doublé = R1 ........................ 2/11 contre 3/12 · p = 1,000
//     élément du camp doublé (FA / ET) ........ 2/15 contre 3/8  · p = 0,297
//     élément du camp simple (A / E) .......... même chose par construction
// Le seul écart visible — plus de nuls quand la paire est ET/E (3 sur 8)
// que FA/A (2 sur 15) — n'est que la PARITÉ des maisons redite autrement,
// et il ne sort pas du bruit. Aucune paire de maisons ne se distingue
// non plus : la meilleure, M2/M12, fait 2 nuls sur 3 cas.
//
// ☠️ SUR LE CAMP GAGNANT, LE DOUBLÉ NE BAT PAS LE VERDICT. Sur les 19
// matchs décidés où le théorème s'applique :
//     verdict affiché ............. 14/19
//     le camp doublé .............. 13/19
//     témoin « toujours R1 » ...... 10/19
// Et découper par l'élément du doublé ne sauve rien : FA 9/13, ET 4/6.
//
// ✔ CE QU'ELLE DONNE : LEUR ACCORD, et c'est la seule chose.
//     le camp doublé et le verdict désignent le MÊME camp
//         (12 cas sur 19) ......... verdict juste 10 fois sur 12   83 %
//     ils se contredisent
//         (7 cas) ................. verdict juste  4 fois sur 7    57 %
// C'est le seul signal de confiance du fichier qui aille dans le BON
// sens — la porte de confiance par les dérivés, elle, allait à l'envers
// (3 axes valides → 59 % de justesse contre 86 % à 2 axes).
// ☠️ MAIS IL A DÉJÀ RATÉ. Le 30/08, sur FortMajLaet, le camp doublé et
// le verdict disaient tous les deux R7 — accord parfait — et le match a
// fait 2-0 pour R1. L'accord est passé de 10/11 à 10/12 en un match.
// Un signal de confiance qui se trompe quand les deux sont d'accord vaut
// moins qu'un signal isolé qui se trompe.
// ⚠️ 19 cas. Ce n'est pas démontré, et ça ne touche à rien. Le camp
// doublé est AFFICHÉ à côté du verdict, il ne le change jamais.
function maisonConfusionV7(h) {
  return [1, 2, 5, 6, 9, 10].indexOf(h) >= 0;
}
var ELEMENT_MAISON_V7 = { 1: 'FA', 2: 'ET', 3: 'A', 4: 'E', 5: 'FA', 6: 'ET',
  7: 'A', 8: 'E', 9: 'FA', 10: 'TE', 11: 'A', 12: 'E' };
// ═══════════════════════════════════════════════════════════════
// LA FUSION DES ÉLÉMENTS (31/08/26) — demande d'Ellemine_D
//
// « Étudie ce match avec notre théorème en comptant sur la fusion des
// éléments dans les maisons. » Fait, et ça donne une reformulation du
// théorème qui est plus parlante que la sienne.
//
// ✔ SUR LES SIX AXES M(h) ↔ M(h+6), L'ÉLÉMENT DU CAMP SIMPLE EST
// TOUJOURS L'UN DES DEUX DU CAMP DOUBLÉ :
//     M1 FA / M7  A   → commun Air,   en plus FEU
//     M2 ET / M8  E   → commun Eau,   en plus TERRE
//     M3 A  / M9  FA  → commun Air,   en plus FEU
//     M4 E  / M10 TE  → commun Eau,   en plus TERRE
//     M5 FA / M11 A   → commun Air,   en plus FEU
//     M6 ET / M12 E   → commun Eau,   en plus TERRE
// Six sur six. Le camp doublé ne porte donc pas « deux éléments contre
// un » : il porte L'ÉLÉMENT DE L'ADVERSAIRE, PLUS UN. Les deux camps
// partagent toujours un élément, et l'un a un supplément. C'est vrai
// pour TOUS les thèmes — c'est le théorème lui-même, pas une propriété
// du thème étudié. Il ne faut donc pas lire « ce thème a six axes
// doublé/simple » comme une découverte : tous les thèmes les ont.
//
// ☠️ ET L'ÉLÉMENT EN PLUS NE PRÉDIT RIEN. C'était la seule variable
// nouvelle que cette lecture fait apparaître : le supplément est FEU sur
// les axes M1/M7, M3/M9, M5/M11 et TERRE sur M2/M8, M4/M10, M6/M12.
// Mesuré sur les 29 cas où le théorème s'applique :
//     en plus FEU (17 cas) — nul 18 % · le doublé gagne 9/14 · BTTS 45 %
//     en plus TERRE (12)   — nul 25 % · le doublé gagne 5/9  · BTTS 80 %
//     p : nul 0,669 · camp 1,000 · BTTS 0,183
// Rien. Le 45 % contre 80 % du BTTS est le plus gros écart, et c'est le
// troisième test de cette série — au niveau de bruit habituel.
//
// ⚠️ UNE QUESTION QUI RESTE, ET ELLE EST POUR LUI : sa table écrit M2 et
// M6 « ET » mais M10 « TE ». Si l'ordre encode l'élément dominant, alors
// M10 est une maison Terre-puis-Eau quand M2 et M6 sont Eau-puis-Terre,
// et c'est une distinction que le code IGNORE — ELEMENT_MAISON_V7 n'est
// lu nulle part pour son ordre, seulement pour son étiquette. Si l'ordre
// ne veut rien dire, il faudrait écrire ET partout. Si l'ordre veut dire
// quelque chose, il y a une règle qu'on n'utilise pas.
// ═══════════════════════════════════════════════════════════════
// LA GRANDE FOUILLE ÉLÉMENTAIRE (31/08/26) — « fouille une dernière fois »
//
// Dernier passage sur la couche des éléments, fait large et corrigé pour
// qu'on ne puisse pas se raconter d'histoire. DIX-HUIT variables
// élémentaires croisées avec CINQ issues, soit 88 croisements lisibles
// (au moins 5 cas de chaque côté) sur les 48 cas de l'archive.
//
// Les variables : la maison de R1 par élément classique (Feu/Air/Eau/
// Terre) · figure et maison de même élément, pour R1 puis pour R7 · R1
// et R7 de même élément de figure · idem de maison · l'harmonie du thème
// (combien des seize figures sont dans une maison de leur élément),
// haute et basse · l'élément majoritaire des seize figures, dans les
// quatre valeurs · un élément absent du thème · le Juge M15 de même
// élément que R1, que R7, ou dans une maison de son élément · et les
// deux variables de SA table : le camp doublé gouverné par le partagé,
// et l'élément partagé = Eau.
// Les issues : le match est nul · R1 gagne · les deux marquent · match
// serré · le verdict affiché est juste.
//
// ☠️ RÉSULTAT : ZÉRO CROISEMENT SOUS p = 0,05. Pas « zéro après
// correction » — ZÉRO EN BRUT. Le hasard seul en donnerait 4,4 sur 88.
// Les cinq meilleurs, pour mémoire :
//     R7 figure et maison de même élément → nul .... 50 % contre 18 %  p = 0,068
//     R1 figure et maison de même élément → juste .. 43 % contre 71 %  p = 0,103
//     R1 en maison de Terre → nul .................. 42 % contre 17 %  p = 0,113
//     R1 en maison d'Eau → nul ......................  7 % contre 30 %  p = 0,136
//     harmonie basse → les deux marquent ........... 33 % contre 62 %  p = 0,164
// Obtenir MOINS de résultats nominalement significatifs que le hasard
// n'en produirait est le signe le plus net qu'on puisse avoir : la
// couche élémentaire ne porte aucune information sur ces cinq issues.
// C'est la réponse à « qu'apporte cette lecture » : de la compréhension
// de la structure, rien pour parier.
//
// (Mesure non branchée : 88 croisements avec rejeu du verdict coûteraient
// plusieurs secondes à chaque ouverture du banc, et le résultat est
// « rien ». Le script est reproductible tel quel — même méthode que
// balayageSeparationV7, qui lui reste vivant parce qu'il est léger.)
//
// ⚠️ ET UNE OBSERVATION DE STRUCTURE, TROUVÉE EN CHEMIN : le fichier
// contient DEUX doctrines d'éléments par maison qui ne coïncident nulle
// part.
//     ELEMENT_OF_HOUSE (globale) . M1 feu, M2 air, M3 eau, M4 terre, …
//                                   le cycle classique par quatre
//     ELEMENT_MAISON_V7 (sa table) M1 FA, M2 ET, M3 A, M4 E, …
// La PREMIÈRE est celle que les moteurs utilisent réellement (la
// concordance figure/maison, qui pèse dans les sept critères). La
// SECONDE ne sert qu'au théorème des maisons de confusion et à
// l'affichage. Elles ne se contredisent pas au sens du code — elles ne
// se rencontrent jamais — mais il faut savoir qu'un « élément de la
// maison » ne veut pas la même chose selon l'endroit du fichier où on
// le lit.
// (Fausse piste écartée au passage : ELEMENT_OF_HOUSE, FIGURES et
// ELEMENT_COLORS apparaissent chacun deux fois en `const`. J'ai cru à
// une redéclaration fatale. Vérifié dans le navigateur : les blocs 1, 2,
// 7 et 8 sont des IIFE, leurs déclarations sont locales. Aucun conflit,
// aucun bloc mort.)
var FUSION_ELEMENTS_V7 = { FA: ['F', 'A'], ET: ['E', 'T'], TE: ['T', 'E'], A: ['A'], E: ['E'] };
var NOM_ELEMENT_V7 = { F: 'Feu', A: 'Air', E: 'Eau', T: 'Terre' };

// ═══════════════════════════════════════════════════════════════
// L'ORDRE DE LA TABLE = L'ÉLÉMENT DOMINANT (31/08/26)
//
// Je lui avais posé la question franchement : sa table écrit M2 et M6
// « ET » mais M10 « TE ». Soit l'ordre ne veut rien dire et il faut
// écrire ET partout, soit il encode l'élément dominant. Réponse : le
// second. Le PREMIER élément écrit domine.
//
// Ce que ça donne, axe par axe :
//     M1  FA / M7  A   dominant Feu    partagé Air   en plus Feu    → SON SUPPLÉMENT
//     M2  ET / M8  E   dominant Eau    partagé Eau   en plus Terre  → le PARTAGÉ
//     M3  A  / M9  FA  dominant Feu    partagé Air   en plus Feu    → SON SUPPLÉMENT
//     M4  E  / M10 TE  dominant Terre  partagé Eau   en plus Terre  → SON SUPPLÉMENT
//     M5  FA / M11 A   dominant Feu    partagé Air   en plus Feu    → SON SUPPLÉMENT
//     M6  ET / M12 E   dominant Eau    partagé Eau   en plus Terre  → le PARTAGÉ
// Sur quatre axes le camp doublé est gouverné par CE QU'IL A EN PLUS —
// l'élément que l'adversaire n'a pas. Sur deux (M2/M8 et M6/M12) il est
// gouverné par l'élément PARTAGÉ : sa force est celle que l'autre a
// aussi, son supplément ne mène pas. C'est une distinction qui a du sens
// et qu'on peut suivre.
//
// ⚠️ ET ELLE NE CHANGE RIEN AUJOURD'HUI — VOICI EXACTEMENT POURQUOI.
// Sans l'ordre, la classe se lisait « supplément Feu / supplément
// Terre » : Feu = {M1/M7, M3/M9, M5/M11}, Terre = {M2/M8, M4/M10,
// M6/M12}. Avec l'ordre, elle se lit « dominé par son supplément /
// dominé par le partagé » : supplément = {M1/M7, M3/M9, M4/M10,
// M5/M11}, partagé = {M2/M8, M6/M12}. Les deux découpages ne diffèrent
// QUE sur l'axe M4/M10.
// Or M4→M10 n'apparaît dans AUCUN des 50 thèmes de l'archive. Les deux
// lectures donnent donc rigoureusement les mêmes chiffres :
//     dominé par son supplément (17) — nul 18 % · doublé gagne 9/14 · BTTS 45 %
//     dominé par le partagé     (12) — nul 25 % · doublé gagne 5/9  · BTTS 80 %
//     p : nul 0,669 · camp 1,000 · BTTS 0,183
// Sa règle est donc implémentée et bien définie, mais elle est POUR
// L'INSTANT INDISCERNABLE de la précédente. Ce n'est pas « ça ne marche
// pas » : c'est « le seul cas qui trancherait n'est jamais sorti ».
//
// ✔ QUAND SAURA-T-ON ? Les seize maisons de R1 sont exactement
// équiprobables — 4 096 thèmes sur 65 536, 6,25 % chacune, vérifié
// exhaustivement. N'avoir vu aucun M4→M10 en 50 tirages a une
// probabilité de 0,040 : c'est de la malchance, pas une impossibilité.
// Il faut 36 tirages pour en voir un avec 90 % de chances. Le jour où
// un thème sortira avec R1 en M4, il ira dans « dominé par son
// supplément » au lieu de « supplément Terre », et les deux lectures se
// sépareront pour la première fois. C'est le seul thème à guetter.
var DOMINANT_MAISON_V7 = (function () {
  var d = {};
  Object.keys(ELEMENT_MAISON_V7).forEach(function (h) {
    var e = FUSION_ELEMENTS_V7[ELEMENT_MAISON_V7[h]];
    d[h] = e ? e[0] : null;
  });
  return d;
})();

// Ce que les deux camps partagent, ce que le doublé a en plus, et lequel
// des deux le gouverne. Descriptif : mesuré sans effet, branché sur rien.
function fusionElementV7(theme) {
  var cd = null;
  try { cd = campDoubleV7(theme); } catch (e) { return null; }
  if (!cd || !cd.applicable) return null;
  var dbl = ELEMENT_MAISON_V7[cd.maisonDouble], smp = ELEMENT_MAISON_V7[cd.maisonSimple];
  var setD = FUSION_ELEMENTS_V7[dbl], setS = FUSION_ELEMENTS_V7[smp];
  if (!setD || !setS) return null;
  var commun = setS[0];
  var extra = setD.filter(function (x) { return x !== commun; })[0];
  if (setD.indexOf(commun) < 0) {
    // Ne doit jamais arriver : l'inclusion est vraie sur les six axes.
    return { anomalie: true, double: dbl, simple: smp, camp: cd.camp };
  }
  // La table de dominance d'Ellemine_D est la source : on la LIT au lieu
  // de recalculer le premier élément, pour qu'il n'y ait qu'un endroit à
  // corriger si l'ordre de sa table change.
  var dominant = DOMINANT_MAISON_V7[cd.maisonDouble] || setD[0];
  return { camp: cd.camp, double: dbl, simple: smp, commun: commun, extra: extra,
    dominant: dominant, domineParSonSupplement: dominant === extra,
    axe: 'M' + Math.min(cd.maisonDouble, cd.maisonSimple) + '/M' + Math.max(cd.maisonDouble, cd.maisonSimple),
    separateur: (cd.maisonDouble === 10 || cd.maisonSimple === 10) && (cd.maisonDouble === 4 || cd.maisonSimple === 4),
    nomCommun: NOM_ELEMENT_V7[commun] || commun, nomExtra: NOM_ELEMENT_V7[extra] || extra,
    nomDominant: NOM_ELEMENT_V7[dominant] || dominant };
}

function campDoubleV7(theme) {
  var r = null;
  try { r = getRotationCombat(theme); } catch (e) { return null; }
  if (!r || !r.hR1 || !r.hR7) return null;
  // ⚠️ CORRIGÉ LE 30/08 DANS L'HEURE QUI A SUIVI. La première version ne
  // testait que « les deux classes diffèrent ». Or maisonConfusionV7
  // renvoie false pour M13 à M16 aussi : une paire M9/M15 passait donc
  // pour applicable, avec un « camp simple » qui n'a aucun élément. Trois
  // cas d'archive étaient concernés (M9/M15, M6/M16, M10/M16) et ils
  // faussaient les mesures. Le théorème ne vaut que DANS le cycle des
  // douze maisons — c'est là que le pas de +6 boucle.
  if (r.hR1 > 12 || r.hR7 > 12) {
    return { applicable: false, hR1: r.hR1, hR7: r.hR7,
      raison: 'une des deux maisons est hors du cycle des douze (M13 à M16)' };
  }
  var c1 = maisonConfusionV7(r.hR1), c7 = maisonConfusionV7(r.hR7);
  if (c1 === c7) {
    // Ne doit jamais arriver dans le cycle des douze : c'est le théorème.
    return { applicable: false, hR1: r.hR1, hR7: r.hR7,
      raison: 'THÉORÈME D\'ELLEMINE VIOLÉ — à signaler' };
  }
  return { applicable: true, camp: c1 ? 'R1' : 'R7', hR1: r.hR1, hR7: r.hR7,
    elementR1: ELEMENT_MAISON_V7[r.hR1] || '—', elementR7: ELEMENT_MAISON_V7[r.hR7] || '—',
    maisonDouble: c1 ? r.hR1 : r.hR7, maisonSimple: c1 ? r.hR7 : r.hR1 };
}

// Auto-test du théorème. ⚠️ CORRIGÉ LE 30/08 : il bouclait sur douze
// maisons (%12) alors que le pas du moteur est +6 sur SEIZE. Il validait
// une table imaginaire. Il applique désormais le vrai pas, et ne compte
// que les positions où les deux camps restent dans les douze maisons.
function autoTestConfusionV7() {
  var manques = [], ok = 0, hors = 0;
  for (var h = 1; h <= 16; h++) {
    var h7 = ((h - 1 + 6) % 16) + 1;
    if (h > 12 || h7 > 12) { hors += 1; continue; }
    if (maisonConfusionV7(h) === maisonConfusionV7(h7)) manques.push('M' + h + '→M' + h7);
    else ok += 1;
  }
  // la confusion doit coïncider avec les maisons à deux éléments
  var doubles = [], conf = [];
  for (var k = 1; k <= 12; k++) {
    if ((ELEMENT_MAISON_V7[k] || '').length === 2) doubles.push(k);
    if (maisonConfusionV7(k)) conf.push(k);
  }
  return { ok: ok, sur: ok + manques.length, hors: hors, manques: manques,
    memesMaisons: doubles.join(',') === conf.join(','),
    doubles: doubles, conf: conf };
}

function autoTestRelationsFiguresV7() {
  var F = FIGS_V7, idx = {};
  F.forEach(function (f, i) { idx[f] = i; });
  var app = function (f, k) { return F[(idx[f] + k) % 16]; };
  var res = { controles: [], ok: true };
  function loi(nom, k, attendu) {
    var n = 0, distinct = {};
    F.forEach(function (X) {
      var r = combine(X, app(X, k));
      distinct[r] = true;
      if (r === attendu) n += 1;
    });
    res.controles.push({ nom: nom, ok: n, distinct: Object.keys(distinct).length,
      figures: Object.keys(distinct) });
    return n;
  }
  loi('X + lui-même = Populus', 0, 'populus');
  loi('X + le front de son front (+8) = Tristitia', 8, 'tristitia');
  loi('X + son binôme (+2)', 2, null);
  loi('X + son front (+4)', 4, null);
  // La proposition d'Ellemine_D, gardée comme témoin de ce qui a été testé.
  var claim = 0;
  F.forEach(function (X) { if (combine(X, app(X, 2)) === app(X, 13)) claim += 1; });
  res.claimBinomeAntagoniste = claim;
  // Quelles figures correspondent à un décalage constant ?
  res.decalagesConstants = [];
  F.forEach(function (T) {
    var d = null, coherent = true;
    F.forEach(function (X) {
      var k = (((idx[combine(X, T)] - idx[X]) % 16) + 16) % 16;
      if (d === null) d = k; else if (d !== k) coherent = false;
    });
    if (coherent) res.decalagesConstants.push({ figure: T, rangs: d });
  });
  res.ok = res.controles[0].ok === 16 && res.controles[1].ok === 16
    && res.decalagesConstants.length === 2;
  return res;
}

function autoTestPolesV7() {
  var idx = {};
  FIGS_V7.forEach(function (f, i) { idx[f] = i; });
  var t = [
    { nom: 'ordre du tableau = bouclier, front, binôme, front du front', ok: 0 },
    { nom: 'binôme(front du front) = BOUCLIER', ok: 0 },
    { nom: 'bouclier(front du front) = BINÔME', ok: 0 },
    { nom: 'front(front) = front du front', ok: 0 },
    { nom: 'les 4 pôles + la centrale = le camp (5 rôles)', ok: 0 },
    { nom: 'les 4 pôles restent dans la boucle de la centrale', ok: 0 },
    { nom: 'aucune figure répétée dans les 5 rôles', ok: 0 }
  ];
  FIGS_V7.forEach(function (X) {
    var p = polesDeV7(X);
    var bouc = BOUCLIER_V7[X], fr = FRONT_V7[X], bin = BINOMES_V7[X], ff = frontDuFrontV7(X);
    if (p[0] === bouc && p[1] === fr && p[2] === bin && p[3] === ff) t[0].ok++;
    if (BINOMES_V7[ff] === bouc) t[1].ok++;
    if (BOUCLIER_V7[ff] === bin) t[2].ok++;
    if (FRONT_V7[fr] === ff) t[3].ok++;
    var camp = campDeV7(X);
    if (camp.length === 5 && camp.indexOf(X) >= 0 && p.every(function (y) { return camp.indexOf(y) >= 0; })) t[4].ok++;
    if (p.every(function (y) { return (idx[y] % 2) === (idx[X] % 2); })) t[5].ok++;
    var vus = {}, uniq = true;
    p.concat([X]).forEach(function (y) { if (vus[y]) uniq = false; vus[y] = 1; });
    if (uniq) t[6].ok++;
  });
  var fautes = t.filter(function (x) { return x.ok !== 16; });
  return { ok: fautes.length === 0, controles: t, fautes: fautes };
}
autoTestV7('tableau des pôles', function () {
  var r = autoTestPolesV7();
  if (!r.ok) { console.warn('⚠️ Tableau des pôles incohérent :', r.fautes); }
});

// ═══════════════════════════════════════════════════════════════
// LOI DES AXES D'OPPOSITION (29/08/26) — théorie d'Ellemine_D
//
// « toutes les couplages des maisons sont occupées par les figures de
// façon spéciale : M1 opposée de M7, la figure en M7 est front du front
// de la figure en M1 ; M2 et M8 binôme direct ; de même que R1 et R7 sont
// de relation binôme en maison cadente M6 et M12 ».
//
// Les six axes d'opposition sont M1/M7, M2/M8, M3/M9, M4/M10, M5/M11,
// M6/M12 — le même écart de six maisons qui sépare toujours R7 de R1.
// Chaque axe porte un décalage dans FIGS_V7, et ce décalage EST une
// relation : +2 binôme, +4 front, +8 front du front, +10 bouclier,
// +3 victime, +13 antagoniste, +14 le binôme lu à l'envers, etc.
//
// Deux lois vérifiées sur les 65 536 thèmes possibles, sans exception :
//   1. le nombre d'axes portant un décalage IMPAIR est toujours PAIR —
//      donc le nombre d'axes de MÊME BOUCLE vaut 0, 2, 4 ou 6, jamais
//      un nombre impair ;
//   2. cela découle d'une loi plus simple : parmi les douze premières
//      maisons, le nombre de figures de boucle impaire est toujours pair.
// Répartition exhaustive des axes de même boucle : 0 → 3,13 % des
// thèmes, 2 → 46,88 %, 4 → 46,88 %, 6 → 3,13 %.
//
// Sa lecture du thème AmisPuer (4-4) est exacte sur deux points sur
// trois, et la troisième est juste au sens de la relation mais pas du
// sens de lecture :
//   M1 Amissio ↔ M7 Puella ......... +8  front du front  ✅
//   M2 Puer    ↔ M8 Acquisitio ..... +14 binôme À L'ENVERS — le binôme
//        est un décalage de +2, non réciproque : c'est Puer qui est le
//        binôme d'Acquisitio, pas l'inverse.
//   M6 Conjunctio ↔ M12 Cauda ...... +2  binôme  ✅ (l'axe de R1/R7)
// Les deux axes restants, M4/M10 +3 (victime) et M5/M11 +13
// (antagoniste), sont exactement inverses l'un de l'autre : ils
// s'annulent. C'est là sa « disposition d'équilibre », et elle est
// littéralement vraie — le multiensemble des six décalages de ce thème
// est symétrique (pour chaque +k il existe un +(16−k)). Mesuré : cela
// n'arrive que dans 0,85 % des thèmes (559 sur les 65 536, recompté le
// 30/08), et AmisPuer est toujours le SEUL de l'archive à l'avoir —
// 1 sur 49 maintenant, contre 1 sur 28 à l'époque. Les six décalages,
// revérifiés : M1↔M7 +8 front du front · M2↔M8 +14 binôme à l'envers ·
// M3↔M9 +8 front du front · M4↔M10 +3 victime · M5↔M11 +13 antagoniste
// · M6↔M12 +2 binôme. Les deux du milieu (+3 et +13) s'annulent, les
// deux +8 sont leur propre inverse, et +2 répond à +14 : c'est de là que
// vient la symétrie.
// ⚠️ Mais Roma (1-1), l'autre nul, ne l'a PAS. L'équilibre des axes ne
// peut donc pas être la loi du nul ; il reste une signature du 4-4.
// Le résultat ne dépend pas du thème affiché : on le calcule une seule
// fois. Sans ce cache, le panneau des pôles mettait 5,3 s à s'ouvrir.
var _cacheAxesV7 = null;
function autoTestAxesV7() {
  if (_cacheAxesV7) return _cacheAxesV7;
  var idx = {};
  FIGS_V7.forEach(function (f, i) { idx[f] = i; });
  var t = [
    { nom: 'axes de boucles opposées en nombre pair', ok: 0 },
    { nom: 'figures de boucle impaire en M1..M12 en nombre pair', ok: 0 }
  ];
  // Échantillon de 256 thèmes : la loi a été vérifiée hors ligne sur les
  // 65 536 thèmes possibles, ce contrôle-ci n'est qu'un garde-fou de
  // régression. Un pas de 2 (4 096 thèmes) coûtait 4 s au chargement.
  var n = 0;
  for (var i = 0; i < 16; i += 4) {
    for (var j = 0; j < 16; j += 4) {
      for (var a = 0; a < 16; a += 4) {
        for (var b = 0; b < 16; b += 4) {
          var th = buildThemeFromMothers(FIGS_V7[i], FIGS_V7[j], FIGS_V7[a], FIGS_V7[b]);
          var impairs = 0, boucle = 0;
          for (var h = 1; h <= 6; h++) {
            if ((((idx[th[h + 6]] - idx[th[h]]) % 16) + 16) % 16 % 2) impairs++;
          }
          for (var g = 1; g <= 12; g++) { if (idx[th[g]] % 2) boucle++; }
          if (impairs % 2 === 0) t[0].ok++;
          if (boucle % 2 === 0) t[1].ok++;
          n++;
        }
      }
    }
  }
  var fautes = t.filter(function (x) { return x.ok !== n; });
  _cacheAxesV7 = { ok: fautes.length === 0, total: n, controles: t, fautes: fautes };
  return _cacheAxesV7;
}
autoTestV7('loi des axes d\'opposition', function () {
  var r = autoTestAxesV7();
  if (!r.ok) { console.warn('⚠️ Loi des axes d\'opposition en défaut :', r.fautes); }
});

// Le tableau, à l'écran : les seize maisons développées en quatre pôles,
// avec ce que chaque ligne apporte à R1 et à R7.
function toggleTablePolesPanel() {
  var panel = document.getElementById('table-poles-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
    var n = function (f) { return esc(FL[f] || f); };
    var a = null;
    try { a = tablePolesV7(currentTheme); } catch (e) { a = null; }
    if (!a || !a.applicable) {
      panel.innerHTML = '<div class="warn">Table des pôles indisponible sur ce thème.</div>';
      panel.style.display = 'block'; return;
    }
    var h = '<h3 style="margin:0 0 6px;">🧮 Table des pôles</h3>'
      + '<div class="muted" style="font-size:11px; margin-bottom:8px;">Les seize maisons développées par leurs quatre pôles '
      + '(bouclier, front, binôme, front du front). Chaque ligne pèse le profil de sa figure à cette place — les sept critères. '
      + 'Une ligne dont un pôle EST R1 ou R7 le tient ; une ligne qui est son antagoniste le détruit.</div>'
      + '<div class="kv" style="font-size:12px;"><b>R1</b> ' + n(a.figR1) + ' en M' + a.hR1
      + ' &nbsp;·&nbsp; <b>R7</b> ' + n(a.figR7) + ' en M' + a.hR7
      + ' &nbsp;·&nbsp; ' + (a.memeBoucle ? '<span style="color:#fbbf24;">MÊME BOUCLE — ' + a.partages.length
          + '/5 rôles partagés</span>' : 'boucles différentes') + '</div>'
      + '<div style="overflow-x:auto; margin-top:8px;"><table style="width:100%; border-collapse:collapse; font-size:11px;">'
      + '<tr style="color:#94a3b8;"><th style="text-align:left; padding:3px 4px;">M</th>'
      + '<th style="text-align:left;">figure</th><th style="text-align:right;">poids</th>'
      + '<th style="text-align:left;">bouclier · front · binôme · front du front</th>'
      + '<th style="text-align:right;">R1</th><th style="text-align:right;">R7</th></tr>';
    a.lignes.forEach(function (l) {
      var fond = l.estR1 ? 'rgba(56,189,248,.10)' : l.estR7 ? 'rgba(251,146,60,.10)'
        : (l.roleR1 || l.roleR7 || l.attaque) ? 'rgba(148,163,184,.06)' : 'transparent';
      h += '<tr style="background:' + fond + '; border-top:1px solid rgba(148,163,184,.15);">'
        + '<td style="padding:3px 4px; color:#94a3b8;">M' + l.maison + '</td>'
        + '<td>' + n(l.fig) + (l.estR1 ? ' <b style="color:#38bdf8;">= R1</b>' : '')
          + (l.estR7 ? ' <b style="color:#fb923c;">= R7</b>' : '')
          + (l.attaque ? ' <span style="color:#f87171;">⚔ détruit ' + esc(l.attaque) + '</span>' : '') + '</td>'
        + '<td style="text-align:right; color:' + (l.poids < 0 ? '#f87171' : '#cbd5e1') + ';">' + l.poids + '</td>'
        + '<td style="color:#94a3b8;">' + l.poles.map(function (p) {
            return (p === a.figR1) ? '<b style="color:#38bdf8;">' + n(p) + '</b>'
                 : (p === a.figR7) ? '<b style="color:#fb923c;">' + n(p) + '</b>' : n(p);
          }).join(' · ') + '</td>'
        + '<td style="text-align:right; color:#38bdf8;">' + (l.roleR1 ? esc(l.roleR1) + ' ' + l.gainR1 : (l.gainR1 ? l.gainR1 : '—')) + '</td>'
        + '<td style="text-align:right; color:#fb923c;">' + (l.roleR7 ? esc(l.roleR7) + ' ' + l.gainR7 : (l.gainR7 ? l.gainR7 : '—')) + '</td>'
        + '</tr>';
    });
    h += '<tr style="border-top:2px solid rgba(148,163,184,.4); font-weight:700;">'
      + '<td colspan="4" style="padding:4px;">TOTAL — pôles qui les tiennent</td>'
      + '<td style="text-align:right; color:#38bdf8;">' + a.totalR1 + ' (' + a.tenuR1 + ')</td>'
      + '<td style="text-align:right; color:#fb923c;">' + a.totalR7 + ' (' + a.tenuR7 + ')</td></tr>'
      + '<tr><td colspan="4" style="padding:4px; color:#f87171;">Assaillant direct (autre boucle)</td>'
      + '<td style="text-align:right; color:#f87171;">' + n(a.antaR1) + ' ' + a.contreR1 + '</td>'
      + '<td style="text-align:right; color:#f87171;">' + n(a.antaR7) + ' ' + a.contreR7 + '</td></tr>'
      + '</table></div>'
      + '<div class="kv" style="margin-top:8px; font-size:12px;"><b>Verdict :</b> '
      + (a.camp ? '<span class="good">' + a.camp + '</span>' : a.nul ? '<span style="color:#fbbf24;">NUL</span>' : '—')
      + ' — ' + esc(a.resume) + '</div>'
      + (function () {
          var ap = autoTestPolesV7();
          return '<div style="margin-top:8px; border:1px solid ' + (ap.ok ? '#4ade80' : '#f87171')
            + '; border-radius:9px; padding:8px 10px; font-size:11px;">'
            + '<b>Contrôle du tableau — ' + (ap.ok ? '✅ les 7 relations tiennent, 16/16' : '❌ incohérence') + '</b>'
            + '<div style="color:#94a3b8; margin-top:3px;">'
            + ap.controles.map(function (c) { return c.nom + ' — ' + c.ok + '/16'; }).join('<br>') + '</div>'
            + '<div style="color:#cbd5e1; margin-top:4px;">Le <b>binôme du front du front EST le bouclier</b> '
            + '((X+8)+2 = X+10) : la première colonne le contient déjà. Il n\'y a pas de cinquième pôle — '
            + 'les quatre colonnes plus la centrale font exactement le camp de cinq rôles.</div>'
            + (function () {
                var rf = null;
                try { rf = autoTestRelationsFiguresV7(); } catch (e) { return ''; }
                if (!rf) return '';
                var nom = function (f) { return FL[f] || f; };
                return '<div style="margin-top:7px; padding-top:6px; border-top:1px solid #334155; color:#cbd5e1;">'
                  + '<b>Ce que donne une figure combinée à ses propres relations</b> — '
                  + (rf.ok ? '<span style="color:#4ade80;">lois vérifiées</span>'
                           : '<span style="color:#f87171;">incohérence</span>')
                  + '<div style="color:#94a3b8; margin-top:3px;">'
                  + 'X + le front de son front (+8) = <b>Tristitia</b>, ' + rf.controles[1].ok + '/16. '
                  + 'X + lui-même = Populus, ' + rf.controles[0].ok + '/16.<br>'
                  + 'X + son binôme ne donne que ' + rf.controles[2].distinct + ' figures ('
                  + rf.controles[2].figures.map(nom).join(', ') + ') ; '
                  + 'X + son front, ' + rf.controles[3].distinct + ' ('
                  + rf.controles[3].figures.map(nom).join(', ') + ').<br>'
                  + 'Seules <b>' + rf.decalagesConstants.map(function (d) {
                      return nom(d.figure) + ' (+' + d.rangs + ')'; }).join(' et ')
                  + '</b> correspondent à un décalage constant de rangs — c\'est pour ça que le +8 est '
                  + 'la seule loi exacte.<br>'
                  + '<span style="color:#fbbf24;">« Une figure résulte antagoniste de son binôme » : '
                  + rf.claimBinomeAntagoniste + '/16 — la proposition ne tient pas sous cette forme.</span>'
                  + '</div></div>';
              })()
            + '</div>'; })()
      + (function () {
          var ax = autoTestAxesV7();
          var idxF = {}; FIGS_V7.forEach(function (f, i) { idxF[f] = i; });
          var NOMREL = { 0: 'même figure', 2: 'binôme', 3: 'victime', 4: 'front', 6: 'bouclier inv.',
            8: 'front du front', 10: 'bouclier', 12: 'front inv.', 13: 'antagoniste', 14: 'binôme inv.' };
          var lignes = '';
          try {
            for (var h = 1; h <= 6; h++) {
              var f1 = currentTheme[h], f2 = currentTheme[h + 6];
              var k = (((idxF[f2] - idxF[f1]) % 16) + 16) % 16;
              lignes += '<tr><td>M' + h + ' ' + esc(FL[f1] || f1) + '</td><td>↔</td>'
                + '<td>M' + (h + 6) + ' ' + esc(FL[f2] || f2) + '</td>'
                + '<td style="text-align:right; color:' + (k % 2 ? '#f87171' : '#4ade80') + ';">+' + k + '</td>'
                + '<td style="color:#cbd5e1;">' + (NOMREL[k] || '—')
                + (k % 2 ? ' · boucles opposées' : ' · même boucle') + '</td></tr>';
            }
          } catch (e) { lignes = ''; }
          return '<div style="margin-top:8px; border:1px solid ' + (ax.ok ? '#4ade80' : '#f87171')
            + '; border-radius:9px; padding:8px 10px; font-size:11px;">'
            + '<b>Les six axes d\'opposition — ' + (ax.ok ? '✅ les 2 lois tiennent — ' + ax.total
              + ' thèmes en garde-fou, 65 536/65 536 hors ligne' : '❌ loi en défaut') + '</b>'
            + '<div style="color:#94a3b8; margin-top:3px;">'
            + ax.controles.map(function (c) { return c.nom + ' — ' + c.ok + '/' + ax.total; }).join('<br>') + '</div>'
            + (lignes ? '<table style="width:100%; margin-top:6px; font-size:11px;">' + lignes + '</table>' : '')
            + '<div style="color:#cbd5e1; margin-top:4px;">Le décalage entre les deux bouts d\'un axe EST une '
            + 'relation. <b>Attention au sens</b> : le binôme est un décalage de +2, il n\'est pas réciproque — '
            + '+14 veut dire que c\'est la figure du BAS qui est le binôme de celle du haut. '
            + 'Le nombre d\'axes de boucles opposées est toujours pair (0, 2, 4 ou 6) : vérifié sur les '
            + '65 536 thèmes possibles.</div></div>'; })()
      + '<div class="muted" style="font-size:11px; margin-top:6px;">⚠️ Au banc ce moteur fait 4/10 — le plus faible, '
      + 'sous « toujours R7 » qui fait 6/10. Onze lectures du même tableau ont été mesurées (poids planchés à zéro, '
      + 'pôles seulement portés par une figure ancrée, sans la pénalité d\'antagoniste, règle de la même boucle '
      + 'inversée…) : toutes entre 3/10 et 5/10. Il ne pilote rien.</div>';
    panel.innerHTML = h;
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════
// MOTEUR « SEPT CRITÈRES » (28/08/26, reproche d'Ellemine_D)
//
// « Le problème réside dans la manière dont tu as fait la logique
// analytique : tu n'appliques pas vraiment les critères. »
//
// L'AUDIT LUI DONNE RAISON. Ce qui décide, dans chaque moteur — le
// nombre qui est réellement comparé entre R1 et R7 :
//   Front 4 · Pôle 4 .......... profilFigureMaison, les SEPT critères ✓
//   Ancrage développé ......... chaîne + rôles reçus + rôles exercés +
//                               régénération — dont la chaîne ne pèse que
//                               la PRÉSENCE (POIDS_CHAINE_V7 : ancre 3,
//                               renfort 1, résultante 0,5, absent −3)
//   Solidité de chaîne ........ cette même présence, et rien d'autre
//   Duel du bouclier .......... forceCampV7.total = concordance +
//                               alignement, soit DEUX critères sur sept
//   2 boucliers rompus ........ le même duel
//   Lecture des sièges ........ deux étiquettes de getInterpretationFootball
//                               (une couleur, un mot sur les buts) — AUCUN critère
//   Boucles antagonistes ...... appartenance de boucle — AUCUN critère
//   Majorité des axes ......... rejoue les verdicts sur les thèmes dérivés,
//                               donc hérite de tout ce qui précède
// Un seul moteur sur neuf décide vraiment sur les sept critères, et le
// vote les met tous à égalité : celui qui applique la doctrine est
// minoritaire huit contre un.
//
// CE MOTEUR-CI NE FAIT QUE ÇA. Chaque rôle du camp vaut le profil de sa
// figure aux SEPT critères, à sa meilleure position (profilFigureMaison
// via analyseFigureV7 — concordance ×10, déplacement, multiplicité,
// environnement, cohabitation, alignement actif, maison natale). Zéro si
// la figure est absente. Le camp vaut la somme de ses cinq rôles moins
// son antagoniste direct. Rien d'autre n'entre : ni présence brute, ni
// étiquette, ni seuil.
//
// ⚠️ MESURÉ AVANT D'ÊTRE ÉCRIT, ET IL NE FAIT PAS DE MIRACLE : 8/14 —
// exactement le score du verdict affiché, de F4P4 et du vote. Quatre
// variantes ont été comparées (avec ou sans le terme d'antagoniste,
// poids du fichier ou poids égaux, meilleure position ou somme des
// positions) : elles vont de 6/14 à 8/14. Appliquer les critères
// proprement ne fait donc pas monter le plafond sur ces quatorze cas —
// mais c'est la seule lecture dont on puisse dire ce qu'elle mesure.
// Il est le seul à trouver City/Madrid.
function moteurSeptCriteresV7(theme) {
  var rot = null;
  try { rot = getRotationCombat(theme); } catch (e) { rot = null; }
  if (!rot || !rot.figR1 || !rot.figR7) return { applicable: false };
  function valeur(f) {
    if (!f) return 0;
    var a = analyseFigureV7(f, theme);
    return a ? (a.ancrage || 0) : 0;
  }
  function camp(X) {
    var roles = [
      { role: 'centrale', fig: X },
      { role: 'front', fig: FRONT_V7[X] },
      { role: 'bouclier', fig: BOUCLIER_V7[X] },
      { role: 'binôme', fig: BINOMES_V7[X] },
      { role: 'front du front', fig: frontDuFrontV7(X) }
    ].map(function (r) { r.valeur = Math.round(valeur(r.fig) * 100) / 100; return r; });
    var ant = { role: 'antagoniste', fig: ANTAGONISTES_V7[X] };
    ant.valeur = Math.round(valeur(ant.fig) * 100) / 100;
    var total = roles.reduce(function (s, r) { return s + r.valeur; }, 0) - ant.valeur;
    return { fig: X, roles: roles, antagoniste: ant, total: Math.round(total * 100) / 100 };
  }
  var A = camp(rot.figR1), B = camp(rot.figR7);
  return {
    applicable: true, figR1: rot.figR1, figR7: rot.figR7, hR1: rot.hR1, hR7: rot.hR7,
    R1: A, R7: B,
    camp: A.total > B.total ? 'R1' : B.total > A.total ? 'R7' : null,
    ecart: Math.round(Math.abs(A.total - B.total) * 100) / 100,
    resume: 'sept critères — R1 ' + A.total + ' contre R7 ' + B.total
      + ' (antagonistes retranchés : ' + A.antagoniste.valeur + ' et ' + B.antagoniste.valeur + ')'
  };
}

// ═══════════════════════════════════════════════════════════════
// CE QUE CHAQUE CRITÈRE VAUT, MESURÉ UN PAR UN (28/08/26)
// « Creuse. » — Ellemine_D. Chaque critère du profil pris SEUL, appliqué
// aux cinq rôles du camp moins l'antagoniste, sur les quatorze cas au
// vainqueur connu :
//
//   critère          poids actuel   juste
//   déplacement            —         9/14   ← le meilleur, jamais muet
//   cohabitation          ×2         8/10   (4 muets) — meilleur taux
//   multiplicité         ×1,5        7/13
//   alignement actif      ×5         7/13
//   maison natale         ×6         6/9    (5 muets)
//   environnement        ×0,3        4/14
//   CONCORDANCE          ×10         4/12   ← LE PIRE, ET LE PLUS LOURD
//
// Le critère qui pèse dix fois plus que les autres est celui qui se
// trompe le plus.
//
// Sept pondérations du camp ont ensuite été comparées (mesure refaite
// après correction d'un cache fautif qui mélangeait les thèmes — les
// premiers chiffres étaient faux, ceux-ci sont les bons) :
//   les sept critères, poids du fichier (référence) ....... 8/14
//   sans la concordance SEULE ............................. 6/14
//   sans la concordance NI l'environnement ................ 9/14
//   déplacement + cohabitation ............................ 8/13 (1 muet)
//   déplacement + cohabitation + maison natale ............ 9/13 (1 muet)
//   cohabitation seule .................................... 9/12 (2 muets)
//   déplacement seul ...................................... 6/12 (2 muets)
// Retirer la concordance seule DÉGRADE ; la retirer avec l'environnement
// — les deux plus faibles — donne le meilleur score à couverture
// complète. La cohabitation seule fait mieux que tous les moteurs du
// fichier, mais se tait deux fois.
//
// ⚠️ QUATORZE CAS ET SEPT PONDÉRATIONS ESSAYÉES : ces écarts (6, 8 ou 9
// sur 12 à 14) sont dans le bruit, et rien n'est démontré. Je ne
// re-pondère donc PAS le profil — ce serait ajuster les poids sur
// l'archive, exactement le défaut qu'on reproche aux autres. Les trois
// lectures candidates entrent au banc pour être suivies match après
// match ; on tranchera vers vingt-cinq cas.
//
// Deux autres résultats de la même fouille, à garder :
// · le système n'a AUCUN biais de camp — réel R1 7 / R7 7, annoncé
//   R1 7 / R7 7, et 4/7 de justesse de chaque côté ;
// · sur treize cas sur quatorze, au moins un moteur trouve le bon camp
//   (le seul où aucun n'y arrive est ConjVia). L'information n'est donc
//   pas absente : c'est la sélection qui échoue, pas la lecture.
// ═══════════════════════════════════════════════════════════════
// ─── CORRIGÉ LE 28/08/26, SUR DEMANDE D'ELLEMINE_D ───
// « Neutralise la concordance SEULEMENT dans la comparaison R1/R7. »
// La première version choisissait aussi la MEILLEURE POSITION avec les
// poids réduits — donc elle retirait la concordance du profil par la
// bande, exactement ce que la mesure précédente avait montré coûteux.
// Désormais : la position est choisie par les SEPT critères, comme
// partout ailleurs ; seule la VALEUR retenue pour comparer les deux camps
// est amputée. Les deux étapes sont enfin séparées.
// Mesuré sur les 23 cas :
//     les sept critères (référence) ................. 15/23
//     concordance neutralisée dans la comparaison ... 14/23
//     concordance + environnement neutralisés ....... 16/23
//     environnement seul neutralisé ................. 15/23
// La demande littérale coûte un point ; c'est en retirant AUSSI
// l'environnement — les deux critères les plus faibles — qu'on obtient
// le meilleur score jamais mesuré sur cette archive.
function moteurCritereV7(theme, poids) {
  var rot = null;
  try { rot = getRotationCombat(theme); } catch (e) { rot = null; }
  if (!rot || !rot.figR1 || !rot.figR7) return { camp: null, detail: 'rotation indisponible' };
  function meilleur(f) {
    if (!f) return 0;
    var occ = trouverFigV7(f, theme) || [], best = null, val = 0;
    occ.forEach(function (o) {
      var pr = null;
      try { pr = profilFigureMaison(f, o.pos, theme); } catch (e) { pr = null; }
      if (!pr) return;
      // La position est choisie par le TOTAL des sept critères…
      if (best === null || pr.total > best.total) {
        best = pr;
        // …et seule la valeur comparée applique les poids demandés.
        val = 0;
        Object.keys(poids).forEach(function (c) { val += (pr.parts[c] || 0) * poids[c]; });
      }
    });
    return best === null ? 0 : val;
  }
  function camp(X) {
    return meilleur(X) + meilleur(FRONT_V7[X]) + meilleur(BOUCLIER_V7[X])
         + meilleur(BINOMES_V7[X]) + meilleur(frontDuFrontV7(X)) - meilleur(ANTAGONISTES_V7[X]);
  }
  var a = Math.round(camp(rot.figR1) * 100) / 100, b = Math.round(camp(rot.figR7) * 100) / 100;
  // Les deux totaux sont exposés : un consensus qui additionne des écarts
  // vaut mieux qu'un consensus qui compte des vainqueurs — encore
  // faut-il que l'écart veuille dire quelque chose. Voir margeCritereV7.
  return { camp: a > b ? 'R1' : b > a ? 'R7' : null, scoreR1: a, scoreR7: b, marge: Math.round((a - b) * 100) / 100,
    detail: 'R1 ' + a + ' contre R7 ' + b };
}
var POIDS_SANS_CONCORDANCE_V7 = { concordance: 0, deplacement: 1, multiplicite: 1,
  environnement: 1, cohabitation: 1, activation: 1, maisonNatale: 1 };
var POIDS_COHABITATION_SEULE_V7 = { concordance: 0, deplacement: 0, multiplicite: 0,
  environnement: 0, cohabitation: 1, activation: 0, maisonNatale: 0 };
var POIDS_SANS_CONC_ENV_V7 = { concordance: 0, deplacement: 1, multiplicite: 1,
  environnement: 0, cohabitation: 1, activation: 1, maisonNatale: 1 };

// Interrupteur du pilote (28/08/26). true : la lecture des critères, sans
// concordance ni environnement dans la comparaison, décide du verdict
// affiché. false : F4P4 reprend la tête, comme avant. Un caractère.
var PILOTE_CRITERES_V7 = true;

// Le panneau : les cinq rôles de chaque camp, avec leur valeur aux sept
// critères, et l'antagoniste retranché. Rien d'autre n'entre dans le
// total — c'est vérifiable ligne à ligne.
function toggleSeptCriteresPanel() {
  var panel = document.getElementById('sept-criteres-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    if (!currentTheme) { panel.innerHTML = '<div class="warn">Lance un thème d\'abord.</div>'; panel.style.display = 'block'; return; }
    var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); };
    var n = function (f) { return esc(FL[f] || f || '—'); };
    var a = null;
    try { a = moteurSeptCriteresV7(currentTheme); } catch (e) { a = null; }
    if (!a || !a.applicable) { panel.innerHTML = '<div class="warn">Indisponible sur ce thème.</div>'; panel.style.display = 'block'; return; }
    function colonne(c, titre, couleur) {
      var h = '<div style="flex:1 1 240px; border:1px solid ' + couleur + '; border-radius:11px; padding:10px 12px;">'
        + '<div style="font-weight:800; color:' + couleur + '; font-size:13px;">' + titre + ' — ' + n(c.fig) + '</div>'
        + '<table style="width:100%; border-collapse:collapse; font-size:11.5px; margin-top:6px;">';
      c.roles.forEach(function (r) {
        h += '<tr><td style="color:#94a3b8; padding:2px 0;">' + esc(r.role) + '</td>'
          + '<td>' + n(r.fig) + '</td>'
          + '<td style="text-align:right; color:' + (r.valeur > 0 ? '#4ade80' : r.valeur < 0 ? '#f87171' : '#64748b') + ';">'
          + r.valeur + '</td></tr>';
      });
      h += '<tr><td style="color:#f87171; padding:2px 0;">− antagoniste</td><td>' + n(c.antagoniste.fig) + '</td>'
        + '<td style="text-align:right; color:#f87171;">−' + c.antagoniste.valeur + '</td></tr>'
        + '<tr style="border-top:1px solid rgba(148,163,184,.3); font-weight:800;">'
        + '<td colspan="2" style="padding-top:4px;">TOTAL</td>'
        + '<td style="text-align:right; padding-top:4px; color:' + couleur + ';">' + c.total + '</td></tr>'
        + '</table></div>';
      return h;
    }
    panel.innerHTML = '<h3 style="margin-bottom:2px;">🎯 Sept critères — la lecture stricte</h3>'
      + '<div class="muted" style="font-size:11px; margin-bottom:8px;">Chaque rôle vaut le profil de sa figure aux SEPT critères '
      + '(concordance, déplacement, multiplicité, environnement, cohabitation, alignement actif, maison natale), '
      + 'à sa meilleure position ; zéro si elle est absente. Le camp vaut la somme de ses cinq rôles moins son antagoniste direct. '
      + 'Rien d\'autre n\'entre — ni présence brute, ni étiquette, ni seuil.</div>'
      + '<div style="display:flex; gap:12px; flex-wrap:wrap;">'
      + colonne(a.R1, 'R1', '#38bdf8') + colonne(a.R7, 'R7', '#fb923c') + '</div>'
      + '<div class="kv" style="margin-top:8px; font-size:12px;"><b>Verdict :</b> '
      + (a.camp ? '<span class="good">' + a.camp + '</span>' : '<span style="color:#fbbf24;">égalité</span>')
      + ' — écart ' + a.ecart + '</div>'
      + '<div class="muted" style="font-size:11px; margin-top:6px;">⚠️ Au banc : 8/14 — à égalité avec le verdict affiché, '
      + 'F4P4 et le vote. Appliquer les critères proprement n\'a pas fait monter le plafond sur ces quatorze cas ; '
      + 'c\'est en revanche la seule lecture dont on sache exactement ce qu\'elle mesure. Les autres moteurs décident sur '
      + 'la présence brute (chaîne), sur deux critères (duel), ou sur des étiquettes (sièges).</div>';
    panel.style.display = 'block';
  } else {
    panel.style.display = 'none';
  }
}

// ═══════════════════════════════════════════════════════════════
// ✦ LE PARTAGE DE LA SYNTHÈSE (31/08/26) — demande d'Ellemine_D
//
// « Pour le partage, ajoute les deux témoins et regarde M15, son
// jugement. » Autrement dit : appliquer la lecture du partage — celle
// du théorème d'Ellemine — non plus aux deux camps, mais aux deux
// TÉMOINS (M13, M14) et au JUGE (M15).
//
// Rappel de structure, vérifié sur les 65 536 thèmes : M15 = M13 + M14,
// toujours, par construction. Le Juge EST la somme de ses deux témoins.
//
// LA RÈGLE QUI EN SORT :
//     les trois figures M13, M14, M15 ont-elles TROIS éléments
//     différents ?  oui → R1 · non → R7
//
// ✔ ET C'EST LE MEILLEUR RÉSULTAT DE CAMP DU FICHIER, DE LOIN.
// Sur les 37 matchs décidés de l'archive :
//     LA RÈGLE ................ 29/37   78 %
//     le verdict affiché ...... 22/37   59 %
//     F4P4 seul ............... 23/37   62 %
//     critères seuls .......... 23/37   62 %
// Découpé par camp réel — le contrôle qui a piégé deux fois déjà :
//     R1 gagne : la règle 14/21 (67 %) · l'écran 11/21 (52 %)
//     R7 gagne : la règle 15/16 (94 %) · l'écran 11/16 (69 %)
//     équilibré : règle 80 % · écran 61 % · témoin « toujours R1 » 50 %
// Elle n'est pas un doublon du verdict : elle en diverge sur 12 des 37.
//
// ✔ LES CONTRÔLES QU'ELLE PASSE :
//   • ce n'est pas un effet du nul : sur les décidés seuls, 14/15 contre
//     7/22, p = 0,0002 (elle est PLUS forte sans les nuls).
//   • la configuration n'est pas rare : 34,4 % des 65 536 thèmes, 39 %
//     de l'archive. Pas une poignée de cas exotiques.
//   • le sens tient dans les DEUX moitiés de l'archive : première
//     moitié p = 0,005, seconde p = 0,156 — plus faible mais du même
//     côté, jamais inversé.
//   • correction pour tests multiples : elle sort d'un balayage de 40
//     croisements (seuil 0,0013) et le p brut est 0,0009 : elle survit.
//     Et même contre TOUS les tests de la journée — environ 150 entre
//     le balayage de séparation, la grande fouille élémentaire et
//     celui-ci — 0,0002 × 150 = 0,03, encore sous 0,05.
//
// ═══ LA PASSE DE RENFORCEMENT (31/08/26) ═══
// Ellemine_D : « on trouve une piste et tu cherches immédiatement ce qui
// la contredit au lieu de ce qui la renforce ; avec ça on tourne en rond,
// même une bonne piste on va la minimiser. »
// Il a raison sur un point précis et il faut l'écrire : j'avais lancé
// QUATRE contrôles de robustesse sur cette règle et ZÉRO tentative de
// l'améliorer. Vérifier qu'une piste n'est pas un mirage et chercher sa
// meilleure forme sont deux travaux différents ; je n'avais fait que le
// premier. Voici le second.
//
// ✔ CE QU'IL A FALLU REGARDER : LES RATÉS. Sur les 8 erreurs de la règle,
// SEPT sont « dit R7, réel R1 ». La faiblesse est d'un seul côté, et ça
// ne se voyait pas dans le score global.
//     branche « trois différents » → R1 ....... 14/19  74 %  p = 0,0065
//     branche « au moins deux pareils » → R7 ... 15/30  50 %  p = 0,036
// Les deux branches n'ont rien à voir. La première tire 39 % des thèmes
// et gagne trois fois sur quatre ; la seconde est à peine au-dessus de
// son taux de base. Lues ensemble, la mauvaise diluait la bonne.
//
// ✔ ET LA BRANCHE R1 SE RENFORCE, POUR UNE RAISON MÉCANIQUE.
// Ses 5 erreurs sont 1 victoire de R7 et QUATRE NULS. Ce n'est donc pas
// le camp qu'elle lit mal, c'est le nul qu'elle ne voit pas. On lui donne
// donc le seul détecteur de nul qui ait un dossier :
//     trois différents (nue) ...................... 14/19  74 %  p = 0,0065
//     + porte du nul FERMÉE ....................... 13/16  81 %  p = 0,0020
//     + F4P4 dit R1 ............................... 11/13  85 %  p = 0,0026
//     + camp doublé = R1 (théorème d'Ellemine) ....  6/8   75 %  p = 0,070
// La forme retenue est « trois différents ET porte fermée » : 81 %, et
// elle parle encore sur 16 thèmes sur 49 — un tiers. Contre elle il ne
// reste qu'UNE victoire de R7 et deux nuls. Le renfort par F4P4 monte à
// 85 % mais ne parle plus que sur 13, et il fait dépendre la règle d'un
// moteur qui, seul, est à 62 %.
// Ce n'est pas un réglage sur mesure : on ne cherche pas le seuil qui
// maximise le score, on retire la famille d'erreurs identifiée dans les
// ratés avec l'outil déjà validé pour elle.
//
// ☠️ ET POURQUOI ELLE N'EST PAS BRANCHÉE. Elle a été DÉCOUVERTE sur ces
// 49 cas. C'est exactement la situation de tout ce qui a échoué ici :
// la porte du nul, corrigée deux fois sur cette archive, y fait 42/49
// et n'a jamais été testée à l'aveugle ; la bande d'accord faisait 79 %
// à 19 cas et vaut 67 % à 37. Un chiffre trouvé dans les données qui
// l'ont produit n'est pas une prédiction, c'est une description.
// Elle est donc notée au banc, affichée, et elle ne décide de RIEN.
// CE QUI LA FERAIT BRANCHER : des cas gelés AVANT le match. Dix lignes
// de journal où elle tient, et elle passe devant la chaîne. C'est le
// seul chemin, et il ne dépend plus du code.
function partageSyntheseV7(theme) {
  if (!theme || !theme[13] || !theme[14] || !theme[15]) return null;
  var e13 = ELEMENTS_V7[theme[13]], e14 = ELEMENTS_V7[theme[14]], e15 = ELEMENTS_V7[theme[15]];
  if (!e13 || !e14 || !e15) return null;
  var tousDifferents = (e13 !== e14 && e14 !== e15 && e13 !== e15);
  return { camp: tousDifferents ? 'R1' : 'R7', tousDifferents: tousDifferents,
    e13: e13, e14: e14, e15: e15,
    fig13: theme[13], fig14: theme[14], fig15: theme[15],
    partages: (e13 === e14 ? 1 : 0) + (e14 === e15 ? 1 : 0) + (e13 === e15 ? 1 : 0) };
}

// ═══════════════════════════════════════════════════════════════
// ✦ LE MOTEUR DE LA DESTRUCTION (31/08/26) — issu de la récolte
//
// Il demande un moteur bâti sur la récolte. Le voici, avec son dossier
// complet, et le dossier commence par une mauvaise nouvelle qu'il faut
// lire avant le reste.
//
// ☠️ LA RÉCOLTE N'A PAS DONNÉ DE MOTEUR DE CAMP. Quatorze lois de
// structure, toutes vraies, et AUCUNE ne bat le hasard sur les 39 duels
// de l'archive. Huit lectures tirées des lois J, K et L, mesurées :
//     k impair → R1 ................... 16/39  41 %  p = 0,337
//     k ≤ 8 → R1 ...................... 20/39  51 %  p = 1,000
//     k multiple de 4 → R1 ............ 15/39  38 %  p = 0,200
//     R1 en boucle A → R1 ............. 21/39  54 %  p = 0,749
//     R7 en boucle B → R1 ............. 18/39  46 %  p = 0,749
//     R1 plus loin du trait → R1 ...... 17/36  47 %  p = 0,868
//     R1 compatible élément avec R7 ... 19/39  49 %  p = 1,000
// Rien. Le taux de base est 23/39 = 59 % pour R1 ; aucune lecture n'y
// touche. Une structure exacte n'est pas une structure prédictive, et
// c'est le résultat qu'il faut retenir de la récolte.
//
// 📌 IL RESTE UNE SEULE CHOSE, ET ELLE EST ÉTROITE.
// Quand R1 et R7 sont en relation DIRECTE de destruction — c'est-à-dire
// quand l'un est l'antagoniste de l'autre, k = 1 ou k = 15 (loi J.1) —
// le destructeur gagne :
//     Inter ........ Laetitia détruit Via ......... R1  ✔
//     FortMajVia ... Via est détruite par Tristitia  R7  ✔
//     PuerLaet ..... Puer détruit Albus ........... R1  ✔
//     AmisTrist .... Via est détruite par Tristitia  R7  ✔
//     CarcPuella ... Caput détruit Amissio ........ R7  ✘
//     FortMajFMin .. Rubeus est détruit par Albus .. R7  ✔
//     ➜ 5 sur 6.  p = 0,219 (binomial bilatéral). n = SIX.
// ⚠️ Et deux des six portent la MÊME paire (Tristitia vs Via) : il n'y
// a donc que cinq configurations distinctes. Ce n'est pas une preuve,
// c'est une piste — la seule que quatorze lois aient produite.
//
// ✔ PREMIÈRE SORTIE À L'AVEUGLE (01/09/26) — Aston Villa 0-1 Arsenal.
//     Sur le thème MACHINE : Acquisitio (R7) est l'antagoniste de
//     Laetitia (R1), donc R7 détruit R1 → R7. RÉEL : R7. JUSTE.
//     C'est sa première prédiction faite avant le match, et elle tombe
//     juste là où l'écran se trompait. Le dossier passe à 6/7.
//     ⚠️ n = SEPT. p brut 0,125. Rien n'est démontré ; il reste horsVote
//     et il le restera jusqu'à dix déclenchements gelés.
//
// ➜ IL EST DONC MUET SUR 33 DUELS SUR 39, ET horsVote. Il ne décide
// rien, il ne vote pas, il ne touche pas l'écran du verdict. Il est là
// pour être vérifié DEHORS, sur les prochains matchs, comme le partage
// de la synthèse avant lui. Dix déclenchements gelés et on rediscute.
function moteurDestructionV7(theme) {
  var r = null;
  try { r = getRotationCombat(theme); } catch (e) { return null; }
  if (!r || !r.figR1 || !r.figR7) return null;
  if (typeof detruitV7 !== 'function' || typeof ANTAGONISTES_V7 === 'undefined') return null;
  var n = function (f) { return (typeof FL !== 'undefined' && FL[f]) ? FL[f] : f; };
  if (detruitV7(r.figR1) === r.figR7) {
    return { camp: 'R1', direct: true, figR1: r.figR1, figR7: r.figR7,
      detail: n(r.figR1) + ' est l\'antagoniste de ' + n(r.figR7) + ' : R1 détruit R7 (+3 maisons)' };
  }
  if (detruitV7(r.figR7) === r.figR1) {
    return { camp: 'R7', direct: true, figR1: r.figR1, figR7: r.figR7,
      detail: n(r.figR7) + ' est l\'antagoniste de ' + n(r.figR1) + ' : R7 détruit R1 (+3 maisons)' };
  }
  return { camp: null, direct: false, figR1: r.figR1, figR7: r.figR7,
    detail: 'aucune relation directe de destruction entre R1 et R7 — le moteur se tait' };
}

var MOTEURS_V7 = [
  { cle: 'destruction_directe', nom: 'Destruction directe — R1 et R7 antagonistes', icone: '⚔', teinte: '#f87171',
    note: 'issu de la récolte (loi J, 31/08) — 6/7 après Aston Villa-Arsenal, dont la PREMIÈRE sortie à l\'aveugle, juste (R7) · reste n = SEPT et six configurations distinctes, p brut 0,125 · muet sur 34 duels sur 41 · piste gelée, ne décide de rien',
    juste: 0, total: 0, horsVote: true,
    verdict: function (t) {
      var d = moteurDestructionV7(t);
      if (!d || !d.camp) return null;
      return { camp: d.camp, detail: d.detail };
    } },
  { cle: 'partage_synthese', nom: 'Partage de la synthèse — M13, M14, M15 à l\'élément', icone: '✦', teinte: '#facc15',
    note: 'doctrine Ellemine_D (31/08) — 31/41 · ses DEUX premières sorties à l\'aveugle sont justes : R7 sur les deux thèmes gelés d\'Aston Villa-Arsenal, là où l\'écran disait R1 puis nul · mais les deux portent le MÊME match, cela ne fait qu\'UNE observation · découverte sur l\'archive, notée, jamais décisive',
    juste: 0, total: 0, horsVote: true,
    verdict: function (t) {
      var p = partageSyntheseV7(t);
      if (!p) return null;
      var n = function (f) { return (typeof FL !== 'undefined' && FL[f]) ? FL[f] : f; };
      return { camp: p.camp,
        detail: 'M13 ' + n(p.fig13) + ' (' + p.e13 + ') · M14 ' + n(p.fig14) + ' (' + p.e14 + ') · M15 '
          + n(p.fig15) + ' (' + p.e15 + ') → '
          + (p.tousDifferents ? 'trois éléments différents' : 'au moins deux partagent') };
    } },
  { cle: 'partage_r1_ferme', nom: 'Partage · trois éléments différents ET porte du nul fermée → R1', icone: '✦', teinte: '#fb923c',
    note: 'la forme renforcée (31/08) — 13/16 soit 81 % quand on COMPTE les nuls (c\'est le chiffre du pari : contre elle il reste 1 victoire de R7 et 2 nuls), 13/14 sur le banc qui les écarte · contre 43 % de taux de base, p = 0,0020 · parle sur un tiers des thèmes · découverte sur l\'archive : notée, jamais décisive',
    juste: 0, total: 0, horsVote: true,
    verdict: function (t) {
      var p = partageSyntheseV7(t);
      if (!p || !p.tousDifferents) return null;
      var porte = false;
      try { porte = !!nulParPorteV7(t); } catch (e) { porte = false; }
      if (porte) return null;
      return { camp: 'R1', detail: 'trois éléments différents (' + p.e13 + '/' + p.e14 + '/' + p.e15
        + ') et porte du nul fermée' };
    } },
  // ─── LES DIX MOTEURS VOTANTS SONT RETIRÉS (01/09/26) ───
  // Ellemine_D : « retire-les aussi. » Ils ne décidaient plus rien
  // depuis que la cascade est partie — le camp vient du seul moteurV8V7.
  // Retirés : sept_criteres · table_poles · ancrage · chaine · duel ·
  // f4p4 · sieges · axes · boucles · hypo.
  // ⚠️ Leurs FONCTIONS sous-jacentes restent (moteurF4P4V7,
  // moteurCritereV7, lectureSiegesR1R7, analyseAncrageDeveloppe,
  // analyserReseauAncrageV2, tablePolesV7…) : elles servent encore aux
  // panneaux de lecture et au banc. C'est le VOTE qui disparaît, pas la
  // doctrine.
  // Ne restent ici que les trois moteurs horsVote, ceux dont le dossier
  // est en cours de vérification à l'aveugle sur les matchs gelés.
];

// ═══════════════════════════════════════════════════════════════
// « LES DEUX MARQUENT » — ÉTAT RÉEL APRÈS LE 0-0 DU 14/02/2026
//
// Ellemine_D : « si tu parviens à saisir la raison tu pourras corriger
// les deux marquent obligatoirement ». Cherché sérieusement. Je n'ai
// pas trouvé la raison, et voici exactement ce qui a été mesuré, pour
// que personne ne reparte de zéro.
//
// LE DIAGNOSTIC D'ABORD, ET IL EST DUR. Sur les 22 cas où l'on sait si
// les deux ont marqué (9 oui, 13 non) :
//   témoin « il n'y en a jamais deux » ................. 13/22
//   ROTATION · ouverte OU (fermée et active) ........... 15/22
//   matchFermeOuvert (< 7 maisons fermées) ............. 14/22
//   SIÈGES FIXES · M1 et M7 toutes deux ouvertes ....... 12/22
//   ROTATION · R1 et R7 toutes deux ouvertes ........... 12/22
//   SIÈGES FIXES · chacune ouverte OU (fermée+active) .. 10/22
//   SIÈGES FIXES · au moins une des deux ouverte ....... 9/22
//   témoin « toujours oui » ............................ 9/22
// Toutes les lectures par l'ouverture sont au niveau du témoin ou en
// dessous. La question « les deux marquent » n'a donc AUCUNE règle qui
// marche aujourd'hui — les trois moteurs branchés ne valent pas mieux
// que de répondre « non » à chaque fois.
//
// LA RÉFUTATION QUI TRANCHE, ET ELLE TIENT EN UN SEUL CAS. Le thème du
// 14/02 porte M1 = Carcer (fermée, passive) et M7 = Conjonctio (fermée,
// active) : 0-0. Le thème « Jeudi 27/08 » porte EXACTEMENT le même
// couple — M1 Carcer, M7 Conjonctio — et il a fini 1-2, les deux
// marquant. Mêmes sièges fixes, mêmes natures, résultats opposés.
// L'ouverture des sièges ne peut pas être la raison. Ce n'est pas une
// statistique faible, c'est un contre-exemple exact.
//
// CE QUI NE PRÉDIT PAS LE NOMBRE DE BUTS NON PLUS (22 cas au score) :
//   ancrage total R1+R7 ............ r = 0,00
//   le plus faible des deux camps .. r = −0,02
//   maisons ouvertes sur 16 ........ r = 0,22
//   figures actives sur 16 ......... r = 0,35   (n=22, p≈0,11)
// Le 0-0 est au milieu de chacune de ces échelles : 10 ouvertes sur 16,
// 9 actives, ancrage 65,8. Rien ne le distingue.
//
// ⚠️ ET LE PIÈGE À NE PAS PRENDRE. Un balayage de 116 traits sur ces
// 22 cas sort « M9 est mobile » à 17/22. C'est du bruit : avec un
// partage 9 contre 13, le meilleur de 116 traits dépasse le témoin par
// pure chance, et « M9 mobile » ne veut rien dire pour des buts. Rien
// n'est branché sur cette base.
//
// CE QU'IL FAUDRAIT POUR AVANCER : des 0-0 et des 1-0, pas des 4-4.
// L'archive n'a qu'UN seul 0-0. Une règle du « personne ne marque » ne
// peut pas naître d'un cas unique, et il ne faut pas essayer.
var MOTEURS_BTTS_V7 = [
  // ─── LA MAISON DE R1, EN TÊTE DEPUIS LE 29/08 ───
  // 20/25 contre 17/25 à la chaîne et 15/25 au témoin. p = 0,007, et le
  // signal survit au contrôle par le nombre de buts (voir le bloc de
  // mesure dans buildVerdictCard). Il n'attrape que 6 des 10 BTTS réels :
  // quand il dit oui, crois-le ; quand il se tait, il ne dit rien.
  // ─── LE CROISEMENT BRANCHÉ DEPUIS LE 30/08 ───
  // ─── LA RÈGLE BRANCHÉE DEPUIS LE 30/08 : TROIS ÉTAGES ───
  { cle: 'btts_trois_etages', nom: 'BTTS · Conjunctio, puis maison de R1, puis Puer', icone: '🪜', teinte: '#22c55e',
    juste: 0, total: 0, note: 'branché — 25/29 · Conjunctio absent 9/9 · cadent+Conjunctio 7/8 · zone faible départagée par Puer succédent 4/6 et 5/6',
    verdict: function (t) {
      var r = null;
      try { r = getRotationCombat(t); } catch (e) { return null; }
      if (!r || !r.hR1) return null;
      var conj = false;
      for (var h = 1; h <= 16; h++) { if (t[h] === 'conjunctio') { conj = true; break; } }
      if (!conj) return { oui: false, detail: 'Conjunctio absent — pas d\'échange' };
      var cad = [3, 6, 9, 12].indexOf(r.hR1) >= 0;
      if (cad) return { oui: true, detail: 'R1 en M' + r.hR1 + ' cadente + Conjunctio' };
      var suc = [2, 5, 8, 11].some(function (h) { return t[h] === 'puer'; });
      return { oui: suc, detail: 'zone faible · Puer succédent ' + (suc ? 'oui' : 'non') };
    } },
  { cle: 'btts_cadent_conj', nom: 'BTTS · R1 cadent ET Conjunctio présent (sans Puer)', icone: '🔗', teinte: '#84cc16',
    juste: 0, total: 0, note: 'l\'étage du milieu seul — 23/29 · premier raté le 30/08 (FortMajLaet)',
    verdict: function (t) {
      var r = null;
      try { r = getRotationCombat(t); } catch (e) { return null; }
      if (!r || !r.hR1) return null;
      var conj = false;
      for (var h = 1; h <= 16; h++) { if (t[h] === 'conjunctio') { conj = true; break; } }
      var cad = [3, 6, 9, 12].indexOf(r.hR1) >= 0;
      return { oui: cad && conj,
        detail: 'R1 en M' + r.hR1 + (cad ? ' (cadente)' : '') + ' · Conjunctio ' + (conj ? 'présent' : 'ABSENT') };
    } },
  { cle: 'btts_puer_m8', nom: 'BTTS · Puer en M8 exactement', icone: '⑧', teinte: '#64748b',
    juste: 0, total: 0, note: 'la forme resserrée proposée le 30/08 — 3/5 quand il parle : PLUS FAIBLE que la succédente entière (6/10), et M5 donne le même résultat',
    verdict: function (t) {
      return { oui: t[8] === 'puer', detail: 'M8 = ' + (FL[t[8]] || t[8]) };
    } },
  { cle: 'btts_conjunctio', nom: 'BTTS · Conjunctio présent dans le thème', icone: '🔀', teinte: '#38bdf8',
    juste: 0, total: 0, note: 'méthode Ellemine_D par la nature des figures — 21/29 seul ; c\'est son ABSENCE qui vaut (0 BTTS sur 9)',
    verdict: function (t) {
      for (var h = 1; h <= 16; h++) { if (t[h] === 'conjunctio') return { oui: true, detail: 'Conjunctio en M' + h }; }
      return { oui: false, detail: 'Conjunctio absent des 16 maisons' };
    } },
  { cle: 'btts_puer', nom: 'BTTS · Puer en maison succédente', icone: '⚔', teinte: '#94a3b8',
    juste: 0, total: 0, note: 'théorie Ellemine_D (Puer marque et encaisse) — 6/10 quand il parle contre 6/18 sinon · BRANCHÉ comme départage de la zone faible, où il fait 4/6 contre 1/6 · battu par le verrou de Conjunctio sur leur premier désaccord',
    verdict: function (t) {
      var vu = [];
      for (var h = 1; h <= 16; h++) { if (t[h] === 'puer') vu.push(h); }
      if (!vu.length) return { oui: false, detail: 'Puer absent du thème' };
      var suc = vu.filter(function (h) { return [2, 5, 8, 11].indexOf(h) >= 0; });
      return { oui: suc.length > 0,
        detail: 'Puer en M' + vu.join(', M') + (suc.length ? ' — succédente' : ' — aucune succédente') };
    } },
  { cle: 'btts_cadent', nom: 'BTTS · R1 en maison cadente (seule)', icone: '🏠', teinte: '#84cc16',
    juste: 0, total: 0, note: 'la maison seule — 22/29',
    verdict: function (t) {
      var r = null;
      try { r = getRotationCombat(t); } catch (e) { return null; }
      if (!r || !r.hR1) return null;
      var cad = [3, 6, 9, 12].indexOf(r.hR1) >= 0;
      return { oui: cad, detail: 'R1 en M' + r.hR1 + (cad ? ' — cadente' : '') };
    } },
  { cle: 'btts_chaine', nom: 'BTTS · chaîne du perdant', icone: '⛓', teinte: '#4ade80',
    juste: 0, total: 0, note: 'ancienne source décisive — 17/25, gardée en contre-lecture',
    verdict: function (t) {
      var b = lectureDeuxMarquentV7(t);
      if (!b.applicable) return null;
      var a = analyseAncrageDeveloppe(t);
      return { oui: b.lesDeuxMarquent,
               detail: b.lesDeuxMarquent ? 'les deux marquent'
                 : 'muet : ' + (b.perdant === a.figR1 ? 'R1 ' : 'R7 ') + (FL[b.perdant] || '') };
    } },
  { cle: 'btts_rotation', nom: 'BTTS · ouverture des sièges', icone: '🪑', teinte: '#94a3b8',
    juste: 0, total: 0, note: 'calculé, plus décisif — 14/25, sous le témoin',
    verdict: function (t) {
      var o = lectureOuvertureButsV7(t);
      if (!o.applicable) return null;
      return { oui: o.lesDeuxMarquent, detail: o.lesDeuxMarquent ? 'les deux marquent' : 'un seul marque' };
    } },
  { cle: 'btts_score', nom: 'BTTS · « toujours oui »', icone: '➖', teinte: '#64748b',
    juste: 4, total: 9, note: 'témoin — le hasard à battre',
    verdict: function () { return { oui: true, detail: 'réponse constante' }; } }
];

