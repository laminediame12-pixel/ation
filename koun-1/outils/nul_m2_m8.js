// Précision du propriétaire (2026-11-25) : nul lorsque R1 est en M2 et que M8 porte Tristitia. Quand R1 est en M2, R7 est en M8 (R7 = R1 + 6) :
// la condition dit donc que la maison de R7 porte sa propre figure (Tristitia chez elle, en M8). On teste la règle exacte, puis ce qu'elle généralise.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, b: L.theme.bases, nul: d.sc[0] === d.sc[1] }; });
const p0 = D.filter(d => d.nul).length / D.length;
const C = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return r; }, queue = (n, k, p) => { let s = 0; for (let i = k; i <= n; i++) s += C(n, i) * p ** i * (1 - p) ** (n - i); return s; };
function t(nom, f) { const X = D.filter(f), x = X.filter(d => d.nul).length, c = X.filter(d => d.lot === 'corpus'), a = X.filter(d => d.lot === 'aveugle');
  console.log('  ' + nom.padEnd(62), ('nuls ' + x + '/' + X.length).padEnd(12), '| corpus ' + c.filter(d => d.nul).length + '/' + c.length + ' · aveugle ' + a.filter(d => d.nul).length + '/' + a.length, X.length ? ' | hasard ≥ : ' + (100 * queue(X.length, x, p0)).toFixed(1) + ' %' : '');
  X.forEach(d => console.log('       ' + d.m.join('-').padEnd(12) + d.sc.join('-') + (d.nul ? '  ← nul' : ''))); }
console.log(D.length + ' matchs, taux de nul ' + Math.round(100 * p0) + ' %\n');
t('R1 en M2 et M8 = Tristitia (règle exacte)', d => d.L.R1.maison === 2 && d.b[8] === 8);
console.log('');
t('R1 en M2 (seul)', d => d.L.R1.maison === 2);
t('M8 = Tristitia (seul)', d => d.b[8] === 8);
console.log('\nCe que la règle généralise :');
const chez = (d, h) => d.b[h] === h;
t('M8 : Tristitia en base ou en résultante', d => d.b[8] === 8 || d.L.theme.resultantes[8] === 8);
t('la maison de R7 porte sa propre figure (chez elle)', d => chez(d, d.L.R7.maison));
t('la maison de R1 porte sa propre figure (chez elle)', d => chez(d, d.L.R1.maison));
t('l\'une des deux maisons de pôle porte sa figure', d => chez(d, d.L.R1.maison) || chez(d, d.L.R7.maison));
t('la figure de R7 est chez elle quelque part (base)', d => chez(d, d.L.R7.figure));
t('Tristitia posée en base n\'importe où', d => [...Array(16)].some((_, i) => d.b[i + 1] === 8));
t('M8 chez elle OU M2 chez elle (Laetitia en M2)', d => chez(d, 8) || chez(d, 2));
t('une figure du noyau Terre chez elle (M4, M8, M12, M16)', d => [4, 8, 12, 16].some(h => chez(d, h)));
t('figure chez elle en maison paire (2, 4, …, 16)', d => [2, 4, 6, 8, 10, 12, 14, 16].some(h => chez(d, h)));
t('nombre de figures chez elles ≥ 2', d => [...Array(16)].filter((_, i) => chez(d, i + 1)).length >= 2);
// M8 a Tristitia en résultante ⇔ base de M8 = Tristitia + Tristitia = Populus. Donc « Tristitia en M8, base ou résultante » ⇔ base de M8 ∈ {Tristitia, Populus}
// ⇔ les trois premiers niveaux de M8 sont saturés. M8 est la fille qui porte le niveau Terre des quatre mères : la condition dit « Terre saturée en M1, M2 et M3 ».
const K = require('../moteur3/noyau.js'), terre = (d, h) => K.niveaux(d.b[h])[3] === 2;
console.log('\nLoi de structure :');
const verif = D.every(d => ((d.b[8] === 8 || d.L.theme.resultantes[8] === 8) === (terre(d, 1) && terre(d, 2) && terre(d, 3))));
console.log('  vérification « Tristitia en M8 (base ou résultante) ⇔ Terre saturée en M1, M2, M3 » sur les 106 thèmes : ' + (verif ? 'exacte' : 'FAUSSE'));
t('Terre saturée en M1, M2 et M3', d => terre(d, 1) && terre(d, 2) && terre(d, 3));
[0, 1, 2, 3, 4].forEach(k => t('nombre de mères à Terre saturée = ' + k, d => [1, 2, 3, 4].filter(h => terre(d, h)).length === k));
t('Terre saturée en M2, M3, M4', d => terre(d, 2) && terre(d, 3) && terre(d, 4));
t('Terre saturée en M1, M2, M4', d => terre(d, 1) && terre(d, 2) && terre(d, 4));
t('Terre saturée en M1, M3, M4', d => terre(d, 1) && terre(d, 3) && terre(d, 4));
// les autres filles : même forme (trois premiers niveaux saturés) sur M5 (Feu des mères), M6 (Air), M7 (Eau)
[5, 6, 7].forEach((h, i) => t('M' + h + ' ∈ {Tristitia, Populus} (' + ['Feu', 'Air', 'Eau'][i] + ' saturé en M1, M2, M3)', d => d.b[h] === 8 || d.b[h] === 16));
