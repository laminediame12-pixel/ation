// Intègre dans koun.html l'archive des thèmes valides (bouton 📁 à côté du mode mobile).
// Chaque ligne a un bouton « ▶ Système » qui charge le thème, les équipes et la date dans le moteur de la page.
// Idempotent : le bloc entre les marqueurs ARCHIVE est remplacé à chaque passage. Usage : node outils/archive_koun.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..'), P = path.join(R, 'koun.html');
const LOTS = [['24 au 30 novembre', 'validation/themes-25-30-novembre.json'], ['20 au 25 novembre', 'validation/themes-20-25-novembre.json']];
const data = LOTS.map(([nom, f]) => ({ lot: nom, m: JSON.parse(fs.readFileSync(path.join(R, f), 'utf8')).map(x => [x.date, x.championnat, x.equipe1, x.equipe2, x.theme]).sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1])) }));
let s = fs.readFileSync(P, 'utf8');
const A = '<!--ARCHIVE-->', B = '<!--/ARCHIVE-->';
s = s.replace(new RegExp(A + '[\\s\\S]*?' + B, 'g'), '');
const btn = '<button type="button" id="fabArc" aria-label="Archive des thèmes" title="Archive des thèmes">📁</button>';
if (s.indexOf('id="fabArc"') < 0) s = s.replace('title="Mode mobile">📱</button>', 'title="Mode mobile">📱</button>' + btn);
const css = '<style>#ovArc .sh{width:min(720px,100%);max-height:88vh;display:flex;flex-direction:column}#ovArc .af{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}#ovArc .af select,#ovArc .af input{flex:1 1 140px;min-width:0;padding:6px;border:1px solid var(--ln);border-radius:6px;background:var(--card);color:var(--tx);font:inherit}'
  + '#arcL{overflow-y:auto;flex:1;border-top:1px solid var(--ln);margin-top:4px}#arcL h3{font-size:13px;margin:10px 0 4px;color:var(--mu)}.arw{display:flex;align-items:center;gap:8px;padding:6px 2px;border-bottom:1px solid var(--ln)}.arw .ac{font-size:10.5px;color:var(--mu);text-transform:uppercase;letter-spacing:.03em;width:96px;flex:none}'
  + '.arw .am{flex:1;min-width:0;font-weight:600;overflow:hidden;text-overflow:ellipsis}.arw .at{font-family:ui-monospace,monospace;font-size:12.5px;flex:none}.arw button{flex:none;padding:4px 9px;border:1px solid var(--ac);border-radius:6px;background:none;color:var(--tx);font:inherit;font-size:12.5px;cursor:pointer}.arw.on{background:rgba(34,197,94,.12)}#arcN{font-size:12px;color:var(--mu)}'
  + '@media(max-width:520px){.arw{flex-wrap:wrap}.arw .ac{width:auto}.arw .am{flex-basis:100%;order:3}}</style>';
const html = '<div class="ov" id="ovArc" hidden><div class="sh" role="dialog" aria-label="Archive des thèmes"><h2>Archive des thèmes valides</h2><div class="af"><select id="arcLot"></select><select id="arcD"></select><select id="arcC"></select><input id="arcQ" type="search" placeholder="Équipe…"></div><div id="arcN"></div><div id="arcL"></div><div class="rw"><button type="button" class="b" id="arcClose">Fermer</button></div></div></div>';
const js = '<script>(function(){var ARC=' + JSON.stringify(data) + ',$=function(i){return document.getElementById(i)},J=["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],act=null;'
  + 'function dl(d){var x=new Date(d+"T12:00:00Z");return J[x.getUTCDay()]+" "+d.slice(8)+"/"+d.slice(5,7)}function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;")}'
  + 'function opts(el,vals,tout,lab){var v=el.value;el.innerHTML="<option value=\\"\\">"+tout+"</option>"+vals.map(function(x){return "<option value=\\""+esc(x)+"\\">"+esc(lab?lab(x):x)+"</option>"}).join("");if(vals.indexOf(v)>=0)el.value=v}'
  + 'function lot(){return ARC[+$("arcLot").value||0]}function filtres(){var m=lot().m;opts($("arcD"),m.map(function(x){return x[0]}).filter(function(x,i,a){return a.indexOf(x)===i}),"Toutes les dates",dl);opts($("arcC"),m.map(function(x){return x[1]}).filter(function(x,i,a){return a.indexOf(x)===i}).sort(),"Tous les championnats");liste()}'
  + 'function liste(){var d=$("arcD").value,c=$("arcC").value,q=$("arcQ").value.trim().toLowerCase(),m=lot().m.filter(function(x){return(!d||x[0]===d)&&(!c||x[1]===c)&&(!q||(x[2]+" "+x[3]).toLowerCase().indexOf(q)>=0)}),h="",cur="";'
  + 'm.forEach(function(x){if(x[0]!==cur){cur=x[0];h+="<h3>"+dl(cur)+"</h3>"}var k=x.join("|");h+="<div class=\\"arw"+(k===act?" on":"")+"\\"><span class=\\"ac\\">"+esc(x[1])+"</span><span class=\\"am\\">"+esc(x[2])+" – "+esc(x[3])+"</span><span class=\\"at\\">"+x[4].split("-").join(" · ")+"</span><button type=\\"button\\" data-k=\\""+esc(k)+"\\">▶ Système</button></div>"});'
  + '$("arcL").innerHTML=h||"<p style=\\"color:var(--mu)\\">Aucun match.</p>";$("arcN").textContent=m.length+" match"+(m.length>1?"s":"")+" · thèmes valides (figure du jour comprise) · R1 = équipe à domicile"}'
  + 'function charger(x){var t=x[4].split("-").map(Number),sels=$("meres").querySelectorAll("select");t.forEach(function(v,i){sels[i].value=v});$("meres").dispatchEvent(new Event("change"));'
  + '$("mE1").value=x[2];$("mE2").value=x[3];$("mE1").dispatchEvent(new Event("input"));$("mDate").value=x[0];$("mDate").dispatchEvent(new Event("change"));'
  + 'act=x.join("|");try{var u=new URL(location.href);u.search="?theme="+x[4]+"&date="+x[0]+"&jour="+new Date(x[0]+"T12:00:00Z").getUTCDay()+"&e1="+encodeURIComponent(x[2])+"&e2="+encodeURIComponent(x[3]);history.replaceState(null,"",u)}catch(e){}$("ovArc").hidden=true;window.scrollTo(0,0)}'
  + '$("arcLot").innerHTML=ARC.map(function(l,i){return "<option value=\\""+i+"\\">Lot du "+l.lot+" ("+l.m.length+")</option>"}).join("");'
  + '$("arcLot").onchange=filtres;$("arcD").onchange=liste;$("arcC").onchange=liste;$("arcQ").oninput=liste;'
  + '$("arcL").onclick=function(e){var b=e.target.closest("button[data-k]");if(!b)return;var k=b.getAttribute("data-k");ARC.some(function(l){return l.m.some(function(x){if(x.join("|")===k){charger(x);return true}})})};'
  + '$("fabArc").onclick=function(){filtres();$("ovArc").hidden=false};$("arcClose").onclick=function(){$("ovArc").hidden=true};$("ovArc").onclick=function(e){if(e.target===this)this.hidden=true};'
  + 'document.addEventListener("keydown",function(e){if(e.key==="Escape")$("ovArc").hidden=true})})();</script>';
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + A + css + html + js + B + s.slice(i);
fs.writeFileSync(P, s);
console.log('archive intégrée :', data.map(l => l.lot + ' (' + l.m.length + ')').join(', '), '·', s.length, 'octets');
