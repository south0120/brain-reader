// v3 migration unit test — articles → articlesBySite.brain
//
// Runs the v3 migration logic against a synthetic learningDays fixture
// covering pre-v3 (articles only), already-migrated (articlesBySite
// present), and edge-case shapes. Asserts:
//   - new articlesBySite.brain mirrors the original articles map
//   - existing articlesBySite is preserved (not overwritten)
//   - non-object day entries are left alone
//   - the migration marker is set
//   - re-running is a no-op
//
// Run from repo root:  node test_migration_v3.mjs

const META_KEY = 'reader_meta';
const MIGRATION_V3_MARKER = 'reader_migration_v3_done';

// In-memory localStorage polyfill (same shape used by content.js).
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

const FIXTURE = {
  // Pre-v3 day: only `articles`, no `articlesBySite`. Should migrate.
  '2026-04-01': {
    sections: 8, scrollPx: 12000,
    articles: { '/u/ikehaya/a/foo': 5, '/u/yuki_99_s/a/bar': 3 },
  },
  // Pre-v3 day with empty articles. Should still migrate (empty bucket).
  '2026-04-02': {
    sections: 0, scrollPx: 0,
    articles: {},
  },
  // Already-migrated day. Must NOT be touched.
  '2026-04-03': {
    sections: 4, scrollPx: 5000,
    articles: { '/x': 4 },
    articlesBySite: { brain: { '/x': 99 } /* intentionally different to detect overwrite */ },
  },
  // Day with no `articles` field at all (older still). Should be left alone.
  '2026-04-04': {
    sections: 2, scrollPx: 1000,
  },
  // Numeric legacy entry (very old format from before v1.2.0). Should
  // be skipped without crashing.
  '2026-03-01': 7,
};

function runMigrationV3(localStorage) {
  if (localStorage.getItem(MIGRATION_V3_MARKER) === '1') return;

  let meta;
  try { meta = JSON.parse(localStorage.getItem(META_KEY) || '{}') || {}; } catch(e) { meta = {}; }
  const days = meta.learningDays || {};
  let touched = false;
  for (const k of Object.keys(days)) {
    const day = days[k];
    if (!day || typeof day !== 'object') continue;
    if (day.articlesBySite) continue;
    if (day.articles && typeof day.articles === 'object') {
      day.articlesBySite = { brain: { ...day.articles } };
      touched = true;
    }
  }
  if (touched) {
    meta.learningDays = days;
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }
  localStorage.setItem(MIGRATION_V3_MARKER, '1');
}

const initial = {
  [META_KEY]: JSON.stringify({ learningDays: FIXTURE }),
};
const ls = makeLocalStorage(initial);

let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`  PASS  ${name}`); pass++; }
  else { console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`); fail++; }
}

console.log('=== v3 migration unit test ===\n');
runMigrationV3(ls);
const after = JSON.parse(ls.getItem(META_KEY));
const days = after.learningDays;

check('marker set', ls.getItem(MIGRATION_V3_MARKER) === '1');

// 2026-04-01: articles map → articlesBySite.brain
check('day with articles got articlesBySite.brain populated',
  days['2026-04-01']?.articlesBySite?.brain?.['/u/ikehaya/a/foo'] === 5 &&
  days['2026-04-01']?.articlesBySite?.brain?.['/u/yuki_99_s/a/bar'] === 3);
check('original articles field preserved on migrated day',
  days['2026-04-01']?.articles?.['/u/ikehaya/a/foo'] === 5);

// 2026-04-02: empty articles still gets empty articlesBySite.brain
check('empty articles also migrates (empty brain bucket)',
  days['2026-04-02']?.articlesBySite?.brain &&
  Object.keys(days['2026-04-02'].articlesBySite.brain).length === 0);

// 2026-04-03: pre-existing articlesBySite must NOT be overwritten
check('already-migrated day preserved (not overwritten)',
  days['2026-04-03']?.articlesBySite?.brain?.['/x'] === 99);

// 2026-04-04: no articles → no articlesBySite added
check('day with no articles gets no articlesBySite',
  !days['2026-04-04']?.articlesBySite);

// 2026-03-01: numeric legacy entry untouched
check('numeric legacy entry untouched',
  days['2026-03-01'] === 7);

// Re-run is a no-op
const before2 = ls._snapshot();
runMigrationV3(ls);
const after2 = ls._snapshot();
check('re-run is no-op',
  JSON.stringify(before2) === JSON.stringify(after2));

console.log(`\n${pass} pass / ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
