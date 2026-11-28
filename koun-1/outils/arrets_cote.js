// PISTE 5 (2026-11-25) : les arrêts font monter les buts (solide) ; QUELLE équipe en profite ?
// Un arrêt = l'antagoniste (h − 3) posé dans la maison h (M1–M15). Côtés d'un arrêt, lectures annoncées avant le calcul :
//   front de la maison  : le pôle dont la figure est dans le même front que la maison h (A 1-5-9-13, B 2-6-10-14, C 3-7-11-15, D 4-8-12-16)
//   front de la figure  : le pôle dont la figure est dans le même front que la figure posée (h − 3)
//   maison du pôle      : l'arrêt est dans la maison même du pôle, ou dans son front de maison
//   la figure posée est celle du pôle, ou son binôme
// Pour chaque lecture : buts marqués et encaissés par le pôle « du côté » de l'arrêt comparés à l'autre pôle ; qui marque le plus.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const fr = n => (n - 1) % 4;
const D = [...tous.values()].map(d => { const L = M.lire(d.m); return { ...d, L, A: M.arrets(L).maisons }; }).filter(d => d.A.length);
const COTE = {
  'front de la maison de l\'arrêt': (d, h, p) => fr(h) === fr(d.L[p].figure),
  'front de la figure posée (l\'antagoniste)': (d, h, p) => fr(d.L.theme.bases[h]) === fr(d.L[p].figure),
  'front de la maison du pôle': (d, h, p) => fr(h) === fr(d.L[p].maison),
  'la figure posée est celle du pôle ou son binôme': (d, h, p) => [d.L[p].figure, K.binome(d.L[p].figure)].includes(d.L.theme.bases[h]),
  'l\'arrêt frappe la figure du pôle (maison h = figure du pôle)': (d, h, p) => h === d.L[p].figure,
};
console.log(D.length + ' matchs avec au moins un arrêt\n');
for (const [k, f] of Object.entries(COTE)) {
  // pour chaque match : nombre d'arrêts du côté de R1, du côté de R7 ; le pôle qui en a le plus
  let plus = 0, moins = 0, eg = 0, gm = [0, 0], ge = [0, 0], av = [0, 0];
  D.forEach(d => { const n1 = d.A.filter(h => f(d, h, 'R1')).length, n7 = d.A.filter(h => f(d, h, 'R7')).length, s = Math.sign(n1 - n7); if (!s) { eg++; return; }
    const pi = s > 0 ? 0 : 1, a = d.sc[pi], b = d.sc[1 - pi]; gm[0] += a; gm[1] += b; ge[1]++; if (a > b) plus++; else if (a < b) moins++; if (d.lot === 'aveugle') { av[1]++; if (a > b) av[0]++; } });
  console.log(k);
  console.log('    le pôle qui a le plus d\'arrêts de son côté : marque plus que l\'autre ' + plus + ' fois, moins ' + moins + ' fois (égalité de buts ' + (ge[1] - plus - moins) + ') · buts moyens ' + (gm[0] / (ge[1] || 1)).toFixed(2) + ' contre ' + (gm[1] / (ge[1] || 1)).toFixed(2) + ' · sans côté désigné : ' + eg + ' · aveugle : marque plus ' + av[0] + '/' + av[1] + '\n');
}
// La lecture qui ressort (« la figure posée en arrêt est celle du pôle ou son binôme » → ce pôle marque moins) ajoutée comme 8e signe de victoire (vers l'AUTRE pôle) :
const all = [...tous.values()].map(d => { const L = M.lire(d.m), V = M.verdict(L); return { ...d, L, V, A: M.arrets(L).maisons, r: Math.sign(d.sc[0] - d.sc[1]) }; });
const s8 = d => { const n = p => d.A.filter(h => [d.L[p].figure, K.binome(d.L[p].figure)].includes(d.L.theme.bases[h])).length; return Math.sign(n('R7') - n('R1')); };
const decide = (d, plus) => d.V.nulConvergence.niveau === 'frequent' ? 0 : Math.sign(d.V.victoireConvergence.score + plus) || 1;
for (const [nom, plus] of [['décision actuelle (7 signes)', d => 0], ['avec le 8e signe (l\'arrêt profite à l\'autre pôle)', s8]]) { const o = { corpus: 0, aveugle: 0 }; all.forEach(d => { if (decide(d, plus(d)) === d.r) o[d.lot]++; }); console.log(nom.padEnd(52), (o.corpus + o.aveugle) + '/106 | corpus ' + o.corpus + ' · aveugle ' + o.aveugle + '/26'); }
{ let a = 0, b = 0, n = 0; all.forEach(d => { const v = s8(d); if (!v) return; if (!d.r) n++; else if (v === d.r) a++; else b++; }); console.log('8e signe seul (vainqueur) : ' + a + ' justes, ' + b + ' faux, ' + n + ' nuls'); }
