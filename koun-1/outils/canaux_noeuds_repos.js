// Canaux et nœuds du thème de repos (toutes les bases Populus, 16-16-16-16 : chaque résultante est la figure de repos de sa maison) — 2026-11-27.
// Pour chaque front : la croix (haut f, droite f+4, bas f+8, gauche f+12), les liaisons saturées de chaque canal (Feu, Air, Eau : horizontal par moitié gauche/droite,
// vertical par moitié haute/basse ; Terre déviée : verticale portée par le haut, horizontale portée par la gauche), et l'état des 15 nœuds (moteur : M.noeuds).
const M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, NV = ['Feu', 'Air', 'Eau', 'Terre'];
const theme = (process.argv[2] || '16-16-16-16').split('-').map(Number), L = M.lire(theme), nd = M.noeuds(L), lv = h => K.niveaux(L.resu(h)), sat = (h, l) => lv(h)[l] === 2;
console.log('thème ' + theme.join('-') + (theme.every(x => x === 16) ? ' (repos : chaque résultante = figure de repos de la maison)' : '') + '\n');
[1, 2, 3, 4].forEach((f, k) => { const haut = f, droite = f + 4, bas = f + 8, gauche = f + 12, F = nd.fronts[k];
  console.log('FRONT ' + F.front + ' — haut M' + haut + ' ' + N(L.resu(haut)) + ' · droite M' + droite + ' ' + N(L.resu(droite)) + ' · bas M' + bas + ' ' + N(L.resu(bas)) + ' · gauche M' + gauche + ' ' + N(gauche === 16 ? L.theme.bases[16] : L.resu(gauche)));
  const can = [0, 1, 2].map(l => { const hg = sat(gauche, l), hd = sat(droite, l), vh = sat(haut, l), vb = sat(bas, l);
    return '  ' + NV[l].padEnd(6) + 'horizontal ' + (hg && hd ? 'saturé d\'un bout à l\'autre' : hg ? 'saturé à gauche' : hd ? 'saturé à droite' : 'ouvert').padEnd(30) + 'vertical ' + (vh && vb ? 'saturé d\'un bout à l\'autre' : vh ? 'saturé en haut' : vb ? 'saturé en bas' : 'ouvert'); });
  can.forEach(x => console.log(x));
  console.log('  Terre  verticale (portée par le haut) ' + (sat(haut, 3) ? 'saturée' : 'ouverte') + ' · horizontale (portée par la gauche) ' + (sat(gauche, 3) ? 'saturée' : 'ouverte'));
  const par = e => F.noeuds.filter(x => x.etat === e).map(x => 'M' + x.maison + (x.arret ? '✖' : '')).join(' ');
  console.log('  nœuds : pleins ' + F.pleins + ' (' + (par('plein') || '—') + ') · mixtes ' + F.mixtes + ' (' + (par('mixte') || '—') + ') · vides ' + F.vides + '\n'); });
console.log('arrêts : ' + (nd.arrets.length ? nd.arrets.map(a => N(a.figure) + ' en M' + a.maison).join(', ') : 'aucun'));
// nœud par nœud : dans combien de fronts il est plein
const T = {}; nd.fronts.forEach(F => F.noeuds.forEach(x => { T[x.maison] = T[x.maison] || { plein: [], mixte: [], vide: [] }; T[x.maison][x.etat].push(F.front); }));
console.log('\nnœud par nœud (fronts où il est plein / mixte) :');
console.log('  ' + Object.keys(T).sort((a, b) => a - b).map(h => 'M' + h + ' ' + (T[h].plein.join('') || '·') + '/' + (T[h].mixte.join('') || '·')).join('  '));
