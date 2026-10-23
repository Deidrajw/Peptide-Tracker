import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const VERSION = 'v0.9.2-beta';
const DIST = 'dist';
const JS = Array.from({length: 12}, (_, i) => 'assets/js/' + String(i + 1).padStart(2, '0') + '-nexus.js');
const CSS = ['assets/css/nexus.css', 'assets/css/nexus-disclosures.css'];
const LIVE_FILES = ['index.html', ...CSS, ...JS];
const missing = LIVE_FILES.filter(file => !fs.existsSync(file));
if (missing.length) throw Error('Missing release files: ' + missing.join(', '));
fs.mkdirSync(DIST, {recursive: true});

const html = fs.readFileSync('index.html', 'utf8');
const styles = CSS.map(file => fs.readFileSync(file, 'utf8')
  .split('\n').filter(line => !line.trimStart().startsWith('@import')).join('\n')).join('\n');
let demo = html;
for (const file of CSS) {
  const tag = '<link rel="stylesheet" href="' + file + '">';
  if (!demo.includes(tag)) throw Error('Missing CSS tag: ' + file);
  demo = demo.replace(tag, file === CSS[0] ? '<style>\n' + styles + '\n</style>' : '');
}
const boot = 'sinceLastVisitSummary = computeSinceLastVisit();';
for (const file of JS) {
  const tag = '<script src="' + file + '"></script>';
  if (!demo.includes(tag)) throw Error('Missing script tag: ' + file);
  let code = fs.readFileSync(file, 'utf8');
  if (file === JS[JS.length - 1]) {
    if (!code.includes(boot)) throw Error('DEMO bootstrap location not found');
    code = code.replace(boot, [
      '// FULL-APP DEMO: never use real saved data; insert fictional fixtures before render.',
      '_demoActive = true;',
      'state = buildDemoState("weight_loss");',
      'state.profile.onboardingDone = true;',
      'state.settings.lastSeenChangelog = CURRENT_CHANGELOG_VERSION;',
      boot
    ].join('\n'));
  }
  // An inline closing script tag must not terminate the encompassing script block.
  code = code.replace(/<\/script/gi, '<\\/script');
  demo = demo.replace(tag, '<script>\n' + code + '\n</script>');
}
if (demo.includes('<script src=') || demo.includes('href="assets/css/'))
  throw Error('Standalone demo still references relative script/style assets');

const storageBootstrap = String.raw`(function(){
  'use strict';
  const records = new Map();
  const memory = {
    getItem: key => records.has(String(key)) ? records.get(String(key)) : null,
    setItem: (key, value) => records.set(String(key), String(value)),
    removeItem: key => records.delete(String(key)),
    clear: () => records.clear(),
    key: index => Array.from(records.keys())[index] ?? null,
    get length(){ return records.size; }
  };
  // Fail closed if the browser refuses isolation; never fall back to LIVE storage.
  Object.defineProperty(window, 'localStorage', {value: memory, configurable: false});
  Object.defineProperty(window, 'sessionStorage', {value: memory, configurable: false});
  if (window.localStorage !== memory || window.sessionStorage !== memory)
    throw Error('Standalone DEMO storage isolation failed');
  window.__NEXUS_FULL_APP_DEMO__ = true;
  window.fetch = () => Promise.reject(new Error('Network disabled in fictional full-app demo'));
  window.XMLHttpRequest = function(){ throw Error('Network disabled in fictional full-app demo'); };
  if (navigator.sendBeacon) navigator.sendBeacon = () => false;
})();`;
const firstScript = demo.indexOf('<script>');
if (firstScript < 0) throw Error('Could not locate DEMO script injection point');
demo = demo.slice(0, firstScript) + '<script>\n' + storageBootstrap + '\n</script>\n' + demo.slice(firstScript);
demo = demo.replace('</head>', '<meta name="robots" content="noindex,nofollow">\n<meta name="nexus-data-mode" content="fictional-isolated">\n</head>');
// Keep the fictional-data marker visible in the main app, without obscuring modals.
// The standalone file must not expose Change/Exit buttons that can leave demo state.
const bannerStart=demo.indexOf('<div id="demo-banner"');
const bannerEnd=demo.indexOf('</div>',bannerStart);
if(bannerStart<0||bannerEnd<0)throw Error('Expected demo banner missing');
const safeBanner='<div id="demo-banner" style="display:block;position:fixed;top:0;left:0;right:0;z-index:60;background:#F9C87D;color:#000;font:700 11px sans-serif;text-align:center;padding:8px 12px;padding-top:calc(8px + env(safe-area-inset-top));letter-spacing:.4px">FICTIONAL FULL-APP DEMO — No live data</div>';
demo=demo.slice(0,bannerStart)+safeBanner+demo.slice(bannerEnd+6);
demo=demo.replace('</head>','<style>body{padding-top:calc(38px + env(safe-area-inset-top));}</style>\n</head>');
if(demo.includes('onclick="exitDemoMode()"')||demo.includes('onclick="demoPickerModal()"'))throw Error('Standalone DEMO must not expose live-mode controls');
const demoFile = path.join(DIST, 'Nexus_' + VERSION + '_FULL_DEMO.html');
const liveFile = path.join(DIST, 'Nexus_' + VERSION + '_LIVE_GitHub.zip');
fs.writeFileSync(demoFile, demo, 'utf8');
execFileSync('python3', ['-c', [
 'import zipfile,sys',
 "with zipfile.ZipFile(sys.argv[1], 'w', compression=zipfile.ZIP_DEFLATED) as z:",
 ' for name in sys.argv[2:]: z.write(name, name)'
].join('\n'), liveFile, ...LIVE_FILES]);
const manifest = {
 version: VERSION,
 source_commit: process.env.GITHUB_SHA || 'local-checkout-unverified',
 live_files: LIVE_FILES,
 live_zip: path.basename(liveFile),
 standalone_demo: path.basename(demoFile),
 demo_storage: 'ephemeral in-memory only',
 demo_fixture: 'buildDemoState(weight_loss)',
 demo_sync: 'disabled',
 physical_iPhone_tested: false
};
fs.writeFileSync(path.join(DIST, 'Nexus_' + VERSION + '_BUILD_MANIFEST.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({demoFile, liveFile, manifest}, null, 2));
