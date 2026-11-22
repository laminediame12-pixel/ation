// Les arrêts (antagoniste h−3 posé en base dans la maison h) face au rouge et au penalty.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, fr = n => (n - 1) % 4;
const sr = JSON.parse(fs.readFileSync(path.join(R, 'validation/scores-reels.json'), 'utf8')), vu = new Set();
const X = sr.filter(x => { const k = x.themes.join('-'); if (vu.has(k) || !('penalty' in x)) return false; vu.add(k); return true; });
const oui = v => v === 'R1' || v === 'R7';
const D = X.map(x => { const L = M.lire(x.themes), b = L.theme.bases, arr = []; for (let h = 1; h <= 15; h++) if (b[h] === mod(h - 3)) arr.push(h); return { x, L, arr, inc: oui(x.penalty) || oui(x.rouge), pen: x.penalty, rge: x.rouge, pole: M.incident(L).parite.pole }; });
console.log(D.length + ' matchs étiquetés : incident (penalty ou rouge) dans ' + D.filter(d => d.inc).length + ' ; penalties ' + D.filter(d => oui(d.pen)).length + ', rouges ' + D.filter(d => oui(d.rge)).length + '\n');
// 1. nombre d'arrêts et incident
const t = {}; D.forEach(d => { const k = Math.min(d.arr.length, 2) + (d.arr.length >= 2 ? '+' : ''); t[k] = t[k] || [0, 0, 0, 0]; t[k][0]++; if (d.inc) t[k][1]++; if (oui(d.pen)) t[k][2]++; if (oui(d.rge)) t[k][3]++; });
console.log('1. arrêts dans le thème → matchs avec incident :'); Object.keys(t).sort().forEach(k => console.log('    ', k.padEnd(3), 'arrêt(s) : incident', t[k][1] + '/' + t[k][0], '(penalty', t[k][2] + ', rouge', t[k][3] + ')'));
const av = D.filter(d => d.arr.length), sa = D.filter(d => !d.arr.length);
console.log('     avec arrêt', av.filter(d => d.inc).length + '/' + av.length, '| sans arrêt', sa.filter(d => d.inc).length + '/' + sa.length);
// 2. par pôle : arrêts dans le front du pôle → penalty pour lui / rouge contre lui
console.log('\n2. arrêts dans le front de la figure du pôle :');
const P = []; D.forEach(d => ['R1', 'R7'].forEach(p => { const z = fr(d.L[p].figure), n = d.arr.filter(h => fr(h) === z).length; P.push({ d, p, n, pen: d.pen === p ? 1 : d.pen == null ? null : 0, rge: d.rge === p ? 1 : d.rge == null ? null : 0 }); }));
for (const n of [0, 1, 2]) { const s = P.filter(q => (n < 2 ? q.n === n : q.n >= 2)); console.log('    ', (n < 2 ? n : '2+') + ' arrêt(s) :', 'penalty pour lui', s.filter(q => q.pen === 1).length + '/' + s.filter(q => q.pen !== null).length, '| rouge contre lui', s.filter(q => q.rge === 1).length + '/' + s.filter(q => q.rge !== null).length, '| l\'un ou l\'autre', s.filter(q => q.pen === 1 || q.rge === 1).length + '/' + s.length); }
// 3. qui attaque ? l'antagoniste posé appartient au front de l'autre pôle (l'adversaire agresse) ou au front du pôle lui-même
console.log('\n3. l\'arrêt vient de l\'adversaire (l\'antagoniste posé est une figure du front de l\'autre pôle) :');
const Q = []; D.forEach(d => ['R1', 'R7'].forEach(p => { const o = p === 'R1' ? 'R7' : 'R1', zp = fr(d.L[p].figure), zo = fr(d.L[o].figure); const subi = d.arr.filter(h => fr(h) === zp && fr(mod(h - 3)) === zo).length, inflige = d.arr.filter(h => fr(h) === zo && fr(mod(h - 3)) === zp).length; Q.push({ d, p, subi, inflige, pen: d.pen === p ? 1 : 0, rge: d.rge === p ? 1 : 0, inc: d.pen === p || d.rge === p }); }));
for (const k of ['subi', 'inflige']) { const a = Q.filter(q => q[k] > 0), b = Q.filter(q => q[k] === 0); console.log('    ', (k === 'subi' ? 'le pôle subit un arrêt de l\'adversaire dans son front' : 'le pôle inflige un arrêt dans le front adverse').padEnd(54), ': incident pour lui', a.filter(q => q.inc).length + '/' + a.length, '(penalty', a.filter(q => q.pen).length + ', rouge', a.filter(q => q.rge).length + ') | sinon', b.filter(q => q.inc).length + '/' + b.length); }
// 4. face à la règle actuelle de l'incident (débordement de parité d'un seul pôle)
console.log('\n4. avec la règle actuelle (débordement d\'un seul pôle) :');
const c = {}; D.forEach(d => { const k = (d.pole ? 'débordement' : 'pas de débordement') + ' · ' + (d.arr.length ? 'arrêt' : 'aucun arrêt'); c[k] = c[k] || [0, 0]; c[k][0]++; if (d.inc) c[k][1]++; }); Object.keys(c).sort().forEach(k => console.log('    ', k.padEnd(36), 'incident', c[k][1] + '/' + c[k][0]));
console.log('\n5. détail :'); D.forEach(d => console.log('    ', (d.x.match || '').padEnd(30), (d.x.score || []).join('-').padEnd(5), 'arrêts', (d.arr.length ? 'M' + d.arr.join(',M') : '—').padEnd(14), '| penalty', String(d.pen).padEnd(4), 'rouge', String(d.rge).padEnd(4), '| débordement', d.pole || '—'));
