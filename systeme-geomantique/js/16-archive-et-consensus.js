// ═══════════════════════════════════════════════════════════════
// ARCHIVE ET CONSENSUS
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
function ouvrirThemeAxeV7(cle) {
  const axe = AXES_V7.filter(function (a) { return a.cle === cle; })[0];
  if (!axe || !currentTheme) return;
  const meres = axe.maisons.map(function (h) { return currentTheme[h]; });
  ['m1', 'm2', 'm3', 'm4'].forEach(function (id, i) {
    const el = document.getElementById(id);
    if (el) el.value = meres[i];
  });
  const mode = document.getElementById('drawMode');
  if (mode && mode.value !== 'manual') { mode.value = 'manual'; toggleDrawMode(); }
  __axeDeplie = null;
  launchTheme(false);
}

function renderAxesPanel(theme) {
  const ancien = document.getElementById('axes-panel');
  if (ancien) ancien.remove();
  if (!theme) return;
  const hote = document.getElementById('lieux-marquage-panel')
            || document.getElementById('deux-marquent-panel')
            || document.getElementById('carte-verdict-r');
  if (!hote || !hote.parentNode) return;

  const d = lectureAxesV7(theme);
  const panneau = document.createElement('div');
  panneau.id = 'axes-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:10px; border:1px solid #a16207;';
  if (!d.applicable) {
    panneau.innerHTML = '<h3 style="margin-bottom:2px;">🧭 Les trois axes du carré</h3>'
      + '<div class="muted" style="font-size:11.5px;">' + d.raison + '</div>';
    hote.parentNode.insertBefore(panneau, hote.nextSibling);
    return;
  }

  const nom = function (f) { return f ? (FL[f] || f) : '—'; };
  const bleu = '#60a5fa', orange = '#fb923c';

  function carte(a) {
    if (!a.applicable) {
      return '<div style="border:1px solid rgba(148,163,184,.22); border-radius:5px; padding:7px 9px;">'
        + '<b>' + a.nom + '</b> <span class="muted" style="font-size:10px;">' + a.raison + '</span></div>';
    }
    const c = a.avantage === 'R1' ? bleu : a.avantage === 'R7' ? orange : '#94a3b8';
    const ouvert = __axeDeplie === a.cle;
    let h = '<div style="border:1px solid ' + (ouvert ? 'rgba(161,98,7,.6)' : 'rgba(148,163,184,.22)')
      + '; border-radius:5px; overflow:hidden;">'
      + '<button type="button" onclick="basculerAxeV7(\'' + a.cle + '\')" '
      + 'style="width:100%; text-align:left; background:transparent; border:0; padding:7px 9px; cursor:pointer; color:inherit; font:inherit;">'
      + '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:6px;">'
      + '<span><b style="font-size:11.5px;">' + a.nom + '</b> '
      + '<span class="muted" style="font-size:9.5px;">M' + a.maisons.join(' M') + '</span></span>'
      + '<b style="color:' + c + '; font-size:12px;">' + (a.avantage || 'partagé') + '</b></div>'
      + '<div class="muted" style="font-size:9.5px; margin-top:2px;">'
      + 'R1 ' + nom(a.R1) + ' ' + a.ancrageR1 + ' · R7 ' + nom(a.R7) + ' ' + a.ancrageR7
      + (a.temoins.opposes ? ' · <span style="color:#fbbf24;">témoins opposés — signal de nul</span>' : '')
      + (a.ancree ? '' : ' · <span style="color:#64748b;">axe non ancré</span>')
      + ' · ' + (a.valide
          ? '<span style="color:#4ade80;">dérivé VALIDE</span>'
          : '<span style="color:#f87171;">dérivé non valide ' + a.axesTenus + '/4</span>')
      + '</div></button>';
    if (ouvert) {
      h += '<div style="padding:0 9px 9px; font-size:10.5px; line-height:1.55;">'
        + '<div class="muted">Quatre mères du thème dérivé : ' + a.meres.map(nom).join(' · ') + '</div>'
        + '<div class="muted">Figure de l\'axe : ' + nom(a.figureAxe)
        + (a.ancree ? ' — présente en base dans le thème initial' : ' — absente du thème initial') + '</div>'
        + '<div style="margin-top:4px;"><b>Ancrage :</b> ' + (a.critere || '—') + '</div>'
        + '<div><b>Sièges :</b> ' + (a.siegesWinner || 'aucun départage') + '</div>'
        + '<div><b>Les deux marquent :</b> ' + (a.lesDeuxMarquent === null ? '—' : (a.lesDeuxMarquent ? 'oui' : 'non')) + '</div>'
        + '<div><b>Témoins M13/M14 :</b> ' + nom(a.temoins.m13) + ' / ' + nom(a.temoins.m14) + ' — '
        + (a.temoins.opposes ? 'opposés' : a.temoins.identiques ? 'identiques' : 'ni l\'un ni l\'autre') + '</div>'
        + '<div style="margin-top:6px;"><b>Les 16 maisons du thème dérivé</b>'
        + '<div class="muted" style="font-size:9.5px;">figure de base · <span style="color:#f59e0b;">résultante</span> '
        + '= figure combinée à la figure de repos de sa maison, exactement comme sur le thème principal.</div>'
        + '<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:3px; margin-top:4px;">'
        + (function () {
            let cases = '';
            for (let h = 1; h <= 16; h++) {
              const f = a.derive[h];
              const r = getResultant(f, h);
              const estSiege = (h === a.hR1 || h === a.hR7);
              cases += '<div style="border:1px solid ' + (estSiege ? 'rgba(161,98,7,.55)' : 'rgba(148,163,184,.18)')
                + '; border-radius:3px; padding:3px 4px; font-size:9px; line-height:1.35;'
                + (estSiege ? ' background:rgba(161,98,7,.10);' : '') + '">'
                + '<div class="muted" style="font-size:8px;">M' + h
                + (h === a.hR1 ? ' <b style="color:#60a5fa;">R1</b>' : '')
                + (h === a.hR7 ? ' <b style="color:#fb923c;">R7</b>' : '')
                + (FIGS[h - 1] === f ? ' <b style="color:#4ade80;">repos</b>' : '') + '</div>'
                + '<div>' + (FL[f] || f) + '</div>'
                + '<div style="color:#f59e0b;">' + (FL[r] || r) + '</div></div>';
            }
            return cases;
          })()
        + '</div></div>'
        + '<div><b>Validité du dérivé :</b> ' + (a.valide
            ? '<span style="color:#4ade80;">les 4 axes existent dans ce thème dérivé</span>'
            : '<span style="color:#f87171;">' + a.axesTenus + '/4 — manque ' + a.axesManquants.join(', ') + '</span>') + '</div>'
        + '<button type="button" class="btn-secondary" style="width:auto; padding:5px 10px; margin-top:7px; font-size:11px;" '
        + 'onclick="ouvrirThemeAxeV7(\'' + a.cle + '\')">Charger ce thème dérivé</button>'
        + '</div>';
    }
    return h + '</div>';
  }

  const cd = d.domination === 'R1' ? bleu : d.domination === 'R7' ? orange : '#94a3b8';
  panneau.innerHTML =
    '<h3 style="margin-bottom:2px;">🧭 Les trois axes du carré</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:9px; line-height:1.5;">'
    + 'Chacun des trois axes a quatre maisons. Leurs figures deviennent quatre nouvelles mères, et le thème dérivé '
    + 'passe par <b>exactement les mêmes couches</b> que le thème principal — ancrage, sièges, ouverture. '
    + 'Aucune règle spéciale. Touche un axe pour le déplier, puis « Charger ce thème dérivé » pour que tout '
    + 'le fichier bascule dessus.<br>'
    + '<b>Observation seule</b> — les axes ne décident pas du verdict, ils ont déjà écrasé deux fois des '
    + 'couches qui voyaient juste.</div>'
    + (d.validiteTheme
        ? '<div style="font-size:10.5px; margin-bottom:8px; padding:5px 8px; border-radius:5px; background:'
          + (d.validiteTheme.valide ? 'rgba(34,197,94,.10)' : 'rgba(248,113,113,.10)') + '; border:1px solid '
          + (d.validiteTheme.valide ? 'rgba(34,197,94,.35)' : 'rgba(248,113,113,.35)') + ';">'
          + '<b>Thème principal : ' + (d.validiteTheme.valide ? 'VALIDE' : 'non valide')
          + ' (' + d.validiteTheme.tenus + '/3 axes présents)</b>'
          + (d.validiteTheme.manquants.length ? ' — manque ' + d.validiteTheme.manquants.join(', ') : '')
          + '<div class="muted" style="margin-top:2px;">Trois axes, pas quatre : les douze maisons se partagent '
          + 'en exactement trois classes de pas 3, et prolonger un axe y ramène (4-7-10-1 = 1-4-7-10). '
          + 'L\'ancien Axe Temporel M3+M5+M11+M15 mélangeait deux classes et empruntait M15, hors du carré — '
          + 'retiré le 25/08. Les figures d\'axe comptent en base ou en résultante.</div></div>'
        : '')
    + '<div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:9px;">'
    + '<div style="flex:1; min-width:130px; border:1px solid rgba(161,98,7,.4); border-radius:5px; padding:6px 9px;">'
    + '<div class="muted" style="font-size:9.5px;">Qui domine dans les axes</div>'
    + '<b style="font-size:16px; color:' + cd + ';">' + (d.domination || 'partagés') + '</b>'
    + '<div class="muted" style="font-size:9.5px;">' + d.pourR1 + ' pour R1 · ' + d.pourR7 + ' pour R7'
    + (d.unanime ? ' — unanimes' : '') + '</div></div>'
    + '<div style="flex:1; min-width:130px; border:1px solid rgba(161,98,7,.4); border-radius:5px; padding:6px 9px;">'
    + '<div class="muted" style="font-size:9.5px;">Parmi les axes VALIDES seulement</div>'
    + '<b style="font-size:16px; color:' + (d.dominationFiable === 'R1' ? bleu : d.dominationFiable === 'R7' ? orange : '#94a3b8') + ';">'
    + (d.nbFiables ? (d.dominationFiable || 'partagés') : 'aucun') + '</b>'
    + '<div class="muted" style="font-size:9.5px;">' + d.nbFiables + '/4 dérivés valides'
    + (d.nbFiables ? ' · ' + d.fiableR1 + ' R1 · ' + d.fiableR7 + ' R7' : '') + '</div></div>'
    + '<div style="flex:1; min-width:130px; border:1px solid rgba(161,98,7,.4); border-radius:5px; padding:6px 9px;">'
    + '<div class="muted" style="font-size:9.5px;">Signal de nul — témoins opposés</div>'
    + '<b style="font-size:16px; color:' + (d.nulSignaux.length ? '#fbbf24' : '#94a3b8') + ';">'
    + d.nulSignaux.length + ' / 3</b>'
    + '<div class="muted" style="font-size:9.5px;">' + (d.nulSignaux.length ? d.nulSignaux.join(', ') : 'aucun axe')
    + ' · ' + d.axesAncres + '/3 axes ancrés</div></div></div>'
    + '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:7px;">'
    + d.axes.map(carte).join('') + '</div>'
    + '<div class="muted" style="font-size:10px; margin-top:8px; line-height:1.5;">'
    + '<b>⚠️ Ce que la mesure dit déjà.</b> Sur les quatre cas réels au vainqueur connu, la majorité des axes '
    + 'a raison <b>une fois</b> (Juventus), tort <b>deux fois</b> (Milan 7-0 pour R1 alors que les axes donnent R7 ; '
    + 'Napoli où ils donnent R1 alors que R7 gagne), et reste partagée une fois (Inter). Elle s\'accorde avec le '
    + 'verdict principal sur <b>52,5%</b> des thèmes — un pile ou face. '
    + 'Côté nul : les témoins opposés se déclenchent sur ~10% des thèmes par axe, et sur le seul vrai nul '
    + 'de l\'archive (Roma 1-1) <b>aucun</b> axe ne les montre.<br>'
    + '<b>Et la validité ne les sauve pas.</b> En ne gardant que les dérivés valides, la majorité ne se '
    + 'prononce plus que sur la moitié des cas réels — juste sur Juventus, fausse sur Milan — et Inter et Napoli n\'ont aucun '
    + 'dérivé valide. À noter aussi : le seul cas où le verdict principal se trompe (Napoli) a un thème '
    + '<b>valide</b>, et le cas Juventus, où il voit juste, un thème <b>non valide</b>. Sur ces six thèmes la '
    + 'validité ne prédit donc pas la justesse. C\'est cet instrument qui doit accumuler les cas.'
    + '</div>';

  hote.parentNode.insertBefore(panneau, hote.nextSibling);
}

// ═══════════════════════════════════════════════════════════════
// PANNEAU DU DUEL DU BOUCLIER (26/08/26)
// Rend visible le raisonnement qu'Ellemine_D fait à la main : qui attaque
// le bouclier, qui doit l'arrêter, avec quelle force élémentaire, binôme
// compris — et ce que la rupture libère.
// BRANCHÉ AU VERDICT le 26/08/26 sur demande d'Ellemine_D : un bouclier
// dont le duel est perdu ne pèse plus que la moitié dans la chaîne
// (COEF_BOUCLIER_ROMPU_V7 = 0,5). Le panneau montre donc désormais une
// grandeur qui entre dans le calcul. Voir le commentaire du coefficient
// pour ce que la mesure autorise à en dire — en résumé : aucune valeur du
// coefficient ne dépasse 5/7 sur les cas réels, 0,5 est la plus forte qui
// n'en retourne aucun, et le verdict change sur 5,9% des thèmes.

