/**
 * Release-notes completeness gate. No network, user data or production writes.
 *
 * --candidate: draft PR mode — validates notes and reports missing release preparation,
 *              but does not fail an intentionally unpublished design branch.
 * --production: strict mode — blocks changed user-facing application source if
 *               release/release.json has no meaningfully updated notes.
 * --self-test: deterministic simulated change-set tests.
 */
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const manifestPath='release/release.json';
const changedSource=path=>path==='index.html' ||
  /^assets\/(?:js\/\d\d-nexus\.js|css\/.*\.css|icons\/)/.test(path);
const noteFingerprint=m=>JSON.stringify({
  version:m.version,headline:m.headline,changes:m.changes,dataImpact:m.dataImpact,
  limitations:m.limitations,privacyChanged:m.privacyChanged,permissionsChanged:m.permissionsChanged
});
const validText=s=>typeof s==='string' && s.trim().length>=10;

/**
 * The sole same-version production exception is an independently verified
 * unverified -> published metadata transition. Never apply to ordinary app code.
 * The signed-in release operator must also inspect the referenced immutable
 * GitHub Actions artifact before approving merge.
 */
function withoutGeneratedMeta(source){
  const start='// BEGIN GENERATED RELEASE META';
  const end='// END GENERATED RELEASE META';
  const a=source.indexOf(start),b=source.indexOf(end);
  if(a<0||b<=a)throw Error('Release marker missing');
  return source.slice(0,a)+'[verified generated release metadata]'+source.slice(b+end.length);
}
function publicationOnlyEligible(manifest,previous,changed,base){
  if(!previous || previous.publication?.status!=='unverified' ||
     manifest.publication?.status!=='published')return false;
  if(manifest.version!==previous.version ||
     noteFingerprint(manifest)!==noteFingerprint(previous))return false;
  const {commit,publishedAt,webUrl}=manifest.publication;
  if(!/^[a-f0-9]{40}$/.test(commit||'') ||
     Number.isNaN(Date.parse(publishedAt||'')) ||
     webUrl!==previous.publication.webUrl)return false;
  // No new application behaviour, assets, index or CSS can piggyback on a
  // metadata-only publication. Release-generated notes are deterministic.
  const allowed=new Set([
    'release/release.json','release/verification/v0925-verified-deployment.json',
    'release/generated/in-app.json','release/generated/apple-whats-new.txt',
    'release/generated/google-play-release-notes.txt','assets/js/02-nexus.js'
  ]);
  if(!changed.includes('release/release.json') ||
     !changed.includes('assets/js/02-nexus.js') ||
     changed.some(x=>!allowed.has(x)&&!x.startsWith('docs/')))return false;
  if(changed.filter(changedSource).some(x=>x!=='assets/js/02-nexus.js'))return false;
  try{
    const proof=JSON.parse(fs.readFileSync('release/verification/v0925-verified-deployment.json','utf8'));
    const expected=['index.html','assets/css/nexus.css','assets/css/nexus-disclosures.css',
      'assets/css/nexus-contrast.css',...Array.from({length:12},(_,i)=>
        'assets/js/'+String(i+1).padStart(2,'0')+'-nexus.js')];
    if(proof.verified!==true || proof.version!==manifest.version ||
       proof.verifiedSourceCommit!==commit ||
       proof.productionUrl!==manifest.publication.webUrl ||
       !Number.isFinite(proof.sourceWorkflowRun) ||
       !Number.isFinite(proof.workflowArtifactId) ||
       !/^[a-f0-9]{64}$/.test(proof.workflowArtifactMemberSha256||'') ||
       !expected.every(x=>(proof.matchedFiles||[]).includes(x)) ||
       (proof.matchedFiles||[]).length!==16 ||
       Date.parse(publishedAt)<Date.parse(proof.checkedAt))return false;
    // The verified original source commit must be an ancestor, not a fabricated
    // future commit. The only 02-nexus.js changes must be generated release meta.
    git('merge-base','--is-ancestor',commit,'HEAD');
    const before=git('show',base+':assets/js/02-nexus.js');
    const now=fs.readFileSync('assets/js/02-nexus.js','utf8').trimEnd();
    if(withoutGeneratedMeta(before)!==withoutGeneratedMeta(now))return false;
    const history=JSON.parse(fs.readFileSync('release/published-history.json','utf8'));
    if(history.releases?.some(x=>x.version===manifest.version))return false;
    return true;
  }catch{return false;}
}

