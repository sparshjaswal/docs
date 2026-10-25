export type LearningProgress = { version: 1; completed: string[]; role: string };

export function normalizeProgress(value: unknown, lessonIds: readonly string[], roleIds: readonly string[]): LearningProgress {
  const fallback: LearningProgress = { version: 1, completed: [], role: roleIds[0] ?? '' };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fallback;
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 1) return fallback;
  const completed = Array.isArray(candidate.completed)
    ? [...new Set(candidate.completed.filter((id): id is string => typeof id === 'string' && lessonIds.includes(id)))]
    : [];
  const role = typeof candidate.role === 'string' && roleIds.includes(candidate.role)
    ? candidate.role : fallback.role;
  return { version: 1, completed, role };
}

export function nextLesson<T extends { id: string }>(lessons: readonly T[], completed: readonly string[]): T | undefined {
  return lessons.find(lesson => !completed.includes(lesson.id));
}
