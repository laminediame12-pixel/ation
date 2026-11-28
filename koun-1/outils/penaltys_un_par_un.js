// Les penalties un par un (2026-11-27), même méthode que pour le rouge : pour chaque match étiqueté, signes structurels (fronts, arrêts, dragon, blocage,
// figures des pôles en M16…), puis signes qui séparent les matchs avec et sans penalty, et camp qui obtient le penalty.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, FR = 'ABCD', CANAL = [4, 8, 12, 13, 14, 15];
const relF = (a, b) => a === b ? 'même front' : ATT[a] === b ? 'R1 attaque R7' : ATT[b] === a ? 'R7 attaque R1' : 'fronts alliés';
D.forEach(d => { const L = d.L = M.lire(d.m), b = L.theme.bases, r = L.theme.resultantes; d.pn = oui(d.pen) ? 1 : 0; d.rg = oui(d.rouge) ? 1 : 0;
  d.pour = !d.pn ? null : /R1 et R7/.test(d.pen) ? 'les deux' : d.pen.includes('R1') ? 'R1' : 'R7';
  d.rel = relF(fr(L.R1.figure), fr(L.R7.figure)); d.arr = M.arrets(L).maisons; d.dragon = [6, 12].filter(h => b[h] === 7 || b[h] === 1);
  d.bl = { R1: M.blocages(L, 'R1'), R7: M.blocages(L, 'R7') }; d.m16 = b[16]; });
const desc = d => { const L = d.L; return 'R1 ' + N(L.R1.figure) + ' (M' + L.R1.maison + ', ' + FR[fr(L.R1.figure)] + ') · R7 ' + N(L.R7.figure) + ' (M' + L.R7.maison + ', ' + FR[fr(L.R7.figure)] + ') · M16 ' + N(d.m16); };
console.log('PENALTIES (' + D.filter(d => d.pn).length + ' matchs sur ' + D.length + ')');
D.filter(d => d.pn).forEach(d => console.log('  ' + d.nom.padEnd(36) + ('pour ' + d.pour).padEnd(14) + d.rel.padEnd(15) + ('arrêts ' + (d.arr.length ? 'M' + d.arr.join(',M') : '—')).padEnd(20) + desc(d)));
// relations de fronts et arrêts sur tous les matchs
const tab = (lab, f) => { const T = {}; D.forEach(d => { const k = f(d); T[k] = T[k] || [0, 0]; T[k][0] += d.pn; T[k][1]++; }); console.log('\n' + lab); Object.keys(T).sort().forEach(k => console.log('  ' + String(k).padEnd(28) + T[k][0] + '/' + T[k][1] + ' (' + Math.round(100 * T[k][0] / T[k][1]) + ' %)')); };
tab('relation des fronts de R1 et R7 :', d => d.rel);
tab('nombre d\'arrêts :', d => Math.min(d.arr.length, 2));
tab('relation des fronts × arrêt :', d => d.rel + (d.arr.length ? ' + arrêt' : ' sans arrêt'));
// camp
const P = D.filter(d => d.pn && d.pour !== 'les deux'); const c1 = P.filter(d => d.pour === 'R1').length;
console.log('\ncamp : penalty pour R1 ' + c1 + ' · pour R7 ' + (P.length - c1) + ' · pour les deux ' + D.filter(d => d.pour === 'les deux').length);
const regles = {
  'le pôle dont le front attaque l\'autre l\'obtient': d => d.rel === 'R1 attaque R7' ? 'R1' : d.rel === 'R7 attaque R1' ? 'R7' : null,
  'le pôle attaqué l\'obtient': d => d.rel === 'R1 attaque R7' ? 'R7' : d.rel === 'R7 attaque R1' ? 'R1' : null,
  'le pôle non bloqué l\'obtient (un seul bloqué)': d => (d.bl.R1.length > 0) !== (d.bl.R7.length > 0) ? (d.bl.R1.length ? 'R7' : 'R1') : null,
  'le pôle qui marque l\'obtient': d => { const a = M.marquePole(d.L, 'R1').marque, b = M.marquePole(d.L, 'R7').marque; return a !== b ? (a ? 'R1' : 'R7') : null; },
  'le pôle dont la figure est en M16 l\'obtient': d => d.m16 === d.L.R1.figure ? 'R1' : d.m16 === d.L.R7.figure ? 'R7' : null,
  'R1 toujours': d => 'R1' };
