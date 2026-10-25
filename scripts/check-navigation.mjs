import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const generated = path.join(root, '.docusaurus/docusaurus-plugin-content-docs/default');
if (!fs.existsSync(generated))
  throw new Error('Run yarn build before checking compiled navigation.');
const json = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const files = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? files(p) : [p];
  });
const docs = files(generated)
  .filter((p) => p.endsWith('.json'))
  .map(json)
  .filter((d) => d.id && d.source?.startsWith('@site/docs/'));
const manifests = files(path.join(generated, 'p'))
  .filter((p) => p.endsWith('.json'))
  .map(json);
const sidebar = manifests.find((m) => m.version?.docsSidebars)?.version.docsSidebars;
if (!sidebar) throw new Error('Compiled sidebar metadata is missing.');
const normalize = (url) => decodeURI(url).replace(/\/$/, '') || '/';
const byRoute = new Map();
const bySource = new Map();
const categoryPages = manifests.flatMap((manifest) =>
  manifest.categoryGeneratedIndex ? [manifest.categoryGeneratedIndex] : [],
);
const categoryRoutes = new Set(categoryPages.map((page) => normalize(page.permalink)));
const errors = [];
if (categoryRoutes.size !== categoryPages.length)
  errors.push('Duplicate generated category route.');
for (const doc of docs) {
  const route = normalize(doc.permalink);
  if (byRoute.has(route)) errors.push(`Duplicate canonical route: ${route}`);
  if (bySource.has(doc.source)) errors.push(`Duplicate document source: ${doc.source}`);
  byRoute.set(route, doc);
  bySource.set(doc.source, doc);
  if (categoryRoutes.has(route)) errors.push(`Category shadows document route: ${route}`);
  if (doc.draft || doc.unlisted) errors.push(`Hidden document: ${doc.source}`);
}
const occurrences = new Map();
const categoryOccurrences = new Map();
let systemCategories = 0;
const courseOrder = [];
function visit(items, inCourse = false) {
  for (const item of items) {
    const doc = item.docId
      ? docs.find((d) => d.id === item.docId)
      : byRoute.get(normalize(item.href ?? ''));
    const course = inCourse || item.label === 'System Design';
    if (item.type === 'category' && item.label === 'System Design') systemCategories++;
    if (doc) {
      occurrences.set(doc.id, (occurrences.get(doc.id) ?? 0) + 1);
      if (course) courseOrder.push(doc.source.replace('@site/docs/system-design/', ''));
    }
    if (item.type === 'category' && categoryRoutes.has(normalize(item.href ?? ''))) {
      const route = normalize(item.href);
      categoryOccurrences.set(route, (categoryOccurrences.get(route) ?? 0) + 1);
    }
    if (item.unlisted || item.className?.split(/\s+/).includes('hidden'))
      errors.push(`Hidden sidebar item: ${item.label}`);
    if (item.items) visit(item.items, course);
  }
}
for (const items of Object.values(sidebar)) visit(items);
for (const category of categoryPages) {
  const route = normalize(category.permalink);
  if (categoryOccurrences.get(route) !== 1)
    errors.push(`Category sidebar occurrences ${categoryOccurrences.get(route) ?? 0}: ${route}`);
  for (const direction of ['previous', 'next']) {
    const link = category[direction];
    if (
      link &&
      !byRoute.has(normalize(link.permalink)) &&
      !categoryRoutes.has(normalize(link.permalink))
    )
      errors.push(`Invalid category ${direction}: ${route}`);
  }
}
const sources = files(path.join(root, 'docs')).filter((p) => /\.mdx?$/.test(p));
for (const p of sources) {
  const source = '@site/' + path.relative(root, p);
  if (!bySource.has(source)) errors.push(`Source was not published: ${source}`);
}
for (const doc of docs) {
  if (occurrences.get(doc.id) !== 1)
    errors.push(`Sidebar occurrences ${occurrences.get(doc.id) ?? 0}: ${doc.id}`);
  for (const direction of ['previous', 'next']) {
    const link = doc[direction];
    if (
      link &&
      !byRoute.has(normalize(link.permalink)) &&
      !categoryRoutes.has(normalize(link.permalink))
    )
      errors.push(`Invalid ${direction}: ${doc.id}`);
  }
}
const catalog = json(path.join(root, 'data/system-design-course.json'));
const expected = ['README.md', ...catalog.flatMap((g) => g.items.map((item) => item.file))];
if (systemCategories !== 1) errors.push(`System Design categories: ${systemCategories}`);
if (JSON.stringify(courseOrder) !== JSON.stringify(expected))
  errors.push('Sidebar order differs from the single course catalog.');
const home = fs.readFileSync(path.join(root, 'docs/system-design/README.md'), 'utf8');
for (const file of expected.slice(1))
  if (!home.includes(`](${file})`)) errors.push(`Homepage omits: ${file}`);
for (let i = 0; i < expected.length; i++) {
  const doc = bySource.get('@site/docs/system-design/' + expected[i]);
  if (!doc) continue;
  for (const [direction, neighbor] of [
    ['previous', expected[i - 1]],
    ['next', expected[i + 1]],
  ]) {
    const wanted = neighbor
      ? bySource.get('@site/docs/system-design/' + neighbor)?.permalink
      : undefined;
    if (doc[direction]?.permalink !== wanted)
      errors.push(`Course ${direction} mismatch: ${doc.id}`);
  }
}
const redirects = json(path.join(root, 'scripts/system-design-redirects.json'));
for (const [from, entry] of Object.entries(redirects)) {
  if (byRoute.has(normalize('/docs' + from))) errors.push(`Redirect shadows page: ${from}`);
  for (const target of [entry.to, ...Object.values(entry.hashTargets)]) {
    const route = target.split('#')[0];
    if (!byRoute.has(normalize('/docs' + route)))
      errors.push(`Redirect is not direct: ${from} -> ${target}`);
  }
}
const report = {
  sourcePages: sources.length,
  publishedPages: docs.length,
  sidebarPages: occurrences.size,
  categoryOverviewPages: categoryPages.length,
  systemDesignPages: expected.length,
  systemDesignCategories: systemCategories,
  redirects: Object.keys(redirects).length,
  paginationChecked: docs.length,
  courseOrderChecked: true,
  issues: errors.length,
  errors,
};
if (process.env.NAVIGATION_REPORT)
  fs.writeFileSync(process.env.NAVIGATION_REPORT, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
process.exitCode = errors.length ? 1 : 0;
