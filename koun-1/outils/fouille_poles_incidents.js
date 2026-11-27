// Fouille au niveau du pôle (2026-11-27) : chaque match donne deux pôles. Cible : le pôle reçoit un rouge (rouge contre lui) / obtient un penalty (pour lui).
// Signes : ses six figures liées (lui f, front direct f+4, miroir f+8, antagoniste f−3, protecteur f−6, victime f+3) — présence en base, position (canal Terre,
// nœud double, M16, boucle de son front, boucle du front adverse), intacte ou en réaction — et les mêmes vues depuis l'adversaire. Contrôle par permutation.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = s => s.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const CANAL = [4, 8, 12, 13, 14, 15], NOEUD = [1, 6, 11], fr = f => (f - 1) % 4, boucle = f => [0, 4, 8, 12].map(x => fr(f) + 1 + x), ATT = { 0: 3, 1: 0, 3: 2, 2: 1 };
const reagit = (g, h) => [0, 1, 2, 3].some(l => K.niveaux(g)[l] === 1 && K.niveaux(h)[l] === 1);
const P = []; D.forEach(d => { const L = M.lire(d.m), b = L.theme.bases; ['R1', 'R7'].forEach(p => { const q = p === 'R1' ? 'R7' : 'R1', f = L[p].figure, fo = L[q].figure, s = {};
  const rel = { 'lui': f, 'front direct': mod(f + 4), 'miroir': mod(f + 8), 'antagoniste': mod(f - 3), 'protecteur': mod(f - 6), 'victime (f+3)': mod(f + 3) };
  for (const [nom, g] of Object.entries(rel)) { const hs = []; for (let h = 1; h <= 16; h++) if (b[h] === g) hs.push(h);
    s[nom + ' : absent'] = hs.length === 0; s[nom + ' : 2 fois ou plus'] = hs.length >= 2; s[nom + ' : en canal Terre'] = hs.some(h => CANAL.includes(h)); s[nom + ' : sur un nœud double'] = hs.some(h => NOEUD.includes(h));
    s[nom + ' : en M16'] = hs.includes(16); s[nom + ' : dans la boucle de son front'] = hs.some(h => h < 16 && fr(h) === fr(f)); s[nom + ' : dans la boucle adverse'] = hs.some(h => h < 16 && fr(h) === fr(fo));
    s[nom + ' : intact quelque part'] = hs.some(h => h === 16 || (g !== 16 && !reagit(g, h))); s[nom + ' : en réaction quelque part'] = hs.some(h => h < 16 && reagit(g, h)); }
  s['son front attaque l\'adverse'] = ATT[fr(f)] === fr(fo); s['le front adverse l\'attaque'] = ATT[fr(fo)] === fr(f); s['même front que l\'adversaire'] = fr(f) === fr(fo);
  s['bloqué (règle du moteur)'] = M.blocages(L, p).length > 0; s['l\'adversaire est bloqué'] = M.blocages(L, q).length > 0; s['marque (règle du moteur)'] = M.marquePole(L, p).marque;
  s['sa figure est l\'antagoniste de l\'adversaire'] = f === mod(fo - 3); s['l\'adversaire est son antagoniste'] = fo === mod(f - 3); s['pôle R1 (domicile)'] = p === 'R1';
  s['sa maison : résultante Terre saturée'] = K.niveaux(L.theme.resultantes[L[p].maison])[3] === 2; s['sa maison : chez lui'] = b[L[p].maison] === L[p].maison;
  const rg = oui(d.rouge) && (d.rouge.includes(p) || /les deux|R1 et R7/.test(d.rouge)), pn = oui(d.pen) && (d.pen.includes(p));
  P.push({ nom: d.nom + ' ' + p, s, rg: rg ? 1 : 0, pn: pn ? 1 : 0 }); }); });
const noms = Object.keys(P[0].s);
for (const [c, lab] of [['rg', 'rouge reçu'], ['pn', 'penalty obtenu']]) { const y = P.map(x => x[c]), n1 = y.reduce((a, b) => a + b, 0);
  const eff = (y, k) => { let a = 0, n = 0, a0 = 0, n0 = 0; P.forEach((x, i) => { if (x.s[k]) { n++; a += y[i]; } else { n0++; a0 += y[i]; } }); return { a, n, a0, n0, e: n >= 8 && n0 >= 8 ? a / n - a0 / n0 : 0 }; };
  const rows = noms.map(k => ({ k, ...eff(y, k) })).sort((a, b) => Math.abs(b.e) - Math.abs(a.e));
  const T = 300, mx = []; for (let t = 0; t < T; t++) { const z = y.slice().sort(() => Math.random() - 0.5); mx.push(Math.max(...noms.map(k => Math.abs(eff(z, k).e)))); } mx.sort((a, b) => a - b);
  console.log('\n' + lab.toUpperCase() + ' : ' + n1 + ' pôles sur ' + P.length + ' (' + Math.round(100 * n1 / P.length) + ' %) · ' + noms.length + ' signes · au hasard, meilleur écart : médiane ' + mx[T / 2 | 0].toFixed(2) + ', 95e ' + mx[Math.floor(T * .95)].toFixed(2));
  rows.slice(0, 12).forEach(o => console.log('  ' + (o.e > 0 ? '+' : '') + o.e.toFixed(2) + '  ' + (Math.round(100 * o.a / o.n) + ' %').padStart(5) + ' (' + o.a + '/' + o.n + ') contre ' + Math.round(100 * o.a0 / o.n0) + ' %  ' + o.k + (Math.abs(o.e) >= mx[Math.floor(T * .95)] ? '   ← au-delà du hasard' : ''))); }
