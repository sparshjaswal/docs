import { useId, useState } from 'react';
import OriginalMermaid from '@theme-original/Mermaid';
import type { Props } from '@theme/Mermaid';
import styles from './styles.module.css';

export default function Mermaid(props: Props) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const readingHint = props.value.startsWith('sequenceDiagram')
    ? 'Read the messages from top to bottom.'
    : props.value.startsWith('gantt')
      ? 'Read time from left to right.'
      : 'Follow the arrows to read the flow.';
  return (
    <div className={styles.figure}>
      <div className={styles.toolbar}>
        <span>{readingHint}</span>
        <button type="button" aria-pressed={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Fit to page' : 'Enlarge diagram'}
        </button>
      </div>
      <div id={id} className={`${styles.viewport} ${expanded ? styles.expanded : ''}`} tabIndex={0} role="region" aria-label="Diagram; scroll horizontally when enlarged">
        <OriginalMermaid {...props} />
      </div>
    </div>
  );
}
