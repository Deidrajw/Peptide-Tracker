import assert from 'node:assert/strict';
import fs from 'node:fs';
const today=fs.readFileSync('assets/js/08-nexus.js','utf8');
const settings=fs.readFileSync('assets/js/11-nexus.js','utf8');
const icon=fs.readFileSync('assets/js/10-nexus.js','utf8');
const css=fs.readFileSync('assets/css/nexus-contrast.css','utf8');
assert.ok(today.includes('ROUTES.map(r=>toggleChip('),'Route chip source present');
assert.ok(today.includes('padding:"7px 10px"})).join("")}'),'Administration routes must not insert array separator commas');
assert.ok(settings.includes('data-detail="${key}"'),'Settings use shared action row');
assert.ok(settings.includes('row("privacy","🔒","Privacy & Data")'),'Privacy entry exists');
assert.ok(icon.includes("'privacy':'<path"),'Privacy uses a matching outline SVG icon');
assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'),'Reduced motion honored');
const openVial=fs.readFileSync('assets/js/09-nexus.js','utf8');
const hybrid=fs.readFileSync('assets/css/nexus-hybrid-preview.css','utf8');
assert.ok(!/class="nx-dose-close"[^>]*>✕<\/button>/.test(openVial),
  'Open Vial sheets may not regress to an inconsistent text-glyph close button');
assert.ok((openVial.match(/class="nx-dose-close" aria-label="Close"><svg/g)||[]).length>=2,
  'Opening vial chooser and nasal source selector use the shared outline SVG');
assert.ok(hybrid.includes('PR124 consolidated review-shell repair')&&
  hybrid.includes('PR124 Open Vial details: old inline three-column'),
  'Shared narrow form fixes must remain included in the candidate source');
console.log('PASS: static UI hierarchy and route comma regression');
