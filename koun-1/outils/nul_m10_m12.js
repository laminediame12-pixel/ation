// Affiner le nul avec M10 et M12, comme Feu de M9 / Eau de M11 : niveau a de M10 comparé au niveau b de M12 (égaux ou différents).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const NIV = ['Feu', 'Air', 'Eau', 'Terre'];
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, b: L.theme.bases, nul: d.sc[0] === d.sc[1] ? 1 : 0, ouvert: !M.nulParite(L).egaux }; });
const S = D.filter(d => d.ouvert);
console.log('matchs où le nul reste possible (Feu M9 ≠ Eau M11) :', S.length, '— nuls', S.filter(d => d.nul).length, '(' + Math.round(100 * S.filter(d => d.nul).length / S.length) + ' %)\n');
const paires = []; for (let a = 0; a < 4; a++) for (let c = 0; c < 4; c++) paires.push({ k: NIV[a] + ' de M10 / ' + NIV[c] + ' de M12', f: d => K.niveaux(d.b[10])[a] === K.niveaux(d.b[12])[c] });
// même chose avec M9 et M11 pour situer la règle actuelle, et M10/M12 croisés avec M9/M11
const res = paires.map(p => { const eg = S.filter(p.f), di = S.filter(d => !p.f(d)); return { k: p.k, f: p.f, egN: eg.length, egK: eg.filter(d => d.nul).length, diN: di.length, diK: di.filter(d => d.nul).length }; });
console.log('niveau de M10 / niveau de M12'.padEnd(34), 'égaux : nuls', ' | différents : nuls');
res.forEach(r => console.log('  ' + r.k.padEnd(32), String(r.egK).padStart(2) + '/' + String(r.egN).padEnd(3), ' | ', String(r.diK).padStart(2) + '/' + r.diN));
// meilleure séparation et hasard (mélange des nuls à l'intérieur des 38)
const y = S.map(d => d.nul), K0 = y.reduce((a, b) => a + b), p0 = K0 / S.length;
const sep = yy => Math.max(...paires.map(p => { let n = 0, k = 0; S.forEach((d, i) => { if (p.f(d)) { n++; k += yy[i]; } }); const n2 = S.length - n, k2 = K0 - k; return Math.abs(k / Math.max(n, 1) - k2 / Math.max(n2, 1)) * Math.sqrt(n * n2 / S.length); }));
const ob = sep(y); let ge = 0; for (let t = 0; t < 5000; t++) { const q = y.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (sep(q) >= ob) ge++; }
const best = res.slice().sort((a, b) => Math.abs(b.egK / Math.max(b.egN, 1) - b.diK / Math.max(b.diN, 1)) * Math.sqrt(b.egN * b.diN) - Math.abs(a.egK / Math.max(a.egN, 1) - a.diK / Math.max(a.diN, 1)) * Math.sqrt(a.egN * a.diN))[0];
console.log('\nmeilleure séparation :', best.k, '— égaux', best.egK + '/' + best.egN, ', différents', best.diK + '/' + best.diN, '; atteinte par hasard dans', (100 * ge / 5000).toFixed(1) + ' % des mélanges (16 paires testées)');
console.log('\ndétail des matchs (nul possible) selon cette paire :');
S.forEach(d => console.log('   ', (d.n || d.m.join('-')).padEnd(32), d.sc.join('-').padEnd(5), best.f(d) ? 'égaux' : 'différents', d.nul ? '← NUL' : ''));
// sur tout le corpus, la même paire hors de la règle M9/M11 (vérifier qu'elle ne fait pas que redire M9/M11)
const all = D, eg = all.filter(best.f); console.log('\nsur les 80 matchs : égaux', eg.filter(d => d.nul).length + '/' + eg.length, ', différents', all.filter(d => !best.f(d) && d.nul).length + '/' + all.filter(d => !best.f(d)).length);
// à venir
const P = require(path.join(R, 'validation/predictions-20-25-novembre-v3.json')), kn = new Set(lire('validation/scores-reels.json').map(x => x.themes.join('-')));
const av = P.matchs.filter(x => !kn.has(x.theme.join('-'))).map(x => { const L = M.lire(x.theme); return { n: x.match, ouvert: !M.nulParite(L).egaux, b: L.theme.bases }; }).filter(x => x.ouvert);
console.log('\nà venir où le nul reste possible :', av.length, '— selon', best.k + ' :', 'égaux', av.filter(best.f).map(x => x.n).join(' ; '), '| différents', av.filter(x => !best.f(x)).map(x => x.n).join(' ; '));
