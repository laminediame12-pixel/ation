// Pourquoi M15 a toujours un nombre pair de niveaux impairs, et le lien avec la règle du nul.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'], o = v => v === 1 ? 1 : 0;
const impairs = f => K.niveaux(f).filter(v => v === 1).length;
// 1. la preuve : M15 = M13 + M14 = (M1+M2+M3+M4) + (M5+M6+M7+M8) ; le nombre de niveaux impairs d'une somme a la parité de la somme des nombres de niveaux impairs.
//    Les 16 points des mères apparaissent une fois dans M1..M4 et une fois dans M5..M8 (transposition) : chacun compte deux fois → total pair.
let ok = 0, okId = 0, okT = 0; for (let x = 0; x < 65536; x++) { const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], b = K.construire(m).bases;
  if (impairs(b[15]) % 2 === 0) ok++; if (b[15] === [1, 2, 3, 4, 5, 6, 7, 8].map(h => b[h]).reduce(A)) okId++;
  const tM = m.reduce((s, f) => s + impairs(f), 0), tF = [5, 6, 7, 8].reduce((s, h) => s + impairs(b[h]), 0); if (tM === tF) okT++; }
console.log('1. M15 a un nombre pair de niveaux impairs :', ok, '/ 65 536');
console.log('   M15 = M1+M2+…+M8 (les 4 mères et les 4 filles) :', okId, '/ 65 536');
console.log('   points impairs des mères = points impairs des filles (mêmes 16 points, transposés) :', okT, '/ 65 536');
console.log('   donc M15 additionne chaque point deux fois : le nombre total de points impairs est pair, et M15 a toujours 0, 2 ou 4 niveaux impairs.');
// quelles autres maisons ont une parité fixe ?
const fixe = []; for (let h = 1; h <= 16; h++) { let p = 0; for (let x = 0; x < 65536; x += 7) { const b = K.construire([1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)]).bases; p |= 1 << (impairs(b[h]) % 2); } if (p !== 3) fixe.push('M' + h + (p === 1 ? ' toujours pair' : ' toujours impair')); }
console.log('   maisons à parité fixe :', fixe.join(', '));
// 2. le lien avec le nul : la règle Feu M9 ≠ Eau M11 s'écrit-elle avec M15 ou avec la parité d'une maison ?
const P = b => K.niveaux(b[9])[0] !== K.niveaux(b[11])[2] ? 1 : 0;
const ech = []; for (let t = 0; t < 3000; t++) { const b = K.construire([1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 16))).bases; ech.push(b); }
const formes = [];
for (let h1 = 1; h1 <= 16; h1++) for (let h2 = h1; h2 <= 16; h2++) for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) { if (h1 === h2 && a >= c) continue; if (![h1, h2].some(h => h >= 13)) continue; if (ech.every(b => ((K.niveaux(b[h1])[a] !== K.niveaux(b[h2])[c]) ? 1 : 0) === P(b))) formes.push(NIV[a] + ' de M' + h1 + ' ≠ ' + NIV[c] + ' de M' + h2); }
console.log('\n2. la règle du nul écrite avec les témoins, le juge ou M16 :', formes.join(' ; ') || 'aucune forme à deux maisons');
// parité (nombre de niveaux impairs) de sommes de maisons
const par = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length > 3) continue; if (ech.every(b => (impairs(hs.map(h => b[h]).reduce(A)) % 2) === P(b))) par.push('M' + hs.join('+M')); }
console.log('   la règle du nul = nombre impair de niveaux impairs de :', par.slice(0, 10).join(' ; ') || 'aucune somme de 3 maisons au plus');
// 3. M15 et le nul sur le corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const b = K.construire(d.m).bases; return { b, nul: d.sc[0] === d.sc[1] ? 1 : 0, p: P(b) }; });
console.log('\n3. nombre de niveaux impairs de M15 et nul (80 matchs) :', [0, 2, 4].map(k => { const s = D.filter(d => impairs(d.b[15]) === k); return k + ' impairs : ' + s.filter(d => d.nul).length + '/' + s.length; }).join(' · '));
console.log('   à nul possible seulement :', [0, 2, 4].map(k => { const s = D.filter(d => d.p && impairs(d.b[15]) === k); return k + ' impairs : ' + s.filter(d => d.nul).length + '/' + s.length; }).join(' · '));
NIV.forEach((n, l) => { const s = D.filter(d => d.p && K.niveaux(d.b[15])[l] === 2), t = D.filter(d => d.p && K.niveaux(d.b[15])[l] !== 2); console.log('   ' + n + ' de M15 saturé (à nul possible) :', s.filter(d => d.nul).length + '/' + s.length, '; ouvert :', t.filter(d => d.nul).length + '/' + t.length); });
