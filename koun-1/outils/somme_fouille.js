// Fouille d'un thème dérivé : le thème somme (demande du propriétaire, 2026-11-28 : « fouille » — la piste du vainqueur par les blocages du thème somme), ou le thème
// de vérification (« reviens sur la vérification »). Les deux sont calculés par le moteur (M.themeSomme, M.themeVerification). On ne juge que sur les matchs joués.
// Pour chaque match joué : lectures du thème somme (blocages des figures des pôles du principal et de leurs fronts directs / miroirs, Populus en base et leurs maisons,
// figure posée par le thème somme dans la maison de chaque pôle, pôles du thème somme et leur relation aux pôles du principal, verdict et marquage du thème somme),
// croisées avec l'issue du match (vainqueur, nul) et avec la justesse du verdict principal. Règles fortes (au moins 80 % ou au plus 20 %, au moins MIN cas) cherchées
// sur les 126 premiers matchs, comparées à ce que donne le hasard (issues mélangées), puis jugées sur les 35 matchs jamais vus (26, 27, 28 novembre).
// Usage : node outils/somme_fouille.js [somme|verification] [MIN=12] [TIRAGES=50]
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const GENRE = process.argv[2] === 'verification' ? 'verification' : 'somme', A0 = ['somme', 'verification'].includes(process.argv[2]) ? 3 : 2, NOM = GENRE === 'verification' ? 'thème de vérification' : 'thème somme';
const derive = L => M.lire(GENRE === 'verification' ? M.themeVerification(L).meres : M.themeSomme(L).meres);
const MIN = +(process.argv[A0] || 12), TIRAGES = +(process.argv[A0 + 1] || 50), lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jv')));
const D = [...tous.values()];
const REL = (f, g) => g === f ? 'même figure' : g === 16 ? 'Populus' : g === mod(f - 3) ? 'antagoniste' : g === mod(f + 3) ? 'victime' : g === mod(f - 6) ? 'protecteur' : g === mod(f + 4) ? 'front direct' : g === mod(f + 8) ? 'miroir' : (g - 1) % 4 === (f - 1) % 4 ? 'même front' : g % 2 === f % 2 ? 'même boucle' : 'autre boucle';
const BLOC = h => h <= 4 ? 'Mères' : h <= 8 ? 'Filles' : h <= 12 ? 'Nièces' : 'Témoins';
// lectures (propriétés vraies ou fausses) du thème somme pour un match
function lectures(d) { const L = M.lire(d.m), S = derive(L), b = S.theme.bases, V = M.verdict(L), VS = M.verdict(S), HS = M.hierarchie(S), f = {};
  const pops = []; for (let h = 1; h <= 16; h++) if (b[h] === 16) pops.push(h);
  f['Populus en base : ' + (pops.length >= 4 ? '4 ou plus' : pops.length)] = true; f['Populus en base : 2 ou plus'] = pops.length >= 2;
  ['Mères', 'Filles', 'Nièces', 'Témoins'].forEach(z => { f['Populus dans les ' + z + (GENRE === 'somme' ? ' (hors M1)' : '')] = pops.some(h => (GENRE !== 'somme' || h > 1) && BLOC(h) === z); });
  for (const p of ['R1', 'R7']) { const P = L[p].figure, Hp = L[p].maison, q = p === 'R1' ? 'R7' : 'R1';
    const bl = g => M.bloqueurs(S, g), bP = bl(P);
    f[p + ' : sa figure bloquée par le ' + NOM + ''] = bP.length > 0; f[p + ' : sa figure bloquée par un Populus du ' + NOM + ''] = bP.some(x => x.type === 'populus');
    f[p + ' : sa figure bloquée par une figure intacte du ' + NOM + ''] = bP.some(x => x.type !== 'populus');
    f[p + ' : son front direct bloqué par le ' + NOM + ''] = bl(mod(P + 4)).length > 0; f[p + ' : son miroir bloqué par le ' + NOM + ''] = bl(mod(P + 8)).length > 0;
    f[p + ' : Populus dans sa maison' + (GENRE === 'somme' ? ' (principal = vérification)' : '')] = b[Hp] === 16;
    f[p + ' : Populus dans le front de sa figure'] = pops.some(h => (h - 1) % 4 === (P - 1) % 4);
    f[p + ' : le ' + NOM + ' pose dans sa maison : ' + REL(P, b[Hp])] = true;
    f[p + ' : le ' + NOM + ' pose sa figure quelque part'] = b.slice(1).includes(P); f[p + ' : le ' + NOM + ' pose son antagoniste'] = b.slice(1).includes(mod(P - 3));
    f[p + ' : le ' + NOM + ' pose son protecteur'] = b.slice(1).includes(mod(P - 6)); }
  f['pôle R1 du ' + NOM + ' / figure de R1 du principal : ' + REL(L.R1.figure, S.R1.figure)] = true; f['pôle R7 du ' + NOM + ' / figure de R7 du principal : ' + REL(L.R7.figure, S.R7.figure)] = true;
  f['verdict du ' + NOM + ' : ' + (VS.decision.resultat === 'N' ? 'égalité' : VS.decision.resultat === '1' ? 'R1' : 'R7')] = true;
  f['' + NOM + ' : R1 marque'] = HS.R1.marque; f['' + NOM + ' : R7 marque'] = HS.R7.marque; f['' + NOM + ' : boucles différentes'] = !!(VS.boucles && VS.boucles.domaine);
  f['verdict du ' + NOM + ' d\'accord avec le principal'] = VS.decision.resultat === V.decision.resultat;
  return { L, V, f }; }
