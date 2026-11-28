// Victoire selon le propriétaire (2026-11-27) : quand le front d'un pôle attaque l'autre, l'antagoniste de l'attaqué est dans le front de l'attaquant, et
// l'antagoniste de l'attaquant est dans la boucle du binôme (front du protecteur f − 6) de l'attaqué.
//   - l'attaquant (lui et ses fronts) bloque l'attaqué → l'attaquant gagne ;
//   - la boucle du binôme de l'attaqué bloque l'attaquant → l'attaqué gagne (l'attaquant n'a pas la force de le détruire ni de le bloquer).
// Blocage : l'antagoniste est posé en base (intact, ou n'importe comment), ou produit en résultante par une figure de la boucle concernée.
// Développement : 126 matchs de la recherche ; test : 21 matchs du 26 novembre.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const dev = new Map(), aj = (t, s, nom) => { const k = t.join('-'); if (!dev.has(k)) dev.set(k, { m: t, sc: s, nom }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match)));
const DEV = [...dev.values()], TEST = lire('validation/resultats-2026-11-26.json').matchs.map(x => ({ m: x.theme, sc: x.score, nom: x.match }));
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, boucleF = z => [1, 2, 3, 4].map(i => z + 4 * (i - 1) + 1);
const intact = (g, h) => g !== 16 && (h === 16 || K.niveaux(g).every((v, l) => v !== 1 || K.niveaux(h)[l] === 2));
// blocage de la cible par la boucle (front z) : antagoniste de la cible posé / produit par une figure de la boucle
const bloque = (L, cible, z, mode) => { const b = L.theme.bases, r = L.theme.resultantes, A = mod(L[cible].figure - 3), loop = boucleF(z); let n = 0;
  if (mode.includes('i')) for (let h = 1; h <= 16; h++) if (b[h] === A && intact(A, h)) n++;
  if (mode.includes('b')) for (let h = 1; h <= 16; h++) if (b[h] === A) n++;
  if (mode.includes('r')) for (let h = 1; h <= 15; h++) if (r[h] === A && loop.includes(b[h])) n++;
  return n; };
const lecture = (L, mode) => { const f1 = fr(L.R1.figure), f7 = fr(L.R7.figure); let att = null; if (ATT[f1] === f7) att = 'R1'; else if (ATT[f7] === f1) att = 'R7'; if (!att) return null;
  const vic = att === 'R1' ? 'R7' : 'R1', zAtt = fr(L[att].figure), zBinVic = (fr(L[vic].figure) + 2) % 4;
  const a = bloque(L, vic, zAtt, mode), v = bloque(L, att, zBinVic, mode); return { att, vic, attBloque: a, binBloque: v, gagnant: a > 0 && v === 0 ? att : v > 0 && a === 0 ? vic : a > v ? att : v > a ? vic : null, egal: a === v }; };
const MODES = { i: 'antagoniste posé intact', b: 'antagoniste posé (intact ou non)', r: 'antagoniste produit en résultante par la boucle', ir: 'posé intact ou produit par la boucle', br: 'posé ou produit par la boucle' };
for (const [mode, lab] of Object.entries(MODES)) { console.log('\n' + lab.toUpperCase());
  for (const [nomS, S] of [['développement', DEV], ['test 26/11', TEST]]) { const t = { attaquant: [0, 0, 0], attaque: [0, 0, 0], aucun: [0, 0, 0] }; let ctx = 0;
    S.forEach(d => { const L = M.lire(d.m), x = lecture(L, mode); if (!x) return; ctx++; const r = Math.sign(d.sc[0] - d.sc[1]), res = r === 0 ? 1 : (r > 0) === (x.gagnant === 'R1') ? 0 : 2;
      const k = !x.gagnant ? 'aucun' : x.gagnant === x.att ? 'attaquant' : 'attaque'; if (!x.gagnant) { t.aucun[r > 0 ? 0 : r === 0 ? 1 : 2]++; } else t[k][res]++; });
    console.log('  ' + nomS.padEnd(14) + ctx + ' matchs à attaque · désigne l\'attaquant : juste ' + t.attaquant[0] + ', nul ' + t.attaquant[1] + ', faux ' + t.attaquant[2] + ' · désigne l\'attaqué (binôme) : juste ' + t.attaque[0] + ', nul ' + t.attaque[1] + ', faux ' + t.attaque[2] + ' · sans désignation : R1 ' + t.aucun[0] + ', nul ' + t.aucun[1] + ', R7 ' + t.aucun[2]); } }
