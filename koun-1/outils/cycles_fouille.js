// Fouille des cycles de la chaîne des vérifications (demande du propriétaire, 2026-11-28 : « cycle de 2 ou 4, fouille encore là-dessus »).
// Chaîne : vérification de la vérification… (mères M1, M4, M7, M10) ; elle garde la première mère, donc les maisons des pôles, et finit sur un point fixe,
// un cycle de 2 ou un cycle de 4. Pour chaque match joué : longueur du cycle, nombre de pas avant d'y entrer, et pour chaque thème du cycle son verdict
// (sans vérification), le marquage de chaque pôle (sa règle) et la figure de chaque pôle. Lu par rapport au vainqueur annoncé par le principal.
// On ne juge que sur les matchs joués ; le hasard est mesuré en mélangeant les issues entre victoires annoncées. Usage : node outils/cycles_fouille.js [TIRAGES=200]
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom;
const TIRAGES = +(process.argv[2] || 200), lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jv')));
const T4 = x => { const b = K.construire(x).bases; return [b[1], b[4], b[7], b[10]]; };
function chaine(m) { const vu = {}, seq = []; let y = m; while (!vu[y.join('-')]) { vu[y.join('-')] = seq.length + 1; seq.push(y); y = T4(y); }
  const s = vu[y.join('-')] - 1; return { queue: s, lg: seq.length - s, cycle: seq.slice(s) }; }
const D = [...tous.values()].map(d => { const L = M.lire(d.m), V = M.verdict(L), v = V.decision.resultat, C = chaine(L.theme.meres);
  const th = C.cycle.map(y => { const Ly = M.lire(y); return { r: M.verdict(Ly, true).decision.resultat, m1: M.marquePole(Ly, 'R1').marque, m7: M.marquePole(Ly, 'R7').marque, f1: Ly.R1.figure, f7: Ly.R7.figure }; });
  return { ...d, L, v, C, th, conf: !!V.decision.confirmee, r: d.sc[0] > d.sc[1] ? '1' : d.sc[0] < d.sc[1] ? '2' : 'N' }; });
const n = (S, f) => S.filter(f).length, pc = (a, b) => b ? Math.round(100 * a / b) + ' %' : '—';
console.log(D.length + ' matchs · point fixe ' + n(D, d => d.C.lg === 1) + ' · cycle de 2 ' + n(D, d => d.C.lg === 2) + ' · cycle de 4 ' + n(D, d => d.C.lg === 4)
  + ' · le principal est lui-même dans le cycle : ' + n(D, d => d.C.queue === 0));
// propriétés d'une victoire annoncée, lues dans le cycle (w : vainqueur annoncé, l : perdant annoncé)
const VA = D.filter(d => d.v !== 'N').map(d => { const w = d.v, l = w === '1' ? '2' : '1', pw = w === '1' ? 'R1' : 'R7', fw = d.L[pw].figure, lg = d.C.lg, t = d.th;
  const kw = t.filter(x => x.r === w).length, kl = t.filter(x => x.r === l).length, mw = t.filter(x => w === '1' ? x.m1 : x.m7).length, ml = t.filter(x => w === '1' ? x.m7 : x.m1).length;
  const garde = t.filter(x => (w === '1' ? x.f1 : x.f7) === fw).length, frontG = t.filter(x => ((w === '1' ? x.f1 : x.f7) - 1) % 4 === (fw - 1) % 4).length;
  const f = {}; f['cycle de ' + lg] = true; f['queue ' + Math.min(d.C.queue, 3) + (d.C.queue >= 3 ? ' ou plus' : '')] = true;
  if (lg > 1) { f['cycle : tous ses thèmes annoncent le vainqueur'] = kw === lg; f['cycle : aucun n\'annonce le perdant'] = kl === 0; f['cycle : la majorité annonce le vainqueur'] = kw > lg / 2;
    f['cycle : le thème d\'entrée annonce le vainqueur'] = t[0].r === w; f['cycle : le thème d\'entrée annonce le perdant'] = t[0].r === l;
    f['cycle : le vainqueur marque dans tous ses thèmes'] = mw === lg; f['cycle : le perdant ne marque dans aucun'] = ml === 0; f['cycle : le perdant marque dans tous'] = ml === lg;
    f['cycle : le vainqueur marque dans plus de thèmes que le perdant'] = mw > ml; f['cycle : le perdant marque dans plus de thèmes'] = ml > mw;
    f['cycle : la figure du vainqueur revient dans tous ses thèmes'] = garde === lg; f['cycle : elle n\'y revient jamais'] = garde === 0; f['cycle : son front revient dans tous'] = frontG === lg; }
  return { d, f, gagne: d.r === w, nePerdPas: d.r === w || d.r === 'N' }; });
