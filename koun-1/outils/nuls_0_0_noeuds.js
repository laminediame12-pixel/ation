// Matchs 0-0 : comportement des nœuds des deux camps (demande du propriétaire, 2026-11-28).
// Camps : boucle A/C (maisons impaires) et boucle B/D (maisons paires). Chaque front a 15 nœuds : 8 impairs, 7 pairs (M16 sans nœud).
// Bloqueurs du thème (même règle que le moteur) : maison h dont la base garde ses points actifs (en M16 toujours), ou Populus en base qui rend la figure h ;
// une figure chez elle ne bloque pas. Chaque bloqueur agit sur ses nœuds : ceux que sa maison porte dans la croix de son front, aux niveaux actifs de sa
// résultante (M.zoneBlocage). Il bloque sa victime (figure + 3) là où elle est posée dans ces nœuds.
// Usage : node outils/nuls_0_0_noeuds.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json', 'validation/resultats-2026-11-26.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match)));
const camp = h => h % 2 ? 'A/C' : 'B/D', FR = f => 'ABCD'[(f - 1) % 4];
function lecture(m) { const L = M.lire(m), b = L.theme.bases, bl = [];
  for (let h = 1; h <= 16; h++) { const pop = b[h] === 16, X = pop ? h : b[h];
    if (!pop && (b[h] === h || !K.niveaux(X).every((v, l) => v !== 1 || K.niveaux(h)[l] === 2))) continue;
    const V = mod(X + 3), zone = M.zoneBlocage(L, h), poses = []; for (let x = 1; x <= 16; x++) if (b[x] === V && x !== V && zone.includes(x)) poses.push(x);
    bl.push({ h, X, V, pop, zone, touche: poses }); }
  const noeuds = new Set(); bl.forEach(x => x.zone.forEach(n => noeuds.add(n)));
  const parCamp = S => ({ 'A/C': [...S].filter(h => h % 2).length, 'B/D': [...S].filter(h => h % 2 === 0).length });
  const nd = M.noeuds(L).fronts, carte = p => { const F = nd[(L[p].figure - 1) % 4]; return { 'A/C': F.noeuds.filter(x => x.etat === 'plein' && x.maison % 2).length, 'B/D': F.noeuds.filter(x => x.etat === 'plein' && x.maison % 2 === 0).length }; };
  const pole = p => { const q = M.marquePole(L, p); return { f: L[p].figure, h: L[p].maison, niveau: q.niveau, paralyse: !!(q.bloque && q.bloque.some(x => x.tout)), bloqueurs: M.bloqueurs(L, L[p].figure, L[p].maison), zone: q.zones.pole, carte: carte(p) }; };
  const eff = bl.filter(x => x.touche.length);
  return { L, bl, noeuds: parCamp(noeuds), effectifs: { 'A/C': eff.filter(x => x.touche.some(h => h % 2)).length, 'B/D': eff.filter(x => x.touche.some(h => h % 2 === 0)).length }, R1: pole('R1'), R7: pole('R7') }; }
const D = [...tous.values()].map(d => ({ ...d, X: lecture(d.m), g: d.sc[0] === 0 && d.sc[1] === 0 ? '0-0' : d.sc[0] === d.sc[1] ? 'nul avec buts' : 'victoire' }));
console.log('Matchs 0-0 (' + D.filter(d => d.g === '0-0').length + ' sur ' + D.length + ')\n');
D.filter(d => d.g === '0-0').forEach(d => { const X = d.X, P = p => p + ' ' + N(X[p].f) + ' en M' + X[p].h + ' (front ' + FR(X[p].f) + ', camp ' + camp(X[p].f) + ', maison du camp ' + camp(X[p].h) + ') : ' + X[p].niveau + (X[p].paralyse ? ', paralysé' : '') + (X[p].bloqueurs.length ? ' — bloqueurs ' + X[p].bloqueurs.map(y => N(y.figure) + (y.type === 'populus' ? ' reproduit par Populus' : ' ' + y.type) + ' en M' + y.maison).join(', ') + ' → nœuds M' + X[p].zone.join(', M') : ' — aucun bloqueur');
  console.log(d.nom + ' 0-0 (' + d.m.join('-') + ')');
  console.log('  ' + P('R1')); console.log('  ' + P('R7'));
  X.bl.forEach(x => console.log('    bloqueur ' + (x.pop ? 'Populus en M' + x.h + ' (rend ' + N(x.X) + ')' : N(x.X) + ' intact en M' + x.h) + ' → victime ' + N(x.V) + ' · ' + (x.zone.length ? 'nœuds M' + x.zone.join(', M') : 'aucun nœud (pas de niveau actif hors Terre)') + ' (A/C ' + x.zone.filter(h => h % 2).length + ', B/D ' + x.zone.filter(h => h % 2 === 0).length + ')' + (x.touche.length ? ' · touche ' + N(x.V) + ' en M' + x.touche.join(', M') : '')));
  console.log('  nœuds bloqués du thème : A/C ' + X.noeuds['A/C'] + '/8 · B/D ' + X.noeuds['B/D'] + '/7 · cartes des fronts des pôles, nœuds pleins : R1 A/C ' + X.R1.carte['A/C'] + ' B/D ' + X.R1.carte['B/D'] + ' · R7 A/C ' + X.R7.carte['A/C'] + ' B/D ' + X.R7.carte['B/D'] + '\n'); });
