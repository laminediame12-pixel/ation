// Tirage automatique d'un thème valide (témoin 4/4 en base) pour un match daté.
// Usage : node tirage_valide.js "Équipe 1" "Équipe 2" 2026-11-12 19:00
// Même méthode que la page : 16 lignes de 7 à 22 points tirées par le générateur sûr du système ; on retire tant que le témoin n'est pas complet.
const crypto = require('crypto');
const K = require('../moteur2/moteur.js');
const PTS = { 'Puer': '1121', 'Laetitia': '1222', 'Caput': '2111', 'Albus': '2212', 'Via': '1111', 'Amissio': '1212', 'Rubeus': '2122', 'Tristitia': '2221', 'Fortuna Minor': '1122', 'Carcer': '1221', 'Conjunctio': '2112', 'Fortuna Major': '2211', 'Cauda Draconis': '1112', 'Puella': '1211', 'Aquisitio': '2121', 'Populus': '2222' };
function tirer(date) {
  for (let essais = 1; essais <= 5000; essais++) {
    const lignes = Array.from({ length: 16 }, () => crypto.randomInt(7, 23));
    const meres = [0, 1, 2, 3].map(i => { const c = lignes.slice(i * 4, i * 4 + 4).map(n => n % 2 === 0 ? 2 : 1).join(''); return K.FIG.find(f => PTS[f] === c); });
    const th = K.construireTheme(...meres), t = K.temoin(th, date);
    if (t.valide) return { essais, lignes, meres, th, t };
  }
  return null;
}
module.exports = { tirer };
if (require.main === module) {
  const [e1, e2, jour, heure] = process.argv.slice(2), [a, m, j] = jour.split('-').map(Number), [h, mi] = heure.split(':').map(Number);
  const r = tirer(new Date(a, m - 1, j, h, mi)); if (!r) { console.log('aucun thème valide trouvé'); process.exit(1); }
  const d = K.analyser(r.th).decision, v = d.verdict === '1' ? 'Victoire ' + e1 : d.verdict === '2' ? 'Victoire ' + e2 : 'Nul';
  console.log(JSON.stringify({ match: e1 + ' – ' + e2, heure, essais: r.essais, meres: r.meres.map(f => K.num(f)).join(' · '), noms: r.meres.join(', '), verdict: v, cas: d.phase, ancrages: d.marches.ancragesR1 + '/' + d.marches.ancragesR7, doubleChance: d.marches.doubleChance, douze: d.marches.douze, jour: r.t.lignes[2].figure, raison: d.raison }));
}
