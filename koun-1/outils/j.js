const fs=require('fs');const b=fs.readFileSync(process.argv[2]+'/src/app_pre.js','utf8');
const i=b.indexOf('var J=')+6, j=b.indexOf(';var Zu=');
const J=eval('('+b.slice(i,j)+')');globalThis.J=J;
fs.writeFileSync(process.argv[2]+'/src/J.json',JSON.stringify(J,null,1));
console.log(Object.keys(J), J.references.length);
for(const r of J.references){const s=r.snapshot||{};console.log(r.id,'|',r.mothers.join(','),'|',r.codes.join(','),'| exp',r.expected,'| teams',r.teams,'| snapKeys',Object.keys(s).join(','),'| dec',JSON.stringify(s.decision||null).slice(0,200));}
console.log(JSON.stringify(J.technical,null,1));console.log(JSON.stringify(J.gallery,null,1).slice(0,3000));
