// Points d'attaque = maisons impaires (fronts A et C). Base et résultante y sont de camps opposés.
const J=require('./src/J.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const md=n=>((n-1)%16+16)%16+1;
const variants={};const add=(k,id,exp,a,b)=>{(variants[k]=variants[k]||[]).push({id,exp,a,b});};
for(const r of J.references){const s=r.snapshot,p1=N(s.theme[s.poles.R1]);const camp=f=>(N(f)%2)===(p1%2)?0:1;
 const wins=[0,0],winsAtt=[0,0],winsA=[0,0],winsC=[0,0],force=[0,0],attaques=[0,0],attaquesGagnees=[0,0],holdEven=[0,0],holdTerre=[0,0],holdAir=[0,0];
 const det=[];
 for(const h of s.houses){const b=h.base,res=h.result,fb=h.forceBase,fr=h.forceResultante;
  if(h.house%2===0){holdEven[camp(b)]++;(h.house%4===0?holdTerre:holdAir)[camp(b)]++;continue;}
  const cb=camp(b),cr=camp(res);const nb=N(b),nr=N(res);
  const rel=md(nb+3)===nr?'base→rés':md(nr+3)===nb?'rés→base':'—';
  if(rel==='base→rés'){attaques[cb]++;}else if(rel==='rés→base'){attaques[cr]++;}
  let w=null;if(fb!==null&&fr!==null&&fb!==fr)w=fb>fr?cb:cr;
  if(w!==null){wins[w]++;if(rel!=='—')winsAtt[w]++;if(h.house%4===1)winsA[w]++;else winsC[w]++;
   if(rel==='base→rés'&&w===cb)attaquesGagnees[cb]++;if(rel==='rés→base'&&w===cr)attaquesGagnees[cr]++;}
  det.push('M'+h.house+' '+b+'('+['R1','R7'][cb]+' '+(fb??'nc')+') / '+res+'('+['R1','R7'][cr]+' '+(fr??'nc')+') '+rel+(w===null?' =':' → '+['R1','R7'][w]));}
 const id=r.id.replace('_REFERENCE','').replace('VICTOIRE','V').replace('NUL','N').replace('AZ_VILLARREAL','AZ');
 add('maisons impaires gagnées (force)',id,r.expected,...wins);
 add('… seulement si relation d’attaque',id,r.expected,...winsAtt);
 add('attaques portées (impaires)',id,r.expected,...attaques);
 add('attaques gagnées',id,r.expected,...attaquesGagnees);
 add('impaires gagnées + paires tenues',id,r.expected,wins[0]+holdEven[0],wins[1]+holdEven[1]);
 add('impaires gagnées + Terre tenues',id,r.expected,wins[0]+holdTerre[0],wins[1]+holdTerre[1]);
 if(process.argv[2]===id)console.log(det.join('\n'));
}
for(const [k,v] of Object.entries(variants)){let ok=0,nul=0;const d=v.map(x=>{const pr=x.a>x.b?'1':x.b>x.a?'2':'N';if(x.exp!=='N'&&pr===x.exp)ok++;if(x.exp==='N'&&pr==='N')nul++;return x.id+':'+x.a+'-'+x.b;});
 console.log(k.padEnd(34),'victoires',ok+'/5','nuls à égalité',nul+'/6','|',d.join(' '));}
