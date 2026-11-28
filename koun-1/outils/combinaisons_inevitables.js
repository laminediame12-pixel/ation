// Combinaisons de maisons et événements « inévitables » (demande du propriétaire, 2026-11-28 : « la figure somme de certaines combinaisons indique des
// événements inévitables dans le match, comme la combinaison du premier mi-temps »).
// Repère : il n'existe que 255 sommes de maisons distinctes (chacune égale à une somme parmi M1..M8 — catalogue du moteur, M.equivalences).
// Chaque somme est lue comme la combinaison de première mi-temps (moteur : rythme) : niveaux, front, classe, vitesse ; ancrage de la figure en base ;
// attaque (antagoniste f − 3 en base sans protecteur f − 6) ; binôme lié ; pôle désigné (son front direct porte en base la figure ou son protecteur) ;
// relation de la figure avec chaque pôle (sa figure, son antagoniste, sa victime, son protecteur, son front direct, son miroir, posée dans sa maison).
// On cherche les règles sans exception (toujours ou jamais) sur les 126 matchs de développement, avec au moins MIN cas ; on mesure combien le hasard en
// donne en mélangeant les résultats des 126 matchs (les événements d'un match restent ensemble) ; on juge les règles sur les 34 matchs du 26 et du 27
// novembre, jamais vus, contre la fréquence de l'événement dans ces matchs.
// Puis le mécanisme complet de la mi-temps (attaque avec la nuance des maisons de la combinaison, binôme lié, pôle désigné) sur les 1820 combinaisons de 4 maisons :
// rang des deux combinaisons de mi-temps du moteur, puis les événements du match entier (hasard, jugement sur les jamais vus).
// Résultat (2026-11-28) : rien au-dessus du hasard pour les propriétés seules ; 1-5-12-15 1re sur 1820 (31 mi-temps) ; une piste, M3+M7+M11 : pôle désigné seul → il marque
// (58/63, puis 14/15 sur les jamais vus), figée par outils/figer_marque_combinaison.js.
// Usage : node outils/combinaisons_inevitables.js [MIN=12] [TIRAGES=20]
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, A = K.additionner;
const MIN = +(process.argv[2] || 12), TIRAGES = +(process.argv[3] || 20), mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => (x || '').toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
// matchs : score, mi-temps (si connue et définitive), incidents (si connus)
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); return tous.get(k); };
lire('validation/scores-reels.json').forEach(x => { const d = aj(x.themes, x.score, x.match, 'dev'); if (Array.isArray(x.mi_temps)) d.mt = x.mi_temps; if (x.penalty != null) d.pen = x.penalty; if (x.rouge != null) d.rouge = x.rouge; });
lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => { const d = aj(x.theme, x.score, x.match, 'dev'); if (x.penalty != null && d.pen == null) d.pen = x.penalty; if (x.rouge != null && d.rouge == null) d.rouge = x.rouge; }));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json'].forEach(f => lire(f).matchs.forEach(x => { const d = aj(x.theme, x.score, x.match, 'test'); if (x.penalty != null) d.pen = x.penalty; if (x.rouge != null) d.rouge = x.rouge; }));
lire('validation/mi-temps.json').forEach(x => { const d = tous.get(x.themes.join('-')); if (d && Array.isArray(x.mi_temps) && !d.mt && !x.provisoire) d.mt = x.mi_temps; });
{ const parNom = new Map([...tous.values()].map(d => [norm(d.nom), d])); lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const d = parNom.get(norm(n)); if (!d) return; if (d.pen == null) d.pen = pen; if (d.rouge == null) d.rouge = rouge; }); }
const connu = v => v != null && v !== 'incertain', oui = v => !/^non/i.test(v), cote = (v, p) => new RegExp(p ? 'R7' : 'R1').test(v);
const D = [...tous.values()], nD = D.length, isDev = D.map(d => d.lot === 'dev');
// événements du match (null = inconnu) et événements d'un pôle p (0 = R1, 1 = R7)
const EV = {
  'au moins 3 buts': d => d.sc[0] + d.sc[1] >= 3, 'au plus 1 but': d => d.sc[0] + d.sc[1] <= 1, '0-0': d => d.sc[0] + d.sc[1] === 0, 'les deux marquent': d => d.sc[0] > 0 && d.sc[1] > 0,
  'nul': d => d.sc[0] === d.sc[1], 'R1 gagne': d => d.sc[0] > d.sc[1], 'R7 gagne': d => d.sc[1] > d.sc[0],
  'but en 1re mi-temps': d => d.mt ? d.mt[0] + d.mt[1] > 0 : null, 'but en 2e mi-temps': d => d.mt ? d.sc[0] + d.sc[1] - d.mt[0] - d.mt[1] > 0 : null,
  'penalty': d => connu(d.pen) ? oui(d.pen) : null, 'carton rouge': d => connu(d.rouge) ? oui(d.rouge) : null };
