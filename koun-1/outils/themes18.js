// Les 18 thèmes de travail : matchs réels avec score, thème fiable ou moyen (FI-1). Les autres thèmes sont mis de côté.
const fs = require('fs'), path = require('path');
const K3 = require('../moteur3/moteur.js');
const sc = JSON.parse(fs.readFileSync(path.join(__dirname, '../validation/scores-reels.json'), 'utf8'));
// La liste des 18 est figée dans validation/themes-18.json (choisie avec l'ancienne validation FI-1, avant le passage à FI-2).
const liste = JSON.parse(fs.readFileSync(path.join(__dirname, '../validation/themes-18.json'), 'utf8')).map(x => x.match);
const rows = sc.filter(e => liste.indexOf(e.match) >= 0).map(e => { const th = K3.construireTheme(...e.themes.map(K3.fig)); const L = K3.lire(th); return { e, fi: K3.fiabilite(L), r: K3.analyser(th) }; });
let v = 0, b = 0, o35 = 0, o25 = 0, o15 = 0;
rows.forEach(x => {
  const [a, c] = x.e.score, reel = a > c ? '1' : a < c ? '2' : 'N', T = a + c;
  const ok = x.r.verdict.verdict === reel; if (ok) v++;
  if (x.r.buts.deuxMarquent.oui === (a > 0 && c > 0)) b++;
  if (x.r.buts.overUnder.over15 === (T > 1.5)) o15++; if (x.r.buts.overUnder.over25 === (T > 2.5)) o25++; if (x.r.buts.overUnder.over35 === (T > 3.5)) o35++;
  console.log(x.e.match.slice(0, 32).padEnd(32), x.e.score.join('-').padEnd(4), x.fi.libelle.padEnd(7), 'moteur', x.r.verdict.verdict, x.r.verdict.principe.padEnd(5), ok ? '✓' : '✗', 'score prévu', x.r.buts.score);
});
const n = rows.length;
console.log('\n' + n + ' thèmes : verdict ' + v + '/' + n + ' | Deux marquent ' + b + '/' + n + ' | Over/Under 1,5 : ' + o15 + ', 2,5 : ' + o25 + ', 3,5 : ' + o35);
