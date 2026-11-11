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

function testerConditions(si, donnees) {
  // On découpe aux OU : la règle est vraie si au moins un groupe ET est entièrement vrai.
  const groupes = [[]];
  for (const c of si) {
    if (c.lien === "OU" && groupes.at(-1).length) groupes.push([]);
    groupes.at(-1).push(c);
  }
  return groupes.some(g => g.every(c => testerCondition(c, donnees)));
}

function evaluer(regles, donnees) {
  return regles.filter(r => testerConditions(r.si, donnees));
}

// Utilisable aussi depuis Node : const { evaluer } = require("./engine.js")
if (typeof module !== "undefined") module.exports = { evaluer, testerConditions, OPERATEURS };
