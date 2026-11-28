// Deux lois du système, posées avant le calcul : (1) une figure chez elle est forte ; (2) le front du binôme posé en base soutient le pôle.
// Hiérarchie : la figure chez elle décide ; à égalité, le front du binôme. Jugée seule, puis en complément du verdict quand il ne fait pas d'appel.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), r: Math.sign(d.sc[0] - d.sc[1]) }));
const front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const chez = (T, f) => T.bases[f] === f ? 1 : 0, fb = (T, f) => front(K.binome(f)).filter(g => [...Array(16)].some((_, i) => T.bases[i + 1] === g)).length;
const loi = L => { const T = L.theme, a = L.R1.figure, b = L.R7.figure, s1 = Math.sign(chez(T, a) - chez(T, b)); return s1 || Math.sign(fb(T, a) - fb(T, b)); };
const verd = L => { const v = M.verdict(L).v; return v === '1' ? 1 : v === '2' ? -1 : 0; };
function bil(nom, f) { const o = {}; for (const lot of ['corpus', 'aveugle', 'tous']) { let a = 0, b = 0, n = 0, nb = 0; D.filter(d => lot === 'tous' || d.lot === lot).forEach(d => { const s = f(d.L); if (!s) return; if (!d.r) { n++; return; } if (s === d.r) a++; else b++; }); o[lot] = a + '/' + b + ' (' + n + ' nuls)'; } console.log('   ', nom.padEnd(64), 'corpus', o.corpus.padEnd(14), '| aveugle', o.aveugle.padEnd(14), '| 106 matchs', o.tous); }
console.log('justes / faux (nuls à part)\n');
bil('loi « figure chez elle, puis front du binôme »', loi);
bil('la même, seulement là où le verdict ne fait pas d\'appel', L => verd(L) ? 0 : loi(L));
bil('verdict actuel', verd);
bil('verdict actuel, puis la loi quand il se tait', L => verd(L) || loi(L));
bil('« R1 gagne toujours »', L => 1);
