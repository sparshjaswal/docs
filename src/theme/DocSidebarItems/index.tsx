import { useEffect, useMemo, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import OriginalSidebarItems from '@theme-original/DocSidebarItems';
import type { Props } from '@theme/DocSidebarItems';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';

type Topic = {
  item: Exclude<PropSidebarItem, { type: 'html' }>;
  href: string;
  context: string;
};

function collectTopics(items: readonly PropSidebarItem[], parents: string[] = []): Topic[] {
  return items.flatMap((item): Topic[] => {
    if (item.type === 'html') return [];
    const hidden = item.type === 'category' ? item.linkUnlisted : item.unlisted;
    const topic: Topic[] =
      item.href && !hidden ? [{ item, href: item.href, context: parents.join(' / ') }] : [];
    return item.type === 'category'
      ? [...topic, ...collectTopics(item.items, [...parents, item.label])]
      : topic;
  });
}

function SearchableSidebar(props: Props) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const topics = useMemo(() => {
    const seen = new Set<string>();
    return collectTopics(props.items).filter(({ href }) => {
      if (seen.has(href)) return false;
      seen.add(href);
      return true;
    });
  }, [props.items]);
  const results = topics.filter(({ item, context, href }) => {
    const text = `${item.label} ${context} ${href}`.toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });

  useEffect(() => setQuery(''), [props.activePath]);

  return (
    <>
      <li className="sidebar-tools">
        <div className="sidebar-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            ref={input}
            type="search"
            placeholder="Find a topic…"
            aria-label="Find a topic"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault();
                event.stopPropagation();
                setQuery('');
              }
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear topic search"
              onClick={() => {
                setQuery('');
                input.current?.focus();
              }}
            >
              ×
            </button>
          )}
        </div>
        {terms.length > 0 && (
          <p className="sidebar-search-status" role="status">
            {results.length === 0
              ? 'No topics found. Try another term.'
              : `${results.length} ${results.length === 1 ? 'topic' : 'topics'} found`}
          </p>
        )}
      </li>
      {terms.length > 0 ? (
        results.map(({ item, href, context }) => (
          <li key={href} className="menu__list-item sidebar-search-result">
            <Link
              className="menu__link"
              to={href}
              autoAddBaseUrl={false}
              aria-current={
                href.replace(/\/$/, '') === props.activePath.replace(/\/$/, '') ? 'page' : undefined
              }
              onClick={() => {
                setQuery('');
                props.onItemClick?.(item);
              }}
            >
              <span>{item.label}</span>
              {context && <small>{context}</small>}
            </Link>
          </li>
        ))
      ) : (
        <OriginalSidebarItems {...props} />
      )}
    </>
  );
}

export default function DocSidebarItems(props: Props) {
  return props.level === 1 ? <SearchableSidebar {...props} /> : <OriginalSidebarItems {...props} />;
}