// ═══════════════════════════════════════════════════════════════
// LES JUMEAUX — Fiorentina et Atalanta (26/08/26)
// L'expérience la plus propre de l'archive : deux thèmes, MÊME rotation,
// mêmes centrales aux mêmes sièges, résultats OPPOSÉS.
//     Fiorentina : Rubeus · Puer · Fortuna Minor · Caput Draconis → 0-2 R7
//     Atalanta   : Rubeus · Tristitia · Laetitia · Via            → 4-0 R1
//     R1 = Tristitia (M7) · R7 = Albus (M13) dans les DEUX.
// Tout ce qui est structural est donc tenu constant : ce qui les sépare
// EST le discriminant. Sept maisons sur seize diffèrent.
//
// CE QUI LES SÉPARE, ET C'EST D'UNE SIMPLICITÉ BRUTALE :
//   Fiorentina — R1 Tristitia a bouclier (Laetitia), front (Fortuna
//     Major) et front du front (Populus) TOUS ABSENTS du thème. Seul son
//     binôme Carcer est là. R7 Albus garde bouclier (Puella, 3 occ,
//     ancrage 4) et front. → R7 gagne.
//   Atalanta — R1 a bouclier ET front présents en base. R7 a son
//     BOUCLIER absent (Puella, 0 occ). → R1 gagne.
// Dans les deux cas, le camp dont le bouclier et le front sont dans le
// thème l'emporte. Rien d'autre n'est nécessaire pour les départager.
//
// ⚠️ ET C'EST LÀ QUE ÇA SE COMPLIQUE. Toutes les règles de PRÉSENCE
// séparent bien les jumeaux — et toutes s'effondrent ailleurs :
//     4 pôles présents .................... 2/7
//     bouclier + front présents ........... 2/7
//     bouclier + front EN BASE ............ 3/7
//     4 pôles pondérés (b2 f2 bi1 ff1) .... 3/7
//     occurrences des 4 pôles ............. 3/7
//     bouclier + front, occurrences ....... 2/7
// Toutes justes sur Fiorentina et Atalanta, fausses presque partout
// ailleurs.
//
// LA COMPLÉMENTARITÉ, RÉELLE ET INEXPLOITÉE :
//     chaîne (présence) 5/7 — rate Napoli et Torino
//     duel4  (force)    5/7 — rate Inter et Atalanta
//   Leurs erreurs ne se recouvrent PAS : ensemble elles couvrent les
//   sept cas. Un sélecteur parfait donnerait 7/7 — et ce serait un
//   ajustement pur sur sept cas.
//   Un sélecteur MOTIVÉ a été essayé : « comparer des forces n'a pas de
//   sens quand un pôle n'est pas dans le thème → lire la présence dans
//   ce cas, la force sinon ». Il se déclenche sur 41,5 % des thèmes.
//   Résultat : 4/7 — MOINS BIEN que chacune des deux prises seule.
//   L'hypothèse est donc réfutée, pas seulement non concluante.
//
// CE QUE ÇA LAISSE : le fait des jumeaux est solide et reproductible —
// bouclier et front présents décident, sur cette paire. Aucun moyen
// mesuré d'en faire une règle générale. Chercher d'autres sélecteurs sur
// ces mêmes sept cas reviendrait à pêcher ; il faut d'autres jumeaux,
// c'est-à-dire d'autres thèmes à rotation identique et résultat connu.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// TABLEAU DE BORD DES MOTEURS (26/08/26, demande d'Ellemine_D)
// « Pour chaque moteur créé, son propre affichage de résultats verdict
// après analyse. Comme ça on pourra éliminer les moteurs qui se trompent
// le plus souvent. »
//
// Chaque moteur est déclaré ici avec sa fonction de verdict et son score
// sur les sept cas au résultat connu. Les scores sont MESURÉS, pas
// estimés — ils sont à remettre à jour à chaque nouveau résultat réel.
// Détail case par case au 26/08/26 (Juventus, Inter, Milan, Napoli,
// Fiorentina, Atalanta, Torino) :
//   ancrage   ✓✓✓✗✓✓✗   chaîne  ✓✓✓✗✓✓✗   duel   ✗✓✓✓✓✓✗
//   F4P4      ✓✗✓✓✓✗✓   sièges  ✓✓✓✗✓✗✓   axes   ✓✓✗✓✗✗✓
//   réseau V2 ✗✓✓✗✗✓✗   boucles —✓✓✗——✓   hypothèse ✓✓✓✓✓✓✗
// Aucun moteur n'est au-dessus de 6/7, et 5/7 sur sept cas ne se
// distingue pas d'un tirage à pile ou face. Le tableau sert à ACCUMULER,
// pas à conclure.
// ═══════════════════════════════════════════════════════════════
// DIAGNOSTIC D'ELLEMINE_D (26/08/26) : « je vois pourquoi le système a
// du mal à raisonner — il y a trop de moteurs d'analyse. »
// Vérifié. Et le problème est plus précis que le nombre.
//
// 1. UN SEUL MOTEUR DÉCIDE, LES HUIT AUTRES SONT DÉCORATIFS.
//    Le verdict affiché suit une cascade : chaîne/ancrage, puis sièges,
//    puis réseau V2, puis boucles. Mesuré sur 1111 thèmes :
//    l'ancrage tranche en PREMIER dans 1111 cas sur 1111 — 100 %.
//    La cascade ne descend JAMAIS d'un cran. Les six moteurs suivants
//    sont calculés, affichés, discutés — et sans le moindre effet.
//    C'est ça qui donne l'illusion d'une délibération : la réponse est
//    déjà fixée avant que les autres parlent.
//
// 2. DEUX MOTEURS SONT LE MÊME.
//    Ancrage et Solidité de chaîne s'accordent sur 91 % des thèmes —
//    normal, l'ancrage EST la chaîne plus deux termes petits. Les faire
//    voter tous les deux, c'est compter une voix deux fois.
//    L'hypothèse « 2 boucliers rompus » est un mélange des trois
//    premiers (88 % / 81 % / 81 %), pas une vue neuve.
//
// 3. CE QUI EST RÉELLEMENT DISTINCT — accord deux à deux sur 1111 thèmes
//        ancrage ↔ chaîne ......... 91 %   (doublon)
//        ancrage ↔ duel ........... 69 %
//        duel ↔ F4P4 .............. 74 %
//        ancrage ↔ F4P4 ........... 64 %
//        sièges ↔ tout le reste ... 47–53 %
//        axes ↔ tout le reste ..... 48–54 %
//        réseau V2 ↔ tout ......... 50–61 %
//    Trois familles seulement : (chaîne/ancrage), (duel/F4P4), et les
//    témoins indépendants (sièges, axes, réseau, boucles).
//
// 4. ET LES MAUVAIS MOTEURS TIRENT LE VOTE VERS LE BAS.
//    Vote à la majorité sur les sept cas au résultat connu :
//        les 9 moteurs ......................... 5/7
//        ancrage seul .......................... 5/7
//        SANS Réseau V2 NI Boucles (7 moteurs) . 6/7
//        ancrage + duel + F4P4 ................. 6/7
//        ancrage + F4P4 + axes ................. 6/7
//        duel + F4P4 seuls ..................... 3/7
//    Retirer les deux moteurs à 3/7 fait passer le vote de 5/7 à 6/7.
//    Ils ne sont pas neutres : ils votent, et ils votent mal.
//    ⚠️ Neuf combinaisons essayées sur sept cas — trois atteignent 6/7,
//    ce qui n'est pas improbable par hasard. Mais le retrait des deux
//    plus faibles a été décidé AVANT de regarder le vote, sur leur seul
//    score : ce n'est pas une pêche aux résultats.
//
// ─── CE QU'IL FAUDRAIT FAIRE, ET QUI RESTE À TRANCHER AVEC LUI ───
//  · retirer Réseau d'ancrage V2 et Boucles antagonistes (3/7 chacun,
//    sous le hasard, et jamais décisifs) ;
//  · fusionner Ancrage et Chaîne en une seule voix ;
//  · remplacer la cascade — qui ne descend jamais — par un vote entre
//    les familles réellement distinctes.
// Rien de tout cela n'est fait ici : ce bloc CONSTATE, il ne change pas
// le calcul. Supprimer des moteurs est irréversible pour l'archive des
// comparaisons ; c'est à Ellemine_D de le décider.
// ═══════════════════════════════════════════════════════════════
// LE BANC DE RÉFÉRENCE — les cas au résultat connu, en DONNÉES.
//
// Pourquoi ce bloc existe. Jusqu'au 27/08/26 l'archive vivait dans les
// commentaires en tête de fichier, et la justesse de chaque moteur était
// écrite EN DUR dans MOTEURS_V7 (juste: 5, total: 7). Un chiffre écrit à
// la main ne bouge pas quand le code bouge.
//
// Ce qui est arrivé, et qui a motivé ce banc : le 26/08, en corrigeant la
// mesure de F4P4, forceCampV7 a basculé d'échelle. duelBouclierV7 s'en
// sert pour dire si un bouclier tient, et soliditeChaineV7 divise la
// chaîne par deux quand il est rompu. Résultat : la chaîne de R1 sur
// Juventus est passée de 10 à 8, le cas a basculé de R1 à R7, Inter est
// tombé à égalité — et les panneaux ont continué d'afficher « 5/7 »
// pendant que les moteurs faisaient 3/7. Personne ne pouvait le voir.
//
// Désormais les cas sont des données, le banc les rejoue à chaque appel,
// et les cartes affichent la justesse MESURÉE. Toute modification de
// doctrine est notée sur-le-champ.
//
// ⚠️ CE QUE LE BANC NE DIT PAS. Une poignée de cas décisifs, c'est très
// peu : à ce nombre, un moteur au-dessus de la moitié ne se distingue pas
// d'un tirage à pile ou face, et le meilleur de neuf moteurs est attendu
// haut par simple sélection. Le banc sert à DÉTECTER LES RÉGRESSIONS, pas
// à couronner un moteur.
// (Le compte exact est calculé et affiché par renderBancPanel — ne pas
// le réécrire ici, il vieillirait comme le « sept » qu'il remplace.)
var CAS_REFERENCE_V7 = [
  { nom: 'Juventus', meres: ['conjunctio','rubeus','cauda_draconis','acquisitio'],
    score: '6-1', camp: 'R1', btts: true },
  { nom: 'Inter', meres: ['puella','via','conjunctio','via'],
    score: '3-2', camp: 'R1', btts: true },
  { nom: 'Milan', meres: ['tristitia','via','conjunctio','rubeus'],
    score: '7-0', camp: 'R1', btts: false,
    note: 'première prédiction hors échantillon' },
  { nom: 'Napoli', meres: ['conjunctio','fortuna_minor','via','albus'],
    score: '0-1', camp: 'R7', btts: false },
  // ─── LAZIO RETIRÉ DE L'ARCHIVE (29/08/26, demande d'Ellemine_D) ───
  // « supprime tout thème qui n'a pas de score dans l'archive pour éviter
  // les erreurs ». Lazio (mères Fortuna Minor · Amissio · Carcer · Carcer)
  // ne portait ni score ni vainqueur : seulement « les deux ont marqué ».
  // Il pesait donc sur la famille BTTS sans rien dire du camp, et il est
  // apparu deux fois comme faux espoir — d'abord parce que R1 = R7 =
  // Conjonctio (les deux sièges sur la MÊME figure, 5,1 % des thèmes),
  // ensuite parce que R1 y tombe en M9, la maison des deux nuls. Un cas
  // qu'on ne peut ni confirmer ni infirmer n'est pas une donnée.
  // Le thème reste reconstructible à tout moment depuis ses quatre mères
  // si le score refait surface : c'est la seule chose qui manquait.
  // Conséquence mesurée : la famille BTTS passe de 20 à 19 cas.
  { nom: 'Roma', meres: ['fortuna_minor','acquisitio','carcer','albus'],
    score: '1-1', camp: 'nul', btts: true,
    note: 'seul vrai nul de l’archive' },
  { nom: 'Fiorentina', meres: ['rubeus','puer','fortuna_minor','caput_draconis'],
    score: '0-2', camp: 'R7', btts: false,
    note: 'deuxième prédiction hors échantillon' },
  { nom: 'Atalanta', meres: ['rubeus','tristitia','laetitia','via'],
    score: '4-0', camp: 'R1', btts: false,
    note: 'même rotation que Fiorentina, résultat opposé' },
  { nom: 'Torino', meres: ['via','rubeus','via','tristitia'],
    score: '0-1', camp: 'R7', btts: false,
    note: 'casse la hiérarchie : les couches fortes disaient R1' },
  // ─── AJOUTÉ LE 28/08/26, SUR DEMANDE D'ELLEMINE_D ───
  // PSG vs Bayer 04, FC 26 — 5x5 Rush — Superligue. Réel 1-2.
  // ⚡ FORMAT E-SPORT (rang 7) : TIER_CONFIG applique multButs 2,5 à ces
  // formats, et le fichier note ailleurs « testé sur 6 vrais matchs,
  // hors esport ». Le CAMP reste comparable — une victoire est une
  // victoire — mais aucun chiffre de ce cas ne doit servir à juger le
  // générateur de score. Marqué ⚡ dans le banc pour qu'on ne l'oublie
  // jamais.
  //
  // CE QU'IL APPREND. Le vote des huit moteurs dit R1, 6 contre 2, et se
  // trompe. Les deux minoritaires — Lecture des sièges et Majorité des
  // axes — disent R7 et ont raison. Et les deux lectures branchées les
  // 27 et 28/08 pointent le même camp que le réel :
  //     dominant des corners ... M7      camp de l'incident ... M7
  // Premier cas de l'archive où trois signaux HORS du vote de camp
  // désignaient le bon vainqueur contre lui.
  // C'est aussi le cas qui a révélé que le vainqueur enregistré
  // contredisait son propre score dans 47 % des entrées.
  { nom: 'PSG/Bayer', meres: ['caput_draconis','acquisitio','conjunctio','via'],
    score: '1-2', camp: 'R7', btts: true, esport: true,
    note: 'FC 26 — 5x5 Rush (e-sport, rang 7) · le vote se trompe 6-2, '
      + 'sièges et axes ont raison, corners et incident aussi' },
  // ─── AJOUTÉ LE 28/08/26 — PREMIER CAS ANNONCÉ AVANT LE RÉSULTAT ───
  // Caput Draconis · Carcer · Fortuna Major · Populus.
  // Réel : 1-0 POUR R7, avec CARTON ROUGE du côté de R1.
  // ⚠️ CONVENTION DE L'ARCHIVE : score écrit M1-M7. « 1-0 pour R7 »
  // s'écrit donc '0-1'. Se tromper de sens ici corromprait le banc.
  //
  // CE CAS EST LE PREMIER TEST EN AVEUGLE DE F4P4 AU VOLANT, et il le
  // passe : F4P4 annonçait R7 (2 pôles solides contre 1) AVANT que le
  // score soit connu. La lecture des sièges, qui pilotait la veille,
  // annonçait R1 — elle se serait trompée. Le changement de volant est
  // validé sur son premier cas réel.
  //
  // MAIS TROIS AUTRES LECTURES SE TROMPENT, ET IL FAUT LE DIRE :
  //   · BTTS : la chaîne annonce « les deux marquent », le réel est 1-0.
  //     Avant que le perdant soit désigné par F4P4 (même jour), elle
  //     disait « un seul marque, muet R1 » — ce qui était JUSTE. Ma
  //     correction de cohérence lui a fait perdre ce cas.
  //   · INCIDENT : présence annoncée (85 %, très élevé) ✔, mais CAMP
  //     annoncé M7 alors que le rouge est côté R1. Premier test de
  //     l'attribution, premier échec.
  //   · SCORE : 2-4 annoncé, 0-1 réel.
  { nom: 'Bologna', meres: ['caput_draconis','carcer','fortuna_major','populus'],
    score: '0-1', camp: 'R7', btts: false, incident: true, incidentCamp: 'M1',
    note: 'annoncé AVANT le résultat · camp ✔ par F4P4 (les sièges disaient R1) · '
      + 'BTTS ✘ · incident présent ✔ mais camp ✘ (annoncé M7, rouge côté R1)' },
  // ─── AJOUTÉ LE 28/08/26 — LE CAS QUI RECADRE LES INCIDENTS ───
  // Match du jeudi 27/08. Réel : 2-1 POUR R7, ROUGE côté R1 et PENALTY
  // côté R1 — les DEUX incidents dans le MÊME camp. (Première lecture
  // corrigée aussitôt par Ellemine_D : le penalty était contre R1, pas
  // pour lui. Le camp du penalty est désormais un champ à part entière,
  // et c'est ce cas qui l'a fait naître.)
  //
  // CE QU'IL APPREND. Le siège de R1 (M10) et celui de R7 (M16) sont
  // tous deux en maison PAIRE : par la loi de la résultante ils ne
  // pouvaient engendrer aucune agression, et les deux moteurs « le siège
  // engendre Mars » se taisent alors qu'il y a eu deux incidents. Ce
  // n'est donc pas le siège de la centrale qui porte l'incident.
  // Le thème engendre Mars dans exactement deux maisons : M1 (Carcer →
  // Rubeus) et M12 (Cauda → Puer). Or ces deux maisons tombent dans des
  // camps OPPOSÉS, et dans les deux repères à la fois :
  //     repère fixe ...... M1 → camp 1, M12 → camp 2
  //     repère tourné .... M1 → camp 2, M12 → camp 1
  // Comme les deux incidents réels sont dans le même camp, AU MOINS UNE
  // des deux naissances est un faux positif, quel que soit le repère.
  // Il n'y a donc pas eu « deux naissances, deux incidents » : il y a eu
  // une naissance utile et une de trop. Laquelle, on ne peut pas le
  // dire — le repère fixe explique tout par M1, le repère tourné
  // explique tout par M12. Les deux lectures siègent au banc et un
  // prochain match les séparera.
  // Le camp et le score sont ratés : verdict affiché R1 4-2, F4P4 R1,
  // réel R7 2-1.
  { nom: 'Jeudi 27/08', meres: ['carcer','amissio','conjunctio','fortuna_minor'],
    score: '1-2', camp: 'R7', btts: true, incident: true,
    incidentCamp: 'M1', penaltyCamp: 'M1',
    note: 'annoncé AVANT le résultat · camp ✘ (dit R1) · score ✘ · '
      + 'rouge ET penalty côté R1 — deux naissances de Mars, M1 et M12, dans des camps opposés' },
  // ─── DEUX THÈMES SOUMIS LE 28/08/26, VAINQUEUR CONNU, SCORE NON ───
  // Ellemine_D a demandé le vainqueur seul, puis a corrigé : le premier
  // était faux, le second juste. Score, BTTS, corners et incident ne sont
  // pas renseignés — ces cas ne comptent QUE pour la famille « camp ».
  //
  // ⚠️ LE PREMIER EST LE CAS LE PLUS INSTRUCTIF DE L'ARCHIVE. Les NEUF
  // moteurs ont dit R7, à l'unanimité — 9 contre 0 — et le réel est R1.
  // L'unanimité n'est donc pas une garantie : c'est la réponse à la
  // question posée le 28/08 (« un thème 100 % valide, pour qu'on ne
  // puisse pas douter du verdict »). Ici il n'y avait aucun désaccord à
  // arbitrer, et tout le monde s'est trompé ensemble.
  // Ce cas est à boucles DIFFÉRENTES (k=5) et sans centrale adverse dans
  // le camp : la règle du 28/08 n'y est pour rien, l'ancienne lecture dit
  // R7 elle aussi.
  { nom: 'ConjVia', meres: ['conjunctio','via','puella','puer'],
    score: null, camp: 'R1', btts: null,
    note: 'vainqueur donné le 28/08, faux · les 9 moteurs disaient R7 à l\'unanimité' },
  // Le second : même boucle (k=8), et les deux chefs sont le front du
  // front l'un de l'autre — la contamination maximale hors k=0. La règle
  // du 28/08 ne change pas la réponse ici non plus (ancienne et nouvelle
  // lecture disent R1).
  { nom: 'LaetAlbus', meres: ['laetitia','albus','caput_draconis','puella'],
    score: null, camp: 'R1', btts: null,
    note: 'vainqueur donné le 28/08, juste · sièges et axes disaient R7' },
  // ─── 28/08/26, SCORE RÉEL COMMUNIQUÉ : 2-1 POUR R7 ───
  // Deuxième thème unanime de l'archive — les neuf moteurs disent R7 —
  // et celui-ci est JUSTE, là où ConjVia, unanime lui aussi, était faux.
  // L'unanimité reste donc sans valeur prédictive : 1 sur 2.
  // Surtout, c'est un MATCH SERRÉ (un but d'écart) trouvé juste : la
  // catégorie où le système échouait passe de 2/6 à 3/7. Le score, lui,
  // est raté de loin — annoncé 0-4, réel 1-2 — et le BTTS avec (annoncé
  // non, les deux ont marqué).
  { nom: 'FortMajVia', meres: ['fortuna_major','via','puella','puer'],
    score: '1-2', camp: 'R7', btts: true,
    note: 'vainqueur ✔ (9 moteurs sur 9) · score ✘ 0-4 pour 1-2 · BTTS ✘ · match serré trouvé juste' },
  // ─── 28/08/26 — MANCHESTER CITY vs REAL MADRID, FC 26 CHAMPIONS LEAGUE ───
  // Thème tiré aux dés par le protocole بسم الله (1 essai, résonance 3/3),
  // verdict annoncé AVANT le match : victoire Real Madrid 0-2, à
  // l'unanimité des neuf moteurs. Réel : 7-4 pour Manchester City.
  //
  // ⚡ E-SPORT (rang 6) et ⚠️ TROIS CHOSES QU'IL CASSE :
  // 1. l'unanimité tombe à 1/3 — deux des trois thèmes où les neuf
  //    moteurs étaient d'accord sont FAUX. Elle n'est pas un signe de
  //    fiabilité, elle n'est rien du tout ;
  // 2. les scores larges ne sont plus 4/4 mais 4/5 : le seul argument
  //    empirique en faveur du système perd son caractère absolu ;
  // 3. l'e-sport tombe à 0/2 (avec PSG/Bayer) — les deux cas de format
  //    arcade sont faux, alors que le hors-esport est à 8/12.
  { nom: 'City/Madrid', meres: ['laetitia','puella','amissio','via'],
    score: '7-4', camp: 'R1', btts: true, esport: true,
    note: '⚡ e-sport · annoncé AVANT : R7 0-2 à l\'unanimité · réel 7-4 pour R1 — vainqueur ✘, score ✘, BTTS ✘' },
  // ─── 28/08/26, FIFA — VAINQUEUR SEUL COMMUNIQUÉ, JUSTE ───
  // Troisième cas e-sport de l'archive, et le premier JUSTE : il casse
  // le « e-sport 0/2 » que je venais de signaler comme la piste la plus
  // nette. Trois cas, un juste : il n'y a plus de motif, seulement du
  // bruit. À resurveiller quand il y en aura une dizaine.
  { nom: 'PuerCaput', meres: ['puer','puella','caput_draconis','puella'],
    score: null, camp: 'R1', btts: null, esport: true,
    note: '⚡ e-sport · vainqueur donné le 28/08, juste · score non communiqué' },
  // ─── 28/08/26, DEUX THÈMES DE PLUS, LES DEUX VAINQUEURS JUSTES ───
  // Vainqueurs annoncés puis confirmés (« exact les deux »). Scores non
  // communiqués : ces cas ne comptent que pour la famille « camp ». Le
  // format (réel ou e-sport) n'a pas été précisé — ils sont donc comptés
  // hors e-sport par défaut, ce qui est une hypothèse, pas une donnée.
  { nom: 'CaputAcq', meres: ['caput_draconis','acquisitio','amissio','via'],
    score: null, camp: 'R1', btts: null,
    note: 'vainqueur donné le 28/08, juste · score non communiqué · format non précisé' },
  { nom: 'CarcerAcq', meres: ['carcer','acquisitio','via','rubeus'],
    score: null, camp: 'R7', btts: null,
    note: 'vainqueur donné le 28/08, juste · score non communiqué · format non précisé' },
  { nom: 'ViaRubeus', meres: ['via','rubeus','acquisitio','albus'],
    score: null, camp: 'R1', btts: null,
    note: 'vainqueur donné le 28/08, juste · score non communiqué · format non précisé' },
  { nom: 'ConjCaput', meres: ['conjunctio','caput_draconis','albus','carcer'],
    score: null, camp: 'R7', btts: null,
    note: 'vainqueur donné le 28/08, FAUX (annoncé R1) · score non communiqué · format non précisé' },
  // ─── 28/08/26 — DEUXIÈME SCORE EXACT DE L'ARCHIVE ───
  // Annoncé 4-0, réel 4-0. Le premier était Atalanta, également 4-0, en
  // août ; ce sont les deux seuls sur quatorze cas au score connu. Les
  // deux fois le générateur annonçait un 4-0, qui est aussi son score le
  // plus fréquent — la coïncidence n'est donc pas une preuve de justesse
  // du générateur, elle est à surveiller comme telle.
  { nom: 'LaetCarcer', meres: ['laetitia','carcer','caput_draconis','amissio'],
    score: '4-0', camp: 'R1', btts: false,
    note: 'vainqueur ✔ · SCORE EXACT 4-0 ✔ · BTTS ✔ — deuxième score exact de l\'archive' },
  // ─── PREMIER CAS DE LA FAMILLE « BUT DANS LES DEUX MI-TEMPS » ───
  // Ellemine_D, 28/08 : « voici un match où il y a but dans chaque
  // mi-temps ». Vainqueur et scores non communiqués : ce cas ne compte
  // QUE pour la famille mi-temps, via le champ butsDeuxMiTemps.
  // ─── AmisCarcer RETIRÉ POUR LA MÊME RAISON (29/08/26) ───
  // Mères Amissio · Carcer · Puella · Conjonctio. Ni score ni vainqueur :
  // seulement « but dans chaque mi-temps ». R1 y tombe en M6, l'autre
  // maison des deux nuls — encore un cas qui promet sans pouvoir trancher.
  // Conséquence mesurée : la famille mi-temps passe de 4 à 3 cas.
  // ─── PREMIER CAS COMPLET AVEC MI-TEMPS (28/08/26) ───
  // Mi-temps 2-0 pour R1, final 5-0. Le verdict trouve le camp et
  // s'approche du score (annoncé 4-0 pour un 5-0 réel, un but d'écart).
  // Pour la famille mi-temps : 2 buts avant la pause, 3 après → OUI.
  // ⚠️ Et un détail qui compte : le signal htWinner dit « both », c'est-à-dire
  // que les DEUX camps marquent en première période. Le réel est 2-0 :
  // un seul a marqué. Le signal répond juste à la question de la famille
  // (y a-t-il eu un but avant la pause) et faux sur ce qu'il prétend dire.
  { nom: 'PuerLaet', meres: ['puer','laetitia','amissio','acquisitio'],
    score: '5-0', htScore: '2-0', camp: 'R1', btts: false,
    note: 'vainqueur ✔ · score 4-0 pour 5-0 (un but d\'écart) · BTTS ✔ · but dans les deux mi-temps ✔' },
  // ─── LE CAS QUI FAIT ENFIN TRIER LA FAMILLE MI-TEMPS (28/08/26) ───
  // Mi-temps 0-0, final 1-0. C'est le premier « NON » de la famille : pas
  // de but avant la pause. Les trois candidats qui disaient oui — dont le
  // témoin constant — tombent ensemble ; seul le signal de première
  // période avait vu juste, en annonçant qu'aucun but n'était attendu
  // avant la pause (htBut = false), mais il s'abstenait au lieu de le
  // dire. D'où la variante « qui répond non » ajoutée à la famille.
  // Le verdict, lui, est faux : annoncé R7 0-4, réel 1-0 pour R1.
  { nom: 'ViaCaput', meres: ['via','caput_draconis','amissio','carcer'],
    score: '1-0', htScore: '0-0', camp: 'R1', btts: false,
    note: 'vainqueur ✘ (annoncé R7) · score ✘ 0-4 pour 1-0 · mi-temps 0-0 — premier NON de la famille mi-temps' },
  // ─── LE CAS LE PLUS COMPLET DE L'ARCHIVE (28/08/26) ───
  // Mi-temps 0-0, final 2-0 pour R1, corners 1-3 (R7 dominant), un carton
  // jaune côté R1, et un CSC. Tout est renseigné sauf l'heure.
  // Le verdict trouve le CAMP (R1 ✔) et rate tout le reste :
  //   score ......... annoncé 4-0 pour un 2-0 réel
  //   mi-temps ...... tous les candidats sauf « qui ose le non » disaient
  //                   qu'il y aurait un but avant la pause — 0-0
  //   corners ....... annoncés 11 (6/5, dominant M1), réels 4 (1/3,
  //                   dominant M7) : le total est faux de 7 et le
  //                   dominant est inversé
  //   incident ...... annoncé penalty ET rouge contre M7 ; le réel est un
  //                   CSC et un carton jaune, donc NI penalty NI rouge.
  //                   Ellemine_D tranche le 28/08 : le CSC n'est pas un
  //                   incident. Le cas compte donc incident = FALSE, et le
  //                   détecteur, qui annonçait un incident, se trompe.
  //                   Le CSC est enregistré à part, avec son camp (dans un
  //                   2-0 pour R1, il ne peut venir que d'un joueur de R7).
  // ─── 31/08/26 · PREMIER MATCH GELÉ EN RÉEL — Aston Villa 0-1 Arsenal ───
  // ⚠️⚠️ LIRE D'ABORD CECI. Les deux thèmes ci-dessous sont LE MÊME MATCH,
  // gelés à l'avance dans PREDICTIONS_GELEES.md. Ils ne valent PAS deux
  // observations de football — un seul Aston Villa-Arsenal a eu lieu.
  //
  // ☠️ ET LE GEL A ÉTÉ CASSÉ PAR MOI. Le thème MACHINE annonçait « R1 1-0 »
  // au commit du gel (3110811). J'ai ensuite reconstruit le moteur (V8,
  // commit a70f8f9) et le même thème annonce maintenant « R7 0-1 » —
  // c'est-à-dire exactement le score réel. CE N'EST PAS UNE RÉUSSITE :
  // c'est une prédiction changée après coup. Le seul verdict qui compte
  // pour ce match est celui du commit du gel, R1 1-0, et il est FAUX.
  // Vérifié en rejouant le thème sur quatre commits (3110811 · a70f8f9 ·
  // 843f5bc · HEAD) : le basculement date bien de la reconstruction V8.
  // ➜ CORRECTIF DE PROTOCOLE : tout bloc gelé doit désormais porter le
  // hash du commit qui l'a produit, et se juger contre CE build.
  { nom: 'VillaMachine', meres: ['puella','populus','fortuna_minor','acquisitio'],
    score: '0-1', camp: 'R7', btts: false,
    corners: 6, cornersM1: 2, cornersM7: 4, cornersDominant: 'R7',
    note: 'GELÉ · thème MACHINE (hachage du match, aucune information sur l\'issue) · verdict au gel R1 1-0 ✘ camp · BTTS non ✔ · rejeté par les axes (le 4e, du Partage, tombe) · ⚔ destruction directe : Acquisitio est l\'antagoniste de Laetitia → R7, JUSTE, première sortie à l\'aveugle · ✦ partage de la synthèse → R7, JUSTE · ☠️ verdict changé après le gel par la reconstruction V8, voir le commentaire au-dessus' },
  { nom: 'VillaMain', meres: ['amissio','conjunctio','carcer','cauda_draconis'],
    score: '0-1', camp: 'R7', btts: false,
    corners: 6, cornersM1: 2, cornersM7: 4, cornersDominant: 'R7',
    note: 'GELÉ · MÊME MATCH que VillaMachine · thème à la main d\'Ellemine_D · verdict nul 1-1 ✘ camp ✘ score · BTTS oui ✘ (0-1) · porte du nul OUVERTE ✘ fausse alerte · validation 3/3 + figure du jour, le mieux validé des deux, et le plus faux — troisième fois que le niveau de validité joue à l\'envers · ✦ partage de la synthèse → R7, JUSTE' },
  { nom: 'PuellaAlbus', meres: ['puella','albus','populus','laetitia'],
    score: '2-0', htScore: '0-0', camp: 'R1', btts: false,
    incident: false, csc: true, cscCamp: 'M7',
    corners: 4, cornersM1: 1, cornersM7: 3, cornersDominant: 'R7',
    note: 'vainqueur ✔ · score ✘ 4-0 pour 2-0 · mi-temps 0-0 ✘ · corners 11 pour 4 réels, dominant inversé · aucun penalty ni rouge (CSC + jaune) — le détecteur en annonçait deux' },
  // ─── PREMIER THÈME DÉTRUIT AVEC UN RÉSULTAT CONNU (29/08/26) ───
  // Rubeus en M1 : le thème est « détruit sans être jugé » selon la règle
  // traditionnelle rebranchée le 28/08. Le verdict a quand même trouvé le
  // camp — annoncé R1, réel 1-0 pour R1.
  // Avec Fiorentina et Atalanta, qui ont aussi Rubeus en M1, l'archive
  // compte désormais TROIS thèmes détruits au résultat connu. La règle
  // signale sans bloquer, et c'est heureux : sur ces trois cas le verdict
  // n'est pas moins bon qu'ailleurs.
  // ⚠️ Le score annoncé dépend du jour : 4-0 le 28/08, jour du match,
  // 3-0 le 29/08. C'est le 4-0 du jour du match qui est comparé ici.
  { nom: 'RubAmissio', meres: ['rubeus','amissio','caput_draconis','caput_draconis'],
    score: '1-0', camp: 'R1', btts: false,
    note: 'THÈME DÉTRUIT (Rubeus en M1) · vainqueur ✔ · score ✘ 4-0 au jour du match pour un 1-0 réel' },
  // ─── LE DEUXIÈME NUL DE L'ARCHIVE, ET LE PREMIER 4-4 (29/08/26) ───
  // FIFA, réel 4-4. Verdict annoncé : R7 1-3 — faux, mais le camp n'est
  // pas la question ici.
  // Ce que ce cas apporte, et pourquoi Ellemine_D le donne comme piste :
  // · M15, le juge, est VIA — une des quatre figures symétriques, celles
  //   qu'il appelle « figées ». C'est le premier nul de l'archive dont le
  //   juge est figé (Roma, l'autre nul, a Fortuna Major, non figée) ;
  // · M13 Amissio et M14 Acquisitio forment une PAIRE D'ÉQUILIBRE :
  //   structureDuNul détecte donc le nul, et c'est sa PREMIÈRE
  //   détection juste (avant : 0 juste, 2 fausses sur Juventus 6-1 et
  //   Torino 0-1, 1 manquée sur Roma).
  // ⚠️ ET CE N'EST PAS ENCORE UNE RÈGLE. Juventus réunit exactement les
  // deux mêmes conditions — juge Via figé + M13/M14 opposées — et finit
  // 6-1. Avec deux nuls sur vingt-cinq cas, aucune seconde condition ne
  // peut être trouvée : il faut d'autres nuls, ce sont les cas les plus
  // rares et les plus précieux.
  { nom: 'AmisPuer', meres: ['amissio','puer','conjunctio','puella'],
    score: '4-4', camp: 'nul', btts: true, esport: true,
    note: '⚡ e-sport · NUL 4-4 · annoncé R7 1-3 ✘ · juge M15 = Via (figée) · M13/M14 paire d\'équilibre — première détection juste de structureDuNul' },
  // ─── TROISIÈME NUL DE L'ARCHIVE (29/08/26) ───
  // Caput · Puella · Puella · Via — réel 2-2.
  // Le système annonçait R7 avec l'écart le plus net jamais vu (sept
  // critères 114,28 contre 27,75, lecture au volant 75 contre −9) et
  // les DEUX règles de nul qui battaient le témoin se sont tues :
  // R7 n'est pas le binôme de R1 (+11, boucles opposées), le juge M15
  // Conjunctio n'appartient qu'au camp de R7, et les deux camps ne
  // partagent AUCUN rôle (0/5) là où les deux premiers nuls en
  // partageaient trois. Elles ne se trompent donc pas en criant : elles
  // se taisent quand il faut parler. Premier faux négatif du binôme.
  // Ce qui a vu juste, en revanche, ce sont les deux lectures que je
  // tenais pour les plus faibles :
  //   R1 en maison cadente — R1 = Puella en M3 → TROISIÈME nul sur trois
  //   juge M15 figé (les 4 symétriques) — Conjunctio → 2 nuls sur 3
  // Et le détecteur de match serré s'était allumé (R1 cadente) : écart
  // réel 0, il reste à 6 cas sur 6 quand il ose le oui.
  // ⚠️ CE CAS TUE LE RAFFINEMENT « M6 ou M9 » : ce nul-ci est en M3.
  { nom: 'CaputPuella', meres: ['caput_draconis','puella','puella','via'],
    score: '2-2', camp: 'nul', btts: true,
    note: 'NUL 2-2 · annoncé R7 1-2 ✘ avec l\'écart le plus large de l\'archive · R1 Puella en M3 (cadente) · binôme et juge partagé muets — premier faux négatif de la règle du binôme' },
  // ─── 29/08/26 — Rubeus · Rubeus · Carcer · Fortuna Major, réel 1-0 ───
  // CAMP TROUVÉ. R1 = Tristitia en M7, R7 = Amissio en M13, +14.
  // Les quatre lectures de nul qui comptent se sont tues, et elles ont
  // eu raison : R1 en maison ANGULAIRE, et l'archive n'a toujours jamais
  // vu un nul en angulaire (0 sur 8 désormais). La lecture par la maison
  // se tient donc dans les deux sens : elle attrape les trois nuls en
  // cadente et n'en invente aucun en angulaire.
  // ⚠️ MAIS LE SCORE EST FAUX, ET DANS LE SENS QUI COÛTE : annoncé 4-2,
  // réel 1-0. Le match était SERRÉ et le détecteur de serré ne l'a pas
  // vu — R1 n'est pas en cadente. C'est son faux négatif attendu : il
  // rate la moitié des serrés. Son silence n'autorise donc pas un gros
  // score, il ne dit rien du tout. J'avais écrit exactement cela avant
  // le match ; c'était le bon avertissement, il faut le garder.
  { nom: 'RubCarcer', meres: ['rubeus','rubeus','carcer','fortuna_major'],
    score: '1-0', camp: 'R1', btts: false,
    note: 'camp trouvé ✔ · score 4-2 annoncé pour un 1-0 réel ✘ · R1 Tristitia en M7 (angulaire) — les règles de nul muettes à raison, le détecteur de serré muet à tort' },
  // ─── 14/02/2026 17:30 — Carcer · Albus · Conjonctio · Rubeus, réel 0-0 ───
  // QUATRIÈME NUL, ET LE PIRE ÉCHEC DE L'ARCHIVE. Les HUIT moteurs de
  // la famille Nul ont dit non. Le système annonçait R7 3-5 : huit buts
  // pour un match qui n'en a produit aucun, sa plus grosse erreur de
  // score depuis le début.
  // ☠️ IL CASSE LA LECTURE PAR LA MAISON DANS LES DEUX SENS. R1 = Albus
  // en M10, ANGULAIRE. « R1 en maison cadente » tombe de 3 nuls sur 3 à
  // 3 sur 4, et surtout « aucun nul en angulaire » — que j'avais notée
  // 0 sur 8 la veille comme la preuve que la lecture tenait des deux
  // côtés — devient 1 sur 9. La maison reste la meilleure lecture du
  // banc, elle n'est plus une loi.
  // Premier et seul 0-0 de l'archive : aucune règle ne peut en être
  // tirée seule, et il ne faut pas essayer.
  { nom: 'CarcAlbus', meres: ['carcer','albus','conjunctio','rubeus'],
    score: '0-0', camp: 'nul', btts: false,
    note: 'NUL 0-0 du 14/02/26 · annoncé R7 3-5 ✘ (huit buts pour zéro) · R1 Albus en M10 ANGULAIRE — les 8 moteurs de nul muets, la lecture par la maison prend son premier vrai coup' },
  // ─── 29/08/26 — Fortuna Major · Conjonctio · Laetitia · Puella, NUL ───
  // Cinquième nul. Score exact non communiqué, le camp l'est : nul.
  // C'est le thème sur lequel Ellemine_D a demandé le verdict de la
  // TABLE DES PÔLES seule. Elle a répondu NUL, et elle a vu juste — son
  // seul vrai succès sur un nul avec AmisPuer. R1 = Rubeus, R7 =
  // Conjonctio, décalage +4 : MÊME BOUCLE, et c'est là que le moteur
  // sait travailler. C'est ce cas qui a fait naître la doctrine des
  // deux portes (voir nulDeuxPortesV7).
  // ⚠️ +4 (le front) n'est vu que sur CE nul : la porte élargie
  // {+2, +4} donne 5 nuls sur 5, mais son second battant tient sur un
  // cas unique. Ne pas le confondre avec +2, qui a été prédit puis
  // confirmé hors échantillon.
  { nom: 'FortMajConj', meres: ['fortuna_major','conjunctio','laetitia','puella'],
    score: null, camp: 'nul',
    note: 'NUL · vu juste par la TABLE DES PÔLES (même boucle, +4) — le cas fondateur de la doctrine des deux portes' },
  // ─── 29/08/26 — Amissio · Tristitia · Tristitia · Cauda, FiFa 6-7 ───
  // CAMP TROUVÉ, et proprement : R1 = Tristitia en M6, R7 = Via en M12,
  // R1 négatif sur les trois lectures (au volant −8 contre 28,5 ; sept
  // critères 13,94 contre 41,35 ; table des pôles −16,29 contre 32,7).
  // Le nul était exclu sans ambiguïté : porte fermée (+13), faisceau 1/7,
  // zéro rôle partagé.
  // ☠️ MAIS IL TUE LA LECTURE FROIDE, ET IL LA TUE BIEN. Ce thème porte
  // SEPT figures froides sur seize — le plus fermé jamais vu, l'ancien
  // maximum de l'archive était six. La règle branchée une heure plus tôt
  // annonçait donc « match fermé, 1-0 ». Réel : TREIZE buts.
  { nom: 'AmisTrist', meres: ['amissio','tristitia','tristitia','cauda_draconis'],
    score: '6-7', camp: 'R7', btts: true, esport: true,
    note: '⚡ e-sport · camp trouvé ✔ (R7) · score 0-1 annoncé pour un 6-7 réel ✘ · SEPT figures froides pour treize buts — le contre-exemple qui débranche la lecture froide' },
  // ─── 29/08/26 — DEUX THÈMES DONNÉS POUR TESTER L'INCIDENT ───
  // Ellemine_D : « premier thème il y a signe d'incident mais rien n'est
  // passé ; deuxième thème il y a signe d'incident et la pénalité est
  // passée comme rouge, côté signalé. Vérifie dans les dérivés des axes
  // s'il y a signal d'incident : si oui ça confirme le thème principal,
  // si non le signal est peu fiable. »
  // Les deux cas sont versés à l'archive pour le champ « incident ».
  { nom: 'CaputPop', meres: ['caput_draconis','populus','tristitia','amissio'],
    incident: false,
    note: 'incident annoncé 78 % « très élevé » côté M7 — RIEN ne s\'est passé. Les trois dérivés d\'axes moyennaient 39 % (73 · 43 · 0), aucun carton rouge : ils voyaient juste là où le principal criait' },
  { nom: 'PuellaVia', meres: ['puella','via','fortuna_major','fortuna_minor'],
    incident: true,
    note: 'incident annoncé 20 % « faible » côté M1 — CARTON ROUGE réel, du côté signalé. Les trois dérivés moyennaient 80 % (50 · 95 · 95) et DEUX portaient un rouge : ils voyaient juste là où le principal se taisait' },
  // ─── 29/08/26 — DEUX THÈMES POUR UN SEUL MATCH, 0-0 ───
  // ⚠️ ATTENTION EN LISANT LE BANC : ces deux cas sont le MÊME match,
  // tiré deux fois. Ils testent chacun les règles pour de bon — ce sont
  // deux thèmes différents — mais ils ne valent PAS deux observations
  // indépendantes de football. Ne jamais les compter comme deux preuves.
  //
  // ☠️ ILS CASSENT LA RÈGLE DES DEUX PORTES, ET DEUX FOIS. Les deux
  // portent un décalage R1→R7 de +6, et +6 n'était jamais apparu dans
  // toute l'archive. La porte est donc restée fermée sur un nul, deux
  // fois de suite. Le verdict a annoncé un vainqueur (0-1) sur un 0-0.
  // +6 veut dire que R1 EST LE BOUCLIER DE R7 (bouclier = +10, et
  // 16 − 10 = 6) : encore une relation de camp, lue à l'envers.
  // Les camps y partagent 3 rôles sur 5, comme à +2 — et ce signal-là,
  // lui, s'est allumé dans les deux thèmes.
  { nom: 'PuerFortMaj', meres: ['puer','fortuna_major','tristitia','populus'],
    score: '0-0', camp: 'nul', btts: false,
    note: 'NUL 0-0 — MÊME MATCH que PopFortMaj · R1 Puer en M1 (angulaire), décalage +6, porte fermée ✘ · faisceau 2/7 · aucune somme d\'axe d\'incident' },
  { nom: 'PopFortMaj', meres: ['populus','fortuna_major','acquisitio','puer'],
    score: '0-0', camp: 'nul', btts: false,
    note: 'NUL 0-0 — MÊME MATCH que PuerFortMaj · R1 Amissio en M16 (synthèse), décalage +6, porte fermée ✘ · faisceau 3/7 · une somme d\'axe d\'incident (Cardinal = Tristitia)' },
  // ─── 29/08/26 — DEUXIÈME DOUBLE TIRAGE, un match 3-2 pour R7 ───
  // ⚠️ MÊME MATCH tous les deux, comme PuerFortMaj/PopFortMaj : deux
  // thèmes, une seule observation de football.
  // Ellemine_D : « le premier thème, les dérivés des axes ne sont pas
  // valides, il donne nul ; le deuxième, les dérivés sont valides, il
  // donne victoire R7. Le score réel est 3-2 pour R7 : c'est le deuxième
  // qui a raison. Exploite le constat. »
  // Le fichier confirme QUI a raison, et au mot près : le thème 1 annonce
  // NUL 1-1 (faux), le thème 2 annonce R7 (juste), et les axes des
  // dérivés sont incomplets chez le premier (Cardinal seul présent,
  // niveau 1/3) et complets chez le second (niveau 3/3).
  // ⚠️ MÈRES CORRIGÉES LE 29/08 : j'avais d'abord noté le thème 1
  // « Populus / Tristitia », il est « Tristitia / Populus ». Avec les
  // mauvaises, le thème annonçait R1 et ses trois axes de dérivé étaient
  // présents — j'en avais tiré une porte de confiance sur les BINÔMES des
  // dérivés (+12 points) qui s'est effondrée à +2 une fois la ligne
  // corrigée. Voir porteConfianceV7.
  // ☠️ MAIS L'ARCHIVE CONTREDIT LA RÈGLE GÉNÉRALE. Justesse du verdict
  // affiché par niveau de validité, sur les 35 cas au camp connu :
  //   niveau 0 ....  5 justes /  6 ... 83 %
  //   niveau 1 .... 12 justes / 15 ... 80 %
  //   niveau 2 ....  1 juste  /  3 ... 33 %
  //   niveau 3 ....  8 justes / 11 ... 73 %
  //   niveaux 0-1 : 81 %   ·   niveaux 2-3 : 64 %
  // Et par nombre d'axes de dérivé présents : 1 axe 83 %, 2 axes 86 %,
  // 3 axes 60 %. Un niveau de validité élevé ne rend donc PAS le verdict
  // plus sûr — il ferait plutôt l'inverse sur ce qu'on a. Sa paire va
  // rien : c'est pour ça que le comparateur de doubles tirages existe
  // maintenant (voir comparerDeuxThemesV7).
  // ⚠️ SCORE ÉCRIT R1-R7, comme tout le reste de l'archive. Le match
  // s'est joué 3-2 POUR R7 : il s'écrit donc 2-3 ici. Je l'avais d'abord
  // noté 3-2, vainqueur en premier — les deux seuls cas de l'archive à
  // contredire leur propre camp déclaré. Voir coherenceArchiveV7.
  { nom: 'TristPop', meres: ['tristitia','populus','acquisitio','carcer'],
    score: '2-3', camp: 'R7',
    note: 'MÊME MATCH que ConjTrist · annonce NUL 1-1 ✘ · niveau de validité 1/3 : les axes des dérivés Succédent et Cadent sont ABSENTS · décalage +4, porte du nul ouverte' },
  // ─── 30/08/26 — TROISIÈME DOUBLE TIRAGE, un match nul 1-1 ───
  // ⚠️ MÊME MATCH tous les deux : deux thèmes, une seule observation.
  // Thème 1 : NUL annoncé — JUSTE sur le camp. Score annoncé 1-1 contre
  //           3-3 réel : le nul est vu, son ampleur non.
  //           Porte ouverte à +4, niveau de nul MAXIMAL.
  // ⚠️ Score corrigé par Ellemine_D le 30/08 : 3-3, pas 1-1. Un nul à
  //    six buts — le score imposé par scoreAfficheV7 vaut 1-1 en football
  //    réel et 4-4 en e-sport, et aucune des deux échelles ne prévoit un
  //    3-3. C'est le troisième nul de l'archive au-dessus de 2 buts.
  // Thème 2 : R1 annoncé — FAUX. Porte FERMÉE à +9, boucles opposées.
  // ☠️ C'EST LE PREMIER NUL QUE LA PORTE RATE. Elle était à 7 sur 7.
  //    Le décalage +9 est en boucles opposées, où seul +11 ouvre.
  // ☠️ ET LA PORTE DE CONFIANCE NE SÉPARE PAS CETTE PAIRE : les deux
  //    thèmes sont à 3/3 dérivés d'axe valides et niveau 3/3. Le critère
  //    d'Ellemine_D était à 1 sur 1 ; il est à 1 sur 2.
  // ✔ En revanche « Puer en maison succédente » voit juste sur le thème 1
  //    (Puer en M8, BTTS réel oui) là où la règle branchée dit non.
  { nom: 'TristCaput', meres: ['tristitia','caput_draconis','cauda_draconis','puer'],
    score: '3-3', camp: 'nul', btts: true,
    note: 'MÊME MATCH que FortMajTrist · NUL annoncé ✔ mais score 1-1 contre 3-3 réel ✘ · porte ouverte +4, niveau MAXIMAL · BTTS annoncé non ✘ (zone muette) alors que Puer en M8 succédente disait oui' },
  { nom: 'FortMajTrist', meres: ['fortuna_major','tristitia','populus','conjunctio'],
    score: '3-3', camp: 'nul', btts: true,
    note: 'MÊME MATCH que TristCaput · annonce R1 ✘ · PREMIER NUL RATÉ PAR LA PORTE : +9 en boucles opposées, porte fermée · BTTS annoncé oui ✔ (cadent + Conjunctio)' },
  // ─── 30/08/26 — LE PREMIER DUEL ENTRE LE VERROU ET PUER ───
  // Thème analysé AVANT le résultat, à la demande d'Ellemine_D, en
  // référence au théorème des maisons de confusion — qui n'était pas
  // applicable ici (R7 en M16, hors du cycle des douze).
  // Ce que le fichier avait annoncé, et ce qui est arrivé :
  //   camp ....... R7 annoncé · RÉEL R1                        ✘
  //   score ...... 0-1 annoncé · réel 1-0 — le score EXACTEMENT
  //                MIROIR : la forme était juste, le côté non    ✘
  //   nul ........ aucun (porte fermée à +10, catégorie 0/21)   ✔
  //   BTTS ....... NON annoncé · réel non (1-0)                 ✔
  // ⚔️ ET C'EST LE PREMIER CAS OÙ LE VERROU DE CONJUNCTIO ET LA RÈGLE
  // PUER SE CONTREDISAIENT. Conjunctio absent → le verrou dit NON ;
  // Puer en M8 succédente → la règle d'Ellemine_D dit OUI. Le verrou
  // avait la priorité (8/8 contre 4/6) et il a eu raison. Il passe à
  // 9 sur 9, Puer succédent perd un point.
  { nom: 'CarcAmis', meres: ['carcer','carcer','amissio','via'],
    score: '1-0', camp: 'R1', btts: false,
    note: 'annonce R7 ✘ (réel R1) · score 0-1 pour un 1-0 réel — miroir exact · nul correctement écarté (+10, porte fermée) ✔ · BTTS non ✔ : le verrou de Conjunctio bat la règle Puer sur leur premier désaccord · théorème des maisons inapplicable (R7 en M16)' },
  // ─── 30/08/26 — LE 2-0 QUI COÛTE CHER À TROIS RÈGLES ───
  // Thème analysé avant le résultat. Ce qu'il annonçait :
  //   camp ....... R7 · RÉEL R1 (2-0)                            ✘
  //   score ...... 1-2 · réel 2-0                                ✘
  //   nul ........ écarté (porte fermée à +10)                   ✔
  //   BTTS ....... OUI · réel NON (2-0, un seul buteur)          ✘
  // ☠️ TROIS COUPS D'UN SEUL MATCH :
  //   1. L'ÉTAGE FORT DU BTTS TOMBE. « R1 cadent + Conjunctio présent »
  //      était à 7 sur 7 — c'était le socle de la règle branchée. Ici R1
  //      est en M12 (cadente) et Conjunctio est en M14 : l'étage dit OUI,
  //      et le match fait 2-0. Il passe à 7 sur 8.
  //   2. L'ACCORD CAMP DOUBLÉ / VERDICT TOMBE AUSSI. Les deux disaient
  //      R7 — c'est la configuration que je venais d'annoncer à 10 sur 11.
  //      Elle passe à 10 sur 12. Un signal de confiance qui se trompe
  //      quand les deux sont d'accord vaut moins qu'un signal isolé.
  //   3. Le verdict lui-même se trompe : 27/39.
  // ✔ Ce qui a tenu : le nul, correctement écarté malgré un faisceau à
  //   5 signaux sur 7 (FORTE ALERTE). La porte bat le faisceau une fois
  //   de plus.
  // ⚠️ Et un point pour la doctrine d'Ellemine_D : ce thème n'est validé
  //   qu'à 1/3 (un seul dérivé sur trois a ses trois axes) et le verdict
  //   est faux. C'est un cas qui va dans SON sens, contre la tendance de
  //   l'archive (1 axe 83 %, 3 axes 59 %).
  { nom: 'FortMajLaet', meres: ['fortuna_major','laetitia','puella','carcer'],
    score: '2-0', camp: 'R1', btts: false,
    note: 'annonce R7 ✘ (réel R1 2-0) · BTTS oui ✘ : PREMIER RATÉ de l\'étage « cadent + Conjunctio », qui passe de 7/7 à 7/8 · camp doublé R7, d\'accord avec le verdict et faux tous les deux · nul écarté ✔ malgré un faisceau à 5/7 · validation 1/3' },
  // ─── 30/08/26 — LE PREMIER TRIPLET, ET IL COÛTE TRÈS CHER ───
  // Trois thèmes pour un match, TOUS À 3/3 + figure du jour. La validité
  // était donc totalement muette, et j'ai recommandé le thème A sur la
  // force de sa configuration de nul. Réel : 3-1 pour R1.
  //   A (FortMajLaet2) NUL 0-0 annoncé ✘ — le thème que j'ai conseillé
  //   B (FortMajAlbus) R1 2-1 annoncé ✔ — celui que j'avais ÉLIMINÉ
  //   C (ConjCaput2)   R7 0-1 annoncé ✘ — mon second choix
  // ☠️ CE QUE CE SEUL MATCH DÉTRUIT :
  //   1. LE CROISEMENT PORTE + CADENT PERD SA PERFECTION. Il était à
  //      4 nuls sur 4 — le seul record parfait du fichier sur le nul.
  //      Le thème A a la porte ouverte à +2 (binôme, branche ÉTABLIE) ET
  //      R1 en maison cadente, et le match n'est pas nul.
  //   2. LE FAISCEAU À 6/7, jamais atteint jusqu'ici, reçoit son premier
  //      cas : ce n'est pas un nul.
  //   3. L'ACCORD DU CAMP se trompe aussi : le thème C avait F4P4 et les
  //      critères d'accord sur R7, et c'est R1 qui gagne.
  //   4. Le thème qui avait raison est celui qui n'avait AUCUN signal
  //      établi — porte fermée, faisceau 2/7, camp en désaccord. C'est
  //      exactement celui que j'ai dit d'éliminer.
  // ⚠️ LEÇON À GARDER : sur ce match, la force apparente des signaux a
  // pointé à l'envers de la réalité, trois fois de suite. Un thème sans
  // signal n'est pas un thème sans valeur.
  { nom: 'FortMajLaet2', meres: ['fortuna_major','laetitia','fortuna_major','rubeus'],
    score: '3-1', camp: 'R1', btts: true,
    note: 'TRIPLET du 30/08 (A) · annonce NUL 0-0 ✘ · porte ouverte +2 ET R1 cadent : le croisement qui était à 4/4 tombe à 4/5 · faisceau 6/7, son premier cas, pas un nul · BTTS non ✘' },
  { nom: 'FortMajAlbus', meres: ['fortuna_major','albus','albus','albus'],
    score: '3-1', camp: 'R1', btts: true,
    note: 'TRIPLET du 30/08 (B) · annonce R1 2-1 ✔ — LE SEUL JUSTE, et c\'est celui que j\'avais éliminé : porte fermée, faisceau 2/7, camp en désaccord · BTTS oui ✔' },
  { nom: 'ConjCaput2', meres: ['conjunctio','caput_draconis','acquisitio','albus'],
    score: '3-1', camp: 'R1', btts: true,
    note: 'TRIPLET du 30/08 (C) · annonce R7 0-1 ✘ · F4P4 et critères d\'ACCORD sur R7 et pourtant faux : l\'accord du camp passe de 15/19 à 15/20 · BTTS non ✘' },
  // ─── 30/08/26 — LE DEUXIÈME TRIPLET, ET IL DIT L'INVERSE DU PREMIER ───
  // Trois thèmes, TOUS À 3/3 + figure du jour à nouveau. Réel : 3-4 R7.
  //   A (CarcPuella)  R1 2-1 annoncé ✘ camp — BTTS oui ✔
  //   B (CarcCaput)   R7 0-1 annoncé ✔ camp — BTTS non ✘
  //   C (FortMajFMin) R7 0-1 annoncé ✔ camp — BTTS non ✘
  // ☠️ CE QUE J'AI CONSEILLÉ, ET POURQUOI C'ÉTAIT FAUX :
  //   J'ai dit R1. Mon seul argument : F4P4 disait R1 sur LES TROIS
  //   thèmes, et F4P4 est le meilleur moteur de l'archive (22/33). Une
  //   unanimité de trois lectures indépendantes du même moteur. Elle
  //   valait zéro : le camp était R7.
  //   ⚠️ J'avais écrit moi-même, deux paragraphes plus haut, que le
  //   « F4P4 dit R1 » ne bat PAS le taux de base de R1 (p = 0,158). Je
  //   l'ai quand même pris pour un signal parce qu'il était unanime.
  //   Trois lectures du même moteur ne sont pas trois moteurs : quand le
  //   moteur se trompe, il se trompe trois fois. L'unanimité d'un seul
  //   moteur n'ajoute AUCUNE information — c'est un seul cas, pas trois.
  // ☠️ L'ACCORD DU CAMP ÉCHOUE POUR LA DEUXIÈME FOIS SUR UN TRIPLET.
  //   A était le seul en accord (F4P4 R1 · critères R1). A est faux. La
  //   bande d'accord a maintenant 0 triplet sur 2 : elle a désigné le
  //   mauvais thème les deux fois. C'est le seul test répété qu'elle
  //   ait, et elle le perd systématiquement. NE PAS s'en servir pour
  //   choisir dans un triplet, quel que soit son taux global.
  // ✔ CE QUI A MARCHÉ : LA MAJORITÉ DES THÈMES. R7 2/3 → réel R7.
  //   Son idée du 30/08 (« on regarde le camp qui vient 2/3 ou 16/20 »)
  //   marque son premier point. Bilan honnête sur les triplets : le
  //   premier était 1/1/1, sans majorité, donc muet ; celui-ci est le
  //   PREMIER cas où la règle dit quelque chose, et elle a raison.
  //   1 sur 1. Ça ne démontre rien (p = 0,63 contre le hasard) mais
  //   c'est la seule règle du fichier qui n'ait pas encore échoué sur un
  //   triplet, et elle bat la bande d'accord 1-0 contre 0-2.
  // ✔ ET LE BTTS SÉPARE PROPREMENT LE CAMP : A a le camp faux et le BTTS
  //   juste, B et C l'inverse. Aucun thème n'a eu les deux. Sur ce match
  //   il fallait lire le camp dans la majorité et le BTTS dans A.
  { nom: 'CarcPuella', meres: ['carcer','puella','laetitia','via'],
    score: '3-4', camp: 'R7', btts: true,
    note: 'TRIPLET 2 du 30/08 (A) · annonce R1 2-1 ✘ · SEUL thème en accord F4P4/critères, et faux : la bande d\'accord tombe à 0/2 sur les triplets · BTTS oui ✔ · porte fermée, faisceau 0/7, théorème muet' },
  { nom: 'CarcCaput', meres: ['carcer','caput_draconis','conjunctio','conjunctio'],
    score: '3-4', camp: 'R7', btts: true,
    note: 'TRIPLET 2 du 30/08 (B) · annonce R7 0-1 ✔ camp · BTTS non ✘ · en désaccord F4P4/critères et juste quand même, comme le gagnant du triplet 1' },
  { nom: 'FortMajFMin', meres: ['fortuna_major','albus','fortuna_minor','caput_draconis'],
    score: '3-4', camp: 'R7', btts: true,
    note: 'TRIPLET 2 du 30/08 (C) · annonce R7 0-1 ✔ camp · BTTS non ✘ · théorème des maisons applicable et JUSTE (R7) : il passe à 2 justes sur 3 en départage · R1 en cadente, faisceau 3/7, et pas de nul' },
  // ─── 30/08/26 — LE 0-7, ET LE BUG QU'IL A FAIT SORTIR ───
  // Ellemine_D : « il y a trop de contradiction, regarde ce thème ».
  // Réel 0-7 pour R7 — le plus gros écart de toute l'archive. L'écran
  // annonçait R1 1-0. Ce qui se lisait dans le même thème :
  //     critères (qui PILOTENT la carte) .. R1   [R1 59 contre R7 5]
  //     F4P4 ............................... R7
  //     vote des moteurs ................... R7
  //     chaîne ............................. R7
  //     réseau d'ancrage ................... R7
  //     protocole des boucles .............. R7  (-3,75 contre 56,25)
  //     table des pôles .................... R7  (36,28 contre 120,76)
  // SIX LECTURES CONTRE UNE, et c'est l'une qui gagne parce qu'elle est
  // branchée en tête de la cascade. Le seul moteur juste ce jour-là est
  // celui qu'on n'écoute pas.
  // ☠️ ET LE PANNEAU MENTAIT. « VERDICT DU PROTOCOLE : vainqueur R1,
  // avance nette de 60,00 points » s'affichait au-dessus d'un tableau
  // où R1 fait -3,75 et R7 fait 56,25. Le bloc montrait les totaux du
  // protocole sous le nom du vainqueur de la CARTE. L'écart de 60 était
  // exact, le camp était inversé, et la barre annonçait « R7 107,1 % »
  // juste en dessous sans que personne ne relève. Corrigé : le bloc
  // nomme son propre vainqueur et signale en rouge quand il contredit
  // la carte. Les pourcentages sont décalés au-dessus de zéro.
  // ✔ Le BTTS, lui, a vu juste une fois de plus : « non » sur un 0-7.
  { nom: 'AcqFortMaj', meres: ['acquisitio','fortuna_major','caput_draconis','acquisitio'],
    score: '0-7', camp: 'R7', btts: false,
    note: '0-7 pour R7, le plus gros écart de l\'archive · annonce R1 1-0 ✘ — les critères (pilote) disent R1 à 59 contre 5, et SIX autres moteurs disent R7 · BTTS non ✔ · a fait sortir le bug d\'affichage du protocole (nom du vainqueur pris sur la carte au lieu du protocole, barre à 107 %)' },
  // ─── 29/08/26 — LIVERPOOL 2-2 FOREST, ET UN THÈME QUE LE FILTRE REFUSE ───
  // Ellemine_D : « on travaille sur ce thème ». Puer/Rubeus/Amissio/Puer.
  // Validation 2/3 — sous le seuil, donc REJETÉ par son propre filtre :
  // son verdict n'est pas rapporté et ne doit pas l'être. Le match, lui,
  // a bien eu lieu, et c'est à ce titre qu'il entre ici. Un thème rejeté
  // reste une donnée ; ce qu'on refuse, c'est de s'en servir pour parier.
  //
  // ✔ C'EST LE CAS LE PLUS RICHE DE L'ARCHIVE : il alimente SIX familles
  // d'un coup, dont deux qui n'avaient presque rien.
  //     nul ............. oui (2-2)
  //     les deux marquent oui
  //     match serré ..... oui
  //     penalty ......... oui, camp R7 (Gibbs-White 70')  → 2e cas
  //     mi-temps ........ but dans chaque période (0-1 puis 2-1) → 4e cas
  //     deux en 1re MT .. non (0-1 à la pause)            → 4e cas
  // Ordre R1-R7 = Liverpool-Forest : 0-1 à la pause, 2-2 au bout.
  // ☠️ CORRECTION DU 30/08, LE LENDEMAIN DE LA SAISIE. J'avais écrit
  // penaltyCamp: 'M7' en pensant « le camp qui obtient le penalty ».
  // Le champ veut dire l'INVERSE : le sélecteur de l'app s'intitule
  // « Penalty concédé par ? » et MOTEURS_PENALTY_CAMP_V7 s'appelle
  // « Qui CONCÈDE le penalty ». Gibbs-White (Forest, R7) l'a transformé,
  // donc c'est Liverpool (R1) qui l'a concédé : penaltyCamp = 'M1'.
  // Sur une famille qui compte DEUX cas, une inversion de camp ne fait
  // pas du bruit, elle retourne le résultat. Et elle m'aurait échappé si
  // Ellemine_D n'avait pas envoyé un second thème sur le même match.
  { nom: 'PuerRubeus', meres: ['puer','rubeus','amissio','puer'],
    score: '2-2', htScore: '0-1', camp: 'nul', btts: true,
    incident: true, incidentCamp: 'M1', penaltyCamp: 'M1',
    note: 'Liverpool 2-2 Forest (29/08) · THÈME REJETÉ, validation 2/3 : verdict non rapporté, cas conservé comme donnée · nul ✔ · BTTS oui · penalty CONCÉDÉ par R1 (converti par Forest) · but dans chaque mi-temps, 0-1 à la pause · camp de l\'incident lu JUSTE (M1)' },
  // ─── LE MÊME MATCH, UN AUTRE THÈME (30/08) — ET SON MEILLEUR ARGUMENT ───
  // Populus / Fortuna Minor / Puer / Via, validation 1/3. Ellemine_D :
  // « le thème est signalé comme non valide, mais il parvient à voir
  // l'incident du match avec un faux score ; le mode d'analyse n'est pas
  // juste, ça reste. » Vérifié, et il a raison sur le fond :
  //   ✔ CE QUI PASSE — la DÉTECTION de l'incident, sur un thème à 1/3 :
  //       somme d'axe d'incident ..... 1/3, Rubeus sur l'Axe Cadent
  //       dérivés d'axes ............. moyenne 72 %, 2 rouges sur 3
  //       signaux .................... 88 %, « très élevé »
  //       binôme non protecteur ...... penalty annoncé
  //     Cinq lectures sur six disent « incident ». Le match en a eu un.
  //   ✘ CE QUI NE PASSE PAS — le CAMP et le SCORE. Le thème accuse M7 ;
  //     le penalty a été concédé par M1. Et il annonce un ROUGE, pas un
  //     penalty. La règle « Mars naît en M12 → le camp 2 concède » était
  //     déjà réfutée sur son unique cas ; en voici un second, et le
  //     témoin « toujours M7 » se trompe aussi.
  // ➜ CE QUE ÇA VEUT DIRE, ET C'EST SA PHRASE : la validité gouverne
  // certaines familles et pas d'autres. Le filtre de rejet est global —
  // il jette le thème entier — alors que ce thème n'était faux que sur
  // le camp et le score. Sur les 5 cas où l'incident est renseigné, la
  // somme d'axes le lit juste 5 fois, dont 4 sur des thèmes REJETÉS.
  { nom: 'PopFortMin', meres: ['populus','fortuna_minor','puer','via'],
    score: '2-2', htScore: '0-1', camp: 'nul', btts: true,
    incident: true, incidentCamp: 'M1', penaltyCamp: 'M1',
    note: 'MÊME MATCH que PuerRubeus (Liverpool 2-2 Forest) · validation 1/3, REJETÉ · incident VU (5 lectures sur 6) sur un thème que le filtre jette · camp de l\'incident FAUX (dit M7, réel M1) et rouge annoncé au lieu d\'un penalty · l\'exemple d\'Ellemine_D : le rejet est global, l\'erreur ne l\'était pas' },
  // ─── 31/08/26 — LE THÈME À 0/3, ET IL RATE TOUT CE QUI COMPTE ───
  // Laetitia / Populus / Rubeus / Tristitia. Validation 0/3, le plus bas
  // de toute l'archive : les trois axes manquants sur trois niveaux, plus
  // la figure du jour. Ellemine_D a demandé le verdict quand même — sa
  // règle, il peut la lever — en disant « je la note ». Annoncé R1 1-0,
  // les deux marquent NON. Réel : 1-1, penalty pour R7 arrêté par le
  // gardien.
  //   camp ✘ (dit R1, réel nul) · score ✘ · BTTS ✘ (dit non, réel oui)
  // ✔ CE CAS DONNE ENFIN UN ARGUMENT AU FILTRE DE REJET. C'est le seul
  // thème de l'archive à 0/3 et il rate les trois familles d'un coup.
  // Jusqu'ici les thèmes rejetés faisaient MIEUX que les gardés dans les
  // six familles ; celui-ci pousse dans l'autre sens. Un cas ne renverse
  // rien, mais c'est le premier qui va dans le sens de sa règle.
  // ☠️ ET IL COÛTE À DEUX MOTEURS QUI ÉTAIENT EN TÊTE :
  //   • la porte du nul était fermée sur un vrai nul — la meilleure
  //     lecture du fichier rate un nul de plus.
  //   • la somme d'axes d'incident disait NON (0/3 : Fortuna Minor,
  //     Fortuna Major, Via) alors qu'il y a eu penalty. Elle était à
  //     6/7, la meilleure de sa famille. Les DEUX lectures par dérivés
  //     disaient OUI (moyenne 85 %, 2 rouges sur 3) : sur ce match, ce
  //     sont les dérivés qui ont vu juste et la somme qui s'est trompée.
  // ⚠️ Un penalty ARRÊTÉ reste un penalty : incident = oui. Ce qui est
  // noté, c'est le fait qu'il ait été sifflé, pas qu'il ait été marqué.
  // Et le camp qui CONCÈDE est encore M1 — quatre cas sur quatre.
  { nom: 'LaetPop', meres: ['laetitia','populus','rubeus','tristitia'],
    score: '1-1', camp: 'nul', btts: true,
    incident: true, incidentCamp: 'M1', penaltyCamp: 'M1',
    note: 'validation 0/3, LE PLUS BAS DE L\'ARCHIVE · annoncé R1 1-0 ✘ · BTTS non ✘ (réel 1-1) · nul raté, porte fermée ✘ · penalty pour R7 arrêté par le gardien, concédé par R1 · la somme d\'axes d\'incident dit non ✘ (elle tombe de 6/7 à 6/8), les dérivés disent oui ✔ · premier cas qui donne raison au filtre de rejet' },
  // ─── 31/08/26 — LE PREMIER RÉSULTAT DU PLAN APPARIÉ, ET IL FAIT MAL ───
  // Porto vs Roma, FIFA. Les deux thèmes gelés AVANT le match, commités
  // et horodatés par git : rien ici ne peut être arrangé après coup.
  // Réel : 6-3 pour R1 (Porto).
  //     MACHINE (hachage) . annonçait NUL 0-0 · BTTS non
  //     MAIN (Ellemine_D) . annonçait R7 0-4 · BTTS non
  //   camp  : FAUX des deux côtés (nul et R7 contre un R1)
  //   score : FAUX des deux côtés, et de très loin (9 buts marqués)
  //   BTTS  : FAUX des deux côtés — la famille la plus solide du fichier
  //           (28/39) annonçait « non » sur un 6-3.
  // ☠️ ET LA PORTE DU NUL A LEVÉ UNE FAUSSE ALERTE. Elle était OUVERTE
  // sur le thème machine, faisceau 4/7, et le match a fini 6-3. Elle
  // était fermée sur le thème à la main : sur ce match, c'est le tirage
  // à la main qui l'a bien lue. Première ligne du plan apparié, et elle
  // départage dans le sens de la main — un seul cas, aucune conclusion.
  // ⚠️ CE QUE CE PREMIER GEL APPREND VRAIMENT : sur l'archive le verdict
  // fait 61 % et le BTTS 72 %. Sur le premier match jamais annoncé à
  // l'avance, les deux tombent à 0. C'est exactement pour ça que le
  // journal existe et que les chiffres de banc ne prouvent rien. Il en
  // faut dix ; en voilà un.
  { nom: 'Gel2Machine', meres: ['acquisitio','amissio','caput_draconis','acquisitio'],
    score: '6-3', camp: 'R1', btts: true, esport: true,
    note: 'GELÉ AVANT LE MATCH (Porto-Roma FIFA, 31/08) · tirage MACHINE par hachage · annonçait NUL 0-0 ✘ · BTTS non ✘ · porte du nul OUVERTE à 4/7 : FAUSSE ALERTE sur un 6-3 · validation 1/3' },
  { nom: 'Gel2Main', meres: ['populus','rubeus','fortuna_minor','cauda_draconis'],
    score: '6-3', camp: 'R1', btts: true, esport: true,
    note: 'GELÉ AVANT LE MATCH (Porto-Roma FIFA, 31/08) · tirage À LA MAIN d\'Ellemine_D · annonçait R7 0-4 ✘ · BTTS non ✘ · porte du nul fermée ✔ — seule lecture juste des deux thèmes · validation 1/3' },
  { nom: 'ConjTrist', meres: ['conjunctio','tristitia','populus','acquisitio'],
    score: '2-3', camp: 'R7',
    note: 'MÊME MATCH que TristPop · annonce R7 ✔ · niveau de validité 3/3, les trois axes de chaque dérivé présents — c\'est celui-ci qui avait raison' },
  // ─── 03/09/26 — PREMIER INCIDENT RÉEL CÔTÉ CAMP 2, SUR SIX ───
  // Ellemine_D signale un carton rouge côté R7/M7, réel 4-0 pour R1/M1.
  // Jusqu'ici, LES SIX incidents réels de l'archive (Bologna, Jeudi 27/08,
  // PuellaVia, PuerRubeus, PopFortMin, LaetPop) étaient tous côté M1 — le
  // témoin « toujours M1 » avait un sans-faute, et le fichier notait
  // explicitement qu'aucune règle ne pouvait être dite meilleure tant
  // qu'un incident ne serait pas tombé côté camp 2. En voici un.
  // MÉCANISME : une seule naissance de Mars dans tout le thème — M12
  // Cauda Draconis → Puer — et M12 tombe côté M7 dans LES DEUX repères
  // (fixe ET tourné), la configuration de plus haute confiance de la
  // cascade ("les deux repères d'accord"). Contrairement au cas du
  // 27/08 (deux naissances, repères en désaccord, aucune conclusion
  // possible) ou à PopFortMin (repère qui accusait M7 à tort, réel M1),
  // ici le mécanisme désigne M7 sans ambiguïté — et c'est juste.
  // Le détecteur de signaux plus ancien (detectIncidentChaotique), lui,
  // restait muet sur ce thème (2 signaux pour chaque camp) : c'est
  // précisément la règle "naissance de Mars, deux repères d'accord" qui
  // tranche là où l'ancien détecteur ne pouvait pas.
  // Vainqueur (R1) et camp de l'incident (M7) tous deux corrects ; le
  // score annoncé (1-0) est dans le bon sens mais loin du 4-0 réel.
  { nom: 'AmisAmisCarcLaet', meres: ['amissio','amissio','carcer','laetitia'],
    score: '4-0', camp: 'R1', btts: false, incident: true, incidentCamp: 'M7',
    note: 'PREMIER incident réel côté camp 2 de toute l\'archive (les six précédents étaient côté M1) · naissance de Mars en M12 (Cauda Draconis→Puer), repère fixe ET tourné d\'accord sur M7 · camp de l\'incident lu JUSTE · vainqueur R1 ✔ (4-0) · score annoncé 1-0, bon sens mais sous-estimé' },
  // ─── 03/09/26 — L'INCIDENT SE TROMPE QUAND LA NAISSANCE DE MARS EST
  // MUETTE ─── Deuxième cas signalé le même jour, cette fois un raté.
  // Aucune naissance de Mars dans tout le thème : l'app retombe sur
  // l'ancien détecteur de signaux (detectIncidentChaotique), qui ne
  // trouve qu'un seul signal attribuable à un camp — Cauda Draconis en
  // R7 lui-même (M9), lu comme "incident probable CONTRE l'équipe 2" —
  // et annonce M7. Le carton réel est côté M1/R1.
  // ⚠️ HYPOTHÈSE QUI SE DESSINE (à confirmer avec plus de cas) : le camp
  // de l'incident semble fiable quand la naissance de Mars est active
  // (surtout si les deux repères, fixe et tourné, sont d'accord — cf.
  // AmisAmisCarcLaet ci-dessus, et Bologna depuis que la cascade l'a
  // corrigé), et moins fiable quand elle est muette et que l'app retombe
  // sur l'ancien détecteur de signaux — exactement ce qui arrive ici.
  // Vainqueur (R7) et sens du score corrects ; seul le camp de
  // l'incident est faux.
  { nom: 'CaputCarcCaputPuer', meres: ['caput_draconis','carcer','caput_draconis','puer'],
    score: '1-2', camp: 'R7', btts: true, incident: true, incidentCamp: 'M1',
    note: 'Vainqueur R7 ✔ (1-2) · aucune naissance de Mars, détecteur de signaux de repli seul en cause · incident annoncé côté M7 (Cauda Draconis en R7/M9) — FAUX, carton réel côté M1/R1 · appuie l\'hypothèse que la fiabilité du camp d\'incident dépend de la source (naissance de Mars fiable, détecteur de signaux seul moins fiable)' },
  // ─── 04/09/26 — CORRIGÉ : LE VRAI SCORE EST 5-2 POUR R7, PAS 2-1 POUR R1
  // ─── Première version archivée avec le mauvais camp et le mauvais score
  // (confusion sur l'ordre d'annonce) ; corrigé sur confirmation explicite.
  // Verdict affiché (getVerdictAfficheReel) prédisait M1 gagnant 1-0/2-0 —
  // donc pas seulement le camp faux, un écart énorme avec la réalité (5-2
  // pour le camp opposé). PENALTY DES DEUX CÔTÉS, aucun carton — voir
  // l'analyse ci-dessous, qui reste valable : elle porte sur QUI CONCÈDE UN
  // INCIDENT (structure des antagonistes/protecteurs), pas sur qui gagne.
  // densiteIncidentV7 donnait 5/5 mécanismes nommant un camp d'accord à
  // 100% sur M1 pour l'incident — et le penalty réel est bien tombé DES
  // DEUX CÔTÉS, pas seulement M1 : la densité voyait juste sur le fait
  // qu'un incident touchait M1, mais ratait celui côté M7.
  // Structure trouvée a posteriori (analyserProtectionV7) : les DEUX chefs
  // subissent l'attaque de leur antagoniste direct —
  //   Carcer (M1, en repos en M10, maison X « la royauté ») attaqué par
  //     Rubeus (son antagoniste), présent DEUX FOIS (M2, M14) ;
  //   Puella (M7) attaquée par Conjunctio (son antagoniste), présent une fois (M3).
  // Mais les deux ont leur protecteur présent (Albus pour Carcer, Tristitia
  // — en repos en M8 — pour Puella) : statut « protégé » des deux côtés,
  // ni l'un ni l'autre « vulnérable ». D'où penalty des deux côtés (attaque
  // réelle) mais AUCUN carton rouge (attaque contenue par la protection) —
  // cette partie-là tient toujours, elle explique les penalties, pas le score.
  // ⚠️ CE QUE ÇA MONTRE, EN PLUS DE L'ERREUR DE SCORE : l'unanimité à 100%
  // d'un détecteur ne garantit pas l'exhaustivité (mécanismes construits
  // pour voter UN SEUL camp), ET un thème peut afficher un incident bien
  // expliqué tout en ratant complètement le vainqueur — deux couches
  // séparées, deux fiabilités séparées.
  { nom: 'AmisRubConjVia', meres: ['amissio','rubeus','conjunctio','via'],
    score: '2-5', camp: 'R7', btts: true, esport: true, incident: true, incidentCamp: null,
    note: 'FIFA (esport) · CORRIGÉ : vainqueur réel R7 (5-2), pas R1 comme archivé d\'abord · verdict affiché prédisait M1 1-0/2-0 — raté total, écart énorme · BTTS ✔ · PENALTY DES DEUX CÔTÉS, pas de carton — aucun camp unique ne peut être coché pour l\'incident. densiteIncidentV7 : 5/5 mécanismes nommant un camp étaient d\'accord à 100% sur M1 pour l\'incident (juste sur le fait, incomplet sur l\'exhaustivité — a raté le penalty côté M7). Expliqué a posteriori : Carcer (M1, en repos M10) et Puella (M7) sont TOUS LES DEUX attaqués par leur antagoniste direct (Rubeus ×2 pour Carcer, Conjunctio ×1 pour Puella) ET TOUS LES DEUX protégés (Albus, Tristitia en repos M8) — explique les deux penalties et l\'absence de rouge, mais ne dit rien sur le vainqueur, qui reste un raté complet du moteur de verdict.' }
];

