// ═══════════════════════════════════════════════════════════════
// RENDU PANNEAUX VERDICT
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// LE BANC — la grille moteurs × cas, rejouée à chaque affichage.
// C'est le garde-fou : si une modification de doctrine fait tomber un
// moteur, la case devient rouge ici avant qu'on s'en aperçoive ailleurs.
function renderBancPanel() {
  var ancien = document.getElementById('banc-panel');
  if (ancien) ancien.remove();
  var hote = document.getElementById('moteurs-panel')
          || document.getElementById('f4p4-panel')
          || document.getElementById('carte-verdict-r');
  if (!hote || !hote.parentNode) return;

  // Sans forcer : le banc ne dépend pas du thème courant, seulement du
  // code. Le recalculer à chaque rendu coûtait neuf thèmes × onze moteurs
  // par affichage — mesuré, c'est ce qui faisait ramer le rendu.
  var b;
  try { b = bancMoteursV7(); } catch (e) { return; }

  var panneau = document.createElement('div');
  panneau.id = 'banc-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:12px; border:1px solid #0f766e; '
    + 'background:linear-gradient(160deg,#04201d 0%,#0b1220 100%);';

  function entete() {
    return '<tr><th style="text-align:left; padding:4px 6px; font-size:10px; color:#94a3b8;">moteur</th>'
      + b.cas.map(function (c) {
          return '<th style="padding:4px 3px; font-size:9px; color:#94a3b8; white-space:nowrap;" title="'
            + c.nom + (c.score ? ' — ' + c.score : '') + (c.note ? ' · ' + c.note : '') + '">'
            + '<span style="color:' + (c.esport ? '#fbbf24' : c.saisi ? '#5eead4' : '#94a3b8') + ';">'
            + c.nom.slice(0, 5) + (c.esport ? ' ⚡' : '') + '</span></th>';
        }).join('')
      + '<th style="padding:4px 6px; font-size:10px; color:#94a3b8;">score</th></tr>';
  }

  function ligne(m) {
    var pct = m.total ? m.juste / m.total : 0;
    var coul = pct >= 0.85 ? '#4ade80' : pct >= 0.7 ? '#fbbf24' : '#f87171';
    return '<tr style="border-top:1px solid #1e293b;">'
      + '<td style="padding:4px 6px; font-size:10.5px; white-space:nowrap;">'
      + (m.icone || '') + ' ' + m.nom + '</td>'
      + m.details.map(function (d) {
          if (!d.compte) {
            return d.abstenu
              ? '<td style="text-align:center; color:#64748b; font-size:10px;" '
                + 'title="ce moteur ne se prononce pas sur ce thème">–</td>'
              : '<td style="text-align:center; color:#334155; font-size:11px;">·</td>';
          }
          var t = (d.dit === null || d.dit === undefined) ? '—'
                : (d.dit === true ? 'oui' : d.dit === false ? 'non' : d.dit);
          return '<td style="text-align:center; padding:3px 2px;" title="dit ' + t
            + ' · réel ' + (d.reel === true ? 'oui' : d.reel === false ? 'non' : d.reel)
            + (d.ecart != null ? ' · écart ' + d.ecart : '') + '">'
            + '<span style="font-size:12px; color:' + (d.ok ? '#4ade80' : '#f87171') + ';">'
            + (d.ok ? '✔' : '✘') + '</span>'
            + '<div style="font-size:8px; color:#64748b; line-height:1;">' + t
            + (d.ecart != null ? ' <span style="opacity:.7;">±' + d.ecart + '</span>' : '')
            + '</div></td>';
        }).join('')
      + '<td style="text-align:center; padding:4px 6px; font-weight:800; font-size:11px; color:' + coul + ';">'
      + m.juste + '/' + m.total
      + (m.ecartMoyen != null
          ? '<div style="font-size:8px; font-weight:400; color:#64748b;">écart moy. '
            + m.ecartMoyen + '</div>' : '')
      + (m.abstentions
          ? '<div style="font-size:8px; font-weight:400; color:#64748b;">'
            + m.abstentions + ' muet' + (m.abstentions > 1 ? 's' : '') + '</div>' : '')
      + '</td></tr>';
  }

  var lignesCamp = b.camp.slice().sort(function (x, y) {
    if (x.cle === '_vote') return -1;
    if (y.cle === '_vote') return 1;
    return (y.juste / (y.total || 1)) - (x.juste / (x.total || 1));
  }).map(ligne).join('');
  var lignesCond = (b.conditionnels || []).map(ligne).join('');
  var lignesBtts = b.btts.slice().sort(function (x, y) {
    return (y.juste / (y.total || 1)) - (x.juste / (x.total || 1));
  }).map(ligne).join('');
  var lignesInc = (b.incident || []).slice().sort(function (x, y) {
    return (y.juste / (y.total || 1)) - (x.juste / (x.total || 1));
  }).map(ligne).join('');
  var incidentSansCas = (b.incident || []).every(function (m) { return !m.total; });
  var lignesCorners = (b.corners || []).slice().sort(function (x, y) {
    return (y.juste / (y.total || 1)) - (x.juste / (x.total || 1));
  }).map(ligne).join('');
  var cornersSansCas = (b.corners || []).every(function (m) { return !m.total; });
  var lignesCornersDom = (b.cornersDom || []).slice().sort(function (x, y) {
    return (y.juste / (y.total || 1)) - (x.juste / (x.total || 1));
  }).map(ligne).join('');
  var cornersDomSansCas = (b.cornersDom || []).every(function (m) { return !m.total; });

  var reel = '<tr style="border-top:2px solid #0f766e;">'
    + '<td style="padding:4px 6px; font-size:10px; color:#5eead4; font-weight:700;">réel</td>'
    + b.cas.map(function (c) {
        return '<td style="text-align:center; padding:3px 2px; font-size:9px; color:#5eead4;">'
          + (c.score || '—') + '<div style="font-size:8px; color:#64748b;">'
          + (c.camp || '·') + '</div></td>';
      }).join('')
    + '<td></td></tr>';

  panneau.innerHTML =
      '<div style="display:flex; align-items:baseline; gap:10px; margin-bottom:6px; flex-wrap:wrap;">'
    + '<h3 style="margin:0; color:#5eead4;">🧪 Le banc — moteurs × cas réels</h3>'
    + '<span class="muted" style="font-size:10px;">rejoué à chaque affichage, jamais recopié</span></div>'
    + '<div style="font-size:10.5px; margin-bottom:6px;">'
    + '<b>' + b.cas.length + ' cas</b> — ' + b.nbArchive + ' d\'archive'
    + (b.nbSaisis
        ? ' + <b style="color:#5eead4;">' + b.nbSaisis + ' saisi'
          + (b.nbSaisis > 1 ? 's' : '') + '</b> dans tes thèmes sauvegardés'
        : ' · <span style="color:#fbbf24;">aucun match saisi pour l\'instant — '
          + 'renseigne « Score reel » dans un thème sauvegardé, il entre ici automatiquement</span>')
    + (b.nbEsport
        ? ' · <span style="color:#fbbf24;">' + b.nbEsport + ' ⚡ e-sport '
          + '(format arcade — le camp compte, les chiffres non)</span>' : '')
    + '<div style="color:#64748b; margin-top:2px;">Règle d\'archive du 29/08 : un thème qui ne dit '
    + '<b>ni le score ni le vainqueur</b> n\'entre pas ici. Lazio et AmisCarcer ont été retirés à ce '
    + 'titre — ils ne pouvaient rien confirmer ni infirmer, et tous deux tombaient dans les maisons '
    + 'des nuls, ce qui donnait de faux espoirs. Un thème qui dit le vainqueur sans le score reste : '
    + 'il compte pour le camp, et se tait sur les chiffres.</div>'
    + '</div>'
    + (function () {
        // Petit échappement local : renderBancPanel n'a pas de esc() dans
        // sa portée, et les noms d'équipes viennent d'une saisie libre.
        var esc = function (v) {
          return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        };
        var jp = null;
        try { jp = journalPredictionsV7(); } catch (e) { jp = null; }
        // ─── LE GARDE-FOU DE L'ARCHIVE, TOUT EN HAUT (29/08/26) ───
        // Une ligne d'archive qui se contredit fausse silencieusement
        // toutes les familles à la fois. Elle se voit ici ou nulle part.
        var coh = null;
        try { coh = coherenceArchiveV7(); } catch (e) { coh = null; }
        var alerteCoh = '';
        if (coh && coh.soucis && coh.soucis.length) {
          alerteCoh = '<div style="margin:8px 0 12px; padding:9px 11px; border:2px solid #f87171; '
            + 'border-radius:10px; background:rgba(248,113,113,.10);">'
            + '<div style="font-size:12px; font-weight:800; color:#fca5a5;">⚠️ ARCHIVE INCOHÉRENTE — '
            + coh.soucis.length + ' cas sur ' + coh.total + '</div>'
            + '<div style="font-size:10.5px; color:#fecaca; margin-top:3px;">'
            + 'Le score de ces cas contredit leur camp déclaré. Toute l\'archive écrit le score dans '
            + 'l\'ordre <b>R1-R7</b> — le premier nombre est celui du camp 1, jamais celui du vainqueur. '
            + 'Tant que ces lignes ne sont pas corrigées, les familles « score » et « vainqueur » lisent '
            + 'deux vérités différentes.</div>'
            + coh.soucis.map(function (x) {
                return '<div style="font-size:10.5px; color:#fecaca; margin-top:2px;">• <b>' + esc(x.nom)
                  + '</b> — score ' + esc(x.score) + ' (implique ' + esc(x.implique)
                  + ') mais camp déclaré ' + esc(x.declare) + '</div>';
              }).join('')
            + '</div>';
        }
        // ─── LE BALAYAGE MAX-T (05/09/26) ───
        // Le balayage de séparation ci-dessous demande « quel thème
        // croire ». Celui-ci demande autre chose : « une propriété du
        // thème prédit-elle le RÉSULTAT ? » — 297 prédicteurs déclarés
        // d'avance, seuil par permutation de la réalité (max-T de
        // Westfall-Young), qui est la bonne correction quand les
        // prédicteurs sont corrélés entre eux. Il tourne sur
        // tousCasBancV7(), donc sur les thèmes sauvegardés aussi.
        var mxt = null;
        try { mxt = balayageMaxTV7(); } catch (e) { mxt = null; }
        var blocMxt = '';
        if (mxt && mxt.familles && mxt.familles.length) {
          var passe = !!mxt.auMoinsUneSurvivante;
          var colM = passe ? '#4ade80' : '#94a3b8';
          blocMxt = '<div style="margin:8px 0 12px; padding:9px 11px; border:2px solid ' + colM + '; '
            + 'border-radius:10px; background:rgba(15,23,42,.45);">'
            + '<div style="font-size:12px; font-weight:800; color:' + colM + ';">🧪 BALAYAGE MAX-T — '
            + mxt.predicteurs + ' prédicteurs sur ' + mxt.casUtilisables + ' cas</div>'
            + '<div style="font-size:10.5px; color:#cbd5e1; margin-top:3px;">'
            + 'Une propriété du thème prédit-elle le <b>résultat</b> ? On permute la réalité '
            + mxt.permutations + ' fois, on recalcule les ' + mxt.predicteurs + ' corrélations, '
            + 'et on garde le MAXIMUM : c\'est lui le seuil du hasard. Bonferroni serait faux ici, '
            + 'les prédicteurs étant fortement corrélés.</div>'
            + '<table style="width:100%; font-size:11px; border-collapse:collapse; margin-top:6px;">'
            + '<tr style="color:#94a3b8;"><th style="text-align:left; padding:3px 6px;">famille</th>'
            + '<th style="padding:3px 6px;">n</th><th style="text-align:left; padding:3px 6px;">meilleur</th>'
            + '<th style="padding:3px 6px;">rho</th><th style="padding:3px 6px;">seuil</th>'
            + '<th style="padding:3px 6px;">p</th></tr>'
            + mxt.familles.map(function (f) {
                if (f.verdict) return '<tr><td style="padding:3px 6px;">' + esc(f.nom)
                  + '</td><td colspan="5" style="padding:3px 6px; color:#64748b;">' + esc(f.verdict) + '</td></tr>';
                var c2 = f.survit ? '#4ade80' : '#cbd5e1';
                return '<tr><td style="padding:3px 6px; color:' + c2 + ';">' + esc(f.nom) + '</td>'
                  + '<td style="padding:3px 6px; text-align:center;">' + f.n + '</td>'
                  + '<td style="padding:3px 6px; color:#e2e8f0;">' + esc(f.meilleur) + '</td>'
                  + '<td style="padding:3px 6px; text-align:center;">' + f.rho.toFixed(3) + '</td>'
                  + '<td style="padding:3px 6px; text-align:center; color:#94a3b8;">' + f.seuil95.toFixed(3) + '</td>'
                  + '<td style="padding:3px 6px; text-align:center; color:' + c2 + ';">' + f.pFamille.toFixed(3)
                  + (f.survit ? ' ✔' : '') + '</td></tr>';
              }).join('')
            + '</table>'
            + '<div style="font-size:10px; color:' + (passe ? '#4ade80' : '#fbbf24') + '; margin-top:5px;">'
            + esc(mxt.lecture) + '</div>'
            + '<div style="font-size:9.5px; color:#64748b; margin-top:4px;">'
            + 'Le balayage du 05/09 tournait hors du fichier, sur les 56 cas du dépôt seulement, et '
            + 'concluait qu\'il faudrait 100 cas. Celui-ci lit ' + mxt.casDisponibles + ' cas — archive '
            + 'plus tes thèmes sauvegardés. Rejoué à chaque fois que tu saisis un score.</div></div>';
        }
        // ─── LE BALAYAGE DE SÉPARATION (30/08/26) ───
        // « Comment séparer les thèmes qui tiennent le vrai verdict ? »
        // La réponse se recalcule à chaque ouverture du banc.
        var bal = null;
        try { bal = balayageSeparationV7(); } catch (e) { bal = null; }
        var blocBal = '';
        if (bal && bal.lignes.length) {
          var gagne = bal.corrige !== null && bal.corrige < 0.05;
          var col = gagne ? '#4ade80' : '#94a3b8';
          blocBal = '<div style="margin:8px 0 12px; padding:9px 11px; border:2px solid ' + col + '; '
            + 'border-radius:10px; background:rgba(15,23,42,.45);">'
            + '<div style="font-size:12px; font-weight:800; color:' + col + ';">🔎 BALAYAGE DE SÉPARATION — '
            + bal.tests + ' propriétés contre ' + bal.justes + '/' + bal.total + ' verdicts justes</div>'
            + '<div style="font-size:10.5px; color:#cbd5e1; margin-top:3px;">'
            + 'Une seule question, posée à chaque propriété qu\'un thème peut avoir : <b>les thèmes qui '
            + 'l\'ont sont-ils plus souvent justes que ceux qui ne l\'ont pas ?</b> C\'est la question '
            + '« quel thème croire », et elle n\'a pas la même réponse que « ce thème est-il beau ».</div>'
            + '<table style="width:100%; font-size:11px; border-collapse:collapse; margin-top:6px;">'
            + '<tr style="color:#94a3b8;"><th style="text-align:left; padding:3px 6px;">propriété</th>'
            + '<th style="padding:3px 6px;">avec</th><th style="padding:3px 6px;">sans</th>'
            + '<th style="padding:3px 6px;">écart</th><th style="padding:3px 6px;">p</th></tr>'
            + bal.lignes.slice(0, 6).map(function (x) {
                var e = Math.round(100 * x.ecart);
                return '<tr><td style="padding:3px 6px; color:#e2e8f0;">' + esc(x.nom) + '</td>'
                  + '<td style="padding:3px 6px; text-align:center;">' + x.oui + '/' + x.nOui
                  + ' <span style="color:#94a3b8;">' + Math.round(100 * x.tauxOui) + ' %</span></td>'
                  + '<td style="padding:3px 6px; text-align:center;">' + x.non + '/' + x.nNon
                  + ' <span style="color:#94a3b8;">' + Math.round(100 * x.tauxNon) + ' %</span></td>'
                  + '<td style="padding:3px 6px; text-align:center; color:' + (e >= 0 ? '#4ade80' : '#f87171')
                  + ';">' + (e >= 0 ? '+' : '') + e + '</td>'
                  + '<td style="padding:3px 6px; text-align:center;">' + x.p.toFixed(3) + '</td></tr>';
              }).join('')
            + '</table>'
            + '<div style="font-size:10px; color:' + (gagne ? '#4ade80' : '#fbbf24') + '; margin-top:5px;">'
            + (gagne
              ? '✔ Une propriété passe la correction de Bonferroni (p corrigé ' + bal.corrige.toFixed(3)
                + ') : elle sépare vraiment. À vérifier sur les matchs suivants avant de s\'en servir.'
              : '☠️ <b>Aucune propriété ne sépare.</b> Meilleur p brut ' + bal.meilleurP.toFixed(3)
                + ', corrigé pour ' + bal.tests + ' tests : ' + bal.corrige.toFixed(2) + '. Sur ' + bal.tests
                + ' propriétés testées, le hasard seul en donne ' + bal.attenduSous5
                + ' sous p = 0,05 — un joli p brut ne veut donc rien dire ici.')
            + '</div>'
            + '<div style="font-size:10px; color:#94a3b8; margin-top:4px;">'
            + 'Les plus gros écarts pointent souvent <b>à l\'envers</b> : plus le thème a de signal, moins '
            + 'il est juste. Même inversion que sur les dérivés d\'axe (1 axe 83 %, 2 axes 86 %, 3 axes '
            + '59 %). Je n\'ai pas d\'explication — seulement le fait qu\'elle se répète.'
            + '</div></div>';
        }
        // ─── L'ARBITRAGE DES MOTEURS (30/08/26) ───
        // « Il y a trop de contradiction » — oui, et voici ce que valent
        // les deux façons de trancher.
        var arb = null;
        try { arb = arbitrageMoteursV7(); } catch (e) { arb = null; }
        var blocArb = '';
        if (arb && arb.n) {
          var np = arb.divPilote[0] + arb.divPilote[1];
          var nu = arb.unanime[0] + arb.unanime[1];
          var nuc = arb.unanimeContre[0] + arb.unanimeContre[1];
          blocArb = '<div style="margin:8px 0 12px; padding:9px 11px; border:2px solid #94a3b8; '
            + 'border-radius:10px; background:rgba(15,23,42,.45);">'
            + '<div style="font-size:12px; font-weight:800; color:#cbd5e1;">⚔️ ARBITRAGE DES MOTEURS — '
            + 'le pilote contre la majorité des six autres</div>'
            + '<div style="font-size:11px; color:#e2e8f0; margin-top:5px; line-height:1.6;">'
            + 'les critères <b>(le pilote, ce qui s\'affiche)</b> — <b>' + arb.pilote[0] + '/' + arb.n + '</b><br>'
            + 'la <b>majorité</b> des six autres moteurs — <b>' + arb.majorite[0] + '/' + arb.n + '</b><br>'
            + 'ils divergent sur <b>' + np + '</b> matchs : le pilote a raison <b>' + arb.divPilote[0] + '/' + np
            + '</b>, la majorité <b>' + arb.divMajorite[0] + '/' + np + '</b> — <b style="color:#f87171;">p = '
            + arb.p.toFixed(3) + '</b>'
            + (nu ? '<br>quand les six autres sont <b>unanimes</b> (' + nu + ' cas) : <b>' + arb.unanime[0] + '/' + nu + '</b>'
                + (nuc ? ', et unanimes <b>contre</b> le pilote (' + nuc + ' cas) : <b>' + arb.unanimeContre[0] + '/' + nuc + '</b>' : '')
              : '')
            + '</div>'
            + '<div style="font-size:10px; color:#fbbf24; margin-top:5px; line-height:1.55;">'
            + '☠️ <b>La contradiction n\'est pas une énigme à résoudre, c\'est du bruit.</b> Suivre le pilote, '
            + 'suivre la majorité ou tirer à pile ou face donnent la même chose. Ces moteurs lisent tous les '
            + 'mêmes seize figures par des chemins voisins : quand le thème penche, ils penchent ensemble, '
            + 'juste ou faux. <b>Leur accord n\'est pas une confirmation — c\'est le même avis compté six fois.</b>'
            + '</div>'
            + (arb.divergences.length
              ? '<div style="font-size:10px; color:#94a3b8; margin-top:5px;">'
                + arb.divergences.map(function (d) {
                    return '• <b>' + esc(d.nom) + '</b> — pilote ' + d.pilote + ' · majorité ' + d.majorite
                      + ' (' + d.force + ') · réel ' + d.reel + ' → <b style="color:'
                      + (d.bon === 'majorité' ? '#4ade80' : '#60a5fa') + ';">' + d.bon + '</b>';
                  }).join('<br>')
                + '</div>'
              : '')
            + '</div>';
        }
        // ─── CE QUE LA VALIDITÉ GOUVERNE (30/08/26) ───
        var vpf = null;
        try { vpf = validiteParFamilleV7(); } catch (e) { vpf = null; }
        var blocVpf = '';
        if (vpf && vpf.lisibles) {
          blocVpf = '<div style="margin:8px 0 12px; padding:9px 11px; border:2px solid #94a3b8; '
            + 'border-radius:10px; background:rgba(15,23,42,.45);">'
            + '<div style="font-size:12px; font-weight:800; color:#cbd5e1;">🗓️ CE QUE LA VALIDITÉ GOUVERNE — '
            + 'famille par famille</div>'
            + '<div style="font-size:10.5px; color:#cbd5e1; margin-top:3px;">'
            + 'Les thèmes que le filtre GARDE font-ils mieux que ceux qu\'il JETTE ? Une ligne par famille, '
            + 'parce que la validité pourrait gouverner le camp sans gouverner l\'incident.</div>'
            + '<table style="width:100%; font-size:11px; border-collapse:collapse; margin-top:6px;">'
            + '<tr style="color:#94a3b8;"><th style="text-align:left; padding:3px 6px;">famille</th>'
            + '<th style="padding:3px 6px;">gardés</th><th style="padding:3px 6px;">jetés</th>'
            + '<th style="padding:3px 6px;">écart</th><th style="padding:3px 6px;">p</th></tr>'
            + vpf.lignes.map(function (x) {
                if (!x.lisible) {
                  return '<tr><td style="padding:3px 6px; color:#e2e8f0;">' + esc(x.nom) + '</td>'
                    + '<td colspan="4" style="padding:3px 6px; text-align:center; color:#64748b;">effectif trop faible</td></tr>';
                }
                var e = Math.round(100 * x.ecart);
                return '<tr><td style="padding:3px 6px; color:#e2e8f0;">' + esc(x.nom) + '</td>'
                  + '<td style="padding:3px 6px; text-align:center;">' + x.val[0] + '/' + x.nVal
                  + ' <span style="color:#94a3b8;">' + Math.round(100 * x.tauxVal) + ' %</span></td>'
                  + '<td style="padding:3px 6px; text-align:center;">' + x.rej[0] + '/' + x.nRej
                  + ' <span style="color:#94a3b8;">' + Math.round(100 * x.tauxRej) + ' %</span></td>'
                  + '<td style="padding:3px 6px; text-align:center; color:' + (e > 0 ? '#4ade80' : '#f87171')
                  + ';">' + (e >= 0 ? '+' : '') + e + '</td>'
                  + '<td style="padding:3px 6px; text-align:center;">' + x.p.toFixed(3) + '</td></tr>';
              }).join('')
            + '</table>'
            + '<div style="font-size:10px; color:' + (vpf.pencheRejet >= vpf.lisibles ? '#f87171' : '#fbbf24')
            + '; margin-top:5px; line-height:1.55;">'
            + (vpf.pencheRejet >= vpf.lisibles
              ? '☠️ <b>' + vpf.lisibles + ' familles sur ' + vpf.lisibles + ', l\'écart penche du côté des thèmes JETÉS.</b> '
                + 'Pas une seule ne va dans l\'autre sens. Rien n\'est significatif — mais un filtre censé garder les bons '
                + 'thèmes qui perd partout, ce n\'est plus « non démontré », c\'est « jamais vu marcher ».'
              : vpf.pencheRejet + ' familles sur ' + vpf.lisibles + ' penchent du côté des thèmes jetés.')
            + '</div>'
            + '<div style="font-size:10px; color:#94a3b8; margin-top:4px;">'
            + '➜ <b>Pas de rejet par famille.</b> On ne raffine pas un signal qui n\'existe dans aucune famille. '
            + 'Le filtre reste branché parce que c\'est un choix assumé, pas parce qu\'il est démontré.'
            + '</div></div>';
        }
        var tete = alerteCoh + blocMxt + blocBal + blocArb + blocVpf + '<div style="margin:8px 0 12px; padding:9px 11px; border:2px solid #fbbf24; '
          + 'border-radius:10px; background:rgba(251,191,36,.07);">'
          + '<div style="font-size:12px; font-weight:800; color:#fbbf24;">📓 JOURNAL DES PRÉDICTIONS GELÉES</div>'
          + '<div style="font-size:10.5px; color:#cbd5e1; margin-top:3px;">'
          + 'Le tableau ci-dessous <b>rejoue</b> les moteurs d\'aujourd\'hui sur toute l\'archive. Chaque fois '
          + 'qu\'une règle est corrigée après un raté — la porte du nul l\'a été deux fois, à +4 puis à +6 — '
          + 'ces chiffres remontent, et ils remontent forcément : la règle a été taillée sur ces cas-là. '
          + '<b>Un score de banc ne prouve pas qu\'on prédit, il prouve qu\'on décrit le passé sans se '
          + 'contredire.</b> Le journal, lui, compare le verdict <b>gelé à l\'enregistrement</b> au score saisi '
          + 'plus tard : rien ne peut le flatter après coup.</div>';
        if (!jp || !jp.campTotal) {
          return tete + '<div style="font-size:11px; color:#fbbf24; margin-top:6px;">'
            + '<b>Journal vide.</b> Il se remplit tout seul : enregistre un thème AVANT le match, puis saisis '
            + '« Score reel » quand tu le connais. Tant qu\'il est vide, aucun chiffre de ce fichier n\'est une '
            + 'preuve de prédiction — c\'est la phrase la plus importante du projet.</div></div>';
        }
        return tete
          + '<div style="display:flex; gap:18px; flex-wrap:wrap; margin-top:7px; font-size:12px;">'
          + '<div><b style="color:#4ade80; font-size:16px;">' + jp.campJuste + '/' + jp.campTotal + '</b>'
          + ' <span style="color:#94a3b8;">camp annoncé avant le match</span></div>'
          + '<div><b style="color:#4ade80; font-size:16px;">' + jp.scoreJuste + '/' + jp.scoreTotal + '</b>'
          + ' <span style="color:#94a3b8;">score exact</span></div>'
          + (jp.nulTotal ? '<div><b style="color:#4ade80; font-size:16px;">' + jp.nulJuste + '/' + jp.nulTotal + '</b>'
            + ' <span style="color:#94a3b8;">nul / pas nul</span></div>' : '')
          + '</div>'
          + '<table style="width:100%; margin-top:7px; font-size:10.5px; border-collapse:collapse;">'
          + jp.lignes.slice(0, 25).map(function (x) {
              return '<tr><td style="padding:3px 4px; color:#64748b;">' + esc(x.quand) + '</td>'
                + '<td style="padding:3px 4px;">' + esc(x.equipes) + '</td>'
                + '<td style="padding:3px 4px;">annoncé <b>' + esc(x.ditCamp) + '</b> ' + esc(x.ditScore) + '</td>'
                + '<td style="padding:3px 4px;">réel <b>' + esc(x.reelCamp) + '</b> ' + esc(x.reelScore) + '</td>'
                + '<td style="padding:3px 4px; color:' + (x.campJuste ? '#4ade80' : '#f87171') + ';">'
                + (x.campJuste ? '✔ camp' : '✘ camp') + (x.scoreJuste ? ' ✔ score' : '') + '</td></tr>';
            }).join('')
          + '</table></div>';
      })()
    + '<div style="overflow-x:auto;"><table style="border-collapse:collapse; width:100%; min-width:520px;">'
    + '<thead>' + entete() + '</thead><tbody>'
    + lignesCamp
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Règles conditionnelles '
    + '<span style="font-weight:400; color:#64748b;">— elles ne votent pas, elles ne parlent '
    + 'que sur leur motif ; « – » = muet</span></td></tr>'
    + lignesCond
    + reel
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Les deux marquent'
    + ' <span style="font-weight:400; color:#64748b;">— <b style="color:#f87171;">aucune règle ne marche ici</b> : '
    + 'toutes les lectures par l\'ouverture sont au niveau du témoin « jamais » (13/22) ou en dessous. Réfutation '
    + 'exacte : le 0-0 du 14/02 et Jeudi 27/08 (1-2) ont le MÊME couple de sièges fixes — M1 Carcer fermée-passive, '
    + 'M7 Conjonctio fermée-active — pour des résultats opposés. Et rien ne prédit le nombre de buts : ancrage '
    + 'r = 0,00, figures actives r = 0,35 sur 22 cas</span></td></tr>'
    + lignesBtts
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Penalty / carton rouge'
    + (incidentSansCas
        ? ' <span style="color:#fbbf24; font-weight:400;">— aucun cas : renseigne « Rouge/pénalty ? » '
          + 'dans tes thèmes sauvegardés, ces trois lignes se rempliront seules</span>' : '')
    + '</td></tr>'
    + lignesInc
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Incident — qui encaisse'
    + ' <span style="font-weight:400; color:#64748b;">— étude du 28/08 : le siège qui '
    + 'engendre Mars ; se tait sur 81 % des thèmes</span></td></tr>'
    + (b.incidentCamp || []).map(ligne).join('')
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Penalty — qui concède'
    + ' <span style="font-weight:400; color:#64748b;">— étude du 28/08 : Mars qui naît en M12, '
    + 'la surface de réparation ; à lire avec le témoin juste en dessous</span></td></tr>'
    + (b.penaltyCamp || []).map(ligne).join('')
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">But dans les deux mi-temps'
    + ' <span style="font-weight:400; color:#64748b;">— demande le score à la pause ET le score final ; '
    + 'saisis « Mi-temps ex: 1-0 » dans tes thèmes sauvegardés. Attention : l\'hypothèse « M1/M7 puis R1/R7 » '
    + 'dit OUI sur 100 % des thèmes — elle est identique au témoin constant</span></td></tr>'
    + (b.miTemps || []).map(ligne).join('')
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">1re mi-temps — les deux marquent'
    + ' <span style="font-weight:400; color:#64748b;">— l\'affirmation forte de htWinner, séparée le 28/08 '
    + 'de la question faible « y a-t-il eu un but avant la pause »</span></td></tr>'
    + (b.miTempsDeux || []).map(ligne).join('')
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Nul'
    + ' <span style="font-weight:400; color:#64748b;">— <b style="color:#22c55e;">LES DEUX PORTES d\'Ellemine_D '
    + 'battent tout, témoin compris : 34/37, 8 nuls sur 9, deux faux positifs, contre 28/37 pour le témoin.</b> Le nul ne se lit pas pareil '
    + 'selon la boucle : en MÊME BOUCLE il passe par l\'alliance (R7 binôme de R1, +2), en BOUCLES OPPOSÉES par '
    + '+11, le front du front de la victime. La table des pôles ne sait faire que la première — son code ne peut '
    + 'littéralement pas annoncer un nul en boucles opposées, et c\'est là qu\'étaient les deux nuls que rien '
    + 'n\'attrapait. La forme branchée est élargie à {+2, +4, +6} : elle attrape 8 nuls sur 9, au prix de deux '
    + 'faux positifs (PuerCaput, TristPop) — tous deux hors maison cadente, ce que le croisement rattrape. '
    + 'Le nul qu\'elle rate (FortMajTrist, 30/08) est à +9 en boucles opposées, où seul +11 ouvre. '
    + 'Le faisceau reste utile en gradation, et son échelle est désormais recalculée sur l\'archive à chaque '
    + 'ouverture au lieu d\'être recopiée à la main — elle l\'était, et elle annonçait encore 40 % à quatre '
    + 'signaux là où l\'archive dit 0 sur 2. Les fractions se lisent dans le panneau du thème'
    + '</span>'
    + ' <span style="font-weight:400; color:#64748b;">— <b style="color:#fbbf24;">la maison ratisse, la figure '
    + 'confirme.</b> À 3 nuls, « R1 en maison cadente » les attrapait tous les trois ; à 9 nuls elle en attrape '
    + '5 pour 5 faux positifs (50 % de précision). Elle dit donc « méfie-toi », jamais « c\'est nul » — et c\'est '
    + 'exactement à ce titre qu\'elle sert : croisée avec la porte, elle écarte les DEUX faux positifs de '
    + 'celle-ci. Ce qui repose sur la nature des figures (binôme, juge partagé) crie beaucoup moins à tort mais '
    + 'rate davantage : 2 nuls sur 3 déclenchements pour le binôme, 4 sur 6 pour le juge partagé</span></td></tr>'
    + (b.nul || []).map(ligne).join('')
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Match serr\u00e9 (\u00e9cart de buts \u2264 1)'
    + ' <span style="font-weight:400; color:#64748b;">\u2014 les SEPT cas o\u00f9 R1 tombe en maison cadente sont serr\u00e9s : '
    + '\u00e9cart moyen 0,57 contre 2,05 partout ailleurs. Quand ce moteur ose le oui il ne s\'est jamais tromp\u00e9, '
    + '7 fois sur 7 \u2014 en revanche il rate 12 des 19 serr\u00e9s. C\'est le signal le plus s\u00fbr du fichier : '
    + 'R1 en maison cadente veut dire <b>ne crois pas \u00e0 un gros score</b>, quel que soit l\'\u00e9cart annonc\u00e9 '
    + 'par le moteur de camp</span></td></tr>'
    + (b.serre || []).map(ligne).join('')
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Corners '
    + '<span style="font-weight:400; color:#64748b;">— juste si l\'écart au réel ≤ '
    + BANC_TOLERANCE_CORNERS_V7 + '</span>'
    + (cornersSansCas
        ? ' <span style="color:#fbbf24; font-weight:400;">— aucun cas : renseigne « Corners réels » '
          + 'dans tes thèmes sauvegardés</span>' : '')
    + '</td></tr>'
    + lignesCorners
    + '<tr><td colspan="' + (b.cas.length + 2) + '" style="padding:8px 6px 3px; font-size:10px; '
    + 'font-weight:700; color:#94a3b8;">Corners — qui domine'
    + (cornersDomSansCas
        ? ' <span style="color:#fbbf24; font-weight:400;">— aucun cas : il faut les DEUX côtés '
          + 'saisis pour qu\'un dominant existe</span>' : '')
    + '</td></tr>'
    + lignesCornersDom
    + '</tbody></table></div>'
    + '<div style="margin-top:10px; padding:7px 9px; border:1px solid #7f1d1d; border-radius:8px; '
    + 'background:rgba(127,29,29,.12);">'
    + '<div style="font-size:10.5px; font-weight:700; color:#fca5a5; margin-bottom:3px;">'
    + '⚠ Le profil du score — pourquoi le score exact ne tombe jamais</div>'
    + '<div id="banc-score-profil" style="font-size:9.5px; color:#cbd5e1;">'
    + (_profilScoreV7 ? htmlProfilScoreV7(_profilScoreV7)
                      : '<span class="muted">mesure en cours…</span>')
    + '</div></div>'
    + '<div class="hint" style="margin-top:9px; font-size:9px;">'
    + 'Les colonnes <span style="color:#5eead4;">en vert</span> sont les matchs que tu as saisis : '
    + 'chaque « Score reel » renseigné dans un thème sauvegardé entre ici tout seul, et renote les '
    + 'moteurs sans qu\'on touche au code. '
    + 'Un point gris = le cas ne compte pas pour ce moteur (un nul, un score inconnu, '
    + 'des corners non saisis). Sur les corners, « toujours 10 » ne lit pas le thème : c\'est la '
    + 'moyenne d\'un match. Un moteur qui ne le bat pas ne lit rien — c\'est le rôle qu\'a joué '
    + '« BTTS toujours oui » pour les deux autres lectures. La tolérance de ±'
    + BANC_TOLERANCE_CORNERS_V7 + ' est un choix, calibré sur rien. '
    + (function () {
        // Compté, plus écrit en dur : la phrase disait « sept cas » alors
        // que le banc en avait huit. Un chiffre à la main ne suit pas les
        // données — c'est la leçon même qui a fait naître ce banc.
        var d = b.cas.filter(function (c) { return c.camp === 'R1' || c.camp === 'R7'; }).length;
        var e = b.cas.filter(function (c) { return c.esport; }).length;
        return d + ' cas décisifs seulement' + (e ? ' (dont ' + e + ' e-sport)' : '')
          + ' : à ce nombre, un moteur au-dessus de la moitié ne se distingue pas encore d\'un '
          + 'tirage à pile ou face, et le meilleur de neuf moteurs est attendu haut par simple '
          + 'sélection. ';
      })()
    + 'Ce tableau sert à VOIR UNE RÉGRESSION, pas à couronner '
    + 'un moteur. Il a été construit après en avoir manqué une : le 26/08, un changement d\'échelle dans '
    + 'forceCampV7 a fait tomber chaîne, ancrage et duel de 5/7 à 3–4/7 sans que rien ne l\'affiche.</div>';
  hote.parentNode.insertBefore(panneau, hote.nextSibling);
  // une seule fois par session, après le rendu
  try { profilScoreV7(); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
}

// ═══════════════════════════════════════════════════════════════
// PANNEAU DU MOTEUR F4P4 — la démarche d'Ellemine_D, rendue lisible.
// Trois temps par camp : la centrale à son siège, ses quatre pôles avec
// leur résistance, puis la centrale jugée par la même mesure.
function renderF4P4Panel(theme) {
  const ancien = document.getElementById('f4p4-panel');
  if (ancien) ancien.remove();
  if (!theme) return;
  const hote = document.getElementById('duel-bouclier-panel')
            || document.getElementById('lieux-marquage-panel')
            || document.getElementById('carte-verdict-r');
  if (!hote || !hote.parentNode) return;

  const panneau = document.createElement('div');
  panneau.id = 'f4p4-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:10px; border:1px solid #7c3aed;';

  let m = null;
  try { m = moteurF4P4V7(theme); } catch (e) { m = null; }
  if (!m || !m.applicable) {
    panneau.innerHTML = '<h3 style="margin-bottom:2px;">🧭 Front 4 · Pôle 4</h3>'
      + '<div class="muted" style="font-size:11.5px;">' + ((m && m.raison) || 'Non applicable.') + '</div>';
    hote.parentNode.insertBefore(panneau, hote.nextSibling);
    return;
  }
  const nom = function (f) { return f ? (FL[f] || f) : '—'; };

  // ─── PANNEAU RÉÉCRIT LE 27/08/26 ───
  // L'ancien affichage lisait la forme de campF4P4V7 (marge, tient,
  // force, polesAssaillant) alors que moteurF4P4V7 renvoie, depuis le
  // passage aux cinq étapes, la forme de reseauF4P4V7 (profil, réseau,
  // solide, frappes). Il levait donc une exception à chaque rendu et
  // n'affichait RIEN. Il montre maintenant ce que le moteur décide
  // vraiment : les cinq étapes, dans l'ordre.
  function pastille(ok, txt) {
    return '<span style="font-size:8.5px; font-weight:700; padding:1px 5px; border-radius:6px; '
      + 'background:' + (ok ? 'rgba(74,222,128,.14)' : 'rgba(248,113,113,.12)') + '; '
      + 'color:' + (ok ? '#4ade80' : '#f87171') + ';">' + txt + '</span>';
  }

  function lignePole(p) {
    if (!p) return '';
    var maisons = (p.positions || []).map(function (o) {
      return 'M' + o.pos + (o.resultante ? 'r' : '');
    }).join(' ') || '—';
    return '<div style="display:flex; gap:6px; align-items:baseline; font-size:10px; '
      + 'padding:2px 0; border-bottom:1px solid rgba(51,65,85,.5);">'
      + '<span class="muted" style="min-width:76px; font-size:8.5px;">' + p.role + '</span>'
      + '<span style="flex:1;">' + nom(p.fig)
      + ' <span class="muted" style="font-size:8.5px;">' + maisons + '</span></span>'
      + '<span style="min-width:52px; text-align:right; font-weight:700; color:'
      + (p.ancrage >= F4P4_SEUIL_ANCRAGE_V7 ? '#e2e8f0' : '#64748b') + ';">' + p.ancrage + '</span>'
      + '<span style="min-width:30px; text-align:right; font-size:9px; color:'
      + (p.renfort >= F4P4_SEUIL_RENFORT_V7 ? '#94a3b8' : '#64748b') + ';">' + p.renfort + '/4</span>'
      + '<span style="min-width:52px; text-align:right;">' + pastille(p.solide, p.solide ? 'SOLIDE' : '—') + '</span>'
      + '</div>'
      + (p.solide ? '' : '<div class="muted" style="font-size:8px; margin:0 0 2px 82px;">' + (p.motif || '') + '</div>');
  }

  function colonne(cote, c) {
    const g = c.regeneration;
    const teinte = cote === 'R1' ? '#38bdf8' : '#fb923c';
    let h = '<div style="flex:1; min-width:270px;">'
      // ÉTAPE 1 et 2 — la centrale à son siège, et sa boucle
      + '<div style="font-size:12px; font-weight:700; margin-bottom:3px; color:' + teinte + ';">'
      + cote + ' · ' + nom(c.fig)
      + ' <span class="muted" style="font-weight:400; color:#94a3b8;">en M' + c.siege
      + ' · boucle ' + c.boucle + '</span></div>'
      + '<div style="font-size:9.5px; margin-bottom:4px; color:#94a3b8;">concordance <b>' + c.concordance
      + '</b> · alignement <b>' + c.alignement + '/2</b>'
      + ((c.lignesCompatibles || []).length
          ? ' <span class="muted">(' + c.lignesCompatibles.join(' + ') + ')</span>' : '')
      + '</div>';
    if (g) {
      h += '<div style="font-size:9px; color:' + (g.dansReseau ? '#4ade80' : '#f87171') + '; margin-bottom:6px;">'
        + '↻ régénère <b>' + nom(g.resultante) + '</b> — ' + g.role
        + (g.dansReseau ? ' · réseau, ' + g.pas + ' pas' : ' · HORS réseau') + '</div>';
    }
    // ÉTAPES 3 et 4 — chaque pôle mesuré aux sept critères, puis son réseau
    h += '<div style="display:flex; gap:6px; font-size:8px; color:#64748b; '
      + 'border-bottom:1px solid #334155; padding-bottom:2px;">'
      + '<span style="min-width:76px;">pôle</span><span style="flex:1;">figure et maisons</span>'
      + '<span style="min-width:52px; text-align:right;">profil</span>'
      + '<span style="min-width:30px; text-align:right;">réseau</span>'
      + '<span style="min-width:52px; text-align:right;">étape 4</span></div>';
    h += lignePole(c.centrale);
    c.poles.forEach(function (p) { h += lignePole(p); });
    h += '<div style="margin-top:5px; font-size:11px; font-weight:700;">'
      + c.solides + '/4 pôles solides'
      + ' <span class="muted" style="font-weight:400; font-size:9.5px;">· ancrage total '
      + c.ancrageTotal + '</span></div>';
    // LA FRAPPE — ce que ce camp atteint chez l'autre
    var portees = (c.frappes || []).filter(function (f) { return f && f.viseCamp; });
    h += '<div style="margin-top:6px; padding-top:4px; border-top:1px dashed #334155;">'
      + '<div style="font-size:9.5px; color:#fb7185; margin-bottom:2px;">⚔ ce que ce camp frappe en face — '
      + '<b>' + c.frappesEffectives + ' portée' + (c.frappesEffectives > 1 ? 's' : '') + '</b>'
      + ' <span class="muted">· somme ' + c.frappeSomme + '</span></div>'
      + (portees.length
          ? portees.map(function (f) {
              return '<div style="font-size:8.5px; margin-left:6px; color:'
                + (f.effective ? '#4ade80' : '#94a3b8') + ';">' + f.resume + '</div>';
            }).join('')
          : '<div style="font-size:8.5px; margin-left:6px; color:#64748b;">aucune frappe n\'atteint le camp adverse</div>')
      + '</div>';
    // ÉTAPE 5 — le réseau de l'assaillant direct
    h += '<div style="margin-top:5px; padding-top:4px; border-top:1px solid #334155; font-size:9.5px;">'
      + '<span class="muted">étape 5 · son assaillant direct</span> <b>' + nom(c.antagoniste) + '</b> — '
      + pastille(c.solidesAdverse < 2, c.solidesAdverse + '/4 pôles solides')
      + '</div></div>';
    return h;
  }

  // ─── LE DÉCALAGE OBLIQUE (28/08/26) ───
  // Il ne dépend que de l'écart entre les deux centrales, et il dit AVANT
  // tout chiffre si les camps peuvent seulement se toucher.
  // m.figR1 n'existe pas sur le chemin des cinq étapes — les figures
  // viennent des réseaux. Et renderF4P4Panel n'a pas d'esc() local : le
  // panneau levait « esc is not defined » et n'affichait plus RIEN.
  // C'est le même défaut qu'en juillet, attrapé au test cette fois.
  var esc = function (v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var dec = null;
  try {
    dec = decalageCampsV7(m.R1 ? m.R1.fig : null, m.R7 ? m.R7.fig : null);
  } catch (e) { dec = null; }
  var decHtml = '';
  if (dec) {
    var lignesDec = function (l, coul, qui) {
      return l.length
        ? '<div style="font-size:9px; color:' + coul + ';">' + qui + ' : '
          + l.map(function (x) { return x.de + ' → ' + x.vers; }).join(' · ') + '</div>'
        : '<div style="font-size:9px; color:#64748b;">' + qui + ' : aucune frappe n\'atteint le camp adverse</div>';
    };
    decHtml = '<div style="margin:6px 0 8px; padding:7px 9px; border-radius:8px; '
      + 'background:rgba(96,165,250,.10); border:1px solid ' + (dec.memeBoucle ? '#475569' : '#2563eb') + ';">'
      + '<div style="font-size:10.5px; font-weight:700; color:#93c5fd;">⚔ ' + esc(dec.resume) + '</div>'
      + (dec.memeBoucle
          ? '<div style="font-size:9px; color:#94a3b8; margin-top:3px;">'
            + 'Les cinq rôles sont à des décalages pairs, la victime est à +3, impair : '
            + 'deux camps de la même boucle ne peuvent pas se toucher. C\'est pourquoi '
            + 'l\'étape 1 confie alors la décision aux antagonistes directs.</div>'
          : lignesDec(dec.liaisonsR1, '#7dd3fc', 'R1') + lignesDec(dec.liaisonsR7, '#fdba74', 'R7'))
      // ─── LE DRAPEAU « CAS DÉCISIF » (28/08/26) ───
      // Quand le décalage et le verdict se contredisent, ce thème-là
      // vaut plus que les autres : son résultat réel tranche une
      // question ouverte. On le signale pour qu'il soit saisi.
      // La comparaison se fait avec la lecture des sièges, qui est au
      // volant : c'est le verdict affiché sur 93 % des thèmes, et elle
      // coûte 0,03 ms là où recalculer tout le verdict en coûterait 47.
      + (function () {
          if (!dec.avantage) return '';
          var sg = null;
          try { sg = lectureSiegesR1R7(theme); } catch (e) { return ''; }
          if (!sg || !sg.applicable || !sg.winner) return '';
          if (sg.winner === dec.avantage) return '';
          return '<div style="margin-top:5px; padding:4px 7px; border-radius:6px; '
            + 'background:rgba(250,204,21,.14); border:1px solid #facc15; '
            + 'font-size:9.5px; color:#fde68a;">'
            + '⚑ <b>CAS DÉCISIF</b> — le décalage donne l\'avantage à ' + esc(dec.avantage)
            + ' et les sièges annoncent ' + esc(sg.winner) + '. '
            + (dec.avantage === 'R7'
                ? 'Et l\'archive n\'a AUCUN cas où le décalage favorise R7 : '
                  + 'ce match comblerait un angle mort. '
                : '')
            + 'Saisis son résultat, il tranchera.</div>';
        })()
      + '</div>';
  }

  // ─── LA CENTRALE ADVERSE DANS LE CAMP (28/08/26) ───
  // Signalé à l'écran parce qu'aucun chiffre du panneau ne le montrait :
  // en même boucle, l'un des deux chefs est TOUJOURS un rôle du camp de
  // l'autre, et il compte parmi ses pôles.
  let alerteContamination = '';
  try {
    const ct = contaminationCampsV7(m.figR1, m.figR7);
    if (ct && ct.contamine) {
      const solR7 = m.R1.poles.some(function (p) { return p.fig === m.figR7 && p.solide; });
      const solR1 = m.R7.poles.some(function (p) { return p.fig === m.figR1 && p.solide; });
      alerteContamination = '<div style="margin:6px 0 8px; border:1px solid #f59e0b; border-radius:9px; '
        + 'padding:8px 10px; background:rgba(120,53,15,.18); font-size:11px; color:#fde68a;">'
        + '<b>⚠ La centrale adverse siège dans le camp.</b> '
        + (ct.roleR7DansR1 ? nom(m.figR7) + ' (R7) est le <b>' + ct.roleR7DansR1 + '</b> de R1'
            + (solR7 ? ' — et il y est compté SOLIDE' : '') + '. ' : '')
        + (ct.roleR1DansR7 ? nom(m.figR1) + ' (R1) est le <b>' + ct.roleR1DansR7 + '</b> de R7'
            + (solR1 ? ' — et il y est compté SOLIDE' : '') + '. ' : '')
        + ct.partages.length + '/5 rôles sont communs aux deux camps. '
        + 'C\'est structurel : en même boucle c\'est TOUJOURS le cas (8 décalages pairs sur 8), '
        + 'parce qu\'une boucle se coupe en deux quatuors de front disjoints — le binôme n\'est '
        + 'jamais dans le quatuor de sa figure. Le banc mesure la lecture qui retire ce pôle '
        + '(« F4P4 sans la centrale adverse ») : elle change 3,8 % des verdicts.'
        + '</div>';
    }
  } catch (e) { alerteContamination = ''; }

  panneau.innerHTML = '<h3 style="margin-bottom:2px;">🧭 Front 4 · Pôle 4</h3>'
    + decHtml
    + alerteContamination
    + '<div class="muted" style="font-size:10px; margin-bottom:7px;">'
    + 'La démarche en cinq étapes, dans l\'ordre. <b>profil</b> = les sept '
    + 'critères d\'analyse à la meilleure position (seuil ' + F4P4_SEUIL_ANCRAGE_V7 + ') ; '
    + '<b>réseau</b> = combien des quatre pôles de ce pôle-là sont eux-mêmes ancrés '
    + '(étape 4, seuil ' + F4P4_SEUIL_RENFORT_V7 + ') ; un pôle n\'est <b>SOLIDE</b> '
    + 'que s\'il tient les deux. Le 4e pôle est le front du front, et le binôme est '
    + 'toujours le bouclier de ce front du front.</div>'
    + '<div style="display:flex; gap:14px; flex-wrap:wrap;">'
    + colonne('R1', m.R1) + colonne('R7', m.R7)
    + '</div>'
    + '<div style="margin-top:8px; font-size:11.5px; font-weight:700; color:#c4b5fd;">'
    + 'Verdict F4P4 : ' + (m.avantage || 'nul') + '</div>'
    + '<div class="muted" style="font-size:9.5px;">' + m.critere + '</div>'
    + '<div class="hint" style="margin-top:6px; font-size:9px;">'
    + 'Depuis le 27/08, F4P4 n\'est plus seul au volant : le VERDICT DU MATCH est '
    + 'rendu par le <b>vote des huit moteurs</b>, et F4P4 ne départage qu\'en cas '
    + 'd\'égalité (7 % des thèmes). Justesse rejouée sur le banc : <b>'
    + (function () {
        try { var j = justesseMoteurV7({ cle: 'f4p4', juste: 0, total: 0 }, 'camp');
          return j.juste + '/' + j.total; } catch (e) { return '—'; }
      })()
    + '</b>. Les colonnes suivent les cinq étapes : la centrale à son siège et sa '
    + 'boucle, les quatre pôles mesurés aux sept critères (profil), le réseau de '
    + 'chaque pôle (étape 4, seuil ' + F4P4_SEUIL_RENFORT_V7 + '/4), ce que le camp '
    + 'frappe en face, puis le réseau de l\'assaillant direct.</div>';
  hote.parentNode.insertBefore(panneau, hote.nextSibling);
}

function renderDuelBouclierPanel(theme) {
  const ancien = document.getElementById('duel-bouclier-panel');
  if (ancien) ancien.remove();
  if (!theme) return;
  const hote = document.getElementById('lieux-marquage-panel')
            || document.getElementById('deux-marquent-panel')
            || document.getElementById('carte-verdict-r');
  if (!hote || !hote.parentNode) return;

  const panneau = document.createElement('div');
  panneau.id = 'duel-bouclier-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:10px; border:1px solid #a16207;';

  let anc = null;
  try { anc = analyseAncrageDeveloppe(theme); } catch (e) { anc = null; }
  if (!anc || !anc.applicable) {
    panneau.innerHTML = '<h3 style="margin-bottom:2px;">🛡️ Duel du bouclier</h3>'
      + '<div class="muted" style="font-size:11.5px;">Rotation non applicable sur ce thème.</div>';
    hote.parentNode.insertBefore(panneau, hote.nextSibling);
    return;
  }
  const nom = function (f) { return f ? (FL[f] || f) : '—'; };

  function camp(c) {
    const ligne = function (x) {
      if (!x.present) return '<div style="font-size:9.5px; color:#64748b;">'
        + nom(x.fig) + ' — absente</div>';
      return '<div style="font-size:9.5px;"><b>' + nom(x.fig) + '</b> '
        + x.detail.map(function (o) {
            return '<span style="color:' + (o.resultante ? '#94a3b8' : '#e2e8f0') + ';">'
              + 'M' + o.pos + (o.resultante ? 'r' : '') + '</span> '
              + '<span style="color:' + (o.conc >= 0.5 ? '#4ade80' : o.conc > 0 ? '#fbbf24' : '#f87171') + ';">'
              + o.conc + '</span>'
              + '<span style="color:#818cf8;">/' + o.align + '</span>';
          }).join(' · ')
        + '</div>';
    };
    return ligne(c.soi) + ligne(c.appui);
  }

  function bloc(cote, fig) {
    const d = duelBouclierV7(fig, theme);
    if (!d) return '';
    const coul = d.tenu ? '#4ade80' : '#f87171';
    return '<div style="flex:1; min-width:230px;">'
      + '<div style="font-size:11px; font-weight:700; margin-bottom:3px;">'
      + cote + ' · ' + nom(fig) + '</div>'
      + '<div style="font-size:10px; color:#cbd5e1; margin-bottom:4px;">bouclier <b>'
      + nom(d.bouclier) + '</b></div>'
      + '<div style="font-size:10px; color:#f87171; margin-bottom:1px;">⚔ assaillant '
      + nom(d.assaillant) + ' — <b>' + d.campAssaillant.total + '</b></div>'
      + camp(d.campAssaillant)
      + '<div style="font-size:10px; color:#38bdf8; margin:4px 0 1px;">🛡 défenseur (= front) '
      + nom(d.defenseur) + ' — <b>' + d.campDefenseur.total + '</b></div>'
      + camp(d.campDefenseur)
      + '<div style="margin-top:5px; font-size:11px; font-weight:700; color:' + coul + ';">'
      + (d.tenu ? 'BOUCLIER TENU' : 'BOUCLIER ROMPU') + ' (' + (d.marge > 0 ? '+' : '') + d.marge + ')'
      + (d.bouclierPresent ? '' : ' — absent du thème, rompu d\'office')
      + '</div>'
      + (d.tenu ? '' : '<div style="font-size:9.5px; color:#fbbf24;">→ libère '
          + nom(d.libere) + ', l\'antagoniste de ' + nom(fig) + '</div>')
      + (function () {
          const g = regenerationSiegeV7(fig, cote === 'R1' ? anc.hR1 : anc.hR7);
          if (!g) return '';
          const c2 = g.allie ? '#4ade80' : g.hostile ? '#f87171' : '#94a3b8';
          return '<div style="margin-top:5px; font-size:10px; color:' + c2 + ';">'
            + '↻ à son siège M' + g.house + ' elle régénère <b>' + nom(g.resultante)
            + '</b> — ' + g.role
            + (g.score ? ' (' + (g.score > 0 ? '+' : '') + g.score + ')' : '')
            + '<br><span style="font-size:9px;">'
            + (g.dansReseau
                ? 'dans son réseau, ' + g.pas + ' pas — aucun passage par l\'antagoniste'
                : 'hors réseau — le chemin passe par l\'antagoniste')
            + ' · ' + nom(g.resultante) + ' en M' + g.house + ' : concordance '
            + g.concordance + ', alignement ' + g.alignement + '</span></div>';
        })()
      + '</div>';
  }

  panneau.innerHTML = '<h3 style="margin-bottom:2px;">🛡️ Duel du bouclier</h3>'
    + '<div class="muted" style="font-size:10px; margin-bottom:7px;">'
    + 'Le défenseur du bouclier <b>est</b> la figure de front (vérifié 16/16). '
    + 'Chiffres : concordance / niveaux alignés actifs, binôme compris. '
    + 'Gris = résultante.</div>'
    + '<div style="display:flex; gap:14px; flex-wrap:wrap;">'
    + bloc('R1', anc.figR1) + bloc('R7', anc.figR7)
    + '</div>'
    + '<div class="hint" style="margin-top:7px; font-size:9.5px;">'
    + '<b>Branché au verdict</b> — un bouclier dont le duel est perdu ne '
    + 'compte plus que pour moitié dans la chaîne (COEF_BOUCLIER_ROMPU_V7 = '
    + COEF_BOUCLIER_ROMPU_V7 + '). '
    + 'Le bouclier d\'une figure est toujours l\'antagoniste de son antagoniste — '
    + 'le rompre libère donc toujours l\'assaut.</div>';
  hote.parentNode.insertBefore(panneau, hote.nextSibling);
}

function renderLieuxMarquagePanel(theme) {
  const ancien = document.getElementById('lieux-marquage-panel');
  if (ancien) ancien.remove();
  if (!theme) return;
  const hote = document.getElementById('deux-marquent-panel')
            || document.getElementById('roles-exerces-panel')
            || document.getElementById('carte-verdict-r');
  if (!hote || !hote.parentNode) return;

  const d = lectureLieuxMarquageV7(theme);
  const panneau = document.createElement('div');
  panneau.id = 'lieux-marquage-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:10px; border:1px solid #0d9488;';
  if (!d.applicable) {
    panneau.innerHTML = '<h3 style="margin-bottom:2px;">🥅 Lieux de marquage</h3>'
      + '<div class="muted" style="font-size:11.5px;">' + d.raison + '</div>';
    hote.parentNode.insertBefore(panneau, hote.nextSibling);
    return;
  }

  const nom = function (f) { return f ? (FL[f] || f) : '—'; };
  // Teintes NEUTRES quant aux buts : elles disent l'installation, pas une
  // prédiction — l'étude dit justement que l'installation va à contresens.
  function teinte(v) { return v >= 15 ? '#38bdf8' : v > 0 ? '#94a3b8' : '#fbbf24'; }

  function pole(p, libelle) {
    const c = p.rang === 2 ? '#4ade80' : p.rang === 1 ? '#818cf8' : '#64748b';
    return '<div style="display:flex; gap:5px;">'
      + '<span class="muted" style="font-size:9.5px; min-width:58px;">' + libelle + '</span>'
      + '<span style="flex:1; font-size:10px;">' + nom(p.fig)
      + ' <span style="color:' + c + ';">' + p.libelle + '</span></span></div>';
  }

  function carte(l) {
    const badges = (l.estR1 ? '<span style="font-size:9px;padding:0 3px;border-radius:2px;background:#1d4ed8;color:#fff;margin-left:3px;">R1</span>' : '')
      + (l.estR7 ? '<span style="font-size:9px;padding:0 3px;border-radius:2px;background:#c2410c;color:#fff;margin-left:3px;">R7</span>' : '')
      + (l.figureDeButs ? '<span style="font-size:9px;padding:0 3px;border-radius:2px;background:#065f46;color:#fff;margin-left:3px;">figure à buts</span>' : '');
    return '<div style="border:1px solid rgba(148,163,184,.22); border-radius:5px; padding:6px 8px;'
      + (l.horsListe ? ' background:rgba(29,78,216,.07);' : '') + '">'
      + '<div style="display:flex; justify-content:space-between; align-items:baseline; gap:6px;">'
      + '<span><b style="font-size:11.5px;">M' + l.house + '</b> ' + nom(l.fig) + badges + '</span>'
      + '<b style="color:' + teinte(l.installation) + '; font-size:12px;">' + l.installation + '</b></div>'
      + '<div class="muted" style="font-size:9.5px; margin:2px 0 4px;">'
      + l.ouverture + (l.active ? ', active' : ', inactive') + ' · ' + l.etat
      + (l.horsListe ? ' · siège hors liste' : '') + '</div>'
      + pole(l.antagoniste, 'frappée par') + pole(l.protecteur, 'bouclier') + pole(l.front, 'front')
      + '</div>';
  }

  panneau.innerHTML =
    '<h3 style="margin-bottom:2px;">🥅 Lieux de marquage</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:9px; line-height:1.5;">'
    + 'Les sept maisons désignées — M1, M4, M5, M7, M8, M9, M10 — plus les sièges R1/R7 s\'ils tombent '
    + 'ailleurs (fond bleuté). Le chiffre est l\'<b>installation locale</b> de la figure : les six niveaux '
    + 'lus dans cette maison-là, pas dans tout le thème. En dessous, l\'état de ses trois pôles.<br>'
    + '<b>Lecture seule.</b> Mesuré sur les 5 thèmes au score connu : l\'état libre/tenue ne prédit ni les '
    + 'buts ni le BTTS, et l\'installation va à <b>contresens</b> du nombre de buts — mieux les figures sont '
    + 'installées ici, moins il y a de buts (7 paires sur 9). Les deux totaux ci-dessous sont là pour que '
    + 'chaque nouveau score confirme ou casse ce renversement.</div>'
    + '<div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:9px;">'
    + '<div style="flex:1; min-width:120px; border:1px solid rgba(13,148,136,.4); border-radius:5px; padding:6px 9px;">'
    + '<div class="muted" style="font-size:9.5px;">Somme des installations</div>'
    + '<b style="font-size:16px; color:#2dd4bf;">' + d.sommeInstallation + '</b>'
    + '<div class="muted" style="font-size:9.5px;">repères réels : 32,7 → 7 buts · 100,4 → 5 buts · 79,6 → 1 but</div></div>'
    + '<div style="flex:1; min-width:120px; border:1px solid rgba(13,148,136,.4); border-radius:5px; padding:6px 9px;">'
    + '<div class="muted" style="font-size:9.5px;">Lieux à installation positive</div>'
    + '<b style="font-size:16px; color:#2dd4bf;">' + d.lieuxPositifs + ' / ' + d.nbLieux + '</b>'
    + '<div class="muted" style="font-size:9.5px;">repères réels : 4 → 7 buts · 7 → 1 but</div></div></div>'
    + '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(205px,1fr)); gap:7px;">'
    + d.lieux.map(carte).join('') + '</div>'
    + (d.figuresDeButsPresentes.length
        ? '<div class="muted" style="font-size:10px; margin-top:7px;">Figures à buts présentes en base dans le thème : '
          + d.figuresDeButsPresentes.map(nom).join(', ') + '</div>'
        : '<div class="muted" style="font-size:10px; margin-top:7px;">Aucune figure à buts présente en base.</div>');

  hote.parentNode.insertBefore(panneau, hote.nextSibling);
}

function renderDeuxMarquentPanel(theme) {
  const ancien = document.getElementById('deux-marquent-panel');
  if (ancien) ancien.remove();
  if (!theme) return;
  const hote = document.getElementById('roles-exerces-panel')
            || document.getElementById('sikidy-elementaire-panel')
            || document.getElementById('carte-verdict-r');
  if (!hote || !hote.parentNode) return;

  const d = lectureDeuxMarquentV7(theme);
  const panneau = document.createElement('div');
  panneau.id = 'deux-marquent-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:10px; border:1px solid #b45309;';

  if (!d.applicable) {
    panneau.innerHTML = '<h3 style="margin-bottom:2px;">⚽ Les deux marquent — piste</h3>'
      + '<div class="muted" style="font-size:11.5px;">' + d.raison + '</div>';
    hote.parentNode.insertBefore(panneau, hote.nextSibling);
    return;
  }

  const vert = '#4ade80', rouge = '#f87171';
  const c = d.lesDeuxMarquent ? vert : rouge;
  function route(actif, titre, texte) {
    return '<div style="display:flex; gap:6px; align-items:baseline; margin-top:3px;">'
      + '<span style="color:' + (actif ? rouge : '#64748b') + '; font-size:11px;">'
      + (actif ? '✗' : '·') + '</span>'
      + '<span style="flex:1;"><b style="font-size:11px;">' + titre + '</b> '
      + '<span class="muted" style="font-size:10.5px;">' + texte + '</span></span></div>';
  }

  panneau.innerHTML =
    '<h3 style="margin-bottom:2px;">⚽ Les deux marquent — piste</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:8px; line-height:1.5;">'
    + 'La question n\'est pas si le match est serré — le cas réel 6-1 a vu les deux marquer. '
    + 'Elle est de savoir si le <b>perdant garde la capacité de frapper une fois</b>. Deux façons de '
    + 'la lui retirer : le vainqueur l\'anéantit, ou sa propre chaîne est percée. '
    + '<b>Seconde lecture</b> — depuis le 25/08 le verdict BTTS est rendu par l\'ouverture des '
    + 'sièges (bloc du bas) ; celle-ci reste en comparaison.</div>'
    + '<div style="font-size:13px; font-weight:700; color:' + c + '; margin-bottom:6px;">'
    + (d.lesDeuxMarquent ? '⚽⚽ Les deux marquent' : '⚽ Un seul marque') + '</div>'
    + '<div class="muted" style="font-size:10.5px;">Vainqueur ' + FL[d.vainqueur]
    + ' · perdant ' + FL[d.perdant] + '</div>'
    + route(d.aneantiParLaFrappe, 'Frappe du vainqueur',
        d.frappe ? (FL[d.frappe.cible] + ' — ' + d.frappe.portee
          + (d.frappe.viseCamp ? ', camp du perdant' : ', hors du camp du perdant')) : '—')
    + route(d.chainePerdantPercee, 'Chaîne du perdant',
        (d.chainePerdant !== null ? 'total ' + d.chainePerdant + ' — ' : '')
        + (d.chainePerdantPercee ? 'percée' : 'intacte'));

  // ── Seconde lecture : la doctrine d'ouverture des sièges ──
  // Les deux règles ne s'accordent que sur la moitié des thèmes : elles ne
  // regardent pas la même chose. Le désaccord est montré, pas masqué —
  // même traitement que chaîne contre sièges pour le verdict.
  const o = lectureOuvertureButsV7(theme);
  const oAutre = lectureOuvertureButsV7(theme, o.cadre === 'fixe' ? 'rotation' : 'fixe');
  if (o.applicable) {
    const co = o.lesDeuxMarquent ? vert : rouge;
    const accord = o.lesDeuxMarquent === d.lesDeuxMarquent;
    function siege(s, nom, coul) {
      return '<div style="display:flex; gap:6px; align-items:baseline; margin-top:3px;">'
        + '<span style="color:' + (s.ouvert ? vert : rouge) + '; font-size:11px;">'
        + (s.ouvert ? '⚽' : '·') + '</span>'
        + '<span style="flex:1;"><b style="font-size:11px; color:' + coul + ';">' + nom + '</b> '
        + FL[s.fig] + ' <span class="muted" style="font-size:10.5px;">M' + s.house
        + ' — ' + (s.ouverture || '?') + (s.active ? ', active' : ', inactive')
        + (s.figureDeButs ? ', figure à buts' : '') + '</span></span></div>';
    }
    panneau.innerHTML +=
      '<div style="margin-top:11px; padding-top:9px; border-top:1px solid rgba(148,163,184,.25);">'
      + '<div style="font-size:12px; font-weight:700; color:' + co + ';">'
      + (o.lesDeuxMarquent ? '⚽⚽ Les deux marquent' : '⚽ Un seul marque')
      + ' <span class="muted" style="font-weight:400; font-size:10.5px;">— ouverture des sièges R1/R7 · <b>c\'est elle qui rend le verdict</b></span></div>'
      + siege(o.R1, 'R1', '#60a5fa') + siege(o.R7, 'R7', '#fb923c')
      + (o.bonusM5M8.length
          ? '<div class="muted" style="font-size:10px; margin-top:4px;">Bonus signalé : '
            + o.bonusM5M8.join(', ') + ' — <b>affiché, non compté</b> : ajouté au verdict il fait '
            + 'tomber le score sur les cas réels (il rend Milan 7-0 et Napoli 0-1 faussement positifs).</div>'
          : '')
      // Le cadre n'est PAS tranché : les deux se valent sur les cas réels et
      // divergent sur 40% des thèmes. On montre systématiquement l'autre
      // lecture pour que chaque nouveau résultat réel départage.
      + (oAutre.applicable
          ? '<div style="margin-top:6px; padding:5px 7px; border-radius:5px; font-size:10.5px; background:rgba(148,163,184,.08); border:1px solid rgba(148,163,184,.28);">'
            + '<b>Autre cadre — ' + (oAutre.cadre === 'fixe' ? 'maisons fixes M1/M7' : 'sièges R1/R7 de la rotation') + ' :</b> '
            + '<span style="color:' + (oAutre.lesDeuxMarquent ? vert : rouge) + ';">'
            + (oAutre.lesDeuxMarquent ? 'les deux marquent' : 'un seul marque') + '</span>'
            + (oAutre.lesDeuxMarquent === o.lesDeuxMarquent
                ? ' — même conclusion.'
                : ' — <b>conclusion opposée.</b> Les deux cadres sont à égalité (4/6 chacun) et divergent sur 40% des thèmes : le choix n\'est pas tranché. Interrupteur BTTS_CADRE.')
            + '<div class="muted" style="margin-top:2px;">' + oAutre.synthese + '</div></div>'
          : '')
      + '<div style="margin-top:6px; padding:5px 7px; border-radius:5px; font-size:10.5px; background:'
      + (accord ? 'rgba(34,197,94,.10)' : 'rgba(248,113,113,.10)') + '; border:1px solid '
      + (accord ? 'rgba(34,197,94,.35)' : 'rgba(248,113,113,.35)') + ';">'
      + (accord
          ? '✅ Les deux lectures concordent.'
          : '⚠️ <b>Les deux lectures se contredisent.</b> Elles ne s\'accordent que sur 50% des thèmes — '
            + 'elles ne mesurent pas la même chose. Sur les 5 cas réels : ouverture des sièges 4/5 '
            + '(non ajustée), perdant muet 5/5 (ajustée sur ces cas, donc moins probante).')
      + '</div></div>';
  }

  hote.parentNode.insertBefore(panneau, hote.nextSibling);
}

function renderRolesExercesPanel(theme) {
  const ancien = document.getElementById('roles-exerces-panel');
  if (ancien) ancien.remove();
  if (!theme) return;
  const hote = document.getElementById('sikidy-elementaire-panel')
            || document.getElementById('carte-verdict-r');
  if (!hote || !hote.parentNode) return;

  const d = rolesExercesTheme(theme);
  if (!d.applicable) return;

  const nom = function (f) { return f ? (FL[f] || f) : '—'; };
  const COUL = {effectif: '#4ade80', affaibli: '#fbbf24', latent: '#818cf8',
                'contrée': '#38bdf8', 'à vide': '#64748b'};
  const badge = function (t) {
    return '<span style="font-size:9px; padding:1px 4px; border-radius:2px; background:'
      + (t === 'R1' ? '#1d4ed8' : t === 'R7' ? '#c2410c' : '#6d28d9')
      + '; color:#fff;">' + t + '</span>';
  };

  // Une carte par figure plutôt qu'un tableau à cinq colonnes : à 430 px
  // le tableau se coupait, et les rôles sont plus lisibles empilés.
  function ligneRole(ro) {
    const c = ro.portee === 'effectif' ? (ro.hostile ? '#f87171' : COUL.effectif) : COUL[ro.portee];
    return '<div style="display:flex; gap:5px; align-items:baseline;">'
      + '<span class="muted" style="font-size:10px; min-width:62px;">' + ro.libelle + '</span>'
      + '<span style="flex:1;"><span style="color:' + c + ';">' + nom(ro.dest) + '</span>'
      + (ro.surChef ? ' ' + badge(ro.surChef) : '')
      + (ro.compte
          ? '<span style="font-size:9px; padding:0 3px; border-radius:2px; margin-left:3px; background:'
            + (ro.hostile ? '#166534' : '#7f1d1d') + '; color:#fff;">'
            + (ro.hostile ? 'frappe le camp adverse' : 'sert le camp adverse') + '</span>'
          : '')
      + '<span class="muted" style="font-size:10px;"> — ' + ro.etat.libelle + '</span>'
      + ' <span style="color:' + c + '; font-size:10px;">' + ro.portee + '</span></span></div>';
  }

  function carte(l) {
    const sol = l.solide
      ? '<span style="color:#4ade80;">solide</span>'
      : '<span style="color:#fbbf24;">fragile</span>';
    const etatSoi = l.etatSoi.libelle
      + (l.siege ? ' · siège M' + l.siege + (l.siegeSecond ? ' et M' + l.siegeSecond : '') : '');
    return '<div style="border:1px solid rgba(148,163,184,.22); border-radius:5px; padding:7px 8px;'
      + (l.chef ? ' background:rgba(124,58,237,.08);' : '') + '">'
      + '<div style="margin-bottom:4px;">' + (l.chef ? badge(l.chef) + ' ' : '')
      + '<b>' + nom(l.fig) + '</b></div>'
      + '<div class="muted" style="font-size:10px; margin-bottom:5px;">' + etatSoi + ' · ' + sol
      + (l.scoreSoi !== null ? ' (' + l.scoreSoi + ')' : '') + '</div>'
      + l.roles.map(ligneRole).join('')
      + '</div>';
  }

  const panneau = document.createElement('div');
  panneau.id = 'roles-exerces-panel';
  panneau.className = 'card';
  panneau.style.cssText = 'margin-top:10px; border:1px solid #7c3aed;';
  panneau.innerHTML =
    '<h3 style="margin-bottom:2px;">🎭 Rôles exercés par chaque figure</h3>'
    + '<div class="muted" style="font-size:11px; margin-bottom:9px; line-height:1.55;">'
    + 'Chaque figure tient les quatre rôles à la fois : elle <b>frappe</b> la figure placée trois crans plus loin, '
    + 'et sert de <b>binôme</b>, de <b>bouclier</b> et de <b>front</b> à trois autres. Le rôle hostile porte toujours '
    + 'sur l\'autre boucle, les trois rôles alliés sur la sienne. Portée d\'un rôle : '
    + '<span style="color:#4ade80;">effectif</span> (destinataire ancré en base, exerçante debout) · '
    + '<span style="color:#818cf8;">latent</span> (destinataire seulement en résultante) · '
    + '<span style="color:#fbbf24;">affaibli</span> (exerçante fragile) · '
    + '<span style="color:#38bdf8;">contrée</span> (frappe sur une cible à son repos, qui résiste) · '
    + '<span style="color:#64748b;">à vide</span> (destinataire absent). '
    + '<b>Branché au verdict depuis le 25/08.</b> Pour R1 et R7, deux comptes s\'ajoutent à la solidité '
    + 'de chaîne : les rôles <b>reçus</b> (bouclier, front, binôme, moins la frappe subie), et les rôles '
    + '<b>exercés</b> — dont seuls comptent ceux qui touchent le camp d\'en face, signalés ici : '
    + '<span style="background:#166534; color:#fff; padding:0 3px; border-radius:2px; font-size:9px;">frappe le camp adverse</span> rapporte, '
    + '<span style="background:#7f1d1d; color:#fff; padding:0 3px; border-radius:2px; font-size:9px;">sert le camp adverse</span> coûte. '
    + 'Les autres figures restent en lecture.</div>'
    + '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:7px; font-size:11.5px; line-height:1.5;">'
    + d.lignes.map(carte).join('')
    + '</div>';

  hote.parentNode.insertBefore(panneau, hote.nextSibling);
}

// RETIRÉ (24/08/26) : un premier essai avait branché la figure de front
// comme pénalité additive dans verdictFamilialEngine, avec un panneau
// dédié (renderPolesR1R7). Erreur d'aiguillage — verdictFamilialEngine ne
// pilote plus le vainqueur affiché depuis le 21/08/26 (Réseau d'ancrage V2
// est le moteur décisif, cf. plus bas). Retiré ; la doctrine est câblée
// à la bonne place dans analyserResistanceV7 (voie A), affichée dans le
// panneau existant renderReseauAncrageV2 — pas de panneau séparé.

// ═══════════════════════════════════════════════════════════════
// PROCÉDURE OFFICIELLE R1/R7 — NIVEAUX + SIGNATURE + NEUTRALISATION
// Cette couche transforme l'analyse élémentaire en procédure opérationnelle.
// Elle ne remplace pas les familles : elle fournit d'abord un équilibre
// élémentaire, puis sert de départage lorsque le moteur principal est égal.
// ═══════════════════════════════════════════════════════════════
function procedureR1R7(theme, figR1, hR1, figR7, hR7){
  const r1=puissanceElementaireR1R7(figR1,hR1,theme);
  const r7=puissanceElementaireR1R7(figR7,hR7,theme);
  const n=neutralisationElementaireR1R7(r1,r7);
  const c1=n.restA.length, c7=n.restB.length;
  const sameRemainder=c1===c7 && n.restA.slice().sort().join(',')===n.restB.slice().sort().join(',');
  let balance=0;
  if(c1>c7) balance=1;
  else if(c7>c1) balance=-1;
  else if(!sameRemainder){
    // Même quantité, mais composition différente : on ne force pas un
    // vainqueur. La composition reste une information de contrôle.
    balance=0;
  }
  return {
    r1:r1,r7:r7,neutralisation:n,
    remainderR1:n.restA.slice(), remainderR7:n.restB.slice(),
    balance:balance,
    balanced:balance===0,
    rule:'F↔E ; A↔T ; 1=actif ; 2=passif ; L1=Feu/L2=Air/L3=Eau/L4=Terre'
  };
}




// COUCHE RELATIONNELLE R1/R7 — COLOCATAIRE, RÉPÉTITION, ENVIRONNEMENT.
// La résultante d'une figure dans sa maison est calculée avec FIGS[pos-1]
// (fonction getResultant). Le colocataire est ensuite relié au repos de
// l'adversaire et à la figure elle-même via BINOMES_V7/ANTAGONISTES_V7.
function coucheRelationnelleR1R7(figR1,hR1,figR7,hR7,theme){
  const resultante = (fig,pos) => getResultant(fig,pos);
  const r1Res = resultante(figR1,hR1);
  const r7Res = resultante(figR7,hR7);
  const reposR1 = FIGS_V7[hR1-1];
  const reposR7 = FIGS_V7[hR7-1];
  const positions = fig => {
    const out=[];
    for(let m=1;m<=16;m++) if(theme[m]===fig) out.push(m);
    return out;
  };
  const rel = (res, fig, ownRepos, oppFig, oppRepos) => {
    const ownBin = BINOMES_V7[fig];
    const ownAnt = ANTAGONISTES_V7[fig];
    const oppBin = BINOMES_V7[oppFig];
    const oppAnt = ANTAGONISTES_V7[oppFig];
    let score=0, signals=[];
    const posRes=positions(res);
    if(posRes.length){ score += 1.5; signals.push('résultante ancrée dans le thème'); }
    if(res===ownBin){ score += 3; signals.push('colocataire = binôme direct de sa figure'); }
    if(res===ownAnt){ score -= 3; signals.push('colocataire = antagoniste direct de sa figure'); }
    if(res===oppBin){ score += 2; signals.push('colocataire = binôme direct de R7/R1 adverse'); }
    if(res===oppAnt){ score += 2.5; signals.push('colocataire = antagoniste direct de R7/R1 adverse'); }
    // Chaîne spécifique de repos : la résultante attaque la figure de repos
    // qui porte l'adversaire. C'est la relation observée dans le cas R7 Via→Amissio.
    if(res===ANTAGONISTES_V7[oppRepos]){
      score += 4;
      signals.push('colocataire = antagoniste de la figure de repos de l’adversaire');
    }
    // Chaîne inverse : la résultante est le binôme de la figure de repos adverse.
    if(res===BINOMES_V7[oppRepos]){
      score += 2.5;
      signals.push('colocataire = binôme de la figure de repos de l’adversaire');
    }
    return {score,signals,posRes,ownBin,ownAnt,oppBin,oppAnt,ownRepos,oppRepos};
  };
  const r1=rel(r1Res,figR1,reposR1,figR7,reposR7);
  const r7=rel(r7Res,figR7,reposR7,figR1,reposR1);
  const env = fig => {
    const set=[];
    [hR1,hR7].forEach(h=>{ if(Math.abs(h-hR1)<=2 || Math.abs(h-hR7)<=2) set.push({house:h,fig:theme[h]}); });
    return set;
  };
  return {r1:{figure:figR1,house:hR1,resultante:r1Res,...r1,environment:env(figR1)},r7:{figure:figR7,house:hR7,resultante:r7Res,...r7,environment:env(figR7)},ecart:r1.score-r7.score};
}

function verdictFamilialEngine(theme){
  // M1 est uniquement l'ancre de départ de la rotation.
  const rot = getRotationCombat(theme);
  const fig1 = rot.anchorFigure;
  const hR1 = rot.hR1, hR7 = rot.hR7;
  const figR1 = rot.figR1, figR7 = rot.figR7;

  // CORRIGÉ (20/08/26) : BUG CRITIQUE DÉCOUVERT — procR1R7 était utilisé
  // plus bas (neutralisationTie, et dans CHAQUE objet de retour via
  // procedureR1R7:procR1R7) sans jamais être défini dans cette fonction.
  // C'est une const LOCALE à moteurQuatreTrones (fonction complètement
  // différente) — jamais dans la portée de verdictFamilialEngine.
  // Conséquence réelle, vérifiée en isolant le moteur : un
  // ReferenceError se déclenchait à CHAQUE appel qui ne tombait pas sur
  // un des deux retours "nul" précoces (Axe Succédent / Structure du
  // Nul) — c'est-à-dire sur la quasi-totalité des thèmes. verdictFinal()
  // capturait silencieusement l'erreur et repliait sur l'ancien moteur
  // legacy moteurVerdictFamilial() (préfixe "⚠️ Sous-couche du verdict
  // familial interrompue..." dans reason). RÉSULTAT : depuis son
  // branchement, verdictFamilialEngine — avec TOUTES ses couches
  // (comparerBouclesAntagonistesR1R7, coucheRelationnelleR1R7,
  // puissanceElementaireR1R7, résultante, dualiteXAncrageR1R7) — n'a
  // probablement JAMAIS produit un seul verdict réel en production.
  const procR1R7 = procedureR1R7(theme, figR1, hR1, figR7, hR7);

  // AXE SUCCÉDENT — DÉBRANCHÉ DU VERDICT (24/08/26, cf.
  // AXE_SUCCEDENT_DECISIF). Le signal reste calculé et diagnostiqué,
  // mais n'impose plus le nul : il court-circuitait des couches qui
  // avaient vu juste (7-0 réel sur un thème déclaré nul).
  const asOpp = signalAxeSuccedentOpposition(theme);
  if (AXE_SUCCEDENT_DECISIF && asOpp.confirmed) {
    const anc = asOpp.ancrages.map(a =>
      FL[a.fig]+' (M'+a.positions.join(',M')+')'
    ).join(' ; ');
    return {
      type:'nul',
      winner:'Nul',
      label:'⚖️ MATCH NUL probable',
      procedureR1R7:procR1R7,
      reason:'⚖️ AXE SUCCÉDENT CONFIRMÉ : '+anc+
        ' | M15 = '+FL[asOpp.m15]+
        ' → '+asOpp.m15Rule+
        ' | M13 = '+FL[asOpp.m13]+', M14 = '+FL[asOpp.m14]+
        ' | signature confirmée.'
    };
  }

  // STRUCTURE DU NUL — DÉBRANCHÉE DU VERDICT (24/08/26, décision
  // Ellemine_D après le cas réel 6-1 ; voir STRUCTURE_NUL_DECISIVE plus
  // haut pour le raisonnement complet). Le calcul reste, le pouvoir de
  // décision est retiré : un thème peut porter la signature structurelle
  // du nul sans que le résultat réel soit un nul.
  const sdn = structureDuNul(theme);
  if (STRUCTURE_NUL_DECISIVE && sdn.nulDetecte) {
    const raison = sdn.nulParIdentite
      ? 'Juge 1 (M13='+FL[sdn.juge1]+') = Juge 2 (M14='+FL[sdn.juge2]+') — nul par identité'
      : 'Juge 1 (M13='+FL[sdn.juge1]+') et Juge 2 (M14='+FL[sdn.juge2]+') forment une paire d\'équilibre — nul par opposition';
    return {type:'nul', winner:'Nul', label:'⚖️ MATCH NUL probable', procedureR1R7:procR1R7, reason:'⚖️ STRUCTURE DU NUL (04/08/26, précision mesurée 23% — proche du bruit, ⚠️ candidat au retrait) : '+raison+'. Sentence (M16='+FL[sdn.sentence]+') : indique la manière dont le nul se manifeste.'};
  }

  const famR1 = familleScoreEngine(figR1, theme, hR1);
  const famR7 = familleScoreEngine(figR7, theme, hR7);
  const duelR1 = attaqueVsResistanceEngine(figR1, hR1, theme);
  const duelR7 = attaqueVsResistanceEngine(figR7, hR7, theme);

  // NOUVEAU PROTOCOLE DE COMPARAISON R1/R7 — BRANCHÉ AU VERDICT
  // Remplace l'ancienne couche scoreEnvironnementInterpretation dans le
  // calcul principal. Le protocole compare directement les deux boucles
  // antagonistes et tient compte des présences, répétitions, repos, soutien
  // du binôme et effet des résultantes des chefs.
  // Il reste neutre (0/0) lorsque R1 et R7 appartiennent à la même boucle.
  const comparaisonR1R7 = comparerBouclesAntagonistesR1R7(theme);
  const comparaisonScoreR1 = comparaisonR1R7.applicable ? comparaisonR1R7.scoreR1 : 0;
  const comparaisonScoreR7 = comparaisonR1R7.applicable ? comparaisonR1R7.scoreR7 : 0;

  // RÉSULTANTES DE R1/R7 — BRANCHÉES AU VERDICT (05/08/26, demande
  // explicite Ellemine_D : "tous les verdicts ne prennent pas en compte
  // des résultantes"). Jusqu'ici figR1/figR7 n'étaient que les figures
  // de BASE en hR1/hR7 — leur résultante (combine(figure, repos naturel
  // de la maison), le même concept que dans la matrice 16×16) n'entrait
  // dans AUCUN calcul de verdictFamilialEngine. Ajoutée ici comme
  // composante à part : on interprète la résultante comme si elle
  // occupait la même maison (via getInterpretationFootball + la même
  // pondération de concordance élémentaire que le reste), à poids réduit
  // (moitié) car secondaire à la figure de base elle-même.
  // ⚠️ Non contre-testé sur l'archive, branché sur demande directe.
  function scoreResultanteMaison(fig, pos, theme) {
    const resultante = combine(fig, FIGS_V7[pos-1]);
    const interp = getInterpretationFootball(resultante, pos);
    if (!interp) return { resultante: resultante, score: 0, interp: null };
    const brut = couleurToScore(interp.couleur);
    const enRepos = (FIGS_V7[pos-1] === resultante);
    const s = enRepos ? brut : brut * concordanceElement(ELEMENTS_V7[resultante], MAISON_ELEM_V7[pos]);
    return { resultante: resultante, score: s * 0.5, interp: interp };
  }
  const resR1 = scoreResultanteMaison(figR1, hR1, theme);
  const resR7 = scoreResultanteMaison(figR7, hR7, theme);

  // COUCHE RELATIONNELLE — colocataire/résultante + binôme/antagoniste
  // + répétition/ancrage. Cette couche explique notamment les chaînes où
  // le colocataire de R7 attaque la figure de repos de R1.
  const relationR1R7 = coucheRelationnelleR1R7(figR1,hR1,figR7,hR7,theme);

  // PUISSANCE ÉLÉMENTAIRE : la nouvelle règle R1/R7 participe désormais
  // réellement au verdict principal, et n'est plus seulement informative.
  const elemR1 = puissanceElementaireR1R7(figR1, hR1, theme);
  const elemR7 = puissanceElementaireR1R7(figR7, hR7, theme);
  // (24/08/26) La doctrine « trois pôles / figure de front » (FRONT_V7,
  // cf. ci-dessus) n'est PAS branchée ici : verdictFamilialEngine ne
  // pilote plus le vainqueur affiché à l'écran depuis le 21/08/26 — c'est
  // le Réseau d'ancrage V2 (analyserReseauAncrageV2 → analyserResistanceV7)
  // qui est le moteur décisif. La figure de front y est câblée à la place.
  const netR1 = famR1.net + duelR1.ecart + comparaisonScoreR1 + resR1.score + elemR1.powerScore + relationR1R7.r1.score;
  const netR7 = famR7.net + duelR7.ecart + comparaisonScoreR7 + resR7.score + elemR7.powerScore + relationR1R7.r7.score;

  // La neutralisation devient opérationnelle comme départage final :
  // un reliquat élémentaire plus important d'un côté donne le départage,
  // tandis qu'un reliquat identique ne crée aucun avantage artificiel.
  const neutralisationTie = procR1R7.balance;

  // NOUVELLE PRIORITÉ DE DUALITÉ : R1 + R7 = X. Si X est présente et
  // reliée par binôme/antagoniste (y compris binôme de l'antagoniste),
  // sa chaîne d'ancrage peut trancher avant le score familial.
  // SÉCURITÉ DUALITÉ : cette couche ne doit jamais empêcher le verdict
  // principal de s'afficher si une donnée de réseau/ancrage est absente.
  let dualX;
  try {
    dualX = dualiteXAncrageR1R7(theme, hR1, hR7, figR1, figR7);
  } catch(e) {
    dualX = {decisive:false, X:null, error:String(e && e.message || e),
      reason:'⚠️ Dualité R1/R7 non calculée : '+String(e && e.message || e)+' — poursuite par le Verdict Familial.'};
  }
  if(dualX.decisive){
    const scoreFinalR1 = netR1, scoreFinalR7 = netR7;
    const winnerCode = dualX.winner === 'R1' ? 'M1' : 'M7';
    return {type:'verdict', winner:winnerCode, winnerRotation:dualX.winner, label:'🏆 VAINQUEUR : '+dualX.winner,
      reason:dualX.reason+' Verdict final prioritaire sur la dualité R1/R7 (scores familiaux conservés à titre de contrôle : '+scoreFinalR1.toFixed(1)+' / '+scoreFinalR7.toFixed(1)+').',
      dualiteX:dualX, elementaireR1:elemR1, elementaireR7:elemR7, procedureR1R7:procR1R7, netR1:scoreFinalR1, netR7:scoreFinalR7, figR1:figR1, figR7:figR7, hR1:hR1, hR7:hR7};
  }

  if(netR1 > netR7){
    return {type:'verdict', winner:'M1', winnerRotation:'R1', label:'🏆 VAINQUEUR : R1', reason:'🌳 VERDICT ROTATION — R1 gagne : M1 a seulement déterminé le départ de rotation. R1 = '+FL[figR1]+' en M'+hR1+' ('+netR1.toFixed(1)+') contre R7 = '+FL[figR7]+' en M'+hR7+' ('+netR7.toFixed(1)+') — familles/ombres + duel attaque/résistance + comparaison des boucles + résultante + puissance élémentaire ('+elemR1.powerLabel+' +'+elemR1.powerScore+' vs '+elemR7.powerLabel+' +'+elemR7.powerScore+').', dualiteX:dualX, relationR1R7:relationR1R7, elementaireR1:elemR1, elementaireR7:elemR7, procedureR1R7:procR1R7};
  }
  if(netR7 > netR1){
    return {type:'verdict', winner:'M7', winnerRotation:'R7', label:'🏆 VAINQUEUR : R7', reason:'🌳 VERDICT ROTATION — R7 gagne : M1 a seulement déterminé le départ de rotation. R7 = '+FL[figR7]+' en M'+hR7+' ('+netR7.toFixed(1)+') contre R1 = '+FL[figR1]+' en M'+hR1+' ('+netR1.toFixed(1)+') — familles/ombres + duel attaque/résistance + environnement + résultante + puissance élémentaire ('+elemR7.powerLabel+' +'+elemR7.powerScore+' vs '+elemR1.powerLabel+' +'+elemR1.powerScore+').', dualiteX:dualX, relationR1R7:relationR1R7, elementaireR1:elemR1, elementaireR7:elemR7, procedureR1R7:procR1R7};
  }
  return {type:'indecis', winner:null, winnerRotation:'Nul', label:'⚖️ INDÉCIS', reason:'🌳 VERDICT ROTATION — R1 et R7 sont à égalité ('+netR1.toFixed(1)+' / '+netR7.toFixed(1)+'). M1 a seulement servi d’ancre de départ. Puissance élémentaire : R1 '+elemR1.powerLabel+' +'+elemR1.powerScore+' ; R7 '+elemR7.powerLabel+' +'+elemR7.powerScore+'. Neutralisation : '+(procR1R7.balanced?'équilibre':'départage R'+(procR1R7.balance>0?'1':'7'))+'.', dualiteX:dualX, relationR1R7:relationR1R7, elementaireR1:elemR1, elementaireR7:elemR7, procedureR1R7:procR1R7};
}

// Nouveau point d'entrée (28/07/26) : verdictFinal() appelle maintenant
// verdictFamilialEngine() — le moteur câblé sur la hiérarchie à paliers,
// le réseau élargi (jusqu'à 5 crans) et le duel attaque/résistance.
// L'ancienne cascade complète reste disponible et intacte sous
// verdictFinalCascadeComplete(theme, favoriteOverride). verdictRotationSeule()
// (l'étape intermédiaire du 27/07/26, hiérarchie plate) reste aussi
// disponible mais n'est plus appelée par défaut — une seule ligne à
// changer ici pour revenir à l'une ou l'autre version.
function verdictFinal(theme, favoriteOverride){
  let v;
  try {
    v = verdictFamilialEngine(theme);
  } catch(e) {
    // CORRIGÉ (21/08/26, suppression de moteurVerdictFamilial —
    // focalisation sur un seul moteur, demande Ellemine_D) : le filet de
    // secours intermédiaire dépendait de moteurVerdictFamilial, supprimé
    // avec le panneau "Verdict Familial". verdictFamilialEngine tourne
    // sans erreur depuis sa correction (0/1500 sur test de résistance) —
    // ce filet ne devrait plus jamais se déclencher en pratique, mais
    // reste un repli sûr et autonome si un cas limite venait à le faire.
    const rot = getRotationCombat(theme);
    v = {type:'indecis', winner:null, winnerRotation:'Nul', label:'⚖️ INDÉCIS',
      reason:'⚠️ Le moteur de verdict a rencontré une erreur technique : '+String(e && e.message || e)+'. R1='+FL[rot.figR1]+' en M'+rot.hR1+' / R7='+FL[rot.figR7]+' en M'+rot.hR7+'.'};
  }
  // Compatibilité historique : winner reste M1/M7 pour les archives/UI,
  // mais winnerRotation est la référence réelle du duel : R1 ou R7.
  if(v && v.winnerRotation===undefined){
    v.winnerRotation = v.winner==='M1' ? 'R1' : v.winner==='M7' ? 'R7' : 'Nul';
  }
  return v;
}

function verdictJugeFavori(theme, favoriteOverride){
  const juge = theme[15];
  let favorite = favoriteOverride;
  if (favorite===undefined){ const favEl = document.getElementById('matchFavorite'); favorite = favEl ? favEl.value : 'none'; }
  if (favorite==='none') return {winner:null, reason:'Favori non renseigné : règle juge-favori inactive.'};
  // ═══ ÉTAPE 3 RÉVISÉE (04/07/26) — PAROLE DU JUGE-FAVORI ═══
  // La parole du Juge est INVALIDÉE si :
  //  (a) l'antagoniste du Juge le DOMINE — concordance parfaite avec sa
  //      maison de séjour (a fortiori s'il cohabite avec le Juge), OU
  //  (b) le binôme du Juge (son confirmateur) est CAPTIF dans la maison
  //      de repos de son propre antagoniste.
  // Un juge dominé par son destructeur, ou au confirmateur prisonnier,
  // ne peut imposer le favori. Discrimination 3/3 : le 3-4 (F.Minor
  // domine en M5 + Puella captive en M11) vs Real et Puebla (parole
  // intacte). Porte le juge-favori de 3/4 à 4/4 expliqué.
  if(juge==='fortuna_major' || juge==='fortuna_minor'){
    const els = (typeof ELEMENTS_V7!=='undefined') ? ELEMENTS_V7 : ELEMENTS;
    const antJ = ANTAGONISTES_V7[juge];
    const posAnt = positionsBaseEtResultantes(antJ, theme);
    const domine = posAnt.some(x=>{
      const p = parseInt(x.replace('M','').replace('r',''));
      return els[antJ] === MAISON_ELEM_V7[p];
    });
    const binJ = BINOMES_V7[juge];
    const maisonAntagBin = FIGS_V7.indexOf(ANTAGONISTES_V7[binJ]) + 1;
    const captif = positionsBaseEtResultantes(binJ, theme).some(x=>parseInt(x.replace('M','').replace('r',''))===maisonAntagBin);
    if(domine || captif){
      const raisons = [];
      if(domine) raisons.push(FL[antJ]+' (son antagoniste) le domine en concordance parfaite');
      if(captif) raisons.push('son binôme '+FL[binJ]+' est captif en M'+maisonAntagBin+', la maison de son antagoniste '+FL[ANTAGONISTES_V7[binJ]]);
      return {winner:null, reason:'⚠️ PAROLE DU JUGE BRISÉE : '+raisons.join(' ; ')+' → juge-favori inactif, verdict par les couches suivantes.'};
    }
  }
  const favCamp = favorite==='team1' ? 'M1' : 'M7';
  const outsiderCamp = favorite==='team1' ? 'M7' : 'M1';
  if (juge==='fortuna_major') return {winner:favCamp, reason:'Juge Fortuna Major + favori renseigné → le favori ('+favCamp+') s impose (validé 2/2)'};
  if (juge==='fortuna_minor') return {winner:outsiderCamp, reason:'Juge Fortuna Minor + favori renseigné → l outsider ('+outsiderCamp+') renverse'};
  return {winner:null, reason:'Juge '+FL[juge]+' : pas de règle juge-favori applicable.'};
}

// ═══════════════════════════════════════════════════════════════
// VERDICT ÉLÉMENTAIRE M1 vs M7 — le meilleur rôle élémentaire gagne
// Validation empirique (juil. 2026, thèmes VALIDES uniquement) : 4/5
//   Amplificateur > Chaotique (2/2 : 1-0, 2-1)
//   Déclencheur > Stabilisateur (1/1 : renversement 1-2)
//   Absorbeur > Dissonant (1/1 : 7-0)
//   Échec : Adaptateur vs Chaotique — indécis (1 fois dans chaque sens)
// CORRECTION (revue de la hiérarchie élémentaire) : les 2 cas impliquant
// "Chaotique" (Amplificateur>Chaotique, Adaptateur vs Chaotique) ne
// testent PAS cette hiérarchie linéaire — un rôle Chaotique déclenche
// TOUJOURS le branchement dédié "ARMEMENT DU CHAOS" plus bas (qui a sa
// propre validation séparée, 5/5 puis 4/5) avant même d'atteindre
// ROLE_HIERARCHY.indexOf(). L'échantillon réel qui teste cette hiérarchie
// linéaire est donc 2/2 (Déclencheur>Stabilisateur, Absorbeur>Dissonant),
// pas 4/5 — même preuve comptée deux fois sous deux mécanismes différents.
// "Règle muette si... même rôle" (ligne suivante à l'origine) décrivait
// un cas qui ne peut PAS se produire dans le code actuel : les maisons
// M1 (feu) et M7 (eau) sont fixes, donc roleM1 ne peut être que
// Déclencheur/Amplificateur/Chaotique/Absorbeur et roleM7 que
// Chaotique/Dissonant/Adaptateur/Stabilisateur — les deux ensembles ne se
// recoupent que sur "Chaotique", qui est toujours intercepté avant cette
// ligne (cf. ARMEMENT DU CHAOS, dont le résultat "neutre" est lui-même
// mort — voir commentaire sur armementChaos). Aucune égalité de rôle
// n'est donc atteignable ici (vérifié sur 200 000 thèmes aléatoires :
// 0 occurrence) — mais winner:'muet' n'a jamais été codé nulle part dans
// verdictElementaire, alors que 6+ appelants ailleurs dans le fichier
// testent encore `ve.winner !== 'muet'` comme si c'était un cas réel.
// Inoffensif (la condition est juste toujours vraie), mais aucun de ces
// appelants ne recevra jamais réellement 'muet'.
// ═══════════════════════════════════════════════════════════════
const ROLE_HIERARCHY = ['Déclencheur','Amplificateur','Adaptateur','Stabilisateur','Absorbeur','Dissonant','Chaotique','Blocage'];
// NOTE : ROLE_HIERARCHY n'est utilisé qu'à un seul endroit (comparaison
// finale roleM1/roleM7 dans verdictElementaire, cf. plus bas), où M1/M7
// sont toujours en maison feu/eau. "Blocage" (air-terre) n'est donc
// jamais atteignable ici — sa position en dernier rang est décorative.

// ═══════════════════════════════════════════════════════════════
// ARMEMENT DU CHAOS — doctrine du binôme (validée 5/5, juil. 2026)
// Un camp Chaotique ne subit pas forcément : son binôme décide.
//  - binôme ABSENT du thème → chaos désarmé, le camp subit (M2)
//  - binôme dans les maisons du camp ENNEMI → chaos capturé/retourné
//    contre le porteur (M14: Caput en M1 → penalty contre Puer;
//    M6: Laetitia en M4 → Populus balayé)
//  - binôme dans les maisons de SON camp → chaos armé, il se déchaîne
//    en attaque (M8: Tristitia en M10 → victoire; Puebla: Caput en
//    M11 → 4-0 infligé)
// ═══════════════════════════════════════════════════════════════
function armementChaos(campPos, theme){
  const fig = theme[campPos];
  const bin = BINOMES_V7[fig];
  const own = campPos===1 ? CAMP1 : CAMP2;
  const enemy = campPos===1 ? CAMP2 : CAMP1;
  const positions = [];
  for(let p=1;p<=16;p++) if(theme[p]===bin) positions.push(p);
  if(!positions.length) return {etat:'désarmé', bin, detail:'binôme '+FL[bin]+' absent → chaos désarmé, le camp subit'};
  const inOwn = positions.filter(p=>own.indexOf(p)>=0);
  const inEnemy = positions.filter(p=>enemy.indexOf(p)>=0);
  if(inOwn.length) return {etat:'armé', bin, detail:'binôme '+FL[bin]+' en M'+inOwn.join(',M')+' (son camp) → chaos armé, se déchaîne en attaque'};
  if(inEnemy.length) return {etat:'capturé', bin, detail:'binôme '+FL[bin]+' en M'+inEnemy.join(',M')+' (camp ennemi) → chaos retourné contre le porteur'};
  // MORT (revue de la hiérarchie élémentaire) : CAMP1=[1,2,3,4,9,10,13,16]
  // et CAMP2=[5,6,7,8,11,12,14,15] couvrent ensemble les 16 maisons sans
  // aucun trou — M15 est dans CAMP2, M16 dans CAMP1, il n'existe PAS de
  // maison "hors camps". Donc si positions.length>0 (testé juste
  // au-dessus), inOwn ou inEnemy est nécessairement non vide : ce return
  // n'est jamais atteint. Le commentaire "M15/M16 selon partition" qui le
  // justifiait était basé sur une prémisse fausse. Laissé en place pour
  // ne pas retirer un garde-fou défensif, mais ce n'est pas un vrai cas.
  return {etat:'neutre', bin, detail:'binôme '+FL[bin]+' hors camps (cas normalement impossible, CAMP1∪CAMP2 couvre les 16 maisons) → indéterminé'};
}

// ═══════════════════════════════════════════════════════════════
// ALIGNEMENT PAIR/IMPAIR — force territoriale des figures alignées
// Deux boucles binômes : IMPAIR (Puer, Caput, Via, Rubeus, F.Minor,
// Conjunctio, Cauda, Acquisitio) et PAIR (Laetitia, Albus, Amissio,
// Tristitia, Carcer, F.Major, Puella, Populus).
// Une figure est ALIGNÉE dans une maison si :
//  - elle est en repos absolu (sa propre maison) — aligné par définition, OU
//  - elle est de la MÊME boucle que la figure de repos de la maison
//    ET sa concordance élémentaire avec la maison est identique/compatible
//    (ex. validé : Amissio en M12 — pair + eau×terre compatible).
// Force territoriale = nombre de figures alignées dans les maisons de
// chaque camp (CAMP1/CAMP2). Validation rétrospective : 6/8 décisifs
// (échecs : M10 écart 1 → nul réel; M13 7-0 l'irréductible).
// STATUT : signal INFORMATIF, sans pouvoir décisionnel — tracké en stats.
// ═══════════════════════════════════════════════════════════════
function figureAlignee(fig, pos, theme){
  if (fig === FIGS_V7[pos-1]) return true; // repos absolu
  const reposFig = FIGS_V7[pos-1];
  const cycleOf = f => (FIGS_V7.indexOf(f) % 2 === 0) ? 'impair' : 'pair';
  if (cycleOf(fig) !== cycleOf(reposFig)) return false;
  const els = (typeof ELEMENTS_V7!=='undefined') ? ELEMENTS_V7 : ELEMENTS;
  const e1 = els[fig], e2 = MAISON_ELEM_V7[pos];
  if (e1===e2) return true;
  return (e1==='feu'&&e2==='air')||(e1==='air'&&e2==='feu')||(e1==='terre'&&e2==='eau')||(e1==='eau'&&e2==='terre');
}

// ═══════════════════════════════════════════════════════════════
// NŒUDS D'ÉCHANGE — une maison (N'IMPORTE laquelle des 16) dont la
// figure de base et la résultante sont les DEUX bouts de la chaîne
// binôme d'un camp (amont = qui le nourrit, aval = son binôme direct).
// Ex. fondateur (7-0): M12 base=Amissio (amont de Tristitia/M1) et
// résultante=Carcer (aval de Tristitia) → nœud complet aligné → M1 écrase.
// Le nœud nourrit le camp (source de force), mais reste SUBORDONNÉ aux
// récits souverains du Juge (M3: nœud M7 → but précoce M7, puis Juge
// F.Minor renverse; Real: nœud M7 écrasé par juge-favori).
// STATUT : signal informatif.
// ═══════════════════════════════════════════════════════════════
function noeudsEchange(campPos, theme){
  const campFig = theme[campPos];
  const aval = BINOMES_V7[campFig];
  let amont = null;
  for (const f in BINOMES_V7) { if (BINOMES_V7[f]===campFig) { amont = f; break; } }
  const noeuds = [];
  for(let p=1;p<=16;p++){
    const base = theme[p], res = combine(theme[p], FIGS_V7[p-1]);
    if((base===amont&&res===aval)||(base===aval&&res===amont)){
      noeuds.push({p, base, res, aligne: figureAlignee(base, p, theme)});
    }
  }
  return noeuds;
}



// ═══════════════════════════════════════════════════════════════
// CHAMBRES FORMIDABLES PAR ALLÉGEANCE — doctrine des 16 maisons
// Une maison = une chambre à 3 habitants : figure de repos (les murs,
// opérateur de la résultante), figure de base (le locataire), résultante.
// Propriété structurelle : seules les maisons PAIRES (M2..M16) peuvent
// être harmonieuses (la boucle paire est un sous-groupe de la combinaison).
// Chambre FORMIDABLE = maison paire dont la base est de la boucle paire
// → base + résultante + maison toutes du même alignement.
// ALLÉGEANCE : la chambre sert le camp dont ses occupants (base ou
// résultante) appartiennent à la chaîne binôme du chef (chef, aval, amont)
// — PAS le camp de son territoire. Si les occupants ne servent aucune
// chaîne (ou les deux) : la chambre ne décide rien.
// Validation : capture le 7-0 (M12[Amissio→Carcer], M14[Carcer→Albus]
// nourrissaient Tristitia/M1 depuis le territoire de M7). Échecs = tous
// des matchs à juge souverain (F.Minor renverseur, juge-favori) →
// SUBORDONNÉE aux récits du Juge. STATUT : signal informatif.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// MODULATION CROISÉE F→E/D (06/07/26) — la maison du conflit/sanction
// (axe F, M6↔M12) aggrave le signal offensif (axe E, M5↔M11) ou
// défensif (axe D, M4↔M10) quand une figure négative/dangereuse loge
// en F ET que son binôme la confirme dans le thème (déclencheur validé,
// pas juste présence isolée). STATUT : signal informatif (📚 étude),
// pas encore contre-testé sur l'archive — ne pèse pas dans verdictFinal
// tant que non validé.
// ═══════════════════════════════════════════════════════════════
function scoreNegativiteFig(fig){
  var s = 0;
  if (!isForte(fig)) s += 1;
  if (!isOuverte(fig)) s += 1;
  if (!isActive(fig)) s += 1;
  return s;
}
function figureNegativeDangereuse(fig){
  return scoreNegativiteFig(fig) >= 2; // majorité de traits négatifs (faible/fermée/passive)
}
function binomeConfirmeDansTheme(fig, theme){
  var bin = BINOMES_V7[fig];
  if(!bin) return false;
  for(var p=1;p<=16;p++) if(theme[p]===bin) return true;
  return false;
}






// ═══════════════════════════════════════════════════════════════
// GUERRE CIVILE DE BOUCLE — doctrine de la trahison (02/07/26)
// Quand M1 et M7 sont de la MÊME boucle binôme (figures différentes),
// le duel est une guerre civile : mêmes maillons, chaînes enchevêtrées.
// TRAHISON : le binôme direct d'un camp (binA) attaque une figure X qui
// est elle-même l'antagoniste de l'arme adverse (binB). Plus binA frappe,
// plus il PROTÈGE binB → le camp est trahi par son propre soutien.
// Conditions d'effectivité (toutes présences comptées en BASE + RÉSULTANTES):
//   1. binA présent, 2. X (la cible) présent, 3. binB (l'arme protégée)
//   PRÉSENT — une trahison qui protège une arme absente est sans objet
//   (cf. M2 : Via protégeait un Conjunctio absent → M1 a gagné normalement).
// Validé 3/3 rétrospectif : M2 (inopérante → M1), M14 (aucune → M1),
// Albus/Carcer 2-4 (effective contre M1 → M7, contre TOUS les moteurs).
// PRIORITÉ : dans les duels intra-boucle, prime sur le verdict élémentaire.
// ═══════════════════════════════════════════════════════════════
function positionsBaseEtResultantes(fig, theme){
  const pos=[];
  for(let p=1;p<=16;p++){
    if(theme[p]===fig) pos.push('M'+p);
    if(combine(theme[p], FIGS_V7[p-1])===fig) pos.push('M'+p+'r');
  }
  return pos;
}
// CORRIGÉ (13/07/26, doctrine utilisateur) : roue classique des 4 éléments
// (feu=chaud/sec, air=chaud/humide, eau=froid/humide, terre=froid/sec),
// organisée en 2 trigones (feu+air = actif/masculin, eau+terre = passif/
// féminin). 4 paliers, pas 2 : identique=1 ; même trigone (feu-air ou
// eau-terre, partagent en plus la polarité active/passive)=0,5 ; trigones
// opposés mais qualité physique partagée (eau-air partagent humide,
// terre-feu partagent sec)=0,25 ; opposition totale, aucune qualité
// partagée (feu-eau, air-terre)=0. Avant cette correction, seuls feu-air
// et terre-eau avaient 0,5, tout le reste (y compris eau-air et terre-feu,
// qui ont une vraie concordance partielle) tombait à 0 comme feu-eau et
// air-terre — traitait à tort 6 paires différentes comme équivalentes.
function concordanceElement(a,b){
  if (a===b) return 1;
  if ((a==='feu'&&b==='air')||(a==='air'&&b==='feu')||(a==='eau'&&b==='terre')||(a==='terre'&&b==='eau')) return 0.5;
  if ((a==='eau'&&b==='air')||(a==='air'&&b==='eau')||(a==='feu'&&b==='terre')||(a==='terre'&&b==='feu')) return 0.25;
  return 0; // feu-eau, air-terre : opposition totale
}

// ═══════════════════════════════════════════════════════════════
// CHAÎNE DE FORCE (12/07/26, doctrine utilisateur) : la force d'un chef en
// guerre civile ne s'arrête pas à son binôme direct — elle se cumule sur
// toute la chaîne de binômes successive, tant que chaque maillon reste
// présent dans le thème (base OU résultante, n'importe quelle maison),
// pondérée par la concordance élémentaire (identique=1, feu/air ou
// terre/eau=0.5, sinon 0 — même échelle que compatEl dans duelBinomesDirects)
// de chaque siège occupé. Construite et vérifiée avec l'utilisateur sur
// Anderlecht vs Roma (réel M1 8-7) : chaîne M1 (Albus+Amissio+Tristitia)
// = 7.5 vs chaîne M7 (Amissio+Tristitia) = 5 → M1, correct — alors que
// l'ancien tiebreak "premier de boucle" (distance dans la boucle) n'y
// arrivait que par coïncidence structurelle propre à ce thème (M7 étant
// justement le binôme direct de M1). Les deux critères divergent dans
// ~29% des guerres civiles à égalité testées sur échantillon aléatoire.
// STATUT : validé sur 1 cas réel — remplace "premier de boucle" comme
// tiebreak final, qui reste en ultime repli si la chaîne de force égalise
// aussi (cas rare). À confirmer sur davantage de cas.
// ═══════════════════════════════════════════════════════════════
// CORRECTIF BIAIS BINÔME ADVERSE (14/07/26, cas Olympiacos-West Ham 7-7
// réel, prédit M1 à tort) : quand le chef adverse EST le binôme direct du
// chef évalué (ex. M7=Amissio est le binôme direct de M1=Albus), la
// chaîne de M1 démarre pile sur M7 et crédite sa propre force (le terme
// "Amissio=1.75" observé) — un bonus que la chaîne de M7 ne peut
// structurellement jamais recevoir en retour (elle démarre à SON binôme,
// pas à elle-même). Ce n'était pas un vrai signal de supériorité, juste
// un artefact de calcul qui a fait perdre l'égalité réelle. `chefAdverse`
// (optionnel) fait sauter ce maillon si rencontré, pour une comparaison
// symétrique entre les deux chaînes.
function chaineDeForce(chef, theme, chefAdverse){
  let cur = BINOMES_V7[chef]; let total = 0; const detail = [];
  for (let i=0; i<8; i++){
    if (cur === chef) break;
    if (chefAdverse && cur === chefAdverse){ cur = BINOMES_V7[cur]; continue; }
    const sieges = positionsBaseEtResultantes(cur, theme);
    if (!sieges.length) break;
    const el = ELEMENTS_V7[cur];
    let scoreFig = 0;
    sieges.forEach(s => {
      const h = parseInt(s.replace('M','').replace('r',''));
      scoreFig += concordanceElement(el, MAISON_ELEM_V7[h]);
    });
    total += scoreFig;
    detail.push(FL[cur]+'='+scoreFig);
    cur = BINOMES_V7[cur];
  }
  return {total: Math.round(total*10)/10, detail};
}

// ═══════════════════════════════════════════════════════════════
// GUERRE CIVILE GÉNÉRALISÉE (16/07/26) — cas Chelsea vs Club Atlético de
// Madrid (0-5 réel) : M7=Via gagne alors que SON binôme (Rubeus) est
// totalement absent du thème, contrairement à M1 dont le binôme (Via
// lui-même, ici) est présent — le signal "présence du binôme" est à
// l'envers si on l'applique à M1/M7. Hypothèse utilisateur : la vraie
// confrontation ne se joue pas entre M1 et M7, mais entre R1 et R7 (la
// paire de la rotation). Généralise ici toute la cascade guerre civile
// du jour (attaques effectives, bouclier libre, état des chefs, chaîne
// de force) pour qu'elle accepte n'importe quelle paire de figures/
// maisons, pas seulement M1 (maison 1) et M7 (maison 7).
// STATUT (16/07/26, testé sur les 27 matchs archivés) : PAS encore
// validé comme supérieur à la version M1/M7 — cascade sur M1/M7 = 5/10
// quand applicable (50%), cascade sur R1/R7 = 7/13 quand applicable
// (54%) — les deux au niveau du bruit sur ce petit échantillon. Gardé
// en observation/test actif (panneau dédié) plutôt que promu en verdict
// décisionnel : la force réelle de la rotation vient du moteur de
// dominance/capacité de buildVerdictCard, pas de cette mécanique-ci.
//
// MISE À JOUR (04/08/26, recalculé sur les 70 matchs archivés avec thème
// complet, via export JSON réel) : le résultat s'INVERSE et se dégrade.
// Cascade M1/M7 = 13/35 applicable (37.1%). Cascade R1/R7 = 11/41
// applicable (26.8%) — R1/R7 est maintenant MOINS fiable que M1/M7, pas
// plus, et les deux sont sous le niveau utile. Croisé aussi avec les
// signaux binôme R1 / R1-R7 même élément (📚 étude, signalsR1R7Rotation) :
// aucune convergence trouvée — la cascade Guerre Civile ne confirme pas
// ces signaux plus simples. Conclusion (04/08/26) : ne pas faire
// confiance à 54%/50% (n=27) comme référence, remplacé par ces chiffres.
// Cascade toujours NON promue en verdict décisionnel — statut inchangé,
// gardée en observation seule.
function guerreCivileGenerale(figA, maisonA, figB, maisonB, theme){
  const memeBoule = (function(){
    let cur = BINOMES_V7[figA];
    for (let i=0;i<8;i++){ if (cur===figB) return true; if (cur===figA) break; cur = BINOMES_V7[cur]; }
    return false;
  })();
  if (!memeBoule) return {applicable:false};
  const forceBouclier = agresseur => {
    if (agresseur === 'populus') return 0;
    const bouclier = ANTAGONISTES_V7[agresseur];
    let score = 0;
    positionsBaseEtResultantes(bouclier, theme).forEach(s => { score += s.indexOf('r')===-1?1:0.5; });
    return score;
  };
  const aA = ANTAGONISTES_V7[figA], aB = ANTAGONISTES_V7[figB];
  const fbA = forceBouclier(aA), fbB = forceBouclier(aB);
  const attEffG = (fig, maison, monBouclier, autreBouclier) => {
    if (FIGS_V7[maison-1]===fig) return 0;
    const a = ANTAGONISTES_V7[fig];
    if (a==='populus') return 0;
    const sieges = positionsBaseEtResultantes(a, theme).map(x=>parseInt(x.replace('M','').replace('r','')));
    if (!sieges.length) return null;
    if (BINOMES_V7[a]!=='populus' && positionsBaseEtResultantes(BINOMES_V7[a], theme).length===0) return 0;
    if (monBouclier > autreBouclier) return 0;
    let n=0; sieges.forEach(p=>{ n += (p===maison?3:1); });
    return n;
  };
  const eA = attEffG(figA, maisonA, fbA, fbB), eB = attEffG(figB, maisonB, fbB, fbA);
  if (eA!==null && eB!==null && eA!==eB){
    return {applicable:true, winner: eA<eB?'A':'B', why:'attaques effectives : '+eA+' vs '+eB};
  }
  if (eA===0 && eB===0){
    const sourceNeutralisationG = (fig, maison, monBouclier, autreBouclier) => {
      if (FIGS_V7[maison-1]===fig) return {type:'chez-lui'};
      const a = ANTAGONISTES_V7[fig];
      if (a==='populus') return {type:'trivial'};
      const siegesA = positionsBaseEtResultantes(a, theme);
      if (!siegesA.length) return {type:'absent'};
      const binA = BINOMES_V7[a];
      const affame = binA!=='populus' && positionsBaseEtResultantes(binA, theme).length===0;
      if (affame) return {type:'affame'};
      if (monBouclier > autreBouclier) {
        const bouclierFig = ANTAGONISTES_V7[a];
        const antBouclier = ANTAGONISTES_V7[bouclierFig];
        const libre = monBouclier > 0 && positionsBaseEtResultantes(antBouclier, theme).length === 0;
        return {type:'bouclier', libre};
      }
      return {type:'indetermine'};
    };
    const sA = sourceNeutralisationG(figA, maisonA, fbA, fbB), sB = sourceNeutralisationG(figB, maisonB, fbB, fbA);
    const actifG = s => s.type==='bouclier' && s.libre;
    if (actifG(sA) && !actifG(sB)) return {applicable:true, winner:'A', why:'bouclier actif et libre côté A ('+sA.type+') vs protection passive côté B ('+sB.type+')'};
    if (actifG(sB) && !actifG(sA)) return {applicable:true, winner:'B', why:'bouclier actif et libre côté B ('+sB.type+') vs protection passive côté A ('+sA.type+')'};
  }
  const etatCG = (fig, maison, monBouclier, autreBouclier) => {
    if (FIGS_V7[maison-1]===fig) return {rang:4, absent:false};
    const nourri = BINOMES_V7[fig]==='populus' ? true : positionsBaseEtResultantes(BINOMES_V7[fig], theme).length>0;
    const antFig = ANTAGONISTES_V7[fig];
    const antTrivial = antFig==='populus';
    const antAbsent = !antTrivial && positionsBaseEtResultantes(antFig, theme).length===0;
    const antAffame = !antTrivial && !antAbsent && BINOMES_V7[antFig]!=='populus' && positionsBaseEtResultantes(BINOMES_V7[antFig], theme).length===0;
    const antBouclier = !antTrivial && !antAbsent && !antAffame && monBouclier > autreBouclier;
    const attaque = (antTrivial || antAbsent || antAffame || antBouclier) ? false : true;
    const rang = nourri&&!attaque?3 : nourri?2 : !attaque?1 : 0;
    return {rang, absent: antAbsent};
  };
  const ecA=etatCG(figA,maisonA,fbA,fbB), ecB=etatCG(figB,maisonB,fbB,fbA);
  if (!ecA.absent && !ecB.absent && ecA.rang!==ecB.rang){
    return {applicable:true, winner: ecA.rang>ecB.rang?'A':'B', why:'état des chefs : '+ecA.rang+' vs '+ecB.rang};
  }
  const cfA = chaineDeForce(figA, theme, figB), cfB = chaineDeForce(figB, theme, figA);
  if (cfA.total !== cfB.total){
    return {applicable:true, winner: cfA.total>cfB.total?'A':'B', why:'chaîne de force : '+cfA.total+' vs '+cfB.total};
  }
  return {applicable:true, winner:'Nul', why:'impasse totale de boucle'};
}
function guerreCivileR1R7(theme){
  const orderRot = getRotationOrderFromRepos(theme[1]);
  const hR1 = orderRot[0], hR7 = orderRot[6];
  const figR1 = theme[hR1], figR7 = theme[hR7];
  const res = guerreCivileGenerale(figR1, hR1, figR7, hR7, theme);
  return Object.assign({hR1, hR7, figR1, figR7}, res);
}

// ═══════════════════════════════════════════════════════════════
// EFFONDREMENT VITAL — alarme rouge (03/07/26, autopsie du 3-4)
// Bilan vital d'un chef (toutes présences en BASE + RÉSULTANTES) :
//   SOURCE   : son amont (qui le nourrit dans la boucle) est présent
//   BOUCLIER : l'antagoniste de son agresseur est présent (défense en chaîne)
//   INFILTRATION : la résultante du chef dans sa propre maison EST son agresseur
// L'alarme ne se déclenche qu'à l'EFFONDREMENT TOTAL : sans source
// ET sans bouclier (agresseur présent) ET infiltré. Une faiblesse isolée
// ne condamne pas (M13 : sans bouclier → 7-0 quand même, nourri par son
// nœud; M8 : infiltré → victoire quand même). C'est le CUMUL qui tue.
// Validé 1/1 : Amissio/Cauda 3-4 — chute du favori contre tous les moteurs.
// STATUT : alarme informative, ne classe pas — signale un chef en détresse.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// THÈME DÉTRUIT — signe traditionnel arabo-médiéval (03/07/26)
// Rubeus ou Cauda Draconis en M1 : le thème est réputé détruit sans
// être jugé — sa réponse peut être trouble, absente, ou parler d'autre
// chose que la question posée. Croisement archive : 2/2 sur les thèmes
// à réponse trouble (3-3 tous moteurs muets; USA-Bosnie V7 faux).
// Les autres candidats testés (juge étranger, tierce saturée, chef
// fantôme) n'ont montré AUCUN pouvoir discriminant — écartés.
// STATUT : avertissement informatif d'héritage traditionnel.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// FORCE ET LIBERTÉ D'UNE FIGURE — définition canonique (03/07/26)
// « C'est le binôme qui renforce la figure. Une figure avec binôme,
// sans son antagoniste dans le thème, est FORTE ET LIBRE : elle détruit
// effectivement la figure dont elle est l'antagoniste. »
// États : FORTE-LIBRE (binôme ✓, antagoniste ✗) / entravée (les deux ✓)
// / affamée-libre (les deux ✗) / morte (binôme ✗, antagoniste ✓).
// Présences en base + résultantes.
// Application au chef : un agresseur FORT-LIBRE est un danger mortel —
// validé : 2-4 (Puer libre), 3-4 (Caput libre), et M8 expliqué (même
// siège mais Caput ENTRAVÉ par Populus → Amissio survit et gagne).
// Exception connue : M13 (7-0) — le chef nourri par un NŒUD D'ÉCHANGE
// COMPLET résiste même à la frappe libre. STATUT : signal informatif.
// ═══════════════════════════════════════════════════════════════
function forceFigure(fig, theme){
  const nourrie = positionsBaseEtResultantes(BINOMES_V7[fig], theme).length > 0;
  const attaquee = positionsBaseEtResultantes(ANTAGONISTES_V7[fig], theme).length > 0;
  const etat = nourrie && !attaquee ? 'FORTE-LIBRE' : nourrie && attaquee ? 'entravée' : !nourrie && !attaquee ? 'affamée-libre' : 'morte';
  return {nourrie, attaquee, etat, forteLibre: nourrie && !attaquee};
}

// ═══════════════════════════════════════════════════════════════
// CHAÎNE DE REPOS — signal souverain dormant (doctrine, 03/07/26)
// Chaîne CONSÉCUTIVE de la lignée du chef, chaque maillon assis dans
// SA PROPRE maison de repos : binôme du chef chez lui, puis le binôme
// de celui-ci chez lui, etc. (ex: Amissio@M6, Tristitia@M8, Carcer@M10).
// « Plus de deux figures → 1000 chances de gagner » — configuration
// souveraine de la tradition. JAMAIS observée sur 16 thèmes (max 1
// maillon) : signal rarissime, incontesté, dormant.
// ═══════════════════════════════════════════════════════════════
function chaineDeRepos(theme){
  // Chaîne LIBRE : plus longue suite consécutive (ordre binôme) de figures
  // chacune chez elle (base OU résultante dans sa maison de repos),
  // départ depuis n'importe quelle figure. Seuil souverain : ≥3 maillons.
  const chezElle = f => {
    const m = FIGS_V7.indexOf(f)+1;
    return theme[m]===f || combine(theme[m], FIGS_V7[m-1])===f;
  };
  let best = {n:0, membres:[], aval:null};
  FIGS_V7.forEach(start=>{
    let f=start, n=0; const membres=[];
    for(let i=0;i<8;i++){
      if(chezElle(f)){ n++; membres.push(f); f=BINOMES_V7[f]; }
      else break;
    }
    if(n>best.n) best={n, membres, aval:f};
  });
  return best;
}

// ═══════════════════════════════════════════════════════════════
// ORIENTATION DES FORCES (04/07/26) — « la concordance rend la figure
// forte ; le binôme présent rend sa force indiscutable ; mais c'est la
// concordance DU BINÔME qui oriente cette force. » Un binôme
// parfaitement assis (ex. Tristitia en sa maison M8) exerce destruction
// et blocage sur sa cible ; un binôme mal assis fait tirer trouble.
// Échelle d'assise : repos absolu (3) > parfaite (2) > compatible (1)
// > mauvaise (0) > absent (−1). Validé 7/7 hors matchs gouvernés par
// les couches souveraines (récits, duel intra, profil du nul).
// STATUT : signal informatif subordonné.
// ═══════════════════════════════════════════════════════════════
function orientationForces(theme){
  const els = (typeof ELEMENTS_V7!=='undefined') ? ELEMENTS_V7 : ELEMENTS;
  function assise(cp){
    const bin = BINOMES_V7[theme[cp]];
    const sieges = [];
    for(let p=1;p<=16;p++){
      if(theme[p]===bin) sieges.push(p);
      if(combine(theme[p], FIGS_V7[p-1])===bin) sieges.push(p);
    }
    if(!sieges.length) return {sc:-1, d:FL[bin]+' ABSENT — force sans orientation, fragile'};
    let best=0, bd='mauvaise partout — tir trouble';
    sieges.forEach(p=>{
      const repos = FIGS_V7[p-1]===bin && theme[p]===bin;
      const parf = els[bin]===MAISON_ELEM_V7[p];
      const comp = (els[bin]==='feu'&&MAISON_ELEM_V7[p]==='air')||(els[bin]==='air'&&MAISON_ELEM_V7[p]==='feu')||(els[bin]==='terre'&&MAISON_ELEM_V7[p]==='eau')||(els[bin]==='eau'&&MAISON_ELEM_V7[p]==='terre');
      const v = repos?3:parf?2:comp?1:0;
      if(v>best){best=v; bd=FL[bin]+' '+(repos?'en REPOS ABSOLU':parf?'en concordance PARFAITE':comp?'en concordance compatible':'mal assis')+' @M'+p+(v>=2?' — destruction effective sur sa cible':v===1?' — tir correct':' — tir trouble');}
    });
    return {sc:best, d:bd};
  }
  const o1=assise(1), o7=assise(7);
  return {o1, o7, resume:'M1 → '+o1.d+' | M7 → '+o7.d};
}

// ═══════════════════════════════════════════════════════════════
// FRAPPE IMMINENTE & FIGURES AUTONOMES (04/07/26 — leçon étape 5)
// « Une frappe négative imminente : une figure antagoniste dans sa
// maison de repos ET son binôme aussi chez lui → cela DÉTRUIT sa cible.
// La destruction s'élargit à mesure que la chaîne de repos s'étend »
// (Amissio@M6 + Tristitia@M8 détruit F.Minor ; + Carcer@M10 détruit
// aussi Conjunctio). Corollaire Populus : résultante-Populus ⟺ la base
// est la figure de repos de la maison (voile du repos).
// « Figures AUTONOMES : leur résultante dans cette maison EST leur
// propre binôme — elles s'auto-nourrissent » (Puer@M6→Caput,
// Albus@M2→Amissio, Puella@M14→Populus...).
// STATUT : signaux d'étude — à confirmer avant promotion au verdict.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// CHEF CONFONDU AVEC SON DESTRUCTEUR (04/07/26 — leçon du 3-2)
// Un chef dont la figure cohabite quelque part (base/résultante d'une
// même chambre) avec son antagoniste EFFECTIF (nourri ET libre) est
// compromis. Filtre validé : au M8, Caput cohabitant était ENTRAVÉ par
// Populus en base → cohabitation inerte, M1 a gagné. 6/6 dans son
// domaine (subordonné au profil du nul qui parle avant).
// DOCTRINE DES COALITIONS PAR CIBLES (à approfondir thème par thème) :
// « les alliances ne suivent pas les meutes, elles suivent les CIBLES —
// une figure peut œuvrer pour son propre ennemi » (Via, chassée par
// Laetitia, détruit Tristitia l'adversaire de Laetitia : elle sert sa
// chasseresse). Chaque chambre est une coalition, jugée à qui elle
// frappe et qui elle nourrit. Leçon fondatrice : le 3-2 du 22/06 où les
// attaques effectives (M7) et le V7 (M7) ont été renversés par le
// réseau des coalitions (M8 pour M1, M14-nourrice, Laetitia ×4).
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// ORIENTATION R1/R7 (04/07/26) — inclinaison de départ, PAS un verdict
// R1 = résultante de la 1re maison de la rotation ; R7 = celle de la 7e.
// X = R1 + R7. On compare la compatibilité ÉLÉMENTAIRE de X avec R1 et
// avec R7 : le plus compatible indique de quel côté la confrontation
// PENCHE — une simple inclinaison structurelle de départ, à confirmer
// (ou renverser) par les meutes, concordances et coalitions.
// « Le favori ne veut pas dire vainqueur ; savoir de quel côté va la
// confrontation ne désigne pas le gagnant. » ZÉRO poids sur le verdict.
