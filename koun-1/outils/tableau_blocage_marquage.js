// Tableau des deux cas pour chaque figure et chaque maison : BLOCAGE (la figure g bloque la maison g + 3, celle de la figure qu'elle antagonise ;
// elle est chez elle en maison g) et MARQUAGE (niveaux qu'elle active : ses points 1 rencontrent un point 1 de la maison ; action concrétisée en canal Terre
// M4, M8, M12, M13, M14, M15 ou si la Terre de la résultante est saturée). Étude en cours du propriétaire. Sortie : validation/TABLEAU-BLOCAGE-MARQUAGE.html
const fs = require('fs'), path = require('path'), K = require('../moteur3/noyau.js'), N = K.nom, mod = n => ((n - 1) % 16 + 16) % 16 + 1;
const CANAL = [4, 8, 12, 13, 14, 15], NV = ['F', 'A', 'E', 'T'], FR = f => 'ABCD'[(f - 1) % 4];
const act = (g, h) => [0, 1, 2, 3].filter(l => K.niveaux(g)[l] === 1 && K.niveaux(h)[l] === 1);
const terreRes = (g, h) => K.niveaux(K.additionner(g, h))[3] === 2;
let rows = '';
for (let g = 1; g <= 16; g++) { let r = '<tr><th class="fg">' + g + ' · ' + N(g) + ' <small>(' + FR(g) + ')</small></th>';
  for (let h = 1; h <= 16; h++) { const a = act(g, h), chez = g === h, bloque = h <= 15 && h === mod(g + 3), concret = CANAL.includes(h) || terreRes(g, h);
    let c = ''; if (chez) c += '<span class="ch">★</span>'; if (bloque) c += '<span class="bl">✖</span>';
    if (h <= 15 && (a.length || g === 16)) c += '<span class="' + (concret ? 'mq' : 'mo') + '">' + (a.map(x => NV[x]).join('') || 'sat') + '</span>';
    if (h <= 15 && !a.length && g !== 16 && terreRes(g, h) && !chez) c += '';
    r += '<td class="' + (CANAL.includes(h) ? 'cn' : '') + '" title="' + N(g) + ' en M' + h + ' : résultante ' + N(K.additionner(g, h)) + ', Terre ' + (terreRes(g, h) ? 'saturée' : 'ouverte') + '">' + c + '</td>'; }
  rows += r + '<td class="sm">bloque <b>M' + mod(g + 3) + '</b> (' + N(mod(g + 3)) + ') · bloquée chez elle par ' + N(mod(g - 3)) + '</td></tr>'; }
const head = '<tr><th>Figure</th>' + [...Array(16)].map((_, i) => '<th class="' + (CANAL.includes(i + 1) ? 'cn' : '') + '">M' + (i + 1) + '</th>').join('') + '<th>Blocage</th></tr>';
const html = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blocage et marquage</title><style>'
 + ':root{--bg:#f6f4ef;--card:#fff;--tx:#1d1b18;--mu:#6b665d;--ln:#d9d4c8}@media(prefers-color-scheme:dark){:root{--bg:#171613;--card:#211f1b;--tx:#ece7dc;--mu:#a39d90;--ln:#3a362e}}'
 + 'body{margin:0;padding:16px;background:var(--bg);color:var(--tx);font:13px/1.4 system-ui,sans-serif}h1{font-size:18px;margin:0 0 6px}p{color:var(--mu);margin:4px 0 10px;max-width:900px}'
 + '.w{overflow-x:auto}table{border-collapse:collapse;background:var(--card)}th,td{border:1px solid var(--ln);padding:4px 5px;text-align:center;white-space:nowrap}th.fg{text-align:left}th small{color:var(--mu);font-weight:400}'
 + '.cn{background:rgba(22,163,74,.10)}.ch{color:#2563eb;font-weight:700;margin-right:2px}.bl{color:#dc2626;font-weight:700;margin-right:2px}.mq{color:#15803d;font-weight:700}.mo{color:var(--mu)}td.sm{text-align:left;color:var(--mu);font-size:12px}'
 + '.lg span{margin-right:14px}</style></head><body><h1>Blocage et marquage de chaque figure</h1>'
 + '<p class="lg"><span class="ch">★</span>chez elle (avantage) <span class="bl">✖</span>maison qu\'elle bloque (énergie de la figure qu\'elle antagonise) <span class="mq">EA</span>niveaux activés (1 + 1 = 2), action concrétisée <span class="mo">EA</span>niveaux activés, non concrétisés · colonnes vertes : canaux Terre (M4, M8, M12, M13, M14, M15) · « sat » : Populus, entièrement saturé · survol d\'une case : résultante et Terre.</p>'
 + '<p>Concrétisé = maison en canal Terre, ou Terre de la résultante saturée. Étude en cours, à confronter aux matchs (Juventus–Venezia, Atlético–Viking…).</p>'
 + '<div class="w"><table>' + head + rows + '</table></div></body></html>';
// MATRICE DES 256 COMBINAISONS (demande du propriétaire) : figure g (ligne) posée en maison h (colonne) → résultante g + h, dessinée en points ;
// niveaux saturés (2 points) : Terre en bleu, Feu / Air / Eau en rouge ; niveaux ouverts (1 point) en gris.
const pts = f => '<div class="pf">' + K.niveaux(f).map((v, l) => '<i>' + (v === 2 ? '<b class="' + (l === 3 ? 'st' : 'sr') + '"></b><b class="' + (l === 3 ? 'st' : 'sr') + '"></b>' : '<b class="so"></b>') + '</i>').join('') + '</div>';
let mrows = '';
for (let g = 1; g <= 16; g++) { let r = '<tr><th class="fg">' + g + ' · ' + N(g) + '</th>'; for (let h = 1; h <= 16; h++) { const res = K.additionner(g, h); r += '<td class="' + (CANAL.includes(h) ? 'cn' : '') + '" title="' + N(g) + ' en M' + h + ' → ' + N(res) + '">' + pts(res) + '<div class="rn">' + N(res) + '</div></td>'; } mrows += r + '</tr>'; }
const mhead = '<tr><th>Figure ↓ · maison →</th>' + [...Array(16)].map((_, i) => '<th class="' + (CANAL.includes(i + 1) ? 'cn' : '') + '">M' + (i + 1) + '<div class="rn">' + N(i + 1) + '</div></th>').join('') + '</tr>';
const matrice = '<h1 style="margin-top:28px">Matrice des 256 combinaisons</h1><p>Chaque case : la résultante de la figure (ligne) posée dans la maison (colonne). Niveaux saturés : <b style="color:#2563eb">Terre en bleu</b>, <b style="color:#dc2626">Feu, Air, Eau en rouge</b> ; niveaux ouverts en gris. Diagonale : figure chez elle (résultante Populus). Colonnes vertes : canaux Terre.</p><div class="w"><table class="mx">' + mhead + mrows + '</table></div>';
const html2 = html.replace('</body></html>', matrice + '</body></html>').replace('</style>', '.pf{display:flex;flex-direction:column;align-items:center;gap:2px}.pf i{display:flex;gap:3px;height:6px}.pf b{width:6px;height:6px;border-radius:50%;display:block}.st{background:#2563eb}.sr{background:#dc2626}.so{background:#9ca3af}.rn{font-size:9px;color:var(--mu);margin-top:2px}table.mx td{padding:3px 4px}</style>');
fs.writeFileSync(path.join(__dirname, '../validation/TABLEAU-BLOCAGE-MARQUAGE.html'), html2); console.log('tableau écrit');
