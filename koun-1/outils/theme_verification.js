// THÈME DE VÉRIFICATION (propriétaire, 2026-11-28) : l'axe angulaire du thème (M1, M4, M7, M10) développé en thème de 16 figures — ses quatre figures deviennent
// les mères d'un nouveau thème. Il montre les zones d'ombre du thème principal. Première étape demandée : les matchs à grand écart (3 buts ou plus).
// Pour chaque match : les pôles du thème principal et ce qu'ils deviennent dans le thème de vérification (posés ou non, chez eux, bloqués), les pôles et le
// verdict du thème de vérification, et les figures absentes du thème principal qui y apparaissent.
// Usage : node outils/theme_verification.js [écart minimal, 3 par défaut]
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), N = K.nom;
const lire = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
const tous = new Map(), aj = (t, s, nom, lot) => { const k = t.join('-'); if (!tous.has(k)) tous.set(k, { m: t, sc: s, nom, lot }); };
lire('validation/scores-reels.json').forEach(x => aj(x.themes, x.score, x.match, 'dév.')); lire('validation/themes-18.json').forEach(x => aj(x.themes, x.score.split('-').map(Number), x.match || '?', 'dév.'));
aj(lire('validation/lot-2.json')[0].themes[0], lire('validation/lot-2.json')[0].score.split('-').map(Number), 'lot 2', 'dév.');
['validation/resultats-aveugles-2026-11-23.json', 'validation/resultats-aveugles-2026-11-25.json', 'validation/resultats-2026-11-25.json'].forEach(f => lire(f).matchs.forEach(x => aj(x.theme, x.score, x.match, 'dév.')));
lire('validation/resultats-2026-11-26.json').matchs.forEach(x => aj(x.theme, x.score, x.match, '26/11')); lire('validation/resultats-2026-11-27.json').matchs.forEach(x => aj(x.theme, x.score, x.match, '27/11'));
const ANG = [1, 4, 7, 10], verif = L => M.lire(ANG.map(h => L.theme.bases[h]));
const presentes = L => { const s = new Set(); for (let h = 1; h <= 16; h++) { s.add(L.theme.bases[h]); s.add(L.resu(h)); } return s; };
// état d'une figure dans un thème : maisons où elle est posée, chez elle, bloquée (définition du moteur : antagoniste présent intact)
function etat(L, f) { const b = L.theme.bases, pos = []; for (let h = 1; h <= 16; h++) if (b[h] === f) pos.push(h);
  const chez = b[f] === f, bl = M.bloqueurs(L, f, chez ? f : undefined); return { pos, chez, bl, txt: (pos.length ? 'posée en M' + pos.join(', M') : 'absente') + (chez ? ', chez elle' : '') + (bl.length ? ', bloquée (' + bl.map(x => N(x.figure) + (x.type === 'populus' ? ' reproduit par Populus' : ' ' + x.type) + ' en M' + x.maison).join(', ') + ')' : ', libre') }; }
const D = [...tous.values()].map(d => { const L = M.lire(d.m), V = verif(L), HV = M.hierarchie(V), r = d.sc[0] > d.sc[1] ? 'R1' : d.sc[0] < d.sc[1] ? 'R7' : 'N';
  const E = { R1: etat(V, L.R1.figure), R7: etat(V, L.R7.figure) }, abs = [...Array(16)].map((_, i) => i + 1).filter(f => !presentes(L).has(f)), revel = abs.filter(f => presentes(V).has(f));
  return { ...d, L, V, HV, r, E, abs, revel, ecart: Math.abs(d.sc[0] - d.sc[1]) }; });
