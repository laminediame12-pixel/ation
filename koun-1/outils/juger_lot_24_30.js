// Jugement des prédictions figées du lot du 24 au 30 novembre sur les matchs déjà joués (validation/resultats-2026-11-25.json, puis les suivants).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..');
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const res = []; fs.readdirSync(path.join(R, 'validation')).filter(f => /^resultats-2026-11-(2[5-9]|30)\.json$/.test(f)).forEach(f => res.push(...lire('validation/' + f).matchs));
const P = (f, k) => { const m = new Map(); lire('validation/' + f).matchs.forEach(x => m.set(x.theme + '|' + x.match, x[k])); return m; };
const dec = P('predictions-decision-v3-24-30-novembre.json', 'decision'), nul = P('predictions-decision-v3-24-30-novembre.json', 'nul'), deux = P('predictions-deux-marquent-24-30-novembre.json', 'deux_marquent'),
  m1 = P('predictions-marquage-pole-24-30-novembre.json', 'R1_marque'), m7 = P('predictions-marquage-pole-24-30-novembre.json', 'R7_marque'), fr = P('predictions-pole-fronts-24-30-novembre.json', 'appel');
let o = { dec: 0, deux: 0, m: 0, mn: 0, fr: [0, 0, 0] }; const ok = b => b ? '✓' : '✗';
res.forEach(x => { const k = x.theme.join('-') + '|' + x.match, [a, b] = x.score, r = Math.sign(a - b), [e1, e2] = x.match.split(' – ');
  const d = dec.get(k), dj = d === 'Nul' ? r === 0 : d === 'Victoire ' + e1 ? r > 0 : r < 0; if (dj) o.dec++;
  const dm = deux.get(k) === 'Oui', dmj = dm === (a > 0 && b > 0); if (dmj) o.deux++;
  const p1 = m1.get(k).startsWith('oui'), p7 = m7.get(k).startsWith('oui'); o.m += (p1 === a > 0) + (p7 === b > 0); o.mn += 2;
  const f = fr.get(k); if (f) { if (!r) o.fr[2]++; else if ((f.endsWith('(R1)') ? 1 : -1) === r) o.fr[0]++; else o.fr[1]++; }
  console.log(x.match.padEnd(30) + x.score.join('-').padEnd(5) + ('décision ' + d).padEnd(32) + ok(dj) + '  ' + String(nul.get(k)).padEnd(13) + ' deux marquent ' + (dm ? 'oui' : 'non') + ' ' + ok(dmj) + ' · R1 ' + (p1 ? 'marque' : 'non') + ' ' + ok(p1 === a > 0) + ' · R7 ' + (p7 ? 'marque' : 'non') + ' ' + ok(p7 === b > 0) + (x.penalty || x.rouge ? ' · incident : ' + (x.penalty ? 'penalty ' + x.penalty + ' ' : '') + (x.rouge && x.rouge !== 'Non' ? 'rouge ' + x.rouge : '') : '')); });
console.log('\n' + res.length + ' matchs : décision ' + o.dec + '/' + res.length + ' (« R1 toujours » ' + res.filter(x => x.score[0] > x.score[1]).length + ') · deux marquent ' + o.deux + '/' + res.length + ' · marquage par pôle ' + o.m + '/' + o.mn + ' · piste des fronts ' + o.fr[0] + ' justes, ' + o.fr[1] + ' faux, ' + o.fr[2] + ' nuls');