// comparaison des groupes
const moy = a => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1) : '—';
console.log('Comparaison (moyennes)                    0-0     nuls avec buts   victoires');
const ligne = (lab, f) => console.log('  ' + lab.padEnd(40) + ['0-0', 'nul avec buts', 'victoire'].map(g => moy(D.filter(d => d.g === g).map(f)).padEnd(g === '0-0' ? 8 : 17)).join(''));
ligne('bloqueurs dans le thème', d => d.X.bl.length);
ligne('nœuds bloqués camp A/C (sur 8)', d => d.X.noeuds['A/C']); ligne('nœuds bloqués camp B/D (sur 7)', d => d.X.noeuds['B/D']);
ligne('écart entre les deux camps', d => Math.abs(d.X.noeuds['A/C'] - d.X.noeuds['B/D']));
ligne('bloqueurs qui touchent leur victime', d => d.X.bl.filter(x => x.touche.length).length);
ligne('pôles paralysés (0 à 2)', d => (d.X.R1.paralyse ? 1 : 0) + (d.X.R7.paralyse ? 1 : 0));
ligne('pôles qui ne marquent pas (0 à 2)', d => (d.X.R1.niveau === 'non' ? 1 : 0) + (d.X.R7.niveau === 'non' ? 1 : 0));
ligne('pôles avec au moins un bloqueur (0 à 2)', d => (d.X.R1.bloqueurs.length ? 1 : 0) + (d.X.R7.bloqueurs.length ? 1 : 0));
ligne('nœuds pleins, front de R1 (A/C − B/D)', d => d.X.R1.carte['A/C'] - d.X.R1.carte['B/D']);
ligne('nœuds pleins, front de R7 (A/C − B/D)', d => d.X.R7.carte['A/C'] - d.X.R7.carte['B/D']);
console.log('  effectifs : 0-0 ' + D.filter(d => d.g === '0-0').length + ' · nuls avec buts ' + D.filter(d => d.g === 'nul avec buts').length + ' · victoires ' + D.filter(d => d.g === 'victoire').length);
// sur tous les matchs : pôles sans bloqueur, équilibre des camps (part de nœuds bloqués B/D − A/C)
console.log('\nSur les ' + D.length + ' matchs :');
const sansB = d => !d.X.R1.bloqueurs.length && !d.X.R7.bloqueurs.length, part = d => d.X.noeuds['B/D'] / 7 - d.X.noeuds['A/C'] / 8;
const stat = (lab, S) => console.log('  ' + lab.padEnd(52) + S.length + ' matchs · 0-0 ' + S.filter(d => d.g === '0-0').length + ' · nuls ' + S.filter(d => d.g !== 'victoire').length + ' (' + Math.round(100 * S.filter(d => d.g !== 'victoire').length / (S.length || 1)) + ' %)');
stat('aucun pôle n\'a de bloqueur', D.filter(sansB)); stat('au moins un pôle a un bloqueur', D.filter(d => !sansB(d)));
stat('camps équilibrés (écart de part ≤ 0,10)', D.filter(d => Math.abs(part(d)) <= 0.10)); stat('camp A/C plus bloqué (écart > 0,10)', D.filter(d => part(d) < -0.10)); stat('camp B/D plus bloqué (écart > 0,10)', D.filter(d => part(d) > 0.10));
stat('aucun bloqueur et camps équilibrés', D.filter(d => sansB(d) && Math.abs(part(d)) <= 0.10));
const m16 = d => d.X.bl.find(x => x.h === 16 && x.touche.length);
stat('le bloqueur de M16 touche sa victime', D.filter(m16)); stat('il ne la touche pas', D.filter(d => !m16(d)));
