// Juge les prédictions du rouge et du penalty figées le 2026-11-27 (validation/predictions-rouge-27-novembre.json) avec les incidents trouvés ensuite.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = s => s.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const I = new Map(lire('validation/incidents-2026-11.json').matchs.map(x => [norm(x[0]), x])), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
const P = lire('validation/predictions-rouge-27-novembre.json').matchs, T = {}, U = {};
P.forEach(x => { const r = I.get(norm(x.match)); if (!r) { console.log('  incidents inconnus : ' + x.match); return; } const kr = x.rouge.split(' (')[0], kp = x.penalty.split(' (')[0];
  (T[kr] = T[kr] || []).push((oui(r[2]) ? '🟥 ' : '   ') + x.match + ' (rouge ' + r[2] + ')'); (U[kp] = U[kp] || []).push(oui(r[1]) ? 1 : 0); });
console.log('ROUGE'); Object.keys(T).forEach(k => { const n = T[k].filter(x => x.startsWith('🟥')).length; console.log('  ' + k + ' : rouge ' + n + '/' + T[k].length); T[k].forEach(x => console.log('     ' + x)); });
console.log('PENALTY'); Object.keys(U).forEach(k => console.log('  ' + k + ' : penalty ' + U[k].reduce((a, b) => a + b, 0) + '/' + U[k].length));
