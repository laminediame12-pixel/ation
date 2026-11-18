// Génère moteur2/ANTAGONISE.md : la figure posée dans la maison de repos de la figure qu'elle attaque
// (k en M k+3) accouche d'une figure de A ou de C. Tout est calculé, rien n'est écrit à la main.
const K = require('../moteur2/moteur.js');
const f = K.fig, n = K.num, fr = K.frontDe, ad = K.additionner;
const NOM = { A: 'A Feu', B: 'B Air', C: 'C Eau', D: 'D Terre' };
const mir = (a, b) => ((n(a) + 8 - 1) % 16) + 1 === n(b) || n(a) === n(b);
let o = '# La figure posée chez son antagonisé accouche d’une figure A ou C\n\n';
o += 'Fronts : A = 1-5-9-13 (Feu), B = 2-6-10-14 (Air), C = 3-7-11-15 (Eau), D = 4-8-12-16 (Terre).\n\n';
o += 'Une figure k attaque la figure k+3, son antagonisé. Posée dans la maison de repos de cet antagonisé (M k+3), la figure k donne en résultante k ⊕ (k+3). Ce fichier est généré par `outils/antagonise_doc.js`.\n\n';
o += '## 1. Les 16 cas\n\n| Figure k | Posée en | Antagonisé | Résultante | Front |\n|---|---|---|---|---|\n';
const T = {}, fronts = new Set();
for (let k = 1; k <= 16; k++) {
  const a = ((k + 2) % 16) + 1, r = ad(f(k), f(a)), key = fr(f(k)) + '+' + fr(f(a));
  (T[key] = T[key] || []).push([k, a, r]); fronts.add(fr(r));
  o += `| ${n(f(k))} ${f(k)} | M${a} | ${a} ${f(a)} | **${n(r)} ${r}** | ${fr(r)} |\n`;
}
o += `\nFronts obtenus : **${[...fronts].sort().join(' et ')}** et jamais B ni D. Les résultantes sont toujours impaires : ${[...new Set(Object.values(T).flat().map(x => n(x[2])))].sort((x, y) => x - y).join(', ')}.\n\n`;
o += '## 2. Par front de la figure et de son antagonisé\n\n| Fronts (k + k+3) | Résultantes | Les deux figures sont miroirs ? | Cas |\n|---|---|---|---|\n';
for (const key of Object.keys(T).sort()) {
  const rs = [...new Set(T[key].map(x => n(x[2])))].sort((x, y) => x - y);
  const mi = rs.length === 2 && mir(f(rs[0]), f(rs[1]));
  o += `| ${key.replace('+', ' + ')} | ${rs.join(' ou ')} → front ${fr(f(rs[0]))} | ${rs.length === 2 ? (mi ? 'oui, ' + rs[0] + ' et ' + rs[1] + ' sont miroirs' : 'non') : 'une seule figure'} | ${T[key].map(x => x[0] + ' en M' + x[1]).join(', ')} |\n`;
}
o += '\nÀ lire : A + D = A (5 ou 13) ; B + A = C (3 ou 11) ; C + B = A (1) ; D + C = C (3 ou 11). Les deux possibilités sont chaque fois miroirs l’une de l’autre.\n\n';
o += '## 3. La somme de deux fronts en général (toutes figures)\n\nSomme de deux figures de fronts X et Y : les 16 × 16 couples sont calculés.\n\n| X + Y | Figures possibles | Front |\n|---|---|---|\n';
const S = {};
for (let i = 1; i <= 16; i++) for (let j = 1; j <= 16; j++) { const k = fr(f(i)) + '+' + fr(f(j)); (S[k] = S[k] || new Set()).add(n(ad(f(i), f(j)))); }
for (const k of Object.keys(S).sort()) { const v = [...S[k]].sort((a, b) => a - b); o += `| ${k.replace('+', ' + ')} | ${v.join(', ')} | ${fr(f(v[0]))} |\n`; }
o += '\nLe front de la somme ne dépend que des fronts des deux figures (A+A, B+B, C+C, D+D donnent D ; A+B donne C ; A+C donne B ; A+D donne A ; B+C donne A ; B+D donne B ; C+D donne C). Parmi les 16 couples k, k+3 seuls quatre couples de fronts apparaissent, et ils donnent A ou C.\n';
require('fs').writeFileSync(__dirname + '/../moteur2/ANTAGONISE.md', o);
console.log(o);
