// Vérifie le noyau structurel (moteur3/noyau.js) contre le moteur gelé et contre les invariants. Usage : node outils/tester_noyau.js
const K = require('../moteur3/moteur.js'), N = require('../moteur3/noyau.js');
const verifs = []; const ok = (n, c, d) => verifs.push([n, !!c, d || '']);
const themes = [];
for (let q = 0; q < 65536; q++) themes.push([q & 15, (q >> 4) & 15, (q >> 8) & 15, (q >> 12) & 15].map(x => x + 1));

// 1. le noyau reconstruit exactement ce que calcule le moteur gelé
let egal = true, poles = true, derives = true;
themes.forEach(m => {
  const L = K.lire(K.construireTheme(...m.map(K.fig))), T = N.construire(m);
  for (let h = 1; h <= 16; h++) { const mm = L.maisons[h - 1]; if (K.num(mm.base) !== T.bases[h]) egal = false; if (K.num(mm.resultante || mm.base) !== T.resultantes[h]) egal = false; }
  const P = N.poles(T); if (L.R1.maison !== P.R1.maison || K.num(L.R1.figure) !== P.R1.figure || L.R7.maison !== P.R7.maison || K.num(L.R7.figure) !== P.R7.figure) poles = false;
  [['R1', P.R1], ['R7', P.R7]].forEach(([c, p]) => { const o = L[c]; if (o.front !== N.front(p.figure) || K.num(o.antagoniste) !== N.antagoniste(p.figure) || K.num(o.miroir) !== N.miroir(p.figure)) derives = false; });
});
ok('construire : bases et résultantes identiques à celles du moteur gelé sur les 65 536 thèmes', egal);
ok('poles : maisons et figures de R1 et R7 identiques à celles du moteur', poles);
ok('front, antagoniste et miroir (addition de Tristitia) identiques à ceux du moteur pour les figures des pôles', derives);
ok('binôme = couples symétriques 1-3, 2-4, 5-7, 6-8, 9-11, 10-12, 13-15, 14-16 (addition de Amissio ou de Puella)', [...Array(16).keys()].every(i => N.binome(i + 1) === ((i % 4 < 2) ? i + 3 : i - 1)));

// 2. le vérificateur accepte tous les thèmes et rejette toute altération
let acceptes = 0, sansLoi = 0; themes.forEach(m => { const T = N.construire(m), v = N.verifier(T.bases); if (v.valide) acceptes++; if (N.verifierLois(T.bases).length === 0) sansLoi++; });
ok('verifier : accepte les 65 536 thèmes, et aucune des 48 lois n\'est violée', acceptes === 65536 && sansLoi === 65536);
let rejets = 0, nommes = 0, essais = 0, graine = 12345; const alea = n => { graine = (graine + 0x6D2B79F5) | 0; let t = Math.imul(graine ^ (graine >>> 15), 1 | graine); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * n); };   // mulberry32, graine fixe
for (let i = 0; i < 40000; i++) { const T = N.construire(themes[alea(65536)]), b = T.bases.slice(), h = 1 + alea(16); let f = 1 + alea(16); if (f === b[h]) continue; b[h] = f; essais++; const v = N.verifier(b); if (!v.valide) rejets++; if (v.lois.length > 0) nommes++; }
ok('verifier : rejette ' + essais + ' thèmes dont une seule maison est altérée (' + rejets + ' rejetés) et nomme au moins une loi violée (' + nommes + ')', rejets === essais && nommes === essais);
ok('verifier : M15 impaire est rejetée (le Juge est toujours pair)', (() => { const T = N.construire([1, 2, 3, 4]), b = T.bases.slice(); b[15] = 2; return !N.verifier(b).valide; })());

// 3. la déduction : 55 ensembles de 4 maisons déterminent le thème, les autres non ; les niveaux imposés sont exacts
let generateurs = 0, bonnes = true, imposesExacts = true;
const sets = []; for (let a = 1; a <= 16; a++) for (let b = a + 1; b <= 16; b++) for (let c = b + 1; c <= 16; c++) for (let d = c + 1; d <= 16; d++) sets.push([a, b, c, d]);
sets.forEach(s => {
  const T = N.construire(themes[alea(65536)]), connus = {}; s.forEach(h => { connus[h] = T.bases[h]; });
  const r = N.deduire(connus); if (!r.coherent) bonnes = false;
  if (r.determine) { generateurs++; if (r.theme.bases.slice(1).join() !== T.bases.slice(1).join()) bonnes = false; }
  r.imposes.forEach(x => { const l = N.NIVEAUX.indexOf(x.niveau); if (N.niveaux(T.bases[x.maison])[l] !== x.points) imposesExacts = false; });
});
ok('deduire : exactement 55 des 1 820 ensembles de 4 maisons déterminent le thème, qui est alors reconstruit exactement', generateurs === 55 && bonnes);
ok('deduire : tous les niveaux imposés ailleurs sont exacts', imposesExacts);
// 4. les ensembles de placements possibles (mêmes effectifs que les invariants)
const familles = { 'antagoniste ancré chez la victime (base = h−3)': [h => N.antagoniste(h), 841], 'figure chez son antagoniste (base = h+3)': [h => ((h + 2) % 16) + 1, 638], 'binôme dans la maison': [h => N.binome(h), 380], 'miroir dans la maison': [h => N.miroir(h), 568], 'Rubeus en base': [h => 7, 593], 'Tristitia en base': [h => 8, 562] };
for (const [nom, [cible, attendu]] of Object.entries(familles)) { let n = 0; for (let s = 0; s < 65536; s++) { const c = {}; for (let h = 0; h < 16; h++) if (s >> h & 1) c[h + 1] = cible(h + 1); if (N.deduire(c).coherent) n++; } ok('deduire : ' + nom + ' : ' + attendu + ' ensembles de maisons cohérents', n === attendu, n + ' trouvés'); }
const c = N.deduire({ 4: 1, 5: 2 }); ok('deduire : M4 = Puer et M5 = Laetitia sont incompatibles ; le conflit minimal est {M4, M5}', !c.coherent && c.conflit.join() === '4,5');
const d = N.deduire({ 1: 7 }); ok('deduire : Rubeus en M1 impose 7 niveaux ailleurs (I23)', d.coherent && d.imposes.length === 7, d.imposes.length + ' niveaux');

let mauvais = 0; verifs.forEach(([n, cnd, dd]) => { if (!cnd) mauvais++; console.log((cnd ? 'OK     ' : 'ÉCHEC  ') + n + (dd ? ' — ' + dd : '')); });
console.log(mauvais ? mauvais + ' échec(s)' : 'Le noyau est conforme au moteur gelé et aux invariants (' + verifs.length + ' contrôles).'); process.exit(mauvais ? 1 : 0);
