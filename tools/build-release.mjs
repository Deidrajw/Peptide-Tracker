import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const VERSION = JSON.parse(fs.readFileSync('release/release.json','utf8')).version;
execFileSync(process.execPath, ['tools/generate-release-notes.mjs', '--check'], {stdio:'inherit'});
const DIST = 'dist';
const JS = Array.from({length: 12}, (_, i) => 'assets/js/' + String(i + 1).padStart(2, '0') + '-nexus.js');
const CSS = ['assets/css/nexus.css', 'assets/css/nexus-disclosures.css', 'assets/css/nexus-contrast.css'];
const ICONS = ['assets/icons/nexus-icon-180.png', 'assets/icons/nexus-icon-192.png', 'assets/icons/nexus-icon-512.png', 'assets/icons/nexus-icon-1024.png'];
const LIVE_FILES = ['index.html', ...CSS, ...JS, ...ICONS];
const missing = LIVE_FILES.filter(file => !fs.existsSync(file));
if (missing.length) throw Error('Missing release files: ' + missing.join(', '));
fs.mkdirSync(DIST, {recursive: true});

const html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('<title>Nexus · '+VERSION+'</title>')) throw Error('Displayed app title version differs from release/release.json');
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

// Fully embed production icon pixels into the standalone full-app demo.
for (const icon of ICONS) {
  if (!demo.includes('"' + icon + '"')) continue;
  demo = demo.replaceAll('"' + icon + '"', '"data:image/png;base64,' + fs.readFileSync(icon).toString('base64') + '"');
}
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
// A standalone 1.8MB HTML file is often displayed as an inert attachment inside
// messaging/document viewers rather than opened in a full JavaScript browser.
// Ship the SAME isolated DEMO as index.html inside an easy-to-extract ZIP too.
// This adds a delivery option, not a separate reconstructed app.
const offlineDemoZip = path.join(DIST, 'Nexus_' + VERSION + '_OFFLINE_FULL_DEMO_OPEN_ME.zip');
const readme = [
  'NEXUS ' + VERSION + ' — COMPLETE FICTIONAL FULL-APP DEMO',
  '',
  '1. Download this ZIP file.',
  '2. Extract it using your device’s normal unzip option.',
  '3. Open index.html in Safari or Chrome.',
  '',
  'The ChatGPT attachment viewer and some Files/Quick Look previews do not',
  'run standalone JavaScript apps. Download and open it in a browser instead.',
  '',
  'No live data, imports, sync or stored user records are used.',
  'The complete application is in one HTML file, using isolated fictional data.',
  'This is a design candidate; it does not replace the published Nexus app.'
].join('\n');
execFileSync('python3', ['-c', [
  'import zipfile,sys',
  "with zipfile.ZipFile(sys.argv[1], 'w', compression=zipfile.ZIP_DEFLATED) as z:",
  " z.write(sys.argv[2], 'index.html')",
  " z.writestr('README_OPEN_FIRST.txt', sys.argv[3])"
].join('\n'), offlineDemoZip, demoFile, readme]);
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
 offline_demo_zip: path.basename(offlineDemoZip),
 demo_storage: 'ephemeral in-memory only',
 demo_fixture: 'buildDemoState(weight_loss)',
 demo_sync: 'disabled',
 physical_iPhone_tested: false
};
fs.writeFileSync(path.join(DIST, 'Nexus_' + VERSION + '_BUILD_MANIFEST.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({demoFile, offlineDemoZip, liveFile, manifest}, null, 2));
