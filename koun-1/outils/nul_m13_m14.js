// Les témoins M13 et M14 face au nul.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'];
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme; return { ...d, L, b: T.bases, r: h => T.resultantes[h], nul: d.sc[0] === d.sc[1] ? 1 : 0, ouvert: !M.nulParite(L).egaux }; });
const fr = n => (n - 1) % 4;
const lect = {};
for (const h of [13, 14]) { for (let l = 0; l < 4; l++) { lect[NIV[l] + ' de M' + h + ' (base)'] = d => K.niveaux(d.b[h])[l] === 2 ? 'saturé' : 'ouvert'; lect[NIV[l] + ' de M' + h + ' (résultante)'] = d => K.niveaux(d.r(h))[l] === 2 ? 'saturé' : 'ouvert'; } lect['M' + h + ' : figure'] = d => nm(d.b[h]); lect['M' + h + ' : niveaux impairs'] = d => K.niveaux(d.b[h]).filter(v => v === 1).length; lect['M' + h + ' : front = front de'] = d => { const a = fr(d.b[h]) === fr(d.L.R1.figure), e = fr(d.b[h]) === fr(d.L.R7.figure); return a && e ? 'les deux' : a ? 'R1' : e ? 'R7' : 'aucun'; }; }
lect['M13 = M14'] = d => d.b[13] === d.b[14] ? 'oui' : 'non';
for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) lect[NIV[a] + ' de M13 / ' + NIV[c] + ' de M14'] = d => K.niveaux(d.b[13])[a] === K.niveaux(d.b[14])[c] ? 'égaux' : 'différents';
lect['M13 et M14 : même front'] = d => fr(d.b[13]) === fr(d.b[14]) ? 'oui' : 'non';
lect['M13 ou M14 = figure d\'un pôle'] = d => [13, 14].some(h => d.b[h] === d.L.R1.figure || d.b[h] === d.L.R7.figure) ? 'oui' : 'non';
function cribler(S, titre) {
  const y = S.map(d => d.nul), K0 = y.reduce((a, b) => a + b), p0 = K0 / S.length, rows = [];
  for (const [lab, f] of Object.entries(lect)) { const t = {}; S.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, []]; t[k][0]++; if (d.nul) { t[k][1]++; t[k][2].push(d.sc.join('-')); } }); Object.keys(t).forEach(k => rows.push({ lab, k, x: S.map(d => String(f(d)) === k ? 1 : 0), n: t[k][0], kk: t[k][1] })); }
  const ok = r => r.n >= 6 && r.n <= S.length - 6, z = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.n * p0) / Math.sqrt(r.n * p0 * (1 - p0)); };
  const R0 = rows.filter(ok), ob = Math.max(...R0.map(r => Math.abs(z(r, y)))); let ge = 0;
  for (let t = 0; t < 3000; t++) { const q = y.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (Math.max(...R0.map(r => Math.abs(z(r, q)))) >= ob) ge++; }
  console.log(titre + ' : ' + S.length + ' matchs, ' + K0 + ' nuls (' + Math.round(100 * p0) + ' %) ; ' + R0.length + ' cases ; la meilleure est atteinte par hasard dans ' + (100 * ge / 3000).toFixed(1) + ' % des mélanges');
  R0.slice().sort((a, b) => Math.abs(z(b, y)) - Math.abs(z(a, y))).slice(0, 8).forEach(r => console.log('    ', (r.lab + ' = ' + r.k).padEnd(50), r.kk + ' nuls sur ' + r.n, '(' + Math.round(100 * r.kk / r.n) + ' %)'));
  console.log('     cases sans nul (au moins 8 matchs) :', R0.filter(r => r.kk === 0 && r.n >= 8).map(r => r.lab + ' = ' + r.k + ' (' + r.n + ')').join(' · ') || 'aucune');
}
cribler(D, '1. les 80 matchs'); console.log(''); cribler(D.filter(d => d.ouvert), '2. matchs à nul possible (Feu M9 ≠ Eau M11)');
