// Écart au repos des canaux et des nœuds (2026-11-27). Question du propriétaire : la carte de repos (thème Populus 16-16-16-16) aide-t-elle à
// sécuriser le nul, à renforcer une domination de victoire, ou pour les incidents ?
// La carte de repos est l'étalon : au repos, un front a déjà ses nœuds pleins (A 1, B 3, C 2, D 11) par ses propres niveaux Feu/Air.
// Écart d'un pôle Δ = nœuds pleins de son front dans le thème − nœuds pleins de ce front au repos : ce que les bases ajoutent ou retirent.
// Lectures fixées avant la mesure :
//   V  le pôle au plus grand Δ gagne (comparé aux nœuds pleins bruts, sans étalon, et à « R1 gagne toujours ») ;
//   D  domination et nul selon l'écart |ΔR1 − ΔR7| (0, 1-2, 3 et plus) ;
//   I  incidents : agitation (nœuds des 4 fronts dont l'état diffère du repos) ; nœuds de l'axe rouge (M6, M12) et de l'axe penalty (M5, M11)
//      devenus pleins dans le front d'un pôle alors qu'ils ne le sont pas au repos (M11 ne l'est jamais au repos).
// Développement : les 126 matchs de la recherche ; test : les matchs du 26 novembre. Incidents : les matchs étiquetés (comme mesure_incidents.js).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const dev = new Map(), aj = (t, s, nom) => { const k = t.join('-'); if (!dev.has(k)) dev.set(k, { m: t, sc: s, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match)));
const DEV = [...dev.values()], TEST = lire('validation/resultats-2026-11-26.json').matchs.map(x => ({ m: x.theme, sc: x.score, nom: x.match }));

// carte de repos
const REPOS = M.noeuds(M.lire([16, 16, 16, 16])).fronts, etatRepos = (k, h) => REPOS[k].noeuds.find(x => x.maison === h).etat;
function ecarts(m) { const L = M.lire(m), F = M.noeuds(L).fronts, kf = p => (L[p].figure - 1) % 4, o = { agitation: 0 };
  F.forEach((x, k) => x.noeuds.forEach(n => { if (n.etat !== etatRepos(k, n.maison)) o.agitation++; }));
  for (const p of ['R1', 'R7']) { const k = kf(p), gagnes = F[k].noeuds.filter(n => n.etat === 'plein' && etatRepos(k, n.maison) !== 'plein').map(n => n.maison);
    o[p] = { front: F[k].front, brut: F[k].pleins, delta: F[k].pleins - REPOS[k].pleins, gagnes }; }
  return o; }
const res = d => Math.sign(d.sc[0] - d.sc[1]), pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';

console.log('carte de repos : nœuds pleins A ' + REPOS[0].pleins + ' · B ' + REPOS[1].pleins + ' · C ' + REPOS[2].pleins + ' · D ' + REPOS[3].pleins + '\n');
// V : le plus grand gagne
console.log('V · le pôle au front le plus plein gagne (matchs décidés ; nuls à part)');
for (const [lab, S] of [['développement ' + DEV.length, DEV], ['test 26/11 ' + TEST.length, TEST]]) {
  const ligne = cle => { let ok = 0, faux = 0, nul = 0, sans = 0, r1 = 0; S.forEach(d => { const e = ecarts(d.m), a = e.R1[cle], b = e.R7[cle], r = res(d); if (a === b) { sans++; return; } if (!r) { nul++; return; } const w = a > b ? 1 : -1; if (w === r) ok++; else faux++; if (r > 0) r1++; });
    return ok + ' justes, ' + faux + ' faux (' + pc(ok, ok + faux) + ') · nuls ' + nul + ' · sans appel ' + sans + ' · R1 toujours sur ces appels ' + r1 + '/' + (ok + faux); };
  console.log('  ' + lab.padEnd(18) + 'avec étalon (Δ)    : ' + ligne('delta'));
  console.log('  ' + ''.padEnd(18) + 'sans étalon (brut) : ' + ligne('brut')); }
// D : domination et nul selon l'écart
console.log('\nD · selon l\'écart |ΔR1 − ΔR7| (développement + test)');
const T = {}; [...DEV, ...TEST].forEach(d => { const e = ecarts(d.m), x = Math.abs(e.R1.delta - e.R7.delta), c = x === 0 ? '0' : x <= 2 ? '1-2' : '3+', r = res(d), w = Math.sign(e.R1.delta - e.R7.delta);
  T[c] = T[c] || { n: 0, nul: 0, juste: 0, nette: 0, decides: 0 }; const t = T[c]; t.n++; if (!r) { t.nul++; return; } t.decides++; if (w && w === r) { t.juste++; if (Math.abs(d.sc[0] - d.sc[1]) >= 2) t.nette++; } });
