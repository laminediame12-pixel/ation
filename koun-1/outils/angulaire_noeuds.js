// Thème angulaire : les nœuds (croisements des canaux) dans la boucle de front de chaque pôle, comparés au thème principal.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const ANG = [1, 4, 7, 10], angulaire = Lp => M.lire(ANG.map(h => Lp.theme.bases[h]));
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), G = angulaire(L); return { ...d, L, G, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
// nœuds du front d'un pôle (front de sa figure, comme les coordonnées)
function nf(Lx, c) { const N = M.noeuds(Lx), f = N.fronts.filter(x => x.front === K.front(c.figure))[0]; return f; }
function st(Lx, c, mh) { const n = nf(Lx, c).noeuds.filter(x => x.maison === mh)[0]; return n ? (n.etat === 'plein' ? 2 : n.etat === 'mixte' ? 1 : 0) : 0; }
const mesures = {
  'nœuds pleins du front': (Lx, c) => nf(Lx, c).pleins,
  'nœuds vides du front (moins = mieux)': (Lx, c) => -nf(Lx, c).vides,
  'pleins − vides': (Lx, c) => nf(Lx, c).pleins - nf(Lx, c).vides,
  'nœuds diagonaux 1-6-11 (état)': (Lx, c) => [1, 6, 11].reduce((a, h) => a + st(Lx, c, h), 0),
  'nœuds diagonaux 4-7-10-13 (état)': (Lx, c) => [4, 7, 10, 13].reduce((a, h) => a + st(Lx, c, h), 0),
  'nœuds Terre (ligne et colonne Terre : 4, 8, 12, 13, 14, 15)': (Lx, c) => [4, 8, 12, 13, 14, 15].reduce((a, h) => a + st(Lx, c, h), 0),
  'nœuds Feu × Air (2, 5)': (Lx, c) => [2, 5].reduce((a, h) => a + st(Lx, c, h), 0),
  'nœuds Eau × Terre (12, 15)': (Lx, c) => [12, 15].reduce((a, h) => a + st(Lx, c, h), 0),
  'nœud de la maison du pôle': (Lx, c) => c.maison < 16 ? st(Lx, c, c.maison) : 0,
  'nœud de la coordination M1+M7': (Lx, c) => { const x = K.additionner(Lx.theme.bases[1], Lx.theme.bases[7]); return x < 16 ? st(Lx, c, x) : 0; },
};
const sgn = Math.sign, res = [];
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls\n');
console.log('comparaison R1 / R7 (le plus fort gagne) :'.padEnd(64), 'THÈME PRINCIPAL'.padEnd(26), 'THÈME ANGULAIRE');
for (const [k, f] of Object.entries(mesures)) {
  const ligne = [];
  for (const th of ['L', 'G']) { let ok = 0, ko = 0, eg = 0, ne = 0; const s = D.map(d => sgn(f(d[th], d[th].R1) - f(d[th], d[th].R7))); D.forEach((d, i) => { if (!s[i]) { eg++; ne += d.nul; } else if (d.r) { if (s[i] === d.r) ok++; else ko++; } }); ligne.push(String(ok).padStart(2) + ' / ' + String(ko).padStart(2) + ' (nuls ' + ne + '/' + eg + ')'); res.push({ k: (th === 'L' ? 'principal : ' : 'angulaire : ') + k, s }); }
  console.log('  ' + k.padEnd(62), ligne[0].padEnd(26), ligne[1]);
}
const coord = th => D.map(d => sgn(M.coordonnees(d[th]).ecart)), diag = th => D.map(d => sgn(M.diagonales(d[th]).ecart));
[['coordonnées (M1+M7, M9, M2+M8)', coord], ['nœuds diagonaux, Terre (verdict)', diag]].forEach(([k, f]) => { const ligne = []; ['L', 'G'].forEach(th => { const s = f(th); let ok = 0, ko = 0, eg = 0, ne = 0; D.forEach((d, i) => { if (!s[i]) { eg++; ne += d.nul; } else if (d.r) { if (s[i] === d.r) ok++; else ko++; } }); ligne.push(String(ok).padStart(2) + ' / ' + String(ko).padStart(2) + ' (nuls ' + ne + '/' + eg + ')'); res.push({ k: (th === 'L' ? 'principal : ' : 'angulaire : ') + k, s }); }); console.log('  ' + k.padEnd(62), ligne[0].padEnd(26), ligne[1]); });
// hasard : meilleur des tests angulaires
const rr = D.map(d => d.r), sc = (s, q) => { let a = 0, b = 0; s.forEach((v, i) => { if (v && q[i]) { if (v === q[i]) a++; else b++; } }); return (a - b) / Math.sqrt(a + b || 1); };
const ang = res.filter(x => x.k.startsWith('angulaire')), ob = Math.max(...ang.map(x => Math.abs(sc(x.s, rr)))); let ge = 0;
for (let t = 0; t < 3000; t++) { const q = rr.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (Math.max(...ang.map(x => Math.abs(sc(x.s, q)))) >= ob) ge++; }
const best = ang.slice().sort((a, b) => Math.abs(sc(b.s, rr)) - Math.abs(sc(a.s, rr)))[0];
console.log('\nmeilleur test du thème angulaire :', best.k, '— atteint par hasard dans', (100 * ge / 3000).toFixed(1) + ' % des mélanges');
// accord entre le verdict principal (nœuds diagonaux) et chaque test angulaire
const vp = diag('L');
console.log('\nverdict principal (nœuds diagonaux) croisé avec le thème angulaire :');
ang.forEach(x => { const c = { accord: [0, 0, 0], oppose: [0, 0, 0], angSeul: [0, 0, 0] }; D.forEach((d, i) => { const a = vp[i], g = x.s[i]; let k = null, v = 0; if (a && g) { k = a === g ? 'accord' : 'oppose'; v = k === 'accord' ? a : g; } else if (g && !a) { k = 'angSeul'; v = g; } if (!k) return; if (!d.r) c[k][2]++; else if (v === d.r) c[k][0]++; else c[k][1]++; }); console.log('   ', x.k.replace('angulaire : ', '').padEnd(60), 'accord', c.accord.join('/'), '| opposés (selon angulaire)', c.oppose.join('/'), '| angulaire seul', c.angSeul.join('/'), '  (justes/faux/nuls)'); });
// nul : égalité des nœuds dans le thème angulaire
console.log('\nnul quand le thème angulaire est à égalité de nœuds pleins−vides :'); { const t = {}; D.forEach(d => { const k = (sgn((nf(d.G, d.G.R1).pleins - nf(d.G, d.G.R1).vides) - (nf(d.G, d.G.R7).pleins - nf(d.G, d.G.R7).vides)) === 0 ? 'égalité' : 'écart') + ' / principal ' + (sgn((nf(d.L, d.L.R1).pleins - nf(d.L, d.L.R1).vides) - (nf(d.L, d.L.R7).pleins - nf(d.L, d.L.R7).vides)) === 0 ? 'égalité' : 'écart'); t[k] = t[k] || [0, 0]; t[k][0]++; t[k][1] += d.nul; }); Object.keys(t).sort().forEach(k => console.log('    ', k.padEnd(34), t[k][1], 'nuls sur', t[k][0])); }