const mod = n => ((n - 1) % 16 + 16) % 16 + 1, rel = (f, g) => g === f ? 'même figure' : g === 16 ? 'Populus' : g === mod(f - 3) ? 'antagoniste' : g === mod(f + 3) ? 'victime' : g === mod(f - 6) ? 'protecteur' : g === mod(f + 4) ? 'front direct' : g === mod(f + 8) ? 'miroir' : (g - 1) % 4 === (f - 1) % 4 ? 'même front' : (g % 2) === (f % 2) ? 'même boucle' : 'autre boucle';
D.forEach(d => { const bV = d.V.theme.bases; d.rel = { R1: rel(d.L.R1.figure, bV[d.L.R1.maison]), R7: rel(d.L.R7.figure, bV[d.L.R7.maison]) }; });
const arg = process.argv[2] || 'grands', min = 3, fig = f => N(f), P = (L, p) => p + ' ' + fig(L[p].figure) + ' en M' + L[p].maison;
const larges = D.filter(d => arg === 'nuls' ? d.ecart === 0 : arg === 'petites' ? d.ecart > 0 && d.ecart < min : d.ecart >= min).sort((a, b) => b.ecart - a.ecart || (b.sc[0] + b.sc[1]) - (a.sc[0] + a.sc[1]));
console.log((arg === 'nuls' ? 'Nuls' : arg === 'petites' ? 'Petites victoires (1 ou 2 buts d\'écart)' : 'Matchs à ' + min + ' buts d\'écart ou plus') + ' : ' + larges.length + ' sur ' + D.length + ' (usage : node outils/theme_verification.js [grands|petites|nuls])\n');
larges.forEach(d => { const V = d.V, dv = d.HV.decision;
  console.log(d.nom + ' ' + d.sc.join('-') + ' (' + d.lot + ') — thème ' + d.m.join('-') + ' · vainqueur ' + d.r + ' · axe angulaire M1 M4 M7 M10 = ' + ANG.map(h => fig(d.L.theme.bases[h])).join(', ') + ' → vérification ' + ANG.map(h => d.L.theme.bases[h]).join('-'));
  console.log('   pôles du thème principal dans la vérification : R1 ' + fig(d.L.R1.figure) + ' ' + d.E.R1.txt + ' · R7 ' + fig(d.L.R7.figure) + ' ' + d.E.R7.txt);
  console.log('   maisons des pôles principaux dans la vérification : M' + d.L.R1.maison + ' porte ' + fig(V.theme.bases[d.L.R1.maison]) + ' (' + d.rel.R1 + ' de R1) · M' + d.L.R7.maison + ' porte ' + fig(V.theme.bases[d.L.R7.maison]) + ' (' + d.rel.R7 + ' de R7) · vérification en ' + ({ MEME_FRONT: 'même front', MEME_BOUCLE: 'même boucle', BOUCLES_DIFFERENTES: 'boucles différentes' })[V.mode]);
  console.log('   pôles de la vérification : ' + P(V, 'R1') + ', ' + P(V, 'R7') + ' · verdict ' + (dv === 'N' ? 'égalité' : dv === '1' ? 'R1' : 'R7') + ' · R1 ' + (d.HV.R1.marque ? 'marque' : 'ne marque pas') + ', R7 ' + (d.HV.R7.marque ? 'marque' : 'ne marque pas'));
  console.log('   figures absentes du thème principal : ' + (d.abs.map(fig).join(', ') || 'aucune') + (d.abs.length ? ' · révélées par la vérification : ' + (d.revel.map(fig).join(', ') || 'aucune') : '') + '\n'); });
