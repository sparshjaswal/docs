import { useId, useState } from 'react';
import Link from '@docusaurus/Link';
import curriculum from '@site/data/ai-curriculum.json';
import styles from './styles.module.css';

export default function Checkpoint() {
  const [stageIndex, setStageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const id = useId();
  const stage = curriculum.stages[stageIndex];
  const answered = stage.questions.every((_, index) => answers[index] !== undefined);
  const score = stage.questions.filter((question, index) => answers[index] === question.answer).length;
  return (
    <section className={styles.checkpoint} aria-label="Stage knowledge checkpoint">
      <label htmlFor={id}>Choose the stage you have studied</label>
      <select id={id} value={stageIndex} onChange={event => {
        setStageIndex(Number(event.target.value));
        setAnswers({});
        setSubmitted(false);
      }}>
        {curriculum.stages.map((item, index) => <option key={item.id} value={index}>
          {item.number}. {item.title}
        </option>)}
      </select>
      <p>{stage.level} · Try both questions before checking the explanations.</p>
      {stage.questions.map((question, index) => (
        <fieldset key={stage.id + index} className={styles.question}>
          <legend>{index + 1}. {question.prompt}</legend>
          {question.choices.map((choice, choiceIndex) => (
            <label className={styles.choice} key={choice}>
              <input type="radio" name={id + '-' + index} checked={answers[index] === choiceIndex}
                onChange={() => { setAnswers({ ...answers, [index]: choiceIndex }); setSubmitted(false); }} />
              <span>{choice}</span>
            </label>
          ))}
          {submitted && <p className={styles.feedback}>
            <strong>{answers[index] === question.answer ? 'Correct. ' : 'Revisit this idea. '}</strong>
            {question.explanation} <Link to={'/ai/' + question.review}>Review the lesson →</Link>
          </p>}
        </fieldset>
      ))}
      <button type="button" disabled={!answered} onClick={() => setSubmitted(true)}>Check my reasoning</button>
      <div role="status" aria-live="polite">
        {submitted && <p><strong>{score}/{stage.questions.length} correct.</strong> These questions check selected ideas.
          Complete the exercises and project before moving on. <strong>Evidence:</strong> {stage.evidence}</p>}
      </div>
    </section>
  );
}
