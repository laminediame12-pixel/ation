// Conditions dérivées des cas et principes du propriétaire, évaluées sur les 11 matchs réels. Rien n'est ajouté au moteur.
const K = require('../moteur2/moteur.js');
const REFS = require('./refs154.json').map(x => ({ id: x.id, meres: x.c.mothers }));
const ATTENDU = { NUL_REFERENCE_1: 'N', NUL_REFERENCE_2: 'N', NUL_REFERENCE_3: 'N', NUL_REFERENCE_4: 'N', NUL_REFERENCE_5: 'N', NUL_REFERENCE_6: 'N',
  VICTOIRE_REFERENCE_1: '2', VICTOIRE_REFERENCE_2: '2', VICTOIRE_REFERENCE_3: '1', VICTOIRE_REFERENCE_4: '1', AZ_VILLARREAL: '1' };
const n = K.num, f = K.fig;
const unSeul = (L, ok) => { const a = ok(L.R1, L.R7), b = ok(L.R7, L.R1); return a === b ? null : (a ? '1' : '2'); };
const attaque = (c, autre) => n(autre.figure) === n(f(n(c.figure) + 3));
const D = [
  { id: 'D1', titre: 'Pôles antagonistes directs, tous deux dans leur maison de repos : nul',
    origine: 'Double repos : deux puissances maximales liées par l’attaque s’annulent ; appliqué aux deux pôles.',
    test: L => (attaque(L.R1, L.R7) || attaque(L.R7, L.R1)) && L.chezElleEnBase(L.R1.figure) && L.chezElleEnBase(L.R7.figure) ? 'N' : null },
  { id: 'D2', titre: 'Pôle antagoniste direct, en M16 avec un front en M4 ou M12 : il gagne',
    origine: 'CAS-004 (pôle en M8) + « M16 est le miroir de M8 ».',
    test: L => unSeul(L, (c, a) => attaque(c, a) && L.maisons[15].base === c.figure && [4, 8, 12].map(d => f(n(c.figure) + d)).some(x => L.presentEn(x, 4) || L.presentEn(x, 12))) },
  { id: 'D3', titre: 'L’antagoniste du pôle est dans sa maison de repos, le pôle non : ce pôle perd',
    origine: 'Figure dans sa maison de repos = puissance maximale ; elle maîtrise sa cible qui n’y est pas (principe du repos + CAS-006).',
    test: L => unSeul(L, (c, a) => L.chezElle(a.antagoniste) && !L.chezElle(a.figure) && !L.chezElle(f(n(a.antagoniste) - 3))) },
  { id: 'D4', titre: 'Pôle dans la maison de sa cible directe : il gagne',
    origine: 'Inverse de CAS-005 (pôle dans la maison de son antagoniste = il perd).',
    test: L => unSeul(L, (c) => L.maisons[n(f(n(c.figure) + 3)) - 1].base === c.figure) },
  { id: 'D5', titre: 'Pôle attaqué directement, sans front direct NI miroir : il perd',
    origine: 'CAS-006 étendu au miroir (CAS-005 parle du « front direct ou du front du miroir »).',
    test: L => unSeul(L, (c, a) => attaque(c, a) && (L.absente(f(n(a.figure) + 4)) || L.absente(f(n(a.figure) + 8)))) },
  { id: 'D6', titre: 'Pôle en M4, sans figure de son front en M8, M12 ou M16 : il perd',
    origine: '« M4 a la fonction inverse de M12 » : M12 et M8 renforcent, M4 affaiblit.',
    test: L => unSeul(L, (c, a) => L.presentEn(a.figure, 4) && !a.frontDirect.some(x => L.presentEn(x, 8) || L.presentEn(x, 12) || L.presentEn(x, 16))) }
];
for (const d of D) {
  let juste = [], faux = [], st = { 1: 0, 2: 0, N: 0 };
  for (const r of REFS) { const L = K.analyser(K.construireTheme(...r.meres)).lecture; if (L.R1.front === L.R7.front) continue;
    const v = d.test(L); if (v === null) continue; const nom = r.id.replace('_REFERENCE', '').replace('VICTOIRE', 'V').replace('NUL', 'N').replace('AZ_VILLARREAL', 'AZ');
    (v === ATTENDU[r.id] ? juste : faux).push(nom + '→' + v); }
  console.log(d.id, '|', d.titre, '\n   origine :', d.origine, '\n   matchs réels : justes', juste.join(' ') || '—', '| faux', faux.join(' ') || '—');
}
