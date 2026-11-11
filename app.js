// Interface : lit le formulaire, appelle evaluer(), affiche le résultat.

let regles = charger() || [
  { nom: "Majeur", si: [{ champ: "age", op: ">=", valeur: "18" }], alors: "Accès autorisé" },
  { nom: "Client fidèle", si: [{ champ: "achats", op: ">=", valeur: "10" }, { champ: "pays", op: "=", valeur: "SN" }],
    alors: "Appliquer 10 % de remise" },
];

const $ = id => document.getElementById(id);
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const texteCond = c => `${c.champ} ${c.op} ${c.valeur}`;

function charger() { try { return JSON.parse(localStorage.getItem("regles")); } catch { return null; } }
function sauver()  { try { localStorage.setItem("regles", JSON.stringify(regles)); } catch {} }

// --- Liste des règles ---
function afficherRegles() {
  $("liste-regles").innerHTML = regles.length ? regles.map((r, i) => `
    <li><span><strong>${esc(r.nom)}</strong><br>
      <span class="doux">SI</span> <code>${esc(r.si.map(texteCond).join(" ET "))}</code>
      <span class="doux">ALORS</span> ${esc(r.alors)}</span>
      <button class="lien" data-suppr="${i}" title="Supprimer">✕</button></li>`).join("")
    : '<li class="doux">Aucune règle.</li>';
}
$("liste-regles").addEventListener("click", e => {
  const i = e.target.dataset.suppr;
  if (i !== undefined) { regles.splice(i, 1); sauver(); afficherRegles(); }
});

// --- Formulaire d'ajout ---
const options = Object.keys(OPERATEURS).map(o => `<option>${esc(o)}</option>`).join("");
function ajouterLigneCondition() {
  const div = document.createElement("div");
  div.className = "ligne cond";
  div.innerHTML = `<span>${$("conditions").children.length ? "ET" : "SI"}</span>
    <input class="c-champ" placeholder="champ (ex. age)" required>
    <select class="c-op">${options}</select>
    <input class="c-valeur" placeholder="valeur" required>`;
  $("conditions").appendChild(div);
}
$("btn-ajout-cond").onclick = ajouterLigneCondition;

$("form-regle").addEventListener("submit", e => {
  e.preventDefault();
  const si = [...document.querySelectorAll("#conditions .cond")].map(d => ({
    champ: d.querySelector(".c-champ").value.trim(),
    op: d.querySelector(".c-op").value,
    valeur: d.querySelector(".c-valeur").value.trim(),
  }));
  regles.push({ nom: $("r-nom").value.trim(), si, alors: $("r-alors").value.trim() });
  sauver(); afficherRegles();
  e.target.reset(); $("conditions").innerHTML = ""; ajouterLigneCondition();
});

// --- Données de test ---
function ajouterLigneDonnee(champ = "", valeur = "") {
  const div = document.createElement("div");
  div.className = "ligne donnee";
  div.innerHTML = `<input class="d-champ" placeholder="champ" value="${esc(champ)}">
    <input class="d-valeur" placeholder="valeur" value="${esc(valeur)}">`;
  $("donnees").appendChild(div);
}
$("btn-ajout-donnee").onclick = () => ajouterLigneDonnee();

$("btn-evaluer").onclick = () => {
  const donnees = {};
  document.querySelectorAll("#donnees .donnee").forEach(d => {
    const champ = d.querySelector(".d-champ").value.trim();
    if (champ) donnees[champ] = d.querySelector(".d-valeur").value.trim();
  });
  const ok = evaluer(regles, donnees);
  $("resultat").className = ok.length ? "" : "doux";
  $("resultat").innerHTML = ok.length
    ? ok.map(r => `<div class="declenchee">✔ <strong>${esc(r.nom)}</strong> → ${esc(r.alors)}</div>`).join("")
    : "Aucune règle déclenchée.";
};

// --- Démarrage ---
afficherRegles();
ajouterLigneCondition();
ajouterLigneDonnee("age", "20");
ajouterLigneDonnee("achats", "12");
ajouterLigneDonnee("pays", "SN");
