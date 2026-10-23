import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const VERSION='v0.9.1-beta';
const root=process.cwd();
const dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
let source=fs.readFileSync('index.html','utf8');
const jsFiles=Array.from({length:12},(_,i)=>'assets/js/'+String(i+1).padStart(2,'0')+'-nexus.js');
const cssFiles=['assets/css/nexus.css','assets/css/nexus-disclosures.css'];
const missing=[...jsFiles,...cssFiles].filter(p=>!fs.existsSync(p));
if(missing.length)throw Error('Missing live source assets: '+missing.join(', '));
const liveZip=path.join(dist,'Nexus_'+VERSION+'_LIVE_GitHub.zip');
const demoHTML=path.join(dist,'Nexus_'+VERSION+'_FULL_DEMO.html');

const isolation=`(function(){
  'use strict';
  // A fresh in-memory storage environment. Neither existing LIVE keys nor user
  // records can be read, imported or overwritten by this standalone demo.
  const records=new Map();
  const mock={
    getItem:key=>records.has(String(key))?records.get(String(key)):null,
    setItem:(key,value)=>{records.set(String(key),String(value));},
    removeItem:key=>records.delete(String(key)),
    clear:()=>records.clear(),
    key:index=>Array.from(records.keys())[index]??null,
    get length(){return records.size;}
  };
  try {
    Object.defineProperty(window,'localStorage',{value:mock,configurable:false});
    Object.defineProperty(window,'sessionStorage',{value:mock,configurable:false});
  } catch(err) {document.documentElement.dataset.demoStorageError='true';throw Error('DEMO storage isolation failed: '+err);}
  window.__NEXUS_FULL_APP_DEMO__=true;
  window.fetch=()=>Promise.reject(new Error('Network disabled in standalone fictional-data DEMO'));
})();`;

let demo=source.replace(/<link rel="stylesheet" href="assets\\/css\\/nexus\\.css">\\s*<link rel="stylesheet" href="assets\\/css\\/nexus-disclosures\\.css">/,()=>{
 const css=cssFiles.map(p=>fs.readFileSync(p,'utf8').replace(/^@import\\s+url\\([^;]+;?/gm,'')).join('\\n');
 return '<style>\\n'+css.replace(/<\\/style/gi,'<\\\\/style')+'\\n</style>';
});
if(demo===source)throw Error('Stylesheet injection failed');
const bootMarker='sinceLastVisitSummary = computeSinceLastVisit();';
demo=demo.replace(/<script src="(assets\\/js\\/\\d\\d-nexus\\.js)"><\\/script>/g,(_original,filename)=>{
  let code=fs.readFileSync(filename,'utf8');
  if(filename.endsWith('12-nexus.js')){
    if(!code.includes(bootMarker))throw Error('Demo boot insertion marker missing');
    code=code.replace(bootMarker,`// Standalone full-app DEMO: fictional fixtures before the first render.
_demoActive=true;
state=buildDemoState("weight_loss");
state.profile.onboardingDone=true;
state.settings.lastSeenChangelog=CURRENT_CHANGELOG_VERSION;
${bootMarker}`);
  }
  return '<script>\\n'+code.replace(/<\\/script/gi,'<\\\\/script')+'\\n<\\/script>';
});
if(/<script src=/.test(demo))throw Error('Demo still loads external scripts');
if(!demo.includes('buildDemoState("weight_loss")'))throw Error('Fictional dataset not injected');
demo=demo.replace('<script>\\n"use strict";','<script>\\n"use strict";');
demo=demo.replace('</head>','<meta name="robots" content="noindex,nofollow"><meta name="nexus-data-mode" content="fictional-isolated">\\n</head>');
demo=demo.replace('<script>\\n"use strict";','<script>\\n"use strict";');
demo=demo.replace('<script>\\n"use strict";', '<script>\\n"use strict";');
const firstScript=demo.indexOf('<script>');
if(firstScript<0)throw Error('No JS in compiled demo');
demo=demo.slice(0,firstScript)+'<script>\\n'+isolation+'\\n<\\/script>\\n'+demo.slice(firstScript);
demo=demo.replace(/(<div id="demo-banner"[^>]*>)[\\s\\S]*?(<\\/div>)/, (_all,start,end)=>
 start+'FULL-APP FICTIONAL DEMO — Offline and completely isolated from LIVE'+end);
fs.writeFileSync(demoHTML,demo,'utf8');
// ZIP must contain precisely the current checked-out LIVE source and its assets,
// not the modified/fictional demo file.
execFileSync('python3',['-c',`import zipfile,sys
with zipfile.ZipFile(sys.argv[1],'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sys.argv[2:]:z.write(p,p)`,liveZip,'index.html',...cssFiles,...jsFiles]);
const manifest={version:VERSION,source:'GitHub checked-out commit',live_assets:['index.html',...cssFiles,...jsFiles],demo_file:path.basename(demoHTML),data_mode:'fictional-memory-only',real_data_sync:false};
fs.writeFileSync(path.join(dist,'Nexus_'+VERSION+'_BUILD_MANIFEST.json'),JSON.stringify(manifest,null,2));
console.log('LIVE ZIP',liveZip,fs.statSync(liveZip).size);
console.log('FULL DEMO',demoHTML,fs.statSync(demoHTML).size);
