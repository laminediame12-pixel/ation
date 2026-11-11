// M10 + miroir M2, M4 + miroir M12, sur les 11 thèmes réels uniquement.
const J=require('./src/J.json');const live=require('./refs140.json');const F=J.figures;const N=f=>F.indexOf(f)+1;const fig=n=>F[((n-1)%16+16)%16];
const C={1:'E',5:'N',9:'O',13:'S',2:'E',6:'N',10:'O',14:'S',3:'E',15:'N',11:'O',7:'S',4:'E',16:'N',12:'O',8:'S'};
const ab=f=>({Puer:'Puer',Laetitia:'Laet',Caput:'Cap',Albus:'Alb',Via:'Via',Amissio:'Amis',Rubeus:'Rub',Tristitia:'Trist','Fortuna Minor':'FMin',Carcer:'Carc',Conjunctio:'Conj','Fortuna Major':'FMaj','Cauda Draconis':'Cauda',Puella:'Puel',Aquisitio:'Aqui',Populus:'Pop'})[f];
const lab=f=>ab(f)+'('+'ABCD'[(N(f)-1)%4]+C[N(f)]+')';
const out=[];
for(const r of J.references){const c=live.find(x=>x.id===r.id).c;const h=k=>c.houses[k-1];
 const q={R1:N(c.theme[c.poles.R1]),R7:N(c.theme[c.poles.R7])};const meme=(q.R1%2)===(q.R7%2);
 const tag=f=>{const n=N(f),t=[];for(const k of ['R1','R7']){const d=((n-q[k])%16+16)%16;const nom={0:'pôle',8:'miroir',3:'cible',13:'antag',10:'contrôleur',4:'voisin',12:'voisin'}[d];if(nom)t.push(nom+' '+k);}return t.join('/');};
 const camp=f=>meme?((N(f)%2)===(q.R1%2)?'pôles':'aucun'):((N(f)%2)===(q.R1%2)?'R1':'R7');
 const cell=k=>{const m=h(k);const tb=tag(m.base),tr=tag(m.result);return 'M'+k+' '+lab(m.base)+' '+(m.forceBase??'nc')+'→'+lab(m.result)+' '+(m.forceResultante??'nc')+' ['+camp(m.base)+']'+(tb||tr?' {'+[tb&&'b:'+tb,tr&&'r:'+tr].filter(Boolean).join(' ')+'}':'');};
 // liens croisés entre maisons miroirs
 const L=[];const set=k=>[h(k).base,h(k).result];
 const croise=(a,b)=>{for(const f of set(a))for(const g of set(b)){if(f===g)L.push(ab(f)+' en M'+a+' et M'+b);else if(N(g)===((N(f)+7)%16)+1&&N(f)<N(g))L.push(ab(f)+'↔'+ab(g)+' miroirs M'+a+'/M'+b);}};
 croise(10,2);croise(4,12);croise(10,4);croise(2,12);croise(10,12);croise(2,4);
 out.push({id:r.id,exp:r.expected,meme,cells:[10,2,4,12].map(cell),L});}
for(const x of out){console.log('\n'+x.id+' | '+x.exp+' | '+(x.meme?'même boucle':'boucles ≠'));for(const c of x.cells)console.log('   '+c);console.log('   liens :',x.L.join(' ; ')||'—');}
