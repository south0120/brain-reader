// Migration unit test — exercises the v1.2.0 → v1.3.0 storage migration
// against a synthetic fixture that covers every key shape we expect to find
// in real-world v1.2.0 storage:
//   - new-format article keys: brain_reader_<hash>_<path-suffix>
//   - legacy b64 article keys: brain_reader_<20-char-b64>
//   - special markers:        brain_reader_tutorial_done_v1
//   - cross-article activity: brain_reader_activity_global
//   - per-article affiliate:  br_aff_<path>
//
// To run against a real local v1.2.0 dump (PII — never check in), point
// MIGRATION_FIXTURE at the JSON file:
//   MIGRATION_FIXTURE=/path/to/dump.json node test_migration.mjs
//
// Run from repo root:  node test_migration.mjs

import fs from 'node:fs';

// Synthetic fixture — designed so every assertion can be verified without
// peeking at any real user data.
const SYNTHETIC = {
  // 2 article entries in the new format
  'brain_reader_aaa111_pathSuffixA': JSON.stringify({
    bookmarks: [{ id: 'toc_1_0', text: 'Section 1', position: 100, date: '2026/4/1' }],
    highlights: [],
    readSections: ['toc_1_0', 'toc_2_0'],
    lastPosition: 1234,
    activityLog: { '2026-04-01': { sections: 2, scrollPx: 500 } },
  }),
  'brain_reader_bbb222_pathSuffixB': JSON.stringify({
    bookmarks: [], highlights: [], readSections: [], lastPosition: 0,
  }),
  // 1 legacy-b64 entry (no underscore inside suffix → legacy format)
  'brain_reader_aHR0cHM6Ly9icmFpbi1t': JSON.stringify({
    bookmarks: [], highlights: [], readSections: ['toc_1_0'], lastPosition: 50,
  }),
  // tutorial flag
  'brain_reader_tutorial_done_v1': '1',
  // cross-article activity
  'brain_reader_activity_global': JSON.stringify({
    '2026-04-01': { sections: 5, scrollPx: 1500, articles: { '/foo': 5 } },
    '2026-04-02': { sections: 3, scrollPx: 800,  articles: { '/foo': 3 } },
  }),
  // 2 affiliate URLs
  'br_aff_/u/author1/a/articleX': 'https://brmk.io/abc123',
  'br_aff_/u/author2/a/articleY': 'https://brmk.io/def456',
  // unrelated key — should be left alone
  'unrelated_key': 'untouched',
};

const fixturePath = process.env.MIGRATION_FIXTURE;
const initial = fixturePath
  ? JSON.parse(fs.readFileSync(fixturePath, 'utf8'))
  : SYNTHETIC;

// In-memory localStorage polyfill
function makeLocalStorage(initial) {
  const store = new Map(Object.entries(initial));
  return {
    get length() { return store.size; },
    key(i) { return [...store.keys()][i] ?? null; },
    getItem(k) { return store.has(k) ? store.get(k) : null; },
    setItem(k, v) { store.set(k, String(v)); },
    removeItem(k) { store.delete(k); },
    _snapshot() { return Object.fromEntries(store); },
  };
}

const localStorage = makeLocalStorage(initial);
globalThis.localStorage = localStorage;

// Inline copy of runMigrationV2 from content.js. Update both together.
const META_KEY = 'reader_meta';
const MIGRATION_MARKER = 'reader_migration_v2_done';

