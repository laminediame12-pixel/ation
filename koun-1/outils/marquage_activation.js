// Règle du propriétaire (2026-11-26) : une figure g posée en maison h ACTIVE les niveaux où ses points actifs (1) rencontrent un point actif de la maison
// (1 + 1 = 2). Exemple : Caput en M12 active Eau et Terre ; Caput en M6 active seulement l'Eau. La puissance de marquage se CONCRÉTISE quand la maison est
// dans un canal Terre (nœuds M4, M8, M12, M13, M14, M15) ou quand la Terre de la résultante est saturée (Albus en M6 : Terre 2 + 2 = 2, l'action se concrétise).
// Correction d'une erreur de lecture : « même si le niveau Terre n'est pas saturé » veut dire que la Terre saturée n'est pas exigée dans les canaux Terre,
// et non qu'elle doit être ouverte ; la condition « Terre ouverte » est retirée.
// 1. Table : pour chaque figure, les maisons où elle active des niveaux, lesquels, et si l'action se concrétise.
// 2. Marquage d'un pôle : lui-même ou son front direct (f + 4) posé dans une maison où il active au moins un niveau et où l'action se concrétise
//    (Populus, sans point actif mais entièrement saturé, compte quand l'action se concrétise). Comparé à la règle actuelle du moteur.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1, NV = ['Feu', 'Air', 'Eau', 'Terre'], CANAL = [4, 8, 12, 13, 14, 15];
const active = (g, h) => [0, 1, 2, 3].filter(l => K.niveaux(g)[l] === 1 && K.niveaux(h)[l] === 1);
const concret = (g, h) => CANAL.includes(h) || K.niveaux(K.additionner(g, h))[3] === 2;
const marquante = (g, h) => h < 16 && (active(g, h).length > 0 || g === 16) && concret(g, h);
if (process.argv[2] === 'table') { for (let g = 1; g <= 16; g++) { const l = []; for (let h = 1; h <= 15; h++) { const a = active(g, h); if (a.length || g === 16) l.push('M' + h + ' ' + (a.map(x => NV[x]).join('+') || 'saturée') + (concret(g, h) ? ' ✓' : ' ·')); } console.log((g + ' ' + N(g)).padEnd(18) + l.join(' | ')); } process.exit(0); }
console.log('Exemples : Caput en M12 active ' + active(3, 12).map(x => NV[x]).join(' + ') + (concret(3, 12) ? ', concrétisé' : '') + ' · Caput en M6 active ' + active(3, 6).map(x => NV[x]).join(' + ') + (concret(3, 6) ? ', concrétisé' : ', non concrétisé') + ' · Albus en M6 active ' + active(4, 6).map(x => NV[x]).join(' + ') + (concret(4, 6) ? ', concrétisé (Terre ' + K.niveaux(K.additionner(4, 6))[3] + ')' : '') + '\n');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot, nom) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus', x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus', '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus', 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, 'aveugle', x.match)));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m) }));
const VAR = {
  'règle de l\'activation (lui + front direct ; canal Terre ou Terre de la résultante saturée)': (L, p) => { const b = L.theme.bases, f = [L[p].figure, mod(L[p].figure + 4)]; return [...Array(15)].some((_, i) => f.includes(b[i + 1]) && marquante(b[i + 1], i + 1)); },
  'même règle, canaux Terre seulement': (L, p) => { const b = L.theme.bases, f = [L[p].figure, mod(L[p].figure + 4)]; return CANAL.some(h => f.includes(b[h]) && (active(b[h], h).length || b[h] === 16)); },
  'même règle, lui-même seulement': (L, p) => { const b = L.theme.bases; return [...Array(15)].some((_, i) => b[i + 1] === L[p].figure && marquante(b[i + 1], i + 1)); },
  'règle actuelle du moteur (marquePole)': (L, p) => M.marquePole(L, p).marque,
};
const pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
console.log(D.length + ' matchs, ' + 2 * D.length + ' pôles ; un pôle marque dans ' + pc(D.reduce((s, d) => s + (d.sc[0] > 0) + (d.sc[1] > 0), 0), 2 * D.length) + ' des cas');
for (const [k, f] of Object.entries(VAR)) { console.log('\n' + k);
  for (const lot of ['corpus', 'aveugle']) { let a = 0, n = 0, a0 = 0, n0 = 0, dj = 0, dn = 0; D.filter(d => d.lot === lot).forEach(d => { const v = ['R1', 'R7'].map(p => f(d.L, p)); v.forEach((x, i) => { const m = d.sc[i] > 0; if (x) { n++; if (m) a++; } else { n0++; if (m) a0++; } }); dn++; if ((v[0] && v[1]) === (d.sc[0] > 0 && d.sc[1] > 0)) dj++; });
    console.log('    ' + lot.padEnd(8) + ' marquant : marque ' + a + '/' + n + ' (' + pc(a, n) + ') · non marquant : marque ' + a0 + '/' + n0 + ' (' + pc(a0, n0) + ') · « marque / ne marque pas » juste ' + (a + n0 - a0) + '/' + (n + n0) + ' · « deux marquent » juste ' + dj + '/' + dn); } }
['Juventus – Venezia', 'Atlético – Viking'].forEach(nm => { const d = D.find(x => x.nom === nm); if (d) console.log('\n' + nm + ' (' + d.sc.join('-') + ') : R1 ' + (VAR[Object.keys(VAR)[0]](d.L, 'R1') ? 'marque' : 'ne marque pas') + ' · R7 ' + (VAR[Object.keys(VAR)[0]](d.L, 'R7') ? 'marque' : 'ne marque pas')); });
