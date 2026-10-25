import { useEffect, useId, useState } from 'react';
import { walkthroughs, type WalkthroughName } from './walkthroughs';
import styles from './styles.module.css';

type WalkthroughStep = (typeof walkthroughs)[WalkthroughName]['steps'][number];

const stateLabels = { plain: '', active: 'Focus', done: 'Completed', muted: 'Set aside' };

function StepDiagram({ step, index, total }: { step: WalkthroughStep; index: number; total: number }) {
  return (
    <>
      <h4 className={styles.progress}>Step {index + 1} of {total} · {step.title}</h4>
      {step.rows.map((row, rowIndex) => (
        <div className={styles.row} key={rowIndex}>
          <span className={styles.rowLabel}>{row.label}</span>
          <ol className={styles.cells} aria-label={row.label}>
            {row.cells.map((cell, cellIndex) => {
              const tone = cell.tone ?? 'plain';
              return (
                <li className={`${styles.cell} ${styles[tone]}`} key={cellIndex}>
                  {stateLabels[tone] && <span className={styles.stateLabel}>{stateLabels[tone]}</span>}
                  <span className={styles.value}>{cell.value}</span>
                  {cell.note && <span className={styles.note}>{cell.note}</span>}
                </li>
              );
            })}
          </ol>
        </div>
      ))}
      <p className={styles.explanation}>{step.explanation}</p>
      <p className={styles.reason}><strong>Why this step works:</strong> {step.reason}</p>
    </>
  );
}

export default function AlgorithmWalkthrough({ name }: { name: WalkthroughName }) {
  const example = walkthroughs[name];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const headingId = useId();
  const transcriptId = useId();
  const step = example.steps[index];
  const last = index === example.steps.length - 1;

  useEffect(() => {
    if (!playing || last) return;
    const timer = window.setInterval(() => {
      setIndex((current) => {
        if (current >= example.steps.length - 1) return current;
        return current + 1;
      });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [playing, last, example.steps.length]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => setPlaying(false);
    preference.addEventListener('change', stop);
    return () => preference.removeEventListener('change', stop);
  }, []);

  function move(next: number) {
    setPlaying(false);
    setIndex(next);
  }

  return (
    <section className={styles.walkthrough} aria-labelledby={headingId}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Learn one step at a time</span>
        <h3 id={headingId}>{example.title}</h3>
        <p>{example.goal}</p>
      </div>
      {example.setup && <p className={styles.setup}>{example.setup}</p>}
      <div className={styles.stage} aria-live={playing && !last ? 'off' : 'polite'} aria-atomic="true">
        <StepDiagram step={step} index={index} total={example.steps.length} />
      </div>
      <div className={styles.controls} role="group" aria-label={`${example.title} controls`}>
        <button type="button" disabled={index === 0} onClick={() => move(index - 1)}>Previous</button>
        <button type="button" disabled={last} onClick={() => move(index + 1)}>Next step</button>
        <button type="button" onClick={() => {
          if (last) { setIndex(0); setPlaying(true); }
          else setPlaying(!playing);
        }}>{playing && !last ? 'Pause' : last ? 'Replay' : 'Play'}</button>
        <button type="button" disabled={index === 0 && !playing} onClick={() => move(0)}>Reset</button>
      </div>
      <div className={styles.transcript}>
        <button
          className={styles.transcriptToggle}
          type="button"
          aria-expanded={showAllSteps}
          aria-controls={transcriptId}
          onClick={() => setShowAllSteps(!showAllSteps)}
        >
          {showAllSteps ? 'Hide all steps' : 'Read all steps with diagrams'}
        </button>
        <p className={styles.printNote}>Printing includes every step and its diagram.</p>
        <div id={transcriptId} className={styles.transcriptContent} data-expanded={showAllSteps}>
          {example.steps.map((item, itemIndex) => (
            <section className={styles.transcriptStep} key={itemIndex}>
              <StepDiagram step={item} index={itemIndex} total={example.steps.length} />
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
