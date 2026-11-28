// Albus, Puella et la 4e mère (2026-11-27). Albus (4) a sa maison de repos en M4 (4e mère), Puella (14) en M14 ; M4-M14 est une paire Carcer et l'axe du dragon
// de Fortuna Minor / Aquisitio ; Albus et Puella ont pour axe du dragon M9-M15 (maisons de repos de Fortuna Minor / Aquisitio). Signes testés sur le rouge et
// le penalty, contrôle par permutation et par moitiés, puis effet sur les règles actuelles du moteur.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
D.forEach(d => { const L = d.L = M.lire(d.m); d.b = L.theme.bases; d.r = L.theme.resultantes; d.pn = oui(d.pen) ? 1 : 0; d.rg = oui(d.rouge) ? 1 : 0; d.I = M.incidentVerdict(L); });
const ctrl = (lab, f, cible) => { const y = D.map(d => d[cible]), X = D.map(f), A = D.filter((d, i) => X[i]), a = A.filter(d => d[cible]).length, a0 = y.reduce((s, v) => s + v, 0) - a; let kh = 0, kb = 0;
  for (let t = 0; t < 3000; t++) { const z = y.slice().sort(() => Math.random() - 0.5), v = X.reduce((s, x, i) => s + (x ? z[i] : 0), 0); if (v >= a) kh++; if (v <= a) kb++; }
  const h = [0, 1].map(p => { const S = D.filter((d, i) => i % 2 === p), B = S.filter(f); return B.filter(d => d[cible]).length + '/' + B.length + '·' + S.filter(d => !f(d) && d[cible]).length + '/' + (S.length - B.length); });
  console.log('  ' + lab.padEnd(58) + (a + '/' + A.length).padStart(6) + ' (' + Math.round(100 * a / (A.length || 1)) + ' % contre ' + Math.round(100 * a0 / ((D.length - A.length) || 1)) + ' %) p+ ' + (kh / 3000).toFixed(3) + ' p− ' + (kb / 3000).toFixed(3) + '  moitiés ' + h.join(' | ')); };