const ISS = { 'R1 gagne': d => d.sc[0] > d.sc[1], 'R7 gagne': d => d.sc[1] > d.sc[0], 'nul': d => d.sc[0] === d.sc[1], 'R1 ne perd pas': d => d.sc[0] >= d.sc[1], 'R7 ne perd pas': d => d.sc[1] >= d.sc[0] };
D.forEach(d => { const x = lectures(d); d.f = x.f; d.v = x.V.decision.resultat; d.iss = {}; for (const k in ISS) d.iss[k] = ISS[k](d);
  d.iss['verdict principal juste'] = d.v === 'N' ? d.sc[0] === d.sc[1] : d.v === '1' ? d.sc[0] > d.sc[1] : d.sc[1] > d.sc[0]; });
const NOMS = [...new Set(D.flatMap(d => Object.keys(d.f).filter(k => d.f[k])))].sort(), ISN = Object.keys(D[0].iss);
// contextes : tous les matchs, ou seulement ceux où le verdict principal annonce R1 / R7 / égalité
const CTX = { 'tous': d => true, 'verdict principal R1': d => d.v === '1', 'verdict principal R7': d => d.v === '2', 'verdict principal égalité': d => d.v === 'N' };
const dev = D.filter(d => d.lot === 'dev'), jv = D.filter(d => d.lot === 'jv');
function chercher(get) { const out = []; for (const c in CTX) { const base = dev.filter(CTX[c]);
  for (const nm of NOMS) { const S = base.filter(d => d.f[nm]); if (S.length < MIN) continue;
    for (const o of ISN) { const k = S.filter(d => get(d)[o]).length, t = k / S.length; if (t >= 0.8 || t <= 0.2) out.push({ c, nm, o, n: S.length, k, oui: t >= 0.8 }); } } } return out; }
