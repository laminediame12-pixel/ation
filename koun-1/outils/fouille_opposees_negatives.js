// Maisons opposées (axes h / h+6 : M1-M7 … M6-M12, l'axe des pôles R1-R7 compris) et figures négatives (liste classique : Rubeus, Tristitia, Carcer, Amissio,
// Cauda Draconis, Puer ; modifiable avec NEG=7,8,10,6,13,1). Pour chaque axe : figures négatives en base et en résultante des deux maisons, somme des deux
// résultantes négative. Comparés entre matchs avec et sans rouge / penalty, contrôle par permutation (2026-11-27).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const NEG = (process.env.NEG || '7,8,10,6,13,1').split(',').map(Number);
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = s => s.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const neg = f => NEG.includes(f);
D.forEach(d => { const L = M.lire(d.m), b = L.theme.bases, r = L.theme.resultantes, s = {}; d.r = oui(d.rouge) ? 1 : 0; d.p = oui(d.pen) ? 1 : 0; d.ax = [];
  let tb = 0, tr = 0, ts = 0, both = 0, bothR = 0;
  for (let h = 1; h <= 6; h++) { const o = h + 6, nb = neg(b[h]) + neg(b[o]), nr = neg(r[h]) + neg(r[o]), sm = K.additionner(r[h], r[o]), pole = L.R1.maison === h || L.R1.maison === o, nom = pole ? 'axe des pôles' : 'M' + h + '-M' + o;
    d.ax.push({ h, o, nb, nr, sm }); tb += nb; tr += nr; ts += neg(sm) ? 1 : 0; both += nb === 2 ? 1 : 0; bothR += nr === 2 ? 1 : 0;
    s['M' + h + '-M' + o + ' : bases toutes deux négatives'] = nb === 2; s['M' + h + '-M' + o + ' : résultantes toutes deux négatives'] = nr === 2; s['M' + h + '-M' + o + ' : somme des résultantes négative'] = neg(sm); s['M' + h + '-M' + o + ' : aucune négative (base ni résultante)'] = nb + nr === 0; }
  const ap = d.ax.find(a => L.R1.maison === a.h || L.R1.maison === a.o) || null;
  if (ap) { s['axe des pôles : bases toutes deux négatives'] = ap.nb === 2; s['axe des pôles : une base négative'] = ap.nb === 1; s['axe des pôles : résultantes toutes deux négatives'] = ap.nr === 2; s['axe des pôles : somme des résultantes négative'] = neg(ap.sm); s['axe des pôles : aucune négative'] = ap.nb + ap.nr === 0; }
  s['axes à bases toutes deux négatives ≥ 1'] = both >= 1; s['axes à résultantes toutes deux négatives ≥ 1'] = bothR >= 1; s['axes à somme négative ≥ 3'] = ts >= 3; s['axes à somme négative ≤ 1'] = ts <= 1;
  s['figures négatives en base (M1–M12) ≥ 6'] = tb >= 6; s['figures négatives en base ≤ 3'] = tb <= 3; s['figures négatives en résultante ≥ 6'] = tr >= 6; s['figures négatives en résultante ≤ 3'] = tr <= 3;
  d.s = s; d.n = { tb, tr, ts, both, bothR }; });
const noms = [...new Set(D.flatMap(d => Object.keys(d.s)))];
for (const [c, lab] of [['r', 'rouge'], ['p', 'penalty']]) { const y = D.map(d => d[c]), n1 = y.reduce((a, b) => a + b, 0);
  const eff = (y, k) => { let a = 0, n = 0, a0 = 0, n0 = 0; D.forEach((d, i) => { if (d.s[k] === undefined) return; if (d.s[k]) { n++; a += y[i]; } else { n0++; a0 += y[i]; } }); return { a, n, a0, n0, e: n >= 6 && n0 >= 6 ? a / n - a0 / n0 : 0 }; };
  const rows = noms.map(k => ({ k, ...eff(y, k) })).sort((a, b) => Math.abs(b.e) - Math.abs(a.e)), T = 400, mx = [];
  for (let t = 0; t < T; t++) { const z = y.slice().sort(() => Math.random() - 0.5); mx.push(Math.max(...noms.map(k => Math.abs(eff(z, k).e)))); } mx.sort((a, b) => a - b); const s95 = mx[Math.floor(T * .95)];
  console.log('\n' + lab.toUpperCase() + ' : ' + n1 + '/' + D.length + ' · ' + noms.length + ' signes · seuil du hasard (95e) ' + s95.toFixed(2));
  rows.slice(0, 10).forEach(o => console.log('  ' + (o.e > 0 ? '+' : '') + o.e.toFixed(2) + '  ' + (Math.round(100 * o.a / o.n) + ' %').padStart(5) + ' (' + o.a + '/' + o.n + ') contre ' + Math.round(100 * o.a0 / o.n0) + ' %  ' + o.k + (Math.abs(o.e) >= s95 ? '   ← au-delà du hasard' : '')));
  const moy = (k, v) => (D.filter((d, i) => y[i] === v).reduce((s, d) => s + d.n[k], 0) / D.filter((d, i) => y[i] === v).length).toFixed(2);
  console.log('  moyennes avec / sans : négatives en base ' + moy('tb', 1) + ' / ' + moy('tb', 0) + ' · en résultante ' + moy('tr', 1) + ' / ' + moy('tr', 0) + ' · axes à somme négative ' + moy('ts', 1) + ' / ' + moy('ts', 0)); }
