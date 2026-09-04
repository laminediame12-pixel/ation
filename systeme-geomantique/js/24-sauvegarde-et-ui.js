// ═══════════════════════════════════════════════════════════════
// SAUVEGARDE ET UI
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// TABLEAU DE RÉFÉRENCE — MOTIF DU BTTS (03/09/26, demande Ellemine_D) —
// liste, thème par thème, les colonnes calculées par tableauReferenceBTTS
// (figures offensive/défensive, confirmation du Juge, figure du jour,
// planète gouvernante) à côté du BTTS prédit et du BTTS réel (dérivé du
// score réel saisi). Pur outil d'observation : aucune conclusion n'est
// tirée ici, le but est d'accumuler assez de thèmes réels pour qu'un
// motif, s'il existe, devienne visible à l'œil. Les thèmes tirés avant
// cette maintenance n'ont pas de colonne refBTTS (affiché "—").
// ═══════════════════════════════════════════════════════════════
function renderTableauReferenceBTTSTab(){
  currentTab = 'refbtts';
  ['tabHistBtn','tabSaveBtn','tabStatsBtn','tabRefBtn'].forEach(function(id){
    var b = document.getElementById(id); if (b) b.style.background = '';
  });
  var btnRef = document.getElementById('tabRefBtn'); if (btnRef) btnRef.style.background = '#1e3a8a';

  var all = getHistoryList().concat(getSavedList());
  var seen = {}; var list = [];
  all.forEach(function(e){
    // Garde-fou (même protection que renderStatsTab) : une entrée sans
    // thème (ancienne version, donnée corrompue) ferait planter
    // themeFingerprint (Object.keys sur undefined) et donc tout l'onglet.
    if (!e.theme) return;
    var fp = themeFingerprint(e.team1||'', e.team2||'', e.theme);
    if (seen[fp]) return; seen[fp] = true;
    list.push(e);
  });
  list.sort(function(a,b){ return new Date(b.savedAt||0) - new Date(a.savedAt||0); });

  function b(v){ return v===true ? '✓' : v===false ? '✗' : '—'; }
  function figLabel(fig){ return fig ? (FL[fig]||fig) : '—'; }
  function jugeConfirme(r){
    if (!r) return '—';
    if (r.jugeConfirmeM1 && r.jugeConfirmeM7) return 'M1+M7';
    if (r.jugeConfirmeM1) return 'M1';
    if (r.jugeConfirmeM7) return 'M7';
    return 'aucun';
  }
  var avecDonnees = 0;
  var rows = list.map(function(e){
    var r = e.refBTTS;
    if (r) avecDonnees++;
    var predG1 = e.verdict ? e.verdict.goalM1 : null, predG7 = e.verdict ? e.verdict.goalM7 : null;
    var bttsPredit = (predG1 != null && predG7 != null) ? (predG1 > 0 && predG7 > 0) : null;
    var m = e.realScore ? String(e.realScore).match(/^\s*(\d+)\s*-\s*(\d+)\s*$/) : null;
    var bttsReel = m ? (parseInt(m[1], 10) > 0 && parseInt(m[2], 10) > 0) : null;
    return '<tr>'
      + '<td style="padding:4px;">' + escHtml(e.team1 || '?') + ' vs ' + escHtml(e.team2 || '?') + '</td>'
      + '<td style="padding:4px;">' + escHtml(e.matchDate || '—') + '</td>'
      + '<td style="padding:4px;">' + (r ? figLabel(r.figOffensive) + ' ' + b(r.offensivePresente) : '—') + '</td>'
      + '<td style="padding:4px;">' + (r ? figLabel(r.figDefensiveM1) + ' ' + b(r.defensiveM1Presente) : '—') + '</td>'
      + '<td style="padding:4px;">' + (r ? figLabel(r.figDefensiveM7) + ' ' + b(r.defensiveM7Presente) : '—') + '</td>'
      + '<td style="padding:4px;">' + jugeConfirme(r) + '</td>'
      + '<td style="padding:4px;">' + (r ? figLabel(r.figureDuJour) + ' ' + b(r.figureDuJourPresente) : '—') + '</td>'
      + '<td style="padding:4px;">' + (r ? escHtml(r.planeteDuJour) + ' (' + figLabel(r.figureGouvernante) + ') ' + b(r.figureGouvernantePresente) : '—') + '</td>'
      + '<td style="padding:4px; text-align:center;">' + b(bttsPredit) + '</td>'
      + '<td style="padding:4px; text-align:center;">' + b(bttsReel) + '</td>'
      + '</tr>';
  }).join('');

  var h = '<div class="card">';
  h += '<h3>📋 Tableau de référence — motif du "les deux marquent"</h3>';
  h += '<div class="muted" style="font-size:11px; margin-bottom:8px;">Observation en cours — aucune colonne ci-dessous n\'est une règle validée, c\'est un tableau à faire grossir au fil des vrais matchs. '
    + avecDonnees + '/' + list.length + ' thème(s) avec les données (les thèmes tirés avant le 03/09/26 n\'en ont pas). '
    + 'Renseigne le score réel dans l\'onglet Sauvegardés pour remplir la colonne BTTS réel.</div>';
  if (!list.length) {
    h += '<div class="muted">Aucun thème dans l\'historique pour l\'instant.</div>';
  } else {
    h += '<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:11px;">'
      + '<tr style="background:#1e293b;">'
      + '<th style="padding:4px; text-align:left;">Match</th><th style="padding:4px;">Date</th>'
      + '<th style="padding:4px;">Offensive (3-5-9-11)</th><th style="padding:4px;">Défensive M1 (4-10-1)</th><th style="padding:4px;">Défensive M7 (4-10-7)</th>'
      + '<th style="padding:4px;">Juge confirme</th><th style="padding:4px;">Figure du jour</th><th style="padding:4px;">Planète (fig. gouv.)</th>'
      + '<th style="padding:4px;">BTTS prédit</th><th style="padding:4px;">BTTS réel</th>'
      + '</tr>' + rows + '</table></div>';
  }
  h += '</div>';
  document.getElementById('historyList').innerHTML = h;
}