// ═══════════════════════════════════════════════════════════════
// LES 13 MATCHS DU 04/09/26 — TIRAGE PAR HACHAGE, RÉSULTATS EN ATTENTE
//
// ☠️ ERREUR CORRIGÉE LE 04/09 AU SOIR, ET ELLE INVALIDAIT TOUT.
// Ellemine_D a donné treize matchs avec, en face de chacun, un nom
// d'équipe. J'ai lu ces noms comme des RÉSULTATS et je les ai archivés
// dans un champ `camp`. C'étaient ses PRONOSTICS : les matchs se jouent
// le 04/09 même, il l'a dit — « les 13 sont aujourd'hui, je te donnerai
// les résultats après match ».
//
// Conséquence : tout ce que j'avais calculé là-dessus mesurait l'accord
// du système avec SES PRÉVISIONS, pas avec la réalité. Les 6/13 = 46,2 %,
// l'écart de −21,7 points, le Fisher p = 0,367 contre la base machine, la
// phrase « premier chiffre du plan apparié » — tout portait sur la
// mauvaise chose et tout est retiré. Le champ s'appelle maintenant
// `pronostic`, il n'y a PAS de champ `camp`, et aucune fonction de mesure
// ne peut donc les compter par accident.
//
// CE QUI RESTE VRAI ET NE DÉPENDAIT PAS DE CETTE ERREUR :
//   · la base machine, mesurée par tirage aux dés — 33,2 % sur les 56 cas
//     de l'archive (3723/11200), 38,0 % sur ces 13 matchs (988/2600) ;
//   · le tirage par hachage se comporte comme un tirage aléatoire — R7
//     707/1500 contre 708/1500 : le hachage est un générateur propre ;
//   · le système penche vers R7 (47 %) contre R1 (28 %) sur un thème
//     quelconque, alors qu'il est équilibré sur l'archive à la main ;
//   · sur les 13, les verdicts de deux tirages machine (hachage contre
//     dés) DIFFÈRENT 9 fois sur 13 — quand le tirage est machine, le
//     verdict est une propriété du tirage, pas du match.
// Aucune de ces quatre mesures ne regardait les résultats : elles tenaient
// à la distribution des verdicts seule. Elles restent.
//
// ⚠️ CE QUE CES 13 CAS NE DOIVENT JAMAIS DEVENIR. Même quand les vrais
// résultats arriveront, ils N'ENTRENT PAS dans CAS_REFERENCE_V7 : un thème
// tiré par hachage ne connaît pas le match, il ne peut porter aucune
// information sur l'issue, et les mélanger aux thèmes tirés à la main
// ferait changer en silence toutes les mesures du fichier. Ils resteront
// ici, comme bras de contrôle, à comparer à la base machine — jamais à
// l'archive.
//
// POUR INSCRIRE UN RÉSULTAT : ajouter `camp: 'R1' | 'R7' | 'nul'` à la
// ligne concernée, et le score s'il est connu. Tant que `camp` est absent,
// resultatsHachageV7() refuse de produire un taux.
var CAS_HACHAGE_V7 = [
  { nom: 'Ipswich/Liverpool',  meres: ['conjunctio', 'conjunctio', 'cauda_draconis', 'acquisitio'], pronostic: 'R7', heure: '19:00' , camp: 'R7', score: '0-2', btts: false, miTemps: '0-2',
    cornersM1: 4, cornersM7: 3, cornersTotal: 7,
    incident: false, noteResultat: 'RAS' },
  { nom: 'RealBetis/RealMadrid', meres: ['puer', 'amissio', 'rubeus', 'tristitia'], pronostic: 'R7', heure: '19:00' , camp: 'R1', score: '1-0', btts: false, miTemps: '0-0',
    cornersM1: 6, cornersM7: 10, cornersTotal: 16,
    incident: true, incidentCamp: 'M1', noteResultat: 'penalty pour M7, MANQUÉ — concédé par M1' },
  { nom: 'Genoa/Como',         meres: ['cauda_draconis', 'puella', 'puer', 'fortuna_minor'], pronostic: 'nul', heure: '18:45' , camp: 'R7', score: '1-4', btts: true, miTemps: '1-3',
    cornersM1: 5, cornersM7: 4, cornersTotal: 9,
    incident: false, noteResultat: 'ni CSC ni penalty ni rouge' },
  { nom: 'Stuttgart/Koln',     meres: ['tristitia', 'albus', 'fortuna_minor', 'conjunctio'], pronostic: 'R1', heure: '18:30' , camp: 'R1', score: '4-1', btts: true, miTemps: '1-0',
    cornersM1: 10, cornersM7: 8, cornersTotal: 18,
    incident: true, incidentCamp: 'M7', noteResultat: 'CSC contre M7' },
  { nom: 'Lyon/Auxerre',       meres: ['laetitia', 'via', 'albus', 'acquisitio'], pronostic: 'R1', heure: '17:00' , camp: 'R1', score: '3-1', btts: true, miTemps: '2-1',
    cornersM1: 9, cornersM7: 5, cornersTotal: 14,
    incident: false, noteResultat: 'RAS' },
  // ─── PREMIER RÉSULTAT RÉEL DE CES 13 (04/09/26, suivi en direct) ───
  // 0-0 jusqu'à la 80e, puis deux buts pour R7 dont un CONTRE SON CAMP
  // d'Abha ; un des deux buts a été annulé, FT 0-1. Lequel des deux a
  // été annulé n'a pas été précisé, et ça n'est PAS un détail : si le
  // CSC a compté, le nul est tombé par un accident et la clause de
  // Populus garde son objet ; si c'est le but ordinaire qui a compté,
  // la brèche s'est faite par le jeu et M10 Populus « fermée » avait
  // tort. Même score, deux mécanismes opposés — d'où `mecanisme: null`.
  //   verdict nul .......... ✘ (R7 gagne)
  //   score 0-0, alt 1-1 ... ✘
  //   BTTS non ............. ✔ (Abha n'a jamais marqué pour elle-même)
  //   camp d'incident M7 ... ✘ si le CSC a compté (l'accident était côté M1)
  { nom: 'Abha/Al-Ettifaq',    meres: ['fortuna_major', 'rubeus', 'albus', 'albus'],
    pronostic: 'nul', heure: '16:00',
    camp: 'R7', score: '0-1', btts: false, miTemps: '0-0',
    cornersM1: 1, cornersM7: 8, cornersTotal: 9,
    incident: true, incidentCamp: 'M1', mecanisme: 'accident',
    noteResultat: 'CSC contre M1 — le but annulé était le SECOND, donc le nul est bien tombé par accident' },
  { nom: 'Al-Ahli/Al-Riyadh',  meres: ['tristitia', 'populus', 'conjunctio', 'fortuna_major'], pronostic: 'R1', heure: '18:00' , camp: 'R1', score: '5-0', btts: false, miTemps: '3-0',
    cornersM1: 4, cornersM7: 3, cornersTotal: 7,
    incident: true, incidentCamp: 'M7', noteResultat: 'penalty pour M1 dans les deux mi-temps — concédés par M7' },
  { nom: 'Al-Shabab/Al-Hilal', meres: ['puella', 'populus', 'carcer', 'tristitia'], pronostic: 'R7', heure: '18:00' , camp: 'R7', score: '0-2', btts: false, miTemps: '0-0',
    cornersM1: 4, cornersM7: 18, cornersTotal: 22,
    incident: true, incidentCamp: 'M1', noteResultat: 'penalty pour M7 en 2e — concédé par M1' },
  { nom: 'Aveley/Cheshunt',    meres: ['rubeus', 'populus', 'carcer', 'fortuna_major'], pronostic: 'R1', heure: '18:45' },
  { nom: 'Flackwell/Hanwell',  meres: ['puella', 'laetitia', 'amissio', 'puella'], pronostic: 'R7', heure: '18:45' },
  { nom: 'Ossett/Pontefract',  meres: ['carcer', 'carcer', 'via', 'acquisitio'], pronostic: 'R7', heure: '18:45' },
  { nom: 'Quorn/Shepshed',     meres: ['cauda_draconis', 'puella', 'caput_draconis', 'conjunctio'], pronostic: 'R7', heure: '18:45' },
  { nom: 'ThreeBridges/Kingstonian', meres: ['acquisitio', 'populus', 'albus', 'amissio'], pronostic: 'R1', heure: '18:45' }
];
// Même origine pour tous : hachage du 04/09/26, date '2026-09-04' plus
// l'heure du coup d'envoi. Reproductible ligne à ligne — mêmes équipes,
// même date, même heure → mêmes quatre mères, toujours.
CAS_HACHAGE_V7.forEach(function (c) { c.tirage = 'hachage'; c.date = '2026-09-04'; });