const EP = { 'marque': (d, p) => d.sc[p] > 0, 'gagne': (d, p) => d.sc[p] > d.sc[1 - p], 'perd': (d, p) => d.sc[p] < d.sc[1 - p],
  'marque en 1re mi-temps': (d, p) => d.mt ? d.mt[p] > 0 : null, 'marque en 2e mi-temps': (d, p) => d.mt ? d.sc[p] - d.mt[p] > 0 : null,
  'a un penalty': (d, p) => connu(d.pen) ? oui(d.pen) && cote(d.pen, p) : null, 'a un rouge': (d, p) => connu(d.rouge) ? oui(d.rouge) && cote(d.rouge, p) : null };
// les 255 sommes distinctes : sous-ensembles non vides de M1..M8, écrits sous leur forme la plus courte
const COMBIS = []; for (let s = 1; s < 256; s++) { const hs = [1, 2, 3, 4, 5, 6, 7, 8].filter((h, i) => (s >> i) & 1); COMBIS.push({ hs, min: M.equivalences(hs).minimale }); }
const nomC = ci => 'M' + COMBIS[ci].min.join('+M');
D.forEach(d => { const L = M.lire(d.m), b = L.theme.bases; d.L = L; d.enBase = Array.from({ length: 17 }, () => 0); for (let h = 1; h <= 16; h++) d.enBase[b[h]]++;
  d.fig = [L.R1.figure, L.R7.figure]; d.mai = [L.R1.maison, L.R7.maison]; d.fh = d.fig.map(g => [0, 1, 2, 3].map(i => (g - 1) % 4 + 4 * i + 1));
  d.S = COMBIS.map(c => c.hs.reduce((x, h) => A(x, b[h]), 16)); });
// lecture de la figure-somme f dans le thème du match d (même lecture que la combinaison de première mi-temps)
function lecture(d, f) { const b = d.L.theme.bases, r = d.L.theme.resultantes, n = K.niveaux(f), ant = mod(f - 3), pro = mod(f - 6), bi = K.binome(f), eb = g => d.enBase[g];
  const rapide = n[0] === 2 && n[1] === 2 && f !== 16, attaquee = eb(ant) > 0 && !eb(pro), biLie = eb(bi) + eb(mod(bi - 3)) + eb(mod(bi - 6)) > 0;
  return { f, n, s: n.filter(v => v === 2).length, rapide, lente: n[0] === 1 && n[1] === 1, anc: eb(f), antA: eb(ant) > 0, proA: eb(pro) > 0, attaquee, biLie, butAttendu: (rapide || attaquee) && biLie,
    des: [0, 1].map(p => d.fh[p].some(h => b[h] === f || b[h] === pro)), tou: [0, 1].map(p => d.fh[p].some(h => b[h] === f || (h < 16 && r[h] === f))) }; }
