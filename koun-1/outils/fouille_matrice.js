// Fouille de la matrice des 256 combinaisons (2026-11-27) : chaque maison h d'un thème est une case (base b[h], maison h) de la matrice,
// donc un point de la trajectoire de sa résultante X = b[h] + h. Activité d'une case = niveaux saturés de X (0 : Via, inactive ; 4 : Populus, chez elle).
// Lectures du thème (M1 à M15) et de chaque pôle (les 4 maisons de son front ; sa maison), jugées sur les buts, le nul, le vainqueur, à l'aveugle à part.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, 'aveugle')));
const sat = f => K.niveaux(f).filter(v => v === 2).length, H15 = [...Array(15)].map((_, i) => i + 1), front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const D = [...tous.values()].map(d => { const L = M.lire(d.m), b = L.theme.bases, X = h => K.additionner(b[h], h); return { ...d, L, b, X, g: d.sc[0] + d.sc[1], nul: d.sc[0] === d.sc[1], r: Math.sign(d.sc[0] - d.sc[1]) }; });
const moy = a => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(2) : '—', pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
function tab(nom, f, cl) { const t = {}; D.forEach(d => { let k = f(d); if (cl) k = cl(k); t[k] = t[k] || []; t[k].push(d); }); console.log(nom);
  Object.keys(t).sort((a, b) => (+a - +b) || a.localeCompare(b)).forEach(k => { const X = t[k], av = X.filter(d => d.lot === 'aveugle');
    console.log('    ' + String(k).padEnd(10) + ('n ' + X.length).padEnd(6) + ' buts ' + moy(X.map(d => d.g)) + ' · nuls ' + pc(X.filter(d => d.nul).length, X.length).padEnd(5) + ' · R1 gagne ' + pc(X.filter(d => d.r > 0).length, X.length).padEnd(5) + ' | aveugle : buts ' + moy(av.map(d => d.g)) + ', nuls ' + av.filter(d => d.nul).length + '/' + av.length); }); console.log(''); }
console.log(D.length + ' matchs ; buts moyens ' + moy(D.map(d => d.g)) + ', nuls ' + pc(D.filter(d => d.nul).length, D.length) + '\n');
tab('1. Cases inactives (résultante Via) dans M1–M15', d => H15.filter(h => d.X(h) === 5).length);
tab('2. Cases pleines (figure chez elle, résultante Populus) dans M1–M15', d => H15.filter(h => d.X(h) === 16).length);
tab('3. Activité totale (niveaux saturés de M1–M15, 0 à 60)', d => H15.reduce((s, h) => s + sat(d.X(h)), 0), k => k <= 26 ? '≤ 26' : k <= 29 ? '27-29' : k <= 32 ? '30-32' : '≥ 33');
tab('4. Terre concrétisée (résultantes à Terre saturée dans M1–M15)', d => H15.filter(h => K.niveaux(d.X(h))[3] === 2).length, k => k <= 5 ? '≤ 5' : k <= 7 ? '6-7' : k <= 9 ? '8-9' : '≥ 10');
tab('5. Ruptures 6-7 et 14-15 : Terre de la résultante identique en M6 et M7, et en M14 et M15', d => (K.niveaux(d.X(6))[3] === K.niveaux(d.X(7))[3] ? 1 : 0) + (K.niveaux(d.X(14))[3] === K.niveaux(d.X(15))[3] ? 1 : 0));
// par pôle : activité de son front (4 maisons, M16 exclue) contre celle de l'adversaire
const act = (d, p) => front(d.L[p].figure).filter(h => h < 16).reduce((s, h) => s + sat(d.X(h)), 0), ter = (d, p) => front(d.L[p].figure).filter(h => h < 16 && K.niveaux(d.X(h))[3] === 2).length;
for (const [nom, f] of [['6. Le pôle dont le front est le plus actif (niveaux saturés de ses résultantes)', act], ['7. Le pôle dont le front concrétise le plus la Terre', ter], ['8. Le pôle dont la maison est la plus active', (d, p) => sat(d.X(d.L[p].maison))]]) {
  let w = 0, l = 0, n = 0, av = [0, 0], gm = 0, ge = 0, c = 0; D.forEach(d => { const s = Math.sign(f(d, 'R1') - f(d, 'R7')); if (!s) return; c++; const i = s > 0 ? 0 : 1; gm += d.sc[i]; ge += d.sc[1 - i]; if (!d.r) n++; else if (s === d.r) w++; else l++; if (d.lot === 'aveugle' && d.r) { av[1]++; if (s === d.r) av[0]++; } });
  console.log(nom + ' : gagne ' + w + ', perd ' + l + ', nul ' + n + ' · marque ' + (gm / c).toFixed(2) + ' contre ' + (ge / c).toFixed(2) + ' | aveugle ' + av[0] + '/' + av[1]); }
