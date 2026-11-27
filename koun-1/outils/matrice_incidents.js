// Matrice des 256 combinaisons et incidents (2026-11-27) : chaque thème étiqueté (penalty / rouge connus) occupe 16 cases (figure de base g × maison h).
// 1. Lois de la matrice comptées par thème (relation des fronts base/maison, placements remarquables, activité des résultantes), comparées entre matchs
//    avec et sans rouge, avec et sans penalty, contrôle par permutation. 2. Cases les plus liées à chaque incident. 3. Page HTML (cartes de chaleur + thèmes).
// Usage : node outils/matrice_incidents.js [chemin.html]
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = s => s.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, sat = f => K.niveaux(f).filter(v => v === 2).length;
D.forEach(d => { d.L = M.lire(d.m); d.b = d.L.theme.bases; d.r = oui(d.rouge) ? 1 : 0; d.p = oui(d.pen) ? 1 : 0;
  const c = d.cells = []; for (let h = 1; h <= 16; h++) c.push([d.b[h], h]);
  const H = d.b.slice(1, 16).map((g, i) => [g, i + 1]), X = ([g, h]) => K.additionner(g, h), lois = d.lois = {};
  lois['même front (base et maison)'] = H.filter(([g, h]) => fr(g) === fr(h)).length;
  lois['fronts alliés'] = H.filter(([g, h]) => fr(g) !== fr(h) && ATT[fr(g)] !== fr(h) && ATT[fr(h)] !== fr(g)).length;
  lois['la base attaque la maison'] = H.filter(([g, h]) => ATT[fr(g)] === fr(h)).length;
  lois['la maison attaque la base'] = H.filter(([g, h]) => ATT[fr(h)] === fr(g)).length;
  lois['chez elle (→ Populus)'] = H.filter(([g, h]) => g === h).length;
  lois['dans la maison de son miroir (→ Tristitia)'] = H.filter(([g, h]) => mod(g + 8) === h).length;
  lois['dans la maison de son front direct ±4'] = H.filter(([g, h]) => mod(g + 4) === h || mod(g - 4) === h).length;
  lois['arrêt (g en maison g+3)'] = H.filter(([g, h]) => mod(g + 3) === h).length;
  lois['dans la maison de son antagoniste (g en g−3)'] = H.filter(([g, h]) => mod(g - 3) === h).length;
  lois['dans la maison de son protecteur (g en g−6)'] = H.filter(([g, h]) => mod(g - 6) === h).length;
  lois['résultante inactive (Via)'] = H.filter(c => X(c) === 5).length;
  lois['résultante pleine (Populus)'] = H.filter(c => X(c) === 16).length;
  lois['résultante Carcer'] = H.filter(c => X(c) === 10).length;
  lois['résultante Rubeus'] = H.filter(c => X(c) === 7).length;
  lois['activité totale (niveaux saturés)'] = H.reduce((s, c) => s + sat(X(c)), 0);
  lois['Terre saturée en résultante'] = H.filter(c => K.niveaux(X(c))[3] === 2).length;
  lois['Feu saturé en résultante'] = H.filter(c => K.niveaux(X(c))[0] === 2).length;
  lois['Air saturé en résultante'] = H.filter(c => K.niveaux(X(c))[1] === 2).length;
  lois['Eau saturée en résultante'] = H.filter(c => K.niveaux(X(c))[2] === 2).length;
  lois['ruptures 6-7 et 14-15 (même Terre)'] = (K.niveaux(X(H[5]))[3] === K.niveaux(X(H[6]))[3] ? 1 : 0) + (K.niveaux(X(H[13]))[3] === K.niveaux(X(H[14]))[3] ? 1 : 0);
  lois['réactions 1+1 (niveaux activés)'] = H.reduce((s, [g, h]) => s + [0, 1, 2, 3].filter(l => K.niveaux(g)[l] === 1 && K.niveaux(h)[l] === 1).length, 0);
  lois['placements sans réaction (figure intacte)'] = H.filter(([g, h]) => g !== 16 && ![0, 1, 2, 3].some(l => K.niveaux(g)[l] === 1 && K.niveaux(h)[l] === 1)).length; });
const moy = a => a.reduce((s, x) => s + x, 0) / (a.length || 1), perm = (y, f, T = 2000) => { const real = Math.abs(f(y)); let k = 0; for (let t = 0; t < T; t++) { const z = y.slice().sort(() => Math.random() - 0.5); if (Math.abs(f(z)) >= real) k++; } return k / T; };
const out = { lois: {}, cases: {} };
for (const [cible, lab] of [['r', 'rouge'], ['p', 'penalty']]) { const y = D.map(d => d[cible]), n1 = y.reduce((a, b) => a + b, 0);
  console.log('\n' + lab.toUpperCase() + ' : ' + n1 + ' matchs sur ' + D.length + '\n  loi de la matrice (par thème, M1–M15)'.padEnd(58) + 'avec  sans   écart   p');
  const rows = Object.keys(D[0].lois).map(k => { const v = D.map(d => d.lois[k]), f = z => moy(v.filter((_, i) => z[i])) - moy(v.filter((_, i) => !z[i])); return { k, a: moy(v.filter((_, i) => y[i])), s: moy(v.filter((_, i) => !y[i])), e: f(y), p: perm(y, f) }; }).sort((a, b) => a.p - b.p);
  rows.forEach(o => console.log('  ' + o.k.padEnd(52) + o.a.toFixed(2).padStart(5) + o.s.toFixed(2).padStart(6) + (o.e > 0 ? ' +' : ' ') + o.e.toFixed(2).padStart(5) + '  ' + o.p.toFixed(3)));
  out.lois[lab] = rows;
  // cases
  const C = {}; D.forEach(d => d.cells.forEach(([g, h]) => { const k = g + '|' + h; C[k] = C[k] || [0, 0]; C[k][0] += d[cible]; C[k][1]++; }));
  out.cases[lab] = C; const base = n1 / D.length;
  const top = Object.entries(C).filter(([, [a, n]]) => n >= 4).map(([k, [a, n]]) => ({ k, a, n, t: a / n })).sort((x, z) => z.t - x.t || z.n - x.n).slice(0, 8);
  console.log('  cases les plus liées (au moins 4 thèmes ; moyenne ' + Math.round(100 * base) + ' %) : ' + top.map(o => { const [g, h] = o.k.split('|'); return N(+g) + ' en M' + h + ' ' + o.a + '/' + o.n; }).join(' · ')); }
