// Surveillance du moteur : lance tous les contrôles et vérifie qu'aucune couche non posée ne s'est glissée. Usage : node outils/surveiller.js
const { execFileSync } = require('child_process'), fs = require('fs'), path = require('path');
const racine = path.join(__dirname, '..'), bilan = []; const ok = (n, c, d) => bilan.push([n, !!c, d || '']);
const lancer = (script, args) => { try { execFileSync('node', [path.join(racine, 'outils', script)].concat(args || []), { stdio: 'pipe' }); return true; } catch (e) { return false; } };
const lire = f => fs.readFileSync(path.join(racine, f), 'utf8');

// 1. contrôles de calcul
ok('noyau : lois et déduction', lancer('tester_noyau.js'));
ok('moteur 4 : lecture, équilibre, FI-5, pôles, faits, activation', lancer('tester_moteur4.js'));
ok('invariants de la structure', lancer('invariants.js'));
ok('cartographie : fichier à jour et vérifications', lancer('cartographie.js', ['--verifier']));

// 2. aucune règle de verdict dans le moteur : seules les lectures de la liste blanche sont exportées
const M4 = require(path.join(racine, 'moteur4/moteur.js')), permis = ['version', 'lire', 'fiabilite', 'equilibre', 'analyser', 'poles', 'noeuds', 'faits', 'activation', 'connexions', 'multiplicite', 'paralysie', 'paralysieFigure', 'liaisonsTerre', 'terreSaturee', 'interactions', 'temoins'];
const extra = Object.keys(M4).filter(k => !permis.includes(k));
ok('moteur 4 : aucune fonction hors liste blanche (pas de verdict)', extra.length === 0, extra.join(', '));
ok('moteur 4 : pas de mot « verdict » dans le code', !/verdict\s*[:(=]/.test(lire('moteur4/moteur.js').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')));

// 3. la page embarque exactement le noyau et le moteur 4
const page = lire('koun.html'), noyau = lire('moteur3/noyau.js').trim();
const m4 = lire('moteur4/moteur.js').replace(/\(typeof require !== 'undefined' && typeof module !== 'undefined'\) \? require\('\.\.\/moteur3\/noyau\.js'\) : root\.KOUN_NOYAU/, 'root.KOUN_NOYAU').trim();
ok('koun.html : noyau embarqué identique à moteur3/noyau.js', page.includes(noyau));
ok('koun.html : moteur 4 embarqué identique à moteur4/moteur.js', page.includes(m4));

// 4. hypothèses : la prédiction inscrite avant le score n'a jamais été modifiée depuis son premier commit
const git = a => execFileSync('git', a, { cwd: racine, encoding: 'utf8' });
let gel = true, detail = [];
try {
  const hs = JSON.parse(lire('validation/hypotheses.json')).hypotheses, commits = git(['log', '--reverse', '--format=%H', '--', 'validation/hypotheses.json']).trim().split('\n').filter(Boolean);
  hs.forEach(h => (h.predictions || []).forEach(p => {
    for (const c of commits) { let v; try { v = JSON.parse(git(['show', c + ':koun-1/validation/hypotheses.json'])); } catch (e) { try { v = JSON.parse(git(['show', c + ':validation/hypotheses.json'])); } catch (e2) { continue; } }
      const a = (v.hypotheses || []).filter(x => x.id === h.id)[0]; const b = a && (a.predictions || []).filter(x => JSON.stringify(x.theme) === JSON.stringify(p.theme))[0];
      if (b) { if (b.prediction !== p.prediction) { gel = false; detail.push(h.id + ' ' + p.theme.join('-') + ' : ' + b.prediction + ' → ' + p.prediction); } break; } }
  }));
} catch (e) { gel = false; detail.push(String(e.message).slice(0, 80)); }
ok('hypothèses : prédictions inscrites jamais modifiées depuis leur premier commit', gel, detail.join(' ; '));

// 5. la page se charge sans erreur (si le navigateur de contrôle est disponible)
try { const pw = require('playwright'); (async () => { const b = await pw.chromium.launch(), p = await b.newPage(); const e = []; p.on('pageerror', x => e.push(x.message)); await p.goto('file://' + path.join(racine, 'koun.html') + '?theme=4-6-7-16'); await p.waitForTimeout(300); await b.close(); ok('koun.html : chargement sans erreur', e.length === 0, e.join(' ; ')); fin(); })(); } catch (e) { fin(); }
function fin() { let mal = 0; bilan.forEach(([n, c, d]) => { if (!c) mal++; console.log((c ? 'OK    ' : 'ÉCHEC ') + n + (d ? ' — ' + d : '')); }); console.log(mal ? mal + ' échec(s)' : 'Le moteur est conforme.'); process.exit(mal ? 1 : 0); }