const vrai = chercher(d => d.iss), H = [];
for (let t = 0; t < TIRAGES; t++) { ['1', '2', 'N'].forEach(v => { const g = dev.filter(d => d.v === v), sh = g.map(d => d.iss).sort(() => Math.random() - 0.5); g.forEach((d, i) => { d.issM = sh[i]; }); }); H.push(chercher(d => d.issM).length); }
const moy = H.reduce((a, x) => a + x, 0) / H.length;
console.log(D.length + ' matchs (126 premiers, ' + jv.length + ' jamais vus) · ' + NOMS.length + ' lectures du ' + NOM + ' × ' + ISN.length + ' issues × 4 contextes · au moins ' + MIN + ' cas');
console.log('Règles fortes (≥ 80 % ou ≤ 20 %) sur les 126 premiers matchs : ' + vrai.length + ' · hasard (issues mélangées entre matchs de même verdict principal, ' + TIRAGES + ' tirages) : ' + moy.toFixed(1) + ' en moyenne (' + Math.min(...H) + ' à ' + Math.max(...H) + ')');
const J = vrai.map(r => { const S = jv.filter(CTX[r.c]).filter(d => d.f[r.nm]), k = S.filter(d => d.iss[r.o] === r.oui).length; return { ...r, tn: S.length, tk: k }; });
console.log('Sur les matchs jamais vus, elles tiennent ' + J.reduce((a, r) => a + r.tk, 0) + ' fois sur ' + J.reduce((a, r) => a + r.tn, 0) + ' cas.');
J.sort((a, b) => Math.abs(b.k / b.n - 0.5) * Math.sqrt(b.n) - Math.abs(a.k / a.n - 0.5) * Math.sqrt(a.n)).forEach(r => console.log('  [' + r.c + '] ' + r.nm + ' → ' + (r.oui ? '' : 'jamais : ') + r.o + ' · ' + (r.oui ? r.k : r.n - r.k) + '/' + r.n + ' · jamais vus ' + r.tk + '/' + r.tn));

// Le vainqueur annoncé par le thème principal, lu dans le thème somme (piste du propriétaire : le vainqueur « possède des blocages »).
console.log('\nLe vainqueur annoncé par le thème principal, lu dans le ' + NOM + ' (victoires annoncées) :');
const VA = D.filter(d => d.v !== 'N').map(d => { const L = M.lire(d.m), S = derive(L), b = S.theme.bases, w = d.v === '1' ? 'R1' : 'R7', l = w === 'R1' ? 'R7' : 'R1', i = w === 'R1' ? 0 : 1;
  const bW = M.bloqueurs(S, L[w].figure), bL = M.bloqueurs(S, L[l].figure);
  return { d, gagne: d.sc[i] > d.sc[1 - i], nePerdPas: d.sc[i] >= d.sc[1 - i], bW: bW.length > 0, bWpop: bW.some(x => x.type === 'populus'), bL: bL.length > 0, antW: b.slice(1).includes(mod(L[w].figure - 3)), proW: b.slice(1).includes(mod(L[w].figure - 6)) }; });
const tv = (lab, S) => { const n = S.length, g = S.filter(x => x.gagne).length, np = S.filter(x => x.nePerdPas).length, J = S.filter(x => x.d.lot === 'jv');
  console.log('  ' + lab.padEnd(70) + String(n).padStart(4) + ' · gagne ' + g + ' (' + Math.round(100 * g / (n || 1)) + ' %) · ne perd pas ' + np + ' (' + Math.round(100 * np / (n || 1)) + ' %)' + ' · jamais vus : gagne ' + J.filter(x => x.gagne).length + '/' + J.length + ', ne perd pas ' + J.filter(x => x.nePerdPas).length + '/' + J.length); };
