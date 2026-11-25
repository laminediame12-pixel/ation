// Piste du propriétaire (Koun-35, 2026-11-25) : NOYAU TERRE et nul.
// Noyau Terre = Albus (4), Tristitia (8), Fortuna Major (12), Populus (16) ; mobile = Amissio (6), Carcer (10), Puella (14).
// On compte leurs apparitions dans les 16 bases et les 16 résultantes (lecture exacte de la page : L.resu(h) pour h = 1 à 16, M16 compté deux fois).
// Phase : mobile si mobile > noyau ; sinon figure du noyau la plus fréquente : Tristitia = équilibre en suspens, Populus = équilibre concrétisé,
// Albus / Fortuna Major = équilibre stable. Question : la phase ou les comptes disent-ils le nul ? Jugé sur 106 matchs, lot par lot, avec contrôle par mélange.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const NOY = [4, 8, 12, 16], MOB = [6, 10, 14];
function noyau(L, couche) { const figs = []; for (let h = 1; h <= 16; h++) { if (couche !== 'res') figs.push(L.theme.bases[h]); if (couche !== 'base') figs.push(L.resu(h)); }
  const c = {}; let sN = 0, sM = 0; figs.forEach(n => { if (NOY.includes(n)) { sN++; c[n] = (c[n] || 0) + 1; } if (MOB.includes(n)) { sM++; c[n] = (c[n] || 0) + 1; } });
  let phase, best = 0, bestN = 0; if (sM > sN) phase = 'mobile'; else if (sN > 0) { NOY.forEach(n => { if ((c[n] || 0) > best) { best = c[n]; bestN = n; } }); phase = { 8: 'suspens (Tristitia)', 16: 'concrétisé (Populus)', 4: 'stable (Albus)', 12: 'stable (Fortuna Major)' }[bestN]; } else phase = 'neutre';
  return { phase, sN, sM, c, ecart: sN - sM }; }
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, nul: d.sc[0] === d.sc[1] ? 1 : 0, N: noyau(L), NB: noyau(L, 'base') }; });
const p0 = D.reduce((s, d) => s + d.nul, 0) / D.length;
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls (' + Math.round(100 * p0) + ' %)\n');
function table(titre, f) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || { corpus: [0, 0], aveugle: [0, 0] }; t[k][d.lot][0] += d.nul; t[k][d.lot][1]++; });
  console.log(titre); Object.keys(t).sort((a, b) => (+a - +b) || a.localeCompare(b)).forEach(k => { const c = t[k].corpus, a = t[k].aveugle, n = c[1] + a[1], x = c[0] + a[0]; console.log('    ' + k.padEnd(26), ('nuls ' + x + '/' + n + ' (' + Math.round(100 * x / n) + ' %)').padEnd(20), '| corpus ' + c[0] + '/' + c[1] + ' · aveugle ' + a[0] + '/' + a[1]); }); console.log(''); }
