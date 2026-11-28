// Règle du propriétaire (2026-11-26) : un pôle qui n'a pas de figure saturée marquante ne marque pas. Ses figures marquantes : lui-même s'il est saturé
// en canal Terre, et ses marqueurs, qui sont les figures de son front (f, f+4, f+8, f+12).
// Lecture : maisons marquantes = maisons des canaux Terre (M13, M14, M15, M4, M8, M12) saturées par un point 1 de la base, Terre de la résultante ouverte
// (canauxTerre). Le pôle marque si l'une de ces maisons porte en base une figure de son front (lui-même compris).
// Variantes : la figure du pôle seule ; canaux sans la condition Terre ouverte ; figure posée en base OU en résultante.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle')); lire('validation/resultats-aveugles-2026-11-25.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const imp = f => K.niveaux(f).map(v => v === 1 ? 1 : 0), C6 = [13, 14, 15, 4, 8, 12], front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const rouge = (b, h) => [0, 1, 2, 3].some(l => imp(b[h])[l] && imp(h)[l]);
const VAR = {
  'front du pôle (lui compris), canal rouge Terre ouverte [règle]': (L, p) => { const b = L.theme.bases; return C6.some(h => rouge(b, h) && K.niveaux(L.theme.resultantes[h])[3] !== 2 && front(L[p].figure).includes(b[h])); },
  'figure du pôle seule, canal rouge Terre ouverte': (L, p) => { const b = L.theme.bases; return C6.some(h => rouge(b, h) && K.niveaux(L.theme.resultantes[h])[3] !== 2 && b[h] === L[p].figure); },
  'front du pôle, canal rouge (sans condition Terre)': (L, p) => { const b = L.theme.bases; return C6.some(h => rouge(b, h) && front(L[p].figure).includes(b[h])); },
  'front du pôle, canal rouge Terre ouverte, base ou résultante': (L, p) => { const b = L.theme.bases, r = L.theme.resultantes; return C6.some(h => rouge(b, h) && K.niveaux(r[h])[3] !== 2 && (front(L[p].figure).includes(b[h]) || front(L[p].figure).includes(r[h]))); },
};
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m) }));
const pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
console.log(D.length + ' matchs, ' + 2 * D.length + ' pôles-matchs ; un pôle marque dans ' + pc(D.reduce((s, d) => s + (d.sc[0] > 0) + (d.sc[1] > 0), 0), 2 * D.length) + ' des cas\n');
for (const [k, f] of Object.entries(VAR)) { const o = { corpus: [0, 0, 0, 0], aveugle: [0, 0, 0, 0] };   // [marque si oui, n oui, marque si non, n non]
  D.forEach(d => ['R1', 'R7'].forEach((p, i) => { const v = f(d.L, p), mq = d.sc[i] > 0, t = o[d.lot]; if (v) { t[1]++; if (mq) t[0]++; } else { t[3]++; if (mq) t[2]++; } }));
  console.log(k); for (const lot of ['corpus', 'aveugle']) { const t = o[lot]; console.log('    ' + lot.padEnd(8) + ' figure marquante : marque ' + t[0] + '/' + t[1] + ' (' + pc(t[0], t[1]) + ') · aucune : marque ' + t[2] + '/' + t[3] + ' (' + pc(t[2], t[3]) + ')'); } console.log(''); }
// comparaison avec la lecture de marquage du moteur (« Marque » par parité / niveau)
const mot = (L, p) => { const q = M.marquage(L)[p]; return !!(q.marqueSur || q.parite.equilibre || q.p2n >= 0.5); };
const juste = (f, lot) => { let a = 0, n = 0; D.filter(d => d.lot === lot).forEach(d => ['R1', 'R7'].forEach((p, i) => { n++; if (f(d.L, p) === (d.sc[i] > 0)) a++; })); return a + '/' + n; };
console.log('« Le pôle marque » (oui / non) juste :');
console.log('    moteur actuel (parité, niveau)            corpus ' + juste(mot, 'corpus') + ' · aveugle ' + juste(mot, 'aveugle'));
console.log('    règle du propriétaire (front, canaux)     corpus ' + juste(VAR['front du pôle (lui compris), canal rouge Terre ouverte [règle]'], 'corpus') + ' · aveugle ' + juste(VAR['front du pôle (lui compris), canal rouge Terre ouverte [règle]'], 'aveugle'));
console.log('    toujours oui                              corpus ' + juste(() => true, 'corpus') + ' · aveugle ' + juste(() => true, 'aveugle'));
