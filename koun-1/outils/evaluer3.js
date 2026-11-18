// Évalue le moteur 3 : verdict (27 de développement + lot 1) et sorties de buts (26 scores réels), contre un repère de base.
const fs = require('fs'), path = require('path');
const K3 = require('../moteur3/moteur.js');
const NUM = { '1,1,0,1': 1, '1,0,0,0': 2, '0,1,1,1': 3, '0,0,1,0': 4, '1,1,1,1': 5, '1,0,1,0': 6, '0,1,0,0': 7, '0,0,0,1': 8, '1,1,0,0': 9, '1,0,0,1': 10, '0,1,1,0': 11, '0,0,1,1': 12, '1,1,1,0': 13, '1,0,1,1': 14, '0,1,0,1': 15, '0,0,0,0': 16 };
const DEV = [[10,8,1,8,'N'],[11,7,3,9,'N'],[8,8,4,12,'N'],[13,6,6,15,'N'],[3,14,13,5,'N'],[2,7,2,12,'N'],[5,9,7,13,'N'],[2,9,6,5,'N'],[6,4,10,16,'2'],[3,10,14,5,'2'],[8,5,11,7,'1'],[1,2,6,15,'1'],[3,4,12,3,'1'],[9,13,2,13,'1'],[2,12,4,4,'1'],[4,3,13,12,'1'],[5,14,6,14,'1'],[7,5,9,6,'1'],[13,12,8,15,'2'],[8,7,10,8,'2'],[4,16,1,2,'2'],[4,7,5,8,'1'],[4,7,10,10,'1'],[4,1,6,7,'1'],[4,6,7,16,'1'],[12,6,1,9,'2'],[13,7,3,13,'1']].map(x => ({ m: x.slice(0, 4), a: x[4] }));
const lot = JSON.parse(fs.readFileSync(path.join(__dirname, '../validation/lot-1.json'), 'utf8')).map(e => { const s = e.score.match(/(\d+)-(\d+)/); return { m: e.mVecs.map(v => NUM[v]), a: +s[1] > +s[2] ? '1' : +s[1] < +s[2] ? '2' : 'N', nom: e.t1.trim() + ' – ' + e.t2.trim() }; });
const ok = (set) => { let j = 0; const par = {}, det = []; for (const r of set) { const v = K3.analyser(K3.construireTheme(...r.m.map(K3.fig))).verdict; const w = v.verdict || '—'; if (w === r.a) j++; const k = v.principe || 'aucun'; par[k] = par[k] || [0, 0]; par[k][1]++; if (w === r.a) par[k][0]++; det.push({ r, v }); } return { j, n: set.length, par, det }; };
const D = ok(DEV), L = ok(lot);
const fmt = o => Object.entries(o).map(([k, v]) => k + ' ' + v[0] + '/' + v[1]).join(' · ');
console.log('VERDICT (victoire / nul)');
console.log('  27 de développement :', D.j + '/' + D.n, '| toujours R1 :', DEV.filter(r => r.a === '1').length + '/' + D.n);
console.log('  lot 1 (validation)  :', L.j + '/' + L.n, '| toujours R1 :', lot.filter(r => r.a === '1').length + '/' + L.n);
console.log('  par principe, développement :', fmt(D.par));
console.log('  par principe, lot 1          :', fmt(L.par));
// Tri par fiabilité du thème (FI-1) : les thèmes fiables ou moyens sont étudiés, les thèmes peu fiables sont mis de côté.
const tri = (set) => { const g = { 2: [], 1: [], 0: [] }; set.det.forEach(x => { const L = K3.lire(K3.construireTheme(...x.r.m.map(K3.fig))); g[K3.fiabilite(L).niveau].push(x); }); return g; };
const triD = tri(D), triL = tri(L);
const jt = (a) => a.filter(x => (x.v.verdict || '—') === x.r.a).length;
console.log('  par fiabilité (développement + lot 1) :');
[[2, 'fiables'], [1, 'moyens'], [0, 'peu fiables, mis de côté']].forEach(([n, lib]) => { const a = triD[n].concat(triL[n]); console.log('    ' + lib.padEnd(26) + jt(a) + '/' + a.length + ' (développement ' + jt(triD[n]) + '/' + triD[n].length + ', lot 1 ' + jt(triL[n]) + '/' + triL[n].length + ')'); });
const ret = triD[2].concat(triD[1], triL[2], triL[1]);
console.log('    étudiés (fiables + moyens) : ' + jt(ret) + '/' + ret.length);
const sc = JSON.parse(fs.readFileSync(path.join(__dirname, '../validation/scores-reels.json'), 'utf8'));
let b = 0, o15 = 0, o25 = 0, o35 = 0, mt = 0, nmt = 0, scoreOk = 0, issueOk = 0;
const lignes = [];
for (const e of sc) {
  const r = K3.analyser(K3.construireTheme(...e.themes.map(K3.fig))), T = e.score[0] + e.score[1], both = e.score[0] > 0 && e.score[1] > 0;
  if (r.buts.deuxMarquent.oui === both) b++;
  if (r.buts.overUnder.over15 === (T > 1.5)) o15++; if (r.buts.overUnder.over25 === (T > 2.5)) o25++; if (r.buts.overUnder.over35 === (T > 3.5)) o35++;
  if (e.but_mt1 !== undefined) { nmt++; if (r.buts.butsMT1.oui === e.but_mt1) mt++; }
  lignes.push([e.match.padEnd(36), e.score.join('-').padEnd(4), '→', r.buts.score.padEnd(5), 'deux marquent', r.buts.deuxMarquent.oui ? 'Oui' : 'Non', '| O1.5', r.buts.overUnder.over15 ? 'Over' : 'Under', 'O2.5', r.buts.overUnder.over25 ? 'Over' : 'Under', 'O3.5', r.buts.overUnder.over35 ? 'Over' : 'Under'].join(' '));
}
const n = sc.length, c = f => sc.filter(f).length;
console.log('\nBUTS (' + n + ' scores réels)');
console.log('  Deux marquent :', b + '/' + n, '| repère « toujours Oui » :', c(e => e.score[0] > 0 && e.score[1] > 0) + '/' + n, '| « toujours Non » :', c(e => !(e.score[0] > 0 && e.score[1] > 0)) + '/' + n);
console.log('  Over/Under 1,5 :', o15 + '/' + n, '| repère « toujours Over » :', c(e => e.score[0] + e.score[1] > 1.5) + '/' + n);
console.log('  Over/Under 2,5 :', o25 + '/' + n, '| repère « toujours Over » :', c(e => e.score[0] + e.score[1] > 2.5) + '/' + n);
console.log('  Over/Under 3,5 :', o35 + '/' + n, '| repère « toujours Over » :', c(e => e.score[0] + e.score[1] > 3.5) + '/' + n, '| « toujours Under » :', c(e => e.score[0] + e.score[1] <= 3.5) + '/' + n);
console.log('  But en 1re mi-temps :', mt + '/' + nmt, '(mi-temps connue pour ' + nmt + ' matchs seulement)');
console.log('  Corners, pénalité, carton : aucune donnée réelle, non testés');
if (process.argv.includes('--detail')) { console.log(); lignes.forEach(l => console.log(l)); }
