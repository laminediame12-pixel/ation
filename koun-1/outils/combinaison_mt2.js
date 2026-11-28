// Buts de 2e mi-temps : combinaison 5-7-12-15 comparée à 4-5-13-15 (et à toutes les combinaisons de 4 maisons pour situer le hasard).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const C1 = [1, 2, 3, 4, 9, 10, 13, 15], C7 = [5, 6, 7, 8, 11, 12, 14, 16], fr = n => (n - 1) % 4;
const cls = f => { const n = K.niveaux(f), s = n.filter(v => v === 2).length; return s === 0 ? 'tout ouverte' : s === 4 ? 'toute fermée' : s === 1 ? 'fermante' : s === 3 ? 'ouvrante' : n[3] === 2 ? 'mobile' : 'fixe'; };
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const vu = new Set(), D = [];
lire('validation/scores-reels.json').forEach(x => { const t = x.themes; if (!Array.isArray(x.mi_temps) || !Array.isArray(x.score)) return; const k = t.join('-'); if (vu.has(k)) return; vu.add(k); const L = M.lire(t); D.push({ n: x.match, L, ht: x.mi_temps, g2: [x.score[0] - x.mi_temps[0], x.score[1] - x.mi_temps[1]] }); });
console.log(D.length + ' matchs avec mi-temps et score final ; 2e mi-temps : une équipe marque ' + D.reduce((a, d) => a + (d.g2[0] > 0) + (d.g2[1] > 0), 0) + ' fois sur ' + 2 * D.length + ', aucun but dans ' + D.filter(d => !d.g2[0] && !d.g2[1]).length + ' matchs\n');
function lectures(d, combo) {
  const T = d.L.theme, b = T.bases, f = combo.map(h => b[h]).reduce(A), pos = []; for (let h = 1; h <= 16; h++) if (b[h] === f) pos.push(h);
  const c1 = pos.some(h => C1.includes(h)), c7 = pos.some(h => C7.includes(h)), cote = c1 && !c7 ? 0 : c7 && !c1 ? 1 : null;
  // lecture des côtés : fixe → ce côté encaisse (l'autre marque) ; sinon → ce côté marque
  const cotes = cote === null ? null : (cls(f) === 'fixe' ? 1 - cote : cote); // indice de l'équipe qui doit marquer
  // lecture de l'ancrage : la figure ou son protecteur posé dans le front d'un pôle → ce pôle marque
  const p = ((f - 7) % 16 + 16) % 16 + 1, fz = c => [0, 1, 2, 3].map(i => fr(c.figure) + 1 + 4 * i), anc = [d.L.R1, d.L.R7].map(c => fz(c).some(h => b[h] === f || b[h] === p));
  return { f, pos, cotes, anc };
}
function juge(combo) {
  const o = { cotes: [0, 0], ancre: [0, 0] }; D.forEach(d => { const x = lectures(d, combo); if (x.cotes !== null) { o.cotes[1]++; if (d.g2[x.cotes] > 0) o.cotes[0]++; } x.anc.forEach((a, i) => { if (a) { o.ancre[1]++; if (d.g2[i] > 0) o.ancre[0]++; } }); }); return o;
}
for (const combo of [[5, 7, 12, 15], [4, 5, 13, 15], [1, 5, 12, 15]]) { const o = juge(combo); console.log(combo.join('-').padEnd(10), '· lecture des côtés : l\'équipe désignée marque en 2e mi-temps', o.cotes[0], 'fois sur', o.cotes[1], '· lecture de l\'ancrage :', o.ancre[0], 'sur', o.ancre[1]); }
console.log('\ndétail 5-7-12-15 :');
D.forEach(d => { const x = lectures(d, [5, 7, 12, 15]); console.log('   ', (d.n || '').padEnd(30), '2e MT', d.g2.join('-').padEnd(4), '|', nm(x.f).padEnd(14), '(' + cls(x.f) + ')', x.pos.length ? 'en M' + x.pos.join(', M') : 'absente', '→', x.cotes === null ? 'pas d\'appel' : (x.cotes === 0 ? 'R1' : 'R7') + ' marque : ' + (d.g2[x.cotes] > 0 ? 'OUI' : 'non')); });
// où se situe 5-7-12-15 parmi toutes les combinaisons de 4 maisons (lecture des côtés, au moins 8 appels)
const tout = []; for (let a = 1; a <= 16; a++) for (let b2 = a + 1; b2 <= 16; b2++) for (let c = b2 + 1; c <= 16; c++) for (let e = c + 1; e <= 16; e++) { const o = juge([a, b2, c, e]); if (o.cotes[1] >= 8) tout.push({ k: [a, b2, c, e].join('-'), ok: o.cotes[0], n: o.cotes[1], r: o.cotes[0] / o.cotes[1] }); }
tout.sort((x, y) => y.r - x.r || y.n - x.n); const rang = tout.findIndex(t => t.k === '5-7-12-15') + 1;
console.log('\nparmi', tout.length, 'combinaisons de 4 maisons (au moins 8 appels), 5-7-12-15 est classée', rang || '(moins de 8 appels)', '; meilleures :', tout.slice(0, 5).map(t => t.k + ' ' + t.ok + '/' + t.n).join(' · '));
