// Vérifie que chaque condition intégrée s'applique à TOUS les thèmes (les 65 536 combinaisons de mères), sans exception :
//   aucun plantage ; R1 / R7 marque = la règle de marquage (rien ne l'impose) ; un seul pôle marque → il gagne ; deux marquent = les deux pôles marquent ;
//   mi-temps : seulement des pôles qui marquent ; buts ≥ nombre de pôles qui marquent. Usage : node outils/verifier_tout.js
const M = require('../moteur4/moteur.js'), err = {}, e = (k, t) => { err[k] = err[k] || { n: 0, ex: t }; err[k].n++; }; let n = 0;
for (let a = 1; a <= 16; a++) for (let b = 1; b <= 16; b++) for (let c = 1; c <= 16; c++) for (let d = 1; d <= 16; d++) { const t = [a, b, c, d], s = t.join('-'); n++;
  let L, H; try { L = M.lire(t); H = M.hierarchie(L); M.verdict(L); M.incidentVerdict(L); } catch (x) { e('plantage : ' + x.message, s); continue; }
  const p1 = M.marquePole(L, 'R1').marque, p7 = M.marquePole(L, 'R7').marque;
  if (H.R1.marque !== p1 || H.R7.marque !== p7 || H.R1.impose || H.R7.impose) e('marquage remplacé par une autre partie', s);
  if (p1 !== p7 && H.decision !== (p1 ? '1' : '2')) e('un seul pôle marque mais il ne gagne pas', s);
  if (H.deux.oui !== (p1 && p7)) e('« deux marquent » différent de la règle de marquage', s);
  if (H.mt1.marqueurs.concat(H.mt2.marqueurs).some(p => !H[p].marque)) e('mi-temps : but pour un pôle qui ne marque pas', s);
  if (H.buts.valeur < (p1 ? 1 : 0) + (p7 ? 1 : 0)) e('buts < pôles qui marquent', s); }
console.log(n + ' thèmes vérifiés'); const k = Object.keys(err); if (!k.length) console.log('toutes les conditions s\'appliquent à tous les thèmes'); else k.forEach(x => console.log('  ' + err[x].n + '  ' + x + '   ex. ' + err[x].ex));
process.exit(k.length ? 1 : 0);