console.log('\nDÉTAIL PAR ATTAQUANT (développement + test, 147 matchs)');
for (const [mode, lab] of Object.entries(MODES)) { const T = {}; [...DEV, ...TEST].forEach(d => { const L = M.lire(d.m), x = lecture(L, mode); if (!x) return; const r = Math.sign(d.sc[0] - d.sc[1]), res = r > 0 ? 'R1' : r < 0 ? 'R7' : 'nul';
    const cas = x.att + ' attaque · ' + (x.attBloque && !x.binBloque ? 'l\'attaquant bloque' : x.binBloque && !x.attBloque ? 'le binôme de l\'attaqué bloque' : x.attBloque && x.binBloque ? 'les deux bloquent' : 'personne ne bloque'); T[cas] = T[cas] || { R1: 0, nul: 0, R7: 0 }; T[cas][res]++; });
  console.log('  ' + lab); Object.keys(T).sort().forEach(k => console.log('     ' + k.padEnd(52) + 'R1 ' + T[k].R1 + ' · nul ' + T[k].nul + ' · R7 ' + T[k].R7)); }
// Lecture 2 : le binôme (protecteur f − 6) de l'attaqué bloque l'arme de l'attaquant (l'antagoniste de l'attaqué, figure du front de l'attaquant).
// Présence du protecteur : posé intact, reproduit par Populus (Populus en base de sa maison), ou produit en résultante (toute base).
const presentP = (L, g, mode) => { const b = L.theme.bases, r = L.theme.resultantes; let n = 0;
  if (mode.includes('i')) for (let h = 1; h <= 16; h++) if (b[h] === g && intact(g, h)) n++;
  if (mode.includes('b')) for (let h = 1; h <= 16; h++) if (b[h] === g) n++;
  if (mode.includes('p')) if (g < 16 && b[g] === 16) n++;
  if (mode.includes('r')) for (let h = 1; h <= 15; h++) if (r[h] === g && b[h] !== 16) n++;
  return n; };
console.log('\nLECTURE 2 : le binôme (protecteur) de l\'attaqué bloque l\'arme de l\'attaquant → l\'attaqué gagne ; sinon, l\'arme présente → l\'attaquant gagne');
const MP = { i: 'protecteur posé intact', b: 'protecteur posé', p: 'protecteur reproduit par Populus', ip: 'intact ou Populus', ipr: 'intact, Populus ou résultante', bpr: 'posé, Populus ou résultante' };
for (const [mp, lab] of Object.entries(MP)) for (const ma of ['b', 'br']) { const T = {};
  [...DEV, ...TEST].forEach(d => { const L = M.lire(d.m), f1 = fr(L.R1.figure), f7 = fr(L.R7.figure); let att = null; if (ATT[f1] === f7) att = 'R1'; else if (ATT[f7] === f1) att = 'R7'; if (!att) return;
    const vic = att === 'R1' ? 'R7' : 'R1', arme = bloque(L, vic, fr(L[att].figure), ma) > 0, prot = presentP(L, mod(L[vic].figure - 6), mp) > 0, r = Math.sign(d.sc[0] - d.sc[1]);
    const cas = prot ? 'protégé → l\'attaqué' : arme ? 'arme sans protection → l\'attaquant' : 'ni arme ni protection'; const g = prot ? vic : arme ? att : null;
    T[cas] = T[cas] || [0, 0, 0]; if (!g) T[cas][r > 0 ? 0 : r === 0 ? 1 : 2]++; else T[cas][r === 0 ? 1 : ((r > 0) === (g === 'R1') ? 0 : 2)]++; });
  console.log('  ' + (lab + ' ; arme ' + (ma === 'b' ? 'posée' : 'posée ou produite')).padEnd(62) + Object.entries(T).map(([k, v]) => k + (k.startsWith('ni') ? ' : R1 ' + v[0] + ', nul ' + v[1] + ', R7 ' + v[2] : ' : juste ' + v[0] + ', nul ' + v[1] + ', faux ' + v[2])).join('  |  ')); }