table('1. Phase (lecture de la page : bases + résultantes)', d => d.N.phase);
table('2. Phase sur les bases seules', d => d.NB.phase);
table('3. Écart noyau − mobile (bases + résultantes)', d => Math.max(-4, Math.min(6, d.N.ecart)));
table('4. Nombre de Populus (bases + résultantes)', d => d.N.c[16] || 0);
table('5. Nombre de Tristitia', d => d.N.c[8] || 0);
// pôles : zone de R1 et R7 (noyau, mobile, hors cycle) et leur orbite +6
const zone = f => NOY.includes(f) ? 'noyau' : MOB.includes(f) ? 'mobile' : 'hors';
table('6. Zones des deux pôles (R1 / R7)', d => zone(d.L.R1.figure) + ' / ' + zone(d.L.R7.figure));
const orb = f => ((f - 1) % 2 === 0 ? 'impaire' : 'paire');  // pas +6 : orbite 1-7-13-3-9-15-5-11 (impairs) ou 2-8-14-4-10-16-6-12 (pairs)
table('7. Orbites +6 des deux pôles (même orbite ou non)', d => orb(d.L.R1.figure) === orb(d.L.R7.figure) ? 'même orbite' : 'orbites différentes');
// distance des deux pôles sur l'orbite +6 (en pas) quand ils sont sur la même orbite
const pas = (a, b) => { let x = a; for (let i = 0; i < 8; i++) { if (x === b) return i; x = ((x - 1 + 6) % 16) + 1; } return null; };
table('8. Pas de R1 vers R7 sur l\'orbite +6 (même orbite)', d => { const p = pas(d.L.R1.figure, d.L.R7.figure); return p === null ? '—' : p; });
// contrôle : la séparation la plus forte parmi toutes les modalités ci-dessus, comparée aux mélanges
const LECT = { a: d => d.N.phase, b: d => d.NB.phase, c: d => Math.max(-4, Math.min(6, d.N.ecart)), d: d => d.N.c[16] || 0, e: d => d.N.c[8] || 0, f: d => zone(d.L.R1.figure) + '/' + zone(d.L.R7.figure), g: d => orb(d.L.R1.figure) === orb(d.L.R7.figure), h: d => String(pas(d.L.R1.figure, d.L.R7.figure)) };
const zmax = y => { let m = 0; for (const f of Object.values(LECT)) { const t = {}; D.forEach((d, i) => { const k = f(d); t[k] = t[k] || [0, 0]; t[k][0] += y[i]; t[k][1]++; }); for (const k in t) { const [x, n] = t[k]; if (n < 8) continue; const z = (x - n * p0) / Math.sqrt(n * p0 * (1 - p0)); if (z > m) m = z; } } return m; };
const y = D.map(d => d.nul), om = zmax(y); let g = 0; const NP = +process.argv[2] || 3000;
for (let t = 0; t < NP; t++) { const q = y.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (zmax(q) >= om) g++; }
console.log('Contrôle : la modalité la plus riche en nuls (au moins 8 matchs) est atteinte avec des résultats mélangés dans ' + (100 * g / NP).toFixed(1) + ' % des cas.');
// 9. lecture qui découle de 6 : « hors cycle » = surtout les figures impaires (fronts A et C). Parité des deux figures de pôle.
table('9. Figures des pôles paires (fronts B, D) : combien sur deux', d => [d.L.R1.figure, d.L.R7.figure].filter(f => f % 2 === 0).length);
table('10. Phase mobile ou non (bases + résultantes)', d => d.N.phase === 'mobile' ? 'mobile' : 'non mobile');
table('11. Au moins un pôle dans le noyau Terre (4, 8, 12, 16)', d => [d.L.R1.figure, d.L.R7.figure].some(f => NOY.includes(f)) ? 'oui' : 'non');
// 12-14. le noyau du côté de chaque pôle : figures du noyau / mobiles posées (base ou résultante) dans les 4 maisons du front du pôle ; égalité → nul ?
const frontDe = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const cote = (L, c, set) => frontDe(c.figure).reduce((s, h) => s + (set.includes(L.theme.bases[h]) ? 1 : 0) + (set.includes(L.resu(h)) ? 1 : 0), 0);
table('12. Noyau dans le front de chaque pôle : égalité R1 = R7 ?', d => cote(d.L, d.L.R1, NOY) === cote(d.L, d.L.R7, NOY) ? 'égalité' : 'écart');
table('13. Mobiles dans le front de chaque pôle : égalité R1 = R7 ?', d => cote(d.L, d.L.R1, MOB) === cote(d.L, d.L.R7, MOB) ? 'égalité' : 'écart');
table('14. Noyau − mobile dans le front de chaque pôle : égalité ?', d => cote(d.L, d.L.R1, NOY) - cote(d.L, d.L.R1, MOB) === cote(d.L, d.L.R7, NOY) - cote(d.L, d.L.R7, MOB) ? 'égalité' : 'écart');
