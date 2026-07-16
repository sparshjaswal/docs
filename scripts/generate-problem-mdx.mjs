import fs from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';

const DOCS_ROOT = path.resolve(process.cwd(), 'docs');

function resolveDsaRoot() {
  const envDir = process.env.DSA_DIR && path.join(DOCS_ROOT, process.env.DSA_DIR);
  const candidates = [envDir, path.join(DOCS_ROOT, 'DSA'), path.join(DOCS_ROOT, 'dsa')].filter(
    (p) => Boolean(p)
  );
  for (const dir of candidates) {
    try {
      if (dir && fs.existsSync(dir) && fs.statSync(dir).isDirectory()) return dir;
    } catch {
      // ignore
    }
  }
  return path.join(DOCS_ROOT, 'DSA');
}

const DSA_ROOT = resolveDsaRoot();

function toTitle(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b([a-z])/g, (_, c) => c.toUpperCase());
}

async function main() {
  let jsFiles = await fg('**/*.js', {
    cwd: DSA_ROOT,
    absolute: true,
    dot: false,
  });

  // ✅ ensure consistent order
  jsFiles.sort();

  for (const jsAbs of jsFiles) {
    const dir = path.dirname(jsAbs);
    const base = path.basename(jsAbs, '.js');

    const testAbs = path.join(dir, `${base}.test.ts`);
    if (!fs.existsSync(testAbs)) {
      console.log(`⏭ Skipped (no test): ${base}`);
      continue;
    }

    const mdPath = path.join(dir, `${base}.md`);
    const hasExplanation = fs.existsSync(mdPath);

    const indexMdx = path.join(dir, 'index.mdx');
    if (fs.existsSync(indexMdx)) {
      console.log(`⏭ Exists: ${path.relative(process.cwd(), indexMdx)}`);
      continue;
    }

    // ✅ better title from full path
    const relDir = path.relative(DSA_ROOT, dir);
    const title = toTitle(relDir.split(path.sep).pop());

    const relJs = `./${path.basename(jsAbs)}`;
    const relTest = `./${path.basename(testAbs)}`;

    const lines = [];

    // frontmatter
    lines.push('---');
    lines.push(`title: ${title}`);
    lines.push('---');
    lines.push('');

    // imports
    if (hasExplanation) {
      lines.push(`import Explanation from './${path.basename(mdPath)}';`);
    }

    lines.push("import ProblemTabs from '@site/src/components/ProblemTabs';");

    // ✅ modern raw import (works with Docusaurus)
    lines.push(`import Impl from '${relJs}?raw';`);
    lines.push(`import Tests from '${relTest}?raw';`);
    lines.push('');

    // explanation
    if (hasExplanation) {
      lines.push('<Explanation />');
      lines.push('');
    }

    // tabs component
    lines.push(
      '<ProblemTabs implementation={Impl} tests={Tests} implLang="js" testLang="ts" />'
    );
    lines.push('');

    fs.writeFileSync(indexMdx, lines.join('\n'), 'utf8');

    console.log(`✅ Generated: ${path.relative(process.cwd(), indexMdx)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});