function ficheDuel(g){
  const F=J.figures,N=f=>F.indexOf(f)+1,fig=n=>F[((n-1)%16+16)%16],md=n=>((n-1)%16+16)%16+1;
  const CARD={1:"Est",5:"Nord",9:"Ouest",13:"Sud",2:"Est",6:"Nord",10:"Ouest",14:"Sud",3:"Est",15:"Nord",11:"Ouest",7:"Sud",4:"Est",16:"Nord",12:"Ouest",8:"Sud"};
  const nom=f=>f+" ("+"ABCD"[(N(f)-1)%4]+" · "+CARD[N(f)]+")";
  const pos=f=>{const o=[];for(const h of g.houses)for(const x of h.positions||[])if(x.figure===f&&(x.couches.includes("base")||x.couches.includes("resultante")))o.push({h:h.house,c:x.couches.includes("base")?"base":"résultante",f:x.forcePct,el:h.elementMaison});return o;};
  const txt=l=>l.length?l.map(x=>"M"+x.h+" "+x.c+" "+(x.f===null?"non chiffré":x.f+" %")+(x.h%4===0?" (Terre)":"")).join(" · "):"absent";
  const mx=l=>l.length?Math.max(...l.map(x=>x.f||0)):-1;
  const maison=h=>{const m=g.houses[h-1];return "M"+h+" : "+m.base+(h===16?"":" → "+m.result);};
  return ["R1","R7"].map(k=>{
    const pf=g.theme[g.poles[k]],n=N(pf),A=fig(n-3),K=fig(n-6),pa=pos(A),pk=pos(K);
    const rep=g.houses[n-1],chez=rep.base===pf||rep.result===pf;
    const etat=pa.length===0||mx(pa)<=1?"mal positionné":pk.length&&mx(pk)>mx(pa)?"contrôlé":"ni contrôlé ni mal positionné";
    const hp=md(g.poles[k]-3);
    return {camp:k,lignes:[
      ["Pôle",nom(pf)+" en M"+g.poles[k]],
      ["Sa maison de repos","M"+n+(chez?" : le pôle y est":" : le pôle est absent")+" ("+maison(n).replace(/^M\d+ : /,"")+")"],
      ["Positions du pôle",txt(pos(pf))],
      ["Antagoniste (figure qui l’attaque)",nom(A)+" : "+txt(pa)],
      ["Contrôleur (attaque l’antagoniste)",nom(K)+" : "+txt(pk)],
      ["État de l’antagoniste",etat],
      ["Maison qui attaque la maison du pôle",maison(hp)],
      ["Annulations (deux puissances maximales liées par l’attaque)",(()=>{const av=g.decision&&g.decision.annulationsEtVerrous;if(!av)return "non calculé";const l=av.annulations.filter(a=>a.campAttaquant===k||a.campCible===k);return l.length?l.map(a=>a.attaquant+" (M"+a.maisonAttaquant+") → "+a.cible+" (M"+a.maisonCible+")").join(" · "):"aucune";})()],
      ["Verrou de front (deux figures du même front en base, à leur repos)",(()=>{const av=g.decision&&g.decision.annulationsEtVerrous;if(!av)return "non calculé";const l=av.verrous.filter(v=>v.camp===k);return l.length?l.map(v=>v.figures[0]+" (M"+v.maisons[0]+") + "+v.figures[1]+" (M"+v.maisons[1]+"), front "+v.front+" : victoire assurée").join(" · "):"aucun";})()]]};
  });
}