for (const [k, f] of Object.entries(regles)) { let ok = 0, n = 0; P.forEach(d => { const c = f(d); if (!c) return; n++; if (c === d.pour) ok++; }); console.log('  ' + k.padEnd(52) + ok + '/' + n); }
// échelle du penalty et contrôles
const s16 = d => d.m16 === d.L.R1.figure || d.m16 === d.L.R7.figure, nonAl = d => d.rel !== 'fronts alliés';
tab('figure d\'un pôle = sentence M16 :', d => s16(d) ? 'oui' : 'non');
tab('arrêt et fronts non alliés :', d => (d.arr.length > 0 && nonAl(d)) ? 'oui' : 'non');
tab('échelle (arrêt avec fronts non alliés ; figure d\'un pôle en M16) :', d => ((d.arr.length > 0 && nonAl(d)) ? 1 : 0) + (s16(d) ? 1 : 0) + ' signe(s)');
const ev = (lab, f) => { const h = [0, 1].map(p => { const S = D.filter((d, i) => i % 2 === p), A = S.filter(f); return A.filter(d => d.pn).length + '/' + A.length + ' · ' + S.filter(d => !f(d) && d.pn).length + '/' + (S.length - A.length); });
  const A = D.filter(f), y = D.map(d => d.pn), X = D.map(f), obs = X.reduce((s, x, i) => s + (x ? y[i] : 0), 0); let k = 0; for (let t = 0; t < 4000; t++) { const z = y.slice().sort(() => Math.random() - 0.5); if (X.reduce((s, x, i) => s + (x ? z[i] : 0), 0) >= obs) k++; }
  console.log('  ' + lab.padEnd(50) + A.filter(d => d.pn).length + '/' + A.length + ' allumée · ' + D.filter(d => !f(d) && d.pn).length + '/' + (D.length - A.length) + ' éteinte · p ' + (k / 4000).toFixed(3) + ' · moitiés ' + h.join(' | ')); };
console.log('\ncontrôles :'); ev('figure d\'un pôle en M16', s16); ev('arrêt et fronts non alliés', d => d.arr.length > 0 && nonAl(d)); ev('l\'un ou l\'autre', d => s16(d) || (d.arr.length > 0 && nonAl(d)));
// camp hiérarchique
const campP = d => { if (d.m16 === d.L.R1.figure && d.m16 !== d.L.R7.figure) return ['R1', 'sentence M16']; if (d.m16 === d.L.R7.figure && d.m16 !== d.L.R1.figure) return ['R7', 'sentence M16'];
  if (d.rel === 'R1 attaque R7') return ['R1', 'attaque de front']; if (d.rel === 'R7 attaque R1') return ['R7', 'attaque de front']; return ['R1', 'par défaut (R1)']; };
console.log('\ncamp du penalty : 1) figure d\'un pôle en M16 → lui ; 2) sinon le pôle dont le front attaque ; 3) sinon R1');
let ok = 0; const pv = {}; P.forEach(d => { const [c, v] = campP(d), j = c === d.pour; ok += j; pv[v] = pv[v] || [0, 0]; pv[v][0] += j; pv[v][1]++; if (!j) console.log('  ✗ ' + d.nom.padEnd(34) + 'prévu ' + c + ' (' + v + ') · obtenu ' + d.pour); });
console.log('  total ' + ok + '/' + P.length + ' · ' + Object.entries(pv).map(([k, [a, n]]) => k + ' ' + a + '/' + n).join(' · '));
// camp par l'arrêt : front de la figure qui arrête (attaquant) et front de la maison arrêtée (victime)
console.log('\ncamp par l\'arrêt (penalties à un seul camp avec arrêt) :');
const A2 = P.filter(d => d.arr.length);
const vote = (d, qui) => { let v1 = 0, v7 = 0; d.arr.forEach(h => { const fa = fr(d.L.theme.bases[h]), fv = fr(h), f = qui === 'attaquant' ? fa : fv; if (fr(d.L.R1.figure) === f) v1++; if (fr(d.L.R7.figure) === f) v7++; }); return v1 === v7 ? null : v1 > v7 ? 'R1' : 'R7'; };
for (const qui of ['attaquant', 'victime']) { let ok = 0, n = 0; A2.forEach(d => { const c = vote(d, qui); if (!c) return; n++; if (c === d.pour) ok++; }); console.log('  le pôle du front ' + (qui === 'attaquant' ? 'de la figure qui arrête' : 'de la maison arrêtée') + ' l\'obtient : ' + ok + '/' + n); }
const vote2 = (d, qui) => { let v1 = 0, v7 = 0; d.arr.forEach(h => { const g = d.L.theme.bases[h], cible = qui === 'attaquant' ? g : h; const z1 = [0, 4, 8, 12].map(x => fr(d.L.R1.figure) + 1 + x), z7 = [0, 4, 8, 12].map(x => fr(d.L.R7.figure) + 1 + x); if (qui === 'maison') { if (z1.includes(h)) v1++; if (z7.includes(h)) v7++; } else { if (fr(g) === fr(d.L.R1.figure)) v1++; if (fr(g) === fr(d.L.R7.figure)) v7++; } }); return v1 === v7 ? null : v1 > v7 ? 'R1' : 'R7'; };
{ let ok = 0, n = 0; A2.forEach(d => { const c = vote2(d, 'maison'); if (!c) return; n++; if (c === d.pour) ok++; }); console.log('  le pôle dont la boucle contient la maison arrêtée l\'obtient : ' + ok + '/' + n); }
// variante M16 : le pôle dont le FRONT contient la figure de M16
{ let ok = 0, n = 0; P.forEach(d => { const f16 = fr(d.m16), a = fr(d.L.R1.figure) === f16, b = fr(d.L.R7.figure) === f16; if (a === b) return; n++; if ((a ? 'R1' : 'R7') === d.pour) ok++; }); console.log('  le pôle dont le front contient la figure de M16 l\'obtient : ' + ok + '/' + n); }
{ let ok = 0, n = 0; P.forEach(d => { const a = d.L.R1.maison === 16, b = d.L.R7.maison === 16; if (a === b) return; n++; if ((a ? 'R1' : 'R7') === d.pour) ok++; }); console.log('  le pôle logé en M16 l\'obtient : ' + ok + '/' + n); }
