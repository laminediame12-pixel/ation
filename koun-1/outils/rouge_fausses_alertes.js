// Fausses alertes du rouge (2026-11-27) : à l'intérieur des matchs où la règle s'allume (dragon en M6/M12 ou pôle bloqué, sans attaque du front de R7),
// signes qui séparent les rouges des matchs sans rouge ; contrôle par permutation à l'intérieur du groupe.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, CANAL = [4, 8, 12, 13, 14, 15], act = g => [0, 1, 2, 3].filter(l => K.niveaux(g)[l] === 1);
const reagit = (g, h) => [0, 1, 2, 3].some(l => K.niveaux(g)[l] === 1 && K.niveaux(h)[l] === 1);
D.forEach(d => { const L = d.L = M.lire(d.m), b = L.theme.bases, r = L.theme.resultantes; d.rg = oui(d.rouge) ? 1 : 0;
  d.dragon = [6, 12].filter(h => b[h] === 7 || b[h] === 1); d.bl = { R1: M.blocages(L, 'R1'), R7: M.blocages(L, 'R7') }; d.r7a = ATT[fr(L.R7.figure)] === fr(L.R1.figure);
  d.on = !d.r7a && (d.dragon.length > 0 || d.bl.R1.length > 0 || d.bl.R7.length > 0);
  const s = d.s = {}, f1 = fr(L.R1.figure), f7 = fr(L.R7.figure);
  s['dragon seul (sans blocage)'] = d.dragon.length > 0 && !d.bl.R1.length && !d.bl.R7.length; s['blocage seul (sans dragon)'] = !d.dragon.length && (d.bl.R1.length || d.bl.R7.length) > 0; s['dragon ET blocage'] = d.dragon.length > 0 && (d.bl.R1.length || d.bl.R7.length) > 0;
  s['dragon en M6'] = d.dragon.includes(6); s['dragon en M12'] = d.dragon.includes(12); s['dragon par Rubeus'] = d.dragon.some(h => b[h] === 7); s['dragon par Puer'] = d.dragon.some(h => b[h] === 1);
  s['R1 bloqué'] = d.bl.R1.length > 0; s['R7 bloqué'] = d.bl.R7.length > 0; s['les deux bloqués'] = d.bl.R1.length > 0 && d.bl.R7.length > 0;
  s['bloqueur en M16'] = [...d.bl.R1, ...d.bl.R7].includes(16); s['bloqueur en canal Terre'] = [...d.bl.R1, ...d.bl.R7].some(h => CANAL.includes(h)); s['bloqueur sur un nœud double'] = [...d.bl.R1, ...d.bl.R7].some(h => [1, 6, 11].includes(h));
  s['bloqueur à Terre active (bloque la Terre)'] = ['R1', 'R7'].some(p => d.bl[p].length && act(mod(L[p].figure - 3)).includes(3));
  s['bloqueur dans la boucle du pôle bloqué'] = ['R1', 'R7'].some(p => d.bl[p].some(h => h < 16 && fr(h) === fr(L[p].figure)));
  s['bloqueur dans la boucle adverse'] = ['R1', 'R7'].some(p => { const q = p === 'R1' ? 'R7' : 'R1'; return d.bl[p].some(h => h < 16 && fr(h) === fr(L[q].figure)); });
  s['un pôle allié à la figure martiale'] = d.dragon.length > 0 && ['R1', 'R7'].some(p => d.dragon.every(h => { const g = fr(b[h]), z = fr(L[p].figure); return z !== g && ATT[g] !== z && ATT[z] !== g; }));
  s['R1 attaque R7'] = ATT[f1] === f7; s['même front'] = f1 === f7; s['fronts alliés'] = f1 !== f7 && ATT[f1] !== f7 && ATT[f7] !== f1;
  s['arrêt dans le thème'] = M.arrets(L).nombre > 0; s['M11 plein (Eau²)'] = K.niveaux(r[11])[2] === 2; s['M6 plein (Air²)'] = K.niveaux(r[6])[1] === 2; s['M1 plein (Feu²)'] = K.niveaux(r[1])[0] === 2;
  s['un pôle Rubeus, Puer ou Via'] = [7, 1, 5].includes(L.R1.figure) || [7, 1, 5].includes(L.R7.figure); s['un pôle Caput ou Cauda'] = [3, 13].includes(L.R1.figure) || [3, 13].includes(L.R7.figure);
  s['Populus en base'] = b.slice(1).includes(16); s['figures chez elles ≥ 2'] = [...Array(15)].filter((_, i) => b[i + 1] === i + 1).length >= 2;
  s['les deux pôles marquent'] = M.marquePole(L, 'R1').marque && M.marquePole(L, 'R7').marque; s['aucun pôle ne marque'] = !M.marquePole(L, 'R1').marque && !M.marquePole(L, 'R7').marque;
  s['juge M15 : résultante à Feu saturé'] = K.niveaux(r[15])[0] === 2; s['juge M15 : résultante Terre saturée'] = K.niveaux(r[15])[3] === 2;
  s['M16 (sentence) figure martiale ou du dragon'] = [7, 1, 3, 13].includes(b[16]); s['M16 négative (Rubeus, Tristitia, Carcer, Amissio, Cauda, Puer)'] = [7, 8, 10, 6, 13, 1].includes(b[16]);
  s['Rubeus en base ailleurs qu\'en M6/M12'] = b.slice(1, 16).some((g, i) => g === 7 && ![6, 12].includes(i + 1)); s['Rubeus absent des bases'] = !b.slice(1).includes(7);
  s['réactions 1+1 nombreuses (≥ 17)'] = b.slice(1, 16).reduce((t, g, i) => t + [0, 1, 2, 3].filter(l => K.niveaux(g)[l] === 1 && K.niveaux(i + 1)[l] === 1).length, 0) >= 17; });
