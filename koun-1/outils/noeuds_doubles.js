// Nœuds où deux canaux identiques se croisent : M1 (Feu × Feu), M6 (Air × Air), M11 (Eau × Eau) — et M16 (Terre × Terre) pour comparaison.
// Structure : un seul niveau décide du nœud (pas d'état « mixte » possible) ; dans la matrice, la résultante de g en M(5i+1) a le niveau i saturé
// ⇔ g a le même niveau i que la figure de la maison. Poids sur les matchs : état de chaque nœud double (niveau saturé dans la résultante), nombre de nœuds
// doubles pleins, et pôle qui « possède » le nœud (maison du pôle ou maison de son front).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, 'aveugle')));
const NV = ['Feu', 'Air', 'Eau', 'Terre'], DBL = [[1, 0], [6, 1], [11, 2]];
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme; return { ...d, L, plein: DBL.map(([h, l]) => K.niveaux(T.resultantes[h])[l] === 2), g: d.sc[0] + d.sc[1], nul: d.sc[0] === d.sc[1], r: Math.sign(d.sc[0] - d.sc[1]) }; });
const moy = a => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(2) : '—', pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
console.log('Structure : en M1, M6, M11 un seul niveau décide (plein ou vide, jamais mixte). Dans la matrice, chaque nœud double est plein pour 8 figures sur 16 :');
DBL.forEach(([h, l]) => console.log('   M' + h + ' (' + NV[l] + ' × ' + NV[l] + ', maison ' + K.nom(h) + ', ' + NV[l] + ' ' + K.niveaux(h)[l] + ') plein pour : ' + [...Array(16)].map((_, i) => i + 1).filter(g => K.niveaux(g)[l] === K.niveaux(h)[l]).map(K.nom).join(', ')));
console.log('\n' + D.length + ' matchs ; buts ' + moy(D.map(d => d.g)) + ', nuls ' + pc(D.filter(d => d.nul).length, D.length) + '\n');
const ligne = (nom, X) => { const av = X.filter(d => d.lot === 'aveugle'); console.log('   ' + nom.padEnd(34) + ('n ' + X.length).padEnd(6) + ' buts ' + moy(X.map(d => d.g)) + ' · nuls ' + pc(X.filter(d => d.nul).length, X.length).padEnd(5) + ' · R1 gagne ' + pc(X.filter(d => d.r > 0).length, X.length).padEnd(5) + '| aveugle : buts ' + moy(av.map(d => d.g)) + ', nuls ' + av.filter(d => d.nul).length + '/' + av.length); };
DBL.forEach(([h, l], i) => { console.log('M' + h + ' (' + NV[l] + '²)'); ligne('plein', D.filter(d => d.plein[i])); ligne('vide', D.filter(d => !d.plein[i])); });
console.log('Nombre de nœuds doubles pleins (M1, M6, M11)'); [0, 1, 2, 3].forEach(k => ligne(k + ' plein' + (k > 1 ? 's' : ''), D.filter(d => d.plein.filter(Boolean).length === k)));
// pôle et nœud double : le pôle dont la maison est un nœud double, et l'état de ce nœud
console.log('\nPôle posé sur un nœud double (sa maison est M1, M6 ou M11)');
for (const st of [true, false]) { let w = 0, l = 0, n = 0, gm = 0, ge = 0, c = 0; D.forEach(d => ['R1', 'R7'].forEach((p, i) => { const k = DBL.findIndex(([h]) => h === d.L[p].maison); if (k < 0 || d.plein[k] !== st) return; c++; const a = d.sc[i], b = d.sc[1 - i]; gm += a; ge += b; if (a > b) w++; else if (a < b) l++; else n++; }));
  console.log('   nœud ' + (st ? 'plein' : 'vide ') + ' : ' + c + ' pôles · gagne ' + w + ', nul ' + n + ', perd ' + l + ' · marque ' + (gm / (c || 1)).toFixed(2) + ', encaisse ' + (ge / (c || 1)).toFixed(2)); }
