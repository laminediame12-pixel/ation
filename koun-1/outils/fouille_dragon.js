// Axe du dragon (2026-11-27) : Rubeus en base de M6 → Cauda Draconis, en M12 → Caput Draconis. Teste si le rouge suit la production de Caput / Cauda en résultante,
// par Rubeus, par une figure « martiale » (Rubeus, Puer) ou par n'importe quelle figure ; puis le camp touché. Contrôle par permutation.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const CAP = 3, CAU = 13, MART = [7, 1];
const S = {
  'Rubeus en base de M6 ou M12': (b, r) => b[6] === 7 || b[12] === 7,
  'Rubeus produit Caput ou Cauda (toute maison)': (b, r) => [...Array(15)].some((_, i) => b[i + 1] === 7 && (r[i + 1] === CAP || r[i + 1] === CAU)),
  'une figure martiale (Rubeus, Puer) produit Caput ou Cauda': (b, r) => [...Array(15)].some((_, i) => MART.includes(b[i + 1]) && (r[i + 1] === CAP || r[i + 1] === CAU)),
  'Caput ET Cauda en résultante (M1–M15)': (b, r) => r.slice(1, 16).includes(CAP) && r.slice(1, 16).includes(CAU),
  'Caput ou Cauda en résultante ≥ 2 fois': (b, r) => r.slice(1, 16).filter(x => x === CAP || x === CAU).length >= 2,
  'Caput ou Cauda en résultante de M6 ou M12': (b, r) => [6, 12].some(h => r[h] === CAP || r[h] === CAU),
  'Rubeus en base (n\'importe où)': (b, r) => b.slice(1, 16).includes(7),
  'Puer en base de M6 ou M12': (b, r) => b[6] === 1 || b[12] === 1,
  'Rubeus en base de M6/M12 ou Puer en base de M6/M12': (b, r) => [6, 12].some(h => b[h] === 7 || b[h] === 1),
};
const y = D.map(d => oui(d.rouge) ? 1 : 0), yp = D.map(d => oui(d.pen) ? 1 : 0), BR = D.map(d => { const L = M.lire(d.m); return [L.theme.bases, L.theme.resultantes]; });
const test = (f, y) => { const X = BR.map(([b, r]) => f(b, r)), n = X.filter(Boolean).length, a = X.reduce((s, x, i) => s + (x ? y[i] : 0), 0), a0 = y.reduce((s, v) => s + v, 0) - a; let k = 0;
  for (let t = 0; t < 3000; t++) { const z = y.slice().sort(() => Math.random() - 0.5); if (X.reduce((s, x, i) => s + (x ? z[i] : 0), 0) >= a) k++; } return { n, a, a0, n0: D.length - n, p: k / 3000 }; };
console.log(D.length + ' matchs · rouge ' + y.reduce((a, b) => a + b, 0) + ' · penalty ' + yp.reduce((a, b) => a + b, 0) + '\n');
for (const [k, f] of Object.entries(S)) { const o = test(f, y), q = test(f, yp); console.log(k.padEnd(58) + o.n.toString().padStart(3) + ' matchs · rouge ' + o.a + ' (' + Math.round(100 * o.a / (o.n || 1)) + ' % contre ' + Math.round(100 * o.a0 / o.n0) + ' %, p ' + o.p.toFixed(3) + ') · penalty ' + q.a + ' (' + Math.round(100 * q.a / (q.n || 1)) + ' % contre ' + Math.round(100 * q.a0 / q.n0) + ' %, p ' + q.p.toFixed(3) + ')'); }
// camp touché quand le dragon est en M6/M12
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, FR = ['A', 'B', 'C', 'D'];
console.log('\ndragon en M6/M12 (Rubeus ou Puer posé en M6 ou M12) — camp touché :');
const camp = {}; D.forEach((d, i) => { const [b, r] = BR[i], L = M.lire(d.m), pos = [6, 12].filter(h => b[h] === 7 || b[h] === 1); if (!pos.length) return;
  const info = pos.map(h => N(b[h]) + ' M' + h + '→' + N(r[h])).join(', '), cl = p => { const f = L[p].figure, z = fr(f); return N(f) + ' (front ' + FR[z] + (z === fr(7) ? ', front de Rubeus' : z === fr(1) ? ', front de Puer' : '') + ')'; };
  const rg = oui(d.rouge) ? d.rouge : '—', pn = oui(d.pen) ? d.pen : '—';
  ['R1', 'R7'].forEach(p => { const z = fr(L[p].figure), cle = pos.map(h => (z === fr(b[h]) ? 'même front que la figure martiale' : ATT[fr(b[h])] === z ? 'attaqué par la figure martiale' : ATT[z] === fr(b[h]) ? 'attaque la figure martiale' : 'allié de la figure martiale')).join('/'); const touche = oui(d.rouge) && (d.rouge.includes(p) || /R1 et R7/.test(d.rouge)); camp[cle] = camp[cle] || [0, 0]; camp[cle][0] += touche ? 1 : 0; camp[cle][1]++; });
  console.log('  ' + (oui(d.rouge) ? '🟥' : '  ') + ' ' + d.nom.padEnd(36) + info.padEnd(34) + 'R1 ' + cl('R1').padEnd(34) + 'R7 ' + cl('R7').padEnd(34) + 'rouge ' + rg + ' · pen ' + pn); });
console.log('\n  pôle selon sa relation à la figure martiale : rouge reçu'); Object.keys(camp).forEach(k => console.log('    ' + k.padEnd(40) + camp[k][0] + '/' + camp[k][1]));
