// Symétrie du propriétaire : M1–M8, M2–M7, M3–M6, M4–M5, M9–M12, M10–M11, M13–M14 (l'autre diagonale de la grille mère × niveau).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'], o = v => v === 1 ? 1 : 0, PAIRES = [[1, 8], [2, 7], [3, 6], [4, 5], [9, 12], [10, 11], [13, 14]];
const rnd = () => [1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 16));
// 1. la symétrie au niveau des points : (mère i, niveau l) → (mère 3−l, niveau 3−i) envoie-t-elle M1..M8 sur M8..M1 ? (vérification par construction)
const reflet = m => { const p = m.map(K.niveaux), q = [0, 1, 2, 3].map(i => [0, 1, 2, 3].map(l => p[3 - l][3 - i])); return q.map(v => [...Array(16)].map((_, j) => j + 1).find(f => K.niveaux(f).join() === v.join())); };
let ok = 0, okPaires = 0; for (let t = 0; t < 2000; t++) { const m = rnd(), b = K.construire(m).bases, c = K.construire(reflet(m)).bases; if (PAIRES.every(([x, y]) => b[x] === c[y] && b[y] === c[x])) okPaires++; }
console.log('1. reflet des points (mère i, niveau l) → (mère 4−l, niveau 4−i) : il échange exactement M1–M8, M2–M7, M3–M6, M4–M5, M9–M12, M10–M11, M13–M14 dans', okPaires, 'thèmes sur 2000 ;', 'M15 et M16 :', (() => { let a = 0, b2 = 0; for (let t = 0; t < 2000; t++) { const m = rnd(), b = K.construire(m).bases, c = K.construire(reflet(m)).bases; if (b[15] === c[15]) a++; if (b[16] === c[16]) b2++; } return 'M15 inchangée ' + a + '/2000, M16 inchangée ' + b2 + '/2000'; })());
// 2. la règle du nul passée par ce reflet : Feu de M9 ≠ Eau de M11 devient ?
const P = m => { const b = K.construire(m).bases; return K.niveaux(b[9])[0] !== K.niveaux(b[11])[2] ? 1 : 0; };
const Pr = m => P(reflet(m));
const ech = []; for (let t = 0; t < 3000; t++) { const m = rnd(); ech.push({ m, b: K.construire(m).bases, v: Pr(m) }); }
const formes = []; for (let h1 = 1; h1 <= 16; h1++) for (let h2 = h1 + 1; h2 <= 16; h2++) for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) if (ech.every(e => ((K.niveaux(e.b[h1])[a] !== K.niveaux(e.b[h2])[c]) ? 1 : 0) === e.v)) formes.push(NIV[a] + ' de M' + h1 + ' ≠ ' + NIV[c] + ' de M' + h2);
console.log('2. la règle du nul (Feu de M9 ≠ Eau de M11) passée par ce reflet devient :', formes.join(' ; ') || '(pas de forme simple)');
// 3. corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => ({ ...d, b: K.construire(d.m).bases, p: P(d.m), pr: Pr(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0 }));
console.log('\n3. ' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
const t = {}; D.forEach(d => { const k = 'règle ' + (d.p ? 'nul possible' : 'nul exclu') + ' · reflet ' + (d.pr ? 'différents' : 'égaux'); t[k] = t[k] || [0, 0]; t[k][0]++; t[k][1] += d.nul; });
Object.keys(t).sort().forEach(k => console.log('    ', k.padEnd(40), t[k][1], 'nuls sur', t[k][0]));
console.log('     reflet seul : différents', D.filter(d => d.pr && d.nul).length + '/' + D.filter(d => d.pr).length, ', égaux', D.filter(d => !d.pr && d.nul).length + '/' + D.filter(d => !d.pr).length);
// 4. chaque paire face au nul (à l'intérieur des 38 matchs à nul possible)
const S = D.filter(d => d.p); console.log('\n4. chaque paire, à l\'intérieur des', S.length, 'matchs à nul possible (' + S.filter(d => d.nul).length + ' nuls) :');
for (const [x, y] of PAIRES) { const lect = [['même figure', d => d.b[x] === d.b[y]], ['même Terre', d => K.niveaux(d.b[x])[3] === K.niveaux(d.b[y])[3]], ['somme : niveaux impairs pairs', d => K.niveaux(A(d.b[x], d.b[y])).filter(v => v === 1).length % 2 === 0]];
  console.log('    M' + x + '–M' + y + ' :', lect.map(([k, f]) => { const a = S.filter(f), c = S.filter(d => !f(d)); return k + ' ' + a.filter(d => d.nul).length + '/' + a.length + ' (sinon ' + c.filter(d => d.nul).length + '/' + c.length + ')'; }).join(' · ')); }
