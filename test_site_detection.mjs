// Site detection smoke test — verify both hostnames resolve to the right adapter
// without loading the full content script (which has DOM dependencies).
import vm from 'node:vm';
import fs from 'node:fs';

const src = fs.readFileSync('/Users/dev/Documents/開発部/brain-reader/content.js', 'utf8');

// Extract just the SITES block to a standalone module for testing
const m = src.match(/const SITES = (\{[\s\S]*?\n    \});/);
if (!m) { console.error('SITES block not found'); process.exit(1); }
const sitesSrc = m[1];

const cases = [
  { host: 'brain-market.com',     pathname: '/u/ikehaya/a/foo', expectId: 'brain', expectArticle: true },
  { host: 'brain-market.com',     pathname: '/',                expectId: 'brain', expectArticle: false },
  { host: 'brain-market.com',     pathname: '/top',             expectId: 'brain', expectArticle: false },
  { host: 'tips.jp',              pathname: '/u/me/a/contents', expectId: 'tips',  expectArticle: true },
  { host: 'tips.jp',              pathname: '/',                expectId: 'tips',  expectArticle: false },
  { host: 'tips.jp',              pathname: '/u/me',            expectId: 'tips',  expectArticle: false },
  { host: 'note.com',             pathname: '/foo',             expectId: null,    expectArticle: null },
];

let pass = 0, fail = 0;
for (const c of cases) {
  const sandbox = {
    document: { querySelector: () => null },
    location: { hostname: c.host, pathname: c.pathname },
  };
  vm.createContext(sandbox);
  const SITES = vm.runInContext(`(${sitesSrc})`, sandbox);
  let detected = null;
  for (const k of Object.keys(SITES)) {
    if (SITES[k].match(c.host)) { detected = SITES[k]; break; }
  }
  const id = detected ? detected.id : null;
  let isArticle = null;
  if (detected) {
    isArticle = detected.isArticlePage.call({ pathname: c.pathname });
  }
  const ok = id === c.expectId && (c.expectArticle === null || isArticle === c.expectArticle);
  if (ok) { console.log(`  PASS  ${c.host}${c.pathname} → ${id} (article=${isArticle})`); pass++; }
  else { console.log(`  FAIL  ${c.host}${c.pathname} → got ${id}/${isArticle}, want ${c.expectId}/${c.expectArticle}`); fail++; }
}
console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
