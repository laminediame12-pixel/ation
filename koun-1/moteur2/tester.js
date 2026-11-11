// Test de bout en bout de l'atelier avec le moteur 2 (ouverture en fichier local).
// Usage : node tester.js <chemin absolu de koun-1-complet.html>
const { chromium } = require('playwright');
(async () => {
  const br = await chromium.launch(), p = await br.newPage({ viewport: { width: 1400, height: 1000 } }), err = [];
  p.on('pageerror', e => err.push(e.message)); p.on('console', m => { if (m.type() === 'error') err.push(m.text()); });
  await p.goto('file://' + process.argv[2]); await p.waitForSelector('text=Source vérifiée', { timeout: 20000 });
  const main = () => p.innerText('main');
  let t = await main(); console.log('VUE :', t.match(/Références concordantes[\s\S]{0,12}/)[0].replace(/\n/g, ' '), '|', t.match(/Cas sans arbitrage[\s\S]{0,60}/)[0].replace(/\n/g, ' '));
  console.log('ONGLETS :', (await p.$$eval('nav button', b => b.map(x => x.innerText.replace(/\n.*/s, '')))).join(' · '));
  await p.click('nav >> text=Références'); await p.click('button:has-text("Rejouer les")');
  await p.waitForFunction(() => /Calculs (effectués|et fiches)/.test(document.body.innerText), { timeout: 60000 });
  t = await main(); console.log('RÉFÉRENCES :', t.match(/\d+ \/ \d+ issues concordantes/)[0], '| badges :', (t.match(/Concordant|Aucun cas(?! applicable)|Écart/g) || []).join(' '));
  await p.click('nav >> text=Règles'); t = await main(); console.log('RÈGLES :', (t.match(/\b(S-0\d|CAS-\d+|P-0\d|REG-001|KREG-\d+)\b/g) || []).filter((v, i, a) => a.indexOf(v) === i).join(' '));
  await p.click('nav >> text=Tests & cas limites'); t = await main(); console.log('TESTS :', (t.match(/Conforme/g) || []).length, 'conformes ·', (t.match(/Bloqué/g) || []).length, 'sans verdict');
  for (const m of [['Tristitia', 'Tristitia', 'Albus', 'Fortuna Major'], ['Puer', 'Puer', 'Puer', 'Puer'], ['Via', 'Puella', 'Fortuna Major', 'Puella']]) {
    await p.click('nav >> text=Essayer un thème'); const s = await p.$$('.mothergrid select'); for (let i = 0; i < 4; i++) await s[i].selectOption(m[i]);
    await p.click('button:has-text("Calculer le thème")'); await p.waitForSelector('text=Fiche du duel');
    console.log('THÈME', m.join(' · '), '→', (await p.innerText('.runoutputs')).replace(/\n/g, ' | '), '||', (await p.innerText('.runreason')).slice(0, 140));
  }
  const fiche = await p.$$eval('section:has(h2:text("Fiche du duel")) tbody tr', r => r.length); console.log('FICHE DU DUEL :', fiche, 'lignes');
  await p.click('button:has-text("Enregistrer l’essai")'); await p.waitForTimeout(500);
  await p.click('nav >> text=Moteur intégré'); await p.waitForTimeout(1200);
  const fr = p.frames().find(f => f !== p.mainFrame() && f.url().startsWith('blob:')); console.log('MOTEUR INTÉGRÉ :', fr ? (await fr.innerText('body')).slice(0, 110).replace(/\n/g, ' | ') : 'cadre introuvable');
  console.log('ERREURS :', err.length ? err : 'aucune'); await br.close();
})();
