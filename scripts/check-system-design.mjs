import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import GithubSlugger from 'github-slugger';
import yaml from 'js-yaml';
import ts from 'typescript';
import { auditDocumentation } from './check-documentation.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const scope = join(root, 'docs/system-design');
const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : /\.mdx?$/.test(p) ? [p] : [];
  });
const processor = unified().use(remarkParse).use(remarkGfm);
const walk = (node, visit) => {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
};
const plain = (node) => node.value ?? (node.children ?? []).map(plain).join('');
const cache = new Map();
function parse(p) {
  if (cache.has(p)) return cache.get(p);
  const source = readFileSync(p, 'utf8');
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  let meta = {},
    yamlError;
  try {
    if (fm) meta = yaml.load(fm[1]) ?? {};
  } catch (e) {
    yamlError = e.message;
  }
  const body = fm ? source.slice(fm[0].length) : source;
  const tree = processor.parse(body);
  const slugger = new GithubSlugger();
  const anchors = new Set(),
    links = [],
    headings = [],
    codes = [],
    definitions = new Map();
  walk(tree, (n) => {
    if (n.type === 'definition') definitions.set(n.identifier, n.url);
  });
  walk(tree, (n) => {
    if (n.type === 'heading') {
      const title = plain(n)
        .replace(/\s*\{\/\*\s*#([^ ]+)\s*\*\/\}/g, '')
        .replace(/\s*\{#[^}]+\}/g, '')
        .trim();
      const explicit = /\{(?:\/\*\s*)?#([^ }]+)(?:\s*\*\/)?\}/.exec(plain(n));
      anchors.add(explicit ? explicit[1] : slugger.slug(title));
      headings.push({ depth: n.depth, title });
    }
    if (n.type === 'html')
      for (const m of n.value.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)) anchors.add(m[1]);
    if (n.type === 'link' || n.type === 'image')
      links.push({ url: n.url, image: n.type === 'image' });
    if (n.type === 'linkReference' || n.type === 'imageReference')
      links.push({ url: definitions.get(n.identifier), image: n.type === 'imageReference' });
    if (n.type === 'code') codes.push({ lang: n.lang, meta: n.meta, value: n.value });
    if (n.type === 'html')
      for (const m of n.value.matchAll(/\b(href|src)=["']([^"']+)["']/g))
        links.push({ url: m[2], image: m[1] === 'src' });
  });
  const doc = { source, body, meta, anchors, links, headings, codes, yamlError };
  cache.set(p, doc);
  return doc;
}
const scoped = files(scope).sort(),
  errors = [],
  edges = new Map(),
  diagrams = [];
let checkedRedirects = 0;
let relativeLinks = 0,
  fences = 0;
for (const p of scoped) {
  const d = parse(p),
    name = relative(root, p);
  edges.set(p, []);
  const error = (kind, detail) => errors.push({ file: name, kind, detail });
  if (d.yamlError) error('frontmatter', d.yamlError);
  for (const issue of auditDocumentation(d.source)) error('structure', issue);
  if (d.headings.filter((h) => h.depth === 1).length !== 1)
    error('heading', 'Expected exactly one H1');
  let depth = 0;
  for (const h of d.headings) {
    if (h.depth > depth + 1) error('heading', `Skipped heading level: ${h.title}`);
    depth = h.depth;
  }
  for (const c of d.codes) {
    fences++;
    if (!c.lang) error('code', 'Code fence needs a language');
    if (c.lang === 'json')
      try {
        JSON.parse(c.value);
      } catch (e) {
        error('json', e.message);
      }
    if (['yaml', 'yml'].includes(c.lang)) {
      try {
        yaml.load(c.value);
      } catch (e) {
        error('yaml', e.message);
      }
    }
    if (['js', 'javascript', 'ts', 'typescript'].includes(c.lang)) {
      const kind = ['ts', 'typescript'].includes(c.lang) ? ts.ScriptKind.TS : ts.ScriptKind.JS;
      const fragment = ts.createSourceFile(
        'example.ts',
        c.value,
        ts.ScriptTarget.Latest,
        true,
        kind,
      );
      for (const diagnostic of fragment.parseDiagnostics) {
        error('code-syntax', ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '));
      }
    }
    if (c.lang === 'mermaid') {
      diagrams.push({ file: name, index: diagrams.length, source: c.value });
      if (!/\baccTitle\s*:/.test(c.value)) error('mermaid', 'Missing accessible title');
    }
  }
  for (const { url, image } of d.links) {
    if (!url) {
      error('link', 'Empty or undefined link');
      continue;
    }
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) continue;
    relativeLinks++;
    let [path, fragment] = url.split('#');
    path = decodeURIComponent(path.split('?')[0]);
    fragment = fragment ? decodeURIComponent(fragment) : undefined;
    let target = path ? resolve(dirname(p), path) : p;
    if (path.startsWith('/')) {
      if (image) target = join(root, 'static', path);
      else {
        error('link', `Use source-relative document link: ${url}`);
        continue;
      }
    }
    if (!existsSync(target)) {
      error('link', `Missing target: ${url}`);
      continue;
    }
    const exactParent = readdirSync(dirname(target));
    if (!exactParent.includes(target.slice(target.lastIndexOf('/') + 1)))
      error('link-case', `Filename case mismatch: ${url}`);
    if (statSync(target).isDirectory()) {
      error('link', `Link names a directory: ${url}`);
      continue;
    }
    if (/\.mdx?$/.test(target)) {
      if (target.startsWith(scope + '/')) edges.get(p).push(target);
      if (fragment && !parse(target).anchors.has(fragment))
        error('anchor', `Unknown anchor: ${url}`);
    }
  }
}
const reached = new Set(),
  queue = [join(scope, 'README.md')];
while (queue.length) {
  const p = queue.pop();
  if (reached.has(p)) continue;
  reached.add(p);
  queue.push(...(edges.get(p) ?? []));
}
for (const p of scoped)
  if (!reached.has(p))
    errors.push({
      file: relative(root, p),
      kind: 'orphan',
      detail: 'Not reachable from course README',
    });
// Every legacy route must resolve directly to an existing canonical page/anchor.
const routes = new Map();
for (const p of files(join(root, 'docs'))) {
  const route =
    parse(p).meta.slug ??
    '/' +
      relative(join(root, 'docs'), p)
        .replace(/\.mdx?$/, '')
        .replace(/\/(?:README|index)$/, '');
  if (routes.has(route))
    errors.push({
      file: relative(root, p),
      kind: 'route',
      detail: `Duplicate canonical route: ${route}`,
    });
  routes.set(route, p);
}
const redirectsFile = join(root, 'scripts/system-design-redirects.json');
if (existsSync(redirectsFile)) {
  const redirects = JSON.parse(readFileSync(redirectsFile, 'utf8'));
  for (const [from, entry] of Object.entries(redirects)) {
    checkedRedirects++;
    if (routes.has(from))
      errors.push({ file: from, kind: 'redirect', detail: 'Redirect shadows a canonical route' });
    for (const to of [entry.to, ...Object.values(entry.hashTargets)]) {
      const [route, hash] = to.split('#');
      const p = routes.get(route);
      if (!p || (hash && !parse(p).anchors.has(hash)))
        errors.push({ file: from, kind: 'redirect', detail: `Invalid direct destination: ${to}` });
    }
  }
}
const report = {
  pages: scoped.length,
  checkedRedirects,
  relativeLinks,
  codeBlocks: fences,
  mermaidDiagrams: diagrams.length,
  reachablePages: reached.size,
  issues: errors.length,
  errors,
};
const out = process.env.SYSTEM_DESIGN_REPORT;
if (out) {
  writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
  writeFileSync(out.replace(/\.json$/, '.mermaid.json'), JSON.stringify(diagrams, null, 2) + '\n');
}
console.log(JSON.stringify({ ...report, errors: errors.slice(0, 30) }, null, 2));
process.exitCode = errors.length ? 1 : 0;
