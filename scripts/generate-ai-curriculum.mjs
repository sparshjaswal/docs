import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const guide = JSON.parse(readFileSync(join(root, 'data/ai-stage-guide.json'), 'utf8'));
const roles = [
  ['ai-engineer', 'AI Engineer', 'studios/01-ai-engineer.md'],
  ['llm-engineer', 'LLM Engineer', 'studios/02-llm-engineer.md'],
  ['genai-engineer', 'GenAI Engineer', 'studios/03-genai-engineer.md'],
  ['rag-engineer', 'RAG Engineer', 'studios/04-rag-engineer.md'],
  ['agent-developer', 'AI Agent Developer', 'studios/05-agent-developer.md'],
  ['ai-researcher', 'AI Researcher', 'studios/06-ai-researcher.md'],
  ['ai-architect', 'AI Architect', 'studios/07-ai-architect.md'],
];

function toId(source) {
  return source.replace(/\.mdx?$/, '').split('/').map(part => part.replace(/^\d+-/, '')).join('/');
}

function lesson(source) {
  const content = readFileSync(join(root, 'docs/ai', source), 'utf8');
  const rawTitle = /^title:\s*(.+)$/m.exec(content)?.[1];
  if (!rawTitle) throw new Error('Missing title: ' + source);
  const title = rawTitle.startsWith('"') ? JSON.parse(rawTitle) : rawTitle;
  const id = toId(source);
  const position = Number(/^sidebar_position:\s*([\d.-]+)/m.exec(content)?.[1] ?? 0);
  return { id, title, source: 'docs/ai/' + source, href: '/ai/' + id, position };
}

let previous;
const stages = guide.map((stage, index) => {
  const sources = ['orientation', 'careers'].includes(stage.id)
    ? [stage.id + '.md']
    : fg.sync(stage.id + '/*.{md,mdx}', { cwd: join(root, 'docs/ai') });
  const lessons = sources.map(lesson).sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
    .map((item) => {
      const result = { ...item, requires: previous ? [previous] : [] };
      delete result.position;
      previous = item.id;
      return result;
    });
  if (!lessons.length) throw new Error('Empty curriculum stage: ' + stage.id);
  return { ...stage, questions: stage.questions.map(question => ({ ...question, review: toId(question.review) })), number: index, lessons };
});
let previousDeveloperModule;
const developerModules = fg.sync('developer-roadmap/[0-9]*.md', { cwd: join(root, 'docs/ai') })
  .map(lesson).sort((a, b) => a.position - b.position || a.id.localeCompare(b.id))
  .map((item) => {
    const result = { ...item, requires: previousDeveloperModule ? [previousDeveloperModule] : [] };
    delete result.position;
    previousDeveloperModule = item.id;
    return result;
  });
const developerReferences = ['index', 'study-plans', 'portfolio'].map(name => {
  const item = lesson('developer-roadmap/' + name + '.md');
  delete item.position;
  if (name === 'index') item.href = '/ai/developer-roadmap';
  return item;
});

const curriculum = {
  version: 1,
  stages,
  roles: roles.map(([id, title, source]) => {
    const studio = lesson(source);
    delete studio.position;
    return { id, title, studio: { ...studio, requires: ['careers'] } };
  }),
  developerRoadmap: { modules: developerModules, references: developerReferences },
};
const output = JSON.stringify(curriculum, null, 2) + '\n';
const target = join(root, 'data/ai-curriculum.json');
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== output) {
    console.error('AI curriculum is stale. Run yarn generate:ai.');
    process.exitCode = 1;
  }
} else {
  writeFileSync(target, output);
}
console.log('AI curriculum: ' + stages.reduce((total, item) => total + item.lessons.length, 0) +
  ' ordered core lessons, ' + roles.length + ' studios, ' + guide.reduce((n, s) => n + s.questions.length, 0) +
  ' checkpoint questions, and ' + developerModules.length + ' developer roadmap modules.');
