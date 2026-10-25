import path from 'node:path';

export const PRACTICE_START = '{/* BEGIN GENERATED PRACTICE PROBLEMS */}';
export const PRACTICE_END = '{/* END GENERATED PRACTICE PROBLEMS */}';

export function importPracticeProblem(source) {
  if (
    !source.includes('<PracticeProblem ') ||
    /^import PracticeProblem from ['"]@site\/src\/components\/PracticeProblem['"];?\s*$/m.test(
      source,
    )
  )
    return source;
  const statement = "import PracticeProblem from '@site/src/components/PracticeProblem';";
  const frontmatter = source.match(/^---\r?\n[\s\S]*?\r?\n---(?=\r?\n|$)/);
  // Bind the component in each MDX module, including in an already-running dev server.
  return frontmatter
    ? source.replace(frontmatter[0], `${frontmatter[0]}\n\n${statement}`)
    : `${statement}\n\n${source}`;
}

export function assignConceptPractice(bank, config) {
  const entries = [...bank.problems, ...bank.exercises];
  const ids = new Set(entries.map((entry) => entry.id));
  const covered = new Set();
  const assignments = new Map();
  for (const [concept, rules] of Object.entries(config)) {
    if (!/^[\w-]+(?:\/[\w-]+)*$/.test(concept)) throw new Error(`Invalid concept: ${concept}`);
    if (rules.topics.some((topic) => !bank.topics.includes(topic)))
      throw new Error(`Unknown source topic in ${concept}`);
    if ([...rules.include, ...rules.exclude].some((id) => !ids.has(id)))
      throw new Error(`Unknown question ID in ${concept}`);
    const selected = entries.filter(
      (entry) =>
        (rules.topics.includes(entry.topic) || rules.include.includes(entry.id)) &&
        !rules.exclude.includes(entry.id),
    );
    if (!selected.length) throw new Error(`No questions assigned to ${concept}`);
    assignments.set(concept, selected);
    selected.forEach((entry) => {
      if (covered.has(entry.id))
        throw new Error(`Question ${entry.id} has more than one practice home`);
      covered.add(entry.id);
    });
  }
  const missing = entries.filter((entry) => !covered.has(entry.id));
  if (missing.length)
    throw new Error(
      `Questions missing from concept practice: ${missing.map((entry) => entry.id).join(', ')}`,
    );
  return assignments;
}

export function replacePracticeBlock(source, generated) {
  if (source.split(PRACTICE_START).length !== 2 || source.split(PRACTICE_END).length !== 2)
    throw new Error('Expected exactly one pair of practice generation markers');
  const start = source.indexOf(PRACTICE_START);
  const end = source.indexOf(PRACTICE_END);
  const section = source.match(/^## Practice Problems\s*\n[\s\S]*?(?=^## |$(?![\s\S]))/m);
  if (!section || start < section.index || end < start || end >= section.index + section[0].length)
    throw new Error('Generation markers must be inside the Practice Problems section');
  return (
    source.slice(0, start) + PRACTICE_START + '\n\n' + generated.trim() + '\n\n' + source.slice(end)
  );
}

export const PRACTICE_HEADER =
  '| Problem | Level / priority | Practice / notes | Example / answer |\n| --- | --- | --- | --- |\n';

export function practiceRowId(row) {
  const leetcode = /^\| (?:\[LC (\d+) — |<PracticeProblem id=\{(\d+)\})/.exec(row);
  if (leetcode) return Number(leetcode[1] ?? leetcode[2]);
  return /^\| (G\d{2}) — /.exec(row)?.[1];
}

/** Keep authored and JavaScript workbook rows when refreshing the imported catalog. */
export function retainedPracticeRows(source, entries) {
  const imported = new Set(entries.map(({ id }) => id));
  const block = source.split(PRACTICE_START)[1]?.split(PRACTICE_END)[0] ?? '';
  return block
    .split('\n')
    .filter(
      (row) =>
        row.startsWith('| ') &&
        !row.startsWith('| Problem |') &&
        !/^\|\s*:?-/.test(row) &&
        !imported.has(practiceRowId(row)),
    );
}

export function renderConceptPractice({ concept, entries, local, escape, retained = [] }) {
  const directory = path.posix.join('docs/DSA', concept);
  const link = (file) => {
    const relative = path.posix.relative(directory, file);
    return relative.startsWith('.') ? relative : `./${relative}`;
  };
  const order = { Easy: 0, Medium: 1, Hard: 2 };
  const problems = entries
    .filter((entry) => typeof entry.id === 'number')
    .sort((a, b) => order[a.difficulty] - order[b.difficulty] || a.id - b.id);
  const exercises = entries.filter((entry) => typeof entry.id === 'string');
  // Required workbook questions appear first; other authored practice stays after the catalog.
  const required = retained.filter((row) => row.includes('| **Must fix** |'));
  const additional = retained.filter((row) => !row.includes('| **Must fix** |'));
  let text = PRACTICE_HEADER + required.map((row) => `${row}\n`).join('');
  if (problems.length) {
    for (const entry of problems) {
      const examples =
        (local.get(entry.id) ?? [])
          .map((file, i) => `[Example${i ? ` ${i + 1}` : ''}](${link(file)})`)
          .join(' · ') || '—';
      // Escape table delimiters and MDX-sensitive characters inside the JS string.
      // Each statement travels only with its own lesson, not in a global client-side catalog.
      const encode = (value) =>
        JSON.stringify(value).replace(
          /[<>&|]/g,
          (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`,
        );
      const question = entry.workbook
        ? `<PracticeProblem id={${entry.id}} title={${encode(entry.title)}} text={${encode(entry.workbook.text)}} />`
        : `[LC ${entry.id} — ${escape(entry.title)}](${entry.url})`;
      text += `| ${question} | ${entry.difficulty}${entry.premium ? ' · Premium' : ''} | [LeetCode](${entry.url}) | ${examples} |\n`;
    }
  }
  if (exercises.length) {
    for (const entry of exercises) {
      const notes = escape(entry.notes)
        .replace(/\n/g, ' ')
        .replace(/LC (\d+)/g, (label, id) => {
          const related = entry.related?.find((problem) => problem.id === Number(id));
          return related ? `[${label}](${related.url})` : label;
        });
      text += `| ${entry.id} — ${escape(entry.title)} | Exercise | ${escape(entry.topic)}${notes ? `. ${notes}` : ''} | — |\n`;
    }
  }
  return text + additional.map((row) => `${row}\n`).join('');
}
