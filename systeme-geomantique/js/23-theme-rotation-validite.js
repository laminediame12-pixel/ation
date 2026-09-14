// ═══════════════════════════════════════════════════════════════
// THEME ROTATION VALIDITE
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
function calcTheme(m1,m2,m3,m4){
const t={1:m1,2:m2,3:m3,4:m4}; for(let col=0; col<4; col++){t[5+col]=figFromArray([MAP_GEO[t[1]][col],MAP_GEO[t[2]][col],MAP_GEO[t[3]][col],MAP_GEO[t[4]][col]]);} t[9]=combine(t[1],t[2]); t[10]=combine(t[3],t[4]); t[11]=combine(t[5],t[6]); t[12]=combine(t[7],t[8]); t[13]=combine(t[9],t[10]); t[14]=combine(t[11],t[12]); t[15]=combine(t[13],t[14]); t[16]=combine(t[15],t[1]); return t;}
function buildThemeFromMothers(m1,m2,m3,m4){return calcTheme(m1,m2,m3,m4);} 
// ROTATION — règle canonique : la figure en M1 donne sa maison de repos naturelle.
// Cette maison de repos est le début R1 de la rotation.
// Exemple : Caput Draconis en M1 -> repos M3 -> R1=M3 et R7=M9.
function getMaisonReposFigure(fig){
  const idx = FIGS_V7.indexOf(fig);
  return idx >= 0 ? idx + 1 : 1;
}
function getRotationOrderFromRepos(m1Fig){
  const start = getMaisonReposFigure(m1Fig);
  return Array.from({length:16},(_,i)=>((start-1+i)%16)+1);
} 
// ═══════════════════════════════════════════════════════════════
// 🔄 RÉFÉRENCE OFFICIELLE DU COMBAT — M1 NE COMBAT PAS M7
// M1 sert UNIQUEMENT d'ancre : sa figure détermine la maison où commence
// la rotation. Une fois l'anneau construit, les deux positions comparées
// sont R1 et R7. Le vainqueur doit donc toujours être calculé à partir de
// theme[hR1] contre theme[hR7], jamais à partir de theme[1] contre theme[7].
// ═══════════════════════════════════════════════════════════════
function getRotationCombat(theme){
  const anchorFigure = theme[1];
  const order = getRotationOrderFromRepos(anchorFigure);
  const hR1 = order[0];
  const hR7 = order[6];
  return {
    anchorFigure,
    anchorHouse: 1,
    order,
    hR1,
    hR7,
    figR1: theme[hR1],
    figR7: theme[hR7]
  };
}
function getRotationNumber(housePos,m1Fig){const start=getMaisonReposFigure(m1Fig); return ((housePos-start+16)%16)+1;}
function rollOneMother(){const rolls=Array.from({length:4},()=>Array.from({length:4},()=>randomDie())); const points=rolls.map(set=>oddEvenToPoint(set.reduce((a,b)=>a+b,0))); return {rolls,points,figure:figFromArray(points)};}
function rollAllMothersFromDice(){const mothers=[rollOneMother(),rollOneMother(),rollOneMother(),rollOneMother()]; ['m1','m2','m3','m4'].forEach((id,idx)=>document.getElementById(id).value=mothers[idx].figure); document.getElementById('dice-output').innerHTML=mothers.map((m,idx)=>`<div class="kv"><b>Mère ${idx+1}</b> — lancers: ${m.rolls.map(r=>`[${r.join(', ')}]`).join(' ')} | points: ${m.points.join('-')} | figure: ${FL[m.figure]}</div>`).join(''); launchTheme(false);}
// RÉSONANCE AXES/JOUR (16/07/26, demande utilisateur) : pour éviter que
// le thème "parle d'autre chose" (aucun lien avec les axes structurels
// ni le climat du jour), le tirage بسم الله exige maintenant aussi que
// au moins 2 des 3 figures suivantes soient présentes dans le thème :
// Axe Cardinal (M1+M4+M7+M10), Axe Cadent (M3+M6+M9+M12), figure du
// jour. Présence vérifiée en base uniquement, comme la validité axes
// déjà en place. ALIGNÉ le 25/08/26 sur base+résultante, comme les trois
// fonctions de validité. 📚 Piste utilisateur non encore
// validée sur des matchs réels — à observer.
function countAxesEtJourPresents(theme){
  const axeC = combineMany([theme[1],theme[4],theme[7],theme[10]]);
  // L'Axe Temporel a été retiré le 25/08/26 (ce n'était pas un axe du
  // carré). Le troisième signal de résonance devient l'Axe Cadent, qui
  // en est un — la règle reste « au moins 2 sur 3 ».
  const axeT = combineMany([theme[3],theme[6],theme[9],theme[12]]);
  const fdj = figureDuJour();
  const pres = fig => positionsBaseEtResultantes(fig, theme).length > 0;
  const presentC = pres(axeC);
  const presentT = pres(axeT);
  const presentJ = pres(fdj);
  const count = [presentC, presentT, presentJ].filter(Boolean).length;
  return {axeC, axeT, fdj, presentC, presentT, presentJ, count};
}
// ═══════════════════════════════════════════════════════════════
// VALIDITÉ À 100 % (28/08/26, test demandé par Ellemine_D)
//
// Son idée : « on fait les 3 thèmes des axes soient tous aussi valides,
// c'est-à-dire qu'ils respectent les conditions de validité (binôme, les
// 3 axes présents, figure du jour), pour que le thème soit à 100 % valide
// et qu'on ne puisse pas douter du verdict ». Le point de départ était
// que sur un match serré les moteurs ont du mal à trancher.
//
// Quatre niveaux, du plus lâche au plus strict :
//   0 — le thème de base est INVALIDE (un de ses 3 axes est absent) ;
//   1 — base valide (les 3 axes présents en base ou en résultante) ;
//   2 — + les trois thèmes dérivés (angulaire, succédent, cadent) sont
//       chacun valides par le même critère ;
//   3 — + le binôme de M1 est présent dans les QUATRE thèmes ;
//   et par-dessus, la figure du jour présente dans le thème de base.
//
// ⚠️ CE QUE ÇA DONNE, MESURÉ — ET ÇA NE VA PAS DANS LE SENS ESPÉRÉ.
// Fréquence, sur les 65 536 thèmes possibles (exhaustif) :
//     niveau 1 ... 47 491 (72,5 %)   niveau 2 ... 16 989 (25,9 %)
//     niveau 3 ....9 507 (14,5 %)    niveau 3 + figure du jour ≈ 13 %
// Le tirage est donc atteignable : environ un thème sur huit.
// Mais l'accord des moteurs NE MONTE PAS avec le niveau (échantillon de
// 676 thèmes) :
//     niveau 0 : 72,8 % d'accord moyen, 8,6 % de votes unanimes
//     niveau 1 : 73,7 %                 7,3 %
//     niveau 2 : 70,0 %                 3,5 %
//     niveau 3 : 73,0 %                 5,6 %
// Et la marge de F4P4 (écart d'ancrage entre R1 et R7) est plus FAIBLE
// au niveau 3 (23,04) qu'au niveau 1 (25,42). Un thème 100 % valide
// n'est donc pas un thème où le verdict est plus net.
// Enfin, dans l'archive : les trois cas les mieux validés — Inter et
// Napoli (niveau 3), PSG/Bayer (niveau 2) — sont exactement TROIS DES
// QUATRE CAS OÙ LE VERDICT S'EST TROMPÉ, alors que les cas de niveau 0
// et 1 sont justes 6 fois sur 7. Dix cas, ça ne démontre rien, mais ça
// pointe dans le sens inverse de l'hypothèse.
// La fonction et le bouton existent pour que le test puisse continuer
// avec de vrais matchs — pas parce que la validité renforcerait le
// verdict. Aucun poids sur le verdict, aucun filtre imposé.
function niveauValiditeV7(theme) {
  if (!theme || !theme[1]) return { niveau: 0, applicable: false };
  var present = function (f, t) { return positionsBaseEtResultantes(f, t).length > 0; };
  // MAINTENANCE (03/09/26) : les 5 chemins de validité (analyzeValidation ·
  // themeInvalidite · isThemeValideStrict · celui-ci · toggleValiditePanel)
  // partagent désormais un seul calcul, evaluerAxesValidite (cf.
  // combineMany) — plus de copie locale du test des axes à tenir à jour.
  var axes = function (t) {
    var r = evaluerAxesValidite(t);
    var byKey = {}; r.forEach(function (x) { byKey[x.key] = { fig: x.fig, ok: x.exists }; });
    byKey.ok = r.every(function (x) { return x.exists; });
    return byKey;
  };
  var binome = function (t) { var b = BINOMES_V7[t[1]]; return { fig: b, ok: present(b, t) }; };
  var base = { nom: 'thème de base', axes: axes(theme), binome: binome(theme) };
  var derives = [['angulaire', 'Axe Cardinal'], ['succedent', 'Axe Succédent'], ['cadent', 'Axe Cadent']]
    .map(function (d) {
      var t = null;
      try { t = getAxisThemeFromBase(theme, d[0]); } catch (e) { t = null; }
      if (!t) return { nom: d[1], absent: true, axes: { ok: false }, binome: { ok: false } };
      return { nom: d[1], cle: d[0], axes: axes(t), binome: binome(t) };
    });
  var fdj = figureDuJour();
  var fdjOk = present(fdj, theme);
  // Thème détruit : plus rien n'est à valider, le niveau est 0 quoi qu'il
  // arrive (règle traditionnelle, Rubeus ou Cauda Draconis en M1).
  var detruit = !!themeDetruit(theme);
  if (detruit) {
    return { applicable: true, niveau: 0, detruit: true, figM1: theme[1], base: base,
      derives: derives, fdj: fdj, fdjOk: fdjOk, complet: false,
      criteres: [
        { cle: 'axes', nom: 'les 3 axes du thème', ok: false },
        { cle: 'binome', nom: 'le binôme de M1', ok: false },
        { cle: 'fdj', nom: 'la figure du jour', ok: false }
      ],
      resume: 'THÈME DÉTRUIT — ' + (FL[theme[1]] || theme[1]) + ' en M1' };
  }
  // ═══════════════════════════════════════════════════════════════
  // LES DÉRIVÉS SORTENT DE LA VALIDATION (04/09/26) — Ellemine_D :
  // « ne compte plus les dérivés, prends seulement les 3 axes, binôme de
  // M1, figure du jour. »
  //
  // AVANT : un escalier de trois marches — axes de la base, puis axes des
  // TROIS THÈMES DÉRIVÉS, puis binômes de la base ET des trois dérivés.
  // Seize tests empilés, dont douze portaient sur des thèmes que le tirage
  // n'a pas produits. La figure du jour, elle, restait DEHORS, en mention
  // à côté du niveau.
  //
  // MAINTENANT : trois critères, tous sur le THÈME LUI-MÊME, un point
  // chacun, et la figure du jour entre dans le compte.
  //     1. les 3 axes du thème de base présents (Cardinal · Succédent · Cadent)
  //     2. le binôme de M1 présent
  //     3. la figure du jour présente
  //
  // ⚠️ CE QUE ÇA CHANGE POUR LA MESURE, ET IL FAUT LE DIRE. Le critère 3
  // dépend de la DATE : le même thème peut valoir 3/3 aujourd'hui et 2/3
  // demain. Le niveau n'est donc plus une propriété stable du thème, et
  // aucun taux de justesse « par niveau » mesuré sur l'archive ne peut
  // être cité comme une constante — il se recalcule chaque jour. C'était
  // déjà la raison pour laquelle le septième critère de validité n'avait
  // jamais été chiffré (cf. le bloc de porteConfianceV7 : 73 %/75 % un
  // jour, 67 %/77 % le lendemain, sur les MÊMES cas). Ce n'est pas un
  // obstacle ici — le niveau n'a plus aucun pouvoir sur le verdict depuis
  // que le rejet est levé — mais c'est une raison de plus de ne jamais le
  // rebrancher sur une décision.
  //
  // LES DÉRIVÉS NE DISPARAISSENT PAS DU FICHIER : ils restent calculés
  // dans `derives` et restent la matière de la PORTE DE CONFIANCE
  // (porteConfianceV7), qui est une autre lecture et le dit. Ils ne
  // comptent simplement plus dans CE niveau-ci.
  //
  // ── CE QUE LE NOUVEAU CRITÈRE DONNE, MESURÉ LE 04/09/26 ─────────
  // (figure du jour ce jour-là : Cauda Draconis — voir l'avertissement
  // ci-dessus, ces chiffres se recalculent demain)
  //
  // Le critère est BEAUCOUP moins sévère. Sur 3000 tirages aléatoires :
  //     niveau 0 ... 13,7 %      niveau 2 ... 33,0 %
  //     niveau 1 ... 10,9 %      niveau 3 ... 42,3 %
  // Un thème 3/3 passe de 14,5 % à 42,3 % — presque un sur deux au lieu
  // d'un sur sept. Sous le seuil : 57,7 % contre 92 % avec l'ancienne
  // définition.
  //
  // ET IL NE DISCRIMINE TOUJOURS PAS. Au banc sur 58 cas :
  //     camp (vainqueur/nul) ..... 68 % (28/41) au seuil  contre 67 % (10/15) sous  p = 1,000
  //     le nul (oui/non) ......... 83 % (34/41)           contre 87 % (13/15)       p = 1,000
  //     les deux marquent ........ 67 % (22/33)           contre 69 % (9/13)        p = 1,000
  //     score exact .............. 29 % (10/34)           contre 21 % (3/14)        p = 0,728
  //     match serré (écart ≤ 1) .. 71 % (24/34)           contre 50 % (7/14)        p = 0,201
  //     incident (somme d'axes) .. 63 % (5/8)             contre 33 % (1/3)         p = 0,545
  // Les écarts ont changé de SENS — deux familles sur six penchent encore
  // vers le rejet, contre quatre sur cinq avant — mais aucun n'atteint la
  // significativité : p de 0,201 à 1,000. On n'a pas gagné un pouvoir de
  // tri, on a changé la répartition d'un tri qui n'en a pas.
  // Par niveau, la bosse reste : 0/3 → 75 % (3/4), 1/3 → 100 % (1/1),
  // 2/3 → 60 % (6/10), 3/3 → 68,3 % (28/41). Les trois premiers groupes
  // pèsent 15 cas à eux trois — on ne conclut rien là-dessus.
  //
  // La précision d'archive, elle, ne bouge pas d'un cas : 38/56 = 67,9 %.
  // C'est attendu, et c'est la preuve que le changement est bien inerte
  // côté verdict : depuis que le rejet est levé, le niveau ne décide de
  // rien. Il décrit.
  // ═══════════════════════════════════════════════════════════════
  var criteres = [
    { cle: 'axes', nom: 'les 3 axes du thème', ok: !!base.axes.ok },
    { cle: 'binome', nom: 'le binôme de M1', ok: !!base.binome.ok },
    { cle: 'fdj', nom: 'la figure du jour', ok: !!fdjOk }
  ];
  var niveau = criteres.filter(function (c) { return c.ok; }).length;
  return { applicable: true, niveau: niveau, base: base, derives: derives,
    criteres: criteres, fdj: fdj, fdjOk: fdjOk, complet: niveau === 3,
    resume: 'niveau ' + niveau + '/3 — '
      + criteres.map(function (c) { return c.nom + ' ' + (c.ok ? '✓' : '✗'); }).join(' · ')
  };
}