const NV = ['Feu', 'Air', 'Eau', 'Terre'];
const PM = [].concat(...[0, 1, 2, 3].map(l => [[NV[l] + ' saturé', x => x.n[l] === 2], [NV[l] + ' actif', x => x.n[l] === 1]]), ['A', 'B', 'C', 'D'].map((z, i) => ['front ' + z, x => (x.f - 1) % 4 === i]), [
  ['Populus', x => x.f === 16], ['Via', x => x.f === 5], ['fermante', x => x.s === 1], ['ouvrante', x => x.s === 3], ['fixe', x => x.s === 2 && x.n[3] !== 2], ['mobile', x => x.s === 2 && x.n[3] === 2],
  ['rapide', x => x.rapide], ['lente', x => x.lente], ['intermédiaire', x => !x.rapide && !x.lente && x.f !== 16],
  ['ancrée en base', x => x.anc > 0], ['absente des bases', x => x.anc === 0], ['ancrée 2 fois ou plus', x => x.anc >= 2],
  ['attaquée', x => x.attaquee], ['protégée (antagoniste et protecteur en base)', x => x.antA && x.proA], ['sans antagoniste en base', x => !x.antA],
  ['binôme lié', x => x.biLie], ['binôme isolé', x => !x.biLie], ['but attendu (rapide ou attaquée, binôme lié)', x => x.butAttendu],
  ['figure de R1', (x, d) => x.f === d.fig[0]], ['figure de R7', (x, d) => x.f === d.fig[1]], ['antagoniste de R1', (x, d) => x.f === mod(d.fig[0] - 3)], ['antagoniste de R7', (x, d) => x.f === mod(d.fig[1] - 3)],
  ['désigne R1 seul', x => x.des[0] && !x.des[1]], ['désigne R7 seul', x => !x.des[0] && x.des[1]], ['désigne les deux pôles', x => x.des[0] && x.des[1]], ['ne désigne aucun pôle', x => !x.des[0] && !x.des[1]]]);
const PP = [['la désigne', (x, d, p) => x.des[p]], ['la désigne seule', (x, d, p) => x.des[p] && !x.des[1 - p]], ['désigne l\'autre seul', (x, d, p) => !x.des[p] && x.des[1 - p]], ['touche son front direct', (x, d, p) => x.tou[p]],
  ['est sa figure', (x, d, p) => x.f === d.fig[p]], ['est son antagoniste', (x, d, p) => x.f === mod(d.fig[p] - 3)], ['est sa victime', (x, d, p) => x.f === mod(d.fig[p] + 3)], ['est son protecteur', (x, d, p) => x.f === mod(d.fig[p] - 6)],
  ['est son front direct', (x, d, p) => x.f === mod(d.fig[p] + 4)], ['est son miroir', (x, d, p) => x.f === mod(d.fig[p] + 8)], ['est posée dans sa maison', (x, d, p) => d.L.theme.bases[d.mai[p]] === x.f],
  ['est dans son front', (x, d, p) => (x.f - 1) % 4 === (d.fig[p] - 1) % 4], ['est dans sa boucle', (x, d, p) => x.f % 2 === d.fig[p] % 2]];
const EVn = Object.keys(EV), EPn = Object.keys(EP), code = v => v === null ? -1 : v ? 1 : 0;
const ev = EVn.map(e => Int8Array.from(D, d => code(EV[e](d)))), ep = EPn.map(e => { const a = new Int8Array(2 * nD); D.forEach((d, i) => { a[2 * i] = code(EP[e](d, 0)); a[2 * i + 1] = code(EP[e](d, 1)); }); return a; });
// listes des matchs (ou des pôles, 2i + p) où chaque propriété vaut, par somme
const LM = [], LP = [];
COMBIS.forEach((c, ci) => { const X = D.map(d => lecture(d, d.S[ci]));
  LM.push(PM.map(([, fn]) => { const o = { dev: [], test: [] }; D.forEach((d, i) => { if (fn(X[i], d)) o[isDev[i] ? 'dev' : 'test'].push(i); }); return o; }));
  LP.push(PP.map(([, fn]) => { const o = { dev: [], test: [] }; D.forEach((d, i) => [0, 1].forEach(p => { if (fn(X[i], d, p)) o[isDev[i] ? 'dev' : 'test'].push(2 * i + p); })); return o; })); });
