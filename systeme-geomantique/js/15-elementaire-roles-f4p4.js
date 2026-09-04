// ═══════════════════════════════════════════════════════════════
// ELEMENTAIRE ROLES F4P4
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
function elementaireFigureMaison(fig, house) {
  const ELEM_ORDER_LOCAL = ['feu','air','eau','terre'];
  const figureNature = ELEMENTS_V7[fig] || null;
  const houseNature = MAISON_ELEM_V7[house] || null;
  const bits = MAP_GEO[fig] || [1,1,1,1];
  const idx = ELEM_ORDER_LOCAL.indexOf(houseNature);
  const level = idx >= 0 ? bits[idx] : null; // 1=actif, 2=passif
  return {
    fig: fig, house: house,
    figureNature: figureNature, houseNature: houseNature,
    natureLevel: { active: level === 1, passive: level === 2, raw: level }
  };
}
// RECONSTRUIT (21/08/26) — voir note ci-dessus. Neutralisation par
// opposition classique F↔E, A↔T (cf. `rule` dans procedureR1R7) : une
// charge active de R1 sur un élément est neutralisée si R7 a une charge
// active sur l'élément OPPOSÉ, et réciproquement. ⚠️ À VALIDER.
function neutralisationElementaireR1R7(r1, r7) {
  const OPPOSE_LOCAL = {feu:'eau', eau:'feu', air:'terre', terre:'air'};
  const chargeR1 = r1.natureActive ? [r1.houseNature] : [];
  const chargeR7 = r7.natureActive ? [r7.houseNature] : [];
  const restA = chargeR1.filter(function(e){ return chargeR7.indexOf(OPPOSE_LOCAL[e]) === -1; });
  const restB = chargeR7.filter(function(e){ return chargeR1.indexOf(OPPOSE_LOCAL[e]) === -1; });
  return { restA: restA, restB: restB };
}
function puissanceElementaireR1R7(fig, house, theme){
  const x = elementaireFigureMaison(fig, house);
  const vals = Object.keys(theme || {}).map(function(k){ return theme[k]; });
  const bin = (typeof BINOMES_V7!=='undefined' ? BINOMES_V7[fig] : BINOMES[fig]) || null;
  x.binome = bin;
  x.binomePresent = !!bin && vals.indexOf(bin)!==-1;
  x.natureActive = !!(x.natureLevel && x.natureLevel.active);
  x.naturePassive = !!(x.natureLevel && x.natureLevel.passive);
  x.maisonAccordNature = x.figureNature === x.houseNature;
  x.pouvoirExprime = x.natureActive && x.maisonAccordNature && x.binomePresent;
  x.pouvoirPartiel = x.natureActive && x.binomePresent;
  x.pouvoirActiveSeul = x.natureActive && !x.pouvoirPartiel;
  x.powerScore = x.pouvoirExprime ? 30 : x.pouvoirPartiel ? 15 : x.pouvoirActiveSeul ? 5 : 0;
  x.powerLabel = x.pouvoirExprime ? 'POUVOIR EXPRIMÉ' : x.pouvoirPartiel ? 'POUVOIR ACTIVÉ PARTIELLEMENT' : x.pouvoirActiveSeul ? 'NATURE ACTIVE' : 'POUVOIR NON EXPRIMÉ';
  return x;
}

// AJOUTÉ (24/08/26) : renderElementaireR1R7 était appelée par renderTheme()
// mais n'existait NULLE PART dans le fichier — ReferenceError à chaque
// rendu, avalé par le try/catch de l'appelant (« elementaire R1/R7 error »
// en console seulement). Son code de nettoyage avait pourtant survécu à la
// suppression : la branche « abstention » retire encore
// #sikidy-elementaire-panel, un élément que plus rien ne créait. La couche
// est donc reconstruite sur ses moteurs existants
// (puissanceElementaireR1R7 + neutralisationElementaireR1R7) et réinsérée
// sous ce même id, ce qui redonne son sens au nettoyage existant.
// Couche de confirmation traçable : elle n'entre PAS dans verdictFinal —
// elle affiche seulement la lecture élémentaire déjà utilisée par le
// moteur, à titre de diagnostic.
function renderElementaireR1R7(theme){
  const ancien = document.getElementById('sikidy-elementaire-panel');
  if(ancien) ancien.remove();
  if(!theme) return;

  const hote = document.getElementById('carte-verdict-r');
  if(!hote || !hote.parentNode) return;

  const rot = getRotationCombat(theme);
  const r1 = puissanceElementaireR1R7(rot.figR1, rot.hR1, theme);
  const r7 = puissanceElementaireR1R7(rot.figR7, rot.hR7, theme);
  const neutre = neutralisationElementaireR1R7(r1, r7);

  const ELEM_COULEUR = {feu:'#ef4444', air:'#eab308', eau:'#3b82f6', terre:'#94a3b8'};
  const teinte = e => ELEM_COULEUR[e] || '#94a3b8';
  const puce = e => '<span style="color:' + teinte(e) + ';">' + (e || '—') + '</span>';

  function colonne(x, titre, couleurTitre){
    const accord = x.maisonAccordNature
      ? '<span style="color:#4ade80;">accord figure/maison</span>'
      : '<span class="muted">pas d\'accord figure/maison</span>';
    const binome = x.binomePresent
      ? '<span style="color:#4ade80;">binôme ' + (FL[x.binome] || x.binome) + ' présent</span>'
      : '<span class="muted">binôme ' + (FL[x.binome] || x.binome || '—') + ' absent</span>';
    const nature = x.natureActive
      ? '<span style="color:#4ade80;">active</span>'
      : (x.naturePassive ? '<span style="color:#fbbf24;">passive</span>' : '<span class="muted">indéterminée</span>');
    return '<div>'
      + '<b style="color:' + couleurTitre + ';">' + titre + ' = ' + (FL[x.fig] || x.fig) + ' en M' + x.house + '</b>'
      + '<div style="margin-top:4px;">Élément figure : ' + puce(x.figureNature) + ' · maison : ' + puce(x.houseNature) + '</div>'
      + '<div>Charge sur l\'élément de la maison : ' + nature + '</div>'
      + '<div>' + accord + '</div>'
      + '<div>' + binome + '</div>'
      + '<div style="margin-top:4px;"><b>' + x.powerLabel + '</b> (+' + x.powerScore + ')</div>'
      + '</div>';
  }

  const reliquat = (liste, camp) => liste.length
    ? camp + ' conserve ' + liste.map(puce).join(', ')
    : camp + ' entièrement neutralisé';

  const panneau = document.createElement('div');
  panneau.id = 'sikidy-elementaire-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:10px; border:1px solid #0e7490;';
  panneau.innerHTML =
    '<h3 style="margin-bottom:2px;">🜂 Couche élémentaire R1 / R7</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:10px;">Diagnostic de concordance uniquement — cette lecture ne modifie pas le verdict, elle expose la composante élémentaire que le moteur utilise déjà.</div>'
    + '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px; line-height:1.6;">'
    + colonne(r1, 'R1', '#60a5fa')
    + colonne(r7, 'R7', '#fb923c')
    + '</div>'
    + '<div style="margin-top:10px; padding:8px; border-top:1px solid rgba(148,163,184,.25); font-size:12px;">'
    + '<b>Neutralisation croisée</b> (opposition feu↔eau, air↔terre) : '
    + reliquat(neutre.restA, 'R1') + ' · ' + reliquat(neutre.restB, 'R7')
    + '</div>';

  hote.parentNode.insertBefore(panneau, hote.nextSibling);
}

// ═══════════════════════════════════════════════════════════════
// PANNEAU DES RÔLES EXERCÉS (25/08/26, demande Ellemine_D)
// Le système savait répondre à « qui protège Puer ? ». Il ne savait pas
// répondre à « Acquisitio, dans CE thème, qui sert-elle et qui frappe-t-elle ? ».
// C'est le côté EXERCÉ des quatre relations, celui que rolesDeLaFigureV7
// expose et que rien n'affichait.
// BRANCHÉ AU VERDICT le 25/08 via scoreRolesRecusV7 : la portée des rôles
// reçus par R1 et R7 entre dans l'ancrage décisif. Le panneau reste la
// lecture complète — toutes les figures — dont le calcul ne retient que
// les deux chefs.
// ═══════════════════════════════════════════════════════════════

// Statut d'un destinataire dans le thème : absent, en résultante seule,
// en base, ou chez lui (maison de repos). Même hiérarchie que la chaîne :
// base > résultante > absent, et le repos domine tout.
function etatDestinataireV7(dest, theme) {
  if (!dest) return {fig: null, present: false, libelle: '—', rang: 0};
  const occ = trouverFigV7(dest, theme);
  if (!occ.length) return {fig: dest, present: false, libelle: 'absente', rang: 0};
  const base = occ.filter(function (o) { return !o.hidden; });
  const res  = occ.filter(function (o) { return  o.hidden; });
  const repos = occ.filter(function (o) { return FIGS_V7[o.pos - 1] === dest; });
  const maisons = function (liste) { return liste.map(function (o) { return 'M' + o.pos; }).join(' '); };
  if (repos.length) return {fig: dest, present: true, rang: 3,
    libelle: 'chez elle en ' + maisons(repos)};
  if (base.length) return {fig: dest, present: true, rang: 2,
    libelle: 'en base ' + maisons(base) + (res.length ? ' (+' + res.length + ' rés.)' : '')};
  return {fig: dest, present: true, rang: 1, libelle: 'résultante ' + maisons(res)};
}

// Les quatre rôles qu'une figure exerce, avec l'état de chaque destinataire.
// Un rôle n'a d'effet que s'il y a quelqu'un à servir ou à frapper ET si
// celui qui l'exerce tient debout — d'où les trois portées possibles.
function rolesExercesFigureV7(fig, theme, siegeImpose) {
  const r = rolesDeLaFigureV7(fig);
  if (!r) return null;
  const sol = figureSolideV7(fig, theme, siegeImpose);
  const soi = etatDestinataireV7(fig, theme);
  // La portée d'un rôle croise DEUX ancrages : celui qui l'exerce et celui
  // qui le reçoit. Un destinataire seulement en résultante n'est qu'un
  // potentiel — le rôle est latent, pas exercé.
  // Cas particulier du rôle hostile : « dans leur maison elles sont de
  // nature forte, direct, car elles sont chez elles » (Ellemine_D). Une
  // cible à son repos résiste, la frappe est CONTRÉE. Règle tirée de la
  // doctrine déjà posée, pas ajoutée pour l'occasion.
  function role(cle, dest, hostile, libelle) {
    const etat = etatDestinataireV7(dest, theme);
    let portee;
    // CORRIGÉ (25/08/26) : une figure ABSENTE du thème n'exerce aucun rôle.
    // Avant ce correctif, elle était jugée « affaibli » — le cas d'une
    // exerçante non solide — et pesait donc pour moitié. Mesuré : 3475 sur
    // 3475 acteurs absents étaient comptés ainsi, soit 100%. Un chef dont
    // le protecteur manque touchait quand même un demi-crédit de
    // protection, et un chef dont l'antagoniste est absent subissait quand
    // même une demi-frappe. soliditeChaineV7 traitait déjà l'absence pour
    // ce qu'elle est (maillon absent = −3) : les deux couches se
    // contredisaient. Trouvé en lisant le thème Fortuna Minor / Amissio /
    // Carcer / Carcer, où Acquisitio est absente et tenait pourtant un
    // rôle de front « affaibli ».
    if (!soi.present)           portee = 'à vide';
    else if (!etat.present)     portee = 'à vide';
    else if (etat.rang === 1)   portee = 'latent';
    else if (!sol.solide)       portee = 'affaibli';
    else if (hostile && etat.rang === 3) portee = 'contrée';
    else                        portee = 'effectif';
    return {cle: cle, libelle: libelle, dest: dest, hostile: hostile,
      etat: etat, portee: portee};
  }
  return {
    fig: fig, etatSoi: soi, solide: !!sol.solide,
    scoreSoi: sol.meilleur ? Math.round(sol.meilleur.total * 10) / 10 : null,
    roles: [
      role('antagonisteDe', r.antagonisteDe, true,  'frappe'),
      role('binomeDe',      r.binomeDe,      false, 'binôme de'),
      role('protecteurDe',  r.protecteurDe,  false, 'protège'),
      role('frontDe',       r.frontDe,       false, 'front de')
    ]
  };
}

// Toutes les figures présentes dans le thème, R1 et R7 en tête.
function rolesExercesTheme(theme) {
  if (!theme || !theme[1]) return {applicable: false, lignes: []};
  const rot = getRotationCombat(theme);
  const figR1 = rot.figR1, figR7 = rot.figR7;
  const presentes = FIGS_V7.filter(function (f) { return trouverFigV7(f, theme).length > 0; });
  // R1 et R7 sont la même figure sur 5,4% des thèmes (mesuré sur 4000) :
  // une seule ligne alors, portant les deux titres et les deux sièges.
  const memeChef = figR1 === figR7;
  const tetes = memeChef ? [figR1] : [figR1, figR7];
  const ordre = tetes.concat(presentes.filter(function (f) {
    return f !== figR1 && f !== figR7;
  }));
  const lignes = ordre.map(function (f, rang) {
    const estTete = rang < tetes.length;
    const siege = !estTete ? undefined
      : (memeChef ? rot.hR1 : (f === figR1 ? rot.hR1 : rot.hR7));
    const l = rolesExercesFigureV7(f, theme, siege);
    if (!l) return null;
    l.chef = !estTete ? null : (memeChef ? 'R1 · R7' : (f === figR1 ? 'R1' : 'R7'));
    l.siege = siege || null;
    l.siegeSecond = memeChef && estTete ? rot.hR7 : null;
    // Ce qui intéresse le verdict : un rôle dont le destinataire est un chef,
    // et — pour les deux chefs eux-mêmes — un rôle qui touche le camp d'en
    // face, seul cas où scoreRolesExercesV7 le compte.
    const campAdverse = !estTete ? []
      : campDuChefV7(memeChef ? figR7 : (f === figR1 ? figR7 : figR1));
    l.roles.forEach(function (ro) {
      ro.surChef = ro.dest === figR1 ? 'R1' : (ro.dest === figR7 ? 'R7' : null);
      ro.compte = campAdverse.indexOf(ro.dest) >= 0;
    });
    return l;
  }).filter(Boolean);
  return {applicable: true, figR1: figR1, figR7: figR7,
    hR1: rot.hR1, hR7: rot.hR7, lignes: lignes};
}


// ═══════════════════════════════════════════════════════════════
// RÔLES REÇUS PAR UN CHEF — branchement des rôles exercés au calcul
// (25/08/26, demande Ellemine_D : « branche les rôles exercés »)
//
// Les quatre figures qui exercent un rôle SUR X sont exactement les
// quatre pôles de X : X+10 le protège, X+4 lui sert de front, X+2 est
// son binôme, X−3 le frappe. Rien de nouveau de ce côté-là.
// Ce qui est nouveau, c'est la PORTÉE : soliditeChaineV7 ne regarde que
// la présence des maillons ; ici on regarde aussi si celui qui rend le
// service tient debout, et si celui qui frappe frappe pour de bon.
// Un protecteur présent mais fragile protège mal. Une frappe sur un chef
// à son repos est contrée. C'est exactement ce que le panneau affiche.
//
// Hypothèse retenue et NON pénalisante (25/08/26) : « être attaqué
// n'empêche pas de frapper ». Une figure qui tient plusieurs rôles les
// tient tous à plein — aucun coefficient ne les divise. Mesuré : toute
// pénalité sur les pôles occupés casse le cas Inter.
// ═══════════════════════════════════════════════════════════════

// Un seul endroit pour régler le barème.
var POIDS_ROLES_V7 = {
  protecteur: 1, front: 1.5, binome: 1, antagoniste: -2,
  portee: {effectif: 1, 'contrée': 0.5, affaibli: 0.5, latent: 0.25, 'à vide': 0}
};

