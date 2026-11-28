// Mesure le verdict d'incident du moteur (rouge et penalty, niveau et camp) sur tous les matchs étiquetés — doit redonner INCIDENT_OBS (2026-11-27).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const T = { rouge: {}, penalty: {} }, C = { rouge: [0, 0], penalty: [0, 0] };
D.forEach(d => { const I = M.incidentVerdict(M.lire(d.m));
  for (const [k, v] of [['rouge', d.rouge], ['penalty', d.pen]]) { const x = I[k], cle = k === 'rouge' ? (x.veto ? 'veto' : String(Math.min(x.signes, 2))) : x.niveau; T[k][cle] = T[k][cle] || [0, 0]; T[k][cle][0] += oui(v) ? 1 : 0; T[k][cle][1]++;
    if (oui(v) && !/R1 et R7|les deux/.test(v)) { C[k][1]++; if (v.includes(x.camp)) C[k][0]++; } } });
console.log(D.length + ' matchs');
for (const k of ['rouge', 'penalty']) console.log(k.padEnd(8) + Object.keys(T[k]).sort().map(c => (c === 'veto' || isNaN(+c) ? c : c + ' signe(s)') + ' ' + T[k][c][0] + '/' + T[k][c][1]).join(' · ') + ' · camp ' + C[k][0] + '/' + C[k][1]);
