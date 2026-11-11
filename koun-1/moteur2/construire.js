// Construit koun-1-complet.html : l'atelier (interface) + le moteur 2.
// Usage : node construire.js <base.html (atelier 1.15.4)> <sortie.html>
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const [base, sortie] = process.argv.slice(2);
const ici = __dirname, K = require('./moteur.js'), { compacter } = require('./pont.js');
const esc = t => t.replace(/[^\x00-\x7f]/g, ch => { const c = ch.charCodeAt(0); return c < 256 ? '\\x' + c.toString(16).toUpperCase().padStart(2, '0') : '\\u' + c.toString(16).padStart(4, '0'); });
const js = v => esc(JSON.stringify(v)).replace(/<\/script/gi, '<\\/script');
const html = fs.readFileSync(base, 'utf8');
const m = html.match(/base64,([A-Za-z0-9+\/=]+)"/);
let b = Buffer.from(m[1], 'base64').toString('utf8');
const faits = [];
const rep = (a, c, nom) => { const n = b.split(a).length - 1; if (n !== 1) throw new Error(n + ' occurrence(s) pour « ' + nom + ' »'); b = b.split(a).join(c); faits.push(nom); };
const entre = (debut, fin, contenu, nom) => { const i = b.indexOf(debut), j = b.indexOf(fin, i + debut.length); if (i < 0 || j < 0) throw new Error('bornes introuvables : ' + nom); b = b.slice(0, i) + contenu + b.slice(j); faits.push(nom); };

// 1. Moteur 2 et son pont à la place de l'ancien moteur ; schémas de l'ancien moteur retirés.
const moteur = fs.readFileSync(path.join(ici, 'moteur.js'), 'utf8'), pont = fs.readFileSync(path.join(ici, 'pont.js'), 'utf8');
const page = fs.readFileSync(path.join(ici, 'page.html'), 'utf8').replace('/*__MOTEUR__*/', () => moteur);
entre('var Bn={core:`', '};var Ue=he(yt());', 'var Bn={core:' + js(page) + ',bridge:' + js(pont) + ',images:{}', 'moteur 2 intégré');
const sha = t => crypto.createHash('sha256').update(t).digest('hex');
b = b.replace(/sourceHash:"[0-9a-f]{64}"/, 'sourceHash:"' + sha(page) + '"').replace(/bridgeHash:"[0-9a-f]{64}"/, 'bridgeHash:"' + sha(pont) + '"');
rep('version:"1.15.4-essai",sourceHash:', 'version:"' + K.version + '",sourceHash:', 'version');

// 2. Références : instantanés recalculés par le moteur 2.
{ const i0 = b.indexOf('var J={engine:'), a = b.indexOf('references:[', i0), z = b.indexOf('],technical:{', a);
  const refs = eval('[' + b.slice(a + 'references:['.length, z) + ']');
  // Matchs réels ajoutés après la reconstruction du moteur.
  const figs = c => c.map(n => K.FIG[n - 1]);
  for (const x of [{ id: 'VICTOIRE_REFERENCE_5', codes: [9, 13, 2, 13], expected: '1', source: 'Score 2-0 indiqué par le propriétaire (11 novembre 2026)' },
    { id: 'VICTOIRE_REFERENCE_6', codes: [2, 12, 4, 4], expected: '1', source: 'Victoire de R1 indiquée par le propriétaire (11 novembre 2026)' }])
    if (!refs.some(r => r.id === x.id)) refs.push({ id: x.id, title: figs(x.codes).join(' \u00B7 '), mothers: figs(x.codes), codes: x.codes, expected: x.expected, source: x.source, teams: ['R1', 'R7'] });
  const v3 = refs.find(r => r.id === 'VICTOIRE_REFERENCE_3'); if (v3 && !/7-0/.test(v3.source)) v3.source += ' \u00B7 score 7-0';
  const nNuls = refs.filter(r => r.expected === 'N').length;
  b = b.split('6 NULS + 5 VICTOIRES').join(nNuls + ' NULS + ' + (refs.length - nNuls) + ' VICTOIRES');
  b = b.split('Les onze r\\xE9f\\xE9rences ont servi').join('Les r\\xE9f\\xE9rences ont servi').split('Rejouer les onze th\\xE8mes').join('Rejouer les th\\xE8mes');
  for (const r of refs) r.snapshot = JSON.parse(JSON.stringify(compacter(K, K.construireTheme(...r.mothers), r.mothers)));
  b = b.slice(0, a) + 'references:' + js(refs) + b.slice(z + 1); faits.push('instantanés des références'); }

// 3. Contrôle technique : toutes les combinaisons de mères, sans plantage, et symétrie R1/R7.
const st = { N: 0, 1: 0, 2: 0, aucun: 0, assuree: 0 }; let sym = 0;
for (let x = 0; x < 16; x++) for (let y = 0; y < 16; y++) for (let z = 0; z < 16; z++) for (let w = 0; w < 16; w++) {
  const th = K.construireTheme(K.FIG[x], K.FIG[y], K.FIG[z], K.FIG[w]), r = K.analyser(th), v = r.decision.verdict;
  st[v === null ? 'aucun' : v]++; if (r.decision.victoireAssuree) st.assuree++;
  const s = K.analyser(th, { R1: r.lecture.R7.maison, R7: r.lecture.R1.maison }).decision.verdict;
  if (({ 1: '2', 2: '1', N: 'N', null: 'null' })[String(v)] === String(s)) sym++;
}
if (sym !== 65536) throw new Error('symétrie R1/R7 rompue : ' + sym);
entre('technical:{themes:65536', ',gallery:[', 'technical:' + js({ themes: 65536, blocked: st.aucun, resolved: 65536 - st.aucun,
  causes: [{ id: 'AUCUN_CAS', title: 'Aucun cas défini ne s’applique', count: st.aucun }], verdicts: { N: st.N, 1: st[1], 2: st[2] },
  engineVersion: K.version, scope: 'Contrôle de fonctionnement du moteur ' + K.version + ' sur les 65 536 combinaisons de mères : aucun plantage, symétrie R1/R7 vérifiée. Ces thèmes n’ont pas de résultat réel : ce n’est pas une preuve.' }), 'chiffres techniques');
entre('gallery:[{file:', '};var Zu=', 'gallery:[]', 'galerie vidée');

// 4. Registre : la structure et les cas du moteur 2 remplacent les anciennes règles.
const R = (id, title, text, status, source) => ({ id, title, text, status, source, locked: true });
const registre = [
  R('S-01', 'Boucles et fronts', 'Deux boucles : paire (2, 4, … 16) et impaire (1, 3, … 15). Quatre fronts : A 1-5-9-13 (Feu), B 2-6-10-14 (Air), C 3-7-11-15 (Eau), D 4-8-12-16 (Terre). A va avec C, B va avec D (binômes).', 'Confirmée', 'Propriétaire'),
  R('S-02', 'Points cardinaux', 'Chaque front a quatre points : Est face à Ouest, Nord face à Sud. A : Puer, Via, Fortuna Minor, Cauda. B : Laetitia, Amissio, Carcer, Puella. C : Caput, Aquisitio, Conjunctio, Rubeus. D : Albus, Populus, Fortuna Major, Tristitia (ordre Est, Nord, Ouest, Sud).', 'Confirmée', 'Propriétaire'),
  R('S-03', 'Accouchement des maisons', 'La résultante d’une maison est sa figure de base combinée avec la figure de repos de la maison. Maisons Terre : même front. Maisons Air : front binôme. Maisons impaires : autre boucle. M8 accouche le miroir (vis-à-vis). M16 n’a pas de résultante.', 'Confirmée', 'Propriétaire ; vérifié sur les 16 figures'),
  R('S-04', 'Éléments et forces', 'L’élément d’une figure est celui de son front. Force hors repos : même élément 85 % ; Eau/Terre et Feu/Air 70 % ; Feu/Terre et Air/Eau 55 % ; Feu/Eau et Air/Terre 1 %. Dans sa maison de repos : 100 %.', 'Confirmée', 'Propriétaire'),
  R('S-05', 'Attaque et double repos', 'Chaque figure k attaque k+3, pour protéger k+6. Deux figures liées par l’attaque, chacune dans sa maison de repos, s’annulent (double repos) : leur force n’est pas chiffrée.', 'Confirmée', 'Propriétaire'),
  R('S-06', 'Pôles', 'R1 est la maison de repos de la figure de M1. R7 est R1 + 6.', 'Confirmée', 'Moteur d’origine'),
  ...K.CAS.map(c => R(c.id, c.titre, c.enonce, c.statut === 'REGLE_CONFIRMEE' ? 'Confirmée' : 'En essai', 'Cas du moteur ' + K.version)),
  R('P-01', 'Principes à traduire en cas', 'Énoncés par le propriétaire, pas encore écrits comme cas : M8 renforce le pôle quand il accouche son miroir ; M12 le renforce quand il accouche son voisin ; M4 a la fonction inverse de M12 ; M16 renforce le pôle qu’elle porte, miroir de M8, sentence finale ; l’antagoniste du pôle contrôlé ou mal positionné ; le front du pôle dans les maisons de repos de ses figures.', 'À traduire', 'Propriétaire')
];
entre('hh=[{id:"KREG-002"', ';function so(e,t=e.snapshot)', 'hh=' + js(registre), 'registre des règles');
entre('bh=[{id:"KAMB-001"', ';function es(e,t)', 'bh=[]', 'anciennes questions retirées');
rep('rules:[...(t.rules||[]).map(r=>hh.find', 'rules:[...(t.rules||[]).filter(r=>!/^KREG-/.test(r.id)).map(r=>hh.find', 'anciennes règles enregistrées écartées');
rep('ambiguities:[...(t.ambiguities||[]).map(r=>bh.find', 'ambiguities:[...(t.ambiguities||[]).filter(r=>!/^KAMB-/.test(r.id)).map(r=>bh.find', 'anciennes questions enregistrées écartées');
{ const a = b.indexOf('rules:["REG-001","KREG-005",...({'), z = b.indexOf('[t?.decision?.phase]||[])]', a) + '[t?.decision?.phase]||[])]'.length;
  b = b.slice(0, a) + 'rules:["REG-001",...(/^CAS-/.test(t?.decision?.phase||"")?[t.decision.phase]:[])]' + b.slice(z); faits.push('fiches de test liées aux cas'); }

// 5. Interface : libellés adaptés au moteur 2.
rep(':"Calcul bloqu\\xE9"', ':"Aucun cas applicable"', 'badge aucun cas');
rep('children:u?.error?"Bloqu\\xE9":R?"Concordant":"\\xC9cart"', 'children:u?.error?"Bloqu\\xE9":R?"Concordant":g==null?"Aucun cas":"\\xC9cart"', 'carte référence sans cas');
rep('"badge "+(u?.error?"red":R?"green":"red")', '"badge "+(u?.error?"red":R?"green":g==null?"gray":"red")', 'couleur sans cas');
rep('["Pistes du nul",fo],', '', 'onglet des anciens schémas retiré');
rep('onClick:()=>t("Pistes du nul")', 'onClick:()=>t("R\\xE8gles")', 'bouton vers les règles');
rep('children:["Voir les sch\\xE9mas ",', 'children:["Voir les r\\xE8gles ",', 'libellé du bouton');
rep('Les onze th\\xE8mes, les six sch\\xE9mas, le moteur complet et le registre de validation sont r\\xE9unis.', 'Les th\\xE8mes de r\\xE9f\\xE9rence, le moteur et le registre des cas sont r\\xE9unis.', 'texte des preuves');

rep('children:"Aucun signal des maisons sur les p\\xF4les"', 'children:"Th\\xE8mes o\\xF9 aucun cas d\\xE9fini ne s\\u2019applique"', 'texte sans cas');
rep('Nul, compensation des fronts, duel des p\\xF4les et r\\xF4le de M15 : chaque sortie expose son motif.', 'Chaque verdict vient d\\u2019un cas \\xE9crit : sa condition et son r\\xE9sultat sont affich\\xE9s.', 'texte arbitrage');

// Page du moteur seule (saisie, verdict, pyramide), utilisable sans l'atelier.
fs.writeFileSync(path.join(ici, '..', 'koun-moteur.html'), page);

// 6. Écriture.
fs.writeFileSync(sortie, html.replace(m[1], Buffer.from(b, 'utf8').toString('base64')));
console.log(faits.length + ' étapes ; moteur ' + K.version + ' ; ' + (fs.statSync(sortie).size / 1024).toFixed(0) + ' Ko');
console.log('contrôle technique :', JSON.stringify(st), '; symétrie', sym + '/65536');
