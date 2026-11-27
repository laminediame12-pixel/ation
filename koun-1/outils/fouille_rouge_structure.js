// Fouille structurelle du rouge et du penalty (2026-11-27) : signes tirés des notions du système (fronts, attaques, arrêts entre fronts des pôles, blocage par niveau,
// canaux Terre, nœuds doubles, figures de conflit), seuls et par paires, sur les matchs étiquetés ; contrôle par permutation (incidents tirés au hasard, même fouille).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = s => s.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const CIBLE = process.argv[2] === 'penalty' ? 'pen' : 'rouge';
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, CANAL = [4, 8, 12, 13, 14, 15], NV = ['Feu', 'Air', 'Eau', 'Terre'];
const garde = (g, h) => K.niveaux(g).every((v, l) => v !== 1 || K.niveaux(h)[l] === 2), act = g => [0, 1, 2, 3].filter(l => K.niveaux(g)[l] === 1);
function signes(L) { const b = L.theme.bases, r = L.theme.resultantes, s = {}, f1 = fr(L.R1.figure), f7 = fr(L.R7.figure), A = M.arrets(L).maisons;
  s['fronts identiques'] = f1 === f7; s['R1 attaque R7'] = ATT[f1] === f7; s['R7 attaque R1'] = ATT[f7] === f1; s['fronts alliés'] = !s['fronts identiques'] && !s['R1 attaque R7'] && !s['R7 attaque R1'];
  s['arrêt ≥ 1'] = A.length > 0; s['arrêts ≥ 2'] = A.length > 1;
  s['arrêt entre les fronts des pôles'] = A.some(h => { const a = fr(b[h]), v = fr(h); return (a === f1 && v === f7) || (a === f7 && v === f1); });
  s['arrêt dans la boucle d\'un pôle'] = A.some(h => fr(h) === f1 || fr(h) === f7); s['arrêt en canal Terre'] = A.some(h => CANAL.includes(h)); s['arrêt sur un nœud double (M1, M6, M11)'] = A.some(h => [1, 6, 11].includes(h));
  for (const p of ['R1', 'R7']) { const B = M.blocages(L, p), An = mod(L[p].figure - 3); s[p + ' bloqué'] = B.length > 0;
    s[p + ' bloqué en Terre'] = B.length > 0 && act(An).includes(3); s[p + ' bloqué par M16'] = B.includes(16); s[p + ' bloqué en canal Terre'] = B.some(h => CANAL.includes(h));
    s[p + ' chez lui'] = b[L[p].maison] === L[p].maison; s[p + ' en canal Terre'] = CANAL.includes(L[p].maison); s[p + ' résultante Terre saturée'] = K.niveaux(r[L[p].maison])[3] === 2;
    s[p + ' : son antagoniste absent des bases'] = !b.slice(1).includes(An); s[p + ' : son protecteur posé'] = b.slice(1).includes(mod(L[p].figure - 6));
    s[p + ' marque'] = M.marquePole(L, p).marque; }
  s['les deux pôles bloqués'] = s['R1 bloqué'] && s['R7 bloqué']; s['un seul pôle bloqué'] = s['R1 bloqué'] !== s['R7 bloqué'];
  const cR = h => r.slice(1, 16).filter(x => x === h).length, cB = h => b.slice(1, 16).filter(x => x === h).length;
  s['Carcer en résultante ≥ 2'] = cR(10) >= 2; s['Rubeus en base'] = cB(7) > 0; s['Rubeus en résultante'] = cR(7) > 0; s['Via en résultante ≥ 2'] = cR(5) >= 2; s['Populus en base'] = cB(16) > 0; s['Populus en résultante ≥ 2'] = cR(16) >= 2;
  s['M1 plein (Feu²)'] = K.niveaux(r[1])[0] === 2; s['M6 plein (Air²)'] = K.niveaux(r[6])[1] === 2; s['M11 plein (Eau²)'] = K.niveaux(r[11])[2] === 2;
  let op = 0; for (let h = 1; h <= 8; h++) if (K.additionner(r[h], r[h + 8]) === 10) op++; s['miroirs (h, h+8) donnant Carcer'] = op > 0;
  let o6 = 0; for (let h = 1; h <= 16; h++) if (K.additionner(r[h], r[mod(h + 6)]) === 10) o6++; s['opposées (h, h+6) donnant Carcer ≥ 2'] = o6 >= 2;
  s['juge M15 saturé en Feu'] = K.niveaux(r[15])[0] === 2; s['témoins M13 et M14 de même Terre'] = K.niveaux(r[13])[3] === K.niveaux(r[14])[3];
  s['égalité n-n'] = M.egalite(L).oui; s['figures chez elles ≥ 2'] = [...Array(15)].filter((_, i) => b[i + 1] === i + 1).length >= 2;
  return s; }
