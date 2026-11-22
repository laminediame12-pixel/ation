// Déplacement des figures : figure f posée dans la maison h. Résultante = f + h (h = figure de la maison au repos). Thème neutre : f = h partout, résultantes Populus (tout saturé).
const R = '/home/user/ation/koun-1', K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const fr = n => (n - 1) % 4, L4 = ['Feu', 'Air', 'Eau', 'Terre'];
const classe = (f, h) => { const d = ((fr(f) - fr(h)) % 4 + 4) % 4; return d === 0 ? 'propre' : d === 2 ? 'allié' : d === 1 ? 'ennemi +1' : 'ennemi −1'; };
console.log('fronts : A = 1,5,9,13 · B = 2,6,10,14 · C = 3,7,11,15 · D = 4,8,12,16 ; allié = front du binôme (A↔C, B↔D)');
const T = {};
for (let f = 1; f <= 16; f++) for (let h = 1; h <= 16; h++) {
  const c = classe(f, h), r = A(f, h), lv = K.niveaux(r), ouv = lv.map((v, i) => v === 1 ? L4[i] : null).filter(Boolean);
  const o = T[c] = T[c] || { n: 0, ouverts: {}, nb: {} }; o.n++; const k = ouv.join('+') || 'aucun (Populus)'; o.ouverts[k] = (o.ouverts[k] || 0) + 1; o.nb[ouv.length] = (o.nb[ouv.length] || 0) + 1;
}
for (const c of ['propre', 'allié', 'ennemi +1', 'ennemi −1']) { console.log('\n' + c + ' (' + T[c].n + ' couples figure/maison)'); console.log('   canaux ouverts (non saturés) dans la résultante :', JSON.stringify(T[c].ouverts)); }
// niveaux par front : quels niveaux distinguent les fronts ?
console.log('\nniveaux de chaque figure par front :');
for (let z = 0; z < 4; z++) console.log('  front ' + 'ABCD'[z] + ' :', [0, 1, 2, 3].map(i => z + 1 + 4 * i).map(n => nm(n) + ' ' + K.niveaux(n).join('')).join(' | '));
