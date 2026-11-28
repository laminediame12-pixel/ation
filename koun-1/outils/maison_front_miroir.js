// Règle du propriétaire : un pôle dont la figure est dans sa maison, avec la figure de son front direct (ou de son miroir) aussi dans sa maison, gagne si l'autre ne l'est pas.
// Front direct (liaison Terre) : f ↔ f+4 pour les rangs 1 et 3, f ↔ f−4 pour les rangs 2 et 4. Miroir : f ↔ f ± 8.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), nm = K.nom;
const part = f => { const rk = Math.floor((f - 1) / 4); return rk === 0 || rk === 2 ? f + 4 : f - 4; }, mir = f => f > 8 ? f - 8 : f + 8;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, n) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom: n }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number), 'lot 2');
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, r: Math.sign(d.sc[0] - d.sc[1]), nul: d.sc[0] === d.sc[1] ? 1 : 0 }; });
// « dans sa maison » : en base seulement, ou en base ou en résultante (comme chezElle du moteur)
const chez = { 'base seule': (L, f) => L.theme.bases[f] === f, 'base ou résultante': (L, f) => L.chezElle(f) };
const variantes = {
  'maison + front direct': (c, f) => c(f) && c(part(f)),
  'maison + miroir': (c, f) => c(f) && c(mir(f)),
  'maison + (front direct ou miroir)': (c, f) => c(f) && (c(part(f)) || c(mir(f))),
  'maison seule': (c, f) => c(f),
};
console.log(D.length + ' matchs, ' + D.filter(d => d.nul).length + ' nuls\n');
for (const [cn, cf] of Object.entries(chez)) for (const [vn, vf] of Object.entries(variantes)) {
  let ok = 0, ko = 0, nul = 0, deux = 0, aucun = 0; const ex = [];
  D.forEach(d => { const c = f => cf(d.L, f), a = vf(c, d.L.R1.figure), e = vf(c, d.L.R7.figure); if (a && e) { deux++; return; } if (!a && !e) { aucun++; return; } const v = a ? 1 : -1; if (!d.r) nul++; else if (v === d.r) ok++; else { ko++; ex.push(d.nom + ' ' + d.sc.join('-') + ' (appel ' + (v > 0 ? 'R1' : 'R7') + ')'); } });
  console.log((cn + ' · ' + vn).padEnd(52), 'un seul pôle : justes', ok, 'faux', ko, 'nuls', nul, '| les deux', deux, '| aucun', aucun + (ex.length && ex.length <= 4 ? '\n' + ''.padEnd(54) + 'faux : ' + ex.join(' ; ') : ''));
}
// structure : fréquence sur les 65 536 thèmes
let n = 0; for (let x = 0; x < 65536; x++) { const m = [1 + (x & 15), 1 + ((x >> 4) & 15), 1 + ((x >> 8) & 15), 1 + ((x >> 12) & 15)], L = M.lire(m), c = f => L.chezElle(f), a = c(L.R1.figure) && (c(part(L.R1.figure)) || c(mir(L.R1.figure))), e = c(L.R7.figure) && (c(part(L.R7.figure)) || c(mir(L.R7.figure))); if (a !== e) n++; }
console.log('\nsur les 65 536 thèmes, un seul pôle remplit la condition (base ou résultante, front direct ou miroir) dans', n, 'thèmes (' + (100 * n / 65536).toFixed(1) + ' %)');
// détail des matchs concernés
console.log('\nmatchs où un seul pôle remplit « maison + (front direct ou miroir) », base ou résultante :');
D.forEach(d => { const c = f => d.L.chezElle(f), t = f => c(f) && (c(part(f)) || c(mir(f))), a = t(d.L.R1.figure), e = t(d.L.R7.figure); if (a === e) return; const p = a ? d.L.R1 : d.L.R7, f = p.figure; console.log('   ', (d.nom || '').padEnd(34), d.m.join('-').padEnd(11), d.sc.join('-').padEnd(5), (a ? 'R1 ' : 'R7 ') + nm(f) + ' chez elle' + (c(part(f)) ? ', front direct ' + nm(part(f)) + ' chez elle' : '') + (c(mir(f)) ? ', miroir ' + nm(mir(f)) + ' chez elle' : ''), '→', d.r === (a ? 1 : -1) ? 'GAGNE' : d.r === 0 ? 'nul' : 'perd'); });