const taux = (a, pole, garde) => { let n = 0, k = 0; for (let i = 0; i < nD; i++) if (garde(i)) for (let p = 0; p < (pole ? 2 : 1); p++) { const v = a[pole ? 2 * i + p : i]; if (v >= 0) { n++; k += v; } } return n ? k / n : 0; };
const p0M = ev.map(a => taux(a, false, i => isDev[i])), p0P = ep.map(a => taux(a, true, i => isDev[i])), ptM = ev.map(a => taux(a, false, i => !isDev[i])), ptP = ep.map(a => taux(a, true, i => !isDev[i]));
// recherche (map : match dont on lit les résultats ; identité = vrais résultats)
function chercher(map) { const out = []; let pmin = 1;
  for (let ci = 0; ci < COMBIS.length; ci++) {
    for (let pi = 0; pi < PM.length; pi++) { const Lst = LM[ci][pi].dev; if (Lst.length < MIN) continue;
      for (let e = 0; e < ev.length; e++) { const a = ev[e]; let n = 0, k = 0; for (const i of Lst) { const v = a[map[i]]; if (v >= 0) { n++; k += v; } }
        if (n >= MIN && (k === n || k === 0)) { const pv = Math.pow(k === n ? p0M[e] : 1 - p0M[e], n); if (pv < pmin) pmin = pv; out.push({ t: 'M', ci, pi, e, n, toujours: k === n, pv }); } } }
    for (let pi = 0; pi < PP.length; pi++) { const Lst = LP[ci][pi].dev; if (Lst.length < MIN) continue;
      for (let e = 0; e < ep.length; e++) { const a = ep[e]; let n = 0, k = 0; for (const j of Lst) { const v = a[2 * map[j >> 1] + (j & 1)]; if (v >= 0) { n++; k += v; } }
        if (n >= MIN && (k === n || k === 0)) { const pv = Math.pow(k === n ? p0P[e] : 1 - p0P[e], n); if (pv < pmin) pmin = pv; out.push({ t: 'P', ci, pi, e, n, toujours: k === n, pv }); } } } }
  return { out, pmin }; }
const ident = D.map((d, i) => i), devI = ident.filter(i => isDev[i]);
const vrai = chercher(ident), seuil = 1e-3, rares = o => o.filter(r => r.pv < seuil).length;
const H = []; for (let t = 0; t < TIRAGES; t++) { const sh = devI.slice().sort(() => Math.random() - 0.5), map = ident.slice(); devI.forEach((i, z) => { map[i] = sh[z]; }); const x = chercher(map); H.push({ n: x.out.length, rares: rares(x.out), pmin: x.pmin }); }
const moy = a => a.reduce((s, x) => s + x, 0) / a.length;
console.log('Données : ' + devI.length + ' matchs de développement (incidents connus : ' + devI.filter(i => ev[EVn.indexOf('penalty')][i] >= 0).length + ', mi-temps connue : ' + devI.filter(i => D[i].mt).length + ') · ' + (nD - devI.length) + ' matchs jamais vus (26 et 27 novembre, incidents connus : ' + ident.filter(i => !isDev[i] && ev[EVn.indexOf('penalty')][i] >= 0).length + ', mi-temps : ' + ident.filter(i => !isDev[i] && D[i].mt).length + ')');
console.log('Recherche : 255 sommes × (' + PM.length + ' propriétés × ' + EVn.length + ' événements du match + ' + PP.length + ' relations aux pôles × ' + EPn.length + ' événements du pôle) · au moins ' + MIN + ' cas');
console.log('\nRègles sans exception sur les 126 matchs : ' + vrai.out.length + ' · hasard (résultats mélangés, ' + TIRAGES + ' tirages) : ' + Math.round(moy(H.map(h => h.n))) + ' en moyenne (' + Math.min(...H.map(h => h.n)) + ' à ' + Math.max(...H.map(h => h.n)) + ')');
console.log('dont très improbables une à une (probabilité < 1/1000) : ' + rares(vrai.out) + ' · hasard : ' + moy(H.map(h => h.rares)).toFixed(1) + ' en moyenne (' + Math.min(...H.map(h => h.rares)) + ' à ' + Math.max(...H.map(h => h.rares)) + ')');
console.log('la plus improbable : ' + vrai.pmin.toExponential(1) + ' · le hasard fait aussi bien ou mieux dans ' + H.filter(h => h.pmin <= vrai.pmin).length + ' tirages sur ' + TIRAGES);
// jugement sur les matchs jamais vus
const J = vrai.out.map(r => { const Lst = (r.t === 'M' ? LM : LP)[r.ci][r.pi].test, a = (r.t === 'M' ? ev : ep)[r.e], pt = (r.t === 'M' ? ptM : ptP)[r.e]; let n = 0, k = 0;
  for (const j of Lst) { const v = a[j]; if (v >= 0) { n++; if (v === (r.toujours ? 1 : 0)) k++; } } return { ...r, tn: n, tk: k, att: n * (r.toujours ? pt : 1 - pt) }; });