// Le bilan de ces 13 cas. Il REFUSE de rendre un taux tant que des
// résultats manquent — c'est le garde-fou de l'erreur du 04/09 : sans lui
// on recompte des pronostics et on croit mesurer un système.
function resultatsHachageV7() {
  var connus = CAS_HACHAGE_V7.filter(function (c) { return !!c.camp; });
  var attente = CAS_HACHAGE_V7.length - connus.length;
  if (!connus.length) {
    return { complet: false, connus: 0, attente: attente, taux: null,
      note: 'aucun résultat réel saisi — les 13 lignes ne portent que des pronostics' };
  }
  var j = 0, erreurs = [];
  connus.forEach(function (c) {
    var t = null;
    try { t = buildThemeFromMothers(c.meres[0], c.meres[1], c.meres[2], c.meres[3]); } catch (e) { return; }
    var v = null;
    try { v = avecFormatV7(c.format || 'reel', function () { return getVerdictAfficheReel(t); }); } catch (e) { return; }
    var dit = v.nulActif ? 'nul' : (v.winner === 'M1' ? 'R1' : 'R7');
    if (dit === c.camp) j += 1; else erreurs.push({ nom: c.nom, dit: dit, reel: c.camp });
  });
  return { complet: attente === 0, connus: connus.length, attente: attente,
    juste: j, sur: connus.length, taux: j / connus.length, erreurs: erreurs,
    note: attente ? (attente + ' match(s) encore sans résultat — taux partiel') : null };
}

