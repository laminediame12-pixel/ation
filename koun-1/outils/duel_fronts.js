// Le duel des fronts (modèle du propriétaire, 2026-11-28) : chaque camp a des attaquants (son front) et des défenseurs (binômes). Les attaquants marquent par
// les niveaux d'activation (un point + un point = deux points saturés ; saturation de la Terre → buts, sinon une maison de Terre) ; le défenseur bloque les
// attaquants adverses en bloquant leurs canaux (nœuds) ; blocage total par Populus en base (la figure de repos de la maison bloque son adversaire) ; Populus en
// résultante transmet le flux. Le moteur fait déjà : blocage (antagoniste intact ou reproduit par Populus, nœuds du bloqueur), Populus en résultante non bloquable,
// marquage par réaction (1 + 1) dans les maisons des canaux Terre (M4, M8, M12, M13, M14, M15), pour le pôle, son front direct et son miroir.
// Écarts mesurés ici : (1) saturation de la Terre (Terre active de la figure sur Terre active de la maison) dans n'importe quelle maison ; (2) tout le front (f + 12 aussi).
// On ne juge que sur les matchs joués. Usage : node outils/duel_fronts.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jv')));
const TERRE = [4, 8, 12, 13, 14, 15], imp = f => K.niveaux(f).map(v => v === 1 ? 1 : 0);
// positions qui marquent pour un attaquant g : réaction dans une maison de Terre (règle du moteur) et/ou saturation de la Terre ailleurs
function positions(L, g, regle) { const b = L.theme.bases, out = [];
  for (let h = 1; h <= 16; h++) { if (b[h] !== g) continue; const rg = imp(g), rh = imp(h), reagit = [0, 1, 2, 3].some(l => rg[l] && rh[l]), terre = rg[3] && rh[3];
    if (g === 16 ? (TERRE.includes(h) && K.niveaux(h === 16 ? b[16] : L.theme.resultantes[h])[3] === 2) : (TERRE.includes(h) && reagit) || (regle.terrePartout && terre)) out.push(h); } return out; }
// zones de blocage des bloqueurs d'une figure (comme le moteur : chaque bloqueur n'agit que sur ses nœuds)
const zones = (L, g, ici) => [...new Set(M.bloqueurs(L, g, ici).flatMap(x => M.zoneBlocage(L, x.maison)))];
function marque(L, p, regle) { const P = L[p].figure, ZP = zones(L, P, L[p].maison);
  if (ZP.includes(L[p].maison)) return false; // pôle atteint dans sa maison : il n'attaque plus
  const atk = [P, mod(P + 4), mod(P + 8)].concat(regle.toutLeFront ? [mod(P + 12)] : []);
  return atk.some(g => { const Z = zones(L, g, L.theme.bases[g] === g ? g : undefined).concat(ZP); return positions(L, g, regle).some(h => h === g || !Z.includes(h)); }); }
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m) }));
const pol = D.flatMap(d => ['R1', 'R7'].map((p, i) => ({ d, p, i, a: d.sc[i] > 0 })));
const n = (S, f) => S.filter(f).length, pc = (a, b) => b ? Math.round(100 * a / b) + ' %' : '—';
const juge = (lab, f) => { const P = pol.map(x => ({ ...x, q: f(x) })), J = P.filter(x => x.d.lot === 'jv'), oui = P.filter(x => x.q), non = P.filter(x => !x.q);
  console.log('  ' + lab.padEnd(70) + ' justes ' + n(P, x => x.q === x.a) + '/' + P.length + ' · « marque » ' + n(oui, x => x.a) + '/' + oui.length + ' (' + pc(n(oui, x => x.a), oui.length) + ') · « ne marque pas » ' + n(non, x => !x.a) + '/' + non.length + ' · jamais vus ' + n(J, x => x.q === x.a) + '/' + J.length); };