function validate(manifest,previous,changed,strict,publicationOnlyVerified=false){
  const issues=[],warnings=[];
  if(!/^v\d+\.\d+\.\d+(?:-[a-z][a-z0-9.-]*)?$/.test(manifest.version||''))issues.push('Invalid semantic release version');
  if(!validText(manifest.headline) || !Array.isArray(manifest.changes) || manifest.changes.length===0 ||
     !validText(manifest.dataImpact))issues.push('Release headline, changes and data impact are required');
  for(const [i,c] of (manifest.changes||[]).entries()){
    if(!validText(c.title)||!validText(c.detail)||!c.screen||!c.kind)
      issues.push('Release change '+(i+1)+' needs title, detail, screen and kind');
  }
  const seen=new Set();
  for(const c of manifest.changes||[]){
    if(!c.key || seen.has(c.key))issues.push('Release change keys must be unique/nonempty');
    seen.add(c.key);
  }
  if(manifest.publication?.status==='published' &&
     (!manifest.publication.commit||!manifest.publication.publishedAt))
    issues.push('Published status requires verified commit and date');
  const appChanges=changed.filter(changedSource);
  if(appChanges.length && previous){
    const sameNotes=noteFingerprint(manifest)===noteFingerprint(previous);
    const sameVersion=manifest.version===previous.version;
    if((sameNotes || sameVersion) && !publicationOnlyVerified){
      const message='App source changed ('+appChanges.length+' files), but '+
        (sameNotes?'release notes are unchanged':'release version was not advanced')+
        '. Update canonical version, headline, changes and data impact before release.';
      (strict?issues:warnings).push(message);
    }
  }
  return {issues,warnings,appChanges};
}
function git(...args){return execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();}
function refBase(){
  const supplied=process.env.NEXUS_RELEASE_BASE;
  if(supplied)return supplied;
  const branch=process.env.GITHUB_REF_NAME||'';
  if(branch==='main')return 'HEAD^';
  try{return git('merge-base','HEAD','origin/main');}catch{return 'HEAD^';}
}
function run(){
  const mode=process.argv.includes('--production')?'production':'candidate';
  const strict=mode==='production';
  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  let previous=null,changed=[];
  try{
    const base=refBase();
    changed=git('diff','--name-only',base,'HEAD').split('\n').filter(Boolean);
    previous=JSON.parse(git('show',base+':'+manifestPath));
  }catch(error){
    // Fail closed in production: a missing Git base cannot certify completeness.
    if(strict)throw Error('Cannot compare release against previous source: '+error.message);
    console.warn('RELEASE READINESS UNVERIFIED: Git comparison unavailable in candidate mode');
  }
  const publicationOnlyVerified=publicationOnlyEligible(manifest,previous,changed,refBase());
  const result=validate(manifest,previous,changed,strict,publicationOnlyVerified);
  for(const msg of result.warnings)console.warn('RELEASE PREPARATION REQUIRED: '+msg);
  for(const msg of result.issues)console.error('RELEASE READINESS FAIL: '+msg);
  if(result.issues.length)process.exitCode=1;
  else console.log('Release readiness '+mode.toUpperCase()+' validation PASS'+
    (result.warnings.length?' (publication preparation remains incomplete)':''));
}
function test(){
  const m={version:'v2.0.0',headline:'A new interface improvement',changes:[
    {key:'a',title:'Improved daily tracking',detail:'The revised layout is now easier to use',screen:'Today',kind:'improvement'}],
    dataImpact:'No existing user records are changed.',publication:{status:'unverified'}};
  const prev={...m,version:'v1.9.0',headline:'An earlier experience update'};
  const sameVersionPending={...m,publication:{status:'unverified',publishedAt:null,commit:null}};
  const sameVersionPublished={...m,publication:{status:'published',publishedAt:'2026-11-06T00:00:00Z',commit:'a'.repeat(40)}};
  const checks=[
    [validate(sameVersionPublished,sameVersionPending,['release/release.json','assets/js/02-nexus.js'],true,true).issues.length===0,'verified publication-only exception'],
    [validate(sameVersionPublished,sameVersionPending,['release/release.json','assets/js/02-nexus.js'],true,false).issues.length>0,'unverified publication blocked'],
    [validate(sameVersionPublished,sameVersionPending,['assets/js/05-nexus.js'],true,false).issues.length>0,'normal app source still blocked'],
    [validate(m,prev,['assets/js/12-nexus.js'],true).issues.length===0,'valid release change'],
    [validate(prev,prev,['assets/js/12-nexus.js'],true).issues.length>0,'stale notes blocked'],
    [validate(prev,prev,['assets/css/nexus.css'],false).warnings.length>0,'draft warning'],
    [validate(prev,prev,['docs/continuity/PROJECT_STATE.md'],true).issues.length===0,'docs-only accepted'],
    [validate({...m,changes:[{key:'a',title:'Short'}]},prev,['index.html'],true).issues.length>0,'incomplete item blocked'],
    [validate({...m,publication:{status:'published'}},prev,[],true).issues.length>0,'false published status blocked']
  ];
  for(const [passed,label] of checks)if(!passed)throw Error('FAIL '+label);
  // A release-publication draft must prove the real checked-in Git change is
  // metadata-only, not merely pass a synthetic boolean fixture.
  const current=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  if(current.publication?.status==='published'){
    const base=refBase();
    try{
      const earlier=JSON.parse(git('show',base+':'+manifestPath));
      const changed=git('diff','--name-only',base,'HEAD').split('\n').filter(Boolean);
      if(earlier.publication?.status==='unverified' &&
         changed.includes('assets/js/02-nexus.js') &&
         !publicationOnlyEligible(current,earlier,changed,base))
        throw Error('Published metadata draft failed real provenance/JS-only integrity gate');
    }catch(error){
      throw Error('Publication-only self-test failed: '+error.message);
    }
  }
  console.log('Release readiness tests PASS '+checks.length+'/'+checks.length);
}
if(process.argv.includes('--self-test'))test();else run();