function scoreRolesRecusV7(chef, theme, siegeImpose, figAdverse) {
  if (!chef) return null;
  const cibles = [
    {fig: BOUCLIER_V7[chef], cle: 'protecteurDe', role: 'bouclier', poids: POIDS_ROLES_V7.protecteur},
    {fig: FRONT_V7[chef],       cle: 'frontDe',      role: 'front',      poids: POIDS_ROLES_V7.front},
    {fig: BINOMES_V7[chef],     cle: 'binomeDe',     role: 'binôme',     poids: POIDS_ROLES_V7.binome},
    {fig: ANTAGONISTES_V7[chef],cle: 'antagonisteDe',role: 'antagoniste',poids: POIDS_ROLES_V7.antagoniste}
  ];
  const detail = cibles.map(function (c) {
    const rx = rolesExercesFigureV7(c.fig, theme);
    const ro = rx ? rx.roles.filter(function (r) { return r.cle === c.cle; })[0] : null;
    // Sécurité : le rôle doit bien viser le chef. Si la table et
    // rolesDeLaFigureV7 divergeaient un jour, on le verrait ici.
    const vise = ro && ro.dest === chef;
    const portee = vise ? ro.portee : 'à vide';
    const coef = POIDS_ROLES_V7.portee[portee] || 0;
    // Un appui positif tenu par la centrale adverse ne compte pas
    // (28/08/26) ; l'antagoniste, lui, reste compté — voir la règle en
    // tête de soliditeChaineV7.
    const adverse = !!(REGLE_CENTRALE_ADVERSE_V7 && figAdverse && c.fig === figAdverse && c.role !== 'antagoniste');
    return {role: c.role, acteur: c.fig, portee: portee,
      acteurSolide: rx ? rx.solide : false,
      estAdverse: adverse,
      etat: ro ? ro.etat.libelle : 'absente',
      score: adverse ? 0 : Math.round(c.poids * coef * 100) / 100};
  });
  const total = Math.round(detail.reduce(function (s, d) { return s + d.score; }, 0) * 100) / 100;
  return {chef: chef, detail: detail, total: total,
    resume: detail.map(function (d) {
      return d.role + ' ' + (FL[d.acteur] || d.acteur) + ' ' + d.portee;
    }).join(' · ')};
}


// ═══════════════════════════════════════════════════════════════
// RÔLES EXERCÉS PAR UN CHEF — le côté ACTIF (25/08/26, correction
// signalée par Ellemine_D : « tu ne l'as pas branché »).
//
// scoreRolesRecusV7 ci-dessus pèse ce qu'on fait À un chef : ses quatre
// pôles, X+10 / X+4 / X+2 / X−3. Ce sont EXACTEMENT les figures que la
// chaîne regardait déjà. Le tableau des rôles exercés vise l'autre côté :
//     X est binôme de X−2 · protecteur de X−10 · front de X−4
//     · antagoniste de X+3
// Vérifié sur les 16 figures : les deux ensembles n'ont AUCUNE figure en
// commun (0/64). Peser les rôles reçus ne disait donc rien du côté actif.
//
// Ce que le côté actif mesure : un chef n'est pas seulement bien gardé,
// il agit. Il frappe quelqu'un, il sert d'appui à trois autres. Un chef
// dont les quatre rôles sont « à vide » est isolé — personne à frapper,
// personne à soutenir — même si sa propre garde est parfaite.
//
// Doctrine de la frappe (Ellemine_D, cascade) : « le chef puer détruit
// direct la binôme de R7 (Laetitia) ». Ce qui compte n'est pas seulement
// de frapper, c'est de frapper DANS LE CAMP ADVERSE — le chef d'en face
// ou l'un de ses trois pôles alliés. D'où le multiplicateur campAdverse,
// appliqué au seul rôle hostile.
// ═══════════════════════════════════════════════════════════════

var POIDS_ROLES_EXERCES_V7 = {
  antagonisteDe: 1.5, frontDe: 1, protecteurDe: 0.75, binomeDe: 0.75
};

// Le camp d'un chef : lui-même et les trois figures qui le soutiennent —
// son protecteur, son front, son binôme. Les trois sont dans sa boucle.
// ─── LE 4e PÔLE : LE FRONT DU FRONT (26/08/26, Ellemine_D) ───
// « Au lieu de 3 pôles, 4 : on y ajoute le front du front. Comme ça ça se
// complète. » Vérifié, et il a raison sur le mot « complète » :
//
//  · front du front = décalage +8, constant sur les 16.
//  · front⁴ = identité, 16/16 : le front partitionne les figures en
//    QUATRE cycles de quatre. Le front du front est le point opposé du
//    cycle. Puer → Via → Fortuna Minor → Cauda Draconis → Puer, etc.
//  · CE QU'IL REFERME : sans lui, le front du camp n'avait aucun autre
//    membre où aller, et le binôme n'était relié à rien. Avec lui :
//        front(front)            = le front du front   ✔ dans le camp
//        bouclier(front du front) = le BINÔME, 16/16    ✔ dans le camp
//    Le 4e pôle est exactement le maillon qui relie le front au binôme.
//  · bouclier² = front, 16/16. front du front = binôme⁴, 16/16.
//    Tout est puissance du binôme : binôme +2, front +4, front du front
//    +8, bouclier +10.
//
// ⚠️ CE QU'IL COÛTE, MESURÉ. Les camps deviennent poreux. Sur les 240
// paires de centrales distinctes, membres en commun :
//        camp à 4 : 0 ×128 · 1 ×32 · 2 ×80 · 3 ×0  · 4 ×0
//        camp à 5 : 0 ×128 · 1 ×0  · 2 ×32 · 3 ×64 · 4 ×16
// À quatre membres deux camps ne partageaient jamais plus de 2 figures ;
// à cinq, 80 paires en partagent 3 ou 4. Cas extrême vérifié 16/16 : une
// figure et son front du front partagent QUATRE membres sur cinq — seuls
// leurs fronts diffèrent. C'est la situation exacte que décrit
// Ellemine_D : « il arrive même que R1 et R7 aient le même réseau ».
function campDuChefV7(chef) {
  if (!chef) return [];
  return [chef, PROTECTEURS_V7[chef], FRONT_V7[chef], BINOMES_V7[chef],
          FRONT_V7[FRONT_V7[chef]]];
}

// Le 4e pôle isolé, pour les lectures qui le veulent à part.
function frontDuFrontV7(fig) {
  return fig ? FRONT_V7[FRONT_V7[fig]] : null;
}

// ═══════════════════════════════════════════════════════════════
// MOTEUR « FRONT 4 PÔLE 4 » (F4P4) — 26/08/26, demande d'Ellemine_D
// « La démarche qu'on vient de faire, on doit la faire comme un moteur
// d'analyse verdict. Comme ça on pourra vérifier le plus juste. »
//
// C'est la procédure menée à la main sur Amissio · Fortuna Minor · Albus
// · Laetitia, rendue exécutable. Elle se lit en trois temps, pour chaque
// camp :
//
//  1. LA CENTRALE À SON SIÈGE — sa concordance avec l'élément de la
//     maison, son niveau d'alignement actif, puis ce qu'elle régénère :
//     la résultante, sa position dans le réseau (décalage pair = réseau
//     allié, impair = passage par l'antagoniste), le nombre de pas, et
//     la tenue du nœud dans sa maison.
//
//  2. LES QUATRE PÔLES ET LEUR RÉSISTANCE — bouclier, front, binôme,
//     front du front. Pour chacun : sa force avec son binôme, contre
//     celle de son antagoniste avec le sien. Marge ≥ 0 → il TIENT.
//     C'est exactement le duel du bouclier, généralisé aux quatre pôles.
//
//  3. LA CENTRALE ELLE-MÊME, jugée par la même mesure contre son propre
//     antagoniste.
//
// Le verdict compare d'abord le NOMBRE de pôles tenus, puis, à égalité,
// la somme des résistances. Le détail complet reste dans l'objet rendu :
// ce moteur est fait pour être lu, pas seulement pour trancher.
var F4P4_SEUIL_TENUE_V7 = 0;
// Règle de verdict du moteur : 'defensif' = somme des marges du bouclier
// et du front (5/7 sur les cas réels) · 'total' = tout le camp, pôles +
// centrale + régénération (4/7) · 'poles' = nombre de pôles tenus (3/7).
// Voir le commentaire dans moteurF4P4V7 pour les onze règles mesurées.
// ─── RÈGLE PAR DÉFAUT : 'duel4' depuis le 26/08/26 ───
// Ellemine_D : « on n'avait pas vu le 4e pôle de l'antagoniste direct de
// R1 et R7 ; c'est après ça qu'on pourra déterminer réellement le
// vainqueur. » Le camp de l'assaillant est désormais calculé, et 'duel4'
// est la règle qui l'emploie : ma défense (bouclier + front) MOINS celle
// de mon assaillant.
// Mesuré sur les sept cas au résultat connu :
//     defensif (ma défense seule) ..... 5/7
//     duel4    (moins celle de l'assaillant) 5/7  ← retenu
//     tenus4   (pôles tenus, différence) .... 4/7
//     assaut   (l'assaillant seul) .......... 4/7
//     total .................................. 4/7
//     poles .................................. 2/7
// ⚠️ duel4 ne fait PAS mieux que defensif sur l'échantillon : mêmes cinq
// justes, mêmes deux ratés (Inter et Atalanta). Il est retenu parce
// qu'il est doctrinalement complet — il tient compte de ce qui frappe,
// pas seulement de ce qui encaisse — et parce qu'à égalité de score la
// lecture la plus complète doit primer. Ce n'est pas un gain mesuré.
// Il change tout de même le verdict sur 10,4 % des thèmes par rapport à
// defensif : ce n'est pas un habillage.
// ☠️ 31/08/26 — CETTE VARIABLE ÉTAIT UN INTERRUPTEUR DÉCORATIF, retirée.
// Elle valait 'duel4' et n'était LUE NULLE PART : la règle duel4 est
// codée en dur dans moteurF4P4V7. Y écrire 'defensif' n'aurait rien
// changé au verdict, tout en donnant l'impression du contraire — et le
// commentaire au-dessus décrit un choix qui n'était donc pas exerçable.
// Si un jour on veut vraiment pouvoir basculer, il faudra câbler la
// lecture, pas seulement redéclarer la variable.

// ─── FUSION AVEC LE RÉSEAU D'ANCRAGE V2 (26/08/26, Ellemine_D :
// « le réseau d'ancrage est similaire à F4P4, essaie de fusionner les
// deux dans la bonne logique ») ───
//
// Il a raison : les deux moteurs posent LA MÊME question — une figure
// menacée par son antagoniste résiste-t-elle ? — mais ils y répondent
// dans deux langues différentes, et aucune des deux ne suffit :
//
//   · analyserResistanceV7 (V2) répond en PRÉSENCE. Statut qualitatif —
//     libre (l'antagoniste n'est pas dans le thème), protégé (une voie
//     est ouverte), vulnérable (aucune). Deux voies : A, le protecteur
//     neutralise la menace et n'est pas lui-même menacé — c'est déjà le
//     duel du bouclier ; B, la figure est chez elle et sa chaîne
//     binôme → binôme-du-binôme est entière.
//     Ce que ça dit : Y A-T-IL une route. Ce que ça ignore : sa solidité.
//
//   · poleF4P4V7 répond en FORCE. Marge chiffrée du pôle avec son binôme
//     contre l'antagoniste avec le sien.
//     Ce que ça dit : COMBIEN pèse le rapport. Ce que ça ignore : qu'une
//     figure sans antagoniste dans le thème n'a rien à repousser, et
//     qu'un protecteur lui-même menacé ne protège personne.
//
// LA BONNE LOGIQUE est donc la conjonction, pas la moyenne :
//     libre       → tient, quoi que dise la marge (rien ne l'attaque)
//     protégé     → tient si la marge ne l'écrase pas
//     vulnérable  → cède, sauf marge franchement positive
// Une route sans force est un chemin de papier ; une force sans route
// est une masse qui frappe à côté.
var F4P4_MARGE_ECRASEMENT_V7 = -2;   // au-delà, même protégé cède
var F4P4_MARGE_SURVIE_V7 = 2;        // en deçà, vulnérable ne se sauve pas
var F4P4_BONUS_STATUT_V7 = { libre: 1, 'protégé': 0.5, vulnérable: -1 };

function poleF4P4V7(nom, fig, theme) {
  if (!fig) return null;
  const moi = forceAvecBinomeV7(fig, theme);
  const ant = ANTAGONISTES_V7[fig];
  const lui = forceAvecBinomeV7(ant, theme);
  const marge = Math.round((moi.total - lui.total) * 100) / 100;
  // Le versant PRÉSENCE, repris tel quel du Réseau d'ancrage V2.
  let res = null;
  try { res = analyserResistanceV7(fig, theme); } catch (e) { res = null; }
  const statut = res ? res.statut : null;
  let tient, motif;
  if (statut === 'libre') {
    tient = true; motif = 'libre — ' + (FL[ant] || ant) + ' absente du thème';
  } else if (statut === 'protégé') {
    tient = marge > F4P4_MARGE_ECRASEMENT_V7;
    motif = tient ? 'protégé par la voie ' + (res.voieActive || '?')
                  : 'protégé mais écrasé (' + marge + ')';
  } else if (statut === 'vulnérable') {
    tient = marge >= F4P4_MARGE_SURVIE_V7;
    motif = tient ? 'aucune voie, mais la force suffit (' + marge + ')'
                  : 'vulnérable — aucune voie' + (res && res.protecteurMenace
                      ? ', et son protecteur est lui-même menacé' : '');
  } else {
    tient = marge >= F4P4_SEUIL_TENUE_V7; motif = 'force seule';
  }
  const bonus = (F4P4_BONUS_STATUT_V7[statut] || 0);
  return {
    role: nom, fig: fig, binome: BINOMES_V7[fig],
    antagoniste: ant, binomeAntagoniste: BINOMES_V7[ant],
    present: moi.soi.present, occ: moi.occ, base: moi.base,
    force: moi.total, forceAdverse: lui.total, marge: marge,
    statut: statut, voie: res ? res.voieActive : null,
    protecteurMenace: res ? res.protecteurMenace : null,
    tient: tient, motif: motif,
    // Le score du pôle mêle les deux langues : la marge chiffrée, plus
    // ce que le statut de présence ajoute ou retire.
    score: Math.round((marge + bonus) * 100) / 100,
    resume: nom + ' ' + (FL[fig] || fig) + ' ' + moi.total + ' contre '
      + (FL[ant] || ant) + ' ' + lui.total + ' → ' + (tient ? 'TIENT' : 'CÈDE')
      + ' (' + (marge > 0 ? '+' : '') + marge + ', ' + (statut || '—') + ')'
  };
}

function campF4P4V7(fig, siege, theme) {
  if (!fig || !siege) return null;
  const conc = concordanceElement(ELEMENTS_V7[fig], MAISON_ELEM_V7[siege]);
  const align = alignementActifV7(fig, siege);
  const regen = regenerationSiegeV7(fig, siege);
  const poles = [
    poleF4P4V7('bouclier', BOUCLIER_V7[fig], theme),
    poleF4P4V7('front', FRONT_V7[fig], theme),
    poleF4P4V7('binôme', BINOMES_V7[fig], theme),
    poleF4P4V7('front du front', frontDuFrontV7(fig), theme)
  ].filter(Boolean);
  const centrale = poleF4P4V7('centrale', fig, theme);
  // ─── LE CAMP DE L'ASSAILLANT (26/08/26, Ellemine_D : « on n'avait pas
  // vu le 4e pôle de l'antagoniste direct de R1 et R7 ; c'est après ça
  // qu'on pourra déterminer réellement le vainqueur ») ───
  // Jusqu'ici chaque pôle était pesé contre son antagoniste + le binôme
  // de celui-ci — deux figures. Mais l'antagoniste DIRECT de la centrale
  // a lui aussi un bouclier, un front, un binôme et un front du front,
  // et ces quatre-là décident si sa frappe est portée ou creuse.
  // Une attaque menée par une figure dont le propre réseau est enfoncé
  // n'est pas la même qu'une attaque menée par un camp intact.
  const antagoniste = ANTAGONISTES_V7[fig];
  const polesAssaillant = antagoniste ? [
    poleF4P4V7('bouclier', BOUCLIER_V7[antagoniste], theme),
    poleF4P4V7('front', FRONT_V7[antagoniste], theme),
    poleF4P4V7('binôme', BINOMES_V7[antagoniste], theme),
    poleF4P4V7('front du front', frontDuFrontV7(antagoniste), theme)
  ].filter(Boolean) : [];
  const assaillant = antagoniste ? poleF4P4V7('assaillant', antagoniste, theme) : null;
  const assaillantTenus = polesAssaillant.filter(function (p) { return p.tient; }).length;
  const assaillantSomme = Math.round(polesAssaillant.reduce(function (s, p) { return s + p.marge; }, 0) * 100) / 100;
  const assaillantDefensif = polesAssaillant.length >= 2
    ? Math.round((polesAssaillant[0].marge + polesAssaillant[1].marge) * 100) / 100 : 0;
  const tenus = poles.filter(function (p) { return p.tient; }).length;
  const sommeMarges = Math.round(poles.reduce(function (s, p) { return s + p.marge; }, 0) * 100) / 100;
  const sommeScores = Math.round(poles.reduce(function (s, p) { return s + p.score; }, 0) * 100) / 100;
  return {
    fig: fig, siege: siege,
    concordance: conc, alignement: align.nb,
    lignesCompatibles: align.actievesCompatibles,
    regeneration: regen,
    poles: poles, centrale: centrale,
    antagoniste: antagoniste, assaillant: assaillant,
    polesAssaillant: polesAssaillant, assaillantTenus: assaillantTenus,
    assaillantSomme: assaillantSomme, assaillantDefensif: assaillantDefensif,
    polesTenus: tenus, polesTotal: poles.length,
    sommeMarges: sommeMarges, sommeScores: sommeScores,
    // Le score global du camp : les quatre pôles, la centrale, et ce que
    // le siège régénère. Chaque terme est déjà dans la même unité
    // (concordance + 0,5 × alignement).
    total: Math.round((sommeMarges + centrale.marge + (regen ? regen.score : 0)) * 100) / 100,
    resume: (FL[fig] || fig) + ' en M' + siege + ' — concordance ' + conc
      + ', alignement ' + align.nb + ' · ' + tenus + '/' + poles.length + ' pôles tenus'
      + ' · centrale ' + (centrale.tient ? 'tient' : 'cède') + ' (' + centrale.marge + ')'
  };
}

