// Qui sabote, qui renforce ? Liaisons par parité dans le front de chaque pôle (Terre : front direct ; Feu, Air, Eau : miroir).
// Liaison coupée (1+2) : le saboteur est la figure posée en base dans la maison dont le niveau est impair. Liaison renforcée : 1+1 = 2, deux intrus qui s'annulent.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const fr = n => (n - 1) % 4;
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }));
function analyse(L, moi, lui) {
  const T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16], odd = (h, l) => K.niveaux(rz(h))[l] === 1, z = fr(moi.figure), za = fr(lui.figure);
  const H = z + 1, Dr = z + 5, Ba = z + 9, G = z + 13, liens = [[H, Dr, 3], [Ba, G, 3]]; for (let l = 0; l < 3; l++) liens.push([H, Ba, l], [Dr, G, l]);
  const qui = s => fr(s) === z ? 'propre' : fr(s) === za ? 'adverse' : (fr(s) + 2) % 4 === z ? 'allie' : 'autre';
  const o = { coupe: 0, renfort: 0, intact: 0, sab_propre: 0, sab_allie: 0, sab_adverse: 0, sab_autre: 0, ren_propre: 0, ren_allie: 0, ren_adverse: 0, ren_autre: 0, coupeTerre: 0, renfortTerre: 0 };
  liens.forEach(([x, y, l]) => { const a = odd(x, l), c = odd(y, l);
    if (a !== c) { o.coupe++; if (l === 3) o.coupeTerre++; o['sab_' + qui(b[a ? x : y])]++; }
    else if (a && c) { o.renfort++; if (l === 3) o.renfortTerre++; o['ren_' + qui(b[x])]++; o['ren_' + qui(b[y])]++; }
    else o.intact++; });
  return o;
}
const P = D.map(d => ({ d, a: analyse(d.L, d.L.R1, d.L.R7), e: analyse(d.L, d.L.R7, d.L.R1) }));
const keys = Object.keys(P[0].a);
const run = rr => { const out = {}; keys.forEach(k => { let ok = 0, ko = 0, eg = 0, ne = 0; P.forEach((p, i) => { const s = Math.sign(p.e[k] - p.a[k]); /* le MOINS saboté / renforcé gagne ? signe : moins = gagne */ if (!s) { eg++; if (!rr[i]) ne++; } else if (rr[i]) { if (s === rr[i]) ok++; else ko++; } }); out[k] = { ok, ko, eg, ne, z: (ok - ko) / Math.sqrt(ok + ko || 1) }; }); return out; };
const sc0 = D.map(d => d.r), obs = run(sc0);
console.log(D.length, 'matchs, nuls', D.filter(d => d.nul).length, '\n(« le moins … gagne » : justes / faux ; un nombre de justes bien inférieur aux faux veut dire que c\'est le plus … qui gagne)');
const lab = { coupe: 'liaisons coupées', renfort: 'liaisons renforcées (1+1)', intact: 'liaisons intactes (2+2)', sab_propre: 'sabotées par ses propres figures', sab_allie: 'sabotées par l\'allié', sab_adverse: 'sabotées par le front adverse', sab_autre: 'sabotées par l\'autre front', ren_propre: 'renforts par ses propres figures', ren_allie: 'renforts par l\'allié', ren_adverse: 'renforts par le front adverse', ren_autre: 'renforts par l\'autre front', coupeTerre: 'liaisons Terre coupées', renfortTerre: 'liaisons Terre renforcées' };
keys.forEach(k => { const o = obs[k]; console.log('  ', ('le moins de ' + lab[k]).padEnd(52), 'gagne', String(o.ok).padStart(2), 'perd', String(o.ko).padStart(2), '| égalité', o.eg, 'dont', o.ne, 'nuls (' + Math.round(100 * o.ne / o.eg) + ' %)'); });
const bz = Math.max(...Object.values(obs).map(o => Math.abs(o.z))); let ge = 0; for (let t = 0; t < 2000; t++) { const z = sc0.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } if (Math.max(...Object.values(run(z)).map(o => Math.abs(o.z))) >= bz) ge++; }
console.log('   meilleur test atteint par hasard dans', (100 * ge / 2000).toFixed(1) + ' % des mélanges');
// buts encaissés / marqués selon le sabotage adverse
for (const k of ['sab_adverse', 'ren_adverse', 'sab_propre', 'coupe']) { const g = {}; P.forEach(p => [[p.a, p.d.sc[0], p.d.sc[1]], [p.e, p.d.sc[1], p.d.sc[0]]].forEach(([o, gm, ge2]) => { const v = Math.min(o[k], 4); g[v] = g[v] || [0, 0, 0, 0]; g[v][0]++; if (gm > 0) g[v][1]++; g[v][2] += gm; g[v][3] += ge2; })); console.log('\n' + lab[k] + ' :', Object.keys(g).sort().map(v => v + ' → ' + g[v][1] + '/' + g[v][0] + ' marquent, ' + (g[v][2] / g[v][0]).toFixed(1) + ' pour, ' + (g[v][3] / g[v][0]).toFixed(1) + ' contre').join(' · ')); }
const c={};P.forEach(p=>{const Q=M.marquage(p.d.L),x=Math.sign(Q.R1.n-Q.R7.n),y=Math.sign(p.e.renfortTerre-p.a.renfortTerre),k=!x&&!y?'aucun':!x?'Terre renforcée seule':!y?'balance seule':x===y?'accord':'opposés';c[k]=c[k]||{juste:0,faux:0,nul:0};if(!p.d.r)c[k].nul++;else if(k!=='aucun'){const v=k==='Terre renforcée seule'||k==='opposés'?y:x;if(v===p.d.r)c[k].juste++;else c[k].faux++}});console.log('\nbalance de la Terre × moins de Terre renforcée (« opposés » compté selon la Terre renforcée) :',JSON.stringify(c));
