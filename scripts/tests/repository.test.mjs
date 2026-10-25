import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { evaluate } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { createElement } from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import { generateProblemPages } from '../generate-problem-mdx.mjs';
import { validateBank, generateQuestionBank } from '../generate-question-bank.mjs';
import {
  assignConceptPractice,
  importPracticeProblem,
  renderConceptPractice,
  replacePracticeBlock,
  PRACTICE_START,
  PRACTICE_END,
  practiceRowId,
  retainedPracticeRows,
} from '../concept-practice.mjs';

const bank = JSON.parse(
  await fs.readFile(new URL('../../data/dsa-question-bank.json', import.meta.url), 'utf8'),
);

test('generated practice renders without a global MDX component provider', async () => {
  const table = renderConceptPractice({
    concept: 'hashing',
    entries: [bank.problems.find((entry) => entry.id === 1)],
    local: new Map(),
    escape: (value) => value,
  });
  const source = `## Practice Problems\n\n${table}`;
  const options = { ...jsxRuntime, remarkPlugins: [remarkGfm], baseUrl: import.meta.url };
  const missingImport = await evaluate(source, options);
  assert.throws(
    () => renderToStaticMarkup(createElement(missingImport.default)),
    /Expected component `PracticeProblem` to be defined/,
  );
  // Substitute only the UI component: this test exercises the generated MDX import and scope.
  const componentUrl = `data:text/javascript;base64,${Buffer.from(
    'export default function PracticeProblem({id, text}) { return "LC " + id + ": " + text; }',
  ).toString('base64')}`;
  const imported = importPracticeProblem(source);
  assert.equal(
    importPracticeProblem(imported),
    imported,
    'Regeneration must not repeat the import',
  );
  const module = await evaluate(
    imported.replace('@site/src/components/PracticeProblem', componentUrl),
    options,
  );
  const html = renderToStaticMarkup(createElement(module.default));
  assert.match(html, /<table>/);
  assert.match(html, /LC 1: Problem statement/);
  assert.match(html, /Find two distinct indices/);
});

test('practice imports preserve frontmatter and skip guides without statement components', () => {
  const header = '---\ntitle: Example\n---';
  const source = `${header}\n\n# Example\n\n<PracticeProblem id={1} text="Example" />`;
  assert.ok(importPracticeProblem(source).startsWith(`${header}\n\nimport PracticeProblem`));
  assert.equal(importPracticeProblem('# Ordinary guide'), '# Ordinary guide');
});

test('preserves the complete PDF catalog, source labels, and mathematical exponents', () => {
  validateBank(bank);
  assert.equal(bank.topics.length, 18);
  assert.equal(bank.problems.length, 487);
  assert.equal(bank.exercises.length, 47);
  assert.equal(bank.problems.filter((p) => p.workbook).length, 329);
  assert.equal(Object.keys(bank.sources).length, 46);
  assert.match(bank.problems.find((p) => p.id === 1).workbook.text, /10\^9/);
  assert.equal(
    new Set(bank.problems.filter((p) => p.workbook).map((p) => p.workbook.pdfPage)).size,
    329,
  );
  assert.equal(bank.problems.filter((p) => p.sources.includes('P01')).length, 329);
  for (const problem of bank.problems) {
    if (problem.workbook)
      assert.ok(
        problem.workbook.header.some((line) => line.includes(problem.url.split('/').at(-2))),
      );
  }
});

test('rejects duplicate IDs, duplicate problem links, and unknown source labels', () => {
  const duplicate = structuredClone(bank);
  duplicate.problems.push(duplicate.problems[0]);
  assert.throws(() => validateBank(duplicate), /Duplicate/);
  const wrongUrl = structuredClone(bank);
  wrongUrl.problems[1].url = wrongUrl.problems[0].url;
  assert.throws(() => validateBank(wrongUrl), /duplicate URL/);
  const unknownSource = structuredClone(bank);
  unknownSource.problems[0].sources = ['S99'];
  assert.throws(() => validateBank(unknownSource), /Missing source/);
});

test('generated concept practice and source notes match the source data', async () => {
  await generateQuestionBank({ check: true });
});

