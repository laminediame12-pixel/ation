// La géométrie des 15 figures non neutres (espace projectif de dimension 3 sur deux valeurs) : 35 droites {a, b, a+b}, 15 plans (7 figures chacun).
// Lectures pour le moteur, testées sur les 80 matchs.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const POP = 16, F15 = [...Array(15)].map((_, i) => i + 1);
// droites et plans
const droites = []; for (let a = 1; a <= 15; a++) for (let b = a + 1; b <= 15; b++) { const c = A(a, b); if (c !== POP && c > b) droites.push([a, b, c]); }
const lin = f => K.niveaux(f).map(v => v === 1 ? 1 : 0); // figure → vecteur (1 = impair)
const plans = []; for (let w = 1; w < 16; w++) { const pl = F15.filter(f => (lin(f).reduce((s, v, i) => s + v * ((w >> i) & 1), 0)) % 2 === 0); plans.push({ w, pts: pl }); }
console.log('droites :', droites.length, '· plans :', plans.length, '(7 figures chacun) · chaque figure est sur', droites.filter(d => d.includes(1)).length, 'droites');
const nomPlan = w => { const lv = ['Feu', 'Air', 'Eau', 'Terre'].filter((_, i) => (w >> i) & 1); return lv.length === 1 ? lv[0] + ' pair' : 'parité ' + lv.join('+') + ' paire'; };
console.log('les 4 niveaux sont 4 des 15 plans : « Feu pair », « Air pair », … ; les 11 autres sont des parités de plusieurs niveaux');
// structure exacte : R1, R7 et R1+R7 forment toujours une droite ?
let ligne = 0, n = 0; for (let x = 0; x < 65536; x += 3) { const L = M.lire([1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)]); n++; if (L.R1.figure !== L.R7.figure && L.R1.figure !== POP && L.R7.figure !== POP) ligne++; }
console.log('R1, R7 et R1+R7 forment une droite dès que R1 ≠ R7 et qu\'aucun n\'est Populus :', (100 * ligne / n).toFixed(1) + ' % des thèmes');
// corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), b = L.theme.bases, S = new Set(); for (let h = 1; h <= 16; h++) S.add(b[h]); return { ...d, L, b, S, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]), g: d.sc[0] + d.sc[1] }; });
const lect = {
  'droites entièrement présentes en base': d => droites.filter(l => l.every(f => d.S.has(f))).length,
  'figures distinctes en base (hors Populus)': d => F15.filter(f => d.S.has(f)).length,
  'plans entièrement présents en base': d => plans.filter(p => p.pts.every(f => d.S.has(f))).length,
  'droite des pôles (R1, R7, R1+R7) : points présents en base': d => { const a = d.L.R1.figure, e = d.L.R7.figure, c = A(a, e); return [a, e, c].filter(f => f !== POP && d.S.has(f)).length; },
  'R1+R7 présent en base': d => d.S.has(d.L.lien) ? 'oui' : 'non',
  'figure absente dans le plan de R1 (son plan « niveau »)': d => '—',
};
delete lect['figure absente dans le plan de R1 (son plan « niveau »)'];
// pour chaque pôle : nombre de droites passant par sa figure dont les deux autres points sont posés en base (« soutiens alignés »)
const soutien = (d, f) => droites.filter(l => l.includes(f) && l.filter(x => x !== f).every(x => d.S.has(x))).length;
console.log('\n' + D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls\n');
for (const [k, f] of Object.entries(lect)) { const t = {}; D.forEach(d => { const v = String(f(d)); t[v] = t[v] || [0, 0, 0, 0, 0]; t[v][0]++; t[v][1] += d.nul; if (d.r > 0) t[v][2]++; if (d.r < 0) t[v][3]++; t[v][4] += d.g; }); console.log(k); Object.keys(t).sort((a, b) => +a - +b || a.localeCompare(b)).forEach(v => console.log('    ', v.padEnd(5), 'n', String(t[v][0]).padStart(2), '| nuls', t[v][1], '| R1', t[v][2], 'R7', t[v][3], '| buts/match', (t[v][4] / t[v][0]).toFixed(1))); }
let ok = 0, ko = 0, eg = 0, ne = 0; D.forEach(d => { const s = Math.sign(soutien(d, d.L.R1.figure) - soutien(d, d.L.R7.figure)); if (!s) { eg++; ne += d.nul; } else if (d.r) { if (s === d.r) ok++; else ko++; } });
console.log('\nsoutiens alignés (droites passant par la figure du pôle, ses deux autres points posés) : le pôle le mieux soutenu gagne', ok, 'perd', ko, '| égalité', eg, 'dont', ne, 'nuls');
const rr = D.map(d => d.r); let ge = 0; const s0 = D.map(d => Math.sign(soutien(d, d.L.R1.figure) - soutien(d, d.L.R7.figure)));
for (let t = 0; t < 5000; t++) { const q = rr.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } let a = 0, b = 0; s0.forEach((v, i) => { if (v && q[i]) { if (v === q[i]) a++; else b++; } }); if (Math.abs(a - b) >= Math.abs(ok - ko)) ge++; }
console.log('  écart atteint par hasard dans', (100 * ge / 5000).toFixed(1) + ' % des mélanges');
