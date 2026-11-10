// Concordance base + résultante des renforts M8 / M12, avec les deux tables d'éléments.
const J=require('./src/J.json');const F=J.figures;const N=f=>F.indexOf(f)+1;
const ACT={Puer:'Feu',Laetitia:'Feu','Fortuna Minor':'Feu',Populus:'Feu',Caput:'Air',Rubeus:'Air',Conjunctio:'Air',Aquisitio:'Air',Albus:'Eau',Via:'Eau',Amissio:'Eau','Cauda Draconis':'Eau',Tristitia:'Terre',Carcer:'Terre','Fortuna Major':'Terre',Puella:'Terre'};
const FRONT=f=>['Feu','Air','Eau','Terre'][(N(f)-1)%4];
const B={'Feu|Feu':85,'Air|Air':85,'Eau|Eau':85,'Terre|Terre':85,'Eau|Terre':70,'Air|Feu':70,'Feu|Terre':55,'Air|Eau':55,'Eau|Feu':1,'Air|Terre':1};
const force=(f,h,el)=>N(f)===h?100:B[[el(f),'Terre'].sort().join('|')];
const acc={8:k=>((k+7)%16)+1,12:k=>({1:13,13:1,2:14,14:2,3:7,7:3,4:8,8:4,5:9,9:5,6:10,10:6,11:15,15:11,12:16,16:12})[k]};
for(const [nom,el] of [['Table actuelle',f=>ACT[f]],['Éléments = fronts',FRONT]]){console.log('== '+nom);
 for(const r of J.references){const s=r.snapshot,p1=N(s.theme[s.poles.R1]),p7=N(s.theme[s.poles.R7]);const out=[];
  for(const h of [8,12]){const b=N(s.theme[h]),res=acc[h](b);const camps=[];if(b===p1||res===p1)camps.push('R1');if(b===p7||res===p7)camps.push('R7');
   if(!camps.length)continue;const fb=force(F[b-1],h,el),fr=force(F[res-1],h,el);
   out.push('M'+h+' '+camps.join('+')+' : '+F[b-1]+' '+fb+' % + '+F[res-1]+' '+fr+' % = '+(fb+fr));}
  if(out.length)console.log(' '+r.id.padEnd(21),'att',r.expected,'|',out.join(' | '));}}