// ══════════════════════════════════════════════════════════════
// LA PORTE DE CONFIANCE (29/08/26) — Ellemine_D
//
// « dérivés valides le thème tranche, sinon le verdict peut être faux,
// c'est de ça qu'il s'agit — pas de chercher dans les dérivés s'ils
// donnent raison au thème principal par le même verdict. »
//
// Ce n'est donc pas un second avis à comparer au verdict : c'est une
// AUTORISATION. Porte ouverte, le thème a le droit de trancher. Porte
// fermée, le verdict reste affiché mais il n'engage rien.
//
// SA PAIRE DU 29/08 LUI DONNE RAISON, ET AU MOT PRÈS.
//   thème 1  Tristitia / Populus / Acquisitio / Carcer
//            axes des dérivés : Cardinal ✔  Succédent ✘  Cadent ✘
//            annonce NUL 1-1 — FAUX
//   thème 2  Conjunctio / Tristitia / Populus / Acquisitio
//            axes des dérivés : Cardinal ✔  Succédent ✔  Cadent ✔
//            annonce R7 — JUSTE (3-2 pour R7)
// Un seul match, deux tirages, et le tirage dont les dérivés étaient
// valides est celui qui a vu juste. C'est exactement sa règle.
//
// ⚠️ CE QUE J'AI FAILLI ÉCRIRE À LA PLACE. J'avais d'abord noté ce
// thème 1 avec ses deux premières mères inversées (Populus / Tristitia).
// Le thème s'en trouvait tout autre : ses trois axes de dérivé étaient
// présents, il annonçait R1 au lieu du nul, et j'en concluais que la
// vraie porte n'était pas sur les axes mais sur les BINÔMES des dérivés
// (78 % contre 67 %, +12 points). Ellemine_D a corrigé les mères. Avec
// les bonnes, la porte des binômes tombe à 75 % contre 73 % — +2 points,
// p = 1,000, c'est-à-dire rien. Un seul thème mal recopié sur 35 avait
// fabriqué toute la découverte. C'est la mesure de ce que valent ces
// écarts à n = 35 : ils tiennent à une ligne.
//
// ☠️ ET L'ARCHIVE, ELLE, VA DANS L'AUTRE SENS. Justesse du verdict
// affiché selon le nombre d'axes de dérivé présents, 35 cas au camp
// connu (justesse globale 26/35 = 74 %) :
//     1 axe ....  5 justes /  6 ... 83 %
//     2 axes ... 12 justes / 14 ... 86 %
//     3 axes .... 9 justes / 15 ... 60 %
// Les trois axes présents : 60 %. Un axe qui manque : 85 %. Écart de
// −25 points, Fisher exact bilatéral p = 0,129 — le plus fort des sept
// critères de validité du fichier, et il pointe à l'envers de la règle.
// Ce n'est pas non plus un artefact de nuls : les thèmes à axes complets
// contiennent MOINS de nuls réels (2/15) que les autres (5/20).
// Les six autres critères ne disent rien qui vaille :
//     les 3 binômes des dérivés ...... 75 % / 73 %    +2 pts
//     niveau ≥ 2 .................... 64 % / 81 %   −17 pts
//     niveau = 3 .................... 73 % / 75 %    −2 pts
//     axes du thème de base ......... 72 % / 83 %   −11 pts
//     binôme de M1 dans la base ..... 74 % / 100 %  −26 pts
// ⚠️ Le septième critère, « niveau 3 + figure du jour », n'est pas
// mesurable de façon stable : la figure du jour dépend de la DATE, donc
// ce critère change de valeur sur les mêmes 35 cas d'un jour à l'autre
// (73 % / 75 % le 29/08, 67 % / 77 % le lendemain). Aucun chiffre le
// concernant ne doit être cité comme une mesure — c'est le seul critère
// du fichier dont la valeur dépende du moment où on la regarde.
//
// ALORS QUI A RAISON ? Personne encore. Sa paire est une observation
// propre — deux tirages, un match, le plus valide a gagné. L'archive est
// 35 observations qui penchent de l'autre côté sans atteindre le seuil.
// Trente-cinq cas ne battent pas une paire quand la paire teste une
// question que les 35 ne testent pas : « entre DEUX thèmes du MÊME match,
// lequel croire ? » n'est pas « un thème isolé est-il plus juste ? ».
// C'est pour ça que le comparateur de doubles tirages existe, et c'est
// lui qui tranchera — vers dix paires.
//
// D'ICI LÀ, LA PORTE NE TOUCHE À RIEN. Elle ne change ni le vainqueur,
// ni le score, ni le nul. Elle affiche l'état des dérivés au-dessus du
// verdict, avec le chiffre qui la contredit à côté. Brancher un p = 0,129
// à l'envers d'une règle, ou un p = 1,000 dans son sens, ce serait dans
// les deux cas décider à la place des résultats.
function porteConfianceV7(theme) {
  var nv = null;
  try { nv = niveauValiditeV7(theme); } catch (e) { nv = null; }
  if (!nv || !nv.applicable || !nv.derives) return null;
  var dets = nv.derives.map(function (d) {
    return { nom: d.nom,
      axes: !d.absent && !!(d.axes && d.axes.ok),
      binome: !d.absent && !!(d.binome && d.binome.ok),
      figBinome: d.binome ? d.binome.fig : null };
  });
  var nbAxes = dets.filter(function (d) { return d.axes; }).length;
  var nbBinomes = dets.filter(function (d) { return d.binome; }).length;
  var ouverte = nbAxes === 3;
  var manquants = dets.filter(function (d) { return !d.axes; })
    .map(function (d) { return d.nom; });
  // Taux d'archive par palier d'axes — chiffres du 29/08/26, 35 cas,
  // mères corrigées. Ils vont à l'ENVERS de la règle : c'est voulu qu'ils
  // s'affichent quand même.
  var taux = nbAxes === 3 ? 59 : nbAxes === 2 ? 86 : nbAxes === 1 ? 83 : null;
  var sur = nbAxes === 3 ? 17 : nbAxes === 2 ? 14 : nbAxes === 1 ? 6 : 0;
  return {
    ouverte: ouverte, nbAxes: nbAxes, nb: nbBinomes, nbBinomes: nbBinomes,
    dets: dets, manquants: manquants, taux: taux, sur: sur,
    detruit: !!nv.detruit, niveau: nv.niveau,
    texte: ouverte
      ? 'Les trois dérivés d\'axe ont leurs trois axes présents — selon ta règle, le thème a le droit de trancher.'
      : 'Dérivé' + (manquants.length > 1 ? 's' : '') + ' dont les axes ne sont pas tous présents : '
        + manquants.join(', ') + ' — selon ta règle, le verdict reste affiché mais il peut être faux.'
  };
}

// Tirage aux dés jusqu'à un thème 3/3 — depuis le 04/09/26 : les 3 axes
// du thème, le binôme de M1, la figure du jour (plus les dérivés, cf. le
// bloc de niveauValiditeV7). La condition est donc plus facile qu'avant
// et 200 essais suffisent largement. Si la boucle échoue, le dernier
// tirage reste — on ne force rien, on annonce ce qu'on a obtenu.
function rollUntilValid100Draw(){
  var essais = 0, v = null;
  do {
    rollAllMothersFromDice();
    essais += 1;
    v = currentTheme ? niveauValiditeV7(currentTheme) : null;
  } while (essais < 200 && !(v && v.complet && !v.detruit && currentAnalysis && currentAnalysis.rotation && currentAnalysis.rotation.valid));
  var out = document.getElementById('dice-output');
  if (!out || !v) return;
  var lignes = ['<b>Tirage 3/3</b> — ' + essais + ' essai(s) → '
    + (v.complet ? '<span style="color:#4ade80;">niveau 3/3 ✓</span>'
                 : '<span style="color:#fbbf24;">non atteint, ' + v.resume + '</span>')];
  (v.criteres || []).forEach(function (c) {
    lignes.push(c.nom + ' ' + (c.ok ? '✓' : '✗'));
  });
  lignes.push('<span style="color:#94a3b8;">binôme de M1 : ' + (FL[v.base.binome.fig] || '')
    + ' · figure du jour : ' + (FL[v.fdj] || v.fdj) + '</span>');
  out.innerHTML += '<div class="kv" style="font-size:11px; line-height:1.5;">' + lignes.join('<br>') + '</div>';
}

// ═══════════════════════════════════════════════════════════════
// LE TIRAGE DEPUIS LE MATCH (31/08/26) — « tu peux tirer à partir des
// infos d'un match à venir »
//
// Oui. Et il faut dire exactement ce que ça teste, parce que ce n'est
// PAS la même chose qu'un tirage à la main.
//
// ⚠️ CE QUE ÇA NE PEUT PAS FAIRE. Les quatre mères sont ici dérivées du
// NOM DES ÉQUIPES ET DE LA DATE, par un hachage. Rien dans ce calcul ne
// connaît le résultat du match ; le thème ne peut donc porter aucune
// information sur l'issue, par construction. Si une règle marche sur ces
// thèmes-là, elle ne lit pas le match — elle lit un taux de base. Un
// tirage machine ne peut pas VALIDER une règle.
//
// ✔ CE QUE ÇA PEUT FAIRE, ET C'EST PRÉCIEUX : le RÉFUTER. C'est un
// témoin. Si « trois éléments différents et porte fermée » sort encore
// à 81 % sur des thèmes dérivés d'un hachage, alors le 13/16 de
// l'archive ne venait pas d'une lecture du match, et la règle tombe.
//
// ✔ ET SURTOUT, LE PLAN APPARIÉ. Pour chaque match à venir, on garde
// DEUX thèmes : le sien, tiré à la main, et celui-ci, tiré du hachage.
// Même match, même résultat, deux thèmes. Au bout de dix matchs on ne
// saura pas seulement si la règle marche : on saura si LE TIRAGE À LA
// MAIN PORTE QUELQUE CHOSE QUE LE HACHAGE NE PORTE PAS. C'est la
// prémisse centrale du fichier, jamais testée depuis le premier jour, et
// ce plan la teste gratuitement, en même temps que la règle.
//
// Le hachage est déterministe et publié : mêmes équipes, même date,
// même heure → mêmes quatre mères, toujours. Il est vérifiable ligne à
// ligne, et je ne peux pas choisir les figures qui m'arrangent.
// ☠️ PREMIÈRE VERSION CASSÉE, TROUVÉE EN LA TESTANT AVANT DE LA
// PROPOSER. Je prenais les 4 bits de POIDS FAIBLE d'un FNV-1a sur des
// chaînes qui ne diffèrent que par leur DERNIER caractère (« …|mere1 »,
// « …|mere2 »…). Le dernier pas de FNV est une multiplication : les bits
// bas du produit sont presque déterminés par les bits bas des opérandes.
// Résultat mesuré sur 1 800 tirages : SEIZE paires (mère1, mère2)
// distinctes sur 256 possibles, et l'écart entre deux mères consécutives
// TOUJOURS IMPAIR (+1, +3, +5… jamais +2, +4, +6). Les verdicts
// sortaient à 43/19/38 au lieu de 39/37/24, et la règle renforcée ne se
// déclenchait sur AUCUN thème.
// Un générateur pareil aurait empoisonné en silence tout ce qu'on aurait
// mesuré avec. Corrigé par un brassage final (finalizer lowbias32) qui
// disperse les bits hauts vers les bas, et par un compteur placé AVANT
// la graine plutôt qu'après.
function hachageTexteV7(txt) {
  var v = String(txt || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
  var h = 0x811c9dc5;
  for (var i = 0; i < v.length; i++) {
    h = (h ^ v.charCodeAt(i)) >>> 0;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  // Brassage final : sans lui les bits bas restent corrélés.
  h = (h ^ (h >>> 16)) >>> 0;
  h = Math.imul(h, 0x7feb352d) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  h = Math.imul(h, 0x846ca68b) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h >>> 0;
}

// Les quatre mères d'un match, dérivées de ses seules données publiques.
// L'ordre des équipes compte (équipe 1 puis équipe 2) : c'est la même
// convention que R1/R7 dans tout le fichier.
function tirageDepuisMatchV7(equipe1, equipe2, date, heure) {
  var base = [equipe1, equipe2, date, heure].join('|');
  var meres = [];
  for (var k = 1; k <= 4; k++) {
    // le compteur EN TÊTE : deux graines pour la même mère ne partagent
    // plus leur fin de chaîne.
    meres.push(FIGS_V7[hachageTexteV7('m' + k + '|' + base) % 16]);
  }
  return { meres: meres, graine: base };
}

function rollUntilValidDraw(){
  let attempts=0;
  let resonance;
  do {
    rollAllMothersFromDice();
    attempts+=1;
    resonance = currentTheme ? countAxesEtJourPresents(currentTheme) : {count:0};
  } while(attempts<30 && !(currentAnalysis && currentAnalysis.rotation && currentAnalysis.rotation.valid
      && resonance.count >= 2 && !themeDetruit(currentTheme)));
  const detailRes = resonance.axeC ? `Axe Cardinal (${FL[resonance.axeC]}) ${resonance.presentC?'✓ présent':'✗ absent'} | Axe Cadent (${FL[resonance.axeT]}) ${resonance.presentT?'✓ présent':'✗ absent'} | Figure du jour (${FL[resonance.fdj]}) ${resonance.presentJ?'✓ présente':'✗ absente'} → ${resonance.count}/3` : '';
  document.getElementById('dice-output').innerHTML += `<div class="kv"><b>Essais :</b> ${attempts}</div><div class="kv" style="font-size:11px;">${detailRes}</div>`;
}
function getCurrentMotherValues(){return ['m1','m2','m3','m4'].map(id=>document.getElementById(id).value||'via');}

// ═══════════════════════════════════════════════════════════════
// IMPORT D'UNE IMAGE DE THÈME (25/08/26, demande Ellemine_D)
// Lit une capture de bouclier géomantique et en extrait les 4 mères.
// Tout se fait en local dans le navigateur : aucun réseau, aucune
// bibliothèque — le fichier reste utilisable hors ligne.
//
// GARDE-FOU CENTRAL : une mère mal lue produirait un thème entièrement
// faux, avec un verdict d'apparence normale et rien pour alerter. La
// lecture est donc CONTRE-VÉRIFIÉE par l'arithmétique du moteur : les
// 4 filles détectées dans l'image doivent être exactement celles que
// calcTheme recalcule à partir des 4 mères détectées. Si un seul point
// est mal lu, la concordance saute. Rien n'est lancé sans confirmation.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// DÉTECTION DES FIGURES DANS UNE CAPTURE DE BOUCLIER GÉOMANTIQUE
// Canvas + JS pur, aucune dépendance, fonctionne hors ligne.
// Principe : une figure est 4 lignes de 1 ou 2 points. On repère tous
// les points ronds de taille homogène, on les groupe en lignes puis en
// colonnes, et on lit la bande du haut (8 figures : 4 mères + 4 filles).
// ═══════════════════════════════════════════════════════════════
function detecterBouclier(img, options) {
  const opt = Object.assign({
    largeurMax: 900,
    seuilLuminance: 180,
    toleranceTaille: 0.35,
    minPointsParLigne: 6
  }, options || {});

  // ── 1. Rendu dans un canvas, réduit si l'image est très grande ──
  const scale = Math.min(1, opt.largeurMax / img.width);
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0, w, h);
  const px = cx.getImageData(0, 0, w, h).data;

  // ── 2. Binarisation sur la LUMINANCE, pas sur la couleur.
  //      POLARITÉ AUTOMATIQUE (25/08/26) : la première application donne
  //      des points sombres sur fond blanc, une autre des points blancs sur
  //      fond sombre. On ne peut pas choisir le sens à l'avance, alors on
  //      le déduit : la luminance MÉDIANE de l'image est celle du fond
  //      (c'est lui qui occupe la surface). Fond sombre → l'encre est
  //      claire, fond clair → l'encre est sombre. Le seuil se place à
  //      mi-chemin entre le fond et l'extrême opposé. ──
  const bin = new Uint8Array(w * h);
  const lums = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    lums[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
  }
  // Médiane par histogramme : bien plus rapide qu'un tri sur des millions
  // de pixels, et la précision au niveau de gris suffit largement.
  const histo = new Uint32Array(256);
  for (let i = 0; i < w * h; i++) histo[Math.min(255, Math.max(0, lums[i] | 0))]++;
  let cumul = 0, fond = 128;
  for (let v = 0; v < 256; v++) { cumul += histo[v]; if (cumul >= (w * h) / 2) { fond = v; break; } }
  const fondSombre = fond < 128;
  const seuil = fondSombre ? (fond + 255) / 2 : fond / 2 + opt.seuilLuminance / 2;
  for (let i = 0; i < w * h; i++) {
    const a = px[i * 4 + 3];
    if (a < 128) { bin[i] = 0; continue; }
    bin[i] = (fondSombre ? lums[i] > seuil : lums[i] < seuil) ? 1 : 0;
  }

  // ── 3. Composantes connexes (8-connexité), pile explicite ──
  const vu = new Uint8Array(w * h);
  const taches = [];
  const pile = [];
  for (let s = 0; s < w * h; s++) {
    if (!bin[s] || vu[s]) continue;
    let minX = w, maxX = 0, minY = h, maxY = 0, n = 0, sx = 0, sy = 0;
    pile.push(s); vu[s] = 1;
    while (pile.length) {
      const p = pile.pop();
      const x = p % w, y = (p - x) / w;
      n++; sx += x; sy += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const q = ny * w + nx;
          if (bin[q] && !vu[q]) { vu[q] = 1; pile.push(q); }
        }
      }
    }
    const bw = maxX - minX + 1, bh = maxY - minY + 1;
    taches.push({ cx: sx / n, cy: sy / n, bw: bw, bh: bh, n: n,
      rapport: bw / bh, remplissage: n / (bw * bh) });
  }

  // ── 4. Ne garder que ce qui ressemble à un point : à peu près carré de
  //      boîte, bien rempli (un disque occupe ~78% de sa boîte), et de
  //      taille proche de la médiane. Le texte et les icônes tombent. ──
  let candidats = taches.filter(function (t) {
    // Le remplissage descend à 0,45 : la seconde application dessine des
    // LOSANGES, pas des disques. Un losange n'occupe que la moitié de sa
    // boîte (0,50) là où un disque en occupe 0,78. Le filtre de taille et
    // la bande de 4 lignes régulières écartent le texte que ce seuil plus
    // permissif laisse entrer.
    return t.rapport > 0.7 && t.rapport < 1.4 && t.remplissage > 0.45 && t.n >= 12;
  });
  if (candidats.length < 16) {
    return { ok: false, raison: 'Trop peu de points détectés (' + candidats.length + ').' };
  }
  const tailles = candidats.map(function (t) { return t.bh; }).sort(function (a, b) { return a - b; });
  const d = tailles[Math.floor(tailles.length / 2)]; // diamètre médian
  const points = candidats.filter(function (t) {
    return Math.abs(t.bh - d) <= d * opt.toleranceTaille;
  });
  if (points.length < 16) {
    return { ok: false, raison: 'Points de taille trop irrégulière (' + points.length + ' retenus).' };
  }

  // ── 5. Regroupement en lignes horizontales ──
  points.sort(function (a, b) { return a.cy - b.cy; });
  const lignes = [];
  points.forEach(function (p) {
    const derniere = lignes[lignes.length - 1];
    if (derniere && Math.abs(p.cy - derniere.y) < d * 0.7) {
      derniere.pts.push(p);
      derniere.y = derniere.pts.reduce(function (s, q) { return s + q.cy; }, 0) / derniere.pts.length;
    } else {
      lignes.push({ y: p.cy, pts: [p] });
    }
  });

  // ── 6. La bande du haut = le premier groupe de 4 lignes RÉGULIÈREMENT
  //      espacées. Le nombre de points ne suffit pas comme critère : dans
  //      une capture réelle, le texte de la question produit une ligne de
  //      8 « points » (les lettres rondes o, e, a, g passent le filtre de
  //      forme). Ce qui distingue un bouclier, c'est que ses 4 lignes sont
  //      à intervalle constant — le texte, lui, est isolé. ──
  const peuplees = lignes.filter(function (l) { return l.pts.length >= opt.minPointsParLigne; });
  let bande = [];
  for (let i = 0; i + 3 < peuplees.length; i++) {
    const g = [peuplees[i + 1].y - peuplees[i].y,
               peuplees[i + 2].y - peuplees[i + 1].y,
               peuplees[i + 3].y - peuplees[i + 2].y];
    const mn = Math.min.apply(null, g), mx = Math.max.apply(null, g);
    if (mx - mn <= mx * 0.25 && mx < d * 4) { bande = peuplees.slice(i, i + 4); break; }
  }
  if (bande.length < 4) {
    return { ok: false, raison: 'Aucune bande de 4 lignes régulièrement espacées trouvée.' };
  }

  // ── 7. Colonnes : on coupe aux SEPT PLUS GRANDS ÉCARTS horizontaux ──
  //      Un seuil fixe ne marche pas d'une application à l'autre. Mesuré :
  //      première appli, deux points d'une même case sont à ~27 px et deux
  //      cases à ~56 px (d=18) ; seconde appli, ~20 px et ~35 px (d=14).
  //      Aucun multiple de d ne sépare proprement les deux à la fois sans
  //      marge dangereuse. Mais un bouclier a TOUJOURS 8 colonnes dans sa
  //      bande du haut : il suffit donc de couper aux 7 écarts les plus
  //      grands, et le seuil se calibre tout seul sur l'image.
  const tous = bande.reduce(function (acc, l) { return acc.concat(l.pts); }, [])
    .sort(function (a, b) { return a.cx - b.cx; });
  if (tous.length < 8) {
    return { ok: false, raison: 'La bande du haut ne contient que ' + tous.length + ' points.' };
  }
  const ecarts = [];
  for (let i = 1; i < tous.length; i++) ecarts.push({ i: i, g: tous[i].cx - tous[i - 1].cx });
  const coupures = ecarts.slice().sort(function (a, b) { return b.g - a.g; }).slice(0, 7)
    .map(function (e) { return e.i; }).sort(function (a, b) { return a - b; });
  const colonnes = [];
  let debut = 0;
  coupures.concat([tous.length]).forEach(function (fin) {
    const pts = tous.slice(debut, fin);
    if (pts.length) colonnes.push({ xMin: pts[0].cx, xMax: pts[pts.length - 1].cx, pts: pts });
    debut = fin;
  });
  if (colonnes.length !== 8) {
    return { ok: false, raison: 'La bande du haut donne ' + colonnes.length + ' colonnes au lieu de 8.',
      colonnes: colonnes.length };
  }
  // Contrôle de vraisemblance : chaque case porte 4 lignes de 1 ou 2 points,
  // donc entre 4 et 8 points. Hors de cette fourchette, le découpage est
  // faux et mieux vaut le dire que de rendre des figures inventées.
  const suspecte = colonnes.filter(function (c) { return c.pts.length < 4 || c.pts.length > 8; });
  if (suspecte.length) {
    return { ok: false, raison: 'Découpage douteux : ' + suspecte.length + ' colonne(s) hors de 4–8 points ('
      + colonnes.map(function (c) { return c.pts.length; }).join(', ') + ').' };
  }

  // ── 8. Lecture : pour chaque colonne, compter les points de chaque ligne ──
  const glyphes = colonnes.map(function (col) {
    return bande.map(function (l) {
      const n = col.pts.filter(function (p) { return Math.abs(p.cy - l.y) < d * 0.7; }).length;
      return n >= 2 ? 2 : 1;
    });
  });

  // yBande : ordonnée de la bande, ramenée à l'échelle de l'image d'origine.
  // Sert à découper le texte qui se trouve AU-DESSUS du bouclier.
  return { ok: true, diametre: d, nbPoints: points.length, glyphes: glyphes,
    yBande: Math.round(bande[0].y / scale) };
}

