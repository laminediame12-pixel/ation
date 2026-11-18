// Réembarque moteur3/moteur.js dans la page koun-moteur-3.0.0.html (entre les marqueurs « Moteur 3 »). Usage : node outils/embarquer.js
const fs = require('fs'), path = require('path');
const page = path.join(__dirname, '../koun-moteur-3.0.0.html'), moteur = fs.readFileSync(path.join(__dirname, '../moteur3/moteur.js'), 'utf8');
let s = fs.readFileSync(page, 'utf8');
const d = '/* ═══ Moteur 3 : table rase des principes ═══ */', f = '/* ═══ fin Moteur 3 ═══ */\n';
const i = s.indexOf(d), j = s.indexOf(f);
if (i < 0 || j < 0) throw new Error('marqueurs du moteur 3 introuvables dans la page');
s = s.slice(0, i) + d + '\n' + moteur + '\n' + s.slice(j);
fs.writeFileSync(page, s);
console.log('moteur 3 embarqué :', Math.round(moteur.length / 1024), 'Ko ; page :', Math.round(s.length / 1024), 'Ko');
