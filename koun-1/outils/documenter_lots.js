// Documente les matchs des lots neufs évalués (fait constant) : validation/themes-documentes.json et validation/THEMES-DOCUMENTES.md
// Chaque entrée contient le thème complet (16 maisons, base et résultante), les pôles, les critères de validation, ce que le moteur gelé a annoncé et ce qui s'est passé.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const K = require('../moteur3/moteur.js');
const racine = path.join(__dirname, '..');
const registre = JSON.parse(fs.readFileSync(path.join(racine, 'validation/registre.json'), 'utf8'));
const gel = JSON.parse(fs.readFileSync(path.join(racine, 'validation/GEL.json'), 'utf8'));
const hashMoteur = crypto.createHash('sha256').update(fs.readFileSync(path.join(racine, 'moteur3/moteur.js'))).digest('hex');
const jourDe = (d) => { const m = String(d).match(/^(\d{2})\/(\d{2})\/(\d{4})$/); return m ? new Date(+m[3], +m[2] - 1, +m[1]).getDay() : null; };
const entrees = [];
registre.forEach((r) => {
  const lot = JSON.parse(fs.readFileSync(path.join(racine, 'validation/lots', r.lot), 'utf8'));
  (lot.matchs || []).forEach((m) => {
    if (m.exemple) return;
    const t = String(m.theme).split('-').map(Number), th = K.construireTheme(...t.map(K.fig)), jour = jourDe(m.date), a = K.analyser(th, jour), L = a.lecture;
    const s = String(m.score).match(/(\d+)-(\d+)/), x = +s[1], y = +s[2], reel = x > y ? '1' : x < y ? '2' : 'N', T = x + y, v = a.verdict, b = a.buts, f = a.fiabilite;
    const nom = (c) => c === '1' ? 'victoire ' + m.equipe1 : c === '2' ? 'victoire ' + m.equipe2 : 'nul';
    entrees.push({
      lot: r.lot, equipe1: m.equipe1, equipe2: m.equipe2, date: m.date, jour: K.JOURS[jour], theme: m.theme,
      meres: t.map((n, i) => 'M' + (i + 1) + ' ' + K.fig(n) + ' (' + n + ')'),
      maisons: { base: L.maisons.map((q, i) => 'M' + (i + 1) + ' ' + q.base), resultante: L.maisons.slice(0, 15).map((q, i) => 'M' + (i + 1) + ' ' + q.resultante) },
      poles: { R1: L.R1.figure + ' en M' + L.R1.maison, R7: L.R7.figure + ' en M' + L.R7.maison, mode: L.mode },
      validation: { valide: f.valide, binome: f.binome.figure + ' : ' + (f.binome.emplacements.join(', ') || 'absent'), binomeEnMaisonAngulaire: f.binome.enAxe, sommeAxe: f.axe.figure + ' : base M' + (f.axe.base.join(',M') || '—') + ' / résultante M' + (f.axe.resultante.join(',M') || '—'), sommeAxeEnMaisonAngulaire: f.axe.valide, somme3_5_11_15: f.somme3.figure + ' ' + (f.somme3.presente ? 'présente' : 'absente'), figureDuJour: f.jour ? f.jour.figure + ' ' + (f.jour.presente ? 'présente' : 'absente') : null },
      moteur: { verdict: nom(v.verdict), principe: v.principe, assuree: !!v.assuree, scorePrevu: b.score, deuxMarquent: b.deuxMarquent.oui, over15: b.overUnder.over15, over25: b.overUnder.over25, over35: b.overUnder.over35, rythme: b.overUnder.rythme },
      reel: { score: m.score, resultat: nom(reel), deuxMarquent: x > 0 && y > 0, totalButs: T },
      bilan: { verdict: v.verdict === reel, deuxMarquent: b.deuxMarquent.oui === (x > 0 && y > 0), over15: b.overUnder.over15 === (T > 1.5), over25: b.overUnder.over25 === (T > 2.5), over35: b.overUnder.over35 === (T > 3.5) }
    });
  });
});
const sortie = { etiquetteMoteur: gel.etiquette, hashMoteurGele: gel.hashMoteur, moteurIdentiqueAuGel: hashMoteur === gel.hashMoteur, matchs: entrees };
fs.writeFileSync(path.join(racine, 'validation/themes-documentes.json'), JSON.stringify(sortie, null, 1));
const oui = (b) => b ? '✓' : '✗';
let md = '# Thèmes documentés (lots neufs évalués sur le moteur gelé)\n\nFait constant : chaque match ci-dessous a été tiré (thème valide pour la date) avant le match, évalué sur le moteur gelé `' + gel.etiquette + '` sans réglage, puis comparé au score. Ces matchs sont du développement. Régénérer avec `node outils/documenter_lots.js`.\n\n';
md += '| # | Match | Date | Thème | Valide | Moteur annonce (principe) | Prévu | Réel | Verdict | Deux marquent | Over 1,5 / 2,5 / 3,5 |\n|---|---|---|---|---|---|---|---|---|---|---|\n';
entrees.forEach((e, i) => { md += '| ' + (i + 1) + ' | ' + e.equipe1 + ' – ' + e.equipe2 + ' | ' + e.date + ' | ' + e.theme + ' | ' + (e.validation.valide ? 'oui' : 'non') + ' | ' + e.moteur.verdict + ' (' + e.moteur.principe + (e.moteur.assuree ? ', assurée' : '') + ') | ' + e.moteur.scorePrevu + ' | ' + e.reel.score + ' (' + e.reel.resultat + ') | ' + oui(e.bilan.verdict) + ' | ' + oui(e.bilan.deuxMarquent) + ' | ' + oui(e.bilan.over15) + ' ' + oui(e.bilan.over25) + ' ' + oui(e.bilan.over35) + ' |\n'; });
const n = entrees.length, c = (k) => entrees.filter(e => e.bilan[k]).length;
md += '\nTotal sur ' + n + ' matchs : verdict ' + c('verdict') + '/' + n + ', Deux marquent ' + c('deuxMarquent') + '/' + n + ', Over/Under 1,5 : ' + c('over15') + '/' + n + ', 2,5 : ' + c('over25') + '/' + n + ', 3,5 : ' + c('over35') + '/' + n + '. « Toujours R1 » : ' + entrees.filter(e => e.reel.resultat.startsWith('victoire ' + e.equipe1)).length + '/' + n + '.\n\n## Détail de chaque thème\n';
entrees.forEach((e, i) => {
  md += '\n### ' + (i + 1) + '. ' + e.equipe1 + ' – ' + e.equipe2 + ' (' + e.date + ', ' + e.jour + ') : thème ' + e.theme + '\n';
  md += '- Mères : ' + e.meres.join(' ; ') + '\n- Base M1 à M16 : ' + e.maisons.base.join(', ') + '\n- Résultantes M1 à M15 : ' + e.maisons.resultante.join(', ') + '\n';
  md += '- Pôles : R1 = ' + e.poles.R1 + ' ; R7 = ' + e.poles.R7 + ' (' + e.poles.mode + ')\n';
  md += '- Validation (' + (e.validation.valide ? 'valide' : 'non valide') + ') : binôme de M1 ' + e.validation.binome + ' ; somme de l\'axe ' + e.validation.sommeAxe + ' ; somme 3-5-11-15 ' + e.validation.somme3_5_11_15 + ' ; figure du jour ' + e.validation.figureDuJour + '\n';
  md += '- Moteur : ' + e.moteur.verdict + ' (' + e.moteur.principe + '), score prévu ' + e.moteur.scorePrevu + ', deux marquent ' + (e.moteur.deuxMarquent ? 'oui' : 'non') + ', Over 1,5 / 2,5 / 3,5 : ' + [e.moteur.over15, e.moteur.over25, e.moteur.over35].map(x => x ? 'Over' : 'Under').join(' / ') + ', rythme ' + e.moteur.rythme + '\n';
  md += '- Réel : ' + e.reel.score + ' (' + e.reel.resultat + ', ' + e.reel.totalButs + ' but(s), les deux marquent : ' + (e.reel.deuxMarquent ? 'oui' : 'non') + ')\n';
});
fs.writeFileSync(path.join(racine, 'validation/THEMES-DOCUMENTES.md'), md);
console.log(n + ' matchs documentés ; moteur identique au gel : ' + (hashMoteur === gel.hashMoteur));
