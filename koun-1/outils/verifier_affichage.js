// Vérifie que koun.html affiche exactement ce que le moteur calcule : pour chaque thème (lot du 24 au 30 + 106 matchs connus + thèmes tirés),
// on ouvre la page avec ?theme=…, on lit les lignes Victoire, Équilibre et Deux marquent, et on compare avec moteur4/moteur.js (V.decision, V.noyauTerre).
const { chromium } = require('playwright'), fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const T = new Set(); lire('validation/themes-25-30-novembre.json').forEach(x => T.add(x.theme));
lire('validation/scores-reels.json').forEach(x => T.add(x.themes.join('-'))); lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => T.add(x.theme.join('-')));
for (let i = 0; i < 100; i++) T.add([0, 1, 2, 3].map(() => 1 + Math.floor(Math.random() * 16)).join('-'));
(async () => { const b = await chromium.launch(), p = await b.newPage(), err = []; p.on('pageerror', x => err.push(x.message)); let ok = 0, ko = [];
  for (const t of T) { await p.goto('file://' + path.join(R, 'koun.html') + '?theme=' + t + '&e1=EQ1&e2=EQ2');
    const aff = await p.evaluate(() => ({ v: document.getElementById('vVt').textContent.trim(), e: document.getElementById('vEt').textContent.trim(), b: document.getElementById('vBt').textContent.trim(), m1: document.getElementById('vM1t').textContent.trim(), m7: document.getElementById('vM7t').textContent.trim(), bt: document.getElementById('vTt').textContent.trim() }));
    const V = M.verdict(M.lire(t.split('-').map(Number))), att = V.decision.resultat === 'N' ? 'Nul' : 'Victoire ' + (V.decision.resultat === '1' ? 'EQ1' : 'EQ2');
    const LL = M.lire(t.split('-').map(Number)), bm = ((M.marquePole(LL, 'R1').marque && M.marquePole(LL, 'R7').marque) || M.butsEstimes(LL).m11Plein) ? 'Oui' : 'Non', q1 = M.marquePole(LL, 'R1').marque ? 'Marque' : 'Ne marque pas', q7 = M.marquePole(LL, 'R7').marque ? 'Marque' : 'Ne marque pas';
    if (aff.v === att && aff.e === V.noyauTerre.phase && aff.b === bm && aff.m1 === q1 && aff.m7 === q7 && aff.bt === '≈ ' + String(M.butsEstimes(LL).attendus).replace('.', ',') + ' buts') ok++; else ko.push(t + ' : page « ' + aff.v + ' / ' + aff.e + ' / ' + aff.b + ' », moteur « ' + att + ' / ' + V.noyauTerre.phase + ' / ' + bm + ' »'); }
  console.log(T.size + ' thèmes : ' + ok + ' identiques, ' + ko.length + ' différents' + (ko.length ? '\n  ' + ko.slice(0, 10).join('\n  ') : '') + ' · erreurs de page : ' + (err.length ? err.slice(0, 3) : 'aucune'));
  await b.close(); process.exit(ko.length || err.length ? 1 : 0); })();
