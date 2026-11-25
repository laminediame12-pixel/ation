// Méthode du propriétaire (2026-11-25) : le nul n'est jamais dit par un seul signe ; il est confirmé par plusieurs.
// Exemple : si R1 + R7 = Carcer, avant de dire nul ou non nul, regarder le noyau Terre, le triplet mobile et l'équilibre.
// Signes lus pour chaque match (sens fixé d'avance par le système) :
//   noyau Terre   : phase d'équilibre (noyau ≥ mobile) → pour le nul ; phase mobile → contre
//   triplet mobile : la distance de R1 à R7 ou leur somme tombe sur Amissio, Carcer ou Puella → contre (le mouvement continue)
//   équilibre     : écarts de base et de résultante qui s'annulent (M.equilibre) → pour
//   Terre des mères : Terre de M1, M2, M3 identique (toute saturée ou toute ouverte) → pour ; Terre de M14 saturée → pour
// On compte les signes pour moins les signes contre, et on regarde le taux de nul par niveau de convergence, lot par lot.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const NOY = [4, 8, 12, 16], MOB = [6, 10, 14];
function phaseNoyau(L) { let n = 0, m = 0; for (let h = 1; h <= 16; h++) [L.theme.bases[h], L.resu(h)].forEach(f => { if (NOY.includes(f)) n++; if (MOB.includes(f)) m++; }); return m > n ? 'mobile' : 'équilibre'; }
const terre = (b, h) => K.niveaux(b[h])[3] === 2;
const SIGNES = {
  'noyau Terre en équilibre (pour) / mobile (contre)': L => phaseNoyau(L) === 'mobile' ? -1 : 1,
  'triplet mobile entre R1 et R7 (contre)': L => { const d = ((L.R7.figure - L.R1.figure) % 16 + 16) % 16; return MOB.includes(d) || MOB.includes(L.lien) ? -1 : 0; },
  'équilibre des deux parties (pour)': L => M.equilibre(L).equilibre ? 1 : 0,
  // remplacé le 2026-11-25 (thème 12-10-14-5, nul validé par le propriétaire) : la Terre des trois premières mères identique, toute saturée OU toute ouverte
  'Terre de M1, M2, M3 identique (pour)': L => { const t = h => K.niveaux(L.theme.bases[h])[3]; return t(1) === t(2) && t(2) === t(3) ? 1 : 0; },
  // ajouté le 2026-11-25 (demande du propriétaire, diagonales des nœuds) : la Terre concrétise l'action ; sur les 8 maisons des diagonales 1-6-11-16 et 4-7-10-13,
  // moins de 4 résultantes à Terre saturée = actions non concrétisées → pour le nul (11/39 contre 11/67 ; seule des 7 lectures diagonales qui ajoute)
  'diagonales des nœuds peu concrétisées (moins de 4 Terre saturées sur 8) (pour)': L => [1, 6, 11, 16, 4, 7, 10, 13].filter(h => K.niveaux(h < 16 ? L.theme.resultantes[h] : L.theme.bases[16])[3] === 2).length < 4 ? 1 : 0,
  'Terre de M14 saturée (pour)': L => terre(L.theme.bases, 14) ? 1 : 0,
};
const D = [...tous.values()].map(d => { const L = M.lire(d.m), s = {}; for (const k in SIGNES) s[k] = SIGNES[k](L); return { ...d, L, s, score: Object.values(s).reduce((a, b) => a + b, 0), nul: d.sc[0] === d.sc[1] }; });
const p0 = D.filter(d => d.nul).length / D.length;
const ligne = (nom, X) => { const c = X.filter(d => d.lot === 'corpus'), a = X.filter(d => d.lot === 'aveugle'), x = X.filter(d => d.nul).length; return '  ' + nom.padEnd(54) + ('nuls ' + x + '/' + X.length + (X.length ? ' (' + Math.round(100 * x / X.length) + ' %)' : '')).padEnd(17) + '| corpus ' + c.filter(d => d.nul).length + '/' + c.length + ' · aveugle ' + a.filter(d => d.nul).length + '/' + a.length; };
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls (' + Math.round(100 * p0) + ' %)\n\n1. Chaque signe seul');
for (const k in SIGNES) { [1, 0, -1].forEach(v => { const X = D.filter(d => d.s[k] === v); if (X.length) console.log(ligne(k + ' = ' + (v > 0 ? 'pour' : v < 0 ? 'contre' : 'muet'), X)); }); }
console.log('\n2. Convergence : signes pour − signes contre');
[...new Set(D.map(d => d.score))].sort((a, b) => a - b).forEach(v => console.log(ligne('score ' + (v > 0 ? '+' : '') + v, D.filter(d => d.score === v))));
console.log(ligne('score ≥ +3 (au moins trois signes concordants)', D.filter(d => d.score >= 3)));
console.log(ligne('score ≥ +4', D.filter(d => d.score >= 4)));
console.log(ligne('score ≤ 0', D.filter(d => d.score <= 0)));
// corrélation rang du score / nul, et contrôle par mélange
const y = D.map(d => d.nul ? 1 : 0), x = D.map(d => d.score), corr = (a, b) => { const n = a.length, ma = a.reduce((s, v) => s + v) / n, mb = b.reduce((s, v) => s + v) / n; let u = 0, v = 0, w = 0; for (let i = 0; i < n; i++) { u += (a[i] - ma) * (b[i] - mb); v += (a[i] - ma) ** 2; w += (b[i] - mb) ** 2; } return u / Math.sqrt(v * w); };
const c0 = corr(x, y); let g = 0; const NP = 5000; for (let t = 0; t < NP; t++) { const q = y.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } if (corr(x, q) >= c0) g++; }
console.log('\n   lien score / nul : corrélation ' + c0.toFixed(2) + ' ; atteinte avec des résultats mélangés dans ' + (100 * g / NP).toFixed(1) + ' % des cas');
console.log('\n3. Le cas donné en exemple : R1 + R7 = Carcer');
D.filter(d => d.L.lien === 10).forEach(d => console.log('     ' + d.m.join('-').padEnd(12) + d.sc.join('-').padEnd(5) + ' score ' + d.score + ' : ' + Object.entries(d.s).filter(([, v]) => v).map(([k, v]) => k.split(' (')[0] + (v > 0 ? ' +' : ' −')).join(', ')));

console.log('\n4. Thème 12-10-14-5 (nul validé par le propriétaire)');
{ const L = M.lire([12, 10, 14, 5]), s = {}; for (const k in SIGNES) s[k] = SIGNES[k](L); console.log('     score ' + Object.values(s).reduce((a, b) => a + b, 0) + ' : ' + Object.entries(s).map(([k, v]) => k.split(' (')[0] + ' ' + (v > 0 ? '+1' : v < 0 ? '−1' : '0')).join(', ')); }
