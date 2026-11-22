// Circuit du propriétaire, dans la boucle de front que le pôle OCCUPE (front de sa maison) :
// pôle P —Terre— front direct Q —Eau— miroir de Q (Q') —Terre— miroir de P (P') —Eau— P. Feu et Air vont ensemble : liaisons miroir P–P' et Q–Q'.
// Liaisons par parité : 2+2 = 2, 1+1 = 2 (liées), 1+2 = 1 (arrêt de l'action).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score)); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number)));
const l2 = lire('validation/lot-2.json')[0]; aj(l2.themes[0], l2.score.split('-').map(Number));
const fr = n => (n - 1) % 4, part = h => { const rk = Math.floor((h - 1) / 4); return rk === 0 || rk === 2 ? h + 4 : h - 4; }, mir = h => h > 8 ? h - 8 : h + 8;
// relations de fronts (propriétaire) : ennemi = front de l'antagoniste (f − 3, front + 1) ; allié = binôme (front + 2) ; proie = front − 1 (celui que la figure attaque)
const rel = (fFig, fMaison) => { const d = ((fMaison - fFig) % 4 + 4) % 4; return d === 0 ? 'propre' : d === 2 ? 'allié' : d === 1 ? 'ennemi' : 'proie'; };
const D = [...tous.values()].map(d => ({ ...d, L: M.lire(d.m), nul: d.sc[0] === d.sc[1] ? 1 : 0, r: Math.sign(d.sc[0] - d.sc[1]) }));
function circuit(L, c) {
  const T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16], lien = (x, y, l) => K.niveaux(A(rz(x), rz(y)))[l] === 2;
  const P = c.maison, Q = part(P), Qp = mir(Q), Pp = mir(P);
  const o = { P, Q, Qp, Pp, terre1: lien(P, Q, 3), eau1: lien(Q, Qp, 2), terre2: lien(Qp, Pp, 3), eau2: lien(Pp, P, 2), feuP: lien(P, Pp, 0), airP: lien(P, Pp, 1), feuQ: lien(Q, Qp, 0), airQ: lien(Q, Qp, 1) };
  o.eauTerre = [o.terre1, o.eau1, o.terre2, o.eau2].filter(Boolean).length; o.feuAir = [o.feuP, o.airP, o.feuQ, o.airQ].filter(Boolean).length;
  o.chaine = o.terre1 ? (o.eau1 ? (o.terre2 ? (o.eau2 ? 4 : 3) : 2) : 1) : 0; // jusqu'où l'action propulsée va avant le premier arrêt
  o.relBoucle = rel(fr(c.figure), fr(P)); // la boucle occupée par rapport au front de la figure du pôle
  o.ennemisDansBoucle = [P, Q, Qp, Pp].filter(h => rel(fr(c.figure), fr(b[h])) === 'ennemi').length; // figures du front ennemi posées dans la boucle occupée
  return o;
}
// exemple 8-5-11-7
{ const L = M.lire([8, 5, 11, 7]); ['R1', 'R7'].forEach(p => { const o = circuit(L, L[p]); console.log('8-5-11-7', p, nm(L[p].figure), 'en M' + o.P, '(boucle ' + o.relBoucle + ') : Terre M' + o.P + '–M' + o.Q, o.terre1 ? 'liée' : 'arrêt', '· Eau M' + o.Q + '–M' + o.Qp, o.eau1 ? 'liée' : 'arrêt', '· Terre M' + o.Qp + '–M' + o.Pp, o.terre2 ? 'liée' : 'arrêt', '· Eau M' + o.Pp + '–M' + o.P, o.eau2 ? 'liée' : 'arrêt', '| Feu/Air', o.feuAir + '/4'); }); }
const Pp = D.map(d => ({ d, a: circuit(d.L, d.L.R1), e: circuit(d.L, d.L.R7) }));
const tests = { 'circuit Eau–Terre lié (0-4)': o => o.eauTerre, 'chaîne propulsée avant le 1er arrêt (0-4)': o => o.chaine, 'liaisons Feu–Air (0-4)': o => o.feuAir, 'Terre pôle–front direct': o => +o.terre1, 'Eau front direct–miroir': o => +o.eau1, 'Terre relais (miroirs)': o => +o.terre2, 'Eau retour au pôle': o => +o.eau2, 'moins d\'ennemis dans la boucle occupée': o => -o.ennemisDansBoucle };
const run = rr => { const out = {}; for (const [k, f] of Object.entries(tests)) { let ok = 0, ko = 0, eg = 0, ne = 0; Pp.forEach((p, i) => { const s = Math.sign(f(p.a) - f(p.e)); if (!s) { eg++; if (!rr[i]) ne++; } else if (rr[i]) { if (s === rr[i]) ok++; else ko++; } }); out[k] = { ok, ko, eg, ne, z: (ok - ko) / Math.sqrt(ok + ko || 1) }; } return out; };
const sc0 = D.map(d => d.r), obs = run(sc0);
console.log('\n' + D.length, 'matchs, nuls', D.filter(d => d.nul).length);
for (const [k, o] of Object.entries(obs)) console.log('  ', k.padEnd(44), 'le plus fort gagne', String(o.ok).padStart(2), 'perd', String(o.ko).padStart(2), '| égalité', o.eg, 'dont', o.ne, 'nuls (' + Math.round(100 * o.ne / o.eg) + ' %)');
const bz = Math.max(...Object.values(obs).map(o => Math.abs(o.z))); let ge = 0; for (let t = 0; t < 2000; t++) { const z = sc0.slice(); for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [z[i], z[j]] = [z[j], z[i]]; } if (Math.max(...Object.values(run(z)).map(o => Math.abs(o.z))) >= bz) ge++; }
console.log('   meilleur test atteint par hasard dans', (100 * ge / 2000).toFixed(1) + ' % des mélanges');
for (const k of ['eauTerre', 'chaine', 'feuAir']) { const g = {}; Pp.forEach(p => [[p.a, p.d.sc[0], p.d.sc[1]], [p.e, p.d.sc[1], p.d.sc[0]]].forEach(([o, gm, ge2]) => { const v = o[k]; g[v] = g[v] || [0, 0, 0, 0]; g[v][0]++; if (gm > 0) g[v][1]++; g[v][2] += gm; g[v][3] += ge2; })); console.log('\nbuts selon ' + k + ' :', Object.keys(g).sort().map(v => v + ' → ' + g[v][1] + '/' + g[v][0] + ' marquent, ' + (g[v][2] / g[v][0]).toFixed(1) + ' pour, ' + (g[v][3] / g[v][0]).toFixed(1) + ' contre').join(' · ')); }
console.log('\nnul selon (Eau–Terre R1, R7) :'); const t = {}; Pp.forEach(p => { const k = p.a.eauTerre + '-' + p.e.eauTerre; t[k] = t[k] || [0, 0]; t[k][0]++; t[k][1] += p.d.nul; }); console.log('  ', Object.keys(t).sort().map(k => k + ' : ' + t[k][1] + '/' + t[k][0]).join(' · '));
console.log('boucle occupée par rapport au front de la figure du pôle :'); const u = {}; Pp.forEach(p => [['R1', p.a, p.d.sc[0]], ['R7', p.e, p.d.sc[1]]].forEach(([q, o, gm]) => { const k = q + ' ' + o.relBoucle; u[k] = u[k] || [0, 0, 0]; u[k][0]++; if (gm > 0) u[k][1]++; u[k][2] += gm; })); console.log('  ', Object.keys(u).sort().map(k => k + ' : ' + u[k][1] + '/' + u[k][0] + ' marquent, ' + (u[k][2] / u[k][0]).toFixed(1) + ' buts').join(' · '));
// variante stricte : liée seulement si les deux niveaux sont saturés (2 et 2)
function strict(L,c){const T=L.theme,b=T.bases,rz=h=>h<16?T.resultantes[h]:b[16],s=(h,l)=>K.niveaux(rz(h))[l]===2,P=c.maison,Q=part(P),Qp=mir(Q),Pp=mir(P);return [s(P,3)&&s(Q,3),s(Q,2)&&s(Qp,2),s(Qp,3)&&s(Pp,3),s(Pp,2)&&s(P,2)].filter(Boolean).length}
{let ok=0,ko=0,eg=0,ne=0;D.forEach(d=>{const s=Math.sign(strict(d.L,d.L.R1)-strict(d.L,d.L.R7));if(!s){eg++;ne+=d.nul}else if(d.r){if(s===d.r)ok++;else ko++}});console.log('\nvariante stricte (2+2 seulement) : le plus lié gagne',ok,'perd',ko,'| égalité',eg,'dont',ne,'nuls')}
// circuit coupé partout (parité) : par pôle
{const g={o:[0,0,0],n:[0,0,0]};Pp.forEach(p=>[[p.a,p.d.sc[0]],[p.e,p.d.sc[1]]].forEach(([o,gm])=>{const k=o.eauTerre===0?'o':'n';g[k][0]++;if(gm>0)g[k][1]++;if(gm>=2)g[k][2]++}));console.log('circuit Eau–Terre coupé partout : marquent',g.o[1]+'/'+g.o[0],', 2 buts ou plus',g.o[2]+'/'+g.o[0],'| autres : marquent',g.n[1]+'/'+g.n[0],', 2+',g.n[2]+'/'+g.n[0])}
// classe de boucle occupée, regroupée
{const g={};Pp.forEach(p=>[[p.a,p.d.sc[0],p.d.sc[1]],[p.e,p.d.sc[1],p.d.sc[0]]].forEach(([o,gm,ge2])=>{const k=o.relBoucle;g[k]=g[k]||[0,0,0,0];g[k][0]++;if(gm>0)g[k][1]++;g[k][2]+=gm;g[k][3]+=ge2}));console.log('boucle occupée (les deux pôles) :',Object.keys(g).map(k=>k+' '+g[k][1]+'/'+g[k][0]+' marquent, '+(g[k][2]/g[k][0]).toFixed(1)+' pour, '+(g[k][3]/g[k][0]).toFixed(1)+' contre').join(' · '))}
{const t={};Pp.forEach(p=>{const k='R1 '+p.a.relBoucle+' / R7 '+p.e.relBoucle;t[k]=t[k]||[0,0,0,0];t[k][0]++;t[k][1]+=p.d.nul;if(p.d.r>0)t[k][2]++;if(p.d.r<0)t[k][3]++});console.log('par paire de boucles :');Object.keys(t).sort().forEach(k=>console.log('   ',k.padEnd(26),'n',t[k][0],'nuls',t[k][1],'R1',t[k][2],'R7',t[k][3]))}
