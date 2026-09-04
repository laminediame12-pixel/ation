// ═══════════════════════════════════════════════════════════════
// PLANETES HEURES
// Extrait de systeme_geomantique.html le 04/09/26. Script CLASSIQUE :
// l'ordre des <script src> dans la page EST l'ordre d'origine, octet
// pour octet — ne pas réordonner, ne pas ajouter defer/async/type=module.
// ═══════════════════════════════════════════════════════════════

function gfInitRefactorPanel(){var names=Object.keys(GF.FIGURES);['gfM1','gfM2','gfM3','gfM4'].forEach(function(id,idx){var el=document.getElementById(id);if(!el)return;el.innerHTML=names.map(function(n){return '<option value="'+n+'">'+n+'</option>';}).join('');el.value=['Puer','Laetitia','Caput Draconis','Albus'][idx]||names[0];});}
function gfReadPanel(){return {mothers:['gfM1','gfM2','gfM3','gfM4'].map(function(id){return document.getElementById(id).value;}),team1:document.getElementById('gfTeam1').value||'Équipe 1',team2:document.getElementById('gfTeam2').value||'Équipe 2',realScore:document.getElementById('gfRealScore').value.trim()};}
function gfRunRefactorEngine(){var d=gfReadPanel();var th=GF.buildThemeFromMothers(d.mothers);var a=GF.analyseFootball(th,{team1:d.team1,team2:d.team2});window.GF_LAST_ANALYSIS=a;document.getElementById('gfRefactorOutput').value=GF.explain(a,d.team1,d.team2)+'\n\nTheme:\n'+JSON.stringify(a.themeSummary,null,2)+'\n\nScoring:\n'+JSON.stringify(a.scoring,null,2);}
function gfRunBacktestV1(){var d=gfReadPanel();if(!window.GF_LAST_ANALYSIS)gfRunRefactorEngine();if(!/^\d+\s*-\s*\d+$/.test(d.realScore)){document.getElementById('gfRefactorOutput').value+='\n\nScore réel invalide. Format attendu: 2-1';return;}var c=GF.compareWithReality(window.GF_LAST_ANALYSIS,{score:d.realScore.replace(/\s+/g,'')});document.getElementById('gfRefactorOutput').value+='\n\nBacktesting V1:\n'+JSON.stringify(c,null,2);}
document.addEventListener('DOMContentLoaded',gfInitRefactorPanel);

