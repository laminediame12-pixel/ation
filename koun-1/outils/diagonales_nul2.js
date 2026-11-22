// Le nul par l'équilibre des diagonales entre les deux pôles (R1 et R7 occupent toujours des fronts alliés : A/C ou B/D).
// Nœuds diagonaux d'un front : un sur 1-6-11-16, un sur 4-7-10-13 (A : M1, M13 ; B : M6, M10 ; C : M11, M7 ; D : M16, M4).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const fr = n => (n - 1) % 4, NV = ['Feu', 'Air', 'Eau', 'Terre'];
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => { const L = M.lire(d.m), T = L.theme, rz = h => h < 16 ? T.resultantes[h] : T.bases[16]; return { ...d, L, T, rz, nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const nd = c => { const z = fr(c.figure); return { p: [1, 6, 11, 16].find(h => (h - 1) % 4 === z), a: [4, 7, 10, 13].find(h => (h - 1) % 4 === z) }; };
const lv = (f, l) => K.niveaux(f)[l];
const L_ = {};
// 1. catégorie du verdict (contradictions)
L_['catégorie du verdict'] = d => { const V = M.verdict(d.L); return V.regle === 'H-M1-M10' ? 'relais M1–M10' : V.v ? (V.force === 'confirmee' ? 'accord Terre+coord' : V.regle === 'H-REPOS' ? 'repos' : V.regle === 'H-DIAGONALES-TERRE' ? 'Terre seule' : 'coord seules') : (V.raison.startsWith('forces opposées') ? 'Terre contre coord' : 'rien'); };
// 2. égalités entre les nœuds des deux pôles
L_['somme des 2 résultantes diagonales : R1 = R7'] = d => { const a = nd(d.L.R1), e = nd(d.L.R7); return A(d.rz(a.p), d.rz(a.a)) === A(d.rz(e.p), d.rz(e.a)) ? 'oui' : 'non'; };
NV.forEach((n, l) => { L_['niveau ' + n + ' des 2 nœuds : même profil R1 et R7'] = d => { const a = nd(d.L.R1), e = nd(d.L.R7), pa = [lv(d.rz(a.p), l), lv(d.rz(a.a), l)].sort().join(''), pe = [lv(d.rz(e.p), l), lv(d.rz(e.a), l)].sort().join(''); return pa === pe ? 'oui' : 'non'; }; });
L_['nombre de niveaux saturés sur les 2 nœuds : R1 − R7'] = d => { const s = c => { const x = nd(c); return [x.p, x.a].reduce((t, h) => t + K.niveaux(d.rz(h)).filter(v => v === 2).length, 0); }; const v = s(d.L.R1) - s(d.L.R7); return v === 0 ? '0' : Math.abs(v) <= 1 ? '±1' : Math.abs(v) <= 3 ? '±2-3' : '±4+'; };
// 3. liaisons par parité entre les nœuds des deux pôles (même diagonale)
NV.forEach((n, l) => { L_['liaison ' + n + ' entre nœuds 1-6-11-16 des deux pôles'] = d => { const a = nd(d.L.R1).p, e = nd(d.L.R7).p; return a === e ? 'même nœud' : lv(A(d.rz(a), d.rz(e)), l) === 2 ? 'liée' : 'arrêt'; }; L_['liaison ' + n + ' entre nœuds 4-7-10-13 des deux pôles'] = d => { const a = nd(d.L.R1).a, e = nd(d.L.R7).a; return a === e ? 'même nœud' : lv(A(d.rz(a), d.rz(e)), l) === 2 ? 'liée' : 'arrêt'; }; });
// 4. somme des 4 nœuds diagonaux des deux pôles
L_['somme des 4 nœuds diagonaux des deux pôles'] = d => { const a = nd(d.L.R1), e = nd(d.L.R7); return nm([a.p, a.a, e.p, e.a].map(d.rz).reduce(A)); };
L_['somme des 4 nœuds : niveaux impairs'] = d => { const a = nd(d.L.R1), e = nd(d.L.R7); return K.niveaux([a.p, a.a, e.p, e.a].map(d.rz).reduce(A)).filter(v => v === 1).length; };
// 5. diagonales entières
L_['somme des résultantes 1-6-11-16 = somme 4-7-10-13'] = d => [1, 6, 11, 16].map(d.rz).reduce(A) === [4, 7, 10, 13].map(d.rz).reduce(A) ? 'oui' : 'non';
L_['somme des 8 résultantes diagonales'] = d => nm([1, 6, 11, 16, 4, 7, 10, 13].map(d.rz).reduce(A));
L_['somme des 8 : niveaux impairs'] = d => K.niveaux([1, 6, 11, 16, 4, 7, 10, 13].map(d.rz).reduce(A)).filter(v => v === 1).length;
const rows = [];
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls (' + Math.round(100 * D.filter(d => d.nul).length / D.length) + ' %)\n');
for (const [lab, f] of Object.entries(L_)) { const t = {}; D.forEach(d => { const k = String(f(d)); t[k] = t[k] || [0, 0, []]; t[k][0]++; if (d.nul) { t[k][1]++; t[k][2].push(d.sc.join('-')); } }); Object.keys(t).forEach(k => rows.push({ lab, k, x: D.map(d => String(f(d)) === k ? 1 : 0), n: t[k][0], nul: t[k][1], sc: t[k][2] })); if (Object.keys(t).length <= 7) console.log(lab.padEnd(58), Object.keys(t).sort().map(k => k + ' ' + t[k][1] + '/' + t[k][0]).join(' · ')); }
const y = D.map(d => d.nul), p0 = y.reduce((a, b) => a + b) / D.length, ok = r => r.n >= 6 && r.n <= D.length - 6;
const z = (r, yy) => { let k = 0; r.x.forEach((v, i) => { if (v && yy[i]) k++; }); return (k - r.n * p0) / Math.sqrt(r.n * p0 * (1 - p0)); };
const R0 = rows.filter(ok), ob = Math.max(...R0.map(r => z(r, y))); let ge = 0;
for (let t = 0; t < 3000; t++) { const q = y.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (Math.max(...R0.map(r => z(r, q))) >= ob) ge++; }
console.log('\n' + R0.length + ' cases (au moins 6 matchs) ; les plus liées au nul :');
R0.slice().sort((a, b) => z(b, y) - z(a, y)).slice(0, 8).forEach(r => console.log('    ', (r.lab + ' = ' + r.k).padEnd(72), r.nul + ' nuls sur ' + r.n, r.nul ? '(' + r.sc.join(', ') + ')' : ''));
console.log('la meilleure est atteinte par hasard dans', (100 * ge / 3000).toFixed(1) + ' % des mélanges');
console.log('\nles cases sans aucun nul (au moins 8 matchs) :', R0.filter(r => r.nul === 0 && r.n >= 8).map(r => r.lab + ' = ' + r.k + ' (' + r.n + ')').join(' · ') || 'aucune');
