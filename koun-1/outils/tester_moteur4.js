// Équivalence du moteur 4 avec le moteur gelé : sur les 65 536 thèmes, verdict identique quand le principe du gelé est VA-1, MF-2 ou MF-3 ; sinon le moteur 4 s'abstient.
var K3 = require('../moteur3/moteur.js'), K4 = require('../moteur4/moteur.js'), N = require('../moteur3/noyau.js');
var ok = 0, mauvais = [], stats = {}, abst = 0, tot = 0;
for (var a = 1; a <= 16; a++) for (var b = 1; b <= 16; b++) for (var c = 1; c <= 16; c++) for (var d = 1; d <= 16; d++) {
  tot++;
  var m = [a, b, c, d], old = K3.verdict(K3.lire(K3.construireTheme(N.nom(a), N.nom(b), N.nom(c), N.nom(d))));
  var nw = K4.verdict(K4.lire(m)), mine = ['VA-1', 'MF-2', 'MF-3'].indexOf(old.principe) >= 0;
  if (mine) { stats[old.principe] = (stats[old.principe] || 0) + 1; if (nw.verdict === old.verdict && nw.principe === old.principe) ok++; else mauvais.push([m, old.principe, old.verdict, nw.principe, nw.verdict]); }
  else { if (nw.verdict === null) abst++; else mauvais.push([m, old.principe, old.verdict, nw.principe, nw.verdict]); }
}
console.log('thèmes', tot, '| identiques sur principes posés', ok, JSON.stringify(stats), '| abstentions', abst, '| écarts', mauvais.length);
mauvais.slice(0, 5).forEach(function (x) { console.log(JSON.stringify(x)); });
// FI-5 : même validation que le gelé, sur tous les thèmes et tous les jours (et sans jour)
var bad = 0, t5 = 0;
for (var a = 1; a <= 16; a++) for (var b = 1; b <= 16; b++) for (var c = 1; c <= 16; c++) for (var d = 1; d <= 16; d++) {
  var L3 = K3.lire(K3.construireTheme(N.nom(a), N.nom(b), N.nom(c), N.nom(d))), L4 = K4.lire([a, b, c, d]);
  for (var j = -1; j < 7; j++) { t5++; var o = K3.fiabilite(L3, j < 0 ? undefined : j), n = K4.fiabilite(L4, j < 0 ? undefined : j); if (o.niveau !== n.niveau || o.valide !== n.valide) bad++; }
}
console.log('FI-5 :', t5, 'lectures,', bad, 'écart(s)');
process.exit(mauvais.length || bad ? 1 : 0);
