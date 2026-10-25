import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';

/** The full imported statement stays beside its exercise, including constraints. */
export default function PracticeProblem({
  id,
  title,
  text,
}: {
  id: number;
  title: string;
  text: string;
}) {
  const [description, starter] = text.split('\nJavaScript starter\n');
  const sections = description.split(
    /^(Problem statement(?: & expected result)?|Input & expected result|EXAMPLE \d+|Constraints & guarantees)\n/gm,
  );
  return (
    <details className={styles.problem} id={`lc-${id}`}>
      <summary>
        LC {id} — {title}
      </summary>
      <div className={styles.body}>
        {sections.map((part, index) => {
          if (!part.trim()) return null;
          if (index % 2 === 1)
            return (
              <p className={styles.heading} key={index}>
                {part}
              </p>
            );
          return (
            <p className={styles.description} key={index}>
              {part.trim()}
            </p>
          );
        })}
        {starter && (
          <>
            <p className={styles.heading}>JavaScript starter</p>
            <p>
              Fill in the function after tracing the examples. This is an exercise, not a finished
              solution.
            </p>
            <CodeBlock language="javascript">{starter.trim()}</CodeBlock>
          </>
        )}
      </div>
    </details>
  );
}