// page
const fichier = process.argv[2]; if (fichier) {
  const cell = (C, g, h, base) => { const v = C[g + '|' + h]; if (!v) return '<td class="v"></td>'; const [a, n] = v, t = a / n, d = t - base, al = Math.min(1, Math.abs(d) * 2.2) * Math.min(1, n / 4);
    const bg = d > 0 ? 'rgba(220,38,38,' + al.toFixed(2) + ')' : 'rgba(37,99,235,' + al.toFixed(2) + ')'; return '<td style="background:' + bg + '" title="' + N(g) + ' en M' + h + ' → ' + N(K.additionner(g, h)) + ' : ' + a + '/' + n + ' thèmes">' + a + '/' + n + '</td>'; };
  const carte = lab => { const C = out.cases[lab], base = D.filter(d => d[lab === 'rouge' ? 'r' : 'p']).length / D.length; let t = '<table class="mx"><tr><th>base ↓ · maison →</th>' + [...Array(16)].map((_, i) => '<th>M' + (i + 1) + '</th>').join('') + '</tr>';
    for (let g = 1; g <= 16; g++) { t += '<tr><th class="l">' + g + ' ' + N(g) + '</th>'; for (let h = 1; h <= 16; h++) t += cell(C, g, h, base); t += '</tr>'; } return t + '</table>'; };
  const loisT = lab => '<table class="lt"><tr><th>Loi de la matrice (par thème)</th><th>avec ' + lab + '</th><th>sans</th><th>écart</th><th>p</th></tr>' + out.lois[lab].map(o => '<tr class="' + (o.p < 0.05 ? 'sig' : '') + '"><td>' + o.k + '</td><td>' + o.a.toFixed(2) + '</td><td>' + o.s.toFixed(2) + '</td><td>' + (o.e > 0 ? '+' : '') + o.e.toFixed(2) + '</td><td>' + o.p.toFixed(3) + '</td></tr>').join('') + '</table>';
  const liste = D.map(d => '<tr><td>' + d.nom + '</td><td>' + d.m.join('-') + '</td><td>' + (d.p ? '⚽ ' + d.pen : '—') + '</td><td>' + (d.r ? '🟥 ' + d.rouge : '—') + '</td></tr>').join('');
  const html = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Matrice et incidents</title><style>:root{--bg:#faf9f6;--fg:#1f2937;--mu:#6b7280;--ln:#e5e7eb}@media (prefers-color-scheme:dark){:root{--bg:#111318;--fg:#e5e7eb;--mu:#9ca3af;--ln:#2a2f3a}}body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif}h1{font-size:20px}h2{font-size:16px;margin-top:28px}.s{color:var(--mu)}.w{overflow-x:auto}table{border-collapse:collapse}.mx td,.mx th{border:1px solid var(--ln);padding:2px 4px;font-size:10px;text-align:center;min-width:26px}.mx th.l{text-align:left;white-space:nowrap}.mx td.v{background:transparent}.lt td,.lt th,.li td,.li th{border-bottom:1px solid var(--ln);padding:4px 8px;text-align:left;font-size:13px}.sig td{font-weight:700}</style></head><body>'
    + '<h1>Matrice des 256 combinaisons et incidents</h1><p class="s">' + D.length + ' matchs dont on connaît le penalty et le rouge. Chaque thème occupe 16 cases (figure de base × maison). Case : nombre de thèmes avec l\'incident / thèmes qui occupent cette case. <span style="color:#dc2626">Rouge</span> = plus d\'incidents que la moyenne, <span style="color:#2563eb">bleu</span> = moins ; intensité réduite sous 4 thèmes. Lois : moyenne par thème ; p = part des tirages au hasard (2000) qui font un écart au moins aussi grand (en gras : p &lt; 0,05).</p>'
    + '<h2>Rouge</h2>' + loisT('rouge') + '<div class="w">' + carte('rouge') + '</div><h2>Penalty</h2>' + loisT('penalty') + '<div class="w">' + carte('penalty') + '</div><h2>Thèmes</h2><div class="w"><table class="li"><tr><th>Match</th><th>Thème</th><th>Penalty</th><th>Rouge</th></tr>' + liste + '</table></div></body></html>';
  fs.writeFileSync(fichier, html); console.log('\npage : ' + fichier); }