// Le bras de contrôle : ce que fait un TIRAGE MACHINE sur un jeu de cas
// donné. C'est la mesure qui manquait au matin du 04/09 et sans laquelle
// aucune comparaison de taux ne veut rien dire (cf. le bloc ci-dessus).
// nParCas tirages aux dés par cas ; 200 donne déjà un taux stable au
// point de pourcentage près.
function baseMachineV7(cas, nParCas) {
  nParCas = nParCas || 200;
  var j = 0, n = 0;
  (cas || []).forEach(function (c) {
    if (!c.camp) return;
    var fmt = c.format || (c.esport ? 'esport' : 'reel');
    for (var i = 0; i < nParCas; i++) {
      var meres = [rollOneMother(), rollOneMother(), rollOneMother(), rollOneMother()]
        .map(function (x) { return x.figure; });
      var t = null;
      try { t = buildThemeFromMothers(meres[0], meres[1], meres[2], meres[3]); } catch (e) { continue; }
      var v = null;
      try { v = avecFormatV7(fmt, function () { return getVerdictAfficheReel(t); }); } catch (e) { continue; }
      var dit = v.nulActif ? 'nul' : (v.winner === 'M1' ? 'R1' : 'R7');
      n += 1; if (dit === c.camp) j += 1;
    }
  });
  return { juste: j, sur: n, taux: n ? j / n : null };
}

