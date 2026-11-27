// Fouille du rouge et du penalty (2026-11-27) : matchs dont on sait s'il y a eu penalty ou rouge (scores-reels étiquetés + validation/incidents-2026-11.json).
// Compare le verdict d'incident du moteur et cherche les caractéristiques du thème liées aux incidents, avec contrôle par tirages au hasard.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = s => s.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain', pole = (v, p) => v && v.includes(p);
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; const m = th.get(k); if (!m) { console.log('thème introuvable : ' + n); return; } D.push({ nom: n, m, pen, rouge }); });
D.forEach(d => { d.L = M.lire(d.m); d.inc = oui(d.pen) || oui(d.rouge); d.p = oui(d.pen); d.r = oui(d.rouge); });
const nI = D.filter(d => d.inc).length; console.log(D.length + ' matchs étiquetés : ' + nI + ' avec penalty ou rouge (' + D.filter(d => d.p).length + ' penalty, ' + D.filter(d => d.r).length + ' rouge)\n');
const E = {}; D.forEach(d => { const k = M.incidentVerdict(d.L).niveau; E[k] = E[k] || [0, 0, 0, 0]; E[k][0] += d.inc; E[k][1]++; E[k][2] += d.p; E[k][3] += d.r; });
console.log('verdict d\'incident du moteur :'); ['probable', 'possible', 'aucun'].forEach(k => E[k] && console.log('  ' + k.padEnd(9) + E[k][0] + '/' + E[k][1] + ' avec incident (' + Math.round(100 * E[k][0] / E[k][1]) + ' %) · penalty ' + E[k][2] + ' · rouge ' + E[k][3]));
// pôle visé par le moteur
let pj = 0, pn = 0; D.forEach(d => { const I = M.incidentVerdict(d.L); if (!I.pole) return; const ev = pole(d.pen, I.pole) || pole(d.rouge, I.pole) || (d.pen || '').includes('et') || (d.rouge || '').includes('et'); pn++; if (ev) pj++; }); console.log('  pôle désigné par le moteur concerné par un incident : ' + pj + '/' + pn);
const feats = d => { const L = d.L, b = L.theme.bases, r = L.theme.resultantes, s = new Set();
  for (let h = 1; h <= 16; h++) { s.add('b' + h + '=' + N(b[h])); s.add('r' + h + '=' + N(r[h])); K.niveaux(r[h]).forEach((v, l) => s.add('r' + h + 'n' + l + '=' + v)); s.add('r' + h + '+r' + mod(h + 6) + '=' + N(K.additionner(r[h], r[mod(h + 6)]))); }
  s.add('arrêts=' + Math.min(M.arrets(L).nombre, 2)); s.add('R1+R7=' + N(K.additionner(L.R1.figure, L.R7.figure))); let ch = 0; for (let h = 1; h <= 15; h++) if (b[h] === h) ch++; s.add('chez elles=' + Math.min(ch, 3)); s.add('Populus en base=' + b.slice(1).includes(16));
  s.add('pôle bloqué=' + (M.blocages(L, 'R1').length + M.blocages(L, 'R7').length > 0)); return s; };
const cnt = {}; D.forEach(d => feats(d).forEach(f => { cnt[f] = cnt[f] || [0, 0]; cnt[f][d.inc ? 0 : 1]++; }));
const nO = D.length - nI, best = Object.entries(cnt).map(([f, [a, b]]) => ({ f, a, b, e: a / nI - b / nO })).sort((x, y) => y.e - x.e).slice(0, 10);
console.log('\nfouille (' + Object.keys(cnt).length + ' caractéristiques), les plus liées aux incidents :'); best.forEach(o => console.log('  ' + o.f.padEnd(26) + ' incident ' + o.a + '/' + nI + ' · sans ' + o.b + '/' + nO));
let me = []; for (let t = 0; t < 200; t++) { const idx = new Set(); while (idx.size < nI) idx.add(Math.floor(Math.random() * D.length)); const c2 = {}; D.forEach((d, i) => feats(d).forEach(f => { c2[f] = c2[f] || [0, 0]; c2[f][idx.has(i) ? 0 : 1]++; })); me.push(Math.max(...Object.values(c2).map(([a, b]) => a / nI - b / nO))); }
me.sort((a, b) => a - b); console.log('  contrôle : incidents tirés au hasard → écart max médian ' + me[100].toFixed(2) + ', 95e ' + me[190].toFixed(2) + ' ; réel ' + best[0].e.toFixed(2) + ' (' + me.filter(x => x >= best[0].e).length + '/200 tirages font aussi bien)');