console.log('\nMATCHS OÙ LA BOUCLE DU BINÔME DE L\'ATTAQUÉ BLOQUE L\'ATTAQUANT (antagoniste de l\'attaquant posé, intact ou non), et pas l\'inverse :');
[...DEV, ...TEST].forEach(d => { const L = M.lire(d.m), x = lecture(L, 'b'); if (!x || !x.binBloque || x.attBloque) return; const b = L.theme.bases, A = mod(L[x.att].figure - 3), hs = []; for (let h = 1; h <= 16; h++) if (b[h] === A) hs.push('M' + h);
  const r = Math.sign(d.sc[0] - d.sc[1]), res = r === 0 ? 'nul' : (r > 0 ? 'R1' : 'R7') + ' gagne';
  console.log('  ' + d.nom.padEnd(34) + d.sc.join('-').padEnd(5) + (x.att + ' (' + N(L[x.att].figure) + ') attaque ' + x.vic + ' (' + N(L[x.vic].figure) + ')').padEnd(48) + ('antagoniste de ' + x.att + ' : ' + N(A) + ' en ' + hs.join(', ')).padEnd(40) + '→ ' + res + ((r !== 0 && (r > 0 ? 'R1' : 'R7') === x.vic) ? ' ✓' : r === 0 ? '' : ' ✗')); });
console.log('\nMATCHS OÙ L\'ATTAQUANT BLOQUE L\'ATTAQUÉ (antagoniste de l\'attaqué posé), et pas l\'inverse :');
[...DEV, ...TEST].forEach(d => { const L = M.lire(d.m), x = lecture(L, 'b'); if (!x || !x.attBloque || x.binBloque) return; const b = L.theme.bases, A = mod(L[x.vic].figure - 3), hs = []; for (let h = 1; h <= 16; h++) if (b[h] === A) hs.push('M' + h);
  const r = Math.sign(d.sc[0] - d.sc[1]), res = r === 0 ? 'nul' : (r > 0 ? 'R1' : 'R7') + ' gagne';
  console.log('  ' + d.nom.padEnd(34) + d.sc.join('-').padEnd(5) + (x.att + ' (' + N(L[x.att].figure) + ') attaque ' + x.vic + ' (' + N(L[x.vic].figure) + ')').padEnd(48) + ('antagoniste de ' + x.vic + ' : ' + N(A) + ' en ' + hs.join(', ')).padEnd(40) + '→ ' + res + ((r !== 0 && (r > 0 ? 'R1' : 'R7') === x.att) ? ' ✓' : r === 0 ? '' : ' ✗')); });
// Domaine de la règle : R1 et R7 dans des boucles différentes (l'un en A/C, l'autre en B/D) = le front de l'un attaque celui de l'autre.
console.log('\nDOMAINE DE LA RÈGLE : R1 et R7 dans des boucles différentes (A/C contre B/D)');
const boucle = f => fr(f) % 2 === 0 ? 'A/C' : 'B/D';
const ALL = [...DEV.map(d => ({ ...d, lot: 'dev' })), ...TEST.map(d => ({ ...d, lot: 'test' }))];
const dom = ALL.filter(d => { const L = M.lire(d.m); return boucle(L.R1.figure) !== boucle(L.R7.figure); });
console.log('  ' + dom.length + ' matchs sur ' + ALL.length + ' (tous à attaque de front : ' + dom.every(d => lecture(M.lire(d.m), 'b')) + ')');
const filles = h => h >= 5 && h <= 8;
const regle = (d, variante) => { const L = M.lire(d.m), x = lecture(L, 'b'), b = L.theme.bases;
  const Aatt = mod(L[x.att].figure - 3), hsBin = []; for (let h = 1; h <= 16; h++) if (b[h] === Aatt) hsBin.push(h);
  if (x.attBloque && !x.binBloque) return x.att;
  if (x.binBloque && !x.attBloque) return variante === 'filles' ? (hsBin.some(filles) ? x.vic : x.att) : x.vic;
  return null; };
const verd = d => { const v = M.verdict(M.lire(d.m)).decision.resultat; return v === 'N' ? null : v === '1' ? 'R1' : 'R7'; };
const S = {
  'R1 gagne toujours': d => 'R1', 'l\'attaquant gagne toujours': d => lecture(M.lire(d.m), 'b').att, 'décision actuelle du moteur': d => verd(d),
  'règle du propriétaire, sinon décision actuelle': d => regle(d, '') || verd(d), 'règle du propriétaire, sinon R1': d => regle(d, '') || 'R1',
  'règle du propriétaire + Filles, sinon décision actuelle': d => regle(d, 'filles') || verd(d), 'règle du propriétaire + Filles, sinon R1': d => regle(d, 'filles') || 'R1' };
