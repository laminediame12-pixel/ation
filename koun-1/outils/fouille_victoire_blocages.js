// Victoire par les blocages (piste du propriétaire, 2026-11-27) : le vainqueur est le pôle dont le camp fait le plus de blocages à l'adversaire.
// Exemple : Paris – Marseille, Populus (R1) posé en M4 y reproduit Albus, antagoniste de Rubeus (R7) → blocage de R7.
// Blocage de q : son antagoniste A = f(q) − 3 est posé en base intact (règle du moteur), ou produit en résultante. Plusieurs comptages comparés.
// Développement sur les 126 matchs de la recherche ; test à l'aveugle sur les matchs du 26 novembre (validation/resultats-2026-11-26.json).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const dev = new Map(), aj = (t, s, nom) => { const k = t.join('-'); if (!dev.has(k)) dev.set(k, { m: t, sc: s, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match)));
const test = lire('validation/resultats-2026-11-26.json').matchs.map(x => ({ m: x.theme, sc: x.score, nom: x.match }));
const DEV = [...dev.values()];
const fr = f => (f - 1) % 4, boucle = f => [0, 4, 8, 12].map(x => fr(f) + 1 + x), intact = (g, h) => g !== 16 && K.niveaux(g).every((v, l) => v !== 1 || K.niveaux(h)[l] === 2);
function comptes(m) { const L = M.lire(m), b = L.theme.bases, r = L.theme.resultantes, P = { R1: L.R1.figure, R7: L.R7.figure }, adv = p => p === 'R1' ? 'R7' : 'R1', c = {};
  for (const q of ['R1', 'R7']) { const p = adv(q), A = mod(P[q] - 3), A2 = mod(mod(P[q] + 4) - 3), camp = boucle(P[p]), fam = [P[p], mod(P[p] + 4), mod(P[p] - 6), 16];
    const H15 = [...Array(15)].map((_, i) => i + 1), H16 = [...H15, 16];
    c[q] = {
      'A base intacte (règle du moteur)': M.blocages(L, q).length,
      'B Populus reproduit l\'antagoniste (Populus en base de la maison A)': H15.filter(h => b[h] === 16 && h === A).length,
      'D antagoniste produit en résultante (toute base)': H15.filter(h => r[h] === A).length,
      'E résultante = antagoniste, base dans la boucle du front adverse': H15.filter(h => r[h] === A && camp.includes(b[h])).length,
      'F résultante = antagoniste, base = pôle adverse, son front direct, son protecteur ou Populus': H15.filter(h => r[h] === A && fam.includes(b[h])).length,
      'G antagoniste en base intact ou en résultante': H16.filter(h => b[h] === A && (h === 16 || intact(A, h))).length + H15.filter(h => r[h] === A).length,
      'H A + B': M.blocages(L, q).length + H15.filter(h => b[h] === 16 && h === A).length,
      'I antagoniste présent en base (intact ou non)': H16.filter(h => b[h] === A).length,
      'J pôle et front direct : antagonistes en résultante': H15.filter(h => r[h] === A || r[h] === A2).length,
      'K pôle et front direct : antagonistes en base intacts ou en résultante': H16.filter(h => (b[h] === A && (h === 16 || intact(A, h))) || (b[h] === A2 && (h === 16 || intact(A2, h)))).length + H15.filter(h => r[h] === A || r[h] === A2).length,
    }; }
  return c; }
const noms = Object.keys(comptes([1, 2, 3, 4]).R1);
const juge = (S, k) => { let n = 0, ok = 0, nul = 0, r1 = 0, okR1 = 0; S.forEach(d => { const c = comptes(d.m), a = c.R1[k], b = c.R7[k]; if (a === b) return; const w = a < b ? 1 : -1, r = Math.sign(d.sc[0] - d.sc[1]); n++; if (r === 0) nul++; else if (r === w) ok++; if (r === 1) okR1++; }); return { n, ok, nul, okR1 }; };
console.log('dev ' + DEV.length + ' matchs · test (26 novembre) ' + test.length + ' matchs\n');
console.log('comptage'.padEnd(84) + 'développement (126)                  | test à l\'aveugle (26/11)');
noms.forEach(k => { const a = juge(DEV, k), t = juge(test, k);
  const f = o => (o.ok + '/' + (o.n - o.nul) + ' décidés (' + (o.n - o.nul ? Math.round(100 * o.ok / (o.n - o.nul)) : 0) + ' %)').padEnd(20) + ('nuls ' + o.nul + ', R1 ' + o.okR1).padEnd(15);
  console.log('  ' + k.padEnd(82) + f(a) + ' | ' + f(t)); });