test('every imported question appears once in table-only concept Practice Problems', async () => {
  const config = JSON.parse(
    await fs.readFile(new URL('../../data/dsa-practice-concepts.json', import.meta.url), 'utf8'),
  );
  const assignments = assignConceptPractice(bank, config);
  const covered = new Set();
  for (const [concept, entries] of assignments) {
    const source = await fs.readFile(
      new URL(`../../docs/DSA/${concept}/README.md`, import.meta.url),
      'utf8',
    );
    const generated = source.split(PRACTICE_START)[1].split(PRACTICE_END)[0];
    const entryIds = new Set(entries.map(({ id }) => id));
    const keys = generated
      .split('\n')
      .map(practiceRowId)
      .filter((id) => entryIds.has(id))
      .map((id) => (typeof id === 'number' ? `LC ${id}` : id));
    assert.equal(keys.length, entries.length, concept);
    assert.equal(new Set(keys).size, keys.length, `Repeated question in ${concept}`);
    keys.forEach((key) => {
      assert.ok(!covered.has(key), `Duplicate practice home for ${key}`);
      covered.add(key);
    });
    const practice = source.slice(source.indexOf('## Practice Problems')).split(/\n## /)[0];
    const allIds = practice
      .split('\n')
      .map(practiceRowId)
      .filter((id) => typeof id === 'number');
    assert.equal(
      new Set(allIds).size,
      allIds.length,
      `Duplicate across generated and existing practice in ${concept}`,
    );
    assert.ok(
      !source.includes('## Question bank practice'),
      `Link-only section remains in ${concept}`,
    );
    assert.ok(!source.includes('question-bank/'), `Removed route remains in ${concept}`);
    const content = practice
      .slice('## Practice Problems'.length)
      .replace(PRACTICE_START, '')
      .replace(PRACTICE_END, '');
    assert.ok(
      content.split('\n').every((line) => !line.trim() || /^\|.*\|$/.test(line)),
      `Non-table content remains in ${concept} Practice Problems`,
    );
    assert.doesNotMatch(generated, /\]\(#(?:lc-\d+|g\d+)\)/);
    for (const entry of entries) {
      const row = generated.split('\n').find((line) => practiceRowId(line) === entry.id);
      assert.ok(row, `${concept}: missing ${entry.id}`);
      if (typeof entry.id === 'number') {
        assert.ok(row.includes(`](${entry.url})`));
        assert.ok(row.includes(entry.difficulty));
        if (entry.premium) assert.ok(row.includes('Premium'));
      } else {
        for (const related of entry.related ?? []) assert.ok(row.includes(related.url));
      }
    }
  }
  const expected = [...bank.problems.map((p) => `LC ${p.id}`), ...bank.exercises.map((p) => p.id)];
  assert.deepEqual([...covered].sort(), expected.sort());
  for (const [concept, id] of [
    ['queue', 622],
    ['stack', 155],
    ['trie', 642],
    ['trees/fenwick-tree', 307],
    ['dp', 1012],
  ]) {
    assert.ok(
      assignments.get(concept).some((entry) => entry.id === id),
      `${concept} must include ${id}`,
    );
  }
  assert.throws(() => assignConceptPractice(bank, {}), /missing from concept practice/);
  const duplicateHomes = structuredClone(config);
  duplicateHomes.Array.include.push(622);
  assert.throws(() => assignConceptPractice(bank, duplicateHomes), /more than one practice home/);
});

test('catalog regeneration keeps required and authored questions in one table', () => {
  const entries = [bank.problems.find(({ id }) => id === 1), bank.exercises[0]];
  const required = '| **01A — Predict the result.** | **Must fix** | Setup | Answer |';
  const authored = '| Extra task | Practice | Keep this task. | — |';
  const initial = renderConceptPractice({
    concept: 'hashing',
    entries,
    local: new Map(),
    escape: (value) => value,
    retained: [required, authored],
  });
  const source = `## Practice Problems\n\n${PRACTICE_START}\n${initial}\n${PRACTICE_END}`;
  const retained = retainedPracticeRows(source, entries);
  assert.deepEqual(retained, [required, authored]);
  const regenerated = renderConceptPractice({
    concept: 'hashing',
    entries,
    local: new Map(),
    escape: (value) => value,
    retained,
  });
  assert.equal(regenerated, initial);
  assert.equal((regenerated.match(/^\| ---/gm) ?? []).length, 1);
  assert.ok(regenerated.indexOf(required) < regenerated.indexOf('<PracticeProblem'));
  assert.match(regenerated, /<PracticeProblem id=\{1\} title=\{"Two Sum"\}/);
  assert.doesNotMatch(regenerated, /Read problem, examples, and constraints/);
});

test('standalone Question Bank pages and search component have been removed', async () => {
  for (const file of [
    'docs/DSA/question-bank',
    'src/components/QuestionBank.tsx',
    'src/data/question-index.json',
  ]) {
    await assert.rejects(fs.access(new URL(`../../${file}`, import.meta.url)), { code: 'ENOENT' });
  }
  const config = await fs.readFile(new URL('../../docusaurus.config.ts', import.meta.url), 'utf8');
  assert.ok(!config.includes('/DSA/question-bank'));
});

test('practice regeneration preserves authored content and refuses misplaced markers', () => {
  const before = '# Concept\n\nKeep this explanation.\n\n## Practice Problems\n\n';
  const after =
    '\n\n### Additional practice\n\nKeep this older exercise.\n\n## References\n\nKeep these links.\n';
  const original = `${before}${PRACTICE_START}\nOld generated content\n${PRACTICE_END}${after}`;
  const updated = replacePracticeBlock(original, 'New generated table');
  assert.equal(
    updated,
    `${before}${PRACTICE_START}\n\nNew generated table\n\n${PRACTICE_END}${after}`,
  );
  assert.equal(replacePracticeBlock(updated, 'New generated table'), updated);
  assert.throws(() => replacePracticeBlock('# Concept\n', 'text'), /markers/);
  assert.throws(
    () => replacePracticeBlock(original.replace('## Practice Problems', '## References'), 'text'),
    /Practice Problems/,
  );
});

test('problem generation loads source as text, supports TS and JS, and preserves authored pages', async (context) => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-generator-'));
  context.after(() => fs.rm(cwd, { recursive: true, force: true }));
  for (const [slug, implExt, testExt] of [
    ['LC-1-example', 'js', 'ts'],
    ['LC-2-example', 'ts', 'js'],
  ]) {
    const dir = path.join(cwd, 'docs/DSA', slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, `solution.${implExt}`),
      'throw new Error("Never execute this while generating");',
    );
    await fs.writeFile(path.join(dir, `solution.test.${testExt}`), '// example tests');
  }
  assert.equal(await generateProblemPages({ cwd }), 2);
  const first = path.join(cwd, 'docs/DSA/LC-1-example/index.mdx');
  assert.match(await fs.readFile(first, 'utf8'), /!!raw-loader!\.\/solution\.js/);
  await fs.writeFile(first, 'Authored content');
  assert.equal(await generateProblemPages({ cwd }), 0);
  assert.equal(await fs.readFile(first, 'utf8'), 'Authored content');
  await assert.rejects(() => generateProblemPages({ cwd, dsaDir: '../' }), /inside docs/);
});