D.forEach(d => { d.S = signes(M.lire(d.m)); d.y = oui(d[CIBLE]) ? 1 : 0; });
const noms = Object.keys(D[0].S), n1 = D.filter(d => d.y).length, n0 = D.length - n1;
const score = (y, f) => { let a = 0, c = 0, a0 = 0, c0 = 0; D.forEach((d, i) => { if (f(d)) { c++; a += y[i]; } else { c0++; a0 += y[i]; } }); return { a, c, a0, c0, e: c >= 6 && c0 >= 6 ? a / c - a0 / c0 : -9 }; };
const tests = []; noms.forEach(x => tests.push([x, d => d.S[x]])); noms.forEach(x => tests.push(['non ' + x, d => !d.S[x]]));
for (let i = 0; i < noms.length; i++) for (let j = i + 1; j < noms.length; j++) { const x = noms[i], z = noms[j]; tests.push([x + ' ET ' + z, d => d.S[x] && d.S[z]]); tests.push([x + ' ET non ' + z, d => d.S[x] && !d.S[z]]); tests.push(['non ' + x + ' ET ' + z, d => !d.S[x] && d.S[z]]); }
const Y = D.map(d => d.y), res = tests.map(([k, f]) => ({ k, ...score(Y, f) })).sort((a, b) => b.e - a.e);
console.log(D.length + ' matchs · ' + (CIBLE === 'pen' ? 'penalty' : 'rouge') + ' ' + n1 + ' (' + Math.round(100 * n1 / D.length) + ' %) · ' + noms.length + ' signes, ' + tests.length + ' tests (seuls et paires)\n');
res.slice(0, 12).forEach(o => console.log('  ' + (Math.round(100 * o.a / o.c) + ' %').padStart(5) + ' (' + o.a + '/' + o.c + ') contre ' + Math.round(100 * o.a0 / o.c0) + ' % (' + o.a0 + '/' + o.c0 + ')  ' + o.k));
const seuls = res.filter(o => !o.k.includes(' ET ')).slice(0, 6); console.log('\nmeilleurs signes seuls :'); seuls.forEach(o => console.log('  ' + (Math.round(100 * o.a / o.c) + ' %').padStart(5) + ' (' + o.a + '/' + o.c + ') contre ' + Math.round(100 * o.a0 / o.c0) + ' %  ' + o.k));
{ const g = {}; D.forEach(d => { const k = d.S['R7 attaque R1'] ? 'le front de R7 attaque celui de R1' : d.S['R1 attaque R7'] ? 'le front de R1 attaque celui de R7' : d.S['fronts identiques'] ? 'même front' : 'fronts alliés'; g[k] = g[k] || [0, 0, 0, 0]; g[k][0] += oui(d.rouge) ? 1 : 0; g[k][1] += oui(d.pen) ? 1 : 0; g[k][2]++; });
  console.log('\nrelation des fronts de R1 et R7 :'); Object.keys(g).forEach(k => console.log('  ' + k.padEnd(36) + 'rouge ' + g[k][0] + '/' + g[k][2] + ' · penalty ' + g[k][1] + '/' + g[k][2]));
  const h = {}; D.forEach(d => { const k = (d.S['R7 attaque R1'] ? 'R7 attaque R1' : 'sans attaque de R7') + ' · ' + (d.S['R1 bloqué'] || d.S['R7 bloqué'] ? 'pôle bloqué' : 'aucun pôle bloqué'); h[k] = h[k] || [0, 0]; h[k][0] += oui(d.rouge) ? 1 : 0; h[k][1]++; });
  Object.keys(h).sort().forEach(k => console.log('  ' + k.padEnd(36) + 'rouge ' + h[k][0] + '/' + h[k][1])); }
const T = +process.argv[3] || 100, mx = [], mxs = []; for (let t = 0; t < T; t++) { const y = Y.slice().sort(() => Math.random() - 0.5); let m = -9, ms = -9; tests.forEach(([k, f]) => { const e = score(y, f).e; if (e > m) m = e; if (!k.includes(' ET ') && e > ms) ms = e; }); mx.push(m); mxs.push(ms); }
const q = (a, p) => a.slice().sort((x, y) => x - y)[Math.floor(p * (a.length - 1))];
console.log('\ncontrôle (' + T + ' permutations) : meilleur écart au hasard, paires comprises : médiane ' + q(mx, .5).toFixed(2) + ', 95e ' + q(mx, .95).toFixed(2) + ' ; réel ' + res[0].e.toFixed(2) + ' (' + mx.filter(x => x >= res[0].e).length + '/' + T + ' font aussi bien)');
console.log('                     signes seuls : médiane ' + q(mxs, .5).toFixed(2) + ', 95e ' + q(mxs, .95).toFixed(2) + ' ; réel ' + seuls[0].e.toFixed(2) + ' (' + mxs.filter(x => x >= seuls[0].e).length + '/' + T + ' font aussi bien)');
