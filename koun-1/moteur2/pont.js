/* Pont entre le moteur 2 et l'atelier : met la lecture du moteur au format attendu par l'interface. */
(function (root) {
  'use strict';
  function compacter(K, theme, meres) {
    var a = K.analyser(theme), L = a.lecture, d = a.decision;
    function campDe(f) { return L.R1.frontDirect.indexOf(f) >= 0 ? 'R1' : (L.R7.frontDirect.indexOf(f) >= 0 ? 'R7' : null); }
    var houses = L.maisons.map(function (m) {
      var h = m.maison, pos = [];
      function p(f, couches) { return { figure: f, house: h, couches: couches, elementFigure: K.elementDe(f), elementMaison: K.elementMaison(h), forcePct: L.force(f, h), motif: L.motif(f, h), reposPropreIci: K.num(f) === h }; }
      if (m.resultante && m.resultante === m.base) pos.push(p(m.base, ['base', 'resultante']));
      else { pos.push(p(m.base, ['base'])); if (m.resultante) pos.push(p(m.resultante, ['resultante'])); }
      return { house: h, base: m.base, result: m.resultante || '', produced: '', front: K.frontDe(m.base),
        rest: K.num(m.base) === h ? 'Repos propre' : 'Hors repos', forceBase: L.force(m.base, h),
        forceResultante: m.resultante ? L.force(m.resultante, h) : null, elementMaison: K.elementMaison(h), positions: pos, absenceResultante: h === 16 };
    });
    var duels = L.duels.map(function (e) {
      var contre = L.duels.filter(function (x) { return x.cible === e.attaquant && x.present; }).map(function (x) { return { attaquant: x.attaquant, cible: x.cible, etat: x.etat }; });
      return { attaquant: e.attaquant, cible: e.cible, present: e.present, ciblePresente: e.ciblePresente, etat: e.etat,
        maitriseDemontree: e.etat === 'CIBLE_MAITRISEE_PAR_REPOS_MAXIMAL', attaqueNeutralisee: e.etat === 'RESISTANCE_CIBLE_AU_REPOS_MAXIMAL' || e.etat === 'DOUBLE_REPOS_ANNULATION', contreAttaques: contre };
    });
    var verrous = L.verrous.R1.map(function (v) { return { figures: v.figures, maisons: v.maisons, front: v.front, camp: 'R1' }; })
      .concat(L.R7.front === L.R1.front ? [] : L.verrous.R7.map(function (v) { return { figures: v.figures, maisons: v.maisons, front: v.front, camp: 'R7' }; }));
    var annulations = L.annulations.map(function (x) { return { attaquant: x.attaquant, cible: x.cible, campAttaquant: campDe(x.attaquant), campCible: campDe(x.cible), maisonAttaquant: x.maisonAttaquant, maisonCible: x.maisonCible }; });
    var libelle = d.verdict === '1' ? 'Victoire R1' : d.verdict === '2' ? 'Victoire R7' : d.verdict === 'N' ? 'Nul' : 'Aucun cas applicable';
    return {
      mothers: meres, theme: theme, houses: houses, poles: { R1: L.R1.maison, R7: L.R7.maison },
      decision: { verdict: d.verdict, statut: d.statut, phase: d.phase, raison: d.raison, regle: d.regle, victoireAssuree: d.victoireAssuree,
        confirmee: d.statut === 'REGLE_CONFIRMEE', erreur: null, annulationsEtVerrous: { annulations: annulations, verrous: verrous } },
      engineVersion: K.version,
      labels: { winner: libelle, reason: d.raison, btts: 'Non défini', incidents: 'Non défini', incidentDetail: '' },
      fronts: { R1: { figure: L.R1.figure, front: L.R1.frontDirect, binomes: L.R1.frontBinome }, R7: { figure: L.R7.figure, front: L.R7.frontDirect, binomes: L.R7.frontBinome } },
      circuits: [], resistances: [], duels: duels, essai: null,
      outputs: { vainqueur: { ok: true, vainqueur: d.verdict, statutDecision: d.statut, decisionRendue: d.verdict !== null, label: libelle }, btts: null, incidents: null }
    };
  }
  root.KOUN_COMPACTER = compacter;
  if (typeof module !== 'undefined' && module.exports) { module.exports = { compacter: compacter }; return; }
  if (typeof window === 'undefined' || window.parent === window) return;
  var canal = 'moteur-validation', origine = parent.location.origin;
  var local = origine === 'null' || parent.location.protocol === 'file:';
  function emettre(x) { x.channel = canal; parent.postMessage(x, local ? '*' : origine); }
  window.addEventListener('message', function (ev) {
    if (ev.source !== parent || (ev.origin !== origine && !(local && ev.origin === 'null')) || !ev.data || ev.data.channel !== canal || ev.data.type !== 'RUN') return;
    var id = ev.data.id, m = ev.data.mothers;
    try {
      if (typeof id !== 'string' || !Array.isArray(m) || m.length !== 4 || m.some(function (f) { return window.KOUN.FIG.indexOf(f) < 0; })) throw new Error('Quatre figures reconnues sont requises.');
      var theme = window.KOUN.construireTheme(m[0], m[1], m[2], m[3]);
      emettre({ type: 'RESULT', id: id, result: JSON.parse(JSON.stringify(compacter(window.KOUN, theme, m))) });
    } catch (e) { emettre({ type: 'ERROR', id: id, error: String(e.message || e) }); }
  });
  emettre({ type: 'READY', figures: window.KOUN.FIG.slice(), engineVersion: window.KOUN.version, available: true });
})(typeof window !== 'undefined' ? window : globalThis);
