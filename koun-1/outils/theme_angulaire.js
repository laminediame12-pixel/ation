// Thème angulaire : les figures des maisons angulaires M1, M4, M7, M10 du thème principal deviennent les 4 mères d'un nouveau thème.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const ANG = [1, 4, 7, 10], fr = n => (n - 1) % 4;
const angulaire = Lp => M.lire(ANG.map(h => Lp.theme.bases[h]));
// ── 1. structure sur les 65 536 thèmes
const S = { identique: 0, memeR1: 0, memeR1fig: 0, M16: 0, M15: 0, R1figDansFront: 0, polesEchanges: 0 }, h16 = {}, retour = {};
for (let x = 0; x < 65536; x++) {
  const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], L = M.lire(m), G = angulaire(L), b = L.theme.bases, g = G.theme.bases;
  if (g.slice(1).join() === b.slice(1).join()) S.identique++;
  if (G.R1.maison === L.R1.maison) S.memeR1++; if (G.R1.figure === L.R1.figure) S.memeR1fig++;
  if (g[16] === b[16]) S.M16++; if (g[15] === b[15]) S.M15++;
  if (G.R1.figure === L.R7.figure && G.R7.figure === L.R1.figure) S.polesEchanges++;
  const k = nm(A(g[16], b[16])); h16[k] = (h16[k] || 0) + 1;
}
console.log('structure sur 65 536 thèmes :', JSON.stringify(S));
console.log('M16 angulaire + M16 principal :', Object.keys(h16).length === 1 ? 'toujours ' + Object.keys(h16)[0] : Object.keys(h16).length + ' valeurs');
// formule : chaque maison du thème angulaire est-elle une somme fixe de maisons du thème principal ?
const ech = []; for (let k = 0; k < 300; k++) { const m = [1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 16)); const L = M.lire(m); ech.push([L.theme.bases, angulaire(L).theme.bases]); }
const combos = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length <= 2) combos.push(hs); }
console.log('maisons du thème angulaire égales à une maison ou une somme de 2 maisons du principal :');
for (let h = 1; h <= 16; h++) { const eq = combos.filter(hs => ech.every(([b, g]) => hs.map(x => b[x]).reduce(A) === g[h])).map(hs => 'M' + hs.join('+M')); console.log('   angulaire M' + h, '=', eq.slice(0, 3).join(' ou ') || '(pas de forme courte)'); }
// ── 2. corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), G = angulaire(L); return { ...d, L, G, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls');
// quel pôle angulaire correspond à quelle équipe ? R1 angulaire dans le front de R1 ou de R7 principal
const cote = (d, c) => { const a = fr(c.figure) === fr(d.L.R1.figure), e = fr(c.figure) === fr(d.L.R7.figure); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; };
const lect = {
  'verdict du thème angulaire (R1 angulaire = équipe 1)': d => { const V = M.verdict(d.G); return V.v ? (V.v === '1' ? 'R1' : 'R7') : 'pas d\'appel'; },
  'nœuds diagonaux du thème angulaire': d => { const e = M.diagonales(d.G).ecart; return e > 0 ? 'R1' : e < 0 ? 'R7' : 'égalité'; },
  'R1 angulaire tombe dans le front de': d => cote(d, d.G.R1),
  'R7 angulaire tombe dans le front de': d => cote(d, d.G.R7),
  'nul dans le thème angulaire (Rubeus / M2 / juge)': d => { const V = M.verdict(d.G); return V.nulExclu ? 'quasi impossible' : V.nulFrequent ? 'fréquent' : V.nulPeuProbable ? 'peu probable' : 'possible'; },
  'R1 angulaire en M2': d => d.G.R1.maison === 2 ? 'oui' : 'non',
  'R1+R7 angulaire (figure du déséquilibre)': d => nm(d.G.lien),
  'figure du déséquilibre : même que le principal': d => d.G.lien === d.L.lien ? 'oui' : 'non',
  'M16 angulaire': d => nm(d.G.theme.bases[16]),
  'M15 angulaire': d => nm(d.G.theme.bases[15]),
  'maison de R1 angulaire': d => 'M' + d.G.R1.maison,
  'parité EB des pôles angulaires (2 impairs)': d => { const q = M.marquage(d.G); return (q.R1.parite.equilibre ? 'R1' : '') + (q.R7.parite.equilibre ? 'R7' : '') || 'aucun'; },
};
const rows = [];
for (const [lab, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.r > 0) t[k][2]++; if (d.r < 0) t[k][3]++; }); Object.keys(t).forEach(k => rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), t: t[k] })); if (Object.keys(t).length <= 6) { console.log('\n' + lab); Object.keys(t).sort().forEach(k => console.log('    ', k.padEnd(20), 'n', String(t[k][0]).padStart(2), '| nuls', t[k][1], '| R1', t[k][2], 'R7', t[k][3])); } }
const y = D.map(d => d.nul), NN = y.reduce((a, b) => a + b), p0 = NN / D.length, rr = D.map(d => d.r);
const zN = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); const n = r.t[0]; return (k - n * p0) / Math.sqrt(n * p0 * (1 - p0)); };
const zV = (r, q) => { let a = 0, b = 0; r.x.forEach((v, i) => { if (v && q[i] > 0) a++; if (v && q[i] < 0) b++; }); return (a + b) ? Math.abs(a - b) / Math.sqrt(a + b) : 0; };
const ok = r => r.t[0] >= 6 && r.t[0] <= D.length - 6, mel = a => { const z = a.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } return z; };
const bN = Math.max(...rows.filter(ok).map(r => zN(r, y))), bV = Math.max(...rows.filter(ok).map(r => zV(r, rr))); let gN = 0, gV = 0;
for (let t = 0; t < 2000; t++) { if (Math.max(...rows.filter(ok).map(r => zN(r, mel(y)))) >= bN) gN++; if (Math.max(...rows.filter(ok).map(r => zV(r, mel(rr)))) >= bV) gV++; }
console.log('\n' + rows.filter(ok).length + ' cases testées (au moins 6 matchs)');
console.log('NUL — meilleures cases (la meilleure atteinte par hasard dans ' + (100 * gN / 2000).toFixed(1) + ' % des mélanges) :');
rows.filter(ok).sort((a, b) => zN(b, y) - zN(a, y)).slice(0, 6).forEach(r => console.log('    ', (r.lab + ' = ' + r.k).padEnd(66), r.t[1] + ' nuls sur ' + r.t[0], '| R1', r.t[2], 'R7', r.t[3]));
console.log('VAINQUEUR — meilleures cases (la meilleure atteinte par hasard dans ' + (100 * gV / 2000).toFixed(1) + ' % des mélanges) :');
rows.filter(ok).sort((a, b) => zV(b, rr) - zV(a, rr)).slice(0, 6).forEach(r => console.log('    ', (r.lab + ' = ' + r.k).padEnd(66), 'R1', r.t[2], 'R7', r.t[3], '| nuls', r.t[1], 'sur', r.t[0]));
