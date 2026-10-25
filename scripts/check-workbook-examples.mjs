import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = mkdtempSync(join(tmpdir(), 'workbook-checks-'));
// These answers explicitly use the worked lesson's tree, class, or sample data.
const usesExample = new Set(['37', '38', '39', '40', '44', '45', '46', '47', '48', '49']);
const lessons = new Map();
const codeBlocks = (text) => [...text.matchAll(/^```js(?: runnable)?\n([\s\S]*?)^```/gm)].map((m) => m[1]);
let passed = 0;
let failed = 0;

function run(id, code, expected) {
  const result = spawnSync(process.execPath, ['--input-type=module'], {
    cwd: directory,
    input: code,
    encoding: 'utf8',
    timeout: 5000,
  });
  if (result.error || result.status !== 0 || (expected && result.stdout.trim() !== expected)) {
    console.error(
      `FAIL workbook ${id}: ${result.error?.message ?? result.stderr ?? ''}\n${result.stdout ?? ''}`,
    );
    failed++;
  } else passed++;
}

try {
  for (const file of fg.sync('docs/**/*.{md,mdx}', { cwd: root })) {
    const source = readFileSync(join(root, file), 'utf8');
    for (const match of source.matchAll(
      /^### (\d\d)\. [^\n]*#workbook-\d\d[^\n]*\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm,
    )) {
      const [, id, body] = match;
      if (lessons.has(id)) throw new Error(`Duplicate workbook lesson ${id}`);
      const details = [
        ...body.matchAll(
          /<details(?: id="([^"]+)")?>\s*<summary>([^<]+)<\/summary>([\s\S]*?)<\/details>/g,
        ),
      ];
      // Hints may sit between setup and answer. Identify the required sections
      // explicitly so a hint is never executed as an answer or used as setup.
      const examples = details.filter((detail) => detail[2] === 'Worked lesson and setup');
      const answers = details.filter((detail) => detail[1] === `workbook-${id}-answer`);
      if (
        examples.length !== 1 || answers.length !== 1 ||
        !['A', 'B', 'C'].every((part) => source.includes(`| **${id}${part} — `))
      ) {
        throw new Error(`Incomplete workbook lesson ${id} in ${file}`);
      }
      lessons.set(id, { example: examples[0][3], answer: answers[0][3] });
    }
  }
  if (lessons.size !== 50) throw new Error(`Expected 50 lessons, found ${lessons.size}`);
  for (const [id, lesson] of lessons) {
    if (id === '17') continue; // DOM event exercise: tested in the browser.
    if (id === '15') {
      for (const [part, expected] of [
        [lesson.example, '5'],
        [lesson.answer, '12'],
      ]) {
        let entry;
        for (const block of codeBlocks(part)) {
          const filename = block.match(/^\/\/ (\w+\.mjs)/)?.[1];
          if (!filename) throw new Error('Module example needs a filename');
          writeFileSync(join(directory, filename), block);
          if (filename === 'app.mjs') entry = block;
        }
        if (!entry) throw new Error('Module example needs app.mjs');
        run(`${id} modules`, entry, expected);
      }
      continue;
    }
    const answer = codeBlocks(lesson.answer).join('\n');
    if (!answer.includes('assert.')) throw new Error(`Answer ${id} has no executable checks`);
    const setup = usesExample.has(id) ? codeBlocks(lesson.example).join('\n') : '';
    const combined = `${setup}\n${answer}`;
    const prelude = /import assert from/.test(combined)
      ? ''
      : 'import assert from "node:assert/strict";\n';
    run(id, prelude + combined);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
console.log(
  `Workbook: ${lessons.size} lessons / 150 exercises; ${passed} Node runs passed, ${failed} failed. Lesson 17 requires browser interaction.`,
);
process.exitCode = failed ? 1 : 0;