const som = (a, f) => a.reduce((s, x) => s + f(x), 0);
console.log('\nSur les 34 matchs jamais vus : les règles tiennent ' + som(J, r => r.tk) + ' fois sur ' + som(J, r => r.tn) + ' cas ; la seule fréquence des événements en donnerait ' + som(J, r => r.att).toFixed(0));
const nomR = r => nomC(r.ci) + ' : figure ' + (r.t === 'M' ? PM[r.pi][0] + ' → ' + (r.toujours ? '' : 'jamais ') + EVn[r.e] : 'qui ' + PP[r.pi][0] + ' → le pôle ' + (r.toujours ? '' : 'ne ') + EPn[r.e].replace(/^(\S+)/, r.toujours ? '$1' : '$1 pas'));
console.log('\npar événement                        règles · jamais vus : tenues / cas (attendu par la seule fréquence)');
[...EVn.map((e, z) => ['M', z, e]), ...EPn.map((e, z) => ['P', z, 'pôle : ' + e])].forEach(([t, z, lab]) => { const S = J.filter(r => r.t === t && r.e === z); if (!S.length) return;
  console.log('  ' + lab.padEnd(36) + String(S.length).padStart(4) + ' · ' + som(S, r => r.tk) + ' / ' + som(S, r => r.tn) + ' (' + som(S, r => r.att).toFixed(1) + ')'); });
console.log('\nles 15 plus improbables sur les 126 matchs, et ce qu\'elles donnent ensuite :');
J.slice().sort((a, b) => a.pv - b.pv).slice(0, 15).forEach(r => console.log('  ' + nomR(r) + ' · ' + r.n + '/' + r.n + ' (p = ' + r.pv.toExponential(1) + ') · jamais vus ' + r.tk + '/' + r.tn));
const tenues = J.filter(r => r.tn >= 3 && r.tk === r.tn);
console.log('\ntenues sans exception sur 3 cas jamais vus ou plus : ' + tenues.length + ' (attendu par la seule fréquence : ' + som(J.filter(r => r.tn >= 3), r => Math.pow(r.att / r.tn, r.tn)).toFixed(1) + ')');
tenues.sort((a, b) => a.pv * Math.pow(a.att / a.tn, a.tn) - b.pv * Math.pow(b.att / b.tn, b.tn)).slice(0, 12).forEach(r => console.log('  ' + nomR(r) + ' · ' + r.n + '/' + r.n + ' puis ' + r.tk + '/' + r.tn));
// repères : les deux combinaisons de mi-temps du moteur, sur toutes les mi-temps connues
const mt = D.filter(d => d.mt), Y = mt.map(d => M.rythme(d.L)), Z = mt.map(d => M.secondeMiTemps(d.L));
const a1 = mt.filter((d, i) => Y[i].butAttendu), b1 = mt.filter((d, i) => !Y[i].butAttendu), but1 = d => d.mt[0] + d.mt[1] > 0;
let dz = 0, dk = 0, az = 0, ak = 0; mt.forEach((d, i) => [0, 1].forEach(p => { const m2 = d.sc[p] - d.mt[p] > 0; if (Z[i].marqueurs.includes(p ? 'R7' : 'R1')) { dz++; if (m2) dk++; } else { az++; if (m2) ak++; } }));
console.log('\nrepères (' + mt.length + ' mi-temps connues) : M1+M5+M12+M15 (≡ ' + nomC(COMBIS.findIndex(c => c.min.join() === M.equivalences([1, 5, 12, 15]).minimale.join())) + '), but attendu en 1re mi-temps → but ' + a1.filter(but1).length + '/' + a1.length + ', sinon ' + b1.filter(but1).length + '/' + b1.length
  + ' · M4+M5+M13+M15 (≡ ' + nomC(COMBIS.findIndex(c => c.min.join() === M.equivalences([4, 5, 13, 15]).minimale.join())) + '), pôle désigné → marque en 2e mi-temps ' + dk + '/' + dz + ', autres ' + ak + '/' + az);