const NOMS = [...new Set(VA.flatMap(x => Object.keys(x.f).filter(k => x.f[k])))].sort();
const lignes = NOMS.map(nm => { const S = VA.filter(x => x.f[nm]), J = S.filter(x => x.d.lot === 'jv'); return { nm, n: S.length, g: n(S, x => x.gagne), np: n(S, x => x.nePerdPas), jn: J.length, jg: n(J, x => x.gagne) }; });
const base = n(VA, x => x.gagne) / VA.length;
// hasard : écart maximal à la base parmi les lectures (au moins 10 cas), issues mélangées entre victoires annoncées
const ecart = get => Math.max(...NOMS.map(nm => { const S = VA.filter(x => x.f[nm]); return S.length >= 10 ? Math.abs(n(S, get) / S.length - base) * Math.sqrt(S.length) : 0; }));
const vraiE = ecart(x => x.gagne), H = []; for (let i = 0; i < TIRAGES; i++) { const sh = VA.map(x => x.gagne).sort(() => Math.random() - 0.5); VA.forEach((x, j) => { x.g2 = sh[j]; }); H.push(ecart(x => x.g2)); }
console.log('Victoires annoncées : ' + VA.length + ', le vainqueur annoncé gagne ' + n(VA, x => x.gagne) + ' (' + pc(n(VA, x => x.gagne), VA.length) + ')');
console.log('Plus grand écart à cette base parmi ' + NOMS.length + ' lectures : le hasard fait aussi fort dans ' + H.filter(h => h >= vraiE).length + ' tirages sur ' + TIRAGES + '\n');
lignes.sort((a, b) => b.g / b.n - a.g / a.n).forEach(x => console.log('  ' + x.nm.padEnd(64) + String(x.n).padStart(4) + ' · gagne ' + x.g + ' (' + pc(x.g, x.n) + ') · ne perd pas ' + x.np + ' (' + pc(x.np, x.n) + ') · jamais vus ' + x.jg + '/' + x.jn));
// égalités annoncées et nuls, selon le cycle
console.log('\nNuls selon le cycle (tous les matchs) :');
[1, 2, 4].forEach(lg => { const S = D.filter(d => d.C.lg === lg); console.log('  ' + ('cycle de ' + lg).padEnd(20) + S.length + ' matchs · nuls ' + n(S, d => d.r === 'N') + ' (' + pc(n(S, d => d.r === 'N'), S.length) + ')'); });
[2, 4].forEach(lg => [0, 1, 2, 3, 4].filter(k => k <= lg).forEach(k => { const S = D.filter(d => d.C.lg === lg && d.th.filter(x => x.r === 'N').length === k); if (S.length) console.log('  cycle de ' + lg + ', ' + k + ' thème' + (k > 1 ? 's' : '') + ' en égalité'.padEnd(10) + S.length + ' matchs · nuls ' + n(S, d => d.r === 'N') + ' (' + pc(n(S, d => d.r === 'N'), S.length) + ')'); }));
// « aucun thème du cycle n'annonce le perdant », selon la longueur du cycle, et recoupement avec la victoire confirmée affichée (cycle de 2, les deux thèmes d'accord)
console.log('\nAucun thème du cycle n\'annonce le perdant, selon le cycle :');
const tvv = (lab, S) => { const J = S.filter(x => x.d.lot === 'jv'); console.log('  ' + lab.padEnd(64) + String(S.length).padStart(4) + ' · gagne ' + n(S, x => x.gagne) + ' (' + pc(n(S, x => x.gagne), S.length) + ') · ne perd pas ' + n(S, x => x.nePerdPas) + ' · jamais vus ' + n(J, x => x.gagne) + '/' + J.length); };
const aucun = x => x.f['cycle : aucun n\'annonce le perdant'];
tvv('cycle de 2', VA.filter(x => aucun(x) && x.d.C.lg === 2)); tvv('cycle de 4', VA.filter(x => aucun(x) && x.d.C.lg === 4));
tvv('cycle de 4, au moins un thème annonce le perdant', VA.filter(x => !aucun(x) && x.d.C.lg === 4)); tvv('cycle de 2, au moins un thème annonce le perdant', VA.filter(x => !aucun(x) && x.d.C.lg === 2));
tvv('déjà « victoire confirmée » (affichée)', VA.filter(x => x.d.conf)); tvv('aucun n\'annonce le perdant, pas encore confirmée', VA.filter(x => aucun(x) && !x.d.conf));
tvv('toutes les autres victoires annoncées', VA.filter(x => !aucun(x)));
