// Évalue les moteurs sur un lot de validation (fichier d'export des thèmes sauvegardés : mVecs, score, t1, t2).
// Usage : node outils/evaluer.js validation/lot-1.json [--pages]   (--pages ajoute les pages HTML, via Playwright)
// Règle : un lot de validation n'est jamais utilisé pour ajuster un cas. On l'évalue, on le range, et on le garde.
const fs = require('fs'), path = require('path');
const K = require('../moteur2/moteur.js');
const lot = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const NUM = { '1,1,0,1': 1, '1,0,0,0': 2, '0,1,1,1': 3, '0,0,1,0': 4, '1,1,1,1': 5, '1,0,1,0': 6, '0,1,0,0': 7, '0,0,0,1': 8, '1,1,0,0': 9, '1,0,0,1': 10, '0,1,1,0': 11, '0,0,1,1': 12, '1,1,1,0': 13, '1,0,1,1': 14, '0,1,0,1': 15, '0,0,0,0': 16 };
const issue = e => { const m = String(e.score).match(/(\d+)\s*-\s*(\d+)/); return !m ? null : +m[1] > +m[2] ? '1' : +m[1] < +m[2] ? '2' : 'N'; };
const lab = (x, e) => x === '1' ? 'victoire ' + e.t1.trim() : x === '2' ? 'victoire ' + e.t2.trim() : x === 'N' ? 'nul' : 'aucun cas';
const rows = lot.filter(e => issue(e)).map(e => {
  const m = e.mVecs.map(v => NUM[v]), d = K.analyser(K.construireTheme(...m.map(K.fig))).decision;
  return { e, m, reel: issue(e), moteur2: d.verdict, cas: d.phase, prec: d.precision && d.precision.niveau };
});
const n = rows.length, pc = (a, b) => a + '/' + b + ' (' + Math.round(100 * a / b) + ' %)';
const res = { 'Moteur 2 seul (aucun cas = raté)': rows.filter(r => r.moteur2 === r.reel).length, 'Toujours R1 (première équipe)': rows.filter(r => r.reel === '1').length };
let pages = null;
if (process.argv.includes('--pages')) {
  const { chromium } = require('playwright');
  (async () => {
    const b = await chromium.launch(); pages = {};
    for (const [nom, f] of [['3.0.0 d’origine', '/root/.claude/uploads/d3a237ba-1a6d-5665-af64-ff99050d9043/aa729acf-koun-moteur-3.0.0-complet-2.html'], ['page actuelle (Moteur 2 puis repli 3.0.0)', path.resolve(__dirname, '../koun-moteur-3.0.0.html')]]) {
      if (!fs.existsSync(f)) continue;
      const p = await b.newPage(); await p.goto('file://' + f); await p.fill('#team1Input', 'AAA'); await p.fill('#team2Input', 'BBB'); let ok = 0;
      for (const r of rows) { const t = await p.evaluate(v => { document.getElementById('quickNumbers').value = v; parseQuickNumbers(); return document.getElementById('winnerText').textContent.trim(); }, r.m.join('-')); const v = /nul/i.test(t) ? 'N' : /AAA/.test(t) ? '1' : '2'; if (v === r.reel) ok++; }
      pages[nom] = ok; await p.close();
    }
    await b.close(); sortie();
  })();
} else sortie();
function sortie() {
  console.log('Lot :', process.argv[2], '—', n, 'thèmes avec score');
  rows.forEach(r => console.log((r.moteur2 === r.reel ? '✓' : '✗'), r.m.join('·').padEnd(11), (r.e.t1.trim() + ' – ' + r.e.t2.trim()).padEnd(38), String(r.e.score).padEnd(4), 'réel :', lab(r.reel, r.e).padEnd(26), 'moteur 2 :', lab(r.moteur2, r.e).padEnd(26), r.cas));
  console.log('\nRésultats');
  for (const k in res) console.log(' ', k.padEnd(48), pc(res[k], n));
  if (pages) for (const k in pages) console.log(' ', k.padEnd(48), pc(pages[k], n));
  const par = {}; rows.forEach(r => { par[r.cas] = par[r.cas] || [0, 0]; par[r.cas][1]++; if (r.moteur2 === r.reel) par[r.cas][0]++; });
  console.log('\nPar cas du Moteur 2 (lecture seule, jamais pour ajuster) :', Object.entries(par).map(([c, v]) => c + ' ' + v[0] + '/' + v[1]).join(' · '));
}
