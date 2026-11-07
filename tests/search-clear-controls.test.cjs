const assert=require("node:assert/strict");
const fs=require("node:fs");
const picker=fs.readFileSync("assets/js/05-nexus.js","utf8");
const settings=fs.readFileSync("assets/js/12-nexus.js","utf8");
assert.match(picker,/function nexusWireSearchClear\(input, onClear, label, options=\{\}\)/);
assert.match(picker,/width:44px;height:44px;min-width:44px;min-height:44px/);
assert.match(picker,/width="16" height="16"[^>]*stroke-width="1\.6"/);
assert.match(picker,/color:var\(--t4\)/);
assert.match(picker,/top:50%;transform:translateY\(-50%\)/);
assert.match(picker,/clear\.style\.display=show\?"grid":"none"/);
assert.match(picker,/clear\.setAttribute\("aria-label",label\|\|"Clear search"\)/);
assert.match(picker,/clear\.onclick=\(\)=>\{input\.value="";onClear\?\.\(\);refresh\(\);\(input\.isConnected\?input:/);
assert.match(picker,/nexusWireSearchClear\(suppSearch,\(\)=>\{suppDropdownOpen=false;renderSuppSearch\(\);\},"Clear supplement search"\)/);
assert.match(picker,/nexusWireSearchClear\(input,\(\)=>\{dropdownOpen=false;paint\(\);\},"Clear supplement search"\)/);
assert.match(settings,/nexusWireSearchClear\(input,\(\)=>\{/);
assert.match(settings,/state\._supplementSearch="";renderBody\(\);wireSuppLibrarySearch\(\);/);
assert.match(picker,/nexusWireSearchClear\(comboSearch,filterChoices,"Clear combo compound search"\)/);
assert.match(settings,/nexusWireSearchClear\(journalSearch,\(\)=>journalSearch\.oninput\?\.\(\),"Clear activity log search"\)/);
assert.match(settings,/nexusWireSearchClear\(input,\(\)=>\{\s*nexusStashSearchTerm="";renderBody\(\);wireStashSearch\(\);/);
assert.doesNotMatch(picker.slice(picker.indexOf("function nexusWireSearchClear("),picker.indexOf("// ─── Daily check-in modal")),/saveState\(|localStorage\.|nexusCommit|\.delete\(/);
const protocol=fs.readFileSync("assets/js/11-nexus.js","utf8");
const discover=fs.readFileSync("assets/js/08-nexus.js","utf8");
assert.match(protocol,/nexusWireSearchClear\(cs,\(\)=>cs\.oninput\?\.\(\),"Clear protocol compound search"\)/);
assert.match(discover,/id="disc-clear" type="button" aria-label="Clear Discover search"/);
assert.match(discover,/min-width:44px;min-height:44px/);
assert.match(discover,/stroke="currentColor" stroke-width="2"/);
// Selection-aware compound pickers must hide the query-only X after a choice,
 // including the inline display style used by the shared DS2 clear helper.
for (const [path,label] of [
  ["assets/js/07-nexus.js","Clear vial compound search"],
  ["assets/js/10-nexus.js","Clear other-form compound search"],
  ["assets/js/03-nexus.js","Clear blend compound search"]
]) {
  const source=fs.readFileSync(path,"utf8");
  assert.ok(source.includes(label),path+": missing selection-aware clear");
  assert.match(source,/if\(x\)\{x\.hidden=true;x\.style\.display="none";\}/,path+": selected compound leaves clear X visible");
  assert.match(source,/\{isQuery:\(\)=>queryActive\}/,path+": selected value not distinguished from search query");
}
// Browser event order matters: the Blend picker must set queryActive before the
// shared helper's input event listener tests options.isQuery().
const blendSource=fs.readFileSync("assets/js/03-nexus.js","utf8");
assert.ok(blendSource.indexOf('trigger.oninput=()=>{queryActive=true;')>=0 &&
  blendSource.indexOf('trigger.oninput=()=>{queryActive=true;')<
  blendSource.indexOf('nexusWireSearchClear(trigger,()=>{'),
  "Blend picker query state must update before shared clear visibility");
console.log("PASS: accessible query clear source contracts for Supplements, Combo, Stash, Logs, Protocol and Discover and selected-value comboboxes");

// Screenshot regression: native WebKit/Blink type=search X must not be shown
// beside Nexus's own 44px accessible clear control; other search fields retain
// their native affordance until explicitly wired to the shared helper.
const globalCss=fs.readFileSync("assets/css/nexus.css","utf8");
assert.match(globalCss,/\.nx-search-clear-wrap input\[type="search"\]::-webkit-search-cancel-button/);
assert.match(globalCss,/\.nx-search-clear-wrap input\[type="search"\]::-webkit-search-decoration/);
assert.match(globalCss,/-webkit-appearance:\s*none;/);