// Le mécanisme complet de la mi-temps (moteur : rythme, secondeMiTemps), appliqué à chacune des 1820 combinaisons de 4 maisons : la combinaison du
// propriétaire se distingue-t-elle des autres ? Classement par probabilité hypergéométrique (plus de buts quand le mécanisme les attend).
const lf = (() => { const t = [0]; for (let i = 1; i <= 400; i++) t[i] = t[i - 1] + Math.log(i); return t; })(), Cb = (n, k) => k < 0 || k > n ? -Infinity : lf[n] - lf[k] - lf[n - k];
const hyp = (Nt, Kt, n, k) => { let s = 0; for (let x = k; x <= Math.min(n, Kt); x++) s += Math.exp(Cb(Kt, x) + Cb(Nt - Kt, n - x) - Cb(Nt, n)); return s; };
function meca(d, C) { const b = d.L.theme.bases, f = C.map(h => b[h]).reduce(A), n = K.niveaux(f), ant = mod(f - 3), pro = mod(f - 6), eb = g => { const r = []; for (let h = 1; h <= 16; h++) if (b[h] === g) r.push(h); return r; };
  const ba = eb(ant), bp = eb(pro), dedans = h => C.includes(h), bloquee = ba.length > 0 && bp.some(h => !dedans(h)) && !ba.some(dedans), rapide = n[0] === 2 && n[1] === 2 && f !== 16, attaque = ba.length > 0 && !bloquee;
  const bi = K.binome(f), biLie = eb(bi).length + eb(mod(bi - 3)).length + eb(mod(bi - 6)).length > 0;
  return { attendu: (rapide || attaque) && biLie, des: [0, 1].map(p => d.fh[p].some(h => b[h] === f || b[h] === pro)) }; }
const Q4 = []; for (let a = 1; a <= 16; a++) for (let b2 = a + 1; b2 <= 16; b2++) for (let c = b2 + 1; c <= 16; c++) for (let e = c + 1; e <= 16; e++) Q4.push([a, b2, c, e]);
const sc4 = Q4.map(C => { const X = mt.map(d => meca(d, C)); let n1 = 0, k1 = 0, n2 = 0, k2 = 0; const K1 = mt.filter(but1).length; let K2 = 0;
  mt.forEach((d, i) => { if (X[i].attendu) { n1++; if (but1(d)) k1++; } [0, 1].forEach(p => { const m2 = d.sc[p] - d.mt[p] > 0; if (m2) K2++; if (X[i].des[p]) { n2++; if (m2) k2++; } }); });
  return { C, n1, k1, p1: hyp(mt.length, K1, n1, k1), n2, k2, p2: hyp(2 * mt.length, K2, n2, k2) }; });
const rang = (key, C) => { const s = sc4.slice().sort((x, y) => x[key] - y[key]); const i = s.findIndex(x => x.C.join() === C.join()); return { rang: i + 1, ex: s.filter(x => x[key] <= s[i][key]).length, top: s.slice(0, 5) }; };
const r1 = rang('p1', [1, 5, 12, 15]), r2 = rang('p2', [4, 5, 13, 15]);
console.log('\nmécanisme sur les 1820 combinaisons de 4 maisons (' + mt.length + ' mi-temps) :');
console.log('  1re mi-temps, M1+M5+M12+M15 : rang ' + r1.rang + ' (ex æquo ou mieux : ' + r1.ex + ') · meilleures : ' + r1.top.map(x => x.C.join('-') + ' ' + x.k1 + '/' + x.n1).join(', '));
console.log('  2e mi-temps, M4+M5+M13+M15 : rang ' + r2.rang + ' (ex æquo ou mieux : ' + r2.ex + ') · meilleures : ' + r2.top.map(x => x.C.join('-') + ' ' + x.k2 + '/' + x.n2).join(', '));
// Le même mécanisme sur les 1820 combinaisons de 4 maisons, pour les événements du match entier : « but attendu » de la combinaison (événement du match)
// et pôle désigné (événement du pôle), sur les 126 matchs ; hasard par résultats mélangés ; puis les meilleures sur les 34 matchs jamais vus.
const Ev3 = ['au moins 3 buts', 'au plus 1 but', '0-0', 'les deux marquent', 'nul', 'penalty', 'carton rouge'].map(e => EVn.indexOf(e)), Ep3 = ['marque', 'gagne', 'perd', 'a un penalty', 'a un rouge'].map(e => EPn.indexOf(e));
const MX = Q4.map(C => D.map(d => meca(d, C))), testI = ident.filter(i => !isDev[i]);
const tab = (X, t, e, prop, I, map) => { const a = t === 'M' ? ev[e] : ep[e]; let N = 0, Kt = 0, n = 0, k = 0;
  for (const i of I) for (let p = 0; p < (t === 'M' ? 1 : 2); p++) { const v = t === 'M' ? a[map[i]] : a[2 * map[i] + p]; if (v < 0) continue; N++; Kt += v;
    const s = t === 'M' ? X[i].attendu : prop === 'désigné' ? X[i].des[p] : X[i].des[p] && !X[i].des[1 - p]; if (s) { n++; k += v; } } return { N, Kt, n, k }; };
