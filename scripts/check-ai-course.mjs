import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const python = process.env.AI_PYTHON ?? 'python3';
const version = spawnSync(python, ['--version'], { encoding: 'utf8' });
if (version.error || version.status !== 0) {
  console.error('AI course checks require Python 3.10+; set AI_PYTHON to its executable if needed.');
  process.exit(1);
}

let examples = 0;
let projects = 0;
let projectTests = 0;
let optionalRecipes = 0;
let failures = 0;
const selfTestProjects = new Set([
  'static/examples/ai/agents/durable_action.py',
  'static/examples/ai/rag/hybrid_retrieval.py',
  'static/examples/ai/agents/bounded_agent.py',
  'static/examples/ai/agents/model_agent.py',
  'static/examples/ai/bots/chatbot.py',
  'static/examples/ai/engineering/token_budget.py',
  'static/examples/ai/model-building/train_language_model.py',
  'static/examples/ai/rag/evidence_search.py',
  'static/examples/ai/generative-ai/tiny_language_model.py',
]);
const directory = mkdtempSync(join(tmpdir(), 'ai-course-'));

function execute(args, code) {
  // Each example has its own working directory so projects cannot rely on previous artifacts.
  const cwd = mkdtempSync(join(directory, 'run-'));
  return spawnSync(python, ['-I', '-B', ...args], {
    cwd,
    input: code,
    encoding: 'utf8',
    timeout: 20000,
    maxBuffer: 1024 * 1024,
  });
}

try {
  for (const file of fg.sync('docs/ai/**/*.{md,mdx}', { cwd: root }).sort()) {
    const markdown = readFileSync(join(root, file), 'utf8');
    const blocks = [...markdown.matchAll(/^```([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm)];
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index];
      if (!/^python\s+runnable\b/.test(block[1])) continue;
      const location = `${file}:${markdown.slice(0, block.index).split('\n').length}`;
      const expected = blocks[index + 1];
      if (block[1] !== 'python runnable' || expected?.[1] !== 'text output') {
        console.error(`FAIL ${location}: use python runnable followed by text output.`);
        failures++;
        continue;
      }
      const result = execute(['-'], block[2]);
      if (result.error || result.status !== 0) {
        console.error(`FAIL ${location}: ${result.error?.message ?? result.stderr.trim()}`);
        failures++;
      } else if (result.stdout.trimEnd() !== expected[2].trimEnd()) {
        console.error(`FAIL ${location}\nExpected: ${JSON.stringify(expected[2].trimEnd())}\nReceived: ${JSON.stringify(result.stdout.trimEnd())}`);
        failures++;
      } else {
        examples++;
      }
    }
  }
  const projectFiles = fg.sync('static/examples/ai/**/*.py', { cwd: root }).sort();
  for (const file of selfTestProjects) {
    if (!projectFiles.includes(file)) {
      console.error(`FAIL: registered project test file is missing: ${file}`);
      failures++;
    }
  }
  for (const file of projectFiles) {
    const result = execute([join(root, file)]);
    if (result.error || result.status !== 0) {
      console.error(`FAIL ${file}: ${result.error?.message ?? result.stderr.trim()}`);
      failures++;
    } else {
      projects++;
      console.log(`PASS ${file}`);
    }
    if (selfTestProjects.has(file)) {
      const checks = execute([join(root, file), '--self-test']);
      if (checks.error || checks.status !== 0) {
        console.error(`FAIL ${file} --self-test: ${checks.error?.message ?? checks.stderr.trim()}`);
        failures++;
      } else {
        projectTests++;
      }
    }
  }
  // Optional dependency recipes are downloads, not part of the offline runtime.
  // Compile their complete source without importing packages or downloading weights.
  for (const file of fg.sync('static/examples/ai/**/*.py.txt', { cwd: root }).sort()) {
    const result = execute(['-c', 'import sys; compile(sys.stdin.read(), sys.argv[1], "exec")', file],
      readFileSync(join(root, file), 'utf8'));
    if (result.error || result.status !== 0) {
      console.error(`FAIL ${file}: ${result.error?.message ?? result.stderr.trim()}`);
      failures++;
    } else {
      optionalRecipes++;
    }
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}

if (!examples || !projects) {
  console.error('FAIL: the AI course must contain both checked Python examples and offline projects.');
  failures++;
}
console.log(`AI course: ${examples} Python examples, ${projects} offline programs, and ${projectTests} project test suites passed; ${optionalRecipes} optional recipes syntax-checked only; ${failures} failures (${version.stdout.trim()}).`);
process.exitCode = failures ? 1 : 0;
