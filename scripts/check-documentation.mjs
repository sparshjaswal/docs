import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProcessor } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import fg from 'fast-glob';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const processor = createProcessor({ remarkPlugins: [remarkGfm] });

export function auditDocumentation(source) {
  const problems = [];
  let fence;
  for (const [index, line] of source.split('\n').entries()) {
    const match = /^\s{0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (!match) continue;
    if (!fence) fence = { marker: match[1][0], length: match[1].length, line: index + 1 };
    else if (match[1][0] === fence.marker && match[1].length >= fence.length && !match[2].trim())
      fence = undefined;
  }
  if (fence) problems.push(`Unclosed code fence at line ${fence.line}`);
  const content = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  let tree;
  try {
    tree = processor.parse(content);
  } catch (error) {
    return [...problems, `Invalid MDX: ${error.message}`];
  }
  const imported = new Set();
  const used = new Set();
  const walk = (node) => {
    if (node.type === 'mdxjsEsm') {
      for (const statement of node.data.estree.body) {
        if (statement.type === 'ImportDeclaration') {
          for (const specifier of statement.specifiers) imported.add(specifier.local.name);
        }
      }
    }
    if (/^mdxJsx(?:Flow|Text)Element$/.test(node.type) && /^[A-Z]/.test(node.name ?? '')) {
      used.add(node.name.split('.')[0]);
    }
    if (node.type === 'image') {
      if (!node.alt?.trim()) problems.push(`Image needs descriptive alt text: ${node.url}`);
      if (node.url.startsWith('http:'))
        problems.push(`Image needs HTTPS or a local replacement: ${node.url}`);
    }
    if (
      node.type === 'text' &&
      /\b(?:coming soon|under construction|to be written|TBD|FIXME)\b/i.test(node.value)
    ) {
      problems.push(`Unfinished prose: ${node.value.slice(0, 100)}`);
    }
    for (const child of node.children ?? []) walk(child);
  };
  walk(tree);
  for (const component of used) {
    if (!imported.has(component))
      problems.push(`JSX component ${component} needs an explicit import`);
  }
  return problems;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = fg.sync('docs/**/*.{md,mdx}', { cwd: root }).sort();
  let failures = 0;
  for (const file of files) {
    for (const problem of auditDocumentation(readFileSync(join(root, file), 'utf8'))) {
      console.error(`${file}: ${problem}`);
      failures++;
    }
  }
  console.log(`Documentation: ${files.length} pages checked; ${failures} structural issues.`);
  process.exitCode = failures ? 1 : 0;
}