// ═══════════════════════════════════════════════════════════════
// F4P4 — LA DÉMARCHE EN CINQ ÉTAPES (26/08/26, dictée par Ellemine_D
// après qu'il ait constaté que la version précédente ne pesait que deux
// pôles sur quatre : « d'abord la démarche d'analyse est mal exposée,
// corrige »).
//
// 1. Déterminer R1 et R7, et REGARDER LEUR BOUCLE.
//    · boucles DIFFÉRENTES → position d'opposition : le plus solide,
//      après examen de tout son réseau à quatre pôles, gagne.
//    · MÊME boucle → ce n'est plus leur solidité qui tranche mais le
//      réseau d'ancrage de leur ANTAGONISTE DIRECT : il désigne le plus
//      fragile, qui perd.
//    (Rappel mesuré : deux figures partagent la boucle dès que leurs
//    index ont la même parité — une fois sur deux.)
//
// 2. Les quatre pôles : front, front du front, bouclier (= protecteur),
//    binôme. Et une identité qu'Ellemine_D formule ainsi : « le binôme
//    de R1 est lui aussi le bouclier de la figure de front du front de
//    R1 » — exemple Puer / Caput Draconis, Caput étant l'antagoniste de
//    l'antagoniste de Fortuna Minor, elle-même front du front de Puer.
//    Vérifié 16/16 : bouclier(front²(X)) = X+8+10 = X+2 = binôme(X).
//    Les quatre pôles ne sont donc pas quatre satellites : ils se
//    referment l'un sur l'autre.
//
// 3. Chaque pôle est examiné avec LES CRITÈRES D'ANALYSE D'UNE FIGURE —
//    localisation, concordance, niveau d'alignement actif — et non par
//    sa seule présence.
//
// 4. Chaque pôle est LUI-MÊME une figure centrale avec ses quatre
//    pôles : c'est la solidité de ce second niveau qui renforce R1 ou R7.
//
// 5. La même analyse est menée sur l'antagoniste direct de R1 et de R7.
//
// VERDICT : celui qui a le plus de pôles solides gagne.
//
// Seuils explicites, à régler sur les cas réels.
// Seuils réglés le 26/08/26 sur la RÉSOLUTION, pas sur le score.
// Avec renfort 3 et ancrage 1, le compte de pôles solides se répartit
// presque uniformément sur 1111 thèmes — 20,4 % à 0 pôle, 22,7 % à 1,
// 20,7 % à 2, 18,6 % à 3, 17,6 % à 4 — contre 77,5 % concentrés sur
// 3 et 4 avant la correction. C'est le réglage qui donne au critère le
// plus de grain, indépendamment de ce qu'il prédit.
// ⚠️ L'ÉCHELLE A CHANGÉ le 26/08 : l'ancrage n'est plus « concordance +
// 0,5 × alignement » (0 à 3) mais le PROFIL AUX SEPT CRITÈRES, qui va
// d'environ −15 à +30. Les seuils sont refixés en conséquence.
// Seuil 12 : un pôle est solide si sa meilleure position vaut au moins
// 12 aux sept critères. Choisi sur un PLATEAU, pas sur un point — de 12
// à 15 et de renfort 1 à 4, le score reste 5/7, ce qui veut dire que le
// réglage ne tient pas à une valeur précise. En dessous de 12 il
// s'effrite (8 → 3 ou 4/7 selon le renfort).
var F4P4_SEUIL_ANCRAGE_V7 = 12;    // profil minimum aux sept critères
var F4P4_SEUIL_RENFORT_V7 = 2;     // sous-pôles au-dessus du seuil

// ─── CORRECTION DU 26/08 : L'ÉTAPE 4 COMPTE L'ANCRAGE ───
// Elle comptait la simple PRÉSENCE des sous-pôles. Sur le thème Inter,
// les DIX pôles des deux camps affichaient « réseau 4/4 » : le critère
// était mort. Sur seize maisons, presque toute figure est présente
// quelque part. Ellemine_D : « oui, compter leur ancrage. »
// Effet mesuré, et il est réel : la répartition du nombre de pôles
// solides passe de 77,5 % concentrés sur 3-4, à 20/23/21/19/18 % sur
// 0/1/2/3/4. Les comptes égaux entre R1 et R7 tombent de 42,9 % à
// 37,7 %. Le critère a retrouvé du grain.
//
// ⚠️⚠️ MAIS IL NE PRÉDIT TOUJOURS PAS, ET C'EST LE POINT DUR.
// Quinze réglages balayés. Quand on isole les cas où le COMPTE DE PÔLES
// tranche vraiment (par opposition aux départages), il a tort plus
// souvent qu'il n'a raison :
//     seuils 0,75/2 : il parle 7 fois sur 7 → juste 2 fois
//     seuils 0,5/2  : il parle 6 fois sur 7 → juste 2 fois
//     seuils 1,5/2  : il parle 6 fois sur 7 → juste 3 fois
//     seuils 1/4    : il parle 4 fois sur 7 → juste 4 fois, mais rate
//                     les 3 départages (total 4/7)
// La seule configuration parfaite quand elle parle ne parle que dans
// quatre cas, et quinze réglages ont été essayés : ce n'est pas un
// résultat.
// Le total le plus haut, 5/7 (seuils 2/4), l'obtient avec SIX égalités
// sur sept — autrement dit c'est le départage par l'ancrage total qui
// travaille, pas la doctrine.
//
// ⚠️ ÉTAT PRÉCÉDENT, CONSERVÉ POUR MÉMOIRE : avant la correction de
// l'étape 4, la démarche donnait 1/7 contre 5/7 pour la règle
// précédente. Autres faits alors mesurés, toujours valables :
//   · 384 encodages balayés (définition de « solide », seuils d'ancrage
//     de 0,5 à 3, renfort de 1 à 4, sens des deux branches). SIX
//     atteignent 5/7, aucun ne dépasse. Six sur 384, c'est ce que le
//     hasard produit.
//   · Les SIX exigent d'INVERSER la branche « même boucle » : elles font
//     gagner le camp dont l'assaillant est le PLUS solide, l'inverse de
//     ce qui est écrit. Je ne retourne pas une doctrine sur un résultat
//     à 1,6 % — c'est à Ellemine_D de dire si j'ai mal lu sa phrase.
//   · Cause probable, mesurée : LE COMPTE DE PÔLES SOLIDES SATURE.
//     Sur 1111 thèmes, 77,5 % des camps ont 3 ou 4 pôles solides sur 4,
//     et R1 et R7 ont le MÊME compte 42,9 % du temps. Presque un thème
//     sur deux, le critère ne dit rien et ce sont les départages qui
//     décident. Un critère à quatre valeurs dont deux concentrent les
//     trois quarts des cas ne peut pas porter un verdict.
//     (Pour mémoire : R1 et R7 partagent la boucle 49,1 % du temps, donc
//     la branche « même boucle » sert bien une fois sur deux.)
//
// ─── RÉSOLU LE 26/08 PAR LA CORRECTION DE LA MESURE ───
// La démarche en cinq étapes échouait parce que sa mesure était aveugle,
// pas parce qu'elle était fausse. Une fois les sept critères branchés
// (voir analyseFigureV7), elle atteint 5/7 sur un PLATEAU de seuils —
// 12 à 15, renfort 1 à 4 — et prend donc le volant.
// Tableau des quatre combinaisons, mesuré :
//     mesure brut   + duel4        5/7   (rate Inter et Atalanta)
//     mesure brut   + cinq étapes  3/7
//     mesure profil + duel4        3/7   ← duel4 ne supporte pas
//                                          le changement d'échelle
//     mesure profil + cinq étapes  5/7   (rate Inter et Napoli)  ← retenu
// Les deux à 5/7 ratent des cas DIFFÉRENTS. Le couple retenu l'est parce
// qu'il est le seul à la fois juste sur la mesure (les sept critères) et
// fidèle à la démarche dictée par Ellemine_D, à score égal.
var F4P4_DEMARCHE_V7 = 'cinq_etapes';

// Étape 3 — les critères d'analyse d'une figure, appliqués partout.
//
// ⚠️ CORRECTION DU 26/08/26, sur constat d'Ellemine_D : « tu n'es pas
// rigoureux… Carcer est dans sa propre maison, tu ne peux pas le voir ».
// Il avait raison, et le défaut était grave : cette fonction ne pesait
// que DEUX critères sur sept — concordance et alignement actif. Le
// déplacement (chez soi +15, maison alliée +8, ennemie −8), la
// multiplicité, l'environnement, la cohabitation et la maison natale ne
// comptaient pour RIEN.
// Effet mesuré sur son exemple : Carcer en M10, dans sa propre maison,
// valait 17,38 aux sept critères (dont +15 pour le seul « chez elle »)
// et 0,5 ici. Le pôle le plus fort de R1 était classé « mal ancré ».
// profilFigureMaison porte les sept critères depuis toujours ; il
// suffisait de l'appeler. C'est fait.
function analyseFigureV7(fig, theme) {
  if (!fig) return null;
  const occ = trouverFigV7(fig, theme) || [];
  let conc = 0, align = 0, base = 0, profilSomme = 0, meilleur = null;
  const positions = occ.map(function (o) {
    const c = concordanceElement(ELEMENTS_V7[fig], MAISON_ELEM_V7[o.pos]);
    const a = alignementActifV7(fig, o.pos);
    conc += c; align += a.nb; if (!o.hidden) base++;
    let pr = null;
    try { pr = profilFigureMaison(fig, o.pos, theme); } catch (e) { pr = null; }
    if (pr) {
      profilSomme += pr.total;
      if (!meilleur || pr.total > meilleur.total) meilleur = pr;
    }
    return { pos: o.pos, resultante: !!o.hidden, conc: c, align: a.nb,
      profil: pr ? Math.round(pr.total * 100) / 100 : null,
      deplacement: pr ? pr.deplacement : null };
  });
  return {
    fig: fig, present: occ.length > 0, occ: occ.length, base: base,
    conc: Math.round(conc * 100) / 100, align: align,
    // ancien ancrage, conservé pour comparaison
    ancrage2: Math.round((conc + align * POIDS_ALIGNEMENT_CAMP_V7) * 100) / 100,
    // les SEPT critères : meilleure position, et somme sur toutes
    profil: meilleur ? Math.round(meilleur.total * 100) / 100 : 0,
    profilSomme: Math.round(profilSomme * 100) / 100,
    meilleure: meilleur ? meilleur.house : null,
    deplacement: meilleur ? meilleur.deplacement : null,
    // ancrage = la mesure retenue, désormais celle des sept critères
    ancrage: meilleur ? Math.round(meilleur.total * 100) / 100 : 0,
    positions: positions
  };
}

// Étape 4 — un pôle est lui-même une centrale à quatre pôles.
// Le second niveau ne se re-développe pas (sinon la récursion n'a pas de
// fin) : on y compte simplement les pôles PRÉSENTS, c'est le « renfort ».
function polesDeV7(fig) {
  return fig ? [BOUCLIER_V7[fig], FRONT_V7[fig], BINOMES_V7[fig], frontDuFrontV7(fig)] : [];
}

function solidPoleV7(role, fig, theme) {
  if (!fig) return null;
  const a = analyseFigureV7(fig, theme);
  const sous = polesDeV7(fig).map(function (g) { return analyseFigureV7(g, theme); });
  const renfortPresence = sous.filter(function (x) { return x && x.present; }).length;
  // ─── CORRECTION DU 26/08/26, sur constat d'Ellemine_D ───
  // L'étape 4 comptait la simple PRÉSENCE des sous-pôles. Mesuré sur le
  // thème Inter : « réseau 4/4 » pour les DIX pôles des deux camps —
  // le critère ne discriminait rien. Sur un thème de seize maisons,
  // presque toute figure est présente quelque part.
  // Ellemine_D : « oui, compter leur ancrage ». Le renfort compte
  // désormais les sous-pôles qui TIENNENT LEUR PLACE — concordance +
  // 0,5 × alignement au-dessus du seuil — et non ceux qui figurent.
  const renfort = sous.filter(function (x) { return x && x.ancrage >= F4P4_SEUIL_ANCRAGE_V7; }).length;
  const renfortAncre = renfort;
  // Un pôle est SOLIDE s'il est là, s'il tient sa place (critères
  // d'analyse), et si son propre réseau le porte (étape 4).
  const solide = a.present && a.ancrage >= F4P4_SEUIL_ANCRAGE_V7 && renfort >= F4P4_SEUIL_RENFORT_V7;
  return {
    role: role, fig: fig, present: a.present, occ: a.occ, base: a.base,
    conc: a.conc, align: a.align, ancrage: a.ancrage, positions: a.positions,
    sousPoles: [
      { role: 'bouclier', fig: BOUCLIER_V7[fig], a: sous[0] },
      { role: 'front', fig: FRONT_V7[fig], a: sous[1] },
      { role: 'binôme', fig: BINOMES_V7[fig], a: sous[2] },
      { role: 'front du front', fig: frontDuFrontV7(fig), a: sous[3] }
    ],
    renfort: renfort, renfortAncre: renfortAncre,
    renfortPresence: renfortPresence, solide: solide,
    motif: !a.present ? 'absente du thème'
      : a.ancrage < F4P4_SEUIL_ANCRAGE_V7 ? 'présente mais mal ancrée (' + a.ancrage + ')'
      : renfort < F4P4_SEUIL_RENFORT_V7 ? 'ancrée mais son réseau ne suit pas ('
          + renfort + '/4 ancrés, ' + renfortPresence + '/4 présents)'
      : 'solide — ancrage ' + a.ancrage + ', réseau ' + renfort + '/4'
  };
}

// ─── LA FRAPPE (26/08/26) — le sens OFFENSIF, branché sur demande ───
// Jusqu'ici F4P4 ne lisait que la défense : chaque pôle contre celui qui
// l'attaque. Il manquait l'autre sens, celui de la chaîne qu'Ellemine_D
// a déroulée sur Puella·Via·Conjunctio·Via : Carcer, 4e pôle de R1 et
// CHEZ ELLE en M10, frappe Cauda Draconis — qui est le 4e pôle de R7.
// Un pôle ne fait pas que résister : il attaque, et ce qu'il atteint
// compte, surtout si c'est un pôle d'en face.
//
// victime(X) = la figure dont X est l'antagoniste, soit X+3.
// La frappe est EFFECTIVE si la cible appartient au camp adverse ; elle
// PORTE si le profil de l'attaquant dépasse celui de la cible à sa
// meilleure position. Les deux se mesurent aux sept critères.
function victimeV7(fig) {
  if (!fig) return null;
  const i = FIGS_V7.indexOf(fig);
  return i < 0 ? null : FIGS_V7[(i + 3) % 16];
}

// ═══════════════════════════════════════════════════════════════
// LA DUALITÉ DES CAMPS — la loi qu'Ellemine_D m'a demandé d'INSISTER.
//
// « chaque figure devant une figure est une figure de front. Laetitia est
// la figure de front de Puella. Conséquence : Laetitia est la figure de
// front du figure de front de Carcer, et LE BINÔME DE LA FIGURE DE FRONT
// DU FIGURE DE FRONT EST LE PROTECTEUR. » (28/08/26)
//
// VÉRIFIÉ SUR LES SEIZE FIGURES, SANS EXCEPTION :
//     binôme( front du front (X) )      = protecteur(X)     16/16
//     protecteur( front du front (X) )  = binôme(X)         16/16
//     front( front (X) )                = front du front(X) 16/16
// Les deux premières sont la MÊME loi lue des deux sens — front² = +8,
// binôme = +2, protecteur = +10 : +8+2 = +10, et +8+10 = +18 = +2 (mod 16).
// Sur Carcer : front(Carcer) = Puella, front(Puella) = Laetitia,
// binôme(Laetitia) = Albus = protecteur(Carcer). Exactement ce qu'il dit.
//
// ET CE QUE ÇA ENTRAÎNE — LA LOI QUE J'AI TROUVÉE EN LA VÉRIFIANT.
// Le camp d'une figure frappe le camp de sa victime RÔLE POUR RÔLE :
//     centrale → centrale · protecteur → protecteur · front → front
//     binôme → binôme · front du front → front du front
// 80 correspondances sur 80. Démonstration : victime = +3 et le camp est
// {X, X+10, X+4, X+2, X+8} ; ajouter 3 à chaque membre donne exactement
// le camp de X+3. Le décalage est le même pour les cinq rôles.
// Sur l'exemple d'Ellemine_D : Carcer → Cauda, Albus → Rubeus,
// Puella → Puer (« Puella neutralise la figure de front de Cauda »),
// Fortuna Major → Acquisitio, Laetitia → Via. Les cinq membres de la
// boucle B tombent sur les cinq membres de la boucle A, dans l'ordre.
//
// C'est le fondement de la dualité R1/R7 : deux camps ne se rencontrent
// jamais en désordre, ils s'affrontent poste par poste. Ce qui les
// départage n'est donc pas QUI frappe QUI — c'est fixé — mais les
// critères d'analyse de chaque figure à sa place.
var ROLES_CAMP_V7 = ['centrale', 'protecteur', 'front', 'binôme', 'front du front'];
// Les décalages des cinq rôles à l'intérieur d'un camp : +0, +10, +4, +2, +8.
// Tous PAIRS — c'est pourquoi un camp tient entièrement dans une boucle.
var OFFSETS_CAMP_V7 = [0, 10, 4, 2, 8];