const base = S => { const d = S.filter(x => x.sc[0] !== x.sc[1]); return d.filter(x => x.sc[0] > x.sc[1]).length + '/' + d.length; };
console.log('\n  « R1 gagne toujours » : développement ' + base(DEV) + ' décidés · test ' + base(test) + ' décidés');
// détail par côté : quand le comptage désigne R1 / désigne R7
console.log('\ndétail par côté (développement) : désigne R1 → R1 gagne · désigne R7 → R7 gagne (matchs décidés)');
noms.forEach(k => { let a1 = 0, n1 = 0, a7 = 0, n7 = 0; DEV.forEach(d => { const c = comptes(d.m), x = c.R1[k], y = c.R7[k], r = Math.sign(d.sc[0] - d.sc[1]); if (x === y || r === 0) return; if (x < y) { n1++; if (r > 0) a1++; } else { n7++; if (r < 0) a7++; } });
  console.log('  ' + k.padEnd(82) + ('R1 ' + a1 + '/' + n1 + ' (' + Math.round(100 * a1 / (n1 || 1)) + ' %)').padEnd(16) + 'R7 ' + a7 + '/' + n7 + ' (' + Math.round(100 * a7 / (n7 || 1)) + ' %)'); });
// moteur actuel, pour référence
const dec = S => { let ok = 0, n = 0; S.forEach(d => { const r = Math.sign(d.sc[0] - d.sc[1]); if (!r) return; const v = M.verdict(M.lire(d.m)).decision.resultat; if (v === 'N') return; n++; if ((v === '1') === (r > 0)) ok++; }); return ok + '/' + n; };
console.log('\n  décision actuelle du moteur (matchs décidés, égalités annoncées exclues) : développement ' + dec(DEV) + ' · test ' + dec(test));
// R1 gagne selon l'écart (blocages contre R7 − blocages contre R1), tous matchs du développement (nuls comptés à part)
console.log('\nvictoire de R1 selon l\'écart de blocages (contre R7 − contre R1), développement :');
for (const k of noms.filter(k => /^[DEFG] /.test(k))) { const T = {}; DEV.forEach(d => { const c = comptes(d.m), e = Math.max(-2, Math.min(2, c.R7[k] - c.R1[k])), r = Math.sign(d.sc[0] - d.sc[1]); T[e] = T[e] || [0, 0, 0]; T[e][r > 0 ? 0 : r === 0 ? 1 : 2]++; });
  console.log('  ' + k.slice(0, 60).padEnd(60) + Object.keys(T).sort((a, b) => a - b).map(e => (e > 0 ? '+' : '') + e + ' : R1 ' + T[e][0] + ' · nul ' + T[e][1] + ' · R7 ' + T[e][2]).join('  |  ')); }
// protecteur au sens strict (f − 6) : il bloque l'antagoniste du pôle ; le pôle le mieux protégé gagne-t-il ?
console.log('\nprotecteur au sens strict (f − 6, il bloque l\'antagoniste du pôle) :');
const prot = (m, kind) => { const L = M.lire(m), b = L.theme.bases, r = L.theme.resultantes, o = {}; for (const p of ['R1', 'R7']) { const Pr = mod(L[p].figure - 6); o[p] = kind === 'intact' ? [...Array(16)].filter((_, i) => b[i + 1] === Pr && (i + 1 === 16 || intact(Pr, i + 1))).length : kind === 'base' ? b.slice(1).filter(g => g === Pr).length : r.slice(1, 16).filter(g => g === Pr).length; } return o; };
for (const kind of ['intact', 'base', 'résultante']) { let a1 = 0, n1 = 0, a7 = 0, n7 = 0; DEV.forEach(d => { const o = prot(d.m, kind), r = Math.sign(d.sc[0] - d.sc[1]); if (o.R1 === o.R7 || !r) return; if (o.R1 > o.R7) { n1++; if (r > 0) a1++; } else { n7++; if (r < 0) a7++; } });
  console.log('  protecteur ' + kind.padEnd(12) + ': mieux protégé R1 → R1 gagne ' + a1 + '/' + n1 + ' · mieux protégé R7 → R7 gagne ' + a7 + '/' + n7); }
