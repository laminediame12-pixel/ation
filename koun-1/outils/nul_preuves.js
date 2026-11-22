// Épreuves indépendantes de la règle du nul (Feu de M9 ≠ Eau de M11, puis Terre de M14) sur ce qui n'a pas servi à la trouver.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const niv = m => { const b = K.construire(m).bases, P = K.niveaux(b[9])[0] !== K.niveaux(b[11])[2]; return !P ? 'exclu' : K.niveaux(b[14])[3] === 2 ? 'fréquent' : 'peu probable'; };
const src = new Map(); const sr = lire('validation/scores-reels.json'), t18 = lire('validation/themes-18.json'), mt = lire('validation/mi-temps.json');
sr.forEach(x => { const k = x.themes.join('-'); if (!src.has(k)) src.set(k, { m: x.themes, sc: x.score, ht: x.mi_temps, date: x.date || '', n: x.match, from: 'scores-reels' }); });
t18.forEach(x => { const k = x.themes.join('-'); if (!src.has(k)) src.set(k, { m: x.themes, sc: x.score.split('-').map(Number), date: '', n: x.match, from: 'themes-18' }); });
mt.forEach(x => { const k = x.themes.join('-'); if (src.has(k)) { if (Array.isArray(x.mi_temps) && !src.get(k).ht) src.get(k).ht = x.mi_temps; } else if (Array.isArray(x.mi_temps)) src.set(k, { m: x.themes, sc: null, ht: x.mi_temps, n: x.match, from: 'mi-temps seule' }); });
const D = [...src.values()].map(d => ({ ...d, niv: niv(d.m) }));
const tab = (titre, S, cible) => { const t = {}; S.forEach(d => { const k = d.niv; t[k] = t[k] || [0, 0]; t[k][0]++; t[k][1] += cible(d); }); console.log(titre); ['exclu', 'peu probable', 'fréquent'].forEach(k => { if (t[k]) console.log('     nul ' + k.padEnd(14), t[k][1] + '/' + t[k][0], '(' + Math.round(100 * t[k][1] / t[k][0]) + ' %)'); }); return t; };
// test exact (permutation) : la répartition de la cible entre « exclu » et le reste est-elle due au hasard ?
const pTest = (S, cible) => { const y = S.map(cible), g = S.map(d => d.niv === 'exclu' ? 0 : d.niv === 'peu probable' ? 1 : 2), stat = yy => { let s = 0; yy.forEach((v, i) => { s += v * g[i]; }); return s; }, ob = stat(y); let ge = 0; for (let t = 0; t < 20000; t++) { const q = y.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (stat(q) >= ob) ge++; } return ge / 20000; };
const FT = D.filter(d => d.sc), HT = D.filter(d => d.ht), MT2 = D.filter(d => d.ht && d.sc);
console.log('0. ce qui a servi à trouver la règle : nul au score final (' + FT.length + ' matchs)');
tab('   score final', FT, d => d.sc[0] === d.sc[1] ? 1 : 0);
console.log('\nÉPREUVES (les cibles ci-dessous n\'ont pas servi à trouver la règle)');
tab('1. nul à la mi-temps (' + HT.length + ' matchs)', HT, d => d.ht[0] === d.ht[1] ? 1 : 0); console.log('     hasard :', (100 * pTest(HT, d => d.ht[0] === d.ht[1] ? 1 : 0)).toFixed(1) + ' %');
tab('2. 2e mi-temps à égalité de buts (' + MT2.length + ' matchs)', MT2, d => (d.sc[0] - d.ht[0]) === (d.sc[1] - d.ht[1]) ? 1 : 0); console.log('     hasard :', (100 * pTest(MT2, d => (d.sc[0] - d.ht[0]) === (d.sc[1] - d.ht[1]) ? 1 : 0)).toFixed(1) + ' %');
const nonNuls = FT.filter(d => d.sc[0] !== d.sc[1]);
tab('3. matchs serrés : un seul but d\'écart, parmi les ' + nonNuls.length + ' matchs non nuls', nonNuls, d => Math.abs(d.sc[0] - d.sc[1]) === 1 ? 1 : 0); console.log('     hasard :', (100 * pTest(nonNuls, d => Math.abs(d.sc[0] - d.sc[1]) === 1 ? 1 : 0)).toFixed(1) + ' %');
console.log('\n4. stabilité selon l\'origine des matchs (score final) :');
const per = {}; FT.forEach(d => { const k = d.from + (d.date && d.date.startsWith('2026-11') ? ' · novembre 2026' : d.date ? ' · ' + d.date.slice(0, 7) : ' · sans date'); per[k] = per[k] || { e: [0, 0], p: [0, 0] }; const o = d.niv === 'exclu' ? per[k].e : per[k].p; o[0]++; if (d.sc[0] === d.sc[1]) o[1]++; });
Object.entries(per).forEach(([k, v]) => console.log('     ', k.padEnd(36), 'nul exclu :', v.e[1] + '/' + v.e[0], '| nul possible :', v.p[1] + '/' + v.p[0]));
// 5. preuve d'ensemble : combien de fois le hasard produit-il À LA FOIS une parité qui enferme tous les nuls finaux dans ≤ 38 matchs ET un appui aussi fort à la mi-temps ?
console.log('\n5. preuve d\'ensemble (hasard sur toute la recherche) :');
const bits = m => { let x = 0; m.forEach((f, i) => K.niveaux(f).forEach((v, l) => { if (v === 1) x |= 1 << (4 * i + l); })); return x; }, pc = v => { v ^= v >> 16; v ^= v >> 8; v ^= v >> 4; v ^= v >> 2; v ^= v >> 1; return v & 1; };
const XF = FT.map(d => bits(d.m)), yF = FT.map(d => d.sc[0] === d.sc[1] ? 1 : 0), XH = HT.map(d => bits(d.m)), yH = HT.map(d => d.ht[0] === d.ht[1] ? 1 : 0);
const htEcart = (m, yh) => { let a = 0, na = 0, b = 0, nb = 0; XH.forEach((x, i) => { if (pc(x & m)) { na++; a += yh[i]; } else { nb++; b += yh[i]; } }); return na && nb ? a / na - b / nb : -1; };
const MASK = (1 << 0) | (1 << 4) | (1 << 8) | (1 << 9), obsHT = htEcart(MASK, yH);
let tirages = 0, reussis = 0; const T = +process.argv[2] || 300;
for (let t = 0; t < T; t++) { const q = yF.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } const qh = yH.slice(); for (let i = qh.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [qh[i], qh[j]] = [qh[j], qh[i]]; }
  const K0 = q.reduce((a, b) => a + b); let best = null; for (let m = 1; m < 65536; m++) { let n = 0, k = 0; for (let i = 0; i < XF.length; i++) if (pc(XF[i] & m)) { n++; k += q[i]; } if (k === K0 && n <= 38 && (!best || n < best.n)) best = { m, n }; }
  tirages++; if (best && htEcart(best.m, qh) >= obsHT) reussis++; }
console.log('     sur', tirages, 'mélanges des scores (finaux et mi-temps) : une parité enferme tous les nuls dans ≤ 38 matchs ET sépare aussi bien les nuls à la mi-temps dans', reussis, 'cas (' + (100 * reussis / tirages).toFixed(1) + ' %)');
console.log('     écart observé à la mi-temps : nul possible − nul exclu =', (100 * obsHT).toFixed(0), 'points');
