// Attaque et défense. Pour une figure f : son antagoniste a = f−3 l'attaque, son protecteur p = f−6 attaque a.
// Défense d'un pôle : son protecteur est-il posé (en base), et bloque-t-il l'antagoniste ? Attaque : parité de l'énergie (H-PARITE-EB) et nœuds diagonaux.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, fr = n => (n - 1) % 4;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, r: Math.sign(d.sc[0] - d.sc[1]), nul: d.sc[0] === d.sc[1] ? 1 : 0 }; });
const enBase = (L, f) => { const o = []; for (let h = 1; h <= 16; h++) if (L.theme.bases[h] === f) o.push(h); return o; };
const front = c => [0, 1, 2, 3].map(i => fr(c.figure) + 1 + 4 * i);
function defense(L, c) {
  const f = c.figure, a = mod(f - 3), p = mod(f - 6), fz = front(c), A = enBase(L, a), P = enBase(L, p);
  const aFront = A.filter(h => fz.includes(h)).length, pFront = P.filter(h => fz.includes(h)).length;
  // niveau : 'tenue' (pas d'attaque, ou attaque bloquée par le protecteur), 'percée' (antagoniste posé, protecteur absent)
  const etat = !A.length ? (P.length ? 'protégée' : 'calme') : P.length ? 'attaque bloquée' : 'percée';
  return { a, p, A, P, aFront, pFront, etat, tenue: etat !== 'percée' };
}
const attaque = (L, c, cote) => M.marquage(L)[cote].parite.equilibre; // l'énergie passe (52 pôles sur 55 ont marqué)
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls\n');
// 1. buts encaissés selon la défense
const g = {}; D.forEach(d => [['R1', d.L.R1, d.sc[0], d.sc[1]], ['R7', d.L.R7, d.sc[1], d.sc[0]]].forEach(([cote, c, pour, contre]) => { const k = defense(d.L, c).etat; g[k] = g[k] || [0, 0, 0, 0]; g[k][0]++; g[k][1] += contre; if (contre === 0) g[k][2]++; g[k][3] += pour; }));
console.log('1. défense du pôle (son antagoniste posé en base ? son protecteur ?) et buts encaissés :');
Object.keys(g).forEach(k => console.log('    ', k.padEnd(16), 'n', String(g[k][0]).padStart(3), '| encaisse', (g[k][1] / g[k][0]).toFixed(2), 'buts | clean sheet', g[k][2] + '/' + g[k][0], '| marque', (g[k][3] / g[k][0]).toFixed(2)));
// 2. le but : attaque du pôle contre défense de l'adversaire
console.log('\n2. un pôle marque-t-il ? son attaque (parité équilibrée) contre la défense adverse :');
const h = {}; D.forEach(d => [['R1', d.L.R1, d.L.R7, 'R7', d.sc[0]], ['R7', d.L.R7, d.L.R1, 'R1', d.sc[1]]].forEach(([cote, c, adv, cAdv, pour]) => { const k = 'attaque ' + (attaque(d.L, c, cote) ? 'forte' : 'faible') + ' · défense adverse ' + (defense(d.L, adv).tenue ? 'tenue' : 'percée'); h[k] = h[k] || [0, 0, 0]; h[k][0]++; if (pour > 0) h[k][1]++; h[k][2] += pour; }));
Object.keys(h).sort().forEach(k => console.log('    ', k.padEnd(46), h[k][1] + '/' + h[k][0], 'marquent,', (h[k][2] / h[k][0]).toFixed(2), 'buts'));
// 3. le match : chaque pôle = attaque + défense
console.log('\n3. le match : attaque et défense de chaque pôle ensemble');
const etatP = (d, c, cote) => (attaque(d.L, c, cote) ? 'A' : 'a') + (defense(d.L, c).tenue ? 'D' : 'd'); // A attaque forte, D défense tenue
const t = {}; D.forEach(d => { const k = 'R1 ' + etatP(d, d.L.R1, 'R1') + ' / R7 ' + etatP(d, d.L.R7, 'R7'); t[k] = t[k] || [0, 0, 0]; if (d.r > 0) t[k][0]++; else if (d.r < 0) t[k][1]++; else t[k][2]++; });
console.log('    (A = attaque forte, a = faible ; D = défense tenue, d = percée)');
Object.keys(t).sort().forEach(k => console.log('    ', k.padEnd(16), 'R1', t[k][0], 'R7', t[k][1], 'nuls', t[k][2]));
const score = (d, c, cote) => (attaque(d.L, c, cote) ? 1 : 0) + (defense(d.L, c).tenue ? 1 : 0);
let ok = 0, ko = 0, eg = 0, ne = 0; D.forEach(d => { const s = Math.sign(score(d, d.L.R1, 'R1') - score(d, d.L.R7, 'R7')); if (!s) { eg++; ne += d.nul; } else if (d.r) { if (s === d.r) ok++; else ko++; } });
console.log('    le pôle le plus complet (attaque + défense) gagne', ok, 'perd', ko, '| égalité', eg, 'dont', ne, 'nuls');
let ok2 = 0, ko2 = 0, eg2 = 0; D.forEach(d => { const a = defense(d.L, d.L.R1).tenue, e = defense(d.L, d.L.R7).tenue; if (a === e) { eg2++; return; } const s = a ? 1 : -1; if (d.r) { if (s === d.r) ok2++; else ko2++; } });
console.log('    défense seule : le pôle dont la défense tient, face à une défense percée, gagne', ok2, 'perd', ko2);
// 4. défense dans le front : antagoniste posé dans le front du pôle, protecteur posé dans le front du pôle
console.log('\n4. dans le front du pôle : antagonistes et protecteurs posés (buts encaissés)');
const u = {}; D.forEach(d => [[d.L.R1, d.sc[1]], [d.L.R7, d.sc[0]]].forEach(([c, contre]) => { const x = defense(d.L, c), k = 'antagoniste dans le front ' + (x.aFront ? 'oui' : 'non') + ' · protecteur dans le front ' + (x.pFront ? 'oui' : 'non'); u[k] = u[k] || [0, 0]; u[k][0]++; u[k][1] += contre; }));
Object.keys(u).sort().forEach(k => console.log('    ', k.padEnd(56), 'n', String(u[k][0]).padStart(3), '| encaisse', (u[k][1] / u[k][0]).toFixed(2)));
// 5. la défense quand le verdict ne tranche pas, et quand il tranche
const c5 = {}; D.forEach(d => { const V = M.verdict(d.L), v = V.v === '1' ? 1 : V.v === '2' ? -1 : 0, a = defense(d.L, d.L.R1).tenue, e = defense(d.L, d.L.R7).tenue, s = a === e ? 0 : a ? 1 : -1; const k = !v ? (s ? 'verdict sans appel, une seule défense tient' : 'verdict sans appel, défenses égales') : (!s ? 'verdict, défenses égales' : s === v ? 'verdict et défense d\'accord' : 'verdict contre la défense'); c5[k] = c5[k] || { juste: 0, faux: 0, nul: 0 }; const w = !v ? s : v; if (!d.r) c5[k].nul++; else if (w) { if (w === d.r) c5[k].juste++; else c5[k].faux++; } });
console.log('\n5. la défense face au verdict actuel (justes/faux selon le verdict, ou selon la défense quand il est sans appel) :'); Object.entries(c5).forEach(([k, o]) => console.log('    ', k.padEnd(46), JSON.stringify(o)));
