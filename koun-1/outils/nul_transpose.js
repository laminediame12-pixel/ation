// Règle du nul transposée (mères ↔ filles, côté M1 ↔ côté M7).
// P  = Feu M1 + Feu M2 + Feu M3 + Air M3 (points des mères) ⇔ Feu de M9 ≠ Eau de M11.
// P' = la même avec les points transposés (mère i, niveau l) → (mère l, niveau i) : Feu M1 + Air M1 + Eau M1 + Eau M2.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'], o = v => v === 1 ? 1 : 0;
const pts = m => m.map(K.niveaux); // pts[mère][niveau]
const P = m => { const p = pts(m); return (o(p[0][0]) + o(p[1][0]) + o(p[2][0]) + o(p[2][1])) % 2; };
const Pt = m => { const p = pts(m); return (o(p[0][0]) + o(p[0][1]) + o(p[0][2]) + o(p[1][2])) % 2; };
// formes lisibles de P' : comparer deux niveaux de deux maisons (une ou une somme de deux)
let formes = []; { const B = []; for (let x = 0; x < 4096; x++) { const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + (((x >> 12) & 15) || Math.floor(Math.random() * 16))]; B.push({ m, b: K.construire(m).bases }); }
  for (let h1 = 1; h1 <= 16; h1++) for (let h2 = h1; h2 <= 16; h2++) for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) { if (h1 === h2 && a >= c) continue; if (B.every(({ m, b }) => ((K.niveaux(b[h1])[a] !== K.niveaux(b[h2])[c]) ? 1 : 0) === Pt(m))) formes.push(NIV[a] + ' de M' + h1 + ' ≠ ' + NIV[c] + ' de M' + h2); } }
console.log('règle transposée P\' (Feu M1 + Air M1 + Eau M1 + Eau M2 impaire) =', formes.slice(0, 6).join(' ; ') || '(pas de forme à deux maisons)');
let ind = 0; for (let x = 0; x < 65536; x++) { const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)]; if (P(m) === Pt(m)) ind++; }
console.log('P et P\' identiques dans', ind, 'thèmes sur 65 536 (indépendantes si 32 768)');
// corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => ({ ...d, p: P(d.m), pt: Pt(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0 }));
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
const t = {}; D.forEach(d => { const k = 'P ' + (d.p ? 'impaire' : 'paire') + ' · P\' ' + (d.pt ? 'impaire' : 'paire'); t[k] = t[k] || [0, 0, []]; t[k][0]++; if (d.nul) { t[k][1]++; t[k][2].push((d.n || '') + ' ' + d.sc.join('-')); } });
Object.keys(t).sort().forEach(k => console.log('   ', k.padEnd(30), t[k][1], 'nuls sur', t[k][0], t[k][1] ? '(' + t[k][2].join(' ; ') + ')' : ''));
console.log('   P\' seule : impaire', D.filter(d => d.pt && d.nul).length + '/' + D.filter(d => d.pt).length, ', paire', D.filter(d => !d.pt && d.nul).length + '/' + D.filter(d => !d.pt).length);
// hasard : à l'intérieur de P impaire, une parité quelconque d'un point de plus sépare-t-elle aussi bien ? (comparaison avec toutes les parités à 4 points)
const S = D.filter(d => d.p), y = S.map(d => d.nul), K0 = y.reduce((a, b) => a + b);
const bits = m => { let x = 0; m.forEach((f, i) => K.niveaux(f).forEach((v, l) => { if (v === 1) x |= 1 << (4 * i + l); })); return x; }, X = S.map(d => bits(d.m));
const pc = v => { v ^= v >> 16; v ^= v >> 8; v ^= v >> 4; v ^= v >> 2; v ^= v >> 1; return v & 1; };
const sepOf = (m, yy) => { let n = 0, k = 0; X.forEach((x, i) => { if (pc(x & m)) { n++; k += yy[i]; } }); const n2 = S.length - n, k2 = K0 - k; return n && n2 ? Math.abs(k / n - k2 / n2) * Math.sqrt(n * n2 / S.length) : 0; };
const mt = (1 << 0) | (1 << 1) | (1 << 2) | (1 << 6), obs = sepOf(mt, y);
let mieux = 0, tot = 0; for (let m = 1; m < 65536; m++) { let c = 0, v = m; while (v) { c += v & 1; v >>= 1; } if (c !== 4) continue; tot++; if (sepOf(m, y) >= obs) mieux++; }
console.log('\nà l\'intérieur des 38 matchs à nul possible : P\' sépare les nuls mieux que', ((100 * (tot - mieux)) / tot).toFixed(0) + ' % des parités à 4 points (' + tot + ')');
