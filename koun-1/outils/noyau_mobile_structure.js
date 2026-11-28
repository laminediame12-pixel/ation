// Lecture structurelle noyau / mobile (loi de la matrice) : dans un thème, chaque maison h porte une base b[h] ;
// même front que la maison → résultante dans le noyau Terre (équilibre) ; front allié (A/C, B/D) → front B, triplet mobile ; attaque → front A ou C.
// Dans son propre front : chez elle (Populus, concrétisé), miroir (Tristitia, suspens), front direct ± 4 (Albus / Fortuna Major, stable).
// Question : ces comptes dévoilent-ils le nul ? Puis : remplacent-ils avec profit le signe « noyau Terre » de la convergence du nul ?
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, 'aveugle')));
const fr = f => (f - 1) % 4, allie = (a, b) => (a + 2) % 4 === b;    // A(0)/C(2), B(1)/D(3)
const lecture = L => { const b = L.theme.bases, o = { meme: 0, allie: 0, attaque: 0, chez: 0, miroir: 0, direct: 0 };
  for (let h = 1; h <= 15; h++) { const a = fr(b[h]), z = fr(h); if (a === z) { o.meme++; const d = ((b[h] - h) % 16 + 16) % 16; if (d === 0) o.chez++; else if (d === 8) o.miroir++; else o.direct++; } else if (allie(a, z)) o.allie++; else o.attaque++; } return o; };
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, o: lecture(L), nul: d.sc[0] === d.sc[1] }; });
const pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—', p0 = D.filter(d => d.nul).length / D.length;
const tab = (nom, f) => { const t = {}; D.forEach(d => { const k = f(d); t[k] = t[k] || [0, 0, 0, 0]; t[k][0] += d.nul; t[k][1]++; if (d.lot === 'aveugle') { t[k][2] += d.nul; t[k][3]++; } });
  console.log(nom); Object.keys(t).sort((a, b) => (+a - +b) || a.localeCompare(b)).forEach(k => console.log('    ' + String(k).padEnd(12) + ('nuls ' + t[k][0] + '/' + t[k][1] + ' (' + pc(t[k][0], t[k][1]) + ')').padEnd(20) + '| aveugle ' + t[k][2] + '/' + t[k][3])); console.log(''); };
console.log(D.length + ' matchs, nuls ' + pc(D.filter(d => d.nul).length, D.length) + '\n');
tab('1. Maisons en équilibre (base du même front que la maison)', d => Math.min(d.o.meme, 6));
tab('2. Maisons mobiles (base en front allié)', d => Math.min(d.o.allie, 7));
tab('3. Équilibre − mobile', d => Math.max(-4, Math.min(4, d.o.meme - d.o.allie)));
tab('4. Équilibre en suspens (base dans la maison de son miroir : résultante Tristitia)', d => Math.min(d.o.miroir, 3));
tab('5. Équilibre concrétisé (base chez elle)', d => Math.min(d.o.chez, 3));
tab('6. Phase structurelle : équilibre si équilibre ≥ mobile, sinon mobile', d => d.o.meme >= d.o.allie ? 'équilibre' : 'mobile');
// dans la convergence du nul : remplacer le signe noyau (comptage des figures du noyau) par la phase structurelle
const y = D.map(d => d.nul ? 1 : 0), corr = (a, b) => { const n = a.length, ma = a.reduce((s, v) => s + v) / n, mb = b.reduce((s, v) => s + v) / n; let u = 0, v = 0, w = 0; for (let i = 0; i < n; i++) { u += (a[i] - ma) * (b[i] - mb); v += (a[i] - ma) ** 2; w += (b[i] - mb) ** 2; } return u / Math.sqrt(v * w); };
const sc0 = D.map(d => M.nulConvergence(d.L).score), noy = D.map(d => M.nulConvergence(d.L).signes[0].v), stru = D.map(d => d.o.meme >= d.o.allie ? 1 : -1);
const sc1 = sc0.map((s, i) => s - noy[i] + stru[i]);
console.log('Convergence du nul : actuelle ' + corr(sc0, y).toFixed(3) + ' · avec la phase structurelle à la place du noyau compté ' + corr(sc1, y).toFixed(3));
for (const [nom, sc] of [['actuelle', sc0], ['structurelle', sc1]]) { const fq = D.filter((d, i) => sc[i] >= 3), ec = D.filter((d, i) => sc[i] <= 0); console.log('   ' + nom.padEnd(13) + ' nul fréquent : ' + fq.filter(d => d.nul).length + '/' + fq.length + ' (aveugle ' + fq.filter(d => d.nul && d.lot === 'aveugle').length + '/' + fq.filter(d => d.lot === 'aveugle').length + ') · nul écarté : ' + ec.filter(d => d.nul).length + '/' + ec.length); }