// ═══════════════════════════════════════════════════════════════
// LE DÉCALAGE OBLIQUE — vérifié sur l'archive le 28/08/26.
//
// Le duel canonique (R7 = victime de R1) n'arrive que sur 13,3 % des
// thèmes. Partout ailleurs les deux camps s'engagent EN OBLIQUE, et la
// figure de cet engagement ne dépend que d'UNE grandeur : k, l'écart de
// position entre les deux centrales sur le cycle de 16.
//
// LA TABLE COMPLÈTE DES SEIZE DÉCALAGES (frappes de R1 atteignant le
// camp de R7, sur 5) :
//     k=0  0/5     k=1  3/5     k=2  0/5     k=3  5/5  ⚔ canonique
//     k=4  0/5     k=5  3/5     k=6  0/5     k=7  2/5
//     k=8  0/5     k=9  3/5     k=10 0/5     k=11 4/5
//     k=12 0/5     k=13 3/5  ⚔  k=14 0/5     k=15 2/5
//
// ⭐ TOUS LES k PAIRS DONNENT 0/5. Aucun des deux camps ne peut toucher
// l'autre. La raison est mécanique : les cinq rôles sont à des décalages
// PAIRS, donc un camp tient dans une seule boucle ; la victime est à +3,
// impair, donc elle tombe TOUJOURS dans l'autre boucle. Si k est pair,
// R1 et R7 sont dans la même boucle, et aucune frappe ne peut atteindre
// le camp d'en face.
// C'est la démonstration mécanique de l'étape 1 de F4P4 : « même boucle
// → ce sont les antagonistes directs qui tranchent ». Ils tranchent
// parce que les camps eux-mêmes ne se touchent pas.
//
// ⚠️ ET LA TABLE EST ASYMÉTRIQUE. À k donné, un camp frappe plus que
// l'autre : k=3 → 5 contre 3 · k=1 → 3 contre 2 · k=11 → 4 contre 3.
// R1 a l'avantage de décalage pour k ∈ {1,3,9,11}, R7 pour k ∈ {5,7,13,15}.
//
// SUR L'ARCHIVE : cinq cas à k impair, et TOUS ont k ∈ {1,3,9} — c'est-
// à-dire que l'avantage de décalage y est TOUJOURS du côté de R1. Aucun
// cas où R7 l'a. « Celui qui touche le plus gagne » y fait donc 2/5, et
// cette mesure ne teste qu'une seule direction.
//
// ⭐ L'ANGLE MORT, CHIFFRÉ (28/08/26, recherche demandée par Ellemine_D).
// Sur les 65 536 thèmes possibles, les deux sens sont EXACTEMENT
// équilibrés : 16 384 thèmes donnent l'avantage à R1 (k ∈ {1,3,9,11}) et
// 16 384 à R7 (k ∈ {5,7,13,15}) — 25 % du total chacun. Le décalage
// inversé n'a donc rien de rare : c'est un thème sur quatre.
// Que les cinq cas impairs de l'archive tombent tous du même côté a
// (1/2)^5 = 3,1 % de chances. C'est un accident d'échantillonnage, pas
// une propriété du système — et il rend la règle du décalage
// INVÉRIFIABLE en l'état.
//
// LES THÈMES QUI TRANCHERAIENT. Sur un échantillon de 2 343 thèmes à
// décalage inversé, le verdict affiché contredit le décalage dans 54 %
// des cas. Exemples repérés — si l'un se présente en match réel, son
// résultat règle la question à lui seul :
//     Puer · Puer · Puer · Puer                    k=15  système M1
//     Puer · Puer · Laetitia · Amissio             k=7   système M1
//     Puer · Puer · Rubeus · Caput Draconis        k=7   système M1
// Et pour mémoire un cas d'accord (k=13, le duel canonique inversé, où
// R7 frappe R1 rôle pour rôle) :
//     Laetitia · Rubeus · Puer · Albus             k=13  système M7
function decalageCampsV7(figR1, figR7) {
  if (!figR1 || !figR7) return null;
  var i1 = FIGS_V7.indexOf(figR1), i7 = FIGS_V7.indexOf(figR7);
  if (i1 < 0 || i7 < 0) return null;
  var k = ((i7 - i1) % 16 + 16) % 16;
  function liaisons(sens) {
    var out = [];
    OFFSETS_CAMP_V7.forEach(function (o, i) {
      var rel = ((o + 3 - sens * k) % 16 + 16) % 16;
      var j = OFFSETS_CAMP_V7.indexOf(rel);
      if (j >= 0) out.push({ de: ROLES_CAMP_V7[i], vers: ROLES_CAMP_V7[j] });
    });
    return out;
  }
  var lR1 = liaisons(1), lR7 = liaisons(-1);
  var memeBoucle = (k % 2 === 0);
  return {
    k: k, memeBoucle: memeBoucle,
    canonique: k === 3 ? 'R1' : k === 13 ? 'R7' : null,
    liaisonsR1: lR1, liaisonsR7: lR7,
    toucheR1: lR1.length, toucheR7: lR7.length,
    avantage: lR1.length > lR7.length ? 'R1' : lR7.length > lR1.length ? 'R7' : null,
    resume: memeBoucle
      ? (function () {
          var c = contaminationCampsV7(figR1, figR7);
          return 'décalage k=' + k + ' (pair) — même boucle : AUCUN des deux camps ne peut toucher l\'autre'
            + (c && c.roleR7DansR1 ? ' · ⚠ R7 EST le ' + c.roleR7DansR1 + ' de R1' : '')
            + (c && c.roleR1DansR7 ? ' · ⚠ R1 EST le ' + c.roleR1DansR7 + ' de R7' : '')
            + (c ? ' · ' + c.partages.length + '/5 rôles partagés' : '');
        })()
      : 'décalage k=' + k + ' — R1 atteint ' + lR1.length + '/5 du camp adverse, R7 ' + lR7.length + '/5'
        + (k === 3 ? ' · DUEL CANONIQUE, R1 frappe R7 rôle pour rôle'
          : k === 13 ? ' · DUEL CANONIQUE, R7 frappe R1 rôle pour rôle' : '')
  };
}

function campDeV7(fig) {
  if (!fig) return [];
  return [fig, BOUCLIER_V7[fig], FRONT_V7[fig], BINOMES_V7[fig], frontDuFrontV7(fig)];
}

// ═══════════════════════════════════════════════════════════════
// LES DEUX QUATUORS D'UNE BOUCLE, ET LA FAILLE QU'ILS RÉVÈLENT
// (28/08/26, observation d'Ellemine_D)
//
// Son constat, vérifié 16/16 : « une figure avec son binôme crée des
// fronts différents dans la même boucle ». Le quatuor de front de X est
// {X, X+4, X+8, X+12} ; celui de son binôme est {X+2, X+6, X+10, X+14} ;
// les deux sont ENTIÈREMENT DISJOINTS. Une boucle de 8 se coupe donc en
// deux quatuors de 4, et ces quatuors sont les familles d'élément des
// maisons de repos.
//     boucle A : Puer→Via→Fortuna Minor→Cauda  |  Caput→Rubeus→Conjonctio→Acquisitio
//     boucle B : Laetitia→Amissio→Carcer→Puella |  Albus→Tristitia→Fortuna Major→Populus
//
// CONSÉQUENCE SUR LE CAMP : trois rôles (la centrale, le front, le front
// du front) sont dans le quatuor de la centrale ; les deux autres (le
// binôme et le bouclier) sont dans l'AUTRE quatuor. Un camp n'est donc
// pas homogène — 16/16.
//
// ⚠️ ET VOICI LA FAILLE. Quand R1 et R7 sont dans la même boucle — la
// moitié des thèmes — l'un est TOUJOURS un rôle du camp de l'autre :
//     k= 0 : la même figure des deux côtés (5/5 rôles partagés)
//     k= 2 : R7 est le BINÔME de R1        k=10 : R7 est son BOUCLIER
//     k= 4 : R7 est son FRONT              k= 8 : R7 est son FRONT DU FRONT
//     k= 6 : R1 est le bouclier de R7      k=12 : R1 est son front
//     k=14 : R1 est son binôme
// Aucune exception : 8 valeurs paires sur 8. Les moteurs qui comparent
// « le camp de R1 » à « le camp de R7 » comptent alors la centrale
// ADVERSE parmi les forces de l'un des deux.
//
// MESURÉ (3 856 thèmes, 1 sur 17) :
//   R7 compte parmi les 4 pôles de R1 ......... 24,5 %  (et l'inverse 24,0 %)
//   il y est compté SOLIDE ..................... 12,6 %  (et l'inverse 12,7 %)
//   exclure la centrale adverse du décompte fait changer le verdict F4P4
//   sur 3,8 % des thèmes — 7,4 % des thèmes à même boucle.
//
// ⚠️ MAIS LA CORRECTION NAÏVE COÛTE UN POINT : sur les dix cas réels,
// F4P4 passe de 6/10 à 5/10 (Juventus bascule du juste au faux, et c'est
// le seul cas qui change). Un cas, ce n'est pas une mesure. La lecture
// corrigée siège donc au banc, à côté de l'originale, au lieu de la
// remplacer en silence — et la faille est signalée à l'écran.
function contaminationCampsV7(figR1, figR7) {
  if (!figR1 || !figR7) return null;
  var i1 = FIGS_V7.indexOf(figR1), i7 = FIGS_V7.indexOf(figR7);
  if (i1 < 0 || i7 < 0) return null;
  var k = ((i7 - i1) % 16 + 16) % 16;
  var c1 = campDeV7(figR1), c7 = campDeV7(figR7);
  var iDansR1 = c1.indexOf(figR7), iDansR7 = c7.indexOf(figR1);
  var quatuor = function (f) {
    var i = FIGS_V7.indexOf(f);
    return [0, 4, 8, 12].map(function (d) { return FIGS_V7[(i + d) % 16]; });
  };
  return {
    k: k, memeBoucle: (k % 2 === 0),
    memeQuatuor: quatuor(figR1).indexOf(figR7) >= 0,
    partages: c1.filter(function (x) { return c7.indexOf(x) >= 0; }),
    roleR7DansR1: iDansR1 >= 0 ? ROLES_CAMP_V7[iDansR1] : null,
    roleR1DansR7: iDansR7 >= 0 ? ROLES_CAMP_V7[iDansR7] : null,
    contamine: iDansR1 >= 0 || iDansR7 >= 0
  };
}

// L'ANCIENNE lecture : la centrale adverse compte encore parmi les pôles.
// Banc uniquement — elle mesure l'effet exact de la règle du 28/08.
function moteurF4P4AvecAdverseV7(theme) {
  var m = null;
  try { m = moteurF4P4V7(theme); } catch (e) { m = null; }
  if (!m || !m.applicable) return { camp: null, detail: 'non applicable' };
  var s1 = m.R1.poles.filter(function (p) { return p.solide; }).length;
  var s7 = m.R7.poles.filter(function (p) { return p.solide; }).length;
  var a1 = m.R1.ancrageTotalAvecAdverse, a7 = m.R7.ancrageTotalAvecAdverse;
  var dit = function (c, pourquoi) { return { camp: c, detail: pourquoi + ' · pôles solides, rival compris, ' + s1 + ' contre ' + s7 }; };
  if (!m.memeBoucle) {
    if (s1 !== s7) return dit(s1 > s7 ? 'R1' : 'R7', 'boucles opposées');
    if (m.R1.frappeMoyenne !== m.R7.frappeMoyenne) return dit(m.R1.frappeMoyenne > m.R7.frappeMoyenne ? 'R1' : 'R7', 'boucles opposées, départage frappe');
    if (a1 !== a7) return dit(a1 > a7 ? 'R1' : 'R7', 'boucles opposées, départage ancrage');
    return dit(null, 'boucles opposées, égalité');
  }
  if (m.R1.solidesAdverse !== m.R7.solidesAdverse) return dit(m.R1.solidesAdverse < m.R7.solidesAdverse ? 'R1' : 'R7', 'même boucle, assaillants');
  if (s1 !== s7) return dit(s1 > s7 ? 'R1' : 'R7', 'même boucle');
  if (a1 !== a7) return dit(a1 > a7 ? 'R1' : 'R7', 'même boucle, départage ancrage');
  return dit(null, 'même boucle, égalité');
}

// Le rôle qu'occupe `cible` dans le camp de `centraleAdverse`, ou null.
function roleDansCampV7(cible, centraleAdverse) {
  var c = campDeV7(centraleAdverse);
  var i = c.indexOf(cible);
  return i >= 0 ? ROLES_CAMP_V7[i] : null;
}

function frappeV7(fig, campAdverse, theme, centraleAdverse) {
  if (!fig) return null;
  const cible = victimeV7(fig);
  const a = analyseFigureV7(fig, theme);
  const c = analyseFigureV7(cible, theme);
  const viseCamp = campAdverse.indexOf(cible) >= 0;
  const marge = Math.round(((a ? a.profil : 0) - (c ? c.profil : 0)) * 100) / 100;
  return {
    fig: fig, cible: cible, viseCamp: viseCamp,
    profilAttaquant: a ? a.profil : 0, profilCible: c ? c.profil : 0,
    cibleAbsente: !(c && c.present),
    marge: marge,
    // une frappe ne compte que si elle touche le camp d'en face ET qu'elle
    // l'emporte sur ce qu'elle vise
    effective: viseCamp && marge > 0,
    // Le rôle touché en face. Par la loi de dualité, une centrale frappe
    // une centrale, un front un front, etc. — l'afficher rend la doctrine
    // lisible au lieu de la laisser implicite.
    roleCible: roleDansCampV7(cible, centraleAdverse),
    resume: (FL[fig] || fig) + ' frappe ' + (FL[cible] || cible)
      + (viseCamp
          ? ' — ' + (roleDansCampV7(cible, centraleAdverse) || 'pôle') + ' adverse'
          : ' — hors camp')
      + ' · ' + (a ? a.profil : 0) + ' contre ' + (c ? c.profil : 0)
      + (marge > 0 ? ' → PORTE' : ' → repoussée')
  };
}

// Étapes 2 à 5 pour un camp.
// figAdverse = la centrale D'EN FACE. Sans elle, la frappe se comparait
// au camp de l'antagoniste et non au camp adverse : Carcer frappant
// Cauda Draconis — le 4e pôle de R7 — était rangée « hors camp ».
// COUPÉE le 28/08/26, sur décision d'Ellemine_D et sur la mesure : le
// seul cas qu'elle coûtait, Juventus 6-1, est un score large — la seule
// catégorie où le système est fiable (4/4 sans elle, 3/4 avec). La règle
// reste entière dans le code et mesurable au banc ; il suffit de remettre
// true pour la rebrancher si les prochains matchs la soutiennent.
var REGLE_CENTRALE_ADVERSE_V7 = false;

