import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import { practiceRowId } from '../concept-practice.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const docs = fg.sync('docs/**/*.{md,mdx}', { cwd: root }).map((file) => ({
  file,
  text: fs.readFileSync(path.join(root, file), 'utf8'),
}));

// Local PDF redirects hide lesson content; external research citations are valid sources.
const localPdfLink = /\]\((?!https?:\/\/)[^\n)]*\.pdf(?:[#?)])/i;

test('lessons include their content and have no local PDF redirects or formula images', () => {
  for (const { file, text } of docs) {
    assert.doesNotMatch(text, localPdfLink, file);
    assert.doesNotMatch(text, /PDF pages?\s+\d/i, file);
    assert.doesNotMatch(text, /!\[[^\]]*\]\([^\n)]*\/media\/math\//, file);
  }
});

test('practice rows are unique while all catalog statements remain available in-page', () => {
  const ids = new Set();
  const statements = new Map();
  for (const { file, text } of docs) {
    if (text.includes('<PracticeProblem ')) {
      assert.match(
        text,
        /^import PracticeProblem from ['"]@site\/src\/components\/PracticeProblem['"];?$/m,
        `${file} must import its practice component directly`,
      );
    }
    for (const row of text.split('\n')) {
      const id = practiceRowId(row);
      if (typeof id !== 'number') continue;
      assert.ok(!ids.has(id), `Duplicate practice row: LC ${id} in ${file}`);
      ids.add(id);
      const embedded =
        /<PracticeProblem id=\{(\d+)\} title=\{("(?:[^"\\]|\\.)*")\} text=\{("(?:[^"\\]|\\.)*")\} \/>/.exec(
          row,
        );
      if (embedded) statements.set(Number(embedded[1]), JSON.parse(embedded[3]));
    }
  }
  assert.equal(ids.size, 745, '487 catalog questions plus 258 additional authored questions');
  const bank = JSON.parse(fs.readFileSync(path.join(root, 'data/dsa-question-bank.json'), 'utf8'));
  assert.equal(statements.size, 329);
  for (const question of bank.problems.filter((entry) => entry.workbook)) {
    assert.equal(
      statements.get(question.id),
      question.workbook.text,
      `Statement ${question.id} lost content`,
    );
  }
});

test('each Practice Problems section contains exactly one table', () => {
  for (const { file, text } of docs) {
    const practice = /^## Practice Problems\s*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m.exec(text)?.[1];
    if (!practice) continue;
    const lines = practice
      .split('\n')
      .filter((line) => line.trim() && !line.includes('GENERATED PRACTICE PROBLEMS'));
    assert.ok(
      lines.every((line) => /^\|.*\|$/.test(line)),
      file,
    );
    assert.equal(lines.filter((line) => /^\|\s*:?-/.test(line)).length, 1, file);
    assert.equal((text.match(/^## Practice Problems\s*$/gm) ?? []).length, 1, file);
  }
});

test('all 150 supplied workbook questions are bold Must fix rows with local setup and answers', () => {
  const found = new Set();
  for (const { file, text } of docs) {
    assert.doesNotMatch(text, /Read problem, examples, and constraints/, file);
    for (const match of text.matchAll(
      /^\| \*\*(\d\d[ABC]) — (.+)\*\* \| \*\*Must fix\*\* \| \[Worked example\]\(#workbook-(\d\d)\) \| \[Answer\]\(#workbook-\3-answer\) \|$/gm,
    )) {
      const [, id, prompt, lesson] = match;
      assert.ok(!found.has(id), `Duplicate workbook question ${id}`);
      assert.ok(prompt.length > 10, `${file}: missing prompt for ${id}`);
      assert.equal(id.slice(0, 2), lesson);
      assert.ok(text.includes(`#workbook-${lesson} */}`), `${file}: missing setup`);
      assert.ok(
        text.includes(`<details id="workbook-${lesson}-answer">`),
        `${file}: missing answer`,
      );
      found.add(id);
    }
    assert.doesNotMatch(
      text,
      /^\| \*\*\d\d[ABC]\*\* \|/m,
      `${file}: separate workbook table remains`,
    );
  }
  const expected = Array.from({ length: 50 }, (_, index) =>
    String(index + 1).padStart(2, '0'),
  ).flatMap((id) => ['A', 'B', 'C'].map((part) => `${id}${part}`));
  assert.deepEqual([...found].sort(), expected);
});

test('pseudocode has an ordered eight-lesson course and a menu entry', () => {
  const course = docs.filter(({ file }) => /^docs\/pseudocode\/\d\d-/.test(file));
  assert.equal(course.length, 8);
  for (let position = 1; position <= 8; position++) {
    const lesson = course.find(({ text }) => text.includes(`sidebar_position: ${position}\n`));
    assert.ok(lesson, `Missing pseudocode step ${position}`);
    assert.match(lesson.text, /## Practice Problems/);
  }
  const menu = fs.readFileSync(path.join(root, 'scripts/sidebar-navigation.ts'), 'utf8');
  assert.ok(menu.includes("...take('pseudocode')"));
});

test('documentation audit catches missing MDX imports without treating code as page markup', async () => {
  const { auditDocumentation } = await import('../check-documentation.mjs');
  assert.deepEqual(auditDocumentation('import Card from "./Card";\n\n<Card />'), []);
  assert.match(auditDocumentation('<Missing />')[0], /Missing needs an explicit import/);
  assert.deepEqual(auditDocumentation('```jsx\n<Example />\n```\n\n`<Type>` is code.'), []);
  assert.ok(
    auditDocumentation('```js\nconst unfinished = 1;').some((issue) => issue.includes('Unclosed')),
  );
  assert.ok(
    auditDocumentation('Coming soon: a worked example.').some((issue) =>
      issue.includes('Unfinished'),
    ),
  );
  assert.ok(
    auditDocumentation('![](http://example.com/chart.png)').some((issue) =>
      issue.includes('alt text'),
    ),
  );
});

test('PDF citation policy permits research sources but rejects local lesson redirects', () => {
  assert.doesNotMatch('[CAP proof](https://example.org/papers/proof.pdf)', localPdfLink);
  assert.doesNotMatch('[Research](https://example.org/paper.pdf#page=3)', localPdfLink);
  assert.match('[Read lesson](../media/lesson.pdf)', localPdfLink);
  assert.match('[Read lesson](/files/lesson.pdf#page=3)', localPdfLink);
});
