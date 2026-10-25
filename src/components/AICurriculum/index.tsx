import { useEffect, useId, useState } from 'react';
import Link from '@docusaurus/Link';
import curriculum from '@site/data/ai-curriculum.json';
import { nextLesson, normalizeProgress, type LearningProgress } from './progress';
import styles from './styles.module.css';

const core = curriculum.stages.flatMap(stage => stage.lessons);
const allIds = [...core, ...curriculum.roles.map(role => role.studio)].map(lesson => lesson.id);
const roleIds = curriculum.roles.map(role => role.id);
const storageKey = 'ai-learning-progress-v1';

export default function AICurriculum() {
  const [progress, setProgress] = useState<LearningProgress>(() => normalizeProgress(null, allIds, roleIds));
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const selectId = useId();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      setProgress(normalizeProgress(saved ? JSON.parse(saved) : null, allIds, roleIds));
    } catch {
      setNotice('Saved progress could not be loaded. You can still use the roadmap in this visit.');
    }
    setReady(true);
  }, []);

  function update(value: LearningProgress) {
    setProgress(value);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
      setNotice('');
    } catch {
      setNotice('Progress is available for this visit but could not be saved in this browser.');
    }
  }

  function toggle(id: string) {
    update({ ...progress, completed: progress.completed.includes(id)
      ? progress.completed.filter(item => item !== id) : [...progress.completed, id] });
  }

  const role = curriculum.roles.find(item => item.id === progress.role) ?? curriculum.roles[0];
  const path = [...core, role.studio];
  const completed = path.filter(lesson => progress.completed.includes(lesson.id)).length;
  const next = nextLesson(path, progress.completed);

  return (
    <section className={styles.portal} aria-label="Your AI learning roadmap">
      <div className={styles.hero}>
        <p className={styles.eyebrow}>LEARN · BUILD · EXPLAIN</p>
        <h2>A clear path from first principles to independent practice</h2>
        <p>{core.length} ordered core lessons. Seven professional studios. One step at a time.</p>
        <div className={styles.controls}>
          <label htmlFor={selectId}>Your capstone direction</label>
          <select id={selectId} value={role.id} disabled={!ready} onChange={event => {
            update({ ...progress, role: event.target.value });
            setConfirmReset(false);
          }}>
            {curriculum.roles.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
        <p className={styles.small}>All directions share the foundations below. Your choice adds one specialist studio; it does not skip prerequisites.</p>
        <progress max={path.length} value={completed} aria-label="Lessons marked complete" />
        <p className={styles.progressText} role="status">{completed} of {path.length} lessons marked complete for this path</p>
        <div className={styles.actions}>
          {next ? <Link className={styles.primary} to={next.href}>Continue: {next.title} →</Link>
            : <Link className={styles.primary} to="/ai/careers">Review your capstone evidence →</Link>}
          <Link to="/ai/assessments">Take a stage checkpoint</Link>
        </div>
      </div>
      <p className={styles.storageNote}>Open a stage to see its lessons. Mark a lesson after you can explain it and solve its exercise. Checkmarks are your study log, not a certificate. Progress stays in this browser; clearing browser data removes it.</p>
      {notice && <p role="status" className={styles.notice}>{notice}</p>}
      <div className={styles.stages}>
        {curriculum.stages.map(stage => {
          const count = stage.lessons.filter(lesson => progress.completed.includes(lesson.id)).length;
          return (
            <details key={stage.id} className={styles.stage} open={stage.number === 0}>
              <summary>
                <span className={styles.stageNumber}>{String(stage.number).padStart(2, '0')}</span>
                <span className={styles.stageTitle}>
                  <span className={styles.level}>{stage.level} · {count}/{stage.lessons.length} complete</span>
                  <strong>{stage.title}</strong>
                </span>
              </summary>
              <div className={styles.stageBody}>
                <p>{stage.outcome}</p>
                <ol className={styles.lessons}>
                  {stage.lessons.map(lesson => (
                    <li key={lesson.id}>
                      <input type="checkbox" checked={progress.completed.includes(lesson.id)}
                        disabled={!ready} onChange={() => toggle(lesson.id)}
                        aria-label={'Mark complete: ' + lesson.title} />
                      <Link to={lesson.href}>{lesson.title}</Link>
                    </li>
                  ))}
                </ol>
                <p className={styles.evidence}><strong>Evidence to keep:</strong> {stage.evidence}</p>
              </div>
            </details>
          );
        })}
      </div>
      <div className={styles.studio}>
        <span className={styles.eyebrow}>YOUR PROFESSIONAL STUDIO</span>
        <h3>{role.title}</h3>
        <p>After the shared route, complete an independent project with a baseline, failure cases, measured tradeoffs, and a reproducible handoff.</p>
        <div className={styles.studioChoice}>
          <input type="checkbox" checked={progress.completed.includes(role.studio.id)} disabled={!ready}
            onChange={() => toggle(role.studio.id)} aria-label={'Mark complete: ' + role.studio.title} />
          <Link to={role.studio.href}>{role.studio.title} →</Link>
        </div>
      </div>
      <div className={styles.reset}>
        {!confirmReset ? <button type="button" disabled={!ready || progress.completed.length === 0}
          onClick={() => setConfirmReset(true)}>Reset study checkmarks</button> : <>
          <span>Clear all lesson checkmarks in this browser?</span>
          <button type="button" onClick={() => { update({ ...progress, completed: [] }); setConfirmReset(false); }}>Clear checkmarks</button>
          <button type="button" onClick={() => setConfirmReset(false)}>Keep them</button>
        </>}
      </div>
    </section>
  );
}