function reseauF4P4V7(fig, siege, theme, figAdverse) {
  if (!fig) return null;
  const centrale = solidPoleV7('centrale', fig, theme);
  const poles = [
    solidPoleV7('bouclier', BOUCLIER_V7[fig], theme),
    solidPoleV7('front', FRONT_V7[fig], theme),
    solidPoleV7('binôme', BINOMES_V7[fig], theme),
    solidPoleV7('front du front', frontDuFrontV7(fig), theme)
  ].filter(Boolean);
  const antagoniste = ANTAGONISTES_V7[fig];
  const adverse = antagoniste ? {
    centrale: solidPoleV7('assaillant', antagoniste, theme),
    poles: [
      solidPoleV7('bouclier', BOUCLIER_V7[antagoniste], theme),
      solidPoleV7('front', FRONT_V7[antagoniste], theme),
      solidPoleV7('binôme', BINOMES_V7[antagoniste], theme),
      solidPoleV7('front du front', frontDuFrontV7(antagoniste), theme)
    ].filter(Boolean)
  } : null;
// ═══════════════════════════════════════════════════════════════
// CE QUE LE SYSTÈME SAIT FAIRE, ET CE QU'IL NE SAIT PAS (28/08/26)
// Constat d'Ellemine_D : « les matchs serrés sont souvent faussés par le
// système ; juste les matchs de score large qu'il trouve le plus
// souvent ». Vérifié sur les cas de l'archive dont le score réel est
// connu, verdict affiché contre vainqueur réel :
//
//     écart réel ≥ 2 buts .......... 4/5   ( 80 %)   [4/4 avant City/Madrid]
//     écart réel = 1 but ........... 3/7   ( 43 %)
// ⚠️ MIS À JOUR le 28/08 au soir : City/Madrid, annoncé R7 0-2 à
// l'unanimité, réel 7-4 pour R1 — un score LARGE et un verdict FAUX. La
// catégorie fiable ne l'est donc plus absolument.
// ⚠️ ET LA PISTE « E-SPORT » EST MORTE AUSSI VITE QU'ELLE EST NÉE : je
// l'avais signalée le soir même (0/2, contre 8/12 hors e-sport) comme le
// découpage le plus net. Le cas suivant, PuerCaput, est e-sport et JUSTE.
// 1/3 : il n'y avait rien, seulement trois cas et du bruit. À
// resurveiller vers une dizaine de cas e-sport, pas avant.
//
// Le constat tient. Mais il ne se transforme PAS en outil, et c'est le
// point à retenir : l'écart réel n'est connu qu'après le match. Le seul
// écart disponible avant, c'est celui que le système annonce — et lui ne
// discrimine presque rien :
//     marge annoncée ≥ 3 buts ...... 6/9   (67 %)
//     marge annoncée = 2 buts ...... 2/3
//     marge annoncée ≤ 1 but ....... 0/1
// Et surtout, la marge annoncée ne dit RIEN de la marge réelle :
// corrélation r = 0,05 sur les douze matchs au score connu. Quand le
// système annonce trois buts d'écart ou plus, le match est réellement
// large 3 fois sur 8 — la base est de 4 sur 12. Aucun gain.
// D'autant que le système annonce presque toujours un score large : une
// seule prédiction sur quatorze est à un but ou moins. Il ne sait donc
// pas dire lui-même s'il est dans un cas où il est bon.
//
// Conclusion honnête, à ne pas maquiller : le verdict est fiable quand le
// match se joue à deux buts ou plus — et il n'existe aujourd'hui aucun
// moyen de savoir à l'avance que ce sera le cas. La piste utile n'est pas
// un indice de confiance, c'est un détecteur de MATCH SERRÉ ; tant qu'il
// n'existe pas, un verdict sur match serré vaut une pièce lancée (2/6).
// ═══════════════════════════════════════════════════════════════

// ─── DÉTECTEUR DE MATCH SERRÉ : CHERCHÉ, PAS TROUVÉ (28/08/26) ───
// Suite du constat ci-dessus. Si le verdict ne vaut que sur les scores
// larges, la seule chose utile serait de reconnaître un match serré AVANT
// de parier. Dix-huit candidats ont été testés sur les onze cas au score
// connu — 7 serrés (≤ 1 but) contre 4 larges — avec, à chaque fois, la
// fréquence de base du signal sur les thèmes possibles :
//
//   candidat                                    serrés  larges  base
//   même boucle (k pair) ....................... 2/7     3/4    48 %
//   la centrale adverse est dans le camp ....... 2/7     3/4    48 %
//   pôles solides à égalité (F4P4) ............. 2/7     3/4    42 %
//   les deux assaillants présents .............. 6/7     4/4    76 %
//   Populus en M15 ou M16 ...................... 3/7     0/4    19 %
//   écart d'ancrage F4P4 < 10 .................. 2/7     0/4    25 %
//   même quatuor de front (k ≡ 0 mod 4) ........ 0/7     2/4    20 %
//   duel canonique · témoins M13=M14 · nul
//   structurel · même élément R1/R7 · vote
//   serré · BTTS annoncé · mi-temps « les deux »
//   · marge annoncée ≤ 2 · assaillants absents .. tous entre 0/7 et 3/7,
//                                                 et entre 0/4 et 1/4
//
// AUCUN NE SÉPARE. Le meilleur, « Populus en M15/M16 », rate quatre
// serrés sur sept ; et avec dix-huit candidats sur onze cas, un écart de
// cette taille est exactement ce que le hasard produit. Deux signaux vont
// même dans le sens INVERSE de l'intuition — même boucle et même quatuor
// de front sont plus fréquents sur les matchs LARGES que sur les serrés.
//
// Résultat négatif, écrit ici pour qu'on ne recommence pas cette
// recherche à l'identique : avec sept matchs serrés, il n'y a rien à
// trouver. Ce qu'il faut, ce sont des résultats, pas un autre critère.
// ═══════════════════════════════════════════════════════════════

// ─── L'INTERRUPTEUR DE LA RÈGLE (28/08/26) ───
// La règle ci-dessous change le verdict affiché sur 3,8 % des thèmes et
// COÛTE un point sur l'archive (6/10 → 5/10, seul Juventus bascule).
// Elle est branchée parce que la structure la commande, pas parce
// qu'elle prédit mieux — et un cas sur dix ne tranche ni dans un sens ni
// dans l'autre. Ce drapeau permet de revenir en arrière d'un caractère
// et de comparer les deux lectures quand il y aura plus de résultats.
// ⚠️ ET LE CAS QU'ELLE COÛTE EST JUSTEMENT UN SCORE LARGE : Juventus 6-1.
// Sans la règle, le système est à 4/4 sur les matchs à deux buts d'écart
// ou plus ; avec, il tombe à 3/4. La règle a donc entamé la SEULE
// catégorie où le système était fiable — c'est le meilleur argument
// contre elle à ce jour.
// ─── RÈGLE DU 28/08/26 : UN CAMP NE COMPTE PAS SON RIVAL PARMI SES FORCES ───
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
  poles.forEach(function (p) {
    p.estAdverse = !!(REGLE_CENTRALE_ADVERSE_V7 && figAdverse && p.fig === figAdverse);
    p.estCentraleAdverse = !!(figAdverse && p.fig === figAdverse);
  });
  const polesAdverses = poles.filter(function (p) { return p.estAdverse; }).length;
  const solides = poles.filter(function (p) { return p.solide && !p.estAdverse; }).length;
  const solidesAdverse = adverse ? adverse.poles.filter(function (p) { return p.solide; }).length : 0;
  // Le sens offensif : ce que chacun de mes cinq membres frappe.
  const campAdv = campDeV7(figAdverse);
  const frappes = [centrale].concat(poles).map(function (p) {
    const f = frappeV7(p.fig, campAdv, theme, figAdverse);
    if (f) f.role = p.role;
    return f;
  }).filter(Boolean);
  const frappesEffectives = frappes.filter(function (f) { return f.effective; }).length;
  const frappesSurCamp = frappes.filter(function (f) { return f.viseCamp; }).length;
  const frappeSomme = Math.round(frappes.filter(function (f) { return f.viseCamp; })
    .reduce(function (s2, f) { return s2 + f.marge; }, 0) * 100) / 100;
  // ─── CORRECTION DU 28/08/26 : LA SOMME COMPARAIT DES OPPORTUNITÉS INÉGALES ───
  // Le nombre de frappes qu'un camp PEUT porter ne dépend pas de sa force :
  // il est fixé par le décalage k entre les deux centrales (table des 16
  // décalages, cf. decalageCampsV7). À k=3 un camp peut atteindre 5 pôles
  // adverses et l'autre 3 ; à k=1, 3 contre 2.
  // Mesuré : sur les 108 thèmes où la frappe départage, les deux camps ont
  // un nombre de frappes autorisées DIFFÉRENT dans 100 % des cas. Comparer
  // les sommes brutes revenait donc à récompenser le camp que le décalage
  // avantage, pas celui qui frappe le mieux.
  // frappeMoyenne divise par le nombre de frappes possibles.
  // ⚠️ Effet : 4 renversements sur 108 thèmes concernés (4 %), et ZÉRO sur
  // l'archive — aucun de ses cas n'est départagé par la frappe. C'est donc
  // une correction de DOCTRINE, invérifiable sur le banc en l'état. Elle est
  // faite parce que la comparaison était fausse, pas parce qu'elle prédit
  // mieux.
  const frappesPossibles = frappes.filter(function (f) { return f.viseCamp; }).length;
  const frappeMoyenne = frappesPossibles
    ? Math.round(frappeSomme / frappesPossibles * 100) / 100 : 0;
  return {
    fig: fig, siege: siege, boucle: loopOf(fig),
    concordance: concordanceElement(ELEMENTS_V7[fig], MAISON_ELEM_V7[siege]),
    alignement: alignementActifV7(fig, siege).nb,
    // ─── CORRECTIF DU 27/08/26 — LE PANNEAU F4P4 NE S'AFFICHAIT JAMAIS ───
    // renderF4P4Panel lit c.lignesCompatibles. campF4P4V7 le fournissait,
    // reseauF4P4V7 — le chemin des cinq étapes, celui qui pilote le
    // verdict depuis le 26/08 — ne le fournissait pas. Le panneau levait
    // donc « Cannot read properties of undefined » sur 311 thèmes sur
    // 311, soit 100 % : le moteur principal n'avait aucun affichage.
    // Trouvé par le soak, jamais visible autrement — le rendu est
    // enveloppé d'un try/catch qui écrivait dans la console.
    lignesCompatibles: alignementActifV7(fig, siege).actievesCompatibles,
    regeneration: regenerationSiegeV7(fig, siege),
    centrale: centrale, poles: poles,
    antagoniste: antagoniste, adverse: adverse,
    frappes: frappes, frappesEffectives: frappesEffectives,
    frappesSurCamp: frappesSurCamp, frappeSomme: frappeSomme,
    frappesPossibles: frappesPossibles, frappeMoyenne: frappeMoyenne,
    solides: solides, solidesAdverse: solidesAdverse,
    polesAdverses: polesAdverses,
    // la centrale compte comme cinquième appui, elle n'est plus ignorée
    solidesAvecCentrale: solides + (centrale && centrale.solide ? 1 : 0),
    ancrageTotal: Math.round((poles.reduce(function (s, p) {
        return s + (p.estAdverse ? 0 : p.ancrage); }, 0)
      + (centrale ? centrale.ancrage : 0)) * 100) / 100,
    // L'ancrage d'avant la règle, gardé pour que le banc puisse rejouer
    // l'ancienne lecture à l'identique.
    ancrageTotalAvecAdverse: Math.round((poles.reduce(function (s, p) {
        return s + p.ancrage; }, 0) + (centrale ? centrale.ancrage : 0)) * 100) / 100
  };
}

function moteurF4P4V7(theme) {
  return memoParThemeV7('f4p4', theme, function () {
    return moteurF4P4V7Brut(theme);
  });
}

function moteurF4P4V7Brut(theme) {
  if (!theme || !theme[1]) return { applicable: false, raison: 'Thème non disponible.' };
  const rot = getRotationCombat(theme);
  if (!rot || !rot.figR1 || !rot.figR7) return { applicable: false, raison: 'Rotation non applicable.' };

  // ÉTAPE 1 — la boucle décide de la LECTURE, avant tout chiffre.
  const memeBoucle = loopOf(rot.figR1) === loopOf(rot.figR7);

  // ÉTAPES 2 à 5 — les deux réseaux complets.
  const R1 = reseauF4P4V7(rot.figR1, rot.hR1, theme, rot.figR7);
  const R7 = reseauF4P4V7(rot.figR7, rot.hR7, theme, rot.figR1);

  // Ancienne clé, conservée tant que la démarche en cinq étapes n'est pas
  // comprise (voir le bloc d'avertissement sur F4P4_DEMARCHE_V7).
  if (F4P4_DEMARCHE_V7 !== 'cinq_etapes') {
    const anc = campF4P4V7(rot.figR1, rot.hR1, theme);
    const anc7 = campF4P4V7(rot.figR7, rot.hR7, theme);
    const k = function (c) {
      return Math.round(((c.poles[0].marge + c.poles[1].marge) - c.assaillantDefensif) * 100) / 100;
    };
    const k1 = k(anc), k7 = k(anc7);
    return {
      applicable: true, hR1: rot.hR1, hR7: rot.hR7,
      figR1: rot.figR1, figR7: rot.figR7, memeBoucle: memeBoucle,
      lecture: 'règle duel4 (la démarche en cinq étapes est calculée mais ne pilote pas)',
      R1: R1, R7: R7, marges: { R1: anc, R7: anc7 },
      avantage: k1 > k7 ? 'R1' : k7 > k1 ? 'R7' : null,
      critere: 'règle « duel4 » : ' + k1 + ' contre ' + k7
        + ' · cinq étapes : ' + R1.solides + '/4 contre ' + R7.solides + '/4 pôles solides',
      synthese: 'F4P4 — duel4 ' + k1 + ' contre ' + k7
        + ' | cinq étapes ' + R1.solides + '/4 contre ' + R7.solides + '/4'
    };
  }

  let avantage = null, critere = '', lecture;
  if (!memeBoucle) {
    // Opposition de boucle : le plus solide gagne.
    lecture = 'opposition de boucles (' + R1.boucle + ' contre ' + R7.boucle + ')';
    if (R1.solides !== R7.solides) {
      avantage = R1.solides > R7.solides ? 'R1' : 'R7';
      critere = lecture + ' — pôles solides ' + R1.solides + ' contre ' + R7.solides;
    } else if (R1.frappeMoyenne !== R7.frappeMoyenne) {
      // ─── LA FRAPPE, branchée le 26/08 sur demande d'Ellemine_D ───
      // À défense égale, c'est ce que les pôles ATTEIGNENT dans le camp
      // d'en face qui départage — le sens que la chaîne Carcer → Cauda
      // Draconis a mis au jour. Mesuré : ce départage donne le même
      // résultat que l'ancrage total sur les sept cas (5/7) ; il passe
      // devant parce qu'il est doctrinal là où l'ancrage total n'est
      // qu'une somme.
      avantage = R1.frappeMoyenne > R7.frappeMoyenne ? 'R1' : 'R7';
      critere = lecture + ' — ' + R1.solides + ' pôles solides de chaque côté, '
        + 'départage par la FRAPPE, à opportunités égales : ' + R1.frappeMoyenne
        + ' contre ' + R7.frappeMoyenne
        + ' (sommes ' + R1.frappeSomme + '/' + R1.frappesPossibles
        + ' et ' + R7.frappeSomme + '/' + R7.frappesPossibles + ')';
    } else if (R1.ancrageTotal !== R7.ancrageTotal) {
      avantage = R1.ancrageTotal > R7.ancrageTotal ? 'R1' : 'R7';
      critere = lecture + ' — ' + R1.solides + ' pôles solides de chaque côté, '
        + 'départage par l\'ancrage total ' + R1.ancrageTotal + ' contre ' + R7.ancrageTotal;
    } else {
      critere = lecture + ' — égalité complète, aucun départage';
    }
  } else {
    // Même boucle : ce sont les assaillants qui désignent le plus fragile.
    // Le camp dont l'assaillant a le RÉSEAU LE PLUS SOLIDE est le plus
    // fragile — il perd.
    lecture = 'même boucle (' + R1.boucle + ') — ce sont les antagonistes directs qui tranchent';
    if (R1.solidesAdverse !== R7.solidesAdverse) {
      avantage = R1.solidesAdverse < R7.solidesAdverse ? 'R1' : 'R7';
      critere = lecture + ' — assaillant de R1 ' + R1.solidesAdverse + ' pôles solides, '
        + 'assaillant de R7 ' + R7.solidesAdverse + ' : le plus attaqué est le plus fragile';
    // ─── CRITÈRE MORT, RETIRÉ LE 28/08/26 ───
    // Il y avait ici un départage par la FRAPPE. Il n'a jamais pu se
    // déclencher : en même boucle, les cinq rôles d'un camp et ceux de
    // l'autre sont tous à des décalages pairs, la victime est à +3
    // (impair), donc AUCUNE frappe n'atteint le camp d'en face — les
    // deux frappeSomme valent 0 par construction.
    // Mesuré avant retrait : 148 thèmes à même boucle, 0 avec une
    // frappeSomme non nulle. La cascade affichait donc trois critères
    // alors qu'elle n'en avait que deux, et on ne pouvait pas savoir
    // d'où venait la décision.
    } else if (R1.solides !== R7.solides) {
      avantage = R1.solides > R7.solides ? 'R1' : 'R7';
      critere = lecture + ' — assaillants à égalité (' + R1.solidesAdverse
        + ') — départage par les pôles solides ' + R1.solides + ' contre ' + R7.solides;
    } else if (R1.ancrageTotal !== R7.ancrageTotal) {
      avantage = R1.ancrageTotal > R7.ancrageTotal ? 'R1' : 'R7';
      critere = lecture + ' — départage par l\'ancrage total '
        + R1.ancrageTotal + ' contre ' + R7.ancrageTotal;
    } else {
      critere = lecture + ' — égalité complète, aucun départage';
    }
  }

  return {
    applicable: true, hR1: rot.hR1, hR7: rot.hR7,
    figR1: rot.figR1, figR7: rot.figR7,
    memeBoucle: memeBoucle, lecture: lecture,
    R1: R1, R7: R7, avantage: avantage, critere: critere,
    synthese: 'F4P4 — ' + lecture + ' · R1 ' + (FL[rot.figR1] || rot.figR1) + ' '
      + R1.solides + '/4 pôles solides (assaillant ' + R1.solidesAdverse + '/4)'
      + ' | R7 ' + (FL[rot.figR7] || rot.figR7) + ' '
      + R7.solides + '/4 (assaillant ' + R7.solidesAdverse + '/4)'
      + ' → ' + (avantage || 'nul')
  };
}