function runMigrationV2() {
  if (localStorage.getItem(MIGRATION_MARKER) === '1') return;

  let meta;
  try { meta = JSON.parse(localStorage.getItem(META_KEY) || '{}') || {}; } catch(e) { meta = {}; }
  meta.learningDays = meta.learningDays || {};
  meta.brainAffiliateLinks = meta.brainAffiliateLinks || {};

  const allKeys = [];
  for (let i = 0; i < localStorage.length; i++) allKeys.push(localStorage.key(i));

  const renamed = [];
  for (const k of allKeys) {
    if (!k) continue;
    try {
      if (k === 'brain_reader_tutorial_done_v1') {
        meta.tutorialDoneV1 = localStorage.getItem(k) || '1';
        renamed.push([k, null]); continue;
      }
      if (k === 'brain_reader_activity_global') {
        const val = JSON.parse(localStorage.getItem(k) || '{}') || {};
        Object.keys(val).forEach(dk => {
          const r = val[dk], l = meta.learningDays[dk];
          if (!l) { meta.learningDays[dk] = r; }
          else if (r && (r.sections || 0) > (l.sections || 0)) { meta.learningDays[dk] = r; }
        });
        renamed.push([k, null]); continue;
      }
      if (k.startsWith('br_aff_')) {
        const path = k.slice('br_aff_'.length);
        const v = localStorage.getItem(k);
        if (v && v.includes('brmk.io')) meta.brainAffiliateLinks[path] = v;
        renamed.push([k, null]); continue;
      }
      if (k.startsWith('brain_reader_')) {
        const suffix = k.slice('brain_reader_'.length);
        const isNewFormat = suffix.includes('_');
        const newKey = isNewFormat
          ? 'reader_brain_' + suffix
          : 'reader_brain_legacy_' + suffix;
        const val = localStorage.getItem(k);
        if (val !== null) localStorage.setItem(newKey, val);
        renamed.push([k, newKey]);
        continue;
      }
    } catch(e) {}
  }
  localStorage.setItem(META_KEY, JSON.stringify(meta));
  for (const [oldKey] of renamed) localStorage.removeItem(oldKey);
  localStorage.setItem(MIGRATION_MARKER, '1');
}

// ----- Run -----
const before = localStorage._snapshot();
runMigrationV2();
const after = localStorage._snapshot();
const meta = JSON.parse(after[META_KEY]);

// ----- Assertions -----
let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`  PASS  ${name}`); pass++; }
  else { console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

console.log('=== Migration unit test ===');
console.log(`source: ${fixturePath || '(synthetic fixture)'}`);
console.log(`before: ${Object.keys(before).length} keys`);
console.log(`after:  ${Object.keys(after).length} keys`);
console.log();

check('marker set', after[MIGRATION_MARKER] === '1');
check('reader_meta present', !!after[META_KEY]);
check('learningDays populated', Object.keys(meta.learningDays || {}).length > 0);
check('brainAffiliateLinks populated', Object.keys(meta.brainAffiliateLinks || {}).length > 0);
check('tutorialDoneV1 = "1"', meta.tutorialDoneV1 === '1');

const oldKeysStillThere = Object.keys(after).filter(k =>
  k.startsWith('brain_reader_') || k.startsWith('br_aff_'));
check('all legacy keys removed', oldKeysStillThere.length === 0,
  oldKeysStillThere.length ? `leftover: ${oldKeysStillThere.slice(0,3).join(', ')}` : '');

const oldArticles = Object.keys(before).filter(k =>
  k.startsWith('brain_reader_') &&
  k !== 'brain_reader_tutorial_done_v1' &&
  k !== 'brain_reader_activity_global'
);
const newArticles = Object.keys(after).filter(k => k.startsWith('reader_brain_'));
check('article entries count preserved', oldArticles.length === newArticles.length,
  `before=${oldArticles.length} after=${newArticles.length}`);

const legacyKey = Object.keys(after).find(k => k.startsWith('reader_brain_legacy_'));
check('legacy b64 key has legacy_ prefix', !!legacyKey,
  legacyKey ? `→ ${legacyKey}` : 'not found');

// Idempotency
const before2 = localStorage._snapshot();
runMigrationV2();
const after2 = localStorage._snapshot();
check('re-run is no-op',
  JSON.stringify(before2) === JSON.stringify(after2));

// Unrelated key untouched
check('unrelated keys untouched',
  before['unrelated_key'] === undefined || after['unrelated_key'] === before['unrelated_key']);

console.log();
console.log(`${pass} pass / ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
