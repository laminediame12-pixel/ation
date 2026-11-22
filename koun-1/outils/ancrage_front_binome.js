// Ancrage (figure posée dans sa propre maison) : front du pôle contre front du binôme, figure du pôle contre figure du binôme.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const fr = n => (n - 1) % 4, ant = f => ((f - 4) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, r: Math.sign(d.sc[0] - d.sc[1]), nul: d.sc[0] === d.sc[1] ? 1 : 0 }; });
const figsFront = z => [0, 1, 2, 3].map(i => z + 1 + 4 * i);
const modes = { 'en base': (L, f) => L.theme.bases[f] === f, 'base ou résultante': (L, f) => L.chezElle(f) };
const mes = {
  'front du pôle : figures ancrées': (L, c, chez) => figsFront(fr(c.figure)).filter(f => chez(L, f)).length,
  'front du binôme : figures ancrées': (L, c, chez) => figsFront(fr(K.binome(c.figure))).filter(f => chez(L, f)).length,
  'front du pôle : ancrées sans leur antagoniste ancré': (L, c, chez) => figsFront(fr(c.figure)).filter(f => chez(L, f) && !chez(L, ant(f))).length,
  'front du binôme : ancrées sans leur antagoniste ancré': (L, c, chez) => figsFront(fr(K.binome(c.figure))).filter(f => chez(L, f) && !chez(L, ant(f))).length,
  'figure du pôle ancrée': (L, c, chez) => +chez(L, c.figure),
  'figure du binôme ancrée': (L, c, chez) => +chez(L, K.binome(c.figure)),
  'les deux fronts (pôle + binôme)': (L, c, chez) => figsFront(fr(c.figure)).concat(figsFront(fr(K.binome(c.figure)))).filter(f => chez(L, f)).length,
};
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls\n');
const sig = {};
for (const [mn, chez] of Object.entries(modes)) { console.log('— ancrage ' + mn); for (const [k, f] of Object.entries(mes)) {
  const s = D.map(d => Math.sign(f(d.L, d.L.R1, chez) - f(d.L, d.L.R7, chez))); sig[mn + ' · ' + k] = s;
  let ok = 0, ko = 0, eg = 0, ne = 0; D.forEach((d, i) => { if (!s[i]) { eg++; ne += d.nul; } else if (d.r) { if (s[i] === d.r) ok++; else ko++; } });
  const g = {}; D.forEach(d => [[d.L.R1, d.sc[0], d.sc[1]], [d.L.R7, d.sc[1], d.sc[0]]].forEach(([c, gm, ge]) => { const v = f(d.L, c, chez); g[v] = g[v] || [0, 0, 0]; g[v][0]++; g[v][1] += gm; g[v][2] += ge; }));
  console.log('   le plus de ' + k.padEnd(52), 'gagne', String(ok).padStart(2), 'perd', String(ko).padStart(2), '| égalité', eg, 'dont', ne, 'nuls | buts pour/contre :', Object.keys(g).sort().map(v => v + '→' + (g[v][1] / g[v][0]).toFixed(1) + '/' + (g[v][2] / g[v][0]).toFixed(1)).join(' '));
} console.log(''); }
// face à face : quand front et binôme désignent des pôles différents, lequel a raison ?
for (const mn of Object.keys(modes)) { const a = sig[mn + ' · front du pôle : figures ancrées'], b = sig[mn + ' · front du binôme : figures ancrées']; let fa = 0, fb = 0, nn = 0, n = 0; D.forEach((d, i) => { if (a[i] && b[i] && a[i] !== b[i]) { n++; if (!d.r) nn++; else if (a[i] === d.r) fa++; else fb++; } }); console.log('face à face (' + mn + ') : front et binôme désignent des pôles opposés dans', n, 'matchs : le front a raison', fa, 'fois, le binôme', fb, 'fois,', nn, 'nuls'); }
const rr = D.map(d => d.r), z = (s, q) => { let a = 0, b = 0; s.forEach((v, i) => { if (v && q[i]) { if (v === q[i]) a++; else b++; } }); return (a - b) / Math.sqrt(a + b || 1); };
const ob = Math.max(...Object.values(sig).map(s => Math.abs(z(s, rr)))); let ge = 0;
for (let t = 0; t < 3000; t++) { const q = rr.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (Math.max(...Object.values(sig).map(s => Math.abs(z(s, q)))) >= ob) ge++; }
const best = Object.entries(sig).sort((x, y) => Math.abs(z(y[1], rr)) - Math.abs(z(x[1], rr)))[0][0];
console.log('meilleur des', Object.keys(sig).length, 'tests :', best, '— atteint par hasard dans', (100 * ge / 3000).toFixed(1) + ' % des mélanges');
