// Diagonales (1-6-11-16 et 4-7-10-13) du thème principal et du thème angulaire : chaque niveau, chaque diagonale, et leur combinaison.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const ANG = [1, 4, 7, 10], angulaire = Lp => M.lire(ANG.map(h => Lp.theme.bases[h]));
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), G = angulaire(L); return { ...d, L, G, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const DIAG = { '1-6-11-16': [1, 6, 11, 16], '4-7-10-13': [4, 7, 10, 13], 'les deux': null }, NV = ['Feu', 'Air', 'Eau', 'Terre'];
function noeudsPole(Lx, c, dg) { const z = (c.figure - 1) % 4; return dg ? [dg.find(h => (h - 1) % 4 === z)] : [[4, 7, 10, 13], [1, 6, 11, 16]].map(d => d.find(h => (h - 1) % 4 === z)); }
function compte(Lx, c, dg, l, src) { const T = Lx.theme, rz = h => h < 16 ? T.resultantes[h] : T.bases[16], f = src === 'base' ? h => T.bases[h] : rz; return noeudsPole(Lx, c, dg).filter(h => K.niveaux(f(h))[l] === 2).length; }
const tests = [];
for (const th of ['L', 'G']) for (const [dn, dg] of Object.entries(DIAG)) for (let l = 0; l < 4; l++) for (const src of ['résultante', 'base']) tests.push({ k: (th === 'L' ? 'principal' : 'angulaire') + ' · ' + dn + ' · ' + NV[l] + ' · ' + src, th, s: D.map(d => Math.sign(compte(d[th], d[th].R1, dg, l, src) - compte(d[th], d[th].R7, dg, l, src))) });
const ev = s => { let ok = 0, ko = 0, eg = 0, ne = 0; D.forEach((d, i) => { if (!s[i]) { eg++; ne += d.nul; } else if (d.r) { if (s[i] === d.r) ok++; else ko++; } }); return { ok, ko, eg, ne }; };
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls\n');
console.log('lecture (thème · diagonale · niveau · source)'.padEnd(52), 'justes / faux | égalités dont nuls');
tests.forEach(t => { const e = ev(t.s); t.e = e; if (t.k.includes('résultante')) console.log('  ' + t.k.padEnd(50), String(e.ok).padStart(2), '/', String(e.ko).padStart(2), '|', e.eg, 'dont', e.ne); });
console.log('  (lectures en base : voir le meilleur ci-dessous)');
const rr = D.map(d => d.r), z = (s, q) => { let a = 0, b = 0; s.forEach((v, i) => { if (v && q[i]) { if (v === q[i]) a++; else b++; } }); return (a - b) / Math.sqrt(a + b || 1); };
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
for (const th of ['L', 'G']) { const T = tests.filter(t => t.th === th), ob = Math.max(...T.map(t => Math.abs(z(t.s, rr)))); let ge = 0; for (let i = 0; i < 2000; i++) { const q = mel(rr); if (Math.max(...T.map(t => Math.abs(z(t.s, q)))) >= ob) ge++; } const b = T.slice().sort((a, c) => Math.abs(z(c.s, rr)) - Math.abs(z(a.s, rr)))[0]; console.log('\n' + (th === 'L' ? 'principal' : 'angulaire') + ' : meilleure lecture', b.k, '(' + b.e.ok + ' / ' + b.e.ko + ') — atteinte par hasard dans', (100 * ge / 2000).toFixed(1) + ' % des mélanges (' + T.length + ' lectures)'); }
// combinaison : Terre des nœuds diagonaux (les deux diagonales) du principal + de l'angulaire
const tP = D.map(d => compte(d.L, d.L.R1, null, 3) - compte(d.L, d.L.R7, null, 3)), tG = D.map(d => compte(d.G, d.G.R1, null, 3) - compte(d.G, d.G.R7, null, 3));
const combi = { 'principal seul (verdict actuel)': tP.map(Math.sign), 'angulaire seul': tG.map(Math.sign), 'somme principal + angulaire': tP.map((x, i) => Math.sign(x + tG[i])), 'principal, sinon angulaire (relais)': tP.map((x, i) => Math.sign(x) || Math.sign(tG[i])), 'accord des deux seulement': tP.map((x, i) => Math.sign(x) === Math.sign(tG[i]) ? Math.sign(x) : 0) };
console.log('\nTerre des 2 nœuds diagonaux du front de chaque pôle, principal et angulaire combinés :');
for (const [k, s] of Object.entries(combi)) { const e = ev(s); console.log('  ' + k.padEnd(40), 'justes', e.ok, 'faux', e.ko, '| sans appel', e.eg, 'dont', e.ne, 'nuls'); }
// tableau croisé
console.log('\ntableau croisé (écart principal × écart angulaire) : R1 / R7 / nuls');
const t = {}; D.forEach((d, i) => { const k = (tP[i] > 0 ? '+' : tP[i] < 0 ? '−' : '0') + ' / ' + (tG[i] > 0 ? '+' : tG[i] < 0 ? '−' : '0'); t[k] = t[k] || [0, 0, 0]; if (d.r > 0) t[k][0]++; else if (d.r < 0) t[k][1]++; else t[k][2]++; });
['+ / +', '+ / 0', '+ / −', '0 / +', '0 / 0', '0 / −', '− / +', '− / 0', '− / −'].forEach(k => { if (t[k]) console.log('   principal ' + k.split(' / ')[0] + ', angulaire ' + k.split(' / ')[1] + ' :', 'R1', t[k][0], 'R7', t[k][1], 'nuls', t[k][2]); });
