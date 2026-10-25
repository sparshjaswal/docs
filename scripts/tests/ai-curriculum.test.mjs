import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import fg from 'fast-glob';
import { normalizeProgress, nextLesson } from '../../src/components/AICurriculum/progress.ts';

const curriculum = JSON.parse(readFileSync(new URL('../../data/ai-curriculum.json', import.meta.url), 'utf8'));
const core = curriculum.stages.flatMap(stage => stage.lessons);
const all = [...core, ...curriculum.roles.map(role => role.studio)];
const developerModules = curriculum.developerRoadmap.modules;
const developerReferences = curriculum.developerRoadmap.references;
const ids = all.map(lesson => lesson.id);
const roles = curriculum.roles.map(role => role.id);

test('curriculum contains every teaching page once and only backward prerequisites', () => {
  const registered = [...all, ...developerModules, ...developerReferences];
  assert.equal(new Set(registered.map(lesson => lesson.id)).size, registered.length);
  for (const path of [all, developerModules]) {
    const seen = new Set();
    for (const lesson of path) {
      assert.ok(readFileSync(new URL('../../' + lesson.source, import.meta.url), 'utf8').length > 0);
      for (const requirement of lesson.requires) assert.ok(seen.has(requirement), lesson.id + ' needs ' + requirement);
      seen.add(lesson.id);
    }
  }
  const references = new Set(['syllabus.md', 'assessments.md', 'glossary.md']);
  const files = fg.sync('docs/ai/**/*.{md,mdx}').filter(file => !references.has(file.replace('docs/ai/', '')));
  assert.deepEqual(new Set(files), new Set(registered.map(lesson => lesson.source)));
});

test('all stage checkpoints refer to concepts already taught and have valid distinct choices', () => {
  const seen = new Set();
  for (const stage of curriculum.stages) {
    stage.lessons.forEach(lesson => seen.add(lesson.id));
    assert.ok(stage.questions.length >= 2);
    for (const question of stage.questions) {
      assert.ok(seen.has(question.review), question.prompt);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.choices.length);
      assert.equal(new Set(question.choices).size, question.choices.length);
      assert.ok(question.explanation.length > 30);
    }
  }
});

test('progress rejects unknown versions, malformed values, stale IDs, and invalid roles', () => {
  for (const value of [null, [], 'bad', 3, { version: 2, completed: ids }]) {
    assert.deepEqual(normalizeProgress(value, ids, roles), { version: 1, completed: [], role: roles[0] });
  }
  const clean = normalizeProgress({ version: 1, role: 'unknown', completed: [ids[0], ids[0], 'deleted', 7] }, ids, roles);
  assert.deepEqual(clean, { version: 1, completed: [ids[0]], role: roles[0] });
});

test('resume keeps earlier gaps and a changed role keeps shared progress', () => {
  assert.equal(nextLesson(core, [core[1].id])?.id, core[0].id);
  assert.equal(nextLesson(core, core.map(lesson => lesson.id)), undefined);
  const saved = normalizeProgress({ version: 1, role: roles[1], completed: ids }, ids, roles);
  const selected = [...core, curriculum.roles[1].studio];
  assert.equal(nextLesson(selected, saved.completed), undefined);
  assert.equal(saved.role, roles[1]);
});
