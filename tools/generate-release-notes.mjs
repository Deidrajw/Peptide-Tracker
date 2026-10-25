import fs from 'node:fs';
import path from 'node:path';
const manifestPath='release/release.json';
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const required=['version','channel','headline','changes','dataImpact','publication'];
for(const field of required) if(!(field in manifest)) throw Error('Missing '+field);
if(!/^v\d+\.\d+\.\d+(?:-[a-z][a-z0-9.-]*)?$/.test(manifest.version)) throw Error('Invalid release version');
if(!Array.isArray(manifest.changes)||!manifest.changes.length) throw Error('Release notes require changes');
if(manifest.publication.status==='published' && (!manifest.publication.commit||!manifest.publication.publishedAt)) throw Error('Published release requires verified commit/date');
const lines=manifest.changes.map(c=>'- '+c.title+': '+c.detail);
const heading=manifest.headline;
const apple=heading+'\n'+lines.join('\n');
const google=heading+'\n'+lines.join('\n');
const inApp={version:manifest.version,channel:manifest.channel,publicationStatus:manifest.publication.status,title:heading,changes:manifest.changes,dataImpact:manifest.dataImpact,limitations:manifest.limitations||[]};
const outputs={
  'release/generated/in-app.json':JSON.stringify(inApp,null,2)+'\n',
  'release/generated/apple-whats-new.txt':apple+'\n',
  'release/generated/google-play-release-notes.txt':google+'\n'
};
const check=process.argv.includes('--check');
for(const [file,content] of Object.entries(outputs)){
 if(check){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==content)throw Error('Stale generated release content: '+file);}
 else{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);}
}
const metaPath='assets/js/02-nexus.js';
const start='// BEGIN GENERATED RELEASE META';
const end='// END GENERATED RELEASE META';
const meta='const NEXUS_RELEASE='+JSON.stringify(inApp)+';';
const block=start+'\n'+meta+'\n'+end;
let src=fs.readFileSync(metaPath,'utf8');
const a=src.indexOf(start),b=src.indexOf(end);
if(check) {
  if(a<0||b<a||src.slice(a,b+end.length)!==block) throw Error('Generated runtime release metadata stale');
} else {
  if(a>=0&&b>a) src=src.slice(0,a)+block+src.slice(b+end.length);
  else src+='\n'+block+'\n';
  fs.writeFileSync(metaPath,src);
}
console.log((check?'Verified':'Generated')+' all three channel outputs for '+manifest.version+' ['+manifest.publication.status+']');
