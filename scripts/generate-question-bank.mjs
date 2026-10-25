import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import {
  assignConceptPractice,
  importPracticeProblem,
  renderConceptPractice,
  replacePracticeBlock,
  retainedPracticeRows,
} from './concept-practice.mjs';

const escape = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/[<>{}|]/g, (c) => `&#${c.charCodeAt(0)};`)
    .replace(/([\\`*_[\]])/g, '\\$1');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function validateBank(bank) {
  const ids = new Set();
  const urls = new Set();
  for (const p of bank.problems) {
    if (!Number.isInteger(p.id) || p.id < 1 || ids.has(p.id))
      throw new Error(`Duplicate or invalid LeetCode ID: ${p.id}`);
    if (urls.has(p.url) || !/^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/$/.test(p.url))
      throw new Error(`Invalid or duplicate URL: ${p.url}`);
    if (
      !p.title ||
      !['Easy', 'Medium', 'Hard'].includes(p.difficulty) ||
      !bank.topics.includes(p.topic)
    )
      throw new Error(`Invalid metadata: ${p.id}`);
    if (!p.sources.length || p.sources.some((s) => !bank.sources[s]))
      throw new Error(`Missing source: ${p.id}`);
    if (
      p.workbook &&
      (!p.workbook.text.includes('JavaScript starter') ||
        !p.workbook.text.includes('EXAMPLE 1') ||
        p.workbook.pdfPage > bank.source.pages)
    )
      throw new Error(`Incomplete workbook entry: ${p.id}`);
    ids.add(p.id);
    urls.add(p.url);
  }
  const generalIds = new Set();
  for (const exercise of bank.exercises) {
    if (
      !/^G\d{2}$/.test(exercise.id) ||
      generalIds.has(exercise.id) ||
      !bank.topics.includes(exercise.topic) ||
      !exercise.title ||
      !exercise.sources.length ||
      exercise.sources.some((s) => !bank.sources[s])
    )
      throw new Error(`Invalid general exercise: ${exercise.id}`);
    generalIds.add(exercise.id);
  }
}

export async function generateQuestionBank({ check = false } = {}) {
  const bank = JSON.parse(fs.readFileSync(path.join(root, 'data/dsa-question-bank.json'), 'utf8'));
  validateBank(bank);
  const local = new Map();
  const localDocs = await fg('docs/DSA/**/LC-*/{index.mdx,README.md}', { cwd: root });
  for (const file of localDocs.sort()) {
    const match = file.match(/\/LC-(\d+)-/);
    // Keep the established URL while correcting this historical folder-name typo.
    const id = file.includes('LC-1101-capacity-to-ship') ? 1011 : Number(match[1]);
    const list = local.get(id) ?? [];
    list.push(file);
    local.set(id, list);
  }
  const files = new Map();
  const toLocal = (file) => `./${file.replace('docs/DSA/', '')}`;
  let sources = `---\ntitle: Practice sources and scope\nsidebar_label: Practice sources\nsidebar_position: 30\nslug: /DSA/practice-sources\n---\n\n# Sources and scope\n\nThe practice catalog is organized by LeetCode ID: **487 distinct LeetCode questions**, **329 detailed workbook entries**, and **47 general exercises** across **18 source topics**. Each imported question has one main home in a table-only Practice Problems section. Select a question title to open its statement, examples, and constraints without leaving the lesson. Each concept has one practice table, including its authored and JavaScript workbook questions. The other catalog entries provide direct practice links. Existing repository examples are linked to the same question instead of being copied. Six additional repository questions remain available below.\n\n`;
  sources += `The source records a catalog snapshot from **13 October 2026**. This import preserves that snapshot; it does not independently verify current difficulty, Premium status, examples, or judge constraints. General exercises have no assigned LeetCode ID, and related examples do not establish an exact match. Empty JavaScript starters are exercises, not completed solutions. Some older repository examples and tests are also unfinished.\n\n`;
  sources += `Superscript bounds are transcribed as powers (for example, \`10^9\`). The canonical source data retains workbook headers, original page numbers, source labels, and verification notes. Source SHA-256: \`${bank.source.sha256}\`.\n\n`;
  sources += '## Additional repository examples\n\n';
  const bankIds = new Set(bank.problems.map((p) => p.id));
  for (const [id, paths] of local) {
    if (!bankIds.has(id))
      sources +=
        paths
          .map(
            (p) =>
              `- [LC ${id}: ${escape(
                path
                  .basename(path.dirname(p))
                  .replace(/^LC-\d+-/, '')
                  .replace(/-/g, ' '),
              )}](${toLocal(p)})`,
          )
          .join('\n') + '\n';
  }
  sources +=
    '\n## Import and maintenance\n\nSee the repository README for setup, regeneration, and validation. Normal builds use the checked-in JSON. Reader-facing lessons include the available statements and never require a separate document. Generated Practice Problems sections and these source notes are reviewed alongside changes to the source data.\n\n## Source directory\n\nThese labels identify the original catalog sources, not independently reviewed endorsements.\n';
  for (const [key, value] of Object.entries(bank.sources))
    sources += `\n### ${key} {/* #${key.toLowerCase()} */}\n\n${escape(value.title.replace(/Supplied PDF: 353 pages, containing 329 distinct practice entries\. Its practice pages are preserved in the following section\./, 'Contains 329 distinct practice entries, included in their concept tables.'))}${value.url ? `\n\n[Original post](${value.url})` : ''}\n`;
  files.set(path.join(root, 'docs/DSA/practice-sources.md'), sources);
  const conceptConfig = JSON.parse(
    fs.readFileSync(path.join(root, 'data/dsa-practice-concepts.json'), 'utf8'),
  );
  const concepts = assignConceptPractice(bank, conceptConfig);
  for (const [concept, entries] of concepts) {
    const file = path.join(root, 'docs/DSA', concept, 'README.md');
    const source = fs.readFileSync(file, 'utf8');
    const generated = renderConceptPractice({
      concept,
      entries,
      local,
      escape,
      retained: retainedPracticeRows(source, [...bank.problems, ...bank.exercises]),
    });
    files.set(file, importPracticeProblem(replacePracticeBlock(source, generated)));
  }
  const stale = [];
  for (const [file, content] of files) {
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) continue;
    stale.push(path.relative(root, file));
    if (!check) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content);
    }
  }
  if (check && stale.length)
    throw new Error(
      `Concept practice needs regeneration:\n${stale.join('\n')}\nRun yarn generate:questions.`,
    );
  return {
    problems: bank.problems.length,
    exercises: bank.exercises.length,
    changed: stale.length,
    concepts: concepts.size,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateQuestionBank({ check: process.argv.includes('--check') })
    .then((result) =>
      console.log(
        `Concept practice: ${result.problems} problems, ${result.exercises} exercises, ${result.concepts} concept practice sections; ${result.changed} files updated.`,
      ),
    )
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