const AP = [4, 14], FA = [9, 15];
const S = {
  'dragon M9-M15 par Albus ou Puella': d => [9, 15].some(h => AP.includes(d.b[h])),
  'dragon M4-M14 par Fortuna Minor ou Aquisitio': d => [4, 14].some(h => FA.includes(d.b[h])),
  'Albus ou Puella en 4e mère (base de M4)': d => AP.includes(d.b[4]),
  '4e mère = Albus (chez elle, → Populus)': d => d.b[4] === 4, '4e mère = Puella (→ Carcer)': d => d.b[4] === 14,
  'Albus ou Puella en base de M14': d => AP.includes(d.b[14]),
  'Albus ou Puella posé dans la maison de son partenaire (→ Carcer)': d => d.b[4] === 14 || d.b[14] === 4,
  'Albus en base (n\'importe où)': d => d.b.slice(1).includes(4), 'Puella en base (n\'importe où)': d => d.b.slice(1).includes(14),
  'Albus ou Puella absents des bases': d => !d.b.slice(1).some(g => AP.includes(g)),
  'un pôle est Albus ou Puella': d => AP.includes(d.L.R1.figure) || AP.includes(d.L.R7.figure),
  'résultante de M4 = Albus ou Puella': d => AP.includes(d.r[4]), 'résultante de M4 à Terre saturée': d => K.niveaux(d.r[4])[3] === 2,
  '4e mère dans le front de R1': d => (d.b[4] - 1) % 4 === (d.L.R1.figure - 1) % 4, '4e mère dans le front de R7': d => (d.b[4] - 1) % 4 === (d.L.R7.figure - 1) % 4,
  '4e mère = figure d\'un pôle': d => d.b[4] === d.L.R1.figure || d.b[4] === d.L.R7.figure,
  '4e mère = antagoniste d\'un pôle': d => d.b[4] === mod(d.L.R1.figure - 3) || d.b[4] === mod(d.L.R7.figure - 3),
  '4e mère en réaction (1+1 avec M4)': d => [0, 1, 2, 3].some(l => K.niveaux(d.b[4])[l] === 1 && K.niveaux(4)[l] === 1),
  '4e mère intacte (aucune réaction)': d => d.b[4] !== 16 && ![0, 1, 2, 3].some(l => K.niveaux(d.b[4])[l] === 1 && K.niveaux(4)[l] === 1),
};
console.log(D.length + ' matchs · rouge ' + D.filter(d => d.rg).length + ' · penalty ' + D.filter(d => d.pn).length);
for (const [cible, lab] of [['rg', 'ROUGE'], ['pn', 'PENALTY']]) { console.log('\n' + lab + '  (p+ : part des tirages qui font au moins autant ; p− : au plus autant)'); for (const [k, f] of Object.entries(S)) ctrl(k, f, cible); }
// 4e mère : par famille de figure
console.log('\n4e MÈRE (base de M4) par paire de figures :');
const PAIRE = g => { const p = K.additionner(g, 10); return [N(Math.min(g, p)), N(Math.max(g, p))].join('/'); }, T = {};
D.forEach(d => { const k = PAIRE(d.b[4]); T[k] = T[k] || [0, 0, 0]; T[k][0] += d.rg; T[k][1] += d.pn; T[k][2]++; });
Object.keys(T).forEach(k => console.log('  ' + k.padEnd(28) + T[k][2] + ' matchs · rouge ' + T[k][0] + ' · penalty ' + T[k][1]));
// effet sur les échelles du moteur
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 };
const dAP = d => [9, 15].some(h => AP.includes(d.b[h])), int4 = d => d.b[4] !== 16 && ![0, 1, 2, 3].some(l => K.niveaux(d.b[4])[l] === 1 && K.niveaux(4)[l] === 1), poleAP = d => AP.includes(d.L.R1.figure) || AP.includes(d.L.R7.figure);
const echelle = (lab, f, cible) => { const T = {}; D.forEach(d => { const k = f(d); T[k] = T[k] || [0, 0]; T[k][0] += d[cible]; T[k][1]++; }); console.log('  ' + lab.padEnd(64) + Object.keys(T).sort().map(k => k + ' : ' + T[k][0] + '/' + T[k][1] + ' (' + Math.round(100 * T[k][0] / T[k][1]) + ' %)').join(' · ')); };
const sr = d => (d.I.rouge.dragon.length ? 1 : 0) + (d.I.rouge.bloques.R7.length ? 1 : 0) + (d.I.rouge.bloques.R1.length ? 1 : 0);
console.log('\nROUGE — échelles');
echelle('actuelle (veto : front de R7 qui attaque)', d => d.I.rouge.veto ? 'veto' : String(Math.min(sr(d), 2)), 'rg');
echelle('veto élargi (front de R7 qui attaque, ou dragon M9-M15 Albus/Puella)', d => (d.I.rouge.veto || dAP(d)) ? 'veto' : String(Math.min(sr(d), 2)), 'rg');
const sp = d => d.I.penalty.signes;
console.log('\nPENALTY — échelles');
echelle('actuelle S4 (arrêt ou attaque de R1 ; M16 ; dragon M5-M11)', d => String(Math.min(sp(d), 2)), 'pn');
echelle('S4 + 4e mère intacte', d => String(Math.min(sp(d) + (int4(d) ? 1 : 0), 3)), 'pn');
echelle('S4, avec « pôle Albus ou Puella » comme frein (−1)', d => String(Math.max(0, Math.min(sp(d) - (poleAP(d) ? 1 : 0), 2))), 'pn');
echelle('S4 + 4e mère intacte, frein pôle Albus/Puella', d => String(Math.max(0, Math.min(sp(d) + (int4(d) ? 1 : 0) - (poleAP(d) ? 1 : 0), 3))), 'pn');
const halves = (lab, f) => { const h = [0, 1].map(p => { const S = D.filter((d, i) => i % 2 === p), T = {}; S.forEach(d => { const k = f(d); T[k] = T[k] || [0, 0]; T[k][0] += d.pn; T[k][1]++; }); return Object.keys(T).sort().map(k => k + ':' + T[k][0] + '/' + T[k][1]).join(' '); }); console.log('     moitiés ' + lab + ' → ' + h.join(' | ')); };
halves('S4 + 4e mère intacte', d => String(Math.min(sp(d) + (int4(d) ? 1 : 0), 3)));
console.log('\npenalties à 0 signe (S4 + 4e mère intacte) : ' + D.filter(d => d.pn && sp(d) + (int4(d) ? 1 : 0) === 0).map(d => d.nom).join(' ; '));
