// Vérifie que chaque condition intégrée s'applique à TOUS les thèmes (les 65 536 combinaisons de mères), sans exception (boucles différentes : règle du propriétaire) :
//   aucun plantage ; R1 / R7 marque = la règle de marquage (le vainqueur annoncé marque toujours, imposé si sa règle dit le contraire) ; un seul pôle marque → R1 gagne, sauf R1 seul par M11 plein → R7 ; deux marquent = les deux pôles marquent ;
//   mi-temps : seulement des pôles qui marquent ; buts ≥ nombre de pôles qui marquent. Usage : node outils/verifier_tout.js
const M = require('../moteur4/moteur.js'), err = {}, e = (k, t) => { err[k] = err[k] || { n: 0, ex: t }; err[k].n++; }; let n = 0;
for (let a = 1; a <= 16; a++) for (let b = 1; b <= 16; b++) for (let c = 1; c <= 16; c++) for (let d = 1; d <= 16; d++) { const t = [a, b, c, d], s = t.join('-'); n++;
  let L, H; try { L = M.lire(t); H = M.hierarchie(L); M.verdict(L); M.incidentVerdict(L); } catch (x) { e('plantage : ' + x.message, s); continue; }
  const p1 = M.marquePole(L, 'R1').marque, p7 = M.marquePole(L, 'R7').marque;
  const BD = M.boucles(L), V = M.verdict(L), w = H.decision === '1' ? 'R1' : H.decision === '2' ? 'R7' : null;
  // marquage : la règle partout ; seule exception, le vainqueur des boucles différentes marque (imposé)
  for (const [p, q] of [['R1', p1], ['R7', p7]]) { const ok = H[p].marque === q ? !H[p].impose : (p === w && H[p].marque && !q && /imposé par la victoire/.test(H[p].impose || '')); if (!ok) e('marquage remplacé hors de l\'exception des boucles différentes', s); }
  // décision : boucles différentes → la règle du propriétaire (sauf égalité) ; même boucle → un seul pôle marque, il gagne
  if (BD.domaine) { if (H.decision !== 'N' && w !== BD.gagnant) e('boucles différentes : la décision n\'est pas celle de la règle', s); if (w && !H[w].marque) e('boucles différentes : le vainqueur ne marque pas', s); }
  else if (p1 !== p7 && V.decision.type !== 'verification' && H.decision !== (p1 && !M.marquePole(L, 'R1').positions.m11 ? '1' : p1 ? '2' : '1')) e('même boucle : un seul pôle marque, la règle corrigée n\'est pas appliquée', s);
  if (H.decision === 'N' && !V.egalite.oui && V.decision.type !== 'bloques' && V.decision.type !== 'verification') e('égalité annoncée sans la condition d\'égalité', s);
  // égalité « vérification » (2026-11-28) : le thème de vérification ne confirme pas le vainqueur et la figure de M7 ou de M14 est commune aux deux thèmes
  { const X = V.verification, pfOk = X && X.cycle === 1 && X.pointFixe[1] !== 8 && L.theme.bases[16] !== 16, cond = X && X.avant !== 'N' && (pfOk || (X.cycle === 2 && X.communes.length && X.decision !== X.avant));
    if (V.decision.type === 'verification' && !cond) e('égalité « vérification » sans sa condition', s);
    if (cond && V.decision.resultat !== 'N') e('condition de l\'égalité « vérification » remplie, mais pas d\'égalité', s); }
  // égalité « pôles bloqués » (2026-11-27) : hors boucles différentes, aucun pôle ne marque et les deux pôles sont bloqués
  if (V.decision.type === 'bloques' && (BD.domaine || p1 || p7 || !M.blocages(L, 'R1').length || !M.blocages(L, 'R7').length)) e('égalité « pôles bloqués » sans sa condition', s);
  if (!BD.domaine && !p1 && !p7 && M.blocages(L, 'R1').length && M.blocages(L, 'R7').length && H.decision !== 'N') e('les deux pôles bloqués sans marquer, mais pas d\'égalité', s);
  if (H.decision === 'N' && p1 !== p7 && V.decision.type !== 'verification') e('égalité alors qu\'un seul pôle marque', s);
  if (H.deux.oui !== (H.R1.marque && H.R7.marque)) e('« deux marquent » différent du marquage final', s);
  if (H.mt1.marqueurs.concat(H.mt2.marqueurs).some(p => !H[p].marque)) e('mi-temps : but pour un pôle qui ne marque pas', s);
  if (H.buts.valeur < (p1 ? 1 : 0) + (p7 ? 1 : 0)) e('buts < pôles qui marquent', s); }
console.log(n + ' thèmes vérifiés'); const k = Object.keys(err); if (!k.length) console.log('toutes les conditions s\'appliquent à tous les thèmes'); else k.forEach(x => console.log('  ' + err[x].n + '  ' + x + '   ex. ' + err[x].ex));
process.exit(k.length ? 1 : 0);
