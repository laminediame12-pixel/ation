// Ajout au lot du 25 au 30 novembre : Ligue des champions (25/11), Arabie saoudite, MLS complétée (10 matchs du 24 au 30).
// Les dates MLS sont celles en heure GMT (un match à 20h ET tombe le lendemain), comme dans le lot précédent.
// Les thèmes déjà tirés ne sont jamais retirés : St. Louis – LAFC et San Jose – Houston reprennent leur thème du lot du 20 au 25.
const fs = require('fs'), crypto = require('crypto'), path = require('path'), M = require('../moteur4/moteur.js');
const F = path.join(__dirname, '../validation/themes-25-30-novembre.json'), T = JSON.parse(fs.readFileSync(F, 'utf8'));
if (T.some(x => x.championnat === 'Ligue des champions')) { console.log('ajout déjà fait (on ne retire pas)'); process.exit(0); }
const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const tirer = (c, d, e1, e2, theme) => { const j = new Date(d + 'T12:00:00Z').getUTCDay(); let t = theme, n = 0;
  if (!t) do { t = [0, 1, 2, 3].map(() => 1 + crypto.randomInt(16)); n++; } while (!M.fiabilite(M.lire(t), j).valide);
  if (!M.fiabilite(M.lire(t), j).valide) throw new Error('thème non valide : ' + e1 + ' – ' + e2);
  return { date: d, championnat: c, equipe1: e1, equipe2: e2, jour: JOURS[j], theme: t.join('-'), essais: n || 'repris du lot du 20 au 25' }; };
// la MLS du premier tirage avait des dates en heure de l'Est : on la remplace (ces thèmes n'avaient encore servi à rien)
const R = T.filter(x => x.championnat !== 'MLS');
['Sabah|Barcelona', 'Slavia Prague|Villarreal', 'Atlético|Viking', 'Club Bruges|Liverpool', 'Inter|Stuttgart', 'Shakhtar Donetsk|Fenerbahçe', 'Lille|Bayern', 'PSG|Roma', 'Sporting|Manchester United']
  .forEach(m => R.push(tirer('Ligue des champions', '2026-11-25', ...m.split('|'))));
[['2026-11-26', 'Al Fateh|Al Riyadh'], ['2026-11-26', 'Abha|Al Shabab'], ['2026-11-26', 'Al Faisaly|Al Diriyah'], ['2026-11-27', 'Al Kholood|Al Khaleej'], ['2026-11-27', 'Al Qadsiah|Al Fayha'], ['2026-11-27', 'Al Ittihad|NEOM'], ['2026-11-28', 'Al Hazem|Al Nassr'], ['2026-11-28', 'Al Ettifaq|Al Hilal'], ['2026-11-28', 'Al Ahli|Al Taawoun']]
  .forEach(([d, m]) => R.push(tirer('Arabie saoudite', d, ...m.split('|'))));
R.push(tirer('MLS', '2026-11-24', 'St. Louis', 'LAFC', [6, 1, 11, 12]));
R.push(tirer('MLS', '2026-11-25', 'San Jose', 'Houston', [14, 9, 11, 5]));
[['2026-11-28', 'Columbus|Inter Miami'], ['2026-11-28', 'Real Salt Lake|Vancouver'], ['2026-11-28', 'Charlotte|Chicago'], ['2026-11-28', 'Houston|San Jose'], ['2026-11-28', 'Philadelphie|New England'], ['2026-11-28', 'FC Cincinnati|Nashville'], ['2026-11-29', 'LAFC|St. Louis'], ['2026-11-29', 'Portland|FC Dallas']]
  .forEach(([d, m]) => R.push(tirer('MLS', d, ...m.split('|'))));
fs.writeFileSync(F, JSON.stringify(R, null, 1));
console.log(R.length, 'thèmes ;', R.filter(x => x.championnat === 'MLS').length, 'MLS,', R.filter(x => x.championnat === 'Ligue des champions').length, 'C1,', R.filter(x => x.championnat === 'Arabie saoudite').length, 'Arabie saoudite');
