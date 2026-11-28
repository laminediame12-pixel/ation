// Fige, avant les scores, les appels de la piste H-POLE-FRONTS sur le lot du 24 au 30 novembre (variante principale : base · fronts distincts).
const fs = require('fs'), path = require('path'), M = require('../moteur4/moteur.js'), R = path.join(__dirname, '..'), out = path.join(R, 'validation/predictions-pole-fronts-24-30-novembre.json');
if (fs.existsSync(out)) { console.log('déjà figé'); process.exit(0); }
const fr = h => (h - 1) % 4, nf = (L, f) => { const s = new Set(); for (let h = 1; h <= 16; h++) if (L.theme.bases[h] === f) s.add(fr(h)); return s.size; };
const T = JSON.parse(fs.readFileSync(path.join(R, 'validation/themes-25-30-novembre.json'), 'utf8'));
const P = T.map(x => { const L = M.lire(x.theme.split('-').map(Number)), a = nf(L, L.R1.figure), b = nf(L, L.R7.figure); return { date: x.date, championnat: x.championnat, match: x.equipe1 + ' – ' + x.equipe2, theme: x.theme, frontsR1: a, frontsR7: b, appel: a > b ? x.equipe1 + ' (R1)' : a < b ? x.equipe2 + ' (R7)' : null }; });
fs.writeFileSync(out, JSON.stringify({ fige_le: '2026-11-23', hypothese: 'H-POLE-FRONTS', regle: 'le pôle dont la figure est posée en base dans plus de fronts différents (A 1-5-9-13, B 2-6-10-14, C 3-7-11-15, D 4-8-12-16) gagne ; égalité = pas d\'appel', matchs: P }, null, 1));
console.log(P.length, 'matchs,', P.filter(p => p.appel).length, 'appels figés');
