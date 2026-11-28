// Thème somme et vainqueur (demande du propriétaire, 2026-11-28 : « dans le thème somme il y a une piste solide sur le vainqueur, car il possède des blocages »).
// Pour chaque match joué : thème somme calculé par le moteur (M.themeSomme), blocages de ses deux pôles (M.bloqueurs : antagoniste intact posé, en M16, ou reproduit
// par Populus), pôle qui bloque l'autre, verdict du moteur sur le thème somme ; puis qui a gagné le match. R1 = équipe 1, R7 = équipe 2, comme dans la page.
// Usage : node outils/somme_blocages.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dev')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dev'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dev');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dev')));
['validation/resultats-2026-11-26.json', 'validation/resultats-2026-11-27.json', 'validation/resultats-2026-11-28.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'jamais vus')));
const D = [...tous.values()].map(d => { const L = M.lire(d.m), S = M.lire(M.themeSomme(L).meres), bl = p => M.bloqueurs(S, S[p].figure, S[p].maison);
  const b1 = bl('R1'), b7 = bl('R7'), r = d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'nul';
  // le pôle qui bloque l'autre : sa figure est l'antagoniste de la figure de l'autre, et c'est elle qui bloque (posée intacte, en M16, ou reproduite)
  const parLui = (p, q) => (q === 'R1' ? b1 : b7).some(x => x.figure === S[p].figure);
  const vS = M.verdict(S).decision.resultat, vP = M.verdict(L).decision.resultat;
  return { ...d, S, b1, b7, r, bloqueR7parR1: parLui('R1', 'R7'), bloqueR1parR7: parLui('R7', 'R1'), vS: vS === '1' ? 'R1' : vS === '2' ? 'R7' : 'nul', vP: vP === '1' ? 'R1' : vP === '2' ? 'R7' : 'nul' }; });
const tab = (lab, S, f) => { const n = S.length, c = { R1: 0, nul: 0, R7: 0 }; S.forEach(d => c[d.r]++); const g = f ? S.filter(d => d.r === f(d)).length : null;
  console.log('  ' + lab.padEnd(62) + String(n).padStart(4) + ' matchs · R1 ' + c.R1 + ' · nul ' + c.nul + ' · R7 ' + c.R7 + (g != null ? ' · annoncé juste ' + g + '/' + n + ' (' + (n ? Math.round(100 * g / n) : 0) + ' %)' : '')); };
for (const lot of ['tous', 'dev', 'jamais vus']) { const X = lot === 'tous' ? D : D.filter(d => d.lot === lot);
  console.log('\n' + (lot === 'tous' ? 'Les ' + D.length + ' matchs' : lot === 'dev' ? '126 premiers matchs' : 'Matchs jamais vus (26, 27 et 28 novembre)'));
  tab('tous', X);
  tab('seul R1 bloqué dans le thème somme', X.filter(d => d.b1.length && !d.b7.length), () => 'R7');
  tab('seul R7 bloqué dans le thème somme', X.filter(d => !d.b1.length && d.b7.length), () => 'R1');
  tab('les deux bloqués', X.filter(d => d.b1.length && d.b7.length));
  tab('aucun bloqué', X.filter(d => !d.b1.length && !d.b7.length));
  tab('R1 (en M16) bloque R7 lui-même', X.filter(d => d.bloqueR7parR1), () => 'R1');
  tab('R7 bloque R1 lui-même', X.filter(d => d.bloqueR1parR7), () => 'R7');
  tab('verdict du moteur sur le thème somme', X, d => d.vS);
  tab('verdict du moteur sur le thème principal', X, d => d.vP);
  tab('somme et principal d\'accord', X.filter(d => d.vS === d.vP), d => d.vS); }
// le détail des types de blocage
console.log('\nTypes de blocage des pôles dans le thème somme (tous les matchs) :');
const typ = l => l.length ? [...new Set(l.map(x => x.type))].sort().join('+') : 'libre';
const G = {}; D.forEach(d => { const k = 'R1 ' + typ(d.b1) + ' / R7 ' + typ(d.b7); (G[k] = G[k] || []).push(d); });
Object.keys(G).sort((a, b) => G[b].length - G[a].length).forEach(k => tab(k, G[k]));
// Qui « possède » les blocages : relations de blocage du thème somme (figure posée bloquée par son antagoniste), comptées par front et par boucle des pôles.
console.log('\nQui possède les blocages du thème somme (le côté désigné gagne ?) :');
const fr = g => (g - 1) % 4, P = {}, addP = (k, v, lot) => { P[k] = P[k] || {}; for (const l of ['tous', lot]) { const o = P[k][l] = P[k][l] || [0, 0]; o[1]++; if (v) o[0]++; } };
D.forEach(d => { const S = d.S, b = S.theme.bases, rel = [];
  for (let g = 1; g <= 16; g++) { if (!b.slice(1).includes(g)) continue; M.bloqueurs(S, g, b[g] === g ? g : undefined).forEach(x => rel.push({ bloque: g, par: x.figure })); }
  const f1 = fr(S.R1.figure), f7 = fr(S.R7.figure), ch = (a, c) => a > c ? 'R1' : c > a ? 'R7' : null, nb = f => rel.filter(f).length;
  [['le front qui possède le plus de bloqueurs', ch(nb(x => fr(x.par) === f1), nb(x => fr(x.par) === f7))], ['le front le moins bloqué', ch(nb(x => fr(x.bloque) === f7), nb(x => fr(x.bloque) === f1))],
   ['la boucle qui possède le plus de bloqueurs', f1 % 2 !== f7 % 2 ? ch(nb(x => (x.par - 1) % 2 === (S.R1.figure - 1) % 2), nb(x => (x.par - 1) % 2 === (S.R7.figure - 1) % 2)) : null],
   ['le pôle dont la figure bloque le plus', ch(nb(x => x.par === S.R1.figure), nb(x => x.par === S.R7.figure))]].forEach(([k, w]) => { if (w) addP(k, d.r === w, d.lot); }); });
Object.keys(P).forEach(k => console.log('  ' + k.padEnd(62) + ' juste ' + P[k].tous.join('/') + ' · 126 premiers ' + (P[k].dev || [0, 0]).join('/') + ' · jamais vus ' + (P[k]['jamais vus'] || [0, 0]).join('/')));
// Lecture croisée : les figures des pôles du thème principal, bloquées dans le thème somme.
console.log('\nFigures des pôles du thème principal, bloquées dans le thème somme :');
const C = {}; D.forEach(d => { const L = M.lire(d.m), S = d.S, b = S.theme.bases, bl = g => M.bloqueurs(S, g, b[g] === g ? g : undefined).length > 0, x1 = bl(L.R1.figure), x7 = bl(L.R7.figure);
  const k = x1 && !x7 ? 'seule celle de R1 bloquée' : x7 && !x1 ? 'seule celle de R7 bloquée' : x1 ? 'les deux bloquées' : 'aucune bloquée'; (C[k] = C[k] || []).push(d); });
Object.keys(C).sort().forEach(k => tab(k, C[k]));
// Populus en base du thème somme (propriétaire : « dans le thème somme il y a en général deux ou plus de Populus en base »). Populus posé en Mh rend la figure h,
// qui bloque son adversaire, la figure h + 3 (règle du propriétaire). On regarde quels pôles ces blocages touchent, et de quel côté sont les Populus.
console.log('\nPopulus en base du thème somme :');
const nbP = {}; D.forEach(d => { const k = d.S.theme.bases.slice(1).filter(x => x === 16).length; nbP[k] = (nbP[k] || 0) + 1; });
console.log('  nombre de Populus en base (M1 en a toujours un : M1 + M1) : ' + Object.keys(nbP).map(k => k + ' → ' + nbP[k] + ' matchs').join(', '));
const PP = {}, addPP = (k, d) => { (PP[k] = PP[k] || []).push(d); };
D.forEach(d => { const L = M.lire(d.m), S = d.S, b = S.theme.bases, pops = []; for (let h = 1; h <= 16; h++) if (b[h] === 16) pops.push(h);
  const victimes = pops.map(h => mod(h + 3)), touche = g => victimes.includes(g);
  const v1 = touche(L.R1.figure), v7 = touche(L.R7.figure);
  addPP('Populus bloque la figure d\'un pôle du principal : ' + (v1 && !v7 ? 'seule R1' : v7 && !v1 ? 'seule R7' : v1 ? 'les deux' : 'aucune'), d);
  const s1 = touche(S.R1.figure), s7 = touche(S.R7.figure);
  addPP('Populus bloque la figure d\'un pôle du thème somme : ' + (s1 && !s7 ? 'seule R1' : s7 && !s1 ? 'seule R7' : s1 ? 'les deux' : 'aucune'), d);
  const cote = g => pops.filter(h => (h - 1) % 4 === (g - 1) % 4).length, c1 = cote(L.R1.figure), c7 = cote(L.R7.figure);
  addPP('Populus dans le front de la figure du pôle (principal) : ' + (c1 > c7 ? 'plus chez R1' : c7 > c1 ? 'plus chez R7' : 'autant'), d);
  const camp = g => pops.filter(h => h % 2 === g % 2).length, k1 = camp(L.R1.figure), k7 = camp(L.R7.figure);
  if ((L.R1.figure % 2) !== (L.R7.figure % 2)) addPP('Populus dans la boucle de la figure du pôle (boucles différentes) : ' + (k1 > k7 ? 'plus chez R1' : k7 > k1 ? 'plus chez R7' : 'autant'), d);
  const fv = g => victimes.filter(v => (v - 1) % 4 === (g - 1) % 4).length, w1 = fv(L.R1.figure), w7 = fv(L.R7.figure);
  addPP('front de la figure du pôle (principal) bloqué par les Populus : ' + (w1 > w7 ? 'plus celui de R1' : w7 > w1 ? 'plus celui de R7' : 'autant'), d);
  addPP('nombre de Populus en base : ' + (pops.length >= 4 ? '4 ou plus' : pops.length), d); });
Object.keys(PP).sort().forEach(k => { tab(k, PP[k]); const jv = PP[k].filter(d => d.lot === 'jamais vus'); if (jv.length) tab('   … dont jamais vus', jv); });
