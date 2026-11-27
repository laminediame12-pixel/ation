// Camp qui reçoit le rouge (2026-11-27) : pour chaque rouge, chaque pôle — bloqué (maisons et niveaux du bloqueur), relation à la figure martiale du dragon
// (M6/M12), maison, marquage — puis règles candidates du camp testées sur tous les rouges à un seul camp.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, FR = 'ABCD', NV = ['F', 'A', 'E', 'T'], act = g => [0, 1, 2, 3].filter(l => K.niveaux(g)[l] === 1);
const relM = (z, g) => z === g ? 'même' : ATT[g] === z ? 'attaqué' : ATT[z] === g ? 'attaque' : 'allié';
const rouges = D.filter(d => oui(d.rouge) && !/R1 et R7|les deux/.test(d.rouge));
const P = []; rouges.forEach(d => { const L = M.lire(d.m), b = L.theme.bases, rec = d.rouge.includes('R1') ? 'R1' : 'R7', drag = [6, 12].filter(h => b[h] === 7 || b[h] === 1);
  const info = p => { const f = L[p].figure, B = M.blocages(L, p), A = mod(f - 3); return { p, f, B, niv: act(A).map(l => NV[l]).join(''), rel: drag.map(h => relM(fr(f), fr(b[h]))).join('/'), maison: L[p].maison, marque: M.marquePole(L, p).niveau }; };
  const i1 = info('R1'), i7 = info('R7'); P.push({ d, rec, i1, i7, drag });
  const t = i => i.p + ' ' + N(i.f).padEnd(14) + (i.B.length ? 'bloqué M' + i.B.join(',M') + ' (' + i.niv + ')' : 'libre').padEnd(20) + (i.rel ? 'dragon:' + i.rel : '').padEnd(16) + i.marque.padEnd(9);
  console.log((rec === 'R1' ? '→R1 ' : '→R7 ') + d.nom.padEnd(34) + t(i1) + ' | ' + t(i7)); });
const regles = {
  'le pôle bloqué reçoit (si un seul bloqué)': x => { const b1 = x.i1.B.length > 0, b7 = x.i7.B.length > 0; return b1 !== b7 ? (b1 ? 'R1' : 'R7') : null; },
  'le pôle libre reçoit (si un seul bloqué)': x => { const b1 = x.i1.B.length > 0, b7 = x.i7.B.length > 0; return b1 !== b7 ? (b1 ? 'R7' : 'R1') : null; },
  'le pôle qui ne marque pas reçoit': x => { const m1 = x.i1.marque !== 'non', m7 = x.i7.marque !== 'non'; return m1 !== m7 ? (m1 ? 'R7' : 'R1') : null; },
  'le pôle qui marque reçoit': x => { const m1 = x.i1.marque !== 'non', m7 = x.i7.marque !== 'non'; return m1 !== m7 ? (m1 ? 'R1' : 'R7') : null; },
  'dragon : le pôle de même front que la figure martiale reçoit': x => x.drag.length ? (x.i1.rel.includes('même') !== x.i7.rel.includes('même') ? (x.i1.rel.includes('même') ? 'R1' : 'R7') : null) : null,
  'dragon : le pôle non allié reçoit': x => x.drag.length ? (x.i1.rel.includes('allié') !== x.i7.rel.includes('allié') ? (x.i1.rel.includes('allié') ? 'R7' : 'R1') : null) : null,
  'R7 reçoit toujours': x => 'R7', 'R1 reçoit toujours': x => 'R1' };
console.log('\nrègles du camp (rouges à un seul camp : ' + P.length + ')'); for (const [k, f] of Object.entries(regles)) { let ok = 0, n = 0; P.forEach(x => { const c = f(x); if (!c) return; n++; if (c === x.rec) ok++; }); console.log('  ' + k.padEnd(58) + ok + '/' + n); }
// piste : niveau Terre du bloqueur
console.log('\nun seul pôle bloqué — le bloqueur bloque-t-il la Terre ?');
P.forEach(x => { const b1 = x.i1.B.length > 0, b7 = x.i7.B.length > 0; if (b1 === b7) return; const i = b1 ? x.i1 : x.i7; console.log('  ' + x.d.nom.padEnd(34) + 'bloqué ' + i.p + ' (' + i.niv + ', M' + i.B.join(',M') + ')'.padEnd(10) + ' → rouge pour ' + x.rec + (x.rec === i.p ? ' (le bloqué)' : ' (l\'adversaire)')); });
// règle hiérarchique du camp
const FILLES = [5, 6, 7, 8];
const camp = x => { const v = []; for (const i of [x.i1, x.i7]) if (i.B.length) { const adv = i.p === 'R1' ? 'R7' : 'R1'; v.push(i.B.some(h => FILLES.includes(h)) ? adv : i.p); }
  if (v.length) { const c1 = v.filter(c => c === 'R1').length, c7 = v.length - c1; if (c1 !== c7) return [c1 > c7 ? 'R1' : 'R7', 'blocage']; }
  if (x.drag.length) { const m1 = x.i1.rel.includes('même'), m7 = x.i7.rel.includes('même'); if (m1 !== m7) return [m1 ? 'R1' : 'R7', 'dragon (même front que la figure martiale)']; }
  return ['R7', 'par défaut (R7)']; };
console.log('\nrègle du camp : 1) pôle bloqué → lui, sauf bloqueur dans les Filles (M5–M8) → l\'adversaire ; 2) sinon dragon → le pôle de même front que la figure martiale ; 3) sinon R7');
let ok = 0; const parV = {}; P.forEach(x => { const [c, v] = camp(x), j = c === x.rec; ok += j; parV[v] = parV[v] || [0, 0]; parV[v][0] += j; parV[v][1]++; console.log('  ' + (j ? '✓' : '✗') + ' ' + x.d.nom.padEnd(34) + 'prévu ' + c + ' (' + v + ') · reçu ' + x.rec); });
console.log('  total ' + ok + '/' + P.length + ' · ' + Object.entries(parV).map(([k, [a, n]]) => k + ' ' + a + '/' + n).join(' · '));
// contrôle : la règle des Filles testée sur les rouges où un pôle est bloqué, comparée à « toujours R7 »
