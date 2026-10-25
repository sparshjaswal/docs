import type { LoadContext, Plugin } from '@docusaurus/types';
import systemDesignRedirects from './system-design-redirects.json';

// Open the first learning track at home and preserve consolidated documentation links.
export const redirects: Record<string, string> = {
  '/': '/ai/orientation',
  '/ai': '/ai/orientation',
  '/ai/start/what-you-are-building': '/ai/orientation',
  '/ai/start/your-first-program': '/ai/foundations/computers-and-setup',
  '/ai/start/python-for-bots': '/ai/foundations/control-and-functions',
  '/ai/start/data-and-state': '/ai/foundations/collections-and-files',
  '/ai/start/first-bot': '/ai/bots/build-a-chatbot',
  '/ai/foundations/math': '/ai/mathematics/vectors-and-matrices',
  '/ai/foundations/data': '/ai/machine-learning/data-and-features',
  '/ai/foundations/machine-learning': '/ai/machine-learning/problem-framing',
  '/ai/foundations/neural-networks': '/ai/deep-learning/neural-networks',
  '/ai/foundations/text-and-attention': '/ai/deep-learning/sequences-and-attention',
  '/ai/models/language-models': '/ai/generative-ai/language-models',
  '/ai/models/model-adapters': '/ai/agents/build-a-model-agent',
  '/ai/models/prompts': '/ai/generative-ai/prompts-and-structured-output',
  '/ai/models/retrieval': '/ai/rag/retrieval-basics',
  '/ai/models/adaptation': '/ai/generative-ai/adaptation-and-fine-tuning',
  '/ai/build/tools': '/ai/agents/tools-and-workflows',
  '/ai/build/controller': '/ai/agents/agent-loop-and-state',
  '/ai/build/memory': '/ai/agents/agent-loop-and-state',
  '/ai/build/actions': '/ai/agents/durable-workflows',
  '/ai/build/workshop': '/ai/agents/build-a-model-agent',
  '/ai/ship/evaluation': '/ai/engineering/evaluation-and-monitoring',
  '/ai/ship/security': '/ai/engineering/security-and-governance',
  '/ai/ship/web-applications': '/ai/bots/build-a-chatbot',
  '/ai/ship/channels': '/ai/bots/connect-messaging-channels',
  '/ai/ship/production': '/ai/engineering/serving-and-apis',
  '/ai/specialize/browser-and-coding': '/ai/agents/agent-integrations',
  '/ai/specialize/voice-and-multimodal': '/ai/generative-ai/multimodal-generation',
  '/ai/specialize/multiple-agents': '/ai/agents/multiple-agents',
  '/ai/specialize/scale-and-research': '/ai/research/training-at-scale',
  '/ai/specialize/capstone': '/ai/careers',
  '/ai/study-plans': '/ai/developer-roadmap/study-plans',
  '/ai/resources': '/ai/developer-roadmap',
  '/category/dsa': '/DSA',
  '/design-pattern/study-guide': '/design-pattern',
  '/DSA/trees/depth-first-search/README': '/DSA/graphs/depth-first-search/README',
  '/DSA/trees/breadth-first-search/README': '/DSA/graphs/breadth-first-search/README',
  ...Object.fromEntries(
    ['backtracking', 'dp', 'greedy', 'recursion', 'search', 'sorting'].map((topic) => [
      `/DSA/${topic}/algorithms-overview`,
      `/DSA/${topic}/README`,
    ]),
  ),
};

export default function legacyDocRedirects({ siteConfig }: LoadContext): Plugin {
  return {
    name: 'legacy-doc-redirects',
    contentLoaded({ actions }) {
      const entries = [
        ...Object.entries(redirects).map(([from, to]) => [from, { to }] as const),
        ...Object.entries(systemDesignRedirects),
      ];
      for (const [from, props] of entries) {
        actions.addRoute({
          path: `${siteConfig.baseUrl}${from.slice(1)}`,
          component: '@site/src/components/DocRedirect.tsx',
          props,
          exact: true,
        });
      }
    },
  };
}