// ⚠️ comparaisonHachageMainV7() a été RETIRÉE le 04/09 au soir. Elle
// comparait l'archive à la main aux 13 cas de hachage en lisant leur
// champ `camp` — qui contenait des pronostics, pas des résultats. Elle
// rendait donc un écart et un p qui ne mesuraient rien. Quand les vrais
// résultats seront saisis, la comparaison se refait avec
// resultatsHachageV7() d'un côté et baseMachineV7() de l'autre : c'est la
// base machine qui est le bon terme de comparaison pour un tirage
// machine, pas l'archive tirée à la main.


// ─── LES MATCHS QUE TU AS SAISIS ENTRENT DANS LE BANC (27/08/26) ───
// Ellemine_D : « on aboutit à rien malgré les heures ». La cause n'était
// pas le code : c'est qu'on mesurait sur sept cas, où 5/7 ne se
// distingue pas du hasard. Or l'application COLLECTE déjà des résultats
// — le panneau « Résultat réel » et le champ « Score reel » des thèmes
// sauvegardés — et le banc les ignorait. Tout ce qui avait été saisi ne
// comptait nulle part.
// Ils comptent maintenant. Chaque score saisi devient un cas du banc, et
// les moteurs sont renotés sans qu'on touche au code.
//
// La conversion M1/M7 → R1/R7 est sûre : verdictFinal pose
// winner = winnerRotation==='R1' ? 'M1' : 'M7'. La correspondance est
// biunivoque dans tout le fichier.
// ─── MÉMO SUR LA CHAÎNE BRUTE DU STOCKAGE (04/09/26) ───
// casSauvegardesV7 relisait et reparsait localStorage à CHAQUE appel, et
// elle est appelée par signatureCasV7 comme par tousCasBancV7 — donc des
// centaines de fois par lancement de thème (bancMoteursV7 la traverse à
// chaque justesseMoteurV7). Le mémo est indexé sur la CHAÎNE BRUTE du
// stockage, pas sur un compteur : lire la chaîne coûte presque rien, la
// parser coûte tout, et une chaîne identique garantit un résultat
// identique. Toute écriture, d'où qu'elle vienne, change la chaîne et
// invalide donc le mémo d'elle-même — il n'y a rien à penser à appeler.
var _memoCasSauvV7 = { cle: null, val: null };
function casSauvegardesV7() {
  var brut = null;
  try { brut = localStorage.getItem(SAVE_KEY); } catch (e) { brut = null; }
  if (brut !== null && _memoCasSauvV7.cle === brut) return _memoCasSauvV7.val;
  var res = _casSauvegardesV7();
  if (brut !== null) { _memoCasSauvV7.cle = brut; _memoCasSauvV7.val = res; }
  return res;
}
function _casSauvegardesV7() {
  var out = [];
  var list = [];
  try { list = getSavedList() || []; } catch (e) { return out; }
  var vus = {};
  CAS_REFERENCE_V7.forEach(function (c) { vus[c.meres.join('|')] = true; });
  list.forEach(function (e) {
    if (!e || !e.theme || !e.realScore) return;
    var m = String(e.realScore).match(/(\d+)\s*-\s*(\d+)/);
    if (!m) return;
    var g1 = parseInt(m[1], 10), g7 = parseInt(m[2], 10);
    var meres = [1, 2, 3, 4].map(function (i) {
      return e.theme[i] || e.theme[String(i)];
    });
    if (meres.some(function (f) { return !f || !MAP_GEO[f]; })) return;
    var cle = meres.join('|');
    if (vus[cle]) return;               // déjà dans l'archive, ou doublon
    vus[cle] = true;
    var nom = (e.team1 || '') && (e.team2 || '')
      ? String(e.team1).slice(0, 6) + '/' + String(e.team2).slice(0, 6)
      : (e.matchDate || 'saisi');
    // ─── E-SPORT SIGNALÉ, PAS MÉLANGÉ EN SILENCE (28/08/26) ───
    // Les compétitions de rang 6-7 sont des formats arcade (FC 26 Rush,
    // 3x3, 4x4) : TIER_CONFIG leur applique multButs 2,5 et le fichier
    // note ailleurs « testé sur 6 vrais matchs, hors esport — les scores
    // esport… ». Les faire entrer au banc sans le dire fausserait surtout
    // les familles chiffrées (score, corners).
    // Ils sont donc COMPTÉS — un camp reste un camp — mais MARQUÉS, et le
    // banc annonce combien il en contient.
    var tier = 1;
    try { tier = (COMPETITION_INDEX[e.competition] || {}).tier || 1; } catch (x) { tier = 1; }
    var estEsport = tier >= 6;
    out.push({
      nom: nom, meres: meres, score: g1 + '-' + g7,
      camp: g1 > g7 ? 'R1' : g7 > g1 ? 'R7' : 'nul',
      btts: g1 > 0 && g7 > 0,
      incident: e.realPenalty === 'yes' ? true : e.realPenalty === 'no' ? false : null,
      incidentCamp: (e.realIncidentCamp === 'M1' || e.realIncidentCamp === 'M7')
        ? e.realIncidentCamp : null,
      penaltyCamp: (e.realPenaltyCamp === 'M1' || e.realPenaltyCamp === 'M7')
        ? e.realPenaltyCamp : null,
      htScore: /^\d{1,2}-\d{1,2}$/.test(String(e.realHtScore || '')) ? e.realHtScore : null,
      csc: (e.realCsc === 'M1' || e.realCsc === 'M7') ? true : null,
      cscCamp: (e.realCsc === 'M1' || e.realCsc === 'M7') ? e.realCsc : null,
      corners: /^\d{1,2}$/.test(String(e.realCorners || '')) ? parseInt(e.realCorners, 10) : null,
      cornersM1: /^\d{1,2}$/.test(String(e.realCornersM1 || '')) ? parseInt(e.realCornersM1, 10) : null,
      cornersM7: /^\d{1,2}$/.test(String(e.realCornersM7 || '')) ? parseInt(e.realCornersM7, 10) : null,
      cornersDominant: (function () {
        var a = parseInt(e.realCornersM1, 10), b = parseInt(e.realCornersM7, 10);
        if (isNaN(a) || isNaN(b) || a === b) return null;
        return a > b ? 'R1' : 'R7';
      })(),
      saisi: true, esport: estEsport, tier: tier,
      note: 'saisi dans les thèmes sauvegardés'
        + (estEsport ? ' · FORMAT E-SPORT (scores hors échelle du football réel)' : '')
    });
  });
  return out;
}

