// Combinaison M6, M8, M14, M16 (2026-11-27, demande du propriétaire) : le carré Air–Terre de la grille des nœuds (M6 Air×Air, M8 Terre×Air, M14 Air×Terre,
// M16 Terre×Terre), maisons des fronts B et D. Figure = somme des quatre bases. Relations de la figure avec les pôles et ses niveaux, comparées au vainqueur,
// au nul, aux buts, à « deux marquent », au rouge, au penalty et aux buts de 1re mi-temps ; contrôle par permutation.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const tous = new Map(), aj = (t, s, nom, mt) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, mt }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, x.mi_temps)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json', 'validation/resultats-2026-11-26.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, x.mi_temps)));
try { lire('validation/mi-temps.json').forEach && lire('validation/mi-temps.json').forEach(x => { const k = (x.theme || x.themes || []).join('-'); if (tous.has(k) && x.mi_temps) tous.get(k).mt = x.mi_temps; }); } catch (e) {}
const inc = new Map(); lire('validation/incidents-2026-11.json').matchs.forEach(([n, p, r]) => inc.set(norm(n), { pen: p, rouge: r })); lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => inc.set(norm(x.match), { pen: x.penalty, rouge: x.rouge }));
const oui = v => v && !/^non/i.test(v) && v !== 'incertain', fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, FR = 'ABCD';
const D = [...tous.values()].map(d => { const L = M.lire(d.m), b = L.theme.bases, F = [6, 8, 14, 16].map(h => b[h]).reduce(K.additionner), i = inc.get(norm(d.nom || ''));
  return { ...d, L, F, r: Math.sign(d.sc[0] - d.sc[1]), g: d.sc[0] + d.sc[1], deux: d.sc[0] > 0 && d.sc[1] > 0, rg: i ? (oui(i.rouge) ? 1 : 0) : null, pn: i ? (oui(i.pen) ? 1 : 0) : null, ht: Array.isArray(d.mt) ? d.mt[0] + d.mt[1] : null }; });
console.log(D.length + ' matchs (dont ' + D.filter(d => d.rg !== null).length + ' avec incidents connus, ' + D.filter(d => d.ht !== null).length + ' avec mi-temps)');
console.log('algèbre : somme des figures de repos M6+M8+M14+M16 = ' + N([6, 8, 14, 16].reduce(K.additionner)));
// signes de la figure
const S = d => { const F = d.F, f1 = d.L.R1.figure, f7 = d.L.R7.figure, n = K.niveaux(F), s = {};
  s['figure = Populus'] = F === 16; s['figure = Via'] = F === 5; s['figure à Air saturé'] = n[1] === 2; s['figure à Terre saturée'] = n[3] === 2; s['figure à Air et Terre saturés'] = n[1] === 2 && n[3] === 2; s['figure à Air et Terre ouverts'] = n[1] === 1 && n[3] === 1;
  s['figure = un pôle'] = F === f1 || F === f7; s['figure dans le front de R1'] = fr(F) === fr(f1); s['figure dans le front de R7'] = fr(F) === fr(f7);
  s['figure = antagoniste de R1'] = F === mod(f1 - 3); s['figure = antagoniste de R7'] = F === mod(f7 - 3); s['figure = protecteur de R1'] = F === mod(f1 - 6); s['figure = protecteur de R7'] = F === mod(f7 - 6);
  s['le front de la figure attaque R1'] = ATT[fr(F)] === fr(f1); s['le front de la figure attaque R7'] = ATT[fr(F)] === fr(f7);
  s['figure présente ailleurs en base'] = d.L.theme.bases.slice(1, 16).includes(F); s['figure absente du thème'] = !d.L.theme.bases.slice(1).includes(F) && !d.L.theme.resultantes.slice(1, 16).includes(F);
  s['figure martiale ou du dragon (Rubeus, Puer, Caput, Cauda)'] = [7, 1, 3, 13].includes(F); return s; };
D.forEach(d => d.s = S(d));
const noms = Object.keys(D[0].s);
const cibles = { 'R1 gagne': d => d.r > 0 ? 1 : 0, 'R7 gagne': d => d.r < 0 ? 1 : 0, 'nul': d => d.r === 0 ? 1 : 0, '3 buts ou plus': d => d.g >= 3 ? 1 : 0, 'deux marquent': d => d.deux ? 1 : 0, 'rouge': d => d.rg, 'penalty': d => d.pn, 'but en 1re mi-temps': d => d.ht === null ? null : d.ht > 0 ? 1 : 0 };
const lignes = [];
for (const [c, fy] of Object.entries(cibles)) { const X = D.filter(d => fy(d) !== null), y = X.map(fy), base = y.reduce((a, b) => a + b, 0) / y.length;
  for (const k of noms) { const A = X.filter(d => d.s[k]); if (A.length < 6 || A.length > X.length - 6) continue; const a = A.reduce((t, d) => t + fy(d), 0), e = a / A.length - base;
    let kk = 0; const flags = X.map(d => d.s[k]); for (let t = 0; t < 1500; t++) { const z = y.slice().sort(() => Math.random() - 0.5); const v = flags.reduce((t2, f, i) => t2 + (f ? z[i] : 0), 0); if (Math.abs(v / A.length - base) >= Math.abs(e)) kk++; }
    lignes.push({ c, k, a, n: A.length, base, e, p: kk / 1500 }); } }
