// Moteur de règles « si / alors » — une seule couche, aucune dépendance.
//
// Une règle :
//   { nom: "Remise fidélité",
//     si: [ { champ: "achats", op: ">=", valeur: 10 } ],   // toutes les conditions (ET)
//     alors: "Appliquer 10 % de remise" }
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

function evaluer(regles, donnees) {
  return regles.filter(r => r.si.every(c => testerCondition(c, donnees)));
}

// Utilisable aussi depuis Node : const { evaluer } = require("./engine.js")
if (typeof module !== "undefined") module.exports = { evaluer, OPERATEURS };
