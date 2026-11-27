// Structure en 4 pas d'une ligne de la matrice lue de M16 vers M1 (demande du propriétaire, 2026-11-27, ligne de Puer), puis généralisation à toutes les lignes.
const K = require('../moteur3/noyau.js'), N = K.nom, FR = 'ABCD', fr = f => (f - 1) % 4;
const ligne = g => { const l = []; for (let h = 16; h >= 1; h--) l.push({ h, r: K.additionner(g, h) }); return l; };
const affiche = g => { const l = ligne(g); console.log('ligne de ' + N(g) + ' (front ' + FR[fr(g)] + '), de M16 vers M1 :');
  for (let k = 0; k < 4; k++) { const bloc = l.slice(4 * k, 4 * k + 4); console.log('  pas ' + (k + 1) + ' (M' + bloc[0].h + '→M' + bloc[3].h + ') : ' + bloc.map(x => N(x.r) + ' [' + FR[fr(x.r)] + ', ' + x.r + ']').join(' · ')); } };
affiche(1);
// lois générales
let ok1 = 0, ok2 = 0, ok3 = 0; const ordres = {}, debuts = {};
for (let g = 1; g <= 16; g++) { const l = ligne(g), blocs = [0, 1, 2, 3].map(k => l.slice(4 * k, 4 * k + 4));
  if (blocs.every(b => new Set(b.map(x => fr(x.r))).size === 4)) ok1++;                       // chaque pas contient les quatre fronts
  const o = blocs.map(b => b.map(x => FR[fr(x.r)]).join('')); if (new Set(o).size === 1) { ok2++; (ordres[o[0]] = ordres[o[0]] || []).push(N(g)); } // même ordre des fronts à chaque pas
  const d = blocs.map(b => b[0].r); if (new Set(d.map(fr)).size === 1) { ok3++; debuts[N(g)] = d.map(N).join(' → '); } }       // les têtes des pas restent dans un même front
console.log('\nsur les 16 lignes (lues de M16 vers M1) :');
console.log('  chaque pas de 4 maisons contient une figure de chaque front : ' + ok1 + '/16');
console.log('  le même ordre des fronts se répète à chaque pas : ' + ok2 + '/16 → ' + Object.entries(ordres).map(([o, l]) => o + ' pour ' + l.join(', ')).join(' ; '));
console.log('  les têtes des quatre pas (M16, M12, M8, M4) parcourent le front de la figure : ' + ok3 + '/16');
Object.entries(debuts).slice(0, 4).forEach(([g, d]) => console.log('     ' + g.padEnd(15) + d));
// paires de figures consécutives dans la ligne de Puer
const lp = ligne(1).map(x => x.r); console.log('\nligne de Puer, par paires : ' + [0, 2, 4, 6, 8, 10, 12, 14].map(i => '(' + lp[i] + ',' + lp[i + 1] + ')').join(' ') + ' — têtes de paires ' + [0, 2, 4, 6, 8, 10, 12, 14].map(i => lp[i]).join(', '));
