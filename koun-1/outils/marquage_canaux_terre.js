// Piste du propriétaire (2026-11-26) : sur le marquage, les maisons du canal Terre vertical (M13, M14, M15) et horizontal (M4, M8, M12)
// marquent quand elles sont saturées par le point un de la base (point rouge : niveau à 1 point dans la base, 2 dans la résultante),
// même si leur niveau Terre n'est pas saturé.
// Point rouge en maison h, niveau l : base impaire ET figure de la maison (h) impaire sur l. Lectures : nombre de maisons du canal qui ont au moins
// un point rouge, nombre de niveaux rouges ; le tout « Terre non saturée » à part. Cibles : R1 marque, R7 marque, buts totaux, les deux marquent.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, 'corpus')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), 'corpus'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'corpus');
lire('validation/resultats-aveugles-2026-11-23.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle')); lire('validation/resultats-aveugles-2026-11-25.json').matchs.forEach(x => aj(x.theme, x.score, 'aveugle'));
const imp = f => K.niveaux(f).map(v => v === 1 ? 1 : 0);
const rouges = (b, h) => [0, 1, 2, 3].filter(l => imp(b[h])[l] && imp(h)[l]);       // niveaux rouges de la maison h
const terreRes = (L, h) => K.niveaux(L.theme.resultantes[h])[3] === 2;
const V = [13, 14, 15], H = [4, 8, 12];
const D = [...tous.values()].map(d => { const L = M.lire(d.m), b = L.theme.bases; const f = hs => ({ maisons: hs.filter(h => rouges(b, h).length).length, niveaux: hs.reduce((s, h) => s + rouges(b, h).length, 0), sansTerre: hs.filter(h => rouges(b, h).length && !terreRes(L, h)).length });
  return { ...d, L, v: f(V), h: f(H), g: d.sc[0] + d.sc[1], m1: d.sc[0] > 0, m7: d.sc[1] > 0 }; });
const moy = a => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(2) : '—', pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—';
console.log(D.length + ' matchs ; R1 marque ' + pc(D.filter(d => d.m1).length, D.length) + ', R7 marque ' + pc(D.filter(d => d.m7).length, D.length) + ', buts moyens ' + moy(D.map(d => d.g)) + '\n');
function tab(nom, f) { const t = {}; D.forEach(d => { const k = f(d); t[k] = t[k] || []; t[k].push(d); }); console.log(nom);
  Object.keys(t).sort((a, b) => a - b).forEach(k => { const X = t[k], av = X.filter(d => d.lot === 'aveugle');
    console.log('    ' + String(k).padEnd(4) + ('n ' + X.length).padEnd(6) + ' R1 marque ' + pc(X.filter(d => d.m1).length, X.length).padEnd(6) + ' R7 marque ' + pc(X.filter(d => d.m7).length, X.length).padEnd(6) + ' les deux ' + pc(X.filter(d => d.m1 && d.m7).length, X.length).padEnd(6) + ' buts ' + moy(X.map(d => d.g)) + '   | aveugle : buts ' + moy(av.map(d => d.g)) + ' (' + av.length + ')'); }); console.log(''); }
tab('1. Canal vertical (M13, M14, M15) : maisons avec au moins un point rouge', d => d.v.maisons);
tab('2. Canal horizontal (M4, M8, M12) : maisons avec au moins un point rouge', d => d.h.maisons);
tab('3. Les deux canaux : maisons rouges en tout (0 à 6)', d => d.v.maisons + d.h.maisons);
tab('4. Les deux canaux : maisons rouges dont la Terre de la résultante n\'est PAS saturée', d => d.v.sansTerre + d.h.sansTerre);
tab('5. Niveaux rouges en tout dans les deux canaux', d => Math.min(d.v.niveaux + d.h.niveaux, 8));
// lecture qui ressort : au moins une maison des canaux Terre rouge SANS Terre saturée en résultante (la lecture exacte du propriétaire)
const pc2 = X => X.length ? Math.round(100 * X.filter(d => d.m7).length / X.length) + ' % R7 marque, ' + Math.round(100 * X.filter(d => d.m1 && d.m7).length / X.length) + ' % les deux' : '—';
for (const lot of ['corpus', 'aveugle']) { const X = D.filter(d => d.lot === lot), oui = X.filter(d => d.v.sansTerre + d.h.sansTerre >= 1), non = X.filter(d => d.v.sansTerre + d.h.sansTerre === 0);
  console.log('6. ' + lot.padEnd(8) + ' au moins une : ' + oui.length + ' matchs, ' + pc2(oui) + ' · aucune : ' + non.length + ' matchs, ' + pc2(non)); }
// comparaison avec la lecture « deux marquent » déjà dans le moteur (témoin : Terre de M5 + M7)
const deux = d => d.m1 && d.m7;
const cmp = (nom, f) => { const o = {}; for (const lot of ['corpus', 'aveugle']) { const X = D.filter(d => d.lot === lot); o[lot] = X.filter(d => f(d) === deux(d)).length + '/' + X.length; } console.log('   ' + nom.padEnd(64) + 'corpus ' + o.corpus + ' · aveugle ' + o.aveugle); };
console.log('\n7. « Les deux équipes marquent » (oui / non) — justes');
cmp('moteur actuel (témoin M5 + M7)', d => M.marquage(d.L).temoin.deuxMarquent);
cmp('canaux Terre : au moins une maison rouge sans Terre saturée', d => d.v.sansTerre + d.h.sansTerre >= 1);
cmp('référence : toujours oui', d => true);
cmp('référence : toujours non', d => false);
