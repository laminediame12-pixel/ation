// Criblage large de la piste des points rouges (2026-11-24).
// Point rouge en maison h < 16, niveau l : base impaire ET figure de la maison impaire sur l (la résultante passe à 2 points sur ce niveau).
// Groupes de maisons liés à un pôle (figure f, maison m) × comptage (rouges, actifs de la base, rouges par niveau) × cible :
//   vainqueur (le pôle qui en a le plus gagne), buts du pôle (corrélation, égalité exacte compte = buts), nul (égalité des deux pôles).
// Contrôles : maximum sur toutes les lectures comparé aux mélanges de résultats ; validation en laissant un match de côté ; 26 matchs à l'aveugle.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const corpus = [...tous.values()], aveugle = lire('validation/resultats-aveugles-2026-11-23.json').matchs.map(x => ({ m: x.theme, sc: x.score }));
const NIV = ['Feu', 'Air', 'Eau', 'Terre'], mod = n => ((n - 1) % 16 + 16) % 16 + 1, imp = f => K.niveaux(f).map(v => v === 1 ? 1 : 0);
const frontDe = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const bin = f => K.binome(f), ant = f => mod(f - 3), pro = f => mod(f - 6);
// groupes : fonction (T, c) → liste de maisons
const absentsBase = T => { const s = new Set(); for (let h = 1; h <= 16; h++) s.add(T.bases[h]); return [...Array(16)].map((_, i) => i + 1).filter(f => !s.has(f)); };
const absentsTout = T => { const s = new Set(); for (let h = 1; h <= 16; h++) { s.add(T.bases[h]); if (h < 16) s.add(T.resultantes[h]); } return [...Array(16)].map((_, i) => i + 1).filter(f => !s.has(f)); };
const poses = (T, f) => { const o = []; for (let h = 1; h <= 16; h++) if (T.bases[h] === f || (h < 16 && T.resultantes[h] === f)) o.push(h); return o; };
const GR = {
  'maison du pôle': (T, c) => [c.maison],
  'maisons où la figure du pôle est posée': (T, c) => poses(T, c.figure),
  'front du pôle (4 maisons)': (T, c) => frontDe(c.figure),
  'front de la maison du pôle': (T, c) => frontDe(c.maison),
  'front du binôme': (T, c) => frontDe(bin(c.figure)),
  'front de l\'antagoniste': (T, c) => frontDe(ant(c.figure)),
  'maisons du binôme, antagoniste, protecteur': (T, c) => [bin(c.figure), ant(c.figure), pro(c.figure)],
  'figures du front du pôle absentes des bases (maison au repos)': (T, c) => frontDe(c.figure).filter(g => absentsBase(T).includes(g)),
  'figures du front du pôle absentes du thème (maison au repos)': (T, c) => frontDe(c.figure).filter(g => absentsTout(T).includes(g)),
  'figures du front du pôle présentes (maison au repos)': (T, c) => frontDe(c.figure).filter(g => !absentsBase(T).includes(g)),
  'figures absentes des bases, front du pôle ou du binôme': (T, c) => frontDe(c.figure).concat(frontDe(bin(c.figure))).filter(g => absentsBase(T).includes(g)),
};
const CPT = { 'rouges': (T, h) => h < 16 ? imp(T.bases[h]).reduce((s, v, i) => s + (v && imp(h)[i] ? 1 : 0), 0) : 0, 'actifs de la base': (T, h) => imp(T.bases[h]).reduce((a, b) => a + b, 0) };
NIV.forEach((n, l) => { CPT['rouge ' + n] = (T, h) => h < 16 && imp(T.bases[h])[l] && imp(h)[l] ? 1 : 0; CPT['actif ' + n + ' de la base'] = (T, h) => imp(T.bases[h])[l]; });
const LECT = {}; for (const g in GR) for (const c in CPT) LECT[g + ' · ' + c] = (T, p) => GR[g](T, p).reduce((s, h) => s + CPT[c](T, h), 0);
const valeurs = D => D.map(d => { const L = M.lire(d.m), T = L.theme, o = {}; for (const k in LECT) o[k] = [LECT[k](T, L.R1), LECT[k](T, L.R7)]; return o; });
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
const corr = (x, y) => { const n = x.length, mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n; let a = 0, b = 0, c = 0; for (let i = 0; i < n; i++) { a += (x[i] - mx) * (y[i] - my); b += (x[i] - mx) ** 2; c += (y[i] - my) ** 2; } return b && c ? a / Math.sqrt(b * c) : 0; };
const VC = valeurs(corpus), VA = valeurs(aveugle), keys = Object.keys(LECT);
const rC = corpus.map(d => Math.sign(d.sc[0] - d.sc[1])), rA = aveugle.map(d => Math.sign(d.sc[0] - d.sc[1]));
const zV = (V, k, rr, skip) => { let a = 0, b = 0; V.forEach((o, i) => { if (i === skip) return; const s = Math.sign(o[k][0] - o[k][1]); if (s && rr[i]) { if (s === rr[i]) a++; else b++; } }); return { a, b, z: (a - b) / Math.sqrt(a + b || 1) }; };
const cB = (V, k, g) => corr(V.flatMap(o => o[k]), g);
const exact = (V, k, D) => { let n = 0; V.forEach((o, i) => { if (o[k][0] === D[i].sc[0]) n++; if (o[k][1] === D[i].sc[1]) n++; }); return n; };
const nulZ = (V, k, D) => { let eq = 0, eqn = 0; V.forEach((o, i) => { if (o[k][0] === o[k][1]) { eq++; if (D[i].sc[0] === D[i].sc[1]) eqn++; } }); return { eq, eqn }; };
console.log(corpus.length + ' matchs, ' + keys.length + ' lectures par pôle (' + Object.keys(GR).length + ' groupes × ' + Object.keys(CPT).length + ' comptages)\n');
const NP = +process.argv[2] || 1000, GC = corpus.flatMap(d => d.sc);
// 1. vainqueur
const oV = Math.max(...keys.map(k => Math.abs(zV(VC, k, rC).z))); let gV = 0;
// 2. buts du pôle
const oG = Math.max(...keys.map(k => Math.abs(cB(VC, k, GC)))); let gG = 0;
for (let t = 0; t < NP; t++) { const p = mel([...corpus.keys()]), rr = p.map(i => rC[i]), gg = p.flatMap(i => corpus[i].sc); if (Math.max(...keys.map(k => Math.abs(zV(VC, k, rr).z))) >= oV) gV++; if (Math.max(...keys.map(k => Math.abs(cB(VC, k, gg)))) >= oG) gG++; }
console.log('1. VAINQUEUR — meilleure lecture atteinte par hasard dans ' + (100 * gV / NP).toFixed(1) + ' % des mélanges');
keys.map(k => ({ k, ...zV(VC, k, rC), av: zV(VA, k, rA) })).sort((x, y) => Math.abs(y.z) - Math.abs(x.z)).slice(0, 8).forEach(o => console.log('    ', o.k.padEnd(84), o.a + '/' + o.b, (o.z < 0 ? '(le MOINS gagne)' : '').padEnd(16), '| aveugle ' + o.av.a + '/' + o.av.b));
{ let ok = 0, ko = 0; for (let i = 0; i < corpus.length; i++) { let m = 0, kk = null, sg = 1; for (const k of keys) { const z = zV(VC, k, rC, i).z; if (Math.abs(z) > m) { m = Math.abs(z); kk = k; sg = Math.sign(z); } } const p = Math.sign(VC[i][kk][0] - VC[i][kk][1]) * sg; if (p && rC[i]) { if (p === rC[i]) ok++; else ko++; } } console.log('    validation (meilleure lecture choisie sans le match) :', ok, 'justes,', ko, 'faux'); }
console.log('\n2. BUTS DU PÔLE — meilleure corrélation atteinte par hasard dans ' + (100 * gG / NP).toFixed(1) + ' % des mélanges');
const GA = aveugle.flatMap(d => d.sc);
keys.map(k => ({ k, c: cB(VC, k, GC), a: cB(VA, k, GA), ex: exact(VC, k, corpus) })).sort((x, y) => Math.abs(y.c) - Math.abs(x.c)).slice(0, 8).forEach(o => console.log('    ', o.k.padEnd(84), 'corr.', o.c.toFixed(2), '| aveugle', o.a.toFixed(2), '| compte = buts exactement :', o.ex + '/160'));
const exM = keys.map(k => ({ k, ex: exact(VC, k, corpus) })).sort((a, b) => b.ex - a.ex)[0];
const base0 = GC.filter(g => g === 0).length, base1 = GC.filter(g => g === 1).length;
console.log('    meilleur « compte = buts » :', exM.k, exM.ex + '/160 (référence : dire toujours 1 but donne ' + base1 + '/160, toujours 0 : ' + base0 + '/160)');
// 3. nul
const p0 = rC.filter(x => !x).length / corpus.length;
console.log('\n3. NUL — égalité des deux pôles (taux de nul de base ' + Math.round(100 * p0) + ' %)');
keys.map(k => ({ k, ...nulZ(VC, k, corpus), av: nulZ(VA, k, aveugle) })).filter(o => o.eq >= 10).map(o => ({ ...o, z: (o.eqn - o.eq * p0) / Math.sqrt(o.eq * p0 * (1 - p0)) })).sort((a, b) => b.z - a.z).slice(0, 5).forEach(o => console.log('    ', o.k.padEnd(84), o.eqn + ' nuls sur ' + o.eq + ' égalités | aveugle ' + o.av.eqn + '/' + o.av.eq));
