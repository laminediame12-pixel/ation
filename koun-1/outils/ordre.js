// Ordre de numérotation : on relit chaque thème à partir de la maison de R1 (position 1) ; R7 tombe toujours en position 7.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, nodd = f => K.niveaux(f).filter(v => v === 1).length, odd = f => K.niveaux(f).map(v => v === 1 ? 1 : 0);
const D = [...tous.values()].map(d => { const L = M.lire(d.m), b = L.theme.bases, h1 = L.R1.maison, rel = [null]; for (let k = 1; k <= 16; k++) rel.push(b[mod(h1 + k - 1)]); return { ...d, L, rel, h1, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const y = D.map(d => d.nul), NN = y.reduce((a, b) => a + b);
console.log(D.length, 'matchs,', NN, 'nuls');
// ── A. demi-cercles dans l'ordre : R1 → R7 (positions 1 à 6), R7 → R1 (positions 7 à 12), puis 13 à 16 ; et 1-8 / 9-16
const seg = (d, a, b) => { let s = d.rel[a]; for (let k = a + 1; k <= b; k++) s = A(s, d.rel[k]); return s; };
const show = (lab, f) => { const t = {}; D.forEach(d => { const k = f(d); t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.r > 0) t[k][2]++; if (d.r < 0) t[k][3]++; }); console.log(lab); Object.keys(t).sort().forEach(k => console.log('    ', String(k).padEnd(22), 'n', String(t[k][0]).padStart(2), '| nuls', t[k][1], '(' + Math.round(100 * t[k][1] / t[k][0]) + ' %) | R1', t[k][2], 'R7', t[k][3])); };
show('A1. impairs de R1→R7 (pos. 1-6) contre R7→R1 (pos. 7-12)', d => { const a = nodd(seg(d, 1, 6)), b = nodd(seg(d, 7, 12)); return a === b ? 'égaux' : a > b ? 'R1 plus' : 'R7 plus'; });
show('A2. même figure dans les deux demi-parcours', d => seg(d, 1, 6) === seg(d, 7, 12) ? 'oui' : 'non');
show('A3. demi-cercles 1-8 / 9-16 : impairs', d => { const a = nodd(seg(d, 1, 8)), b = nodd(seg(d, 9, 16)); return a === b ? 'égaux' : a > b ? 'R1 plus' : 'R7 plus'; });
show('A4. parcours R1→R7 (1-7) : impairs', d => nodd(seg(d, 1, 7)));
show('A5. parcours R7→R1 (7-16 puis 1) : impairs', d => nodd(A(seg(d, 7, 16), d.rel[1])));
show('A6. décalage de R1 (maison de R1)', d => d.h1 <= 4 ? 'mères 1-4' : d.h1 <= 8 ? 'filles 5-8' : d.h1 <= 12 ? 'nièces 9-12' : 'témoins 13-16');
show('A7. R7 dépasse 16 (le parcours fait le tour)', d => d.h1 + 6 > 16 ? 'oui' : 'non');
// ── B. criblage : figure à une position relative, et somme de deux positions relatives = figure
const F = [];
for (let k = 1; k <= 16; k++) for (let f = 1; f <= 16; f++) F.push({ c: 'pos ' + k + ' = ' + nm(f), x: D.map(d => d.rel[k] === f ? 1 : 0) });
for (let a = 1; a <= 16; a++) for (let b = a + 1; b <= 16; b++) { for (let f = 1; f <= 16; f++) F.push({ c: 'pos ' + a + '+' + b + ' = ' + nm(f), x: D.map(d => A(d.rel[a], d.rel[b]) === f ? 1 : 0) }); for (let n = 0; n <= 4; n++) F.push({ c: 'pos ' + a + '+' + b + ' impairs ' + n, x: D.map(d => nodd(A(d.rel[a], d.rel[b])) === n ? 1 : 0) }); }
const G = F.filter(o => { const n = o.x.reduce((a, b) => a + b); o.n = n; return n >= 6; });
const sc = yy => { let best = -1e9, bo = null; G.forEach(o => { let k = 0; o.x.forEach((v, i) => { if (v && yy[i]) k++; }); const p0 = NN / D.length, z = (k - o.n * p0) / Math.sqrt(o.n * p0 * (1 - p0)); if (Math.abs(z) > best) { best = Math.abs(z); bo = { o, k, z }; } }); return { best, bo }; };
const obs = sc(y);
const rank = G.map(o => { let k = 0; o.x.forEach((v, i) => { if (v && y[i]) k++; }); const p0 = NN / D.length; return { o, k, z: (k - o.n * p0) / Math.sqrt(o.n * p0 * (1 - p0)) }; }).sort((a, b) => Math.abs(b.z) - Math.abs(a.z));
let ge = 0; const N = +process.argv[2] || 100; for (let t = 0; t < N; t++) { const z = y.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } if (sc(z).best >= obs.best) ge++; }
console.log('\nB. criblage', G.length, 'caractéristiques (au moins 6 matchs) ; le meilleur lien est atteint par hasard dans', Math.round(100 * ge / N) + ' % des mélanges');
rank.slice(0, 12).forEach(t => console.log('    ', t.o.c.padEnd(30), t.k + ' nuls sur ' + t.o.n, 'z=' + t.z.toFixed(2)));
