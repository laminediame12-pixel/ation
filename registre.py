#!/usr/bin/env python3
"""Registre gelé — protocole de test prospectif (voir PROTOCOLE.md).

Chaque prédiction est ajoutée avec l'empreinte SHA-256 de l'entrée précédente :
toute modification rétroactive casse la chaîne et devient visible par `verify`.
"""
import argparse, hashlib, json, os, sys
from datetime import datetime, timezone
from math import comb

REG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "registre.jsonl")
N_CIBLE = 150
ALPHA = 0.01

FAMILLES = {          # nom : (temoin, seuil sur 150, valeurs admises)
    "camp":     (0.45, 83,  ("R1", "R7", "Nul", "abstention")),
    "btts":     (0.52, 93,  ("oui", "non")),
    "volume":   (0.52, 93,  ("plus", "moins")),
    "incident": (0.65, 112, ("oui", "non")),
    "nul":      (0.75, 125, ("oui", "non")),
}


def lire():
    if not os.path.exists(REG):
        return []
    with open(REG, encoding="utf-8") as f:
        return [json.loads(l) for l in f if l.strip()]


def empreinte(entree):
    """Empreinte de la partie GELEE seulement.

    Le resultat est saisi apres coup et ne doit pas casser la chaine ; en
    revanche toute retouche d'une prediction, d'un match ou d'une date la casse.
    """
    base = {k: entree[k] for k in ("id", "gele_le", "match", "date_match", "prediction", "prec")}
    return hashlib.sha256(json.dumps(base, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def cmd_freeze(a):
    lignes = lire()
    for f, (_, _, admis) in FAMILLES.items():
        v = getattr(a, f)
        if v not in admis:
            sys.exit("%s doit etre parmi %s (recu: %s)" % (f, "/".join(admis), v))
    entree = {
        "id": len(lignes) + 1,
        "gele_le": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "match": a.match,
        "date_match": a.date,
        "prediction": {f: getattr(a, f) for f in FAMILLES},
        "resultat": None,
        "prec": lignes[-1]["hash"] if lignes else "GENESE",
    }
    entree["hash"] = empreinte(entree)
    with open(REG, "a", encoding="utf-8") as f:
        f.write(json.dumps(entree, ensure_ascii=False) + "\n")
    print("gele  #%d  %s  %s" % (entree["id"], entree["match"], entree["prediction"]))
    print("reste %d matchs avant le bilan" % max(0, N_CIBLE - len(lignes) - 1))


def cmd_result(a):
    lignes = lire()
    cible = next((l for l in lignes if l["id"] == a.id), None)
    if not cible:
        sys.exit("id %d introuvable" % a.id)
    if cible["resultat"]:
        sys.exit("resultat deja saisi pour #%d — une entree gelee ne se modifie pas" % a.id)
    try:
        b1, b2 = (int(x) for x in a.score.split("-"))
    except Exception:
        sys.exit("score attendu sous la forme 2-1")
    cible["resultat"] = {
        "saisi_le": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "score": a.score, "buts": [b1, b2],
        "penalty": a.penalty, "rouge": a.rouge,
    }
    with open(REG, "w", encoding="utf-8") as f:
        for l in lignes:
            f.write(json.dumps(l, ensure_ascii=False) + "\n")
    print("resultat enregistre pour #%d : %s" % (a.id, a.score))


def cmd_verify(a):
    lignes = lire()
    prec = "GENESE"
    casse = []
    for l in lignes:
        if l["prec"] != prec:
            casse.append((l["id"], "chainage rompu"))
        if empreinte(l) != l["hash"]:
            casse.append((l["id"], "prediction modifiee apres le gel"))
        prec = l["hash"]
    notes = sum(1 for l in lignes if l["resultat"])
    print("entrees : %d  (dont %d avec resultat saisi)" % (len(lignes), notes))
    if casse:
        print("!! CHAINE CASSEE :", casse)
    else:
        print("chaine intacte — aucune prediction n'a ete retouchee apres son gel")


def binom_p(k, n, p):
    return sum(comb(n, i) * p ** i * (1 - p) ** (n - i) for i in range(k, n + 1))


def cmd_bilan(a):
    lignes = [l for l in lire() if l["resultat"]]
    n = len(lignes)
    print("=" * 64)
    print("BILAN — %d matchs joues et notes (cible %d)" % (n, N_CIBLE))
    if n < N_CIBLE and not a.force:
        print("\nLe protocole interdit de conclure avant %d matchs." % N_CIBLE)
        print("Regarder le score en cours pousse a ajuster les regles : c'est exactement")
        print("ce que le test doit empecher. Relance avec --force seulement si tu")
        print("comprends que le resultat affiche ne vaudra rien.")
        return
    print("=" * 64)
    abst = sum(1 for l in lignes if l["prediction"]["camp"] == "abstention")
    for fam, (temoin, seuil, _) in FAMILLES.items():
        justes = total = 0
        for l in lignes:
            p, r = l["prediction"][fam], l["resultat"]
            b1, b2 = r["buts"]
            if fam == "camp":
                if p == "abstention":
                    continue
                reel = "R1" if b1 > b2 else "R7" if b2 > b1 else "Nul"
            elif fam == "btts":
                reel = "oui" if b1 > 0 and b2 > 0 else "non"
            elif fam == "volume":
                reel = "plus" if b1 + b2 > 2.5 else "moins"
            elif fam == "incident":
                reel = "oui" if (r["penalty"] == "oui" or r["rouge"] == "oui") else "non"
            else:
                reel = "oui" if b1 == b2 else "non"
            total += 1
            justes += (p == reel)
        if not total:
            continue
        # seuil recalcule si N reel different de 150
        if total == N_CIBLE:
            s = seuil
        else:
            s = next((k for k in range(total + 1) if binom_p(k, total, temoin) <= ALPHA), None)
        pval = binom_p(justes, total, temoin)
        if s is None:
            print("%-9s %3d/%-3d = %5.1f%%  | temoin %.0f%%  p=%.4f  -> N TROP PETIT, "
                  "aucun score ne peut conclure" % (fam, justes, total, 100 * justes / total,
                                                    100 * temoin, pval))
            continue
        verdict = "SIGNAL REEL" if justes >= s else "pas de signal"
        print("%-9s %3d/%-3d = %5.1f%%  | temoin %.0f%%  seuil %d  p=%.4f  -> %s"
              % (fam, justes, total, 100 * justes / total, 100 * temoin, s, pval, verdict))
    if abst:
        taux = 100 * abst / n
        print("\nabstentions : %d/%d = %.1f%%%s" % (abst, n, taux,
              "  !! > 20 % : TEST NON CONCLUANT" if taux > 20 else ""))


p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sub = p.add_subparsers(dest="cmd", required=True)

f = sub.add_parser("freeze", help="geler les 5 predictions AVANT le coup d'envoi")
f.add_argument("--match", required=True)
f.add_argument("--date", required=True)
f.add_argument("--camp", required=True, help="R1 | R7 | Nul | abstention")
f.add_argument("--btts", required=True, help="oui | non")
f.add_argument("--volume", required=True, help="plus | moins")
f.add_argument("--incident", required=True, help="oui | non")
f.add_argument("--nul", required=True, help="oui | non")
f.set_defaults(func=cmd_freeze)

r = sub.add_parser("result", help="saisir le resultat reel APRES le match")
r.add_argument("--id", type=int, required=True)
r.add_argument("--score", required=True, help="ex: 2-1")
r.add_argument("--penalty", required=True, choices=["oui", "non"])
r.add_argument("--rouge", required=True, choices=["oui", "non"])
r.set_defaults(func=cmd_result)

v = sub.add_parser("verify", help="verifier l'integrite de la chaine")
v.set_defaults(func=cmd_verify)

b = sub.add_parser("bilan", help="verdict final (a 150 matchs)")
b.add_argument("--force", action="store_true")
b.set_defaults(func=cmd_bilan)

a = p.parse_args()
a.func(a)
