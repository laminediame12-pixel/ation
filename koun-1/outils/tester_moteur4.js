// Le moteur 4 lit sans prédire. Contrôle sur les 65 536 thèmes contre l'implémentation indépendante du moteur 3 : pôles, mode, lien, équilibre, FI-5 (avec et sans jour).
var K3 = require('../moteur3/moteur.js'), K4 = require('../moteur4/moteur.js'), N = require('../moteur3/noyau.js');
var bad = {}, t = 0, add = function (k) { bad[k] = (bad[k] || 0) + 1; };
for (var a = 1; a <= 16; a++) for (var b = 1; b <= 16; b++) for (var c = 1; c <= 16; c++) for (var d = 1; d <= 16; d++) {
  t++; var L3 = K3.lire(K3.construireTheme(N.nom(a), N.nom(b), N.nom(c), N.nom(d))), L4 = K4.lire([a, b, c, d]);
  if (K3.num(L3.R1.figure) !== L4.R1.figure || K3.num(L3.R7.figure) !== L4.R7.figure || L3.R1.maison !== L4.R1.maison) add('pôles');
  if (L3.mode !== L4.mode) add('mode');
  if (L3.lien.numero !== L4.lien) add('lien');
  var e3 = K3.equilibre(L3), e4 = K4.equilibre(L4); if (e3.ecartBase !== e4.ecartBase || e3.ecartRes !== e4.ecartRes) add('équilibre');
  for (var h = 1; h <= 16; h++) if (L3.maisons[h - 1].base !== N.nom(L4.base(h)) || (h < 16 && L3.maisons[h - 1].resultante !== N.nom(L4.resu(h)))) { add('maisons'); break; }
  for (var j = -1; j < 7; j++) { var o = K3.fiabilite(L3, j < 0 ? undefined : j), n = K4.fiabilite(L4, j < 0 ? undefined : j); if (o.niveau !== n.niveau || o.valide !== n.valide) add('FI-5'); }
}
console.log(t, 'thèmes ; écarts :', JSON.stringify(bad));
process.exit(Object.keys(bad).length ? 1 : 0);
