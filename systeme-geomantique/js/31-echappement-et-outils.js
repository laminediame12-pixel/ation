// ═══════════════════════════════════════════════════════════════
// ECHAPPEMENT ET OUTILS
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════

/* =========================================================
   GEOMANCIE FOOTBALL - NOYAU REFACTORE V1
========================================================= */
(function(){
// ☠️ SIX FIGURES SUR SEIZE AVAIENT DE MAUVAIS BITS (29/08/26, révision
// d'ensemble). Ce noyau V1 est un module séparé, avec sa propre table :
// elle ne s'accordait pas avec MAP_GEO, la table du moteur principal.
//     Albus portait 2122, qui est Rubeus, et Rubeus 2212, qui est Albus
//     Laetitia portait 2111, qui est Caput Draconis
//     Tristitia portait 1112, qui est Cauda Draconis
//     Caput Draconis portait 2112 — un DOUBLON de Conjunctio
//     Cauda Draconis portait 1221 — un DOUBLON de Carcer
// Conséquence : deux motifs sur seize (1222 et 2221) n'existaient dans
// aucune figure. Dès qu'une fille, une nièce ou un juge tombait sur l'un
// des deux, figFromBits renvoyait null et le panneau plantait sur
// « Cannot read properties of undefined (reading 'bits') ». C'est ce qui
// arrivait avec les quatre mères posées par défaut. Et quand il ne
// plantait pas, il calculait faux : un thème lu avec Albus et Rubeus
// échangés ne dit rien du thème qu'on a tiré.
// Les bits ci-dessous sont ceux de MAP_GEO, la table que tout le reste
// du fichier utilise. Les poids (strength, attack, goals...) sont ceux
// du noyau V1 et n'ont pas bougé : ils sont attachés au NOM, pas aux bits.
const FIGURES = {
  "Via":{bits:[1,1,1,1],strength:0,attack:1,defense:-1,stability:-2,goals:2,chaos:2,btts:2,draw:1,first:1},
  "Populus":{bits:[2,2,2,2],strength:0,attack:-1,defense:1,stability:2,goals:-2,chaos:-1,btts:0,draw:3,first:-1},
  "Fortuna Major":{bits:[2,2,1,1],strength:3,attack:2,defense:2,stability:3,goals:1,chaos:-1,btts:-1,draw:-2,first:1},
  "Fortuna Minor":{bits:[1,1,2,2],strength:2,attack:1,defense:0,stability:0,goals:1,chaos:1,btts:2,draw:0,first:1},
  "Conjunctio":{bits:[2,1,1,2],strength:1,attack:1,defense:0,stability:1,goals:1,chaos:0,btts:3,draw:3,first:0},
  "Carcer":{bits:[1,2,2,1],strength:0,attack:-3,defense:3,stability:3,goals:-3,chaos:-2,btts:-2,draw:2,first:-2},
  "Puella":{bits:[1,2,1,1],strength:1,attack:1,defense:1,stability:2,goals:0,chaos:-2,btts:0,draw:0,first:0},
  "Puer":{bits:[1,1,2,1],strength:1,attack:2,defense:-1,stability:-2,goals:2,chaos:3,btts:1,draw:-1,first:2},
  "Albus":{bits:[2,2,1,2],strength:2,attack:0,defense:2,stability:3,goals:-1,chaos:-2,btts:-1,draw:1,first:0},
  "Rubeus":{bits:[2,1,2,2],strength:-1,attack:2,defense:-3,stability:-3,goals:2,chaos:4,btts:2,draw:-1,first:1},
  "Acquisitio":{bits:[2,1,2,1],strength:3,attack:3,defense:0,stability:1,goals:3,chaos:0,btts:1,draw:-2,first:1},
  "Amissio":{bits:[1,2,1,2],strength:-2,attack:-1,defense:-2,stability:-1,goals:0,chaos:1,btts:1,draw:1,first:-1},
  "Laetitia":{bits:[1,2,2,2],strength:2,attack:2,defense:0,stability:1,goals:2,chaos:0,btts:1,draw:-1,first:1},
  "Tristitia":{bits:[2,2,2,1],strength:-1,attack:-3,defense:1,stability:1,goals:-3,chaos:-1,btts:-2,draw:1,first:-2},
  "Caput Draconis":{bits:[2,1,1,1],strength:2,attack:1,defense:1,stability:1,goals:1,chaos:1,btts:0,draw:-1,first:3},
  "Cauda Draconis":{bits:[1,1,1,2],strength:-1,attack:1,defense:-2,stability:-3,goals:1,chaos:3,btts:2,draw:-1,first:0}
};
function norm(name){ const c=String(name||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); return Object.keys(FIGURES).find(k=>k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')===c)||null; }
function val(fig,key){ const n=norm(fig); return n ? (FIGURES[n][key]||0) : 0; }
function figFromBits(bits){ return Object.keys(FIGURES).find(k=>FIGURES[k].bits.join('')===bits.join(''))||null; }
function combine(a,b){ a=FIGURES[norm(a)].bits; b=FIGURES[norm(b)].bits; return figFromBits(a.map((x,i)=>x===b[i]?2:1)); }
function buildTheme(mothers){
  const m=mothers.map(norm); if(m.some(x=>!x)) throw new Error('Figure invalide');
  const mb=m.map(x=>FIGURES[x].bits);
  const daughters=[0,1,2,3].map(r=>figFromBits([mb[0][r],mb[1][r],mb[2][r],mb[3][r]]));
  const nieces=[combine(m[0],m[1]),combine(m[2],m[3]),combine(daughters[0],daughters[1]),combine(daughters[2],daughters[3])];
  const rightWitness=combine(nieces[0],nieces[1]);
  const leftWitness=combine(nieces[2],nieces[3]);
  const judge=combine(rightWitness,leftWitness);
  const houses={}; [...m,...daughters,...nieces].forEach((f,i)=>houses[i+1]=f);
  return {mothers:m,daughters,nieces,houses,rightWitness,leftWitness,judge,sentence:combine(judge,m[0])};
}
function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
function analyseFootball(theme,match){
  const h=theme.houses, judge=theme.judge, rw=theme.rightWitness, lw=theme.leftWitness;
  const team1=val(h[1],'strength')*2+val(h[10],'strength')*2+val(rw,'strength')+val(judge,'strength')+val(h[2],'attack')+val(h[5],'attack')+val(h[4],'defense');
  const team2=val(h[7],'strength')*2+val(h[4],'strength')+val(lw,'strength')+val(h[8],'chaos')+val(h[11],'attack')+val(h[12],'chaos');
  const draw=val(judge,'draw')*2+val(h[4],'draw')+val(h[10],'draw')+val(h[7],'draw')+val(h[1],'draw');
  const goals=val(h[5],'goals')*2+val(h[8],'goals')+val(h[11],'goals')+val(judge,'goals')+val(h[3],'goals');
  const chaos=val(h[8],'chaos')*2+val(h[12],'chaos')+val(judge,'chaos')+val(h[6],'chaos');
  const btts=val(h[7],'strength')+val(h[7],'attack')+val(h[8],'btts')+val(judge,'btts')+val(h[11],'btts')-val(h[4],'defense');
  let winner='draw'; if(team1-team2>=4&&team1-draw>=2) winner='team1'; else if(team2-team1>=4&&team2-draw>=2) winner='team2';
  const over25=goals>=4, bttsYes=btts>=2;
  let s1=1,s2=1; if(winner==='team1'){s1=over25?2:1;s2=bttsYes?1:0;} else if(winner==='team2'){s2=over25?2:1;s1=bttsYes?1:0;} else {s1=bttsYes?1:0;s2=bttsYes?1:0;if(over25){s1=2;s2=2;}}
  if(goals>=7&&winner!=='draw'){ if(winner==='team1')s1++; else s2++; }
  if(goals<=-2){s1=winner==='team1'?1:0;s2=winner==='team2'?1:0;}
  const evidence=[]; if(val(h[1],'strength')>1)evidence.push('M1 donne une base favorable a Equipe 1.'); if(val(h[10],'strength')>1)evidence.push('M10 confirme un accomplissement visible.'); if(val(h[7],'strength')>0||val(h[7],'attack')>0)evidence.push('M7 reste vivante: Equipe 2 peut marquer.'); if(val(h[8],'chaos')>1)evidence.push('M8 active: erreur, crise, penalty ou but encaisse possible.');
  return {prediction:{winner,resultLabel:winner==='team1'?'Victoire Equipe 1':winner==='team2'?'Victoire Equipe 2':'Nul ou match serre',score:String(s1)+'-'+String(s2),confidence:clamp(50+Math.abs(team1-team2)*4+Math.abs(goals)*2-Math.max(0,chaos-5)*3,35,86),markets:{doubleChance:winner==='team1'?'1X':winner==='team2'?'X2':'X',over15:goals>=1,over25,btts:bttsYes,penaltyOrRed:chaos>=7?'eleve':chaos>=4?'moyen':'faible'}},scoring:{team1,team2,draw,goals,chaos,btts},evidence,themeSummary:{judge,rightWitness:rw,leftWitness:lw,houses:h},match:match||{}};
}
function compareWithReality(analysis,reality){
  const p=analysis.prediction, ps=p.score.split('-').map(Number), rs=String(reality.score||'0-0').split('-').map(Number);
  const rw=rs[0]>rs[1]?'team1':rs[1]>rs[0]?'team2':'draw', rb=rs[0]>0&&rs[1]>0, ro15=rs[0]+rs[1]>1.5, ro25=rs[0]+rs[1]>2.5;
  const checks={winner:p.winner===rw,exactScore:ps[0]===rs[0]&&ps[1]===rs[1],over15:p.markets.over15===ro15,over25:p.markets.over25===ro25,btts:p.markets.btts===rb};
  const errors=[]; if(!checks.winner)errors.push('resultat_1x2'); if(!checks.exactScore)errors.push('score_exact'); if(ps[0]+ps[1]>rs[0]+rs[1])errors.push('buts_surestimes'); if(ps[0]+ps[1]<rs[0]+rs[1])errors.push('buts_sous_estimes'); if(!checks.btts)errors.push('btts');
  return {checks,accuracy:Object.values(checks).filter(Boolean).length/Object.keys(checks).length,real:{winner:rw,score:reality.score,btts:rb,over15:ro15,over25:ro25},errors,diagnostics:errors.length?errors.map(e=>'Correction a etudier: '+e):['Lecture globalement coherente.']};
}
function explain(a,t1,t2){ const p=a.prediction; return ['Verdict: '+p.resultLabel.replace('Equipe 1',t1).replace('Equipe 2',t2)+'.','Score symbolique: '+t1+' '+p.score+' '+t2+'.','Confiance: '+p.confidence+'%.','Marches: double chance '+p.markets.doubleChance+', over 1.5 '+(p.markets.over15?'oui':'non')+', BTTS '+(p.markets.btts?'oui':'non')+', risque penalty/rouge '+p.markets.penaltyOrRed+'.','Preuves: '+(a.evidence.join(' ')||'Aucune preuve dominante.')].join('\n'); }
window.GF={FIGURES,buildThemeFromMothers:buildTheme,analyseFootball,compareWithReality,explain,combineFigures:combine};
})();

