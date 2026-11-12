// Lecture d'un thème par le moteur 2. Usage : node lire_theme.js 2 12 4 4
const K = require('../moteur2/moteur.js');
const m = process.argv.slice(2, 6).map(n => K.FIG[n - 1]), th = K.construireTheme(...m), a = K.analyser(th), L = a.lecture;
const lab = f => K.num(f) + ' ' + f + ' (' + K.frontDe(f) + '·' + K.CARDINAL[K.num(f)] + ')';
const pos = f => L.positions(f).map(p => 'M' + p.maison + (p.couche === 'base' ? 'b' : 'r') + ' ' + (p.force === null ? 'nc' : p.force + '%')).join(', ') || 'absente';
console.log('mères', m.join(', '));
console.log('R1 M' + L.R1.maison, lab(L.R1.figure), '| R7 M' + L.R7.maison, lab(L.R7.figure));
for (const x of L.maisons) console.log('M' + x.maison, K.elementMaison(x.maison), '|', lab(x.base), (L.force(x.base, x.maison) ?? 'nc') + '%', '→', x.resultante ? lab(x.resultante) + ' ' + (L.force(x.resultante, x.maison) ?? 'nc') + '%' : '—');
for (const c of K.CAS) { const r = c.condition(L); console.log(c.id, r ? r.verdict + ' · ' + r.raison : '—'); }
console.log('DÉCISION', a.decision.verdict, a.decision.phase, '|', a.decision.raison);
for (const k of ['R1', 'R7']) { const c = L[k]; console.log(k, 'front:', c.frontDirect.map(f => f + ' [' + pos(f) + ']').join(' · '), '\n   antagoniste', c.antagoniste, '[' + pos(c.antagoniste) + '] | contrôleur', c.controleur, '[' + pos(c.controleur) + ']'); }
console.log('R1 attaque R7:', K.num(L.R7.figure) === K.num(K.fig(K.num(L.R1.figure) + 3)), '| R7 attaque R1:', K.num(L.R1.figure) === K.num(K.fig(K.num(L.R7.figure) + 3)));
console.log('au repos:', K.FIG.filter(f => L.chezElle(f)).map(f => f + ' M' + K.num(f) + (L.chezElleEnBase(f) ? ' base' : ' rés')).join(', ') || 'aucune', '| annulations', L.annulations.map(x => x.attaquant + '↔' + x.cible).join(', ') || 'aucune');
console.log('témoin', K.temoin(th, new Date()).lignes.map(l => l.titre + ': ' + l.figure + (l.present ? ' ✓' : ' ✗')).join(' | '));
console.log('mode', L.mode);
if (L.confrontation.R1) for (const k of ['R1', 'R7']) console.log(k, 'camp:', L.confrontation[k].map(x => x.numero + (x.absente ? ' absent' : ' (' + x.positions.map(p => 'm' + p.maison).join(',') + ')' + (x.chezElle ? '*' : ''))).join(' - '));
console.log('pénalisées (maison antagoniste):', L.penalisees.map(x => x.figure + ' M' + x.maison + ' ' + x.couche).join(', ') || 'aucune');
