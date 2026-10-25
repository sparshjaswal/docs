import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

export async function generateProblemPages({
  cwd = process.cwd(),
  dsaDir = process.env.DSA_DIR,
} = {}) {
  const docsRoot = path.resolve(cwd, 'docs');
  const candidates = dsaDir
    ? [path.resolve(docsRoot, dsaDir)]
    : ['DSA', 'dsa'].map((name) => path.join(docsRoot, name));
  const dsaRoot = candidates.find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isDirectory(),
  );
  if (
    !dsaRoot ||
    !path.relative(docsRoot, dsaRoot) ||
    path.relative(docsRoot, dsaRoot).startsWith('..')
  ) {
    throw new Error('DSA_DIR must name an existing directory inside docs (default: DSA or dsa).');
  }
  let generated = 0;
  const implementations = await fg('**/*.{js,ts}', {
    cwd: dsaRoot,
    absolute: true,
    ignore: ['**/*.test.*', '**/*.d.ts', '**/__test__/**', '**/__tests__/**', '**/_test_/**'],
  });
  for (const implementation of implementations.sort()) {
    const dir = path.dirname(implementation);
    const extension = path.extname(implementation).slice(1);
    const base = path.basename(implementation, `.${extension}`);
    const test = ['ts', 'js']
      .map((ext) => path.join(dir, `${base}.test.${ext}`))
      .find((file) => fs.existsSync(file));
    if (!test || fs.existsSync(path.join(dir, 'index.mdx'))) continue;
    const explanation = [path.join(dir, `${base}.md`), path.join(dir, 'README.md')].find((file) =>
      fs.existsSync(file),
    );
    const title = path
      .basename(dir)
      .replace(/[-_]+/g, ' ')
      .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
    const rawImport = (name, file) =>
      `import ${name} from ${JSON.stringify(`!!raw-loader!./${path.basename(file)}`)};`;
    const content = [
      '---',
      `title: ${JSON.stringify(title)}`,
      '---',
      '',
      "import ProblemTabs from '@site/src/components/ProblemTabs';",
      ...(explanation
        ? [`import Explanation from ${JSON.stringify(`./${path.basename(explanation)}`)};`]
        : []),
      rawImport('Impl', implementation),
      rawImport('Tests', test),
      '',
      ...(explanation ? ['<Explanation />', ''] : []),
      `<ProblemTabs implementation={Impl} tests={Tests} implLang="${extension}" testLang="${path.extname(test).slice(1)}" />`,
      '',
    ].join('\n');
    fs.writeFileSync(path.join(dir, 'index.mdx'), content, { flag: 'wx' });
    generated++;
  }
  return generated;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateProblemPages()
    .then((count) => console.log(`Generated ${count} problem pages; existing pages preserved.`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
