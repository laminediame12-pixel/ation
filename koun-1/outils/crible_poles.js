// Criblage systématique des lectures liées aux pôles (hors du cadre linéaire) : vainqueur, nul, buts.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'], fr = n => (n - 1) % 4, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme; return { ...d, L, b: T.bases, rz: h => h < 16 ? T.resultantes[h] : T.bases[16], r: Math.sign(d.sc[0] - d.sc[1]), nul: d.sc[0] === d.sc[1] ? 1 : 0 }; });
const N = D.length, sat = (f, l) => K.niveaux(f)[l] === 2 ? 1 : 0;
// ── lectures par pôle : valeur numérique
const lectures = {};
const ajL = (k, f) => { lectures[k] = f; };
const fronts = { 'son front': c => fr(c.figure), 'front du binôme': c => fr(K.binome(c.figure)), 'front de l\'antagoniste': c => fr(mod(c.figure - 3)), 'front de sa maison': c => fr(c.maison) };
for (const [fn, fz] of Object.entries(fronts)) {
  for (let l = 0; l < 4; l++) {
    ajL(fn + ' · ' + NIV[l] + ' saturé (résultantes, 0-4)', (d, c) => [0, 1, 2, 3].reduce((s, i) => s + sat(d.rz(fz(c) + 1 + 4 * i), l), 0));
    ajL(fn + ' · ' + NIV[l] + ' saturé (bases, 0-4)', (d, c) => [0, 1, 2, 3].reduce((s, i) => s + sat(d.b[fz(c) + 1 + 4 * i], l), 0));
    ajL(fn + ' · ' + NIV[l] + ' de la somme des bases', (d, c) => sat([0, 1, 2, 3].map(i => d.b[fz(c) + 1 + 4 * i]).reduce(A), l));
    ajL(fn + ' · ' + NIV[l] + ' de la somme des résultantes', (d, c) => sat([0, 1, 2, 3].map(i => d.rz(fz(c) + 1 + 4 * i)).reduce(A), l));
    for (let r = 0; r < 4; r++) ajL(fn + ' · rang ' + (r + 1) + ' · ' + NIV[l] + ' (résultante)', (d, c) => sat(d.rz(fz(c) + 1 + 4 * r), l));
  }
  ajL(fn + ' · niveaux saturés en tout (résultantes, 0-16)', (d, c) => [0, 1, 2, 3].reduce((s, i) => s + K.niveaux(d.rz(fz(c) + 1 + 4 * i)).filter(v => v === 2).length, 0));
  ajL(fn + ' · arrêts', (d, c) => [0, 1, 2, 3].map(i => fz(c) + 1 + 4 * i).filter(h => h < 16 && d.b[h] === mod(h - 3)).length);
  ajL(fn + ' · figures chez elles', (d, c) => [0, 1, 2, 3].map(i => fz(c) + 1 + 4 * i).filter(h => d.b[h] === h).length);
}
for (let l = 0; l < 4; l++) { ajL('maison du pôle · ' + NIV[l] + ' (résultante)', (d, c) => sat(d.rz(c.maison), l)); ajL('maison du pôle · ' + NIV[l] + ' (base)', (d, c) => sat(d.b[c.maison], l)); }
ajL('figure du pôle posée ailleurs (nombre de maisons)', (d, c) => { let n = 0; for (let h = 1; h <= 16; h++) if (d.b[h] === c.figure) n++; return n; });
console.log(N + ' matchs ; ' + Object.keys(lectures).length + ' lectures par pôle\n');
const val = {}; for (const [k, f] of Object.entries(lectures)) val[k] = D.map(d => [f(d, d.L.R1), f(d, d.L.R7)]);
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
// ── 1. vainqueur : le pôle qui a le plus gagne (ou le moins)
const sV = k => val[k].map(([a, e]) => Math.sign(a - e)), SV = {}; Object.keys(val).forEach(k => SV[k] = sV(k));
const zV = (s, rr) => { let a = 0, b = 0; s.forEach((v, i) => { if (v && rr[i]) { if (v === rr[i]) a++; else b++; } }); return { a, b, z: (a - b) / Math.sqrt(a + b || 1) }; };
const rr = D.map(d => d.r), bestV = r0 => { let m = 0, kk = null; for (const k in SV) { const z = Math.abs(zV(SV[k], r0).z); if (z > m) { m = z; kk = k; } } return { m, kk }; };
const oV = bestV(rr); let gV = 0; const NP = +process.argv[2] || 500; for (let t = 0; t < NP; t++) if (bestV(mel(rr)).m >= oV.m) gV++;
console.log('1. VAINQUEUR — meilleures lectures (le pôle qui en a le plus gagne / perd) ; la meilleure est atteinte par hasard dans ' + (100 * gV / NP).toFixed(1) + ' % des mélanges');
Object.keys(SV).map(k => ({ k, ...zV(SV[k], rr) })).sort((x, y) => Math.abs(y.z) - Math.abs(x.z)).slice(0, 10).forEach(o => console.log('    ', o.k.padEnd(58), o.a, 'justes /', o.b, 'faux', o.z < 0 ? '(c\'est le pôle qui en a le MOINS qui gagne)' : ''));
// validation : choisir la meilleure lecture sans le match, prédire le match
{ let ok = 0, ko = 0, ab = 0; for (let i = 0; i < N; i++) { let m = 0, kk = null, sg = 1; for (const k in SV) { let a = 0, b = 0; SV[k].forEach((v, j) => { if (j !== i && v && rr[j]) { if (v === rr[j]) a++; else b++; } }); const z = (a - b) / Math.sqrt(a + b || 1); if (Math.abs(z) > m) { m = Math.abs(z); kk = k; sg = Math.sign(z); } } const p = SV[kk][i] * sg; if (!p || !rr[i]) ab++; else if (p === rr[i]) ok++; else ko++; } console.log('   validation (un match laissé de côté) :', ok, 'justes,', ko, 'faux (sans appel ou nul :', ab + ')'); }
// ── 2. nul : les deux pôles à égalité sur la lecture
const y = D.map(d => d.nul), p0 = y.reduce((a, b) => a + b) / N, cas = [];
for (const k in val) { const eq = val[k].map(([a, e]) => a === e ? 1 : 0), n = eq.reduce((a, b) => a + b); if (n >= 8 && n <= N - 8) { cas.push({ k: k + ' : égalité', x: eq, n }); cas.push({ k: k + ' : écart', x: eq.map(v => 1 - v), n: N - n }); } }
const zN = (c, yy) => { let k = 0; c.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - c.n * p0) / Math.sqrt(c.n * p0 * (1 - p0)); };
const oN = Math.max(...cas.map(c => zN(c, y))); let gN = 0; for (let t = 0; t < NP; t++) { const q = mel(y); if (Math.max(...cas.map(c => zN(c, q))) >= oN) gN++; }
console.log('\n2. NUL — égalité des deux pôles ; la meilleure est atteinte par hasard dans ' + (100 * gN / NP).toFixed(1) + ' % des mélanges');
cas.map(c => { let k = 0; c.x.forEach((v, i) => { if (v && y[i]) k++; }); return { c, k, z: zN(c, y) }; }).sort((a, b) => b.z - a.z).slice(0, 6).forEach(o => console.log('    ', o.c.k.padEnd(66), o.k + ' nuls sur ' + o.c.n));
// ── 3. buts d'un pôle : la lecture du pôle sépare-t-elle les buts qu'il marque ?
const G = []; D.forEach((d, i) => { G.push(d.sc[0]); G.push(d.sc[1]); });
const corr = (xs, gs) => { const n = xs.length, mx = xs.reduce((a, b) => a + b) / n, mg = gs.reduce((a, b) => a + b) / n; let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (gs[i] - mg); sxx += (xs[i] - mx) ** 2; syy += (gs[i] - mg) ** 2; } return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0; };
const XS = {}; for (const k in val) XS[k] = val[k].flat();
const oG = Math.max(...Object.values(XS).map(x => Math.abs(corr(x, G)))); let gG = 0;
for (let t = 0; t < NP; t++) { const perm = mel([...Array(N).keys()]), Gp = []; perm.forEach(i => { Gp.push(D[i].sc[0]); Gp.push(D[i].sc[1]); }); if (Math.max(...Object.values(XS).map(x => Math.abs(corr(x, Gp)))) >= oG) gG++; }
console.log('\n3. BUTS d\'un pôle — corrélation avec la lecture ; la meilleure est atteinte par hasard dans ' + (100 * gG / NP).toFixed(1) + ' % des mélanges');
Object.keys(XS).map(k => ({ k, c: corr(XS[k], G) })).sort((a, b) => Math.abs(b.c) - Math.abs(a.c)).slice(0, 6).forEach(o => console.log('    ', o.k.padEnd(58), 'corrélation', o.c.toFixed(2)));
