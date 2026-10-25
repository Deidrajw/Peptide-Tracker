/**
 * Nexus production promotion gate: a GitHub merge is NOT a Cloudflare deployment.
 * Fail if the live page has any different application entry files or version.
 * Runs after push to main or manual dispatch. Read-only. No user/browser storage.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const files = ['index.html', 'assets/css/nexus.css',
  'assets/css/nexus-disclosures.css', 'assets/css/nexus-contrast.css',
  ...Array.from({length:12}, (_,i)=>'assets/js/'+String(i+1).padStart(2,'0')+'-nexus.js')];
const base = process.env.NEXUS_PRODUCTION_URL || 'https://nexuspeplog.pages.dev/';
const version = JSON.parse(readFileSync('release/release.json','utf8')).version;
const intended = process.env.EXPECTED_VERSION?.trim() || version;
const result = {verified:false, productionUrl:base, expectedVersion:intended,
  manifestVersion:version, ref:process.env.GITHUB_SHA || null,
  checkedAt:new Date().toISOString(), fileCount:files.length, files:[], errors:[]};
const hash = b=>createHash('sha256').update(b).digest('hex');
const sleep = ms=>new Promise(r=>setTimeout(r,ms));
if(version !== intended) result.errors.push('EXPECTED_VERSION does not match release/release.json');
const localHtml = readFileSync('index.html','utf8');
if(!localHtml.includes('Nexus · '+intended)) result.errors.push('Source index.html title differs from expected version');
for (let attempt=0; attempt<8; attempt++) {
  const inspected = [];
  let allMatched = true;
  for (const file of files) {
    const local = readFileSync(file);
    let remoteHash = null, status = null, error = null;
    try {
      const url = new URL(file, base);
      url.searchParams.set('nexus_release_verify', process.env.GITHUB_SHA || 'manual');
      const controller = new AbortController();
      const timeout = setTimeout(()=>controller.abort(), 15000);
      let response;
      try { response = await fetch(url,{cache:'no-store',signal:controller.signal,headers:{'Cache-Control':'no-cache'}}); }
      finally { clearTimeout(timeout); }
      status = response.status;
      if(!response.ok) throw new Error('HTTP '+status);
      remoteHash = hash(Buffer.from(await response.arrayBuffer()));
    } catch(e) { error=String(e); }
    const localHash = hash(local);
    const matched=remoteHash===localHash;
    if(!matched) allMatched=false;
    inspected.push({file,matched,localSha256:localHash,remoteSha256:remoteHash,httpStatus:status,error});
  }
  result.files=inspected;
  result.attempts=attempt+1;
  if(allMatched && result.errors.length===0) { result.verified=true; break; }
  if(attempt<7) await sleep(25000);
}
if(!result.verified) result.errors.push('Deployment mismatch: production does not match intended main source exactly');
mkdirSync('release/verification',{recursive:true});
writeFileSync('release/verification/cloudflare-production-parity.json', JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({verified:result.verified,version:result.expectedVersion,filesMatched:result.files.filter(f=>f.matched).length,total:files.length,errors:result.errors},null,2));
if(!result.verified) process.exitCode=1;