const G = D.filter(d => d.on), y = G.map(d => d.rg), n1 = y.reduce((a, b) => a + b, 0), noms = Object.keys(G[0].s);
console.log('groupe où la règle s\'allume : ' + G.length + ' matchs, ' + n1 + ' rouges\n');
const eff = (y, k) => { let a = 0, n = 0, a0 = 0, n0 = 0; G.forEach((d, i) => { if (d.s[k]) { n++; a += y[i]; } else { n0++; a0 += y[i]; } }); return { a, n, a0, n0, e: n >= 5 && n0 >= 5 ? a / n - a0 / n0 : 0 }; };
const rows = noms.map(k => ({ k, ...eff(y, k) })).sort((a, b) => Math.abs(b.e) - Math.abs(a.e)), T = 1000, mx = [];
for (let t = 0; t < T; t++) { const z = y.slice().sort(() => Math.random() - 0.5); mx.push(Math.max(...noms.map(k => Math.abs(eff(z, k).e)))); } mx.sort((a, b) => a - b); const s95 = mx[Math.floor(T * .95)];
console.log('seuil du hasard (95e, ' + noms.length + ' signes) : ' + s95.toFixed(2));
rows.slice(0, 14).forEach(o => console.log('  ' + (o.e > 0 ? '+' : '') + o.e.toFixed(2) + '  ' + (Math.round(100 * o.a / o.n) + ' %').padStart(5) + ' (' + o.a + '/' + o.n + ') contre ' + Math.round(100 * o.a0 / o.n0) + ' % (' + o.a0 + '/' + o.n0 + ')  ' + o.k + (Math.abs(o.e) >= s95 ? '   ← au-delà du hasard' : '')));
console.log('\nvariantes sur les ' + D.length + ' matchs (rouge quand allumée · quand éteinte) :');
const V = {
  'actuelle : dragon ou blocage, sans attaque de R7': d => d.on,
  'dragon ou R7 bloqué, sans attaque de R7': d => !d.r7a && (d.dragon.length > 0 || d.bl.R7.length > 0),
  'R7 bloqué, sans attaque de R7': d => !d.r7a && d.bl.R7.length > 0,
  'dragon, sans attaque de R7': d => !d.r7a && d.dragon.length > 0,
  'blocage, sans attaque de R7': d => !d.r7a && (d.bl.R1.length + d.bl.R7.length) > 0 };
for (const [k, f] of Object.entries(V)) { const a = D.filter(f), h = [0, 1].map(p => { const S = D.filter((d, i) => i % 2 === p), A = S.filter(f); return A.filter(d => d.rg).length + '/' + A.length + ' · ' + S.filter(d => !f(d) && d.rg).length + '/' + (S.length - A.length); });
  console.log('  ' + k.padEnd(48) + (a.filter(d => d.rg).length + '/' + a.length).padStart(6) + ' (' + Math.round(100 * a.filter(d => d.rg).length / a.length) + ' %) · ' + D.filter(d => !f(d) && d.rg).length + '/' + (D.length - a.length) + '   moitiés : ' + h.join(' | ')); }
// niveaux : compte des signes, veto par l'attaque de R7
console.log('\nniveaux (veto : le front de R7 attaque R1) :');
const lvl = d => d.r7a ? 'veto' : (d.dragon.length > 0 ? 1 : 0) + (d.bl.R7.length > 0 ? 1 : 0) + (d.bl.R1.length > 0 ? 1 : 0), Lv = {};
D.forEach(d => { const k = lvl(d); Lv[k] = Lv[k] || [0, 0]; Lv[k][0] += d.rg; Lv[k][1]++; }); Object.keys(Lv).sort().forEach(k => console.log('  ' + (k === 'veto' ? 'attaque de R7' : k + ' signe(s)').padEnd(16) + Lv[k][0] + '/' + Lv[k][1] + ' (' + Math.round(100 * Lv[k][0] / Lv[k][1]) + ' %)'));
