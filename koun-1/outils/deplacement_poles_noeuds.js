// Déplacement de R1 et R7 sur la carte des canaux et des nœuds (2026-11-27, demande du propriétaire : « vérifiez avec le déplacement de R1 et R7 »).
// Au repos, la figure f est chez elle (maison f) ; le pôle est déplacé dans sa maison h (R1 = maison de la figure de M1, R7 = R1 + 6).
// Une figure déplacée inverse les canaux de la maison sur ses niveaux actifs (résultante f + h au lieu de h) et coupe ou crée les liaisons de cette
// maison avec son miroir. La maison h appartient à la croix d'un seul front (haut 1-4, droite 5-8, bas 9-12, gauche 13-16) : le pôle ne change
// que la carte de ce front. R1 et R7 atterrissent toujours dans les deux fronts d'une même boucle (h et h + 6 : A/C ou B/D).
// Deux mesures de l'effet du pôle sur les nœuds pleins du front où il atterrit :
//   repos    : carte de repos, seules les maisons de R1 et R7 reçoivent leur pôle (effet propre du déplacement, ne dépend que de f et h) ;
//   contexte : thème réel, comparé au même thème où la maison du pôle est remise au repos.
// Lectures fixées avant la mesure :
//   V1 le pôle dont le déplacement remplit le plus de nœuds (repos) gagne ; V2 idem en contexte ;
//   V3 le pôle qui atterrit dans le front de la figure adverse (il y inverse les canaux) gagne, si l'autre ne le fait pas ;
//   N  nul quand les deux déplacements ont le même effet (repos, contexte) ou la même classe (propre, allié, ennemi) ;
//   I  rouge quand un déplacement change le nœud M6 ou M12 (axe rouge du dragon), penalty quand il change M5 ou M11 (axe penalty) — camp mesuré.
// Ajouts après la première mesure (seule la lecture N « même effet en contexte » sortait du lot) : la pente selon l'écart entre les deux effets,
// le contrôle par mélange, le détail par mode (même front, même boucle, boucles différentes) et le recoupement avec le verdict du moteur.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const dev = new Map(), aj = (t, s, nom) => { const k = t.join('-'); if (!dev.has(k)) dev.set(k, { m: t, sc: s, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match)));
const DEV = [...dev.values()], TEST = lire('validation/resultats-2026-11-26.json').matchs.map(x => ({ m: x.theme, sc: x.score, nom: x.match })), TOUS = [...DEV, ...TEST];

const fr = n => (n - 1) % 4, POS = h => ['haut', 'droite', 'bas', 'gauche'][Math.floor((h - 1) / 4)];
const CLASSE = (f, h) => ['propre', 'ennemi +1', 'allié', 'ennemi −1'][((fr(f) - fr(h)) % 4 + 4) % 4];
// carte d'un thème fictif : bases données, résultante = base + maison (M16 : la base elle-même)
const faux = b => ({ theme: { bases: b }, resu: h => h === 16 ? b[16] : K.additionner(b[h], h) });
const carte = Lx => { const F = M.noeuds(Lx).fronts, o = {}; F.forEach((x, k) => x.noeuds.forEach(n => { o[k + ':' + n.maison] = n.etat; })); return { F, o }; };
const REPOS = carte(faux(Array(17).fill(16)));
function deplacement(m) { const L = M.lire(m), o = {};
  for (const p of ['R1', 'R7']) { const f = L[p].figure, h = L[p].maison, k = fr(h);
    // repos : seul ce pôle est posé
    const b = Array(17).fill(16); b[h] = f; const C = carte(faux(b));
    // contexte : thème réel contre thème réel avec la maison du pôle remise au repos (résultante = figure de la maison)
    const Lr = { theme: L.theme, resu: L.resu }, Lz = { theme: { bases: L.theme.bases.map((x, i) => i === h ? 16 : x) }, resu: i => i === h ? (h === 16 ? 16 : h) : L.resu(i) };
    const Cr = carte(Lr), Cz = carte(Lz);
    const chg = (A, B) => A.F[k].noeuds.filter(n => B.o[k + ':' + n.maison] !== n.etat).map(n => n.maison);
    o[p] = { f, h, front: 'ABCD'[k], pos: POS(h), classe: CLASSE(f, h), adverse: false,
      repos: C.F[k].pleins - REPOS.F[k].pleins, contexte: Cr.F[k].pleins - Cz.F[k].pleins, changesRepos: chg(C, REPOS), changesCtx: chg(Cr, Cz) }; }
  o.R1.adverse = fr(o.R1.h) === fr(o.R7.f); o.R7.adverse = fr(o.R7.h) === fr(o.R1.f);
  return o; }
const res = d => Math.sign(d.sc[0] - d.sc[1]), pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
TOUS.forEach(d => { d.D = deplacement(d.m); });

