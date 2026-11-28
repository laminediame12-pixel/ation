// PISTE 1 (2026-11-25) : la victoire par convergence des signes, comme le nul.
// Chaque signe désigne R1 (+1), R7 (−1) ou personne (0) ; le score est leur somme ; le pôle du signe du score gagne.
// Signes (tous déjà trouvés ou proposés dans le projet) :
//   diagonales : Terre des nœuds diagonaux du front du pôle (H-DIAGONALES-TERRE) ; coordination : nœuds de coordination (H-COORD-VICTOIRE) ;
//   M1-M10 : deux arrêts M1–M5 et M10–M14 → R1 ; figure chez elle : la figure du pôle posée dans sa propre maison ;
//   front du binôme : nombre de figures du front du binôme du pôle posées en base ; protecteur : protecteur du pôle posé en base ;
//   fronts : nombre de fronts différents où la figure du pôle est posée (piste H-POLE-FRONTS).
// Jugé sur les 106 matchs, par niveau de score, puis combiné avec le nul (nul fréquent → Nul).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, F16 = [...Array(16)].map((_, i) => i + 1), front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const pose = (b, g) => F16.some(h => b[h] === g), sg = (a, c) => Math.sign(a - c);
const SIG = {
  'diagonales': L => Math.sign(M.diagonales(L).ecart),
  'coordination': L => Math.sign(M.coordonnees(L).ecart),
  'M1-M10': L => M.m1m10(L).deuxArrets ? 1 : 0,
  'figure chez elle': L => { const b = L.theme.bases; return sg(b[L.R1.figure] === L.R1.figure ? 1 : 0, b[L.R7.figure] === L.R7.figure ? 1 : 0); },
  'front du binôme posé': L => { const b = L.theme.bases, n = f => front(K.binome(f)).filter(g => pose(b, g)).length; return sg(n(L.R1.figure), n(L.R7.figure)); },
  'protecteur posé': L => { const b = L.theme.bases, n = f => pose(b, mod(f - 6)) ? 1 : 0; return sg(n(L.R1.figure), n(L.R7.figure)); },
  'fronts de la figure': L => { const b = L.theme.bases, n = f => new Set(F16.filter(h => b[h] === f).map(h => (h - 1) % 4)).size; return sg(n(L.R1.figure), n(L.R7.figure)); },
};
const D = [...tous.values()].map(d => { const L = M.lire(d.m), s = {}; for (const k in SIG) s[k] = SIG[k](L); const V = M.verdict(L); return { ...d, L, s, score: Object.values(s).reduce((a, b) => a + b, 0), V, r: Math.sign(d.sc[0] - d.sc[1]) }; });
console.log(D.length + ' matchs (R1 gagne ' + D.filter(d => d.r > 0).length + ', nuls ' + D.filter(d => !d.r).length + ', R7 gagne ' + D.filter(d => d.r < 0).length + ')\n');
console.log('1. Chaque signe seul (le pôle désigné gagne : justes / faux, nuls à part ; corpus | aveugle)');
for (const k in SIG) { const b = lot => { let a = 0, f = 0, n = 0; D.filter(d => !lot || d.lot === lot).forEach(d => { const v = d.s[k]; if (!v) return; if (!d.r) n++; else if (v === d.r) a++; else f++; }); return a + '/' + f + ' (' + n + ' nuls)'; };
  console.log('   ', k.padEnd(24), b(null).padEnd(18), '| corpus ' + b('corpus').padEnd(16), '| aveugle ' + b('aveugle')); }
console.log('\n2. Score de convergence (somme des signes) : résultat');
[...new Set(D.map(d => d.score))].sort((a, b) => a - b).forEach(v => { const X = D.filter(d => d.score === v), av = X.filter(d => d.lot === 'aveugle');
  console.log('    score ' + (v > 0 ? '+' : '') + v + ' : ' + X.length + ' matchs · R1 gagne ' + X.filter(d => d.r > 0).length + ', nul ' + X.filter(d => !d.r).length + ', R7 gagne ' + X.filter(d => d.r < 0).length + '  | aveugle : ' + av.filter(d => d.r > 0).length + '/' + av.filter(d => !d.r).length + '/' + av.filter(d => d.r < 0).length); });
// décisions complètes (toujours Victoire ou Nul) comparées
const DEC = {
  'moteur actuel (V.decision)': d => d.V.decision.resultat === 'N' ? 0 : d.V.decision.resultat === '1' ? 1 : -1,
  'nul fréquent → Nul ; sinon signe du score de victoire ; à 0 → R1': d => d.V.nulConvergence.niveau === 'frequent' ? 0 : Math.sign(d.score) || 1,
  'nul fréquent → Nul ; sinon score ≥ +1 → R1, ≤ −2 → R7, sinon R1': d => d.V.nulConvergence.niveau === 'frequent' ? 0 : d.score <= -2 ? -1 : 1,
  'nul fréquent → Nul ; sinon score ≤ −1 → R7, sinon R1': d => d.V.nulConvergence.niveau === 'frequent' ? 0 : d.score <= -1 ? -1 : 1,
  'référence : R1 toujours': d => 1,
};
console.log('\n3. Décision complète (Victoire ou Nul) : résultat exact juste');
for (const [k, f] of Object.entries(DEC)) { const o = { corpus: 0, aveugle: 0 }, n = { corpus: 0, aveugle: 0 }; D.forEach(d => { n[d.lot]++; if (f(d) === d.r) o[d.lot]++; });
  console.log('   ', k.padEnd(66), (o.corpus + o.aveugle) + '/' + D.length, '| corpus ' + o.corpus + '/' + n.corpus + ' · aveugle ' + o.aveugle + '/' + n.aveugle); }
