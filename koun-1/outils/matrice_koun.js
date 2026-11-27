// Intègre dans koun.html la matrice des 256 combinaisons et ses lois (section repliable placée après la cartographie des fronts).
// Les cases du thème en cours (base de chaque maison × maison) sont surlignées : bleu R1, rouge R7, vert foncé pour les autres maisons.
// Idempotent : le bloc entre les marqueurs MATRICE est remplacé à chaque passage. Usage : node outils/matrice_koun.js
const fs = require('fs'), path = require('path'), P = path.join(__dirname, '../koun.html');
let s = fs.readFileSync(P, 'utf8');
const A = '<!--MATRICE-->', B = '<!--/MATRICE-->';
s = s.replace(new RegExp(A + '[\\s\\S]*?' + B, 'g'), '');
const lois = [
  '<b>Lecture d\'une case</b> : la figure de la ligne posée dans la maison de la colonne donne la résultante (niveau par niveau : identiques → 2, différents → 1). Niveaux saturés : <b style="color:#2563eb">Terre en bleu</b>, <b style="color:#dc2626">Feu, Air, Eau en rouge</b> ; ouverts en gris.',
  '<b>Fronts = Feu et Air</b> : A (1,1) Puer, Via, Fortuna Minor, Cauda · B (1,2) Laetitia, Amissio, Carcer, Puella · C (2,1) Caput, Rubeus, Conjunctio, Aquisitio · D (2,2) Albus, Tristitia, Fortuna Major, Populus. L\'Eau et la Terre donnent la place dans le front.',
  '<b>Relation des fronts → front de la résultante</b> : même front → D, le <b>noyau Terre</b> (équilibre) ; fronts alliés A/C, B/D → B, Laetitia et le <b>triplet mobile</b> Amissio, Carcer, Puella ; attaque A→D, B→A, D→C, C→B → A ou C (l\'Air ne survit jamais à une attaque).',
  '<b>Dans son propre front</b> : chez elle → Populus (équilibre concrétisé) ; maison de son miroir g+8 → toujours Tristitia (en suspens) ; maison de son front direct g±4 → Albus ou Fortuna Major (stable).',
  '<b>Miroir</b> (Mh et Mh+8) : il n\'inverse que la Terre ; la Terre inversée passe au front suivant (canal Terre f→f+4 et f+8→f+12) ; la rangée Terre M13–M16 relie les quatre fronts. Au repos, le canal Terre est lié dans les fronts A et B, en arrêt dans C et D.',
  '<b>Terre de la résultante</b> : saturée quand figure et maison ont la même Terre ; elle alterne de maison en maison, sauf en 6-7 et 14-15 (la rupture de la première moitié recopiée par le miroir).',
  '<b>Symétrie</b> : g en Mh = h en Mg. <b>Activité</b> des 256 cases : 16 à 4 niveaux saturés (Populus), 64 à 3, 96 à 2, 64 à 1, 16 à 0 (Via). <b>Trajectoires</b> : chaque figure apparaît une fois par ligne et par colonne ; Populus suit la diagonale (chez elle), Via les placements dans la maison de l\'opposé (inactive).',
  '<b>Arrêts</b> (g dans la maison g+3, qu\'elle bloque) : cinq formes seulement — Via, Caput, Puer, Conjunctio, Cauda. <b>M16</b> ne transforme rien ; Populus posé reproduit la figure de la maison.',
  '<b>Nœuds doubles</b> M1 (Feu²), M6 (Air²), M11 (Eau²) : un seul niveau décide, plein ou vide. M11 plein → plus de buts et les deux camps marquent plus souvent (intégré aux buts et à « Deux marquent »).',
];
const html = A + '<details id="matrice"><summary>Matrice des 256 combinaisons</summary><details class="exp"><summary>Lois de la matrice</summary><ul class="mxl">' + lois.map(l => '<li>' + l + '</li>').join('') + '</ul></details>'
  + '<p class="s" id="mxInfo"></p><div class="mxw"><table class="mx" id="mxT"></table></div></details>' + B;
