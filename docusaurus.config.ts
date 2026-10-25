import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { spawnSync } from 'node:child_process';
import { generateSidebarItems } from './scripts/sidebar-navigation';
import legacyDocRedirects from './scripts/legacy-doc-redirects';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const SITE_URL = 'https://sparshjaswal.github.io';
const BASE_URL = '/docs/';
const hasGitHistory =
  spawnSync('git', ['rev-parse', '--is-inside-work-tree'], {
    cwd: __dirname,
    encoding: 'utf8',
  }).stdout?.trim() === 'true';

const config: Config = {
  title: 'AI Learning Portal',
  tagline: 'From your first program to reliable AI systems.',
  favicon: 'img/logo.ico',
  future: {
    v4: true,
    faster: {
      // Rspack 1.7.12 + html-webpack-plugin 5.6.7 fails to evaluate the dev
      // HTML template. Use Webpack for start; keep Rspack for production builds.
      // The other Faster options remain enabled by v4.fasterByDefault.
      rspackBundler: process.env.NODE_ENV === 'production',
      rspackPersistentCache: process.env.NODE_ENV === 'production',
    },
  },
  url: SITE_URL,
  baseUrl: BASE_URL,
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw',
    },
  },
  // GitHub pages deployment config
  organizationName: 'sparshjaswal', // GitHub org/user
  projectName: 'docs', // Repository name must match the actual repo
  i18n: { defaultLocale: 'en', locales: ['en'] },
  plugins: [legacyDocRedirects],
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // serve docs at root path instead of /docs
          showLastUpdateTime: hasGitHistory,
          sidebarItemsGenerator: generateSidebarItems,
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

  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content: 'AI curriculum, Python, machine learning, deep learning, LLM, RAG, AI agents, AI engineering',
      },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'AI Learning Portal' },
      { property: 'og:description', content: 'A guided AI curriculum with worked examples, visual explanations, and practical projects.' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    navbar: {
      title: 'AI Learning Portal',
      items: [
        { label: 'Learning paths', to: '/learning-paths', position: 'left' },
        {
          label: 'AI in depth',
          to: '/ai/orientation',
          activeBaseRegex: `${BASE_URL}ai(?:/|$)`,
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Supporting tracks',
          position: 'left',
          items: [
            { label: 'Pseudocode: step by step', to: '/pseudocode' },
            {
              label: 'JavaScript',
              to: '/javascript',
              activeBaseRegex: `${BASE_URL}(javascript(?:/|$)|category/javascript$)`,
            },
            {
              label: 'Data structures & algorithms',
              to: '/DSA',
              activeBaseRegex: `${BASE_URL}(DSA(?:/|$)|category/dsa$)`,
            },
            { label: 'Frontend engineering', to: '/frontend-engineering' },
            { label: 'System design', to: '/system-design' },
            { label: 'Design patterns', to: '/design-pattern' },
            { label: 'SOLID principles', to: '/solid-design-principles' },
            { label: 'Functional programming', to: '/functional-programming' },
            { label: 'Cloud engineering', to: '/cloud-engineering' },
          ],
        },
        { label: 'Portfolio', href: SITE_URL, position: 'right' },
      ],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
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
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