// Tous les cas du banc : l'archive figée, plus ce que tu as saisi.
// ═══════════════════════════════════════════════════════════════
// LE JOURNAL DES PRÉDICTIONS GELÉES (29/08/26)
//
// Ellemine_D : « maintenant on en fait quoi dans le système ? »
//
// Le problème qu'il faut regarder en face : LE BANC MESURE EN REJOUANT.
// bancMoteursV7 relance tous les moteurs, avec les règles D'AUJOURD'HUI,
// sur tous les cas de l'archive. Chaque fois qu'une règle est corrigée
// après un raté — la porte du nul l'a été deux fois, à +4 puis à +6 —
// le banc remonte, et il remonte forcément : la règle a été taillée sur
// ces cas-là. Un chiffre de banc ne prouve donc jamais qu'on prédit ;
// il prouve seulement qu'on décrit le passé sans se contredire.
//
// Ce qui manquait n'est pas une règle de plus, c'est un JUGE HONNÊTE.
// Et il existait déjà à moitié : saveManuel() gèle le verdict affiché au
// moment de l'enregistrement, dans entry.verdict — un instantané que
// rien ne réécrit ensuite. Personne ne s'en servait pour compter.
//
// journalPredictionsV7() compare ce verdict GELÉ au score réel saisi
// plus tard. C'est la seule mesure du fichier qui ne puisse pas être
// flattée par une correction rétroactive : si je change une doctrine
// demain, les prédictions déjà gelées ne bougent pas.
//
// À lire à côté du banc, jamais à sa place :
//   le banc dit « mes règles actuelles décrivent bien l'archive »
//   le journal dit « voilà ce que j'ai annoncé AVANT de savoir »
// Tant que le journal est vide, aucun chiffre de ce fichier n'est une
// preuve de prédiction. C'est la phrase la plus importante du projet.
// ═══════════════════════════════════════════════════════════════
// LE COMPARATEUR DE DOUBLES TIRAGES (29/08/26) — Ellemine_D
//
// « Ces deux thèmes sont pour un seul match. Le premier, les dérivés des
// axes ne sont pas valides, il donne nul. Le deuxième, les dérivés sont
// valides, il donne victoire R7. Le score réel est 3-2 pour R7 : c'est
// le deuxième qui a raison. Exploite le constat. »
//
// Le constat est juste sur sa paire : le thème 1 annonce R1 (faux), le
// thème 2 annonce R7 (vrai), et niveauValiditeV7 donne bien 2 au premier
// et 3 au second.
//
// ☠️ MAIS L'ARCHIVE DIT L'INVERSE EN GÉNÉRAL. Justesse du verdict
// affiché par niveau de validité, sur les 35 cas au camp connu :
//   niveau 0 ....  5 justes /  6 ... 83 %
//   niveau 1 .... 12 justes / 15 ... 80 %
//   niveau 2 ....  1 juste  /  3 ... 33 %
//   niveau 3 ....  8 justes / 11 ... 73 %
// Niveaux 0-1 : 81 %. Niveaux 2-3 : 64 %. Un niveau élevé ne rend pas le
// verdict plus sûr. Sa paire va dans son sens, l'ensemble n'y va pas —
// et UNE paire ne tranche rien.
//
// D'où cet outil plutôt qu'une règle. Quand deux thèmes sont tirés pour
// le même match, il les met face à face sur tous les critères qui
// pourraient les départager, et dit lequel chaque critère préfère. Il ne
// décide pas : il prépare la décision, et quand le résultat arrive on
// saura quel critère avait choisi le bon thème.
//
// Deux paires connues à ce jour :
//   PuerFortMaj / PopFortMaj — 0-0 : les deux annonçaient R7, tous deux
//     faux. Aucun critère ne pouvait sauver ce match.
//   TristPop / ConjTrist — 3-2 R7 : le second avait raison, et il avait
//     le niveau de validité le plus haut (3/3 contre 1/3), avec ses trois
//     dérivés d'axe valides quand le premier n'en avait qu'un.
// Une paire informative sur deux. Il en faut dix.
// Le panneau : le thème courant est A, on saisit les quatre mères de B.
function toggleDoubleTiragePanel() {
  var panel = document.getElementById('double-tirage-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    renderDoubleTirage();
    panel.style.display = 'block';
  } else { panel.style.display = 'none'; }
}