function addToHistory() {
  if (!currentTheme || !currentAnalysis) return;
  // Un simple changement de thème actif (Principal / axes) ne doit rien
  // archiver — cf. setAxisDisplayTheme.
  if (typeof axisSansArchive !== 'undefined' && axisSansArchive) return;
  var team1 = (document.getElementById('team1')||{}).value || 'Equipe 1';
  var team2 = (document.getElementById('team2')||{}).value || 'Equipe 2';
  var matchDate = (document.getElementById('matchDate')||{}).value || '';
  var matchTime = (document.getElementById('matchTime')||{}).value || '';
  var matchTimezone = (document.getElementById('matchTimezone')||{}).value || '0';
  var competition = (document.getElementById('competitionMode')||{}).value || 'fra_l1';
  var favorite = (document.getElementById('matchFavorite')||{}).value || 'none';
  var fp = themeFingerprint(team1, team2, currentTheme);
  var list = getHistoryList();
  if (list.length && themeFingerprint(list[0].team1, list[0].team2, list[0].theme) === fp) return;
  // CORRIGÉ (20/08/26, demande Ellemine_D "rebranche l'archive sur le vrai
  // verdict") : archivait v7 (moteur V7 legacy, jamais celui affiché à
  // l'écran depuis le passage au protocole R1/R7). getVerdictAfficheReel()
  // rejoue EXACTEMENT le pipeline du panneau principal (nul → protocole
  // R1/R7 → buildVerdictCard) — ce qui est archivé = ce que tu regardes.
  var vf = verdictFinal(currentTheme, favorite);
  var reel = getVerdictAfficheReel(currentTheme, favorite);
  var entry = {
    id: Date.now()+'_'+Math.random().toString(36).slice(2,6),
    savedAt: new Date().toISOString(),
    castAt: themeCastAt || new Date().toISOString(),
    delaiTirageMin: calculerDelaiTirageMinutes(matchDate, matchTime, themeCastAt, matchTimezone),
    team1:team1, team2:team2, matchDate:matchDate, matchTime:matchTime, matchTimezone:matchTimezone, competition:competition, favorite:favorite,
    // ─── LE FORMAT EST GELÉ AVEC LE THÈME (30/08/26) ───
    // Le favori l'était déjà, pas le format. Un thème e-sport sauvegardé
    // était rejoué au banc sur l'échelle du menu au moment du rejeu, pas
    // sur la sienne — même défaut que pour les cas d'archive.
    matchFormat: (document.getElementById('matchFormat')||{}).value || 'reel',
    theme: Object.assign({}, currentTheme),
    interpretation: getInterpretationText(),
    realPenalty: (document.getElementById('realPenalty')||{}).value || '',
    realFirstGoal: (document.getElementById('realFirstGoal')||{}).value || '',
    blindTest: lastLaunchWasBlind,
    // Signal informatif en cours d'observation, cf. coincidenceJugeAxesV7.
    coincidenceJugeAxes: (function(){ try { return coincidenceJugeAxesV7(currentTheme); } catch(e){ return null; } })(),
    // Tableau d'observation pour le motif du BTTS, cf. tableauReferenceBTTS.
    refBTTS: (function(){ try { return tableauReferenceBTTS(currentTheme, matchDate); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalM4M10BoucleV7.
    signalM4M10Boucle: (function(){ try { return signalM4M10BoucleV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalM15M16BoucleV7.
    signalM15M16Boucle: (function(){ try { return signalM15M16BoucleV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalAxeCadentInverseV7.
    signalAxeCadentInverse: (function(){ try { return signalAxeCadentInverseV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalRecouvrementCampsV7.
    signalRecouvrementCamps: (function(){ try { return signalRecouvrementCampsV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalFragiliteM4M10V7.
    signalFragiliteM4M10: (function(){ try { return signalFragiliteM4M10V7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalM4JugeRecitBttsV7.
    signalM4JugeRecitBtts: (function(){ try { return signalM4JugeRecitBttsV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalJugePopulusChaosV7.
    signalJugePopulusChaos: (function(){ try { return signalJugePopulusChaosV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. densiteIncidentV7.
    densiteIncident: (function(){ try { return densiteIncidentV7(currentTheme); } catch(e){ return null; } })(),
    // Géométrie acquise, contenu encore à l'étude — cf. geometrieIntersectionsM1M7V7.
    geometrieIntersectionsM1M7: (function(){ try { return geometrieIntersectionsM1M7V7(currentTheme); } catch(e){ return null; } })(),
    // ─── CORRIGÉ LE 28/08/26, SUR SIGNALEMENT D'ELLEMINE_D ───
    // « le verdict final donne victoire R7 mais le score donne R1 » — sur
    // le thème Caput/Acquisitio/Conjonctio/Via, l'entrée affichait
    // « 5-3 (predit) Bayer 04 » : un score qui fait gagner M1 et un nom
    // d'équipe qui désigne M7. Il avait raison, et ce n'était pas un
    // détail d'affichage.
    // CAUSE : l'entrée était composée de DEUX moteurs différents —
    // winner venait de verdictFinal (le moteur historique), le score de
    // getVerdictAfficheReel (le moteur affiché). Or les deux divergent
    // sur 42 % des thèmes. Le vainqueur enregistré contredisait donc son
    // propre score dans 42 % des cas ici, et 47 % dans saveManuel.
    // DÉSORMAIS : le vainqueur ET le score viennent tous deux du verdict
    // AFFICHÉ. Les valeurs des moteurs historiques restent enregistrées
    // à côté, sous des noms qui disent ce qu'elles sont.
    verdict: { winner:reel.winner, winnerRaw:reel.winner,
      goalM1:reel.goalM1, goalM7:reel.goalM7, scoreMain:reel.scoreMain,
      htWinner:reel.htWinner, penalty:reel.penalty, corrected:reel.corrected,
      cornersM1:reel.cornersM1, cornersM7:reel.cornersM7, cornersDominant:reel.cornersDominant,
      incidentCamp:reel.incidentCamp,
      // conservés pour comparaison, jamais affichés comme le verdict
      winnerLegacyVf:vf.winner, vfType:vf.type, vfLabel:vf.label }
  };
  list.unshift(entry);
  if (list.length > 200) list.length = 200;
  setHistoryList(list);
}

function saveManuel() {
  if (!currentTheme || !currentAnalysis) { alert('Lance un theme.'); return; }
  var team1 = (document.getElementById('team1')||{}).value || 'Equipe 1';
  var team2 = (document.getElementById('team2')||{}).value || 'Equipe 2';
  var matchDate = (document.getElementById('matchDate')||{}).value || '';
  var matchTime = (document.getElementById('matchTime')||{}).value || '';
  var matchTimezone = (document.getElementById('matchTimezone')||{}).value || '0';
  var competition = (document.getElementById('competitionMode')||{}).value || 'fra_l1';
  var favorite = (document.getElementById('matchFavorite')||{}).value || 'none';
  var fp = themeFingerprint(team1, team2, currentTheme);
  var list = getSavedList();
  var exists = list.some(function(e){ return themeFingerprint(e.team1,e.team2,e.theme)===fp; });
  var btn = document.getElementById('saveBtn');
  if (exists) {
    if (btn) { btn.textContent='Deja sauvegarde'; setTimeout(function(){btn.textContent='Enregistrer';},2000); }
    return;
  }
  var v7 = currentAnalysis.v7;
  var vf = verdictFinal(currentTheme, favorite);
  var reel = getVerdictAfficheReel(currentTheme, favorite);
  var entry = {
    id: Date.now()+'_'+Math.random().toString(36).slice(2,6),
    savedAt: new Date().toISOString(),
    castAt: themeCastAt || new Date().toISOString(),
    delaiTirageMin: calculerDelaiTirageMinutes(matchDate, matchTime, themeCastAt, matchTimezone),
    team1:team1, team2:team2, matchDate:matchDate, matchTime:matchTime, matchTimezone:matchTimezone, competition:competition, favorite:favorite,
    // ─── LE FORMAT EST GELÉ AVEC LE THÈME (30/08/26) ───
    // Le favori l'était déjà, pas le format. Un thème e-sport sauvegardé
    // était rejoué au banc sur l'échelle du menu au moment du rejeu, pas
    // sur la sienne — même défaut que pour les cas d'archive.
    matchFormat: (document.getElementById('matchFormat')||{}).value || 'reel',
    theme: Object.assign({}, currentTheme),
    interpretation: getInterpretationText(),
    realPenalty: (document.getElementById('realPenalty')||{}).value || '',
    realFirstGoal: (document.getElementById('realFirstGoal')||{}).value || '',
    blindTest: lastLaunchWasBlind,
    // Signal informatif en cours d'observation, cf. coincidenceJugeAxesV7.
    coincidenceJugeAxes: (function(){ try { return coincidenceJugeAxesV7(currentTheme); } catch(e){ return null; } })(),
    // Tableau d'observation pour le motif du BTTS, cf. tableauReferenceBTTS.
    refBTTS: (function(){ try { return tableauReferenceBTTS(currentTheme, matchDate); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalM4M10BoucleV7.
    signalM4M10Boucle: (function(){ try { return signalM4M10BoucleV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalM15M16BoucleV7.
    signalM15M16Boucle: (function(){ try { return signalM15M16BoucleV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalAxeCadentInverseV7.
    signalAxeCadentInverse: (function(){ try { return signalAxeCadentInverseV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalRecouvrementCampsV7.
    signalRecouvrementCamps: (function(){ try { return signalRecouvrementCampsV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalFragiliteM4M10V7.
    signalFragiliteM4M10: (function(){ try { return signalFragiliteM4M10V7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalM4JugeRecitBttsV7.
    signalM4JugeRecitBtts: (function(){ try { return signalM4JugeRecitBttsV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. signalJugePopulusChaosV7.
    signalJugePopulusChaos: (function(){ try { return signalJugePopulusChaosV7(currentTheme); } catch(e){ return null; } })(),
    // Signal informatif en cours d'observation, cf. densiteIncidentV7.
    densiteIncident: (function(){ try { return densiteIncidentV7(currentTheme); } catch(e){ return null; } })(),
    // Géométrie acquise, contenu encore à l'étude — cf. geometrieIntersectionsM1M7V7.
    geometrieIntersectionsM1M7: (function(){ try { return geometrieIntersectionsM1M7V7(currentTheme); } catch(e){ return null; } })(),
    // Même correction qu'au-dessus, en pire : ici le score venait de
    // verdictV7, un TROISIÈME moteur, et le vainqueur de verdictFinal.
    // Aucun des deux n'était celui affiché en haut de l'écran. Mesuré :
    // le vainqueur enregistré contredisait son propre score sur 47 % des
    // thèmes. Tout vient maintenant du verdict affiché.
    verdict: { winner:reel.winner, winnerRaw:reel.winner,
      goalM1:reel.goalM1, goalM7:reel.goalM7, scoreMain:reel.scoreMain,
      htWinner:reel.htWinner, penalty:reel.penalty, corrected:reel.corrected,
      cornersM1:reel.cornersM1, cornersM7:reel.cornersM7, cornersDominant:reel.cornersDominant,
      incidentCamp:reel.incidentCamp,
      winnerLegacyVf:vf.winner, vfType:vf.type, vfLabel:vf.label,
      scoreLegacyV7:v7.scoreMain, winnerLegacyV7:v7.winner }
  };
  list.unshift(entry);
  if (list.length > 100) list.length = 100;
  setSavedList(list);
  if (btn) { btn.textContent='Sauvegarde OK'; setTimeout(function(){btn.textContent='Enregistrer';},2000); }
}

function formatHistoryDate(isoString) {
  try {
    var d = new Date(isoString);
    var pad = function(n){ return String(n).length<2?'0'+n:String(n); };
    return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()+' '+pad(d.getHours())+':'+pad(d.getMinutes());
  } catch(e) { return isoString; }
}

function switchTab(tab) {
  currentTab = tab;
  var bH = document.getElementById('tabHistBtn');
  var bS = document.getElementById('tabSaveBtn');
  var bST = document.getElementById('tabStatsBtn');
  if (bH) bH.style.background = tab==='hist' ? '#1e3a8a' : '';
  if (bS) bS.style.background = tab==='save' ? '#1e3a8a' : '';
  if (bST) bST.style.background = '';
  renderCurrentList();
}


function openSavedPanel()   { currentTab='save'; _openPanel(); }
// ─── OUVERTURE DU PANNEAU : DEUX GASPILLAGES SUPPRIMÉS (28/08/26) ───
// Ellemine_D : « pourquoi quand je clique sur sauvegarde ça met du temps
// à ouvrir ». Mesuré avant correction : 305 ms à 5 thèmes, 687 ms à 20,
// 1 369 ms à 40 — et le calcul est BLOQUANT, donc sur téléphone c'est
// plusieurs secondes d'écran figé.
// Deux causes, toutes deux gratuites à corriger :
//   1. la liste était rendue DEUX FOIS à chaque ouverture — renderCurrentList()
//      ici, puis switchTab() qui la re-rend intégralement ;
//   2. le panneau ne s'affichait qu'APRÈS le calcul complet.
// Désormais : le panneau s'ouvre d'abord, la liste se rend une seule
// fois, et le rendu est repoussé d'un tour de boucle pour que l'écran
// apparaisse immédiatement.
function _openPanel() {
  var o = document.getElementById('historyOverlay');
  if (o) o.classList.add('open');
  var c = document.getElementById('historyList');
  if (c) c.innerHTML = '<div class="history-empty">Chargement…</div>';
  setTimeout(function () { switchTab(currentTab); }, 0);
}
function closeHistoryPanel() {
  var o = document.getElementById('historyOverlay');
  if (o) o.classList.remove('open');
}

function renderCurrentList() {
  var list = currentTab==='hist' ? getHistoryList() : getSavedList();
  var label = currentTab==='hist' ? 'historique' : 'sauvegardes';
  var deleteFn = currentTab==='hist' ? 'deleteHistEntry' : 'deleteSaveEntry';
  var container = document.getElementById('historyList');
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<div class="history-empty">Aucune entree dans les ' + label + '.</div>';
    return;
  }

  var summaryHtml = '';
  if (currentTab === 'save') {
    var evaluated = list.filter(function(e){ return e.realScore; });
    if (evaluated.length) {
      var counts = {high:0, mid:0, low:0};
      evaluated.forEach(function(e){ var c = evalCoherence(e); if (counts[c.level] !== undefined) counts[c.level]++; });
      var total = evaluated.length;
      var pctHigh = Math.round(counts.high/total*100);
      summaryHtml = '<div style="background:#1e293b;border-radius:8px;padding:10px 12px;margin-bottom:10px;font-size:12px;">'
        + '<b>Fiabilité globale :</b> ' + pctHigh + '% cohérents sur ' + total + ' thème(s) évalué(s)<br>'
        + '<span style="color:#22c55e;">✓ ' + counts.high + ' cohérents</span> · '
        + '<span style="color:#f59e0b;">~ ' + counts.mid + ' partiels</span> · '
        + '<span style="color:#ef4444;">✗ ' + counts.low + ' incorrects</span>'
        + '</div>';
    }
  }
  container.innerHTML = summaryHtml + list.map(function(entry) {
    var wl = entry.verdict.winner==='M1' ? entry.team1 : entry.verdict.winner==='M7' ? entry.team2 : entry.verdict.winner==='Nul' ? 'Match Nul' : 'Indéterminé';
    var dl = entry.matchDate ? (entry.matchDate + (entry.matchTime ? ' ' + entry.matchTime : '')) : '';
    var eid = entry.id, tab = currentTab;
    var h = '<div class="history-item" onclick="loadEntry(\'' + eid + '\',\'' + tab + '\')">';
    h += '<div class="history-item-top">';
    h += '<span class="history-item-teams">' + escHtml(entry.team1) + ' vs ' + escHtml(entry.team2) + '</span>';
    h += '<span class="history-item-date">' + formatHistoryDate(entry.savedAt) + '</span>';
    h += '</div>';
    if (dl) h += '<div class="history-item-date">Match: ' + dl + '</div>';
    if (entry.competition && COMPETITION_INDEX[entry.competition]) {
      h += '<div class="history-item-date" style="color:#a78bfa;">' + COMPETITION_INDEX[entry.competition].label + '</div>';
    }
    if (entry.interpretation && entry.interpretation.trim()) {
      var apercu = entry.interpretation.trim();
      if (apercu.length > 140) apercu = apercu.slice(0,140) + '…';
      h += '<div style="font-size:12px; font-style:italic; color:#94a3b8; margin-top:4px; white-space:pre-wrap;">📝 ' + escHtml(apercu) + '</div>';
    }
    h += '<div class="history-item-result">';
    h += '<span class="history-item-score">' + entry.verdict.scoreMain + ' (predit)</span>';
    h += '<span>' + escHtml(wl) + '</span>';
    h += '<button class="history-delete-btn" onclick="event.stopPropagation();' + deleteFn + '(\'' + eid + '\')">Supprimer</button>';
    h += '</div>';

    if (tab === 'save') {
      var coh = evalCoherence(entry);
      h += '<div onclick="event.stopPropagation();" style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap;">';
      h += '<input type="text" placeholder="Score reel ex: 2-1" value="' + escHtml(entry.realScore || '') + '" ';
      h += 'style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:5px 8px;color:#e2e8f0;font-size:12px;width:120px;" ';
      h += 'onchange="setRealScore(\'' + eid + '\', this.value)" />';
      h += '<input type="text" placeholder="Mi-temps ex: 1-0" value="' + escHtml(entry.realHtScore || '') + '" ';
      h += 'style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:5px 8px;color:#e2e8f0;font-size:12px;width:120px;" ';
      h += 'onchange="setRealHtScore(\'' + eid + '\', this.value)" />';
      h += '<select onchange="setRealPenalty(\'' + eid + '\', this.value)" '
        + 'style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:5px 8px;color:#e2e8f0;font-size:12px;">'
        + '<option value=""' + (!entry.realPenalty ? ' selected' : '') + '>Rouge/pénalty ?</option>'
        + '<option value="yes"' + (entry.realPenalty === 'yes' ? ' selected' : '') + '>Oui</option>'
        + '<option value="no"' + (entry.realPenalty === 'no' ? ' selected' : '') + '>Non</option>'
        + '</select>';
      h += '<select onchange="setRealIncidentCamp(\'' + eid + '\', this.value)" '
        + 'style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:5px 8px;color:#e2e8f0;font-size:12px;"'
        + (entry.realPenalty === 'no' ? ' disabled' : '') + '>'
        + '<option value=""' + (!entry.realIncidentCamp ? ' selected' : '') + '>Contre qui ?</option>'
        + '<option value="M1"' + (entry.realIncidentCamp === 'M1' ? ' selected' : '') + '>'
        + escHtml(String(entry.team1 || 'M1').slice(0, 10)) + '</option>'
        + '<option value="M7"' + (entry.realIncidentCamp === 'M7' ? ' selected' : '') + '>'
        + escHtml(String(entry.team2 || 'M7').slice(0, 10)) + '</option>'
        + '</select>';
      h += '<select onchange="setRealCsc(\'' + eid + '\', this.value)" '
        + 'style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:5px 8px;color:#e2e8f0;font-size:12px;">'
        + '<option value=""' + (!entry.realCsc ? ' selected' : '') + '>CSC ? (hors incident)</option>'
        + '<option value="M1"' + (entry.realCsc === 'M1' ? ' selected' : '') + '>CSC de '
        + escHtml(String(entry.team1 || 'M1').slice(0, 10)) + '</option>'
        + '<option value="M7"' + (entry.realCsc === 'M7' ? ' selected' : '') + '>CSC de '
        + escHtml(String(entry.team2 || 'M7').slice(0, 10)) + '</option>'
        + '</select>';
      h += '<select onchange="setRealPenaltyCamp(\'' + eid + '\', this.value)" '
        + 'style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:5px 8px;color:#e2e8f0;font-size:12px;"'
        + (entry.realPenalty === 'no' ? ' disabled' : '') + '>'
        + '<option value=""' + (!entry.realPenaltyCamp ? ' selected' : '') + '>Penalty concédé par ?</option>'
        + '<option value="M1"' + (entry.realPenaltyCamp === 'M1' ? ' selected' : '') + '>'
        + escHtml(String(entry.team1 || 'M1').slice(0, 10)) + '</option>'
        + '<option value="M7"' + (entry.realPenaltyCamp === 'M7' ? ' selected' : '') + '>'
        + escHtml(String(entry.team2 || 'M7').slice(0, 10)) + '</option>'
        + '</select>';
      var champCorner = function (cote, val, ph) {
        return '<input type="number" min="0" max="30" step="1" placeholder="' + ph + '" value="' + escHtml(val || '') + '" '
          + 'style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:5px 8px;'
          + 'color:#e2e8f0;font-size:12px;width:92px;" '
          + 'onchange="setRealCornersCamp(\'' + eid + '\', \'' + cote + '\', this.value)" />';
      };
      h += champCorner('A', entry.realCornersM1, 'Corners ' + escHtml((entry.team1 || 'éq.1').slice(0, 7)));
      h += champCorner('B', entry.realCornersM7, 'Corners ' + escHtml((entry.team2 || 'éq.2').slice(0, 7)));
      if (entry.realCorners) {
        var cornPred = null, vcRef = null;
        try {
          var tc = {}; for (var pc = 1; pc <= 16; pc++) tc[pc] = entry.theme[pc] || entry.theme[String(pc)];
          vcRef = getVerdictAfficheReel(tc);
          cornPred = vcRef && vcRef.cornersTotal != null ? vcRef.cornersTotal : null;
        } catch (e) { cornPred = null; }
        if (cornPred != null) {
          var ecartC = Math.abs(cornPred - parseInt(entry.realCorners, 10));
          var cc = ecartC <= 2 ? '#22c55e' : ecartC <= 4 ? '#f59e0b' : '#ef4444';
          h += '<span style="background:' + cc + '22;color:' + cc + ';border:1px solid ' + cc
            + ';border-radius:6px;padding:3px 8px;font-size:11px;font-weight:bold;">corners prédits '
            + cornPred + ' · écart ' + ecartC + '</span>';
          // le dominant, quand les deux côtés sont saisis
          var ra = parseInt(entry.realCornersM1, 10), rb = parseInt(entry.realCornersM7, 10);
          if (!isNaN(ra) && !isNaN(rb) && vcRef && vcRef.cornersDominant) {
            var domReel = ra > rb ? 'M1' : rb > ra ? 'M7' : null;
            var okDom = domReel && domReel === vcRef.cornersDominant;
            var dc = domReel === null ? '#64748b' : okDom ? '#22c55e' : '#ef4444';
            h += '<span style="background:' + dc + '22;color:' + dc + ';border:1px solid ' + dc
              + ';border-radius:6px;padding:3px 8px;font-size:11px;font-weight:bold;">dominant prédit '
              + escHtml(vcRef.cornersDominant === 'M1' ? (entry.team1 || 'éq.1') : (entry.team2 || 'éq.2'))
              + ' · réel ' + escHtml(domReel === null ? 'égalité' : domReel === 'M1' ? (entry.team1 || 'éq.1') : (entry.team2 || 'éq.2'))
              + (domReel === null ? '' : okDom ? ' ✔' : ' ✘') + '</span>';
          }
        }
      }
      if (entry.realScore) {
        var badgeColor = coh.level === 'high' ? '#22c55e' : coh.level === 'mid' ? '#f59e0b' : '#ef4444';
        h += '<span style="background:' + badgeColor + '22;color:' + badgeColor + ';border:1px solid ' + badgeColor + ';border-radius:6px;padding:3px 8px;font-size:11px;font-weight:bold;">' + coh.label + '</span>';
      }
      h += '</div>';
    }

    h += '</div>';
    return h;
  }).join('');
}

/**
 * Evalue la coherence entre le verdict predit et le score reel saisi.
 * Compare : vainqueur predit vs vainqueur reel, et ecart de score.
 */
// Avant : comparait entry.realScore au verdict FIGE au moment de la sauvegarde
// -> ne bougeait jamais quand le moteur changeait. Desormais : delegue a
// replayEntry, qui rejoue vainqueur (verdictFinal) et score (verdictV7) avec
// les regles ET le contexte d'epoque (date/competition/favori) actuels.
// ─── MÉMOÏSATION (28/08/26) ───
// evalCoherence appelle replayEntry, qui rejoue TOUT : verdictFinal,
// getVerdictAfficheReel, campDominant, verdictElementaire et une dizaine
// de signaux. Et il était appelé deux fois par thème noté à chaque rendu
// — une fois pour le bandeau de fiabilité, une fois pour la ligne. Le
// résultat ne dépend que de l'entrée et de son score réel : on le garde.
// Le cache est vidé dès qu'une sauvegarde change (setSavedList).
var _cacheCoherenceV7 = {};
function evalCoherence(entry) {
  if (!entry.realScore) return {level:'none', label:'Non evalue'};
  var cle = (entry.id || '') + '|' + entry.realScore;
  if (_cacheCoherenceV7[cle]) return _cacheCoherenceV7[cle];
  var res = evalCoherenceBrut(entry);
  _cacheCoherenceV7[cle] = res;
  return res;
}
function evalCoherenceBrut(entry) {
  if (!entry.realScore) return {level:'none', label:'Non evalue'};
  var r = replayEntry(entry);
  if (!r) return {level:'none', label:'Score invalide'};
  // On juge le verdict AFFICHÉ (F4P4 en tête), pas verdictFinal : c'est
  // celui que tu as sous les yeux. Le désaccord entre les deux est
  // signalé quand il existe — c'est une information, pas du bruit.
  var winnerMatch = (r.affWinner !== null && r.affWinner !== undefined) ? r.affOk : null;
  var disc = (r.affWinner && r.vfWinner && r.affWinner !== r.vfWinner)
    ? ' · ancien moteur : ' + r.vfWinner : '';
  if (winnerMatch === true && r.scoreOk) return {level:'high', label:'✓ Cohérent (vainqueur + score proche) — prédit '+r.predScore+disc};
  if (winnerMatch === true) return {level:'mid', label:'~ Vainqueur correct, score différent — prédit '+r.predScore+disc};
  if (winnerMatch === false) return {level:'low', label:'✗ Vainqueur incorrect — prédit '+r.predScore+disc};
  return {level:'mid', label:'~ le moteur s abstient — score prédit '+r.predScore+(r.scoreOk?' (proche)':'')};
}

// ─── LE ROUGE/PÉNALTY RÉEL DEVIENT UNE DONNÉE (27/08/26) ───
// Le formulaire « Résultat réel » proposait « Rouge / pénalty réel »
// depuis toujours, mais compareWithReality se contentait de le LIRE dans
// le DOM : il n'était jamais enregistré sur le thème. Le fichier le
// notait lui-même (« aucun match de l'archive n'a encore realPenalty »).
// Résultat : les règles d'incident — celles d'Ellemine_D comprises —
// n'ont jamais été confrontées à un seul résultat.
// Il est désormais stocké sur l'entrée, exactement comme le score, et le
// banc le rejoue.
// Les corners réels — un côté par équipe (28/08/26, Ellemine_D : « il
// faut faire les deux côtés pour chaque équipe, comme ça on saura le
// dominant »). Le total reste stocké dans realCorners, dérivé de la
// somme, pour que les thèmes déjà saisis avec un seul total continuent
// de compter au banc.
function setRealCornersCamp(id, cote, value) {
  var list = getSavedList();
  var entry = list.filter(function (e) { return e.id === id; })[0];
  if (!entry) return;
  var v = String(value == null ? '' : value).trim();
  var ok = /^\d{1,2}$/.test(v) ? v : '';
  if (cote === 'A') entry.realCornersM1 = ok; else entry.realCornersM7 = ok;
  var a = entry.realCornersM1, b = entry.realCornersM7;
  if (/^\d{1,2}$/.test(String(a || '')) && /^\d{1,2}$/.test(String(b || ''))) {
    entry.realCorners = String(parseInt(a, 10) + parseInt(b, 10));
  } else if (!a && !b) {
    entry.realCorners = '';
  }
  setSavedList(list);
  setTimeout(renderCurrentList, 0);
}

// Conservée : un total saisi seul reste valable pour la ligne « total »
// du banc, il ne dit simplement rien du dominant.


// Le CAMP qui encaisse le rouge ou le penalty (28/08/26). Le champ
// « Rouge/pénalty » ne stockait qu'un oui/non : la famille « Incident —
// qui encaisse » du banc n'avait donc aucune donnée à part le cas
// Bologna, écrit à la main. Sans ce champ, la piste du siège qui
// engendre Mars ne pouvait jamais être jugée.
function setRealIncidentCamp(id, value) {
  var list = getSavedList();
  var entry = list.filter(function (e) { return e.id === id; })[0];
  if (!entry) return;
  entry.realIncidentCamp = (value === 'M1' || value === 'M7') ? value : '';
  // Un camp désigné implique qu'il y a eu incident : on aligne le oui/non
  // plutôt que de laisser les deux champs se contredire.
  if (entry.realIncidentCamp && entry.realPenalty !== 'yes') entry.realPenalty = 'yes';
  setSavedList(list);
  setTimeout(renderCurrentList, 0);
}

// Le camp qui CONCÈDE le penalty (28/08/26). Séparé du camp du rouge
// depuis le match du 27/08 : rouge côté R1 ET penalty pour R1, donc
// concédé par R7 — deux incidents, deux camps opposés dans le même
// match. Une seule case « contre qui » ne pouvait pas l'écrire, et le
// banc aurait compté une des deux lectures comme fausse à tort.
// ─── LE SCORE DE MI-TEMPS DEVIENT UNE DONNÉE (28/08/26, demande
//     d'Ellemine_D : « on doit étudier but dans les deux mi-temps ») ───
// Le fichier a un panneau « But par mi-temps », un signal htWinner et une
// répartition des corners par mi-temps — et AUCUN moyen d'enregistrer ce
// qui s'est réellement passé à la pause. Zéro cas sur vingt. Aucune de
// ces lectures n'a donc jamais été confrontée à un résultat.
// Le champ est là maintenant : « Mi-temps ex: 1-0 », au même format que
// le score final, et le banc le rejoue.
function setRealHtScore(id, value) {
  var list = getSavedList();
  var entry = list.filter(function (e) { return e.id === id; })[0];
  if (!entry) return;
  var v = String(value || '').trim();
  entry.realHtScore = /^\d{1,2}\s*-\s*\d{1,2}$/.test(v) ? v.replace(/\s+/g, '') : '';
  setSavedList(list);
  setTimeout(renderCurrentList, 0);
}

// ─── LE CSC, ENREGISTRÉ À PART (28/08/26, doctrine d'Ellemine_D :
//     « le CSC n'est pas un incident, sépare-le ») ───
// La valeur est le camp qui l'a CONCÉDÉ (celui dont un joueur marque
// contre son camp), ou vide s'il n'y en a pas eu. Aucun moteur ne prétend
// aujourd'hui prédire un CSC : le champ sert à collecter, pas à noter —
// tant qu'une doctrine ne dira pas ce qui l'annonce, il n'y aura pas de
// famille de banc pour lui.
function setRealCsc(id, value) {
  var list = getSavedList();
  var entry = list.filter(function (e) { return e.id === id; })[0];
  if (!entry) return;
  entry.realCsc = (value === 'M1' || value === 'M7') ? value : '';
  setSavedList(list);
  setTimeout(renderCurrentList, 0);
}

function setRealPenaltyCamp(id, value) {
  var list = getSavedList();
  var entry = list.filter(function (e) { return e.id === id; })[0];
  if (!entry) return;
  entry.realPenaltyCamp = (value === 'M1' || value === 'M7') ? value : '';
  if (entry.realPenaltyCamp && entry.realPenalty !== 'yes') entry.realPenalty = 'yes';
  setSavedList(list);
  setTimeout(renderCurrentList, 0);
}

function setRealPenalty(id, value) {
  var list = getSavedList();
  var entry = list.filter(function (e) { return e.id === id; })[0];
  if (!entry) return;
  entry.realPenalty = (value === 'yes' || value === 'no') ? value : '';
  setSavedList(list);
  setTimeout(renderCurrentList, 0);
}

function setRealScore(id, value) {
  var list = getSavedList();
  var entry = list.filter(function(e){ return e.id === id; })[0];
  if (!entry) return;
  entry.realScore = value.trim();
  setSavedList(list);
  setTimeout(renderCurrentList, 0);
}

function loadEntry(id, tab) {
  var list = tab==='hist' ? getHistoryList() : getSavedList();
  var entry = list.filter(function(e){return e.id===id;})[0];
  if (!entry) return;
  var t = {};
  for (var p=1;p<=16;p++) t[p]=entry.theme[p]||entry.theme[String(p)];
  currentTheme = t;
  // CORRECTIF (04/08/26) : themeVariants n'était recalculé que dans
  // launchTheme(), donc charger un thème sauvegardé/historique laissait
  // les boutons Principal/Superposition/Phase pointer vers l'ancien
  // tirage (ou vides si aucun thème n'avait encore été lancé). On
  // recalcule les 3 variantes ici aussi, à partir du thème chargé.
  themeVariants.principal = currentTheme;
  var _derivesLoad = calculerThemesDerives(currentTheme);
  themeVariants.superposition = _derivesLoad.superposition;
  themeVariants.phase = _derivesLoad.phase;
  themeVariantActif = 'principal';
  ['principal', 'superposition', 'phase'].forEach(function (v) {
    var btn = document.getElementById('variant-btn-' + v);
    if (btn) { btn.classList.toggle('btn-primary', v === 'principal'); btn.classList.toggle('btn-secondary', v !== 'principal'); }
  });
  if (document.getElementById('team1')) document.getElementById('team1').value = entry.team1;
  if (document.getElementById('team2')) document.getElementById('team2').value = entry.team2;
  if (document.getElementById('matchDate')&&entry.matchDate) document.getElementById('matchDate').value = entry.matchDate;
  if (document.getElementById('matchTime')&&entry.matchTime) document.getElementById('matchTime').value = entry.matchTime;
  if (entry.competition && COMPETITION_INDEX[entry.competition]) {
    var regSel = document.getElementById('competitionRegion');
    if (regSel) { regSel.value = COMPETITION_INDEX[entry.competition].region; updateCompetitionList(); }
    var compSel2 = document.getElementById('competitionMode');
    if (compSel2) compSel2.value = entry.competition;
  }
  var interpTa = document.getElementById('interpretationText');
  if (interpTa) interpTa.value = entry.interpretation || '';
  var rpEl = document.getElementById('realPenalty');
  if (rpEl) rpEl.value = entry.realPenalty || '';
  var rfgEl = document.getElementById('realFirstGoal');
  if (rfgEl) rfgEl.value = entry.realFirstGoal || '';
  var rwEl = document.getElementById('realWinner');
  if (rwEl && entry.realScore) {
    var mm = String(entry.realScore).match(/(\d+)\s*-\s*(\d+)/);
    if (mm) { var g1x=parseInt(mm[1],10), g7x=parseInt(mm[2],10); rwEl.value = g1x>g7x?'M1':g7x>g1x?'M7':'Nul'; }
  }
  var rsEl = document.getElementById('realScore');
  if (rsEl && entry.realScore) rsEl.value = entry.realScore;
  closeHistoryPanel();
  renderTheme();
}

function deleteHistEntry(id) {
  setHistoryList(getHistoryList().filter(function(e){return e.id!==id;}));
  renderCurrentList();
}
function deleteSaveEntry(id) {
  setSavedList(getSavedList().filter(function(e){return e.id!==id;}));
  renderCurrentList();
}

// Ajuste dynamiquement l'échelle de la pyramide pour qu'elle tienne dans l'écran disponible
var themeHouseSize = 64; // taille de base des maisons en px
var showResultants = false; // affiche la resultante (figure x maison) au lieu de la figure de base

function toggleResultants() {
  showResultants = !showResultants;
  var btn = document.getElementById('toggleResultantsBtn');
  if (btn) btn.textContent = showResultants ? '🔄 Afficher figures de base' : '🔄 Afficher résultantes';
  if (currentTheme) adjustThemeScale();
}

function adjustThemeScale() {
  if (!currentTheme) return;
  var wrapper = document.querySelector('.theme-layout-wrapper');
  var layout = document.getElementById('theme-grid');
  if (!wrapper || !layout) return;
  var W = Math.max(wrapper.offsetWidth, window.innerWidth || 360);
  // Taille auto : 8 maisons sur la ligne du haut, on divise la largeur par 8
  var autoSize = Math.floor(W / 8);
  var hSize = Math.max(30, Math.min(120, themeHouseSize > 0 ? themeHouseSize : autoSize));
  renderThemeWithSize(hSize);
}

function zoomTheme(delta) {
  if (themeHouseSize <= 0) {
    var wrapper = document.querySelector('.theme-layout-wrapper');
    var W = wrapper ? wrapper.clientWidth : 360;
    themeHouseSize = Math.floor(W / 8);
  }
  themeHouseSize = Math.max(30, Math.min(120, themeHouseSize + Math.round(delta * 80)));
  adjustThemeScale();
}

function getAxisThemeFromBase(baseTheme, axisKey){
  const axes={meres:[1,2,3,4],angulaire:[1,4,7,10],succedent:[2,5,8,11],cadent:[3,6,9,12]};
  const h=axes[axisKey]||axes.meres;
  return buildThemeFromMothers(baseTheme[h[0]],baseTheme[h[1]],baseTheme[h[2]],baseTheme[h[3]]);
}
var axisDisplayThemeKey='principal';
var axisDisplayTheme=null;
// Le thème principal mémorisé : c'est toujours LUI qui sert de base aux
// axes, sinon basculer d'un axe à l'autre dériverait en cascade.
var axisThemeBase=null;
// Neutralise l'écriture dans l'archive pendant un simple changement de
// thème actif : renderTheme() appelle addToHistory(), et sans ce garde-fou
// chaque clic sur un axe créerait une entrée d'historique.
var axisSansArchive=false;

// currentTheme EST désormais le thème affiché : basculer sur un axe le
// remplace pour de bon, donc plus aucune couche ne peut lire autre chose
// que ce qui est à l'écran.
function getDisplayTheme(){ return currentTheme; }

function majBoutonsAxe(){
  document.querySelectorAll('.axis-theme-btn').forEach(function(b){b.classList.toggle('active',b.dataset.axis===axisDisplayThemeKey);});
  var label=document.getElementById('axis-theme-current');
  if(label){
    var labels={principal:'Thème principal',meres:'Thème des 4 Mères',angulaire:'Thème Axe angulaire',succedent:'Thème Axe succédent',cadent:'Thème Axe cadent'};
    label.textContent=labels[axisDisplayThemeKey]||'Thème principal';
  }
}

// ─── CORRECTION ELLEMINE (25/08/26) ───
// « quand on clique sur un axe le thème ne respecte pas l'ordre des figures
// de repos ce qui donne des mauvaises résultantes »
// Avant, ce sélecteur ne changeait QUE la grille : currentTheme restait le
// thème principal. On voyait donc la figure de l'axe dans la case, mais
// tout ce qui réagissait — le clic sur une maison, les flèches de relation,
// les sommes de maisons, le verdict, tous les panneaux — répondait encore
// sur la figure du thème principal. D'où des résultantes qui ne
// correspondaient pas à ce qui était affiché.
// Désormais le basculement remplace currentTheme et relance renderTheme :
// le fichier entier recalcule sur le thème de l'axe, ce qui répond aussi à
// la demande précédente (« si le thème change le verdict suit la logique du
// thème »). « Principal » restaure le thème d'origine.
function setAxisDisplayTheme(key){
  var nouveau = key || 'principal';
  if(currentTheme && (axisDisplayThemeKey==='principal' || !axisThemeBase)) axisThemeBase = currentTheme;
  axisDisplayThemeKey = nouveau;
  if(axisThemeBase){
    currentTheme = (nouveau==='principal') ? axisThemeBase : getAxisThemeFromBase(axisThemeBase, nouveau);
  }
  axisDisplayTheme = currentTheme;
  majBoutonsAxe();
  if(currentTheme){
    axisSansArchive = true;
    try { renderTheme(); } catch(e){ console.log('bascule axe', e); }
    finally { axisSansArchive = false; }
  }
}
function initAxisThemeControls(theme){
  var host=document.getElementById('axis-theme-controls');
  if(!host) return;
  host.innerHTML='<div class="axis-theme-buttons">'+
    '<button type="button" class="axis-theme-btn" data-axis="principal">Principal</button>'+
    '<button type="button" class="axis-theme-btn" data-axis="meres">4 Mères</button>'+
    '<button type="button" class="axis-theme-btn" data-axis="angulaire">Axe angulaire</button>'+
    '<button type="button" class="axis-theme-btn" data-axis="succedent">Axe succédent</button>'+
    '<button type="button" class="axis-theme-btn" data-axis="cadent">Axe cadent</button>'+
    '</div><div id="axis-theme-current" class="axis-theme-current"></div>';
  host.querySelectorAll('.axis-theme-btn').forEach(function(btn){btn.addEventListener('click',function(){setAxisDisplayTheme(btn.dataset.axis);});});
  // Peinture seule : initAxisThemeControls est appelée DEPUIS renderTheme,
  // rappeler setAxisDisplayTheme ici provoquerait une récursion infinie.
  majBoutonsAxe();
}

function renderThemeWithSize(hSize) {
  if (!currentTheme) return;
  var displayTheme = getDisplayTheme() || currentTheme;
  var layout = document.getElementById('theme-grid');
  var wrapper = document.querySelector('.theme-layout-wrapper');
  if (!layout || !wrapper) return;

  // Largeur disponible
  var W = Math.max(wrapper.offsetWidth || 0, window.innerWidth || 360);
  // Gap fixe entre maisons
  var gap = 18;         // espace horizontal entre maisons (élargi pour éviter le débordement)
  var rowGap = 28;      // espace vertical entre rangées
  var padTop = 20;      // padding haut
  // 8 maisons + 7 gaps sur la première ligne
  var cellW = Math.floor((W - gap * 7) / 8);
  if (hSize > 0) cellW = Math.min(hSize, cellW);
  cellW = Math.max(30, cellW);
  var cellH = Math.round(cellW * 1.1);
  var step = cellW + gap;
  var rowH = cellH + rowGap;

  // Largeur totale réelle des 8 maisons + 7 gaps
  var totalW = 8 * cellW + 7 * gap;
  // Offset pour centrer dans W
  var offsetX = Math.max(0, Math.round((W - totalW) / 2));

  // Positions : col en multiples de 1 (ou 0.5 pour les décalages pyramidaux)
  // Gap large entre M5 (col3) et M4 (col4) : on décale M4..M1 d'une demi-cellule
  // en ajoutant campGap au step pour les colonnes >= 4
  var campGap = Math.round(cellW * 0.6); // espace supplémentaire entre camps

  function colX(col) {
    // Pour les demi-colonnes (0.5, 2.5...) on centre entre les deux parents
    var intPart = Math.floor(col);
    var frac = col - intPart;
    if (frac === 0.5) {
      // Centre entre col intPart et col intPart+1
      var left  = intPart >= 4 ? Math.round(intPart * step) + campGap : Math.round(intPart * step);
      var right = (intPart+1) >= 4 ? Math.round((intPart+1) * step) + campGap : Math.round((intPart+1) * step);
      return Math.round((left + right) / 2);
    }
    var base = Math.round(col * step);
    return col >= 4 ? base + campGap : base;
  }

  // Ligne 2 : chaque maison centrée sous ses deux parents
  // M12 sous M8(col0)+M7(col1) → x = (colX(0)+colX(1))/2
  // M11 sous M6(col2)+M5(col3) → x = (colX(2)+colX(3))/2
  // M10 sous M4(col4)+M3(col5) → x = (colX(4)+colX(5))/2
  // M9  sous M2(col6)+M1(col7) → x = (colX(6)+colX(7))/2

  var positions = {
    8:{col:0,row:0}, 7:{col:1,row:0}, 6:{col:2,row:0}, 5:{col:3,row:0},
    4:{col:4,row:0}, 3:{col:5,row:0}, 2:{col:6,row:0}, 1:{col:7,row:0},
    12:{col:0.5,row:1.5}, 11:{col:2.5,row:1.5}, 10:{col:4.5,row:1.5}, 9:{col:6.5,row:1.5},
    14:{col:1.5,row:3},   13:{col:5.5,row:3},
    15:{col:3.5,row:4.5}, 16:{col:5.5,row:5.0}
  };

  var totalH = padTop + Math.round(5.0 * rowH) + cellH + 10;
  wrapper.style.height = totalH + 'px';
  layout.style.height = totalH + 'px';

  var fontSize = Math.max(7, Math.round(cellW * 0.14));
  var dotR = Math.max(3, Math.round(cellW * 0.1));
  var dotGap = Math.max(2, Math.round(dotR * 0.8));

  // Couleur élément figure — terre = gris
  var ELEM_DOT_COLOR = {feu:'#ef4444', air:'#eab308', eau:'#3b82f6', terre:'#9ca3af'};
  var MAISON_BORDER_COLOR = {feu:'#ef4444', air:'#eab308', eau:'#3b82f6', terre:'#4b5563'};

  housePixelPos = {};
  var battW = Math.max(3, Math.round(cellW*0.09));
  var battH = Math.max(16, Math.round(cellH*0.6));
  computeThemeEnergyRange(displayTheme);

  layout.innerHTML = Object.keys(positions).map(function(k) {
    var pos = Number(k);
    var pc = positions[k];
    var x = offsetX + colX(pc.col);
    var y = padTop + Math.round(pc.row * rowH);
    housePixelPos[pos] = {x:x, y:y, w:cellW, h:cellH, row:pc.row};
    var figBase = displayTheme[pos];
    var fig = showResultants ? getResultant(figBase, pos) : figBase;
    var elemFig = ELEMENTS_V7[fig];
    var figColor = ELEM_DOT_COLOR[elemFig] || '#94a3b8';
    var maisonColor = MAISON_BORDER_COLOR[MAISON_ELEM_V7[pos]] || '#334155';
    var rotationNumber = getRotationNumber(pos, displayTheme[1]);
    var concPct = concordanceFigureMaisonV7(fig, pos).force;
    var rotDot = (rotationNumber===1||rotationNumber===7) ? '<div class="rotation-dot"></div>' : '';
    var num = showHouseLabels
      ? '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;font-size:'+fontSize+'px;white-space:nowrap;overflow:hidden;"><b>M'+pos+(showResultants?'<span style="color:#f59e0b;">·R</span>':'')+'</b><span class="muted">R'+rotationNumber+'</span></div>'
      : '';
    var dotHtml = MAP_GEO[fig].map(function(v) {
      var dot = '<span style="width:'+dotR*2+'px;height:'+dotR*2+'px;border-radius:50%;background:'+figColor+';display:inline-block;flex-shrink:0;"></span>';
      var m = 'margin:'+Math.max(1,Math.round(dotR*0.5))+'px 0;';
      if (v === 2) return '<div style="display:flex;justify-content:center;gap:'+dotGap+'px;'+m+'">'+dot+dot+'</div>';
      return '<div style="display:flex;justify-content:center;'+m+'">'+dot+'</div>';
    }).join('');
    // BATTERIE D'ÉNERGIE (17/07/26, demande utilisateur "juste à gauche à
    // côté du figure") : même formule que forceRelationnelleFigure pour CE
    // siège précis (forceMaisonV7 + bonus construction/destruction/double
    // concordance), affichée en jauge verticale accolée à gauche des points
    // — pas de disposition des maisons touchée, seulement le contenu
    // interne de chaque case.
    var energyVal = energyAtHouse(fig, pos);
    var battHtml = batteryHtmlCompact(energyVal, battW, battH);
    // R1/R7 CLIGNOTANT (04/08/26, demande Ellemine_D "R1 et R7 ne
    // clignotent pas dans le thème") — remplace la classe .highlight
    // générique (identique pour R1 et R7) par deux classes distinctes
    // avec clignotement, cohérent avec le bleu/orange déjà utilisé dans
    // la matrice 16×16 pour les mêmes rôles.
    var hlClass = rotationNumber===1 ? ' highlight-r1' : (rotationNumber===7 ? ' highlight-r7' : '');
    // RÈGLE ELLEMINE (21/08/26) : figure logée dans SA PROPRE maison de
    // repos (figBase === FIGS_V7[pos-1]) — toujours calculé sur la
    // figure de base, jamais sur la résultante affichée (showResultants),
    // le "repos" est une propriété du thème initial, pas de la lecture.
    var enRepos = figBase === FIGS_V7[pos-1];
    var reposClass = enRepos ? ' house-repos' : '';
    var reposMark = enRepos ? '<div class="repos-mark" title="'+FL[figBase]+' est dans sa maison de repos (M'+pos+')">🟣</div>' : '';
    return '<div class="house'+hlClass+reposClass+'" data-pos="'+pos+'" onclick="showHouseResult('+pos+')"'
      +' style="left:'+x+'px;top:'+y+'px;width:'+cellW+'px;min-height:'+cellH+'px;'
      +'border-top:3px solid '+figColor+';border-bottom:3px solid '+maisonColor+';padding:3px;box-sizing:border-box;">'
      +reposMark+rotDot+num+'<div style="display:flex;align-items:center;justify-content:center;gap:'+Math.max(2,Math.round(cellW*0.05))+'px;">'+battHtml+'<div style="display:flex;flex-direction:column;">'+dotHtml+'</div></div></div>';
  }).join('');

  drawThemeLines(selectedHouse);
}
// CORRIGÉ (17/07/26, demande utilisateur "colore R1 et R7, enlève celui
// M1 et M7") : le surlignage (bordure/fond bleu) de la grille suivait le
// mode fixe (M1/M7 en dur) — remplacé par la rotation (R1/R7, déjà
// utilisée pour le petit point bleu rotDot juste à côté), cohérent avec
// le reste de l'app qui n'affiche plus que le verdict rotation.

// ÉNERGIE D'UNE FIGURE (17/07/26, demande explicite utilisateur : "varie
// selon la position de la figure, selon la position du binôme de la
// figure, selon le nombre de figure comme binôme dans le thème, selon
// antagoniste direct de la figure le nombre et aussi sa santé détermine
// force attaque et selon binôme du antagoniste") — reprend EXACTEMENT
// chaineDualite(fig, theme).forceMaisons, déjà la brique de calcul
// utilisée par le verdict (ancrage, max des 4 forces) : somme la force
// relationnelle (position + nombre d'occurrences base/résultante, via
// forceRelationnelleFigure/trouverFigV7) du chef LUI-MÊME, de son ancre
// (binôme), de son assaillant (antagoniste direct), du binôme de
// l'assaillant, du libérateur et de son binôme, de la victime et de son
// binôme, plus la contribution signée obstacle/attaquant (Constat 11).
// "Sa santé détermine force d'attaque" = cd.libere (menacé mais pas
// libéré → pénalité, cf. chaineDualite) : appliqué comme facteur -15%.
// Normalisé par thème (min/max des 16 sièges) plutôt que sur une plage
// fixe, pour rester lisible quelle que soit l'amplitude du thème.
var themeEnergyMin = 0, themeEnergyMax = 1;
function rawEnergyOf(fig, theme) {
  var cd = chaineDualite(fig, theme);
  var v = cd.forceMaisons;
  if (!cd.libere) v = Math.round(v * 0.85);
  return v;
}
function computeThemeEnergyRange(theme) {
  var vals = [];
  for (var p = 1; p <= 16; p++) vals.push(rawEnergyOf(theme[p], theme));
  themeEnergyMin = Math.min.apply(null, vals);
  themeEnergyMax = Math.max.apply(null, vals);
  if (themeEnergyMax === themeEnergyMin) themeEnergyMax = themeEnergyMin + 1;
}
function energyAtHouse(fig, pos) {
  return rawEnergyOf(fig, currentTheme);
}
function energyColorV7(v) {
  var pct = (v - themeEnergyMin) / (themeEnergyMax - themeEnergyMin);
  return pct < 0.35 ? '#f87171' : pct < 0.7 ? '#fbbf24' : '#4ade80';
}
function batteryHtmlCompact(value, w, h) {
  var pct = Math.max(0, Math.min(1, (value - themeEnergyMin) / (themeEnergyMax - themeEnergyMin)));
  var fillH = Math.round(pct * h);
  return '<div title="Énergie: '+value+'" style="flex-shrink:0;width:'+w+'px;height:'+h+'px;background:#1e293b;border:1px solid #334155;border-radius:1px;position:relative;overflow:hidden;">'
    +'<div style="position:absolute;bottom:0;left:0;right:0;height:'+fillH+'px;background:'+energyColorV7(value)+';"></div></div>';
}
// Liaisons binôme (vert) / antagoniste (rouge) (17/07/26, demande
// utilisateur, même principe que le bouclier géomantique) : au clic sur
// une maison, trace des courbes vers toutes celles dont la figure (base
// OU résultante, même critère que showRelationArrows) est le binôme ou
// l'antagoniste de la maison cliquée. Les courbes utilisent les
// coordonnées EXACTES déjà calculées pour chaque maison (housePixelPos),
// avec un point de contrôle décalé perpendiculairement au segment plutôt
// qu'au travers d'une maison intermédiaire.
// ROUTAGE "CIRCUIT IMPRIMÉ" (17/07/26, demande explicite utilisateur,
// schéma fourni : "pas de passer au-dessus ni au-dessous des maisons...
// comme un circuit et les lignes ne doivent pas se superposer") —
// remplace les courbes par un tracé à angles droits STRICT (comme des
// pistes de circuit) : chaque liaison sort d'une maison par un segment
// VERTICAL, emprunte un "couloir" horizontal dans l'espace VIDE entre
// deux rangs, et entre dans la maison cible par un autre segment
// vertical. Quand PLUSIEURS liaisons empruntent le même couloir, chacune
// reçoit sa propre "voie" (léger décalage vertical constant), comme des
// pistes parallèles sur un circuit — jamais superposées.
function drawThemeLines(pos) {
  var svg = document.getElementById('theme-lines');
  if (!svg) return;
  svg.innerHTML = '';
  if (!pos || !currentTheme || !housePixelPos[pos]) return;
  var fig = currentTheme[pos];
  var binFig = BINOMES_V7[fig], antFig = ANTAGONISTES_V7[fig];
  function findAll(targetFig) {
    var res = [];
    for (var p = 1; p <= 16; p++) {
      if (p === pos) continue;
      if (currentTheme[p] === targetFig) res.push(p);
      else if (combine(currentTheme[p], FIGS[p-1]) === targetFig) res.push(p);
    }
    return res;
  }
  var rowHouses = {}, rowBand = {};
  Object.keys(housePixelPos).forEach(function(p) {
    var hp = housePixelPos[p];
    if (!rowHouses[hp.row]) { rowHouses[hp.row] = []; rowBand[hp.row] = {yTop:hp.y, yBottom:hp.y+hp.h}; }
    rowHouses[hp.row].push({x:hp.x, w:hp.w});
    rowBand[hp.row].yTop = Math.min(rowBand[hp.row].yTop, hp.y);
    rowBand[hp.row].yBottom = Math.max(rowBand[hp.row].yBottom, hp.y+hp.h);
  });
  var sortedRows = Object.keys(rowHouses).map(Number).sort(function(a,b){return a-b;});
  function findSafeX(desiredX, houses) {
    var pad = 6;
    var hit = null;
    for (var i=0;i<houses.length;i++) {
      var h = houses[i];
      if (desiredX >= h.x-pad && desiredX <= h.x+h.w+pad) { hit = h; break; }
    }
    if (!hit) return desiredX;
    var leftX = hit.x - pad, rightX = hit.x + hit.w + pad;
    return Math.abs(desiredX-leftX) <= Math.abs(desiredX-rightX) ? leftX : rightX;
  }
  // Un "couloir" = l'espace vide entre deux rangs consécutifs (ou
  // au-dessus/en dessous de la première/dernière rangée pour les liaisons
  // au sein d'un même rang). Chaque couloir a ses propres voies (lanes) —
  // compteur partagé par TOUTES les liaisons tracées dans cet appel, pour
  // qu'aucune ne se superpose à une autre dans le même couloir.
  var LANE_STEP = 5;
  var laneUsage = {};
  function gutterKey(rA, rB) { return rA+'|'+rB; }
  function nextLaneY(key, baseY) {
    var n = laneUsage[key] || 0;
    laneUsage[key] = n + 1;
    var mag = Math.ceil(n/2) * LANE_STEP;
    return baseY + (n % 2 === 0 ? -mag : mag);
  }
  function gutterMidY(rA, rB) { return (rowBand[rA].yBottom + rowBand[rB].yTop) / 2; }

  // CORRIGÉ (17/07/26, demande utilisateur : "ne les fais pas sortir du
  // maison du même côté pour éviter la confusion ou la fusion de deux
  // lignes") — quand une même maison est reliée à la fois par le binôme
  // (vert) ET l'antagoniste (rouge) — possible si sa base est l'un et sa
  // résultante l'autre — les deux traits sortaient du même point central,
  // se touchant/se confondant au bord de la maison. Chaque couleur a
  // maintenant son propre point d'ancrage fixe (vert vers la gauche du
  // bord, rouge vers la droite), jamais le même pixel.
  function edgeX(house, color) {
    var frac = color === '#22c55e' ? 0.32 : 0.68;
    return house.x + house.w * frac;
  }
  function addLine(targetPos, color) {
    var a = housePixelPos[pos], b = housePixelPos[targetPos];
    if (!a || !b) return;
    var sameRow = Math.abs(a.row - b.row) < 0.01;
    var pts;
    if (sameRow) {
      var ax = edgeX(a, color), bx = edgeX(b, color);
      var rowIdx = sortedRows.indexOf(a.row);
      var belowRow = rowIdx < sortedRows.length-1 ? sortedRows[rowIdx+1] : null;
      var aboveRow = rowIdx > 0 ? sortedRows[rowIdx-1] : null;
      var key, baseY, exitY, enterY;
      if (belowRow != null) {
        key = gutterKey(a.row, belowRow); baseY = gutterMidY(a.row, belowRow);
        exitY = a.y + a.h; enterY = b.y + b.h;
      } else if (aboveRow != null) {
        key = gutterKey(aboveRow, a.row); baseY = gutterMidY(aboveRow, a.row);
        exitY = a.y; enterY = b.y;
      } else {
        key = 'top-fallback'; baseY = Math.min(a.y,b.y) - 20; exitY = a.y; enterY = b.y;
      }
      var busY = nextLaneY(key, baseY);
      pts = [{x:ax,y:exitY}, {x:ax,y:busY}, {x:bx,y:busY}, {x:bx,y:enterY}];
    } else {
      var srcFirst = a.row < b.row;
      var src = srcFirst ? a : b, dst = srcFirst ? b : a;
      var sx = edgeX(src, color), sy = src.y+src.h;
      var tx = edgeX(dst, color), ty = dst.y;
      var rowsBetween = sortedRows.filter(function(r){ return r > src.row && r < dst.row; });
      var chain = [src.row].concat(rowsBetween).concat([dst.row]);
      pts = [{x:sx, y:sy}];
      var curX = sx;
      for (var i=0;i<chain.length-1;i++) {
        var rA = chain[i], rB = chain[i+1];
        var isLast = (i === chain.length-2);
        var laneY = nextLaneY(gutterKey(rA,rB), gutterMidY(rA,rB));
        var exitX = isLast ? tx : findSafeX(curX, rowHouses[rB]);
        pts.push({x:curX, y:laneY});
        pts.push({x:exitX, y:laneY});
        curX = exitX;
      }
      pts.push({x:tx, y:ty});
    }
    var d = 'M '+pts[0].x+' '+pts[0].y;
    for (var i=1;i<pts.length;i++) d += ' L '+pts[i].x+' '+pts[i].y;
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', color);
    p.setAttribute('stroke-width', '2');
    p.setAttribute('opacity', '0.9');
    p.setAttribute('stroke-linecap', 'square');
    p.setAttribute('stroke-linejoin', 'miter');
    svg.appendChild(p);
  }
  findAll(binFig).forEach(function(p) { addLine(p, '#22c55e'); });
  findAll(antFig).forEach(function(p) { addLine(p, '#ef4444'); });
}

// ═══════════════════════════════════════════════════════════════
// MINI-PYRAMIDE STATIQUE (07/07/26) — rend un thème (16 maisons) sous
// forme de grille de points façon thème principal, mais en HTML fixe
// non-interactif (pas de zoom, pas de clic maison), pour les panneaux
// secondaires comme le thème de vérification.
// ═══════════════════════════════════════════════════════════════
function renderMiniTheme(theme, containerId, cellW) {
  var container = document.getElementById(containerId);
  if (!container) return;
  cellW = cellW || 46;
  var cellH = Math.round(cellW * 1.1);
  var gap = 14, rowGap = 20, padTop = 10;
  var campGap = Math.round(cellW * 0.5);
  var step = cellW + gap;

  function colX(col) {
    var intPart = Math.floor(col);
    var frac = col - intPart;
    if (frac === 0.5) {
      var left = intPart >= 4 ? Math.round(intPart * step) + campGap : Math.round(intPart * step);
      var right = (intPart + 1) >= 4 ? Math.round((intPart + 1) * step) + campGap : Math.round((intPart + 1) * step);
      return Math.round((left + right) / 2);
    }
    var base = Math.round(col * step);
    return col >= 4 ? base + campGap : base;
  }

  var positions = {
    8:{col:0,row:0}, 7:{col:1,row:0}, 6:{col:2,row:0}, 5:{col:3,row:0},
    4:{col:4,row:0}, 3:{col:5,row:0}, 2:{col:6,row:0}, 1:{col:7,row:0},
    12:{col:0.5,row:1.5}, 11:{col:2.5,row:1.5}, 10:{col:4.5,row:1.5}, 9:{col:6.5,row:1.5},
    14:{col:1.5,row:3}, 13:{col:5.5,row:3},
    15:{col:3.5,row:4.5}, 16:{col:5.5,row:5.0}
  };
  var rowH = cellH + rowGap;
  var totalW = 8 * cellW + 7 * gap + campGap + cellW;
  var totalH = padTop + Math.round(5.0 * rowH) + cellH + 10;
  var dotR = Math.max(3, Math.round(cellW * 0.11));
  var dotGap = Math.max(2, Math.round(dotR * 0.8));
  var fontSize = Math.max(7, Math.round(cellW * 0.16));
  var ELEM_DOT_COLOR = {feu:'#ef4444', air:'#eab308', eau:'#3b82f6', terre:'#9ca3af'};
  var MAISON_BORDER_COLOR = {feu:'#ef4444', air:'#eab308', eau:'#3b82f6', terre:'#4b5563'};

  var html = Object.keys(positions).map(function(k) {
    var pos = Number(k);
    var pc = positions[k];
    var x = colX(pc.col);
    var y = padTop + Math.round(pc.row * rowH);
    var fig = theme[pos];
    var elemFig = ELEMENTS_V7[fig];
    var figColor = ELEM_DOT_COLOR[elemFig] || '#94a3b8';
    var maisonColor = MAISON_BORDER_COLOR[MAISON_ELEM_V7[pos]] || '#334155';
    var num = '<div style="font-size:' + fontSize + 'px;text-align:center;margin-bottom:2px;opacity:.8;color:#e2e8f0;"><b>M' + pos + '</b></div>';
    var dotHtml = MAP_GEO[fig].map(function(v) {
      var dot = '<span style="width:' + dotR*2 + 'px;height:' + dotR*2 + 'px;border-radius:50%;background:' + figColor + ';display:inline-block;flex-shrink:0;"></span>';
      var m = 'margin:' + Math.max(1, Math.round(dotR*0.5)) + 'px 0;';
      if (v === 2) return '<div style="display:flex;justify-content:center;gap:' + dotGap + 'px;' + m + '">' + dot + dot + '</div>';
      return '<div style="display:flex;justify-content:center;' + m + '">' + dot + '</div>';
    }).join('');
    return '<div style="position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + cellW + 'px;min-height:' + cellH + 'px;'
      + 'border-top:3px solid ' + figColor + ';border-bottom:3px solid ' + maisonColor + ';padding:3px;box-sizing:border-box;'
      + 'background:rgba(30,41,59,.6);border-radius:4px;">' + num + dotHtml + '</div>';
  }).join('');

  container.style.position = 'relative';
  container.style.width = totalW + 'px';
  container.style.height = totalH + 'px';
  container.innerHTML = html;
}

function clearHouseRelationColors() {

  for (var p = 1; p <= 16; p++) {
    var el = document.querySelector('.house[data-pos="' + p + '"]');
    if (el) {
      el.classList.remove('house-binome', 'house-antagoniste', 'house-selected',
                          'house-front', 'house-protecteur');
      var _pm = el.querySelector('.pole-mark');
      if (_pm) _pm.remove();
      el.style.boxShadow = '';
    }
  }
  var svg = document.getElementById('theme-lines');
  if (svg) svg.innerHTML = '';
}

// Colore directement les maisons : binôme en vert, antagoniste en rouge
function showRelationArrows(pos) {
  if (!currentTheme) return;
  clearHouseRelationColors();
  drawThemeLines(pos);

  // Le thème AFFICHÉ (cf. themeAffiche) : sur un axe, les relations doivent
  // porter sur la figure qu'on voit dans la case, pas sur celle du principal.
  var _tA = themeAffiche();
  var fig = _tA[pos];
  var binFig = (typeof BINOMES_V7 !== 'undefined') ? BINOMES_V7[fig] : BINOMES[fig];
  var antFig = (typeof ANTAGONISTES_V7 !== 'undefined') ? ANTAGONISTES_V7[fig] : ANTAGONISTES[fig];
  var concFn = (typeof concordanceV7 === 'function') ? concordanceV7 : null;
  var elemsTable = (typeof ELEMENTS_V7 !== 'undefined') ? ELEMENTS_V7 : ELEMENTS;

  function findAll(targetFig) {
    var res = [];
    for (var p = 1; p <= 16; p++) {
      if (_tA[p] === targetFig) res.push({pos:p, hidden:false});
      else if (combine(_tA[p], FIGS[p-1]) === targetFig) res.push({pos:p, hidden:true});
    }
    return res;
  }

  var selEl = document.querySelector('.house[data-pos="' + pos + '"]');
  if (selEl) { selEl.classList.add('house-selected'); }

  var binPositions = findAll(binFig);
  binPositions.forEach(function(bp) {
    if (bp.pos === pos) return;
    var conc = concFn ? concFn(elemsTable[binFig], elemsTable[fig]) : {score:50};
    var el = document.querySelector('.house[data-pos="' + bp.pos + '"]');
    if (el) {
      el.classList.add('house-binome');
      var intensity = Math.max(0.3, Math.min(1, conc.score / 100));
      el.style.boxShadow = '0 0 0 3px rgba(34,197,94,' + intensity + ') inset, 0 0 10px rgba(34,197,94,' + intensity + ')';
    }
  });

  var antPositions = findAll(antFig);
  antPositions.forEach(function(ap) {
    if (ap.pos === pos) return;
    var conc = concFn ? concFn(elemsTable[antFig], elemsTable[fig]) : {score:50};
    var el = document.querySelector('.house[data-pos="' + ap.pos + '"]');
    if (el) {
      el.classList.add('house-antagoniste');
      var intensity = Math.max(0.3, Math.min(1, conc.score / 100));
      el.style.boxShadow = '0 0 0 3px rgba(239,68,68,' + intensity + ') inset, 0 0 10px rgba(239,68,68,' + intensity + ')';
    }
  });

  // ─── FRONT (or) ET PROTECTEUR (vert) — demande Ellemine_D (25/08/26) ───
  // « la figure qui occupe la maison, son figure de front si elle existe
  // dans le thème en base ou en résultante doit se clignoter en couleur or,
  // et 3 fois plus vite que R1 et R7, et aussi son protecteur en couleur
  // verte ». findAll couvre déjà la base ET la résultante.
  // Le clignotement est posé par les classes .house-front / .house-protecteur
  // (0,37s contre 1,1s pour R1/R7). Un marqueur F ou P est ajouté en coin :
  // sans lui, le vert du protecteur se confondrait avec celui du binôme et
  // l'or avec l'orange de R7.
  var frontFig = (typeof FRONT_V7 !== 'undefined') ? FRONT_V7[fig] : null;
  var protFig  = (typeof PROTECTEURS_V7 !== 'undefined') ? PROTECTEURS_V7[fig] : null;

  function marquerPole(cibleFig, classe, lettre, couleur) {
    if (!cibleFig) return;
    findAll(cibleFig).forEach(function (o) {
      if (o.pos === pos) return;
      var el = document.querySelector('.house[data-pos="' + o.pos + '"]');
      if (!el) return;
      el.classList.add(classe);
      if (!el.querySelector('.pole-mark')) {
        var m = document.createElement('span');
        m.className = 'pole-mark';
        m.style.color = couleur;
        // minuscule = présente seulement en résultante
        m.textContent = o.hidden ? lettre.toLowerCase() : lettre;
        m.title = (o.hidden ? 'en résultante' : 'en base');
        el.appendChild(m);
      }
    });
  }
  marquerPole(frontFig, 'house-front', 'F', '#FFD700');
  marquerPole(protFig, 'house-protecteur', 'B', '#10b981');
}

// ═══════════════════════════════════════════════════════════════
// LE THÈME AFFICHÉ, PAS LE THÈME PRINCIPAL (25/08/26, correction
// Ellemine_D : « quand on clique sur un axe le thème ne respecte pas
// l'ordre des figures de repos ce qui donne des mauvaises résultantes »)
//
// Le sélecteur « Thème actif » (Principal / 4 Mères / Axe angulaire /
// succédent / cadent) ne change QUE la grille : getDisplayTheme() est
// utilisé par renderThemeWithSize, mais tout ce qui réagit au clic sur une
// maison lisait encore currentTheme, resté sur le thème principal. On
// voyait donc la figure de l'axe dans la case et la résultante de la
// figure du thème principal en la touchant — deux figures différentes,
// d'où les résultantes fausses.
// La grille elle-même était juste : figures, numéros de rotation et
// résultantes du mode « Afficher résultantes » ont été contrôlés case par
// case contre getResultant, 16/16 conformes sur l'Axe Succédent.
function themeAffiche() {
  try { return getDisplayTheme() || currentTheme; } catch (e) { return currentTheme; }
}

function showHouseResult(pos){if(!currentTheme) return; selectedHouse=pos; renderHouseInsight(pos); showRelationArrows(pos); const house=document.querySelector(`.house[data-pos="${pos}"]`); if(!house) return; const result=getResultant(themeAffiche()[pos],pos); const resConcPct=concordanceFigureMaisonV7(result, pos).force; const numbering=showHouseLabels?`<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-size:9px;"><b>M${pos}</b><span style="color:#93c5fd;">${resConcPct}%</span></div>`:''; const hp=housePixelPos[pos]||{w:64,h:58}; const resEnergy=energyAtHouse(result,pos); const resBatt=batteryHtmlCompact(resEnergy, Math.max(3,Math.round(hp.w*0.09)), Math.max(16,Math.round(hp.h*0.6))); house.classList.add('result-flash'); house.innerHTML=`${numbering}<div style="display:flex;align-items:center;justify-content:center;gap:4px;">${resBatt}<div style="text-align:center;">${symb(result)}</div></div>`; if(houseResultTimeouts[pos]) clearTimeout(houseResultTimeouts[pos]); houseResultTimeouts[pos]=setTimeout(()=>{ if(!currentTheme) return; adjustThemeScale();
  // adjustThemeScale redessine toute la grille et effacerait le clignotement
  // du front et du protecteur au bout de 3 secondes. On le réapplique sur la
  // maison sélectionnée pour que la lecture reste à l'écran tant qu'on n'a
  // pas cliqué ailleurs.
  setTimeout(()=>{ try { if(currentTheme) showRelationArrows(pos); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); } }, 0);
},3000);}
function calculateHouseSum(){if(!currentTheme){document.getElementById('sum-result').innerHTML='<div class="bad">Lance le theme d abord.</div>'; return;} const mode=document.getElementById('sumModeBottom').value; const selected=sumSlots.map(slot=>{const raw=document.getElementById(`${slot}Bottom`).value; return raw===''?null:Number(raw);}).filter(Boolean); if(!selected.length){document.getElementById('sum-result').innerHTML='<div class="warn">Sélectionne au moins une maison.</div>'; return;} let figs=[],labels=[]; if(mode==='fixed'){figs=selected.map(h=>currentTheme[h]); labels=selected.map(h=>`M${h}`);} else {const order=getRotationOrderFromRepos(currentTheme[1]); const rotated=selected.map(h=>order[h-1]); figs=rotated.map(h=>currentTheme[h]); labels=rotated.map((h,i)=>`R${selected[i]} → M${h}`);} const result=combineMany(figs); const exists=figureExistsInTheme(result,currentTheme); document.getElementById('sum-result').innerHTML=`<div class="kv"><b>Mode :</b> ${mode==='fixed'?'fixe':'rotation'}</div>${labels.map((l,i)=>`<div class="kv"><b>${l} :</b> ${FL[figs[i]]}</div>`).join('')}<div class="kv"><b>Somme :</b> <span class="${exists?'good':'bad'}">${FL[result]}</span> ${exists?'existe dans le thème':'absente du thème'}</div><div class="kv"><b>Symbole :</b><br>${symb(result)}</div>`;}
// ═══════════════════════════════════════════════════════════════
// ✦ LA LECTURE D'UNE TRAJECTOIRE (01/09/26, doctrine Ellemine_D)
//
// Sa règle, mot pour mot : « pour vérifier si la trajectoire donne un
// verdict d'affirmation c'est comme la validation d'un thème, c'est-à-
// dire la somme de la trajectoire résulte une figure ; si elle existe
// dans le thème, oui. Le comment réside dans sa position, son
// environnement et son influence dans le thème. »
//
// ✔ LA PREMIÈRE MOITIÉ EST DÉJÀ LE PROTOCOLE DU FICHIER. « La figure
// existe-t-elle en base ou en résultante » est exactement ce que fait
// positionsBaseEtResultantes, et c'est le test des quatre axes de
// validité. Sa règle n'invente rien : elle APPLIQUE le protocole du
// thème à une trajectoire. C'est cohérent, et c'est bien vu.
//
// ☠️ MAIS MESURÉ, LE OUI/NON NE FILTRE PRESQUE RIEN.
// Sur les quatorze trajectoires des deux pôles, l'affirmation tombe
// entre 80 % et 96 % des cas de l'archive :
//     1-9-11 · 2-7-9 · 7-9-11 .... 96 %
//     1-5-9 · 1-6-11 ............. 95 %
//     5-7-12 ..................... 80 %   ← la plus sélective
// La raison est structurelle, et elle vaut pour toute figure :
// UN THÈME CONTIENT EN MOYENNE 13,9 DES 16 FIGURES (base ou résultante),
// mesuré sur 4000 tirages — 87 %. Demander « cette figure est-elle
// là ? » revient donc à poser une question dont la réponse est oui neuf
// fois sur dix. Ce n'est pas un filtre, c'est presque un passe-droit.
// C'est d'ailleurs pour ça que les quatre axes de validité ne servent
// qu'ENSEMBLE : pris un par un ils passent à 86-91 %, tous les quatre à
// la fois seulement à 63 %.
//
// ☠️ ET LE OUI/NON NE PRÉDIT RIEN. Quatorze tests directionnels — une
// trajectoire de M1 qui affirme devrait annoncer R1, une de M7 devrait
// annoncer R7 :
//     survivants à Bonferroni (seuil 0,0036) ...... ZÉRO
//     sous 0,05 brut .............................. ZÉRO
//     attendus par le seul hasard ................. 0,7
// Pas une seule touche. Le meilleur p est 0,187.
//
// ✔✔ DONC C'EST LA SECONDE MOITIÉ DE SA PHRASE QUI PORTE TOUT.
// Puisque le oui est quasi gratuit, toute l'information est dans « sa
// position, son environnement et son influence » — les trois mots qu'il
// a écrits lui-même. lectureTrajectoireV7 les rend, dans cet ordre.
// Elle ne décide de rien : elle donne à lire.
// ⚠️ currentTheme est déclaré en `let` au niveau du script principal : il
// n'est donc PAS sur window, et window.currentTheme vaut undefined depuis
// un autre bloc de script. Deuxième pas dans le même piège en une heure.
// Cette fonction, elle, ferme sur la variable et la rend accessible aux
// blocs voisins — c'est le seul accès canonique au thème.
window.themeCanoniqueV7 = function () {
  return (typeof currentTheme !== 'undefined') ? currentTheme : null;
};

function lectureTrajectoireV7(theme, maisons) {
  if (!theme || !maisons || !maisons.length) return null;
  var figs = maisons.map(function (h) { return theme[h]; });
  if (figs.some(function (f) { return !f; })) return null;
  // ☠️ GARDE-FOU AJOUTÉ LE 01/09/26 APRÈS UN FAUX RÉSULTAT SILENCIEUX.
  // Le carré géomantique vit dans un autre bloc de script, avec un thème
  // dont les clés sont des NOMS D'AFFICHAGE — « Cauda », « Conjonctio »,
  // « Fortuna minor » — et non les identifiants canoniques
  // cauda_draconis, conjunctio, fortuna_minor. Passé tel quel,
  // combineMany(['Carcer','Cauda','Albus']) ne lève AUCUNE erreur : il
  // rend « via » quand la bonne réponse est « acquisitio ». Une clé
  // inconnue produisait donc une figure plausible et fausse, affichée
  // avec assurance. C'est Ellemine_D qui l'a vu à l'écran.
  // Désormais on refuse plutôt que de deviner.
  if (figs.some(function (f) { return FIGS_V7.indexOf(f) < 0; })) {
    return { erreur: 'figures hors table : ' + figs.join(', ')
      + ' — thème non canonique, calcul refusé' };
  }
  var res = figs.reduce(function (a, b) { return a === null ? b : combine(a, b); }, null);
  var nom = function (f) { return (typeof FL !== 'undefined' && FL[f]) ? FL[f] : f; };

  // ── 1 · L'AFFIRMATION : la résultante est-elle dans le thème ? ──
  var places = [];
  try { places = positionsBaseEtResultantes(res, theme) || []; } catch (e) { places = []; }
  var affirme = places.length > 0;

  // ── 2 · LA POSITION : où, et en base ou en résultante ──
  var positions = [];
  try {
    (trouverFigV7(res, theme) || []).forEach(function (o) {
      var el = (typeof MAISON_ELEM_V7 !== 'undefined') ? MAISON_ELEM_V7[o.pos] : null;
      positions.push({
        maison: o.pos,
        source: o.hidden ? 'résultante' : 'base',
        elemMaison: el,
        elemFigure: ELEMENTS_V7[res],
        concordance: el ? concordanceElement(ELEMENTS_V7[res], el) : null,
        surLaTrajectoire: maisons.indexOf(o.pos) >= 0
      });
    });
  } catch (e) { /* positions reste vide */ }

  // ── 3 · L'ENVIRONNEMENT : ce qui borde chaque position ──
  positions.forEach(function (P) {
    var av = ((P.maison - 2 + 16) % 16) + 1, ap = (P.maison % 16) + 1;
    P.avant = { maison: av, figure: theme[av] };
    P.apres = { maison: ap, figure: theme[ap] };
  });

  // ── 4 · L'INFLUENCE : quel lien la résultante a-t-elle avec les deux chefs ──
  var rot = null;
  try { rot = getRotationCombat(theme); } catch (e) { rot = null; }
  function lien(a, b) {
    if (!a || !b) return null;
    if (a === b) return 'la figure elle-même';
    if (BINOMES_V7[b] === a) return 'binôme';
    if (FRONT_V7[b] === a) return 'front';
    if (BOUCLIER_V7[b] === a) return 'bouclier';
    if (ANTAGONISTES_V7[b] === a) return 'antagoniste';
    if (typeof frontDuFrontV7 === 'function' && frontDuFrontV7(b) === a) return 'front du front';
    if (typeof detruitV7 === 'function' && detruitV7(b) === a) return 'elle détruit ce chef';
    if (typeof detruitV7 === 'function' && detruitV7(a) === b) return 'ce chef la détruit';
    return null;
  }
  var influence = null;
  if (rot && rot.figR1 && rot.figR7) {
    influence = {
      figR1: rot.figR1, figR7: rot.figR7,
      versR1: lien(res, rot.figR1), versR7: lien(res, rot.figR7),
      memeBoucleR1: loopOf(res) === loopOf(rot.figR1),
      memeBoucleR7: loopOf(res) === loopOf(rot.figR7)
    };
  }
  return {
    maisons: maisons, figures: figs, resultante: res, nomResultante: nom(res),
    affirme: affirme, nbPositions: positions.length,
    positions: positions, influence: influence,
    // ⚠️ à afficher partout où l'affirmation est montrée : le oui ne vaut
    // presque rien, c'est la position qui parle.
    avertissement: affirme
      ? 'affirme — mais 87 % des figures sont présentes dans un thème quelconque : le oui ne discrimine presque pas, lis la position'
      : 'se tait — et c\'est le cas rare : moins d\'un sur huit'
  };
}

// ─── LES PRÉRÉGLAGES SONT REFAITS (01/09/26, doctrine Ellemine_D) ───
// Les anciens étaient des listes de maisons sans nom ni raison — '3D'
// valait [2,3,11,8,9,14], et '4D' treize maisons dont deux répétées
// (M13 et M14 y figuraient deux fois : combinées, elles s'annulaient).
// Ils sont remplacés par les structures de la récolte, qui ont un nom :
//   1D · Cardinal ...... M1 + M4 + M7 + M10, les angulaires
//   2D · Succédent ..... M2 + M5 + M8 + M11
//   3D · Cadent ........ M3 + M6 + M9 + M12
//   4D · offensive 1 ... M1 + M5 + M9, le trigone de M1
//   3B · offensive 7 ... M7 + M3 + M11, le trigone de M7
// « Selon la rotation » est déjà le sélecteur Mode de ce panneau : en
// mode fixe on lit M1, M5, M9 ; en mode rotation on lit R1, R5, R9,
// c'est-à-dire les maisons que la rotation met à ces places. Le code le
// faisait déjà, rien à ajouter pour ça.
// 'Yes' est retiré sur sa demande. V-1 et V-2 sont conservés tels quels :
// il les a listés sans consigne, et supprimer sans consigne est pire que
// laisser en trop.
// ⚠️ RAPPEL DE LA LOI N.3 — les deux trigones S'EFFONDRENT. M1+M5+M9 vaut
// M2 ⊕ M5 : il ne contient NI M1 NI M9, parce que M9 = M1 ⊕ M2 et que M1
// s'annule avec lui-même. C'est affiché sous le résultat, pour que
// personne ne croie lire la somme de ce que la trajectoire traverse.
var PRESETS_SOMME_V7 = {
  '1D':  { maisons: [1, 4, 7, 10], nom: 'Axe Cardinal (les angulaires)' },
  '2D':  { maisons: [2, 5, 8, 11], nom: 'Axe Succédent' },
  '3D':  { maisons: [3, 6, 9, 12], nom: 'Axe Cadent' },
  '4D':  { maisons: [1, 5, 9],     nom: 'Trigone offensif de M1 / R1', reduit: 'M2 ⊕ M5' },
  '3B':  { maisons: [7, 3, 11],    nom: 'Trigone offensif de M7 / R7', reduit: 'M3 ⊕ M5 ⊕ M6 ⊕ M7' },
  'V-1': { maisons: [1, 2, 3, 4, 9, 10, 13, 15], nom: 'V-1' },
  'V-2': { maisons: [5, 6, 7, 8, 11, 12, 14, 16], nom: 'V-2' }
};
function applyPresetSum(name){
  var meta = PRESETS_SOMME_V7[name];
  if (!currentTheme || !meta) return;
  var mode = document.getElementById('sumModeBottom').value;
  var houses = meta.maisons, figs = [], labels = [];
  if (mode === 'fixed') {
    figs = houses.map(function (h) { return currentTheme[h]; });
    labels = houses.map(function (h) { return 'M' + h; });
  } else {
    var order = getRotationOrderFromRepos(currentTheme[1]);
    var rotated = houses.map(function (h) { return order[h - 1]; });
    figs = rotated.map(function (h) { return currentTheme[h]; });
    labels = rotated.map(function (h, i) { return 'R' + houses[i] + ' → M' + h; });
  }
  var result = combineMany(figs);
  var exists = figureExistsInTheme(result, currentTheme);
  document.getElementById('sum-result').innerHTML =
      '<div class="kv"><b>Preset :</b> ' + name + ' — ' + meta.nom + '</div>'
    + labels.map(function (l, i) { return '<div class="kv"><b>' + l + ' :</b> ' + FL[figs[i]] + '</div>'; }).join('')
    + '<div class="kv"><b>Somme :</b> <span class="' + (exists ? 'good' : 'bad') + '">' + FL[result] + '</span> '
    + (exists ? 'existe dans le thème' : 'absente du thème') + '</div>'
    + '<div class="kv"><b>Symbole :</b><br>' + symb(result) + '</div>'
    + (meta.reduit
        ? '<div class="kv muted" style="font-size:11px;">⚠️ loi N.3 — cette trajectoire s\'effondre : '
          + 'elle vaut ' + meta.reduit + ', elle ne contient donc pas toutes les maisons qu\'elle traverse.</div>'
        : '')
    + rendreLectureTrajectoireV7(currentTheme, houses);
}

// L'affichage de sa règle : l'affirmation, puis la position, puis
// l'environnement, puis l'influence. Voir lectureTrajectoireV7 pour
// pourquoi le oui/non est presque toujours oui.
function rendreLectureTrajectoireV7(theme, maisons) {
  var L = null;
  try { L = lectureTrajectoireV7(theme, maisons); } catch (e) { return ''; }
  if (!L) return '';
  var n = function (f) { return (typeof FL !== 'undefined' && FL[f]) ? FL[f] : f; };
  var h = '<div style="margin-top:10px; padding:9px 12px; border-radius:8px; '
    + 'background:#0f172a; border:1px solid ' + (L.affirme ? '#4ade80' : '#f87171') + ';">'
    + '<div style="font-size:12px; font-weight:800; color:' + (L.affirme ? '#bbf7d0' : '#fecaca') + ';">'
    + (L.affirme ? '✔ LA TRAJECTOIRE AFFIRME' : '✘ LA TRAJECTOIRE SE TAIT')
    + ' — ' + L.nomResultante + '</div>'
    + '<div style="font-size:10px; color:#94a3b8; margin:3px 0 6px;">' + L.avertissement + '</div>';
  if (L.positions.length) {
    h += '<div style="font-size:11px; color:#e2e8f0;"><b>Position</b> — '
      + L.positions.map(function (P) {
          return 'M' + P.maison + ' (' + P.source + ', maison ' + (P.elemMaison || '?')
            + ', concordance ' + (P.concordance === null ? '?' : P.concordance) + ')';
        }).join(' · ') + '</div>'
      + '<div style="font-size:11px; color:#cbd5e1; margin-top:3px;"><b>Environnement</b> — '
      + L.positions.map(function (P) {
          return 'M' + P.maison + ' entre ' + n(P.avant.figure) + ' (M' + P.avant.maison + ') et '
            + n(P.apres.figure) + ' (M' + P.apres.maison + ')';
        }).join(' · ') + '</div>';
  }
  if (L.influence) {
    h += '<div style="font-size:11px; color:#cbd5e1; margin-top:3px;"><b>Influence</b> — '
      + 'R1 ' + n(L.influence.figR1) + ' : ' + (L.influence.versR1 || 'aucun lien direct')
      + (L.influence.memeBoucleR1 ? ', même boucle' : ', boucle opposée')
      + ' &nbsp;·&nbsp; R7 ' + n(L.influence.figR7) + ' : ' + (L.influence.versR7 || 'aucun lien direct')
      + (L.influence.memeBoucleR7 ? ', même boucle' : ', boucle opposée')
      + '</div>';
  }
  return h + '</div>';
}
function compareWithReality(){
  if(!currentTheme) return;
  var favorite = (document.getElementById('matchFavorite')||{}).value || 'none';
  // CORRIGÉ (20/08/26, demande Ellemine_D) : comparait contre
  // currentAnalysis.rotation (moteur V7 legacy, jamais affiché à l'écran
  // depuis le passage au protocole R1/R7) — remplacé par
  // getVerdictAfficheReel(), qui rejoue le vrai pipeline affiché.
  var reel = getVerdictAfficheReel(currentTheme, favorite);
  const realWinner=document.getElementById('realWinner').value, realScore=(document.getElementById('realScore').value||'').trim(), realFirstGoal=document.getElementById('realFirstGoal').value, realPenalty=document.getElementById('realPenalty').value;
  const issues=[];
  if(realWinner && realWinner!==reel.winner) issues.push(`Vainqueur faux : prédit ${reel.winner}, réel ${realWinner}`);
  if(realScore && realScore!==reel.scoreMain) issues.push(`Score faux : prédit ${reel.scoreMain}, réel ${realScore}`);
  if(realFirstGoal){
    // Approximation : le pipeline R1/R7 n'a pas d'équivalent direct au
    // "premier but" du moteur V7 legacy — BTTS sert de proxy le plus proche.
    const predicted = reel.htWinner==='both' ? 'Both' : 'None';
    if(realFirstGoal!==predicted) issues.push(`Premier but mal lu (proxy BTTS) : prédit ${predicted}, réel ${realFirstGoal}`);
  }
  if(realPenalty){
    const predicted=(reel.penalty.hasRed || reel.penalty.hasPen)?'yes':'no';
    if(realPenalty!==predicted) issues.push(`Rouge / pénalty mal lu : prédit ${predicted} (${reel.incidentNiveau||'—'} ${reel.incidentPct||0}%), réel ${realPenalty}`);
  }
  document.getElementById('diagnostic-panel').innerHTML=issues.length?issues.map(i=>`<div class="diff-line">${i}</div>`).join(''):`<div class="diff-line ok">Aucun écart détecté entre le calcul et le résultat réel.</div>`;
  document.getElementById('correction-panel').innerHTML=`<div class="diff-line warn">Réajustement automatique désactivé.</div>`;
}
function resetCorrections(){document.getElementById('diagnostic-panel').innerHTML='<div class="muted">Les corrections ont été réinitialisées.</div>'; document.getElementById('correction-panel').innerHTML='<div class="muted">Les corrections ciblées apparaîtront ici après comparaison.</div>';}

// ═══════════════════════════════════════════════════════════════
// EXPORT THÈME EN IMAGE (Canvas)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// EXPORT TIRAGE (JSON) — dump complet du thème courant pour analyse
// externe : les 16 maisons (figure + libellé), les métadonnées du
// match, la chaîne verdictFinal/rangParole, et les champs de résultat
// réel déjà saisis s'ils existent. Un fichier par tirage.
// ═══════════════════════════════════════════════════════════════
function exportStatsJSON() {
  var all = getHistoryList().concat(getSavedList());
  var seen = {};
  var replays = [];
  all.forEach(function(e){
    if(!e.theme || !e.realScore) return;
    var fp = themeFingerprint(e.team1||'', e.team2||'', e.theme);
    if(seen[fp]) return; seen[fp] = true;
    var r = replayEntry(e);
    if(r) replays.push(Object.assign({}, r, {team1:e.team1||'', team2:e.team2||'', matchDate:e.matchDate||'', matchTime:e.matchTime||'', realScore:e.realScore||''}));
  });
  var valides = replays.filter(function(r){return r.valide;});
  function rate(list, key){
    var applicable = list.filter(function(r){return r[key]!==null && r[key]!==undefined;});
    var ok = applicable.filter(function(r){return r[key]===true;}).length;
    return {ok:ok, total:applicable.length, pct: applicable.length ? Math.round(100*ok/applicable.length) : null};
  }
  var data = {
    exportedAt: new Date().toISOString(),
    totalArchives: replays.length,
    valides: valides.length,
    invalides: replays.length - valides.length,
    taux: {
      combinedOk: rate(valides,'combinedOk'),
      campDominantSeul: rate(valides,'cdOk'),
      verdictElementaireSeul: rate(valides,'veOk'),
      jugeNulOuVictoire: rate(valides,'jugeOk'),
      chaineVerdictFinalComplete: rate(valides,'vfOk'),
      score_ecartMax1But: rate(valides,'scoreOk'),
      tiragesAveugles: rate(valides.filter(function(r){return r.blindTest;}), 'vfOk'),
      tiragesManuels: rate(valides.filter(function(r){return !r.blindTest;}), 'vfOk')
    },
    detailParMatch: replays.map(function(r){
      return {
        team1:r.team1, team2:r.team2, matchDate:r.matchDate, matchTime:r.matchTime, realScore:r.realScore,
        valide:r.valide, realWinner:r.realWinner, theme:r.theme,
        vfType:r.vfType, vfWinner:r.vfWinner, vfRang:r.vfRang, vfEtage:r.vfEtage, vfOk:r.vfOk,
        predScore:r.predScore, scoreOk:r.scoreOk,
        blindTest:r.blindTest
      };
    })
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = 'statistiques_' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportSavedThemesJSON() {
  var list = getSavedList();
  if (!list.length) { alert('Aucun thème sauvegardé pour le moment.'); return; }

  function deriveRealWinner(realScore) {
    if (!realScore) return '';
    var m = String(realScore).match(/(\d+)\s*-\s*(\d+)/);
    if (!m) return '';
    var g1 = parseInt(m[1],10), g7 = parseInt(m[2],10);
    return g1 > g7 ? 'M1' : (g7 > g1 ? 'M7' : 'Nul');
  }

  var data = {
    exportedAt: new Date().toISOString(),
    totalSauvegardes: list.length,
    themes: list.map(function(e){
      var maisons = {};
      if (e.theme) {
        for (var p = 1; p <= 16; p++) {
          maisons['M'+p] = { figure: e.theme[p], label: FL[e.theme[p]] || e.theme[p] };
        }
      }
      return {
        team1: e.team1, team2: e.team2,
        matchDate: e.matchDate, matchTime: e.matchTime, competition: e.competition,
        theme: maisons,
        verdict: e.verdict || null,
        realScore: e.realScore || '', realWinner: deriveRealWinner(e.realScore),
        realFirstGoal: e.realFirstGoal || '', realPenalty: e.realPenalty || '',
        blindTest: !!e.blindTest,
        savedAt: e.savedAt || ''
      };
    })
  };

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = 'themes_sauvegardes_' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportThemeJSON() {
  if (!currentTheme) { alert('Lance le theme avant d exporter.'); return; }
  var team1 = (document.getElementById('team1')||{}).value || 'Équipe 1';
  var team2 = (document.getElementById('team2')||{}).value || 'Équipe 2';
  var date = (document.getElementById('matchDate')||{}).value || '';
  var time = (document.getElementById('matchTime')||{}).value || '';
  var timezone = (document.getElementById('matchTimezone')||{}).value || '0';
  var compSel = document.getElementById('competitionMode');
  var competition = compSel ? compSel.value : '';
  var stadium = (document.getElementById('stadium')||{}).value || '';

  var maisons = {};
  for (var p = 1; p <= 16; p++) {
    maisons['M'+p] = { figure: currentTheme[p], label: FL[currentTheme[p]] || currentTheme[p] };
  }

  var vf = null, rp = null;
  try { vf = verdictFinal(currentTheme); rp = rangParole(vf); } catch(e){ console.debug('[maintenance] erreur ignorée:', e); }
  var rt = radicaliteTirage(date, time, themeCastAt, timezone);

  var data = {
    exportedAt: new Date().toISOString(),
    castAt: themeCastAt || new Date().toISOString(),
    delaiTirageMin: rt.delaiMin,
    radicalite: rt.niveau,
    team1: team1, team2: team2,
    date: date, time: time, timezone: 'UTC'+(timezone>=0?'+':'')+timezone,
    competition: competition, stadium: stadium,
    theme: maisons,
    verdictFinal: vf ? { type: vf.type, winner: vf.winner, label: vf.label, reason: vf.reason } : null,
    rangParole: rp ? { rang: rp.rang, etage: rp.etage } : null,
    realWinner: (document.getElementById('realWinner')||{}).value || '',
    realScore: (document.getElementById('realScore')||{}).value || '',
    realFirstGoal: (document.getElementById('realFirstGoal')||{}).value || '',
    realPenalty: (document.getElementById('realPenalty')||{}).value || ''
  };

  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var safeT1 = team1.replace(/[^a-zA-Z0-9]/g, '_');
  var safeT2 = team2.replace(/[^a-zA-Z0-9]/g, '_');
  var link = document.createElement('a');
  link.href = url;
  link.download = 'tirage_' + safeT1 + '_vs_' + safeT2 + '_' + (date || 'sans-date') + '.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportThemeImage() {
  if (!currentTheme || !currentAnalysis) {
    alert('Lance le theme avant d exporter.');
    return;
  }

  var team1 = document.getElementById('team1').value || 'Équipe 1';
  var team2 = document.getElementById('team2').value || 'Équipe 2';
  var matchDate = document.getElementById('matchDate').value || '';
  var matchTime = document.getElementById('matchTime').value || '';
  var expScore   = document.getElementById('exp-score').value.trim();
  var expButHT   = document.getElementById('exp-butHT').value;
  var expPenalty = document.getElementById('exp-penalty').value;
  var expRouge   = document.getElementById('exp-rouge').value;

  // Résolution canvas
  var CW = 760, CH = 620;
  var canvas = document.getElementById('export-canvas');
  canvas.width  = CW;
  canvas.height = CH;
  var ctx = canvas.getContext('2d');

  // Fond
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, CW, CH);

  // ── Couleurs éléments ──
  var ELEM_COLOR = {feu:'#ef4444', air:'#eab308', eau:'#3b82f6', terre:'#4b5563'};
  var MAISON_ELEM_LOCAL = {1:'feu',2:'air',3:'eau',4:'terre',5:'feu',6:'air',7:'eau',8:'terre',9:'feu',10:'air',11:'eau',12:'terre',13:'feu',14:'air',15:'eau',16:'terre'};

  function figElemColor(fig) { return ELEM_COLOR[ELEMENTS_V7[fig]] || '#94a3b8'; }
  function maisonElemColor(pos) { return ELEM_COLOR[MAISON_ELEM_LOCAL[pos]] || '#334155'; }

  // ── HEADER ──
  var headerH = 56;
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, CW, headerH);

  ctx.fillStyle = '#dbeafe';
  ctx.font = 'bold 15px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(team1 + '  vs  ' + team2, CW/2, 22);

  ctx.font = '12px Arial';
  ctx.fillStyle = '#93c5fd';
  var dateStr = matchDate ? matchDate + (matchTime ? ' ' + matchTime : '') : '';
  ctx.fillText(dateStr, CW/2, 40);

  // Verdict — CORRECTION (revue des attaques effectives / moteur 4 meutes) :
  // affichait v7.winner/v7.scoreMain (moteur V7 brut, piloté à 50% des thèmes
  // par le repli "signaux" du moteur 4 meutes, jamais validé empiriquement),
  // alors que la carte "Verdict M1/M7" principale de l'app affiche le verdict
  // DOCTRINAL (verdictFinal, via buildVerdictCard). Les deux pouvaient donc
  // légitimement diverger, et l'image exportée ne donnait aucune indication
  // qu'elle utilisait une source différente et moins validée. Recalculé ici
  // exactement comme la carte principale pour rester cohérent avec ce que
  // l'utilisateur voit à l'écran.
  var v7 = currentAnalysis.v7;
  var vfExport = verdictFinal(currentTheme);
  var carteExport = buildVerdictCard(1, 7, 'M1', 'M7', currentTheme, vfExport.winner);
  var winnerLabel = carteExport.winner==='M1' ? team1 : carteExport.winner==='M7' ? team2 : 'Nul';
  ctx.font = 'bold 13px Arial';
  ctx.fillStyle = '#4ade80';
  ctx.fillText('Verdict : ' + winnerLabel + '   Prédit : ' + carteExport.scoreMain, CW/2, 54);

  // ── GRILLE DU THÈME ──
  // Positions originales : 700×480, on scale à CW-20 largeur centrée
  var gridScale = (CW - 40) / 700;
  var gridOffX  = 20;
  var gridOffY  = headerH + 10;
  var houseW = 64 * gridScale;
  var houseH = 58 * gridScale;

  Object.keys(housePositions).forEach(function(k) {
    var pos = Number(k);
    var p   = housePositions[k];
    var fig = currentTheme[pos];
    var x   = gridOffX + p.left * gridScale;
    var y   = gridOffY + p.top  * gridScale;

    // Fond maison
    ctx.fillStyle = pos===1||pos===7 ? '#0f2040' : '#000000';
    ctx.beginPath();
    ctx.roundRect(x, y, houseW, houseH, 4);
    ctx.fill();

    // Bordure figure (haut) et maison (bas)
    var bw = 3;
    ctx.fillStyle = figElemColor(fig);
    ctx.fillRect(x, y, houseW, bw);
    ctx.fillStyle = maisonElemColor(pos);
    ctx.fillRect(x, y + houseH - bw, houseW, bw);

    // Numéro maison
    ctx.font = 'bold ' + Math.max(7, Math.round(8*gridScale)) + 'px monospace';
    ctx.fillStyle = pos===1||pos===7 ? '#60a5fa' : '#64748b';
    ctx.textAlign = 'left';
    ctx.fillText('M' + pos, x + 2, y + 9*gridScale);

    // Symbole géomantique (points MAP_GEO)
    var rows = MAP_GEO[fig];
    var dotR = Math.max(2, 2.5 * gridScale);
    var dotGap = dotR * 3;
    var rowH2 = (houseH - 14*gridScale) / 4;
    rows.forEach(function(v, ri) {
      var ry = y + 12*gridScale + ri * rowH2 + rowH2/2;
      var cx2 = x + houseW/2;
      if (v === 2) {
        // Deux points
        ctx.beginPath(); ctx.arc(cx2 - dotGap/2, ry, dotR, 0, Math.PI*2);
        ctx.fillStyle = figElemColor(fig); ctx.fill();
        ctx.beginPath(); ctx.arc(cx2 + dotGap/2, ry, dotR, 0, Math.PI*2);
        ctx.fillStyle = figElemColor(fig); ctx.fill();
      } else {
        // Un point
        ctx.beginPath(); ctx.arc(cx2, ry, dotR, 0, Math.PI*2);
        ctx.fillStyle = figElemColor(fig); ctx.fill();
      }
    });
  });

  // ── BANDEAU INFOS EN BAS ──
  var infoY = gridOffY + 420 * gridScale + 14;
  var infoH = CH - infoY - 8;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, infoY, CW, infoH);

  // Ligne séparatrice
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, infoY, CW, 1);

  var cols = [
    {label:'Score réel', val: expScore || '—'},
    {label:'But HT',     val: expButHT  ? (expButHT==='M1'?team1:expButHT==='M7'?team2:expButHT) : '—'},
    {label:'Pénalty',    val: expPenalty || '—'},
    {label:'Carton rouge', val: expRouge || '—'}
  ];

  var colW = CW / cols.length;
  cols.forEach(function(col, i) {
    var cx3 = i * colW + colW / 2;
    ctx.font = '10px Arial';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText(col.label, cx3, infoY + 14);

    ctx.font = 'bold 14px Arial';
    var valColor = '#e2e8f0';
    if (col.label === 'Score réel') valColor = '#4ade80';
    if (col.label === 'Pénalty' && col.val === 'Oui') valColor = '#f59e0b';
    if (col.label === 'Carton rouge' && col.val === 'Oui') valColor = '#ef4444';
    ctx.fillStyle = valColor;
    ctx.fillText(col.val, cx3, infoY + 30);
  });

  // Planète M1 / M7
  if (v7.planM1 && v7.planM7) {
    ctx.font = '10px Arial';
    ctx.fillStyle = '#7c3aed';
    ctx.textAlign = 'center';
    var planStr = PLANETE_SYMB[v7.planM1.planete] + ' ' + v7.planM1.planete + '  (' + FL[v7.planM1.fig] + ')   vs   ' + PLANETE_SYMB[v7.planM7.planete] + ' ' + v7.planM7.planete + '  (' + FL[v7.planM7.fig] + ')';
    ctx.fillText(planStr, CW/2, infoY + 46);

    // 📚 étude (03/08/26) — dignité accidentelle enrichie (catégorie de
    // maison + régence naturelle), non validée.
    if (v7.planM1.digniteAccidentelle && v7.planM7.digniteAccidentelle) {
      var daM1 = v7.planM1.digniteAccidentelle, daM7 = v7.planM7.digniteAccidentelle;
      ctx.font = '9px Arial';
      ctx.fillStyle = '#94a3b8';
      var daStr = 'Dign. acc. M1: ' + (daM1.total>=0?'+':'') + daM1.total + ' (' + (daM1.categorie||'—') + (daM1.regence.statut?', '+daM1.regence.label:'') + ')'
        + '   vs   Dign. acc. M7: ' + (daM7.total>=0?'+':'') + daM7.total + ' (' + (daM7.categorie||'—') + (daM7.regence.statut?', '+daM7.regence.label:'') + ')';
      ctx.fillText(daStr, CW/2, infoY + 58);
    }
  }

  // ── Téléchargement ──
  var filename = (team1 + '_vs_' + team2 + (matchDate ? '_' + matchDate : '') + '.png').replace(/[^a-zA-Z0-9_.-]/g, '_');
  var link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ═══════════════════════════════════════════════════════════════
// PLUIE DE CHIFFRES (07/07/26) — fond animé façon "matrix" pour le
// panneau d'analyse de maison. Purement décoratif : les phrases
// arabes fixes (سلام قولا من رب رحيم / الحق من ربي) restent immobiles
// au premier plan, les chiffres défilent en arrière-plan.
// ═══════════════════════════════════════════════════════════════
function initMatrixRain(canvasId) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var chars = '0123456789';
  var fontSize = 14;
  var columns, drops;

  function resize() {
    var parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth || 300;
    canvas.height = parent.clientHeight || 260;
    columns = Math.max(1, Math.floor(canvas.width / fontSize));
    drops = new Array(columns).fill(0).map(function(){ return Math.floor(Math.random() * 20); });
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(2,2,2,0.10)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';
    for (var i = 0; i < drops.length; i++) {
      var text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillStyle = Math.random() > 0.95 ? '#86efac' : '#16a34a';
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(draw, 70);
}

function initializeApp(){['m1','m2','m3','m4'].forEach(populateSelect); ['m1','m2','m3','m4'].forEach((id,index)=>document.getElementById(id).value=['puer','laetitia','caput_draconis','albus'][index]); sumSlots.forEach(slot=>populateHouseSelect(`${slot}Bottom`,'M')); populateFigureSelectOptional('combineFigureSelect'); populateHouseSelect('combineHouseSelect','M'); toggleDrawMode(); updateSumHouseLabels(); renderQuestionContext(null); populateCompetitionRegions(); const compRegSel=document.getElementById('competitionRegion'); if(compRegSel) compRegSel.value='Europe'; updateCompetitionList(); const compSel=document.getElementById('competitionMode'); if(compSel) compSel.value='fra_l1'; const btn=document.getElementById('toggleHouseLabelsBtn'); if(btn) btn.textContent='Masquer numérotation M/R'; updatePlaneteJourIndicator(); initMatrixRain('insight-matrix-canvas');}

function filterTeamSuggestions(value) {
  var dl = document.getElementById('team-suggestions');
  if (!dl) return;
  var v = (value||'').toLowerCase();
  var matches = TEAM_NAMES_LIST.filter(function(t) {
    return t.toLowerCase().indexOf(v) === 0;
  }).slice(0, 12);
  dl.innerHTML = matches.map(function(t) {
    return '<option value="' + t.replace(/"/g, '&quot;') + '"></option>';
  }).join('');
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initializeApp); else initializeApp();
window.addEventListener('resize', function(){ if (currentTheme) adjustThemeScale(); syncTopbarPadding(); });
syncTopbarPadding();
(function(){
  const shell = document.querySelector('.topbar-shell');
  if (shell && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(function(){ syncTopbarPadding(); }).observe(shell);
  }
})();

