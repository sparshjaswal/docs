import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const SITE_URL = 'https://sparshjaswal.github.io';
const BASE_URL = '/docs/';

const config: Config = {
  title: 'Learning Portal',
  tagline: 'Learn by Reading, Coding, and Testing',
  favicon: 'img/logo.ico',
  future: {
    v4: true,
    faster: true,
  },
  url: SITE_URL,
  baseUrl: BASE_URL,
  trailingSlash: false,
  onBrokenLinks: 'ignore',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'ignore',
    },
  },
  // GitHub pages deployment config
  organizationName: 'sparshjaswal', // GitHub org/user
  projectName: 'docs', // Repository name must match the actual repo
  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // serve docs at root path instead of /docs
          showLastUpdateTime: true,
          // Hide LC-, P-, CC- prefixed items only in sidebar (routes still work)
          /* eslint-disable @typescript-eslint/no-explicit-any */
          sidebarItemsGenerator: async function (args: any) {
            const items = await args.defaultSidebarItemsGenerator(args);

            const HIDE_PREFIXES = ['LC', 'P', 'CC'] as const;

            const hasHiddenPrefix = (value?: string): boolean =>
              typeof value === 'string' &&
              HIDE_PREFIXES.some((p) => new RegExp(`^${p}(?:\\s|-)`).test(value));

            const processItems = (list: any[]): any[] => {
              const result: any[] = [];

              for (const item of list ?? []) {
                if (!item) continue;

                if (item.type === 'category') {
                  const label = String(item.label ?? item.id ?? '');

                  // recursively process children first
                  const children = processItems(item.items ?? []);

                  if (hasHiddenPrefix(label)) {
                    // 🔥 Flatten ONLY this level
                    result.push(...children);
                  } else {
                    // ✅ ALWAYS keep parent (like dsa/topics)
                    result.push({
                      ...item,
                      items: children,
                    });
                  }
                } else {
                  result.push(item);
                }
              }

              return result;
            };

            return processItems(items);
          } as unknown as any,
          /* eslint-enable @typescript-eslint/no-explicit-any */
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Lightweight client modules (runs in browser)

  clientModules: [
    require.resolve('./src/clientModules/themeToggle.ts'),
    require.resolve('./src/clientModules/sidebarEnhancements.ts'),
  ],

  // Local plugins temporarily disabled to unblock dev server; re-enable after converting to JS or proper resolution
  plugins: [],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    metadata: [
      {
        name: 'keywords',
        content: 'dsa, algorithms, data structures, javascript, learning portal, coding interview',
      },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Learning Portal' },
      { property: 'og:description', content: 'Learn by Reading, Coding, and Testing' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    navbar: {
      title: 'Learning Portal',
      items: [
        { label: 'Home', href: SITE_URL, position: 'left' },
      ],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      },
    },
    footer: {
      copyright: `© <a href="${SITE_URL}${BASE_URL}" target="_self" rel="noopener">sparshjaswal</a>`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
