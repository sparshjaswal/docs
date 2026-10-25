import type { PluginOptions } from '@docusaurus/plugin-content-docs';
import systemDesignCourse from '../data/system-design-course.json';

type SidebarItemsGenerator = PluginOptions['sidebarItemsGenerator'];
type Item = Awaited<ReturnType<SidebarItemsGenerator>>[number];

// Stages are captions in a flat list, never additional submenu categories.
const topicGroups: [string, string[]][] = [
  ['First programs', ['javascript-for-dsa.md', 'complexity.md', 'school-basics']],
  ['Represent and scan data', ['Array', 'strings', 'matrix']],
  [
    'Store useful state',
    ['hashing', 'hash-table', 'sets', 'linked-list', 'doubly-linked-list', 'stack', 'queue'],
  ],
  [
    'Reduce repeated work',
    ['sorting', 'search', 'two-pointers', 'sliding-window', 'prefix-sum', 'binary-search'],
  ],
  [
    'Explore structured state',
    [
      'recursion',
      'trees',
      'trees/binary-search-tree',
      'heap',
      'priority-queue',
      'graphs',
      'disjoint-set',
      'trie',
    ],
  ],
  [
    'Search and optimize choices',
    ['backtracking', 'greedy', 'dp', 'kadanes-algorithm', 'monotonic-stack'],
  ],
  ['Contest arithmetic and masks', ['math', 'bit-manipulation']],
  [
    'Combine advanced tools',
    [
      'dp/advanced.md',
      'trees/fenwick-tree',
      'trees/segment-tree',
      'strings/knuth-morris-pratt',
      'strings/z-algorithm',
      'lru-cache',
    ],
  ],
  [
    'Optional applications',
    [
      'statistics',
      'printing-pattern',
      'bloom-filter',
      'cryptography',
      'image-processing',
      'ml',
      'uncategorized',
    ],
  ],
];

function docId(item: Item): string | undefined {
  if (item.type === 'doc' || item.type === 'ref') return item.id;
  if (item.type === 'category') {
    if (item.link?.type === 'doc') return item.link.id;
    return item.items.map(docId).find(Boolean);
  }
  return undefined;
}

function topicCaption(label: string, index?: number): Item {
  const text = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const number =
    index === undefined
      ? ''
      : `<span class="menu-stage-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>`;
  return {
    type: 'html',
    value: `<span class="menu-topic-label">${number}${text}</span>`,
    defaultStyle: false,
  };
}

function flattenTopics(items: Item[]): Item[] {
  return items.flatMap((item): Item[] => {
    if (item.type !== 'category') return [item];
    const landing: Item[] =
      item.link?.type === 'doc'
        ? [
            {
              type: 'doc',
              id: item.link.id,
              label: item.label,
              className: item.className,
            },
          ]
        : [];
    return [...landing, ...flattenTopics(item.items)];
  });
}

function orderTopics(items: Item[], sources: Map<string, string>): Item[] {
  const seen = new Set<string>();
  const remaining = new Set(
    flattenTopics(items).filter((item) => {
      const id = docId(item);
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    }),
  );
  const take = (test: (item: Item) => boolean): Item[] => {
    const matches = [...remaining].filter(test);
    matches.forEach((item) => remaining.delete(item));
    return matches;
  };
  const result = [
    ...take((item) => docId(item) === 'DSA/index'),
    ...take((item) => docId(item) === 'DSA/roadmap-coverage'),
    ...take((item) => docId(item) === 'DSA/practice-plan'),
    ...take((item) => docId(item) === 'DSA/assessments/README'),
    ...take((item) => docId(item) === 'DSA/patterns'),
  ];
  const practiceSources = take((item) => docId(item) === 'DSA/practice-sources');
  for (const [index, [label, directories]] of topicGroups.entries()) {
    const children = directories.flatMap((directory) =>
      take((item) => {
        const source = sources.get(docId(item) ?? '') ?? '';
        return directory.endsWith('.md')
          ? source === directory
          : source.split('/').slice(0, -1).join('/') === directory && source !== 'dp/advanced.md';
      }),
    );
    if (children.length) {
      result.push(topicCaption(label, index), ...children);
    }
  }
  // Keep new topics visible at the same level until their order is configured.
  return [...result, ...remaining, ...practiceSources];
}