// ─── CE QUI COMPTE, C'EST CE QUI TOUCHE LE CAMP D'EN FACE ───
// Premier essai (écarté) : compter les quatre rôles exercés sur n'importe
// qui. Mesuré 1/3 sur les cas réels — cela ne mesurait que la population
// du thème, pas l'issue du duel : dans les cas Juventus et Inter, R7 exerçait plus de
// rôles effectifs que R1, et c'est R1 qui a gagné les deux.
// Retenu : seuls comptent les rôles dont le DESTINATAIRE appartient au camp
// adverse — le chef d'en face ou l'un de ses trois pôles alliés.
//   · frapper ce camp RAPPORTE   (c'est la cascade : « le chef puer détruit
//     direct la binôme de R7 »)
//   · le servir COÛTE            (être binôme, protecteur ou front d'une
//     figure du camp adverse, c'est renforcer l'adversaire)
// Un rôle qui ne touche pas le camp adverse ne compte ni pour ni contre.
// Mesuré : actif sur 81,3% des thèmes, écart non nul sur 74%. Au plus
// 3 des 4 rôles touchent le camp adverse — jamais 4.
function scoreRolesExercesV7(chef, adverse, theme, siegeImpose) {
  if (!chef) return null;
  const rx = rolesExercesFigureV7(chef, theme, siegeImpose);
  if (!rx) return null;
  const campAdverse = campDuChefV7(adverse);
  const detail = rx.roles.map(function (ro) {
    const vise = campAdverse.indexOf(ro.dest) >= 0;
    const poids = POIDS_ROLES_EXERCES_V7[ro.cle] || 0;
    const coef = POIDS_ROLES_V7.portee[ro.portee] || 0;
    // hostile sur le camp adverse : gain. Service au camp adverse : perte.
    const signe = ro.hostile ? 1 : -1;
    return {role: ro.libelle, cle: ro.cle, dest: ro.dest, portee: ro.portee,
      viseCampAdverse: vise, hostile: ro.hostile, etat: ro.etat.libelle,
      score: vise ? Math.round(poids * coef * signe * 100) / 100 : 0};
  });
  const total = Math.round(detail.reduce(function (s, d) { return s + d.score; }, 0) * 100) / 100;
  const touchants = detail.filter(function (d) { return d.viseCampAdverse; });
  return {chef: chef, solide: rx.solide, detail: detail, total: total,
    nbTouchants: touchants.length,
    resume: touchants.length
      ? touchants.map(function (d) {
          return d.role + ' ' + (FL[d.dest] || d.dest) + ' ' + d.portee
            + ' (' + (d.hostile ? 'gain' : 'sert l\'adverse') + ' ' + d.score + ')';
        }).join(' · ')
      : 'aucun rôle ne touche le camp adverse'};
}


