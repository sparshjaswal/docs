import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = mkdtempSync(join(tmpdir(), 'javascript-lessons-'));
let passed = 0;
let skipped = 0;
let failed = 0;

function run(code, checkOnly = false, cwd = directory) {
  return spawnSync(process.execPath, [...(checkOnly ? ['--check'] : []), '--input-type=module'], {
    cwd,
    input: code,
    encoding: 'utf8',
    timeout: 5000,
    maxBuffer: 1024 * 1024,
  });
}

try {
  for (const file of fg.sync('docs/**/*.{md,mdx}', { cwd: root }).sort()) {
    const markdown = readFileSync(join(root, file), 'utf8');
    const blocks = [...markdown.matchAll(/^```([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm)];
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index];
      if (!/^js\s+runnable\b/.test(block[1])) continue;
      const line = markdown.slice(0, block.index).split('\n').length;
      const location = `${file}:${line}`;
      const metadata = /^js runnable(?: requires=([\w.]+))?$/.exec(block[1]);
      const expected = blocks[index + 1];
      if (!metadata || expected?.[1] !== 'text output') {
        console.error(
          `FAIL ${location}: use "js runnable [requires=API.path]" followed by "text output".`,
        );
        failed++;
        continue;
      }
      const requirement = metadata[1];
      const supported =
        !requirement ||
        requirement.split('.').reduce((value, key) => value?.[key], globalThis) !== undefined;
      // Resolve a lesson's relative implementation imports beside its Markdown source.
      const result = run(block[2], !supported, dirname(join(root, file)));
      if (result.error || result.status !== 0) {
        console.error(`FAIL ${location}: ${result.error?.message ?? result.stderr.trim()}`);
        failed++;
      } else if (!supported) {
        console.log(
          `SKIP ${location}: ${requirement} is unavailable in ${process.version} (syntax checked).`,
        );
        skipped++;
      } else if (result.stdout.trimEnd() !== expected[2].trimEnd()) {
        console.error(
          `FAIL ${location}\nExpected: ${JSON.stringify(expected[2].trimEnd())}\nReceived: ${JSON.stringify(result.stdout.trimEnd())}`,
        );
        failed++;
      } else {
        passed++;
      }
    }
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}

if (passed + skipped + failed === 0) {
  console.error('FAIL: no runnable JavaScript documentation examples found.');
  failed++;
}
console.log(
  `JavaScript examples: ${passed} passed, ${skipped} unsupported, ${failed} failed (${process.version}).`,
);
process.exitCode = failed ? 1 : 0;