const KF = noms.find(k => k.startsWith('F ')), eF = m => { const c = comptes(m); return c.R7[KF] - c.R1[KF]; };
console.log('\nrègle F (R1 gagne si le camp de R1 produit plus d\'antagonistes de R7 que l\'inverse) :');
for (const [lab, S] of [['développement', DEV], ['test 26/11', test]]) { const T = { plus: [0, 0, 0], zero: [0, 0, 0], moins: [0, 0, 0] }; S.forEach(d => { const e = eF(d.m), k = e > 0 ? 'plus' : e < 0 ? 'moins' : 'zero', r = Math.sign(d.sc[0] - d.sc[1]); T[k][r > 0 ? 0 : r === 0 ? 1 : 2]++; });
  console.log('  ' + lab.padEnd(14) + Object.entries(T).map(([k, v]) => k + ' : R1 ' + v[0] + ' · nul ' + v[1] + ' · R7 ' + v[2]).join('  |  ')); }
// zone d'équilibre (écart 0) : la décision actuelle et les autres signes du moteur départagent-ils ?
console.log('\nzone d\'équilibre (écart F = 0), développement :');
const Z = DEV.filter(d => eF(d.m) === 0 && d.sc[0] !== d.sc[1]);
const sig = {
  'décision actuelle du moteur': d => { const v = M.verdict(M.lire(d.m)).decision.resultat; return v === 'N' ? null : v === '1' ? 1 : -1; },
  'un seul pôle marque → lui': d => { const L = M.lire(d.m), a = M.marquePole(L, 'R1').marque, b = M.marquePole(L, 'R7').marque; return a === b ? null : a ? 1 : -1; },
  'pôle bloqué (moteur) → l\'autre gagne': d => { const L = M.lire(d.m), a = M.blocages(L, 'R1').length > 0, b = M.blocages(L, 'R7').length > 0; return a === b ? null : a ? -1 : 1; },
  'front qui attaque → lui': d => { const L = M.lire(d.m), f1 = fr(L.R1.figure), f7 = fr(L.R7.figure), AT = { 0: 3, 1: 0, 3: 2, 2: 1 }; return AT[f1] === f7 ? 1 : AT[f7] === f1 ? -1 : null; },
  'antagoniste produit en résultante (D) → le moins touché': d => { const c = comptes(d.m), k = noms.find(x => x.startsWith('D ')); return c.R1[k] === c.R7[k] ? null : c.R1[k] < c.R7[k] ? 1 : -1; },
  'base intacte (A) → le moins touché': d => { const c = comptes(d.m), k = noms.find(x => x.startsWith('A ')); return c.R1[k] === c.R7[k] ? null : c.R1[k] < c.R7[k] ? 1 : -1; } };
for (const [k, f] of Object.entries(sig)) { let ok = 0, n = 0; Z.forEach(d => { const v = f(d); if (v === null) return; n++; if (v === Math.sign(d.sc[0] - d.sc[1])) ok++; }); console.log('  ' + k.padEnd(56) + ok + '/' + n + ' (' + Math.round(100 * ok / (n || 1)) + ' %) sur ' + Z.length + ' matchs décidés de la zone'); }
// détail des blocages F : qui produit l'antagoniste, où
const detF = m => { const L = M.lire(m), b = L.theme.bases, r = L.theme.resultantes, P = { R1: L.R1.figure, R7: L.R7.figure }, out = {};
  for (const q of ['R1', 'R7']) { const p = q === 'R1' ? 'R7' : 'R1', A = mod(P[q] - 3), fam = { [P[p]]: 'pôle ' + p, [mod(P[p] + 4)]: 'front direct de ' + p, [mod(P[p] - 6)]: 'protecteur de ' + p, 16: 'Populus' };
    out[q] = [...Array(15)].map((_, i) => i + 1).filter(h => r[h] === A && fam[b[h]] !== undefined).map(h => N(b[h]) + ' (' + fam[b[h]] + ') en M' + h + ' → ' + N(A)); } return out; };