// Course-sized, expandable groups keep every canonical lesson discoverable.
const javaScriptGroups: [string, string[]][] = [
  [
    '1. Values, choices, and loops',
    [
      'fundamentals',
      'keyword.md',
      'operators-and-operands.md',
      'flow-of-control.md',
      'loops.md',
      'use-strict.md',
    ],
  ],
  [
    '2. Functions and useful shortcuts',
    ['functions', 'template-literals.md', 'spread-operator.md', 'destructuring.md'],
  ],
  [
    '3. Objects, lists, and text',
    [
      'objects-and-classes.md',
      'prototype-inheritance.md',
      'arrays',
      'strings-and-regular-expressions.md',
      'numbers-and-math.md',
      'collections-and-iteration.md',
    ],
  ],
  ['4. Waiting and handling errors', ['asynchronous', 'error-handling.md']],
  [
    '5. Pages and browser behavior',
    [
      'how-browsers-load-webpages.md',
      'document-object-model.md',
      'event-handling.md',
      'browser-state-and-network.md',
    ],
  ],
  [
    '6. Organize and test an application',
    [
      'import-and-export.md',
      'modular-javascript.md',
      'object-composition.md',
      'modern-js-patterns.md',
      'testing-guide.md',
      'js-best-practices.md',
      'projects.md',
      'workbook-projects.md',
      'workbook.md',
    ],
  ],
  [
    '7. Deeper language tools',
    [
      'javascript-engine-basic-unit.md',
      'language-semantics.md',
      'metaprogramming-and-memory.md',
      'symbol.md',
      'json-and-serialization.md',
      'dates-and-internationalization.md',
      'binary-data-and-shared-memory.md',
    ],
  ],
  [
    '8. Tooling and feature support',
    ['compatibility.md', 'transpilers-and-compilers.md', 'history.md', 'professional-js.md'],
  ],
  ['Quick references', ['quick-reference.md', 'quick-reference-cheatsheet.md']],
];

const javaScriptChapterOrder: Record<string, string[]> = {
  fundamentals: [
    'README.md',
    'variables-var-let-const.md',
    'types-of-identifiers.md',
    'type-casting-and-coercion.md',
    'scope.md',
    'hoisting.md',
  ],
  functions: [
    'README.md',
    'function-types.md',
    'function-lambda.md',
    'function-callback.md',
    'function-closure.md',
    'function-iife.md',
    'function-recursion.md',
    'function-memoization.md',
    'function-utilities.md',
  ],
  arrays: ['index.md', 'array-properties.md', 'array-methods.md', 'array-patterns.md'],
  asynchronous: ['README.md', 'asynchronous.md', 'promises.md', 'async-await.md'],
};

const javaScriptGroupDescriptions = [
  'Trace values, scope, conditions, and loops before combining them into larger programs.',
  'Define function inputs and outputs, then use closures, callbacks, and syntax shortcuts with clear contracts.',
  'Choose structures for records, ordered lists, lookup, and text; track which values remain shared.',
  'Trace scheduling, promises, and failures; choose concurrency, cancellation, and cleanup deliberately.',
  'Connect browser loading, DOM updates, events, storage, and requests through observable user actions.',
  'Organize modules, test boundaries, and complete a project with failure and recovery behavior.',
  'Study language semantics, engine behavior, memory, and data interchange after the core application path.',
  'Check runtime support and understand the separate jobs of compilation, transpilation, and polyfills.',
  'Use these references as recall aids; follow their links for the canonical explanation and exercises.',
];

function groupJavaScript(items: Item[], sources: Map<string, string>): Item[] {
  const source = (item: Item): string => sources.get(docId(item) ?? '') ?? '';
  const ordered = items.map((item): Item => {
    if (item.type !== 'category') return item;
    const directory = source(item).split('/')[0];
    const chapters = javaScriptChapterOrder[directory];
    if (!chapters) return item;
    const rank = (child: Item) => {
      const index = chapters.indexOf(source(child).split('/').at(-1) ?? '');
      return index < 0 ? chapters.length : index;
    };
    return {
      ...item,
      items: [...item.items].sort((a, b) => rank(a) - rank(b)),
    };
  });
  const remaining = new Set(ordered);
  const take = (path: string): Item[] => {
    const matches = [...remaining].filter(
      (item) => source(item) === path || source(item).startsWith(`${path}/`),
    );
    matches.forEach((item) => remaining.delete(item));
    return matches;
  };
  const result = [...take('index.md')];
  for (const [index, [label, paths]] of javaScriptGroups.entries()) {
    const children = paths.flatMap(take);
    if (children.length) {
      result.push({
        type: 'category',
        label,
        collapsible: true,
        collapsed: true,
        link: {
          type: 'generated-index',
          title: label,
          slug: `/javascript/chapters/${index + 1}`,
          description: javaScriptGroupDescriptions[index],
        },
        items: flattenTopics(children),
      });
    }
  }
  if (remaining.size) result.push(topicCaption('More topics'), ...flattenTopics([...remaining]));
  return result;
}

function flattenSections(items: Item[]): Item[] {
  return items.flatMap((item): Item[] => {
    if (item.type !== 'category') return [item];
    const label = item.label.replace(/[-_]/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase());
    const heading: Item[] =
      item.link?.type === 'doc'
        ? [{ type: 'doc', id: item.link.id, label: item.label }]
        : item.items.length > 1
          ? [topicCaption(label)]
          : [];
    return [...heading, ...flattenSections(item.items)];
  });
}

