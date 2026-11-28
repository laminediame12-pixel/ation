// Rubeus en M6 / M12 et incidents (piste du propriétaire, 2026-11-27) : trois matchs à rouge détaillés (front du camp qui reçoit le rouge et front de son antagoniste), puis Rubeus en base ou en résultante de M6 / M12 sur tous les matchs étiquetés, contrôle par permutation.
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require(R + '/moteur4/moteur.js'), K = require(R + '/moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1, s = f => K.niveaux(f).join('');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')), norm = x => x.toLowerCase().replace(/[^a-zà-ÿ0-9]/g, '');
const th = new Map(); lire('validation/scores-reels.json').forEach(x => th.set(norm(x.match), x.themes));
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => th.set(norm(x.match), x.theme)));
for (const f of ['validation/themes-25-30-novembre.json', 'validation/themes-20-25-novembre.json']) lire(f).forEach(x => { const k = norm(x.equipe1 + ' – ' + x.equipe2); if (!th.has(k)) th.set(k, x.theme.split('-').map(Number)); });
const D = [], vu = new Set(), oui = v => v && !/^non/i.test(v) && v !== 'incertain';
lire('validation/scores-reels.json').filter(x => x.penalty != null && x.rouge != null).forEach(x => { vu.add(norm(x.match)); D.push({ nom: x.match, m: x.themes, pen: x.penalty, rouge: x.rouge }); });
lire('validation/incidents-2026-11.json').matchs.forEach(([n, pen, rouge]) => { const k = norm(n); if (vu.has(k)) return; D.push({ nom: n, m: th.get(k), pen, rouge }); });
const front = f => { const z = (f - 1) % 4; return [z + 1, z + 5, z + 9, z + 13]; };
function detail(nom) { const d = D.find(x => x.nom === nom), L = M.lire(d.m), b = L.theme.bases, r = L.theme.resultantes, p = d.rouge.includes('R1') ? 'R1' : 'R7';
  console.log('\n=== ' + d.nom + ' ' + d.m.join('-') + ' · rouge ' + d.rouge + ' · penalty ' + d.pen); console.log('M6 : ' + N(b[6]) + ' ' + s(b[6]) + ' → ' + N(r[6]) + ' ' + s(r[6]) + '   |   M12 : ' + N(b[12]) + ' ' + s(b[12]) + ' → ' + N(r[12]) + ' ' + s(r[12]));
  const f = L[p].figure, A = mod(f - 3); for (const [lab, g0] of [['camp qui reçoit le rouge ' + p + ' (' + N(f) + ')', f], ['son antagoniste (' + N(A) + ')', A]]) { console.log('  ' + lab + ', front :');
    front(g0).forEach(g => { const hs = []; for (let h = 1; h <= 16; h++) if (b[h] === g) hs.push('M' + h + '→' + N(r[h])); console.log('     ' + N(g).padEnd(15) + (hs.join(', ') || 'absent')); }); }
  const rb = []; for (let h = 1; h <= 16; h++) { if (b[h] === 7) rb.push('base M' + h + '→' + N(r[h])); if (r[h] === 7 && h < 16) rb.push('résultante M' + h + ' (base ' + N(b[h]) + ')'); } console.log('  Rubeus : ' + (rb.join(' ; ') || 'absent')); }
['Liverpool – Manchester United', 'Crystal Palace – Real Sociedad', 'Celta Vigo – Bournemouth'].forEach(detail);
console.log('\n=== Rubeus en M6 / M12 sur les ' + D.length + ' matchs');
const T = {}; D.forEach(d => { const L = M.lire(d.m), b = L.theme.bases, r = L.theme.resultantes, kb = b[6] === 7 || b[12] === 7, kr = r[6] === 7 || r[12] === 7, any = b.slice(1).includes(7) || r.slice(1, 16).includes(7);
  for (const [k, v] of [['Rubeus en base de M6 ou M12', kb], ['Rubeus en résultante de M6 ou M12', kr], ['Rubeus en M6/M12 (base ou résultante)', kb || kr], ['Rubeus ailleurs seulement', any && !(kb || kr)], ['pas de Rubeus du tout', !any]]) {
    T[k] = T[k] || [0, 0, 0, 0, []]; if (v) { T[k][0]++; T[k][1] += oui(d.rouge) ? 1 : 0; T[k][2] += oui(d.pen) ? 1 : 0; T[k][3] += (oui(d.rouge) || oui(d.pen)) ? 1 : 0; if (k.startsWith('Rubeus en M6/M12')) T[k][4].push(d.nom + ((oui(d.rouge) || oui(d.pen)) ? ' ⚠' : '')); } } });
Object.keys(T).forEach(k => console.log('  ' + k.padEnd(40) + T[k][0] + ' matchs · rouge ' + T[k][1] + ' · penalty ' + T[k][2] + ' · rouge ou penalty ' + T[k][3] + '/' + T[k][0] + ' (' + Math.round(100 * T[k][3] / (T[k][0] || 1)) + ' %)'));
console.log('  liste : ' + T['Rubeus en M6/M12 (base ou résultante)'][4].join(' ; '));
console.log('\n=== Rubeus en BASE de M6 ou M12 : détail');
const fr = f => (f - 1) % 4, ATT = { 0: 3, 1: 0, 3: 2, 2: 1 };
for (const H of [6, 12]) { const S = D.filter(d => M.lire(d.m).theme.bases[H] === 7); console.log('  Rubeus en base de M' + H + ' : ' + S.length + ' matchs · rouge ' + S.filter(d => oui(d.rouge)).length + ' · penalty ' + S.filter(d => oui(d.pen)).length);
  S.forEach(d => { const L = M.lire(d.m), z = L.R7.figure, a = L.R1.figure, rel = ATT[fr(z)] === fr(a) ? 'R7 attaque R1' : ATT[fr(a)] === fr(z) ? 'R1 attaque R7' : fr(a) === fr(z) ? 'même front' : 'alliés';
    const proche = ['R1', 'R7'].filter(p => fr(L[p].figure) === fr(7) || fr(L[p].figure) === fr(mod(7 - 3)) || fr(L[p].figure) === fr(mod(7 + 3)));
    console.log('     ' + (oui(d.rouge) ? '🟥' : '  ') + (oui(d.pen) ? '⚽' : '  ') + ' ' + d.nom.padEnd(34) + 'R1 ' + N(a).padEnd(14) + 'R7 ' + N(z).padEnd(14) + rel.padEnd(14) + 'rouge ' + d.rouge + ' · pen ' + d.pen); }); }
const rest = D.filter(d => { const b = M.lire(d.m).theme.bases; return b[6] !== 7 && b[12] !== 7; }); console.log('  sans Rubeus en base de M6/M12 : ' + rest.length + ' matchs · rouge ' + rest.filter(d => oui(d.rouge)).length + ' · penalty ' + rest.filter(d => oui(d.pen)).length);
let k = 0; const y = D.map(d => oui(d.rouge) ? 1 : 0), X = D.map(d => { const b = M.lire(d.m).theme.bases; return b[6] === 7 || b[12] === 7; }), obs = X.reduce((s, x, i) => s + (x ? y[i] : 0), 0);
for (let t = 0; t < 5000; t++) { const z = y.slice().sort(() => Math.random() - 0.5); if (X.reduce((s, x, i) => s + (x ? z[i] : 0), 0) >= obs) k++; } console.log('  hasard : ' + obs + ' rouges ou plus parmi ces 19 matchs dans ' + (100 * k / 5000).toFixed(1) + ' % des tirages');