lignes.sort((a, b) => a.p - b.p || Math.abs(b.e) - Math.abs(a.e));
console.log('\nles relations les plus fortes (p = part des tirages au hasard qui font un écart au moins aussi grand ; ' + lignes.length + ' tests) :');
lignes.slice(0, 14).forEach(o => console.log('  ' + o.c.padEnd(20) + o.k.padEnd(58) + (o.a + '/' + o.n).padStart(6) + ' (' + Math.round(100 * o.a / o.n) + ' % contre ' + Math.round(100 * o.base) + ' %)  p ' + o.p.toFixed(3)));
// figure par figure
console.log('\nfigure de la combinaison : matchs · R1 / nul / R7 · buts moyens');
const T = {}; D.forEach(d => { const k = N(d.F); T[k] = T[k] || [0, 0, 0, 0, 0]; T[k][d.r > 0 ? 0 : d.r === 0 ? 1 : 2]++; T[k][3] += d.g; T[k][4]++; });
Object.keys(T).sort((a, b) => T[b][4] - T[a][4]).forEach(k => console.log('  ' + k.padEnd(16) + String(T[k][4]).padStart(3) + ' · ' + T[k][0] + ' / ' + T[k][1] + ' / ' + T[k][2] + ' · ' + (T[k][3] / T[k][4]).toFixed(1)));
console.log('\nVICTOIRE SELON LE FRONT DE LA FIGURE (R1 / nul / R7)');
const cat = d => { const z = fr(d.F), z1 = fr(d.L.R1.figure), z7 = fr(d.L.R7.figure); return z === z1 && z === z7 ? 'front des deux pôles' : z === z7 ? 'front de R7' : z === z1 ? 'front de R1' : ATT[z] === z1 ? 'front qui attaque R1' : ATT[z] === z7 ? 'front qui attaque R7' : 'autre front'; };
const dom = d => { const z1 = fr(d.L.R1.figure), z7 = fr(d.L.R7.figure); return ATT[z1] === z7 || ATT[z7] === z1 ? 'boucles différentes' : 'même boucle'; };
const lot = d => dev126.has(d.m.join('-')) ? 'dev' : 'test';
const dev126 = new Set(); lire('validation/scores-reels.json').forEach(x => dev126.add(x.themes.join('-'))); lire('validation/themes-18.json').forEach(x => dev126.add(x.themes.join('-'))); dev126.add(lire('validation/lot-2.json')[0].themes[0].join('-'));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => dev126.add(x.theme.join('-'))));
for (const [lab, filt] of [['tous', d => true], ['recherche (126)', d => lot(d) === 'dev'], ['26 novembre (21)', d => lot(d) === 'test'], ['même boucle', d => dom(d) === 'même boucle'], ['boucles différentes', d => dom(d) === 'boucles différentes']]) {
  const T = {}; D.filter(filt).forEach(d => { const k = cat(d); T[k] = T[k] || [0, 0, 0]; T[k][d.r > 0 ? 0 : d.r === 0 ? 1 : 2]++; });
  console.log('  ' + lab.padEnd(20) + Object.keys(T).sort().map(k => k + ' ' + T[k].join('/')).join(' · ')); }
// apport à la décision actuelle du moteur
const verd = d => { const v = M.verdict(d.L).decision.resultat; return v === 'N' ? 0 : v === '1' ? 1 : -1; };
let ok = 0, ok2 = 0; D.forEach(d => { ok += verd(d) === d.r; const v = cat(d) === 'front de R7' && verd(d) === -1 ? 1 : verd(d); ok2 += v === d.r; });
console.log('\n  décision actuelle : ' + ok + '/' + D.length + ' · en remplaçant « victoire R7 » par « victoire R1 » quand la figure est dans le front de R7 : ' + ok2 + '/' + D.length);
const R7c = D.filter(d => cat(d) === 'front de R7' && verd(d) === -1); console.log('  cas concernés : ' + R7c.length + ' · résultats R1 ' + R7c.filter(d => d.r > 0).length + ', nul ' + R7c.filter(d => d.r === 0).length + ', R7 ' + R7c.filter(d => d.r < 0).length);