for (const [k, f] of Object.entries(S)) { const sc = lot => { const X = dom.filter(d => lot === 'tous' || d.lot === lot); return X.filter(d => { const g = f(d), r = Math.sign(d.sc[0] - d.sc[1]); return g && r !== 0 && (r > 0) === (g === 'R1'); }).length + '/' + X.length; };
  console.log('  ' + k.padEnd(56) + 'développement ' + sc('dev').padEnd(7) + ' test ' + sc('test').padEnd(6) + ' tous ' + sc('tous')); }
const res = dom.filter(d => regle(d, '')); console.log('  la règle se prononce sur ' + res.length + ' matchs du domaine ; les autres (les deux bloquent, ou personne) : ' + (dom.length - res.length));
console.log('\nLES DEUX BLOQUENT, OU PERSONNE (domaine de la règle)');
const reste = dom.filter(d => !regle(d, ''));
const T2 = {}; reste.forEach(d => { const L = M.lire(d.m), x = lecture(L, 'b'), b = L.theme.bases, r = Math.sign(d.sc[0] - d.sc[1]);
  const pos = g => { const l = []; for (let h = 1; h <= 16; h++) if (b[h] === g) l.push(h); return l; }, armes = pos(mod(L[x.vic].figure - 3)), def = pos(mod(L[x.att].figure - 3));
  let cas; if (!armes.length && !def.length) cas = 'personne ne bloque'; else { const fa = armes.some(filles), fd = def.some(filles); cas = 'les deux bloquent · ' + (fa === fd ? (armes.length > def.length ? 'l\'attaquant a plus de figures' : def.length > armes.length ? 'le binôme a plus de figures' : 'autant de figures') + (fa ? ' (les deux dans les Filles)' : '') : fa ? 'arme de l\'attaquant dans les Filles' : 'défense du binôme dans les Filles'); }
  const g = r === 0 ? 'nul' : (r > 0 ? 'R1' : 'R7') === x.att ? 'attaquant' : 'attaqué'; T2[cas] = T2[cas] || { attaquant: 0, nul: 0, attaqué: 0, R1: 0, R7: 0 }; T2[cas][g]++; if (r > 0) T2[cas].R1++; if (r < 0) T2[cas].R7++; });
Object.keys(T2).sort().forEach(k => console.log('  ' + k.padEnd(70) + 'l\'attaquant gagne ' + T2[k].attaquant + ' · nul ' + T2[k].nul + ' · l\'attaqué gagne ' + T2[k].attaqué + '   (R1 ' + T2[k].R1 + ', R7 ' + T2[k].R7 + ')'));
// Règle complète dans le domaine (boucles différentes) :
//  1) la défense du binôme de l'attaqué (antagoniste de l'attaquant) est posée dans les Filles M5–M8 → l'attaqué gagne ;
//  2) sinon, l'arme de l'attaquant (antagoniste de l'attaqué) est posée → l'attaquant gagne ;
//  3) personne ne bloque → R7 ; 4) sinon → R1.
const complete = d => { const L = M.lire(d.m), x = lecture(L, 'b'), b = L.theme.bases, pos = g => { const l = []; for (let h = 1; h <= 16; h++) if (b[h] === g) l.push(h); return l; };
  const armes = pos(mod(L[x.vic].figure - 3)), def = pos(mod(L[x.att].figure - 3));
  if (def.some(filles)) return [x.vic, 'défense du binôme dans les Filles'];
  if (armes.length && !def.length) return [x.att, 'l\'attaquant bloque'];
  if (!armes.length && !def.length) return ['R7', 'personne ne bloque'];
  if (armes.length && def.length) return [x.att, 'les deux bloquent, défense hors Filles'];
  return [x.att, 'défense du binôme hors Filles']; };
console.log('\nRÈGLE COMPLÈTE DANS LE DOMAINE (ajustée sur les 87 matchs : pas de lot de validation)');
const P2 = {}; let ok = 0; dom.forEach(d => { const [g, c] = complete(d), r = Math.sign(d.sc[0] - d.sc[1]); P2[c] = P2[c] || [0, 0, 0]; P2[c][r === 0 ? 1 : (r > 0) === (g === 'R1') ? 0 : 2]++; if (r !== 0 && (r > 0) === (g === 'R1')) ok++; });
Object.entries(P2).forEach(([c, v]) => console.log('  ' + c.padEnd(42) + 'juste ' + v[0] + ' · nul ' + v[1] + ' · faux ' + v[2]));
console.log('  total ' + ok + '/' + dom.length + ' (R1 toujours 34/87, décision actuelle 31/87) · sur les matchs décidés : ' + ok + '/' + dom.filter(d => d.sc[0] !== d.sc[1]).length);
