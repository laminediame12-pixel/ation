// Buts : première mi-temps et « les deux équipes marquent », d'après les matchs réels dont le score est connu.
// Écrit moteur2/BUTS.md. Usage : node outils/buts_doc.js — ajouter un match dans la liste SCORES quand son score est connu.
const fs = require('fs'), path = require('path');
const K = require('../moteur2/moteur.js'), n = K.num;
// [nom, mères, buts R1, buts R7, mi-temps R1, mi-temps R7] ; null quand la mi-temps n'est pas connue
const SCORES = [
  ['8·5·11·7', [8, 5, 11, 7], 7, 0, null, null],
  ['9·13·2·13', [9, 13, 2, 13], 2, 0, 2, 0],
  ['2·9·6·5', [2, 9, 6, 5], 3, 3, null, null],
  ['Latium – Bologna (5·14·6·14)', [5, 14, 6, 14], 3, 1, 1, 0],
  ['Milano – Genoa (7·5·9·6)', [7, 5, 9, 6], 4, 0, 3, 0],
  ['Cremonese – Torino (13·12·8·15)', [13, 12, 8, 15], 0, 3, 0, 0]
];
const NIV = { SUR: 'sûr', OUI: 'oui', RESULTANTE: 'faible', AUCUN: 'pas de signal' };
let md = '# Les buts : première mi-temps et « les deux marquent »\n\nDocument produit par `outils/buts_doc.js` à partir des matchs réels dont le score est connu (' + SCORES.length + ' matchs, dont ' + SCORES.filter(x => x[4] !== null).length + ' avec la mi-temps). Pour les autres matchs réels, seul le vainqueur ou le nul est connu : ils ne peuvent pas servir ici.\n\n';
md += '## 1. But en première mi-temps\n\n**La règle du propriétaire, telle que le moteur l\'applique (`L.butMiTemps`).** On regarde la somme de l\'axe angulaire (M1 + M4 + M7 + M10) et les deux pôles :\n- **sûr** : l\'un d\'eux est dans une maison de l\'axe en base (M1, M4, M7, M10), ou en résultante en M4 ou M10 ;\n- **faible** : il n\'est sur l\'axe qu\'en résultante, en M1 ou M7 ;\n- **pas de signal** : aucun n\'est sur l\'axe.\n\n| Match | Score | Mi-temps | Signal du moteur | Ce que le thème montre | Juste ? |\n|---|---|---|---|---|---|\n';
let ok = 0, tot = 0; const lignesB = [];
for (const [id, m, b1, b7, h1, h7] of SCORES) {
  const a = K.analyser(K.construireTheme(...m.map(K.fig))), L = a.lecture, q = L.butMiTemps;
  const reel = h1 === null ? null : (h1 + h7 > 0), prevu = q.niveau === 'SUR' || q.niveau === 'OUI';
  if (reel !== null) { tot++; if (reel === prevu) ok++; }
  md += '| ' + id + ' | ' + b1 + '-' + b7 + ' | ' + (h1 === null ? 'inconnue' : h1 + '-' + h7) + ' | ' + NIV[q.niveau] + ' | ' + q.texte + ' | ' + (reel === null ? 'non vérifiable' : reel === prevu ? 'oui' : '**non**') + ' |\n';
  const P = c => { const p = L.positions(c.figure); return { fig: c.figure, total: p.length, base: p.filter(x => x.couche === 'base').length, maison: L.force(c.figure, c.maison) ?? 100, max: Math.max(...p.map(x => x.force ?? 100)), axe: p.filter(x => [1, 4, 7, 10].includes(x.maison)).length, chez: L.chezElle(c.figure) }; };
  lignesB.push({ id, b1, b7, r1: P(L.R1), r7: P(L.R7) });
}
md += '\nSur les ' + tot + ' matchs où la mi-temps est connue, le signal est juste ' + ok + ' fois.\n\n**Le cas qui manque.** Dans 9·13·2·13, les deux buts sont en première mi-temps (4e et 44e minutes), mais le moteur ne donne qu\'un signal faible : la somme de l\'axe (Tristitia) n\'est qu\'en résultante, en M1 et en M7 à la fois. Soit la résultante compte aussi en M1 et M7, soit elle compte quand la somme y est deux fois. À trancher par le propriétaire.\n\n**L\'hypothèse de la deuxième mi-temps** (axe miroir 9-12-15-2) n\'est juste qu\'une fois sur trois : elle n\'est pas retenue.\n\n';
md += '## 2. Les deux équipes marquent\n\nAucune règle n\'est encore dans le moteur. Voici ce que montrent les ' + SCORES.length + ' matchs dont le score est connu, pôle par pôle.\n\n| Match | Score | Pôle | A marqué ? | Positions (dont base) | Force dans sa maison | Meilleure force | Sur l\'axe | Chez lui |\n|---|---|---|---|---|---|---|---|---|\n';
const marque = [], muet = [];
for (const x of lignesB) for (const [k, p, b] of [['R1', x.r1, x.b1], ['R7', x.r7, x.b7]]) {
  md += '| ' + x.id + ' | ' + x.b1 + '-' + x.b7 + ' | ' + k + ' ' + p.fig + ' | ' + (b > 0 ? 'oui (' + b + ')' : '**non**') + ' | ' + p.total + ' (' + p.base + ') | ' + p.maison + ' % | ' + p.max + ' % | ' + (p.axe ? 'oui' : 'non') + ' | ' + (p.chez ? 'oui' : 'non') + ' |\n';
  (b > 0 ? marque : muet).push(p);
}
const c3 = marque.filter(p => p.total >= 3).length, m3 = muet.filter(p => p.total >= 3).length, ca = marque.filter(p => p.axe).length, ma = muet.filter(p => p.axe).length, cc = marque.filter(p => p.chez).length, mc = muet.filter(p => p.chez).length;
md += '\n**Ce qui ressort, sur ' + marque.length + ' pôles qui ont marqué et ' + muet.length + ' qui n\'ont pas marqué :**\n\n| Lecture | Pôles qui ont marqué | Pôles qui n\'ont pas marqué |\n|---|---|---|\n| présent au moins 3 fois dans le thème | ' + c3 + ' sur ' + marque.length + ' | ' + m3 + ' sur ' + muet.length + ' |\n| présent sur l\'axe angulaire | ' + ca + ' sur ' + marque.length + ' | ' + ma + ' sur ' + muet.length + ' |\n| dans sa maison de repos | ' + cc + ' sur ' + marque.length + ' | ' + mc + ' sur ' + muet.length + ' |\n\n';
md += '- Un pôle présent **au moins trois fois** dans le thème a toujours marqué ; aucun des pôles restés muets n\'atteint trois positions.\n- Un pôle présent **sur l\'axe angulaire** ou **dans sa maison de repos** a toujours marqué.\n- L\'inverse n\'est pas vrai : deux pôles peu présents ont quand même marqué (Caput, une seule position, dans le 3-1 ; Albus, deux positions, dans le 2-0).\n\n**Lecture provisoire pour « les deux marquent » :** oui quand les deux pôles sont chacun présents au moins trois fois ; cela donne le bon résultat pour 5 des ' + SCORES.length + ' matchs (le 3-1 est manqué). C\'est une observation sur très peu de matchs, pas une règle : elle n\'est pas dans le moteur.\n\n## Ce qu\'il faut pour aller plus loin\n\nLe score exact, avec la mi-temps, des matchs réels déjà enregistrés. Quinze matchs sur vingt et un n\'ont que le vainqueur ou le nul.\n';
fs.writeFileSync(path.join(__dirname, '../moteur2/BUTS.md'), md);
console.log('mi-temps :', ok + '/' + tot, '| pôles ≥3 positions : marqué', c3 + '/' + marque.length, 'muets', m3 + '/' + muet.length, '| sur axe', ca + '/' + marque.length, ma + '/' + muet.length, '| chez lui', cc + '/' + marque.length, mc + '/' + muet.length);