// 0. Répartition
const rep = {}; TOUS.forEach(d => ['R1', 'R7'].forEach(p => { const c = d.D[p].classe; rep[p + ' ' + c] = (rep[p + ' ' + c] || 0) + 1; }));
console.log(TOUS.length + ' matchs (' + DEV.length + ' de développement, ' + TEST.length + ' du 26 novembre)');
console.log('classe du déplacement (front de la figure / front de la maison) : ' + Object.keys(rep).sort().map(k => k + ' ' + rep[k]).join(' · '));
const ex = TOUS.find(d => /Nice.Lorient/.test(d.nom)) || TOUS[0]; console.log('exemple ' + ex.nom + ' (' + ex.m.join('-') + ') : ' + ['R1', 'R7'].map(p => { const x = ex.D[p]; return p + ' ' + N(x.f) + ' en M' + x.h + ' (' + x.pos + ' du front ' + x.front + ', ' + x.classe + ') nœuds changés au repos ' + (x.changesRepos.map(h => 'M' + h).join(' ') || 'aucun') + ', pleins ' + (x.repos >= 0 ? '+' : '') + x.repos; }).join(' | ') + '\n');

// V. Victoire
const appel = { V1: d => Math.sign(d.D.R1.repos - d.D.R7.repos), V2: d => Math.sign(d.D.R1.contexte - d.D.R7.contexte), V3: d => d.D.R1.adverse === d.D.R7.adverse ? 0 : d.D.R1.adverse ? 1 : -1 };
const juge = (S, a, r = res) => { let ok = 0, ko = 0, nul = 0, sans = 0, r1 = 0; S.forEach(d => { const w = a(d), x = r(d); if (!w) { sans++; return; } if (!x) { nul++; return; } if (w === x) ok++; else ko++; if (x > 0) r1++; }); return { ok, ko, nul, sans, r1 }; };
const txt = o => (o.ok + ' justes, ' + o.ko + ' faux (' + pc(o.ok, o.ok + o.ko) + ')').padEnd(26) + ('nuls ' + o.nul + ' · sans appel ' + o.sans).padEnd(24) + 'R1 toujours ' + o.r1 + '/' + (o.ok + o.ko);
console.log('V · victoire');
for (const [k, lab] of [['V1', 'déplacement qui remplit le plus (repos)'], ['V2', 'déplacement qui remplit le plus (contexte)'], ['V3', 'atterrit dans le front adverse']]) {
  console.log('  ' + k + ' ' + lab.padEnd(44) + 'dév. ' + txt(juge(DEV, appel[k])) + '   | test ' + txt(juge(TEST, appel[k]))); }
// hasard : meilleure des 3 lectures sur des résultats mélangés (développement)
const obs = Math.max(...Object.values(appel).map(a => { const o = juge(DEV, a); return Math.max(o.ok, o.ko) / ((o.ok + o.ko) || 1); }));
let atteint = 0; const RS = DEV.map(res); for (let t = 0; t < 2000; t++) { const s = RS.slice().sort(() => Math.random() - 0.5), mp = new Map(DEV.map((d, i) => [d, s[i]]));
  const best = Math.max(...Object.values(appel).map(a => { const o = juge(DEV, a, d => mp.get(d)); return Math.max(o.ok, o.ko) / ((o.ok + o.ko) || 1); })); if (best >= obs - 1e-9) atteint++; }
console.log('  la meilleure des 3 lectures (dans un sens ou l\'autre) : ' + Math.round(100 * obs) + ' % ; atteinte par hasard dans ' + Math.round(100 * atteint / 2000) + ' % des mélanges');

// N. Nul
console.log('\nN · nul (tous les matchs ; ensemble ' + TOUS.filter(d => !res(d)).length + '/' + TOUS.length + ' = ' + pc(TOUS.filter(d => !res(d)).length, TOUS.length) + ')');
for (const [lab, f] of [['même effet au repos', d => d.D.R1.repos === d.D.R7.repos], ['même effet en contexte', d => d.D.R1.contexte === d.D.R7.contexte], ['même classe de déplacement', d => d.D.R1.classe === d.D.R7.classe], ['les deux dans le front adverse ou aucun', d => d.D.R1.adverse === d.D.R7.adverse]]) {
  const o = TOUS.filter(f), n = TOUS.filter(d => !f(d)); console.log('  ' + lab.padEnd(40) + 'nuls ' + o.filter(d => !res(d)).length + '/' + o.length + ' (' + pc(o.filter(d => !res(d)).length, o.length) + ') · sinon ' + n.filter(d => !res(d)).length + '/' + n.length + ' (' + pc(n.filter(d => !res(d)).length, n.length) + ')'); }

