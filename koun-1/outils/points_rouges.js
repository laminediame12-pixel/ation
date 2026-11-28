// Piste du propriétaire (2026-11-24) : compter les points rouges (niveau actif de la base, 1 point, devenu 2 points dans la résultante)
// et les points actifs de la base, du côté de chaque pôle ; le pôle qui en a le plus gagnerait, et ce nombre déterminerait son score.
// Point rouge en maison h (h < 16) : niveau impair dans la base ET impair dans la figure de la maison (h) ; on compte des niveaux (1 niveau = 2 points rouges).
// Lectures annoncées d'avance (pour chaque pôle) :
//   M  « figures qui manquent » : figures du front du pôle (f, f+4, f+8, f+12) absentes des bases ; on compte dans leur maison au repos (maison numéro f) ;
//   F  les 4 maisons du front du pôle (nœuds du pôle) ;
//   et pour chacune : points rouges, ou points actifs de la base (niveaux à 1 point).
// Jugé : vainqueur (le pôle qui en a le plus gagne / perd), buts du pôle (corrélation), sur 80 matchs puis 26 à l'aveugle ; permutations sur le maximum.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const corpus = [...tous.values()], aveugle = lire('validation/resultats-aveugles-2026-11-23.json').matchs.map(x => ({ m: x.theme, sc: x.score }));
const imp = f => K.niveaux(f).map(v => v === 1 ? 1 : 0);
const rouges = (T, h) => h >= 16 ? 0 : imp(T.bases[h]).reduce((s, v, i) => s + (v && imp(h)[i] ? 1 : 0), 0);
const actifs = (T, h) => imp(T.bases[h]).reduce((a, b) => a + b, 0);
const front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
const manquent = (T, f) => front(f).filter(g => ![...Array(16)].some((_, i) => T.bases[i + 1] === g));
const LECT = {
  'M · points rouges des figures manquantes': (T, f) => manquent(T, f).reduce((s, g) => s + rouges(T, g), 0),
  'M · points actifs de la base (figures manquantes)': (T, f) => manquent(T, f).reduce((s, g) => s + actifs(T, g), 0),
  'M · nombre de figures manquantes': (T, f) => manquent(T, f).length,
  'F · points rouges du front du pôle': (T, f) => front(f).reduce((s, h) => s + rouges(T, h), 0),
  'F · points actifs de la base du front du pôle': (T, f) => front(f).reduce((s, h) => s + actifs(T, h), 0),
};
const mel = a => { const q = a.slice(); for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } return q; };
const corr = (x, y) => { const n = x.length, mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n; let a = 0, b = 0, c = 0; for (let i = 0; i < n; i++) { a += (x[i] - mx) * (y[i] - my); b += (x[i] - mx) ** 2; c += (y[i] - my) ** 2; } return b && c ? a / Math.sqrt(b * c) : 0; };
for (const [nom, D] of [['CORPUS (80 matchs)', corpus], ['À L\'AVEUGLE (26 matchs)', aveugle]]) {
  const V = D.map(d => { const L = M.lire(d.m), T = L.theme, o = {}; for (const k in LECT) o[k] = [LECT[k](T, L.R1.figure), LECT[k](T, L.R7.figure)]; return o; });
  const r = D.map(d => Math.sign(d.sc[0] - d.sc[1])), G = D.flatMap(d => d.sc);
  console.log('\n' + nom);
  const zV = (k, rr) => { let a = 0, b = 0; V.forEach((o, i) => { const s = Math.sign(o[k][0] - o[k][1]); if (s && rr[i]) { if (s === rr[i]) a++; else b++; } }); return { a, b, z: (a - b) / Math.sqrt(a + b || 1) }; };
  const cG = (k, g) => corr(V.flatMap(o => o[k]), g);
  let mV = 0, mG = 0; for (const k in LECT) { const v = zV(k, r), c = cG(k, G); mV = Math.max(mV, Math.abs(v.z)); mG = Math.max(mG, Math.abs(c));
    console.log('   ', k.padEnd(50), '| le pôle qui en a le plus : gagne', v.a, ', perd', v.b, '| corrélation avec ses buts', c.toFixed(2)); }
  let gV = 0, gG = 0; const N = 3000; for (let t = 0; t < N; t++) { const p = mel([...D.keys()]), rr = p.map(i => r[i]), gg = p.flatMap(i => D[i].sc); let a = 0, b = 0; for (const k in LECT) { a = Math.max(a, Math.abs(zV(k, rr).z)); b = Math.max(b, Math.abs(cG(k, gg))); } if (a >= mV) gV++; if (b >= mG) gG++; }
  console.log('    hasard (meilleure lecture atteinte en mélangeant les résultats) : vainqueur', (100 * gV / N).toFixed(1), '% · buts', (100 * gG / N).toFixed(1), '%');
  // tableau buts marqués selon le nombre de points rouges des figures manquantes
  const t = {}; V.forEach((o, i) => [0, 1].forEach(j => { const v = o['M · points rouges des figures manquantes'][j]; t[v] = t[v] || []; t[v].push(D[i].sc[j]); }));
  console.log('    buts du pôle selon ses points rouges (figures manquantes, en niveaux) :', Object.keys(t).sort((a, b) => a - b).map(v => v + ' → ' + (t[v].reduce((a, b) => a + b) / t[v].length).toFixed(2) + ' (' + t[v].length + ')').join(' · '));
}