// ═══════════════════════════════════════════════════════════════
// ÉTUDE DU 7-0 PAR LE RÉSEAU DES TROIS PÔLES (25/08/26, Ellemine_D :
// « pour comprendre pourquoi R7 n'a pu marquer »)
// Cas Milan — Tristitia · Via · Conjonctio · Rubeus — RÉEL 7-0 pour R1
// centrale R1 = Fortuna Minor (M8) · centrale R7 = Carcer (M14)
//
// CE QUI N'EXPLIQUE PAS LE 7-0 — deux fausses pistes écartées :
//   · Le BOUCLIER. Les deux sont intacts : celui de R1 (Caput Draconis)
//     est menacé par Populus, absent de la base ; celui de R7 (Albus,
//     présent 5 fois) est menacé par Puer, absent de la base aussi.
//     Aucun des deux camps n'est entamé par là.
//   · L'INCAPACITÉ DE FRAPPER. R7 frappe Cauda Draconis — le FRONT de R1 —
//     et la frappe est EFFECTIVE. R7 pouvait donc frapper, et dans le camp
//     adverse. « R7 n'a pas marqué » ne veut pas dire « R7 ne pouvait pas
//     frapper ».
//
// CE QUI L'EXPLIQUE — trois déséquilibres, tous dans le même sens :
//   1. L'ATTAQUE SUBIE, massivement asymétrique.
//      R1 est attaquée par Amissio : 1 fois en base, FRAGILE, frappe
//      affaiblie. R7 est attaquée par Rubeus : 3 FOIS EN BASE, SOLIDE,
//      frappe EFFECTIVE. Un camp encaisse une pichenette, l'autre trois
//      coups pleins.
//   2. LE FRONT DE R7 N'EST JAMAIS EN BASE. Puella n'existe qu'en
//      résultante (M5r, M10r). Celui de R1, Cauda Draconis, est en base
//      (M9). Le pôle le plus avancé du camp perdant n'a pas de corps.
//   3. LA MATIÈRE DU CAMP. Camp R1 : 6 présences en base (Fortuna Minor 2,
//      Caput Draconis 1, Cauda Draconis 1, Conjonctio 2). Camp R7 : 3
//      seulement (Carcer 1, Albus 1, Puella 0, Fortuna Major 1). Le double.
//
// ═══════════════════════════════════════════════════════════════
// CORRECTION D'ELLEMINE_D (25/08/26) — « tu as mal interprété »
// Mon analyse ci-dessus concluait que le bouclier de R7 était INTACT
// parce que Puer, qui l'attaque, n'est pas en base. C'EST FAUX, et c'est
// la troisième fois que le même oubli passe : les RÉSULTANTES comptent.
//
// LES REMARQUES D'ELLEMINE_D, TOUTES VÉRIFIÉES :
//  · Albus est bien le bouclier de Carcer, et son antagoniste est Puer.
//  · Puer est là, en résultante : M6r (feu en air, conc 0,5) et M8r
//    (feu en terre, conc 0,25).
//  · « Encerclé » est LITTÉRAL. Albus occupe M7r, et Puer tient M6 ET M8 —
//    les deux voisines. Albus en M9r a encore Puer en M8. Le bouclier de
//    Carcer est pris en tenaille par son propre antagoniste.
//  · Mais avant de conclure à la destruction d'Albus, il faut regarder
//    l'antagoniste de Puer : PUELLA. Est-elle assez forte pour arrêter
//    Puer ? Non — et le calcul le confirme :
//        Puer   M6r 0,5 + M8r 0,25                    = 0,75
//        + son binôme Caput Draconis M2r 1 + M6 1      = 2,00
//        → camp Puer  2,75
//        Puella M5r 0,25 (terre en feu) + M10r 0 (terre en air) = 0,25
//        + son binôme Populus M15r 0 (feu en eau)      = 0,00
//        → camp Puella 0,25
//    Onze fois moins. Caput Draconis est air en air DEUX FOIS, concordance
//    parfaite ; Populus est feu en eau, opposition totale.
//
// CE QUE ÇA CHANGE DANS LA MÉTHODE : on ne juge pas un pôle présent ou
// absent, ni même solide ou fragile en soi. On suit la chaîne — qui
// attaque le bouclier, qui devrait arrêter cet attaquant, et avec quelle
// force élémentaire, binôme compris. Un attaquant en résultante seule peut
// détruire, si celui qui devait l'arrêter est plus faible que lui.
//
// SUITE DE LA CHAÎNE (notes du 25/08, deuxième série) :
//
//  · ALBUS TIENT DEUX RÔLES À LA FOIS, et c'est le pivot du thème :
//    bouclier(Carcer) = Albus, et antagoniste(Rubeus) = Albus. Le même
//    Puer qui encercle Albus fait donc DEUX choses d'un coup : Carcer perd
//    son bouclier, ET Rubeus — l'antagoniste de Carcer — est libéré de ce
//    qui le retenait. C'est la doctrine des rôles simultanés en action.
//
//  · RUBEUS, une fois libre, frappe Carcer. Sa force : M4 air en terre
//    conc 0 · M5 air en feu conc 0,5 · M16 air en terre conc 0. Il n'est
//    concordant qu'en M5, comme le dit Ellemine_D.
//
//  · SON BINÔME FORTUNA MINOR est très fort : M1r feu en feu conc 1 ACTIF,
//    M13 feu en feu conc 1 ACTIF, M8 feu en terre conc 0,25. Trois
//    présences, concordance cumulée 2,25, deux niveaux actifs.
//
//  · CE QUI DEVRAIT ARRÊTER FORTUNA MINOR — son antagoniste Amissio — ne
//    fait pas le poids : une seule présence, M12 eau en terre conc 0,5,
//    niveau passif. Son binôme Tristitia n'aide pas (M1 conc 0,25 passif,
//    M3r conc 0,5 passif). Et Amissio a elle-même son antagoniste Caput
//    Draconis en face, air en air DEUX FOIS, conc 1 et niveau ACTIF les
//    deux fois. Amissio est écrasée des deux côtés.
//        Fortuna Minor : 3 présences · concordance 2,25 · 2 niveaux actifs
//        Amissio       : 1 présence  · concordance 0,50 · 0 niveau actif
//
//  · RESTE LA RIPOSTE : le front de Carcer est Puella, qui n'existe qu'en
//    résultante (M5r conc 0,25 · M10r conc 0). C'est là, dit Ellemine_D,
//    que se joue « les deux marquent ou pas ».
//
// ─── TRANCHÉ LE 25/08 PAR ELLEMINE_D ───
// « C'est par concordance des éléments. Feu-air sont compatibles, de même
// que feu-feu, eau-terre, eau-eau, terre-terre. Ce qui ne le sont pas,
// c'est feu-eau ou terre-air. »
// Donc quand Ellemine_D dit « niveau d'élément actif », il faut lire la
// CONCORDANCE, pas la ligne géomantique. Question ci-dessous close.
//
// Sa règle et le code disent EXACTEMENT la même chose — vérifié sur les
// dix paires : tout ce qu'il appelle compatible a un score > 0 dans
// concordanceElement, tout ce qu'il appelle incompatible vaut 0. Aucune
// contradiction. Le code garde en plus un palier intermédiaire à 0,25 pour
// eau-air et terre-feu, qu'Ellemine_D n'a pas citées — palier introduit le
// 13/07 sur sa propre remarque qu'elles ont « une vraie concordance
// partielle » (elles partagent une qualité : humide pour eau-air, sec pour
// terre-feu). Rien à changer.
//
// ⚠️ CONSÉQUENCE À TRAITER : le critère « activation » de profilFigureMaison
// (±5, le plus lourd en pratique) lit la LIGNE géomantique, pas la
// concordance. Il ne correspond donc à rien dans la doctrine telle
// qu'Ellemine_D vient de la formuler — il était d'ailleurs marqué
// « ⚠️ proposé » dans POIDS_PROFIL_V7. À trancher avec lui : le retirer,
// ou le garder comme dimension distincte de la concordance.
//
// ─── question d'origine, désormais close ───
// ⚠️ UN POINT DE DOCTRINE À TRANCHER — « niveau d'élément ».
// Ellemine_D écrit que le niveau d'élément AIR de Rubeus est actif en M5.
// Le code lit autre chose : elementaireFigureMaison prend la ligne de la
// figure correspondant à l'élément de LA MAISON — pour Rubeus en M5, la
// maison est feu, la ligne feu de Rubeus vaut 2, donc PASSIF.
// Les deux lectures divergent sur 112 cas sur 256, soit 44%.
// Fait décisif mesuré : la ligne correspondant à l'élément PROPRE d'une
// figure est active sur 15 figures sur 16 — seule Populus fait exception.
// Lue ainsi, la mention « niveau actif » serait donc presque toujours
// vraie et ne distinguerait rien. La lecture par l'élément de la maison
// est la seule qui discrimine, et c'est celle qu'Ellemine_D avait employée
// le 24/08 sur Puer en M11 (« 3e ligne, eau, de puer est passif » — la
// maison M11 est eau). Le code n'est donc pas modifié en attendant sa
// réponse ; ce qui distingue bien Rubeus en M5 de M4 et M16 reste vrai
// dans les deux lectures, c'est sa CONCORDANCE : 0,5 contre 0 et 0.
//
// (Remarques notées le 25/08 à la demande d'Ellemine_D — la conclusion
// sur le 7-0 reste à écrire ensemble, elle n'est PAS tirée ici.)
//
// ═══════════════════════════════════════════════════════════════
// LA RIPOSTE — réponse à « verras si la frappe de Rubeus sera une
// destruction totale de Carcer ou ripostera avec sa figure de front »
// (26/08, mesuré avec le critère d'alignement actif désormais branché)
//
// ① LE FAIT DE STRUCTURE QUI TRANCHE LA QUESTION.
//    Le front de Carcer est PUELLA. L'assaillant du bouclier Albus est
//    PUER. Or antagoniste(Puer) = Puella. Le front de Carcer et le
//    défenseur de son bouclier SONT LA MÊME FIGURE, faisant le MÊME
//    geste. C'est exactement la définition qu'Ellemine_D a donnée le
//    25/08 : « la fig de front détruit la fig qui attaque le fig du
//    bouclier ». Vérifié en table, pas seulement sur ce thème :
//    front(X) = X+4 et antagoniste(bouclier(X)) = (X+10)−3 = X+7, dont
//    l'antagoniste est X+4. Toujours le front.
//
//    CONSÉQUENCE : il n'y a pas d'ordre « le bouclier tombe, PUIS on
//    verra si le front riposte ». Le front a déjà joué, et il a perdu,
//    au moment même où le bouclier est tombé. Carcer ne peut pas
//    riposter — non parce qu'elle est faible, mais parce que sa riposte
//    était ce coup-là.
//    Chiffres du duel, conc + 0,5 × alignement actif, binôme compris :
//        camp PUER   : Puer 2 occ conc 0,75 align 3 · Caput Draconis
//                      2 occ conc 2 align 2   →  conc 2,75 · align 5
//        camp PUELLA : Puella 2 occ conc 0,25 align 2 · Populus 1 occ
//                      conc 0 align 0         →  conc 0,25 · align 2
//    Onze fois moins en concordance, et aucune des cinq présences du
//    camp Puella n'est en base. Le rapport qu'Ellemine_D avait calculé
//    à la main (2,75 contre 0,25) est retrouvé au chiffre près.
//
// ② NI L'UN NI L'AUTRE : PAS DE DESTRUCTION TOTALE NON PLUS.
//    Le duel 2 pris brut ne donne PAS Carcer écrasée :
//        camp RUBEUS  (Rubeus + Fortuna Minor) : 6 occ (5 base)
//                      conc 2,75 · align 5
//        camp CARCER  (Carcer + Albus + Fortuna Major) : 8 occ (3 base)
//                      conc 3 · align 5
//    Carcer a MOINS de base mais autant de matière. Elle-même tient :
//    M12r terre en terre, concordance 1. Elle n'est pas anéantie.
//    Mais retirer Albus — le bouclier neutralisé au ① — fait tomber son
//    camp à 3 occ (2 base), conc 1,5, align 4. Albus portait 5 des
//    8 présences. Le camp de Carcer, c'était Albus.
//    LECTURE : Carcer survit, mais dépouillée et muette. C'est
//    exactement un 7-0 : l'équipe existe encore, elle ne marque pas.
//
// ③ LE CONTRÔLE, CÔTÉ R1, MONTRE QUE L'ASYMÉTRIE EST STRUCTURELLE.
//    Bouclier de Fortuna Minor = Caput Draconis, attaqué par POPULUS —
//    présent une seule fois, M15r, conc 0, align 0. L'attaquant le plus
//    faible possible. Le front de R1, Cauda Draconis, est en base (M9).
//    Le réseau des trois pôles de R1 est intact de bout en bout, celui
//    de R7 est rompu au bouclier. Un camp joue à trois pôles, l'autre à
//    un seul.
//
// ④ CE QUE ÇA NE PROUVE PAS — mesuré, et négatif.
//    Tentation immédiate : « le camp dont le front perd son duel ne
//    marque pas », donc une règle pour « les deux marquent ». Testée
//    sur les cinq cas au score connu, dix camps, dont deux à zéro but :
//        cas camp centrale        buts | duel du front (front − assaillant)
//         Juventus  R1  Puer             6    |  0
//         Juventus  R7  Conjunctio       1    | +5,5
//         Inter  R1  Laetitia         3    | +2
//         Inter  R7  Via              2    | −0,5
//         Milan  R1  Fortuna Minor    7    | +2,5
//         Milan  R7  Carcer           0    | −4     ← le plus bas des dix
//         Napoli  R1  Laetitia         0    | −3
//         Napoli  R7  Conjunctio       1    | −0,5
//         Roma  R1  Carcer           1    | −2,75
//         Roma  R7  Fortuna Major    1    | −3,25
//    Carcer dans Milan est bien le duel le plus perdu de tout l'échantillon,
//    ce qui soutient le mécanisme. Mais Roma donne DEUX camps à duel perdu
//    (−2,75 et −3,25) qui ont marqué chacun un but. Le seuil n'existe
//    pas : « front battu » n'implique pas « zéro but ».
//    Cinq autres grandeurs testées (front seul, front en base, matière
//    du camp, net camp − assaut, force de l'assaut) : aucune ne place
//    les deux camps à zéro but en bas du classement. La meilleure,
//    duelFront, les met aux rangs 1 et 3 sur 10.
//    → Le duel du front EXPLIQUE le 7-0. Il ne PRÉDIT pas les buts.
//      Deux zéros dans l'échantillon, c'est de toute façon trop peu
//      pour caler un seuil ; il faut d'autres scores réels.
// ═══════════════════════════════════════════════════════════════
//
// ⚠️ PISTE TESTÉE ET NON RETENUE — la PROFONDEUR de la frappe. Le cas Milan
// suggérait une hiérarchie : R1 frappe le BINÔME adverse (proche du cœur),
// R7 seulement le FRONT (le plus avancé), donc frapper plus profond
// gagnerait. Mesuré sur les six cas : 1/4 seulement, et la règle ne
// départage que 23% des thèmes — sur les autres, les deux frappes sont
// hors camp ou non effectives et s'égalisent. C'est le cas Milan qui l'a
// inspirée, il est donc normal qu'elle y marche ; elle ne généralise pas.
// Non branchée.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// LES TROIS AXES DU CARRÉ (25/08/26, correction Ellemine_D)
// « hormis ces axes il n'existe pas une autre axe ; si on veut le
// continuer on retombe sur le 1er axe, exemple 4-7-10-1 »
//
// Vérifié : les douze maisons du carré se partagent EXACTEMENT en trois
// classes de pas 3, qui sont les classes de restes modulo 3.
//     1-4-7-10  (reste 1) — angulaire
//     2-5-8-11  (reste 2) — succédent
//     3-6-9-12  (reste 0) — cadent
// Il ne peut pas y en avoir de quatrième, et prolonger un axe y ramène :
// 4-7-10-1 est le même ensemble que 1-4-7-10.
//
// L'ancien « Axe Temporel » M3+M5+M11+M15 n'en était pas un : 3 tombe
// dans la classe 0, 5 et 11 dans la classe 2 — deux classes mélangées —
// et M15 est hors du carré des douze, c'est le Juge. Retiré partout :
// analyzeValidation, themeInvalidite, isThemeValideStrict, le panneau de
// validité et AXES_V7. La validation passe de quatre conditions à trois.
//
// EFFET MESURÉ sur les six cas réels — la majorité des axes gagne un cas :
//   avant (4 axes) : juste 1 fois (Juventus), fausse 2 fois (Milan, Napoli), partagée 1 (Inter)
//   après (3 axes) : juste 2 fois (Juventus, Inter), fausse 2 fois (Milan, Napoli)
// Le cas Inter, qui restait indécis à 2 contre 2, se décide maintenant à
// 2 contre 1 et tombe juste. Milan et Napoli restent faux.
//
// AU PASSAGE, UNE CONTRADICTION RÉSOLUE. Le fichier avait TROIS fonctions
// de validité aux règles différentes : analyzeValidation cherchait les
// figures d'axe EN BASE SEULE, themeInvalidite et isThemeValideStrict en
// base ET résultante. Mesuré avant correction : 31,5% de thèmes valides
// d'un côté, 72,4% de l'autre, un accord sur 59,2% seulement — un même
// thème pouvait s'afficher valide dans un panneau et invalide dans un
// autre. Le protocole base+résultante est celui qu'Ellemine_D a confirmé
// le 10/07/26 et qui est écrit dans isThemeValideStrict ;
// analyzeValidation était l'exception, elle a été alignée. Les trois
// fonctions s'accordent désormais sur 100% des thèmes, à 71,3%.
// ⚠️ J'avais « corrigé » la veille le texte du panneau de validité pour
// dire « en base uniquement ». C'était faux : ce panneau utilise
// themeInvalidite, qui compte les résultantes. Texte rétabli.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// LIEUX DE MARQUAGE — ÉTUDE DU 25/08/26 (question d'Ellemine_D)
// Maisons désignées : M1, M4, M5, M7, M8, M9, M10, plus les sièges R1/R7.
// Question posée : les figures qui y siègent ont-elles, par leurs trois
// pôles, une capacité de marquage ?
//
// RÉPONSE MESURÉE SUR LES 5 THÈMES DONT LE SCORE EST CONNU
// (Napoli 0-1 · Roma 1-1 · Inter 3-2 · Juventus 6-1 · Milan 7-0, soit 1, 2, 5, 7 et 7 buts) :
//
// 1. L'ÉTAT LIBRE/TENUE NE PRÉDIT RIEN. Nombre de figures « libres » parmi
//    les 7 lieux : 3, 3, 5, 2, 5 pour 1, 2, 5, 7, 7 buts. Sur les paires
//    départageantes : 4 dans le sens, 3 à contresens. Pile ou face.
//    Le cas Juventus est la réfutation la plus nette : 2 figures libres sur 7,
//    et 7 buts. Le cas Napoli : 3 libres, 1 but.
//    Pour le BTTS, le meilleur découpage de camps donne 4/6 — exactement
//    ce que donnerait un « oui » constant. Aucune information.
//
// 2. POURQUOI : L'INSTRUMENT N'EST PAS LOCAL. resoudreLiberationsV7 donne
//    à chaque FIGURE un seul état pour tout le thème. Une figure présente
//    dans trois maisons a une seule valeur libre/tenue. Dire « la figure
//    en M5 est libre » ne dit donc rien sur M5. Pour une doctrine fondée
//    sur les LIEUX, la lecture des pôles doit être localisée à la maison —
//    c'est ce que fait profilFigureMaison, et lui montre quelque chose.
//
// 3. CE QUE MONTRE LA LECTURE LOCALISÉE — ET C'EST L'INVERSE DE L'ATTENDU.
//    Somme des profils sur les 7 lieux : 79,6 · 52,6 · 100,4 · 32,7 · 51
//    pour 1, 2, 5, 7, 7 buts → 2 paires dans le sens, 7 à CONTRESENS.
//    Nombre de lieux à profil positif : 7 · 5 · 7 · 4 · 5 → 1 dans le
//    sens, 6 à contresens.
//    Autrement dit : MIEUX les figures sont installées dans les lieux de
//    marquage, MOINS il y a de buts. Le thème le mieux installé (Inter, somme
//    100,4) fait 5 buts ; le moins bien installé (Juventus, 32,7) en fait 7 ;
//    et Napoli, bien installé à 79,6, n'en fait qu'un seul.
//    Lecture possible : une figure bien installée TIENT sa maison au lieu
//    d'agir. Les buts viendraient du déséquilibre, pas de la solidité —
//    ce qui rejoint l'idée de match ouvert contre match fermé.
//
// ⚠️ PRUDENCE : 5 thèmes, 9 paires, 3 indicateurs essayés. Voir 7 paires
// sur 9 à contresens a environ 9% de chances d'arriver par hasard sur un
// seul indicateur, et ~25% quand on en essaie trois. C'est suggestif, pas
// démontré. Rien n'est branché sur cette base.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// LES DEUX MARQUENT — PISTE (25/08/26, « on attaque les deux marquent »)
//
// Reformulation qui a débloqué la question : « les deux marquent » ne veut
// PAS dire que le match est serré. Le cas Juventus est un 6-1 et les deux ont
// marqué ; le cas Napoli est un 0-1 et un seul a marqué. Ce qui se demande,
// c'est si le PERDANT garde la capacité de frapper une fois.
//
// Deux façons, et deux seulement, de la lui retirer :
//   1. LE VAINQUEUR L'ANÉANTIT — sa frappe (rôle d'antagoniste) est
//      « effectif » ET vise le camp du perdant : le chef adverse ou l'un
//      de ses trois pôles alliés. Il coupe la source.
//   2. LE PERDANT N'A PLUS D'APPUI — sa chaîne est percée : protecteur ou
//      front absent du thème. Il ne tient plus debout assez longtemps.
// Sinon, les deux marquent.
//
// Les deux routes réutilisent la machinerie déjà en place pour le verdict —
// scoreRolesExercesV7 et soliditeChaineV7 — au lieu d'une table séparée.
//
// ⚠️ STATUT : PISTE, PAS RÈGLE. Lue sur les 5 cas réels, elle donne 5/5,
// avec un taux de base de 48% « les deux marquent » / 52% « un seul » —
// proche du taux réel du BTTS au football, ce qui est bon signe pour le
// calibrage mais ne prouve rien. La règle a été CONSTRUITE en regardant
// ces 5 cas, après avoir essayé une dizaine de candidats : une règle à
// 50/50 a environ 3% de chances de faire 5/5 par hasard, donc ~26% sur dix
// essais. Le 5/5 est suggestif, pas démonstratif. NON BRANCHÉE au verdict.
//
// ⚠️ CE QUI EST MESURÉ ET NE DÉPEND PAS DE CET AJUSTEMENT :
//   · La lecture BTTS actuelle répond « les deux marquent » sur 91% des
//     thèmes. Ses 3/5 sur les cas réels sont exactement ce que donnerait
//     un « oui » constant — elle n'apporte donc aucune information.
//   · La règle BTTS 100% (M4/M10) se déclenche sur 8,6% des thèmes ; sur
//     nos 5 cas elle tire trois fois, juste une seule (Roma 1-1), fausse sur
//     Milan 7-0 et Napoli 0-1.
//   · La règle « Via en M4 → camp A ne marque pas » est fausse sur le cas
//     Inter (Via EST en M4, réel 3-2, les deux ont marqué). Elle était donnée
//     3/3 sur l'ancienne archive — ce nouveau cas la contredit.
//   · L'intuition de départ — « si les deux camps peuvent frapper, les
//     deux marquent » — est ANTI-corrélée : 1/5. Piste morte.
// ═══════════════════════════════════════════════════════════════
function lectureDeuxMarquentV7(theme) {
  if (!theme || !theme[1]) return { applicable: false, raison: 'Thème non disponible.' };
  const rot = getRotationCombat(theme);
  const anc = analyseAncrageDeveloppe(theme);
  // ─── CORRIGÉ LE 28/08/26 : LE VAINQUEUR DÉCLARÉ MUET ───
  // Cette lecture désignait le perdant avec analyseAncrageDeveloppe — un
  // moteur à 5/8 qui n'est plus au volant depuis que les sièges ont pris
  // la main. Résultat : sur 347 thèmes où le système annonce « un seul
  // marque », le camp déclaré MUET était le VAINQUEUR affiché dans 45 %
  // des cas. Un camp qui ne marque pas et qui gagne le match : impossible.
  // Trouvé sur le thème Caput/Carcer/Fortuna Major/Populus d'Ellemine_D,
  // où l'ancrage tranche R7 de 0,12 point pendant que l'écran affiche
  // « M1 gagne 4-2 » et « muet : R1 ».
  // Le perdant est désormais désigné par la LECTURE DES SIÈGES, qui est
  // au volant. Repli sur l'ancrage quand les sièges s'abstiennent (7 %).
  // ⚠️ getVerdictAfficheReel est INTERDIT ici : buildVerdictCard appelle
  // cette fonction, l'appeler en retour boucle à l'infini. Les sièges ne
  // touchent ni à la carte ni au BTTS — vérifié.
  // Le perdant suit le VOLANT : F4P4 depuis le 28/08, puis les sièges,
  // puis l'ancrage. Aucun des trois n'appelle la carte — pas de récursion.
  let source = null, avantage = null;
  try {
    const mf = moteurF4P4V7(theme);
    if (mf && mf.applicable && mf.avantage) { avantage = mf.avantage; source = 'F4P4'; }
  } catch (e) { avantage = null; }
  if (!avantage) {
    try {
      const sg = lectureSiegesR1R7(theme);
      if (sg && sg.applicable && sg.winner) { avantage = sg.winner; source = 'sièges (repli)'; }
    } catch (e) { avantage = null; }
  }
  if (!avantage && anc.applicable && anc.avantage) { avantage = anc.avantage; source = 'ancrage (repli)'; }
  if (!avantage) {
    return { applicable: false, raison: 'Aucun avantage départagé — le perdant n\'est pas identifié.' };
  }
  const estR1 = avantage === 'R1';
  const vainqueur = estR1 ? rot.figR1 : rot.figR7;
  const perdant   = estR1 ? rot.figR7 : rot.figR1;
  const siegeV    = estR1 ? rot.hR1 : rot.hR7;

  // Route 1 — la frappe du vainqueur atteint-elle le camp du perdant ?
  const rx = rolesExercesFigureV7(vainqueur, theme, siegeV);
  const frappe = rx ? rx.roles[0] : null;               // le rôle antagonisteDe
  const campPerdant = campDuChefV7(perdant);
  const viseCamp = !!(frappe && campPerdant.indexOf(frappe.dest) >= 0);
  const aneantit = !!(frappe && frappe.portee === 'effectif' && viseCamp);

  // Route 2 — la chaîne du perdant tient-elle encore ?
  const chaine = soliditeChaineV7(perdant, theme);
  const percee = !!(chaine && chaine.perce);

  const lesDeuxMarquent = !aneantit && !percee;
  const motifs = [];
  if (aneantit) {
    motifs.push('le vainqueur ' + FL[vainqueur] + ' frappe ' + FL[frappe.dest]
      + ' — camp du perdant — et la frappe est effective');
  }
  if (percee) {
    motifs.push('la chaîne du perdant ' + FL[perdant] + ' est percée ('
      + chaine.resume + ')');
  }

  return {
    applicable: true,
    vainqueur: vainqueur, perdant: perdant,
    sourceVainqueur: source,
    lesDeuxMarquent: lesDeuxMarquent,
    aneantiParLaFrappe: aneantit,
    chainePerdantPercee: percee,
    frappe: frappe ? { cible: frappe.dest, portee: frappe.portee, viseCamp: viseCamp } : null,
    chainePerdant: chaine ? chaine.total : null,
    motifs: motifs,
    synthese: lesDeuxMarquent
      ? 'Le perdant ' + FL[perdant] + ' garde sa frappe : la frappe du vainqueur ne l\'atteint pas '
        + '(' + (frappe ? frappe.portee + (viseCamp ? ', camp adverse' : ', hors camp') : '—') + ') '
        + 'et sa chaîne tient (' + (chaine ? chaine.total : '—') + ') → LES DEUX MARQUENT.'
      : 'Le perdant ' + FL[perdant] + ' est muet : ' + motifs.join(' ; ') + ' → UN SEUL MARQUE.'
  };
}


// ═══════════════════════════════════════════════════════════════
// DOCTRINE ELLEMINE (25/08/26) — OUVERTURE DES SIÈGES ET FIGURES À BUTS
//
// Énoncé : « Maison 1 (équipe A) : une figure ouverte ou active ici =
// cette équipe marque. Maison 7 (équipe B) : idem = l'autre marque aussi.
// Si M1 et M7 ont toutes les deux une figure ouverte/active → BTTS très
// probable. » Plus une liste de figures fortes pour les buts, et un bonus
// si Via, Acquisitio ou Fortuna Minor occupe M5 ou M8.
//
// ⚠️ CONFLIT DE VOCABULAIRE À TRANCHER. La table OUVERTURE_FIGURE, déjà
// dans le fichier, classe FERMÉES trois des sept figures à buts :
// Fortuna Minor, Caput Draconis et Fortuna Major. « Figure ouverte » et
// « figure forte pour les buts » sont donc deux ensembles DIFFÉRENTS ici.
// Les deux critères sont gardés séparés tant qu'Ellemine_D n'a pas dit
// lequel prime — aucun n'est écrasé par l'autre.
//
// ⚠️ LE CADRE COMPTE PLUS QUE LE DÉTAIL. Mesuré sur les 5 cas réels :
//   · lue sur les maisons FIXES M1/M7 ......... 3/5 (rate Juventus et Roma)
//   · lue sur les SIÈGES R1/R7 de la rotation . 4/5 (rate Juventus seul), 47% de oui
// Même règle, même définition d'« ouverte ou active », seul le cadre
// change. Le moteur travaillant en R1/R7 partout ailleurs, c'est cette
// lecture qui est retenue ici — et c'est elle qui marche le mieux.
//
// ⚠️ LE BONUS M5/M8 EST LE SEUL MORCEAU À PREUVE NÉGATIVE. Ajouter « ou
// bien Via/Acquisitio/Fortuna Minor en 5 ou 8 » fait TOMBER le score dans
// les deux cadres (3/5 → 2/5 en fixe, 4/5 → 3/5 en rotation) : il
// transforme Milan (7-0) et Napoli (0-1) en faux « les deux marquent ». Il est donc
// calculé et AFFICHÉ, mais volontairement exclu du verdict de la règle.
//
// STATUT : cette règle n'a PAS été ajustée sur les 5 cas — elle vient de
// l'expérience d'Ellemine_D. Son 4/5 vaut donc plus que le 5/5 de
// lectureDeuxMarquentV7, qui a été construite en les regardant.
// ═══════════════════════════════════════════════════════════════