function renderDoubleTirage() {
  var panel = document.getElementById('double-tirage-panel');
  if (!panel) return;
  var esc = function (v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var opts = FIGS_V7.map(function (f) {
    return '<option value="' + f + '">' + esc(FL[f] || f) + '</option>';
  }).join('');
  var h = '<h3 style="margin-bottom:2px;">⚖️ Double tirage — deux thèmes pour un seul match</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:8px;">Le thème A est celui qui est lancé. '
    + 'Saisis les quatre mères du thème B, et le tableau dit lequel des deux chaque critère préfère. '
    + '<b>Il ne décide pas</b> — il prépare la décision, et quand tu donnes le résultat on saura quel '
    + 'critère avait choisi le bon thème.</div>'
    + '<div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-bottom:8px;">'
    + [0, 1, 2, 3].map(function (i) {
        return '<select id="dt-m' + i + '" style="padding:5px;">' + opts + '</select>';
      }).join('')
    + '<button class="btn-secondary" style="width:auto; padding:6px 12px;" onclick="renderDoubleTirage(true)">Comparer</button></div>'
    + '<div id="dt-resultat"></div>';
  panel.innerHTML = h;
  if (arguments.length && arguments[0] === true) return;
  // (le rendu du résultat se fait au clic, pour laisser choisir les mères)
}

// Second passage : lit les quatre sélecteurs et affiche la comparaison.
(function () {
  var original = renderDoubleTirage;
  renderDoubleTirage = function (comparer) {
    if (!comparer) { original(); return; }
    var zone = document.getElementById('dt-resultat');
    if (!zone) return;
    var esc = function (v) {
      return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    var m = [0, 1, 2, 3].map(function (i) {
      var el = document.getElementById('dt-m' + i);
      return el ? el.value : null;
    });
    if (!currentTheme || m.some(function (x) { return !x; })) {
      zone.innerHTML = '<div class="warn">Lance un thème et choisis les quatre mères du second.</div>';
      return;
    }
    var B = null;
    try { B = buildThemeFromMothers(m[0], m[1], m[2], m[3]); } catch (e) { B = null; }
    if (!B) { zone.innerHTML = '<div class="warn">Second thème impossible à construire.</div>'; return; }
    var c = comparerDeuxThemesV7(currentTheme, B);
    if (!c) { zone.innerHTML = '<div class="warn">Comparaison impossible.</div>'; return; }
    var lignes = c.criteres.map(function (cr) {
      var col = cr.prefere === 'A' ? '#60a5fa' : cr.prefere === 'B' ? '#fb923c' : '#64748b';
      return '<tr><td style="padding:4px 6px;">' + esc(cr.nom) + '</td>'
        + '<td style="padding:4px 6px; text-align:center;">' + esc(cr.a) + '</td>'
        + '<td style="padding:4px 6px; text-align:center;">' + esc(cr.b) + '</td>'
        + '<td style="padding:4px 6px; text-align:center; color:' + col + '; font-weight:800;">'
        + (cr.prefere ? 'thème ' + cr.prefere : 'égalité') + '</td></tr>';
    }).join('');
    zone.innerHTML =
      '<div style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:8px;">'
      + '<div style="flex:1; min-width:190px; border:1px solid #2563eb; border-radius:9px; padding:8px;">'
      + '<b style="color:#60a5fa;">THÈME A</b> (lancé)<div style="font-size:15px; font-weight:800; margin-top:3px;">'
      + esc(c.a.verdict) + ' &nbsp; ' + esc(c.a.score) + '</div></div>'
      + '<div style="flex:1; min-width:190px; border:1px solid #b45309; border-radius:9px; padding:8px;">'
      + '<b style="color:#fb923c;">THÈME B</b> (saisi)<div style="font-size:15px; font-weight:800; margin-top:3px;">'
      + esc(c.b.verdict) + ' &nbsp; ' + esc(c.b.score) + '</div></div></div>'
      + '<div style="font-size:12px; font-weight:800; color:' + (c.accord ? '#4ade80' : '#fbbf24') + '; margin-bottom:6px;">'
      + (c.accord ? '✓ Les deux thèmes disent la même chose — aucun départage nécessaire.'
                  : '⚠️ LES DEUX THÈMES SE CONTREDISENT — voilà ce que chaque critère préfère.') + '</div>'
      + '<table style="width:100%; font-size:11.5px; border-collapse:collapse;">'
      + '<tr><th style="text-align:left; padding:4px 6px;">critère</th>'
      + '<th style="padding:4px 6px;">A</th><th style="padding:4px 6px;">B</th>'
      + '<th style="padding:4px 6px;">préfère</th></tr>' + lignes + '</table>'
      + (function () {
          // ─── LE REGISTRE DES PAIRES (30/08/26) ───
          // Il ne décide pas, il COMPTE. Voir registrePairesV7.
          var rg = null;
          try { rg = registrePairesV7(); } catch (e) { return ''; }
          if (!rg) return '';
          var departage = c.criteres.filter(function (x) { return x.prefere; }).length;
          // La validité est-elle muette ? C'est le cas qui fait mal :
          // deux thèmes également complets qui disent le contraire.
          var critValid = c.criteres.filter(function (x) {
            return /validité|dérivés d/.test(x.nom || '');
          });
          var validMuette = critValid.length > 0 && critValid.every(function (x) { return !x.prefere; });
          var alerte = '';
          if (!c.accord && departage === 0) {
            alerte = '<div style="margin:8px 0 4px; padding:8px 10px; border:2px solid #f87171; border-radius:9px; '
              + 'background:rgba(248,113,113,.10); font-size:12px; font-weight:800; color:#fca5a5;">'
              + '⛔ AUCUN CRITÈRE NE DÉPARTAGE — les deux thèmes se contredisent et tout est à égalité.'
              + '<div style="font-size:10.5px; font-weight:400; color:#fecaca; margin-top:3px;">'
              + 'Le fichier ne sait pas lequel croire, et il préfère le dire.</div></div>';
          } else if (!c.accord && validMuette) {
            alerte = '<div style="margin:8px 0 4px; padding:8px 10px; border:2px solid #fbbf24; border-radius:9px; '
              + 'background:rgba(251,191,36,.10); font-size:12px; font-weight:800; color:#fbbf24;">'
              + '⚠️ LA VALIDITÉ EST MUETTE — les deux thèmes sont aussi complets l\'un que l\'autre.'
              + '<div style="font-size:10.5px; font-weight:400; color:#fde68a; margin-top:3px;">'
              + 'C\'est sa limite de naissance : elle mesure si un thème est BIEN FORMÉ, pas s\'il '
              + 'correspond au match. Deux thèmes bien formés peuvent se contredire, et elle ne peut rien '
              + 'y faire. Sur les paires connues elle n\'a jamais choisi le mauvais thème — mais elle s\'est '
              + 'tue une fois, dans exactement cette situation. Les critères ci-dessous qui ne sont pas à '
              + 'égalité sont tout ce qu\'il reste, et leur registre est sous le tableau.</div></div>';
          }
          var lignes = CRITERES_PAIRE_V7.map(function (cr) {
            var b = rg.bilan[cr.cle];
            var col = b.faux === 0 && b.juste > 0 ? '#4ade80' : (b.juste > b.faux ? '#fbbf24' : '#94a3b8');
            return '<tr><td style="padding:3px 6px;">' + esc(cr.nom) + '</td>'
              + '<td style="padding:3px 6px; text-align:center; color:' + col + '; font-weight:800;">' + b.juste + '</td>'
              + '<td style="padding:3px 6px; text-align:center; color:#f87171;">' + b.faux + '</td>'
              + '<td style="padding:3px 6px; text-align:center; color:#64748b;">' + b.muet + '</td></tr>';
          }).join('');
          return alerte
            + '<div style="margin-top:10px; padding:8px 10px; border:1px solid #334155; border-radius:9px;">'
            + '<div style="font-size:11.5px; font-weight:800; color:#cbd5e1;">📒 REGISTRE DES PAIRES — '
            + rg.informatives + ' paire(s) qui départagent sur ' + rg.total + '</div>'
            + '<div style="font-size:10px; color:#94a3b8; margin-top:2px;">Chaque critère doit choisir '
            + '« celui qui en a le plus ». Une paire dont les deux thèmes disent la même chose ne '
            + 'départage rien et n\'est pas comptée.</div>'
            + '<table style="width:100%; font-size:11px; border-collapse:collapse; margin-top:5px;">'
            + '<tr><th style="text-align:left; padding:3px 6px;">critère</th>'
            + '<th style="padding:3px 6px;">juste</th><th style="padding:3px 6px;">faux</th>'
            + '<th style="padding:3px 6px;">muet</th></tr>' + lignes + '</table>'
            + '<div style="font-size:10px; color:#94a3b8; margin-top:5px;">'
            + rg.lignes.map(function (x) {
                return '• ' + esc(x.paire.a) + ' / ' + esc(x.paire.b) + ' (' + esc(x.paire.match) + ') — '
                  + (x.informative ? 'le bon était <b>' + esc(x.bon) + '</b>' : esc(x.resume));
              }).join('<br>')
            + '</div>'
            + '<div style="font-size:10px; color:#64748b; margin-top:5px;">'
            + 'Le registre ne décide pas, il compte. Le jour où un critère sera à 5 ou 6 sur 6, le '
            + 'départage sera acquis sans avoir été inventé. Aujourd\'hui la validité n\'a jamais choisi '
            + 'le mauvais thème — elle a seulement été <b>muette</b> une fois, sur la paire où les deux '
            + 'étaient à 100 %.</div></div>';
        })()
      + '<div class="muted" style="font-size:10.5px; margin-top:7px;">'
      + '⚠️ Aucun de ces critères n\'est démontré — le registre ci-dessus est là pour qu\'ils le deviennent, '
      + 'ou pas. À noter que sur l\'ensemble de l\'archive un niveau de validité élevé ne rend PAS un thème '
      + 'ISOLÉ plus juste (1 axe de dérivé 83 %, 2 axes 86 %, 3 axes 59 %) : « ce thème est-il fiable ? » et '
      + '« entre ces deux thèmes, lequel croire ? » sont deux questions différentes, et seule la seconde est '
      + 'comptée ici.</div>';
  };
})();

// ═══════════════════════════════════════════════════════════════
// LE CONSENSUS DE TIRAGES (30/08/26) — idée d'Ellemine_D
//
// « Fais un bouton de lancement pour 10 ou 20 thèmes, on regarde le camp
// qui vient le plus souvent — 2/3, 16/20. »
//
// L'idée est juste, et elle est TESTABLE AVANT D'ÊTRE CRUE. Deux
// conditions doivent tenir pour qu'un consensus veuille dire quelque
// chose.
//
// 1. IL FAUT CONNAÎTRE LE TAUX DE BASE. Si le système disait « R1 » sur
//    la majorité des thèmes au hasard, un 16/20 pour R1 ne dirait rien du
//    match. Mesuré sur 3 000 tirages aléatoires :
//        R1 ... 39,0 %     R7 ... 36,8 %     nul ... 24,2 %
//    (et sur les seuls thèmes valides : 38,5 / 36,8 / 24,7 — identique).
//    La distribution est presque équilibrée : un écart net est donc
//    lisible. C'est ce qui rend l'idée exploitable.
//
// 2. ☠️ IL FAUT QUE LES TIRAGES SOIENT LES TIENS. Si c'est l'ordinateur
//    qui tire les mères avec Math.random(), les verdicts sont par
//    construction des tirages indépendants dans 39/37/24 — aucun
//    consensus ne peut émerger au-delà du hasard, jamais. Le bouton
//    « tirage machine » n'est donc PAS l'outil : c'est le TÉMOIN, celui
//    qui montre à quoi ressemble l'absence de signal.
//
// ET C'EST LÀ QUE ÇA DEVIENT INTÉRESSANT. Ce panneau est un test direct
// de la prémisse du fichier. Si tes tirages à la main donnent des
// consensus que la machine ne donne jamais, c'est que l'acte de tirer
// n'est pas indépendant du match. Si tes tirages ressemblent à ceux de
// la machine, il faut le savoir aussi. Le panneau ne tranche pas : il
// compte, il compare au témoin, et il donne la probabilité qu'un tel
// écart sorte du hasard.
//
// ✔ PREMIER POINT MARQUÉ (30/08/26, quelques heures après la mise en
// service). Deuxième triplet, trois thèmes tous à 3/3 + figure du jour :
//     CarcPuella  → R1     CarcCaput → R7     FortMajFMin → R7
// Majorité R7 2/3. Réel : 3-4 pour R7. La règle d'Ellemine_D a raison,
// et elle a raison CONTRE moi : j'avais conseillé R1 sur une unanimité
// de F4P4, et j'avais écrit sous le tableau « trois tirages ne peuvent
// rien prouver ». C'est vrai statistiquement — p = 0,307, et même 3/3
// ne descendrait pas sous 0,05 — et ça n'empêche pas la règle d'avoir
// vu juste quand aucune des miennes ne l'a fait.
// Bilan honnête sur les triplets : le premier était 1/1/1, sans
// majorité, donc muet ; celui-ci est le premier où la règle parle.
//     majorité des thèmes ... 1 sur 1
//     accord F4P4/critères ... 0 sur 2
// Un sur un ne démontre rien (p = 0,50). Mais c'est la seule règle de ce
// fichier qui n'ait pas encore échoué sur un triplet, et la seule que je
// n'aie pas inventée. Elle mérite les 15 à 20 tirages qu'elle demande.
var BASE_VERDICT_V7 = { R1: 0.390, R7: 0.368, nul: 0.242 };

// Probabilité d'obtenir AU MOINS k succès sur n, chacun de probabilité p.
function queueBinomialeV7(k, n, p) {
  function lchoose(n2, k2) {
    var r = 0;
    for (var i = 1; i <= k2; i++) r += Math.log(n2 - k2 + i) - Math.log(i);
    return r;
  }
  var tot = 0;
  for (var i = k; i <= n; i++) {
    tot += Math.exp(lchoose(n, i) + i * Math.log(p) + (n - i) * Math.log(1 - p));
  }
  return Math.min(1, Math.max(0, tot));
}

// themes : tableau de tableaux de 4 clés de figures.
function consensusTiragesV7(themes) {
  var tally = { R1: 0, R7: 0, nul: 0 }, lignes = [], rejetes = 0;
  (themes || []).forEach(function (m, i) {
    var t = null;
    try { t = buildThemeFromMothers(m[0], m[1], m[2], m[3]); } catch (e) { return; }
    var v = null;
    try { v = getVerdictAfficheReel(t); } catch (e) { return; }
    var d = v.nulActif ? 'nul' : (v.winner === 'M1' ? 'R1' : 'R7');
    tally[d] += 1;
    var nv = 0;
    try { nv = niveauValiditeV7(t).niveau; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    // Le critère nu (sousSeuil), pas la porte : la colonne « niveau » doit
    // rester lisible en rouge/vert même le rejet levé. Cf. 04/09/26.
    var sous = (v.sousSeuil !== undefined) ? !!v.sousSeuil : !!v.rejete;
    if (sous) rejetes += 1;
    lignes.push({ n: i + 1, meres: m, dit: d, score: v.scoreMain, niveau: nv, rejete: sous });
  });
  var n = tally.R1 + tally.R7 + tally.nul;
  if (!n) return null;
  var tete = ['R1', 'R7', 'nul'].sort(function (a, b) { return tally[b] - tally[a]; })[0];
  var p = queueBinomialeV7(tally[tete], n, BASE_VERDICT_V7[tete]);
  var attendu = Math.round(BASE_VERDICT_V7[tete] * n * 10) / 10;
  return { tally: tally, n: n, tete: tete, compte: tally[tete], attendu: attendu,
    p: p, significatif: p < 0.05, lignes: lignes, rejetes: rejetes };
}

// Le panneau : on colle ses tirages, une ligne par thème.
function toggleConsensusPanel() {
  var panel = document.getElementById('consensus-panel');
  if (!panel) return;
  if (panel.style.display === 'none' || !panel.style.display) {
    renderConsensusPanel();
    panel.style.display = 'block';
  } else { panel.style.display = 'none'; }
}

// Lit un nom de figure écrit à la main : accents, majuscules, « conjonctio »,
// « Caput », « Aquisitio »… tout ce qu'Ellemine_D écrit réellement.
function figureDepuisTexteV7(txt) {
  var v = String(txt || '').toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
  if (!v) return null;
  var alias = {
    puer: 'puer', laetitia: 'laetitia', letitia: 'laetitia',
    caput: 'caput_draconis', caputdraconis: 'caput_draconis',
    cauda: 'cauda_draconis', caudadraconis: 'cauda_draconis',
    albus: 'albus', via: 'via', amissio: 'amissio', rubeus: 'rubeus',
    tristitia: 'tristitia', carcer: 'carcer',
    conjunctio: 'conjunctio', conjonctio: 'conjunctio', conionctio: 'conjunctio',
    puella: 'puella', populus: 'populus',
    acquisitio: 'acquisitio', aquisitio: 'acquisitio',
    fortunamajor: 'fortuna_major', fortunamaior: 'fortuna_major',
    fortunaminor: 'fortuna_minor'
  };
  if (alias[v]) return alias[v];
  var cles = Object.keys(FL);
  for (var i = 0; i < cles.length; i++) {
    if (cles[i].replace(/_/g, '') === v) return cles[i];
  }
  return null;
}

function lireTiragesTexteV7(txt) {
  var lignes = String(txt || '').split(/\n+/);
  var out = [], erreurs = [];
  lignes.forEach(function (l, i) {
    var brut = l.trim();
    if (!brut) return;
    var mots = brut.split(/[\s,;/·|]+/).filter(function (x) { return x; });
    // regrouper « fortuna major » en un seul nom
    var noms = [], j = 0;
    while (j < mots.length) {
      var deux = (j + 1 < mots.length) ? figureDepuisTexteV7(mots[j] + mots[j + 1]) : null;
      if (deux) { noms.push(deux); j += 2; }
      else { noms.push(figureDepuisTexteV7(mots[j])); j += 1; }
    }
    if (noms.length !== 4 || noms.some(function (x) { return !x; })) {
      erreurs.push('ligne ' + (i + 1) + ' : « ' + brut + ' » — il faut exactement 4 figures reconnues');
      return;
    }
    out.push(noms);
  });
  return { themes: out, erreurs: erreurs };
}

function renderConsensusPanel(action) {
  var panel = document.getElementById('consensus-panel');
  if (!panel) return;
  var esc = function (v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  if (!action) {
    panel.innerHTML =
      '<h3 style="margin-bottom:2px;">🎲 Consensus de tirages</h3>'
      + '<div class="muted" style="font-size:11px; margin-bottom:8px;">'
      + 'Colle tes tirages pour un même match, <b>une ligne par thème, quatre mères par ligne</b>. '
      + 'Le panneau compte les verdicts et dit si le camp majoritaire sort du hasard.'
      + '<br><b style="color:#fbbf24;">Taux de base mesurés sur 3 000 tirages aléatoires : '
      + 'R1 39,0 % · R7 36,8 % · nul 24,2 %.</b> C\'est à ces taux qu\'un consensus se compare, '
      + 'jamais à 50/50.</div>'
      + '<textarea id="cons-txt" rows="8" placeholder="Fortuna major, Laetitia, Fortuna major, Rubeus&#10;'
      + 'Fortuna major, Albus, Albus, Albus&#10;Conjonctio, Caput, Aquisitio, Albus" '
      + 'style="width:100%; border-radius:8px; background:#020617; color:#e2e8f0; border:1px solid #334155; '
      + 'padding:9px; font-size:12px;"></textarea>'
      + '<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">'
      + '<button class="btn-primary" style="width:auto; padding:7px 14px;" '
      + 'onclick="renderConsensusPanel(\'mes\')">Compter mes tirages</button>'
      + '<button class="btn-secondary" style="width:auto; padding:7px 14px;" '
      + 'onclick="renderConsensusPanel(\'temoin10\')">Témoin machine — 10</button>'
      + '<button class="btn-secondary" style="width:auto; padding:7px 14px;" '
      + 'onclick="renderConsensusPanel(\'temoin20\')">Témoin machine — 20</button></div>'
      + '<div id="cons-res" style="margin-top:10px;"></div>';
    return;
  }
  var zone = document.getElementById('cons-res');
  if (!zone) return;
  var themes = [], erreurs = [], temoin = false;
  if (action === 'mes') {
    var lu = lireTiragesTexteV7((document.getElementById('cons-txt') || {}).value || '');
    themes = lu.themes; erreurs = lu.erreurs;
  } else {
    temoin = true;
    var n = action === 'temoin20' ? 20 : 10;
    for (var i = 0; i < n; i++) {
      themes.push([0, 0, 0, 0].map(function () {
        return FIGS_V7[Math.floor(Math.random() * 16)];
      }));
    }
  }
  if (!themes.length) {
    zone.innerHTML = '<div class="warn">Aucun tirage lisible.'
      + (erreurs.length ? '<br>' + erreurs.map(esc).join('<br>') : '') + '</div>';
    return;
  }
  var r = consensusTiragesV7(themes);
  if (!r) { zone.innerHTML = '<div class="warn">Calcul impossible.</div>'; return; }
  var col = r.significatif ? '#4ade80' : '#fbbf24';
  var nomTete = r.tete === 'nul' ? 'le NUL' : r.tete;
  zone.innerHTML =
    (erreurs.length ? '<div class="warn" style="font-size:11px; margin-bottom:6px;">'
      + erreurs.map(esc).join('<br>') + '</div>' : '')
    + (temoin ? '<div style="font-size:11px; color:#94a3b8; margin-bottom:6px;">'
      + '⚙️ <b>TÉMOIN MACHINE</b> — ces tirages viennent de Math.random(). Par construction ils ne '
      + 'peuvent RIEN dire du match : ils montrent seulement à quoi ressemble l\'absence de signal. '
      + 'Compare-les à tes propres tirages.</div>' : '')
    + '<div style="display:flex; gap:14px; flex-wrap:wrap; margin-bottom:8px;">'
    + [['R1', '#7dd3fc'], ['R7', '#fdba74'], ['nul', '#fbbf24']].map(function (x) {
        return '<div style="flex:1; min-width:110px; border:1px solid ' + x[1]
          + '; border-radius:9px; padding:8px; text-align:center;">'
          + '<div style="font-size:11px; color:#94a3b8;">' + x[0] + '</div>'
          + '<div style="font-size:24px; font-weight:800; color:' + x[1] + ';">'
          + r.tally[x[0]] + '</div>'
          + '<div style="font-size:10px; color:#64748b;">attendu ' 
          + (Math.round(BASE_VERDICT_V7[x[0]] * r.n * 10) / 10) + '</div></div>';
      }).join('')
    + '</div>'
    + '<div style="padding:9px 11px; border-radius:9px; border:2px solid ' + col + '; '
    + 'background:rgba(15,23,42,.6);">'
    + '<div style="font-size:13px; font-weight:800; color:' + col + ';">'
    + esc(nomTete) + ' sort ' + r.compte + ' fois sur ' + r.n
    + ' — attendu ' + r.attendu + ' au hasard</div>'
    + '<div style="font-size:11.5px; color:#e2e8f0; margin-top:4px;">'
    + (r.significatif
      ? 'Probabilité d\'obtenir au moins ' + r.compte + ' sur ' + r.n + ' par pur hasard : <b>'
        + (r.p < 0.001 ? 'moins de 0,1 %' : (r.p * 100).toFixed(1) + ' %') + '</b>. '
        + 'C\'est un écart que le hasard ne produit pas facilement.'
      : 'Probabilité d\'obtenir au moins ' + r.compte + ' sur ' + r.n + ' par pur hasard : <b>'
        + (r.p * 100).toFixed(1) + ' %</b>. <b>Compatible avec le hasard</b> — ce n\'est pas un consensus, '
        + 'c\'est une majorité ordinaire.')
    + '</div>'
    + (r.rejetes ? '<div style="font-size:10.5px; color:#94a3b8; margin-top:4px;">'
        + r.rejetes + ' de ces thèmes sont rejetés par ta règle de validité — leur verdict est compté '
        + 'ici quand même, sinon il ne resterait presque rien à compter.</div>' : '')
    + '</div>'
    + '<table style="width:100%; font-size:11px; border-collapse:collapse; margin-top:8px;">'
    + '<tr><th style="text-align:left; padding:3px 6px;">#</th>'
    + '<th style="text-align:left; padding:3px 6px;">mères</th>'
    + '<th style="padding:3px 6px;">verdict</th><th style="padding:3px 6px;">score</th>'
    + '<th style="padding:3px 6px;">validité</th></tr>'
    + r.lignes.map(function (l) {
        var c = l.dit === 'nul' ? '#fbbf24' : (l.dit === 'R1' ? '#7dd3fc' : '#fdba74');
        return '<tr><td style="padding:3px 6px; color:#64748b;">' + l.n + '</td>'
          + '<td style="padding:3px 6px; color:#cbd5e1;">'
          + l.meres.map(function (f) { return esc(FL[f] || f); }).join(' · ') + '</td>'
          + '<td style="padding:3px 6px; text-align:center; color:' + c + '; font-weight:800;">'
          + esc(l.dit) + '</td>'
          + '<td style="padding:3px 6px; text-align:center; color:#94a3b8;">' + esc(l.score) + '</td>'
          + '<td style="padding:3px 6px; text-align:center; color:'
          + (l.rejete ? '#f87171' : '#4ade80') + ';">' + l.niveau + '/3</td></tr>';
      }).join('')
    + '</table>'
    + '<div class="muted" style="font-size:10px; margin-top:7px;">'
    + '⚠️ Un consensus significatif prouve que TES tirages ne se comportent pas comme des tirages au '
    + 'hasard. Il ne prouve pas encore qu\'ils disent vrai sur le match — pour ça il faut comparer le '
    + 'camp majoritaire au résultat réel, plusieurs fois. C\'est exactement ce que le journal des '
    + 'prédictions gelées est fait pour mesurer.</div>';
}

function comparerDeuxThemesV7(themeA, themeB) {
  if (!themeA || !themeB) return null;
  function lire(t) {
    var o = { verdict: '?', score: '?', niveau: null, axesDerives: null, binomesDerives: null, porte: false, k: null,
      faisceau: null, axesValides: 0, axesAncres: 0, sommesIncident: 0 };
    try {
      var v = getVerdictAfficheReel(t);
      o.verdict = v.nulActif ? 'nul' : v.winner;
      o.score = v.scoreMain;
    } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var nv = niveauValiditeV7(t); o.niveau = nv ? nv.niveau : null; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var pc = porteConfianceV7(t); if (pc) { o.axesDerives = pc.nbAxes; o.binomesDerives = pc.nbBinomes; } } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var d = nulDeuxPortesV7(t); if (d) { o.porte = nulParPorteV7(t); o.k = d.k; } } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var f = faisceauNulV7(t); o.faisceau = f ? f.n : null; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try {
      var ax = lectureAxesV7(t);
      if (ax && ax.axes) {
        o.axesValides = ax.axes.filter(function (a) { return a.applicable && a.valide; }).length;
        o.axesAncres = ax.axes.filter(function (a) { return a.applicable && a.ancree; }).length;
      }
    } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    try { var sa = sommesAxesIncidentV7(t); o.sommesIncident = sa ? sa.nb : 0; } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
    return o;
  }
  var a = lire(themeA), b = lire(themeB);
  var criteres = [
    { nom: 'dérivés d\'axe valides (porte de confiance)', a: a.axesDerives, b: b.axesDerives, plusGrandGagne: true },
    { nom: 'binômes des dérivés', a: a.binomesDerives, b: b.binomesDerives, plusGrandGagne: true },
    { nom: 'niveau de validité', a: a.niveau, b: b.niveau, plusGrandGagne: true },
    { nom: 'dérivés d\'axes valides', a: a.axesValides, b: b.axesValides, plusGrandGagne: true },
    { nom: 'dérivés d\'axes ancrés', a: a.axesAncres, b: b.axesAncres, plusGrandGagne: true },
    { nom: 'signaux du faisceau du nul', a: a.faisceau, b: b.faisceau, plusGrandGagne: true },
    { nom: 'sommes d\'axes d\'incident', a: a.sommesIncident, b: b.sommesIncident, plusGrandGagne: true }
  ].map(function (c) {
    c.prefere = (c.a === c.b || c.a == null || c.b == null) ? null
      : ((c.a > c.b) === c.plusGrandGagne ? 'A' : 'B');
    return c;
  });
  return { a: a, b: b, criteres: criteres,
    accord: a.verdict === b.verdict,
    departageables: criteres.filter(function (c) { return c.prefere; }).length };
}

// ═══════════════════════════════════════════════════════════════
// LE REGISTRE DES PAIRES (30/08/26) — demande d'Ellemine_D
//
// « Deux thèmes 100 % valides de verdicts différents, ça me tue. »
//
// C'est le bon reproche, et il touche une limite de naissance : la
// validité mesure si un thème est BIEN FORMÉ (ses axes présents, ses
// binômes présents), pas s'il correspond au match. Rien dans sa
// définition ne peut empêcher deux thèmes bien formés de se contredire.
// Elle ne peut donc pas départager une paire où les deux sont complets.
//
// CE QUE LES PAIRES CONNUES DISENT VRAIMENT. Trois paires archivées,
// mais une seule ne départage rien (les deux thèmes disaient nul et
// c'était un nul). Sur les deux qui départagent, en demandant à chaque
// critère de choisir « celui qui en a le plus » :
//     niveau de validité ..... 1 juste · 0 faux · 1 MUET
//     dérivés d'axe valides .. 1 · 0 · 1 MUET
//     100 % complet .......... 1 · 0 · 1 MUET
//     faisceau du nul ........ 1 · 1 · 0
//     théorème applicable .... 1 · 1 · 0
//     R1 en maison cadente ... 0 · 1 · 1
// La validité ne s'est JAMAIS trompée — elle a été muette une fois,
// exactement sur la paire qui pose problème. Ce n'est pas la même chose
// qu'être fausse : tout le reste est à pile ou face ou pire.
//
// ☠️ ET JE N'INVENTE PAS DE DÉPARTAGE. Sur la paire à 100 % / 100 %, les
// trois critères non muets ont TOUS choisi le mauvais thème. J'ai aussi
// essayé « croire le thème dont le verdict s'appuie sur la règle la mieux
// notée » : juste sur une paire, faux sur l'autre. Avec deux paires
// informatives on ne peut pas savoir, et une règle taillée sur deux cas
// est exactement ce qu'on s'est interdit depuis le début.
//
// D'OÙ CE REGISTRE. Il ne décide pas : il COMPTE. Chaque paire ajoutée
// met à jour le tableau, et le jour où un critère sera à 5 ou 6 sur 6,
// le départage sera acquis sans avoir été inventé. En attendant, quand
// tous les critères sont à égalité, le panneau le dit franchement.
