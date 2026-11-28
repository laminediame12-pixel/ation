// Étude des attaques de fronts : relation entre les fronts de R1 et R7 (R1 attaque R7, R7 attaque R1, même front, fronts alliés) et le résultat ;
// puis ce qui reste de l'attaqué (niveaux identiques avec son attaquant = niveaux saturés de leur somme) dans la relation directe.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle')); lire('validation/resultats-aveugles-2026-11-25.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const ATT = { A: 'D', B: 'A', D: 'C', C: 'B' }, fr = f => 'ABCD'[(f - 1) % 4];
const D = [...tous.values()].map(d => { const L = M.lire(d.m), a = fr(L.R1.figure), b = fr(L.R7.figure); return { ...d, L, rel: a === b ? 'même front' : ATT[a] === b ? 'R1 attaque R7' : ATT[b] === a ? 'R7 attaque R1' : 'fronts alliés', r: Math.sign(d.sc[0] - d.sc[1]) }; });
console.log(D.length + ' matchs (R1 gagne ' + D.filter(d => d.r > 0).length + ', nul ' + D.filter(d => !d.r).length + ', R7 gagne ' + D.filter(d => d.r < 0).length + ')\n');
const t = {}; D.forEach(d => { t[d.rel] = t[d.rel] || [0, 0, 0, 0, 0, 0]; const i = d.r > 0 ? 0 : d.r === 0 ? 1 : 2; t[d.rel][i]++; if (d.lot === 'aveugle') t[d.rel][3 + i]++; });
for (const k in t) { const o = t[k], n = o[0] + o[1] + o[2]; console.log('  ' + k.padEnd(16) + ('n ' + n).padEnd(6) + ' R1 gagne ' + o[0] + ' · nul ' + o[1] + ' · R7 gagne ' + o[2] + ' (' + Math.round(100 * o[2] / n) + ' %)   | aveugle ' + o[3] + '/' + o[4] + '/' + o[5]); }
// l'attaquant gagne-t-il ?
let ga = 0, pa = 0, na = 0; D.forEach(d => { if (d.rel === 'R1 attaque R7') { if (d.r > 0) ga++; else if (d.r < 0) pa++; else na++; } if (d.rel === 'R7 attaque R1') { if (d.r < 0) ga++; else if (d.r > 0) pa++; else na++; } });
console.log('\n  quand un pôle attaque l\'autre : l\'attaquant gagne ' + ga + ' fois, perd ' + pa + ', nul ' + na);
// « R7 attaque R1 » comme 7e signe du nul (pour), ajouté à la convergence du moteur
const y = D.map(d => d.r === 0 ? 1 : 0), corr = (a, b) => { const n = a.length, ma = a.reduce((s, v) => s + v) / n, mb = b.reduce((s, v) => s + v) / n; let u = 0, v = 0, w = 0; for (let i = 0; i < n; i++) { u += (a[i] - ma) * (b[i] - mb); v += (a[i] - ma) ** 2; w += (b[i] - mb) ** 2; } return u / Math.sqrt(v * w); };
const s0 = D.map(d => M.nulConvergence(d.L).score), s1 = D.map((d, i) => s0[i] + (d.rel === 'R7 attaque R1' ? 1 : 0));
console.log('\n  convergence du nul (117 matchs) : corrélation ' + corr(s0, y).toFixed(3) + ' ; avec « R7 attaque R1 » : ' + corr(s1, y).toFixed(3));
for (const [nom, s] of [['actuelle', s0], ['avec le signe', s1]]) { const fq = D.filter((d, i) => s[i] >= 3), av = fq.filter(d => d.lot === 'aveugle'); console.log('    ' + nom.padEnd(14) + ' nul fréquent (≥ +3) : ' + fq.filter(d => !d.r).length + '/' + fq.length + ' · aveugle ' + av.filter(d => !d.r).length + '/' + av.length + ' · nul écarté (≤ 0) : ' + D.filter((d, i) => s[i] <= 0 && !d.r).length + '/' + D.filter((d, i) => s[i] <= 0).length); }
