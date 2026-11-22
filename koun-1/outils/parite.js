// Paradigme parité : points impairs (1) / pairs (2) ; somme = règle 1+2=1, 1+1=2, 2+2=2 (addition des figures).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m) }));
const fr = f => (f - 1) % 4, bin = f => ((f - 1) % 4 < 2 ? f + 2 : f - 2), POP = [...Array(16)].map((_, i) => i + 1).find(f => nm(f) === 'Populus');
const odd = f => K.niveaux(f).map(v => v === 1 ? 1 : 0), nodd = f => odd(f).reduce((a, b) => a + b);
const S = hs => hs.map(x => x).reduce(A);
// ── vérification de structure : somme des 16 bases = M16 ?
let ok16 = 0; for (let m = 0; m < 65536; m++) { const t = [1 + (m & 15), 1 + ((m >> 4) & 15), 1 + ((m >> 8) & 15), 1 + ((m >> 12) & 15)], b = K.construire(t).bases; let s = b[1]; for (let h = 2; h <= 16; h++) s = A(s, b[h]); if (s === b[16]) ok16++; }
console.log('somme des 16 bases = M16 :', ok16, '/ 65536 thèmes');
// ── caractéristiques d'un pôle
function feats(L, c) {
  const T = L.theme, b = T.bases, rz = h => h === 16 ? b[16] : T.resultantes[h], f = c.figure, hp = c.maison;
  const front = (z, g) => [0, 1, 2, 3].map(i => g(z + 1 + 4 * i)).reduce(A);
  const out = {};
  const X = {
    E: A(b[16], f),                                     // énergie expulsée vers les 15 autres maisons
    Fici: front(fr(hp), h => b[h]), Fpropre: front(fr(f), h => b[h]), Fbin: front(fr(bin(f)), h => b[h]),
    rFici: front(fr(hp), rz), rFpropre: front(fr(f), rz), rFbin: front(fr(bin(f)), rz),
  };
  X.T = A(X.Fici, X.Fpropre); X.Tb = A(X.Fici, X.Fbin); X.rT = A(X.rFici, X.rFpropre); X.rTb = A(X.rFici, X.rFbin);
  X.EF = A(X.E, X.Fpropre); X.EB = A(X.E, X.Fbin);
  out.repos = hp === f ? 1 : 0;
  for (const [k, x] of Object.entries(X)) {
    out[k + '=f'] = x === f ? 1 : 0; out[k + '=bin'] = x === bin(f) ? 1 : 0; out[k + '=Pop'] = x === POP ? 1 : 0;
    out[k + ' front f'] = fr(x) === fr(f) ? 1 : 0; out[k + ' front bin'] = fr(x) === fr(bin(f)) ? 1 : 0;
    out[k + ' impairs'] = nodd(x); ['Feu', 'Air', 'Eau', 'Terre'].forEach((n, l) => out[k + ' ' + n + ' impair'] = odd(x)[l]);
    out[k + ' même parité que f'] = x % 2 === f % 2 ? 1 : 0;
  }
  return out;
}
const rows = []; D.forEach((d, i) => { const a = feats(d.L, d.L.R1), e = feats(d.L, d.L.R7); rows.push({ i, p: 'R1', F: a, G: e, g: d.sc[0], o: d.sc[1] }, { i, p: 'R7', F: e, G: a, g: d.sc[1], o: d.sc[0] }); });
const keys = Object.keys(rows[0].F);
// tests : (1) pôle marque >=1 ; (2) pôle marque >=2 ; (3) match : comparaison R1/R7 -> vainqueur ; (4) égalité -> nul
function stats(sc) { // sc[i] = [g1,g2]
  const res = [];
  for (const k of keys) {
    for (const [lab, thr] of [['marque', 1], ['2 buts', 2]]) {
      const vals = [...new Set(rows.map(r => r.F[k]))]; if (vals.length < 2) continue;
      for (const v of vals) { const sel = rows.filter(r => r.F[k] === v), n = sel.length; if (n < 10 || n > rows.length - 10) continue;
        const y = sel.filter(r => sc[r.i][r.p === 'R1' ? 0 : 1] >= thr).length, Y = rows.filter(r => sc[r.i][r.p === 'R1' ? 0 : 1] >= thr).length;
        const p0 = Y / rows.length, z = (y - n * p0) / Math.sqrt(n * p0 * (1 - p0) * (1 - n / rows.length));
        res.push({ t: lab, k: k + ' = ' + v, n, y, z }); }
    }
    // match : signe(R1 - R7) prédit le vainqueur ; égal -> nul
    let ok = 0, ko = 0, nulEg = 0, eg = 0, nul = 0, n = 0;
    D.forEach((d, i) => { const a = rows[2 * i].F[k], e = rows[2 * i + 1].F[k], s = Math.sign(a - e), r = Math.sign(sc[i][0] - sc[i][1]); if (!r) nul++; if (!s) { eg++; if (!r) nulEg++; } else if (r) { if (s === r) ok++; else ko++; } });
    if (ok + ko >= 15) { const z = (ok - (ok + ko) / 2) / Math.sqrt((ok + ko) / 4); res.push({ t: 'vainqueur', k: k + ' (le plus grand gagne)', n: ok + ko, y: ok, z: Math.abs(z), sens: z > 0 ? '+' : '−' }); }
    if (eg >= 10 && eg <= D.length - 10) { const p0 = nul / D.length, z = (nulEg - eg * p0) / Math.sqrt(eg * p0 * (1 - p0) * (1 - eg / D.length)); res.push({ t: 'nul si égal', k: k, n: eg, y: nulEg, z }); }
  }
  return res;
}
const sc0 = D.map(d => d.sc), obs = stats(sc0);
const best = (r, t) => Math.max(...r.filter(x => x.t === t).map(x => Math.abs(x.z)));
const types = ['marque', '2 buts', 'vainqueur', 'nul si égal'];
const N = +process.argv[2] || 200, ge = {}; types.forEach(t => ge[t] = 0);
for (let it = 0; it < N; it++) { const p = sc0.slice(); for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } const r = stats(p); types.forEach(t => { if (best(r, t) >= best(obs, t)) ge[t]++; }); }
console.log(D.length, 'matchs,', rows.length, 'pôles-matchs ;', keys.length, 'caractéristiques par pôle');
types.forEach(t => { const top = obs.filter(x => x.t === t).sort((a, b) => Math.abs(b.z) - Math.abs(a.z)).slice(0, 6);
  console.log('\n## ' + t + ' — le meilleur lien est atteint par hasard dans ' + Math.round(100 * ge[t] / N) + ' % des mélanges');
  top.forEach(x => console.log('  ', x.k.padEnd(40), x.t === 'vainqueur' ? (x.y + ' justes sur ' + x.n + ' ' + (x.sens === '−' ? '(sens inverse : le plus petit gagne)' : '')) : x.y + ' sur ' + x.n, ' z=' + x.z.toFixed(2))); });