console.log('Marquage des 322 pôles (2 par match, 161 matchs ; 245 ont marqué) :');
juge('règle actuelle du moteur (sa propre règle, sans l\'imposition de la victoire)', x => M.marquePole(x.d.L, x.p).marque);
juge('reconstruite ici (canaux Terre, réaction 1 + 1)', x => marque(x.d.L, x.p, {}));
juge('(1) + saturation de la Terre dans n\'importe quelle maison', x => marque(x.d.L, x.p, { terrePartout: true }));
juge('(2) + tout le front (f + 12)', x => marque(x.d.L, x.p, { toutLeFront: true }));
juge('(1) + (2)', x => marque(x.d.L, x.p, { terrePartout: true, toutLeFront: true }));
juge('repère : « tout le monde marque »', x => true);
// Le duel décide-t-il du vainqueur ? Force d'attaque d'un pôle : positions qui marquent de son front, non bloquées (règles (1) + (2)).
function force(L, p) { const P = L[p].figure, ZP = zones(L, P, L[p].maison); if (ZP.includes(L[p].maison)) return 0;
  return [P, mod(P + 4), mod(P + 8), mod(P + 12)].reduce((s, g) => { const Z = zones(L, g, L.theme.bases[g] === g ? g : undefined).concat(ZP); return s + positions(L, g, { terrePartout: true }).filter(h => h === g || !Z.includes(h)).length; }, 0); }
console.log('\nLe duel et le vainqueur (161 matchs ; un pôle pris au hasard gagne 38 %) :');
const DU = D.map(d => ({ d, f1: force(d.L, 'R1'), f7: force(d.L, 'R7'), r: d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'nul' }));
const ch = x => x.f1 > x.f7 ? 'R1' : x.f7 > x.f1 ? 'R7' : null, S = DU.filter(ch), J = S.filter(x => x.d.lot === 'jv');
console.log('  le pôle à la plus grande force d\'attaque gagne ' + n(S, x => x.r === ch(x)) + '/' + S.length + ' (' + pc(n(S, x => x.r === ch(x)), S.length) + '), ne perd pas ' + n(S, x => x.r === ch(x) || x.r === 'nul') + ' · jamais vus ' + n(J, x => x.r === ch(x)) + '/' + J.length);
[[0, 0, 'l\'un des deux à 0, l\'autre attaque']].forEach(() => { const Z = DU.filter(x => (x.f1 === 0) !== (x.f7 === 0)), c = x => x.f1 > 0 ? 'R1' : 'R7'; console.log('  un seul pôle a une attaque qui passe : il gagne ' + n(Z, x => x.r === c(x)) + '/' + Z.length + ' (' + pc(n(Z, x => x.r === c(x)), Z.length) + '), ne perd pas ' + n(Z, x => x.r === c(x) || x.r === 'nul')); });
const G = DU.filter(x => Math.abs(x.f1 - x.f7) >= 2); console.log('  écart de force d\'au moins 2 : le plus fort gagne ' + n(G, x => x.r === ch(x)) + '/' + G.length + ' (' + pc(n(G, x => x.r === ch(x)), G.length) + ')');
// Blocage total : attaque nulle, ou figure du pôle bloquée par Populus dans sa maison (la figure de repos de la maison bloque son adversaire)
console.log('\nBlocage total (le pôle marque-t-il quand même ?) :');
const PO = D.flatMap(d => ['R1', 'R7'].map((p, i) => { const L = d.L, bl = M.bloqueurs(L, L[p].figure, L[p].maison), popTotal = bl.some(x => x.type === 'populus' && M.zoneBlocage(L, x.maison).includes(L[p].maison));
  return { d, i, a: d.sc[i] > 0, f: force(L, p), pop: bl.some(x => x.type === 'populus'), popTotal }; }));
const tp = (lab, S) => console.log('  ' + lab.padEnd(64) + String(S.length).padStart(4) + ' pôles · ont marqué ' + n(S, x => x.a) + ' (' + pc(n(S, x => x.a), S.length) + ') · jamais vus ' + n(S.filter(x => x.d.lot === 'jv'), x => x.a) + '/' + S.filter(x => x.d.lot === 'jv').length);
tp('force d\'attaque nulle (rien ne passe)', PO.filter(x => x.f === 0)); tp('force 1', PO.filter(x => x.f === 1)); tp('force 2 ou plus', PO.filter(x => x.f >= 2));
tp('figure du pôle bloquée par un Populus (quelque part)', PO.filter(x => x.pop)); tp('… et sa maison est dans les nœuds bloqués (blocage total)', PO.filter(x => x.popTotal));