tv('toutes les victoires annoncées', VA);
tv('sa figure bloquée dans le ' + NOM + '', VA.filter(x => x.bW)); tv('sa figure libre dans le ' + NOM + '', VA.filter(x => !x.bW));
tv('… bloquée par un Populus du ' + NOM + '', VA.filter(x => x.bWpop));
tv('sa figure bloquée, celle du perdant annoncé libre', VA.filter(x => x.bW && !x.bL)); tv('celle du perdant annoncé bloquée, la sienne libre', VA.filter(x => !x.bW && x.bL));
tv('le ' + NOM + ' pose son antagoniste', VA.filter(x => x.antW)); tv('le ' + NOM + ' pose son protecteur', VA.filter(x => x.proW));
// Forme la plus nette, sur les matchs joués seulement : figure du vainqueur annoncé bloquée par un Populus du thème somme, celle du perdant libre.
// Le thème somme a toujours Populus en M1 (M1 + M1) : Puer y est rendu et bloque toujours Albus — un vainqueur annoncé Albus entre donc toujours dans la piste.
const PZ = VA.filter(x => x.bWpop && !x.bL), alb = x => GENRE === 'somme' && M.lire(x.d.m)[x.d.v === '1' ? 'R1' : 'R7'].figure === 4;
console.log('\nFigure du vainqueur annoncé bloquée par un Populus du ' + NOM + ', perdant libre : gagne ' + PZ.filter(x => x.gagne).length + '/' + PZ.length
  + ' · dont Albus (toujours bloqué par le Populus de M1) ' + PZ.filter(x => alb(x) && x.gagne).length + '/' + PZ.filter(alb).length + ' · hors Albus ' + PZ.filter(x => !alb(x) && x.gagne).length + '/' + PZ.filter(x => !alb(x)).length
  + ' · autres victoires annoncées ' + VA.filter(x => !(x.bWpop && !x.bL)).filter(x => x.gagne).length + '/' + VA.filter(x => !(x.bWpop && !x.bL)).length);
// Le thème de vérification confirme-t-il le vainqueur annoncé ? (verdict du thème de vérification, et thèmes du cycle de la chaîne des vérifications)
if (GENRE === 'verification') { console.log('\nLe thème de vérification et le vainqueur annoncé par le principal :');
  const CF = VA.map(x => { const L = M.lire(x.d.m), V = M.verdict(L), dV = V.verification ? V.verification.decision : M.verdict(derive(L), true).decision.resultat, c2 = V.verification && V.verification.cycle2;
    return { ...x, dV, cyc: V.verification ? V.verification.cycle : null, c2ok: c2 ? c2.filter(r => r === x.d.v).length : null }; });
  tv('le thème de vérification annonce le même vainqueur', CF.filter(x => x.dV === x.d.v)); tv('il annonce l\'autre pôle', CF.filter(x => x.dV !== x.d.v && x.dV !== 'N')); tv('il annonce une égalité', CF.filter(x => x.dV === 'N'));
  [1, 2, 4].forEach(c => tv('chaîne des vérifications : cycle de ' + c, CF.filter(x => x.cyc === c)));
  tv('cycle de 2 : les deux thèmes du cycle annoncent le vainqueur', CF.filter(x => x.c2ok === 2)); tv('cycle de 2 : un seul des deux', CF.filter(x => x.c2ok === 1)); }
// Cycle de 4 : combien des quatre thèmes du cycle annoncent le vainqueur ? (même lecture que le cycle de 2)
if (GENRE === 'verification') { const T4 = x => { const b = K.construire(x).bases; return [b[1], b[4], b[7], b[10]]; };
  const CY = VA.map(x => { const vu = {}; let y = M.lire(x.d.m).theme.meres, k = 0; while (!vu[y.join('-')]) { vu[y.join('-')] = k + 1; y = T4(y); k++; }
    const lg = k - (vu[y.join('-')] - 1), cyc = [y]; for (let i = 1; i < lg; i++) cyc.push(T4(cyc[i - 1]));
    return { ...x, lg, ok: cyc.filter(z => M.verdict(M.lire(z), true).decision.resultat === x.d.v).length }; });
  [4, 3, 2, 1, 0].forEach(n => tv('cycle de 4 : ' + n + ' thème' + (n > 1 ? 's' : '') + ' du cycle sur 4 annoncent le vainqueur', CY.filter(x => x.lg === 4 && x.ok === n)));
  tv('tous les thèmes du cycle (2 ou 4) annoncent le vainqueur', CY.filter(x => x.lg > 1 && x.ok === x.lg)); tv('pas tous', CY.filter(x => x.lg > 1 && x.ok < x.lg)); }
