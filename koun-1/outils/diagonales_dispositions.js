// Nœuds diagonaux du front de chaque pôle : base contre résultante (lecture inverse) et disposition des figures posées.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const fr = n => (n - 1) % 4, tS = f => K.niveaux(f)[3] === 2 ? 1 : 0;
const rel = (fFig, fM) => { const d = ((fM - fFig) % 4 + 4) % 4; return d === 0 ? 'propre' : d === 2 ? 'allié' : d === 1 ? 'ennemi' : 'proie'; };
function info(L, c) {
  const T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16], z = fr(c.figure), f = c.figure;
  const hs = [[4, 7, 10, 13], [1, 6, 11, 16]].map(dg => dg.find(h => (h - 1) % 4 === z));
  return hs.map(h => ({ h, base: b[h], res: rz(h), tB: tS(b[h]), tR: tS(rz(h)), relB: rel(fr(f), fr(b[h])), relR: rel(fr(f), fr(rz(h))), baseEstPole: b[h] === f, resEstPole: rz(h) === f, baseBinome: b[h] === K.binome(f), resBinome: rz(h) === K.binome(f) }));
}
const P = D.map(d => ({ d, a: info(d.L, d.L.R1), e: info(d.L, d.L.R7) }));
const ev = s => { let ok = 0, ko = 0, eg = 0, ne = 0; P.forEach((p, i) => { if (!s[i]) { eg++; ne += p.d.nul; } else if (p.d.r) { if (s[i] === p.d.r) ok++; else ko++; } }); return ok + ' justes / ' + ko + ' faux | égalités ' + eg + ' dont ' + ne + ' nuls'; };
const cmp = f => P.map(p => Math.sign(f(p.a) - f(p.e)));
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls\n');
console.log('1. Terre des nœuds diagonaux : résultante (verdict) contre base (lecture inverse)');
console.log('   résultante saturée          ', ev(cmp(x => x.filter(n => n.tR).length)));
console.log('   base saturée                ', ev(cmp(x => x.filter(n => n.tB).length)));
console.log('   base ouverte (inverse)      ', ev(cmp(x => x.filter(n => !n.tB).length)));
console.log('   résultante ET base saturées ', ev(cmp(x => x.filter(n => n.tR && n.tB).length)));
console.log('   résultante saturée, base ouverte', ev(cmp(x => x.filter(n => n.tR && !n.tB).length)));
console.log('   résultante ouverte, base saturée', ev(cmp(x => x.filter(n => !n.tR && n.tB).length)));
// chaque nœud : 4 états (base, résultante) et buts du pôle
console.log('\n2. Chaque nœud diagonal du front d\'un pôle : (Terre base, Terre résultante) et buts de ce pôle');
const g = {}; P.forEach(p => [[p.a, p.d.sc[0], p.d.sc[1]], [p.e, p.d.sc[1], p.d.sc[0]]].forEach(([x, gm, ge]) => x.forEach(n => { const k = 'base ' + (n.tB ? 'saturée' : 'ouverte') + ', résultante ' + (n.tR ? 'saturée' : 'ouverte'); g[k] = g[k] || [0, 0, 0, 0]; g[k][0]++; if (gm > 0) g[k][1]++; g[k][2] += gm; g[k][3] += ge; })));
Object.keys(g).sort().forEach(k => console.log('   ', k.padEnd(40), g[k][1] + '/' + g[k][0], 'marquent,', (g[k][2] / g[k][0]).toFixed(2), 'buts pour,', (g[k][3] / g[k][0]).toFixed(2), 'contre'));
// dispositions
console.log('\n3. Disposition : qui est posé en base sur les nœuds diagonaux du front du pôle, et qui en sort en résultante');
for (const [lab, key] of [['figure en base', 'relB'], ['figure en résultante', 'relR']]) {
  const t = {}; P.forEach(p => [[p.a, p.d.sc[0], p.d.sc[1]], [p.e, p.d.sc[1], p.d.sc[0]]].forEach(([x, gm, ge]) => x.forEach(n => { const k = n[key]; t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; if (gm > 0) t[k][1]++; t[k][2] += gm; t[k][3] += ge; })));
  console.log('   ' + lab + ' :', Object.keys(t).sort().map(k => k + ' ' + t[k][1] + '/' + t[k][0] + ' marquent (' + (t[k][2] / t[k][0]).toFixed(1) + ' pour, ' + (t[k][3] / t[k][0]).toFixed(1) + ' contre)').join(' · '));
}
for (const [lab, f] of [['figures alliées ou propres en base', n => n.relB === 'propre' || n.relB === 'allié'], ['figures ennemies en base', n => n.relB === 'ennemi'], ['figures proies en base', n => n.relB === 'proie'], ['résultantes propres ou alliées', n => n.relR === 'propre' || n.relR === 'allié'], ['résultantes ennemies', n => n.relR === 'ennemi'], ['la figure du pôle ou son binôme sur le nœud', n => n.baseEstPole || n.resEstPole || n.baseBinome || n.resBinome]])
  console.log('   plus de ' + lab.padEnd(44), ev(cmp(x => x.filter(f).length)));
// combinaison Terre résultante + disposition ennemie
console.log('\n4. Terre saturée en résultante, selon la figure posée en base :');
for (const k of ['propre', 'allié', 'ennemi', 'proie']) console.log('   nœuds saturés avec une figure ' + k.padEnd(8) + 'en base :', ev(cmp(x => x.filter(n => n.tR && n.relB === k).length)));
