// Moteur de règles « si / alors » — une seule couche, aucune dépendance.
//
// Une règle :
//   { nom: "Remise fidélité",
//     si: [ { champ: "achats", op: ">=", valeur: 10 },
//           { lien: "ET", champ: "pays", op: "=", valeur: "SN" },
//           { lien: "OU", champ: "vip", op: "=", valeur: "oui" } ],
//     alors: "Appliquer 10 % de remise" }
//
// « lien » relie une condition à la précédente (ET par défaut).
// Comme en logique classique, ET est prioritaire sur OU :
//   A ET B OU C  =  (A ET B) OU C
//
// Parenthèses : « ouvre » et « ferme » indiquent combien de ( avant
// et de ) après une condition. Ex. A ET (B OU C) :
//   [ A, { lien: "ET", ouvre: 1, ...B }, { lien: "OU", ...C, ferme: 1 } ]
//
// evaluer(regles, donnees) renvoie la liste des règles déclenchées.

const OPERATEURS = {
  "=":        (a, b) => a == b,
  "!=":       (a, b) => a != b,
  ">":        (a, b) => Number(a) >  Number(b),
  "<":        (a, b) => Number(a) <  Number(b),
  ">=":       (a, b) => Number(a) >= Number(b),
  "<=":       (a, b) => Number(a) <= Number(b),
  "contient": (a, b) => String(a ?? "").toLowerCase().includes(String(b).toLowerCase()),
};

function testerCondition(cond, donnees) {
  const test = OPERATEURS[cond.op];
  if (!test) throw new Error(`Opérateur inconnu : ${cond.op}`);
  if (!(cond.champ in donnees)) return false;
  return test(donnees[cond.champ], cond.valeur);
}

// Transforme la liste de conditions en suite de jetons : "(", ")", "ET", "OU", condition.
function jetons(si) {
  const t = [];
  si.forEach((c, i) => {
    if (i) t.push(c.lien || "ET");
    for (let k = 0; k < (c.ouvre || 0); k++) t.push("(");
    t.push(c);
    for (let k = 0; k < (c.ferme || 0); k++) t.push(")");
  });
  return t;
}

// Vérifie que les parenthèses sont équilibrées. Renvoie un message d'erreur ou null.
function verifierParentheses(si) {
  let niveau = 0;
  for (const j of jetons(si)) {
    if (j === "(") niveau++;
    if (j === ")" && --niveau < 0) return "Parenthèse « ) » sans « ( » correspondante.";
  }
  return niveau ? "Il manque " + niveau + " parenthèse(s) fermante(s)." : null;
}

// Petit analyseur récursif :  expr = terme (OU terme)*   terme = facteur (ET facteur)*
//                             facteur = "(" expr ")" | condition
function testerConditions(si, donnees) {
  const erreur = verifierParentheses(si);
  if (erreur) throw new Error(erreur);
  const t = jetons(si);
  let i = 0;
  const expr = () => { let v = terme();   while (t[i] === "OU") { i++; const d = terme();   v = v || d; } return v; };
  const terme = () => { let v = facteur(); while (t[i] === "ET") { i++; const d = facteur(); v = v && d; } return v; };
  const facteur = () => {
    if (t[i] === "(") { i++; const v = expr(); i++; return v; }  // saute « ) »
    return testerCondition(t[i++], donnees);
  };
  return t.length ? expr() : false;
}

function evaluer(regles, donnees) {
  return regles.filter(r => testerConditions(r.si, donnees));
}

// Utilisable aussi depuis Node : const { evaluer } = require("./engine.js")
if (typeof module !== "undefined") module.exports = { evaluer, testerConditions, verifierParentheses, OPERATEURS };
