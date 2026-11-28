// Liste des thèmes qui restent dans l'archive (matchs sans résultat, à partir du 28 novembre) avec leurs verdicts, en page HTML (demande du propriétaire, 2026-11-28).
// Chaque ligne du verdict est lue dans koun.html même (Playwright, ?theme=…&e1=…&e2=…) : la liste montre exactement ce que la page affiche.
// En vert, les actions inévitables (observées au moins 9 fois sur 10, verdict compris), calculées par le moteur :
//   but en 1re mi-temps (M1+M5+M12+M15, ligne de 1re mi-temps du verdict) ; pôle désigné seul par M3+M7+M11 que le verdict fait marquer ;
//   pas de rouge (veto du moteur) ; pas de nul (M1+M7+M15+M16, but attendu, verdict sans égalité).
// En orange, une combinaison qui dit autre chose que le verdict. Usage : node outils/liste_archive.js → validation/verdicts-archive.html
const { chromium } = require('playwright'), fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), AUJ = '2026-11-28', SORTIE = path.join(R, 'validation/verdicts-archive.html');
// résultats connus (thème et date) : un match connu n'est plus « restant »
const connus = new Set(); lire('validation/scores-reels.json').forEach(x => connus.add(x.themes.join('-') + '|' + x.date));
['validation/resultats-2026-11-25.json', 'validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => connus.add(x.theme.join('-') + '|' + x.date)));
const reste = lire('validation/themes-25-30-novembre.json').filter(x => x.date >= AUJ && !connus.has(x.theme + '|' + x.date));
// taux observés des actions inévitables (161 matchs au 2026-11-28, Real Salt Lake – Vancouver compris ; verdict compris ; recalculés par outils/combinaisons_inevitables.js et le moteur)
const TAUX = { mt1: '21 sur 23', m3711: '64 sur 69', rouge: '40 sur 42', nul: '60 sur 65' };
const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
(async () => { const b = await chromium.launch(), p = await b.newPage(), err = []; p.on('pageerror', e => err.push(e.message));
  const L = [];
  for (const x of reste) {
    await p.goto('file://' + path.join(R, 'koun.html') + '?theme=' + x.theme + '&e1=' + encodeURIComponent(x.equipe1) + '&e2=' + encodeURIComponent(x.equipe2));
    const aff = await p.evaluate(() => { const g = k => document.getElementById(k + 't').textContent.trim(), c = document.getElementById('vVc'); return { conf: c && !c.hidden ? c.textContent.trim() : '', v: g('vV'), deux: g('vB'), m1: g('vM1'), m7: g('vM7'), inc: g('vI'), buts: g('vT'), mt1: g('vR'), mt2: g('v2'), eq: g('vE') }; });
    const T = M.lire(x.theme.split('-').map(Number)), H = M.hierarchie(T), V = M.verdict(T), I = M.incidentVerdict(T), a = M.lectureCombinaison(T, [3, 7, 11]), c = M.lectureCombinaison(T, [1, 7, 15, 16]);
    const nom = q => q === 'R1' ? x.equipe1 : x.equipe2, d = V.decision.resultat;
    const vert = { mt1: H.mt1.butAttendu, m1: a.designeSeul === 'R1' && H.R1.marque, m7: a.designeSeul === 'R7' && H.R7.marque, rouge: I.rouge.veto, nul: c.attendu && d !== 'N' };
    const orange = []; if (a.designeSeul && !H[a.designeSeul].marque) orange.push('M3+M7+M11 désigne ' + nom(a.designeSeul) + ' seul : il marquerait, le verdict dit non');
    if (c.attendu && d === 'N') orange.push('M1+M7+M15+M16 : pas de nul, le verdict dit égalité');
    L.push({ x, aff, d, vert, orange }); }
  await b.close();
  if (err.length) { console.log('erreurs de page : ' + err.slice(0, 3).join(' / ')); process.exit(1); }
  // page
  const n = k => L.filter(k).length, jours = [...new Set(L.map(y => y.x.date))];
  const ligne = (lab, val, cls, note) => '<li class="' + (cls || '') + '"><span class="lab">' + esc(lab) + '</span><span class="val">' + esc(val) + (note ? ' <small>' + esc(note) + '</small>' : '') + '</span></li>';
  const carte = y => { const x = y.x, A = y.aff, inc = A.inc.split(' · '), clsV = y.d === '1' ? 'r1' : y.d === '2' ? 'r7' : 'eg';
    let h = '<article class="m"><header><span class="ch">' + esc(x.championnat) + '</span><b>' + esc(x.equipe1) + ' – ' + esc(x.equipe2) + '</b><span class="th">' + esc(x.theme) + '</span></header><ul>';
    h += ligne('🏆 Verdict', A.v + (A.conf ? ' · ' + A.conf : ''), 'v ' + clsV, A.conf ? 'les deux thèmes du cycle de vérification l\'annoncent : 19 victoires sur 22' : '');
    h += ligne('⚽ ' + x.equipe1 + ' (R1) marque', A.m1, y.vert.m1 ? 'vert' : '', y.vert.m1 ? 'M3+M7+M11 · ' + TAUX.m3711 : '');
    h += ligne('⚽ ' + x.equipe2 + ' (R7) marque', A.m7, y.vert.m7 ? 'vert' : '', y.vert.m7 ? 'M3+M7+M11 · ' + TAUX.m3711 : '');
    h += ligne('⚽ Deux marquent', A.deux);
    h += ligne('🥅 Buts au total', A.buts);
    h += ligne('⏱️ 1re mi-temps', A.mt1, y.vert.mt1 ? 'vert' : '', y.vert.mt1 ? 'M1+M5+M12+M15 · ' + TAUX.mt1 : '');
    h += ligne('⏱️ 2e mi-temps', A.mt2);
    h += ligne('🟥 Rouge', inc[0], y.vert.rouge ? 'vert' : '', y.vert.rouge ? 'veto · ' + TAUX.rouge + ' sans rouge' : '');
    if (inc[1]) h += ligne('⚠ Penalty', inc[1]);
    if (y.vert.nul) h += ligne('🤝 Nul', 'Pas de nul', 'vert', 'M1+M7+M15+M16 · ' + TAUX.nul + ' sans nul');
    h += ligne('⚖ Équilibre', A.eq);
    y.orange.forEach(o => { h += ligne('◐ À juger', o, 'orange'); });
    return h + '</ul></article>'; };
  const css = ':root{--bg:#f6f7f9;--card:#fff;--tx:#111827;--mut:#6b7280;--ln:#e5e7eb;--r1:#1d4ed8;--r7:#b91c1c;--eg:#4b5563;--vert:#15803d;--vertbg:#dcfce7;--or:#b45309;--orbg:#fef3c7}'
    + '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b0f14;--card:#121821;--tx:#e5e7eb;--mut:#9ca3af;--ln:#243041;--r1:#60a5fa;--r7:#f87171;--eg:#cbd5e1;--vert:#4ade80;--vertbg:#0f2e1c;--or:#fbbf24;--orbg:#3a2a0c}}'
    + ':root[data-theme="dark"]{--bg:#0b0f14;--card:#121821;--tx:#e5e7eb;--mut:#9ca3af;--ln:#243041;--r1:#60a5fa;--r7:#f87171;--eg:#cbd5e1;--vert:#4ade80;--vertbg:#0f2e1c;--or:#fbbf24;--orbg:#3a2a0c}'
    + '*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--tx);font:14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}main{max-width:860px;margin:0 auto;padding:16px}'
    + 'h1{font-size:20px;margin:4px 0 2px}h2{font-size:16px;margin:22px 0 8px;color:var(--mut)}p.s{color:var(--mut);margin:2px 0 10px}'
    + '.bilan,.leg{background:var(--card);border:1px solid var(--ln);border-radius:12px;padding:10px 12px;margin:10px 0}.bilan b{font-variant-numeric:tabular-nums}.leg ul{margin:6px 0 0;padding-left:18px}.leg li{margin:2px 0}'
    + '.pas{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}'
    + '.m{background:var(--card);border:1px solid var(--ln);border-radius:12px;margin:10px 0;overflow:hidden}.m header{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline;padding:9px 12px;border-bottom:1px solid var(--ln)}'
    + '.m header b{font-size:15px}.ch{color:var(--mut);font-size:12px}.th{margin-left:auto;color:var(--mut);font-size:12px;font-variant-numeric:tabular-nums}'
    + '.m ul{list-style:none;margin:0;padding:4px 0}.m li{display:flex;gap:10px;padding:4px 12px;border-left:4px solid transparent}.lab{flex:0 0 42%;color:var(--mut);min-width:0;overflow-wrap:anywhere}.val{flex:1;min-width:0;overflow-wrap:anywhere}'
    + '.val small{display:block;color:inherit;opacity:.8;font-size:11px}.v .val{font-weight:700}.v.r1 .val{color:var(--r1)}.v.r7 .val{color:var(--r7)}.v.eg .val{color:var(--eg)}'
    + '.vert{background:var(--vertbg);border-left-color:var(--vert)}.vert .val,.vert .lab{color:var(--vert);font-weight:700}.orange{background:var(--orbg);border-left-color:var(--or)}.orange .val,.orange .lab{color:var(--or)}'
    + '@media (max-width:520px){.m li{flex-direction:column;gap:0}.lab{flex:none;font-size:12px}}';
  const parJour = j => L.filter(y => y.x.date === j);
  const bilan = '<div class="bilan"><b>' + L.length + '</b> thèmes restants · verdicts : <b style="color:var(--r1)">' + n(y => y.d === '1') + '</b> victoires R1, <b style="color:var(--r7)">' + n(y => y.d === '2') + '</b> victoires R7, <b>' + n(y => y.d === 'N') + '</b> égalités'
    + '<br>Actions inévitables : <b style="color:var(--vert)">' + n(y => y.vert.mt1) + '</b> buts en 1re mi-temps · <b style="color:var(--vert)">' + n(y => y.vert.m1 || y.vert.m7) + '</b> pôles qui marquent (M3+M7+M11) · <b style="color:var(--vert)">' + n(y => y.vert.rouge) + '</b> sans rouge · <b style="color:var(--vert)">' + n(y => y.vert.nul) + '</b> sans nul'
    + '<br>À juger (combinaison contre verdict) : <b style="color:var(--or)">' + L.reduce((s, y) => s + y.orange.length, 0) + '</b></div>';
  const leg = '<div class="leg"><b><span class="pas" style="background:var(--vert)"></span>En vert, les actions inévitables</b> (observées au moins 9 fois sur 10, verdict compris) :<ul>'
    + '<li>But en 1re mi-temps : M1+M5+M12+M15, but attendu et un pôle qui marque — ' + TAUX.mt1 + ' matchs à mi-temps connue.</li>'
    + '<li>Pôle qui marque : désigné seul par M3+M7+M11 et que le verdict fait marquer — ' + TAUX.m3711 + '.</li>'
    + '<li>Pas de rouge : veto du moteur (le front de R7 attaque celui de R1, ou Albus / Puella sur M9-M15) — ' + TAUX.rouge + ' sans rouge.</li>'
    + '<li>Pas de nul : M1+M7+M15+M16, but attendu, verdict sans égalité — ' + TAUX.nul + ' sans nul.</li></ul>'
    + '<p class="s" style="margin-top:6px"><span class="pas" style="background:var(--or)"></span>En orange, une combinaison qui dit autre chose que le verdict. Verdict : <b style="color:var(--r1)">bleu R1</b>, <b style="color:var(--r7)">rouge R7</b>, gris égalité. Ces taux viennent des matchs déjà joués : rien n\'est sûr à 100 %.</p></div>';
  const html = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verdicts de l\'archive</title><style>' + css + '</style></head><body><main>'
    + '<h1>Verdicts de l\'archive</h1><p class="s">Thèmes qui restent (matchs du ' + (+jours[0].slice(8)) + ' au ' + (+jours[jours.length - 1].slice(8)) + ' novembre) · lignes lues dans koun.html, combinaisons calculées par le moteur · généré le ' + AUJ + '</p>'
    + bilan + leg + jours.map(j => '<h2>' + esc(parJour(j)[0].x.jour + ' ' + (+j.slice(8)) + ' novembre') + ' · ' + parJour(j).length + ' matchs</h2>' + parJour(j).map(carte).join('')).join('') + '</main></body></html>';
  fs.writeFileSync(SORTIE, html);
  console.log(L.length + ' thèmes restants → ' + path.relative(R, SORTIE) + ' · R1 ' + n(y => y.d === '1') + ', R7 ' + n(y => y.d === '2') + ', égalités ' + n(y => y.d === 'N') + ' · verts : 1re mi-temps ' + n(y => y.vert.mt1) + ', marque ' + n(y => y.vert.m1 || y.vert.m7) + ', sans rouge ' + n(y => y.vert.rouge) + ', sans nul ' + n(y => y.vert.nul) + ' · orange ' + L.reduce((s, y) => s + y.orange.length, 0));
})();