console.log('\ncas où le camp de R7 bloque plus (écart F < 0), tous matchs :');
[...DEV, ...test].filter(d => eF(d.m) < 0).forEach(d => { const L = M.lire(d.m), x = detF(d.m), r = Math.sign(d.sc[0] - d.sc[1]); console.log('  ' + (r > 0 ? 'R1 gagne ' : r < 0 ? 'R7 gagne ' : 'nul      ') + d.nom.padEnd(34) + ' R1 ' + N(L.R1.figure).padEnd(14) + ' R7 ' + N(L.R7.figure).padEnd(14) + ' contre R1 : ' + x.R1.join(', ') + (x.R7.length ? ' | contre R7 : ' + x.R7.join(', ') : '')); });
console.log('\ncas où le camp de R1 bloque plus (écart F > 0), tous matchs :');
[...DEV, ...test].filter(d => eF(d.m) > 0).forEach(d => { const L = M.lire(d.m), x = detF(d.m), r = Math.sign(d.sc[0] - d.sc[1]); console.log('  ' + (r > 0 ? 'R1 gagne ' : r < 0 ? 'R7 gagne ' : 'nul      ') + d.nom.padEnd(34) + ' R1 ' + N(L.R1.figure).padEnd(14) + ' R7 ' + N(L.R7.figure).padEnd(14) + ' contre R7 : ' + x.R7.join(', ') + (x.R1.length ? ' | contre R1 : ' + x.R1.join(', ') : '')); });
// F1 : camp = pôle, front direct, protecteur (Populus seulement s'il est la figure du pôle) ; Populus neutre compté à part
const fam1 = (L, p) => [L[p].figure, mod(L[p].figure + 4), mod(L[p].figure - 6)];
const cF1 = m => { const L = M.lire(m), b = L.theme.bases, r = L.theme.resultantes, o = { R1: 0, R7: 0, popR1: 0, popR7: 0 };
  for (const q of ['R1', 'R7']) { const p = q === 'R1' ? 'R7' : 'R1', A = mod(L[q].figure - 3), F = fam1(L, p); for (let h = 1; h <= 15; h++) if (r[h] === A) { if (F.includes(b[h])) o[q]++; else if (b[h] === 16) o['pop' + q]++; } } return o; };
console.log('\nF1 (Populus au pôle dont il est la figure ; Populus neutre à part) :');
for (const [lab, S] of [['développement', DEV], ['test 26/11', test]]) { const T = {}; S.forEach(d => { const o = cF1(d.m), e = o.R7 - o.R1, k = e > 0 ? 'camp de R1 bloque plus' : e < 0 ? 'camp de R7 bloque plus' : 'égalité', r = Math.sign(d.sc[0] - d.sc[1]); T[k] = T[k] || [0, 0, 0]; T[k][r > 0 ? 0 : r === 0 ? 1 : 2]++; });
  console.log('  ' + lab.padEnd(14) + Object.entries(T).map(([k, v]) => k + ' : R1 ' + v[0] + ' · nul ' + v[1] + ' · R7 ' + v[2]).join('  |  ')); }
{ const T = {}; [...DEV, ...test].forEach(d => { const o = cF1(d.m), k = (o.popR1 + o.popR7) > 0 ? 'Populus neutre produit un antagoniste' : 'non', r = Math.sign(d.sc[0] - d.sc[1]); T[k] = T[k] || [0, 0, 0]; T[k][r > 0 ? 0 : r === 0 ? 1 : 2]++; }); console.log('  tous matchs : ' + Object.entries(T).map(([k, v]) => k + ' → R1 ' + v[0] + ' · nul ' + v[1] + ' · R7 ' + v[2]).join('  |  ')); }
// stratégies de décision (tous matchs, nuls comptés faux)
console.log('\nstratégies de décision (justes sur tous les matchs ; un nul compte faux) :');
const verd = m => { const v = M.verdict(M.lire(m)).decision.resultat; return v === 'N' ? 0 : v === '1' ? 1 : -1; };
const strat = {
  'R1 toujours': d => 1, 'décision actuelle du moteur': d => verd(d.m),
  'F > 0 → R1 ; sinon décision actuelle': d => eF(d.m) > 0 ? 1 : verd(d.m),
  'F1 > 0 → R1 ; sinon décision actuelle': d => { const o = cF1(d.m); return o.R7 > o.R1 ? 1 : verd(d.m); },
  'F > 0 → R1 ; sinon R1': d => 1,
  'F ≠ 0 → R1 ; F = 0 → R7': d => eF(d.m) !== 0 ? 1 : -1 };
for (const [k, f] of Object.entries(strat)) { const sc = S => S.filter(d => f(d) === Math.sign(d.sc[0] - d.sc[1])).length + '/' + S.length; console.log('  ' + k.padEnd(44) + 'développement ' + sc(DEV).padEnd(9) + ' test ' + sc(test)); }
