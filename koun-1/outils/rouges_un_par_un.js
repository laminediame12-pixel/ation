// Les rouges un par un (2026-11-27) : pour chaque match étiqueté, signes du rouge connus — dragon en M6/M12 (Rubeus ou Puer posé en M6 / M12), pôle bloqué,
// front de R7 qui attaque R1 — puis les rouges inexpliqués et les fausses alertes, avec le détail structurel de leurs pôles.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 }, FR = 'ABCD';
D.forEach(d => { const L = d.L = M.lire(d.m), b = L.theme.bases; d.dragon = [6, 12].filter(h => b[h] === 7 || b[h] === 1); d.bl = ['R1', 'R7'].filter(p => M.blocages(L, p).length); d.r7a = ATT[fr(L.R7.figure)] === fr(L.R1.figure); d.rg = oui(d.rouge); });
const sig = d => [d.dragon.length ? 'dragon M' + d.dragon.join('/M') : '', d.bl.length ? 'bloqué ' + d.bl.join('+') : '', d.r7a ? 'R7 attaque R1' : ''].filter(Boolean).join(' · ') || '—';
const desc = d => { const L = d.L; return 'R1 ' + N(L.R1.figure) + ' (M' + L.R1.maison + ', ' + FR[fr(L.R1.figure)] + ') · R7 ' + N(L.R7.figure) + ' (M' + L.R7.maison + ', ' + FR[fr(L.R7.figure)] + ')'; };
console.log('ROUGES (' + D.filter(d => d.rg).length + ')'); D.filter(d => d.rg).forEach(d => console.log('  ' + d.nom.padEnd(36) + ('rouge ' + d.rouge).padEnd(18) + sig(d).padEnd(40) + desc(d)));
const pred = d => !d.r7a && (d.dragon.length > 0 || d.bl.length > 0);
const tp = D.filter(d => d.rg && pred(d)).length, fp = D.filter(d => !d.rg && pred(d)).length, fn = D.filter(d => d.rg && !pred(d)), tn = D.filter(d => !d.rg && !pred(d)).length;
console.log('\nrègle combinée « pas d\'attaque de R7, et dragon en M6/M12 ou pôle bloqué » : rouge ' + tp + '/' + (tp + fp) + ' quand elle s\'allume · ' + fn.length + '/' + (fn.length + tn) + ' quand elle se tait');
console.log('\nrouges inexpliqués :'); fn.forEach(d => console.log('  ' + d.nom.padEnd(36) + sig(d).padEnd(30) + desc(d) + ' · thème ' + d.m.join('-')));
console.log('\nfigure des pôles et rouge (match) :');
const F = {}; D.forEach(d => { const fs2 = new Set([d.L.R1.figure, d.L.R7.figure]); fs2.forEach(f => { F[f] = F[f] || [0, 0]; F[f][0] += d.rg ? 1 : 0; F[f][1]++; }); });
Object.keys(F).sort((a, b) => F[b][0] / F[b][1] - F[a][0] / F[a][1]).forEach(f => console.log('  ' + N(+f).padEnd(15) + F[f][0] + '/' + F[f][1]));
const GROUPES = { 'martiale ou dragon (Rubeus, Puer, Caput, Cauda)': [7, 1, 3, 13], 'dragon (Caput, Cauda)': [3, 13], 'martiale (Rubeus, Puer)': [7, 1], 'Via': [5], 'martiale, dragon ou Via': [7, 1, 3, 13, 5] };
for (const [g, fsG] of Object.entries(GROUPES)) { const a = D.filter(d => fsG.includes(d.L.R1.figure) || fsG.includes(d.L.R7.figure)); console.log('  un pôle ' + g + ' : rouge ' + a.filter(d => d.rg).length + '/' + a.length + ' · autres ' + D.filter(d => !a.includes(d) && d.rg).length + '/' + (D.length - a.length)); }
const MV = [7, 1, 5], R2 = d => !d.r7a && (d.dragon.length > 0 || d.bl.length > 0 || MV.includes(d.L.R1.figure) || MV.includes(d.L.R7.figure));
const ev = (f, lab) => { const a = D.filter(f); console.log(lab + ' : rouge ' + a.filter(d => d.rg).length + '/' + a.length + ' quand elle s\'allume · ' + D.filter(d => !f(d) && d.rg).length + '/' + (D.length - a.length) + ' quand elle se tait'); };
console.log(''); ev(pred, 'règle 1 (dragon ou blocage, sans attaque de R7)'); ev(R2, 'règle 2 (+ pôle Rubeus, Puer ou Via)');
ev(d => d.dragon.length > 0 || d.bl.length > 0, 'dragon ou blocage, attaque de R7 ignorée');
// validation croisée simple : moitié paire / impaire des matchs
for (const part of [0, 1]) { const S = D.filter((d, i) => i % 2 === part); const a = S.filter(pred); console.log('  règle 1, moitié ' + (part ? 'impaire' : 'paire') + ' des matchs : rouge ' + a.filter(d => d.rg).length + '/' + a.length + ' allumée · ' + S.filter(d => !pred(d) && d.rg).length + '/' + (S.length - a.length) + ' éteinte'); }