['0', '1-2', '3+'].forEach(c => { const t = T[c] || { n: 0 }; console.log('  écart ' + c.padEnd(4) + ': ' + String(t.n).padStart(3) + ' matchs · nuls ' + t.nul + ' (' + pc(t.nul, t.n) + ')' + (c === '0' ? '' : ' · le plus plein gagne ' + t.juste + '/' + t.decides + ' décidés (' + pc(t.juste, t.decides) + ') · dont par 2 buts ou plus ' + t.nette)); });
const tous = [...DEV, ...TEST], neg = tous.filter(d => { const e = ecarts(d.m); return e.R1.delta <= 0 && e.R7.delta <= 0; });
console.log('  les deux fronts au repos ou en dessous (Δ ≤ 0 des deux côtés) : ' + neg.length + ' matchs · nuls ' + neg.filter(d => !res(d)).length + ' (' + pc(neg.filter(d => !res(d)).length, neg.length) + ') · ensemble : nuls ' + tous.filter(d => !res(d)).length + '/' + tous.length + ' (' + pc(tous.filter(d => !res(d)).length, tous.length) + ')');

// I : incidents
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json', 'validation/resultats-2026-11-26.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const I = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); I.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k) || !th.get(k)) return; I.push({ nom: n, m: th.get(k), pen, rouge }); });
const E = I.map(d => ({ ...d, e: ecarts(d.m) })), ag = E.map(d => d.e.agitation).sort((a, b) => a - b), t1 = ag[Math.floor(ag.length / 3)], t2 = ag[Math.floor(2 * ag.length / 3)];
const taux = (S, k) => S.filter(d => oui(d[k])).length + '/' + S.length + ' (' + pc(S.filter(d => oui(d[k])).length, S.length) + ')';
console.log('\nI · incidents (' + E.length + ' matchs étiquetés ; rouge ' + taux(E, 'rouge') + ', penalty ' + taux(E, 'pen') + ')');
console.log('  agitation (nœuds changés sur 60, tiers : ≤ ' + t1 + ' · ' + (t1 + 1) + '–' + t2 + ' · > ' + t2 + ')');
[['faible', d => d.e.agitation <= t1], ['moyenne', d => d.e.agitation > t1 && d.e.agitation <= t2], ['forte', d => d.e.agitation > t2]].forEach(([n, f]) => { const S = E.filter(f); console.log('    ' + n.padEnd(8) + ': rouge ' + taux(S, 'rouge').padEnd(14) + ' penalty ' + taux(S, 'pen')); });
const axe = (d, hs) => ['R1', 'R7'].filter(p => d.e[p].gagnes.some(h => hs.includes(h)));
for (const [nom, hs, k] of [['axe rouge M6/M12', [6, 12], 'rouge'], ['axe penalty M5/M11', [5, 11], 'pen']]) {
  const oui_ = E.filter(d => axe(d, hs).length), non = E.filter(d => !axe(d, hs).length);
  let camp = 0, n = 0; oui_.forEach(d => { const v = d[k]; if (!oui(v) || /R1 et R7|les deux/.test(v)) return; const P = axe(d, hs); if (P.length !== 1) return; n++; if (v.includes(P[0])) camp++; });
  console.log('  ' + nom.padEnd(20) + 'nœud devenu plein dans le front d\'un pôle : ' + (k === 'rouge' ? 'rouge ' : 'penalty ') + taux(oui_, k) + ' · sinon ' + taux(non, k) + ' · camp (le pôle de ce front) ' + camp + '/' + n); }

// R : l'écart renforce-t-il les verdicts actuels du moteur ?
console.log('\nR · renfort des verdicts du moteur (développement + test)');
const RV = { accord: [0, 0, 0, 0], contre: [0, 0, 0, 0], egal: [0, 0, 0, 0] }, RN = { egaux: [0, 0], differents: [0, 0] };
tous.forEach(d => { const L = M.lire(d.m), v = M.verdict(L).decision.resultat, e = ecarts(d.m), r = res(d), x = Math.sign(e.R1.delta - e.R7.delta);
  if (v === 'N') { const c = x ? 'differents' : 'egaux'; RN[c][1]++; if (!r) RN[c][0]++; return; }
  const w = v === '1' ? 1 : -1, c = !x ? 'egal' : x === w ? 'accord' : 'contre', t = RV[c]; t[3]++; if (!r) t[1]++; else if (r === w) { t[0]++; if (Math.abs(d.sc[0] - d.sc[1]) >= 2) t[2]++; } });
for (const [c, lab] of [['accord', 'Δ du même côté que le moteur'], ['contre', 'Δ contre le moteur'], ['egal', 'Δ égaux']]) { const t = RV[c]; console.log('  victoire annoncée, ' + lab.padEnd(30) + ': ' + t[3] + ' matchs · juste ' + t[0] + ' (' + pc(t[0], t[3]) + ') · par 2 buts+ ' + t[2] + ' · nuls ' + t[1]); }
for (const c of ['egaux', 'differents']) console.log('  égalité annoncée, Δ ' + c.padEnd(25) + ': nuls ' + RN[c][0] + '/' + RN[c][1]);
const PEN = E.filter(d => M.incidentVerdict(M.lire(d.m)).penalty.niveau !== 'faible'), avec = PEN.filter(d => axe(d, [5, 11]).length), sans = PEN.filter(d => !axe(d, [5, 11]).length);
console.log('  penalty possible/probable du moteur : avec nœud M5/M11 devenu plein ' + taux(avec, 'pen') + ' · sans ' + taux(sans, 'pen'));
