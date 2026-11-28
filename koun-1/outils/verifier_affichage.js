// Vérifie que koun.html affiche exactement ce que le moteur calcule : pour chaque thème (lot du 24 au 30 + 106 matchs connus + thèmes tirés),
// on ouvre la page avec ?theme=…, on lit les lignes du verdict et on compare avec moteur4/moteur.js :
//   Victoire, Équilibre, Deux marquent, R1 / R7 marque, Rouge ou penalty, Buts, 1re et 2e mi-temps (étiquettes) ;
//   l'explication de la victoire (raison du moteur, et la confirmation par la vérification) et le badge « ✔ Confirmée (vérification) » ;
//   les explications du marquage : la fréquence observée du niveau, et le signal « marquage fragile » exactement quand le moteur le donne ;
//   pour les 40 premiers thèmes, les « Maisons de calcul » : l'implication de chaque combinaison de la liste et ses remarques en rouge ;
//   et la pyramide : base et résultante de chaque maison (lues dans les points) et les maisons de R1 et R7.
// Deuxième passe, vue « thème somme » : les mêmes lignes doivent être celles que le moteur calcule sur le thème somme (M.themeSomme), avec le titre qui le dit.
const { chromium } = require('playwright'), fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const NUM = {}; for (let f = 1; f <= 16; f++) NUM[K.niveaux(f).join()] = f;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const T = new Set(); lire('validation/themes-25-30-novembre.json').forEach(x => T.add(x.theme));
lire('validation/scores-reels.json').forEach(x => T.add(x.themes.join('-'))); lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => T.add(x.theme.join('-')));
for (let i = 0; i < 100; i++) T.add([0, 1, 2, 3].map(() => 1 + Math.floor(Math.random() * 16)).join('-'));
(async () => { const b = await chromium.launch(), err = [], bilan = [];
  for (const somme of [false, true]) { const p = await b.newPage(); p.on('pageerror', x => err.push(x.message)); if (somme) await p.addInitScript(() => { try { localStorage.setItem('koun_vue', 'somme'); } catch (e) {} }); let ok = 0, ko = [], k = 0, calc = 0;
  for (const t0 of T) { k++; await p.goto('file://' + path.join(R, 'koun.html') + '?theme=' + t0 + '&e1=EQ1&e2=EQ2');
    const t = somme ? M.themeSomme(M.lire(t0.split('-').map(Number))).meres.join('-') : t0, titre = await p.evaluate(() => document.querySelector('#vd h2').textContent.trim());
    const aff = await p.evaluate(() => { const g = i => document.getElementById(i).textContent.trim(), c = document.getElementById('vVc');
      return { v: g('vVt'), e: g('vEt'), b: g('vBt'), m1: g('vM1t'), m7: g('vM7t'), bt: g('vTt'), r: g('vRt'), s: g('v2t'), i: g('vIt'), vs: document.getElementById('vVs').textContent, conf: c && !c.hidden ? c.textContent.trim() : '', m1s: document.getElementById('vM1s').textContent, m7s: document.getElementById('vM7s').textContent }; });
    const LL = M.lire(t.split('-').map(Number)), V = M.verdict(LL), att = V.decision.resultat === 'N' ? (V.decision.type === 'bloques' ? 'Égalité (pôles bloqués)' : V.decision.type === 'verification' ? 'Égalité (vérification)' : 'Égalité (n-n)') : 'Victoire ' + (V.decision.resultat === '1' ? 'EQ1' : 'EQ2');
    const H = M.hierarchie(LL), bm = H.deux.oui ? 'Oui' : 'Non', tg = X => X.impose ? (X.marque ? 'Marque' : 'Ne marque pas') : ({ assure: 'Marque (assuré)', marque: 'Marque', possible: 'Marque possible', non: 'Ne marque pas' })[X.propre.niveau], q1 = tg(H.R1), q7 = tg(H.R7);
    const nm = q => q === 'R1' ? 'EQ1' : 'EQ2', I = M.incidentVerdict(LL), r1 = H.mt1.butAttendu ? 'But : ' + (H.mt1.marqueurs.length ? H.mt1.marqueurs.map(nm).join(' et ') : 'équipe non déterminée') : 'Pas de but', r2 = H.mt2.marqueurs.length ? 'But : ' + H.mt2.marqueurs.map(nm).join(' et ') : 'Équipe non désignée', ri = (I.rouge.veto ? 'Pas de rouge' : I.rouge.niveau === 'probable' ? 'Rouge probable contre ' + nm(I.rouge.camp) : I.rouge.niveau === 'possible' ? 'Rouge possible contre ' + nm(I.rouge.camp) : 'Rouge peu probable') + ' · ' + (I.penalty.niveau === 'probable' ? 'Penalty probable pour ' + nm(I.penalty.camp) : I.penalty.niveau === 'possible' ? 'Penalty possible pour ' + nm(I.penalty.camp) : 'Penalty peu probable');
    const ecarts = [], veut = (nom, a, b2) => { if (a !== b2) ecarts.push(nom + ' : page « ' + String(a).slice(0, 90) + ' », moteur « ' + String(b2).slice(0, 90) + ' »'); };
    veut('titre', titre, somme ? 'Verdict du thème somme (' + t + ')' : 'Verdict'); veut('victoire', aff.v, att); veut('équilibre', aff.e, V.noyauTerre.phase); veut('deux marquent', aff.b, bm);
    veut('R1 marque', aff.m1, q1); veut('R7 marque', aff.m7, q7); veut('buts', aff.bt, '≈ ' + String(H.buts.valeur).replace('.', ',') + ' buts'); veut('1re mi-temps', aff.r, r1); veut('2e mi-temps', aff.s, r2); veut('incidents', aff.i, ri);
    veut('explication de la victoire', aff.vs, V.decision.raison + (V.decision.confirmee ? ' · ' + V.decision.confirmee.texte : '')); veut('badge confirmée', aff.conf, V.decision.confirmee ? '✔ Confirmée (vérification)' : '');
    [['R1', aff.m1s], ['R7', aff.m7s]].forEach(([q, s]) => { const P = H[q].propre; veut(q + ' : fréquence observée', s.includes(' · observé : ' + P.obs.oui + ' pôles sur ' + P.obs.sur + ' ont marqué dans ce cas'), true);
      veut(q + ' : marquage fragile', P.fragile ? s.includes(P.fragile.texte) : !s.includes('marquage fragile'), true); });
    if (k <= 40) { const cells = await p.evaluate(() => [...document.querySelectorAll('#py .ht')].map(c => { const lv = pt => pt ? [...pt.querySelectorAll(':scope > i')].map(i => i.querySelectorAll('b').length).join() : null;
        return { h: +c.getAttribute('data-h'), b: lv(c.querySelector(':scope > .dd > .pt')), r: lv(c.querySelector(':scope > .rs > .dd > .pt')), p1: c.classList.contains('p1'), p7: c.classList.contains('p7') }; }));
      veut('pyramide : nombre de maisons', cells.length, 16); cells.forEach(c => { veut('pyramide M' + c.h + ' base', NUM[c.b], LL.theme.bases[c.h]); veut('pyramide M' + c.h + ' résultante', NUM[c.r], c.h === 16 ? LL.theme.bases[16] : LL.theme.resultantes[c.h]); veut('pyramide M' + c.h + ' pôles', (c.p1 ? 'R1' : '') + (c.p7 ? 'R7' : ''), (LL.R1.maison === c.h ? 'R1' : '') + (LL.R7.maison === c.h ? 'R7' : '')); }); }
    if (k <= 40) { calc++; const imp = await p.evaluate(() => { document.getElementById('calc').open = true; const out = [];
        document.querySelectorAll('#cPre button.imp').forEach(bt => { bt.click(); const x = document.querySelector('#cOut .res.imp .t'), n = document.querySelector('#cOut .res.imp .sm[style*="d92d20"]'); out.push({ t: x ? x.textContent : '', n: n ? n.textContent : '' }); }); return out; });
      M.combinaisonsListe().forEach((c, i) => { const r = M.lectureCombinaison(LL, c.maisons); veut('implication ' + c.maisons.join('-'), (imp[i] || {}).t, 'Implication (' + c.nom + ') : ' + r.implication); veut('remarques ' + c.maisons.join('-'), (imp[i] || {}).n, r.notes.join(' · ')); }); }
    if (!ecarts.length) ok++; else ko.push(t0 + (somme ? ' (somme ' + t + ')' : '') + ' → ' + ecarts.join(' ; ')); }
  bilan.push(ko.length); console.log((somme ? 'vue thème somme · ' : 'vue principale · ') + T.size + ' thèmes (dont ' + calc + ' avec les maisons de calcul) : ' + ok + ' identiques, ' + ko.length + ' différents' + (ko.length ? '\n  ' + ko.slice(0, 10).join('\n  ') : '')); await p.close(); }
  console.log('erreurs de page : ' + (err.length ? err.slice(0, 3) : 'aucune'));
  await b.close(); process.exit(bilan.some(x => x) || err.length ? 1 : 0); })();
