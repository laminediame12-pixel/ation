// Terre transportée : chaque figure du front d'un pôle, là où elle est posée (en base), rapporte à son propre front la Terre de la résultante de cette maison.
// Feu, Air, Eau : liaison entre la maison où elle est posée et la maison miroir (h ± 8).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const fr = n => (n - 1) % 4, mir = h => h > 8 ? h - 8 : h + 8;
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }));
function feats(L, c) {
  const T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16], sat = (h, l) => K.niveaux(rz(h))[l] === 2, z = fr(c.figure), figs = [0, 1, 2, 3].map(i => z + 1 + 4 * i);
  const o = { terreT: 0, terreTnet: 0, poses: 0, absentes: 0, miroirT: 0, miroirParNiv: [0, 0, 0], terreMaisons: 0, ennemiTerre: 0, propreTerre: 0 };
  figs.forEach(g => { let vu = false; for (let h = 1; h <= 16; h++) if (b[h] === g) { vu = true; o.poses++; const t = sat(h, 3); if (t) o.terreT++; o.terreTnet += t ? 1 : -1; const cls = fr(h) === z ? 'P' : (fr(h) + 2) % 4 === z ? 'L' : 'E'; if (t && cls === 'E') o.ennemiTerre++; if (t && cls === 'P') o.propreTerre++;
      for (let l = 0; l < 3; l++) if (sat(h, l) && sat(mir(h), l)) { o.miroirT++; o.miroirParNiv[l]++; } }
    if (!vu) o.absentes++; });
  figs.forEach(h => { if (sat(h, 3)) o.terreMaisons++; }); // Terre des maisons du front (lecture actuelle, H-BALANCE-TERRE)
  o.terreTotal = o.terreT + o.terreMaisons;
  return o;
}
const P = D.map(d => ({ d, a: feats(d.L, d.L.R1), e: feats(d.L, d.L.R7) }));
const tests = {
  'Terre rapportée par ses figures (compte)': o => o.terreT, 'Terre rapportée, nette (saturée − ouverte)': o => o.terreTnet, 'Terre des maisons du front (actuel)': o => o.terreMaisons,
  'Terre maisons + rapportée': o => o.terreTotal, 'Terre rapportée depuis le terrain ennemi': o => o.ennemiTerre, 'Terre rapportée depuis son propre front': o => o.propreTerre,
  'liaisons miroir gardées (Feu, Air, Eau)': o => o.miroirT, 'figures posées': o => o.poses, 'figures absentes': o => o.absentes,
};
const run = rr => { const out = {}; for (const [k, f] of Object.entries(tests)) { let ok = 0, ko = 0, eg = 0, ne = 0; P.forEach((p, i) => { const s = Math.sign(f(p.a) - f(p.e)); if (!s) { eg++; if (!rr[i]) ne++; } else if (rr[i]) { if (s === rr[i]) ok++; else ko++; } }); out[k] = { ok, ko, eg, ne, z: (ok - ko) / Math.sqrt(ok + ko || 1) }; } return out; };
const sc0 = D.map(d => d.r), obs = run(sc0);
console.log(D.length, 'matchs, nuls', D.filter(d => d.nul).length);
for (const [k, o] of Object.entries(obs)) console.log('  ', k.padEnd(44), 'le plus fort gagne', String(o.ok).padStart(2), 'perd', String(o.ko).padStart(2), '| égalité', o.eg, 'dont', o.ne, 'nuls');
const bz = Math.max(...Object.values(obs).map(o => Math.abs(o.z))); let ge = 0; for (let t = 0; t < 2000; t++) { const z = sc0.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } if (Math.max(...Object.values(run(z)).map(o => Math.abs(o.z))) >= bz) ge++; }
console.log('meilleur test atteint par hasard dans', (100 * ge / 2000).toFixed(1) + ' % des mélanges');
// marquer : Terre rapportée et buts du pôle
console.log('\nbuts selon la Terre rapportée (compte) :'); const g = {}; P.forEach(p => [[p.a, p.d.sc[0]], [p.e, p.d.sc[1]]].forEach(([o, gm]) => { const v = o.terreT; g[v] = g[v] || [0, 0, 0]; g[v][0]++; if (gm > 0) g[v][1]++; g[v][2] += gm; })); Object.keys(g).sort().forEach(v => console.log('   ', v, ':', g[v][1] + '/' + g[v][0], 'marquent,', (g[v][2] / g[v][0]).toFixed(2), 'buts'));
// croisement avec la lecture actuelle
console.log('\nTerre des maisons (actuel) × Terre rapportée :'); const c = {}; P.forEach(p => { const t = Math.sign(p.a.terreMaisons - p.e.terreMaisons), u = Math.sign(p.a.terreT - p.e.terreT), k = !t && !u ? 'les deux à égalité' : !t ? 'rapportée seule' : !u ? 'maisons seules' : t === u ? 'accord' : 'opposés'; c[k] = c[k] || { ok: 0, ko: 0, nul: 0, okU: 0 }; if (!p.d.r) c[k].nul++; else { const v = k === 'rapportée seule' ? u : t; if (v) { if (v === p.d.r) c[k].ok++; else c[k].ko++; } if (k === 'opposés' && u === p.d.r) c[k].okU++; } }); console.log(JSON.stringify(c));
