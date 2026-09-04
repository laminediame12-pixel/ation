#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Reconstruit un fichier HTML unique et portable à partir de la page
découpée et de js/*.js.

Le développement se fait dans js/ ; ce script sert quand on veut UN seul
fichier à envoyer, ouvrir ailleurs ou archiver. Il remplace chaque
<script src="js/..."></script> par le contenu du fichier, dans l'ordre —
donc la sémantique est identique, à l'exception près documentée dans
js/01-amorce.js (les auto-tests, joués à la fin dans les deux cas).

    python3 outils/construire_fichier_unique.py [sortie.html]
"""
import io, os, re, sys

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(RACINE, 'systeme_geomantique.html')
SORTIE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RACINE, 'systeme_geomantique.unique.html')

page = io.open(SRC, encoding='utf-8').read()
manquants = []

def inline(m):
    chemin = os.path.join(RACINE, m.group(1))
    if not os.path.exists(chemin):
        manquants.append(m.group(1))
        return m.group(0)
    corps = io.open(chemin, encoding='utf-8').read()
    if '</script' in corps.lower():
        raise SystemExit('refus : %s contient la chaîne </script>' % m.group(1))
    return '<script>\n' + corps + '</script>'

res = re.sub(r'<script src="(js/[^"]+)"></script>', inline, page)
if manquants:
    raise SystemExit('fichiers introuvables : ' + ', '.join(manquants))
io.open(SORTIE, 'w', encoding='utf-8').write(res)
print('%s — %d octets' % (SORTIE, len(res)))
