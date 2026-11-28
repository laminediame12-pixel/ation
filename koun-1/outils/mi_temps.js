// Étude des buts de première mi-temps : lit les matchs du corpus qui ont un score de mi-temps (champ mi_temps de validation/scores-reels.json)
// (et de validation/mi-temps.json, matchs sans score final) et donne pour chacun la figure de 1-5-12-15 (bases et résultantes), sa classe, son rythme, sa présence dans le thème ; à partir de 10 matchs,
// crible les 255 combinaisons distinctes de maisons contre « au moins un but en 1re mi-temps » et le nombre de buts en 1re mi-temps. Usage : node outils/mi_temps.js
const fs = require('fs'), path = require('path'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lireJ = f => JSON.parse(fs.readFileSync(path.join(__dirname, '../validation', f), 'utf8'));
const S = lireJ('scores-reels.json').filter(x => Array.isArray(x.mi_temps)).concat(lireJ('mi-temps.json'));
const cls = f => { const n = K.niveaux(f), s = n.filter(v => v === 2).length; return (s === 0 ? 'Via' : s === 4 ? 'Populus' : s === 1 ? 'fermante' : s === 3 ? 'ouvrante' : n[3] === 2 ? 'mobile' : 'fixe') + ', ' + (n[0] === 2 && n[1] === 2 ? 'rapide' : n[0] === 1 && n[1] === 1 ? 'lente' : 'intermédiaire'); };
const lv = f => K.niveaux(f).map((v, i) => 'FAET'[i] + (v === 2 ? '●' : '○')).join('');
console.log(S.length + ' matchs avec mi-temps');
const D = S.map(x => { const T = M.lire(x.themes).theme, fb = [1, 5, 12, 15].map(h => T.bases[h]).reduce(A), fr = [1, 5, 12, 15].map(h => h < 16 ? T.resultantes[h] : T.bases[16]).reduce(A);
  const ou = f => { const r = []; for (let h = 1; h <= 16; h++) { if (T.bases[h] === f) r.push('b' + h); if (h < 16 && T.resultantes[h] === f) r.push('r' + h); } return r.join(' ') || 'absente'; };
  const ht = x.mi_temps[0] + x.mi_temps[1], prem = (x.buts ? [].concat(x.buts.R1 || [], x.buts.R7 || []).map(b => parseInt(b)).filter(n => !isNaN(n)).sort((a, b) => a - b)[0] : null);
  console.log((x.match || x.themes.join('-')).padEnd(28), x.themes.join('-').padEnd(11), 'MT ' + x.mi_temps.join('-'), '1er but ' + (prem === null || prem === undefined ? '?' : prem + "'"), '| bases', nm(fb), lv(fb), '(' + cls(fb) + ')', ou(fb), '| résultantes', nm(fr), '(' + cls(fr) + ')');
  return { T, ht, but: ht > 0 ? 1 : 0 }; });
if (D.length >= 10) {
  const { equivalences } = M, corr = (x, y) => { const n = x.length, mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n; let s = 0, a = 0, b = 0; x.forEach((v, i) => { s += (v - mx) * (y[i] - my); a += (v - mx) ** 2; b += (y[i] - my) ** 2; }); return a && b ? s / Math.sqrt(a * b) : 0; };
  const vus = new Set(), res = [];
  for (let m = 1; m < 65536; m++) { const hs = []; for (let h = 1; h <= 16; h++) if ((m >> (h - 1)) & 1) hs.push(h); if (hs.length > 4) continue; const e = equivalences(hs).minimale.join('+'); if (vus.has(e)) continue; vus.add(e);
    for (let l = 0; l < 4; l++) { const x = D.map(d => K.niveaux(hs.map(h => d.T.bases[h]).reduce(A))[l] === 2 ? 1 : 0); res.push({ c: e, l: 'FAET'[l], rb: corr(x, D.map(d => d.but)), rn: corr(x, D.map(d => d.ht)) }); } }
  res.sort((a, b) => Math.abs(b.rn) - Math.abs(a.rn)); console.log('\ncombinaisons les plus liées au nombre de buts en 1re mi-temps (' + vus.size + ' combinaisons × 4 niveaux) :');
  res.slice(0, 8).forEach(r => console.log('  ' + r.c.padEnd(12) + ' niveau ' + r.l + ' saturé : corrélation buts ' + r.rn.toFixed(2) + ', au moins un but ' + r.rb.toFixed(2)));
  const p = res.filter(r => r.c === equivalences([1, 5, 12, 15]).minimale.join('+')); console.log('1-5-12-15 :', p.map(r => r.l + ' ' + r.rn.toFixed(2)).join(' | '));
} else console.log('\n(criblage des combinaisons à partir de 10 matchs avec mi-temps)');