const gap = d => Math.min(3, Math.abs(d.D.R1.contexte - d.D.R7.contexte)), parGap = S => { const U = [[0, 0], [0, 0], [0, 0], [0, 0]]; S.forEach(d => { const u = U[gap(d)]; u[1]++; if (!res(d)) u[0]++; }); return U.map((u, k) => (k === 3 ? '3+' : k) + ' : ' + u[0] + '/' + u[1] + ' (' + pc(u[0], u[1]) + ')').join(' · '); };
console.log('  écart entre les effets des deux déplacements (contexte) : tous ' + parGap(TOUS));
console.log('    développement ' + parGap(DEV) + '   | test ' + parGap(TEST));
console.log('    sans pôle Populus ' + parGap(TOUS.filter(d => d.D.R1.f !== 16 && d.D.R7.f !== 16)));
['MEME_FRONT', 'MEME_BOUCLE', 'BOUCLES_DIFFERENTES'].forEach(mo => { const S = TOUS.filter(d => M.lire(d.m).mode === mo); console.log('    ' + mo.toLowerCase().replace('_', ' ').padEnd(20) + S.length + ' matchs : ' + parGap(S)); });
{ const lect = [d => d.D.R1.repos === d.D.R7.repos, d => d.D.R1.contexte === d.D.R7.contexte, d => d.D.R1.classe === d.D.R7.classe, d => d.D.R1.adverse === d.D.R7.adverse], N0 = TOUS.map(d => !res(d)), G = TOUS.map(gap);
  const best = nul => Math.max(...lect.map(f => { let a = 0, n = 0, b = 0, m = 0; TOUS.forEach((d, i) => { if (f(d)) { n++; if (nul[i]) a++; } else { m++; if (nul[i]) b++; } }); return Math.abs(a / n - b / m); }));
  const somme = nul => G.reduce((s, x, i) => s + (nul[i] ? x : 0), 0), o1 = best(N0), o2 = somme(N0); let c1 = 0, c2 = 0;
  for (let t = 0; t < 5000; t++) { const s = N0.slice().sort(() => Math.random() - 0.5); if (best(s) >= o1 - 1e-9) c1++; if (somme(s) <= o2) c2++; }
  console.log('  hasard : la meilleure des 4 lectures du nul est atteinte dans ' + (100 * c1 / 5000).toFixed(1) + ' % des mélanges ; la pente de l\'écart dans ' + (100 * c2 / 5000).toFixed(1) + ' %'); }
// renfort du verdict du moteur selon l'écart
{ const T = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], Q = [[0, 0], [0, 0], [0, 0], [0, 0]];
  TOUS.forEach(d => { const v = M.verdict(M.lire(d.m)).decision.resultat, r = res(d), k = gap(d); if (v === 'N') { Q[k][1]++; if (!r) Q[k][0]++; return; } const w = v === '1' ? 1 : -1, t = T[k]; t[3]++; if (!r) t[1]++; else if (r === w) { t[0]++; if (Math.abs(d.sc[0] - d.sc[1]) >= 2) t[2]++; } });
  console.log('  victoire annoncée par le moteur, selon l\'écart : ' + T.map((t, k) => (k === 3 ? '3+' : k) + ' → ' + t[3] + ' matchs, juste ' + t[0] + ' (' + pc(t[0], t[3]) + '), nuls ' + t[1] + ', par 2 buts+ ' + t[2]).join(' · '));
  console.log('  égalité annoncée par le moteur, selon l\'écart : ' + Q.map((q, k) => (k === 3 ? '3+' : k) + ' → nuls ' + q[0] + '/' + q[1]).join(' · ')); }

// I. Incidents
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json', 'validation/resultats-2026-11-26.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const I = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); I.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k) || !th.get(k)) return; I.push({ nom: n, m: th.get(k), pen, rouge }); });
I.forEach(d => { d.D = deplacement(d.m); });
const taux = (S, k) => S.filter(d => oui(d[k])).length + '/' + S.length + ' (' + pc(S.filter(d => oui(d[k])).length, S.length) + ')';
console.log('\nI · incidents (' + I.length + ' matchs étiquetés ; rouge ' + taux(I, 'rouge') + ', penalty ' + taux(I, 'pen') + ')');
for (const [nom, hs, k] of [['axe rouge M6/M12', [6, 12], 'rouge'], ['axe penalty M5/M11', [5, 11], 'pen']]) for (const mes of ['changesRepos', 'changesCtx']) {
  const qui = d => ['R1', 'R7'].filter(p => d.D[p][mes].some(h => hs.includes(h))), A = I.filter(d => qui(d).length), B = I.filter(d => !qui(d).length);
  let soi = 0, autre = 0; A.forEach(d => { const v = d[k], P = qui(d); if (!oui(v) || /R1 et R7|les deux/.test(v) || P.length !== 1) return; if (v.includes(P[0])) soi++; else autre++; });
  console.log('  ' + nom.padEnd(19) + (mes === 'changesRepos' ? 'repos   ' : 'contexte') + ' : un déplacement change ce nœud → ' + (k === 'rouge' ? 'rouge ' : 'penalty ') + taux(A, k).padEnd(14) + ' sinon ' + taux(B, k).padEnd(14) + ' camp : contre le pôle déplacé ' + soi + ', contre l\'autre ' + autre); }
