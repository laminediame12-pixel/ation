// Évalue le moteur GELÉ sur un lot neuf de matchs réels : node outils/evaluer_lot.js validation/lots/<lot>.json [--a-blanc]
// Un lot neuf ne sert qu'une fois : le résultat est inscrit dans validation/registre.json, et le lot passe en développement.
// Format d'un match : { "equipe1", "equipe2", "date": "jj/mm/aaaa", "theme": "12-9-4-5" (ou "themes": [12,9,4,5]), "score": "2-1" } ; score = équipe 1 - équipe 2.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const K = require('../moteur3/moteur.js');
const racine = path.join(__dirname, '..');
const fichier = process.argv[2], aBlanc = process.argv.includes('--a-blanc');
if (!fichier) { console.error('usage : node outils/evaluer_lot.js validation/lots/<lot>.json [--a-blanc]'); process.exit(1); }
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const hashMoteur = sha(path.join(racine, 'moteur3/moteur.js'));
const gel = JSON.parse(fs.readFileSync(path.join(racine, 'validation/GEL.json'), 'utf8'));
const registreChemin = path.join(racine, 'validation/registre.json');
const registre = fs.existsSync(registreChemin) ? JSON.parse(fs.readFileSync(registreChemin, 'utf8')) : [];
const lot = JSON.parse(fs.readFileSync(fichier, 'utf8')), hashLot = sha(fichier);
const gele = hashMoteur === gel.hashMoteur;
const dejaVu = registre.find(r => r.hashLot === hashLot);
console.log('Moteur : ' + (gele ? 'GELÉ (identique à ' + gel.etiquette + ')' : 'MODIFIÉ depuis le gel ' + gel.etiquette + ' : ce résultat n\'est pas une validation'));
if (dejaVu) console.log('Lot DÉJÀ ÉVALUÉ le ' + dejaVu.date + ' : il est du développement, ce résultat n\'est pas une validation.');
const JOURS = [0, 1, 2, 3, 4, 5, 6];
const jourDe = (d) => { if (!d) return null; const m = String(d).match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/) || null; let a; if (m) a = new Date(+m[3], +m[2] - 1, +m[1]); else { const n = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/); if (!n) return null; a = new Date(+n[1], +n[2] - 1, +n[3]); } return isNaN(a.getTime()) ? null : a.getDay(); };
const lignes = [];
(lot.matchs || []).forEach(m => {
  if (m.exemple) return;   // ligne d'exemple fictive : ignorée
  const t = m.themes || String(m.theme).split(/[-,\s]+/).map(Number), s = String(m.score).match(/(\d+)\s*[-–:]\s*(\d+)/);
  if (!t || t.length !== 4 || t.some(x => !(x >= 1 && x <= 16)) || !s) { console.log('match ignoré (thème ou score illisible) :', JSON.stringify(m)); return; }
  const th = K.construireTheme(...t.map(K.fig)), jour = jourDe(m.date), r = K.analyser(th, jour);
  const a = +s[1], b = +s[2], reel = a > b ? '1' : a < b ? '2' : 'N', T = a + b;
  lignes.push({ m, t, a, b, T, reel, v: r.verdict, valide: r.fiabilite.valide, r, dateOk: jour !== null });
});
const n = lignes.length;
if (!n) { console.log('Aucun match exploitable.'); process.exit(0); }
const wilson = (k, N) => { if (!N) return [0, 0]; const z = 1.96, p = k / N, d = 1 + z * z / N, c = p + z * z / (2 * N), e = z * Math.sqrt(p * (1 - p) / N + z * z / (4 * N * N)); return [Math.max(0, (c - e) / d), Math.min(1, (c + e) / d)]; };
const pc = (x) => Math.round(100 * x) + ' %';
const fmt = (k, N) => N ? k + '/' + N + ' (' + pc(k / N) + ', intervalle à 95 % ' + pc(wilson(k, N)[0]) + ' à ' + pc(wilson(k, N)[1]) + ')' : '0/0';
console.log('\n' + n + ' match(s) évalué(s)\n');
lignes.forEach(l => console.log(((l.m.equipe1 || '') + '–' + (l.m.equipe2 || '')).slice(0, 34).padEnd(34), l.t.join('-').padEnd(11), (l.a + '-' + l.b).padEnd(5), 'verdict', l.v.verdict, l.v.principe.padEnd(5), l.v.verdict === l.reel ? '✓' : '✗', '| prévu', l.r.buts.score, '| ' + (l.valide ? 'valide' : 'non valide') + (l.dateOk ? '' : ' (sans date : 3 critères)')));
const ok = lignes.filter(l => l.v.verdict === l.reel).length, r1 = lignes.filter(l => l.reel === '1').length;
console.log('\nVERDICT : ' + fmt(ok, n) + ' | repère « toujours R1 » : ' + fmt(r1, n));
const par = {}; lignes.forEach(l => { const k = l.v.principe; par[k] = par[k] || [0, 0]; par[k][1]++; if (l.v.verdict === l.reel) par[k][0]++; });
console.log('  par principe : ' + Object.entries(par).map(([k, v]) => k + ' ' + v[0] + '/' + v[1]).join(' · '));
const pv = lignes.filter(l => l.valide), npv = lignes.filter(l => !l.valide);
console.log('  thèmes valides : ' + fmt(pv.filter(l => l.v.verdict === l.reel).length, pv.length) + ' | non valides : ' + fmt(npv.filter(l => l.v.verdict === l.reel).length, npv.length));
['1', '2', 'N'].forEach(c => { const p = lignes.filter(l => l.v.verdict === c); if (p.length) console.log('  quand le moteur prédit ' + (c === 'N' ? 'nul' : 'R' + (c === '1' ? '1' : '7')) + ' : ' + fmt(p.filter(l => l.reel === c).length, p.length)); });
const bt = lignes.filter(l => l.r.buts.deuxMarquent.oui === (l.a > 0 && l.b > 0)).length, o15 = lignes.filter(l => l.r.buts.overUnder.over15 === (l.T > 1.5)).length, o25 = lignes.filter(l => l.r.buts.overUnder.over25 === (l.T > 2.5)).length, o35 = lignes.filter(l => l.r.buts.overUnder.over35 === (l.T > 3.5)).length;
console.log('BUTS : Deux marquent ' + fmt(bt, n) + ' | Over/Under 1,5 : ' + o15 + '/' + n + ', 2,5 : ' + o25 + '/' + n + ', 3,5 : ' + o35 + '/' + n);
if (!aBlanc && gele && !dejaVu) {
  registre.push({ lot: path.basename(fichier), hashLot, date: new Date().toISOString().slice(0, 10), hashMoteur, etiquette: gel.etiquette, matchs: n, verdictJustes: ok, toujoursR1: r1 });
  fs.writeFileSync(registreChemin, JSON.stringify(registre, null, 1));
  console.log('\nRésultat inscrit dans validation/registre.json : ce lot est maintenant du développement.');
} else console.log('\n' + (aBlanc ? 'Essai à blanc : rien n\'est inscrit.' : 'Rien n\'est inscrit au registre (moteur modifié ou lot déjà évalué).'));