// ═══════════════════════════════════════════════════════════════
// DÉCOUPE DU TEXTE AU-DESSUS DU BOUCLIER (25/08/26)
// Ellemine_D voulait que l'import récupère aussi les noms des équipes.
// J'ai tenté la reconnaissance de caractères — gabarits rendus à la volée,
// fusion des points sur les i, vote entre cinq piles de polices — et
// mesuré ~60% de caractères justes sur la capture de référence :
// « Qadisiah » sortait « Ood.:s.:ah ». Un nom d'équipe faux rempli en
// silence est pire qu'un champ vide, donc la reconnaissance n'est pas
// embarquée. À la place, on découpe la zone de texte et on l'affiche
// juste au-dessus des champs à remplir : plus besoin de retourner à la
// photo pour lire les noms.
// ═══════════════════════════════════════════════════════════════
function extraireTitreImage(img, yBande) {
  try {
    const W = img.width, H = img.height;
    const yMax = Math.max(20, Math.min(H, (yBande || Math.round(H * 0.35)) - 8));
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = yMax;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(img, 0, 0);
    const px = cx.getImageData(0, 0, W, yMax).data;

    // Même détection de polarité que le détecteur de points.
    const histo = new Uint32Array(256);
    const lum = new Float32Array(W * yMax);
    for (let i = 0; i < W * yMax; i++) {
      lum[i] = 0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2];
      histo[Math.min(255, Math.max(0, lum[i] | 0))]++;
    }
    let cumul = 0, fond = 128;
    for (let v = 0; v < 256; v++) { cumul += histo[v]; if (cumul >= (W * yMax) / 2) { fond = v; break; } }
    const fondSombre = fond < 128;
    const seuil = fondSombre ? (fond + 255) / 2 : (fond + 0) / 2 + 90;

    // Lignes d'encre.
    const encre = [];
    for (let y = 0; y < yMax; y++) {
      let n = 0;
      for (let x = 0; x < W; x++) {
        const l = lum[y * W + x];
        if (fondSombre ? l > seuil : l < seuil) n++;
      }
      encre.push(n > Math.max(3, W * 0.006));
    }
    // Blocs de lignes séparés par un vide vertical net.
    const blocs = [];
    let debut = -1;
    for (let y = 0; y <= yMax; y++) {
      if (y < yMax && encre[y]) { if (debut < 0) debut = y; }
      else if (debut >= 0) {
        if (blocs.length && debut - blocs[blocs.length - 1].fin < 14) blocs[blocs.length - 1].fin = y;
        else blocs.push({ debut: debut, fin: y });
        debut = -1;
      }
    }
    if (!blocs.length) return null;
    // Le premier bloc est la barre d'état du téléphone (heure, batterie) :
    // on part du deuxième s'il existe.
    const utiles = blocs.length > 1 ? blocs.slice(1) : blocs;
    const y0 = Math.max(0, utiles[0].debut - 6);
    const y1 = Math.min(yMax, utiles[utiles.length - 1].fin + 6);
    if (y1 - y0 < 12) return null;

    const out = document.createElement('canvas');
    out.width = W; out.height = y1 - y0;
    out.getContext('2d').drawImage(img, 0, y0, W, y1 - y0, 0, 0, W, y1 - y0);
    return out.toDataURL('image/png');
  } catch (e) { return null; }
}


function figureDepuisGlyphe(g) {
  const cle = g.join('');
  return Object.keys(MAP_GEO).find(function (k) { return MAP_GEO[k].join('') === cle; }) || null;
}

function importerThemeDepuisImage(input) {
  const fichier = input && input.files && input.files[0];
  input.value = ''; // permet de réimporter la même image
  if (!fichier) return;
  const lecteur = new FileReader();
  lecteur.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      let res;
      try { res = detecterBouclier(img); }
      catch (err) { res = { ok: false, raison: 'Erreur de lecture : ' + (err && err.message || err) }; }
      if (res.ok) { try { res.titre = extraireTitreImage(img, res.yBande); } catch (e) { res.titre = null; } }
      afficherImportImage(res, e.target.result);
    };
    img.onerror = function () {
      afficherImportImage({ ok: false, raison: 'Image illisible.' }, null);
    };
    img.src = e.target.result;
  };
  lecteur.readAsDataURL(fichier);
}

