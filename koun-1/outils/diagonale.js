// Diagonale des nœuds 4-7-10-13 (maison h = croisement du niveau horizontal i et du niveau vertical j, h = 4j + i + 1)
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const NV = ['Feu', 'Air', 'Eau', 'Terre'], DG = [4, 7, 10, 13], DP = [1, 6, 11, 16];
console.log('nœuds :', DG.map(h => 'M' + h + ' = ' + NV[(h - 1) % 4] + ' × ' + NV[Math.floor((h - 1) / 4)]).join(' · '));
// ── structure sur 65 536 thèmes
const S = {}, cnt = { sommeB: new Set(), egal413_710: 0, sommeR: {}, popB: 0, sommeBegaleM16: 0, sommeBegaleM15: 0, egaleSommeDP: 0 };
for (let m = 0; m < 65536; m++) {
  const t = [1 + (m & 15), 1 + ((m >> 4) & 15), 1 + ((m >> 8) & 15), 1 + ((m >> 12) & 15)], T = K.construire(t), b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16];
  const sb = DG.map(h => b[h]).reduce(A), sr = DG.map(rz).reduce(A), sp = DP.map(h => b[h]).reduce(A);
  cnt.sommeB.add(sb); if (A(b[4], b[13]) === A(b[7], b[10])) cnt.egal413_710++; cnt.sommeR[nm(sr)] = (cnt.sommeR[nm(sr)] || 0) + 1;
  if (nm(sb) === 'Populus') cnt.popB++; if (sb === b[16]) cnt.sommeBegaleM16++; if (sb === b[15]) cnt.sommeBegaleM15++; if (sb === sp) cnt.egaleSommeDP++;
}
console.log('somme des bases 4+7+10+13 : prend', cnt.sommeB.size, 'valeurs ; Populus dans', cnt.popB, 'thèmes ; = M16 dans', cnt.sommeBegaleM16, '; = M15 dans', cnt.sommeBegaleM15, '; = somme de la diagonale 1-6-11-16 dans', cnt.egaleSommeDP);
console.log('M4+M13 = M7+M10 dans', cnt.egal413_710, 'thèmes sur 65 536');
console.log('somme des résultantes 4+7+10+13 :', JSON.stringify(cnt.sommeR));
// formule de la somme en fonction des mères (bits) : on cherche une égalité avec une combinaison de maisons
const combos = []; for (let mm = 1; mm < 65536; mm++) { const hs = []; for (let h = 1; h <= 16; h++) if ((mm >> (h - 1)) & 1) hs.push(h); if (hs.length <= 3) combos.push(hs); }
const ech = []; for (let k = 0; k < 400; k++) { const t = [1, 2, 3, 4].map(() => 1 + Math.floor(Math.random() * 16)); ech.push(K.construire(t).bases); }
const egales = combos.filter(hs => ech.every(b => hs.map(h => b[h]).reduce(A) === DG.map(h => b[h]).reduce(A))).map(hs => hs.join('+'));
console.log('combinaisons de 3 maisons au plus toujours égales à 4+7+10+13 :', egales.join(' · ') || 'aucune');
// ── corpus
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16]; return { ...d, L, b, rz, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const tab = (lab, f) => { const t = {}; D.forEach(d => { const k = f(d); t[k] = t[k] || [0, 0, 0, 0, 0]; t[k][0]++; t[k][1] += d.nul; if (d.r > 0) t[k][2]++; if (d.r < 0) t[k][3]++; t[k][4] += d.sc[0] + d.sc[1]; }); console.log('\n' + lab); Object.keys(t).sort((a, b) => t[b][1] / t[b][0] - t[a][1] / t[a][0]).forEach(k => console.log('   ', String(k).padEnd(20), 'n', String(t[k][0]).padStart(2), '| nuls', t[k][1], '| R1', t[k][2], 'R7', t[k][3], '| buts/match', (t[k][4] / t[k][0]).toFixed(1))); };
console.log('\n' + D.length + ' matchs, nuls', D.filter(d => d.nul).length);
tab('somme des bases 4+7+10+13 (figure)', d => nm(DG.map(h => d.b[h]).reduce(A)));
tab('somme des résultantes 4+7+10+13', d => nm(DG.map(d.rz).reduce(A)));
tab('niveaux impairs de la somme des bases', d => K.niveaux(DG.map(h => d.b[h]).reduce(A)).filter(v => v === 1).length);
tab('M4+M13 = M7+M10 ?', d => A(d.b[4], d.b[13]) === A(d.b[7], d.b[10]) ? 'oui' : 'non');
tab('nœuds saturés sur leurs deux niveaux (résultante, niveau i et niveau j)', d => DG.filter(h => { const l = K.niveaux(d.rz(h)), i = (h - 1) % 4, j = Math.floor((h - 1) / 4); return l[i] === 2 && l[j] === 2; }).length);
tab('pôle posé sur la diagonale', d => { const a = DG.includes(d.L.R1.maison), e = DG.includes(d.L.R7.maison); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; });
tab('figure d\'un pôle présente en base sur la diagonale', d => { const a = DG.some(h => d.b[h] === d.L.R1.figure), e = DG.some(h => d.b[h] === d.L.R7.figure); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; });
// fronts : 4 (D), 7 (C), 10 (B), 13 (A) : la diagonale touche les 4 fronts, un nœud chacun
tab('le nœud du front de R1 vs celui de R7 (Terre saturée de la résultante)', d => { const n = z => DG.find(h => (h - 1) % 4 === z), t = h => K.niveaux(d.rz(h))[3] === 2; const a = t(n((d.L.R1.figure - 1) % 4)), e = t(n((d.L.R7.figure - 1) % 4)); return a === e ? (a ? 'les deux saturés' : 'aucun') : a ? 'R1 seul' : 'R7 seul'; });
