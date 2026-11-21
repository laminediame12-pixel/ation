// Ajoute à un fichier de thèmes (cartes <section class="card" data-i> + tableau DATA) le verdict du moteur 4 pour chaque match, et écrit les prédictions gelées.
// Usage : node outils/verdicts_fichier.js entrée.html sortie.html predictions.json
const fs = require('fs'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js');
const [, , ent, sor, pred] = process.argv;
let s = fs.readFileSync(ent, 'utf8');
const D = JSON.parse(s.match(/DATA=(\[.*?\]);?\s*\n/)[1]);
const esc = x => String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const pct = x => Math.round(100 * x) + ' %', ecarts = [], P = [];
D.forEach(d => {
  const L = M.lire(d.th), T = L.theme;
  // contrôle : le fichier et le moteur donnent les mêmes maisons et les mêmes pôles
  for (let h = 1; h <= 16; h++) { const r = h < 16 ? T.resultantes[h] : T.bases[16]; if (d.h[h - 1][0] !== T.bases[h] || (h < 16 && d.h[h - 1][1] !== r)) ecarts.push(d.i + ' M' + h); }
  if (d.r1 !== L.R1.maison || d.r7 !== L.R7.maison) ecarts.push(d.i + ' pôles');
  const V = M.verdict(L), Q = M.marquage(L), I = M.incident(L), Y = M.rythme(L);
  const vic = V.v ? 'Victoire ' + (V.v === '1' ? d.e1 : d.e2) : 'Pas d’appel';
  const vs = V.v ? (V.regle === 'H-REPOS' ? 'H-REPOS, règle du propriétaire' : 'coordonnées, piste en observation') : 'aucune règle ne se prononce';
  const inc = I.niveau === 'probable' ? 'Probable' : I.niveau === 'possible' ? 'Possible' : 'Pas d’indice';
  const rouge = I.rouge.probable ? ' · rouge probable' + (I.rouge.cote ? ' côté ' + (I.rouge.cote === 'R1' ? d.e1 : d.e2) : '') : '';
  const dm = Q.temoin.deuxMarquent ? 'Oui' : Q.temoin.obsPas.oui === 0 ? 'Non (binôme)' : pct(Q.temoin.obsPas.oui / Q.temoin.obsPas.sur);
  const lignes = [
    ['Victoire', vic, vs, V.v === '1' ? 'k1' : V.v === '2' ? 'k7' : ''],
    [d.e1 + ' marque', Q.R1.niveau.charAt(0).toUpperCase() + Q.R1.niveau.slice(1) + ' · ' + pct(Q.R1.p2n) + ' (2 buts ou plus)', 'Terre saturée sur ' + Q.R1.n + '/4 maisons du front ' + Q.R1.front + ' · ' + Q.R1.repos + ' figure(s) au repos', Q.R1.p2n >= .5 ? 'ko' : 'kx'],
    [d.e2 + ' marque', Q.R7.niveau.charAt(0).toUpperCase() + Q.R7.niveau.slice(1) + ' · ' + pct(Q.R7.p2n) + ' (2 buts ou plus)', 'Terre saturée sur ' + Q.R7.n + '/4 maisons du front ' + Q.R7.front + ' · ' + Q.R7.repos + ' figure(s) au repos', Q.R7.p2n >= .5 ? 'ko' : 'kx'],
    ['Deux marquent', dm, 'Terre de M5+M7 (' + K.nom(Q.temoin.figure) + ') ' + (Q.temoin.terreSaturee ? 'saturée' : 'non saturée'), Q.temoin.deuxMarquent ? 'ko' : ''],
    ['Buts au total', '≈ ' + String(Q.butsAttendus).replace('.', ','), 'somme des buts moyens des deux niveaux', ''],
    ['Rouge ou penalty', inc + ' · ' + I.score + '/6' + rouge, I.parametres.filter(p => p.actif).map(p => p.id).join(', ') || 'aucun paramètre actif', I.niveau === 'probable' ? 'kx' : ''],
    ['But en 1re mi-temps', Y.butAttendu ? 'Oui : ' + (Y.marqueurs.length ? Y.marqueurs.map(p => p === 'R1' ? d.e1 : d.e2).join(' et ') : 'équipe non déterminée') : 'Pas de but attendu', Y.cause + ' · puissance ' + Y.puissance + ' · ' + Y.vitesse + ' (1-5-12-15 = ' + K.nom(Y.figure) + ')', Y.butAttendu ? 'ko' : '']];
  const bloc = '<div class="kv"><div class="kvt">Verdict koun (moteur ' + M.version + ')</div>' + lignes.map(l => '<div class="kr"><span class="kl">' + esc(l[0]) + '<small>' + esc(l[2]) + '</small></span><span class="kg ' + l[3] + '">' + esc(l[1]) + '</span></div>').join('') + '</div>';
  const re = new RegExp('(<section class="card"[^>]*data-i="' + d.i + '">[\\s\\S]*?)(</section>)');
  if (!re.test(s)) ecarts.push(d.i + ' carte introuvable');
  s = s.replace(re, (m, a, b) => a + bloc + b);
  P.push({ i: d.i, date: d.d, competition: d.c, match: d.e1 + ' – ' + d.e2, theme: d.th, victoire: V.v ? (V.v === '1' ? 'R1' : 'R7') : null, regle: V.regle, nR1: Q.R1.n, nR7: Q.R7.n, deuxMarquent: Q.temoin.deuxMarquent, butsAttendus: Q.butsAttendus, incident: I.niveau, incidentScore: I.score, rouge: I.rouge.probable ? (I.rouge.cote || 'côté non déterminé') : null, rythme: Y.vitesse, butPremiereMT: Y.butAttendu, marqueursPremiereMT: Y.marqueurs, puissance: Y.puissance });
});
const css = '.kv{margin-top:10px;border-top:1px solid var(--ln);padding-top:8px}.kvt{font-size:11px;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}.kr{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:4px 0;border-bottom:1px dashed var(--ln)}.kr:last-child{border-bottom:0}.kl{font-size:13px;min-width:0;flex:1}.kl small{display:block;color:var(--mu);font-size:11px}.kg{font-size:12.5px;font-weight:600;border:1px solid var(--ln);border-radius:12px;padding:2px 9px;max-width:58%;text-align:right}.kg.k1{border-color:var(--r1);color:var(--r1)}.kg.k7{border-color:var(--r7);color:var(--r7)}.kg.ko{border-color:var(--ac);color:var(--ac)}.kg.kx{border-color:#f59e0b;color:#f59e0b}.kn{font-size:12px;color:var(--mu);margin:4px 0 10px}';
s = s.replace('</style>', css + '</style>');
s = s.replace(/(<p class="s">[\s\S]*?<\/p>)/, '$1<p class="kn">Verdicts du moteur koun ' + M.version + ' ajoutés le 21/11/2026. Victoire : H-REPOS (règle du propriétaire), sinon la piste des coordonnées (en observation). Les autres lignes sont des indices non vérifiés : marquage par la Terre du front direct, témoin M5+M7, détecteur d’incident à six paramètres, rythme 1-5-12-15.</p>');
fs.writeFileSync(sor, s);
fs.writeFileSync(pred, JSON.stringify({ gele_le: '2026-11-21', moteur: M.version, source: 'themes-20-24-novembre (fichier du propriétaire)', note: 'prédictions inscrites avant les scores ; à juger quand les résultats seront connus', matchs: P }, null, 1));
console.log(D.length + ' matchs ; écarts fichier / moteur : ' + (ecarts.length ? ecarts.join(', ') : 'aucun'));
