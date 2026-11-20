// Règle R-RESEAU-1 (figée avant les chiffres, voir validation/regle-reseau-1.json) : le camp (front du pôle + son front binôme) qui a le plus de liaisons connectées non coupées l'emporte ; égalité : nul.
// Usage : node outils/evaluer_reseau.js [--detail]
const fs = require('fs'), path = require('path');
const K = require('../moteur3/moteur.js');
const J = require('../moteur3/cartographie.json'), F = J.figures;
const P = n => F[n - 1].niveaux, niv = (a, b) => (a + b) % 2 === 0 ? 2 : 1;
const add = (a, b) => F.findIndex(f => f.niveaux.join() === P(a).map((x, i) => niv(x, P(b)[i])).join()) + 1;
const ant = h => ((h - 4) % 16 + 16) % 16 + 1;                    // n − 3
const FR = ['A', 'B', 'C', 'D'];

// Liaisons vivantes d'un front. variante 'proprietaire' : un nœud est un arrêt si la maison porte en base son antagoniste (base = h − 3) ;
// variante 'moteur' : un nœud est un arrêt si la figure en base est dans la maison de son antagoniste (maison = base − 3, enMaisonAntagoniste du moteur).
function vivantes(base, z, variante) {
  const res = h => add(base[h], h), stop = h => variante === 'moteur' ? h === ant(base[h]) : base[h] === ant(h);
  const T = z + 1, R = z + 5, B = z + 9, Lf = z + 13;
  let vives = 0, coupees = 0;
  for (let l = 0; l < 4; l++) {
    const vert = P(res(T))[l] === 2 && P(res(B))[l] === 2, hor = P(res(Lf))[l] === 2 && P(res(R))[l] === 2;
    [[vert, [0, 1, 2, 3].map(i => 4 * l + i + 1)], [hor, [0, 1, 2, 3].map(j => 4 * j + l + 1)]].forEach(([c, hs]) => {
      if (!c) return; const noeuds = hs.filter(h => h !== 16);
      if (noeuds.some(stop)) coupees++; else vives++; });
  }
  return { vives, coupees };
}
function lecture(themes, variante) {
  const L = K.lire(K.construireTheme(...themes.map(K.fig))), base = {};
  L.maisons.forEach(m => { base[m.maison] = K.num(m.base); });
  const camp = lettre => { const z = FR.indexOf(lettre); return vivantes(base, z, variante).vives + vivantes(base, (z + 2) % 4, variante).vives; };
  const c1 = camp(L.R1.front), c7 = camp(L.R7.front);
  return { c1, c7, issue: c1 > c7 ? '1' : c1 < c7 ? '2' : 'N', verdictMoteur: K.analyser(K.construireTheme(...themes.map(K.fig))).verdict.verdict };
}

// ── Données : les 18 thèmes de travail (liste figée) et les 9 matchs documentés ; le thème 8-5-11-7 (qui a servi à formuler la règle) est écarté.
const V = path.join(__dirname, '..', 'validation');
const sc = JSON.parse(fs.readFileSync(path.join(V, 'scores-reels.json'), 'utf8')), l18 = JSON.parse(fs.readFileSync(path.join(V, 'themes-18.json'), 'utf8')).map(x => x.match);
const docs = JSON.parse(fs.readFileSync(path.join(V, 'themes-documentes.json'), 'utf8')).matchs;
const data = [];
sc.filter(e => l18.includes(e.match)).forEach(e => data.push({ nom: e.match, th: e.themes, a: e.score[0], b: e.score[1] }));
docs.forEach(d => { const [a, b] = d.reel.score.split('-').map(Number); data.push({ nom: d.equipe1 + ' – ' + d.equipe2, th: d.theme.split('-').map(Number), a, b }); });
const utiles = data.filter(d => d.th.join('-') !== '8-5-11-7');

const reel = d => d.a > d.b ? '1' : d.a < d.b ? '2' : 'N';
function bilan(variante) {
  const rows = utiles.map(d => ({ d, ...lecture(d.th, variante) })); const M = { '1': { '1': 0, 'N': 0, '2': 0 }, 'N': { '1': 0, 'N': 0, '2': 0 }, '2': { '1': 0, 'N': 0, '2': 0 } };
  rows.forEach(r => { M[reel(r.d)][r.issue]++; });
  const ok = rows.filter(r => r.issue === reel(r.d)).length, okMot = rows.filter(r => r.verdictMoteur === reel(r.d)).length, toujours1 = rows.filter(r => reel(r.d) === '1').length;
  const egal = rows.filter(r => r.issue === 'N').length;
  return { rows, M, ok, n: rows.length, okMot, toujours1, egal };
}
const wilson = (k, n) => { const z = 1.96, p = k / n, d = 1 + z * z / n, c = p + z * z / (2 * n), r = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)); return [((c - r) / d * 100).toFixed(0), ((c + r) / d * 100).toFixed(0)]; };
['proprietaire', 'moteur'].forEach(v => {
  const b = bilan(v), w = wilson(b.ok, b.n);
  console.log('\n=== Règle R-RESEAU-1, variante « ' + v + ' »' + (v === 'proprietaire' ? ' (principale)' : ' (secondaire)') + ' — ' + b.n + ' thèmes ===');
  console.log('Issue juste (victoire R1 / nul / victoire R7) :', b.ok + '/' + b.n, '(' + (100 * b.ok / b.n).toFixed(0) + ' %, Wilson 95 % ' + w[0] + ' à ' + w[1] + ' %)');
  console.log('Témoins : toujours « victoire R1 » ' + b.toujours1 + '/' + b.n + ' ; verdict du moteur ' + b.okMot + '/' + b.n + ' ; égalités annoncées par la règle : ' + b.egal + '/' + b.n);
  console.log('Matrice (lignes : réel ; colonnes : annoncé 1 / nul / 2) :');
  ['1', 'N', '2'].forEach(r => console.log('  réel ' + (r === 'N' ? 'nul' : 'R' + r) + ' : ' + ['1', 'N', '2'].map(c => b.M[r][c]).join(' / ')));
  if (process.argv.includes('--detail')) b.rows.forEach(r => console.log('   ' + r.d.th.join('-').padEnd(12) + (r.d.a + '-' + r.d.b).padEnd(6) + 'camp R1 ' + r.c1 + ' · camp R7 ' + r.c7 + ' → ' + r.issue + ' (réel ' + reel(r.d) + ', moteur ' + r.verdictMoteur + ')  ' + r.d.nom));
});