// comparaison des groupes
const G = [['grands écarts (≥ ' + min + ')', D.filter(d => d.ecart >= min)], ['petites victoires (1-2)', D.filter(d => d.ecart > 0 && d.ecart < min)], ['nuls avec buts', D.filter(d => d.ecart === 0 && d.sc[0] > 0)], ['0-0', D.filter(d => d.sc[0] === 0 && d.sc[1] === 0)]];
const pc = (a, n) => n ? Math.round(100 * a / n) + ' %' : '—', ligne = (lab, f) => console.log('  ' + lab.padEnd(62) + G.map(([, S]) => pc(S.filter(f).length, S.length).padStart(6)).join('   '));
console.log('Comparaison' + ''.padEnd(54) + G.map(([g, S]) => g.slice(0, 9) + ' (' + S.length + ')').join('  '));
ligne('les deux pôles principaux bloqués dans la vérification', d => d.E.R1.bl.length && d.E.R7.bl.length);
ligne('aucun des deux bloqué', d => !d.E.R1.bl.length && !d.E.R7.bl.length);
ligne('un seul des deux bloqué', d => !!d.E.R1.bl.length !== !!d.E.R7.bl.length);
ligne('vainqueur libre et perdant bloqué (victoires)', d => d.r !== 'N' && !d.E[d.r].bl.length && d.E[d.r === 'R1' ? 'R7' : 'R1'].bl.length);
ligne('vainqueur bloqué et perdant libre (victoires)', d => d.r !== 'N' && d.E[d.r].bl.length && !d.E[d.r === 'R1' ? 'R7' : 'R1'].bl.length);
ligne('les deux pôles principaux absents des bases de la vérification', d => !d.E.R1.pos.length && !d.E.R7.pos.length);
ligne('verdict de la vérification = le résultat', d => (d.HV.decision === 'N' ? 'N' : d.HV.decision === '1' ? 'R1' : 'R7') === d.r);
ligne('vérification : les deux de ses pôles marquent', d => d.HV.deux.oui);
ligne('vérification : égalité annoncée', d => d.HV.decision === 'N');
ligne('figures absentes du principal révélées par la vérification', d => d.revel.length > 0);
ligne('vérification en même front', d => d.V.mode === 'MEME_FRONT');
ligne('pôles de la vérification : même figure', d => d.V.R1.figure === d.V.R7.figure);
ligne('une maison de pôle porte son miroir dans la vérification', d => d.rel.R1 === 'miroir' || d.rel.R7 === 'miroir');
ligne('une maison de pôle porte une figure de l\'autre boucle', d => d.rel.R1 === 'autre boucle' || d.rel.R7 === 'autre boucle');
// combinaison trouvée en regardant ces mêmes matchs (à confirmer sur les matchs à venir)
const combi = d => !d.E.R1.bl.length && !d.E.R7.bl.length && d.rel.R1 !== 'miroir' && d.rel.R7 !== 'miroir' && (d.rel.R1 === 'autre boucle' || d.rel.R7 === 'autre boucle');
{ const S = D.filter(combi), n = S.filter(d => d.r === 'N').length; console.log('\nPiste du nul (choisie sur ces matchs, à confirmer) : pôles principaux libres dans la vérification, aucune maison de pôle qui porte son miroir, une qui porte une figure de l\'autre boucle → ' + n + ' nuls sur ' + S.length + ' (' + pc(n, S.length) + ') · ' + ['dév.', '26/11', '27/11'].map(l => { const U = S.filter(d => d.lot === l); return l + ' ' + U.filter(d => d.r === 'N').length + '/' + U.length; }).join(' · ') + ' ; ensemble ' + D.filter(d => d.r === 'N').length + '/' + D.length); }
// verdict du thème principal sur les mêmes matchs, et nuls selon l'état des pôles principaux dans la vérification
console.log('\nVerdict du thème principal = le résultat :' + G.map(([g, S]) => '  ' + g.slice(0, 9) + ' ' + pc(S.filter(d => { const h = M.hierarchie(d.L).decision; return (h === 'N' ? 'N' : h === '1' ? 'R1' : 'R7') === d.r; }).length, S.length)).join(''));
const groupe = d => !d.E.R1.bl.length && !d.E.R7.bl.length ? 'aucun pôle principal bloqué dans la vérification' : d.E.R1.bl.length && d.E.R7.bl.length ? 'les deux bloqués' : 'un seul bloqué';
console.log('\nNuls selon les pôles principaux dans la vérification (tous les matchs ; ensemble ' + D.filter(d => d.r === 'N').length + '/' + D.length + ') :');
for (const g of ['aucun pôle principal bloqué dans la vérification', 'un seul bloqué', 'les deux bloqués']) { const S = D.filter(d => groupe(d) === g); if (!S.length) continue;
  console.log('  ' + g.padEnd(50) + S.filter(d => d.r === 'N').length + '/' + S.length + ' (' + pc(S.filter(d => d.r === 'N').length, S.length) + ') · dév. ' + ['dév.', '26/11', '27/11'].map(l => { const T = S.filter(d => d.lot === l); return l + ' ' + T.filter(d => d.r === 'N').length + '/' + T.length; }).join(' · ')); }
