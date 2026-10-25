import { useState } from 'react';
import OriginalImage from '@theme-original/MDXComponents/Img';
import type { Props } from '@theme/MDXComponents/Img';
import styles from './styles.module.css';

export default function LessonImage(props: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = props.src ?? '';
  const animated = /\.gif(?:[?#]|$)|-anim\.svg(?:[?#]|$)/i.test(source);
  const formula = source.includes('/media/math/') || source.includes('/math/render/');
  // Formulas can appear in the middle of a sentence. Keep their inline layout.
  if (!props.alt) return <OriginalImage {...props} />;
  if (formula) return (
    <a href={source} target="_blank" rel="noopener noreferrer" aria-label={`Open formula at full size: ${props.alt}`}>
      <OriginalImage {...props} />
    </a>
  );

  return (
    <span className={styles.figure}>
      {(!animated || loaded) && !failed ? (
        <a className={styles.imageLink} href={source} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${props.alt}`}>
          <OriginalImage {...props} onError={() => setFailed(true)} />
        </a>
      ) : (
        <span className={styles.placeholder}>{failed ? 'This image could not load. The description is below.' : 'Animation · start when you are ready'}</span>
      )}
      <span className={styles.caption}>{props.alt}</span>
      <span className={styles.actions}>
        {animated && !failed && <button type="button" onClick={() => setLoaded(!loaded)}>{loaded ? 'Hide animation' : 'Play animation'}</button>}
        <a href={source} target="_blank" rel="noopener noreferrer">{failed ? 'Open image source' : 'Open full-size image'} <span aria-hidden="true">↗</span></a>
      </span>
    </span>
  );
}