const css = '<style>' + '#matrice .mxw{overflow-x:auto}#matrice table.mx{border-collapse:collapse;font-size:10px}#matrice .mx th,#matrice .mx td{border:1px solid var(--ln);padding:2px 3px;text-align:center}#matrice .mx th{font-size:10px;font-weight:600}'
  + '#matrice .mx td.cn,#matrice .mx th.cn{background:rgba(22,163,74,.08)}#matrice .pf{display:flex;flex-direction:column;align-items:center;gap:1px}#matrice .pf i{display:flex;gap:2px;height:5px}#matrice .pf b{width:5px;height:5px;border-radius:50%;display:block}'
  + '#matrice .st{background:#2563eb}#matrice .sr{background:#dc2626}#matrice .so{background:#9ca3af}#matrice td.th1{outline:3px solid #2563eb;outline-offset:-2px}#matrice td.th7{outline:3px solid #dc2626;outline-offset:-2px}#matrice td.thx{outline:2px solid #15803d;outline-offset:-2px}'
  + '#matrice .mxl{margin:6px 0 6px 18px;padding:0;font-size:12.5px;line-height:1.5}#matrice .mxl li{margin-bottom:4px}</style>';
const js = '<script>(function(){var K=KOUN_NOYAU,$=function(i){return document.getElementById(i)},CANAL=[4,8,12,13,14,15];'
  + 'function pts(f){return "<div class=\\"pf\\">"+K.niveaux(f).map(function(v,l){var c=l===3?"st":"sr";return "<i>"+(v===2?"<b class=\\""+c+"\\"></b><b class=\\""+c+"\\"></b>":"<b class=\\"so\\"></b>")+"</i>"}).join("")+"</div>"}'
  + 'function rendre(){var m=[].map.call(document.querySelectorAll("#meres select"),function(x){return +x.value}),L=KOUN4.lire(m),b=L.theme.bases,mark={};'
  + 'for(var h=1;h<=16;h++){var k=b[h]+"|"+h;mark[k]=h===L.R1.maison?"th1":h===L.R7.maison?"th7":"thx"}'
  + 'var t="<tr><th>figure ↓ · maison →</th>";for(var h=1;h<=16;h++)t+="<th class=\\""+(CANAL.indexOf(h)>=0?"cn":"")+"\\">M"+h+"</th>";t+="</tr>";'
  + 'for(var g=1;g<=16;g++){t+="<tr><th style=\\"text-align:left\\">"+g+" "+K.nom(g)+"</th>";for(var h=1;h<=16;h++){var r=K.additionner(g,h),c=(CANAL.indexOf(h)>=0?"cn ":"")+(mark[g+"|"+h]||"");t+="<td class=\\""+c+"\\" title=\\""+K.nom(g)+" en M"+h+" → "+K.nom(r)+"\\">"+pts(r)+"</td>"}t+="</tr>"}'
  + '$("mxT").innerHTML=t;$("mxInfo").innerHTML="Cases du thème en cours : <b style=\\"color:#2563eb\\">R1</b> ("+K.nom(L.R1.figure)+" en M"+L.R1.maison+"), <b style=\\"color:#dc2626\\">R7</b> ("+K.nom(L.R7.figure)+" en M"+L.R7.maison+"), <b style=\\"color:#15803d\\">autres maisons</b> encadrées. Survol d\'une case : figure, maison, résultante."}'
  + '$("meres").addEventListener("change",rendre);$("matrice").addEventListener("toggle",function(){if(this.open)rendre()});rendre()})();</script>';
const ancre = '</details><div class="ov" id="ovPk"';
if (s.indexOf(ancre) < 0) throw new Error('ancre introuvable');
s = s.replace(ancre, '</details>' + html + '<div class="ov" id="ovPk"');
const fin = s.lastIndexOf('</body>');
s = s.slice(0, fin) + A + css + js + B + s.slice(fin);
fs.writeFileSync(P, s); console.log('matrice intégrée · ' + s.length + ' octets');
