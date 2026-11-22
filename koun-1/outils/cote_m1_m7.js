// Règle du propriétaire : l'emplacement de la figure concernée compte. Côté M1 = M1, M2, M3, M4, M9, M10, M13, M15 ; côté M7 = M5, M6, M7, M8, M11, M12, M14, M16.
// La figure-somme posée du côté M1 : l'équipe 1 (R1) encaisse ; du côté M7 : l'équipe 2 (R7) encaisse.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const C1 = [1, 2, 3, 4, 9, 10, 13, 15], C7 = [5, 6, 7, 8, 11, 12, 14, 16];
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const vu = new Set(), D = [];
lire('validation/scores-reels.json').concat(lire('validation/mi-temps.json')).forEach(x => { const t = x.themes; if (!t || !Array.isArray(x.mi_temps)) return; const k = t.join('-'); if (vu.has(k)) return; vu.add(k); D.push({ m: t, ht: x.mi_temps, ft: Array.isArray(x.score) ? x.score : null, n: x.match }); });
console.log(D.length + ' matchs avec la mi-temps (' + D.filter(d => d.ft).length + ' avec le score final)\n');
function lecture(d, combo, src) {
  const L = M.lire(d.m), T = L.theme, f = combo.map(h => T.bases[h]).reduce(A), get = h => src === 'base' ? T.bases[h] : src === 'résultante' ? (h < 16 ? T.resultantes[h] : T.bases[16]) : null;
  const pos = []; for (let h = 1; h <= 16; h++) if (src === 'base ou résultante' ? (T.bases[h] === f || (h < 16 ? T.resultantes[h] : T.bases[16]) === f) : get(h) === f) pos.push(h);
  const n1 = pos.filter(h => C1.includes(h)).length, n7 = pos.filter(h => C7.includes(h)).length;
  return { f, pos, n1, n7, encaisse: n1 && !n7 ? 'R1' : n7 && !n1 ? 'R7' : n1 && n7 ? 'les deux' : 'aucun' };
}
for (const [lab, combo, periode] of [['1-5-12-15 → 1re mi-temps', [1, 5, 12, 15], 'ht'], ['4-5-13-15 → 2e mi-temps', [4, 5, 13, 15], 'mt2']]) {
  for (const src of ['base', 'base ou résultante']) {
    const t = {}; let ok = 0, ko = 0, okE = 0, koE = 0;
    D.forEach(d => { if (periode === 'mt2' && !d.ft) return; const g = periode === 'ht' ? d.ht : [d.ft[0] - d.ht[0], d.ft[1] - d.ht[1]]; const x = lecture(d, combo, src);
      const k = x.encaisse; t[k] = t[k] || { n: 0, r1enc: 0, r7enc: 0, rien: 0 }; t[k].n++; if (g[1] > 0) t[k].r1enc++; if (g[0] > 0) t[k].r7enc++; if (!g[0] && !g[1]) t[k].rien++;
      if (k === 'R1' || k === 'R7') { const enc = k === 'R1' ? g[1] : g[0], autre = k === 'R1' ? g[0] : g[1]; if (enc > 0) ok++; else ko++; if (enc > autre) okE++; else if (enc < autre) koE++; } });
    console.log(lab + ' · figure cherchée en ' + src);
    Object.keys(t).forEach(k => console.log('    figure du côté ' + (k === 'R1' ? 'M1 seul (R1 doit encaisser)' : k === 'R7' ? 'M7 seul (R7 doit encaisser)' : k === 'les deux' ? 'M1 et M7' : '— absente').padEnd(30), 'n', String(t[k].n).padStart(2), '| R1 encaisse', t[k].r1enc, '| R7 encaisse', t[k].r7enc, '| aucun but', t[k].rien));
    console.log('    côté désigné : il encaisse au moins un but', ok, 'fois sur', ok + ko, '; il encaisse plus que l\'autre', okE, 'fois, moins', koE, 'fois\n');
  }
}
// taux de base
let b1 = 0; D.forEach(d => { b1 += (d.ht[0] > 0) + (d.ht[1] > 0); }); console.log('taux de base : une équipe encaisse en 1re mi-temps', b1, 'fois sur', 2 * D.length);
// détail 1re mi-temps
console.log('\ndétail (1-5-12-15, base) :'); D.forEach(d => { const x = lecture(d, [1, 5, 12, 15], 'base'); if (x.encaisse !== 'R1' && x.encaisse !== 'R7') return; const enc = x.encaisse === 'R1' ? d.ht[1] : d.ht[0]; console.log('   ', (d.n || d.m.join('-')).padEnd(32), 'mi-temps', d.ht.join('-'), '|', nm(x.f), 'en M' + x.pos.join(', M'), '→ ' + x.encaisse + ' doit encaisser :', enc > 0 ? 'OUI' : 'non'); });
