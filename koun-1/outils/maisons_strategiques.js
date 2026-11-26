// Règle du propriétaire (2026-11-26) : une figure g bloque l'énergie de son opposé, la figure dont elle est l'antagoniste (g + 3).
// Sur la cartographie des fronts : dans la branche de la maison h, la base « antagoniste » est h − 3 ; quand elle y est réellement posée, c'est un arrêt (✖).
// 1. Table exacte, pour chaque figure g : maison où elle bloque (g + 3, la maison de la figure qu'elle antagonise), figure qu'elle y bloque,
//    maison où elle est elle-même bloquée (sa maison g, si son antagoniste g − 3 y est posé), maison où elle est chez elle (g, saturée : résultante Populus).
// 2. Vérification sur les matchs : un pôle « nuit » à l'adversaire quand une figure de son front (lui compris) est posée en arrêt dans une maison du front de
//    l'adversaire ; il est « avantagé » quand sa figure est chez elle. On regarde victoire, buts marqués et encaissés.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1, fr = f => 'ABCD'[(f - 1) % 4], front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
console.log('1. MAISONS STRATÉGIQUES DE CHAQUE FIGURE\n');
console.log('   Figure (front)          chez elle (avantage)   bloque en (nuisance)    l\'énergie de            bloquée chez elle par');
for (let g = 1; g <= 16; g++) console.log('   ' + (g + ' ' + N(g) + ' (' + fr(g) + ')').padEnd(24) + ('M' + g).padEnd(23) + ('M' + mod(g + 3) + (mod(g + 3) === 16 ? ' (hors arrêt : M16)' : '')).padEnd(24) + (N(mod(g + 3)) + ' (' + fr(mod(g + 3)) + ')').padEnd(24) + N(mod(g - 3)) + ' (' + fr(mod(g - 3)) + ') en M' + g);
console.log('\n   Par front : A bloque D (Puer bloque Albus en M4, Via Tristitia en M8, Fortuna Minor Fortuna Major en M12, Cauda Populus en M16),');
console.log('   B bloque A, C bloque B, D bloque C — le cycle des attaques. Une figure ne bloque qu\'une seule maison : celle de la figure qui la suit de 3.\n');
// 2. matchs
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, 'aveugle')));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), b = L.theme.bases, arr = []; for (let h = 1; h <= 15; h++) if (b[h] === mod(h - 3)) arr.push(h); return { ...d, L, b, arr }; });
const autre = p => p === 'R1' ? 'R7' : 'R1';
const LECT = {
  'une figure de son front fait un arrêt dans le front de l\'adversaire (nuire)': (d, p) => d.arr.filter(h => front(d.L[p].figure).includes(d.b[h]) && front(d.L[autre(p)].figure).includes(h)).length,
  'sa propre figure fait un arrêt (n\'importe où)': (d, p) => d.arr.filter(h => d.b[h] === d.L[p].figure).length,
  'sa propre figure bloque la maison de la figure adverse (M = figure adverse)': (d, p) => d.arr.filter(h => d.b[h] === d.L[p].figure && h === d.L[autre(p)].figure).length,
  'une maison de son front est bloquée par un arrêt (subir)': (d, p) => d.arr.filter(h => front(d.L[p].figure).includes(h)).length,
  'sa figure est chez elle (avantage)': (d, p) => d.b[d.L[p].figure] === d.L[p].figure ? 1 : 0,
};
const pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
console.log('2. SUR LES MATCHS (' + D.length + ' matchs) — le pôle concerné : victoires / nuls / défaites, buts marqués / encaissés en moyenne');
for (const [k, f] of Object.entries(LECT)) { console.log('   ' + k);
  for (const [nom, cond] of [['oui', v => v > 0], ['non', v => v === 0]]) { let w = 0, n = 0, l = 0, gm = 0, ge = 0, c = 0, av = [0, 0];
    D.forEach(d => ['R1', 'R7'].forEach((p, i) => { if (!cond(f(d, p))) return; c++; const a = d.sc[i], b = d.sc[1 - i]; gm += a; ge += b; if (a > b) w++; else if (a < b) l++; else n++; if (d.lot === 'aveugle') { av[1]++; if (a > b) av[0]++; } }));
    console.log('      ' + nom.padEnd(4) + ('n ' + c).padEnd(6) + ' gagne ' + w + ' · nul ' + n + ' · perd ' + l + ' (victoire ' + pc(w, w + l) + ' des matchs décidés) · marque ' + (gm / (c || 1)).toFixed(2) + ' · encaisse ' + (ge / (c || 1)).toFixed(2) + '   | aveugle : gagne ' + av[0] + '/' + av[1]); } }
