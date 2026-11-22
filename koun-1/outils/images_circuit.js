// Images du circuit complet (boucles de front, liaisons par parité).
// Usage : node outils/images_circuit.js 8 5 11 7 [dossier]   → circuit-principe.png et circuit-<thème>.png
const path = require('path'), fs = require('fs'), M = require('../moteur4/moteur.js'), K = require('../moteur3/noyau.js'), A = K.additionner, nm = K.nom;
const meres = process.argv.slice(2, 6).map(Number), out = process.argv[6] || path.join(__dirname, '..', 'images');
fs.mkdirSync(out, { recursive: true });
const L = M.lire(meres), T = L.theme, b = T.bases, rz = h => h < 16 ? T.resultantes[h] : b[16], fr = n => (n - 1) % 4, F = 'ABCD';
const lien = (x, y, l) => K.niveaux(A(rz(x), rz(y)))[l] === 2;
const COL = { Feu: '#dc2626', Air: '#ca8a04', Eau: '#2563eb', Terre: '#78716c', R1: '#1e3a8a', R7: '#991b1b' };
const rel = (fFig, fM) => { const d = ((fM - fFig) % 4 + 4) % 4; return d === 0 ? 'son front' : d === 2 ? 'chez l’allié' : d === 1 ? 'chez l’ennemi' : 'chez sa proie'; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function dots(f, x, y) { // 4 niveaux en colonnes : 1 point = impair, 2 points = pair (saturé)
  return K.niveaux(f).map((v, i) => { const cx = x + i * 16, c = [COL.Feu, COL.Air, COL.Eau, COL.Terre][i]; return v === 2 ? `<circle cx="${cx}" cy="${y - 5}" r="4" fill="${c}"/><circle cx="${cx}" cy="${y + 5}" r="4" fill="${c}"/>` : `<circle cx="${cx}" cy="${y}" r="4" fill="${c}"/>`; }).join('');
}
function boite(h, x, y, pole) {
  const f = b[h], r = rz(h), w = 150, hh = 92, st = pole ? COL[pole] : '#a8a29e', sw = pole ? 4 : 1.5, bg = pole === 'R1' ? '#dbeafe' : pole === 'R7' ? '#fee2e2' : '#fff';
  return `<g><rect x="${x - w / 2}" y="${y - hh / 2}" width="${w}" height="${hh}" rx="10" fill="${bg}" stroke="${st}" stroke-width="${sw}"/>
  <text x="${x - w / 2 + 8}" y="${y - hh / 2 + 17}" font-size="13" font-weight="700" fill="#1c1917">M${h}${pole ? ' · ' + pole : ''}</text>
  <text x="${x + w / 2 - 8}" y="${y - hh / 2 + 17}" font-size="11" text-anchor="end" fill="#57534e">${esc(rel(fr(f), fr(h)))}</text>
  <text x="${x - w / 2 + 8}" y="${y - hh / 2 + 34}" font-size="12" fill="#1c1917">base : <tspan font-weight="700">${esc(nm(f))}</tspan></text>
  <text x="${x - w / 2 + 8}" y="${y + 22}" font-size="10" fill="#57534e">résultante</text>${dots(r, x + 2, y + 18)}
  <text x="${x - w / 2 + 8}" y="${y + 40}" font-size="10" fill="#57534e">${esc(nm(r))}</text></g>`;
}
function trait(x1, y1, x2, y2, c, ok, off, lab) {
  const dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy), ox = -dy / n * off, oy = dx / n * off, a = [x1 + ox, y1 + oy], z = [x2 + ox, y2 + oy], mx = (a[0] + z[0]) / 2, my = (a[1] + z[1]) / 2;
  return `<line x1="${a[0]}" y1="${a[1]}" x2="${z[0]}" y2="${z[1]}" stroke="${c}" stroke-width="${ok ? 4 : 2.5}" ${ok ? '' : 'stroke-dasharray="7 6"'} stroke-linecap="round"/>` +
    (ok ? '' : `<g transform="translate(${mx},${my})"><circle r="9" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M-4,-4 L4,4 M4,-4 L-4,4" stroke="${c}" stroke-width="2.2"/></g>`) +
    (lab ? `<text x="${mx - dy / n * 22}" y="${my + dx / n * 22 + 4}" font-size="10" text-anchor="middle" fill="${c}" font-weight="700">${lab}</text>` : '');
}
function front(z) {
  const H = z + 1, Dr = z + 5, Ba = z + 9, G = z + 13, P = { [H]: [260, 80], [Dr]: [440, 260], [Ba]: [260, 440], [G]: [80, 260] };
  const pole = h => h === L.R1.maison ? 'R1' : h === L.R7.maison ? 'R7' : null, occ = [H, Dr, Ba, G].map(pole).filter(Boolean);
  let s = '';
  // Feu, Air, Eau sur les liaisons miroir (haut–bas, droite–gauche) ; Terre déviée (haut–droite, bas–gauche)
  [[H, Ba], [Dr, G]].forEach(([x, y]) => ['Feu', 'Air', 'Eau'].forEach((k, l) => { s += trait(P[x][0], P[x][1], P[y][0], P[y][1], COL[k], lien(x, y, l), (l - 1) * 11, ''); }));
  [[H, Dr], [Ba, G]].forEach(([x, y]) => { s += trait(P[x][0], P[x][1], P[y][0], P[y][1], COL.Terre, lien(x, y, 3), 0, 'Terre'); });
  [H, Dr, Ba, G].forEach(h => { s += boite(h, P[h][0], P[h][1], pole(h)); });
  const et = [lien(H, Dr, 3), lien(Dr, G, 2), lien(G, Ba, 3), lien(Ba, H, 2)].filter(Boolean).length;
  const titre = `Front ${F[z]} — maisons ${H}, ${Dr}, ${Ba}, ${G}` + (occ.length ? ' · occupé par ' + occ.join(' et ') : '');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="560" viewBox="0 0 520 560" font-family="Inter,Arial,sans-serif"><rect width="520" height="560" rx="14" fill="#fafaf9" stroke="${occ[0] ? COL[occ[0]] : '#d6d3d1'}" stroke-width="${occ.length ? 3 : 1}"/>
  <text x="18" y="26" font-size="15" font-weight="800" fill="#1c1917">${esc(titre)}</text>${s}
  <text x="18" y="540" font-size="12" fill="#44403c">Circuit Eau–Terre (M${H} → M${Dr} → M${G} → M${Ba} → M${H}) : ${et} liaison${et > 1 ? 's' : ''} sur 4</text></svg>`;
}
const legende = `<div class="lg"><span><i style="background:${COL.Feu}"></i>Feu</span><span><i style="background:${COL.Air}"></i>Air</span><span><i style="background:${COL.Eau}"></i>Eau</span><span><i style="background:${COL.Terre}"></i>Terre</span><span>trait plein : liée (2+2 ou 1+1)</span><span>tireté ✕ : arrêt (1+2)</span><span><b style="color:${COL.R1}">■ R1</b> ${esc(nm(L.R1.figure))} en M${L.R1.maison}</span><span><b style="color:${COL.R7}">■ R7</b> ${esc(nm(L.R7.figure))} en M${L.R7.maison}</span></div>`;
const css = `body{margin:0;background:#f5f5f4;font-family:Inter,Arial,sans-serif;color:#1c1917}.w{padding:22px;width:1100px}h1{font-size:22px;margin:0 0 4px}p{margin:4px 0 12px;color:#44403c;font-size:14px}.g{display:grid;grid-template-columns:520px 520px;gap:20px}.lg{display:flex;flex-wrap:wrap;gap:14px;font-size:13px;margin:8px 0 14px}.lg i{display:inline-block;width:22px;height:4px;vertical-align:middle;margin-right:5px;border-radius:2px}`;
const page = `<!doctype html><meta charset="utf-8"><style>${css}</style><div class="w" id="c"><h1>Circuit complet — thème ${meres.join('-')}</h1><p>Chaque boucle de front : haut f, droite f+4, bas f+8, gauche f+12. Feu, Air et Eau relient chaque maison à son miroir ; la Terre relie la maison à son front direct (haut ↔ droite, bas ↔ gauche). Une liaison vaut la somme des deux niveaux des résultantes : 2+2 = 2 et 1+1 = 2 (liée), 1+2 = 1 (arrêt).</p>${legende}<div class="g">${[0, 1, 2, 3].map(front).join('')}</div></div>`;
// principe
const pr = `<!doctype html><meta charset="utf-8"><style>${css}</style><div class="w" id="c" style="width:760px"><h1>Le circuit Eau–Terre d’un pôle</h1><p>Le pôle P est lu dans la boucle de front qu’il occupe. L’action part par la Terre vers son front direct Q, passe par l’Eau au miroir Q′, revient par la Terre (relais) au miroir du pôle P′, puis par l’Eau au pôle. Feu et Air vont ensemble sur les liaisons miroir. R7 occupe toujours la boucle alliée de celle de R1 (sa maison = celle de R1 + 6).</p>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="470" viewBox="0 0 720 470" font-family="Inter,Arial,sans-serif"><defs><marker id="m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#44403c"/></marker></defs>
${[['P', 'pôle (haut f)', 360, 70], ['Q', 'front direct (droite f+4)', 610, 235], ['P′', 'miroir du pôle (bas f+8)', 360, 400], ['Q′', 'miroir de Q (gauche f+12)', 110, 235]].map(([k, t, x, y]) => `<rect x="${x - 95}" y="${y - 34}" width="190" height="68" rx="12" fill="${k === 'P' ? '#dbeafe' : '#fff'}" stroke="${k === 'P' ? COL.R1 : '#a8a29e'}" stroke-width="${k === 'P' ? 4 : 1.5}"/><text x="${x}" y="${y - 4}" font-size="22" font-weight="800" text-anchor="middle">${k}</text><text x="${x}" y="${y + 18}" font-size="12" text-anchor="middle" fill="#57534e">${t}</text>`).join('')}
<path d="M455,90 L555,200" stroke="${COL.Terre}" stroke-width="5" marker-end="url(#m)"/><text x="525" y="132" font-size="14" font-weight="700" fill="${COL.Terre}">1 · Terre</text>
<path d="M515,240 L205,240" stroke="${COL.Eau}" stroke-width="5" marker-end="url(#m)"/><text x="520" y="230" font-size="14" font-weight="700" fill="${COL.Eau}" text-anchor="middle">2 · Eau (Q → Q′)</text>
<path d="M165,270 L265,380" stroke="${COL.Terre}" stroke-width="5" marker-end="url(#m)"/><text x="120" y="340" font-size="14" font-weight="700" fill="${COL.Terre}">3 · Terre (relais)</text>
<path d="M360,366 L360,104" stroke="${COL.Eau}" stroke-width="5" marker-end="url(#m)"/><text x="372" y="300" font-size="14" font-weight="700" fill="${COL.Eau}">4 · Eau (P′ → P)</text>
<path d="M320,104 L320,366" stroke="${COL.Feu}" stroke-width="3"/><path d="M310,104 L310,366" stroke="${COL.Air}" stroke-width="3"/><text x="302" y="320" font-size="12" font-weight="700" fill="#44403c" text-anchor="end">Feu + Air (miroir)</text></svg>
<p>Exemple vérifié : Albus en M4 et Tristitia en M8 ont la Terre saturée : 2 + 2 = 2, liée. Puer posé en base de M4 inverse les 4 niveaux d’Albus : la Terre de M4 passe à 1, 1 + 2 = 1, la liaison M4–M8 est en arrêt, et le miroir M4–M12 est coupé sur Feu, Air et Eau.</p></div>`;
(async () => {
  const { chromium } = require('playwright'), br = await chromium.launch(), p = await br.newPage({ deviceScaleFactor: 2, viewport: { width: 1200, height: 900 } });
  for (const [nom, html] of [['circuit-principe', pr], ['circuit-' + meres.join('-'), page]]) { await p.setContent(html); await (await p.$('#c')).screenshot({ path: path.join(out, nom + '.png') }); console.log(path.join(out, nom + '.png')); }
  await br.close();
})();