// The course catalog is shared with the homepage and validation.
const systemDesignGroups: [string, string[]][] = systemDesignCourse.map((group) => [
  group.label,
  group.items.map((item) => item.file),
]);

function groupSystemDesign(items: Item[], sources: Map<string, string>): Item[] {
  const bySource = new Map(
    flattenTopics(items).map((item) => [sources.get(docId(item) ?? ''), item]),
  );
  const result = systemDesignGroups.flatMap(([label, paths]) => {
    const children = paths.flatMap((path) => {
      const item = bySource.get(path);
      bySource.delete(path);
      return item ? [item] : [];
    });
    return children.length ? [topicCaption(label), ...children] : [];
  });
  return [...result, ...bySource.values()];
}

export const generateSidebarItems: SidebarItemsGenerator = async (args) => {
  const titles = new Map(args.docs.map((doc) => [doc.id, doc.title]));
  const dsaSources = new Map(
    args.docs.map((doc) => [doc.id, doc.source.replace(/^@site\/docs\/DSA\//, '')]),
  );
  const javaScriptSources = new Map(
    args.docs.map((doc) => [doc.id, doc.source.replace(/^@site\/docs\/javascript\//, '')]),
  );
  const clean = (items: Item[]): Item[] =>
    items.flatMap((item): Item[] => {
      const id =
        item.type === 'doc' || item.type === 'ref'
          ? item.id
          : item.type === 'category' && item.link?.type === 'doc'
            ? item.link.id
            : undefined;
      if (item.type === 'html' || item.type === 'autogenerated') return [item];
      const original = item.label ?? (id ? titles.get(id) : undefined) ?? '';
      const label = original.replace(/^[^\p{L}\p{N}]+/u, '');
      if (item.type !== 'category') return [{ ...item, label }];
      const children = clean(item.items);
      if (!children.length && item.link?.type === 'doc')
        return [{ type: 'doc', id: item.link.id, label, className: item.className }];
      if (!children.length) return [];
      return [{ ...item, label, items: children }];
    });

  const items = clean(await args.defaultSidebarItemsGenerator(args));
  if (args.item.dirName !== '.') return items;
  const remaining = new Set(items);
  const take = (directory: string): Item[] => {
    const matches = [...remaining].filter((item) => docId(item)?.split('/')[0] === directory);
    matches.forEach((item) => remaining.delete(item));
    return matches;
  };
  const section = (label: string): Item => ({
    type: 'html',
    value: `<span class="menu-section-label">${label}</span>`,
    defaultStyle: false,
  });
  const dsa = take('DSA').map((item): Item =>
    item.type === 'category'
      ? {
          ...item,
          label: 'Data structures & algorithms',
          items: orderTopics(item.items, dsaSources),
        }
      : item,
  );
  const javaScript = take('javascript').map((item): Item =>
    item.type === 'category'
      ? { ...item, items: groupJavaScript(item.items, javaScriptSources) }
      : item,
  );
  const functionalOrder = [
    'index.md',
    'pure-function-and-side-effect/getting-started.md',
    'function-and-composition/getting-started.md',
    'referential-programming/getting-started.md',
    'functor-functions/getting-started.md',
    'monads/getting-started.md',
  ];
  const functionalSources = new Map(
    args.docs.map((doc) => [
      doc.id,
      doc.source.replace(/^@site\/docs\/functional-programming\//, ''),
    ]),
  );
  const rankFunctional = (item: Item): number => {
    const index = functionalOrder.indexOf(functionalSources.get(docId(item) ?? '') ?? '');
    return index < 0 ? functionalOrder.length : index;
  };
  const functional = take('functional-programming').map((item): Item =>
    item.type === 'category'
      ? {
          ...item,
          items: flattenTopics(item.items).sort((a, b) => rankFunctional(a) - rankFunctional(b)),
        }
      : item,
  );
  const navigation: Item[] = [
    ...take('index'),
    section('Learn artificial intelligence'),
    ...take('ai'),
    section('Programming foundations'),
    ...take('pseudocode'),
    ...javaScript,
    ...dsa,
    section('Build an application'),
    ...take('frontend-engineering'),
    ...take('system-design').map((item): Item =>
      item.type === 'category'
        ? {
            ...item,
            items: groupSystemDesign(
              item.items,
              new Map(
                args.docs.map((doc) => [
                  doc.id,
                  doc.source.replace(/^@site\/docs\/system-design\//, ''),
                ]),
              ),
            ),
          }
        : item,
    ),
    section('Improve the design'),
    ...take('design-pattern'),
    ...take('solid-design-principles'),
    ...functional,
    section('Deploy and explore'),
    ...take('Cloud Providers'),
    ...remaining,
  ];
  return navigation.map((item): Item =>
    item.type === 'category' &&
    !['ai', 'javascript', 'design-pattern'].includes(docId(item)?.split('/')[0] ?? '')
      ? { ...item, items: flattenSections(item.items) }
      : item,
  );
};
