# Recopie le moteur 4 (moteur4/moteur.js) dans koun.html, entre « /* koun — moteur 4 » et la fin de l'enveloppe.
p='/home/user/ation/koun-1/koun.html';s=open(p).read();m=open('/home/user/ation/koun-1/moteur4/moteur.js').read()
a=m.index('/* koun — moteur 4');b=m.index("})(typeof window !== 'undefined' ? window : globalThis);\n")
new=m[a:b].replace("(typeof require !== 'undefined' && typeof module !== 'undefined') ? require('../moteur3/noyau.js') : root.KOUN_NOYAU","root.KOUN_NOYAU")
a2=s.index('/* koun — moteur 4');b2=s.index("})(typeof window !== 'undefined' ? window : globalThis);\n",a2)
s=s[:a2]+new+s[b2:]
open(p,'w').write(s)
