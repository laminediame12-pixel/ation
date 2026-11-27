// Audit logique de la page : les lignes affichées se contredisent-elles ? (147 thèmes du lot du 24 au 30 + 126 thèmes connus)
// Lignes lues dans la page même (Playwright), pas dans le moteur, pour auditer ce que voit le propriétaire.
const { chromium } = require('playwright'), fs = require('fs'), path = require('path'), R = path.join(__dirname, '..');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const T = new Set(); lire('validation/themes-25-30-novembre.json').forEach(x => T.add(x.theme));
lire('validation/scores-reels.json').forEach(x => T.add(x.themes.join('-'))); ['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => T.add(x.theme.join('-'))));
(async () => { const b = await chromium.launch(), p = await b.newPage(); const c = {}, ex = {}, n = T.size; const k = (nom, t) => { c[nom] = (c[nom] || 0) + 1; ex[nom] = ex[nom] || t; };
  for (const t of T) { await p.goto('file://' + path.join(R, 'koun.html') + '?theme=' + t + '&e1=EQ1&e2=EQ2');
    const v = await p.evaluate(() => { const g = i => (document.getElementById(i) || {}).textContent || ''; return { vic: g('vVt').trim(), m1: g('vM1t').trim(), m7: g('vM7t').trim(), deux: g('vBt').trim(), buts: g('vTt').trim(), mt1: g('vRt').trim(), mt2: g('v2t').trim() }; });
    const m1 = v.m1 === 'Marque', m7 = v.m7 === 'Marque', buts = parseFloat((v.buts.match(/[\d,]+/) || ['0'])[0].replace(',', '.'));
    if (v.vic === 'Victoire EQ1' && !m1) k('Victoire R1 alors que R1 « ne marque pas »', t);
    if (v.vic === 'Victoire EQ2' && !m7) k('Victoire R7 alors que R7 « ne marque pas »', t);
    if (v.vic === 'Nul' && m1 !== m7) k('Nul alors qu\'un seul pôle marque', t);
    if (v.deux === 'Oui' && !(m1 && m7)) k('« Deux marquent : Oui » alors qu\'un pôle au moins « ne marque pas »', t);
    if (v.deux === 'Non' && m1 && m7) k('« Deux marquent : Non » alors que les deux pôles marquent', t);
    if (!m1 && !m7 && buts >= 1) k('Buts ≥ 1 alors qu\'aucun pôle ne marque', t);
    if ((m1 && m7) && buts < 2) k('Moins de 2 buts alors que les deux pôles marquent', t);
    if (/EQ1/.test(v.mt1 + v.mt2) && !m1) k('Mi-temps : but annoncé pour R1 qui « ne marque pas »', t);
    if (/EQ2/.test(v.mt1 + v.mt2) && !m7) k('Mi-temps : but annoncé pour R7 qui « ne marque pas »', t);
  }
  console.log(n + ' thèmes audités\n'); Object.entries(c).sort((a, b) => b[1] - a[1]).forEach(([nom, x]) => console.log('  ' + String(x).padStart(3) + ' (' + Math.round(100 * x / n) + ' %)  ' + nom + '   ex. ' + ex[nom]));
  await b.close(); })();
