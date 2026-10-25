import type { MouseEventHandler } from 'react';
import styles from './styles.module.css';

type Props = {
  expanded: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function SidebarToggle({ expanded, onClick }: Props) {
  const label = expanded ? 'Hide sidebar' : 'Show sidebar';

  return (
    <div className={expanded ? styles.footer : styles.restore}>
      <button
        type="button"
        className={styles.button}
        aria-label={label}
        aria-expanded={expanded}
        title={label}
        onClick={onClick}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 3v18" />
          <path d={expanded ? 'm16 9-3 3 3 3' : 'm13 9 3 3-3 3'} />
        </svg>
        {expanded && <span>{label}</span>}
      </button>
    </div>
  );
}