function afficherImportImage(res, dataUrl) {
  let panneau = document.getElementById('import-image-panel');
  if (!panneau) {
    panneau = document.createElement('div');
    panneau.id = 'import-image-panel';
    panneau.className = 'card';
    panneau.style.cssText = 'margin:0 8px 12px; border:1px solid #0e7490;';
    const shell = document.querySelector('.topbar-shell');
    if (shell && shell.parentNode) shell.parentNode.insertBefore(panneau, shell.nextSibling);
    else document.body.insertBefore(panneau, document.body.firstChild);
  }
  panneau.style.display = 'block';

  if (!res.ok) {
    panneau.innerHTML = '<h3 style="margin-bottom:4px;">📷 Import d\'image</h3>'
      + '<div style="color:#f87171; font-size:13px;">Lecture impossible : ' + String(res.raison).replace(/[<>]/g, '') + '</div>'
      + '<div class="muted" style="font-size:11px; margin-top:8px;">Il faut une capture nette du bouclier, avec la rangée du haut entièrement visible. Les 4 mères sont les quatre figures de droite de cette rangée.</div>'
      + '<div style="margin-top:10px;"><button class="btn-secondary" style="width:auto;padding:6px 12px;" onclick="fermerImportImage()">Fermer</button></div>';
    return;
  }

  // Les 8 figures de la bande, lues de gauche à droite dans l'image.
  const figs = res.glyphes.map(figureDepuisGlyphe);
  if (figs.some(function (f) { return !f; })) {
    panneau.innerHTML = '<h3>📷 Import d\'image</h3><div style="color:#f87171;font-size:13px;">Une des 8 figures lues ne correspond à aucune figure géomantique.</div>'
      + '<div style="margin-top:10px;"><button class="btn-secondary" style="width:auto;padding:6px 12px;" onclick="fermerImportImage()">Fermer</button></div>';
    return;
  }

  // Le bouclier se lit de DROITE à GAUCHE : mères d'abord, puis filles.
  const droiteGauche = figs.slice().reverse();
  const meres = droiteGauche.slice(0, 4);
  const fillesLues = droiteGauche.slice(4, 8);

  // Contre-vérification par le moteur.
  const t = buildThemeFromMothers(meres[0], meres[1], meres[2], meres[3]);
  const fillesCalc = [t[5], t[6], t[7], t[8]];
  const concordent = fillesLues.every(function (f, i) { return f === fillesCalc[i]; });

  window.__importMeres = meres;

  function pastille(f, role) {
    const couleur = role === 'mere' ? '#0e7490' : '#334155';
    return '<div style="border:1px solid ' + couleur + '; border-radius:8px; padding:6px 8px; text-align:center; background:#0b1220;">'
      + '<div style="font-size:9px; letter-spacing:.08em; color:#94a3b8; text-transform:uppercase;">' + role + '</div>'
      + '<div style="font-size:12px; font-weight:700; color:#e2e8f0; margin-top:2px;">' + FL[f] + '</div></div>';
  }

  let html = '<h3 style="margin-bottom:2px;">📷 Thème lu dans l\'image</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:10px;">' + res.nbPoints + ' points détectés · rangée du haut lue de droite à gauche</div>';

  html += '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:8px;">'
    + meres.map(function (f) { return pastille(f, 'mère'); }).join('') + '</div>';
  html += '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:10px;">'
    + fillesLues.map(function (f) { return pastille(f, 'fille'); }).join('') + '</div>';

  if (concordent) {
    html += '<div style="padding:8px 10px; border-radius:8px; background:#052e1a; border:1px solid #22c55e; font-size:12px; color:#bbf7d0;">'
      + '✅ <b>Lecture vérifiée</b> — les 4 filles lues dans l\'image correspondent exactement à celles que le moteur recalcule depuis ces 4 mères. Un seul point mal lu ferait échouer ce contrôle.</div>';
  } else {
    html += '<div style="padding:8px 10px; border-radius:8px; background:#3b1d1d; border:1px solid #f87171; font-size:12px; color:#fecaca;">'
      + '⚠️ <b>Lecture douteuse</b> — les filles lues (' + fillesLues.map(function (f) { return FL[f]; }).join(', ') + ') ne correspondent pas à celles recalculées ('
      + fillesCalc.map(function (f) { return FL[f]; }).join(', ') + '). Au moins un point a été mal lu : vérifie les mères avant de lancer.</div>';
  }

  // ─── Bloc match : la zone de texte de la capture, découpée et posée
  //     juste au-dessus des champs. Les noms d'équipes ne sont PAS lus
  //     automatiquement (cf. extraireTitreImage) — ils se recopient d'un
  //     coup d'œil sans quitter le panneau ni rouvrir la photo. ───
  html += '<div style="margin-top:12px; padding-top:10px; border-top:1px solid rgba(148,163,184,.25);">'
    + '<div style="font-size:12px; font-weight:700; color:#e2e8f0; margin-bottom:6px;">Informations du match</div>';
  if (res.titre) {
    html += '<img src="' + res.titre + '" alt="Zone de texte de la capture" '
      + 'style="width:100%; border-radius:6px; border:1px solid #334155; margin-bottom:8px; display:block;" />';
  }
  html += '<div class="muted" style="font-size:10.5px; margin-bottom:8px;">'
    + 'Les noms ne sont pas lus automatiquement : la reconnaissance de caractères testée sur ce type de '
    + 'capture ne dépasse pas ~60% de justesse, et un nom faux rempli en silence serait pire qu\'un champ '
    + 'vide. Recopie-les ici — ils partiront dans le formulaire avec les mères.</div>'
    + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">'
    + '<div><label class="muted" style="font-size:10px;">Équipe 1</label>'
    + '<input id="import-team1" type="text" placeholder="Équipe 1" style="width:100%; box-sizing:border-box;" /></div>'
    + '<div><label class="muted" style="font-size:10px;">Équipe 2</label>'
    + '<input id="import-team2" type="text" placeholder="Équipe 2" style="width:100%; box-sizing:border-box;" /></div>'
    + '<div><label class="muted" style="font-size:10px;">Date</label>'
    + '<input id="import-date" type="date" style="width:100%; box-sizing:border-box;" /></div>'
    + '<div><label class="muted" style="font-size:10px;">Heure</label>'
    + '<input id="import-heure" type="time" style="width:100%; box-sizing:border-box;" /></div>'
    + '</div></div>';

  html += '<div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">'
    + '<button class="btn-primary" style="width:auto;padding:8px 14px;" onclick="appliquerMeresImportees(true)">Remplir et lancer le thème</button>'
    + '<button class="btn-secondary" style="width:auto;padding:8px 14px;" onclick="appliquerMeresImportees(false)">Remplir seulement</button>'
    + '<button class="btn-secondary" style="width:auto;padding:8px 14px;" onclick="fermerImportImage()">Annuler</button></div>';

  if (dataUrl) {
    html += '<details style="margin-top:10px;"><summary class="muted" style="font-size:11px; cursor:pointer;">Voir l\'image importée</summary>'
      + '<img src="' + dataUrl + '" style="max-width:100%; margin-top:8px; border-radius:8px; border:1px solid #334155;" alt="Image du thème importée" /></details>';
  }

  panneau.innerHTML = html;
  panneau.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function appliquerMeresImportees(lancer) {
  const meres = window.__importMeres;
  if (!meres) return;
  ['m1', 'm2', 'm3', 'm4'].forEach(function (id, i) {
    const el = document.getElementById(id);
    if (el) el.value = meres[i];
  });
  // Les champs du match ne sont recopiés que s'ils ont été renseignés :
  // un champ laissé vide ne doit pas écraser ce qui est déjà en place.
  [['import-team1', 'team1'], ['import-team2', 'team2'],
   ['import-date', 'matchDate'], ['import-heure', 'matchTime']].forEach(function (paire) {
    const src = document.getElementById(paire[0]);
    const dst = document.getElementById(paire[1]);
    if (src && dst && String(src.value).trim()) {
      dst.value = String(src.value).trim();
      if (typeof dst.oninput === 'function') dst.oninput();
    }
  });
  try { if (typeof updatePlaneteJourIndicator === 'function') updatePlaneteJourIndicator(); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  try { if (typeof updateEquipe1QuestionLabel === 'function') {
    const t1 = document.getElementById('team1'); if (t1) updateEquipe1QuestionLabel(t1.value);
  } } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  const mode = document.getElementById('drawMode');
  if (mode && mode.value !== 'manual') { mode.value = 'manual'; toggleDrawMode(); }
  fermerImportImage();
  if (lancer) launchTheme(false);
}

function fermerImportImage() {
  const p = document.getElementById('import-image-panel');
  if (p) p.style.display = 'none';
}
function themeHas(fig,theme){return Object.values(theme).includes(fig);} 
function houseMatchesElement(pos,fig){return MAISON_ELEM[pos]===ELEMENTS[fig];}
function campParameterScore(theme, houses){ let score=0; let firstHalfSignal=false; let pressionAntagoniste=0; let blocageAntagoniste=0; houses.forEach(pos=>{ const fig=theme[pos]; if(!fig) return; const sameElement=houseMatchesElement(pos, fig); const binome=BINOMES[fig]; const antagoniste=ANTAGONISTES[fig]; const binomeVisible=themeHas(binome, theme); const antagonisteVisible=themeHas(antagoniste, theme); if(sameElement) score += 2; if(binomeVisible) score += 2; if(sameElement && binomeVisible) score += 3; if(ELEMENTS[fig]==='terre' && MAISON_ELEM[pos]==='terre' && binomeVisible){ const feuBinomeHouse = houses.some(h => MAISON_ELEM[h]==='feu' && theme[h]===binome); if(feuBinomeHouse){ score += 4; if(pos===1 || pos===7) firstHalfSignal = true; } } if((pos===1 || pos===7) && sameElement && binomeVisible) firstHalfSignal = true; if(antagonisteVisible){ if(ELEMENTS[fig]==='feu' && MAISON_ELEM[pos]==='feu'){ pressionAntagoniste += 4; score -= 4; } if(ELEMENTS[fig]==='terre' && MAISON_ELEM[pos]==='terre'){ blocageAntagoniste += 4; score -= 4; } } }); return { score, firstHalfSignal, pressionAntagoniste, blocageAntagoniste, destruction: pressionAntagoniste + blocageAntagoniste }; }
function simpleScore(theme,pos){const fig=theme[pos]; const res=getResultant(fig,pos); const same=fig===res?10:0; return (Object.values(theme).filter(v=>v===fig).length*8)+(Object.values(theme).filter(v=>v===res).length*6)+same;}
function analyzeFixedMode(theme){
  const fig1=theme[1], fig7=theme[7];
  let s1=simpleScore(theme,1), s7=simpleScore(theme,7);
  const notes=[];
  const m1Antagonist=ANTAGONISTES[fig1]; const m7Antagonist=ANTAGONISTES[fig7];
  const m1HasAntagonist=figureExistsActive(m1Antagonist,theme); const m7HasAntagonist=figureExistsActive(m7Antagonist,theme);
  const m1Binome=BINOMES[fig1]; const m7Binome=BINOMES[fig7];
  const m1BinomePresent=figureExistsActive(m1Binome,theme); const m7BinomePresent=figureExistsActive(m7Binome,theme);
  const m1NoGoal=m1HasAntagonist && getClosestActiveFigureDistance(1,m1Antagonist,theme)<=2 && isActiveAntagonistVeryStrong(fig1,theme);
  const m7NoGoal=!m7BinomePresent && m7HasAntagonist && isActiveAntagonistStrong(fig7,theme);
  if(m1NoGoal){s1=0; notes.push('M1 ne marque pas : antagoniste proche avec binôme très fort, y compris via une résultante.');}
  if(m7NoGoal){s7=0; notes.push('M7 ne marque pas : pas de binôme actif, mais antagoniste soutenu par son binôme, y compris via une résultante.');}
  const secondChain=m1Binome ? BINOMES[m1Binome] : null;
  if(m1BinomePresent && secondChain && figureExistsActive(secondChain,theme) && secondChain===m7Antagonist && !m1HasAntagonist){s1+=50; notes.push('M1 prend l avantage : chaîne de binômes complète jusqu a l antagoniste de M7, avec prise en compte des resultantes.');}

  // ── Buts predits : meme logique que le moteur V7 (calculerButsCamp), appliquee
  //    aux figures de tete du mode fixe (M1/M7), independamment du calcul du vainqueur. ──
  const camp1=calculerButsCamp(fig1,theme), camp7=calculerButsCamp(fig7,theme);
  function scoreFor(winner){
    const sc=buildScoreFromCamps(camp1,camp7,winner,undefined,theme);
    return {scoreMain:sc.goalA+'-'+sc.goalB, corrected:sc.corrected,
      scoreAlt:winner==='Nul'?Math.max(0,sc.goalA-1)+'-'+Math.max(0,sc.goalB-1):(winner==='M1'?Math.min(5,sc.goalA+1)+'-'+sc.goalB:sc.goalA+'-'+Math.min(5,sc.goalB+1))};
  }

  const drawByChain=m7Binome===m1Antagonist && figureExistsActive(m1Binome,theme) && getResultant(fig1,1)===m1Antagonist;
  if(drawByChain){
    const sc=scoreFor('Nul');
    return {label1:'M1',label7:'M7',pos1:1,pos7:7,score1:s1,score7:s7,winner:'Nul',scoreMain:sc.scoreMain,scoreAlt:sc.scoreAlt,corrected:sc.corrected,valid:true,
      notes:[...notes,'Nul structurel : la chaine de binomes et l antagoniste se referment sur M1, avec resultantes incluses.'],
      firstHalfGoal1:hasActiveFirstHalfBinomeSignal(1,theme),firstHalfGoal7:hasActiveFirstHalfBinomeSignal(7,theme)};
  }
  if(fig1===fig7){
    const d1=getClosestActiveFigureDistance(1,m1Antagonist,theme), d7=getClosestActiveFigureDistance(7,m7Antagonist,theme);
    if(d1!==d7){
      const winner=d1<d7?'M7':'M1';
      const sc=scoreFor(winner);
      return {label1:'M1',label7:'M7',pos1:1,pos7:7,score1:s1,score7:s7,winner,scoreMain:sc.scoreMain,scoreAlt:sc.scoreAlt,corrected:sc.corrected,valid:true,
        notes:[...notes,`Figures identiques : perdant déterminé par la proximité la plus forte de son antagoniste actif (${d1<d7?'M1':'M7'} est le plus exposé).`],
        firstHalfGoal1:hasActiveFirstHalfBinomeSignal(1,theme),firstHalfGoal7:hasActiveFirstHalfBinomeSignal(7,theme)};
    }
  }
  const winner=s1>s7?'M1':s7>s1?'M7':'Nul';
  const sc=scoreFor(winner);
  return {label1:'M1',label7:'M7',pos1:1,pos7:7,score1:s1,score7:s7,winner,scoreMain:sc.scoreMain,scoreAlt:sc.scoreAlt,corrected:sc.corrected,valid:true,notes,
    firstHalfGoal1:hasActiveFirstHalfBinomeSignal(1,theme),firstHalfGoal7:hasActiveFirstHalfBinomeSignal(7,theme)};
}
function scoreRotationFinale(theme,p1,p7,winnerCode){
  const camp1=calculerButsCamp(theme[p1],theme), camp7=calculerButsCamp(theme[p7],theme);
  const verdict = (typeof verdictFamilialEngine==='function') ? verdictFamilialEngine(theme) : null;
  let relationGap = 0;
  if(verdict && verdict.relationR1R7) relationGap = verdict.relationR1R7.ecart || 0;
  // La couche relationnelle agit maintenant aussi sur la magnitude des buts.
  // Elle ne remplace pas calculerButsCamp : elle module uniquement la capacité
  // des deux camps après que R1/R7 a été déterminé.
  const scale = 0.18;
  const a = Object.assign({}, camp1);
  const b = Object.assign({}, camp7);
  a.total = Math.max(0, a.total + Math.max(0, relationGap)*scale);
  b.total = Math.max(0, b.total + Math.max(0, -relationGap)*scale);
  let sc=buildScoreFromCamps(a,b,winnerCode,undefined,theme);
  // Pour un nul structurel, on ne fabrique plus artificiellement 2-2 lorsque
  // les capacités brutes sont faibles : le moteur conserve 3-3 et plus, mais
  // un nul à faible production est ramené à 1-1.
  if(winnerCode==='Nul'){
    const raw=Math.max(camp1.total,camp7.total);
    if(raw < 2.5){ sc.goalA=1; sc.goalB=1; sc.corrected=true; }
  }
  return {sc,camp1,camp7,relationGap};
}
function analyzeMode(theme,mode){
  let p1=1,p7=7,l1='M1',l7='M7';
  if(mode==='rotation'){const rot=getRotationCombat(theme); p1=rot.hR1; p7=rot.hR7; l1='R1'; l7='R7';}
  const s1=simpleScore(theme,p1), s7=simpleScore(theme,p7);
  let winnerRotation=(mode==='rotation') ? (s1>s7?'R1':s7>s1?'R7':'Nul') : (s1>s7?'M1':s7>s1?'M7':'Nul');
  let winner=mode==='rotation' ? (winnerRotation==='R1'?'M1':winnerRotation==='R7'?'M7':'Nul') : winnerRotation;
  // En mode rotation, le verdict FINAL est désormais la source de vérité :
  // R1/R7 + axe succédent + neutralisation + résultante + colocataire +
  // binôme/antagoniste peuvent donc réellement changer vainqueur ET score.
  let vf=null;
  if(mode==='rotation' && typeof verdictFinal==='function'){
    vf=verdictFinal(theme);
    if(vf && vf.winnerRotation) winnerRotation=vf.winnerRotation;
    winner=winnerRotation==='R1'?'M1':winnerRotation==='R7'?'M7':'Nul';
  }
  const sf=scoreRotationFinale(theme,p1,p7,winner);
  const sc=sf.sc;
  const scoreMain=sc.goalA+'-'+sc.goalB;
  const scoreAlt=winner==='Nul'?Math.max(0,sc.goalA-1)+'-'+Math.max(0,sc.goalB-1):(winner==='M1'?Math.min(5,sc.goalA+1)+'-'+sc.goalB:sc.goalA+'-'+Math.min(5,sc.goalB+1));
  return {label1:l1,label7:l7,pos1:p1,pos7:p7,score1:s1,score7:s7,winner,winnerRotation:mode==='rotation'?winnerRotation:null,scoreMain,scoreAlt,corrected:sc.corrected,valid:true,finalVerdict:vf,relationGap:sf.relationGap};
}
function analyzeTheme(theme){
  const fixed=analyzeFixedMode(theme);
  const rotation=analyzeMode(theme,'rotation');
  const validation=analyzeValidation(theme);
  rotation.valid=validation.valid;
  const camp1=campParameterScore(theme, CAMP1);
  const camp2=campParameterScore(theme, CAMP2);
  const v7=verdictV7(theme);
  const v7r=verdictV7Rotation(theme);
  let campWinner='Nul';
  if(camp1.score>camp2.score) campWinner='Camp 1';
  else if(camp2.score>camp1.score) campWinner='Camp 2';
  let dominantDestruction='Nul';
  if(camp1.destruction>camp2.destruction) dominantDestruction='Camp 1';
  else if(camp2.destruction>camp1.destruction) dominantDestruction='Camp 2';
  const htW=v7.htWinner;
  const firstHalf=htW==='both'?'Les deux':htW==='M1'?'M1':htW==='M7'?'M7':'Aucun';
  return {
    fixed, rotation, validation, camp1, camp2, campWinner, dominantDestruction, v7, v7r,
    openSignals:[1,5,7,10].filter(p=>['puer','via','caput_draconis','fortuna_minor','fortuna_major'].includes(theme[p])),
    bothTeamsScore: v7.htWinner==='both',
    firstScorer: firstHalf==='Aucun'?(v7.winner==='M1'?'M1':v7.winner==='M7'?'M7':'Les deux'):firstHalf,
    firstHalfDuality: firstHalf,
    redOrPenalty: v7.penalty.hasRed || v7.penalty.hasPen,
    xFig:combine(theme[rotation.pos1],theme[rotation.pos7]), xExists:true
  };
}
function renderTheme(){
  if(!currentTheme) return;
  clearHouseRelationColors();
  const team1=document.getElementById('team1').value||'Équipe 1';
  const team2=document.getElementById('team2').value||'Équipe 2';
  const _now=new Date();
  const _figDuJour=FIGS_V7[(_now.getDate()+_now.getMonth()*3)%16];
  const _planJour=getPlaneteDuJourDuMatch();

  // GARDE-FOU VERDICT : l'analyse secondaire ne doit jamais empêcher
  // l'affichage du verdict principal. La construction et verdictFinal
  // restent prioritaires. Si analyzeTheme rencontre une erreur, on garde
  // un objet minimal et on laisse la couche verdict décider.
  let a;
  try {
    currentAnalysis=analyzeTheme(currentTheme);
    a=currentAnalysis;
  } catch(errAnalyse) {
    console.error('analyzeTheme error — verdict sécurisé:', errAnalyse);
    try { currentAnalysis={v7:{winner:'Nul',scoreMain:'0-0',htWinner:'none'},fixed:{},rotation:{}}; } catch(e) { currentAnalysis={}; }
    a=currentAnalysis;
  }

  try {
    initAxisThemeControls(currentTheme);
    const vfM = verdictFinal(currentTheme);
    const _domCtx = currentQuestionContext && currentQuestionContext.domicile;
    const _domicileCode = _domCtx === 'team1' ? 'A' : _domCtx === 'team2' ? 'B' : undefined;
    // BASCULE DYNAMIQUE DE LA CARTE PRIORITAIRE (16/07/26) : avant, la carte
    // rotation était TOUJOURS décorée "prioritaire" (bordure + grande police),
    // même quand verdictFinal avait en réalité choisi le mode fixe (plus
    // grand écart de dominance, 16/07/26) — contradiction visuelle directe
    // entre le badge et le vrai verdict (constatée par l'utilisateur :
    // Manchester City vs Napoli, verdictFinal=M1 via mode fixe, mais la
    // carte rotation affichait M7 en grand). Calculé UNE FOIS ici, avant le
    // rendu des deux cartes, et passé explicitement à renderCarteVerdict
    // (7e paramètre) pour que la taille de police suive elle aussi — pas
    // seulement la bordure/badge comme dans le premier correctif.
    // ANCRAGE CÔTÉ ROTATION (17/07/26) : l'ancrage chaîne complète peut
    // désormais trancher via R1/R7 plutôt que M1/M7 (voir verdictFinal) —
    // il faut donc distinguer les deux cas pour savoir QUELLE carte porte
    // le badge "prioritaire", sinon on retombe dans le même bug que celui
    // corrigé le 16/07 (badge figé sur la mauvaise carte).
    // CORRIGÉ (17/07/26) : la détection par sous-chaîne du texte de
    // `reason` cassait silencieusement à chaque nouveau mécanisme ajouté à
    // la cascade (ex. "VERDICT MAX 4 FORCES" n'était reconnu ni comme
    // fixe ni comme rotation ni comme ancrage → aucun badge affiché,
    // alors que verdictFinal avait bien tranché). Depuis que la carte
    // M1/M7 a été retirée (une seule carte affichée, toujours alignée sur
    // vfM.winner), le badge "prioritaire" n'a plus besoin de distinguer
    // le mécanisme — il suffit de savoir si verdictFinal a tranché un
    // vainqueur net (type 'verdict' avec winner M1/M7), peu importe LEQUEL
    // des mécanismes de la cascade l'a décidé.
    const dejaTranche = vfM.type === 'verdict' && (vfM.winner === 'M1' || vfM.winner === 'M7');
    // ALIGNEMENT DE LA CARTE NON-PRIORITAIRE (17/07/26, "corrige la carte
    // non-prioritaire") : avant, la carte qui n'avait pas décidé retombait
    // sur son estimation brute INDÉPENDANTE (moteur V7 sur sa propre paire
    // de figures), pouvant afficher un vainqueur et un score en
    // contradiction frontale avec le verdict retenu juste à côté (constaté
    // par l'utilisateur : carte fixe M1 4-1 / carte rotation R7 4-5 sur le
    // même thème). Les deux cartes reçoivent maintenant le même
    // winnerOverride (l'équipe réellement retenue par verdictFinal, mappée
    // sur les labels propres à chaque carte), donc affichent TOUJOURS la
    // même équipe gagnante. `isPriorityCard` (8e argument) distingue quand
    // même dans buildVerdictCard/renderCarteVerdict quelle carte a
    // réellement tranché ('doctrine') de celle qui suit seulement
    // ('aligne') — le score/les stats de la carte alignée restent les
    // siens propres (recalculés depuis sa propre chaîne de dualité quand
    // son moteur brut contredit), pas une copie de l'autre carte.
    // AFFICHAGE ROTATION SEULE (17/07/26, demande explicite utilisateur :
    // "enlève la partie fixe et laisse la partie rotation pour affichage
    // du vainqueur du match") — la carte M1/M7 n'est plus calculée ni
    // rendue dans renderTheme() (div carte-verdict-m retirée du HTML,
    // ancien carteM supprimé ici) ; verdictFinal/rangParole/etc. utilisent
    // leurs propres appels internes à chaineDualite/buildVerdictCard, donc
    // rien n'en dépendait ailleurs. Seule la carte R1/R7 est montrée,
    // toujours alignée sur le vainqueur réel de verdictFinal (globalWinner)
    // quel que soit le mécanisme qui a tranché (fixe, rotation, ancrage).
    // htInfo (théorie "M1/M7 gouverne la 1ère mi-temps") n'est PAS passé
    // ici : ce texte est spécifique au duel M1/M7, pas à R1/R7 — reste
    // consultable via son propre panneau (🕐 But par mi-temps).
    // MAUVAIS THÈME → PAS DE CARTE ESTIMÉE (17/07/26, demande explicite
    // utilisateur : "affiche le verdict Mauvaise thème, refait encore")
    // — avant, une abstention (thème détruit/invalide) affichait quand
    // même une carte complète avec un vainqueur et un score, juste
    // annotée en petit "estimation non validée" au milieu des détails :
    // trop facile à lire comme un vrai verdict au premier coup d'œil.
    // Remplacé par un message explicite qui empêche toute lecture d'un
    // faux vainqueur/score sur un thème que verdictFinal a lui-même
    // rejeté.
    const elRAbstention = document.getElementById('carte-verdict-r');
    if (vfM.type === 'abstention') {
      const oldElem = document.getElementById('sikidy-elementaire-panel'); if(oldElem) oldElem.remove();
      if (elRAbstention) {
        elRAbstention.classList.remove('verdict-priority');
        elRAbstention.innerHTML = '<h3 style="text-align:center;">🏆 Verdict du match</h3>'
          + '<div style="text-align:center; padding:18px 12px;">'
          + '<div style="font-size:26px; font-weight:900; color:#f87171;">⛔ MAUVAIS THÈME</div>'
          + '<div style="font-size:16px; color:#fbbf24; margin-top:6px;">Refais un tirage</div>'
          + '<div class="muted" style="font-size:12px; margin-top:10px; max-width:520px; margin-left:auto; margin-right:auto;">' + vfM.reason + '</div>'
          + '</div>';
      }
      document.getElementById('theme-validation').innerHTML='';
      renderHouseInsight(selectedHouse);
      document.getElementById('rotation-analysis').innerHTML='';
      document.getElementById('dual-verdicts').innerHTML='';
      document.getElementById('first-half').innerHTML=''; document.getElementById('structural-summary').innerHTML=''; document.getElementById('final-conclusion').innerHTML=''; document.getElementById('house-analysis').innerHTML=''; document.getElementById('full-draw').textContent=''; addToHistory(); updatePlaneteJourIndicator(); setTimeout(adjustThemeScale, 0);
      return;
    }
    const orderR = getRotationOrderFromRepos(currentTheme[1]);
    const protocoleR1R7 = comparerBouclesAntagonistesR1R7(currentTheme);
    const structureNulTop = structureDuNul(currentTheme);
    const nulAxeTop = (typeof signalAxeSuccedentOpposition === 'function') ? signalAxeSuccedentOpposition(currentTheme) : null;
    // Structure du Nul débranchée du verdict (24/08/26) — cf.
    // STRUCTURE_NUL_DECISIVE. Elle ne suspend plus le protocole ni le réseau.
    // Structure du Nul et Axe Succédent tous deux débranchés (24/08/26) —
    // cf. STRUCTURE_NUL_DECISIVE et AXE_SUCCEDENT_DECISIF.
    // Le nul se décide dans nulActifV7 et NULLE PART AILLEURS (29/08/26).
    // Ce calcul était dupliqué ici ; la copie a divergé le jour même où
    // les portes ont été branchées. Ne jamais la réécrire.
    const nulActifTop = nulActifV7(currentTheme, structureNulTop, nulAxeTop);
    const protocoleWinner = protocoleR1R7.applicable && !nulActifTop
      ? (protocoleR1R7.winner === 'R1' ? 'R1' : protocoleR1R7.winner === 'R7' ? 'R7' : null)
      : null;
    // ─── RÈGLE ELLEMINE (21/08/26) : RÉSEAU D'ANCRAGE = MOTEUR PRINCIPAL ───
    // Demande explicite d'Ellemine_D : "je veux que le réseau d'ancrage
    // soit le moteur principal du verdict qui affiche à l'écran."
    // ⚠️ AVERTISSEMENT MAINTENU : le réseau d'ancrage v2 n'a été testé
    // qu'une seule fois en conditions réelles à ce jour (n=1) au moment
    // de ce branchement, contre 3/4 pour le protocole officiel. Les deux
    // sont affichés — réseau d'ancrage en tête (décisif), protocole
    // officiel juste en dessous à titre de comparaison/repli.
    const reseauTop = analyserReseauAncrageV2(currentTheme);
    const reseauWinnerTop = !nulActifTop && reseauTop.winner && reseauTop.winner !== 'Nul'
      ? reseauTop.winner
      : null;
    // ─── RÈGLE ELLEMINE (24/08/26) : LECTURE DES SIÈGES = MOTEUR DÉCISIF ───
    // Le Réseau d'ancrage cède la priorité à la lecture directe des deux
    // sièges R1/R7 (cf. lectureSiegesR1R7). Motif : sur le cas réel 6-1,
    // le réseau donnait R7 sur son score de résidence (8 contre 4,5) alors
    // que les sièges annonçaient R1 avec « buts élevés · victoire A
    // possible » contre « buts modérés · nul/bascule ». Le score de
    // résidence mesure l'installation d'une figure, pas l'issue du match.
    // Le réseau reste calculé et affiché juste en dessous, en comparaison,
    // et sert de repli quand les deux sièges sont strictement équivalents
    // (~10% des thèmes).
    const siegesTop = lectureSiegesR1R7(currentTheme);
    const siegesWinnerTop = !nulActifTop && siegesTop.applicable && siegesTop.winner
      ? siegesTop.winner
      : null;
    // ─── RÈGLE ELLEMINE (24/08/26) : SOLIDITÉ DE CHAÎNE = MOTEUR DÉCISIF ───
    // « branche la solidité de chaîne ». Elle passe devant la lecture des
    // sièges, qui devient couche de confirmation.
    // Bilan sur les cas réels connus : chaîne 3/3 sur le camp, dont une
    // prédiction posée AVANT de connaître le résultat (Tristitia/Via/
    // Conjonctio/Rubeus, annoncé R1, réel 7-0). Les sièges sont aussi 3/3.
    // ⚠️ MESURE IMPORTANTE : sur 4000 thèmes tirés au hasard, chaîne et
    // sièges donnent des vainqueurs DIFFÉRENTS dans 46% des cas. Les trois
    // accords observés ne prouvent donc presque rien sur leur hiérarchie —
    // le choix de priorité ci-dessous décide du verdict sur près d'un thème
    // sur deux, et n'est PAS tranché par les données. Le désaccord est
    // affiché explicitement sur la carte pour que les cas s'accumulent.
    // ─── F4P4 EST LE MOTEUR PRINCIPAL (26/08/26, décision d'Ellemine_D,
    // énoncée deux fois : « le moteur F4P4 sera désormais le moteur
    // principal qui pilote le verdict principal, en remplaçant VERDICT DU
    // MATCH — Solidité de chaîne R1/R7 ») ───
    // La cascade d'avant ne descendait jamais : l'ancrage tranchait
    // 1111 fois sur 1111. Elle est conservée en repli, mais F4P4 passe
    // devant. L'ancrage reste calculé et affiché comme contre-lecture.
    const ancrageTop = analyseAncrageDeveloppe(currentTheme);
    const chaineWinnerTop = !nulActifTop && ancrageTop.applicable && ancrageTop.avantage
      ? ancrageTop.avantage
      : null;
    let f4p4Top = null;
    try { f4p4Top = moteurF4P4V7(currentTheme); } catch (e) { f4p4Top = null; }
    const f4p4WinnerTop = !nulActifTop && f4p4Top && f4p4Top.applicable && f4p4Top.avantage
      ? f4p4Top.avantage
      : null;
    // Le vote des moteurs est supprimé (01/09/26) — plus de votants.
    // Repli « le réseau dit Nul et personne ne tranche » RETIRÉ le 29/08 :
    // vérifié sur les 65 536 thèmes possibles, reseauF4P4V7 ne renvoie
    // jamais winner === 'Nul'. C'était du code mort, et il faisait
    // diverger l'écran du moteur pour rien.
    const nulActifReseauTop = nulActifTop;
    // Même ordre qu'en haut : les sièges d'abord (28/08/26).
    // Même ordre qu'en haut : F4P4 d'abord (28/08/26).
    // ─── LA MÊME CHAÎNE QUE LE MOTEUR (29/08/26) ───
    // Cette ligne énumérait sa propre suite de replis, sans la lecture
    // des critères ni le protocole : l'écran et le banc nommaient deux
    // camps différents sur 23 % des thèmes. Voir overrideVerdictV7.
    const rWinnerOverride = overrideVerdictV7(currentTheme, nulActifTop);
    const carteR = buildVerdictCard(orderR[0], orderR[6], 'R1', 'R7', currentTheme, rWinnerOverride, _domicileCode, true);
    carteR.chaineSynthese = ancrageTop.applicable ? ancrageTop.synthese : null;
    carteR.chaineWinner = chaineWinnerTop;
    carteR.chaineCritere = ancrageTop.applicable ? ancrageTop.critere : null;
    carteR.siegesSynthese = siegesTop.applicable ? siegesTop.synthese : null;
    carteR.siegesWinner = siegesWinnerTop;
    carteR.accordSieges = !!(chaineWinnerTop && siegesWinnerTop && chaineWinnerTop === siegesWinnerTop);
    carteR.desaccordSieges = !!(chaineWinnerTop && siegesWinnerTop && chaineWinnerTop !== siegesWinnerTop);
    carteR.reseauWinnerCompare = reseauWinnerTop;
    carteR.accordReseau = !!(rWinnerOverride && reseauWinnerTop && rWinnerOverride === reseauWinnerTop);
    carteR.desaccordReseau = !!(rWinnerOverride && reseauWinnerTop && rWinnerOverride !== reseauWinnerTop);
    carteR.f4p4Winner = f4p4WinnerTop;
    carteR.f4p4Critere = f4p4Top && f4p4Top.applicable ? f4p4Top.critere : null;
    carteR.f4p4Synthese = f4p4Top && f4p4Top.applicable ? f4p4Top.synthese : null;
    carteR.accordF4P4Ancrage = !!(f4p4WinnerTop && chaineWinnerTop && f4p4WinnerTop === chaineWinnerTop);
    carteR.desaccordF4P4Ancrage = !!(f4p4WinnerTop && chaineWinnerTop && f4p4WinnerTop !== chaineWinnerTop);
    // ─── L'EN-TÊTE DIT MAINTENANT LA VÉRITÉ (01/09/26) ───
    // Elle annonçait « Front 4 · Pôle 4 » ou « Vote des moteurs (repli) »
    // alors que le camp venait de moteurV8V7 depuis la reprise à zéro.
    // Le lecteur croyait donc lire le décideur ; il lisait un moteur qui
    // ne décidait plus rien. C'est ce que voyait Ellemine_D.
    // 03/09/26 : le carré est devenu le pilote (PILOTE_VERDICT_V7). La
    // ligne nomme donc CELUI QUI A TRANCHÉ POUR DE BON — carré quand il
    // parle, V8 quand le carré est muet — et jamais celui qui aurait pu.
    // 04/09/26 : cette ligne refaisait la cascade dans son coin et
    // rementait dès qu'on changeait l'ordre (elle a annoncé « Carré
    // géomantique » alors que le carré était passé dernier recours et
    // n'avait pas tranché). Elle demande maintenant son nom au décideur
    // lui-même — voir decideurVerdictV7, seule écriture de la cascade.
    var decideurTop = null;
    try { decideurTop = decideurVerdictV7(currentTheme, nulActifTop); } catch (e) { decideurTop = null; }
    carteR.sourceDecisive = decideurTop ? decideurTop.nom : 'aucun décideur';
    carteR.reseauSynthese = reseauTop.synthese;
    carteR.nulActifReseau = nulActifReseauTop;
    carteR.protocoleWinnerCompare = protocoleWinner;
    carteR.accordProtocole = !!(protocoleWinner && rWinnerOverride && protocoleWinner === rWinnerOverride);
    carteR.desaccordProtocole = !!(protocoleWinner && rWinnerOverride && protocoleWinner !== rWinnerOverride);
    // MODE LIVE (03/09/26) — voir appliquerEtatLiveV7 : plancher de score au
    // score déjà connu + signal de cohérence, sans toucher au verdict.
    try { appliquerEtatLiveV7(carteR, currentTheme); } catch(e) { console.debug('[maintenance] erreur ignorée:', e); }
    // SUPPRIMÉ (21/08/26, focalisation sur un seul moteur) : la bannière
    // de contradiction contre jugementReseauR1R7 (Réseau d'ancrage V1,
    // supprimé) faisait doublon avec accordProtocole/desaccordProtocole
    // ci-dessus, déjà basé sur le Réseau d'ancrage V2 décisif.

    renderProtocoleVerdictPrincipal('carte-verdict-r', carteR, team1, team2, currentTheme, protocoleR1R7, structureNulTop, nulAxeTop, nulActifReseauTop);
    // Contrôle de régression totalement isolé : une erreur dans ce panneau
    // ne doit jamais empêcher l'affichage du verdict principal.
    try { renderRegressionReference(currentTheme); } catch(e) { console.log('regression reference error', e); }
    // Garde-fou d'affichage : seule une carte réellement vide peut être reconstruite.
    // Le protocole R1/R7 porte l'UI principale et ne doit plus être remplacé par
    // l'ancienne carte renderCarteVerdict.
    try {
      var _vrGuard = document.getElementById('carte-verdict-r');
      if (_vrGuard && !_vrGuard.querySelector('[data-protocole-r1r7=\"1\"]')) {
        renderProtocoleVerdictPrincipal('carte-verdict-r', carteR, team1, team2, currentTheme, protocoleR1R7, structureNulTop, nulAxeTop, nulActifReseauTop);
      }
    } catch(e) { console.log('protocol display guard error', e); }
    // ─── CORRIGÉ LE 28/08/26 : LES RÉPONSES CONTREDISAIENT LA CARTE ───
    // Ce bloc recevait vfM — la sortie de verdictFinal en repère M1/M7 —
    // alors que la carte affiche carteR, le verdict de la rotation. Sur
    // Lille/PSG, la carte annonçait « VAINQUEUR Équipe 1, 4-0 » et le bloc
    // des questions répondait « Victoire (Paris Saint-Germain) · Lille
    // va-t-il gagner ? Non » : deux moteurs différents dans le même écran.
    // Les réponses suivent désormais le verdict affiché, et le nul actif
    // du réseau est repris tel quel.
    // carteR étiquette ses camps R1/R7 (c'est la carte de la rotation) ;
    // le bloc des questions raisonne en M1/M7. La conversion est
    // biunivoque dans tout le fichier — verdictFinal pose lui-même
    // winner = winnerRotation === 'R1' ? 'M1' : 'M7'.
    renderQuestionAnswers(currentQuestionContext,
      { winner: nulActifReseauTop ? 'Nul'
          : carteR && carteR.winner === 'R1' ? 'M1'
          : carteR && carteR.winner === 'R7' ? 'M7'
          : (carteR && carteR.winner) || null },
      carteR, a.v7.htWinner);
    // Couche élémentaire R1/R7 : diagnostic de concordance additionnel,
    // ne remplace pas verdictFinal (couche de confirmation traçable).
    // (La couche Sikidy évoquée ici auparavant a été retirée le 20/08/26,
    // élagage demandé par Ellemine_D : code mort, jamais rendu à l'écran.)
    try { renderElementaireR1R7(currentTheme); } catch(e) { console.log('elementaire R1/R7 error', e); }
    // Rôles exercés : lecture seule du côté ACTIF des quatre relations.
    // Isolé comme les autres panneaux — une erreur ici ne doit jamais
    // empêcher l'affichage du verdict.
    try { renderRolesExercesPanel(currentTheme); } catch(e) { console.log('roles exerces error', e); }
    // Piste « les deux marquent » : lecture seule, ne touche pas le BTTS affiché.
    try { renderDeuxMarquentPanel(currentTheme); } catch(e) { console.log('deux marquent error', e); }
    // Lieux de marquage : instrument d'observation, rien n'est branché.
    try { renderLieuxMarquagePanel(currentTheme); } catch(e) { console.log('lieux marquage error', e); }
    try { renderDuelBouclierPanel(currentTheme); } catch(e) { console.log('duel bouclier error', e); }
    try { renderF4P4Panel(currentTheme); } catch(e) { console.log('f4p4 error', e); }
    try { renderMoteursPanel(currentTheme); } catch(e) { console.log('moteurs error', e); }
    // ⚠️ NE PAS DIFFÉRER CET APPEL SANS TRAITER justesseMoteurV7 (29/08/26).
    // Essayé, mesuré, annulé : envelopper renderBancPanel dans un
    // setTimeout ne gagne RIEN (1 415 ms → 1 385 ms, dans le bruit),
    // parce que justesseMoteurV7 appelle bancMoteursV7() en synchrone
    // pendant le rendu des moteurs et reconstruit le banc de toute façon.
    // Le vrai coût est là, pas ici. Voir le journal des mesures plus bas.
    try { renderBancPanel(); } catch(e) { console.log('banc error', e); }
    // Les trois axes comme thèmes dérivés : observation, aucun effet sur le verdict.
    try { renderAxesPanel(currentTheme); } catch(e) { console.log('axes panel error', e); }
    const elR = document.getElementById('carte-verdict-r');
    if (elR) {
      elR.classList.remove('verdict-priority');
      if (dejaTranche) {
        elR.classList.add('verdict-priority');
        elR.setAttribute('data-priority-label', '⭐ VERDICT FINAL');
      }
      // sinon (règle de nul, abstention...) : pas de badge, puisqu'aucun
      // mécanisme n'a tranché un vainqueur net.
    }
  } catch(e) {
    console.error('carte verdict error', e);
    const elErr = document.getElementById('carte-verdict-r');
    if (elErr) {
      elErr.classList.add('verdict-priority');
      let safeLabel='Verdict indisponible';
      let safeReason='';
      try {
        const safeV=verdictFinal(currentTheme);
        if (safeV) {
          if (safeV.type==='abstention') safeLabel='MAUVAIS THÈME';
          else if (safeV.winner==='M1') safeLabel=escHtml(team1)+' gagne';
          else if (safeV.winner==='M7') safeLabel=escHtml(team2)+' gagne';
          else if (safeV.winner==='Nul') safeLabel='NUL';
          else if (safeV.winnerRotation==='R1') safeLabel='R1 gagne';
          else if (safeV.winnerRotation==='R7') safeLabel='R7 gagne';
          safeReason=safeV.reason||'';
        }
      } catch(safeErr) { console.error('safe verdict error',safeErr); }
      elErr.innerHTML = '<h3 style="text-align:center;">🏆 Verdict du match</h3>'
        + '<div style="text-align:center;padding:18px 10px;"><div style="font-size:26px;font-weight:900;">'+safeLabel+'</div>'
        + '<div class="muted" style="font-size:11px;margin-top:8px;">'+String(safeReason||('Sous-couche en erreur : '+String(e&&e.message||e))).replace(/[<>]/g,'')+'</div></div>';
    }
  }
document.getElementById('theme-validation').innerHTML=''; /* maisons rendues par adjustThemeScale/renderThemeWithSize */ renderHouseInsight(selectedHouse); document.getElementById('rotation-analysis').innerHTML=''; document.getElementById('dual-verdicts').innerHTML='';

document.getElementById('first-half').innerHTML=''; document.getElementById('structural-summary').innerHTML=''; document.getElementById('final-conclusion').innerHTML=''; document.getElementById('house-analysis').innerHTML=''; document.getElementById('full-draw').textContent=''; addToHistory(); updatePlaneteJourIndicator(); renderJugeResultantes(currentTheme); renderInterpretationsPanel(currentTheme); renderProtectionChaineV7(currentTheme); renderReseauAncrageV2(currentTheme); setTimeout(adjustThemeScale, 0);}
// AJOUTÉ (démarche du tirage aveugle, demande utilisateur) : "Lancer
// aléatoire" EST déjà un tirage aveugle (mères choisies sans biais
// possible) — on le marque désormais explicitement (lastLaunchWasBlind)
// pour que l'historique et les statistiques distinguent les tirages
// aveugles (test du moteur, aucune influence possible) des tirages
// manuels (usage réel/divinatoire), au lieu de tout mélanger.
function launchTheme(randomMode){themeCastAt=new Date().toISOString(); clearInterpretationText(); lastLaunchWasBlind=!!randomMode; currentQuestionContext=buildQuestionContext(); renderQuestionContext(currentQuestionContext); const [m1,m2,m3,m4]=getCurrentMotherValues(); currentTheme=buildThemeFromMothers(randomMode?FIGS[Math.floor(Math.random()*FIGS.length)]:m1, randomMode?FIGS[Math.floor(Math.random()*FIGS.length)]:m2, randomMode?FIGS[Math.floor(Math.random()*FIGS.length)]:m3, randomMode?FIGS[Math.floor(Math.random()*FIGS.length)]:m4); themeVariants.principal=currentTheme; const _derives=calculerThemesDerives(currentTheme); themeVariants.superposition=_derives.superposition; themeVariants.phase=_derives.phase; themeVariantActif='principal'; axisDisplayThemeKey='principal'; axisThemeBase=currentTheme; renderTheme();}

// ═══════════════════════════════════════════════════════════════
// COLORATION DES MAISONS — binôme vert / antagoniste rouge au clic
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// HISTORIQUE DES TIRAGES — sauvegarde et rechargement via localStorage
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// HISTORIQUE (auto) + SAUVEGARDE (manuelle) — deux listes séparées
// ═══════════════════════════════════════════════════════════════

var HISTORY_KEY = 'geomantique_history_v2';
var SAVE_KEY    = 'geomantique_saved_v1';
var currentTab  = 'hist';

function _getList(key) {
  try { var r = localStorage.getItem(key); return r ? JSON.parse(r) : []; } catch(e) { return []; }
}
function _setList(key, list) {
  try { localStorage.setItem(key, JSON.stringify(list)); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
}
function getHistoryList() { return _getList(HISTORY_KEY); }
function setHistoryList(l) { _setList(HISTORY_KEY, l); }
function getSavedList()    { return _getList(SAVE_KEY); }
function setSavedList(l)   {
  // Toute écriture invalide le cache de cohérence (un score saisi ou
  // effacé change le verdict de l'entrée) — cf. evalCoherence.
  try { _cacheCoherenceV7 = {}; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  _setList(SAVE_KEY, l);
}

function themeFingerprint(team1, team2, theme) {
  return team1+'|'+team2+'|'+Object.keys(theme).sort().map(function(k){return theme[k];}).join(',');
}

// ═══════════════════════════════════════════════════════════════
// STATISTIQUES AUTO-VALIDANTES
// Rejoue tous les matchs archivés (historique + sauvegardés) ayant
// un score réel contre les règles ACTUELLES du moteur, et affiche
// les taux de réussite par moteur. Toute modification de règle est
// ainsi testée contre l'historique complet en un clic.
// ═══════════════════════════════════════════════════════════════
function isThemeValideStrict(theme){
  // Un thème détruit (Rubeus ou Cauda Draconis en M1) n'est pas valide —
  // aligné le 28/08/26 sur themeInvalidite(), pour que le gate live et les
  // statistiques rétrospectives disent la même chose.
  if (themeDetruit(theme)) return false;
  // Les 4 axes sont calculés une seule fois par evaluerAxesValidite (cf.
  // combineMany) — même définition que themeInvalidite/analyzeValidation/
  // niveauValiditeV7/toggleValiditePanel, pour que le gate live (UI) et les
  // statistiques rétrospectives disent toujours la même chose.
  return evaluerAxesValidite(theme).every(function(r){ return r.exists; });
}

function replayEntry(entry){
  var theme = entry.theme;
  if(!theme || !entry.realScore) return null;
  var m = String(entry.realScore).match(/(\d+)\s*-\s*(\d+)/);
  if(!m) return null;
  var g1 = parseInt(m[1],10), g7 = parseInt(m[2],10);
  var realWinner = g1>g7 ? 'M1' : g7>g1 ? 'M7' : 'Nul';
  var valide = isThemeValideStrict(theme);
  var cd = campDominant(theme);
  var ve = verdictElementaire(theme);
  var combinedWinner = cd.winner || (ve.winner!=='muet' ? ve.winner : null);
  var juge = theme[15];
  var recit = JUGE_RECIT[juge] || {nul:false};
  var jugeAnswer = recit.nul ? 'Nul' : 'Victoire';
  var realAnswer = realWinner==='Nul' ? 'Nul' : 'Victoire';
  // ── Chaîne officielle verdictFinal, ventilée par étage (rangParole) ──
  // favori rejoué depuis l'entree (08/07/26) au lieu du DOM courant
  var vf = verdictFinal(theme, entry.favorite || 'none');
  var rp = rangParole(vf);
  var vfOk = (vf.type==='verdict' || vf.type==='nul' || vf.type==='nul_suspecte') && vf.winner ? vf.winner===realWinner : null;
  // Le verdict RÉELLEMENT AFFICHÉ par l'application, celui que pilote F4P4.
  var affWinner = null;
  var _fmtEntry = entry.matchFormat === 'esport' ? 'esport' : 'reel';
  try {
    var va = avecFormatV7(_fmtEntry, function () { return getVerdictAfficheReel(theme); });
    affWinner = va ? va.winner : null;
  } catch (e) { affWinner = null; }
  var affOk = affWinner ? affWinner === realWinner : null;
  var delaiMin = calculerDelaiTirageMinutes(entry.matchDate, entry.matchTime, entry.castAt || entry.savedAt, entry.matchTimezone);
  var scn = signalConvergenceNul(theme);
  var oc = oppositionComplementM1M7(theme);
  var stw = signalTemoinM1M7(theme);
  var sai = signalAttaquantIsole(theme);
  var sfm = signalFavorabiliteMaison(theme);
  var sfo = signalFamilleOpposition(theme);
  var opinions = [cd.winner, (ve.winner!=='muet'?ve.winner:null), vf.winner].filter(function(w){ return w; });
  var distinctOpinions = opinions.filter(function(w,i){ return opinions.indexOf(w)===i; });
  var enginesDivergent = distinctOpinions.length > 1;
  var sb = signalBinomeM1M7(theme);
  var asr = analyseSuperpositionReseaux(theme);

  // ── Replay du score de buts (08/07/26, porté depuis l'autre lignée) avec
  // le contexte d'epoque (date -> planete, competition) au lieu du DOM courant.
  var ctxScore = {planeteJour: getPlaneteDuJour(entry.matchDate || ''), competition: entry.competition || 'fra_l1'};
  var v7Replay = verdictV7(theme, false, ctxScore);
  // ─── DEUXIÈME INCOHÉRENCE, CORRIGÉE LE 27/08/26 ───
  // Le score noté ici venait de verdictV7 ; le score AFFICHÉ vient de
  // getVerdictAfficheReel. Mesuré sur les huit cas d'archive : les deux
  // diffèrent sur SEPT (Juventus 0-1 contre 5-3, Inter 3-5 contre 0-5,
  // Milan 5-3 contre 4-2…). La pastille de cohérence jugeait donc un
  // score que l'utilisateur n'a jamais vu.
  // On note l'affiché. Réserve honnête : getVerdictAfficheReel ne prend
  // pas le contexte d'époque (planète du jour, compétition), donc le
  // rejeu perd ce contexte ; le score de verdictV7 avec contexte reste
  // exposé sous predScoreV7 pour comparaison.
  var affScore = null;
  try {
    var vaS = avecFormatV7(_fmtEntry, function () { return getVerdictAfficheReel(theme); });
    affScore = vaS || null;
  } catch (e) { affScore = null; }
  var predM1 = affScore ? Number(affScore.goalM1) : v7Replay.goalM1;
  var predM7 = affScore ? Number(affScore.goalM7) : v7Replay.goalM7;
  var ecartButs = Math.abs(predM1-g1) + Math.abs(predM7-g7);
  var scoreOk = ecartButs <= 1;

  // ── Suivi CONFLIT MOTEURS (revue contradictions) — le commentaire de
  // verdictV7 promettait de basculer la priorité vers la "nouvelle chaîne"
  // si les stats confirmaient sur 10+ conflits, mais conflitChaine n'était
  // jamais relu nulle part : la promesse ne pouvait jamais être évaluée.
  // On l'agrège ici pour de vrai, sur l'archive rejouée.
  var conflict = v7Replay.conflitChaine;
  var conflictV7Ok = conflict ? (conflict.v7 === realWinner) : null;
  var conflictChaineOk = conflict ? (conflict.chaine === realWinner) : null;

  // ── Convergence des signaux d'etude (08/07/26) — uniquement quand
  // verdictFinal ne tranche pas (indecis/abstention/victoire_ouverte).
  // Ne pese sur AUCUN verdict, juste un compteur diagnostique.
  var convergenceWinner = null, convergenceOk = null;
  if (!vfOk && vf.winner===null) {
    var votes = {M1:0, M7:0};
    if (typeof forceFigure==='function') {
      var fe1 = forceFigure(theme[1], theme), fe7 = forceFigure(theme[7], theme);
      var RANG = {'FORTE-LIBRE':3,'entravée':2,'affamée-libre':1,'morte':0};
      if (RANG[fe1.etat] !== RANG[fe7.etat]) votes[RANG[fe1.etat] > RANG[fe7.etat] ? 'M1' : 'M7']++;
    }
    if (typeof duelBinomesDirects==='function') {
      var dbd = duelBinomesDirects(theme);
      if (dbd.winner) votes[dbd.winner]++;
    }
    if (typeof orientationForces==='function') {
      var orient = orientationForces(theme);
      if (orient.o1.sc !== orient.o7.sc) votes[orient.o1.sc > orient.o7.sc ? 'M1' : 'M7']++;
    }
    if (votes.M1 !== votes.M7) {
      convergenceWinner = votes.M1 > votes.M7 ? 'M1' : 'M7';
      convergenceOk = (convergenceWinner === realWinner);
    }
  }

  return {
    valide: valide,
    theme: theme,
    realWinner: realWinner,
    cdWinner: cd.winner,
    veWinner: ve.winner!=='muet' ? ve.winner : null,
    combinedWinner: combinedWinner,
    cdOk: cd.winner ? cd.winner===realWinner : null,
    veOk: (ve.winner!=='muet') ? ve.winner===realWinner : null,
    combinedOk: combinedWinner ? combinedWinner===realWinner : null,
    jugeOk: jugeAnswer===realAnswer,
    vfType: vf.type,
    vfWinner: vf.winner,
    vfRang: rp.rang,
    vfEtage: rp.etage,
    vfOk: vfOk,
    // ─── INCOHÉRENCE CORRIGÉE LE 27/08/26 ───
    // evalCoherence — la « Fiabilité globale » des thèmes sauvegardés —
    // notait verdictFinal, le moteur HISTORIQUE. Or ce n'est pas lui qui
    // s'affiche : le verdict du match vient de getVerdictAfficheReel
    // (F4P4 en tête depuis le 26/08). Mesuré : les deux diffèrent sur
    // 148 thèmes sur 379, soit 39 % — et sur le cas Fiorentina la
    // fiabilité disait « vainqueur incorrect » alors que l'application
    // avait affiché le bon camp. On notait un moteur que l'utilisateur
    // ne voit pas.
    // Les deux sont désormais exposés ; evalCoherence juge l'AFFICHÉ.
    affWinner: affWinner,
    affOk: affOk,
    favoriteKnown: !!entry.favorite,
    predScore: predM1+'-'+predM7,
    predScoreV7: v7Replay.goalM1+'-'+v7Replay.goalM7,
    ecartButs: ecartButs,
    scoreOk: scoreOk,
    convergenceWinner: convergenceWinner,
    convergenceOk: convergenceOk,
    delaiMin: delaiMin,
    delaiBucket: radicaliteBucket(delaiMin),
    convergeNul: scn.converge,
    convergeNulCount: scn.count,
    complementM1M7: oc.actif,
    enginesDivergent: enginesDivergent,
    binomeM1M7: sb.actif,
    superpositionCount: asr.count,
    hasConflict: !!conflict,
    conflictV7: conflict ? conflict.v7 : null,
    conflictChaineWinner: conflict ? conflict.chaine : null,
    conflictSource: conflict ? conflict.source : null,
    conflictV7Ok: conflictV7Ok,
    conflictChaineOk: conflictChaineOk,
    blindTest: !!entry.blindTest,
    temoinFig1Cible: stw.target1,
    temoinFig1CibleActive: stw.target1Active,
    temoinFig7Cible: stw.target7,
    temoinFig7CibleActive: stw.target7Active,
    temoinRealWinner: realWinner,
    attaquant1Isole: sai.attacker1Isolated,
    attaquant1Actif: sai.attacker1Active,
    attaquant7Isole: sai.attacker7Isolated,
    attaquant7Actif: sai.attacker7Active,
    attaquantRealWinner: realWinner,
    bin1Favorable: sfm.bin1Favorable,
    bin1Defavorable: sfm.bin1Defavorable,
    bin7Favorable: sfm.bin7Favorable,
    bin7Defavorable: sfm.bin7Defavorable,
    favMaisonRealWinner: realWinner,
    carcerActive: sfo.carcerActive,
    puellaActive: sfo.puellaActive,
    familleRealWinner: realWinner
  };
}


function renderStatsTab(){
  currentTab = 'stats';
  document.getElementById('tabHistBtn').style.background = '';
  document.getElementById('tabSaveBtn').style.background = '';
  document.getElementById('tabStatsBtn').style.background = '#1e3a8a';
  var all = getHistoryList().concat(getSavedList());
  var seen = {};
  var replays = [];
  all.forEach(function(e){
    if(!e.theme || !e.realScore) return;
    var fp = themeFingerprint(e.team1||'', e.team2||'', e.theme);
    if(seen[fp]) return; seen[fp] = true;
    var r = replayEntry(e);
    if(r) replays.push(r);
  });
  var valides = replays.filter(function(r){return r.valide;});
  var invalides = replays.filter(function(r){return !r.valide;});
  function rate(list, key){
    var applicable = list.filter(function(r){return r[key]!==null;});
    var ok = applicable.filter(function(r){return r[key]===true;}).length;
    return applicable.length ? ok+'/'+applicable.length+' ('+Math.round(100*ok/applicable.length)+'%)' : '—';
  }
  var h = '<div class="card">';
  h += '<h3>📊 Statistiques (règles actuelles rejouées sur l archive)</h3>';
  h += '<div class="kv"><b>Matchs archivés avec score réel :</b> '+replays.length+' ('+valides.length+' valides, '+invalides.length+' invalides ignorés des stats)</div>';
  if(!valides.length){
    h += '<div class="muted" style="margin-top:8px;">Aucun thème valide avec score réel. Saisis les scores réels dans l onglet Historique (champ "Score reel") pour alimenter les statistiques.</div>';
  } else {
    h += '<div class="kv" style="margin-top:8px;"><b>🏆 Vainqueur combiné (dominant &gt; élémentaire, comparaison historique) :</b> '+rate(valides,'combinedOk')+'</div>';
    h += '<div class="kv"><b>👑 Camp dominant seul :</b> '+rate(valides,'cdOk')+'</div>';
    h += '<div class="kv"><b>🔥 Verdict élémentaire seul :</b> '+rate(valides,'veOk')+'</div>';
    h += '<div class="muted" style="font-size:11px; margin-top:-2px; margin-bottom:6px;">Les 3 taux ci-dessus ne reflètent PAS la chaîne réellement utilisée pour le verdict affiché à l utilisateur (voir ⚡ Chaîne verdictFinal ci-dessous) — camp dominant a échoué en aveugle et ne tranche plus M1/M7 dans verdictFinal, ces taux sont conservés à titre de comparaison historique uniquement.</div>';
    h += '<div class="kv"><b>⚖️ Juge — question nul/victoire :</b> '+rate(valides,'jugeOk')+'</div>';
    h += '<div class="kv" style="margin-top:10px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px;"><b>⚡ Chaîne verdictFinal (toute étages confondus, verdict réellement affiché) :</b> '+rate(valides,'vfOk')+'</div>';
    h += '<div class="kv" style="border:1px solid #60a5fa; border-radius:8px; padding:6px; margin-top:6px;"><b>⚽ Score (calculerButsCamp rejoué, écart ≤1 but) :</b> '+rate(valides,'scoreOk')+'</div>';
    // ── Tirages aveugles (démarche intégrée le 12/07/26) : "Lancer aléatoire" ──
    // ── constitue un tirage sans biais possible (mères tirées au hasard, ──
    // ── aucune influence de l utilisateur) — on isole sa fiabilité de celle ──
    // ── des tirages manuels pour valider le moteur honnêtement, sans avoir ──
    // ── à refaire ce travail à la main à chaque match comme avant. ──
    var blindEntries = valides.filter(function(r){ return r.blindTest; });
    var manualEntries = valides.filter(function(r){ return !r.blindTest; });
    if (blindEntries.length) {
      h += '<div class="kv" style="margin-top:10px; border:1px solid #34d399; border-radius:8px; padding:6px;"><b>🎲 Tirages aveugles (' + blindEntries.length + ') — verdict :</b> ' + rate(blindEntries, 'vfOk') + (manualEntries.length ? ' <span class="muted" style="font-size:11px;">(vs manuels : ' + rate(manualEntries, 'vfOk') + ')</span>' : '') + '</div>';
      h += '<div class="kv" style="font-size:12px;"><b>🎲 Tirages aveugles — score :</b> ' + rate(blindEntries, 'scoreOk') + '</div>';
      h += '<div class="muted" style="font-size:11px; margin-top:4px;">Un tirage aveugle élimine tout biais de sélection des mères — c est le test le plus honnête du moteur. Si son taux diverge fortement du taux manuel, ça peut aussi révéler un biais de choix des mères en usage réel.</div>';
    }
    // ── CONFLITS MOTEURS V7 vs nouvelle chaîne (revue contradictions) ──
    // verdictV7 promet de basculer la priorité vers la "nouvelle chaîne"
    // si les stats confirment sur 10+ conflits (commentaire du 02/07/26,
    // jamais suivi jusqu ici faute de compteur). On l évalue ici pour de
    // vrai sur l archive rejouée à chaque ouverture de l onglet.
    var conflits = valides.filter(function(r){ return r.hasConflict; });
    if(conflits.length){
      var seuilAtteint = conflits.length >= 10;
      h += '<div class="kv" style="margin-top:8px; border:1px solid #a78bfa; border-radius:8px; padding:6px;"><b>⚔️ Conflits moteurs (V7 vs nouvelle chaîne) :</b> '+conflits.length+' conflit(s) observé(s) — V7 correct '+rate(conflits,'conflictV7Ok')+', nouvelle chaîne correcte '+rate(conflits,'conflictChaineOk')+'</div>';
      h += '<div class="muted" style="font-size:11px;">'+(seuilAtteint
        ? '✅ Seuil de 10+ conflits atteint — comparer les deux taux ci-dessus pour décider si la priorité doit basculer vers la nouvelle chaîne (actuellement V7 reste maître, cf. verdictV7).'
        : '⏳ Seuil de 10+ conflits pas encore atteint ('+conflits.length+'/10) — priorité laissée à V7 en attendant.')+'</div>';
    }
    var nonApplicableVf = valides.filter(function(r){return r.vfWinner===null || r.vfWinner===undefined;}).length;
    if(nonApplicableVf){
      h += '<div class="kv" style="border:1px dashed #a78bfa; border-radius:8px; padding:6px; margin-top:4px;"><b>🔍 Convergence des signaux d étude sur ces '+nonApplicableVf+' thème(s) indécis :</b> '+rate(valides,'convergenceOk')+'</div>';
      h += '<div class="muted" style="font-size:11px;">Vote majoritaire (état des chefs / duel des binômes / orientation des forces) — informatif, ne tranche aucun verdict.</div>';
    }
    var sansFavori = valides.filter(function(r){return !r.favoriteKnown;}).length;
    if(sansFavori) h += '<div class="muted" style="font-size:11px;">⚠️ '+sansFavori+' entrée(s) archivée(s) avant l ajout du champ favori — rejouées avec favori=aucun.</div>';
    // ── 📚 ÉTUDE — Témoin M1/M7 (findFigureTargetByBinomeWitness), branché
    // le 26/07/26 à la demande d'Ellemine_D. Pur diagnostic de corrélation
    // brute : ne tranche AUCUNE direction, ne pèse sur AUCUN verdict. Sert
    // uniquement à observer si le fait qu'une figure serve elle-même de
    // témoin (binôme) actif à une autre figure du thème corrèle avec le
    // vainqueur réel, avant toute décision sur le sens de l'effet.
    var twM1Only = valides.filter(function(r){return r.temoinFig1CibleActive && !r.temoinFig7CibleActive;});
    var twM7Only = valides.filter(function(r){return r.temoinFig7CibleActive && !r.temoinFig1CibleActive;});
    var twBoth = valides.filter(function(r){return r.temoinFig1CibleActive && r.temoinFig7CibleActive;});
    var twNone = valides.filter(function(r){return !r.temoinFig1CibleActive && !r.temoinFig7CibleActive;});
    function countTemoinWinner(list, w){ return list.filter(function(r){return r.temoinRealWinner===w;}).length; }
    if(twM1Only.length || twM7Only.length || twBoth.length || twNone.length){
      h += '<div class="kv" style="border:1px dashed #a78bfa; border-radius:8px; padding:6px; margin-top:4px;"><b>🧪 Témoin M1/M7 (brut, non tranché) :</b></div>';
      h += '<div class="muted" style="font-size:11px;">La figure sert-elle elle-même de témoin (binôme) actif à une autre figure du thème ? Corrélation observée uniquement — hypothèse (énergie engagée ailleurs vs renfort) non tranchée.</div>';
      if(twM1Only.length) h += '<div class="kv" style="font-size:12px;">Témoin actif seulement côté M1 ('+twM1Only.length+') : réel M1 '+countTemoinWinner(twM1Only,'M1')+' — M7 '+countTemoinWinner(twM1Only,'M7')+' — Nul '+countTemoinWinner(twM1Only,'Nul')+'</div>';
      if(twM7Only.length) h += '<div class="kv" style="font-size:12px;">Témoin actif seulement côté M7 ('+twM7Only.length+') : réel M1 '+countTemoinWinner(twM7Only,'M1')+' — M7 '+countTemoinWinner(twM7Only,'M7')+' — Nul '+countTemoinWinner(twM7Only,'Nul')+'</div>';
      if(twBoth.length) h += '<div class="kv" style="font-size:12px;">Témoin actif des deux côtés ('+twBoth.length+') : réel M1 '+countTemoinWinner(twBoth,'M1')+' — M7 '+countTemoinWinner(twBoth,'M7')+' — Nul '+countTemoinWinner(twBoth,'Nul')+'</div>';
      if(twNone.length) h += '<div class="kv" style="font-size:12px;">Aucun témoin actif ('+twNone.length+') : réel M1 '+countTemoinWinner(twNone,'M1')+' — M7 '+countTemoinWinner(twNone,'M7')+' — Nul '+countTemoinWinner(twNone,'Nul')+'</div>';
    }
    // ── 📚 ÉTUDE — Attaquant isolé (candidat #1, branché le 27/07/26).
    // Pur diagnostic de corrélation brute, aucune direction tranchée.
    var aiM1IsoOnly = valides.filter(function(r){return r.attaquant1Isole && !r.attaquant7Isole;});
    var aiM7IsoOnly = valides.filter(function(r){return r.attaquant7Isole && !r.attaquant1Isole;});
    var aiBothIso = valides.filter(function(r){return r.attaquant1Isole && r.attaquant7Isole;});
    var aiNoneIso = valides.filter(function(r){return r.attaquant1Actif && r.attaquant7Actif && !r.attaquant1Isole && !r.attaquant7Isole;});
    function countAttWinner(list, w){ return list.filter(function(r){return r.attaquantRealWinner===w;}).length; }
    if(aiM1IsoOnly.length || aiM7IsoOnly.length || aiBothIso.length || aiNoneIso.length){
      h += '<div class="kv" style="border:1px dashed #f59e0b; border-radius:8px; padding:6px; margin-top:4px;"><b>🧪 Attaquant isolé (brut, non tranché) :</b></div>';
      h += '<div class="muted" style="font-size:11px;">L antagoniste qui attaque M1/M7 est-il lui-même soutenu par son propre binôme, ou isolé (binôme absent) ? Corrélation observée uniquement.</div>';
      if(aiM1IsoOnly.length) h += '<div class="kv" style="font-size:12px;">Attaquant de M1 isolé, celui de M7 non ('+aiM1IsoOnly.length+') : réel M1 '+countAttWinner(aiM1IsoOnly,'M1')+' — M7 '+countAttWinner(aiM1IsoOnly,'M7')+' — Nul '+countAttWinner(aiM1IsoOnly,'Nul')+'</div>';
      if(aiM7IsoOnly.length) h += '<div class="kv" style="font-size:12px;">Attaquant de M7 isolé, celui de M1 non ('+aiM7IsoOnly.length+') : réel M1 '+countAttWinner(aiM7IsoOnly,'M1')+' — M7 '+countAttWinner(aiM7IsoOnly,'M7')+' — Nul '+countAttWinner(aiM7IsoOnly,'Nul')+'</div>';
      if(aiBothIso.length) h += '<div class="kv" style="font-size:12px;">Les deux attaquants isolés ('+aiBothIso.length+') : réel M1 '+countAttWinner(aiBothIso,'M1')+' — M7 '+countAttWinner(aiBothIso,'M7')+' — Nul '+countAttWinner(aiBothIso,'Nul')+'</div>';
      if(aiNoneIso.length) h += '<div class="kv" style="font-size:12px;">Les deux attaquants soutenus ('+aiNoneIso.length+') : réel M1 '+countAttWinner(aiNoneIso,'M1')+' — M7 '+countAttWinner(aiNoneIso,'M7')+' — Nul '+countAttWinner(aiNoneIso,'Nul')+'</div>';
    }
    // ── 📚 ÉTUDE — Favorabilité de maison du binôme (candidat #2, branché
    // le 27/07/26). Maison paire=favorable, impaire=défavorable (validé par
    // calcul, universel). Pur diagnostic, aucune direction tranchée.
    var fmM1FavOnly = valides.filter(function(r){return r.bin1Favorable && !r.bin7Favorable;});
    var fmM7FavOnly = valides.filter(function(r){return r.bin7Favorable && !r.bin1Favorable;});
    var fmBothFav = valides.filter(function(r){return r.bin1Favorable && r.bin7Favorable;});
    var fmNoneFav = valides.filter(function(r){return !r.bin1Favorable && !r.bin7Favorable;});
    function countFavWinner(list, w){ return list.filter(function(r){return r.favMaisonRealWinner===w;}).length; }
    if(fmM1FavOnly.length || fmM7FavOnly.length || fmBothFav.length || fmNoneFav.length){
      h += '<div class="kv" style="border:1px dashed #4CD97B; border-radius:8px; padding:6px; margin-top:4px;"><b>🧪 Favorabilité de maison du binôme (brut, non tranché) :</b></div>';
      h += '<div class="muted" style="font-size:11px;">Le binôme (témoin/renfort) de M1 ou M7 occupe-t-il une maison PAIRE (favorable) ? Corrélation observée uniquement.</div>';
      if(fmM1FavOnly.length) h += '<div class="kv" style="font-size:12px;">Binôme de M1 en maison favorable seulement ('+fmM1FavOnly.length+') : réel M1 '+countFavWinner(fmM1FavOnly,'M1')+' — M7 '+countFavWinner(fmM1FavOnly,'M7')+' — Nul '+countFavWinner(fmM1FavOnly,'Nul')+'</div>';
      if(fmM7FavOnly.length) h += '<div class="kv" style="font-size:12px;">Binôme de M7 en maison favorable seulement ('+fmM7FavOnly.length+') : réel M1 '+countFavWinner(fmM7FavOnly,'M1')+' — M7 '+countFavWinner(fmM7FavOnly,'M7')+' — Nul '+countFavWinner(fmM7FavOnly,'Nul')+'</div>';
      if(fmBothFav.length) h += '<div class="kv" style="font-size:12px;">Les deux binômes en maison favorable ('+fmBothFav.length+') : réel M1 '+countFavWinner(fmBothFav,'M1')+' — M7 '+countFavWinner(fmBothFav,'M7')+' — Nul '+countFavWinner(fmBothFav,'Nul')+'</div>';
      if(fmNoneFav.length) h += '<div class="kv" style="font-size:12px;">Aucun binôme en maison favorable ('+fmNoneFav.length+') : réel M1 '+countFavWinner(fmNoneFav,'M1')+' — M7 '+countFavWinner(fmNoneFav,'M7')+' — Nul '+countFavWinner(fmNoneFav,'Nul')+'</div>';
    }
    // ── 📚 ÉTUDE — Témoins en équilibre + score auto-référence générative
    // (03/08/26, branché à la demande d'Ellemine_D). Calculé AUTOMATIQUEMENT
    // sur chaque match archivé possédant un thème complet — aucune saisie
    // manuelle requise. Hypothèse testée à la main sur 5 thèmes récités :
    // "témoins en équilibre + score élevé" est apparu 2 fois sur 2 nuls réels
    // dans ce petit échantillon, absent des autres cas (dont 1 victoire).
    // Ici recalculé sur l'archive réelle complète — seule source fiable.
    var arValides = valides.filter(function(r){return r.theme;});
    if(arValides.length){
      var arData = arValides.map(function(r){
        var ar = analyserAutoReferenceGenerative(r.theme);
        var tem = signalTemoinsEnEquilibre(r.theme);
        return {r:r, score:ar.score, temEq:tem.enEquilibre};
      });
      function countAR(list, w){ return list.filter(function(x){return x.r.realWinner===w;}).length; }
      var arTemOui = arData.filter(function(x){return x.temEq;});
      var arTemNon = arData.filter(function(x){return !x.temEq;});
      var arScoreHaut = arData.filter(function(x){return x.score>=4;});
      var arScoreBas = arData.filter(function(x){return x.score<4;});
      var arDouble = arData.filter(function(x){return x.temEq && x.score>=4;});
      h += '<div class="kv" style="border:1px dashed #93c5fd; border-radius:8px; padding:6px; margin-top:4px;"><b>🧪 Témoins en équilibre + score auto-référence (brut, non tranché) :</b></div>';
      h += '<div class="muted" style="font-size:11px;">Chaîne Mères→Filles→Nièces→Témoins→Juge→Réconciliation : combien d étages manifestent une paire d équilibre ou une répétition. Corrélation observée uniquement, recalculée automatiquement sur l archive réelle.</div>';
      h += '<div class="kv" style="font-size:12px;">Témoins en équilibre ('+arTemOui.length+') : réel M1 '+countAR(arTemOui,'M1')+' — M7 '+countAR(arTemOui,'M7')+' — Nul '+countAR(arTemOui,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">Témoins non équilibrés ('+arTemNon.length+') : réel M1 '+countAR(arTemNon,'M1')+' — M7 '+countAR(arTemNon,'M7')+' — Nul '+countAR(arTemNon,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">Score ≥4/6 ('+arScoreHaut.length+') : réel M1 '+countAR(arScoreHaut,'M1')+' — M7 '+countAR(arScoreHaut,'M7')+' — Nul '+countAR(arScoreHaut,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">Score &lt;4/6 ('+arScoreBas.length+') : réel M1 '+countAR(arScoreBas,'M1')+' — M7 '+countAR(arScoreBas,'M7')+' — Nul '+countAR(arScoreBas,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px; border-top:1px solid rgba(148,163,184,.2); padding-top:4px;">Témoins équilibrés ET score ≥4/6 ('+arDouble.length+') : réel M1 '+countAR(arDouble,'M1')+' — M7 '+countAR(arDouble,'M7')+' — Nul '+countAR(arDouble,'Nul')+'</div>';
    }
    // ── 📚 ÉTUDE — R1/R7 par ROTATION (04/08/26, branché à la demande
    // d'Ellemine_D : "la confrontation se fait au niveau de la rotation").
    // Voir calculerR1R7Rotation/signalsR1R7Rotation — définition du moteur
    // Quatre Trônes, PAS la résultante de la matrice 16×16. Calculé
    // automatiquement sur l'archive réelle à chaque ouverture.
    var rrValides = valides.filter(function(r){return r.theme;});
    if(rrValides.length){
      var rrData = rrValides.map(function(r){
        var s = signalsR1R7Rotation(r.theme);
        return Object.assign({r:r}, s);
      });
      function countRR(list, w){ return list.filter(function(x){return x.r.realWinner===w;}).length; }
      var rrBinR1Oui = rrData.filter(function(x){return x.binomeR1Present;});
      var rrBinR1Non = rrData.filter(function(x){return !x.binomeR1Present;});
      var rrEqOui = rrData.filter(function(x){return x.enEquilibre;});
      var rrEqNon = rrData.filter(function(x){return !x.enEquilibre;});
      var rrElemOui = rrData.filter(function(x){return x.memeElement;});
      var rrElemNon = rrData.filter(function(x){return !x.memeElement;});
      h += '<div class="kv" style="border:1px dashed #fb923c; border-radius:8px; padding:6px; margin-top:4px;"><b>🧪 R1/R7 par rotation (brut, non tranché) :</b></div>';
      h += '<div class="muted" style="font-size:11px;">R1 = figure occupant la maison de repos naturelle de M1, R7 = 6 maisons plus loin dans cette rotation (définition Quatre Trônes). Corrélation observée uniquement, recalculée automatiquement.</div>';
      h += '<div class="kv" style="font-size:12px;">Binôme R1 présent ('+rrBinR1Oui.length+') : réel M1 '+countRR(rrBinR1Oui,'M1')+' — M7 '+countRR(rrBinR1Oui,'M7')+' — Nul '+countRR(rrBinR1Oui,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">Binôme R1 absent ('+rrBinR1Non.length+') : réel M1 '+countRR(rrBinR1Non,'M1')+' — M7 '+countRR(rrBinR1Non,'M7')+' — Nul '+countRR(rrBinR1Non,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">R1/R7 en équilibre ('+rrEqOui.length+') : réel M1 '+countRR(rrEqOui,'M1')+' — M7 '+countRR(rrEqOui,'M7')+' — Nul '+countRR(rrEqOui,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">R1/R7 pas en équilibre ('+rrEqNon.length+') : réel M1 '+countRR(rrEqNon,'M1')+' — M7 '+countRR(rrEqNon,'M7')+' — Nul '+countRR(rrEqNon,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">R1/R7 même élément ('+rrElemOui.length+') : réel M1 '+countRR(rrElemOui,'M1')+' — M7 '+countRR(rrElemOui,'M7')+' — Nul '+countRR(rrElemOui,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">R1/R7 éléments différents ('+rrElemNon.length+') : réel M1 '+countRR(rrElemNon,'M1')+' — M7 '+countRR(rrElemNon,'M7')+' — Nul '+countRR(rrElemNon,'Nul')+'</div>';

      // ── 📚 ÉTUDE — Chaîne R1 interceptée (04/08/26, branché à la demande
      // d'Ellemine_D suite à l'analyse manuelle du thème Conjonctio/Fortuna
      // Minor/Via/Albus, réel 0-1). Voir signalChaineR1Interceptee — compte
      // le taux d'exposition de la chaîne de binômes de R1 (combien de ses
      // 8 maillons ont un antagoniste présent dans le thème). Un seul cas
      // confirmé jusqu'ici (7/8, victoire du camp opposé à R1) — à voir si
      // ça se généralise sur l'archive complète.
      var criData = rrData.map(function(x){
        var ci = signalChaineR1Interceptee(x.r.theme);
        return Object.assign({r:x.r}, ci);
      });
      var criBas = criData.filter(function(x){return x.maillonsInterceptes.length<=2;});
      var criMoyen = criData.filter(function(x){return x.maillonsInterceptes.length>2 && x.maillonsInterceptes.length<=5;});
      var criHaut = criData.filter(function(x){return x.maillonsInterceptes.length>5;});
      h += '<div class="kv" style="border:1px dashed #f87171; border-radius:8px; padding:6px; margin-top:8px;"><b>🧪 Chaîne R1 interceptée (brut, non tranché) :</b></div>';
      h += '<div class="muted" style="font-size:11px;">Taux d\'exposition : combien des 8 maillons de la chaîne de binômes de R1 ont leur antagoniste présent dans le thème. Hypothèse : chaîne très exposée (6-8) → camp de R1 fragile malgré une domination apparente. 1 seul cas confirmé pour l\'instant.</div>';
      h += '<div class="kv" style="font-size:12px;">Chaîne peu exposée, 0-2/8 ('+criBas.length+') : réel M1 '+countRR(criBas,'M1')+' — M7 '+countRR(criBas,'M7')+' — Nul '+countRR(criBas,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">Chaîne moyennement exposée, 3-5/8 ('+criMoyen.length+') : réel M1 '+countRR(criMoyen,'M1')+' — M7 '+countRR(criMoyen,'M7')+' — Nul '+countRR(criMoyen,'Nul')+'</div>';
      h += '<div class="kv" style="font-size:12px;">Chaîne très exposée, 6-8/8 ('+criHaut.length+') : réel M1 '+countRR(criHaut,'M1')+' — M7 '+countRR(criHaut,'M7')+' — Nul '+countRR(criHaut,'Nul')+'</div>';

      // ── 📚 ÉTUDE — Figure arrière (racine) en Guerre Civile (05/08/26,
      // branché à la demande d'Ellemine_D). Applicable seulement quand R1
      // et R7 sont eux-mêmes en relation racine/chef directe. Voir
      // signalRacineArriereGuerreCivile.
      var raData = rrValides.map(function(r){
        var ra = signalRacineArriereGuerreCivile(r.theme);
        return Object.assign({r:r}, ra);
      }).filter(function(x){ return x.applicable; });
      if (raData.length) {
        var raRacineWin = raData.filter(function(x){ return x.r.realWinner === x.campRacine; });
        var raChefWin = raData.filter(function(x){ return x.r.realWinner === x.campChef; });
        var raNul = raData.filter(function(x){ return x.r.realWinner === 'Nul'; });
        var raAvecBinome = raData.filter(function(x){ return x.racineAvecSonBinome; });
        var raAvecBinomeRacineWin = raAvecBinome.filter(function(x){ return x.r.realWinner === x.campRacine; });
        h += '<div class="kv" style="border:1px dashed #a78bfa; border-radius:8px; padding:6px; margin-top:8px;"><b>🧪 Figure arrière (racine) en Guerre Civile (brut, non tranché) :</b></div>';
        h += '<div class="muted" style="font-size:11px;">Applicable quand R1 et R7 sont en relation binôme directe (l\'un est la racine/amont de l\'autre). Hypothèse : la racine gagne souvent, surtout avec sa propre chaîne active.</div>';
        h += '<div class="kv" style="font-size:12px;">Cas applicables ('+raData.length+'/'+rrValides.length+') : racine gagne '+raRacineWin.length+' — chef gagne '+raChefWin.length+' — Nul '+raNul.length+'</div>';
        h += '<div class="kv" style="font-size:12px;">Dont racine "avec son binôme" ('+raAvecBinome.length+') : racine gagne '+raAvecBinomeRacineWin.length+'/'+raAvecBinome.length+'</div>';
      } else {
        h += '<div class="kv" style="font-size:12px; color:#94a3b8;">🧪 Figure arrière (racine) en Guerre Civile : aucun cas applicable dans l\'archive actuelle (R1/R7 jamais en relation binôme directe).</div>';
      }

      // ── 📚 ÉTUDE (devenue verdict actif le 05/08/26) — Axe Succédent
      // comme 4 mères, opposition M13/M14 sur le thème dérivé. Signal
      // maintenant branché dans verdictFamilialEngine — ce diagnostic
      // continue de tourner pour suivre sa précision réelle au fil de
      // l'archive qui grandit.
      var asData = rrValides.map(function(r){
        var as = signalAxeSuccedentOpposition(r.theme);
        return Object.assign({r:r}, as);
      });
      var asOui = asData.filter(function(x){ return x.opposition; });
      var asNon = asData.filter(function(x){ return !x.opposition; });
      var asOuiVraiNul = asOui.filter(function(x){ return x.r.realWinner === 'Nul'; });
      h += '<div class="kv" style="border:1px dashed #4ade80; border-radius:8px; padding:6px; margin-top:8px;"><b>🧪 Axe Succédent — opposition M13/M14 (branché au verdict le 05/08/26) :</b></div>';
      h += '<div class="muted" style="font-size:11px;">Précision de référence mesurée le 05/08/26 : 43% (3/7). À suivre ici en continu.</div>';
      h += '<div class="kv" style="font-size:12px;">Opposition active ('+asOui.length+') : Nul réel '+asOuiVraiNul.length+'/'+asOui.length+' ('+(asOui.length?Math.round(100*asOuiVraiNul.length/asOui.length):0)+'%) — M1 '+countRR(asOui,'M1')+' — M7 '+countRR(asOui,'M7')+'</div>';
      h += '<div class="kv" style="font-size:12px;">Opposition absente ('+asNon.length+') : Nul réel '+countRR(asNon,'Nul')+' — M1 '+countRR(asNon,'M1')+' — M7 '+countRR(asNon,'M7')+'</div>';
    }
    // ── 📚 ÉTUDE — Famille d'opposition (candidat #3, branché le 27/07/26).
    // M1/M7 appartient TOUJOURS à la famille Carcer (loi fixe, vérifiée).
    // Pur diagnostic, aucune direction tranchée.
    var foCarcerOnly = valides.filter(function(r){return r.carcerActive && !r.puellaActive;});
    var foPuellaOnly = valides.filter(function(r){return r.puellaActive && !r.carcerActive;});
    var foBoth = valides.filter(function(r){return r.carcerActive && r.puellaActive;});
    var foNone = valides.filter(function(r){return !r.carcerActive && !r.puellaActive;});
    function countFoWinner(list, w){ return list.filter(function(r){return r.familleRealWinner===w;}).length; }
    if(foCarcerOnly.length || foPuellaOnly.length || foBoth.length || foNone.length){
      h += '<div class="kv" style="border:1px dashed #E8A93B; border-radius:8px; padding:6px; margin-top:4px;"><b>🧪 Famille d’opposition (brut, non tranché) :</b></div>';
      h += '<div class="muted" style="font-size:11px;">Carcer (figure-loi fixe de l axe M1/M7) et/ou Puella (figure-loi des autres axes) sont-ils actifs dans le thème ? Corrélation observée uniquement.</div>';
      if(foCarcerOnly.length) h += '<div class="kv" style="font-size:12px;">Carcer actif seul ('+foCarcerOnly.length+') : réel M1 '+countFoWinner(foCarcerOnly,'M1')+' — M7 '+countFoWinner(foCarcerOnly,'M7')+' — Nul '+countFoWinner(foCarcerOnly,'Nul')+'</div>';
      if(foPuellaOnly.length) h += '<div class="kv" style="font-size:12px;">Puella actif seul ('+foPuellaOnly.length+') : réel M1 '+countFoWinner(foPuellaOnly,'M1')+' — M7 '+countFoWinner(foPuellaOnly,'M7')+' — Nul '+countFoWinner(foPuellaOnly,'Nul')+'</div>';
      if(foBoth.length) h += '<div class="kv" style="font-size:12px;">Les deux actifs ('+foBoth.length+') : réel M1 '+countFoWinner(foBoth,'M1')+' — M7 '+countFoWinner(foBoth,'M7')+' — Nul '+countFoWinner(foBoth,'Nul')+'</div>';
      if(foNone.length) h += '<div class="kv" style="font-size:12px;">Aucun actif ('+foNone.length+') : réel M1 '+countFoWinner(foNone,'M1')+' — M7 '+countFoWinner(foNone,'M7')+' — Nul '+countFoWinner(foNone,'Nul')+'</div>';
    }
    // ── Ventilation par étage de parole (rangParole) : c est ici qu on ──
    // ── voit QUEL étage de la hiérarchie mérite vraiment sa place. ──
    var byEtage = {};
    valides.forEach(function(r){
      if(r.vfWinner===null || r.vfWinner===undefined) return; // abstention/indécis exclus du classement
      var key = r.vfRang+'|'+r.vfEtage;
      if(!byEtage[key]) byEtage[key] = [];
      byEtage[key].push(r);
    });
    var etageKeys = Object.keys(byEtage).sort(function(a,b){ return parseInt(b)-parseInt(a); });
    if(etageKeys.length){
      h += '<div class="kv" style="margin-top:6px; font-size:12px;"><b>Détail par étage (rang décroissant) :</b></div>';
      etageKeys.forEach(function(k){
        var list = byEtage[k];
        var etage = k.split('|')[1];
        var rang = k.split('|')[0];
        var ok = list.filter(function(r){return r.vfOk===true;}).length;
        var pct = Math.round(100*ok/list.length);
        var color = pct>=70 ? '#4ade80' : pct>=50 ? '#fbbf24' : '#f87171';
        h += '<div class="kv" style="font-size:12px; color:'+color+';">rang '+rang+' — '+etage+' : '+ok+'/'+list.length+' ('+pct+'%)</div>';
      });
      h += '<div class="muted" style="font-size:11px; margin-top:4px;">Un étage sous ~50% avec échantillon suffisant (≥5) doit être rétrogradé en 📚 étude et retiré de la chaîne décisionnelle de verdictFinal.</div>';
    }
    // ── Ventilation par délai de tirage (radicalité) : teste l hypothèse ──
    // ── "tiré loin du coup d envoi = moins fiable" sur l archive réelle. ──
    var byDelai = {};
    valides.forEach(function(r){
      if(r.vfWinner===null || r.vfWinner===undefined) return;
      var key = r.delaiBucket;
      if(!byDelai[key]) byDelai[key] = [];
      byDelai[key].push(r);
    });
    var ordreBuckets = ['≤15min','15-60min','1-2h','>2h','inconnu'];
    var delaiKeys = ordreBuckets.filter(function(k){ return byDelai[k] && byDelai[k].length; });
    if(delaiKeys.length){
      h += '<div class="kv" style="margin-top:10px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px; font-size:12px;"><b>⏳ Détail par délai de tirage avant coup d envoi (radicalité) :</b></div>';
      delaiKeys.forEach(function(k){
        var list = byDelai[k];
        var ok = list.filter(function(r){return r.vfOk===true;}).length;
        var pct = Math.round(100*ok/list.length);
        var color = pct>=70 ? '#4ade80' : pct>=50 ? '#fbbf24' : '#f87171';
        h += '<div class="kv" style="font-size:12px; color:'+color+';">'+k+' : '+ok+'/'+list.length+' ('+pct+'%)</div>';
      });
      h += '<div class="muted" style="font-size:11px; margin-top:4px;">Si le taux chute nettement au-delà de 1h, ça confirme la doctrine classique de radicalité — envisager de repousser les tirages au plus près du coup d envoi.</div>';
    }
    // ── Convergence nul (Portugal-Espagne, 07/07/26) : quand ce signal ──
    // ── se déclenche, est-ce que verdictFinal se trompe plus souvent ? ──
    var convOui = valides.filter(function(r){ return r.vfWinner!==null && r.vfWinner!==undefined && r.convergeNul; });
    var convNon = valides.filter(function(r){ return r.vfWinner!==null && r.vfWinner!==undefined && !r.convergeNul; });
    if (convOui.length) {
      var okOui = convOui.filter(function(r){return r.vfOk===true;}).length;
      var pctOui = Math.round(100*okOui/convOui.length);
      var okNon = convNon.length ? convNon.filter(function(r){return r.vfOk===true;}).length : 0;
      var pctNon = convNon.length ? Math.round(100*okNon/convNon.length) : null;
      h += '<div class="kv" style="margin-top:10px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px; font-size:12px;"><b>📚 étude — Convergence nul (juge+campMuet+miroirR) :</b></div>';
      h += '<div class="kv" style="font-size:12px; color:'+(pctOui<50?'#f87171':'#fbbf24')+';">Signal déclenché : '+okOui+'/'+convOui.length+' ('+pctOui+'%) — '+(pctNon!==null?'vs '+okNon+'/'+convNon.length+' ('+pctNon+'%) sans le signal':'pas assez de cas sans signal')+'</div>';
      h += '<div class="muted" style="font-size:11px; margin-top:4px;">Si le taux chute nettement quand le signal se déclenche, ça confirme qu\'un rang faible ne devrait pas trancher seul dans ces cas — envisager de remonter une alerte d\'incertitude avant promotion en règle décisionnelle.</div>';
    }
    // ── Antagoniste "complément total" M1↔M7 (07/07/26) : ce lien candidat ──
    // ── remplace-t-il utilement ANTAGONISTES_V7, ou fait-il pire ? ──
    var compOui = valides.filter(function(r){ return r.vfWinner!==null && r.vfWinner!==undefined && r.complementM1M7; });
    if (compOui.length) {
      var okComp = compOui.filter(function(r){return r.vfOk===true;}).length;
      var pctComp = Math.round(100*okComp/compOui.length);
      h += '<div class="kv" style="margin-top:10px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px; font-size:12px;"><b>📚 étude — Antagoniste "complément total" M1↔M7 :</b></div>';
      h += '<div class="kv" style="font-size:12px; color:'+(pctComp>=70?'#4ade80':pctComp>=50?'#fbbf24':'#f87171')+';">'+okComp+'/'+compOui.length+' ('+pctComp+'%) quand M1 et M7 sont en opposition totale (4/4 lignes inversées).</div>';
      h += '<div class="muted" style="font-size:11px; margin-top:4px;">Compare ce taux au taux global de verdictFinal plus haut — si nettement supérieur, l\'antagonisme "complément total" a un pouvoir prédictif propre à tester comme alternative à ANTAGONISTES_V7.</div>';
    }
    // ── Taux de divergence inter-moteurs (07/07/26) : campDominant, ──
    // ── verdictElementaire et verdictFinal sont-ils d'accord entre eux ? ──
    var avecOpinion = valides.filter(function(r){ return r.vfWinner!==null && r.vfWinner!==undefined; });
    var divergents = avecOpinion.filter(function(r){ return r.enginesDivergent; });
    var convergents = avecOpinion.filter(function(r){ return !r.enginesDivergent; });
    if (avecOpinion.length) {
      var pctDiv = Math.round(100*divergents.length/avecOpinion.length);
      var okDiv = divergents.length ? divergents.filter(function(r){return r.vfOk===true;}).length : 0;
      var okConv = convergents.length ? convergents.filter(function(r){return r.vfOk===true;}).length : 0;
      h += '<div class="kv" style="margin-top:10px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px; font-size:12px;"><b>⚔️ Divergence inter-moteurs (campDominant vs verdictÉlémentaire vs verdictFinal) :</b></div>';
      h += '<div class="kv" style="font-size:12px; color:'+(pctDiv>=40?'#f87171':pctDiv>=20?'#fbbf24':'#4ade80')+';">'+divergents.length+'/'+avecOpinion.length+' ('+pctDiv+'%) des thèmes ont des moteurs en désaccord.</div>';
      if (divergents.length) h += '<div class="kv" style="font-size:12px;">Quand ils divergent : verdictFinal a raison '+okDiv+'/'+divergents.length+' ('+Math.round(100*okDiv/divergents.length)+'%)</div>';
      if (convergents.length) h += '<div class="kv" style="font-size:12px;">Quand ils convergent : verdictFinal a raison '+okConv+'/'+convergents.length+' ('+Math.round(100*okConv/convergents.length)+'%)</div>';
      h += '<div class="muted" style="font-size:11px; margin-top:4px;">Si le taux de réussite chute nettement dans les cas de désaccord, c\'est le signal le plus direct que les moteurs divergent trop et qu\'il faut retravailler la hiérarchie d\'arbitrage plutôt que d\'ajouter encore des règles.</div>';
    }
    // ── Binôme M1↔M7 (07/07/26, cas Suisse-Colombie) : les deux camps ──
    // ── liés par le binôme plutôt que l'antagonisme → piste de nul. ──
    var binOui = valides.filter(function(r){ return r.vfWinner!==null && r.vfWinner!==undefined && r.binomeM1M7; });
    if (binOui.length) {
      var okBin = binOui.filter(function(r){return r.vfOk===true;}).length;
      var pctBin = Math.round(100*okBin/binOui.length);
      h += '<div class="kv" style="margin-top:10px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px; font-size:12px;"><b>📚 étude — M1↔M7 binômes (pas antagonistes) :</b></div>';
      h += '<div class="kv" style="font-size:12px; color:'+(pctBin<50?'#f87171':'#fbbf24')+';">'+okBin+'/'+binOui.length+' ('+pctBin+'%) quand M1 et M7 sont binômes l\'un de l\'autre.</div>';
      h += '<div class="muted" style="font-size:11px; margin-top:4px;">Si ce taux reste bas et que la vraie issue est souvent Nul dans ces cas, ça confirme l\'hypothèse née du cas Suisse-Colombie (0-0) : l\'agressivité se déplace hors de l\'axe M1-M7 au lieu de trancher.</div>';
    }
    // ── Superposition réseaux M1↔M7 (07/07/26) : compte de maisons ──
    // ── partagées entre les réseaux antagoniste/binôme de M1 et M7. ──
    var bySuperp = {};
    valides.forEach(function(r){
      if(r.superpositionCount===undefined) return;
      var key = r.superpositionCount;
      if(!bySuperp[key]) bySuperp[key] = {nul:0, total:0};
      bySuperp[key].total++;
      if(r.realWinner==='Nul') bySuperp[key].nul++;
    });
    var superpKeys = Object.keys(bySuperp).sort(function(a,b){return a-b;});
    if(superpKeys.length){
      h += '<div class="kv" style="margin-top:10px; border-top:1px solid rgba(148,163,184,.3); padding-top:6px; font-size:12px;"><b>📚 étude — Superposition réseaux M1↔M7 (nb maisons partagées) :</b></div>';
      superpKeys.forEach(function(k){
        var d = bySuperp[k];
        h += '<div class="kv" style="font-size:12px;">'+k+' maisons : '+d.nul+'/'+d.total+' nuls</div>';
      });
      h += '<div class="muted" style="font-size:11px; margin-top:4px;">Sur les 6 premiers cas de référence, la valeur 6 était systématiquement associée à un nul (3/3), jamais atteinte sur une victoire nette. À confirmer avec plus de données avant toute conclusion.</div>';
    }
  }
  h += '<div class="muted" style="margin-top:10px; font-size:11px;">Les thèmes invalides (axes/binôme M1) sont exclus conformément au protocole. Les taux se recalculent avec les règles en vigueur : après toute modification du moteur, rouvre cet onglet pour vérifier qu aucune régression n est introduite.</div>';
  h += '</div>';
  document.getElementById('historyList').innerHTML = h;
}

