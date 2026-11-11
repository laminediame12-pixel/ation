// Structure des résultantes des 11 thèmes réels, comparée au thème au repos (où toutes les résultantes sont Populus).
const K = require('../moteur2/moteur.js');
const REFS = require('./refs154.json');
const ATT = { NUL_REFERENCE_1: 'N', NUL_REFERENCE_2: 'N', NUL_REFERENCE_3: 'N', NUL_REFERENCE_4: 'N', NUL_REFERENCE_5: 'N', NUL_REFERENCE_6: 'N', VICTOIRE_REFERENCE_1: '2', VICTOIRE_REFERENCE_2: '2', VICTOIRE_REFERENCE_3: '1', VICTOIRE_REFERENCE_4: '1', AZ_VILLARREAL: '1' };
const PTS = { 'Puer': [1, 1, 2, 1], 'Laetitia': [1, 2, 2, 2], 'Caput': [2, 1, 1, 1], 'Albus': [2, 2, 1, 2], 'Via': [1, 1, 1, 1], 'Amissio': [1, 2, 1, 2], 'Rubeus': [2, 1, 2, 2], 'Tristitia': [2, 2, 2, 1], 'Fortuna Minor': [1, 1, 2, 2], 'Carcer': [1, 2, 2, 1], 'Conjunctio': [2, 1, 1, 2], 'Fortuna Major': [2, 2, 1, 1], 'Cauda Draconis': [1, 1, 1, 2], 'Puella': [1, 2, 1, 1], 'Aquisitio': [2, 1, 2, 1], 'Populus': [2, 2, 2, 2] };
const ecart = f => PTS[f].filter(x => x === 1).length;      // distance à Populus : nombre de lignes impaires (0 = Populus, 4 = Via)
const court = id => id.replace('_REFERENCE', '').replace('VICTOIRE', 'V').replace('NUL', 'N').replace('AZ_VILLARREAL', 'AZ');
const lignes = [];
for (const x of REFS) {
  const L = K.analyser(K.construireTheme(...x.c.mothers)).lecture, res = L.maisons.filter(m => m.resultante).map(m => ({ h: m.maison, f: m.resultante, base: m.base }));
  const par = k => res.filter(r => K.frontDe(r.f) === L[k].front);
  const boucle = k => res.filter(r => (K.num(r.f) % 2) === (K.num(L[k].figure) % 2));
  const o = { id: court(x.id), att: ATT[x.id], memeFront: L.R1.front === L.R7.front,
    populus: res.filter(r => r.f === 'Populus').map(r => 'M' + r.h),
    ecartTotal: res.reduce((t, r) => t + ecart(r.f), 0),
    distinctes: new Set(res.map(r => r.f)).size,
    frontR1: par('R1').length, frontR7: par('R7').length, boucleR1: boucle('R1').length, boucleR7: boucle('R7').length,
    poleR1: res.filter(r => r.f === L.R1.figure).map(r => 'M' + r.h), poleR7: res.filter(r => r.f === L.R7.figure).map(r => 'M' + r.h),
    resMaisonR1: L.maisons[L.R1.maison - 1].resultante, resMaisonR7: L.maisons[L.R7.maison - 1].resultante,
    ecartR1: par('R1').reduce((t, r) => t + ecart(r.f), 0), ecartR7: par('R7').reduce((t, r) => t + ecart(r.f), 0),
    antR1: res.filter(r => r.f === L.R1.antagoniste).length, antR7: res.filter(r => r.f === L.R7.antagoniste).length,
    L };
  lignes.push(o);
}
console.log('Thème au repos : 15 résultantes Populus, écart total 0.\n');
for (const o of lignes) console.log(o.id.padEnd(5), o.att, '| Populus:', (o.populus.join(',') || '—').padEnd(8), '| écart total', String(o.ecartTotal).padStart(2), '| distinctes', String(o.distinctes).padStart(2),
  '| rés. du front R1/R7:', o.frontR1 + '/' + o.frontR7, '| de la boucle R1/R7:', o.boucleR1 + '/' + o.boucleR7, '| pôle en rés. R1:', (o.poleR1.join(',') || '—').padEnd(10), 'R7:', (o.poleR7.join(',') || '—').padEnd(10),
  '| rés. maison du pôle R1:', o.resMaisonR1, '· R7:', o.resMaisonR7, '| antagoniste en rés. R1/R7:', o.antR1 + '/' + o.antR7);
// lecture « plus grand = gagne » pour quelques mesures, sur les matchs où les pôles ne sont pas du même front
const mes = { 'résultantes du front du pôle': o => [o.frontR1, o.frontR7], 'résultantes de la boucle du pôle': o => [o.boucleR1, o.boucleR7], 'pôle présent en résultante (nombre)': o => [o.poleR1.length, o.poleR7.length],
  'antagoniste du pôle en résultante (moins = mieux)': o => [-o.antR1, -o.antR7], 'écart des résultantes du front': o => [o.ecartR1, o.ecartR7] };
console.log('');
for (const [nom, fn] of Object.entries(mes)) { const d = lignes.filter(o => !o.memeFront).map(o => { const [a, b] = fn(o), v = a > b ? '1' : b > a ? '2' : 'N'; return o.id + ':' + (v === o.att ? '✓' : '✗'); });
  console.log(nom.padEnd(48), d.filter(x => x.endsWith('✓')).length + '/' + d.length, d.join(' ')); }
