// Recherche de la loi de victoire la plus forte, construite uniquement avec les relations du système (demande du propriétaire, 2026-11-24) :
// la figure du pôle elle-même, son antagoniste (f − 3), son protecteur (f − 6), son binôme, sa boucle de parité (figures de même parité, impaire ou paire),
// la boucle de parité opposée, sa boucle de front (f, f+4, f+8, f+12), le front du binôme, le front de l'antagoniste.
// Pour chaque groupe, des états simples : chez elle (posée dans sa propre maison), chez elle en base ou en résultante, posée quelque part,
// absente du thème, dans la maison de son antagoniste (💔), en arrêt (elle est l'antagoniste ancré d'une maison).
// Loi = « le pôle qui a le plus de … gagne » (ou le moins), et les lois nettes « alliés − adversaires ».
// Jugement identique pour toutes : 106 matchs réunis, sens identique exigé sur le corpus et à l'aveugle, contrôle par mélange sur le maximum,
// validation en laissant un match de côté (la loi est choisie sans le match qu'on prédit).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), r: Math.sign(d.sc[0] - d.sc[1]) }));
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, F16 = [...Array(16)].map((_, i) => i + 1);
const bin = f => K.binome(f), front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const parite = f => F16.filter(g => g % 2 === f % 2), opp = f => F16.filter(g => g % 2 !== f % 2);
const GROUPES = {
  'la figure du pôle': f => [f], 'son binôme': f => [bin(f)], 'son antagoniste': f => [mod(f - 3)], 'son protecteur': f => [mod(f - 6)],
  'sa boucle de front': f => front(f), 'le front du binôme': f => front(bin(f)), 'le front de l\'antagoniste': f => front(mod(f - 3)),
  'sa boucle de parité': f => parite(f), 'la boucle de parité opposée': f => opp(f),
};
const ETATS = {
  'chez elles (base)': (T, g) => T.bases[g] === g,
  'chez elles (base ou résultante)': (T, g) => T.bases[g] === g || (g < 16 && T.resultantes[g] === g),
  'posées en base': (T, g) => F16.some(h => T.bases[h] === g),
  'absentes du thème': (T, g) => !F16.some(h => T.bases[h] === g || (h < 16 && T.resultantes[h] === g)),
  'dans la maison de leur antagoniste': (T, g) => T.bases[mod(g - 3)] === g,
  'en arrêt (antagoniste ancré d\'une maison)': (T, g) => mod(g + 3) <= 15 && T.bases[mod(g + 3)] === g,
};
const LOIS = {};
for (const [gn, gf] of Object.entries(GROUPES)) for (const [en, ef] of Object.entries(ETATS)) LOIS[gn + ' · ' + en] = (T, f) => gf(f).filter(g => ef(T, g)).length;
// lois nettes : alliés (figure, binôme, boucle de front) − adversaires (antagoniste, son front), pour chaque état
for (const [en, ef] of Object.entries(ETATS)) {
  LOIS['NET alliés (figure + binôme) − antagoniste · ' + en] = (T, f) => [f, bin(f)].filter(g => ef(T, g)).length - [mod(f - 3)].filter(g => ef(T, g)).length;
  LOIS['NET boucle de front − front de l\'antagoniste · ' + en] = (T, f) => front(f).filter(g => ef(T, g)).length - front(mod(f - 3)).filter(g => ef(T, g)).length;
  LOIS['NET boucle de parité − parité opposée · ' + en] = (T, f) => parite(f).filter(g => ef(T, g)).length - opp(f).filter(g => ef(T, g)).length;
}
const keys = Object.keys(LOIS), V = D.map(d => { const T = d.L.theme, o = {}; for (const k of keys) o[k] = Math.sign(LOIS[k](T, d.L.R1.figure) - LOIS[k](T, d.L.R7.figure)); return o; });
const bil = (k, rr, filt, skip) => { let a = 0, b = 0, n = 0; D.forEach((d, i) => { if (i === skip || (filt && !filt(d))) return; const s = V[i][k]; if (!s) return; n++; if (!rr[i]) return; if (s === rr[i]) a++; else b++; }); return { a, b, n, z: (a - b) / Math.sqrt(a + b || 1) }; };
const r0 = D.map(d => d.r), mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
const res = keys.map(k => { const t = bil(k, r0), c = bil(k, r0, d => d.lot === 'corpus'), v = bil(k, r0, d => d.lot === 'aveugle'); return { k, t, c, v, stable: Math.sign(c.a - c.b) === Math.sign(v.a - v.b) && c.a !== c.b }; });
const NP = +process.argv[2] || 2000, om = Math.max(...res.map(o => Math.abs(o.t.z))); let g = 0;
for (let t = 0; t < NP; t++) { const q = mel(r0); if (Math.max(...keys.map(k => Math.abs(bil(k, q).z))) >= om) g++; }
console.log(D.length + ' matchs, ' + keys.length + ' lois testées (' + Object.keys(GROUPES).length + ' groupes × ' + Object.keys(ETATS).length + ' états, plus ' + (keys.length - Object.keys(GROUPES).length * Object.keys(ETATS).length) + ' lois nettes)\n');
console.log('Les 15 lois les plus fortes sur les 106 matchs (justes / faux quand elle appelle ; corpus ; aveugle) :');
res.sort((x, y) => Math.abs(y.t.z) - Math.abs(x.t.z)).slice(0, 15).forEach(o => { const inv = o.t.a < o.t.b, A = inv ? o.t.b : o.t.a, B = inv ? o.t.a : o.t.b, f = x => inv ? x.b + '/' + x.a : x.a + '/' + x.b;
  console.log('   ', (inv ? '(le MOINS gagne) ' : '') + o.k, '\n        → ' + A + ' justes, ' + B + ' faux (' + Math.round(100 * A / (A + B)) + ' %), ' + o.t.n + ' appels sur 106 · corpus ' + f(o.c) + ' · aveugle ' + f(o.v) + (o.stable ? '' : '  ⚠ sens différent à l\'aveugle')); });
console.log('\nLa meilleure loi est atteinte avec des résultats mélangés dans ' + (100 * g / NP).toFixed(1) + ' % des cas (sur ' + keys.length + ' lois).');
{ let ok = 0, ko = 0; for (let i = 0; i < D.length; i++) { let m = 0, kk = null, sg = 1; for (const k of keys) { const b = bil(k, r0, null, i); if (Math.abs(b.z) > m) { m = Math.abs(b.z); kk = k; sg = Math.sign(b.z); } } const p = V[i][kk] * sg; if (p && r0[i]) { if (p === r0[i]) ok++; else ko++; } }
  console.log('Validation (la loi la plus forte choisie sans le match, puis appliquée à ce match) : ' + ok + ' justes, ' + ko + ' faux.'); }
const r1 = D.filter(d => d.r > 0).length, r7 = D.filter(d => d.r < 0).length; console.log('Référence « R1 gagne toujours » : ' + r1 + ' justes, ' + r7 + ' faux.');