// Les sept figures qu'Ellemine_D donne comme les plus fortes pour les buts.
var FIGURES_BUTS_V7 = {
  via: 1, acquisitio: 1, fortuna_minor: 1, laetitia: 1,
  caput_draconis: 1, puer: 1, fortuna_major: 1
};
// Le trio cité pour le bonus M5/M8.
var TRIO_BUTS_V7 = { via: 1, acquisitio: 1, fortuna_minor: 1 };

// « ouverte ou active » : ouverte au sens de la table OUVERTURE_FIGURE, ou
// active au sens élémentaire — la figure charge l'élément de sa maison.
function siegeOuvertOuActifV7(fig, house) {
  if (!fig) return { ouvert: false, ouverture: null, active: false };
  const ouverture = OUVERTURE_FIGURE[fig] || null;
  let active = false;
  try { active = !!elementaireFigureMaison(fig, house).natureLevel.active; } catch (e) { active = false; }
  return {
    fig: fig, house: house, ouverture: ouverture, active: active,
    figureDeButs: !!FIGURES_BUTS_V7[fig],
    ouvert: ouverture === 'ouverte' || active
  };
}

// cadre : 'rotation' (sièges R1/R7) ou 'fixe' (maisons M1/M7). Par défaut
// celui de BTTS_CADRE.
function lectureOuvertureButsV7(theme, cadre) {
  if (!theme || !theme[1]) return { applicable: false, raison: 'Thème non disponible.' };
  const rot = getRotationCombat(theme);
  const enFixe = (cadre || BTTS_CADRE) === 'fixe';
  const h1 = enFixe ? 1 : rot.hR1;
  const h7 = enFixe ? 7 : rot.hR7;
  const s1 = siegeOuvertOuActifV7(theme[h1], h1);
  const s7 = siegeOuvertOuActifV7(theme[h7], h7);
  // Le bonus est calculé sur les 5e et 8e crans de l'anneau de rotation,
  // pour rester dans le même cadre que les sièges.
  const h5 = enFixe ? 5 : rot.order[4], h8 = enFixe ? 8 : rot.order[7];
  const bonus = [];
  if (TRIO_BUTS_V7[theme[h5]]) bonus.push(FL[theme[h5]] + ' en M' + h5 + ' (5e cran)');
  if (TRIO_BUTS_V7[theme[h8]]) bonus.push(FL[theme[h8]] + ' en M' + h8 + ' (8e cran)');

  const lesDeuxMarquent = s1.ouvert && s7.ouvert;
  function dire(s, nom) {
    return nom + ' ' + FL[s.fig] + ' en M' + s.house + ' — ' + (s.ouverture || '?')
      + (s.active ? ', active' : ', inactive')
      + (s.figureDeButs ? ', figure à buts' : '')
      + ' → ' + (s.ouvert ? 'marque' : 'muet');
  }
  return {
    applicable: true, R1: s1, R7: s7,
    cadre: enFixe ? 'fixe' : 'rotation',
    lesDeuxMarquent: lesDeuxMarquent,
    bonusM5M8: bonus,
    synthese: dire(s1, enFixe ? 'M1' : 'R1') + ' · ' + dire(s7, enFixe ? 'M7' : 'R7')
      + ' → ' + (lesDeuxMarquent ? 'LES DEUX MARQUENT' : 'UN SEUL MARQUE')
      + (bonus.length ? ' · bonus signalé : ' + bonus.join(', ') + ' (affiché, non compté)' : '')
  };
}


// ═══════════════════════════════════════════════════════════════
// PANNEAU DES LIEUX DE MARQUAGE (25/08/26, demande Ellemine_D)
// Les sept maisons désignées — M1, M4, M5, M7, M8, M9, M10 — plus les
// deux sièges R1/R7 quand ils tombent ailleurs. Pour chaque lieu : la
// figure qui l'occupe, son installation LOCALE (profilFigureMaison, les
// six niveaux lus dans CETTE maison), l'état de ses trois pôles, et son
// ouverture.
//
// ⚠️ INSTRUMENT DE LECTURE, RIEN N'EST BRANCHÉ. L'étude du 25/08 (voir le
// bloc « LIEUX DE MARQUAGE ») a mesuré, sur les 5 thèmes dont le score est
// connu, que l'état libre/tenue des figures ne prédit NI les buts NI le
// BTTS, et que l'installation locale va à CONTRESENS du nombre de buts :
// mieux les figures sont installées dans ces lieux, moins il y a de buts
// (7 paires sur 9 à contresens). Le panneau affiche donc les deux
// totaux — somme des installations et nombre de lieux positifs — pour
// que chaque nouveau résultat réel confirme ou casse ce renversement.
// ═══════════════════════════════════════════════════════════════

var LIEUX_MARQUAGE_V7 = [1, 4, 5, 7, 8, 9, 10];

function lectureLieuxMarquageV7(theme) {
  if (!theme || !theme[1]) return { applicable: false, raison: 'Thème non disponible.' };
  const rot = getRotationCombat(theme);
  let liberations = null;
  try { liberations = resoudreLiberationsV7(theme); } catch (e) { liberations = null; }

  // Les sièges R1/R7 s'ajoutent à la liste s'ils tombent hors des sept maisons.
  const maisons = LIEUX_MARQUAGE_V7.slice();
  [rot.hR1, rot.hR7].forEach(function (h) { if (maisons.indexOf(h) < 0) maisons.push(h); });

  const lieux = maisons.map(function (h) {
    const fig = theme[h];
    const profil = profilFigureMaison(fig, h, theme);
    function etatPole(x) {
      if (!x) return { fig: null, libelle: '—', rang: 0 };
      const occ = trouverFigV7(x, theme);
      if (!occ.length) return { fig: x, libelle: 'absent', rang: 0 };
      const base = occ.filter(function (o) { return !o.hidden; });
      return { fig: x, rang: base.length ? 2 : 1,
        libelle: base.length ? ('base ' + base.map(function (o) { return 'M' + o.pos; }).join(' '))
                             : ('résultante ' + occ.length + '×') };
    }
    let active = false;
    try { active = !!elementaireFigureMaison(fig, h).natureLevel.active; } catch (e) { active = false; }
    return {
      house: h, fig: fig,
      estR1: h === rot.hR1, estR7: h === rot.hR7,
      horsListe: LIEUX_MARQUAGE_V7.indexOf(h) < 0,
      installation: Math.round(profil.total * 10) / 10,
      ouverture: OUVERTURE_FIGURE[fig] || '?',
      active: active,
      figureDeButs: !!FIGURES_BUTS_V7[fig],
      etat: liberations && liberations.etat ? (liberations.etat[fig] || '?') : '?',
      antagoniste: etatPole(ANTAGONISTES_V7[fig]),
      protecteur: etatPole(PROTECTEURS_V7[fig]),
      front: etatPole(FRONT_V7[fig])
    };
  });

  // Les deux totaux qui portent le renversement observé.
  const surListe = lieux.filter(function (l) { return !l.horsListe; });
  const somme = Math.round(surListe.reduce(function (s, l) { return s + l.installation; }, 0) * 10) / 10;
  const positifs = surListe.filter(function (l) { return l.installation > 0; }).length;

  return {
    applicable: true, lieux: lieux,
    sommeInstallation: somme, lieuxPositifs: positifs, nbLieux: surListe.length,
    figuresDeButsPresentes: FIGS_V7.filter(function (f) {
      return FIGURES_BUTS_V7[f] && trouverFigV7(f, theme).some(function (o) { return !o.hidden; });
    })
  };
}


// ═══════════════════════════════════════════════════════════════
// LES QUATRE AXES COMME THÈMES DÉRIVÉS (25/08/26, demande Ellemine_D :
// « fais que le verdict suit les thèmes ; si on clique sur un axe, si le
// thème change, le verdict suit la logique du thème »)
//
// Chaque axe a quatre maisons. On prend leurs quatre figures comme quatre
// nouvelles mères et on reconstruit un thème complet — même moteur
// buildThemeFromMothers. Puis on fait tourner sur ce thème dérivé
// EXACTEMENT les mêmes couches que sur le thème principal : ancrage
// R1/R7, lecture des sièges, ouverture des sièges pour le BTTS. Aucune
// règle spéciale, aucun raccourci : c'est le verdict ordinaire appliqué
// à un autre thème.
//
// Le mécanisme n'est pas neuf — themeAxeSuccedent le faisait déjà pour le
// seul Axe Succédent, dont le signal de nul (opposition M13/M14 sur le
// dérivé) est le mieux validé du fichier : 43% de précision contre 24% de
// taux de base, sur 70 matchs archivés. On l'étend aux trois axes et on
// remonte le verdict complet, pas seulement le signal de nul.
//
// ⚠️ AUCUN EFFET SUR LE VERDICT PRINCIPAL. Les axes ont déjà écrasé deux
// fois des couches qui voyaient juste (cf. AXE_SUCCEDENT_DECISIF), et
// Ellemine_D les a débranchés pour cette raison. Ce panneau OBSERVE, il
// ne décide pas.
// ═══════════════════════════════════════════════════════════════

// TROIS axes, pas quatre (25/08/26, correction Ellemine_D) : les douze
// maisons se partagent en exactement trois classes de pas 3, et prolonger
// un axe y ramène (4-7-10-1 = 1-4-7-10). L'ancien Axe Temporel
// M3+M5+M11+M15 mélangeait deux classes et empruntait M15, qui est un
// témoin, hors du carré des douze. Retiré partout, validation comprise.
var AXES_V7 = [
  { cle: 'cardinal',  nom: 'Axe Cardinal',  maisons: [1, 4, 7, 10],  note: 'angulaire' },
  { cle: 'succedent', nom: 'Axe Succédent', maisons: [2, 5, 8, 11],  note: 'succédent — signal de nul validé' },
  { cle: 'cadent',    nom: 'Axe Cadent',    maisons: [3, 6, 9, 12],  note: 'cadent' }
];

function lectureUnAxeV7(theme, axe) {
  const meres = axe.maisons.map(function (h) { return theme[h]; });
  let derive = null;
  try { derive = buildThemeFromMothers(meres[0], meres[1], meres[2], meres[3]); }
  catch (e) { return { cle: axe.cle, nom: axe.nom, applicable: false, raison: 'Thème dérivé impossible.' }; }

  // La figure de l'axe, telle que le panneau de validité la calcule :
  // la combinaison des quatre maisons. Elle doit exister dans le thème
  // initial pour que l'axe soit tenu pour « ancré ».
  let figureAxe = null, ancree = false;
  try {
    figureAxe = combineMany(meres);
    // CORRIGÉ (25/08/26, Ellemine_D : « quand tu vérifies la validation des
    // axes prends en compte les résultantes »). J'avais laissé
    // figureExistsBaseOnly ici alors que les trois fonctions de validité
    // comptent base ET résultante depuis leur alignement. Un axe dont la
    // figure n'existe qu'en résultante était compté comme non ancré.
    ancree = positionsBaseEtResultantes(figureAxe, theme).length > 0;
  } catch (e) { figureAxe = null; }

  // FIABILITÉ (25/08/26, demande Ellemine_D : « pour avoir la fiabilité des
  // thèmes des axes il faut en même temps vérifier les conditions de
  // validation d'un thème »). Le thème dérivé passe le même protocole de
  // validité que le thème principal : ses trois axes doivent exister dans
  // ce thème dérivé. Un dérivé non valide ne mérite pas qu'on le croie.
  let validite = null;
  try { validite = analyzeValidation(derive); } catch (e) { validite = null; }

  const rot = getRotationCombat(derive);
  let ancrage = null, sieges = null, btts = null;
  try { ancrage = analyseAncrageDeveloppe(derive); } catch (e) { ancrage = null; }
  try { sieges = lectureSiegesR1R7(derive); } catch (e) { sieges = null; }
  try { btts = lectureOuvertureButsV7(derive); } catch (e) { btts = null; }

  // Signal de nul : les témoins M13/M14 du thème DÉRIVÉ.
  const m13 = derive[13], m14 = derive[14];
  const temoinsOpposes = ANTAGONISTES_V7[m13] === m14 || ANTAGONISTES_V7[m14] === m13;
  const temoinsIdentiques = m13 === m14;

  return {
    cle: axe.cle, nom: axe.nom, note: axe.note, applicable: true,
    maisons: axe.maisons, meres: meres,
    figureAxe: figureAxe, ancree: ancree,
    derive: derive,
    R1: rot.figR1, R7: rot.figR7, hR1: rot.hR1, hR7: rot.hR7,
    avantage: ancrage && ancrage.applicable ? ancrage.avantage : null,
    ancrageR1: ancrage ? ancrage.ancrageR1 : null,
    ancrageR7: ancrage ? ancrage.ancrageR7 : null,
    critere: ancrage ? ancrage.critere : null,
    siegesWinner: sieges && sieges.applicable ? sieges.winner : null,
    lesDeuxMarquent: btts && btts.applicable ? btts.lesDeuxMarquent : null,
    temoins: { m13: m13, m14: m14, opposes: temoinsOpposes, identiques: temoinsIdentiques },
    valide: !!(validite && validite.valid),
    axesTenus: validite ? validite.checks.filter(function (c) { return c.exists; }).length : 0,
    axesManquants: validite ? validite.checks.filter(function (c) { return !c.exists; })
      .map(function (c) { return c.label.replace(/ \(.*\)/, '') + ' = ' + (FL[c.fig] || c.fig); }) : []
  };
}

// ⚡ 30/08/26 — même mémo par thème : trois appelants relisent les axes du
// même thème, et chacun refaisait les trois lectures de dérivé.
function lectureAxesV7(theme) {
  return memoParThemeV7('axes', theme, function () { return lectureAxesV7Brut(theme); });
}

function lectureAxesV7Brut(theme) {
  if (!theme || !theme[1]) return { applicable: false, raison: 'Thème non disponible.' };
  const axes = AXES_V7.map(function (a) { return lectureUnAxeV7(theme, a); });
  const valides = axes.filter(function (a) { return a.applicable && a.avantage; });
  const pourR1 = valides.filter(function (a) { return a.avantage === 'R1'; }).length;
  const pourR7 = valides.filter(function (a) { return a.avantage === 'R7'; }).length;
  // Le même décompte, restreint aux dérivés qui passent le protocole.
  const fiables = axes.filter(function (a) { return a.applicable && a.avantage && a.valide; });
  const fiableR1 = fiables.filter(function (a) { return a.avantage === 'R1'; }).length;
  const fiableR7 = fiables.filter(function (a) { return a.avantage === 'R7'; }).length;
  let dominationFiable = null;
  if (fiableR1 > fiableR7) dominationFiable = 'R1';
  else if (fiableR7 > fiableR1) dominationFiable = 'R7';
  const nulSignaux = axes.filter(function (a) { return a.applicable && a.temoins.opposes; });
  const ancres = axes.filter(function (a) { return a.applicable && a.ancree; }).length;

  let domination = null;
  if (pourR1 > pourR7) domination = 'R1';
  else if (pourR7 > pourR1) domination = 'R7';

  return {
    applicable: true, axes: axes,
    pourR1: pourR1, pourR7: pourR7, domination: domination,
    nbFiables: fiables.length, fiableR1: fiableR1, fiableR7: fiableR7,
    dominationFiable: dominationFiable,
    validiteTheme: (function () {
      try { const v = analyzeValidation(theme);
        return { valide: v.valid, tenus: v.checks.filter(function (c) { return c.exists; }).length,
          manquants: v.checks.filter(function (c) { return !c.exists; })
            .map(function (c) { return c.label.replace(/ \(.*\)/, ''); }) };
      } catch (e) { return null; }
    })(),
    unanime: valides.length > 0 && (pourR1 === valides.length || pourR7 === valides.length),
    axesAncres: ancres,
    nulSignaux: nulSignaux.map(function (a) { return a.nom; }),
    synthese: valides.length
      ? ('Les axes donnent ' + pourR1 + ' à R1 contre ' + pourR7 + ' à R7'
         + (domination ? ' → ' + domination + (pourR1 === valides.length || pourR7 === valides.length ? ' à l\'unanimité' : ' en majorité') : ' → partagés')
         + ' · ' + nulSignaux.length + ' axe(s) sur 4 montrent des témoins opposés (signal de nul).')
      : 'Aucun axe ne départage.'
  };
}


// Quel axe est déplié — conservé d'un rendu à l'autre.
var __axeDeplie = null;
function basculerAxeV7(cle) {
  __axeDeplie = (__axeDeplie === cle) ? null : cle;
  try { renderAxesPanel(currentTheme); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
}

// « si on clique sur un axe, si le thème change, le verdict suit la
// logique du thème » : on charge les quatre figures de l'axe comme quatre
// mères et on relance. Tout le fichier recalcule alors sur ce thème —
// aucune couche n'est court-circuitée.
