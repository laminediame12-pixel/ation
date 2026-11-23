// Piste du propriétaire (2026-11-23) : le pôle (R1 ou R7) dont la figure est posée dans plus de fronts différents (A, B, C, D) a tendance à gagner.
// Front d'une maison h : A = 1-5-9-13, B = 2-6-10-14, C = 3-7-11-15, D = 4-8-12-16.
// Variantes testées (toutes annoncées d'avance) : couche (base, résultante, les deux) × mesure (fronts distincts, nombre de maisons).
// Corpus de construction (80 matchs) puis jugement à part sur les 26 matchs à l'aveugle ; test de permutation sur le maximum des variantes.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const corpus = [...tous.values()], aveugle = lire('validation/resultats-aveugles-2026-11-23.json').matchs.map(x => ({ m: x.theme, sc: x.score }));
const fr = h => (h - 1) % 4;
function places(L, f, couche) { const T = L.theme, out = []; for (let h = 1; h <= 16; h++) { const b = T.bases[h] === f, r = h < 16 && T.resultantes[h] === f; if ((couche !== 'résultante' && b) || (couche !== 'base' && r)) out.push(h); } return out; }
const VAR = {};
for (const c of ['base', 'résultante', 'base + résultante']) {
  VAR[c + ' · fronts distincts'] = (L, p) => new Set(places(L, L[p].figure, c).map(fr)).size;
  VAR[c + ' · nombre de maisons'] = (L, p) => places(L, L[p].figure, c).length;
}
function signes(D, f) { return D.map(d => { const L = M.lire(d.m); return Math.sign(f(L, 'R1') - f(L, 'R7')); }); }
const res = D => D.map(d => Math.sign(d.sc[0] - d.sc[1]));
function bilan(s, r) { let ok = 0, ko = 0, nul = 0, eg = 0; s.forEach((v, i) => { if (!v) eg++; else if (!r[i]) nul++; else if (v === r[i]) ok++; else ko++; }); return { ok, ko, nul, eg }; }
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
for (const [nom, D] of [['CORPUS DE CONSTRUCTION', corpus], ['MATCHS À L\'AVEUGLE', aveugle]]) {
  const r = res(D); console.log('\n' + nom + ' (' + D.length + ' matchs, ' + r.filter(x => !x).length + ' nuls) — le pôle présent dans plus de fronts gagne :');
  const S = {}; let best = 0;
  for (const [k, f] of Object.entries(VAR)) { S[k] = signes(D, f); const b = bilan(S[k], r), z = (b.ok - b.ko) / Math.sqrt(b.ok + b.ko || 1); best = Math.max(best, Math.abs(z));
    console.log('   ', k.padEnd(36), b.ok, 'justes,', b.ko, 'faux,', b.nul, 'nuls · égalité (pas d\'appel)', b.eg, ' → ', b.ok + b.ko ? Math.round(100 * b.ok / (b.ok + b.ko)) + ' %' : '—'); }
  let g = 0; const N = 5000; for (let t = 0; t < N; t++) { const q = mel(r); let m = 0; for (const k in S) { const b = bilan(S[k], q); m = Math.max(m, Math.abs((b.ok - b.ko) / Math.sqrt(b.ok + b.ko || 1))); } if (m >= best) g++; }
  console.log('    meilleure variante atteinte par hasard (résultats mélangés) dans', (100 * g / N).toFixed(1), '% des cas');
}
// répartition de l'écart de fronts (base + résultante) sur les 106 matchs
const T106 = corpus.concat(aveugle), t = {}; T106.forEach(d => { const L = M.lire(d.m), f = VAR['base + résultante · fronts distincts'], e = f(L, 'R1') - f(L, 'R7'), r = Math.sign(d.sc[0] - d.sc[1]); t[e] = t[e] || [0, 0, 0]; t[e][r === 1 ? 0 : r === 0 ? 1 : 2]++; });
console.log('\nÉcart fronts R1 − R7 (base + résultante), 106 matchs : victoire R1 / nul / victoire R7');
Object.keys(t).sort((a, b) => a - b).forEach(e => console.log('   ', (e > 0 ? '+' : '') + e, ' ', t[e].join(' / ')));