function crible(map) { const res = []; for (let q = 0; q < Q4.length; q++) { const X = MX[q];
  const aj3 = (t, e, prop) => { const o = tab(X, t, e, prop, devI, map), ph = hyp(o.N, o.Kt, o.n, o.k), pl = hyp(o.N, o.N - o.Kt, o.n, o.n - o.k); res.push({ q, t, e, prop, ...o, p: Math.min(ph, pl), sens: ph <= pl ? 1 : -1 }); };
  Ev3.forEach(e => aj3('M', e, 'but attendu')); Ep3.forEach(e => { aj3('P', e, 'désigné'); aj3('P', e, 'désigné seul'); }); } return res; }
const C3 = crible(ident).sort((a, b) => a.p - b.p), H3 = [];
for (let t = 0; t < TIRAGES; t++) { const sh = devI.slice().sort(() => Math.random() - 0.5), map = ident.slice(); devI.forEach((i, z) => { map[i] = sh[z]; }); const x = crible(map); H3.push({ pmin: Math.min(...x.map(r => r.p)), rares: x.filter(r => r.p < 1e-3).length }); }
console.log('\nmécanisme sur les 1820 combinaisons, match entier (' + C3.length + ' essais) : meilleure probabilité ' + C3[0].p.toExponential(1) + ' · le hasard fait aussi bien ou mieux dans ' + H3.filter(h => h.pmin <= C3[0].p).length + ' tirages sur ' + TIRAGES
  + ' · essais sous 1/1000 : ' + C3.filter(r => r.p < 1e-3).length + ' (hasard ' + moy(H3.map(h => h.rares)).toFixed(1) + ')');
const lab3 = r => Q4[r.q].join('-') + ' ' + (r.t === 'M' ? 'but attendu → ' + EVn[r.e] : r.prop + ' → le pôle ' + EPn[r.e]) + (r.sens > 0 ? ' (plus souvent)' : ' (moins souvent)');
let rep = 0, tot = 0; C3.slice(0, 15).forEach(r => { const o = tab(MX[r.q], r.t, r.e, r.prop, testI, ident), dans = o.n ? o.k / o.n : NaN, hors = o.N - o.n ? (o.Kt - o.k) / (o.N - o.n) : NaN, ok = (dans - hors) * r.sens > 0; tot++; if (ok) rep++;
  console.log('  ' + lab3(r) + ' : ' + r.k + '/' + r.n + ' contre ' + (r.Kt - r.k) + '/' + (r.N - r.n) + ' (p = ' + r.p.toExponential(1) + ') · jamais vus ' + o.k + '/' + o.n + ' contre ' + (o.Kt - o.k) + '/' + (o.N - o.n) + (ok ? ' ✓' : ' ✗')); });
let rep50 = 0; C3.slice(0, 100).forEach(r => { const o = tab(MX[r.q], r.t, r.e, r.prop, testI, ident), d1 = o.n ? o.k / o.n : 0, d2 = o.N - o.n ? (o.Kt - o.k) / (o.N - o.n) : 0; if ((d1 - d2) * r.sens > 0) rep50++; });
console.log('  sens confirmé sur les jamais vus : ' + rep + ' des 15 premières, ' + rep50 + ' des 100 premières (le hasard en confirme la moitié)');
